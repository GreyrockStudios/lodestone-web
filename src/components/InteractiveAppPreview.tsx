import { useState } from 'react'
import {
  Bell,
  Brain,
  CalendarClock,
  Check,
  ChevronDown,
  Clock,
  FileText,
  Fingerprint,
  MessageSquare,
  Network,
  Paperclip,
  Pencil,
  Plus,
  Search,
  Send,
  Sparkles,
  List as ListIcon,
} from 'lucide-react'
import KnowledgeGraphLazy from './KnowledgeGraphLazy'
import { GraphLegend } from './GraphLegend'
import { AUTONOMY_EXAMPLES } from '../content/site'

type View = 'chat' | 'memory' | 'identity' | 'tasks'

type Msg =
  | { type: 'assistant'; text: string; time?: string }
  | { type: 'user'; text: string; time?: string }
  | { type: 'tool'; call: string; result: string }
  | { type: 'list'; intro: string; items: { title: string; desc: string }[]; time?: string }
  | { type: 'recall'; text: string }
  | { type: 'attachment'; name: string; size: string }
  | { type: 'confirm'; to: string; preview: string }
  | { type: 'typing' }

interface Conversation {
  id: string
  letter: string
  title: string
  model: string
  messages: Msg[]
}

const conversations: Conversation[] = [
  {
    id: 'inbox',
    letter: 'P',
    title: 'Reply to Priya (Q3)',
    model: 'Claude Sonnet 4',
    messages: [
      { type: 'tool', call: 'inbox_watcher → new message', result: '✓ Priya emailed 4 min ago about the Q3 timeline' },
      {
        type: 'assistant',
        text: 'Heads up — Priya just emailed asking about the Q3 timeline slipping. Want me to pull the latest dates and draft a reply?',
        time: '9:02 AM',
      },
      { type: 'recall', text: 'Recalled: "Priya — vendor contact at Northwind" · "Always use Canadian English"' },
      { type: 'user', text: 'Yes, go ahead.', time: '9:03 AM' },
      { type: 'tool', call: 'read_file("~/Documents/Q3-timeline.xlsx")', result: '✓ Pulled latest dates — 3 milestones moved' },
      { type: 'tool', call: 'export_pdf("Q3-timeline-updated.pdf")', result: '✓ Generated a 1-page summary (84 KB)' },
      {
        type: 'assistant',
        text: 'Done — I exported a one-page PDF and drafted a warm-but-firm reply. Review before I send?',
        time: '9:03 AM',
      },
      { type: 'attachment', name: 'Q3-timeline-updated.pdf', size: '84 KB' },
      {
        type: 'confirm',
        to: 'priya@northwind.co',
        preview:
          'Hi Priya — thanks for the nudge. Attached is the updated Q3 timeline; the three shifted milestones now land the week of the 14th. Happy to hop on a quick call if that helps…',
      },
    ],
  },
  {
    id: 'code',
    letter: 'C',
    title: 'Code review — PR #42',
    model: 'GPT-4o',
    messages: [
      { type: 'user', text: 'Review PR #42 (auth refactor) and run the tests.', time: '2:20 PM' },
      { type: 'tool', call: 'read_files(["src/auth/session.ts", "src/auth/token.ts"])', result: '✓ Analyzed 3 files · 2 suggestions' },
      { type: 'tool', call: 'run_command("npm test")', result: '✓ 48 passed, 1 failed — token refresh timeout' },
      {
        type: 'assistant',
        text: 'Logic is solid, but one test failed: token refresh should debounce, and the 15-min expiry is hard-coded — pull it into config. Want me to open a fix?',
        time: '2:21 PM',
      },
      { type: 'user', text: 'Yes, open a fix.', time: '2:22 PM' },
      { type: 'tool', call: 'edit_file("src/auth/token.ts")', result: '✓ Debounced refresh · expiry → config' },
      { type: 'tool', call: 'run_command("npm test")', result: '✓ 49 passed, 0 failed' },
      { type: 'tool', call: 'git.create_pr("fix/token-refresh")', result: '✓ Opened PR #43' },
      {
        type: 'assistant',
        text: "Fixed it, pushed to fix/token-refresh, and all 49 tests pass now. Opened PR #43 for your review — I left the original PR #42 untouched.",
        time: '2:23 PM',
      },
    ],
  },
  {
    id: 'files',
    letter: 'D',
    title: 'Organize Downloads',
    model: 'Ollama · Llama 3',
    messages: [
      { type: 'user', text: 'My Downloads folder is a mess — sort the invoices and receipts.', time: '4:10 PM' },
      { type: 'tool', call: 'list_files("~/Downloads")', result: '✓ Scanned 128 files locally' },
      { type: 'tool', call: 'move_files(match="invoice|receipt")', result: '✓ Moved 12 files into /Downloads/Finance' },
      {
        type: 'assistant',
        text: 'Sorted 12 invoices and receipts into a new Finance folder. Nothing left your machine — this ran on the local model.',
        time: '4:10 PM',
      },
      {
        type: 'assistant',
        text: 'One more thing — 4 of those receipts are from 2023 tax years. Want me to tuck them into Finance/Archive/2023 so this year stays clean?',
        time: '4:10 PM',
      },
      { type: 'user', text: 'Yeah, archive the old ones.', time: '4:12 PM' },
      { type: 'tool', call: 'move_files(match="2023", to="Finance/Archive/2023")', result: '✓ Archived 4 files' },
      {
        type: 'assistant',
        text: 'Done — 4 older receipts moved to Finance/Archive/2023. Your Finance folder now only shows this year at a glance.',
        time: '4:12 PM',
      },
    ],
  },
  {
    id: 'research',
    letter: 'R',
    title: 'Competitor research',
    model: 'GPT-4o',
    messages: [
      { type: 'user', text: 'Compare the top 3 desktop AI agents and save me a summary.', time: '11:30 AM' },
      { type: 'tool', call: 'web_search("desktop AI agents 2026")', result: '✓ Read 9 sources' },
      { type: 'tool', call: 'write_file("Notes/agents.md")', result: '✓ Saved a 1-page summary to your Notes folder' },
      { type: 'recall', text: 'Recalled: "Prefers short, punchy summaries"' },
      {
        type: 'assistant',
        text: "Done — three contenders with pricing and what each can't do, in Notes/agents.md. Kept it to short bullet takeaways like you like.",
        time: '11:31 AM',
      },
    ],
  },
  {
    id: 'brief',
    letter: 'M',
    title: 'Morning brief',
    model: 'GPT-4o',
    messages: [
      { type: 'assistant', text: "Good morning, Alex. Here's your 8:00 brief — I ran it while you were away.", time: '8:00 AM' },
      {
        type: 'list',
        intro: 'Overnight, across your project folders:',
        items: [
          { title: '2 PRs merged', desc: 'auth refactor + billing hotfix' },
          { title: 'Invoice from Northwind', desc: 'filed to /Finance automatically' },
          { title: '1 thing needs you', desc: 'Design sync at 2pm today — conflict' },
        ],
        time: '8:00 AM',
      },
      { type: 'user', text: 'Move the 2pm to tomorrow.', time: '8:12 AM' },
      { type: 'tool', call: 'google_calendar.update("Design sync")', result: '✓ Moved to Tue 2:00 PM' },
      { type: 'tool', call: 'create_task("Reminder: Design sync 2pm")', result: '✓ Added to Tasks · pings 15 min before' },
      {
        type: 'assistant',
        text: 'Done — moved it to tomorrow 2pm in Google Calendar and set a reminder in Tasks. Want me to let the attendees know?',
        time: '8:12 AM',
      },
      { type: 'user', text: 'Yes, let them know.', time: '8:13 AM' },
      { type: 'assistant', text: "Here's a draft for the three attendees — review before I send?", time: '8:13 AM' },
      {
        type: 'confirm',
        to: 'design-team@acme.co',
        preview:
          "Hi all — quick heads up: I've moved today's 2pm Design sync to tomorrow (Tue) at 2:00 PM. Same link and agenda. Sorry for the shuffle…",
      },
    ],
  },
]

