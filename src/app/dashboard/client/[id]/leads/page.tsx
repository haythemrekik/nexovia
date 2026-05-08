'use client'
import { use, useState } from 'react'
import { Search, Filter, Plus, Phone, Mail, AtSign, Circle, Calendar, Users } from 'lucide-react'
import { useBusiness, useLeads } from '@/lib/use-data'

const statusLabels: Record<string, string> = {
  new: 'Nouveau', contacted: 'Contacté', qualified: 'Qualifié',
  appointment_scheduled: 'RDV prévu', converted: 'Converti', lost: 'Perdu',
}
const statusBadge: Record<string, string> = {
  new: 'badge-info', contacted: 'badge-warning', qualified: 'badge-gold',
  appointment_scheduled: 'badge-success', converted: 'badge-success', lost: 'badge-error',
}
const pipeline = ['new', 'contacted', 'qualified', 'appointment_scheduled', 'converted']

export default function LeadsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: business } = useBusiness(id)
  const { data: allLeads } = useLeads(id)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const filtered = allLeads.filter(l => {
    const s = !search || `${l.first_name} ${l.last_name} ${l.instagram_username} ${l.interested_service}`.toLowerCase().includes(search.toLowerCase())
    return s && (!statusFilter || l.lead_status === statusFilter)
  })

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--color-gold)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{business?.name}</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>Leads</h1>
          </div>
          <button className="btn btn-gold"><Plus size={16} /> Ajouter un lead</button>
        </div>
      </div>
      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${pipeline.length}, 1fr)`, gap: 2, background: 'var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 24 }}>
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
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
            <input className="input" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
          </div>
          {statusFilter && <button className="btn btn-ghost btn-sm" onClick={() => setStatusFilter(null)}><Filter size={14} /> Retirer</button>}
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>Lead</th><th>Service</th><th>Statut</th><th>Contact</th><th>Source</th><th>Date</th></tr></thead>
            <tbody>
              {filtered.map(lead => (
                <tr key={lead.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--color-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--color-gold)' }}>{lead.first_name?.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{lead.first_name} {lead.last_name}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{lead.instagram_username}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{lead.interested_service || '—'}</td>
                  <td><span className={`badge ${statusBadge[lead.lead_status]}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Circle size={6} fill="currentColor" />{statusLabels[lead.lead_status]}</span></td>
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
    </div>
  )
}
