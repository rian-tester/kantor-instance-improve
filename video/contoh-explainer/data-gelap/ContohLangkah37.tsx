// Frame hero (pembuka, tengah, puncak): 15, 864, 1439.
// contoh video explainer A7 (akun generik, konten contoh): "Langkah 37: langkah AlphaGo yang peluang dipilih manusianya 1 : 10.000".
// SATU DUNIA: papan Go 19×19 (digambar sendiri, posisi = ILUSTRASI, bukan rekaman pertandingan). Batu hitam #37 dibanting (hook) →
// batu nyusut jadi 1 titik kuning di antara 10.000 titik → papan + plakat (AlphaGo · Lee Sedol · game 2 · Maret 2016) → papan jadi
// ubin papan tak terhingga (10^170) → 30 juta langkah masuk ke AlphaGo + peta langkah yang biasa dipilih manusia → main lawan diri
// sendiri + pohon akibat → titik #37 dingin (1 : 10.000) tapi dicek ke depan → tetap dipilih → komentator "salah?" + jam Lee ±15 menit
// → papan skor 5 game: G2 AlphaGo menang → G4: batu putih #78, Lee menang → CTA → latar kosong (loop).
// Fakta: Google DeepMind (halaman AlphaGo) & WIRED (Cade Metz, 16/03/2016). Tanpa foto/logo DeepMind, tanpa wajah Lee Sedol.
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, random, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  AngkaJalan, Bunyi, Dunia, EASE, formatAngka, GarisDigambar, Grain, maju, noise, pathPanah, pegas, Stempel, Subtitle, useDetik,
  type KunciKamera, type Kata,
} from "../../src/gerak";
import { MONO, SAIRA, TANGAN } from "../../src/gerak/font";
import { bunyi, K } from "./raja/gaya";
import type { Kalimat } from "./raja/waktuRaja";
import { CtaSimpanFollow, kameraSeri, LatarSeri, lerp, PeneduhAtas, sorot, Sumber, TeksSeri } from "../../src/gerak/seri/data-gelap/seri";
import { waktuLangkah, type WaktuG } from "./langkah/waktuLangkah";

export type DataLangkah = { durasi: number; kata: Kata[]; kalimat?: Kalimat[] };

// papan
export const PAPAN = { cx: 540, cy: 950, sel: 36, tepi: 46 };
const SPAN = 18 * PAPAN.sel; // 648
const UK = SPAN + 2 * PAPAN.tepi; // 740
const X0 = PAPAN.cx - SPAN / 2;
const Y0 = PAPAN.cy - SPAN / 2;
export const titik = (i: number, j: number) => ({ x: X0 + i * PAPAN.sel, y: Y0 + j * PAPAN.sel });
const KAYU = '#c99a5b';
const KAYU2 = '#b88745';
const GARIS_PAPAN = '#3b2a14';
const L37 = { i: 14, j: 8 };
const L78 = { i: 9, j: 7 };
// posisi ilustrasi (bukan rekaman pertandingan): gerombol pembukaan di 4 sudut + sisi; #37 = "shoulder hit" ke batu putih (15,9)
export const HITAM = [[5, 4], [6, 3], [4, 6], [15, 3], [13, 2], [16, 5], [14, 14], [12, 15], [16, 11], [3, 15], [2, 13], [5, 16], [2, 9], [10, 3], [9, 15], [6, 9]];
export const PUTIH = [[3, 3], [5, 2], [2, 5], [3, 7], [13, 4], [16, 3], [12, 3], [15, 15], [16, 13], [13, 16], [2, 11], [5, 14], [6, 16], [15, 9], [16, 7], [3, 10], [8, 16], [10, 5]];
const BINTANG = [3, 9, 15];

// ======================================================================================================
export const ContohLangkah37: React.FC<DataLangkah> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuLangkah(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const S = T.s;
  const pelan = Easing.linear;
  const p37 = titik(L37.i, L37.j);
  const kunci: KunciKamera[] = [
    { t: 0, x: 540, y: 960, z: 1.0 },
    { t: 0.6, x: 600, y: 940, z: 1.12 },
    { t: S[0].mulai + 3.4, x: 605, y: 938, z: 1.16, ease: pelan },
    { t: T.n1 + 0.2, x: 540, y: 950, z: 1.0 },
    { t: S[1].mulai - 0.1, x: 545, y: 948, z: 1.03, ease: pelan },
    { t: T.n37 + 0.4, x: p37.x - 40, y: p37.y, z: 1.35 },
    { t: T.alphago2 - 0.1, x: p37.x - 36, y: p37.y + 4, z: 1.4, ease: pelan },
    { t: T.alphago2 + 0.6, x: 540, y: 960, z: 1.0 },
    { t: S[2].mulai - 0.1, x: 544, y: 962, z: 1.04, ease: pelan },
    { t: S[2].mulai + 0.4, x: 540, y: 950, z: 1.0 },
    { t: S[3].mulai, x: 540, y: 950, z: 1.0, ease: pelan },
    { t: S[4].mulai - 0.1, x: 544, y: 952, z: 1.04, ease: pelan },
    { t: S[4].mulai + 0.5, x: 540, y: 960, z: 1.0 },
    { t: S[5].mulai - 0.1, x: 543, y: 958, z: 1.03, ease: pelan },
    { t: S[5].mulai + 0.6, x: p37.x - 60, y: p37.y + 20, z: 1.3 },
    { t: T.ngecek, x: p37.x - 56, y: p37.y + 22, z: 1.36, ease: pelan },
    { t: T.ngecek + 0.5, x: p37.x - 120, y: p37.y + 10, z: 1.15 },
    { t: S[6].mulai - 0.1, x: p37.x - 118, y: p37.y + 12, z: 1.18, ease: pelan },
    { t: S[6].mulai + 0.6, x: 540, y: 990, z: 0.95 },
    { t: S[7].mulai - 0.1, x: 542, y: 992, z: 0.98, ease: pelan },
    { t: S[7].mulai + 0.5, x: 540, y: 1010, z: 0.86 },
    { t: T.keluarDunia, x: 542, y: 1008, z: 0.9, ease: pelan },
    { t: T.simpan + 0.8, x: 540, y: 960, z: 1.0 },
    { t: T.loop, x: 540, y: 960, z: 1.02, ease: pelan },
    { t: total, x: 540, y: 960, z: 1.0 },
  ];
  const kam = kameraSeri(kunci, t, fps, total, [
    { t: 0.45, kuat: 10, lama: 0.16 },
    { t: T.tetap + 0.1, kuat: 8, lama: 0.14 },
    { t: T.n78 + 0.1, kuat: 8, lama: 0.14 },
  ]);
  return (
    <AbsoluteFill style={{ background: K.latar, color: K.tinta, overflow: 'hidden', fontFamily: SAIRA }}>
      <LatarSeri kam={kam} />
      <Dunia kamera={kam} tinggiDunia={2300} lebarDunia={2200} blurGerak={1300}>
        <PapanGo T={T} />
        <Titik10rb T={T} />
        <Ubin T={T} />
        <Belajar T={T} />
        <LawanDiri T={T} />
        <Cek37 T={T} />
        <Peluang78 T={T} />
      </Dunia>
      <PeneduhAtas />
      <Plakat T={T} />
      <Bandingan T={T} />
      <Komentator T={T} />
      <PapanSkor T={T} />
      <Hud T={T} />
      <CtaSimpanFollow simpan={T.simpan + 0.1} follow={T.follow} keluar={T.keluarCta} />
      <Subtitle
        kata={d.kata} kalimat={d.kalimat} font={SAIRA} tebal={700} ukuran={46} maksHuruf={32} sorot={K.kuning} sampai={T.akhirVO + 0.3}
        zona={[{ dari: 0, x: 540, y: 1326, lebar: 940 }]} pita="rgba(7,12,24,0.55)"
      />
      <Grain kuat={0.07} garisScan={0} vinyet={0.5} warnaVinyet="2,5,14" />
      <></>
    </AbsoluteFill>
  );
};