const CATEGORY_META: Record<string, { color: string }> = {
  Facts: { color: '#60A5FA' },
  Preferences: { color: '#34D399' },
  Instructions: { color: '#FBBF24' },
  Notes: { color: '#A78BFA' },
  Entities: { color: '#F472B6' },
  Decisions: { color: '#FB923C' },
  Projects: { color: '#FCD34D' },
}

// Memories are wired to the sample chats: the facts/entities each conversation
// recalls or acts on also appear here, sourced back to that chat, for continuity.
const memories = [
  { cat: 'Entities', text: 'Priya — vendor contact at Northwind; owns the Q3 timeline.', source: 'Reply to Priya (Q3) · today', ago: 'today' },
  { cat: 'Instructions', text: 'Always use Canadian English (colour, centre)', source: 'Reply to Priya (Q3) · today', ago: 'today' },
  { cat: 'Projects', text: 'Q3 timeline — 3 milestones shifted to the week of the 14th', source: 'Reply to Priya (Q3) · today', ago: 'today' },
  { cat: 'Entities', text: 'Northwind — vendor; invoices auto-filed to /Finance.', source: 'Morning brief · today', ago: 'today' },
  { cat: 'Projects', text: 'Auth refactor (PR #42) — debounce token refresh, move expiry to config', source: 'Code review — PR #42 · today', ago: 'today' },
  { cat: 'Preferences', text: 'Prefers short, punchy summaries and bullet takeaways', source: 'Competitor research · today', ago: 'today' },
  { cat: 'Entities', text: 'George — Co-Founder. Handles design, frontend, business, and marketing.', source: 'Team notes · Dec 14', ago: '4 days ago' },
  { cat: 'Entities', text: 'Jay — Co-Founder & certified wizard. Makes all the magic happen.', source: 'Team notes · Dec 14', ago: '4 days ago' },
  { cat: 'Preferences', text: 'Likes concise answers with a concrete example', source: 'Competitor research · Dec 14', ago: '4 days ago' },
  { cat: 'Decisions', text: 'Switched to BYOK model — users bring their own API keys', source: 'Product planning · Dec 8', ago: '2 weeks ago' },
  { cat: 'Facts', text: 'Lodestone v0.5.6 is the current release with 14+ tools', source: 'Server config · Dec 10', ago: '2 weeks ago' },
  { cat: 'Facts', text: 'Runs on macOS 13+ and Windows 10+', source: 'Server config · Dec 10', ago: '2 weeks ago' },
  { cat: 'Projects', text: 'Landing page redesign — launch by end of Q3', source: 'Product planning · Dec 6', ago: '3 weeks ago' },
  { cat: 'Notes', text: 'Idea: add a "memory timeline" view to the app', source: 'Quick note · Dec 4', ago: '3 weeks ago' },
]

