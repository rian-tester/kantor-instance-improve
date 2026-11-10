// Frame hero (pembuka, tengah, puncak): 15, 604, 1006.
// contoh video explainer #2 (akun generik, konten contoh): "Kenapa AI susah ngitung huruf r di strawberry".
// SISTEM: infografis kertas — kertas krem + tinta, kuning = sorotan/selotip, teal = angka (cara AI baca), merah = huruf r &
// yang salah. Font: Roboto Slab (judul/huruf) + JetBrains Mono (token/angka) + Kalam (anotasi tangan).
// SATU MEJA KERTAS, kamera geser: A chat (hook) → B pita kalimat dipotong jadi token → token jadi angka → C kata
// "strawberry" dipotong st·raw·berry → balik ke B: 3 potongan ambruk jadi SATU angka 101830 → huruf r ilang → trik ngeja
// (angka pecah jadi 10 huruf, r dihitung 1-2-3) → balik ke A (bookend) → loop.
// Potongan & angka = hasil asli tokenizer OpenAI (tiktoken, o200k_base/GPT-4o, dicek 16/10/2026).
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  AngkaJalan, BalikKartu, Bunyi, campur, Dunia, EASE, GarisDigambar, Grain, hitungKamera, JEPIT, Karakter, KataMuncul, maju,
  noise, Paralaks, pathLingkarTangan, pathPanah, pegas, Pop, SapuSorot, Squash, Stempel, Subtitle, useDetik, ZoomTembus,
  type Kamera, type Kata, type KunciKamera, type Sfx,
} from "../../src/gerak";
import { MONO, SLAB, TANGAN } from "../../src/gerak/font";
import type { Kalimat } from "./waktu144";
import { waktuStrawberry, type WaktuS } from "./waktuStrawberry";

export type DataExplainer = { durasi: number; kata: Kata[]; kalimat?: Kalimat[]; mulut: number[]; keras: number[] };

const W = 1920;
const H = 1080;
const A = { x: 960, y: 540 };
const B = { x: 3360, y: 540 };
const C = { x: 5760, y: 540 };

export const K = {
  kertas: '#ebe3d1',
  kertasTua: '#dcd0b6',
  putih: '#fbf8f1',
  tinta: '#1d1b18',
  abu: '#6d665a',
  merah: '#d93a2b',
  kuning: '#f4c518',
  teal: '#14877c',
  tealMuda: '#cde6e0',
};

export const SFX = {
  pop: { src: '', puncak: 0.113 },
  swish: { src: '', puncak: 0.172 },
  hantam: { src: '', puncak: 0.305 },
  klik: { src: '', puncak: 0.14 },
  tik: { src: '', puncak: 0.071 },
  whoosh: { src: '', puncak: 0.148 },
  glitch: { src: '', puncak: 0.071 },
  bass: { src: '', puncak: 0.371 },
  jepret: { src: '', puncak: 0.116 },
  kunci: { src: '', puncak: 0.274 },
  hit: { src: '', puncak: 0.127 },
};

// ---------- token asli (tiktoken o200k_base) ----------
export const TOKEN = [
  { t: 'ada', sp: false, id: 1194 },
  { t: 'ber', sp: true, id: 5009 },
  { t: 'apa', sp: false, id: 7063 },
  { t: 'hur', sp: true, id: 21317 },
  { t: 'uf', sp: false, id: 1427 },
  { t: 'r', sp: true, id: 428 },
  { t: 'di', sp: true, id: 1320 },
  { t: 'strawberry', sp: true, id: 101830 },
  { t: '?', sp: false, id: 30 },
];
const CW = 30; // lebar 1 huruf mono 50 px
const PAD = 16;
const CELAH = 22;
const TINGGI_TOKEN = 96;
const LEBAR_TOKEN = TOKEN.map((k) => Math.max(k.t.length + (k.sp ? 1 : 0), String(k.id).length) * CW + PAD * 2);
const TOTAL_TOKEN = LEBAR_TOKEN.reduce((a, b) => a + b, 0);
const PITA_Y = 470; // tengah pita token di stasiun B
export const KATA = 'strawberry'.split('');
export const POTONG = [
  { dari: 0, sampai: 2, teks: 'st', id: 302, warna: K.kuning },
  { dari: 2, sampai: 5, teks: 'raw', id: 1618, warna: K.tealMuda },
  { dari: 5, sampai: 10, teks: 'berry', id: 19772, warna: K.kuning },
];
const UBIN = { w: 110, h: 150, celah: 10, fs: 118 };
const LEBAR_KATA = KATA.length * UBIN.w + (KATA.length - 1) * UBIN.celah;

/** posisi x kiri tiap token (koordinat dunia) dengan celah potong g[i] (0..1) */
function posisiToken(g: number[]) {
  const buka = g.reduce((a, b) => a + b, 0) * CELAH;
  let x = B.x - (TOTAL_TOKEN + buka) / 2;
  return LEBAR_TOKEN.map((w, i) => {
    if (i > 0) x += g[i] * CELAH;
    const kiri = x;
    x += w;
    return kiri;
  });
}
const X_TOK8 = (() => {
  const p = posisiToken(TOKEN.map(() => 1));
  return p[7] + LEBAR_TOKEN[7] / 2;
})();

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

function kunciKamera(T: WaktuS): KunciKamera[] {
  const pelan = Easing.inOut(Easing.sin);
  return [
    { t: 0, x: A.x, y: A.y - 20, z: 1.04 },
    { t: T.keB, x: A.x + 40, y: A.y - 70, z: 1.13, ease: pelan },
    { t: T.diB, x: B.x, y: B.y, z: 1 },
    { t: T.dipotong, x: B.x - 30, y: B.y - 20, z: 1.07, ease: pelan }, // dorong pelan ke pita sebelum dipotong
    { t: T.k3.mulai, x: B.x, y: B.y + 10, z: 1.02, ease: pelan },
    { t: T.diolah, x: B.x, y: B.y + 60, z: 0.98 },
    { t: T.keC, x: B.x, y: B.y + 60, z: 0.99, ease: pelan },
    { t: T.diC, x: C.x, y: C.y, z: 1 },
    { t: T.tiga, x: C.x, y: C.y + 10, z: 1.03, ease: pelan },
    { t: T.balikB, x: C.x, y: C.y + 20, z: 1.04, ease: pelan },
    { t: T.diB2, x: X_TOK8 - 120, y: B.y - 40, z: 1.05 },
    { t: T.cuma5, x: X_TOK8 - 60, y: B.y - 30, z: 1.12, ease: pelan },
    { t: T.lebur + 0.45, x: X_TOK8, y: PITA_Y + 20, z: 1.5 },
    { t: T.huruf6, x: X_TOK8, y: PITA_Y + 10, z: 1.56, ease: pelan },
    { t: T.triknya, x: X_TOK8, y: PITA_Y + 40, z: 1.4, ease: pelan },
    { t: T.ngeja + 0.3, x: X_TOK8, y: 600, z: 1.08 },
    { t: T.keA, x: X_TOK8, y: 610, z: 1.05, ease: pelan },
    { t: T.diA, x: A.x, y: A.y, z: 1, ease: Easing.inOut(Easing.poly(4)) },
    { t: T.loop, x: A.x, y: A.y - 10, z: 1.03, ease: pelan },
    { t: T.total - 0.2, x: A.x, y: A.y - 20, z: 1.04 },
  ];
}

