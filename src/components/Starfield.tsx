import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  z: number // depth 0..1 (parallax + size)
  r: number
  vx: number // constant horizontal drift (px/frame)
  tw: number // twinkle phase
  tws: number // twinkle speed
  hue: 'white' | 'violet' | 'blue'
}

/**
 * Animated constellation starfield rendered on a canvas.
 * Stars drift gently and steadily on a single horizontal current (so the
 * motion never visibly changes direction), twinkle, and are linked by faint
 * lines. A subtle depth-based parallax responds to page scroll rather than the
 * mouse. Honors prefers-reduced-motion.
 */
export default function Starfield({
  className = '',
  density = 0.00016,
  maxStars = 150,
  linkDistance = 130,
  interactive = true,
}: {
  className?: string
  density?: number
  maxStars?: number
  linkDistance?: number
  interactive?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reduced =
      typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let stars: Star[] = []

    // Scroll-driven parallax (eased for smoothness).
    let scrollTarget = typeof window !== 'undefined' ? window.scrollY : 0
    let scrollCur = scrollTarget

    const colorFor = (s: Star, alpha: number) => {
      if (s.hue === 'violet') return `rgba(196,181,253,${alpha})`
      if (s.hue === 'blue') return `rgba(147,178,255,${alpha})`
      return `rgba(226,232,255,${alpha})`
    }

    function build() {
      const parent = canvas!.parentElement
      const rect = parent
        ? parent.getBoundingClientRect()
        : { width: window.innerWidth, height: window.innerHeight }
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      canvas!.width = Math.floor(width * dpr)
      canvas!.height = Math.floor(height * dpr)
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(maxStars, Math.floor(width * height * density))
      stars = Array.from({ length: count }, () => {
        const z = Math.random()
        const hueRoll = Math.random()
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          r: 0.5 + z * 1.6,
          // gentle, constant rightward drift; nearer stars drift a touch faster
          vx: 0.04 + z * 0.08,
          tw: Math.random() * Math.PI * 2,
          tws: 0.008 + Math.random() * 0.02,
          hue: hueRoll > 0.85 ? 'violet' : hueRoll > 0.72 ? 'blue' : 'white',
        }
      })
    }

    // Rendered vertical offset for a star given the current eased scroll.
    // Bounded so the field never flies far off during long-page scrolls.
    const parallaxY = (z: number) => {
      const p = Math.max(-height, Math.min(height * 1.3, scrollCur))
      return -p * (0.02 + z * 0.055)
    }

    let raf = 0
    function frame() {
      ctx!.clearRect(0, 0, width, height)

      if (interactive && !reduced) scrollCur += (scrollTarget - scrollCur) * 0.1

      // steady horizontal drift + wrap
      for (const s of stars) {
        if (!reduced) {
          s.x += s.vx
          s.tw += s.tws
        }
        if (s.x > width + 6) s.x -= width + 12
        else if (s.x < -6) s.x += width + 12
      }

      // constellation links
      const link2 = linkDistance * linkDistance
      for (let i = 0; i < stars.length; i++) {
        const a = stars[i]
        const ay = a.y + parallaxY(a.z)
        for (let j = i + 1; j < stars.length; j++) {
          const b = stars[j]
          const dx = a.x - b.x
          const dy = ay - (b.y + parallaxY(b.z))
          const d2 = dx * dx + dy * dy
          if (d2 < link2) {
            const t = 1 - d2 / link2
            ctx!.strokeStyle = `rgba(129,140,248,${t * 0.16})`
            ctx!.lineWidth = 0.6
            ctx!.beginPath()
            ctx!.moveTo(a.x, ay)
            ctx!.lineTo(b.x, b.y + parallaxY(b.z))
            ctx!.stroke()
          }
        }
      }

      // stars
      for (const s of stars) {
        const sx = s.x
        const sy = s.y + parallaxY(s.z)
        const twinkle = reduced ? 0.8 : 0.55 + Math.sin(s.tw) * 0.45
        const alpha = (0.35 + s.z * 0.5) * twinkle
        if (s.z > 0.7) {
          const g = ctx!.createRadialGradient(sx, sy, 0, sx, sy, s.r * 4)
          g.addColorStop(0, colorFor(s, alpha * 0.5))
          g.addColorStop(1, colorFor(s, 0))
          ctx!.fillStyle = g
          ctx!.beginPath()
          ctx!.arc(sx, sy, s.r * 4, 0, Math.PI * 2)
          ctx!.fill()
        }
        ctx!.fillStyle = colorFor(s, alpha)
        ctx!.beginPath()
        ctx!.arc(sx, sy, s.r, 0, Math.PI * 2)
        ctx!.fill()
      }

      // keep animating; also settle scroll easing after a scroll while reduced
      if (!reduced) raf = requestAnimationFrame(frame)
    }

    build()
    frame()

    const onResize = () => {
      build()
      if (reduced) frame()
    }
    const onScroll = () => {
      scrollTarget = window.scrollY
      if (reduced) {
        scrollCur = scrollTarget
        frame()
      }
    }

    window.addEventListener('resize', onResize)
    if (interactive) window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      if (interactive) window.removeEventListener('scroll', onScroll)
    }
  }, [density, maxStars, linkDistance, interactive])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  )
}
