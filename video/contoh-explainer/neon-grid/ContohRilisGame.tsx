// Frame hero (pembuka, tengah, puncak): 15, 825, 1375.
// contoh explainer generik O9 (konten contoh): "2024 ada 19.003 game baru di Steam, ±52 per hari (hitungan kami)".
// SERI generik (seri/seriOL.tsx), aksen O9 = LANGIT (game baru); MAGENTA = Limited Games; EMAS = angka penting.
// SATU DUNIA: dinding ubin game generik (1 ubin = 100 game, digambar sendiri, tanpa logo/sampul game). Hook: ubin keisi 0→19.003 →
// stempel rekor (SteamDB) → kalender 366 hari, ±52/hari → jam: >2 game per jam → batang 2023 14.311 vs 2024 19.003 → ubin jadi magenta
// 15.009 Limited → kartu profil: trading card kekunci, batas pemain & penjualan belum lewat → Limited 2024 > total 2023 → Steam Direct
// US$100, balik setelah pendapatan US$1.000 → CTA → loop.
// Fakta: SteamDB via GamingOnLinux (2/1/2025), KitGuru (2023: 14.311), Steamworks (Steam Direct US$100, balik setelah US$1.000).
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, Img, random, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { AngkaJalan, Bunyi, Dunia, EASE, GarisDigambar, hitungKamera, maju, pegas, SapuSorot, Stempel, useDetik, type KunciKamera, type Kata, type Sfx } from "../../src/gerak";
import { MONO, SAIRA } from "../../src/gerak/font";
import { bunyi, ChipAngka, ChipKecil, CtaOL, GrainOL, HudSeri, LatarOL, lerp, OL, generikReaksi, ScrimAtas, SubOL, TeksOL, type DataOL, type Kalimat } from "../../src/gerak/seri/neon-grid/seriOL";
import { Batang, cariKata, jendela, Jam, Ket, Panel, sfxDasar, sumberDi, waktuDasar } from "../../src/gerak/seri/neon-grid/bantuOL";

const BARU = OL.langit;
const LIM = OL.magenta;
const UB = { c: 19, r: 10, s: 42, g: 4 }; // 190 ubin × 100 game
const UBW = UB.c * (UB.s + UB.g) - UB.g;
const UBH = UB.r * (UB.s + UB.g) - UB.g;
const UX = (1080 - UBW) / 2;
const UY = 620;
const WARNA_UBIN = ['#4cc3ff', '#3a9fe0', '#6fd2ff', '#2f86c9', '#58b8f0'];

const GABUNG = [
  { kata: ['dua', 'ribu', 'dua', 'puluh', 'empat'], jadi: '2024' },
  { kata: ['sembilan', 'belas', 'ribu', 'tiga'], jadi: '19.003' },
  { kata: ['tiga', 'ratus', 'enam', 'puluh', 'enam'], jadi: '366' },
  { kata: ['lima', 'puluh', 'dua'], jadi: '52' },
  { kata: ['dua', 'game'], jadi: '2 game' },
  { kata: ['empat', 'belas', 'ribu', 'tiga', 'ratus', 'sebelas'], jadi: '14.311' },
  { kata: ['sembilan', 'belas', 'ribu'], jadi: '19.000' },
  { kata: ['lima', 'belas', 'ribu'], jadi: '15.000' },
  { kata: ['seratus', 'dolar'], jadi: '100 dolar' },
  { kata: ['seribu', 'dolar'], jadi: '1.000 dolar' },
];