// ======================================================================================================
export const ContohToken169: React.FC<DataExplainer> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuStrawberry(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const kunci = useMemo(() => kunciKamera(T), [T]);
  const kam = hitungKamera(kunci, t, fps, {
    lebar: W,
    tinggi: H,
    drift: 2,
    getar: [
      { t: T.stempel + 0.08, kuat: 12, lama: 0.16 },
      { t: T.lebur + 0.22, kuat: 10, lama: 0.16 },
      { t: T.diC - 0.05, kuat: 4 },
    ],
  });
  return (
    <AbsoluteFill style={{ background: K.kertas, fontFamily: SLAB, color: K.tinta, overflow: 'hidden' }}>
      <LatarKertas kamera={kam} />
      <Dunia kamera={kam} tinggiDunia={1400} lebarDunia={7000} blurGerak={1100}>
        <Chat T={T} />
        <MejaToken T={T} />
        <MejaKata T={T} />
        <Trik T={T} />
      </Dunia>
      <HUD T={T} />
      <></>
      <Subtitle kata={d.kata} kalimat={d.kalimat} font={SLAB} tebal={800} ukuran={44} maksHuruf={46} sorot={K.kuning} sampai={T.loop + 0.1} zona={[{ dari: 0, x: 900, y: 926, lebar: 1250 }]} />
      <Grain kuat={0.2} garisScan={0} vinyet={0.32} warnaVinyet="70,50,25" />
      <></>
    </AbsoluteFill>
  );
};

function daftarSfx(T: WaktuS): Sfx[] {
  const s = (k: keyof typeof SFX, momen: number, vol: number): Sfx => ({ ...SFX[k], momen, vol });
  const potong = TOKEN.slice(1).map((_, i) => s('tik', waktuPotong(T, i + 1), 0.22));
  return [
    s('pop', T.tanya, 0.5),
    s('pop', T.jawab, 0.35),
    s('swish', T.coret + 0.05, 0.45),
    s('hantam', T.stempel + 0.08, 0.8),
    s('tik', T.r1, 0.4),
    s('swish', T.straw1 + 0.05, 0.3),
    s('whoosh', T.keB + 0.3, 0.5),
    ...potong,
    s('pop', T.token2, 0.4),
    s('kunci', T.diubah, 0.4),
    s('kunci', T.diubah + 0.3, 0.3),
    s('pop', T.diolah + 0.55, 0.45),
    s('whoosh', T.keC + 0.3, 0.5),
    s('pop', T.diC, 0.4),
    s('swish', T.dipotong4, 0.45),
    s('swish', T.dipotong4 + 0.28, 0.4),
    s('pop', T.tiga, 0.4),
    s('tik', T.este + 0.15, 0.45),
    s('tik', T.raw + 0.15, 0.45),
    s('tik', T.berry + 0.15, 0.45),
    s('whoosh', T.balikB + 0.3, 0.5),
    s('tik', T.sepuluh + 0.1, 0.25),
    s('tik', T.sepuluh + 0.35, 0.25),
    s('hantam', T.lebur + 0.22, 0.75),
    s('jepret', T.liat, 0.5),
    s('glitch', T.keliatan, 0.4),
    s('pop', T.ngeja + 0.1, 0.35),
    s('pop', T.ngeja + 0.45, 0.3),
    s('klik', T.baru - 0.15, 0.5),
    s('klik', T.baru + 0.15, 0.5),
    s('hit', T.ngitung + 0.12, 0.45),
    s('bass', T.keA + 0.3, 0.5),
    s('pop', T.deh, 0.45),
  ];
}

// ======================================================================================================
// LATAR: kertas grafik nempel di dunia (geser bareng kamera) + noda tinta samar (lebih jauh)
export const LatarKertas: React.FC<{ kamera: Kamera }> = ({ kamera }) => {
  const t = useDetik();
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${50 + noise('lk', t * 0.1) * 6}% 40%, #f1ead9 0%, ${K.kertas} 55%, #e2d8c2 100%)` }} />
      <Paralaks
        kamera={kamera}
        lapis={[
          { faktor: 0.55, pola: 'radial-gradient(circle at 30% 40%, rgba(140,110,60,0.07) 0, transparent 160px), radial-gradient(circle at 75% 70%, rgba(20,135,124,0.05) 0, transparent 200px)', ukuran: '900px 700px' },
          {
            faktor: 1,
            pola: 'linear-gradient(rgba(70,60,40,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(70,60,40,0.07) 2px, transparent 2px)',
            ukuran: '60px 60px',
          },
        ]}
      />
    </>
  );
};

/** Selotip kecil semi-transparan (nempelin kertas). */
export const Selotip: React.FC<{ x: number; y: number; w?: number; rot?: number; warna?: string }> = ({ x, y, w = 110, rot = -8, warna = 'rgba(244,197,24,0.55)' }) => (
  <div style={{ position: 'absolute', left: x - w / 2, top: y - 17, width: w, height: 34, background: warna, rotate: `${rot}deg`, boxShadow: '0 1px 2px rgba(0,0,0,0.12)' }} />
);

// ======================================================================================================
// A: CHAT (hook + bookend)
const BUB_U = { x: 700, y: 214, w: 760, h: 196 };
const BUB_A = { x: 470, y: 470, w: 600, h: 150 };

