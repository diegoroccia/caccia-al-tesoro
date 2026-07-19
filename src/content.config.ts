import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { siteConfig } from './site.config';

// Un tono del sintetizzatore Web Audio (effetto retro 8-bit).
const tone = z.object({
  freq: z.number(),
  type: z.enum(['sine', 'square', 'triangle', 'sawtooth']),
  duration: z.number(),
  slideTo: z.number().optional(), // rampa esponenziale di frequenza
  delay: z.number().default(0), // ms prima di suonare il tono
});

// Id degli status definiti nel catalogo (src/site.config.ts). Serve a validare
// a build-time i riferimenti onWin/onLose delle sfide.
const statusIds = siteConfig.statuses.map((s) => s.id);
const isKnownStatus = (id: string | undefined) => id === undefined || statusIds.includes(id);
const unknownStatusMessage = (id: string | undefined) =>
  `Status "${id}" non presente nel catalogo (src/site.config.ts → statuses). Id validi: ${statusIds.join(', ') || '(nessuno)'}`;

// Sfida opzionale di una stazione. L'esito (vinta/persa) imposta lo status
// attivo fino alla prossima sfida; onWin/onLose sono id del catalogo status,
// oppure assenti per "azzera lo status".
const challenge = z
  .object({
    description: z.string(), // cosa devono fare i bambini
    onWin: z.string().optional(),
    onLose: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    for (const key of ['onWin', 'onLose'] as const) {
      if (!isKnownStatus(val[key])) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [key], message: unknownStatusMessage(val[key]) });
      }
    }
  });

// Una "stazione" della caccia al tesoro. Il corpo Markdown è la pergamena
// stampabile (lettera in tedesco); i campi frontmatter alimentano guida e tab Spiel.
const stations = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/stations' }),
  schema: z.object({
    order: z.number(), // ordine nella sequenza (1..n)
    emoji: z.string(),
    // Titolo unico: usato nel tab "Spiel" e nell'intestazione della pergamena.
    title: z.string(),
    subtitle: z.string(),
    riddle: z.string(), // poesia da leggere ad alta voce
    action: z.string(), // cosa devono fare i bambini
    target: z.string(), // luogo obiettivo (Spiel: "Obiettivo: …" · Drucken: "Zielort: …")
    status: z
      .string()
      .refine(isKnownStatus, (id) => ({ message: unknownStatusMessage(id) }))
      .optional(), // forma del personaggio attiva su questa tappa (id catalogo)
    challenge: challenge.optional(), // sfida opzionale che modifica lo status
    sound: z.array(tone), // effetto sonoro dedicato
    // Pergamena stampabile (tab "Drucken")
    questLabel: z.string(), // badge in alto a destra (es. "START QUEST")
  }),
});

export const collections = { stations };
