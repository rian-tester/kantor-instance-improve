// Idle (prinsip 4: gak ada frame beku > 1 dtk): napas, goyang, drift pakai noise halus (bukan sin murni biar gak robotik).
import { random } from 'remotion';

/** Noise 1D halus -1..1 (value noise + smoothstep). Seed beda = gerak beda. */
export function noise(seed: string, x: number) {
  const i = Math.floor(x);
  const f = x - i;
  const a = random(`${seed}-${i}`) * 2 - 1;
  const b = random(`${seed}-${i + 1}`) * 2 - 1;
  const u = f * f * (3 - 2 * f);
  return a + (b - a) * u;
}

export type GerakIdle = { dx: number; dy: number; rot: number; skalaY: number };

/**
 * Gerak diam-tapi-hidup buat karakter/objek.
 * @param t detik
 * @param seed pembeda antar objek
 * @param kuat 1 = standar (geser ±6 px, putar ±1,2°, napas ±1,2%)
 */
export function idle(t: number, seed: string, kuat = 1): GerakIdle {
  return {
    dx: noise(`${seed}x`, t * 0.45) * 6 * kuat,
    dy: noise(`${seed}y`, t * 0.4) * 5 * kuat,
    rot: noise(`${seed}r`, t * 0.35) * 1.2 * kuat,
    skalaY: 1 + Math.sin((t / 3.1) * Math.PI * 2) * 0.012 * kuat,
  };
}
