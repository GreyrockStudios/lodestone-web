import { useEffect, useState, useRef } from 'react'
import { useAdmin } from '../../hooks/useAdmin'
import { Copy, ExternalLink, Link, Plus, Users } from 'lucide-react'

interface RefData {
  ref: string
  count: number
}

interface RecentSignup {
  id: string
  email: string
  displayName: string
  ref: string
  createdAt: string
}

interface ReferralData {
  refs: RefData[]
  totals: { total: number; withRef: number; organic: number }
  recentSignups: RecentSignup[]
}

const PRESET_CHANNELS = [
  { ref: 'producthunt', label: 'Product Hunt', desc: 'Product launch & directory' },
  { ref: 'reddit', label: 'Reddit', desc: 'Community posts & comments' },
  { ref: 'twitter', label: 'Twitter/X', desc: 'Social media posts' },
  { ref: 'youtube', label: 'YouTube', desc: 'Video content & descriptions' },
  { ref: 'discord', label: 'Discord', desc: 'Community server shares' },
  { ref: 'hackernews', label: 'Hacker News', desc: 'Show HN posts' },
  { ref: 'indiehackers', label: 'Indie Hackers', desc: 'Founder community' },
  { ref: 'google', label: 'Google', desc: 'Organic & paid search' },
  { ref: 'direct', label: 'Direct', desc: 'General sharing link' },
]

const BASE_URL = 'https://heylodestone.com'

export default function AdminReferrals() {
  const { adminFetch } = useAdmin()
  const adminFetchRef = useRef(adminFetch)
  adminFetchRef.current = adminFetch

  const [data, setData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [customRef, setCustomRef] = useState('')
  const [customLinks, setCustomLinks] = useState<string[]>([])

  useEffect(() => {
    adminFetchRef.current<ReferralData>('/referrals')
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const copyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const addCustomLink = () => {
    const ref = customRef.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 50)
    if (ref && !customLinks.includes(ref)) {
      setCustomLinks([...customLinks, ref])
      setCustomRef('')
    }
  }

  const linkUrl = (ref: string) => `${BASE_URL}/?ref=${ref}`
  const registerUrl = (ref: string) => `${BASE_URL}/register?ref=${ref}`

  const refCounts: Record<string, number> = {}
  data?.refs.forEach(r => { refCounts[r.ref] = r.count })

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
          <p className="text-red-400 font-medium">Failed to load referral data</p>
          <p className="text-red-300/60 text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Referral Links</h1>
        <p className="text-[var(--text-dim)] text-sm mt-1">Generate trackable links to measure where signups come from</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-[var(--text-dim)] mb-1">Total signups</p>
          <p className="text-xl font-bold text-[var(--text)]">{data?.totals.total.toLocaleString() || 0}</p>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-[var(--text-dim)] mb-1">Via referral</p>
          <p className="text-xl font-bold text-[var(--text)]">{data?.totals.withRef.toLocaleString() || 0}</p>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-[var(--text-dim)] mb-1">Organic</p>
          <p className="text-xl font-bold text-[var(--text)]">{data?.totals.organic.toLocaleString() || 0}</p>
        </div>
      </div>

      {/* Preset channels */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold mb-3">Channel Links</h2>
        <div className="space-y-2">
          {PRESET_CHANNELS.map(ch => {
            const count = refCounts[ch.ref] || 0
            return (
              <div key={ch.ref} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--text)]">{ch.label}</span>
                    {count > 0 && <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-brand-500/15 text-brand-400 font-medium">{count}</span>}
                  </div>
                  <p className="text-xs text-[var(--text-dim)]">{ch.desc}</p>
                  <p className="text-xs text-[var(--text-dim)] font-mono mt-0.5">{linkUrl(ch.ref)}</p>
                </div>
                <button
                  onClick={() => copyLink(linkUrl(ch.ref), ch.ref)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-brand-500/10 transition-colors inline-flex items-center gap-1.5 shrink-0"
                >
                  {copied === ch.ref ? '✓ Copied' : <><Copy className="w-3 h-3" /> Copy</>}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Custom links */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold mb-3">Custom Links</h2>
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-dim)] font-mono">{BASE_URL}/?ref=</span>
            <input
              type="text"
              value={customRef}
              onChange={e => setCustomRef(e.target.value)}
              placeholder="influencer-name"
              className="w-full pl-[170px] pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm focus:border-brand-500/50 outline-none"
              onKeyDown={e => e.key === 'Enter' && addCustomLink()}
            />
          </div>
          <button onClick={addCustomLink} className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors inline-flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Create
          </button>
        </div>
        {customLinks.map(ref => {
          const count = refCounts[ref] || 0
          return (
            <div key={ref} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--text)]">{ref}</span>
                  {count > 0 && <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-brand-500/15 text-brand-400 font-medium">{count}</span>}
                </div>
                <p className="text-xs text-[var(--text-dim)] font-mono">{linkUrl(ref)}</p>
              </div>
              <button
                onClick={() => copyLink(linkUrl(ref), `custom-${ref}`)}
                className="px-3 py-1.5 rounded-lg text-xs bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-brand-500/10 transition-colors inline-flex items-center gap-1.5 shrink-0"
              >
                {copied === `custom-${ref}` ? '✓ Copied' : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
            </div>
          )
        })}
      </div>

      {/* Recent referrals */}
      {data && data.recentSignups.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3">Recent Signups by Channel</h2>
          <div className="space-y-1.5">
            {data.recentSignups.slice(0, 20).map(s => (
              <div key={s.id} className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20">{s.ref}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text)] truncate">{s.displayName || s.email}</p>
                </div>
                <span className="text-xs text-[var(--text-dim)]">{new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}