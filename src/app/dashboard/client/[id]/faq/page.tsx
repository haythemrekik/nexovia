'use client'
import { use, useState } from 'react'
import { Plus, Search, HelpCircle, BarChart3, Edit2, Trash2, ToggleLeft, ToggleRight, Tag, X, Save } from 'lucide-react'
import { useBusiness, useFaqItems, mutations, isSupabaseConfigured } from '@/lib/use-data'

const emptyFaq = { question: '', answer: '', trigger_keywords: '' }

export default function FaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: business } = useBusiness(id)
  const { data: faqs, refetch } = useFaqItems(id)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyFaq)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = faqs.filter(f =>
    !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())
  )
  const totalUsage = faqs.reduce((sum, f) => sum + f.usage_count, 0)

  const openAdd = () => { setEditId(null); setForm(emptyFaq); setShowModal(true) }
  const openEdit = (faq: typeof faqs[0]) => {
    setEditId(faq.id)
    setForm({ question: faq.question, answer: faq.answer, trigger_keywords: faq.trigger_keywords.join(', ') })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) return
    setSaving(true)
    try {
      const keywords = form.trigger_keywords.split(',').map(k => k.trim()).filter(Boolean)
      if (isSupabaseConfigured()) {
        if (editId) {
          await mutations.updateFaqItem(editId, { question: form.question, answer: form.answer, trigger_keywords: keywords })
        } else {
          await mutations.createFaqItem({ business_id: id, question: form.question, answer: form.answer, trigger_keywords: keywords, is_active: true, usage_count: 0 })
        }
        refetch()
      } else {
        alert('Mode démo : les modifications seront disponibles une fois Supabase configuré.')
      }
    } catch (err) { console.error(err) }
    finally { setSaving(false); setShowModal(false) }
  }

  const handleDelete = async (faqId: string) => {
    try {
      if (isSupabaseConfigured()) { await mutations.deleteFaqItem(faqId); refetch() }
      else { alert('Mode démo : suppression non disponible.') }
    } catch (err) { console.error(err) }
    setDeleteId(null)
  }

  const handleToggle = async (faq: typeof faqs[0]) => {
    try {
      if (isSupabaseConfigured()) { await mutations.updateFaqItem(faq.id, { is_active: !faq.is_active }); refetch() }
      else { alert('Mode démo : modification non disponible.') }
    } catch (err) { console.error(err) }
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--color-gold)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{business?.name}</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>FAQ & Réponses auto</h1>
          </div>
          <button className="btn btn-gold" onClick={openAdd}><Plus size={16} /> Nouvelle réponse</button>
        </div>
      </div>
      <div className="page-content">
        <div className="responsive-grid-3" style={{ marginBottom: 24 }}>
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
                    <button className="btn btn-ghost btn-sm" style={{ padding: 8 }} onClick={() => openEdit(faq)} title="Modifier"><Edit2 size={14} /></button>
                    <button className="btn btn-ghost btn-sm" style={{ padding: 8, color: 'var(--color-error)' }} onClick={() => setDeleteId(faq.id)} title="Supprimer"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <Tag size={12} color="var(--color-text-subtle)" />
                    {faq.trigger_keywords.map((kw, i) => (
                      <span key={i} style={{ fontSize: 11, color: 'var(--color-text-muted)', background: 'var(--color-surface-2)', padding: '3px 8px', borderRadius: 6 }}>{kw}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{faq.usage_count} utilisations</span>
                    <button onClick={() => handleToggle(faq)} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
                      {faq.is_active ? <ToggleRight size={20} color="var(--color-success)" /> : <ToggleLeft size={20} color="var(--color-text-subtle)" />}
                      <span style={{ fontSize: 12, color: faq.is_active ? 'var(--color-success)' : 'var(--color-text-subtle)' }}>{faq.is_active ? 'Actif' : 'Inactif'}</span>
                    </button>
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

      {/* Modal Add/Edit FAQ */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>{editId ? 'Modifier la réponse' : 'Nouvelle réponse'}</h2>
              <button onClick={() => setShowModal(false)} className="btn btn-ghost btn-sm" style={{ padding: 8 }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label className="label">Question *</label><input className="input" value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} placeholder="Quels sont vos horaires ?" /></div>
              <div><label className="label">Réponse *</label><textarea className="input" rows={4} value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} placeholder="Nous sommes ouverts du lundi au samedi..." style={{ resize: 'vertical', lineHeight: 1.7 }} /></div>
              <div><label className="label">Mots-clés (séparés par des virgules)</label><input className="input" value={form.trigger_keywords} onChange={e => setForm({ ...form, trigger_keywords: e.target.value })} placeholder="horaires, ouverture, fermeture" /></div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-gold" onClick={handleSave} disabled={saving || !form.question.trim() || !form.answer.trim()} style={{ opacity: saving ? 0.6 : 1 }}>
                <Save size={16} /> {saving ? 'Enregistrement...' : editId ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmation Suppression */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Supprimer cette FAQ ?</h2>
            <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>Cette action est irréversible.</p>
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
