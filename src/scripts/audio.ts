// Sintetizzatore Web Audio API per effetti retro 8-bit. Condiviso tra header e tab Spiel.
let audioCtx: AudioContext | null = null;
let master: AudioNode | null = null; // catena di uscita condivisa (compressore + makeup gain)

// Compressore + guadagno di makeup: alza il volume percepito senza distorcere
// e uniforma i suoni gravi (percepiti più deboli) rispetto a quelli acuti.
function getMaster(ctx: AudioContext): AudioNode {
  if (master) return master;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -22;
  comp.knee.value = 30;
  comp.ratio.value = 12;
  comp.attack.value = 0.003;
  comp.release.value = 0.25;
  const makeup = ctx.createGain();
  makeup.gain.value = 1.8;
  comp.connect(makeup);
  makeup.connect(ctx.destination);
  master = comp;
  return master;
}

export function playSynthTone(
  freq: number,
  type: OscillatorType,
  duration: number,
  slideTo?: number,
  volume = 0.15,
): void {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type || 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, audioCtx.currentTime + duration);
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(getMaster(audioCtx));
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export type Tone = { freq: number; type: OscillatorType; duration: number; slideTo?: number; delay: number };

// Volume degli effetti per stazione: più alto del default perché usano frequenze
// più basse, percepite più deboli della fanfara di test.
const STATION_VOLUME = 0.7;

// Suona una sequenza di toni con i rispettivi ritardi (ms).
export function playSequence(tones: Tone[]): void {
  for (const t of tones) {
    if (t.delay) setTimeout(() => playSynthTone(t.freq, t.type, t.duration, t.slideTo, STATION_VOLUME), t.delay);
    else playSynthTone(t.freq, t.type, t.duration, t.slideTo, STATION_VOLUME);
  }
}

// Fanfara di test C5-E5-G5 (volume di default, già ben udibile).
export function testAudio(): void {
  playSynthTone(523.25, 'square', 0.1);
  setTimeout(() => playSynthTone(659.25, 'square', 0.1), 100);
  setTimeout(() => playSynthTone(783.99, 'square', 0.3), 200);
}
