// Frame hero (pembuka, tengah, puncak): 15, 853, 1422.
// contoh video explainer A3 (akun generik, konten contoh): "Sebotol air tiap 10–50 jawaban: jejak air model AI GPT-3".
// SATU DUNIA: botol 500 ml (objek utama, angka jawaban ada di label botol) melayang di atas lanskap: data center + MENARA
// PENDINGIN (kiri, air TEAL) dan PEMBANGKIT LISTRIK (kanan, air BIRU), disambung pipa dari botol. Kamera: botol (hook, sedotan
// ke gelembung AI) → makalah peneliti → mundur lebar (2 tempat) → masuk menara pendingin (air diuapin = "diminum") → gelembung
// jawaban 150–300 kata → gelas ukur 17 ml, botol dikuras 30 tegukan → gelas kebelah 15 ml biru + 2 ml teal → botol Indonesia
// (masih dibangun) dikuras barengan: habis di 25 → lebar lagi: lokasi, jam, cuaca, sumber listrik → CTA → latar kosong (loop).
// Fakta: Li, Yang, Islam, Ren, "Making AI Less 'Thirsty'" (arXiv 2304.03271 v5, 26/03/2025), Tabel 1 GPT-3. Semua angka = perkiraan.
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Bunyi, Dunia, EASE, formatAngka, GarisDigambar, Grain, maju, noise, pathLingkarTangan, pegas, Stempel, Subtitle, useDetik,
  type KunciKamera, type Kata,
} from "../../src/gerak";
import { MONO, SAIRA, SLAB, TANGAN } from "../../src/gerak/font";
import { bunyi, K } from "./raja/gaya";
import type { Kalimat } from "./raja/waktuRaja";
import { Chip, CtaSimpanFollow, kameraSeri, LatarSeri, lerp, PeneduhAtas, sorot, Sumber, TeksSeri } from "../../src/gerak/seri/data-gelap/seri";
import { waktuAir, type WaktuA } from "./air/waktuAir";

export type DataAir = { durasi: number; kata: Kata[]; kalimat?: Kalimat[] };

// warna air: umum (botol) · pendingin (teal) · pembangkit (biru)
export const AIR = { umum: '#5cc8f2', umumTua: '#2a86d6', dingin: K.teal, bangkit: '#6f8cff' };
const TANAH = 1640;
const BOTOL_Y = 1062; // dasar botol
const KERTAS = { x: 1640, y: 980 };
const CT1 = { x: 460, h: 300, b: 230 }; // menara pendingin data center
const PIPA = { x: 540, y: 1112 }; // sambungan pipa di bawah botol