// ======================================================================================================
// BATU GO
export const Batu: React.FC<{ x: number; y: number; hitam: boolean; r?: number; nomor?: string; cincin?: string; skala?: number; o?: number }> = ({
  x, y, hitam, r = 16.5, nomor, cincin, skala = 1, o = 1,
}) => (
  <div style={{ position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: '50%', scale: String(skala), opacity: o, background: hitam ? 'radial-gradient(circle at 35% 30%, #4a4a4a 0%, #121212 55%, #050505 100%)' : 'radial-gradient(circle at 35% 30%, #ffffff 0%, #e9edf2 55%, #b9c2cc 100%)', boxShadow: `2px 3px 4px rgba(0,0,0,0.45)${cincin ? `, 0 0 0 5px ${cincin}, 0 0 26px ${cincin}` : ''}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SAIRA, fontWeight: 800, fontSize: r * 1.15, color: hitam ? K.kuning : '#0f5f58' }}>
    {nomor}
  </div>
);

// PAPAN: muncul di awal, redup pas adegan lain nimpa, batu #37 dibanting (hook & S6), batu #78 (S9)
const PapanGo: React.FC<{ T: WaktuG }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < 0.04) return null;
  const masuk = pegas(t, 0.05, fps, { damping: 14, stiffness: 160, mass: 0.7 });
  const keluar = maju(t, T.keluarDunia, T.keluarDunia + 0.45, EASE.keluar);
  // redup: 10.000 titik (S1), ubin (S3), belajar/lawan diri (S4–S5), komentator (S7)
  const redup = Math.max(
    maju(t, T.n1 - 0.25, T.n1 + 0.1) * (1 - maju(t, S[1].mulai - 0.4, S[1].mulai)),
    maju(t, S[2].mulai + 0.2, S[2].mulai + 0.6) * (1 - maju(t, S[3].mulai - 0.3, S[3].mulai + 0.1)),
    0.75 * maju(t, T.belajar4 - 0.3, T.belajar4) * (1 - maju(t, T.tahu - 0.2, T.tahu + 0.2)),
    0.8 * maju(t, S[4].mulai - 0.1, S[4].mulai + 0.3) * (1 - maju(t, S[5].mulai - 0.2, S[5].mulai + 0.3)),
    0.55 * maju(t, S[6].mulai, S[6].mulai + 0.3) * (1 - maju(t, S[7].mulai, S[7].mulai + 0.3)),
  );
  // batu #37: dibanting di 0,35 (hook), ilang jadi titik (S1), balik; dibanting lagi di "tetap milih" (S6)
  const banting = (m: number) => (t < m ? 1 : t < m + 0.08 ? lerp(2.2, 1, maju(t, m, m + 0.08, Easing.in(Easing.quad))) : 1 - 0.12 * Math.exp(-(t - m - 0.08) * 14) * Math.cos((t - m - 0.08) * 40));
  const jadiTitik = maju(t, T.n1 - 0.2, T.n1 + 0.1, EASE.kamera) * (1 - maju(t, S[1].mulai - 0.5, S[1].mulai - 0.1, EASE.kamera));
  const s37 = t < 0.35 ? 0 : (t > T.tetap - 0.02 && t < T.tetap + 0.4 ? banting(T.tetap) : banting(0.35)) * lerp(1, 0.18, jadiTitik);
  const p37 = titik(L37.i, L37.j);
  const p78 = titik(L78.i, L78.j);
  const s78 = t < T.n78 - 0.08 ? 0 : banting(T.n78 - 0.08);
  const nomor37 = t > T.n37 - 0.1;
  // S4: peta langkah yang biasa dipilih manusia (panas di titik umum, titik #37 dingin)
  const peta = maju(t, T.tahu - 0.1, T.tahu + 0.4) * (1 - maju(t, S[4].mulai - 0.2, S[4].mulai + 0.2)) + 0.6 * maju(t, T.peluang6 - 0.2, T.peluang6 + 0.2) * (1 - maju(t, T.ngecek, T.ngecek + 0.4));
  const panas = [[3, 3], [15, 15], [15, 3], [3, 15], [2, 16], [16, 2], [9, 9], [3, 10], [15, 10], [10, 3], [4, 4], [14, 14], [16, 16], [2, 2]];
  const napas = 1 + 0.006 * Math.sin(t * 1.7);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: (1 - keluar) * Math.min(1, masuk * 2) }}>
      <div style={{ position: 'absolute', left: PAPAN.cx - UK / 2, top: PAPAN.cy - UK / 2, width: UK, height: UK, scale: String(lerp(0.9, 1, Math.min(1, masuk)) * napas), borderRadius: 14, background: `linear-gradient(135deg, ${KAYU} 0%, ${KAYU2} 100%)`, boxShadow: '0 40px 90px rgba(0,0,0,0.55)', filter: redup > 0 ? `brightness(${1 - 0.7 * redup})` : undefined }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 14, backgroundImage: 'repeating-linear-gradient(95deg, rgba(90,55,20,0.07) 0 6px, transparent 6px 19px)' }} />
        <svg width={UK} height={UK} style={{ position: 'absolute', left: 0, top: 0 }}>
          <g transform={`translate(${PAPAN.tepi} ${PAPAN.tepi})`} stroke={GARIS_PAPAN} strokeWidth={2.2}>
            {Array.from({ length: 19 }, (_, i) => (
              <React.Fragment key={i}>
                <line x1={i * PAPAN.sel} y1={0} x2={i * PAPAN.sel} y2={SPAN} />
                <line x1={0} y1={i * PAPAN.sel} x2={SPAN} y2={i * PAPAN.sel} />
              </React.Fragment>
            ))}
            {BINTANG.flatMap((a) => BINTANG.map((b) => <circle key={`${a}-${b}`} cx={a * PAPAN.sel} cy={b * PAPAN.sel} r={5} fill={GARIS_PAPAN} />))}
          </g>
        </svg>
        <div style={{ position: 'absolute', right: 14, bottom: 8, fontFamily: MONO, fontWeight: 600, fontSize: 18, color: 'rgba(59,42,20,0.75)' }}>posisi ilustrasi</div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 0, filter: redup > 0 ? `brightness(${1 - 0.7 * redup})` : undefined }}>
        {/* peta panas langkah manusia */}
        {peta > 0
          ? panas.map(([i, j], n) => {
              const p = titik(i, j);
              return <div key={n} style={{ position: 'absolute', left: p.x - 46, top: p.y - 46, width: 92, height: 92, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,197,61,${(0.75 * peta).toFixed(3)}) 0%, rgba(255,197,61,0) 70%)` }} />;
            })
          : null}
        {HITAM.map(([i, j], n) => {
          const p = titik(i, j);
          return <Batu key={`h${n}`} x={p.x} y={p.y} hitam skala={maju(t, 0.1 + n * 0.014, 0.22 + n * 0.014, EASE.masuk)} />;
        })}
        {PUTIH.map(([i, j], n) => {
          const p = titik(i, j);
          return <Batu key={`p${n}`} x={p.x} y={p.y} hitam={false} skala={maju(t, 0.11 + n * 0.014, 0.23 + n * 0.014, EASE.masuk)} />;
        })}
        {s78 > 0 ? <Batu x={p78.x} y={p78.y} hitam={false} skala={s78} nomor="78" cincin={K.teal} /> : null}
      </div>
      {s37 > 0 ? <Batu x={p37.x} y={p37.y} hitam skala={s37} nomor={nomor37 && jadiTitik < 0.5 ? '37' : undefined} cincin={K.kuning} /> : null}
    </div>
  );
};

