import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import SiteLayout from '../components/SiteLayout'
import { Eyebrow, HeroBackdrop } from '../components/SiteUI'

interface MCPServer {
  id: string
  name: string
  description: string
  category: string
  icon: string
  command: string
  args: string[]
  env?: Record<string, string>
  homepage: string
  author: string
  verified: boolean
  popular: boolean
  tags: string[]
  installed?: boolean
}

const CATEGORIES = ['All', 'File Management', 'Developer Tools', 'Database', 'Search', 'Memory', 'Web Automation', 'Communication', 'Web', 'Reasoning']

export default function MCPMarketplace() {
  const [servers, setServers] = useState<MCPServer[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [installing, setInstalling] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/mcp-marketplace')
      .then(r => r.json())
      .then(data => {
        setServers(data.servers || [])
        setCategories(data.categories || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleInstall = async (server: MCPServer) => {
    // Try deep link to desktop app first
    const deepLink = `lodestone://mcp/install?${new URLSearchParams({
      id: server.id,
      name: server.name,
      command: server.command,
      args: JSON.stringify(server.args),
      ...(server.env ? { env: JSON.stringify(server.env) } : {})
    }).toString()}`

    // Attempt deep link
    const link = document.createElement('a')
    link.href = deepLink
    link.click()

    // Also record server-side
    const token = localStorage.getItem('lodestone_access_token')
    if (token) {
      setInstalling(server.id)
      try {
        await fetch(`/api/mcp-marketplace/${server.id}/install`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        })
      } catch {}
      setInstalling(null)
      // Refresh
      const data = await (await fetch('/api/mcp-marketplace')).json()
      setServers(data.servers || [])
    }
  }

  const filtered = servers.filter(s => {
    if (activeCategory !== 'All' && s.category !== activeCategory) return false
    if (search) {
      const q = search.toLowerCase()
      return s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.tags.some(t => t.includes(q))
    }
    return true
  })

  if (loading) {
    return (
      <SiteLayout>
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>
      <div className="relative overflow-hidden border-b border-[var(--border)]">
        <HeroBackdrop aurora="brand" />
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-12 relative">
          <Eyebrow className="mb-5">Model Context Protocol</Eyebrow>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--text)] mb-4 tracking-tight">
            MCP server <span className="text-gradient">marketplace</span>
          </h1>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl">
            Browse and install Model Context Protocol servers directly into your Lodestone Desktop app.
            Click <strong className="text-[var(--text)]">Install</strong> to add a server — it opens automatically in the desktop app.
          </p>
          <div className="mt-6 flex gap-3 items-center">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search servers..."
                className="w-full px-4 py-2.5 pl-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-brand-500 transition-colors"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-[var(--text-dim)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {['All', ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-brand-500 text-white'
                  : 'bg-[var(--surface-2)] text-[var(--text-dim)] hover:text-[var(--text)] border border-[var(--border)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Server Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filtered.map(server => (
            <div
              key={server.id}
              className="site-card site-card-hover p-5 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{server.icon}</span>
                  <div>
                    <h3 className="font-semibold text-[var(--text)] flex items-center gap-2">
                      {server.name}
                      {server.verified && (
                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      )}
                    </h3>
                    <p className="text-xs text-[var(--text-dim)]">by {server.author}</p>
                  </div>
                </div>
                {server.popular && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-500/20 text-amber-400">Popular</span>
                )}
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">{server.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {server.tags.slice(0, 4).map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded text-xs bg-[var(--surface-2)] text-[var(--text-dim)]">{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-dim)]">{server.category}</span>
                <button
                  onClick={() => handleInstall(server)}
                  disabled={installing === server.id}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 transition-colors"
                >
                  {installing === server.id ? 'Installing...' : 'Install'}
                </button>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[var(--text-dim)]">
            <p>No servers match your search. Try different keywords.</p>
          </div>
        )}
      </div>
    </SiteLayout>
  )
}