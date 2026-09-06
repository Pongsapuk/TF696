# TF696 Phase 7A — Production Wiring & Deployment Preparation

## 1. Executive Summary

The production origin was confirmed at the start of this phase, which unblocked
everything Phase 6 had deliberately deferred. The site is now wired for a
GitHub Pages **project** page at `https://tf696.github.io/TF696/`.

What changed:

- `vite.config.js` `base` is now `'/TF696/'`, stated as a decision rather than
  the portable `'./'` placeholder. The hero LCP preload emits the same base.
- `<link rel="canonical">`, `og:url`, `og:image`, `og:image:width/height/alt`
  and a minimal `WebSite` JSON-LD block are in `index.html`, all absolute.
- `public/og-image.jpg` — a 1200 × 630 crop of the approved hero master,
  produced by a new deterministic generator, verified by eye.
- `public/sitemap.xml` — one URL, no invented `lastmod`.
- `public/robots.txt` rewritten to state plainly that it is inert at a project
  subpath rather than implying it controls crawling.
- Cold fragment deep links (`…/TF696/#recruitment`) now land correctly. This was
  Phase 6 §23.5, and fixing it properly needed two applications of the scroll,
  not one — see §10, which documents a defect found in my own first attempt.
- The public `TF696 / V2` marker is gone from the hero footer strip; the
  obsolete `tabIndex="-1"` is gone from `#hero-intro`.
- `.github/workflows/deploy.yml` exists and has **not** been run or pushed.
- One thing not on the task list: measuring the build revealed that Tailwind was
  scanning the phase report Markdown files and emitting a utility class for any
  word in them that looked like one — so writing documentation changed the
  production stylesheet. Sources are now declared explicitly. **−6,487 B of CSS**
  with pixel-identical rendering (§17).

What was verified, not asserted: the production build was served at a real
`/TF696/` subpath and driven in Chrome 152 over the DevTools Protocol at 375,
768, 1440 and 1920. Every asset returns 200, nothing is requested from the
origin root, the hero is still fetched exactly once, every responsive
derivative selected matches Phase 6's recorded sweep byte for byte, and there is
no horizontal overflow at any width.

**Nothing was deployed. Nothing was pushed. No commit was created.** This
repository still has no Git remote and no `.git` directory.

**One thing a human should look at before Phase 7B:** the OG card at §6. I
inspected it and I think it is right, but a social preview is the single most
public artefact here and a second pair of eyes costs a minute.

---

## 2. Locked Production Origin

| | |
|---|---|
| Repository | `TF696/TF696` |
| Default branch | `main` |
| Served at | `https://tf696.github.io/TF696/` |
| Canonical | `https://tf696.github.io/TF696/` |
| Custom domain | none — no `CNAME` was created |

`https://tf696.github.io/TF696/index.html` serves the same document but is not
the canonical form and is not referenced anywhere.

Every absolute URL in the tree now derives from that one origin. A whole-tree
scan of the built output, the sitemap and robots.txt for `localhost`,
`127.0.0.1`, `example.com` and `/index.html` canonicals returns nothing.

---

## 3. Vite Base

```js
/** GitHub Pages project-page subpath for `TF696/TF696`. See `base` below. */
const BASE = '/TF696/'
…
base: BASE,
```

`'/'` would be wrong: it resolves every asset against the origin root, which
belongs to the `tf696.github.io` **user** site, not this repository. `'./'`
would still work at this path, but it is a portability hedge, and the phase
brief asked for a decision.

The hero preload plugin now emits `${BASE}…` rather than `./…` for its `href`
and `imagesrcset`, so the preload URL and the `<picture>` `srcset` are
character-identical strings and cannot diverge if the document is ever served
from a deeper path.

### What the built `index.html` emits

```html
<link rel="icon" href="/TF696/favicon.ico" …>
<link rel="apple-touch-icon" href="/TF696/apple-touch-icon.png">
<script type="module" crossorigin src="/TF696/assets/index-HlOz3zX1.js"></script>
<link rel="stylesheet" crossorigin href="/TF696/assets/index-NIdhwzqM.css">
<link rel="preload" as="image" type="image/avif"
      href="/TF696/assets/hero-2400-l2WFLcVS.avif"
      imagesrcset="/TF696/assets/hero-640-… 640w, … 2400w" …>
```

The `/favicon.ico` and `/apple-touch-icon.png` hrefs authored in the source are
rewritten by Vite to match `base`, as they were under `'./'`. The JS bundle
carries 96 absolute `"/TF696/assets/…"` asset strings.

**A measured side effect worth recording:** the bundle got *smaller*. Under
`base: './'` Vite has to resolve each asset URL at runtime against
`import.meta.url`; under a fixed base they are plain string literals. Built from
identical source, the JS is 223,458 B at `'./'` and 221,634 B at `'/TF696/'` —
**−1,824 B**.

---

## 4. Canonical URL

```html
<link rel="canonical" href="https://tf696.github.io/TF696/" />
```

Exactly one canonical element exists in the served document (counted in the
browser: `document.querySelectorAll('link[rel=canonical]').length === 1`). It
points at the directory form, not `index.html` — pointing at the file form would
split the two URLs GitHub Pages serves for the same document.

---

## 5. Open Graph

Everything Phase 6 approved is preserved unchanged; three tags plus an alt were
added.