const MEMORY_COUNT = memories.length

/** Category order for filter chips; counts derive from the data so they stay accurate. */
const CATEGORY_ORDER = ['Facts', 'Preferences', 'Instructions', 'Entities', 'Decisions', 'Projects', 'Notes']
const filters = [
  { label: 'All', count: MEMORY_COUNT },
  ...CATEGORY_ORDER.map((label) => ({
    label,
    count: memories.filter((m) => m.cat === label).length,
  })).filter((f) => f.count > 0),
]

// One-off reminders (distinct from recurring scheduled jobs). The Design sync
// reminder is the one Lodestone set during the Morning brief chat — continuity.
const reminders = [
  {
    when: 'Tomorrow · 1:45 PM',
    title: 'Design sync moved to 2:00 PM',
    note: 'Set from your morning brief · pings 15 min before',
  },
]

function CatChip({ cat }: { cat: string }) {
  const color = CATEGORY_META[cat]?.color ?? '#a78bfa'
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color }}>
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      {cat}
    </span>
  )
}

function Avatar() {
  return (
    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 shrink-0">
      <span className="w-2.5 h-2.5 rounded-full bg-white/90" />
    </span>
  )
}

function ChatView({ convo }: { convo: Conversation }) {
  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">
            {convo.title} <span className="text-[var(--text-dim)] font-normal">· Chat</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] px-2 py-1 rounded-md bg-[var(--surface-2)] border border-[var(--border)]">
            <Sparkles className="w-3 h-3 text-brand-300" />
            {convo.model}
            <ChevronDown className="w-3 h-3" />
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-dot" />
            Connected
          </span>
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto chat-scroll px-4 py-4 space-y-3">
        {convo.messages.map((m, i) => {
          if (m.type === 'user') {
            return (
              <div key={i} className="flex flex-col items-end">
                <div className="max-w-[78%] rounded-2xl rounded-br-sm bg-brand-500/20 border border-brand-500/20 text-[var(--text)] px-3.5 py-2 text-sm">
                  {m.text}
                </div>
                {m.time && <span className="text-[10px] text-[var(--text-dim)] mt-1">{m.time}</span>}
              </div>
            )
          }
          if (m.type === 'assistant') {
            return (
              <div key={i} className="flex gap-2.5">
                <Avatar />
                <div>
                  <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-[var(--surface-2)] text-[var(--text-muted)] px-3.5 py-2 text-sm leading-relaxed">
                    {m.text}
                  </div>
                  {m.time && <span className="text-[10px] text-[var(--text-dim)] mt-1 inline-block">{m.time}</span>}
                </div>
              </div>
            )
          }
          if (m.type === 'tool') {
            return (
              <div key={i} className="flex gap-2.5">
                <Avatar />
                <div className="max-w-[85%] rounded-xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden text-xs">
                  <div className="px-3 py-1.5 font-mono text-cyan-300 border-b border-[var(--border)] flex items-center gap-2">
                    <Network className="w-3 h-3" />
                    {m.call}
                  </div>
                  <div className="px-3 py-1.5 text-[var(--text-muted)]">{m.result}</div>
                </div>
              </div>
            )
          }
          if (m.type === 'list') {
            return (
              <div key={i} className="flex gap-2.5">
                <Avatar />
                <div>
                  <div className="max-w-[92%] rounded-2xl rounded-bl-sm bg-[var(--surface-2)] px-3.5 py-2.5 text-sm">
                    <p className="text-[var(--text-muted)] mb-2">{m.intro}</p>
                    <ol className="space-y-1.5">
                      {m.items.map((it, k) => (
                        <li key={k} className="flex gap-2">
                          <span className="text-brand-300 font-semibold">{k + 1}.</span>
                          <span>
                            <span className="text-[var(--text)] font-medium">{it.title}</span>
                            <span className="text-[var(--text-dim)]"> — {it.desc}</span>
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  {m.time && <span className="text-[10px] text-[var(--text-dim)] mt-1 inline-block">{m.time}</span>}
                </div>
              </div>
            )
          }
          if (m.type === 'recall') {
            return (
              <div key={i} className="flex justify-center">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] bg-[var(--surface)] border border-[var(--border)] rounded-full px-3 py-1">
                  <span className="w-2 h-2 rounded-full bg-pink-400" />
                  {m.text}
                </span>
              </div>
            )
          }
          if (m.type === 'attachment') {
            return (
              <div key={i} className="flex gap-2.5">
                <span className="w-7 shrink-0" />
                <div className="inline-flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-500/15 text-brand-300 border border-brand-500/20">
                    <FileText className="w-4 h-4" />
                  </span>
                  <div className="leading-tight">
                    <div className="text-xs font-medium text-[var(--text)]">{m.name}</div>
                    <div className="text-[10px] text-[var(--text-dim)]">{m.size}</div>
                  </div>
                </div>
              </div>
            )
          }
          if (m.type === 'confirm') {
            return (
              <div key={i} className="flex gap-2.5">
                <span className="w-7 shrink-0" />
                <div className="max-w-[92%] w-full rounded-xl border border-brand-500/30 bg-brand-500/[0.06] overflow-hidden">
                  <div className="px-3.5 py-2 border-b border-[var(--border)] text-[10px] uppercase tracking-wide text-[var(--text-dim)] flex items-center gap-1.5">
                    <Send className="w-3 h-3 text-brand-300" /> Draft reply · To: {m.to}
                  </div>
                  <div className="px-3.5 py-2.5 text-sm text-[var(--text-muted)] leading-relaxed">
                    {m.preview}
                  </div>
                  <div className="px-3.5 py-2.5 flex items-center gap-2 border-t border-[var(--border)]">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-brand-500 text-white">
                      <Send className="w-3.5 h-3.5" /> Send reply
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)]">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </span>
                    <span className="ml-auto text-[10px] text-[var(--text-dim)]">Waiting for your OK</span>
                  </div>
                </div>
              </div>
            )
          }
          return (
            <div key={i} className="flex gap-2.5">
              <Avatar />
              <div className="rounded-2xl rounded-bl-sm bg-[var(--surface-2)] px-4 py-3 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-dim)] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-dim)] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-dim)] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* input */}
      <div className="px-4 pb-3 pt-1">
        <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5">
          <Paperclip className="w-4 h-4 text-[var(--text-dim)]" />
          <span className="flex-1 text-sm text-[var(--text-dim)]">Ask anything…</span>
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-brand-500 text-white">
            <Send className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] text-[var(--text-dim)]">
          <span className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1"><Sparkles className="w-3 h-3 text-brand-300" /> Your API key</span>
            <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-pink-400" /> 3 memories active</span>
          </span>
          <span>Lodestone never sees your keys</span>
        </div>
      </div>
    </div>
  )
}

function MemoryView() {
  const [mode, setMode] = useState<'list' | 'graph'>('list')
  const [active, setActive] = useState('All')
  const shown = active === 'All' ? memories : memories.filter((m) => m.cat === active)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <div className="text-sm font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-pink-400" />
          Memory <span className="text-[var(--text-dim)] font-normal">· {MEMORY_COUNT} memories</span>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] p-0.5 bg-[var(--bg)]">
          <button
            onClick={() => setMode('list')}
            className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md ${
              mode === 'list' ? 'bg-brand-500/20 text-brand-200' : 'text-[var(--text-muted)]'
            }`}
          >
            <ListIcon className="w-3 h-3" /> List
          </button>
          <button
            onClick={() => setMode('graph')}
            className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md ${
              mode === 'graph' ? 'bg-brand-500/20 text-brand-200' : 'text-[var(--text-muted)]'
            }`}
          >
            <Sparkles className="w-3 h-3" /> Graph
          </button>
        </div>
      </div>

      {mode === 'list' ? (
        <>
          <div className="flex gap-1.5 overflow-x-auto px-4 py-3 border-b border-[var(--border)] scrollbar-hide">
            {filters.map((f) => (
              <button
                key={f.label}
                onClick={() => setActive(f.label)}
                className={`shrink-0 text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  active === f.label
                    ? 'border-brand-500/40 bg-brand-500/15 text-brand-200'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {f.label} <span className="text-[var(--text-dim)]">{f.count}</span>
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto chat-scroll px-4 py-3 space-y-2.5">
            {shown.map((m, i) => (
              <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50 px-4 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <CatChip cat={m.cat} />
                  <span className="text-[10px] text-[var(--text-dim)]">{m.ago}</span>
                </div>
                <p className="text-sm text-[var(--text)] mb-1">{m.text}</p>
                <p className="text-xs text-[var(--text-dim)]">{m.source}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0">
            <KnowledgeGraphLazy interactive starCount={900} dustCount={700} className="h-full" />
          </div>
          <div className="px-4 py-3 border-t border-[var(--border)]">
            <GraphLegend />
          </div>
        </div>
      )}
    </div>
  )
}

function TasksView() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <div className="text-sm font-semibold flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-brand-300" />
          Tasks <span className="text-[var(--text-dim)] font-normal">· runs on its own</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-dot" />
          Scheduled
        </span>
      </div>
      <div className="flex-1 overflow-y-auto chat-scroll px-4 py-4 space-y-4">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-[var(--text-dim)] mb-2">Scheduled</div>
          <div className="space-y-2.5">
            {AUTONOMY_EXAMPLES.map((job) => (
              <div
                key={job.title}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50 px-4 py-3"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-sm font-medium text-[var(--text)] flex items-center gap-2">
                    <CalendarClock className="w-3.5 h-3.5 text-brand-300" />
                    {job.title}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[var(--text-dim)]">
                    <Clock className="w-3 h-3" />
                    {job.when}
                  </span>
                </div>
                <p className="flex items-start gap-2 text-xs text-[var(--text-muted)] leading-relaxed">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{job.result}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wide text-[var(--text-dim)] mb-2">Reminders</div>
          <div className="space-y-2.5">
            {reminders.map((r) => (
              <div
                key={r.title}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50 px-4 py-3"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-sm font-medium text-[var(--text)] flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-amber-300" />
                    {r.title}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[var(--text-dim)]">
                    <Clock className="w-3 h-3" />
                    {r.when}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-dim)] leading-relaxed">{r.note}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-[var(--text-dim)] text-center pt-1">
          Lodestone runs these on your machine — no prompt, no open window.
        </p>
      </div>
    </div>
  )
}

function IdentityView() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-[var(--border)] text-sm font-semibold flex items-center gap-2">
        <Fingerprint className="w-4 h-4 text-brand-300" /> Identity
      </div>
      <div className="flex-1 overflow-y-auto chat-scroll px-4 py-4">
        <div className="flex items-center gap-3 mb-5">
          <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-500">
            <Sparkles className="w-5 h-5 text-white" />
          </span>
          <div>
            <div className="font-semibold">Lodestone</div>
            <div className="text-xs text-[var(--text-muted)]">Your personal agent · adapts to you</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { k: 'Personality', v: 'Concise, warm, direct' },
            { k: 'Expertise', v: 'Product & design' },
            { k: 'Tone', v: 'Canadian English' },
            { k: 'Memory', v: `${MEMORY_COUNT} memories learned` },
          ].map((row) => (
            <div key={row.k} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50 px-3.5 py-3">
              <div className="text-[11px] uppercase tracking-wide text-[var(--text-dim)] mb-0.5">{row.k}</div>
              <div className="text-sm text-[var(--text)]">{row.v}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-[var(--border)] px-3.5 py-3 text-sm text-[var(--text-muted)]">
          It builds this profile automatically from your conversations — no setup required.
        </div>
      </div>
    </div>
  )
}

export default function InteractiveAppPreview() {
  const [view, setView] = useState<View>('chat')
  const [activeChat, setActiveChat] = useState('inbox')
  const convo = conversations.find((c) => c.id === activeChat) ?? conversations[0]

  const navItems: { id: View; label: string; icon: typeof MessageSquare }[] = [
    { id: 'chat', label: 'Chats', icon: MessageSquare },
    { id: 'tasks', label: 'Tasks', icon: CalendarClock },
    { id: 'memory', label: 'Memory', icon: Brain },
    { id: 'identity', label: 'Identity', icon: Fingerprint },
  ]

  return (
    <div className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-2xl shadow-brand-500/10">
      {/* window bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface-2)]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-[var(--text-muted)] ml-2">Lodestone</span>
        <span className="ml-auto text-[10px] text-[var(--text-dim)] hidden sm:inline">Interactive preview — click around</span>
      </div>

      <div className="flex h-[500px]">
        {/* sidebar */}
        <aside className="w-56 shrink-0 border-r border-[var(--border)] bg-[var(--bg)] hidden md:flex flex-col">
          <div className="p-3">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-500/15 text-brand-200 text-sm font-medium border border-brand-500/20">
              <Plus className="w-4 h-4" /> New Chat
            </button>
          </div>
          <div className="px-3 pb-2">
            <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--text-dim)]">
              <Search className="w-3.5 h-3.5" /> Search chats…
            </div>
          </div>
          <div className="px-2 space-y-0.5 overflow-y-auto chat-scroll flex-1">
            {conversations.map((c) => {
              const isActive = view === 'chat' && c.id === activeChat
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveChat(c.id)
                    setView('chat')
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-left transition-colors ${
                    isActive ? 'bg-[var(--surface-2)] text-[var(--text)]' : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)]/60'
                  }`}
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded bg-[var(--surface-2)] border border-[var(--border)] text-[10px] font-semibold text-[var(--text-muted)]">
                    {c.letter}
                  </span>
                  <span className="truncate">{c.title}</span>
                </button>
              )
            })}
          </div>
          <div className="p-2 border-t border-[var(--border)] space-y-0.5">
            {navItems.map((n) => {
              const Icon = n.icon
              const isActive = view === n.id
              return (
                <button
                  key={n.id}
                  onClick={() => setView(n.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                    isActive ? 'bg-brand-500/15 text-brand-200' : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)]/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {n.label}
                </button>
              )
            })}
          </div>
          <div className="p-3 border-t border-[var(--border)] flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold">A</span>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-[var(--text)] flex items-center gap-1.5">
                Alex
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-200 font-semibold">PRO</span>
              </div>
              <div className="text-[10px] text-[var(--text-dim)]">BYOK: OpenAI</div>
            </div>
          </div>
        </aside>

        {/* mobile view switcher */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="md:hidden flex items-center gap-1 p-2 border-b border-[var(--border)] bg-[var(--bg)]">
            {navItems.map((n) => {
              const Icon = n.icon
              return (
                <button
                  key={n.id}
                  onClick={() => setView(n.id)}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-md ${
                    view === n.id ? 'bg-brand-500/15 text-brand-200' : 'text-[var(--text-muted)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {n.label}
                </button>
              )
            })}
          </div>
          <div className="flex-1 min-h-0">
            {view === 'chat' && <ChatView convo={convo} />}
            {view === 'tasks' && <TasksView />}
            {view === 'memory' && <MemoryView />}
            {view === 'identity' && <IdentityView />}
          </div>
        </div>
      </div>
    </div>
  )
}