function waktuO9(d: Kata[], total: number, kal?: Kalimat[]) {
  const CAD: [number, number][] = [
    [0.18, 5.62], [6.12, 10.88], [11.4, 17.14], [17.66, 20.82], [21.28, 25.3], [25.78, 31.6], [32.06, 38.8], [39.3, 44.14], [44.58, 51.48], [51.92, 55.98],
  ];
  const B = waktuDasar(kal, CAD, total);
  const s = B.s;
  const k = cariKata(d);
  const sembilan1 = k('sembilan', s[0].mulai, 2.62);
  const game1 = k('game', sembilan1, 4.06);
  const steamdb2 = k('steamdb', s[1].mulai, 7.14);
  const rekor2 = k('rekor', steamdb2, 8.68);
  const tiga3 = k('tiga', s[2].mulai, 12.42);
  const hari3 = k('hari', tiga3, 13.44);
  const lima3 = k('lima', hari3, 15.68);
  const jam4 = k('jam', s[3].mulai, 18.8);
  const dua4 = k('dua', jam4, 20.24);
  const empat5 = k('empat', s[4].mulai, 23.4);
  const sebelas5 = k('sebelas', empat5, 24.86);
  const lima6 = k('lima', s[5].mulai, 27.78);
  const limited6 = k('limited', lima6, 30.0);
  const fitur7 = k('fitur', s[6].mulai, 33.2);
  const trading7 = k('trading', fitur7, 34.16);
  const belum7 = k('belum', trading7, 34.78);
  const batas7 = k('batas', belum7, 37.3);
  const pemain7 = k('pemain', batas7, 37.6);
  const penjualan7 = k('penjualan', pemain7, 38.2);
  const lebih8 = k('lebih', s[7].mulai, 41.32);
  const total8 = k('total', lebih8, 42.3);
  const bayar9 = k('bayar', s[8].mulai, 46.38);
  const seratus9 = k('seratus', bayar9, 46.74);
  const dibalikin9 = k('dibalikin', seratus9, 48.46);
  const seribu9 = k('seribu', dibalikin9, 50.74);
  const simpan = k('simpan', s[9].mulai, 51.92);
  const follow = k('follow', simpan, 54.54);
  return {
    ...B, sembilan1, game1, steamdb2, rekor2, tiga3, hari3, lima3, jam4, dua4, empat5, sebelas5, lima6, limited6, fitur7, trading7, belum7, batas7,
    pemain7, penjualan7, lebih8, total8, bayar9, seratus9, dibalikin9, seribu9, simpan, follow,
    isi1: [0.3, game1 + 0.2] as [number, number],
    ctaKeluar: Math.max(follow + 0.9, total - 1.75),
  };
}
type W = ReturnType<typeof waktuO9>;

// ======================================================================================================
function kunciKamera(T: W): KunciKamera[] {
  const S = T.s;
  const pelan = Easing.inOut(Easing.sin);
  return [
    { t: 0, x: 540, y: 960, z: 1.0 },
    { t: T.game1, x: 540, y: 930, z: 1.05, ease: pelan },
    { t: S[1].mulai + 0.2, x: 540, y: 930, z: 1.03 },
    { t: S[2].mulai - 0.1, x: 540, y: 960, z: 1.0, ease: pelan },
    { t: S[5].mulai, x: 540, y: 960, z: 1.0, ease: pelan },
    { t: T.limited6, x: 540, y: 920, z: 1.07 },
    { t: S[6].mulai - 0.1, x: 540, y: 920, z: 1.08, ease: pelan },
    { t: S[6].mulai + 0.5, x: 540, y: 960, z: 1.0 },
    { t: T.pulang, x: 540, y: 958, z: 1.02, ease: pelan },
    { t: T.loop, x: 540, y: 960, z: 1.0, ease: pelan },
  ];
}

