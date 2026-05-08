'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, MessageCircle, HelpCircle, Settings, TrendingUp, Building2, ChevronLeft, Bell, LogOut, Menu, X } from 'lucide-react'
import { useBusinesses } from '@/lib/use-data'
import { signOutAction } from '@/app/actions'

const adminNav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Vue globale' },
  { href: '/dashboard/clients', icon: Building2, label: 'Clients' },
  { href: '/dashboard/analytics', icon: TrendingUp, label: 'Analytics' },
]

const clientNav = (id: string) => [
  { href: `/dashboard/client/${id}`, icon: LayoutDashboard, label: 'Tableau de bord' },
  { href: `/dashboard/client/${id}/leads`, icon: Users, label: 'Leads' },
  { href: `/dashboard/client/${id}/conversations`, icon: MessageCircle, label: 'Conversations' },
  { href: `/dashboard/client/${id}/faq`, icon: HelpCircle, label: 'FAQ / Réponses' },
  { href: `/dashboard/client/${id}/settings`, icon: Settings, label: 'Paramètres' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: businesses } = useBusinesses()
  const clientMatch = pathname.match(/\/dashboard\/client\/([^/]+)/)
  const currentClientId = clientMatch ? clientMatch[1] : null
  const currentClient = currentClientId ? businesses.find(b => b.id === currentClientId) : null
  const navItems = currentClientId ? clientNav(currentClientId) : adminNav
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile hamburger */}
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Ouvrir le menu">
        <Menu size={22} />
      </button>

      {/* Overlay mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--color-gold)' }}>NEXOVIA</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-subtle)', marginTop: 2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Dashboard</div>
          </Link>
          <button className="mobile-close-btn" onClick={closeSidebar} aria-label="Fermer le menu"><X size={20} /></button>
        </div>

        <nav className="sidebar-nav">
          {currentClientId && (
            <>
              <Link href="/dashboard/clients" className="sidebar-item" style={{ marginBottom: 8 }} onClick={closeSidebar}>
                <ChevronLeft size={16} /> Tous les clients
              </Link>
              <div style={{ padding: '12px 14px', marginBottom: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Client actif</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{currentClient?.name || 'Inconnu'}</div>
                <div style={{ fontSize: 11, color: 'var(--color-gold)', marginTop: 2 }}>
                  {currentClient?.offer_tier?.toUpperCase()} · {currentClient?.monthly_revenue} DT/mois
                </div>
              </div>
              <div className="divider-gold" style={{ margin: '8px 0' }} />
            </>
          )}

          {!currentClientId && <div className="sidebar-section-label">Navigation</div>}

          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href} className={`sidebar-item ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          })}

          {!currentClientId && (
            <>
              <div className="sidebar-section-label" style={{ marginTop: 8 }}>Accès rapide</div>
              {businesses.slice(0, 3).map((b) => (
                <Link key={b.id} href={`/dashboard/client/${b.id}`} className="sidebar-item" onClick={closeSidebar}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--color-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--color-gold)', flexShrink: 0 }}>
                    {b.name.charAt(0)}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}>{b.city}</div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <button className="sidebar-item" onClick={() => alert("Les notifications seront disponibles prochainement.")}>
            <Bell size={18} />
            Notifications
            <span style={{ marginLeft: 'auto', background: 'var(--color-gold)', color: '#0a0a12', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 99 }}>3</span>
          </button>
          <Link href="/" className="sidebar-item" onClick={closeSidebar}>
            <LogOut size={18} />
            Retour au site
          </Link>
          <form action={signOutAction}>
            <button type="submit" className="sidebar-item" style={{ color: 'var(--color-error)' }}>
              <LogOut size={18} />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      <main className="dashboard-content" style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  )
}
