# TF696 Phase 3B — Core Content Sections Report

## 1. Executive Summary

Phase 3B implements the four requested core sections after the approved Navbar
and Hero: Who We Are, Operations, Our Elements, and How We Operate. The page
continues the tactical-editorial and cinematic-milsim direction through large
type, alternating light/dark fields, asymmetric photography, strong whitespace,
restrained orange, and linear editorial lists instead of generic card grids.

The approved Phase 2B Navbar and Hero were preserved. Their only integration
changes are real in-page navigation for completed destinations and the Hero's
DISCOVER TF696 link now targeting `#about`. Recruitment remains a safe temporary
control. No Recruitment section, schedule, final Discord CTA, Footer, video,
audio, router, backend, deployment, or additional dependency was added.

## 2. Components Created

- `src/components/sections/SectionLabel.jsx` — shared numbered editorial label.
- `src/components/sections/AboutSection.jsx` — Who We Are statement, Thai copy,
  and restrained supporting-label index.
- `src/components/sections/OperationsSection.jsx` — two-image operational story
  sequence with captions grounded in Arma 3 Milsim.
- `src/components/sections/ElementsSection.jsx` — three large staggered unit
  identity panels using the legacy banners.
- `src/components/sections/HowWeOperateSection.jsx` — four principles presented
  as one numbered editorial sequence.

All components reuse the existing `SiteContainer` layout primitive.

## 3. Who We Are

`#about` uses the required `01 / WHO WE ARE` label, the statement `TACTICAL
FREEDOM. MISSION CONSEQUENCES.`, and the supplied Thai copy without alteration.
It sits on a warm off-white editorial field to create rhythm between the dark
Hero and Operations sections.

The four supporting labels are one ruled, numbered index. They are not cards,
do not use rounded containers, and remain visually subordinate to the main
statement.

## 4. Operations

`#operations` uses the required `02 / OPERATIONS` label and `MISSION DRIVEN.
PLAYER DECIDED.` statement. The section explicitly identifies its imagery as
TF696 Arma 3 Milsim gameplay.

The media bank was visually inspected before selection. Two complementary
images were chosen:

- `img/activity3.jpg` — dark team scene by equipment crates, used for Direct
  Action.
- `img/activity2.jpg` — a team inside an aircraft under red lighting, used for
  Aviation / Fire Support and coordinated-support context.

The layout follows a large image → caption → offset large image → caption rhythm.
It is intentionally not a dense gallery. Both images are lazy-loaded, decoded
asynchronously, and include useful alt text that identifies them as Arma 3
gameplay.

## 5. Elements

`#elements` uses `03 / OUR ELEMENTS` and the three legacy identities in their
required order:

- LEGION — Ground / Direct Action
- COHORT — Aviation / Air Support
- FORTIS — Training / Reserve

The supplied Thai descriptions are used exactly. The original `557.png`,
`2.png`, and `3.png` banners appear as large staggered editorial panels rather
than identical small cards. Their embedded artwork is decorative because the
unit name, role, and description are already available as semantic text.

## 6. How We Operate

`#how-we-operate` uses `04 / HOW WE OPERATE` and presents Semi Roleplay, Player
Freedom, Consequence, and Teamwork as a single numbered sequence divided by
rules. The supplied Thai explanations are preserved.

On wide screens each principle is a three-column editorial row: index, principle,
and explanation. Smaller screens collapse each row to a compact two-column
heading with the explanation beneath it. No rounded cards or decorative HUD
elements are used.

## 7. Navigation Changes

- Desktop ABOUT is now a normal link to `#about`.
- Desktop OPERATIONS is now a normal link to `#operations`.
- Desktop ELEMENTS is now a normal link to `#elements`.
- Matching mobile-menu destinations are real links and close the menu when used.
- RECRUITMENT remains a button that announces its future availability through
  the existing ARIA live region.
- DISCOVER TF696 now links to `#about`.
- The existing smooth scrolling remains enabled for standard motion preferences.
  The existing reduced-motion rule disables it when requested.

## 8. Responsive Strategy

The implementation is mobile-first and fluid from the existing 320px minimum.
It includes deliberate layout changes at 640px, 768px, 1024px, and 1440px,
alongside fluid `clamp()` sizing and the Phase 2B 430px short-screen behavior.
This covers the requested 375px, 430px, 768px, 1024px, 1440px, and 1920px
targets without adding fixed page widths.

- Who We Are changes from one column to a two-column statement/copy layout.
- The four supporting labels progress from one to two to four columns.
- Operations changes from full-width stories to a 91% lead image and 78% offset
  second image, narrowing further on large desktop.
- Unit banners use deliberate mobile focal positions and return to wide 4:1
  compositions on tablet/desktop.
- Principle rows change from compact stacked content to a three-column sequence.
- Global horizontal overflow protection and balanced/fluid headings reduce the
  risk of accidental sideways scrolling.

