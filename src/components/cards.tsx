// Grids and cards used on several pages.
import { Location01Icon, Megaphone01Icon } from '@hugeicons/core-free-icons'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { pictureSrc } from '../art/generateArt'
import type { Person, ProjectCall, Work } from '../data/types'
import { lowPower, reducedMotion, rememberRect } from '../motion/motion'
import { useApp } from '../state/AppContext'
import Masonry from './reactbits/Masonry'
import { Avatar, Button, CheckedBadge, Icon, Pic, Sheet, Tag, UniBadge, toast, useAgo } from './ui'

/** Image-first masonry of works (React Bits Masonry). Clicking a work opens its museum page. */
export function WorkGrid({ works, columnWidth = 220, showOwner = true }: { works: Work[]; columnWidth?: number; showOwner?: boolean }) {
  const { personById, t } = useApp()
  const navigate = useNavigate()
  const box = useRef<HTMLDivElement>(null)
  const [narrow, setNarrow] = useState(() => window.innerWidth < 640)
  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < 640)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const items = works.map((w) => {
    const { src, ratio } = pictureSrc(w.picture)
    const owner = personById(w.ownerId)
    return {
      id: w.id,
      img: src,
      width: 600,
      height: Math.round(600 / ratio),
      title: w.title,
      description: showOwner ? `${owner?.name ?? ''} · ${w.year}` : `${w.technique}, ${w.year}`,
      alt: `${w.title}, ${owner?.name ?? ''}`,
    }
  })

  // Add demo hooks and the "Recommended" mark onto the tiles Masonry renders.
  useEffect(() => {
    const id = window.setTimeout(() => {
      works.forEach((w) => {
        const tile = box.current?.querySelector<HTMLElement>(`[data-id="${w.id}"] > button`)
        if (!tile) return
        tile.dataset.demo = `work-${w.id}`
        if (w.recommendedBy && !tile.querySelector('.rec-mark')) {
          const mark = document.createElement('span')
          mark.className = 'rec-mark pointer-events-none absolute top-2 left-2 z-10 inline-flex items-center gap-1 rounded-full bg-paper/95 px-2 py-1 text-xs font-medium text-ink shadow-sm'
          mark.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-red)" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"/></svg>${t('badge.recommended')}`
          tile.appendChild(mark)
        }
      })
    }, 60)
    return () => window.clearTimeout(id)
  }, [works, t])

  return (
    <div ref={box}>
      <Masonry
        items={items}
        columnWidth={narrow ? 150 : columnWidth}
        gap={12}
        radius={4}
        animateFrom={reducedMotion() ? 'none' : 'bottom'}
        stagger={0.04}
        duration={0.5}
        bounce={0}
        blurToFocus={false}
        hoverEffect={lowPower() ? 'none' : 'lift'}
        captions="hover"
        lightbox={false}
        draggable={false}
        onItemClick={(item, _i, e) => {
          rememberRect(String(item.id), e.currentTarget.querySelector('img'))
          navigate(`/work/${item.id}`)
        }}
      />
    </div>
  )
}

export function PersonLine({ person, sub }: { person: Person; sub?: string }) {
  const { t } = useApp()
  return (
    <Link to={`/profile/${person.id}`} className="flex min-w-0 items-center gap-3">
      <Avatar person={person} size={40} />
      <span className="min-w-0 leading-tight">
        <span className="flex items-center gap-1.5 font-semibold">
          <span className="truncate">{person.name}</span>
          {person.checked && <CheckedBadge compact />}
          {person.uniConfirmed && <UniBadge compact />}
        </span>
        <span className="block truncate text-sm text-thread">{sub ?? `${person.programme ?? t(`role.${person.role}`)}`}</span>
      </span>
    </Link>
  )
}

/** A person shown through their work: three images, then name. */
export function PersonCard({ person }: { person: Person }) {
  const { works, t } = useApp()
  const own = works.filter((w) => w.ownerId === person.id).slice(0, 3)
  return (
    <article data-reveal className="rounded-[var(--radius-ui)] bg-paper p-3" data-demo={`person-${person.id}`}>
      <Link to={`/profile/${person.id}`} className="block">
        {own.length > 0 ? (
          <div className="mb-3 grid grid-cols-3 gap-1.5">
            {own.map((w) => (
              <Pic key={w.id} picture={{ ...('art' in w.picture ? { art: { ...w.picture.art, ratio: 1 } } : { ...w.picture, ratio: 1 }) }} alt={w.title} />
            ))}
          </div>
        ) : null}
      </Link>
      <PersonLine person={person} sub={[person.programme, person.year ? `${person.year}${ordinal(person.year)} ${t('profile.year')}` : null].filter(Boolean).join(' · ')} />
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-thread">
        <span className="inline-flex items-center gap-1"><Icon icon={Location01Icon} size={14} />{person.area}</span>
        {person.openToCollab && <span>{t('badge.collab')}</span>}
        {person.openToCommissions && <span>{t('badge.commissions')}</span>}
      </div>
    </article>
  )
}

export const ordinal = (n: number) => (n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th')

export function CallCard({ call }: { call: ProjectCall }) {
  const { t, personById, respondToCall, userId, me } = useApp()
  const ago = useAgo()
  const navigate = useNavigate()
  const author = personById(call.authorId)!
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const responded = call.responses.some((r) => r.personId === userId)
  const mine = call.authorId === userId
  return (
    <article data-reveal className="rounded-[var(--radius-ui)] bg-paper p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <PersonLine person={author} sub={`${call.area} · ${ago(call.ago)}`} />
      </div>
      <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-medium text-red">
        <Icon icon={Megaphone01Icon} size={15} /> {t('calls.lookingFor')} {call.lookingFor}
      </p>
      <h3 className="text-lg leading-snug font-semibold">{call.title}</h3>
      <p className="mt-1 text-[15px] leading-relaxed text-ink/80">{call.description}</p>
      {call.picture && <Pic picture={call.picture} alt="" className="mt-3 max-h-64" />}
      <div className="mt-3 flex flex-wrap gap-1.5">{call.tags.map((tg) => <Tag key={tg}>{tg}</Tag>)}</div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-sm text-thread">{t('calls.responses', { n: call.responses.length })}</span>
        {!mine &&
          (me.role === 'provider' ? (
            <Button onClick={() => navigate(`/messages/${author.id}`)}>{t('calls.contact')}</Button>
          ) : (
            <Button onClick={() => setOpen(true)} disabled={responded}>{responded ? t('calls.responded') : t('calls.respond')}</Button>
          ))}
      </div>
      <Sheet open={open} onClose={() => setOpen(false)} title={call.title}>
        <label className="mb-2 block text-sm font-medium" htmlFor={`r-${call.id}`}>{t('calls.responsePlaceholder')}</label>
        <textarea id={`r-${call.id}`} value={text} onChange={(e) => setText(e.target.value)} rows={4} className="w-full rounded-[var(--radius-ui)] border border-linen-deep bg-paper p-3 text-base" />
        <Button
          variant="primary"
          className="mt-3 w-full"
          disabled={!text.trim()}
          onClick={() => {
            respondToCall(call.id, text.trim())
            setOpen(false)
            toast(t('calls.responded'))
          }}
        >
          {t('calls.send')}
        </Button>
      </Sheet>
    </article>
  )
}

/** Sheet for opportunity providers to save a work or a person to a named shortlist. */
export function ShortlistSheet({ open, onClose, items }: { open: boolean; onClose: () => void; items: { kind: 'person' | 'work'; id: string }[] }) {
  const { t, data, userId, saveToShortlist, createShortlist } = useApp()
  const [name, setName] = useState('')
  const lists = data.shortlists.filter((l) => l.ownerId === userId)
  const save = (id: string, listName: string) => {
    items.forEach((i) => saveToShortlist(id, i))
    onClose()
    toast(t('shortlist.savedTo', { name: listName }))
  }
  return (
    <Sheet open={open} onClose={onClose} title={t('shortlist.choose')}>
      <div className="grid gap-2">
        {lists.map((l) => (
          <button key={l.id} onClick={() => save(l.id, l.name)} data-demo={l.id === 'sl-spring' ? 'list-spring' : undefined} className="flex items-center justify-between rounded-[var(--radius-ui)] bg-paper p-4 text-left hover:bg-linen-deep">
            <span className="font-semibold">{l.name}</span>
            <span className="text-sm text-thread">{t('shortlist.items', { n: l.items.length })}</span>
          </button>
        ))}
      </div>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (!name.trim()) return
          const id = createShortlist(name.trim())
          save(id, name.trim())
          setName('')
        }}
      >
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('shortlist.name')} aria-label={t('shortlist.name')} className="min-w-0 flex-1 rounded-full border border-linen-deep bg-paper px-4 text-base" />
        <Button type="submit">{t('shortlist.create')}</Button>
      </form>
    </Sheet>
  )
}
