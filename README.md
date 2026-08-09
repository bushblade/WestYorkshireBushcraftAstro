# WYBAstro

A faithful Gatsby→Astro rebuild of the West Yorkshire Bushcraft website.

- **Original**: `/home/will/Dropbox/webProjects/WYB-website` (Gatsby/React) and https://www.westyorkshirebushcraft.co.uk/
- **Goal**: pixel-faithful single-page Astro site (index + 404), vanilla TS only, GSAP for animations, Netlify + Netlify Forms.

## Commands

| Command    | Action                            |
| ---------- | --------------------------------- |
| `pnpm dev` | Start the dev server              |
| `pnpm build` | Build for production           |
| `pnpm preview` | Preview the built site       |
| `pnpm check` | Type-check (`astro check`)     |
| `pnpm lint` | Lint (`biome check .`)           |
| `pnpm format` | Format (`biome format --write .`) |

## Stack

- **Astro 7** with astro:assets for images
- **Vanilla TypeScript** for client interactivity (no React)
- **GSAP** (core only) for animations, respecting `prefers-reduced-motion`
- **Netlify + Netlify Forms** for hosting and the contact form
- **Biome** for linting/formatting

## Structure

```
src/
  components/     *.astro components
  data/           site.ts, treeLeft.ts, treeRight.ts
  images/         source images
  layouts/        Layout.astro
  pages/          index.astro, 404.astro
  scripts/        vanilla TS: menu, logo, switcher, form
  styles/         global.css
public/           manifest, icons, favicons
```

Content is hardcoded in components — there is no CMS.