// ======================================================================================================
export const ContohJejakAir: React.FC<DataAir> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuAir(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const S = T.s;
  const pelan = Easing.linear;
  const kunci: KunciKamera[] = [
    { t: 0, x: 540, y: 960, z: 1.0 },
    { t: 0.7, x: 560, y: 850, z: 1.12 },
    { t: T.keKertas, x: 566, y: 842, z: 1.16, ease: pelan },
    { t: T.keKertas + 0.85, x: KERTAS.x, y: KERTAS.y, z: 1.0 },
    { t: T.keLuas, x: KERTAS.x + 8, y: KERTAS.y + 20, z: 1.05, ease: pelan },
    { t: S[2].mulai + 0.55, x: 545, y: 1200, z: 0.76 },
    { t: T.keMenara, x: 548, y: 1204, z: 0.79, ease: pelan },
    { t: S[3].mulai + 0.75, x: CT1.x, y: 1470, z: 1.42 },
    { t: S[5].mulai - 0.3, x: CT1.x + 6, y: 1462, z: 1.5, ease: pelan },
    { t: S[5].mulai + 0.5, x: 540, y: 850, z: 1.0 },
    { t: S[6].mulai - 0.05, x: 544, y: 846, z: 1.03, ease: pelan },
    { t: S[6].mulai + 0.6, x: 560, y: 870, z: 1.0 },
    { t: S[7].mulai - 0.05, x: 564, y: 866, z: 1.03, ease: pelan },
    { t: S[7].mulai + 0.5, x: 640, y: 880, z: 1.08 },
    { t: S[8].mulai - 0.05, x: 644, y: 878, z: 1.11, ease: pelan },
    { t: S[8].mulai + 0.6, x: 560, y: 900, z: 0.95 },
    { t: S[9].mulai - 0.05, x: 562, y: 896, z: 0.98, ease: pelan },
    { t: S[9].mulai + 0.65, x: 560, y: 1400, z: 0.95 },
    { t: T.keluarDunia, x: 562, y: 1396, z: 0.98, ease: pelan },
    { t: T.simpan + 0.8, x: 540, y: 960, z: 1.0 },
    { t: T.loop, x: 540, y: 960, z: 1.02, ease: pelan },
    { t: total, x: 540, y: 960, z: 1.0 },
  ];
  const kam = kameraSeri(kunci, t, fps, total, [
    { t: 0.42, kuat: 8, lama: 0.15 },
    { t: T.diminum + 0.1, kuat: 7, lama: 0.14 },
    { t: T.kuras9[1], kuat: 5, lama: 0.12 },
  ]);
  return (
    <AbsoluteFill style={{ background: K.latar, color: K.tinta, overflow: 'hidden', fontFamily: SAIRA }}>
      <LatarSeri kam={kam} kabut={['61,219,200', '58,96,255', '92,200,242']} />
      <Dunia kamera={kam} tinggiDunia={2300} lebarDunia={2200} blurGerak={1300}>
        <Lanskap T={T} />
        <Grid50 T={T} />
        <GelembungAI T={T} />
        <GelembungKata T={T} />
        <GelasUkur T={T} />
        <BotolUtama T={T} />
        <BotolIndonesia T={T} />
        <Variasi T={T} />
        <Makalah T={T} />
      </Dunia>
      <PeneduhAtas />
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
// BOTOL 500 ml (svg, dasar di (x, y)). level 0..1; label di pita botol (HTML biar font rapi).
const PATH_BOTOL = 'M -85 0 Q -115 0 -115 -30 L -115 -360 Q -115 -410 -42 -446 L -42 -492 L 42 -492 L 42 -446 Q 115 -410 115 -360 L 115 -30 Q 115 0 85 0 Z';
const TINGGI_AIR = 440; // 500 ml = 440 px (sampai leher)

export const Botol: React.FC<{
  id: string; x: number; y?: number; level: number; skala?: number; o?: number; label: React.ReactNode; sub?: React.ReactNode; warnaAir?: [string, string];
  sedot?: number; garisPutus?: boolean; tutup?: boolean;
}> = ({ id, x, y = BOTOL_Y, level, skala = 1, o = 1, label, sub, warnaAir = [AIR.umum, AIR.umumTua], sedot = 0, garisPutus, tutup = true }) => {
  const t = useDetik();
  if (o <= 0) return null;
  const yAir = -TINGGI_AIR * Math.max(0, Math.min(1, level));
  const gel = (xx: number) => Math.sin(xx / 34 + t * 5.2 + id.length) * 5 + Math.sin(xx / 17 - t * 3.1) * 2.5;
  const titik: string[] = [];
  for (let xx = -130; xx <= 130; xx += 10) titik.push(`${xx} ${(yAir + gel(xx) * Math.min(1, level * 6)).toFixed(1)}`);
  const air = `M -130 20 L ${titik.join(' L ')} L 130 20 Z`;
  return (
    <div style={{ position: 'absolute', left: x - 160, top: y - 600, width: 320, height: 640, opacity: o, scale: String(skala), transformOrigin: '50% 93.75%' }}>
      <svg width={320} height={640} viewBox="-160 -600 320 640" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <clipPath id={`botol-${id}`}>
            <path d={PATH_BOTOL} />
          </clipPath>
          <linearGradient id={`airg-${id}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={warnaAir[1]} />
            <stop offset="1" stopColor={warnaAir[0]} />
          </linearGradient>
        </defs>
        <path d={PATH_BOTOL} fill="rgba(160,200,240,0.07)" />
        <g clipPath={`url(#botol-${id})`}>
          <path d={air} fill={`url(#airg-${id})`} opacity={0.92} />
          {/* gelembung naik */}
          {level > 0.05
            ? [0, 1, 2, 3].map((i) => {
                const f = (t * 0.35 + i / 4) % 1;
                const yy = lerp(-6, yAir + 10, f);
                return <circle key={i} cx={-70 + i * 46 + noise(`gb${id}${i}`, t) * 10} cy={yy} r={5 + (i % 2) * 3} fill="#fff" opacity={0.35 * Math.sin(Math.PI * f)} />;
              })
            : null}
          {/* sedotan disedot: denyut air naik di pinggir */}
          {sedot > 0 ? <rect x={-130} y={yAir - 4} width={260} height={8} fill="#fff" opacity={0.5 * sedot} /> : null}
        </g>
        <path d={PATH_BOTOL} fill="none" stroke="#cfe2f5" strokeWidth={6} strokeDasharray={garisPutus ? '18 12' : undefined} opacity={0.9} />
        <path d="M -88 -330 L -88 -50" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.18} />
        {tutup ? <rect x={-50} y={-540} width={100} height={48} rx={10} fill={K.teal} stroke="#cfe2f5" strokeWidth={4} /> : null}
        {tutup
          ? [-525, -508].map((yy) => <line key={yy} x1={-44} y1={yy} x2={44} y2={yy} stroke={K.latar} strokeWidth={3} opacity={0.35} />)
          : null}
      </svg>
      {/* pita label botol */}
      <div style={{ position: 'absolute', left: 160 - 117, top: 600 - 262, width: 234, height: 112, background: 'rgba(238,243,248,0.94)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: K.latar, borderTop: `6px solid ${K.teal}`, borderBottom: `6px solid ${K.teal}` }}>
        <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 58, lineHeight: 0.95, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{label}</div>
        {sub ? <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, color: '#34465f', whiteSpace: 'nowrap' }}>{sub}</div> : null}
      </div>
    </div>
  );
};

/** tangga tegukan: n tegukan dalam [a,b], tiap tegukan turun cepat (0,06 dtk) */
function tegukan(t: number, a: number, b: number, n: number) {
  if (t <= a) return 0;
  if (t >= b) return n;
  const d = (b - a) / n;
  const i = Math.floor((t - a) / d);
  return i + maju(t - a - i * d, 0, Math.min(0.06, d * 0.7), EASE.kamera);
}

// botol utama (AS): hook → S7 dikuras 30 tegukan → S8 diisi lagi → S9 dikuras barengan botol Indonesia
const BotolUtama: React.FC<{ T: WaktuA }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < 0.15) return null;
  const masuk = t < 0.42 ? maju(t, 0.15, 0.42, EASE.jatuh) : 1;
  const dLand = t - 0.42;
  const sy = dLand < 0 ? 1.05 : 1 - 0.18 * Math.exp(-dLand * 10) * Math.cos(dLand * 28);
  const geser = maju(t, S[6].mulai - 0.1, S[6].mulai + 0.6, EASE.kamera);
  const x = lerp(540, 360, geser);
  const turun = maju(t, S[9].mulai - 0.1, S[9].mulai + 0.4, EASE.keluar);
  // isi: sedotan hook (turun dikit) → penuh lagi → dikuras S7 → diisi S8 → dikuras S9 (25 jawaban dulu, terus sampai 30)
  const sedikit = 0.04 * maju(t, T.minum - 0.1, T.minum + 0.5) * (1 - maju(t, S[1].mulai, S[1].mulai + 0.5));
  const n7 = tegukan(t, T.kuras7[0], T.kuras7[1], 30);
  const isiLagi = maju(t, S[7].mulai + 0.3, S[8].mulai - 0.3, EASE.kamera);
  const [a9, b9] = T.kuras9;
  const laju = (b9 - a9) / 25;
  const n9 = tegukan(t, a9, a9 + laju * 30, 30);
  let level = 1 - sedikit;
  let jawaban: number | null = null;
  if (t >= T.kuras7[0] - 0.4 && t < S[8].mulai + 0.3) {
    jawaban = Math.round(n7 * (1 - isiLagi));
    level = 1 - (n7 / 30) * (1 - isiLagi);
  }
  if (t >= a9 - 0.6) {
    jawaban = Math.floor(n9 + 1e-6);
    level = 1 - n9 / 30;
  }
  if (isiLagi > 0.3 && t < a9 - 0.6) jawaban = null; // udah diisi lagi: balik "500 ml"
  const label = jawaban === null ? '500 ml' : `${jawaban} jwb`;
  const sembunyi = maju(t, T.keMenara - 0.1, T.keMenara + 0.4) * (1 - maju(t, T.keBotol, T.keBotol + 0.4));
  const sub = jawaban === null ? 'perkiraan' : t > S[6].mulai ? 'rata-rata AS' : '';
  const sedot = t > S[0].mulai && t < S[1].mulai ? Math.max(0, Math.sin((t - T.minum) * 9)) * maju(t, T.minum - 0.1, T.minum + 0.1) * (1 - maju(t, T.n500, T.n500 + 0.3)) : 0;
  const pop = 1 + 0.06 * Math.sin(Math.PI * maju(t, T.n500, T.n500 + 0.3, EASE.linear));
  // S10: angka "goyang" di rentang (lokasi & jam): label ganti jadi rentang 10–50
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, translate: `0 ${(-(1 - masuk) * 500 - turun * 200).toFixed(1)}px`, opacity: (1 - turun) * (1 - sembunyi) * Math.min(1, masuk * 3) }}>
      <div style={{ position: 'absolute', left: 0, top: 0, scale: `${(1 / Math.sqrt(sy)).toFixed(3)} ${sy.toFixed(3)}`, transformOrigin: `${x}px ${BOTOL_Y}px` }}>
        <Botol id="as" x={x} level={level} label={label} sub={sub} sedot={sedot} skala={pop} tutup={t > S[1].mulai + 0.5} />
      </div>
      <Chip x={x} y={BOTOL_Y + 46} teks="AMERIKA SERIKAT" warna={K.teal} o={maju(t, S[8].mulai + 0.3, S[8].mulai + 0.6) * (1 - turun)} ukuran={28} />
      {/* tanda 30 jawaban habis (S7) */}
      {t > T.kuras7[1] - 0.05 && t < S[7].mulai + 0.4 ? (
        <div style={{ position: 'absolute', left: x, top: BOTOL_Y - 300, translate: '-50% -50%', scale: String(pegas(t, T.kuras7[1] - 0.05, fps, { damping: 10, stiffness: 220, mass: 0.6 })), opacity: 1 - maju(t, S[7].mulai, S[7].mulai + 0.4) }}>
          <div style={{ padding: '4px 18px', borderRadius: 14, background: K.kuning, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 52, whiteSpace: 'nowrap', rotate: '-4deg' }}>habis!</div>
        </div>
      ) : null}
    </div>
  );
};

