// Lapisan peta makna: titik latar (SVG, cuma yang kelihatan kamera) + kata berlabel (HTML). Semua di koordinat dunia.
// S4 "dibentuk sendiri": semua titik diacak lalu balik ke tempatnya, progresnya SAMA dengan counter 320 juta kata.
// S2 "peta raksasa": gelombang terang nyebar dari titik raja pas kamera mundur.
import React from 'react';
import { Easing, random } from 'remotion';
import { EASE, maju, noise, useDetik, type Kamera } from "../../../src/gerak";
import { MONO, SAIRA } from "../../../src/gerak/font";
import { K } from "./gaya";
import { DUNIA, HASIL, KATA, RAJA, RAJA0, TITIK, PASANGAN_G } from "./data-peta";
import type { WaktuR } from "./waktuRaja";

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** 0..1: seberapa "acak" peta (S4). */
export function acakPeta(t: number, T: WaktuR) {
  return maju(t, T.dibentuk - 0.1, T.dibentuk + 0.45, EASE.kamera);
}
/** progres pembentukan peta = progres counter 320 juta kata. */
export function bentukPeta(t: number, T: WaktuR) {
  return maju(t, T.n320 - 0.25, T.radio + 0.5, Easing.inOut(Easing.quad));
}
function geserTitik(t: number, T: WaktuR, tunda: number) {
  const s = acakPeta(t, T);
  if (s <= 0) return 0;
  const p = Easing.inOut(Easing.cubic)(Math.min(1, Math.max(0, (bentukPeta(t, T) - tunda * 0.55) / 0.45)));
  return s * (1 - p);
}
// 9:16: acakan dibikin tinggi biar nutup layar vertikal
const acakKe = (ax: number, ay: number) => ({ x: 2600 + ax * 2200, y: 1000 + ay * 3500 });

/** posisi raja: sebelum disetel (S6) ada di RAJA0, maju 6 langkah kecil ke RAJA. */
export function langkahSetel(t: number, T: WaktuR) {
  const n = 6;
  const a = T.disetel;
  const b = T.tepat + 0.15;
  let p = 0;
  for (let i = 0; i < n; i++) {
    const m = a + ((b - a) * i) / n;
    p += maju(t, m, m + 0.28, EASE.masuk) / n;
  }
  return p;
}
export function posRaja(t: number, T: WaktuR) {
  // abis peta diacak (S4) raja balik ke posisi "belum pas" (RAJA0); S6 nyetel 6 langkah kecil ke RAJA
  const a = acakPeta(t, T);
  const x0 = lerp(RAJA.x, RAJA0.x, a);
  const y0 = lerp(RAJA.y, RAJA0.y, a);
  const p = langkahSetel(t, T);
  return { x: lerp(x0, RAJA.x, p), y: lerp(y0, RAJA.y, p) };
}

/** fokus per adegan: kata di luar daftar diredupin. */
type Fokus = { a: number; b: number; ids: string[]; kuat?: number };
export function daftarFokus(T: WaktuR): Fokus[] {
  const pasangan = PASANGAN_G.flat();
  return [
    { a: -1, b: T.k2.mulai + 0.5, ids: ['raja'], kuat: 0.9 },
    { a: T.kata2 - 0.1, b: T.k3.mulai, ids: ['apel', 'mangga', 'pisang', 'jeruk', 'anggur', 'semangka'] },
    { a: T.k5.mulai, b: T.lompat, ids: ['raja', 'mahkota'] },
    { a: T.lompat, b: T.hubungan, ids: ['raja', 'pria', 'wanita', 'ratu', 'takhta', 'mahkota'] },
    { a: T.hubungan, b: T.keInggris, ids: ['raja', 'pria', 'wanita', 'ratu', ...pasangan] },
    { a: T.keInggris, b: T.keUji, ids: ['apple', 'apples', 'car', 'cars', 'dog', 'dogs', 'tree', 'trees'] },
    { a: T.kePeta14, b: T.k15.mulai + 0.5, ids: ['raja', 'pria', 'wanita', 'ratu'] },
    // penutup: balik ke keadaan frame pertama (loop)
    { a: T.pulang + 0.3, b: T.total + 5, ids: ['raja'], kuat: 0.9 },
  ];
}
function bobotFokus(t: number, f: Fokus) {
  return maju(t, f.a - 0.3, f.a + 0.2, EASE.kamera) * (1 - maju(t, f.b - 0.2, f.b + 0.3, EASE.kamera));
}
export function redupKata(id: string, t: number, F: Fokus[]) {
  let r = 1;
  for (const f of F) {
    const w = bobotFokus(t, f);
    if (w > 0 && !f.ids.includes(id)) r = Math.min(r, 1 - (f.kuat ?? 0.72) * w);
  }
  return r;
}
export function redupLatar(t: number, F: Fokus[]) {
  let r = 1;
  for (const f of F) r = Math.min(r, 1 - 0.55 * bobotFokus(t, f));
  return r;
}

/** gelombang terang dari raja (S2) */
function gelombang(t: number, T: WaktuR, x: number, y: number) {
  const t0 = T.peta2 - 0.15;
  if (t < t0 || t > t0 + 2.2) return 0;
  const R = (t - t0) * 3600;
  const d = Math.hypot(x - RAJA.x, y - RAJA.y);
  return Math.exp(-(((d - R) / 260) ** 2)) * (1 - maju(t, t0 + 1.4, t0 + 2.2));
}

