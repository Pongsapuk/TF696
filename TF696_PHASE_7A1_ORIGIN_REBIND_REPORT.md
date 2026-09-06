# TF696 Phase 7A.1 — Production Origin Rebind

Executor: Claude Code (Claude Opus 5)
Scope: bounded configuration correction. No content, UI, asset, accessibility
or behavioural change. No Git. No deployment.

---

## 1. Executive Summary

Phase 7A wired the site to a production origin that has since been superseded.
The V2 site will not be published under the old TF696 GitHub account; a clean
repository now exists under the owner's personal account:

```
https://github.com/Pongsapuk/TF696
```

Phase 7A.1 rebinds every **active** production-origin reference from
`https://tf696.github.io/TF696/` to `https://pongsapuk.github.io/TF696/`.

The repository name did not change, so the GitHub Pages project subpath did not
change either. `base: '/TF696/'` is untouched, and this was verified rather than
assumed: the owner determines the origin, the repository name determines the
path.

Seven files changed. Every change is a URL, or a comment that names the target.
No executable application code changed. The one function whose file was edited
(`useInitialHashScroll.js`) had a single line of its doc comment updated; its
runtime body is byte-identical.

Verification performed: lint pass, clean production build, image-bank check,
subpath simulation over all 96 bundle-referenced assets, built-document metadata
inspection, content regression on the Discord invite and every recruitment fact,
and a real headless-Chrome cold-fragment test across all five anchors.

Result: **GO** for the initial Git push, with the caveats in §19 and §20.

---

## 2. Old Production Target

| Field | Value |
| --- | --- |
| Repository | `TF696/TF696` |
| Origin | `https://tf696.github.io/` |
| Production URL | `https://tf696.github.io/TF696/` |
| Vite base | `/TF696/` |

This target is retired. It was never deployed to — Phase 7A ended before Git
integration, and so does this one.

## 3. New Locked Production Target

| Field | Value |
| --- | --- |
| Repository | `Pongsapuk/TF696` |
| Visibility | Public |
| Default branch | `main` |
| Origin | `https://pongsapuk.github.io/` |
| Production URL | `https://pongsapuk.github.io/TF696/` |
| Canonical URL | `https://pongsapuk.github.io/TF696/` |
| Vite base | `/TF696/` (unchanged) |

The directory form is canonical. GitHub Pages serves the same document at
`https://pongsapuk.github.io/TF696/index.html`; that URL is deliberately not the
canonical value, because pointing at it would split the two.

---

## 4. Whole-Tree Origin Audit

The whole source tree was searched for `tf696.github.io`, `pongsapuk.github.io`
and `TF696/TF696`, excluding `node_modules/` and the build output. Every match
was classified before anything was edited.

### ACTIVE PRODUCTION SOURCE — changed

| File | Matches | Nature |
| --- | --- | --- |
| `index.html` | 5 | canonical, `og:url`, `og:image`, JSON-LD `url`, one comment |
| `public/robots.txt` | 4 | 2 comment URLs, 1 comment prose, 1 `Sitemap:` directive |
| `public/sitemap.xml` | 1 | the single `<loc>` |
| `README.md` | 3 | active deployment instructions |
| `vite.config.js` | 2 | comments naming the repository and served URL |
| `.github/workflows/deploy.yml` | 2 | header comment naming the repository and served URL |
| `src/hooks/useInitialHashScroll.js` | 1 | example URL inside the doc comment |

### DOCUMENTATION / HISTORICAL REPORT — deliberately untouched

`TF696_PHASE_7A_PRODUCTION_WIRING_REPORT.md` holds 22 references to the old
origin. Every one of them is a record of what was true when Phase 7A ran. They
are left exactly as written. Rewriting them would falsify the project history to
make it look as though the old target never existed; the brief explicitly
forbids it, and it would be the wrong thing to do regardless.

`TF696_LEGACY_CODEBASE_INSPECTION.md`, `TF696_V2_FOUNDATION_REPORT.md` and the
Phase 2B / 3B / 3C / 4 / 5 / 6 reports contain no origin references at all.

### IRRELEVANT

`node_modules/` — third-party code, not ours. `dist/` — regenerated from source;
it was rebuilt after the change and re-verified in §15.

### Post-change re-audit

```
grep -rn "tf696.github.io\|TF696/TF696" .
  --exclude-dir=node_modules --exclude-dir=dist
  (excluding historical phase reports)
-> no matches
```

The only remaining occurrences of the old origin anywhere in the tree are inside
the Phase 7A report, where they belong.

---

