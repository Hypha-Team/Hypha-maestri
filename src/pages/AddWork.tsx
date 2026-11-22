// Add a work by hand: main image, museum label, then any number of story blocks.
import { Add01Icon, ArrowLeft01Icon, Delete02Icon, Image01Icon, Layers01Icon, QuoteDownIcon, TextIcon, Video01Icon } from '@hugeicons/core-free-icons'
import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { readImage } from '../art/upload'
import { Button, Icon, Pic, toast, type IconSvg } from '../components/ui'
import type { Block, Picture } from '../data/types'
import type { Key } from '../i18n/en'
import { useApp } from '../state/AppContext'

type Draft =
  | { kind: 'text'; body: string }
  | { kind: 'process'; steps: { picture?: Picture; note: string }[] }
  | { kind: 'video'; url: string; file?: string }
  | { kind: 'quote'; text: string; by: string }
  | { kind: 'gallery'; pictures: Picture[] }

const input = 'h-12 w-full rounded-[var(--radius-ui)] border border-linen-deep bg-paper px-4 text-base'
const area = 'w-full rounded-[var(--radius-ui)] border border-linen-deep bg-paper p-3 text-base leading-relaxed'

function ImagePick({ onPick, label, small }: { onPick: (p: Picture) => void; label: string; small?: boolean }) {
  return (
    <label className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-work)] border border-dashed border-thread/60 bg-paper text-sm text-thread hover:border-ink ${small ? 'aspect-square' : 'aspect-[4/3]'}`}>
      <Icon icon={Image01Icon} size={small ? 22 : 30} />
      {label}
      <input type="file" accept="image/*" className="sr-only" onChange={async (e) => { const f = e.target.files?.[0]; if (f) onPick(await readImage(f)) }} />
    </label>
  )
}

export default function AddWork() {
  const { t, me, addWork } = useApp()
  const navigate = useNavigate()
  const [picture, setPicture] = useState<Picture>()
  const [title, setTitle] = useState('')
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [technique, setTechnique] = useState('')
  const [dimensions, setDimensions] = useState('')
  const [drafts, setDrafts] = useState<Draft[]>([{ kind: 'text', body: '' }])
  const [error, setError] = useState('')

  const set = (i: number, d: Draft) => setDrafts((all) => all.map((x, j) => (j === i ? d : x)))
  const remove = (i: number) => setDrafts((all) => all.filter((_, j) => j !== i))
  const add = (d: Draft) => setDrafts((all) => [...all, d])

  const adders: { label: Key; icon: IconSvg; make: () => Draft }[] = [
    { label: 'add.block.text', icon: TextIcon, make: () => ({ kind: 'text', body: '' }) },
    { label: 'add.block.process', icon: Layers01Icon, make: () => ({ kind: 'process', steps: [{ note: '' }] }) },
    { label: 'add.block.video', icon: Video01Icon, make: () => ({ kind: 'video', url: '' }) },
    { label: 'add.block.gallery', icon: Image01Icon, make: () => ({ kind: 'gallery', pictures: [] }) },
    { label: 'add.block.quote', icon: QuoteDownIcon, make: () => ({ kind: 'quote', text: '', by: '' }) },
  ]

  const save = () => {
    if (!picture) return setError(t('add.needImage'))
    if (!title.trim()) return setError(t('add.needTitle'))
    const blocks: Block[] = drafts.flatMap((d): Block[] => {
      if (d.kind === 'text' && d.body.trim()) return [{ type: 'text', title: 'About the work', body: d.body.trim() }]
      if (d.kind === 'process') {
        const steps = d.steps.filter((s) => s.picture || s.note.trim()).map((s) => ({ picture: s.picture ?? picture, note: s.note }))
        return steps.length ? [{ type: 'process', title: 'How it was made', steps }] : []
      }
      if (d.kind === 'video' && (d.url.trim() || d.file)) return [{ type: 'video', title: 'Making of', caption: title, poster: picture, url: d.url.trim() || undefined, file: d.file }]
      if (d.kind === 'quote' && d.text.trim()) return [{ type: 'quote', text: d.text.trim(), by: d.by.trim() || me.name }]
      if (d.kind === 'gallery' && d.pictures.length) return [{ type: 'gallery', title: 'More images', pictures: d.pictures }]
      return []
    })
    const id = `${me.id}-w${Date.now()}`
    addWork({
      id, ownerId: me.id, title: title.trim(), year: Number(year) || new Date().getFullYear(), technique, materials: [],
      dimensions, discipline: me.discipline ?? 'Painting', topics: me.topics.slice(0, 2), picture, blocks,
    })
    toast(t('add.saved'))
    navigate(`/work/${id}`)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button onClick={() => navigate(-1)} className="-ml-2 mb-4 inline-flex h-10 items-center gap-1 rounded-full pr-3 pl-2 text-sm hover:bg-linen-deep">
        <Icon icon={ArrowLeft01Icon} /> {t('common.cancel')}
      </button>
      <h1 className="text-3xl font-semibold tracking-tight">{t('add.title')}</h1>

      <section className="mt-6">
        <h2 className="mb-2 font-semibold">{t('add.image')}</h2>
        {picture ? (
          <div className="relative">
            <Pic picture={picture} alt="" className="max-h-[60dvh] object-contain" />
            <button onClick={() => setPicture(undefined)} className="absolute top-2 right-2 rounded-full bg-paper px-3 py-1.5 text-sm shadow">{t('add.remove')}</button>
          </div>
        ) : (
          <div className="grid gap-2">
            <ImagePick onPick={setPicture} label={t('add.chooseImage')} />
            <button type="button" onClick={() => setPicture({ art: { style: 'stone', seed: Math.floor(Math.random() * 999), ratio: 0.8 } })} className="text-sm text-thread underline underline-offset-2">
              {t('add.sample')}
            </button>
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-semibold">{t('add.label')}</h2>
        <div className="grid gap-3 rounded-[var(--radius-work)] bg-paper p-4">
          <L label={t('add.workTitle')}><input className={input} value={title} onChange={(e) => setTitle(e.target.value)} /></L>
          <div className="grid grid-cols-[1fr_2fr] gap-3">
            <L label={t('add.year')}><input className={input} inputMode="numeric" value={year} onChange={(e) => setYear(e.target.value)} /></L>
            <L label={t('add.dimensions')}><input className={input} value={dimensions} onChange={(e) => setDimensions(e.target.value)} /></L>
          </div>
          <L label={t('add.technique')}><input className={input} value={technique} onChange={(e) => setTechnique(e.target.value)} /></L>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold">{t('add.blocks')}</h2>
        <p className="mb-3 text-sm text-thread">{t('add.blocksBody')}</p>
        <div className="grid gap-3">
          {drafts.map((d, i) => (
            <div key={i} className="rounded-[var(--radius-ui)] border border-linen-deep bg-paper p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold">{t(adders.find((a) => a.make().kind === d.kind)!.label)}</span>
                <button onClick={() => remove(i)} className="grid h-9 w-9 place-items-center rounded-full text-thread hover:bg-linen" aria-label={t('add.remove')}><Icon icon={Delete02Icon} size={18} /></button>
              </div>
              {d.kind === 'text' && <textarea className={area} rows={4} placeholder={t('add.textPlaceholder')} value={d.body} onChange={(e) => set(i, { ...d, body: e.target.value })} />}
              {d.kind === 'process' && (
                <ol className="grid gap-3">
                  {d.steps.map((s, k) => (
                    <li key={k} className="grid grid-cols-[88px_1fr] gap-3">
                      {s.picture ? <Pic picture={s.picture} alt="" className="aspect-square" /> : <ImagePick small label="" onPick={(p) => set(i, { ...d, steps: d.steps.map((x, j) => (j === k ? { ...x, picture: p } : x)) })} />}
                      <textarea className={area} rows={3} placeholder={t('add.processPlaceholder')} value={s.note} onChange={(e) => set(i, { ...d, steps: d.steps.map((x, j) => (j === k ? { ...x, note: e.target.value } : x)) })} />
                    </li>
                  ))}
                  <li><button onClick={() => set(i, { ...d, steps: [...d.steps, { note: '' }] })} className="inline-flex items-center gap-1 text-sm font-medium"><Icon icon={Add01Icon} size={16} />{t('add.block.process')}</button></li>
                </ol>
              )}
              {d.kind === 'video' && (
                <div className="grid gap-2">
                  <input className={input} placeholder={t('add.videoPlaceholder')} value={d.url} onChange={(e) => set(i, { ...d, url: e.target.value })} />
                  <label className="text-sm text-thread">
                    {t('add.videoFile')}
                    <input type="file" accept="video/*" className="mt-1 block text-sm" onChange={(e) => { const f = e.target.files?.[0]; if (f) set(i, { ...d, file: URL.createObjectURL(f) }) }} />
                  </label>
                </div>
              )}
              {d.kind === 'quote' && (
                <div className="grid gap-2">
                  <textarea className={area} rows={2} placeholder={t('add.quotePlaceholder')} value={d.text} onChange={(e) => set(i, { ...d, text: e.target.value })} />
                  <input className={input} placeholder={t('add.quoteBy')} value={d.by} onChange={(e) => set(i, { ...d, by: e.target.value })} />
                </div>
              )}
              {d.kind === 'gallery' && (
                <div className="grid grid-cols-3 gap-2">
                  {d.pictures.map((p, k) => <Pic key={k} picture={p} alt="" className="aspect-square" />)}
                  <ImagePick small label="" onPick={(p) => set(i, { ...d, pictures: [...d.pictures, p] })} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {adders.map((a) => (
            <button key={a.label} onClick={() => add(a.make())} className="inline-flex items-center gap-1.5 rounded-full border border-linen-deep bg-paper px-3 py-2 text-sm hover:border-thread">
              <Icon icon={a.icon} size={17} /> {t(a.label)}
            </button>
          ))}
        </div>
      </section>

      {error && <p className="mt-6 text-sm font-medium text-red" role="alert">{error}</p>}
      <Button variant="primary" className="mt-6 w-full" onClick={save}>{t('add.save')}</Button>
    </div>
  )
}

function L({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-thread">{label}</span>
      {children}
    </label>
  )
}
