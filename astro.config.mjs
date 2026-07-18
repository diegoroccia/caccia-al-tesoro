// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import remarkBreaks from 'remark-breaks';

// Sito pubblicato come GitHub Pages "project site": la base è il nome del repo.
// Tutti gli asset in /public vanno referenziati con import.meta.env.BASE_URL.
export default defineConfig({
  site: 'https://diegoroccia.github.io',
  base: '/caccia-al-tesoro',
  markdown: {
    // I "a capo" singoli nel testo tedesco diventano <br>: comodo per le poesie/indovinelli.
    remarkPlugins: [remarkBreaks],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
