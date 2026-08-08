# Plan: WYBAstro — Gatsby → Astro Rebuild (with GSAP)

Status: **ready to implement**. This document is the single source of truth for the next agent. Load the GSAP skills below before writing animation code.

## 1. Goal

Recreate the "West Yorkshire Bushcraft" website as a **pixel-faithful single-page** Astro site. The original (Gatsby 2 / React / styled-components) is at `/home/will/Dropbox/webProjects/WYB-website`. The target, `/home/will/Dropbox/webProjects/WYBAstro`, is where this plan lives. Live reference: https://www.westyorkshirebushcraft.co.uk/

## 2. Locked-in decisions

- **Astro** (static output, latest stable). Scaffold in `WYBAstro/` with **pnpm**: `pnpm create astro --template minimal`. pnpm already whitelisted in `opencode.json`; do NOT scaffold with another package manager.
- **No React, no react-spring, no styled-components.** All client-side code is **vanilla TypeScript** (`<script lang="ts">` + `.ts` modules).
- **Animation: GSAP** (replaces react-spring). Core only — `gsap` package, no plugins unless genuinely needed. This project's needs are all core (tweens, stagger, matchMedia). The 5 GSAP skills in `.agents/skills/` will be loadable after opencode restart — **use them** for the animation work:
  - `gsap-core` — tweens, easing, stagger, `gsap.matchMedia()` (responsive + `prefers-reduced-motion`)
  - `gsap-performance` — transform/opacity only, avoid layout thrash, `will-change` sparingly
  - `gsap-utils`, `gsap-plugins`, `gsap-scrolltrigger` — probably NOT needed (no scroll-linked animation, no plugins). Read `gsap-core` + `gsap-performance` first.
- **Styling**: Astro-native scoped `<style>` per component + one global stylesheet. No Tailwind, no CSS-in-JS.
- **Fonts**: Google Fonts CDN link (exact URL in §6). Keep **line-awesome** package for the 3 social icons.
- **Tooling**: **Biome** (lint + format) + `@astrojs/check` for type-checking `.ts` and `<script lang="ts">`. `opencode.json` already sets the Biome formatter and the Astro docs MCP.
- **Deploy**: Netlify, same site as today, swap source. `netlify.toml` with `command = "pnpm build"`, `publish = "dist"`. Domain/DNS untouched.
- **Contact form**: keep **Netlify Forms** (`data-netlify="true"`, POST to `/`) — the static form markup must survive into the served HTML.
- **Content**: pure recreation — same copy, images, and links as the original.
- **Scope**: `index` page + `404` (client redirect to `/`).
- **Assets**: copy ALL images including unreferenced SVGs (`neil-logo.svg`, `WYB-logo-web-plain.svg`).
- **Git**: init repo in `WYBAstro`, commit incrementally. `opencode.json` also exists here — don't delete it.

## 3. Source → target reference map

| Gatsby source (in `WYB-website/`) | Astro target (in `WYBAstro/`) |
|---|---|
| `src/pages/index.js` | `src/pages/index.astro` |
| `src/pages/404.js` | `src/pages/404.astro` |
| `src/components/layout.js` | `src/layouts/Layout.astro` |
| `src/components/seo.js` | `<head>` in `Layout.astro` |
| `src/components/banner.js` | `src/components/Banner.astro` |
| `src/components/logo/index.js` + `logo/treeLeft.js` + `logo/treeRight.js` | `Logo.astro` + `src/data/treeLeft.ts`/`treeRight.ts` + `src/scripts/logo.ts` |
| `src/components/About.js` | `src/components/About.astro` |
| `src/components/ImageSwitcher.js` | `ImageSwitcher.astro` + `src/scripts/switcher.ts` |
| `src/components/Galleries.js`, `Card.js` | `Galleries.astro`, `Card.astro` |
| `src/components/Contact.js`, `Poem.js` | `Contact.astro`, `Poem.astro` |
| `src/components/Footer.js` | `Footer.astro` |
| `src/components/sideMenu/{index,Menu,MenuButton}.js` | `Menu.astro` + `src/scripts/menu.ts` |
| `src/components/contactform/{index,Button,MessageSuccess,styled}.js` | `ContactForm.astro` + `src/scripts/form.ts` |
| `src/components/styled.js` | `src/styles/global.css` + component scoped styles |
| `src/hooks/useIsMobile.js` | `src/scripts/util.ts` (matchMedia) |
| `src/images/*`, `public/icons/*`, `public/manifest.webmanifest`, `public/favicon*` | `src/images/*`, `public/` |
| `gatsby-config.js` (siteMetadata/plugins) | `astro.config.mjs`, `<head>`, `public/manifest.webmanifest` |
| `gatsby-{node,browser,ssr}.js` | n/a (all no-op files) |

