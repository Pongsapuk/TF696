# TF696 Phase 2B — Navbar + Hero Report

## 1. Executive Summary

Phase 2B implements the first production visual slice of TF696 V2: a fixed,
responsive navbar and a full-viewport cinematic hero. The approved attached
logo and team portrait were imported without modification, the confirmed
Discord invite is used for every conversion action, and no lower-page content
was created.

The design follows the locked tactical-editorial direction with asymmetric
composition, restrained orange accents, sharp CTA geometry, compact navigation,
and minimal CSS motion. Thai remains the primary explanatory language, while
English is used for tactical/editorial labels and actions.

## 2. Components Created

- `src/components/layout/SiteHeader.jsx` — fixed header, desktop navigation,
  mobile menu, menu keyboard behavior, scroll treatment, and Discord CTA.
- `src/components/sections/HeroSection.jsx` — decorative cinematic image,
  editorial content hierarchy, Thai intro copy, two hero actions, and small
  truthful site labels.
- The existing `SiteContainer` foundation component is reused by both.

## 3. Navbar Implementation

The header is fixed over the hero. At the top it is near-transparent; after
24px of page scroll it gains an 88%-opaque canvas background, 14px backdrop
blur, subtle bottom border, and a 260ms transition. It uses the canonical logo
beside a compact `TF696` wordmark.

Desktop navigation includes ABOUT, OPERATIONS, ELEMENTS, and RECRUITMENT plus a
visually stronger orange JOIN DISCORD action. Because the four destination
sections do not exist in Phase 2B, their controls do not create broken hash
navigation. They are buttons whose accessible names explain that the content
arrives in a later phase; activation announces the temporary status through an
ARIA live region. These should become normal section links when their targets
are implemented.

The JOIN DISCORD link opens `https://discord.gg/ptAbcyeDcf` in a new tab with
`noopener noreferrer`.

## 4. Mobile Navigation

Below 768px the desktop navigation is replaced with a brand and menu trigger.
The menu is a full-height dark overlay containing all four future destinations
and the working Discord CTA.

Implemented behavior:

- React state controls open/closed state.
- `aria-expanded`, `aria-controls`, and changing Thai accessible labels are
  present on the trigger.
- Focus moves to the first menu action on open.
- Tab focus is contained within the open menu.
- Escape closes the menu and returns focus to the trigger.
- Activating any menu action closes the menu.
- Background document scrolling is locked while open.
- Resizing to desktop closes the mobile menu.
- Closed-menu actions are removed from the keyboard tab order.

## 5. Hero Composition

The hero uses a left-weighted editorial content block and keeps the group
portrait as the dominant full-viewport field. On desktop, the image is shifted
slightly right at intermediate widths so the team remains visible beside the
copy, then returns to center on larger displays. The left gradient creates a
readable text zone without applying a full-frame military color filter.

On mobile, the image is centered to retain the central operators. Copy moves
toward the lower portion of the viewport, where a stronger bottom gradient
supports readability. This allows the upper and central portrait area to remain
recognizable before the text/CTA region.

Only the navbar and hero are present. No About, Operations, Elements,
Recruitment, schedule, gallery, footer, or other lower content was added.

## 6. Hero Asset Usage

Approved attachments were copied into the project as:

- `img/696_Circle.png` — canonical logo, 1,073,111 bytes.
- `img/main6962.jpg` — canonical Phase 2B hero, 3,472,645 bytes.

SHA-256 comparisons confirmed each project copy is byte-for-byte identical to
its attached source. The images are imported through Vite and emitted as hashed
production assets. The portrait is rendered with `object-fit: cover`, deliberate
responsive `object-position` values, and restrained CSS gradients. The source
file was not resized, recompressed, color-shifted, blurred, or otherwise edited.

The hero image is treated as decorative (`alt=""` and `aria-hidden="true"`)
because the surrounding content conveys the section purpose and the image adds
context rather than unique instructions or information.

## 7. Typography / CTA Decisions

- Chakra Petch remains the display, navigation, label, and button family.
- IBM Plex Sans Thai remains the Thai/body family.
- `TASK FORCE` and `696` are split across lines; the orange `696` is the
  dominant graphic element without adding a second oversized logo.
- Primary CTA: orange, square-edged `JOIN THE UNIT`, linked to Discord.
- Secondary CTA: restrained outline `DISCOVER TF696`.
- The secondary CTA temporarily targets the existing Thai hero introduction
  (`#hero-intro`) instead of the nonexistent `#about` section. This avoids a
  broken navigation target and is intended to be replaced in a later phase.
- Hover/focus arrow movement is limited to 3px and approximately 220ms.

## 8. Responsive Behavior

CSS includes deliberate behavior for the requested width classes:

- 375px and 430px: mobile menu, centered portrait crop, stacked CTAs below
  480px, fluid title, strong lower gradient, and a short-height fallback.