export const ContohRilisGame: React.FC<DataOL> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuO9(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const kunci = useMemo(() => kunciKamera(T), [T]);
  const S = T.s;
  const kam = hitungKamera(kunci, t, fps, {
    drift: 2.2 * (1 - maju(t, T.pulang, T.loop)) * maju(t, 0, 0.6),
    getar: [
      { t: T.game1 + 0.2, kuat: 7 },
      { t: T.rekor2 + 0.1, kuat: 7 },
      { t: T.lima3 + 0.5, kuat: 5 },
      { t: T.limited6 + 0.3, kuat: 6 },
      { t: T.total8 + 0.4, kuat: 6 },
    ],
  });
  return (
    <AbsoluteFill style={{ background: OL.navy0, color: OL.putih, overflow: 'hidden', fontFamily: SAIRA }}>
      <LatarOL kam={kam} aksen={BARU} />
      <Dunia kamera={kam} tinggiDunia={1920} lebarDunia={1080} blurGerak={null}>
        <Dinding T={T} />
      </Dunia>
      <Kalender T={T} />
      <JamGame T={T} />
      <BandingTahun T={T} />
      <KartuLimited T={T} />
      <SteamDirect T={T} />
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
// Dinding ubin (dunia): S1–S2 keisi + rekor, S6 jadi Limited (150 ubin), loop
const Dinding: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const h1 = 1 - maju(t, S[2].mulai - 0.15, S[2].mulai + 0.25, EASE.keluar);
  const h6 = maju(t, S[5].mulai - 0.15, S[5].mulai + 0.3) * (1 - maju(t, S[6].mulai - 0.15, S[6].mulai + 0.25, EASE.keluar));
  const hP = maju(t, T.pulang - 0.5, T.pulang + 0.1);
  const o = Math.max(h1, h6, hP);
  if (o <= 0.001) return null;
  const akhir = t > T.pulang - 0.6;
  const isi = akhir ? 0 : t < S[2].mulai ? maju(t, T.isi1[0], T.isi1[1], Easing.inOut(Easing.quad)) : 1;
  const n = Math.floor(190 * isi + 1e-6);
  const lim = h6 > 0 ? maju(t, T.lima6 - 0.3, T.limited6 + 0.3, Easing.inOut(Easing.quad)) : 0;
  const nLim = Math.floor(150 * lim + 1e-6);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: o }}>
      <div style={{ position: 'absolute', left: UX - 24, top: UY - 24, width: UBW + 48, height: UBH + 48, borderRadius: 22, border: `4px solid ${OL.garis}`, background: 'rgba(8,12,28,0.55)' }} />
      <svg style={{ position: 'absolute', left: UX, top: UY, overflow: 'visible' }} width={UBW} height={UBH}>
        {Array.from({ length: 190 }, (_, i) => {
          const c = i % UB.c;
          const r = Math.floor(i / UB.c);
          const x = c * (UB.s + UB.g);
          const y = r * (UB.s + UB.g);
          const ada = i < n;
          // ubin jatuh dikit pas baru masuk
          const umur = ada && t < S[2].mulai ? Math.min(1, (isi * 190 - i) / 6) : 1;
          const isLim = i < nLim;
          const warna = isLim ? LIM : WARNA_UBIN[Math.floor(random(`u${i}`) * WARNA_UBIN.length)];
          return ada ? (
            <g key={i} transform={`translate(0 ${(1 - umur) * -30})`} opacity={umur}>
              <rect x={x} y={y} width={UB.s} height={UB.s} rx={7} fill={warna} />
              <rect x={x + 7} y={y + 8} width={UB.s - 14} height={UB.s * 0.42} rx={4} fill={OL.navy0} opacity={0.35} />
              <rect x={x + 7} y={y + UB.s * 0.68} width={UB.s * 0.5} height={5} rx={2} fill={OL.navy0} opacity={0.45} />
            </g>
          ) : (
            <rect key={i} x={x} y={y} width={UB.s} height={UB.s} rx={7} fill="none" stroke={OL.garis} strokeWidth={2} />
          );
        })}
      </svg>
      <Ket x={UX + UBW} y={UY + UBH + 40} rata="kanan" warna={OL.abuTerang} ukuran={26}>
        1 kotak = 100 game
      </Ket>
      {/* angka */}
      {h1 > 0 && !akhir ? (
        <div style={{ position: 'absolute', left: UX, top: UY + UBH + 30, fontFamily: SAIRA, fontWeight: 800, fontSize: 110, lineHeight: 1, color: BARU, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', opacity: h1 }}>
          <AngkaJalan dari={0} ke={19003} progress={isi} />
          <span style={{ fontSize: 56, color: OL.putih }}> game</span>
        </div>
      ) : null}
      {h6 > 0 ? (
        <div style={{ position: 'absolute', left: UX, top: UY + UBH + 30, fontFamily: SAIRA, fontWeight: 800, fontSize: 110, lineHeight: 1, color: LIM, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', opacity: h6 }}>
          <AngkaJalan dari={0} ke={15009} progress={lim} />
          <span style={{ fontSize: 56, color: OL.putih }}> Limited</span>
        </div>
      ) : null}
      {/* S2: stempel rekor */}
      {h1 > 0 && t > T.rekor2 - 0.05 && !akhir ? (
        <Stempel mulai={T.rekor2} rot={-9} keluar={S[2].mulai - 0.25} gaya={{ position: 'absolute', left: 300, top: UY + 150 }}>
          <div style={{ padding: '6px 30px', borderRadius: 14, border: `7px solid ${OL.emas}`, color: OL.emas, fontFamily: SAIRA, fontWeight: 800, fontSize: 104, background: `${OL.navy0}ee`, whiteSpace: 'nowrap' }}>REKOR</div>
        </Stempel>
      ) : null}
      {h1 > 0 && t > T.steamdb2 - 0.2 && !akhir ? <ChipAngka x={540} y={UY - 60} o={maju(t, T.steamdb2 - 0.2, T.steamdb2 + 0.1) * h1} ukuran={40} warna={OL.emas} isi="data SteamDB" /> : null}
    </div>
  );
};

// S3: kalender 366 hari, ±52 game per hari
const Kalender: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const { m, k } = jendela(t, S[2].mulai, S[3].mulai);
  const p = maju(t, T.tiga3 - 0.2, T.hari3 + 0.4, EASE.linear);
  const n = Math.floor(366 * p + 1e-6);
  const hasil = maju(t, T.lima3 - 0.2, T.lima3 + 0.5, EASE.kamera);
  const hit = pegas(t, T.lima3 + 0.5, fps, { damping: 9, stiffness: 200, mass: 0.5 });
  const kol = 24;
  const s = 30;
  return (
    <Panel x={90} y={560} w={900} h={700} m={m} k={k} judul="2024 · tahun kabisat" warna={BARU}>
      <svg style={{ position: 'absolute', left: 90, top: 90 }} width={kol * (s + 1)} height={16 * (s + 1)}>
        {Array.from({ length: 366 }, (_, i) => (
          <rect key={i} x={(i % kol) * (s + 1)} y={Math.floor(i / kol) * (s + 1)} width={s - 3} height={s - 3} rx={5} fill={i < n ? BARU : '#1a2148'} opacity={i < n ? 0.9 : 1} />
        ))}
      </svg>
      <div style={{ position: 'absolute', left: 40, top: 680, translate: '0 -100%', fontFamily: SAIRA, fontWeight: 800, fontSize: 58, color: OL.putih, whiteSpace: 'nowrap' }}>
        19.003 ÷ <AngkaJalan dari={0} ke={366} progress={p} lantai /> hari
      </div>
      <div style={{ position: 'absolute', left: 860, top: 684, translate: '-100% -100%', fontFamily: SAIRA, fontWeight: 800, fontSize: 90, lineHeight: 1, color: OL.emas, whiteSpace: 'nowrap', opacity: hasil, scale: String(1 + 0.08 * Math.sin(Math.min(1, hit) * Math.PI)) }}>
        ±<AngkaJalan dari={0} ke={52} progress={hasil} />/hari
      </div>
    </Panel>
  );
};

// S4: jam — lebih dari 2 game baru tiap jam
const JamGame: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const { m, k, o } = jendela(t, S[3].mulai, S[4].mulai);
  if (o <= 0.001) return null;
  const p = maju(t, S[3].mulai, S[4].mulai + 0.2, EASE.linear);
  const jatuh = maju(t, T.dua4 - 0.6, T.dua4 + 0.3);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, translate: `0 ${(1 - m) * 60 + k * 30}px` }}>
      <Jam x={330} y={880} r={210} p={p} putaran={1} warna={BARU} />
      {[0, 1, 2].map((i) => {
        const q = maju(t, T.dua4 - 0.6 + i * 0.25, T.dua4 - 0.3 + i * 0.25, Easing.out(Easing.quad));
        return (
          <svg key={i} style={{ position: 'absolute', left: 640 + i * 120, top: 760 + (1 - q) * -200, opacity: q * (i === 2 ? 0.45 : 1), overflow: 'visible' }} width={100} height={100}>
            <rect x={0} y={0} width={100} height={100} rx={14} fill={WARNA_UBIN[i]} />
            <rect x={16} y={18} width={68} height={42} rx={6} fill={OL.navy0} opacity={0.35} />
          </svg>
        );
      })}
      <div style={{ position: 'absolute', left: 640, top: 900, fontFamily: SAIRA, fontWeight: 800, fontSize: 64, lineHeight: 1.05, color: OL.putih, opacity: jatuh, whiteSpace: 'nowrap' }}>
        &gt; 2 game
        <br />
        <span style={{ color: BARU }}>tiap jam</span>
      </div>
      <Ket x={640} y={1070} warna={OL.abuTerang} ukuran={26} o={jatuh}>
        52 ÷ 24 jam ≈ 2,2
      </Ket>
    </div>
  );
};

