// Frame hero (pembuka, tengah, puncak): 15, 795, 1326.
// contoh explainer generik O5 (konten contoh): "Level 256 Pac-Man gak bisa diselesaiin karena angkanya gak muat di 1 byte".
// SERI generik (seri/seriOL.tsx), aksen O5 = LANGIT (dinding labirin / bit); EMAS = pemakan titik & angka; KORAL = rusak/overflow.
// SATU DUNIA: labirin arcade generik 15×12 (digambar sendiri, BUKAN labirin asli; pemakan titik bulat kuning generik, tanpa hantu/logo).
// Alur: labirin LEVEL 256 → separuh kanan rusak → 1 byte gak muat → arcade generik + chip 8 bit (Namco 1980, Z80) → 8 kotak bit
// nyala 0→255 → level dihitung dari 0 (odometer layar vs tersimpan) → ikon buah pojok kanan bawah: +1 → 11111111 + 1 = 00000000,
// carry jatuh (overflow) → loop gambar jalan 256× → separuh kanan penuh simbol acak → butuh 244 titik → cuma 114 + 9 = 123 → CTA → loop.
// Fakta: Pac-Man Dossier (Jamey Pittman), Don Hodges, Wikipedia (Pac-Man, Zilog Z80).
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, Img, random, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { AngkaJalan, Bunyi, Dunia, EASE, GarisDigambar, hitungKamera, maju, pathLingkarTangan, pegas, SapuSorot, Stempel, useDetik, type KunciKamera, type Kata, type Sfx } from "../../src/gerak";
import { MONO, SAIRA } from "../../src/gerak/font";
import { bunyi, ChipAngka, ChipKecil, CtaOL, GrainOL, HudSeri, LatarOL, lerp, OL, generikReaksi, ScrimAtas, SubOL, TeksOL, type DataOL, type Kalimat } from "../../src/gerak/seri/neon-grid/seriOL";
import { cariKata, jendela, Ket, Panel, sfxDasar, sumberDi, waktuDasar } from "../../src/gerak/seri/neon-grid/bantuOL";

const AK = OL.langit;
const PAC = OL.emas;
const RUSAK = OL.koral;
const PETA = [
  '###############',
  '#......#......#',
  '#.##.#.#.#.##.#',
  '#.............#',
  '#.##.#####.##.#',
  '#....#   #....#',
  '####.# # #.####',
  '#....#   #....#',
  '#.##.#####.##.#',
  '#......#......#',
  '#.####.#.####.#',
  '###############',
];
const SEL = 53;
const LB = { x: (1080 - 15 * SEL) / 2, y: 560, w: 15 * SEL, h: 12 * SEL };
const TITIK: { c: number; r: number }[] = [];
PETA.forEach((row, r) => row.split('').forEach((ch, c) => ch === '.' && TITIK.push({ c, r })));
const KIRI = TITIK.filter((d) => d.c < 7);
const KANAN = TITIK.filter((d) => d.c >= 7);

const GABUNG = [
  { kata: ['dua', 'ratus', 'lima', 'puluh', 'enam'], jadi: '256' },
  { kata: ['dua', 'ratus', 'lima', 'puluh', 'lima'], jadi: '255' },
  { kata: ['dua', 'ratus', 'empat', 'puluh', 'empat'], jadi: '244' },
  { kata: ['seratus', 'dua', 'puluh', 'tiga'], jadi: '123' },
  { kata: ['seribu', 'sembilan', 'ratus', 'delapan', 'puluh'], jadi: '1980' },
  { kata: ['delapan', 'bit'], jadi: '8 bit' },
  { kata: ['satu', 'byte'], jadi: '1 byte' },
];

function waktuO5(d: Kata[], total: number, kal?: Kalimat[]) {
  const CAD: [number, number][] = [
    [0.18, 6.4], [6.84, 11.58], [12.04, 16.84], [17.3, 23.38], [23.82, 28.18], [28.62, 31.54], [31.98, 37.42], [37.88, 41.72], [42.18, 45.94], [46.36, 48.98], [49.44, 53.94],
  ];
  const B = waktuDasar(kal, CAD, total);
  const s = B.s;
  const k = cariKata(d);
  const gak1 = k('gak', s[0].mulai, 2.58);
  const karena1 = k('karena', gak1, 4.0);
  const byte1 = k('byte', karena1, 6.08);
  const namco2 = k('namco', s[1].mulai, 7.64);
  const tahun2 = k('tahun', namco2, 8.04);
  const prosesor2 = k('prosesor', tahun2, 10.4);
  const delapan3 = k('delapan', s[2].mulai, 13.04);
  const angka3 = k('angka', delapan3, 14.04);
  const dua3 = k('dua', angka3, 15.6);
  const nol4 = k('nol', s[3].mulai, 18.46);
  const level4 = k('level', nol4, 19.52);
  const sebagai4 = k('sebagai', level4, 21.74);
  const buah5 = k('buah', s[4].mulai, 24.66);
  const pojok5 = k('pojok', buah5, 25.08);
  const nambahin5 = k('nambahin', pojok5, 26.68);
  const balik6 = k('balik', s[5].mulai, 29.28);
  const overflow6 = k('overflow', balik6, 30.98);
  const jalan7 = k('jalan', s[6].mulai, 33.8);
  const kali7 = k('kali', jalan7, 35.34);
  const data7 = k('data', kali7, 36.76);
  const kanan8 = k('kanan', s[7].mulai, 38.28);
  const huruf8 = k('huruf', kanan8, 39.52);
  const makan9 = k('makan', s[8].mulai, 44.04);
  const dua9 = k('dua', makan9, 44.56);
  const cuma10 = k('cuma', s[9].mulai, 47.06);
  const seratus10 = k('seratus', cuma10, 48.0);
  const simpan = k('simpan', s[10].mulai, 49.44);
  const follow = k('follow', simpan, 52.38);
  return {
    ...B, gak1, karena1, byte1, namco2, tahun2, prosesor2, delapan3, angka3, dua3, nol4, level4, sebagai4, buah5, pojok5, nambahin5, balik6, overflow6,
    jalan7, kali7, data7, kanan8, huruf8, makan9, dua9, cuma10, seratus10, simpan, follow,
    ctaKeluar: Math.max(follow + 0.9, total - 1.75),
  };
}
type W = ReturnType<typeof waktuO5>;

