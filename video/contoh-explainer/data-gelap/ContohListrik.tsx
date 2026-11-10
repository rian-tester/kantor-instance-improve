// Frame hero (pembuka, tengah, puncak): 15, 859, 1431.
// contoh video explainer A2 (akun generik, konten contoh): "Satu pertanyaan ke ChatGPT = 10× listrik Google? Asal angkanya".
// SATU DUNIA: dua pilar listrik (Wh) berdiri di lantai. Tinggi pilar = Wh, angka di kartu atas pilar DIIKAT ke tinggi itu.
// Alur kamera: pilar (klaim 10×) → geser ke laporan IEA Electricity 2024 → balik, pilar diukur 0,3 vs 2,9 Wh → lampu LED 10 W
// (hitungan kami) → nyelam ke bawah lantai: chip data center ngitung jawaban per token → naik: lantai jadi GARIS WAKTU
// 2009 · 2023 · 2025 → pilar 2023 jadi hantu dicoret (angka lama), pilar baru 2025 turun ke ±0,3 Wh → alasan selisih →
// jawaban panjang & reasoning bikin pilar naik lagi → CTA simpan + follow → latar kosong (loop).
// Fakta: IEA Electricity 2024 hal. 34; Epoch AI "How much energy does ChatGPT use?" (Josh You, 07/02/2025).
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Bunyi, Dunia, EASE, formatAngka, GarisDigambar, Grain, maju, noise, pathPanah, pegas, Pop, Subtitle, useDetik,
  type KunciKamera, type Kata,
} from "../../src/gerak";
import { MONO, SAIRA, SLAB, TANGAN } from "../../src/gerak/font";
import { bunyi, K } from "./raja/gaya";
import type { Kalimat } from "./raja/waktuRaja";
import { Chip, CtaSimpanFollow, kameraSeri, LatarSeri, lerp, PeneduhAtas, sorot, Sumber, TeksSeri } from "../../src/gerak/seri/data-gelap/seri";
import { waktuListrik, type WaktuL } from "./listrik/waktuListrik";

export type DataListrik = { durasi: number; kata: Kata[]; kalimat?: Kalimat[] };

const LANTAI = 1250; // y lantai (dunia)
const PX = 150; // px per Wh
const LP = 180; // lebar pilar
const KW = 262; // lebar kartu
const KH = 160; // tinggi kartu
const X0 = { g: 330, c: 750 }; // posisi awal pilar
const XG = { g: 230, c: 520, n: 810 }; // posisi di garis waktu (2009 · 2023 · 2025)
const DOK = { x: 1640, y: 960 };
const CHIP = { x: 750, y: 1700 };

// ======================================================================================================
// keadaan pilar per detik (satu sumber kebenaran: tinggi = angka)
export type Pil = { x: number; v: number; o: number; hantu: number; angka: string | null; tetes?: boolean; redup: number; turun: number };

function pilar(T: WaktuL, t: number) {
  const S = T.s;
  const geser = maju(t, T.keGaris + 0.1, T.keGaris + 0.9, EASE.kamera);
  const reset = maju(t, T.keDok + 1.0, T.keDok + 1.5, EASE.kamera); // pas kamera di laporan (gak keliatan)
  const turun = maju(t, T.keluarDunia, T.keluarDunia + 0.45, EASE.keluar);
  // S9: yang lain diredupin; S5 (kamera nyelam ke chip): pilar hampir ilang biar zona judul bersih
  const redup9 = Math.max(
    maju(t, S[8].mulai - 0.15, S[8].mulai + 0.3) * (1 - turun),
    1.25 * maju(t, T.keChip - 0.1, T.keChip + 0.4) * (1 - maju(t, T.keGaris, T.keGaris + 0.5)),
  );
  const vG = t < T.keDok + 1.5 ? 0.3 * maju(t, 0.3, 0.95, EASE.masuk) * (1 - reset) : 0.3 * maju(t, T.n03 - 0.15, T.n03 + 0.45, EASE.kamera);
  const vC = t < T.keDok + 1.5 ? 2.9 * maju(t, 0.36, 1.02, EASE.masuk) * (1 - reset) : 2.9 * maju(t, T.chatgpt3 + 0.05, T.chatgpt3 + 1.1, EASE.kamera);
  const angkaMuncul = t > S[2].mulai - 0.2;
  const G: Pil = {
    x: lerp(X0.g, XG.g, geser), v: vG, o: 1, hantu: 0, angka: angkaMuncul ? `${formatAngka(vG, 1)} Wh` : null, redup: redup9, turun,
  };
  const C: Pil = {
    x: lerp(X0.c, XG.c, geser), v: vC, o: 1, hantu: maju(t, T.ulang + 0.05, T.ulang + 0.7), angka: angkaMuncul ? `${formatAngka(vC, 1)} Wh` : null, redup: redup9, turun,
  };
  // pilar baru (hitungan ulang 2025): lahir dari pilar 2023, geser ke slot 2025, turun pelan 2,9 → 0,3 sampai VO "0,3"
  const lahir = T.ulang - 0.1;
  const geserN = maju(t, lahir, lahir + 0.8, EASE.kamera);
  const susut = maju(t, T.ulang + 1.1, T.n03b + 0.3, EASE.kamera);
  // S9: jawaban panjang (+0,5) → mikir dulu (+0,7) → jauh lebih banyak (sampai 5 Wh)
  const naik = 0.5 * maju(t, T.panjang9, T.panjang9 + 0.5) + 0.7 * maju(t, T.mikir, T.mikir + 0.5) + 2.7 * maju(t, T.bisa, T.banyak - 0.05, EASE.kamera);
  const vN = lerp(2.9, 0.3, susut) + naik;
  const N: Pil = {
    x: lerp(XG.c, XG.n, geserN), v: vN, o: t < lahir ? 0 : 1, hantu: 0,
    angka: naik > 0.01 ? '> 0,3 Wh' : `${formatAngka(lerp(2.9, 0.3, susut), 1)} Wh`, tetes: naik > 0.01, redup: 0, turun,
  };
  return { G, C, N };
}

