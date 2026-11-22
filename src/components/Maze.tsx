/*
  The organic maze lines from the logo, redrawn as SVG so they can animate.
  Used on the intro, loading screens, empty states and dividers — never behind artwork.
*/
import { useRef } from 'react'
import { DUR, gsap, reducedMotion, useGSAP } from '../motion/motion'

/** Builds a meandering path of nested rounded "U" shapes, like the embroidery. */
function meander(x: number, y: number, w: number, h: number, rings: number, gap: number, dir: 1 | -1) {
  const paths: string[] = []
  for (let i = 0; i < rings; i++) {
    const inset = i * gap
    const ww = w - inset * 2
    const hh = h - inset
    if (ww <= gap || hh <= gap) break
    const r = Math.min(ww / 2, 40)
    const x0 = x + inset
    const x1 = x0 + ww
    const top = dir === 1 ? y + inset : y + h - inset
    const bottom = dir === 1 ? y + h : y
    const s = dir
    paths.push(
      `M ${x0} ${bottom} L ${x0} ${top + s * r} Q ${x0} ${top} ${x0 + r} ${top} L ${x1 - r} ${top} Q ${x1} ${top} ${x1} ${top + s * r} L ${x1} ${bottom}`,
    )
  }
  return paths
}

const PATTERN = [
  ...meander(10, 10, 220, 260, 4, 26, 1),
  ...meander(250, 0, 160, 330, 4, 24, -1),
  ...meander(430, 30, 200, 240, 4, 26, 1),
  ...meander(40, 290, 260, 210, 4, 26, -1),
  ...meander(320, 350, 290, 160, 4, 26, 1),
]

interface MazeProps {
  className?: string
  /** draw the lines in on mount */
  draw?: boolean
  stroke?: number
  color?: string
  onDone?: () => void
}

export function Maze({ className = '', draw = false, stroke = 12, color = 'var(--color-red)', onDone }: MazeProps) {
  const ref = useRef<SVGSVGElement>(null)
  useGSAP(
    () => {
      if (!draw) return
      const lines = ref.current?.querySelectorAll('path')
      if (!lines) return
      if (reducedMotion()) {
        onDone?.()
        return
      }
      lines.forEach((p) => {
        const len = p.getTotalLength()
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
      })
      gsap.to(lines, {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: 'power2.inOut',
        stagger: { each: 0.04, from: 'random' },
        onComplete: onDone,
      })
    },
    { scope: ref },
  )
  return (
    <svg ref={ref} viewBox="0 0 640 520" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      {PATTERN.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  )
}

/** A thin band of parallel wavy threads, used as a section divider. */
export function Thread({ className = '' }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  useGSAP(
    () => {
      if (reducedMotion()) return
      const lines = ref.current?.querySelectorAll('path')
      if (!lines) return
      lines.forEach((p) => {
        const len = p.getTotalLength()
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
      })
      gsap.to(lines, {
        strokeDashoffset: 0,
        duration: DUR.reveal * 2,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: 'top 95%', once: true },
      })
    },
    { scope: ref },
  )
  return (
    <svg ref={ref} viewBox="0 0 400 24" preserveAspectRatio="none" className={`h-4 w-full ${className}`} aria-hidden="true">
      {[5, 12, 19].map((y, i) => (
        <path
          key={y}
          d={`M0 ${y} C 60 ${y - 5}, 110 ${y + 5}, 170 ${y} S 290 ${y - 5}, 400 ${y}`}
          fill="none"
          stroke="var(--color-red)"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity={1 - i * 0.25}
        />
      ))}
    </svg>
  )
}
