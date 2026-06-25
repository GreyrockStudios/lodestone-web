import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { usePrefs } from '../hooks/usePrefs'
import { Link } from 'react-router-dom'
import { Plus, Trash2, X, ChevronLeft, Clock, Cpu, FileText, Bell, Shield, HardDrive, Cloud } from 'lucide-react'

// ─── Identity constants ───
const EMOJIS = ['🪨', '🤖', '🧠', '💡', '🔮', '✨', '🦊', '🎯', '📚', '🎭', '🧙♂️', '🎓', '💻', '🎨', '🔬', '📊', '🌍', '⚡', '🔥', '🌟', '💎', '🎪', '🦋', '🐺']
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

// ─── File access tiers ───
const FILE_TIERS = [
  { id: 'none', label: 'No Access', icon: '🔒', desc: 'No file access — the agent cannot read or write any files' },
  { id: 'minimal', label: 'Minimal', icon: '👁️', desc: 'Read-only access to Desktop, Documents, and Downloads' },
  { id: 'standard', label: 'Standard', icon: '📂', desc: 'Read/write your home folder. Blocks .ssh, .gnupg, .keychain. Default.' },
  { id: 'full', label: 'Full Access', icon: '🔓', desc: 'Full filesystem access. Blocks only .ssh, .gnupg, .keychain, .lodestone. Use with caution.' },
]

// ─── Desktop detection ───
const isDesktop = typeof window !== 'undefined' && (!!(window as any).__TAURI__ || !!(window as any).__TAURI_INTERNALS__ || !!(window as any).electronAPI)
const hasElectronAPI = typeof window !== 'undefined' && !!(window as any).electronAPI?.tools

interface StorageUsage { used: number; limit: number; breakdown?: { conversations: number; memories: number; files: number } }
interface IdentityData { name: string; profession: string; personality: string; tone: string; custom_instructions: string; avatar_emoji: string }

type TabId = 'profile' | 'identity' | 'appearance' | 'desktop' | 'reminders' | 'storage'

// Desktop: local-first features only
const DESKTOP_TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'identity', label: 'Agent Identity', icon: '🧠' },
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
  ...(hasElectronAPI ? [{ id: 'desktop' as TabId, label: 'Desktop', icon: '🖥️' }] : []),
  { id: 'reminders', label: 'Reminders', icon: '🔔' },
  { id: 'storage', label: 'Storage', icon: '💾' },
]

// Web: settings only — account management is on /account
const WEB_TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'identity', label: 'Agent Identity', icon: '🧠' },
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
  { id: 'storage', label: 'Storage', icon: '💾' },
]

const TABS = isDesktop ? DESKTOP_TABS : WEB_TABS

// ─── Cloud Sync sub-component (hooks must be at top level, not in IIFE) ───
function CloudSyncSection() {
  const [syncOn, setSyncOn] = useState((window as any).electronAPI?.isSyncEnabled?.() || false)
  const [syncing, setSyncing] = useState(false)
  const tier = (window as any).electronAPI?.getTier?.() || 'community'
  const eligible = tier === 'pro' || tier === 'studio' || tier === 'enterprise'
  const lastSync = localStorage.getItem('lodestone_last_sync_at')
  const toggleSync = async () => {
    if (syncOn) {
      (window as any).electronAPI?.disableCloudSync?.()
      setSyncOn(false)
    } else {
      setSyncing(true)
      await (window as any).electronAPI?.enableCloudSync?.()
      setSyncOn(true)
      setSyncing(false)
    }
  }
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4"><Cloud className="w-5 h-5 text-brand-400" /><h3 className="text-lg font-semibold">Cloud Sync</h3></div>
      {eligible ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text)]">Keep data in sync across devices</p>
              <p className="text-xs text-[var(--text-dim)] mt-0.5">Conversations, memories, and commitments sync to the cloud when enabled</p>
            </div>
            <button onClick={toggleSync} disabled={syncing}
              className={`relative w-11 h-6 rounded-full transition-colors ${syncOn ? 'bg-brand-500' : 'bg-[var(--border)]'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${syncOn ? 'translate-x-5' : ''}`} />
            </button>
          </div>
          {syncOn && (
            <div className="space-y-2 pt-2 border-t border-[var(--border)]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">Status</span>
                <span className="text-sm font-medium text-green-400">● Syncing</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">Last synced</span>
                <span className="text-sm text-[var(--text-dim)]">{lastSync ? new Date(lastSync).toLocaleString() : 'Just now'}</span>
              </div>
              <p className="text-xs text-[var(--text-dim)]">Auto-syncs every 5 minutes. Data stays local-first — sync is additive.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-[var(--text-muted)]">Cloud sync keeps your data in sync across devices. Available on Pro and Studio plans.</p>
          <a href="/pricing" className="inline-block px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors no-underline">Upgrade plan →</a>
        </div>
      )}
    </div>
  )
}

