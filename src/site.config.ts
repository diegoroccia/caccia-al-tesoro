// ============================================================================
// CONFIGURAZIONE DEL SITO — punto unico di modifica per una nuova caccia.
// Per riusare questo template per un'altra hunt, modifica QUESTO file
// (più i contenuti in src/content/stations/*.md e public/map.png).
// ============================================================================

export interface RouteStep {
  emoji: string;
  /** Classi Tailwind per il badge colorato (es. "bg-pink-600 text-white"). */
  bg: string;
  title: string;
  /** HTML consentito (es. <strong>). */
  desc: string;
}

/**
 * Uno "status" del personaggio: effetto attivo tra una sfida e l'altra.
 * Il catalogo è la fonte unica; le sfide delle stazioni lo referenziano per `id`.
 */
export interface CharacterStatus {
  id: string;
  emoji: string;
  label: string; // etichetta breve (es. "Gamba sola")
  instruction: string; // cosa fare mentre lo status è attivo
  /**
   * Canale + colore del banner:
   * - 'form'  → la "forma" del personaggio (trasformazione), impostata dalla tappa
   * - 'buff'  → vantaggio (verde), esito positivo di una sfida
   * - 'curse' → penalità (rosso), esito negativo di una sfida
   * Forma ed effetto (buff/curse) sono due slot indipendenti e coesistono.
   */
  kind: 'form' | 'buff' | 'curse';
}

export interface GuideConfig {
  heading: string;
  intro: string;
  keyPointsTitle: string;
  keyPoints: string[]; // HTML consentito
  prepTitle: string;
  prep: string[]; // HTML consentito
  routeTitle: string;
  route: RouteStep[];
}

export interface SiteConfig {
  /** <title> della pagina. */
  title: string;
  brand: {
    name: string; // titolo grande nell'header
    tagline: string; // sottotitolo piccolo
  };
  footer: string;
  /** URL del repository GitHub, mostrato in fondo alla pagina. */
  repoUrl: string;
  /** Colori accento: cambiano l'intero tema in un colpo solo. */
  theme: {
    accent: string; // colore principale (es. bottoni, titoli)
    accentStrong: string; // variante scura (bordi attivi)
  };
  /** Etichette dei tab di navigazione. */
  tabs: {
    guide: string;
    play: string;
    map: string;
    print: string;
  };
  /** Testi tab "Spiel" e "Drucken" (lingua dei bambini). */
  ui: {
    playStepLabel: string; // "QUEST STEP"
    counterConnector: string; // "VON" → "1 VON 6"
    soundTitle: string;
    soundHint: string;
    soundButton: string;
    riddleLabel: string;
    actionLabel: string;
    spoilerToggle: string;
    runesTitle: string;
    testAudio: string;
    printReadyTitle: string;
    printReadyHint: string;
    printButton: string;
    mapTitle: string;
    mapHint: string;
    // Meccanica sfide/status (tab "Spiel" + pergamene)
    challengeLabel: string; // titolo box sfida
    winButton: string; // etichetta bottone vittoria
    loseButton: string; // etichetta bottone sconfitta
    statusActiveLabel: string; // titolo banner status
    statusNoneLabel: string; // testo quando nessuno status è attivo
    statusResetLabel: string; // bottone azzera status
    challengeWinPrefix: string; // pergamena: "Se vinci:"
    challengeLosePrefix: string; // pergamena: "Se perdi:"
    challengeNoEffect: string; // esito senza status ("nessun effetto")
  };
  /**
   * Catalogo status del personaggio. Opzionale: se vuoto, la meccanica
   * sfide/status resta silente (banner nascosto, nessuna sfida mostrata).
   */
  statuses: CharacterStatus[];
  guide: GuideConfig;
}

