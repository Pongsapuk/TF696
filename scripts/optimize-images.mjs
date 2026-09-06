/**
 * TF696 — derived image generation.
 *
 * Reads the archival masters in `img/` and writes responsive AVIF / WebP /
 * fallback derivatives into `src/assets/optimized/`. It is a development-only
 * build step: nothing here ships to the browser, and no file in `img/` is ever
 * opened for writing.
 *
 *   npm run optimize:images              regenerate anything missing or stale
 *   npm run optimize:images -- --force   regenerate everything
 *
 * Add a source here and `src/assets/images.js` picks it up automatically — it
 * globs this output directory at build time.
 */

import { createHash } from 'node:crypto'
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE_DIR = join(ROOT, 'img')
const OUTPUT_DIR = join(ROOT, 'src', 'assets', 'optimized')
const FORCE = process.argv.includes('--force')

/**
 * Width sets come from measured render sizes, not from a stock ladder. See
 * TF696_PHASE_5_MEDIA_PERFORMANCE_REPORT.md section 4. Any width wider than its
 * source is dropped with a warning rather than upscaled.
 */
const SOURCES = [
  {
    // Full-bleed LCP hero. `object-fit: cover` against a portrait viewport
    // crops by height, so small screens still resolve a wide source.
    name: 'hero',
    file: 'main6962.jpg',
    dir: 'hero',
    widths: [640, 960, 1280, 1600, 1920, 2400],
    // The 2400 tier exists for retina desktops. Every browser that reaches a
    // 2x desktop viewport decodes AVIF, so the fallback ladders stop at 1920
    // rather than emitting 1.5 MB nobody requests.
    fallbackWidths: [640, 960, 1280, 1600, 1920],
  },
  {
    name: 'direct-action',
    file: 'activity3.jpg',
    dir: 'operations',
    widths: [640, 960, 1280, 1600, 1920],
  },
  {
    name: 'aviation',
    file: 'activity2.jpg',
    dir: 'operations',
    widths: [640, 960, 1280, 1600, 1920],
  },
  {
    // Below-fold closing photograph, same full-bleed geometry as the hero,
    // capped at the 1920px source.
    name: 'final-cta',
    file: 'activity6.jpg',
    dir: 'final-cta',
    widths: [640, 960, 1280, 1600, 1920],
  },
  { name: 'legion', file: '557.png', dir: 'elements', widths: [600, 900, 1200] },
  { name: 'cohort', file: '2.png', dir: 'elements', widths: [600, 900, 1200] },
  { name: 'fortis', file: '3.png', dir: 'elements', widths: [600, 900, 1200] },
  {
    // Two-colour line art with real transparency, painted at 52-59 CSS px.
    // Lossy codecs ring on edges like these, so both outputs stay lossless and
    // the fallback is a quantised PNG rather than a JPEG. Lossless AVIF was
    // measured at 2.7x the lossless WebP for this artwork, so it is not emitted.
    name: 'logo',
    file: '696_Circle.png',
    dir: 'brand',
    widths: [64, 128, 192, 256],
    lossless: true,
  },
]

/**
 * Quality settings were chosen by looking at the decoded output, not by chasing
 * a byte target. Gear texture, faces, censor blocks, unit artwork and the
 * approved colour grade all have to survive.
 */
// AVIF 66 was picked by diffing 100% crops against the master at the same
// scale across 58/64/68/72/76. At 58 the gravel, camo micro-detail and the
// hero's film grain are visibly smoothed away; 66 restores them, and going
// past 68 buys nothing a viewer can see.
const PHOTO_AVIF = { quality: 66, effort: 6, chromaSubsampling: '4:2:0' }
const PHOTO_WEBP = { quality: 80, effort: 6, smartSubsample: true }
const PHOTO_JPEG = {
  quality: 80,
  mozjpeg: true,
  progressive: true,
  chromaSubsampling: '4:2:0',
}
const LOSSLESS_WEBP = { lossless: true, effort: 6 }
const LOSSLESS_PNG = { palette: true, quality: 100, effort: 10, compressionLevel: 9 }

const RESIZE = { fit: 'inside', withoutEnlargement: true, kernel: 'lanczos3' }

