# TF696 Phase 6 — SEO, Accessibility & Content QA

## 1. Executive Summary

Phase 6 prepares the TF696 V2 landing page for public indexing. No section was
redesigned, no marketing copy was rewritten, no dependency was added, and
nothing was deployed.

The document head is now complete and honest: a title and Thai-first
description that both state plainly that TF696 is an **Arma 3 Milsim community**,
`robots`, `theme-color`, `color-scheme`, a working favicon, and the Open Graph
fields that can be filled in truthfully today. **No canonical URL was invented.**
`og:url`, `og:image`, `<link rel="canonical">` and JSON-LD all require the
production origin, which is still unconfirmed, so they are specified in §5–§7
and deferred to Phase 7 rather than guessed.

Four things were found and fixed, each measured before and after:

| Finding | Fix | Proof |
|---|---|---|
| Legacy `img/favicon.ico` is an **older mark**, not the current emblem, and its light values are crushed nearly to black (p95 luminance 81/255 at 48px) | Icons derived from the canonical logo instead; legacy file left untouched | derived p95 241/255; §4 |
| `.requirement-row__index` measured **3.5:1** against `#050505` — below the 4.5:1 small text needs | alpha 0.40 → 0.52, the value the site already uses for the same kind of marker | 5.29:1; §15 |
| Mobile nav links' text run concatenated to `01ABOUTVIEW SECTION` | `{' '}` between grid items, the same fix Phase 5 applied to headings | **0 of 60 geometry probes changed** at 320/375/430; §8 |
| Skip link relied on Chrome's sequential-focus starting point; `<main>` was not focusable | `tabIndex="-1"` on `<main>` | focus now lands on `MAIN#main-content`; §13 |

Everything else passed as it stood. **Exactly one H1, six H2, twelve H3, zero
empty headings, zero level jumps.** All 21 links resolve; the only public
Discord invite anywhere in the shipped source is
`https://discord.gg/ptAbcyeDcf`, on all five CTAs, each with
`target="_blank" rel="noopener noreferrer"`. All seven recruitment facts render
exactly as locked. Phase 5's image accessibility and loading strategy survived
intact. **The Phase 4 mobile-menu zero-height bug has not regressed** at 320,
375 or 430. Reduced motion still disables everything and breaks nothing.

**Performance did not regress.** At 1440 and 1920 the measured transfer is
within 145 bytes of Phase 5; at 375 @2x it is +6,849 bytes, which is the newly
declared favicon and nothing else. The hero is still fetched exactly once at
every viewport.

`npm run lint`, `npm run build` and `npm run optimize:images` all pass, the last
still a no-op (`0 written, 96 reused`). All 28 archival `img/` and `audio/` files
remain byte-identical to the recovery archive.

**Two items block deployment, both by design:** the production origin is not
confirmed, and the Vite `base` decision that depends on it (§18).

---

## 2. Metadata Audit

### What the served document now contains

Read back out of the built `dist/index.html` in a real browser, not from source:

| Tag | Value | Verdict |
|---|---|---|
| `charset` | `UTF-8` | present, first in head |
| `viewport` | `width=device-width, initial-scale=1.0` | present, no `user-scalable=no`, no `maximum-scale` — pinch zoom is not blocked |
| `<html lang>` | `th` | correct for a Thai-first document |
| `title` | `Task Force 696 — Arma 3 Milsim Thailand` | §3 |
| `description` | Thai-first, 113 characters | §3 |
| `robots` | `index, follow, max-image-preview:large` | §17 |
| `theme-color` | `#050505` | matches `--color-canvas` exactly |
| `color-scheme` | `dark` | the site is dark-only; this stops the UA painting light scrollbars and form chrome around it |
| `og:type` | `website` | §6 |
| `og:site_name` | `Task Force 696` | §6 |
| `og:title` | `Task Force 696 — Arma 3 Milsim Thailand` | §6 |
| `og:description` | same as `description` | §6 |
| `og:locale` | `th_TH` | §6 |
| `link rel=icon` | `./favicon.ico`, `sizes="48x48 32x32 16x16"` | §4 |
| `link rel=apple-touch-icon` | `./apple-touch-icon.png` | §4 |
| `link rel=preconnect` ×2 | Google Fonts origins | pre-existing, retained |
| `link rel=stylesheet` | Google Fonts | pre-existing, retained |
| `link rel=preload as=image` | hero AVIF `imagesrcset` | Phase 5's LCP preload, still injected and still correct |

### Removed / not added

- **Nothing obsolete was found to remove.** The Phase 2A head had no
  `X-UA-Compatible`, no duplicate description, no `keywords`, no legacy
  `apple-mobile-web-app-*` block, and no duplicated tags.
- **`meta keywords`** — ignored by every major engine since 2009. Not added.
- **`meta author` / `generator` / `revisit-after` / `rating`** — no consumer.
  Not added.
- **A web app manifest** — `start_url` and `scope` are deployment-path
  dependent, so it cannot be written correctly before the base is settled, and
  a static landing page gains nothing from it today. Deferred, deliberately.
- **Twitter/X card tags** — the brief forbids account metadata, and
  `twitter:card` without an image or a site handle does nothing that the Open
  Graph tags do not already do. Not added.

### One judgement call, stated

`robots` is `index, follow, max-image-preview:large`. `index, follow` on its own
is the specified default and would be a meaningless tag. `max-image-preview:large`
is **not** the default and does change behaviour — it permits large image
previews in search results, which matters for a page whose content is largely
photography. The default half is written alongside it so the directive reads as
a deliberate statement rather than half a directive.

---

## 3. Title / Description

### Title

```text
Task Force 696 — Arma 3 Milsim Thailand
```

39 characters — comfortably inside the ~60 that Google renders. It is exactly
the direction the brief recommended and was already in place from Phase 2A; it
was verified, not changed.

It names the game (`Arma 3`), the activity (`Milsim`) and the region
(`Thailand`). Nothing in it reads as a real military unit: "Task Force 696"
sits immediately beside "Arma 3 Milsim", so the game context is inseparable
from the brand in every search snippet.

### Description

```text
TF696 คือคอมมูนิตี้ Arma 3 Milsim สำหรับผู้เล่นชาวไทย ที่เน้นการทำงานเป็นทีม การวางแผน การฝึก และภารกิจแบบ Milsim
```

113 characters. Thai-first, as the brief specified, and it is the brief's own
wording. It communicates: community, Arma 3, Milsim, Thai players, teamwork,
planning, training, Milsim missions.

The previous description (`Task Force 696 — คอมมูนิตี้ Arma 3 Milsim สำหรับผู้เล่นชาวไทย`)
was accurate but stopped at the category. The replacement adds what the unit
actually does.

### What it does not claim

No superlative, no ranking, no scale, no authority. Specifically absent:
"Thailand's #1", "best Arma server", "largest community", "official", and any
word implying a real military organisation. "Milsim" appears twice — once
naming the genre and once naming the mission format — which is the natural
reading of the sentence, not keyword stuffing; the description contains no
repeated term beyond that.

---

## 4. Favicon

### The legacy asset was inspected before any decision

`img/favicon.ico` (15,406 bytes) is a **structurally valid** ICO: 3 entries at
16×16, 32×32 and 48×48, 32bpp BMP. It is not corrupt. Two things are wrong with
it anyway, and both were measured by decoding the container rather than by
looking at a thumbnail.

**1. It is not the current mark.** Decoded and contrast-boosted, the artwork is
a circular badge containing a hooded figure — but with **no valknut and no rune
ring**. The approved canonical logo `img/696_Circle.png` is the same figure
*inside* a valknut *inside* a ring of runes. The favicon predates the current
identity.

