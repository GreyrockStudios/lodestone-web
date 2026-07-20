import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {
  Eye, EyeOff, CreditCard, AlertTriangle, ChevronLeft, Shield, Zap, Coins,
  ArrowRight, RefreshCw, Download, Crown, Gift, Star, Check, Monitor, Apple,
  Settings, User, Lock, Trash2, ExternalLink,
} from 'lucide-react'
import { SITE } from '../content/site'

/* ─── Tier display config ─── */
const tierInfo: Record<string, { name: string; color: string; bgColor: string; description: string; icon: typeof Crown }> = {
  free: { name: 'Community', color: 'text-gray-400', bgColor: 'bg-gray-500/20', description: 'BYOK · Local models', icon: Star },
  'founding-access': { name: 'Founding Access', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', description: 'Alpha access · Community forever', icon: Star },
  'founding-pro-early': { name: 'Founding Pro · Early Bird', color: 'text-brand-400', bgColor: 'bg-brand-500/20', description: 'Rate locked $25/mo · 2mo prepaid', icon: Zap },
  'founding-pro': { name: 'Founding Pro', color: 'text-brand-300', bgColor: 'bg-brand-500/30', description: 'Rate locked $25/mo · 4mo prepaid', icon: Zap },
  'founding-studio': { name: 'Founding Studio', color: 'text-cyan-400', bgColor: 'bg-cyan-500/20', description: 'Rate locked $50/mo · 4-5mo prepaid', icon: Crown },
  'founding-studio-plus': { name: 'Founding Partner', color: 'text-amber-400', bgColor: 'bg-amber-500/20', description: 'Rate locked $50/mo · 12mo prepaid · Founders meetings', icon: Crown },
  pro: { name: 'Pro', color: 'text-brand-400', bgColor: 'bg-brand-500/20', description: 'Full power suite · Priority support', icon: Zap },
  team: { name: 'Studio', color: 'text-cyan-400', bgColor: 'bg-cyan-500/20', description: 'Multi-agent · API access', icon: Crown },
  enterprise: { name: 'Enterprise', color: 'text-amber-400', bgColor: 'bg-amber-500/20', description: 'Custom deployment & support', icon: Crown },
}

/* ─── Founders entitlements by tier ─── */
const foundersEntitlements: Record<string, { label: string; included: boolean }[]> = {
  'founding-access': [
    { label: 'Download & run the alpha now (Mac + Windows)', included: true },
    { label: 'Full desktop app: chat, memory, tasks, tools, multi-agent', included: true },
    { label: 'Bring your own key or run local Ollama (free usage)', included: true },
    { label: 'Discord founder role & name in credits', included: true },
    { label: 'Free forever on Community at launch', included: true },
    { label: 'Rate-locked pricing for life', included: false },
    { label: 'Included cloud usage at launch', included: false },
    { label: 'Founders meetings & roadmap input', included: false },
  ],
  'founding-pro-early': [
    { label: 'Everything in Founding Access', included: true },
    { label: '~2 months of Pro included usage at launch (~$60 value)', included: true },
    { label: 'Rate locked at $25/mo for life (vs $30)', included: true },
    { label: 'Lock holds while your subscription stays active', included: true },
    { label: 'Founders meetings & roadmap input', included: false },
  ],
  'founding-pro': [
    { label: 'Everything in Founding Access', included: true },
    { label: '~4 months of Pro included usage at launch (~$120 value)', included: true },
    { label: 'Rate locked at $25/mo for life (vs $30)', included: true },
    { label: 'Lock holds while your subscription stays active', included: true },
    { label: 'Founders meetings & roadmap input', included: false },
  ],
  'founding-studio': [
    { label: 'Everything in Founding Access', included: true },
    { label: '~4-5 months of Studio included usage at launch (~$240-300 value)', included: true },
    { label: 'Rate locked at $50/mo for life (vs $60)', included: true },
    { label: 'Lock holds while your subscription stays active', included: true },
    { label: 'Founders meetings & roadmap input', included: false },
  ],
  'founding-studio-plus': [
    { label: 'Everything in Founding Studio', included: true },
    { label: '~12 months of Studio included usage at launch (~$720 value)', included: true },
    { label: 'Rate locked at $50/mo for life', included: true },
    { label: 'A standing seat in our founders meetings', included: true },
    { label: 'Real influence on what we build next', included: true },
    { label: 'Early access to every new feature before anyone else', included: true },
  ],
}

/* ─── Download platforms ─── */
const platforms = [
  {
    name: 'macOS',
    icon: Apple,
    subtitle: 'Apple Silicon & Intel · macOS 13+',
    url: '/downloads/Lodestone-0.5.6-universal.dmg',
    size: '190 MB',
    available: true,
  },
  {
    name: 'Windows',
    icon: Monitor,
    subtitle: 'Windows 10+ (x64)',
    url: '/downloads/Lodestone-Setup-0.5.6.exe',
    size: '93 MB',
    available: true,
  },
]

/* ─── Credit packs ─── */
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

/* ─── Nav tabs ─── */
type TabId = 'profile' | 'plan' | 'entitlements' | 'downloads' | 'usage' | 'security'

const tabs: { id: TabId; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'plan', label: 'Plan & License', icon: CreditCard },
  { id: 'entitlements', label: 'Entitlements', icon: Gift },
  { id: 'downloads', label: 'Downloads', icon: Download },
  { id: 'usage', label: 'Usage', icon: Coins },
  { id: 'security', label: 'Security', icon: Lock },
]

