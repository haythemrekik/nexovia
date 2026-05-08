'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Circle, Plus, ExternalLink, X, Trash2 } from 'lucide-react'
import { useBusinesses, useLeads, mutations, isSupabaseConfigured } from '@/lib/use-data'
import type { Business, OfferTier, BusinessStatus } from '@/lib/supabase/types'

const tierColors: Record<string, string> = { starter: 'badge-neutral', growth: 'badge-info', premium: 'badge-gold' }
const statusColors: Record<string, string> = { active: 'badge-success', trial: 'badge-warning', inactive: 'badge-error' }

const emptyForm = { name: '', city: '', instagram_username: '', contact_name: '', contact_email: '', offer_tier: 'starter' as OfferTier, status: 'trial' as BusinessStatus, monthly_revenue: 0, setup_fee: 0 }

export default function ClientsPage() {
  const { data: businesses, refetch } = useBusinesses()
  const { data: allLeads } = useLeads()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const openModal = () => { setForm(emptyForm); setShowModal(true) }
  const closeModal = () => { setShowModal(false) }

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      if (isSupabaseConfigured()) {
        await mutations.createBusiness({ ...form, slug: form.name.toLowerCase().replace(/\s+/g, '-') })
        refetch()
      } else {
        alert('Mode démo : la création sera disponible une fois Supabase configuré.')
      }
    } catch (err) {
      console.error(err)
      alert('Erreur lors de la création.')
    } finally {
      setSaving(false)
      closeModal()
    }
  }

  const handleDelete = async (id: string) => {
    try {
      if (isSupabaseConfigured()) {
        await mutations.deleteBusiness(id)
        refetch()
      } else {
        alert('Mode démo : la suppression sera disponible une fois Supabase configuré.')
      }
    } catch (err) {
      console.error(err)
    }
    setDeleteId(null)
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--color-gold)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Admin</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>Clients</h1>
          </div>
          <button className="btn btn-gold" onClick={openModal}>
            <Plus size={16} /> Nouveau client
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="responsive-grid-3">
          {businesses.map((b) => {
            const leads = allLeads.filter(l => l.business_id === b.id)
            const converted = leads.filter(l => l.lead_status === 'converted').length
            return (
              <div key={b.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: 'var(--color-gold)' }}>
                      {b.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{b.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{b.city}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={`badge ${statusColors[b.status]}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Circle size={6} fill="currentColor" />{b.status}
                    </span>
                    <button onClick={() => setDeleteId(b.id)} className="btn btn-ghost btn-sm" style={{ padding: 6, color: 'var(--color-error)' }} title="Supprimer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="responsive-grid-2" style={{ gap: 12, marginBottom: 20 }}>
                  <div style={{ background: 'var(--color-surface-2)', borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>MRR</div>
                    <div style={{ fontWeight: 700, color: 'var(--color-gold)', fontSize: 18 }}>{b.monthly_revenue.toLocaleString()} DT</div>
                  </div>
                  <div style={{ background: 'var(--color-surface-2)', borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Leads</div>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>{leads.length} <span style={{ fontWeight: 400, fontSize: 12, color: 'var(--color-success)' }}>({converted} conv.)</span></div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--color-text-subtle)', width: 80 }}>Instagram</span>
                    <span>{b.instagram_username || '—'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--color-text-subtle)', width: 80 }}>Offre</span>
                    <span className={`badge ${tierColors[b.offer_tier]}`}>{b.offer_tier}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--color-text-subtle)', width: 80 }}>Contact</span>
                    <span>{b.contact_name || '—'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                  <Link href={`/dashboard/client/${b.id}`} className="btn btn-gold btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                    Gérer <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            )
          })}

          <div style={{ background: 'var(--color-surface)', border: '2px dashed var(--color-border)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer', minHeight: 280, transition: 'border-color 0.2s' }}
            onClick={openModal}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,169,110,0.4)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(201,169,110,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={24} color="var(--color-gold)" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Ajouter un client</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Onboarder un nouvel établissement</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Ajout Client */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>Nouveau client</h2>
              <button onClick={closeModal} className="btn btn-ghost btn-sm" style={{ padding: 8 }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="responsive-grid-2" style={{ gap: 12 }}>
                <div><label className="label">Nom de l&apos;établissement *</label><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Institut Éclat..." /></div>
                <div><label className="label">Ville</label><input className="input" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Tunis..." /></div>
              </div>
              <div className="responsive-grid-2" style={{ gap: 12 }}>
                <div><label className="label">Instagram</label><input className="input" value={form.instagram_username} onChange={e => setForm({ ...form, instagram_username: e.target.value })} placeholder="@institut_eclat" /></div>
                <div><label className="label">Nom du contact</label><input className="input" value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} placeholder="Fatma..." /></div>
              </div>
              <div><label className="label">Email du contact</label><input className="input" type="email" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} placeholder="contact@institut.tn" /></div>
              <div className="responsive-grid-3" style={{ gap: 12 }}>
                <div><label className="label">Offre</label>
                  <select className="input" value={form.offer_tier} onChange={e => setForm({ ...form, offer_tier: e.target.value as OfferTier })}>
                    <option value="starter">Starter</option><option value="growth">Growth</option><option value="premium">Premium</option>
                  </select>
                </div>
                <div><label className="label">MRR (DT)</label><input className="input" type="number" value={form.monthly_revenue} onChange={e => setForm({ ...form, monthly_revenue: Number(e.target.value) })} /></div>
                <div><label className="label">Setup (DT)</label><input className="input" type="number" value={form.setup_fee} onChange={e => setForm({ ...form, setup_fee: Number(e.target.value) })} /></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={closeModal}>Annuler</button>
              <button className="btn btn-gold" onClick={handleSave} disabled={saving || !form.name.trim()} style={{ opacity: saving || !form.name.trim() ? 0.6 : 1 }}>
                {saving ? 'Création...' : 'Créer le client'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmation Suppression */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Confirmer la suppression</h2>
            <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Annuler</button>
              <button className="btn btn-gold" style={{ background: 'var(--color-error)' }} onClick={() => handleDelete(deleteId)}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
