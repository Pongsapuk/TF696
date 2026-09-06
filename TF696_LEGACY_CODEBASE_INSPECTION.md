# TF696 Legacy Codebase Inspection

Inspection scope: the complete contents of `TF696-main/` as supplied. This was a read-only inspection of the legacy site. No existing website file was changed. The only added file is this report.

## 1. Executive Summary

TF696 is a small, purely static website made from three HTML pages, one shared CSS file, and one JavaScript file that is not currently loaded by any page. There is no framework, build process, package manifest, backend, database, form handler, API integration, or deployment configuration. The pages can be served directly by any static host, including GitHub Pages.

The current public structure is:

- `index.html`: home page, hero, Discord calls-to-action, and three embedded YouTube videos.
- `about.html`: group identity, play style, operation schedule, purpose, and a bilingual motto/philosophy section.
- `squadron.html`: descriptions of the Legion, Cohort, and Fortis units.

All pages copy the same header, navigation, metadata, and footer markup. Styling is shared through `styles.css`, although the home video section also contains inline styling. There are no CSS media queries, so the site is not meaningfully responsive despite having a viewport meta tag. Fixed-width video embeds, non-wrapping layouts, fixed-height unit cards, and a desktop-only navigation row are likely to overflow or become difficult to read on small screens.

The strongest preservation candidates are the Thai source copy, the operation schedule, the Discord invite, the three unit descriptions, the YouTube IDs, the current Lady Justice/reaper-style visual identity, the Legion/Cohort/Fortis banner artwork, the favicon, and selected Arma 3 screenshots. The repository also contains a large amount of currently unused media: three MP3 files, an 80-second MP4, six activity screenshots, historical logo variants, a squadron composite, social icons, and other branding artwork.

The recommended path is a fresh React + Tailwind + Vite frontend that deliberately imports reviewed content and assets. Incrementally converting the existing markup would preserve little useful architecture and would carry forward duplication and layout debt. Before implementation, a human should confirm the canonical logo, validate image/music rights, confirm whether the Discord invite and schedule are current, and decide whether the site should be Thai-first or bilingual.

Repository totals:

- 34 files, approximately 65.8 MiB total.
- 3 HTML files, 1 CSS file, 1 JavaScript file, and 1 Markdown file.
- 24 raster/icon image files, approximately 38.0 MiB.
- 1 MP4 video, approximately 17.4 MiB.
- 3 MP3 audio files, approximately 10.4 MiB.
- No local font files.
- Only about 8.2 MiB of the image directory is referenced by the current HTML/CSS; approximately 47.1 MiB of image/video content there is unreferenced.

## 2. Repository Structure

The supplied workspace contains one project directory. No Git metadata was present or accessible in the supplied tree, so commit history and tracked/untracked status could not be audited.

```text
TF696-main/
├── about.html                         5,309 B
├── index.html                         2,389 B
├── README.md                            436 B
├── script.js                            873 B
├── squadron.html                      5,601 B
├── styles.css                         6,486 B
├── audio/
│   ├── Meet you at the Graveyard.mp3  4,133,544 B
│   ├── psycho-dreams.mp3              3,867,885 B
│   └── thxsomch-hate-slowed-reverb.mp3
│                                      2,945,517 B
└── img/
    ├── 2.png                            171,389 B
    ├── 3.png                            217,372 B
    ├── 556.png                        3,864,383 B
    ├── 557.png                          136,636 B
    ├── 696HVT.png                     2,985,838 B
    ├── 696logo.jpg                        3,352 B
    ├── 696logo.png                        3,261 B
    ├── 696SQ.png                     15,489,010 B
    ├── activity1.jpg                    367,270 B
    ├── activity2.jpg                  3,242,623 B
    ├── activity3.jpg                    189,501 B
    ├── activity4.jpg                  2,809,252 B
    ├── activity5.jpg                    777,475 B
    ├── activity6.jpg                  3,504,879 B
    ├── discord.png                          980 B
    ├── facebook.png                         479 B
    ├── favicon.ico                       15,406 B
    ├── logo-2002.png                    129,788 B
    ├── logo-2010.png                    238,172 B
    ├── logo-2023.png                     96,153 B
    ├── main696.jpg                    3,504,879 B
    ├── main696.png                      106,522 B
    ├── sq887.jpg                      1,140,281 B
    ├── tf696.mp4                     18,216,187 B
    └── threelogo.jpg                    808,361 B
```

### Important files

| File | Apparent role | Notes |
|---|---|---|
| `index.html` | Home page | Hero, generic Discord CTA, and three YouTube embeds. |
| `about.html` | About page | Thai explanatory copy, schedule, purpose, motto, and branding artwork. |
| `squadron.html` | Unit page | Thai descriptions for Legion, Cohort, and Fortis. |
| `styles.css` | Shared site stylesheet | Contains all active layout, color, background-image, and animation rules. |
| `script.js` | Intended navigation/scroll enhancement | Not referenced by any HTML file and therefore inactive. It would break normal page/external navigation if loaded unchanged. |
| `README.md` | Repository documentation | Uncustomized GitHub profile README starter text; it does not document the website. |
| `img/` | Images plus one misplaced video | Contains all live visual assets and many unused assets. `tf696.mp4` is stored here rather than in a media/video directory. |
| `audio/` | Music files | All three MP3s are unused by the website. |

### Configuration and documentation

No application or deployment configuration exists. In particular, there is no `package.json`, Vite configuration, Tailwind configuration, TypeScript configuration, lint/format configuration, test configuration, GitHub Actions workflow, `CNAME`, `.nojekyll`, or `.gitignore` in the supplied project. The only documentation is the boilerplate `README.md`.

### Unused or suspicious files

- `script.js` is orphaned: no page has a `<script>` element.
- Every file in `audio/` is orphaned. The filenames appear to name commercial or third-party music and should be rights-reviewed before reuse.
- `img/tf696.mp4` is orphaned and stored in the image directory.
- `activity1.jpg` through `activity6.jpg`, `696SQ.png`, `696logo.jpg`, `discord.png`, `facebook.png`, `logo-2002.png`, `logo-2010.png`, `logo-2023.png`, `main696.jpg`, and `threelogo.jpg` are not referenced by current HTML or CSS.
- `main696.jpg` and `activity6.jpg` are exact byte-for-byte duplicates (same SHA-256 hash), despite different names.
- `696SQ.png` is unusually large for web delivery: 6912×3456 and about 14.8 MiB.
- Several `.jpg` files report internally as PNG-format data (`696logo.jpg`, `activity2.jpg`, `activity4.jpg`, `activity6.jpg`/`main696.jpg`, and `threelogo.jpg`). Extension/content mismatches can confuse optimization pipelines and MIME handling.
- Numeric filenames such as `2.png`, `3.png`, `556.png`, and `557.png` do not communicate their purpose and are easy to misuse.

