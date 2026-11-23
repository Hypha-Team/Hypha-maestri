/*
  First-load moment, like the logo.
  Red serpent lines slither in from the edges of the screen, one ring after the other,
  each one following the shape of the letters, until the last ones stitch the word HYPHA.

  How it works: every letter is one continuous rounded stroke. Around it we stack ever
  wider strokes of the same letter, alternating red and linen. Each red + linen pair draws
  at the same time, so it shows up as a single red line that follows the letters,
  exactly like the maze lines in the logo.
*/
import { useRef, type ReactElement } from 'react'
import { gsap, reducedMotion, useGSAP } from '../motion/motion'

// Each letter as ONE continuous line (viewBox 0 0 900 400), so it moves like a serpent.
const LETTERS = [
  'M 70 110 V 290 V 200 H 170 V 110 V 290', // H
  'M 235 110 L 295 200 L 355 110 L 295 200 V 290', // Y
  'M 420 290 V 110 H 465 A 55 55 0 0 1 465 220 H 420', // P
  'M 560 110 V 290 V 200 H 660 V 110 V 290', // H
  'M 715 290 L 775 110 L 835 290 L 813 228 H 737', // A
]

// Thick bands like the logo. Fewer, wider rings also keep phones smooth:
// every ring is 10 SVG paths redrawn on each frame of the animation.
const LETTER = 46 // thickness of the letters
const LINE = 34 // thickness of each red line
const GAP = 32 // linen space between lines
const RINGS = 13 // how many lines around the word (enough to fill a phone screen)

// Timing (seconds)
const DRAW = 1.2 // how long one line takes to slither in
const NEXT_RING = 0.08 // delay between one ring and the next one inside it
const NEXT_LETTER = 0.05 // small left-to-right wave across the letters
const HOLD = 0.5 // the finished word stays on screen
const FADE = 0.4

const RED = 'var(--color-red)'
const LINEN = 'var(--color-linen)'

export default function Intro({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      if (reducedMotion()) return onDone()
      const paths = svg.current!.querySelectorAll<SVGPathElement>('path')
      paths.forEach((p) => {
        const len = p.getTotalLength()
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
      })

      const tl = gsap.timeline({ onComplete: onDone })
      // From the outermost ring inwards, letters in a gentle wave from left to right.
      for (let k = RINGS; k >= 0; k--) {
        LETTERS.forEach((_, i) => {
          const lines = svg.current!.querySelectorAll(`[data-ring="${k}"][data-letter="${i}"]`)
          tl.to(lines, { strokeDashoffset: 0, duration: DRAW, ease: 'power2.inOut' }, (RINGS - k) * NEXT_RING + i * NEXT_LETTER)
        })
      }
      tl.to({}, { duration: HOLD }).to(root.current, { opacity: 0, duration: FADE, ease: 'power2.in' })
    },
    { scope: root },
  )

  // Outer rings first in the SVG, so inner rings sit on top.
  // Within one ring all reds go below all linens, so neighbouring letters merge cleanly.
  const layers: ReactElement[] = []
  for (let k = RINGS; k >= 1; k--) {
    const red = LETTER + 2 * k * (LINE + GAP)
    LETTERS.forEach((d, i) => layers.push(<path key={`r${k}-${i}`} data-ring={k} data-letter={i} d={d} stroke={RED} strokeWidth={red} />))
    LETTERS.forEach((d, i) => layers.push(<path key={`l${k}-${i}`} data-ring={k} data-letter={i} d={d} stroke={LINEN} strokeWidth={red - 2 * LINE} />))
  }
  // Ring 0 = the letters themselves
  LETTERS.forEach((d, i) => layers.push(<path key={`w${i}`} data-ring={0} data-letter={i} d={d} stroke={RED} strokeWidth={LETTER} />))

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-linen"
      aria-hidden="true"
      onClick={onDone}
    >
      <svg
        ref={svg}
        viewBox="0 0 900 400"
        className="w-[96vw] max-w-none overflow-visible md:w-[min(90vw,1400px)]"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {layers}
      </svg>
    </div>
  )
}
