// Bahan bersama seri explainer evergreen generik batch 2 (19/10: A1 ketik, A4 otak, A5 protein, A6 transformer, A8 captcha,
// A9 deepfake, A10 batuk). Keluarga gaya SAMA kayak A2/A3/A7 (kinetic data gelap: navy + grid, TEAL/KUNING/MERAH, Saira
// Condensed + JetBrains Mono + Kalam). Isi: waktu dasar per kalimat, teks atas yang gak nabrak watermark generik (pojok kanan
// atas x ≥ 876, y 124–338), panel/cincin/batang angka yang diikat ke progress, kotak model AI, ikon garis.
import React from 'react';
import { useVideoConfig } from 'remotion';
import {
  akhirKata, EASE, formatAngka, GarisDigambar, kata, KataMuncul, maju, noise, pegas, useDetik,
  type Kata, type KataLayar,
} from "../..";
import { MONO, SAIRA } from "../../font";
import { K } from "../../../../contoh-explainer/data-gelap/raja/gaya";
import type { Kalimat } from "../../../../contoh-explainer/data-gelap/raja/waktuRaja";
import { JUDUL, LABEL, Sumber } from "./seri";

export { K };

/** Waktu dasar: batas kalimat VO (S), pencari kata (k = mulai, a = akhir), momen CTA/keluar/loop. */
export function waktuDasar(d: Kata[], kal: Kalimat[] | undefined, total: number, nKal: number) {
  const s: { mulai: number; akhir: number }[] = kal && kal.length
    ? kal.map((x) => ({ mulai: x.mulai, akhir: x.akhir }))
    : Array.from({ length: nKal }, (_, i) => ({ mulai: 0.15 + (i * (total - 1.2)) / nKal, akhir: 0.15 + ((i + 0.92) * (total - 1.2)) / nKal }));
  const k = (c: string, setelah = 0, cad?: number) => kata(d, c, setelah, cad ?? setelah + 0.5);
  const a = (c: string, setelah = 0, cad?: number) => akhirKata(d, c, setelah, cad ?? setelah + 0.9);
  const n = s.length;
  const simpan = s[n - 1].mulai;
  const follow = k('follow', simpan, simpan + 1.3);
  const akhirVO = s[n - 1].akhir;
  return {
    s, k, a, total, simpan, follow, akhirVO,
    keluarDunia: simpan - 0.2,
    keluarCta: Math.max(akhirVO + 0.12, total - 0.95),
    loop: total - 0.3,
    /** detik teks kalimat i keluar (0,2 dtk sebelum kalimat berikut) */
    kl: (i: number) => (i + 1 < n ? s[i + 1].mulai - 0.2 : Math.max(akhirVO + 0.12, total - 0.95)),
  };
}
export type WaktuDasar = ReturnType<typeof waktuDasar>;

/** Teks atas (zona 10–30%): label caps kecil + judul besar + catatan, lebar 770 biar gak masuk kolom watermark. */
export const TeksAtas: React.FC<{
  label: (KataLayar | string)[];
  lMulai: number;
  judul?: (KataLayar | string)[];
  jMulai?: number;
  keluar: number;
  catatan?: React.ReactNode;
  cMulai?: number;
  cWarna?: string;
  ukuran?: number;
}> = ({ label, lMulai, judul, jMulai = 0, keluar, catatan, cMulai = 0, cWarna = K.abu, ukuran }) => {
  const t = useDetik();
  if (t < lMulai - 0.2 || t > keluar + 0.45) return null;
  const ob = maju(t, lMulai - 0.05, lMulai + 0.1) * (1 - maju(t, keluar, keluar + 0.2));
  const oc = catatan ? maju(t, cMulai, cMulai + 0.25) * (1 - maju(t, keluar, keluar + 0.2)) : 0;
  return (
    <div style={{ position: 'absolute', left: 90, top: 192, width: 770, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 8, height: 38, borderRadius: 4, background: K.teal, opacity: ob }} />
        <KataMuncul mulai={lMulai} keluar={keluar} jeda={0.06} gaya={LABEL} kata={label} />
      </div>
      {judul ? <KataMuncul mulai={jMulai} keluar={keluar + 0.02} jeda={0.05} lama={0.2} gaya={{ ...JUDUL, fontSize: ukuran ?? JUDUL.fontSize }} kata={judul} /> : null}
      {catatan ? (
        <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 28, color: cWarna, opacity: oc, translate: `0 ${((1 - maju(t, cMulai, cMulai + 0.25)) * 8).toFixed(1)}px` }}>{catatan}</div>
      ) : null}
    </div>
  );
};

