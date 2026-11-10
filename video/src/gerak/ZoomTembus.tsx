// Zoom tembus / kotak tembus (prinsip 2: transisi bermakna). Benda yang diklik/dituju MEMBESAR jadi bingkai adegan
// berikutnya: kotaknya tumbuh dari posisi asal ke kotak tujuan, isi baru ikut membesar dari dalam kotak itu
// (bukan crossfade). Dipakai buat "masuk ke menu", "masuk ke layar", dll.
import React from 'react';
import { EASE, maju, useDetik } from './waktu';

export type Kotak = { x: number; y: number; w: number; h: number; r?: number };

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export const ZoomTembus: React.FC<{
  dari: Kotak;
  ke: Kotak;
  mulai: number;
  lama?: number;
  /** isian kotak selama tumbuh */
  warna: string;
  /** warna garis tepi (opsional) */
  garis?: string;
  tebalGaris?: number;
  /** bagian perjalanan (0..1) saat isi baru mulai kelihatan */
  isiMuncul?: number;
  /** isi adegan baru, ditata di koordinat kotak tujuan (0,0 = pojok kiri atas `ke`) */
  children?: React.ReactNode;
}> = ({ dari, ke, mulai, lama = 0.34, warna, garis, tebalGaris = 2, isiMuncul = 0.45, children }) => {
  const t = useDetik();
  if (t < mulai) return null;
  const p = maju(t, mulai, mulai + lama, EASE.kamera);
  const x = lerp(dari.x, ke.x, p);
  const y = lerp(dari.y, ke.y, p);
  const w = lerp(dari.w, ke.w, p);
  const h = lerp(dari.h, ke.h, p);
  const r = lerp(dari.r ?? 0, ke.r ?? 0, p);
  const isi = maju(t, mulai + lama * isiMuncul, mulai + lama * 1.15);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: r,
        background: warna,
        overflow: 'hidden',
        outline: garis ? `${tebalGaris}px solid ${garis}` : undefined,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: ke.w,
          height: ke.h,
          transformOrigin: '0 0',
          // skala seragam (teks gak gepeng); bagian yang belum muat kepotong kotak, kebuka seiring kotak tumbuh
          scale: String(Math.max(w / ke.w, h / ke.h)),
          opacity: isi,
          filter: isi < 1 ? `blur(${((1 - isi) * 10).toFixed(2)}px)` : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
};