## 3. Current Architecture

### Runtime model

The site is static HTML/CSS. A browser requests an HTML document, then loads `styles.css`, the favicon, CSS background images, and inline `<img>` files. The home page also loads three YouTube iframe players from YouTube. No server-side code is required.

```text
Static host / GitHub Pages-compatible origin
├── index.html
│   ├── styles.css
│   │   └── img/556.png
│   ├── img/696logo.png
│   ├── img/favicon.ico
│   ├── YouTube embed W6BBD09XSPk
│   ├── YouTube embed fhDbeObI9FA
│   └── YouTube embed mdavH_BLhLU
├── about.html
│   ├── styles.css
│   │   └── img/696HVT.png
│   ├── img/696logo.png
│   ├── img/main696.png
│   └── img/favicon.ico
└── squadron.html
    ├── styles.css
    │   ├── img/sq887.jpg
    │   ├── img/557.png       (Legion)
    │   ├── img/2.png         (Cohort)
    │   └── img/3.png         (Fortis)
    ├── img/696logo.png
    └── img/favicon.ico

Orphaned from runtime:
├── script.js
├── audio/*
└── remaining img/*
```

### Navigation

Each page has a copied header with four links: Home, About Us, Squadron, and Join discord. The first three are relative multi-page links. The fourth is the Discord invite `https://discord.gg/sNshPR2jnV`. There is no active-page indicator, mobile menu, sticky behavior, or client-side router.

The home hero includes a second CTA, “Join Us,” but it links only to `https://discord.com`, not the TF696 invite. This is inconsistent with the header and does not take a visitor directly to the community.

### Shared and duplicated code

- Header/navigation markup is copied across all three pages.
- Footer markup is copied across all three pages.
- `<title>`, meta description, stylesheet link, and favicon link are identical across all pages.
- Minor copy differences have already appeared: “About Us” versus “About US.”
- The only shared implementation layer is `styles.css`; there is no templating or component system.

### JavaScript and behavior

There is no active JavaScript. `script.js` is not included anywhere. CSS provides one entrance animation on the home hero text and CTA. YouTube iframe players supply their own remote player behavior.

### Responsive behavior

The viewport meta tag is present, and the video row uses `flex-wrap: nowrap`; most other layouts use Flexbox. However, there are no media queries or mobile-specific states. The result is desktop-first rather than responsive.

### External dependencies

- Three YouTube embed URLs are loaded on `index.html`.
- Discord is linked from all pages.
- No external CSS/JavaScript library, CDN stylesheet, web-font request, analytics service, external API, or social SDK is present.
- The CSS declares `Chakra Petch`, but no local font file, `@font-face`, or Google Fonts import loads it. Visitors normally see the generic `sans-serif` fallback unless Chakra Petch is installed locally.

### Forms and backend

There are no forms, authentication, content management system, fetch/XHR calls, cookies, storage usage, serverless functions, or backend dependencies.

## 4. Page Inventory

### PAGE: `index.html`

**Purpose:** Public landing/home page for Task Force 696.

**Sections:**

1. Shared black header with logo and navigation.
2. Hero using `img/556.png` as a full-cover background.
3. Dark “Videos” section with three side-by-side YouTube embeds.
4. Shared black footer.

**Navigation:** Home, About Us, Squadron, and Join discord. The logo also links home.

**Main content:**

- Hero statement: “Life never truly ends as long as the spirit keeps its faith.”
- Section heading: “Videos”.
- YouTube IDs: `W6BBD09XSPk`, `fhDbeObI9FA`, and `mdavH_BLhLU`.

**Calls-to-action:**

- Header: “Join discord” → `https://discord.gg/sNshPR2jnV`.
- Hero: “Join Us” → `https://discord.com` (generic and likely incorrect/incomplete).

**External links:** Discord invite, generic Discord homepage, and three YouTube embed URLs.

**Assets used:** `img/696logo.png`, `img/favicon.ico`, `img/556.png`, and the three remote YouTube players.

**JavaScript behavior:** None from the repository. The logo statement and CTA use CSS `float-up` animation. YouTube controls are handled by the iframe players.

**Notable issues:**

- No `<h1>`; the hero’s primary message is a paragraph.
- All iframe elements lack a `title`, which is an accessibility issue.
- `frameborder` is obsolete HTML.
- The three 470px-wide iframes are forced into a non-wrapping row, requiring roughly 1,450px plus container padding and causing horizontal overflow at common viewport widths.
- Video-section background and padding are inline instead of in the stylesheet.
- The generic Discord CTA conflicts with the real invite in the header.
- The hero image is a large 3.69 MiB PNG photographic screenshot, an inefficient format for this use.

### PAGE: `about.html`

**Purpose:** Explain who TF696 is, its play style, operating schedule, fictional/unit framing, and guiding philosophy.

**Sections:**

1. Shared header/navigation.
2. “About Us” image hero using `img/696HVT.png`.
3. FAQ-style two-column area with `img/main696.png` and three text entries.
4. Two-column motto and philosophy statement.
5. Shared footer.

**Navigation:** Home, About Us, Squadron, and Join discord. The logo links home.

**Main content (preserved verbatim):**

**WHO WE ARE?**

> เป็นกลุ่มที่สร้างขึ้นจากกลุ่มผู้เล่นที่ชื่นชอบ การเล่น Tactical หรือ แนวหทาร การเล่นของพวกเราจะเป็น Semi Roleplay และ เราให้อิสระผู้เล่นในการดำเนินภารกิจ ผู้เล่นสามารถตัดสินใจที่จะดำเนินภารกิจยังไงก็ได้แต่การกระทำของผู้เล่นมีผลต่อภารกิจจะมากหรือน้อยอยู่ที่การกระทำ ของผู้เล่น กลุ่มของเรา จะเน้นเล่นเป็น Tier 1 หรือ Tier 2 ของสหรัฐ