## 4. Target structure

```
WYBAstro/
├─ astro.config.mjs          site: 'https://www.westyorkshirebushcraft.co.uk', output: 'static'
├─ biome.json                linter + formatter; ignore dist/, .astro/, node_modules/
├─ tsconfig.json             { "extends": "astro/tsconfigs/strict" }
├─ netlify.toml              [build] command="pnpm build" publish="dist"
├─ package.json              deps: astro, gsap, line-awesome; dev: @astrojs/check, typescript, @biomejs/biome
│                            scripts: dev/build/preview/check("astro check")/lint("biome check .")/format("biome format --write .")
├─ .gitignore                node_modules/, dist/, .astro/
├─ opencode.json             (exists — keep)
├─ PLAN.md                   (this file)
├─ public/
│  ├─ manifest.webmanifest   (see §10)
│  ├─ icons/*.png            copy from WYB-website/public/icons/
│  ├─ favicon-32x32.png      copy from WYB-website/public/
│  └─ favicon.svg            copy from WYB-website/public/
└─ src/
   ├─ styles/global.css
   ├─ data/site.ts           colours, breakpoints, links, meta
   ├─ data/treeLeft.ts       path data ported verbatim
   ├─ data/treeRight.ts      path data ported verbatim
   ├─ layouts/Layout.astro
   ├─ pages/index.astro
   ├─ pages/404.astro
   ├─ components/{Banner,Logo,About,ImageSwitcher,Galleries,Card,Contact,ContactForm,Poem,Footer,Menu}.astro
   ├─ scripts/{util,menu,logo,switcher,form}.ts
   └─ images/                copy all from WYB-website/src/images/ (incl. switcher/, SVGs)
```

## 5. Scaffolding steps

1. `cd /home/will/Dropbox/webProjects/WYBAstro`
2. `git init`
3. `pnpm create astro . --template minimal --no-git` (if it refuses the non-empty dir, scaffold to a temp subdir and move contents up; target root must stay `WYBAstro/`).
4. `pnpm add gsap line-awesome`
5. `pnpm add -D @astrojs/check typescript @biomejs/biome`
6. Write config files (`astro.config.mjs`, `biome.json`, `tsconfig.json`, `netlify.toml`, `.gitignore`) + fix `package.json` scripts.
7. Copy assets:
   - `cp -r WYB-website/src/images/* src/images/`
   - `cp -r WYB-website/public/icons public/`
   - `cp WYB-website/public/{favicon-32x32.png,favicon.svg} public/`
8. Write `public/manifest.webmanifest`.
9. Commit scaffold.

## 6. Global CSS (`src/styles/global.css`) — port `styled.js` verbatim

- `@import 'line-awesome/dist/line-awesome/css/line-awesome.css';` at top (Vite resolves from node_modules).
- CSS custom properties for the `colours` object:
  - `--kahki: #decd87`
  - `--lowOpacityKahki: rgba(222,205,135,0.5)`
  - `--green: #668000`
  - `--lowOpacityGreen: rgba(102,128,0,0.5)`
  - `--darkGrey: #363636`
  - `--lowOpacityDarkGrey: rgba(54,54,54,0.9)`
  - `--lightGrey: #666666`
  - `--lowOpacityLightGrey: rgba(102,102,102,0.9)`
  - `--lowOpacityWhite: rgba(239,239,239,0.7)`
  - `--white: rgba(239,239,239,1)`
