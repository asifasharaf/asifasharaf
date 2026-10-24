const swatches = ['bg-lime', 'bg-sun', 'bg-lilac', 'bg-mint', 'bg-pink', 'bg-sky', 'bg-coral']

/** Stable palette swatch for a person or company, so it doesn't change between builds. */
export function personColor(key: string): string {
  const n = [...key].reduce((a, c) => a + c.charCodeAt(0), 0)
  return swatches[n % swatches.length]
}
