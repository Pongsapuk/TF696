import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { HERO_SIZES } from './src/assets/hero-sizes.js'

/**
 * The hero is the LCP element, but it is rendered by React — so the preload
 * scanner cannot see it in index.html and the request only starts after the JS
 * bundle has downloaded, parsed and rendered. This injects a `<link rel=
 * "preload">` carrying the hero's AVIF `imagesrcset`/`imagesizes`, so the fetch
 * begins with the first HTML bytes instead.
 *
 * `imagesrcset` + `imagesizes` mean the preload obeys the same native source
 * selection as the `<picture>` — the browser picks one derivative, and it is
 * the same one the markup would have picked, so nothing is downloaded twice.
 * Filenames are read out of the emitted bundle, so the content hashes always
 * match, and `HERO_SIZES` is imported from the same module `HeroSection.jsx`
 * uses so the two can never disagree.
 */
/** GitHub Pages project-page subpath for `Pongsapuk/TF696`. See `base`. */
const BASE = '/TF696/'

const HERO_ASSET = /(^|\/)hero-(\d+)-[^/]+\.avif$/

function preloadHero() {
  return {
    name: 'tf696-preload-hero',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const entries = Object.keys(ctx.bundle ?? {})
          .map((name) => [name, HERO_ASSET.exec(name)])
          .filter(([, match]) => match)
          .map(([name, match]) => ({ name, width: Number(match[2]) }))
          .sort((a, b) => a.width - b.width)

        if (!entries.length) {
          this.warn('No hero AVIF derivative found — skipping the LCP preload.')
          return html
        }

        const srcset = entries.map((e) => `${BASE}${e.name} ${e.width}w`).join(', ')
        const widest = entries[entries.length - 1]

        return {
          html,
          tags: [
            {
              tag: 'link',
              attrs: {
                rel: 'preload',
                as: 'image',
                type: 'image/avif',
                href: `${BASE}${widest.name}`,
                imagesrcset: srcset,
                imagesizes: HERO_SIZES,
                fetchpriority: 'high',
              },
              injectTo: 'head',
            },
          ],
        }
      },
    },
  }
}

export default defineConfig({
  /**
   * The production target is now confirmed: a GitHub Pages *project* page for
   * the `Pongsapuk/TF696` repository, served at
   * https://pongsapuk.github.io/TF696/.
   *
   * So the base is the repository subpath, stated deliberately rather than
   * left as the portable `'./'` placeholder Phases 2A–6 carried. `'/'` would be
   * wrong — every asset would resolve against the origin root, which belongs to
   * the user site, not this repository.
   */
  base: BASE,
  plugins: [react(), tailwindcss(), preloadHero()],
})
