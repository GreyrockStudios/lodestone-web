import { Link, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'

const sidebarLinks = [
  { path: '/docs/getting-started', label: 'Getting Started' },
  { path: '/docs/features', label: 'Features' },
  { path: '/docs/desktop-app', label: 'Desktop App' },
  { path: '/docs/api', label: 'API Reference' },
  { path: '/docs/faq', label: 'FAQ' },
]

export default function DocsLayout() {
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <nav className="px-4 md:px-8 py-4 flex items-center gap-2.5 border-b border-[var(--border)] sticky top-0 bg-[var(--bg)] z-50">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <svg width="28" height="28" viewBox="0 0 512 512">
            <circle cx="256" cy="256" r="22" fill="#8B5CF6" opacity="0.85"/>
            <circle cx="256" cy="256" r="10" fill="#fff" opacity="0.95"/>
          </svg>
          <span className="font-extrabold text-[var(--text)] text-lg tracking-tight">Lodestone</span>
        </Link>
        <span className="text-[var(--text-dim)] mx-2">/</span>
        <span className="text-[var(--text-muted)] font-medium">Docs</span>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden ml-auto p-2 text-[var(--text-muted)] hover:text-[var(--text)]"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Toggle docs navigation"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileNavOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </>
            )}
          </svg>
        </button>
      </nav>

      <div className="max-w-7xl mx-auto flex">
        {/* Mobile docs nav overlay */}
        {mobileNavOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileNavOpen(false)} />
        )}
        <aside className={`
          fixed md:relative z-50 md:z-auto
          w-64 md:w-64 flex-shrink-0
          border-r border-[var(--border)] p-6
          bg-[var(--surface)] md:bg-transparent
          h-[calc(100vh-57px)] overflow-y-auto
          transform transition-transform duration-200 ease-in-out
          top-[57px] md:top-auto
          ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <nav className="space-y-1">
            {sidebarLinks.map(link => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileNavOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm no-underline transition-colors ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-400 font-medium'
                      : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-dim)] mb-3">Quick links</p>
            <div className="space-y-2">
              <Link to="/pricing" className="block text-sm text-[var(--text-muted)] hover:text-[var(--text)] no-underline">Pricing</Link>
              <Link to="/downloads" className="block text-sm text-[var(--text-muted)] hover:text-[var(--text)] no-underline">Download</Link>
              <a href="https://github.com/GreyrockStudios/lodestone-desktop" target="_blank" rel="noopener noreferrer" className="block text-sm text-[var(--text-muted)] hover:text-[var(--text)] no-underline">GitHub</a>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 px-4 md:px-8 py-6 md:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}