**2. It renders as a black disc.** Luminance of its opaque pixels, 48×48 frame:

| | median | 95th percentile | max |
|---|---:|---:|---:|
| Legacy `img/favicon.ico` | 0 | **81** / 255 | 255 |
| Derived from the canonical logo | 19 | **241** / 255 | 255 |

95% of the legacy icon's opaque pixels are darker than 81/255. In a browser tab
— light or dark — it reads as a dark circle with no discernible mark.

**Decision: it was not wired up, and it was not modified.** It stays in `img/`
untouched, at its original 15,406 bytes and original modification time.

### What ships instead

The brief permits deriving an icon from the approved canonical logo if that is
clearly better. It is, so it was done — by **downscaling only**. No recolour, no
redraw, no crop of the artwork itself, no restyling.

`scripts/generate-favicon.mjs` opens `img/696_Circle.png` read-only, extracts
the emblem's measured content box — `left 538, top 30, 2442 × 2443`, taken from
the alpha channel and square to within one pixel — and Lanczos-3 downscales it.
It re-hashes the master afterwards and aborts if it changed. It has not.

| Output | Size | Bytes |
|---|---|---:|
| `public/favicon.ico` | 16 / 32 / 48, PNG-in-ICO | 6,615 |
| `public/apple-touch-icon.png` | 180 × 180, emblem at 84% on `#050505` | 15,709 |

Run with `npm run favicon:generate`. It is **deterministic** — a second run
produced byte-identical output (`md5 5aca3f2b…` and `40639733…` both times).

Two decisions worth recording:

- **PNG-in-ICO, not BMP.** The uncompressed BMP form of the same three frames
  is 15,086 bytes against 5,880 for PNG. The icon is fetched above the fold, so
  shipping BMP would have handed back 9 kB of the saving Phase 5 just bought.
  Every browser from IE11 and every Windows from Vista reads PNG-in-ICO. The
  encoding is lossless — it was compared against a forced truecolour encode and
  came out the same size to within one byte, i.e. sharp is already storing it as
  grey+alpha with no quantisation.
- **The apple-touch icon is flattened onto `#050505`.** iOS composites
  transparency itself and applies a rounded mask; the 84% inset keeps the circle
  clear of the corners. `#050505` is the site's own canvas token, so this adds a
  background, not a treatment.

### Verified in the browser

`new Image()` decoded `./favicon.ico` to **48 × 48** and `./apple-touch-icon.png`
to **180 × 180**, both HTTP 200, `content-type: image/x-icon` on the former.

### Honest limitation

**At 16 × 16 the emblem is not legible.** The runes collapse into noise and only
the valknut's triangle survives as a suggestion. That is inherent to a dense
circular emblem at 16 pixels, not a defect of the derivation — and it is still a
large improvement on the legacy file, which was illegible at *all three* sizes.
If a genuinely readable small icon matters, the answer is a purpose-drawn
simplified mark, which is a design decision outside this phase.

---

## 5. Canonical URL Status

**No canonical URL exists, and none was invented.**

What is actually known:

- No Git remote, no GitHub repository metadata, no `CNAME`, no custom domain
  configuration anywhere in the tree (unchanged since Phase 2A §13).
- `vite.config.js` still carries `base: './'`, explicitly labelled a portable
  placeholder rather than a deployment decision.
- Nothing in Phases 2A–5 records a confirmed production URL.

Therefore:

- `<link rel="canonical">` is **not present**.
- `og:url` is **not present**.
- No sitemap is generated, and `public/robots.txt` carries no `Sitemap:`
  directive — that directive must be an absolute URL.

`example.com`, `localhost`, `127.0.0.1` and a guessed
`username.github.io/TF696/` were all considered and rejected. A wrong canonical
is materially worse than no canonical: it can de-index the real page.

**Deferred to Phase 7.** Once the origin is confirmed, the exact additions are:

```html
<link rel="canonical" href="https://ORIGIN/PATH/" />
<meta property="og:url" content="https://ORIGIN/PATH/" />
<meta property="og:image" content="https://ORIGIN/PATH/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="..." />
```

and, in `public/robots.txt`, `Sitemap: https://ORIGIN/PATH/sitemap.xml`.

---

## 6. Open Graph / Social Metadata

Everything that can be stated truthfully without the origin is present:

```html
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Task Force 696" />
<meta property="og:title" content="Task Force 696 — Arma 3 Milsim Thailand" />
<meta property="og:description" content="TF696 คือคอมมูนิตี้ Arma 3 Milsim สำหรับผู้เล่นชาวไทย …" />
<meta property="og:locale" content="th_TH" />
```

These matter more than usual here. Discord, Slack, LINE, Facebook and X unfurl
links by reading the **static HTML head** — most of them do not execute
JavaScript. Since this is a client-rendered page (§17), the head is the *only*
thing an unfurler sees, and the primary conversion is a Discord invite that
people will paste into chat. Getting these right is not decoration.

**Deliberately absent:**

- `og:url` and `og:image` — both require an absolute URL. Specified in §5.
- Every `twitter:*` tag. The brief forbids account metadata, no official X
  account is confirmed, and `twitter:card` without an image adds nothing over
  Open Graph, which X already falls back to.
- `article:*`, `og:video`, `fb:app_id` — no truthful value to supply.

### The og:image, for Phase 7

Until `og:image` is set, unfurls will render as a text-only card. A candidate
already exists in the asset bank and needs no new artwork: a 1200 × 630 crop of
`img/main6962.jpg`, the approved hero. That is a derived asset like every other
image in `src/assets/optimized/`, and it should be produced the same way — from
the untouched master. It was **not** created in this phase, because without the
origin it could not be wired up or verified, and shipping an unreferenced image
would be dead weight in the bundle.

---

## 7. Structured Data Decision

**No JSON-LD was added. This is deliberate, and it is the honest answer.**

The reasoning, in order:

1. **Schema.org's useful types need the URL.** `WebSite` and `Organization`
   both effectively require `url`, and `Organization.logo` must be an absolute
   URL. Neither can be written before §5 resolves. Emitting them with the field
   omitted produces markup that validators flag and engines ignore.
2. **There is no rich result to win.** This is one page. There are no
   breadcrumbs, no articles, no events with confirmed public detail, no
   products, and no site search endpoint for a Sitebox. The realistic outcome of
   adding `WebSite` markup here is nothing visible.
3. **The safe fields are already covered.** Title, description, locale, language
   and social preview are expressed in the head, which is what actually feeds
   the snippet.
4. **The risky fields are exactly the ones the brief forbids.** A believable
   `Organization` block invites `address`, `foundingDate`, `numberOfEmployees`,
   `sameAs`, `contactPoint` — none of which can be filled without inventing
   facts, and several of which would push the page *towards* reading as a real
   organisation rather than a game community.

Adding schema here would be satisfying a checklist, which the brief explicitly
told me not to do.

