'use client'
import Link from 'next/link'
import { Circle, Plus, ExternalLink } from 'lucide-react'
import { useBusinesses, useLeads } from '@/lib/use-data'

const tierColors: Record<string, string> = { starter: 'badge-neutral', growth: 'badge-info', premium: 'badge-gold' }
const statusColors: Record<string, string> = { active: 'badge-success', trial: 'badge-warning', inactive: 'badge-error' }

export default function ClientsPage() {
  const { data: businesses } = useBusinesses()
  const { data: allLeads } = useLeads()

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--color-gold)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Admin</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>Clients</h1>
          </div>
          <button className="btn btn-gold">
            <Plus size={16} /> Nouveau client
          </button>
        </div>
      </div>

      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
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
                  <span className={`badge ${statusColors[b.status]}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Circle size={6} fill="currentColor" />{b.status}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
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
                  <button className="btn btn-ghost btn-sm">···</button>
                </div>
              </div>
            )
          })}

          <div style={{ background: 'var(--color-surface)', border: '2px dashed var(--color-border)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer', minHeight: 280, transition: 'border-color 0.2s' }}
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
    </div>
  )
}
