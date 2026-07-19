import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from 'react'
import Starfield from './Starfield'

/**
 * Shared building blocks for the marketing site. These keep the redesigned
 * pages visually consistent (spacing rhythm, headings, decorative glows).
 */

/** Wraps content and fades/slides it in the first time it enters the viewport. */
export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className = '',
}: {
  children: ReactNode
  as?: ElementType
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

/** Small uppercase label used above section headings. */
export function Eyebrow({
  children,
  icon,
  className = '',
}: {
  children: ReactNode
  icon?: ReactNode
  className?: string
}) {
  return (
    <span className={`eyebrow uppercase ${className}`}>
      {icon}
      {children}
    </span>
  )
}

/** Consistent section heading with optional eyebrow + subtitle. */
export function SectionHeading({
  eyebrow,
  eyebrowIcon,
  title,
  subtitle,
  align = 'center',
  className = '',
}: {
  eyebrow?: ReactNode
  eyebrowIcon?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  align?: 'center' | 'left'
  className?: string
}) {
  const alignment = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start'
  return (
    <div className={`flex flex-col ${alignment} ${className}`}>
      {eyebrow && (
        <Eyebrow icon={eyebrowIcon} className="mb-4">
          {eyebrow}
        </Eyebrow>
      )}
      <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-[var(--text-muted)] text-base md:text-lg leading-relaxed ${
            align === 'center' ? 'max-w-2xl' : 'max-w-xl'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

/** Decorative aurora glows for section/hero backgrounds. */
export function AuroraBackdrop({
  variant = 'brand',
}: {
  variant?: 'brand' | 'cyan' | 'dual'
}) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {(variant === 'brand' || variant === 'dual') && (
        <div
          className="aurora animate-floaty"
          style={{
            top: '-140px',
            left: '50%',
            width: 720,
            height: 420,
            background: 'radial-gradient(circle, rgba(139,92,246,0.5), transparent 65%)',
          }}
        />
      )}
      {(variant === 'cyan' || variant === 'dual') && (
        <div
          className="aurora"
          style={{
            bottom: '-160px',
            right: '-80px',
            width: 460,
            height: 460,
            background: 'radial-gradient(circle, rgba(99,102,241,0.24), transparent 65%)',
          }}
        />
      )}
    </div>
  )
}

/** Full-bleed grid texture positioned behind hero content. */
export function GridBackdrop() {
  return <div className="absolute inset-0 bg-grid pointer-events-none" aria-hidden="true" />
}

/**
 * Combined hero backdrop: animated constellation starfield layered under
 * soft aurora glow. This is the default "starry" background for hero sections.
 */
export function HeroBackdrop({
  aurora = 'dual',
  dense = false,
}: {
  aurora?: 'brand' | 'cyan' | 'dual'
  dense?: boolean
}) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <Starfield maxStars={dense ? 190 : 120} density={dense ? 0.0002 : 0.00015} />
      <AuroraBackdrop variant={aurora} />
    </div>
  )
}