// botol Indonesia (S9–S10): pinggir putus-putus + derek = data center masih dibangun (Juli 2023), angka proyeksi
const BotolIndonesia: React.FC<{ T: WaktuA }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[8].mulai - 0.1 || t > S[9].mulai + 0.5) return null;
  const masuk = pegas(t, S[8].mulai + 0.05, fps, { damping: 12, stiffness: 170, mass: 0.7 });
  const turun = maju(t, S[9].mulai - 0.1, S[9].mulai + 0.4, EASE.keluar);
  const [a9, b9] = T.kuras9;
  const n = tegukan(t, a9, b9, 25);
  const X = 770;
  const habis = t > b9 - 0.03;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, translate: `0 ${(-turun * 200).toFixed(1)}px`, opacity: 1 - turun }}>
      <Botol id="id" x={X} level={1 - n / 25} skala={Math.max(0.001, masuk)} label={t >= a9 - 0.6 ? `${Math.floor(n + 1e-6)} jwb` : '500 ml'} sub="proyeksi" garisPutus warnaAir={['#7ad7f5', '#3a8fdc']} />
      {/* derek konstruksi (digambar) + label */}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d={`M ${X + 150} ${BOTOL_Y} L ${X + 150} ${BOTOL_Y - 470} L ${X + 60} ${BOTOL_Y - 470} M ${X + 150} ${BOTOL_Y - 470} L ${X + 230} ${BOTOL_Y - 470} M ${X + 150} ${BOTOL_Y - 470} L ${X + 190} ${BOTOL_Y - 520} L ${X + 230} ${BOTOL_Y - 470}`} mulai={T.dibangun - 0.2} lama={0.45} warna={K.kuning} tebal={6} />
        {Array.from({ length: 6 }, (_, i) => (
          <GarisDigambar key={i} d={`M ${X + 140} ${BOTOL_Y - i * 78} L ${X + 160} ${BOTOL_Y - i * 78 - 78}`} mulai={T.dibangun - 0.1 + i * 0.04} lama={0.1} warna={K.kuning} tebal={4} />
        ))}
        <GarisDigambar d={`M ${X + 70} ${BOTOL_Y - 470} L ${X + 70} ${BOTOL_Y - 440 + Math.sin(t * 2.4) * 8}`} mulai={T.dibangun + 0.3} lama={0.12} warna={K.abu} tebal={3} />
      </svg>
      <Chip x={X} y={BOTOL_Y + 46} teks="INDONESIA*" warna={K.kuning} o={maju(t, T.indonesia - 0.1, T.indonesia + 0.15)} isi ukuran={30} />
      <div style={{ position: 'absolute', left: X, top: BOTOL_Y + 84, translate: '-50% 0', fontFamily: MONO, fontWeight: 600, fontSize: 22, color: K.kuning, whiteSpace: 'nowrap', opacity: maju(t, T.juli - 0.1, T.juli + 0.2) }}>
        * masih dibangun Juli 2023
      </div>
      {habis && t < S[9].mulai + 0.4 ? (
        <div style={{ position: 'absolute', left: X, top: BOTOL_Y - 300, translate: '-50% -50%', scale: String(pegas(t, b9 - 0.03, fps, { damping: 10, stiffness: 220, mass: 0.6 })), opacity: 1 - maju(t, S[9].mulai, S[9].mulai + 0.4) }}>
          <div style={{ padding: '4px 18px', borderRadius: 14, background: K.kuning, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 52, whiteSpace: 'nowrap', rotate: '4deg' }}>habis di 25</div>
        </div>
      ) : null}
    </div>
  );
};

// ======================================================================================================
// HOOK: sedotan dari botol ke gelembung "AI" (minum) + grid 50 jawaban (10 padat, sisanya garis = rentang)
const GelembungAI: React.FC<{ T: WaktuA }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < 0.3 || t > S[1].mulai + 0.8) return null;
  const p = pegas(t, 0.45, fps, { damping: 11, stiffness: 200, mass: 0.6 });
  const o = 1 - maju(t, S[1].mulai - 0.1, S[1].mulai + 0.3);
  const sedotan = 'M 560 660 L 560 500 Q 560 470 590 470 L 708 470';
  // denyut air naik di sedotan
  const fase = (t - T.minum) * 2.2;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d={sedotan} mulai={0.4} lama={0.25} warna="#e9eef5" tebal={16} />
        <GarisDigambar d={sedotan} mulai={0.4} lama={0.25} warna={K.latar2} tebal={8} />
        {t > T.minum - 0.1 ? <path d={sedotan} fill="none" stroke={AIR.umum} strokeWidth={8} strokeDasharray="40 260" strokeDashoffset={-((fase * 300) % 300)} strokeLinecap="round" /> : null}
      </svg>
      <div style={{ position: 'absolute', left: 800, top: 480, translate: '-50% -50%', scale: String(p) }}>
        <div style={{ position: 'relative', padding: '14px 30px', borderRadius: 26, background: 'rgba(13,23,48,0.96)', border: `5px solid ${K.kuning}`, fontFamily: SAIRA, fontWeight: 800, fontSize: 64, color: K.kuning, lineHeight: 1 }}>
          AI
          <div style={{ position: 'absolute', left: 18, bottom: -22, width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: `22px solid ${K.kuning}` }} />
        </div>
      </div>
      {t > T.minum - 0.05 ? (
        <div style={{ position: 'absolute', left: 820, top: 610, translate: '-50% -50%', fontFamily: TANGAN, fontWeight: 700, fontSize: 46, color: K.kuning, rotate: '-6deg', opacity: maju(t, T.minum - 0.05, T.minum + 0.2) * o }}>&ldquo;minum&rdquo;</div>
      ) : null}
    </div>
  );
};

const Grid50: React.FC<{ T: WaktuA }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < T.n10 - 0.4 || t > S[1].mulai + 0.8) return null;
  const o = maju(t, T.n10 - 0.4, T.n10 - 0.1) * (1 - maju(t, S[1].mulai - 0.1, S[1].mulai + 0.3));
  const X = 96;
  const Y = 590;
  const CW = 54;
  const CH = 40;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      {Array.from({ length: 50 }, (_, i) => {
        const c = i % 5;
        const r = Math.floor(i / 5);
        const padat = i < 10;
        const m = padat ? T.n10 - 0.05 + i * 0.03 : T.n50 - 0.1 + (i - 10) * 0.012;
        const pp = maju(t, m, m + 0.12);
        return (
          <svg key={i} width={44} height={34} viewBox="-22 -17 44 34" style={{ position: 'absolute', left: X + c * CW, top: Y + r * CH, opacity: pp, scale: String(0.6 + 0.4 * pp) }}>
            <path d="M -18 -13 H 18 Q 20 -13 20 -11 V 6 Q 20 8 18 8 H -4 L -12 15 V 8 H -18 Q -20 8 -20 6 V -11 Q -20 -13 -18 -13 Z" fill={padat ? K.kuning : 'none'} stroke={padat ? K.kuning : K.teal} strokeWidth={3} />
          </svg>
        );
      })}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d={`M ${X + 5 * CW + 8} ${Y + 4} L ${X + 5 * CW + 22} ${Y + 4} L ${X + 5 * CW + 22} ${Y + 2 * CH - 6} L ${X + 5 * CW + 8} ${Y + 2 * CH - 6}`} mulai={T.n10 + 0.25} lama={0.18} warna={K.kuning} tebal={5} />
        <GarisDigambar d={`M ${X + 5 * CW + 8} ${Y + 2 * CH + 4} L ${X + 5 * CW + 22} ${Y + 2 * CH + 4} L ${X + 5 * CW + 22} ${Y + 10 * CH - 6} L ${X + 5 * CW + 8} ${Y + 10 * CH - 6}`} mulai={T.n50 + 0.4} lama={0.25} warna={K.teal} tebal={5} />
      </svg>
      <div style={{ position: 'absolute', left: X + 5 * CW + 32, top: Y + CH - 26, fontFamily: SAIRA, fontWeight: 800, fontSize: 52, color: K.kuning, opacity: maju(t, T.n10 + 0.3, T.n10 + 0.5) }}>10</div>
      <div style={{ position: 'absolute', left: X + 5 * CW + 32, top: Y + 6 * CH - 26, fontFamily: SAIRA, fontWeight: 800, fontSize: 52, color: K.teal, opacity: maju(t, T.n50 + 0.5, T.n50 + 0.7) }}>50</div>
      <div style={{ position: 'absolute', left: X, top: Y + 10 * CH + 10, fontFamily: MONO, fontWeight: 600, fontSize: 22, color: K.abu, opacity: maju(t, T.n50 + 0.6, T.n50 + 0.9), whiteSpace: 'nowrap' }}>tergantung kapan & di mana</div>
    </div>
  );
};

