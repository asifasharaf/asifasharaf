import { useExplorer } from '../state'
import { token } from '../tokens'
import { ROLES } from '../../../lib/explorer/tasks'
import { runModel } from '../../../lib/explorer/model'
import { linear, round } from '../../../lib/explorer/scales'

const W = 680
const H = 300
const PAD = { top: 24, right: 20, bottom: 52, left: 52 }

/**
 * Absorbed share of the week by seniority, at the current lever positions.
 *
 * This is the chart that carries the model's central mechanism: the levers are
 * identical across all four bands, so any gradient here comes entirely from the
 * fact that seniority changes which tasks fill a week.
 */
export default function LadderChart() {
  const { state } = useExplorer()

  const series = ROLES.map((r) => ({
    role: r,
    absorbed: runModel(r.id, state.levers).absorbed,
  }))

  const x = linear(0, ROLES.length - 1, PAD.left + 28, W - PAD.right - 28)
  const y = linear(0, 0.7, H - PAD.bottom, PAD.top)
  const gridlines = [0, 0.175, 0.35, 0.525, 0.7]

  return (
    <figure className="m-0 explorer-chart">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img"
        aria-label="Share of the working week absorbed by AI, by seniority, at the current settings.">
        {gridlines.map((g) => (
          <g key={g}>
            <line x1={PAD.left} y1={round(y(g))} x2={W - PAD.right} y2={round(y(g))}
              style={{ stroke: token('--rgb-border') }} />
            <text x={PAD.left - 10} y={round(y(g)) + 4} textAnchor="end"
              className="text-[11px] font-mono" style={{ fill: token('--rgb-muted') }}>
              {Math.round(g * 100)}%
            </text>
          </g>
        ))}

        {/* columns */}
        {series.map((s, i) => {
          const cx = x(i)
          const top = y(s.absorbed)
          const base = y(0)
          const barW = 44
          return (
            <g key={s.role.id}>
              <rect
                x={round(cx - barW / 2)} y={round(top)}
                width={barW} height={round(Math.max(0, base - top))}
                rx={2}
                style={{
                  fill: token(
                    s.role.id === state.role ? '--rgb-accent' : '--rgb-muted',
                    s.role.id === state.role ? 0.85 : 0.28
                  ),
                  transition: 'y 0.45s cubic-bezier(0.22,1,0.36,1), height 0.45s cubic-bezier(0.22,1,0.36,1), fill 0.25s ease',
                }}
              />
              <text x={round(cx)} y={round(top) - 8} textAnchor="middle"
                className="text-[12px] font-mono"
                style={{ fill: token(s.role.id === state.role ? '--rgb-accent' : '--rgb-muted') }}>
                {Math.round(s.absorbed * 100)}%
              </text>
              <text x={round(cx)} y={H - PAD.bottom + 20} textAnchor="middle"
                className="text-[12px]"
                style={{ fill: token(s.role.id === state.role ? '--rgb-fg' : '--rgb-muted') }}>
                {s.role.label}
              </text>
            </g>
          )
        })}

        <text x={(PAD.left + W - PAD.right) / 2} y={H - 10} textAnchor="middle"
          className="text-[11px] font-mono uppercase tracking-wider"
          style={{ fill: token('--rgb-muted') }}>
          Same levers, different task mix
        </text>
      </svg>

      <div className="sr-only">
      <table>
        <caption>Share of week absorbed by AI, by seniority, at current settings</caption>
        <thead><tr><th scope="col">Seniority</th><th scope="col">Absorbed</th></tr></thead>
        <tbody>
          {series.map((s) => (
            <tr key={s.role.id}>
              <th scope="row">{s.role.label}</th>
              <td>{Math.round(s.absorbed * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </figure>
  )
}
