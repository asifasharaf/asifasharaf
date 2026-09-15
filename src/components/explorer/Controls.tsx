import { useExplorer } from './state'
import { token } from './tokens'
import { LEVERS, LEVER_RANGE } from '../../lib/explorer/levers'
import { SCENARIOS } from '../../lib/explorer/scenarios'
import { ROLES } from '../../lib/explorer/tasks'
import type { LeverId } from '../../lib/explorer/types'

/** Named worldviews. Selecting one overwrites every lever. */
export function ScenarioTabs() {
  const { state, dispatch } = useExplorer()
  const isCustom = state.scenarioId === 'custom'

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Scenario presets">
        {SCENARIOS.map((s) => {
          const active = state.scenarioId === s.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => dispatch({ type: 'scenario', id: s.id })}
              aria-pressed={active}
              className={`tag-btn ${active ? 'active' : ''}`}
            >
              {s.name}
            </button>
          )
        })}
        {isCustom && (
          <span className="tag-btn active cursor-default" aria-current="true">
            Custom
          </span>
        )}
      </div>

      <p className="text-muted text-sm mt-4 leading-relaxed max-w-2xl min-h-[2.5rem]">
        {isCustom
          ? 'Your own settings. Pick a named scenario to return to a documented starting point.'
          : SCENARIOS.find((s) => s.id === state.scenarioId)?.premise}
      </p>
    </div>
  )
}

/** Seniority selector — changes which tasks fill the week, nothing else. */
export function RoleSelector() {
  const { state, dispatch } = useExplorer()
  const current = ROLES.find((r) => r.id === state.role)

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Seniority">
        {ROLES.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => dispatch({ type: 'role', role: r.id })}
            aria-pressed={state.role === r.id}
            className={`tag-btn ${state.role === r.id ? 'active' : ''}`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <p className="text-muted text-sm mt-3">{current?.note}</p>
    </div>
  )
}

function formatLever(id: LeverId, value: number): string {
  if (id === 'demand') return `${value.toFixed(2)}×`
  return `${Math.round(value * 100)}%`
}

/** The five levers. */
export function LeverSliders() {
  const { state, dispatch } = useExplorer()

  return (
    <div className="space-y-7">
      {LEVERS.map((lever) => {
        const range = LEVER_RANGE[lever.id]
        const value = state.levers[lever.id]
        const atToday = Math.abs(value - lever.today) < range.step / 2
        const todayPct = ((lever.today - range.min) / (range.max - range.min)) * 100

        return (
          <div key={lever.id}>
            <div className="flex items-baseline justify-between gap-4 mb-1.5">
              <label htmlFor={`lever-${lever.id}`} className="text-fg text-sm">
                {lever.label}
              </label>
              <span
                className="font-mono text-sm tabular-nums"
                style={{ color: token(atToday ? '--rgb-muted' : '--rgb-accent') }}
              >
                {formatLever(lever.id, value)}
              </span>
            </div>

            <div className="relative">
              <input
                id={`lever-${lever.id}`}
                type="range"
                min={range.min}
                max={range.max}
                step={range.step}
                value={value}
                onChange={(e) =>
                  dispatch({ type: 'lever', id: lever.id, value: Number(e.target.value) })
                }
                aria-describedby={`help-${lever.id}`}
                aria-valuetext={`${formatLever(lever.id, value)} — ${lever.label}`}
                className="explorer-range w-full"
              />
              {/* today marker */}
              <span
                aria-hidden="true"
                className="absolute -bottom-1 w-px h-2 pointer-events-none"
                style={{ left: `${todayPct}%`, backgroundColor: token('--rgb-fg', 0.45) }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-muted mt-2 font-mono">
              <span>{lever.minLabel}</span>
              <span>{lever.maxLabel}</span>
            </div>

            <p id={`help-${lever.id}`} className="text-muted text-xs mt-2 leading-relaxed">
              {lever.help}
            </p>
          </div>
        )
      })}
      <p className="text-muted text-xs border-t border-border pt-4 leading-relaxed">
        The tick under each track marks where the evidence puts that lever today.
        Sources and reasoning are in the method note at the end.
      </p>
    </div>
  )
}