```html
<meta property="og:type"        content="website" />                <!-- kept -->
<meta property="og:site_name"   content="Task Force 696" />         <!-- kept -->
<meta property="og:title"       content="Task Force 696 — Arma 3 Milsim Thailand" />
<meta property="og:description" content="TF696 คือคอมมูนิตี้ Arma 3 Milsim …" />
<meta property="og:locale"      content="th_TH" />                  <!-- kept -->
<meta property="og:url"         content="https://tf696.github.io/TF696/" />
<meta property="og:image"       content="https://tf696.github.io/TF696/og-image.jpg" />
<meta property="og:image:width"  content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt"
      content="ทีม TF696 ในเกม Arma 3 — ภาพหมู่ตัวละครในภารกิจ Milsim (TF696 squad photo captured in Arma 3)" />
```

The alt is bilingual on purpose. It names **Arma 3** and **Milsim** and calls the
subject ตัวละคร (characters), so neither a Thai nor an English reader can take
the card for a photograph of real military activity. The parenthetical says
"captured in Arma 3" for the same reason.

Still deliberately absent, unchanged from Phase 6 §6: every `twitter:*` tag,
`article:*`, `og:video`, `fb:app_id`. X falls back to Open Graph, and there is
no confirmed account to name.

---

## 6. OG Image

### Source and method

| | |
|---|---|
| Master | `img/main6962.jpg`, 3508 × 2400, sha256 `73a611a2c220d55e…` |
| Generator | `scripts/generate-og-image.mjs` (`npm run og:generate`) |
| Output | `public/og-image.jpg`, **1200 × 630**, 259,428 B |
| Output sha256 | `71e26f1f295d2fe015a18e1c62620d67477a5079da336b5b717d217fed036bfc` |
| Encoding | JPEG q84, mozjpeg, progressive, 4:4:4 |

The master is opened read-only. Its sha256 is taken before and after the run and
the script aborts if it moved. Confirmed independently: every master in `img/`
still carries its pre-session modification time.

### The crop, and why it is where it is

The master is a print-styled plate — the photograph sits inside a paper-white
frame. Measured off the raw pixels (luminance 255 to the edge), that frame is
57 px left, 63 px top, 58 px right, 76 px bottom, leaving a **3394 × 2261**
photographic content box. The crop stays strictly inside it: a card carrying the
frame on some edges and cutting it on others reads as a mistake.

1200 × 630 is 40:21, far wider than that box, so the crop is width-complete and
loses height. The width is trimmed 3394 → **3360**, the nearest multiple of 40,
so 40:21 lands on whole pixels (**3360 × 1764**) and the downscale is a pure
resample — no aspect correction, no stretch. The 34 px difference is split
evenly, and the crop is anchored to the bottom of the photo, because the
kneeling figures' boots reach the plate's lower edge and centring would trade
their feet for empty sky.

Final crop: **3360 × 1764 + 74 + 560**.

### Visual review — actually performed

The 1200 × 630 output was opened and inspected at full size, not merely
generated.

- **Composition** — the full squad reads as one group across the frame; the
  standing figures anchor left, centre and right, the kneeling row runs along
  the bottom edge.
- **Team visibility** — all twelve figures are present and none is cut in half.
  The rightmost standing figure, the one with the most silhouette, is whole.
- **Crop severity** — not extreme. The tallest helmet clears the top edge by
  ~160 master px (~57 px on the card). The bottom edge is the plate's own lower
  edge, so nothing is clipped that the master did not already clip.
- **Distortion** — none; the crop and the target share an exact 40:21 ratio.
- **Dimensions** — 1200 × 630 confirmed from the encoded file and again from
  `dist/og-image.jpg` after the build copied it.
- **File size** — 259,428 B. Comfortable for every unfurler in scope (Discord,
  Facebook, LINE, Slack, X all cap far higher) and fetched only by crawlers,
  never by a visitor loading the page.

The NOMAD watermark and the `23/10/2022` date in the lower right are part of the
approved master and were not removed — that would be redrawing artwork this
phase has no mandate to touch. No text was generated onto the image.

### Determinism

`npm run og:generate` was run twice and the output sha256 is identical both
times.

---

## 7. Sitemap

`public/sitemap.xml`, published at `https://tf696.github.io/TF696/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tf696.github.io/TF696/</loc>
  </url>
</urlset>
```

One URL, because there is one document. Fragments are not separate resources and
are not listed. **No `lastmod`** — an accurate value would have to come from the
real publish time, and a fabricated date is worse than none, since Google
ignores `lastmod` it does not trust. No `changefreq` or `priority`; both are
ignored by every major engine.

Validated by parsing the served file with the browser's `DOMParser`: no parse
error, root element `urlset`, namespace
`http://www.sitemaps.org/schemas/sitemap/0.9`, one `<loc>`.

---

## 8. Robots.txt Limitation

**This is the part of the deployment that does not work the way it looks like it
works, and it is stated here rather than glossed over.**

`public/robots.txt` publishes at:

```
https://tf696.github.io/TF696/robots.txt
```

Crawlers fetch robots.txt only from the **origin root**:

```
https://tf696.github.io/robots.txt
```

That path is served by the `tf696.github.io` **user** site, which is a different
repository. `TF696/TF696` does not control it.

Therefore, honestly:

- The `User-agent: * / Allow: /` rules in this file **do not govern crawling of
  this site.** The effective policy is whatever the origin root returns.
- The `Sitemap:` directive in it **will not be discovered.** It is a valid
  absolute URL and the sitemap really is served at it, but no crawler reads this
  file, so nothing follows the directive. Sitemap submission has to happen out of
  band — Search Console, or a `<loc>` list submitted directly.

