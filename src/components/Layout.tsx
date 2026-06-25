import { useAuth } from '../hooks/useAuth'
import { useAdmin } from '../hooks/useAdmin'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const { isAdmin } = useAdmin()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Chat page has its own combined sidebar — hide the main Layout sidebar
  const isChatPage = location.pathname.startsWith('/chat')

  if (isChatPage) {
    // Chat manages its own sidebar, just render the child
    return <>{children}</>
  }

  const navItems = [
    { path: '/chat', label: 'Chat', icon: '💬' },
    { path: '/memory', label: 'Memory', icon: '🕸️' },
    { path: '/identity', label: 'Identity', icon: '🧠' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <div className="flex h-screen bg-[var(--bg)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-50 md:z-auto
        w-60 h-full
        border-r border-[var(--border)] flex flex-col bg-[var(--surface)]
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 no-underline" onClick={() => setSidebarOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 512 512">
                <circle cx="256" cy="256" r="22" fill="#8B5CF6" opacity="0.85"/>
                <circle cx="256" cy="256" r="10" fill="#fff" opacity="0.95"/>
              </svg>
              <span className="font-bold text-lg text-[var(--text)]">Lodestone</span>
            </Link>
            {/* Close button on mobile */}
            <button
              className="md:hidden p-1 text-[var(--text-muted)] hover:text-[var(--text)]"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm no-underline transition-colors ${
                location.pathname === item.path || (item.path === '/chat' && location.pathname.startsWith('/chat'))
                  ? 'bg-brand-500/15 text-brand-400'
                  : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}

          {isAdmin && (
            <>
              <div className="my-2 mx-3 border-t border-[var(--border)]" />
              <Link
                to="/admin"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm no-underline transition-colors ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-brand-500/15 text-brand-400'
                    : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                }`}
              >
                <span>🛡️</span>
                Admin
              </Link>
            </>
          )}
        </nav>

        <div className="p-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-sm font-bold flex-shrink-0">
              {user?.displayName?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text)] truncate">{user?.displayName}</p>
              <p className="text-xs text-[var(--text-dim)]">{user?.tier || 'free'}</p>
            </div>
            <button
              onClick={logout}
              className="text-[var(--text-dim)] hover:text-[var(--danger)] transition-colors flex-shrink-0"
              title="Sign out"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header bar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)] flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 512 512">
              <circle cx="256" cy="256" r="22" fill="#8B5CF6" opacity="0.85"/>
              <circle cx="256" cy="256" r="10" fill="#fff" opacity="0.95"/>
            </svg>
            <span className="font-bold text-[var(--text)]">Lodestone</span>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}