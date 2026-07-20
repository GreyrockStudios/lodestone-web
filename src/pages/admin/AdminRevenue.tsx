import { useEffect, useState, useRef } from 'react'
import { useAdmin } from '../../hooks/useAdmin'
import { DollarSign, TrendingUp, Users, CreditCard } from 'lucide-react'

interface RevenueData {
  totalFoundingRevenue: number
  foundingBreakdown: Record<string, { count: number; revenue: number }>
  stripeRevenue30d: number
  recentPayments: { id: string; amount: number; currency: string; customerId: string; description: string | null; created: string }[]
  subscriptionCounts: Record<string, number>
}

const TIER_LABELS: Record<string, string> = {
  access: 'Founding Access',
  'founding-pro-early': 'Founding Pro · Early Bird',
  'founding-pro': 'Founding Pro',
  'founding-studio': 'Founding Studio',
  'founding-studio-plus': 'Founding Partner',
}

const TIER_DOTS: Record<string, string> = {
  access: 'bg-emerald-400',
  'founding-pro-early': 'bg-brand-300',
  'founding-pro': 'bg-brand-400',
  'founding-studio': 'bg-cyan-400',
  'founding-studio-plus': 'bg-amber-400',
}

export default function AdminRevenue() {
  const { adminFetch } = useAdmin()
  const adminFetchRef = useRef(adminFetch)
  adminFetchRef.current = adminFetch

  const [data, setData] = useState<RevenueData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    adminFetchRef.current<RevenueData>('/revenue')
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-[var(--surface-2)] rounded" />
          <div className="grid grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-[var(--surface-2)] rounded-xl" />)}</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
          <p className="text-red-400 font-medium">Failed to load revenue data</p>
          <p className="text-red-300/60 text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  const d = data!

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Revenue</h1>
        <p className="text-[var(--text-dim)] text-sm mt-1">Founding packages and Stripe payments</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <DollarSign className="w-3.5 h-3.5 text-[var(--text-dim)]" />
            <span className="text-[11px] uppercase tracking-wider text-[var(--text-dim)]">Founding Revenue</span>
          </div>
          <p className="text-xl font-bold text-[var(--text)]">${d.totalFoundingRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <CreditCard className="w-3.5 h-3.5 text-[var(--text-dim)]" />
            <span className="text-[11px] uppercase tracking-wider text-[var(--text-dim)]">Stripe (30d)</span>
          </div>
          <p className="text-xl font-bold text-[var(--text)]">${d.stripeRevenue30d.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Users className="w-3.5 h-3.5 text-[var(--text-dim)]" />
            <span className="text-[11px] uppercase tracking-wider text-[var(--text-dim)]">Total Revenue</span>
          </div>
          <p className="text-xl font-bold text-[var(--text)]">${(d.totalFoundingRevenue + d.stripeRevenue30d).toLocaleString()}</p>
        </div>
      </div>

      {/* Founding breakdown */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden mb-6">
        <div className="px-5 py-3.5 border-b border-[var(--border)]">
          <h2 className="text-sm font-semibold">Founding Package Breakdown</h2>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {Object.entries(TIER_LABELS).map(([tier, label]) => {
            const b = d.foundingBreakdown[tier]
            return (
              <div key={tier} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${TIER_DOTS[tier] || 'bg-gray-400'}`} />
                  <span className="text-sm text-[var(--text)]">{label}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-[var(--text-dim)]">{b?.count || 0} sold</span>
                  <span className="text-[var(--text)] font-medium tabular-nums">${(b?.revenue || 0).toLocaleString()}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent payments */}
      {d.recentPayments.length > 0 && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[var(--border)]">
            <h2 className="text-sm font-semibold">Recent Stripe Payments</h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {d.recentPayments.map(p => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text)] truncate">{p.description || 'Payment'}</p>
                  <p className="text-xs text-[var(--text-dim)]">
                    {new Date(p.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {p.customerId ? p.customerId.slice(0, 12) + '...' : 'No customer'}
                  </p>
                </div>
                <span className="text-sm font-medium text-[var(--text)] tabular-nums ml-4">${p.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}