// S1: 10.000 titik (100 × 100) di atas papan, baris keisi = penghitung; batu #37 jadi 1 titik kuning
const Titik10rb: React.FC<{ T: WaktuG }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const m = T.n1 - 0.1;
  const a = T.n10000 + 0.45;
  if (t < m - 0.1 || t > S[1].mulai + 0.2) return null;
  const p = maju(t, m, a, EASE.kamera);
  const o = maju(t, m - 0.1, m + 0.1) * (1 - maju(t, S[1].mulai - 0.5, S[1].mulai - 0.1));
  const N = Math.round(p * 10000);
  const L = 640;
  const x0 = PAPAN.cx - L / 2;
  const y0 = PAPAN.cy - L / 2;
  const baris = p * 100;
  const p37 = titik(L37.i, L37.j);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      <div style={{ position: 'absolute', left: x0, top: y0, width: L, height: (L * Math.ceil(baris)) / 100, backgroundImage: 'radial-gradient(circle, rgba(200,214,232,0.9) 1.6px, transparent 2.2px)', backgroundSize: '6.4px 6.4px', overflow: 'hidden' }} />
      <div style={{ position: 'absolute', left: p37.x - 9, top: p37.y - 9, width: 18, height: 18, borderRadius: 9, background: K.kuning, boxShadow: `0 0 0 6px ${K.kuning}55, 0 0 30px ${K.kuning}` }} />
      <div style={{ position: 'absolute', left: PAPAN.cx, top: y0 + L - 70, translate: '-50% -50%', display: 'flex', alignItems: 'baseline', gap: 14, padding: '6px 26px', borderRadius: 16, background: 'rgba(7,12,24,0.92)', border: `4px solid ${K.kuning}`, whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 64, color: K.kuning }}>1</span>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: K.abu }}>dari</span>
        <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 64, color: K.tinta, fontVariantNumeric: 'tabular-nums', minWidth: '3.4em', textAlign: 'right' }}>{formatAngka(N)}</span>
      </div>
    </div>
  );
};

// ======================================================================================================
// S3: papan jadi ubin papan tak terhingga (pola 4×4 papan mini dengan batu acak), pangkat 10 naik ngikut zoom-out
function svgUbin() {
  const B = 740;
  let isi = '';
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      const ox = c * B;
      const oy = r * B;
      isi += `<rect x='${ox + 8}' y='${oy + 8}' width='${B - 16}' height='${B - 16}' rx='14' fill='${KAYU}'/>`;
      let d = '';
      for (let i = 0; i < 19; i++) {
        d += `M${ox + 46 + i * 36} ${oy + 46}V${oy + 694}M${ox + 46} ${oy + 46 + i * 36}H${ox + 694}`;
      }
      isi += `<path d='${d}' stroke='${GARIS_PAPAN}' stroke-width='3' fill='none'/>`;
      for (let n = 0; n < 46; n++) {
        const i = Math.floor(random(`u${r}${c}${n}x`) * 19);
        const j = Math.floor(random(`u${r}${c}${n}y`) * 19);
        const hitam = random(`u${r}${c}${n}w`) > 0.5;
        isi += `<circle cx='${ox + 46 + i * 36}' cy='${oy + 46 + j * 36}' r='16' fill='${hitam ? '#111' : '#eef1f4'}'/>`;
      }
    }
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${4 * B}' height='${4 * B}'>${isi}</svg>`)}")`;
}
const Ubin: React.FC<{ T: WaktuG }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const pola = useMemo(svgUbin, []);
  if (t < S[2].mulai - 0.1 || t > S[3].mulai + 0.6) return null;
  const a = S[2].mulai + 0.1;
  const b = T.n170 + 0.6;
  const p = maju(t, a, b, Easing.inOut(Easing.quad));
  const balik = maju(t, S[3].mulai - 0.4, S[3].mulai + 0.3, EASE.kamera);
  const s = Math.pow(0.035, p * (1 - balik));
  const ukur = 740 * s;
  const o = maju(t, a - 0.05, a + 0.15) * (1 - maju(t, S[3].mulai + 0.1, S[3].mulai + 0.5));
  const L = 4000;
  const kiri = PAPAN.cx - L / 2;
  const atas = PAPAN.cy - L / 2;
  // ubin (0,0) di blok 4×4 nempel ke posisi papan asli, skala dari tengah papan
  const ox = PAPAN.cx - ukur / 2 - kiri;
  const oy = PAPAN.cy - ukur / 2 - atas;
  const n = Math.round(170 * p * (1 - balik));
  const redupB = maju(t, T.lebih3 - 0.3, T.lebih3 + 0.1);
  // ekor S3 (panel bandingan): ubin terus hanyut biar gak beku
  const hanyut = Math.max(0, t - (T.lebih3 - 0.2)) * 55;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      <div style={{ position: 'absolute', left: kiri, top: atas, width: L, height: L, backgroundImage: pola, backgroundSize: `${4 * ukur}px ${4 * ukur}px`, backgroundPosition: `${ox - hanyut}px ${oy - hanyut * 0.6}px`, filter: `brightness(${1 - (0.65 - 0.12 * Math.sin(Math.max(0, t - T.lebih3) * 3)) * redupB})` }} />
      {t < T.lebih3 + 0.2 ? (
        <div style={{ position: 'absolute', left: PAPAN.cx, top: PAPAN.cy, translate: '-50% -50%', opacity: maju(t, a + 0.2, a + 0.4) * (1 - redupB), padding: '10px 34px', borderRadius: 22, background: 'rgba(7,12,24,0.9)', border: `5px solid ${K.kuning}`, whiteSpace: 'nowrap', fontFamily: SAIRA, fontWeight: 800, fontSize: 130, color: K.kuning, lineHeight: 1 }}>
          10
          <span style={{ fontSize: 70, position: 'relative', top: -52, marginLeft: 6, fontVariantNumeric: 'tabular-nums', display: 'inline-block', minWidth: '1.7em' }}>{n}</span>
        </div>
      ) : null}
    </div>
  );
};

