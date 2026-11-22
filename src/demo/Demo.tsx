/*
  Guided pitch demo. Each step: a caption, a page to open, an element to highlight (data-demo="…"),
  and what to do automatically if the presenter presses "Next" without clicking.
  Edit the captions in STEPS below.
*/
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Icon } from '../components/ui'
import { DUR, EASE, gsap, reducedMotion, scrollToEl } from '../motion/motion'
import { useApp, type App } from '../state/AppContext'

/** The logo works both at the site root and under /hypha/ on GitHub Pages. */
const LOGO = `${import.meta.env.BASE_URL}logo.jpg`

type Go = (path: string) => void

interface Step {
  part: number
  en: string
  pt: string
  spot?: string
  enter: (app: App, go: Go) => void
  complete?: (app: App) => void
}

export const DEMO_CALL = {
  title: 'Looking for someone from Industrial Design for a light installation',
  description: 'For my graduation show I want to light my bronze group The Mature Age from inside. I need someone who can build a light-and-metal structure with me, and ideas for a venue.',
}
export const MARTA_NOTE = 'Hi Louis! I am preparing a light installation for my graduation show and I need someone who can build a metal structure with light inside. Would you like to see the project?'
export const TIAGO_REPLY = 'Hi Camille! Your bronze is beautiful. A metal frame with warm light inside it — I can do that, glass too if you want. Coffee at the workshop on Thursday?'
export const FIO_MESSAGE = 'Hi Camille, Prof. Rodin’s recommendation brought us to “The Mature Age”. We would like you in our spring group show in Marvila. Can we visit your studio next week?'

