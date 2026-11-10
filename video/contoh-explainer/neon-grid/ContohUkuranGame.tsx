// Frame hero (pembuka, tengah, puncak): 15, 844, 1406.
// contoh explainer generik O4 (konten contoh): "Titanfall PC 48 GB, 35 GB-nya audio tanpa kompresi biar PC dual-core kuat".
// SERI generik (seri/seriOL.tsx), aksen O4 = KORAL (audio); LANGIT = peta & visual; LIME = jalanin game / aman.
// SATU DUNIA: tumpukan instalasi 48 blok × 1 GB (digambar sendiri, tanpa logo/aset game). Hook: blok keisi 0→48 GB, 35 blok jadi
// audio → kartu game generik (tembak-tembakan multiplayer, Respawn, 2014) → audio dikompres = kotak kecil, dibuka dulu baru diputar →
// decompress dikerjain CPU → kutipan Baker + CPU 2 core: 1 core kebanyakan buat audio → syarat minimum 2 core → audio disimpen tanpa
// kompresi, core balik buat game → sisa 13 GB peta & visual → Xbox One < 17 GB (decoder audio bawaan) → PC menengah ke atas aman → CTA → loop.
// Fakta: PC Gamer, Game Informer, Shacknews (11/3/2014, ngutip Eurogamer) + hitungan kami (35 ÷ 48 ≈ 73%).
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { AngkaJalan, Bunyi, Dunia, EASE, GarisDigambar, hitungKamera, maju, pathLingkarTangan, pegas, SapuSorot, Stempel, useDetik, type KunciKamera, type Kata, type Sfx } from "../../src/gerak";
import { MONO, SAIRA } from "../../src/gerak/font";
import { bunyi, ChipAngka, ChipKecil, CtaOL, GrainOL, HudSeri, LatarOL, lerp, OL, generikReaksi, ScrimAtas, SubOL, TeksOL, type DataOL, type Kalimat } from "../../src/gerak/seri/neon-grid/seriOL";
import { cariKata, jendela, Ket, Panel, pathCentang, sfxDasar, sumberDi, waktuDasar } from "../../src/gerak/seri/neon-grid/bantuOL";

const AUD = OL.koral;
const VIS = OL.langit;
const GAME = OL.lime;
// tumpukan 6 × 8 blok (1 blok = 1 GB), diisi dari bawah
const TP = { x: 150, y: 600, c: 6, r: 8, bw: 120, bh: 60, g: 12 };
const TPW = TP.c * (TP.bw + TP.g) - TP.g;
const TPH = TP.r * (TP.bh + TP.g) - TP.g;

const GABUNG = [
  { kata: ['empat', 'puluh', 'delapan', 'gb'], jadi: '48 GB' },
  { kata: ['tiga', 'puluh', 'lima', 'gb'], jadi: '35 GB' },
  { kata: ['dua', 'ribu', 'empat', 'belas'], jadi: '2014' },
  { kata: ['tiga', 'belas', 'gb'], jadi: '13 GB' },
  { kata: ['tujuh', 'belas', 'gb'], jadi: '17 GB' },
];

function waktuO4(d: Kata[], total: number, kal?: Kalimat[]) {
  const CAD: [number, number][] = [
    [0.1, 7.26], [7.7, 12.44], [12.9, 17.22], [17.64, 22.4], [22.82, 29.18], [29.54, 32.74], [33.22, 38.24], [38.7, 42.42], [42.8, 47.64], [48.04, 52.18], [52.54, 57.38],
  ];
  const B = waktuDasar(kal, CAD, total);
  const s = B.s;
  const k = cariKata(d);
  const empat1 = k('empat', s[0].mulai, 2.12);
  const gb1 = k('gb', empat1, 2.94);
  const tiga1 = k('tiga', gb1, 4.04);
  const gb1b = k('gb', tiga1, 4.76);
  const audio1 = k('audio', gb1b, 5.94);
  const tanpa1 = k('tanpa', audio1, 6.42);
  const game2 = k('game', s[1].mulai, 8.58);
  const multi2 = k('multiplayer', game2, 9.34);
  const respawn2 = k('respawn', multi2, 10.12);
  const rilis2 = k('rilis', respawn2, 10.9);
  const dikompres3 = k('dikompres', s[2].mulai, 13.38);
  const kecil3 = k('kecil', dikompres3, 14.46);
  const dibuka3 = k('dibuka', kecil3, 15.8);
  const diputar3 = k('diputar', dibuka3, 16.66);
  const decompress4 = k('decompress', s[3].mulai, 19.24);
  const cpu4 = k('cpu', decompress4, 21.94);
  const richard5 = k('richard', s[4].mulai, 23.16);
  const dual5 = k('dual', richard5, 25.7);
  const sebagian5 = k('sebagian', dual5, 26.8);
  const core5 = k('core', sebagian5, 27.8);
  const audio5 = k('audio', core5, 28.7);
  const dua6 = k('dua', s[5].mulai, 30.6);
  const syarat6 = k('syarat', dua6, 31.58);
  const tanpa7 = k('tanpa', s[6].mulai, 34.76);
  const cpu7 = k('cpu', tanpa7, 36.4);
  const game7 = k('game', cpu7, 37.98);
  const tiga8 = k('tiga', s[7].mulai, 39.68);
  const peta8 = k('peta', tiga8, 41.16);
  const visual8 = k('visual', peta8, 41.82);
  const xbox9 = k('xbox', s[8].mulai, 43.24);
  const tujuh9 = k('tujuh', xbox9, 44.16);
  const decoder9 = k('decoder', tujuh9, 46.4);
  const menengah10 = k('menengah', s[9].mulai, 49.52);
  const gak10 = k('gak', menengah10, 51.24);
  const simpan = k('simpan', s[10].mulai, 52.54);
  const follow = k('follow', simpan, 55.88);
  return {
    ...B, empat1, gb1, tiga1, gb1b, audio1, tanpa1, game2, multi2, respawn2, rilis2, dikompres3, kecil3, dibuka3, diputar3, decompress4, cpu4,
    richard5, dual5, sebagian5, core5, audio5, dua6, syarat6, tanpa7, cpu7, game7, tiga8, peta8, visual8, xbox9, tujuh9, decoder9, menengah10, gak10,
    simpan, follow,
    isi1: [0.3, gb1 + 0.4] as [number, number],
    merah1: [tiga1 - 0.1, gb1b + 0.5] as [number, number],
    ctaKeluar: Math.max(follow + 0.9, total - 1.75),
  };
}
type W = ReturnType<typeof waktuO4>;