- 768px: desktop navigation begins, CTAs align horizontally, hero content moves
  to vertical center, and portrait position shifts to preserve the team.
- 1024px: wider left text zone, reduced full-frame darkening, and a more
  right-weighted portrait crop.
- 1440px and 1920px: centered source composition, larger editorial title, and
  existing 1408px foundation container constraints.

The title uses `clamp()` and viewport-relative sizing to prevent horizontal
overflow. The hero uses `100svh` with minimum-height fallbacks for short screens.
Thai copy uses fluid sizing, generous line height, and a narrow-screen wrapping
fallback.

## 9. Accessibility

- One H1 is present: `TASK FORCE 696`.
- Semantic `header`, labeled `nav`, `main`, and labeled `section` elements are
  used.
- A Thai skip link targets the main content.
- All interactive controls retain the global high-visibility focus treatment.
- The mobile menu includes focus management, focus containment, Escape close,
  scroll lock, and meaningful ARIA state.
- Future navigation is implemented as action buttons rather than misleading or
  broken anchors.
- Discord links use normal external-link semantics and safe new-tab attributes.
- Decorative imagery and editorial ornaments are hidden from assistive
  technology.
- Text gradients preserve contrast over the photograph.

## 10. Motion

Motion is CSS-only and deliberately limited to:

- A 700ms initial hero content fade/16px translate.
- A 260ms header background/border/blur transition.
- 220ms menu, underline, color, and arrow transitions.

The existing `prefers-reduced-motion: reduce` rules minimize all animations and
transitions and disable smooth scrolling. No animation dependency was added.

## 11. Verification

Asset intake:

```text
img/696_Circle.png  — exists, 1,073,111 bytes, source SHA-256 match: true
img/main6962.jpg    — exists, 3,472,645 bytes, source SHA-256 match: true
```

Lint:

```text
npm.cmd run lint
> eslint .
Exit code: 0
```

Production build:

```text
npm.cmd run build
vite v8.2.2 building client environment for production...
✓ 21 modules transformed.
dist/index.html                          0.93 kB │ gzip:  0.54 kB
dist/assets/696_Circle-B3U3MkpE.png  1,073.11 kB
dist/assets/main6962-DaEdVtSb.jpg    3,472.64 kB
dist/assets/index-CeSvABdP.css          16.77 kB │ gzip:  4.58 kB
dist/assets/index-B8jzuC_M.js          196.34 kB │ gzip: 61.95 kB
✓ built in 215ms
Exit code: 0
```

Development server:

```text
Vite served http://127.0.0.1:5174/
HTTP status: 200
Content-Type: text/html
```

Static checks confirmed one H1, the locked hero import, and two centralized
Discord URL declarations covering the header/mobile and hero actions.

## 12. Visual Inspection

No viewport was visually inspected in a rendered browser. The configured
in-app browser reported that no browser instance was available, so screenshots
and interactive viewport inspection could not be completed. The development
server and assets were reachable over HTTP, but this report does not treat that
as visual verification.

The requested 375px, 430px, 768px, 1024px, 1440px, and 1920px widths are
explicitly handled in the responsive CSS, but all six still require human visual
review in an available browser.

## 13. Files Changed

### CREATED

- `img/696_Circle.png`
- `img/main6962.jpg`
- `src/components/layout/SiteHeader.jsx`
- `src/components/sections/HeroSection.jsx`
- `TF696_PHASE_2B_NAVBAR_HERO_REPORT.md`
- `dist/` production artifacts were regenerated by the build and remain ignored.

### MODIFIED

- `src/App.jsx`
- `src/index.css`
- `index.html`

### REMOVED

- None.

## 14. Known Issues / Visual Questions

Items for human visual review:

1. Confirm whether the team crop feels sufficiently inclusive at 375px and
   430px; narrow portrait viewports necessarily show fewer edge operators.
2. Confirm whether the left desktop gradient is dark enough for copy while
   retaining sufficient portrait brightness.
3. Review whether the orange `696` title should remain the dominant accent or
   shift slightly smaller at 1024px.
4. Confirm the logo's readable scale in the compact header. The approved source
   has a wide rectangular canvas, so preserving the entire artwork makes it
   visually smaller than a tightly cropped emblem would be.
5. Verify the 44rem/48rem minimum hero heights on unusually short landscape
   devices.
6. The future-section controls intentionally announce availability rather than
   navigate. Replace them with real anchors only when the destination sections
   exist.
7. The original hero file is approximately 3.47 MB. Optimization was excluded
   because Phase 2B required an unmodified source; later performance work may
   add derived responsive formats while retaining the original.

## 15. Recommended Next Step

Perform a human visual review of this Navbar + Hero slice at 375px, 430px,
768px, 1024px, 1440px, and 1920px, including the open mobile menu and keyboard
flow. Do not begin the next implementation phase until the composition, crop,
gradient strength, logo scale, and title sizing are approved.
