# AGENTS.md

## What this is
Astro (static, TypeScript) site for a kids' treasure hunt ("Schnitzeljagd") game-master dashboard, Monster Boy themed. Single page with four tabs: Guida GM (IT), Spiel (DE), Karte (map), Drucken (print). Deployed to GitHub Pages.

## Commands
- `npm install` — deps. **npm 11 gotcha:** it blocks `esbuild`/`sharp` postinstall scripts; run `npm approve-scripts esbuild sharp` once or the build fails. (CI uses node 20/npm 10 and is unaffected.)
- `npm run dev` — dev server with HMR.
- `npm run build` — static build to `dist/`.
- `npm run preview` — serve the build. Note: the site lives under the base path, so open `http://localhost:<port>/caccia-al-tesoro/`, not `/`.
- No tests, no linter configured.

## Deployment
- GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`, uses `withastro/action`). Pushing to `main` builds and deploys. Pages source must be set to **GitHub Actions** (not branch).
- `astro.config.mjs` sets `site: https://diegoroccia.github.io` and `base: /caccia-al-tesoro` (project site). **Every `public/` asset must be referenced base-aware.** `import.meta.env.BASE_URL` here has NO trailing slash, so use `` `${import.meta.env.BASE_URL.replace(/\/$/, '')}/asset` `` (see `MapViewer.astro`, `Layout.astro`). A plain `` `${BASE_URL}asset` `` produces a broken `/caccia-al-tesoroasset` path.

## Content model (the important part)
- Hunt content lives in `src/content/stations/*.md` (Astro content collection, schema in `src/content.config.ts`). One markdown file per station; `order` frontmatter sets sequence.
- Frontmatter drives the **Spiel** tab (`title`, `subtitle`, `riddle`, `action`, `spoiler`, `emoji`, `sound`) and the **Drucken** scroll footer (`questLabel`, `questTitle`, `transformation`, `targetLocation`). The markdown **body** is the printable pergamena letter.
- The riddle poem intentionally appears twice per file: `riddle` frontmatter (Spiel tab, plain text) and inside the body (print letter, richer flavor). Keep both in sync when editing.
- `sound` is an array of Web Audio tones `{ freq, type, duration, slideTo?, delay }` — the retro 8-bit effect per station, played live (no audio files).
- Markdown uses `remark-breaks` (see `astro.config.mjs`): single newlines become `<br>`, so German poem line breaks render without trailing spaces.

## Conventions / gotchas
- UI language is German (`lang="de"`); riddles/user text are German. Code comments are Italian. Keep both.
- Interactivity is vanilla TS in Astro `<script>` tags (no UI framework island). Shared audio synth is `src/scripts/audio.ts`, imported by both the header test button and `PlayTab`.
- Tabs: `index.astro` toggles `.hidden` on `.tab-content` sections and dispatches a `tabshown` CustomEvent. `MapViewer` listens for it because the map viewport has `clientWidth` 0 while hidden and must be fitted only once visible.
- Icons use `lucide-astro` components (compile-time), not the old CDN `data-lucide` + `createIcons()` approach.
- Tailwind v4 via `@tailwindcss/vite` (no config file); global CSS + custom classes (`.font-game`, `.font-scroll`, `.scroll-bg`, `@media print`) in `src/styles/global.css`. Fonts come from a Google Fonts `@import` at the top of that file.
- `@media print` + `.no-print` produce the printable scrolls; print from within the Drucken tab (the print section is `hidden` on other tabs). Verify print layout after changing scroll markup.
- `map.png` (~7 MB) lives in `public/`; it's the only non-CDN runtime asset. `public/.nojekyll` keeps GitHub Pages from ignoring `_astro/`.
