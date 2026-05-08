import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Cette API est appelée après le login pour synchroniser
// le profil avec un éventuel business (contact_email match)
export async function POST(request: NextRequest) {
  const cookieStore = await cookies()

  // Client normal (avec RLS) pour lire l'utilisateur
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  // Service role pour bypasser RLS et faire le lien
  const { createClient } = await import('@supabase/supabase-js')
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // 1. Récupérer le profil actuel
  const { data: profile } = await admin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })
  }

  // 2. Si déjà lié à un business, retourner directement
  if (profile.business_id) {
    return NextResponse.json({
      role: profile.role,
      business_id: profile.business_id,
      redirect: `/dashboard/client/${profile.business_id}`,
    })
  }

  // 3. Chercher un business correspondant au contact_email
  const { data: business } = await admin
    .from('businesses')
    .select('id, name, status')
    .ilike('contact_email', user.email!)
    .single()

  if (business) {
    // Lier le profil au business
    await admin
      .from('profiles')
      .update({ business_id: business.id, role: 'client', updated_at: new Date().toISOString() })
      .eq('id', user.id)

    return NextResponse.json({
      role: 'client',
      business_id: business.id,
      redirect: `/dashboard/client/${business.id}`,
    })
  }

  // 4. Pas de business trouvé — profil admin ou non lié
  return NextResponse.json({
    role: profile.role,
    business_id: null,
    redirect: '/dashboard',
  })
}
