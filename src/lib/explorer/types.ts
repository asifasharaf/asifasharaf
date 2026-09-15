/**
 * Domain types for the design-work scenario model.
 *
 * The model's core claim is that AI adoption acts on *tasks*, not job titles.
 * Seniority matters only because it changes which tasks fill a week.
 */

/** The six phases a design week divides into. */
export type Phase =
  | 'discovery'
  | 'definition'
  | 'exploration'
  | 'production'
  | 'systems'
  | 'delivery'

/** Seniority bands. Volumes are calibrated per band. */
export type Role = 'junior' | 'mid' | 'senior' | 'lead'

/** Share of a working week, in percentage points, per seniority band. */
export type VolumeByRole = Record<Role, number>

export interface Task {
  id: string
  label: string
  phase: Phase
  /**
   * Intrinsic susceptibility to automation, 0-1 — the ceiling as model
   * capability rises without bound. Not a claim about today's tools.
   */
  automatability: number
  /**
   * Cost to a human of *checking* the output, 0-1. The model's brake: a task
   * can be highly automatable and still resist automation when verifying the
   * result costs as much as producing it.
   */
  verificationCost: number
  /** Irreducibly human share, 0-1 — taste, ambiguity, organisational politics. */
  judgmentLoad: number
  /** Share of the week, in percentage points. Each role's column sums to 100. */
  volume: VolumeByRole
  /** Why this task is scored the way it is. Surfaced in the UI on inspect. */
  note: string
}

export interface LeverDef {
  id: LeverId
  label: string
  /** One line explaining what the lever does to the model. */
  help: string
  /** Label shown at the low end of the track. */
  minLabel: string
  /** Label shown at the high end of the track. */
  maxLabel: string
  /** Value representing the present day, annotated on the track. */
  today: number
  /** Source or basis for the `today` calibration. */
  todayBasis: string
}

export type LeverId =
  | 'capability'
  | 'adoption'
  | 'trust'
  | 'demand'
  | 'ladder'

/** A full set of lever positions, each 0-1 except `demand`. */
export type Levers = Record<LeverId, number>

export interface Scenario {
  id: string
  name: string
  /** One-sentence summary of the world this describes. */
  premise: string
  /** What would have to be true for this to happen. */
  requires: string
  /** An observable signal that would tell you this is the path being taken. */
  indicator: string
  levers: Levers
}

/** Per-task model output. */
export interface TaskResult {
  task: Task
  /** Share of this task AI performs, 0-1, after every brake is applied. */
  automated: number
  /** Percentage points of the week this frees, for the selected role. */
  freed: number
  /** Which quadrant of the exposure matrix this task falls in. */
  quadrant: Quadrant
}

export type Quadrant = 'default' | 'assisted' | 'contested' | 'human'

export interface PhaseResult {
  phase: Phase
  /** Percentage points of the week before automation. */
  before: number
  /** Percentage points of the week remaining after automation. */
  after: number
}

export interface ModelResult {
  role: Role
  tasks: TaskResult[]
  phases: PhaseResult[]
  /** Share of the week AI absorbs, 0-1. */
  absorbed: number
  /** Share of remaining time that is judgment-loaded, before and after. */
  judgmentShareBefore: number
  judgmentShareAfter: number
  /**
   * Entry-level learnable task pool as an index against today (100 = today).
   * The tasks juniors historically learned the craft on.
   */
  entryPoolIndex: number
  /** Designer headcount index against today (100 = today). */
  headcountIndex: number
  /**
   * How much design demand would have to grow for headcount to hold flat,
   * as a multiplier. The Jevons threshold.
   */
  breakEvenDemand: number
  /** Junior share of a team, as a percentage of headcount. */
  juniorShare: number
}
