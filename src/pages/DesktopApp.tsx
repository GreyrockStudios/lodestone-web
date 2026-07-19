import { Link } from 'react-router-dom'
import { DocsNav } from '../components/ScreenshotMockup'
import { SITE, TRUST_POINTS } from '../content/site'

export default function DesktopApp() {
  return (
    <article className="max-w-3xl">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Desktop app</h1>
      <p className="text-[var(--text-muted)] text-lg mb-10 leading-relaxed">
        The desktop app is Lodestone — this is where the agent lives, acts on your machine, and
        runs its scheduled work. It ships as an Electron app for macOS and Windows. The web app is a
        separate companion for reaching your Lodestone from away (see below).
      </p>

      <section className="mb-10">
        <h2 className="font-display text-xl font-semibold mb-3">Install</h2>
        <ul className="space-y-2 text-sm text-[var(--text-muted)] mb-4">
          <li>· macOS 13+ (Apple Silicon and Intel) — universal DMG</li>
          <li>· Windows 10+ (x64) — installer EXE</li>
          <li>· Linux — coming later</li>
        </ul>
        <Link to="/downloads" className="text-sm text-brand-300 no-underline">
          Go to downloads →
        </Link>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl font-semibold mb-3">What Lodestone does on your machine</h2>
        <ul className="space-y-2 text-sm text-[var(--text-muted)]">
          <li>· Always-on agent with scheduled, self-running tasks</li>
          <li>· System tray, native menus, notifications, and dock/taskbar badges</li>
          <li>· Local Ollama and filesystem tools with permission tiers</li>
          <li>· Deep links (`lodestone://`) for MCP install and protocol handling</li>
          <li>· Auto-update via electron-updater</li>
          <li>· `window.LodestoneNative` bridge for the shared UI</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl font-semibold mb-3">Control &amp; safety</h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
          An agent that acts on its own needs guardrails you can see. You stay in control of exactly
          what Lodestone can touch.
        </p>
        <ul className="space-y-2 text-sm text-[var(--text-muted)]">
          {TRUST_POINTS.map((t) => (
            <li key={t.title}>
              · <span className="text-[var(--text)] font-medium">{t.title}</span> — {t.desc}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10 site-card p-5">
        <h2 className="font-semibold mb-2">Web app (companion)</h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          The web app is supplementary — its purpose is remote access, letting you reach your
          Lodestone (running on your desktop) while you&apos;re away from it. Remote web access is not
          available during early access; it arrives after early access. Today, the full product is the
          desktop app.
        </p>
      </section>

      <section className="mb-10 site-card p-5">
        <h2 className="font-semibold mb-2">Source</h2>
        <p className="text-sm text-[var(--text-muted)] mb-3">
          Desktop repo:{' '}
          <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="text-brand-300">
            GreyrockStudios/lodestone-desktop
          </a>
        </p>
      </section>

      <DocsNav
        prev={{ href: '/docs/features', label: 'Features' }}
        next={{ href: '/docs/usage-guide', label: 'Usage Guide' }}
      />
    </article>
  )
}
