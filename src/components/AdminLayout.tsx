import { useAdmin } from '../hooks/useAdmin'
import { useAuth } from '../hooks/useAuth'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { Users, Tag, BarChart3, ExternalLink, LogOut, Shield, DollarSign, ListOrdered, Link } from 'lucide-react'

const nav = [
  { path: '/admin', label: 'Overview', icon: BarChart3, end: true },
  { path: '/admin/users', label: 'Users', icon: Users, end: false },
  { path: '/admin/waitlist', label: 'Waitlist', icon: ListOrdered, end: false },
  { path: '/admin/referrals', label: 'Referral Links', icon: Link, end: false },
  { path: '/admin/revenue', label: 'Revenue', icon: DollarSign, end: false },
  { path: '/admin/promo', label: 'Promo Codes', icon: Tag, end: false },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="flex h-screen bg-[var(--bg)]">
      {/* Sidebar */}
      <aside className="w-[240px] border-r border-[var(--border)] flex flex-col bg-[var(--surface)] shrink-0">
        {/* Brand */}
        <div className="px-5 pt-5 pb-4">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <span className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500/25 to-cyan-500/20 border border-brand-500/30">
              <svg width="18" height="18" viewBox="0 0 512 512" aria-hidden="true">
                <circle cx="256" cy="256" r="120" fill="none" stroke="#8B5CF6" strokeWidth="34" opacity="0.6" />
                <circle cx="256" cy="256" r="42" fill="#c4b5fd" />
              </svg>
            </span>
            <span className="font-display font-bold text-[var(--text)] text-lg tracking-tight">Lodestone</span>
          </Link>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-brand-400 font-medium">
            <Shield className="w-3.5 h-3.5" />
            Admin
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {nav.map(item => {
            const active = item.end
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path)
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] no-underline transition-colors ${
                  active
                    ? 'bg-brand-500/15 text-brand-400 font-medium'
                    : 'text-[var(--text-dim)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}

          <div className="my-3 border-t border-[var(--border)]" />

          <a
            href="https://dashboard.stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] no-underline text-[var(--text-dim)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          >
            <ExternalLink className="w-4 h-4" />
            Stripe Dashboard
          </a>
        </nav>

        {/* User */}
        <div className="p-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500/30 to-cyan-500/20 flex items-center justify-center text-brand-400 text-xs font-bold">
              {user?.displayName?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[var(--text)] truncate">{user?.displayName || 'Admin'}</p>
              <p className="text-[11px] text-[var(--text-dim)]">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-[var(--text-dim)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
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