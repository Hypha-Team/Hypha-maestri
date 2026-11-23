// Welcome, simulated sign-up, role choice, university email check, first portfolio step.
import { ArrowLeft01Icon, CheckmarkCircle02Icon, InstagramIcon, PaintBoardIcon, Pdf01Icon } from '@hugeicons/core-free-icons'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import BlurText from '../components/reactbits/BlurText'
import LiveLogo from '../components/LiveLogo'
import { Button, CheckedBadge, Icon } from '../components/ui'
import { useDemo } from '../demo/Demo'
import type { Role } from '../data/types'
import type { Key } from '../i18n/en'
import { reducedMotion } from '../motion/motion'
import { useApp } from '../state/AppContext'

type Step = 'intro' | 'role' | 'details' | 'portfolio'

const ROLES: Role[] = ['student', 'alumni', 'teacher', 'provider', 'spectator']
/** Which demo person each role signs up as. */
const ACCOUNT: Record<Role, { id: string; email: string }> = {
  student: { id: 'marta', email: 'marta.silva@edu.ulisboa.pt' },
  alumni: { id: 'ines', email: 'ines.moura@alumni.ulisboa.pt' },
  teacher: { id: 'helena', email: 'helena.costa@belasartes.ulisboa.pt' },
  provider: { id: 'fio', email: '' },
  spectator: { id: 'joana', email: '' },
}

export default function Welcome() {
  const app = useApp()
  const { t, personById, switchUser, signUp, lang, setLang } = app
  const navigate = useNavigate()
  const demo = useDemo()
  const [params] = useSearchParams()
  const [step, setStep] = useState<Step>('intro')
  const [role, setRole] = useState<Role>('student')
  const [codeState, setCodeState] = useState<'none' | 'sent' | 'confirmed'>('none')
  const [code, setCode] = useState('')

  // The demo jumps straight to the portfolio step.
  useEffect(() => {
    if (params.get('step') === 'portfolio') {
      setRole('student')
      setCodeState('confirmed')
      switchUser('marta')
      signUp('marta')
      setStep('portfolio')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const person = personById(ACCOUNT[role].id)!
  const needsEmail = role === 'student' || role === 'alumni' || role === 'teacher'

  const sendCode = () => {
    setCodeState('sent')
    // Fake code arriving, typed in digit by digit
    const digits = '482913'
    digits.split('').forEach((_, i) => window.setTimeout(() => setCode(digits.slice(0, i + 1)), 500 + i * 110))
  }

  const finishDetails = () => {
    switchUser(person.id)
    signUp(person.id)
    if (role === 'provider' || role === 'spectator') navigate(role === 'provider' ? '/talent' : '/')
    else setStep('portfolio')
  }

  const back = () => setStep(step === 'portfolio' ? 'details' : step === 'details' ? 'role' : 'intro')

  return (
    <div className="min-h-dvh bg-linen md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* The logo, shown whole */}
      <div className="relative h-[42dvh] overflow-hidden md:sticky md:top-0 md:h-dvh">
        <LiveLogo alt="HYPHA logo: the word HYPHA in bold rounded red letters, surrounded by wavy red lines on a pale peach background" />
      </div>

      <div className="relative mx-auto flex w-full max-w-xl flex-col px-5 pt-6 pb-10 md:justify-center md:px-12">
        <div className="mb-8 flex items-center justify-between">
          {step === 'intro' ? (
            <button onClick={demo.start} className="rounded-full border border-dashed border-red px-3 py-1.5 text-sm font-semibold text-red" data-demo-skip>
              {t('demo.start')}
            </button>
          ) : (
            <button onClick={back} className="-ml-2 grid h-10 w-10 place-items-center rounded-full hover:bg-linen-deep" aria-label={t('demo.back')}>
              <Icon icon={ArrowLeft01Icon} />
            </button>
          )}
          <div className="flex rounded-full bg-linen-deep p-0.5 text-xs font-semibold">
            {(['en', 'pt'] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l} className={`rounded-full px-2.5 py-1 uppercase ${lang === l ? 'bg-paper shadow-sm' : 'text-thread'}`}>{l}</button>
            ))}
          </div>
        </div>

        {step === 'intro' && (
          <section>
            <h1 className="font-display text-[clamp(32px,11vw,44px)] leading-[0.95] text-ink md:text-6xl">
              {reducedMotion() ? t('welcome.title') : <BlurText key={lang} text={t('welcome.title')} animateBy="words" delay={90} direction="bottom" trigger="load" />}
            </h1>
            <p className="mt-5 max-w-[34ch] text-lg leading-relaxed text-ink/85">{t('welcome.body')}</p>
            <p className="mt-4 max-w-[40ch] border-l-2 border-red pl-3 text-[15px] text-thread">{t('welcome.diff')}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="primary" magnet onClick={() => setStep('role')} className="w-full sm:w-auto">{t('welcome.join')}</Button>
              <Button variant="ghost" onClick={() => { signUp(app.userId); navigate('/') }}>{t('welcome.login')}</Button>
            </div>
            <p className="mt-10 text-sm text-thread">{t('welcome.pilot')}</p>
          </section>
        )}

        {step === 'role' && (
          <section>
            <h1 className="text-3xl font-semibold tracking-tight">{t('signup.roleTitle')}</h1>
            <p className="mt-2 text-thread">{t('signup.roleBody')}</p>
            <fieldset className="mt-6 grid gap-2">
              <legend className="sr-only">{t('signup.roleTitle')}</legend>
              {ROLES.map((r) => (
                <label key={r} className={`flex cursor-pointer items-start gap-3 rounded-[var(--radius-ui)] border p-4 transition-colors ${role === r ? 'border-ink bg-paper' : 'border-linen-deep bg-paper/50 hover:border-thread'}`}>
                  <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} className="mt-1 accent-[var(--color-red)]" />
                  <span>
                    <span className="block font-semibold">{t(`role.${r}` as Key)}</span>
                    <span className="block text-sm text-thread">{t(`role.${r}.body` as Key)}</span>
                  </span>
                </label>
              ))}
            </fieldset>
            <Button variant="primary" className="mt-6 w-full" onClick={() => { setCodeState('none'); setCode(''); setStep('details') }}>{t('signup.continue')}</Button>
          </section>
        )}

        {step === 'details' && (
          <section>
            <h1 className="text-3xl font-semibold tracking-tight">{t('signup.detailsTitle')}</h1>
            <div className="mt-6 grid gap-4">
              <Field label={role === 'provider' ? t('signup.orgName') : t('signup.name')} value={person.name.replace('Prof. ', '')} />
              {role === 'provider' && <Field label={t('signup.orgType')} value={person.orgType ?? ''} />}
              {needsEmail && (
                <>
                  {person.programme && <Field label={t('signup.programme')} value={person.programme} />}
                  <div>
                    <Field label={t('signup.email')} value={ACCOUNT[role].email} type="email" />
                    <p className="mt-1.5 text-sm text-thread">{t('signup.emailHint')}</p>
                  </div>
                  {codeState === 'none' && <Button onClick={sendCode}>{t('signup.sendCode')}</Button>}
                  {codeState === 'sent' && (
                    <div className="rounded-[var(--radius-ui)] bg-paper p-4">
                      <p className="text-sm text-thread">{t('signup.codeSent')} {ACCOUNT[role].email}</p>
                      <div className="mt-3 flex gap-2" aria-label="Code">
                        {Array.from({ length: 6 }, (_, i) => (
                          <span key={i} className="grid h-12 w-10 place-items-center rounded-[10px] border border-linen-deep bg-linen text-xl font-semibold">{code[i] ?? ''}</span>
                        ))}
                      </div>
                      <Button className="mt-3 w-full" disabled={code.length < 6} onClick={() => setCodeState('confirmed')}>{t('signup.confirm')}</Button>
                    </div>
                  )}
                  {codeState === 'confirmed' && (
                    <p className="flex items-center gap-2 font-medium text-ink"><Icon icon={CheckmarkCircle02Icon} className="text-red" /> {t('signup.confirmed')}</p>
                  )}
                </>
              )}
              {role === 'provider' && (
                <p className="flex flex-wrap items-center gap-2 text-sm text-thread"><CheckedBadge /> {t('signup.providerNote')}</p>
              )}
            </div>
            <Button variant="primary" className="mt-6 w-full" disabled={needsEmail && codeState !== 'confirmed'} onClick={finishDetails}>{t('signup.continue')}</Button>
          </section>
        )}

        {step === 'portfolio' && (
          <section>
            <h1 className="text-3xl font-semibold tracking-tight">{t('signup.portfolioTitle')}</h1>
            <p className="mt-2 text-thread">{t('signup.portfolioBody')}</p>
            <PortfolioChoices onLater={() => navigate('/')} />
          </section>
        )}
      </div>
    </div>
  )
}