## 5. Canonical Update

`index.html`:

```html
<!-- Production origin, locked in Phase 7A: the GitHub Pages project page
     for Pongsapuk/TF696. The directory form is canonical — GitHub Pages
     serves the same document at /TF696/index.html, and pointing at that URL
     instead would split the two. -->
<link rel="canonical" href="https://pongsapuk.github.io/TF696/" />
```

Verified in the **built** document `dist/index.html`:

- canonical element count is **1**. Exactly one canonical exists.
- value is exactly `https://pongsapuk.github.io/TF696/`
- no `/index.html` suffix
- no `tf696.github.io` value remains

## 6. Open Graph Update

```html
<meta property="og:url"   content="https://pongsapuk.github.io/TF696/" />
<meta property="og:image" content="https://pongsapuk.github.io/TF696/og-image.jpg" />
```

Preserved unchanged: `og:type`, `og:site_name`, `og:title`, `og:description`,
`og:locale`, `og:image:width` (1200), `og:image:height` (630) and `og:image:alt`
— including the alt text that names Arma 3 explicitly, so the card cannot be
mistaken for a photograph of real military activity.

`public/og-image.jpg` was **not** regenerated and was not modified in any way.
Its dimensions were re-measured from the built copy to confirm the metadata
still describes the real file:

```
sharp('dist/og-image.jpg').metadata() -> 1200x630 jpeg
```

The absolute URL is required here: unfurlers do not resolve relative ones.

## 7. JSON-LD Update

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Task Force 696",
  "alternateName": "TF696",
  "url": "https://pongsapuk.github.io/TF696/",
  "inLanguage": "th",
  "description": "TF696 คือคอมมูนิตี้ Arma 3 Milsim …",
  "about": { "@type": "VideoGame", "name": "Arma 3" }
}
```

Only `url` changed. `@type`, `name`, `alternateName`, `inLanguage`,
`description` and the `about` VideoGame / Arma 3 node are untouched. No
Organization data was added — the block still asserts nothing about membership,
founding, location, contact or affiliation.

## 8. Sitemap Update

`public/sitemap.xml` — the single `<loc>`:

```xml
<loc>https://pongsapuk.github.io/TF696/</loc>
```

No URL was added. No `<lastmod>` was added — an accurate value would have to
come from the real publish time, and an invented date is worse than none. No
`<changefreq>` or `<priority>`. The explanatory comment above the `<urlset>` is
unchanged and still correct.

## 9. Robots.txt Update

Three active values were rebound, and the surrounding prose corrected to name
the new user site:

```
#   https://pongsapuk.github.io/TF696/robots.txt   (where this file publishes)
#   https://pongsapuk.github.io/robots.txt         (where crawlers actually look)
# which is served by the pongsapuk.github.io *user* site, not by this
# repository.

Sitemap: https://pongsapuk.github.io/TF696/sitemap.xml
```

The limitation is unchanged in substance and is still stated honestly in the
file itself, not softened:

**`https://pongsapuk.github.io/TF696/robots.txt` is not the origin-root robots
file.** Crawlers fetch robots.txt only from
`https://pongsapuk.github.io/robots.txt`, which is served by the
`pongsapuk.github.io` *user* site — a different repository that
`Pongsapuk/TF696` does not control. The `User-agent` / `Allow` rules in this
file therefore do **not** govern crawling of this site, and the `Sitemap:`
directive will not be read, so no crawler will discover the sitemap through it.

The change of owner does not improve this. It is the same structural limitation
of a GitHub Pages project page, now pointing at a different origin root. Sitemap
submission still has to happen out of band (Search Console or equivalent).

The file is kept because it is harmless, correct on its own terms, and would
take effect unchanged if the site ever moved to an origin root or a custom
domain.

## 10. README / Deployment Documentation

`README.md` §Deployment is active deployment instruction, not history, so it was
updated:

- project page identified as `Pongsapuk/TF696`
- served URL `https://pongsapuk.github.io/TF696/`
- robots.txt limitation URL rebound
- the sentence "Changing the repository name or moving to a custom domain means
  changing all of them together" now reads "Changing the repository **owner or
  name**, or moving to a custom domain, means changing all of them together" —
  this phase is the exact case that sentence failed to anticipate, so it is
  worth fixing while it is in hand
- pointers to this report added in the robots paragraph and the closing
  paragraph

Everything else in the README — local development, verification, images, browser
identity, social preview — is unchanged.

No historical phase report was edited.

## 11. GitHub Workflow Review

`.github/workflows/deploy.yml` was inspected in full.

