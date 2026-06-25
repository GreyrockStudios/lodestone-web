import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'

interface MemoryEntry {
  id: string
  content: string
  category: string
  importance?: number
  source?: string
  source_type?: string
  created_at: string
}

interface MemoryNode {
  id: string
  label: string
  fullContent?: string
  type: string
  x: number
  y: number
  importance?: number
}

interface MemoryEdge {
  source: string
  target: string
  label?: string
  strength?: number
  implicit?: boolean
}

const CATEGORY_OPTIONS = [
  { id: 'fact', label: 'Fact', icon: '📌', desc: 'Something that\'s true' },
  { id: 'entity', label: 'Person or Thing', icon: '👤', desc: 'A person, place, or thing' },
  { id: 'concept', label: 'Concept', icon: '💡', desc: 'An idea or method' },
  { id: 'event', label: 'Event', icon: '📅', desc: 'Something that happened' },
]

const CATEGORY_COLORS: Record<string, string> = {
  identity: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  entity: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  concept: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  event: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  fact: 'bg-green-500/15 text-green-400 border-green-500/30',
}

const CATEGORY_ICONS: Record<string, string> = {
  identity: '🔮', entity: '👤', concept: '💡', event: '📅', fact: '📌',
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export default function Memory() {
  const { accessToken } = useAuth()
  const [memories, setMemories] = useState<MemoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newContent, setNewContent] = useState('')
  const [newCategory, setNewCategory] = useState('fact')
  const [saving, setSaving] = useState(false)
  const [view, setView] = useState<'list' | 'graph'>('list')
  const [memoryTab, setMemoryTab] = useState<'memories' | 'documents'>('memories')
  const [graphNodes, setGraphNodes] = useState<MemoryNode[]>([])
  const [graphEdges, setGraphEdges] = useState<MemoryEdge[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodePositions = useRef<Map<string, { x: number; y: number }>>(new Map())
  const [dragNode, setDragNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  // Documents state
  const [documents, setDocuments] = useState<any[]>([])
  const [documentsLoading, setDocumentsLoading] = useState(false)

  const token = accessToken || localStorage.getItem('lodestone_access_token')

  const fetchMemories = useCallback(async () => {
    if (!token) return
    try {
      const params = new URLSearchParams()
      if (categoryFilter) params.set('category', categoryFilter)
      if (searchQuery) params.set('search', searchQuery)
      params.set('limit', '100')
      const res = await fetch(`/api/memory?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setMemories(data.entries || [])
    } catch (err) {
      console.error('Failed to fetch memories:', err)
    }
  }, [token, searchQuery, categoryFilter])

  const fetchDocuments = useCallback(async () => {
    if (!token) return
    setDocumentsLoading(true)
    try {
      const res = await fetch('/api/chat/files', { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        setDocuments(data.files || [])
      }
    } catch {
      // Silently fail
    } finally {
      setDocumentsLoading(false)
    }
  }, [token])

  const deleteDocument = async (id: string) => {
    if (!token) return
    try {
      await fetch(`/api/chat/files/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      setDocuments(prev => prev.filter(d => d.id !== id))
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Document deleted', type: 'success' } }))
    } catch {}
  }

  const fetchGraph = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch('/api/memory/graph', { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setGraphNodes(data.nodes || [])
      setGraphEdges(data.edges || [])
      data.nodes?.forEach((n: MemoryNode) => {
        nodePositions.current.set(n.id, { x: n.x, y: n.y })
      })
    } catch (err) {
      console.error('Failed to fetch graph:', err)
    }
  }, [token])

  useEffect(() => {
    if (!token) { setLoading(false); return }
    Promise.all([fetchMemories(), fetchGraph()]).finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchMemories() }, [searchQuery, categoryFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (memoryTab === 'documents' && token) {
      fetchDocuments()
    }
  }, [memoryTab, token]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdd = async () => {
    if (!newContent.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: newContent.trim(), category: newCategory, importance: 0.7, source_type: 'manual' }),
      })
      if (!res.ok) throw new Error('Failed')
      const entry = await res.json()
      setMemories(prev => [entry, ...prev])
      setNewContent('')
      setShowAdd(false)
      fetchGraph()
    } catch (err) {
      console.error('Failed to save memory:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/memory/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      setMemories(prev => prev.filter(m => m.id !== id))
      fetchGraph()
    } catch (err) {
      console.error('Failed to delete memory:', err)
    }
  }

  // Canvas graph drawing
  useEffect(() => {
    if (view !== 'graph' || !canvasRef.current || graphNodes.length === 0) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    const w = rect.width, h = rect.height
    ctx.clearRect(0, 0, w, h)

    const colors: Record<string, string> = {
      identity: '#8B5CF6', entity: '#3B82F6', concept: '#06B6D4', event: '#F59E0B', fact: '#22C55E'
    }
    const icons: Record<string, string> = {
      identity: '🔮', entity: '👤', concept: '💡', event: '📅', fact: '📌'
    }

    const getPos = (id: string) => nodePositions.current.get(id) || graphNodes.find(n => n.id === id) || { x: 0, y: 0 }
    const allX = graphNodes.map(n => getPos(n.id).x)
    const allY = graphNodes.map(n => getPos(n.id).y)
    const minX = Math.min(...allX), maxX = Math.max(...allX)
    const minY = Math.min(...allY), maxY = Math.max(...allY)
    const rX = maxX - minX || 1, rY = maxY - minY || 1
    const pad = 60
    const sx = (id: string) => pad + ((getPos(id).x - minX) / rX) * (w - 2 * pad)
    const sy = (id: string) => pad + ((getPos(id).y - minY) / rY) * (h - 2 * pad)

    // Edges
    graphEdges.forEach(edge => {
      const x1 = sx(edge.source), y1 = sy(edge.source)
      const x2 = sx(edge.target), y2 = sy(edge.target)
      ctx.beginPath()
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2)
      ctx.strokeStyle = edge.implicit ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.25)'
      ctx.lineWidth = edge.implicit ? 0.5 : 1.5
      if (edge.implicit) ctx.setLineDash([4, 4]); else ctx.setLineDash([])
      ctx.stroke(); ctx.setLineDash([])
      if (edge.label && !edge.implicit) {
        ctx.fillStyle = 'rgba(139,92,246,0.5)'
        ctx.font = '9px system-ui'; ctx.textAlign = 'center'
        ctx.fillText(edge.label.replace(/_/g, ' '), (x1+x2)/2, (y1+y2)/2 - 6)
      }
    })

    // Nodes
    graphNodes.forEach(node => {
      const nx = sx(node.id), ny = sy(node.id)
      const color = colors[node.type] || colors.fact
      const isSelected = selectedNode === node.id
      const isHovered = hoveredNode === node.id
      const r = isSelected ? 32 : isHovered ? 30 : node.type === 'identity' ? 36 : 26
      if (isSelected || isHovered) {
        ctx.beginPath(); ctx.arc(nx, ny, r+8, 0, Math.PI*2)
        ctx.fillStyle = `${color}20`; ctx.fill()
      }
      ctx.beginPath(); ctx.arc(nx, ny, r, 0, Math.PI*2)
      ctx.fillStyle = 'rgba(15,15,25,0.95)'; ctx.fill()
      ctx.strokeStyle = color; ctx.lineWidth = isSelected ? 3 : 2; ctx.stroke()
      ctx.font = `${r > 28 ? 18 : 14}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(icons[node.type] || '📌', nx, ny - 2)
      ctx.fillStyle = '#e2e8f0'; ctx.font = `${isSelected ? 12 : 10}px system-ui`; ctx.textBaseline = 'top'
      ctx.fillText(node.label, nx, ny + r + 4, 80)
    })
  }, [view, graphNodes, graphEdges, selectedNode, hoveredNode])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left, my = e.clientY - rect.top
    const getPos = (id: string) => nodePositions.current.get(id) || graphNodes.find(n => n.id === id) || { x: 0, y: 0 }
    const allX = graphNodes.map(n => getPos(n.id).x), allY = graphNodes.map(n => getPos(n.id).y)
    const minX = Math.min(...allX), maxX = Math.max(...allX)
    const minY = Math.min(...allY), maxY = Math.max(...allY)
    const rX = maxX - minX || 1, rY = maxY - minY || 1
    const pad = 60
    let clicked: string | null = null
    for (const node of graphNodes) {
      const pos = getPos(node.id)
      const nx = pad + ((pos.x - minX) / rX) * (rect.width - 2 * pad)
      const ny = pad + ((pos.y - minY) / rY) * (rect.height - 2 * pad)
      if (Math.sqrt((mx-nx)**2 + (my-ny)**2) < 30) { clicked = node.id; break }
    }
    setSelectedNode(clicked)
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left, my = e.clientY - rect.top
    if (dragNode) {
      const pos = nodePositions.current.get(dragNode)
      if (pos) nodePositions.current.set(dragNode, { x: mx + dragOffset.x, y: my + dragOffset.y })
      return
    }
    const getPos = (id: string) => nodePositions.current.get(id) || graphNodes.find(n => n.id === id) || { x: 0, y: 0 }
    const allX = graphNodes.map(n => getPos(n.id).x), allY = graphNodes.map(n => getPos(n.id).y)
    const minX = Math.min(...allX), maxX = Math.max(...allX)
    const minY = Math.min(...allY), maxY = Math.max(...allY)
    const rX = maxX - minX || 1, rY = maxY - minY || 1
    const pad = 60
    let hovered: string | null = null
    for (const node of graphNodes) {
      const pos = getPos(node.id)
      const nx = pad + ((pos.x - minX) / rX) * (rect.width - 2 * pad)
      const ny = pad + ((pos.y - minY) / rY) * (rect.height - 2 * pad)
      if (Math.sqrt((mx-nx)**2 + (my-ny)**2) < 30) { hovered = node.id; break }
    }
    setHoveredNode(hovered)
    canvas.style.cursor = hovered ? 'pointer' : 'default'
  }

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!hoveredNode) return
    setDragNode(hoveredNode)
    const canvas = canvasRef.current; if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left, my = e.clientY - rect.top
    const pos = nodePositions.current.get(hoveredNode) || { x: 0, y: 0 }
    setDragOffset({ x: pos.x - mx, y: pos.y - my })
  }

  // Selected node connections
  const selectedConnections = selectedNode
    ? graphEdges.filter(e => e.source === selectedNode || e.target === selectedNode)
    : null

  const filteredMemories = categoryFilter
    ? memories.filter(m => m.category === categoryFilter)
    : memories

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-[var(--text-muted)]">Loading memory...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-[var(--bg)] text-[var(--text)] overflow-auto">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-2xl font-bold">Memory</h1>
        </div>

        <div className="flex gap-6">
          {/* Sidebar tabs */}
          <div className="w-48 shrink-0 space-y-1">
            <button onClick={() => setMemoryTab('memories')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${memoryTab === 'memories' ? 'bg-brand-500/10 text-brand-400 font-medium' : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'}`}>
              <span>🧠</span><span>Memories</span>
            </button>
            <button onClick={() => setMemoryTab('documents')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${memoryTab === 'documents' ? 'bg-brand-500/10 text-brand-400 font-medium' : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'}`}>
              <span>📄</span><span>Documents</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">

      {memoryTab === 'memories' && (
        <>
          {/* Add Memory Modal */}
          {showAdd && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAdd(false)}>
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-[var(--text)] mb-1">Add a memory</h3>
                <p className="text-sm text-[var(--text-muted)] mb-4">Your agent will remember this and use it in future conversations</p>

                {/* Category - simple pills */}
                <div className="mb-4">
                  <label className="block text-sm text-[var(--text-muted)] mb-2">What kind?</label>
                  <div className="flex gap-2 flex-wrap">
                    {CATEGORY_OPTIONS.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setNewCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          newCategory === cat.id
                            ? 'bg-brand-500 text-white'
                            : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] hover:border-brand-500/50'
                        }`}
                      >
                        {cat.icon} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <label className="block text-sm text-[var(--text-muted)] mb-2">What should your agent remember?</label>
                  <textarea
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    placeholder="e.g. I prefer dark mode, my company is Greyrock Studio, I'm allergic to shellfish..."
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:border-brand-500 outline-none text-sm resize-none"
                    rows={3}
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowAdd(false)}
                    className="px-4 py-2 text-sm rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-2)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={!newContent.trim() || saving}
                    className="px-4 py-2 text-sm rounded-lg bg-brand-500 hover:bg-brand-600 text-white transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Memory'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* View toggle + search + Add button */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex bg-[var(--surface)] border border-[var(--border)] rounded-lg p-0.5">
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  view === 'list' ? 'bg-brand-500 text-white' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                📋 List
              </button>
              <button
                onClick={() => setView('graph')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  view === 'graph' ? 'bg-brand-500 text-white' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                🕸️ Graph
              </button>
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search memories..."
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:border-brand-500 outline-none text-sm pl-9"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]">🔍</span>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors flex items-center gap-2 flex-shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add
            </button>
          </div>

          {/* Category filter pills */}
          <div className="flex gap-1.5 mb-4 flex-wrap">
            <button
              onClick={() => setCategoryFilter(null)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                categoryFilter === null ? 'bg-brand-500 text-white' : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:border-brand-500/50'
              }`}
            >
              All
            </button>
            {CATEGORY_OPTIONS.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(categoryFilter === cat.id ? null : cat.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                  categoryFilter === cat.id ? 'bg-brand-500 text-white' : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:border-brand-500/50'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Graph View */}
          {view === 'graph' && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
              {graphNodes.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-3xl mb-3">🕸️</p>
                  <p className="text-[var(--text-muted)]">Your knowledge graph will grow as you chat</p>
                  <p className="text-xs text-[var(--text-dim)] mt-1">Memories connect automatically as your agent learns</p>
                </div>
              ) : (
                <>
                  <canvas
                    ref={canvasRef}
                    className="w-full cursor-default"
                    style={{ height: '400px', background: 'var(--bg)' }}
                    onClick={handleCanvasClick}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseUp={() => setDragNode(null)}
                    onMouseLeave={() => setDragNode(null)}
                  />
                  {selectedNode && selectedConnections && (() => {
                    const node = graphNodes.find(n => n.id === selectedNode)
                    if (!node) return null
                    return (
                      <div className="p-3 border-t border-[var(--border)]">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{CATEGORY_ICONS[node.type] || '📌'}</span>
                          <span className="font-medium text-sm text-[var(--text)]">{node.fullContent || node.label}</span>
                        </div>
                        {selectedConnections.length > 0 && (
                          <div className="text-xs text-[var(--text-muted)] mt-1">
                            {selectedConnections.length} connection{selectedConnections.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </>
              )}
            </div>
          )}

          {/* List View */}
          {view === 'list' && (
            <div className="space-y-2">
              {filteredMemories.length === 0 ? (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8 text-center">
                  <p className="text-3xl mb-3">🧠</p>
                  <p className="text-[var(--text-muted)]">
                    {searchQuery ? 'No memories match your search' : 'No memories yet'}
                  </p>
                  <p className="text-xs text-[var(--text-dim)] mt-1">
                    {searchQuery ? 'Try different keywords' : 'Chat with your agent or click Add to get started'}
                  </p>
                </div>
              ) : (
                filteredMemories.map(mem => {
                  const colors = CATEGORY_COLORS[mem.category] || CATEGORY_COLORS.fact
                  const icon = CATEGORY_ICONS[mem.category] || CATEGORY_ICONS.fact
                  return (
                    <div
                      key={mem.id}
                      className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 flex items-start gap-3 group hover:border-brand-500/30 transition-colors"
                    >
                      <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--text)]">{mem.content}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium border capitalize ${colors}`}>
                            {mem.category}
                          </span>
                          <span className="text-[10px] text-[var(--text-dim)]">
                            {formatRelativeDate(mem.created_at)}
                          </span>
                          {mem.source_type === 'auto' && (
                            <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/15 text-blue-400 border border-blue-500/40">
                              learned in chat
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(mem.id)}
                        className="text-[var(--text-dim)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm p-1"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </>
      )}

      {memoryTab === 'documents' && (
        <div className="space-y-2">
          {documentsLoading && <p className="text-sm text-[var(--text-muted)]">Loading...</p>}
          {!documentsLoading && documents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-[var(--text-muted)] mb-2">No documents yet</p>
              <p className="text-xs text-[var(--text-dim)]">Upload files in chat to build your knowledge base</p>
            </div>
          )}
          {!documentsLoading && documents.map((doc: any) => (
            <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)]">
              <span className="text-lg">{doc.mime_type?.startsWith('image/') ? '🖼️' : '📄'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text)] truncate">{doc.name}</p>
                <p className="text-xs text-[var(--text-dim)]">{(doc.size / 1024).toFixed(1)} KB · {new Date(doc.uploaded_at).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => deleteDocument(doc.id)}
                className="p-1 text-[var(--text-dim)] hover:text-red-400 transition-colors"
                title="Delete"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

          </div>
        </div>
      </div>
    </div>
  )
}
