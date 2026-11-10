// Pop (prinsip 9, momen "hit"): muncul dari titik dengan pegas overshoot 8–25%, keluar mengecil cepat.
import React from 'react';
import { useVideoConfig } from 'remotion';
import { EASE, maju, pegas, useDetik } from './waktu';

export const Pop: React.FC<{
  mulai: number;
  children: React.ReactNode;
  /** 7–12 = mantul sekali (overshoot); 200 = tanpa mantul */
  damping?: number;
  stiffness?: number;
  mass?: number;
  /** titik tumpu skala, mis. '50% 100%' */
  asal?: string;
  keluar?: number;
  lamaKeluar?: number;
  gaya?: React.CSSProperties;
}> = ({ mulai, children, damping = 10, stiffness = 180, mass = 0.6, asal = '50% 50%', keluar, lamaKeluar = 0.2, gaya }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const s = pegas(t, mulai, fps, { damping, stiffness, mass });
  const k = keluar === undefined ? 0 : maju(t, keluar, keluar + lamaKeluar, EASE.keluar);
  const o = Math.min(1, Math.max(0, (t - mulai) / 0.05)) * (1 - k);
  if (o <= 0) return null;
  return <div style={{ ...gaya, transformOrigin: asal, scale: String(Math.max(0, s * (1 - k))), opacity: o }}>{children}</div>;
};
