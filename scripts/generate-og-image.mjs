/**
 * TF696 — social preview (Open Graph) image.
 *
 * Derives `public/og-image.jpg` at exactly 1200 x 630 from the approved hero
 * master, `img/main6962.jpg`. Nothing is redrawn, recoloured, re-graded or
 * captioned: the card is a crop of the same photograph the hero already paints,
 * so an unfurled link and the page it opens look like the same site.
 *
 * Why 1200 x 630: it is the size Facebook, Discord, LINE, Slack and X all treat
 * as a large summary card, and the one `og:image:width` / `og:image:height` in
 * `index.html` declare. Why JPEG: every unfurler in that list decodes it. AVIF
 * and WebP are not universally supported by the crawlers, and the point of this
 * file is to be read by other people's servers, not by a modern browser.
 *
 * The master is opened read-only, and the run aborts if its hash moves.
 *
 *   npm run og:generate
 */
import { createHash } from 'node:crypto'
import { mkdir, readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const MASTER = resolve(ROOT, 'img/main6962.jpg')
const OUT_DIR = resolve(ROOT, 'public')
const OUT = resolve(OUT_DIR, 'og-image.jpg')

const WIDTH = 1200
const HEIGHT = 630

/**
 * The master is a 3508 x 2400 print-styled plate: the photograph sits inside a
 * paper-white frame. Measured off the raw pixels (luminance 255 to the edge),
 * that frame is 57 px left, 63 px top, 58 px right and 76 px bottom, leaving a
 * 3394 x 2261 photographic content box.
 *
 * The crop stays strictly inside it. A card that carried the frame on some
 * edges and cut it on others would read as a mistake, and every unfurler crops
 * or rounds the corners differently anyway.
 */
const PHOTO = { left: 57, top: 63, width: 3394, height: 2261 }

/**
 * 1200 x 630 is 40:21, much wider than the 3394 x 2261 content box, so the crop
 * takes essentially the full width and loses height.
 *
 * The width is trimmed from 3394 to 3360 — the nearest multiple of 40 — so that
 * 40:21 lands on whole pixels (3360 x 1764) and the downscale is a pure
 * resample with no aspect correction and no distortion. The 34 px difference is
 * split evenly left and right.
 *
 * The crop is anchored to the BOTTOM of the photo rather than centred. What
 * matters is the team — figures standing and kneeling across the full width,
 * whose boots reach the lower edge of the plate. Centring would trade their
 * feet for empty sky; bottom-anchoring matches the plate’s own lower edge and
 * still clears the tallest helmet by roughly 160 px (about 57 px on the card).
 */
const CROP_WIDTH = Math.floor(PHOTO.width / 40) * 40
const CROP_HEIGHT = (CROP_WIDTH / WIDTH) * HEIGHT
const CROP = {
  left: PHOTO.left + Math.round((PHOTO.width - CROP_WIDTH) / 2),
  top: PHOTO.top + PHOTO.height - CROP_HEIGHT,
  width: CROP_WIDTH,
  height: CROP_HEIGHT,
}

/**
 * Quality 84 with mozjpeg. Chosen by looking at the decoded output at 1:1: the
 * master carries a deliberate film-grain and paper texture, and grain is the
 * first thing a low-quality JPEG smears. 84 holds it. Progressive costs nothing
 * and 4:4:4 keeps the desaturated grade from blotching at this small size.
 */
const JPEG = {
  quality: 84,
  mozjpeg: true,
  progressive: true,
  chromaSubsampling: '4:4:4',
}

async function main() {
  const before = createHash('sha256').update(await readFile(MASTER)).digest('hex')

  const meta = await sharp(MASTER).metadata()
  const right = CROP.left + CROP.width
  const bottom = CROP.top + CROP.height
  if (right > meta.width || bottom > meta.height) {
    throw new Error(
      `crop ${CROP.width}x${CROP.height}+${CROP.left}+${CROP.top} falls outside the ${meta.width}x${meta.height} master`,
    )
  }

  await mkdir(OUT_DIR, { recursive: true })

  const info = await sharp(MASTER)
    .extract(CROP)
    .resize(WIDTH, HEIGHT, { fit: 'cover', kernel: 'lanczos3' })
    .jpeg(JPEG)
    .toFile(OUT)

  if (info.width !== WIDTH || info.height !== HEIGHT) {
    throw new Error(`expected ${WIDTH}x${HEIGHT}, got ${info.width}x${info.height}`)
  }

  const after = createHash('sha256').update(await readFile(MASTER)).digest('hex')
  if (before !== after) throw new Error('the hero master was modified — aborting')

  const digest = createHash('sha256').update(await readFile(OUT)).digest('hex')
  console.log(`source          img/main6962.jpg  ${meta.width}x${meta.height}`)
  console.log(`crop            ${CROP.width}x${CROP.height}+${CROP.left}+${CROP.top}`)
  console.log(`public/og-image.jpg  ${info.width}x${info.height}  ${info.size} B`)
  console.log(`output sha256   ${digest}`)
  console.log(`master untouched sha256 ${after.slice(0, 32)}`)
}

await main()
