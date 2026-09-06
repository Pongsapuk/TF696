# TF696 Phase 3C — Visual Polish Report

## 1. Executive Summary

Phase 3C is a focused visual-polish pass over two sections only: About / Who We
Are and Our Elements. No new sections, dependencies, or visual direction were
introduced, and the approved Navbar and Hero were not touched.

Both human-reported issues were reproduced, root-caused, and fixed:

- **Issue A (About overlap)** was caused by the display headline being sized
  from the viewport (`8.4vw`) while its grid column was sized from the
  container, which is capped at `88rem`. Above ~1600px the headline's
  min-content width exceeded its column and bled into the gap and the Thai
  reading column. A second, related defect was found during verification: the
  shared `.section-title` floor of `3rem` made `CONSEQUENCES.` wider than the
  container below ~390px, so the headline was being clipped on phones.
- **Issue B (Elements crop/zoom)** was caused by a 4:1 source banner being
  forced into a much squarer panel box. At 375px only ~21% of each banner was
  visible; at 768px ~41% was cropped away. The overlaid text and its dark
  gradient were also positioned directly on top of the artwork rather than in
  the banner's own empty centre.

Both `npm run lint` and `npm run build` pass. Unlike Phase 3B, **real browser
visual inspection was performed** using a local headless Chrome; screenshots and
measured DOM geometry are described in sections 7 and 8.

## 2. About Section Fixes

### What caused the issue

`.about-section__intro` became a two-column grid at `768px` using
`minmax(0, 1.3fr) minmax(18rem, 0.7fr)` with a fixed `2.5rem` gap, while the
headline used the shared `.section-title` size `clamp(3rem, 8.4vw, 8.75rem)`.

Two independent problems followed:

1. The `minmax(0, ...)` left track is allowed to shrink below its content's
   min-content width, so an oversized `CONSEQUENCES.` simply overflowed its
   column instead of forcing a reflow. Because the font scales with `vw` but the
   container is capped at `88rem`, the mismatch got worse as the viewport grew —
   worst at 1920px, and also bad in the narrow 768-830px band where the right
   column was pinned to its `18rem` minimum.
2. The `2.5rem` gap was far too small to separate a ~120px display face from a
   body-copy column.

### What was changed

- The two-column split now starts at **1024px** instead of 768px. The
  768-1023px band stays single-column, which removes the collision in that band
  entirely rather than papering over it.
- At >=1024px the grid is `minmax(0, 1.25fr) minmax(20rem, 0.75fr)` with a fluid
  `column-gap: clamp(3.5rem, 6vw, 7rem)` — roughly 60-112px of separation
  instead of a flat 40px.
- At >=1024px the About headline gets its own size, `clamp(4.25rem, 7.2vw,
  6.5rem)`, chosen so its min-content width stays inside the left track at every
  width including 1920px, where the container is capped. It is still the
  dominant element on the page after the Hero.
- The Thai copy now has an explicit reading zone: from 768px up it is
  `justify-self: end` with a hairline left rule and padding, so it reads as a
  deliberate second column rather than leftover space. Bottom alignment with the
  headline is retained.
- The supporting-label index got a small alignment fix: `li:last-child` now has
  `padding-right: 0` so the four cells align flush to the container edges.
- **Additional fix found during verification:** `.about-section__title` now uses
  `clamp(2.35rem, 8.4vw, 8.75rem)`. Only the floor changed, and only for this
  one title — above 448px the shared `8.4vw` curve is untouched. This is scoped
  to About because `CONSEQUENCES.` (13 characters) is by a wide margin the
  longest word in any section title; `FREEDOM`, `MISSION`, `DECIDED.` and
  `COHORT.` all fit comfortably, so no other section title was altered.

Section label, English statement, supplied Thai copy, and the numbered index are
all preserved unchanged.

## 3. Elements Panel Fixes

### What caused the issue

The three banners are all exactly **1200x300 (4:1)**. Visual inspection of the
source art shows each one has two points of interest at opposite ends with a
large empty black field in the middle:

| Banner | Left artwork | Right artwork |
|---|---|---|
| `557.png` (Legion) | crest ~0-17% | night scene ~72-100% |
| `2.png` (Cohort) | helicopter photo ~0-27% | crest ~82-95% |
| `3.png` (Fortis) | crest ~0-16% | range scene ~73-100% |

The panels used a squat `min-height` (25rem mobile, 19-21rem desktop) with
`object-fit: cover`, so the 4:1 art was squeezed into a much squarer box:

- 375px: panel ~335x400 → roughly **79% of the artwork cropped away**
- 768px: ~41% cropped
- 1024px: ~32% cropped

A single `object-position` (84% / 14% / 86%) then chose one end and discarded the
other. On top of that, the text block sat at `left: 39%`-`right: 7%` — directly
over the surviving artwork — and its overlay added a full-width vertical scrim
that dimmed the photography.

