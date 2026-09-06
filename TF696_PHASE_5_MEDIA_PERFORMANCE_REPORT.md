# TF696 Phase 5 — Media & Performance Report

## 1. Executive Summary

Phase 5 replaces every image the application actually ships with responsive
AVIF / WebP / fallback derivatives generated from the untouched archival
masters, and adds an LCP preload for the client-rendered Hero. No section was
redesigned, no copy changed, and no runtime dependency was added.

The headline result, **measured in a real browser on both sides**, not
estimated:

| | Before | After (375 × 812 @2x) | After (1920 × 1080 @1x) |
|---|---:|---:|---:|
| Above-the-fold image bytes | 4,546,113 | **227,336** (−95.0%) | **463,679** (−89.8%) |
| Whole-page image bytes | 12,009,580 | **387,214** (−96.8%) | **726,701** (−93.9%) |

Before Phase 5 every visitor at every viewport downloaded the same 12.0 MB of
imagery, because there was no `srcset` anywhere. A phone now downloads 387 kB
for the entire page.

The single largest finding of the audit was that **`activity2.jpg` and
`activity6.jpg` are not JPEGs at all** — they are PNG files with a `.jpg`
extension. That, not their resolution, is why two 1920 × 1080 screenshots
weighed 3.2 MB and 3.5 MB. Re-encoding them as what they are accounts for most
of the below-the-fold saving (§6, §8).

Three of the four Phase 4 accessible-heading defects were fixed with the
minimum possible markup change, and one turned out not to exist (§12). The fix
was proven to change nothing visually by an A/B build comparison: **0 differing
layout probes** across four viewports.

`npm run lint` and `npm run build` both pass. All 28 archival `img/` and
`audio/` files remain byte-identical to the recovery archive.

## 2. Before Optimization

Baseline production build (`npm run build` on the Phase 4 tree, reproduced from
source for this report and byte-identical to the Phase 4 figures):

```text
dist/index.html                          0.93 kB
dist/assets/557-BvEBGRGL.png           136.63 kB
dist/assets/2-DxhLqVo4.png             171.38 kB
dist/assets/activity3-BHFngZ3E.jpg     189.50 kB
dist/assets/3-CNcA2ut7.png             217.37 kB
dist/assets/696_Circle-B3U3MkpE.png  1,073.11 kB
dist/assets/activity2-uQjNLhbu.jpg   3,242.62 kB
dist/assets/main6962-DaEdVtSb.jpg    3,472.64 kB
dist/assets/activity6-N2QImgG5.jpg   3,504.87 kB
dist/assets/index-BmIKzuI7.css          41.74 kB │ gzip: 8.72 kB
dist/assets/index-BgL6Dqyj.js          211.37 kB │ gzip: 65.10 kB
```

- Emitted image bytes: **12,008,156 (11.45 MiB) across 8 files**
- Whole `dist/`: 12,262,207 bytes

Every image was a single unconditional `<img src>`. There was no `srcset`, no
`sizes`, no `<picture>`, and no modern format anywhere, so the transfer was
identical at 320 px and at 1920 px. Browser-measured, all seven test viewports
returned exactly **4,546,113 bytes above the fold and 12,009,580 bytes for the
whole page**.

## 3. Asset Audit

Every image actually imported by the React application. Nothing else in `img/`
was touched — `556.png`, `696HVT.png`, `696SQ.png`, `activity1/4/5.jpg`,
`sq887.jpg`, `threelogo.jpg`, `main696.*`, `logo-20xx.png`, `discord.png`,
`facebook.png`, `favicon.ico` and `tf696.mp4` are unused and were deliberately
left alone.

| Master | Real format | Dimensions | Bytes | Used by | Above fold | Role | Loading (before) |
|---|---|---:|---:|---|---|---|---|
| `main6962.jpg` | JPEG | 3508 × 2400 | 3,472,645 | Hero background | **Yes (LCP)** | Decorative (`alt=""`) | eager, `fetchpriority=high` |
| `696_Circle.png` | PNG + alpha | 3508 × 2480 | 1,073,111 | Navbar brand mark | **Yes** | Decorative (`alt=""`) | eager, default priority |
| `activity3.jpg` | JPEG | 1920 × 1080 | 189,501 | Operations 01 — Direct Action | No | **Meaningful** (Thai `alt`) | lazy, async |
| `activity2.jpg` | **PNG mislabelled `.jpg`** | 1920 × 1080 | 3,242,623 | Operations 02 — Aviation | No | **Meaningful** (Thai `alt`) | lazy, async |
| `557.png` | PNG, alpha unused | 1200 × 300 | 136,636 | Elements — LEGION banner | No | Decorative | lazy, async |
| `2.png` | PNG, alpha unused | 1200 × 300 | 171,389 | Elements — COHORT banner | No | Decorative | lazy, async |
| `3.png` | PNG, alpha unused | 1200 × 300 | 217,372 | Elements — FORTIS banner | No | Decorative | lazy, async |
| `activity6.jpg` | **PNG mislabelled `.jpg`** | 1920 × 1080 | 3,504,879 | Final CTA background | No | Decorative | lazy, async |