Note: “แนวหทาร” appears to be a source-text typo, likely intended as “แนวทหาร,” but it has not been corrected in this inspection.

**Operation Time?**

> กลุ่มของเราประกอบไปด้วยสมาชิกชาวไทยทั้งหมด ภารกิจจะเริ่มต้นในวันศุกร์ เสาร์ และอาทิตย์ เวลา 20:30 น. GMT+7

**Our Purpose?**

> TF696 คือ หน่วยรบพิเศษที่จัดตั้งขึ้นโดยคัดเลือกทหารจากทุกเหล่าทัพของกองทัพสหรัฐอเมริกา ซึ่งมีความสามารถเฉพาะทางในหลายด้าน โดยมีบทบาทสำคัญในการดำเนินภารกิจพิเศษต่างๆ ทั้งในและนอกประเทศ

**English motto:**

> As long as faith endures  
> the flame of hope shines  
> guiding us with courage.

**Thai philosophy statement:**

> เราปฏิบัติหน้าที่ด้วยความมุ่งมั่นและอุทิศตน พร้อมที่จะปกป้องเสรีภาพและความปลอดภัยของผู้อื่นเสมอ แม้ต้องแลกด้วยชีวิต เราก็ยินดีเสียสละเพื่ออุดมการณ์และหน้าที่อันทรงเกียรติ เรามิได้แสวงหาการยอมรับจากผู้อื่น แต่ปรารถนาเพียงการปฏิบัติหน้าที่อย่างสมบูรณ์แบบและทำให้ภารกิจสำเร็จลุล่วง ตราบใดที่จิตวิญญาณยังคงศรัทธา ดวงไฟแห่งความหวังจะยังคงส่องสว่าง ชี้นำให้เราเดินหน้าต่อไปด้วยความกล้าหาญและศรัทธาที่ไม่สั่นคลอน

**Calls-to-action:** Header “Join discord” only.

**External links:** `https://discord.gg/sNshPR2jnV`.

**Assets used:** `img/696logo.png`, `img/favicon.ico`, `img/696HVT.png`, and `img/main696.png`.

**JavaScript behavior:** None.

**Notable issues:**

- The final `.column` `<div>` is not explicitly closed before `</section>`; browsers will repair the malformed nesting, but results may vary in tooling.
- Most content is Thai, but the document declares `lang="en"`.
- “FAQ Logo” is not a meaningful image alternative.
- The FAQ layout and two-column section do not collapse for mobile.
- `#hero-about::before` creates a positioned overlay layer but supplies no color or background, so it has no visible purpose.
- The same generic title and meta description are reused from every page and do not accurately describe this page in detail.

### PAGE: `squadron.html`

**Purpose:** Introduce the TF696 unit structure.

**Sections:**

1. Shared header/navigation.
2. “Squadron” hero using the group image `img/sq887.jpg`.
3. Three large background-image unit cards: Legion, Cohort, and Fortis.
4. Shared footer.

**Navigation:** Home, About US, Squadron, and Join discord. The logo links home.

**Main content (preserved verbatim):**

**Legion**

> หน่วยนี้รวมความเชี่ยวชาญจากหลายด้าน เช่น การต่อสู้ในเวลากลางคืน, การปฏิบัติการในสภาพอากาศที่ยากลำบาก, และการโจมตีที่แม่นยำสูง พวกเขามีชื่อเสียงในการปฏิบัติภารกิจอย่างรวดเร็วและไร้ร่องรอยในทุกสภาพแวดล้อม ทั้งกลางวันและกลางคืน, ฝนตก, หิมะตก หรืออากาศร้อน พวกเขาฝึกฝนให้เชี่ยวชาญในการปฏิบัติการลับและโจมตีที่ต้องการความเงียบและแม่นยำ.

**Cohort**

> หน่วยนี้ถูกจัดตั้งขึ้นเพื่อตอบสนองความต้องการในการมีนักบินประจำทีมและทีมควบคุมการบิน ที่มีความเชี่ยวชาญในการปฏิบัติภารกิจในทุกสภาพแวดล้อม โดยเฉพาะในสถานการณ์ที่ต้องการความแม่นยำสูงในการควบคุมการโจมตีจากอากาศ พวกเขามีทักษะเฉพาะในการประสานงานและร่วมมือกับหน่วยปฏิบัติการอื่น ๆ เพื่อวางแผนและประสานการโจมตีทางอากาศ รวมถึงการให้การสนับสนุนทางอากาศและการดำเนินการภารกิจทางอากาศที่ซับซ้อน ทำให้พวกเขามีบทบาทสำคัญในการเสริมสร้างประสิทธิภาพในการปฏิบัติการทางทหาร

**Fortis**

> ถูกสร้างขึ้นมาเพื่อเป็นหน่วยครูฝึกและกองกำลังพลสำรองที่มีความเชี่ยวชาญในการฝึกทหารและเพิ่มศักยภาพของกำลังพลในทุกระดับ พวกเขามีบทบาทสำคัญในการพัฒนาทักษะและการเตรียมความพร้อมให้กับทหารทั้งในด้านการต่อสู้, การปฏิบัติการพิเศษ, และการปฏิบัติภารกิจในสภาพแวดล้อมที่หลากหลาย หน่วยนี้ยังรับผิดชอบในการเสริมสร้างกำลังพลสำรองที่สามารถปรับตัวและตอบสนองต่อสถานการณ์ที่เกิดขึ้นได้อย่างรวดเร็วและมีประสิทธิภาพ ทำให้พวกเขามีความสำคัญในการสนับสนุนภารกิจทางทหารในทุกช่วงเวลา

**Calls-to-action:** Header “Join discord” only.

**External links:** `https://discord.gg/sNshPR2jnV`.

**Assets used:** `img/696logo.png`, `img/favicon.ico`, `img/sq887.jpg`, `img/557.png` (Legion), `img/2.png` (Cohort), and `img/3.png` (Fortis).

**JavaScript behavior:** None.

**Notable issues:**

- The header logo has empty `alt` text even though the same image is labeled on other pages.
- Most content is Thai, but the document declares `lang="en"`.
- Each card has a fixed 400px height; long Thai text can overflow when the available width shrinks.
- Text is placed directly over images without a guaranteed contrast overlay.
- Mixed capitalization (`Squadron-about`, `Squadron-content`) makes naming inconsistent.
- There is no explanation of how Legion, Cohort, and Fortis relate hierarchically or operationally beyond their paragraphs.

