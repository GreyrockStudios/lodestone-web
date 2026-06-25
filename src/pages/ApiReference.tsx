import { Link } from 'react-router-dom'

interface Endpoint {
  method: string
  path: string
  desc: string
  auth: boolean
}

const authEndpoints: Endpoint[] = [
  { method: 'POST', path: '/api/auth/register', desc: 'Create a new account', auth: false },
  { method: 'POST', path: '/api/auth/login', desc: 'Authenticate and receive access + refresh tokens', auth: false },
  { method: 'POST', path: '/api/auth/refresh', desc: 'Exchange a refresh token for new access token', auth: false },
  { method: 'POST', path: '/api/auth/logout', desc: 'Invalidate the current session', auth: true },
  { method: 'POST', path: '/api/auth/change-password', desc: 'Change the authenticated user password', auth: true },
  { method: 'POST', path: '/api/auth/forgot-password', desc: 'Request a password reset email', auth: false },
  { method: 'POST', path: '/api/auth/reset-password', desc: 'Reset password using a valid reset token', auth: false },
  { method: 'GET', path: '/api/auth/verify-email', desc: 'Verify email address via token', auth: false },
  { method: 'POST', path: '/api/auth/resend-verification', desc: 'Resend email verification', auth: false },
]

const oauthEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/auth/google', desc: 'Initiate Google OAuth flow', auth: false },
  { method: 'GET', path: '/api/auth/google/callback', desc: 'Google OAuth callback', auth: false },
  { method: 'GET', path: '/api/auth/github', desc: 'Initiate GitHub OAuth flow', auth: false },
  { method: 'GET', path: '/api/auth/github/callback', desc: 'GitHub OAuth callback', auth: false },
]

const chatEndpoints: Endpoint[] = [
  { method: 'POST', path: '/api/chat/message', desc: 'Send a message (non-streaming)', auth: true },
  { method: 'POST', path: '/api/chat/stream', desc: 'Send a message with streaming response', auth: true },
  { method: 'GET', path: '/api/chat/conversations', desc: 'List all conversations', auth: true },
  { method: 'GET', path: '/api/chat/conversations/:id/messages', desc: 'Get messages for a conversation', auth: true },
  { method: 'GET', path: '/api/chat/conversations/search', desc: 'Search conversations by query', auth: true },
  { method: 'DELETE', path: '/api/chat/conversations/:id', desc: 'Delete a conversation', auth: true },
  { method: 'PATCH', path: '/api/chat/conversations/:id/system-prompt', desc: 'Update conversation system prompt', auth: true },
  { method: 'POST', path: '/api/chat/conversations/:id/branch', desc: 'Branch a conversation at a message', auth: true },
  { method: 'GET', path: '/api/chat/greeting', desc: 'Get a personalized smart greeting', auth: true },
  { method: 'GET', path: '/api/chat/templates', desc: 'List available conversation templates', auth: true },
  { method: 'GET', path: '/api/chat/recall', desc: 'Search memories via chat', auth: true },
  { method: 'POST', path: '/api/chat/upload', desc: 'Upload a file attachment', auth: true },
  { method: 'GET', path: '/api/chat/files', desc: 'List uploaded files', auth: true },
  { method: 'DELETE', path: '/api/chat/files/:id', desc: 'Delete an uploaded file', auth: true },
  { method: 'POST', path: '/api/chat/share', desc: 'Create a shareable link for a conversation', auth: true },
  { method: 'DELETE', path: '/api/chat/share/:conversationId', desc: 'Revoke a shared conversation link', auth: true },
  { method: 'GET', path: '/api/chat/usage', desc: 'Get token usage stats', auth: true },
  { method: 'GET', path: '/api/chat/system-prompts', desc: 'List available system prompts', auth: true },
]

const commitmentEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/chat/commitments', desc: 'List all commitments/tasks', auth: true },
  { method: 'POST', path: '/api/chat/commitments', desc: 'Create a new commitment', auth: true },
  { method: 'PATCH', path: '/api/chat/commitments/:id', desc: 'Update a commitment', auth: true },
  { method: 'DELETE', path: '/api/chat/commitments/:id', desc: 'Delete a commitment', auth: true },
  { method: 'PATCH', path: '/api/chat/commitments/mark-overdue', desc: 'Mark overdue commitments', auth: true },
  { method: 'GET', path: '/api/chat/follow-ups', desc: 'List follow-up reminders', auth: true },
]

const folderEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/chat/folders', desc: 'List all conversation folders', auth: true },
  { method: 'POST', path: '/api/chat/folders', desc: 'Create a new folder', auth: true },
  { method: 'PATCH', path: '/api/chat/folders/:id', desc: 'Rename a folder', auth: true },
  { method: 'DELETE', path: '/api/chat/folders/:id', desc: 'Delete a folder', auth: true },
  { method: 'PATCH', path: '/api/chat/conversations/:id/folder', desc: 'Move a conversation to a folder', auth: true },
  { method: 'PATCH', path: '/api/chat/conversations/:id/pin', desc: 'Pin/unpin a conversation', auth: true },
]

const userEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/user/me', desc: 'Get the authenticated user profile', auth: true },
  { method: 'PATCH', path: '/api/user/me', desc: 'Update display name, avatar, or preferences', auth: true },
  { method: 'DELETE', path: '/api/user/me', desc: 'Delete account and all associated data', auth: true },
  { method: 'GET', path: '/api/user/features', desc: 'Get tier features for the current user', auth: true },
  { method: 'GET', path: '/api/user/me/preferences', desc: 'Get user preferences (theme, personality, etc.)', auth: true },
  { method: 'PATCH', path: '/api/user/me/preferences', desc: 'Update user preferences', auth: true },
]

const memoryEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/memory', desc: 'List all memories', auth: true },
  { method: 'POST', path: '/api/memory', desc: 'Create a new memory', auth: true },
  { method: 'POST', path: '/api/memory/batch', desc: 'Create multiple memories at once', auth: true },
  { method: 'DELETE', path: '/api/memory/:id', desc: 'Delete a specific memory', auth: true },
  { method: 'GET', path: '/api/memory/search', desc: 'Search memories by query', auth: true },
  { method: 'GET', path: '/api/memory/graph', desc: 'Get memory as knowledge graph', auth: true },
  { method: 'GET', path: '/api/memory/relationship-types', desc: 'List available relationship types', auth: true },
  { method: 'POST', path: '/api/memory/edges', desc: 'Create a relationship between memories', auth: true },
  { method: 'DELETE', path: '/api/memory/edges/:id', desc: 'Delete a relationship', auth: true },
]

const knowledgeGraphEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/knowledge-graph', desc: 'Get the full knowledge graph', auth: true },
  { method: 'GET', path: '/api/knowledge-graph/search', desc: 'Search the knowledge graph', auth: true },
  { method: 'POST', path: '/api/knowledge-graph/edges', desc: 'Create a graph edge', auth: true },
  { method: 'DELETE', path: '/api/knowledge-graph/edges/:id', desc: 'Delete a graph edge', auth: true },
  { method: 'POST', path: '/api/knowledge-graph/auto-connect/:memoryId', desc: 'Auto-connect a memory to related nodes', auth: true },
]

const identityEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/identity', desc: 'Get the current agent identity', auth: true },
  { method: 'PUT', path: '/api/identity', desc: 'Update agent identity (name, personality, profession, etc.)', auth: true },
  { method: 'GET', path: '/api/identity/presets', desc: 'List available identity presets', auth: true },
  { method: 'GET', path: '/api/identity/suggestions', desc: 'Get identity suggestions based on usage', auth: true },
]

const personaEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/personas', desc: 'List all personas (agent identities)', auth: true },
  { method: 'POST', path: '/api/personas', desc: 'Create a new persona', auth: true },
  { method: 'GET', path: '/api/personas/:id', desc: 'Get a specific persona', auth: true },
  { method: 'PATCH', path: '/api/personas/:id', desc: 'Update a persona', auth: true },
  { method: 'DELETE', path: '/api/personas/:id', desc: 'Delete a persona', auth: true },
  { method: 'POST', path: '/api/personas/:id/set-default', desc: 'Set a persona as the default', auth: true },
]

const subAgentEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/sub-agents', desc: 'List all sub-agents', auth: true },
  { method: 'POST', path: '/api/sub-agents', desc: 'Create a new sub-agent', auth: true },
  { method: 'GET', path: '/api/sub-agents/:id', desc: 'Get a specific sub-agent', auth: true },
  { method: 'PATCH', path: '/api/sub-agents/:id', desc: 'Update a sub-agent', auth: true },
]

const brainEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/brain/search', desc: 'Search brain knowledge', auth: true },
  { method: 'GET', path: '/api/brain/staged', desc: 'Get staged (pending) brain entries', auth: true },
  { method: 'POST', path: '/api/brain/learn', desc: 'Submit new knowledge to the brain', auth: true },
  { method: 'POST', path: '/api/brain/review', desc: 'Review pending brain entries', auth: true },
  { method: 'POST', path: '/api/brain/memories/:id/approve', desc: 'Approve a staged brain memory', auth: true },
  { method: 'POST', path: '/api/brain/memories/:id/reject', desc: 'Reject a staged brain memory', auth: true },
]

const brainSkillsEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/brain/skills', desc: 'List all brain skills', auth: true },
  { method: 'GET', path: '/api/brain/skills/active', desc: 'List active (approved) skills', auth: true },
  { method: 'PATCH', path: '/api/brain/skills/:id', desc: 'Update a skill (approve, disable, etc.)', auth: true },
  { method: 'POST', path: '/api/brain/skills/:id/approve', desc: 'Approve a pending skill', auth: true },
  { method: 'POST', path: '/api/brain/skills/:id/reject', desc: 'Reject a pending skill', auth: true },
]

const brainTasksEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/brain/tasks', desc: 'List all brain tasks', auth: true },
  { method: 'POST', path: '/api/brain/tasks', desc: 'Create a new brain task', auth: true },
  { method: 'GET', path: '/api/brain/tasks/:id', desc: 'Get a specific brain task', auth: true },
  { method: 'PATCH', path: '/api/brain/tasks/:id', desc: 'Update a brain task', auth: true },
  { method: 'DELETE', path: '/api/brain/tasks/:id', desc: 'Delete a brain task', auth: true },
  { method: 'POST', path: '/api/brain/tasks/:id/inject', desc: 'Inject a brain task into active context', auth: true },
]

const scheduledTasksEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/scheduled-tasks', desc: 'List all scheduled tasks', auth: true },
  { method: 'POST', path: '/api/scheduled-tasks', desc: 'Create a new scheduled task', auth: true },
  { method: 'PATCH', path: '/api/scheduled-tasks/:id', desc: 'Update a scheduled task', auth: true },
  { method: 'DELETE', path: '/api/scheduled-tasks/:id', desc: 'Delete a scheduled task', auth: true },
  { method: 'POST', path: '/api/scheduled-tasks/:id/run', desc: 'Manually trigger a scheduled task', auth: true },
]

const notificationEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/notifications/stream', desc: 'SSE stream for real-time notifications', auth: true },
]

const storageRagEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/storage/files', desc: 'List stored files', auth: true },
  { method: 'POST', path: '/api/storage/upload', desc: 'Upload a file to storage', auth: true },
  { method: 'GET', path: '/api/storage/usage', desc: 'Get storage usage stats', auth: true },
  { method: 'POST', path: '/api/rag/upload', desc: 'Upload a document for RAG processing', auth: true },
  { method: 'POST', path: '/api/rag/query', desc: 'Query documents using RAG', auth: true },
  { method: 'GET', path: '/api/rag/documents', desc: 'List RAG documents', auth: true },
  { method: 'DELETE', path: '/api/rag/documents/:fileId', desc: 'Delete a RAG document', auth: true },
]

const browserEndpoints: Endpoint[] = [
  { method: 'POST', path: '/api/browser/action', desc: 'Execute a browser action', auth: true },
  { method: 'POST', path: '/api/browser/screenshot', desc: 'Take a browser screenshot', auth: true },
  { method: 'POST', path: '/api/browser/extract', desc: 'Extract content from a web page', auth: true },
]

const auditEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/audit', desc: 'List audit log entries', auth: true },
  { method: 'GET', path: '/api/audit/stats', desc: 'Get audit statistics', auth: true },
  { method: 'POST', path: '/api/audit', desc: 'Create an audit entry', auth: true },
  { method: 'DELETE', path: '/api/audit/:id', desc: 'Delete an audit entry', auth: true },
  { method: 'DELETE', path: '/api/audit', desc: 'Clear all audit entries', auth: true },
]

const mcpEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/mcp-marketplace', desc: 'List available MCP servers', auth: false },
  { method: 'GET', path: '/api/mcp-marketplace/:id', desc: 'Get MCP server details', auth: false },
  { method: 'POST', path: '/api/mcp-marketplace/:id/install', desc: 'Install an MCP server', auth: true },
  { method: 'DELETE', path: '/api/mcp-marketplace/:id/install', desc: 'Uninstall an MCP server', auth: true },
]

