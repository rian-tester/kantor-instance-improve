// Frame hero (pembuka, tengah, puncak): 15, 851, 1418.
// contoh explainer generik O8 (konten contoh): "Ryzen 7000 dirancang AMD buat jalan di 95°C".
// SERI generik (seri/seriOL.tsx), aksen O8 = KORAL (panas); EMAS = TjMax 95°C; LIME = main game ±70°C; LANGIT = X3D 89°C.
// SATU DUNIA: termometer besar (kanan, selalu ada) + chip prosesor generik (kiri, tanpa logo). Hook: termometer naik ke 95°C →
// papan uji kualitas di 95°C → umur & stabil (kata AMD) → garis TjMax → Precision Boost 2: jarum naik sampai mentok batas →
// semua core kerja (render) → ±95°C → ganti pendingin: suhu tetap, performa naik dikit → main game ±70°C → X3D (2023) batas 89°C → CTA → loop.
// Fakta: blog resmi AMD (Don Woligroski, 2/11/2022), spesifikasi AMD (TjMax 95°C; X3D 89°C).
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { AngkaJalan, Bunyi, Dunia, EASE, GarisDigambar, hitungKamera, maju, noise, pegas, SapuSorot, Stempel, useDetik, type KunciKamera, type Kata, type Sfx } from "../../src/gerak";
import { MONO, SAIRA } from "../../src/gerak/font";
import { bunyi, ChipAngka, ChipKecil, CtaOL, GrainOL, HudSeri, LatarOL, lerp, OL, generikReaksi, ScrimAtas, SubOL, TeksOL, type DataOL, type Kalimat } from "../../src/gerak/seri/neon-grid/seriOL";
import { cariKata, jendela, Ket, Panel, pathCentang, sfxDasar, sumberDi, waktuDasar } from "../../src/gerak/seri/neon-grid/bantuOL";

const PANAS = OL.koral;
const GAME = OL.lime;
const X3D = OL.langit;
const TM = { x: 850, atas: 620, bawah: 1130, bola: 1195 }; // termometer
const yT = (c: number) => TM.bawah - ((c - 25) / 75) * (TM.bawah - TM.atas);

const GABUNG = [
  { kata: ['ryzen', 'tujuh', 'ribu'], jadi: 'Ryzen 7000' },
  { kata: ['sembilan', 'puluh', 'lima', 'derajat'], jadi: '95 derajat' },
  { kata: ['precision', 'boost', 'dua'], jadi: 'Precision Boost 2' },
  { kata: ['ryzen', 'sembilan', 'tujuh', 'puluh', 'sembilan', 'lima', 'puluh', 'x'], jadi: 'Ryzen 9 7950X' },
  { kata: ['tujuh', 'puluh', 'derajat'], jadi: '70 derajat' },
  { kata: ['dua', 'ribu', 'dua', 'puluh', 'tiga'], jadi: '2023' },
  { kata: ['delapan', 'puluh', 'sembilan', 'derajat'], jadi: '89 derajat' },
];

function waktuO8(d: Kata[], total: number, kal?: Kalimat[]) {
  const CAD: [number, number][] = [
    [0.12, 6.06], [6.46, 11.44], [11.84, 16.62], [17.0, 21.92], [22.34, 28.16], [28.62, 34.26], [34.74, 39.54], [40.02, 46.96], [47.38, 52.94], [53.36, 57.78],
  ];
  const B = waktuDasar(kal, CAD, total);
  const s = B.s;
  const k = cariKata(d);
  const dirancang1 = k('dirancang', s[0].mulai, 2.1);
  const sembilan1 = k('sembilan', dirancang1, 4.34);
  const celsius1 = k('celsius', sembilan1, 5.44);
  const uji2 = k('uji', s[1].mulai, 8.18);
  const desktop2 = k('desktop', uji2, 9.62);
  const suhu2 = k('suhu', desktop2, 10.82);
  const umur3 = k('umur', s[2].mulai, 14.1);
  const stabil3 = k('stabil', umur3, 16.16);
  const tjmax4 = k('tjmax', s[3].mulai, 18.42);
  const maksimal4 = k('maksimal', tjmax4, 20.04);
  const precision5 = k('precision', s[4].mulai, 22.68);
  const naikin5 = k('naikin', precision5, 23.98);
  const sampai5 = k('sampai', naikin5, 26.06);
  const daya5 = k('daya', sampai5, 26.92);
  const suhu5 = k('suhu', daya5, 27.84);
  const semua6 = k('semua', s[5].mulai, 29.34);
  const render6 = k('render', semua6, 30.5);
  const sembilan6 = k('sembilan', render6, 32.92);
  const tetap7 = k('tetap', s[6].mulai, 35.18);
  const diganti7 = k('diganti', tetap7, 36.82);
  const naik7 = k('naik', diganti7, 37.8);
  const game8 = k('game', s[7].mulai, 40.58);
  const ryzen8 = k('ryzen', game8, 42.24);
  const liquid8 = k('liquid', ryzen8, 44.82);
  const tujuh8 = k('tujuh', k('sekitar', liquid8, 45.54), 46.0);
  const x3d9 = k('x3d', s[8].mulai, 47.78);
  const rilis9 = k('rilis', x3d9, 48.5);
  const delapan9 = k('delapan', rilis9, 51.58);
  const simpan = k('simpan', s[9].mulai, 53.36);
  const follow = k('follow', simpan, 56.28);
  return {
    ...B, dirancang1, sembilan1, celsius1, uji2, desktop2, suhu2, umur3, stabil3, tjmax4, maksimal4, precision5, naikin5, sampai5, daya5, suhu5,
    semua6, render6, sembilan6, tetap7, diganti7, naik7, game8, ryzen8, liquid8, tujuh8, x3d9, rilis9, delapan9, simpan, follow,
    ctaKeluar: Math.max(follow + 0.9, total - 1.75),
  };
}
type W = ReturnType<typeof waktuO8>;

