# TF696 Phase 4 — Recruitment & Landing Page Completion

## 1. Executive Summary

Phase 4 completes the core landing-page structure. It adds Section 05 —
Recruitment, a final Discord conversion section, and a restrained footer;
converts the Navbar's temporary RECRUITMENT control into a real `#recruitment`
link on desktop and mobile; and removes the duplicated `01` from the Hero
eyebrow so the numbered content sequence runs 01–05 exactly once.

All recruitment content is taken from the locked information supplied with this
phase. No skill criteria, test format, score, pass mark, mod name, modpack size,
training curriculum, or selection stage was invented. Apex is presented as
recommended, attendance as flexible, and Discord as the only entry point.

The approved Hero, About, Operations, Elements, and How We Operate sections were
not redesigned. `npm run lint` and `npm run build` both pass. Real browser
inspection was performed with a local headless Chrome driven over the Chrome
DevTools Protocol at 320, 375, 430, 768, 1024, 1280, 1440, and 1920px, with
measured DOM geometry alongside the screenshots.

Two genuine defects were found during that inspection and fixed. Both were
pre-existing and neither had been caught before, because Phases 2B and 3B had no
browser available and Phase 3C only inspected About and Our Elements:

- **The mobile menu rendered nothing and was not clickable.** Opening it adds
  `.site-header--active`, which applied `backdrop-filter` to `.site-header`.
  That makes the header the containing block for its `position: fixed`
  descendants, so the menu's `inset: 4.5rem 0 0` resolved inside the ~72px
  header box and the overlay computed to **0px tall**. Measured before the fix:
  `height: 0px`, and `document.elementFromPoint` at the menu's centre returned
  the Hero paragraph underneath. Mobile users could not navigate at all.
- **Focus never entered the open mobile menu.** The overlay transitioned
  `visibility` over 220ms, so it was still computed as `hidden` on the frame the
  open effect called `.focus()`, and the call was silently ignored.

Both fixes are CSS-only. `SiteHeader.jsx` logic is unchanged from the approved
version apart from the required RECRUITMENT link.

## 2. Recruitment Section

`src/components/sections/RecruitmentSection.jsx`, mounted as `#recruitment`
between How We Operate and the Final CTA.

- Editorial label `05 / RECRUITMENT` via the existing shared `SectionLabel`.
- H2: `READY TO JOIN` / `THE UNIT?` — the suggested headline, broken across two
  lines for composition.
- Thai copy, communicating the supplied meaning without additions:
  `TF696 เปิดรับผู้เล่นที่พร้อมทำงานเป็นทีม เรียนรู้ระบบการเล่น และผ่านการประเมินกับการฝึกก่อนเข้าร่วมภารกิจหลัก`