## 5. Content Inventory

### BRAND

- Primary name: **Task Force 696**; abbreviated **TF696**.
- Current navigation graphic: `696logo.png`, a tiny 77×77 black-and-white Lady Justice/reaper-style mark.
- Larger current-style art: `main696.png`, `logo-2023.png`, and `threelogo.jpg` use an armed skeletal/Lady Justice figure, scales, a rifle, and geometric/rune-like framing.
- Historical/alternative marks: `logo-2002.png` (eagle/trident emblem), `logo-2010.png` (gas-mask/night-vision “Brutality / Kindness” patch), `696logo.jpg` (triangle-framed armed figure), and the composite `696SQ.png`.
- Home slogan: “Life never truly ends as long as the spirit keeps its faith.”
- About motto: “As long as faith endures / the flame of hope shines / guiding us with courage.”
- Thai philosophical identity statement is preserved verbatim in the About page inventory above.
- Dominant identity treatment: black/charcoal backgrounds, white type/line art, orange emphasis, military simulation imagery, and occasional green night-vision/red tactical treatments.

### ABOUT

- TF696 describes itself as a Thai group for players who enjoy tactical/military play.
- Play style is described as **Semi Roleplay**.
- Players are given freedom in how they conduct missions, with choices affecting mission outcomes.
- The group emphasizes US Tier 1 or Tier 2-style play.
- “Our Purpose?” frames TF696 as a special operations unit drawing specialists from branches of the US military for domestic and overseas special missions. This appears to be in-universe/milsim identity copy and should be clearly contextualized in a rebuild.
- The complete original Thai copy is recorded under `about.html` in Section 4.

### UNIT STRUCTURE

- **Legion:** stealthy, precise, rapid ground/special operations across night and adverse environments.
- **Cohort:** pilots/aviation-control specialists, air-strike coordination, air support, and complex air operations.
- **Fortis:** instructors and reserve force, training, readiness, and rapid reinforcement/support.
- No other named units, ranks, organizational chart, roster, or chain of command appears in the repository.
- The complete original Thai unit copy is recorded under `squadron.html` in Section 4.

### OPERATIONS

- Members are described as Thai.
- Missions are stated to start Friday, Saturday, and Sunday at **20:30 GMT+7**.
- Gameplay is tactical, military-themed, semi-roleplay, and consequential/choice-driven.
- No calendar, upcoming mission list, operation archive, mission signup, mod list, server address, TeamSpeak information, rules, or training schedule is present.

### RECRUITMENT

- The only recruitment mechanism is Discord.
- Canonical-looking invite used in all headers: `https://discord.gg/sNshPR2jnV`.
- The home hero uses the weaker/incomplete `https://discord.com` URL.
- No age requirement, required game/DLC/mods, attendance rule, application process, role openings, timezone eligibility, microphone requirement, conduct policy, or onboarding steps are present.

### MEDIA

- Three embedded YouTube videos: `W6BBD09XSPk`, `fhDbeObI9FA`, `mdavH_BLhLU`.
- One unused local MP4: `img/tf696.mp4`, 1280×720, 60 fps, H.264, approximately 1:20, about 17.4 MiB.
- Six unused Arma 3 activity screenshots plus other live/background screenshots.
- Three unused MP3 tracks; details are in Section 6.
- The repository does not provide captions, transcripts, poster frames, credits, licenses, or rights/provenance metadata for media.

### SOCIAL LINKS

- Discord invite: `https://discord.gg/sNshPR2jnV`.
- Generic Discord homepage: `https://discord.com`.
- YouTube is represented only through three embeds; no channel URL is supplied.
- `facebook.png` exists, but no Facebook URL exists.
- No Instagram, TikTok, X/Twitter, Steam, Twitch, or other social URL appears.

## 6. Asset Inventory

“Reusable” below means technically/visually plausible, subject to confirmation of ownership, current branding, privacy, and content rights.

### KEEP

| File | Type / dimensions | Current use and apparent purpose | Reuse assessment |
|---|---|---|---|
| `img/696logo.png` | PNG, 77×77, 3.2 KiB | Header logo on all pages; compact black-and-white armed Lady Justice/reaper mark. | Keep as a source reference/current nav mark. Resolution is too low for many modern displays; locate or derive a master only after rights/brand confirmation. |
| `img/main696.png` | PNG, 512×512, 104 KiB | About-page circular brand artwork; armed skeletal Lady Justice with scales/rifle and rune-like lettering. | Strong reusable brand asset. Check transparency/edge quality and canonical status. |
| `img/favicon.ico` | ICO, 48×48, 15 KiB | Favicon on all pages. | Keep, though a rebuild should verify multi-size support and add modern PNG/SVG equivalents if available. |
| `img/557.png` | PNG, 1200×300, 133 KiB | Legion card banner with Legion artwork and night-vision operation image. | Strong unit-section asset; already web-sized. |
| `img/2.png` | PNG, 1200×300, 167 KiB | Cohort card banner with helicopter/pilot imagery. | Strong unit-section asset; rename descriptively during an eventual migration. |
| `img/3.png` | PNG, 1200×300, 212 KiB | Fortis card banner with training/range imagery. | Strong unit-section asset; rename descriptively during an eventual migration. |

### POSSIBLY KEEP