// ======================================================================================================
// MAKALAH (S2): kartu makalah + 2 kampus + GPT-3 di data center Microsoft
const Makalah: React.FC<{ T: WaktuA }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < T.keKertas - 0.2 || t > S[2].mulai + 0.6) return null;
  const masuk = maju(t, T.keKertas, T.keKertas + 0.9, EASE.masuk);
  const W = 640;
  const kampus = (teks: string, m: number, i: number) => {
    const p = pegas(t, m, fps, { damping: 11, stiffness: 210, mass: 0.6 });
    return t < m ? null : (
      <div style={{ position: 'absolute', left: 40 + i * 290, top: 400, scale: String(p), transformOrigin: '0 50%', padding: '6px 16px', borderRadius: 10, background: '#0b1a33', color: '#fff', fontFamily: MONO, fontWeight: 800, fontSize: 28, whiteSpace: 'nowrap' }}>{teks}</div>
    );
  };
  const gp = pegas(t, T.gpt3 - 0.05, fps, { damping: 11, stiffness: 210, mass: 0.6 });
  const ms = pegas(t, T.microsoft2 - 0.3, fps, { damping: 11, stiffness: 210, mass: 0.6 });
  return (
    <div style={{ position: 'absolute', left: KERTAS.x - W / 2, top: KERTAS.y - 380 + (1 - masuk) * 120, width: W, height: 760, rotate: `${lerp(-6, -2, masuk) + noise('mk', t * 0.4) * 0.6}deg`, opacity: Math.min(1, masuk * 2), borderRadius: 10, background: '#eef2f7', boxShadow: '0 40px 90px rgba(0,0,0,0.6)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 40, top: 34, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: '#44556e' }}>arXiv 2304.03271 · v5 (2025)</div>
      <div style={{ position: 'absolute', right: 30, top: 34, fontFamily: MONO, fontWeight: 500, fontSize: 18, color: '#7b8aa0' }}>ilustrasi halaman</div>
      <div style={{ position: 'absolute', left: 40, top: 84, width: W - 80, fontFamily: SLAB, fontWeight: 900, fontSize: 56, lineHeight: 1.08, color: '#0b1a33' }}>Making AI Less &ldquo;Thirsty&rdquo;</div>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d="M 40 226 L 560 222" mulai={T.keKertas + 0.7} lama={0.4} warna={K.tealTua} tebal={8} />
      </svg>
      <div style={{ position: 'absolute', left: 40, top: 250, fontFamily: MONO, fontWeight: 600, fontSize: 24, color: '#44556e', lineHeight: 1.35 }}>
        Pengfei Li · Jianyi Yang
        <br />
        Mohammad A. Islam · Shaolei Ren
      </div>
      <div style={{ position: 'absolute', left: 40, top: 356, fontFamily: MONO, fontWeight: 700, fontSize: 21, color: '#7b8aa0', opacity: maju(t, T.peneliti, T.peneliti + 0.2) }}>PENELITI DARI</div>
      {kampus('UC Riverside', T.uc - 0.05, 0)}
      {kampus('UT Arlington', T.ut - 0.05, 1)}
      {[480, 510].map((y, i) => (
        <div key={i} style={{ position: 'absolute', left: 40, top: y, width: [520, 440][i], height: 14, borderRadius: 7, background: '#c9d3e0' }} />
      ))}
      {t > T.gpt3 - 0.05 ? (
        <div style={{ position: 'absolute', left: 40, top: 560, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ scale: String(gp), padding: '8px 20px', borderRadius: 12, border: `4px solid ${K.tealTua}`, color: '#0b1a33', fontFamily: SAIRA, fontWeight: 800, fontSize: 48 }}>GPT-3</div>
          {t > T.microsoft2 - 0.3 ? (
            <div style={{ scale: String(ms), transformOrigin: '0 50%', display: 'flex', alignItems: 'center', gap: 12, padding: '8px 18px', borderRadius: 12, background: '#0b1a33', color: '#fff', fontFamily: SAIRA, fontWeight: 800, fontSize: 40, whiteSpace: 'nowrap' }}>
              <svg width={40} height={40} viewBox="0 0 40 40">
                <rect x={4} y={4} width={32} height={32} rx={4} fill="none" stroke="#fff" strokeWidth={3} />
                {[12, 20, 28].map((y) => (
                  <line key={y} x1={9} y1={y} x2={31} y2={y} stroke="#fff" strokeWidth={3} />
                ))}
              </svg>
              data center Microsoft
            </div>
          ) : null}
        </div>
      ) : null}
      {[660, 690].map((y, i) => (
        <div key={i} style={{ position: 'absolute', left: 40, top: y, width: [500, 360][i], height: 14, borderRadius: 7, background: '#c9d3e0' }} />
      ))}
    </div>
  );
};

// ======================================================================================================
// LANSKAP (S3–S5 & S10): data center + menara pendingin (kiri), pembangkit + menara + cerobong (kanan), pipa dari botol,
// kabel listrik pembangkit → data center. Pipa kiri TEAL (pendingin), kanan BIRU (pembangkit).
const pathMenara = (cx: number, alas: number, h: number, b: number) => {
  const atas = alas - h;
  const pin = b * 0.32;
  const top = b * 0.36;
  return `M ${cx - b / 2} ${alas} Q ${cx - pin} ${alas - h * 0.55} ${cx - top} ${atas} L ${cx + top} ${atas} Q ${cx + pin} ${alas - h * 0.55} ${cx + b / 2} ${alas} Z`;
};
const PIPA_KIRI = `M ${PIPA.x} ${PIPA.y} L ${PIPA.x} 1215 Q ${PIPA.x} 1245 ${PIPA.x - 30} 1250 L ${CT1.x + 40} 1270 Q ${CT1.x} 1278 ${CT1.x} 1310 L ${CT1.x} ${TANAH - CT1.h + 10}`;
const PIPA_KANAN = `M ${PIPA.x} 1215 Q ${PIPA.x} 1245 ${PIPA.x + 30} 1250 L 720 1290 Q 745 1296 745 1330 L 745 1498`;

const Uap: React.FC<{ cx: number; y: number; kuat: number; seed: string; lebar?: number }> = ({ cx, y, kuat, seed, lebar = 1 }) => {
  const t = useDetik();
  if (kuat <= 0) return null;
  return (
    <>
      {Array.from({ length: 7 }, (_, i) => {
        const f = (t * 0.32 + i / 7) % 1;
        const r = (36 + f * 70) * lebar;
        return (
          <div key={i} style={{ position: 'absolute', left: cx + noise(`${seed}${i}`, t * 0.5 + i) * 30 * lebar - r + f * 30, top: y - f * 220 - r, width: 2 * r, height: 2 * r, borderRadius: '50%', background: 'radial-gradient(circle, rgba(226,240,250,0.55) 0%, rgba(226,240,250,0) 70%)', opacity: kuat * Math.sin(Math.PI * Math.min(1, f * 1.2)) }} />
        );
      })}
    </>
  );
};

const Lanskap: React.FC<{ T: WaktuA }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const ada = (t > T.keLuas - 0.2 && t < S[5].mulai + 0.8) || (t > S[9].mulai - 0.2 && t < T.keluarDunia + 0.6);
  if (!ada) return null;
  const o = Math.max(maju(t, T.keLuas - 0.2, T.keLuas + 0.2) * (1 - maju(t, S[5].mulai + 0.2, S[5].mulai + 0.7)), maju(t, S[9].mulai - 0.2, S[9].mulai + 0.3)) * (1 - maju(t, T.keluarDunia, T.keluarDunia + 0.4));
  const uap1 = maju(t, T.diuapin - 0.3, T.diuapin + 0.3) * 1.0 + 0.35;
  const panasO = maju(t, T.panas - 0.15, T.panas + 0.2) * (1 - maju(t, S[4].mulai - 0.1, S[4].mulai + 0.3));
  const pin = (n: string, teks: string, x: number, y: number, m: number, warna: string) => {
    const p = pegas(t, m, fps, { damping: 11, stiffness: 210, mass: 0.6 });
    return t < m ? null : (
      <div style={{ position: 'absolute', left: x, top: y, translate: '-50% -100%', scale: String(p), transformOrigin: '50% 100%', display: 'flex', alignItems: 'center', gap: 10, padding: '6px 18px 6px 8px', borderRadius: 30, background: 'rgba(13,23,48,0.96)', border: `4px solid ${warna}`, whiteSpace: 'nowrap' }}>
        <div style={{ width: 56, height: 56, borderRadius: 28, background: warna, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 42, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</div>
        <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 58, color: warna }}>{teks}</span>
      </div>
    );
  };
  // tetes air jalan di pipa (pakai offset dash)
  const alir = (d: string, warna: string, m: number) => (
    <>
      <GarisDigambar d={d} mulai={m} lama={0.45} warna="#22324f" tebal={22} />
      <GarisDigambar d={d} mulai={m} lama={0.45} warna={warna} tebal={8} opacity={0.35} />
      {t > m + 0.45 ? <path d={d} fill="none" stroke={warna} strokeWidth={12} strokeLinecap="round" strokeDasharray="16 44" strokeDashoffset={-(t * 90) % 60} /> : null}
    </>
  );
  const listrik = `M 660 1470 Q 500 1430 330 1468`;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      {/* tanah */}
      <div style={{ position: 'absolute', left: 40, top: TANAH, width: 1000, height: 8, borderRadius: 4, background: K.garis }} />
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        {alir(`M ${PIPA.x} ${BOTOL_Y} L ${PIPA.x} ${PIPA.y}`, AIR.umum, T.keLuas + 0.1)}
        {alir(PIPA_KIRI, AIR.dingin, T.keLuas + 0.35)}
        {alir(PIPA_KANAN, AIR.bangkit, T.keLuas + 0.35)}
        {/* kabel listrik pembangkit → data center */}
        <GarisDigambar d={listrik} mulai={T.listriknya3 - 0.2} lama={0.4} warna={K.kuning} tebal={5} />
        {t > T.listriknya3 + 0.2 ? (
          <path d={listrik} fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" strokeDasharray="10 70" strokeDashoffset={(t * 160) % 80} opacity={0.8} />
        ) : null}
      </svg>
      {/* data center */}
      <div style={{ position: 'absolute', left: 70, top: TANAH - 190, width: 270, height: 190, borderRadius: '10px 10px 0 0', background: '#13213f', border: `4px solid ${K.garis}` }}>
        {Array.from({ length: 3 }, (_, r) => (
          <div key={r} style={{ position: 'absolute', left: 16 + r * 84, top: 20, width: 72, height: 150, borderRadius: 6, border: `3px solid #2c4268` }}>
            {Array.from({ length: 6 }, (_, j) => (
              <div key={j} style={{ position: 'absolute', left: 8, top: 10 + j * 23, width: 54, height: 12, borderRadius: 3, background: '#1b2c4e' }}>
                <div style={{ position: 'absolute', right: 4, top: 3, width: 6, height: 6, borderRadius: 3, background: noise(`dc${r}${j}`, t * 3) > 0 ? K.teal : '#2c4268' }} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 205, top: TANAH + 18, translate: '-50% 0', fontFamily: MONO, fontWeight: 800, fontSize: 24, color: K.abu, whiteSpace: 'nowrap' }}>DATA CENTER</div>
      {/* menara pendingin data center */}
      <Uap cx={CT1.x} y={TANAH - CT1.h} kuat={uap1} seed="ct1" lebar={1.15} />
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <path d={pathMenara(CT1.x, TANAH, CT1.h, CT1.b)} fill="#1a2b4c" stroke="#9fb3cc" strokeWidth={5} />
        {/* tetes air jatuh di dalam menara (diuapin sebagian) */}
        {t > T.air4 - 0.3 && t < S[5].mulai + 0.6
          ? Array.from({ length: 9 }, (_, i) => {
              const f = (t * 1.3 + i / 9) % 1;
              return <circle key={i} cx={CT1.x - 50 + (i % 5) * 25} cy={TANAH - CT1.h + 40 + f * (CT1.h - 70)} r={6} fill={AIR.dingin} opacity={0.9 * maju(t, T.air4 - 0.3, T.air4) * (1 - f * 0.6)} />;
            })
          : null}
        {/* panas server (merah bergelombang) masuk menara */}
        {panasO > 0
          ? [0, 1, 2].map((i) => {
              const y = TANAH - 60 - i * 40;
              const g = (t * 3 + i) % 1;
              return (
                <path key={i} d={`M ${340} ${y} q 15 -14 30 0 t 30 0 t 30 0`} fill="none" stroke={K.merah} strokeWidth={6} strokeLinecap="round" opacity={panasO * (0.6 + 0.4 * Math.sin(g * Math.PI * 2))} transform={`translate(${(g * 10).toFixed(1)} 0)`} />
              );
            })
          : null}
      </svg>
      {panasO > 0 ? <div style={{ position: 'absolute', left: 355, top: TANAH - 200, fontFamily: MONO, fontWeight: 800, fontSize: 24, color: K.merah, opacity: panasO, whiteSpace: 'nowrap' }}>panas server</div> : null}
      {/* pembangkit listrik */}
      <Uap cx={930} y={TANAH - 240} kuat={0.55} seed="ct2" lebar={0.9} />
      <Uap cx={680} y={TANAH - 330} kuat={0.35} seed="cb" lebar={0.6} />
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <rect x={660} y={TANAH - 330} width={40} height={190} fill="#1a2b4c" stroke="#9fb3cc" strokeWidth={5} />
        <path d={`M 640 ${TANAH} L 640 ${TANAH - 140} L 700 ${TANAH - 175} L 700 ${TANAH - 140} L 760 ${TANAH - 175} L 760 ${TANAH - 140} L 840 ${TANAH - 140} L 840 ${TANAH} Z`} fill="#1a2b4c" stroke="#9fb3cc" strokeWidth={5} strokeLinejoin="round" />
        <path d={`M 770 ${TANAH - 95} l -14 30 h 16 l -10 28`} fill="none" stroke={K.kuning} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <path d={pathMenara(930, TANAH, 240, 170)} fill="#1a2b4c" stroke="#9fb3cc" strokeWidth={5} />
      </svg>
      <div style={{ position: 'absolute', left: 780, top: TANAH + 18, translate: '-50% 0', fontFamily: MONO, fontWeight: 800, fontSize: 24, color: K.abu, whiteSpace: 'nowrap' }}>PEMBANGKIT LISTRIK</div>
      <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - maju(t, T.keMenara - 0.1, T.keMenara + 0.3) }}>
        {t < T.keMenara + 0.4 ? pin('1', 'pendingin', CT1.x - 90, 1215, T.dinginin - 0.05, AIR.dingin) : null}
        {t < T.keMenara + 0.4 ? pin('2', 'pembangkit', 790, 1330, T.pembangkit3 - 0.05, AIR.bangkit) : null}
      </div>
      {/* S4–S5: label uap + lingkaran "diminum" */}
      {t > T.diuapin - 0.1 && t < S[5].mulai + 0.5 ? (
        <div style={{ position: 'absolute', left: CT1.x - 70, top: TANAH - CT1.h - 120, translate: '-100% 0', fontFamily: TANGAN, fontWeight: 700, fontSize: 44, color: '#e2f0fa', opacity: maju(t, T.diuapin - 0.1, T.diuapin + 0.2) * (1 - maju(t, S[5].mulai, S[5].mulai + 0.4)), whiteSpace: 'nowrap', rotate: '-5deg' }}>
          uap air ↑
        </div>
      ) : null}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - maju(t, S[5].mulai, S[5].mulai + 0.4) }} width={1} height={1}>
        <GarisDigambar d={pathLingkarTangan(CT1.x + 10, TANAH - CT1.h - 100, 180, 112, 'uap')} mulai={T.menguap} lama={0.35} warna={K.kuning} tebal={8} />
      </svg>
      {t > T.diminum - 0.1 && t < S[5].mulai + 0.5 ? (
        <Stempel mulai={T.diminum - 0.05} rot={-6} gaya={{ position: 'absolute', left: CT1.x - 190, top: TANAH - 175, padding: '4px 20px', borderRadius: 14, border: `6px solid ${K.kuning}`, background: 'rgba(7,12,24,0.85)', fontFamily: SAIRA, fontWeight: 800, fontSize: 64, color: K.kuning, whiteSpace: 'nowrap' }} keluar={S[5].mulai}>
          = &ldquo;diminum&rdquo;
        </Stempel>
      ) : null}
      {/* S10: cuaca di atas menara, sumber listrik di pembangkit */}
      <Variasi2 T={T} />
    </div>
  );
};

