// Frame hero (pembuka, tengah, puncak): 30, 1114, 1857.
// contoh video pembanding: Shorts generik "Monitor 144Hz lu jangan-jangan masih jalan di 60Hz" (konten contoh).
// SISTEM: kinetic data gelap, abu netral + putih (sorot) + 2 warna makna: koral = 60 Hz (yang kepasang),
// lime = 144 Hz (yang dibayar). Font: Saira Condensed (judul/angka) + JetBrains Mono (label/UI kecil).
// SATU DUNIA vertikal, kamera jalan: A monitor (hook) → turun ke B jam refresh (60 vs 144 gambar/detik) → turun ke C
// layar Windows (klik Start…Advanced display) → D dropdown refresh rate → E zoom ke tanda bintang → terbang balik ke A
// (pertanyaan) → loop mulus ke frame pertama. Objek pemandu: angka "60Hz" (stempel → label jam → label yang ditarik
// kursor → nilai dropdown yang berubah jadi 144) dan "144Hz" (judul → label jam).
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  AngkaJalan, Bunyi, campur, Dunia, EASE, GarisDigambar, Grain, hitungKamera, JEPIT, Karakter, KataMuncul, Kursor, maju,
  noise, Paralaks, pathLingkarTangan, pegas, polaKotak, polaTitik, Pop, posisiKursor, SapuSorot, Squash, Subtitle, useDetik,
  ZoomTembus, type Kamera, type Kata, type KunciKamera, type Sfx, type TitikKursor,
} from "../../src/gerak";
import { random } from 'remotion';
import { MONO, SAIRA } from "../../src/gerak/font";
import { hitungWaktu, type Kalimat, type Waktu } from "./waktu144";

export type DataVideo = { durasi: number; kata: Kata[]; kalimat?: Kalimat[]; mulut: number[]; keras: number[] };

const W = 1080;
const B_Y = 2100; // stasiun B (jam refresh)
const C_Y = 4200; // stasiun C/D/E (layar Windows)
const TINGGI_DUNIA = 6300;

export const WARNA = {
  navy0: '#141414',
  navy1: '#202020',
  permukaan: '#303030',
  halaman: '#242424',
  garis: '#505050',
  skeleton: '#414141',
  emas: '#d8d8d8',
  lime: '#3ddc84',
  koral: '#ff5a5f',
  putih: '#f7f9fc',
  abu: '#999999',
  abuTerang: '#cccccc',
};
const { navy0, emas, lime, koral, putih, abu, abuTerang } = WARNA;

const SFX = {
  pop: { src: '', puncak: 0.113 },
  swish: { src: '', puncak: 0.172 },
  hantam: { src: '', puncak: 0.305 },
  klik: { src: '', puncak: 0.14 },
  turun: { src: '', puncak: 0.3 },
  riser: { src: '', puncak: 2.039 },
  tik: { src: '', puncak: 0.071 },
  whoosh: { src: '', puncak: 0.148 },
  whooshPop: { src: '', puncak: 0.079 },
  sweepHit: { src: '', puncak: 0.338 },
  lembut: { src: '', puncak: 0.343 },
  glitch: { src: '', puncak: 0.071 },
  bass: { src: '', puncak: 0.371 },
};

// ---------- geometri dunia ----------
const LAYAR = { x: 120, y: 840, w: 840, h: 472 }; // layar monitor (stasiun A)
const JAM = { r: 200, y: B_Y + 860, kiri: 285, kanan: 795 }; // jam refresh (stasiun B)
const LABEL_Y = B_Y + 1195;
const JEN = { x: 70, y: C_Y + 640, w: 940, h: 830 }; // jendela Windows (stasiun C)
const ISI = { x: 70, y: C_Y + 702, w: 940, h: 690 };
const START = { x: 435, y: C_Y + 1402, w: 210, h: 58 };
const PANEL = { x: 230, y: C_Y + 880, w: 620, h: 490 };
const UBIN = { x: PANEL.x + 30, y: PANEL.y + 110, w: 170, h: 150 };
const NAV0 = { x: ISI.x + 30, y: ISI.y + 110, w: 300, h: 76 };
const BARIS_DISPLAY = { x: ISI.x + 360, y: ISI.y + 182, w: 550, h: 92 };
const BARIS_ADV = { x: ISI.x + 30, y: ISI.y + 318, w: 880, h: 92 };
const DROP = { x: 130, y: C_Y + 917, w: 820, h: 90 };
const NILAI = { x: 160, y: C_Y + 962 }; // pangkal kiri nilai dropdown
const BARIS_LIST = (i: number) => ({ x: 130, y: C_Y + 1017 + i * 112, w: 820, h: 104 });
const CONTOH = { x: 130, y: C_Y + 1032, w: 820, h: 112 };

// subtitle: angka yang diucapin ditulis angka biar pendek
const GABUNG = [
  { kata: ['seratus', 'empat', 'puluh', 'empat'], jadi: '144' },
  { kata: ['enam', 'puluh'], jadi: '60' },
  { kata: ['sebelas'], jadi: '11' },
];

// pola paralaks (dibikin sekali)
const POLA_TENGAH = polaKotak(
  540,
  960,
  Array.from({ length: 16 }, (_, i) => ({
    x: Math.round(random(`pk-x${i}`) * 510),
    y: Math.round(random(`pk-y${i}`) * 930),
    s: 8 + Math.round(random(`pk-s${i}`) * 16),
    warna: random(`pk-w${i}`) > 0.55 ? emas : abu,
    o: 0.1 + random(`pk-o${i}`) * 0.14,
  })),
);
const POLA_DEPAN = polaKotak(
  1080,
  1920,
  Array.from({ length: 7 }, (_, i) => ({
    x: Math.round(random(`pd-x${i}`) * 1000),
    y: Math.round(random(`pd-y${i}`) * 1840),
    s: 34 + Math.round(random(`pd-s${i}`) * 40),
    warna: i % 2 ? emas : lime,
    o: 0.22,
    isi: true,
  })),
);

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const pathKotak = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;

function kunciKamera(T: Waktu): KunciKamera[] {
  const pelan = Easing.inOut(Easing.sin);
  return [
    { t: 0, x: 540, y: 960, z: 1 },
    { t: T.pindahAB, x: 540, y: 950, z: 1.035, ease: pelan },
    { t: T.sampaiB, x: 540, y: B_Y + 960, z: 1 },
    { t: T.pindahBC, x: 540, y: B_Y + 948, z: 1.03, ease: pelan },
    { t: T.sampaiC, x: 540, y: C_Y + 1020, z: 1 },
    { t: T.start + 0.1, x: 540, y: C_Y + 1075, z: 1.06, ease: pelan }, // ikut kursor turun ke tombol Start
    { t: T.settings + 0.4, x: 540, y: C_Y + 1032, z: 1.02 },
    { t: T.advanced + 0.4, x: 540, y: C_Y + 1032, z: 1.035, ease: pelan },
    { t: T.tinggi + 0.4, x: 540, y: C_Y + 1045, z: 1.06, ease: pelan },
    { t: T.pindahE, x: 540, y: C_Y + 1015, z: 1.02, ease: pelan }, // kalimat 5: mundur dikit, kelihatan sehalaman
    { t: T.pindahE + 0.55, x: 540, y: C_Y + 998, z: 1.2 },
    { t: T.terbang, x: 543, y: C_Y + 1003, z: 1.22, ease: pelan },
    { t: T.sampaiF, x: 540, y: 960, z: 1, ease: Easing.inOut(Easing.poly(5)) },
    { t: T.pas - 0.05, x: 520, y: 1000, z: 1.1, ease: pelan }, // kalimat 7: dorong pelan ke monitor (stiker 144 vs 60 Hz)
    { t: T.pas + 0.6, x: 540, y: 965, z: 1.02 },
    { t: T.loop, x: 540, y: 950, z: 1.035, ease: pelan },
    { t: T.total - 0.2, x: 540, y: 960, z: 1 },
  ];
}

// ======================================================================================================
export const ContohRefreshRate: React.FC<DataVideo> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => hitungWaktu(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const kunci = useMemo(() => kunciKamera(T), [T]);
  const kam = hitungKamera(kunci, t, fps, {
    drift: 2.5,
    getar: [
      { t: T.banting + 0.08, kuat: 16, lama: 0.18 },
      { t: T.enam + 0.04, kuat: 7 },
      { t: T.sampaiB - 0.02, kuat: 5 },
      { t: T.bintangDarat, kuat: 6 },
      { t: T.enam7 + 0.04, kuat: 6 },
      { t: T.hertz3 + 0.04, kuat: 5 },
    ],
  });
  return (
    <AbsoluteFill style={{ background: navy0, fontFamily: SAIRA, color: putih, overflow: 'hidden' }}>
      <Latar kamera={kam} />
      <Dunia kamera={kam} tinggiDunia={TINGGI_DUNIA}>
        <StasiunA T={T} />
        <StasiunB T={T} />
        <StasiunC T={T} />
        <Obj144 T={T} />
        <CoretanA T={T} />
        <Obj60 T={T} />
        <KursorWindows T={T} />
      </Dunia>
      <LapisDepan kamera={kam} />
      <HUD T={T} />
      <></>
      <Subtitle
        kata={d.kata}
        kalimat={d.kalimat}
        font={SAIRA}
        ukuran={44}
        maksHuruf={27}
        sorot={emas}
        gabung={GABUNG}
        sampai={T.loop + 0.1}
        zona={[
          { dari: 0, x: 645, y: 1352 },
          { dari: T.pindahAB + 0.1, x: 540, y: 1408 },
          { dari: T.pindahBC + 0.1, x: 540, y: 1428 },
          { dari: T.aku1 + 0.1, x: 645, y: 1428 },
          { dari: T.pindahE + 0.5, x: 610, y: 1290 }, // adegan bintang: layar di-zoom, taskbar turun → subtitle naik ke area kerangka
          { dari: T.terbang + 0.2, x: 645, y: 1352 },
        ]}
      />
      <Grain kuat={0.12} garisScan={0.04} vinyet={0.55} />
      <></>
    </AbsoluteFill>
  );
};

