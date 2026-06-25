import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const { user, resendVerification } = useAuth()
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null)
  const [resendStatus, setResendStatus] = useState<string | null>(null)

  const tierColors: Record<string, string> = {
    free: 'bg-gray-500/20 text-gray-400',
    desktop: 'bg-brand-500/20 text-brand-400',
    pro: 'bg-cyan-500/20 text-cyan-400',
    enterprise: 'bg-purple-500/20 text-purple-400',
  }

  const tierNames: Record<string, string> = {
    free: 'Free',
    desktop: 'Desktop',
    pro: 'Pro',
    enterprise: 'Enterprise',
  }

  const features = user?.features || {}
  const tier = user?.tier || 'free'

  useEffect(() => {
    const trialEnd = (user as any)?.trialEndsAt || (user as any)?.subscription?.current_period_end
    if (trialEnd && tier === 'desktop') {
      const days = Math.ceil((new Date(trialEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      setTrialDaysLeft(days > 0 ? days : 0)
    }
  }, [user, tier])

  const hasMemory = features.memory === true
  const hasKnowledgeGraph = features.knowledgeGraph === true
  const hasIdentity = features.identity === true
  const hasChat = features.chat === true
  const hasTools = features.tools === true
  const hasUnlimitedChat = features.chatLimit === -1 || features.chatLimit === '-1'

  const handleResend = async () => {
    if (!user?.email) return
    try {
      const msg = await resendVerification(user.email)
      setResendStatus(msg)
    } catch {
      setResendStatus('Failed to resend. Try again later.')
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in">
      {/* Email verification banner */}
      {user && !user?.emailVerified && (
        <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1">
            <p className="text-amber-300 font-medium text-sm">⚠️ Email not verified</p>
            <p className="text-amber-200/70 text-xs mt-1">Check your inbox for a verification link, or resend it below.</p>
          </div>
          <button
            onClick={handleResend}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm font-medium transition-colors whitespace-nowrap"
          >
            Resend email
          </button>
        </div>
      )}
      {resendStatus && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          {resendStatus}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.displayName || 'there'} 👋</h1>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${tierColors[tier] || tierColors.free}`}>
            {tierNames[tier] || 'Free'}
          </span>
          {hasUnlimitedChat && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-400">
              ♾️ Unlimited Chat
            </span>
          )}
          {trialDaysLeft !== null && trialDaysLeft > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400">
              ⏳ {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} left on trial
            </span>
          )}
          <span className="text-sm text-[var(--text-muted)]">{user?.email}</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link to="/chat" className="flex items-center gap-4 p-5 md:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-brand-500/40 transition-all group no-underline">
          <div className="w-12 h-12 rounded-lg bg-brand-500/15 flex items-center justify-center text-2xl flex-shrink-0">💬</div>
          <div className="min-w-0">
            <h3 className="font-semibold text-[var(--text)] group-hover:text-brand-400 transition-colors">Start chatting</h3>
            <p className="text-sm text-[var(--text-muted)]">Talk to your AI agent</p>
          </div>
        </Link>

        <Link to="/identity" className="flex items-center gap-4 p-5 md:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-cyan-500/40 transition-all group no-underline">
          <div className="w-12 h-12 rounded-lg bg-cyan-500/15 flex items-center justify-center text-2xl flex-shrink-0">🧠</div>
          <div className="min-w-0">
            <h3 className="font-semibold text-[var(--text)] group-hover:text-cyan-400 transition-colors">Agent Identity</h3>
            <p className="text-sm text-[var(--text-muted)]">Customize your agent</p>
          </div>
        </Link>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Memory card */}
        <div className={`p-5 rounded-xl border ${hasMemory ? 'bg-green-500/5 border-green-500/20' : 'bg-[var(--surface)] border-[var(--border)]'}`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🧠</span>
            <h3 className="font-semibold text-[var(--text)]">Memory</h3>
          </div>
          {hasMemory ? (
            <div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-400">
                ✓ Brain Active
              </span>
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Your agent remembers conversations and learns over time.</p>
            </div>
          ) : (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Upgrade to unlock agent memory.</p>
          )}
        </div>

        {/* Knowledge Graph card */}
        <div className={`p-5 rounded-xl border ${hasKnowledgeGraph ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-[var(--surface)] border-[var(--border)]'}`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🕸️</span>
            <h3 className="font-semibold text-[var(--text)]">Knowledge Graph</h3>
          </div>
          {hasKnowledgeGraph ? (
            <div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-500/10 text-cyan-400">
                ✓ Unlocked
              </span>
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Coming Soon — your agent will build a knowledge graph from conversations.</p>
            </div>
          ) : (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Upgrade to unlock knowledge graph.</p>
          )}
        </div>

        {/* Identity card */}
        <div className={`p-5 rounded-xl border ${hasIdentity ? 'bg-purple-500/5 border-purple-500/20' : 'bg-[var(--surface)] border-[var(--border)]'}`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🎭</span>
            <h3 className="font-semibold text-[var(--text)]">Identity</h3>
          </div>
          {hasIdentity ? (
            <div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-500/10 text-purple-400">
                ✓ Unlocked
              </span>
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Define your agent's name, personality, and tone.</p>
            </div>
          ) : (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Upgrade to customize agent identity.</p>
          )}
        </div>
      </div>

      {/* All features */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4">Your features</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
          {[
            { name: 'Chat', key: 'chat', icon: '💬' },
            { name: 'Memory', key: 'memory', icon: '🧠' },
            { name: 'Knowledge Graph', key: 'knowledgeGraph', icon: '🕸️' },
            { name: 'Identity', key: 'identity', icon: '🎭' },
            { name: 'Tools', key: 'tools', icon: '🔧' },
            { name: 'Unlimited Chat', key: 'unlimitedChat', icon: '♾️' },
          ].map(feature => {
            const unlocked = feature.key === 'unlimitedChat'
              ? hasUnlimitedChat
              : features[feature.key] === true

            return (
              <div
                key={feature.key}
                className={`flex items-center gap-2 p-2 md:p-3 rounded-lg text-sm ${
                  unlocked
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-[var(--surface-2)] text-[var(--text-dim)] border border-[var(--border)]'
                }`}
              >
                <span className="text-base md:text-sm">{feature.icon}</span>
                <span className="truncate">{feature.name}</span>
                {unlocked ? '✓' : '🔒'}
              </div>
            )
          })}
        </div>

        {!['desktop', 'pro', 'enterprise'].includes(tier) && (
          <div className="mt-4 p-4 rounded-lg bg-brand-500/10 border border-brand-500/20">
            <p className="text-sm text-brand-300">
              Unlock tools, advanced features, and more with a paid plan.
            </p>
            <Link to="/pricing" className="inline-block mt-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium no-underline transition-colors">
              Upgrade plan
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