// ikon S10 yang nempel di lanskap
const Variasi2: React.FC<{ T: WaktuA }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < T.cuaca - 0.2) return null;
  const pc = pegas(t, T.cuaca - 0.1, fps, { damping: 11, stiffness: 200, mass: 0.6 });
  const ps = pegas(t, T.sumber - 0.1, fps, { damping: 11, stiffness: 200, mass: 0.6 });
  const ganti = Math.floor((t - T.sumber) * 2.2) % 3;
  return (
    <>
      <div style={{ position: 'absolute', left: CT1.x - 140, top: TANAH - CT1.h - 240, scale: String(pc), display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width={120} height={90} viewBox="-60 -45 120 90">
          <g transform={`rotate(${(t * 40) % 360} -18 -10)`}>
            <circle cx={-18} cy={-10} r={20} fill={K.kuning} />
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return <line key={i} x1={-18 + Math.cos(a) * 27} y1={-10 + Math.sin(a) * 27} x2={-18 + Math.cos(a) * 36} y2={-10 + Math.sin(a) * 36} stroke={K.kuning} strokeWidth={5} strokeLinecap="round" />;
            })}
          </g>
          <path d={`M -10 30 Q -10 8 12 8 Q 18 -8 34 -2 Q 52 -2 52 16 Q 60 20 56 30 Z`} fill="#dfe8f3" transform={`translate(${noise('awan', t * 0.6) * 8} 0)`} />
        </svg>
        <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 46, color: K.tinta }}>cuaca</span>
      </div>
      {t > T.sumber - 0.1 ? (
        <div style={{ position: 'absolute', left: 820, top: TANAH - 420, translate: '-50% 0', scale: String(ps), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 62, height: 62, borderRadius: 14, border: `4px solid ${i === ganti ? K.kuning : K.garis}`, background: 'rgba(13,23,48,0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, color: i === ganti ? K.kuning : K.abu, fontFamily: SAIRA, fontWeight: 800 }}>
                {i === 0 ? <IkonApi on={i === ganti} /> : i === 1 ? <IkonMatahari on={i === ganti} /> : <IkonAngin on={i === ganti} t={t} />}
              </div>
            ))}
          </div>
          <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 44, color: K.tinta, whiteSpace: 'nowrap' }}>sumber listrik</span>
        </div>
      ) : null}
    </>
  );
};
const IkonApi: React.FC<{ on: boolean }> = ({ on }) => (
  <svg width={40} height={40} viewBox="-20 -20 40 40">
    <path d="M 0 -16 Q 12 -4 10 6 Q 8 16 0 16 Q -8 16 -10 6 Q -11 -2 -4 -8 Q -2 0 2 0 Q 4 -8 0 -16 Z" fill={on ? K.merah : 'none'} stroke={on ? K.merah : K.abu} strokeWidth={3} strokeLinejoin="round" />
  </svg>
);
const IkonMatahari: React.FC<{ on: boolean }> = ({ on }) => (
  <svg width={40} height={40} viewBox="-20 -20 40 40">
    <rect x={-16} y={-6} width={32} height={18} rx={2} fill={on ? K.kuning : 'none'} stroke={on ? K.kuning : K.abu} strokeWidth={3} transform="skewX(-12)" />
    <line x1={-6} y1={-6} x2={-9} y2={12} stroke={K.latar} strokeWidth={2} />
    <line x1={5} y1={-6} x2={2} y2={12} stroke={K.latar} strokeWidth={2} />
    <line x1={0} y1={12} x2={0} y2={18} stroke={on ? K.kuning : K.abu} strokeWidth={3} />
  </svg>
);
const IkonAngin: React.FC<{ on: boolean; t: number }> = ({ on, t }) => (
  <svg width={40} height={40} viewBox="-20 -20 40 40">
    <line x1={0} y1={-2} x2={0} y2={18} stroke={on ? K.teal : K.abu} strokeWidth={3} />
    <g transform={`rotate(${(t * 200) % 360} 0 -4)`}>
      {[0, 120, 240].map((a) => (
        <path key={a} d="M 0 -4 L 3 -18 L -2 -18 Z" fill={on ? K.teal : K.abu} transform={`rotate(${a} 0 -4)`} />
      ))}
    </g>
  </svg>
);

