// Simulated portfolio import from Instagram or PDF. No real import and no API calls.
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { art } from '../art/generateArt'
import { Maze } from '../components/Maze'
import { Button, Icon, Pic, Wordmark, toast } from '../components/ui'
import type { ArtStyle, Work } from '../data/types'
import { works as allSeedWorks } from '../data/works'
import { EASE, gsap, reducedMotion } from '../motion/motion'
import { useApp } from '../state/AppContext'

const DRAFT_BIO: Record<string, string> = {
  marta: 'Sculpture student at FBAUL (3rd year). I carve marble and cast bronze: bodies, movement, time. Preparing a light installation of The Mature Age for my graduation show.',
}

export default function ImportPage() {
  const { source = 'instagram' } = useParams()
  const { t, me, importPortfolio, addWork, setBio, bioOf } = useApp()
  const navigate = useNavigate()
  const [phase, setPhase] = useState(0) // 0,1,2 = loading steps, 3 = done
  const [bio, setBio_] = useState(DRAFT_BIO[me.id] ?? bioOf(me))
  const grid = useRef<HTMLDivElement>(null)

  const found: Work[] =
    me.id === 'marta'
      ? allSeedWorks.filter((w) => w.ownerId === 'marta')
      : (['strata', 'stone', 'hatch', 'orbs', 'blocks'] as ArtStyle[]).map((style, i) => ({
          id: `${me.id}-imp-${i}`,
          ownerId: me.id,
          title: `Untitled ${i + 1}`,
          year: 2026 - (i % 3),
          technique: 'Imported from ' + (source === 'pdf' ? 'PDF' : 'Instagram'),
          materials: [],
          dimensions: '',
          discipline: me.discipline ?? 'Painting',
          topics: me.topics.slice(0, 2),
          picture: art(style, 800 + i * 7 + me.id.length, [0.8, 1, 0.75, 1.2, 0.9][i]),
          blocks: [{ type: 'text', title: 'About the work', body: 'Imported caption. Edit this text.' }],
        }))

  useEffect(() => {
    const fast = reducedMotion()
    const ids = [1, 2, 3].map((p, i) => window.setTimeout(() => setPhase(p), (fast ? 300 : 900) * (i + 1)))
    return () => ids.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (phase === 3 && grid.current && !reducedMotion()) {
      gsap.from(grid.current.children, { opacity: 0, y: 20, scale: 0.97, duration: 0.5, stagger: 0.08, ease: EASE })
    }
  }, [phase])

  const save = () => {
    if (me.id === 'marta') importPortfolio('marta', bio)
    else {
      found.forEach(addWork)
      setBio(me.id, bio)
    }
    toast(t('import.doneTitle'))
    navigate('/me')
  }

  const steps = [t('import.step1'), t('import.step2'), t('import.step3')]

  return (
    <div className="min-h-dvh bg-linen px-5 pt-6 pb-16">
      <div className="mx-auto max-w-3xl">
        <Wordmark className="text-3xl" />
        {phase < 3 ? (
          <div className="mt-10 flex flex-col items-center text-center" role="status" aria-live="polite">
            <div className="h-40 w-56 overflow-hidden rounded-[var(--radius-ui)]">
              <Maze draw className="h-full w-full" stroke={16} />
            </div>
            <h1 className="mt-8 text-2xl font-semibold">{source === 'pdf' ? t('import.pdf') : t('import.instagram')}</h1>
            <ul className="mt-6 grid gap-3 text-left">
              {steps.map((s, i) => (
                <li key={s} className={`flex items-center gap-3 transition-opacity ${phase >= i ? 'opacity-100' : 'opacity-30'}`}>
                  <Icon icon={CheckmarkCircle02Icon} className={phase > i ? 'text-red' : 'text-thread'} />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-8">
            <h1 className="text-3xl font-semibold tracking-tight">{t('import.doneTitle')}</h1>
            <p className="mt-2 max-w-[60ch] text-thread">{t('import.doneBody', { n: found.length })}</p>
            <div ref={grid} className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
              {found.map((w) => (
                <figure key={w.id}>
                  <Pic picture={'art' in w.picture ? { art: { ...w.picture.art, ratio: 0.8 } } : w.picture} alt={w.title} />
                  <figcaption className="mt-1 truncate text-sm">{w.title}</figcaption>
                </figure>
              ))}
            </div>
            <label htmlFor="bio" className="mt-8 mb-2 block font-semibold">{t('import.bio')}</label>
            <textarea id="bio" value={bio} onChange={(e) => setBio_(e.target.value)} rows={4} className="w-full rounded-[var(--radius-ui)] border border-linen-deep bg-paper p-4 text-base leading-relaxed" />
            <Button variant="primary" magnet className="mt-6 w-full sm:w-auto" onClick={save} data-demo="import-save">{t('import.save')}</Button>
          </div>
        )}
      </div>
    </div>
  )
}