// S3 ekor: papan Go > atom di alam semesta (HUD)
const Bandingan: React.FC<{ T: WaktuG }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < T.lebih3 - 0.2 || t > S[3].mulai + 0.3) return null;
  const o = maju(t, T.lebih3 - 0.2, T.lebih3 + 0.1) * (1 - maju(t, S[3].mulai - 0.3, S[3].mulai));
  const pa = pegas(t, T.atom - 0.1, fps, { damping: 11, stiffness: 200, mass: 0.6 });
  const pb = pegas(t, T.lebih3 - 0.1, fps, { damping: 11, stiffness: 200, mass: 0.6 });
  const Y = 900;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: o }}>
      <div style={{ position: 'absolute', left: 250, top: Y, translate: '-50% -50%', scale: String(pb), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <svg width={200} height={200} viewBox="-100 -100 200 200">
          {[-1, 0, 1].flatMap((a) => [-1, 0, 1].map((b) => <rect key={`${a}${b}`} x={a * 62 - 28} y={b * 62 - 28} width={56} height={56} rx={6} fill={KAYU} opacity={0.95} />))}
          {/* batu kedip di papan mini (susunan terus ganti) */}
          {Array.from({ length: 9 }, (_, i) => {
            const kd = Math.floor(t * 6);
            const a = Math.floor(random(`bd${kd}${i}a`) * 3) - 1;
            const b = Math.floor(random(`bd${kd}${i}b`) * 3) - 1;
            const dx = (random(`bd${kd}${i}x`) - 0.5) * 30;
            const dy = (random(`bd${kd}${i}y`) - 0.5) * 30;
            return <circle key={i} cx={a * 62 + dx} cy={b * 62 + dy} r={9} fill={i % 2 ? '#111' : '#eef1f4'} />;
          })}
        </svg>
        <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 50, color: K.kuning, whiteSpace: 'nowrap' }}>susunan papan</span>
      </div>
      <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
        <g transform={`translate(540 ${Y}) scale(${(1 + 0.12 * Math.sin(Math.max(0, t - T.lebih3 - 0.3) * 6)).toFixed(3)}) translate(-540 ${-Y})`}>
          <GarisDigambar d={`M 500 ${Y - 70} L 580 ${Y} L 500 ${Y + 70}`} mulai={T.lebih3} lama={0.25} warna={K.tinta} tebal={14} />
        </g>
      </svg>
      {t > T.atom - 0.1 ? (
        <div style={{ position: 'absolute', left: 820, top: Y, translate: '-50% -50%', scale: String(pa), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <svg width={200} height={200} viewBox="-100 -100 200 200">
            <circle cx={0} cy={0} r={16} fill={K.teal} />
            {[0, 60, 120].map((a) => (
              <ellipse key={a} cx={0} cy={0} rx={82} ry={30} fill="none" stroke={K.teal} strokeWidth={6} transform={`rotate(${a + t * 20})`} />
            ))}
            {[0, 60, 120].map((a, i) => {
              const u = t * 4.5 + i * 2.1;
              return <circle key={`e${a}`} cx={Math.cos(u) * 82} cy={Math.sin(u) * 30} r={10} fill={K.kuning} transform={`rotate(${a + t * 20})`} />;
            })}
          </svg>
          <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 46, color: K.tinta, whiteSpace: 'nowrap', textAlign: 'center', lineHeight: 1.0 }}>
            atom di
            <br />
            alam semesta
          </span>
        </div>
      ) : null}
    </div>
  );
};

// ======================================================================================================
// S4: 30 juta langkah pemain ahli mengalir ke kotak AlphaGo; abis itu peta langkah yang biasa dipilih manusia (di PapanGo)
const KotakAI: React.FC<{ x: number; y: number; skala?: number; o?: number; warnaBatu?: string; seed?: string }> = ({ x, y, skala = 1, o = 1, warnaBatu = '#111', seed = 'ai' }) => {
  const t = useDetik();
  const nodes = [[-70, -40], [-70, 0], [-70, 40], [0, -55], [0, -18], [0, 18], [0, 55], [70, -20], [70, 20]];
  const edges: [number, number][] = [];
  for (const a of [0, 1, 2]) for (const b of [3, 4, 5, 6]) edges.push([a, b]);
  for (const a of [3, 4, 5, 6]) for (const b of [7, 8]) edges.push([a, b]);
  return (
    <div style={{ position: 'absolute', left: x - 150, top: y - 130, width: 300, height: 260, scale: String(skala), opacity: o, borderRadius: 26, background: 'rgba(13,23,48,0.97)', border: `5px solid ${K.kuning}`, boxShadow: `0 0 40px ${K.kuning}44` }}>
      <svg width={300} height={190} viewBox="-150 -95 300 190" style={{ position: 'absolute', left: 0, top: 6 }}>
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={K.teal} strokeWidth={2.5} opacity={0.35 + 0.4 * Math.max(0, noise(`${seed}e${i}`, t * 2))} />
        ))}
        {nodes.map(([nx, ny], i) => (
          <circle key={i} cx={nx} cy={ny} r={10} fill={noise(`${seed}n${i}`, t * 2.5) > 0.2 ? K.kuning : '#25385c'} stroke={K.teal} strokeWidth={3} />
        ))}
      </svg>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 14, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 26, height: 26, borderRadius: 13, background: warnaBatu, border: '2px solid #888' }} />
        <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 48, color: K.tinta }}>AlphaGo</span>
      </div>
    </div>
  );
};

const Belajar: React.FC<{ T: WaktuG }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[3].mulai - 0.1 || t > S[4].mulai + 0.5) return null;
  const masuk = pegas(t, S[3].mulai + 0.1, fps, { damping: 12, stiffness: 180, mass: 0.6 });
  const kecil = maju(t, T.tahu - 0.3, T.tahu + 0.3, EASE.kamera);
  const keluar = maju(t, S[4].mulai - 0.2, S[4].mulai + 0.2, EASE.keluar);
  const bx = lerp(PAPAN.cx, 300, kecil);
  const by = lerp(PAPAN.cy - 40, 560, kecil);
  const alir = maju(t, T.belajar4 - 0.1, T.ahli + 0.2, EASE.linear);
  const nLangkah = 30_000_000 * maju(t, T.belajar4, T.ahli + 0.1, EASE.kamera);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - keluar }}>
      {/* aliran batu kecil dari kiri & kanan masuk ke kotak */}
      {alir > 0 && alir < 1 && kecil < 0.5
        ? Array.from({ length: 26 }, (_, i) => {
            const f = (t * 1.1 + i / 26) % 1;
            const kiri = i % 2 === 0;
            const sx = kiri ? 120 : 960;
            const sy = 620 + random(`al${i}`) * 700;
            const x = lerp(sx, bx, f);
            const y = lerp(sy, by, f);
            return <div key={i} style={{ position: 'absolute', left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 9, background: i % 3 === 0 ? '#eef1f4' : '#151515', border: '2px solid #8a9ab0', opacity: Math.sin(Math.PI * f) * (1 - kecil * 2) }} />;
          })
        : null}
      <KotakAI x={bx} y={by} skala={Math.max(0.001, masuk) * lerp(1, 0.62, kecil)} />
      {t > T.n30 - 0.5 ? (
        <div style={{ position: 'absolute', left: bx, top: by + lerp(170, 115, kecil), translate: '-50% 0', scale: String(lerp(1, 0.7, kecil)), display: 'flex', alignItems: 'baseline', gap: 12, padding: '6px 22px', borderRadius: 14, background: 'rgba(7,12,24,0.92)', border: `3px solid ${K.teal}`, whiteSpace: 'nowrap', opacity: maju(t, T.n30 - 0.5, T.n30 - 0.3) }}>
          <AngkaJalan dari={0} ke={30_000_000} progress={nLangkah / 30_000_000} gaya={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 60, color: K.teal, minWidth: '4.6em', textAlign: 'right', display: 'inline-block' }} />
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: K.abu }}>langkah ahli</span>
        </div>
      ) : null}
      {kecil > 0.3 ? (
        <div style={{ position: 'absolute', left: 540, top: 1232, translate: '-50% 0', padding: '2px 18px', borderRadius: 12, background: 'rgba(7,12,24,0.88)', fontFamily: TANGAN, fontWeight: 700, fontSize: 38, color: K.kuning, opacity: maju(t, T.biasa - 0.2, T.biasa + 0.1), whiteSpace: 'nowrap' }}>
          kuning = langkah yang biasa dipilih manusia
        </div>
      ) : null}
    </div>
  );
};