Findings that shaped the work:

1. **`activity2.jpg` and `activity6.jpg` are PNGs.** Verified by decoding the
   container (`sharp().metadata().format === 'png'`), not by trusting the
   extension. A 1920 × 1080 photographic screenshot stored as PNG is roughly
   17× the size of the same frame stored as a well-tuned JPEG. This is the
   whole reason those two files are 3.2 MB and 3.5 MB.
2. **`557.png`, `2.png` and `3.png` carry an alpha channel that is entirely
   opaque** (measured: alpha min = max = 255 on all three). The channel was
   pure overhead; the derivatives drop it.
3. **`696_Circle.png` has real transparency** (alpha min 0, max 255) and is
   two-colour line art. It is painted at 52 × 37 CSS px — the master is 3508 px
   wide, roughly **67× larger in each dimension than it is ever displayed**.
4. **`main6962.jpg` carries a 3,144-byte IEC sRGB ICC profile.** sRGB is the
   assumed default, so dropping it is free and changes no colour.
5. `activity6.jpg` is byte-identical to `main696.jpg` (both
   `sha256 219f7dbe…`). Only one derivative set was generated.

## 4. Derived Image Strategy

### Where the files live

```text
src/assets/optimized/
├── brand/        logo-{64,128,192,256}.{webp,png}
├── elements/     {legion,cohort,fortis}-{600,900,1200}.{avif,webp,jpg}
├── final-cta/    final-cta-{640,960,1280,1600,1920}.{avif,webp,jpg}
├── hero/         hero-{640,960,1280,1600,1920,2400}.avif
│                 hero-{640,960,1280,1600,1920}.{webp,jpg}
├── operations/   {direct-action,aviation}-{640,960,1280,1600,1920}.{avif,webp,jpg}
└── manifest.json
```

96 derivatives, 8,128,886 bytes on disk. `img/` is never written to — the
generator opens masters read-only and every output goes to this separate tree.
Derived files are **committed**, so `npm install && npm run build` works on a
clean checkout with no image tooling installed.

### How the widths were chosen

Widths come from measured render sizes, not a stock ladder. The container caps
at 88 rem / 1408 px with 64 px gutters at ≥1536 px, so the widest content box
is 1280 CSS px.

| Set | Widest painted (CSS px) | Reasoning | Widths |
|---|---:|---|---|
| Hero | viewport-driven, see §5 | Full-bleed `cover` | 640 / 960 / 1280 / 1600 / 1920 / 2400 |
| Operations `--wide` | ~1223 | 100% → 91% (≥768) → 88% (≥1440) of container | 640 / 960 / 1280 / 1600 / 1920 |
| Operations `--offset` | ~1048 | 100% → 78% (≥768) → 72% (≥1440) | 640 / 960 / 1280 / 1600 / 1920 |
| Elements banners | ~1236 | 100% → 92% (≥1024) → 88% (≥1440) | 600 / 900 / 1200 |
| Final CTA | viewport-driven, see §8 | Full-bleed `cover`, 1920 source cap | 640 / 960 / 1280 / 1600 / 1920 |
| Logo | 58.4 | Fixed CSS size, covers 1×–4× | 64 / 128 / 192 / 256 |

**No derivative exceeds its source width.** The generator filters oversized
entries and warns rather than upscaling; the 1920 × 1080 and 1200 × 300 sources
therefore stop where they stop.

### Quality settings

`PHOTO_AVIF q66 / effort 6`, `PHOTO_WEBP q80 / effort 6 / smartSubsample`,
`PHOTO_JPEG q80 mozjpeg progressive`, Lanczos-3 resampling.

AVIF quality was **not** guessed. 1920-wide encodes at q58 / 64 / 68 / 72 / 76
were decoded and compared against the master resized to the same width, at 100%
on identical crops. At q58 the hero's film grain, the gravel texture and the
camo micro-detail were visibly smoothed away, and the same happened to the wall
texture in the Final CTA. q66 restores them; past q68 nothing further is
visible. The cost of that decision was +9.4% on the emitted tree (7.43 MB at
q58 → 8.13 MB at q66), which buys back detail the brief explicitly asks to
preserve.

The logo is a separate case and is documented in §9.

### Format chain

`<picture>` offers AVIF, then WebP, then a JPEG (or PNG for the logo) fallback
on the `<img>` itself. The fallback ladder is not decoration — it is a real
ladder at every width, so a browser without AVIF still gets responsive WebP,
and a browser with neither still gets responsive JPEG.

One deliberate asymmetry: the hero's 2400 px tier exists only for retina
desktops, and every browser that reaches a 2× desktop viewport decodes AVIF.
Emitting a 2400 WebP and JPEG as well would have added 1.56 MB to `dist/` that
nothing would ever request, so the hero's fallback ladders stop at 1920.

## 5. Hero Optimization

`main6962.jpg` (3508 × 2400, 3,472,645 bytes) → six AVIF tiers, five WebP,
five JPEG.

