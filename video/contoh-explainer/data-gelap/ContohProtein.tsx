// Frame hero (pembuka, tengah, puncak): 15, 853, 1422.
// contoh video explainer A5 (akun generik, konten contoh): "AlphaFold nebak bentuk 3D 200 juta+ protein".
// SATU DUNIA: satu protein (rantai manik asam amino 3D yang muter pelan) di tengah. Hook: protein jadi → mengecil jadi 1 petak di
// antara ratusan petak protein (penghitung 200 juta+) → plakat AlphaFold · DeepMind × EMBL-EBI, gembok database kebuka 2022 →
// rantai dilurusin (asam amino) lalu ngelipat lagi (bentuk = fungsi) → 1970-an: urutan huruf → "?" (terkenal sulit) → kalender
// lab bulan → tahun → 2020 AlphaFold2: stopwatch menit, protein ngelipat cepet → medali Nobel Kimia 2024 kebelah dua (Hassabis &
// Jumper | Baker) → garis waktu 50 tahun kecentang → bola dunia 2 juta+ orang · 190 negara + contoh antibiotik & plastik → CTA.
// Fakta: NobelPrize.org siaran pers Kimia 2024 · EMBL-EBI & Google DeepMind (28/07/2022). Bentuk protein & urutan huruf = ilustrasi.
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { Bunyi, Dunia, EASE, formatAngka, GarisDigambar, Grain, maju, noise, pegas, Stempel, Subtitle, useDetik, type KunciKamera, type Kata } from "../../src/gerak";
import { MONO, SAIRA, TANGAN } from "../../src/gerak/font";
import { bunyi, K } from "./raja/gaya";
import type { Kalimat } from "./raja/waktuRaja";
import { CtaSimpanFollow, kameraSeri, LatarSeri, lerp, PeneduhAtas, sorot } from "../../src/gerak/seri/data-gelap/seri";
import { besar, HudTeks, Ikon, Kartu, kecil, KotakModel, Muncul, waktuDasar } from "../../src/gerak/seri/data-gelap/alat19";

export type DataProtein = { durasi: number; kata: Kata[]; kalimat?: Kalimat[] };

const PC = { x: 540, y: 880 };
const N = 28;
const WARNA = [K.teal, K.kuning, K.merah, '#6f8cff', '#b9e86a'];
// rantai 3D kompak (jalan acak di dalam bola, langkah 1) — bentuk ILUSTRASI
const LIPAT3D: [number, number, number][] = (() => {
  const p: [number, number, number][] = [[0, 0, 0]];
  for (let i = 1; i < N; i++) {
    let best: [number, number, number] = p[i - 1];
    let skor = -1e9;
    for (let c = 0; c < 14; c++) {
      const u = random(`pa${i}-${c}`) * 2 - 1;
      const a = random(`pb${i}-${c}`) * Math.PI * 2;
      const r = Math.sqrt(1 - u * u);
      const q: [number, number, number] = [p[i - 1][0] + r * Math.cos(a), p[i - 1][1] + u, p[i - 1][2] + r * Math.sin(a)];
      const jauh = Math.hypot(...q);
      const tabrak = p.slice(0, i - 1).reduce((m, z) => Math.min(m, Math.hypot(q[0] - z[0], q[1] - z[1], q[2] - z[2])), 9);
      const s = -jauh * 1.2 + Math.min(tabrak, 0.9) * 3;
      if (s > skor) {
        skor = s;
        best = q;
      }
    }
    p.push(best);
  }
  const c = p.reduce((m, z) => [m[0] + z[0] / N, m[1] + z[1] / N, m[2] + z[2] / N], [0, 0, 0]);
  return p.map((z) => [z[0] - c[0], z[1] - c[1], z[2] - c[2]] as [number, number, number]);
})();
const LURUS3D: [number, number, number][] = Array.from({ length: N }, (_, i) => [-4.4 + (i * 8.8) / (N - 1), 0.9 * Math.sin(i * 0.55), 0]);

/** Protein 3D: lipat 0 = lurus, 1 = terlipat. sudut = putaran sumbu Y (radian). */
export const Protein: React.FC<{ lipat: number; sudut: number; skala: number; cx: number; cy: number; cahaya?: number }> = ({ lipat, sudut, skala, cx, cy, cahaya = 0 }) => {
  const pts = LIPAT3D.map((f, i) => {
    const l = LURUS3D[i];
    const q = Math.max(0, Math.min(1, lipat * 1.25 - (i / N) * 0.25));
    const e = EASE.kamera(q);
    // terlipat diputar di sumbu Y; lurus gak diputar (biar gak ada manik yang meledak kena perspektif)
    const fx = f[0] * 1.9 * Math.cos(sudut) + f[2] * 1.9 * Math.sin(sudut);
    const fz = -f[0] * 1.9 * Math.sin(sudut) + f[2] * 1.9 * Math.cos(sudut);
    const xr = lerp(l[0], fx, e);
    const y = lerp(l[1] + Math.sin(sudut * 2 + i * 0.5) * 0.12, f[1] * 1.9, e);
    const zr = lerp(0, fz, e);
    const pers = 1 / (1 - zr / 30);
    return { i, sx: cx + xr * skala * pers, sy: cy + y * skala * pers, zr, r: skala * lerp(0.22, 0.36, e) * pers };
  });
  const urut = [...pts].sort((a, b) => a.zr - b.zr);
  return (
    <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      {cahaya > 0 ? <circle cx={cx} cy={cy} r={skala * 4.5} fill={K.teal} opacity={0.12 * cahaya} /> : null}
      {pts.slice(1).map((p, i) => (
        <line key={`l${i}`} x1={pts[i].sx} y1={pts[i].sy} x2={p.sx} y2={p.sy} stroke="#c9d6ea" strokeWidth={skala * 0.16} strokeLinecap="round" opacity={0.7} />
      ))}
      {urut.map((p) => {
        const w = WARNA[p.i % WARNA.length];
        const gelap = 0.55 + 0.45 * Math.max(0, Math.min(1, (p.zr + 3) / 6));
        return (
          <g key={p.i} opacity={gelap}>
            <circle cx={p.sx} cy={p.sy} r={p.r} fill={w} stroke={K.latar} strokeWidth={skala * 0.06} />
            <circle cx={p.sx - p.r * 0.3} cy={p.sy - p.r * 0.32} r={p.r * 0.3} fill="#ffffff" opacity={0.35} />
          </g>
        );
      })}
    </svg>
  );
};

