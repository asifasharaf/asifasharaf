import { ENTRY_LADDER_TASKS, PHASES, TASKS } from './tasks'
import { TODAY } from './levers'
import type {
  Levers,
  ModelResult,
  PhaseResult,
  Quadrant,
  Role,
  Task,
  TaskResult,
} from './types'

/** Verification cost weights the trust exponent. Higher = a harder brake. */
const VERIFICATION_WEIGHT = 2

/**
 * Capability is concave: the first half of the curve delivers most of the easy
 * wins, because the tasks that are intrinsically susceptible are also the ones
 * current tools already handle. A linear multiplier badly understates the
 * present day — it implied AI saves a junior 4% of a week, which is not what
 * designers report.
 */
const CAPABILITY_EXPONENT = 0.6

/**
 * How much of a task AI absorbs, 0-1.
 *
 * Four stages, each of which can independently stop automation:
 *
 *   reach     capability decides how much of the task's intrinsic
 *             susceptibility is actually available
 *   used      adoption decides how much of that is put to work
 *   gate      trust, raised to a power set by verification cost — a task
 *             nobody can cheaply check stays human even when trust is decent
 *   ceiling   judgment load is irreducible and caps the result outright
 *
 * The gate is the load-bearing idea. `trust ** (1 + 2 * verificationCost)`
 * means a cheap-to-check task passes through at close to the trust level,
 * while an expensive-to-check task is crushed: at today's trust of 0.32,
 * asset export (verification 0.1) gates at 0.27, but problem framing
 * (verification 0.85) gates at 0.05.
 */
export function automatedShare(task: Task, levers: Levers): number {
  const reach = task.automatability * Math.pow(levers.capability, CAPABILITY_EXPONENT)
  const used = reach * levers.adoption
  const gate = Math.pow(levers.trust, 1 + VERIFICATION_WEIGHT * task.verificationCost)
  const ceiling = 1 - task.judgmentLoad
  return clamp01(Math.min(used * gate + used * (1 - gate) * assistFactor(task), ceiling))
}

/**
 * Even when a team reviews everything, using AI to produce a first draft still
 * saves time — just less of it, and less on tasks that are expensive to check.
 * This is the assisted channel: it keeps the model honest about the fact that
 * designers demonstrably save time today at a trust level of only ~0.32.
 */
function assistFactor(task: Task): number {
  return clamp01(0.75 * (1 - 0.5 * task.verificationCost))
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.min(1, Math.max(0, n))
}

/**
 * Quadrant thresholds, set at the medians of the atlas rather than at round
 * numbers so that the four labels describe where tasks actually sit.
 */
export const AUTO_SPLIT = 0.7
export const VERIFY_SPLIT = 0.5

/** Which quadrant of the exposure matrix a task sits in. */
export function quadrantOf(task: Task): Quadrant {
  const highAuto = task.automatability >= AUTO_SPLIT
  const highVerify = task.verificationCost >= VERIFY_SPLIT
  if (highAuto && !highVerify) return 'default' // automated by default
  if (highAuto && highVerify) return 'contested'
  if (!highAuto && !highVerify) return 'assisted'
  return 'human'
}

export const QUADRANTS: Record<Quadrant, { label: string; blurb: string }> = {
  default: {
    label: 'Automated by default',
    blurb:
      'Easy for a machine, cheap for a human to check. These go first, and largely already have.',
  },
  contested: {
    label: 'Contested',
    blurb:
      'A machine can do it, but checking it is expensive. Whether these move depends almost entirely on how much unchecked output teams tolerate.',
  },
  assisted: {
    label: 'Assisted',
    blurb:
      'Hard to automate end-to-end, but cheap to verify — so AI speeds them up without taking them over.',
  },
  human: {
    label: 'Stays human',
    blurb:
      'Hard to automate and expensive to check. Judgment, taste and accountability live here.',
  },
}

/** Run the model for one role at one set of lever positions. */
export function runModel(role: Role, levers: Levers): ModelResult {
  const tasks: TaskResult[] = TASKS.map((task) => {
    const automated = automatedShare(task, levers)
    return {
      task,
      automated,
      freed: task.volume[role] * automated,
      quadrant: quadrantOf(task),
    }
  })

  const totalVolume = TASKS.reduce((sum, t) => sum + t.volume[role], 0) || 1
  const totalFreed = tasks.reduce((sum, t) => sum + t.freed, 0)
  const absorbed = clamp01(totalFreed / totalVolume)

  const phases: PhaseResult[] = PHASES.map(({ id }) => {
    const inPhase = tasks.filter((t) => t.task.phase === id)
    const before = inPhase.reduce((s, t) => s + t.task.volume[role], 0)
    const after = inPhase.reduce((s, t) => s + (t.task.volume[role] - t.freed), 0)
    return { phase: id, before, after }
  })

  // Judgment share: how much of the time that remains is judgment-loaded.
  const judgmentBefore = TASKS.reduce(
    (s, t) => s + t.volume[role] * t.judgmentLoad,
    0
  )
  const remainingByTask = tasks.map((t) => t.task.volume[role] - t.freed)
  const remainingTotal = remainingByTask.reduce((s, v) => s + v, 0)
  const judgmentAfter = tasks.reduce(
    (s, t, i) => s + remainingByTask[i] * t.task.judgmentLoad,
    0
  )

  // Entry ladder: the pool of work a newcomer could learn the craft on,
  // indexed against the same pool at today's lever positions.
  const entryPoolNow = entryPool(levers)
  const entryPoolToday = entryPool(TODAY)
  const rawEntryIndex = entryPoolToday > 0 ? (entryPoolNow / entryPoolToday) * 100 : 0
  // Ladder repair partially offsets the loss by deliberately creating
  // learning work that no longer arises naturally.
  const entryPoolIndex = clamp(
    rawEntryIndex + levers.ladder * (100 - rawEntryIndex) * 0.45,
    0,
    200
  )

  // Headcount: demand raises the work, automation raises throughput per head.
  const throughput = 1 / Math.max(0.05, 1 - absorbed)
  const headcountIndex = clamp((levers.demand / throughput) * 100, 0, 400)

  // The Jevons threshold: demand growth needed to hold headcount flat.
  const breakEvenDemand = throughput

  // Junior share of a team follows the learnable-work pool, damped — a team
  // cannot be all juniors however much entry work exists.
  const baseJuniorShare = 28 // author's estimate of a typical team today, %
  const juniorShare = clamp(baseJuniorShare * (entryPoolIndex / 100), 0, 45)

  return {
    role,
    tasks,
    phases,
    absorbed,
    judgmentShareBefore: judgmentBefore / totalVolume,
    judgmentShareAfter: remainingTotal > 0 ? judgmentAfter / remainingTotal : 0,
    entryPoolIndex,
    headcountIndex,
    breakEvenDemand,
    juniorShare,
  }
}

/**
 * Volume of entry-ladder work surviving at these lever positions, measured on
 * a junior's week — the rungs a newcomer would actually get to climb.
 */
function entryPool(levers: Levers): number {
  return TASKS.filter((t) => ENTRY_LADDER_TASKS.has(t.id)).reduce((sum, t) => {
    return sum + t.volume.junior * (1 - automatedShare(t, levers))
  }, 0)
}

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min
  return Math.min(max, Math.max(min, n))
}
