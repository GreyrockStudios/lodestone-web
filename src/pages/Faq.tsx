import { Link } from 'react-router-dom'
import { DocsNav } from '../components/ScreenshotMockup'

interface FaqItem {
  q: string
  a: string
}

const general: FaqItem[] = [
  {
    q: 'What is Lodestone?',
    a: 'Lodestone is an AI assistant that gets smarter every time you use it. It remembers your preferences, tracks your commitments, and builds a knowledge graph from every conversation. Unlike ChatGPT or Claude, Lodestone compounds knowledge over time — /recall any fact, /task any commitment, and it proactively surfaces things you might forget.',
  },
  {
    q: 'How is Lodestone different from ChatGPT, Claude, or other AI chatbots?',
    a: 'Three things make Lodestone different: (1) Persistent memory — it remembers what you tell it across conversations, building a knowledge graph of your preferences and context. (2) Proactive task tracking — use /task to create commitments, and it surfaces overdue items automatically. (3) Always-on — the desktop app runs in your system tray and sends you notifications for reminders and completed work.',
  },
  {
    q: 'Is Lodestone open source?',
    a: 'The desktop app is open source under the MIT License and available on GitHub. The web app and cloud services (like Ollama Cloud) are proprietary but free to use within tier limits.',
  },
  {
    q: 'Which AI models does Lodestone support?',
    a: 'It depends on your tier. Community gets Ollama Cloud and GLM Cloud free (no API key needed). Pro and Studio unlock OpenAI (GPT-4o, o3, o4-mini), Anthropic (Claude 4 Sonnet, Claude 4 Opus), Groq (Llama, Mixtral, Gemma), and more. Desktop users can also run Ollama models locally for full privacy.',
  },
  {
    q: 'What is /recall?',
    a: '/recall is a command you type in chat to search your memories. For example, "/recall preferences" searches everything your agent knows about your preferences. It works across all conversations — your knowledge compounds over time.',
  },
  {
    q: 'What is /task?',
    a: '/task creates a tracked commitment. For example, "/task follow up with the client by Friday" creates a task with a due date. Your agent tracks it, and if it becomes overdue, it surfaces in your greeting the next time you chat.',
  },
  {
    q: 'What are conversation templates?',
    a: 'Templates are pre-configured conversation starters for structured tasks: Weekly Review, Brainstorm, Decision, Email Draft, Daily Brief, and Code Help. Each sets context and goals so you get better results from the first message.',
  },
  {
    q: 'What platforms does Lodestone support?',
    a: 'The desktop app is available for macOS (Apple Silicon and Intel, macOS 13+) and Windows (10+, x64). Linux is coming soon. The web app works on all platforms — visit heylodestone.com in any modern browser. Pro and Studio tiers include full web access.',
  }
]

