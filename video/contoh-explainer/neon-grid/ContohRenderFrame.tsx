// Frame hero (pembuka, tengah, puncak): 15, 850, 1417.
// contoh explainer generik O3 (konten contoh): "1 frame Monsters University butuh 29 jam render, game 60 fps cuma ±16,7 ms".
// SERI generik (seri/seriOL.tsx), aksen O3 = MAGENTA (film/render); EMAS = angka penting; LIME = game.
// SATU DUNIA: satu kartu FRAME (adegan 3D generik digambar sendiri: bola, kubus, lampu; tanpa karakter/aset Pixar).
// Alur: frame dirender per ubin + jam muter 0→29 jam → padahal: jalur game 60 fps 0→16,7 ms → pita film (frame = 1 gambar diam,
// diputar cepat) → render = rangka → warna → cahaya → bayangan → utuh → kartu sumber (Sanjay Bakshi, 2013) → render farm 2.000
// komputer / 24.000+ core → 100 juta+ jam CPU ≈ 10.000 tahun di 1 CPU → global illumination (sinar mantul, tiap pantulan jadi
// sumber cahaya baru) → 1 detik = 60 ruas, 1 ruas = 1/60 ≈ 16,7 ms → 29 jam = ±6,26 juta frame game (hitungan kami) → CTA → loop.
// Fakta: GamesBeat (Dean Takahashi, 24/4/2013) + hitungan kami (1/60 dtk, 104.400 × 60 = 6.264.000).
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { AngkaJalan, Bunyi, Dunia, EASE, formatAngka, GarisDigambar, hitungKamera, maju, pathLingkarTangan, pegas, SapuSorot, Stempel, useDetik, type KunciKamera, type Kata, type Sfx } from "../../src/gerak";
import { MONO, SAIRA } from "../../src/gerak/font";
import { bunyi, ChipAngka, ChipKecil, CtaOL, GrainOL, HudSeri, LatarOL, lerp, OL, generikReaksi, ScrimAtas, SubOL, TeksOL, type DataOL, type Kalimat } from "../../src/gerak/seri/neon-grid/seriOL";
import { Batang, cariKata, jendela, Jam, Ket, Panel, pathCentang, sfxDasar, sumberDi, TeksBesar, waktuDasar } from "../../src/gerak/seri/neon-grid/bantuOL";

const AK = OL.magenta;
const GAME = OL.lime;
const FR = { x: 110, y: 560, w: 860, h: 484 }; // kartu frame (dunia)
const UB = { c: 8, r: 5 }; // ubin render

const GABUNG = [
  { kata: ['dua', 'puluh', 'sembilan', 'jam'], jadi: '29 jam' },
  { kata: ['enam', 'puluh', 'fps'], jadi: '60 fps' },
  { kata: ['enam', 'belas', 'koma', 'tujuh'], jadi: '16,7' },
  { kata: ['dua', 'ribu', 'tiga', 'belas'], jadi: '2013' },
  { kata: ['dua', 'ribu', 'komputer'], jadi: '2.000 komputer' },
  { kata: ['dua', 'puluh', 'empat', 'ribu'], jadi: '24.000' },
  { kata: ['seratus', 'juta'], jadi: '100 juta' },
  { kata: ['sepuluh', 'ribu'], jadi: '10.000' },
  { kata: ['enam', 'puluh', 'frame'], jadi: '60 frame' },
  { kata: ['seperenam', 'puluh'], jadi: '1/60' },
  { kata: ['enam', 'juta'], jadi: '6 juta' },
];

function waktuO3(d: Kata[], total: number, kal?: Kalimat[]) {
  const CAD: [number, number][] = [
    [0.1, 10.18], [10.6, 15.18], [15.6, 20.8], [21.24, 25.0], [25.42, 29.28], [29.6, 35.74], [36.16, 41.36], [41.78, 47.42], [47.84, 53.08], [53.5, 57.78],
  ];
  const B = waktuDasar(kal, CAD, total);
  const s = B.s;
  const k = cariKata(d);
  const jam1 = k('jam', s[0].mulai, 2.1);
  const univ1 = k('university', jam1, 4.18);
  const padahal1 = k('padahal', univ1, 5.32);
  const game1 = k('game', padahal1, 6.74);
  const enamB1 = k('enam', k('dapet', game1, 8.26), 8.52);
  const ms1 = k('milidetik', enamB1, 9.4);
  const diam2 = k('diam', s[1].mulai, 11.96);
  const rangkaian2 = k('rangkaian', diam2, 13.52);
  const diputar2 = k('diputar', rangkaian2, 14.34);
  const komputer3 = k('komputer', s[2].mulai, 16.78);
  const warna3 = k('warna', komputer3, 17.48);
  const cahaya3 = k('cahaya', warna3, 18.18);
  const bayangan3 = k('bayangan', cahaya3, 18.96);
  const utuh3 = k('utuh', bayangan3, 20.46);
  const sanjay4 = k('sanjay', s[3].mulai, 22.5);
  const tahun4 = k('tahun', sanjay4, 23.84);
  const komputer5 = k('komputer', s[4].mulai, 26.56);
  const duaPuluh5 = k('dua', k('dari', komputer5, 27.76), 27.98);
  const core5 = k('core', duaPuluh5, 28.94);
  const seratus6 = k('seratus', s[5].mulai, 31.32);
  const cpu6 = k('cpu', seratus6, 32.34);
  const sepuluh6 = k('sepuluh', cpu6, 33.84);
  const satu6 = k('satu', sepuluh6, 34.96);
  const global7 = k('global', s[6].mulai, 37.38);
  const cahaya7 = k('cahaya', global7, 39.34);
  const memantul7 = k('memantul', cahaya7, 39.94);
  const berkali7 = k('berkali', memantul7, 40.44);
  const artinya8 = k('artinya', s[7].mulai, 43.02);
  const detik8 = k('detik', artinya8, 44.32);
  const jadi8 = k('jadi', detik8, 45.04);
  const seperenam8 = k('seperenam', jadi8, 46.3);
  const dihitung9 = k('dihitung', s[8].mulai, 48.1);
  const cukup9 = k('cukup', dihitung9, 50.42);
  const enam9 = k('enam', cukup9, 52.28);
  const simpan = k('simpan', s[9].mulai, 53.5);
  const follow = k('follow', simpan, 56.28);
  return {
    ...B, jam1, univ1, padahal1, game1, enamB1, ms1, diam2, rangkaian2, diputar2, komputer3, warna3, cahaya3, bayangan3, utuh3, sanjay4, tahun4,
    komputer5, duaPuluh5, core5, seratus6, cpu6, sepuluh6, satu6, global7, cahaya7, memantul7, berkali7, artinya8, detik8, jadi8, seperenam8,
    dihitung9, cukup9, enam9, simpan, follow,
    render1: [0.35, padahal1 - 0.15] as [number, number],
    ctaKeluar: Math.max(follow + 0.9, total - 1.75),
  };
}
type W = ReturnType<typeof waktuO3>;

