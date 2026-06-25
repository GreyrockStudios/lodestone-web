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
  { method: 'POST', path: '/api/auth/refresh', desc: 'Exchange a refresh token for a new access token', auth: false },
  { method: 'POST', path: '/api/auth/logout', desc: 'Invalidate the current session', auth: true },
]

const chatEndpoints: Endpoint[] = [
  { method: 'POST', path: '/api/chat', desc: 'Create a new conversation', auth: true },
  { method: 'GET', path: '/api/chat', desc: 'List all conversations for the authenticated user', auth: true },
  { method: 'GET', path: '/api/chat/:id', desc: 'Get a conversation by ID with all messages', auth: true },
  { method: 'POST', path: '/api/chat/:id/message', desc: 'Send a message in a conversation (triggers agent response)', auth: true },
  { method: 'DELETE', path: '/api/chat/:id', desc: 'Delete a conversation and all its messages', auth: true },
]

const userEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/user/me', desc: 'Get the authenticated user profile', auth: true },
  { method: 'PATCH', path: '/api/user/me', desc: 'Update display name, avatar, or preferences', auth: true },
]

const licenseEndpoints: Endpoint[] = [
  { method: 'POST', path: '/api/license/verify', desc: 'Verify a license key and activate it for the current user', auth: true },
  { method: 'GET', path: '/api/license/status', desc: 'Get current license status, tier, and expiration', auth: true },
]

const memoryEndpoints: Endpoint[] = [
  { method: 'GET', path: '/api/memory', desc: 'List all memories for the authenticated user', auth: true },
  { method: 'POST', path: '/api/memory', desc: 'Create a new memory entry', auth: true },
  { method: 'DELETE', path: '/api/memory/:id', desc: 'Delete a specific memory', auth: true },
  { method: 'GET', path: '/api/memory/search', desc: 'Search memories by query', auth: true },
]

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    POST: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    PATCH: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
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
      <p className="text-[var(--text-muted)] mb-10">REST API endpoints for integrating with Lodestone programmatically.</p>

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
        </div>
      </section>

      <EndpointSection title="Auth" endpoints={authEndpoints} />
      <EndpointSection title="Chat" endpoints={chatEndpoints} />
      <EndpointSection title="User" endpoints={userEndpoints} />
      <EndpointSection title="License" endpoints={licenseEndpoints} />
      <EndpointSection title="Memory" endpoints={memoryEndpoints} />

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Request & response details</h2>
        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <h3 className="font-semibold text-[var(--text)] mb-2">POST /api/auth/register</h3>
            <p className="text-sm text-[var(--text-muted)] mb-3">Create a new account.</p>
            <p className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wider mb-1">Request body</p>
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
  "user": { "id": "...", "email": "...", "displayName": "...", "tier": "free" },
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
  "user": { "id": "...", "email": "...", "displayName": "...", "tier": "desktop" },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}`}
            </pre>
          </div>

          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <h3 className="font-semibold text-[var(--text)] mb-2">POST /api/chat/:id/message</h3>
            <p className="text-sm text-[var(--text-muted)] mb-3">Send a message in a conversation. The agent processes it and responds.</p>
            <p className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wider mb-1">request body</p>
            <pre className="text-sm text-[var(--text)] font-mono bg-[var(--bg)] p-3 rounded overflow-x-auto">
{`{
  "content": "What can you do?",
  "provider": "openai",       // optional: override default provider
  "model": "gpt-4o"          // optional: override default model
}`}
            </pre>
            <p className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wider mt-3 mb-1">response · 200</p>
            <pre className="text-sm text-[var(--text)] font-mono bg-[var(--bg)] p-3 rounded overflow-x-auto">
{`{
  "userMessage": { "id": "...", "role": "user", "content": "..." },
  "assistantMessage": { "id": "...", "role": "assistant", "content": "..." }
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
  "tier": "desktop",
  "expiresAt": "2026-07-21T00:00:00Z"
}`}
            </pre>
          </div>

          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <h3 className="font-semibold text-[var(--text)] mb-2">GET /api/license/status</h3>
            <p className="text-sm text-[var(--text-muted)] mb-3">Check the current user's license status.</p>
            <p className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wider mb-1">response · 200</p>
            <pre className="text-sm text-[var(--text)] font-mono bg-[var(--bg)] p-3 rounded overflow-x-auto">
{`{
  "tier": "desktop",
  "status": "active",
  "expiresAt": "2026-07-21T00:00:00Z",
  "features": {
    "maxConversations": -1,
    "maxMessagesPerMonth": -1,
    "memory": true,
    "knowledgeGraph": true,
    "tools": true
  }
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
                { status: 401, code: 'AUTH_TOKEN_EXPIRED', desc: 'Access token has expired -- refresh it' },
                { status: 403, code: 'AUTH_INSUFFICIENT_TIER', desc: 'Feature requires a higher tier' },
                { status: 404, code: 'NOT_FOUND', desc: 'Resource does not exist' },
                { status: 409, code: 'AUTH_EMAIL_EXISTS', desc: 'Email already registered' },
                { status: 429, code: 'RATE_LIMITED', desc: 'Too many requests -- slow down' },
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
                  <td className="py-2">Free</td>
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
        <Link to="/docs/desktop-app" className="text-[var(--cyan)] hover:underline text-sm font-medium">
          ← Desktop App
        </Link>
        <Link to="/docs/faq" className="text-[var(--cyan)] hover:underline text-sm font-medium">
          Next: FAQ →
        </Link>
      </div>
    </div>
  )
}