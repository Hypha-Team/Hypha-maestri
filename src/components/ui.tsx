// Small shared building blocks: icons, wordmark, pictures, avatars, badges, buttons, sheets, toasts.
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkBadge01Icon, CheckmarkCircle02Icon, StarIcon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { useEffect, useRef, useSyncExternalStore, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { pictureSrc } from '../art/generateArt'
import type { Person, Picture } from '../data/types'
import { useApp } from '../state/AppContext'
import { DUR, EASE, gsap, lockScroll, reducedMotion } from '../motion/motion'
import Magnet from './reactbits/Magnet'

export type IconSvg = Parameters<typeof HugeiconsIcon>[0]['icon']

export function Icon({ icon, size = 22, className = '', stroke = 1.6 }: { icon: IconSvg; size?: number; className?: string; stroke?: number }) {
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={stroke} className={className} aria-hidden="true" />
}

/** "HYPHA" in the soft display face, for the header and small places. */
export function Wordmark({ className = '' }: { className?: string }) {
  return <span className={`font-display text-red select-none ${className}`}>HYPHA</span>
}

/** Any artwork or photo, keeping its aspect ratio. */
export function Pic({ picture, alt, className = '', rounded = true }: { picture: Picture; alt: string; className?: string; rounded?: boolean }) {
  const { src, ratio } = pictureSrc(picture)
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      draggable={false}
      style={{ aspectRatio: String(ratio) }}
      className={`block w-full bg-paper object-cover ${rounded ? 'rounded-[var(--radius-work)]' : ''} ${className}`}
    />
  )
}

export function Avatar({ person, size = 40 }: { person: Person; size?: number }) {
  const { src } = pictureSrc(person.photo ?? { art: person.avatar })
  const initials = person.name.replace('Prof. ', '').split(' ').map((s) => s[0]).slice(0, 2).join('')
  const org = person.role === 'provider'
  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center overflow-hidden ${org ? 'rounded-[10px]' : 'rounded-full'}`}
      style={{ width: size, height: size }}
    >
      <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
      {!person.photo && (
        <span className="relative font-display text-paper" style={{ fontSize: size * 0.38 }}>
          {initials}
        </span>
      )}
    </span>
  )
}

export function UniBadge({ compact = false }: { compact?: boolean }) {
  const { t } = useApp()
  return (
    <span className="inline-flex items-center gap-1 text-xs text-thread" title={t('badge.uni')}>
      <Icon icon={CheckmarkCircle02Icon} size={15} />
      {!compact && t('badge.uni')}
    </span>
  )
}

export function CheckedBadge({ compact = false }: { compact?: boolean }) {
  const { t } = useApp()
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red px-2 py-0.5 text-xs font-medium text-paper" title={t('badge.checked')}>
      <Icon icon={CheckmarkBadge01Icon} size={14} stroke={2} />
      {!compact && t('badge.checked')}
    </span>
  )
}

export function RecommendedMark({ by, overlay = false }: { by?: string; overlay?: boolean }) {
  const { t, personById } = useApp()
  const teacher = by ? personById(by) : undefined
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full text-xs font-medium ${
        overlay ? 'bg-paper/95 px-2 py-1 text-ink shadow-sm' : 'text-red'
      }`}
    >
      <Icon icon={StarIcon} size={14} stroke={2} className="text-red" />
      {teacher && !overlay ? `${t('badge.recommendedBy')} ${teacher.name}` : t('badge.recommended')}
    </span>
  )
}

export function Chip({ active, children, onClick, className = '' }: { active?: boolean; children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors duration-200 active:scale-95 ${
        active ? 'border-ink bg-ink text-linen' : 'border-linen-deep bg-paper text-ink hover:border-thread'
      } ${className}`}
    >
      {children}
    </button>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-linen-deep px-2.5 py-1 text-xs text-ink">{children}</span>
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost'; magnet?: boolean }

/** Buttons. Only one primary (red) button per screen. */
export function Button({ variant = 'secondary', magnet, className = '', children, ...rest }: BtnProps) {
  const styles = {
    primary: 'bg-red text-paper hover:bg-red-deep',
    secondary: 'bg-paper text-ink border border-linen-deep hover:border-thread',
    ghost: 'text-ink hover:bg-linen-deep',
  }[variant]
  const btn = (
    <button
      type="button"
      {...rest}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-[background,transform,border-color] duration-200 active:scale-[0.97] disabled:opacity-50 ${styles} ${className}`}
    >
      {children}
    </button>
  )
  if (!magnet || reducedMotion()) return btn
  return (
    <Magnet padding={40} magnetStrength={4} maxOffset={10}>
      {btn}
    </Magnet>
  )
}

/** Bottom sheet on phones, centred panel on desktop. */
export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null)
  const { t } = useApp()
  useEffect(() => {
    if (!open) return
    lockScroll(true)
    if (panel.current && !reducedMotion()) gsap.from(panel.current, { y: 40, opacity: 0, duration: DUR.micro + 0.1, ease: EASE })
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 bg-ink/40" aria-label={t('common.close')} onClick={onClose} />
      <div
        ref={panel}
        data-lenis-prevent
        className="safe-bottom relative max-h-[88dvh] w-full overflow-y-auto rounded-t-[22px] bg-linen p-5 md:max-w-lg md:rounded-[22px]"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full hover:bg-linen-deep" aria-label={t('common.close')}>
            <Icon icon={Cancel01Icon} size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}

// ---- Toasts --------------------------------------------------------------
let toastMsg: { id: number; text: string } | null = null
const listeners = new Set<() => void>()
export function toast(text: string) {
  toastMsg = { id: Date.now(), text }
  listeners.forEach((l) => l())
  window.setTimeout(() => {
    if (toastMsg && Date.now() - toastMsg.id >= 2400) {
      toastMsg = null
      listeners.forEach((l) => l())
    }
  }, 2500)
}
export function Toaster() {
  const msg = useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => toastMsg,
  )
  if (!msg) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-[60] flex justify-center px-4 md:top-auto md:bottom-8" role="status" aria-live="polite">
      <div key={msg.id} className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm text-linen shadow-lg">
        <Icon icon={CheckmarkCircle02Icon} size={18} className="text-linen" />
        {msg.text}
      </div>
    </div>
  )
}

/** "35 min ago" style labels. */
export function useAgo() {
  const { t } = useApp()
  return (min: number) =>
    min < 60 ? t('common.minAgo', { n: Math.max(1, Math.round(min)) }) : min < 60 * 24 ? t('common.hAgo', { n: Math.round(min / 60) }) : t('common.dAgo', { n: Math.round(min / 1440) })
}