export const TitikLatar: React.FC<{ kam: Kamera; T: WaktuR; F: Fokus[] }> = ({ kam, T, F }) => {
  const t = useDetik();
  const m = 80;
  const x0 = kam.x - kam.lebar / 2 / kam.z - m;
  const y0 = kam.y - kam.tinggi / 2 / kam.z - m;
  const x1 = kam.x + kam.lebar / 2 / kam.z + m;
  const y1 = kam.y + kam.tinggi / 2 / kam.z + m;
  const rd = redupLatar(t, F);
  const isi: React.ReactNode[] = [];
  TITIK.forEach((d, i) => {
    const g = geserTitik(t, T, d.tunda);
    const a = acakKe(d.acakX / DUNIA.w, d.acakY / DUNIA.h);
    const x = lerp(d.x, a.x, g) + noise(`tx${i}`, t * 0.25) * 4;
    const y = lerp(d.y, a.y, g) + noise(`ty${i}`, t * 0.25) * 4;
    if (x < x0 || x > x1 || y < y0 || y > y1) return;
    const w = gelombang(t, T, d.x, d.y);
    const o = Math.min(1, d.o * rd * (1 + Math.max(0, 0.5 - kam.z) * 1.6) + w * 0.7);
    isi.push(
      <circle key={i} cx={x} cy={y} r={d.r * (1 + w * 0.8) * Math.max(1, 0.5 / kam.z)} fill={w > 0.2 ? K.teal : '#8fa6c4'} opacity={o} />,
    );
    if (d.label && kam.z > 0.4) {
      isi.push(
        <text key={`l${i}`} x={x + d.r + 8} y={y + 8} fontFamily={MONO} fontWeight={500} fontSize={24} fill="#7f93b0" opacity={o * 0.75 * Math.min(1, (kam.z - 0.4) / 0.25)}>
          {d.label}
        </text>,
      );
    }
  });
  return (
    <svg style={{ position: 'absolute', left: x0, top: y0, overflow: 'visible' }} width={x1 - x0} height={y1 - y0} viewBox={`${x0} ${y0} ${x1 - x0} ${y1 - y0}`}>
      {isi}
    </svg>
  );
};

/** posisi kata (ikut acak S4; raja ikut setel S6) */
export function posKataT(id: string, t: number, T: WaktuR) {
  const k = KATA.find((x) => x.id === id)!;
  const base = id === 'raja' ? posRaja(t, T) : { x: k.x, y: k.y };
  const tunda = random(`kt${id}`);
  const g = geserTitik(t, T, tunda);
  if (g <= 0) return base;
  const a = acakKe(random(`ka${id}x`), random(`ka${id}y`));
  return { x: lerp(base.x, a.x, g), y: lerp(base.y, a.y, g) };
}

export type GayaKata = { warna?: string; skala?: number; o?: number; cincin?: string; labelO?: number };

/** Kata berlabel di peta. `gaya(id)` = override per adegan (warna/skala/opacity). raja disembunyiin selama hook (diganti kata besar). */
export const KataPeta: React.FC<{ kam: Kamera; T: WaktuR; F: Fokus[]; gaya: (id: string, t: number) => GayaKata | null }> = ({ kam, T, F, gaya }) => {
  const t = useDetik();
  const m = 300;
  const x0 = kam.x - kam.lebar / 2 / kam.z - m;
  const x1 = kam.x + kam.lebar / 2 / kam.z + m;
  const y0 = kam.y - kam.tinggi / 2 / kam.z - m;
  const y1 = kam.y + kam.tinggi / 2 / kam.z + m;
  return (
    <>
      {KATA.map((k) => {
        const p = posKataT(k.id, t, T);
        if (p.x < x0 || p.x > x1 || p.y < y0 || p.y > y1) return null;
        const g = gaya(k.id, t) ?? {};
        const o = (g.o ?? 1) * redupKata(k.id, t, F);
        if (o <= 0.01) return null;
        const w = gelombang(t, T, k.x, k.y);
        const fs = k.besar ? 64 : 44;
        const r = (k.besar ? 13 : 9) * Math.max(1, 0.5 / kam.z);
        const sk = g.skala ?? 1;
        const warna = g.warna ?? (k.besar ? K.tinta : '#c9d6e6');
        return (
          <div key={k.id} style={{ position: 'absolute', left: p.x, top: p.y, opacity: o }}>
            <div style={{ position: 'absolute', left: -r, top: -r, width: r * 2, height: r * 2, borderRadius: r, background: g.cincin ? K.latar : warna, border: g.cincin ? `5px solid ${g.cincin}` : undefined, boxShadow: `0 0 ${18 + w * 40}px ${w > 0.2 ? K.teal : 'rgba(61,219,200,0.35)'}` }} />
            <div
              style={{
                position: 'absolute',
                left: r + 12,
                top: -fs * 0.62,
                fontFamily: SAIRA,
                fontWeight: k.besar ? 700 : 600,
                fontSize: fs,
                lineHeight: 1.2,
                color: warna,
                whiteSpace: 'nowrap',
                transformOrigin: '0% 50%',
                scale: String(sk),
                textShadow: '0 2px 10px rgba(0,0,0,0.6)',
                opacity: g.labelO ?? 1,
              }}
            >
              {k.t}
            </div>
          </div>
        );
      })}
    </>
  );
};

export { HASIL };
