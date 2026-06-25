import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const STEPS = ['welcome', 'model', 'ollama', 'personality', 'privacy', 'theme', 'ready'] as const
type Step = typeof STEPS[number]

const THEMES = [
  { id: 'dark', name: 'Dark', icon: '🌙', desc: 'Easy on the eyes' },
  { id: 'light', name: 'Light', icon: '☀️', desc: 'Clean and bright' },
  { id: 'system', name: 'System', icon: '💻', desc: 'Match your OS' },
]

const PERSONALITIES = [
  { id: 'balanced', name: 'Balanced', icon: '⚖️', desc: 'Thoughtful, helpful, concise. Best for most people.' },
  { id: 'creative', name: 'Creative', icon: '🎨', desc: 'Expressive, imaginative, loves brainstorming.' },
  { id: 'precise', name: 'Precise', icon: '🔬', desc: 'Factual, structured, no fluff. Great for technical work.' },
  { id: 'friendly', name: 'Friendly', icon: '🤝', desc: 'Warm, casual, supportive. Like a helpful colleague.' },
]

const PROVIDERS = [
  { id: 'ollama', name: 'Ollama (Local)', icon: '🦙', desc: 'Free, private, runs on your machine', tier: 'free' },
  { id: 'anthropic', name: 'Claude', icon: '🧠', desc: 'Thoughtful, nuanced responses', tier: 'pro' },
  { id: 'openai', name: 'GPT-4o', icon: '✨', desc: 'Fast, versatile, great all-rounder', tier: 'pro' },
  { id: 'glm', name: 'GLM Cloud', icon: '🪨', desc: 'Lodestone default, good balance', tier: 'free' },
]

