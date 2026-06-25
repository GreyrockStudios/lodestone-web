import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useAdmin } from '../hooks/useAdmin'
import Chat from '../pages/Chat'
import Memory from '../pages/Memory'
import Identity from '../pages/Identity'
import Settings from '../pages/Settings'
import SlidePanel from './SlidePanel'
import CommitmentsPanel from './CommitmentsPanel'

type PanelType = 'memory' | 'identity' | 'settings' | 'commitments' | null

interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at?: string
}

export default function AppShell() {
  const { user, logout } = useAuth()
  const { isAdmin } = useAdmin()
  const navigate = useNavigate()
  const location = useLocation()
  const [activePanel, setActivePanel] = useState<PanelType>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [mobileConversationsOpen, setMobileConversationsOpen] = useState(false)

  // Commitments state
  const [commitments, setCommitments] = useState<{id: string, content: string, due_date: string | null, status: string}[]>([])

  // Extract conversation ID from URL if present
  const pathParts = location.pathname.match(/^\/chat\/(.+)$/)
  const conversationId = pathParts ? pathParts[1] : null

  // Toast system
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' }[]>([])

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  // Toast event listener
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      showToast(detail.message, detail.type || 'success')
    }
    window.addEventListener('app-toast', handler as EventListener)
    return () => window.removeEventListener('app-toast', handler as EventListener)
  }, [showToast])

  const getToken = useCallback(() => {
    return localStorage.getItem('lodestone_access_token') || ''
  }, [])

  // Load conversations
  const loadConversations = useCallback(() => {
    const token = getToken()
    if (!token) return
    fetch('/api/chat/conversations', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.conversations) setConversations(data.conversations) })
      .catch(() => {})
  }, [getToken])

  // Load commitments
  const loadCommitments = useCallback(() => {
    const token = getToken()
    if (!token) return
    fetch('/api/chat/commitments?status=pending', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.commitments) setCommitments(data.commitments) })
      .catch(() => {})
  }, [getToken])

  useEffect(() => { loadConversations() }, [loadConversations])
  useEffect(() => { loadCommitments() }, [loadCommitments])

  // Listen for conversation changes from Chat
  useEffect(() => {
    const handler = () => { loadConversations(); loadCommitments() }
    window.addEventListener('conversations-changed', handler)
    return () => window.removeEventListener('conversations-changed', handler)
  }, [loadConversations, loadCommitments])

  // Listen for custom open-panel events from chat error messages etc.
  useEffect(() => {
    const handleOpenPanel = (e: CustomEvent) => {
      const panel = e.detail as PanelType
      if (panel === 'memory' || panel === 'identity' || panel === 'settings' || panel === 'commitments') {
        setActivePanel(panel)
      }
    }
    window.addEventListener('open-panel', handleOpenPanel as EventListener)
    return () => window.removeEventListener('open-panel', handleOpenPanel as EventListener)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+Shift+M = Memory
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'M') {
        e.preventDefault()
        setActivePanel(prev => prev === 'memory' ? null : 'memory')
      }
      // Cmd+Shift+I = Identity
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        setActivePanel(prev => prev === 'identity' ? null : 'identity')
      }
      // Cmd+Shift+T = Tasks
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault()
        setActivePanel(prev => prev === 'commitments' ? null : 'commitments')
      }
      // Cmd+, = Settings
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault()
        setActivePanel(prev => prev === 'settings' ? null : 'settings')
      }
      // Escape = close mobile menu
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  const openPanel = useCallback((panel: PanelType) => {
    setActivePanel(panel)
    setMobileMenuOpen(false)
  }, [])

  const closePanel = useCallback(() => {
    setActivePanel(null)
  }, [])

  const handleNewChat = useCallback(() => {
    navigate('/chat')
    setMobileMenuOpen(false)
  }, [navigate])

  const handleLogout = useCallback(async () => {
    await logout()
    navigate('/')
  }, [logout, navigate])

  const handleConversationClick = useCallback((id: string) => {
    navigate(`/chat/${id}`, { replace: true })
    setMobileMenuOpen(false)
  }, [navigate])

  const handleDeleteConversation = useCallback(async (id: string) => {
    const token = getToken()
    if (!token) return
    try {
      const res = await fetch(`/api/chat/conversations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        loadConversations()
        showToast('Conversation deleted')
        // If we're viewing this conversation, navigate to new chat
        if (conversationId === id) {
          navigate('/chat', { replace: true })
        }
      }
    } catch {}
  }, [getToken, loadConversations, conversationId, navigate, showToast])

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Nav items for bottom section of sidebar
  const panelItems = [
    { type: 'memory' as PanelType, label: 'Memory', icon: '🕸️', shortcut: '⌘⇧M' },
    { type: 'identity' as PanelType, label: 'Identity', icon: '🧠', shortcut: '⌘⇧I' },
    { type: 'commitments' as PanelType, label: 'Tasks', icon: '📋', shortcut: '⌘⇧T' },
    { type: 'settings' as PanelType, label: 'Settings', icon: '⚙️', shortcut: '⌘⇧,' },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`
          fixed md:relative z-50 md:z-auto h-full flex flex-col flex-shrink-0
          border-r border-[var(--border)] bg-[var(--surface)]
          transition-all duration-200 ease-in-out
          ${sidebarCollapsed ? 'w-[60px]' : 'w-[260px]'}
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-3 py-3 border-b border-[var(--border)] min-h-[56px]">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 no-underline flex-shrink-0"
            title="Lodestone"
          >
            <svg width="24" height="24" viewBox="0 0 512 512" className="flex-shrink-0">
              <circle cx="256" cy="256" r="22" fill="#8B5CF6" opacity="0.85"/>
              <circle cx="256" cy="256" r="10" fill="#fff" opacity="0.95"/>
            </svg>
            <span className={`font-bold text-lg text-[var(--text)] transition-all duration-150 whitespace-nowrap overflow-hidden ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
              Lodestone
            </span>
          </button>
          {/* Mobile close button */}
          <button
            className="md:hidden ml-auto p-1 text-[var(--text-muted)] hover:text-[var(--text)]"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* New Chat button */}
        <div className="px-2 pt-3 pb-2">
          <button
            onClick={handleNewChat}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            title="New Chat"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span className={`transition-all duration-150 whitespace-nowrap overflow-hidden ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
              New Chat
            </span>
          </button>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className={`px-2 pt-1 pb-1 ${sidebarCollapsed ? 'hidden' : ''}`}>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)] px-3">Conversations</span>
          </div>
          {sidebarCollapsed ? (
            conversations.slice(0, 5).map(conv => (
              <div key={conv.id} className="px-1.5 py-0.5">
                <button
                  onClick={() => handleConversationClick(conv.id)}
                  className={`w-full flex items-center justify-center p-2 rounded-lg transition-colors ${
                    conversationId === conv.id
                      ? 'bg-brand-500/15 text-brand-400'
                      : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                  }`}
                  title={conv.title || 'New chat'}
                >
                  <span className="text-sm">💬</span>
                </button>
              </div>
            ))
          ) : (
            <div className="px-2 space-y-0.5">
              {conversations.length === 0 && (
                <p className="px-3 py-2 text-xs text-[var(--text-dim)]">No conversations yet</p>
              )}
              {conversations.slice(0, 20).map(conv => (
                <div
                  key={conv.id}
                  className={`group flex items-center gap-1 rounded-lg transition-colors ${
                    conversationId === conv.id
                      ? 'bg-brand-500/15'
                      : 'hover:bg-[var(--surface-2)]'
                  }`}
                >
                  <button
                    onClick={() => handleConversationClick(conv.id)}
                    className={`flex-1 text-left px-3 py-1.5 text-sm truncate transition-colors ${
                      conversationId === conv.id
                        ? 'text-brand-400'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    <span className="mr-1.5 text-xs">💬</span>
                    {conv.title || 'New chat'}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm(conv.id) }}
                    className="opacity-0 group-hover:opacity-100 p-1 mr-1 rounded hover:bg-red-500/20 text-[var(--text-muted)] hover:text-red-400 transition-all"
                    title="Delete"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Commitments section */}
        {commitments.length > 0 && (
          <div className="px-2 py-1 border-t border-[var(--border)]">
            <div className={`px-2 py-1.5 ${sidebarCollapsed ? 'hidden' : ''}`}>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                Tasks <span className="text-amber-400">{commitments.length}</span>
              </span>
            </div>
            {sidebarCollapsed ? (
              <button
                onClick={() => setActivePanel('commitments')}
                className="w-full flex items-center justify-center p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-2)]"
                title={`${commitments.length} pending tasks`}
              >
                <span className="text-sm">📋</span>
              </button>
            ) : (
              commitments.slice(0, 3).map(c => (
                <div key={c.id} className="px-2 py-1 text-xs text-[var(--text-muted)] truncate flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <span className="truncate">{c.content}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Bottom nav: Memory, Identity, Settings */}
        <div className="border-t border-[var(--border)] px-2 py-2 space-y-0.5">
          {panelItems.map(item => (
            <button
              key={item.type}
              onClick={() => openPanel(item.type)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activePanel === item.type
                  ? 'bg-brand-500/15 text-brand-400'
                  : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
              title={`${item.label} (${item.shortcut})`}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              <span className={`transition-all duration-150 whitespace-nowrap overflow-hidden ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                {item.label}
              </span>
            </button>
          ))}

          {isAdmin && (
            <button
              onClick={() => { navigate('/admin'); setMobileMenuOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
              title="Admin"
            >
              <span className="text-base flex-shrink-0">🛡️</span>
              <span className={`transition-all duration-150 whitespace-nowrap overflow-hidden ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                Admin
              </span>
            </button>
          )}
        </div>

        {/* User section */}
        <div className="border-t border-[var(--border)] px-3 py-2.5">
          <div className={`flex items-center gap-2.5 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-sm font-bold flex-shrink-0">
              {user?.displayName?.[0]?.toUpperCase() || '?'}
            </div>
            <div className={`flex-1 min-w-0 transition-all duration-150 overflow-hidden ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
              <p className="text-sm font-medium text-[var(--text)] truncate">{user?.displayName}</p>
              <p className="text-xs text-[var(--text-dim)]">{user?.tier || 'community'}</p>
            </div>
            <button
              onClick={handleLogout}
              className={`text-[var(--text-dim)] hover:text-[var(--danger)] transition-colors flex-shrink-0 ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : ''}`}
              title="Sign out"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main area — Chat is always visible */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header bar */}
        <header className="flex md:hidden items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)] flex-shrink-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 512 512">
              <circle cx="256" cy="256" r="22" fill="#8B5CF6" opacity="0.85"/>
              <circle cx="256" cy="256" r="10" fill="#fff" opacity="0.95"/>
            </svg>
            <span className="font-bold text-[var(--text)]">Lodestone</span>
          </div>
          <div className="flex-1" />
          {/* Mobile conversations button */}
          <button
            onClick={() => setMobileConversationsOpen(true)}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] rounded-lg transition-colors"
            title="Conversations"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
          <button
            onClick={() => openPanel('commitments')}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] rounded-lg transition-colors"
            title="Tasks"
          >
            <span>📋</span>
          </button>
          <button
            onClick={() => openPanel('memory')}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] rounded-lg transition-colors"
            title="Memory"
          >
            <span>🕸️</span>
          </button>
          <button
            onClick={() => openPanel('identity')}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] rounded-lg transition-colors"
            title="Identity"
          >
            <span>🧠</span>
          </button>
          <button
            onClick={() => openPanel('settings')}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] rounded-lg transition-colors"
            title="Settings"
          >
            <span>⚙️</span>
          </button>
        </header>

        {/* Chat fills the main area */}
        <div className="flex-1 overflow-hidden">
          <Chat conversationId={conversationId} />
        </div>
      </div>

      {/* Mobile conversations bottom sheet */}
      {mobileConversationsOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileConversationsOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--surface)] border-t border-[var(--border)] rounded-t-2xl max-h-[70vh] flex flex-col animate-fade-in">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <span className="font-semibold text-[var(--text)]">Conversations</span>
              <button
                onClick={() => setMobileConversationsOpen(false)}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <p className="px-4 py-6 text-sm text-[var(--text-dim)] text-center">No conversations yet</p>
              ) : (
                conversations.slice(0, 20).map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => { handleConversationClick(conv.id); setMobileConversationsOpen(false) }}
                    className={`w-full text-left px-4 py-3 border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors ${
                      conversationId === conv.id ? 'bg-brand-500/10 text-brand-400' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    <span className="mr-2 text-sm">💬</span>
                    <span className="text-sm">{conv.title || 'New chat'}</span>
                  </button>
                ))
              )}
            </div>
            <div className="px-4 py-3 border-t border-[var(--border)]">
              <button
                onClick={() => { handleNewChat(); setMobileConversationsOpen(false) }}
                className="w-full px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
              >
                + New Chat
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 max-w-sm mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-[var(--text)] font-semibold mb-2">Delete conversation?</h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">This will permanently delete the conversation and all its messages.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-2)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { handleDeleteConversation(deleteConfirm); setDeleteConfirm(null) }}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg animate-fade-in ${
            t.type === 'error'
              ? 'bg-red-500/90 text-white'
              : 'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]'
          }`}>
            {t.message}
          </div>
        ))}
      </div>

      {/* Slide-over panels */}
      <SlidePanel isOpen={activePanel === 'memory'} onClose={closePanel} title="Memory" icon="🕸️">
        <Memory />
      </SlidePanel>

      <SlidePanel isOpen={activePanel === 'identity'} onClose={closePanel} title="Identity" icon="🧠">
        <Identity />
      </SlidePanel>

      <SlidePanel isOpen={activePanel === 'settings'} onClose={closePanel} title="Settings" icon="⚙️">
        <Settings />
      </SlidePanel>

      <SlidePanel isOpen={activePanel === 'commitments'} onClose={closePanel} title="Tasks" icon="📋">
        <CommitmentsPanel />
      </SlidePanel>
    </div>
  )
}