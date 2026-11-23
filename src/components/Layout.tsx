// App frame: header with demo role switcher and language, sidebar on desktop, bottom bar on phones.
import {
  Add01Icon, Bookmark01Icon, Briefcase01Icon, Home01Icon, Megaphone01Icon, Message01Icon, PlayIcon,
  RefreshIcon, Search01Icon, UserIcon, Image01Icon, PaintBoardIcon,
} from '@hugeicons/core-free-icons'
import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import type { Key } from '../i18n/en'
import { DUR, EASE, gsap, reducedMotion, scrollToTop, useGSAP } from '../motion/motion'
import { DEMO_ACCOUNTS, useApp } from '../state/AppContext'
import { useDemo } from '../demo/Demo'
import { Avatar, Icon, Sheet, Wordmark, type IconSvg } from './ui'

type NavItem = { to: string; label: Key; icon: IconSvg; create?: boolean; desktopOnly?: boolean }

function useNav(): NavItem[] {
  const { me } = useApp()
  if (me.role === 'provider')
    return [
      { to: '/talent', label: 'nav.talent', icon: Search01Icon },
      { to: '/calls', label: 'nav.calls', icon: Megaphone01Icon },
      { to: '#create', label: 'nav.create', icon: Add01Icon, create: true },
      { to: '/messages', label: 'nav.messages', icon: Message01Icon },
      { to: '/shortlists', label: 'nav.shortlists', icon: Bookmark01Icon },
      { to: '/opportunities', label: 'nav.opportunities', icon: Briefcase01Icon, desktopOnly: true },
      { to: '/me', label: 'nav.profile', icon: UserIcon, desktopOnly: true },
    ]
  return [
    { to: '/', label: 'nav.feed', icon: Home01Icon },
    { to: '/discover', label: 'nav.discover', icon: Search01Icon },
    { to: '#create', label: 'nav.create', icon: Add01Icon, create: true },
    { to: '/messages', label: 'nav.messages', icon: Message01Icon },
    { to: '/me', label: 'nav.profile', icon: UserIcon },
    { to: '/calls', label: 'nav.calls', icon: Megaphone01Icon, desktopOnly: true },
    { to: '/opportunities', label: 'nav.opportunities', icon: Briefcase01Icon, desktopOnly: true },
  ]
}

/** Where each account lands after switching. */
export function homeFor(id: string, signedUp: Record<string, boolean>, role: string) {
  if (signedUp[id] === false) return '/welcome'
  return role === 'provider' ? '/talent' : '/'
}

function RoleSwitcher({ align = 'right' }: { align?: 'right' | 'left' }) {
  const app = useApp()
  const { t, me, switchUser, personById, data, reset } = app
  const demo = useDemo()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const go = (id: string) => {
    const p = personById(id)!
    switchUser(id)
    setOpen(false)
    navigate(homeFor(id, data.signedUp, p.role))
  }

  return (
    <div ref={box} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-dashed border-red bg-paper py-1 pr-3 pl-1 text-sm"
      >
        <Avatar person={me} size={28} />
        <span className="leading-tight">
          <span className="block text-[11px] text-red">{t('demo.mode')}</span>
          <span className="block font-semibold">{DEMO_ACCOUNTS.find((a) => a.id === me.id)?.label ?? me.name}</span>
        </span>
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute top-full z-50 mt-2 w-64 rounded-[var(--radius-ui)] border border-linen-deep bg-paper p-2 shadow-xl ${align === 'right' ? 'right-0' : 'left-0 md:bottom-full md:top-auto md:mb-2'}`}
        >
          <p className="px-2 pt-1 pb-2 text-xs text-thread">{t('demo.viewAs')}</p>
          {DEMO_ACCOUNTS.map((a) => {
            const p = personById(a.id)!
            return (
              <button
                key={a.id}
                role="menuitemradio"
                aria-checked={me.id === a.id}
                onClick={() => go(a.id)}
                className={`flex w-full items-center gap-3 rounded-[10px] px-2 py-2 text-left hover:bg-linen ${me.id === a.id ? 'bg-linen' : ''}`}
              >
                <Avatar person={p} size={32} />
                <span className="text-sm leading-tight">
                  <span className="block font-semibold">{p.name}</span>
                  <span className="block text-thread">{t(a.roleKey)}</span>
                </span>
              </button>
            )
          })}
          <div className="my-2 h-px bg-linen-deep" />
          <button role="menuitem" onClick={() => { setOpen(false); demo.start() }} className="flex w-full items-center gap-3 rounded-[10px] px-2 py-2 text-sm font-semibold text-red hover:bg-linen">
            <Icon icon={PlayIcon} size={18} /> {t('demo.start')}
          </button>
          <button
            role="menuitem"
            onClick={() => { setOpen(false); demo.stop(); reset(); navigate('/welcome') }}
            className="flex w-full items-center gap-3 rounded-[10px] px-2 py-2 text-sm hover:bg-linen"
          >
            <Icon icon={RefreshIcon} size={18} /> {t('demo.reset')}
          </button>
        </div>
      )}
    </div>
  )
}

function PlayDemo() {
  const { t } = useApp()
  const demo = useDemo()
  if (demo.active) return null
  return (
    <button onClick={demo.start} className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold text-red hover:bg-paper">
      <Icon icon={PlayIcon} size={18} /> {t('demo.start')}
    </button>
  )
}

function LangSwitch() {
  const { lang, setLang } = useApp()
  return (
    <div className="flex rounded-full bg-linen-deep p-0.5 text-xs font-semibold" role="group" aria-label="Language">
      {(['en', 'pt'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${lang === l ? 'bg-paper text-ink shadow-sm' : 'text-thread'}`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

export function CreateSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, me } = useApp()
  const navigate = useNavigate()
  const options: { label: Key; to: string; icon: IconSvg }[] =
    me.role === 'provider'
      ? [{ label: 'create.opportunity', to: '/opportunities/new', icon: Briefcase01Icon }]
      : me.role === 'spectator'
        ? [{ label: 'create.post', to: '/?compose=1', icon: Image01Icon }]
        : me.role === 'teacher'
          ? [{ label: 'create.post', to: '/?compose=1', icon: Image01Icon }, { label: 'create.call', to: '/calls/new', icon: Megaphone01Icon }]
          : [
              { label: 'create.work', to: '/add-work', icon: PaintBoardIcon },
              { label: 'create.call', to: '/calls/new', icon: Megaphone01Icon },
              { label: 'create.post', to: '/?compose=1', icon: Image01Icon },
            ]
  return (
    <Sheet open={open} onClose={onClose} title={t('create.title')}>
      <div className="grid gap-2">
        {options.map((o) => (
          <button
            key={o.label}
            onClick={() => { onClose(); navigate(o.to) }}
            className="flex items-center gap-4 rounded-[var(--radius-ui)] bg-paper p-4 text-left font-medium hover:bg-linen-deep"
          >
            <Icon icon={o.icon} size={24} className="text-red" />
            {t(o.label)}
          </button>
        ))}
      </div>
    </Sheet>
  )
}