// ======================================================================================================
function kunciKamera(T: W): KunciKamera[] {
  const S = T.s;
  const pelan = Easing.inOut(Easing.sin);
  return [
    { t: 0, x: 540, y: 960, z: 1.0 },
    { t: T.gb1 + 0.3, x: 540, y: 930, z: 1.05, ease: pelan },
    { t: T.audio1, x: 540, y: 960, z: 1.0 },
    { t: S[1].mulai, x: 540, y: 960, z: 1.0, ease: pelan },
    { t: S[7].mulai - 0.2, x: 540, y: 960, z: 1.0 },
    { t: S[7].mulai + 0.6, x: 540, y: 990, z: 1.1 },
    { t: S[8].mulai - 0.1, x: 540, y: 990, z: 1.11, ease: pelan },
    { t: S[8].mulai + 0.5, x: 540, y: 960, z: 1.0 },
    { t: T.pulang, x: 540, y: 958, z: 1.02, ease: pelan },
    { t: T.loop, x: 540, y: 960, z: 1.0, ease: pelan },
  ];
}

export const ContohUkuranGame: React.FC<DataOL> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuO4(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const kunci = useMemo(() => kunciKamera(T), [T]);
  const S = T.s;
  const kam = hitungKamera(kunci, t, fps, {
    drift: 2.2 * (1 - maju(t, T.pulang, T.loop)) * maju(t, 0, 0.6),
    getar: [
      { t: T.gb1 + 0.4, kuat: 7 },
      { t: T.gb1b + 0.5, kuat: 6 },
      { t: T.core5 + 0.3, kuat: 6 },
      { t: T.syarat6 + 0.3, kuat: 6 },
      { t: T.gak10 + 0.2, kuat: 5 },
    ],
  });
  return (
    <AbsoluteFill style={{ background: OL.navy0, color: OL.putih, overflow: 'hidden', fontFamily: SAIRA }}>
      <LatarOL kam={kam} aksen={AUD} />
      <Dunia kamera={kam} tinggiDunia={1920} lebarDunia={1080} blurGerak={null}>
        <Tumpukan T={T} />
      </Dunia>
      <Konsol T={T} />
      <KartuGame T={T} />
      <Kompres T={T} />
      <CpuKerja T={T} />
      <SyaratMin T={T} />
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
// ikon kecil di blok: gelombang (audio) / peta (visual)
const Gelombang: React.FC<{ x: number; y: number; w: number; h: number; t: number; o?: number; warna?: string; seed?: number }> = ({ x, y, w, h, t, o = 1, warna = OL.navy0, seed = 0 }) => (
  <g opacity={o}>
    {Array.from({ length: 9 }, (_, i) => {
      const a = (0.35 + 0.65 * Math.abs(Math.sin(i * 1.9 + seed + t * 6))) * h;
      return <rect key={i} x={x + (i * w) / 9 + 2} y={y + (h - a) / 2} width={w / 9 - 5} height={a} rx={3} fill={warna} />;
    })}
  </g>
);

// Tumpukan instalasi (dunia): S1 isi + jadi audio; S8 sorot 13 GB visual; S9 mengecil ke kiri (banding Xbox); loop
const Tumpukan: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const hadir1 = 1 - maju(t, S[1].mulai - 0.15, S[1].mulai + 0.25, EASE.keluar);
  const hadir8 = maju(t, S[7].mulai - 0.2, S[7].mulai + 0.3) * (1 - maju(t, S[9].mulai - 0.15, S[9].mulai + 0.2, EASE.keluar));
  const hadirP = maju(t, T.pulang - 0.5, T.pulang + 0.1);
  const o = Math.max(hadir1, hadir8, hadirP);
  if (o <= 0.001) return null;
  const awal = t < S[1].mulai || t > T.pulang - 0.6;
  const isi = awal && t > T.pulang - 0.6 ? 0 : t < S[1].mulai ? maju(t, T.isi1[0], T.isi1[1], EASE.linear) : 1;
  const merah = awal && t > T.pulang - 0.6 ? 0 : t < S[1].mulai ? maju(t, T.merah1[0], T.merah1[1], EASE.linear) : 1;
  const nIsi = Math.floor(48 * isi + 1e-6);
  const nMerah = Math.floor(35 * merah + 1e-6);
  const sorotVis = t > S[7].mulai - 0.2 && t < S[9].mulai ? maju(t, T.tiga8 - 0.2, T.tiga8 + 0.4) : 0;
  const kecil = maju(t, S[8].mulai - 0.1, S[8].mulai + 0.5, EASE.kamera) * (t < T.pulang - 0.6 ? 1 : 0);
  const sk = lerp(1, 0.56, kecil);
  const tx = lerp(0, -205, kecil);
  const ty = lerp(0, 40, kecil);
  return (
    <div style={{ position: 'absolute', left: TP.x, top: TP.y, width: TPW, height: TPH, opacity: o, transformOrigin: '50% 100%', transform: `translate(${tx}px, ${ty}px) scale(${sk})` }}>
      <div style={{ position: 'absolute', left: -26, top: -26, width: TPW + 52, height: TPH + 52, borderRadius: 26, border: `4px solid ${OL.garis}`, background: 'rgba(8,12,28,0.55)' }} />
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={TPW} height={TPH}>
        {Array.from({ length: 48 }, (_, i) => {
          const c = i % TP.c;
          const r = TP.r - 1 - Math.floor(i / TP.c);
          const x = c * (TP.bw + TP.g);
          const y = r * (TP.bh + TP.g);
          const ada = i < nIsi;
          const aud = i < nMerah;
          const vis = i >= 35 && sorotVis > 0;
          const warna = !ada ? '#141a3a' : aud ? AUD : vis ? VIS : '#3a4677';
          return (
            <g key={i}>
              <rect x={x} y={y} width={TP.bw} height={TP.bh} rx={10} fill={warna} stroke={ada ? 'none' : OL.garis} strokeWidth={2} opacity={vis ? 0.5 + 0.5 * sorotVis : 1} />
              {aud ? <Gelombang x={x + 14} y={y + 12} w={TP.bw - 28} h={TP.bh - 24} t={t * 0.4} seed={i} o={0.6} /> : null}
              {vis ? (
                <path d={`M ${x + 20} ${y + 44} L ${x + 46} ${y + 18} L ${x + 64} ${y + 34} L ${x + 80} ${y + 22} L ${x + 100} ${y + 44} Z`} fill={OL.navy0} opacity={0.55 * sorotVis} />
              ) : null}
            </g>
          );
        })}
      </svg>
      {/* angka: total GB (diikat ke isi) */}
      <div style={{ position: 'absolute', left: TPW / 2, top: TPH + 44, translate: '-50% 0', fontFamily: SAIRA, fontWeight: 800, fontSize: 86, lineHeight: 1, color: OL.putih, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
        {kecil > 0.5 ? (
          <>
            PC: <span style={{ color: OL.emas }}>48 GB</span>
          </>
        ) : (
          <>
            <AngkaJalan dari={0} ke={48} progress={isi} lantai gaya={{ color: OL.emas }} /> GB
            {merah > 0 ? (
              <span style={{ color: AUD, fontSize: 64 }}>
                {' '}
                · <AngkaJalan dari={0} ke={35} progress={merah} lantai /> GB audio
              </span>
            ) : null}
          </>
        )}
      </div>
      {/* S8: 13 GB visual dilingkari */}
      {sorotVis > 0 ? (
        <>
          <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
            <GarisDigambar d={pathLingkarTangan(TPW / 2 - 40, (TP.bh + TP.g) * 1.1, TPW / 2 + 40, (TP.bh + TP.g) * 1.35, 'vis')} mulai={T.tiga8} lama={0.35} warna={VIS} tebal={10} opacity={1 - kecil} />
          </svg>
          <ChipAngka x={TPW / 2} y={-70} o={sorotVis * (1 - kecil)} ukuran={52} warna={VIS} isi="±13 GB: peta & data visual" />
        </>
      ) : null}
      {t < S[1].mulai && merah > 0.95 ? <ChipAngka x={TPW / 2} y={-70} o={maju(t, T.audio1 - 0.1, T.audio1 + 0.2)} ukuran={52} warna={AUD} isi="audio tanpa kompresi" /> : null}
    </div>
  );
};

// S9: Xbox One (konsol generik, tanpa logo) < 17 GB, punya decoder audio bawaan
const Konsol: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const { m, k, o } = jendela(t, S[8].mulai + 0.45, S[9].mulai);
  if (o <= 0.001) return null;
  const isi = maju(t, T.tujuh9 - 0.3, T.tujuh9 + 0.5, EASE.kamera);
  const n = Math.floor(16 * isi + 1e-6);
  const dec = pegas(t, T.decoder9, fps, { damping: 9, stiffness: 200, mass: 0.5 });
  const X = 640;
  const bw = 90;
  const bh = 46;
  const g = 10;
  const Ybawah = 1120;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, translate: `${(1 - m) * 120}px ${k * 30}px` }}>
      {/* konsol generik */}
      <div style={{ position: 'absolute', left: X, top: 560, width: 330, height: 120, borderRadius: 18, background: 'linear-gradient(170deg, #2a3266, #141a3a)', border: `3px solid ${OL.abuTerang}55` }}>
        <div style={{ position: 'absolute', left: 30, top: 54, width: 160, height: 8, borderRadius: 4, background: '#05081a' }} />
        <div style={{ position: 'absolute', left: 270, top: 44, width: 26, height: 26, borderRadius: 13, border: `3px solid ${GAME}` }} />
      </div>
      <div style={{ position: 'absolute', left: X + 165, top: 700, translate: '-50% 0', fontFamily: SAIRA, fontWeight: 800, fontSize: 52, color: OL.putih, whiteSpace: 'nowrap' }}>Xbox One</div>
      {/* chip decoder */}
      {dec > 0 ? (
        <div style={{ position: 'absolute', left: X - 40, top: 470, scale: String(Math.min(1.1, dec)), transformOrigin: '50% 100%' }}>
          <div style={{ padding: '6px 16px', borderRadius: 12, background: GAME, color: OL.navy0, fontFamily: SAIRA, fontWeight: 800, fontSize: 38, whiteSpace: 'nowrap' }}>decoder audio bawaan</div>
          <div style={{ position: 'absolute', left: 200, top: 54, width: 4, height: 40, background: GAME }} />
        </div>
      ) : null}
      {/* tumpukan 17 slot, keisi < 17 */}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        {Array.from({ length: 17 }, (_, i) => {
          const c = i % 3;
          const r = Math.floor(i / 3);
          const x = X + 18 + c * (bw + g);
          const y = Ybawah - (r + 1) * (bh + g);
          return <rect key={i} x={x} y={y} width={bw} height={bh} rx={8} fill={i < n ? (i < 16 ? '#3a4677' : OL.emas) : 'none'} stroke={OL.garis} strokeWidth={2} strokeDasharray={i < n ? undefined : '6 6'} />;
        })}
      </svg>
      <div style={{ position: 'absolute', left: X + 165, top: Ybawah + 34, translate: '-50% 0', fontFamily: SAIRA, fontWeight: 800, fontSize: 64, color: GAME, whiteSpace: 'nowrap', opacity: isi }}>&lt; 17 GB</div>
    </div>
  );
};