// ======================================================================================================
// Adegan 3D generik (viewBox 860×484): langit senja, lantai, bola, kubus, lampu. Lapis: warna / cahaya / bayangan (0..1).
const Adegan: React.FC<{ warna?: number; cahaya?: number; bayangan?: number; bolaX?: number; id?: string }> = ({ warna = 1, cahaya = 1, bayangan = 1, bolaX = 0, id = 'a' }) => {
  const bx = 300 + bolaX;
  const rangka = 1 - warna;
  return (
    <svg width="100%" height="100%" viewBox="0 0 860 484" preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`langit-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1d2456" />
          <stop offset="100%" stopColor="#4a2a66" />
        </linearGradient>
        <radialGradient id={`bola-${id}`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={cahaya > 0.5 ? '#ffd0f4' : '#ff7fe0'} />
          <stop offset="45%" stopColor="#e046c2" />
          <stop offset="100%" stopColor="#5a1450" />
        </radialGradient>
        <radialGradient id={`lampu-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff4c8" stopOpacity={1} />
          <stop offset="100%" stopColor="#ffc53d" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={860} height={484} fill={rangka > 0.99 ? OL.navy0 : `url(#langit-${id})`} opacity={1} />
      {rangka > 0 ? <rect width={860} height={484} fill={OL.navy0} opacity={rangka} /> : null}
      {/* lantai */}
      <polygon points="0,330 860,330 860,484 0,484" fill="#2b3468" opacity={warna} />
      {Array.from({ length: 7 }, (_, i) => (
        <line key={i} x1={430 + (i - 3) * 60} y1={330} x2={430 + (i - 3) * 260} y2={484} stroke={OL.lime} strokeOpacity={0.18 + 0.4 * rangka} strokeWidth={2} />
      ))}
      <line x1={0} y1={330} x2={860} y2={330} stroke={OL.lime} strokeOpacity={0.25 + 0.5 * rangka} strokeWidth={2} />
      {/* lampu */}
      <circle cx={720} cy={92} r={150} fill={`url(#lampu-${id})`} opacity={0.75 * cahaya} />
      <circle cx={720} cy={92} r={26} fill="#fff4c8" opacity={0.3 + 0.7 * cahaya} stroke={OL.lime} strokeOpacity={rangka} strokeWidth={3} />
      {/* bayangan */}
      <ellipse cx={bx - 70} cy={372} rx={110} ry={22} fill="#05081a" opacity={0.65 * bayangan} />
      <polygon points="520,350 640,350 560,392 420,392" fill="#05081a" opacity={0.55 * bayangan} />
      {/* kubus */}
      <g>
        <polygon points="560,230 650,262 650,352 560,320" fill="#d99a1e" opacity={warna} />
        <polygon points="560,230 470,262 470,352 560,320" fill="#ffc53d" opacity={warna} />
        <polygon points="560,230 650,262 560,294 470,262" fill="#ffe08a" opacity={warna * (0.6 + 0.4 * cahaya)} />
        <path d="M560 230 L650 262 L650 352 L560 320 Z M560 230 L470 262 L470 352 L560 320 Z M470 262 L560 294 L650 262" fill="none" stroke={OL.lime} strokeOpacity={rangka} strokeWidth={3} />
      </g>
      {/* bola */}
      <circle cx={bx} cy={262} r={96} fill={warna > 0 ? `url(#bola-${id})` : 'none'} opacity={Math.max(warna, 0)} />
      <circle cx={bx} cy={262} r={96} fill="none" stroke={OL.lime} strokeOpacity={rangka} strokeWidth={3} />
      {rangka > 0 ? <ellipse cx={bx} cy={262} rx={96} ry={30} fill="none" stroke={OL.lime} strokeOpacity={rangka * 0.6} strokeWidth={2} /> : null}
      <ellipse cx={bx - 34} cy={222} rx={24} ry={14} fill="#ffffff" opacity={0.75 * cahaya * warna} />
      {/* sinar lampu ke objek */}
      {cahaya > 0 && cahaya < 1 ? (
        <g opacity={Math.sin(cahaya * Math.PI)}>
          <line x1={720} y1={92} x2={bx + 40} y2={200} stroke="#fff4c8" strokeWidth={4} strokeDasharray="10 10" />
          <line x1={720} y1={92} x2={590} y2={240} stroke="#fff4c8" strokeWidth={4} strokeDasharray="10 10" />
        </g>
      ) : null}
    </svg>
  );
};