// S5: 2023 (14.311) vs 2024 (19.003); S8: Limited 2024 (15.009) vs total 2023 (14.311)
const BandingTahun: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const j5 = jendela(t, S[4].mulai, S[5].mulai);
  const j8 = jendela(t, S[7].mulai, S[8].mulai);
  const L = 600;
  const MAX = 19003;
  const out: React.ReactNode[] = [];
  if (j5.o > 0.001) {
    const p23 = maju(t, T.empat5 - 0.3, T.sebelas5, EASE.kamera);
    out.push(
      <Panel key="s5" x={90} y={600} w={900} h={560} m={j5.m} k={j5.k} judul="game baru di steam" warna={BARU}>
        <Batang x={40} y={190} w={L} h={90} p={1} warna={BARU} label="2024" nilai="19.003" />
        <Batang x={40} y={410} w={L} h={90} p={(14311 / MAX) * p23} warna="#5a6496" label="2023" nilai={<AngkaJalan dari={0} ke={14311} progress={p23} />} />
      </Panel>,
    );
  }
  if (j8.o > 0.001) {
    const pL = maju(t, S[7].mulai + 0.2, S[7].mulai + 0.9, EASE.kamera);
    const sorot = maju(t, T.lebih8 - 0.1, T.lebih8 + 0.3);
    const hit = pegas(t, T.total8 + 0.4, fps, { damping: 9, stiffness: 200, mass: 0.5 });
    out.push(
      <Panel key="s8" x={90} y={600} w={900} h={560} m={j8.m} k={j8.k} judul="limited 2024 vs total 2023" warna={LIM}>
        <Batang x={40} y={190} w={L} h={90} p={(15009 / MAX) * pL} warna={LIM} label="Limited 2024" nilai={<AngkaJalan dari={0} ke={15009} progress={pL} />} />
        <Batang x={40} y={410} w={L} h={90} p={(14311 / MAX) * maju(t, T.total8 - 0.3, T.total8 + 0.4, EASE.kamera)} warna="#5a6496" label="total 2023" nilai={<AngkaJalan dari={0} ke={14311} progress={maju(t, T.total8 - 0.3, T.total8 + 0.4, EASE.kamera)} />} />
        {sorot > 0 ? (
          <div style={{ position: 'absolute', left: 40 + L * (14311 / MAX), top: 150, width: 4, height: 380, background: OL.emas, opacity: sorot }} />
        ) : null}
        {t > T.total8 + 0.4 ? (
          <div style={{ position: 'absolute', left: 560, top: 300, fontFamily: SAIRA, fontWeight: 800, fontSize: 96, color: OL.emas, scale: String(0.8 + 0.2 * Math.min(1.2, hit)) }}>&gt;</div>
        ) : null}
      </Panel>,
    );
  }
  return <>{out}</>;
};