// S2: kartu game generik (tanpa logo/gambar game)
const KartuGame: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const { m, k } = jendela(t, S[1].mulai, S[2].mulai);
  const o1 = maju(t, T.game2 - 0.1, T.game2 + 0.2);
  const o2 = maju(t, T.multi2 - 0.1, T.multi2 + 0.2);
  const o3 = maju(t, T.respawn2 - 0.1, T.respawn2 + 0.2);
  const o4 = maju(t, T.rilis2 - 0.1, T.rilis2 + 0.2);
  const putar = t * 30;
  return (
    <Panel x={90} y={560} w={900} h={660} m={m} k={k} judul="kartu game" warna={AUD}>
      {/* bidikan (crosshair) */}
      <svg style={{ position: 'absolute', left: 60, top: 100, overflow: 'visible', opacity: o1 }} width={240} height={240}>
        <g transform={`rotate(${putar * 0.2} 120 120)`}>
          <circle cx={120} cy={120} r={92} fill="none" stroke={AUD} strokeWidth={8} />
          <circle cx={120} cy={120} r={44} fill="none" stroke={AUD} strokeWidth={5} opacity={0.6} />
          {[0, 90, 180, 270].map((a) => (
            <line key={a} x1={120} y1={8} x2={120} y2={60} stroke={AUD} strokeWidth={8} strokeLinecap="round" transform={`rotate(${a} 120 120)`} />
          ))}
        </g>
        <circle cx={120} cy={120} r={9} fill={OL.emas} />
      </svg>
      <div style={{ position: 'absolute', left: 340, top: 110, opacity: o1, fontFamily: SAIRA, fontWeight: 800, fontSize: 92, lineHeight: 1, color: OL.putih }}>Titanfall</div>
      <div style={{ position: 'absolute', left: 344, top: 214, opacity: o1, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: OL.abuTerang }}>game tembak-tembakan</div>
      {/* multiplayer: pemain */}
      <div style={{ position: 'absolute', left: 344, top: 270, display: 'flex', gap: 10, opacity: o2 }}>
        {[0, 1, 2, 3].map((i) => {
          const p = maju(t, T.multi2 + i * 0.07, T.multi2 + i * 0.07 + 0.2);
          return (
            <svg key={i} width={56} height={80} viewBox="0 0 70 80" style={{ opacity: p, translate: `0 ${(1 - p) * 20}px` }}>
              <circle cx={35} cy={22} r={17} fill={i % 2 ? VIS : AUD} />
              <path d="M 6 78 Q 6 44 35 44 Q 64 44 64 78 Z" fill={i % 2 ? VIS : AUD} />
            </svg>
          );
        })}
        <div style={{ alignSelf: 'center', fontFamily: SAIRA, fontWeight: 800, fontSize: 48, color: OL.putih }}>multiplayer</div>
      </div>
      <div style={{ position: 'absolute', left: 40, top: 400, width: 820, height: 3, background: OL.garis }} />
      <div style={{ position: 'absolute', left: 40, top: 440, opacity: o3 }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: OL.lime, letterSpacing: '0.1em' }}>DEVELOPER</div>
        <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 80, color: OL.putih, lineHeight: 1.1 }}>Respawn</div>
      </div>
      <div style={{ position: 'absolute', left: 500, top: 440, opacity: o4 }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: OL.lime, letterSpacing: '0.1em' }}>RILIS</div>
        <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 80, color: OL.emas, lineHeight: 1.1 }}>Maret 2014</div>
      </div>
    </Panel>
  );
};

