/*
  Motion setup: GSAP + ScrollTrigger + Lenis smooth scroll.
  Durations live here so the team can make everything faster or slower in one place.
*/
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export const DUR = {
  page: 0.35,   // route change
  reveal: 0.6,  // images appearing on scroll
  expand: 0.55, // artwork opening full screen
  micro: 0.25,  // buttons and chips
}
export const EASE = 'power3.out'

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis: Lenis | null = null

/** Starts Lenis and keeps ScrollTrigger in sync. Skipped when the user prefers reduced motion. */
export function useSmoothScroll() {
  useEffect(() => {
    if (reducedMotion()) return
    document.documentElement.classList.add('js-motion')
    lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis?.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis?.destroy()
      lenis = null
    }
  }, [])
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true })
  else window.scrollTo(0, 0)
}

/** Scroll an element to the upper part of the screen (above the demo guide card). */
export function scrollToEl(el: HTMLElement) {
  const offset = -window.innerHeight * 0.22
  if (lenis) lenis.scrollTo(el, { offset, duration: 0.8 })
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: reducedMotion() ? 'auto' : 'smooth' })
}

/** Lock scroll while a full-screen layer is open. */
export function lockScroll(on: boolean) {
  if (lenis) (on ? lenis.stop() : lenis.start())
  document.body.style.overflow = on ? 'hidden' : ''
}

/** Staggered reveal of every [data-reveal] element inside the returned ref. */
export function useReveal<T extends HTMLElement>(deps: unknown[] = []) {
  const ref = useRef<T>(null)
  useGSAP(
    () => {
      const els = ref.current?.querySelectorAll<HTMLElement>('[data-reveal]')
      if (!els?.length) return
      if (reducedMotion()) {
        gsap.set(els, { opacity: 1 })
        return
      }
      gsap.set(els, { opacity: 0, y: 24 })
      ScrollTrigger.batch(els, {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: DUR.reveal, ease: EASE, stagger: 0.07, overwrite: true }),
      })
      ScrollTrigger.refresh()
    },
    { scope: ref, dependencies: deps, revertOnUpdate: true },
  )
  return ref
}

/* Artwork expand: the grid remembers where the clicked image was,
   and the work page animates its hero image from that rectangle. */
let lastRect: { id: string; rect: DOMRect } | null = null
export const rememberRect = (id: string, el: Element | null) => {
  if (el) lastRect = { id, rect: el.getBoundingClientRect() }
}
export const takeRect = (id: string) => {
  const r = lastRect?.id === id ? lastRect.rect : null
  lastRect = null
  return r
}

export { gsap, ScrollTrigger, useGSAP }
