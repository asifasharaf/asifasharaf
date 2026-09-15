import { useState } from 'react'
import { useExplorer } from './state'
import { token } from './tokens'
import { encodeState } from '../../lib/explorer/hash'
import { deltaFrom100 } from '../../lib/explorer/scales'

interface Kpi {
  label: string
  value: string
  note: string
  tone: string
}

/** The four numbers that summarise a scenario. */
export function KpiReadout() {
  const { state, result } = useExplorer()

  const kpis: Kpi[] = [
    {
      label: 'Week absorbed by AI',
      value: `${Math.round(result.absorbed * 100)}%`,
      note: `of a ${state.role} designer's week, at these settings`,
      tone: '--rgb-accent',
    },
    {
      label: 'Entry-level work left',
      value: `${Math.round(result.entryPoolIndex)}`,
      note: `index vs today (100 = today) · ${deltaFrom100(result.entryPoolIndex)}`,
      tone: '--rgb-mustard',
    },
    {
      label: 'Designer headcount',
      value: `${Math.round(result.headcountIndex)}`,
      note: `index vs today · ${deltaFrom100(result.headcountIndex)}`,
      tone: result.headcountIndex >= 100 ? '--rgb-olive' : '--rgb-rose',
    },
    {
      label: 'Demand needed to hold flat',
      value: `${result.breakEvenDemand.toFixed(2)}×`,
      note: 'design work must grow this much to keep headcount steady',
      tone: '--rgb-cobalt',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-lg overflow-hidden">
      {kpis.map((k) => (
        <div key={k.label} className="bg-bg p-4 sm:p-5">
          <p className="text-muted text-[11px] uppercase tracking-[0.14em] mb-2">{k.label}</p>
          <p
            className="font-serif text-3xl sm:text-4xl tabular-nums leading-none"
            style={{ color: token(k.tone) }}
          >
            {k.value}
          </p>
          <p className="text-muted text-xs mt-2 leading-snug">{k.note}</p>
        </div>
      ))}
    </div>
  )
}

/**
 * A summary sentence that changes with the scenario, so the numbers above are
 * never left to speak for themselves.
 */
export function Interpretation() {
  const { state, result } = useExplorer()
  const grows = result.headcountIndex >= 100
  const entryFalls = result.entryPoolIndex < 95

  return (
    <p className="text-fg/80 leading-relaxed">
      At these settings, AI absorbs{' '}
      <strong className="text-fg">{Math.round(result.absorbed * 100)}%</strong> of a{' '}
      {state.role} designer&rsquo;s week. Design headcount{' '}
      <strong className="text-fg">
        {grows ? 'grows' : 'shrinks'} to {Math.round(result.headcountIndex)}
      </strong>{' '}
      against today&rsquo;s 100
      {grows
        ? ', because demand rises faster than output per designer'
        : ', because output per designer rises faster than demand'}
      . The pool of work a newcomer could learn on sits at{' '}
      <strong className="text-fg">{Math.round(result.entryPoolIndex)}</strong>, and juniors
      make up <strong className="text-fg">{Math.round(result.juniorShare)}%</strong> of a team.
      {grows && entryFalls
        ? ' Note that both can happen at once: the profession grows while its entry rung narrows.'
        : ''}
    </p>
  )
}

/** Copies a link that reproduces the current scenario. */
export function ShareLink() {
  const { state } = useExplorer()
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${encodeState(state)}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked; the URL bar already holds the same state.
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="link-underline text-accent text-sm"
      aria-live="polite"
    >
      {copied ? 'Link copied' : 'Copy a link to this scenario →'}
    </button>
  )
}
