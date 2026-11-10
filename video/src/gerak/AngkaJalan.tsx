// Angka = kejadian (prinsip 6): counter berjalan, digit tabular, format id-ID. Paling bagus DIIKAT ke progress gerak
// objek yang sama (lewat prop `progress`), jadi angka naik karena bendanya beneran gerak/bertambah.
import React from 'react';
import { EASE, maju, useDetik } from './waktu';

/** Format angka gaya Indonesia (titik ribuan, koma desimal). */
export const formatAngka = (n: number, desimal = 0) =>
  n.toLocaleString('id-ID', { minimumFractionDigits: desimal, maximumFractionDigits: desimal });

export const AngkaJalan: React.FC<{
  dari: number;
  ke: number;
  /** detik mulai & lama jalan (dipakai kalau `progress` kosong) */
  mulai?: number;
  lama?: number;
  /** progress 0..1 dari luar (diikat ke gerak objek); ngalahin mulai/lama */
  progress?: number;
  easing?: (n: number) => number;
  desimal?: number;
  /** bulatkan ke bawah (counter diskrit kayak hitungan) */
  lantai?: boolean;
  depan?: React.ReactNode;
  belakang?: React.ReactNode;
  gaya?: React.CSSProperties;
}> = ({ dari, ke, mulai = 0, lama = 1.5, progress, easing = EASE.kamera, desimal = 0, lantai, depan, belakang, gaya }) => {
  const t = useDetik();
  const p = progress ?? maju(t, mulai, mulai + lama, easing);
  const v = dari + (ke - dari) * p;
  const f = Math.pow(10, desimal);
  const n = lantai ? Math.floor(v * f + 1e-6) / f : Math.round(v * f) / f;
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', ...gaya }}>
      {depan}
      {formatAngka(n, desimal)}
      {belakang}
    </span>
  );
};