// ======================================================================================================
// S6: gelembung jawaban, baris nambah ngikut hitungan kata 0 → 150 → 300
const GelembungKata: React.FC<{ T: WaktuA }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[5].mulai - 0.2 || t > S[6].mulai + 0.6) return null;
  const o = maju(t, S[5].mulai - 0.2, S[5].mulai + 0.15) * (1 - maju(t, S[6].mulai, S[6].mulai + 0.4));
  const kata = 150 * maju(t, T.panjangnya - 0.1, T.n150 + 0.3, EASE.kamera) + 150 * maju(t, T.n300 - 0.25, T.n300 + 0.35, EASE.kamera);
  const nBaris = Math.ceil(kata / 30);
  const B = { x: 84, y: 520, w: 320 };
  const tinggi = 120 + nBaris * 30;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      <div style={{ position: 'absolute', left: B.x, top: B.y, width: B.w, height: tinggi, borderRadius: 24, background: 'rgba(13,23,48,0.96)', border: `4px solid ${K.kuning}` }}>
        <div style={{ position: 'absolute', left: 20, top: 14, fontFamily: MONO, fontWeight: 800, fontSize: 22, color: K.kuning }}>1 JAWABAN</div>
        {Array.from({ length: nBaris }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: 22, top: 56 + i * 30, width: i === nBaris - 1 ? 60 + ((kata % 30) / 30) * 220 : [282, 260, 286, 240, 276, 254, 284, 232, 270, 250][i % 10], height: 14, borderRadius: 7, background: '#6d7fa0' }} />
        ))}
        <div style={{ position: 'absolute', left: 20, bottom: 14, display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 58, color: K.tinta, fontVariantNumeric: 'tabular-nums' }}>{formatAngka(kata)}</span>
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: K.abu }}>kata</span>
        </div>
      </div>
      {/* penanda 150 & 300 di samping gelembung */}
      {[
        { n: 150, m: T.n150 + 0.3 },
        { n: 300, m: T.n300 + 0.35 },
      ].map((p, i) => {
        if (t < p.m) return null;
        const y = B.y + 56 + (p.n / 30) * 30 - 8;
        return (
          <div key={i} style={{ position: 'absolute', left: B.x + B.w - 18, top: y, translate: '-100% -50%', padding: '0 12px', borderRadius: 10, background: K.kuning, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 40, opacity: maju(t, p.m, p.m + 0.15), scale: String(0.8 + 0.2 * maju(t, p.m, p.m + 0.15)) }}>
            ← {p.n}
          </div>
        );
      })}
    </div>
  );
};