**For Phase 7, if it is wanted**, the one type that would be both safe and
truthful is a `VideoGameClan`-flavoured `Organization` — but the safer framing
is simply:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Task Force 696",
  "alternateName": "TF696",
  "url": "https://ORIGIN/PATH/",
  "inLanguage": "th",
  "about": { "@type": "VideoGame", "name": "Arma 3" },
  "description": "TF696 คือคอมมูนิตี้ Arma 3 Milsim สำหรับผู้เล่นชาวไทย …"
}
```

Every field there is verifiable from the page itself. Nothing about
membership, founding, location or affiliation should be added.

---

## 8. Heading / Landmark Audit

Measured in the rendered document with all lazy content forced in, then
cross-checked against Chrome's computed accessibility tree.

### Headings

```text
H1  TASK FORCE 696                            #hero-title
H2  TACTICAL FREEDOM. MISSION CONSEQUENCES.   #about-title
H2  MISSION DRIVEN. PLAYER DECIDED.           #operations-title
H3    DIRECT ACTION
H3    AVIATION / FIRE SUPPORT
H2  LEGION. COHORT. FORTIS.                   #elements-title
H3    LEGION
H3    COHORT
H3    FORTIS
H2  FREEDOM WITHIN THE TEAM.                  #principles-title
H3    SEMI ROLEPLAY
H3    PLAYER FREEDOM
H3    CONSEQUENCE
H3    TEAMWORK
H2  READY TO JOIN THE UNIT?                   #recruitment-title
H3    REQUIREMENTS
H3    OPERATION SCHEDULE
H3    HOW TO JOIN
H2  READY TO OPERATE?                         #final-cta-title
```

| Check | Result |
|---|---|
| Exactly one H1 | **1** |
| H2 count | 6 |
| H3 count | 12 |
| Empty headings | **0** |
| Level jumps (n → n+2 or worse) | **0** |
| Counts stable across 320 → 1920 | yes, 1 / 6 / 12 at all seven widths |

No visual typography was altered to achieve this. Phase 5's `{' '}` fix is
holding — every multi-line heading exposes a properly spaced name at the DOM
text level as well as in the AX tree.

### Landmarks

| Landmark | Count | Accessible name |
|---|---:|---|
| `banner` (`<header>`) | 1 | — (unique, no name needed) |
| `main` | 1 | — (`id="main-content"`) |
| `contentinfo` (`<footer>`) | 1 | — |
| `navigation` | 3 | `เมนูหลัก`, `เมนูสำหรับมือถือ`, `เมนูส่วนท้าย` |
| `region` (`<section aria-labelledby>`) | 7 | see below |

All three `<nav>` elements are distinctly labelled, which is what matters when
more than one exists. At 375 px the desktop nav is `display: none` and correctly
**absent** from the accessibility tree — only the mobile and footer navs appear.

Every section resolves its `aria-labelledby` to a real heading:

```text
#hero            → TASK FORCE 696
#about           → TACTICAL FREEDOM. MISSION CONSEQUENCES.
#operations      → MISSION DRIVEN. PLAYER DECIDED.
#elements        → LEGION. COHORT. FORTIS.
#how-we-operate  → FREEDOM WITHIN THE TEAM.
#recruitment     → READY TO JOIN THE UNIT?
#join            → READY TO OPERATE?
```

Zero dangling `aria-labelledby` targets.

### One accessible-name defect found and fixed

The four mobile navigation links exposed a **DOM text run** of
`01ABOUTVIEW SECTION`. Chrome's computed AX name was already correct
(`ABOUT VIEW SECTION` — it inserts a space between block boxes and drops the
`aria-hidden` `01`), but the underlying text is what copy/paste, text
extraction, indexing and any AT stack that does not replicate Chrome's
heuristic will see. This is precisely the defect Phase 5 documented and fixed
for the headings, in an interactive control it had not reached.

The fix is one `{' '}` per gap in `SiteHeader.jsx`. `.mobile-nav__link` is a
CSS grid, and whitespace-only anonymous items generate no box — but "should" is
not evidence, so it was measured. Two builds, identical except for the spaces,
compared at **320, 375 and 430** across every link box, every `01`–`04` marker,
every `VIEW SECTION` caption, the label text run's own rect, the overlay, the
inner container, the CTA and the note, to three decimal places:

```text
geometry probes compared: 60    differing: 0
```

```text
01ABOUTVIEW SECTION        →  01 ABOUT VIEW SECTION
02OPERATIONSVIEW SECTION   →  02 OPERATIONS VIEW SECTION
03ELEMENTSVIEW SECTION     →  03 ELEMENTS VIEW SECTION
04RECRUITMENTVIEW SECTION  →  04 RECRUITMENT VIEW SECTION
```

### What was found but deliberately left alone

Text runs concatenate across block-level siblings all over the page —
`01AGE18+ต่ำกว่า…` in the requirement rows, `01ARMA 3 MILSIM` in the About
chips, `01SEMI ROLEPLAYสมจริง…` in the principles, and so on. **None of these is
the accessible name of anything.** They are list items and captions whose
children are exposed to assistive technology individually. Fixing them would
mean editing every approved section for no measurable benefit, so they were
documented rather than touched. The mobile nav links were fixed precisely
because they *are* names, of interactive controls.

---

## 9. Link Audit

Every anchor and control in the rendered document, at 1440 with all content in
and again at 375 with the menu open.

**21 anchors, 1 button. Zero defects.**

| Check | Result |
|---|---|
| `href="#"` | **0** |
| Empty or missing `href` | **0** |
| `javascript:` pseudo-links | **0** |
| `localhost` / `127.0.0.1` | **0** |
| Placeholder / "available in a later phase" controls | **0** |
| Internal anchors that do not resolve to an existing `id` | **0 of 16** |
| External links without `rel="noopener noreferrer"` | **0** |
| External links without `target="_blank"` | **0** |

### Internal targets

| Target | Linked from | Resolves |
|---|---|---|
| `#main-content` | skip link | yes |
| `#hero` | brand mark | yes |
| `#about` | desktop nav, mobile nav, footer, hero secondary CTA | yes |
| `#operations` | desktop nav, mobile nav, footer | yes |
| `#elements` | desktop nav, mobile nav, footer | yes |
| `#recruitment` | desktop nav, mobile nav, footer | yes |
| `#how-we-operate` | footer | yes |

`#how-we-operate` exists and is reachable from the footer. `#join` exists on the
Final CTA and is still linked from nowhere — carried forward from Phase 4 as
intentional, not an oversight.

### Discord

**Five live Discord links. All five are `https://discord.gg/ptAbcyeDcf`.**

| Location | `target` | `rel` |
|---|---|---|
| Navbar `JOIN DISCORD` | `_blank` | `noopener noreferrer` |
| Mobile menu `JOIN DISCORD` | `_blank` | `noopener noreferrer` |
| Hero `JOIN THE UNIT` | `_blank` | `noopener noreferrer` |
| Final CTA `JOIN DISCORD` | `_blank` | `noopener noreferrer` |
| Footer `JOIN DISCORD` | `_blank` | `noopener noreferrer` |

The Final CTA also prints `discord.gg/ptAbcyeDcf` as visible text
(`aria-hidden`, since the adjacent button already carries the destination).

### Whole-tree search for stale invites

The complete tree was searched, excluding `node_modules/` and `dist/`:

```text
discord.gg/ptAbcyeDcf   5 occurrences in src/  (+ 3 in reports)
discord.gg/sNshPR2jnV   8 occurrences — all in TF696_LEGACY_CODEBASE_INSPECTION.md
```

The old invite `sNshPR2jnV` appears **only** inside the archival legacy
inspection document, where it is a record of what the legacy site contained.
Per the brief, historical report files were not rewritten to erase it. **Zero
occurrences in `src/`, `index.html`, `public/` or `dist/`.**

### Control

The single `<button>` is the menu trigger: `type="button"`,
`aria-controls="mobile-navigation"` resolving to a real element, and
`aria-expanded` tracking state (`false` closed, `true` open — verified in §14).

---

## 10. Content Consistency

Visible copy was reviewed for defects, not for style. **No copy was rewritten.**

### Naming, checked term by term