const PHOTO_FORMATS = [
  ['avif', 'avif', PHOTO_AVIF],
  ['webp', 'webp', PHOTO_WEBP],
  ['jpeg', 'jpg', PHOTO_JPEG],
]
const LOSSLESS_FORMATS = [
  ['webp', 'webp', LOSSLESS_WEBP],
  ['png', 'png', LOSSLESS_PNG],
]

/** Everything that identifies an output, so a stale derivative is detected. */
function stamp(source, width, format, digest) {
  return createHash('sha256')
    .update(
      JSON.stringify({
        digest,
        width,
        format,
        formats: source.lossless ? LOSSLESS_FORMATS : PHOTO_FORMATS,
        resize: RESIZE,
      }),
    )
    .digest('hex')
}

async function readPreviousOutputs() {
  if (FORCE) return {}
  try {
    const raw = await readFile(join(OUTPUT_DIR, 'manifest.json'), 'utf8')
    return JSON.parse(raw).outputs ?? {}
  } catch {
    return {}
  }
}

async function main() {
  if (FORCE) await rm(OUTPUT_DIR, { recursive: true, force: true })
  await mkdir(OUTPUT_DIR, { recursive: true })

  const previous = await readPreviousOutputs()
  const outputs = {}
  const sources = {}
  const rows = []
  let written = 0
  let reused = 0

  for (const source of SOURCES) {
    const sourcePath = join(SOURCE_DIR, source.file)
    const buffer = await readFile(sourcePath)
    const digest = createHash('sha256').update(buffer).digest('hex')
    const meta = await sharp(buffer).metadata()

    const oversized = source.widths.filter((width) => width > meta.width)
    if (oversized.length) {
      console.warn(
        `  ! ${source.file}: dropped ${oversized.join(', ')} — wider than the ${meta.width}px source`,
      )
    }
    const widths = source.widths.filter((width) => width <= meta.width)
    const fallbackWidths = (source.fallbackWidths ?? source.widths).filter(
      (width) => width <= meta.width,
    )
    if (!widths.length) throw new Error(`No usable width for ${source.file}`)

    await mkdir(join(OUTPUT_DIR, source.dir), { recursive: true })
    const formats = source.lossless ? LOSSLESS_FORMATS : PHOTO_FORMATS
    // The primary (first) format carries the full ladder; the fallback ladders
    // may stop earlier where the top tier would never be requested.
    const plan = formats.flatMap(([format, extension, options], index) =>
      (index === 0 ? widths : fallbackWidths).map((width) => [width, format, extension, options]),
    )

    for (const [width, format, extension, options] of plan) {
      const key = `${source.dir}/${source.name}-${width}.${extension}`
      const target = join(OUTPUT_DIR, key)
      const signature = stamp(source, width, format, digest)

      let bytes = null
      if (previous[key]?.stamp === signature) {
        bytes = await stat(target)
          .then((info) => info.size)
          .catch(() => null)
      }

      if (bytes == null) {
        let pipeline = sharp(buffer).resize({ width, ...RESIZE })
        // Photographic masters carry an unused alpha channel in two cases;
        // dropping it is free. The logo keeps its real transparency.
        if (!source.lossless) pipeline = pipeline.flatten({ background: '#050505' })
        bytes = (await pipeline[format](options).toFile(target)).size
        written += 1
      } else {
        reused += 1
      }

      outputs[key] = { stamp: signature, bytes, width, format }
      rows.push({ key, bytes })
    }

    sources[source.name] = {
      source: relative(ROOT, sourcePath).replace(/\\/g, '/'),
      sha256: digest,
      format: meta.format,
      width: meta.width,
      height: meta.height,
      bytes: buffer.length,
      widths,
      fallbackWidths,
    }
  }

  await writeFile(
    join(OUTPUT_DIR, 'manifest.json'),
    `${JSON.stringify({ generatedBy: 'scripts/optimize-images.mjs', sources, outputs }, null, 2)}\n`,
  )

  for (const row of rows) {
    console.log(`  ${row.key.padEnd(34)} ${String(row.bytes).padStart(9)} B`)
  }
  const total = rows.reduce((sum, row) => sum + row.bytes, 0)
  console.log(
    `\n${rows.length} derivatives — ${written} written, ${reused} reused — ${total} B on disk`,
  )
  console.log('Every file in img/ was opened read-only.')
}

await main()