export type TeksKalimat = {
  label: (KataLayar | string)[];
  judul: (KataLayar | string)[];
  jMulai?: number;
  ukuran?: number;
  catatan?: React.ReactNode;
  cMulai?: number;
  cWarna?: string;
};

/** Semua teks atas (1 per kalimat VO) + sumber kecil. */
export const HudTeks: React.FC<{ T: WaktuDasar; teks: TeksKalimat[]; sumber: (t: number) => string }> = ({ T, teks, sumber }) => {
  const t = useDetik();
  const sO = maju(t, 1.3, 1.6) * (1 - maju(t, T.keluarDunia - 0.1, T.keluarDunia + 0.2));
  return (
    <>
      {teks.map((x, i) => (
        <TeksAtas
          key={i}
          label={x.label}
          lMulai={i === 0 ? 0.1 : T.s[i].mulai}
          judul={x.judul}
          jMulai={x.jMulai ?? (i === 0 ? 0.2 : T.s[i].mulai + 0.3)}
          keluar={T.kl(i)}
          ukuran={x.ukuran}
          catatan={x.catatan}
          cMulai={x.cMulai}
          cWarna={x.cWarna}
        />
      ))}
      <Sumber teks={sumber(t)} o={sO} />
    </>
  );
};

/** Muncul (pegas mantul dikit) di `mulai`, keluar mengecil di `keluar`. Posisi = titik tengah. */
export const Muncul: React.FC<{
  mulai: number; keluar?: number; x: number; y: number; children: React.ReactNode; damping?: number; gaya?: React.CSSProperties; asal?: string; melayang?: number; seed?: string;
}> = ({ mulai, keluar, x, y, children, damping = 12, gaya, asal = '50% 50%', melayang = 6, seed = 'm' }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < mulai - 0.02) return null;
  const k = keluar === undefined ? 0 : maju(t, keluar, keluar + 0.22, EASE.keluar);
  if (k >= 1) return null;
  const s = pegas(t, mulai, fps, { damping, stiffness: 190, mass: 0.6 });
  const dy = noise(`${seed}y`, t * 0.6) * melayang;
  const dx = noise(`${seed}x`, t * 0.5) * melayang * 0.6;
  return (
    <div style={{ position: 'absolute', left: x + dx, top: y + dy, translate: '-50% -50%', transformOrigin: asal, scale: String(Math.max(0.001, s * (1 - 0.3 * k))), opacity: Math.min(1, (t - mulai) / 0.06) * (1 - k), ...gaya }}>
      {children}
    </div>
  );
};

/** Kartu panel gelap berbingkai. */
export const Kartu: React.FC<{ warna?: string; children: React.ReactNode; gaya?: React.CSSProperties; isi?: boolean }> = ({ warna = K.teal, children, gaya, isi }) => (
  <div style={{ padding: '14px 26px', borderRadius: 20, background: isi ? warna : 'rgba(7,12,24,0.94)', border: `4px solid ${warna}`, color: isi ? K.latar : K.tinta, boxShadow: '0 18px 40px rgba(0,0,0,0.45)', whiteSpace: 'nowrap', ...gaya }}>
    {children}
  </div>
);

export const kecil = (teks: React.ReactNode, warna: string = K.abu, ukuran = 24): React.ReactNode => (
  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: ukuran, color: warna, lineHeight: 1.15 }}>{teks}</div>
);
export const besar = (teks: React.ReactNode, warna: string = K.tinta, ukuran = 60): React.ReactNode => (
  <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: ukuran, color: warna, lineHeight: 1.0 }}>{teks}</div>
);