| File | Type / dimensions | Current use and apparent purpose | Reuse assessment |
|---|---|---|---|
| `img/556.png` | PNG, 1920×1080, 3.69 MiB | Live home hero; Arma 3 operators standing near a base/hangar. | Composition supports a hero, but convert/optimize and review image quality/privacy. |
| `img/696HVT.png` | PNG, 1920×1080, 2.85 MiB | Live About hero; staged armed group/HVT scene. | Potential section background, but it is dark and context-specific; optimize and confirm tone. |
| `img/sq887.jpg` | JPEG, 1010×1080, 1.09 MiB | Live Squadron hero; group portrait in a snowy environment. | Useful group image, but portrait-like aspect ratio is awkward for a wide cover and causes heavy cropping. |
| `img/696SQ.png` | PNG, 6912×3456, 14.77 MiB | Unused composite: group photo, central current-style logo, and Legion/Cohort/Fortis marks. | Valuable identity/reference image but far too large for direct web use; may be redundant if unit banners are presented separately. |
| `img/activity1.jpg` | JPEG, 1920×1080, 359 KiB | Unused training/shoot-house scene. | Good gallery/training candidate; includes visible in-game subtitle text. |
| `img/activity2.jpg` | PNG data with `.jpg` name, 1920×1080, 3.09 MiB | Unused red-lit transport/interior squad scene. | Atmospheric gallery/background candidate; fix format/extension and optimize. |
| `img/activity3.jpg` | JPEG, 1920×1080, 185 KiB | Unused dark night-operation squad by crates. | Strong operation-gallery candidate, though very dark. |
| `img/activity4.jpg` | PNG data with `.jpg` name, 1920×1080, 2.68 MiB | Unused night-vision group aiming in snow. | Strong tactical/gallery candidate; contains visible player labels. |
| `img/activity5.jpg` | JPEG, 1920×1080, 759 KiB | Unused daytime group/vehicle scene. | Gallery candidate; contains visible player labels and less polished staging. |
| `img/activity6.jpg` | PNG data with `.jpg` name, 1920×1080, 3.34 MiB | Unused stylized group portrait with censored faces and TF696 patch. | Strong team/gallery visual if the duplicated file is consolidated later. |
| `img/logo-2023.png` | PNG, 512×512, 94 KiB | Unused circular 2023/current-style armed Lady Justice mark. | Likely the most useful larger logo variant; human confirmation required. |
| `img/threelogo.jpg` | PNG data with `.jpg` name, 3508×2480, 789 KiB | Unused large black field with triangle-framed armed Lady Justice art. | Possible hero/brand source, but large empty canvas and format mismatch need cleanup in a future project. |
| `img/tf696.mp4` | MP4/H.264, 1280×720, 60 fps, ~1:20, 17.4 MiB | Unused local TF696 video; content could not be inferred reliably from static metadata alone. | Review manually for a trailer/media section; compress, caption, provide poster art, and confirm ownership before publishing. |
| Three YouTube embeds | Remote iframe video | Live on Home. | Preserve IDs pending availability, ownership, relevance, titles, and privacy-enhanced embed review. |

### LIKELY UNUSED

| File | Type / dimensions | Current use and apparent purpose | Reuse assessment |
|---|---|---|---|
| `img/main696.jpg` | PNG data with `.jpg` name, 1920×1080, 3.34 MiB | Unused; exact duplicate of `activity6.jpg`. | Do not carry both copies into a rebuild; decide which canonical name survives later. |
| `img/696logo.jpg` | PNG data with `.jpg` name, 77×77, 3.3 KiB | Unused tiny triangle-framed logo variant; visually different from `696logo.png`. | Too small for general reuse; retain only as brand-history reference unless a master exists. |
| `img/discord.png` | PNG, 32×32, 980 B | Unused Discord icon. | Technically usable but tiny; a rebuild should use an accessible, licensed current icon asset. |
| `img/facebook.png` | PNG, 32×32, 479 B | Unused Facebook icon with no corresponding URL. | Discard from the new build unless a verified Facebook presence is supplied. |
| `audio/Meet you at the Graveyard.mp3` | MP3, ~2:52, 192 kbps, 3.94 MiB | Unused music file. | Likely discard from web delivery unless ownership/licensing and a clear UX need are confirmed. |
| `audio/psycho-dreams.mp3` | MP3, ~4:07, 124 kbps, 3.69 MiB | Unused music file. | Likely discard from web delivery unless ownership/licensing and a clear UX need are confirmed. |
| `audio/thxsomch-hate-slowed-reverb.mp3` | MP3, ~3:08, 124 kbps, 2.81 MiB | Unused music file. | Likely discard from web delivery unless ownership/licensing and a clear UX need are confirmed. |

### UNKNOWN / HISTORICAL

| File | Type / dimensions | Apparent purpose | Reuse assessment |
|---|---|---|---|
| `img/logo-2002.png` | PNG, 512×512, 127 KiB | Historical-looking white circular eagle/trident “Task Force 696” emblem. | Preserve in an archive/history context only if “2002” is a real brand era and the mark is owned. |
| `img/logo-2010.png` | PNG, 512×512, 233 KiB | Historical-looking gas-mask/night-vision patch reading “Task Force / Brutality / Kindness / 696.” | Human decision: potentially dated/off-tone; preserve only for documented history if authentic. |

### Duplicate and variant summary

- Exact duplicate: `main696.jpg` = `activity6.jpg`.
- Similar current-brand family, not exact duplicates: `696logo.png`, `696logo.jpg`, `main696.png`, `logo-2023.png`, and `threelogo.jpg`.
- Historical/logo alternatives: `logo-2002.png` and `logo-2010.png`.
- Unit identity assets: `557.png`/Legion, `2.png`/Cohort, `3.png`/Fortis, combined again in `696SQ.png`.
- Best operation-photo candidates: `activity1.jpg`, `activity3.jpg`, `activity4.jpg`, and `activity6.jpg`, subject to human review.
- Best existing background candidates: `556.png`, `696HVT.png`, `sq887.jpg`, and potentially `threelogo.jpg`.

## 7. CSS / Design Audit

### Global styles

- `body` removes the default margin, sets `font-family: 'Chakra Petch', sans-serif`, and uses `#131313` as the default text color.
- There is no box-sizing reset, image responsiveness rule, heading scale, reusable container width, focus style, reduced-motion handling, or design-token/custom-property layer.
- `Chakra Petch` is declared but never loaded, so the intended typography is not reliably present.

### Layout system

- Layout is plain Flexbox with page-specific selectors.
- Header uses `justify-content: space-between` and a horizontal nav list.
- About FAQ uses a two-column flex container capped at 1200px.
- About philosophy is another two-column flex row.
- Squadron cards are a vertical flex stack, with each card internally centered.
- The video section centers a row of fixed-size iframes and explicitly prevents wrapping.
- There is no grid system, shared page-width primitive, spacing scale, or breakpoint strategy.

### Colors

Core palette found in CSS:

