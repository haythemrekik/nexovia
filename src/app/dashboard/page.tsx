'use client'
import Link from 'next/link'
import { Building2, TrendingUp, Users, MessageCircle, ArrowUpRight, Circle } from 'lucide-react'
import { useBusinesses, useLeads } from '@/lib/use-data'

const tierColors: Record<string, string> = {
  starter: 'badge-neutral',
  growth: 'badge-info',
  premium: 'badge-gold',
}
const statusColors: Record<string, string> = {
  active: 'badge-success',
  trial: 'badge-warning',
  inactive: 'badge-error',
}

export default function AdminDashboard() {
  const { data: businesses, loading: loadingBiz } = useBusinesses()
  const { data: leads, loading: loadingLeads } = useLeads()

  const totalMRR = businesses.reduce((sum, b) => sum + b.monthly_revenue, 0)
  const activeClients = businesses.filter(b => b.status === 'active').length
  const totalLeads = leads.length
  const newLeadsToday = leads.filter(l => l.lead_status === 'new').length

  const loading = loadingBiz || loadingLeads

  return (
    <div>
      <div className="page-header">
        <p style={{ fontSize: 12, color: 'var(--color-gold)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
          NEXOVIA · Admin
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>Vue d&apos;ensemble</h1>
      </div>

      <div className="page-content">
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32, opacity: loading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
          {[
            { label: 'MRR Total', value: `${totalMRR.toLocaleString()} DT`, sub: '+12% ce mois', icon: TrendingUp, color: 'var(--color-gold)' },
            { label: 'Clients actifs', value: activeClients, sub: `${businesses.length} total`, icon: Building2, color: 'var(--color-info)' },
            { label: 'Leads ce mois', value: totalLeads, sub: `${newLeadsToday} nouveaux`, icon: Users, color: 'var(--color-success)' },
            { label: 'Conversations', value: '47', sub: '3 nécessitent attention', icon: MessageCircle, color: 'var(--color-warning)' },
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

        {/* Clients Table */}
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>Clients actifs</h2>
          <Link href="/dashboard/clients" className="btn btn-ghost btn-sm">
            Voir tous <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Ville</th>
                <th>Offre</th>
                <th>Statut</th>
                <th>MRR</th>
                <th>Leads</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((b) => {
                const clientLeads = leads.filter(l => l.business_id === b.id)
                return (
                  <tr key={b.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--color-gold)', flexShrink: 0 }}>
                          {b.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{b.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{b.instagram_username}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{b.city}</td>
                    <td><span className={`badge ${tierColors[b.offer_tier]}`}>{b.offer_tier}</span></td>
                    <td>
                      <span className={`badge ${statusColors[b.status]}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <Circle size={6} fill="currentColor" />
                        {b.status}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--color-gold)' }}>{b.monthly_revenue.toLocaleString()} DT</td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{clientLeads.length} leads</td>
                    <td>
                      <Link href={`/dashboard/client/${b.id}`} className="btn btn-ghost btn-sm">
                        Ouvrir →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Objectif MRR */}
        <div className="card-gold" style={{ marginTop: 24, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 4 }}>Objectif MRR</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700 }}>
                {totalMRR.toLocaleString()} DT <span style={{ fontSize: 14, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>/ 20 000 DT</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-gold)' }}>
                {Math.round((totalMRR / 20000) * 100)}%
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>atteint</div>
            </div>
          </div>
          <div style={{ height: 8, background: 'var(--color-surface-3)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min((totalMRR / 20000) * 100, 100)}%`, background: 'linear-gradient(90deg, var(--color-gold-dark), var(--color-gold))', borderRadius: 99, transition: 'width 1s ease' }} />
          </div>
          <div style={{ marginTop: 12, fontSize: 13, color: 'var(--color-text-muted)' }}>
            Il vous faut <strong style={{ color: 'var(--color-text)' }}>{(20000 - totalMRR).toLocaleString()} DT/mois</strong> supplémentaires pour atteindre l&apos;objectif · soit environ <strong style={{ color: 'var(--color-gold)' }}>{Math.ceil((20000 - totalMRR) / 990)} clients Growth</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
