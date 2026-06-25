import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Check, X, Search, Brain as BrainIcon, Sparkles, BookOpen, Trash2, ChevronRight } from 'lucide-react'
import AuditLogPanel from '../components/AuditLogPanel'
import KnowledgeGraphPanel from '../components/KnowledgeGraphPanel'
import BrowserAutomation from '../components/BrowserAutomation'
import SubAgentPanel from '../components/SubAgentPanel'
import ScheduledTasksPanel from '../components/ScheduledTasksPanel'

interface StagedMemory {
  id: string
  content: string
  category: string
  importance: number
  source: string
  created_at: string
}

interface StagedSkill {
  id: string
  name: string
  description: string
  trigger: string
  created_at: string
}

interface BrainTask {
  id: string
  title: string
  description: string
  type: string
  status: string
  progress: number
  result: string | null
  error: string | null
  parent_task_id: string | null
  conversation_id: string | null
  created_at: string
  started_at: string | null
  completed_at: string | null
}

interface MCPConnection {
  name: string
  command: string
  connected: boolean
  toolCount: number
}

interface SearchResult {
  conversations: any[]
  messages: any[]
  memories: any[]
  total: number
}

export default function Brain() {
  const { accessToken } = useAuth()
  const token = accessToken || localStorage.getItem('lodestone_access_token')
  const [stagedMemories, setStagedMemories] = useState<StagedMemory[]>([])
  const [stagedSkills, setStagedSkills] = useState<StagedSkill[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [learnUrl, setLearnUrl] = useState('')
  const [learnDesc, setLearnDesc] = useState('')
  const [learnLoading, setLearnLoading] = useState(false)
  const [tasks, setTasks] = useState<BrainTask[]>([])
  const [mcpConnections, setMcpConnections] = useState<MCPConnection[]>([])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [mcpName, setMcpName] = useState('')
  const [mcpCommand, setMcpCommand] = useState('')
  const [activeTab, setActiveTab] = useState<'review' | 'search' | 'learn' | 'tasks' | 'graph' | 'browser' | 'audit' | 'schedule' | 'mcp'>('review')
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  useEffect(() => { loadStaged(); loadTasks() }, [])

  const loadStaged = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/brain/staged', { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        setStagedMemories(data.memories || [])
        setStagedSkills(data.skills || [])
      }
    } catch {}
    setLoading(false)
  }

  const loadTasks = async () => {
    try {
      const res = await fetch('/api/brain/tasks', { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        setTasks(data.tasks || [])
      }
    } catch {}
  }

  const approveMemory = async (id: string) => {
    await fetch(`/api/brain/memories/${id}/approve`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    setStagedMemories(prev => prev.filter(m => m.id !== id))
  }

  const rejectMemory = async (id: string) => {
    await fetch(`/api/brain/memories/${id}/reject`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    setStagedMemories(prev => prev.filter(m => m.id !== id))
  }

  const approveAll = async () => { for (const m of stagedMemories) await approveMemory(m.id) }
  const rejectAll = async () => { for (const m of stagedMemories) await rejectMemory(m.id) }

  const search = async () => {
    if (!searchQuery.trim()) return
    setSearchLoading(true)
    try {
      const res = await fetch(`/api/brain/search?q=${encodeURIComponent(searchQuery)}&limit=20`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) setSearchResults(await res.json())
    } catch {}
    setSearchLoading(false)
  }

  const learn = async () => {
    setLearnLoading(true)
    try {
      const res = await fetch('/api/brain/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ url: learnUrl || undefined, description: learnDesc || undefined })
      })
      if (res.ok) { setLearnUrl(''); setLearnDesc(''); loadStaged() }
    } catch {}
    setLearnLoading(false)
  }

  const createTask = async (title: string, description: string, type: string = 'research') => {
    try {
      await fetch('/api/brain/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, description, type })
      })
      loadTasks()
    } catch {}
  }

  const deleteTask = async (id: string) => {
    try {
      await fetch(`/api/brain/tasks/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch {}
  }

  const categoryColors: Record<string, string> = {
    fact: 'bg-blue-500/20 text-blue-400',
    preference: 'bg-purple-500/20 text-purple-400',
    decision: 'bg-amber-500/20 text-amber-400',
  }

  const statusColors: Record<string, string> = {
    completed: 'bg-green-500/20 text-green-400',
    running: 'bg-blue-500/20 text-blue-400',
    failed: 'bg-red-500/20 text-red-400',
    pending: 'bg-gray-500/20 text-gray-400',
    cancelled: 'bg-gray-500/20 text-gray-400',
  }

  const totalStaged = stagedMemories.length + stagedSkills.length
  const tabLabel = (tab: string) => {
    switch (tab) {
      case 'review': return totalStaged > 0 ? `Review (${totalStaged})` : 'Review'
      case 'search': return 'Search'
      case 'learn': return 'Learn'
      case 'tasks': return 'Tasks'
      case 'graph': return 'Graph'
      case 'browser': return 'Browser'
      case 'audit': return 'Audit'
      case 'schedule': return 'Schedule'
      case 'mcp': return 'MCP'
      default: return tab
    }
  }

  return (
    <div className="h-full bg-[var(--bg)] text-[var(--text)] overflow-auto">
      <div className="max-w-3xl mx-auto px-4 pt-20 pb-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-brand-500/20"><BrainIcon className="w-6 h-6 text-brand-400" /></div>
          <div>
            <h1 className="text-2xl font-bold">Brain</h1>
            <p className="text-sm text-[var(--text-muted)]">Self-improving memory, skills, tasks, and search</p>
          </div>
          {totalStaged > 0 && (
            <span className="ml-auto px-3 py-1 rounded-full bg-brand-500 text-white text-xs font-bold">{totalStaged} pending</span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-[var(--surface-2)] rounded-xl overflow-x-auto">
          {(['review', 'search', 'learn', 'tasks', 'graph', 'browser', 'audit', 'schedule', ...(typeof window !== 'undefined' && !!(window as any).electronAPI ? ['mcp' as const] : [])] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab ? 'bg-[var(--surface)] text-[var(--text)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}>
              {tabLabel(tab)}
            </button>
          ))}
        </div>

        {/* Review Tab */}
        {activeTab === 'review' && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12"><div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full" /></div>
            ) : stagedMemories.length === 0 && stagedSkills.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-10 h-10 text-[var(--text-dim)] mx-auto mb-3" />
                <p className="text-[var(--text-muted)]">No pending reviews</p>
                <p className="text-sm text-[var(--text-dim)] mt-1">Memories and skills will appear here after conversations</p>
              </div>
            ) : (
              <>
                {stagedMemories.length > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-[var(--text-muted)]">Suggested Memories ({stagedMemories.length})</h2>
                    <div className="flex gap-2">
                      <button onClick={approveAll} className="px-3 py-1 rounded-lg bg-green-500/10 text-green-400 text-xs hover:bg-green-500/20 transition-colors">Approve All</button>
                      <button onClick={rejectAll} className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors">Reject All</button>
                    </div>
                  </div>
                )}
                {stagedMemories.map(m => (
                  <div key={m.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm text-[var(--text)]">{m.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${categoryColors[m.category] || 'bg-gray-500/20 text-gray-400'}`}>{m.category}</span>
                          <span className="text-xs text-[var(--text-dim)]">Importance: {m.importance.toFixed(1)}</span>
                          <span className="text-xs text-[var(--text-dim)]">Source: {m.source}</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => approveMemory(m.id)} className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"><Check className="w-4 h-4" /></button>
                        <button onClick={() => rejectMemory(m.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><X className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
                {stagedSkills.length > 0 && (
                  <>
                    <h2 className="text-sm font-medium text-[var(--text-muted)] mt-6">Suggested Skills ({stagedSkills.length})</h2>
                    {stagedSkills.map(s => (
                      <div key={s.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[var(--text)]">{s.name}</p>
                            <p className="text-sm text-[var(--text-muted)] mt-0.5">{s.description}</p>
                            {s.trigger && <p className="text-xs text-[var(--text-dim)] mt-1">Triggers: {s.trigger}</p>}
                          </div>
                          <div className="flex gap-1.5">
                            <button className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"><Check className="w-4 h-4" /></button>
                            <button className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><X className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div>
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)]" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && search()}
                  placeholder="Search conversations, messages, and memories..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500" />
              </div>
              <button onClick={search} disabled={searchLoading}
                className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium disabled:opacity-50 transition-colors">
                {searchLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
            {searchResults && (
              <div className="space-y-4">
                {searchResults.total === 0 ? (
                  <div className="text-center py-8 text-[var(--text-muted)]">No results found</div>
                ) : (
                  <>
                    {searchResults.memories.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-[var(--text-muted)] mb-2">Memories ({searchResults.memories.length})</h3>
                        {searchResults.memories.map((m: any) => (
                          <div key={m.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 mb-2">
                            <p className="text-sm text-[var(--text)]">{m.content}</p>
                            <div className="flex gap-2 mt-1"><span className="text-xs text-[var(--text-dim)]">{m.category}</span><span className="text-xs text-[var(--text-dim)]">Importance: {m.importance}</span></div>
                          </div>
                        ))}
                      </div>
                    )}
                    {searchResults.conversations.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-[var(--text-muted)] mb-2">Conversations ({searchResults.conversations.length})</h3>
                        {searchResults.conversations.map((c: any) => (
                          <div key={c.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 mb-2 cursor-pointer hover:border-brand-500/50 transition-colors">
                            <p className="text-sm font-medium text-[var(--text)]">{c.title || 'Untitled'}</p>
                            <p className="text-xs text-[var(--text-dim)] mt-0.5">{new Date(c.updated_at).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {searchResults.messages.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-[var(--text-muted)] mb-2">Messages ({searchResults.messages.length})</h3>
                        {searchResults.messages.slice(0, 10).map((m: any) => (
                          <div key={m.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 mb-2">
                            <p className="text-sm text-[var(--text)]">{m.content.slice(0, 200)}{m.content.length > 200 ? '...' : ''}</p>
                            <p className="text-xs text-[var(--text-dim)] mt-1">{m.role} · {m.conversation_title || 'Unknown'} · {new Date(m.created_at).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Learn Tab */}
        {activeTab === 'learn' && (
          <div className="space-y-4">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4"><BookOpen className="w-5 h-5 text-brand-400" /><h2 className="text-lg font-semibold">Learn from URL or Description</h2></div>
              <p className="text-sm text-[var(--text-muted)] mb-4">Point at a URL, paste content, or describe a workflow. The brain will create a reusable skill from it.</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">URL (optional)</label>
                  <input type="url" value={learnUrl} onChange={e => setLearnUrl(e.target.value)}
                    placeholder="https://example.com/guide" className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500" />
                </div>
                <div className="text-center text-[var(--text-dim)] text-sm">or</div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Description (optional)</label>
                  <textarea value={learnDesc} onChange={e => setLearnDesc(e.target.value)} rows={4}
                    placeholder="Describe a workflow, pattern, or knowledge you want the agent to learn..."
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500 resize-none" />
                </div>
                <button onClick={learn} disabled={learnLoading || (!learnUrl && !learnDesc)}
                  className="w-full px-4 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium disabled:opacity-50 transition-colors">
                  {learnLoading ? 'Learning...' : 'Create Skill'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === tasks && (
          <SubAgentPanel />
        )}


        {/* MCP Tab */}
        {activeTab === 'graph' && (
          <KnowledgeGraphPanel />
        )}
        {activeTab === 'browser' && (
          <BrowserAutomation />
        )}
        {activeTab === 'audit' && (
          <AuditLogPanel />
        )}
        {activeTab === 'schedule' && (
          <ScheduledTasksPanel />
        )}
        {activeTab === 'mcp' && (
          <div className="space-y-4">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🔌</span>
                <h2 className="text-lg font-semibold">Model Context Protocol</h2>
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-4">Connect to MCP servers to extend Lodestone with external tools. MCP servers run locally and expose tools that Lodestone can invoke during conversations.</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Server Name</label>
                  <input type="text" value={mcpName} onChange={e => setMcpName(e.target.value)}
                    placeholder="e.g., filesystem" className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Command</label>
                  <input type="text" value={mcpCommand} onChange={e => setMcpCommand(e.target.value)}
                    placeholder="e.g., npx @anthropic/mcp-server-filesystem /home/user" className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500" />
                </div>
                <button onClick={async () => {
                  if (!mcpName || !mcpCommand) return
                  try {
                    const isDesktop = !!(window as any).electronAPI?.mcp
                    if (isDesktop) {
                      const result = await (window as any).electronAPI.mcp.connect(mcpName, mcpCommand, [], {})
                      setMcpConnections(prev => [...prev, { name: mcpName, command: mcpCommand, connected: !result.error, toolCount: result.tools?.length || 0 }])
                      setMcpName(''); setMcpCommand('')
                    }
                  } catch {}
                }} disabled={!mcpName || !mcpCommand}
                  className="w-full px-4 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium disabled:opacity-50 transition-colors">
                  Connect
                </button>
              </div>
            </div>
            {mcpConnections.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-[var(--text-muted)]">Connected Servers</h3>
                {mcpConnections.map(conn => (
                  <div key={conn.name} className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[var(--text)]">{conn.name}</p>
                      <p className="text-xs text-[var(--text-dim)]">{conn.toolCount} tools available</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${conn.connected ? 'bg-green-400' : 'bg-red-400'}`} />
                      <button onClick={async () => {
                        try { await (window as any).electronAPI?.mcp?.disconnect(conn.name) } catch {}
                        setMcpConnections(prev => prev.filter(c => c.name !== conn.name))
                      }} className="text-xs text-red-400 hover:text-red-300 transition-colors">Disconnect</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
              <p className="text-xs text-[var(--text-dim)]">MCP is available in the desktop app. Connect MCP servers to add tools like filesystem access, web browsing, database queries, and more. <a href="https://modelcontextprotocol.io" className="text-brand-400 hover:underline" target="_blank">Learn more →</a></p>
            </div>
          </div>
        )}
        {/* Toast */}
        {toast && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium shadow-lg animate-fade-in">
            {toast}
          </div>
        )}
      </div>
    </div>
  )
}