**No functional line changed.** The workflow is entirely repository-relative:

- `actions/checkout@v7` checks out whatever repository it runs in
- `actions/configure-pages@v6` derives the Pages URL from that repository
- `actions/upload-pages-artifact@v5` uploads `dist`
- `actions/deploy-pages@v5` deploys via the OIDC token minted in-run
- the environment URL is `${{ steps.deployment.outputs.page_url }}` — resolved
  by GitHub at run time, not hard-coded

No owner, no origin and no repository name appears in any executable value. The
permissions model (nothing at top level, `contents: read` for build,
`pages: write` + `id-token: write` for deploy) and the
`concurrency: pages, cancel-in-progress: false` policy are unchanged.

The only edit was to the file's header **comment**, which named `TF696/TF696`
and `https://tf696.github.io/TF696/` as the deployment target. That is a
documentation string inside an active file, not a workflow value — leaving it
would have left a false statement of the deployment target in the first thing a
maintainer reads. It now names `Pongsapuk/TF696` and
`https://pongsapuk.github.io/TF696/`. YAML semantics are provably unaffected.

The workflow was **not** run.

## 12. Vite Base Verification

```js
/** GitHub Pages project-page subpath for `Pongsapuk/TF696`. See `base`. */
const BASE = '/TF696/'
…
export default defineConfig({
  base: BASE,
  …
})
```

`base` is exactly `'/TF696/'`. It was **not** changed to `'/'`, `'./'`,
`'/Pongsapuk/'` or `'/pongsapuk/'`.

This is the point the phase most needed to get right. The repository owner
changed; the repository *name* did not. GitHub Pages derives the project-page
subpath from the repository name alone, so the path stays `/TF696/`. `'/'` would
be wrong for the same reason it was wrong before — assets would resolve against
`https://pongsapuk.github.io/`, the origin root, which belongs to the user site
rather than this repository.

`BASE` is also consumed by the `tf696-preload-hero` plugin for the LCP preload
`href` and `imagesrcset`, so a wrong base would have broken the hero preload as
well as every asset. §14 confirms both resolve correctly.

Only the comments naming the repository changed in this file.

## 13. Build / Lint Verification

```
npm run lint
  > eslint .
  exit 0 — no errors, no warnings

npm run optimize:images
  96 derivatives — 0 written, 96 reused — 8128886 B on disk
  Every file in img/ was opened read-only.
  exit 0

npm run build            (after rm -rf dist)
  ✓ built in 287ms
  exit 0
  dist/assets/index-HlOz3zX1.js   221.63 kB │ gzip: 67.81 kB
  dist/assets/index-NIdhwzqM.css   35.28 kB │ gzip:  7.57 kB
```

`0 written, 96 reused` is exactly the expected result. No optimized derivative
was regenerated, no archival master in `img/` was written to, and the committed
image bank is byte-identical to what Phase 5 produced. A URL change has no
business touching the image pipeline, and it did not.

The build was re-run after the README edits; output was identical, with the same
content hashes.

## 14. Subpath Simulation

A static server was run that refuses to serve anything outside `/TF696/`,
reproducing a GitHub Pages project page. The local hostname is irrelevant; the
path prefix is what matters.

Required checks:

| URL | Status |
| --- | --- |
| `/TF696/` | 200 |
| `/TF696/index.html` | 200 |
| `/TF696/favicon.ico` | 200 |
| `/TF696/apple-touch-icon.png` | 200 |
| `/TF696/og-image.jpg` | 200 |
| `/TF696/sitemap.xml` | 200 |
| `/TF696/robots.txt` | 200 |

Negative controls — these must fail, and do:

| URL | Status | Meaning |
| --- | --- | --- |
| `/assets/index-HlOz3zX1.js` | **404** | nothing resolves at the origin root |
| `/TF696/nope.txt` | 404 | the server is not faking successes |

Every asset referenced by the built document (13 URLs: the JS entry, the CSS,
the favicon, the apple-touch icon, the og-image, and the full six-width hero
AVIF preload srcset) returned 200 under `/TF696/`.

Every asset referenced by the built JS and CSS bundles was then enumerated and
requested:

```
96 references checked — 0 non-200
```

All 96 are prefixed `/TF696/assets/`. A search for a root-relative `"/assets/`
reference in `dist/index.html`, `dist/assets/*.js` and `dist/assets/*.css`
returned nothing. Nothing incorrectly resolves to `/assets/`.

## 15. Built Metadata Verification

Read out of `dist/`, the served artefact — not the source:

