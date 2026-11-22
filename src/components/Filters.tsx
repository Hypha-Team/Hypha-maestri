// Search + filter chips shared by Discover and the provider's Find talent page. Filters live in the URL.
import { Cancel01Icon, Search01Icon } from '@hugeicons/core-free-icons'
import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { people } from '../data/people'
import type { Area, Discipline, Person, Role, Work } from '../data/types'
import type { Key } from '../i18n/en'
import { useApp } from '../state/AppContext'
import { Button, Chip, Icon, Sheet } from './ui'

export const DISCIPLINES: Discipline[] = ['Sculpture', 'Drawing', 'Painting', 'Industrial Design', 'Photography', 'Multimedia', 'Communication Design']
export const AREAS: Area[] = ['Marvila', 'Chiado', 'Alfama', 'Arroios', 'Alcântara', 'Penha de França', 'Graça', 'Cais do Sodré']
const ROLES: Role[] = ['student', 'alumni', 'teacher', 'provider']
const uniq = (a: string[]) => [...new Set(a)].sort()
export const TOPICS = uniq(people.flatMap((p) => p.topics))
export const MATERIALS = uniq(people.flatMap((p) => p.materials))

export type FilterKey = 'discipline' | 'role' | 'topic' | 'area' | 'material'

export function useFilters() {
  const [params, setParams] = useSearchParams()
  const get = (k: string) => params.get(k) ?? ''
  const f = {
    q: get('q'),
    discipline: get('discipline'),
    role: get('role'),
    topic: get('topic'),
    area: get('area'),
    material: get('material'),
    recommended: get('recommended') === '1',
    commissions: get('commissions') === '1',
  }
  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    setParams(next, { replace: true })
  }
  const clear = () => setParams({}, { replace: true })
  const active = (['discipline', 'role', 'topic', 'area', 'material'] as FilterKey[]).filter((k) => f[k])
  return { f, set, clear, active }
}

type F = ReturnType<typeof useFilters>['f']
const has = (list: string[], v: string) => list.some((x) => x.toLowerCase() === v.toLowerCase())

export function matchPerson(p: Person, f: F, works: Work[]) {
  const own = works.filter((w) => w.ownerId === p.id)
  if (f.discipline && p.discipline !== f.discipline) return false
  if (f.role && p.role !== f.role) return false
  if (f.topic && !has(p.topics, f.topic)) return false
  if (f.area && p.area !== f.area) return false
  if (f.material && !has(p.materials, f.material) && !own.some((w) => has(w.materials, f.material))) return false
  if (f.commissions && !p.openToCommissions) return false
  if (f.recommended && !own.some((w) => w.recommendedBy)) return false
  if (f.q) {
    const hay = [p.name, p.bio, p.programme, ...p.skills, ...p.materials, ...p.topics].join(' ').toLowerCase()
    if (!hay.includes(f.q.toLowerCase())) return false
  }
  return true
}

export function matchWork(w: Work, f: F, owner?: Person) {
  if (f.discipline && w.discipline !== f.discipline) return false
  if (f.role && owner?.role !== f.role) return false
  if (f.topic && !has(w.topics, f.topic)) return false
  if (f.area && owner?.area !== f.area) return false
  if (f.material && !has(w.materials, f.material)) return false
  if (f.recommended && !w.recommendedBy) return false
  if (f.commissions && !owner?.openToCommissions) return false
  if (f.q) {
    const hay = [w.title, w.technique, ...w.materials, ...w.topics, owner?.name ?? ''].join(' ').toLowerCase()
    if (!hay.includes(f.q.toLowerCase())) return false
  }
  return true
}

export function FilterBar({ provider = false }: { provider?: boolean }) {
  const { t } = useApp()
  const { f, set, clear, active } = useFilters()
  const [more, setMore] = useState(false)
  const groups: { key: FilterKey; label: Key; options: string[]; render?: (v: string) => string }[] = [
    { key: 'material', label: 'filter.material', options: MATERIALS },
    { key: 'topic', label: 'filter.topic', options: TOPICS },
    { key: 'area', label: 'filter.area', options: AREAS },
    ...(provider ? [] : [{ key: 'role' as FilterKey, label: 'filter.role' as Key, options: ROLES, render: (v: string) => t(`role.${v}` as Key) }]),
  ]
  const count = active.filter((k) => k !== 'discipline').length

  return (
    <div className="grid gap-3">
      <label className="relative block">
        <span className="sr-only">{t('discover.search')}</span>
        <Icon icon={Search01Icon} size={20} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-thread" />
        <input
          type="search"
          value={f.q}
          onChange={(e) => set('q', e.target.value)}
          placeholder={t('discover.search')}
          className="h-12 w-full rounded-full border border-linen-deep bg-paper pr-4 pl-11 text-base"
        />
      </label>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label={t('filter.discipline')}>
        <Chip active={!f.discipline} onClick={() => set('discipline', '')}>{t('common.all')}</Chip>
        {DISCIPLINES.map((d) => (
          <Chip key={d} active={f.discipline === d} onClick={() => set('discipline', f.discipline === d ? '' : d)}>{d}</Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {provider && (
          <>
            <Chip active={f.recommended} onClick={() => set('recommended', f.recommended ? '' : '1')}>
              ★ {t('filter.recommended')}
            </Chip>
            <Chip active={f.commissions} onClick={() => set('commissions', f.commissions ? '' : '1')}>{t('filter.commissions')}</Chip>
          </>
        )}
        <button onClick={() => setMore(true)} className="rounded-full border border-dashed border-thread/60 px-3 py-1.5 text-sm hover:border-ink">
          + {t('filter.more')}{count ? ` (${count})` : ''}
        </button>
        {active.filter((k) => k !== 'discipline').map((k) => (
          <button key={k} onClick={() => set(k, '')} className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-sm text-linen">
            {k === 'role' ? t(`role.${f[k]}` as Key) : f[k]}
            <Icon icon={Cancel01Icon} size={14} />
          </button>
        ))}
      </div>

      <Sheet open={more} onClose={() => setMore(false)} title={t('discover.title')}>
        <div className="grid gap-5">
          {groups.map((g) => (
            <fieldset key={g.key}>
              <legend className="mb-2 text-sm font-semibold">{t(g.label)}</legend>
              <div className="flex flex-wrap gap-2">
                {g.options.map((o) => (
                  <Chip key={o} active={f[g.key] === o} onClick={() => set(g.key, f[g.key] === o ? '' : o)}>{g.render ? g.render(o) : o}</Chip>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
        <div className="mt-6 flex gap-2">
          <Button variant="ghost" onClick={clear}>{t('discover.clear')}</Button>
          <Button variant="primary" className="flex-1" onClick={() => setMore(false)}>{t('common.close')}</Button>
        </div>
      </Sheet>
    </div>
  )
}