export const siteConfig: SiteConfig = {
  title: 'Monster Boy - Schnitzeljagd Upsala',
  brand: {
    name: 'MONSTER BOY',
    tagline: 'Cursed Kingdom Hunt',
  },
  footer: 'Monster Boy - Schnitzeljagd • Upsala Familienzentrum Berlin',
  repoUrl: 'https://github.com/diegoroccia/caccia-al-tesoro',
  theme: {
    accent: '#eab308', // yellow-500
    accentStrong: '#a16207', // yellow-700
  },
  tabs: {
    guide: 'Guida GM (IT)',
    play: 'Spiel (DE)',
    map: 'Karte',
    print: 'Drucken (DE)',
  },
  ui: {
    playStepLabel: 'QUEST STEP',
    counterConnector: 'VON',
    soundTitle: 'Retro-Soundeffekt (8-bit)',
    soundHint: 'Drücken, um das magische Geräusch abzuspielen!',
    soundButton: 'Abspielen!',
    riddleLabel: '📜 RAETSEL ZUM VORLESEN:',
    actionLabel: 'Was die Kinder tun müssen:',
    spoilerToggle: 'Zielort anzeigen/verstecken (Spoiler)',
    runesTitle: 'FREIGESCHALTETE RUNEN',
    testAudio: 'Test Audio Synth',
    printReadyTitle: 'Bereit zum Drucken!',
    printReadyHint: 'Klicke auf den Button, um die Pergament-Rollen für das Spiel direkt auszudrucken.',
    printButton: 'Jetzt drucken',
    mapTitle: 'SCHATZKARTE',
    mapHint: 'Ziehen zum Verschieben · Mausrad / Kneifen zum Zoomen',
    challengeLabel: '🎲 SFIDA',
    winButton: 'Vinta ✅',
    loseButton: 'Persa ❌',
    statusActiveLabel: 'STATUS ATTIVO',
    statusNoneLabel: 'Nessuno status — liberi!',
    statusResetLabel: 'Azzera',
    challengeWinPrefix: 'Se vinci',
    challengeLosePrefix: 'Se perdi',
    challengeNoEffect: 'nessun effetto (status azzerato)',
  },
  statuses: [
    // Forme (trasformazioni): impostate dalla tappa, occupano lo slot "forma".
    { id: 'maiale', emoji: '🐷', label: 'Maiale', kind: 'form', instruction: 'Correte annusando per terra come maialini!' },
    { id: 'serpente', emoji: '🐍', label: 'Serpente', kind: 'form', instruction: 'Strisciate pancia a terra sibilando come serpenti!' },
    { id: 'rana', emoji: '🐸', label: 'Rana', kind: 'form', instruction: 'Saltate a piedi uniti come rane!' },
    { id: 'leone', emoji: '🦁', label: 'Leone', kind: 'form', instruction: 'Correte fieri ruggendo come leoni!' },
    { id: 'drago', emoji: '🐉', label: 'Drago', kind: 'form', instruction: 'Volate a braccia aperte come draghi!' },
    { id: 'umano', emoji: '👦', label: 'Di nuovo umani', kind: 'form', instruction: 'La maledizione è spezzata: correte liberi come bambini!' },
    // Effetti sfida (buff/curse): impostati dall'esito, occupano lo slot "effetto".
    { id: 'super_veloci', emoji: '⚡', label: 'Super veloci', kind: 'buff', instruction: 'Potere del vento: correte velocissimi fino alla prossima sfida!' },
    { id: 'gigante', emoji: '🦖', label: 'Passi da gigante', kind: 'buff', instruction: 'Camminate a passi enormi da gigante fino alla prossima sfida!' },
    { id: 'gamba_sola', emoji: '🦵', label: 'Gamba sola', kind: 'curse', instruction: 'Saltellate su una gamba sola fino alla prossima sfida!' },
    { id: 'occhi_chiusi', emoji: '🙈', label: 'Occhi chiusi', kind: 'curse', instruction: 'Avanzate con gli occhi chiusi, una mano sulla spalla di una guida, fino alla prossima sfida!' },
    { id: 'muti', emoji: '🤫', label: 'Muti', kind: 'curse', instruction: 'Vietato parlare: solo gesti fino alla prossima sfida!' },
    { id: 'gambero', emoji: '🦀', label: 'Gambero', kind: 'curse', instruction: 'Camminate all\u2019indietro come un gambero fino alla prossima sfida!' },
  ],
  guide: {
    heading: 'MAPPA E PREPARAZIONE (ITALIANO)',
    intro:
      'Benvenuto Game Master! Questa caccia al tesoro è pensata per far divertire i bambini in <strong>tedesco</strong>, mentre tu gestisci la sequenza dal telefono in italiano.',
    keyPointsTitle: 'Punti Chiave Cortile',
    keyPoints: [
      '📍 <strong>Start (Tavolo):</strong> Punto di raduno iniziale dei piccoli eroi.',
      '📍 <strong>Castello Scivolo:</strong> La fortezza con lo scivolo argentato.',
      '📍 <strong>La Barca:</strong> La barca di legno posizionata nella sabbia.',
      '📍 <strong>Casa Conigli + Tappeto:</strong> Recinto coniglietti + trampolino.',
      "📍 <strong>La Prigione:</strong> La gabbia di legno nell'angolo in basso a sinistra.",
      '📍 <strong>Il Palco:</strong> Il teatro di pietra sullo sfondo.',
      '📍 <strong>Il Pozzo:</strong> In alto a sinistra sulla mappa (in realtà la siepe rotonda disegnata come pozzo).',
    ],
    prepTitle: 'Preparazione',
    prep: [
      '📜 Stampa le <strong>Pergamene in tedesco</strong> dal tab "Drucken".',
      "🪢 Nascondi gli indizi nei 5 punti corrispondenti prima dell'inizio della festa.",
      '🍬 <strong>Il Tesoro:</strong> Un bauletto con dolci e monete nascosto <strong>accanto al Pozzo</strong> (la siepe rotonda in alto a sinistra).',
    ],
    routeTitle: 'IL NUOVO PERCORSO (6 ANNI)',
    route: [
      { emoji: '🐷', bg: 'bg-pink-600 text-white', title: '1. Tavolo Festa ➡️ Castello Scivolo', desc: "Maledizione del <strong>Maiale (Pig)</strong>: corrono annusando l'aria." },
      { emoji: '🐍', bg: 'bg-green-600 text-white', title: '2. Castello Scivolo ➡️ La Barca', desc: 'Trasformazione in <strong>Serpente (Snake)</strong>: scivolano e strisciano pancia a terra per pochi metri fino alla barca.' },
      { emoji: '🐸', bg: 'bg-emerald-500 text-slate-950', title: '3. La Barca ➡️ Tappeto Elastico Conigli', desc: "Trasformazione in <strong>Rana (Frog)</strong>: saltano a piedi uniti. Devono saltare sul tappeto elastico per afferrare l'indizio appeso!" },
      { emoji: '🦁', bg: 'bg-amber-600 text-white', title: '4. Casa Conigli ➡️ La Prigione (Gabbia)', desc: 'Trasformazione in <strong>Leone (Lion)</strong>: corrono ruggendo con gli artigli.' },
      { emoji: '🐉', bg: 'bg-red-600 text-white', title: '5. La Prigione ➡️ Il Palco', desc: 'Trasformazione in <strong>Drago (Dragon)</strong>: volano spiegando le ali fino al tempio di pietra.' },
      { emoji: '👦', bg: 'bg-yellow-500 text-slate-950', title: '6. Il Palco ➡️ Il Pozzo (Tesoro)', desc: "L'incantesimo è spezzato: tornano <strong>bambini</strong> e corrono in alto a sinistra al <strong>Pozzo</strong>, dove accanto trovano il bauletto del tesoro." },
    ],
  },
};
