import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Un tono del sintetizzatore Web Audio (effetto retro 8-bit).
const tone = z.object({
  freq: z.number(),
  type: z.enum(['sine', 'square', 'triangle', 'sawtooth']),
  duration: z.number(),
  slideTo: z.number().optional(), // rampa esponenziale di frequenza
  delay: z.number().default(0), // ms prima di suonare il tono
});

// Una "stazione" della caccia al tesoro. Il corpo Markdown è la pergamena
// stampabile (lettera in tedesco); i campi frontmatter alimentano guida e tab Spiel.
const stations = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/stations' }),
  schema: z.object({
    order: z.number(), // ordine nella sequenza (1..n)
    emoji: z.string(),
    // Tab "Spiel" (mobile game master)
    title: z.string(),
    subtitle: z.string(),
    riddle: z.string(), // poesia da leggere ad alta voce
    action: z.string(), // cosa devono fare i bambini
    spoiler: z.string(), // luogo obiettivo (nascosto dietro spoiler)
    sound: z.array(tone), // effetto sonoro dedicato
    // Pergamena stampabile (tab "Drucken")
    questLabel: z.string(), // badge in alto a destra (es. "START QUEST")
    questTitle: z.string(), // titolo della pergamena
    transformation: z.string(), // riga "Verwandlung" nel footer
    targetLocation: z.string(), // riga "Zielort" nel footer
  }),
});

export const collections = { stations };
