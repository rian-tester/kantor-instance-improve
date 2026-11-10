// Dasar waktu & easing kit motion (contoh). Semua komponen kit pakai DETIK (bukan frame) biar gak tergantung fps
// (video bisa 30 atau 60 fps) dan gampang diikat ke waktu kata VO.
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig, type SpringConfig } from 'remotion';

export const JEPIT = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** Detik sekarang. */
export const useDetik = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/** Easing per peran (SKILL-MOTION prinsip 9). */
export const EASE = {
  /** kamera & pindah besar: ease-in-out cubic */
  kamera: Easing.inOut(Easing.cubic),
  /** elemen masuk tanpa mantul: keluar cepat, mendarat halus */
  masuk: Easing.bezier(0.16, 1, 0.3, 1),
  /** elemen keluar: mulai pelan, ngebut */
  keluar: Easing.bezier(0.7, 0, 0.84, 0),
  /** crash zoom / jatuh: makin ngebut */
  jatuh: Easing.in(Easing.quad),
  linear: Easing.linear,
};

/** 0→1 antara detik a..b. */
export const maju = (t: number, a: number, b: number, easing: (n: number) => number = EASE.masuk) =>
  b <= a ? (t >= b ? 1 : 0) : interpolate(t, [a, b], [0, 1], { ...JEPIT, easing });

/** dari→ke antara detik a..b. */
export const antara = (t: number, a: number, b: number, dari: number, ke: number, easing: (n: number) => number = EASE.masuk) =>
  dari + (ke - dari) * maju(t, a, b, easing);

/** Pegas (spring) yang mulai di detik `mulai`. damping 200 = tanpa mantul; 7–12 = momen "hit" overshoot. */
export const pegas = (t: number, mulai: number, fps: number, config: Partial<SpringConfig> = { damping: 200 }) =>
  t < mulai ? 0 : spring({ frame: (t - mulai) * fps, fps, config });

export type Kata = { t: string; mulai: number; akhir: number };

const bersih = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Detik mulai kata VO pertama yang diawali `cari` setelah detik `setelah`. Gak ketemu = `cadangan`.
 *  Timing animasi diikat ke kata, jadi VO direvisi = animasi ikut geser sendiri. */
export function kata(daftar: Kata[], cari: string, setelah = 0, cadangan = 0) {
  const c = bersih(cari);
  const k = daftar.find((x) => x.mulai >= setelah - 0.05 && bersih(x.t).startsWith(c));
  return k ? k.mulai : cadangan;
}

/** Sama kayak `kata` tapi balikin detik akhir katanya. */
export function akhirKata(daftar: Kata[], cari: string, setelah = 0, cadangan = 0) {
  const c = bersih(cari);
  const k = daftar.find((x) => x.mulai >= setelah - 0.05 && bersih(x.t).startsWith(c));
  return k ? k.akhir : cadangan;
}
