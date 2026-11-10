// Bantuan seri explainer generik batch 19/10 (O3–O9): potongan yang sering dipakai biar tiap video tetap satu keluarga
// (seriOL.tsx) tanpa nyalin ulang kode. Jendela adegan, panel, batang banding, kalender/jam kecil, sfx pergantian kalimat.
import React from 'react';
import { EASE, maju, useDetik, type Kata, type Sfx } from "../..";
import { MONO, SAIRA } from "../../font";
import { bunyi, OL, type Kalimat } from "./seriOL";

/** Waktu dasar: batas kalimat dari data (cadangan kalau kosong) + penanda ujung video (CTA keluar, pulang = loop). */
export function waktuDasar(kal: Kalimat[] | undefined, cad: [number, number][], total: number) {
  const s = cad.map((c, i) => ({ mulai: kal?.[i]?.mulai ?? c[0], akhir: kal?.[i]?.akhir ?? c[1] }));
  return { s, total, pulang: total - 1.45, loop: total };
}

/** Cari kata VO (mulai) — pembungkus pendek. */
export const cariKata = (d: Kata[]) => (c: string, setelah = 0, cad = 0) => {
  const bersih = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, '');
  const k = d.find((x) => x.mulai >= setelah - 0.05 && bersih(x.t).startsWith(bersih(c)));
  return k ? k.mulai : cad;
};

/** Jendela adegan: masuk di a, keluar di b. o = opacity gabungan. */
export function jendela(t: number, a: number, b: number, masuk = 0.35, keluar = 0.3) {
  const m = maju(t, a - 0.05, a + masuk, EASE.masuk);
  const k = maju(t, b - 0.12, b - 0.12 + keluar, EASE.keluar);
  return { m, k, o: m * (1 - k), aktif: t > a - 0.1 && t < b + keluar };
}

/** Panel kaca gelap seri (masuk naik + skala, keluar turun). */
export const Panel: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  m: number;
  k: number;
  judul?: React.ReactNode;
  warna?: string;
  children?: React.ReactNode;
  gaya?: React.CSSProperties;
}> = ({ x, y, w, h, m, k, judul, warna = OL.garis, children, gaya }) => {
  const o = m * (1 - k);
  if (o <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + (1 - m) * 60 + k * 40,
        width: w,
        height: h,
        borderRadius: 28,
        background: `linear-gradient(170deg, ${OL.permukaan}f2, ${OL.navy0}f2)`,
        border: `3px solid ${warna}`,
        boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        opacity: o,
        scale: String(0.94 + 0.06 * m - 0.04 * k),
        overflow: 'hidden',
        ...gaya,
      }}
    >
      {judul ? (
        <div style={{ position: 'absolute', left: 36, top: 26, fontFamily: MONO, fontWeight: 800, fontSize: 28, letterSpacing: '0.1em', color: OL.lime, textTransform: 'uppercase' }}>{judul}</div>
      ) : null}
      {children}
    </div>
  );
};

/** Batang horizontal: p = 0..1 panjang (diikat ke angka yang jalan), label di atas, nilai di ujung. */
export const Batang: React.FC<{
  x: number;
  y: number;
  w: number;
  h?: number;
  p: number;
  warna: string;
  label?: React.ReactNode;
  nilai?: React.ReactNode;
  o?: number;
  ukuranLabel?: number;
}> = ({ x, y, w, h = 84, p, warna, label, nilai, o = 1, ukuranLabel = 44 }) =>
  o <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: x, top: y, opacity: o }}>
      {label ? <div style={{ position: 'absolute', left: 0, top: -ukuranLabel - 14, fontFamily: SAIRA, fontWeight: 800, fontSize: ukuranLabel, color: warna, whiteSpace: 'nowrap' }}>{label}</div> : null}
      <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, borderRadius: 12, background: 'rgba(44,56,112,0.45)' }} />
      <div style={{ position: 'absolute', left: 0, top: 0, width: Math.max(0, w * p), height: h, borderRadius: 12, background: warna, boxShadow: `0 0 22px ${warna}55` }} />
      {nilai ? (
        <div
          style={{
            position: 'absolute',
            left: Math.max(0, w * p) + 18,
            top: h / 2,
            translate: '0 -50%',
            fontFamily: SAIRA,
            fontWeight: 800,
            fontSize: 48,
            color: OL.putih,
            whiteSpace: 'nowrap',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {nilai}
        </div>
      ) : null}
    </div>
  );

/** Teks besar di tengah dunia (angka/istilah), muncul pop halus. */
export const TeksBesar: React.FC<{ x: number; y: number; o: number; ukuran?: number; warna?: string; children: React.ReactNode; rata?: 'tengah' | 'kiri' }> = ({
  x,
  y,
  o,
  ukuran = 120,
  warna = OL.putih,
  children,
  rata = 'tengah',
}) =>
  o <= 0.001 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        translate: rata === 'tengah' ? '-50% -50%' : '0 -50%',
        fontFamily: SAIRA,
        fontWeight: 800,
        fontSize: ukuran,
        lineHeight: 1,
        color: warna,
        whiteSpace: 'nowrap',
        opacity: o,
        scale: String(0.9 + 0.1 * o),
        fontVariantNumeric: 'tabular-nums',
        textShadow: `0 0 30px ${warna}44, 0 6px 18px rgba(0,0,0,0.6)`,
      }}
    >
      {children}
    </div>
  );

