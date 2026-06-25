import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

const EMOJIS = ['🪨', '🤖', '🧠', '💡', '🔮', '✨', '🦊', '🎯', '📚', '🎭', '🧙‍♂️', '🎓', '💻', '🎨', '🔬', '📊', '🌍', '⚡', '🔥', '🌟', '💎', '🎪', '🦋', '🐺']

const PERSONALITY_PRESETS: Record<string, { label: string; desc: string; text: string }> = {
  friendly: { label: 'Friendly', desc: 'Warm, approachable, casual', text: "You're warm, approachable, and casual. Use contractions, occasional humor, and keep things light." },
  professional: { label: 'Professional', desc: 'Formal, precise, efficient', text: "You're formal, precise, and efficient. Avoid slang, be direct, and prioritize accuracy." },
  creative: { label: 'Creative', desc: 'Imaginative, expressive, vivid', text: "You're imaginative and expressive. Use vivid language, metaphors, and think outside the box." },
  concise: { label: 'Concise', desc: 'Brief, direct, no fluff', text: "You're brief and to the point. Give short, direct answers. No fluff." },
  detailed: { label: 'Detailed', desc: 'Thorough, comprehensive, contextual', text: "You're thorough and comprehensive. Explain fully, provide context, and leave nothing out." },
}

const PROFESSION_CARDS = [
  { id: 'assistant', emoji: '🤝', label: 'Assistant', desc: 'General purpose helper' },
  { id: 'developer', emoji: '💻', label: 'Developer', desc: 'Code & technical help' },
  { id: 'writer', emoji: '✍️', label: 'Writer', desc: 'Content & copy' },
  { id: 'researcher', emoji: '🔬', label: 'Researcher', desc: 'Analysis & insights' },
  { id: 'educator', emoji: '🎓', label: 'Educator', desc: 'Teaching & explanations' },
  { id: 'analyst', emoji: '📊', label: 'Analyst', desc: 'Data & strategy' },
  { id: 'designer', emoji: '🎨', label: 'Designer', desc: 'Visual & UX' },
  { id: 'consultant', emoji: '💼', label: 'Consultant', desc: 'Strategy & advice' },
]

const TONE_OPTIONS = [
  { value: 'casual', label: 'Casual', emoji: '😎' },
  { value: 'balanced', label: 'Balanced', emoji: '⚖️' },
  { value: 'formal', label: 'Formal', emoji: '🎩' },
]

interface Identity {
  name: string
  profession: string
  personality: string
  tone: string
  custom_instructions: string
  avatar_emoji: string
}