The file was **kept**, not deleted: it is harmless, it is correct on its own
terms, and it would take effect unchanged if the site ever moved to an origin
root or a custom domain. Its comment block now says all of the above in place of
the Phase 6 note that deferred the question.

No second repository was created, and no attempt was made to control the origin
root. Both are out of scope for this phase and neither is this repository's to
change.

`<meta name="robots" content="index, follow, max-image-preview:large">` is in
the document head and **does** work — it is served with the page, not from the
origin root. That is what actually communicates indexing intent here.

---

## 9. Structured Data

One `application/ld+json` block, parsed and confirmed valid JSON from the built,
served document:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Task Force 696",
  "alternateName": "TF696",
  "url": "https://tf696.github.io/TF696/",
  "inLanguage": "th",
  "description": "TF696 คือคอมมูนิตี้ Arma 3 Milsim สำหรับผู้เล่นชาวไทย …",
  "about": { "@type": "VideoGame", "name": "Arma 3" }
}
```

Every field is verifiable from the page itself: its name, its alternate name as
used in its own navbar, the URL it is served at, its `lang` attribute, its own
meta description, and the game it is about.

**Nothing was invented.** No `Organization`, no `MilitaryOrganization`, no
`address`, `foundingDate`, `numberOfEmployees`, `memberOf`, `contactPoint`,
`sameAs` or social accounts. The `about: VideoGame` node is the load-bearing
part: it is what makes the markup say *website about an Arma 3 community* rather
than anything that could read as a real-world military body.

Realistic expectation, stated as in Phase 6: this wins no rich result. One page,
no breadcrumbs, no articles, no site-search endpoint. It is there because it is
truthful and cheap, not because it will change a SERP.

---

## 10. Cold Fragment Fix

### The problem

Phase 6 §23.5 measured it: opening `…/TF696/#recruitment` cold left the page at
`scrollY 0` with the section at 7,171 px. The browser looks for the target while
parsing the HTML, when the document is still `<div id="root"></div>`. By the time
React renders the section, the browser has stopped looking.

### The fix

`src/hooks/useInitialHashScroll.js`, called once from `App`. No router was added.
It reads `location.hash` after mount, finds the element, and calls
`scrollIntoView({ behavior: 'instant', block: 'start' })`.

- `'instant'` rather than `'auto'`: `'auto'` defers to the CSS
  `scroll-behavior: smooth` on `html`, which would animate the whole document
  height on what should be a direct arrival — and would hand motion to
  reduced-motion users who did not ask for it.
- `scrollIntoView` honours `scroll-margin-top`, so the existing `5rem`
  header offset applies unchanged.
- Focus is never touched.
- `location.hash` is never written, so no history entry is added.

### The defect in my own first attempt, and why it scrolls twice

The first implementation scrolled once, at mount. Under a throttled cold load it
**landed 104 px short**, and the trace showed why: web fonts finish loading after
mount, and the fallback-to-loaded reflow moves the lower sections a long way.

Measured directly, with `fonts.gstatic.com` blocked versus allowed:

| Section | 375 px shift | 1440 px shift |
|---|---:|---:|
| `#about` | 0 | 0 |
| `#operations` | 0 | 0 |
| `#elements` | −0 | **−208** |
| `#how-we-operate` | **−41** | **−312** |
| `#recruitment` | **−42** | **−416** |

So the mount-time scroll lands on stale coordinates. A second application at
`document.fonts.ready` fixes it.

My **second** mistake was guarding that re-application with "only if the scroll
position is still where I put it". Chrome's scroll anchoring moves the document
by itself during the font reflow, so that guard read the browser's own
compensation as the visitor scrolling and skipped the correction. The trace:

```
throttled cold load of #recruitment, 1440 px
  2,918 ms  scrollY 7,507   ← mount-time scroll, pre-font metrics
  3,473 ms  scrollY 7,195   ← Chrome scroll anchoring, not the visitor
  3,673 ms  fonts.ready     ← correction skipped by the position guard
  final     scrollY 7,195   (correct: 7,091 — 104 px short)
```

The shipped version instead cancels on **user intent** — the first `wheel`,
`touchstart`, `keydown` or `pointerdown` aborts the correction and the listeners
are torn down. After the correction fires, everything is removed and the page is
left alone.

```
same load, after the fix
  2,912 ms  scrollY 7,507
  3,461 ms  scrollY 7,195   ← scroll anchoring
  3,680 ms  scrollY 7,091   ← fonts.ready correction
  final     scrollY 7,091   (exact)
```

### Cold-load results

Every target opened cold with the cache disabled, at four viewports, unthrottled
and throttled (1.6 Mbps / 150 ms RTT). `delta` is `scrollY` minus the correct
`sectionTop − scroll-margin-top`.

| Target | 375 | 768 | 1440 | 1920 |
|---|---:|---:|---:|---:|
| `#about` | 0 | 0 | 0 | 0 |
| `#operations` | 0 | 0 | 0 | 0 |
| `#elements` | 0 | 0 | 0 | 0 |
| `#how-we-operate` | 0 | 0 | 0 | 0 |
| `#recruitment` | 0 | 0 | 0 | 0 |
| `#hero` | 0 | 0 | 0 | 0 |
| `#join` | 0 | 0 | 0 | 0 |

`#nope` (a hash with no matching element) is a no-op: the page stays at 0 and
nothing throws — the hook returns early when `getElementById` finds nothing.