| Term | Usage found | Verdict |
|---|---|---|
| `TF696` | brand mark, footer mark, Thai body copy, `DISCOVER TF696` | consistent |
| `TASK FORCE 696` | H1, footer name, Final CTA identity, copyright | consistent |
| `Arma 3` / `ARMA 3` | `Arma 3` in Thai body; `ARMA 3` in display labels | consistent by register |
| `Milsim` / `MILSIM` | `Milsim` in Thai body; `MILSIM` in display labels | consistent by register |
| `Semi Roleplay` | `SEMI ROLEPLAY` in the About chip and the principle title; `Roleplay` capitalised in Thai body | consistent |
| `Discord` | `Discord` in Thai body; `DISCORD` in buttons | consistent |
| `LEGION` / `COHORT` / `FORTIS` | element names, H3s, and the Elements H2 | consistent; always uppercase |
| `Modpack`, `Apex`, `Operation`, `Lone Wolf` | title-case inside Thai sentences | consistent |

The uppercase/title-case split tracks the design system exactly — Chakra Petch
display elements are uppercase, IBM Plex Sans Thai body copy is not. That is a
rule, not a drift.

### Defects looked for

| Check | Result |
|---|---|
| Typos in Latin copy | none found |
| Accidental duplication | none found |
| Double spaces, missing spaces around `/` and `—` | none found |
| Broken or mojibake Thai characters | none; the served document is valid UTF-8 and every Thai string renders correctly at all seven widths |
| Punctuation defects | none; `—` is used with spaces consistently (`ไม่มีแบบฟอร์มสมัครบนเว็บไซต์ — จุดเริ่มต้นคือ Discord`, `FRI / SAT / SUN — 20:30 GMT+7`) |
| Inconsistent naming | none, per the table above |

**Nothing was changed in this section.** Scope note: this was a check for
structural and formatting defects — spacing, duplication, casing, encoding,
naming — and a review of the rendered Thai for anything obviously malformed. It
is not a substitute for a native Thai proofread of tone and phrasing.

### Subjective observations, documented rather than changed

1. **`Operation` singular vs `OPERATIONS` plural.** The TRAINING note reads
   `ต้องผ่านการฝึกก่อนเข้าร่วม Operation`, while the nav, the onboarding step
   and the schedule heading use the plural. Both readings are defensible in a
   Thai sentence and the locked facts use the plural. A wording preference, not
   an error — left alone.
2. **`TF696 / V2` in the hero footer strip.** This is an internal version marker
   rendered on a page about to go public. It is approved Phase 2B design and is
   `aria-hidden`, so it was not touched — but it is worth a decision before
   launch whether "V2" should be visible to visitors.
3. **Three different Thai summaries of the same idea** appear in the hero copy,
   the About copy and the meta description. They serve different surfaces and
   the meta wording is the brief's own. Not a defect.
4. **`SEMI ROLEPLAY` appears twice** — as an About detail chip and as a How We
   Operate principle. Reads as deliberate reinforcement, not duplication.

---

## 11. Recruitment Fact Check

Read out of the rendered page, not the source, and confirmed visually at 375 and
1440.

| # | Requirement | Status rendered | Thai note rendered | Matches locked fact |
|---:|---|---|---|---|
| 01 | AGE | `18+` | `ต่ำกว่า 18 ปี พิจารณาเป็นรายกรณี` | **yes** — 18+, under 18 case-by-case |
| 02 | MICROPHONE | `REQUIRED` | `จำเป็นสำหรับการสื่อสารภายในทีม` | **yes** |
| 03 | SKILL ASSESSMENT | `REQUIRED` | `ต้องผ่านการประเมินทักษะพื้นฐานก่อน` | **yes** — required; criteria left undefined |
| 04 | TRAINING | `REQUIRED` | `ต้องผ่านการฝึกก่อนเข้าร่วม Operation` | **yes** — before Operations |
| 05 | MODPACK | `REQUIRED` | `ใช้ Modpack ของ TF696` | **yes** |
| 06 | APEX DLC | `RECOMMENDED` | `มี Apex ได้ก็ดี แต่ไม่บังคับ` | **yes** — recommended, explicitly not required |
| 07 | ATTENDANCE | `FLEXIBLE` | `เข้าร่วมตามเวลาที่สะดวก` | **yes** |

**Operations schedule:** `FRIDAY` / `SATURDAY` / `SUNDAY`, `20:30` `GMT+7`.
Repeated in the footer as `FRI / SAT / SUN — 20:30 GMT+7`. Both correct and
consistent.

**Discord:** `https://discord.gg/ptAbcyeDcf` — the only invite on the page (§9).

**Onboarding:** `JOIN DISCORD` → `SKILL ASSESSMENT` → `TRAINING` →
`JOIN OPERATIONS`, with `ไม่มีแบบฟอร์มสมัครบนเว็บไซต์ — จุดเริ่มต้นคือ Discord`.
Consistent with the requirements and adds no new gate.

**Seven requirements before this phase, seven after. No requirement was added,
removed, reworded or re-toned.** The skill-assessment criteria remain
intentionally undefined, as Phase 4 recorded.

Colour is never the only cue: `REQUIRED`, `RECOMMENDED` and `FLEXIBLE` are
literal text, and the `01`–`07` markers are `aria-hidden` decoration over
content that is already an `<ol>`.

---

## 12. Image Accessibility

All 8 shipped images audited in the rendered page after Phase 5's responsive
rewrite.

| # | Image | `alt` | `aria-hidden` | intrinsic `width`×`height` | `loading` | `decoding` | `fetchpriority` |
|---:|---|---|---|---|---|---|---|
| 1 | Navbar logo | `""` | — | 3508 × 2480 | `eager` | `async` | `low` |
| 2 | Hero (LCP) | `""` | `true` | 3508 × 2400 | `eager` | `sync` | `high` |
| 3 | Operations 01 | `ทีมผู้เล่น TF696 ในภารกิจกลางคืนข้างลังอุปกรณ์ภายในเกม Arma 3` | — | 1920 × 1080 | `lazy` | `async` | — |
| 4 | Operations 02 | `ทีมผู้เล่น TF696 เตรียมพร้อมภายในอากาศยานระหว่างภารกิจในเกม Arma 3` | — | 1920 × 1080 | `lazy` | `async` | — |
| 5 | LEGION banner | `""` | — | 1200 × 300 | `lazy` | `async` | — |
| 6 | COHORT banner | `""` | — | 1200 × 300 | `lazy` | `async` | — |
| 7 | FORTIS banner | `""` | — | 1200 × 300 | `lazy` | `async` | — |
| 8 | Final CTA | `""` | `true` | 1920 × 1080 | `lazy` | `async` | — |

| Check | Result |
|---|---|
| Every `<img>` carries an `alt` attribute | **8 / 8** — none missing, which is the case that breaks screen readers |
| Meaningful Operations alt text retained | **yes**, both, in Thai, unchanged from Phase 4 |
| Decorative imagery still `alt=""` | **6 / 6** |
| `<picture>` wrapping broke alt semantics | **no** — the `alt` is on the `<img>`, where it belongs; the AX tree exposes both Operations images with their full Thai names and exposes none of the six decorative ones |
| Intrinsic dimensions present | **8 / 8** — every box is reserved before its bytes arrive, so no new CLS |
| `<picture>` computes to `display: contents` | **8 / 8** at every tested width — the wrapper generates no box and contributes nothing to the AX tree |
| Broken / unloaded images | **0** at 320, 375, 430, 768, 1024, 1440, 1920 |
| Lazy/eager still appropriate | **yes** — nothing above the fold is lazy, nothing below it is eager |

### Essential text inside images

The three element banners (`LEGION`, `COHORT`, `FORTIS`) contain unit wordmarks
in the artwork. They are correctly `alt=""` because **every one of those names
is also real text** in the adjacent `<h3>`, alongside a role line and a Thai
description. Nothing is conveyed only by the image.

The Final CTA image carries a small baked-in unit watermark, inherited from the
source asset (Phase 4 §16, Phase 5 §8). It conveys no information not already
present as text, and the image is `aria-hidden`.

