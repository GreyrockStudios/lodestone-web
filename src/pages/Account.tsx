import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Eye, EyeOff, CreditCard, AlertTriangle, ChevronLeft, Shield, Zap, Coins, ArrowRight, RefreshCw } from 'lucide-react'

const tierInfo: Record<string, { name: string; color: string; bgColor: string; description: string }> = {
  free: { name: 'Community', color: 'text-gray-400', bgColor: 'bg-gray-500/20', description: 'Ollama Cloud · $5 bonus' },
  pro: { name: 'Pro', color: 'text-brand-400', bgColor: 'bg-brand-500/20', description: 'Full power user suite, priority support' },
  team: { name: 'Studio', color: 'text-cyan-400', bgColor: 'bg-cyan-500/20', description: 'Multi-agent, team sharing, API access' },
  enterprise: { name: 'Enterprise', color: 'text-amber-400', bgColor: 'bg-amber-500/20', description: 'Custom deployment & support' },
}

interface CreditUsage {
  creditsUsed: number
  creditsUsedDisplay: string
  creditsRemaining: number
  creditsRemainingDisplay: string
  monthlyCredits: number
  monthlyCreditsDisplay: string
  creditPacksRemaining: number
  creditPacksRemainingDisplay: string
  plan: string
  planDisplayName: string
  periodStart: string
  periodEnd: string
}

const CREDIT_PACKS = [
  { id: 'standard', label: 'Standard', credits: '$10.00', price: '$10.00', desc: '~20,000 messages', popular: true },
  { id: 'pro', label: 'Pro', credits: '$25.00', price: '$25.00', desc: '~50,000 messages' },
  { id: 'bulk', label: 'Bulk', credits: '$50.00', price: '$50.00', desc: '~100,000 messages' },
]

