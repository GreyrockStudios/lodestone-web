import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg)] px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-extrabold text-brand-500 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-[var(--text)] mb-2">Page not found</h2>
        <p className="text-[var(--text-muted)] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Go home
          </Link>
          <Link
            to="/docs/getting-started"
            className="px-6 py-2.5 bg-[var(--surface-2)] hover:bg-[var(--surface-2)]/80 text-[var(--text)] rounded-lg text-sm font-medium transition-colors border border-[var(--border)]"
          >
            Read the docs
          </Link>
        </div>
      </div>
    </div>
  )
}