// petak protein kecil (dipakai buat grid 200 juta): 4 varian, digambar sekali jadi data-URL
function petakSvg(v: number) {
  let isi = '';
  const pts = LIPAT3D.map((f) => {
    const a = v * 1.3;
    const x = f[0] * Math.cos(a) + f[2] * Math.sin(a);
    return [50 + x * 17, 50 + f[1] * 17];
  });
  for (let i = 1; i < pts.length; i++) isi += `<line x1='${pts[i - 1][0]}' y1='${pts[i - 1][1]}' x2='${pts[i][0]}' y2='${pts[i][1]}' stroke='%23c9d6ea' stroke-width='4' opacity='0.7'/>`;
  pts.forEach((p, i) => (isi += `<circle cx='${p[0]}' cy='${p[1]}' r='7' fill='${WARNA[i % WARNA.length].replace('#', '%23')}'/>`));
  return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'>${isi}</svg>")`;
}

function waktuProtein(d: Kata[], kal: Kalimat[] | undefined, total: number) {
  const W = waktuDasar(d, kal, total, 10);
  const { s, k } = W;
  const n200 = k('200', s[0].mulai, s[0].mulai + 2.4);
  const hampir = k('hampir', n200, n200 + 1.4);
  const alpha = k('alphafold', s[1].mulai, s[1].mulai + 0.5);
  const google = k('google', alpha, alpha + 0.8);
  const n2022 = k('2022', google, google + 1.5);
  const gratis = k('gratis', n2022, n2022 + 1.5);
  const embl = k('embl', gratis, s[1].akhir - 0.8);
  const rantai = k('rantai', s[2].mulai, s[2].mulai + 0.8);
  const asam = k('asam', rantai, rantai + 0.6);
  const ngelipat = k('ngelipat', asam, asam + 1.0);
  const fungsi = k('fungsinya', ngelipat, s[2].akhir - 0.6);
  const n1970 = k('1970', s[3].mulai, s[3].mulai + 0.3);
  const urutan = k('urutan', n1970, n1970 + 2.0);
  const sulit = k('sulit', urutan, s[3].akhir - 0.5);
  const bulan = k('berbulan', s[4].mulai, s[4].mulai + 2.0);
  const tahun4 = k('bertahun', bulan, s[4].akhir - 1.0);
  const n2020 = k('2020', s[5].mulai, s[5].mulai + 0.4);
  const demis = k('demis', n2020, n2020 + 0.8);
  const john = k('john', demis, demis + 1.0);
  const af2 = k('alphafold2', john, john + 1.2);
  const menit = k('menit', af2, s[5].akhir - 0.5);
  const n2024 = k('2024', s[6].mulai, s[6].mulai + 0.3);
  const nobel = k('nobel', n2024, n2024 + 1.5);
  const setengah2 = k('setengahnya', nobel, nobel + 1.0);
  const baker = k('baker', setengah2, setengah2 + 1.2);
  const rancang = k('ngerancang', baker, s[6].akhir - 0.8);
  const komite = k('komite', s[7].mulai, s[7].mulai);
  const n50 = k('50', komite, s[7].akhir - 0.7);
  const dua = k('dua', s[8].mulai, s[8].mulai + 1.4);
  const n190 = k('190', dua, dua + 1.0);
  const antibiotik = k('antibiotik', n190, n190 + 2.0);
  const plastik = k('plastik', antibiotik, s[8].akhir - 0.4);
  return {
    ...W, n200, hampir, alpha, google, n2022, gratis, embl, rantai, asam, ngelipat, fungsi, n1970, urutan, sulit, bulan, tahun4,
    n2020, demis, john, af2, menit, n2024, nobel, setengah2, baker, rancang, komite, n50, dua, n190, antibiotik, plastik,
  };
}
type WP = ReturnType<typeof waktuProtein>;