### The other properties, each measured

| Requirement | Result |
|---|---|
| Does not steal focus | `document.activeElement` is `BODY` after every cold load |
| Does not change the hash | `location.hash` unchanged; `history.length` = 2 (baseline) at every target |
| No motion for reduced-motion users | With `prefers-reduced-motion: reduce` forced: `scroll-behavior` computes to `auto`, and the load produces exactly **2** scroll events (two instant jumps, not an animation). Final `scrollY` exact. |
| Stands down if the visitor scrolls | Real wheel input injected between mount and `fonts.ready`: the page ends at 8,291 where the visitor left it, **not** snapped back to 7,091 |
| In-page navigation unaffected | Clicking each navbar link still lands exactly (delta 0) and is still **smooth** — 28 to 54 scroll samples per navigation, versus 1 for the instant fix |
| No repeated scrolling afterwards | Listeners removed after the single correction; no further scroll events observed |

Cost: **+544 B** of uncompressed JS, measured by building with and without the
hook.

---

## 11. Public V2 Marker Cleanup

`src/components/sections/HeroSection.jsx`:

```diff
-          <span>TF696 / V2</span>
+          <span>TF696</span>
```

That is the whole change. The hero was not redesigned. The footer strip keeps
its three-part geometry — label, rule, `SHOWCASE + RECRUITMENT` — and the same
editorial treatment; only the text inside the first span is shorter. Confirmed
in the browser at 375, 768, 1440 and 1920: the strip reads
`TF696 —— SHOWCASE + RECRUITMENT` and sits where it always sat. No other
internal version identifier was introduced anywhere.

---

## 12. Hero Cleanup

```diff
-          <p id="hero-intro" className="hero__copy" tabIndex="-1">
+          <p id="hero-intro" className="hero__copy">
```

Safe to remove, and checked rather than assumed:

- `#hero-intro` is referenced nowhere else in the tree — not in JSX, not in
  `index.css`, not as an `aria-*` target, not as an `href`.
- The secondary hero CTA has targeted `#about` since Phase 3B; the Phase 2B
  `DISCOVER TF696` → `#hero-intro` link no longer exists.
- The attribute added no tab stop, so removing it changes no tab order.

Verified after the change: `document.getElementById('hero-intro').getAttribute('tabindex')`
is `null`, and the desktop tab order at 1440 px is unchanged — the first
fourteen stops were walked with real `Tab` key events and match Phase 6 §13
position for position:

```text
 1 skip-link   2 brand   3 ABOUT   4 OPERATIONS   5 ELEMENTS   6 RECRUITMENT
 7 header JOIN DISCORD   8 JOIN THE UNIT   9 DISCOVER TF696
10 final-cta JOIN DISCORD  11-14 footer ABOUT / OPERATIONS / ELEMENTS / HOW WE OPERATE
```

The `id` is left in place; removing it would be an unrelated edit. No other hero
markup was touched.

---

## 13. GitHub Pages Workflow

`.github/workflows/deploy.yml` — **created, not run, not pushed.**

It parses cleanly (checked with a YAML parser) into the intended structure:
a `build` job and a `deploy` job.

| Step | Action | Latest stable major |
|---|---|---|
| Checkout | `actions/checkout@v7` | v7.0.1 |
| Node | `actions/setup-node@v7` (Node 24, npm cache) | v7.0.0 |
| Configure Pages | `actions/configure-pages@v6` | v6.0.0 |
| Upload artifact | `actions/upload-pages-artifact@v5` (`path: dist`) | v5.0.0 |
| Deploy | `actions/deploy-pages@v5` | v5.0.1 |

Versions were **verified over the network**, not guessed — queried from the
GitHub releases API rather than taken from README examples. A note on that,
because it matters if anyone re-checks: GitHub's own published starter workflow
(`actions/starter-workflows` → `pages/static.yml`) and the two action READMEs
currently lag their own releases, still showing `checkout@v4`,
`configure-pages@v5`, `upload-pages-artifact@v3` and `deploy-pages@v4`. I used
the current majors instead. `configure-pages@v6`, `upload-pages-artifact@v5` and
`deploy-pages@v5` are one coherent post-March-2026 Node 24 generation.

**Permissions** are `{}` at the top level — nothing granted by default — and each
job asks for the minimum:

```yaml
build:   permissions: { contents: read }
deploy:  permissions: { pages: write, id-token: write }
```

`id-token: write` is the OIDC token `deploy-pages` exchanges for the deployment.
No other scope is requested anywhere.

**Concurrency** is `group: pages` with `cancel-in-progress: false`. Cancelling a
run that is mid-deploy can leave a Pages deployment half-applied, so a fast
series of pushes publishes in order rather than racing or aborting.

**Triggers**: push to `main`, plus `workflow_dispatch` so a deployment can be
re-run from the Actions tab without an empty commit.

---

## 14. Subpath Simulation

Not verified at a localhost root. The production `dist/` was served by a static
server that mounts it at `/TF696/` and returns 404 for everything outside that
prefix — the same shape a project page presents.

### Path probes