export default function Onboarding() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('welcome')
  const [theme, setTheme] = useState(localStorage.getItem('lodestone_pref_theme') || 'system')
  const [personality, setPersonality] = useState('balanced')
  const [provider, setProvider] = useState('ollama')
  const [privacyLevel, setPrivacyLevel] = useState('standard')
  const [ollamaDetected, setOllamaDetected] = useState(false)
  const [ollamaChecking, setOllamaChecking] = useState(true)
  const [ollamaModels, setOllamaModels] = useState<{name: string; size: string}[]>([])
  const isDesktop = typeof window !== 'undefined' && (!!(window as any).__TAURI__ || !!(window as any).__TAURI_INTERNALS__ || !!(window as any).electronAPI)

  useEffect(() => {
    if (localStorage.getItem('lodestone_onboarding_complete')) {
      navigate('/chat', { replace: true })
      return
    }
    const api = (window as any).electronAPI
    if (api?.ollamaCheck) {
      api.ollamaCheck().then((r: any) => {
        setOllamaDetected(r?.installed || false)
        setOllamaChecking(false)
        if (r?.installed) return api.ollamaListModels()
      }).then((r: any) => {
        if (r?.models) setOllamaModels(r.models)
      }).catch(() => setOllamaChecking(false))
    } else {
      setOllamaChecking(false)
    }
  }, [])

  const handleComplete = () => {
    localStorage.setItem('lodestone_onboarding_complete', 'true')
    localStorage.setItem('lodestone_onboarding_personality', personality)
    localStorage.setItem('lodestone_onboarding_provider', provider)
    localStorage.setItem('lodestone_onboarding_privacy', privacyLevel)

    // Theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('lodestone_pref_theme', 'dark')
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('lodestone_pref_theme', 'light')
    } else {
      localStorage.setItem('lodestone_pref_theme', 'system')
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    // Request notifications on desktop
    if (isDesktop) {
      const api = (window as any).electronAPI
      if (api?.requestNotificationPermission) {
        api.requestNotificationPermission().catch(() => {})
      }
    }

    // Save prefs to server
    const token = localStorage.getItem('lodestone_access_token')
    if (token) {
      fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ theme, personality, default_provider: provider, privacy_level: privacyLevel, onboarding_complete: true })
      }).catch(() => {})
    }

    navigate('/chat', { replace: true })
  }

  const stepIndex = STEPS.indexOf(step)
  const progress = ((stepIndex + 1) / STEPS.length) * 100
  const canSkip = step !== 'welcome'

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center p-6">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Progress */}
        <div className="w-full h-1 bg-[var(--surface-2)] rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between items-center mb-6">
          <p className="text-xs text-[var(--text-dim)]">Step {stepIndex + 1} of {STEPS.length}</p>
          {canSkip && (
            <button onClick={handleComplete} className="text-xs text-[var(--text-dim)] hover:text-[var(--text)] transition-colors">
              Skip setup
            </button>
          )}
        </div>

        {/* Welcome */}
        {step === 'welcome' && (
          <div className="text-center">
            <div className="text-7xl mb-6">🪨</div>
            <h1 className="text-4xl font-bold mb-3">Welcome to Lodestone</h1>
            <p className="text-[var(--text-muted)] mb-2 text-lg">
              Hey{user?.displayName ? `, ${user.displayName}` : ''}! 👋
            </p>
            <p className="text-[var(--text-dim)] mb-8">
              Your AI assistant that remembers everything and acts on your behalf.
              This takes about a minute — you can always change these later.
            </p>
            <div className="space-y-3">
              <button onClick={() => setStep('model')}
                className="w-full px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors text-lg">
                Get started →
              </button>
              <button onClick={handleComplete}
                className="w-full px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-2)] transition-colors text-sm">
                Skip for now
              </button>
            </div>
          </div>
        )}

        {/* Model Selection */}
        {step === 'model' && (
          <div>
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🤖</div>
              <h2 className="text-2xl font-bold mb-2">Choose your AI</h2>
              <p className="text-[var(--text-muted)]">Which provider do you want to start with?</p>
            </div>
            <div className="space-y-2.5 mb-6">
              {PROVIDERS.map(p => (
                <button key={p.id} onClick={() => setProvider(p.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors text-left ${
                    provider === p.id
                      ? 'border-brand-500 bg-brand-500/5'
                      : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]'
                  }`}>
                  <span className="text-2xl">{p.icon}</span>
                  <div className="flex-1">
                    <p className={`font-medium ${provider === p.id ? 'text-brand-400' : 'text-[var(--text)]'}`}>{p.name}</p>
                    <p className="text-xs text-[var(--text-dim)]">{p.desc}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.tier === 'free' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
                    {p.tier === 'free' ? 'Free' : 'Pro'}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('welcome')} className="flex-1 px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-2)] transition-colors">← Back</button>
              <button onClick={() => setStep('ollama')} className="flex-1 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium transition-colors">Next →</button>
            </div>
          </div>
        )}

        {/* Ollama */}
        {step === 'ollama' && (
          <div>
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🦙</div>
              <h2 className="text-2xl font-bold mb-2">Local AI</h2>
              <p className="text-[var(--text-muted)]">
                {isDesktop ? 'Run AI privately on your machine — your data never leaves it.' : 'Download the desktop app to run AI locally.'}
              </p>
            </div>
            {isDesktop ? (
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 mb-6">
                {ollamaChecking ? (
                  <div className="flex items-center gap-3"><div className="animate-spin w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full" /><span className="text-sm text-[var(--text-muted)]">Checking for Ollama...</span></div>
                ) : ollamaDetected ? (
                  <div>
                    <div className="flex items-center gap-2 mb-3"><span className="text-green-400 text-lg">✓</span><span className="font-medium text-green-400">Ollama detected</span></div>
                    {ollamaModels.length > 0 ? (
                      <div>
                        <p className="text-sm text-[var(--text-muted)] mb-2">Available models:</p>
                        <div className="flex flex-wrap gap-2">
                          {ollamaModels.slice(0, 6).map(m => <span key={m.name} className="px-2.5 py-1 rounded-lg bg-[var(--surface-2)] text-xs text-[var(--text)] border border-[var(--border)]">{m.name}</span>)}
                          {ollamaModels.length > 6 && <span className="px-2.5 py-1 rounded-lg bg-[var(--surface-2)] text-xs text-[var(--text-dim)]">+{ollamaModels.length - 6} more</span>}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-[var(--text-dim)]">No models yet. Install one with <code className="bg-[var(--surface-2)] px-1 rounded text-xs">ollama pull llama3</code></p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-[var(--text-muted)] mb-3">Ollama isn't installed. Get free, private AI on your machine.</p>
                    <a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-sm text-brand-400 hover:bg-brand-500/10 transition-colors no-underline">Download Ollama →</a>
                    <p className="text-xs text-[var(--text-dim)] mt-2">You can also use cloud models without Ollama.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 mb-6">
                <p className="text-sm text-[var(--text-muted)]">Local AI is available in the desktop app. On the web, you'll use cloud models.</p>
                <a href="/downloads" className="inline-block mt-3 px-4 py-2 rounded-lg bg-brand-500 text-white text-sm font-medium no-underline hover:bg-brand-600 transition-colors">Download Desktop App</a>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setStep('model')} className="flex-1 px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-2)] transition-colors">← Back</button>
              <button onClick={() => setStep('personality')} className="flex-1 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium transition-colors">Next →</button>
            </div>
          </div>
        )}

        {/* Personality */}
        {step === 'personality' && (
          <div>
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">💬</div>
              <h2 className="text-2xl font-bold mb-2">How should I talk?</h2>
              <p className="text-[var(--text-muted)]">Pick a style that fits how you work.</p>
            </div>
            <div className="space-y-2.5 mb-6">
              {PERSONALITIES.map(p => (
                <button key={p.id} onClick={() => setPersonality(p.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors text-left ${
                    personality === p.id ? 'border-brand-500 bg-brand-500/5' : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]'
                  }`}>
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <p className={`font-medium ${personality === p.id ? 'text-brand-400' : 'text-[var(--text)]'}`}>{p.name}</p>
                    <p className="text-xs text-[var(--text-dim)]">{p.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('ollama')} className="flex-1 px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-2)] transition-colors">← Back</button>
              <button onClick={() => setStep('privacy')} className="flex-1 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium transition-colors">Next →</button>
            </div>
          </div>
        )}

        {/* Privacy */}
        {step === 'privacy' && (
          <div>
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🔒</div>
              <h2 className="text-2xl font-bold mb-2">Privacy & memory</h2>
              <p className="text-[var(--text-muted)]">How much should Lodestone remember?</p>
            </div>
            <div className="space-y-3 mb-6">
              {[
                { id: 'minimal', icon: '🛡️', name: 'Minimal', desc: 'Only remember what you explicitly tell me to. Forget conversations between sessions.' },
                { id: 'standard', icon: '🧠', name: 'Standard', desc: 'Remember key facts, preferences, and commitments. The best balance for most people.' },
                { id: 'full', icon: '📸', name: 'Full memory', desc: 'Remember everything from our conversations. I\'ll learn your patterns and preferences over time.' },
              ].map(p => (
                <button key={p.id} onClick={() => setPrivacyLevel(p.id)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-colors text-left ${
                    privacyLevel === p.id ? 'border-brand-500 bg-brand-500/5' : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]'
                  }`}>
                  <span className="text-2xl mt-0.5">{p.icon}</span>
                  <div>
                    <p className={`font-medium ${privacyLevel === p.id ? 'text-brand-400' : 'text-[var(--text)]'}`}>{p.name}</p>
                    <p className="text-xs text-[var(--text-dim)]">{p.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--text-dim)] mb-4 text-center">You can always change this in Settings → Privacy. Your data is never shared.</p>
            <div className="flex gap-3">
              <button onClick={() => setStep('personality')} className="flex-1 px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-2)] transition-colors">← Back</button>
              <button onClick={() => setStep('theme')} className="flex-1 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium transition-colors">Next →</button>
            </div>
          </div>
        )}

        {/* Theme */}
        {step === 'theme' && (
          <div>
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎨</div>
              <h2 className="text-2xl font-bold mb-2">Choose your look</h2>
              <p className="text-[var(--text-muted)]">Pick a theme. Change it anytime.</p>
            </div>
            <div className="space-y-2.5 mb-6">
              {THEMES.map(t => (
                <button key={t.id} onClick={() => setTheme(t.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors text-left ${
                    theme === t.id ? 'border-brand-500 bg-brand-500/5' : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]'
                  }`}>
                  <span className="text-2xl">{t.icon}</span>
                  <div>
                    <p className={`font-medium ${theme === t.id ? 'text-brand-400' : 'text-[var(--text)]'}`}>{t.name}</p>
                    <p className="text-xs text-[var(--text-dim)]">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('privacy')} className="flex-1 px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-2)] transition-colors">← Back</button>
              <button onClick={() => setStep('ready')} className="flex-1 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium transition-colors">Next →</button>
            </div>
          </div>
        )}

        {/* Ready */}
        {step === 'ready' && (
          <div className="text-center">
            <div className="text-7xl mb-4">✨</div>
            <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
            <p className="text-[var(--text-muted)] mb-6">Here's a quick rundown before you start.</p>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 mb-6 text-left space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">{PROVIDERS.find(p => p.id === provider)?.icon}</span>
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">AI: {PROVIDERS.find(p => p.id === provider)?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">{PERSONALITIES.find(p => p.id === personality)?.icon}</span>
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">Style: {PERSONALITIES.find(p => p.id === personality)?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">{THEMES.find(t => t.id === theme)?.icon}</span>
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">Theme: {THEMES.find(t => t.id === theme)?.name}</p>
                </div>
              </div>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 mb-6 text-left">
              <p className="text-sm font-medium text-[var(--text)] mb-2">Quick tips</p>
              <ul className="space-y-1.5 text-sm text-[var(--text-muted)]">
                <li>• Type <code className="bg-[var(--surface-2)] px-1 rounded text-xs">/recall</code> to search your memories</li>
                <li>• Switch AI providers with the dropdown above the chat</li>
                <li>• Open Settings for themes, file access, and sync</li>
                <li>• Check the Brain tab to review memories and schedule tasks</li>
                <li>• Use <code className="bg-[var(--surface-2)] px-1 rounded text-xs">Cmd+K</code> for the command palette</li>
                {isDesktop && <li>• Use local Ollama models for free, private AI</li>}
                {isDesktop && <li>• Browse the <a href="/marketplace" className="text-brand-400 hover:underline">MCP Marketplace</a> to add tools like GitHub, filesystem, and more</li>}
                {isDesktop && <li>• Browse the <a href="/marketplace" className="text-brand-400 hover:underline">MCP Marketplace</a> to add tools like GitHub, filesystem, and more</li>}
              </ul>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('theme')} className="flex-1 px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-2)] transition-colors">← Back</button>
              <button onClick={handleComplete}
                className="flex-1 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors">
                Start chatting →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}