- Breakpoint constant: `1400px` (also `1000px`, `800px`, `700px` used inline in components).
- Global: `body { font-family:'Lora',serif; margin:0; background:lightslategray; overflow-x:hidden; }`
- `h2`: `1.8rem` / `2rem`(≥700px), `font-family:'Quintessential'`, green highlight gradient `linear-gradient(180deg, transparent 81%, var(--lowOpacityGreen) 81%, var(--lowOpacityGreen) 90%, transparent 90%)`.
- `p`: `1.2rem` / `1.4rem`(≥700px).
- `a`: `color:black`, same green underline gradient, `transition: background 0.2s ease-in-out`; hover → `linear-gradient(180deg, var(--lowOpacityKahki) 81%, var(--green) 81%, var(--green) 90%, transparent 90%)`.
- `DownButton`: bordered rounded button + animated down-arrow `::before` (keyframes `btnAnimation`: rotate 45°, translate down, 2s infinite); hover `box-shadow: 0 0 0.1rem 0.3rem var(--lowOpacityGreen); background: var(--lowOpacityKahki)`.
- Scoped per-component equivalents of `Section`, `FooterSection`, `ContactContainer`, `Quote`, `TwoColumnContainer`, `Cell` — put these where they're used (see components), not all in global.css.

## 7. Layout + SEO (`src/layouts/Layout.astro`)

`<head>` reproduces the original exactly:
- `<meta charset>`, `viewport` (`width=device-width, initial-scale=1, shrink-to-fit=no`), `lang="en"` on `<html>`.
- `<title>West Yorkshire Bushcraft | West Yorkshire Bushcraft</title>` (page title = siteMetadata.title, template appends ` | West Yorkshire Bushcraft`).
- `description`: "The greatest Bushcraft Community in West Yorkshire, established 2012."
- OG: `og:title`=title, `og:description`, `og:type`=`website`; Twitter: `card`=`summary`, `creator`=`@bushblade`, `title`, `description`.
- `theme-color` `#decd87`; favicons (`/favicon-32x32.png`, `/favicon.svg`); `<link rel="manifest" href="/manifest.webmanifest" crossorigin="anonymous">`; all 8 apple-touch-icons (`/icons/icon-48x48.png` … `-512x512.png`).
- Fonts (exact string from the built original HTML):
  `<link href="https://fonts.googleapis.com/css?family=Quintessential|Source+Sans+Pro:300,400,400i,700|Lora:400i" rel="stylesheet">`
- Import `global.css` here (or in a `index.css` global style).

Body shell (from `layout.js` + `styled.js`):
- Full-viewport background = `sunrise-background01.jpg` (via astro:assets; either an absolutely-positioned `<Image>` covering, or `getImage()` URL as CSS background). `background-color: lightgray` while loading + soft opacity fade-in; outer wrapper `overflow:hidden`.
- `Container`: `display:grid; grid-template-columns: 20rem 1fr;` with `grid-template-areas:'menu main'` at `≥1400px`, else `'main main'`.
- `Main`: `scroll-snap-type:y proximity; height:100vh; overflow:auto; width:100%; grid-area:main;` click on main closes the mobile menu.
- Accept a `title` prop; children = page content via slot.

## 8. `src/pages/index.astro` (port of `pages/index.js`)

Sections use element ids for scroll targets (`#about`, `#galleries`, `#contact`); scroll via `scrollIntoView({ behavior: 'smooth' })`.
1. `<Banner>` — `<Logo/>` + `<h1>West Yorkshire Bushcraft</h1>` + `DownButton` → scrolls to `#about`.
2. `<section id="about">` bg `var(--lowOpacityWhite)` → `<About/>`.
3. `<section id="galleries">` bg `var(--lowOpacityWhite)` → `<Galleries/>`.
4. `<footer id="contact">` bg `linear-gradient(45deg, var(--lowOpacityLightGrey) 0%, var(--lowOpacityWhite) 100%)` → `<Contact/>` + `<Footer/>`.

`Section` styles: `min-height:100vh; scroll-snap-align:start; padding-top:2rem` (3rem ≥1000px; `4rem 5rem` ≥1400px). `FooterSection`: same + `position:relative`.

Nav links array: About / Galleries / Contact.

## 9. Components detail

### Banner.astro (`banner.js`)
- `height:100vh; display:flex; align-items:center; justify-content:center; scroll-snap-align:start`.
- `h1`: `font-family:'Quintessential'`, 4rem (3rem ≤800px), `text-shadow:3px 3px 10px rgba(0,0,0,0.35)`, `margin:0 0 2.5rem 0`.
- Logo wrapper centered; ≤800px scale the SVG to 50%.
- `DownButton` (from global CSS), onClick → scroll to `#about`.

