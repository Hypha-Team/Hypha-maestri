/*
  App state: who is logged in, connections, messages, calls, shortlists…
  Everything is kept in localStorage so it survives a refresh.
  "Reset demo data" puts everything back to the start of the story.
*/
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { cannedReplies, opportunities as seedOpps, projectCalls as seedCalls, posts as seedPosts, seedMessages } from '../data/content'
import { people, personById } from '../data/people'
import type { Connection, Message, Opportunity, Person, Post, ProjectCall, Shortlist, Work } from '../data/types'
import { works as seedWorks } from '../data/works'
import { en, type Key } from '../i18n/en'
import { pt } from '../i18n/pt'

export type Lang = 'en' | 'pt'

/** The accounts the role switcher can jump between. */
export const DEMO_ACCOUNTS = [
  { id: 'marta', label: 'Camille', roleKey: 'role.student' as Key },
  { id: 'tiago', label: 'Louis', roleKey: 'role.student' as Key },
  { id: 'helena', label: 'Prof. Rodin', roleKey: 'role.teacher' as Key },
  { id: 'fio', label: 'Galeria Fio', roleKey: 'role.provider' as Key },
]

interface Data {
  userId: string
  /** Marta has not signed up yet at the start of the story */
  signedUp: Record<string, boolean>
  imported: Record<string, boolean>
  bios: Record<string, string>
  connections: Connection[]
  messages: Message[]
  posts: Post[]
  calls: ProjectCall[]
  opportunities: Opportunity[]
  shortlists: Shortlist[]
  userWorks: Work[]
  recommendations: Record<string, string>
  lang: Lang
}

const STORAGE_KEY = 'hypha-demo-v1'

function initialData(): Data {
  return {
    userId: 'marta',
    signedUp: { marta: false },
    imported: { marta: false },
    bios: {},
    connections: [
      { from: 'marta', to: 'helena', status: 'accepted' },
      { from: 'marta', to: 'beatriz', status: 'accepted' },
      { from: 'marta', to: 'duarte', status: 'accepted' },
      { from: 'tiago', to: 'miguel', status: 'accepted' },
      { from: 'tiago', to: 'vasco', status: 'accepted' },
      { from: 'fio', to: 'mariana', status: 'accepted' },
    ],
    messages: seedMessages,
    posts: seedPosts,
    calls: seedCalls,
    opportunities: seedOpps,
    shortlists: [
      { id: 'sl-spring', ownerId: 'fio', name: 'Spring group show', items: [{ kind: 'work', id: 'mariana-16' }, { kind: 'person', id: 'sofia' }] },
      { id: 'sl-window', ownerId: 'fio', name: 'Window commission', items: [{ kind: 'work', id: 'clara-8' }] },
    ],
    userWorks: [],
    recommendations: {},
    lang: 'en',
  }
}

function load(): Data {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...initialData(), ...JSON.parse(raw) }
  } catch {
    /* private mode or broken data: start fresh */
  }
  return initialData()
}

export interface Typing { from: string; to: string }

