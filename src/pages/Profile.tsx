// Profile + portfolio. Also the organisation profile for opportunity providers.
import { Bookmark01Icon, Location01Icon, Message01Icon, Tick02Icon, UserAdd01Icon } from '@hugeicons/core-free-icons'
import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { CallCard, ShortlistSheet, WorkGrid, ordinal } from '../components/cards'
import { Thread } from '../components/Maze'
import ClickSpark from '../components/reactbits/ClickSpark'
import { Avatar, Button, CheckedBadge, Icon, Pic, Tag, UniBadge, toast } from '../components/ui'
import { useReveal } from '../motion/motion'
import { useApp } from '../state/AppContext'
import { PortfolioChoices } from './Welcome'
import { samplePictures } from '../data/commons'

/** Four period artworks standing in for photos of past shows. */
const pastShows = (id: string) => {
  const start = [...id].reduce((n, c) => n + c.charCodeAt(0), 0) % samplePictures.length
  return [0, 1, 2, 3].map((i) => samplePictures[(start + i * 7) % samplePictures.length])
}

export function ConnectButton({ personId }: { personId: string }) {
  const { t, connectionWith, connect, userId } = useApp()
  const c = connectionWith(userId, personId)
  const state = !c ? 'none' : c.status === 'accepted' ? 'connected' : 'pending'
  return (
    <ClickSpark sparkColor="#D7261E" sparkCount={10} sparkRadius={26} sparkSize={10} duration={450} className="rounded-full" style={{ width: 'auto', height: 'auto', display: 'inline-block' }}>
      <Button
        variant={state === 'none' ? 'primary' : 'secondary'}
        data-demo="connect"
        disabled={state !== 'none'}
        onClick={() => { connect(personId); toast(t('profile.requested')) }}
        className="min-w-36 disabled:opacity-100"
      >
        <Icon icon={state === 'none' ? UserAdd01Icon : Tick02Icon} size={19} />
        {state === 'none' ? t('profile.connect') : state === 'pending' ? t('profile.requested') : t('profile.connected')}
      </Button>
    </ClickSpark>
  )
}

export default function Profile() {
  const params = useParams()
  const app = useApp()
  const { t, me, personById, works, data, bioOf } = app
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const id = params.id ?? me.id
  const person = personById(id)
  const own = id === me.id
  const ref = useReveal<HTMLDivElement>([id])
  if (!person) return <Navigate to="/" replace />

  const portfolio = works.filter((w) => w.ownerId === id)
  const calls = data.calls.filter((c) => c.authorId === id)
  const opps = data.opportunities.filter((o) => o.providerId === id)
  const connections = data.connections.filter((c) => c.status === 'accepted' && (c.from === id || c.to === id)).length
  const isOrg = person.role === 'provider'
  const hasPortfolio = person.role === 'student' || person.role === 'alumni' || person.role === 'teacher'

  return (
    <div ref={ref}>
      <header className="grid gap-6 md:grid-cols-[auto_1fr] md:items-start md:gap-8">
        <Avatar person={person} size={96} />
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{person.name}</h1>
          <p className="mt-1 text-thread">
            {[person.programme, person.year ? `${person.year}${ordinal(person.year)} ${t('profile.year')}` : null, isOrg ? person.orgType : null].filter(Boolean).join(' · ')}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-thread">
            <span className="inline-flex items-center gap-1"><Icon icon={Location01Icon} size={16} />{person.area}, {t('common.lisbon')}</span>
            <span>{connections} {t('profile.connections')}</span>
            {person.uniConfirmed && <UniBadge />}
            {person.checked && <CheckedBadge />}
          </div>
          <p className="mt-4 max-w-[62ch] text-[17px] leading-relaxed">{bioOf(person)}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium">
            {person.openToCollab && <span>{t('badge.collab')}</span>}
            {person.openToCommissions && <span>{t('badge.commissions')}</span>}
          </div>
          {!own && (
            <div className="mt-5 flex flex-wrap gap-2">
              <ConnectButton personId={person.id} />
              <Button onClick={() => navigate(`/messages/${person.id}`)}><Icon icon={Message01Icon} size={19} />{t('profile.message')}</Button>
              {me.role === 'provider' && !isOrg && (
                <Button onClick={() => setSaving(true)}><Icon icon={Bookmark01Icon} size={19} />{t('profile.saveToList')}</Button>
              )}
            </div>
          )}
        </div>
      </header>

      <Thread className="my-8" />

      {hasPortfolio && (
        <section aria-labelledby="pf">
          <h2 id="pf" data-demo="portfolio" className="mb-4 text-xl font-semibold">{t('profile.portfolio')}</h2>
          {portfolio.length > 0 ? (
            <WorkGrid works={portfolio} showOwner={false} columnWidth={240} />
          ) : own ? (
            <div className="rounded-[var(--radius-ui)] border border-dashed border-thread/50 p-5">
              <p className="font-semibold">{t('profile.emptyTitle')}</p>
              <p className="text-thread">{t('profile.emptyBody')}</p>
              <PortfolioChoices />
            </div>
          ) : null}
        </section>
      )}

      {calls.length > 0 && (
        <section className="mt-10" aria-labelledby="pc">
          <h2 id="pc" className="mb-4 text-xl font-semibold">{t('profile.calls.student')}</h2>
          <div className="grid gap-4 md:grid-cols-2">{calls.map((c) => <CallCard key={c.id} call={c} />)}</div>
        </section>
      )}

      <div className="mt-10">
          {(person.skills.length > 0 || person.topics.length > 0) && (
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              {person.skills.length > 0 && (
                <div>
                  <dt className="mb-1.5 text-thread">{t('profile.skills')}</dt>
                  <dd className="flex flex-wrap gap-1.5">{person.skills.map((s) => <Tag key={s}>{s}</Tag>)}</dd>
                </div>
              )}
              {person.topics.length > 0 && (
                <div>
                  <dt className="mb-1.5 text-thread">{t('profile.topics')}</dt>
                  <dd className="flex flex-wrap gap-1.5">{person.topics.map((s) => <Tag key={s}>{s}</Tag>)}</dd>
                </div>
              )}
            </dl>
          )}
      </div>

      {isOrg && (
        <>
          <section aria-labelledby="oc">
            <h2 id="oc" className="mb-4 text-xl font-semibold">{t('profile.calls')}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {opps.map((o) => (
                <article key={o.id} data-reveal className="rounded-[var(--radius-ui)] bg-paper p-3">
                  <Pic picture={o.picture} alt="" />
                  <p className="mt-3 text-xs font-medium text-red">{t(`opp.kind.${o.kind}`)}</p>
                  <h3 className="font-semibold">{o.title}</h3>
                  <p className="text-sm text-thread">{t('opp.deadline')}: {o.deadline}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="mt-10" aria-labelledby="ps">
            <h2 id="ps" className="mb-4 text-xl font-semibold">{t('profile.pastShows')}</h2>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {pastShows(person.id).map((picture, i) => (
                <Pic key={i} picture={{ ...picture, ratio: 1 }} alt="" />
              ))}
            </div>
          </section>
        </>
      )}
      <ShortlistSheet open={saving} onClose={() => setSaving(false)} items={[{ kind: 'person', id: person.id }]} />
    </div>
  )
}
