// Paralaks (prinsip 1 & 10): lapisan pola yang geser beda kecepatan dari kamera. faktor < 1 = jauh (lebih pelan),
// faktor > 1 = dekat / lewat depan kamera (lebih cepat). Pola harus bisa diulang (tile), jadi kamera bisa jalan jauh.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { Kamera } from './Dunia';

export type Lapis = {
  /** kecepatan relatif kamera (0,3 = jauh, 1 = nempel dunia, 1,6 = lewat depan) */
  faktor: number;
  /** CSS background-image (pola), mis. radial-gradient titik atau url(svg) */
  pola: string;
  /** ukuran 1 tile, mis. '36px 36px' */
  ukuran: string;
  opacity?: number;
  blend?: React.CSSProperties['mixBlendMode'];
};

export const Paralaks: React.FC<{ kamera: Kamera; lapis: Lapis[] }> = ({ kamera, lapis }) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {lapis.map((l, i) => {
      const s = 1 + (kamera.z - 1) * l.faktor;
      return (
        <AbsoluteFill
          key={i}
          style={{
            backgroundImage: l.pola,
            backgroundSize: l.ukuran,
            backgroundPosition: `${(-kamera.x * l.faktor).toFixed(1)}px ${(-kamera.y * l.faktor).toFixed(1)}px`,
            transform: `scale(${s})`,
            opacity: l.opacity ?? 1,
            mixBlendMode: l.blend,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

/** Pola tile titik-titik (grid piksel). */
export const polaTitik = (warna: string, jarak = 36, r = 2.4) =>
  ({ pola: `radial-gradient(circle, ${warna} ${r}px, transparent ${r + 0.6}px)`, ukuran: `${jarak}px ${jarak}px` }) as const;

/** Pola tile SVG dari daftar kotak (x, y, sisi, warna, opacity) di tile w×h. */
export function polaKotak(w: number, h: number, kotak: { x: number; y: number; s: number; warna: string; o: number; isi?: boolean }[]) {
  const isi = kotak
    .map((k) =>
      k.isi
        ? `<rect x='${k.x}' y='${k.y}' width='${k.s}' height='${k.s}' rx='${k.s * 0.18}' fill='${k.warna}' fill-opacity='${k.o}'/>`
        : `<rect x='${k.x}' y='${k.y}' width='${k.s}' height='${k.s}' rx='${k.s * 0.18}' fill='none' stroke='${k.warna}' stroke-opacity='${k.o}' stroke-width='2'/>`,
    )
    .join('');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>${isi}</svg>`;
  return { pola: `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`, ukuran: `${w}px ${h}px` } as const;
}
