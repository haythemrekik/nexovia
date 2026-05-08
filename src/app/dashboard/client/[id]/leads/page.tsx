'use client'
import { use, useState } from 'react'
import { Search, Filter, Plus, Phone, Mail, AtSign, Circle, Calendar, Users, X, Save } from 'lucide-react'
import { useBusiness, useLeads, useServices, mutations, isSupabaseConfigured } from '@/lib/use-data'
import type { LeadStatus } from '@/lib/supabase/types'

const statusLabels: Record<string, string> = {
  new: 'Nouveau', contacted: 'Contacté', qualified: 'Qualifié',
  appointment_scheduled: 'RDV prévu', converted: 'Converti', lost: 'Perdu',
}
const statusBadge: Record<string, string> = {
  new: 'badge-info', contacted: 'badge-warning', qualified: 'badge-gold',
  appointment_scheduled: 'badge-success', converted: 'badge-success', lost: 'badge-error',
}
const pipeline = ['new', 'contacted', 'qualified', 'appointment_scheduled', 'converted']

const emptyLead = { first_name: '', last_name: '', instagram_username: '', phone: '', email: '', interested_service: '', lead_status: 'new' as LeadStatus, source: 'instagram', notes: '' }

export default function LeadsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: business } = useBusiness(id)
  const { data: allLeads, refetch } = useLeads(id)
  const { data: services } = useServices(id)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyLead)
  const [saving, setSaving] = useState(false)

  const filtered = allLeads.filter(l => {
    const s = !search || `${l.first_name} ${l.last_name} ${l.instagram_username} ${l.interested_service}`.toLowerCase().includes(search.toLowerCase())
    return s && (!statusFilter || l.lead_status === statusFilter)
  })

  const openAdd = () => { setForm(emptyLead); setShowModal(true) }

  const handleSave = async () => {
    if (!form.first_name.trim()) return
    setSaving(true)
    try {
      if (isSupabaseConfigured()) {
        await mutations.createLead({ ...form, business_id: id })
        refetch()
      } else {
        alert('Mode démo : la création sera disponible une fois Supabase configuré.')
      }
    } catch (err) { console.error(err) }
    finally { setSaving(false); setShowModal(false) }
  }

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      if (isSupabaseConfigured()) {
        await mutations.updateLead(leadId, { lead_status: newStatus })
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
            <p style={{ fontSize: 12, color: 'var(--color-gold)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{business?.name}</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>Leads</h1>
          </div>
          <button className="btn btn-gold" onClick={openAdd}><Plus size={16} /> Ajouter un lead</button>
        </div>
      </div>
      <div className="page-content">
        <div className="responsive-grid-5" style={{ gap: 2, background: 'var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 24 }}>
          {pipeline.map((st) => (
            <button key={st} onClick={() => setStatusFilter(statusFilter === st ? null : st)}
              style={{ background: statusFilter === st ? 'var(--color-surface-3)' : 'var(--color-surface)', border: 'none', padding: '20px 16px', cursor: 'pointer', textAlign: 'center', position: 'relative' }}>
              {statusFilter === st && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'var(--color-gold)' }} />}
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: statusFilter === st ? 'var(--color-gold)' : 'var(--color-text)', marginBottom: 4 }}>
                {allLeads.filter(l => l.lead_status === st).length}
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{statusLabels[st]}</div>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
            <input className="input" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
          </div>
          {statusFilter && <button className="btn btn-ghost btn-sm" onClick={() => setStatusFilter(null)}><Filter size={14} /> Retirer</button>}
        </div>
        <div className="table-wrapper" style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead><tr><th>Lead</th><th>Service</th><th>Statut</th><th>Contact</th><th>Source</th><th>Date</th></tr></thead>
            <tbody>
              {filtered.map(lead => (
                <tr key={lead.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--color-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--color-gold)', flexShrink: 0 }}>{lead.first_name?.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{lead.first_name} {lead.last_name}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{lead.instagram_username}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{lead.interested_service || '—'}</td>
                  <td>
                    <select className="input" value={lead.lead_status} onChange={e => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                      style={{ padding: '4px 8px', fontSize: 11, minWidth: 120, background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 8 }}>
                      {Object.entries(statusLabels).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {lead.phone && <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--color-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={lead.phone}><Phone size={12} color="var(--color-success)" /></div>}
                      {lead.email && <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--color-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={lead.email}><Mail size={12} color="var(--color-info)" /></div>}
                      {lead.instagram_username && <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--color-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AtSign size={12} color="var(--color-gold)" /></div>}
                    </div>
                  </td>
                  <td><span className="badge badge-neutral">{lead.source}</span></td>
                  <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}><Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />{new Date(lead.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 60, color: 'var(--color-text-muted)' }}><Users size={40} style={{ marginBottom: 16, opacity: 0.3 }} /><div>Aucun lead trouvé</div></div>}
      </div>

      {/* Modal Ajout Lead */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>Nouveau lead</h2>
              <button onClick={() => setShowModal(false)} className="btn btn-ghost btn-sm" style={{ padding: 8 }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="responsive-grid-2" style={{ gap: 12 }}>
                <div><label className="label">Prénom *</label><input className="input" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} placeholder="Fatma..." /></div>
                <div><label className="label">Nom</label><input className="input" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} placeholder="Ben Ali..." /></div>
              </div>
              <div className="responsive-grid-2" style={{ gap: 12 }}>
                <div><label className="label">Instagram</label><input className="input" value={form.instagram_username} onChange={e => setForm({ ...form, instagram_username: e.target.value })} placeholder="@fatma_beauty" /></div>
                <div><label className="label">Téléphone</label><input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+216 XX XXX XXX" /></div>
              </div>
              <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@exemple.tn" /></div>
              <div className="responsive-grid-2" style={{ gap: 12 }}>
                <div><label className="label">Service souhaité</label>
                  <select className="input" value={form.interested_service} onChange={e => setForm({ ...form, interested_service: e.target.value })}>
                    <option value="">— Sélectionner —</option>
                    {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div><label className="label">Source</label>
                  <select className="input" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
                    <option value="instagram">Instagram</option><option value="whatsapp">WhatsApp</option><option value="manual">Manuel</option><option value="referral">Référence</option>
                  </select>
                </div>
              </div>
              <div><label className="label">Notes</label><textarea className="input" rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Remarques..." style={{ resize: 'vertical' }} /></div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-gold" onClick={handleSave} disabled={saving || !form.first_name.trim()} style={{ opacity: saving ? 0.6 : 1 }}>
                <Save size={16} /> {saving ? 'Création...' : 'Ajouter le lead'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
