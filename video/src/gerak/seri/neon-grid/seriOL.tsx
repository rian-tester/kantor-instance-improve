// SERI explainer evergreen generik (contoh, 17/10): satu gaya keluarga buat O1/O2/O10.
// KELUARGA: kinetic data gelap + HUD game neon. Navy generik (#0b1020/#111834) + EMAS (sorot, angka penting) + LIME (label,
// garis HUD) selalu ada; 1 aksen per video (O1 langit = Bumi/laut, O2 magenta = piksel AI, O10 koral = HDD).
// Ciri seri (beda dari seri generik & generik): bar XP di atas yang keisi per kalimat, braket sudut HUD, lantai grid neon
// yang jalan terus di bawah (zona UI = cuma latar), label "quest" mono + belah ketupat, generik kecil kanan atas (reaksi, tanpa suara).
// Font: Saira Condensed (judul/angka) + JetBrains Mono (label/sumber).
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import {
  EASE, GarisDigambar, Grain, Kabut, Karakter, KataMuncul, maju, noise, Paralaks, polaKotak, Subtitle, useDetik, type EkspresiDi, type Kamera,
  type Kata, type KataLayar, type PosisiKarakter, type Sfx, type ZonaSubtitle,
} from "../..";
import { MONO, SAIRA } from "../../font";

export const OL = {
  navy0: '#0b1020',
  navy1: '#111834',
  permukaan: '#1a2244',
  garis: '#2c3870',
  emas: '#ffc53d',
  lime: '#3ddc84',
  putih: '#f7f9fc',
  abu: '#8a94b8',
  abuTerang: '#c3cae6',
  langit: '#4cc3ff',
  koral: '#ff5a5f',
  magenta: '#ff4fd8',
};

export type Kalimat = { mulai: number; akhir: number; teks: string };
export type DataOL = { durasi: number; kata: Kata[]; kalimat?: Kalimat[] };

const sf = (id: string, puncak: number) => ({ src: '', puncak });
export const SFX = {
  pop: sf('39e3b2a6-704e-4920-a474-b4ae0f3789d8', 0.113),
  tik: sf('be7dbf02-e278-4f53-b8b6-2f9c287db6a4', 0.071),
  swish: sf('7935eba8-1fc6-42da-a1a4-0bd269bf1431', 0.172),
  whooshA: sf('7070b42c-d83c-4a6e-865a-3efca4f08244', 0.148),
  whooshB: sf('7a5c0a2a-bbaf-4cef-84b4-83fe9dc67446', 0.155),
  whooshBerat: sf('f06764a2-809d-4892-b8c0-a2173507908d', 0.371),
  whooshPop: sf('a4b942b2-2b97-4ba7-a366-c51a7dca2742', 0.079),
  whooshTurun: sf('c2066005-87ff-43cd-b2d6-34cdbfa557e3', 0.3),
  whooshPunch: sf('9c5e4ada-17b7-4d89-86f6-cd5eb381fa83', 0.137),
  whooshTerang: sf('a5135085-d6b9-42a1-a183-068d3c206011', 0.337),
  whooshLembut: sf('3e3bd313-e697-41bc-b33e-61bbd361db00', 0.343),
  glitch: sf('52b0963c-b7ce-41d6-b71e-663b152e57dd', 0.071),
  hantam: sf('47b771aa-ec1f-4e5d-bfb4-f53115d5ba34', 0.305),
  sapuHit: sf('57b926bf-1dab-4b05-9190-870a75b8dc76', 0.338),
  kunci: sf('b0fbad78-1aef-41d0-813e-7a7f87c98aab', 0.274),
  klik: sf('b0e0ad18-57bd-4c4a-9b55-3b5b98b0328c', 0.14),
  jepret: sf('9daa462f-b81f-4809-83a0-0689e8198387', 0.116),
  riser: sf('3e1a64bc-1741-4a7f-846b-2b97f8127264', 2.039),
};
export type NamaSfx = keyof typeof SFX;
export const bunyi = (k: NamaSfx, momen: number, vol: number): Sfx => ({ ...SFX[k], momen, vol });

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// ---------------------------------------------------------------------------------------------------------------
// Latar seri: gradasi navy + kabut cahaya + pola piksel paralaks + lantai grid neon yang jalan (bawah = zona UI, cuma latar)
const POLA_JAUH = polaKotak(
  540,
  960,
  Array.from({ length: 14 }, (_, i) => ({
    x: Math.round(random(`ol-x${i}`) * 510),
    y: Math.round(random(`ol-y${i}`) * 930),
    s: 8 + Math.round(random(`ol-s${i}`) * 14),
    warna: random(`ol-w${i}`) > 0.5 ? OL.emas : OL.lime,
    o: 0.08 + random(`ol-o${i}`) * 0.12,
  })),
);

