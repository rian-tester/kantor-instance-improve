// Karakter stiker yang hidup (prinsip 12: kedip, napas, reaksi). Ekspresi diganti per kalimat lewat timeline;
// tiap ganti ekspresi ada reaksi (pipih-melar sekali). Mulut buka-tutup ngikut volume VO (ekspresi netral → versi
// ngomong), kedip berkala pakai ekspresi mata-merem, napas + goyang halus (noise), pindah tempat = lompat melengkung.
// Semua gambar ekspresi dirender sekali (opacity) biar gak ada kedip 1 frame pas ganti gambar.
import React from 'react';
import { Img, random, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { idle } from './Idle';
import { EASE, maju, pegas, useDetik } from './waktu';

/** x = tengah, y = BAWAH karakter (px layar), tinggi = tinggi gambar. t = detik SAMPAI di posisi ini. */
export type PosisiKarakter = { t: number; x: number; y: number; tinggi: number; lama?: number };
export type EkspresiDi = { t: number; n: number };

export const Karakter: React.FC<{
  /** folder public berisi stiker-<n>.png */
  folder: string;
  /** lebar/tinggi gambar */
  rasio: number;
  posisi: PosisiKarakter[];
  ekspresi: EkspresiDi[];
  /** semua nomor ekspresi yang dipakai (dimuat sekali) */
  daftar: number[];
  /** buka/tutup mulut per frame (1/0) dari VO */
  mulut?: number[];
  /** keras suara per frame 0..1 (loncat kecil pas ngomong) */
  keras?: number[];
  /** ekspresi diam → versi mulut buka, mis. {1: 2} */
  bicara?: Record<number, number>;
  /** nomor ekspresi mata merem buat kedip (cuma dipakai pas ekspresi netral & mulut tutup) */
  kedip?: number;
  /** detik muncul (pop) / hilang */
  masuk?: number;
  keluar?: number;
  seed?: string;
  /** awalan nama berkas (bawaan 'stiker-' → stiker-<n>.png) */
  awalan?: string;
  /** gambar pixel art: jangan dihalusin pas diskala */
  piksel?: boolean;
}> = ({ folder, rasio, posisi, ekspresi, daftar, mulut = [], keras = [], bicara = {}, kedip, masuk, keluar, seed = 'karakter', awalan = 'stiker-', piksel }) => {
  const t = useDetik();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (masuk !== undefined && t < masuk) return null;

  // ---- posisi (lompat melengkung antar titik) ----
  let pos = posisi[0];
  let lompat = 0;
  if (t > posisi[0].t) {
    pos = posisi[posisi.length - 1];
    for (let i = 1; i < posisi.length; i++) {
      const b = posisi[i];
      const a = posisi[i - 1];
      const lama = b.lama ?? 0.5;
      if (t <= b.t) {
        const p = maju(t, b.t - lama, b.t, EASE.kamera);
        pos = { t, x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, tinggi: a.tinggi + (b.tinggi - a.tinggi) * p };
        lompat = Math.sin(Math.PI * p) * (Math.hypot(b.x - a.x, b.y - a.y) > 40 ? 1 : 0);
        break;
      }
    }
  }

  // ---- ekspresi + reaksi ----
  let e = ekspresi[0];
  for (const x of ekspresi) if (x.t <= t) e = x;
  // reaksi cuma buat ganti ekspresi SETELAH muncul (pas muncul udah ada pop)
  const reaksi = e.t > (masuk ?? -1) + 0.02 ? 1 - pegas(t, e.t, fps, { damping: 9, stiffness: 230, mass: 0.6 }) : 0;
  let n = e.n;
  const buka = (mulut[frame] ?? 0) > 0;
  if (bicara[n] !== undefined && buka) n = bicara[n];
  if (kedip !== undefined && n === e.n && bicara[e.n] !== undefined) {
    // kedip tiap 2,4–3,8 dtk (acak tapi tetap), 0,1 dtk
    let tb = 0.8 + random(`${seed}-k0`) * 1.5;
    for (let i = 1; tb < t + 0.2 && i < 60; i++) {
      if (t >= tb && t < tb + 0.1) n = kedip;
      tb += 2.4 + random(`${seed}-k${i}`) * 1.4;
    }
  }

  // ---- masuk / keluar ----
  const sMasuk = masuk === undefined ? 1 : pegas(t, masuk, fps, { damping: 10, stiffness: 170, mass: 0.7 });
  const sKeluar = keluar === undefined ? 1 : 1 - maju(t, keluar, keluar + 0.22, EASE.keluar);
  const s = Math.max(0, sMasuk * sKeluar);
  if (s <= 0.001) return null;

  const g = idle(t, seed, 1);
  const tinggi = pos.tinggi;
  const lebar = tinggi * rasio;
  const sy = g.skalaY * (1 + reaksi * 0.07) * (1 + lompat * 0.05);
  const sx = (1 - reaksi * 0.05) * (1 - lompat * 0.03);
  const dy = g.dy - reaksi * 16 - lompat * 110 - (keras[frame] ?? 0) * 7;
  return (
    <div
      style={{
        position: 'absolute',
        left: pos.x - lebar / 2,
        top: pos.y - tinggi,
        width: lebar,
        height: tinggi,
        transformOrigin: '50% 100%',
        translate: `${g.dx.toFixed(2)}px ${dy.toFixed(2)}px`,
        rotate: `${g.rot.toFixed(3)}deg`,
        scale: `${(sx * s).toFixed(4)} ${(sy * s).toFixed(4)}`,
      }}
    >
      {daftar.map((d) => (
        <Img
          key={d}
          src={staticFile(`${folder}/${awalan}${d}.png`)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: d === n ? 1 : 0, imageRendering: piksel ? 'pixelated' : undefined }}
        />
      ))}
    </div>
  );
};