// ======================================================================================================
function kunciKamera(T: W): KunciKamera[] {
  const S = T.s;
  const pelan = Easing.inOut(Easing.sin);
  const fx = LB.x + LB.w - 120;
  const fy = LB.y + LB.h + 30;
  return [
    { t: 0, x: 540, y: 960, z: 1.0 },
    { t: T.gak1 + 0.3, x: 560, y: 930, z: 1.05, ease: pelan },
    { t: T.byte1 - 0.3, x: 540, y: 960, z: 1.0 },
    { t: S[4].mulai - 0.05, x: 540, y: 960, z: 1.0 },
    { t: T.pojok5 + 0.3, x: fx - 57, y: fy - 140, z: 1.45 },
    { t: S[5].mulai - 0.1, x: fx - 57, y: fy - 140, z: 1.5, ease: pelan },
    { t: S[5].mulai + 0.5, x: 540, y: 960, z: 1.0 },
    { t: S[7].mulai, x: 540, y: 960, z: 1.0 },
    { t: S[7].mulai + 0.7, x: 700, y: 960, z: 1.12 },
    { t: S[8].mulai - 0.1, x: 700, y: 960, z: 1.14, ease: pelan },
    { t: S[8].mulai + 0.5, x: 540, y: 960, z: 1.0 },
    { t: T.pulang, x: 540, y: 958, z: 1.02, ease: pelan },
    { t: T.loop, x: 540, y: 960, z: 1.0, ease: pelan },
  ];
}

