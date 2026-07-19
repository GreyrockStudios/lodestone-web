import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Github, Menu, X } from 'lucide-react'
import { SITE } from '../content/site'

const navLinks = [
  { to: '/early-access', label: 'Early Access' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/compare', label: 'Compare' },
  { to: '/docs', label: 'Docs' },
  { to: '/downloads', label: 'Downloads' },
]

function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 no-underline group ${className}`}>
      <span className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500/25 to-cyan-500/20 border border-brand-500/30">
        <svg width="18" height="18" viewBox="0 0 512 512" aria-hidden="true">
          <circle cx="256" cy="256" r="120" fill="none" stroke="#8B5CF6" strokeWidth="34" opacity="0.6" />
          <circle cx="256" cy="256" r="42" fill="#c4b5fd" />
        </svg>
      </span>
      <span className="font-display font-bold text-[var(--text)] text-lg tracking-tight group-hover:text-brand-200 transition-colors">
        {SITE.name}
      </span>
    </Link>
  )
}

export default function SiteLayout({
  children,
  bare = false,
}: {
  children: ReactNode
  bare?: boolean
}) {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu whenever navigation happens.
  useEffect(() => setOpen(false), [location.pathname])

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
      {!bare && (
        <header
          className={`sticky top-0 z-50 transition-colors duration-300 ${
            scrolled
              ? 'border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl'
              : 'border-b border-transparent bg-transparent'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
            <Logo />

            <nav className="hidden md:flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)]/50 px-1.5 py-1 backdrop-blur">
              {navLinks.map((link) => {
                const active =
                  location.pathname === link.to ||
                  (link.to !== '/' && location.pathname.startsWith(link.to))
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3.5 py-1.5 rounded-full text-sm no-underline transition-colors ${
                      active
                        ? 'text-[var(--text)] bg-[var(--surface-2)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] no-underline"
              >
                Sign in
              </Link>
              <Link
                to="/early-access"
                className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium no-underline transition-colors shadow-lg shadow-brand-500/25"
              >
                Join early access
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <button
              type="button"
              className="md:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text)]"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {open && (
            <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 py-4 space-y-1 animate-fade-in">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] no-underline"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 flex flex-col gap-2 border-t border-[var(--border)] mt-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 text-sm text-[var(--text-muted)] no-underline"
                >
                  Sign in
                </Link>
                <Link
                  to="/early-access"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-medium text-center no-underline"
                >
                  Join early access
                </Link>
              </div>
            </div>
          )}
        </header>
      )}

      <main className="flex-1">{children}</main>

      {!bare && (
        <footer className="relative mt-auto border-t border-[var(--border)] bg-[var(--surface)]/30">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-14">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
              <div className="col-span-2">
                <Logo className="mb-4" />
                <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs mb-4">
                  {SITE.tagline}. A desktop agent that acts on your machine and works on its own
                  schedule.
                </p>
                <a
                  href={SITE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] no-underline"
                >
                  <Github className="w-4 h-4" />
                  Star on GitHub
                </a>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-3">
                  Product
                </h4>
                <ul className="space-y-2.5 text-sm">
                  {[
                    { to: '/early-access', label: 'Early Access' },
                    { to: '/pricing', label: 'Pricing' },
                    { to: '/compare', label: 'Compare' },
                    { to: '/downloads', label: 'Downloads' },
                    { to: '/marketplace', label: 'Marketplace' },
                  ].map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="text-[var(--text-muted)] hover:text-[var(--text)] no-underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-3">
                  Resources
                </h4>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link to="/docs" className="text-[var(--text-muted)] hover:text-[var(--text)] no-underline">
                      Docs
                    </Link>
                  </li>
                  <li>
                    <Link to="/changelog" className="text-[var(--text-muted)] hover:text-[var(--text)] no-underline">
                      Changelog
                    </Link>
                  </li>
                  <li>
                    <Link to="/docs/api" className="text-[var(--text-muted)] hover:text-[var(--text)] no-underline">
                      API Reference
                    </Link>
                  </li>
                  <li>
                    <a
                      href={SITE.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-muted)] hover:text-[var(--text)] no-underline"
                    >
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-3">
                  Legal
                </h4>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link to="/terms" className="text-[var(--text-muted)] hover:text-[var(--text)] no-underline">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="text-[var(--text-muted)] hover:text-[var(--text)] no-underline">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link to="/eula" className="text-[var(--text-muted)] hover:text-[var(--text)] no-underline">
                      EULA
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between gap-3 text-xs text-[var(--text-dim)]">
              <p>
                &copy; {new Date().getFullYear()}{' '}
                <a href={SITE.orgUrl} className="text-[var(--text-muted)] hover:text-[var(--text)] no-underline">
                  Greyrock Studio
                </a>
                . All rights reserved.
              </p>
              <p className="inline-flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 status-dot" />
                {SITE.phaseLabel} · {SITE.email}
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