// ======================================================================================================
export const ContohListrik: React.FC<DataListrik> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuListrik(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const S = T.s;
  const pelan = Easing.linear;
  const kunci: KunciKamera[] = [
    { t: 0, x: 540, y: 960, z: 1.0 },
    { t: T.keDok, x: 545, y: 940, z: 1.045, ease: pelan },
    { t: T.keDok + 0.85, x: DOK.x, y: DOK.y + 20, z: 1.0 },
    { t: T.iea, x: DOK.x + 5, y: DOK.y + 35, z: 1.04, ease: pelan },
    { t: T.iea + 0.5, x: DOK.x + 10, y: DOK.y + 60, z: 1.1 },
    { t: T.balik, x: DOK.x + 12, y: DOK.y + 64, z: 1.13, ease: pelan },
    { t: S[2].mulai + 0.35, x: 540, y: 960, z: 1.0 },
    { t: S[3].mulai - 0.1, x: 545, y: 955, z: 1.035, ease: pelan },
    { t: S[3].mulai + 0.6, x: 540, y: 890, z: 0.92 },
    { t: T.keChip, x: 545, y: 885, z: 0.95, ease: pelan },
    { t: S[4].mulai + 0.7, x: 560, y: 1600, z: 1.0 },
    { t: T.keGaris, x: 575, y: 1620, z: 1.05, ease: pelan },
    { t: S[5].mulai + 0.75, x: 540, y: 1000, z: 0.92 },
    { t: S[6].mulai, x: 545, y: 1000, z: 0.95, ease: pelan },
    { t: S[6].mulai + 0.7, x: 565, y: 990, z: 0.92 },
    { t: S[7].mulai - 0.1, x: 570, y: 985, z: 0.965, ease: pelan },
    { t: S[7].mulai + 0.5, x: 560, y: 950, z: 0.97 },
    { t: S[8].mulai - 0.1, x: 562, y: 948, z: 1.0, ease: pelan },
    { t: S[8].mulai + 0.6, x: 650, y: 960, z: 0.95 },
    { t: T.bisa, x: 652, y: 955, z: 0.97, ease: pelan },
    { t: T.banyak, x: 650, y: 900, z: 0.92 },
    { t: T.keluarDunia, x: 650, y: 898, z: 0.93, ease: pelan },
    { t: T.simpan + 0.9, x: 540, y: 960, z: 1.0 },
    { t: T.loop, x: 540, y: 960, z: 1.02, ease: pelan },
    { t: total, x: 540, y: 960, z: 1.0 },
  ];
  const kam = kameraSeri(kunci, t, fps, total, [
    { t: 1.04, kuat: 9, lama: 0.16 },
    { t: T.n03b + 0.3, kuat: 6, lama: 0.14 },
  ]);
  const P = pilar(T, t);
  return (
    <AbsoluteFill style={{ background: K.latar, color: K.tinta, overflow: 'hidden', fontFamily: SAIRA }}>
      <LatarSeri kam={kam} />
      <Dunia kamera={kam} tinggiDunia={2300} lebarDunia={2200} blurGerak={1300}>
        <PusatData T={T} />
        <Lantai T={T} />
        <Pilar p={P.G} warna={K.teal} nama="GOOGLE" sub="1 pencarian" ikon="cari" tag={tagG(T, t)} t0={0.12} />
        <Pilar p={P.C} warna={K.kuning} nama="CHATGPT" sub="1 pertanyaan" ikon="chat" tag={tagC(T, t)} t0={0.2} coret={T.ulang + 0.55} />
        <Pilar p={P.N} warna={K.kuning} nama="CHATGPT" sub="GPT-4o · 2025" ikon="chat" tag={tagN(T, t)} t0={T.ulang - 0.1} terang />
        <Braket T={T} />
        <Lampu T={T} />
        <Alasan T={T} />
        <Reasoning T={T} />
        <DokumenIEA T={T} />
      </Dunia>
      <PeneduhAtas />
      <Hud T={T} />
      <CtaSimpanFollow simpan={T.simpan + 0.12} follow={T.follow} keluar={T.keluarCta} />
      <Subtitle
        kata={d.kata} kalimat={d.kalimat} font={SAIRA} tebal={700} ukuran={46} maksHuruf={32} sorot={K.kuning} sampai={T.akhirVO + 0.3}
        zona={[{ dari: 0, x: 540, y: 1326, lebar: 940 }]} pita="rgba(7,12,24,0.55)"
      />
      <Grain kuat={0.07} garisScan={0} vinyet={0.5} warnaVinyet="2,5,14" />
      <></>
    </AbsoluteFill>
  );
};

// tag di atas kartu (keterangan tahun / angka lama / hitungan baru)
export type Tag = { teks: string; warna: string; o: number } | null;
const tagG = (T: WaktuL, t: number): Tag => (t > T.th2009 - 0.05 ? { teks: 'PERKIRAAN 2009', warna: K.abu, o: maju(t, T.th2009 - 0.05, T.th2009 + 0.15) } : null);
const tagC = (T: WaktuL, t: number): Tag => {
  if (t > T.ulang + 0.4) return { teks: 'ANGKA LAMA', warna: K.merah, o: 1 };
  if (t > T.th2023 - 0.05) return { teks: 'PERKIRAAN AWAL 2023', warna: K.abu, o: maju(t, T.th2023 - 0.05, T.th2023 + 0.15) };
  return null;
};
const tagN = (T: WaktuL, t: number): Tag => (t > T.n03b + 0.35 ? { teks: 'HITUNGAN 2025', warna: K.kuning, o: maju(t, T.n03b + 0.35, T.n03b + 0.55) } : null);

// ======================================================================================================
// PILAR + KARTU
const IkonCari: React.FC<{ warna: string }> = ({ warna }) => (
  <svg width={36} height={36} viewBox="-18 -18 36 36">
    <circle cx={-3} cy={-3} r={10} fill="none" stroke={warna} strokeWidth={4.5} />
    <path d="M 4.5 4.5 L 13 13" stroke={warna} strokeWidth={5} strokeLinecap="round" />
  </svg>
);
const IkonChat: React.FC<{ warna: string }> = ({ warna }) => (
  <svg width={36} height={36} viewBox="-18 -18 36 36">
    <path d="M -14 -12 H 14 Q 16 -12 16 -10 V 6 Q 16 8 14 8 H -2 L -10 15 V 8 H -14 Q -16 8 -16 6 V -10 Q -16 -12 -14 -12 Z" fill="none" stroke={warna} strokeWidth={4} strokeLinejoin="round" />
    <circle cx={-7} cy={-2} r={2.2} fill={warna} />
    <circle cx={0} cy={-2} r={2.2} fill={warna} />
    <circle cx={7} cy={-2} r={2.2} fill={warna} />
  </svg>
);

