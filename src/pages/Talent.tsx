// Opportunity provider view: find talent (works first, people second) and named shortlists.
import { useState } from 'react'
import { Link } from 'react-router'
import { CallCard, PersonCard, PersonLine, WorkGrid } from '../components/cards'
import { FilterBar, matchPerson, matchWork, useFilters } from '../components/Filters'
import { Thread } from '../components/Maze'
import { Button, Pic } from '../components/ui'
import { useReveal } from '../motion/motion'
import { useApp } from '../state/AppContext'

export function Talent() {
  const { t, people, works, personById, data } = useApp()
  const { f } = useFilters()
  const talentRoles = ['student', 'alumni']
  const foundWorks = works.filter((w) => talentRoles.includes(personById(w.ownerId)?.role ?? '') && matchWork(w, f, personById(w.ownerId)))
  const found = people.filter((p) => talentRoles.includes(p.role) && matchPerson(p, f, works))
  const calls = data.calls.filter((c) => !f.discipline || c.lookingFor === f.discipline || personById(c.authorId)?.discipline === f.discipline)
  const ref = useReveal<HTMLDivElement>([JSON.stringify(f)])

  return (
    <div ref={ref}>
      <h1 className="font-display text-4xl text-ink md:text-5xl">{t('talent.title')}</h1>
      <p className="mt-2 mb-5 text-thread">{t('talent.body')}</p>
      <FilterBar provider />
      <p className="mt-6 mb-3 text-sm text-thread" aria-live="polite">{t('discover.results', { n: foundWorks.length })}</p>
      {foundWorks.length > 0 ? <WorkGrid works={foundWorks} /> : <p className="rounded-[var(--radius-ui)] border border-dashed border-thread/50 p-6 text-center">{t('discover.noResults')}</p>}

      {found.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">{t('discover.people')}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{found.map((p) => <PersonCard key={p.id} person={p} />)}</div>
        </section>
      )}

      {calls.length > 0 && (
        <section className="mt-12">
          <Thread className="mb-8" />
          <h2 className="mb-1 text-xl font-semibold">{t('calls.title')}</h2>
          <p className="mb-4 text-thread">{t('calls.body')}</p>
          <div className="grid gap-4 md:grid-cols-2">{calls.map((c) => <CallCard key={c.id} call={c} />)}</div>
        </section>
      )}
    </div>
  )
}

export function Shortlists() {
  const { t, data, userId, works, personById, createShortlist } = useApp()
  const [name, setName] = useState('')
  const lists = data.shortlists.filter((l) => l.ownerId === userId)
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{t('shortlist.title')}</h1>
      <form
        className="mt-4 flex max-w-md gap-2"
        onSubmit={(e) => { e.preventDefault(); if (name.trim()) { createShortlist(name.trim()); setName('') } }}
      >
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('shortlist.name')} aria-label={t('shortlist.name')} className="h-11 min-w-0 flex-1 rounded-full border border-linen-deep bg-paper px-4 text-base" />
        <Button type="submit">{t('shortlist.new')}</Button>
      </form>
      <div className="mt-8 grid gap-10">
        {lists.map((l) => (
          <section key={l.id}>
            <div className="mb-3 flex items-baseline gap-3">
              <h2 className="text-xl font-semibold">{l.name}</h2>
              <span className="text-sm text-thread">{t('shortlist.items', { n: l.items.length })}</span>
            </div>
            {l.items.length === 0 ? (
              <p className="text-thread">{t('shortlist.empty')}</p>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {l.items.map((it) => {
                  if (it.kind === 'work') {
                    const w = works.find((x) => x.id === it.id)
                    if (!w) return null
                    return (
                      <li key={`w${it.id}`}>
                        <Link to={`/work/${w.id}`}>
                          <Pic picture={'art' in w.picture ? { art: { ...w.picture.art, ratio: 0.85 } } : w.picture} alt={w.title} />
                          <p className="mt-1.5 truncate text-sm font-medium">{w.title}</p>
                          <p className="truncate text-xs text-thread">{personById(w.ownerId)?.name}</p>
                        </Link>
                      </li>
                    )
                  }
                  const p = personById(it.id)
                  return p ? (
                    <li key={`p${it.id}`} className="flex items-center rounded-[var(--radius-work)] bg-paper p-3">
                      <PersonLine person={p} />
                    </li>
                  ) : null
                })}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