function daftarSfx(T: Waktu): Sfx[] {
  const s = (k: keyof typeof SFX, momen: number, vol: number): Sfx => ({ ...SFX[k], momen, vol });
  return [
    s('pop', T.pop144, 0.55),
    s('swish', T.coret + 0.06, 0.5),
    s('hantam', T.banting + 0.08, 0.85),
    s('klik', T.windows1, 0.45),
    s('pop', T.enam + 0.02, 0.45),
    s('turun', T.pindahAB + 0.3, 0.55),
    s('pop', T.sampaiB, 0.4),
    s('riser', T.sapuAkhir, 0.32),
    s('tik', T.sapuAkhir, 0.6),
    s('whoosh', T.pindahBC + 0.25, 0.5),
    s('pop', T.sebelas, 0.3),
    s('klik', T.start, 0.5),
    s('klik', T.settings, 0.5),
    s('whooshPop', T.settings + 0.12, 0.3),
    s('klik', T.system, 0.5),
    s('klik', T.display, 0.5),
    s('whooshPop', T.display + 0.12, 0.3),
    s('klik', T.advanced, 0.5),
    s('whooshPop', T.advanced + 0.12, 0.3),
    s('pop', T.tempel + 0.05, 0.45),
    s('klik', T.bukaDropdown, 0.5),
    s('tik', T.pilih + 0.05, 0.35),
    s('tik', T.angka1 + 0.2, 0.35),
    s('tik', T.paling + 0.1, 0.35),
    s('klik', T.tinggi, 0.55),
    s('sweepHit', T.tinggi + 0.06, 0.4),
    s('pop', T.aku1 + 0.42, 0.4),
    s('tik', T.bagian2 + 0.1, 0.35),
    s('klik', T.klik, 0.5),
    s('lembut', T.pindahE + 0.3, 0.4),
    s('pop', T.bintangDarat, 0.55),
    s('glitch', T.gak, 0.35),
    s('bass', T.terbang + 0.35, 0.55),
    s('klik', T.sampaiF - 0.05, 0.4),
    s('glitch', T.enam7 + 0.02, 0.35),
    ...[0, 0.45, 0.9, 1.4, 1.9, 2.4].map((x) => s('tik', T.pas + 0.4 + x, 0.2)),
    s('pop', T.hertz3, 0.5),
  ];
}

// ======================================================================================================
// LATAR (paralaks) & lapis depan
export const Latar: React.FC<{ kamera: Kamera }> = ({ kamera }) => {
  const t = useDetik();
  const gx = 22 + noise('glow-x', t * 0.12) * 6;
  const gy = 16 + noise('glow-y', t * 0.1) * 5;
  return (
    <>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${navy0} 0%, #0f1636 52%, ${navy0} 100%)` }} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${gx}% ${gy}%, rgba(220,220,220,0.11), transparent 42%), radial-gradient(circle at ${80 - gx / 4}% ${86 - gy / 4}%, rgba(61,220,132,0.07), transparent 48%)`,
        }}
      />
      <Paralaks
        kamera={kamera}
        lapis={[
          { faktor: 0.35, ...polaTitik('rgba(138,148,184,0.20)', 40, 2.2) },
          { faktor: 0.68, ...POLA_TENGAH },
        ]}
      />
    </>
  );
};

const LapisDepan: React.FC<{ kamera: Kamera }> = ({ kamera }) => {
  const o = Math.min(0.9, Math.max(0, (Math.abs(kamera.vy) - 1500) / 3500));
  if (o <= 0.01) return null;
  return <Paralaks kamera={kamera} lapis={[{ faktor: 1.7, ...POLA_DEPAN, opacity: o }]} />;
};

// ======================================================================================================
// STASIUN A: monitor + coretan hook
const StasiunA: React.FC<{ T: Waktu }> = ({ T }) => {
  const t = useDetik();
  if (t > T.sampaiB + 0.3 && t < T.terbang) return null; // di luar layar
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top: 182, width: W, display: 'flex', justifyContent: 'center' }}>
        <KataMuncul
          mulai={T.udah}
          rata="center"
          keluar={T.pindahAB - 0.32}
          gaya={{ fontFamily: MONO, fontWeight: 700, fontSize: 50, letterSpacing: '0.16em', color: emas }}
          kata={[
            { t: 'MONITOR', mulai: T.udah },
            { t: 'KAMU', mulai: Math.min(T.bayar, 0.22), isi: <SapuSorot mulai={T.bayar} lama={0.18} warna={emas} warnaTeks={[emas, navy0]} penuh keluar={T.pindahAB - 0.4}>KAMU</SapuSorot> },
          ]}
        />
      </div>
      <Monitor T={T} />
    </>
  );
};

/** Coretan hook (di atas angka 144) + lingkaran tangan di stiker 144Hz monitor. */
const CoretanA: React.FC<{ T: Waktu }> = ({ T }) => {
  const t = useDetik();
  if (t > T.sampaiB && t < T.sampaiF - 0.3) return null;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={1}>
      <GarisDigambar d="M 178 432 L 904 352" mulai={T.coret} lama={0.13} warna={koral} tebal={26} hapus={T.pindahAB - 0.32} lamaHapus={0.18} easing={EASE.masuk} />
      <GarisDigambar
        d={pathLingkarTangan(LAYAR.x + 707, LAYAR.y + 50, 128, 64, 'lingkar144')}
        mulai={T.seratus + 0.05}
        lama={0.36}
        warna={emas}
        tebal={8}
        hapus={T.pindahAB - 0.3}
      />
      <GarisDigambar d={`M ${LAYAR.x + 30} ${LAYAR.y + 128} Q ${LAYAR.x + 190} ${LAYAR.y + 116} ${LAYAR.x + 352} ${LAYAR.y + 124}`} mulai={T.enam - 0.02} lama={0.2} warna={koral} tebal={9} hapus={T.pindahAB - 0.25} />
      {/* kalimat 7 (bookend): stiker 144Hz yang dibeli dilingkari lagi, angka 60 Hz yang kepakai digaris bawahi koral */}
      <GarisDigambar d={pathLingkarTangan(LAYAR.x + 707, LAYAR.y + 50, 128, 64, 'lingkar144b')} mulai={T.dibeli} lama={0.36} warna={emas} tebal={8} hapus={T.pas - 0.1} />
      <GarisDigambar d={`M ${LAYAR.x + 30} ${LAYAR.y + 128} Q ${LAYAR.x + 190} ${LAYAR.y + 116} ${LAYAR.x + 352} ${LAYAR.y + 124}`} mulai={T.enam7 - 0.04} lama={0.2} warna={koral} tebal={9} hapus={T.pas - 0.1} />
    </svg>
  );
};

export const Monitor: React.FC<{ T: Waktu; diam?: number }> = ({ T, diam }) => {
  const t0 = useDetik();
  const t = diam ?? t0;
  const redup = maju(t, T.pas - 0.05, T.pas + 0.35) * (1 - maju(t, T.loop + 0.05, T.loop + 0.4));
  return (
    <>
      {/* kaki */}
      <div style={{ position: 'absolute', left: 498, top: LAYAR.y + LAYAR.h + 36, width: 84, height: 100, background: 'linear-gradient(180deg,#242424,#0c1230)', borderLeft: `2px solid ${WARNA.garis}`, borderRight: `2px solid ${WARNA.garis}` }} />
      <div style={{ position: 'absolute', left: 340, top: LAYAR.y + LAYAR.h + 128, width: 400, height: 30, borderRadius: 16, background: '#121938', border: `2px solid ${WARNA.garis}`, boxShadow: '0 18px 40px rgba(0,0,0,0.5)' }} />
      {/* bezel */}
      <div style={{ position: 'absolute', left: LAYAR.x - 18, top: LAYAR.y - 18, width: LAYAR.w + 36, height: LAYAR.h + 56, borderRadius: 24, background: 'linear-gradient(180deg,#171f44,#0d1330)', border: `2px solid ${WARNA.garis}`, boxShadow: '0 40px 80px rgba(0,0,0,0.55)' }} />
      <div style={{ position: 'absolute', left: LAYAR.x + LAYAR.w - 40, top: LAYAR.y + LAYAR.h + 14, width: 12, height: 12, borderRadius: 6, background: emas, boxShadow: `0 0 10px ${emas}` }} />
      {/* layar */}
      <div style={{ position: 'absolute', left: LAYAR.x, top: LAYAR.y, width: LAYAR.w, height: LAYAR.h, overflow: 'hidden', borderRadius: 8, background: '#0e1330' }}>
        <AdeganGame t={t} redup={redup} />
        {t < T.sampaiB + 0.4 || (t > T.terbang && t < T.pas + 0.3) ? (
          <Pop mulai={t < T.sampaiB + 0.4 ? T.windows1 : T.sampaiF - 0.08} keluar={t > T.terbang ? T.pas : undefined} damping={11} asal="0% 0%" gaya={{ position: 'absolute', left: 24, top: 22 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, padding: '8px 20px 10px', borderRadius: 14, background: 'rgba(11,16,32,0.82)', border: `3px solid ${koral}` }}>
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: abuTerang, letterSpacing: '0.08em' }}>WINDOWS</span>
              <span style={{ fontWeight: 800, fontSize: 64, color: koral, lineHeight: 1 }}>60 Hz</span>
            </div>
          </Pop>
        ) : null}
        <Stiker144 />
        {redup > 0 ? <TanyaLayar T={T} t={t} /> : null}
      </div>
    </>
  );
};

