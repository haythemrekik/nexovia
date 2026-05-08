'use client'
import { use, useState, useEffect } from 'react'
import { Save, AtSign, MessageSquare, Bot, Globe, Phone, Mail, User, Building2, CheckCircle } from 'lucide-react'
import { useBusiness, mutations, isSupabaseConfigured } from '@/lib/use-data'
import type { OfferTier, BusinessStatus } from '@/lib/supabase/types'

export default function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: b, refetch } = useBusiness(id)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: '', city: '', offer_tier: 'starter' as OfferTier, status: 'active' as BusinessStatus,
    contact_name: '', contact_email: '', whatsapp: '', instagram_username: '',
    system_prompt: '', meta_page_access_token: '', instagram_id: '',
    monthly_revenue: 0, setup_fee: 0
  })

  useEffect(() => {
    if (b) {
      setForm({
        name: b.name || '', city: b.city || '', offer_tier: b.offer_tier, status: b.status,
        contact_name: b.contact_name || '', contact_email: b.contact_email || '',
        whatsapp: b.whatsapp || '', instagram_username: b.instagram_username || '',
        system_prompt: b.system_prompt || '', meta_page_access_token: b.meta_page_access_token || '',
        instagram_id: b.instagram_id || '', monthly_revenue: b.monthly_revenue, setup_fee: b.setup_fee
      })
    }
  }, [b])

  if (!b) return <div style={{ padding: 80, textAlign: 'center' }}>Client introuvable</div>

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      if (isSupabaseConfigured()) {
        await mutations.updateBusiness(id, form)
        refetch()
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        alert('Mode démo : les modifications seront sauvegardées une fois Supabase configuré.')
      }
    } catch (err) {
      console.error(err)
      alert('Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async () => {
    if (!confirm('Êtes-vous sûr de vouloir désactiver ce client ?')) return
    try {
      if (isSupabaseConfigured()) {
        await mutations.updateBusiness(id, { status: b.status === 'inactive' ? 'active' : 'inactive' })
        refetch()
      } else {
        alert('Mode démo : modification non disponible.')
      }
    } catch (err) { console.error(err) }
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--color-gold)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{b.name}</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>Paramètres</h1>
          </div>
          <button className="btn btn-gold" onClick={handleSave} disabled={saving} style={{ opacity: saving ? 0.6 : 1 }}>
            {saved ? <><CheckCircle size={16} /> Sauvegardé !</> : saving ? 'Sauvegarde...' : <><Save size={16} /> Sauvegarder</>}
          </button>
        </div>
      </div>
      <div className="page-content">
        <div className="responsive-grid-2" style={{ gap: 24 }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <Building2 size={18} color="var(--color-gold)" />
              <h2 style={{ fontSize: 16, fontWeight: 600 }}>Informations</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label className="label">Nom</label><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div><label className="label">Ville</label><input className="input" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
              <div className="responsive-grid-2" style={{ gap: 12 }}>
                <div><label className="label">Offre</label>
                  <select className="input" value={form.offer_tier} onChange={e => setForm({ ...form, offer_tier: e.target.value as OfferTier })}>
                    <option value="starter">Starter</option><option value="growth">Growth</option><option value="premium">Premium</option>
                  </select>
                </div>
                <div><label className="label">Statut</label>
                  <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as BusinessStatus })}>
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
              <div><label className="label"><User size={12} style={{ display: 'inline', marginRight: 4 }} />Nom du contact</label><input className="input" value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} /></div>
              <div><label className="label"><Mail size={12} style={{ display: 'inline', marginRight: 4 }} />Email</label><input className="input" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} type="email" /></div>
              <div><label className="label"><Phone size={12} style={{ display: 'inline', marginRight: 4 }} />WhatsApp</label><input className="input" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} /></div>
              <div><label className="label"><AtSign size={12} style={{ display: 'inline', marginRight: 4 }} />Instagram</label><input className="input" value={form.instagram_username} onChange={e => setForm({ ...form, instagram_username: e.target.value })} /></div>
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
                <textarea className="input" rows={5} value={form.system_prompt} onChange={e => setForm({ ...form, system_prompt: e.target.value })} style={{ resize: 'vertical', lineHeight: 1.7 }} />
                <p style={{ fontSize: 12, color: 'var(--color-text-subtle)', marginTop: 6 }}>Ce prompt définit la personnalité et le comportement du bot IA.</p>
              </div>
              <div className="divider-gold" style={{ margin: '8px 0' }} />
              <div className="responsive-grid-2" style={{ gap: 16 }}>
                <div>
                  <label className="label"><Globe size={12} style={{ display: 'inline', marginRight: 4 }} />Meta Page Access Token</label>
                  <input className="input" type="password" value={form.meta_page_access_token} onChange={e => setForm({ ...form, meta_page_access_token: e.target.value })} placeholder="Token Meta API..." />
                  <p style={{ fontSize: 12, color: 'var(--color-text-subtle)', marginTop: 6 }}>Nécessaire pour la connexion Instagram/Messenger</p>
                </div>
                <div>
                  <label className="label">Instagram ID</label>
                  <input className="input" value={form.instagram_id} onChange={e => setForm({ ...form, instagram_id: e.target.value })} placeholder="ID Instagram..." />
                  <p style={{ fontSize: 12, color: 'var(--color-text-subtle)', marginTop: 6 }}>Identifiant unique du compte Instagram Business</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card-gold" style={{ gridColumn: '1 / -1', padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Facturation</h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                  MRR : <strong style={{ color: 'var(--color-gold)' }}>{form.monthly_revenue.toLocaleString()} DT/mois</strong> · Setup : {form.setup_fee.toLocaleString()} DT · Offre {form.offer_tier.toUpperCase()}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input className="input" type="number" value={form.monthly_revenue} onChange={e => setForm({ ...form, monthly_revenue: Number(e.target.value) })} style={{ width: 100, padding: '6px 10px', fontSize: 13 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>DT/mois</span>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ color: b.status === 'inactive' ? 'var(--color-success)' : 'var(--color-error)' }} onClick={handleDeactivate}>
                  {b.status === 'inactive' ? 'Réactiver' : 'Désactiver'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