| Request | Status | Bytes |
|---|---:|---:|
| `/TF696/` | **200** | 5,395 |
| `/TF696/index.html` | **200** | 5,395 |
| `/TF696/assets/index-*.js` | **200** | 221,634 |
| `/TF696/assets/index-*.css` | **200** | 35,285 |
| `/TF696/favicon.ico` | **200** | 6,615 |
| `/TF696/apple-touch-icon.png` | **200** | 15,709 |
| `/TF696/og-image.jpg` | **200** | 259,428 |
| `/TF696/sitemap.xml` | **200** | 597 |
| `/TF696/robots.txt` | **200** | 1,149 |
| `/TF696/assets/hero-2400-…avif` | **200** | 689,944 |
| `/TF696` (no slash) | 301 → `/TF696/` | — |
| `/` | 404 | — |
| `/assets/index-CpzQMq7T.js` | 404 | — |

### Full-page sweeps, four viewports

Each viewport was loaded cold, scrolled top to bottom so every lazy image
resolved, and every response accounted for.

| Viewport | Local requests | Non-200 | Failures | Duplicates | Broken images | H-overflow |
|---|---:|---:|---:|---:|---:|---:|
| 375 × 812 @2x | 11 | **0** | 0 | **0** | 0 | **0 px** |
| 768 × 1024 @2x | 11 | **0** | 0 | **0** | 0 | **0 px** |
| 1440 × 900 @1x | 11 | **0** | 0 | **0** | 0 | **0 px** |
| 1920 × 1080 @1x | 11 | **0** | 0 | **0** | 0 | **0 px** |

**No root-path asset mistakes.** Every request the page made began with
`/TF696/`; a filter for requests to the origin root that were not under the
prefix returned an empty set at every viewport.

### Hero preload — resolves, and still fetches once

| Viewport | Selected | Hero requests | Initiator |
|---|---|---:|---|
| 375 @2x | `hero-1280.avif` | **1** | `parser` |
| 1440 @1x | `hero-1600.avif` | **1** | `parser` |
| 1920 @1x | `hero-1920.avif` | **1** | `parser` |

`parser` means the request came from the `<link rel="preload">` in the head, not
from React rendering the `<picture>` — the preload is doing its job, and the
`<picture>` reuses that response rather than issuing a second one. Chrome logged
**no** console or `Log` entries at all at 375 and 1440, including no "preload was
not used" warning.

### Responsive selection — identical to Phase 6

```text
375@2x   logo-128  hero-1280  da-960   av-960   900w ×3   cta-1280
1440@1x  logo-64   hero-1600  da-1280  av-1280  1200w ×3  cta-1600
1920@1x  logo-64   hero-1920  da-1280  av-960   1200w ×3  cta-1920
```

That matches the Phase 6 §19 block exactly, including the case that looks wrong
and is not: at 1920 the Aviation story resolves to `aviation-960` while Direct
Action resolves to `direct-action-1280`, because Aviation is the narrower story.
768 @2x additionally resolves `hero-1920 / da-1600 / av-1280 / 1200w ×3 /
cta-1920`.

---

## 15. Metadata Verification

Read from the **built, served** document at `http://127.0.0.1:8787/TF696/`,
through the browser's DOM — not from the source file.

| Field | Value | Expected |
|---|---|---|
| `<title>` | `Task Force 696 — Arma 3 Milsim Thailand` | ✅ exact |
| `link[rel=canonical]` | `https://tf696.github.io/TF696/` | ✅ exact |
| canonical element count | `1` | ✅ |
| `og:url` | `https://tf696.github.io/TF696/` | ✅ exact |
| `og:image` | `https://tf696.github.io/TF696/og-image.jpg` | ✅ exact |
| `og:image:width` / `height` | `1200` / `630` | ✅ matches the file |
| `og:image:alt` | present, bilingual, frames it as Arma 3 | ✅ |
| JSON-LD | parses as valid JSON, `@type: WebSite` | ✅ |

No `localhost`, no `127.0.0.1`, no `example.com`, no `/index.html` canonical
anywhere in the built document, the sitemap or robots.txt.

---

## 16. Browser Regression QA

Chrome 152.0.7977.76 in `--headless=new`, driven over the DevTools Protocol by
Node scripts using Node 24's built-in `WebSocket`. No dependency was added to
the project for any of it. The production build was served at the `/TF696/`
subpath; each viewport used `Emulation.setDeviceMetricsOverride` and waited on
`document.fonts.ready`.

| Check | 375 | 768 | 1440 | 1920 |
|---|---|---|---|---|
| Horizontal overflow | none | none | none | none |
| Heading structure H1/H2/H3 | 1 / 6 / 12 | 1 / 6 / 12 | 1 / 6 / 12 | 1 / 6 / 12 |
| Broken images | 0 | 0 | 0 | 0 |
| Discord links | 5 × `discord.gg/ptAbcyeDcf` | same | same | same |
| Hero footer strip | `TF696 / SHOWCASE + RECRUITMENT` | same | same | same |
| `#hero-intro` tabindex | `null` | `null` | `null` | `null` |
| Document height | 9,471 | 9,083 | 10,570 | 11,156 |

The 768, 1440 and 1920 document heights are **identical** to Phase 6's recorded
figures. 375 differs only because this run used a 900 px viewport height where
Phase 6 used 812 — the hero is `min-height: max(100svh, 44rem)`, so its height
tracks the viewport. At 375 × 812 the height is 9,378, matching Phase 6 exactly.

Landmarks are also unchanged and were counted rather than assumed: one
`<header>`, one `<main>`, one `<footer>`, three `<nav>` (desktop, mobile,
footer) — matching Phase 6 §8.

### Visual review

Screenshots captured from the subpath build and inspected: hero at 375 @2x, 768,
1440 and 1920; the open mobile menu at 375 @2x; the recruitment section at 1440;
the Final CTA and footer at 1440.

