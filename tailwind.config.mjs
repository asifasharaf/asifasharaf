import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  safelist: [
    'text-accent',
    'text-olive',
    'text-rose',
    'text-mustard',
    'text-cobalt',
    'bg-accent',
    'bg-olive',
    'bg-rose',
    'bg-mustard',
    'bg-cobalt',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--rgb-bg) / <alpha-value>)',
        fg: 'rgb(var(--rgb-fg) / <alpha-value>)',
        accent: 'rgb(var(--rgb-accent) / <alpha-value>)',
        olive: 'rgb(var(--rgb-olive) / <alpha-value>)',
        rose: 'rgb(var(--rgb-rose) / <alpha-value>)',
        mustard: 'rgb(var(--rgb-mustard) / <alpha-value>)',
        cobalt: 'rgb(var(--rgb-cobalt) / <alpha-value>)',
        muted: 'rgb(var(--rgb-muted) / <alpha-value>)',
        border: 'rgb(var(--rgb-border) / <alpha-value>)',
        surface: 'rgb(var(--rgb-surface) / <alpha-value>)',
        ink: 'rgb(var(--rgb-ink) / <alpha-value>)',
        lime: 'rgb(var(--rgb-lime) / <alpha-value>)',
        sun: 'rgb(var(--rgb-sun) / <alpha-value>)',
        coral: 'rgb(var(--rgb-coral) / <alpha-value>)',
        mint: 'rgb(var(--rgb-mint) / <alpha-value>)',
        lilac: 'rgb(var(--rgb-lilac) / <alpha-value>)',
        pink: 'rgb(var(--rgb-pink) / <alpha-value>)',
        sky: 'rgb(var(--rgb-sky) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['"Bricolage Grotesque"', ...defaultTheme.fontFamily.sans],
        sans: ['"DM Sans"', ...defaultTheme.fontFamily.sans],
        mono: ['"DM Mono"', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
}
