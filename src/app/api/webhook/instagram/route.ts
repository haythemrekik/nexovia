import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { generateResponse } from '@/lib/ai'
import { sendInstagramMessage } from '@/lib/meta'
import type { Message } from '@/lib/supabase/types'

// ==========================================
// GET : Vérification du Webhook par Meta
// ==========================================
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'nexovia_secure_token_123'

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }

  return new NextResponse('Forbidden', { status: 403 })
}

// ==========================================
// POST : Réception des messages Instagram
// ==========================================
export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (body.object !== 'instagram') {
      return new NextResponse('Not Found', { status: 404 })
    }

    // Un webhook peut contenir plusieurs "entrées"
    for (const entry of body.entry) {
      const accountId = entry.id // L'ID Instagram du Business
      
      for (const event of entry.messaging) {
        if (event.message && !event.message.is_echo) {
          const senderId = event.sender.id // L'ID Instagram du prospect
          const text = event.message.text

          await processIncomingMessage(accountId, senderId, text)
        }
      }
    }

    return new NextResponse('EVENT_RECEIVED', { status: 200 })
  } catch (error) {
    console.error('Erreur Webhook POST:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// ==========================================
// Logique de traitement principal
// ==========================================
async function processIncomingMessage(accountId: string, senderId: string, text: string) {
  const supabase = await createServiceRoleClient()

  // 1. Trouver le Business correspondant à ce compte Instagram
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('instagram_id', accountId)
    .single()

  if (!business || !business.meta_page_access_token) {
    console.warn('Business non trouvé ou Access Token manquant pour accountId:', accountId)
    return
  }

  // 2. Trouver ou créer le Lead (Prospect)
  let { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('instagram_user_id', senderId)
    .eq('business_id', business.id)
    .single()

  if (!lead) {
    const { data: newLead } = await supabase
      .from('leads')
      .insert({
        business_id: business.id,
        instagram_user_id: senderId,
        source: 'instagram',
        lead_status: 'new'
      })
      .select()
      .single()
    lead = newLead
  }

  // 3. Trouver la conversation active ou en créer une
  let { data: conversation } = await supabase
    .from('conversations')
    .select('*')
    .eq('lead_id', lead!.id)
    .eq('is_resolved', false)
    .single()

  if (!conversation) {
    const { data: newConv } = await supabase
      .from('conversations')
      .insert({
        business_id: business.id,
        lead_id: lead!.id,
        platform: 'instagram',
        messages: []
      })
      .select()
      .single()
    conversation = newConv
  }

  // Si la conversation nécessite un humain, le bot ne répond pas
  if (conversation!.needs_human) {
    // On ajoute juste le message du client à l'historique
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text, timestamp: new Date().toISOString(), platform: 'instagram' }
    await supabase.from('conversations').update({
      messages: [...(conversation!.messages as any[]), userMsg],
      updated_at: new Date().toISOString()
    }).eq('id', conversation!.id)
    return
  }

  // 4. Ajouter le message de l'utilisateur à l'historique
  const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text, timestamp: new Date().toISOString(), platform: 'instagram' }
  let currentMessages = [...(conversation!.messages as any[]), userMsg]

  // Limiter l'historique à envoyer à l'IA (ex: 10 derniers messages)
  const historyForAi = currentMessages.slice(-10).map(m => ({ role: m.role, content: m.content }))

  // 5. Générer la réponse avec l'IA (Groq / LLaMA 3)
  const systemPrompt = business.system_prompt || "Tu es un assistant virtuel. Réponds de façon concise."
  const aiResponseText = await generateResponse(systemPrompt, historyForAi as any)

  // 6. Envoyer la réponse via Meta Graph API
  const sent = await sendInstagramMessage(senderId, aiResponseText, business.meta_page_access_token)

  // 7. Sauvegarder la réponse de l'IA dans l'historique
  if (sent) {
    const aiMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: aiResponseText, timestamp: new Date().toISOString(), platform: 'instagram' }
    currentMessages.push(aiMsg)

    await supabase.from('conversations').update({
      messages: currentMessages,
      updated_at: new Date().toISOString()
    }).eq('id', conversation!.id)
  }
}