- **Navbar** — unchanged: `ABOUT OPERATIONS ELEMENTS RECRUITMENT` plus the
  `JOIN DISCORD` button. `HOW WE OPERATE` is **not** in it, per Task 11.
- **Hero** — unchanged except the footer strip text. Type, eyebrow rule, both
  CTAs, the orange `696`, the overlay and the grain all sit as before. Sharp at
  every width; the selected derivative matches Phase 5's ladder.
- **Mobile menu** — still opens, still lists the same four sections numbered
  01–04 with `JOIN DISCORD` beneath, and still moves focus to its first item
  with the global orange focus ring visible. The full focus-trap behaviour was
  not re-measured this phase; nothing in Phase 7A touched `SiteHeader.jsx`, and
  Phase 6 §14 measured it.
- **Recruitment** — the full rendered text of `#recruitment` was extracted and
  checked item by item, not eyeballed. All seven requirements intact and
  unchanged: `AGE 18+` (ต่ำกว่า 18 ปี พิจารณาเป็นรายกรณี), `MICROPHONE REQUIRED`,
  `SKILL ASSESSMENT REQUIRED`, `TRAINING REQUIRED`, `MODPACK REQUIRED`,
  `APEX DLC RECOMMENDED`, `ATTENDANCE FLEXIBLE`. Schedule still
  `FRIDAY / SATURDAY / SUNDAY — 20:30 GMT+7`. The four-step HOW TO JOIN sequence
  and the "ไม่มีแบบฟอร์มสมัครบนเว็บไซต์ — จุดเริ่มต้นคือ Discord" line are
  unchanged. Nothing in this phase touched `RecruitmentSection.jsx`.
- **Footer** — unchanged: `HOW WE OPERATE` still reachable there, the visible
  `discord.gg/ptAbcyeDcf` string still present, schedule line intact.

### Discord

Five links, one unique URL, `https://discord.gg/ptAbcyeDcf`, at every viewport.
No file in this phase touched a Discord URL.

### Cold fragment URLs

Tested as §10 records: all five required targets plus `#hero`, `#join` and a
non-existent hash, at four viewports, throttled and not.

### Observation, pre-existing, not introduced here

At ≥ ~1400 px the hero's `object-fit: cover` crops by **height**, so the full
width of the master is painted — including the thin paper-white frame at its
left and right edges. The left edge is masked by the overlay gradient; the right
edge shows as a pale strip. Measured: at 1440 × 900 the image paints 1440 × 985
into a 1440 × 900 box.

This is inherent to the approved master and its Phase 3C cover geometry. Nothing
in Phase 7A changed the hero image, its `sizes`, or its CSS, so it is unchanged
from Phase 5/6 — it is recorded because I looked at the screenshots carefully,
not because it regressed. Fixing it would mean re-cropping the hero master,
which is a design decision, not a deployment one.

---

## 17. Performance Regression

### A finding this phase's own measurement produced

While reconciling the build output against Phase 6's table, the CSS came out
21 B larger, then 194 B larger again after I wrote this report. That second jump
gave it away: **Tailwind's automatic source detection was scanning the phase
report Markdown files**, and generating a utility for any word in them that
looked like a class name. Writing the sentence "a filter for requests…" in §14
emitted a `.filter` rule into the production stylesheet.

Diffed selector by selector, the reports had contributed a block of bare
utilities the site never uses — `.visible`, `.absolute`, `.fixed`, `.relative`,
`.sticky`, `.flex`, `.table`, `.border`, `.bg-accent`, `.font-display`,
`.uppercase`, `.ring`, `.blur`, `.filter`, `.transition` and the `@property`
declarations supporting them.

Fixed in `src/index.css` by declaring the sources explicitly:

```css
@import "tailwindcss" source(none);
@source "../index.html";
@source "./**/*.{js,jsx}";
```

That covers every file that can carry a class name — the site uses BEM-style
custom classes throughout and there is no `@apply` anywhere, so nothing real can
fall outside it.

**Result: −6,487 B of CSS (41,772 → 35,285), with rendering byte-identical.**
Screenshots taken before and after the change — hero at 1440, Final CTA and
footer at 1440, open mobile menu at 375 @2x — hash to the same sha256. The
removed rules were dead.

This was not on the task list. It is included because it is a production-bundle
defect that this phase's own verification surfaced, the fix is three lines, and
leaving a stylesheet that changes when someone edits documentation would have
been a worse thing to hand to Phase 7B than a short explanation.

### Build output, against Phase 6's recorded table

| | Phase 6 | Phase 7A | Δ |
|---|---:|---:|---:|
| Image files in `dist/` | 98 | **99** | +1 (`og-image.jpg`) |
| Image bytes | 8,151,210 | **8,410,638** | +259,428 |
| JS | 222,933 | **221,634** | **−1,299** |
| CSS | 41,772 | **35,285** | **−6,487** |
| `index.html` | 3,011 | **5,395** | +2,384 |
| `robots.txt` | 292 | **1,149** | +857 |
| `sitemap.xml` | — | **597** | +597 |
| **Whole `dist/`** | **8,419,218** | **8,674,698** | **+255,480** |

The deltas reconcile exactly, with no unexplained remainder:

- **+259,428** is the OG image, and only the OG image. It is never fetched by a
  visitor — only by unfurlers — so it costs the page nothing.
- **−1,299 JS** is the base change net of the fix. The `/TF696/` base saves
  1,824 B of runtime URL resolution (§3); the hash-scroll hook costs 544 B. Both
  measured directly by building with and without each.