export const ContohOverflow: React.FC<DataOL> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuO5(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const kunci = useMemo(() => kunciKamera(T), [T]);
  const S = T.s;
  const kam = hitungKamera(kunci, t, fps, {
    drift: 2.2 * (1 - maju(t, T.pulang, T.loop)) * maju(t, 0, 0.6),
    getar: [
      { t: T.gak1 + 0.3, kuat: 7 },
      { t: T.overflow6, kuat: 7 },
      { t: T.kanan8 + 0.2, kuat: 6 },
      { t: T.seratus10 + 0.7, kuat: 6 },
    ],
  });
  return (
    <AbsoluteFill style={{ background: OL.navy0, color: OL.putih, overflow: 'hidden', fontFamily: SAIRA }}>
      <LatarOL kam={kam} aksen={AK} />
      <Dunia kamera={kam} tinggiDunia={1920} lebarDunia={1080} blurGerak={null}>
        <Labirin T={T} />
      </Dunia>
      <Arcade T={T} />
      <ByteAdegan T={T} />
      <Loop256 T={T} />
      <HitungTitik T={T} />
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
const SIMBOL = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789#%&?!=+<>/'.split('');
const WARNA_ACAK = [OL.koral, OL.emas, OL.lime, OL.langit, OL.magenta, OL.putih];

/** pemakan titik generik: bulat kuning, mulut buka-tutup */
const Pemakan: React.FC<{ x: number; y: number; r: number; t: number; arah?: number }> = ({ x, y, r, t, arah = 0 }) => {
  const buka = 0.12 + 0.3 * Math.abs(Math.sin(t * 12));
  const a1 = buka * Math.PI;
  const p1 = { x: x + Math.cos(a1) * r, y: y + Math.sin(a1) * r };
  const p2 = { x: x + Math.cos(-a1) * r, y: y + Math.sin(-a1) * r };
  return (
    <g transform={`rotate(${arah} ${x} ${y})`}>
      <path d={`M ${x} ${y} L ${p1.x} ${p1.y} A ${r} ${r} 0 1 1 ${p2.x} ${p2.y} Z`} fill={PAC} />
      <circle cx={x + r * 0.15} cy={y - r * 0.5} r={r * 0.12} fill={OL.navy0} />
    </g>
  );
};

/** buah generik (ceri) */
const Buah: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g opacity={o} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -2 -16 Q 4 -30 16 -32" stroke={OL.lime} strokeWidth={4} fill="none" />
    <path d="M -2 -16 Q -6 -6 -10 0" stroke={OL.lime} strokeWidth={4} fill="none" />
    <circle cx={-10} cy={6} r={10} fill={OL.koral} />
    <circle cx={10} cy={4} r={10} fill={OL.koral} />
    <circle cx={-13} cy={2} r={3} fill="#ffd0d0" />
  </g>
);

// Labirin (dunia): S1, S5, S8–S10, loop. Separuh kanan rusak mulai S1 (sekilas), S8 penuh.
const Labirin: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const frame = useCurrentFrame();
  const S = T.s;
  const hadir1 = 1 - maju(t, S[1].mulai - 0.15, S[1].mulai + 0.25, EASE.keluar);
  const hadir5 = maju(t, S[4].mulai - 0.15, S[4].mulai + 0.3) * (1 - maju(t, S[5].mulai - 0.1, S[5].mulai + 0.25, EASE.keluar));
  const hadir8 = maju(t, S[7].mulai - 0.15, S[7].mulai + 0.3) * (1 - maju(t, S[10].mulai - 0.15, S[10].mulai + 0.2, EASE.keluar));
  const hadirP = maju(t, T.pulang - 0.5, T.pulang + 0.1);
  const o = Math.max(hadir1, hadir5, hadir8, hadirP);
  if (o <= 0.001) return null;
  // rusak kanan: S1 abis "gak bisa", S8 penuh (keisi per kolom), sampai CTA
  const rusak1 = t < S[1].mulai ? maju(t, T.gak1 - 0.1, T.gak1 + 0.3) : 0;
  const rusak8 = t > S[7].mulai - 0.2 && t < T.pulang - 0.6 ? maju(t, T.kanan8 - 0.2, T.huruf8 + 0.6, EASE.linear) : 0;
  const rusak = Math.max(rusak1, rusak8);
  const seedAcak = Math.floor(frame / 4);
  // pemakan: jalan di koridor baris 3 (hook & loop), diam di tengah pas rusak
  const jalanP = t < S[1].mulai ? maju(t, 0.2, T.gak1, EASE.linear) : t > T.pulang - 0.5 ? 0 : 0.5;
  const px = LB.x + SEL * (1.5 + 5.5 * jalanP);
  const py = LB.y + SEL * 3.5;
  // titik: S9 nyala diitung, S10 kiri 114 + kanan 9
  const s9 = t > S[8].mulai - 0.2 && t < T.pulang - 0.6;
  const pHitung = maju(t, T.dua9 - 0.4, T.dua9 + 1.0, EASE.linear);
  const hudHilang = maju(t, S[8].mulai - 0.1, S[8].mulai + 0.2) * (1 - maju(t, S[10].mulai - 0.1, S[10].mulai + 0.2));
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: o }}>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1080} height={1920}>
        <rect x={LB.x - 14} y={LB.y - 14} width={LB.w + 28} height={LB.h + 90} rx={22} fill="#05081a" stroke={OL.garis} strokeWidth={4} />
        {PETA.map((row, r) =>
          row.split('').map((ch, c) => {
            if (ch !== '#') return null;
            const kanan = c >= 8 && rusak > 0 && (c - 8) / 7 < rusak;
            return <rect key={`${r}-${c}`} x={LB.x + c * SEL + 5} y={LB.y + r * SEL + 5} width={SEL - 10} height={SEL - 10} rx={10} fill="none" stroke={AK} strokeWidth={4} opacity={kanan ? 0.25 : 1} />;
          }),
        )}
        {TITIK.map((p, i) => {
          const kanan = p.c >= 8 && rusak > 0 && (p.c - 8) / 7 < rusak;
          if (kanan) return null;
          const dimakan = t < S[1].mulai && p.r === 3 && LB.x + SEL * (p.c + 0.5) < px;
          if (dimakan) return null;
          const nyala = s9 && i / TITIK.length < pHitung;
          return <circle key={i} cx={LB.x + SEL * (p.c + 0.5)} cy={LB.y + SEL * (p.r + 0.5)} r={nyala ? 8 : 6} fill={nyala ? OL.emas : '#ffd9a8'} opacity={nyala ? 1 : 0.85} />;
        })}
        {/* simbol acak di separuh kanan */}
        {rusak > 0
          ? Array.from({ length: 7 * 12 }, (_, i) => {
              const c = 8 + (i % 7);
              const r = Math.floor(i / 7);
              if ((c - 8) / 7 >= rusak) return null;
              const ch = SIMBOL[Math.floor(random(`s${i}-${seedAcak}`) * SIMBOL.length)];
              const w = WARNA_ACAK[Math.floor(random(`w${i}-${Math.floor(seedAcak / 3)}`) * WARNA_ACAK.length)];
              return (
                <text key={i} x={LB.x + SEL * (c + 0.5)} y={LB.y + SEL * (r + 0.5) + 14} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={40} fill={w}>
                  {ch}
                </text>
              );
            })
          : null}
        {/* S10: 9 titik yang masih ada di separuh kanan (ilustrasi) */}
        {t > T.cuma10 + 0.1 && t < S[10].mulai + 0.2
          ? KANAN.slice(0, 9).map((p, i) => (
              <circle key={`k${i}`} cx={LB.x + SEL * (p.c + 0.5)} cy={LB.y + SEL * (p.r + 0.5)} r={11} fill={OL.emas} stroke={OL.navy0} strokeWidth={4} opacity={maju(t, T.cuma10 + 0.1 + i * 0.04, T.cuma10 + 0.3 + i * 0.04) * (1 - maju(t, S[10].mulai - 0.1, S[10].mulai + 0.2))} />
            ))
          : null}
        {(t < S[1].mulai || t > T.pulang - 0.6) ? <Pemakan x={px} y={py} r={22} t={t} /> : null}
        {/* HUD bawah: LEVEL 256 + ikon buah kanan bawah */}
        <text x={LB.x + 6} y={LB.y + LB.h + 56} fontFamily={MONO} fontWeight={800} fontSize={40} fill={OL.putih} opacity={1 - hudHilang}>
          LEVEL <tspan fill={PAC}>256</tspan>
        </text>
        {Array.from({ length: 6 }, (_, i) => (
          <Buah key={i} x={LB.x + LB.w - 30 - i * 46} y={LB.y + LB.h + 42} s={0.9} o={1 - hudHilang} />
        ))}
        {/* S5: lingkari ikon buah + "+1" */}
        {hadir5 > 0 ? (
          <>
            <GarisDigambar d={pathLingkarTangan(LB.x + LB.w - 145, LB.y + LB.h + 40, 175, 46, 'buah')} mulai={T.pojok5} lama={0.3} warna={OL.emas} tebal={6} />
          </>
        ) : null}
      </svg>
      {hadir5 > 0 ? (
        <>
          <div style={{ position: 'absolute', left: LB.x + LB.w - 400, top: LB.y + LB.h - 140, opacity: maju(t, T.nambahin5 - 0.1, T.nambahin5 + 0.2) * hadir5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '8px 22px', borderRadius: 14, background: OL.navy0, border: `4px solid ${OL.emas}` }}>
              <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, color: OL.abuTerang }}>angka level</span>
              <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 56, color: OL.emas }}>255 + 1</span>
            </div>
          </div>
        </>
      ) : null}
      {/* S10: chip hitungan titik */}
      {t > S[9].mulai - 0.2 && t < S[10].mulai + 0.2 ? (
        <>
          <ChipAngka x={LB.x + SEL * 3.5} y={LB.y - 40} o={maju(t, T.cuma10 - 0.2, T.cuma10 + 0.1) * (1 - maju(t, S[10].mulai - 0.1, S[10].mulai + 0.2))} ukuran={44} warna={OL.emas} isi="kiri: 114 titik" />
          <ChipAngka x={LB.x + SEL * 11.5} y={LB.y - 40} o={maju(t, T.cuma10 + 0.2, T.cuma10 + 0.5) * (1 - maju(t, S[10].mulai - 0.1, S[10].mulai + 0.2))} ukuran={44} warna={RUSAK} isi="kanan: 9 titik" />
        </>
      ) : null}
    </div>
  );
};

