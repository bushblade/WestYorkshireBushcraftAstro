# AGENTS.md

Guidance for AI agents working in this repo. This is a faithful Gatsby→Astro rebuild of the West Yorkshire Bushcraft website.

## Project

- **Current state**: implemented. The authoritative reference for the original is the live site (below).
- **Source of truth for the original**: the live site https://www.westyorkshirebushcraft.co.uk/
- **Goal**: pixel-faithful single-page Astro site (index + 404), vanilla TS only, GSAP for animations, Netlify + Netlify Forms.

## Commands

- Install: `pnpm install`
- Dev server: `pnpm dev`
- Build: `pnpm build`
- Preview built site: `pnpm preview`
- Type-check: `pnpm check` (`astro check`)
- Lint: `pnpm lint` (`biome check .`)
- Format: `pnpm format` (`biome format --write .`)

Always run `pnpm check` and `pnpm lint` after making changes. Biome is the only formatter — never hand-format around it.

## Conventions

- **Package manager**: pnpm only. Lockfile is `pnpm-lock.yaml`.
- **No React, no react-spring, no styled-components.** Client interactivity is vanilla TypeScript in `<script lang="ts">` blocks and `.ts` modules under `src/scripts/`.
- **Animations use GSAP** (core only, no plugins). Load the `gsap-core` and `gsap-performance` skills before writing animations. Respect `prefers-reduced-motion` via `gsap.matchMedia()`.
- **Styling**: Astro-native scoped `<style>` per component plus `src/styles/global.css`. Shared values (colours, breakpoints) live in `src/styles/global.css` as CSS custom properties. No Tailwind.
- **Content is hardcoded** in components — there is no CMS. Port copy/links verbatim from the original.
- **Netlify Forms**: the contact `<form>` must be static HTML in the served output (`data-netlify="true"` + hidden `form-name` field). Never make it client-only.
- **Images**: use astro:assets (`Image` / `getImage`); originals live in `src/images/`.
- **Scope**: single page + 404 that redirects home. Don't add routes, sections, CMS, or a service worker.

## Structure

```
src/
  components/     *.astro components (Banner, Logo, Menu, Galleries, ...)
  data/           site.ts (links/meta), treeLeft.ts, treeRight.ts
  images/         source images (copied from original repo)
  layouts/        Layout.astro (head/SEO + page shell)
  pages/          index.astro, 404.astro
  scripts/        vanilla TS: menu, logo, switcher, form
  styles/         global.css
public/           manifest.webmanifest, icons/, favicons
```

## Files to leave alone

- `opencode.json` — local opencode config (permissions, Biome formatter, Astro docs MCP).
- `.agents/skills/` — GSAP skills (gsap-core, gsap-performance, gsap-plugins, gsap-scrolltrigger, gsap-utils).