// S5: AlphaGo lawan AlphaGo, papan mini kedip cepat, tumpukan game; lalu pohon akibat ke depan
const LawanDiri: React.FC<{ T: WaktuG }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[4].mulai - 0.1 || t > S[5].mulai + 0.5) return null;
  const m = pegas(t, S[4].mulai + 0.05, fps, { damping: 12, stiffness: 180, mass: 0.6 });
  const keluar = maju(t, S[5].mulai - 0.2, S[5].mulai + 0.2, EASE.keluar);
  const pohon = maju(t, T.ngira5 - 0.4, T.ngira5, EASE.kamera);
  const kedip = Math.floor(t * 12);
  const nTumpuk = Math.floor(lerp(0, 40, maju(t, T.jutaan - 0.2, T.ngira5 - 0.3, EASE.linear)));
  const MB = { x: 540, y: 820, u: 220 };
  // pohon: dari batu di papan mini, cabang 3 tingkat ke bawah
  const akar = { x: MB.x, y: MB.y + MB.u / 2 + 10 };
  const cabang: { d: string; m: number; ujung?: { x: number; y: number; baik: boolean } }[] = [];
  const lv1 = [-260, 0, 260];
  lv1.forEach((dx, a) => {
    const p1 = { x: akar.x + dx, y: akar.y + 150 };
    cabang.push({ d: `M ${akar.x} ${akar.y} L ${p1.x} ${p1.y}`, m: T.ngira5 + a * 0.08 });
    [-80, 80].forEach((dx2, b) => {
      const p2 = { x: p1.x + dx2, y: p1.y + 150 };
      cabang.push({ d: `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`, m: T.akibat5 - 0.1 + (a * 2 + b) * 0.05, ujung: { ...p2, baik: random(`ph${a}${b}`) > 0.45 } });
    });
  });
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - keluar }}>
      <KotakAI x={210} y={MB.y} skala={Math.max(0.001, m) * 0.72} seed="a1" />
      <KotakAI x={870} y={MB.y} skala={Math.max(0.001, m) * 0.72} warnaBatu="#eef1f4" seed="a2" />
      {/* papan mini, batu acak ganti cepat (main ribuan kali) */}
      <div style={{ position: 'absolute', left: MB.x - MB.u / 2, top: MB.y - MB.u / 2, width: MB.u, height: MB.u, scale: String(Math.max(0.001, m)), borderRadius: 10, background: KAYU, overflow: 'hidden', backgroundImage: `linear-gradient(${GARIS_PAPAN} 1.5px, transparent 1.5px), linear-gradient(90deg, ${GARIS_PAPAN} 1.5px, transparent 1.5px)`, backgroundSize: `${MB.u / 9}px ${MB.u / 9}px`, backgroundPosition: `${MB.u / 18}px ${MB.u / 18}px` }}>
        {Array.from({ length: 22 }, (_, i) => {
          const gi = Math.floor(random(`mb${kedip}${i}x`) * 9);
          const gj = Math.floor(random(`mb${kedip}${i}y`) * 9);
          return <div key={i} style={{ position: 'absolute', left: gi * (MB.u / 9) + 3, top: gj * (MB.u / 9) + 3, width: MB.u / 9 - 6, height: MB.u / 9 - 6, borderRadius: '50%', background: i % 2 ? '#111' : '#eef1f4' }} />;
        })}
      </div>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d={pathPanah(330, MB.y - 10, MB.x - MB.u / 2 - 14, MB.y - 10, -30, 22)} mulai={S[4].mulai + 0.3} lama={0.25} warna={K.abu} tebal={6} />
        <GarisDigambar d={pathPanah(750, MB.y + 10, MB.x + MB.u / 2 + 14, MB.y + 10, -30, 22)} mulai={S[4].mulai + 0.4} lama={0.25} warna={K.abu} tebal={6} />
      </svg>
      {/* tumpukan game yang udah selesai */}
      <div style={{ position: 'absolute', left: MB.x, top: MB.y - MB.u / 2 - 60, translate: '-50% -100%', display: 'grid', gridTemplateColumns: 'repeat(10, 22px)', gap: 5, opacity: 1 - pohon * 0.8 }}>
        {Array.from({ length: 40 }, (_, i) => (
          <div key={i} style={{ width: 22, height: 22, borderRadius: 4, background: i < nTumpuk ? KAYU : 'transparent', border: `2px solid ${i < nTumpuk ? KAYU2 : '#25385c'}` }} />
        ))}
      </div>
      {/* pohon akibat */}
      {pohon > 0 ? (
        <>
          <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
            {cabang.map((c, i) => (
              <GarisDigambar key={i} d={c.d} mulai={c.m} lama={0.22} warna={K.teal} tebal={6} />
            ))}
          </svg>
          {cabang.map((c, i) =>
            c.ujung && t > c.m + 0.2 ? (
              <div key={i} style={{ position: 'absolute', left: c.ujung.x, top: c.ujung.y + 10, translate: '-50% 0', padding: '2px 12px', borderRadius: 10, background: c.ujung.baik ? K.teal : K.merah, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 34, scale: String(maju(t, c.m + 0.2, c.m + 0.35)) }}>
                {c.ujung.baik ? 'untung' : 'rugi'}
              </div>
            ) : null,
          )}
          <div style={{ position: 'absolute', left: MB.x + 40, top: akar.y + 40, fontFamily: TANGAN, fontWeight: 700, fontSize: 38, color: K.teal, opacity: maju(t, T.akibat5, T.akibat5 + 0.2), whiteSpace: 'nowrap' }}>akibat ke depan</div>
        </>
      ) : null}
    </div>
  );
};