// ======================================================================================================
// S7–S8: gelas ukur 0–20 ml. S7 diisi 17 ml (1 jawaban), S8 kebelah: 15 ml pembangkit (biru) + 2 ml pendingin (teal)
const GelasUkur: React.FC<{ T: WaktuA }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[6].mulai - 0.1 || t > S[8].mulai + 0.6) return null;
  const masuk = pegas(t, S[6].mulai + 0.2, fps, { damping: 12, stiffness: 180, mass: 0.6 });
  const o = 1 - maju(t, S[8].mulai, S[8].mulai + 0.45);
  const X = 660;
  const ALAS = BOTOL_Y;
  const PXML = 19;
  const ml = 17 * maju(t, T.n17 - 0.6, T.n17 + 0.4, EASE.kamera);
  const belah = maju(t, T.n15 - 0.2, T.n15 + 0.3, EASE.kamera);
  const angkat = 26 * maju(t, T.n2 - 0.25, T.n2 + 0.15, EASE.kamera); // lapisan 2 ml diangkat dikit biar keliatan
  const W = 140;
  const H = 20 * PXML + 20;
  const h15 = Math.min(ml, 15) * PXML;
  const h2 = Math.max(0, ml - 15) * PXML;
  const lab = (teks: string, nilai: string, y: number, warna: string, m: number) =>
    t < m ? null : (
      <div style={{ position: 'absolute', left: X + W / 2 + 64, top: y, translate: '0 -50%', opacity: maju(t, m, m + 0.2), display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 70, color: warna, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{nilai}</span>
        <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 40, color: K.tinta, whiteSpace: 'nowrap' }}>{teks}</span>
      </div>
    );
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      <div style={{ position: 'absolute', left: X - W / 2, top: ALAS - H, width: W, height: H, scale: String(Math.max(0.001, masuk)), transformOrigin: '50% 100%' }}>
        {/* isi */}
        <div style={{ position: 'absolute', left: 6, right: 6, bottom: 6, height: h15, background: belah > 0 ? `linear-gradient(0deg, ${AIR.umumTua}, ${AIR.umum})` : `linear-gradient(0deg, ${AIR.umumTua}, ${AIR.umum})`, borderRadius: '0 0 14px 14px' }}>
          <div style={{ position: 'absolute', inset: 0, background: AIR.bangkit, opacity: belah, borderRadius: '0 0 14px 14px' }} />
        </div>
        {h2 > 0 ? (
          <div style={{ position: 'absolute', left: 6, right: 6, bottom: 6 + h15 + angkat, height: h2, background: AIR.umum }}>
            <div style={{ position: 'absolute', inset: 0, background: AIR.dingin, opacity: belah }} />
          </div>
        ) : null}
        {/* kaca + skala */}
        <div style={{ position: 'absolute', inset: 0, border: '6px solid #cfe2f5', borderTop: 'none', borderRadius: '0 0 20px 20px' }} />
        {Array.from({ length: 21 }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: 6, top: H - 6 - i * PXML, width: i % 5 === 0 ? 40 : 20, height: 3, background: '#cfe2f5', opacity: 0.8 }} />
        ))}
        {[0, 5, 10, 15, 20].map((v) => (
          <div key={v} style={{ position: 'absolute', left: -46, top: H - 6 - v * PXML - 14, width: 36, textAlign: 'right', fontFamily: MONO, fontWeight: 700, fontSize: 22, color: K.abu }}>{v}</div>
        ))}
        <div style={{ position: 'absolute', left: -6, top: -40, width: W + 12, textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 22, color: K.abu }}>ml</div>
      </div>
      {/* angka: 17 ml (S7) → 15 + 2 (S8) */}
      {belah < 0.5
        ? lab('per jawaban', `±${formatAngka(Math.round(ml))} ml`, ALAS - 17 * PXML / 2 - 20, K.kuning, T.n17 - 0.6)
        : null}
      {belah >= 0.5 ? lab('pembangkit', '±15 ml', ALAS - 6 - 7.5 * PXML, AIR.bangkit, T.n15 - 0.2) : null}
      {belah >= 0.5 ? lab('pendingin', '±2 ml', ALAS - 6 - 16 * PXML - 70, AIR.dingin, T.n2 - 0.1) : null}
      {belah >= 0.5 ? (
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
          <GarisDigambar d={`M ${X + W / 2 + 6} ${ALAS - 6 - 7.5 * PXML} L ${X + W / 2 + 54} ${ALAS - 6 - 7.5 * PXML}`} mulai={T.n15} lama={0.12} warna={AIR.bangkit} tebal={5} />
          <GarisDigambar d={`M ${X + W / 2 + 6} ${ALAS - 6 - 16 * PXML - angkat} L ${X + W / 2 + 54} ${ALAS - 6 - 16 * PXML - 70}`} mulai={T.n2} lama={0.12} warna={AIR.dingin} tebal={5} />
        </svg>
      ) : null}
    </div>
  );
};

// ======================================================================================================
// S10 (kamera ke lanskap): rentang "jawaban per botol" 10–50 dengan penanda yang goyang + pin lokasi di data center + jam
const Variasi: React.FC<{ T: WaktuA }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[9].mulai - 0.1 || t > T.keluarDunia + 0.5) return null;
  const o = maju(t, S[9].mulai + 0.2, S[9].mulai + 0.5) * (1 - maju(t, T.keluarDunia, T.keluarDunia + 0.35));
  const pl = pegas(t, T.lokasi - 0.1, fps, { damping: 11, stiffness: 200, mass: 0.6 });
  const pj = pegas(t, T.jam - 0.1, fps, { damping: 11, stiffness: 200, mass: 0.6 });
  const L = 600;
  const X0 = 560 - L / 2;
  const Y0 = 1000;
  const goyang = maju(t, T.lokasi - 0.2, T.lokasi + 0.3);
  const v = 28 + noise('rentang', t * 1.4) * 15 * goyang + Math.sin(t * 2.1) * 4 * goyang;
  const px = ((v - 10) / 40) * L;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      <div style={{ position: 'absolute', left: X0, top: Y0 - 50, width: L, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 24, color: K.abu }}>jawaban per botol 500 ml</div>
      <div style={{ position: 'absolute', left: X0, top: Y0, width: L, height: 14, borderRadius: 7, background: `linear-gradient(90deg, ${K.kuning}, ${K.teal})`, opacity: 0.6 }} />
      <div style={{ position: 'absolute', left: X0 + px - 10, top: Y0 - 14, width: 20, height: 42, borderRadius: 7, background: '#fff', boxShadow: '0 0 18px rgba(255,255,255,0.6)' }} />
      <div style={{ position: 'absolute', left: X0 - 70, top: Y0 - 18, fontFamily: SAIRA, fontWeight: 800, fontSize: 46, color: K.kuning }}>10</div>
      <div style={{ position: 'absolute', left: X0 + L + 18, top: Y0 - 18, fontFamily: SAIRA, fontWeight: 800, fontSize: 46, color: K.teal }}>50</div>
      {t > T.lokasi - 0.1 ? (
        <div style={{ position: 'absolute', left: 205, top: TANAH - 200, translate: '-50% -100%', scale: String(pl), transformOrigin: '50% 100%', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width={54} height={70} viewBox="-27 -35 54 70">
            <path d="M 0 32 Q -24 2 -24 -10 A 24 24 0 1 1 24 -10 Q 24 2 0 32 Z" fill={K.merah} />
            <circle cx={0} cy={-10} r={9} fill={K.latar} />
          </svg>
          <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 48, color: K.tinta }}>lokasi</span>
        </div>
      ) : null}
      {t > T.jam - 0.1 ? (
        <div style={{ position: 'absolute', left: 590, top: 1068, scale: String(pj), display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width={64} height={64} viewBox="-32 -32 64 64">
            <circle cx={0} cy={0} r={27} fill="none" stroke={K.kuning} strokeWidth={5} />
            <line x1={0} y1={0} x2={0} y2={-18} stroke={K.kuning} strokeWidth={5} strokeLinecap="round" transform={`rotate(${(t * 30) % 360})`} />
            <line x1={0} y1={0} x2={13} y2={0} stroke={K.kuning} strokeWidth={5} strokeLinecap="round" transform={`rotate(${(t * 360) % 360})`} />
          </svg>
          <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 48, color: K.tinta }}>jam</span>
        </div>
      ) : null}
    </div>
  );
};

