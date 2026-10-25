// Petroglyph-style marks on a 100×100 grid, drawn as single-weight strokes.
// `dot` shapes are filled; everything else is stroked with round caps.

export type Shape =
  | { p: string }
  | { c: [number, number, number] }
  | { dot: [number, number, number] }

const ray = (n: number, r1: number, r2: number, cx = 50, cy = 50, offset = 0) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + offset
    const x1 = cx + Math.cos(a) * r1
    const y1 = cy + Math.sin(a) * r1
    const x2 = cx + Math.cos(a) * r2
    const y2 = cy + Math.sin(a) * r2
    return `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`
  }).join(' ')

export const glyphs = {
  deer: [
    { p: 'M20 55 C32 48 54 47 67 51' },
    { p: 'M23 64 C38 67 52 67 65 62' },
    { p: 'M20 55 Q19 60 23 64 M67 51 L65 62' },
    { p: 'M66 52 L73 34 L84 37 L79 31 L73 34' },
    { p: 'M73 32 L69 17 M70 24 L63 18 M75 30 L80 15 M78 23 L86 19' },
    { p: 'M29 63 L25 85 M37 65 L39 85 M57 65 L55 85 M64 61 L69 85' },
    { p: 'M20 55 L13 49' },
  ],
  fish: [
    { p: 'M12 50 C28 31 60 31 74 50 C60 69 28 69 12 50 Z' },
    { p: 'M74 50 L90 37 L88 63 Z' },
    { p: 'M40 39 L40 61 M50 37 L50 63 M60 41 L60 59' },
    { dot: [27, 47, 3] },
  ],
  human: [
    { c: [50, 21, 10] },
    { dot: [46, 20, 1.8] },
    { dot: [54, 20, 1.8] },
    { p: 'M50 31 L50 62' },
    { p: 'M50 40 L33 31 L29 17 M50 40 L67 31 L71 17' },
    { p: 'M50 62 L37 88 M50 62 L63 88' },
  ],
  hunter: [
    { c: [44, 24, 9] },
    { p: 'M37 17 L33 8 M42 15 L41 5 M48 15 L50 5 M53 18 L58 10' },
    { p: 'M44 33 L44 62' },
    { p: 'M44 41 L28 52 M44 41 L60 47' },
    { p: 'M16 68 L74 18' },
    { p: 'M44 62 L34 88 M44 62 L56 88' },
  ],
  maker: [
    { c: [28, 24, 9] },
    { dot: [25, 23, 1.6] },
    { dot: [31, 23, 1.6] },
    { p: 'M28 33 L28 62' },
    { p: 'M28 62 L20 88 M28 62 L38 88' },
    { p: 'M28 42 L45 39 L55 33' },
    { p: 'M53 35 L62 26' },
    { p: 'M60 46 L89 46 L89 80 L60 80 Z' },
    { p: 'M57 43 h6 v6 h-6 Z M86 43 h6 v6 h-6 Z M57 77 h6 v6 h-6 Z M86 77 h6 v6 h-6 Z' },
  ],
  sun: [{ c: [50, 50, 14] }, { p: ray(12, 21, 34) }, { dot: [50, 50, 3.5] }],
  spiral: [
    {
      p: 'M50 50 C54 46 59 52 55 56 C49 62 40 55 44 46 C50 36 65 42 65 54 C65 69 45 73 36 61 C25 46 37 27 57 30 C73 33 82 48 78 63',
    },
  ],
  rings: [{ c: [50, 50, 30] }, { c: [50, 50, 15] }, { dot: [50, 50, 4] }],
  eye: [
    { p: 'M10 50 C30 26 70 26 90 50 C70 74 30 74 10 50 Z' },
    { c: [50, 50, 11] },
    { dot: [50, 50, 4] },
  ],
  boat: [
    { p: 'M6 62 C28 74 66 74 82 60 C88 52 90 40 94 26' },
    { p: 'M6 62 L4 54' },
    { p: 'M22 64 L20 48 M34 67 L32 50 M46 67 L44 50 M58 66 L56 49 M70 63 L68 46' },
    { dot: [20, 44, 3] },
    { dot: [32, 46, 3] },
    { dot: [44, 46, 3] },
    { dot: [56, 45, 3] },
    { dot: [68, 42, 3] },
  ],
  waves: [{ p: 'M8 38 Q18 28 28 38 T48 38 T68 38 T88 38' }, { p: 'M8 60 Q18 50 28 60 T48 60 T68 60 T88 60' }],
  hills: [{ p: 'M6 76 L25 40 L40 62 L57 28 L73 58 L84 44 L95 76' }, { p: 'M50 40 L57 28 L64 40' }],
  fern: [
    { p: 'M50 92 L50 12' },
    { p: 'M50 28 L34 18 M50 28 L66 20 M50 44 L30 34 M50 44 L70 36 M50 60 L33 52 M50 60 L67 54 M50 76 L38 70 M50 76 L62 72' },
  ],
  bird: [
    { p: 'M10 46 C28 34 40 38 50 46 C60 38 72 34 90 46' },
    { p: 'M50 46 L50 66 M50 46 L50 34 L56 30' },
    { p: 'M22 43 L20 56 M31 40 L30 54 M40 42 L40 54 M60 42 L60 54 M69 40 L70 54 M78 43 L80 56' },
  ],
  lizard: [
    { c: [50, 14, 6] },
    { p: 'M50 20 C46 36 54 50 50 68 C48 78 54 86 46 94' },
    { p: 'M49 32 L35 28 L31 21 M51 32 L65 28 L69 21 M50 56 L36 62 L32 70 M50 56 L64 62 L68 70' },
  ],
  hand: [
    { p: 'M36 88 C30 74 28 62 32 52 L28 30' },
    { p: 'M40 50 L39 18 M50 49 L50 13 M60 50 L61 18' },
    { p: 'M66 56 L79 40' },
    { p: 'M64 88 C72 76 72 64 66 56' },
    { p: 'M32 52 C40 46 58 46 66 56' },
  ],
  wheel: [{ c: [50, 50, 30] }, { p: ray(8, 6, 30) }, { c: [50, 50, 6] }],
  flower: [{ p: ray(8, 8, 26) }, ...Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2
    return { dot: [50 + Math.cos(a) * 32, 50 + Math.sin(a) * 32, 4] as [number, number, number] }
  }), { dot: [50, 50, 5] }],
  cursor: [{ p: 'M30 14 L30 76 L44 62 L54 86 L65 81 L55 58 L76 58 Z' }],
  pen: [
    { p: 'M14 76 C28 22 72 22 86 76' },
    { p: 'M14 76 L30 30 M86 76 L70 30' },
    { c: [30, 30, 4] },
    { c: [70, 30, 4] },
    { p: 'M10 72 h8 v8 h-8 Z M82 72 h8 v8 h-8 Z' },
  ],
  chart: [
    { p: 'M14 14 L14 86 L90 86' },
    { p: 'M22 70 L38 50 L52 60 L70 32 L86 40' },
    { dot: [38, 50, 3.5] },
    { dot: [70, 32, 3.5] },
  ],
  dots: [
    { dot: [30, 36, 5] },
    { dot: [52, 28, 5] },
    { dot: [70, 46, 5] },
    { dot: [40, 62, 5] },
    { dot: [62, 72, 5] },
  ],
  tally: [{ p: 'M24 26 L24 74 M38 26 L38 74 M52 26 L52 74 M66 26 L66 74 M14 64 L78 36' }],
  tent: [{ p: 'M50 14 L84 84 L16 84 Z' }, { p: 'M50 14 L42 4 M50 14 L58 4' }, { p: 'M40 84 L50 62 L60 84' }],
} satisfies Record<string, Shape[]>

export type GlyphName = keyof typeof glyphs