/** suhu termometer (°C) per waktu — diikat ke kata VO */
function suhu(t: number, T: W) {
  const S = T.s;
  const e = EASE.kamera;
  let c = lerp(35, 95, maju(t, T.sembilan1 - 1.2, T.celsius1 + 0.1, e));
  if (t > S[5].mulai - 0.2) c = lerp(95, 55, maju(t, S[5].mulai - 0.2, S[5].mulai + 0.4, e));
  if (t > T.semua6) c = lerp(55, 95, maju(t, T.semua6, T.sembilan6 + 0.8, Easing.out(Easing.quad)));
  if (t > T.game8 - 0.3) c = lerp(95, 70, maju(t, T.game8 - 0.3, T.tujuh8 + 0.4, e));
  if (t > S[8].mulai - 0.2) c = lerp(70, 89, maju(t, T.delapan9 - 0.4, T.delapan9 + 0.4, e));
  if (t > T.pulang - 0.8) c = lerp(c, 35, maju(t, T.pulang - 0.8, T.pulang + 0.4, e));
  return c + 0.25 * noise('suhu', t * 3) * (c > 90 ? 1 : 0.3);
}

// ======================================================================================================
function kunciKamera(T: W): KunciKamera[] {
  const S = T.s;
  const pelan = Easing.inOut(Easing.sin);
  return [
    { t: 0, x: 540, y: 960, z: 1.0 },
    { t: T.celsius1, x: 540, y: 940, z: 1.05, ease: pelan },
    { t: S[1].mulai + 0.3, x: 540, y: 960, z: 1.0 },
    { t: S[3].mulai, x: 540, y: 960, z: 1.0, ease: pelan },
    { t: T.tjmax4 + 0.4, x: 740, y: 960, z: 1.1 },
    { t: S[4].mulai - 0.1, x: 740, y: 960, z: 1.11, ease: pelan },
    { t: S[4].mulai + 0.5, x: 540, y: 960, z: 1.0 },
    { t: T.pulang, x: 540, y: 958, z: 1.02, ease: pelan },
    { t: T.loop, x: 540, y: 960, z: 1.0, ease: pelan },
  ];
}

export const ContohSuhuCpu: React.FC<DataOL> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuO8(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const kunci = useMemo(() => kunciKamera(T), [T]);
  const S = T.s;
  const kam = hitungKamera(kunci, t, fps, {
    drift: 2.2 * (1 - maju(t, T.pulang, T.loop)) * maju(t, 0, 0.6),
    getar: [
      { t: T.celsius1 + 0.1, kuat: 7 },
      { t: T.tjmax4 + 0.2, kuat: 5 },
      { t: T.daya5 + 0.1, kuat: 6 },
      { t: T.sembilan6 + 0.8, kuat: 6 },
      { t: T.delapan9 + 0.4, kuat: 5 },
    ],
  });
  return (
    <AbsoluteFill style={{ background: OL.navy0, color: OL.putih, overflow: 'hidden', fontFamily: SAIRA }}>
      <LatarOL kam={kam} aksen={PANAS} />
      <Dunia kamera={kam} tinggiDunia={1920} lebarDunia={1080} blurGerak={null}>
        <Termometer T={T} />
        <ChipKiri T={T} />
      </Dunia>
      <PapanUji T={T} />
      <Boost T={T} />
      <Pendingin T={T} />
      <ScrimAtas />
      <Teks T={T} />
      <CtaOL simpan={T.simpan} follow={T.follow} keluar={T.ctaKeluar} y={720} />
      <></>
      <HudSeri kalimat={S} sampai={T.pulang} />
      <SubOL kata={d.kata} kalimat={d.kalimat} sampai={T.pulang + 0.2} gabung={GABUNG} />
      <GrainOL />
      <></>
    </AbsoluteFill>
  );
};

