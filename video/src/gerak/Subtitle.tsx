// Subtitle lengkap kecil (aturan generik: semua kata VO kebaca tanpa suara). Ngikut waktu kata VO (kata.json dari STT),
// dipecah per halaman (maks 2 baris, maks N huruf per baris, gak nyebrang kalimat), kata yang lagi diucapin disorot.
// Posisi per zona waktu (tiap adegan beda biar gak nabrak teks kata kunci/karakter); pindah zona = meluncur halus.
// Teks putih + garis tepi gelap (text-shadow) biar kebaca di atas apa pun. Kata kunci gede di layar tetap jalan sendiri.
import React from 'react';
import type { Kata } from './waktu';
import { EASE, maju, useDetik } from './waktu';

/** dari = detik mulai berlaku, x = tengah blok, y = atas blok (px layar), lebar = lebar blok. */
export type ZonaSubtitle = { dari: number; x: number; y: number; lebar?: number };

type Halaman = { baris: Kata[][]; mulai: number; akhir: number; selesai: number };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Gabung urutan kata ucapan jadi satu tulisan (mis. seratus empat puluh empat → 144); tanda baca ujung dipertahanin. */
function gabungKata(kata: Kata[], aturan: { kata: string[]; jadi: string }[]) {
  const hasil: Kata[] = [];
  for (let i = 0; i < kata.length; ) {
    const a = aturan.find((r) => r.kata.every((w, j) => kata[i + j] && norm(kata[i + j].t) === norm(w)));
    if (a) {
      const akhir = kata[i + a.kata.length - 1];
      const ekor = akhir.t.match(/[.,?!]+$/)?.[0] ?? '';
      hasil.push({ t: a.jadi + ekor, mulai: kata[i].mulai, akhir: akhir.akhir });
      i += a.kata.length;
    } else {
      hasil.push(kata[i]);
      i++;
    }
  }
  return hasil;
}

export function halamanSubtitle(
  kata: Kata[],
  kalimat: { mulai: number; akhir: number }[] = [],
  maksHuruf = 27,
  maksBaris = 2,
  gabung: { kata: string[]; jadi: string }[] = [],
): Halaman[] {
  const k = gabungKata(kata, gabung);
  // pecah per kalimat: kata masuk kalimat pertama yang akhirnya belum lewat (cadangan tanpa batas: tanda baca akhir)
  const kal: Kata[][] = [];
  let cur: Kata[] = [];
  let ki = 0;
  for (const w of k) {
    if (kalimat.length) {
      let kb = ki;
      while (kb < kalimat.length - 1 && w.mulai > kalimat[kb].akhir + 0.02) kb++;
      if (kb !== ki && cur.length) {
        kal.push(cur);
        cur = [];
      }
      ki = kb;
    }
    cur.push(w);
    if (!kalimat.length && /[.?!]$/.test(w.t)) {
      kal.push(cur);
      cur = [];
    }
  }
  if (cur.length) kal.push(cur);
  const hal: Halaman[] = [];
  const panjang = (b: Kata[]) => b.reduce((n, w) => n + w.t.length, 0) + Math.max(0, b.length - 1);
  for (const s of kal) {
    // jumlah halaman minimal buat kalimat ini, terus kata dibagi rata per halaman (gak ada halaman sisa 1 kata)
    const total = panjang(s);
    const nHal = Math.max(1, Math.ceil(total / (maksHuruf * maksBaris * 0.92)));
    const target = total / nHal;
    const kelompok: Kata[][] = [[]];
    for (const w of s) {
      const g = kelompok[kelompok.length - 1];
      if (g.length && kelompok.length < nHal && panjang([...g, w]) > target + 2) kelompok.push([w]);
      else kelompok[kelompok.length - 1].push(w);
    }
    for (const g of kelompok) {
      // tiap halaman: maks `maksBaris` baris, baris dibagi seimbang
      const tg = panjang(g);
      const nBaris = Math.min(maksBaris, Math.max(1, Math.ceil(tg / maksHuruf)));
      const tBaris = tg / nBaris;
      const baris: Kata[][] = [[]];
      for (const w of g) {
        const bb = baris[baris.length - 1];
        if (bb.length && baris.length < nBaris && panjang([...bb, w]) > tBaris + 3) baris.push([w]);
        else bb.push(w);
      }
      const z = baris[baris.length - 1];
      if (baris[0].length) hal.push({ baris, mulai: baris[0][0].mulai, akhir: z[z.length - 1].akhir, selesai: 0 });
    }
  }
  hal.forEach((h, i) => {
    const n = hal[i + 1];
    h.selesai = n && n.mulai - h.akhir < 0.6 ? n.mulai - 0.04 : h.akhir + 0.35;
  });
  return hal;
}

