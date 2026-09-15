import type { Scenario } from './types'
import { TODAY } from './levers'

/**
 * Four named worldviews. Each is a coherent lever configuration, not a
 * prediction — the point is that reasonable people disagree about the levers,
 * not about the arithmetic.
 */
export const SCENARIOS: Scenario[] = [
  {
    id: 'today',
    name: 'Today',
    premise:
      'The levers where the best available evidence puts them in late 2026.',
    requires: 'Nothing. This is the baseline every other scenario departs from.',
    indicator:
      'Adoption of AI for core design work sitting near a third, and trust in shipping it sitting lower still.',
    levers: { ...TODAY },
  },
  {
    id: 'pencil',
    name: 'Faster pencil',
    premise:
      'Tools keep improving but stay assistive. Designers work faster; teams keep reviewing everything.',
    requires:
      'Verification stays expensive and nobody solves the trust problem. AI remains a drafting aid rather than a producer.',
    indicator:
      'Adoption climbing while willingness to ship unchecked output stays flat — the gap between the two widening rather than closing.',
    levers: { capability: 0.6, adoption: 0.7, trust: 0.25, demand: 1.3, ladder: 0.4 },
  },
  {
    id: 'compression',
    name: 'The compression',
    premise:
      'Capability and adoption both rise sharply while demand for design stays roughly flat. Teams get smaller and more senior.',
    requires:
      'Buyers of design treat it as a cost to be reduced rather than a capacity to be expanded — and trust rises far enough to ship production work unreviewed.',
    indicator:
      'Entry-level design postings falling while senior postings hold. This is the pattern US graphic design already shows: postings down 33% in 2025 after 12% in 2024.',
    levers: { capability: 0.85, adoption: 0.85, trust: 0.7, demand: 1.0, ladder: 0.15 },
  },
  {
    id: 'everywhere',
    name: 'Design everywhere',
    premise:
      'The cost of a designed artefact collapses, so far more things get designed. Demand expands faster than automation absorbs capacity.',
    requires:
      'Design was rationed by cost rather than by appetite — plausible in a market running a 4:1 developer-to-designer ratio, where most software ships with no designer on it at all.',
    indicator:
      'Design headcount growing even as output per designer rises, and design appearing on teams that never had it.',
    levers: { capability: 0.8, adoption: 0.85, trust: 0.55, demand: 2.1, ladder: 0.55 },
  },
  {
    id: 'taste',
    name: 'Taste economy',
    premise:
      'Production is almost entirely automated, but verification stays expensive. A small number of highly paid judgment roles; the middle hollows out.',
    requires:
      'AI output becomes uniformly competent and therefore undifferentiated, making taste and direction the only scarce inputs.',
    indicator:
      'Senior compensation pulling away from mid-level while the mid-level band stops growing — and "AI slop" becoming a competitive liability teams pay to avoid.',
    levers: { capability: 0.95, adoption: 0.9, trust: 0.45, demand: 1.4, ladder: 0.2 },
  },
]

export const DEFAULT_SCENARIO = 'today'

export function findScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id)
}
