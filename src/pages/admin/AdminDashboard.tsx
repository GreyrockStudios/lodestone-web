import { useEffect, useState, useRef } from 'react'
import { useAdmin } from '../../hooks/useAdmin'
import { Link } from 'react-router-dom'
import { Crown, Star, Users, Zap } from 'lucide-react'

interface Stats {
  totalUsers: number
  signups7d: number
  subscriptions: Record<string, number>
  totalMessages: number
  activeUsers30d: number
  activeTrials: number
  recentSignups?: { date: string; count: number }[]
}

const TIER_META: Record<string, { name: string; color: string; icon: typeof Crown; group: string }> = {
  free: { name: 'Community', color: 'bg-gray-500/20 text-gray-300', icon: Star, group: 'GA' },
  access: { name: 'Founding Access', color: 'bg-emerald-500/20 text-emerald-400', icon: Star, group: 'Founding' },
  'founding-pro-early': { name: 'Founding Pro · Early Bird', color: 'bg-brand-500/20 text-brand-400', icon: Zap, group: 'Founding' },
  'founding-pro': { name: 'Founding Pro', color: 'bg-brand-500/20 text-brand-300', icon: Zap, group: 'Founding' },
  'founding-studio': { name: 'Founding Studio', color: 'bg-cyan-500/20 text-cyan-400', icon: Crown, group: 'Founding' },
  'founding-studio-plus': { name: 'Founding Partner', color: 'bg-amber-500/20 text-amber-400', icon: Crown, group: 'Founding' },
  pro: { name: 'Pro', color: 'bg-brand-500/20 text-brand-400', icon: Zap, group: 'GA' },
  team: { name: 'Studio', color: 'bg-cyan-500/20 text-cyan-400', icon: Crown, group: 'GA' },
  enterprise: { name: 'Enterprise', color: 'bg-purple-500/20 text-purple-400', icon: Crown, group: 'GA' },
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

  const subs = stats?.subscriptions || {}
  const totalPaid = Object.entries(subs).reduce((sum, [tier, count]) => tier !== 'free' ? sum + count : sum, 0)

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: <Users className="w-5 h-5" />, color: 'brand' },
    { label: 'Signups (7d)', value: stats?.signups7d ?? 0, icon: <Star className="w-5 h-5" />, color: 'cyan' },
    { label: 'Paid Users', value: totalPaid, icon: <Zap className="w-5 h-5" />, color: 'brand' },
    { label: 'Chat Messages', value: stats?.totalMessages ?? 0, icon: <Crown className="w-5 h-5" />, color: 'cyan' },
    { label: 'Active (30d)', value: stats?.activeUsers30d ?? 0, icon: <Users className="w-5 h-5" />, color: 'brand' },
  ]

  const foundingTiers = Object.entries(TIER_META).filter(([, m]) => m.group === 'Founding')
  const gaTiers = Object.entries(TIER_META).filter(([, m]) => m.group === 'GA')

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
          <div key={card.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 hover:border-brand-500/30 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-[var(--text-dim)]">{card.icon}<span className="text-xs uppercase tracking-wider">{card.label}</span></div>
            <p className="text-2xl font-bold text-[var(--text)]">{(card.value ?? 0).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Subscription breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Founding Packages</h2>
          <div className="space-y-3">
            {foundingTiers.map(([tier, meta]) => {
              const count = subs[tier] || 0
              const Icon = meta.icon
              return (
                <div key={tier} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[var(--text-dim)]" />
                    <span className="text-sm text-[var(--text)]">{meta.name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${meta.color}`}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">GA Plans</h2>
          <div className="space-y-3">
            {gaTiers.map(([tier, meta]) => {
              const count = subs[tier] || 0
              const Icon = meta.icon
              return (
                <div key={tier} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[var(--text-dim)]" />
                    <span className="text-sm text-[var(--text)]">{meta.name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${meta.color}`}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link to="/admin/users" className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] hover:border-brand-500/40 transition-all no-underline">
            <span className="text-xl">👥</span>
            <div><p className="text-sm font-medium text-[var(--text)]">User Management</p><p className="text-xs text-[var(--text-muted)]">Search, manage, and edit users</p></div>
          </Link>
          <Link to="/admin/promo" className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] hover:border-brand-500/40 transition-all no-underline">
            <span className="text-xl">🎟️</span>
            <div><p className="text-sm font-medium text-[var(--text)]">Promo Codes</p><p className="text-xs text-[var(--text-muted)]">Create and manage promotional codes</p></div>
          </Link>
          <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] hover:border-brand-500/40 transition-all no-underline">
            <span className="text-xl">💳</span>
            <div><p className="text-sm font-medium text-[var(--text)]">Stripe Dashboard</p><p className="text-xs text-[var(--text-muted)]">View payments and customers</p></div>
          </a>
        </div>
      </div>
    </div>
  )
}