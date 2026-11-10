// Dunia + kamera (prinsip 1: satu dunia, kamera yang jalan). Isi video disusun di kanvas besar (koordinat dunia),
// kamera pindah lewat keyframe (titik tengah layar + zoom) dengan ease-in-out. Pas kamera ngebut, dunia dikasih blur
// gerak searah gerakan (cuma pas transisi). Kamera dihitung SEKALI per frame (hitungKamera) terus dioper ke Dunia,
// Paralaks, dan apa pun yang perlu nempel ke dunia (proyeksi).
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { noise } from './Idle';
import { EASE } from './waktu';

export type KunciKamera = {
  /** detik kamera SAMPAI di titik ini */
  t: number;
  /** titik dunia yang jadi tengah layar */
  x: number;
  y: number;
  /** zoom (1 = 1 px dunia = 1 px layar) */
  z: number;
  /** easing dari kunci sebelumnya ke kunci ini (bawaan ease-in-out cubic) */
  ease?: (n: number) => number;
};

export type Getar = { t: number; kuat: number; lama?: number };

export type Kamera = { x: number; y: number; z: number; vx: number; vy: number; lebar: number; tinggi: number };

function posisi(kunci: KunciKamera[], t: number) {
  if (t <= kunci[0].t) return kunci[0];
  for (let i = 1; i < kunci.length; i++) {
    const b = kunci[i];
    if (t <= b.t) {
      const a = kunci[i - 1];
      const e = (b.ease ?? EASE.kamera)((t - a.t) / Math.max(1e-6, b.t - a.t));
      return { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, z: a.z + (b.z - a.z) * e };
    }
  }
  return kunci[kunci.length - 1];
}

/**
 * Hitung kamera di detik t.
 * @param drift goyang halus tangan kamera (px), 0 = diam total
 * @param getar hentakan (stempel, tumbukan): goyang yang meluruh dalam `lama` detik (bawaan 0,12)
 */
export function hitungKamera(
  kunci: KunciKamera[],
  t: number,
  fps: number,
  opsi: { drift?: number; getar?: Getar[]; lebar?: number; tinggi?: number } = {},
): Kamera {
  const { drift = 0, getar = [], lebar = 1080, tinggi = 1920 } = opsi;
  const k = posisi(kunci, t);
  const k0 = posisi(kunci, t - 1 / fps);
  let x = k.x + noise('kam-x', t * 0.3) * drift;
  let y = k.y + noise('kam-y', t * 0.27) * drift;
  for (const g of getar) {
    const lama = g.lama ?? 0.12;
    const d = t - g.t;
    if (d >= 0 && d < lama) {
      const sisa = 1 - d / lama;
      x += (Math.sin(d * 140) * g.kuat * sisa) / k.z;
      y += (Math.cos(d * 105) * g.kuat * 0.7 * sisa) / k.z;
    }
  }
  return { x, y, z: k.z, vx: (k.x - k0.x) * k.z * fps, vy: (k.y - k0.y) * k.z * fps, lebar, tinggi };
}

/** Titik dunia → titik layar (buat nempelin elemen layar ke benda di dunia). */
export const proyeksi = (kam: Kamera, x: number, y: number) => ({
  x: (x - kam.x) * kam.z + kam.lebar / 2,
  y: (y - kam.y) * kam.z + kam.tinggi / 2,
  s: kam.z,
});

/** Titik layar → titik dunia. */
export const keDunia = (kam: Kamera, x: number, y: number) => ({
  x: (x - kam.lebar / 2) / kam.z + kam.x,
  y: (y - kam.tinggi / 2) / kam.z + kam.y,
});

/**
 * Kanvas dunia. Anak-anaknya diposisikan absolut pakai koordinat dunia.
 * @param tinggiDunia tinggi total kanvas (buat kotak filter blur gerak)
 * @param blurGerak kecepatan (px layar/detik) mulai muncul blur; null = mati
 */
export const Dunia: React.FC<{
  kamera: Kamera;
  tinggiDunia: number;
  /** lebar total kanvas (bawaan = lebar layar; dunia yang digeser ke samping wajib diisi biar blur gak kepotong) */
  lebarDunia?: number;
  blurGerak?: number | null;
  children: React.ReactNode;
}> = ({ kamera, tinggiDunia, lebarDunia, blurGerak = 900, children }) => {
  const kuat = (v: number) => (blurGerak === null ? 0 : Math.min(18, Math.max(0, (Math.abs(v) - blurGerak) / 190)));
  const by = kuat(kamera.vy);
  const bx = kuat(kamera.vx);
  const blur = by > 0.4 || bx > 0.4;
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {blur ? (
        <svg width={0} height={0} style={{ position: 'absolute' }}>
          <defs>
            <filter id="dunia-blur-gerak" x="-5%" y="-5%" width="110%" height="110%">
              <feGaussianBlur stdDeviation={`${(bx / kamera.z).toFixed(2)} ${(by / kamera.z).toFixed(2)}`} />
            </filter>
          </defs>
        </svg>
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: lebarDunia ?? kamera.lebar,
          height: tinggiDunia,
          transformOrigin: '0 0',
          transform: `translate(${kamera.lebar / 2}px, ${kamera.tinggi / 2}px) scale(${kamera.z}) translate(${-kamera.x}px, ${-kamera.y}px)`,
          filter: blur ? 'url(#dunia-blur-gerak)' : undefined,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