const Stiker144: React.FC = () => (
  <div style={{ position: 'absolute', left: 636, top: 20, rotate: '4deg', padding: '4px 20px 6px', borderRadius: 14, background: `linear-gradient(160deg, #6cf0a8, ${lime} 55%, #27b76a)`, border: `3px solid ${navy0}`, boxShadow: '0 6px 0 rgba(0,0,0,0.35)' }}>
    <span style={{ fontWeight: 800, fontSize: 54, color: navy0, lineHeight: 1 }}>144Hz</span>
  </div>
);

/** Pemandangan game generik di layar monitor: matahari, gunung, lantai grid yang jalan terus (idle). */
const AdeganGame: React.FC<{ t: number; redup: number }> = ({ t, redup }) => {
  const H0 = 300;
  const garisH = Array.from({ length: 10 }, (_, i) => {
    const f = (((i + t / 0.35) % 10) + 10) % 10 / 10;
    return { y: H0 + 172 * Math.pow(f, 2.3), o: 0.12 + 0.5 * f };
  });
  return (
    <svg width={LAYAR.w} height={LAYAR.h} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="langit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f1538" />
          <stop offset="1" stopColor="#2b2556" />
        </linearGradient>
        <linearGradient id="mthr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd86b" />
          <stop offset="1" stopColor="#ff9f3d" />
        </linearGradient>
        <clipPath id="atasCakrawala">
          <rect x={0} y={0} width={LAYAR.w} height={H0} />
        </clipPath>
      </defs>
      <rect width={LAYAR.w} height={H0} fill="url(#langit)" />
      <g clipPath="url(#atasCakrawala)">
        <circle cx={420} cy={262} r={124} fill="url(#mthr)" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={280} y={250 + i * 16} width={280} height={4 + i * 3} fill="#241f50" />
        ))}
      </g>
      <polygon points={`0,${H0} 90,226 170,268 260,196 360,${H0}`} fill="#1d2552" />
      <polygon points={`470,${H0} 600,210 690,256 760,220 840,262 840,${H0}`} fill="#1a2148" />
      <rect y={H0} width={LAYAR.w} height={LAYAR.h - H0} fill="#0c1230" />
      {Array.from({ length: 15 }, (_, j) => j - 7).map((j) => (
        <line key={j} x1={420 + j * 14} y1={H0} x2={420 + j * 150} y2={LAYAR.h} stroke={emas} strokeOpacity={0.32} strokeWidth={2} />
      ))}
      {garisH.map((g, i) => (
        <line key={i} x1={0} x2={LAYAR.w} y1={g.y} y2={g.y} stroke={emas} strokeOpacity={g.o * 0.7} strokeWidth={2} />
      ))}
      <line x1={0} x2={LAYAR.w} y1={H0} y2={H0} stroke={emas} strokeOpacity={0.7} strokeWidth={3} />
      {redup > 0 ? <rect width={LAYAR.w} height={LAYAR.h} fill={navy0} opacity={redup * 0.72} /> : null}
    </svg>
  );
};

/** Penutup: layar monitor jadi gelembung komentar, angka hertz digulung → "??". */
const TanyaLayar: React.FC<{ T: Waktu; t: number }> = ({ T, t }) => {
  const keluar = maju(t, T.loop, T.loop + 0.25, EASE.keluar);
  const muncul = maju(t, T.pas + 0.05, T.pas + 0.4);
  const darat = T.hertz3 + 0.02;
  return (
    <>
      <svg width={LAYAR.w} height={LAYAR.h} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <GarisDigambar
          d={`${pathKotak(110, 78, 520, 254, 40)} M 220 332 L 190 402 L 300 332`}
          mulai={T.berapa2 - 0.1}
          lama={0.4}
          warna={emas}
          tebal={9}
          hapus={T.loop}
          lamaHapus={0.25}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 100,
          width: 520,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'baseline',
          gap: 18,
          opacity: muncul * (1 - keluar),
          scale: String(0.9 + 0.1 * muncul - 0.15 * keluar),
        }}
      >
        <div style={{ display: 'flex', fontWeight: 800, fontSize: 210, lineHeight: 1, color: emas }}>
          <Gulung t={t} mulai={T.pas + 0.05} darat={darat} n={17} seed={3} />
          <Gulung t={t} mulai={T.pas + 0.05} darat={darat + 0.12} n={23} seed={7} />
        </div>
        <span style={{ fontWeight: 800, fontSize: 110, color: putih }}>Hz</span>
      </div>
    </>
  );
};

/** Satu kolom digit yang digulung (kayak mesin slot), melambat, mendarat di "?". */
const Gulung: React.FC<{ t: number; mulai: number; darat: number; n: number; seed: number }> = ({ t, mulai, darat, n, seed }) => {
  const p = maju(t, mulai, darat, Easing.out(Easing.cubic));
  const pos = p * n;
  const i = Math.floor(pos);
  const f = pos - i;
  const g = (k: number) => (k >= n ? '?' : String((k * 7 + seed) % 10));
  const kabur = p < 1 ? (1 - p) * 5 : 0;
  return (
    <div style={{ position: 'relative', width: '0.56em', height: '1em', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, textAlign: 'center', translate: `0 ${-f}em`, filter: kabur ? `blur(${kabur.toFixed(2)}px)` : undefined }}>{g(i)}</div>
      <div style={{ position: 'absolute', inset: 0, textAlign: 'center', translate: `0 ${1 - f}em`, filter: kabur ? `blur(${kabur.toFixed(2)}px)` : undefined }}>{g(i + 1)}</div>
    </div>
  );
};

// ======================================================================================================
// STASIUN B: dua jam refresh (60 vs 144 gambar per "1 detik", dilambatin)
const StasiunB: React.FC<{ T: Waktu }> = ({ T }) => {
  const t = useDetik();
  if (t < T.pindahAB - 0.1 || (t > T.sampaiC + 0.3 && t < T.terbang)) return null;
  return (
    <>
      <JamRefresh T={T} cx={JAM.kiri} n={60} warna={koral} />
      <JamRefresh T={T} cx={JAM.kanan} n={144} warna={lime} />
      {[JAM.kiri, JAM.kanan].map((x, i) => (
        <Pop key={x} mulai={T.refreshB + i * 0.06} damping={11} asal="50% 0%" gaya={{ position: 'absolute', left: x - 200, top: LABEL_Y + 70, width: 400, display: 'flex', justifyContent: 'center' }}>
          <div style={{ padding: '4px 16px', borderRadius: 10, background: emas, fontFamily: MONO, fontWeight: 700, fontSize: 36, letterSpacing: '0.04em', color: navy0, whiteSpace: 'nowrap' }}>REFRESH RATE</div>
        </Pop>
      ))}
      <div style={{ position: 'absolute', left: 0, top: B_Y + 1322, width: W, display: 'flex', justifyContent: 'center' }}>
        <KataMuncul
          mulai={T.berapa}
          rata="center"
          kata={['ilustrasi', '·', '1', 'detik,', 'dilambatin']}
          gaya={{ fontFamily: MONO, fontWeight: 500, fontSize: 44, color: abu }}
        />
      </div>
    </>
  );
};