| Field | Built value | |
| --- | --- | --- |
| `link[rel=canonical]` | `https://pongsapuk.github.io/TF696/` | ✅ exact |
| canonical element count | 1 | ✅ |
| `og:url` | `https://pongsapuk.github.io/TF696/` | ✅ exact |
| `og:image` | `https://pongsapuk.github.io/TF696/og-image.jpg` | ✅ exact |
| JSON-LD `url` | `https://pongsapuk.github.io/TF696/` | ✅ exact |
| `dist/sitemap.xml` `<loc>` | `https://pongsapuk.github.io/TF696/` | ✅ exact |
| `dist/robots.txt` `Sitemap:` | `https://pongsapuk.github.io/TF696/sitemap.xml` | ✅ exact |

Old-origin search across the entire build output:

```
grep -rn "tf696.github.io" dist/ | wc -l
-> 0
```

**Zero** active occurrences of the old production origin in anything that ships.

## 16. Content / Discord Regression

Nothing in this phase touched content, and the build confirms it.

**Discord invite** — `https://discord.gg/ptAbcyeDcf`, 4 occurrences in source,
4 in the built bundle, and no other invite URL anywhere:

```
src/   -> 4 x https://discord.gg/ptAbcyeDcf
dist/  -> 4 x https://discord.gg/ptAbcyeDcf
```

**Recruitment facts** — each verified present in the built bundle:

| Fact | Built |
| --- | --- |
| AGE `18+` | ✅ |
| ต่ำกว่า 18 ปี พิจารณาเป็นรายกรณี (under 18 case-by-case) | ✅ |
| MICROPHONE REQUIRED | ✅ |
| SKILL ASSESSMENT REQUIRED | ✅ |
| TRAINING REQUIRED | ✅ |
| MODPACK REQUIRED | ✅ |
| APEX DLC RECOMMENDED | ✅ |
| ATTENDANCE FLEXIBLE | ✅ |

**Schedule** — `FRIDAY`, `SATURDAY`, `SUNDAY` each present once in
`OPERATION_DAYS`; `20:30` and `GMT+7` each present twice (the recruitment
section's schedule block, and the footer's `FRI / SAT / SUN — 20:30 GMT+7`).

No `.jsx` component file was opened for editing in this phase. No content was
rewritten.

## 17. Cold Fragment Regression

The Phase 7A cold-fragment fix was tested functionally, not merely inspected.

`src/hooks/useInitialHashScroll.js` had **one line of its doc comment** changed
(the example URL). The executable body — the `useEffect`, the `USER_INTENT`
listener set, the `AbortController`, the `behavior: 'instant'` scroll, the
`document.fonts.ready` second application, the teardown — is byte-identical to
the version Phase 7A verified. The hook is still mounted once, from
`src/App.jsx:15`.

To confirm behaviour rather than argue from it, the build was copied to a
scratch directory, a reporting probe was appended to the copy (the real `dist/`
was not modified), the copy was served under `/TF696/`, and headless Chrome
loaded each fragment **cold** at 1440×900 with a 12 s virtual time budget:

| Cold URL | Found | `scrollY` | target `top` |
| --- | --- | --- | --- |
| `/TF696/#about` | ✅ | 688 | **80** |
| `/TF696/#operations` | ✅ | 1626 | **80** |
| `/TF696/#elements` | ✅ | 4053 | **80** |
| `/TF696/#how-we-operate` | ✅ | 5769 | **80** |
| `/TF696/#recruitment` | ✅ | 7032 | **80** |

Every anchor resolves, every one scrolls to a distinct correct offset, and in
every case the target's `getBoundingClientRect().top` settles at exactly
**80 px** — the 5rem `scroll-margin-top` that keeps a target clear of the fixed
header. That the value is identical across five different scroll positions,
after `document.fonts.ready`, is the strongest available evidence that the fix
is working as designed rather than coincidentally landing near the mark.

The hook was not modified beyond the comment. No regression was observed.

## 18. Files Changed

Seven files changed. No file was created except this report. No file was
deleted.

| File | Change |
| --- | --- |
| `index.html` | canonical, `og:url`, `og:image`, JSON-LD `url`; comment names `Pongsapuk/TF696` |
| `public/robots.txt` | 2 comment URLs, user-site prose, `Sitemap:` directive |
| `public/sitemap.xml` | the single `<loc>` |
| `README.md` | §Deployment target, robots URL, owner-or-name wording, 7A.1 pointers |
| `vite.config.js` | 2 comments only — `base` untouched |
| `.github/workflows/deploy.yml` | header comment only — no functional line |
| `src/hooks/useInitialHashScroll.js` | one doc-comment line — runtime body untouched |
| `TF696_PHASE_7A1_ORIGIN_REBIND_REPORT.md` | new — this report |

