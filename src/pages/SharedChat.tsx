import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { marked } from 'marked'

marked.setOptions({ breaks: true, gfm: true })

export default function SharedChat() {
  const { token } = useParams<{ token: string }>()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    fetch(`/api/chat/shared/${token}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) setData(d)
        else setError('This conversation link is invalid or has expired.')
      })
      .catch(() => setError('Failed to load conversation.'))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="text-[var(--text-muted)]">Loading...</div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="text-center">
        <div className="text-4xl mb-4">🔗</div>
        <p className="text-[var(--text)] text-lg font-medium">{error}</p>
        <a href="/chat" className="text-brand-400 hover:underline text-sm mt-2 inline-block">Start your own conversation &rarr;</a>
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" style={{ background: 'var(--bg)' }}>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🪨</span>
        <div>
          <h1 className="text-lg font-semibold text-[var(--text)]">{data.title}</h1>
          <p className="text-xs text-[var(--text-dim)]">Shared via Lodestone</p>
        </div>
      </div>
      <div className="space-y-4">
        {data.messages.map((msg: any, i: number) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-brand-500 text-white rounded-2xl rounded-br-md'
                : 'bg-[var(--surface-2)] text-[var(--text)] rounded-2xl rounded-bl-md'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm prose-invert max-w-none [&_a]:text-brand-400" dangerouslySetInnerHTML={{ __html: marked(msg.content) as string }} />
              ) : (
                <span className="whitespace-pre-wrap">{msg.content}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-8 pt-6 border-t border-[var(--border)]">
        <a href="/chat" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-sm font-medium transition-colors" style={{ background: 'var(--brand)' }}>
          🪨 Try Lodestone for free
        </a>
      </div>
    </div>
  )
}
