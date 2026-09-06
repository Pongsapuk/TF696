# TF696 V2 Foundation Report

## 1. Executive Summary

Phase 2A succeeded. The legacy static frontend was replaced in the confirmed
project root with a root-level Vite 8 + React 19 application using JavaScript,
Tailwind CSS 4 through its official Vite plugin, and a small ESLint setup. The
foundation includes loaded display and Thai body fonts, reusable color and font
tokens, global accessibility defaults, a responsive container component, and a
deliberately temporary app shell.

The production build, lint check, local development server, compiled Tailwind
output, and preserved-asset integrity checks all passed. No Phase 2B sections,
media selection, router, animation library, deployment, or final marketing copy
were added.

## 2. Legacy Safety / Recovery Status

- Exact legacy project root: `D:\TF696-main\TF696-main`
- External recovery snapshot: `D:\TF696-main\TF696_LEGACY_BACKUP.zip`
- Archive size: 66,101,507 bytes
- Archive readability: verified successfully with
  `System.IO.Compression.ZipFile.OpenRead`
- Archive entries: 35
- Archive contents explicitly verified:
  - `index.html`
  - `about.html`
  - `squadron.html`
  - `styles.css`
  - `script.js`
  - `README.md`
  - `img/` and its files
  - `audio/` and its files
  - `TF696_LEGACY_CODEBASE_INSPECTION.md`

Recovery was established before any destructive work. Only after the ZIP was
created, found to be non-empty, opened successfully, and checked for all
required entries were legacy frontend files replaced or removed.

The backup archive was not modified after creation. The in-project `img/`,
`audio/`, and `TF696_LEGACY_CODEBASE_INSPECTION.md` sources were retained. A
post-build SHA-256 comparison checked all 29 retained asset/document files
against their archived copies; all 29 matched and there were zero mismatches.

No Git metadata exists in the supplied workspace, so the ZIP is the confirmed
recovery source for the pre-rebuild state.

## 3. New Repository Structure

```text
TF696-main/
├── audio/                              # Preserved legacy asset bank
├── img/                                # Preserved legacy asset bank
├── src/
│   ├── components/
│   │   └── layout/
│   │       └── SiteContainer.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── TF696_LEGACY_CODEBASE_INSPECTION.md
├── TF696_V2_FOUNDATION_REPORT.md
└── vite.config.js
```

`node_modules/` and `dist/` are locally generated and ignored. No nested app,
frontend, backup, or V2 project directory was created.

## 4. Dependencies

Runtime dependencies:

| Package | Installed version | Purpose |
|---|---:|---|
| `react` | 19.2.8 | Component runtime |
| `react-dom` | 19.2.8 | Browser DOM renderer |

Development dependencies:

| Package | Installed version | Purpose |
|---|---:|---|
| `vite` | 8.2.2 | Development server and production bundler |
| `@vitejs/plugin-react` | 6.1.1 | React JSX transform and Fast Refresh |
| `tailwindcss` | 4.3.3 | Utility CSS and design-token engine |
| `@tailwindcss/vite` | 4.3.3 | Official modern Tailwind/Vite integration |
| `eslint` | 10.10.0 | JavaScript lint runner |
| `@eslint/js` | 10.0.1 | Recommended core JavaScript rules |
| `eslint-plugin-react-hooks` | 7.1.1 | React Hooks correctness rules |
| `eslint-plugin-react-refresh` | 0.5.6 | Vite Fast Refresh export rules |
| `globals` | 17.12.0 | Browser global definitions for linting |

All packages were installed from their current npm `latest` tags on
2026-09-06 and recorded exactly in `package.json` and `package-lock.json`. No
router, state library, component kit, or animation dependency was installed.

## 5. Vite Setup

The project uses a JavaScript Vite configuration at `vite.config.js` with the
React and Tailwind plugins. It is a single-page static client application and
does not use React Router.

`base: './'` produces relative built asset URLs. This allows the current single
page to work from either a repository subpath or a site root without guessing a
GitHub repository name. This is an intentionally portable Phase 2A setting,
not a deployment decision.

