// Kursor pemandu (buat UI rekonstruksi): pindah antar titik dengan ease-in-out, klik = ditekan (mengecil) + cincin
// yang digambar melebar. `bawa` = elemen yang nempel di ekor kursor dengan telat dikit (kayak ditarik), mis. label.
import React from 'react';
import { EASE, maju, useDetik } from './waktu';

/** t = detik kursor SAMPAI di (x,y) (ujung panah). */
export type TitikKursor = { t: number; x: number; y: number };

export function posisiKursor(titik: TitikKursor[], t: number, lamaGerak = 0.42) {
  if (t <= titik[0].t) return { x: titik[0].x, y: titik[0].y };
  for (let i = 1; i < titik.length; i++) {
    const b = titik[i];
    if (t <= b.t) {
      const a = titik[i - 1];
      const lama = Math.min(lamaGerak, b.t - a.t);
      const p = maju(t, b.t - lama, b.t, EASE.kamera);
      return { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p };
    }
  }
  const z = titik[titik.length - 1];
  return { x: z.x, y: z.y };
}

export const Kursor: React.FC<{
  titik: TitikKursor[];
  /** detik klik */
  klik: number[];
  ukuran?: number;
  warna?: string;
  garis?: string;
  masuk?: number;
  keluar?: number;
  lamaGerak?: number;
  /** elemen yang ditarik kursor: dapet posisi ujung kursor (telat 0,08 dtk) */
  bawa?: (x: number, y: number) => React.ReactNode;
}> = ({ titik, klik, ukuran = 64, warna = '#ffc53d', garis = '#0b1020', masuk, keluar, lamaGerak = 0.42, bawa }) => {
  const t = useDetik();
  if (masuk !== undefined && t < masuk) return null;
  const { x, y } = posisiKursor(titik, t, lamaGerak);
  const lag = posisiKursor(titik, t - 0.08, lamaGerak);
  const om = masuk === undefined ? 1 : maju(t, masuk, masuk + 0.2);
  const ok = keluar === undefined ? 1 : 1 - maju(t, keluar, keluar + 0.2, EASE.keluar);
  let tekan = 1;
  const cincin: React.ReactNode[] = [];
  for (const c of klik) {
    const d = t - c;
    if (d > -0.06 && d < 0.1) tekan = Math.min(tekan, d < 0 ? 1 - ((d + 0.06) / 0.06) * 0.2 : 0.8 + (d / 0.1) * 0.2);
    if (d >= 0 && d < 0.34) {
      const p = maju(t, c, c + 0.34);
      cincin.push(
        <circle key={c} cx={x} cy={y} r={14 + p * 64} fill="none" stroke={warna} strokeWidth={7 * (1 - p) + 1} opacity={1 - p} />,
      );
    }
  }
  const s = (ukuran / 64) * tekan * om * ok;
  return (
    <>
      {bawa ? bawa(lag.x, lag.y) : null}
      {cincin.length ? (
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
          {cincin}
        </svg>
      ) : null}
      <svg
        width={48}
        height={68}
        viewBox="-4 -4 48 68"
        style={{ position: 'absolute', left: x - 4, top: y - 4, overflow: 'visible', transformOrigin: '4px 4px', scale: String(s), opacity: om * ok }}
      >
        <path d="M0 0 L0 50 L12 39 L21 58 L31 53 L22 35 L38 35 Z" fill={warna} stroke={garis} strokeWidth={4} strokeLinejoin="round" />
      </svg>
    </>
  );
};