/* ─── Main component ─── */
export default function Account() {
  const { user, accessToken, logout } = useAuth()
  const navigate = useNavigate()
  const token = accessToken || localStorage.getItem('lodestone_access_token')
  const [searchParams] = useSearchParams()
  const initialTab = (searchParams.get('tab') as TabId) || 'profile'
  const [activeTab, setActiveTab] = useState<TabId>(initialTab)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [usage, setUsage] = useState<CreditUsage | null>(null)
  const [usageLoading, setUsageLoading] = useState(true)

  const tier = user?.tier || 'free'
  const info = tierInfo[tier] || tierInfo.free
  const isFounder = tier.startsWith('founding')
  const TierIcon = info.icon

  // Fetch credit usage
  useEffect(() => {
    if (!token) return
    fetch('/api/usage/credits', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { setUsage(d); setUsageLoading(false) })
      .catch(() => setUsageLoading(false))
  }, [token])

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !localStorage.getItem('lodestone_access_token')) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) return null

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const handleChangePassword = async () => {
    setPasswordError('')
    if (!currentPassword || !newPassword) { setPasswordError('Fill in all fields'); return }
    if (newPassword !== confirmPassword) { setPasswordError('Passwords don\'t match'); return }
    if (newPassword.length < 8) { setPasswordError('Password must be at least 8 characters'); return }
    setPasswordSaving(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed') }
      showToast('Password updated')
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    } catch (e: any) { setPasswordError(e.message) }
    finally { setPasswordSaving(false) }
  }

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) { logout(); navigate('/') }
    } catch {}
  }

  const handleManageBilling = async () => {
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) { const { url } = await res.json(); window.location.href = url }
    } catch {}
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg animate-in slide-in-from-right">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-5xl mx-auto px-4 md:px-6 pt-12 pb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-xl font-display font-bold text-brand-300">
              {user.displayName?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">{user.displayName || user.email.split('@')[0]}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${info.color} ${info.bgColor}`}>
                  <TierIcon className="w-3 h-3" />
                  {info.name}
                </span>
                {user.emailVerified && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>
          <p className="text-sm text-[var(--text-muted)]">{user.email}</p>
        </div>
      </div>

      {/* Tab nav */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <nav className="flex gap-1 overflow-x-auto -mb-px">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-brand-400 text-brand-300'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        {activeTab === 'profile' && (
          <ProfileTab user={user} info={info} TierIcon={TierIcon} />
        )}
        {activeTab === 'plan' && (
          <PlanTab tier={tier} info={info} TierIcon={TierIcon} isFounder={isFounder} onManageBilling={handleManageBilling} />
        )}
        {activeTab === 'entitlements' && (
          <EntitlementsTab tier={tier} isFounder={isFounder} info={info} TierIcon={TierIcon} />
        )}
        {activeTab === 'downloads' && (
          <DownloadsTab />
        )}
        {activeTab === 'usage' && (
          <UsageTab usage={usage} loading={usageLoading} token={token} onManageBilling={handleManageBilling} />
        )}
        {activeTab === 'security' && (
          <SecurityTab
            currentPassword={currentPassword} newPassword={newPassword} confirmPassword={confirmPassword}
            setCurrentPassword={setCurrentPassword} setNewPassword={setNewPassword} setConfirmPassword={setConfirmPassword}
            onSave={handleChangePassword} saving={passwordSaving} error={passwordError}
            deleteConfirm={deleteConfirm} setDeleteConfirm={setDeleteConfirm} onDelete={handleDeleteAccount}
          />
        )}
      </div>
    </div>
  )
}

