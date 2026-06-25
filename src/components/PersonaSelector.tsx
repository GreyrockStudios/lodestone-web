import { useState, useEffect, useCallback, useRef } from 'react'

interface Persona {
  id: string
  name: string
  icon: string
  description: string
  system_prompt: string
  is_default: boolean
}

interface PersonaSelectorProps {
  currentPersonaId?: string | null
  onPersonaChange?: (persona: Persona | null) => void
  compact?: boolean
}

export default function PersonaSelector({ currentPersonaId, onPersonaChange, compact = false }: PersonaSelectorProps) {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createName, setCreateName] = useState('')
  const [createIcon, setCreateIcon] = useState('🎭')
  const [createPrompt, setCreatePrompt] = useState('')
  const [createDesc, setCreateDesc] = useState('')
  const [creating, setCreating] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const selectedPersonaId = currentPersonaId || localStorage.getItem('lodestone_persona_id')

  const getToken = useCallback(() => localStorage.getItem('lodestone_access_token') || '', [])

  const loadPersonas = useCallback(async () => {
    const token = getToken()
    if (!token) { setLoading(false); return }
    try {
      const res = await fetch('/api/personas', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setPersonas(data.personas || data || [])
        setError(null)
      } else {
        setError('Failed to load personas')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => { loadPersonas() }, [loadPersonas])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
        setShowCreateForm(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selectPersona = useCallback((persona: Persona | null) => {
    if (persona) {
      localStorage.setItem('lodestone_persona_id', persona.id)
    } else {
      localStorage.removeItem('lodestone_persona_id')
    }
    setDropdownOpen(false)
    setShowCreateForm(false)
    if (onPersonaChange) onPersonaChange(persona)
  }, [onPersonaChange])

  const createPersona = useCallback(async () => {
    if (!createName.trim() || !createPrompt.trim()) return
    const token = getToken()
    setCreating(true)
    try {
      const res = await fetch('/api/personas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: createName,
          icon: createIcon,
          description: createDesc,
          system_prompt: createPrompt
        })
      })
      if (res.ok) {
        const persona = await res.json()
        setPersonas(prev => [...prev, persona]
        )
        setCreateName('')
        setCreateIcon('🎭')
        setCreatePrompt('')
        setCreateDesc('')
        setShowCreateForm(false)
        selectPersona(persona)
        loadPersonas()
      }
    } catch {
      // silently fail
    } finally {
      setCreating(false)
    }
  }, [createName, createIcon, createPrompt, createDesc, getToken, selectPersona, loadPersonas])

  const ICON_OPTIONS = ['🎭', '🧠', '🎓', '💻', '🎨', '📝', '🔬', '🤖', '👨‍💻', '👩‍🏫', '🔧', '📊', '💡', '🎯', '⚡']

  const currentPersona = personas.find(p => p.id === selectedPersonaId)

  // Compact mode: just icon + name in the header
  if (compact) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-sm text-[var(--text)] hover:border-[var(--brand)] hover:bg-[var(--surface-2)] transition-colors"
        >
          <span>{currentPersona?.icon || '🎭'}</span>
          <span className="hidden md:inline max-w-[100px] truncate">{currentPersona?.name || 'Persona'}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute left-0 top-full mt-1 w-72 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl z-50 py-1 animate-fade-in overflow-hidden">
            <div className="max-h-80 overflow-y-auto">
              {/* Default / None option */}
              <button
                onClick={() => selectPersona(null)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-[var(--surface-2)] transition-colors ${!selectedPersonaId ? 'text-brand-400' : 'text-[var(--text)]'}`}
              >
                <span className="text-base">🪨</span>
                <div className="flex-1">
                  <div className="font-medium">Default</div>
                  <div className="text-xs text-[var(--text-dim)]">Lodestone default behavior</div>
                </div>
                {!selectedPersonaId && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-400 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>

              {personas.map(p => (
                <button
                  key={p.id}
                  onClick={() => selectPersona(p)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-[var(--surface-2)] transition-colors ${selectedPersonaId === p.id ? 'text-brand-400' : 'text-[var(--text)]'}`}
                >
                  <span className="text-base">{p.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium flex items-center gap-1.5">
                      <span className="truncate">{p.name}</span>
                      {p.is_default && (
                        <span className="px-1.5 py-0 rounded-full text-[10px] bg-brand-500/20 text-brand-400">Default</span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--text-dim)] truncate">{p.description}</div>
                  </div>
                  {selectedPersonaId === p.id && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-400 flex-shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            {/* Quick Create */}
            {!showCreateForm ? (
              <div className="border-t border-[var(--border)]">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-brand-400 hover:bg-[var(--surface-2)] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  Quick Create
                </button>
                <a
                  href="/identity"
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-[var(--text-dim)] hover:bg-[var(--surface-2)] hover:text-[var(--text-muted)] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                  Manage Personas
                </a>
              </div>
            ) : (
              <div className="border-t border-[var(--border)] p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {}}
                      className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center text-base hover:border-[var(--brand)] transition-colors"
                    >
                      {createIcon}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={createName}
                    onChange={e => setCreateName(e.target.value)}
                    placeholder="Persona name"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500 transition-colors"
                    autoFocus
                  />
                </div>
                {/* Icon picker */}
                <div className="flex flex-wrap gap-1">
                  {ICON_OPTIONS.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setCreateIcon(icon)}
                      className={`w-7 h-7 rounded flex items-center justify-center text-sm hover:bg-[var(--surface-2)] transition-colors ${createIcon === icon ? 'bg-[var(--surface-2)] ring-1 ring-brand-500' : ''}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={createDesc}
                  onChange={e => setCreateDesc(e.target.value)}
                  placeholder="Short description"
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500 transition-colors"
                />
                <textarea
                  value={createPrompt}
                  onChange={e => setCreatePrompt(e.target.value)}
                  placeholder="System prompt..."
                  rows={2}
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500 resize-none transition-colors"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => { setShowCreateForm(false); setCreateName(''); setCreateIcon('🎭'); setCreatePrompt(''); setCreateDesc('') }}
                    className="px-3 py-1 rounded-lg border border-[var(--border)] text-[var(--text-muted)] text-xs hover:bg-[var(--surface-2)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createPersona}
                    disabled={creating || !createName.trim() || !createPrompt.trim()}
                    className="px-3 py-1 rounded-lg bg-brand-500 text-white text-xs font-medium hover:bg-brand-600 disabled:opacity-50 transition-colors"
                  >
                    {creating ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Full mode
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm hover:border-[var(--brand)] hover:bg-[var(--surface-2)] transition-colors w-full"
      >
        <span className="text-lg">{currentPersona?.icon || '🎭'}</span>
        <div className="flex-1 text-left min-w-0">
          <div className="font-medium truncate">{currentPersona?.name || 'Select Persona'}</div>
          {currentPersona && (
            <div className="text-xs text-[var(--text-dim)] truncate">{currentPersona.description}</div>
          )}
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-[var(--text-dim)] transition-transform flex-shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute left-0 top-full mt-1 w-80 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl z-50 animate-fade-in overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full" />
            </div>
          ) : error ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-red-400 mb-2">{error}</p>
              <button onClick={loadPersonas} className="text-xs text-brand-400 hover:underline">Retry</button>
            </div>
          ) : (
            <>
              <div className="max-h-72 overflow-y-auto">
                {/* Default / None option */}
                <button
                  onClick={() => selectPersona(null)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-[var(--surface-2)] transition-colors ${!selectedPersonaId ? 'text-brand-400' : 'text-[var(--text)]'}`}
                >
                  <span className="text-lg">🪨</span>
                  <div className="flex-1">
                    <div className="font-medium">Default</div>
                    <div className="text-xs text-[var(--text-dim)]">Lodestone default behavior</div>
                  </div>
                  {!selectedPersonaId && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-400 flex-shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>

                {personas.map(p => (
                  <button
                    key={p.id}
                    onClick={() => selectPersona(p)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-[var(--surface-2)] transition-colors ${selectedPersonaId === p.id ? 'text-brand-400' : 'text-[var(--text)]'}`}
                  >
                    <span className="text-lg">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium flex items-center gap-1.5">
                        <span className="truncate">{p.name}</span>
                        {p.is_default && (
                          <span className="px-1.5 py-0 rounded-full text-[10px] bg-brand-500/20 text-brand-400 flex-shrink-0">Default</span>
                        )}
                      </div>
                      <div className="text-xs text-[var(--text-dim)] truncate">{p.description}</div>
                    </div>
                    {selectedPersonaId === p.id && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-400 flex-shrink-0">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              {/* Footer actions */}
              {!showCreateForm ? (
                <div className="border-t border-[var(--border)]">
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-brand-400 hover:bg-[var(--surface-2)] transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Quick Create
                  </button>
                  <a
                    href="/identity"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-dim)] hover:bg-[var(--surface-2)] hover:text-[var(--text-muted)] transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                    Manage Personas
                  </a>
                </div>
              ) : (
                <div className="border-t border-[var(--border)] p-3 space-y-2">
                  <p className="text-xs font-medium text-[var(--text-muted)]">Quick Create Persona</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center text-base hover:border-[var(--brand)] transition-colors"
                      onClick={() => {
                        const next = ICON_OPTIONS[(ICON_OPTIONS.indexOf(createIcon) + 1) % ICON_OPTIONS.length]
                        setCreateIcon(next)
                      }}
                    >
                      {createIcon}
                    </button>
                    <input
                      type="text"
                      value={createName}
                      onChange={e => setCreateName(e.target.value)}
                      placeholder="Name"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500 transition-colors"
                      autoFocus
                    />
                  </div>
                  <input
                    type="text"
                    value={createDesc}
                    onChange={e => setCreateDesc(e.target.value)}
                    placeholder="Short description"
                    className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500 transition-colors"
                  />
                  <textarea
                    value={createPrompt}
                    onChange={e => setCreatePrompt(e.target.value)}
                    placeholder="System prompt..."
                    rows={3}
                    className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500 resize-none transition-colors"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => { setShowCreateForm(false); setCreateName(''); setCreateIcon('🎭'); setCreatePrompt(''); setCreateDesc('') }}
                      className="px-3 py-1 rounded-lg border border-[var(--border)] text-[var(--text-muted)] text-xs hover:bg-[var(--surface-2)] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={createPersona}
                      disabled={creating || !createName.trim() || !createPrompt.trim()}
                      className="px-3 py-1 rounded-lg bg-brand-500 text-white text-xs font-medium hover:bg-brand-600 disabled:opacity-50 transition-colors"
                    >
                      {creating ? 'Creating...' : 'Create'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}