### Logo.astro + `src/scripts/logo.ts` (port of `logo/index.js`)
- Embed the SVG (viewBox `0 0 63.499998 101.83744`, width 300, height 481.122, `filter: drop-shadow(1px 3px 3px rgba(0,0,0,0.3))`). Copy the `<defs>` filters **verbatim** (long, mechanical — preserve every filter id referenced below).
- Render statically: the two background shapes (`id="background-green"` fill `#668000`, `id="background-kahki"` fill `#decd87`), and the `#seed` group (all `ellipse`/`path` elements).
- Render tree paths from `src/data/treeLeft.ts` / `treeRight.ts` (ported verbatim: `{ pathLength:'100', d, id, fillOpacity?, fillRule? }`). Left group uses `filter="url(#filter5072)"`, right uses `filter="url(#filter5084)"`; both `fill="none"`, `stroke-width="0.635"`, `stroke-linecap="round"`.
- Add stable class hooks for the script: e.g. `.logo-bg`, `.logo-seed`, `.logo-tree-left path`, `.logo-tree-right path`.
- **GSAP animation** (`gsap.fromTo`, per `gsap-core` skill):
  - Tree paths: `gsap.set(paths, { strokeDasharray: 100, strokeDashoffset: 100, autoAlpha: 0 })` then `gsap.to(paths, { strokeDashoffset: 0, autoAlpha: 1, duration: 2.2, delay: 0.8, stagger: 0.18, ease: 'power2.inOut' })`.
  - Seed: `gsap.to('.logo-seed', { autoAlpha: 1, duration: 1.8, delay: 0.5 })`.
  - Backgrounds: `gsap.to('.logo-bg', { autoAlpha: 1, duration: 2.5, delay: 0.8 })`.
  - Wrap in `gsap.matchMedia()` to respect `prefers-reduced-motion` (duration 0 / skip when reduce is set) — see the `gsap-core` skill.