// S7: kartu profil game Limited — fitur profil (trading card) belum nyala, batas pemain & penjualan belum lewat
const KartuLimited: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const { m, k } = jendela(t, S[6].mulai, S[7].mulai);
  const oKartu = maju(t, T.trading7 - 0.2, T.trading7 + 0.2);
  const kunci = maju(t, T.belum7 - 0.1, T.belum7 + 0.2);
  const oBatas = maju(t, T.batas7 - 0.2, T.batas7 + 0.2);
  const pP = maju(t, T.pemain7 - 0.1, T.pemain7 + 0.6, EASE.kamera);
  const pJ = maju(t, T.penjualan7 - 0.1, T.penjualan7 + 0.6, EASE.kamera);
  return (
    <Panel x={90} y={560} w={900} h={700} m={m} k={k} judul="limited games" warna={LIM}>
      <div style={{ position: 'absolute', left: 40, top: 90, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: OL.abuTerang, opacity: maju(t, T.fitur7 - 0.2, T.fitur7 + 0.2) }}>fitur profil Steam</div>
      {/* trading card generik (3 kartu) */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: 'absolute', left: 60 + i * 150, top: 150, width: 130, height: 180, borderRadius: 12, background: 'linear-gradient(160deg, #3a4677, #1a2148)', border: `4px solid ${OL.abuTerang}`, opacity: oKartu * (1 - 0.55 * kunci), rotate: `${(i - 1) * 6}deg`, translate: `0 ${(1 - oKartu) * 30}px` }}>
          <div style={{ position: 'absolute', left: 14, top: 14, right: 14, height: 90, borderRadius: 6, background: WARNA_UBIN[i], opacity: 0.6 }} />
        </div>
      ))}
      <div style={{ position: 'absolute', left: 60, top: 350, fontFamily: SAIRA, fontWeight: 800, fontSize: 44, color: OL.putih, opacity: oKartu }}>trading card</div>
      {/* gembok */}
      {kunci > 0 ? (
        <svg style={{ position: 'absolute', left: 230, top: 160, overflow: 'visible', opacity: kunci, scale: String(0.6 + 0.4 * kunci) }} width={120} height={150}>
          <path d="M 25 65 L 25 40 Q 25 5 60 5 Q 95 5 95 40 L 95 65" fill="none" stroke={LIM} strokeWidth={12} />
          <rect x={5} y={60} width={110} height={85} rx={14} fill={LIM} />
          <circle cx={60} cy={100} r={12} fill={OL.navy0} />
        </svg>
      ) : null}
      <div style={{ position: 'absolute', left: 560, top: 200, fontFamily: SAIRA, fontWeight: 800, fontSize: 56, lineHeight: 1.05, color: LIM, opacity: kunci, whiteSpace: 'nowrap' }}>
        belum
        <br />
        dinyalain
      </div>
      {/* batas pemain & penjualan (belum lewat) */}
      <div style={{ position: 'absolute', left: 40, top: 430, width: 820, opacity: oBatas }}>
        {[
          { teks: 'pemain', p: pP },
          { teks: 'penjualan', p: pJ },
        ].map((b, i) => (
          <div key={i} style={{ position: 'absolute', left: 0, top: i * 110, width: 820 }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: OL.abuTerang }}>{b.teks}</div>
            <div style={{ position: 'absolute', left: 0, top: 42, width: 700, height: 40, borderRadius: 10, background: 'rgba(44,56,112,0.55)' }} />
            <div style={{ position: 'absolute', left: 0, top: 42, width: 700 * 0.55 * b.p, height: 40, borderRadius: 10, background: LIM }} />
            <div style={{ position: 'absolute', left: 700 * 0.8, top: 30, width: 6, height: 64, background: OL.emas }} />
            <div style={{ position: 'absolute', left: 700 * 0.8 + 14, top: 46, fontFamily: MONO, fontWeight: 800, fontSize: 24, color: OL.emas, whiteSpace: 'nowrap' }}>batas</div>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// S9: Steam Direct — bayar US$100 per game, dibalikin setelah pendapatan game sampai US$1.000
const SteamDirect: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const { m, k } = jendela(t, S[8].mulai, S[9].mulai);
  const bayar = maju(t, T.seratus9 - 0.2, T.seratus9 + 0.5, EASE.kamera);
  const pend = maju(t, T.dibalikin9 + 0.2, T.seribu9 + 0.4, EASE.kamera);
  const balik = maju(t, T.seribu9 + 0.4, T.seribu9 + 1.0, EASE.kamera);
  const hit = pegas(t, T.seribu9 + 1.0, fps, { damping: 9, stiffness: 200, mass: 0.5 });
  // koin: dari dev (kiri) → Steam (kanan) → balik ke dev
  const kx = lerp(lerp(180, 760, bayar), 180, balik);
  const ky = 300 - Math.sin(bayar * Math.PI) * 80 * (1 - balik) - Math.sin(balik * Math.PI) * 80;
  return (
    <Panel x={90} y={560} w={900} h={700} m={m} k={k} judul="steam direct" warna={OL.emas}>
      {/* developer & toko */}
      <div style={{ position: 'absolute', left: 90, top: 380, width: 180, textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 28, color: OL.abuTerang }}>developer</div>
      <svg style={{ position: 'absolute', left: 110, top: 200, overflow: 'visible' }} width={140} height={160}>
        <circle cx={70} cy={45} r={38} fill={BARU} />
        <path d="M 6 160 Q 6 92 70 92 Q 134 92 134 160 Z" fill={BARU} />
      </svg>
      <div style={{ position: 'absolute', left: 680, top: 200, width: 160, height: 160, borderRadius: 24, background: '#1a2148', border: `5px solid ${OL.abuTerang}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SAIRA, fontWeight: 800, fontSize: 44, color: OL.putih }}>Steam</div>
      {/* koin US$100 */}
      {bayar > 0 ? (
        <div style={{ position: 'absolute', left: kx, top: ky, translate: '-50% -50%', width: 150, height: 150, borderRadius: 75, background: OL.emas, border: `6px solid #d99a1e`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SAIRA, fontWeight: 800, fontSize: 40, color: OL.navy0, scale: String(1 + 0.1 * Math.sin(Math.min(1, hit) * Math.PI)) }}>
          US$100
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: 300, top: 470, translate: '-50% 0', fontFamily: MONO, fontWeight: 800, fontSize: 28, color: OL.emas, opacity: bayar * (1 - balik), whiteSpace: 'nowrap' }}>per game</div>
      {/* pendapatan game → US$1.000 */}
      <div style={{ position: 'absolute', left: 40, top: 540, fontFamily: MONO, fontWeight: 700, fontSize: 28, color: OL.abuTerang, opacity: maju(t, T.dibalikin9, T.dibalikin9 + 0.3) }}>pendapatan game</div>
      <div style={{ position: 'absolute', left: 40, top: 584, width: 640, height: 54, borderRadius: 12, background: 'rgba(44,56,112,0.55)', opacity: maju(t, T.dibalikin9, T.dibalikin9 + 0.3) }} />
      <div style={{ position: 'absolute', left: 40, top: 584, width: 640 * pend, height: 54, borderRadius: 12, background: OL.lime }} />
      <div style={{ position: 'absolute', left: 700, top: 584, fontFamily: SAIRA, fontWeight: 800, fontSize: 54, lineHeight: 1, color: OL.lime, opacity: maju(t, T.dibalikin9, T.dibalikin9 + 0.3), whiteSpace: 'nowrap' }}>
        US$<AngkaJalan dari={0} ke={1000} progress={pend} />
      </div>
      {balik > 0.6 ? <ChipAngka x={180} y={470} o={(balik - 0.6) / 0.4} ukuran={40} warna={OL.lime} isi="dibalikin" /> : null}
    </Panel>
  );
};

// ======================================================================================================
const Teks: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const kj = (n: number) => S[n].mulai - 0.22;
  const sumber = sumberDi(t, S, [
    [0, 'Sumber: SteamDB via GamingOnLinux (2/1/2025)'],
    [2, 'hitungan kami: 19.003 ÷ 366 hari (2024 kabisat) ≈ 52'],
    [3, 'hitungan kami: 52 ÷ 24 jam ≈ 2,2'],
    [4, 'Sumber: KitGuru (2023: 14.311) · SteamDB'],
    [5, 'Sumber: SteamDB via GamingOnLinux (2/1/2025)'],
    [6, 'Sumber: SteamDB (Limited Games) · ilustrasi'],
    [7, 'Sumber: SteamDB, KitGuru'],
    [8, 'Sumber: Steamworks (Steam Direct)'],
    [9, null],
  ]);
  const oSumber = maju(t, 1.4, 1.7) * (1 - maju(t, S[9].mulai - 0.2, S[9].mulai));
  return (
    <>
      <TeksOL label={['steam', '·', '2024']} lMulai={0.12} judul={[{ t: '19.003', mulai: T.sembilan1, warna: BARU }, { t: 'game', mulai: T.game1 - 0.1 }, { t: 'baru', mulai: T.game1 }]} jMulai={T.sembilan1} keluar={kj(1)} ukuran={110} />
      <TeksOL label={['data', 'steamdb']} lMulai={S[1].mulai} judul={[{ t: 'rekor', mulai: T.rekor2, isi: <SapuSorot mulai={T.rekor2 + 0.1} warna={OL.emas} warnaTeks={[OL.putih, OL.navy0]} penuh>rekor</SapuSorot> }, { t: 'terbanyak', mulai: T.rekor2 + 0.3 }]} jMulai={T.rekor2} keluar={kj(2)} ukuran={104} />
      <TeksOL label={['hitungan', 'kami']} lMulai={S[2].mulai} judul={[{ t: '±52', mulai: T.lima3, warna: OL.emas }, { t: 'game', mulai: T.lima3 + 0.3 }, { t: 'per', mulai: T.lima3 + 0.5 }, { t: 'hari', mulai: T.lima3 + 0.7 }]} jMulai={T.lima3} keluar={kj(3)} ukuran={104} />
      <TeksOL label={['artinya']} lMulai={S[3].mulai} judul={[{ t: 'lebih', mulai: T.jam4 }, { t: 'dari', mulai: T.jam4 + 0.15 }, { t: '2', mulai: T.dua4, warna: BARU }, { t: 'game', mulai: T.dua4 + 0.1 }, { t: 'per', mulai: T.dua4 + 0.2 }, { t: 'jam', mulai: T.dua4 + 0.3 }]} jMulai={T.jam4} keluar={kj(4)} ukuran={92} />
      <TeksOL label={['tahun', 'sebelumnya']} lMulai={S[4].mulai} judul={[{ t: '2023:', mulai: S[4].mulai + 0.3 }, { t: '14.311', mulai: T.empat5, warna: OL.abuTerang }, { t: 'game', mulai: T.sebelas5 }]} jMulai={S[4].mulai + 0.3} keluar={kj(5)} ukuran={104} />
      <TeksOL label={['dari', '19.003', 'game']} lMulai={S[5].mulai} judul={[{ t: 'Limited', mulai: T.limited6 - 0.6, warna: LIM }, { t: 'Games:', mulai: T.limited6 - 0.4 }, { t: '15.009', mulai: T.lima6, warna: LIM }]} jMulai={T.lima6} keluar={kj(6)} ukuran={96} />
      <TeksOL label={['limited', 'berarti']} lMulai={S[6].mulai} judul={[{ t: 'fitur', mulai: T.fitur7 }, { t: 'profil', mulai: T.fitur7 + 0.3 }, { t: 'belum', mulai: T.belum7, warna: LIM }, { t: 'dinyalain', mulai: T.belum7 + 0.2 }]} jMulai={T.fitur7} keluar={kj(7)} ukuran={88} />
      <TeksOL label={['limited', '2024']} lMulai={S[7].mulai} judul={[{ t: 'Limited', mulai: S[7].mulai + 0.3, warna: LIM }, { t: '2024', mulai: S[7].mulai + 0.4, warna: LIM }, { t: '>', mulai: T.lebih8, warna: OL.emas }, { t: 'total', mulai: T.total8 }, { t: '2023', mulai: T.total8 + 0.2 }]} jMulai={S[7].mulai + 0.3} keluar={kj(8)} ukuran={88} />
      <TeksOL label={['steam', 'direct']} lMulai={S[8].mulai} judul={[{ t: 'US$100', mulai: T.seratus9, warna: OL.emas }, { t: 'per', mulai: T.seratus9 + 0.4 }, { t: 'game', mulai: T.seratus9 + 0.55 }]} jMulai={T.seratus9} keluar={kj(9)} ukuran={104} />
      <TeksOL label={['simpan', '&', 'follow']} lMulai={S[9].mulai} judul={[{ t: 'buat', mulai: T.simpan + 0.5 }, { t: 'nyari', mulai: T.simpan + 0.6 }, { t: 'game', mulai: T.simpan + 0.75, warna: OL.emas }, { t: 'baru', mulai: T.simpan + 0.85, warna: OL.emas }]} jMulai={T.simpan + 0.5} keluar={T.ctaKeluar} ukuran={92} />
      {sumber ? <ChipKecil x={90} y={1330} o={oSumber} teks={sumber} /> : null}
    </>
  );
};

