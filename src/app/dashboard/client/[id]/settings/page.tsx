'use client'
import { use } from 'react'
import { Save, AtSign, MessageSquare, Bot, Globe, Phone, Mail, User, Building2 } from 'lucide-react'
import { useBusiness } from '@/lib/use-data'

export default function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: b } = useBusiness(id)

  if (!b) return <div style={{ padding: 80, textAlign: 'center' }}>Client introuvable</div>

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--color-gold)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{b.name}</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>Paramètres</h1>
          </div>
          <button className="btn btn-gold"><Save size={16} /> Sauvegarder</button>
        </div>
      </div>
      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <Building2 size={18} color="var(--color-gold)" />
              <h2 style={{ fontSize: 16, fontWeight: 600 }}>Informations</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label className="label">Nom</label><input className="input" defaultValue={b.name} /></div>
              <div><label className="label">Slug</label><input className="input" defaultValue={b.slug} disabled style={{ opacity: 0.6 }} /></div>
              <div><label className="label">Ville</label><input className="input" defaultValue={b.city || ''} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label className="label">Offre</label>
                  <select className="input" defaultValue={b.offer_tier}>
                    <option value="starter">Starter</option><option value="growth">Growth</option><option value="premium">Premium</option>
                  </select>
                </div>
                <div><label className="label">Statut</label>
                  <select className="input" defaultValue={b.status}>
                    <option value="active">Actif</option><option value="trial">Essai</option><option value="inactive">Inactif</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <User size={18} color="var(--color-gold)" />
              <h2 style={{ fontSize: 16, fontWeight: 600 }}>Contact</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label className="label"><User size={12} style={{ display: 'inline', marginRight: 4 }} />Nom du contact</label><input className="input" defaultValue={b.contact_name || ''} /></div>
              <div><label className="label"><Mail size={12} style={{ display: 'inline', marginRight: 4 }} />Email</label><input className="input" defaultValue={b.contact_email || ''} type="email" /></div>
              <div><label className="label"><Phone size={12} style={{ display: 'inline', marginRight: 4 }} />WhatsApp</label><input className="input" defaultValue={b.whatsapp || ''} /></div>
              <div><label className="label"><AtSign size={12} style={{ display: 'inline', marginRight: 4 }} />Instagram</label><input className="input" defaultValue={b.instagram_username || ''} /></div>
            </div>
          </div>
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <Bot size={18} color="var(--color-gold)" />
              <h2 style={{ fontSize: 16, fontWeight: 600 }}>Configuration du Bot IA</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="label"><MessageSquare size={12} style={{ display: 'inline', marginRight: 4 }} />System Prompt</label>
                <textarea className="input" rows={5} defaultValue={b.system_prompt || ''} style={{ resize: 'vertical', lineHeight: 1.7 }} />
                <p style={{ fontSize: 12, color: 'var(--color-text-subtle)', marginTop: 6 }}>Ce prompt définit la personnalité et le comportement du bot IA.</p>
              </div>
              <div className="divider-gold" style={{ margin: '8px 0' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label className="label"><Globe size={12} style={{ display: 'inline', marginRight: 4 }} />Meta Page Access Token</label>
                  <input className="input" type="password" defaultValue={b.meta_page_access_token || ''} placeholder="Token Meta API..." />
                  <p style={{ fontSize: 12, color: 'var(--color-text-subtle)', marginTop: 6 }}>Nécessaire pour la connexion Instagram/Messenger</p>
                </div>
                <div>
                  <label className="label">Instagram ID</label>
                  <input className="input" defaultValue={b.instagram_id || ''} placeholder="ID Instagram..." />
                  <p style={{ fontSize: 12, color: 'var(--color-text-subtle)', marginTop: 6 }}>Identifiant unique du compte Instagram Business</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card-gold" style={{ gridColumn: '1 / -1', padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Facturation</h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                  MRR : <strong style={{ color: 'var(--color-gold)' }}>{b.monthly_revenue.toLocaleString()} DT/mois</strong> · Setup : {b.setup_fee.toLocaleString()} DT · Offre {b.offer_tier.toUpperCase()}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline btn-sm">Modifier tarif</button>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }}>Désactiver</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