// S3: audio dikompres = kotak kecil; harus dibuka dulu baru diputar
const Kompres: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const { m, k, o } = jendela(t, S[2].mulai, S[3].mulai + 0.05);
  if (o <= 0.001) return null;
  const peras = maju(t, T.dikompres3 - 0.1, T.kecil3 + 0.1, EASE.kamera) * (1 - maju(t, T.dibuka3 - 0.1, T.dibuka3 + 0.5, EASE.kamera));
  const buka = maju(t, T.dibuka3 - 0.1, T.dibuka3 + 0.4);
  const putar = maju(t, T.diputar3 - 0.1, S[3].mulai, EASE.linear);
  const W0 = 860;
  const w = lerp(W0, 240, peras);
  const h = lerp(300, 150, peras);
  const x = 540 - w / 2;
  const y = 820 - h / 2;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, translate: `0 ${(1 - m) * 60 + k * 30}px` }}>
      <div style={{ position: 'absolute', left: x - 20, top: y - 20, width: w + 40, height: h + 40, borderRadius: 24, border: `4px ${peras > 0.5 ? 'solid' : 'dashed'} ${peras > 0.5 ? OL.emas : OL.garis}`, background: peras > 0.5 ? '#2a2410' : 'rgba(8,12,28,0.5)' }} />
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <Gelombang x={x} y={y} w={w} h={h} t={t * (peras > 0.5 ? 0 : 1)} warna={AUD} seed={3} />
        {putar > 0 ? <rect x={x + w * putar} y={y - 20} width={6} height={h + 40} fill={OL.putih} /> : null}
        {/* resleting kotak kompres */}
        {peras > 0.4 ? (
          <g opacity={(peras - 0.4) / 0.6}>
            {Array.from({ length: 8 }, (_, i) => (
              <rect key={i} x={540 - 8} y={y - 10 + i * (h + 20) / 8} width={16} height={(h + 20) / 16} fill={OL.emas} />
            ))}
          </g>
        ) : null}
      </svg>
      <ChipAngka x={540} y={y + h + 90} o={peras} ukuran={48} warna={OL.emas} isi="dikompres = kecil" />
      <ChipAngka x={540} y={1110} o={buka} ukuran={48} warna={AUD} isi={putar > 0 ? '▶ dibuka dulu, baru diputar' : 'harus dibuka dulu'} />
    </div>
  );
};