const Chat: React.FC<{ T: WaktuS }> = ({ T }) => {
  const t = useDetik();
  if (t > T.diB + 0.3 && t < T.keA) return null;
  const keluar = T.loop;
  return (
    <>
      {/* pertanyaan */}
      <Pop mulai={T.tanya} damping={12} asal="100% 100%" keluar={keluar + 0.05} gaya={{ position: 'absolute', left: BUB_U.x, top: BUB_U.y }}>
        <div style={{ position: 'relative', width: BUB_U.w, height: BUB_U.h, borderRadius: '34px 34px 6px 34px', background: K.tinta, color: K.putih, padding: '26px 40px', boxShadow: '6px 8px 0 rgba(29,27,24,0.18)' }}>
          <div style={{ position: 'absolute', right: 6, top: -46, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: K.abu }}>kamu</div>
          <div style={{ fontWeight: 800, fontSize: 62, lineHeight: 1.18 }}>
            <KataMuncul mulai={T.tanya + 0.02} jeda={0.03} lama={0.12} gaya={{ columnGap: '0.26em' }} kata={['ada', 'berapa', 'huruf', { t: 'r', warna: '#ff8a7a' }]} />
            <KataMuncul
              mulai={T.tanya + 0.14}
              jeda={0.03}
              lama={0.12}
              gaya={{ columnGap: '0.26em' }}
              kata={['di', { t: 'strawberry?', isi: <SapuSorot mulai={T.straw1 + 0.05} lama={0.25} warna={K.kuning} warnaTeks={[K.putih, K.tinta]} penuh>strawberry?</SapuSorot> }]}
            />
          </div>
        </div>
      </Pop>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d={pathLingkarTangan(BUB_U.x + 577, BUB_U.y + 60, 42, 46, 'lingkarR')} mulai={T.r1 - 0.05} lama={0.3} warna={K.merah} tebal={7} hapus={T.keB} />
      </svg>
      {/* jawaban AI: dicoret + stempel SALAH */}
      <Pop mulai={T.jawab} damping={12} asal="0% 100%" keluar={keluar} gaya={{ position: 'absolute', left: BUB_A.x, top: BUB_A.y }}>
        <div style={{ position: 'relative', width: BUB_A.w, height: BUB_A.h, borderRadius: '34px 34px 34px 6px', background: K.putih, border: `4px solid ${K.tinta}`, boxShadow: '6px 8px 0 rgba(29,27,24,0.15)' }}>
          <div style={{ position: 'absolute', left: 8, top: -48, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: K.abu }}>ChatGPT</div>
          {[0, 1].map((i) => (
            <div key={i} style={{ position: 'absolute', left: 40, top: 40 + i * 44, width: i ? 300 : 470, height: 22, borderRadius: 11, background: K.kertasTua, scale: `${maju(t, T.jawab + 0.06 + i * 0.06, T.jawab + 0.2 + i * 0.06)} 1`, transformOrigin: 'left' }} />
          ))}
        </div>
      </Pop>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d={`M ${BUB_A.x + 30} ${BUB_A.y + 50} L ${BUB_A.x + 540} ${BUB_A.y + 112}`} mulai={T.coret} lama={0.12} warna={K.merah} tebal={11} hapus={keluar} easing={EASE.masuk} />
        <GarisDigambar d={`M ${BUB_A.x + 40} ${BUB_A.y + 120} L ${BUB_A.x + 530} ${BUB_A.y + 40}`} mulai={T.coret + 0.1} lama={0.12} warna={K.merah} tebal={11} hapus={keluar} easing={EASE.masuk} />
      </svg>
      <Stempel mulai={T.stempel} rot={-9} keluar={keluar} gaya={{ position: 'absolute', left: BUB_A.x + 470, top: BUB_A.y + 30, scale: String(t >= T.salah1 ? 1 + 0.14 * (1 - pegas(t, T.salah1, 30, { damping: 8, stiffness: 240, mass: 0.6 })) : 1) }}>
        <div style={{ padding: '4px 26px 8px', border: `8px solid ${K.merah}`, borderRadius: 16, color: K.merah, fontWeight: 900, fontSize: 84, lineHeight: 1, background: 'rgba(251,248,241,0.82)', letterSpacing: '0.04em' }}>SALAH</div>
      </Stempel>
      <Pop mulai={T.tanya + 0.12} keluar={keluar + 0.05} gaya={{ position: 'absolute', left: 0, top: 0 }}>
        <Selotip x={BUB_U.x + 40} y={BUB_U.y + 6} rot={-12} />
      </Pop>
      {/* anotasi "viral!" (kalimat 1) */}
      <Pop mulai={T.viral + 0.05} damping={9} keluar={T.keB} gaya={{ position: 'absolute', left: 300, top: 236, rotate: '-9deg' }}>
        <div style={{ fontFamily: TANGAN, fontWeight: 700, fontSize: 76, color: K.merah }}>viral!</div>
      </Pop>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        {[[-34, -30], [0, -44], [34, -30]].map(([dx, dy], i) => (
          <GarisDigambar key={i} d={`M ${400 + dx * 1.6} ${238 + dy * 0.4} L ${400 + dx * 2.6} ${238 + dy * 1.4}`} mulai={T.viral + 0.12 + i * 0.04} lama={0.12} warna={K.merah} tebal={6} hapus={T.keB} />
        ))}
        <GarisDigambar d={pathPanah(470, 330, 690, 300, -30, 24)} mulai={T.viral + 0.2} lama={0.25} warna={K.merah} tebal={6} hapus={T.keB} />
      </svg>
    </>
  );
};

// ======================================================================================================
// B: pita kalimat → token → angka (+ 101830, + trik ngeja)
function waktuPotong(T: WaktuS, i: number) {
  // gunting jalan kiri→kanan selama 1,2 dtk mulai "dipotong"; batas i dilewati sebanding posisinya
  const kiri = posisiToken(TOKEN.map(() => 0));
  const x0 = kiri[0];
  return T.dipotong + ((kiri[i] - x0) / TOTAL_TOKEN) * 1.2;
}

export const Spasi: React.FC<{ warna: string }> = ({ warna }) => (
  <span style={{ display: 'inline-block', width: '0.5em', height: '0.32em', marginRight: '0.1em', borderLeft: `3px solid ${warna}`, borderRight: `3px solid ${warna}`, borderBottom: `3px solid ${warna}`, verticalAlign: '-0.05em' }} />
);

