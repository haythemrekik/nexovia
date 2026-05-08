'use client'
import { use, useState } from 'react'
import { Bot, Phone, Circle, Send, AtSign, MessageCircle } from 'lucide-react'
import { useBusiness, useLeads, useConversations } from '@/lib/use-data'

export default function ConversationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: business } = useBusiness(id)
  const { data: convos } = useConversations(id)
  const { data: leads } = useLeads(id)
  const [selected, setSelected] = useState<string | null>(null)

  // Auto-select first conversation
  const activeId = selected || convos[0]?.id || null
  const activeConvo = convos.find(c => c.id === activeId)

  return (
    <div>
      <div className="page-header">
        <p style={{ fontSize: 12, color: 'var(--color-gold)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{business?.name}</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>Conversations</h1>
      </div>
      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 0, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: 'calc(100vh - 200px)', minHeight: 500 }}>
          {/* Thread list */}
          <div style={{ background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', overflowY: 'auto' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)' }}>{convos.length} conversations</div>
            </div>
            {convos.map(c => {
              const lead = leads.find(l => l.id === c.lead_id)
              const last = c.messages[c.messages.length - 1]
              const isActive = c.id === activeId
              return (
                <button key={c.id} onClick={() => setSelected(c.id)} style={{
                  width: '100%', padding: '16px', border: 'none', borderBottom: '1px solid var(--color-border)', cursor: 'pointer', textAlign: 'left',
                  background: isActive ? 'var(--color-surface-2)' : 'transparent', transition: 'background 0.15s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: c.needs_human ? 'var(--color-warning-bg)' : 'var(--color-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {c.needs_human ? <Phone size={14} color="var(--color-warning)" /> : <Bot size={14} color="var(--color-gold)" />}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text)' }}>{lead?.first_name || 'Inconnu'} {lead?.last_name || ''}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}>{lead?.instagram_username}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      {!c.is_resolved && <span className="notif-dot" />}
                      <span style={{ fontSize: 10, color: 'var(--color-text-subtle)' }}>{c.messages.length} msg</span>
                    </div>
                  </div>
                  {last && <div style={{ fontSize: 12, color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: 46 }}>{last.content.substring(0, 60)}...</div>}
                </button>
              )
            })}
            {convos.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>Aucune conversation</div>}
          </div>

          {/* Chat view */}
          <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
            {activeConvo ? (
              <>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-surface)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <AtSign size={16} color="var(--color-gold)" />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{leads.find(l => l.id === activeConvo.lead_id)?.first_name} {leads.find(l => l.id === activeConvo.lead_id)?.last_name}</span>
                    <span className={`badge ${activeConvo.is_resolved ? 'badge-neutral' : 'badge-success'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Circle size={5} fill="currentColor" />{activeConvo.is_resolved ? 'Résolu' : 'Actif'}
                    </span>
                  </div>
                  <span className="badge badge-neutral">{activeConvo.platform}</span>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {activeConvo.messages.map(msg => (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'assistant' ? 'flex-start' : 'flex-end' }}>
                      <div style={{
                        maxWidth: '70%', padding: '12px 16px', borderRadius: msg.role === 'assistant' ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                        background: msg.role === 'assistant' ? 'var(--color-surface)' : 'rgba(201,169,110,0.15)',
                        border: `1px solid ${msg.role === 'assistant' ? 'var(--color-border)' : 'rgba(201,169,110,0.3)'}`,
                      }}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: msg.role === 'assistant' ? 'var(--color-gold)' : 'var(--color-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {msg.role === 'assistant' ? '🤖 Bot IA' : '👤 Client'}
                        </div>
                        <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text)' }}>{msg.content}</div>
                        <div style={{ fontSize: 10, color: 'var(--color-text-subtle)', marginTop: 8, textAlign: 'right' }}>
                          {new Date(msg.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input className="input" placeholder="Répondre manuellement..." disabled style={{ flex: 1, opacity: 0.5 }} />
                  <button className="btn btn-gold btn-sm" disabled style={{ opacity: 0.5 }}><Send size={14} /></button>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'var(--color-text-muted)' }}>
                <MessageCircle size={40} style={{ opacity: 0.2 }} />
                <div>Sélectionnez une conversation</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
