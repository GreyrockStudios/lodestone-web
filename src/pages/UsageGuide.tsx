import { DocsNav } from '../components/ScreenshotMockup'
import { CREDITS } from '../content/site'

export default function UsageGuide() {
  return (
    <article className="max-w-3xl">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Usage guide</h1>
      <p className="text-[var(--text-muted)] text-lg mb-10 leading-relaxed">
        Day-to-day workflows once you have the desktop app running.
      </p>

      <section className="mb-10">
        <h2 className="font-display text-xl font-semibold mb-3">Chat with memory</h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">
          Talk normally. Preferences, people, and decisions are stored automatically. Use{' '}
          <code className="text-brand-300">/recall</code> to search what Lodestone knows. Use{' '}
          <code className="text-brand-300">/task</code> to create tracked commitments with due dates.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl font-semibold mb-3">Models</h2>
        <ul className="space-y-2 text-sm text-[var(--text-muted)]">
          <li>· Local Ollama for private, offline-capable chats</li>
          <li>· Cloud providers when you want stronger models</li>
          <li>· Model Compare for side-by-side answers</li>
          <li>· BYOK optional on paid tiers; required on Community at launch</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl font-semibold mb-3">Credits &amp; billing (at launch)</h2>
        <ul className="space-y-2 text-sm text-[var(--text-muted)]">
          <li>· Pro includes {CREDITS.proIncludedMonthly}/mo usage</li>
          <li>· Studio includes {CREDITS.studioIncludedMonthly}/mo usage</li>
          <li>· Buy credit packs manually when you need more</li>
          <li>· Or enable auto top-up so usage never stops mid-session</li>
          <li>· BYOK routes spend to your provider account instead</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl font-semibold mb-3">Desktop tools</h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          The agent can use native desktop capabilities (files, clipboard, screenshots, commands)
          according to the permission tier you set in Settings. High-risk actions prompt for
          confirmation.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl font-semibold mb-3">Scheduled work</h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          Create recurring tasks for daily briefs, weekly reviews, or custom automations. The
          desktop app stays available in the tray so work can run when you need it.
        </p>
      </section>

      <DocsNav
        prev={{ href: '/docs/desktop-app', label: 'Desktop App' }}
        next={{ href: '/docs/api', label: 'API Reference' }}
      />
    </article>
  )
}
