/**
 * Minimal pure scale helpers for the hand-rolled SVG charts.
 *
 * Charts use a fixed viewBox and CSS width rather than measuring the DOM, so
 * the server-rendered SVG is byte-identical to the client's first render and
 * hydration never mismatches.
 */

export interface Scale {
  (value: number): number
}

/** Map a domain onto a pixel range, clamped to the range. */
export function linear(
  d0: number,
  d1: number,
  r0: number,
  r1: number
): Scale {
  const span = d1 - d0
  return (value: number) => {
    if (!Number.isFinite(value) || span === 0) return r0
    const t = (value - d0) / span
    const clamped = Math.min(1, Math.max(0, t))
    return r0 + clamped * (r1 - r0)
  }
}

/** Evenly spaced tick values across a domain, inclusive of both ends. */
export function ticks(d0: number, d1: number, count: number): number[] {
  if (count < 2) return [d0, d1]
  const step = (d1 - d0) / (count - 1)
  return Array.from({ length: count }, (_, i) => d0 + i * step)
}

/** An SVG path through points, with no smoothing. */
export function linePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return ''
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${round(p.x)} ${round(p.y)}`)
    .join(' ')
}

/** Round to 2dp — keeps SSR and client output identical and the DOM small. */
export function round(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.round(n * 100) / 100
}

/** Bubble radius from a share-of-week value, by area rather than by radius. */
export function bubbleRadius(share: number, max: number, rMax: number): number {
  if (max <= 0 || share <= 0) return 0
  return Math.max(2.5, Math.sqrt(share / max) * rMax)
}

/** Percent with no decimals, locale-free so the build and browser agree. */
export function pct(n: number): string {
  return `${Math.round(n * 100)}%`
}

/** A signed index difference against a 100 baseline, e.g. "−44" or "+28". */
export function deltaFrom100(index: number): string {
  const d = Math.round(index - 100)
  if (d === 0) return 'no change'
  return `${d > 0 ? '+' : '−'}${Math.abs(d)}`
}
