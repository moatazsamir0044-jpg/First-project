'use client'
import { useEffect, useRef, useState } from 'react'

interface MashrabiyaPatternProps {
  /** 0–1, default 0.18 */
  opacity?: number
  /** SVG tile size in px, default 48 */
  tileSize?: number
  /** 'texture' = static background fill, 'divider' = thin horizontal strip, 'shutter' = animated reveal over hero */
  variant?: 'texture' | 'divider' | 'shutter'
  className?: string
  children?: React.ReactNode
}

// One octagonal mashrabiya cell as an SVG symbol
function MashrabiyaTile({ size }: { size: number }) {
  const s = size
  const c = s / 2
  const r = s * 0.42
  const sides = 8
  const pts = Array.from({ length: sides }, (_, i) => {
    const angle = (Math.PI / 4) * i - Math.PI / 8
    return `${c + r * Math.cos(angle)},${c + r * Math.sin(angle)}`
  }).join(' ')

  return (
    <pattern id="mash-tile" x="0" y="0" width={s} height={s} patternUnits="userSpaceOnUse">
      {/* outer octagon */}
      <polygon
        points={pts}
        fill="none"
        stroke="var(--color-accent-primary)"
        strokeWidth="1.2"
      />
      {/* inner cross arms */}
      <line x1={c} y1="2" x2={c} y2={s - 2} stroke="var(--color-accent-primary)" strokeWidth="0.7" />
      <line x1="2" y1={c} x2={s - 2} y2={c} stroke="var(--color-accent-primary)" strokeWidth="0.7" />
      {/* diagonal arms */}
      <line x1="4" y1="4" x2={s - 4} y2={s - 4} stroke="var(--color-accent-primary)" strokeWidth="0.5" />
      <line x1={s - 4} y1="4" x2="4" y2={s - 4} stroke="var(--color-accent-primary)" strokeWidth="0.5" />
      {/* center dot */}
      <circle cx={c} cy={c} r="1.5" fill="var(--color-accent-primary)" />
    </pattern>
  )
}

export default function MashrabiyaPattern({
  opacity = 0.18,
  tileSize = 48,
  variant = 'texture',
  className = '',
  children,
}: MashrabiyaPatternProps) {
  const [shutterOpen, setShutterOpen] = useState(false)
  const prefersReduced = useRef(false)

  useEffect(() => {
    prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (variant === 'shutter') {
      if (prefersReduced.current) {
        setShutterOpen(true)
        return
      }
      // small delay so the shutter is visible before animating
      const t = setTimeout(() => setShutterOpen(true), 120)
      return () => clearTimeout(t)
    }
  }, [variant])

  // ── Shutter variant ──────────────────────────────────────────────
  if (variant === 'shutter') {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {children}
        {/* Two curtain panels that slide out left/right */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex pointer-events-none"
          style={{ zIndex: 30 }}
        >
          {['left', 'right'].map((side) => (
            <div
              key={side}
              className="relative flex-1 overflow-hidden bg-[var(--color-night)]"
              style={{
                transition: prefersReduced.current
                  ? 'none'
                  : 'transform 1.1s cubic-bezier(0.77,0,0.175,1)',
                transform: shutterOpen
                  ? `translateX(${side === 'left' ? '-100%' : '100%'})`
                  : 'translateX(0)',
              }}
            >
              <svg
                width="100%"
                height="100%"
                className="absolute inset-0"
                style={{ opacity: 0.25 }}
              >
                <defs>
                  <MashrabiyaTile size={tileSize} />
                </defs>
                <rect width="100%" height="100%" fill="url(#mash-tile)" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Divider variant ──────────────────────────────────────────────
  if (variant === 'divider') {
    return (
      <div
        aria-hidden="true"
        className={`w-full overflow-hidden ${className}`}
        style={{ height: tileSize }}
      >
        <svg width="100%" height={tileSize} style={{ opacity }}>
          <defs>
            <MashrabiyaTile size={tileSize} />
          </defs>
          <rect width="100%" height={tileSize} fill="url(#mash-tile)" />
        </svg>
      </div>
    )
  }

  // ── Texture variant (default) ────────────────────────────────────
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <svg width="100%" height="100%">
        <defs>
          <MashrabiyaTile size={tileSize} />
        </defs>
        <rect width="100%" height="100%" fill="url(#mash-tile)" />
      </svg>
    </div>
  )
}
