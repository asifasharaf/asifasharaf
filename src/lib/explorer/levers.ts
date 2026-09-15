import type { LeverDef, Levers, LeverId } from './types'

/**
 * The five inputs.
 *
 * Shape borrowed from Anthropic's Econ Scenario Explorer, which propagates
 * capability / adoption / autonomy / productivity / adjustment-speed through
 * task bundles. Two of ours are design-specific: `trust` (will a team ship
 * unchecked output) and `ladder` (does anyone rebuild the entry rung).
 */
export const LEVERS: LeverDef[] = [
  {
    id: 'capability',
    label: 'Tool capability',
    help: 'How far along the capability curve design tools get. Scales how much of each task’s intrinsic susceptibility is actually reachable.',
    minLabel: 'Stalls at 2026',
    maxLabel: 'Superhuman craft',
    today: 0.4,
    todayBasis: 'Author’s estimate of shipping tools in late 2026: strong on generation, weak on end-to-end ownership.',
  },
  {
    id: 'adoption',
    label: 'Adoption for core work',
    help: 'Share of design work actually done with AI in the loop — not the share of designers who have tried it.',
    minLabel: 'None',
    maxLabel: 'Universal',
    today: 0.4,
    todayBasis:
      'Estimated from two measured endpoints: 72% of designers use generative AI somewhere in their work, but only ~31% use it for core design work (Figma, 2026). Neither is a share of *work*, so 0.40 is an interpolation, not a measurement.',
  },
  {
    id: 'trust',
    label: 'Willingness to ship unchecked',
    help: 'How much AI output teams ship without a human pass. Interacts with each task’s verification cost — this is the model’s main brake.',
    minLabel: 'Everything reviewed',
    maxLabel: 'Ship it',
    today: 0.32,
    todayBasis: '~32% of designers trust AI output enough to ship it to production. Figma, 2026.',
  },
  {
    id: 'demand',
    label: 'Demand for design',
    help: 'Does cheaper design mean more design gets made, or the same amount with fewer people? Expressed as a multiplier on total design work.',
    minLabel: '0.6× contraction',
    maxLabel: '2.5× expansion',
    today: 1.15,
    todayBasis: 'India runs a ~4:1 developer-to-designer ratio and UX postings grew ~40% (2024–2026) — design is structurally undersupplied, so demand is already rising.',
  },
  {
    id: 'ladder',
    label: 'Ladder repair',
    help: 'How deliberately teams rebuild an entry path once the tasks juniors learned on are automated.',
    minLabel: 'Nobody rebuilds',
    maxLabel: 'Deliberate investment',
    today: 0.25,
    todayBasis: 'Indian IT services is the precedent and it did not rebuild: fresher intake fell from ~600k (FY22) to ~120k (FY25).',
  },
]

export const LEVER_RANGE: Record<LeverId, { min: number; max: number; step: number }> = {
  capability: { min: 0, max: 1, step: 0.01 },
  adoption: { min: 0, max: 1, step: 0.01 },
  trust: { min: 0, max: 1, step: 0.01 },
  demand: { min: 0.6, max: 2.5, step: 0.05 },
  ladder: { min: 0, max: 1, step: 0.01 },
}

/** Lever positions describing the present day. */
export const TODAY: Levers = {
  capability: 0.4,
  adoption: 0.4,
  trust: 0.32,
  demand: 1.15,
  ladder: 0.25,
}

export function clampLevers(input: Partial<Levers>): Levers {
  const out = { ...TODAY }
  for (const { id } of LEVERS) {
    const raw = input[id]
    if (typeof raw !== 'number' || !Number.isFinite(raw)) continue
    const { min, max } = LEVER_RANGE[id]
    out[id] = Math.min(max, Math.max(min, raw))
  }
  return out
}