const MejaToken: React.FC<{ T: WaktuS }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < T.keB - 0.1 || (t > T.diC + 0.4 && t < T.balikB - 0.2) || t > T.diA + 0.3) return null;
  const g = TOKEN.map((_, i) => (i === 0 ? 0 : maju(t, waktuPotong(T, i), waktuPotong(T, i) + 0.3, EASE.masuk)));
  const kiri = posisiToken(g);
  // pita terbang dari gelembung chat ke meja B
  const terbang = maju(t, T.keB, T.diB - 0.05, EASE.kamera);
  const asal = { x: BUB_U.x + BUB_U.w / 2, y: BUB_U.y + BUB_U.h / 2, s: 0.5 };
  const px = lerp(asal.x - B.x, 0, terbang);
  const py = lerp(asal.y - PITA_Y, 0, terbang) - Math.sin(Math.PI * terbang) * 90;
  const ps = lerp(asal.s, 1, terbang);
  const munculPita = maju(t, T.keB - 0.05, T.keB + 0.12);
  const redup = 1 - 0.68 * maju(t, T.k6.mulai, T.k6.mulai + 0.5);
  const gunting = maju(t, T.dipotong, T.dipotong + 1.2, EASE.linear);
  const xGunting = lerp(kiri[0], kiri[8] + LEBAR_TOKEN[8], gunting);
  const jmlPotong = 1 + g.filter((x) => x > 0.5).length;
  return (
    <>
      <div style={{ position: 'absolute', left: B.x, top: PITA_Y, translate: `${px}px ${py}px`, scale: String(ps), opacity: munculPita }}>
        {TOKEN.map((k, i) => {
          const x = kiri[i] - B.x;
          const w = LEBAR_TOKEN[i];
          const tok8 = i === 7;
          const jadiAngka = T.diubah + i * 0.07;
          const balikTeks = T.balikB + 0.35 + i * 0.05;
          const lebur = tok8 && t >= T.lebur;
          const o = tok8 ? 1 : redup;
          const rot = (noise(`tr${i}`, 3) * 2.4) * g[i];
          const depan = (
            <div style={{ position: 'absolute', inset: 0, borderRadius: 10, background: K.putih, border: `3px solid ${campur(K.putih, K.tinta, g[i] || g[Math.min(8, i + 1)])}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 50, color: K.tinta, boxShadow: g[i] > 0.5 ? '4px 5px 0 rgba(29,27,24,0.18)' : undefined }}>
              {k.sp ? <Spasi warna={tok8 && t > T.tengah && t < T.lebur ? K.teal : '#b9ad95'} /> : null}
              {k.t}
            </div>
          );
          const belakang = (
            <div style={{ position: 'absolute', inset: 0, borderRadius: 10, background: tok8 && lebur ? K.teal : K.tealMuda, border: `3px solid ${K.teal}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 50, color: tok8 && lebur ? K.putih : K.teal }}>
              {k.id}
            </div>
          );
          const hentak = lebur ? 1 + 0.35 * (1 - pegas(t, T.lebur + 0.12, fps, { damping: 9, stiffness: 260, mass: 0.6 })) : 1;
          const sorot8 = tok8 ? maju(t, T.straw5, T.straw5 + 0.25, EASE.kamera) * (1 - maju(t, T.lebur, T.lebur + 0.15)) : 0;
          return (
            <div key={i} style={{ position: 'absolute', left: x, top: -TINGGI_TOKEN / 2, opacity: o, rotate: `${rot}deg`, scale: String(hentak) }}>
              {sorot8 > 0 ? <div style={{ position: 'absolute', left: -16, top: -14, width: w + 32, height: TINGGI_TOKEN + 28, borderRadius: 16, background: K.kuning, transformOrigin: 'left', scale: `${sorot8} 1` }} /> : null}
              <BalikKartu
                lebar={w}
                tinggi={TINGGI_TOKEN}
                balik={tok8 && t >= T.balikB ? T.lebur + 0.08 : jadiAngka}
                balikLagi={tok8 && t >= T.balikB ? undefined : balikTeks}
                lama={0.3}
                depan={depan}
                belakang={belakang}
              />
              {g[i] > 0.05 ? <Selotip x={w / 2} y={-6} w={Math.min(w * 0.6, 90)} rot={noise(`ts${i}`, 2) * 10} warna={i % 2 ? 'rgba(20,135,124,0.35)' : 'rgba(244,197,24,0.6)'} /> : null}
            </div>
          );
        })}
      </div>
      {/* gunting */}
      {gunting > 0 && gunting < 1 ? <Gunting x={xGunting} y={PITA_Y - TINGGI_TOKEN / 2 - 30} /> : null}
      {/* hitungan potongan + label "token" */}
      {t > T.dipotong && t < T.keC + 0.2 ? (
        <div style={{ position: 'absolute', left: kiri[0], top: PITA_Y + 78, fontFamily: TANGAN, fontWeight: 700, fontSize: 58, color: K.tinta, opacity: maju(t, T.dipotong, T.dipotong + 0.2) * (1 - maju(t, T.keC - 0.2, T.keC)) }}>
          = <AngkaJalan dari={0} ke={9} progress={jmlPotong / 9} /> {t >= T.token2 ? <span style={{ color: K.teal }}>token</span> : 'potongan'}
        </div>
      ) : null}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d={pathPanah(kiri[0] + 330, PITA_Y + 110, kiri[3] + 70, PITA_Y + 58, -40, 26)} mulai={T.token2} lama={0.3} warna={K.teal} tebal={6} hapus={T.diubah - 0.1} />
      </svg>
      {/* " strawberry" = 1 token karena ada spasi di depannya (fakta tiktoken) */}
      {t > T.tengah - 0.05 && t < T.lebur + 0.3 ? (
        <div style={{ position: 'absolute', left: kiri[7] - 6, top: PITA_Y + 64, fontFamily: TANGAN, fontWeight: 700, fontSize: 44, color: K.teal, opacity: maju(t, T.tengah, T.tengah + 0.2) * (1 - maju(t, T.lebur, T.lebur + 0.2)) }}>
          ↑ ada spasi di depan
        </div>
      ) : null}
      <KotakAI T={T} kiri={kiri} />
      <AngkaLebur T={T} />
    </>
  );
};

