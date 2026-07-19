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
- Frontmatter drives the **Spiel** tab (`title`, `subtitle`, `riddle`, `action`, `target`, `emoji`, `sound`, optional `status`, optional `challenge`) and the **Drucken** scroll (`questLabel`, `status`, `target`, body, optional `challenge`). The markdown **body** is the printable pergamena letter.
- `title` and `target` are each single-sourced: `title` is the heading in both Spiel and the print scroll (`{emoji} {title}`); `target` is the objective, shown as `Obiettivo: {target}` in Spiel and `Zielort: {target}` in the print footer. (Earlier duplicated fields `questTitle`/`spoiler`/`targetLocation` were removed.)
- The riddle poem intentionally appears twice per file: `riddle` frontmatter (Spiel tab, plain text) and inside the body (print letter, richer flavor). Keep both in sync when editing.
- `sound` is an array of Web Audio tones `{ freq, type, duration, slideTo?, delay }` — the retro 8-bit effect per station, played live (no audio files).
- **Status catalog + two slots (all opt-in).** Everything status-related is generic and lives in the central catalog `siteConfig.statuses` (`{ id, emoji, label, instruction, kind: 'form'|'buff'|'curse' }`). There is no hard-coded "transformation" concept — a transformation is just a `kind: 'form'` status. The active status is split into two independent slots that coexist in the Spiel banner: **form** (`kind: 'form'`, blue) and **effect** (`kind: 'buff'` green / `'curse'` red).
  - **Form** comes from a status with `kind: 'form'`. It is **sticky and persisted** (`localStorage`): it is (over)written either by a station's optional `status` field on arrival, or by a challenge outcome that references a `form` status (see below). A station that declares no `status` leaves the current form untouched. The print scroll footer shows `{emoji} {label}` of the station's own `status`.
  - **Effect** comes from a station's optional `challenge: { description, onWin?, onLose? }` and is `localStorage`-backed until the next challenge resolves it. The "Azzera" button clears only the effect.
  - **Outcome routing by kind.** When the GM presses Vinta/Persa, the referenced `onWin`/`onLose` `id` is routed by the target status's `kind`: a `form` status changes the **form** slot (i.e. winning grants a new transformation), while `buff`/`curse` change the **effect** slot. An *absent* outcome id clears the effect only (the form is left as-is). This makes gated progression possible — e.g. `onWin: <form id>` with `onLose` absent means "win → new form, lose → keep current form". Because a station's `status` overrides the form on arrival, a challenge-granted form persists only if the following stations declare no `status`.
  - Both `status` and `challenge.onWin`/`onLose` are validated at build time (a `refine`/`superRefine` in `content.config.ts` fails the build with a clear message listing valid ids if an unknown id is referenced). A station with no `status`/`challenge` simply shows no form/hides the challenge box, so a hunt using neither behaves like a plain sequence. Challenges also print on the Drucken scrolls (description + both outcomes).
- Markdown uses `remark-breaks` (see `astro.config.mjs`): single newlines become `<br>`, so German poem line breaks render without trailing spaces.

## Conventions / gotchas
- UI language is German (`lang="de"`); riddles/user text are German. Code comments are Italian. Keep both.
- Interactivity is vanilla TS in Astro `<script>` tags (no UI framework island). Shared audio synth is `src/scripts/audio.ts`, imported by both the header test button and `PlayTab`.
- Tabs: `index.astro` toggles `.hidden` on `.tab-content` sections and dispatches a `tabshown` CustomEvent. `MapViewer` listens for it because the map viewport has `clientWidth` 0 while hidden and must be fitted only once visible.
- Icons use `lucide-astro` components (compile-time), not the old CDN `data-lucide` + `createIcons()` approach.
- Tailwind v4 via `@tailwindcss/vite` (no config file); global CSS + custom classes (`.font-game`, `.font-scroll`, `.scroll-bg`, `@media print`) in `src/styles/global.css`. Fonts come from a Google Fonts `@import` at the top of that file.
- `@media print` + `.no-print` produce the printable scrolls; print from within the Drucken tab (the print section is `hidden` on other tabs). Verify print layout after changing scroll markup.
- `map.png` (~7 MB) lives in `public/`; it's the only non-CDN runtime asset. `public/.nojekyll` keeps GitHub Pages from ignoring `_astro/`.