// ===============================================================================================================
export const ContohProtein: React.FC<DataProtein> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuProtein(d.kata, d.kalimat, total), [d.kata, d.kalimat, total]);
  const S = T.s;
  const pelan = Easing.linear;
  const kunci: KunciKamera[] = [
    { t: 0, x: 540, y: 960, z: 1.0 },
    { t: 0.6, x: 540, y: 900, z: 1.1 },
    { t: T.n200 - 0.3, x: 544, y: 896, z: 1.14, ease: pelan },
    { t: T.n200 + 0.9, x: 540, y: 960, z: 0.78 },
    { t: S[1].mulai - 0.1, x: 536, y: 956, z: 0.8, ease: pelan },
    { t: S[1].mulai + 0.5, x: 540, y: 930, z: 0.95 },
    { t: S[2].mulai - 0.1, x: 544, y: 926, z: 0.98, ease: pelan },
    { t: S[2].mulai + 0.5, x: 540, y: 900, z: 1.0 },
    { t: S[3].mulai - 0.1, x: 536, y: 896, z: 1.04, ease: pelan },
    { t: S[3].mulai + 0.5, x: 540, y: 880, z: 1.08 },
    { t: S[5].mulai - 0.1, x: 546, y: 884, z: 1.12, ease: pelan },
    { t: S[5].mulai + 0.5, x: 540, y: 900, z: 0.98 },
    { t: S[6].mulai - 0.1, x: 536, y: 896, z: 1.0, ease: pelan },
    { t: S[6].mulai + 0.5, x: 540, y: 940, z: 0.9 },
    { t: S[8].mulai - 0.1, x: 546, y: 936, z: 0.94, ease: pelan },
    { t: S[8].mulai + 0.5, x: 540, y: 960, z: 0.86 },
    { t: T.keluarDunia, x: 536, y: 956, z: 0.9, ease: pelan },
    { t: T.simpan + 0.8, x: 540, y: 960, z: 1.0 },
    { t: T.loop, x: 540, y: 960, z: 1.02, ease: pelan },
    { t: total, x: 540, y: 960, z: 1.0 },
  ];
  const kam = kameraSeri(kunci, t, fps, total, [
    { t: T.sulit + 0.1, kuat: 6, lama: 0.12 },
    { t: T.menit + 0.1, kuat: 7, lama: 0.14 },
  ]);
  return (
    <AbsoluteFill style={{ background: K.latar, color: K.tinta, overflow: 'hidden', fontFamily: SAIRA }}>
      <LatarSeri kam={kam} kabut={['61,219,200', '111,140,255', '255,197,61']} />
      <Dunia kamera={kam} tinggiDunia={2200} lebarDunia={1400} blurGerak={1300}>
        <GridProtein T={T} />
        <ProteinUtama T={T} />
        <Urutan T={T} />
      </Dunia>
      <PeneduhAtas />
      <Penghitung T={T} />
      <Plakat T={T} />
      <Kalender T={T} />
      <Af2 T={T} />
      <Medali T={T} />
      <GarisWaktu T={T} />
      <Dipakai T={T} />
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

// ===============================================================================================================
const redupDunia = (T: WP, t: number) => {
  const S = T.s;
  const r = (a: number, b: number, kuat: number) => kuat * maju(t, a, a + 0.3) * (1 - maju(t, b - 0.2, b + 0.1));
  return Math.max(r(S[1].mulai, S[2].mulai, 0.72), r(S[4].mulai, S[5].mulai, 0.72), r(S[5].mulai + 0.1, S[6].mulai, 0.45), r(S[6].mulai, S[9].mulai, 0.75));
};

// penghitung 200 juta+ (layar, di atas subtitle)
const Penghitung: React.FC<{ T: WP }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < T.n200 - 0.3 || t > S[1].mulai + 0.5) return null;
  const p = maju(t, T.n200 - 0.1, T.hampir + 0.3, EASE.kamera);
  const o = maju(t, T.n200 - 0.3, T.n200) * (1 - maju(t, S[1].mulai, S[1].mulai + 0.4));
  return (
    <div style={{ position: 'absolute', left: 540, top: 1190, translate: '-50% -50%', opacity: o, display: 'flex', alignItems: 'baseline', gap: 14, padding: '8px 30px', borderRadius: 18, background: 'rgba(7,12,24,0.95)', border: `5px solid ${K.kuning}`, whiteSpace: 'nowrap' }}>
      <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 92, color: K.kuning, fontVariantNumeric: 'tabular-nums', minWidth: '1.6em', textAlign: 'right' }}>{formatAngka(Math.round(200 * p))}</span>
      <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 64, color: K.tinta }}>juta+</span>
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, color: K.abu }}>protein</span>
    </div>
  );
};

const ProteinUtama: React.FC<{ T: WP }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < 0.04) return null;
  const masuk = pegas(t, 0.05, fps, { damping: 13, stiffness: 160, mass: 0.7 });
  const keluar = maju(t, T.keluarDunia, T.keluarDunia + 0.45, EASE.keluar);
  // lipat: hook terlipat → S3 lurus (rantai) lalu lipat lagi → S6 (AlphaFold2) lurus cepet terus lipat cepet
  let lipat = 1;
  lipat *= 1 - maju(t, T.rantai - 0.3, T.asam + 0.2, EASE.kamera) * (1 - maju(t, T.ngelipat - 0.1, T.ngelipat + 1.2, EASE.kamera));
  lipat *= 1 - maju(t, S[3].mulai + 0.1, S[3].mulai + 0.6, EASE.kamera) * (1 - maju(t, T.menit - 0.35, T.menit + 0.15, EASE.kamera));
  // hook: protein mengecil jadi 1 petak di grid 200 juta
  const kecilin = maju(t, T.n200 - 0.2, T.n200 + 0.5, EASE.kamera) * (1 - maju(t, S[1].mulai + 0.2, S[1].mulai + 0.7, EASE.kamera));
  const sudut = 0.6 + t * 0.55;
  const skala = lerp(96, 22, kecilin) * lerp(0.6, 1, Math.min(1, masuk));
  const redup = redupDunia(T, t);
  const sulit = maju(t, T.sulit - 0.1, T.sulit + 0.2) * (1 - maju(t, S[4].mulai - 0.2, S[4].mulai));
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: (1 - keluar) * Math.min(1, masuk * 2), filter: redup > 0 ? `brightness(${1 - redup})` : undefined }}>
      <Protein lipat={lipat} sudut={sudut} skala={skala} cx={PC.x} cy={PC.y} cahaya={1 - kecilin} />
      {kecilin > 0.5 ? <div style={{ position: 'absolute', left: PC.x - 70, top: PC.y - 70, width: 140, height: 140, borderRadius: 18, border: `5px solid ${K.kuning}`, opacity: kecilin }} /> : null}
      {/* S3: label asam amino + bentuk → fungsi */}
      {t > T.asam - 0.2 && t < S[3].mulai + 0.2 ? (
        <>
          <div style={{ position: 'absolute', left: PC.x, top: PC.y - 220, translate: '-50% 0', opacity: maju(t, T.asam - 0.2, T.asam) * (1 - maju(t, T.ngelipat, T.ngelipat + 0.3)), fontFamily: TANGAN, fontWeight: 700, fontSize: 54, color: K.kuning, whiteSpace: 'nowrap' }}>
            tiap manik = 1 asam amino
          </div>
          <div style={{ position: 'absolute', left: PC.x, top: PC.y + 250, translate: '-50% 0', opacity: maju(t, T.fungsi - 0.2, T.fungsi) * (1 - maju(t, S[3].mulai - 0.2, S[3].mulai)), padding: '6px 26px', borderRadius: 16, background: K.teal, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 60, whiteSpace: 'nowrap', scale: String(pegas(t, T.fungsi - 0.2, fps, { damping: 11, stiffness: 200, mass: 0.6 })) }}>
            bentuk → fungsi
          </div>
        </>
      ) : null}
      {sulit > 0 ? (
        <div style={{ position: 'absolute', left: PC.x, top: PC.y + 40, translate: '-50% -50%', opacity: sulit }}>
          <Stempel mulai={T.sulit - 0.05} rot={-8} gaya={{ padding: '4px 26px', borderRadius: 16, border: `7px solid ${K.merah}`, background: 'rgba(7,12,24,0.88)', fontFamily: SAIRA, fontWeight: 800, fontSize: 78, color: K.merah, whiteSpace: 'nowrap' }}>
            terkenal sulit
          </Stempel>
        </div>
      ) : null}
    </div>
  );
};