**No Phase 5 performance work was undone.** The `sizes` strings, the format
ladders, the AVIF/WebP/fallback chain and the loading priorities are exactly as
Phase 5 left them, and §19 confirms the transfer numbers still hold.

---

## 13. Keyboard / Focus QA

Driven through the Chrome DevTools Protocol with real `Input.dispatchKeyEvent`
key events against the production build — not simulated `.focus()` calls.

### Desktop tab order, 1440 px

16 tab stops, in document order, **every one visible and every one showing the
global 3 px `#e76e04` focus ring**:

```text
 1  skip-link              ข้ามไปยังเนื้อหาหลัก
 2  brand                  TF696 — กลับไปยังส่วนแรก
 3  nav-link               ABOUT
 4  nav-link               OPERATIONS
 5  nav-link               ELEMENTS
 6  nav-link               RECRUITMENT
 7  header-cta             JOIN DISCORD
 8  button--primary        JOIN THE UNIT      (hero)
 9  button--secondary      DISCOVER TF696     (hero)
10  final-cta__button      JOIN DISCORD
11  footer nav             ABOUT
12  footer nav             OPERATIONS
13  footer nav             ELEMENTS
14  footer nav             HOW WE OPERATE
15  footer nav             RECRUITMENT
16  site-footer__discord   JOIN DISCORD
```

The four mobile-menu links and its CTA are correctly **absent** — they are
`display: none` at this width *and* carry `tabIndex="-1"`.

### Skip link

| Check | Before | After |
|---|---|---|
| Reachable as the first tab stop | yes | yes |
| Becomes visible on focus | yes — `translateY(0)`, at 16 px / 16 px, 43 px tall, fully in viewport | unchanged |
| Sets the hash | `#main-content` | `#main-content` |
| Moves focus | **no** — `document.activeElement` stayed `BODY` | **yes** — `MAIN#main-content` |
| Next Tab lands inside main | yes — `JOIN THE UNIT` | yes — `JOIN THE UNIT` |

**The skip link worked in Chrome before the change**, because Chrome sets the
*sequential focus navigation starting point* from the fragment even when the
target is not focusable. That is an engine feature, not a guarantee: Safari has
historically required the target to be focusable. `tabIndex="-1"` on `<main>`
makes the skip link move focus itself rather than depend on it. It adds no tab
stop (verified: still 16 stops) and no visible outline (the global rule is
`:focus-visible`, and programmatic focus does not match it).

### Hidden interactive elements

**Zero** elements that are `display: none`, `visibility: hidden`, or inside an
`aria-hidden="true"` subtree have a tab index ≥ 0 — checked at 320, 375 and 430
with the menu both closed and open. Specifically, with the menu closed all five
of its links report `tabIndex: -1`, and `aria-hidden="true"` is on the overlay.

### Focus ring

`:focus-visible { outline: 3px solid #e76e04; outline-offset: 4px }` was
confirmed computed on all 16 desktop stops and on every mobile menu stop. It is
visible against both the dark canvas and the light About/Principles bands
(orange on `#eee9e2` is a clearly distinguishable ring).

---

## 14. Mobile Menu Regression

Phase 4 fixed a real zero-height overlay bug. It was re-tested from scratch
after Phase 5's and Phase 6's changes — nothing was assumed from the CSS being
unchanged.

Tested at **320 × 812 @2x, 375 × 812 @2x and 430 × 812 @2x**, opening the menu
with a **keyboard Enter on the trigger**, and closing it three different ways.

| Check | 320 | 375 | 430 |
|---|---|---|---|
| Overlay height when open | **740 px** | **740 px** | **740 px** |
| Overlay `top` | 72 px | 72 px | 72 px |
| `visibility` / `opacity` / `pointer-events` | visible / 1 / auto | visible / 1 / auto | visible / 1 / auto |
| Hit test at the first link | `A.mobile-nav__link` | `A.mobile-nav__link` | `A.mobile-nav__link` |
| Link heights (all four ≥ 44 px) | 83, 90, 83, 90 | 90, 90, 90, 95 | 97, 97, 97, 97 |
| `aria-expanded` on open | `true` | `true` | `true` |
| `aria-hidden` on the overlay | `false` | `false` | `false` |
| Link `tabIndex` when open | `0,0,0,0,0` | `0,0,0,0,0` | `0,0,0,0,0` |
| Focus lands inside on open | `.mobile-nav__link` | `.mobile-nav__link` | `.mobile-nav__link` |
| **Scroll lock** (real wheel input) | **locked** | **locked** | **locked** |
| Focus trap forward wraps | link→link→link→CTA→**link** | same | same |
| Focus trap backward wraps | link→link→**CTA** | same | same |
| Escape closes | yes | yes | yes |
| Focus returns to trigger on Escape | `.menu-trigger` | `.menu-trigger` | `.menu-trigger` |
| `aria-expanded` after Escape | `false` | `false` | `false` |
| Link `tabIndex` after Escape | `-1,-1,-1,-1,-1` | same | same |
| **RECRUITMENT link is hit-testable** | **yes** | **yes** | **yes** |
| RECRUITMENT navigates | `#recruitment` | `#recruitment` | `#recruitment` |
| Menu closes after navigating | yes | yes | yes |
| **Body scrolling restored** | `overflow: ""` | `overflow: ""` | `overflow: ""` |
| Wheel scrolling works again after close | yes, 0 → 500 | yes | yes |
| Section lands below the fixed header | top 607 | top 588 | top 542 |

### On the scroll-lock measurement

The first attempt used `window.scrollTo()` and reported the lock as broken. That
measurement was wrong, not the lock: `overflow: hidden` prevents *user*
scrolling but is specified to leave *programmatic* scrolling working. Retested
with real `Input.dispatchMouseEvent` wheel events through the browser's actual
input pipeline: with the menu closed a wheel moves the page 0 → 500; with the
menu open, two consecutive wheels move it **0 → 0**; after closing, a wheel
moves it 0 → 500 again. The lock is genuine at all three widths.

### Visual confirmation

Screenshots at 320 and 375 @2x with the menu open show the overlay painting
fully, all four destinations legible, the orange `JOIN DISCORD` CTA, the
`ARMA 3 MILSIM / THAILAND` note pinned to the bottom, and the focus ring sitting
on `ABOUT` — visible proof that focus entered the menu.

`RECRUITMENT` / `VIEW SECTION` still wraps to two lines at 320 and 375, exactly
as Phase 4 recorded. It is tidy, right-aligned, causes no overflow, and was left
alone.

---

## 15. Contrast

**69 text/background combinations** measured in the rendered page using real
computed colours, with alpha composited down the full ancestor chain to an
opaque base, and WCAG 2.x AA thresholds applied by measured font size and weight
(3:1 for large text, 4.5:1 otherwise).

### One failure, found and fixed

| Element | Foreground | Background | Size | Before | After | Need |
|---|---|---|---:|---:|---:|---:|
| `.requirement-row__index` (`01`–`07`) | `rgba(245,245,245,0.40)` | `#050505` | 10.56 px | **3.50** | **5.29** | 4.5 |

The fix is `0.40` → `0.52` alpha. That is not an invented value: it is exactly
what `.element-panel__number` already uses for the same kind of index marker at
the same size, so the correction aligns the outlier with the site's own
treatment rather than introducing a new one. Every other index marker on the
page already cleared the threshold — `.onboarding__number` at 6.43,
`.about-details__number` and `.principles-list__number` at 6.25,
`.element-panel__number` at 5.28 — which is what identified this one as a slip
rather than a deliberate choice.

**No other palette change was made. The palette was not redesigned.**