| Width | AVIF | WebP | JPEG |
|---:|---:|---:|---:|
| 640 | 55,248 | 63,154 | 56,146 |
| 960 | 126,029 | 145,350 | 127,969 |
| 1280 | 221,596 | 263,494 | 228,730 |
| 1600 | 331,115 | 397,210 | 350,699 |
| 1920 | 461,315 | 550,626 | 491,115 |
| 2400 | 689,944 | — | — |

**Preserved unchanged:** the crop and composition, all four `object-position`
breakpoints (`50%` < 768, `54%` ≥ 768, `58%` ≥ 1024, `center` ≥ 1440), both
`hero__overlay` gradient stacks, the `hero__grain` overlay, and the declared
intrinsic size `width="3508" height="2400"` — so the reserved box and the
aspect ratio are exactly what they were, and there is no new layout shift.

### The `sizes` problem, and what was done about it

The hero is `object-fit: cover` over `min-height: max(100svh, 44rem)`. On a
portrait viewport the crop is driven by **height**, not width. At 375 × 812 the
image is painted about **1187 CSS px wide, not 375**. A plain `sizes="100vw"`
would therefore under-select by roughly 3×, and the result is visibly soft.

Honouring that exactly would mean asking a phone for a ~3500 px source, which
is not a real option for anyone. The value shipped is a measured compromise,
kept in one shared module (`src/assets/hero-sizes.js`) so it cannot drift from
the preload:

```text
(max-width: 767px) 130vw, (max-width: 1023px) 115vw, 100vw
```

Above 1024 px width genuinely does drive the cover, so `100vw` there is exact,
not a compromise. §14 shows what the browser actually picks.

### Loading

`loading="eager"`, `decoding="sync"`, `fetchpriority="high"` — never lazy.

Because the hero is rendered by React, the preload scanner cannot see it in
`index.html`; the request would only start after the JS bundle downloads,
parses and renders. A small build-only Vite plugin (`vite.config.js`) therefore
injects:

```html
<link rel="preload" as="image" type="image/avif"
      href="./assets/hero-2400-l2WFLcVS.avif"
      imagesrcset="./assets/hero-640-….avif 640w, … 2400w"
      imagesizes="(max-width: 767px) 130vw, (max-width: 1023px) 115vw, 100vw"
      fetchpriority="high">
```

It reads the emitted filenames out of the bundle, so the content hashes can
never go stale, and it uses the same `HERO_SIZES` import the component uses.
Because `imagesrcset` + `imagesizes` run the same native selection as the
markup, the preload and the `<picture>` resolve to the same file. **Verified:
exactly one hero request at every one of the seven viewports** — no
double-fetch (§14).

## 6. Operations Optimization

| | `activity3.jpg` → `direct-action` | `activity2.jpg` → `aviation` |
|---|---:|---:|
| Master | 189,501 B (real JPEG) | 3,242,623 B (**PNG mislabelled `.jpg`**) |
| AVIF 640 → 1920 | 12,308 → 70,983 | 22,402 → 118,553 |
| Typical served (1440 @1x) | 37,254 (1280w) | 63,433 (1280w) |

`activity2` was the priority named in the brief and it is the biggest single
win outside the hero: 3.24 MB → **63.4 kB** at a typical desktop viewport, purely
because the file is now encoded as the photograph it is.

**Preserved unchanged:** both compositions, the Thai `alt` text on both images,
the captions and `figcaption` structure, the orange `01`/`02` markers, the
16/10 → 16/9 `aspect-ratio` switch at 1024 px, `object-position: 55% center` on
the wide story, `loading="lazy"` and `decoding="async"`.

`sizes` is per-story, because the two stories are different widths:

```text
--wide    (min-width: 1536px) 1130px, (min-width: 1440px) 88vw, (min-width: 768px) 91vw, 100vw
--offset  (min-width: 1536px)  925px, (min-width: 1440px) 72vw, (min-width: 768px) 78vw, 100vw
```

Both slightly over-declare inside each band, which is the safe direction — the
browser may pick one tier up, never one tier short.

## 7. Elements Optimization

The brief asked for an audit first and said not to convert for the sake of it.
Measured, conversion is clearly worth it — and the alpha channel on all three
masters is fully opaque, so it was dropped.

| Banner | Master PNG | AVIF 1200 | AVIF 900 | AVIF 600 |
|---|---:|---:|---:|---:|
| `557.png` → legion | 136,636 | 7,343 | 5,001 | 2,970 |
| `2.png` → cohort | 171,389 | 14,618 | 9,487 | 5,197 |
| `3.png` → fortis | 217,372 | 12,823 | 8,487 | 4,840 |
| **Total** | **525,397** | **34,784** | **22,975** | **13,007** |

Even the largest tier is 93% smaller than the master, with no visible
degradation to the unit artwork or the banner logos — inspected in the rendered
page at 375, 768, 1440 and 1920.

**The Phase 3C 4:1 zero-crop behaviour is intact.** Every derivative is exactly
4:1 by construction (600 × 150, 900 × 225, 1200 × 300), and the rendered
`.element-panel__media` ratio was measured at all eight test widths:

```text
320  4.0000    768  4.0000   1280  4.0001   1440  4.0002
375  4.0000   1024  4.0001   1920  4.0001
```

`object-fit: cover` on a 4:1 image inside a 4:1 box crops nothing.

## 8. Final CTA Optimization

`activity6.jpg` (1920 × 1080, 3,504,879 bytes, **PNG mislabelled `.jpg`**) →
five tiers per format.

| Width | AVIF | WebP | JPEG |
|---:|---:|---:|---:|
| 640 | 23,111 | 24,770 | 27,997 |
| 960 | 44,553 | 47,386 | 56,531 |
| 1280 | 70,362 | 69,758 | 91,472 |
| 1600 | 101,361 | 98,530 | 133,806 |
| 1920 | 148,749 | 139,668 | 188,456 |

**Preserved exactly as approved:** `object-position: 50% 40%`, the Phase 4
two-gradient scrim, the baked unit watermark, and the chromatic-split effect —
none of which were retouched, masked or re-graded. The AVIF q66 setting was
chosen partly on this image, because at q58 the wall texture behind the team
dissolved (§4).

**Loading is unchanged and deliberately conservative:** `loading="lazy"`,
`decoding="async"`, **not preloaded**, and no `fetchpriority`. Its `sizes`
(`(max-width: 767px) 140vw, (max-width: 1023px) 125vw, 100vw`) uses a smaller
portrait compensation than the hero because the band is capped at
`min(86svh, 44rem)` rather than the full viewport height.

Measured: a 375 @2x phone that never scrolls downloads **nothing** for this
section; scrolling to it costs 70,539 bytes (transferred, AVIF 1280w) instead of 3,504,879.

## 9. Logo Optimization

`696_Circle.png` (3508 × 2480, 1,073,111 bytes) is painted at 52 × 37 CSS px
(58 × 42 from 768 px). The navbar was transferring **1.02 MB for a 52-pixel
mark**, above the fold, on every visit.

Derivatives: 64 / 128 / 192 / 256 px wide, `sizes="(min-width: 768px) 59px, 52px"`.

| Width | WebP (lossless) | PNG (quantised) |
|---:|---:|---:|
| 64 | 2,010 | 2,756 |
| 128 | 5,386 | 5,875 |
| 192 | 10,078 | 9,873 |
| 256 | 14,004 | 14,689 |

Three decisions worth recording:

- **Everything stays lossless.** This is two-colour line art with hard edges —
  exactly what lossy codecs ring on. Transparency is preserved (the alpha is
  real, unlike the banner PNGs).
- **AVIF is deliberately not emitted for the logo.** It was generated and
  measured first: lossless AVIF came out at 38,091 bytes for the 256 px tier
  against 14,004 for lossless WebP — 2.7× worse. Shipping it would have been
  cargo-cult format selection, so the chain is WebP → PNG.
- **The artwork is untouched.** No recolour, no regeneration, no crop, no
  redraw — only Lanczos downscaling of the original raster. The original master
  is unmodified (§18).

Measured result: **1,073,111 → 2,186 bytes** at 1× and **5,562 bytes** at 2×.

## 10. Responsive Image Markup

All delivery is native HTML. There is no image library, and no JavaScript
anywhere measures the viewport or chooses a source — the browser does it from
`srcset` and `sizes`.

`src/components/media/ResponsiveImage.jsx` is a presentational component that
emits nothing but a `<picture>`, two `<source>` elements and one `<img>`:

```jsx
<picture className="responsive-picture">
  <source type="image/avif" srcSet="…640w, …960w, …" sizes={sizes} />
  <source type="image/webp" srcSet="…640w, …960w, …" sizes={sizes} />
  <img src={…} srcSet="…640w, …" sizes={sizes} alt={alt}
       width={…} height={…} loading={…} decoding={…} fetchPriority={…} />
</picture>
```

It has no state, no effects and no observers.

`src/assets/images.js` builds the `srcSet` strings at **build time** from a
single `import.meta.glob('./optimized/**/*.{avif,webp,jpg,png}')`. Vite
resolves the glob statically, so every derivative is hashed, emitted and
long-term cacheable like any other asset. `?no-inline` is used because several
small derivatives fall under Vite's 4 kB inline threshold and would otherwise
be base64'd into the JS bundle, defeating caching. **Verified: 0 `data:image`
occurrences in the emitted JS and CSS.**

### Guaranteeing zero layout change

Wrapping each `<img>` in a `<picture>` inserts a new element into the tree, and
the existing CSS targets the `<img>` (`.hero__image`, `.element-panel__image`,
`.operation-story__media img`, `.brand__mark`). One CSS rule removes the risk
entirely:

```css
.responsive-picture { display: contents; }
```

The wrapper generates no box at all, so the `<img>` is laid out exactly as if
it were still a direct child of its parent. **Verified in the rendered page:
all 8 `<picture>` elements compute to `display: contents` at every tested
viewport**, and the full layout-geometry probe (§15) is unchanged.

## 11. Loading Priority Strategy

