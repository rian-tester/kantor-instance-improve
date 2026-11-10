// Semua garis digambar (prinsip 8): panah, lingkaran, coretan, kotak = stroke yang ditarik 6–12 frame (@30), bukan fade.
// Yang salah dicoret, jawaban dikotak. `hapus` = garis ditarik pergi dari pangkalnya (bukan menghilang).
import { getLength } from '@remotion/paths';
import React from 'react';
import { noise } from './Idle';
import { EASE, maju, useDetik } from './waktu';

export const GarisDigambar: React.FC<{
  /** path SVG (koordinat svg induk) */
  d: string;
  mulai: number;
  /** lama digambar (detik); bawaan 0,25 */
  lama?: number;
  warna: string;
  tebal: number;
  /** detik mulai dihapus dari pangkal */
  hapus?: number;
  lamaHapus?: number;
  ujung?: 'round' | 'butt' | 'square';
  opacity?: number;
  easing?: (n: number) => number;
}> = ({ d, mulai, lama = 0.25, warna, tebal, hapus, lamaHapus = 0.2, ujung = 'round', opacity = 1, easing = EASE.kamera }) => {
  const t = useDetik();
  const p = maju(t, mulai, mulai + lama, easing);
  const q = hapus === undefined ? 0 : maju(t, hapus, hapus + lamaHapus, EASE.keluar);
  if (p <= 0 || q >= 1) return null;
  const L = getLength(d);
  return (
    <path
      d={d}
      fill="none"
      stroke={warna}
      strokeWidth={tebal}
      strokeLinecap={ujung}
      strokeLinejoin="round"
      opacity={opacity}
      strokeDasharray={`${L} ${L}`}
      strokeDashoffset={L * (1 - p) - L * q}
    />
  );
};

/** Path lingkaran "tangan" (agak lonjong, ujungnya lewat dikit, goyang halus) buat nandain sesuatu. */
export function pathLingkarTangan(cx: number, cy: number, rx: number, ry: number, seed = 'lt', putaran = 1.12, mulaiSudut = -2.2) {
  const n = 64;
  const titik: string[] = [];
  for (let i = 0; i <= n; i++) {
    const a = mulaiSudut + (i / n) * Math.PI * 2 * putaran;
    const w = 1 + noise(seed, i * 0.18) * 0.035 + (i / n) * 0.05;
    titik.push(`${(cx + Math.cos(a) * rx * w).toFixed(1)} ${(cy + Math.sin(a) * ry * w).toFixed(1)}`);
  }
  return 'M' + titik.join(' L');
}

/** Path panah melengkung dari (x1,y1) ke (x2,y2) + kepala panah (2 sayap). lengkung = geser titik kontrol (px). */
export function pathPanah(x1: number, y1: number, x2: number, y2: number, lengkung = 60, kepala = 34) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const L = Math.hypot(dx, dy) || 1;
  const cx = mx - (dy / L) * lengkung;
  const cy = my + (dx / L) * lengkung;
  const ax = x2 - cx;
  const ay = y2 - cy;
  const aL = Math.hypot(ax, ay) || 1;
  const ux = ax / aL;
  const uy = ay / aL;
  const s1x = x2 - ux * kepala - uy * kepala * 0.6;
  const s1y = y2 - uy * kepala + ux * kepala * 0.6;
  const s2x = x2 - ux * kepala + uy * kepala * 0.6;
  const s2y = y2 - uy * kepala - ux * kepala * 0.6;
  return `M${x1} ${y1} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2} ${y2} M${s1x.toFixed(1)} ${s1y.toFixed(1)} L${x2} ${y2} L${s2x.toFixed(1)} ${s2y.toFixed(1)}`;
}