/* ─── Profile tab ─── */
function ProfileTab({ user, info, TierIcon }: { user: any; info: typeof tierInfo.free; TierIcon: typeof Crown }) {
  return (
    <div className="space-y-6">
      <div className="site-card p-6">
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-brand-300" /> Profile
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-[var(--text-dim)] uppercase tracking-wider">Display Name</label>
            <p className="text-sm mt-1">{user.displayName || user.email.split('@')[0]}</p>
          </div>
          <div>
            <label className="text-xs text-[var(--text-dim)] uppercase tracking-wider">Email</label>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm">{user.email}</p>
              {user.emailVerified ? (
                <span className="text-xs text-emerald-400 flex items-center gap-1"><Shield className="w-3 h-3" /> Verified</span>
              ) : (
                <span className="text-xs text-amber-400">Not verified</span>
              )}
            </div>
          </div>
          <div>
            <label className="text-xs text-[var(--text-dim)] uppercase tracking-wider">Account ID</label>
            <p className="text-sm mt-1 font-mono text-[var(--text-muted)]">{user.id}</p>
          </div>
        </div>
      </div>

      <div className="site-card p-6">
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <TierIcon className="w-5 h-5 text-brand-300" /> Current Plan
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${info.color} ${info.bgColor}`}>
              <TierIcon className="w-3.5 h-3.5" />
              {info.name}
            </span>
            <p className="text-sm text-[var(--text-muted)] mt-2">{info.description}</p>
          </div>
          <Link to="/early-access" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium no-underline">
            {user.tier === 'free' ? 'Upgrade' : 'Change plan'} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ─── Promo code redemption ─── */
function PromoRedeem({ tier, onRedeemed }: { tier: string; onRedeemed: () => void }) {
  const { accessToken } = useAuth()
  const [code, setCode] = useState('')
  const [redeeming, setRedeeming] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRedeem = async () => {
    if (!code.trim()) return
    setRedeeming(true)
    setError('')
    setSuccess('')
    try {
      const token = accessToken || localStorage.getItem('lodestone_access_token')
      const res = await fetch('/api/license/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: code.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.code === 'ALREADY_REDEEMED') setError('You\'ve already used this code')
        else if (data.code === 'CODE_EXHAUSTED') setError('This code has reached its usage limit')
        else setError(data.error || 'Invalid code')
        return
      }
      setSuccess(data.message || 'Promo code redeemed!')
      setCode('')
      onRedeemed()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setRedeeming(false)
    }
  }

  return (
    <div className="site-card p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Gift className="w-4 h-4 text-brand-300" /> Redeem a promo code
      </h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); setSuccess('') }}
          placeholder="LODESTONE-XXXX-XXXXXX"
          className="flex-1 px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm font-mono outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 uppercase"
          onKeyDown={e => e.key === 'Enter' && handleRedeem()}
        />
        <button
          onClick={handleRedeem}
          disabled={redeeming || !code.trim()}
          className="px-4 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {redeeming ? 'Applying...' : 'Apply code'}
        </button>
      </div>
      {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
      {success && <p className="text-sm text-emerald-400 mt-2 flex items-center gap-1"><Check className="w-4 h-4" />{success}</p>}
      <p className="text-xs text-[var(--text-dim)] mt-2">Have a promo code? Enter it above to activate your plan or trial.</p>
    </div>
  )
}

/* ─── Plan & License tab ─── */
function PlanTab({ tier, info, TierIcon, isFounder, onManageBilling }: { tier: string; info: typeof tierInfo.free; TierIcon: typeof Crown; isFounder: boolean; onManageBilling: () => void }) {
  return (
    <div className="space-y-6">
      <div className="site-card p-6">
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-brand-300" /> Plan & License
        </h2>
        <div className="flex items-start gap-4 mb-6">
          <div className={`w-12 h-12 rounded-xl ${info.bgColor} flex items-center justify-center`}>
            <TierIcon className={`w-6 h-6 ${info.color}`} />
          </div>
          <div>
            <h3 className={`font-display text-xl font-bold ${info.color}`}>{info.name}</h3>
            <p className="text-sm text-[var(--text-muted)]">{info.description}</p>
          </div>
        </div>

        {isFounder && (
          <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 mb-6">
            <p className="text-sm text-brand-200 font-medium flex items-center gap-2">
              <Crown className="w-4 h-4" /> Founding rate lock active
            </p>
            <p className="text-xs text-brand-300/70 mt-1">
              Your rate is locked for life as long as your subscription stays active. This benefit never expires.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="site-card p-4">
            <p className="text-[var(--text-dim)] text-xs uppercase tracking-wider">Status</p>
            <p className="font-medium mt-1 text-emerald-400">Active</p>
          </div>
          <div className="site-card p-4">
            <p className="text-[var(--text-dim)] text-xs uppercase tracking-wider">Period</p>
            <p className="font-medium mt-1">Early Access</p>
          </div>
        </div>
      </div>

      <div className="site-card p-6">
        <h3 className="font-semibold mb-4">Billing</h3>
        <button
          onClick={onManageBilling}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-[var(--surface-2)] transition-colors"
        >
          <ExternalLink className="w-4 h-4" /> Manage billing via Stripe
        </button>
        <p className="text-xs text-[var(--text-dim)] mt-3">
          You'll be redirected to Stripe's secure portal to manage your subscription, payment method, and invoices.
        </p>
      </div>

      {tier === 'free' && (
        <div className="site-card-featured p-6">
          <h3 className="font-display text-lg font-semibold mb-2">Upgrade to a founding package</h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Get early access now and lock in founding rates for life.
          </p>
          <Link
            to="/early-access"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium no-underline"
          >
            View founding packages <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <PromoRedeem tier={tier} onRedeemed={() => window.location.reload()} />
    </div>
  )
}

/* ─── Entitlements tab ─── */
function EntitlementsTab({ tier, isFounder, info, TierIcon }: { tier: string; info: typeof tierInfo.free; TierIcon: typeof Crown; isFounder: boolean }) {
  const entitlements = foundersEntitlements[tier]

  if (!isFounder) {
    return (
      <div className="site-card p-6 text-center">
        <Gift className="w-10 h-10 text-[var(--text-dim)] mx-auto mb-3" />
        <h2 className="font-display text-lg font-semibold mb-2">No founders entitlements</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Founders entitlements are available with a founding package. Upgrade to unlock early access, rate locks, and more.
        </p>
        <Link
          to="/early-access"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium no-underline"
        >
          View founding packages <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="site-card-featured p-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl ${info.bgColor} flex items-center justify-center shrink-0`}>
            <TierIcon className={`w-6 h-6 ${info.color}`} />
          </div>
          <div>
            <h2 className={`font-display text-xl font-bold ${info.color}`}>{info.name}</h2>
            <p className="text-sm text-[var(--text-muted)]">{info.description}</p>
          </div>
        </div>
      </div>

      {entitlements && (
        <div className="site-card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Gift className="w-4 h-4 text-brand-300" /> Your entitlements
          </h3>
          <ul className="space-y-3">
            {entitlements.map((e, i) => (
              <li key={i} className={`flex items-start gap-3 text-sm ${e.included ? 'text-[var(--text)]' : 'text-[var(--text-dim)]'}`}>
                {e.included ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <span className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 text-[var(--text-dim)]">—</span>
                )}
                <span className={e.included ? '' : 'line-through opacity-60'}>{e.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tier !== 'founding-studio-plus' && (
        <div className="site-card p-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-brand-300" /> Upgrade your package
          </h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Unlock more entitlements, more prepaid usage, and deeper influence on the product.
          </p>
          <Link
            to="/early-access"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium no-underline"
          >
            View all packages <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  )
}

/* ─── Downloads tab ─── */
function DownloadsTab() {
  return (
    <div className="space-y-6">
      <div className="site-card p-6">
        <h2 className="font-display text-lg font-semibold mb-2 flex items-center gap-2">
          <Download className="w-5 h-5 text-brand-300" /> Download Lodestone
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Desktop builds for Mac and Windows. Alpha builds require a founding package.
        </p>
        <div className="space-y-3">
          {platforms.map(p => {
            const Icon = p.icon
            return (
              <div key={p.name} className={`rounded-xl p-4 flex items-center gap-4 ${p.available ? 'site-card site-card-hover' : 'site-card opacity-60'}`}>
                <div className="w-10 h-10 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-brand-300 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-xs text-[var(--text-dim)]">{p.subtitle}</p>
                </div>
                {p.available ? (
                  <a
                    href={p.url}
                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium no-underline"
                  >
                    <Download className="w-3.5 h-3.5" /> {p.size}
                  </a>
                ) : (
                  <span className="text-sm text-[var(--text-dim)]">Coming soon</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="site-card p-6">
        <h3 className="font-semibold mb-3">What's included</h3>
        <ul className="space-y-2 text-sm text-[var(--text-muted)]">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
            <span>Local Ollama integration for private models</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
            <span>Memory, tasks, and scheduled work</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
            <span>Native desktop tools (files, clipboard, screenshots)</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
            <span>Optional cloud providers with BYOK</span>
          </li>
        </ul>
      </div>

      <div className="text-center">
        <Link to="/docs/desktop-app" className="text-sm text-brand-300 no-underline hover:text-brand-200">
          Setup guide →
        </Link>
      </div>
    </div>
  )
}

/* ─── Usage tab ─── */
function UsageTab({ usage, loading, token, onManageBilling }: { usage: CreditUsage | null; loading: boolean; token: string | null; onManageBilling: () => void }) {
  const creditPercent = usage && usage.monthlyCredits > 0
    ? Math.round((usage.creditsUsed / usage.monthlyCredits) * 100)
    : 0

  return (
    <div className="space-y-6">
      <div className="site-card p-6">
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Coins className="w-5 h-5 text-brand-300" /> Credits & Usage
        </h2>

        {loading ? (
          <div className="animate-pulse h-32 rounded-xl bg-[var(--surface-2)]" />
        ) : usage ? (
          <div className="space-y-4">
            {/* Credit bar */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[var(--text-muted)]">
                  {usage.creditsUsedDisplay} used of {usage.monthlyCreditsDisplay}
                </span>
                <span className="text-[var(--text-dim)]">{creditPercent}%</span>
              </div>
              <div className="h-3 rounded-full bg-[var(--surface-2)] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    creditPercent > 90 ? 'bg-red-500' : creditPercent > 70 ? 'bg-amber-500' : 'bg-brand-500'
                  }`}
                  style={{ width: `${Math.min(creditPercent, 100)}%` }}
                />
              </div>
            </div>

            {/* Pack credits */}
            {usage.creditPacksRemaining > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Coins className="w-4 h-4 text-brand-400" />
                <span className="text-[var(--text-muted)]">Pack credits remaining:</span>
                <span className="text-sm font-medium text-brand-400">{usage.creditPacksRemainingDisplay}</span>
              </div>
            )}

            {/* Period */}
            {usage.periodStart && (
              <p className="text-xs text-[var(--text-dim)]">
                Billing period: {new Date(usage.periodStart).toLocaleDateString()} — {new Date(usage.periodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-[var(--text-dim)]">Unable to load usage data</p>
        )}
      </div>

      {/* Buy credits */}
      <div className="site-card p-6">
        <h3 className="font-semibold mb-4">Buy credit packs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CREDIT_PACKS.map(pack => (
            <div key={pack.id} className={`rounded-xl border p-4 ${pack.popular ? 'border-brand-500/50' : 'border-[var(--border)]'}`}>
              {pack.popular && <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-300">Popular</span>}
              <p className="font-semibold">{pack.label}</p>
              <p className="text-2xl font-display font-bold mt-1">{pack.price}</p>
              <p className="text-xs text-[var(--text-dim)] mt-1">{pack.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--text-dim)] mt-3">
          Credit packs available at launch. During early access, usage is BYOK or local models only.
        </p>
      </div>

      <button
        onClick={onManageBilling}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-[var(--surface-2)] transition-colors"
      >
        <ExternalLink className="w-4 h-4" /> Manage billing via Stripe
      </button>
    </div>
  )
}

/* ─── Security tab ─── */
function SecurityTab({ currentPassword, newPassword, confirmPassword, setCurrentPassword, setNewPassword, setConfirmPassword, onSave, saving, error, deleteConfirm, setDeleteConfirm, onDelete }: {
  currentPassword: string; newPassword: string; confirmPassword: string
  setCurrentPassword: (v: string) => void; setNewPassword: (v: string) => void; setConfirmPassword: (v: string) => void
  onSave: () => void; saving: boolean; error: string
  deleteConfirm: boolean; setDeleteConfirm: (v: boolean) => void; onDelete: () => void
}) {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  return (
    <div className="space-y-6">
      <div className="site-card p-6">
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-brand-300" /> Change Password
        </h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-xs text-[var(--text-dim)] uppercase tracking-wider">Current Password</label>
            <div className="relative mt-1">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm pr-10"
              />
              <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-dim)]">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-[var(--text-dim)] uppercase tracking-wider">New Password</label>
            <div className="relative mt-1">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm pr-10"
              />
              <button onClick={() => setShowNew(!showNew)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-dim)]">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-[var(--text-dim)] uppercase tracking-wider">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm mt-1"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-white text-sm font-medium"
          >
            {saving ? 'Saving…' : 'Update Password'}
          </button>
        </div>
      </div>

      <div className="site-card p-6 border-red-500/30">
        <h2 className="font-display text-lg font-semibold mb-2 flex items-center gap-2 text-red-400">
          <Trash2 className="w-5 h-5" /> Danger Zone
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Permanently delete your account and all data. This action cannot be undone.
        </p>
        {!deleteConfirm ? (
          <button onClick={() => setDeleteConfirm(true)} className="px-4 py-2 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors">
            Delete account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-red-300">Are you sure? Type your password to confirm.</p>
            <div className="flex gap-3">
              <button onClick={onDelete} className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium">
                Yes, delete my account
              </button>
              <button onClick={() => setDeleteConfirm(false)} className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}