// S6: titik #37 di peta manusia dingin (1 : 10.000, batang peluang nyusut), dicek ke depan (cabang + batu bayangan) → tetap dipilih
const Cek37: React.FC<{ T: WaktuG }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[5].mulai || t > S[6].mulai + 0.5) return null;
  const keluar = maju(t, S[6].mulai - 0.2, S[6].mulai + 0.2, EASE.keluar);
  const p = titik(L37.i, L37.j);
  const pN = maju(t, T.n1b - 0.1, T.n10000b + 0.3, EASE.kamera);
  const N = Math.max(1, Math.round(pN * 10000));
  const lebar = 300;
  const oP = maju(t, T.peluang6 - 0.1, T.peluang6 + 0.2);
  const cab = [
    { dx: -150, dy: -170 }, { dx: -40, dy: -200 }, { dx: 80, dy: -180 }, { dx: -180, dy: -60 }, { dx: 140, dy: -90 },
  ];
  const cek = maju(t, T.depan - 0.1, T.depan + 0.2);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - keluar }}>
      {/* panel peluang di bawah titik */}
      {oP > 0 ? (
        <div style={{ position: 'absolute', left: p.x - lebar / 2 - 60, top: p.y + 60, width: lebar + 40, padding: '12px 16px', borderRadius: 16, background: 'rgba(7,12,24,0.94)', border: `3px solid ${K.kuning}`, opacity: oP }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, color: K.abu, whiteSpace: 'nowrap' }}>peluang dipilih manusia</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 56, color: K.kuning }}>1 :</span>
            <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 56, color: K.tinta, fontVariantNumeric: 'tabular-nums' }}>{t < T.n1b - 0.1 ? '…' : formatAngka(N)}</span>
          </div>
          <div style={{ position: 'relative', height: 12, borderRadius: 6, background: '#25385c', marginTop: 4 }}>
            {t >= T.n1b - 0.1 ? <div style={{ position: 'absolute', left: 0, top: 0, height: 12, borderRadius: 6, width: `${Math.max(0.6, 100 / N)}%`, background: K.kuning }} /> : null}
          </div>
        </div>
      ) : null}
      {/* cek ke depan: cabang + batu bayangan */}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        {cab.map((c, i) => (
          <GarisDigambar key={i} d={`M ${p.x} ${p.y} L ${p.x + c.dx} ${p.y + c.dy}`} mulai={T.ngecek + i * 0.07} lama={0.22} warna={K.teal} tebal={5} />
        ))}
      </svg>
      {cab.map((c, i) => (t > T.ngecek + i * 0.07 + 0.2 ? <Batu key={i} x={p.x + c.dx} y={p.y + c.dy} hitam={i % 2 === 0} o={0.55} r={15} /> : null))}
      {cek > 0 ? (
        <div style={{ position: 'absolute', left: p.x - 230, top: p.y - 300, opacity: cek * (1 - maju(t, T.tetap - 0.1, T.tetap + 0.1)), padding: '4px 16px', borderRadius: 12, background: K.teal, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 44, whiteSpace: 'nowrap' }}>akibat ke depan: bagus ✓</div>
      ) : null}
      {t > T.tetap - 0.05 ? (
        <Stempel mulai={T.tetap - 0.05} rot={-7} gaya={{ position: 'absolute', left: p.x - 250, top: p.y - 310, padding: '4px 22px', borderRadius: 14, border: `6px solid ${K.kuning}`, background: 'rgba(7,12,24,0.85)', fontFamily: SAIRA, fontWeight: 800, fontSize: 66, color: K.kuning, whiteSpace: 'nowrap' }}>
          tetap dipilih
        </Stempel>
      ) : null}
    </div>
  );
};

// ======================================================================================================
// HUD: plakat pemain (S2), komentator + jam Lee (S7), papan skor 5 game (S8–S9)
const Plakat: React.FC<{ T: WaktuG }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < T.alphago2 - 0.2 || t > S[2].mulai + 0.3) return null;
  const o = 1 - maju(t, S[2].mulai - 0.2, S[2].mulai + 0.1);
  const pl = (teks: React.ReactNode, sub: string, x: number, y: number, m: number, hitam: boolean, kanan = false) => {
    const p = pegas(t, m, fps, { damping: 12, stiffness: 200, mass: 0.6 });
    return t < m ? null : (
      <div style={{ position: 'absolute', left: x, top: y, translate: kanan ? '-100% 0' : '0 0', scale: String(p), transformOrigin: kanan ? '100% 50%' : '0 50%', display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px 10px 14px', borderRadius: 18, background: 'rgba(7,12,24,0.94)', border: `4px solid ${hitam ? K.kuning : K.teal}`, whiteSpace: 'nowrap' }}>
        <div style={{ width: 46, height: 46, borderRadius: 23, background: hitam ? 'radial-gradient(circle at 35% 30%, #4a4a4a, #050505)' : 'radial-gradient(circle at 35% 30%, #fff, #b9c2cc)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.0 }}>
          <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 52, color: K.tinta }}>{teks}</span>
          <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 22, color: hitam ? K.kuning : K.teal }}>{sub}</span>
        </div>
      </div>
    );
  };
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: o }}>
      {pl('AlphaGo', 'buatan DeepMind', 70, 560, T.alphago2 - 0.1, true)}
      {pl('Lee Sedol', 'juara dunia Go', 70, 1170, T.lee2 - 0.1, false)}
      {t > T.game2 - 0.1 ? (
        <div style={{ position: 'absolute', left: 1010, top: 576, translate: '-100% 0', scale: String(pegas(t, T.game2 - 0.1, fps, { damping: 12, stiffness: 200, mass: 0.6 })), transformOrigin: '100% 50%', padding: '8px 20px', borderRadius: 14, background: K.kuning, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 48, whiteSpace: 'nowrap' }}>
          GAME 2{t > T.maret - 0.1 ? <span style={{ fontFamily: MONO, fontSize: 26, marginLeft: 12 }}>Maret 2016</span> : null}
        </div>
      ) : null}
    </div>
  );
};