/** The three equal ways to start a portfolio. Also used on an empty profile. */
export function PortfolioChoices({ onLater }: { onLater?: () => void }) {
  const { t } = useApp()
  const navigate = useNavigate()
  const opts: { label: Key; body: Key; icon: typeof PaintBoardIcon; to: string; demo?: string }[] = [
    { label: 'signup.addWork', body: 'signup.addWorkBody', icon: PaintBoardIcon, to: '/add-work' },
    { label: 'signup.importIg', body: 'signup.importBody', icon: InstagramIcon, to: '/import/instagram', demo: 'import-ig' },
    { label: 'signup.importPdf', body: 'signup.importBody', icon: Pdf01Icon, to: '/import/pdf' },
  ]
  return (
    <div className="mt-6">
      <div className="grid gap-2 sm:grid-cols-3">
        {opts.map((o) => (
          <button
            key={o.label}
            data-demo={o.demo}
            onClick={() => navigate(o.to)}
            className="flex items-center gap-3 rounded-[var(--radius-ui)] border border-linen-deep bg-paper p-4 text-left transition-colors hover:border-thread sm:flex-col sm:items-start"
          >
            <Icon icon={o.icon} size={26} className="text-red" />
            <span>
              <span className="block font-semibold">{t(o.label)}</span>
              <span className="block text-sm text-thread">{t(o.body)}</span>
            </span>
          </button>
        ))}
      </div>
      {onLater && (
        <button onClick={onLater} className="mt-4 w-full rounded-full py-3 text-sm font-medium text-thread hover:text-ink">
          {t('signup.later')}
        </button>
      )}
    </div>
  )
}

function Field({ label, value, type = 'text' }: { label: string; value: string; type?: string }) {
  const [v, setV] = useState(value)
  useEffect(() => setV(value), [value])
  const id = label.replace(/\W/g, '')
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <input id={id} type={type} value={v} onChange={(e) => setV(e.target.value)} className="h-12 w-full rounded-[var(--radius-ui)] border border-linen-deep bg-paper px-4 text-base" />
    </div>
  )
}