// S4–S7 & S10: CPU (2 core / banyak core), beban per core
const Cpu: React.FC<{ x: number; y: number; n: number; beban: { aud: number; game: number }[]; label?: string; ukuran?: number }> = ({ x, y, n, beban, label, ukuran = 1 }) => {
  const kol = n <= 2 ? 2 : 4;
  const baris = Math.ceil(n / kol);
  const cw = (n <= 2 ? 300 : 170) * ukuran;
  const ch = (n <= 2 ? 300 : 150) * ukuran;
  const g = 26 * ukuran;
  const W0 = kol * cw + (kol - 1) * g + 80 * ukuran;
  const H0 = baris * ch + (baris - 1) * g + 80 * ukuran;
  return (
    <div style={{ position: 'absolute', left: x - W0 / 2, top: y, width: W0, height: H0 }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 30, background: '#1a2148', border: `5px solid ${OL.emas}`, boxShadow: `0 0 30px ${OL.emas}33` }} />
      {Array.from({ length: 10 }, (_, i) => (
        <React.Fragment key={i}>
          <div style={{ position: 'absolute', left: 30 + (i * (W0 - 60)) / 9 - 4, top: -22, width: 8, height: 22, background: OL.emas, opacity: 0.8 }} />
          <div style={{ position: 'absolute', left: 30 + (i * (W0 - 60)) / 9 - 4, top: H0, width: 8, height: 22, background: OL.emas, opacity: 0.8 }} />
        </React.Fragment>
      ))}
      {Array.from({ length: n }, (_, i) => {
        const b = beban[i] ?? { aud: 0, game: 0 };
        const cx = 40 * ukuran + (i % kol) * (cw + g);
        const cy = 40 * ukuran + Math.floor(i / kol) * (ch + g);
        return (
          <div key={i} style={{ position: 'absolute', left: cx, top: cy, width: cw, height: ch, borderRadius: 16, background: OL.navy0, border: `3px solid ${OL.garis}`, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: `${b.game * 100}%`, background: `${GAME}cc` }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: `${b.game * 100}%`, height: `${b.aud * 100}%`, background: `${AUD}dd` }} />
            <div style={{ position: 'absolute', left: 14, top: 10, fontFamily: MONO, fontWeight: 800, fontSize: 26 * Math.max(0.8, ukuran), color: OL.abuTerang }}>core {i + 1}</div>
          </div>
        );
      })}
      {label ? <div style={{ position: 'absolute', left: W0 / 2, top: H0 + 40, translate: '-50% 0', fontFamily: SAIRA, fontWeight: 800, fontSize: 48, color: OL.emas, whiteSpace: 'nowrap' }}>{label}</div> : null}
    </div>
  );
};

