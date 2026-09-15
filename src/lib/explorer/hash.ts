import { LEVERS, LEVER_RANGE, TODAY, clampLevers } from './levers'
import { DEFAULT_SCENARIO, findScenario } from './scenarios'
import { ROLES } from './tasks'
import type { Levers, Role } from './types'

/**
 * URL-fragment codec for a shareable scenario.
 *
 * Fragments never reach the server, so a static page keeps exactly one cache
 * entry however many scenarios get shared, and the scenario stays out of
 * analytics page URLs.
 *
 * Format: `v1.<scenarioId>.<role>.<capability>-<adoption>-<trust>-<demand>-<ladder>`
 * with levers as integers (hundredths). Readable, short, and the version
 * prefix lets a future change reject stale links instead of misreading them.
 */
const VERSION = 'v1'
export const HASH_PREFIX = `#${VERSION}.`

export interface ExplorerState {
  scenarioId: string
  role: Role
  levers: Levers
}

export const DEFAULT_STATE: ExplorerState = {
  scenarioId: DEFAULT_SCENARIO,
  role: 'mid',
  levers: { ...TODAY },
}

const LEVER_ORDER = LEVERS.map((l) => l.id)

export function encodeState(state: ExplorerState): string {
  const levers = LEVER_ORDER.map((id) => Math.round(state.levers[id] * 100)).join('-')
  return `${VERSION}.${state.scenarioId}.${state.role}.${levers}`
}

/**
 * Decode a fragment. Total by construction: any malformed, out-of-range or
 * unknown value falls back to the default rather than throwing, because the
 * hash is untrusted input that feeds chart scale domains — one NaN would
 * silently blank a chart.
 */
export function decodeState(raw: string): ExplorerState {
  const text = raw.replace(/^#/, '')
  if (!text.startsWith(`${VERSION}.`)) return { ...DEFAULT_STATE }

  const parts = text.slice(VERSION.length + 1).split('.')
  if (parts.length < 3) return { ...DEFAULT_STATE }

  const [scenarioRaw, roleRaw, leversRaw] = parts

  const scenarioId = findScenario(scenarioRaw) ? scenarioRaw : DEFAULT_SCENARIO
  const role = ROLES.some((r) => r.id === roleRaw)
    ? (roleRaw as Role)
    : DEFAULT_STATE.role

  const values = (leversRaw ?? '').split('-')
  const partial: Partial<Levers> = {}
  LEVER_ORDER.forEach((id, i) => {
    const raw = values[i]
    // Number('') is 0, which would silently read as a real setting rather than
    // a missing one, so require actual digits before trusting the segment.
    if (!raw || !/^\d+$/.test(raw)) return
    const n = Number(raw)
    if (!Number.isFinite(n)) return
    const { min, max } = LEVER_RANGE[id]
    partial[id] = Math.min(max, Math.max(min, n / 100))
  })

  return { scenarioId, role, levers: clampLevers(partial) }
}

/** True when the levers still match the named scenario exactly. */
export function matchesScenario(state: ExplorerState): boolean {
  const scenario = findScenario(state.scenarioId)
  if (!scenario) return false
  return LEVER_ORDER.every(
    (id) => Math.round(scenario.levers[id] * 100) === Math.round(state.levers[id] * 100)
  )
}
