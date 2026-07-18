// Sintetizzatore Web Audio API per effetti retro 8-bit. Condiviso tra header e tab Spiel.
let audioCtx: AudioContext | null = null;

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
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export type Tone = { freq: number; type: OscillatorType; duration: number; slideTo?: number; delay: number };

// Volume degli effetti per stazione: più alto del default perché usano frequenze
// basse e onde sine/triangle, percepite molto più deboli della fanfara di test.
const STATION_VOLUME = 0.5;

// Suona una sequenza di toni con i rispettivi ritardi (ms).
export function playSequence(tones: Tone[]): void {
  for (const t of tones) {
    if (t.delay) setTimeout(() => playSynthTone(t.freq, t.type, t.duration, t.slideTo, STATION_VOLUME), t.delay);
    else playSynthTone(t.freq, t.type, t.duration, t.slideTo, STATION_VOLUME);
  }
}

// Fanfara di test C5-E5-G5.
export function testAudio(): void {
  playSynthTone(523.25, 'square', 0.1);
  setTimeout(() => playSynthTone(659.25, 'square', 0.1), 100);
  setTimeout(() => playSynthTone(783.99, 'square', 0.3), 200);
}
