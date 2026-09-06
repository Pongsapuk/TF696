/**
 * The hero's `sizes` attribute, shared so it cannot drift.
 *
 * Two consumers must agree exactly, or the LCP preload fetches one derivative
 * and the `<picture>` then fetches a different one:
 *   - `src/components/sections/HeroSection.jsx` — the rendered markup
 *   - `vite.config.js` — the injected `<link rel="preload" imagesizes>`
 *
 * Why it is not just `100vw`: the hero is `object-fit: cover` over
 * `min-height: max(100svh, 44rem)`, so on a portrait viewport the crop is
 * driven by height, not width. At 375x812 the image is painted about 1187 CSS
 * px wide, not 375 — a plain `100vw` would under-select by roughly 3x and the
 * result is visibly soft. Fully honouring that would mean asking a phone for a
 * ~3500px source, which is not a real option, so these values are a measured
 * compromise:
 *
 *   <=767px   130vw — a 375px phone at 2x resolves 1280w (~222 kB)
 *   <=1023px  115vw — a 768px tablet at 2x resolves 1920w (~461 kB)
 *   wider     100vw — width genuinely drives the cover here, so this is exact
 */
export const HERO_SIZES = '(max-width: 767px) 130vw, (max-width: 1023px) 115vw, 100vw'