const licenseEndpoints: Endpoint[] = [
  { method: 'POST', path: '/api/license/verify', desc: 'Verify and activate a license key', auth: true },
  { method: 'POST', path: '/api/license/redeem', desc: 'Redeem a license key for the current user', auth: true },
  { method: 'GET', path: '/api/license/status', desc: 'Get current license status and tier', auth: true },
]

const subscriptionEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/subscription', desc: 'Get current subscription', auth: true },
  { method: 'GET', path: '/api/subscription/plans', desc: 'List available plans (public)', auth: false },
  { method: 'POST', path: '/api/subscription/cancel', desc: 'Cancel current subscription', auth: true },
]

const stripeEndpoints: Endpoint[] = [
  { method: 'POST', path: '/api/stripe/checkout', desc: 'Create a Stripe checkout session', auth: true },
  { method: 'POST', path: '/api/stripe/portal', desc: 'Create a Stripe customer portal session', auth: true },
  { method: 'POST', path: '/api/stripe/webhook', desc: 'Stripe webhook handler (no auth)', auth: false },
]

const trialEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/trial/status', desc: 'Get trial status', auth: true },
  { method: 'POST', path: '/api/trial/start', desc: 'Start a Pro trial', auth: true },
]

const usageEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/usage/tokens', desc: 'Get token usage stats', auth: true },
  { method: 'GET', path: '/api/usage/credits', desc: 'Get credit balance', auth: true },
  { method: 'GET', path: '/api/usage/credit-packs', desc: 'List available credit packs (public)', auth: false },
  { method: 'GET', path: '/api/usage/provider-rates', desc: 'List provider pricing (public)', auth: false },
  { method: 'POST', path: '/api/usage/packs', desc: 'Purchase a credit pack', auth: true },
  { method: 'GET', path: '/api/usage/my-packs', desc: 'List purchased credit packs', auth: true },
]

const apiKeyEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/keys', desc: 'List API keys', auth: true },
  { method: 'POST', path: '/api/keys', desc: 'Create a new API key', auth: true },
  { method: 'DELETE', path: '/api/keys/:id', desc: 'Revoke an API key', auth: true },
]

const toolsEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/chat/tools', desc: 'List available tools', auth: true },
]

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    POST: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    PATCH: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    PUT: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    DELETE: 'bg-red-500/15 text-red-400 border-red-500/30',
  }
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-semibold border ${colors[method] || 'bg-[var(--surface-2)] text-[var(--text-dim)]'}`}>
      {method}
    </span>
  )
}

function EndpointSection({ title, endpoints }: { title: string; endpoints: Endpoint[] }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">{title}</h2>
      <div className="space-y-2">
        {endpoints.map(ep => (
          <div key={ep.path + ep.method} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <MethodBadge method={ep.method} />
            <div className="flex-1 min-w-0">
              <code className="text-sm text-[var(--text)] font-mono">{ep.path}</code>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">{ep.desc}</p>
            </div>
            {ep.auth && (
              <span className="text-xs text-[var(--text-dim)] flex-shrink-0 bg-[var(--surface-2)] px-2 py-0.5 rounded">Auth</span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default function ApiReference() {
  return (
    <div className="docs-content max-w-3xl">
      <h1 className="text-4xl font-extrabold mb-2 tracking-tight">API Reference</h1>
      <p className="text-[var(--text-muted)] mb-10">REST API endpoints for integrating with Lodestone programmatically. All endpoints require HTTPS.</p>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Base URL</h2>
        <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)] font-mono text-sm text-[var(--text)]">
          https://heylodestone.com/api
        </div>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          All endpoints are prefixed with <code className="text-[var(--cyan)]">/api</code>. Requests must use HTTPS.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Authentication</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <p>
            Authenticated endpoints require a Bearer token in the <code className="text-[var(--cyan)]">Authorization</code> header:
          </p>
          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <pre className="text-sm text-[var(--text)] font-mono overflow-x-auto">
{`Authorization: Bearer <access_token>`}
            </pre>
          </div>
          <p>
            Access tokens expire after 15 minutes. Use the refresh token to get a new one without re-authenticating.
          </p>
          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <p className="text-sm font-semibold text-[var(--text)] mb-2">Token lifecycle</p>
            <ul className="text-sm space-y-1">
              <li><strong className="text-[var(--text)]">Access token:</strong> 15-minute expiry. Used for all authenticated requests.</li>
              <li><strong className="text-[var(--text)]">Refresh token:</strong> 30-day expiry. Used only to obtain new access tokens.</li>
              <li><strong className="text-[var(--text)]">Storage:</strong> Both tokens are returned in the login/register response. Store them securely.</li>
            </ul>
          </div>
          <p>OAuth providers (Google, GitHub) are also supported for sign-in. Use the <code className="text-[var(--cyan)]">/api/auth/google</code> or <code className="text-[var(--cyan)]">/api/auth/github</code> endpoints to initiate the flow.</p>
        </div>
      </section>

      <EndpointSection title="Auth" endpoints={authEndpoints} />
      <EndpointSection title="OAuth" endpoints={oauthEndpoints} />
      <EndpointSection title="Chat" endpoints={chatEndpoints} />
      <EndpointSection title="Tasks & Commitments" endpoints={commitmentEndpoints} />
      <EndpointSection title="Folders" endpoints={folderEndpoints} />
      <EndpointSection title="User" endpoints={userEndpoints} />
      <EndpointSection title="Memory" endpoints={memoryEndpoints} />
      <EndpointSection title="Knowledge Graph" endpoints={knowledgeGraphEndpoints} />
      <EndpointSection title="Agent Identity" endpoints={identityEndpoints} />
      <EndpointSection title="Personas" endpoints={personaEndpoints} />
      <EndpointSection title="Sub-Agents" endpoints={subAgentEndpoints} />
      <EndpointSection title="Brain" endpoints={brainEndpoints} />
      <EndpointSection title="Brain Skills" endpoints={brainSkillsEndpoints} />
      <EndpointSection title="Brain Tasks" endpoints={brainTasksEndpoints} />
      <EndpointSection title="Scheduled Tasks" endpoints={scheduledTasksEndpoints} />
      <EndpointSection title="Notifications" endpoints={notificationEndpoints} />
      <EndpointSection title="Storage & RAG" endpoints={storageRagEndpoints} />
      <EndpointSection title="Browser Automation" endpoints={browserEndpoints} />
      <EndpointSection title="Audit Log" endpoints={auditEndpoints} />
      <EndpointSection title="MCP Marketplace" endpoints={mcpEndpoints} />
      <EndpointSection title="License" endpoints={licenseEndpoints} />
      <EndpointSection title="Subscription" endpoints={subscriptionEndpoints} />
      <EndpointSection title="Stripe" endpoints={stripeEndpoints} />
      <EndpointSection title="Trial" endpoints={trialEndpoints} />
      <EndpointSection title="Usage & Credits" endpoints={usageEndpoints} />
      <EndpointSection title="API Keys" endpoints={apiKeyEndpoints} />
      <EndpointSection title="Tools" endpoints={toolsEndpoints} />

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Request & response examples</h2>
        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <h3 className="font-semibold text-[var(--text)] mb-2">POST /api/auth/register</h3>
            <p className="text-sm text-[var(--text-muted)] mb-3">Create a new account.</p>
            <p className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wider mb-1">request body</p>
            <pre className="text-sm text-[var(--text)] font-mono bg-[var(--bg)] p-3 rounded overflow-x-auto">
{`{
  "email": "user@example.com",
  "password": "securepassword123",
  "displayName": "Alice"
}`}
            </pre>
            <p className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wider mt-3 mb-1">response · 201</p>
            <pre className="text-sm text-[var(--text)] font-mono bg-[var(--bg)] p-3 rounded overflow-x-auto">
{`{
  "user": { "id": "...", "email": "...", "displayName": "...", "tier": "community" },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}`}
            </pre>
          </div>

          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <h3 className="font-semibold text-[var(--text)] mb-2">POST /api/auth/login</h3>
            <p className="text-sm text-[var(--text-muted)] mb-3">Authenticate with email and password.</p>
            <p className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wider mb-1">request body</p>
            <pre className="text-sm text-[var(--text)] font-mono bg-[var(--bg)] p-3 rounded overflow-x-auto">
{`{
  "email": "user@example.com",
  "password": "securepassword123"
}`}
            </pre>
            <p className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wider mt-3 mb-1">response · 200</p>
            <pre className="text-sm text-[var(--text)] font-mono bg-[var(--bg)] p-3 rounded overflow-x-auto">
{`{
  "user": { "id": "...", "email": "...", "displayName": "...", "tier": "pro" },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}`}
            </pre>
          </div>

          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <h3 className="font-semibold text-[var(--text)] mb-2">POST /api/chat/stream</h3>
            <p className="text-sm text-[var(--text-muted)] mb-3">Send a message with streaming response. Returns Server-Sent Events.</p>
            <p className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wider mb-1">request body</p>
            <pre className="text-sm text-[var(--text)] font-mono bg-[var(--bg)] p-3 rounded overflow-x-auto">
{`{
  "content": "What can you do?",
  "provider": "openai",       // optional: override default provider
  "model": "gpt-4o"          // optional: override default model
}`}
            </pre>
          </div>

          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <h3 className="font-semibold text-[var(--text)] mb-2">POST /api/license/verify</h3>
            <p className="text-sm text-[var(--text-muted)] mb-3">Activate a license key for the current user.</p>
            <p className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wider mb-1">request body</p>
            <pre className="text-sm text-[var(--text)] font-mono bg-[var(--bg)] p-3 rounded overflow-x-auto">
{`{
  "licenseKey": "LODE-XXXX-XXXX-XXXX"
}`}
            </pre>
            <p className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wider mt-3 mb-1">response · 200</p>
            <pre className="text-sm text-[var(--text)] font-mono bg-[var(--bg)] p-3 rounded overflow-x-auto">
{`{
  "valid": true,
  "tier": "pro",
  "expiresAt": "2026-07-21T00:00:00Z"
}`}
            </pre>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Error responses</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <p>All errors follow a consistent format:</p>
          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <pre className="text-sm text-[var(--text)] font-mono overflow-x-auto">
{`{
  "error": "Invalid credentials",
  "code": "AUTH_INVALID_CREDENTIALS"
}`}
            </pre>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[var(--text)]">Common error codes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { status: 400, code: 'VALIDATION_ERROR', desc: 'Missing or invalid request fields' },
                { status: 401, code: 'AUTH_REQUIRED', desc: 'Missing or invalid Authorization header' },
                { status: 401, code: 'AUTH_INVALID_CREDENTIALS', desc: 'Wrong email or password' },
                { status: 401, code: 'AUTH_TOKEN_EXPIRED', desc: 'Access token has expired — refresh it' },
                { status: 403, code: 'AUTH_INSUFFICIENT_TIER', desc: 'Feature requires a higher tier' },
                { status: 404, code: 'NOT_FOUND', desc: 'Resource does not exist' },
                { status: 409, code: 'AUTH_EMAIL_EXISTS', desc: 'Email already registered' },
                { status: 429, code: 'RATE_LIMITED', desc: 'Too many requests — slow down' },
              ].map(e => (
                <div key={e.code} className="text-sm p-2 rounded bg-[var(--surface-2)]">
                  <span className="font-mono font-semibold text-[var(--text)]">{e.status}</span>
                  <span className="text-[var(--text-dim)]"> · </span>
                  <span className="font-mono text-[var(--cyan)]">{e.code}</span>
                  <p className="text-[var(--text-muted)] mt-0.5">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Rate limits</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 text-[var(--text-dim)] font-medium">Tier</th>
                  <th className="text-left py-2 text-[var(--text-dim)] font-medium">Rate limit</th>
                  <th className="text-left py-2 text-[var(--text-dim)] font-medium">Message limit</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-2">Community</td>
                  <td className="py-2">60 req/min</td>
                  <td className="py-2">50 messages/month</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-2">Desktop</td>
                  <td className="py-2">120 req/min</td>
                  <td className="py-2">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-2">Pro</td>
                  <td className="py-2">300 req/min</td>
                  <td className="py-2">Unlimited</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm">
            Rate limit headers are included in every response: <code className="text-[var(--cyan)]">X-RateLimit-Limit</code>, <code className="text-[var(--cyan)]">X-RateLimit-Remaining</code>, <code className="text-[var(--cyan)]">X-RateLimit-Reset</code>.
          </p>
        </div>
      </section>

      <div className="flex justify-between pt-6 border-t border-[var(--border)]">
        <Link to="/docs/usage-guide" className="text-[var(--cyan)] hover:underline text-sm font-medium">
          ← Usage Guide
        </Link>
        <Link to="/docs/faq" className="text-[var(--cyan)] hover:underline text-sm font-medium">
          Next: FAQ →
        </Link>
      </div>
    </div>
  )
}