function useAppState() {
  const [data, setData] = useState<Data>(load)
  const [typing, setTyping] = useState<Typing | null>(null)
  const timers = useRef<number[]>([])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      /* storage full (big uploaded images): keep working in memory */
    }
  }, [data])

  useEffect(() => {
    document.documentElement.lang = data.lang
  }, [data.lang])

  const update = useCallback((fn: (d: Data) => Data) => setData(fn), [])

  // ---- translations ----
  const t = useCallback(
    (key: Key, vars?: Record<string, string | number>) => {
      let s: string = (data.lang === 'pt' ? pt : en)[key] ?? en[key] ?? key
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v))
      return s
    },
    [data.lang],
  )

  const me = personById(data.userId) as Person

  // ---- works: sample data + uploaded works, Marta's appear after import ----
  const allWorks = useMemo(() => {
    const list = [...data.userWorks, ...seedWorks].filter((w) => !w.fromImport || data.imported[w.ownerId])
    return list.map((w) => (data.recommendations[w.id] ? { ...w, recommendedBy: data.recommendations[w.id] } : w))
  }, [data.userWorks, data.imported, data.recommendations])

  const bioOf = useCallback((p: Person) => data.bios[p.id] ?? p.bio, [data.bios])

  // ---- connections ----
  const connectionWith = useCallback(
    (a: string, b: string) => data.connections.find((c) => (c.from === a && c.to === b) || (c.from === b && c.to === a)),
    [data.connections],
  )
  const connect = (to: string) =>
    update((d) => (connectionWith(d.userId, to) ? d : { ...d, connections: [...d.connections, { from: d.userId, to, status: 'pending' }] }))
  const accept = (from: string) =>
    update((d) => ({
      ...d,
      connections: d.connections.map((c) => (c.from === from && c.to === d.userId ? { ...c, status: 'accepted' } : c)),
    }))
  const decline = (from: string) =>
    update((d) => ({ ...d, connections: d.connections.filter((c) => !(c.from === from && c.to === d.userId)) }))

  // ---- messages, with a fake reply ----
  const sendMessage = (to: string, text: string, opts: { reply?: boolean; from?: string } = {}) => {
    const from = opts.from ?? data.userId
    const msg: Message = { id: `m${Date.now()}${Math.random()}`, from, to, text, at: Date.now() }
    update((d) => ({ ...d, messages: [...d.messages, msg] }))
    // Marta is the main character: in the demo she answers herself, so no automatic replies from her.
    if (opts.reply === false || to === 'marta') return
    const already = data.messages.filter((m) => m.from === to && m.to === from).length
    const list = cannedReplies[to] ?? cannedReplies.default
    const reply = list[Math.min(already, list.length - 1)]
    timers.current.push(window.setTimeout(() => setTyping({ from: to, to: from }), 700))
    timers.current.push(
      window.setTimeout(() => {
        setTyping(null)
        update((d) => ({ ...d, messages: [...d.messages, { id: `m${Date.now()}r`, from: to, to: from, text: reply, at: Date.now() }] }))
      }, 2300),
    )
  }

  /** Make someone else type and send a message (used by the demo). */
  const receiveMessage = (from: string, to: string, text: string, delay = 1200) => {
    setTyping({ from, to })
    timers.current.push(
      window.setTimeout(() => {
        setTyping(null)
        update((d) => ({ ...d, messages: [...d.messages, { id: `m${Date.now()}x`, from, to, text, at: Date.now() }] }))
      }, delay),
    )
  }

  // ---- reset ----
  const reset = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setTyping(null)
    const lang = data.lang
    setData({ ...initialData(), lang })
  }

  return {
    data,
    update,
    t,
    lang: data.lang,
    setLang: (lang: Lang) => update((d) => ({ ...d, lang })),
    me,
    userId: data.userId,
    switchUser: (id: string) => update((d) => ({ ...d, userId: id })),
    people,
    personById,
    works: allWorks,
    bioOf,
    typing,
    connectionWith,
    connect,
    accept,
    decline,
    sendMessage,
    receiveMessage,
    reset,
    signUp: (id: string) => update((d) => ({ ...d, signedUp: { ...d.signedUp, [id]: true } })),
    importPortfolio: (id: string, bio: string) =>
      update((d) => ({ ...d, imported: { ...d.imported, [id]: true }, signedUp: { ...d.signedUp, [id]: true }, bios: { ...d.bios, [id]: bio } })),
    setBio: (id: string, bio: string) => update((d) => ({ ...d, bios: { ...d.bios, [id]: bio } })),
    addWork: (w: Work) => update((d) => ({ ...d, userWorks: [w, ...d.userWorks] })),
    addPost: (p: Post) => update((d) => ({ ...d, posts: [p, ...d.posts] })),
    addCall: (c: ProjectCall) => update((d) => ({ ...d, calls: [c, ...d.calls] })),
    respondToCall: (callId: string, text: string) =>
      update((d) => ({
        ...d,
        calls: d.calls.map((c) => (c.id === callId ? { ...c, responses: [...c.responses, { personId: d.userId, text }] } : c)),
      })),
    addOpportunity: (o: Opportunity) => update((d) => ({ ...d, opportunities: [o, ...d.opportunities] })),
    recommend: (workId: string) => update((d) => ({ ...d, recommendations: { ...d.recommendations, [workId]: d.userId } })),
    createShortlist: (name: string) => {
      const id = `sl-${Date.now()}`
      update((d) => ({ ...d, shortlists: [...d.shortlists, { id, ownerId: d.userId, name, items: [] }] }))
      return id
    },
    saveToShortlist: (listId: string, item: { kind: 'person' | 'work'; id: string }) =>
      update((d) => ({
        ...d,
        shortlists: d.shortlists.map((l) =>
          l.id === listId && !l.items.some((i) => i.kind === item.kind && i.id === item.id) ? { ...l, items: [...l.items, item] } : l,
        ),
      })),
  }
}

export type App = ReturnType<typeof useAppState>

const Ctx = createContext<App | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const app = useAppState()
  return <Ctx.Provider value={app}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used inside AppProvider')
  return v
}