export const Gunting: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg style={{ position: 'absolute', left: x - 40, top: y - 40, overflow: 'visible' }} width={80} height={80} viewBox="-40 -40 80 80">
    <g transform="rotate(90)">
      <circle cx={-22} cy={-12} r={11} fill="none" stroke={K.tinta} strokeWidth={6} />
      <circle cx={-22} cy={12} r={11} fill="none" stroke={K.tinta} strokeWidth={6} />
      <path d="M -12 -8 L 30 10 M -12 8 L 30 -10" stroke={K.tinta} strokeWidth={6} strokeLinecap="round" />
    </g>
  </svg>
);

/** Kotak "model AI": panah dari tiap angka token masuk ke kotak. */
const KotakAI: React.FC<{ T: WaktuS; kiri: number[] }> = ({ T, kiri }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < T.diolah - 0.4 || t > T.keC + 0.4) return null;
  const kotak = { x: B.x - 170, y: 690, w: 340, h: 150 };
  const tumbuk = t >= T.diolah + 0.55 ? 1 - pegas(t, T.diolah + 0.55, fps, { damping: 8, stiffness: 240, mass: 0.6 }) : 0;
  const keluar = maju(t, T.keC - 0.1, T.keC + 0.2, EASE.keluar);
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - keluar }} width={1} height={1}>
        {TOKEN.map((_, i) => {
          const x1 = kiri[i] + LEBAR_TOKEN[i] / 2;
          const x2 = B.x + (i - 4) * 22;
          return <GarisDigambar key={i} d={`M ${x1} ${PITA_Y + 54} Q ${(x1 + x2) / 2} ${PITA_Y + 150} ${x2} ${kotak.y - 6}`} mulai={T.diolah - 0.25 + i * 0.04} lama={0.32} warna={K.teal} tebal={4} opacity={0.75} />;
        })}
      </svg>
      <div style={{ position: 'absolute', left: kotak.x, top: kotak.y, width: kotak.w, height: kotak.h, opacity: maju(t, T.diolah - 0.35, T.diolah - 0.15) * (1 - keluar), scale: `${1 + tumbuk * 0.08} ${1 - tumbuk * 0.08}`, borderRadius: 22, background: K.tinta, color: K.putih, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '6px 8px 0 rgba(29,27,24,0.2)' }}>
        <div style={{ fontWeight: 900, fontSize: 60, lineHeight: 1 }}>AI</div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: K.tealMuda, marginTop: 6 }}>ngolah angka</div>
      </div>
    </>
  );
};

/** S5–S6: 3 potongan (st·raw·berry) melayang di atas token " strawberry", huruf dihitung 1–10, terus ambruk jadi 101830;
 *  S6: huruf bayangan di atas angka memudar (r paling akhir) + bingkai "yang dia liat". */
const AngkaLebur: React.FC<{ T: WaktuS }> = ({ T }) => {
  const t = useDetik();
  if (t < T.k6.mulai - 0.05 || t > T.keA) return null;
  const x8 = X_TOK8;
  const w8 = LEBAR_TOKEN[7];
  const bingkai = { x: x8 - w8 / 2 - 28, y: PITA_Y - TINGGI_TOKEN / 2 - 28, w: w8 + 56, h: TINGGI_TOKEN + 56 };
  const pojok = (x: number, y: number, dx: number, dy: number) => `M ${x} ${y + dy * 40} L ${x} ${y} L ${x + dx * 40} ${y}`;
  const hilang = (i: number) => maju(t, T.keliatan - 0.25 + (KATA[i] === 'r' ? 0.35 : i * 0.02), T.keliatan + 0.15 + (KATA[i] === 'r' ? 0.35 : i * 0.02), EASE.keluar);
  const munculBayang = maju(t, T.k6.mulai, T.k6.mulai + 0.4);
  const keluarS7 = maju(t, T.k7.mulai - 0.1, T.k7.mulai + 0.2);
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - keluarS7 }} width={1} height={1}>
        {[
          pojok(bingkai.x, bingkai.y, 1, 1),
          pojok(bingkai.x + bingkai.w, bingkai.y, -1, 1),
          pojok(bingkai.x, bingkai.y + bingkai.h, 1, -1),
          pojok(bingkai.x + bingkai.w, bingkai.y + bingkai.h, -1, -1),
        ].map((p, i) => (
          <GarisDigambar key={i} d={p} mulai={T.liat - 0.1 + i * 0.03} lama={0.18} warna={K.teal} tebal={7} ujung="square" />
        ))}
      </svg>
      <div style={{ position: 'absolute', left: bingkai.x - 6, top: bingkai.y + bingkai.h + 8, fontFamily: TANGAN, fontWeight: 700, fontSize: 46, color: K.teal, opacity: maju(t, T.liat, T.liat + 0.2) * (1 - keluarS7) }}>yang dia liat</div>
      <div style={{ position: 'absolute', left: x8 - 300, top: PITA_Y - 180, width: 600, display: 'flex', justifyContent: 'center', fontWeight: 900, fontSize: 72, opacity: munculBayang }}>
        {KATA.map((h, i) => {
          const q = hilang(i);
          const r = h === 'r';
          const denyut = r ? 1 + 0.25 * Math.sin(Math.PI * maju(t, T.huruf6, T.huruf6 + 0.4)) : 1;
          return (
            <span key={i} style={{ display: 'inline-block', color: r ? K.merah : 'rgba(29,27,24,0.42)', opacity: 1 - q, filter: q > 0 ? `blur(${(q * 10).toFixed(1)}px)` : undefined, translate: `0 ${(q * 40).toFixed(1)}px`, scale: String(denyut) }}>
              {h}
            </span>
          );
        })}
      </div>
    </>
  );
};

