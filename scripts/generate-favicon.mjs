/**
 * Derives the browser identity icons from the canonical TF696 logo.
 *
 * Why this exists (Phase 6):
 * `img/favicon.ico` is a legacy asset. It is a valid 16/32/48 ICO, but it
 * carries an *older* circular mark (hooded figure, no valknut, no rune ring)
 * and its light values are crushed almost to black — measured on its own 48px
 * frame, the 95th-percentile luminance of the opaque pixels is 81/255 and the
 * median is 0. On a browser tab it reads as a black disc. It is therefore not
 * wired up; it is left in place, untouched, as an archival asset.
 *
 * Instead the icons are derived from the approved canonical logo,
 * `img/696_Circle.png`, by cropping to the emblem's exact content box and
 * downscaling. Nothing is recoloured, redrawn, restyled or re-composed: the
 * artwork that reaches the tab is the same artwork the navbar paints. For the
 * same 48px frame the derived p95 luminance is 241/255.
 *
 * The master is opened read-only and never written to. Outputs go to public/.
 *
 *   node scripts/generate-favicon.mjs
 */
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const MASTER = resolve(ROOT, 'img/696_Circle.png')
const OUT_DIR = resolve(ROOT, 'public')

/**
 * The emblem's content box inside the 3508 x 2480 master, measured from the
 * alpha channel (alpha > 8). It is square to within one pixel, which is what
 * a circular mark should be — so the crop needs no letterboxing and the icon
 * is not distorted.
 */
const EMBLEM = { left: 538, top: 30, width: 2442, height: 2443 }

/** Sizes carried inside favicon.ico. */
const ICO_SIZES = [16, 32, 48]

/** iOS home-screen icon. Flattened, because iOS composites transparency itself. */
const APPLE_SIZE = 180
const APPLE_INSET = 0.84
const BRAND_CANVAS = '#050505'

/**
 * Frames are stored as PNG rather than as raw BITMAPINFOHEADER + BGRA, which
 * the legacy file used. The icon is fetched above the fold, and measured on
 * this artwork the uncompressed form costs 15,086 B against 5,880 B for PNG —
 * so BMP would have handed back 9 kB of the saving Phase 5 just bought. Every
 * browser from IE11 on, and Windows Vista on, reads PNG-in-ICO. The PNG
 * encoding is lossless: it was compared against the truecolour encode and came
 * out byte-for-byte the same size, i.e. sharp is already storing it as
 * grey+alpha with no quantisation.
 */
function icoFromFrames(frames) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(frames.length, 4)

  const directory = Buffer.alloc(16 * frames.length)
  let offset = header.length + directory.length

  frames.forEach((frame, index) => {
    const entry = 16 * index
    directory[entry] = frame.size === 256 ? 0 : frame.size
    directory[entry + 1] = frame.size === 256 ? 0 : frame.size
    directory.writeUInt16LE(1, entry + 4) // colour planes
    directory.writeUInt16LE(32, entry + 6) // bits per pixel
    directory.writeUInt32LE(frame.png.length, entry + 8)
    directory.writeUInt32LE(offset, entry + 12)
    offset += frame.png.length
  })

  return Buffer.concat([header, directory, ...frames.map((f) => f.png)])
}

const emblem = () => sharp(MASTER).extract(EMBLEM)

async function main() {
  const before = createHash('sha256').update(await readFile(MASTER)).digest('hex')

  await mkdir(OUT_DIR, { recursive: true })

  const frames = []
  for (const size of ICO_SIZES) {
    const png = await emblem()
      .resize(size, size, { kernel: 'lanczos3' })
      .ensureAlpha()
      .png({ compressionLevel: 9 })
      .toBuffer()
    frames.push({ size, png })
  }

  const ico = icoFromFrames(frames)
  await writeFile(resolve(OUT_DIR, 'favicon.ico'), ico)

  const inner = Math.round(APPLE_SIZE * APPLE_INSET)
  const margin = Math.round((APPLE_SIZE - inner) / 2)
  const mark = await emblem().resize(inner, inner, { kernel: 'lanczos3' }).png().toBuffer()
  await sharp({
    create: {
      width: APPLE_SIZE,
      height: APPLE_SIZE,
      channels: 4,
      background: BRAND_CANVAS,
    },
  })
    .composite([{ input: mark, top: margin, left: margin }])
    .png({ compressionLevel: 9 })
    .toFile(resolve(OUT_DIR, 'apple-touch-icon.png'))

  const after = createHash('sha256').update(await readFile(MASTER)).digest('hex')
  if (before !== after) throw new Error('the logo master was modified — aborting')

  console.log(`favicon.ico          ${ico.length} B  (${ICO_SIZES.join('/')})`)
  console.log(`apple-touch-icon.png ${APPLE_SIZE}x${APPLE_SIZE}`)
  console.log(`master untouched     sha256 ${after.slice(0, 32)}`)
}

await main()
