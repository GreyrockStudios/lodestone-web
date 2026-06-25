import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

interface Prefs {
  theme: string
  font_size: string
  message_font: string
  send_on_enter: boolean
  show_timestamps: boolean
  compact_mode: boolean
  language: string
  sidebar_collapsed: boolean
  default_provider: string
}

const defaultPrefs: Prefs = {
  theme: 'dark',
  font_size: 'medium',
  message_font: 'sans',
  send_on_enter: true,
  show_timestamps: true,
  compact_mode: false,
  language: 'en',
  sidebar_collapsed: false,
  default_provider: 'ollama',
}

interface PrefsContextType {
  prefs: Prefs
  updatePref: (key: string, value: any) => Promise<void>
  loading: boolean
}

const PrefsContext = createContext<PrefsContextType | null>(null)

export function usePrefs() {
  const ctx = useContext(PrefsContext)
  if (!ctx) throw new Error('usePrefs must be used within PrefsProvider')
  return ctx
}

function applyTheme(theme: string) {
  const root = document.documentElement
  if (theme === 'light') {
    root.style.setProperty('--bg', '#f8f9fa')
    root.style.setProperty('--surface', '#ffffff')
    root.style.setProperty('--surface-2', '#f0f0f5')
    root.style.setProperty('--border', '#e0e0e8')
    root.style.setProperty('--text', '#1a1a2e')
    root.style.setProperty('--text-muted', '#6b7280')
    root.style.setProperty('--text-dim', '#9ca3af')
    root.style.setProperty('--brand', '#7c3aed')
    root.style.setProperty('--brand-light', '#8b5cf6')
  } else {
    // Dark theme (default)
    root.style.setProperty('--bg', '#080810')
    root.style.setProperty('--surface', '#0f0f1a')
    root.style.setProperty('--surface-2', '#161625')
    root.style.setProperty('--border', '#1e1e35')
    root.style.setProperty('--text', '#f0f0ff')
    root.style.setProperty('--text-muted', '#9CA3AF')
    root.style.setProperty('--text-dim', '#6B7280')
    root.style.setProperty('--brand', '#8B5CF6')
    root.style.setProperty('--brand-light', '#a78bfa')
  }
}

function applyFontSize(size: string) {
  const root = document.documentElement
  const map: Record<string, string> = { small: '14px', medium: '16px', large: '18px' }
  root.style.fontSize = map[size] || '16px'
}

function applyCompact(compact: boolean) {
  const root = document.documentElement
  root.style.setProperty('--chat-padding', compact ? '4px' : '12px')
  root.style.setProperty('--msg-gap', compact ? '4px' : '12px')
  root.classList.toggle('compact-mode', compact)
}

function applyMessageFont(font: string) {
  const root = document.documentElement
  const map: Record<string, string> = {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
  }
  root.style.setProperty('--message-font', map[font] || map.sans)
}

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs)
  const [loading, setLoading] = useState(true)

  // Load preferences from API on mount
  useEffect(() => {
    const token = localStorage.getItem('lodestone_access_token')
    if (!token) { setLoading(false); return }

    fetch('/api/user/me/preferences', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : { preferences: defaultPrefs })
      .then(data => {
        const p = { ...defaultPrefs, ...(data.preferences || {}) }
        setPrefs(p)
        applyTheme(p.theme)
        applyFontSize(p.font_size)
        applyCompact(p.compact_mode)
        applyMessageFont(p.message_font)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Listen for system theme changes if set to 'system'
  useEffect(() => {
    if (prefs.theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => applyTheme(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    applyTheme(mq.matches ? 'dark' : 'light')
    return () => mq.removeEventListener('change', handler)
  }, [prefs.theme])

  const updatePref = useCallback(async (key: string, value: any) => {
    setPrefs(p => {
      const next = { ...p, [key]: value }
      // Apply immediately
      if (key === 'theme') {
        if (value === 'system') {
          applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        } else {
          applyTheme(value)
        }
      }
      if (key === 'font_size') applyFontSize(value)
      if (key === 'compact_mode') applyCompact(value)
      if (key === 'message_font') applyMessageFont(value)
      return next
    })

    const token = localStorage.getItem('lodestone_access_token')
    if (!token) return
    fetch('/api/user/me/preferences', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: value }),
    }).catch(() => {})
  }, [])

  return (
    <PrefsContext.Provider value={{ prefs, updatePref, loading }}>
      {children}
    </PrefsContext.Provider>
  )
}