// ======================================================================================================
// C: kata "strawberry" sendirian → dipotong st · raw · berry (+ angkanya) → dibawa balik ke B → ambruk jadi 1 angka
const MejaKata: React.FC<{ T: WaktuS }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < T.keC - 0.1 || t > T.lebur + 0.45) return null;
  // kata terbang dari token " strawberry" ke meja C
  const terbang = maju(t, T.keC, T.diC - 0.05, EASE.kamera);
  const mendarat = t >= T.diC - 0.05;
  // pisah 3 potongan
  const pisah = maju(t, T.tiga - 0.05, T.tiga + 0.35, EASE.masuk);
  // dibawa balik ke B, melayang di atas token 8, lalu ambruk
  const balik = maju(t, T.balikB, T.diB2 - 0.05, EASE.kamera);
  const ambruk = maju(t, T.lebur - 0.04, T.lebur + 0.2, EASE.jatuh);
  const pusat = {
    x: lerp(C.x, X_TOK8, balik),
    y: lerp(PITA_Y, PITA_Y - 205, balik) + ambruk * 205 - Math.sin(Math.PI * balik) * 120 + (balik >= 1 && ambruk <= 0 ? noise('melayang', t * 0.8) * 8 : 0),
    s: lerp(1, 0.46, balik) * lerp(1, 0.25, ambruk),
  };
  const o = 1 - maju(t, T.lebur + 0.1, T.lebur + 0.25);
  if (!mendarat) {
    // kata yang lagi terbang (mono kecil → slab besar)
    const x = lerp(X_TOK8, C.x, terbang);
    const y = lerp(PITA_Y, PITA_Y, terbang) - Math.sin(Math.PI * terbang) * 160;
    return (
      <div style={{ position: 'absolute', left: x, top: y, translate: '-50% -50%', fontFamily: MONO, fontWeight: 800, fontSize: lerp(50, 110, terbang), color: K.tinta, opacity: maju(t, T.keC - 0.1, T.keC + 0.05) }}>
        strawberry
      </div>
    );
  }
  const hitung = Math.floor(interpolate(t, [T.sepuluh, T.sepuluh + 0.6], [0, 10], JEPIT));
  return (
    <>
      <div style={{ position: 'absolute', left: pusat.x, top: pusat.y, scale: String(pusat.s), opacity: o }}>
        {KATA.map((h, i) => {
          const gi = POTONG.findIndex((p) => i >= p.dari && i < p.sampai);
          const geser = (gi - 1) * 64 * pisah;
          const x = -LEBAR_KATA / 2 + i * (UBIN.w + UBIN.celah) + geser;
          const pop = pegas(t, T.diC - 0.05 + i * 0.025, fps, { damping: 11, stiffness: 220, mass: 0.6 });
          const p = POTONG[gi];
          const angkat = [T.este, T.raw, T.berry][gi];
          const naik = t >= angkat ? 1 - pegas(t, angkat, fps, { damping: 10, stiffness: 200, mass: 0.6 }) : 0;
          const nyala = i < hitung && t < T.lebur;
          const ombak = Math.sin(Math.PI * maju(t, T.straw4 + i * 0.04, T.straw4 + i * 0.04 + 0.32, EASE.linear)) * 26;
          return (
            <div key={i} style={{ position: 'absolute', left: x, top: -UBIN.h / 2 - naik * 18 - ombak, width: UBIN.w, height: UBIN.h, scale: String(pop), borderRadius: 14, background: nyala ? K.kuning : K.putih, border: `4px solid ${K.tinta}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: UBIN.fs, lineHeight: 1, color: h === 'r' ? K.merah : K.tinta, boxShadow: '5px 6px 0 rgba(29,27,24,0.18)' }}>
              {h}
              {pisah > 0.05 ? <div style={{ position: 'absolute', left: -6, right: -6, top: -14, height: 26, background: p.warna, opacity: 0.75 * pisah, rotate: `${(gi - 1) * 2}deg` }} /> : null}
            </div>
          );
        })}
        {/* label angka tiap potongan */}
        {POTONG.map((p, gi) => {
          const tengahX = -LEBAR_KATA / 2 + ((p.dari + p.sampai - 1) / 2) * (UBIN.w + UBIN.celah) + UBIN.w / 2 + (gi - 1) * 64 * pisah;
          const kapan = [T.este, T.raw, T.berry][gi];
          return (
            <React.Fragment key={gi}>
              <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
                <GarisDigambar d={`M ${tengahX} ${UBIN.h / 2 + 6} L ${tengahX} ${UBIN.h / 2 + 56}`} mulai={kapan} lama={0.12} warna={K.tinta} tebal={4} />
              </svg>
              <Squash mendarat={kapan + 0.16} tinggiJatuh={90} lamaJatuh={0.16} gaya={{ position: 'absolute', left: tengahX - 120, top: UBIN.h / 2 + 52, width: 240, display: 'flex', justifyContent: 'center' }}>
                <div style={{ padding: '6px 22px', borderRadius: 12, background: K.tealMuda, border: `4px solid ${K.teal}`, fontFamily: MONO, fontWeight: 800, fontSize: 54, color: K.teal }}>{p.id}</div>
              </Squash>
            </React.Fragment>
          );
        })}
        {/* garis potong + gunting */}
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
          {[2, 5].map((b, j) => {
            const xb = -LEBAR_KATA / 2 + b * (UBIN.w + UBIN.celah) - UBIN.celah / 2;
            return (
              <GarisDigambar key={b} d={`M ${xb} ${-UBIN.h / 2 - 50} L ${xb} ${UBIN.h / 2 + 30}`} mulai={T.dipotong4 + j * 0.28} lama={0.22} warna={K.merah} tebal={5} hapus={T.tiga} lamaHapus={0.2} />
            );
          })}
        </svg>
        {[2, 5].map((b, j) => {
          const p = maju(t, T.dipotong4 + j * 0.28, T.dipotong4 + j * 0.28 + 0.22, EASE.linear);
          if (p <= 0 || p >= 1) return null;
          const xb = -LEBAR_KATA / 2 + b * (UBIN.w + UBIN.celah) - UBIN.celah / 2;
          return <Gunting key={b} x={xb} y={-UBIN.h / 2 - 50 + p * (UBIN.h + 80)} />;
        })}
      </div>
      {/* hitungan 10 huruf (S5) */}
      {t > T.sepuluh - 0.05 && t < T.lebur + 0.3 ? (
        <div style={{ position: 'absolute', left: X_TOK8 + 300, top: PITA_Y - 250, fontFamily: TANGAN, fontWeight: 700, fontSize: 52, color: K.tinta, opacity: maju(t, T.sepuluh - 0.05, T.sepuluh + 0.1) * o }}>
          <AngkaJalan dari={0} ke={10} progress={hitung / 10} /> huruf
        </div>
      ) : null}
    </>
  );
};

// ======================================================================================================
// TRIK (S7, di B): angka 101830 pecah jadi 10 huruf yang dieja, r dihitung 1-2-3
const Trik: React.FC<{ T: WaktuS }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < T.ngeja - 0.1 || t > T.diA + 0.3) return null;
  const ubin = { w: 88, h: 112, celah: 40 };
  const lebar = KATA.length * ubin.w + (KATA.length - 1) * ubin.celah;
  const y0 = 700;
  const rIdx = KATA.map((h, i) => (h === 'r' ? i : -1)).filter((i) => i >= 0);
  const kapanR = [T.baru - 0.2, T.baru + 0.12, T.ngitung + 0.12];
  const n = kapanR.filter((k) => t >= k + 0.12).length;
  const pop = n > 0 ? 1 + 0.25 * (1 - pegas(t, kapanR[n - 1] + 0.12, fps, { damping: 8, stiffness: 250, mass: 0.6 })) : 1;
  return (
    <>
      {KATA.map((h, i) => {
        const mulai = T.ngeja + i * 0.08;
        const p = maju(t, mulai, mulai + 0.32, EASE.masuk);
        if (p <= 0) return null;
        const x = X_TOK8 - lebar / 2 + i * (ubin.w + ubin.celah);
        const sx = lerp(X_TOK8 - ubin.w / 2, x, p);
        const sy = lerp(PITA_Y - ubin.h / 2, y0, p) - Math.sin(Math.PI * p) * 70;
        return (
          <div key={i} style={{ position: 'absolute', left: sx, top: sy, width: ubin.w, height: ubin.h, borderRadius: 12, background: K.putih, border: `4px solid ${K.tinta}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 86, lineHeight: 1, color: h === 'r' ? K.merah : K.tinta, rotate: `${(1 - p) * (i % 2 ? 14 : -14)}deg`, boxShadow: '5px 6px 0 rgba(29,27,24,0.18)' }}>
            {h}
          </div>
        );
      })}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        {KATA.slice(0, -1).map((_, i) => {
          const x = X_TOK8 - lebar / 2 + i * (ubin.w + ubin.celah) + ubin.w + 8;
          return <GarisDigambar key={i} d={`M ${x} ${y0 + ubin.h / 2} L ${x + ubin.celah - 16} ${y0 + ubin.h / 2}`} mulai={T.ngeja + i * 0.08 + 0.3} lama={0.1} warna={K.abu} tebal={6} />;
        })}
        {rIdx.map((ri, j) => {
          const cx = X_TOK8 - lebar / 2 + ri * (ubin.w + ubin.celah) + ubin.w / 2;
          return <GarisDigambar key={ri} d={pathLingkarTangan(cx, y0 + ubin.h / 2, 68, 80, `trikR${ri}`)} mulai={kapanR[j]} lama={0.24} warna={K.merah} tebal={8} />;
        })}
      </svg>
      {n > 0 ? (
        <div style={{ position: 'absolute', left: X_TOK8 - 150, top: y0 + ubin.h + 30, width: 300, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 16, scale: String(pop) }}>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 70, color: K.merah }}>r =</span>
          <AngkaJalan dari={0} ke={3} progress={n / 3} gaya={{ fontWeight: 900, fontSize: 110, color: K.merah, lineHeight: 1 }} />
        </div>
      ) : null}
    </>
  );
};