export const Pilar: React.FC<{ p: Pil; warna: string; nama: string; sub: string; ikon: 'cari' | 'chat'; tag: Tag; t0: number; coret?: number; terang?: boolean }> = ({
  p, warna, nama, sub, ikon, tag, t0, coret, terang,
}) => {
  const t = useDetik();
  if (p.o <= 0 || t < t0 || p.turun >= 1) return null;
  // kartu jatuh dari atas → mendarat pipih → mantul (pilar baru 2025 gak jatuh: lahir dari pilar 2023)
  const jatuh = terang ? 1 : maju(t, t0, t0 + 0.22, EASE.jatuh);
  const dLand = t - (t0 + 0.22);
  const sy = terang ? 1 : dLand < 0 ? 1.06 : 1 - 0.22 * Math.exp(-dLand * 11) * Math.cos(dLand * 30);
  const h = Math.max(0, p.v * PX);
  const hantu = p.hantu;
  const o = (1 - 0.72 * p.redup) * (1 - p.turun);
  const wFill = lerp(1, 0.16, hantu);
  const atasFill = LANTAI - h;
  const kartuY = atasFill - 14 - KH + (1 - jatuh) * -260 + p.turun * 200;
  const napas = noise(`np${nama}${sub}`, t * 0.6) * 3;
  // bagian "tetes" (S9): di atas 0,3 Wh digambar arsir (perkiraan, gak ada angka pasti)
  const hPadat = p.tetes ? 0.3 * PX : h;
  const warnaBingkai = hantu > 0.5 ? K.abu : warna;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      {/* isi pilar */}
      <div
        style={{
          position: 'absolute', left: p.x - LP / 2, top: LANTAI - hPadat * (1 - p.turun), width: LP, height: hPadat * (1 - p.turun),
          borderRadius: '10px 10px 0 0', overflow: 'hidden',
          background: `linear-gradient(180deg, ${warna}${hex(0.95 * wFill)} 0%, ${warna}${hex(0.45 * wFill)} 100%)`,
          boxShadow: hantu < 0.5 ? `0 0 ${terang ? 60 : 40}px ${warna}55` : 'none',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, opacity: (1 - hantu) * 0.9, backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.16) 0 12px, transparent 12px 34px)', backgroundPosition: `0 ${(-t * 70).toFixed(1)}px` }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 6, background: '#fff', opacity: (1 - hantu) * 0.75 }} />
      </div>
      {p.tetes && h > hPadat ? (
        <div
          style={{
            position: 'absolute', left: p.x - LP / 2, top: LANTAI - h, width: LP, height: h - hPadat, borderRadius: '10px 10px 0 0',
            backgroundImage: `repeating-linear-gradient(-45deg, ${warna}cc 0 10px, transparent 10px 26px)`, backgroundPosition: `0 ${(-t * 90).toFixed(1)}px`,
            border: `4px dashed ${warna}`, borderBottom: 'none',
            WebkitMaskImage: 'linear-gradient(0deg, #000 60%, rgba(0,0,0,0.25) 100%)',
          }}
        />
      ) : null}
      {/* bingkai hantu (angka lama): putus-putus */}
      {hantu > 0 ? (
        <div style={{ position: 'absolute', left: p.x - LP / 2, top: atasFill, width: LP, height: h, borderRadius: '10px 10px 0 0', border: `4px dashed ${K.abu}`, borderBottom: 'none', opacity: hantu * 0.9 }} />
      ) : null}
      {/* partikel listrik naik di dalam pilar */}
      {hantu < 0.5 && h > 40
        ? [0, 1, 2, 3, 4].map((i) => {
            const fase = (t * 0.7 + i / 5) % 1;
            const y = LANTAI - fase * h;
            return <div key={i} style={{ position: 'absolute', left: p.x - 11 + noise(`pp${nama}${i}`, t * 0.9) * 48, top: y - 11, width: 22, height: 22, borderRadius: 11, background: '#fff', boxShadow: `0 0 18px ${warna}`, opacity: 0.75 * Math.sin(Math.PI * fase) * Math.max(0, 1 - p.redup) }} />;
          })
        : null}
      {/* kartu */}
      <div
        style={{
          position: 'absolute', left: p.x - KW / 2, top: kartuY + napas, width: KW, height: KH, borderRadius: 18, padding: '12px 16px',
          background: 'rgba(13,23,48,0.96)', border: `4px solid ${warnaBingkai}`, opacity: Math.min(1, jatuh * 3) * lerp(1, 0.62, hantu),
          scale: `${(1 / Math.sqrt(sy)).toFixed(3)} ${sy.toFixed(3)}`, transformOrigin: '50% 100%',
          boxShadow: terang ? `0 0 34px ${warna}66` : '0 14px 34px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {ikon === 'cari' ? <IkonCari warna={warnaBingkai} /> : <IkonChat warna={warnaBingkai} />}
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, color: warnaBingkai, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{nama}</span>
            <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 22, color: K.abu, whiteSpace: 'nowrap' }}>{sub}</span>
          </div>
        </div>
        <div style={{ position: 'relative', fontFamily: SAIRA, fontWeight: 800, fontSize: 70, lineHeight: 1.0, color: hantu > 0.5 ? K.abu : K.tinta, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
          {p.angka ?? <span style={{ color: K.abu }}>? Wh</span>}
          {coret !== undefined ? (
            <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
              <GarisDigambar d="M -6 46 L 172 26" mulai={coret} lama={0.22} warna={K.merah} tebal={9} />
            </svg>
          ) : null}
        </div>
      </div>
      {/* tag di atas kartu */}
      {tag && tag.o > 0 ? (
        <div style={{ position: 'absolute', left: p.x, top: kartuY - 28 + napas, translate: '-50% -50%', opacity: tag.o, scale: String(0.9 + 0.1 * tag.o), padding: '3px 12px', borderRadius: 8, background: tag.warna === K.abu ? 'rgba(13,23,48,0.95)' : tag.warna, border: `2px solid ${tag.warna}`, color: tag.warna === K.abu ? K.abu : K.latar, fontFamily: MONO, fontWeight: 800, fontSize: 23, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
          {tag.teks}
        </div>
      ) : null}
    </div>
  );
};
const hex = (a: number) => Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0');

// ======================================================================================================
// LANTAI → garis waktu, penggaris Wh (S3)
const Lantai: React.FC<{ T: WaktuL }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const turun = maju(t, T.keluarDunia, T.keluarDunia + 0.4, EASE.keluar);
  const garisO = 1 - maju(t, T.keluarDunia + 0.1, T.keluarDunia + 0.4);
  const tahun = [
    { x: XG.g, teks: '2009', m: T.th2009, w: K.abu },
    { x: XG.c, teks: 'awal 2023', m: T.th2023, w: K.abu },
    { x: XG.n, teks: '2025', m: T.th2025, w: K.kuning },
  ];
  const penggarisO = maju(t, S[2].mulai + 0.2, S[2].mulai + 0.5) * (1 - maju(t, T.keGaris, T.keGaris + 0.3));
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: garisO }} width={1} height={1}>
        <GarisDigambar d={`M 540 ${LANTAI} L 120 ${LANTAI}`} mulai={0.05} lama={0.3} warna={K.garis} tebal={6} />
        <GarisDigambar d={`M 540 ${LANTAI} L 980 ${LANTAI}`} mulai={0.05} lama={0.3} warna={K.garis} tebal={6} />
        {/* S6: lantai jadi garis waktu (panah ke kanan + patahan skala) */}
        <GarisDigambar d={`M 120 ${LANTAI} L 1000 ${LANTAI} M 972 ${LANTAI - 20} L 1002 ${LANTAI} L 972 ${LANTAI + 20}`} mulai={T.keGaris} lama={0.5} warna={K.abu} tebal={6} />
        <GarisDigambar d={`M 362 ${LANTAI + 18} L 378 ${LANTAI - 18} M 380 ${LANTAI + 18} L 396 ${LANTAI - 18}`} mulai={T.keGaris + 0.5} lama={0.15} warna={K.abu} tebal={5} />
        {tahun.map((y, i) => (
          <GarisDigambar key={i} d={`M ${y.x} ${LANTAI - 14} L ${y.x} ${LANTAI + 16}`} mulai={y.m - 0.15} lama={0.12} warna={y.w} tebal={6} />
        ))}
        {/* penggaris Wh di kiri (S3) */}
        <g opacity={penggarisO}>
          <GarisDigambar d={`M 140 ${LANTAI} L 140 ${LANTAI - 3.2 * PX}`} mulai={S[2].mulai + 0.2} lama={0.35} warna={K.abu} tebal={4} />
          {[0, 0.5, 1, 1.5, 2, 2.5, 3].map((w, i) => (
            <GarisDigambar key={i} d={`M 140 ${LANTAI - w * PX} L ${w % 1 === 0 ? 166 : 156} ${LANTAI - w * PX}`} mulai={S[2].mulai + 0.25 + i * 0.04} lama={0.1} warna={K.abu} tebal={4} />
          ))}
        </g>
      </svg>
      {penggarisO > 0
        ? [0, 1, 2, 3].map((w) => (
            <div key={w} style={{ position: 'absolute', left: 100, top: LANTAI - w * PX, translate: '-50% -50%', fontFamily: MONO, fontWeight: 700, fontSize: 24, color: K.abu, opacity: penggarisO }}>
              {w}
            </div>
          ))
        : null}
      {penggarisO > 0 ? <div style={{ position: 'absolute', left: 100, top: LANTAI - 3.45 * PX, translate: '-50% -50%', fontFamily: MONO, fontWeight: 800, fontSize: 24, color: K.abu, opacity: penggarisO }}>Wh</div> : null}
      {tahun.map((y, i) => {
        const o = maju(t, y.m - 0.1, y.m + 0.1) * (1 - turun);
        return o > 0 ? <Chip key={i} x={y.x} y={LANTAI + 48} teks={y.teks} warna={y.w} o={o} skala={0.9 + 0.1 * o} ukuran={30} isi={y.w === K.kuning} /> : null;
      })}
    </>
  );
};

