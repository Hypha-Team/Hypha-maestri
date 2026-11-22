// Opportunity board: open calls, commissions and exhibition slots from checked places.
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { PersonLine } from '../components/cards'
import { DISCIPLINES } from '../components/Filters'
import { Button, Chip, Pic, Tag, toast } from '../components/ui'
import type { Discipline, OpportunityKind } from '../data/types'
import { useReveal } from '../motion/motion'
import { useApp } from '../state/AppContext'
import { DiscoverTabs } from './Discover'
import { samplePictures } from '../data/commons'

const KINDS: OpportunityKind[] = ['open-call', 'commission', 'exhibition']

export function OpportunitiesPage() {
  const { t, data, personById, me } = useApp()
  const navigate = useNavigate()
  const [kind, setKind] = useState<OpportunityKind | ''>('')
  const list = data.opportunities.filter((o) => !kind || o.kind === kind)
  const ref = useReveal<HTMLDivElement>([kind, data.opportunities.length])
  return (
    <div ref={ref}>
      {me.role !== 'provider' && <DiscoverTabs />}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{t('opp.title')}</h1>
          <p className="mt-1 max-w-[56ch] text-thread">{t('opp.body')}</p>
        </div>
        {me.role === 'provider' && <Button variant="primary" onClick={() => navigate('/opportunities/new')}>{t('opp.new')}</Button>}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Chip active={!kind} onClick={() => setKind('')}>{t('common.all')}</Chip>
        {KINDS.map((k) => <Chip key={k} active={kind === k} onClick={() => setKind(kind === k ? '' : k)}>{t(`opp.kind.${k}`)}</Chip>)}
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((o) => {
          const p = personById(o.providerId)!
          return (
            <article key={o.id} data-reveal className="flex flex-col rounded-[var(--radius-ui)] bg-paper p-3">
              <Pic picture={o.picture} alt="" />
              <p className="mt-3 text-xs font-medium text-red">{t(`opp.kind.${o.kind}`)}</p>
              <h2 className="text-lg leading-snug font-semibold">{o.title}</h2>
              <p className="mt-1 text-[15px] leading-relaxed text-ink/80">{o.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">{o.disciplines.map((d) => <Tag key={d}>{d}</Tag>)}</div>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div><dt className="text-thread">{t('opp.deadline')}</dt><dd className="font-medium">{o.deadline}</dd></div>
                {o.fee && <div><dt className="text-thread">{t('opp.fee')}</dt><dd className="font-medium">{o.fee}</dd></div>}
              </dl>
              <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                <PersonLine person={p} sub={o.area} />
                {me.role !== 'provider' && <Button onClick={() => navigate(`/messages/${p.id}`)} className="shrink-0">{t('opp.apply')}</Button>}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

export function NewOpportunity() {
  const { t, addOpportunity, me } = useApp()
  const navigate = useNavigate()
  const [kind, setKind] = useState<OpportunityKind>('open-call')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [deadline, setDeadline] = useState('')
  const [fee, setFee] = useState('')
  const [disc, setDisc] = useState<Discipline[]>([])
  const field = 'h-12 w-full rounded-[var(--radius-ui)] border border-linen-deep bg-paper px-4 text-base'
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{t('opp.new')}</h1>
      <div className="mt-6 grid gap-5">
        <fieldset>
          <legend className="mb-2 text-sm font-medium">{t('opp.kind')}</legend>
          <div className="flex flex-wrap gap-2">{KINDS.map((k) => <Chip key={k} active={kind === k} onClick={() => setKind(k)}>{t(`opp.kind.${k}`)}</Chip>)}</div>
        </fieldset>
        <label className="block"><span className="mb-1.5 block text-sm font-medium">{t('calls.callTitle')}</span><input className={field} value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <label className="block"><span className="mb-1.5 block text-sm font-medium">{t('calls.description')}</span><textarea rows={4} className="w-full rounded-[var(--radius-ui)] border border-linen-deep bg-paper p-4 text-base" value={desc} onChange={(e) => setDesc(e.target.value)} /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className="mb-1.5 block text-sm font-medium">{t('opp.deadline')}</span><input className={field} value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="15 Jan 2027" /></label>
          <label className="block"><span className="mb-1.5 block text-sm font-medium">{t('opp.fee')}</span><input className={field} value={fee} onChange={(e) => setFee(e.target.value)} placeholder="€500" /></label>
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-medium">{t('filter.discipline')}</legend>
          <div className="flex flex-wrap gap-2">
            {DISCIPLINES.map((d) => <Chip key={d} active={disc.includes(d)} onClick={() => setDisc(disc.includes(d) ? disc.filter((x) => x !== d) : [...disc, d])}>{d}</Chip>)}
          </div>
        </fieldset>
        <Button
          variant="primary"
          disabled={!title.trim()}
          onClick={() => {
            addOpportunity({
              id: `o${Date.now()}`, providerId: me.id, kind, title: title.trim(), description: desc.trim(), deadline: deadline || '—',
              disciplines: disc, area: me.area, fee: fee || undefined, picture: samplePictures[Date.now() % samplePictures.length],
            })
            toast(t('opp.published'))
            navigate('/opportunities')
          }}
        >
          {t('opp.publish')}
        </Button>
      </div>
    </div>
  )
}