### Result after the fix

```text
contrast probes: 69    failures: 0
```

Lowest-margin passes, for the record:

| Element | Ratio | Need |
|---|---:|---:|
| Footer bottom line | 4.95 | 4.5 |
| Section labels on the light band | 5.09 | 4.5 |
| Element panel number | 5.28 | 4.5 |
| Requirement index (fixed) | 5.29 | 4.5 |
| Hero footer strip | 5.83 | 4.5 |
| Final CTA handle | 5.83 | 4.5 |
| Schedule time `20:30` (orange, 88 px) | 6.14 | 3 |
| Hero `696` (orange, 176 px) | 6.43 | 3 |

Coverage across the priorities the brief named: hero copy and both CTAs
(6.43–18.69), navbar (11.23–18.69), About body (15.57), operation captions
(6.43–18.69), element panel text (6.51–18.92), How We Operate (6.25–15.69),
recruitment status text (6.43 required / 7.23 optional), final CTA (5.83–18.92),
footer (4.95–18.69), skip link (6.43), and the mobile menu (8.08–18.69).

### Honest caveat

The Hero and Final CTA overlay text sits on gradient scrims over photography,
not on a flat fill. The ratios above are computed against the composited CSS
background stack, which is what the scrims are for — Phase 4 measured roughly
1–2% image transmittance in those regions. The numbers are sound, but they are a
model of a gradient, not a per-pixel sample of the decoded photograph behind it.
A human eye on a real display remains worth having on those two bands.

---

## 16. Reduced Motion

Verified with Chrome's `prefers-reduced-motion: reduce` emulation against the
production build.

| Check | Result |
|---|---|
| Media query matches | `true` |
| `html { scroll-behavior }` | **`auto`** under reduce; `smooth` without it |
| `.site-header` transition | `1e-05s` |
| `.site-header::before` (blur/background) | `1e-05s` |
| `.mobile-menu` (opacity, visibility) | `1e-05s` |
| `.skip-link` (transform) | `1e-05s` |
| CTA arrow `span` (transform) | `1e-05s` |
| `.nav-link` (color) | `1e-05s` |
| `.hero__image` | `1e-05s` |

### Essential function does not depend on motion

Behaviour, not just computed styles:

| Behaviour under reduce | Result |
|---|---|
| Mobile menu opens | **visible, opacity 1, 740 px tall at 60 ms** — i.e. before the normal 220 ms fade would have finished |
| Mobile menu link navigates | `#about` reached |
| Mobile menu closes after navigating | `visibility: hidden`, `opacity: 0` |
| Body scroll restored | `overflow: ""` |
| Footer anchor navigation | jumps 732 → 3047 px instantly and lands on `#elements` |
| Hero entrance | the hero has no entrance animation to disable — it is a static composition, so there is nothing that can fail to appear |

Navigation, the mobile menu, both CTAs and every anchor work identically with
motion disabled. **The `prefers-reduced-motion` block itself was not modified in
this phase.**

---

## 17. Crawl / Index Readiness

### Directives

| Check | Result |
|---|---|
| Accidental `noindex` | **none** — `robots` is `index, follow, max-image-preview:large` |
| `nofollow` on internal links | none |
| `X-Robots-Tag` | not applicable — static hosting, no server config in this repo |
| `public/robots.txt` | present, HTTP 200, `User-agent: * / Allow: /`, no `Disallow` |
| Content hidden by CSS | **0** elements in `<main>` with >30 characters of text that are `display: none` or `visibility: hidden` |
| `aria-hidden` subtrees | 51, all decorative (arrows, rules, index numbers, background images) — none conceals unique content |

### What a crawler that renders JavaScript sees

The rendered page yields **2,713 characters** of text, beginning:

```text
ข้ามไปยังเนื้อหาหลัก TF696 ABOUT OPERATIONS ELEMENTS RECRUITMENT JOIN DISCORD ↗
ARMA 3 MILSIM / THAILAND TASK FORCE 696 คอมมูนิตี้ Arma 3 Mi…
```

Contains `TASK FORCE 696` ✓, `Arma 3` ✓, `Milsim` ✓, Thai script ✓, and the
Discord invite ✓. All 19 headings, all 7 requirements, the schedule and the
onboarding flow are real text, not images.

### What a crawler that does *not* render JavaScript sees — stated plainly

This is a **client-rendered React SPA with no SSR and no prerendering**. The
served HTML is 2,683 bytes and contains:

```text
#root children:  0
body text:       0 characters
title:           Task Force 696 — Arma 3 Milsim Thailand
description:     present
og:title         present
robots:          present
<noscript>:      none
```

**A non-rendering crawler receives the head and an empty body.** That is a real
limitation and it is not fixed by anything in this phase.

What it means in practice:

- **Googlebot renders JavaScript** and will index the full content, at the cost
  of a second-pass render queue.
- **Most social unfurlers do not.** Discord, Slack, LINE, Facebook and X read
  the static head only — which is exactly why §6's Open Graph tags matter, and
  why they are the highest-value metadata on this page given the primary
  conversion is a Discord invite people will paste into chat.
- Some smaller crawlers and text-only tools will see nothing.

**No migration to SSR, static prerendering or another framework was performed**,
as instructed. If non-rendering crawlers ever become important, the smallest
honest option is build-time prerendering of this single page — not a framework
change. A `<noscript>` block would be a partial mitigation but was not added,
because it would duplicate the entire page's copy in a second place that can
drift out of sync, which is a worse problem than the one it solves.

### Resources

No broken or zero-byte responses at any tested viewport. Every request in the
production build resolved: `index.html`, one CSS bundle, one JS bundle, the
selected image derivatives, `favicon.ico` and `robots.txt`. The two Google Fonts
requests are external and were not counted as site resources.

---

## 18. Routing / Deployment Considerations

There is no React Router and none was added. The site is a single document with
in-page fragment navigation, which remains the right shape for it.

### What happens at each path, measured

| Request | Result |
|---|---|
| `/` | serves `index.html`, HTTP 200 |
| `/index.html` | HTTP 200, `text/html` |
| `/anything-else` | **404 from the host** — there is no client router to catch it, and none should be added |
| `/robots.txt` | HTTP 200 |
| `/favicon.ico`, `/apple-touch-icon.png` | HTTP 200 |

### `/TF696/` and `/TF696/index.html`

**This depends entirely on the unresolved deployment base, and was not guessed.**
The two cases:

- **Deployed at an origin root** (user/org GitHub Pages site, or a custom
  domain): `/TF696/` does not exist and returns the host's 404. The site is at
  `/`.
- **Deployed as a project page under a repository named `TF696`**: the site is
  at `/TF696/` and `/TF696/index.html`, and **both work** — because
  `base: './'` makes every asset URL relative to the document. Verified in the
  built output: the JS, CSS, favicon, apple-touch-icon and the hero preload all
  emit as `./assets/…`, `./favicon.ico`, `./apple-touch-icon.png`. Vite rewrote
  the `/favicon.ico` I authored into `./favicon.ico` for exactly this reason.

**One consequence worth flagging now, because it is easy to miss:**
`public/robots.txt` lands at `/TF696/robots.txt` under a project page.
**Crawlers only read `robots.txt` from the origin root**, so at a subpath the
file is inert — the effective policy would be whatever `github.io/robots.txt`
says. This is not a defect in the file; it is a reason the base decision has
consequences beyond asset paths. At an origin root or a custom domain it works
as written.

### Deferred to Phase 7, deliberately

- The final `base` value in `vite.config.js`.
- The canonical URL, `og:url`, `og:image` and the sitemap (§5, §6).
- Any GitHub Actions workflow — none was created.
- If a project-page deploy is chosen and a 404 page is wanted, GitHub Pages
  serves `404.html` from the publish root. Nothing was added for it here.