const TEPI =
  '3px 0 0 #070b18, -3px 0 0 #070b18, 0 3px 0 #070b18, 0 -3px 0 #070b18, 2px 2px 0 #070b18, -2px 2px 0 #070b18, 2px -2px 0 #070b18, -2px -2px 0 #070b18, 0 5px 12px rgba(0,0,0,0.75)';

export const Subtitle: React.FC<{
  kata: Kata[];
  /** batas kalimat VO (halaman gak nyebrang kalimat) */
  kalimat?: { mulai: number; akhir: number }[];
  zona: ZonaSubtitle[];
  maksHuruf?: number;
  maksBaris?: number;
  ukuran?: number;
  font?: string;
  tebal?: number;
  warna?: string;
  /** warna kata yang lagi diucapin */
  sorot?: string;
  gabung?: { kata: string[]; jadi: string }[];
  /** detik subtitle berhenti total (mis. pas loop) */
  sampai?: number;
  /** warna pita tipis di belakang teks (mis. 'rgba(7,12,24,0.55)'); kosong = tanpa pita */
  pita?: string;
}> = ({ kata, kalimat, zona, maksHuruf = 27, maksBaris = 2, ukuran = 44, font, tebal = 700, warna = '#ffffff', sorot = '#ffc53d', gabung = [], sampai, pita }) => {
  const t = useDetik();
  const hal = React.useMemo(() => halamanSubtitle(kata, kalimat, maksHuruf, maksBaris, gabung), [kata, kalimat, maksHuruf, maksBaris, gabung]);
  if (sampai !== undefined && t >= sampai) return null;
  const h = hal.find((x) => t >= x.mulai - 0.06 && t < x.selesai);
  if (!h) return null;
  // zona aktif + luncuran 0,35 dtk dari zona sebelumnya
  let iz = 0;
  for (let i = 0; i < zona.length; i++) if (zona[i].dari <= t) iz = i;
  const z = zona[iz];
  const zl = zona[Math.max(0, iz - 1)];
  const p = iz === 0 ? 1 : maju(t, z.dari, z.dari + 0.35, EASE.kamera);
  const x = zl.x + (z.x - zl.x) * p;
  const y = zl.y + (z.y - zl.y) * p;
  const lebar = (zl.lebar ?? 540) + ((z.lebar ?? 540) - (zl.lebar ?? 540)) * p;
  const masuk = maju(t, h.mulai - 0.06, h.mulai + 0.08);
  const keluar = maju(t, h.selesai - 0.1, h.selesai, EASE.keluar) * (h.selesai > h.akhir + 0.2 ? 1 : 0);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - lebar / 2,
        top: y,
        width: lebar,
        textAlign: 'center',
        fontFamily: font,
        fontWeight: tebal,
        fontSize: ukuran,
        lineHeight: 1.18,
        color: warna,
        textShadow: TEPI,
        opacity: masuk * (1 - keluar),
        translate: `0 ${((1 - masuk) * 10).toFixed(1)}px`,
      }}
    >
      <Bungkus pita={pita}>
      {h.baris.map((b, i) => (
        <div key={i}>
          {b.map((w, j) => {
            const aktif = t >= w.mulai - 0.03 && t < (b[j + 1]?.mulai ?? h.baris[i + 1]?.[0]?.mulai ?? w.akhir + 0.25);
            return (
              <span key={j} style={{ color: aktif ? sorot : undefined }}>
                {w.t}
                {j < b.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </div>
      ))}
      </Bungkus>
    </div>
  );
};

/** pita tipis di belakang teks (cuma kalau diminta; video lama tanpa pembungkus) */
const Bungkus: React.FC<{ pita?: string; children: React.ReactNode }> = ({ pita, children }) =>
  pita ? <div style={{ display: 'inline-block', background: pita, padding: '6px 22px 9px', borderRadius: 14 }}>{children}</div> : <>{children}</>;