- **−6,487 CSS** is the Tailwind source restriction above.
- **+2,384 `index.html`** is the canonical link, five OG tags, the JSON-LD block
  and their explanatory comments. A few hundred bytes gzipped.
- **+857 `robots.txt`** is the §8 limitation written out in comments, so nobody
  has to rediscover it.

Gzipped, what actually reaches a visitor: **JS 67.81 kB, CSS 7.57 kB** (was
8.73 kB before the CSS fix).

No new large asset entered the bundle. The image optimizer reports
`96 derivatives — 0 written, 96 reused — 8,128,886 B on disk`, identical to
Phase 5 and Phase 6.

### Runtime

No performance collapse. Per viewport: 11 local requests including the document,
CSS, JS and every image; the hero fetched once and preloaded by the parser;
every responsive selection identical to Phase 6's.

**Honest limitation on transfer numbers.** The subpath simulation server does
not compress responses, so its raw byte totals are not comparable to the
compressed figures Phase 5 and Phase 6 recorded, and **no like-for-like transfer
delta is claimed here**. What *is* comparable — and is reported above — is
on-disk `dist/` composition, request counts, hero-fetch counts and derivative
selection. GitHub Pages compresses text responses itself, so the JS and CSS
reaching real visitors will be close to the gzip figures above.

---

## 18. Build / Lint

```
npm run lint            clean, no errors, no warnings
npm run build           ✓ 127 modules transformed — built in 364 ms
npm run optimize:images 96 derivatives — 0 written, 96 reused — 8,128,886 B
                        Every file in img/ was opened read-only.
npm run favicon:generate favicon.ico 6,615 B (16/32/48); apple-touch-icon 180×180
                        outputs byte-identical to the committed files
npm run og:generate     public/og-image.jpg 1200×630 259,428 B
                        run twice — identical sha256 both times
```

**Task 15 verified for real, not asserted.** The source tree was copied to a
fresh directory with `node_modules` and `dist` excluded, then:

```
npm ci                  clean install from package-lock.json, 0 vulnerabilities
npm run lint            clean
npm run build           ✓ built in 397 ms
```

No generator was invoked. The output is **byte-for-byte identical** to the
working-tree build: same file list, same `index.html`, same totals
(99 images / 8,410,638 B, JS 221,634, CSS 35,285, whole `dist/` 8,674,698). It
contains `og-image.jpg`, `favicon.ico`, `apple-touch-icon.png`, `robots.txt` and
`sitemap.xml` without any generator having run.

So `npm ci && npm run build` is sufficient, which is exactly what the workflow
does. `npm run optimize:images` is not needed at deploy time and is not in the
workflow.

All archival masters in `img/` still carry their pre-session modification times
and hashes. Nothing in `img/` was written.

---

## 19. Files Changed

### Added

| File | Purpose |
|---|---|
| `scripts/generate-og-image.mjs` | Deterministic 1200 × 630 OG card from the read-only hero master |
| `public/og-image.jpg` | The card itself, 259,428 B |
| `public/sitemap.xml` | Single-URL sitemap |
| `src/hooks/useInitialHashScroll.js` | Cold fragment deep-link fix |
| `.github/workflows/deploy.yml` | Pages build + deploy — **not run, not pushed** |
| `TF696_PHASE_7A_PRODUCTION_WIRING_REPORT.md` | This report |

### Modified

| File | Change |
|---|---|
| `vite.config.js` | `base: '/TF696/'`; preload plugin emits the same base |
| `index.html` | canonical, `og:url`, `og:image` + width/height/alt, JSON-LD, Google Fonts dependency note |
| `public/robots.txt` | Rewritten to state the project-page limitation honestly; `Sitemap:` recorded with its caveat |
| `src/App.jsx` | Calls `useInitialHashScroll()` |
| `src/components/sections/HeroSection.jsx` | `TF696 / V2` → `TF696`; `tabIndex="-1"` removed from `#hero-intro` |
| `src/index.css` | Tailwind sources declared explicitly (§17) — three lines at the top; no rule, token or selector authored by earlier phases was touched |
| `package.json` | `og:generate` script |
| `README.md` | Deployment section, social-preview section, robots limitation |

### Untouched, deliberately

`img/` (every master), every hand-authored rule in `src/index.css`,
`SiteHeader.jsx`, `SiteFooter.jsx`,
`RecruitmentSection.jsx`, `AboutSection.jsx`, `OperationsSection.jsx`,
`ElementsSection.jsx`, `HowWeOperateSection.jsx`, `FinalCtaSection.jsx`,
`ResponsiveImage.jsx`, `scripts/optimize-images.mjs`,
`scripts/generate-favicon.mjs`, `src/assets/optimized/**`.

No router, no backend, no analytics, no cookies, no forms, no social accounts,
no manifest, no font self-hosting, no navbar change, no recruitment fact change,
no Discord URL change.

---

## 20. Deployment Readiness

| Success criterion | Status |
|---|---|
| `base` deliberately `/TF696/` | ✅ |
| Canonical correct, exactly one, directory form | ✅ |
| `og:url` correct | ✅ |
| 1200 × 630 OG image exists, wired absolutely, visually reviewed | ✅ |
| Sitemap exists and is valid | ✅ |
| robots project-path limitation documented honestly | ✅ |
| JSON-LD contains no invented facts | ✅ |
| Cold fragment direct loads work | ✅ all targets, 4 viewports, throttled and not |
| Visible `V2` marker removed | ✅ |
| Obsolete `#hero-intro` focus attribute cleaned | ✅ verified unused first |
| Deployment workflow exists, **not** pushed | ✅ |
| `/TF696/` production simulation passes | ✅ |
| No Discord or recruitment regression | ✅ |
| Lint passes | ✅ |
| Build passes | ✅ |
| Real browser QA passes | ✅ Chrome 152 |

