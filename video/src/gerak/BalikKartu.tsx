// Kartu bolak-balik (KalenderFlip versi umum): muka depan → belakang lewat putaran 3D (rotateX/rotateY), bisa balik lagi.
// Dipakai buat "potongan teks jadi angka", kalender, kartu jawaban. Pembungkus 3D gak dikasih opacity/filter (jebakan
// preserve-3d); pudar/blur dipasang di luar komponen ini.
import React from 'react';
import { EASE, maju, useDetik } from './waktu';

export const BalikKartu: React.FC<{
  depan: React.ReactNode;
  belakang: React.ReactNode;
  /** detik mulai dibalik ke belakang */
  balik: number;
  /** detik mulai dibalik lagi ke depan (opsional) */
  balikLagi?: number;
  lama?: number;
  sumbu?: 'x' | 'y';
  lebar: number;
  tinggi: number;
  perspektif?: number;
}> = ({ depan, belakang, balik, balikLagi, lama = 0.32, sumbu = 'x', lebar, tinggi, perspektif = 900 }) => {
  const t = useDetik();
  const p = maju(t, balik, balik + lama, EASE.kamera) - (balikLagi === undefined ? 0 : maju(t, balikLagi, balikLagi + lama, EASE.kamera));
  const sudut = p * 180;
  const putar = sumbu === 'x' ? 'rotateX' : 'rotateY';
  const muka: React.CSSProperties = { position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' };
  return (
    <div style={{ position: 'relative', width: lebar, height: tinggi, perspective: perspektif }}>
      <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `${putar}(${sudut.toFixed(2)}deg)` }}>
        <div style={muka}>{depan}</div>
        <div style={{ ...muka, transform: `${putar}(180deg)` }}>{belakang}</div>
      </div>
    </div>
  );
};