## 9. Accessibility

- The approved Hero remains the single H1.
- Each new section has one semantic H2 and an `aria-labelledby` relationship.
- Operation story titles and unit names use H3 headings.
- The About details and operating principles use ordered lists.
- New implemented navigation destinations use real anchors and remain keyboard
  accessible.
- Recruitment retains truthful temporary-button behavior rather than becoming a
  broken link.
- Operation images have descriptive Thai alt text; redundant unit-banner art
  uses empty alt text.
- Existing visible focus styles, skip link, mobile focus containment, contrast,
  and reduced-motion behavior remain in place.
- Dark copy on the light fields and bright copy over dedicated banner overlays
  preserve readable contrast.

## 10. Motion

No animation library or new reveal animation was added. The four new sections
are static. Existing small Navbar/Hero transitions remain covered by the global
`prefers-reduced-motion: reduce` rules, which minimize animation and transition
duration and disable smooth scrolling.

## 11. Asset Usage

No original legacy file was edited, renamed, recompressed, or duplicated.

| Asset | Purpose | Source size |
|---|---|---:|
| `img/activity3.jpg` | Direct Action operation image | 189,501 bytes |
| `img/activity2.jpg` | Aviation / support operation image | 3,242,623 bytes |
| `img/557.png` | Legion identity banner | 136,636 bytes |
| `img/2.png` | Cohort identity banner | 171,389 bytes |
| `img/3.png` | Fortis identity banner | 217,372 bytes |

The large `activity2.jpg` source is documented but intentionally left untouched.
Broad responsive-image conversion and media optimization remain out of scope for
this phase.

## 12. Verification

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
✓ 31 modules transformed.
dist/index.html                          0.93 kB │ gzip:  0.54 kB
dist/assets/557-BvEBGRGL.png           136.63 kB
dist/assets/2-DxhLqVo4.png             171.38 kB
dist/assets/activity3-BHFngZ3E.jpg     189.50 kB
dist/assets/3-CNcA2ut7.png             217.37 kB
dist/assets/696_Circle-B3U3MkpE.png  1,073.11 kB
dist/assets/activity2-uQjNLhbu.jpg   3,242.62 kB
dist/assets/main6962-DaEdVtSb.jpg    3,472.64 kB
dist/assets/index-BJrYa1x3.css          25.63 kB │ gzip:  6.24 kB
dist/assets/index-D7WR1xws.js          204.56 kB │ gzip: 63.90 kB
✓ built in 251ms
Exit code: 0
```

Development server verification:

```text
Vite served http://127.0.0.1:5174/
HTTP status: 200
Content-Type: text/html
```

Static checks confirmed one H1, four new H2 elements, all three completed Navbar
hash destinations, the Hero `#about` destination, and the retained
`prefers-reduced-motion` rule. Static searches found no Recruitment component,
Footer, local MP4, video element, or audio element.

Browser-based visual inspection was unavailable. The browser connection exposed
no in-app or connected browser instance, so no screenshots, viewport renders, or
interactive visual claims are included here.

## 13. Files Changed

### Created

- `src/components/sections/SectionLabel.jsx`
- `src/components/sections/AboutSection.jsx`
- `src/components/sections/OperationsSection.jsx`
- `src/components/sections/ElementsSection.jsx`
- `src/components/sections/HowWeOperateSection.jsx`
- `TF696_PHASE_3B_CORE_SECTIONS_REPORT.md`

### Modified

- `src/App.jsx`
- `src/components/layout/SiteHeader.jsx`
- `src/components/sections/HeroSection.jsx`
- `src/index.css`
- `dist/` was regenerated by the production build and remains ignored.

### Removed

- None.

## 14. Visual Questions / Known Issues

1. The requested 375px, 430px, 768px, 1024px, 1440px, and 1920px widths still
   need human visual inspection because no browser instance was available.
2. Confirm the intentional mobile focal crops for the very wide 4:1 unit banners,
   especially whether each unit's embedded artwork remains recognizable at 375px.
3. Confirm that the dark `activity3.jpg` remains legible on the target display;
   it was selected for atmosphere and has naturally deep shadows.
4. `activity2.jpg` is approximately 3.24 MB. A later media-performance phase
   should generate responsive derivatives while retaining the original.
5. The approved Hero retains its existing `01` eyebrow while the required About
   label also begins at `01`. This was left unchanged to avoid redesigning the
   approved Hero, but the repeated number should be reviewed as part of the next
   human visual pass.

## 15. Recommended Next Step

Perform human visual and keyboard review at all six requested viewport widths,
including the open mobile menu, hash navigation, operation-image crops, and all
three unit panels. After Phase 3B receives visual approval, proceed to the
separate Recruitment phase. Do not add Recruitment, the final Discord CTA, or
the Footer as part of this phase.
