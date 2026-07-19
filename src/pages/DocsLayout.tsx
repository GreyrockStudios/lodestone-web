import { Link, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { ArrowUpRight, BookOpen, PanelLeft } from 'lucide-react'
import SiteLayout from '../components/SiteLayout'
import { SITE } from '../content/site'

const sidebarLinks = [
  { path: '/docs/getting-started', label: 'Getting Started' },
  { path: '/docs/features', label: 'Features' },
  { path: '/docs/desktop-app', label: 'Desktop App' },
  { path: '/docs/usage-guide', label: 'Usage Guide' },
  { path: '/docs/api', label: 'API Reference' },
  { path: '/docs/faq', label: 'FAQ' },
]

export default function DocsLayout() {
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <SiteLayout>
      <div className="max-w-7xl mx-auto flex">
        {mobileNavOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
        )}

        <aside
          className={`
          fixed md:sticky z-50 md:z-auto
          w-64 flex-shrink-0
          border-r border-[var(--border)] p-6
          bg-[var(--surface)] md:bg-transparent
          h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] overflow-y-auto
          transform transition-transform duration-200 ease-in-out
          top-16 md:top-16
          ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        >
          <div className="flex items-center justify-between mb-4 md:hidden">
            <span className="text-sm font-medium text-[var(--text-muted)]">Docs</span>
            <button
              type="button"
              className="text-[var(--text-dim)]"
              onClick={() => setMobileNavOpen(false)}
            >
              Close
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 mb-5 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            <BookOpen className="w-3.5 h-3.5" />
            Documentation
          </div>

          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const isActive =
                location.pathname === link.path ||
                (link.path === '/docs/getting-started' && location.pathname === '/docs')
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileNavOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm no-underline transition-colors ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-200 font-medium border border-brand-500/25'
                      : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] border border-transparent'
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
              <Link
                to="/early-access"
                className="block text-sm text-brand-300 hover:text-brand-200 no-underline"
              >
                Early Access
              </Link>
              <Link
                to="/pricing"
                className="block text-sm text-[var(--text-muted)] hover:text-[var(--text)] no-underline"
              >
                Pricing
              </Link>
              <Link
                to="/downloads"
                className="block text-sm text-[var(--text-muted)] hover:text-[var(--text)] no-underline"
              >
                Download
              </Link>
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text)] no-underline"
              >
                GitHub <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="md:hidden px-4 pt-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] border border-[var(--border)] rounded-lg px-3 py-2"
              onClick={() => setMobileNavOpen(true)}
            >
              <PanelLeft className="w-4 h-4" />
              Docs menu
            </button>
          </div>
          <main className="px-4 md:px-10 py-8 md:py-12">
            <Outlet />
          </main>
        </div>
      </div>
    </SiteLayout>
  )
}
