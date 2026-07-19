import { Link } from 'react-router-dom'
import { DocsNav } from '../components/ScreenshotMockup'
import { CREDITS, SITE } from '../content/site'

const faqs = [
  {
    q: 'What is Lodestone?',
    a: 'A desktop AI agent that does real work on your computer — running your files, apps, and self-scheduled tasks on your Mac or Windows machine, even while you\'re away. It can use local Ollama models and remembers preferences, tasks, and context across every run.',
  },
  {
    q: 'Is Lodestone publicly launched?',
    a: 'Not yet. We are in early access / presale. Founding packages unlock alpha access. A free Community tier arrives at general availability.',
  },
  {
    q: 'What are the launch prices?',
    a: 'Community $0 forever (BYOK required), Pro $30/mo, Studio $60/mo. See Pricing for details and Early Access for founding packages.',
  },
  {
    q: 'What is BYOK?',
    a: 'Bring your own API key. On Community at launch, BYOK is required. On Pro and Studio it is optional — you can use included monthly credits, buy packs, or enable auto top-up instead.',
  },
  {
    q: 'How do credits work on paid tiers?',
    a: `Pro includes ${CREDITS.proIncludedMonthly}/mo and Studio includes ${CREDITS.studioIncludedMonthly}/mo. When you exceed that, purchase credit packs or turn on auto top-up. BYOK routes spend to your provider.`,
  },
  {
    q: 'What can it do without me asking?',
    a: 'Lodestone schedules its own recurring jobs — morning briefs, weekly reviews, folder watchers, follow-ups — and runs them on your machine with no prompt and no open window. You come back to finished work, and every run is logged.',
  },
  {
    q: 'Is it safe to let it run on my computer?',
    a: 'Yes — you stay in control. Filesystem access has permission tiers from none to full, sensitive paths (keys, system folders, secrets) are blocked by default, and every action the agent takes is logged so you can see exactly what it did.',
  },
  {
    q: 'Can I use Lodestone from my browser or another device?',
    a: 'The product is the desktop app — that is where Lodestone runs. The web app is a companion for remote access, letting you reach your Lodestone from away. Remote web access is not part of early access; it arrives after early access (Pro and Studio at GA).',
  },
  {
    q: 'Which platforms are supported?',
    a: 'macOS 13+ and Windows 10+. Linux is on the roadmap.',
  },
  {
    q: 'Is my data private?',
    a: 'With local Ollama, conversations stay on your machine. We do not train on your data. Cloud models only run when you choose them.',
  },
  {
    q: 'Where is the desktop source code?',
    a: `Open source at ${SITE.github}`,
  },
]

export default function Faq() {
  return (
    <article className="max-w-3xl">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">FAQ</h1>
      <p className="text-[var(--text-muted)] mb-10">
        Short answers. For founding packages see{' '}
        <Link to="/early-access" className="text-brand-300 no-underline">
          Early Access
        </Link>
        ; for launch plans see{' '}
        <Link to="/pricing" className="text-brand-300 no-underline">
          Pricing
        </Link>
        .
      </p>

      <dl className="grid gap-3 mb-12">
        {faqs.map((item) => (
          <div key={item.q} className="site-card p-5">
            <dt className="font-semibold mb-1.5">{item.q}</dt>
            <dd className="text-sm text-[var(--text-muted)] leading-relaxed">{item.a}</dd>
          </div>
        ))}
      </dl>

      <DocsNav
        prev={{ label: 'API Reference', href: '/docs/api' }}
        next={{ label: 'Getting Started', href: '/docs/getting-started' }}
      />
    </article>
  )
}