const JamRefresh: React.FC<{ T: Waktu; cx: number; n: number; warna: string }> = ({ T, cx, n, warna }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const r = JAM.r;
  const cy = JAM.y;
  const p = maju(t, T.sapuMulai, T.sapuAkhir, EASE.linear); // waktu jalan konstan (fisik): linear
  const k = Math.min(n, Math.floor(p * n + 1e-6));
  const sudut = (i: number) => -Math.PI / 2 + (i / n) * Math.PI * 2;
  const tangan = sudut(k);
  const munculJarum = maju(t, T.sampaiB - 0.05, T.sampaiB + 0.25);
  const popAkhir = t >= T.sapuAkhir ? 1 + 0.14 * (1 - pegas(t, T.sapuAkhir, fps, { damping: 9, stiffness: 220, mass: 0.6 })) : 1;
  const pikselTebal = n > 100 ? 3.4 : 5.5;
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={1}>
        <circle cx={cx} cy={cy} r={r - 4} fill={WARNA.navy1} opacity={0.85 * munculJarum} />
        <GarisDigambar d={`M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r}`} mulai={T.sampaiB - 0.22} lama={0.4} warna={WARNA.garis} tebal={8} />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={cx + Math.cos(sudut((i * n) / 12)) * (r - 18)} y1={cy + Math.sin(sudut((i * n) / 12)) * (r - 18)} x2={cx + Math.cos(sudut((i * n) / 12)) * (r - 6)} y2={cy + Math.sin(sudut((i * n) / 12)) * (r - 6)} stroke={abu} strokeWidth={3} opacity={0.5 * munculJarum} />
        ))}
        {Array.from({ length: k }, (_, i) => {
          const a = sudut(i);
          const baru = k - i <= 2 && p < 1;
          return (
            <line
              key={i}
              x1={cx + Math.cos(a) * r * 0.75}
              y1={cy + Math.sin(a) * r * 0.75}
              x2={cx + Math.cos(a) * r * (baru ? 0.96 : 0.9)}
              y2={cy + Math.sin(a) * r * (baru ? 0.96 : 0.9)}
              stroke={baru ? putih : warna}
              strokeWidth={pikselTebal}
              strokeLinecap="round"
            />
          );
        })}
        <g opacity={munculJarum}>
          <line x1={cx} y1={cy} x2={cx + Math.cos(tangan) * r * 0.95} y2={cy + Math.sin(tangan) * r * 0.95} stroke={putih} strokeWidth={6} strokeLinecap="round" opacity={0.35} />
          <circle cx={cx + Math.cos(tangan) * r * 0.95} cy={cy + Math.sin(tangan) * r * 0.95} r={11} fill={putih} />
          <circle cx={cx + Math.cos(tangan) * r * 0.95} cy={cy + Math.sin(tangan) * r * 0.95} r={20} fill={warna} opacity={0.35} />
        </g>
      </svg>
      <div style={{ position: 'absolute', left: cx - r, top: cy - 78, width: r * 2, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: munculJarum, scale: String(popAkhir) }}>
        <AngkaJalan dari={0} ke={n} progress={k / n} gaya={{ fontWeight: 800, fontSize: 128, lineHeight: 1, color: warna }} />
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 36, color: abuTerang, marginTop: 0, letterSpacing: '0.04em' }}>gambar</span>
      </div>
    </>
  );
};

// ======================================================================================================
// OBJEK PEMANDU: "144Hz" (judul hook → label jam kanan) & "60Hz" (stempel → label jam kiri → ditarik kursor → nilai dropdown)
type Pose = { x: number; y: number; fs: number; rot: number; ax: number };

const Obj144: React.FC<{ T: Waktu }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < T.pop144 || (t > T.sampaiC + 0.3 && t < T.terbang) || t > T.sampaiF + 0.1) return null;
  const A: Pose = { x: 540, y: 392, fs: 300, rot: 0, ax: 0.5 };
  const B: Pose = { x: JAM.kanan, y: LABEL_Y, fs: 132, rot: 0, ax: 0.5 };
  const p = maju(t, T.pindahAB - 0.08, T.sampaiB - 0.04, EASE.kamera);
  const pose: Pose = { x: lerp(A.x, B.x, p), y: lerp(A.y, B.y, p) - Math.sin(Math.PI * p) * 120, fs: lerp(A.fs, B.fs, p), rot: 0, ax: 0.5 };
  const pop = pegas(t, T.pop144, fps, { damping: 9, stiffness: 200, mass: 0.6 });
  const darat = t >= T.sampaiB - 0.04 ? interpolate(t - (T.sampaiB - 0.04), [0, 0.05, 0.12, 0.22, 0.32], [0.78, 0.84, 1.08, 0.98, 1], JEPIT) : 1;
  const tercoret = maju(t, T.coret, T.coret + 0.15) * (1 - p);
  const sorotHz = maju(t, T.sampaiB + 0.06, T.sampaiB + 0.3, EASE.kamera);
  return (
    <TeksObjek pose={pose} skala={pop} pipih={darat} warna={campur(lime, '#5f8a74', tercoret * 0.55)} angka="144" hz="Hz" celah={0} sorotHz={sorotHz} blurMasuk={1 - maju(t, T.pop144, T.pop144 + 0.12)} />
  );
};

const Obj60: React.FC<{ T: Waktu }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < T.banting || t > T.sampaiF + 0.1) return null;
  const A: Pose = { x: 640, y: 612, fs: 196, rot: -7, ax: 0.5 };
  const B: Pose = { x: JAM.kiri, y: LABEL_Y, fs: 132, rot: 0, ax: 0.5 };
  const tag = posisiKursor(TITIK_KURSOR(T), t - 0.09);
  const Ctag: Pose = { x: tag.x + 62, y: tag.y + 34, fs: 50, rot: 3, ax: 0 }; // label di kanan kursor, gak ngegantung ke subtitle
  const D: Pose = { x: NILAI.x, y: NILAI.y, fs: 64, rot: 0, ax: 0 };
  const p1 = maju(t, T.pindahAB - 0.08, T.sampaiB - 0.02, EASE.kamera);
  const p2 = maju(t, T.pindahBC - 0.05, T.sampaiC + 0.45, EASE.kamera);
  const p3 = maju(t, T.tempel - 0.32, T.tempel, EASE.kamera);
  let pose: Pose;
  if (p2 <= 0) {
    pose = {
      x: lerp(A.x, B.x, p1),
      y: lerp(A.y, B.y, p1) - Math.sin(Math.PI * p1) * 80,
      fs: lerp(A.fs, B.fs, p1),
      rot: lerp(A.rot, B.rot, p1),
      ax: 0.5,
    };
  } else if (p3 <= 0) {
    pose = {
      x: lerp(B.x, Ctag.x, p2),
      y: lerp(B.y, Ctag.y, p2) - Math.sin(Math.PI * p2) * 140,
      fs: lerp(B.fs, Ctag.fs, p2),
      rot: lerp(0, Ctag.rot + Math.sin(t * 5) * 2, p2),
      ax: lerp(0.5, 0, p2),
    };
  } else {
    pose = {
      x: lerp(Ctag.x, D.x, p3),
      y: lerp(Ctag.y, D.y, p3) - Math.sin(Math.PI * p3) * 60,
      fs: lerp(Ctag.fs, D.fs, p3),
      rot: lerp(Ctag.rot, 0, p3),
      ax: 0,
    };
  }
  // banting stempel (A)
  const b = maju(t, T.banting, T.banting + 0.08, Easing.in(Easing.quad));
  const dB = Math.max(0, t - T.banting - 0.08);
  const ayun = b >= 1 ? 3 * Math.sin(dB * 24) * Math.exp(-dB * 7) * (1 - p1) : 0;
  // hentak lagi pas VO "enam puluh hertz" (momen hit kedua di hook)
  const hentak = t >= T.enam && p1 <= 0 ? 1 + 0.12 * (1 - pegas(t, T.enam, fps, { damping: 8, stiffness: 240, mass: 0.6 })) : 1;
  const skala = (1.7 + (1 - 1.7) * b) * hentak;
  const darat1 = t >= T.sampaiB - 0.02 && p2 <= 0 ? interpolate(t - (T.sampaiB - 0.02), [0, 0.05, 0.12, 0.22, 0.32], [0.8, 0.86, 1.07, 0.98, 1], JEPIT) : 1;
  const darat3 = t >= T.tempel ? interpolate(t - T.tempel, [0, 0.05, 0.12, 0.22, 0.32], [0.78, 0.86, 1.08, 0.98, 1], JEPIT) : 1;
  // nilai dropdown: 60 → 144 pas diklik (angka jalan diikat ke list yang naik masuk kotak)
  const ganti = maju(t, T.tinggi + 0.04, T.tinggi + 0.42, EASE.kamera);
  const warna = campur(koral, lime, ganti);
  return (
    <TeksObjek
      pose={{ ...pose, rot: pose.rot + ayun }}
      skala={skala}
      pipih={darat1 * darat3}
      opacity={Math.min(1, (t - T.banting) / 0.03)}
      warna={warna}
      angka={<AngkaJalan dari={60} ke={144} progress={ganti} />}
      hz="Hz"
      tanya={1 - p1}
      celah={p3}
      kotak={1 - p1}
      label="JALAN"
      pil={p2 * (1 - p3)}
      sorotHz={maju(t, T.sampaiB + 0.06, T.sampaiB + 0.3, EASE.kamera) * (1 - p2)}
    />
  );
};