// ======================================================================================================
// BRAKET 10× (hook "10×?" lalu S3 "≈ 10×")
const Braket: React.FC<{ T: WaktuL }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const bagian = (m: number, hapus: number, label: string, xG: number, xC: number) => {
    if (t < m || t > hapus + 0.35) return null;
    const yG = LANTAI - 0.3 * PX;
    const yC = LANTAI - 2.9 * PX;
    const xm = (xG + xC) / 2;
    const o = 1 - maju(t, hapus, hapus + 0.3);
    const p = pegas(t, m + 0.25, fps, { damping: 9, stiffness: 220, mass: 0.6 });
    const sorotP = t > T.sepuluh && t < T.sepuluh + 0.6 && label.includes('?') ? 1 + 0.12 * Math.sin(Math.PI * maju(t, T.sepuluh, T.sepuluh + 0.5, EASE.linear)) : 1;
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
          <GarisDigambar d={`M ${xG + LP / 2 + 6} ${yG} L ${xm + 18} ${yG}`} mulai={m} lama={0.15} warna={K.teal} tebal={4} />
          <GarisDigambar d={`M ${xm - 18} ${yC} L ${xC - LP / 2 - 6} ${yC}`} mulai={m} lama={0.15} warna={K.kuning} tebal={4} />
          <GarisDigambar d={`M ${xm} ${yG - 4} L ${xm} ${yC + 4} M ${xm - 16} ${yC + 26} L ${xm} ${yC + 4} L ${xm + 16} ${yC + 26}`} mulai={m + 0.1} lama={0.25} warna={K.kuning} tebal={7} />
        </svg>
        <div style={{ position: 'absolute', left: xm, top: (yG + yC) / 2 + 30, translate: '-50% -50%', scale: String(p * sorotP), padding: '2px 16px', borderRadius: 14, background: K.latar, border: `4px solid ${K.kuning}`, fontFamily: SAIRA, fontWeight: 800, fontSize: 70, color: K.kuning, whiteSpace: 'nowrap' }}>
          {label}
        </div>
      </div>
    );
  };
  return (
    <>
      {bagian(0.95, T.keDok + 0.6, '10×?', X0.g, X0.c)}
      {bagian(T.n29 + 0.55, S[3].mulai - 0.15, '≈10×', X0.g, X0.c)}
    </>
  );
};

// ======================================================================================================
// LAPORAN IEA (S2): halaman ilustrasi, judul digaris bawah, baris angka disorot
const DokumenIEA: React.FC<{ T: WaktuL }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < T.keDok - 0.2 || t > S[2].mulai + 0.6) return null;
  const masuk = maju(t, T.keDok, T.keDok + 0.9, EASE.masuk);
  const W = 640;
  const sorot1 = maju(t, T.iea + 0.35, T.iea + 0.6, EASE.kamera);
  const sorot2 = maju(t, T.iea + 0.7, T.iea + 0.95, EASE.kamera);
  const garisAbu = (y: number, w: number, key: string) => <div key={key} style={{ position: 'absolute', left: 48, top: y, width: w, height: 14, borderRadius: 7, background: '#c9d3e0' }} />;
  const baris = (y: number, kiri: string, kanan: string, p: number, warna: string) => (
    <div style={{ position: 'absolute', left: 40, top: y, width: W - 80, height: 58 }}>
      <div style={{ position: 'absolute', left: 0, top: 4, height: 50, width: `${p * 100}%`, borderRadius: 8, background: warna, opacity: 0.85 }} />
      <div style={{ position: 'absolute', left: 14, top: 8, right: 14, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontWeight: 700, fontSize: 30, color: '#0b1a33' }}>
        <span>{kiri}</span>
        <span style={{ fontWeight: 800 }}>{kanan}</span>
      </div>
    </div>
  );
  return (
    <div style={{ position: 'absolute', left: DOK.x - W / 2, top: DOK.y - 400 + (1 - masuk) * 120, width: W, height: 800, rotate: `${lerp(-6, -2, masuk) + noise('dk', t * 0.4) * 0.6}deg`, opacity: Math.min(1, masuk * 2), borderRadius: 10, background: '#eef2f7', boxShadow: '0 40px 90px rgba(0,0,0,0.6)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: 120, background: '#0b1a33', display: 'flex', alignItems: 'center', gap: 20, paddingLeft: 40 }}>
        <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 76, color: '#fff', scale: String(1 + 0.1 * Math.sin(Math.PI * maju(t, T.iea, T.iea + 0.4, EASE.linear))) }}>IEA</span>
        <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 21, color: '#9fb3cc', lineHeight: 1.2 }}>
          International
          <br />
          Energy Agency
        </span>
      </div>
      <div style={{ position: 'absolute', left: 40, top: 150, fontFamily: SLAB, fontWeight: 900, fontSize: 78, color: '#0b1a33', lineHeight: 1 }}>Electricity 2024</div>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d="M 40 248 L 560 244" mulai={T.electricity + 0.1} lama={0.45} warna={K.tealTua} tebal={9} />
      </svg>
      <div style={{ position: 'absolute', left: 40, top: 266, fontFamily: MONO, fontWeight: 600, fontSize: 25, color: '#44556e' }}>Analysis and forecast to 2026</div>
      <div style={{ position: 'absolute', right: 36, top: 330, padding: '2px 12px', borderRadius: 6, background: '#0b1a33', fontFamily: MONO, fontWeight: 800, fontSize: 22, color: '#fff' }}>hal. 34</div>
      {[380, 410, 440].map((y, i) => garisAbu(y, [520, 470, 500][i], `a${i}`))}
      {baris(484, 'Google, 1 pencarian', '0,3 Wh', sorot1, '#7fe9dc')}
      {baris(552, 'ChatGPT, 1 pertanyaan', '2,9 Wh', sorot2, '#ffd36e')}
      {[640, 670, 700, 730].map((y, i) => garisAbu(y, [530, 480, 510, 380][i], `b${i}`))}
      <div style={{ position: 'absolute', right: 30, top: 14, fontFamily: MONO, fontWeight: 500, fontSize: 18, color: '#9fb3cc' }}>ilustrasi halaman</div>
    </div>
  );
};