// hook: ratusan petak protein (penghitung 200 juta+) di sekitar protein utama
const GridProtein: React.FC<{ T: WP }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const pola = useMemo(() => [0, 1, 2, 3].map(petakSvg), []);
  const KOL = 9;
  const BAR = 14;
  const L = 124;
  const urut = useMemo(
    () => Array.from({ length: KOL * BAR }, (_, i) => ({ i, c: i % KOL, r: Math.floor(i / KOL) })).filter((e) => e.r >= 3 && e.r <= 11).sort((a, b) => Math.hypot(a.c - 4, a.r - 7) - Math.hypot(b.c - 4, b.r - 7)),
    [],
  );
  if (t < T.n200 - 0.3 || t > S[1].mulai + 0.8) return null;
  const p = maju(t, T.n200 - 0.1, T.hampir + 0.3, EASE.kamera);
  const o = maju(t, T.n200 - 0.3, T.n200) * (1 - maju(t, S[1].mulai + 0.2, S[1].mulai + 0.7));
  const x0 = PC.x - ((KOL - 1) / 2) * L;
  const y0 = PC.y - 7 * L;
  const n = Math.round(urut.length * p);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      {urut.slice(1, n).map(({ i, c, r }) => (
        <div key={i} style={{ position: 'absolute', left: x0 + c * L - 50, top: y0 + r * L - 50, width: 100, height: 100, backgroundImage: pola[i % 4], backgroundSize: '100px 100px', rotate: `${(random(`rt${i}`) * 360 + t * 20 * (i % 2 ? 1 : -1)).toFixed(1)}deg`, opacity: 0.85 }} />
      ))}
    </div>
  );
};

// S4: urutan huruf asam amino jalan di atas protein lurus, ujungnya "?"
const SEQ = 'MKTAYIAKQRQISFVKSHFSRQLEERLG';
const Urutan: React.FC<{ T: WP }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[3].mulai - 0.1 || t > S[4].mulai + 0.2) return null;
  const o = maju(t, S[3].mulai, S[3].mulai + 0.3) * (1 - maju(t, S[4].mulai - 0.2, S[4].mulai + 0.1));
  const n = Math.round(SEQ.length * maju(t, T.urutan - 0.3, T.urutan + 1.0, EASE.linear));
  const geser = t * 30;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      <div style={{ position: 'absolute', left: PC.x, top: PC.y - 250, translate: '-50% 0', display: 'flex', gap: 6 }}>
        {SEQ.slice(0, 14).split('').map((c, i) => (
          <span key={i} style={{ width: 52, height: 62, borderRadius: 10, background: i < n ? WARNA[i % WARNA.length] : '#16243f', color: K.latar, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 36, translate: `0 ${(Math.sin(geser * 0.1 + i) * 4).toFixed(1)}px` }}>
            {i < n ? c : ''}
          </span>
        ))}
      </div>
      <div style={{ position: 'absolute', left: PC.x, top: PC.y - 330, translate: '-50% 0', fontFamily: MONO, fontWeight: 700, fontSize: 28, color: K.abu, whiteSpace: 'nowrap', opacity: maju(t, T.urutan - 0.3, T.urutan) }}>urutan asam amino</div>
      <div style={{ position: 'absolute', left: PC.x, top: PC.y + 95, translate: '-50% 0', fontFamily: SAIRA, fontWeight: 800, fontSize: 160, color: K.kuning, opacity: maju(t, T.urutan + 0.4, T.urutan + 0.7) * (0.7 + 0.3 * Math.sin(t * 6)) }}>?</div>
    </div>
  );
};