| Element | `loading` | `decoding` | `fetchpriority` | Preloaded |
|---|---|---|---|---|
| Hero (LCP) | `eager` | `sync` | `high` | **Yes**, AVIF `imagesrcset` |
| Navbar logo | `eager` | `async` | `low` | No |
| Operations 01 / 02 | `lazy` | `async` | — | No |
| Elements banners ×3 | `lazy` | `async` | — | No |
| Final CTA | `lazy` | `async` | — | No |

The logo is above the fold and must be eager, but it is a 2 kB decorative mark
that must not compete with the LCP image for bandwidth — hence
`fetchpriority="low"`. Nothing above the fold is lazy; nothing below the fold
is eager.

Browser-verified at 375 × 812 @2x: an initial load that never scrolls requests
**exactly two images**, the hero derivative and the logo, totalling 227,336
bytes. The other six load only on scroll.

## 12. Accessible Heading Fix

The Phase 4 report listed three approved-section headings whose accessible
names concatenate. Inspecting the live accessibility tree first turned up
something more precise than the report had:

**Chrome's computed AX name already inserts a space** between `display: block`
spans — it reported `TACTICAL FREEDOM. MISSION CONSEQUENCES.` before any fix.
The defect is real, but it lives at the **DOM text level**, which is what
`textContent` returns and therefore what copy/paste, search indexing, text
extraction and any AT stack that does not replicate Chrome's heuristic will
see.

Measured before the fix:

```text
H1 :: TASK FORCE696
H2 :: TACTICAL FREEDOM.MISSION CONSEQUENCES.
H2 :: MISSION DRIVEN.PLAYER DECIDED.
H2 :: LEGION. COHORT. FORTIS.          ← already correct
```

`LEGION. COHORT. FORTIS.` is a **single text node that already contains its
spaces**. It was listed in the Phase 4 brief as defective; it was not. It was
left untouched.

Conversely, the Hero `<h1>` — `<span>TASK FORCE</span><strong>696</strong>` —
has exactly the same defect and was **not** in the brief's list. It is the most
important heading on the page, so it was fixed too.

The change is one `{' '}` per heading, in three files, which is the same
one-character fix Phase 4 applied to its own new headings:

```jsx
<span>TASK FORCE</span>{' '}
<strong>696</strong>
```

Measured after the fix — `textContent` and the computed AX name now agree:

```text
H1 :: TASK FORCE 696
H2 :: TACTICAL FREEDOM. MISSION CONSEQUENCES.
H2 :: MISSION DRIVEN. PLAYER DECIDED.
```

The seven `aria-labelledby` region names inherit the corrected strings.

**Proof that nothing moved.** Whitespace between block-level siblings should
collapse to nothing, but "should" is not evidence. Two builds were produced —
identical except for the three `{' '}` — served side by side, and every
heading box, every line-span rectangle, the six section boxes and the document
height were compared to three decimal places at 375 @2x, 768 @2x, 1440 @1x and
1920 @1x:

```text
375x812@2x   — identical geometry
768x1024@2x  — identical geometry
1440x900@1x  — identical geometry
1920x1080@1x — identical geometry
total differing probes: 0
```

Line breaks, wrapping and composition are unchanged.

## 13. Before / After Measurements

### Build output

| | Before | After | Change |
|---|---:|---:|---|
| Emitted image files | 8 | 96 | responsive ladders |
| Emitted image bytes | 12,008,156 | 8,128,886 | **−32.3%** |
| Whole `dist/` | 12,262,207 | 8,394,910 | −31.5% |
| CSS | 41.74 kB (8.72 gzip) | 41.74 kB (8.72 gzip) | +1 rule, no measurable change |
| JS | 211.37 kB (65.10 gzip) | 222.91 kB (67.65 gzip) | +11.54 kB (srcSet strings + component) |
| `index.html` | 930 B | 1,369 B | +439 B (hero preload) |

Emitted bytes fall by a third; **transferred** bytes — the number that matters
to a visitor — fall by 89–97%, because no visitor ever downloads more than one
tier per image.

### Per-image, master vs. what a 1440 @1x desktop actually receives

Served figures are browser-measured transfer (`encodedDataLength`), so they sit
a couple of hundred bytes above the on-disk file size by the response headers.

| Image | Master | Served | Reduction |
|---|---:|---:|---|
| Hero | 3,472,645 | 331,293 (AVIF 1600w) | **−90.5%** |
| Navbar logo | 1,073,111 | 2,186 (WebP 64w) | **−99.8%** |
| Aviation (`activity2`) | 3,242,623 | 63,433 (AVIF 1280w) | **−98.0%** |
| Final CTA (`activity6`) | 3,504,879 | 101,539 (AVIF 1600w) | **−97.1%** |
| Direct Action (`activity3`) | 189,501 | 37,254 (AVIF 1280w) | −80.3% |
| Legion / Cohort / Fortis | 525,397 | 35,314 (AVIF 1200w ×3) | −93.3% |

### Browser-measured transfer, before vs after

Every figure below came from `Network.loadingFinished.encodedDataLength` in
headless Chrome with the cache disabled, against the production build.