// ======================================================================================================
function daftarSfx(T: W): Sfx[] {
  const S = T.s;
  const isi = Array.from({ length: 12 }, (_, i) => bunyi('tik', T.isi1[0] + ((T.isi1[1] - T.isi1[0]) * (i + 1)) / 12, 0.14));
  return [
    ...sfxDasar(S, T.simpan, T.follow, T.pulang),
    ...isi,
    bunyi('kunci', T.game1 + 0.2, 0.4),
    bunyi('pop', T.steamdb2, 0.3),
    bunyi('hantam', T.rekor2 + 0.08, 0.45),
    bunyi('riser', T.tiga3 - 0.4, 0.2),
    bunyi('kunci', T.lima3 + 0.5, 0.35),
    ...[0, 1, 2].map((i) => bunyi('pop', T.dua4 - 0.3 + i * 0.25, 0.3)),
    bunyi('swish', T.empat5 - 0.3, 0.3),
    bunyi('riser', T.lima6 - 0.5, 0.2),
    bunyi('kunci', T.limited6 + 0.3, 0.35),
    bunyi('pop', T.trading7, 0.3),
    bunyi('klik', T.belum7, 0.4),
    bunyi('swish', T.batas7, 0.3),
    bunyi('swish', S[7].mulai + 0.2, 0.3),
    bunyi('hantam', T.total8 + 0.4, 0.4),
    bunyi('whooshA', T.seratus9 - 0.2, 0.3),
    bunyi('klik', T.seratus9 + 0.5, 0.35),
    bunyi('riser', T.dibalikin9 + 0.2, 0.2),
    bunyi('kunci', T.seribu9 + 1.0, 0.4),
  ];
}