Not changed: every `.jsx` component, every stylesheet, `package.json`,
`eslint.config.js`, `scripts/*`, `public/og-image.jpg`, `public/favicon.ico`,
`public/apple-touch-icon.png`, `src/assets/optimized/**` (all 96 derivatives),
`img/**` (opened read-only), and every historical phase report.

Comment lines that overflowed the tree's ~80-column convention after the longer
origin string were reflowed. That is whitespace inside comments; no value or
statement changed.

## 19. Remaining Issues

1. **The origin root is still not controlled.** `public/robots.txt` remains
   inert for exactly the reason it was inert before, now against
   `https://pongsapuk.github.io/robots.txt`. If crawl policy ever matters, it
   has to be set by a `Pongsapuk/Pongsapuk.github.io` user-site repository, or
   by moving to a custom domain. Sitemap submission remains out-of-band.

2. **GitHub Pages must be enabled with the GitHub Actions source.** In
   `Pongsapuk/TF696` → Settings → Pages, the source has to be "GitHub Actions".
   The workflow deploys via the Pages artifact and will fail at the deploy step
   otherwise. This is a repository setting; it cannot be done from the source
   tree.

3. **Nothing has ever been served from this origin.** Every check in this report
   is local. The first deployment is still the first real test of the live URL.

4. **Google Fonts remains a first-paint dependency** (`fonts.googleapis.com`,
   `fonts.gstatic.com`). Unchanged from Phase 6 §23.11 and Phase 7A;
   `display=swap` means text still renders if they are unreachable. Self-hosting
   stays a known open option, deliberately not taken immediately before a first
   deployment.

5. **`og:image` cannot be validated until the site is live.** Unfurlers fetch
   the absolute URL, and `https://pongsapuk.github.io/TF696/og-image.jpg` will
   only resolve after the first successful deployment. The file, its 1200×630
   dimensions and its path under `/TF696/` are all verified locally.

None of these is introduced by Phase 7A.1, and none blocks the push.

## 20. GO / NO-GO for Initial Git Push

**GO.**

| Criterion | Result |
| --- | --- |
| Active production origin is now Pongsapuk | ✅ |
| Canonical correct, exactly one, no `/index.html` | ✅ |
| `og:url` correct | ✅ |
| `og:image` absolute URL correct, 1200×630 preserved | ✅ |
| JSON-LD `url` correct, other fields preserved | ✅ |
| Sitemap `<loc>` correct, single URL, no `lastmod` | ✅ |
| Robots active URLs correct, limitation stated honestly | ✅ |
| `base` remains `/TF696/` | ✅ |
| No old production origin in built output (0 occurrences) | ✅ |
| Workflow valid and repository-relative | ✅ |
| `npm run lint` passes | ✅ |
| `npm run build` passes | ✅ |
| Image optimization unchanged (0 written / 96 reused) | ✅ |
| Subpath simulation passes (96/96 assets, root 404s) | ✅ |
| Discord and recruitment content unchanged | ✅ |
| Cold fragment navigation still works (5/5 anchors) | ✅ |
| No `.git` directory exists | ✅ |
| Nothing pushed | ✅ |
| Nothing deployed | ✅ |

### Git state, as required

Verified at the start and again at the end of the phase:

```
find . -name .git (excluding node_modules)  -> no results
ls -d ../.git                               -> none
git status                                  -> fatal: not a git repository
```

`git init`, `git remote add`, `git commit`, `git push` and `gh repo clone` were
**not** run. The local project remains without `.git`. Nothing was pushed and
nothing was deployed.

**Phase 7A.1 stops here.** Git initialisation, the first commit, the push to
`Pongsapuk/TF696` and enabling Pages belong to the next phase.

### What the first deployment must confirm

Once pushed and deployed, these are the checks local work cannot do:

- `https://pongsapuk.github.io/TF696/` returns 200 and paints the hero
- `https://pongsapuk.github.io/TF696/og-image.jpg` returns 200 at 1200 × 630
- `https://pongsapuk.github.io/TF696/sitemap.xml` returns 200 and parses
- `https://pongsapuk.github.io/TF696/#recruitment` opened cold lands on the
  recruitment section
- no request in DevTools resolves to `https://pongsapuk.github.io/assets/…`
- the Discord invite in the live page still resolves to a valid invite