// ======================================================================================================
const Hud: React.FC<{ T: WaktuA }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const kl = (i: number) => S[i + 1].mulai - 0.2;
  const sO = maju(t, 1.3, 1.6) * (1 - maju(t, T.keluarDunia - 0.1, T.keluarDunia + 0.2));
  return (
    <>
      <TeksSeri
        label={['PERKIRAAN', 'PENELITI']} lMulai={0.1}
        judul={[{ t: '500 ml', mulai: 0.18, warna: AIR.umum }, { t: '=', mulai: 0.26, warna: K.abu }, { t: '10–50', mulai: 0.34, isi: sorot('10–50', T.n10) }, { t: 'jawaban', mulai: 0.42 }]}
        jMulai={0.18} keluar={kl(0)}
      />
      <TeksSeri
        label={['UC', 'RIVERSIDE', '&', 'UT', 'ARLINGTON']} lMulai={S[1].mulai}
        judul={[{ t: 'GPT-3', mulai: T.gpt3, warna: K.kuning }, { t: '·', mulai: T.gpt3 + 0.2, warna: K.abu }, { t: 'data', mulai: T.microsoft2 - 0.5 }, { t: 'center', mulai: T.microsoft2 - 0.35 }, { t: 'Microsoft', mulai: T.microsoft2 }]}
        jMulai={T.gpt3} keluar={kl(1)}
      />
      <TeksSeri
        label={['AIRNYA', 'DIPAKAI', 'DI']} lMulai={S[2].mulai}
        judul={[{ t: 'pendingin', mulai: T.dinginin, warna: AIR.dingin }, { t: '+', mulai: T.pembangkit3 - 0.2, warna: K.abu }, { t: 'pembangkit', mulai: T.pembangkit3, warna: AIR.bangkit }]}
        jMulai={T.dinginin} keluar={kl(2)}
      />
      <TeksSeri
        label={['SEBAGIAN', 'AIR', 'SENGAJA', 'DIUAPIN']} lMulai={S[3].mulai}
        judul={[{ t: 'menara', mulai: T.menara }, { t: 'pendingin', mulai: T.menara + 0.25, isi: sorot('pendingin', T.menara + 0.45, K.teal) }]}
        jMulai={T.menara} keluar={kl(3)} catatan="biar panas server dilepas ke udara" cMulai={T.dilepas}
      />
      <TeksSeri
        label={['YANG', 'DIHITUNG']} lMulai={S[4].mulai}
        judul={[{ t: 'menguap', mulai: T.menguap, warna: AIR.dingin }, { t: '=', mulai: T.menguap + 0.3, warna: K.abu }, { t: '"diminum"', mulai: T.diminum - 0.1, isi: sorot('"diminum"', T.diminum + 0.1) }]}
        jMulai={T.menguap} keluar={kl(4)}
      />
      <TeksSeri
        label={['1', 'JAWABAN', 'DI', 'HITUNGAN', 'INI']} lMulai={S[5].mulai}
        judul={[{ t: '150–300', mulai: T.n150, warna: K.kuning }, { t: 'kata', mulai: T.n150 + 0.2 }]}
        jMulai={T.n150} keluar={kl(5)}
      />
      <TeksSeri
        label={['RATA-RATA', 'DATA', 'CENTER', 'AS']} lMulai={S[6].mulai}
        judul={[{ t: '±17 ml', mulai: T.n17, warna: K.kuning }, { t: '·', mulai: T.n30 - 0.2, warna: K.abu }, { t: '±30', mulai: T.n30, isi: sorot('±30', T.n30 + 0.3) }, { t: 'jawaban', mulai: T.n30 + 0.15 }]}
        jMulai={T.n17} keluar={kl(6)} catatan="perkiraan · 1 botol 500 ml" cMulai={T.n30 + 0.4}
      />
      <TeksSeri
        label={['DARI', '17', 'ML', 'ITU']} lMulai={S[7].mulai}
        judul={[{ t: '15 ml', mulai: T.n15, warna: AIR.bangkit }, { t: 'pembangkit', mulai: T.pembangkit8 }, { t: '·', mulai: T.n2 - 0.2, warna: K.abu }, { t: '2 ml', mulai: T.n2, warna: AIR.dingin }, { t: 'pendingin', mulai: T.pendingin8 }]}
        jMulai={T.n15} keluar={kl(7)} ukuran={86} catatan="perkiraan · rata-rata data center AS" cMulai={T.pembangkit8}
      />
      <TeksSeri
        label={['DATA', 'CENTER', 'MICROSOFT', 'DI']} lMulai={S[8].mulai}
        judul={[{ t: 'Indonesia:', mulai: T.indonesia }, { t: '±25', mulai: T.n25, isi: sorot('±25', T.n25 + 0.2) }, { t: 'jawaban', mulai: T.n25 + 0.15 }]}
        jMulai={T.indonesia} keluar={kl(8)} catatan="perkiraan · proyeksi Microsoft, Juli 2023" cMulai={T.dibangun}
      />
      <TeksSeri
        label={['ANGKANYA', 'BEDA', 'TIAP']} lMulai={S[9].mulai}
        judul={[{ t: 'lokasi', mulai: T.lokasi }, { t: '&', mulai: T.jam - 0.15, warna: K.abu }, { t: 'jam', mulai: T.jam, warna: K.kuning }]}
        jMulai={T.lokasi} keluar={kl(9)} catatan="tergantung cuaca & sumber listrik" cMulai={T.cuaca}
      />
      <TeksSeri
        label={['BUAT', 'CEK', 'LAGI', 'ANGKANYA']} lMulai={S[10].mulai}
        judul={[{ t: 'simpan', mulai: T.simpan + 0.05, warna: K.kuning }, { t: '&', mulai: T.follow - 0.25, warna: K.abu }, { t: 'follow', mulai: T.follow, warna: K.teal }]}
        jMulai={T.simpan} keluar={T.keluarCta}
      />
      <Sumber teks={'Perkiraan: Li dkk., "Making AI Less \'Thirsty\'" (arXiv 2304.03271, 2025)'} o={sO} />
    </>
  );
};

// ======================================================================================================
function daftarSfx(T: WaktuA) {
  const S = T.s;
  const tegukS7 = Array.from({ length: 10 }, (_, i) => bunyi('tik', T.kuras7[0] + ((T.kuras7[1] - T.kuras7[0]) * i) / 10, 0.16));
  const tegukS9 = Array.from({ length: 9 }, (_, i) => bunyi('tik', T.kuras9[0] + ((T.kuras9[1] - T.kuras9[0]) * i) / 9, 0.14));
  const kata = Array.from({ length: 8 }, (_, i) => bunyi('tik', T.panjangnya + i * ((T.n300 + 0.3 - T.panjangnya) / 8), 0.14));
  return [
    bunyi('whooshTurun', 0.1, 0.35),
    bunyi('hantam', 0.42, 0.35),
    bunyi('pop', 0.48, 0.3),
    bunyi('swish', T.minum - 0.05, 0.28),
    bunyi('pop', T.n500, 0.25),
    bunyi('tik', T.n10 + 0.05, 0.25),
    bunyi('tik', T.n10 + 0.2, 0.25),
    bunyi('whooshA', T.n50, 0.25),
    bunyi('whooshA', T.keKertas + 0.3, 0.4),
    bunyi('pop', T.uc, 0.3),
    bunyi('pop', T.ut, 0.3),
    bunyi('klik', T.gpt3, 0.3),
    bunyi('pop', T.microsoft2 - 0.25, 0.3),
    bunyi('whooshBerat', T.keLuas + 0.3, 0.4),
    bunyi('swish', T.keLuas + 0.5, 0.25),
    bunyi('pop', T.dinginin, 0.32),
    bunyi('pop', T.pembangkit3, 0.32),
    bunyi('glitch', T.listriknya3, 0.15),
    bunyi('whooshTurun', T.keMenara + 0.2, 0.4),
    bunyi('swish', T.diuapin, 0.28),
    bunyi('whooshLembut', T.panas, 0.3),
    bunyi('swish', T.menguap, 0.3),
    bunyi('hantam', T.diminum + 0.02, 0.4),
    bunyi('jepret', T.diminum + 0.05, 0.3),
    bunyi('whooshB', T.keBotol + 0.3, 0.4),
    ...kata,
    bunyi('pop', T.n150 + 0.3, 0.3),
    bunyi('pop', T.n300 + 0.35, 0.3),
    bunyi('swish', S[6].mulai + 0.1, 0.25),
    bunyi('pop', S[6].mulai + 0.25, 0.25),
    bunyi('kunci', T.n17 + 0.35, 0.3),
    ...tegukS7,
    bunyi('pop', T.kuras7[1], 0.35),
    bunyi('whooshPop', T.n15 - 0.2, 0.3),
    bunyi('pop', T.n2, 0.3),
    bunyi('whooshA', S[8].mulai + 0.05, 0.3),
    bunyi('pop', T.indonesia, 0.3),
    bunyi('swish', T.dibangun - 0.2, 0.25),
    ...tegukS9,
    bunyi('hantam', T.kuras9[1], 0.3),
    bunyi('whooshLembut', S[9].mulai + 0.1, 0.35),
    bunyi('pop', T.lokasi, 0.3),
    bunyi('pop', T.jam, 0.3),
    bunyi('pop', T.cuaca, 0.3),
    bunyi('pop', T.sumber, 0.3),
    bunyi('whooshTerang', T.keluarDunia + 0.1, 0.32),
    bunyi('pop', T.simpan + 0.15, 0.35),
    bunyi('klik', T.simpan + 0.65, 0.4),
    bunyi('pop', T.follow - 0.2, 0.3),
    bunyi('klik', T.follow + 0.3, 0.4),
    bunyi('whooshLembut', T.keluarCta + 0.05, 0.3),
  ];
}