const features: FaqItem[] = [
  {
    q: 'How does streaming work?',
    a: 'When you send a message, the response appears token by token in real-time — no waiting for the full answer. Streaming works automatically with all providers. You can see the response building as it generates.',
  },
  {
    q: 'How do file uploads work?',
    a: 'Drag a file into the chat or click the attach button (📎). Your agent reads the file content and stores key facts in your knowledge base. Supported on Pro and Studio tiers. Files are processed server-side — your agent extracts relevant information and remembers it.',
  },
  {
    q: 'How do I share a conversation?',
    a: 'Click the share icon (🔗) in the chat header. This creates a unique link that anyone can view — no login required. You can optionally set an expiration date. Available on Pro and Studio tiers.',
  },
  {
    q: 'What is the smart greeting?',
    a: 'Every new conversation starts with a personalized greeting based on the time of day, your memories, and any overdue tasks. It might say "Good morning — you have 1 overdue task" and suggest relevant actions.',
  },
  {
    q: 'What tools does Lodestone have?',
    a: 'Lodestone has 14 built-in tools: web search, web fetch, calculator, code execution (Python & JavaScript), save/search memory, create commitments, set/list reminders, weather, create notes, file analysis, smart greeting, and conversation sharing. The AI automatically uses the right tool when needed.',
  },
  {
    q: 'How does code execution work? Is it safe?',
    a: 'When you ask the AI to run code, it executes Python or JavaScript in a sandboxed environment with strict limits: 30-second timeout, 128MB memory cap, and dangerous modules (os, subprocess, file system access) are blocked. Your code can compute, process data, and return results — but it cannot access the server or other user data.',
  },
  {
    q: 'How do reminders work?',
    a: 'Say things like "remind me to call Sarah at 3pm" or "remind me in 30 minutes to check the deployment." The AI sets a reminder in your timezone, and when it is due, you get a notification (desktop notification on the desktop app, email on web). You can also list and cancel reminders through chat.',
  },
  {
    q: 'Is my search data private?',
    a: 'Yes. Web searches go through our self-hosted SearXNG instance — no data is sent to Google, Bing, or any tracking service. Your searches are not logged, not sold, and not tied to your identity in any analytics system.',
  },
  {
    q: 'What is the command palette?',
    a: 'Press Cmd+K (Mac) or Ctrl+K (Windows) to open the command palette. It gives you quick access to: New Chat, Search, Export (MD/JSON/PDF), Recall Memory, Set Reminder, Theme, Settings, and Account — all without leaving the keyboard.',
  },
  {
    q: 'What are file access tiers?',
    a: 'The desktop app lets you control how much file system access your agent has. There are four tiers: None (no access), Minimal (read-only Desktop, Documents, Downloads), Standard (read/write home folder, blocking sensitive dirs — default), and Full (full filesystem, blocking only .ssh, .gnupg, .keychain). Configure in Settings → Desktop.',
  },
  {
    q: 'How do I export my conversations?',
    a: 'Use the command palette (Cmd+K / Ctrl+K) and select "Export." You can export as Markdown, JSON, or PDF. This works in the desktop app.',
  }
]

const privacy: FaqItem[] = [
  {
    q: 'Is my data private?',
    a: 'Yes. On the Desktop app with local Ollama, your conversations never leave your machine. On the web, your API key is stored locally in your browser and never sent to our servers. We do not train on your data, ever.',
  },
  {
    q: 'What data does Lodestone collect?',
    a: 'We collect your email, display name, and account metadata. We do NOT collect conversation content for training, memory data, or API keys. Analytics are minimal and anonymized.',
  },
  {
    q: 'Can I export my data?',
    a: 'Yes. Go to Settings → Storage → Export. You can download all your conversations, memories, and account data in JSON format at any time. On the desktop app, use Cmd+K → Export.',
  },
  {
    q: 'Can I delete my account?',
    a: 'Yes. Go to Settings → Profile → Delete Account. This permanently deletes your account, all conversations, memories, and associated data. This action cannot be undone.',
  }
]

const technical: FaqItem[] = [
  {
    q: 'What are the system requirements?',
    a: 'macOS: macOS 13 (Ventura) or later, Apple Silicon (M1+) or Intel (x86_64), 4 GB RAM minimum (8 GB recommended), ~190 MB disk. Windows: Windows 10+ (x64), 4 GB RAM minimum (8 GB recommended), ~93 MB disk. For local Ollama models: 8 GB RAM for 7B models, 16 GB for 13B+, Apple Silicon or dedicated GPU recommended.',
  },
  {
    q: 'Does Lodestone work on Windows or Linux?',
    a: 'The desktop app supports macOS and Windows. Linux is coming soon — join the waitlist for early access. The web app works on all platforms including mobile browsers.',
  },
  {
    q: 'Can I use Lodestone without an internet connection?',
    a: 'Yes, on the Desktop app with local Ollama. Local models run entirely on your machine. You need internet for initial setup, account login, and cloud-based models, but local conversations work offline.',
  },
  {
    q: 'How much disk space does Ollama need?',
    a: 'The Ollama binary is about 500 MB. Each model varies: 7B quantized ~4 GB, 13B ~7 GB, 70B ~40 GB. Lodestone shows model sizes before you download them.',
  },
  {
    q: 'Can I use my own OpenAI-compatible endpoint?',
    a: 'Yes. In Settings → Providers → Custom, you can add any OpenAI-compatible API endpoint. This works with LM Studio, vLLM, oobabooga, and other local inference servers.',
  },
  {
    q: 'How does the mobile PWA work?',
    a: 'Visit heylodestone.com on your phone and tap "Add to Home Screen." You get an app-like experience with offline caching, push notifications, and full-screen mode. No app store download needed. Note: full chat requires Pro or Studio tier on web.',
  },
  {
    q: 'How do I reset my password?',
    a: 'Click "Forgot password?" on the login page, or go to Settings → Profile → Change Password in the desktop app. You will receive a password reset email with a secure link.',
  },
  {
    q: 'How do I sign in with Google or GitHub?',
    a: 'Click the Google or GitHub button on the login page. We support OAuth sign-in with both providers. Your email and basic profile info are the only data we receive.',
  }
]

