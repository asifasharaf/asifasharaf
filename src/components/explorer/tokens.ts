import type { Quadrant } from '../../lib/explorer/types'

/**
 * Chart colours are CSS custom properties, never JS values.
 *
 * ThemeToggle.astro only flips `data-theme` on <html> — it fires no event and
 * exposes no callback. So a chart that read colours into JS would go stale on
 * every theme switch. Keeping every colour in CSS means charts re-paint on
 * theme change with no re-render and no listener.
 *
 * These are applied via the `style` attribute rather than as SVG presentation
 * attributes (`fill="rgb(var(--x))"`), which has long-standing gaps in WebKit,
 * and rather than via Tailwind `fill-*` classes, which are not in the safelist
 * in tailwind.config.mjs and would be purged.
 */
export function token(name: string, alpha = 1): string {
  return alpha === 1 ? `rgb(var(${name}))` : `rgb(var(${name}) / ${alpha})`
}

export const QUADRANT_TOKEN: Record<Quadrant, string> = {
  default: '--rgb-accent',
  contested: '--rgb-mustard',
  assisted: '--rgb-olive',
  human: '--rgb-cobalt',
}