// ======================================================================================================
// HUD: label + judul kata kunci (kiri atas), sumber (kanan atas), penutup (bawah)
const LABEL: React.CSSProperties = { fontFamily: MONO, fontWeight: 700, fontSize: 44, letterSpacing: '0.1em', color: K.abu };
const JUDUL: React.CSSProperties = { fontWeight: 800, fontSize: 84, lineHeight: 1.05, color: K.tinta };

const HUD: React.FC<{ T: WaktuS }> = ({ T }) => {
  const t = useDetik();
  const kiri = (top: number, isi: React.ReactNode) => <div style={{ position: 'absolute', left: 120, top, width: 1400 }}>{isi}</div>;
  const sorot = (teks: string, mulai: number, warna = K.kuning) => (
    <SapuSorot mulai={mulai} lama={0.24} warna={warna} warnaTeks={[K.tinta, K.tinta]} penuh>
      {teks}
    </SapuSorot>
  );
  const ada = (a: number, b: number) => t > a - 0.1 && t < b + 0.3;
  const sumber = (() => {
    if (t < T.k2.mulai + 0.6 || t > T.k8.mulai) return null;
    if (t < T.k3.mulai) return 'sumber: TechCrunch, 27 Agu 2024';
    if (t < T.k7.mulai) return 'angka asli: tokenizer OpenAI (tiktoken)';
    return 'trik ngeja: tips praktis (TechCrunch)';
  })();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {sumber ? (
        <div key={sumber} style={{ position: 'absolute', right: 120, top: 60, fontFamily: MONO, fontWeight: 500, fontSize: 32, color: K.abu, opacity: 0.95 }}>
          <KataMuncul mulai={t - 10} kata={[sumber]} />
        </div>
      ) : null}
      {/* 1 */}
      {ada(0, T.k2.mulai) ? kiri(60, <KataMuncul mulai={0.1} keluar={T.k2.mulai - 0.25} gaya={LABEL} kata={[{ t: 'CHATGPT', mulai: 0.1 }, { t: 'SEMPET', mulai: 0.95 }, { t: 'VIRAL', mulai: T.viral, warna: K.merah }]} />) : null}
      {/* 2 */}
      {ada(T.k2.mulai, T.k3.mulai) ? (
        <>
          {kiri(60, <KataMuncul mulai={T.gak2} keluar={T.k3.mulai - 0.25} gaya={LABEL} kata={[{ t: 'DIA', mulai: T.gak2 - 0.12 }, { t: 'GAK', mulai: T.gak2, warna: K.merah }, { t: 'BACA', mulai: T.gak2 + 0.16 }, { t: 'HURUF', mulai: T.gak2 + 0.44 }]} />)}
          {kiri(118, <KataMuncul mulai={T.tulisan} keluar={T.k3.mulai - 0.2} gaya={JUDUL} kata={[{ t: 'tulisan', mulai: T.tulisan }, { t: '→', mulai: T.dipotong, warna: K.merah }, { t: 'token', mulai: T.token2, isi: sorot('token', T.token2 + 0.1) }]} />)}
        </>
      ) : null}
      {/* 3 */}
      {ada(T.k3.mulai, T.k4.mulai) ? (
        <>
          {kiri(60, <KataMuncul mulai={T.k3.mulai} keluar={T.k4.mulai - 0.25} gaya={LABEL} kata={['TIAP', 'TOKEN']} jeda={0.1} />)}
          {kiri(118, <KataMuncul mulai={T.k3.mulai + 0.25} keluar={T.k4.mulai - 0.2} gaya={JUDUL} kata={[{ t: 'token', mulai: T.k3.mulai + 0.25 }, { t: '→', mulai: T.diubah, warna: K.merah }, { t: 'angka', mulai: T.angka3, isi: sorot('angka', T.angka3 + 0.1, K.tealMuda) }]} />)}
        </>
      ) : null}
      {/* 4 */}
      {ada(T.k4.mulai, T.k5.mulai) ? (
        <>
          {kiri(60, <KataMuncul mulai={T.versi} keluar={T.k5.mulai - 0.25} gaya={LABEL} kata={['SALAH', 'SATU', 'VERSI:', { t: 'GPT-4o', warna: K.teal }]} jeda={0.07} />)}
          {kiri(118, <KataMuncul mulai={T.este} keluar={T.k5.mulai - 0.2} gaya={{ ...JUDUL, fontFamily: MONO }} kata={[{ t: 'st', mulai: T.este }, { t: '·', mulai: T.raw - 0.1, warna: K.abu }, { t: 'raw', mulai: T.raw }, { t: '·', mulai: T.berry - 0.1, warna: K.abu }, { t: 'berry', mulai: T.berry }]} />)}
        </>
      ) : null}
      {/* 5 */}
      {ada(T.k5.mulai, T.k6.mulai) ? (
        <>
          {kiri(60, <KataMuncul mulai={T.tengah} keluar={T.k6.mulai - 0.25} gaya={LABEL} kata={['DI', 'TENGAH', 'KALIMAT:']} jeda={0.08} />)}
          {kiri(118, <KataMuncul mulai={T.straw5} keluar={T.k6.mulai - 0.2} gaya={JUDUL} kata={[{ t: 'strawberry', mulai: T.straw5 }, { t: '→', mulai: T.sepuluh, warna: K.merah }, { t: '101830', mulai: T.satu5, isi: sorot('101830', T.satu5 + 0.12, K.tealMuda), gaya: { fontFamily: MONO } }]} />)}
        </>
      ) : null}
      {/* 6 */}
      {ada(T.k6.mulai, T.k7.mulai) ? (
        <>
          {kiri(60, <KataMuncul mulai={T.k6.mulai} keluar={T.k7.mulai - 0.25} gaya={LABEL} kata={['YANG', 'DIA', 'LIAT']} jeda={0.08} />)}
          {t < T.huruf6 ? kiri(118, <KataMuncul mulai={T.potongan} keluar={T.huruf6 - 0.18} gaya={JUDUL} kata={[{ t: 'cuma', mulai: T.potongan - 0.15 }, { t: 'potongan', mulai: T.potongan }, { t: '&', mulai: T.angka6 - 0.2, warna: K.abu }, { t: 'angka', mulai: T.angka6 }]} />) : null}
          {kiri(118, <KataMuncul mulai={T.huruf6} keluar={T.k7.mulai - 0.2} gaya={JUDUL} kata={[{ t: 'huruf', mulai: T.huruf6 }, { t: 'r', mulai: T.huruf6 + 0.2, warna: K.merah }, { t: 'gak', mulai: T.keliatan - 0.15 }, { t: 'keliatan', mulai: T.keliatan }]} />)}
        </>
      ) : null}
      {/* 7 */}
      {ada(T.k7.mulai, T.k8.mulai) ? (
        <>
          {t < T.triknya ? kiri(60, <KataMuncul mulai={T.k7.mulai} keluar={T.triknya - 0.2} gaya={LABEL} kata={[{ t: 'JADI', mulai: T.k7.mulai }, { t: 'WAJAR', mulai: T.wajar }, { t: 'DIA', mulai: T.wajar + 0.5 }, { t: 'SALAH', mulai: T.wajar + 0.7, warna: K.merah }]} />) : null}
          {kiri(60, <KataMuncul mulai={T.triknya} keluar={T.k8.mulai - 0.3} gaya={{ ...LABEL, color: K.merah }} kata={['TRIKNYA:']} />)}
          {kiri(118, <KataMuncul mulai={T.ngeja} keluar={T.k8.mulai - 0.25} gaya={JUDUL} kata={[{ t: 'eja', mulai: T.ngeja, isi: sorot('eja', T.satusatu, K.kuning) }, { t: 'dulu,', mulai: T.satusatu }, { t: 'baru', mulai: T.baru }, { t: 'hitung', mulai: T.ngitung, isi: sorot('hitung', T.ngitung + 0.12, K.tealMuda) }]} />)}
        </>
      ) : null}
      {/* 8: bookend di chat */}
      {t > T.k8.mulai - 0.1 ? (
        <>
          {kiri(640, <KataMuncul mulai={T.pernah} keluar={T.loop} gaya={{ ...LABEL, fontSize: 44 }} kata={[{ t: 'PERNAH', mulai: T.pernah }, { t: 'LANGSUNG', mulai: T.pernah + 0.2 }, { t: 'PERCAYA?', mulai: T.percaya }]} />)}
          {kiri(696, <KataMuncul mulai={T.ngaku} keluar={T.loop + 0.04} gaya={{ ...JUDUL, fontWeight: 900, fontSize: 132 }} kata={[{ t: 'ngaku', mulai: T.ngaku, isi: sorot('ngaku', T.ngaku + 0.15) }, { t: 'deh', mulai: T.deh }]} />)}
          <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
            <GarisDigambar d="M 880 700 Q 880 660 920 660 H 1100 Q 1140 660 1140 700 V 770 Q 1140 810 1100 810 H 960 L 920 850 L 926 810 Q 880 810 880 770 Z" mulai={T.deh + 0.05} lama={0.4} warna={K.teal} tebal={8} hapus={T.loop} lamaHapus={0.2} />
          </svg>
          {[0, 1, 2].map((i) => {
            const m = maju(t, T.deh + 0.35 + i * 0.08, T.deh + 0.5 + i * 0.08) * (1 - maju(t, T.loop, T.loop + 0.15));
            return <div key={i} style={{ position: 'absolute', left: 958 + i * 46, top: 724 + Math.sin(t * 9 + i) * 5, width: 22, height: 22, borderRadius: 11, background: K.teal, opacity: m, scale: String(m) }} />;
          })}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