// ======================================================================================================
export const O9Sampul: React.FC = () => (
  <AbsoluteFill style={{ background: OL.navy0, overflow: 'hidden', fontFamily: SAIRA, color: OL.putih }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% 50%, ${OL.navy1} 0%, ${OL.navy0} 75%)` }} />
    <svg style={{ position: 'absolute', left: UX, top: UY + 160, overflow: 'visible' }} width={UBW} height={UBH}>
      {Array.from({ length: 190 }, (_, i) => (
        <rect key={i} x={(i % UB.c) * (UB.s + UB.g)} y={Math.floor(i / UB.c) * (UB.s + UB.g)} width={UB.s} height={UB.s} rx={7} fill={WARNA_UBIN[Math.floor(random(`u${i}`) * WARNA_UBIN.length)]} />
      ))}
    </svg>
    <div style={{ position: 'absolute', left: 70, top: 190, fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: OL.lime }}>GAME BARU DI STEAM · 2024</div>
    <div style={{ position: 'absolute', left: 64, top: 250, fontWeight: 800, fontSize: 200, lineHeight: 0.95, color: BARU, textShadow: `0 0 40px ${BARU}66` }}>19.003</div>
    <div style={{ position: 'absolute', left: 70, top: 460, fontWeight: 800, fontSize: 84, lineHeight: 1 }}>
      ±<span style={{ color: OL.emas }}>52 game</span> tiap hari
    </div>
    <></>
    <div style={{ position: 'absolute', left: 70, top: 1400, fontWeight: 800, fontSize: 76, lineHeight: 1.05 }}>
      rekor <span style={{ color: OL.emas }}>terbanyak</span>
    </div>
    <GrainOL />
  </AbsoluteFill>
);