---

## 19. Performance Regression

Measured in headless Chrome against the production build with the cache
disabled, reading `Network.loadingFinished.encodedDataLength` — the same method
Phase 5 used, so the numbers are directly comparable.

### Transfer, Phase 5 → Phase 6

| Viewport | Above fold P5 | P6 | Δ | Whole page P5 | P6 | Δ |
|---|---:|---:|---:|---:|---:|---:|
| 375 × 812 @2x | 227,336 | 234,185 | **+6,849** | 387,214 | 394,175 | **+6,961** |
| 1440 × 900 @1x | 333,479 | 333,515 | **+36** | 571,019 | 571,164 | **+145** |
| 1920 × 1080 @1x | 463,679 | 463,715 | **+36** | 726,701 | 726,846 | **+145** |

The +36 / +145 at desktop widths is response-header noise between two different
local servers, not a content change — the same derivatives are selected and the
same bytes are fetched.

**The +6,849 at 375 @2x is the favicon and nothing else.** It is a single
6,812-byte request (§4), it did not exist before because the page declared no
icon, it is fetched once and cached aggressively, and the desktop runs show it
is not always requested at all. This is the Task 2 deliverable arriving, not a
regression — and it is 8,471 bytes smaller than it would have been had the icon
shipped as uncompressed BMP.

### Hero: no duplicate fetch

| Viewport | Selected | Hero requests |
|---|---|---:|
| 375 × 812 @2x | `hero-1280.avif` | **1** |
| 1440 × 900 @1x | `hero-1600.avif` | **1** |
| 1920 × 1080 @1x | `hero-1920.avif` | **1** |

Phase 5's injected LCP preload and the rendered `<picture>` still resolve to the
same file at every viewport. The preload survived the `index.html` rewrite —
`transformIndexHtml` still finds the hero AVIF derivatives in the bundle and
still imports `HERO_SIZES` from the shared module.

### Responsive selection still correct

Every derivative selected matches Phase 5's recorded sweep exactly, including
the case that looks wrong and is not: at 1920 the Aviation story resolves to
`aviation-960` while Direct Action resolves to `direct-action-1280`, because
`--offset` is the narrower story (72% vs 88% of the container).

```text
375@2x   logo-128  hero-1280  da-960   av-960   900w ×3   cta-1280
1440@1x  logo-64   hero-1600  da-1280  av-1280  1200w ×3  cta-1600
1920@1x  logo-64   hero-1920  da-1280  av-960   1200w ×3  cta-1920
```

### No new large asset entered the bundle

| | Phase 5 | Phase 6 | Δ |
|---|---:|---:|---:|
| Image files in `dist/` | 96 | 98 | +2 (favicon.ico, apple-touch-icon.png) |
| Image bytes | 8,128,886 | 8,151,210 | +22,324 |
| JS | 222,910 | 222,933 | +23 |
| CSS | 41,740 | 41,772 | +32 |
| `index.html` | 1,369 | 3,011 | +1,642 |
| `robots.txt` | — | 292 | +292 |
| **Whole `dist/`** | **8,394,910** | **8,419,218** | **+24,308** |

The five largest emitted images are unchanged hero tiers. The `index.html`
growth is the metadata block plus its explanatory comments, which are kept
deliberately so the deferred Phase 7 decisions are documented at the point of
use; gzipped that is a few hundred bytes.

**No optimisation project was run and no Phase 5 setting was touched.**
`npm run optimize:images` still reports `96 derivatives — 0 written, 96 reused`.

---

## 20. Browser QA

Local Chrome 152 in `--headless=new`, driven over the DevTools Protocol by Node
scripts using Node 24's built-in `WebSocket`. **No dependency was installed for
any of this.** The production build was served over HTTP on `127.0.0.1`; each
viewport used `Emulation.setDeviceMetricsOverride` and waited on
`document.fonts.ready`.

### Structural sweep, all seven widths

| Width | Horizontal overflow | Elements past the container | Broken images | H1/H2/H3 | Banner ratio | Doc height |
|---:|---|---:|---:|---|---|---:|
| 320 | **none** | 0 | 0 | 1 / 6 / 12 | 4.0000 | 9,532 |
| 375 | **none** | 0 | 0 | 1 / 6 / 12 | 4.0000 | 9,378 |
| 430 | **none** | 0 | 0 | 1 / 6 / 12 | 4.0000 | 9,227 |
| 768 | **none** | 0 | 0 | 1 / 6 / 12 | 4.0000 | 9,083 |
| 1024 | **none** | 0 | 0 | 1 / 6 / 12 | 4.0001 | 8,869 |
| 1440 | **none** | 0 | 0 | 1 / 6 / 12 | 4.0002 | 10,570 |
| 1920 | **none** | 0 | 0 | 1 / 6 / 12 | 4.0001 | 11,156 |

`body.scrollWidth === window.innerWidth` at every width. The Phase 3C 4:1
zero-crop behaviour on the element banners is intact.

### Visual review

Screenshots captured at all seven widths at three scroll positions each (top,
recruitment, footer), plus the open mobile menu at 320, 375 and 430 @2x, plus
targeted captures of the requirements list at 375 and 1440.

| Check | Result |
|---|---|
| Hero composition, crop, gradients, grain | intact at every width |
| Navbar logo sharp | yes — the full rune emblem renders cleanly at 375 @2x |
| Operations captions, markers, imagery | intact |
| Element banners uncropped | yes |
| How We Operate light band | intact |
| Requirements list legible, all 7 rows correct | yes — and the `01`–`07` markers are now clearly readable (§15) |
| Schedule and onboarding | intact |
| Final CTA scrim, watermark, chromatic split | intact |
| Footer complete, Discord handle visible | yes |
| Mobile menu overlay paints fully | yes at 320, 375, 430 |
| Focus ring visible in the open menu | yes — sits on `ABOUT` |

### Honest caveats

- **Chrome only.** No Safari, no Firefox, no physical handset. This is unchanged
  from Phase 5 and it is the single biggest gap in the evidence. The
  Safari-specific hardening in §13 was made *because* it could not be tested,
  not because a failure was observed.
- The AVIF-less fallback ladders still have not been exercised by a real browser
  that lacks AVIF; only their markup and file existence are verified.
- `100svh` / `86svh` behaviour with real mobile browser chrome remains
  untested on hardware.
- Screenshots are working files in the session scratchpad and are not committed.

---

