# TF696 V2

Frontend foundation for the TF696 public recruitment and showcase website.

## Local development

```sh
npm install
npm run dev
```

## Verification

```sh
npm run lint
npm run build
```

## Images

`img/` is the archival asset bank and is never written to. The responsive
AVIF/WebP derivatives the site actually ships live in `src/assets/optimized/`
and are committed, so a plain `npm install && npm run build` needs no image
tooling. Regenerate them only after changing a master or a setting in
`scripts/optimize-images.mjs`:

```sh
npm run optimize:images            # rebuild anything missing or stale
npm run optimize:images -- --force # rebuild everything
```

Sharp is a devDependency used only by that script; it is not part of the
runtime bundle.

## Deployment

The site is published as a GitHub Pages **project** page for
`Pongsapuk/TF696` and is served at:

```
https://pongsapuk.github.io/TF696/
```

That path is the reason `vite.config.js` sets `base: '/TF696/'`, and it is the
value used by the canonical link, `og:url`, `og:image`, `public/sitemap.xml`
and the JSON-LD in `index.html`. Changing the repository owner or name, or
moving to a custom domain, means changing all of them together.

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.
It runs only `npm ci`, `npm run lint` and `npm run build` — every derived image
below is committed, so no image tooling runs during a deployment.

One honest limitation of a project page: `public/robots.txt` publishes at
`https://pongsapuk.github.io/TF696/robots.txt`, but crawlers only read
robots.txt from the origin root, which this repository does not control. The
file and its `Sitemap:` directive are therefore inert in practice.
`public/sitemap.xml` is still served, and can be submitted directly. See
`TF696_PHASE_7A_PRODUCTION_WIRING_REPORT.md` §8 and
`TF696_PHASE_7A1_ORIGIN_REBIND_REPORT.md` §9.

## Browser identity

`public/` holds the favicon, the iOS home-screen icon, the social preview
image, `robots.txt` and `sitemap.xml`. Vite copies it to the root of `dist/`
and rewrites the `<link>` hrefs in `index.html` to match `base`, so the icons
resolve at the deployed subpath.

The icons are derived from the canonical logo `img/696_Circle.png` — the master
is opened read-only and never written to. Regenerate them only if that master
changes:

```sh
npm run favicon:generate
```

The legacy `img/favicon.ico` is deliberately not wired up: it carries an older
mark and its light values are crushed nearly to black, so it renders as a dark
disc in a tab. It is left in the asset bank untouched.

## Social preview

`public/og-image.jpg` is the 1200 x 630 Open Graph card, cropped from the hero
master `img/main6962.jpg` — same read-only rule, same deterministic output.
Regenerate it only if that master or the crop changes:

```sh
npm run og:generate
```

`index.html` references it by absolute URL, because unfurlers do not resolve
relative ones.

Phase 2A implementation details and deployment considerations are recorded in
`TF696_V2_FOUNDATION_REPORT.md`. The media and performance pass is recorded in
`TF696_PHASE_5_MEDIA_PERFORMANCE_REPORT.md`, the SEO, accessibility and
content QA pass in `TF696_PHASE_6_SEO_ACCESSIBILITY_QA_REPORT.md`, the
production wiring in `TF696_PHASE_7A_PRODUCTION_WIRING_REPORT.md`, and the
rebind of the production origin onto `Pongsapuk/TF696` in
`TF696_PHASE_7A1_ORIGIN_REBIND_REPORT.md`.