### What was changed

- The image now sits in its own `.element-panel__media` wrapper with
  `aspect-ratio: 4 / 1`, matching the source exactly. Measured across every
  tested width the rendered ratio is **4.000**, i.e. **zero crop — the entire
  banner is visible at all six target widths.** `object-position` is now plain
  `center` on all three panels, so no unit is favoured over another.
- At **>=1024px** the panel keeps the approved full-bleed overlay look, but the
  text moved into the banner's own empty centre instead of on top of the art:
  `left: 21% / right: 30%` for Legion and Fortis, `left: 29% / right: 27%` for
  Cohort. Both artwork zones stay clear.
- The overlay was rebuilt to reveal rather than hide. It is now a horizontal
  gradient that is fully transparent over both artwork ends and only veils the
  central text band; the full-width vertical scrim that was dimming the
  photography is gone.
- Below 1024px the panel becomes a two-zone composition: the full 4:1 banner
  strip with the text band beneath it on the panel's own black ground. This is
  what makes full artwork possible on phones, where an overlay would not fit.
  From 768px the text band adds a `4.5rem` index column so it stays editorial
  rather than becoming a plain card.
- The `01/02/03` index moved from a floating corner marker into the top of the
  text block. Previously it was printed over the scene photography at low
  opacity; it now sits on black and reads as part of the editorial stack.
- `.element-panel h3` at >=1024px is `clamp(3rem, 5.6vw, 5.5rem)` (was
  `clamp(4.75rem, 7.5vw, 7rem)`). This is the one deliberate trade for showing
  the whole banner: a true 4:1 panel is shorter than the old squat box, so the
  unit name was retuned to sit inside it with air. At 1440px it still renders at
  ~81px, and below 1024px the original `clamp(3.25rem, 10vw, 7rem)` is unchanged.

Images, alt text, unit names, role labels, and the supplied Thai descriptions are
all unchanged.

## 4. Responsive Adjustments

Measured in the real built app, not estimated:

| Width | About | Elements |
|---|---|---|
| 320px | single column; headline fits (fix in section 2) | stacked; full banner |
| 375px | single column | stacked; full banner |
| 430px | single column | stacked; full banner |
| 768px | single column, copy offset right with rule | stacked + index column |
| 1024px | two columns, 60px gap | overlay in banner centre, staggered |
| 1280px | two columns, 77px gap | overlay, staggered |
| 1440px | two columns, 86px gap | overlay, staggered, 88% width |
| 1920px | two columns, 112px gap | overlay, staggered, 88% width |

Measured results at every width above: `body.scrollWidth === clientWidth` (no
horizontal overflow), no element in `#about` or `#elements` extends past the
container's right edge (no clipping), the About headline and Thai copy never
intersect, and the banner aspect ratio is exactly 4.000.

The one apparent exception is a 305px-wide test, where `html { min-width: 320px }`
correctly forces a 320px document. That is the intended existing floor, not a
regression, and even there nothing clips.

## 5. Hero/Navbar Protection

No Hero or Navbar redesign. `HeroSection.jsx` and `SiteHeader.jsx` were not
modified in this phase, and no `.hero__*`, `.site-header`, `.desktop-nav`,
`.mobile-menu`, or `.brand__*` rule was changed. All 38 `hero__` rules and the
Phase 2B breakpoint behaviour (including the 430px short-screen rule) remain as
approved.

## 6. Accessibility

Verified in the rendered app: exactly **one `h1`** and **four `h2`** elements,
unchanged from Phase 3B.

- Semantic headings, `aria-labelledby` section relationships, and the `h3` unit
  names are unchanged.
- The `01/02/03` panel index keeps `aria-hidden="true"`, so moving it into the
  content block does not add noise. Screen-reader order within a panel is still
  role → unit name → description.
- Banner images keep `alt=""` (they are decorative; the same information is
  present as real text), plus `loading="lazy"` and `decoding="async"`.
- Global `:focus-visible` outline, the skip link, nav focus styles, mobile focus
  containment, and keyboard navigation are untouched.
- The `prefers-reduced-motion: reduce` block is untouched. Nothing animated was
  added in this phase.
- Contrast: the orange role label (~5.6:1), the description at
  `rgba(245,245,245,0.8)` (~12:1), and the decorative index at `0.52` (~5.6:1)
  all sit on black or on the veiled centre band, never over bright artwork —
  which is a contrast improvement over the previous corner index, which was
  printed on photography.

## 7. Verification

Lint passed:

```text
npm.cmd run lint
> eslint .
Exit code: 0
```

Production build passed:

```text
npm.cmd run build
vite v8.2.2 building client environment for production...
+ 31 modules transformed.
dist/assets/index-DZMkoVSX.css          26.80 kB | gzip: 6.53 kB
dist/assets/index-BBOcN25B.js          204.65 kB | gzip: 63.91 kB
built in 208ms
Exit code: 0
```

Measured geometry from the built app (`dist/index.html`), loaded in real
same-origin iframes at each target width:

```text
W360   noOverflow=true  clipped=[]  collide=false  bannerRatio=4.000
W415   noOverflow=true  clipped=[]  collide=false  bannerRatio=4.000
W753   noOverflow=true  clipped=[]  collide=false  bannerRatio=4.000
W1009  noOverflow=true  clipped=[]  collide=false  bannerRatio=4.000
W1265  noOverflow=true  clipped=[]  collide=false  bannerRatio=4.000
W1425  noOverflow=true  clipped=[]  collide=false  bannerRatio=4.000
W1905  noOverflow=true  clipped=[]  collide=false  bannerRatio=4.000
```

## 8. Visual Inspection Status

**Browser visual inspection was performed.** No browser automation tool was
exposed to this session, but a local Chrome binary
(`C:\Program Files\Google\Chrome\Application\chrome.exe`) was found and driven in
headless mode against `vite preview`. Screenshots were rendered and inspected at
320, 375, 430, 768, 1024, 1440, and 1920px, along with magnified crops of the
Cohort panel.

Two honest caveats about the method:

1. **Both sections were inspected via a static harness** that loaded the real
   compiled CSS and the real hashed image assets with markup equivalent to the
   components. This was necessary because the Hero is `100svh`, so a full-page
   screenshot tall enough to reach these sections also stretches the Hero to
   that height. Layout parity with the real app was then confirmed numerically
   against the real built `dist/index.html` (section 7), which is where the
   4.000 ratios and no-collision results come from.
2. `--window-size` is clamped by Chrome to a minimum window width, so narrow
   widths were rendered inside fixed-width iframes, which give the inner
   document a true viewport. An early reading that suggested content overflow at
   375px was an artifact of that clamping — the screenshot was cropped to 375px
   while the page had actually rendered at 485px. It was measured, not assumed,
   and disproved before any change was made on the strength of it. The genuine
   sub-390px headline clipping described in section 2 was found afterwards, by
   measurement, and is a separate real defect that has been fixed.

Screenshots are working files in the session scratchpad and are not committed.

## 9. Files Changed

### Modified

- `src/index.css` — About grid/breakpoint/gap/type, Thai copy reading zone,
  index alignment, Elements panel structure, aspect ratio, overlay, and text
  placement.
- `src/components/sections/AboutSection.jsx` — added the `about-section__title`
  class to the existing `h2`. No copy or structural change.
- `src/components/sections/ElementsSection.jsx` — wrapped image + overlay in
  `.element-panel__media`; moved the aria-hidden index inside
  `.element-panel__content`. No copy, image, or alt-text change.

### Created

- `TF696_PHASE_3C_VISUAL_POLISH_REPORT.md`

### Removed

- None. `dist/` was regenerated by the build and remains ignored.

## 10. Remaining Visual Questions

1. **Cohort name adjacency.** The `COHORT` display type now sits about 78px
   (at 1024px, scaling up with width) from the crest, which itself carries the
   word `COHORT` vertically. There is no overlap, but the word appears twice in
   close proximity. This is inherent to the source artwork and cannot be
   resolved without hiding part of it. Worth a human opinion.
2. **Banner strip height on small phones.** At 375px the full 4:1 banner is
   ~84px tall. Every part of the artwork is visible, but it is a thin ribbon.
   This is the deliberate trade for "show more of the artwork" — please confirm
   it reads as intended on a real handset rather than only in a screenshot.
3. **About headline floor on phones.** Below 448px the About headline is now
   `2.35rem` where other section titles keep `3rem`. This was required to stop
   clipping. If the slightly smaller About headline is not wanted, the
   alternative is shortening or re-breaking the `MISSION CONSEQUENCES.` line.
4. **Thai copy measure at 1024px.** In the two-column layout at exactly 1024px
   the Thai paragraph runs six lines in a ~300px measure. It is readable and
   bottom-aligns with the headline, but it is the narrowest it gets.
5. **Duplicated `01` index.** Still outstanding from Phase 3B: the Hero eyebrow
   and the About label both read `01`. Deliberately left alone to avoid touching
   the approved Hero.
6. Sections outside this phase's scope (Operations, How We Operate) were not
   modified and have not been re-reviewed here.

## 11. Recommended Next Step

Human visual review of About and Our Elements at the six target widths, focusing
on the four open questions above — particularly the Cohort crest adjacency and
the mobile banner strip height. After Phase 3C is visually approved, proceed to
the separate Recruitment phase. Recruitment, the final Discord CTA, and the
Footer were not implemented in this phase.
