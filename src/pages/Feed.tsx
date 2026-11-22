// Feed: short "what I'm working on" posts from connections and interests.
import { Image01Icon } from '@hugeicons/core-free-icons'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { readImage } from '../art/upload'
import { CallCard, PersonLine } from '../components/cards'
import { Thread } from '../components/Maze'
import { Button, Icon, Pic, Sheet, Tag, toast, useAgo } from '../components/ui'
import type { Picture, Post } from '../data/types'
import { useReveal } from '../motion/motion'
import { useApp } from '../state/AppContext'

function PostCard({ post }: { post: Post }) {
  const { personById } = useApp()
  const ago = useAgo()
  const author = personById(post.authorId)!
  return (
    <article data-reveal className="py-5">
      <PersonLine person={author} sub={ago(post.ago)} />
      <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed">{post.text}</p>
      {post.picture && <Pic picture={post.picture} alt={post.text} className="mt-3 md:max-h-[460px]" />}
      {post.tags.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{post.tags.map((tg) => <Tag key={tg}>{tg}</Tag>)}</div>}
    </article>
  )
}

export function Composer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, addPost, userId } = useApp()
  const [text, setText] = useState('')
  const [pic, setPic] = useState<Picture | undefined>()
  return (
    <Sheet open={open} onClose={onClose} title={t('feed.composer')}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} aria-label={t('feed.composer')} placeholder={t('feed.composer')} className="w-full rounded-[var(--radius-ui)] border border-linen-deep bg-paper p-3 text-base" />
      {pic && <Pic picture={pic} alt="" className="mt-3 max-h-60" />}
      <div className="mt-3 flex items-center justify-between gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-medium hover:bg-linen-deep">
          <Icon icon={Image01Icon} size={20} /> {t('feed.addImage')}
          <input type="file" accept="image/*" className="sr-only" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setPic(await readImage(f)) }} />
        </label>
        <Button
          variant="primary"
          disabled={!text.trim()}
          onClick={() => {
            addPost({ id: `p${Date.now()}`, authorId: userId, text: text.trim(), picture: pic, tags: [], ago: 0 })
            setText('')
            setPic(undefined)
            onClose()
            toast(t('feed.posted'))
          }}
        >
          {t('feed.post')}
        </Button>
      </div>
    </Sheet>
  )
}

export default function Feed() {
  const { t, data, me, personById } = useApp()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const ref = useReveal<HTMLDivElement>([data.posts.length])
  const composing = params.get('compose') === '1'
  const calls = data.calls.filter((c) => c.authorId !== me.id).slice(0, 2)
  const opps = data.opportunities.slice(0, 3)

  return (
    <div ref={ref} className="md:grid md:grid-cols-[minmax(0,1fr)_300px] md:gap-12">
      <section className="min-w-0 max-w-2xl">
        <h1 className="sr-only">{t('feed.title')}</h1>
        <button
          onClick={() => setParams({ compose: '1' })}
          className="mt-2 flex w-full items-center gap-3 rounded-full border border-linen-deep bg-paper px-4 py-3 text-left text-thread hover:border-thread"
        >
          {t('feed.composer')}
        </button>
        <p className="mt-6 text-sm text-thread">{t('feed.fromNetwork')}</p>
        <div className="divide-y divide-linen-deep">
          {data.posts.slice(0, 3).map((p) => <PostCard key={p.id} post={p} />)}
          {calls[0] && <div className="py-5"><CallCard call={calls[0]} /></div>}
          {data.posts.slice(3).map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      </section>

      <aside className="mt-8 hidden md:block">
        <div className="sticky top-8 grid gap-8">
          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-semibold">{t('nav.opportunities')}</h2>
              <Link to="/opportunities" className="text-sm text-thread hover:text-ink">{t('common.seeAll')}</Link>
            </div>
            <ul className="grid gap-3">
              {opps.map((o) => (
                <li key={o.id}>
                  <button onClick={() => navigate('/opportunities')} className="flex w-full gap-3 text-left">
                    <span className="w-16 shrink-0"><Pic picture={'art' in o.picture ? { art: { ...o.picture.art, ratio: 1 } } : o.picture} alt="" /></span>
                    <span className="min-w-0 text-sm">
                      <span className="block font-semibold leading-snug">{o.title}</span>
                      <span className="block text-thread">{personById(o.providerId)?.name} · {o.deadline}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <Thread />
          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-semibold">{t('nav.calls')}</h2>
              <Link to="/calls" className="text-sm text-thread hover:text-ink">{t('common.seeAll')}</Link>
            </div>
            <ul className="grid gap-3 text-sm">
              {data.calls.slice(0, 3).map((c) => (
                <li key={c.id}>
                  <Link to="/calls" className="block leading-snug hover:text-red">
                    <span className="font-semibold">{c.title}</span>
                    <span className="block text-thread">{personById(c.authorId)?.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>
      <Composer open={composing} onClose={() => setParams({})} />
    </div>
  )
}