// ===============================================================================================================
// HUD
const Plakat: React.FC<{ T: WP }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[1].mulai - 0.1 || t > S[2].mulai + 0.3) return null;
  const kel = S[2].mulai - 0.25;
  const buka = maju(t, T.gratis - 0.1, T.gratis + 0.3, EASE.kamera);
  return (
    <>
      <Muncul mulai={T.alpha - 0.1} keluar={kel} x={540} y={660} seed="af">
        <Kartu warna={K.teal} gaya={{ display: 'flex', alignItems: 'center', gap: 20, padding: '14px 30px' }}>
          <div style={{ width: 84, height: 84, position: 'relative' }}>
            <Protein lipat={1} sudut={t * 0.8} skala={14} cx={42} cy={42} />
          </div>
          <div>
            {besar('AlphaFold', K.tinta, 66)}
            {kecil('Google DeepMind', K.teal, 28)}
          </div>
        </Kartu>
      </Muncul>
      <Muncul mulai={T.n2022 - 0.15} keluar={kel + 0.05} x={540} y={900} seed="db">
        <Kartu warna={K.kuning} gaya={{ display: 'flex', alignItems: 'center', gap: 22, padding: '14px 30px' }}>
          <svg width={86} height={96} viewBox="0 0 100 110">
            <rect x={16} y={52} width={68} height={52} rx={8} fill={K.kuning} />
            <path d={`M 30 52 L 30 ${36 - 10 * buka} Q 30 ${16 - 10 * buka} 50 ${16 - 10 * buka} Q 70 ${16 - 10 * buka} 70 ${36 - 10 * buka} L 70 ${52 - 40 * buka}`} fill="none" stroke={K.kuning} strokeWidth={9} strokeLinecap="round" />
          </svg>
          <div>
            {kecil('database tebakan bentuk', K.abu, 26)}
            {besar(buka > 0.5 ? 'dibuka GRATIS · 2022' : '2022', buka > 0.5 ? K.kuning : K.tinta, 58)}
          </div>
        </Kartu>
      </Muncul>
      <Muncul mulai={T.embl - 0.1} keluar={kel + 0.1} x={540} y={1120} seed="eb">
        <Kartu warna={K.teal} gaya={{ padding: '8px 30px' }}>
          {besar('bareng EMBL-EBI', K.teal, 58)}
        </Kartu>
      </Muncul>
    </>
  );
};

const Kalender: React.FC<{ T: WP }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[4].mulai - 0.1 || t > S[5].mulai + 0.3) return null;
  const kel = S[5].mulai - 0.25;
  const pB = maju(t, T.bulan - 0.3, T.tahun4 - 0.1, EASE.linear);
  const pT = maju(t, T.tahun4 - 0.1, S[4].akhir, EASE.linear);
  const bulanN = Math.min(12, 1 + Math.floor(pB * 12));
  const tahunN = 1 + Math.floor(pT * 3);
  const NAMA = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const flip = (t * 8) % 1;
  return (
    <>
      <Muncul mulai={S[4].mulai + 0.05} keluar={kel} x={540} y={820} seed="kl">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 360, height: 380, borderRadius: 24, background: 'rgba(7,12,24,0.95)', border: `5px solid ${pT > 0 ? K.merah : K.kuning}`, overflow: 'hidden', position: 'relative' }}>
            <div style={{ height: 90, background: pT > 0 ? K.merah : K.kuning, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SAIRA, fontWeight: 800, fontSize: 56, color: K.latar }}>
              {pT > 0 ? `tahun ke-${tahunN}` : NAMA[(bulanN - 1) % 12]}
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 90, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SAIRA, fontWeight: 800, fontSize: 170, color: K.tinta, fontVariantNumeric: 'tabular-nums', transform: `rotateX(${(flip * 30).toFixed(1)}deg)` }}>
              {pT > 0 ? tahunN : bulanN}
            </div>
          </div>
          {besar(pT > 0 ? 'bertahun-tahun' : 'berbulan-bulan', pT > 0 ? K.merah : K.kuning, 70)}
          {kecil('buat nentuin struktur 3D 1 protein', K.abu, 28)}
        </div>
      </Muncul>
    </>
  );
};

const Af2: React.FC<{ T: WP }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[5].mulai - 0.1 || t > S[6].mulai + 0.3) return null;
  const kel = S[6].mulai - 0.25;
  const jarum = maju(t, T.menit - 0.6, T.menit + 0.4, EASE.kamera);
  return (
    <>
      <Muncul mulai={T.demis - 0.1} keluar={kel} x={290} y={560} seed="dh">
        <Kartu warna={K.teal} gaya={{ padding: '10px 24px' }}>
          {besar('Demis Hassabis', K.tinta, 48)}
        </Kartu>
      </Muncul>
      <Muncul mulai={T.john - 0.1} keluar={kel + 0.04} x={790} y={560} seed="jj">
        <Kartu warna={K.teal} gaya={{ padding: '10px 24px' }}>
          {besar('John Jumper', K.tinta, 48)}
        </Kartu>
      </Muncul>
      <Muncul mulai={T.af2 - 0.1} keluar={kel + 0.08} x={540} y={1150} seed="a2">
        <Kartu warna={K.kuning} isi gaya={{ display: 'flex', alignItems: 'center', gap: 20, padding: '8px 30px' }}>
          {besar('AlphaFold2', K.latar, 66)}
          <svg width={84} height={84} viewBox="-50 -50 100 100">
            <circle r={40} fill="none" stroke={K.latar} strokeWidth={8} />
            <line x1={0} y1={-46} x2={0} y2={-56} stroke={K.latar} strokeWidth={8} />
            <line x1={0} y1={0} x2={Math.sin(jarum * Math.PI * 2 + t * 4) * 30} y2={-Math.cos(jarum * Math.PI * 2 + t * 4) * 30} stroke={K.latar} strokeWidth={7} strokeLinecap="round" />
          </svg>
          {t > T.menit - 0.1 ? besar('menit', K.latar, 66) : null}
        </Kartu>
      </Muncul>
    </>
  );
};