// ======================================================================================================
// LAMPU LED 10 W (S4): bohlam di atas kartu, cincin 20 menit; menit DIIKAT ke sapuan cincin. Hitungan kami: Wh ÷ 10 W.
const Lampu: React.FC<{ T: WaktuL }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[3].mulai - 0.1 || t > S[4].mulai + 0.6) return null;
  const keluar = maju(t, S[4].mulai - 0.15, S[4].mulai + 0.3, EASE.keluar);
  const daftar = [
    { x: X0.c, wh: 2.9, menit: maju(t, T.nyala, T.n17 + 0.5, EASE.kamera) * 17, maks: 17, warna: K.kuning, m: T.lampu, teks: (m: number) => `±${Math.round(m)} mnt`, ket: 'sekitar 17 menit', kiri: true },
    { x: X0.g, wh: 0.3, menit: maju(t, T.google4 - 0.1, T.google4 + 0.5, EASE.kamera) * 1.8, maks: 1.8, warna: K.teal, m: T.lampu + 0.15, teks: (m: number) => `${formatAngka(m, 1)} mnt`, ket: 'kurang dari 2 menit', kiri: false },
  ];
  const R = 76;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - keluar }}>
      {daftar.map((l, i) => {
        const yKartu = LANTAI - l.wh * PX - 14 - KH;
        const cy = yKartu - 104;
        const p = pegas(t, l.m, fps, { damping: 11, stiffness: 200, mass: 0.6 });
        if (t < l.m) return null;
        const jalan = l.menit / 20;
        const nyalaP = l.menit > 0.01 ? 1 : 0;
        const kelip = 0.85 + 0.15 * noise(`kl${i}`, t * 6);
        const selesai = l.menit >= l.maks - 0.01;
        const glow = nyalaP * kelip * (selesai ? 0.75 : 1);
        const sudut = jalan * Math.PI * 2;
        const ex = l.x + Math.sin(sudut) * R;
        const ey = cy - Math.cos(sudut) * R;
        const arc = jalan > 0.001 ? `M ${l.x} ${cy - R} A ${R} ${R} 0 ${jalan > 0.5 ? 1 : 0} 1 ${ex.toFixed(1)} ${ey.toFixed(1)}` : '';
        return (
          <React.Fragment key={i}>
            {glow > 0 ? <div style={{ position: 'absolute', left: l.x - 170, top: cy - 170, width: 340, height: 340, borderRadius: '50%', background: `radial-gradient(circle, ${l.warna}${hex(0.55 * glow)} 0%, ${l.warna}00 65%)` }} /> : null}
            <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
              <GarisDigambar d={`M ${l.x} ${yKartu} L ${l.x} ${cy + 46}`} mulai={l.m} lama={0.15} warna={K.abu} tebal={5} />
              <circle cx={l.x} cy={cy} r={R} fill="none" stroke={K.garis} strokeWidth={10} opacity={maju(t, l.m + 0.1, l.m + 0.3)} />
              {[0, 1, 2, 3].map((j) => {
                const a = (j / 4) * Math.PI * 2;
                return <line key={j} x1={l.x + Math.sin(a) * (R - 16)} y1={cy - Math.cos(a) * (R - 16)} x2={l.x + Math.sin(a) * (R + 16)} y2={cy - Math.cos(a) * (R + 16)} stroke={K.abu} strokeWidth={4} opacity={maju(t, l.m + 0.2, l.m + 0.4)} />;
              })}
              {arc ? <path d={arc} fill="none" stroke={l.warna} strokeWidth={12} strokeLinecap="round" /> : null}
              <g transform={`translate(${l.x} ${cy}) scale(${p.toFixed(3)})`}>
                <path d="M -30 8 Q -40 -8 -40 -20 A 40 40 0 1 1 40 -20 Q 40 -8 30 8 L 22 26 L -22 26 Z" fill={nyalaP ? l.warna : '#1b2a47'} opacity={nyalaP ? 0.35 + 0.65 * glow : 1} stroke={l.warna} strokeWidth={5} strokeLinejoin="round" />
                <path d="M -10 22 L -10 -6 L 0 -16 L 10 -6 L 10 22" fill="none" stroke={nyalaP ? '#fff' : K.abu} strokeWidth={4} strokeLinejoin="round" />
                <rect x={-22} y={28} width={44} height={10} rx={3} fill={K.abu} />
                <rect x={-18} y={40} width={36} height={8} rx={3} fill={K.abu} />
              </g>
            </svg>
            {/* menit */}
            {l.menit > 0.001 ? (
              <div style={{ position: 'absolute', left: l.kiri ? l.x - R - 24 : l.x + R + 24, top: cy - 52, translate: l.kiri ? '-100% 0' : '0 0', textAlign: l.kiri ? 'right' : 'left', whiteSpace: 'nowrap' }}>
                <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 70, lineHeight: 1, color: l.warna, fontVariantNumeric: 'tabular-nums' }}>{l.teks(l.menit)}</div>
                <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 22, color: K.abu, opacity: selesai ? 1 : 0 }}>{l.ket}</div>
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ======================================================================================================
// PUSAT DATA (S5, di bawah lantai): rak server, chip, kabel ke pilar ChatGPT, jawaban AI muncul per token
const TOKEN = ['Ibu', 'kota', 'Indo', 'nesia', 'ada', 'lah', 'Jakarta', '.'];
const PusatData: React.FC<{ T: WaktuL }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[3].mulai + 2 || t > S[5].mulai + 1.2) return null;
  const o = maju(t, T.keChip - 0.2, T.keChip + 0.3) * (1 - maju(t, S[5].mulai + 0.4, S[5].mulai + 1.0));
  const waktuTok = TOKEN.map((_, i) => T.ngitung5 + i * ((T.token - 0.25 - T.ngitung5) / TOKEN.length));
  const denyut = Math.max(0, ...waktuTok.map((w) => (t >= w && t < w + 0.3 ? 1 - (t - w) / 0.3 : 0)));
  const kabel = `M ${CHIP.x} ${CHIP.y - 128} L ${CHIP.x} ${LANTAI + 4}`;
  const B = { x: 100, y: 1530, w: 470, h: 300 };
  // posisi token (bungkus manual)
  let cx = 24;
  let cy = 74;
  const pos = TOKEN.map((tk) => {
    const w = tk.length * 26 + 30;
    if (cx + w > B.w - 20) {
      cx = 24;
      cy += 76;
    }
    const r = { x: cx, y: cy, w };
    cx += w + 10;
    return r;
  });
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      {/* rak server */}
      {[0, 1, 2].map((r) => (
        <div key={r} style={{ position: 'absolute', left: 610 + r * 140 - (r === 1 ? 0 : 0), top: 1480 + (r === 1 ? -30 : 0), width: 120, height: 440, borderRadius: 10, border: `3px solid ${K.garis}`, background: 'rgba(13,23,48,0.75)', opacity: 0.8 }}>
          {Array.from({ length: 9 }, (_, j) => (
            <div key={j} style={{ position: 'absolute', left: 12, top: 18 + j * 46, width: 96, height: 30, borderRadius: 5, border: `2px solid ${K.garis}` }}>
              <div style={{ position: 'absolute', right: 8, top: 10, width: 8, height: 8, borderRadius: 4, background: noise(`led${r}${j}`, t * 3) > 0.1 ? K.teal : '#25385c' }} />
            </div>
          ))}
        </div>
      ))}
      <div style={{ position: 'absolute', left: 728, top: 1452, translate: '-100% 0', fontFamily: MONO, fontWeight: 800, fontSize: 24, letterSpacing: '0.1em', color: K.abu }}>DATA CENTER</div>
      {/* kabel ke pilar */}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d={kabel} mulai={T.chip5 - 0.2} lama={0.3} warna={K.kuning} tebal={8} />
        <GarisDigambar d={`M ${CHIP.x - 128} ${CHIP.y} L ${B.x + B.w + 6} ${CHIP.y}`} mulai={T.ngitung5 - 0.25} lama={0.2} warna={K.teal} tebal={5} />
        {/* percikan per token: chip → kabel → pilar */}
        {waktuTok.map((w, i) => {
          const p = maju(t, w, w + 0.45, EASE.jatuh);
          if (p <= 0 || p >= 1) return null;
          const y = lerp(CHIP.y - 128, LANTAI, p);
          return <circle key={i} cx={CHIP.x} cy={y} r={13} fill="#fff" stroke={K.kuning} strokeWidth={5} />;
        })}
        {waktuTok.map((w, i) => {
          const p = maju(t, w - 0.18, w, EASE.linear);
          if (p <= 0 || p >= 1) return null;
          return <circle key={`k${i}`} cx={lerp(CHIP.x - 128, B.x + B.w, p)} cy={CHIP.y} r={9} fill={K.teal} />;
        })}
      </svg>
      {/* chip */}
      <div style={{ position: 'absolute', left: CHIP.x - 128, top: CHIP.y - 128, width: 256, height: 256, scale: String(1 + 0.05 * denyut) }}>
        <svg width={256} height={256} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {Array.from({ length: 6 }, (_, i) => {
            const u = 48 + i * 32;
            return (
              <g key={i} stroke={K.abu} strokeWidth={6} strokeLinecap="round">
                <line x1={u} y1={-14} x2={u} y2={20} />
                <line x1={u} y1={236} x2={u} y2={270} />
                <line x1={-14} y1={u} x2={20} y2={u} />
                <line x1={236} y1={u} x2={270} y2={u} />
              </g>
            );
          })}
        </svg>
        <div style={{ position: 'absolute', left: 20, top: 20, width: 216, height: 216, borderRadius: 22, background: '#13213f', border: `5px solid ${K.teal}`, boxShadow: `0 0 ${20 + 50 * denyut}px ${K.teal}${hex(0.35 + 0.4 * denyut)}` }}>
          <div style={{ position: 'absolute', left: 38, top: 38, width: 130, height: 130, borderRadius: 12, border: `4px solid ${K.tealTua}`, backgroundImage: `linear-gradient(${K.tealTua}55 2px, transparent 2px), linear-gradient(90deg, ${K.tealTua}55 2px, transparent 2px)`, backgroundSize: '26px 26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 34, color: K.teal }}>
            chip
          </div>
        </div>
      </div>
      {/* gelembung jawaban: token muncul satu-satu */}
      <div style={{ position: 'absolute', left: B.x, top: B.y, width: B.w, height: B.h, borderRadius: 26, background: 'rgba(13,23,48,0.95)', border: `4px solid ${K.teal}`, opacity: maju(t, T.ngitung5 - 0.4, T.ngitung5 - 0.1) }}>
        <div style={{ position: 'absolute', left: 24, top: 20, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: K.abu }}>jawaban AI · contoh</div>
        {TOKEN.map((tk, i) => {
          const pp = pegas(t, waktuTok[i], fps, { damping: 12, stiffness: 220, mass: 0.5 });
          if (t < waktuTok[i]) return null;
          const hit = t > T.token - 0.05;
          return (
            <div key={i} style={{ position: 'absolute', left: pos[i].x, top: pos[i].y, width: pos[i].w, height: 60, scale: String(pp), borderRadius: 12, border: `3px solid ${hit ? K.kuning : K.teal}`, background: hit ? 'rgba(255,197,61,0.14)' : 'rgba(61,219,200,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SAIRA, fontWeight: 700, fontSize: 42, color: K.tinta }}>
              {tk}
            </div>
          );
        })}
      </div>
      <Pop mulai={T.token - 0.05} keluar={S[5].mulai + 0.3} gaya={{ position: 'absolute', left: B.x, top: B.y + B.h + 18, width: B.w, display: 'flex', justifyContent: 'center' }}>
        <div style={{ padding: '4px 18px', borderRadius: 12, background: K.kuning, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 50, whiteSpace: 'nowrap' }}>1 kotak = 1 token</div>
      </Pop>
    </div>
  );
};

// ======================================================================================================
// ALASAN SELISIH (S8): panah turun 2023 → 2025, lencana "chip & model lebih hemat", gelembung jawaban panjang (perkiraan lama)
const Alasan: React.FC<{ T: WaktuL }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[7].mulai - 0.1 || t > S[8].mulai + 0.6) return null;
  const keluar = maju(t, S[8].mulai - 0.15, S[8].mulai + 0.3, EASE.keluar);
  const yC = LANTAI - 2.9 * PX;
  const yN = LANTAI - 0.3 * PX - 14 - KH;
  const lencana = pegas(t, T.model8, fps, { damping: 11, stiffness: 200, mass: 0.6 });
  const B = { x: 110, y: 660, w: 270, h: 300 };
  const nBaris = Math.floor(lerp(0, 9, maju(t, T.hitungan8, T.panjang8 + 0.2, EASE.linear)));
  const gelO = maju(t, T.hitungan8 - 0.2, T.hitungan8 + 0.1);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - keluar }}>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d={pathPanah(XG.c + LP / 2 + 14, yC + 10, XG.n - 30, yN - 40, -70, 30)} mulai={S[7].mulai + 0.05} lama={0.4} warna={K.teal} tebal={8} />
        {gelO > 0 ? <GarisDigambar d={`M ${B.x + B.w} ${B.y + 60} Q ${XG.c - 60} ${B.y + 20} ${XG.c - KW / 2 + 10} ${yC - KH - 14 + 30}`} mulai={T.hitungan8} lama={0.25} warna={K.merah} tebal={4} /> : null}
      </svg>
      {/* lencana chip & model lebih hemat */}
      {t > T.model8 ? (
        <div style={{ position: 'absolute', left: 830, top: 745, translate: '-50% -50%', scale: String(lencana), display: 'flex', alignItems: 'center', gap: 14, padding: '10px 20px', borderRadius: 18, background: 'rgba(13,23,48,0.96)', border: `4px solid ${K.teal}` }}>
          <svg width={58} height={58} viewBox="-29 -29 58 58">
            <rect x={-18} y={-18} width={36} height={36} rx={6} fill="none" stroke={K.teal} strokeWidth={5} />
            {[-9, 0, 9].map((u) => (
              <g key={u} stroke={K.teal} strokeWidth={4} strokeLinecap="round">
                <line x1={u} y1={-27} x2={u} y2={-20} />
                <line x1={u} y1={20} x2={u} y2={27} />
                <line x1={-27} y1={u} x2={-20} y2={u} />
                <line x1={20} y1={u} x2={27} y2={u} />
              </g>
            ))}
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.0 }}>
            <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 44, color: K.tinta, whiteSpace: 'nowrap' }}>model & chip</span>
            <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 44, color: K.teal, whiteSpace: 'nowrap', opacity: maju(t, T.hemat - 0.1, T.hemat + 0.1) }}>lebih hemat</span>
          </div>
        </div>
      ) : null}
      {/* gelembung jawaban panjang (perkiraan lama) */}
      {gelO > 0 ? (
        <div style={{ position: 'absolute', left: B.x, top: B.y, width: B.w, height: 70 + Math.max(1, nBaris) * 24, borderRadius: 20, background: 'rgba(13,23,48,0.96)', border: `4px dashed ${K.merah}`, opacity: gelO }}>
          <div style={{ position: 'absolute', left: 18, top: 14, fontFamily: MONO, fontWeight: 800, fontSize: 21, color: K.merah }}>PERKIRAAN LAMA</div>
          {Array.from({ length: nBaris }, (_, i) => (
            <div key={i} style={{ position: 'absolute', left: 20, top: 56 + i * 24, width: [220, 200, 226, 180, 214, 196, 224, 170, 210][i], height: 12, borderRadius: 6, background: '#5b6f92' }} />
          ))}
        </div>
      ) : null}
      {t > T.panjang8 - 0.3 ? (
        <div style={{ position: 'absolute', left: B.x - 14, top: B.y - 74, fontFamily: TANGAN, fontWeight: 700, fontSize: 36, color: K.merah, rotate: '-4deg', opacity: maju(t, T.panjang8 - 0.3, T.panjang8), whiteSpace: 'nowrap' }}>
          dikira sepanjang ini
        </div>
      ) : null}
    </div>
  );
};