The Vite-generated output references `./assets/...` paths and is therefore
compatible with static hosting. No deployment configuration was created.

## 6. Tailwind Setup

Tailwind CSS 4.3.3 is connected through `@tailwindcss/vite`, the current
official Vite integration. `src/index.css` imports Tailwind with:

```css
@import "tailwindcss";
```

No legacy `tailwind.config.js` or PostCSS configuration was introduced. Theme
values are declared with Tailwind 4's CSS-first `@theme` syntax.

Tailwind functionality was verified in the production output. The compiled CSS
contains the app's generated `.bg-accent` utility along with the required
canvas, surface, accent, and typography values.

Reference: [Tailwind CSS — Installing with Vite](https://tailwindcss.com/docs/installation/using-vite)

## 7. Typography

The document loads both families from Google Fonts using a stylesheet `<link>`
and preconnect hints; the fonts are not merely named as unfulfilled CSS
families.

- `Chakra Petch`, weights 400, 500, 600, and 700, is assigned to the
  `font-display` Tailwind token for headings, labels, navigation, and buttons.
- `IBM Plex Sans Thai`, weights 400, 500, and 600, is assigned to the
  `font-body` token and is the global body default.
- Sensible narrow sans-serif, Thai sans-serif, system UI, and generic sans-serif
  fallbacks are included.

The production HTML retains the Google Fonts request, and the compiled CSS
retains both family assignments. The temporary shell uses Chakra Petch for its
display elements and IBM Plex Sans Thai for the Thai/body sample.

## 8. Design Tokens

Foundational Tailwind tokens are declared in `src/index.css`:

| Role | Token | Value |
|---|---|---|
| Background primary | `--color-canvas` | `#050505` |
| Background secondary | `--color-canvas-secondary` | `#0D0D0D` |
| Elevated surface | `--color-surface` | `#171717` |
| Primary text | `--color-primary` | `#F5F5F5` |
| Secondary text | `--color-secondary` | `#A3A3A3` |
| TF696 orange | `--color-accent` | `#E76E04` |
| Subtle border | `--color-line` | `rgba(255, 255, 255, 0.12)` |
| Display type | `--font-display` | Chakra Petch stack |
| Body type | `--font-body` | IBM Plex Sans Thai stack |

These produce normal Tailwind utilities such as `bg-canvas`, `bg-surface`,
`text-primary`, `text-secondary`, `text-accent`, `border-line`,
`font-display`, and `font-body`. A single orange value is used throughout.

## 9. Responsive Foundation

`SiteContainer` is the reusable page-width primitive. It is mobile-first and
uses:

- 20px horizontal gutters by default
- 24px gutters from the small breakpoint
- 40px gutters at large widths
- 48px gutters at extra-large widths
- 64px gutters at very large widths
- A maximum content width of 88rem / 1408px

The temporary shell scales typography and padding at standard responsive
breakpoints and has no fixed content height. The document supports viewports
down to 320px while remaining fluid across tablet, desktop, and large desktop.

## 10. Accessibility Foundation

Current accessibility measures include:

- Semantic `main`, `section`, heading, paragraph, and anchor elements
- One descriptive H1 and an `aria-labelledby` section relationship
- A keyboard-accessible skip link
- Global high-visibility orange `:focus-visible` outlines with offset
- Correct anchor semantics for the shell's in-page navigation
- Decorative content hidden with `aria-hidden`
- Sufficient foreground/background contrast within the supplied palette
- Readable body line heights and responsive display sizes
- Thai document language declaration and appropriate Thai body font
- Reduced-motion behavior that disables smooth scrolling and minimizes all
  animation/transition duration when requested
- High-contrast text selection styling

No decorative motion or interaction dependency was added.

## 11. App Shell

The app shell exists only to prove the foundation. It contains:

- A page using the primary canvas background
- A bordered elevated surface inside `SiteContainer`
- A restrained orange marker and temporary phase label
- A Chakra Petch display heading
- An IBM Plex Sans Thai sample line
- Primary and secondary text examples
- An accessible focus-state test link and skip link

The shell explicitly identifies itself as temporary. It does not implement a
Navbar, Hero, About, Operations, Elements, Recruitment, Discord CTA, gallery,
media, final copy, or Footer design.

## 12. Verification

Environment sanity:

- `node --version` → `v24.19.0`
- `npm.cmd --version` → `11.17.0`
- `npm.cmd ls --depth=0` → all declared top-level packages installed with no
  missing or extraneous dependency reported

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
✓ 17 modules transformed.
✓ built in 252ms
Exit code: 0
```

Build artifacts at verification time:

```text
dist/index.html                   0.82 kB (0.44 kB gzip)
dist/assets/index-*.css          12.66 kB (3.40 kB gzip)
dist/assets/index-*.js          192.72 kB (60.93 kB gzip)
```

Development tooling check:

- `npm.cmd run dev -- --host 127.0.0.1` started Vite 8.2.2 successfully.
- `http://127.0.0.1:5173/` returned HTTP 200 with HTML content.
- The development server was stopped after verification.

Compiled foundation checks:

- Relative production asset URLs: passed
- Tailwind utility generation: passed
- `#050505`, `#171717`, and `#E76E04` in compiled CSS: passed
- Chakra Petch and IBM Plex Sans Thai assignments in compiled CSS: passed
- Retained legacy asset/document SHA-256 comparison: 29/29 passed

## 13. GitHub Pages Considerations

The supplied tree has no Git remote, GitHub repository metadata, CNAME, custom
domain configuration, or deployment workflow. The final production repository
path and domain therefore cannot be inferred.

The provisional `base: './'` setting avoids hardcoding an unknown repository
name and produces portable relative asset paths for this single-page build.
Before deployment, confirm whether the target is a user/organization root, a
repository project page, or a custom domain. At that point the team can either
retain the relative base or set the canonical Vite base deliberately and add an
appropriate GitHub Pages workflow. Deployment is outside Phase 2A and was not
performed.

## 14. Files Changed

### CREATED

- `.gitignore`
- `package.json`
- `package-lock.json`
- `vite.config.js`
- `eslint.config.js`
- `src/main.jsx`
- `src/App.jsx`
- `src/index.css`
- `src/components/layout/SiteContainer.jsx`
- `TF696_V2_FOUNDATION_REPORT.md`
- `dist/` (generated verification output; ignored)
- `node_modules/` (installed dependencies; ignored)

### MODIFIED

- `index.html` — legacy home document replaced by the Vite entry document
- `README.md` — legacy boilerplate replaced by local setup/verification notes

### REMOVED

- `about.html`
- `squadron.html`
- `styles.css`
- `script.js`

The removed legacy frontend files and original versions of modified files remain
recoverable from `D:\TF696-main\TF696_LEGACY_BACKUP.zip`.

### PRESERVED UNCHANGED

- `TF696_LEGACY_CODEBASE_INSPECTION.md`
- `img/`
- `audio/`
- `D:\TF696-main\TF696_LEGACY_BACKUP.zip`

## 15. Unknowns / Blockers

Phase 2A has no implementation blocker. Items still requiring human
confirmation before later phases or deployment are:

1. Final GitHub Pages repository path and/or custom domain.
2. Whether external Google Fonts are acceptable under the final privacy/content
   policy or should later be self-hosted.
3. The content, brand, rights, schedule, Discord, and media questions already
   recorded in `TF696_LEGACY_CODEBASE_INSPECTION.md`.

## 16. Recommended Next Step

Phase 2B should establish the approved content model and implement the first
real single-page structural slice, beginning with confirmed brand identity,
navigation behavior, and hero/recruitment hierarchy. Before that work, confirm
the canonical logo, language strategy, current Discord invite, operation
schedule, and approved media shortlist.

Phase 2B was not executed.