const CpuKerja: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  // S4: zip → CPU → gelombang
  const j4 = jendela(t, S[3].mulai, S[4].mulai);
  // S5–S7: CPU 2 core
  const j57 = jendela(t, S[4].mulai, S[7].mulai);
  // S10: CPU 8 core
  const j10 = jendela(t, S[9].mulai, S[10].mulai);
  const out: React.ReactNode[] = [];
  if (j4.o > 0.001) {
    const arus = maju(t, T.decompress4 - 0.2, T.decompress4 + 0.8, EASE.linear);
    const cpuOn = maju(t, T.cpu4 - 0.2, T.cpu4 + 0.2);
    out.push(
      <div key="s4" style={{ position: 'absolute', inset: 0, opacity: j4.o, translate: `0 ${(1 - j4.m) * 60 + j4.k * 30}px` }}>
        {/* kotak kompres kecil */}
        <div style={{ position: 'absolute', left: 90, top: 640, width: 200, height: 130, borderRadius: 18, border: `4px solid ${OL.emas}`, background: '#2a2410' }}>
          <svg width={200} height={130}>
            <Gelombang x={20} y={30} w={160} h={70} t={0} warna={AUD} seed={3} />
          </svg>
        </div>
        <Ket x={190} y={790} rata="tengah" warna={OL.emas}>
          audio dikompres
        </Ket>
        {/* panah */}
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
          <GarisDigambar d="M 310 705 L 400 705" mulai={T.decompress4 - 0.2} lama={0.25} warna={OL.putih} tebal={8} />
          <GarisDigambar d="M 680 705 L 770 705" mulai={T.decompress4 + 0.4} lama={0.25} warna={OL.putih} tebal={8} />
        </svg>
        {/* CPU */}
        <div style={{ position: 'absolute', left: 420, top: 600, width: 240, height: 210, borderRadius: 22, background: '#1a2148', border: `5px solid ${OL.emas}`, boxShadow: `0 0 ${10 + 30 * cpuOn}px ${OL.emas}${cpuOn > 0.5 ? '88' : '33'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SAIRA, fontWeight: 800, fontSize: 72, color: OL.emas }}>
          CPU
        </div>
        <div style={{ position: 'absolute', left: 540, top: 840, translate: '-50% 0', padding: '6px 20px', borderRadius: 12, background: AUD, color: OL.navy0, fontFamily: SAIRA, fontWeight: 800, fontSize: 52, opacity: maju(t, T.decompress4 - 0.1, T.decompress4 + 0.2), whiteSpace: 'nowrap' }}>decompress</div>
        {/* gelombang hasil */}
        <div style={{ position: 'absolute', left: 790, top: 620, width: 200, height: 170, opacity: maju(t, T.decompress4 + 0.6, T.decompress4 + 0.9) }}>
          <svg width={200} height={170}>
            <Gelombang x={0} y={10} w={200} h={150} t={t} warna={AUD} seed={3} />
          </svg>
        </div>
        <Ket x={890} y={790} rata="tengah" warna={AUD} o={maju(t, T.decompress4 + 0.6, T.decompress4 + 0.9)}>
          siap diputar
        </Ket>
        <ChipKecil x={540} y={1000} rata="tengah" o={arus > 0 ? cpuOn : 0} warna={OL.emas} teks="di PC, kerjaan ini dilakuin CPU" />
      </div>,
    );
  }
  if (j57.o > 0.001) {
    // beban: S5 core 1 kebanyakan audio; S6 tetap; S7 audio hilang, game naik
    const aud = maju(t, T.sebagian5 - 0.1, T.core5 + 0.3, EASE.kamera) * (1 - maju(t, T.tanpa7 - 0.1, T.tanpa7 + 0.6, EASE.kamera));
    const game = 0.15 + 0.6 * maju(t, T.cpu7 - 0.1, T.game7 + 0.3, EASE.kamera);
    const g1 = Math.min(game, 1 - 0.78 * aud);
    const kutip = maju(t, T.richard5 - 0.1, T.richard5 + 0.3) * (1 - maju(t, T.dual5 - 0.4, T.dual5 - 0.1));
    const cpuO = maju(t, T.dual5 - 0.3, T.dual5 + 0.1);
    const hit = pegas(t, T.core5 + 0.3, fps, { damping: 9, stiffness: 200, mass: 0.5 });
    out.push(
      <div key="s57" style={{ position: 'absolute', inset: 0, opacity: j57.o, translate: `0 ${(1 - j57.m) * 60}px` }}>
        {/* kutipan Baker (inisial, tanpa foto) */}
        {kutip > 0 ? (
          <div style={{ position: 'absolute', left: 110, top: 620, width: 860, opacity: kutip }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 160, height: 160, borderRadius: 80, background: `linear-gradient(140deg, ${AUD}, #7a1e22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SAIRA, fontWeight: 800, fontSize: 72 }}>RB</div>
            <div style={{ position: 'absolute', left: 200, top: 18, fontFamily: SAIRA, fontWeight: 800, fontSize: 76, lineHeight: 1 }}>Richard Baker</div>
            <div style={{ position: 'absolute', left: 204, top: 104, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: OL.abuTerang }}>lead engineer, Respawn</div>
          </div>
        ) : null}
        {cpuO > 0 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: cpuO, scale: String(0.92 + 0.08 * cpuO + 0.03 * Math.sin(Math.min(1, hit) * Math.PI)) }}>
            <Cpu x={540} y={600} n={2} beban={[{ aud: 0.78 * aud, game: g1 }, { aud: 0, game }]} label={t < S[5].mulai ? 'PC dual-core' : t < S[6].mulai ? 'prosesor 2 core' : 'tenaga CPU buat game'} />
            {aud > 0.3 ? <ChipAngka x={330} y={570} o={Math.min(1, (aud - 0.3) / 0.4)} ukuran={38} warna={AUD} isi="decompress audio" /> : null}
            {t > T.cpu7 ? <ChipAngka x={750} y={570} o={maju(t, T.cpu7, T.cpu7 + 0.3)} ukuran={38} warna={GAME} isi="jalanin game" /> : null}
          </div>
        ) : null}
      </div>,
    );
  }
  if (j10.o > 0.001) {
    const ok = maju(t, T.gak10 - 0.2, T.gak10 + 0.3);
    const beban = Array.from({ length: 8 }, (_, i) => ({ aud: i === 0 ? 0.18 : 0, game: 0.35 + 0.1 * Math.sin(i * 1.3 + t * 2) }));
    out.push(
      <div key="s10" style={{ position: 'absolute', inset: 0, opacity: j10.o, translate: `0 ${(1 - j10.m) * 60 + j10.k * 30}px` }}>
        <Cpu x={540} y={620} n={8} beban={beban} label="PC kelas menengah ke atas" ukuran={1} />
        {ok > 0 ? (
          <Stempel mulai={T.gak10 - 0.1} rot={-8} gaya={{ position: 'absolute', left: 600, top: 540 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 22px', borderRadius: 12, border: `5px solid ${GAME}`, color: GAME, fontFamily: SAIRA, fontWeight: 800, fontSize: 60, background: `${OL.navy0}ee` }}>
              <svg width={44} height={44} style={{ overflow: 'visible' }}>
                <GarisDigambar d={pathCentang(22, 22, 40)} mulai={T.gak10} lama={0.2} warna={GAME} tebal={8} />
              </svg>
              AMAN
            </div>
          </Stempel>
        ) : null}
      </div>,
    );
  }
  return <>{out}</>;
};

// S6: syarat minimum — prosesor 2 core
const SyaratMin: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const { m, k, o } = jendela(t, T.syarat6 - 0.15, S[6].mulai);
  if (o <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: 150, top: 1110 + (1 - m) * 40 + k * 20, width: 780, height: 150, borderRadius: 22, background: `linear-gradient(170deg, ${OL.permukaan}, ${OL.navy0})`, border: `3px solid ${OL.garis}`, opacity: o, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
      <div style={{ position: 'absolute', left: 30, top: 20, fontFamily: MONO, fontWeight: 800, fontSize: 28, letterSpacing: '0.1em', color: OL.lime }}>SYARAT MINIMUM · TITANFALL</div>
      <div style={{ position: 'absolute', left: 30, top: 66, fontFamily: SAIRA, fontWeight: 800, fontSize: 58, color: OL.putih }}>
        prosesor: <SapuSorot mulai={T.syarat6 + 0.2} warna={OL.emas} warnaTeks={[OL.putih, OL.navy0]} penuh>2 core</SapuSorot>
      </div>
      <Stempel mulai={T.syarat6 + 0.35} rot={-9} gaya={{ position: 'absolute', left: 500, top: 50 }}>
        <div style={{ padding: '2px 18px', borderRadius: 10, border: `5px solid ${GAME}`, color: GAME, fontFamily: SAIRA, fontWeight: 800, fontSize: 46, background: `${OL.navy0}ee` }}>MASIH MASUK</div>
      </Stempel>
    </div>
  );
};

