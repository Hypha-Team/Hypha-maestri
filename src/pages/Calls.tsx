// Project calls: "For my project I'm looking for someone from X".
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { CallCard } from '../components/cards'
import { DISCIPLINES } from '../components/Filters'
import { Button, Chip, toast } from '../components/ui'
import { DEMO_CALL } from '../demo/Demo'
import type { Discipline } from '../data/types'
import { useReveal } from '../motion/motion'
import { useApp } from '../state/AppContext'
import { DiscoverTabs } from './Discover'

export function CallsPage() {
  const { t, data, me } = useApp()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Discipline | ''>('')
  const calls = data.calls.filter((c) => !filter || c.lookingFor === filter)
  const ref = useReveal<HTMLDivElement>([filter, data.calls.length])
  return (
    <div ref={ref}>
      {me.role !== 'provider' && <DiscoverTabs />}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{t('calls.title')}</h1>
          <p className="mt-1 text-thread">{t('calls.body')}</p>
        </div>
        {me.role !== 'provider' && me.role !== 'spectator' && <Button variant="primary" onClick={() => navigate('/calls/new')}>{t('calls.new')}</Button>}
      </div>
      <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
        <Chip active={!filter} onClick={() => setFilter('')}>{t('common.all')}</Chip>
        {DISCIPLINES.map((d) => <Chip key={d} active={filter === d} onClick={() => setFilter(filter === d ? '' : d)}>{d}</Chip>)}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">{calls.map((c) => <CallCard key={c.id} call={c} />)}</div>
    </div>
  )
}

export function NewCall() {
  const { t, addCall, me, data } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const demo = params.get('demo') === '1'
  const [title, setTitle] = useState(demo ? DEMO_CALL.title : '')
  const [desc, setDesc] = useState(demo ? DEMO_CALL.description : '')
  const [looking, setLooking] = useState<Discipline>(demo ? 'Industrial Design' : 'Sculpture')
  const already = demo && data.calls.some((c) => c.id === 'c-demo')

  const publish = () => {
    addCall({
      id: demo ? 'c-demo' : `c${Date.now()}`, authorId: me.id, title: title.trim(), lookingFor: looking, description: desc.trim(),
      tags: demo ? ['Light', 'Metal', 'Graduation show'] : [], area: me.area, ago: 0, responses: [],
    })
    toast(t('calls.published'))
    navigate('/calls')
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{t('calls.new')}</h1>
      <div className="mt-6 grid gap-5">
        <fieldset>
          <legend className="mb-2 text-sm font-medium">{t('calls.lookingFor')}</legend>
          <div className="flex flex-wrap gap-2">
            {DISCIPLINES.map((d) => <Chip key={d} active={looking === d} onClick={() => setLooking(d)}>{d}</Chip>)}
          </div>
        </fieldset>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">{t('calls.callTitle')}</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="h-12 w-full rounded-[var(--radius-ui)] border border-linen-deep bg-paper px-4 text-base" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">{t('calls.description')}</span>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={5} className="w-full rounded-[var(--radius-ui)] border border-linen-deep bg-paper p-4 text-base leading-relaxed" />
        </label>
        <Button variant="primary" magnet data-demo="publish-call" disabled={!title.trim() || already} onClick={publish}>{t('calls.publish')}</Button>
      </div>
    </div>
  )
}
