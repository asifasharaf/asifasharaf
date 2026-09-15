import type { Phase, Role, Task } from './types'

/**
 * The task atlas.
 *
 * CALIBRATION NOTE — read before trusting any number here.
 *
 * `automatability`, `verificationCost` and `judgmentLoad` are the author's
 * estimates, scored consistently across tasks rather than measured. No public
 * dataset scores design tasks this way. They are grounded in two things that
 * *are* observable: what shipping design tools could actually do end-to-end as
 * of late 2026, and the Figma 2026 finding that 72% of designers use generative
 * AI somewhere but only ~31% for core design work and only ~32% trust output
 * enough to ship it — i.e. the brake is verification, not capability.
 *
 * `volume` is likewise an estimate, built from the author's decade in product
 * design and sanity-checked against the shape of Indian services delivery,
 * where juniors carry production and seniors carry framing and negotiation.
 * Each role's column sums to exactly 100 points of a working week.
 *
 * The model is a reasoning tool, not a forecast. Change the numbers and the
 * conclusions change — which is the point of shipping it as an explorer.
 */
export const TASKS: Task[] = [
  // ── Discovery ────────────────────────────────────────────────────────────
  {
    id: 'recruit',
    label: 'Participant recruiting & scheduling',
    phase: 'discovery',
    automatability: 0.85,
    verificationCost: 0.2,
    judgmentLoad: 0.2,
    volume: { junior: 4, mid: 3, senior: 2, lead: 1 },
    note: 'Screening, outreach and calendar wrangling are mechanical, and a bad recruit is obvious immediately.',
  },
  {
    id: 'interviews',
    label: 'Running user interviews',
    phase: 'discovery',
    automatability: 0.35,
    verificationCost: 0.7,
    judgmentLoad: 0.65,
    volume: { junior: 3, mid: 4, senior: 4, lead: 2 },
    note: 'Scripted questions automate well. Knowing which unscripted thread to pull does not, and you cannot tell from a transcript what was never asked.',
  },
  {
    id: 'synthesis',
    label: 'Research synthesis & tagging',
    phase: 'discovery',
    automatability: 0.75,
    verificationCost: 0.65,
    judgmentLoad: 0.55,
    volume: { junior: 4, mid: 4, senior: 3, lead: 2 },
    note: 'Clustering transcripts is genuinely strong now. The failure mode is a fluent theme that nobody actually said, which is expensive to catch.',
  },
  {
    id: 'competitive',
    label: 'Competitive & heuristic audit',
    phase: 'discovery',
    automatability: 0.8,
    verificationCost: 0.35,
    judgmentLoad: 0.3,
    volume: { junior: 2, mid: 2, senior: 1, lead: 1 },
    note: 'Enumerating what competitors do is retrieval. Checking it is a matter of looking.',
  },
  {
    id: 'survey',
    label: 'Survey design & analysis',
    phase: 'discovery',
    automatability: 0.7,
    verificationCost: 0.45,
    judgmentLoad: 0.35,
    volume: { junior: 1, mid: 1, senior: 1, lead: 0 },
    note: 'Instrument drafting and stats are well-trodden. Leading questions are the risk.',
  },

  // ── Definition ───────────────────────────────────────────────────────────
  {
    id: 'framing',
    label: 'Problem framing',
    phase: 'definition',
    automatability: 0.25,
    verificationCost: 0.85,
    judgmentLoad: 0.85,
    volume: { junior: 2, mid: 4, senior: 8, lead: 11 },
    note: 'The highest-stakes verification in design: a wrong frame produces confident, coherent, well-crafted work that solves nothing, and it stays invisible until launch.',
  },
  {
    id: 'prioritisation',
    label: 'Scoping & prioritisation',
    phase: 'definition',
    automatability: 0.3,
    verificationCost: 0.75,
    judgmentLoad: 0.75,
    volume: { junior: 1, mid: 3, senior: 7, lead: 9 },
    note: 'Deciding what not to build depends on context that mostly lives in people’s heads.',
  },
  {
    id: 'metrics',
    label: 'Defining success metrics',
    phase: 'definition',
    automatability: 0.45,
    verificationCost: 0.7,
    judgmentLoad: 0.6,
    volume: { junior: 1, mid: 2, senior: 4, lead: 6 },
    note: 'Proposing metrics is easy. Noticing that a metric will be gamed is not.',
  },
  {
    id: 'alignment',
    label: 'Stakeholder alignment',
    phase: 'definition',
    automatability: 0.1,
    verificationCost: 0.6,
    judgmentLoad: 0.9,
    volume: { junior: 1, mid: 4, senior: 7, lead: 10 },
    note: 'Organisational politics is not a text-generation problem. Someone has to be accountable in the room.',
  },

  // ── Exploration ──────────────────────────────────────────────────────────
  {
    id: 'sketching',
    label: 'Concept sketching',
    phase: 'exploration',
    automatability: 0.6,
    verificationCost: 0.4,
    judgmentLoad: 0.55,
    volume: { junior: 4, mid: 5, senior: 5, lead: 3 },
    note: 'Generating concepts is cheap now; knowing which one is worth an afternoon is the skill.',
  },
  {
    id: 'variants',
    label: 'Divergent variant generation',
    phase: 'exploration',
    automatability: 0.9,
    verificationCost: 0.35,
    judgmentLoad: 0.25,
    volume: { junior: 4, mid: 4, senior: 3, lead: 2 },
    note: 'The single task current tools are unambiguously better at than humans: volume of plausible options, fast.',
  },
  {
    id: 'visualDirection',
    label: 'Visual & art direction',
    phase: 'exploration',
    automatability: 0.55,
    verificationCost: 0.75,
    judgmentLoad: 0.8,
    volume: { junior: 3, mid: 4, senior: 4, lead: 2 },
    note: 'Taste is expensive to verify — you cannot unit-test whether a direction is right for a brand.',
  },

  // ── Production ───────────────────────────────────────────────────────────
  {
    id: 'wireframes',
    label: 'Wireframing',
    phase: 'production',
    automatability: 0.85,
    verificationCost: 0.25,
    judgmentLoad: 0.25,
    volume: { junior: 8, mid: 6, senior: 3, lead: 1 },
    note: 'Structural layout from a described flow is close to solved, and errors are visible at a glance.',
  },
  {
    id: 'hifi',
    label: 'High-fidelity UI',
    phase: 'production',
    automatability: 0.8,
    verificationCost: 0.5,
    judgmentLoad: 0.4,
    volume: { junior: 13, mid: 9, senior: 4, lead: 1 },
    note: 'The largest single block of a junior week, and among the most exposed.',
  },
  {
    id: 'layout',
    label: 'Responsive states & edge cases',
    phase: 'production',
    automatability: 0.85,
    verificationCost: 0.3,
    judgmentLoad: 0.25,
    volume: { junior: 7, mid: 5, senior: 2, lead: 0 },
    note: 'Enumerating breakpoints, empty states and error states is exactly the kind of completeness work machines do without getting bored.',
  },
  {
    id: 'iconography',
    label: 'Icons & illustration',
    phase: 'production',
    automatability: 0.88,
    verificationCost: 0.2,
    judgmentLoad: 0.3,
    volume: { junior: 4, mid: 2, senior: 1, lead: 0 },
    note: 'Generative image tools hit this first and hardest. It is also where the US graphic-design contraction shows up most clearly.',
  },
  {
    id: 'uxCopy',
    label: 'UX copy & microcopy',
    phase: 'production',
    automatability: 0.85,
    verificationCost: 0.5,
    judgmentLoad: 0.4,
    volume: { junior: 4, mid: 3, senior: 2, lead: 1 },
    note: 'Language models’ home turf. Tone and legal nuance still need a human read.',
  },
  {
    id: 'prototyping',
    label: 'Interactive prototyping',
    phase: 'production',
    automatability: 0.75,
    verificationCost: 0.35,
    judgmentLoad: 0.3,
    volume: { junior: 5, mid: 4, senior: 2, lead: 1 },
    note: 'Prompt-to-prototype has collapsed the cost of a clickable artefact from days to minutes.',
  },
  {
    id: 'specs',
    label: 'Redlines, specs & handoff docs',
    phase: 'production',
    automatability: 0.9,
    verificationCost: 0.2,
    judgmentLoad: 0.15,
    volume: { junior: 3, mid: 2, senior: 1, lead: 0 },
    note: 'Deterministic documentation derived from a file. Little judgment, cheap to check.',
  },
  {
    id: 'assets',
    label: 'Asset preparation & export',
    phase: 'production',
    automatability: 0.95,
    verificationCost: 0.1,
    judgmentLoad: 0.05,
    volume: { junior: 2, mid: 1, senior: 0, lead: 0 },
    note: 'The most automatable task in design, and already largely gone.',
  },

  // ── Systems ──────────────────────────────────────────────────────────────
  {
    id: 'components',
    label: 'Component building',
    phase: 'systems',
    automatability: 0.8,
    verificationCost: 0.55,
    judgmentLoad: 0.35,
    volume: { junior: 4, mid: 4, senior: 3, lead: 1 },
    note: 'Variants and props follow rules. Deciding what should be a component does not.',
  },
  {
    id: 'tokens',
    label: 'Token & library maintenance',
    phase: 'systems',
    automatability: 0.75,
    verificationCost: 0.5,
    judgmentLoad: 0.3,
    volume: { junior: 3, mid: 3, senior: 2, lead: 1 },
    note: 'Mechanical upkeep, with real consequences when it drifts.',
  },
  {
    id: 'documentation',
    label: 'System documentation',
    phase: 'systems',
    automatability: 0.85,
    verificationCost: 0.3,
    judgmentLoad: 0.2,
    volume: { junior: 2, mid: 3, senior: 2, lead: 2 },
    note: 'Writing up decisions someone else made is a summarisation task.',
  },
  {
    id: 'audits',
    label: 'Consistency & QA audits',
    phase: 'systems',
    automatability: 0.88,
    verificationCost: 0.25,
    judgmentLoad: 0.15,
    volume: { junior: 3, mid: 2, senior: 2, lead: 1 },
    note: 'Machines are better than people at noticing the fourteenth inconsistent shade of grey.',
  },

  // ── Delivery ─────────────────────────────────────────────────────────────
  {
    id: 'handoff',
    label: 'Dev handoff & pairing',
    phase: 'delivery',
    automatability: 0.4,
    verificationCost: 0.5,
    judgmentLoad: 0.55,
    volume: { junior: 5, mid: 5, senior: 4, lead: 2 },
    note: 'Specs automate; the conversation about what is actually feasible this sprint does not.',
  },
  {
    id: 'critique',
    label: 'Design review & critique',
    phase: 'delivery',
    automatability: 0.3,
    verificationCost: 0.8,
    judgmentLoad: 0.85,
    volume: { junior: 3, mid: 4, senior: 7, lead: 10 },
    note: 'A model will tell you the contrast ratio is wrong. It will not tell you the whole direction is a dead end and be willing to own that call.',
  },
  {
    id: 'usability',
    label: 'Usability testing',
    phase: 'delivery',
    automatability: 0.55,
    verificationCost: 0.6,
    judgmentLoad: 0.5,
    volume: { junior: 3, mid: 4, senior: 4, lead: 3 },
    note: 'Moderation and note-taking automate. Synthetic users remain a weak proxy for real confusion.',
  },
  {
    id: 'roadmap',
    label: 'Roadmap negotiation',
    phase: 'delivery',
    automatability: 0.15,
    verificationCost: 0.65,
    judgmentLoad: 0.9,
    volume: { junior: 1, mid: 2, senior: 6, lead: 13 },
    note: 'Trading scope against time with people who have competing incentives. Almost entirely social.',
  },
  {
    id: 'mentoring',
    label: 'Mentoring & growing designers',
    phase: 'delivery',
    automatability: 0.2,
    verificationCost: 0.7,
    judgmentLoad: 0.9,
    volume: { junior: 0, mid: 1, senior: 6, lead: 14 },
    note: 'Note the circularity: this is among the least automatable tasks, and it depends on there being juniors to mentor.',
  },
]