// ubin render (S1 & loop): ubin yang belum jadi = gelap + garis; ubin yang lagi dikerjain = braket emas
const Ubin: React.FC<{ p: number }> = ({ p }) => {
  const n = UB.c * UB.r;
  const w = 860 / UB.c;
  const h = 484 / UB.r;
  const jadi = Math.floor(p * n + 1e-6);
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0 }} width={860} height={484}>
      {Array.from({ length: n }, (_, i) => {
        if (i < jadi) return null;
        const x = (i % UB.c) * w;
        const y = Math.floor(i / UB.c) * h;
        const kerja = i === jadi && p < 1;
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} fill={OL.navy0} />
            <rect x={x + 1} y={y + 1} width={w - 2} height={h - 2} fill="none" stroke={OL.garis} strokeWidth={2} />
            {kerja ? (
              <path
                d={`M ${x + 6} ${y + 26} L ${x + 6} ${y + 6} L ${x + 26} ${y + 6} M ${x + w - 26} ${y + 6} L ${x + w - 6} ${y + 6} L ${x + w - 6} ${y + 26} M ${x + w - 6} ${y + h - 26} L ${x + w - 6} ${y + h - 6} L ${x + w - 26} ${y + h - 6} M ${x + 26} ${y + h - 6} L ${x + 6} ${y + h - 6} L ${x + 6} ${y + h - 26}`}
                stroke={OL.emas}
                strokeWidth={5}
                fill="none"
              />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};

// ======================================================================================================
function kunciKamera(T: W): KunciKamera[] {
  const S = T.s;
  const pelan = Easing.inOut(Easing.sin);
  return [
    { t: 0, x: 540, y: 960, z: 1.0 },
    { t: T.padahal1 - 0.3, x: 540, y: 960, z: 1.05, ease: pelan },
    { t: T.padahal1 + 0.4, x: 540, y: 960, z: 1.0 },
    { t: S[2].mulai, x: 540, y: 960, z: 1.0, ease: pelan },
    { t: S[2].mulai + 0.6, x: 540, y: 900, z: 1.05 },
    { t: S[3].mulai - 0.1, x: 540, y: 890, z: 1.08, ease: pelan },
    { t: S[3].mulai + 0.4, x: 540, y: 960, z: 1.0 },
    { t: S[8].mulai, x: 540, y: 955, z: 1.02, ease: pelan },
    { t: S[8].mulai + 0.5, x: 540, y: 960, z: 1.0 },
    { t: T.pulang, x: 540, y: 958, z: 1.02, ease: pelan },
    { t: T.loop, x: 540, y: 960, z: 1.0, ease: pelan },
  ];
}

export const ContohRenderFrame: React.FC<DataOL> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuO3(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const kunci = useMemo(() => kunciKamera(T), [T]);
  const S = T.s;
  const kam = hitungKamera(kunci, t, fps, {
    drift: 2.2 * (1 - maju(t, T.pulang, T.loop)) * maju(t, 0, 0.6),
    getar: [
      { t: T.jam1 + 0.1, kuat: 6 },
      { t: T.ms1, kuat: 6 },
      { t: T.utuh3, kuat: 5 },
      { t: T.enam9 + 0.3, kuat: 7 },
    ],
  });
  return (
    <AbsoluteFill style={{ background: OL.navy0, color: OL.putih, overflow: 'hidden', fontFamily: SAIRA }}>
      <LatarOL kam={kam} aksen={AK} />
      <Dunia kamera={kam} tinggiDunia={1920} lebarDunia={1080} blurGerak={null}>
        <KartuFrame T={T} />
      </Dunia>
      <JalurGame T={T} />
      <PitaFilm T={T} />
      <KartuSumber T={T} />
      <RenderFarm T={T} />
      <JamCpu T={T} />
      <Pantulan T={T} />
      <SatuDetik T={T} />
      <Hitungan T={T} />
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
// Kartu frame (dunia): tampil di S1 (render ubin → mengecil ke jalur film), S3 (lapis render), S9 (balik), loop.
const KartuFrame: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  // kehadiran: S1 (0..S2), S3, S9, pulang
  const hadir1 = 1 - maju(t, S[1].mulai - 0.15, S[1].mulai + 0.25, EASE.keluar);
  const hadir3 = maju(t, S[2].mulai - 0.1, S[2].mulai + 0.35) * (1 - maju(t, S[3].mulai - 0.15, S[3].mulai + 0.2, EASE.keluar));
  const hadir9 = maju(t, S[8].mulai - 0.1, S[8].mulai + 0.35) * (1 - maju(t, S[9].mulai - 0.15, S[9].mulai + 0.2, EASE.keluar));
  const hadirP = maju(t, T.pulang - 0.5, T.pulang + 0.1);
  const o = Math.max(hadir1, hadir3, hadir9, hadirP);
  if (o <= 0.001) return null;
  // S1: abis "padahal" kartu naik & mengecil jadi jalur film (atas)
  const naik = maju(t, T.padahal1 - 0.1, T.padahal1 + 0.45, EASE.kamera) * hadir1;
  const naik9 = hadir9;
  const sk = lerp(1, 0.62, Math.max(naik, naik9));
  const ty = lerp(0, -170, Math.max(naik, naik9));
  const tx = lerp(0, -150, Math.max(naik, naik9));
  // render ubin
  let pUbin = 1;
  if (hadirP > 0 && t > T.pulang - 0.5) pUbin = 0;
  else if (t < S[1].mulai) pUbin = maju(t, T.render1[0], T.render1[1], EASE.linear);
  // lapis S3
  let lw = 1;
  let lc = 1;
  let lb = 1;
  if (hadir3 > 0 && t < S[3].mulai) {
    lw = maju(t, T.warna3 - 0.1, T.warna3 + 0.3);
    lc = maju(t, T.cahaya3 - 0.1, T.cahaya3 + 0.6, EASE.linear);
    lb = maju(t, T.bayangan3 - 0.1, T.bayangan3 + 0.3);
  }
  const utuh = hadir3 > 0 && t < S[3].mulai ? pegas(t, T.utuh3, fps, { damping: 9, stiffness: 200, mass: 0.5 }) : 0;
  return (
    <div style={{ position: 'absolute', left: FR.x, top: FR.y, width: FR.w, height: FR.h, opacity: o, transformOrigin: '50% 50%', transform: `translate(${tx}px, ${ty}px) scale(${sk * (1 + 0.03 * Math.sin(Math.min(1, utuh) * Math.PI))})` }}>
      <div style={{ position: 'absolute', inset: -14, borderRadius: 26, background: '#05081a', border: `4px solid ${AK}`, boxShadow: `0 0 40px ${AK}44` }} />
      {/* lubang pita film */}
      {[-1, 1].map((sisi) => (
        <div key={sisi} style={{ position: 'absolute', left: 0, right: 0, top: sisi < 0 ? -12 : FR.h + 2, height: 10, display: 'flex', justifyContent: 'space-around' }}>
          {Array.from({ length: 16 }, (_, i) => (
            <div key={i} style={{ width: 22, height: 8, borderRadius: 2, background: '#1a2148' }} />
          ))}
        </div>
      ))}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 10, overflow: 'hidden' }}>
        <Adegan warna={lw} cahaya={lc} bayangan={lb} id="utama" />
        <Ubin p={pUbin} />
      </div>
      {/* S1: jam + angka jam render, nempel di pojok kartu */}
      <JamRender T={T} />
      {/* S3: label lapis */}
      {hadir3 > 0 && t < S[3].mulai + 0.2
        ? [
            { m: T.warna3, teks: 'warna', x: 120 },
            { m: T.cahaya3, teks: 'cahaya', x: 400 },
            { m: T.bayangan3, teks: 'bayangan', x: 700 },
          ].map((l, i) => {
            const p = maju(t, l.m - 0.05, l.m + 0.2);
            return p > 0 ? (
              <div key={i} style={{ position: 'absolute', left: l.x, top: FR.h + 56, translate: '-50% 0', opacity: p * hadir3, scale: String(0.8 + 0.2 * p) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 20px', borderRadius: 14, background: OL.emas, color: OL.navy0, fontFamily: SAIRA, fontWeight: 800, fontSize: 44, whiteSpace: 'nowrap' }}>
                  <svg width={30} height={30} style={{ overflow: 'visible' }}>
                    <GarisDigambar d={pathCentang(15, 15, 26)} mulai={l.m + 0.1} lama={0.18} warna={OL.navy0} tebal={6} />
                  </svg>
                  {l.teks}
                </div>
              </div>
            ) : null;
          })
        : null}
      {utuh > 0 ? (
        <Stempel mulai={T.utuh3} rot={-8} gaya={{ position: 'absolute', left: 560, top: -70 }}>
          <div style={{ padding: '4px 22px', borderRadius: 12, border: `5px solid ${GAME}`, color: GAME, fontFamily: SAIRA, fontWeight: 800, fontSize: 58, background: `${OL.navy0}ee` }}>GAMBAR UTUH</div>
        </Stempel>
      ) : null}
      {/* S9: chip 29 jam di kartu */}
      {hadir9 > 0 ? <ChipAngka x={FR.w / 2} y={FR.h + 70} o={hadir9} ukuran={64} warna={OL.emas} isi="1 frame film: 29 jam" /> : null}
    </div>
  );
};

const JamRender: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const o = maju(t, 0.3, 0.6) * (1 - maju(t, T.padahal1 - 0.1, T.padahal1 + 0.25, EASE.keluar));
  const o2 = maju(t, T.padahal1 + 0.2, T.padahal1 + 0.5) * (1 - maju(t, S[1].mulai - 0.15, S[1].mulai + 0.1, EASE.keluar));
  const p = maju(t, T.render1[0], T.render1[1], EASE.linear);
  return (
    <>
      {o > 0 ? (
        <>
          <Jam x={110} y={FR.h + 136} r={82} p={p} putaran={29} warna={OL.emas} o={o} />
          <div style={{ position: 'absolute', left: 240, top: FR.h + 60, opacity: o, fontFamily: SAIRA, fontWeight: 800, fontSize: 120, lineHeight: 1, color: OL.emas, textShadow: `0 0 26px ${OL.emas}55` }}>
            <AngkaJalan dari={0} ke={29} progress={p} lantai gaya={{ display: 'inline-block', minWidth: '1.05em' }} /> <span style={{ color: OL.putih, fontSize: 84 }}>jam</span>
          </div>
        </>
      ) : null}
      {o2 > 0 ? <ChipAngka x={FR.w + 110} y={FR.h / 2} o={o2} ukuran={72} warna={OL.emas} skala={1.5} isi="29 jam" /> : null}
    </>
  );
};

// S1 bagian 2: jalur game 60 fps (frame piksel generik seri) + stopwatch 0 → 16,7 ms
const JalurGame: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const { m, k, o } = jendela(t, T.padahal1 + 0.15, S[1].mulai + 0.05);
  if (o <= 0.001) return null;
  const p = maju(t, T.enamB1 - 0.05, T.ms1 + 0.3, EASE.linear);
  const hit = pegas(t, T.ms1 + 0.3, fps, { damping: 8, stiffness: 220, mass: 0.5 });
  const X = 70;
  const Y = 1000;
  return (
    <div style={{ position: 'absolute', left: 0, top: (1 - m) * 80 + k * 40, width: 1080, height: 1920, opacity: o }}>
      <div style={{ position: 'absolute', left: X + 10, top: Y - 10, width: 380, height: 214, borderRadius: 12, overflow: 'hidden', border: `4px solid ${GAME}`, boxShadow: `0 0 26px ${GAME}44` }}>
        <Img src={staticFile('o2/frame-0.png')} style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }} />
      </div>
      <div style={{ position: 'absolute', left: X + 10, top: Y + 218, fontFamily: MONO, fontWeight: 700, fontSize: 28, color: GAME }}>1 frame game · 60 fps</div>
      {/* stopwatch batang */}
      <div style={{ position: 'absolute', left: 500, top: Y + 30, width: 470, height: 60, borderRadius: 30, background: 'rgba(44,56,112,0.55)' }} />
      <div style={{ position: 'absolute', left: 500, top: Y + 30, width: 470 * p, height: 60, borderRadius: 30, background: GAME, boxShadow: `0 0 20px ${GAME}88` }} />
      <div style={{ position: 'absolute', left: 500, top: Y + 110, fontFamily: SAIRA, fontWeight: 800, fontSize: 92, lineHeight: 1, color: GAME, fontVariantNumeric: 'tabular-nums', scale: String(1 + 0.12 * Math.sin(Math.min(1, hit) * Math.PI)), transformOrigin: '0 50%' }}>
        <AngkaJalan dari={0} ke={16.7} progress={p} desimal={1} /> <span style={{ color: OL.putih, fontSize: 64 }}>ms</span>
      </div>
      <Ket x={500} y={Y - 14} o={1} warna={OL.abuTerang}>
        waktu per frame
      </Ket>
    </div>
  );
};