const Komentator: React.FC<{ T: WaktuG }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[6].mulai - 0.1 || t > S[7].mulai + 0.3) return null;
  const o = 1 - maju(t, S[7].mulai - 0.15, S[7].mulai + 0.15);
  const pb = pegas(t, T.komentator - 0.05, fps, { damping: 11, stiffness: 200, mass: 0.6 });
  const pj = pegas(t, T.lee7 - 0.15, fps, { damping: 12, stiffness: 190, mass: 0.6 });
  const menit = 15 * maju(t, T.n15 - 0.45, T.menit, EASE.kamera);
  const R = 110;
  const a = (menit / 60) * Math.PI * 2;
  const cx = 760;
  const cy = 1030;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: o }}>
      {/* komentator: mic + gelembung */}
      <div style={{ position: 'absolute', left: 90, top: 640, scale: String(pb), transformOrigin: '0 100%', display: 'flex', alignItems: 'flex-end', gap: 14 }}>
        <svg width={80} height={120} viewBox="-40 -60 80 120">
          <rect x={-18} y={-56} width={36} height={60} rx={18} fill="none" stroke={K.tinta} strokeWidth={6} />
          <path d="M -30 -10 Q -30 22 0 22 Q 30 22 30 -10" fill="none" stroke={K.tinta} strokeWidth={6} />
          <line x1={0} y1={22} x2={0} y2={46} stroke={K.tinta} strokeWidth={6} />
          <line x1={-18} y1={48} x2={18} y2={48} stroke={K.tinta} strokeWidth={6} strokeLinecap="round" />
        </svg>
        <div style={{ position: 'relative', padding: '14px 28px', borderRadius: 26, background: 'rgba(7,12,24,0.95)', border: `5px solid ${K.merah}`, marginBottom: 40 }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: K.abu }}>komentator</div>
          <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 62, color: K.merah, whiteSpace: 'nowrap' }}>
            &ldquo;langkah salah?&rdquo;
          </div>
        </div>
      </div>
      {/* jam Lee */}
      {t > T.lee7 - 0.15 ? (
        <div style={{ position: 'absolute', left: cx - 170, top: cy - 170, width: 340, height: 420, scale: String(pj), transformOrigin: '50% 40%' }}>
          <svg width={340} height={340} viewBox="-170 -170 340 340">
            <circle cx={0} cy={0} r={R + 26} fill="rgba(7,12,24,0.95)" stroke={K.teal} strokeWidth={6} />
            {Array.from({ length: 12 }, (_, i) => {
              const aa = (i / 12) * Math.PI * 2;
              return <line key={i} x1={Math.sin(aa) * (R - 6)} y1={-Math.cos(aa) * (R - 6)} x2={Math.sin(aa) * (R + 10)} y2={-Math.cos(aa) * (R + 10)} stroke={K.abu} strokeWidth={i % 3 === 0 ? 6 : 3} />;
            })}
            {menit > 0.05 ? <path d={`M 0 0 L 0 ${-R} A ${R} ${R} 0 0 1 ${(Math.sin(a) * R).toFixed(1)} ${(-Math.cos(a) * R).toFixed(1)} Z`} fill={`${K.teal}55`} /> : null}
            <line x1={0} y1={0} x2={Math.sin(a) * (R - 14)} y2={-Math.cos(a) * (R - 14)} stroke={K.teal} strokeWidth={8} strokeLinecap="round" />
            <circle cx={0} cy={0} r={9} fill={K.teal} />
          </svg>
          <div style={{ position: 'absolute', left: 0, width: 340, top: 300, textAlign: 'center', whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 64, color: K.teal, fontVariantNumeric: 'tabular-nums', opacity: maju(t, T.n15 - 0.45, T.n15 - 0.3) }}>±{Math.round(menit)} menit</span>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: K.abu }}>Lee Sedol mikir buat bales</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const PapanSkor: React.FC<{ T: WaktuG }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[7].mulai - 0.1 || t > T.keluarDunia + 0.5) return null;
  const o = maju(t, S[7].mulai, S[7].mulai + 0.3) * (1 - maju(t, T.keluarDunia, T.keluarDunia + 0.35));
  const W = 168;
  const x0 = 540 - (5 * W + 4 * 14) / 2;
  const slot = (i: number) => {
    const g2 = i === 1;
    const g4 = i === 3;
    const aktif = (g2 && t > S[7].mulai) || (g4 && t > T.keempat - 0.1);
    const isi = g2 ? maju(t, T.menang8 - 0.1, T.menang8 + 0.1) : g4 ? maju(t, T.menang9 - 0.1, T.menang9 + 0.1) : 0;
    const warna = g2 ? K.kuning : g4 ? K.teal : K.garis;
    const pp = isi > 0 ? pegas(t, (g2 ? T.menang8 : T.menang9) - 0.1, fps, { damping: 9, stiffness: 220, mass: 0.6 }) : 1;
    return (
      <div key={i} style={{ position: 'absolute', left: x0 + i * (W + 14), top: 410, width: W, height: 130, borderRadius: 18, background: isi > 0.5 ? warna : 'rgba(7,12,24,0.92)', border: `4px solid ${aktif ? warna : K.garis}`, scale: String(isi > 0 ? Math.min(1.15, pp) : aktif ? 1.04 : 1), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1.0 }}>
        <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 24, color: isi > 0.5 ? K.latar : K.abu }}>GAME {i + 1}</span>
        {g2 ? <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 36, color: isi > 0.5 ? K.latar : K.kuning, whiteSpace: 'nowrap' }}>{isi > 0.5 ? 'AlphaGo ✓' : 'langkah 37'}</span> : null}
        {g4 && t > T.keempat - 0.1 ? <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 36, color: isi > 0.5 ? K.latar : K.teal, whiteSpace: 'nowrap' }}>{isi > 0.5 ? 'Lee ✓' : 'langkah 78'}</span> : null}
      </div>
    );
  };
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: o }}>
      {[0, 1, 2, 3, 4].map(slot)}
    </div>
  );
};

// S9 (dunia, ngikut kamera): peluang langkah 78 juga 1 : 10.000, penghitung di atas batu putih
const Peluang78: React.FC<{ T: WaktuG }> = ({ T }) => {
  const t = useDetik();
  const pN = maju(t, T.n1c - 0.1, T.n10000c + 0.3, EASE.kamera);
  const o = maju(t, T.n1c - 0.2, T.n1c) * (1 - maju(t, T.keluarDunia - 0.2, T.keluarDunia));
  if (o <= 0) return null;
  const p = titik(L78.i, L78.j);
  return (
    <div style={{ position: 'absolute', left: p.x, top: p.y - 40, translate: '-50% -100%', opacity: o, display: 'flex', alignItems: 'baseline', gap: 10, padding: '6px 20px', borderRadius: 14, background: 'rgba(7,12,24,0.94)', border: `4px solid ${K.teal}`, whiteSpace: 'nowrap' }}>
      <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 56, color: K.teal }}>1 :</span>
      <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 56, color: K.tinta, fontVariantNumeric: 'tabular-nums', minWidth: '3.3em', textAlign: 'right' }}>{formatAngka(Math.max(1, Math.round(pN * 10000)))}</span>
    </div>
  );
};

// ======================================================================================================
const pangkat = (exp: string) => (
  <span style={{ whiteSpace: 'nowrap' }}>
    10<span style={{ fontSize: '0.55em', position: 'relative', top: '-0.8em', marginLeft: '0.04em' }}>{exp}</span>
  </span>
);