| Viewport | Above fold — before | after | Δ | Whole page — before | after | Δ |
|---|---:|---:|---:|---:|---:|---:|
| 375 × 812 @2x | 4,546,113 | **227,336** | −95.0% | 12,009,580 | **387,214** | −96.8% |
| 375 × 812 @1x | 4,546,113 | **57,611** | −98.7% | 12,009,580 | **129,498** | −98.9% |
| 768 × 1024 @2x | 4,546,113 | **467,055** | −89.7% | 12,009,580 | **766,109** | −93.6% |
| 768 × 1024 @1x | 4,546,113 | **128,393** | −97.2% | 12,009,580 | **243,514** | −98.0% |
| 1440 × 900 @1x | 4,546,113 | **333,479** | −92.7% | 12,009,580 | **571,019** | −95.2% |
| 1440 × 900 @2x | 4,546,113 | **695,684** | −84.7% | 12,009,580 | **1,069,816** | −91.1% |
| 1920 × 1080 @1x | 4,546,113 | **463,679** | −89.8% | 12,009,580 | **726,701** | −93.9% |

The before column is constant because the before build had no `srcset` — that
is the defect, stated numerically.

## 14. Browser Network Verification

Method: the production build served over HTTP on `127.0.0.1`; local Chrome 152
in `--headless=new` driven over the Chrome DevTools Protocol by a small Node
script using Node 24's built-in `WebSocket`. **No dependency was installed for
this.** Each viewport used `Emulation.setDeviceMetricsOverride` for an exact
width, height and device pixel ratio, `Network.setCacheDisabled`, and waited on
`document.fonts.ready`. Source selection is read from `img.currentSrc`, and
transfer from the CDP network events — **not inferred from the markup**.

### Which hero derivative the browser actually selects

| Viewport | Selected | Transferred | Hero requests |
|---|---|---:|---:|
| 375 × 812 @1x | `hero-640.avif` | 55,425 | **1** |
| 375 × 812 @2x | `hero-1280.avif` | 221,774 | **1** |
| 768 × 1024 @1x | `hero-960.avif` | 126,207 | **1** |
| 768 × 1024 @2x | `hero-1920.avif` | 461,493 | **1** |
| 1440 × 900 @1x | `hero-1600.avif` | 331,293 | **1** |
| 1440 × 900 @2x | `hero-2400.avif` | 690,122 | **1** |
| 1920 × 1080 @1x | `hero-1920.avif` | 461,493 | **1** |

"Hero requests: 1" is the important column: the injected preload and the
rendered `<picture>` agree at every viewport, so the preload accelerates the
LCP without ever costing a second download.

### Full selection sweep, eight widths at 1×

```text
width  logo         hero        direct-action   aviation    banners   final-cta
  320  logo-64.webp hero-640    da-640          av-640      600w ×3   cta-640
  375  logo-64.webp hero-640    da-640          av-640      600w ×3   cta-640
  430  logo-64.webp hero-640    da-640          av-640      600w ×3   cta-640
  768  logo-64.webp hero-960    da-960          av-640      900w ×3   cta-960
 1024  logo-64.webp hero-1280   da-960          av-960     1200w ×3   cta-1280
 1280  logo-64.webp hero-1280   da-1280         av-1280    1200w ×3   cta-1280
 1440  logo-64.webp hero-1600   da-1280         av-1280    1200w ×3   cta-1600
 1920  logo-64.webp hero-1920   da-1280         av-960     1200w ×3   cta-1920
```

Every entry is AVIF except the logo, which is WebP by design (§9). Aviation
correctly resolves one tier below Direct Action at 768 and 1920, because
`--offset` is the narrower story (78% / 72% versus 91% / 88%).

## 15. Visual Regression Review

Method as §14, plus `Page.captureScreenshot`. Reviewed at **375 @2x, 768 @2x,
1440 @1x and 1920 @1x**, with lazy images forced in before capture, and a DOM
geometry pass alongside every screenshot.

| Check | Result |
|---|---|
| Hero renders correctly, composition intact | Pass at all four widths |
| Hero crop intent unchanged | Pass — all four `object-position` breakpoints verified in the rendered page |
| Operations images clear, captions and markers intact | Pass |
| Elements banners 4:1 and uncropped | Pass — ratio measured 4.0000–4.0002 at all eight widths |
| Final CTA visually equivalent, scrim and watermark intact | Pass |
| Navbar logo sharp | Pass — sharp at 375 @2x (`logo-128.webp`) and at 1440 |
| Horizontal overflow | **None at 320, 375, 430, 768, 1024, 1280, 1440, 1920** — `body.scrollWidth === innerWidth`, and 0 elements extend past the container |
| Broken / unloaded images | 0 at all eight widths |
| `<picture>` layout impact | 0 — all 8 compute `display: contents` |

Layout geometry across the heading-fix A/B (§12) produced **0 differing probes**
at four viewports, covering all six section boxes, all six headings, their line
spans, and the document height.

### Honest caveats

- **This is not a pixel-perfect before/after equality claim, and it was not
  measured as one.** Re-encoding to AVIF necessarily changes pixels; asserting
  equality would be false. What was measured is that layout geometry is
  unchanged, that no section overflows, that the 4:1 banners do not regress,
  and that the compositions, crops, gradients and effects are visually intact
  under review at four widths.