export default function Layout() {
  const { t } = useApp()
  const nav = useNav()
  const loc = useLocation()
  const [create, setCreate] = useState(false)
  const page = useRef<HTMLDivElement>(null)

  // Page transition: short fade and lift on every route change.
  useGSAP(
    () => {
      scrollToTop()
      if (reducedMotion() || !page.current) return
      gsap.fromTo(page.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: DUR.page, ease: EASE, clearProps: 'transform' })
    },
    { dependencies: [loc.pathname] },
  )

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-full px-4 py-2.5 text-[15px] transition-colors ${isActive ? 'bg-paper font-semibold text-ink' : 'text-thread hover:text-ink'}`

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[240px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col gap-6 border-r border-linen-deep px-4 py-6 md:flex">
        <NavLink to={nav[0].to} className="px-4">
          <Wordmark className="text-4xl" />
        </NavLink>
        <nav className="flex flex-col gap-1" aria-label="Main">
          {nav.map((n) =>
            n.create ? (
              <button key={n.to} onClick={() => setCreate(true)} className="flex items-center gap-3 rounded-full px-4 py-2.5 text-[15px] text-thread hover:text-ink">
                <Icon icon={n.icon} /> {t(n.label)}
              </button>
            ) : (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} className={linkClass} data-demo={`nav-${n.to}`}>
                <Icon icon={n.icon} /> {t(n.label)}
              </NavLink>
            ),
          )}
        </nav>
        <div className="mt-auto flex flex-col items-start gap-3 px-2">
          <RoleSwitcher align="left" />
          <PlayDemo />
          <LangSwitch />
        </div>
      </aside>

      <div className="min-w-0">
        {/* Phone header */}
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 bg-linen px-4 py-2.5 md:hidden">
          <NavLink to={nav[0].to} aria-label="HYPHA home">
            <Wordmark className="text-[28px]" />
          </NavLink>
          <div className="flex items-center gap-2">
            <LangSwitch />
            <RoleSwitcher />
          </div>
        </header>

        <main ref={page} className="mx-auto w-full max-w-6xl px-4 pt-2 pb-28 md:px-8 md:pt-8 md:pb-16">
          <Outlet />
        </main>
      </div>

      {/* Phone bottom bar */}
      <nav aria-label="Main" className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-linen-deep bg-linen md:hidden">
        <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pt-1.5 pb-1.5">
          {nav.filter((n) => !n.desktopOnly).map((n) => (
            <li key={n.to} className="flex-1">
              {n.create ? (
                <button onClick={() => setCreate(true)} className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-red text-paper" aria-label={t(n.label)}>
                  <Icon icon={n.icon} stroke={2.2} />
                </button>
              ) : (
                <NavLink
                  to={n.to}
                  end={n.to === '/'}
                  data-demo={`nav-${n.to}`}
                  className={({ isActive }) => `flex flex-col items-center gap-0.5 py-1 text-[11px] ${isActive ? 'font-semibold text-ink' : 'text-thread'}`}
                >
                  <Icon icon={n.icon} size={23} />
                  {t(n.label)}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <CreateSheet open={create} onClose={() => setCreate(false)} />
    </div>
  )
}
