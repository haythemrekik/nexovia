'use client'
import { use, useState } from 'react'
import { Plus, Search, HelpCircle, BarChart3, Edit2, Trash2, ToggleLeft, ToggleRight, Tag } from 'lucide-react'
import { useBusiness, useFaqItems } from '@/lib/use-data'

export default function FaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: business } = useBusiness(id)
  const { data: faqs } = useFaqItems(id)
  const [search, setSearch] = useState('')

  const filtered = faqs.filter(f =>
    !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())
  )
  const totalUsage = faqs.reduce((sum, f) => sum + f.usage_count, 0)

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--color-gold)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{business?.name}</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>FAQ & Réponses auto</h1>
          </div>
          <button className="btn btn-gold"><Plus size={16} /> Nouvelle réponse</button>
        </div>
      </div>
      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Réponses actives</span>
              <HelpCircle size={18} color="var(--color-gold)" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700 }}>{faqs.filter(f => f.is_active).length}</div>
          </div>
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Utilisations totales</span>
              <BarChart3 size={18} color="var(--color-success)" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700 }}>{totalUsage}</div>
          </div>
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Moy. par réponse</span>
              <BarChart3 size={18} color="var(--color-info)" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700 }}>{faqs.length > 0 ? Math.round(totalUsage / faqs.length) : 0}</div>
          </div>
        </div>
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
          <input className="input" placeholder="Rechercher dans les FAQ..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(faq => (
            <div key={faq.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{faq.question}</h3>
                    <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{faq.answer}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginLeft: 16, flexShrink: 0 }}>
                    <button className="btn btn-ghost btn-sm" style={{ padding: 8 }}><Edit2 size={14} /></button>
                    <button className="btn btn-ghost btn-sm" style={{ padding: 8, color: 'var(--color-error)' }}><Trash2 size={14} /></button>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <Tag size={12} color="var(--color-text-subtle)" />
                    {faq.trigger_keywords.map((kw, i) => (
                      <span key={i} style={{ fontSize: 11, color: 'var(--color-text-muted)', background: 'var(--color-surface-2)', padding: '3px 8px', borderRadius: 6 }}>{kw}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{faq.usage_count} utilisations</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                      {faq.is_active ? <ToggleRight size={20} color="var(--color-success)" /> : <ToggleLeft size={20} color="var(--color-text-subtle)" />}
                      <span style={{ fontSize: 12, color: faq.is_active ? 'var(--color-success)' : 'var(--color-text-subtle)' }}>{faq.is_active ? 'Actif' : 'Inactif'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ height: 3, background: 'var(--color-surface-2)' }}>
                <div style={{ height: '100%', width: `${Math.min((faq.usage_count / (totalUsage || 1)) * 100 * 3, 100)}%`, background: 'linear-gradient(90deg, var(--color-gold-dark), var(--color-gold))' }} />
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 60, color: 'var(--color-text-muted)' }}><HelpCircle size={40} style={{ opacity: 0.2, marginBottom: 12 }} /><div>Aucune FAQ trouvée</div></div>}
      </div>
    </div>
  )
}