| Role | Value |
|---|---|
| Header | `#020202` |
| Footer | `#060606` |
| Main dark surfaces | `#191919`, `#212121`, `#333333` |
| Primary text | `#ffffff`, `#dddddd`, `#e0e0e0` |
| Accent / hover / headings / borders | `#e76e04` and `#ffa500` |
| Button | `#222121`; hover `#191919` |
| Body default text | `#131313` |

The black/charcoal + white + orange identity is consistent enough to preserve as a brand direction. The accent is implemented inconsistently as both `#e76e04` and `#ffa500`.

### Typography

- Intended family: Chakra Petch, then generic sans-serif.
- Headings and major labels use uppercase transformations and letter spacing in places.
- Sizes are mostly relative `em` values; the unit copy is `1.2em` with 1.8 line height.
- No local fonts or font-loading code exists.
- Long Thai copy is centered in cards, which is less comfortable to scan than left-aligned body text.

### Navigation

- Black header, white links, orange hover.
- No logo sizing rule; the 77×77 intrinsic size determines header height.
- No current-page state, keyboard-visible focus style, mobile menu, wrapping behavior, or sticky header.

### Hero sections

- Home hero: `556.png`, center/cover, `190px 50px` padding.
- About hero: `696HVT.png`, center/cover, `180px 50px` padding.
- Squadron hero: `sq887.jpg`, center/cover, `200px 50px` padding.
- Height is indirectly created by large padding rather than a controlled `min-height` and content alignment.
- About defines a pseudo-element intended as an overlay, but it has no visible fill.
- None of the heroes guarantees contrast between text and variable image regions.

### Cards, sections, and buttons

- FAQ: dark background, centered orange headings, white paragraphs, circular 300px logo.
- Squadron: dark panels, 3px orange border, 8px radius, background image, and fixed 400px height.
- Home button: dark gray with white text, 5px radius, subtle darker hover.
- YouTube iframes: fixed 470×260, 10px radius, and drop shadow.
- There is no shared `.btn` base beyond the hero-specific selector, no disabled/loading states, and no reusable card primitive.

### Animations

- `@keyframes float-up` transitions opacity from 0 and vertical offset from 20px to the final state.
- Applied only to the home hero paragraph and CTA, with 0.4s/0.6s delays.
- There is no `prefers-reduced-motion` alternative.

### Breakpoints and responsive implementation

- There are **zero media queries**.
- Header/nav, FAQ columns, two-column philosophy, and video row do not adapt structurally.
- Fixed iframe width and `nowrap` are the most immediate overflow risk.
- Fixed 400px card heights can clip/overflow long text on narrow screens or when users enlarge text.
- Hero horizontal padding of 50px and `.info-section` padding of 50px consume substantial small-screen width.

### Repetition and technical debt

- `.faq-logo img` is declared twice; the first `width: 150px` is overridden later by `width: 300px`.
- Colors, padding values, and font sizes are hardcoded repeatedly.
- Comments contain implementation notes rather than documenting intent.
- Mixed ID capitalization (`#Squadron-about`) and generic numeric IDs (`#item1`) reduce clarity.
- `#video-section div` is overbroad and affects every descendant `div` in the section.
- Inline presentation styles remain in `index.html`.
- Several rules target elements that do not exist in the current markup, such as `#hero-about .hero-content p`, `#Squadron-about p`, and `.info-image img`.
- There are no styles for the intended `#scrollTopBtn` from `script.js`.

### Design values worth preserving

- Near-black backgrounds and restrained charcoal surface hierarchy.
- White line-art branding.
- Orange as a sparing action/emphasis color.
- Immersive Arma 3 operational imagery.
- Distinct visual treatments for Legion, Cohort, and Fortis.
- The Lady Justice/scales/rifle motif, if confirmed as the current canonical logo.

## 8. JavaScript Audit

Only one JavaScript file exists: `script.js` (873 bytes). It is minimal and currently unused.

### Intended behavior

1. Select every `nav ul li a` link.
2. Prevent its normal click behavior.
3. Treat the link’s `href` as a CSS selector and smooth-scroll to the matching element.
4. Create a button with ID `scrollTopBtn` and an upward arrow.
5. Append the button to `<body>`.
6. Show it after `window.scrollY > 300`, hide it otherwise.
7. Smooth-scroll to the top when clicked.

### DOM manipulation and event listeners

- One click listener is registered for every navigation anchor.
- One scroll listener is registered on `window`.
- One click listener is registered on the generated button.
- One new DOM element is created and appended.

### Important defects

- No HTML page loads `script.js`, so none of the code runs.
- The navigation links point to documents (`index.html`, `about.html`, `squadron.html`) or an external URL, not fragment IDs. Treating these values as selectors either finds nothing or throws a selector error; then `targetElement.scrollIntoView` can fail. If the script were added unchanged, it would prevent working navigation.
- The generated button has no CSS in `styles.css`.
- Its initial display is not explicitly hidden; it could appear immediately until the first scroll event.
- The arrow in the supplied file is a normal Unicode up-arrow when decoded as UTF-8; environments using the wrong encoding may display mojibake.

### External services and media behavior

The script makes no network request and uses no external service/library. It does not control YouTube, audio, or the local MP4.

### React equivalents

- Do not port the broken link interception. React Router is not required if the rebuild remains a multi-page/static-anchor site; if routing is introduced, use routing-aware links.
- A scroll-to-top control can become an accessible component or hook only if UX testing justifies it.
- The hero entrance can remain CSS-driven; a React-specific animation dependency is unnecessary.
- If in-page smooth scrolling is desired, restrict it to validated `#fragment` links and respect reduced-motion preferences.

## 9. Legacy Issues

### ARCHITECTURE

- Shared header, footer, and head metadata are duplicated in three documents.
- No component/template/content layer exists.
- One orphaned script gives a misleading impression of active behavior.
- Content and presentation are tightly coupled in page markup and CSS selectors.
- Media organization is inconsistent (`tf696.mp4` under `img/`).
- No build, lint, validation, test, or deployment configuration exists.

### DESIGN

- Desktop-only layouts and fixed dimensions dominate.
- Typography is unreliable because the declared font is not loaded.
- Image/text contrast depends on each background image.
- Accent colors and naming conventions are inconsistent.
- Long Thai paragraphs are placed in centered, fixed-height image cards.
- Logo variants do not have a documented canonical hierarchy.

### UX

