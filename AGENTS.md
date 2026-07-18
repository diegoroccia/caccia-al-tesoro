# AGENTS.md

## What this is
Single self-contained static HTML app: `index.html`. A kids' treasure hunt ("Schnitzeljagd") game master dashboard, Monster Boy themed. No package manager, no build, no tests, no backend.

## Running
Just open the file in a browser (or `python3 -m http.server` and visit it). All dependencies load from CDNs at runtime: Tailwind (`cdn.tailwindcss.com`), Lucide icons (`unpkg.com/lucide`), Google Fonts. Requires internet; there is no offline/bundled fallback.

## Conventions / gotchas
- Everything lives in the one HTML file: markup, `<style>`, and the `<script>` block near the bottom (~line 410).
- UI language is German (`lang="de"`); user-facing riddles/text are German. Code comments are Italian. Keep both as-is.
- The game content is the `steps` array in the script — each entry has `emoji`, `title`, `subtitle`, `riddle`, `action`, `spoiler`. Edit riddles/stations here. Step badges/UI are index-driven, so keep array order and per-step DOM ids (`badge-<i>`, etc.) in sync.
- Retro sound effects are generated live via Web Audio API (`playSynthTone`), not audio files.
- `@media print` styles produce printable scroll/pergamena cards; `.no-print` hides UI chrome when printing. Verify print layout after changing card markup.
- Tailwind is the CDN JIT build (classes in HTML only); no config file, no custom `tailwind.config`.