/** Cincin progres + angka di tengah (angka DIIKAT ke busur). p 0..1 dari `ke`. */
export const Cincin: React.FC<{ r: number; p: number; ke: number; warna: string; desimal?: number; belakang?: string; ukuran?: number; tebal?: number; sub?: React.ReactNode }> = ({
  r, p, ke, warna, desimal = 0, belakang = '%', ukuran, tebal = 22, sub,
}) => {
  const L = 2 * Math.PI * r;
  const v = ke * Math.max(0, Math.min(1, p));
  const frac = (ke / 100) * Math.max(0, Math.min(1, p));
  const S = r * 2 + tebal * 2 + 8;
  return (
    <div style={{ position: 'relative', width: S, height: S }}>
      <svg width={S} height={S} viewBox={`${-S / 2} ${-S / 2} ${S} ${S}`} style={{ position: 'absolute', left: 0, top: 0 }}>
        <circle cx={0} cy={0} r={r} fill="rgba(7,12,24,0.9)" stroke={K.garis} strokeWidth={tebal} />
        <circle cx={0} cy={0} r={r} fill="none" stroke={warna} strokeWidth={tebal} strokeLinecap="round" strokeDasharray={`${L} ${L}`} strokeDashoffset={L * (1 - frac)} transform="rotate(-90)" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: ukuran ?? r * 0.62, color: warna, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
          {formatAngka(v, desimal)}
          {belakang}
        </span>
        {sub}
      </div>
    </div>
  );
};

/** Batang mendatar: label kiri, batang tumbuh (p), angka di ujung batang (diikat ke panjang batang). */
export const Batang: React.FC<{ label: React.ReactNode; p: number; ke: number; maks: number; lebar: number; warna: string; desimal?: number; belakang?: string; tinggi?: number; o?: number }> = ({
  label, p, ke, maks, lebar, warna, desimal = 0, belakang = '%', tinggi = 54, o = 1,
}) => {
  const q = Math.max(0, Math.min(1, p));
  const w = (lebar * ke * q) / maks;
  return (
    <div style={{ opacity: o, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: K.abu }}>{label}</div>
      <div style={{ position: 'relative', width: lebar, height: tinggi, borderRadius: 12, background: '#16243f' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: tinggi, width: Math.max(tinggi * 0.4, w), borderRadius: 12, background: warna, opacity: q > 0 ? 1 : 0 }} />
        <div style={{ position: 'absolute', left: Math.max(0, w - 6), top: tinggi / 2, translate: '-100% -50%', fontFamily: SAIRA, fontWeight: 800, fontSize: tinggi * 0.86, color: K.latar, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', opacity: q > 0.25 ? 1 : 0 }}>
          {formatAngka(ke * q, desimal)}
          {belakang}
        </div>
      </div>
    </div>
  );
};

/** Kotak model AI (jaringan saraf kecil yang kedip) + nama di bawah. */
export const KotakModel: React.FC<{ nama: string; warna?: string; seed?: string; lebar?: number }> = ({ nama, warna = K.kuning, seed = 'km', lebar = 300 }) => {
  const t = useDetik();
  const nodes = [[-70, -40], [-70, 0], [-70, 40], [0, -55], [0, -18], [0, 18], [0, 55], [70, -20], [70, 20]];
  const edges: [number, number][] = [];
  for (const a of [0, 1, 2]) for (const b of [3, 4, 5, 6]) edges.push([a, b]);
  for (const a of [3, 4, 5, 6]) for (const b of [7, 8]) edges.push([a, b]);
  return (
    <div style={{ width: lebar, height: 250, borderRadius: 26, background: 'rgba(13,23,48,0.97)', border: `5px solid ${warna}`, boxShadow: `0 0 40px ${warna}44`, position: 'relative' }}>
      <svg width={lebar} height={180} viewBox={`${-lebar / 2} -90 ${lebar} 180`} style={{ position: 'absolute', left: 0, top: 6 }}>
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={K.teal} strokeWidth={2.5} opacity={0.35 + 0.4 * Math.max(0, noise(`${seed}e${i}`, t * 2))} />
        ))}
        {nodes.map(([nx, ny], i) => (
          <circle key={i} cx={nx} cy={ny} r={10} fill={noise(`${seed}n${i}`, t * 2.5) > 0.2 ? warna : '#25385c'} stroke={K.teal} strokeWidth={3} />
        ))}
      </svg>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 12, textAlign: 'center', fontFamily: SAIRA, fontWeight: 800, fontSize: 46, color: K.tinta, whiteSpace: 'nowrap' }}>{nama}</div>
    </div>
  );
};