export default function Identity() {
  const { user, accessToken } = useAuth()
  const [identity, setIdentity] = useState<Identity>({
    name: '',
    profession: '',
    personality: '',
    tone: 'balanced',
    custom_instructions: '',
    avatar_emoji: '🪨',
  })
  const [originalIdentity, setOriginalIdentity] = useState<Identity>({ ...identity })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const tier = user?.tier || 'free'
  const isFreeTier = tier === 'free'
  const features = user?.features || {}
  const canCustom = !isFreeTier

  useEffect(() => {
    const token = accessToken || localStorage.getItem('lodestone_access_token')
    if (!token) return
    fetch('/api/identity', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        const id = {
          name: data.name || '',
          profession: data.profession || '',
          personality: data.personality || '',
          tone: data.tone || 'balanced',
          custom_instructions: data.custom_instructions || '',
          avatar_emoji: data.avatar_emoji || '🪨',
        }
        setIdentity(id)
        setOriginalIdentity({ ...id })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [accessToken])

  const hasChanges = JSON.stringify(identity) !== JSON.stringify(originalIdentity)

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const token = accessToken || localStorage.getItem('lodestone_access_token')
      const res = await fetch('/api/identity', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(identity),
      })
      if (!res.ok) throw new Error('Failed to save identity')
      setOriginalIdentity({ ...identity })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handlePreset = (key: string) => {
    setIdentity(prev => ({ ...prev, personality: PERSONALITY_PRESETS[key].text }))
  }

  const activePreset = Object.entries(PERSONALITY_PRESETS).find(
    ([_, v]) => v.text === identity.personality
  )?.[0]

  if (loading) {
    return (
      <div className="p-4 md:p-6 animate-fade-in">
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-[var(--text-muted)]">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Agent Identity</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">Customize how your Lodestone agent looks and behaves</p>
      </div>

      {/* Preview Card */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 md:p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/20 flex items-center justify-center text-3xl flex-shrink-0">
            {identity.avatar_emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-[var(--text)]">
              {identity.name || 'Unnamed Agent'}
            </h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {identity.profession && (
                <span className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] capitalize">
                  {PROFESSION_CARDS.find(p => p.id === identity.profession)?.emoji} {identity.profession}
                </span>
              )}
              {identity.tone && (
                <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium border bg-cyan-500/20 text-cyan-400 border-cyan-500/30 capitalize">
                  {identity.tone}
                </span>
              )}
            </div>
          </div>
        </div>
        {identity.personality && (
          <p className="mt-3 text-sm text-[var(--text-muted)] line-clamp-2">{identity.personality}</p>
        )}
      </div>

      {/* Emoji Picker */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--text)] mb-3">Agent Emoji</label>
        <div className="grid grid-cols-8 gap-2">
          {EMOJIS.map(emoji => (
            <button
              key={emoji}
              onClick={() => setIdentity(prev => ({ ...prev, avatar_emoji: emoji }))}
              className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                identity.avatar_emoji === emoji
                  ? 'bg-brand-500/20 border-2 border-brand-500 scale-110'
                  : 'bg-[var(--surface)] border border-[var(--border)] hover:border-brand-500/50'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--text)] mb-2">Agent Name</label>
        <input
          type="text"
          value={identity.name}
          onChange={e => setIdentity(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g. Nova, Atlas, Sage..."
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:border-brand-500 outline-none text-sm"
          maxLength={50}
        />
      </div>

      {/* Profession Cards */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--text)] mb-3">Profession</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PROFESSION_CARDS.map(prof => (
            <button
              key={prof.id}
              onClick={() => setIdentity(prev => ({ ...prev, profession: prof.id }))}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all text-center ${
                identity.profession === prof.id
                  ? 'bg-brand-500/15 border-2 border-brand-500 text-[var(--text)]'
                  : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:border-brand-500/50'
              }`}
            >
              <span className="text-2xl">{prof.emoji}</span>
              <span className="text-sm font-medium">{prof.label}</span>
              <span className="text-[10px] text-[var(--text-dim)]">{prof.desc}</span>
            </button>
          ))}
        </div>
        {isFreeTier && identity.profession === '' && (
          <p className="text-xs text-[var(--text-dim)] mt-2">Pick a profession for your agent</p>
        )}
      </div>

      {/* Personality Presets */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--text)] mb-3">Personality</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(PERSONALITY_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => handlePreset(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activePreset === key
                  ? 'bg-brand-500 text-white'
                  : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:border-brand-500/50'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <textarea
          value={identity.personality}
          onChange={e => setIdentity(prev => ({ ...prev, personality: e.target.value }))}
          placeholder="Describe your agent's personality, or pick a preset above..."
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:border-brand-500 outline-none text-sm resize-none"
          rows={3}
        />
      </div>

      {/* Tone */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--text)] mb-3">Tone</label>
        <div className="flex gap-2">
          {TONE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setIdentity(prev => ({ ...prev, tone: opt.value }))}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 flex items-center justify-center gap-1.5 ${
                identity.tone === opt.value
                  ? 'bg-brand-500 text-white'
                  : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:border-brand-500/50'
              }`}
            >
              <span>{opt.emoji}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Instructions */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-[var(--text)] mb-2">Custom Instructions</label>
        {isFreeTier ? (
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-[var(--text-dim)]">
              <span>🔒</span>
              <span className="text-sm">Custom instructions are available on Desktop and Pro plans</span>
            </div>
            <a href="/pricing" className="inline-block mt-2 text-sm text-brand-400 hover:text-brand-300 no-underline">Upgrade plan →</a>
          </div>
        ) : (
          <>
            <p className="text-xs text-[var(--text-dim)] mb-2">Any additional instructions for how your agent should behave</p>
            <textarea
              value={identity.custom_instructions}
              onChange={e => setIdentity(prev => ({ ...prev, custom_instructions: e.target.value }))}
              placeholder="e.g. Always respond in French. Focus on code examples. Never use emojis..."
              className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:border-brand-500 outline-none text-sm resize-none"
              rows={4}
            />
          </>
        )}
      </div>

      {/* Save */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="px-6 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Identity'}
        </button>
        {saved && <span className="text-green-400 text-sm">✓ Saved</span>}
        {hasChanges && !saved && <span className="text-[var(--text-dim)] text-sm">Unsaved changes</span>}
      </div>
    </div>
  )
}