// ======================================================================================================
// REASONING (S9): jawaban panjang + "mikir dulu" → pilar 2025 naik (arsir = gak ada angka pasti), panah ke atas
const Reasoning: React.FC<{ T: WaktuL }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[8].mulai - 0.1 || t > T.keluarDunia + 0.5) return null;
  const keluar = maju(t, T.keluarDunia, T.keluarDunia + 0.35, EASE.keluar);
  const B = { x: 400, y: 880, w: 290 };
  const nBaris = Math.floor(lerp(2, 9, maju(t, T.jawaban9, T.panjang9 + 0.6, EASE.linear)));
  const gO = maju(t, S[8].mulai + 0.1, S[8].mulai + 0.35);
  const awan = pegas(t, T.reasoning - 0.05, fps, { damping: 11, stiffness: 200, mass: 0.6 });
  const titik = Math.floor(((t - T.mikir) * 4) % 4);
  const yAtas = LANTAI - 4.2 * PX;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - keluar }}>
      <div style={{ position: 'absolute', left: B.x, top: B.y + 260 - (60 + nBaris * 28), width: B.w, height: 60 + nBaris * 28, borderRadius: 22, background: 'rgba(13,23,48,0.96)', border: `4px solid ${K.kuning}`, opacity: gO }}>
        <div style={{ position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontWeight: 800, fontSize: 21, color: K.kuning }}>JAWABAN PANJANG</div>
        {Array.from({ length: nBaris }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: 20, top: 48 + i * 28, width: [240, 220, 250, 200, 236, 214, 246, 190, 228][i], height: 13, borderRadius: 6, background: '#6d7fa0' }} />
        ))}
      </div>
      {t > T.reasoning - 0.05 ? (
        <div style={{ position: 'absolute', left: B.x + B.w / 2, top: B.y + 260 - (60 + nBaris * 28) - 92, translate: '-50% -50%', scale: String(awan), padding: '14px 30px', borderRadius: 60, background: 'rgba(13,23,48,0.96)', border: `4px solid ${K.teal}`, fontFamily: SAIRA, fontWeight: 800, fontSize: 46, color: K.teal, whiteSpace: 'nowrap' }}>
          mikir dulu{'.'.repeat(Math.max(0, titik))}
          <span style={{ opacity: 0 }}>{'.'.repeat(3 - Math.max(0, titik))}</span>
        </div>
      ) : null}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d={`M ${XG.n + LP / 2 + 50} ${LANTAI - 0.3 * PX - 20} L ${XG.n + LP / 2 + 50} ${yAtas + 40} M ${XG.n + LP / 2 + 26} ${yAtas + 70} L ${XG.n + LP / 2 + 50} ${yAtas + 40} L ${XG.n + LP / 2 + 74} ${yAtas + 70}`} mulai={T.bisa} lama={0.6} warna={K.kuning} tebal={9} />
      </svg>
      {t > T.banyak - 0.2 ? (
        <div style={{ position: 'absolute', left: XG.n - KW / 2 - 20, top: yAtas - 150, translate: '-100% 0', rotate: '-4deg', fontFamily: TANGAN, fontWeight: 700, fontSize: 48, color: K.kuning, whiteSpace: 'nowrap', opacity: maju(t, T.banyak - 0.2, T.banyak + 0.1) }}>
          bisa jauh lebih banyak
        </div>
      ) : null}
    </div>
  );
};