export const LatarOL: React.FC<{ kam?: Kamera; aksen?: string }> = ({ kam, aksen = OL.langit }) => {
  const t = useDetik();
  const gx = 50 + noise('ol-lt', t * 0.07) * 8;
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at ${gx}% 42%, ${OL.navy1} 0%, ${OL.navy0} 75%)` }} />
      <Kabut kam={kam} warna={['61,220,132', hexKeRgb(aksen), '255,197,61']} kuat={0.55} />
      {kam ? <Paralaks kamera={kam} lapis={[{ faktor: 0.35, ...POLA_JAUH }]} /> : null}
      <LantaiGrid />
    </>
  );
};

/** lantai grid neon (synthwave) di 20% bawah: garis maju terus = latar gak pernah beku */
export const LantaiGrid: React.FC<{ o?: number }> = ({ o = 1 }) => {
  const t = useDetik();
  const geser = (t * 70) % 80;
  return (
    <div style={{ position: 'absolute', left: -600, right: -600, top: 1540, height: 600, perspective: 420, opacity: o, pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: '50% 0%',
          transform: 'rotateX(62deg)',
          backgroundImage: `linear-gradient(rgba(61,220,132,0.32) 2px, transparent 2px), linear-gradient(90deg, rgba(61,220,132,0.26) 2px, transparent 2px)`,
          backgroundSize: '80px 80px',
          backgroundPosition: `0 ${geser}px`,
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 70%, transparent 100%)',
        }}
      />
      <div style={{ position: 'absolute', left: 0, right: 0, top: -2, height: 3, background: 'linear-gradient(90deg, transparent, rgba(255,197,61,0.55), transparent)' }} />
    </div>
  );
};

function hexKeRgb(h: string) {
  const x = h.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16)).join(',');
}

// ---------------------------------------------------------------------------------------------------------------
// HUD seri: bar XP (11 ruas = 11 kalimat, keisi ngikut VO) + braket sudut
export const HudSeri: React.FC<{ kalimat: { mulai: number; akhir: number }[]; sampai: number; aksen?: string }> = ({ kalimat, sampai, aksen = OL.lime }) => {
  const t = useDetik();
  const n = Math.max(1, kalimat.length);
  const masuk = maju(t, 0.05, 0.45);
  const keluar = maju(t, sampai, sampai + 0.3, EASE.keluar);
  const o = masuk * (1 - keluar);
  if (o <= 0) return null;
  const X = 70;
  const L = 940;
  const gap = 8;
  const w = (L - gap * (n - 1)) / n;
  return (
    <>
      <div style={{ position: 'absolute', left: X, top: 118, width: L, height: 12, opacity: o }}>
        {Array.from({ length: n }, (_, i) => {
          const k = kalimat[i];
          const p = k ? maju(t, k.mulai, k.akhir, EASE.linear) : 0;
          const aktif = k && t >= k.mulai - 0.05 && t < (kalimat[i + 1]?.mulai ?? 999);
          return (
            <div key={i} style={{ position: 'absolute', left: i * (w + gap), top: 0, width: w, height: 12, borderRadius: 3, background: 'rgba(44,56,112,0.75)', overflow: 'hidden', boxShadow: aktif ? `0 0 14px ${OL.emas}66` : undefined }}>
              <div style={{ width: `${(p * 100).toFixed(2)}%`, height: '100%', background: p >= 1 ? aksen : OL.emas }} />
            </div>
          );
        })}
      </div>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 0.5 * o }} width={1} height={1}>
        {[
          [44, 96, 1, 1],
          [1036, 96, -1, 1],
          [44, 1548, 1, -1],
          [1036, 1548, -1, -1],
        ].map(([x, y, sx, sy], i) => (
          <path key={i} d={`M ${x} ${y + sy * 54} L ${x} ${y} L ${x + sx * 54} ${y}`} fill="none" stroke={OL.lime} strokeWidth={4} strokeLinecap="round" />
        ))}
      </svg>
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Teks: label quest (mono caps + belah ketupat) → judul besar (kata kunci) → keterangan kecil
const LABEL: React.CSSProperties = { fontFamily: MONO, fontWeight: 700, fontSize: 36, letterSpacing: '0.12em', color: OL.lime, textTransform: 'uppercase' };
const JUDUL: React.CSSProperties = {
  fontFamily: SAIRA,
  fontWeight: 800,
  fontSize: 104,
  lineHeight: 1.0,
  color: OL.putih,
  columnGap: '0.2em',
  rowGap: '0.04em',
  textShadow: '0 0 28px rgba(61,220,132,0.28), 0 6px 18px rgba(0,0,0,0.6)',
};

export const TeksOL: React.FC<{
  label: (KataLayar | string)[];
  lMulai: number;
  judul?: (KataLayar | string)[];
  jMulai?: number;
  keluar: number;
  ukuran?: number;
  lebar?: number;
}> = ({ label, lMulai, judul, jMulai = 0, keluar, ukuran = 104, lebar = 780 }) => {
  const t = useDetik();
  if (t < lMulai - 0.2 || t > keluar + 0.45) return null;
  const ok = maju(t, lMulai - 0.05, lMulai + 0.15) * (1 - maju(t, keluar, keluar + 0.2, EASE.keluar));
  return (
    <>
      <div style={{ position: 'absolute', left: 70, top: 162, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 16, height: 16, rotate: `${45 + 90 * maju(t, lMulai - 0.05, lMulai + 0.3, EASE.kamera)}deg`, background: OL.emas, opacity: ok, boxShadow: `0 0 12px ${OL.emas}` }} />
        <KataMuncul mulai={lMulai} keluar={keluar} jeda={0.06} gaya={LABEL} kata={label} />
      </div>
      {judul ? (
        <div style={{ position: 'absolute', left: 66, top: 216, width: lebar }}>
          <KataMuncul mulai={jMulai} keluar={keluar + 0.02} jeda={0.05} lama={0.2} gaya={{ ...JUDUL, fontSize: ukuran }} kata={judul} />
        </div>
      ) : null}
    </>
  );
};

/** Chip kecil (sumber / hitungan kami / catatan jujur). */
export const ChipKecil: React.FC<{ x: number; y: number; teks: React.ReactNode; o: number; warna?: string; rata?: 'kiri' | 'tengah' }> = ({ x, y, teks, o, warna = OL.abuTerang, rata = 'kiri' }) =>
  o <= 0 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        translate: rata === 'tengah' ? '-50% 0' : undefined,
        padding: '4px 14px',
        borderRadius: 8,
        background: 'rgba(8,12,28,0.82)',
        border: `1.5px solid ${OL.garis}`,
        fontFamily: MONO,
        fontWeight: 500,
        fontSize: 24,
        color: warna,
        whiteSpace: 'nowrap',
        opacity: o,
      }}
    >
      {teks}
    </div>
  );

/** Chip angka di dalam dunia (label diegetik, mis. di garis ukur). */
export const ChipAngka: React.FC<{ x: number; y: number; isi: React.ReactNode; o?: number; warna?: string; ukuran?: number; skala?: number }> = ({ x, y, isi, o = 1, warna = OL.emas, ukuran = 40, skala = 1 }) =>
  o <= 0 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        translate: '-50% -50%',
        scale: String(skala),
        padding: '6px 18px 8px',
        borderRadius: 12,
        background: OL.navy0,
        border: `3px solid ${warna}`,
        boxShadow: `0 0 18px ${warna}55`,
        fontFamily: SAIRA,
        fontWeight: 800,
        fontSize: ukuran,
        lineHeight: 1,
        color: warna,
        whiteSpace: 'nowrap',
        opacity: o,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {isi}
    </div>
  );

// ---------------------------------------------------------------------------------------------------------------
// generik kecil (reaksi tanpa suara): kedip berkala, ganti ekspresi per kalimat
export const generikReaksi: React.FC<{ posisi: PosisiKarakter[]; ekspresi: EkspresiDi[]; masuk?: number; keluar?: number }> = ({ posisi, ekspresi, masuk = 0.3, keluar }) => (
  <></>
);

// ---------------------------------------------------------------------------------------------------------------
export const SubOL: React.FC<{ kata: Kata[]; kalimat?: Kalimat[]; sampai: number; gabung?: { kata: string[]; jadi: string }[]; zona?: ZonaSubtitle[] }> = ({ kata, kalimat, sampai, gabung = [], zona }) => (
  <Subtitle
    kata={kata}
    kalimat={kalimat}
    font={SAIRA}
    tebal={700}
    ukuran={46}
    maksHuruf={32}
    sorot={OL.emas}
    gabung={gabung}
    sampai={sampai}
    pita="rgba(8,12,28,0.66)"
    zona={zona ?? [{ dari: 0, x: 540, y: 1398, lebar: 940 }]}
  />
);

/** scrim gelap di zona teks atas (judul tetap kebaca walau dunia di belakangnya lagi di-zoom) */
export const ScrimAtas: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(11,16,32,0.94) 0px, rgba(11,16,32,0.86) 300px, rgba(11,16,32,0.55) 400px, rgba(11,16,32,0) 500px)' }} />
);

export const GrainOL: React.FC = () => <Grain kuat={0.08} garisScan={0.035} vinyet={0.5} warnaVinyet="3,5,16" />;

// ---------------------------------------------------------------------------------------------------------------
// Penutup seri: ikon SIMPAN (bookmark) & FOLLOW (orang +) digambar, nempel ke kata VO
export const CtaOL: React.FC<{ simpan: number; follow: number; keluar: number; y?: number }> = ({ simpan, follow, keluar, y = 760 }) => {
  const t = useDetik();
  if (t < simpan - 0.2 || t > keluar + 0.4) return null;
  const k = maju(t, keluar, keluar + 0.3, EASE.keluar);
  const pS = maju(t, simpan - 0.1, simpan + 0.25);
  const pF = maju(t, follow - 0.1, follow + 0.25);
  const isiS = maju(t, simpan + 0.35, simpan + 0.6);
  const isiF = maju(t, follow + 0.35, follow + 0.6);
  const ayun = (m: number) => (t > m ? Math.sin((t - m) * 14) * Math.exp(-(t - m) * 5) * 8 : 0);
  const kotak = (x: number, p: number, warna: string, isi: number, ikon: React.ReactNode, teks: string, m: number) => (
    <div style={{ position: 'absolute', left: x - 190, top: y, width: 380, height: 420, opacity: p * (1 - k), scale: String((0.85 + 0.15 * p) * (1 - 0.2 * k)), rotate: `${ayun(m + 0.35)}deg` }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 36, background: `linear-gradient(160deg, ${OL.permukaan}, ${OL.navy0})`, border: `4px solid ${warna}`, boxShadow: `0 0 ${20 + 30 * isi}px ${warna}55` }} />
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={380} height={420}>
        {ikon}
      </svg>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontFamily: SAIRA, fontWeight: 800, fontSize: 76, color: warna, textShadow: `0 0 18px ${warna}66` }}>{teks}</div>
    </div>
  );
  // bookmark: 130×170 di tengah atas kotak; orang+: kepala, badan, tanda +
  const bm = 'M 125 60 L 255 60 L 255 240 L 190 190 L 125 240 Z';
  return (
    <>
      {kotak(
        300,
        pS,
        OL.emas,
        isiS,
        <>
          <path d={bm} fill={OL.emas} opacity={isiS} />
          <GarisDigambar d={bm} mulai={simpan} lama={0.35} warna={OL.emas} tebal={12} />
        </>,
        'simpan',
        simpan,
      )}
      {kotak(
        780,
        pF,
        OL.lime,
        isiF,
        <>
          <circle cx={170} cy={105} r={44} fill={OL.lime} opacity={isiF} />
          <path d="M 85 245 Q 85 165 170 165 Q 255 165 255 245 Z" fill={OL.lime} opacity={isiF} />
          <GarisDigambar d="M 170 61 A 44 44 0 1 1 169.9 61" mulai={follow} lama={0.3} warna={OL.lime} tebal={11} />
          <GarisDigambar d="M 85 245 Q 85 165 170 165 Q 255 165 255 245 Z" mulai={follow + 0.12} lama={0.3} warna={OL.lime} tebal={11} />
          <GarisDigambar d="M 300 95 L 300 175 M 260 135 L 340 135" mulai={follow + 0.3} lama={0.18} warna={OL.emas} tebal={14} />
        </>,
        'follow',
        follow,
      )}
    </>
  );
};
