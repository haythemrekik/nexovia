'use client'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Zap, Users, TrendingUp, MessageCircle, AtSign, Bot, Shield, Star, ChevronDown, ChevronUp, Check } from 'lucide-react'

const stats = [
  { value: '+340%', label: 'Rendez-vous générés' },
  { value: '0', label: 'Message perdu' },
  { value: '24/7', label: 'Disponibilité bot' },
  { value: '<2s', label: 'Temps de réponse' },
]

const offers = [
  {
    name: 'Starter',
    price: '490',
    setup: '500',
    desc: 'Pour débuter l\'automatisation',
    features: ['Réponses automatiques Instagram', 'FAQ automatiques (5 questions)', 'Optimisation profil WhatsApp', '8 posts/mois planifiés', 'Calendrier marketing mensuel', 'Support email'],
    color: 'var(--color-border)',
    featured: false,
  },
  {
    name: 'Growth',
    price: '990',
    setup: '1200',
    desc: 'Le choix des cliniques ambitieuses',
    features: ['Tout Starter +', 'Chatbot Instagram avancé', 'Qualification leads automatique', 'Transfert WhatsApp intelligent', 'Génération contenu IA', 'Relances automatiques', 'Dashboard leads', 'Support prioritaire'],
    color: 'rgba(201, 169, 110, 0.4)',
    featured: true,
  },
  {
    name: 'Premium',
    price: '2000',
    setup: '2500',
    desc: 'Système complet orienté croissance',
    features: ['Tout Growth +', 'CRM intégré', 'Dashboard KPIs avancé', 'Automatisations personnalisées', 'Suivi conversion détaillé', 'IA avancée sur mesure', 'Workflows personnalisés', 'Account manager dédié'],
    color: 'rgba(201, 169, 110, 0.2)',
    featured: false,
  },
]

const faqs = [
  { q: "Est-ce que mes clients sauront qu'ils parlent à un bot ?", a: "Non. Le système est configuré pour répondre de manière naturelle et élégante, en ligne avec l'image de votre établissement. La majorité de vos clients ne feront pas la différence." },
  { q: "Combien de temps pour mettre en place le système ?", a: "La mise en place initiale prend entre 3 et 7 jours. Nous configurons tout pour vous : connexion Instagram, prompts personnalisés, FAQ, tests." },
  { q: "Que se passe-t-il si le bot ne sait pas répondre ?", a: "Le système détecte automatiquement les questions complexes et vous notifie pour une reprise humaine. Vous gardez le contrôle total à tout moment." },
  { q: "Puis-je modifier les réponses automatiques ?", a: "Oui, depuis votre dashboard client vous pouvez modifier la FAQ, les messages types et le ton du bot en temps réel, sans aucune compétence technique." },
  { q: "Y a-t-il un engagement de durée ?", a: "Engagement de 3 mois minimum pour amortir le setup. Ensuite, résiliation possible avec 30 jours de préavis." },
]