// ======================================================================================================
// HUD: teks atas per kalimat + sumber kecil
const Hud: React.FC<{ T: WaktuL }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const kl = (i: number) => S[i + 1].mulai - 0.2;
  const sumber = t < S[3].mulai - 0.1 ? 'Sumber: IEA, Electricity 2024 (hal. 34)'
    : t < S[4].mulai - 0.1 ? 'Lampu LED: hitungan kami dari angka IEA'
      : t < S[6].mulai - 0.1 ? 'Sumber: Epoch AI (Feb 2025) · IEA Electricity 2024'
        : 'Sumber: Epoch AI, "How much energy does ChatGPT use?" (2025)';
  const sO = maju(t, 1.3, 1.6) * (1 - maju(t, T.keluarDunia - 0.1, T.keluarDunia + 0.2));
  return (
    <>
      <TeksSeri
        label={['KLAIM', 'YANG', 'SERING', 'DIKUTIP']} lMulai={0.1}
        judul={[{ t: 'ChatGPT', mulai: 0.18 }, { t: '=', mulai: 0.26, warna: K.abu }, { t: '10×', mulai: 0.34, isi: sorot('10×', T.sepuluh) }, { t: 'Google?', mulai: 0.42 }]}
        jMulai={0.18} keluar={kl(0)}
      />
      <TeksSeri
        label={['SUMBER', 'ANGKANYA']} lMulai={S[1].mulai}
        judul={[{ t: 'IEA', mulai: S[1].mulai + 0.25, warna: K.kuning }, { t: '·', mulai: S[1].mulai + 0.35, warna: K.abu }, { t: 'Electricity', mulai: T.electricity }, { t: '2024', mulai: T.th2024 }]}
        jMulai={S[1].mulai + 0.25} keluar={kl(1)} catatan="IEA = badan energi internasional" cMulai={T.badan}
      />
      <TeksSeri
        label={['PERKIRAAN', 'IEA']} lMulai={S[2].mulai}
        judul={[{ t: '0,3 Wh', mulai: T.n03, warna: K.teal }, { t: 'vs', mulai: T.chatgpt3, warna: K.abu }, { t: '2,9 Wh', mulai: T.n29, isi: sorot('2,9 Wh', T.n29 + 0.3) }]}
        jMulai={T.n03} keluar={kl(2)} catatan="Wh = watt-hour (watt-jam)" cMulai={T.n03 + 0.6}
      />
      <TeksSeri
        label={['HITUNGAN', 'KAMI']} lMulai={S[3].mulai}
        judul={[{ t: 'LED', mulai: T.lampu }, { t: '10 W:', mulai: T.watt4 - 0.2 }, { t: '±17 mnt', mulai: T.n17, warna: K.kuning }, { t: 'vs', mulai: T.sedangkan, warna: K.abu }, { t: '< 2 mnt', mulai: T.n2, warna: K.teal }]}
        jMulai={T.lampu} keluar={kl(3)} catatan="Wh ÷ 10 watt · waktu di animasi dipercepat" cMulai={T.nyala}
      />
      <TeksSeri
        label={['LISTRIKNYA', 'DIPAKAI']} lMulai={S[4].mulai}
        judul={[{ t: 'token', mulai: T.potongan, warna: K.kuning }, { t: '→', mulai: T.ngitung5, warna: K.teal }, { t: 'chip', mulai: T.chip5 }, { t: '→', mulai: T.chip5 + 0.3, warna: K.teal }, { t: 'listrik', mulai: S[4].mulai + 0.1 }]}
        jMulai={S[4].mulai + 0.1} keluar={kl(4)} catatan="token = potongan kata" cMulai={T.token}
      />
      <TeksSeri
        label={['ASAL', 'ANGKANYA']} lMulai={S[5].mulai}
        judul={[{ t: 'data', mulai: T.awal6 }, { t: '2023', mulai: T.th2023, warna: K.abu }, { t: '·', mulai: T.google6 - 0.1, warna: K.abu }, { t: 'Google', mulai: T.google6 }, { t: '2009', mulai: T.th2009, warna: K.abu }]}
        jMulai={T.awal6} keluar={kl(5)} catatan="dua-duanya perkiraan lama" cMulai={T.th2009 + 0.3}
      />
      <TeksSeri
        label={['HITUNGAN', 'ULANG']} lMulai={S[6].mulai}
        judul={[{ t: 'Epoch AI', mulai: T.th2025 + 0.1 }, { t: '2025:', mulai: T.th2025, warna: K.kuning }, { t: '±0,3 Wh', mulai: T.n03b - 0.1, isi: sorot('±0,3 Wh', T.n03b + 0.25) }]}
        jMulai={T.th2025} keluar={kl(6)} catatan="pertanyaan biasa ke ChatGPT (GPT-4o)" cMulai={T.gpt4o}
      />
      <TeksSeri
        label={['SELISIHNYA', 'KARENA']} lMulai={S[7].mulai}
        judul={[{ t: 'model', mulai: T.model8 }, { t: '&', mulai: T.chip8 - 0.15, warna: K.abu }, { t: 'chip', mulai: T.chip8 }, { t: 'lebih', mulai: T.hemat - 0.25 }, { t: 'hemat', mulai: T.hemat, isi: sorot('hemat', T.hemat + 0.15, K.teal) }]}
        jMulai={T.model8} keluar={kl(7)} catatan="+ hitungan lama ngira jawaban AI jauh lebih panjang" cMulai={T.hitungan8} cWarna={K.merah}
      />
      <TeksSeri
        label={['BISA', 'JAUH', 'LEBIH', 'BANYAK']} lMulai={S[8].mulai}
        judul={[{ t: 'teks', mulai: T.jawaban9 }, { t: 'panjang', mulai: T.panjang9 }, { t: '&', mulai: T.reasoning - 0.2, warna: K.abu }, { t: 'reasoning', mulai: T.reasoning, isi: sorot('reasoning', T.mikir) }]}
        jMulai={T.jawaban9} keluar={kl(8)}
      />
      <TeksSeri
        label={['BIAR', 'INGET', 'ASAL', 'ANGKANYA']} lMulai={S[9].mulai}
        judul={[{ t: 'simpan', mulai: T.simpan + 0.05, warna: K.kuning }, { t: '&', mulai: T.follow - 0.25, warna: K.abu }, { t: 'follow', mulai: T.follow, warna: K.teal }]}
        jMulai={T.simpan} keluar={T.keluarCta}
      />
      <Sumber teks={sumber} o={sO} />
    </>
  );
};

