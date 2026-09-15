import { useRef, useState } from 'react'
import { useExplorer } from '../state'
import { QUADRANT_TOKEN, token } from '../tokens'
import { AUTO_SPLIT, QUADRANTS, VERIFY_SPLIT } from '../../../lib/explorer/model'
import { bubbleRadius, linear, round } from '../../../lib/explorer/scales'
import type { Role, TaskResult } from '../../../lib/explorer/types'

const W = 680
const H = 460
const PAD = { top: 18, right: 18, bottom: 46, left: 56 }

/**
 * Exposure matrix: how automatable a task is against how expensive it is to
 * check, with bubble area showing how much of the selected role's week it fills.
 *
 * The chart's point is the diagonal: design tasks that are easy to automate are
 * mostly also cheap to verify, and the ones that need judgment are expensive to
 * check. The "assisted" corner is nearly empty, which is itself the finding.
 */
export default function QuadrantMatrix() {
  const { state, result } = useExplorer()
  const [active, setActive] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const x = linear(0, 1, PAD.left, W - PAD.right)
  const y = linear(0, 1, H - PAD.bottom, PAD.top)

  const maxShare = Math.max(...result.tasks.map((t) => t.task.volume[state.role]), 1)
  const visible = result.tasks.filter((t) => t.task.volume[state.role] > 0)
  const selected = visible.find((t) => t.task.id === active) ?? null

  // Tasks with identical scores would land on the same point and hide each
  // other, so exact ties are nudged apart deterministically (no randomness —
  // the server and client must produce identical geometry).
  const placed = (() => {
    const counts = new Map<string, number>()
    return visible.map((t) => {
      const key = `${t.task.automatability},${t.task.verificationCost}`
      const n = counts.get(key) ?? 0
      counts.set(key, n + 1)
      const angle = n * 2.4
      const nudge = n === 0 ? 0 : 7
      return {
        t,
        cx: round(x(t.task.automatability) + Math.cos(angle) * nudge),
        cy: round(y(t.task.verificationCost) + Math.sin(angle) * nudge),
        r: round(bubbleRadius(t.task.volume[state.role], maxShare, 30)),
      }
    })
  })()

  const splitX = x(AUTO_SPLIT)
  const splitY = y(VERIFY_SPLIT)

  return (
    <figure className="m-0 explorer-chart">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label={`Design tasks plotted by how automatable they are against how expensive they are to verify, sized by share of a ${state.role} designer's week.`}
      >
        {/* quadrant wash */}
        <rect x={splitX} y={PAD.top} width={W - PAD.right - splitX} height={splitY - PAD.top}
          style={{ fill: token(QUADRANT_TOKEN.contested, 0.06) }} />
        <rect x={splitX} y={splitY} width={W - PAD.right - splitX} height={H - PAD.bottom - splitY}
          style={{ fill: token(QUADRANT_TOKEN.default, 0.07) }} />
        <rect x={PAD.left} y={PAD.top} width={splitX - PAD.left} height={splitY - PAD.top}
          style={{ fill: token(QUADRANT_TOKEN.human, 0.06) }} />
        <rect x={PAD.left} y={splitY} width={splitX - PAD.left} height={H - PAD.bottom - splitY}
          style={{ fill: token(QUADRANT_TOKEN.assisted, 0.05) }} />

        {/* split lines */}
        <line x1={splitX} y1={PAD.top} x2={splitX} y2={H - PAD.bottom}
          style={{ stroke: token('--rgb-border') }} strokeDasharray="3 4" />
        <line x1={PAD.left} y1={splitY} x2={W - PAD.right} y2={splitY}
          style={{ stroke: token('--rgb-border') }} strokeDasharray="3 4" />

        {/* frame */}
        <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom}
          style={{ stroke: token('--rgb-border') }} />
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom}
          style={{ stroke: token('--rgb-border') }} />

        {/* quadrant labels */}
        <QuadrantLabel x={W - PAD.right - 8} y={PAD.top + 16} anchor="end"
          text={QUADRANTS.contested.label} tone={QUADRANT_TOKEN.contested} />
        <QuadrantLabel x={W - PAD.right - 8} y={H - PAD.bottom - 10} anchor="end"
          text={QUADRANTS.default.label} tone={QUADRANT_TOKEN.default} />
        <QuadrantLabel x={PAD.left + 8} y={PAD.top + 16} anchor="start"
          text={QUADRANTS.human.label} tone={QUADRANT_TOKEN.human} />
        <QuadrantLabel x={PAD.left + 8} y={H - PAD.bottom - 10} anchor="start"
          text={QUADRANTS.assisted.label} tone={QUADRANT_TOKEN.assisted} />

        {/* Visible bubbles, largest first so smaller ones stay legible on top. */}
        {placed
          .slice()
          .sort((a, b) => b.r - a.r)
          .map((b) => (
            <circle
              key={b.t.task.id}
              cx={b.cx}
              cy={b.cy}
              r={b.r}
              style={{
                fill: token(QUADRANT_TOKEN[b.t.quadrant], active === b.t.task.id ? 0.5 : 0.22),
                stroke: token(QUADRANT_TOKEN[b.t.quadrant], active === b.t.task.id ? 1 : 0.6),
                transition: 'r 0.4s ease, fill 0.2s ease',
              }}
              strokeWidth={active === b.t.task.id ? 2 : 1}
            />
          ))}

        {/* Keyboard targets only. Overlapping scatter cannot be covered by
            per-bubble hit circles — a small bubble sitting over a large one's
            centre makes the large one unreachable — so pointing is handled by
            the nearest-point overlay below and these never take the pointer. */}
        {placed.map((b) => (
          <circle
            key={`kb-${b.t.task.id}`}
            cx={b.cx}
            cy={b.cy}
            r={Math.max(b.r, 6)}
            fill="transparent"
            style={{ pointerEvents: 'none' }}
            tabIndex={0}
            role="button"
            onFocus={() => setActive(b.t.task.id)}
            onBlur={() => setActive(null)}
            aria-label={`${b.t.task.label}. ${Math.round(b.t.task.volume[state.role])}% of the week. ${Math.round(b.t.automated * 100)}% absorbed by AI in this scenario.`}
          />
        ))}

        {/* Nearest-point pointer layer: every bubble is reachable, and ties go
            to the smaller one so a big bubble never swallows its neighbours. */}
        <rect
          x={PAD.left}
          y={PAD.top}
          width={W - PAD.right - PAD.left}
          height={H - PAD.bottom - PAD.top}
          fill="transparent"
          onMouseMove={(e) => {
            const svg = svgRef.current
            if (!svg) return
            const box = svg.getBoundingClientRect()
            if (box.width === 0) return
            // Uniform scale: fixed viewBox with the default preserveAspectRatio.
            const scale = W / box.width
            const px = (e.clientX - box.left) * scale
            const py = (e.clientY - box.top) * scale
            let best: string | null = null
            let bestScore = Infinity
            for (const b of placed) {
              const d = Math.hypot(px - b.cx, py - b.cy)
              if (d > b.r + 18) continue
              // Prefer the smaller bubble when two are equally close.
              const score = d - b.r * 0.35
              if (score < bestScore) {
                bestScore = score
                best = b.t.task.id
              }
            }
            setActive(best)
          }}
          onMouseLeave={() => setActive(null)}
        />

        {/* axes */}
        <text x={(PAD.left + W - PAD.right) / 2} y={H - 8} textAnchor="middle"
          className="text-[11px] font-mono uppercase tracking-wider"
          style={{ fill: token('--rgb-muted') }}>
          How automatable →
        </text>
        <text x={14} y={(PAD.top + H - PAD.bottom) / 2} textAnchor="middle"
          transform={`rotate(-90 14 ${(PAD.top + H - PAD.bottom) / 2})`}
          className="text-[11px] font-mono uppercase tracking-wider"
          style={{ fill: token('--rgb-muted') }}>
          Cost to verify →
        </text>
      </svg>

      <figcaption className="mt-4 min-h-[4.5rem] border-t border-border pt-4">
        {selected ? (
          <div>
            <p className="text-fg text-sm font-medium">
              {selected.task.label}
              <span className="text-muted font-mono text-xs ml-2">
                {Math.round(selected.task.volume[state.role])}% of the week ·{' '}
                {Math.round(selected.automated * 100)}% absorbed here
              </span>
            </p>
            <p className="text-muted text-sm mt-1 leading-relaxed">{selected.task.note}</p>
          </div>
        ) : (
          <p className="text-muted text-sm">
            Hover or tab through a bubble to see why it scores the way it does. Bubble
            area is that task&rsquo;s share of the selected role&rsquo;s week.
          </p>
        )}
      </figcaption>

      <VisuallyHiddenTable tasks={visible} role={state.role} />
    </figure>
  )
}

function QuadrantLabel({ x, y, anchor, text, tone }: {
  x: number; y: number; anchor: 'start' | 'end'; text: string; tone: string
}) {
  return (
    <text x={x} y={y} textAnchor={anchor}
      className="text-[10px] font-mono uppercase tracking-[0.14em]"
      style={{ fill: token(tone, 0.85) }}>
      {text}
    </text>
  )
}

/** Chart content as a table, so it survives without SVG or sight. */
function VisuallyHiddenTable({ tasks, role }: { tasks: TaskResult[]; role: Role }) {
  return (
    <div className="sr-only">
      <table>
      <caption>Task exposure for a {role} designer</caption>
      <thead>
        <tr>
          <th scope="col">Task</th>
          <th scope="col">Automatability</th>
          <th scope="col">Verification cost</th>
          <th scope="col">Share of week</th>
          <th scope="col">Absorbed by AI</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((t) => (
          <tr key={t.task.id}>
            <th scope="row">{t.task.label}</th>
            <td>{Math.round(t.task.automatability * 100)}%</td>
            <td>{Math.round(t.task.verificationCost * 100)}%</td>
            <td>{Math.round(t.task.volume[role])}%</td>
            <td>{Math.round(t.automated * 100)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
      </div>
  )
}
