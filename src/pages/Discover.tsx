// Discover: search people and projects across disciplines.
import { NavLink } from 'react-router'
import { PersonCard, WorkGrid } from '../components/cards'
import { FilterBar, matchPerson, matchWork, useFilters } from '../components/Filters'
import { useReveal } from '../motion/motion'
import { useApp } from '../state/AppContext'

/** Tabs that link Discover, Project calls and Opportunities (useful on phones). */
export function DiscoverTabs() {
  const { t } = useApp()
  const cls = ({ isActive }: { isActive: boolean }) =>
    `shrink-0 border-b-2 pb-2 text-[15px] ${isActive ? 'border-red font-semibold text-ink' : 'border-transparent text-thread'}`
  return (
    <nav className="no-scrollbar -mx-4 mb-5 flex gap-5 overflow-x-auto px-4 md:mx-0 md:px-0" aria-label={t('discover.title')}>
      <NavLink to="/discover" className={cls}>{t('discover.people')}</NavLink>
      <NavLink to="/calls" className={cls}>{t('nav.calls')}</NavLink>
      <NavLink to="/opportunities" className={cls}>{t('nav.opportunities')}</NavLink>
    </nav>
  )
}

export default function Discover() {
  const { t, people, works, personById, me } = useApp()
  const { f, clear } = useFilters()
  const found = people.filter((p) => p.id !== me.id && p.role !== 'spectator' && matchPerson(p, f, works))
  const foundWorks = works.filter((w) => w.ownerId !== me.id && matchWork(w, f, personById(w.ownerId)))
  const ref = useReveal<HTMLDivElement>([JSON.stringify(f)])

  return (
    <div ref={ref}>
      <h1 className="sr-only">{t('discover.title')}</h1>
      <DiscoverTabs />
      <FilterBar />
      <p className="mt-6 mb-3 text-sm text-thread" aria-live="polite">{t('discover.results', { n: found.length + foundWorks.length })}</p>
      {found.length + foundWorks.length === 0 ? (
        <div className="rounded-[var(--radius-ui)] border border-dashed border-thread/50 p-6 text-center">
          <p>{t('discover.noResults')}</p>
          <button onClick={clear} className="mt-3 text-sm font-semibold underline underline-offset-2">{t('discover.clear')}</button>
        </div>
      ) : (
        <>
          {found.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {found.map((p) => <PersonCard key={p.id} person={p} />)}
            </div>
          )}
          {foundWorks.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-xl font-semibold">{t('profile.portfolio')}</h2>
              <WorkGrid works={foundWorks} />
            </section>
          )}
        </>
      )}
    </div>
  )
}
