import { useEffect, useState, useRef } from 'react'
import { useAdmin } from '../../hooks/useAdmin'
import { Link } from 'react-router-dom'
import { Crown, Star, Users, Zap, ArrowUpRight } from 'lucide-react'

interface Stats {
  totalUsers: number
  signups7d: number
  subscriptions: Record<string, number>
  totalMessages: number
  activeUsers30d: number
  activeTrials: number
  recentSignups?: { date: string; count: number }[]
}

const TIER_META: Record<string, { name: string; short: string; price: string; dot: string; group: string }> = {
  'founding-studio-plus': { name: 'Founding Partner', short: 'Partner', price: '$600', dot: 'bg-amber-400', group: 'Founding' },
  'founding-studio': { name: 'Founding Studio', short: 'Studio', price: '$250', dot: 'bg-cyan-400', group: 'Founding' },
  'founding-pro': { name: 'Founding Pro', short: 'Pro', price: '$100', dot: 'bg-brand-400', group: 'Founding' },
  'founding-pro-early': { name: 'Founding Pro · Early Bird', short: 'Early Bird', price: '$50', dot: 'bg-brand-300', group: 'Founding' },
  'access': { name: 'Founding Access', short: 'Access', price: '$15', dot: 'bg-emerald-400', group: 'Founding' },
  'enterprise': { name: 'Enterprise', short: 'Enterprise', price: 'Custom', dot: 'bg-purple-400', group: 'GA' },
  'team': { name: 'Studio', short: 'Studio', price: '$60/mo', dot: 'bg-cyan-400', group: 'GA' },
  'pro': { name: 'Pro', short: 'Pro', price: '$30/mo', dot: 'bg-brand-400', group: 'GA' },
  'free': { name: 'Community', short: 'Free', price: '$0', dot: 'bg-gray-400', group: 'GA' },
}

const STAT_CARDS = [
  { key: 'totalUsers', label: 'Total Users', icon: Users, format: (v: number) => v.toLocaleString() },
  { key: 'signups7d', label: 'New (7d)', icon: Star, format: (v: number) => v.toLocaleString() },
  { key: 'paidUsers', label: 'Paid', icon: Zap, format: (v: number) => v.toLocaleString() },
  { key: 'totalMessages', label: 'Messages', icon: Crown, format: (v: number) => v.toLocaleString() },
  { key: 'activeUsers30d', label: 'Active (30d)', icon: ArrowUpRight, format: (v: number) => v.toLocaleString() },
]

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
      <div className="p-8 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-[var(--surface-2)] rounded" />
          <div className="grid grid-cols-5 gap-4">{[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-[var(--surface-2)] rounded-xl" />)}</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
          <p className="text-red-400 font-medium">Failed to load stats</p>
          <p className="text-red-300/60 text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  const subs = stats?.subscriptions || {}
  const totalPaid = Object.entries(subs).reduce((sum, [t, c]) => t !== 'free' ? sum + c : sum, 0)
  const values: Record<string, number> = { ...stats, paidUsers: totalPaid } as any

  const foundingTiers = Object.entries(TIER_META).filter(([, m]) => m.group === 'Founding')
  const gaTiers = Object.entries(TIER_META).filter(([, m]) => m.group === 'GA')

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-[var(--text-dim)] text-sm mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {STAT_CARDS.map(card => {
          const Icon = card.icon
          return (
            <div key={card.key} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Icon className="w-3.5 h-3.5 text-[var(--text-dim)]" />
                <span className="text-[11px] uppercase tracking-wider text-[var(--text-dim)]">{card.label}</span>
              </div>
              <p className="text-xl font-bold text-[var(--text)]">{card.format(values[card.key] ?? 0)}</p>
            </div>
          )
        })}
      </div>

      {/* Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Founding */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="text-sm font-semibold">Founding Packages</h2>
            <span className="text-[11px] text-[var(--text-dim)] uppercase tracking-wider">one-time</span>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {foundingTiers.map(([tier, meta]) => {
              const count = subs[tier] || 0
              return (
                <div key={tier} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                    <div>
                      <p className="text-sm text-[var(--text)]">{meta.name}</p>
                      <p className="text-[11px] text-[var(--text-dim)]">{meta.price}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium tabular-nums ${count > 0 ? 'text-[var(--text)]' : 'text-[var(--text-dim)]'}`}>
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* GA */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="text-sm font-semibold">GA Plans</h2>
            <span className="text-[11px] text-[var(--text-dim)] uppercase tracking-wider">monthly</span>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {gaTiers.map(([tier, meta]) => {
              const count = subs[tier] || 0
              return (
                <div key={tier} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                    <div>
                      <p className="text-sm text-[var(--text)]">{meta.name}</p>
                      <p className="text-[11px] text-[var(--text-dim)]">{meta.price}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium tabular-nums ${count > 0 ? 'text-[var(--text)]' : 'text-[var(--text-dim)]'}`}>
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Link to="/admin/users" className="group flex items-center gap-4 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-brand-500/30 transition-all no-underline">
          <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 group-hover:bg-brand-500/20 transition-colors">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text)]">Manage Users</p>
            <p className="text-xs text-[var(--text-dim)]">Search, view details, change tiers</p>
          </div>
        </Link>
        <Link to="/admin/promo" className="group flex items-center gap-4 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-brand-500/30 transition-all no-underline">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text)]">Promo Codes</p>
            <p className="text-xs text-[var(--text-dim)]">Create and manage promotional codes</p>
          </div>
        </Link>
      </div>
    </div>
  )
}