export default function Settings() {
  const { user, accessToken } = useAuth()
  const { prefs, updatePref } = usePrefs()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabId>('profile')
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Identity
  const [identity, setIdentity] = useState<IdentityData>({ name: '', profession: '', personality: '', tone: 'balanced', custom_instructions: '', avatar_emoji: '🪨' })
  const [originalIdentity, setOriginalIdentity] = useState<IdentityData>({ name: '', profession: '', personality: '', tone: 'balanced', custom_instructions: '', avatar_emoji: '🪨' })
  const [identityLoading, setIdentityLoading] = useState(true)
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [identityError, setIdentityError] = useState('')
  const [identitySaved, setIdentitySaved] = useState(false)
  const [identitySaving, setIdentitySaving] = useState(false)
  const hasIdentityChanges = JSON.stringify(identity) !== JSON.stringify(originalIdentity)

  // Desktop: File tier
  const [fileTier, setFileTier] = useState<string>('standard')
  const [fileTierLoading, setFileTierLoading] = useState(isDesktop)

  // Desktop: Ollama
  const [ollamaStatus, setOllamaStatus] = useState<{ installed: boolean; version: string } | null>(null)
  const [ollamaModels, setOllamaModels] = useState<{ name: string; size: string }[]>([])

  // Desktop: Scheduler
  const [scheduledTasks, setScheduledTasks] = useState<any[]>([])
  const [schedulerPresets, setSchedulerPresets] = useState<any[]>([])
  const [schedulerTaskTypes, setSchedulerTaskTypes] = useState<any[]>([])
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskType, setNewTaskType] = useState('reminder')
  const [newTaskPreset, setNewTaskPreset] = useState('daily_morning')
  const [newTaskMessage, setNewTaskMessage] = useState('')
  const [taskCreating, setTaskCreating] = useState(false)

  // Reminders (server-side)
  const [reminders, setReminders] = useState<any[]>([])
  const [remindersLoading, setRemindersLoading] = useState(true)
  const [showNewReminder, setShowNewReminder] = useState(false)
  const [newReminderContent, setNewReminderContent] = useState('')
  const [newReminderTime, setNewReminderTime] = useState('')
  const [reminderCreating, setReminderCreating] = useState(false)

  // Storage
  const [storage, setStorage] = useState<StorageUsage | null>(null)

  const tier = user?.tier || 'free'
  const token = accessToken || localStorage.getItem('lodestone_access_token')
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  // ─── Fetch identity ───
  useEffect(() => {
    if (!token) { setIdentityLoading(false); return }
    fetch('/api/identity', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const id = { name: data.name || '', profession: data.profession || '', personality: data.personality || '', tone: data.tone || 'balanced', custom_instructions: data.custom_instructions || '', avatar_emoji: data.avatar_emoji || '🪨' }
        setIdentity(id); setOriginalIdentity({ ...id })
      })
      .catch(() => {})
      .finally(() => setIdentityLoading(false))
  }, [token])

  // ─── Fetch storage ───
  useEffect(() => {
    if (!token) return
    fetch('/api/storage/usage', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null).then(setStorage).catch(() => {})
  }, [token])

  // ─── Desktop: File tier ───
  useEffect(() => {
    if (!isDesktop) return
    const api = (window as any).electronAPI
    if (!api?.tools?.getFileTier) return
    api.tools.getFileTier().then((r: any) => { setFileTier(r.tier); setFileTierLoading(false) }).catch(() => setFileTierLoading(false))
  }, [])

  // ─── Desktop: Ollama ───
  useEffect(() => {
    if (!isDesktop) return
    const api = (window as any).electronAPI
    if (!api?.ollamaCheck) return
    api.ollamaCheck().then((r: any) => { setOllamaStatus(r); if (r.installed) return api.ollamaListModels() }).then((r: any) => { if (r) setOllamaModels(r) }).catch(() => {})
  }, [])

  // ─── Desktop: Scheduler ───
  const loadTasks = useCallback(() => {
    if (!isDesktop) return
    const api = (window as any).electronAPI
    if (!api?.scheduler) return
    Promise.all([api.scheduler.list(), api.scheduler.listPresets(), api.scheduler.listTaskTypes()])
      .then(([tasks, presets, types]) => { setScheduledTasks(tasks || []); setSchedulerPresets(presets || []); setSchedulerTaskTypes(types || []) })
      .catch(() => {})
  }, [])
  useEffect(() => { loadTasks() }, [loadTasks])

  // ─── Reminders (server-side) ───
  const loadReminders = useCallback(() => {
    if (!token) return
    setRemindersLoading(true)
    fetch('/api/chat/reminders?status=pending&limit=50', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : { reminders: [] })
      .then(data => { setReminders(data.reminders || []); setRemindersLoading(false) })
      .catch(() => { setReminders([]); setRemindersLoading(false) })
  }, [token])
  useEffect(() => { loadReminders() }, [loadReminders])

  // ─── Handlers ───
  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/user/me', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ displayName }) })
      if (res.ok) showToast('Profile saved')
      else showToast('Failed to save profile')
    } catch { showToast('Failed to save profile') }
    finally { setSaving(false) }
  }

  const handleSaveIdentity = async () => {
    setIdentitySaving(true)
    try {
      const res = await fetch('/api/identity', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(identity) })
      if (res.ok) { setOriginalIdentity({ ...identity }); setIdentitySaved(true); setIdentityError(''); setTimeout(() => setIdentitySaved(false), 3000); showToast('Identity saved') }
      else { const data = await res.json().catch(() => ({})); setIdentityError(data.error || 'Failed to save identity') }
    } catch { setIdentityError('Failed to save identity') }
    finally { setIdentitySaving(false) }
  }

  const handleSetFileTier = async (tierId: string) => {
    if (!isDesktop) return
    const api = (window as any).electronAPI
    if (!api?.tools?.setFileTier) return
    setFileTier(tierId)
    try { await api.tools.setFileTier(tierId); showToast(`File access set to ${tierId}`) } catch { showToast('Failed to set file tier') }
  }

  const handleCreateTask = async () => {
    if (!newTaskName.trim()) return
    setTaskCreating(true)
    try {
      const api = (window as any).electronAPI
      await api.scheduler.create({ name: newTaskName, task_type: newTaskType, preset_id: newTaskPreset, message: newTaskMessage })
      setShowCreateTask(false); setNewTaskName(''); setNewTaskMessage(''); setNewTaskType('reminder'); setNewTaskPreset('daily_morning')
      loadTasks(); showToast('Task created')
    } catch { showToast('Failed to create task') }
    finally { setTaskCreating(false) }
  }

  const handleTaskAction = async (action: 'pause' | 'resume' | 'delete', id: string) => {
    const api = (window as any).electronAPI
    if (!api?.scheduler) return
    try {
      if (action === 'pause') await api.scheduler.pause(id)
      else if (action === 'resume') await api.scheduler.resume(id)
      else if (action === 'delete') await api.scheduler.delete(id)
      loadTasks()
      showToast(action === 'delete' ? 'Task deleted' : action === 'pause' ? 'Task paused' : 'Task resumed')
    } catch { showToast('Failed') }
  }

  const handleCreateReminder = async () => {
    if (!newReminderContent.trim() || !newReminderTime) return
    setReminderCreating(true)
    try {
      const triggerAt = new Date(newReminderTime).toISOString()
      const res = await fetch('/api/chat/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: newReminderContent, trigger_at: triggerAt })
      })
      if (res.ok) { setShowNewReminder(false); setNewReminderContent(''); setNewReminderTime(''); loadReminders(); showToast('Reminder created') }
      else { const data = await res.json().catch(() => ({})); showToast(data.error || 'Failed to create reminder') }
    } catch { showToast('Failed to create reminder') }
    finally { setReminderCreating(false) }
  }

  const handleCancelReminder = async (id: string) => {
    try {
      const res = await fetch(`/api/chat/reminders/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) { loadReminders(); showToast('Reminder cancelled') }
      else showToast('Failed to cancel reminder')
    } catch { showToast('Failed to cancel reminder') }
  }

  // ─── Helpers ───
  const formatBytes = (bytes: number) => bytes >= 1e9 ? (bytes / 1e9).toFixed(1) + ' GB' : bytes >= 1e6 ? (bytes / 1e6).toFixed(1) + ' MB' : bytes >= 1e3 ? (bytes / 1e3).toFixed(1) + ' KB' : bytes + ' B'
  const storagePercent = storage ? Math.min(Math.round((storage.used / storage.limit) * 100), 100) : 0
  const storageColor = storagePercent > 90 ? 'bg-red-500' : storagePercent > 70 ? 'bg-amber-500' : 'bg-brand-500'

  return (
    <div className="h-full bg-[var(--bg)] text-[var(--text)] overflow-auto">
      {toast && <div className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg bg-brand-500 text-white text-sm shadow-lg animate-fade-in">{toast}</div>}

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors" title="Back"><ChevronLeft className="w-5 h-5" /></button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="flex gap-6">
          {/* Sidebar tabs */}
          <div className="w-48 shrink-0 space-y-1">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${activeTab === tab.id ? 'bg-brand-500/10 text-brand-400 font-medium' : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'}`}>
                <span>{tab.icon}</span><span>{tab.label}</span>
              </button>
            ))}
            {/* Account management link (web only) */}
            {!isDesktop && (
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <a href="/account" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] transition-colors no-underline">
                  <span>⚙️</span><span>My Account</span>
                </a>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* ─── PROFILE ─── */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-lg font-semibold">Profile</h2>
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Display name</label>
                    <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:border-brand-500 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Email</label>
                    <input type="email" value={user?.email || ''} disabled
                      className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-dim)] text-sm cursor-not-allowed" />
                  </div>
                  <button onClick={handleSaveProfile} disabled={saving}
                    className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm transition-colors disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              </div>
            )}

            {/* ─── IDENTITY ─── */}
            {activeTab === 'identity' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-lg font-semibold">Agent Identity</h2>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Customize how your Lodestone agent looks and behaves</p>
                </div>

                {identityLoading ? (
                  <div className="text-center py-8 text-[var(--text-muted)] animate-pulse">Loading...</div>
                ) : (
                  <>
                    {/* Preview Card */}
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-brand-500/20 flex items-center justify-center text-3xl flex-shrink-0">{identity.avatar_emoji}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-[var(--text)]">{identity.name || 'Unnamed Agent'}</h3>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {identity.profession && <span className="text-sm text-[var(--text-muted)] capitalize">{PROFESSION_CARDS.find(p => p.id === identity.profession)?.emoji} {identity.profession}</span>}
                            {identity.tone && <span className="px-2 py-0.5 rounded text-xs font-medium border bg-cyan-500/20 text-cyan-400 border-cyan-500/30 capitalize">{identity.tone}</span>}
                          </div>
                        </div>
                      </div>
                      {identity.personality && <p className="mt-3 text-sm text-[var(--text-muted)] line-clamp-2">{identity.personality}</p>}
                    </div>

                    {/* Emoji Picker */}
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
                      <label className="block text-sm font-medium text-[var(--text)] mb-3">Agent Emoji</label>
                      <div className="grid grid-cols-8 gap-2">
                        {EMOJIS.map(emoji => (
                          <button key={emoji} onClick={() => setIdentity(prev => ({ ...prev, avatar_emoji: emoji }))}
                            className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                              identity.avatar_emoji === emoji ? 'bg-brand-500/20 border-2 border-brand-500 scale-110' : 'bg-[var(--bg)] border border-[var(--border)] hover:border-brand-500/50'
                            }`}>{emoji}</button>
                        ))}
                      </div>
                    </div>

                    {/* Name */}
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">Agent Name</label>
                      <input type="text" value={identity.name} onChange={e => setIdentity(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Nova, Atlas, Sage..." maxLength={50}
                        className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:border-brand-500 outline-none text-sm" />
                    </div>

                    {/* Profession */}
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
                      <label className="block text-sm font-medium text-[var(--text)] mb-3">Profession</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {PROFESSION_CARDS.map(prof => (
                          <button key={prof.id} onClick={() => setIdentity(prev => ({ ...prev, profession: prof.id }))}
                            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all text-center ${
                              identity.profession === prof.id ? 'bg-brand-500/15 border-2 border-brand-500 text-[var(--text)]' : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] hover:border-brand-500/50'
                            }`}>
                            <span className="text-2xl">{prof.emoji}</span>
                            <span className="text-sm font-medium">{prof.label}</span>
                            <span className="text-[10px] text-[var(--text-dim)]">{prof.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Personality */}
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
                      <label className="block text-sm font-medium text-[var(--text)] mb-3">Personality</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {Object.entries(PERSONALITY_PRESETS).map(([key, preset]) => (
                          <button key={key} onClick={() => { setIdentity(prev => ({ ...prev, personality: preset.text })); setActivePreset(key) }}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                              activePreset === key ? 'bg-brand-500 text-white' : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] hover:border-brand-500/50'
                            }`}>{preset.label}</button>
                        ))}
                      </div>
                      <textarea value={identity.personality} onChange={e => setIdentity(prev => ({ ...prev, personality: e.target.value }))}
                        placeholder="Describe your agent's personality, or pick a preset above..."
                        className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:border-brand-500 outline-none text-sm resize-none" rows={3} />
                    </div>

                    {/* Tone */}
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
                      <label className="block text-sm font-medium text-[var(--text)] mb-3">Tone</label>
                      <div className="flex gap-2">
                        {TONE_OPTIONS.map(opt => (
                          <button key={opt.value} onClick={() => setIdentity(prev => ({ ...prev, tone: opt.value }))}
                            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 flex items-center justify-center gap-1.5 ${
                              identity.tone === opt.value ? 'bg-brand-500 text-white' : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] hover:border-brand-500/50'
                            }`}><span>{opt.emoji}</span>{opt.label}</button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Instructions */}
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">Custom Instructions</label>
                      {(user?.tier === 'free') ? (
                        <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                          <div className="flex items-center gap-2 text-[var(--text-dim)]"><span>🔒</span><span className="text-sm">Custom instructions available on Desktop and Pro plans</span></div>
                          <Link to="/pricing" className="inline-block mt-2 text-sm text-brand-400 hover:text-brand-300 no-underline">Upgrade plan →</Link>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs text-[var(--text-dim)] mb-2">Any additional instructions for how your agent should behave</p>
                          <textarea value={identity.custom_instructions} onChange={e => setIdentity(prev => ({ ...prev, custom_instructions: e.target.value }))}
                            placeholder="e.g. Always respond in French. Focus on code examples. Never use emojis..."
                            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:border-brand-500 outline-none text-sm resize-none" rows={4} />
                        </>
                      )}
                    </div>

                    {/* Save */}
                    {identityError && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4"><p className="text-red-400 text-sm">{identityError}</p></div>}
                    <div className="flex items-center gap-3">
                      <button onClick={handleSaveIdentity} disabled={identitySaving || !hasIdentityChanges}
                        className="px-6 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm transition-colors disabled:opacity-50">
                        {identitySaving ? 'Saving...' : 'Save Identity'}
                      </button>
                      {identitySaved && <span className="text-green-400 text-sm">✓ Saved</span>}
                      {hasIdentityChanges && !identitySaved && <span className="text-[var(--text-dim)] text-sm">Unsaved changes</span>}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ─── APPEARANCE ─── */}
            {activeTab === 'appearance' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-lg font-semibold">Appearance</h2>
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div><span className="text-sm font-medium text-[var(--text)]">Theme</span><p className="text-xs text-[var(--text-dim)]">Dark, light, or system</p></div>
                    <select value={prefs.theme} onChange={e => updatePref('theme', e.target.value)} className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none">
                      <option value="dark">Dark</option><option value="light">Light</option><option value="system">System</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div><span className="text-sm font-medium text-[var(--text)]">Font Size</span><p className="text-xs text-[var(--text-dim)]">Chat message size</p></div>
                    <select value={prefs.font_size} onChange={e => updatePref('font_size', e.target.value)} className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none">
                      <option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div><span className="text-sm font-medium text-[var(--text)]">Message Font</span><p className="text-xs text-[var(--text-dim)]">Font family for messages</p></div>
                    <select value={prefs.message_font} onChange={e => updatePref('message_font', e.target.value)} className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none">
                      <option value="sans">Sans-serif</option><option value="serif">Serif</option><option value="mono">Monospace</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div><span className="text-sm font-medium text-[var(--text)]">Send on Enter</span><p className="text-xs text-[var(--text-dim)]">Press Enter to send, Shift+Enter for newline</p></div>
                    <button onClick={() => updatePref('send_on_enter', !prefs.send_on_enter)} className={`relative w-11 h-6 rounded-full transition-colors ${prefs.send_on_enter ? 'bg-brand-500' : 'bg-[var(--surface-2)]'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${prefs.send_on_enter ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div><span className="text-sm font-medium text-[var(--text)]">Show Timestamps</span><p className="text-xs text-[var(--text-dim)]">Display time on messages</p></div>
                    <button onClick={() => updatePref('show_timestamps', !prefs.show_timestamps)} className={`relative w-11 h-6 rounded-full transition-colors ${prefs.show_timestamps ? 'bg-brand-500' : 'bg-[var(--surface-2)]'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${prefs.show_timestamps ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div><span className="text-sm font-medium text-[var(--text)]">Compact Mode</span><p className="text-xs text-[var(--text-dim)]">Reduce padding for more content</p></div>
                    <button onClick={() => updatePref('compact_mode', !prefs.compact_mode)} className={`relative w-11 h-6 rounded-full transition-colors ${prefs.compact_mode ? 'bg-brand-500' : 'bg-[var(--surface-2)]'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${prefs.compact_mode ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>
                  
                </div>
              </div>
            )}

            {/* ─── DESKTOP ─── */}
            {activeTab === 'desktop' && isDesktop && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-lg font-semibold">Desktop Settings</h2>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Local-first features available in the desktop app</p>
                </div>

                {/* File Access Tier */}
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4"><Shield className="w-5 h-5 text-brand-400" /><h3 className="text-lg font-semibold">File Access</h3></div>
                  <p className="text-sm text-[var(--text-muted)] mb-4">Control which files your agent can access on your computer.</p>
                  <div className="space-y-2">
                    {FILE_TIERS.map(t => (
                      <button key={t.id} onClick={() => handleSetFileTier(t.id)} disabled={fileTierLoading}
                        className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left ${
                          fileTier === t.id ? 'border-brand-500 bg-brand-500/10' : 'border-[var(--border)] bg-[var(--bg)] hover:border-brand-500/50'
                        }`}>
                        <span className="text-xl flex-shrink-0 mt-0.5">{t.icon}</span>
                        <div><div className="flex items-center gap-2"><span className="text-sm font-medium text-[var(--text)]">{t.label}</span>{fileTier === t.id && <span className="text-xs text-brand-400">● Active</span>}</div><p className="text-xs text-[var(--text-dim)] mt-0.5">{t.desc}</p></div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Local Ollama */}
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4"><Cpu className="w-5 h-5 text-brand-400" /><h3 className="text-lg font-semibold">Local Ollama</h3></div>
                  {ollamaStatus ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${ollamaStatus.installed ? 'bg-green-400' : 'bg-red-400'}`} />
                        <span className="text-sm text-[var(--text)]">{ollamaStatus.installed ? `Installed (v${ollamaStatus.version})` : 'Not detected'}</span>
                      </div>
                      {ollamaModels.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-2">Available Models ({ollamaModels.length})</p>
                          <div className="space-y-1">
                            {ollamaModels.map(m => (
                              <div key={m.name} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--surface-2)]">
                                <span className="text-sm text-[var(--text)]">{m.name}</span>
                                <span className="text-xs text-[var(--text-dim)]">{m.size}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : <p className="text-sm text-[var(--text-dim)]">Checking for local Ollama...</p>}
                </div>

                {/* Scheduled Tasks */}
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-brand-400" /><h3 className="text-lg font-semibold">Scheduled Tasks</h3></div>
                    <button onClick={() => setShowCreateTask(true)} className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> New Task</button>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] mb-4">Automated reminders and check-ins that run on your machine.</p>
                  {scheduledTasks.length === 0 ? (
                    <div className="text-center py-6"><p className="text-sm text-[var(--text-dim)]">No scheduled tasks yet</p><p className="text-xs text-[var(--text-dim)] mt-1">Create a task to get reminders at regular intervals</p></div>
                  ) : (
                    <div className="space-y-2">
                      {scheduledTasks.map(task => (
                        <div key={task.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[var(--surface-2)] group">
                          <span className="text-base flex-shrink-0">{schedulerTaskTypes.find(t => t.id === task.task_type)?.icon || '🔔'}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2"><span className="text-sm font-medium text-[var(--text)] truncate">{task.name}</span>{!task.is_active && <span className="text-xs text-amber-400">Paused</span>}</div>
                            <span className="text-xs text-[var(--text-dim)]">{task.cron_expr} · Next: {task.nextRun || '—'}</span>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {task.is_active ? <button onClick={() => handleTaskAction('pause', task.id)} className="p-1 rounded hover:bg-[var(--surface)] text-[var(--text-dim)] hover:text-[var(--text)]" title="Pause">⏸</button> : <button onClick={() => handleTaskAction('resume', task.id)} className="p-1 rounded hover:bg-[var(--surface)] text-[var(--text-dim)] hover:text-[var(--text)]" title="Resume">▶</button>}
                            <button onClick={() => handleTaskAction('delete', task.id)} className="p-1 rounded hover:bg-red-500/20 text-[var(--text-dim)] hover:text-red-400" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Create Task Modal */}
                  {showCreateTask && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreateTask(false)}>
                      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">New Scheduled Task</h3><button onClick={() => setShowCreateTask(false)} className="p-1 text-[var(--text-muted)] hover:text-[var(--text)]"><X className="w-5 h-5" /></button></div>
                        <div className="space-y-4">
                          <div><label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Name</label><input type="text" value={newTaskName} onChange={e => setNewTaskName(e.target.value)} placeholder="e.g. Morning standup" className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500" /></div>
                          <div><label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Type</label><select value={newTaskType} onChange={e => setNewTaskType(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none">{schedulerTaskTypes.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}</select></div>
                          <div><label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Schedule</label><select value={newTaskPreset} onChange={e => setNewTaskPreset(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none">{schedulerPresets.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}</select></div>
                          <div><label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Message <span className="text-[var(--text-dim)]">(optional)</span></label><textarea value={newTaskMessage} onChange={e => setNewTaskMessage(e.target.value)} placeholder="What should the agent say when this fires?" className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none resize-none" rows={2} /></div>
                          <div className="flex gap-3 pt-2"><button onClick={() => setShowCreateTask(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm text-[var(--text-muted)] hover:bg-[var(--surface-2)]">Cancel</button><button onClick={handleCreateTask} disabled={!newTaskName.trim() || taskCreating} className="flex-1 px-4 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium disabled:opacity-50">{taskCreating ? 'Creating...' : 'Create Task'}</button></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cloud Sync */}
                {isDesktop && <CloudSyncSection />}

                {/* Audit Log */}
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4"><FileText className="w-5 h-5 text-brand-400" /><h3 className="text-lg font-semibold">Audit Log</h3></div>
                  <p className="text-sm text-[var(--text-muted)]">All tool calls are logged to <code className="text-xs bg-[var(--surface-2)] px-1.5 py-0.5 rounded">~/.lodestone/tool-audit.log</code></p>
                </div>
              </div>
            )}

            {activeTab === 'reminders' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-lg font-semibold">Reminders</h2>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Upcoming reminders you've set through chat</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-dim)]">{reminders.length} upcoming reminder{reminders.length !== 1 ? 's' : ''}</span>
                  <button onClick={() => setShowNewReminder(true)} className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> New Reminder</button>
                </div>
                {remindersLoading ? (
                  <div className="text-center py-8"><div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full mx-auto" /><p className="text-sm text-[var(--text-dim)] mt-2">Loading reminders...</p></div>
                ) : reminders.length === 0 ? (
                  <div className="text-center py-8 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
                    <Bell className="w-10 h-10 text-[var(--text-dim)] mx-auto mb-3" />
                    <p className="text-sm text-[var(--text-dim)]">No upcoming reminders</p>
                    <p className="text-xs text-[var(--text-dim)] mt-1">Ask in chat to set one, or create one here</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {reminders.map((r: any) => (
                      <div key={r.id} className="flex items-center justify-between px-4 py-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] group">
                        <div className="flex-1 min-w-0 mr-3">
                          <p className="text-sm text-[var(--text)] truncate">{r.content}</p>
                          <p className="text-xs text-[var(--text-dim)] mt-0.5">{new Date(r.trigger_at).toLocaleString()}</p>
                        </div>
                        <button onClick={() => handleCancelReminder(r.id)} className="p-1.5 rounded hover:bg-red-500/20 text-[var(--text-dim)] hover:text-red-400 transition-all opacity-0 group-hover:opacity-100" title="Cancel"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                )}
                {showNewReminder && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowNewReminder(false)}>
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">New Reminder</h3><button onClick={() => setShowNewReminder(false)} className="p-1 text-[var(--text-muted)] hover:text-[var(--text)]"><X className="w-5 h-5" /></button></div>
                      <div className="space-y-4">
                        <div><label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">What to remind you about</label><input type="text" value={newReminderContent} onChange={e => setNewReminderContent(e.target.value)} placeholder="e.g. Check on client project" className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500" /></div>
                        <div><label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">When</label><input type="datetime-local" value={newReminderTime} onChange={e => setNewReminderTime(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500" /></div>
                        <div className="flex gap-3 pt-2"><button onClick={() => setShowNewReminder(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm text-[var(--text-muted)] hover:bg-[var(--surface-2)]">Cancel</button><button onClick={handleCreateReminder} disabled={!newReminderContent.trim() || !newReminderTime || reminderCreating} className="flex-1 px-4 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium disabled:opacity-50">{reminderCreating ? 'Creating...' : 'Create Reminder'}</button></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* ─── STORAGE ─── */}
            {activeTab === 'storage' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-lg font-semibold">Storage</h2>
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4"><HardDrive className="w-5 h-5 text-brand-400" /></div>
                  {storage ? (
                    <div>
                      <div className="flex justify-between text-sm mb-2"><span className="text-[var(--text-muted)]">{formatBytes(storage.used)} of {formatBytes(storage.limit)} used</span><span className="text-[var(--text-dim)]">{storagePercent.toFixed(0)}%</span></div>
                      <div className="w-full h-2.5 bg-[var(--surface-2)] rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${storagePercent}%`, backgroundColor: storageColor }} /></div>
                      {storage.breakdown && (
                        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                          <div className="text-center p-2 rounded-lg bg-[var(--surface-2)]"><div className="text-[var(--text)] font-medium">{formatBytes(storage.breakdown.conversations)}</div><div className="text-[var(--text-dim)] text-xs">Conversations</div></div>
                          <div className="text-center p-2 rounded-lg bg-[var(--surface-2)]"><div className="text-[var(--text)] font-medium">{formatBytes(storage.breakdown.memories)}</div><div className="text-[var(--text-dim)] text-xs">Memories</div></div>
                          <div className="text-center p-2 rounded-lg bg-[var(--surface-2)]"><div className="text-[var(--text)] font-medium">{formatBytes(storage.breakdown.files)}</div><div className="text-[var(--text-dim)] text-xs">Files</div></div>
                        </div>
                      )}
                    </div>
                  ) : <p className="text-sm text-[var(--text-dim)]">Loading storage info...</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
