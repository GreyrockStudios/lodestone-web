import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { HeroBackdrop } from '../components/SiteUI'

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[var(--bg)] px-4 overflow-hidden">
      <HeroBackdrop />
      <div className="relative text-center max-w-md">
        <h1 className="font-display text-8xl md:text-9xl font-extrabold text-gradient mb-4 leading-none">
          404
        </h1>
        <h2 className="font-display text-2xl font-bold text-[var(--text)] mb-2">Page not found</h2>
        <p className="text-[var(--text-muted)] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-white rounded-lg text-sm font-medium transition-colors no-underline shadow-lg shadow-brand-500/25"
          >
            <ArrowLeft className="w-4 h-4" />
            Go home
          </Link>
          <Link
            to="/docs/getting-started"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--surface)] hover:bg-[var(--surface-2)] text-[var(--text)] rounded-lg text-sm font-medium transition-colors border border-[var(--border)] no-underline"
          >
            <BookOpen className="w-4 h-4" />
            Read the docs
          </Link>
        </div>
      </div>
    </div>
  )
}
