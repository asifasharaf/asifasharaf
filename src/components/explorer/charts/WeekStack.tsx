import { useExplorer } from '../state'
import { token } from '../tokens'
import { PHASES } from '../../../lib/explorer/tasks'
import { round } from '../../../lib/explorer/scales'

const W = 680
const BAR = 46
const GAP = 26
const LABEL_W = 124
const H = 190

/**
 * The selected role's week before and after automation, by phase.
 *
 * Both bars are drawn on the same scale — the "after" bar is genuinely shorter,
 * rather than renormalised to full width. The empty space is the point: it is
 * capacity, and what happens to it is what the demand lever decides.
 */
export default function WeekStack() {
  const { state, result } = useExplorer()
  const trackW = W - LABEL_W - 8
  const scale = (points: number) => (points / 100) * trackW

  const rows = [
    { label: 'Today', key: 'before' as const },
    { label: 'This scenario', key: 'after' as const },
  ]

  return (
    <figure className="m-0 explorer-chart">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto overflow-visible" role="img"
        aria-label={`A ${state.role} designer's week by phase, before and after automation in this scenario.`}>
        {rows.map((row, ri) => {
          let cursor = LABEL_W
          const y = 18 + ri * (BAR + GAP)
          return (
            <g key={row.key}>
              <text x={LABEL_W - 12} y={y + BAR / 2 + 4} textAnchor="end"
                className="text-[12px] font-mono" style={{ fill: token('--rgb-muted') }}>
                {row.label}
              </text>
              {PHASES.map((phase) => {
                const pr = result.phases.find((p) => p.phase === phase.id)
                const points = pr ? pr[row.key] : 0
                const w = scale(points)
                const x = cursor
                cursor += w
                if (w <= 0.2) return null
                return (
                  <g key={phase.id}>
                    <rect x={round(x)} y={y} width={round(w)} height={BAR}
                      style={{
                        fill: token(phase.token, row.key === 'after' ? 0.85 : 0.35),
                        transition: 'width 0.45s cubic-bezier(0.22,1,0.36,1), x 0.45s cubic-bezier(0.22,1,0.36,1)',
                      }} />
                    {w > 34 && (
                      <text x={round(x + w / 2)} y={y + BAR / 2 + 4} textAnchor="middle"
                        className="text-[11px] font-mono"
                        style={{ fill: token('--rgb-bg'), pointerEvents: 'none' }}>
                        {Math.round(points)}
                      </text>
                    )}
                  </g>
                )
              })}
              {/* freed capacity */}
              {row.key === 'after' && cursor < LABEL_W + trackW - 1 && (
                <g>
                  <rect x={round(cursor)} y={y} width={round(LABEL_W + trackW - cursor)} height={BAR}
                    style={{
                      fill: token('--rgb-muted', 0.08),
                      stroke: token('--rgb-border'),
                      transition: 'width 0.45s cubic-bezier(0.22,1,0.36,1), x 0.45s cubic-bezier(0.22,1,0.36,1)',
                    }}
                    strokeDasharray="3 3" />
                  {LABEL_W + trackW - cursor > 96 && (
                    <text x={round(cursor + (LABEL_W + trackW - cursor) / 2)} y={y + BAR / 2 + 4}
                      textAnchor="middle" className="text-[11px] font-mono uppercase tracking-wider"
                      style={{ fill: token('--rgb-muted') }}>
                      {Math.round(result.absorbed * 100)}% freed
                    </text>
                  )}
                </g>
              )}
            </g>
          )
        })}
      </svg>

      <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-4 list-none pl-0">
        {PHASES.map((phase) => (
          <li key={phase.id} className="flex items-center gap-2 text-xs text-muted">
            <span className="inline-block w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: token(phase.token, 0.85) }} aria-hidden="true" />
            {phase.label}
          </li>
        ))}
      </ul>

      <div className="sr-only">
      <table>
        <caption>Week composition by phase, in points of a 100-point week</caption>
        <thead>
          <tr><th scope="col">Phase</th><th scope="col">Today</th><th scope="col">This scenario</th></tr>
        </thead>
        <tbody>
          {result.phases.map((p) => (
            <tr key={p.phase}>
              <th scope="row">{PHASES.find((x) => x.id === p.phase)?.label}</th>
              <td>{Math.round(p.before)}</td>
              <td>{Math.round(p.after)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </figure>
  )
}