// S2: pita film — frame = 1 gambar diam; video = rangkaian frame diputar cepat
const PitaFilm: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const { m, k, o } = jendela(t, S[1].mulai - 0.1, S[2].mulai);
  if (o <= 0.001) return null;
  const Wf = 420;
  const Hf = 236;
  const gap = 40;
  // geser: diam pas "1 gambar diam", ngebut pas "rangkaian ... diputar cepat"
  const v0 = maju(t, T.rangkaian2 - 0.2, T.rangkaian2 + 0.4, EASE.kamera);
  const v1 = maju(t, T.diputar2 - 0.1, T.diputar2 + 0.5, EASE.kamera);
  const geser = (() => {
    // integral kasar kecepatan: 0 sampai rangkaian, 500 px/dtk lalu 2400 px/dtk
    const a = T.rangkaian2 - 0.2;
    if (t < a) return 0;
    const d = t - a;
    return d * 500 * v0 + Math.max(0, t - (T.diputar2 - 0.1)) * 1900 * v1;
  })();
  const n = 13;
  const tengah = 540;
  const pilih = maju(t, T.diam2 - 0.1, T.diam2 + 0.2) * (1 - v0);
  return (
    <div style={{ position: 'absolute', left: 0, top: 640 + (1 - m) * 60, width: 1080, height: 420, opacity: o * (1 - k * 0.2) }}>
      <div style={{ position: 'absolute', left: -40, right: -40, top: 36, height: Hf + 64, background: '#05081a', borderTop: `4px solid ${AK}`, borderBottom: `4px solid ${AK}` }} />
      {Array.from({ length: n }, (_, i) => {
        const span = Wf + gap;
        let x = tengah - Wf / 2 + (i - 6) * span - geser;
        const L = n * span;
        x = ((((x + span * 3) % L) + L) % L) - span * 3;
        const fase = ((i * 37) % 160) - 80;
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: 68, width: Wf, height: Hf, borderRadius: 8, overflow: 'hidden' }}>
            <Adegan id={`pita${i}`} bolaX={fase} />
          </div>
        );
      })}
      {Array.from({ length: 30 }, (_, i) => (
        <div key={i} style={{ position: 'absolute', left: ((i * 46 - geser) % 1380 + 1380) % 1380 - 150, top: 46, width: 24, height: 12, borderRadius: 2, background: '#1a2148' }} />
      ))}
      {Array.from({ length: 30 }, (_, i) => (
        <div key={`b${i}`} style={{ position: 'absolute', left: ((i * 46 - geser) % 1380 + 1380) % 1380 - 150, top: Hf + 80, width: 24, height: 12, borderRadius: 2, background: '#1a2148' }} />
      ))}
      {pilih > 0 ? (
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
          <GarisDigambar d={`M ${tengah - Wf / 2 - 16} ${50} L ${tengah + Wf / 2 + 16} ${50} L ${tengah + Wf / 2 + 16} ${68 + Hf + 18} L ${tengah - Wf / 2 - 16} ${68 + Hf + 18} Z`} mulai={T.diam2 - 0.05} lama={0.3} warna={OL.emas} tebal={8} opacity={pilih} />
        </svg>
      ) : null}
      {pilih > 0 ? <ChipAngka x={tengah} y={Hf + 150} o={pilih} ukuran={44} warna={OL.emas} isi="1 frame = 1 gambar diam" /> : null}
      {v0 > 0 ? <ChipAngka x={tengah} y={Hf + 150} o={v0} ukuran={44} warna={AK} isi={<>▶ video = frame diputar cepat</>} /> : null}
    </div>
  );
};