## 21. Build / Lint Verification

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
dist/index.html                       3.01 kB
dist/robots.txt                       0.29 kB
dist/favicon.ico                      6.61 kB
dist/apple-touch-icon.png            15.71 kB
… 96 image assets …
dist/assets/hero-2400-l2WFLcVS.avif 689.94 kB
dist/assets/index-DIJpdWgH.css       41.77 kB │ gzip:  8.72 kB
dist/assets/index-D--JQU5R.js       222.93 kB │ gzip: 67.65 kB
✓ built in 1.92s
Exit code: 0
```

```text
$ npm run optimize:images
96 derivatives — 0 written, 96 reused — 8128886 B on disk
Every file in img/ was opened read-only.
Exit code: 0
```

It remained a no-op, as required — no master and no setting in
`scripts/optimize-images.mjs` was changed.

```text
$ npm run favicon:generate
favicon.ico          6615 B  (16/32/48)
apple-touch-icon.png 180x180
master untouched     sha256 1398014cdb23c435d661f494c8db0f9c
Exit code: 0
```

Deterministic: a second run produced byte-identical output (`favicon.ico`
`md5 5aca3f2bd342d6497f61be055f3f9b25`, `apple-touch-icon.png`
`md5 40639733a320ce9cf34ee9bd04284f18` before and after).

### Lint scope, noted honestly

`eslint.config.js` matches `**/*.{js,jsx}`, so `.mjs` files under `scripts/` are
not linted — `generate-favicon.mjs` inherits the same gap
`optimize-images.mjs` already had. This is pre-existing and consistent, and
widening the lint config was outside this phase.

### Archival asset integrity

Every `img/` and `audio/` file was SHA-256 compared against
`D:\TF696-main\TF696_LEGACY_BACKUP.zip` **after** all Phase 6 work:

```text
POST-PHASE-6 archival asset check — matched: 28  mismatched: 0
not in archive: img/696_Circle.png, img/main6962.jpg
```

The two exceptions are the Phase 2B masters that postdate the archive. Both were
hash-checked against the values Phase 5 recorded:

| File | Bytes | SHA-256 (first 32) | Result |
|---|---:|---|---|
| `img/main6962.jpg` | 3,472,645 | `73a611a2c220d55ed574d2d916049c94` | **MATCH** |
| `img/696_Circle.png` | 1,073,111 | `1398014cdb23c435d661f494c8db0f9c` | **MATCH** |

`img/favicon.ico` is byte-identical to the archive, still 15,406 bytes, with its
original modification time. **Nothing in `img/` or `audio/` was read as anything
other than read-only.**

---

## 22. Files Changed

### CREATED

- `public/favicon.ico` — 16/32/48 PNG-in-ICO, derived from `img/696_Circle.png`
- `public/apple-touch-icon.png` — 180 × 180, derived from the same master
- `public/robots.txt` — permissive, no sitemap directive (deferred)
- `scripts/generate-favicon.mjs` — the icon generator; opens the master
  read-only and aborts if it changed
- `TF696_PHASE_6_SEO_ACCESSIBILITY_QA_REPORT.md`

### MODIFIED

- `index.html` — title kept; description replaced with the fuller Thai-first
  wording; added `robots`, `theme-color`, `color-scheme`, the two icon links and
  five Open Graph tags; head reordered so `<title>`/`description` precede the
  font links. No tag was removed.
- `src/App.jsx` — `tabIndex="-1"` on `<main>` (§13)
- `src/components/layout/SiteHeader.jsx` — two `{' '}` per mobile nav link (§8)
- `src/index.css` — one value: `.requirement-row__index` alpha `0.4` → `0.52` (§15)
- `package.json` — added the `favicon:generate` script
- `README.md` — documented the `public/` directory, the icon workflow, and why
  the legacy favicon is not used
- `dist/` — regenerated, still ignored

### REMOVED

- None.

### UNCHANGED

- `img/`, `audio/` — verified byte-identical (§21), including `img/favicon.ico`
- `vite.config.js` — **`base: './'` untouched**; the hero preload plugin untouched
- `package-lock.json` — no dependency added or changed
- `eslint.config.js`, `.gitignore`, `scripts/optimize-images.mjs`
- `src/assets/optimized/` — all 96 derivatives, `manifest.json`, and
  `images.js` / `hero-sizes.js`
- `src/main.jsx`, `SiteContainer.jsx`, `SiteFooter.jsx`, `ResponsiveImage.jsx`,
  `SectionLabel.jsx`, and all seven section components except the two lines
  noted above
- All marketing copy, all recruitment facts, all Discord URLs, all `sizes`
  strings, all loading priorities, all section layout CSS, the
  `prefers-reduced-motion` block

**No dependency was added. `package.json` still declares exactly `react` and
`react-dom` at runtime.**

---

## 23. Remaining Issues / Deployment Blockers

### Blockers — Phase 7 cannot proceed without these

1. **The production origin is not confirmed.** Everything in §5 hangs off it:
   the canonical link, `og:url`, `og:image`, and the sitemap. A wrong value is
   worse than none.
2. **The Vite `base` decision depends on the same answer.** `base: './'` is
   portable and works at either a root or a subpath, but it is a placeholder,
   not a decision — and under a project subpath `robots.txt` becomes inert
   (§18).

### Not blockers, but they should be decided before launch

3. **`og:image` is absent**, so link unfurls render as text-only cards. Given
   the primary conversion is a Discord invite people paste into chat, this is
   the highest-value single item remaining. §6 names the candidate asset and the
   exact tags.
4. **The 16 × 16 favicon is not legible** (§4). Inherent to a dense circular
   emblem at that size, and still far better than the legacy file. A readable
   small icon needs a purpose-drawn simplified mark — a design decision.
5. **A fragment deep link does not scroll on a cold load.** Opening
   `…/#recruitment` directly leaves the page at the top (measured:
   `scrollY 0`, section at 7,171 px). The fragment target does not exist when
   the browser first looks for it, because React has not rendered yet. In-page
   navigation is unaffected, and this was **not fixed** — Task 16 asked to
   verify and document routing, and adding a scroll-on-mount effect is new
   behaviour, not QA. The remedy, if wanted, is a single `useEffect` in `App`
   that re-applies `location.hash` after mount.
6. **Non-rendering crawlers see an empty body** (§17). Inherent to a
   client-rendered SPA; the Open Graph tags are the mitigation that matters.
7. **Chrome is still the only engine tested.** Unchanged from Phase 5 and the
   biggest gap in the evidence for this phase too. Safari, Firefox and a real
   handset remain worth an hour.
8. **`TF696 / V2` is visible in the hero footer strip** (§10). An internal
   version marker on a public page — confirm it is wanted.
9. **`#hero-intro` still carries `tabIndex="-1"`**, left from Phase 2B when the
   secondary CTA targeted it. The CTA now targets `#about`. The attribute is
   inert — it adds no tab stop — so it was documented rather than removed from
   approved Hero markup.
10. **A web app manifest was not added** (§2). It cannot be written correctly
    before the base is settled and adds nothing today.
11. **Google Fonts is still an external dependency** — a render-blocking
    stylesheet from a third-party origin. Open since Phase 2A §15. Self-hosting
    would remove two preconnects and a third-party request, but it is a
    performance/privacy decision, not an SEO one.
12. **Carried forward, unaffected by this phase:** the skill-assessment wording
    placeholder, the hero eyebrow rule, whether the navbar should carry
    `HOW WE OPERATE`, the unlinked `#join` id, the `RECRUITMENT` / `VIEW SECTION`
    caption wrap, and the two mislabelled PNGs in `img/` (Phase 5 §20).

---

## 24. Recommended Next Step

**Confirm the production URL.** That single answer unblocks everything that is
deliberately missing: the canonical link, `og:url`, `og:image`, the sitemap, the
`base` value, and whether `robots.txt` will be read at all. Nothing else in
Phase 7 can be done correctly first.

Concretely, the decision is one of:

- a user/organisation GitHub Pages site → served at `/`, `base: '/'` (or `'./'`)
- a project page under repository `TF696` → served at `/TF696/`, keep
  `base: './'` and accept that `robots.txt` sits at a subpath
- a custom domain → served at `/`, add a `CNAME`

Once that is settled, Phase 7 should: wire the canonical and `og:url`; generate
the 1200 × 630 `og:image` from the untouched hero master and wire it; add the
sitemap and its `robots.txt` directive; add the JSON-LD from §7 if it is wanted;
set `base` deliberately; and add the deployment workflow.

Before or alongside that, the two things this phase could not do itself are
worth an hour of human time: **a real-device and Safari pass** over the whole
page — with attention to the mobile menu, the hero and Final CTA heights under
mobile browser chrome, and the skip link — and **a native Thai read** of the
visible copy for tone, which §10 explicitly does not claim to have covered.

Phase 6 stopped here. Nothing was deployed and no workflow was created.