const TeksObjek: React.FC<{
  pose: Pose;
  skala?: number;
  pipih?: number;
  opacity?: number;
  warna: string;
  angka: React.ReactNode;
  hz: string;
  /** jarak angka–Hz (0..1 → 0..0,22em) */
  celah: number;
  tanya?: number;
  kotak?: number;
  label?: string;
  pil?: number;
  sorotHz: number;
  blurMasuk?: number;
}> = ({ pose, skala = 1, pipih = 1, opacity = 1, warna, angka, hz, celah, tanya = 0, kotak = 0, label, pil = 0, sorotHz, blurMasuk = 0 }) => (
  <div
    style={{
      position: 'absolute',
      left: pose.x,
      top: pose.y,
      translate: `${-pose.ax * 100}% -50%`,
      transformOrigin: `${pose.ax * 100}% 50%`,
      rotate: `${pose.rot}deg`,
      scale: `${(skala / Math.sqrt(pipih)).toFixed(4)} ${(skala * pipih).toFixed(4)}`,
      opacity,
      filter: blurMasuk > 0.01 ? `blur(${(blurMasuk * 18).toFixed(1)}px)` : undefined,
      fontSize: pose.fs,
      whiteSpace: 'nowrap',
    }}
  >
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${0.04 + 0.1 * kotak}em ${0.1 + 0.1 * kotak + 0.12 * pil}em ${0.06 + 0.06 * kotak}em`,
        borderRadius: `${0.12 + 0.2 * pil}em`,
        border: kotak > 0.01 ? `${(0.045 * kotak).toFixed(3)}em solid ${koral}` : undefined,
        background: pil > 0.01 ? `rgba(255,90,95,${(0.16 * pil).toFixed(3)})` : kotak > 0.01 ? `rgba(11,16,32,${(0.9 * kotak).toFixed(3)})` : undefined,
        outline: pil > 0.01 ? `${(0.04 * pil).toFixed(3)}em solid rgba(255,90,95,${pil.toFixed(3)})` : undefined,
      }}
    >
      {label && kotak > 0.01 ? (
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: '0.2em', letterSpacing: '0.2em', color: koral, opacity: kotak, height: `${1.2 * kotak}em`, lineHeight: 1.2 }}>{label}</span>
      ) : null}
      <div style={{ display: 'flex', alignItems: 'baseline', fontWeight: 800, lineHeight: 0.92, color: warna }}>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{angka}</span>
        <span style={{ position: 'relative', marginLeft: `${(0.2 * celah).toFixed(3)}em` }}>
          <span
            style={{
              position: 'absolute',
              left: '-0.04em',
              right: '-0.04em',
              bottom: '-0.02em',
              height: '0.1em',
              background: emas,
              borderRadius: '0.05em',
              transformOrigin: 'left',
              transform: `scaleX(${sorotHz.toFixed(3)})`,
            }}
          />
          <span style={{ position: 'relative', color: sorotHz > 0.5 ? campur(warna, emas, (sorotHz - 0.5) * 2) : undefined }}>{hz}</span>
        </span>
        {tanya > 0.01 ? <span style={{ display: 'inline-block', opacity: tanya, width: `${0.42 * tanya}em`, overflow: 'hidden' }}>?</span> : null}
      </div>
    </div>
  </div>
);

// ======================================================================================================
// STASIUN C/D/E: layar Windows (UI rekonstruksi sederhana, bukan tangkapan layar) yang "dijalanin" kursor
const TITIK_KURSOR = (T: Waktu): TitikKursor[] => [
  { t: T.sampaiC - 0.1, x: 1180, y: C_Y + 1240 },
  { t: T.sampaiC + 0.35, x: 960, y: C_Y + 1215 },
  { t: T.sebelas + 0.5, x: 820, y: C_Y + 1290 },
  { t: T.start - 0.5, x: 700, y: C_Y + 1370 },
  { t: T.start - 0.08, x: START.x + 128, y: START.y + 36 },
  { t: T.settings - 0.08, x: UBIN.x + 98, y: UBIN.y + 92 },
  { t: T.system - 0.08, x: NAV0.x + 170, y: NAV0.y + 48 },
  { t: T.display - 0.08, x: BARIS_DISPLAY.x + 230, y: BARIS_DISPLAY.y + 56 },
  { t: T.advanced - 0.08, x: BARIS_ADV.x + 470, y: BARIS_ADV.y + 56 },
  { t: T.advanced + 0.8, x: 760, y: C_Y + 1170 },
  { t: T.bukaDropdown - 0.06, x: DROP.x + DROP.w - 70, y: DROP.y + 56 },
  { t: T.pilih + 0.05, x: 520, y: BARIS_LIST(0).y + 62 },
  { t: T.angka1 + 0.2, x: 520, y: BARIS_LIST(1).y + 62 },
  { t: T.paling + 0.1, x: 520, y: BARIS_LIST(2).y + 62 },
  { t: T.tinggi + 0.7, x: 800, y: C_Y + 1260 },
  { t: T.bagian2 + 0.1, x: ISI.x + 470, y: ISI.y + 70 },
  { t: T.klik - 0.02, x: ISI.x + 430, y: ISI.y + 62 },
  { t: T.klik + 0.5, x: 820, y: C_Y + 1240 },
];

const KursorWindows: React.FC<{ T: Waktu }> = ({ T }) => {
  const t = useDetik();
  if (t < T.sampaiC - 0.2 || t > T.pindahE + 0.5) return null; // kursor cuma di C–D
  return (
    <Kursor
      titik={TITIK_KURSOR(T)}
      klik={[T.start, T.settings, T.system, T.display, T.advanced, T.bukaDropdown, T.tinggi, T.klik]}
      masuk={T.sampaiC - 0.15}
      keluar={T.pindahE + 0.1}
      ukuran={78}
    />
  );
};

const Skel: React.FC<{ x: number; y: number; w: number; h: number; r?: number; o?: number }> = ({ x, y, w, h, r = 8, o = 1 }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, background: WARNA.skeleton, opacity: o }} />
);

const IkonGir: React.FC<{ ukuran: number; warna: string; putar?: number }> = ({ ukuran, warna, putar = 0 }) => (
  <svg width={ukuran} height={ukuran} viewBox="-50 -50 100 100" style={{ rotate: `${putar}deg` }}>
    {Array.from({ length: 8 }, (_, i) => (
      <rect key={i} x={-9} y={-46} width={18} height={22} rx={4} fill={warna} transform={`rotate(${i * 45})`} />
    ))}
    <circle r={32} fill={warna} />
    <circle r={13} fill={WARNA.permukaan} />
  </svg>
);

const IkonLayar: React.FC<{ ukuran: number; warna: string; laptop?: boolean }> = ({ ukuran, warna, laptop }) => (
  <svg width={ukuran} height={ukuran} viewBox="0 0 100 100">
    {laptop ? (
      <>
        <rect x={18} y={22} width={64} height={42} rx={5} fill="none" stroke={warna} strokeWidth={8} />
        <path d="M8 74 H92" stroke={warna} strokeWidth={9} strokeLinecap="round" />
      </>
    ) : (
      <>
        <rect x={12} y={18} width={76} height={50} rx={6} fill="none" stroke={warna} strokeWidth={8} />
        <path d="M50 70 V82 M32 84 H68" stroke={warna} strokeWidth={8} strokeLinecap="round" />
      </>
    )}
  </svg>
);

const Panah: React.FC<{ warna?: string }> = ({ warna = abu }) => (
  <svg width={34} height={34} viewBox="0 0 34 34">
    <path d="M12 6 L24 17 L12 28" fill="none" stroke={warna} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StasiunC: React.FC<{ T: Waktu }> = ({ T }) => {
  const t = useDetik();
  if (t < T.pindahBC - 0.05 || t > T.sampaiF + 0.1) return null;
  const isiJendela = maju(t, T.pindahBC + 0.25, T.pindahBC + 0.6);
  const panel = t >= T.start && t < T.settings + 0.3;
  const hoverUbin = maju(t, T.settings - 0.25, T.settings - 0.05);
  const pilihSystem = maju(t, T.system, T.system + 0.18);
  const hoverAdv = maju(t, T.advanced - 0.28, T.advanced - 0.06);
  return (
    <>
      {/* jendela */}
      <div style={{ position: 'absolute', left: JEN.x, top: JEN.y, width: JEN.w, height: JEN.h, borderRadius: 26, background: WARNA.navy1, opacity: isiJendela, boxShadow: '0 40px 90px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: JEN.w, height: 62, background: '#0d1330', borderBottom: `2px solid ${WARNA.garis}` }} />
        <div style={{ position: 'absolute', inset: '62px 0 0 0', background: `radial-gradient(circle at 30% 40%, rgba(220,220,220,0.10), transparent 55%), linear-gradient(160deg, #141c44, #0e1434)` }} />
        <svg style={{ position: 'absolute', right: 24, top: 18 }} width={150} height={28}>
          <path d="M8 14 H34" stroke={abu} strokeWidth={4} strokeLinecap="round" />
          <rect x={64} y={3} width={22} height={22} rx={3} fill="none" stroke={abu} strokeWidth={4} />
          <path d="M116 4 L136 24 M136 4 L116 24" stroke={abu} strokeWidth={4} strokeLinecap="round" />
        </svg>
        {/* taskbar + Start */}
        <div style={{ position: 'absolute', left: 0, top: ISI.h + 62, width: JEN.w, height: 78, background: '#0b1029', borderTop: `2px solid ${WARNA.garis}` }} />
        {[-2, -1, 1, 2].map((i) => (
          <Skel key={i} x={START.x - JEN.x + START.w / 2 - 25 + i * 120 + (i > 0 ? 40 : -40)} y={ISI.h + 62 + 14} w={50} h={50} r={12} o={0.8} />
        ))}
        <div style={{ position: 'absolute', left: START.x - JEN.x, top: START.y - JEN.y, width: START.w, height: START.h, borderRadius: 16, background: campur('#1a2350', '#2b3770', maju(t, T.start - 0.6, T.start)), border: `${2 + maju(t, T.start - 0.6, T.start)}px solid ${campur(WARNA.garis, emas, maju(t, T.start - 0.6, T.start))}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <svg width={30} height={30} viewBox="0 0 30 30">
            {[0, 1, 2].flatMap((a) => [0, 1, 2].map((b) => <circle key={`${a}${b}`} cx={5 + a * 10} cy={5 + b * 10} r={3.4} fill={emas} />))}
          </svg>
          <span style={{ fontWeight: 700, fontSize: 40, color: putih }}>Start</span>
        </div>
      </div>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={1}>
        <GarisDigambar d={pathKotak(JEN.x, JEN.y, JEN.w, JEN.h, 26)} mulai={T.pindahBC + 0.2} lama={0.5} warna={emas} tebal={3} opacity={0.75} />
      </svg>
      {/* chip Windows 11 di title bar (diegetik) */}
      <Pop mulai={T.sebelas - 0.05} damping={11} asal="0% 50%" gaya={{ position: 'absolute', left: JEN.x + 22, top: JEN.y + 10 }}>
        <div style={{ padding: '2px 18px 4px', borderRadius: 20, border: `2px solid ${emas}`, fontWeight: 700, fontSize: 34, color: emas, lineHeight: 1.1 }}>Windows 11</div>
      </Pop>

      {/* panel Start */}
      {panel ? (
        <Pop mulai={T.start + 0.03} damping={14} stiffness={220} asal="50% 100%" keluar={T.settings + 0.04} lamaKeluar={0.18} gaya={{ position: 'absolute', left: PANEL.x, top: PANEL.y }}>
          <div style={{ position: 'relative', width: PANEL.w, height: PANEL.h, borderRadius: 24, background: '#1d2650', border: `2px solid #34407a`, boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
            <Skel x={30} y={28} w={560} h={54} r={27} />
            {Array.from({ length: 6 }, (_, i) => {
              const x = 30 + (i % 3) * 195;
              const y = 110 + Math.floor(i / 3) * 175;
              if (i === 0) {
                return (
                  <div key={i} style={{ position: 'absolute', left: x, top: y, width: UBIN.w, height: UBIN.h, borderRadius: 18, background: hoverUbin > 0 ? `rgba(220,220,220,${0.16 * hoverUbin})` : 'transparent', border: `3px solid ${campur('#34407a', emas, hoverUbin)}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <IkonGir ukuran={72} warna={emas} putar={t * 40} />
                    <span style={{ fontWeight: 700, fontSize: 36, color: putih }}>Settings</span>
                  </div>
                );
              }
              return (
                <React.Fragment key={i}>
                  <Skel x={x + 58} y={y + 30} w={54} h={54} r={14} />
                  <Skel x={x + 30} y={y + 104} w={110} h={16} />
                </React.Fragment>
              );
            })}
          </div>
        </Pop>
      ) : null}

      {/* halaman Settings (tumbuh dari ubin Settings) */}
      {t < T.display + 0.5 ? (
        <ZoomTembus dari={{ ...UBIN, r: 18 }} ke={{ ...ISI, r: 0 }} mulai={T.settings + 0.04} lama={0.36} warna={WARNA.halaman}>
          <div style={{ position: 'absolute', inset: 0, background: WARNA.halaman }}>
            <div style={{ position: 'absolute', left: 40, top: 22, fontWeight: 700, fontSize: 58, color: putih, display: 'flex', alignItems: 'center', gap: 16 }}>
              <IkonGir ukuran={52} warna={emas} /> Settings
            </div>
            <div style={{ position: 'absolute', left: NAV0.x - ISI.x, top: NAV0.y - ISI.y, width: NAV0.w, height: NAV0.h, borderRadius: 14, background: campur('#1b2350', '#2d3a78', pilihSystem), display: 'flex', alignItems: 'center', gap: 16, paddingLeft: 22 }}>
              <div style={{ position: 'absolute', left: 0, top: 14, width: 7, height: 48, borderRadius: 4, background: emas, scale: `1 ${pilihSystem}` }} />
              <IkonLayar ukuran={46} warna={emas} laptop />
              <span style={{ fontWeight: 700, fontSize: 46, color: putih }}>System</span>
            </div>
            {[1, 2, 3, 4].map((i) => (
              <React.Fragment key={i}>
                <Skel x={52} y={110 + i * 88 + 18} w={40} h={40} r={10} />
                <Skel x={108} y={110 + i * 88 + 30} w={150 - (i % 2) * 30} h={16} />
              </React.Fragment>
            ))}
            {/* panel kanan: kerangka → daftar System */}
            <div style={{ position: 'absolute', left: 360, top: 110, width: 550, opacity: 1 - pilihSystem }}>
              {[0, 1, 2].map((i) => (
                <Skel key={i} x={0} y={i * 168} w={550} h={150} r={18} />
              ))}
            </div>
            {pilihSystem > 0 ? (
              <div style={{ position: 'absolute', left: 360, top: 104, width: 550 }}>
                <div style={{ fontWeight: 700, fontSize: 50, color: putih, opacity: pilihSystem, translate: `${(1 - pilihSystem) * 40}px 0` }}>System</div>
                {[0, 1, 2, 3].map((i) => {
                  const m = maju(t, T.system + 0.06 + i * 0.05, T.system + 0.3 + i * 0.05);
                  const y = BARIS_DISPLAY.y - ISI.y - 104 + i * 104;
                  return (
                    <div key={i} style={{ position: 'absolute', left: 0, top: y, width: 550, height: 92, borderRadius: 16, background: i === 0 ? '#1f2958' : '#192149', opacity: m, translate: `${(1 - m) * 50}px 0`, display: 'flex', alignItems: 'center', paddingLeft: 22, gap: 18, border: i === 0 && t > T.display - 0.25 ? `3px solid ${emas}` : '3px solid transparent' }}>
                      {i === 0 ? (
                        <>
                          <IkonLayar ukuran={50} warna={emas} />
                          <span style={{ fontWeight: 700, fontSize: 46, color: putih, flex: 1 }}>Display</span>
                          <div style={{ marginRight: 18 }}>
                            <Panah warna={emas} />
                          </div>
                        </>
                      ) : (
                        <>
                          <Skel x={22} y={26} w={40} h={40} r={10} />
                          <Skel x={84} y={38} w={170 + i * 30} h={16} />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </ZoomTembus>
      ) : null}

      {/* halaman Display (tumbuh dari baris Display) */}
      {t < T.advanced + 0.5 ? (
        <ZoomTembus dari={{ ...BARIS_DISPLAY, r: 16 }} ke={{ ...ISI, r: 0 }} mulai={T.display + 0.04} lama={0.34} warna={WARNA.halaman}>
          <div style={{ position: 'absolute', inset: 0, background: WARNA.halaman }}>
            <div style={{ position: 'absolute', left: 40, top: 26, fontWeight: 700, fontSize: 52, display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ color: abu }}>System</span>
              <Panah />
              <span style={{ color: putih }}>Display</span>
            </div>
            {[0, 1, 2, 3, 4].map((i) => {
              const y = 110 + i * 104;
              if (i === 2) {
                return (
                  <div key={i} style={{ position: 'absolute', left: 30, top: y, width: 880, height: 92, borderRadius: 16, background: `rgba(220,220,220,${0.04 + 0.14 * hoverAdv})`, border: `3px solid ${campur('#2a3463', emas, hoverAdv)}`, display: 'flex', alignItems: 'center', paddingLeft: 24, gap: 18 }}>
                    <IkonLayar ukuran={52} warna={emas} />
                    <span style={{ fontWeight: 700, fontSize: 48, color: putih, flex: 1 }}>Advanced display</span>
                    <div style={{ marginRight: 22 }}>
                      <Panah warna={emas} />
                    </div>
                  </div>
                );
              }
              return (
                <div key={i} style={{ position: 'absolute', left: 30, top: y, width: 880, height: 92, borderRadius: 16, background: '#192149' }}>
                  <Skel x={24} y={26} w={40} h={40} r={10} />
                  <Skel x={86} y={38} w={200 + (i % 2) * 60} h={16} />
                  {i === 0 ? <Skel x={600} y={40} w={240} h={12} r={6} /> : null}
                </div>
              );
            })}
          </div>
        </ZoomTembus>
      ) : null}

      {/* halaman Advanced display (tumbuh dari baris Advanced display) */}
      <ZoomTembus dari={{ ...BARIS_ADV, r: 16 }} ke={{ ...ISI, r: 0 }} mulai={T.advanced + 0.04} lama={0.36} warna={WARNA.halaman}>
        <HalamanAdvanced T={T} />
      </ZoomTembus>

      <DaftarRefresh T={T} />
      <KartuContoh T={T} />
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={1}>
        <GarisDigambar d={pathLingkarTangan(ISI.x + 290, ISI.y + 62, 300, 62, 'lingkarAdv')} mulai={T.bagian2 - 0.05} lama={0.4} warna={emas} tebal={8} hapus={T.pindahE + 0.1} />
      </svg>
    </>
  );
};

const HalamanAdvanced: React.FC<{ T: Waktu }> = ({ T }) => {
  const t = useDetik();
  const dx = DROP.x - ISI.x;
  const dy = DROP.y - ISI.y;
  return (
    <div style={{ position: 'absolute', inset: 0, background: WARNA.halaman }}>
      <div style={{ position: 'absolute', left: 40, top: 26, fontWeight: 700, fontSize: 58, color: putih }}>Advanced display</div>
      <div style={{ position: 'absolute', left: 30, top: 110, width: 880, height: 220, borderRadius: 20, background: '#192149', border: `2px solid ${WARNA.garis}` }} />
      <div style={{ position: 'absolute', left: 60, top: 124, fontWeight: 700, fontSize: 52, color: putih }}>
        <SapuSorot mulai={T.choose} lama={0.3} warna="rgba(220,220,220,0.30)" penuh>
          Choose a refresh rate
        </SapuSorot>
      </div>
      <div style={{ position: 'absolute', right: 52, top: 132, padding: '2px 14px', borderRadius: 10, border: `2px solid ${abu}`, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: abu }}>ilustrasi</div>
      <div style={{ position: 'absolute', left: dx, top: dy, width: DROP.w, height: DROP.h, borderRadius: 16, background: '#0e1430', border: `3px solid ${t >= T.bukaDropdown - 0.3 && t < T.tinggi + 0.3 ? emas : '#3a4680'}` }}>
        <svg style={{ position: 'absolute', right: 26, top: 26 }} width={40} height={40} viewBox="0 0 40 40">
          <path d="M8 14 L20 26 L32 14" fill="none" stroke={emas} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {/* centang setelah 144 dipilih */}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d={`M ${dx + 330} ${dy + 46} L ${dx + 352} ${dy + 68} L ${dx + 396} ${dy + 22}`} mulai={T.tinggi + 0.36} lama={0.2} warna={lime} tebal={9} />
      </svg>
      {[0, 1, 2].map((i) => (
        <React.Fragment key={i}>
          <Skel x={60} y={372 + i * 74} w={340 - i * 60} h={18} />
          <Skel x={560} y={372 + i * 74} w={300} h={18} o={0.6} />
        </React.Fragment>
      ))}
    </div>
  );
};

const PILIHAN = [
  { teks: '60 Hz', warna: koral },
  { teks: '120 Hz', warna: putih },
  { teks: '144 Hz', warna: lime },
];

const DaftarRefresh: React.FC<{ T: Waktu }> = ({ T }) => {
  const t = useDetik();
  const buka = maju(t, T.bukaDropdown + 0.02, T.bukaDropdown + 0.3, EASE.masuk);
  const tutup = maju(t, T.tinggi + 0.08, T.tinggi + 0.34, EASE.keluar);
  if (buka <= 0 || tutup >= 1) return null;
  // sorotan pindah 60 → 120 → 144 ngikut kursor
  const posisi = interpolate(t, [T.pilih - 0.15, T.pilih + 0.05, T.angka1 + 0.0, T.angka1 + 0.2, T.paling - 0.1, T.paling + 0.1], [0, 0, 0, 1, 1, 2], {
    ...JEPIT,
    easing: EASE.kamera,
  });
  const munculSorot = maju(t, T.pilih - 0.15, T.pilih + 0.05);
  const kilat = t >= T.tinggi ? 1 - maju(t, T.tinggi, T.tinggi + 0.2) : 0;
  const tinggiList = 3 * 112 * buka * (1 - tutup);
  return (
    <div style={{ position: 'absolute', left: DROP.x, top: DROP.y + DROP.h + 6, width: DROP.w, height: tinggiList, overflow: 'hidden', borderRadius: 18 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: DROP.w, height: 3 * 112, borderRadius: 18, background: '#1d2650', border: `2px solid #3a4680`, boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }} />
      <div style={{ position: 'absolute', left: 8, top: 8 + posisi * 112, width: DROP.w - 16, height: 96, borderRadius: 14, background: `rgba(220,220,220,${(0.14 + 0.3 * kilat) * munculSorot})`, border: `4px solid rgba(220,220,220,${munculSorot})` }} />
      {PILIHAN.map((p, i) => {
        const m = maju(t, T.bukaDropdown + 0.05 + i * 0.05, T.bukaDropdown + 0.3 + i * 0.05);
        return (
          <div key={i} style={{ position: 'absolute', left: 40, top: i * 112 + 16, height: 80, display: 'flex', alignItems: 'center', gap: 22, opacity: m, translate: `0 ${(1 - m) * -20}px` }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: p.warna }} />
            <span style={{ fontWeight: 800, fontSize: 64, color: p.warna }}>{p.teks}</span>
            {i === 0 ? <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, color: abu, marginLeft: 10 }}>sekarang</span> : null}
          </div>
        );
      })}
    </div>
  );
};

const KartuContoh: React.FC<{ T: Waktu }> = ({ T }) => {
  const t = useDetik();
  if (t < T.pindahE + 0.2) return null;
  const abuP = maju(t, T.gak, T.gak + 0.35, EASE.kamera);
  const warnaTeks = campur(lime, '#767b90', abuP);
  return (
    <ZoomTembus dari={{ x: DROP.x + 20, y: DROP.y + DROP.h, w: DROP.w - 40, h: 6, r: 6 }} ke={{ ...CONTOH, r: 18 }} mulai={T.pindahE + 0.22} lama={0.32} warna="#1b234c" isiMuncul={0.3}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 18, border: `3px ${abuP > 0.5 ? 'dashed' : 'solid'} ${campur(emas, '#6b7397', abuP)}` }} />
      <div style={{ position: 'absolute', left: 36, top: 14, display: 'flex', alignItems: 'baseline', fontWeight: 800, fontSize: 70, color: warnaTeks, lineHeight: 1.15 }}>
        <span>144 Hz</span>
        <div style={{ position: 'relative', width: 70, height: 70 }}>
          <Squash mendarat={T.bintangDarat} tinggiJatuh={260} lamaJatuh={0.24} gaya={{ position: 'absolute', left: 10, top: -12 }}>
            <span style={{ fontWeight: 800, fontSize: 110, color: emas, lineHeight: 1 }}>*</span>
          </Squash>
        </div>
      </div>
      <div style={{ position: 'absolute', right: 30, top: 32, padding: '4px 16px', borderRadius: 12, background: 'rgba(220,220,220,0.14)', border: `2px solid ${emas}`, fontFamily: MONO, fontWeight: 700, fontSize: 34, color: emas, letterSpacing: '0.1em' }}>CONTOH</div>
    </ZoomTembus>
  );
};

// ======================================================================================================
// HUD: teks kata kunci (lapisan layar, gak ikut zoom kamera). Zona teks 10–32% tinggi, generik di kanan atas (B–D).
const LABEL: React.CSSProperties = { fontFamily: MONO, fontWeight: 700, fontSize: 50, letterSpacing: '0.14em', color: emas };

const HUD: React.FC<{ T: Waktu }> = ({ T }) => {
  const t = useDetik();
  const kiri = (top: number, isi: React.ReactNode) => <div style={{ position: 'absolute', left: 70, top, width: 940 }}>{isi}</div>;
  const tengah = (top: number, isi: React.ReactNode) => <div style={{ position: 'absolute', left: 40, top, width: 1000, display: 'flex', justifyContent: 'center' }}>{isi}</div>;
  const redup = (mulaiBerikut: number) => (t >= mulaiBerikut ? abuTerang : putih);
  const sorot = (teks: string, mulai: number, warna = emas) => (
    <SapuSorot mulai={mulai} lama={0.22} warna={warna} warnaTeks={[putih, navy0]} penuh>
      {teks}
    </SapuSorot>
  );
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* ---------- 2: hertz = berapa kali layar ganti gambar tiap detik; di Windows namanya refresh rate ---------- */}
      {t > T.hertzB - 0.1 && t < T.pindahBC + 0.2 ? (
        <>
          {kiri(186, <KataMuncul mulai={T.hertzB} keluar={T.pindahBC - 0.22} gaya={LABEL} kata={[{ t: 'HERTZ', mulai: T.hertzB }, { t: '(Hz)', mulai: T.hertzB + 0.14 }]} />)}
          {kiri(252, <KataMuncul mulai={T.berapa} keluar={T.pindahBC - 0.2} gaya={{ fontWeight: 600, fontSize: 68, color: abuTerang, lineHeight: 1 }} kata={[{ t: 'berapa', mulai: T.berapa }, { t: 'kali', mulai: T.kali }, { t: 'layar', mulai: T.layar }]} />)}
          {kiri(318, <KataMuncul mulai={T.ganti} keluar={T.pindahBC - 0.18} gaya={{ fontWeight: 800, fontSize: 134, lineHeight: 1 }} kata={[{ t: 'ganti', mulai: T.ganti }, { t: 'gambar', mulai: T.gambar }]} />)}
          {kiri(446, <KataMuncul mulai={T.tiap} keluar={T.pindahBC - 0.16} gaya={{ fontWeight: 800, fontSize: 134, lineHeight: 1 }} kata={[{ t: 'tiap', mulai: T.tiap }, { t: 'detik', mulai: T.detik, isi: sorot('detik', T.detik + 0.12) }]} />)}
          {kiri(592, <KataMuncul mulai={T.windowsB} keluar={T.pindahBC - 0.14} gaya={{ ...LABEL, fontSize: 44, letterSpacing: '0.06em' }} kata={[{ t: 'DI', mulai: T.windowsB }, { t: 'WINDOWS:', mulai: T.windowsB + 0.08 }, { t: 'Hz', mulai: T.refreshB - 0.1, warna: putih }, { t: '=', mulai: T.refreshB - 0.04, warna: putih }, { t: 'REFRESH RATE', mulai: T.refreshB, isi: sorot('REFRESH RATE', T.refreshB + 0.1) }]} />)}
        </>
      ) : null}

      {/* ---------- 3: jalur menu Windows 11 ---------- */}
      {t > T.windows2 - 0.1 && t < T.bagian + 0.3 ? (
        <>
          {kiri(186, <KataMuncul mulai={T.windows2} keluar={T.bagian - 0.12} gaya={LABEL} kata={[{ t: 'LANGKAH', mulai: T.windows2 }, { t: '1', mulai: T.windows2 + 0.08 }]} />)}
          {kiri(
            250,
            <KataMuncul
              mulai={T.start}
              keluar={T.bagian - 0.1}
              gaya={{ fontWeight: 700, fontSize: 76, lineHeight: 1.12, color: putih }}
              kata={[
                { t: 'Start', mulai: T.start, warna: redup(T.settings) },
                { t: '›', mulai: T.settings - 0.06, warna: emas },
                { t: 'Settings', mulai: T.settings, warna: redup(T.system) },
                { t: '›', mulai: T.system - 0.06, warna: emas },
              ]}
            />,
          )}
          {kiri(
            336,
            <KataMuncul
              mulai={T.system}
              keluar={T.bagian - 0.08}
              gaya={{ fontWeight: 700, fontSize: 76, lineHeight: 1.12, color: putih }}
              kata={[
                { t: 'System', mulai: T.system, warna: redup(T.display) },
                { t: '›', mulai: T.display - 0.06, warna: emas },
                { t: 'Display', mulai: T.display, warna: redup(T.advanced) },
                { t: '›', mulai: T.advanced - 0.06, warna: emas },
              ]}
            />,
          )}
          {kiri(422, <KataMuncul mulai={T.advanced} keluar={T.bagian - 0.06} gaya={{ fontWeight: 800, fontSize: 86, lineHeight: 1.12 }} kata={[{ t: 'Advanced display', mulai: T.advanced, isi: sorot('Advanced display', T.advanced + 0.14) }]} />)}
        </>
      ) : null}

      {/* ---------- 4: pilih angka tertinggi ---------- */}
      {t > T.bagian - 0.1 && t < T.aku1 + 0.3 ? (
        <>
          {kiri(186, <KataMuncul mulai={T.bagian + 0.05} keluar={T.aku1 - 0.14} gaya={LABEL} kata={[{ t: 'LANGKAH', mulai: T.bagian + 0.05 }, { t: '2', mulai: T.bagian + 0.13 }]} />)}
          {t < T.pilih ? kiri(262, <KataMuncul mulai={T.choose} keluar={T.pilih - 0.2} gaya={{ fontWeight: 700, fontSize: 74, lineHeight: 1, color: abuTerang }} kata={[{ t: 'Choose', mulai: T.choose }, { t: 'a', mulai: T.choose + 0.1 }, { t: 'refresh', mulai: T.choose + 0.2 }, { t: 'rate', mulai: T.choose + 0.32 }]} />) : null}
          {kiri(250, <KataMuncul mulai={T.pilih} keluar={T.aku1 - 0.12} gaya={{ fontWeight: 800, fontSize: 128, lineHeight: 1 }} kata={[{ t: 'pilih', mulai: T.pilih }, { t: 'angka', mulai: T.angka1 }]} />)}
          {kiri(376, <KataMuncul mulai={T.paling} keluar={T.aku1 - 0.1} gaya={{ fontWeight: 800, fontSize: 128, lineHeight: 1 }} kata={[{ t: 'tertinggi', mulai: T.paling, isi: sorot('tertinggi', T.tinggi + 0.05, lime) }]} />)}
        </>
      ) : null}

      {/* ---------- 5: generik ngaku dulu kelewat ---------- */}
      {t > T.aku1 - 0.1 && t < T.pindahE + 0.3 ? (
        <>
          {kiri(186, <KataMuncul mulai={T.aku1} keluar={T.angka2 - 0.22} gaya={LABEL} kata={[{ t: 'CEK', mulai: T.aku1 }, { t: 'LAGI', mulai: T.dulu }, { t: '', mulai: T.juga }]} />)}
          {kiri(250, <KataMuncul mulai={T.kelewat} keluar={T.angka2 - 0.2} gaya={{ fontWeight: 800, fontSize: 112, lineHeight: 1 }} kata={[{ t: 'pilihan', mulai: T.kelewat, isi: sorot('pilihan', T.kelewat + 0.12, koral) }, { t: 'bagian', mulai: T.bagian2 }, { t: 'ini', mulai: T.ini }]} />)}
          {kiri(378, <KataMuncul mulai={T.padahal} keluar={T.angka2 - 0.18} gaya={{ fontWeight: 700, fontSize: 80, lineHeight: 1, color: abuTerang }} kata={[{ t: 'cukup', mulai: T.padahal }, { t: 'satu', mulai: T.tinggal }, { t: 'klik', mulai: T.klik, warna: emas }]} />)}
        </>
      ) : null}

      {/* ---------- 6: tanda bintang ---------- */}
      {t > T.pindahE - 0.1 && t < T.terbang + 0.3 ? (
        <>
          {kiri(186, <KataMuncul mulai={T.angka2} keluar={T.terbang - 0.2} gaya={LABEL} kata={[{ t: 'KALAU', mulai: T.angka2 }, { t: 'ADA', mulai: T.ada }, { t: 'TANDA', mulai: T.tanda }]} />)}
          <div style={{ position: 'absolute', left: 70, top: 236, width: 940, display: 'flex', alignItems: 'center', gap: 22 }}>
            <Pop mulai={T.bintang} damping={8} keluar={T.terbang - 0.18}>
              <span style={{ fontWeight: 800, fontSize: 230, color: emas, lineHeight: 0.8, display: 'block', height: 150 }}>*</span>
            </Pop>
            <KataMuncul mulai={T.gak} keluar={T.terbang - 0.16} gaya={{ fontWeight: 800, fontSize: 118, lineHeight: 1 }} kata={[{ t: '=', mulai: T.bintang + 0.25, warna: emas }, { t: 'tidak', mulai: T.gak }, { t: 'mendukung', mulai: T.support }]} />
          </div>
          {kiri(
            404,
            <KataMuncul
              mulai={T.resolusi}
              keluar={T.terbang - 0.12}
              gaya={{ fontWeight: 700, fontSize: 82, lineHeight: 1.05, color: putih }}
              kata={[{ t: 'resolusi', mulai: T.resolusi, isi: sorot('resolusi', T.resolusi + 0.1) }, { t: 'yang', mulai: T.yang }, { t: 'sedang', mulai: T.lagi }, { t: 'dipakai', mulai: T.pakai }]}
            />,
          )}
        </>
      ) : null}

      {/* ---------- 7: sayang banget (balik ke monitor yang sama kayak hook) ---------- */}
      {t > T.sayang - 0.1 && t < T.pas + 0.3 ? (
        <>
          {tengah(186, <KataMuncul mulai={T.sayang} rata="center" keluar={T.pas - 0.2} gaya={LABEL} kata={[{ t: 'SAYANG', mulai: T.sayang }, { t: 'SEKALI', mulai: T.banget }]} />)}
          {tengah(252, <KataMuncul mulai={T.udah7} rata="center" keluar={T.pas - 0.18} gaya={{ fontWeight: 700, fontSize: 96, lineHeight: 1 }} kata={[{ t: 'sudah', mulai: T.udah7 }, { t: 'dibeli,', mulai: T.dibeli }]} />)}
          {tengah(
            362,
            <KataMuncul
              mulai={T.dipakai}
              rata="center"
              keluar={T.pas - 0.16}
              gaya={{ fontWeight: 800, fontSize: 130, lineHeight: 1 }}
              kata={[{ t: 'dipakai', mulai: T.dipakai }, { t: 'cuma', mulai: T.cuma }, { t: '60', mulai: T.enam7, warna: koral }]}
            />,
          )}
        </>
      ) : null}

      {/* ---------- 8: pertanyaan penutup ---------- */}
      {t > T.pas - 0.1 ? (
        <>
          {tengah(186, <KataMuncul mulai={T.pas} rata="center" keluar={T.loop} gaya={LABEL} kata={[{ t: 'PAS', mulai: T.pas }, { t: 'KAMU', mulai: T.kalian }, { t: 'CEK', mulai: T.cek }, { t: 'BARUSAN', mulai: T.barusan }]} />)}
          {tengah(248, <KataMuncul mulai={T.monitor8} rata="center" keluar={T.loop + 0.03} gaya={{ fontWeight: 700, fontSize: 88, lineHeight: 1 }} kata={[{ t: 'monitor', mulai: T.monitor8 }, { t: 'kamu', mulai: T.kalian8 }, { t: 'aktif', mulai: T.kepasang }]} />)}
          {tengah(352, <KataMuncul mulai={T.berapa2} rata="center" keluar={T.loop + 0.06} gaya={{ fontWeight: 800, fontSize: 200, lineHeight: 1 }} kata={[{ t: 'berapa', mulai: T.berapa2 }, { t: 'Hz?', mulai: T.hertz3, warna: emas }]} />)}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
