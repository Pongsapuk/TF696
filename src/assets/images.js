/**
 * Build-time index of the derived images in `src/assets/optimized/`.
 *
 * `scripts/optimize-images.mjs` writes those files; this module turns them into
 * ready-made `srcSet` strings. The glob is resolved by Vite at build time, so
 * every derivative is hashed, emitted and cached like any other asset — there
 * is no runtime fetching, no viewport measurement and no image library. The
 * browser still does all source selection natively from `srcset` + `sizes`.
 *
 * `?no-inline` keeps the small derivatives (a few are under Vite's 4 kB inline
 * threshold) as real files, so they stay cacheable and out of the JS bundle.
 */

const MIME = {
  avif: 'image/avif',
  webp: 'image/webp',
  jpg: 'image/jpeg',
  png: 'image/png',
}

const files = import.meta.glob('./optimized/**/*.{avif,webp,jpg,png}', {
  eager: true,
  query: '?no-inline',
  import: 'default',
})

/** `./optimized/hero/hero-1280.avif` → group `hero`, width `1280`, ext `avif`. */
const PATTERN = /^\.\/optimized\/[^/]+\/(.+)-(\d+)\.(avif|webp|jpg|png)$/

const groups = new Map()

for (const [path, url] of Object.entries(files)) {
  const match = PATTERN.exec(path)
  if (!match) continue
  const [, name, width, extension] = match

  if (!groups.has(name)) groups.set(name, new Map())
  const byExtension = groups.get(name)
  if (!byExtension.has(extension)) byExtension.set(extension, [])
  byExtension.get(extension).push({ url, width: Number(width) })
}

function srcSet(entries) {
  return entries
    .slice()
    .sort((a, b) => a.width - b.width)
    .map((entry) => `${entry.url} ${entry.width}w`)
    .join(', ')
}

/**
 * Returns the `<source>` list and `<img>` fallback for one derived image set.
 *
 * @param {string} name — the derivative base name, e.g. `hero`, `aviation`.
 * @returns {{ sources: { type: string, srcSet: string }[], src: string, srcSet: string }}
 */
export function imageSet(name) {
  const byExtension = groups.get(name)
  if (!byExtension) {
    throw new Error(
      `No derived images for "${name}". Run \`npm run optimize:images\` and check scripts/optimize-images.mjs.`,
    )
  }

  // Modern formats become <source> elements in preference order; whichever of
  // jpg/png this set uses stays on the <img> as the universal fallback.
  const fallbackExtension = byExtension.has('jpg') ? 'jpg' : 'png'
  const fallback = byExtension.get(fallbackExtension)
  const widest = fallback.reduce((a, b) => (a.width > b.width ? a : b))

  const sources = ['avif', 'webp']
    .filter((extension) => byExtension.has(extension))
    .map((extension) => ({ type: MIME[extension], srcSet: srcSet(byExtension.get(extension)) }))

  return { sources, src: widest.url, srcSet: srcSet(fallback) }
}