const Hud: React.FC<{ T: WaktuG }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const kl = (i: number) => S[i + 1].mulai - 0.2;
  const sumber = t < S[3].mulai - 0.1 ? 'Sumber: Google DeepMind (AlphaGo) · WIRED, 16/03/2016' : 'Sumber: WIRED (Cade Metz, 16/03/2016) · Google DeepMind';
  const sO = maju(t, 1.3, 1.6) * (1 - maju(t, T.keluarDunia - 0.1, T.keluarDunia + 0.2));
  return (
    <>
      <TeksSeri
        label={['PELUANG', 'DIPILIH', 'MANUSIA']} lMulai={0.1}
        judul={[{ t: '1', mulai: 0.2, warna: K.kuning }, { t: ':', mulai: 0.28, warna: K.abu }, { t: '10.000', mulai: 0.36, isi: sorot('10.000', T.n10000 + 0.2) }]}
        jMulai={0.2} keluar={kl(0)} ukuran={120} catatan="dan langkah itu bikin AI-nya menang" cMulai={T.menang1 - 0.3}
      />
      <TeksSeri
        label={['GAME', '2', '·', 'LAWAN', 'JUARA', 'DUNIA']} lMulai={S[1].mulai}
        judul={[{ t: 'Langkah', mulai: S[1].mulai + 0.5 }, { t: '37', mulai: T.n37, warna: K.kuning }, { t: '·', mulai: T.game2 - 0.1, warna: K.abu }, { t: 'game', mulai: T.game2 }, { t: '2', mulai: T.game2 + 0.2 }, { t: '·', mulai: T.n2016 - 0.15, warna: K.abu }, { t: '2016', mulai: T.n2016 }]}
        jMulai={S[1].mulai + 0.5} keluar={kl(1)}
      />
      <TeksSeri
        label={['KEMUNGKINAN', 'SUSUNAN', 'PAPAN', 'GO']} lMulai={S[2].mulai}
        judul={[{ t: '10^170', mulai: T.n170 - 0.1, isi: pangkat('170'), warna: K.kuning }, { t: 'susunan', mulai: T.n170 + 0.5 }, { t: 'papan', mulai: T.n170 + 0.7 }]}
        jMulai={T.n170 - 0.1} keluar={kl(2)} catatan="lebih banyak dari atom di alam semesta yang diketahui" cMulai={T.atom}
      />
      <TeksSeri
        label={['AWALNYA', 'BELAJAR', 'DARI']} lMulai={S[3].mulai}
        judul={[{ t: '30', mulai: T.n30, warna: K.teal }, { t: 'juta', mulai: T.n30 + 0.25, warna: K.teal }, { t: 'langkah', mulai: T.n30 + 0.5 }, { t: 'manusia', mulai: T.ahli }]}
        jMulai={T.n30} keluar={kl(3)}
      />
      <TeksSeri
        label={['TERUS', 'LATIHAN', 'SENDIRI']} lMulai={S[4].mulai}
        judul={[{ t: 'jutaan', mulai: T.jutaan, warna: K.kuning }, { t: 'game', mulai: T.jutaan + 0.25 }, { t: 'lawan', mulai: T.sendiri - 0.45 }, { t: 'diri', mulai: T.sendiri - 0.2 }, { t: 'sendiri', mulai: T.sendiri }]}
        jMulai={T.jutaan} keluar={kl(4)} catatan="buat ngira-ngira akibat tiap langkah" cMulai={T.ngira5}
      />
      <TeksSeri
        label={['LANGKAH', '37']} lMulai={S[5].mulai}
        judul={[{ t: '1 : 10.000', mulai: T.n1b, warna: K.kuning }, { t: '→', mulai: T.ngecek, warna: K.teal }, { t: 'tetap', mulai: T.tetap - 0.1 }, { t: 'dipilih', mulai: T.tetap + 0.05, isi: sorot('dipilih', T.tetap + 0.15) }]}
        jMulai={T.n1b} keluar={kl(5)}
      />
      <TeksSeri
        label={['REAKSINYA']} lMulai={S[6].mulai}
        judul={[{ t: '"langkah', mulai: T.komentator, warna: K.merah }, { t: 'salah?"', mulai: T.salah, warna: K.merah }, { t: '·', mulai: T.n15 - 0.2, warna: K.abu }, { t: '±15 menit', mulai: T.n15, warna: K.teal }]}
        jMulai={T.komentator} keluar={kl(6)}
      />
      <TeksSeri
        label={['JALANNYA', 'PERTANDINGAN', 'BERBALIK']} lMulai={S[7].mulai}
        judul={[{ t: 'AlphaGo', mulai: S[7].mulai + 0.3 }, { t: 'menang', mulai: T.menang8, isi: sorot('menang', T.menang8 + 0.1) }, { t: 'game', mulai: T.menang8 + 0.2 }, { t: '2', mulai: T.menang8 + 0.3, warna: K.kuning }]}
        jMulai={S[7].mulai + 0.3} keluar={kl(7)}
      />
      <TeksSeri
        label={['GAME', '4']} lMulai={S[8].mulai}
        judul={[{ t: 'Langkah', mulai: T.n78 - 0.4 }, { t: '78', mulai: T.n78, warna: K.teal }, { t: '·', mulai: T.menang9 - 0.3, warna: K.abu }, { t: 'Lee', mulai: T.menang9 - 0.15 }, { t: 'menang', mulai: T.menang9, isi: sorot('menang', T.menang9 + 0.1, K.teal) }]}
        jMulai={T.n78 - 0.4} keluar={kl(8)} catatan="peluangnya juga 1 : 10.000" cMulai={T.n1c}
      />
      <TeksSeri
        label={['BUAT', 'CERITA', 'AI', 'BERIKUTNYA']} lMulai={S[9].mulai}
        judul={[{ t: 'simpan', mulai: T.simpan + 0.05, warna: K.kuning }, { t: '&', mulai: T.follow - 0.25, warna: K.abu }, { t: 'follow', mulai: T.follow, warna: K.teal }]}
        jMulai={T.simpan} keluar={T.keluarCta}
      />
      <Sumber teks={sumber} o={sO} />
    </>
  );
};

// ======================================================================================================
function daftarSfx(T: WaktuG) {
  const S = T.s;
  const titik = Array.from({ length: 8 }, (_, i) => bunyi('tik', T.n1 - 0.1 + i * ((T.n10000 + 0.45 - T.n1) / 8), 0.15));
  const titikB = Array.from({ length: 6 }, (_, i) => bunyi('tik', T.n1b + i * ((T.n10000b + 0.3 - T.n1b) / 6), 0.15));
  const titikC = Array.from({ length: 5 }, (_, i) => bunyi('tik', T.n1c + i * ((T.n10000c + 0.3 - T.n1c) / 5), 0.15));
  const batu = Array.from({ length: 6 }, (_, i) => bunyi('klik', 0.14 + i * 0.05, 0.12));
  const ubin = Array.from({ length: 8 }, (_, i) => bunyi('tik', S[2].mulai + 0.2 + i * 0.22, 0.12));
  const alir = Array.from({ length: 8 }, (_, i) => bunyi('tik', T.belajar4 + i * 0.25, 0.1));
  const kedip = Array.from({ length: 10 }, (_, i) => bunyi('klik', S[4].mulai + 0.5 + i * 0.25, 0.08));
  const menit = Array.from({ length: 6 }, (_, i) => bunyi('tik', T.n15 - 0.45 + i * 0.12, 0.16));
  return [
    ...batu,
    bunyi('hantam', 0.43, 0.5),
    bunyi('jepret', 0.45, 0.3),
    ...titik,
    bunyi('pop', T.n10000 + 0.5, 0.35),
    bunyi('swish', T.menang1, 0.25),
    bunyi('whooshA', T.n37 - 0.1, 0.35),
    bunyi('pop', T.n37 + 0.1, 0.3),
    bunyi('pop', T.alphago2, 0.3),
    bunyi('pop', T.game2, 0.3),
    bunyi('pop', T.lee2, 0.3),
    bunyi('whooshBerat', S[2].mulai + 0.1, 0.45),
    ...ubin,
    bunyi('riser', T.n170 + 0.4, 0.25),
    bunyi('swish', T.lebih3, 0.3),
    bunyi('pop', T.atom, 0.3),
    bunyi('whooshB', S[3].mulai - 0.1, 0.35),
    ...alir,
    bunyi('kunci', T.ahli + 0.1, 0.3),
    bunyi('swish', T.tahu, 0.25),
    bunyi('whooshPop', S[4].mulai, 0.3),
    ...kedip,
    bunyi('swish', T.ngira5, 0.3),
    bunyi('whooshTurun', S[5].mulai + 0.1, 0.35),
    ...titikB,
    bunyi('swish', T.ngecek, 0.3),
    bunyi('pop', T.depan, 0.3),
    bunyi('hantam', T.tetap + 0.03, 0.45),
    bunyi('jepret', T.tetap + 0.05, 0.3),
    bunyi('whooshLembut', S[6].mulai, 0.3),
    bunyi('glitch', T.salah, 0.25),
    ...menit,
    bunyi('pop', T.menit + 0.05, 0.3),
    bunyi('whooshA', S[7].mulai, 0.3),
    bunyi('kunci', T.menang8, 0.4),
    bunyi('swish', T.keempat, 0.3),
    bunyi('hantam', T.n78 + 0.0, 0.45),
    bunyi('jepret', T.n78 + 0.02, 0.3),
    ...titikC,
    bunyi('kunci', T.menang9, 0.4),
    bunyi('whooshTerang', T.keluarDunia + 0.1, 0.3),
    bunyi('pop', T.simpan + 0.15, 0.35),
    bunyi('klik', T.simpan + 0.65, 0.4),
    bunyi('pop', T.follow - 0.2, 0.3),
    bunyi('klik', T.follow + 0.3, 0.4),
    bunyi('whooshLembut', T.keluarCta + 0.05, 0.3),
  ];
}
