// A project as a small museum room: the work, its wall label, then the story in blocks.
import { ArrowLeft01Icon, Bookmark01Icon, Message01Icon, PauseIcon, PlayIcon, StarIcon } from '@hugeicons/core-free-icons'
import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { CallCard, PersonLine, ShortlistSheet } from '../components/cards'
import { Thread } from '../components/Maze'
import { Button, Icon, Pic, RecommendedMark, toast } from '../components/ui'
import type { Block, Picture, Work } from '../data/types'
import { DUR, EASE, gsap, reducedMotion, scrollToTop, takeRect, useReveal } from '../motion/motion'
import { useApp } from '../state/AppContext'
import { ConnectButton } from './Profile'

function embedUrl(url: string) {
  const yt = url.match(/(?:youtu\.be\/|v=)([\w-]{6,})/)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`
  return null
}

/** Making-of player. Sample data plays a short generated animation instead of a real video. */
function MakingOf({ block }: { block: Extract<Block, { type: 'video' }> }) {
  const { t } = useApp()
  const [playing, setPlaying] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const [time, setTime] = useState(0)

  useEffect(() => {
    if (!stage.current) return
    const layers = stage.current.querySelectorAll('[data-layer]')
    const bar = stage.current.querySelector('[data-bar]')
    tl.current = gsap
      .timeline({ paused: true, repeat: -1, onUpdate: () => setTime(tl.current?.time() ?? 0) })
      .fromTo(layers[0], { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 3, ease: 'none' })
      .fromTo(layers[1], { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 2, ease: 'power1.out' })
      .to({}, { duration: 1 })
      .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 6, ease: 'none' }, 0)
    return () => { tl.current?.kill() }
  }, [])

  useEffect(() => {
    if (!tl.current) return
    if (playing && !reducedMotion()) tl.current.play()
    else tl.current.pause()
  }, [playing])

  if (block.url && embedUrl(block.url)) {
    return <iframe src={embedUrl(block.url)!} title={block.caption} className="aspect-video w-full rounded-[var(--radius-work)]" allow="fullscreen; picture-in-picture" />
  }
  if (block.file) {
    return <video src={block.file} controls className="aspect-video w-full rounded-[var(--radius-work)] bg-ink" />
  }
  const poster = block.poster
  const sketch: Picture = 'art' in poster ? { art: { style: 'sketch', seed: poster.art.seed + 1, ratio: 16 / 9 } } : poster
  return (
    <figure>
      <div ref={stage} className="relative aspect-video overflow-hidden rounded-[var(--radius-work)] bg-ink">
        <div data-layer className="absolute inset-0"><Pic picture={sketch} alt="" rounded={false} className="h-full" /></div>
        <div data-layer className="absolute inset-0 opacity-0"><Pic picture={poster} alt="" rounded={false} className="h-full" /></div>
        {!playing && <div className="absolute inset-0"><Pic picture={poster} alt={block.caption} rounded={false} className="h-full" /></div>}
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-ink/70 to-transparent p-3 text-linen">
          <button onClick={() => setPlaying((p) => !p)} className="grid h-11 w-11 place-items-center rounded-full bg-paper text-ink" aria-label={playing ? t('work.pause') : t('work.play')}>
            <Icon icon={playing ? PauseIcon : PlayIcon} size={20} />
          </button>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-linen/30"><div data-bar className="h-full origin-left scale-x-0 bg-linen" /></div>
          <span className="text-xs tabular-nums">0:{String(Math.floor(time * 16)).padStart(2, '0')}</span>
        </div>
      </div>
      <figcaption className="mt-2 text-sm text-thread">{block.caption} · {t('work.videoNote')}</figcaption>
    </figure>
  )
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'text':
      return (
        <section data-reveal>
          <h2 className="mb-2 text-lg font-semibold">{block.title}</h2>
          <p className="max-w-[62ch] text-[17px] leading-[1.7]">{block.body}</p>
        </section>
      )
    case 'process':
      return (
        <section>
          <h2 data-reveal className="mb-4 text-lg font-semibold">{block.title}</h2>
          <ol className="grid gap-6 sm:grid-cols-2">
            {block.steps.map((s, i) => (
              <li key={i} data-reveal className="grid grid-cols-[auto_1fr] gap-3">
                <span className="font-display text-2xl text-red" aria-hidden="true">{i + 1}</span>
                <figure>
                  <Pic picture={s.picture} alt={s.note} />
                  <figcaption className="mt-2 text-[15px] leading-snug">{s.note}</figcaption>
                </figure>
              </li>
            ))}
          </ol>
        </section>
      )
    case 'video':
      return (
        <section data-reveal>
          <h2 className="mb-3 text-lg font-semibold">{block.title}</h2>
          <MakingOf block={block} />
        </section>
      )
    case 'gallery':
      return (
        <section>
          <h2 data-reveal className="mb-3 text-lg font-semibold">{block.title}</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{block.pictures.map((p, i) => <div key={i} data-reveal><Pic picture={p} alt="" /></div>)}</div>
        </section>
      )
    case 'quote':
      return (
        <figure data-reveal className="border-l-2 border-red pl-4">
          <blockquote className="max-w-[48ch] text-xl leading-snug">“{block.text}”</blockquote>
          <figcaption className="mt-2 text-sm text-thread">{block.by}</figcaption>
        </figure>
      )
    case 'list':
      return (
        <section data-reveal>
          <h2 className="mb-2 text-lg font-semibold">{block.title}</h2>
          <ul className="grid gap-1 text-[15px]">{block.items.map((it) => <li key={it} className="border-b border-linen-deep py-1.5">{it}</li>)}</ul>
        </section>
      )
  }
}

/** The wall label next to a work in a museum. */
function Label({ work }: { work: Work }) {
  const { t, personById } = useApp()
  const owner = personById(work.ownerId)!
  const rows: [string, string | undefined][] = [
    [t('work.label.technique'), work.technique],
    [t('work.label.dimensions'), work.dimensions],
    [t('work.label.edition'), work.edition],
    [t('work.label.exhibited'), work.exhibited],
  ]
  return (
    <div className="rounded-[var(--radius-work)] bg-paper p-5 shadow-[0_1px_0_var(--color-linen-deep)]">
      <p className="font-semibold">{owner.name}</p>
      <h1 className="mt-1 text-2xl leading-tight font-semibold tracking-tight md:text-3xl">{work.title}, <span className="font-normal">{work.year}</span></h1>
      <dl className="mt-4 grid gap-2 text-sm">
        {rows.filter(([, v]) => v).map(([k, v]) => (
          <div key={k} className="grid grid-cols-[110px_1fr] gap-2">
            <dt className="text-thread">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      {work.recommendedBy && <div className="mt-4"><RecommendedMark by={work.recommendedBy} /></div>}
    </div>
  )
}

export default function WorkPage() {
  const { id = '' } = useParams()
  const { t, works, personById, me, data, recommend } = useApp()
  const navigate = useNavigate()
  const hero = useRef<HTMLDivElement>(null)
  const [saving, setSaving] = useState(false)
  const ref = useReveal<HTMLDivElement>([id])
  const work = works.find((w) => w.id === id)

  // Expand the image from where it was in the grid (manual FLIP).
  useEffect(() => {
    scrollToTop()
    const from = takeRect(id)
    if (!hero.current || reducedMotion()) return
    if (from) {
      const to = hero.current.getBoundingClientRect()
      gsap.from(hero.current, {
        x: from.left - to.left, y: from.top - to.top, scaleX: from.width / to.width, scaleY: from.height / to.height,
        transformOrigin: 'top left', duration: DUR.expand, ease: EASE, clearProps: 'transform',
      })
    } else gsap.from(hero.current, { opacity: 0, y: 16, duration: DUR.page, ease: EASE })
  }, [id])

  if (!work) return <Navigate to="/" replace />
  const owner = personById(work.ownerId)!
  const ownerCalls = data.calls.filter((c) => c.authorId === owner.id)
  const more = works.filter((w) => w.ownerId === owner.id && w.id !== work.id).slice(0, 4)
  const isMine = owner.id === me.id

  return (
    <div className="min-h-dvh bg-linen">
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 bg-linen/90 px-4 py-2.5 backdrop-blur md:px-8">
        <button onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))} className="-ml-2 inline-flex h-11 items-center gap-1 rounded-full pr-3 pl-2 text-sm font-medium hover:bg-linen-deep">
          <Icon icon={ArrowLeft01Icon} /> {t('work.close')}
        </button>
        <div className="flex items-center gap-2">
          {me.role === 'provider' && (
            <Button variant="primary" data-demo="save-shortlist" onClick={() => setSaving(true)}>
              <Icon icon={Bookmark01Icon} size={19} /> {t('profile.saveToList')}
            </Button>
          )}
          {me.role === 'teacher' && !isMine && (
            <Button
              variant={work.recommendedBy === me.id ? 'secondary' : 'primary'}
              disabled={work.recommendedBy === me.id}
              onClick={() => { recommend(work.id); toast(t('work.recommended')) }}
            >
              <Icon icon={StarIcon} size={19} /> {work.recommendedBy === me.id ? t('work.recommended') : t('work.recommend')}
            </Button>
          )}
        </div>
      </header>

      <div ref={ref} className="mx-auto max-w-6xl px-4 pb-24 md:px-8">
        {/* The work, on its wall */}
        <div className="grid place-items-center bg-paper px-3 py-8 md:py-14">
          <div ref={hero} className="w-full max-w-[min(100%,calc(78dvh*var(--r)))]" style={{ ['--r' as string]: 'art' in work.picture ? work.picture.art.ratio : work.picture.ratio }}>
            <Pic picture={work.picture} alt={`${work.title} by ${owner.name}`} className="shadow-[0_30px_60px_-30px_rgba(31,27,24,0.45)]" />
          </div>
        </div>

        <div className="mt-8 grid gap-10 md:grid-cols-[320px_minmax(0,1fr)] md:gap-14">
          <aside className="md:sticky md:top-20 md:self-start">
            <Label work={work} />
            <div className="mt-5 flex items-center justify-between gap-3">
              <PersonLine person={owner} />
            </div>
            {!isMine && (
              <div className="mt-4 flex flex-wrap gap-2">
                {owner.role !== 'provider' && <ConnectButton personId={owner.id} />}
                <Button onClick={() => navigate(`/messages/${owner.id}`)}><Icon icon={Message01Icon} size={19} />{t('profile.message')}</Button>
              </div>
            )}
          </aside>

          <div className="grid min-w-0 gap-12">
            {work.blocks.map((b, i) => <BlockView key={i} block={b} />)}
            {ownerCalls.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-semibold">{t('profile.calls.student')}</h2>
                <div className="grid gap-4">{ownerCalls.map((c) => <CallCard key={c.id} call={c} />)}</div>
              </section>
            )}
          </div>
        </div>

        {more.length > 0 && (
          <>
            <Thread className="my-12" />
            <section>
              <h2 className="mb-4 text-lg font-semibold">{t('work.more')} {owner.name}</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {more.map((w) => (
                  <Link key={w.id} to={`/work/${w.id}`} className="block">
                    <Pic picture={'art' in w.picture ? { art: { ...w.picture.art, ratio: 0.85 } } : w.picture} alt={w.title} />
                    <p className="mt-1.5 truncate text-sm font-medium">{w.title}</p>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
      <ShortlistSheet open={saving} onClose={() => setSaving(false)} items={[{ kind: 'work', id: work.id }, { kind: 'person', id: owner.id }]} />
    </div>
  )
}
