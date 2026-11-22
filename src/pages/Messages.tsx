// Connection requests and 1:1 chats with fake replies.
import { ArrowLeft01Icon, SentIcon } from '@hugeicons/core-free-icons'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { PersonLine } from '../components/cards'
import ClickSpark from '../components/reactbits/ClickSpark'
import { Avatar, Button, Icon, toast } from '../components/ui'
import { EASE, gsap, reducedMotion } from '../motion/motion'
import { useApp } from '../state/AppContext'

function Inbox({ activeId }: { activeId?: string }) {
  const { t, data, userId, personById, accept, decline } = useApp()
  const requests = data.connections.filter((c) => c.to === userId && c.status === 'pending')
  const threads = useMemo(() => {
    const last = new Map<string, number>()
    data.messages.forEach((m) => {
      const other = m.from === userId ? m.to : m.to === userId ? m.from : null
      if (other) last.set(other, Math.max(last.get(other) ?? 0, m.at))
    })
    return [...last.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id)
  }, [data.messages, userId])

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">{t('msg.title')}</h1>
      {requests.length > 0 && (
        <section className="mb-6" aria-labelledby="req">
          <h2 id="req" className="mb-2 text-sm text-thread">{t('msg.requests')}</h2>
          <ul className="grid gap-2">
            {requests.map((r) => {
              const p = personById(r.from)!
              return (
                <li key={r.from} className="rounded-[var(--radius-ui)] bg-paper p-3">
                  <PersonLine person={p} sub={t('msg.wantsToConnect')} />
                  <div className="mt-3 flex gap-2">
                    <ClickSpark sparkColor="#D7261E" sparkCount={10} sparkRadius={24} className="flex-1 rounded-full">
                      <Button variant="primary" className="w-full" data-demo={`accept-${r.from}`} onClick={() => { accept(r.from); toast(t('msg.accepted')) }}>{t('msg.accept')}</Button>
                    </ClickSpark>
                    <Button onClick={() => decline(r.from)}>{t('msg.decline')}</Button>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}
      {threads.length === 0 && requests.length === 0 && <p className="text-thread">{t('msg.empty')}</p>}
      <ul className="grid">
        {threads.map((id) => {
          const p = personById(id)!
          const msgs = data.messages.filter((m) => (m.from === id && m.to === userId) || (m.to === id && m.from === userId))
          const last = msgs[msgs.length - 1]
          return (
            <li key={id}>
              <Link to={`/messages/${id}`} className={`flex items-center gap-3 rounded-[var(--radius-ui)] px-2 py-3 ${activeId === id ? 'bg-paper' : 'hover:bg-paper/60'}`}>
                <Avatar person={p} size={44} />
                <span className="min-w-0">
                  <span className="block font-semibold">{p.name}</span>
                  <span className="block truncate text-sm text-thread">{last?.text}</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Chat({ id }: { id: string }) {
  const { t, data, userId, personById, sendMessage, typing } = useApp()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const other = personById(id)
  const [text, setText] = useState(params.get('draft') ?? '')
  const end = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const msgs = data.messages.filter((m) => (m.from === id && m.to === userId) || (m.to === id && m.from === userId))
  const isTyping = typing?.from === id && typing.to === userId

  useEffect(() => { setText(params.get('draft') ?? '') }, [params])
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end', behavior: reducedMotion() ? 'auto' : 'smooth' })
    const lastEl = list.current?.lastElementChild
    if (lastEl && !reducedMotion()) gsap.from(lastEl, { y: 12, opacity: 0, duration: 0.3, ease: EASE })
  }, [msgs.length, isTyping])

  if (!other) return null
  const send = () => {
    if (!text.trim()) return
    sendMessage(id, text.trim())
    setText('')
    if (params.get('draft')) setParams({}, { replace: true })
  }

  return (
    <div className="flex min-h-[calc(100dvh-180px)] flex-col md:min-h-[calc(100dvh-120px)]">
      <div className="mb-4 flex items-center gap-2 border-b border-linen-deep pb-3">
        <button onClick={() => navigate('/messages')} className="-ml-2 grid h-10 w-10 place-items-center rounded-full hover:bg-linen-deep md:hidden" aria-label={t('demo.back')}>
          <Icon icon={ArrowLeft01Icon} />
        </button>
        <PersonLine person={other} />
      </div>
      <ol ref={list} className="flex flex-1 flex-col gap-2" aria-live="polite">
        {msgs.map((m) => {
          const mine = m.from === userId
          return (
            <li key={m.id} className={`max-w-[82%] rounded-[18px] px-4 py-2.5 text-[15px] leading-snug ${mine ? 'self-end rounded-br-[6px] bg-ink text-linen' : 'self-start rounded-bl-[6px] bg-paper'}`}>
              {m.text}
            </li>
          )
        })}
        {isTyping && (
          <li className="self-start rounded-[18px] bg-paper px-4 py-2.5 text-sm text-thread">{other.name.split(' ')[0]} {t('msg.typing')}…</li>
        )}
      </ol>
      <div ref={end} />
      <form
        className="sticky bottom-[72px] mt-4 flex items-end gap-2 bg-linen py-2 md:bottom-0"
        onSubmit={(e) => { e.preventDefault(); send() }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          rows={Math.min(4, Math.max(1, Math.ceil(text.length / 38)))}
          placeholder={t('msg.placeholder')}
          aria-label={t('msg.placeholder')}
          className="min-h-12 flex-1 resize-none rounded-[22px] border border-linen-deep bg-paper px-4 py-3 text-base leading-snug"
        />
        <ClickSpark sparkColor="#D7261E" sparkCount={9} sparkRadius={22} className="rounded-full" style={{ width: 'auto', height: 'auto' }}>
          <button type="submit" data-demo="send" disabled={!text.trim()} className="grid h-12 w-12 place-items-center rounded-full bg-red text-paper disabled:opacity-40" aria-label={t('msg.send')}>
            <Icon icon={SentIcon} size={20} />
          </button>
        </ClickSpark>
      </form>
    </div>
  )
}

export default function Messages() {
  const { id } = useParams()
  return (
    <div className="md:grid md:grid-cols-[300px_minmax(0,1fr)] md:gap-10">
      <div className={id ? 'hidden md:block' : ''}><Inbox activeId={id} /></div>
      {id ? <Chat key={id} id={id} /> : <div className="hidden md:block" />}
    </div>
  )
}