const billing: FaqItem[] = [
  {
    q: 'How does the Community tier work?',
    a: 'Community is free forever. You get Ollama Cloud access, memory, /recall, tasks, streaming, templates, and a $5 sign-up bonus for cloud model usage. No credit card required.',
  },
  {
    q: 'What are the usage costs?',
    a: 'Provider rates vary by model. Every plan includes credits — Community gets a $5 sign-up bonus, Pro includes $15/mo, and Studio includes $40/mo. Bring your own API key (BYOK) and pay nothing to Lodestone — just the provider directly.',
  },
  {
    q: 'What happens if I exceed my monthly usage?',
    a: 'You can purchase credit packs ($5, $10, $20, $50) from Settings → Account → Billing, or bring your own API key (BYOK) to bypass all billing. BYOK users pay nothing to Lodestone — just the provider directly.',
  },
  {
    q: 'Can I try Pro before paying?',
    a: 'Community tier is always free with Ollama Cloud. You can start a Pro trial to experience the full feature set. When you upgrade to Pro ($29.99/mo), you get $15/mo in usage included. Cancel anytime.',
  },
  {
    q: 'Is there a team or enterprise plan?',
    a: 'Studio ($79.99/mo) includes 5 agent identities, API access, and $40/mo usage. For custom deployment, volume licensing, or team features beyond Studio, contact hello@heylodestone.com.',
  },
  {
    q: 'How do I redeem a license key?',
    a: 'Go to Settings → Account → License Key and enter your key (format: LODE-XXXX-XXXX-XXXX). The tier upgrade applies immediately.',
  }
]

function FaqSection({ title, items }: { title: string; items: FaqItem[] }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">{title}</h2>
      <div className="space-y-4">
        {items.map(item => (
          <details key={item.q} className="group p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)] cursor-pointer">
            <summary className="font-semibold text-[var(--text)] list-none flex items-center justify-between">
              <span>{item.q}</span>
              <svg className="w-5 h-5 text-[var(--text-dim)] transition-transform group-open:rotate-180 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export default function Faq() {
  return (
    <div className="docs-content max-w-3xl">
      <h1 className="text-4xl font-extrabold mb-2 tracking-tight">FAQ</h1>
      <p className="text-[var(--text-muted)] text-lg mb-10">Common questions about Lodestone. Can't find what you're looking for? Email <a href="mailto:hello@heylodestone.com" className="text-[var(--cyan)] hover:underline">hello@heylodestone.com</a>.</p>

      <FaqSection title="General" items={general} />
      <FaqSection title="Features" items={features} />
      <FaqSection title="Privacy & Data" items={privacy} />
      <FaqSection title="Technical" items={technical} />
      <FaqSection title="Billing & Plans" items={billing} />

      <DocsNav prev={{ label: "API Reference", href: "/docs/api" }} next={{ label: "Getting Started", href: "/docs/getting-started" }} />
    </div>
  )
}