- An early attempt to pixel-diff clipped heading crops produced a 76–81%
  difference — which **reproduced when diffing a build against itself**. It is
  a `captureBeyondViewport` relayout artifact (Chrome expands the viewport,
  which changes `100svh` and moves the hero content), not a real difference.
  The unclipped viewport screenshots were 0–127 differing pixels with a maximum
  channel delta of 2, i.e. AVIF decode noise. This is why §12 relies on
  geometry probes rather than screenshots.
- Everything above is headless Chromium on Windows. **No physical handset, no
  Safari/iOS, no Firefox.** AVIF and `display: contents` are well supported in
  all current engines, but the WebP and JPEG fallback ladders have not been
  exercised on a real browser that lacks AVIF — only their markup was verified.
- Screenshots are working files in the session scratchpad and are not
  committed.

## 16. Accessibility

- **Alt text is unchanged.** The two Operations images keep their meaningful
  Thai `alt`; the hero, CTA, logo and banners remain `alt=""` decorative, and
  the hero and CTA keep `aria-hidden="true"`.
- **Heading structure is unchanged** — still one `h1`, six `h2`, twelve `h3`.
  Only whitespace was added (§12).
- **Accessible names are now correct at the DOM text level as well as in the AX
  tree** (§12), and the seven labelled regions inherit the corrected strings.
- **Intrinsic dimensions are preserved on every image**, so every box is
  reserved before its bytes arrive and no new CLS is introduced.
- `decoding="async"` is retained on everything below the fold. The hero uses
  `decoding="sync"` deliberately: it is the LCP element and must not be
  presented late.
- **No new interactive element, focus target, tab stop, colour or motion** was
  introduced. The `prefers-reduced-motion` block is untouched.
- `.responsive-picture { display: contents; }` is applied to a wrapper that
  carries no semantics and no text, so it does not remove anything from the
  accessibility tree.

## 17. Dependencies / Tooling

One development dependency was added: **`sharp` 0.35.4**, pinned exactly, in
`devDependencies`.

Justification against the brief's four conditions:

1. **Reproducible workflow** — `npm run optimize:images` regenerates the whole
   tree deterministically. Each output is stamped with a SHA-256 of the master
   plus its width, format and settings, so a rerun with nothing changed writes
   nothing (verified: `96 derivatives — 0 written, 96 reused`), and a changed
   master or setting invalidates only what it affects. `--force` rebuilds all.
2. **Development-only** — it is never imported by anything under `src/`.
   Verified: no reference to `sharp` in the emitted JS, and the derived files
   are committed so a production build needs neither sharp nor the script.
3. **Not shipped at runtime** — confirmed in the emitted bundle.
4. **Documented** — in `README.md` and in the script's own header.

No local alternative was viable: ImageMagick, ffmpeg, `cwebp` and `avifenc` are
all absent from this machine (`convert` on `PATH` is the Windows filesystem
tool, not ImageMagick), and Python's Pillow has no reliable AVIF encoder here.
Sharp bundles mozjpeg and libaom and produced verified AVIF and WebP output.

Nothing else was added. `package.json` still declares exactly `react` and
`react-dom` as runtime dependencies. **No runtime image library, no cloud image
service, no CDN, no analytics, no router, no animation library.**

`scripts/optimize-images.mjs` refuses to upscale, warns on any width wider than
its source, and writes `src/assets/optimized/manifest.json` recording each
master's SHA-256, real format and dimensions.

## 18. Build / Lint Verification

```text
$ npm run lint
> eslint .
(no output)
Exit code: 0
```

```text
$ npm run build
vite v8.2.2 building client environment for production...
✓ 126 modules transformed.
dist/index.html                       1.37 kB │ gzip:  0.66 kB
… 96 image assets …
dist/assets/hero-2400-l2WFLcVS.avif  689.94 kB
dist/assets/index-BmIKzuI7.css        41.74 kB │ gzip:  8.72 kB
dist/assets/index-BZRPSUTj.js        222.91 kB │ gzip: 67.65 kB
✓ built in 286ms
Exit code: 0
```

```text
$ npm run optimize:images
96 derivatives — 0 written, 96 reused — 8128886 B on disk
Every file in img/ was opened read-only.
Exit code: 0
```

### Original-asset integrity

Every archival file was SHA-256 compared against
`D:\TF696-main\TF696_LEGACY_BACKUP.zip` **after** all Phase 5 work:

```text
POST-PHASE-5 archival asset check — matched: 28  mismatched/missing: 0
```

That covers all 25 `img/` entries and all 3 `audio/` entries present in the
recovery archive. Two masters are not in the archive because Phase 2B added
them after it was taken — `main6962.jpg` and `696_Circle.png`. For those, size
and content hash are recorded here so any future change is detectable, and
their filesystem modification times (01:41 and 01:44) are unchanged from before
this phase:

| File | Bytes | SHA-256 (first 32) |
|---|---:|---|
| `img/main6962.jpg` | 3,472,645 | `73a611a2c220d55ed574d2d916049c94` |
| `img/696_Circle.png` | 1,073,111 | `1398014cdb23c435d661f494c8db0f9c` |

**Nothing in `img/` or `audio/` was overwritten, recompressed, renamed or
deleted.** Every derivative lives in `src/assets/optimized/`.

## 19. Files Changed

### CREATED

- `scripts/optimize-images.mjs` — the derivative generator
- `src/assets/images.js` — build-time `srcSet` index over the derived tree
- `src/assets/hero-sizes.js` — the hero `sizes` string, shared by the component and the preload
- `src/components/media/ResponsiveImage.jsx` — `<picture>` / `<source>` / `<img>` wrapper
- `src/assets/optimized/` — 96 derivatives plus `manifest.json`
- `TF696_PHASE_5_MEDIA_PERFORMANCE_REPORT.md`

### MODIFIED

- `package.json` — added `sharp` 0.35.4 to `devDependencies`; added the `optimize:images` script
- `package-lock.json` — sharp and its 3 transitive packages
- `vite.config.js` — build-only plugin injecting the hero LCP preload
- `src/index.css` — one rule added: `.responsive-picture { display: contents; }`
- `src/components/sections/HeroSection.jsx` — `ResponsiveImage`, eager/sync/high; `{' '}` in the `h1`
- `src/components/sections/OperationsSection.jsx` — `ResponsiveImage` + per-story `sizes`; `{' '}` in the `h2`
- `src/components/sections/ElementsSection.jsx` — `ResponsiveImage` + `sizes`
- `src/components/sections/FinalCtaSection.jsx` — `ResponsiveImage` + `sizes`, still lazy
- `src/components/sections/AboutSection.jsx` — `{' '}` in the `h2` only
- `src/components/layout/SiteHeader.jsx` — `ResponsiveImage` for the brand mark, `fetchpriority="low"`
- `README.md` — image workflow section
- `dist/` — regenerated, still ignored

### REMOVED

- None.

### UNCHANGED

- `img/`, `audio/` — verified byte-identical (§18)
- `index.html` (source), `eslint.config.js`, `.gitignore`
- `src/App.jsx`, `SiteContainer.jsx`, `SiteFooter.jsx`, `HowWeOperateSection.jsx`,
  `RecruitmentSection.jsx`, `SectionLabel.jsx`
- All copy, all Discord URLs, all recruitment requirements, all section layout CSS

## 20. Remaining Issues

1. **The two mislabelled PNGs should be renamed at source, eventually.**
   `img/activity2.jpg` and `img/activity6.jpg` are PNG data with a `.jpg`
   extension. The build no longer cares, but the extension will mislead the next
   person. Renaming them is a change to the archival bank, which this phase was
   explicitly forbidden from making — so it is flagged, not done.
2. **The hero `sizes` compensation is a judgement call, not an exact answer.**
   A full-bleed `cover` crop on a portrait phone mathematically wants a ~3500 px
   source; `130vw` / `115vw` is a deliberate compromise, and the visible slice
   on a 375 @2x phone resolves to roughly 0.55× of device pixels. It looks
   correct in review, but it is the one number here that is a trade-off rather
   than a measurement, and it is worth a look on a real handset.
3. **A retina desktop still pulls 690 kB for the hero** (`hero-2400.avif`).
   That is the deliberate high-fidelity ceiling. If it should be cheaper,
   deleting the 2400 tier from `SOURCES` in `scripts/optimize-images.mjs` caps
   it at 461 kB — a one-line change plus a rerun.
4. **The AVIF-less fallback path has not been exercised in a real browser.**
   Only Chrome was available. The WebP and JPEG ladders are correct in markup
   and the files exist, but nothing has actually rendered them.
5. **`src/assets/optimized/` adds 8.0 MB to the repository.** That is the
   deliberate trade for a build that needs no image tooling. If repo size
   matters more, the tree can be gitignored and `optimize:images` made a
   prebuild step — at the cost of requiring sharp on every build machine.
6. **No physical-device testing.** Unchanged from Phase 4: `100svh` / `86svh`
   behave differently with mobile browser chrome, and the hero and Final CTA
   heights still deserve a human look on a real phone.
7. **Phase 4's open questions are untouched by this phase** — the skill
   assessment wording, the hero eyebrow rule, the mobile menu handset check, the
   `RECRUITMENT` caption wrap, whether the navbar should carry HOW WE OPERATE,
   and the unlinked `#join` id all remain as recorded there.
8. **No SEO and no deployment work was started**, as instructed.

## 21. Recommended Next Step

Human review of the optimised page on a real handset and on Safari — Chrome was
the only engine available here — with attention to the hero's sharpness at 2×
and 3× and the Final CTA's scrim now that the image is re-encoded.

After that, the natural next phases are SEO and metadata (title, canonical,
Open Graph, structured data, favicon — noting `img/favicon.ico` exists and is
currently unused), then deployment, which still requires the GitHub Pages
repository path or custom domain to be confirmed before `base` can be settled.

Neither was started.
