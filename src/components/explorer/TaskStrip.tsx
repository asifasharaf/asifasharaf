import { useExplorer } from './state'
import { QUADRANT_TOKEN, token } from './tokens'
import { QUADRANTS } from '../../lib/explorer/model'

/**
 * Phone fallback for the exposure matrix.
 *
 * A scatter plot squeezed to 360px is unreadable, so the same data becomes a
 * ranked list: tasks ordered by how much of the week AI absorbs, with a bar for
 * the share of the week and a tag for the quadrant.
 */
export function TaskStrip() {
  const { state, result } = useExplorer()

  const rows = result.tasks
    .filter((t) => t.task.volume[state.role] > 0)
    .sort((a, b) => b.automated - a.automated)

  const maxShare = Math.max(...rows.map((t) => t.task.volume[state.role]), 1)

  return (
    <div className="explorer-chart">
      <ul className="list-none pl-0 m-0 divide-y divide-border border-y border-border">
        {rows.map((t) => (
          <li key={t.task.id} className="py-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-fg text-sm leading-snug">{t.task.label}</span>
              <span
                className="font-mono text-xs tabular-nums shrink-0"
                style={{ color: token(QUADRANT_TOKEN[t.quadrant]) }}
              >
                {Math.round(t.automated * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span
                className="h-1.5 rounded-sm"
                style={{
                  width: `${(t.task.volume[state.role] / maxShare) * 70}%`,
                  backgroundColor: token(QUADRANT_TOKEN[t.quadrant], 0.55),
                  transition: 'width 0.4s ease',
                }}
                aria-hidden="true"
              />
              <span className="text-muted text-[11px] font-mono">
                {Math.round(t.task.volume[state.role])}% of week
              </span>
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-3">
        {Object.entries(QUADRANTS).map(([key, q]) => (
          <div key={key}>
            <dt
              className="text-[11px] font-mono uppercase tracking-[0.14em]"
              style={{ color: token(QUADRANT_TOKEN[key as keyof typeof QUADRANT_TOKEN]) }}
            >
              {q.label}
            </dt>
            <dd className="text-muted text-xs leading-relaxed mt-0.5">{q.blurb}</dd>
          </div>
        ))}
      </dl>

      <p className="text-muted text-xs mt-6 leading-relaxed">
        Percentages are the share of each task AI absorbs at the current settings.
        Bars are the share of the week the task fills.
      </p>
    </div>
  )
}
