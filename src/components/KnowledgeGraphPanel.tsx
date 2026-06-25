import { useState, useEffect, useCallback, useRef } from 'react'

interface KGNode {
  id: string
  label: string
  category: 'fact' | 'preference' | 'instruction' | 'note'
  content: string
  importance: number
}

interface KGEdge {
  source: string
  target: string
  relation: string
}

const CATEGORY_COLORS: Record<string, { fill: string; stroke: string; glow: string; bg: string; text: string }> = {
  fact: { fill: '#3B82F6', stroke: '#60A5FA', glow: 'rgba(59,130,246,0.3)', bg: 'bg-blue-500/20', text: 'text-blue-400' },
  preference: { fill: '#10B981', stroke: '#34D399', glow: 'rgba(16,185,129,0.3)', bg: 'bg-green-500/20', text: 'text-green-400' },
  instruction: { fill: '#F59E0B', stroke: '#FBBF24', glow: 'rgba(245,158,11,0.3)', bg: 'bg-amber-500/20', text: 'text-amber-400' },
  note: { fill: '#8B5CF6', stroke: '#A78BFA', glow: 'rgba(139,92,246,0.3)', bg: 'bg-purple-500/20', text: 'text-purple-400' },
}

export default function KnowledgeGraphPanel() {
  const [nodes, setNodes] = useState<KGNode[]>([])
  const [edges, setEdges] = useState<KGEdge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNode, setSelectedNode] = useState<KGNode | null>(null)
  const [showAddEdge, setShowAddEdge] = useState(false)
  const [edgeSource, setEdgeSource] = useState('')
  const [edgeTarget, setEdgeTarget] = useState('')
  const [edgeRelation, setEdgeRelation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [dragNode, setDragNode] = useState<string | null>(null)
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({})

  const getToken = useCallback(() => localStorage.getItem('lodestone_access_token') || '', [])

  const loadData = useCallback(async () => {
    const token = getToken()
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch('/api/knowledge-graph', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setNodes(data.nodes || [])
        setEdges(data.edges || [])
        setError(null)
      } else {
        setError('Failed to load knowledge graph')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => { loadData() }, [loadData])

  // Position nodes in a circle layout
  useEffect(() => {
    if (nodes.length === 0) return
    const positions: Record<string, { x: number; y: number }> = {}
    const centerX = 300
    const centerY = 300
    const radius = Math.min(250, nodes.length * 15 + 80)

    nodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      }
    })
    setNodePositions(positions)
  }, [nodes])

  const addEdge = useCallback(async () => {
    if (!edgeSource || !edgeTarget || !edgeRelation.trim()) return
    const token = getToken()
    setSubmitting(true)
    try {
      const res = await fetch('/api/knowledge-graph/edges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ source: edgeSource, target: edgeTarget, relation: edgeRelation })
      })
      if (res.ok) {
        setShowAddEdge(false)
        setEdgeSource('')
        setEdgeTarget('')
        setEdgeRelation('')
        loadData()
      }
    } catch {}
    setSubmitting(false)
  }, [edgeSource, edgeTarget, edgeRelation, getToken, loadData])

  const filteredNodes = searchQuery.trim()
    ? nodes.filter(n =>
        n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : nodes

  const filteredEdges = edges.filter(e => {
    const sourceExists = filteredNodes.find(n => n.id === e.source)
    const targetExists = filteredNodes.find(n => n.id === e.target)
    return sourceExists && targetExists
  })

  // Drag handlers for node repositioning
  const handleMouseDown = useCallback((nodeId: string) => {
    setDragNode(nodeId)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragNode || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setNodePositions(prev => ({
      ...prev,
      [dragNode]: { x: Math.max(20, Math.min(580, x)), y: Math.max(20, Math.min(580, y)) }
    }))
  }, [dragNode])

  const handleMouseUp = useCallback(() => {
    setDragNode(null)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-2">{error}</p>
        <button onClick={loadData} className="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-sm hover:bg-brand-600 transition-colors">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text)]">Knowledge Graph</h2>
        <button
          onClick={() => setShowAddEdge(true)}
          className="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
        >
          + Add Edge
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Filter nodes by label, content, or category..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500 transition-colors"
        />
      </div>

      {/* Add Edge Form */}
      {showAddEdge && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 animate-fade-in">
          <h3 className="text-sm font-medium text-[var(--text)] mb-3">Add Edge</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Source Node</label>
              <select
                value={edgeSource}
                onChange={e => setEdgeSource(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500 transition-colors"
              >
                <option value="">Select source...</option>
                {nodes.map(n => (
                  <option key={n.id} value={n.id}>{n.label} ({n.category})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Target Node</label>
              <select
                value={edgeTarget}
                onChange={e => setEdgeTarget(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500 transition-colors"
              >
                <option value="">Select target...</option>
                {nodes.map(n => (
                  <option key={n.id} value={n.id}>{n.label} ({n.category})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Relation</label>
              <input
                type="text"
                value={edgeRelation}
                onChange={e => setEdgeRelation(e.target.value)}
                placeholder="e.g., related_to, depends_on, contradicts"
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500 transition-colors"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAddEdge(false)} className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] text-sm hover:bg-[var(--surface-2)] transition-colors">Cancel</button>
              <button onClick={addEdge} disabled={submitting || !edgeSource || !edgeTarget || !edgeRelation.trim()} className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium disabled:opacity-50 transition-colors">
                {submitting ? 'Adding...' : 'Add Edge'}
              </button>
            </div>
          </div>
        </div>
      )}

      {nodes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-3xl mb-3">🕸️</div>
          <p className="text-[var(--text-muted)]">No knowledge nodes yet</p>
          <p className="text-sm text-[var(--text-dim)] mt-1">Knowledge graph nodes appear as memories are created</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Graph SVG */}
          <div className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
            <svg
              ref={svgRef}
              viewBox="0 0 600 600"
              className="w-full h-[400px] lg:h-[500px]"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Edges */}
              {filteredEdges.map((edge, i) => {
                const sourcePos = nodePositions[edge.source]
                const targetPos = nodePositions[edge.target]
                if (!sourcePos || !targetPos) return null

                return (
                  <g key={`edge-${i}`}>
                    <line
                      x1={sourcePos.x}
                      y1={sourcePos.y}
                      x2={targetPos.x}
                      y2={targetPos.y}
                      stroke="var(--border)"
                      strokeWidth={1.5}
                      opacity={0.5}
                    />
                    {/* Edge label */}
                    <text
                      x={(sourcePos.x + targetPos.x) / 2}
                      y={(sourcePos.y + targetPos.y) / 2}
                      textAnchor="middle"
                      fill="var(--text-dim)"
                      fontSize="10"
                      className="pointer-events-none select-none"
                    >
                      {edge.relation}
                    </text>
                  </g>
                )
              })}

              {/* Nodes */}
              {filteredNodes.map(node => {
                const pos = nodePositions[node.id]
                if (!pos) return null
                const colors = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.note
                const isHovered = hoveredNode === node.id
                const isSelected = selectedNode?.id === node.id

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onMouseDown={() => handleMouseDown(node.id)}
                    onClick={() => setSelectedNode(node)}
                  >
                    {/* Glow effect on hover */}
                    {(isHovered || isSelected) && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={28}
                        fill={colors.glow}
                        className="transition-all duration-200"
                      />
                    )}
                    {/* Node circle */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={20}
                      fill={colors.fill}
                      stroke={colors.stroke}
                      strokeWidth={isSelected ? 3 : 1.5}
                      opacity={0.9}
                      className="transition-all duration-200"
                    />
                    {/* Label */}
                    <text
                      x={pos.x}
                      y={pos.y + 32}
                      textAnchor="middle"
                      fill="var(--text-muted)"
                      fontSize="11"
                      className="pointer-events-none select-none"
                    >
                      {node.label.length > 18 ? node.label.slice(0, 18) + '…' : node.label}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Sidebar - selected node details */}
          {selectedNode && (
            <div className="w-full lg:w-72 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[var(--text)]">Node Details</h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-[var(--text-dim)]">Label</span>
                  <p className="text-sm font-medium text-[var(--text)]">{selectedNode.label}</p>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-dim)]">Category</span>
                  <div className="mt-0.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${CATEGORY_COLORS[selectedNode.category]?.bg || 'bg-gray-500/20'} ${CATEGORY_COLORS[selectedNode.category]?.text || 'text-gray-400'}`}>
                      {selectedNode.category}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-dim)]">Importance</span>
                  <p className="text-sm text-[var(--text)]">{selectedNode.importance.toFixed(1)}</p>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-dim)]">Content</span>
                  <p className="text-sm text-[var(--text-muted)] mt-0.5 whitespace-pre-wrap">{selectedNode.content}</p>
                </div>
                {/* Connected nodes */}
                <div>
                  <span className="text-xs text-[var(--text-dim)]">Connections</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {edges
                      .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                      .map((e, i) => {
                        const connectedId = e.source === selectedNode.id ? e.target : e.source
                        const connectedNode = nodes.find(n => n.id === connectedId)
                        return connectedNode ? (
                          <button
                            key={i}
                            onClick={() => setSelectedNode(connectedNode)}
                            className="px-2 py-0.5 rounded-full text-xs bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)] transition-colors"
                          >
                            {connectedNode.label}
                          </button>
                        ) : null
                      })}
                    {edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length === 0 && (
                      <span className="text-xs text-[var(--text-dim)]">No connections</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-1">
        {Object.entries(CATEGORY_COLORS).map(([cat, colors]) => (
          <div key={cat} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: colors.fill }} />
            <span className="capitalize">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