- The most prominent home CTA leads to the generic Discord homepage rather than the invite.
- No active navigation state or mobile navigation exists.
- Recruitment lacks requirements, process, expectations, and contact alternatives.
- The Squadron page explains roles but not their relationship or how a recruit chooses one.
- The video section has no titles/context around the embedded media.
- No loading/error fallback is provided for remote video embeds.

### RESPONSIVE

- No media queries.
- Three videos require a very wide viewport and can overflow horizontally.
- Header links may overflow or become cramped.
- About layouts do not stack.
- Fixed-height unit cards risk text overflow.
- Large fixed section padding wastes narrow-screen space.

### ACCESSIBILITY

- The home page has no `<h1>`.
- YouTube iframes lack accessible titles.
- Squadron’s linked logo has empty alt text; About’s “FAQ Logo” alt is vague.
- No visible keyboard focus styling is defined.
- Background images carrying unit identity have no text alternatives as images, though unit names/copy partly compensate.
- Text contrast over image backgrounds is not guaranteed.
- Documents containing primarily Thai text declare English language.
- No reduced-motion preference is honored.
- The dormant scroll-to-top button has no accessible label beyond an arrow.

### PERFORMANCE

- The project ships or stores many unreferenced large assets.
- The live home and About backgrounds are multi-megabyte PNGs despite photographic content.
- `696SQ.png` alone is about 14.8 MiB.
- No responsive images, `srcset`, lazy loading, WebP/AVIF variants, width/height attributes, preload strategy, or cache configuration is present.
- Three YouTube iframes load eagerly and can add substantial third-party page weight/tracking.
- The unused local MP4 and audio would be costly if accidentally included in a future bundle without review.

### SEO

- All pages use the same title and meta description.
- Page descriptions are generic and mention “national security,” which may mischaracterize a gaming/milsim community.
- Home lacks an H1.
- No canonical URL, Open Graph/Twitter metadata, structured data, sitemap, robots file, or social preview image is present.
- Thai-heavy pages are labeled as English.
- Embedded videos lack surrounding descriptive titles/text.

### MAINTAINABILITY

- Repeated HTML can drift, as seen in “About Us”/“About US” and alt-text differences.
- CSS contains duplicate, unused, and overbroad selectors.
- Numeric/nonsemantic asset names obscure ownership and purpose.
- Inline CSS mixes concerns.
- No README documentation explains local use, content ownership, deployment, or asset provenance.
- No automated checks protect HTML validity, accessibility, links, or layout.

## 10. React Component Candidates

The following candidates are based on repeated or distinct structures actually present in the legacy repository:

```text
App / Router or static page shell
├── SiteHeader
│   ├── BrandLogo
│   ├── DesktopNavigation
│   └── MobileNavigation
├── PageHero
├── HomePage
│   ├── HomeHeroContent
│   ├── DiscordCTA
│   └── VideoGallery
│       └── VideoEmbed × 3
├── AboutPage
│   ├── AboutIntro / FAQList
│   │   └── FAQItem × 3
│   └── PhilosophySection
├── SquadronPage
│   └── UnitList
│       └── UnitCard × 3
├── Optional MediaGallery
│   └── MediaCard
└── SiteFooter
```

Suggested data/content modules, separate from components:

- `siteNavigation`: Home, About, Squadron, Discord.
- `brandContent`: name, slogans, canonical logo, colors.
- `aboutContent`: Thai source paragraphs and approved translations.
- `operationSchedule`: days, time, timezone.
- `units`: name, description, image, ordering for Legion/Cohort/Fortis.
- `videos`: YouTube ID, title, caption, poster/thumbnail, accessibility label.
- `socialLinks`: verified Discord, Facebook/YouTube if supplied.

What each component replaces:

| Candidate | Legacy source | Why componentize |
|---|---|---|
| `SiteHeader` | Copied header in all pages | One navigation/brand source, consistent accessibility and mobile behavior. |
| `PageHero` | `#hero`, `#hero-about`, `#Squadron-about` | Shared responsive image treatment with per-page content and overlay. |
| `DiscordCTA` | Header link and home `.btn` | Prevent URL drift; one verified invite and reusable CTA semantics. |
| `VideoGallery` / `VideoEmbed` | Three hardcoded iframes | Responsive aspect ratios, lazy loading, titles, captions, and privacy options. |
| `FAQList` / `FAQItem` | Three repeated `.faq-item` blocks | Data-driven content and better semantic naming. |
| `PhilosophySection` | `.two-column-section` | Responsive bilingual/motto layout. |
| `UnitList` / `UnitCard` | Three `.info-item` blocks | Data-driven units, consistent accessible imagery, flexible height. |
| `SiteFooter` | Copied footer | One copyright/links implementation. |
| `ScrollToTop` (optional) | Dormant `script.js` logic | Safe React lifecycle and accessible control, only if genuinely needed. |

## 11. Migration / Rebuild Assessment

### A. Incrementally migrate the current website

| Dimension | Assessment |
|---|---|
| Complexity | Superficially low because there are only three pages, but each page must be decomposed while legacy CSS remains globally coupled. |
| Risk | Higher risk of carrying forward fixed layouts, duplicate concepts, generic selectors, and inconsistent links/metadata. |
| Maintainability | Improves gradually, but a hybrid period creates two mental models and makes global CSS conflicts likely. |
| Development speed | Quick for an initial wrapper, slower once responsive redesign and content extraction begin. |
| Redesign ability | Constrained by inherited markup and CSS until most of the site has effectively been rewritten. |
| GitHub Pages | Compatible, but SPA routing needs deliberate configuration; incremental conversion does not avoid that decision. |

### B. Fresh React + Tailwind frontend using selected legacy content/assets

| Dimension | Assessment |
|---|---|
| Complexity | Low-to-moderate because the site has only three content areas and no backend behavior to replicate. |
| Risk | Lower architectural risk; main risks shift to content completeness, asset rights, URL/schedule freshness, and deployment base paths. |
| Maintainability | Strong: components, centralized content data, explicit responsive states, and consistent tokens can be established from the start. |
| Development speed | Likely faster overall; no meaningful legacy JavaScript or complex interaction requires compatibility work. |
| Redesign ability | High; source copy and selected imagery can be retained without inheriting layout constraints. |
| GitHub Pages | Strong fit with a Vite static build. Use the correct Vite `base`, relative asset handling, and either hash/static routing or a suitable 404 strategy if client-side routes are used. |