/** Display order and labels for phases. */
export const PHASES: { id: Phase; label: string; /** CSS custom property. */ token: string }[] = [
  { id: 'discovery', label: 'Discovery', token: '--rgb-cobalt' },
  { id: 'definition', label: 'Definition', token: '--rgb-mustard' },
  { id: 'exploration', label: 'Exploration', token: '--rgb-rose' },
  { id: 'production', label: 'Production', token: '--rgb-accent' },
  { id: 'systems', label: 'Systems', token: '--rgb-olive' },
  { id: 'delivery', label: 'Delivery', token: '--rgb-fg' },
]

export const ROLES: { id: Role; label: string; note: string }[] = [
  { id: 'junior', label: 'Junior', note: '0–2 years. Production carries the week.' },
  { id: 'mid', label: 'Mid', note: '2–5 years. Still making most of the artefacts.' },
  { id: 'senior', label: 'Senior', note: '5–10 years. Framing and review take over.' },
  { id: 'lead', label: 'Lead', note: '10+ years. Mostly judgment, negotiation and people.' },
]

/**
 * Tasks a designer historically learned the craft by doing — the rungs of the
 * entry ladder. Used to compute the entry-level pool index.
 */
export const ENTRY_LADDER_TASKS = new Set([
  'recruit',
  'synthesis',
  'competitive',
  'wireframes',
  'hifi',
  'layout',
  'iconography',
  'uxCopy',
  'prototyping',
  'specs',
  'assets',
  'components',
  'tokens',
  'documentation',
  'audits',
  'variants',
])