/** Label mono kecil (keterangan tingkat 3). */
export const Ket: React.FC<{ x: number; y: number; o?: number; warna?: string; ukuran?: number; rata?: 'tengah' | 'kiri' | 'kanan'; children: React.ReactNode }> = ({
  x,
  y,
  o = 1,
  warna = OL.abuTerang,
  ukuran = 30,
  rata = 'kiri',
  children,
}) =>
  o <= 0.001 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        translate: rata === 'tengah' ? '-50% 0' : rata === 'kanan' ? '-100% 0' : undefined,
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: ukuran,
        color: warna,
        whiteSpace: 'nowrap',
        opacity: o,
      }}
    >
      {children}
    </div>
  );

/** Jam analog kecil: jarum muter sesuai p (0..1 = satu putaran). */
export const Jam: React.FC<{ x: number; y: number; r: number; p: number; warna?: string; o?: number; putaran?: number }> = ({ x, y, r, p, warna = OL.emas, o = 1, putaran = 1 }) => {
  if (o <= 0.001) return null;
  const a = p * 360 * putaran;
  const b = (p * 360 * putaran) / 12;
  return (
    <svg style={{ position: 'absolute', left: x - r - 10, top: y - r - 10, overflow: 'visible', opacity: o }} width={2 * r + 20} height={2 * r + 20}>
      <g transform={`translate(${r + 10} ${r + 10})`}>
        <circle r={r} fill={OL.navy0} stroke={warna} strokeWidth={8} />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={0} y1={-r + 12} x2={0} y2={-r + (i % 3 === 0 ? 34 : 24)} stroke={OL.abuTerang} strokeWidth={i % 3 === 0 ? 6 : 3} transform={`rotate(${i * 30})`} />
        ))}
        <line x1={0} y1={0} x2={0} y2={-r * 0.5} stroke={OL.putih} strokeWidth={10} strokeLinecap="round" transform={`rotate(${b})`} />
        <line x1={0} y1={0} x2={0} y2={-r * 0.78} stroke={warna} strokeWidth={6} strokeLinecap="round" transform={`rotate(${a})`} />
        <circle r={10} fill={warna} />
      </g>
    </svg>
  );
};

/** Ceklis/silang digambar (path) — buat "aman" / "gak bisa". */
export const pathCentang = (x: number, y: number, s: number) => `M ${x - s * 0.45} ${y} L ${x - s * 0.1} ${y + s * 0.35} L ${x + s * 0.5} ${y - s * 0.4}`;
export const pathSilang = (x: number, y: number, s: number) => `M ${x - s / 2} ${y - s / 2} L ${x + s / 2} ${y + s / 2} M ${x + s / 2} ${y - s / 2} L ${x - s / 2} ${y + s / 2}`;

/** SFX dasar pergantian kalimat (whoosh gantian) + CTA; ditambah sfx khusus per video. */
export function sfxDasar(s: { mulai: number }[], simpan: number, follow: number, pulang: number): Sfx[] {
  const ganti: ('whooshA' | 'whooshB' | 'whooshTurun' | 'whooshPunch')[] = ['whooshA', 'whooshTurun', 'whooshB', 'whooshPunch'];
  return [
    bunyi('whooshTerang', 0.2, 0.35),
    bunyi('riser', 0.3, 0.18),
    ...s.slice(1, -1).map((k, i) => bunyi(ganti[i % ganti.length], k.mulai, 0.3)),
    bunyi('whooshPop', simpan, 0.35),
    bunyi('pop', simpan + 0.35, 0.35),
    bunyi('whooshPop', follow, 0.35),
    bunyi('pop', follow + 0.35, 0.35),
    bunyi('whooshLembut', pulang, 0.35),
  ];
}

/** Sumber kecil per kalimat: daftar [indeks kalimat mulai, teks] → teks yang berlaku sekarang. */
export function sumberDi(t: number, s: { mulai: number }[], daftar: [number, string | null][]) {
  let v: string | null = null;
  for (const [i, x] of daftar) if (t >= s[i].mulai - 0.1) v = x;
  return v;
}