// S4: kartu sumber angka (tanpa foto orang: inisial)
const KartuSumber: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const { m, k } = jendela(t, S[3].mulai, S[4].mulai);
  const baris = maju(t, T.sanjay4 - 0.1, T.sanjay4 + 0.3);
  const thn = maju(t, T.tahun4 - 0.1, T.tahun4 + 0.3);
  return (
    <Panel x={90} y={560} w={900} h={640} m={m} k={k} judul="sumber angka 29 jam" warna={AK}>
      <div style={{ position: 'absolute', left: 50, top: 110, width: 170, height: 170, borderRadius: 85, background: `linear-gradient(140deg, ${AK}, #6a1a5c)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SAIRA, fontWeight: 800, fontSize: 80, color: OL.putih, opacity: baris, scale: String(0.7 + 0.3 * baris) }}>SB</div>
      <div style={{ position: 'absolute', left: 260, top: 118, opacity: baris, fontFamily: SAIRA, fontWeight: 800, fontSize: 76, lineHeight: 1, color: OL.putih }}>Sanjay Bakshi</div>
      <div style={{ position: 'absolute', left: 262, top: 206, width: 600, opacity: baris, fontFamily: MONO, fontWeight: 700, fontSize: 28, lineHeight: 1.3, color: OL.abuTerang }}>supervising technical director, Pixar</div>
      <div style={{ position: 'absolute', left: 50, top: 330, width: 800, height: 3, background: OL.garis }} />
      <div style={{ position: 'absolute', left: 50, top: 370, opacity: thn, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: OL.lime }}>DIKUTIP GAMESBEAT · APRIL</div>
      <div style={{ position: 'absolute', left: 50, top: 420, opacity: thn, fontFamily: SAIRA, fontWeight: 800, fontSize: 150, lineHeight: 1, color: OL.emas }}>
        <AngkaJalan dari={1990} ke={2013} progress={thn} gaya={{ display: 'inline-block' }} />
      </div>
      <div style={{ position: 'absolute', left: 470, top: 448, opacity: thn, fontFamily: SAIRA, fontWeight: 800, fontSize: 58, lineHeight: 1.1, color: OL.putih }}>
        1 frame
        <br />
        <span style={{ color: OL.emas }}>= 29 jam</span>
      </div>
    </Panel>
  );
};

// S5: render farm — 2.000 komputer (kotak) → 24.000+ core (titik nyala)
const RenderFarm: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const { m, k, o } = jendela(t, S[4].mulai, S[5].mulai + 0.1);
  if (o <= 0.001) return null;
  const pK = maju(t, T.komputer5 - 0.5, T.komputer5 + 0.6, EASE.kamera);
  const pC = maju(t, T.duaPuluh5 - 0.1, T.core5 + 0.4, EASE.kamera);
  const C = 50;
  const R = 40;
  const s = 16;
  const n = Math.floor(2000 * pK + 1e-6);
  return (
    <div style={{ position: 'absolute', left: 140, top: 540 + (1 - m) * 60, opacity: o * (1 - k * 0.3) }}>
      <svg width={C * s} height={R * s} style={{ overflow: 'visible' }}>
        {Array.from({ length: C * R }, (_, i) => {
          const x = (i % C) * s;
          const y = Math.floor(i / C) * s;
          const nyala = i < n;
          const kedip = pC > 0 ? 0.55 + 0.45 * Math.sin(t * 9 + i * 1.7) : 1;
          return <rect key={i} x={x} y={y} width={s - 4} height={s - 4} rx={2} fill={nyala ? (pC > (i % 97) / 97 ? AK : OL.emas) : '#1a2148'} opacity={nyala ? kedip : 0.8} />;
        })}
      </svg>
      <div style={{ position: 'absolute', left: 0, top: R * s + 26, fontFamily: SAIRA, fontWeight: 800, fontSize: 64, color: OL.emas, whiteSpace: 'nowrap' }}>
        <AngkaJalan dari={0} ke={2000} progress={pK} /> <span style={{ color: OL.putih, fontSize: 48 }}>komputer</span>
      </div>
      {pC > 0 ? (
        <div style={{ position: 'absolute', left: 480, top: R * s + 26, fontFamily: SAIRA, fontWeight: 800, fontSize: 64, color: AK, whiteSpace: 'nowrap', opacity: maju(t, T.duaPuluh5 - 0.1, T.duaPuluh5 + 0.2) }}>
          <AngkaJalan dari={0} ke={24000} progress={pC} />+ <span style={{ color: OL.putih, fontSize: 48 }}>core</span>
        </div>
      ) : null}
    </div>
  );
};

// S6: 100 juta+ jam CPU ≈ 10.000 tahun kalau cuma 1 CPU
const JamCpu: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const { m, k } = jendela(t, S[5].mulai, S[6].mulai);
  const pJ = maju(t, T.seratus6 - 0.3, T.cpu6 + 0.3, EASE.kamera);
  const pT = maju(t, T.sepuluh6 - 0.3, T.sepuluh6 + 0.6, EASE.kamera);
  const o2 = maju(t, T.sepuluh6 - 0.4, T.sepuluh6);
  return (
    <Panel x={70} y={540} w={940} h={700} m={m} k={k} judul="total render film" warna={AK}>
      <div style={{ position: 'absolute', left: 40, top: 90, fontFamily: SAIRA, fontWeight: 800, fontSize: 150, lineHeight: 1, color: OL.emas, whiteSpace: 'nowrap' }}>
        <AngkaJalan dari={0} ke={100} progress={pJ} />
        <span style={{ fontSize: 80, color: OL.putih }}> juta+ jam</span>
      </div>
      <div style={{ position: 'absolute', left: 46, top: 250, fontFamily: MONO, fontWeight: 700, fontSize: 32, color: OL.abuTerang }}>jam CPU</div>
      <div style={{ position: 'absolute', left: 40, top: 320, width: 860, height: 3, background: OL.garis, opacity: o2 }} />
      {/* 1 CPU + garis waktu tahun */}
      <div style={{ position: 'absolute', left: 40, top: 360, opacity: o2 }}>
        <svg width={150} height={150} style={{ overflow: 'visible' }}>
          <rect x={25} y={25} width={100} height={100} rx={12} fill="#1a2148" stroke={OL.emas} strokeWidth={5} />
          <rect x={50} y={50} width={50} height={50} rx={6} fill={OL.emas} opacity={0.85} />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <line x1={40 + i * 23} y1={5} x2={40 + i * 23} y2={25} stroke={OL.emas} strokeWidth={5} />
              <line x1={40 + i * 23} y1={125} x2={40 + i * 23} y2={145} stroke={OL.emas} strokeWidth={5} />
              <line x1={5} y1={40 + i * 23} x2={25} y2={40 + i * 23} stroke={OL.emas} strokeWidth={5} />
              <line x1={125} y1={40 + i * 23} x2={145} y2={40 + i * 23} stroke={OL.emas} strokeWidth={5} />
            </g>
          ))}
        </svg>
        <div style={{ position: 'absolute', left: 4, top: 160, fontFamily: MONO, fontWeight: 800, fontSize: 30, color: OL.emas, whiteSpace: 'nowrap' }}>1 CPU</div>
      </div>
      <div style={{ position: 'absolute', left: 230, top: 380, opacity: o2, fontFamily: SAIRA, fontWeight: 800, fontSize: 110, lineHeight: 1, color: AK, whiteSpace: 'nowrap' }}>
        ≈ <AngkaJalan dari={0} ke={10000} progress={pT} />
        <span style={{ fontSize: 64, color: OL.putih }}> tahun</span>
      </div>
      <Batang x={230} y={540} w={660} h={44} p={pT} warna={AK} o={o2} />
      <div style={{ position: 'absolute', left: 230, top: 600, opacity: o2, fontFamily: MONO, fontWeight: 700, fontSize: 26, color: OL.abuTerang }}>kalau dikerjain 1 CPU sendirian</div>
    </Panel>
  );
};

// S7: global illumination — sinar dari lampu mantul berkali-kali, tiap pantulan jadi sumber cahaya baru
const TITIK = [
  { x: 230, y: 700 }, // lampu
  { x: 610, y: 1160 }, // lantai
  { x: 930, y: 860 }, // dinding kanan
  { x: 480, y: 620 }, // langit-langit
  { x: 150, y: 1030 }, // dinding kiri
  { x: 560, y: 1160 },
];
const Pantulan: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const { m, k, o } = jendela(t, S[6].mulai, S[7].mulai);
  if (o <= 0.001) return null;
  const a = T.memantul7 - 0.3;
  const b = T.berkali7 + 0.7;
  const seg = (b - a) / (TITIK.length - 1);
  const nyalaLampu = maju(t, T.global7 - 0.2, T.global7 + 0.2);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, translate: `0 ${(1 - m) * 60 + k * 30}px` }}>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1080} height={1920}>
        <defs>
          <radialGradient id="gi-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff4c8" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#ffc53d" stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* ruangan */}
        <rect x={110} y={580} width={860} height={600} rx={18} fill="#141a3a" stroke={OL.garis} strokeWidth={5} />
        <rect x={110} y={1130} width={860} height={50} fill="#1f2752" />
        {/* bola di ruangan, makin terang tiap pantulan */}
        <circle cx={700} cy={1050} r={80} fill={AK} opacity={0.35 + 0.65 * maju(t, a, b, EASE.linear)} />
        <circle cx={TITIK[0].x} cy={TITIK[0].y} r={140} fill="url(#gi-glow)" opacity={nyalaLampu} />
        <circle cx={TITIK[0].x} cy={TITIK[0].y} r={28} fill="#fff4c8" opacity={0.4 + 0.6 * nyalaLampu} />
        {TITIK.slice(1).map((p, i) => {
          const dari = TITIK[i];
          const m0 = a + i * seg;
          const sampai = t > m0 + seg * 0.9;
          return (
            <g key={i}>
              <GarisDigambar d={`M ${dari.x} ${dari.y} L ${p.x} ${p.y}`} mulai={m0} lama={seg * 0.9} warna="#fff4c8" tebal={7} easing={EASE.linear} opacity={1 - 0.15 * i} />
              {sampai && i < TITIK.length - 2 ? (
                <>
                  <circle cx={p.x} cy={p.y} r={30 + 80 * maju(t, m0 + seg * 0.9, m0 + seg * 0.9 + 0.4)} fill="url(#gi-glow)" opacity={0.85 - 0.12 * i} />
                  <circle cx={p.x} cy={p.y} r={12} fill={OL.emas} />
                </>
              ) : null}
            </g>
          );
        })}
      </svg>
      <ChipAngka
        x={540}
        y={1240}
        o={maju(t, a + seg, a + seg + 0.2)}
        ukuran={40}
        warna={OL.emas}
        isi={<>pantulan: {Math.min(4, Math.max(1, Math.floor((t - a) / seg + 0.1)))} · tiap pantulan = sumber cahaya baru</>}
      />
    </div>
  );
};

// S8: 1 detik = 60 ruas; 1 ruas = 1/60 detik ≈ 16,7 ms
const SatuDetik: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const { m, k, o } = jendela(t, S[7].mulai, S[8].mulai);
  if (o <= 0.001) return null;
  const X = 90;
  const Y = 700;
  const Wd = 900;
  const w = Wd / 60;
  const p = maju(t, T.artinya8 + 0.3, T.detik8 + 0.6, EASE.linear);
  const n = Math.floor(60 * p + 1e-6);
  const zoom = maju(t, T.seperenam8 - 0.3, T.seperenam8 + 0.3, EASE.kamera);
  const hit = pegas(t, T.seperenam8 + 0.3, fps, { damping: 9, stiffness: 200, mass: 0.5 });
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, translate: `0 ${(1 - m) * 60 + k * 30}px` }}>
      <Ket x={X} y={Y - 60} warna={OL.abuTerang} ukuran={32}>
        1 detik
      </Ket>
      <Ket x={X + Wd} y={Y - 60} warna={GAME} ukuran={32} rata="kanan">
        frame: <AngkaJalan dari={0} ke={60} progress={p} lantai />
      </Ket>
      {Array.from({ length: 60 }, (_, i) => (
        <div key={i} style={{ position: 'absolute', left: X + i * w, top: Y, width: w - 3, height: 140, borderRadius: 3, background: i < n ? (i === 0 && zoom > 0 ? OL.emas : GAME) : '#1a2148', opacity: i < n ? 0.9 : 1 }} />
      ))}
      {/* lup ruas pertama */}
      {zoom > 0 ? (
        <>
          <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: zoom }} width={1} height={1}>
            <rect x={X - 6} y={Y - 6} width={w + 9} height={152} fill="none" stroke={OL.emas} strokeWidth={5} />
            <path d={`M ${X + w / 2} ${Y + 150} L ${X + 160} ${Y + 250}`} stroke={OL.emas} strokeWidth={5} />
          </svg>
          <div style={{ position: 'absolute', left: X + 60, top: Y + 250, width: 820, height: 300, borderRadius: 24, border: `5px solid ${OL.emas}`, background: OL.permukaan, opacity: zoom, scale: String((0.6 + 0.4 * zoom) * (1 + 0.06 * Math.sin(Math.min(1, hit) * Math.PI))), transformOrigin: '10% 0%' }}>
            <div style={{ position: 'absolute', left: 40, top: 40, width: 60, height: 220, background: OL.emas, borderRadius: 8 }} />
            <div style={{ position: 'absolute', left: 140, top: 50, fontFamily: SAIRA, fontWeight: 800, fontSize: 110, lineHeight: 1, color: OL.emas }}>1/60 detik</div>
            <div style={{ position: 'absolute', left: 146, top: 180, fontFamily: SAIRA, fontWeight: 800, fontSize: 64, color: OL.putih }}>
              ≈ <span style={{ color: GAME }}>16,7 ms</span>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

// S9: 29 jam = ±6,26 juta frame game (hitungan kami): aliran frame kecil dari kartu film ke penghitung
const Hitungan: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const { m, k, o } = jendela(t, S[8].mulai + 0.3, S[9].mulai);
  if (o <= 0.001) return null;
  const p = maju(t, T.cukup9 - 0.2, T.enam9 + 0.6, Easing.inOut(Easing.quad));
  const hit = pegas(t, T.enam9 + 0.6, fps, { damping: 8, stiffness: 200, mass: 0.5 });
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, translate: `0 ${(1 - m) * 40 + k * 30}px` }}>
      {/* aliran frame game */}
      {Array.from({ length: 14 }, (_, i) => {
        const fase = ((t - T.cukup9) * 1.6 + i / 14) % 1;
        if (t < T.cukup9 - 0.2 || fase < 0) return null;
        const x = lerp(600, 900, fase) + Math.sin(i * 2.1) * 20;
        const y = lerp(820, 1110, fase);
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 70, height: 40, borderRadius: 4, border: `3px solid ${GAME}`, background: '#16301f', opacity: Math.sin(fase * Math.PI) }} />;
      })}
      <div style={{ position: 'absolute', left: 540, top: 1140, translate: '-50% 0', opacity: maju(t, T.cukup9 - 0.35, T.cukup9 - 0.1), fontFamily: SAIRA, fontWeight: 800, fontSize: 130, lineHeight: 1, color: GAME, whiteSpace: 'nowrap', scale: String(1 + 0.08 * Math.sin(Math.min(1, hit) * Math.PI)), textShadow: `0 0 30px ${GAME}55` }}>
        ±<AngkaJalan dari={0} ke={6.26} progress={p} desimal={2} /> <span style={{ fontSize: 76, color: OL.putih }}>juta frame</span>
      </div>
    </div>
  );
};

// ======================================================================================================
const Teks: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const kj = (n: number) => S[n].mulai - 0.22;
  const sumber = sumberDi(t, S, [
    [0, 'Sumber: GamesBeat (24/4/2013) · ilustrasi, waktu dipercepat'],
    [1, null],
    [2, 'ilustrasi adegan generik'],
    [3, 'Sumber: GamesBeat, "How Pixar made Monsters University" (2013)'],
    [4, 'Sumber: GamesBeat (24/4/2013)'],
    [6, 'Sumber: GamesBeat (24/4/2013) · ilustrasi'],
    [7, 'hitungan kami: 1 ÷ 60 detik = ±16,7 ms'],
    [8, 'hitungan kami: 29 jam = 104.400 dtk × 60 = 6.264.000 frame'],
    [9, null],
  ]);
  const oSumber = maju(t, 1.4, 1.7) * (1 - maju(t, S[9].mulai - 0.2, S[9].mulai));
  const naik9 = t > S[8].mulai && t < S[9].mulai;
  return (
    <>
      <TeksOL label={['monsters', 'university', '·', 'pixar']} lMulai={0.12} judul={[{ t: '1', mulai: 0.25, warna: AK }, { t: 'frame', mulai: 0.32 }, { t: '=', mulai: 0.4, warna: OL.abu }, { t: '29', mulai: T.jam1 - 0.6, warna: OL.emas }, { t: 'jam', mulai: T.jam1 - 0.5 }]} jMulai={0.25} keluar={T.padahal1 - 0.2} ukuran={100} />
      <TeksOL label={['padahal', 'game', '60', 'fps']} lMulai={T.padahal1} judul={[{ t: '1', mulai: T.game1, warna: GAME }, { t: 'frame', mulai: T.game1 + 0.1 }, { t: '=', mulai: T.game1 + 0.2, warna: OL.abu }, { t: '±16,7', mulai: T.enamB1, warna: GAME }, { t: 'ms', mulai: T.enamB1 + 0.15 }]} jMulai={T.game1} keluar={kj(1)} ukuran={100} />
      <TeksOL label={['frame']} lMulai={S[1].mulai} judul={[{ t: '1', mulai: S[1].mulai + 0.2, warna: OL.emas }, { t: 'gambar', mulai: S[1].mulai + 0.3 }, { t: 'diam', mulai: T.diam2, isi: <SapuSorot mulai={T.diam2 + 0.1} warna={OL.emas} warnaTeks={[OL.putih, OL.navy0]} penuh>diam</SapuSorot> }]} jMulai={S[1].mulai + 0.2} keluar={kj(2)} />
      <TeksOL label={['render']} lMulai={S[2].mulai} judul={[{ t: 'komputer', mulai: T.komputer3 }, { t: 'ngitung', mulai: T.komputer3 + 0.3, warna: AK }, { t: 'gambar', mulai: T.komputer3 + 0.5 }]} jMulai={T.komputer3} keluar={kj(3)} ukuran={92} />
      <TeksOL label={['sumber', 'angka']} lMulai={S[3].mulai} judul={[{ t: 'Sanjay', mulai: T.sanjay4 }, { t: 'Bakshi,', mulai: T.sanjay4 + 0.15 }, { t: 'Pixar,', mulai: T.sanjay4 + 0.6, warna: AK }, { t: '2013', mulai: T.tahun4, warna: OL.emas }]} jMulai={T.sanjay4} keluar={kj(4)} ukuran={80} />
      <TeksOL label={['render', 'farm', 'pixar']} lMulai={S[4].mulai} judul={[{ t: '2.000', mulai: T.komputer5 - 0.4, warna: OL.emas }, { t: 'komputer,', mulai: T.komputer5 }, { t: '24.000+', mulai: T.duaPuluh5, warna: AK }, { t: 'core', mulai: T.core5 }]} jMulai={T.komputer5 - 0.4} keluar={kj(5)} ukuran={80} />
      <TeksOL label={['total', 'render', 'film']} lMulai={S[5].mulai} judul={[{ t: '100', mulai: T.seratus6, warna: OL.emas }, { t: 'juta+', mulai: T.seratus6 + 0.3, warna: OL.emas }, { t: 'jam', mulai: T.cpu6 - 0.2 }, { t: 'CPU', mulai: T.cpu6 }]} jMulai={T.seratus6} keluar={kj(6)} ukuran={92} />
      <TeksOL label={['salah', 'satu', 'alasan']} lMulai={S[6].mulai} judul={[{ t: 'global', mulai: T.global7 }, { t: 'illumination', mulai: T.global7 + 0.2, warna: OL.emas }]} jMulai={T.global7} keluar={kj(7)} ukuran={84} />
      <ChipKecil x={70} y={336} o={maju(t, T.cahaya7, T.cahaya7 + 0.2) * (1 - maju(t, kj(7), kj(7) + 0.2))} warna={OL.emas} teks="= cahaya memantul berkali-kali" />
      <TeksOL label={['60', 'fps']} lMulai={S[7].mulai} judul={[{ t: '60', mulai: T.artinya8, warna: GAME }, { t: 'frame', mulai: T.artinya8 + 0.4 }, { t: 'per', mulai: T.artinya8 + 0.6 }, { t: 'detik', mulai: T.detik8 }]} jMulai={T.artinya8} keluar={T.seperenam8 - 0.25} ukuran={96} />
      <TeksOL label={['jadi', '1', 'frame']} lMulai={T.seperenam8 - 0.1} judul={[{ t: '±16,7', mulai: T.seperenam8, warna: GAME }, { t: 'ms', mulai: T.seperenam8 + 0.15 }]} jMulai={T.seperenam8} keluar={kj(8)} ukuran={100} />
      <TeksOL label={['hitungan', 'kami']} lMulai={S[8].mulai} judul={[{ t: '29', mulai: T.dihitung9, warna: OL.emas }, { t: 'jam', mulai: T.dihitung9 + 0.1 }, { t: '=', mulai: T.cukup9, warna: OL.abu }, { t: '±6,26', mulai: T.enam9, warna: GAME }, { t: 'juta', mulai: T.enam9 + 0.15, warna: GAME }, { t: 'frame', mulai: T.enam9 + 0.3 }]} jMulai={T.dihitung9} keluar={kj(9)} ukuran={86} />
      <TeksOL label={['simpan', '&', 'follow']} lMulai={S[9].mulai} judul={[{ t: 'buat', mulai: T.simpan + 0.5 }, { t: 'obrolan', mulai: T.simpan + 0.6 }, { t: 'grafis', mulai: T.simpan + 0.75, warna: OL.emas }]} jMulai={T.simpan + 0.5} keluar={T.ctaKeluar} ukuran={92} />
      {sumber ? <ChipKecil x={90} y={1330} o={oSumber * (naik9 ? 0.95 : 1)} teks={sumber} /> : null}
    </>
  );
};

// ======================================================================================================
function daftarSfx(T: W): Sfx[] {
  const S = T.s;
  const a = T.memantul7 - 0.3;
  const b = T.berkali7 + 0.7;
  const seg = (b - a) / (TITIK.length - 1);
  const ubin = Array.from({ length: 10 }, (_, i) => bunyi('tik', T.render1[0] + ((T.render1[1] - T.render1[0]) * (i + 1)) / 10, 0.16));
  return [
    ...sfxDasar(S, T.simpan, T.follow, T.pulang),
    ...ubin,
    bunyi('kunci', T.jam1 + 0.1, 0.4),
    bunyi('glitch', T.padahal1, 0.3),
    bunyi('hantam', T.ms1 + 0.3, 0.4),
    bunyi('jepret', T.diam2, 0.4),
    bunyi('whooshBerat', T.diputar2, 0.3),
    bunyi('pop', T.warna3, 0.3),
    bunyi('pop', T.cahaya3, 0.3),
    bunyi('pop', T.bayangan3, 0.3),
    bunyi('hantam', T.utuh3, 0.4),
    bunyi('pop', T.sanjay4, 0.3),
    bunyi('swish', T.tahun4, 0.3),
    bunyi('riser', T.komputer5 - 0.6, 0.2),
    bunyi('kunci', T.core5 + 0.4, 0.35),
    bunyi('sapuHit', T.cpu6 + 0.3, 0.3),
    bunyi('riser', T.sepuluh6 - 0.4, 0.2),
    bunyi('kunci', T.sepuluh6 + 0.6, 0.35),
    ...[0, 1, 2, 3, 4].map((i) => bunyi('tik', a + (i + 1) * seg * 0.95, 0.35)),
    bunyi('swish', T.artinya8 + 0.3, 0.3),
    bunyi('jepret', T.seperenam8 + 0.3, 0.4),
    bunyi('riser', T.cukup9 - 0.3, 0.2),
    bunyi('hantam', T.enam9 + 0.6, 0.45),
  ];
}

// ======================================================================================================
export const O3Sampul: React.FC = () => (
  <AbsoluteFill style={{ background: OL.navy0, overflow: 'hidden', fontFamily: SAIRA, color: OL.putih }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% 50%, ${OL.navy1} 0%, ${OL.navy0} 75%)` }} />
    <div style={{ position: 'absolute', left: FR.x, top: 640, width: FR.w, height: FR.h }}>
      <div style={{ position: 'absolute', inset: -14, borderRadius: 26, background: '#05081a', border: `4px solid ${AK}`, boxShadow: `0 0 40px ${AK}55` }} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: 10, overflow: 'hidden' }}>
        <Adegan id="sampul" />
        <Ubin p={0.62} />
      </div>
    </div>
    <div style={{ position: 'absolute', left: 70, top: 190, fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: OL.lime }}>1 FRAME FILM PIXAR</div>
    <div style={{ position: 'absolute', left: 64, top: 250, fontWeight: 800, fontSize: 210, lineHeight: 0.95, color: OL.emas, textShadow: `0 0 40px ${OL.emas}66` }}>29 jam</div>
    <div style={{ position: 'absolute', left: 70, top: 470, fontWeight: 800, fontSize: 80, lineHeight: 1 }}>buat render</div>
    <></>
    <div style={{ position: 'absolute', left: 70, top: 1250, fontWeight: 800, fontSize: 84, lineHeight: 1.05 }}>
      game 60 fps cuma
      <br />
      <span style={{ color: OL.lime }}>±16,7 ms</span>
    </div>
    <GrainOL />
  </AbsoluteFill>
);