### Recommendation

Choose **B: a fresh React + Tailwind + Vite frontend**, reusing approved content and assets. The legacy implementation is too small and too presentation-coupled to justify an incremental migration. Its value is predominantly editorial and visual, not architectural.

The rebuild should initially preserve the same information architecture—Home, About, Squadron, Discord—unless stakeholders approve a broader content plan. Static generation/single-page sections may be simpler than client-side routing for only three pages, but that choice should be made during implementation planning rather than assumed here.

## 12. Preserve / Rewrite / Discard Matrix

| Material | Classification | Rationale / action before rebuild |
|---|---|---|
| Name “Task Force 696” / “TF696” | PRESERVE AS-IS | Core identity. |
| Thai About copy | PRESERVE CONTENT / REDESIGN UI | Primary source content; copyedit only with owner approval. |
| Friday–Sunday, 20:30 GMT+7 schedule | NEEDS HUMAN DECISION | Preserve only after confirming it is current. |
| Legion/Cohort/Fortis names and descriptions | PRESERVE CONTENT / REDESIGN UI | Core unit information; retain full source copy. |
| Home and About slogans | PRESERVE CONTENT / REDESIGN UI | Similar but not identical phrases; decide whether both are intentional. |
| Discord invite `sNshPR2jnV` | NEEDS HUMAN DECISION | Appears canonical, but validate before launch and centralize it. |
| Generic `https://discord.com` CTA | DISCARD | Does not perform the intended recruitment action. |
| Three YouTube IDs | NEEDS HUMAN DECISION | Confirm availability, ownership, titles, relevance, and preferred order. |
| Existing header/footer HTML | REIMPLEMENT | Repeated markup should become shared components. |
| Existing page layouts | REIMPLEMENT | Recreate responsively with accessible semantics rather than porting selectors. |
| `styles.css` | PRESERVE CONTENT / REDESIGN UI | Preserve palette/identity observations, not the stylesheet itself. |
| `script.js` smooth-scroll logic | DISCARD | Inactive and incompatible with the current navigation URLs. |
| Scroll-to-top concept | NEEDS HUMAN DECISION | Reimplement accessibly only if page length/use testing warrants it. |
| `696logo.png`, `main696.png`, `logo-2023.png` | NEEDS HUMAN DECISION | Confirm canonical current mark and locate a high-resolution/vector master. |
| `favicon.ico` | PRESERVE AS-IS | Useful immediately; later supplement with modern formats/sizes. |
| Legion/Cohort/Fortis banners | PRESERVE AS-IS | Distinct, compact, already used; optimize/naming can occur during implementation. |
| Live hero images | PRESERVE CONTENT / REDESIGN UI | Re-crop and optimize; confirm tone and rights. |
| Activity screenshots | NEEDS HUMAN DECISION | Select the best few; review labels, privacy, visual quality, and rights. |
| `696SQ.png` | NEEDS HUMAN DECISION | Strong composite but oversized and potentially redundant. |
| `main696.jpg` duplicate | DISCARD | Exact duplicate of `activity6.jpg`; do not migrate both. |
| Historical logos | NEEDS HUMAN DECISION | Keep only if an authentic history/legacy story is desired. |
| Discord/Facebook 32px icons | DISCARD | Tiny, unused; no Facebook URL exists. Replace only when verified links are known. |
| Local MP4 | NEEDS HUMAN DECISION | Review content, rights, captions, and compression before choosing. |
| All three MP3 files | LIKELY DISCARD | Unused; music rights and autoplay/accessibility concerns outweigh unproven value. |
| Boilerplate `README.md` content | DISCARD | Replace with real project documentation in the future rebuild. |
| Repeated metadata | REIMPLEMENT | Supply unique titles/descriptions, correct language metadata, and social metadata. |

## 13. Unknowns / Questions

1. Which mark is the canonical current logo: `696logo.png`, `main696.png`, `logo-2023.png`, the triangle variant, or another master not in the repository?
2. Are “2002,” “2010,” and “2023” true logo eras/years, or simply filenames?
3. Is `https://discord.gg/sNshPR2jnV` still valid and intended to be public?
4. Is the Friday–Sunday 20:30 GMT+7 schedule still current?
5. Should the new site be Thai-first, bilingual Thai/English, or localized with a language switcher?
6. Should the “Our Purpose?” copy be explicitly framed as fictional/in-universe Arma 3 milsim lore to avoid being read as a real-world military claim?
7. What are the titles, owners, and desired order of YouTube videos `W6BBD09XSPk`, `fhDbeObI9FA`, and `mdavH_BLhLU`?
8. What is shown in `tf696.mp4`, and does it add value beyond the YouTube embeds?
9. Does TF696 own or have permission to publish every screenshot, logo, video, and audio track?
10. May visible in-game player names/labels in screenshots be published, or should they be cropped/obscured?
11. Is there a real TF696 Facebook page or YouTube channel to pair with the existing icon/embed content?
12. Are there missing recruitment requirements, modpack/server details, rules, application steps, or leadership contacts that the new site should include?
13. Are Legion, Cohort, and Fortis peers, sub-units, or stages in a member progression? Is an organization chart needed?
14. Should the local operation screenshots become a gallery, hero rotation, or remain archival?
15. Is GitHub Pages intended to publish at a user/org root or under a repository subpath? This determines the Vite `base` and routing approach.
16. Is a custom domain required? No `CNAME` or domain documentation exists.
17. Is the typo-like source phrase “แนวหทาร” intended to be corrected to “แนวทหาร”?
18. Should the two similar English slogans be standardized or intentionally retained as separate statements?

## 14. Recommended Next Step

Run a short content/brand confirmation pass before any implementation:

1. Select the canonical logo and confirm the black/white/orange palette.
2. Confirm the Discord invite, operation schedule, unit hierarchy, language strategy, and exact recruitment requirements.
3. Review the three YouTube videos, local MP4, screenshots, and MP3 files for ownership, privacy, relevance, and publication rights.
4. Approve a keep-list of media and identify higher-resolution/vector logo masters if available.
5. Freeze the approved Thai source copy and decide whether copyediting/translation will be a separate reviewed step.
6. Only then define the new site map and component/content model for a fresh Vite + React + Tailwind build configured for the intended GitHub Pages URL.

No migration or website modification should begin until those human decisions are recorded.
