'use client'
import { TrendingUp, Users, Building2, MessageCircle, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useBusinesses, useLeads, useConversations } from '@/lib/use-data'

const monthlyData = [
  { month: 'Jan', mrr: 2000, leads: 8, clients: 1 },
  { month: 'Fév', mrr: 2990, leads: 14, clients: 2 },
  { month: 'Mar', mrr: 3480, leads: 22, clients: 3 },
  { month: 'Avr', mrr: 3480, leads: 28, clients: 3 },
  { month: 'Mai', mrr: 3480, leads: 35, clients: 3 },
]

export default function AnalyticsPage() {
  const { data: businesses } = useBusinesses()
  const { data: leads } = useLeads()
  const { data: conversations } = useConversations()

  const totalMRR = businesses.reduce((s, b) => s + b.monthly_revenue, 0)
  const convertedLeads = leads.filter(l => l.lead_status === 'converted').length
  const conversionRate = leads.length > 0 ? Math.round((convertedLeads / leads.length) * 100) : 0
  const maxMRR = Math.max(...monthlyData.map(d => d.mrr))

  const tierBreakdown = [
    { tier: 'Premium', count: businesses.filter(b => b.offer_tier === 'premium').length, mrr: businesses.filter(b => b.offer_tier === 'premium').reduce((s, b) => s + b.monthly_revenue, 0), color: 'var(--color-gold)' },
    { tier: 'Growth', count: businesses.filter(b => b.offer_tier === 'growth').length, mrr: businesses.filter(b => b.offer_tier === 'growth').reduce((s, b) => s + b.monthly_revenue, 0), color: 'var(--color-info)' },
    { tier: 'Starter', count: businesses.filter(b => b.offer_tier === 'starter').length, mrr: businesses.filter(b => b.offer_tier === 'starter').reduce((s, b) => s + b.monthly_revenue, 0), color: 'var(--color-text-muted)' },
  ]

  return (
    <div>
      <div className="page-header">
        <p style={{ fontSize: 12, color: 'var(--color-gold)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>NEXOVIA · Admin</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>Analytics</h1>
      </div>
      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'MRR', value: `${totalMRR.toLocaleString()} DT`, change: '+12%', up: true, icon: DollarSign, color: 'var(--color-gold)' },
            { label: 'Clients', value: businesses.length, change: '+1', up: true, icon: Building2, color: 'var(--color-info)' },
            { label: 'Leads', value: leads.length, change: '+5', up: true, icon: Users, color: 'var(--color-success)' },
            { label: 'Conversion', value: `${conversionRate}%`, change: '+3%', up: true, icon: TrendingUp, color: 'var(--color-warning)' },
            { label: 'Conversations', value: conversations.length, change: '0', up: false, icon: MessageCircle, color: 'var(--color-text-muted)' },
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
                <s.icon size={16} color={s.color} />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, color: s.up ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {s.change} ce mois
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600 }}>Évolution MRR</h2>
              <span className="badge badge-gold">5 derniers mois</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 200, padding: '0 8px' }}>
              {monthlyData.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-gold)' }}>{d.mrr.toLocaleString()}</span>
                  <div style={{
                    width: '100%', borderRadius: '8px 8px 0 0', transition: 'height 0.8s ease',
                    height: `${(d.mrr / maxMRR) * 160}px`,
                    background: i === monthlyData.length - 1 ? 'linear-gradient(180deg, var(--color-gold), var(--color-gold-dark))' : 'linear-gradient(180deg, var(--color-surface-3), var(--color-surface-2))',
                    border: i === monthlyData.length - 1 ? '1px solid rgba(201,169,110,0.3)' : '1px solid var(--color-border)',
                  }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{d.month}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>Répartition offres</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {tierBreakdown.map((t, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: t.color }}>{t.tier}</span>
                    <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{t.count} client{t.count > 1 ? 's' : ''} · {t.mrr.toLocaleString()} DT</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--color-surface-3)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${totalMRR > 0 ? (t.mrr / totalMRR) * 100 : 0}%`, background: t.color, borderRadius: 99, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="divider-gold" style={{ margin: '20px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>ARPU</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--color-gold)' }}>
                {businesses.length > 0 ? Math.round(totalMRR / businesses.length).toLocaleString() : 0} DT
              </span>
            </div>
          </div>
        </div>
        <div className="card" style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>Entonnoir de conversion global</h2>
          <div style={{ display: 'flex', gap: 2, alignItems: 'stretch', height: 120 }}>
            {[
              { label: 'Nouveaux', count: leads.filter(l => l.lead_status === 'new').length, color: 'var(--color-info)' },
              { label: 'Contactés', count: leads.filter(l => l.lead_status === 'contacted').length, color: 'var(--color-warning)' },
              { label: 'Qualifiés', count: leads.filter(l => l.lead_status === 'qualified').length, color: 'var(--color-gold)' },
              { label: 'RDV', count: leads.filter(l => l.lead_status === 'appointment_scheduled').length, color: 'var(--color-success)' },
              { label: 'Convertis', count: leads.filter(l => l.lead_status === 'converted').length, color: '#4ade80' },
            ].map((stage, i) => {
              const pct = leads.length > 0 ? (stage.count / leads.length) * 100 : 0
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700 }}>{stage.count}</div>
                  <div style={{ width: '80%', borderRadius: 8, background: `${stage.color}20`, border: `1px solid ${stage.color}40`, height: `${Math.max(pct * 2, 20)}%`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'height 0.8s ease' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: stage.color }}>{Math.round(pct)}%</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stage.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