// S2: arcade generik + chip 8 bit
const Arcade: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const { m, k, o } = jendela(t, S[1].mulai, S[2].mulai);
  if (o <= 0.001) return null;
  const o1 = maju(t, T.namco2 - 0.1, T.namco2 + 0.2);
  const o2 = maju(t, T.tahun2 + 0.2, T.tahun2 + 0.5);
  const o3 = maju(t, T.prosesor2 - 0.1, T.prosesor2 + 0.3);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, translate: `0 ${(1 - m) * 60 + k * 30}px` }}>
      {/* kabinet arcade generik */}
      <svg style={{ position: 'absolute', left: 90, top: 560, overflow: 'visible' }} width={380} height={680}>
        <path d="M 40 0 L 340 0 L 360 60 L 340 680 L 40 680 L 20 60 Z" fill="#1a2148" stroke={AK} strokeWidth={6} />
        <rect x={60} y={20} width={260} height={60} rx={10} fill={OL.emas} opacity={0.85} />
        <rect x={60} y={110} width={260} height={230} rx={12} fill="#05081a" stroke={AK} strokeWidth={4} />
        <Pemakan x={150} y={225} r={34} t={t} />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={210 + i * 30} cy={225} r={6} fill="#ffd9a8" />
        ))}
        <rect x={40} y={380} width={300} height={90} rx={10} fill="#2a3266" />
        <circle cx={120} cy={425} r={22} fill={OL.koral} />
        <circle cx={220} cy={425} r={14} fill={OL.lime} />
        <circle cx={270} cy={425} r={14} fill={OL.langit} />
        <rect x={150} y={540} width={80} height={40} rx={6} fill="#05081a" />
      </svg>
      <div style={{ position: 'absolute', left: 520, top: 600, opacity: o1 }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, color: OL.lime, letterSpacing: '0.1em' }}>BUATAN</div>
        <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 84, lineHeight: 1.05, color: OL.putih }}>Namco</div>
      </div>
      <div style={{ position: 'absolute', left: 520, top: 750, opacity: o2 }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, color: OL.lime, letterSpacing: '0.1em' }}>TAHUN</div>
        <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 84, lineHeight: 1.05, color: OL.emas }}>
          {Math.round(1950 + 30 * o2)}
        </div>
      </div>
      {/* chip prosesor 8 bit */}
      <div style={{ position: 'absolute', left: 520, top: 920, opacity: o3, scale: String(0.85 + 0.15 * o3) }}>
        <svg width={420} height={220} style={{ overflow: 'visible' }}>
          <rect x={20} y={30} width={380} height={160} rx={14} fill="#141a3a" stroke={OL.emas} strokeWidth={5} />
          {Array.from({ length: 12 }, (_, i) => (
            <g key={i}>
              <rect x={42 + i * 29} y={8} width={12} height={22} fill={OL.abuTerang} />
              <rect x={42 + i * 29} y={190} width={12} height={22} fill={OL.abuTerang} />
            </g>
          ))}
          <text x={210} y={100} textAnchor="middle" fontFamily={SAIRA} fontWeight={800} fontSize={64} fill={OL.emas}>
            Z80
          </text>
          <text x={210} y={156} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={36} fill={OL.putih}>
            8 bit
          </text>
        </svg>
      </div>
    </div>
  );
};

// kotak 8 bit (MSB kiri). nilai 0..255, cari = carry jatuh di kiri
const Byte: React.FC<{ x: number; y: number; nilai: number; o?: number; sorot?: number; label?: boolean; warna?: string }> = ({ x, y, nilai, o = 1, sorot = 0, label = true, warna = AK }) => {
  const bw = 96;
  const g = 12;
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity: o }}>
      {Array.from({ length: 8 }, (_, i) => {
        const bit = (nilai >> (7 - i)) & 1;
        return (
          <div key={i} style={{ position: 'absolute', left: i * (bw + g), top: 0, width: bw, height: 120, borderRadius: 14, background: bit ? warna : '#141a3a', border: `4px solid ${bit ? warna : OL.garis}`, boxShadow: bit ? `0 0 ${12 + 16 * sorot}px ${warna}88` : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 64, color: bit ? OL.navy0 : OL.abu }}>
            {bit}
          </div>
        );
      })}
      {label
        ? [128, 64, 32, 16, 8, 4, 2, 1].map((v, i) => (
            <div key={v} style={{ position: 'absolute', left: i * (bw + g) + bw / 2, top: 132, translate: '-50% 0', fontFamily: MONO, fontWeight: 700, fontSize: 26, color: OL.abuTerang }}>
              {v}
            </div>
          ))
        : null}
    </div>
  );
};