// ======================================================================================================
const Teks: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const kj = (n: number) => S[n].mulai - 0.22;
  const sumber = sumberDi(t, S, [
    [0, 'Sumber: PC Gamer & Game Informer (11/3/2014)'],
    [2, 'ilustrasi'],
    [3, 'Sumber: Game Informer (11/3/2014)'],
    [4, 'Sumber: PC Gamer, Shacknews (ngutip Eurogamer, 2014)'],
    [6, 'Sumber: PC Gamer (11/3/2014)'],
    [8, 'Sumber: Game Informer (11/3/2014)'],
    [9, 'Sumber: PC Gamer (kutipan Baker ke Eurogamer)'],
    [10, null],
  ]);
  const oSumber = maju(t, 1.4, 1.7) * (1 - maju(t, S[10].mulai - 0.2, S[10].mulai));
  return (
    <>
      <TeksOL label={['titanfall', '·', 'versi', 'PC']} lMulai={0.12} judul={[{ t: '48', mulai: T.empat1, warna: OL.emas }, { t: 'GB,', mulai: T.gb1 }, { t: '35', mulai: T.tiga1, warna: AUD }, { t: 'GB-nya', mulai: T.gb1b }, { t: 'audio', mulai: T.audio1, warna: AUD }]} jMulai={T.empat1} keluar={kj(1)} ukuran={96} />
      <ChipKecil x={70} y={440} o={maju(t, T.tanpa1 + 0.2, T.tanpa1 + 0.4) * (1 - maju(t, kj(1), kj(1) + 0.2))} warna={AUD} teks="35 ÷ 48 ≈ 73% instalasi · hitungan kami" />
      <TeksOL label={['titanfall']} lMulai={S[1].mulai} judul={[{ t: 'Respawn,', mulai: T.respawn2, warna: AUD }, { t: 'Maret', mulai: T.rilis2 }, { t: '2014', mulai: T.rilis2 + 0.15, warna: OL.emas }]} jMulai={T.respawn2} keluar={kj(2)} />
      <TeksOL label={['audio', 'dikompres']} lMulai={S[2].mulai} judul={[{ t: 'kecil,', mulai: T.kecil3, warna: OL.emas }, { t: 'harus', mulai: T.dibuka3 - 0.2 }, { t: 'dibuka', mulai: T.dibuka3, warna: AUD }]} jMulai={T.kecil3} keluar={kj(3)} />
      <TeksOL label={['proses', 'buka', 'kompresi']} lMulai={S[3].mulai} judul={[{ t: 'decompress', mulai: T.decompress4, warna: AUD }, { t: '=', mulai: T.cpu4 - 0.4, warna: OL.abu }, { t: 'kerjaan', mulai: T.cpu4 - 0.3 }, { t: 'CPU', mulai: T.cpu4, warna: OL.emas }]} jMulai={T.decompress4} keluar={kj(4)} ukuran={88} />
      <TeksOL label={['menurut', 'richard', 'baker']} lMulai={S[4].mulai} judul={[{ t: 'dual-core:', mulai: T.dual5 }, { t: '1', mulai: T.sebagian5, warna: AUD }, { t: 'core', mulai: T.sebagian5 + 0.1 }, { t: 'buat', mulai: T.core5 }, { t: 'audio', mulai: T.audio5, warna: AUD }]} jMulai={T.dual5} keluar={kj(5)} ukuran={84} />
      <TeksOL label={['padahal']} lMulai={S[5].mulai} judul={[{ t: 'syarat', mulai: T.dua6 - 0.35 }, { t: 'minimum:', mulai: T.dua6 - 0.25 }, { t: '2', mulai: T.dua6, warna: OL.emas }, { t: 'core', mulai: T.dua6 + 0.1, warna: OL.emas }]} jMulai={T.dua6 - 0.35} keluar={kj(6)} ukuran={88} />
      <TeksOL label={['jadi', 'respawn']} lMulai={S[6].mulai} judul={[{ t: 'audio', mulai: T.tanpa7 - 0.3, warna: AUD }, { t: 'tanpa', mulai: T.tanpa7 }, { t: 'kompresi', mulai: T.tanpa7 + 0.2 }]} jMulai={T.tanpa7 - 0.3} keluar={kj(7)} ukuran={92} />
      <TeksOL label={['sisanya']} lMulai={S[7].mulai} judul={[{ t: '±13', mulai: T.tiga8, warna: VIS }, { t: 'GB:', mulai: T.tiga8 + 0.2 }, { t: 'peta', mulai: T.peta8 }, { t: '&', mulai: T.peta8 + 0.2, warna: OL.abu }, { t: 'visual', mulai: T.visual8, warna: VIS }]} jMulai={T.tiga8} keluar={kj(8)} ukuran={92} />
      <TeksOL label={['xbox', 'one']} lMulai={S[8].mulai} judul={[{ t: 'di', mulai: T.tujuh9 - 0.3 }, { t: 'bawah', mulai: T.tujuh9 - 0.2 }, { t: '17', mulai: T.tujuh9, warna: GAME }, { t: 'GB', mulai: T.tujuh9 + 0.2 }]} jMulai={T.tujuh9 - 0.3} keluar={kj(9)} />
      <TeksOL label={['kata', 'baker']} lMulai={S[9].mulai} judul={[{ t: 'PC', mulai: T.menengah10 - 0.3 }, { t: 'menengah', mulai: T.menengah10 }, { t: 'ke', mulai: T.menengah10 + 0.2 }, { t: 'atas:', mulai: T.menengah10 + 0.3 }, { t: 'aman', mulai: T.gak10, warna: GAME }]} jMulai={T.menengah10 - 0.3} keluar={kj(10)} ukuran={88} />
      <TeksOL label={['simpan', '&', 'follow']} lMulai={S[10].mulai} judul={[{ t: 'buat', mulai: T.simpan + 0.5 }, { t: 'ukuran', mulai: T.simpan + 0.6 }, { t: 'game', mulai: T.simpan + 0.75, warna: OL.emas }, { t: 'PC', mulai: T.simpan + 0.85, warna: OL.emas }]} jMulai={T.simpan + 0.5} keluar={T.ctaKeluar} ukuran={92} />
      {sumber ? <ChipKecil x={90} y={1330} o={oSumber} teks={sumber} /> : null}
    </>
  );
};