const results = [
  { icon: MessageCircle, title: 'Zéro message ignoré', desc: 'Chaque demande Instagram reçoit une réponse instantanée, même à 23h.' },
  { icon: Users, title: 'Leads qualifiés automatiquement', desc: 'Le bot identifie les prospects sérieux et collecte leurs coordonnées.' },
  { icon: TrendingUp, title: 'Plus de rendez-vous', desc: 'Conversion directe depuis Instagram vers votre agenda ou WhatsApp.' },
  { icon: Zap, title: 'Gain de temps massif', desc: 'Vos équipes se concentrent sur les soins, pas sur les DMs.' },
  { icon: Shield, title: 'Image premium préservée', desc: 'Réponses élégantes et personnalisées à votre charte de communication.' },
  { icon: Bot, title: 'Système 100% discret', desc: 'Aucune installation côté client. Tout est géré depuis notre plateforme.' },
]

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, borderBottom: '1px solid var(--color-border)', backdropFilter: 'blur(20px)', background: 'rgba(8,8,16,0.8)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--color-gold)' }}>
            NEXOVIA
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <a href="#offres" style={{ color: 'var(--color-text-muted)', fontSize: 14, textDecoration: 'none', padding: '8px 16px' }}>Offres</a>
            <a href="#resultats" style={{ color: 'var(--color-text-muted)', fontSize: 14, textDecoration: 'none', padding: '8px 16px' }}>Résultats</a>
            <Link href="/dashboard" className="btn btn-gold btn-sm">
              Dashboard →
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 160, paddingBottom: 120, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-glow" style={{ top: -200, left: '50%', transform: 'translateX(-50%)' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px', position: 'relative' }}>
          <div className="badge badge-gold animate-fade-in" style={{ marginBottom: 24, display: 'inline-flex' }}>
            <AtSign size={12} />
            Automatisation IA pour l&apos;esthétique premium
          </div>

          <h1 className="animate-fade-in-up" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
            Transformez votre{' '}
            <span className="text-gradient-gold">Instagram</span>
            <br />en machine à rendez-vous
          </h1>

          <p className="animate-fade-in-up delay-200" style={{ fontSize: 18, color: 'var(--color-text-muted)', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Système d&apos;automatisation IA pour instituts de beauté, médecine esthétique et spas haut de gamme. Zéro message perdu. Plus de conversions.
          </p>

          <div className="animate-fade-in-up delay-300" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#offres" className="btn btn-gold btn-lg">
              Voir les offres <ArrowRight size={18} />
            </a>
            <Link href="/dashboard" className="btn btn-outline btn-lg">
              Accéder au dashboard
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ maxWidth: 900, margin: '80px auto 0', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--color-border)' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: 'var(--color-surface)', padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--color-gold)', marginBottom: 8 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider-gold" style={{ maxWidth: 1200, margin: '0 auto' }} />

      {/* RÉSULTATS */}
      <section id="resultats" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 16 }}>Ce que vous obtenez</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700 }}>
            Un système qui travaille<br />pendant que vous soignez
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {results.map((r, i) => (
            <div key={i} className="card" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <r.icon size={20} color="var(--color-gold)" />
              </div>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: 6, fontSize: 15 }}>{r.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OFFRES */}
      <section id="offres" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 16 }}>Nos offres</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700 }}>
            Choisissez votre niveau<br />d&apos;automatisation
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 16 }}>Setup unique + abonnement mensuel. Sans engagement après 3 mois.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'start' }}>
          {offers.map((o, i) => (
            <div key={i} className={`pricing-card${o.featured ? ' featured' : ''}`}>
              {o.featured && (
                <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', color: '#0a0a12', fontSize: 11, fontWeight: 700, padding: '4px 20px', borderRadius: '0 0 12px 12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Le plus populaire
                </div>
              )}
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{o.name}</span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 700 }}>{o.price}</span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: 14 }}> DT/mois</span>
              </div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 24 }}>
                Setup : {o.setup} DT (unique) · {o.desc}
              </div>
              <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 24 }} />
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {o.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14 }}>
                    <Check size={16} color="var(--color-gold)" style={{ flexShrink: 0, marginTop: 2 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="mailto:contact@nexovia.tn" className={`btn ${o.featured ? 'btn-gold' : 'btn-outline'}`} style={{ width: '100%', justifyContent: 'center' }}>
                Demander une démo
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700 }}>Questions fréquentes</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: 'var(--color-surface)', border: `1px solid ${openFaq === i ? 'rgba(201,169,110,0.3)' : 'var(--color-border)'}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', color: 'var(--color-text)', fontSize: 15, fontWeight: 500, cursor: 'pointer', textAlign: 'left', gap: 16 }}>
                {f.q}
                {openFaq === i ? <ChevronUp size={18} color="var(--color-gold)" /> : <ChevronDown size={18} color="var(--color-text-muted)" />}
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 24px 20px', color: 'var(--color-text-muted)', fontSize: 14, lineHeight: 1.7 }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 120px' }}>
        <div style={{ background: 'var(--color-surface)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 24, padding: '80px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div className="hero-glow" style={{ top: -100, left: '50%', transform: 'translateX(-50%)' }} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 24 }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="var(--color-gold)" color="var(--color-gold)" />)}
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, marginBottom: 16, position: 'relative' }}>
            Prêt à automatiser votre<br />
            <span className="text-gradient-gold">croissance ?</span>
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 16, maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Audit gratuit de votre Instagram en 24h. Aucune obligation. Découvrez combien de leads vous perdez chaque semaine.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:contact@nexovia.tn" className="btn btn-gold btn-lg">
              Demander mon audit gratuit <ArrowRight size={18} />
            </a>
            <Link href="/dashboard" className="btn btn-outline btn-lg">
              Voir le dashboard démo
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--color-border)', padding: '40px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--color-gold)' }}>NEXOVIA</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-subtle)' }}>© 2024 NEXOVIA. Automatisation IA pour l&apos;esthétique premium.</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-subtle)' }}>contact@nexovia.tn</div>
        </div>
      </footer>
    </div>
  )
}