// S1 akhir: byte gak muat; S3: 8 bit 0→255; S4: odometer level vs tersimpan; S6: 255 + 1 → 0 (carry jatuh)
const ByteAdegan: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const X = (1080 - (8 * 108 - 12)) / 2;
  const out: React.ReactNode[] = [];
  // S1 ujung: "satu byte" — byte 255 + angka 256 gak muat
  const j1 = jendela(t, T.byte1 - 0.25, S[1].mulai + 0.05, 0.25);
  if (j1.o > 0.001) {
    out.push(
      <div key="s1" style={{ position: 'absolute', inset: 0, opacity: j1.o }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 540, bottom: 0, background: 'rgba(5,8,26,0.85)' }} />
        <Byte x={X} y={820} nilai={255} label={false} />
        <ChipAngka x={540} y={760} ukuran={56} warna={RUSAK} isi="256 gak muat" />
      </div>,
    );
  }
  // S3: 8 bit nyala satu-satu, angka 0 → 255
  const j3 = jendela(t, S[2].mulai, S[3].mulai);
  if (j3.o > 0.001) {
    const p = maju(t, T.angka3 - 0.3, T.dua3 + 0.3, EASE.linear);
    const nilai = Math.min(255, Math.round(255 * p));
    const hit = pegas(t, T.dua3 + 0.3, fps, { damping: 9, stiffness: 200, mass: 0.5 });
    const isiKotak = maju(t, T.delapan3 - 0.2, T.delapan3 + 0.5, EASE.linear);
    out.push(
      <div key="s3" style={{ position: 'absolute', inset: 0, opacity: j3.o, translate: `0 ${(1 - j3.m) * 60 + j3.k * 30}px` }}>
        <Ket x={X} y={600} warna={OL.lime} ukuran={30}>
          1 BYTE = {Math.max(1, Math.ceil(8 * isiKotak))} BIT
        </Ket>
        <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - 100 * isiKotak}% 0 0)` }}>
          <Byte x={X} y={660} nilai={nilai} />
        </div>
        <div style={{ position: 'absolute', left: 540, top: 880, translate: '-50% 0', fontFamily: SAIRA, fontWeight: 800, fontSize: 170, lineHeight: 1, color: OL.emas, scale: String(1 + 0.08 * Math.sin(Math.min(1, hit) * Math.PI)), fontVariantNumeric: 'tabular-nums' }}>
          {nilai}
        </div>
        <Ket x={540} y={1060} rata="tengah" warna={OL.abuTerang} o={maju(t, T.dua3 + 0.2, T.dua3 + 0.5)}>
          angka terbesar yang muat
        </Ket>
      </div>,
    );
  }
  // S4: level di layar vs angka tersimpan
  const j4 = jendela(t, S[3].mulai, S[4].mulai);
  if (j4.o > 0.001) {
    const p = maju(t, T.level4 - 0.1, T.sebagai4 + 0.8, Easing.inOut(Easing.cubic));
    const tampil = t < T.level4 - 0.1 ? 1 : Math.max(1, Math.round(1 + 255 * p));
    const simpan = tampil - 1;
    out.push(
      <div key="s4" style={{ position: 'absolute', inset: 0, opacity: j4.o, translate: `0 ${(1 - j4.m) * 60 + j4.k * 30}px` }}>
        <Panel x={90} y={560} w={900} h={250} m={1} k={0} judul="level di layar">
          <div style={{ position: 'absolute', left: 40, top: 80, fontFamily: SAIRA, fontWeight: 800, fontSize: 140, lineHeight: 1, color: OL.putih, fontVariantNumeric: 'tabular-nums' }}>{tampil}</div>
        </Panel>
        <div style={{ position: 'absolute', left: 540, top: 820, translate: '-50% 0', fontFamily: SAIRA, fontWeight: 800, fontSize: 64, color: OL.abu }}>↓ −1</div>
        <Panel x={90} y={900} w={900} h={330} m={1} k={0} judul="angka tersimpan" warna={AK}>
          <div style={{ position: 'absolute', left: 40, top: 70, fontFamily: SAIRA, fontWeight: 800, fontSize: 110, lineHeight: 1, color: OL.emas, fontVariantNumeric: 'tabular-nums' }}>{simpan}</div>
          <div style={{ position: 'absolute', left: 0, top: 0, scale: '0.62', transformOrigin: '0 0' }}>
            <Byte x={420} y={150} nilai={simpan} label={false} />
          </div>
        </Panel>
      </div>,
    );
  }
  // S6: 11111111 + 1 → 00000000, carry jatuh di kiri
  const j6 = jendela(t, S[5].mulai, S[6].mulai);
  if (j6.o > 0.001) {
    const guling = maju(t, T.balik6 - 0.3, T.balik6 + 0.4, EASE.linear);
    const n = Math.floor(9 * guling);
    // nilai: tiap langkah 1 bit dari kanan jadi 0
    const nilai = n === 0 ? 255 : n >= 8 ? 0 : 255 & ~((1 << n) - 1);
    const jatuh = maju(t, T.balik6 + 0.35, T.balik6 + 1.2, EASE.jatuh);
    const of = pegas(t, T.overflow6, fps, { damping: 9, stiffness: 200, mass: 0.5 });
    out.push(
      <div key="s6" style={{ position: 'absolute', inset: 0, opacity: j6.o, translate: `0 ${(1 - j6.m) * 60 + j6.k * 30}px` }}>
        <div style={{ position: 'absolute', left: X + 800, top: 590, fontFamily: SAIRA, fontWeight: 800, fontSize: 72, color: OL.emas, opacity: 1 - maju(t, T.balik6 - 0.3, T.balik6) }}>+1</div>
        <Byte x={X} y={680} nilai={nilai} warna={nilai === 255 ? AK : RUSAK} />
        {n >= 8 ? (
          <div style={{ position: 'absolute', left: X - 100, top: 680 + jatuh * 520, width: 84, height: 120, borderRadius: 14, background: OL.koral, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 64, color: OL.navy0, opacity: 1 - jatuh * 0.8, rotate: `${-20 * jatuh}deg` }}>
            1
          </div>
        ) : null}
        <div style={{ position: 'absolute', left: 540, top: 900, translate: '-50% 0', fontFamily: SAIRA, fontWeight: 800, fontSize: 110, lineHeight: 1, color: nilai === 255 ? OL.emas : RUSAK, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
          255 + 1 → {nilai === 0 ? '0' : '…'}
        </div>
        {of > 0 ? (
          <Stempel mulai={T.overflow6} rot={-7} gaya={{ position: 'absolute', left: 300, top: 1060 }}>
            <div style={{ padding: '4px 26px', borderRadius: 12, border: `6px solid ${RUSAK}`, color: RUSAK, fontFamily: SAIRA, fontWeight: 800, fontSize: 84, background: `${OL.navy0}ee` }}>OVERFLOW</div>
          </Stempel>
        ) : null}
      </div>,
    );
  }
  return <>{out}</>;
};

// S7: loop gambar buah jalan 256× → ikut gambar data acak
const Loop256: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const frame = useCurrentFrame();
  const S = T.s;
  const { m, k, o } = jendela(t, S[6].mulai, S[7].mulai + 0.1);
  if (o <= 0.001) return null;
  const p = maju(t, T.jalan7 - 0.3, T.kali7 + 0.4, Easing.inOut(Easing.quad));
  const n = Math.floor(256 * p + 1e-6);
  const acak = maju(t, T.data7 - 0.2, T.data7 + 0.6, EASE.linear);
  const kol = 12;
  const tampil = Math.min(96, Math.floor(n * 96 / 256));
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, translate: `0 ${(1 - m) * 60 + k * 30}px` }}>
      <div style={{ position: 'absolute', left: 90, top: 580, fontFamily: SAIRA, fontWeight: 800, fontSize: 120, lineHeight: 1, color: OL.emas, fontVariantNumeric: 'tabular-nums' }}>
        ×{n}
      </div>
      <Ket x={96} y={710} warna={OL.abuTerang}>
        gambar buah diulang
      </Ket>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        {Array.from({ length: tampil }, (_, i) => {
          const c = i % kol;
          const r = Math.floor(i / kol);
          const x = 135 + c * 74;
          const y = 800 + r * 54;
          const jadiAcak = acak > 0 && i / 96 > 1 - acak;
          if (jadiAcak) {
            const ch = SIMBOL[Math.floor(random(`l${i}-${Math.floor(frame / 4)}`) * SIMBOL.length)];
            const w = WARNA_ACAK[Math.floor(random(`lw${i}`) * WARNA_ACAK.length)];
            return (
              <text key={i} x={x} y={y + 14} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={40} fill={w}>
                {ch}
              </text>
            );
          }
          return <Buah key={i} x={x} y={y + 6} s={0.8} />;
        })}
      </svg>
    </div>
  );
};

// S9–S10: butuh 244 titik, cuma ada 114 + 9 = 123
const HitungTitik: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const { o } = jendela(t, S[8].mulai + 0.1, S[10].mulai);
  if (o <= 0.001) return null;
  const p9 = maju(t, T.dua9 - 0.4, T.dua9 + 1.0, EASE.linear);
  const p10 = maju(t, T.seratus10 - 0.2, T.seratus10 + 0.6, EASE.kamera);
  const hit = pegas(t, T.seratus10 + 0.7, fps, { damping: 9, stiffness: 200, mass: 0.5 });
  const X = 140;
  const Y = 1280;
  const Wd = 800;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o }}>
      {/* batang 244 vs 123 di bawah labirin (di atas sumber) */}
      <div style={{ position: 'absolute', left: X, top: Y - 30, width: Wd, height: 20, borderRadius: 10, background: 'rgba(44,56,112,0.6)' }} />
      <div style={{ position: 'absolute', left: X, top: Y - 30, width: Wd * p9, height: 20, borderRadius: 10, background: OL.emas, opacity: 0.45 }} />
      {p10 > 0 ? <div style={{ position: 'absolute', left: X, top: Y - 30, width: Wd * (123 / 244) * p10, height: 20, borderRadius: 10, background: RUSAK }} /> : null}
      <div style={{ position: 'absolute', left: X + Wd, top: Y - 74, translate: '-100% 0', fontFamily: SAIRA, fontWeight: 800, fontSize: 40, color: OL.emas, whiteSpace: 'nowrap', opacity: p9 > 0 ? 1 : 0 }}>
        butuh <AngkaJalan dari={0} ke={244} progress={p9} /> titik
      </div>
      {p10 > 0 ? (
        <div style={{ position: 'absolute', left: X, top: Y - 74, fontFamily: SAIRA, fontWeight: 800, fontSize: 40, color: RUSAK, whiteSpace: 'nowrap', scale: String(1 + 0.1 * Math.sin(Math.min(1, hit) * Math.PI)), transformOrigin: '0 50%' }}>
          ada <AngkaJalan dari={0} ke={123} progress={p10} />
        </div>
      ) : null}
    </div>
  );
};

// ======================================================================================================
const Teks: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const kj = (n: number) => S[n].mulai - 0.22;
  const sumber = sumberDi(t, S, [
    [0, 'Sumber: Pac-Man Dossier, Wikipedia · labirin ilustrasi'],
    [1, 'Sumber: Wikipedia (Pac-Man, Zilog Z80) · ilustrasi'],
    [2, 'Sumber: Pac-Man Dossier (Jamey Pittman)'],
    [6, 'Sumber: Don Hodges (2007, update 2017)'],
    [7, 'Sumber: Pac-Man Dossier · ilustrasi'],
    [9, 'Sumber: Pac-Man Dossier · 114 + 9 = 123 (hitungan kami)'],
    [10, null],
  ]);
  const oSumber = maju(t, 1.4, 1.7) * (1 - maju(t, S[10].mulai - 0.2, S[10].mulai));
  return (
    <>
      <TeksOL label={['pac-man']} lMulai={0.12} judul={[{ t: 'level', mulai: 0.25 }, { t: '256', mulai: 0.4, warna: PAC }, { t: 'gak', mulai: T.gak1 }, { t: 'bisa', mulai: T.gak1 + 0.1 }, { t: 'selesai', mulai: T.gak1 + 0.25, warna: RUSAK }]} jMulai={0.25} keluar={kj(1)} ukuran={92} />
      <TeksOL label={['buatan', 'namco']} lMulai={S[1].mulai} judul={[{ t: 'Namco', mulai: T.namco2 }, { t: '1980,', mulai: T.tahun2, warna: OL.emas }, { t: 'CPU', mulai: T.prosesor2 }, { t: '8', mulai: T.prosesor2 + 0.15, warna: AK }, { t: 'bit', mulai: T.prosesor2 + 0.25, warna: AK }, { t: 'Z80', mulai: T.prosesor2 + 0.4 }]} jMulai={T.namco2} keluar={kj(2)} ukuran={84} />
      <TeksOL label={['1', 'byte']} lMulai={S[2].mulai} judul={[{ t: '1', mulai: S[2].mulai + 0.2 }, { t: 'byte', mulai: S[2].mulai + 0.3 }, { t: '=', mulai: T.delapan3 - 0.1, warna: OL.abu }, { t: '8', mulai: T.delapan3, warna: AK }, { t: 'bit,', mulai: T.delapan3 + 0.1, warna: AK }, { t: 'maks', mulai: T.angka3 + 0.4 }, { t: '255', mulai: T.dua3, warna: OL.emas }]} jMulai={S[2].mulai + 0.2} keluar={kj(3)} ukuran={84} />
      <TeksOL label={['dihitung', 'dari', '0']} lMulai={S[3].mulai} judul={[{ t: 'level', mulai: T.nol4 - 0.2 }, { t: '1', mulai: T.nol4 - 0.1, warna: OL.emas }, { t: 'disimpan', mulai: T.nol4 }, { t: 'sebagai', mulai: T.nol4 + 0.15 }, { t: '0', mulai: T.nol4 + 0.3, warna: AK }]} jMulai={T.nol4 - 0.2} keluar={kj(4)} ukuran={84} />
      <TeksOL label={['ikon', 'buah']} lMulai={S[4].mulai} judul={[{ t: 'angka', mulai: T.nambahin5 - 0.3 }, { t: 'level', mulai: T.nambahin5 - 0.2 }, { t: '+', mulai: T.nambahin5, warna: OL.emas }, { t: '1', mulai: T.nambahin5 + 0.1, warna: OL.emas }]} jMulai={T.nambahin5 - 0.3} keluar={kj(5)} />
      <TeksOL label={['hasilnya']} lMulai={S[5].mulai} judul={[{ t: '255', mulai: S[5].mulai + 0.2 }, { t: '+', mulai: S[5].mulai + 0.3, warna: OL.abu }, { t: '1', mulai: S[5].mulai + 0.4 }, { t: '→', mulai: T.balik6, warna: OL.abu }, { t: '0', mulai: T.balik6 + 0.3, warna: RUSAK }]} jMulai={S[5].mulai + 0.2} keluar={kj(6)} />
      <TeksOL label={['akibatnya']} lMulai={S[6].mulai} judul={[{ t: 'proses', mulai: T.jalan7 - 0.6 }, { t: 'gambar', mulai: T.jalan7 - 0.4 }, { t: 'jalan', mulai: T.jalan7 }, { t: '256×', mulai: T.kali7 - 0.4, warna: OL.emas }]} jMulai={T.jalan7 - 0.6} keluar={kj(7)} ukuran={88} />
      <TeksOL label={['separuh', 'kanan', 'layar']} lMulai={S[7].mulai} judul={[{ t: 'penuh', mulai: T.huruf8 - 0.3 }, { t: 'simbol', mulai: T.huruf8 - 0.1 }, { t: 'acak', mulai: T.huruf8 + 0.1, warna: RUSAK }]} jMulai={T.huruf8 - 0.3} keluar={kj(8)} />
      <TeksOL label={['lanjut', 'level']} lMulai={S[8].mulai} judul={[{ t: 'butuh', mulai: T.makan9 }, { t: '244', mulai: T.dua9, warna: OL.emas }, { t: 'titik', mulai: T.dua9 + 0.4 }]} jMulai={T.makan9} keluar={kj(9)} />
      <TeksOL label={['di', 'level', '256']} lMulai={S[9].mulai} judul={[{ t: 'cuma', mulai: T.cuma10 }, { t: '114', mulai: T.cuma10 + 0.2, warna: OL.emas }, { t: '+', mulai: T.cuma10 + 0.35, warna: OL.abu }, { t: '9', mulai: T.cuma10 + 0.5, warna: RUSAK }, { t: '=', mulai: T.seratus10, warna: OL.abu }, { t: '123', mulai: T.seratus10 + 0.2, warna: RUSAK }]} jMulai={T.cuma10} keluar={kj(10)} />
      <TeksOL label={['simpan', '&', 'follow']} lMulai={S[10].mulai} judul={[{ t: 'buat', mulai: T.simpan + 0.5 }, { t: 'obrolan', mulai: T.simpan + 0.6 }, { t: 'game', mulai: T.simpan + 0.75, warna: OL.emas }, { t: 'retro', mulai: T.simpan + 0.85, warna: OL.emas }]} jMulai={T.simpan + 0.5} keluar={T.ctaKeluar} ukuran={92} />
      {sumber ? <ChipKecil x={90} y={1330} o={oSumber} teks={sumber} /> : null}
    </>
  );
};

// ======================================================================================================
function daftarSfx(T: W): Sfx[] {
  const S = T.s;
  const bit = Array.from({ length: 8 }, (_, i) => bunyi('tik', T.angka3 - 0.3 + ((T.dua3 + 0.6 - T.angka3) * (i + 1)) / 8, 0.3));
  const loop = Array.from({ length: 10 }, (_, i) => bunyi('tik', T.jalan7 - 0.3 + ((T.kali7 + 0.7 - T.jalan7) * (i + 1)) / 10, 0.16));
  return [
    ...sfxDasar(S, T.simpan, T.follow, T.pulang),
    bunyi('glitch', T.gak1, 0.4),
    bunyi('hantam', T.gak1 + 0.3, 0.35),
    bunyi('kunci', T.byte1 + 0.1, 0.35),
    bunyi('pop', T.namco2, 0.3),
    bunyi('swish', T.tahun2 + 0.2, 0.3),
    bunyi('pop', T.prosesor2, 0.35),
    ...bit,
    bunyi('kunci', T.dua3 + 0.3, 0.4),
    bunyi('riser', T.level4 - 0.4, 0.2),
    bunyi('kunci', T.sebagai4 + 0.8, 0.35),
    bunyi('swish', T.pojok5, 0.3),
    bunyi('pop', T.nambahin5, 0.35),
    bunyi('whooshTurun', T.balik6 + 0.4, 0.3),
    bunyi('hantam', T.overflow6 + 0.08, 0.45),
    ...loop,
    bunyi('glitch', T.data7, 0.4),
    bunyi('glitch', T.kanan8 + 0.2, 0.4),
    bunyi('riser', T.dua9 - 0.5, 0.2),
    bunyi('kunci', T.dua9 + 1.0, 0.35),
    bunyi('hantam', T.seratus10 + 0.7, 0.4),
  ];
}

// ======================================================================================================
export const O5Sampul: React.FC = () => (
  <AbsoluteFill style={{ background: OL.navy0, overflow: 'hidden', fontFamily: SAIRA, color: OL.putih }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% 50%, ${OL.navy1} 0%, ${OL.navy0} 75%)` }} />
    <svg style={{ position: 'absolute', left: 0, top: 120, overflow: 'visible' }} width={1080} height={1920}>
      {PETA.map((row, r) =>
        row.split('').map((ch, c) =>
          ch === '#' ? <rect key={`${r}-${c}`} x={LB.x + c * SEL + 5} y={LB.y + r * SEL + 5} width={SEL - 10} height={SEL - 10} rx={10} fill="none" stroke={AK} strokeWidth={4} opacity={c >= 8 ? 0.25 : 1} /> : null,
        ),
      )}
      {TITIK.filter((p) => p.c < 8).map((p, i) => (
        <circle key={i} cx={LB.x + SEL * (p.c + 0.5)} cy={LB.y + SEL * (p.r + 0.5)} r={6} fill="#ffd9a8" />
      ))}
      {Array.from({ length: 7 * 12 }, (_, i) => (
        <text key={i} x={LB.x + SEL * (8 + (i % 7) + 0.5)} y={LB.y + SEL * (Math.floor(i / 7) + 0.5) + 14} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={40} fill={WARNA_ACAK[i % WARNA_ACAK.length]}>
          {SIMBOL[(i * 7) % SIMBOL.length]}
        </text>
      ))}
      <Pemakan x={LB.x + SEL * 4.5} y={LB.y + SEL * 3.5} r={22} t={0.1} />
    </svg>
    <div style={{ position: 'absolute', left: 70, top: 190, fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: OL.lime }}>PAC-MAN</div>
    <div style={{ position: 'absolute', left: 64, top: 250, fontWeight: 800, fontSize: 190, lineHeight: 0.95, color: OL.emas, textShadow: `0 0 40px ${OL.emas}66` }}>level 256</div>
    <div style={{ position: 'absolute', left: 70, top: 460, fontWeight: 800, fontSize: 84, lineHeight: 1 }}>
      gak bisa <span style={{ color: RUSAK }}>diselesaiin</span>
    </div>
    <></>
    <div style={{ position: 'absolute', left: 70, top: 1420, fontWeight: 800, fontSize: 76, lineHeight: 1.05 }}>
      gara-gara <span style={{ color: OL.langit }}>1 byte</span>
    </div>
    <GrainOL />
  </AbsoluteFill>
);
