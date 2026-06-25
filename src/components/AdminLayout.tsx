import { useAdmin } from '../hooks/useAdmin'
import { useAuth } from '../hooks/useAuth'
import { Link, useLocation, Outlet } from 'react-router-dom'

const adminNav = [
  { path: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { path: '/admin/users', label: 'Users', icon: '👥' },
  { path: '/admin/promo', label: 'Promo Codes', icon: '🎟️' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="flex h-screen bg-[var(--bg)]">
      {/* Sidebar */}
      <aside className="w-60 border-r border-[var(--border)] flex flex-col bg-[var(--surface)]">
        <div className="p-4 border-b border-[var(--border)]">
          <Link to="/chat" className="flex items-center gap-2 no-underline">
            <svg width="24" height="24" viewBox="0 0 512 512">
              <circle cx="256" cy="256" r="22" fill="#8B5CF6" opacity="0.85"/>
              <circle cx="256" cy="256" r="10" fill="#fff" opacity="0.95"/>
            </svg>
            <span className="font-bold text-lg text-[var(--text)]">Lodestone</span>
          </Link>
          <div className="mt-2 px-2 py-1 rounded bg-brand-500/15 text-brand-400 text-xs font-semibold inline-block">
            Admin Panel
          </div>
        </div>

        <nav className="flex-1 p-2 space-y-0.5">
          {/* Admin section */}
          <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            Admin
          </div>
          {adminNav.map(item => {
            const isActive = item.end
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm no-underline transition-colors ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-400'
                    : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}

          <div className="my-2 border-t border-[var(--border)]" />

          {/* User section */}
          <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            App
          </div>
          <Link
            to="/chat"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm no-underline text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          >
            <span>📊</span> Dashboard
          </Link>
          <Link
            to="/chat"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm no-underline text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          >
            <span>💬</span> Chat
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm no-underline text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          >
            <span>⚙️</span> Settings
          </Link>
        </nav>

        <div className="p-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-sm font-bold">
              {user?.displayName?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text)] truncate">{user?.displayName}</p>
              <p className="text-xs text-[var(--text-dim)]">admin</p>
            </div>
            <button
              onClick={logout}
              className="text-[var(--text-dim)] hover:text-[var(--danger)] transition-colors"
              title="Sign out"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}