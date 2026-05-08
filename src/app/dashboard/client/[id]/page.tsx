'use client'
import { use } from 'react'
import Link from 'next/link'
import { Users, MessageCircle, TrendingUp, Calendar, ArrowUpRight, Circle, Bot, Phone } from 'lucide-react'
import { useBusinesses, useBusiness, useLeads, useConversations, useServices } from '@/lib/use-data'

const statusLabels: Record<string, string> = {
  new: 'Nouveau', contacted: 'Contacté', qualified: 'Qualifié',
  appointment_scheduled: 'RDV prévu', converted: 'Converti', lost: 'Perdu',
}
const statusBadge: Record<string, string> = {
  new: 'badge-info', contacted: 'badge-warning', qualified: 'badge-gold',
  appointment_scheduled: 'badge-success', converted: 'badge-success', lost: 'badge-error',
}

export default function ClientDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: business } = useBusiness(id)
  const { data: leads } = useLeads(id)
  const { data: conversations } = useConversations(id)
  const { data: services } = useServices(id)
  const { data: allLeads } = useLeads()

  if (!business) {
    return (
      <div style={{ padding: 80, textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 12 }}>Client introuvable</h2>
        <Link href="/dashboard/clients" className="btn btn-outline">← Retour aux clients</Link>
      </div>
    )
  }

  const convertedLeads = leads.filter(l => l.lead_status === 'converted').length
  const conversionRate = leads.length > 0 ? Math.round((convertedLeads / leads.length) * 100) : 0
  const activeConvos = conversations.filter(c => !c.is_resolved).length
  const needsHuman = conversations.filter(c => c.needs_human).length

  return (
    <div>
      <div className="page-header">
        <p style={{ fontSize: 12, color: 'var(--color-gold)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
          {business.name} · {business.offer_tier.toUpperCase()}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>Tableau de bord</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Circle size={6} fill="currentColor" />Bot actif
            </span>
            <span className="badge badge-gold">{business.monthly_revenue.toLocaleString()} DT/mois</span>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* KPI Cards */}
        <div className="responsive-grid-4" style={{ marginBottom: 32 }}>
          {[
            { label: 'Leads total', value: leads.length, sub: `${leads.filter(l => l.lead_status === 'new').length} nouveaux`, icon: Users, color: 'var(--color-info)' },
            { label: 'Taux conversion', value: `${conversionRate}%`, sub: `${convertedLeads} convertis`, icon: TrendingUp, color: 'var(--color-success)' },
            { label: 'Conversations', value: conversations.length, sub: `${activeConvos} actives`, icon: MessageCircle, color: 'var(--color-gold)' },
            { label: 'Services actifs', value: services.filter(s => s.is_active).length, sub: `${services.length} total`, icon: Calendar, color: 'var(--color-warning)' },
          ].map((stat, i) => (
            <div key={i} className="stat-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</span>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <stat.icon size={18} color={stat.color} />
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        <div className="responsive-grid-2">
          {/* Recent Leads */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600 }}>Derniers leads</h2>
              <Link href={`/dashboard/client/${id}/leads`} className="btn btn-ghost btn-sm">Voir tous <ArrowUpRight size={14} /></Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {leads.slice(0, 4).map((lead) => (
                <div key={lead.id} className="card" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--color-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--color-gold)' }}>
                        {lead.first_name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{lead.first_name} {lead.last_name}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{lead.instagram_username} · {lead.interested_service || 'Non précisé'}</div>
                      </div>
                    </div>
                    <span className={`badge ${statusBadge[lead.lead_status]}`}>{statusLabels[lead.lead_status]}</span>
                  </div>
                </div>
              ))}
              {leads.length === 0 && <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-muted)' }}>Aucun lead pour le moment</div>}
            </div>
          </div>

          {/* Recent Conversations */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600 }}>Conversations récentes</h2>
              <Link href={`/dashboard/client/${id}/conversations`} className="btn btn-ghost btn-sm">Voir toutes <ArrowUpRight size={14} /></Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {conversations.slice(0, 3).map((convo) => {
                const lastMsg = convo.messages[convo.messages.length - 1]
                const lead = allLeads.find(l => l.id === convo.lead_id)
                return (
                  <div key={convo.id} className="card" style={{ padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: convo.needs_human ? 'var(--color-warning-bg)' : 'var(--color-surface-3)', border: convo.needs_human ? '1px solid rgba(251,191,36,0.3)' : '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {convo.needs_human ? <Phone size={16} color="var(--color-warning)" /> : <Bot size={16} color="var(--color-gold)" />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{lead?.first_name || 'Inconnu'} {lead?.last_name || ''}</div>
                          <div style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}>{convo.platform} · {convo.messages.length} messages</div>
                        </div>
                      </div>
                      {!convo.is_resolved && <span className="notif-dot" />}
                    </div>
                    {lastMsg && (
                      <div style={{ fontSize: 13, color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: 46 }}>
                        <span style={{ color: lastMsg.role === 'assistant' ? 'var(--color-gold)' : 'var(--color-text)', fontWeight: 500 }}>
                          {lastMsg.role === 'assistant' ? 'Bot' : 'Client'}:
                        </span>{' '}{lastMsg.content.substring(0, 80)}...
                      </div>
                    )}
                  </div>
                )
              })}
              {conversations.length === 0 && <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-muted)' }}>Aucune conversation</div>}
            </div>
            {needsHuman > 0 && (
              <div className="card-gold" style={{ marginTop: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Phone size={18} color="var(--color-warning)" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-warning)' }}>{needsHuman} conversation(s) nécessitent une reprise humaine</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Le bot a détecté des questions complexes</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Services */}
        <div style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Services proposés</h2>
            <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{services.length} services</span>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>Service</th><th>Prix</th><th>Durée</th><th>Description</th><th>Statut</th></tr></thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td style={{ color: 'var(--color-gold)', fontWeight: 600 }}>{s.price} DT</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{s.duration ? `${s.duration} min` : '—'}</td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{s.description || '—'}</td>
                    <td><span className={`badge ${s.is_active ? 'badge-success' : 'badge-neutral'}`}><Circle size={6} fill="currentColor" />{s.is_active ? 'Actif' : 'Inactif'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