### About.astro (`About.js`)
- `TwoColumnContainer gap="3rem"`: 2 cols ≥1000px (areas `left right`), stacked below.
- Left `Cell withPadding`: two `<article>`s — "Established June 2012" copy and "What we do" copy, including the Facebook group link (https://www.facebook.com/groups/westyorkshirebushcraft.official/), mailto (westyorkshirebushcraftgroup@gmail.com), both `target="_blank" rel="noopener noreferrer"`.
- Right `Cell withPadding`: `<ImageSwitcher/>`. Section wrapper: `display:flex; align-items:center; height:100%`.

### ImageSwitcher.astro + `src/scripts/switcher.ts` (`ImageSwitcher.js`)
- 3 images in `src/images/switcher/`: `willbowl.jpg`, `mikehanddrill.jpg`, `stonefire.jpg`. Use astro:assets `Image` at width 800, quality 75.
- Structure: hidden spacer `<img>` (first image, `visibility:hidden`) inside the sized container to set height; then absolutely-positioned layers at `top:0; left:0; width:100%` that crossfade.
- Container: `position:relative; margin:auto; height:100%; overflow:hidden; border-radius:0.5rem;` ≥1400px `width:90%`. Images: `min-width:300px; width:100%`.
- **GSAP**: `setInterval` 4000ms advances `index` (wrap around); fade the active layer in / previous out with `gsap.to(layer, { autoAlpha: ..., duration: 3, ease: 'power2.inOut' })`. Match original behavior: only the active layer visible; the spacer keeps layout stable.

### Galleries.astro + Card.astro (`Galleries.js`, `Card.js`)
- Heading: "Members Galleries" + intro copy (with the `<br/>`).
- 2×2 grid of `<Card>` (TwoColumnContainer `images`, cells `left`/`right`):
  - Camp & Craft → https://bit.ly/2S8XB8h
  - Track & Trail → https://bit.ly/2KC5A9C
  - Flora, Fungi & Forage → https://bit.ly/358Ihh5
  - Sites & Scenery → https://bit.ly/3cPcGUd
- Card: image (width 600, alt + `title` = card title) wrapped in `<a target="_blank" rel="noopener noreferrer">`, then `<h3>title</h3>`. Card styles: white bg, `border-radius:0.2rem`, shadow `0px 0px 89px -17px rgba(0,0,0,0.5)`, hover `translate3d(0,-5px,0) scale(1.01)` + darker shadow, `transition: all 0.2s ease-in-out` (plain CSS, no GSAP).

### Contact.astro (`Contact.js`)
- Header: `<h2>Contact {mobile ? 'WYB' : 'West Yorkshire Bushcraft'}</h2>` where `mobile` = viewport < 800px (via matchMedia in `util.ts`), `<p>For questions, comments and membership enquiries please get in touch...</p>`.
- Two columns: left `<ContactForm/>`, right `<Poem/>`.

### ContactForm.astro + `src/scripts/form.ts` (`contactform/index.js`)
- Static form markup (must be present in served HTML for Netlify):
  `<form name="contact" method="post" data-netlify="true" action="/">` with hidden `<input type="hidden" name="form-name" value="contact">` and `<input type="hidden" name="Contact" value="contact">`.
- Fields, labels "Your Name:", "Your Email:", "Message:" (textarea, `maxLength="200"`).
- Field border colour: `length===0` → darkGrey; valid → `var(--lowOpacityGreen)`; invalid → `#a94442`. Focus shadows follow the same scheme. Inputs: `font-family:'Lora'`, `height:2.25em`, `background:var(--lowOpacityWhite)`, `border:0.2rem solid var(--darkGrey)`, `box-shadow: inset 0 1px 5px rgba(10,10,10,0.5)`.
- Buttons: "Send Message" (submit) + "Clear Form" (port `Button.js` styles — bordered rounded, hover glow). Submit disabled until valid.
- `form.ts`: port validation regexes — name `/\S/`, email `/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/`, message `/\S/`. On submit (when valid): `fetch('/', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: urlencoded(formData) })`; on ok → clear + show success message (port `MessageSuccess.js` markup); on error → `alert('something went horribly wrong! Your message was not sent!')`.

### Poem.astro (`Poem.js`)
- 4 paragraphs, exact text incl. `<br/>` placements, ending `6.6.19 NB <small>- member of WYB</small>`. `font-size:1.5rem; padding:1.5rem;` `small` 1rem italic; ≤1000px `margin-bottom:3rem`.

### Footer.astro (`Footer.js`)
- `©{new Date().getFullYear()} West Yorkshire Bushcraft - Website by Will Adams`.
- `position:absolute; bottom:0; height:2.5rem;` `border-top:0.3rem solid var(--lowOpacityGreen)`, bg `var(--lowOpacityKahki)`, centered.
- **Note:** year renders 2026 (dynamic); live site shows 2021 (old build). Expected.

### Menu.astro + `src/scripts/menu.ts` (sideMenu/*)
- **Desktop (≥1400px)**: static `<nav>` in grid area `menu`, `height:100vh; width:100%;` bg `linear-gradient(45deg, var(--darkGrey) 0%, var(--lightGrey) 100%)`.
- **Mobile (<1400px)**: same nav in a fixed drawer `position:fixed; top:0; left:0; height:100vh; width:50vw` (80vw ≤700px), `z-index:10`, hidden via `transform: translate3d(-100%,0,0)` when closed. The original hides the static desktop nav on mobile via the grid areas trick + outer `overflow:hidden` — replicate; if fragile, hide with a media query (visually identical).
- Nav items: About / Galleries / Contact buttons (white `'Lora'`, 2.5rem, `line-height:4rem`), onClick → scroll to section + close drawer. `:hover { transform: scale(1.05) }`.
- "Connect with WYB" `<h3>` (1.5rem, white) + social `<ul>` with line-awesome icons:
  - `<i class="lab la-facebook la-lg">` → https://www.facebook.com/groups/westyorkshirebushcraft.official
  - `<i class="lab la-youtube la-lg">` → https://www.youtube.com/channel/UCN563R-qyOcAKcLi8cH3bEA
  - `<i class="las la-envelope la-lg">` → mailto:westyorkshirebushcraftgroup@gmail.com
  - Icons white, `background:none; box-shadow:none; font-family:'Lora'`.
- **MenuButton** (`position:fixed; top:1rem; left:1.5rem; z-index:12;` 2.5rem hamburger; 3 spans morph to an X when open — port exact CSS). Hidden ≥1400px.
- `menu.ts`: `gsap.matchMedia()` for breakpoints; toggle open state; slide drawer with `gsap.to(drawer, { x: open ? '0%' : '-100%', duration: 0.3, ease: 'power2.out' })` (use `xPercent` for percentage movement — see `gsap-core`); close on main click and on nav-link click.

### 404.astro (`404.js`)
- Empty rendered page + bundled `<script lang="ts">` doing `window.location = '/'`. Keep semantics.

## 10. `public/manifest.webmanifest`

Port from the original (drop the Gatsby `cacheDigest` and `?v=` query params):
```json
{"name":"West Yorkshire bushcraft","short_name":"WYB","start_url":"/","background_color":"#decd87","theme_color":"#decd87","display":"minimal-ui","icons":[{"src":"icons/icon-48x48.png","sizes":"48x48","type":"image/png"},{"src":"icons/icon-72x72.png","sizes":"72x72","type":"image/png"},{"src":"icons/icon-96x96.png","sizes":"96x96","type":"image/png"},{"src":"icons/icon-144x144.png","sizes":"144x144","type":"image/png"},{"src":"icons/icon-192x192.png","sizes":"192x192","type":"image/png"},{"src":"icons/icon-256x256.png","sizes":"256x256","type":"image/png"},{"src":"icons/icon-384x384.png","sizes":"384x384","type":"image/png"},{"src":"icons/icon-512x512.png","sizes":"512x512","type":"image/png"}]}
```

## 11. Config files

- `astro.config.mjs`:
  ```js
  export default defineConfig({
    site: 'https://www.westyorkshirebushcraft.co.uk',
    output: 'static',
  })
  ```
- `netlify.toml`:
  ```toml
  [build]
    command = "pnpm build"
    publish = "dist"
  ```
- `tsconfig.json`: `{ "extends": "astro/tsconfigs/strict", "compilerOptions": { ... } }` (strict, include `src`).
- `biome.json`: linter + formatter enabled; `files.ignore` = `["dist", ".astro", "node_modules"]`. Use sensible defaults; keep formatting stable across agents.
- No service worker (gatsby-plugin-offline was disabled in the original — parity). No sitemap (original had none).

## 12. GSAP usage rules (from the `gsap-core` / `gsap-performance` skills)

- Use camelCase props, `autoAlpha` for fades, transform aliases (`x`, `xPercent`, `y`) — never animate `top`/`left`/`width`/`height` for movement.
- Use `stagger` for the 36 tree paths (one tween, not 36).
- Respect `prefers-reduced-motion` via `gsap.matchMedia()`.
- `will-change: transform` only on elements that actually animate (e.g. switcher layers, drawer).
- No ScrollTrigger, no plugins, no timelines required — this port only needs single tweens + stagger. If you're tempted to add ScrollTrigger for the scroll-snap sections, DON'T — the original used native `scroll-snap` + `scrollIntoView`, keep it.

## 13. Verification checklist

1. `pnpm install && pnpm check && pnpm build` clean; Biome `pnpm lint` + `pnpm format` clean.
2. `pnpm preview` vs the live site, at desktop (≥1400px: left sidebar) and mobile (<1400px: hamburger drawer). Compare: layout, colours, fonts, hover underlines, logo draw-in animation, image crossfade, scroll-snap, footer.
3. Contact form: confirm `data-netlify="true"` + hidden `form-name`/`Contact` fields survive into `dist/index.html`. Full Netlify Forms verification happens after deploy (or via `netlify dev`).
4. `dist` contains manifest, icons, favicons, optimized images (webp variants for gallery/switcher/bg).
5. Commit history: scaffold → config → styles/data → layout → components → scripts → assets/pwa → docs.

## 14. Known approximations / gotchas

- react-spring's spring curves (molasses/slow) are approximated with GSAP eases — tune by eye (e.g. try `elastic.out(1,0.5)` for a subtle settle if `power2` feels flat). Don't chase pixel-exact motion.
- Footer year is dynamic (`new Date().getFullYear()` → 2026); live build shows 2021. Expected.
- Switcher: original only server-rendered the hidden spacer; the new build renders all 3 `<img>`s — better for LCP, visually identical.
- Source Sans Pro is loaded but never used in CSS (same as the original) — keep for parity.
- The mobile menu hiding relies on the original's grid/overflow trick — if fragile, use a media query (visually identical).
- `sunrise-background01.jpg` is a fixed full-viewport bg behind everything (`background-color: lightgray` while loading, soft fade-in).
- When swapping the Netlify source repo: confirm build command/publish dir are picked up from `netlify.toml`; domain/DNS untouched.
- `opencode.json` in this dir whitelists `pnpm *` and the Astro docs MCP. Don't remove. After opencode restart, the GSAP skills become loadable — use `gsap-core` and `gsap-performance` for the animation work.

## 15. Out of scope

- No new content/features/sections, no CMS, no multi-page routes, no service worker, no test framework — QA is `astro check` + Biome + `pnpm build` + visual comparison against the live site.
