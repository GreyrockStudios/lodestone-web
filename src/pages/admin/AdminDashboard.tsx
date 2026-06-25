import { useEffect, useState, useRef } from 'react'
import { useAdmin } from '../../hooks/useAdmin'
import { Link } from 'react-router-dom'

interface Stats {
  totalUsers: number
  signups7d: number
  subscriptions: { free: number; desktop: number; pro: number }
  totalMessages: number
  activeUsers30d: number
  activeTrials: number
}

export default function AdminDashboard() {
  const { adminFetch } = useAdmin()
  const adminFetchRef = useRef(adminFetch)
  adminFetchRef.current = adminFetch

  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminFetchRef.current<Stats>('/stats')
      .then(setStats)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto animate-fade-in">
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-[var(--text-muted)]">Loading stats...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 max-w-5xl mx-auto animate-fade-in">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
          <p className="text-red-400 font-medium">Error loading stats</p>
          <p className="text-red-300/70 text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: '👥', color: 'brand' },
    { label: 'Signups (7d)', value: stats?.signups7d ?? 0, icon: '📈', color: 'cyan' },
    { label: 'Chat Messages', value: stats?.totalMessages ?? 0, icon: '💬', color: 'brand' },
    { label: 'Active Users (30d)', value: stats?.activeUsers30d ?? 0, icon: '🔵', color: 'cyan' },
    { label: 'Active Trials', value: stats?.activeTrials ?? 0, icon: '⏳', color: 'brand' },
  ]

  const tierColors: Record<string, string> = {
    free: 'bg-gray-500/20 text-gray-300',
    desktop: 'bg-brand-500/20 text-brand-400',
    pro: 'bg-cyan-500/20 text-cyan-400',
  }

  const tiers = stats ? [
    { name: 'Free', count: stats.subscriptions.free, color: tierColors.free },
    { name: 'Desktop', count: stats.subscriptions.desktop, color: tierColors.desktop },
    { name: 'Pro', count: stats.subscriptions.pro, color: tierColors.pro },
  ] : []

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">System overview at a glance</p>
        </div>
        <div className="text-xs text-[var(--text-dim)]">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {cards.map(card => (
          <div
            key={card.label}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 hover:border-brand-500/30 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{card.icon}</span>
              <span className="text-xs text-[var(--text-dim)] uppercase tracking-wider">{card.label}</span>
            </div>
            <p className="text-2xl font-bold text-[var(--text)]">
              {(card.value ?? 0).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Subscription breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Subscriptions by Tier</h2>
          <div className="space-y-3">
            {tiers.map(tier => {
              const total = stats ? (stats.subscriptions.free + stats.subscriptions.desktop + stats.subscriptions.pro) : 1
              const pct = stats ? Math.round((tier.count / total) * 100) : 0
              return (
                <div key={tier.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[var(--text)]">{tier.name}</span>
                    <span className="text-[var(--text-muted)]">{tier.count.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--surface-2)]">
                    <div
                      className={`h-2 rounded-full ${tier.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <div className="space-y-3">
            <Link
              to="/admin/users"
              className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] hover:border-brand-500/40 transition-all no-underline"
            >
              <span className="text-xl">👥</span>
              <div>
                <p className="text-sm font-medium text-[var(--text)]">User Management</p>
                <p className="text-xs text-[var(--text-muted)]">Search, manage, and edit users</p>
              </div>
            </Link>
            <Link
              to="/admin/promo"
              className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] hover:border-brand-500/40 transition-all no-underline"
            >
              <span className="text-xl">🎟️</span>
              <div>
                <p className="text-sm font-medium text-[var(--text)]">Promo Codes</p>
                <p className="text-xs text-[var(--text-muted)]">Create and manage promotional codes</p>
              </div>
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] hover:border-brand-500/40 transition-all no-underline"
            >
              <span className="text-xl">📊</span>
              <div>
                <p className="text-sm font-medium text-[var(--text)]">User Dashboard</p>
                <p className="text-xs text-[var(--text-muted)]">Back to your personal dashboard</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