/** Ikon garis sederhana (kotak 100×100, garis tebal). */
export const Ikon: React.FC<{ n: string; warna?: string; uk?: number; tebal?: number; mulai?: number }> = ({ n, warna = K.tinta, uk = 90, tebal = 7, mulai }) => {
  const g = (d: string, i = 0) =>
    mulai === undefined ? (
      <path key={i} d={d} fill="none" stroke={warna} strokeWidth={tebal} strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <GarisDigambar key={i} d={d} mulai={mulai + i * 0.05} lama={0.28} warna={warna} tebal={tebal} />
    );
  const P: Record<string, string[]> = {
    centang: ['M 22 52 L 42 72 L 80 30'],
    silang: ['M 26 26 L 74 74', 'M 74 26 L 26 74'],
    hp: ['M 32 10 L 68 10 Q 76 10 76 18 L 76 82 Q 76 90 68 90 L 32 90 Q 24 90 24 82 L 24 18 Q 24 10 32 10 Z', 'M 44 80 L 56 80'],
    kamera: ['M 12 32 L 62 32 Q 68 32 68 38 L 68 66 Q 68 72 62 72 L 12 72 Q 6 72 6 66 L 6 38 Q 6 32 12 32 Z', 'M 68 46 L 92 34 L 92 70 L 68 58'],
    gembok: ['M 22 46 L 78 46 L 78 88 L 22 88 Z', 'M 34 46 L 34 32 Q 34 14 50 14 Q 66 14 66 32 L 66 46', 'M 50 62 L 50 72'],
    orang: ['M 36 26 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0', 'M 20 86 Q 20 46 50 46 Q 80 46 80 86'],
    jam: ['M 10 50 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0', 'M 50 26 L 50 50 L 66 60'],
    dokumen: ['M 22 8 L 62 8 L 80 26 L 80 92 L 22 92 Z', 'M 62 8 L 62 26 L 80 26', 'M 34 46 L 68 46', 'M 34 60 L 68 60', 'M 34 74 L 56 74'],
    mic: ['M 38 14 Q 38 6 50 6 Q 62 6 62 14 L 62 46 Q 62 56 50 56 Q 38 56 38 46 Z', 'M 26 42 Q 26 70 50 70 Q 74 70 74 42', 'M 50 70 L 50 88', 'M 36 90 L 64 90'],
    perisai: ['M 50 8 L 84 20 L 84 46 Q 84 76 50 92 Q 16 76 16 46 L 16 20 Z'],
    surat: ['M 10 24 L 90 24 L 90 78 L 10 78 Z', 'M 10 24 L 50 54 L 90 24'],
    kaitan: ['M 60 10 L 60 60 Q 60 86 38 86 Q 18 86 18 66 L 18 58', 'M 18 58 L 10 68', 'M 18 58 L 28 66'],
    globe: ['M 8 50 a 42 42 0 1 0 84 0 a 42 42 0 1 0 -84 0', 'M 8 50 L 92 50', 'M 50 8 Q 26 50 50 92', 'M 50 8 Q 74 50 50 92'],
    telepon: ['M 26 12 L 40 12 L 46 30 L 36 38 Q 44 56 62 64 L 70 54 L 88 60 L 88 74 Q 88 86 74 86 Q 16 82 14 26 Q 14 12 26 12 Z'],
    awas: ['M 50 10 L 92 86 L 8 86 Z', 'M 50 38 L 50 60', 'M 50 72 L 50 74'],
    buku: ['M 50 22 Q 30 10 8 14 L 8 82 Q 30 78 50 90 Q 70 78 92 82 L 92 14 Q 70 10 50 22 Z', 'M 50 22 L 50 90'],
    kunci: ['M 12 50 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0', 'M 48 50 L 90 50', 'M 76 50 L 76 64', 'M 88 50 L 88 60'],
  };
  const d = P[n] ?? P.centang;
  return (
    <svg width={uk} height={uk} viewBox="0 0 100 100" style={{ overflow: 'visible', display: 'block' }}>
      {d.map((x, i) => g(x, i))}
    </svg>
  );
};