// ======================================================================================================
const warnaSuhu = (c: number) => (c >= 85 ? PANAS : c >= 65 ? OL.emas : GAME);

// Termometer (dunia, kanan): selalu ada S1–S9 (redup pas CTA)
const Termometer: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const o = maju(t, 0.1, 0.4) * (1 - 0.85 * maju(t, S[9].mulai - 0.2, S[9].mulai + 0.3) * (1 - maju(t, T.pulang - 0.5, T.pulang)));
  const c = suhu(t, T);
  const y = yT(c);
  const w = warnaSuhu(c);
  const tj = maju(t, T.tjmax4 - 0.1, T.tjmax4 + 0.3);
  const x3 = maju(t, T.x3d9 - 0.1, T.x3d9 + 0.3) * (1 - maju(t, S[9].mulai - 0.2, S[9].mulai + 0.2));
  const gm = maju(t, T.game8, T.game8 + 0.3) * (1 - maju(t, S[8].mulai - 0.2, S[8].mulai + 0.2));
  const garis = (cc: number, warna: string, nama: string, nilai: string, p: number, mulai: number) =>
    p > 0 ? (
      <g opacity={p}>
        <GarisDigambar d={`M ${TM.x - 70} ${yT(cc)} L ${TM.x + 66} ${yT(cc)}`} mulai={mulai} lama={0.25} warna={warna} tebal={5} />
        <text x={TM.x + 76} y={yT(cc) - 4} fontFamily={SAIRA} fontWeight={800} fontSize={34} fill={warna} stroke={OL.navy0} strokeWidth={6} paintOrder="stroke">
          {nama}
        </text>
        <text x={TM.x + 76} y={yT(cc) + 30} fontFamily={SAIRA} fontWeight={800} fontSize={34} fill={warna} stroke={OL.navy0} strokeWidth={6} paintOrder="stroke">
          {nilai}
        </text>
      </g>
    ) : null;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: o }}>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1080} height={1920}>
        {/* tabung */}
        <rect x={TM.x - 42} y={TM.atas - 50} width={84} height={TM.bawah - TM.atas + 120} rx={42} fill="#141a3a" stroke={OL.abuTerang} strokeWidth={5} />
        <circle cx={TM.x} cy={TM.bola} r={70} fill="#141a3a" stroke={OL.abuTerang} strokeWidth={5} />
        {/* isi */}
        <rect x={TM.x - 24} y={y} width={48} height={TM.bola - y} rx={24} fill={w} />
        <circle cx={TM.x} cy={TM.bola} r={52} fill={w} />
        <circle cx={TM.x} cy={TM.bola} r={80} fill={w} opacity={0.15 + 0.15 * Math.sin(t * 5)} />
        {/* skala */}
        {[30, 40, 50, 60, 70, 80, 90, 100].map((v) => (
          <g key={v}>
            <line x1={TM.x - 42} y1={yT(v)} x2={TM.x - 64} y2={yT(v)} stroke={OL.abuTerang} strokeWidth={3} />
            <text x={TM.x - 72} y={yT(v) + 9} textAnchor="end" fontFamily={MONO} fontWeight={700} fontSize={24} fill={OL.abu}>
              {v}
            </text>
          </g>
        ))}
        {garis(95, OL.emas, 'TjMax', '95°C', tj * (1 - x3), T.tjmax4 - 0.1)}
        {garis(89, X3D, 'X3D', '89°C', x3, T.x3d9 - 0.1)}
        {garis(70, GAME, 'game', '±70°C', gm, T.game8)}
      </svg>
      {/* angka suhu nempel di ujung isi */}
      <div style={{ position: 'absolute', left: TM.x - 150, top: TM.atas - 150, width: 300, textAlign: 'center', fontFamily: SAIRA, fontWeight: 800, fontSize: 80, lineHeight: 1, color: w, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 20px ${w}66, 0 4px 12px rgba(0,0,0,0.7)` }}>
        {Math.round(c)}°C
      </div>
    </div>
  );
};

// chip prosesor generik (kiri): S1 + S6 (semua core) + S7/S8 latar
const ChipKiri: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const h1 = 1 - maju(t, S[1].mulai - 0.15, S[1].mulai + 0.25, EASE.keluar);
  const h6 = maju(t, S[5].mulai - 0.1, S[5].mulai + 0.3) * (1 - maju(t, S[6].mulai - 0.15, S[6].mulai + 0.2, EASE.keluar));
  const h8 = maju(t, S[7].mulai - 0.1, S[7].mulai + 0.3) * (1 - maju(t, S[9].mulai - 0.15, S[9].mulai + 0.2, EASE.keluar));
  const hP = maju(t, T.pulang - 0.5, T.pulang + 0.1);
  const o = Math.max(h1, h6, h8, hP);
  if (o <= 0.001) return null;
  const c = suhu(t, T);
  const panas = maju(c, 60, 95, EASE.linear);
  const kerja = h6 > 0 ? maju(t, T.semua6 - 0.2, T.semua6 + 0.5) : 0;
  const s = 440;
  const X = 90;
  const Y = 640;
  return (
    <div style={{ position: 'absolute', left: X, top: Y, width: s, height: s, opacity: o }}>
      {/* panas: hawa */}
      <div style={{ position: 'absolute', inset: -60, borderRadius: 80, background: `radial-gradient(circle, ${PANAS}${Math.round(40 + 60 * panas).toString(16)} 0%, transparent 70%)`, opacity: panas }} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: 24, background: 'linear-gradient(150deg, #c9cfe6, #7a83a8)', border: `6px solid ${OL.abuTerang}`, boxShadow: `0 0 ${30 * panas}px ${PANAS}` }} />
      <div style={{ position: 'absolute', inset: 46, borderRadius: 14, background: 'linear-gradient(150deg, #e6e9f5, #a3abc9)' }} />
      {/* core grid (S6) */}
      {kerja > 0
        ? Array.from({ length: 16 }, (_, i) => {
            const on = maju(t, T.semua6 - 0.2 + i * 0.03, T.semua6 + i * 0.03);
            return <div key={i} style={{ position: 'absolute', left: 66 + (i % 4) * 80, top: 66 + Math.floor(i / 4) * 80, width: 68, height: 68, borderRadius: 8, background: PANAS, opacity: on * (0.7 + 0.3 * Math.sin(t * 10 + i)) }} />;
          })
        : (
          <div style={{ position: 'absolute', left: 0, right: 0, top: s / 2 - 50, textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 44, color: '#2a3266' }}>
            Ryzen 7000
            <div style={{ fontSize: 26, marginTop: 6 }}>desktop</div>
          </div>
        )}
      {h1 > 0 ? (
        <Stempel mulai={T.dirancang1 + 0.1} rot={-8} keluar={S[1].mulai - 0.2} gaya={{ position: 'absolute', left: 40, top: s + 40 }}>
          <div style={{ padding: '4px 22px', borderRadius: 12, border: `5px solid ${OL.emas}`, color: OL.emas, fontFamily: SAIRA, fontWeight: 800, fontSize: 52, background: `${OL.navy0}ee`, whiteSpace: 'nowrap' }}>DIRANCANG AMD</div>
        </Stempel>
      ) : null}
      {h6 > 0 ? <ChipAngka x={s / 2} y={s + 70} o={kerja} ukuran={44} warna={PANAS} isi="render: semua core kerja" /> : null}
      {h8 > 0 && t < S[8].mulai ? (
        <ChipAngka x={s / 2} y={s + 70} o={maju(t, T.ryzen8, T.ryzen8 + 0.3)} ukuran={40} warna={GAME} isi="Ryzen 9 7950X + liquid cooler" />
      ) : null}
      {h8 > 0 && t >= S[8].mulai - 0.1 ? (
        <ChipAngka x={s / 2} y={s + 70} o={maju(t, T.x3d9 - 0.1, T.x3d9 + 0.2)} ukuran={44} warna={X3D} isi="seri X3D · rilis 2023" />
      ) : null}
      {/* S8: ikon stik game */}
      {h8 > 0 && t < S[8].mulai ? (
        <svg style={{ position: 'absolute', left: s / 2 - 110, top: -150, overflow: 'visible', opacity: maju(t, T.game8 - 0.1, T.game8 + 0.2) * (1 - maju(t, S[8].mulai - 0.2, S[8].mulai)) }} width={220} height={130}>
          <path d="M 40 20 L 180 20 Q 215 20 215 70 L 205 105 Q 195 125 172 112 L 150 90 L 70 90 L 48 112 Q 25 125 15 105 L 5 70 Q 5 20 40 20 Z" fill="#1a2148" stroke={GAME} strokeWidth={5} />
          <path d="M 50 55 L 80 55 M 65 40 L 65 70" stroke={GAME} strokeWidth={6} />
          <circle cx={155} cy={48} r={8} fill={GAME} />
          <circle cx={175} cy={66} r={8} fill={OL.emas} />
        </svg>
      ) : null}
    </div>
  );
};

// S2: papan uji kualitas di 95°C; S3: umur & stabil (kata AMD)
const PapanUji: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const { m, k } = jendela(t, S[1].mulai, S[3].mulai);
  const baris = [
    { m: T.uji2, teks: 'uji kualitas', nilai: 'di 95°C' },
    { m: T.desktop2, teks: 'Ryzen 7000 desktop', nilai: 'semua' },
    { m: T.umur3, teks: 'umur chip', nilai: 'gak lebih pendek' },
    { m: T.stabil3, teks: 'kerja', nilai: 'stabil' },
  ];
  return (
    <Panel x={70} y={560} w={470} h={700} m={m} k={k} judul="menurut AMD" warna={OL.emas}>
      {baris.map((b, i) => {
        const p = maju(t, b.m - 0.1, b.m + 0.25);
        return (
          <div key={i} style={{ position: 'absolute', left: 24, top: 100 + i * 145, width: 420, height: 120, borderRadius: 16, background: 'rgba(8,12,28,0.6)', opacity: p, translate: `${(1 - p) * -30}px 0` }}>
            <svg style={{ position: 'absolute', left: 20, top: 30, overflow: 'visible' }} width={60} height={60}>
              <rect x={0} y={0} width={60} height={60} rx={12} fill="none" stroke={GAME} strokeWidth={5} />
              <GarisDigambar d={pathCentang(30, 30, 46)} mulai={b.m + 0.15} lama={0.2} warna={GAME} tebal={8} />
            </svg>
            <div style={{ position: 'absolute', left: 100, top: 14, fontFamily: MONO, fontWeight: 700, fontSize: 28, color: OL.abuTerang }}>{b.teks}</div>
            <div style={{ position: 'absolute', left: 100, top: 52, fontFamily: SAIRA, fontWeight: 800, fontSize: 46, color: i < 2 ? OL.emas : GAME, whiteSpace: 'nowrap' }}>{b.nilai}</div>
          </div>
        );
      })}
    </Panel>
  );
};

// S5: Precision Boost 2 — jarum kecepatan naik sampai mentok batas daya / batas suhu
const Boost: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const { m, k, o } = jendela(t, S[4].mulai, S[5].mulai);
  if (o <= 0.001) return null;
  const naik = maju(t, T.naikin5 - 0.1, T.sampai5 + 0.4, Easing.inOut(Easing.cubic));
  const mentok = pegas(t, T.sampai5 + 0.4, fps, { damping: 7, stiffness: 220, mass: 0.5 });
  const a = lerp(-120, 52, naik) + (t > T.sampai5 + 0.4 ? -4 * Math.sin(Math.min(1, mentok) * Math.PI) : 0);
  const cx = 330;
  const cy = 980;
  const R = 230;
  const busur = (a1: number, a2: number, r: number) => {
    const p = (q: number) => `${cx + r * Math.sin((q * Math.PI) / 180)} ${cy - r * Math.cos((q * Math.PI) / 180)}`;
    return `M ${p(a1)} A ${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${p(a2)}`;
  };
  const oD = maju(t, T.daya5 - 0.1, T.daya5 + 0.2);
  const oS = maju(t, T.suhu5 - 0.1, T.suhu5 + 0.2);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, translate: `0 ${(1 - m) * 60 + k * 30}px` }}>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1080} height={1920}>
        <path d={busur(-120, 120, R)} fill="none" stroke="#1a2148" strokeWidth={46} strokeLinecap="round" />
        <path d={busur(-120, Math.max(-119.9, a), R)} fill="none" stroke={OL.emas} strokeWidth={46} strokeLinecap="round" />
        <path d={busur(52, 120, R)} fill="none" stroke={PANAS} strokeWidth={46} opacity={0.35} />
        <line x1={cx} y1={cy} x2={cx + (R - 30) * Math.sin((a * Math.PI) / 180)} y2={cy - (R - 30) * Math.cos((a * Math.PI) / 180)} stroke={OL.putih} strokeWidth={12} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={26} fill={OL.putih} />
        {/* garis batas */}
        <line x1={cx + (R - 40) * Math.sin((52 * Math.PI) / 180)} y1={cy - (R - 40) * Math.cos((52 * Math.PI) / 180)} x2={cx + (R + 50) * Math.sin((52 * Math.PI) / 180)} y2={cy - (R + 50) * Math.cos((52 * Math.PI) / 180)} stroke={PANAS} strokeWidth={8} />
      </svg>
      <div style={{ position: 'absolute', left: cx, top: cy + 60, translate: '-50% 0', fontFamily: MONO, fontWeight: 800, fontSize: 30, color: OL.abuTerang, whiteSpace: 'nowrap' }}>kecepatan prosesor</div>
      <div style={{ position: 'absolute', left: 90, top: 560, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ padding: '6px 18px', borderRadius: 12, border: `4px solid ${PANAS}`, background: OL.navy0, fontFamily: SAIRA, fontWeight: 800, fontSize: 42, color: PANAS, opacity: oD, whiteSpace: 'nowrap' }}>batas daya</div>
        <div style={{ padding: '6px 18px', borderRadius: 12, border: `4px solid ${PANAS}`, background: OL.navy0, fontFamily: SAIRA, fontWeight: 800, fontSize: 42, color: PANAS, opacity: oS, whiteSpace: 'nowrap' }}>atau batas suhu</div>
      </div>
    </div>
  );
};

// S7: ganti pendingin — suhu tetap, performa naik dikit
const Pendingin: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const { m, k, o } = jendela(t, S[6].mulai, S[7].mulai);
  if (o <= 0.001) return null;
  const ganti = maju(t, T.diganti7 - 0.2, T.diganti7 + 0.4, EASE.kamera);
  const perf = maju(t, T.naik7 - 0.1, T.naik7 + 0.6, EASE.kamera);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, translate: `0 ${(1 - m) * 60 + k * 30}px` }}>
      {/* kipas kecil → radiator liquid */}
      <svg style={{ position: 'absolute', left: 120, top: 600, overflow: 'visible' }} width={400} height={300}>
        <g opacity={1 - ganti} transform={`translate(${-80 * ganti} 0)`}>
          <rect x={80} y={20} width={240} height={240} rx={20} fill="#1a2148" stroke={OL.abuTerang} strokeWidth={5} />
          <g transform={`rotate(${t * 500} 200 140)`}>
            {Array.from({ length: 6 }, (_, j) => (
              <path key={j} d="M 200 140 Q 230 90 200 50 Q 180 90 200 140 Z" fill="#5a6496" transform={`rotate(${j * 60} 200 140)`} />
            ))}
          </g>
        </g>
        <g opacity={ganti} transform={`translate(${80 * (1 - ganti)} 0)`}>
          <rect x={0} y={30} width={400} height={110} rx={14} fill="#1a2148" stroke={X3D} strokeWidth={5} />
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`rotate(${t * 600 + i * 40} ${70 + i * 130} 85)`}>
              <circle cx={70 + i * 130} cy={85} r={44} fill="none" stroke="#5a6496" strokeWidth={4} />
              <path d={`M ${70 + i * 130} 85 L ${70 + i * 130} 45`} stroke="#5a6496" strokeWidth={10} />
              <path d={`M ${70 + i * 130} 85 L ${70 + i * 130 + 36} 100`} stroke="#5a6496" strokeWidth={10} />
            </g>
          ))}
          <path d="M 120 140 Q 120 220 200 240 M 280 140 Q 280 220 220 240" stroke={X3D} strokeWidth={10} fill="none" />
          <rect x={150} y={230} width={100} height={50} rx={10} fill="#2a3266" stroke={X3D} strokeWidth={4} />
        </g>
      </svg>
      <Ket x={320} y={920} rata="tengah" warna={OL.abuTerang} ukuran={30}>
        {ganti > 0.5 ? 'pendingin lebih kuat' : 'pendingin biasa'}
      </Ket>
      {/* performa */}
      <div style={{ position: 'absolute', left: 90, top: 1010, fontFamily: MONO, fontWeight: 800, fontSize: 28, color: OL.abuTerang }}>performa</div>
      <div style={{ position: 'absolute', left: 90, top: 1056, width: 560, height: 56, borderRadius: 12, background: 'rgba(44,56,112,0.55)' }} />
      <div style={{ position: 'absolute', left: 90, top: 1056, width: 560 * (0.78 + 0.07 * perf), height: 56, borderRadius: 12, background: GAME }} />
      {perf > 0 ? <ChipAngka x={600} y={1030} o={perf} ukuran={36} warna={GAME} isi="+ dikit" /> : null}
      <ChipAngka x={370} y={1190} o={maju(t, T.tetap7 - 0.1, T.tetap7 + 0.2)} ukuran={40} warna={PANAS} isi="suhu tetap ±95°C" />
    </div>
  );
};

// ======================================================================================================
const Teks: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const kj = (n: number) => S[n].mulai - 0.22;
  const sumber = sumberDi(t, S, [
    [0, 'Sumber: blog resmi AMD (Don Woligroski, 2/11/2022)'],
    [3, 'Sumber: AMD (spesifikasi Ryzen 7000)'],
    [4, 'Sumber: blog resmi AMD (2/11/2022) · ilustrasi'],
    [7, 'Sumber: blog resmi AMD (2/11/2022)'],
    [8, 'Sumber: spesifikasi AMD seri X3D (TjMax 89°C)'],
    [9, null],
  ]);
  const oSumber = maju(t, 1.4, 1.7) * (1 - maju(t, S[9].mulai - 0.2, S[9].mulai));
  return (
    <>
      <TeksOL label={['ryzen', '7000']} lMulai={0.12} judul={[{ t: 'dirancang', mulai: T.dirancang1, warna: OL.emas }, { t: 'di', mulai: T.sembilan1 - 0.2 }, { t: '95°C', mulai: T.sembilan1, warna: PANAS }]} jMulai={T.dirancang1} keluar={kj(1)} ukuran={104} />
      <TeksOL label={['menurut', 'AMD']} lMulai={S[1].mulai} judul={[{ t: 'uji', mulai: T.uji2 }, { t: 'kualitas', mulai: T.uji2 + 0.15 }, { t: 'di', mulai: T.suhu2 - 0.2 }, { t: '95°C', mulai: T.suhu2, warna: PANAS }]} jMulai={T.uji2} keluar={kj(2)} ukuran={96} />
      <TeksOL label={['kata', 'AMD']} lMulai={S[2].mulai} judul={[{ t: 'umur', mulai: T.umur3 }, { t: '&', mulai: T.umur3 + 0.2, warna: OL.abu }, { t: 'stabilitas', mulai: T.stabil3 - 0.4 }, { t: 'aman', mulai: T.stabil3, warna: GAME }]} jMulai={T.umur3} keluar={kj(3)} ukuran={92} />
      <TeksOL label={['batas', 'suhu']} lMulai={S[3].mulai} judul={[{ t: 'TjMax', mulai: T.tjmax4, warna: OL.emas }, { t: '=', mulai: T.tjmax4 + 0.4, warna: OL.abu }, { t: 'suhu', mulai: T.maksimal4 - 0.4 }, { t: 'maksimal', mulai: T.maksimal4 }]} jMulai={T.tjmax4} keluar={kj(4)} ukuran={88} />
      <TeksOL label={['precision', 'boost', '2']} lMulai={S[4].mulai} judul={[{ t: 'kejar', mulai: T.naikin5 }, { t: 'sampai', mulai: T.sampai5 }, { t: 'mentok', mulai: T.sampai5 + 0.2 }, { t: 'batas', mulai: T.daya5 - 0.2, warna: PANAS }]} jMulai={T.naikin5} keluar={kj(5)} ukuran={92} />
      <TeksOL label={['kerja', 'berat', 'semua', 'core']} lMulai={S[5].mulai} judul={[{ t: 'suhu', mulai: T.render6 }, { t: 'di', mulai: T.render6 + 0.2 }, { t: '±95°C', mulai: T.sembilan6, warna: PANAS }]} jMulai={T.render6} keluar={kj(6)} ukuran={100} />
      <TeksOL label={['ganti', 'pendingin']} lMulai={S[6].mulai} judul={[{ t: 'suhu', mulai: T.tetap7 - 0.2 }, { t: 'tetap,', mulai: T.tetap7, warna: PANAS }, { t: 'performa', mulai: T.naik7 - 0.2 }, { t: 'naik', mulai: T.naik7, warna: GAME }]} jMulai={T.tetap7 - 0.2} keluar={kj(7)} ukuran={84} />
      <TeksOL label={['menurut', 'AMD']} lMulai={S[7].mulai} judul={[{ t: 'main', mulai: T.game8 - 0.25 }, { t: 'game', mulai: T.game8, warna: GAME }]} jMulai={T.game8 - 0.25} keluar={T.tujuh8 - 0.25} ukuran={104} />
      <TeksOL label={['main', 'game', '·', 'menurut', 'AMD']} lMulai={T.tujuh8 - 0.1} judul={[{ t: '±70°C', mulai: T.tujuh8, warna: GAME }, { t: '(7950X', mulai: T.tujuh8 + 0.2 }, { t: '+', mulai: T.tujuh8 + 0.3, warna: OL.abu }, { t: 'AIO)', mulai: T.tujuh8 + 0.4 }]} jMulai={T.tujuh8} keluar={kj(8)} ukuran={88} />
      <TeksOL label={['seri', 'X3D', '·', '2023']} lMulai={S[8].mulai} judul={[{ t: 'batas', mulai: T.x3d9 + 0.3 }, { t: '89°C', mulai: T.delapan9, warna: X3D }]} jMulai={T.x3d9 + 0.3} keluar={kj(9)} ukuran={104} />
      <TeksOL label={['simpan', '&', 'follow']} lMulai={S[9].mulai} judul={[{ t: 'buat', mulai: T.simpan + 0.5 }, { t: 'ngecek', mulai: T.simpan + 0.6 }, { t: 'suhu', mulai: T.simpan + 0.75, warna: OL.emas }]} jMulai={T.simpan + 0.5} keluar={T.ctaKeluar} ukuran={92} />
      {sumber ? <ChipKecil x={90} y={1330} o={oSumber} teks={sumber} /> : null}
    </>
  );
};

// ======================================================================================================
function daftarSfx(T: W): Sfx[] {
  const S = T.s;
  return [
    ...sfxDasar(S, T.simpan, T.follow, T.pulang),
    bunyi('riser', T.sembilan1 - 1.4, 0.2),
    bunyi('hantam', T.dirancang1 + 0.18, 0.35),
    bunyi('kunci', T.celsius1 + 0.1, 0.4),
    bunyi('pop', T.uji2, 0.3),
    bunyi('pop', T.desktop2, 0.3),
    bunyi('pop', T.umur3, 0.3),
    bunyi('pop', T.stabil3, 0.3),
    bunyi('sapuHit', T.tjmax4 + 0.1, 0.35),
    bunyi('riser', T.naikin5, 0.2),
    bunyi('hantam', T.sampai5 + 0.4, 0.4),
    bunyi('pop', T.daya5, 0.3),
    bunyi('pop', T.suhu5, 0.3),
    bunyi('whooshBerat', T.semua6 - 0.2, 0.3),
    bunyi('kunci', T.sembilan6 + 0.8, 0.35),
    bunyi('swish', T.diganti7, 0.3),
    bunyi('pop', T.naik7, 0.3),
    bunyi('whooshTurun', T.game8 - 0.3, 0.3),
    bunyi('kunci', T.tujuh8 + 0.4, 0.35),
    bunyi('swish', T.x3d9, 0.3),
    bunyi('kunci', T.delapan9 + 0.4, 0.35),
  ];
}

// ======================================================================================================
export const O8Sampul: React.FC = () => (
  <AbsoluteFill style={{ background: OL.navy0, overflow: 'hidden', fontFamily: SAIRA, color: OL.putih }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% 50%, ${OL.navy1} 0%, ${OL.navy0} 75%)` }} />
    <svg style={{ position: 'absolute', left: 0, top: 100, overflow: 'visible' }} width={1080} height={1920}>
      <rect x={TM.x - 42} y={TM.atas - 50} width={84} height={TM.bawah - TM.atas + 120} rx={42} fill="#141a3a" stroke={OL.abuTerang} strokeWidth={5} />
      <circle cx={TM.x} cy={TM.bola} r={70} fill="#141a3a" stroke={OL.abuTerang} strokeWidth={5} />
      <rect x={TM.x - 24} y={yT(95)} width={48} height={TM.bola - yT(95)} rx={24} fill={PANAS} />
      <circle cx={TM.x} cy={TM.bola} r={52} fill={PANAS} />
      <circle cx={TM.x} cy={TM.bola} r={110} fill={PANAS} opacity={0.2} />
    </svg>
    <div style={{ position: 'absolute', left: 90, top: 740, width: 440, height: 440, borderRadius: 24, background: 'linear-gradient(150deg, #c9cfe6, #7a83a8)', border: `6px solid ${OL.abuTerang}`, boxShadow: `0 0 60px ${PANAS}` }}>
      <div style={{ position: 'absolute', inset: 46, borderRadius: 14, background: 'linear-gradient(150deg, #e6e9f5, #a3abc9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 44, color: '#2a3266' }}>Ryzen 7000</div>
    </div>
    <div style={{ position: 'absolute', left: 70, top: 190, fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: OL.lime }}>RYZEN 7000</div>
    <div style={{ position: 'absolute', left: 64, top: 250, fontWeight: 800, fontSize: 210, lineHeight: 0.95, color: PANAS, textShadow: `0 0 40px ${PANAS}66` }}>95°C</div>
    <div style={{ position: 'absolute', left: 70, top: 470, fontWeight: 800, fontSize: 84, lineHeight: 1 }}>itu normal?</div>
    <></>
    <div style={{ position: 'absolute', left: 70, top: 1440, fontWeight: 800, fontSize: 76, lineHeight: 1.05 }}>
      kata AMD: <span style={{ color: OL.emas }}>memang dirancang</span>
    </div>
    <GrainOL />
  </AbsoluteFill>
);