// ======================================================================================================
function daftarSfx(T: W): Sfx[] {
  const S = T.s;
  const isi = Array.from({ length: 12 }, (_, i) => bunyi('tik', T.isi1[0] + ((T.isi1[1] - T.isi1[0]) * (i + 1)) / 12, 0.15));
  return [
    ...sfxDasar(S, T.simpan, T.follow, T.pulang),
    ...isi,
    bunyi('kunci', T.gb1 + 0.4, 0.4),
    bunyi('glitch', T.tiga1, 0.3),
    bunyi('hantam', T.gb1b + 0.5, 0.4),
    bunyi('pop', T.game2, 0.3),
    bunyi('pop', T.respawn2, 0.3),
    bunyi('swish', T.rilis2, 0.3),
    bunyi('whooshBerat', T.dikompres3, 0.3),
    bunyi('kunci', T.kecil3 + 0.1, 0.35),
    bunyi('whooshTerang', T.dibuka3, 0.3),
    bunyi('pop', T.decompress4, 0.35),
    bunyi('klik', T.cpu4, 0.4),
    bunyi('pop', T.richard5, 0.3),
    bunyi('riser', T.sebagian5 - 0.5, 0.2),
    bunyi('hantam', T.core5 + 0.3, 0.4),
    bunyi('hantam', T.syarat6 + 0.43, 0.4),
    bunyi('sapuHit', T.tanpa7, 0.3),
    bunyi('pop', T.cpu7, 0.3),
    bunyi('swish', T.tiga8, 0.3),
    bunyi('pop', T.decoder9, 0.35),
    bunyi('hantam', T.gak10 - 0.02, 0.4),
  ];
}

// ======================================================================================================
export const O4Sampul: React.FC = () => (
  <AbsoluteFill style={{ background: OL.navy0, overflow: 'hidden', fontFamily: SAIRA, color: OL.putih }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% 50%, ${OL.navy1} 0%, ${OL.navy0} 75%)` }} />
    <svg style={{ position: 'absolute', left: TP.x, top: 700, overflow: 'visible' }} width={TPW} height={TPH}>
      {Array.from({ length: 48 }, (_, i) => {
        const c = i % TP.c;
        const r = TP.r - 1 - Math.floor(i / TP.c);
        const x = c * (TP.bw + TP.g);
        const y = r * (TP.bh + TP.g);
        return (
          <g key={i}>
            <rect x={x} y={y} width={TP.bw} height={TP.bh} rx={10} fill={i < 35 ? AUD : '#3a4677'} />
            {i < 35 ? <Gelombang x={x + 14} y={y + 12} w={TP.bw - 28} h={TP.bh - 24} t={0} seed={i} o={0.6} /> : null}
          </g>
        );
      })}
    </svg>
    <div style={{ position: 'absolute', left: 70, top: 190, fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: OL.lime }}>TITANFALL VERSI PC</div>
    <div style={{ position: 'absolute', left: 64, top: 250, fontWeight: 800, fontSize: 200, lineHeight: 0.95, color: AUD, textShadow: `0 0 40px ${AUD}66` }}>35 GB</div>
    <div style={{ position: 'absolute', left: 70, top: 460, fontWeight: 800, fontSize: 84, lineHeight: 1 }}>isinya cuma audio</div>
    <></>
    <div style={{ position: 'absolute', left: 70, top: 1340, fontWeight: 800, fontSize: 80, lineHeight: 1.05 }}>
      dari total <span style={{ color: OL.emas }}>48 GB</span>
    </div>
    <GrainOL />
  </AbsoluteFill>
);