const Medali: React.FC<{ T: WP }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[6].mulai - 0.1 || t > S[7].mulai + 0.3) return null;
  const kel = S[7].mulai - 0.25;
  const o = maju(t, S[6].mulai, S[6].mulai + 0.2) * (1 - maju(t, kel, kel + 0.25));
  const belah = maju(t, T.setengah2 - 0.6, T.setengah2 - 0.1, EASE.kamera);
  const m = pegas(t, T.nobel - 0.2, fps, { damping: 11, stiffness: 180, mass: 0.6 });
  const R = 170;
  const cx = 540;
  const cy = 800;
  const sisi = (kiri: boolean) => (
    <svg width={R * 2 + 20} height={R * 2 + 20} viewBox={`${-R - 10} ${-R - 10} ${R * 2 + 20} ${R * 2 + 20}`} style={{ position: 'absolute', left: cx - R - 10 + (kiri ? -1 : 1) * belah * 150, top: cy - R - 10, overflow: 'visible' }}>
      <defs>
        <clipPath id={kiri ? 'mkiri' : 'mkanan'}>
          <rect x={kiri ? -R - 10 : 0} y={-R - 10} width={R + 10} height={R * 2 + 20} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${kiri ? 'mkiri' : 'mkanan'})`} transform={`rotate(${(kiri ? -1 : 1) * belah * 8})`}>
        <circle r={R} fill="#e0a82e" stroke="#ffd36b" strokeWidth={12} />
        <circle r={R - 34} fill="none" stroke="#b07d17" strokeWidth={5} />
        <text x={0} y={-12} textAnchor="middle" fontFamily={SAIRA} fontWeight={800} fontSize={66} fill="#5a3d06">NOBEL</text>
        <text x={0} y={52} textAnchor="middle" fontFamily={SAIRA} fontWeight={800} fontSize={50} fill="#5a3d06">KIMIA 2024</text>
      </g>
    </svg>
  );
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: o }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, scale: String(Math.max(0.001, m)), transformOrigin: `${cx}px ${cy}px` }}>
        {sisi(true)}
        {sisi(false)}
      </div>
      {belah > 0.3 ? (
        <>
          <div style={{ position: 'absolute', left: 270, top: 1040, translate: '-50% 0', opacity: maju(t, T.setengah2 - 0.3, T.setengah2), textAlign: 'center' }}>
            {besar('½ Hassabis', K.kuning, 54)}
            {besar('& Jumper', K.kuning, 54)}
            {kecil('prediksi struktur protein', K.abu, 22)}
          </div>
          <div style={{ position: 'absolute', left: 810, top: 1040, translate: '-50% 0', opacity: maju(t, T.baker - 0.2, T.baker + 0.1), textAlign: 'center' }}>
            {besar('½ David Baker', K.teal, 54)}
            {kecil('ngerancang protein baru', K.abu, 22)}
          </div>
        </>
      ) : null}
    </div>
  );
};

const GarisWaktu: React.FC<{ T: WP }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[7].mulai - 0.1 || t > S[8].mulai + 0.3) return null;
  const kel = S[8].mulai - 0.25;
  const o = maju(t, S[7].mulai, S[7].mulai + 0.2) * (1 - maju(t, kel, kel + 0.25));
  const p = maju(t, T.komite + 0.1, T.n50 + 0.3, EASE.kamera);
  const x0 = 120;
  const x1 = 960;
  const Y = 860;
  const xp = lerp(x0, x1, p);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: o }}>
      <div style={{ position: 'absolute', left: x0, top: Y - 14, width: x1 - x0, height: 28, borderRadius: 14, background: '#16243f' }} />
      <div style={{ position: 'absolute', left: x0, top: Y - 14, width: xp - x0, height: 28, borderRadius: 14, background: K.kuning }} />
      {[0, 10, 20, 30, 40, 50].map((v) => {
        const x = lerp(x0, x1, v / 50);
        return (
          <div key={v} style={{ position: 'absolute', left: x, top: Y + 30, translate: '-50% 0', fontFamily: MONO, fontWeight: 700, fontSize: 26, color: xp >= x - 2 ? K.tinta : K.redup }}>
            {1970 + v}
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: xp, top: Y - 150, translate: '-50% 0', display: 'flex', alignItems: 'baseline', gap: 10, padding: '6px 22px', borderRadius: 16, background: 'rgba(7,12,24,0.95)', border: `4px solid ${K.kuning}`, whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 76, color: K.kuning, fontVariantNumeric: 'tabular-nums' }}>{Math.round(50 * p)}</span>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: K.abu }}>tahun</span>
      </div>
      {p > 0.98 ? (
        <div style={{ position: 'absolute', left: 540, top: Y + 150, translate: '-50% 0' }}>
          <Stempel mulai={T.n50 + 0.3} rot={-6} gaya={{ padding: '6px 30px', borderRadius: 16, border: `7px solid ${K.teal}`, background: 'rgba(7,12,24,0.88)', fontFamily: SAIRA, fontWeight: 800, fontSize: 76, color: K.teal, whiteSpace: 'nowrap', scale: String(pegas(t, T.n50 + 0.3, fps, { damping: 200 })) }}>
            diselesaiin AlphaFold2 ✓
          </Stempel>
        </div>
      ) : null}
    </div>
  );
};

const Dipakai: React.FC<{ T: WP }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const titik = useMemo(() => Array.from({ length: 70 }, (_, i) => ({ a: random(`ga${i}`) * Math.PI * 2, b: Math.acos(2 * random(`gb${i}`) - 1) })), []);
  if (t < S[8].mulai - 0.1 || t > T.keluarDunia + 0.3) return null;
  const kel = T.keluarDunia - 0.1;
  const pO = maju(t, T.dua - 0.4, T.dua + 0.6, EASE.kamera);
  const pN = maju(t, T.n190 - 0.4, T.n190 + 0.5, EASE.kamera);
  const R = 170;
  return (
    <>
      <Muncul mulai={S[8].mulai + 0.05} keluar={kel} x={300} y={760} seed="gl">
        <svg width={R * 2 + 20} height={R * 2 + 20} viewBox={`${-R - 10} ${-R - 10} ${R * 2 + 20} ${R * 2 + 20}`}>
          <circle r={R} fill="#0f1a33" stroke={K.teal} strokeWidth={6} />
          {[-0.5, 0, 0.5].map((v) => (
            <ellipse key={v} cx={0} cy={v * R} rx={R * Math.sqrt(1 - v * v)} ry={R * 0.12 * Math.sqrt(1 - v * v)} fill="none" stroke={K.garis} strokeWidth={3} />
          ))}
          {titik.slice(0, Math.round(70 * pO)).map((q, i) => {
            const a = q.a + t * 0.5;
            const x = R * Math.sin(q.b) * Math.cos(a);
            const z = R * Math.sin(q.b) * Math.sin(a);
            const y = R * Math.cos(q.b);
            return z > 0 ? <circle key={i} cx={x} cy={y} r={7} fill={i % 3 ? K.kuning : K.teal} /> : null;
          })}
        </svg>
      </Muncul>
      <Muncul mulai={T.dua - 0.3} keluar={kel + 0.04} x={770} y={680} seed="o2">
        <Kartu warna={K.kuning} gaya={{ padding: '10px 26px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 84, color: K.kuning, fontVariantNumeric: 'tabular-nums' }}>{formatAngka(2 * pO, 1).replace(',0', '')}</span>
            <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 56, color: K.tinta }}>juta+</span>
          </div>
          {kecil('orang', K.abu, 28)}
        </Kartu>
      </Muncul>
      <Muncul mulai={T.n190 - 0.3} keluar={kel + 0.08} x={770} y={880} seed="n1">
        <Kartu warna={K.teal} gaya={{ padding: '10px 26px' }}>
          <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 84, color: K.teal, fontVariantNumeric: 'tabular-nums' }}>{Math.round(190 * pN)}</span>
          {kecil('negara', K.abu, 28)}
        </Kartu>
      </Muncul>
      <Muncul mulai={T.antibiotik - 0.2} keluar={kel + 0.12} x={290} y={1110} seed="ab">
        <Kartu warna={K.merah} gaya={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px' }}>
          <svg width={70} height={70} viewBox="0 0 100 100">
            <g transform="rotate(-40 50 50)">
              <rect x={14} y={34} width={72} height={32} rx={16} fill="none" stroke={K.merah} strokeWidth={7} />
              <path d="M 50 34 L 50 66" stroke={K.merah} strokeWidth={7} />
              <path d="M 50 38 L 70 38 Q 82 38 82 50 Q 82 62 70 62 L 50 62 Z" fill={K.merah} />
            </g>
          </svg>
          <div>
            {besar('resistensi', K.tinta, 44)}
            {besar('antibiotik', K.tinta, 44)}
          </div>
        </Kartu>
      </Muncul>
      <Muncul mulai={T.plastik - 0.25} keluar={kel + 0.16} x={790} y={1110} seed="pl">
        <Kartu warna={K.teal} gaya={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px' }}>
          <svg width={70} height={70} viewBox="0 0 100 100">
            <path d="M 40 8 L 60 8 L 60 20 Q 74 28 74 44 L 74 88 Q 74 94 68 94 L 32 94 Q 26 94 26 88 L 26 44 Q 26 28 40 20 Z" fill="none" stroke={K.teal} strokeWidth={7} />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={40 + i * 10 + Math.sin(t * 4 + i) * 4} cy={60 + i * 9} r={5} fill={K.kuning} />
            ))}
          </svg>
          <div>
            {besar('enzim pengurai', K.tinta, 44)}
            {besar('plastik', K.tinta, 44)}
          </div>
        </Kartu>
      </Muncul>
    </>
  );
};

const Hud: React.FC<{ T: WP }> = ({ T }) => {
  const S = T.s;
  return (
    <HudTeks
      T={T}
      sumber={() => 'Sumber: NobelPrize.org (2024) · EMBL-EBI & Google DeepMind (2022)'}
      teks={[
        { label: ['BENTUK', '3D', 'PROTEIN'], judul: [{ t: '200', mulai: T.n200, isi: sorot('200', T.n200 + 0.15) }, { t: 'juta+', mulai: T.n200 + 0.2, warna: K.kuning }, { t: 'protein', mulai: T.n200 + 0.4 }], jMulai: T.n200, catatan: 'hampir semua yang dikenal ilmuwan', cMulai: T.hampir },
        { label: ['DIBUKA', 'GRATIS', '2022'], judul: [{ t: 'AlphaFold', mulai: T.alpha }, { t: '·', mulai: T.google - 0.1, warna: K.abu }, { t: 'DeepMind', mulai: T.google, warna: K.teal }, { t: '×', mulai: T.embl - 0.15, warna: K.abu }, { t: 'EMBL-EBI', mulai: T.embl, warna: K.kuning }], ukuran: 80 },
        { label: ['APA', 'ITU', 'PROTEIN'], judul: [{ t: 'asam', mulai: T.asam }, { t: 'amino', mulai: T.asam + 0.2 }, { t: '→', mulai: T.ngelipat - 0.1, warna: K.abu }, { t: 'lipatan', mulai: T.ngelipat, warna: K.teal }, { t: '3D', mulai: T.ngelipat + 0.25, warna: K.teal }] },
        { label: ['TANTANGAN', 'LAMA'], judul: [{ t: 'sejak', mulai: S[3].mulai + 0.1 }, { t: '1970-an', mulai: T.n1970, isi: sorot('1970-an', T.n1970 + 0.15) }], catatan: 'nebak bentuk dari urutan asam amino', cMulai: T.urutan },
        { label: ['DULU', 'DI', 'LAB'], judul: [{ t: 'bulan', mulai: T.bulan, warna: K.kuning }, { t: '–', mulai: T.tahun4 - 0.15, warna: K.abu }, { t: 'tahun', mulai: T.tahun4, warna: K.merah }], catatan: 'buat 1 protein', cMulai: T.bulan + 0.4 },
        { label: ['2020'], judul: [{ t: 'AlphaFold2:', mulai: T.af2 }, { t: 'menit', mulai: T.menit, isi: sorot('menit', T.menit + 0.15) }] },
        { label: ['DIBAGI', 'DUA'], judul: [{ t: 'Nobel', mulai: T.nobel, warna: K.kuning }, { t: 'Kimia', mulai: T.nobel + 0.2, warna: K.kuning }, { t: '2024', mulai: T.nobel + 0.4 }], jMulai: T.n2024 },
        { label: ['KATA', 'KOMITE', 'NOBEL'], judul: [{ t: 'masalah', mulai: T.komite + 0.3 }, { t: '50', mulai: T.n50, isi: sorot('50', T.n50 + 0.15) }, { t: 'tahun', mulai: T.n50 + 0.2 }] },
        { label: ['UDAH', 'DIPAKAI'], judul: [{ t: '2', mulai: T.dua, warna: K.kuning }, { t: 'juta+', mulai: T.dua + 0.2, warna: K.kuning }, { t: 'orang', mulai: T.dua + 0.4 }, { t: '·', mulai: T.n190 - 0.1, warna: K.abu }, { t: '190', mulai: T.n190, warna: K.teal }, { t: 'negara', mulai: T.n190 + 0.2 }], ukuran: 84 },
        { label: ['BUAT', 'FAKTA', 'AI', 'BERIKUTNYA'], judul: [{ t: 'simpan', mulai: T.simpan + 0.05, warna: K.kuning }, { t: '&', mulai: T.follow - 0.25, warna: K.abu }, { t: 'follow', mulai: T.follow, warna: K.teal }], jMulai: T.simpan },
      ]}
    />
  );
};

function daftarSfx(T: WP) {
  const S = T.s;
  const grid = Array.from({ length: 10 }, (_, i) => bunyi('tik', T.n200 - 0.1 + i * ((Math.max(1, T.hampir + 0.3 - T.n200)) / 10), 0.13));
  const seq = Array.from({ length: 8 }, (_, i) => bunyi('tik', T.urutan - 0.3 + i * 0.16, 0.12));
  const kal = Array.from({ length: 12 }, (_, i) => bunyi('tik', T.bulan - 0.3 + i * ((Math.max(1.2, S[4].akhir - T.bulan)) / 12), 0.12));
  const gw = Array.from({ length: 6 }, (_, i) => bunyi('tik', T.komite + 0.1 + i * ((Math.max(0.6, T.n50 + 0.2 - T.komite)) / 6), 0.13));
  return [
    bunyi('whooshPop', 0.08, 0.3),
    bunyi('pop', 0.35, 0.25),
    bunyi('whooshB', T.n200 - 0.2, 0.3),
    ...grid,
    bunyi('kunci', T.hampir + 0.3, 0.3),
    bunyi('whooshA', S[1].mulai, 0.3),
    bunyi('pop', T.alpha, 0.3),
    bunyi('pop', T.n2022, 0.3),
    bunyi('kunci', T.gratis, 0.35),
    bunyi('pop', T.embl, 0.3),
    bunyi('whooshLembut', T.rantai - 0.2, 0.3),
    bunyi('swish', T.ngelipat, 0.3),
    bunyi('pop', T.fungsi, 0.3),
    bunyi('whooshB', S[3].mulai, 0.3),
    ...seq,
    bunyi('hantam', T.sulit + 0.03, 0.45),
    bunyi('jepret', T.sulit + 0.05, 0.3),
    bunyi('whooshPop', S[4].mulai, 0.3),
    ...kal,
    bunyi('whooshA', S[5].mulai, 0.3),
    bunyi('pop', T.demis, 0.3),
    bunyi('pop', T.john, 0.3),
    bunyi('pop', T.af2, 0.3),
    bunyi('swish', T.menit - 0.3, 0.3),
    bunyi('kunci', T.menit + 0.15, 0.35),
    bunyi('whooshBerat', S[6].mulai, 0.35),
    bunyi('pop', T.nobel, 0.3),
    bunyi('sapuHit', T.setengah2 - 0.4, 0.3),
    bunyi('pop', T.baker, 0.3),
    bunyi('whooshB', S[7].mulai, 0.3),
    ...gw,
    bunyi('hantam', T.n50 + 0.38, 0.4),
    bunyi('whooshA', S[8].mulai, 0.3),
    bunyi('pop', T.dua, 0.3),
    bunyi('pop', T.n190, 0.3),
    bunyi('pop', T.antibiotik, 0.3),
    bunyi('pop', T.plastik, 0.3),
    bunyi('whooshTerang', T.keluarDunia + 0.1, 0.3),
    bunyi('pop', T.simpan + 0.15, 0.35),
    bunyi('klik', T.simpan + 0.65, 0.4),
    bunyi('pop', T.follow - 0.2, 0.3),
    bunyi('klik', T.follow + 0.3, 0.4),
    bunyi('whooshLembut', T.keluarCta + 0.05, 0.3),
  ];
}

// ===============================================================================================================
// SAMPUL: "AI yang nebak bentuk 200 juta protein" + protein 3D besar menyala
export const ContohProteinSampul: React.FC = () => {
  const kam = { x: 540, y: 960, z: 1, vx: 0, vy: 0, lebar: 1080, tinggi: 1920 };
  return (
    <AbsoluteFill style={{ background: K.latar, overflow: 'hidden' }}>
      <LatarSeri kam={kam} kabut={['61,219,200', '111,140,255', '255,197,61']} />
      <Protein lipat={1} sudut={0.9} skala={120} cx={540} cy={1080} cahaya={1} />
      <div style={{ position: 'absolute', left: 90, top: 196, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 10, height: 44, borderRadius: 5, background: K.teal }} />
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: K.abu }}>ALPHAFOLD · NOBEL 2024</div>
      </div>
      <div style={{ position: 'absolute', left: 90, top: 262, width: 780, fontFamily: SAIRA, fontWeight: 800, fontSize: 118, lineHeight: 1.04, color: K.tinta }}>
        <div>AI nebak bentuk</div>
        <div>
          <span style={{ display: 'inline-block', background: K.kuning, color: K.latar, padding: '0 0.1em', borderRadius: 12, lineHeight: 0.98 }}>200 juta+</span> protein
        </div>
      </div>
      <Grain kuat={0.06} garisScan={0} vinyet={0.45} warnaVinyet="2,5,14" />
    </AbsoluteFill>
  );
};
