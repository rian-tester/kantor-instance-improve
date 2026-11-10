// Stempel (prinsip 9): dibanting 2–3 frame (@30) dari skala besar, miring, terus ayun bandul kecil yang meluruh.
// Pasangin `getar` kamera di detik mendaratnya biar kerasa tumbukan.
import React from 'react';
import { Easing } from 'remotion';
import { EASE, maju, useDetik } from './waktu';

/** Detik stempel mendarat (buat getar kamera / SFX). */
export const mendaratStempel = (mulai: number, lama = 0.08) => mulai + lama;

export const Stempel: React.FC<{
  mulai: number;
  children: React.ReactNode;
  /** miring akhir (derajat) */
  rot?: number;
  /** skala awal sebelum dibanting */
  dari?: number;
  /** lama bantingan (detik), bawaan 0,08 */
  lama?: number;
  /** besar ayun setelah mendarat (derajat) */
  ayun?: number;
  keluar?: number;
  gaya?: React.CSSProperties;
}> = ({ mulai, children, rot = -7, dari = 1.7, lama = 0.08, ayun = 3, keluar, gaya }) => {
  const t = useDetik();
  if (t < mulai) return null;
  const p = maju(t, mulai, mulai + lama, Easing.in(Easing.quad));
  const d = Math.max(0, t - mulai - lama);
  const goyang = p >= 1 ? ayun * Math.sin(d * 24) * Math.exp(-d * 7) : 0;
  const pipih = p >= 1 ? 1 - 0.07 * Math.exp(-d * 30) : 1;
  const k = keluar === undefined ? 0 : maju(t, keluar, keluar + 0.2, EASE.keluar);
  return (
    <div
      style={{
        ...gaya,
        opacity: Math.min(1, (t - mulai) / 0.03) * (1 - k),
        rotate: `${rot + goyang}deg`,
        scale: `${((dari + (1 - dari) * p) / pipih) * (1 - k * 0.3)} ${(dari + (1 - dari) * p) * pipih * (1 - k * 0.3)}`,
      }}
    >
      {children}
    </div>
  );
};