// ======================================================================================================
function daftarSfx(T: WaktuL) {
  const S = T.s;
  const tikG = Array.from({ length: 3 }, (_, i) => bunyi('tik', T.n03 - 0.1 + i * 0.16, 0.22));
  const tikC = Array.from({ length: 7 }, (_, i) => bunyi('tik', T.chatgpt3 + 0.1 + i * 0.14, 0.2));
  const tikL = Array.from({ length: 6 }, (_, i) => bunyi('tik', T.nyala + i * 0.2, 0.16));
  const tok = Array.from({ length: TOKEN.length }, (_, i) => bunyi('tik', T.ngitung5 + i * ((T.token - 0.25 - T.ngitung5) / TOKEN.length), 0.24));
  const susut = Array.from({ length: 8 }, (_, i) => bunyi('tik', T.ulang + 1.2 + i * ((T.n03b + 0.3 - T.ulang - 1.2) / 8), 0.13));
  return [
    bunyi('sapuHit', 0.08, 0.4),
    bunyi('pop', 0.3, 0.35),
    bunyi('whooshPunch', 0.42, 0.4),
    bunyi('hantam', 1.03, 0.4),
    bunyi('jepret', 1.12, 0.3),
    bunyi('swish', T.sepuluh, 0.28),
    bunyi('whooshA', T.keDok + 0.3, 0.4),
    bunyi('swish', T.electricity + 0.15, 0.25),
    bunyi('pop', T.iea + 0.05, 0.3),
    bunyi('klik', T.iea + 0.4, 0.3),
    bunyi('klik', T.iea + 0.75, 0.3),
    bunyi('whooshB', T.balik + 0.3, 0.4),
    bunyi('swish', S[2].mulai + 0.3, 0.2),
    ...tikG,
    ...tikC,
    bunyi('pop', T.n29 + 0.7, 0.35),
    bunyi('pop', T.lampu + 0.05, 0.3),
    bunyi('pop', T.lampu + 0.2, 0.3),
    ...tikL,
    bunyi('jepret', T.n17 + 0.5, 0.25),
    bunyi('tik', T.google4, 0.22),
    bunyi('tik', T.google4 + 0.2, 0.22),
    bunyi('whooshTurun', T.keChip + 0.2, 0.45),
    bunyi('swish', T.chip5 - 0.15, 0.25),
    ...tok,
    bunyi('kunci', T.token, 0.4),
    bunyi('whooshLembut', T.keGaris + 0.2, 0.4),
    bunyi('swish', T.keGaris + 0.35, 0.25),
    bunyi('pop', T.th2023, 0.3),
    bunyi('pop', T.th2009, 0.3),
    bunyi('pop', T.th2025, 0.35),
    bunyi('whooshPop', T.ulang - 0.05, 0.35),
    bunyi('glitch', T.ulang + 0.55, 0.3),
    ...susut,
    bunyi('hantam', T.n03b + 0.3, 0.35),
    bunyi('swish', S[7].mulai + 0.1, 0.3),
    bunyi('pop', T.model8 + 0.05, 0.3),
    bunyi('swish', T.hitungan8, 0.22),
    bunyi('whooshLembut', S[8].mulai, 0.3),
    bunyi('pop', T.reasoning, 0.3),
    bunyi('riser', T.banyak + 0.3, 0.28),
    bunyi('whooshTerang', T.keluarDunia + 0.2, 0.35),
    bunyi('pop', T.simpan + 0.1, 0.35),
    bunyi('klik', T.simpan + 0.55, 0.4),
    bunyi('pop', T.follow - 0.2, 0.3),
    bunyi('klik', T.follow + 0.3, 0.4),
    bunyi('whooshLembut', T.keluarCta + 0.05, 0.3),
  ];
}