- Field colour is `--color-canvas` (#050505). How We Operate is the light
  `#ece9e2` field, so Recruitment restores the dark/light alternation before the
  photographic CTA closes the page.

The section answers the five required questions through three sub-blocks —
requirements, operation schedule, and onboarding — each introduced by an H3.
There is no application form, no fake selection language, and no implication
that acceptance is guaranteed.

At ≥1024px the headline and Thai copy form the same asymmetric two-column
opening used by About, with a fluid `clamp(3.5rem, 6vw, 7rem)` column gap. Below
1024px the copy sits offset right behind a hairline rule; below 768px it stacks.

## 3. Requirements Presentation

Seven ruled rows — not seven cards. Each row is `index / name / status / note`
with hairline rules above and below, no rounded corners, no borders around
individual items, and no background fills.

| # | Name | Status | Thai note |
|---|---|---|---|
| 01 | AGE | 18+ | ต่ำกว่า 18 ปี พิจารณาเป็นรายกรณี |
| 02 | MICROPHONE | REQUIRED | จำเป็นสำหรับการสื่อสารภายในทีม |
| 03 | SKILL ASSESSMENT | REQUIRED | ต้องผ่านการประเมินทักษะพื้นฐานก่อน |
| 04 | TRAINING | REQUIRED | ต้องผ่านการฝึกก่อนเข้าร่วม Operation |
| 05 | MODPACK | REQUIRED | ใช้ Modpack ของ TF696 |
| 06 | APEX DLC | RECOMMENDED | มี Apex ได้ก็ดี แต่ไม่บังคับ |
| 07 | ATTENDANCE | FLEXIBLE | เข้าร่วมตามเวลาที่สะดวก |

Content fidelity notes:

- The age row states `18+` and the under-18 note reads "considered case by
  case". It is never phrased as rejection.
- `SKILL ASSESSMENT` says only that a baseline assessment must be passed. No
  test type, drill, score, pass mark, time limit, or selection standard appears
  anywhere in the codebase.
- `MODPACK` names no mod and no download size.
- `APEX DLC` is the only row marked `RECOMMENDED`, with explicit Thai text
  confirming it is not mandatory.
- `ATTENDANCE` is `FLEXIBLE`; nothing on the page implies a weekly minimum.

Status meaning is carried by the words themselves, not by colour alone. Colour
is a secondary cue: `REQUIRED`/`18+` use the accent orange, `RECOMMENDED` and
`FLEXIBLE` use `rgba(245,245,245,0.62)`, deliberately quieter so an optional
item never reads as a barrier.

Layout: below 768px the row is index / name / status with the Thai note on a
second line; from 768px it becomes a single four-column line
(`3.75rem  minmax(11rem,1fr)  8.5rem  minmax(12rem,1.15fr)`).

## 4. Operation Schedule

A single editorial band inside Recruitment — not a calendar component, and not a
card grid. It uses the `--color-canvas-secondary` ground, a hairline border, and
one 3px accent rule on the left edge.

```
OPERATION                                        20:30
SCHEDULE                                         GMT+7
ตารางเวลาปฏิบัติการประจำสัปดาห์
──────────────────────────────────────────────────────
FRIDAY        │ SATURDAY        │ SUNDAY
```

- ≥768px: the H3 sits left, `20:30 GMT+7` is right-aligned on the same row in
  large accent type, and the three days form a full-width ruled three-column
  strip beneath.
- 640–767px: same three-column day strip, stacked heading and time.
- <640px: days become full-width ruled rows and the time sits below them.

The H3 reads `OPERATION SCHEDULE` rather than `OPERATIONS` so it does not
collide with the Section 02 heading of the same name in a screen-reader heading
list.

## 5. Onboarding Flow

Four steps, exactly as specified, with a short Thai line each and no invented
stages:

```
01 JOIN DISCORD      เริ่มต้นที่ Discord ของ TF696
02 SKILL ASSESSMENT  ประเมินทักษะพื้นฐาน
03 TRAINING          ผ่านการฝึกกับหน่วย
04 JOIN OPERATIONS   เข้าร่วมภารกิจหลัก
```

Introduced by the H3 `HOW TO JOIN` and one truthful line:
`ไม่มีแบบฟอร์มสมัครบนเว็บไซต์ — จุดเริ่มต้นคือ Discord`.

Presented as an ordered list: one column below 768px, two columns from 768px,
four ruled columns from 1024px. No interview, application, vetting, probation,
or approval stage was added, and nothing states or implies that acceptance is
automatic.

At ≥1024px `.onboarding__title` reserves two lines (`min-height: 2.08em`) so the
Thai notes share a baseline even though `SKILL ASSESSMENT` wraps. Verified in the
rendered page.

## 6. Final Discord CTA

`src/components/sections/FinalCtaSection.jsx`, mounted as `#join` after
Recruitment. `min-height: min(86svh, 44rem)` — a deliberate full-bleed moment
that is shorter than the Hero's `100svh`.

Composition (intentionally *not* the Hero's layout):

- A top identity band — `TASK FORCE 696`, a full-width hairline rule, and
  `ARMA 3 MILSIM / THAILAND` — spanning the container. The Hero has no such
  band; its eyebrow is a short left-aligned cluster.
- A large bottom row where the H2 `READY TO` / `OPERATE?` sits left and the
  single action sits right, baseline-aligned at ≥1024px. The Hero stacks one
  left-hand column with a paragraph and two buttons; this section spreads to both
  container edges, carries no body copy, and offers one action.
- `OPERATE?` is the only orange word, echoing the Hero's orange `696` as a
  closing note rather than repeating its treatment.
- Action: `JOIN DISCORD ↗` → `https://discord.gg/ptAbcyeDcf`, plus the invite
  handle as small `aria-hidden` text beneath it (decorative; the link itself
  carries the destination).

Below 640px the identity band stacks and its rule is hidden; the headline and
button move to a single left-aligned column.

## 7. Footer

`src/components/layout/SiteFooter.jsx`, a `<footer>` landmark outside `<main>`.

```
TF696                  ABOUT                COMMUNITY
TASK FORCE 696         OPERATIONS           [ JOIN DISCORD ↗ ]
ARMA 3 MILSIM /        ELEMENTS
THAILAND               HOW WE OPERATE
                       RECRUITMENT
──────────────────────────────────────────────────────
© 2026 TASK FORCE 696       FRI / SAT / SUN — 20:30 GMT+7
```

- Three columns from 768px, stacked below.
- Navigation covers all five content sections, including HOW WE OPERATE, which
  is not in the Navbar.
- The year comes from `new Date().getFullYear()`.
- **No social links and no icons of any kind.** `img/facebook.png` and
  `img/discord.png` exist in the media bank but were deliberately not used,
  because no verified Facebook or YouTube URL is locked. There are no dead
  icons and no placeholder hrefs.

## 8. Navigation Changes

- `NAV_ITEMS` RECRUITMENT now carries `href: '#recruitment'`. Both the desktop
  and mobile branches render plain anchors; the conditional button branch, its
  "available in a later phase" ARIA label, and the `handleFutureAction` helper
  are gone.
- With no future-destination controls left, the `navigationStatus` state and the
  `aria-live` status paragraph were removed from `App.jsx`, and `SiteHeader` no
  longer takes an `onFutureNavigation` prop.
- Mobile RECRUITMENT now shows the `VIEW SECTION` caption like the other three
  destinations instead of `PHASE NEXT`. It is the longest destination name, so
  on narrow phones that caption wraps to two lines; the caption is right-aligned
  so the wrap reads as deliberate.

Measured in the browser:

| Check | Result |
|---|---|
| Desktop nav hrefs | `#about`, `#operations`, `#elements`, `#recruitment`, Discord |
| Desktop RECRUITMENT click | `location.hash` → `#recruitment`, section top 146px (80px `scroll-margin-top` clears the fixed header) |
| Mobile RECRUITMENT click | `location.hash` → `#recruitment`, section top 228px |
| Mobile menu after navigating | closed |
| `document.body.style.overflow` after navigating | restored to `""` |
| Escape while open | closes, focus returns to `.menu-trigger` |
| Closed-menu link `tabIndex` | `-1, -1, -1, -1` |

### 8.1 Mobile menu defects found and fixed

**The overlay had zero height.** `.site-header--active` is applied whenever the
page is scrolled *or the menu is open*, and it set `backdrop-filter: blur(14px)`
on `.site-header`. `backdrop-filter` makes an element the containing block for
`position: fixed` descendants, so `.mobile-menu { inset: 4.5rem 0 0 }` resolved
against the ~72px header box: `top: 72px`, `bottom: 0px`, **`height: 0px`**. The
overlay painted nothing and hit-testing at its centre returned the Hero
paragraph beneath it.

Fix: the scrolled bar's background and blur moved to `.site-header::before`
(`position: absolute; inset: 0; z-index: -1`). The header itself no longer
carries a filter, so it no longer forms a containing block. Measured after the
fix: `height: 740px`, and `elementFromPoint` at the menu centre returns
`a.mobile-nav__link`. The bar's appearance is unchanged — `rgba(5,5,5,0.88)`,
`blur(14px)`, the same border and the same 260ms transition — confirmed against
a scrolled screenshot at 1440px and 375px.

**Focus never entered the menu.** `.mobile-menu` transitioned `visibility` over
220ms, so on the frame `.is-open` landed the overlay was still computed as
`hidden` and the open effect's `.focus()` was ignored. Fix: `visibility` now
switches with `0s linear 0s` while open and `0s linear 220ms` while closing, the
standard pattern — instant on open, held through the 220ms fade on close.
Measured after the fix: `document.activeElement` is the first
`a.mobile-nav__link` once the menu opens.

An earlier attempt to solve this with `requestAnimationFrame` in `SiteHeader.jsx`
was reverted; the component's focus logic is exactly as approved.

## 9. Hero Numbering Fix

`<span aria-hidden="true">01</span>` was removed from the Hero eyebrow, along
with its `.hero__eyebrow span` orange-square rule. `ARMA 3 MILSIM / THAILAND` is
preserved verbatim.

A short 2.25rem × 3px orange rule (`.hero__eyebrow-rule`) replaces the badge, so
the eyebrow keeps its visual anchor and a trace of the accent without reading as
a section index. This is the only Hero change in this phase; the title, copy,
actions, image, gradients, footer strip, and every `hero__` breakpoint rule are
untouched. If the rule is not wanted, deleting the span and its one CSS block
leaves the plain text label.

Verified in the rendered page at all eight widths: `.hero__eyebrow` textContent
is exactly `ARMA 3 MILSIM / THAILAND`, and the five section labels read:

```
01/WHO WE ARE   02/OPERATIONS   03/OUR ELEMENTS   04/HOW WE OPERATE   05/RECRUITMENT
```

No existing content section was renumbered.

## 10. Responsive Review

Measured in the built app (`vite preview`) using
`Emulation.setDeviceMetricsOverride`, which sets an exact viewport and avoids the
minimum-window-width clamping that produced a misleading reading in Phase 3C.

| Width | `body.scrollWidth` | Horizontal overflow | Elements past the container in `#recruitment`, `#join`, `.site-footer` | Page height |
|---:|---:|---|---|---:|
| 320 | 320 | none | 0 | 9625 |
| 375 | 375 | none | 0 | 9471 |
| 430 | 430 | none | 0 | 9321 |
| 768 | 768 | none | 0 | 9083 |
| 1024 | 1024 | none | 0 | 8869 |
| 1280 | 1280 | none | 0 | 10026 |
| 1440 | 1440 | none | 0 | 10570 |
| 1920 | 1920 | none | 0 | 11156 |

Behaviour by band:

- **320–639px** — single column throughout. Requirement rows are two-line
  (name + status, then Thai note). Schedule days are full-width ruled rows with
  the time beneath. Onboarding is a single ruled column. The CTA identity band
  stacks. The footer stacks brand → nav → Discord → bottom bar.
- **640–767px** — schedule days become a three-column ruled strip; the CTA
  identity band becomes a single row with its connecting rule.
- **768–1023px** — requirement rows become one four-column line; the schedule
  puts the heading and time side by side with the day strip below; onboarding
  goes to two columns; the footer goes to three columns; Recruitment's Thai copy
  offsets right behind a hairline rule.
- **1024px+** — Recruitment opens as a two-column headline/copy composition;
  onboarding becomes four ruled columns; the CTA headline and action split left
  and right.
- **1440px / 1920px** — the container caps at 88rem/1408px, so from 1440px the
  CTA photograph runs full-bleed while its content stays inside the container,
  producing the intended wide negative space at 1920px.

Thai wrapping was reviewed in the screenshots at every width. Requirement notes,
the Recruitment intro paragraph, the schedule caption, and the onboarding notes
all wrap cleanly with no clipping and no mid-syllable breaks. The two longest —
`ต้องผ่านการฝึกก่อนเข้าร่วม Operation` at 768px and
`ไม่มีแบบฟอร์มสมัครบนเว็บไซต์ — จุดเริ่มต้นคือ Discord` at 1024px — sit inside their
columns; both were measured, not estimated.

## 11. Accessibility

- **Headings.** Still exactly one `h1` (the Hero). Six `h2` elements — the five
  numbered sections plus the Final CTA. New `h3`s (`REQUIREMENTS`,
  `OPERATION SCHEDULE`, `HOW TO JOIN`) nest under the Recruitment `h2`. Verified
  by counting in the rendered page at all eight widths.
- **Accessible names.** Multi-line headings previously concatenated without a
  space (`READY TO JOINTHE UNIT?`). Every new heading now carries an explicit
  space between its line spans, so they expose `READY TO JOIN THE UNIT?`,
  `READY TO OPERATE?`, and `OPERATION SCHEDULE`. The equivalent issue in the
  approved sections (for example `TACTICAL FREEDOM.MISSION CONSEQUENCES.`) was
  left alone — see §16.
- **Semantics.** Recruitment is a `<section>` with `aria-labelledby`.
  Requirements and the onboarding flow are `<ol>` lists; the schedule days are a
  `<ul>`. The footer is a `<footer>` landmark outside `<main>` with a labelled
  `<nav>`.
- **Discord links.** All five (`header`, mobile menu, Hero, Final CTA, footer)
  point at `https://discord.gg/ptAbcyeDcf` and every one carries
  `target="_blank"` with `rel="noopener noreferrer"`. Verified by querying the
  rendered DOM.
- **Keyboard.** The new Final CTA button and both footer link groups are
  tabbable and match `:focus-visible`, keeping the global 3px orange outline.
  The tab order ends Hero actions → Final CTA → five footer links → footer
  Discord.
- **Mobile menu.** Focus containment, Escape-to-close with focus return, scroll
  lock, `aria-expanded`/`aria-controls`, and removal from the tab order when
  closed all still work — and focus-on-open now actually works for the first
  time (§8.1).
- **Colour is never the only cue.** `REQUIRED`, `RECOMMENDED`, and `FLEXIBLE`
  are literal text. The `01`–`07` and `01`–`04` index markers are
  `aria-hidden`, and the information they decorate is present as real text.
- **Contrast** on the dark Recruitment field: names and day labels at `#f5f5f5`,
  Thai notes at `--color-secondary` (#a3a3a3, ≈ 9:1), accent orange status text
  on #050505 (≈ 5.9:1), optional status at 62% white (≈ 8:1). Final CTA text
  sits in the darkest corner of the composition, where the combined gradients
  leave roughly 1–2% image transmittance.
- **Reduced motion.** The `prefers-reduced-motion: reduce` block is untouched
  and was confirmed present in the built stylesheet. Phase 4 adds no animation —
  only the same 220ms hover/focus colour and arrow transitions already used
  elsewhere.

## 12. Asset Usage

One existing image was added to the build, chosen after visually inspecting
every unused candidate in `img/` (`activity1`, `activity4`, `activity5`,
`activity6`/`main696`, `sq887`, `556`, `696HVT`, `696SQ`, `threelogo`).

| Asset | Use | Dimensions | Size |
|---|---|---:|---:|
| `img/activity6.jpg` | Final CTA background field | 1920 × 1080 | **3,504,879 bytes (≈ 3.34 MB)** |

Why this one: it is the assembled unit indoors at night — the natural closing
image for "join us" — and it is dark, so it sits under the final black field
without fighting the type. It is also visually distinct from the Hero, which is a
bright, sepia-toned daytime group portrait, so the CTA does not read as a repeat.
`activity4.jpg` (night-vision) was rejected because its circular mask reads as
HUD/scope chrome, and `696SQ.png` because it has unit cards baked into the
artwork and is 15.5 MB. `696HVT.png` is an insurgent-scene image, unsuitable for
a recruitment CTA.

- `img/activity6.jpg` is byte-identical to `img/main696.jpg`
  (`sha256 219f7dbe…ccceb`); `activity6` was chosen for naming consistency with
  the Operations imagery.
- **No original asset was modified.** The file's SHA-256 after this phase matches
  its pre-phase value. Nothing was resized, recompressed, cropped, or renamed.
- No new, external, or generated imagery was introduced, and no other media was
  added.
- The image is decorative: `alt=""`, `aria-hidden="true"`,
  `loading="lazy"`, `decoding="async"`, with explicit `width`/`height`. All CTA
  information is real text.
- **This 3.34 MB source is documented, not optimised.** Responsive derivatives
  belong to the next dedicated optimization phase. It joins `main6962.jpg`
  (3.47 MB) and `activity2.jpg` (3.24 MB) as the three large sources; total
  emitted image weight is now ≈ 12.0 MB.

The footer's deliberate absence of social icons means `img/facebook.png` and
`img/discord.png` remain unused.

## 13. Verification

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
✓ 35 modules transformed.
dist/index.html                          0.93 kB │ gzip:  0.54 kB
dist/assets/557-BvEBGRGL.png           136.63 kB
dist/assets/2-DxhLqVo4.png             171.38 kB
dist/assets/activity3-BHFngZ3E.jpg     189.50 kB
dist/assets/3-CNcA2ut7.png             217.37 kB
dist/assets/696_Circle-B3U3MkpE.png  1,073.11 kB
dist/assets/activity2-uQjNLhbu.jpg   3,242.62 kB
dist/assets/main6962-DaEdVtSb.jpg    3,472.64 kB
dist/assets/activity6-N2QImgG5.jpg   3,504.87 kB
dist/assets/index-iXqnRy5x.css          37.46 kB │ gzip:  8.11 kB
dist/assets/index-EZehluHb.js          211.17 kB │ gzip: 65.03 kB
✓ built in 1.97s
Exit code: 0
```

CSS grew 26.80 kB → 37.46 kB (gzip 6.53 → 8.11 kB); JS grew 204.65 kB → 211.17 kB
(gzip 63.91 → 65.03 kB) for the three new components.

Scope checks against the "do not add" list: `package.json` still declares exactly
`react` and `react-dom` plus the nine original devDependencies — **no dependency
was added**. A search of `src/` found no form element, no `<video>` or `<audio>`,
no router, no `fetch`, and no analytics. No deployment workflow, SEO change, or
media optimisation was performed.

## 14. Browser Visual Inspection

**Real browser inspection was performed**, and unlike Phase 3C it ran against the
actual application rather than a static harness.

Method: `vite preview` served the production build on `127.0.0.1:4319`. A local
Chrome 152 (`C:\Program Files\Google\Chrome\Application\chrome.exe`) ran in
`--headless=new` with `--remote-debugging-port`, driven over CDP by a small Node
script using Node 24's built-in `WebSocket`. **No dependency was installed for
this.** Each width used `Emulation.setDeviceMetricsOverride` for an exact
viewport, `Network.setCacheDisabled` to guarantee the current bundle, waited on
`document.fonts.ready`, forced lazy images to load, and then captured
`Page.captureScreenshot` with `captureBeyondViewport` plus a DOM measurement
pass.

Reviewed at 320, 375, 430, 768, 1024, 1280, 1440, and 1920px:

- Full-page screenshots, plus dedicated crops of `#recruitment`, `#join`, and
  `.site-footer`.
- Close crops of the schedule band at 375/768/1440 and the onboarding row at
  1024, to check the day strip and the step-note baselines.
- The Hero eyebrow at 375 and the whole Hero content block at 1440, to confirm
  the numbering fix landed and nothing else moved.
- The open mobile menu at 375 — which is how the zero-height defect was caught.
- The scrolled header at 375 and 1440, to confirm the blur refactor preserves
  the approved bar.
- The full page tail (How We Operate → Recruitment → CTA → Footer) at 1440, to
  judge section rhythm.

Two changes were made as a direct result of looking at the renders:

1. The Final CTA scrim was too heavy — the unit was invisible. The vertical and
   horizontal gradients were lightened (mid-stops 0.6 → 0.34 and 0.4 → 0.20) so
   the team reads while the headline corner stays effectively black.
2. `SKILL ASSESSMENT` wraps in the four-column onboarding row, which left its
   Thai note lower than its neighbours'. The step title now reserves two lines
   at ≥1024px.

Honest caveats:

- Everything above is headless Chromium on Windows. No physical handset, no
  Safari/iOS, and no Firefox was tested. `100svh` and `86svh` behave differently
  with mobile browser chrome, so the Hero and Final CTA heights on a real phone
  still deserve a human look.
- Screenshots are working files in the session scratchpad and are not committed.

## 15. Files Changed

### Created

- `src/components/sections/RecruitmentSection.jsx`
- `src/components/sections/FinalCtaSection.jsx`
- `src/components/layout/SiteFooter.jsx`
- `TF696_PHASE_4_RECRUITMENT_COMPLETION_REPORT.md`

### Modified

- `src/App.jsx` — mounts Recruitment, the Final CTA, and the footer; removed the
  now-unused future-navigation state and its `aria-live` status paragraph.
- `src/components/layout/SiteHeader.jsx` — RECRUITMENT is a real
  `#recruitment` link; the future-destination button branch and
  `handleFutureAction` removed; `onFutureNavigation` prop dropped. Focus, focus
  trap, Escape, scroll lock, and resize behaviour are unchanged.
- `src/components/sections/HeroSection.jsx` — the `01` eyebrow span became
  `.hero__eyebrow-rule`. No other change.
- `src/index.css` — Phase 4 section styles appended; `.hero__eyebrow span`
  replaced by `.hero__eyebrow-rule`; `.site-header` blur moved to
  `::before`; `.mobile-menu` visibility transition corrected;
  `.mobile-nav__link small` right-aligned.
- `dist/` regenerated by the build and still ignored.

### Removed

- None.

### Assets

- No file in `img/` or `audio/` was added, edited, renamed, or deleted.
  `img/activity6.jpg` is now imported by the build.

## 16. Remaining Questions / Issues

1. **Skill assessment wording is intentionally a placeholder.** Once the real
   baseline is defined, the copy to change is the `SKILL ASSESSMENT` row's Thai
   note in `RecruitmentSection.jsx` and, if needed, step 02 of the onboarding
   flow. Nothing else in the codebase describes assessment content.
2. **The Hero eyebrow rule** is my substitution for the removed `01` badge.
   Confirm you want it, or say the word and the eyebrow becomes plain text.
3. **Approved-section heading names still concatenate.** `TACTICAL
   FREEDOM.MISSION CONSEQUENCES.`, `MISSION DRIVEN.PLAYER DECIDED.` and
   `LEGION. COHORT. FORTIS.` expose run-together accessible names for the same
   reason the new headings did. The one-character fix is identical, but it edits
   approved sections, so it was left for your decision.
4. **Mobile menu regression risk.** The zero-height defect means mobile
   navigation has never actually worked in a browser before now. It is worth a
   human check on a real handset, since it is the highest-traffic path to
   Discord.
5. **`activity6.jpg` is 3.34 MB** and loads at the bottom of the page. It is
   lazy-loaded, so it does not affect first paint, but it is a real cost on
   mobile data and belongs in the optimization phase.
6. **`activity6.jpg` carries a small unit watermark** in its top-right corner and
   a chromatic-split effect baked into the source. Both are inherited from the
   asset. The crop (`object-position: 50% 40%`) and scrim keep the watermark
   subdued, but confirm the treatment is acceptable.
7. **`RECRUITMENT` / `VIEW SECTION` wraps** in the mobile menu at 375px and
   below. It is tidy and causes no overflow, but if you would rather it stayed
   on one line the caption text or the nav type scale needs a small change.
8. **The Navbar still shows four destinations**, without HOW WE OPERATE. The
   brief asked only that RECRUITMENT become a link, so no item was added. The
   footer lists all five. Confirm whether the Navbar should also carry it.
9. **`#join` is not linked from anywhere.** The Final CTA has a stable id for
   future use but nothing targets it today; that is intentional, not an
   oversight.

## 17. Recommended Next Step

Human visual and keyboard review of the complete page — Hero → About →
Operations → Elements → How We Operate → Recruitment → Final CTA → Footer — with
particular attention to the mobile menu on a real handset, the recruitment
wording against the locked information, and the Final CTA image choice and scrim
strength.

After Phase 4 is approved, the natural next phase is the dedicated performance
and media pass: responsive derivatives for the three ≈3.3 MB sources (retaining
the originals), then SEO and deployment as separate steps. None of that was
started here.