One item beyond the task list was changed and is called out rather than buried:
the Tailwind source restriction in `src/index.css` (§17). It removes 6,487 B of
dead CSS generated from the phase reports, and rendering is byte-identical. If a
reviewer would rather ship exactly what Phase 6 shipped, reverting it is a
three-line revert of the top of `src/index.css` and costs only those bytes.

**The codebase is ready to deploy.** Nothing was deployed.

---

## 21. Remaining Blockers

### Blocking Phase 7B

**None in the codebase.** Two items are environmental and belong to whoever runs
7B:

1. **GitHub Pages must be set to "GitHub Actions" as its source** in
   `TF696/TF696` → Settings → Pages. The workflow deploys via the Pages artifact
   API; if the repository is still set to "Deploy from a branch", the run
   fails at the deploy step. This is a one-time setting and cannot be done from
   here.
2. **This tree has no Git remote and no `.git` directory.** Whatever process
   moves it into `TF696/TF696` is outside this phase, and the phase brief
   forbade touching remote history.

### Not blocking, but decide before or soon after launch

3. **The OG card wants one human look** (§6). I inspected it and believe it is
   right; it is also the most publicly visible single artefact here.
4. **Chrome is still the only engine tested.** Unchanged from Phases 5 and 6 and
   still the biggest gap in the evidence. Safari, Firefox and a real handset —
   with attention to the mobile menu, hero and Final CTA heights under mobile
   browser chrome, the skip link, and now the cold fragment fix — remain worth
   an hour. `scrollIntoView({behavior:'instant'})` and `document.fonts.ready`
   are both broadly supported, but "supported" and "verified" are different
   claims and only the second one is worth making.
5. **A native Thai read** of the visible copy for tone. Phase 6 §10 explicitly
   did not claim to have covered this and neither does this phase.
6. **Non-rendering crawlers see an empty body.** Inherent to a client-rendered
   SPA. The Open Graph tags and now the JSON-LD are the mitigation that matters
   for the actual use case — links pasted into Discord.
7. **Google Fonts remains an external, render-blocking dependency** (§ head
   comment, Phase 6 §23.11). Documented, deliberately not changed: swapping the
   font delivery path immediately before a first deployment buys risk, not
   confidence.
8. **The origin-root `robots.txt` is not controlled by this repository** (§8).
   If crawl policy at `tf696.github.io/robots.txt` ever matters, it has to be
   set in the user-site repository — a separate decision, out of scope here.
9. **The 16 × 16 favicon is still not legible** (Phase 6 §4). Inherent to a
   dense circular emblem at that size; a readable small icon needs a
   purpose-drawn simplified mark.
10. **Carried forward, unaffected:** the skill-assessment wording placeholder,
    the hero eyebrow rule, the unlinked `#join` id (it works as a fragment
    target — verified in §10 — it is simply not linked from anywhere), the
    `RECRUITMENT` / `VIEW SECTION` caption wrap in the mobile menu, the two
    mislabelled PNGs in `img/`, and the hero's paper-frame edge at wide
    viewports (§16).

---

## 22. Recommended Phase 7B Steps

In order, and stopping at the first thing that looks wrong:

1. **Human review of this phase.** Specifically: the OG card, the canonical and
   `og:url` strings against the real repository name, and the workflow's action
   versions.
2. **Set Pages source to GitHub Actions** in the repository settings, before the
   first push. Otherwise the first run fails at deploy for a reason that has
   nothing to do with the code.
3. **Take a restorable snapshot of the current live site.** It is being
   replaced. `TF696_LEGACY_BACKUP.zip` exists one directory up from this tree,
   but confirm it matches what is actually live before relying on it.
4. **Push to `main`** and let the workflow run. Do not merge anything else in
   the same push — the first deployment should be the only variable.
5. **Watch the run.** `npm ci` → `lint` → `build` → configure → upload → deploy.
   If `deploy` fails with a permissions or artifact error, check step 2 before
   changing anything in the workflow.
6. **Verify the live site at the real origin**, not a simulation:
   - `https://tf696.github.io/TF696/` returns 200 and paints the hero
   - `https://tf696.github.io/TF696/og-image.jpg` returns 200 at 1200 × 630
   - `https://tf696.github.io/TF696/sitemap.xml` returns 200 and parses
   - `https://tf696.github.io/TF696/#recruitment` opened cold lands on the
     section — this is the one behaviour that cannot be fully proven locally,
     because real font latency differs from an emulated 1.6 Mbps link
   - the canonical, `og:url` and `og:image` in view-source are the production
     strings
   - no request in DevTools resolves to `https://tf696.github.io/assets/…`
7. **Paste the live URL into Discord** and look at the unfurl. That is the
   primary conversion path and the only true test of §5 and §6.
8. **Submit the sitemap out of band** (Search Console), since §8 means nothing
   will discover it automatically.
9. **Then, not before:** the Safari / Firefox / real-handset pass and the native
   Thai copy read.

Phase 7A stopped here. Nothing was deployed, nothing was pushed, and no commit
was created.