export default function Account() {
  const { user, accessToken, logout } = useAuth()
  const navigate = useNavigate()
  const token = accessToken || localStorage.getItem('lodestone_access_token')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [usage, setUsage] = useState<CreditUsage | null>(null)
  const [usageLoading, setUsageLoading] = useState(true)
  const [autoTopUp, setAutoTopUp] = useState(false)
  const [autoTopUpAmount, setAutoTopUpAmount] = useState('standard')
  const [autoTopUpThreshold, setAutoTopUpThreshold] = useState('1.00')
  const [autoTopUpMonthlyMax, setAutoTopUpMonthlyMax] = useState('10')
  const [autoTopUpCustomMax, setAutoTopUpCustomMax] = useState('')

  const tier = user?.tier || 'free'
  const info = tierInfo[tier] || tierInfo.free

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  useEffect(() => {
    if (!token) return
    fetch('/api/usage/credits', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { setUsage(data); setUsageLoading(false) })
      .catch(() => setUsageLoading(false))
  }, [token])

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 8) { setPasswordError('Password must be at least 8 characters'); return }
    if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match'); return }
    if (!currentPassword) { setPasswordError('Current password is required'); return }
    setPasswordSaving(true)
    setPasswordError('')
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword })
      })
      if (res.ok) {
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
        showToast('Password changed successfully')
      } else {
        const data = await res.json().catch(() => ({}))
        setPasswordError(data.error || 'Failed to change password')
      }
    } catch {
      setPasswordError('Failed to change password')
    } finally {
      setPasswordSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      headers['Authorization'] = 'Bearer ' + token
      const res = await fetch('/api/user/me', { method: 'DELETE', headers })
      if (res.ok) {
        localStorage.removeItem('lodestone_access_token')
        localStorage.removeItem('lodestone_api_key')
        localStorage.removeItem('lodestone_refresh_token')
        window.location.href = '/'
      } else {
        const data = await res.json().catch(() => ({}))
        showToast(data.error || 'Failed to delete account')
      }
    } catch {
      showToast('Failed to delete account')
    }
  }

  const handleBuyCredits = async (packId: string) => {
    try {
      const res = await fetch('/api/usage/packs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ packId })
      })
      if (res.status === 402) {
        // Stripe checkout needed — redirect
        const data = await res.json()
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl
        } else {
          showToast('Credit purchases coming soon!')
        }
      } else if (res.ok) {
        showToast('Credits added!')
      } else {
        showToast('Failed to purchase credits')
      }
    } catch {
      showToast('Failed to purchase credits')
    }
  }

  const handleManageBilling = async () => {
    try {
      // Get the user's stripe customer ID from their subscription
      const subRes = await fetch('/api/user/me', { headers: { Authorization: `Bearer ${token}` } })
      const userData = await subRes.json()
      if (!userData.stripeCustomerId) {
        showToast('No billing account found. Subscribe first.')
        return
      }
      const portalRes = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ stripeCustomerId: userData.stripeCustomerId })
      })
      const portalData = await portalRes.json()
      if (portalData.url) {
        window.location.href = portalData.url
      } else {
        showToast('Failed to open billing portal')
      }
    } catch {
      showToast('Failed to open billing portal')
    }
  }

  const creditsPercent = usage && usage.monthlyCredits !== -1
    ? Math.min(Math.round((usage.creditsUsed / usage.monthlyCredits) * 100), 100)
    : 0

  return (
    <div className="h-full bg-[var(--bg)] text-[var(--text)] overflow-auto">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg bg-brand-500 text-white text-sm shadow-lg animate-fade-in">{toast}</div>
      )}

      {/* ─── Nav ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 flex items-center justify-between bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <svg width="28" height="28" viewBox="0 0 512 512">
            <circle cx="256" cy="256" r="22" fill="#8B5CF6" opacity="0.85" />
            <circle cx="256" cy="256" r="10" fill="#fff" opacity="0.95" />
          </svg>
          <span className="font-extrabold text-[var(--text)] text-lg tracking-tight">Lodestone</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/downloads" className="text-[var(--text-muted)] text-sm no-underline hover:text-[var(--text)] transition-colors hidden md:block">Download</Link>
          <Link to="/pricing" className="text-[var(--text-muted)] text-sm no-underline hover:text-[var(--text)] transition-colors hidden md:block">Pricing</Link>
          <button onClick={() => { logout(); window.location.href = '/' }} className="px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] text-sm hover:bg-[var(--surface-2)] transition-colors">Sign out</button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 pt-24 pb-8">
        <h1 className="text-2xl font-bold mb-8">My Account</h1>

        {/* ─── Account Info ─── */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Account Details</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${info.color} ${info.bgColor}`}>{info.name}</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-muted)]">Email</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--text)]">{user?.email}</span>
                {user?.emailVerified ? <span className="text-xs text-green-400">✓ Verified</span> : <span className="text-xs text-amber-400">Unverified</span>}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-muted)]">Plan</span>
              <span className="text-sm text-[var(--text)]">{info.name}</span>
            </div>
            {user?.emailVerified === false && (
              <button onClick={async () => {
                try {
                  const res = await fetch('/api/auth/resend-verification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: user.email }) })
                  const data = await res.json()
                  showToast(data.message || 'Verification email sent')
                } catch { showToast('Failed to send verification email') }
              }} className="text-sm text-brand-400 hover:text-brand-300 transition-colors">Resend verification email →</button>
            )}
          </div>
        </div>

        {/* ─── Credits & Usage ─── */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4"><Coins className="w-5 h-5 text-brand-400" /><h2 className="text-lg font-semibold">Credits & Usage</h2></div>

          {usageLoading ? (
            <div className="flex items-center justify-center py-8"><div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full" /></div>
          ) : usage ? (
            <div className="space-y-4">
              {/* Credit bar */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-[var(--text-muted)]">Monthly credits</span>
                  <span className="text-[var(--text)]">{usage.creditsUsedDisplay} used of {usage.monthlyCreditsDisplay}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
                  <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${creditsPercent}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--text-dim)] mt-1">
                  <span>{creditsPercent}% used</span>
                  <span>{usage.creditsRemainingDisplay} remaining</span>
                </div>
              </div>

              {/* Pack credits */}
              {usage.creditPacksRemaining > 0 && (
                <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-brand-500/10 border border-brand-500/20">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-brand-400" />
                    <span className="text-sm text-[var(--text)]">Purchased credits</span>
                  </div>
                  <span className="text-sm font-medium text-brand-400">{usage.creditPacksRemainingDisplay}</span>
                </div>
              )}

              {/* Period info */}
              {usage.periodStart && (
                <p className="text-xs text-[var(--text-dim)]">
                  Billing period: {new Date(usage.periodStart).toLocaleDateString()} — {new Date(usage.periodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-dim)]">Unable to load usage data</p>
          )}

          {/* Buy credits */}
          <div className="mt-6 pt-4 border-t border-[var(--border)]">
            <h3 className="text-sm font-medium text-[var(--text)] mb-3">Buy Credits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CREDIT_PACKS.map(pack => (
                <button key={pack.id} onClick={() => handleBuyCredits(pack.id)}
                  className={`relative flex flex-col items-center p-4 rounded-xl border transition-colors text-left ${pack.popular ? 'border-brand-500 bg-brand-500/5 hover:bg-brand-500/10' : 'border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--border)]'}`}>
                  {pack.popular && <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-brand-500 text-white text-[10px] font-bold">Popular</span>}
                  <span className="text-sm font-medium text-[var(--text)]">{pack.label}</span>
                  <span className="text-xl font-bold text-[var(--text)] mt-1">{pack.credits}</span>
                  <span className="text-xs text-[var(--text-dim)] mt-0.5">{pack.desc}</span>
                  <span className="text-sm font-semibold text-brand-400 mt-2">{pack.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Auto top-up */}
          <div className="mt-6 pt-4 border-t border-[var(--border)]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium text-[var(--text)]">Auto Top-Up</h3>
                <p className="text-xs text-[var(--text-dim)] mt-0.5">Automatically buy credits when your balance runs low</p>
              </div>
              <button onClick={() => setAutoTopUp(!autoTopUp)}
                className={`relative w-11 h-6 rounded-full transition-colors ${autoTopUp ? 'bg-brand-500' : 'bg-[var(--border)]'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${autoTopUp ? 'translate-x-5' : ''}`} />
              </button>
            </div>
            {autoTopUp && (
              <div className="space-y-3 p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">When balance drops below</label>
                  <select value={autoTopUpThreshold} onChange={e => setAutoTopUpThreshold(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500">
                    <option value="1.00">$1.00</option>
                    <option value="2.00">$2.00</option>
                    <option value="5.00">$5.00</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Buy this pack</label>
                  <select value={autoTopUpAmount} onChange={e => setAutoTopUpAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500">
                    {CREDIT_PACKS.map(p => <option key={p.id} value={p.id}>{p.label} — {p.credits} ({p.price})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Monthly spending limit</label>
                  <select value={autoTopUpMonthlyMax} onChange={e => { setAutoTopUpMonthlyMax(e.target.value); if (e.target.value !== 'custom') setAutoTopUpCustomMax('') }}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500">
                    <option value="5">$5.00 / month</option>
                    <option value="10">$10.00 / month</option>
                    <option value="25">$25.00 / month</option>
                    <option value="50">$50.00 / month</option>
                    <option value="100">$100.00 / month</option>
                    <option value="0">No limit</option>
                    <option value="custom">Custom…</option>
                  </select>
                  {autoTopUpMonthlyMax === 'custom' && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-[var(--text-muted)]">$</span>
                      <input type="number" min="1" step="1" value={autoTopUpCustomMax} onChange={e => setAutoTopUpCustomMax(e.target.value)} placeholder="Enter amount" className="flex-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500" />
                      <span className="text-sm text-[var(--text-dim)]">/ month</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-[var(--text-dim)]">Auto top-up will be charged to your payment method on file. <span className="text-brand-400">Coming soon.</span></p>
              </div>
            )}
          </div>
        </div>

        {/* ─── Subscription & Billing ─── */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4"><CreditCard className="w-5 h-5 text-brand-400" /><h2 className="text-lg font-semibold">Subscription & Billing</h2></div>
          <div className="space-y-4">
            <div className="flex items-center justify-between px-3 py-3 rounded-lg bg-[var(--surface-2)]">
              <div>
                <p className="text-sm font-medium text-[var(--text)]">{info.name} Plan</p>
                <p className="text-xs text-[var(--text-dim)]">{info.description}</p>
              </div>
              {tier !== 'free' ? (
                <button onClick={handleManageBilling} className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors flex items-center gap-1.5">
                  Manage Billing <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <Link to="/pricing" className="px-3 py-1.5 rounded-lg border border-brand-500/50 text-brand-400 hover:bg-brand-500/10 text-sm font-medium transition-colors no-underline">Upgrade →</Link>
              )}
            </div>
          </div>
        </div>

        {/* ─── Change Password ─── */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4"><Shield className="w-5 h-5 text-brand-400" /><h2 className="text-lg font-semibold">Change Password</h2></div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Current Password</label>
              <input type="password" value={currentPassword} onChange={e => { setCurrentPassword(e.target.value); setPasswordError('') }} className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">New Password</label>
              <input type="password" value={newPassword} onChange={e => { setNewPassword(e.target.value); setPasswordError('') }} placeholder="At least 8 characters" className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setPasswordError('') }} className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500" />
            </div>
            {passwordError && <p className="text-sm text-red-400">{passwordError}</p>}
            <button onClick={handleChangePassword} disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword} className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium disabled:opacity-50 transition-colors">
              {passwordSaving ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </div>

        {/* ─── Danger Zone ─── */}
        <div className="bg-[var(--surface)] border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4"><AlertTriangle className="w-5 h-5 text-red-400" /><h2 className="text-lg font-semibold text-red-400">Danger Zone</h2></div>
          <p className="text-sm text-[var(--text-muted)] mb-4">Permanently delete your account and all data. This cannot be undone.</p>
          {deleteConfirm ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-red-400 font-medium">Are you sure? This will permanently delete your account, conversations, memories, and all data.</p>
              <div className="flex gap-2 mt-3">
                <button onClick={handleDeleteAccount} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors">Yes, delete my account</button>
                <button onClick={() => setDeleteConfirm(false)} className="px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] text-sm font-medium hover:bg-[var(--surface-2)] transition-colors">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setDeleteConfirm(true)} className="px-4 py-2 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors">Delete account</button>
          )}
        </div>
      </div>
    </div>
  )
}