const STEPS: Step[] = [
  {
    part: 0,
    en: 'Meet Camille Claudel, third-year Sculpture student at FBAUL. Her graduation show is coming, and she needs a collaborator and a venue.',
    pt: 'Conhece a Camille Claudel, estudante do 3.º ano de Escultura na FBAUL. A exposição final está a chegar e precisa de um colaborador e de um espaço.',
    enter: (app, go) => { app.reset(); app.switchUser('marta'); go('/welcome') },
  },
  {
    part: 1,
    en: 'Camille signs up with her university email. Her portfolio is already on Instagram, so she imports it in one click.',
    pt: 'A Camille regista-se com o email da universidade. O portfólio já está no Instagram, por isso importa-o com um clique.',
    spot: 'import-ig',
    enter: (_app, go) => go('/welcome?step=portfolio'),
  },
  {
    part: 1,
    en: 'HYPHA groups her photos into projects and writes a draft bio she can edit.',
    pt: 'A HYPHA agrupa as fotos em projetos e escreve uma bio provisória que ela pode editar.',
    spot: 'import-save',
    enter: (app, go) => { if (!app.data.imported.marta) go('/import/instagram') },
    complete: (app) => { if (!app.data.imported.marta) app.importPortfolio('marta', app.personById('marta')!.bio) },
  },
  {
    part: 1,
    en: 'Each work is a small museum room: label, text, process and making-of. Prof. Rodin has recommended one of them.',
    pt: 'Cada trabalho é uma pequena sala de museu: legenda, texto, processo e making-of. A Prof. Rodin recomendou um deles.',
    spot: 'portfolio',
    enter: (_app, go) => go('/me'),
  },
  {
    part: 2,
    en: 'She posts a project call: she needs someone from Industrial Design for the light structure.',
    pt: 'Publica uma chamada de projeto: precisa de alguém de Design Industrial para a estrutura de luz.',
    spot: 'publish-call',
    enter: (_app, go) => go('/calls/new?demo=1'),
    complete: (app) => {
      if (!app.data.calls.some((c) => c.id === 'c-demo')) {
        app.addCall({ id: 'c-demo', authorId: 'marta', title: DEMO_CALL.title, lookingFor: 'Industrial Design', description: DEMO_CALL.description, tags: ['Light', 'Metal', 'Graduation show'], area: 'Penha de França', ago: 0, responses: [] })
      }
    },
  },
  {
    part: 3,
    en: 'In Discover she filters by Industrial Design and metal, and finds Louis.',
    pt: 'Em Descobrir filtra por Design Industrial e metal, e encontra o Louis.',
    spot: 'person-tiago',
    enter: (_app, go) => go('/discover?discipline=Industrial%20Design&material=Metal'),
  },
  {
    part: 4,
    en: 'She looks at his work and sends a connection request.',
    pt: 'Vê o trabalho dele e envia um pedido de ligação.',
    spot: 'connect',
    enter: (_app, go) => go('/profile/tiago'),
    complete: (app) => {
      if (!app.connectionWith('marta', 'tiago')) app.connect('tiago')
      if (!app.data.messages.some((m) => m.from === 'marta' && m.to === 'tiago')) app.sendMessage('tiago', MARTA_NOTE, { reply: false })
    },
  },
  {
    part: 4,
    en: 'Now we are Louis. He sees Camille’s request and accepts.',
    pt: 'Agora somos o Louis. Ele vê o pedido da Camille e aceita.',
    spot: 'accept-marta',
    enter: (app, go) => { app.switchUser('tiago'); go('/messages') },
    complete: (app) => app.accept('marta'),
  },
  {
    part: 4,
    en: 'He replies in the chat. The collaboration starts.',
    pt: 'Responde no chat. A colaboração começa.',
    spot: 'send',
    enter: (_app, go) => go(`/messages/marta?draft=${encodeURIComponent(TIAGO_REPLY)}`),
    complete: (app) => {
      if (!app.data.messages.some((m) => m.from === 'tiago' && m.to === 'marta')) app.sendMessage('marta', TIAGO_REPLY, { reply: false })
    },
  },
  {
    part: 5,
    en: 'Now we are Galeria Fio in Marvila, looking for artists for a group show. They search talent recommended by teachers.',
    pt: 'Agora somos a Galeria Fio, em Marvila, à procura de artistas para uma exposição coletiva. Procuram talento recomendado por professores.',
    spot: 'work-marta-trace',
    enter: (app, go) => { app.switchUser('fio'); go('/talent?recommended=1') },
  },
  {
    part: 5,
    en: 'They open Camille’s work, see her project call, and save her to the “Spring group show” shortlist.',
    pt: 'Abrem o trabalho da Camille, veem a chamada de projeto e guardam-na na lista “Spring group show”.',
    spot: 'save-shortlist',
    enter: (_app, go) => go('/work/marta-trace'),
  },
  {
    part: 5,
    en: 'They pick the “Spring group show” shortlist.',
    pt: 'Escolhem a lista “Spring group show”.',
    spot: 'list-spring',
    enter: () => {},
    complete: (app) => {
      app.saveToShortlist('sl-spring', { kind: 'work', id: 'marta-trace' })
      app.saveToShortlist('sl-spring', { kind: 'person', id: 'marta' })
    },
  },
  {
    part: 5,
    en: 'And they write to her.',
    pt: 'E escrevem-lhe.',
    spot: 'send',
    enter: (_app, go) => go(`/messages/marta?draft=${encodeURIComponent(FIO_MESSAGE)}`),
    complete: (app) => {
      if (!app.data.messages.some((m) => m.from === 'fio' && m.to === 'marta')) app.sendMessage('marta', FIO_MESSAGE, { reply: false })
    },
  },
  {
    part: 6,
    en: 'Back to Camille: a collaborator and a gallery, before graduation.',
    pt: 'De volta à Camille: um colaborador e uma galeria, antes de acabar o curso.',
    enter: (app, go) => { app.switchUser('marta'); go('/messages/fio') },
  },
]

const PARTS = 6

interface DemoApi {
  active: boolean
  start: () => void
  stop: () => void
  spot?: string
}

const DemoCtx = createContext<DemoApi>({ active: false, start: () => {}, stop: () => {} })
export const useDemo = () => useContext(DemoCtx)

export function DemoProvider({ children }: { children: ReactNode }) {
  const app = useApp()
  const navigate = useNavigate()
  // The current step survives a page refresh during the pitch.
  const [index, setIndex] = useState<number | null>(() => {
    try {
      const v = sessionStorage.getItem('hypha-demo-step')
      return v === null ? null : Number(v)
    } catch { return null }
  })
  useEffect(() => {
    try {
      if (index === null) sessionStorage.removeItem('hypha-demo-step')
      else sessionStorage.setItem('hypha-demo-step', String(index))
    } catch { /* ignore */ }
  }, [index])
  const [ended, setEnded] = useState(false)
  const appRef = useRef(app)
  appRef.current = app

  const enter = useCallback((i: number) => {
    setIndex(i)
    STEPS[i].enter(appRef.current, (p) => navigate(p))
  }, [navigate])

  const start = () => { setEnded(false); enter(0) }
  const stop = () => { setIndex(null); setEnded(false) }

  const next = () => {
    if (index === null) return
    STEPS[index].complete?.(appRef.current)
    if (index === STEPS.length - 1) { setIndex(null); setEnded(true); return }
    // let state settle (e.g. a new message) before the next page opens
    window.setTimeout(() => enter(index + 1), 60)
  }
  const back = () => index !== null && index > 0 && enter(index - 1)

  const step = index !== null ? STEPS[index] : undefined
  const spot = step?.spot

  // Highlight the element the presenter should press.
  useEffect(() => {
    if (!spot) return
    let found: Element | null = null
    const id = window.setInterval(() => {
      const el = document.querySelector(`[data-demo="${spot}"]`)
      if (el && el !== found) {
        found?.classList.remove('demo-spot')
        el.classList.add('demo-spot')
        if (spot !== 'send' && !el.closest('header, nav, [role="dialog"]')) scrollToEl(el as HTMLElement)
        found = el
      }
    }, 250)
    return () => {
      window.clearInterval(id)
      document.querySelectorAll('.demo-spot').forEach((e) => e.classList.remove('demo-spot'))
    }
  }, [spot, index])

  // When the presenter clicks the highlighted element, move on by itself.
  const nextRef = useRef(next)
  nextRef.current = next
  useEffect(() => {
    if (!spot || index === null) return
    const navigates = spot === 'import-ig' || spot === 'save-shortlist' || spot.startsWith('work-') || spot.startsWith('person-')
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest(`[data-demo="${spot}"]`)) window.setTimeout(() => nextRef.current(), navigates ? 80 : 1300)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [spot, index])

  // Extra room at the bottom so highlighted elements can scroll above the guide card.
  useEffect(() => {
    document.body.style.paddingBottom = index !== null && spot !== 'send' ? '42vh' : ''
  }, [index, spot])

  const card = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (card.current && !reducedMotion()) gsap.fromTo(card.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.micro + 0.1, ease: EASE })
  }, [index])

  return (
    <DemoCtx.Provider value={{ active: index !== null, start, stop, spot }}>
      {children}
      {step && index !== null && (
        <div className={`pointer-events-none fixed inset-x-0 z-[45] flex justify-center px-3 md:left-[240px] ${spot === 'send' ? 'top-16 md:top-6' : 'bottom-[76px] md:bottom-6'}`}>
          <div ref={card} className="pointer-events-auto w-full max-w-md rounded-[18px] bg-ink p-4 text-linen shadow-2xl" role="region" aria-label="Demo guide" aria-live="polite">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5" aria-label={`Part ${Math.max(1, step.part)} of ${PARTS}`}>
                {Array.from({ length: PARTS }, (_, i) => (
                  <span key={i} className={`h-1.5 rounded-full transition-all ${i < step.part ? 'w-5 bg-red' : 'w-1.5 bg-linen/30'}`} />
                ))}
              </div>
              <button onClick={stop} className="-m-2 grid h-9 w-9 place-items-center rounded-full text-linen/70 hover:text-linen" aria-label={app.t('demo.exit')}>
                <Icon icon={Cancel01Icon} size={18} />
              </button>
            </div>
            <p className="text-[15px] leading-snug">{app.lang === 'pt' ? step.pt : step.en}</p>
            <div className="mt-3 flex justify-between gap-2">
              <button onClick={back} disabled={index === 0} className="rounded-full px-3 py-2 text-sm text-linen/70 hover:text-linen disabled:opacity-30">
                {app.t('demo.back')}
              </button>
              <button onClick={next} className="rounded-full bg-red px-5 py-2 text-sm font-semibold text-paper hover:bg-red-deep">
                {index === STEPS.length - 1 ? app.t('demo.finish') : app.t('demo.next')}
              </button>
            </div>
          </div>
        </div>
      )}
      {ended && <DemoEnd onClose={() => setEnded(false)} />}
    </DemoCtx.Provider>
  )
}

function DemoEnd({ onClose }: { onClose: () => void }) {
  const { lang } = useApp()
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current && !reducedMotion()) gsap.from(ref.current.children, { opacity: 0, y: 20, duration: 0.6, stagger: 0.15, ease: EASE })
  }, [])
  return (
    <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-linen px-6 text-center" role="dialog" aria-modal="true">
      <div ref={ref} className="flex max-w-md flex-col items-center gap-6">
        <img src={LOGO} alt="HYPHA logo" className="w-48 rounded-[var(--radius-work)] md:w-60" />
        <p className="font-display text-4xl text-ink md:text-5xl">
          {lang === 'pt' ? 'De estudante a rede, antes de acabar o curso.' : 'From student to network, before graduation.'}
        </p>
        <button onClick={onClose} className="rounded-full border border-linen-deep bg-paper px-5 py-2.5 text-sm font-semibold">
          {lang === 'pt' ? 'Fechar' : 'Close'}
        </button>
      </div>
    </div>
  )
}
