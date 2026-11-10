// Frame hero (pembuka, tengah, puncak): 15, 855, 1425.
// contoh explainer generik O1 (konten contoh): "Peta Minecraft Java ±7× luas permukaan Bumi (hitungan kami)". 9:16, ±59 dtk.
// SERI generik (video/seri/seriOL.tsx), aksen O1 = LANGIT (Bumi/laut).
// SATU DUNIA: peta voxel persegi 800 px di tengah (digambar sendiri, prosedural, BUKAN aset Minecraft) + bola Bumi piksel
// DENGAN SKALA ASLI (lebar peta 60.000 km = 800 px → diameter Bumi 12.742 km = 170 px; luas kulit bola = luas 1 pita).
// Alur: zoom di Bumi → mundur, peta raksasa (7 pita = 7× Bumi) → world border + panah 29.999.984 blok → garis ukur lebar →
// tembus ke 1 blok (kubus 1 m) → balik, ±60.000 km → luas 3,6 miliar km² → Bumi dikupas jadi pita 1 (darat 29,2% | laut 70,8%)
// → 7 pita → laut surut, daratan jadi ubin → 24 ubin → kabut, chunk 16×16 muncul pas "kamu" deket → tembus ke 1 chunk, jalan
// 4,317 blok/detik (kecepatan asli) → balik ke peta, jejak tengah → border, hari 0→80 → CTA simpan/follow → zoom ke Bumi (loop).
// Fakta: Minecraft Wiki (World border, Block, Chunk, Walking), Wikipedia Earth, Pidwirny tabel 8o-1; hitungan kami ditulis jujur.
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, Img, random, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  AngkaJalan, Bunyi, Dunia, EASE, formatAngka, GarisDigambar, hitungKamera, kata, maju, noise, pegas, SapuSorot, Stempel, useDetik,
  type KunciKamera, type Kata, type Sfx,
} from "../../src/gerak";
import { MONO, SAIRA } from "../../src/gerak/font";
import {
  bunyi, ChipAngka, ChipKecil, CtaOL, GrainOL, ScrimAtas, HudSeri, LatarOL, lerp, OL, generikReaksi, SubOL, TeksOL, type DataOL, type Kalimat,
} from "../../src/gerak/seri/neon-grid/seriOL";

const AKSEN = OL.langit;
// peta (koordinat dunia = layar pas kamera z 1)
const M = { x: 140, y: 500, s: 800 };
const MC = { x: M.x + M.s / 2, y: M.y + M.s / 2 }; // titik tengah peta (0,0)
const GLOBE_D = (M.s * 12742) / 60000; // ±170 px: skala asli
const RASIO = 3599996160 / 510072000; // 7,058 (hitungan kami)
const PITA_H = M.s / RASIO; // 113 px = luas permukaan Bumi
const DARAT = 0.292; // Pidwirny: daratan 29,2%
const UBIN = 160; // ubin daratan (±luas daratan Bumi), 5×5 = 25 slot, 24,2 keisi
const CH = { x: M.x, y: M.y, n: 5, s: 160 }; // panel chunk: 5×5 chunk @ 10 px/blok
const CHUNK_SOROT = { c: 3, r: 1 };
const JALAN = { x: 124, y: 484, s: 832 }; // panel 1 chunk @ 52 px/blok
const KEC = 4.317; // blok/detik (Minecraft Wiki, Walking)

const GABUNG = [
  { kata: ['tiga', 'puluh', 'juta'], jadi: '30 juta' },
  { kata: ['enam', 'puluh', 'juta'], jadi: '60 juta' },
  { kata: ['enam', 'puluh', 'ribu'], jadi: '60 ribu' },
  { kata: ['tiga', 'koma', 'enam'], jadi: '3,6' },
  { kata: ['lima', 'ratus', 'sepuluh'], jadi: '510' },
  { kata: ['dua', 'puluh', 'empat'], jadi: '24' },
  { kata: ['enam', 'belas'], jadi: '16' },
  { kata: ['empat', 'koma', 'tiga'], jadi: '4,3' },
  { kata: ['delapan', 'puluh'], jadi: '80' },
  { kata: ['tujuh'], jadi: '7' },
  { kata: ['satu', 'meter'], jadi: '1 meter' },
];

// ======================================================================================================
function waktuO1(d: Kata[], total: number, kal: Kalimat[] = []) {
  const CAD: [number, number][] = [
    [0.1, 5.08], [5.44, 12.2], [12.64, 15.72], [16.1, 21.16], [21.58, 26.14], [26.58, 31.76], [32.18, 36.94], [37.36, 43.86], [44.18, 48.1],
    [48.48, 53.16], [53.6, 58.1],
  ];
  const s = CAD.map((c, i) => ({ mulai: kal[i]?.mulai ?? c[0], akhir: kal[i]?.akhir ?? c[1] }));
  const k = (c: string, setelah = 0, cad = 0) => kata(d, c, setelah, cad);
  const tujuh = k('tujuh', s[0].mulai, 3.48);
  const kali1 = k('kali', tujuh, 3.92);
  const world2 = k('world', s[1].mulai, 6.9);
  const dinding = k('dinding', world2, 7.88);
  const hampir2 = k('hampir', dinding, 8.88);
  const blok2 = k('blok', hampir2, 10.38);
  const titik2 = k('titik', blok2, 10.96);
  const tiap2 = k('tiap', titik2, 11.7);
  const lebar3 = k('lebar', s[2].mulai, 13.18);
  const enam3 = k('enam', lebar3, 14.54);
  const blok3 = k('blok', enam3, 15.46);
  const kubus = k('kubus', s[3].mulai, 17.36);
  const meter4 = k('meter', kubus, 17.96);
  const jadi4 = k('jadi', meter4, 18.48);
  const enam4 = k('enam', jadi4, 19.74);
  const km4 = k('kilometer', enam4, 20.66);
  const persegi5 = k('persegi', s[4].mulai, 22.3);
  const luas5 = k('luasnya', persegi5, 22.94);
  const tiga5 = k('tiga', luas5, 23.92);
  const miliar5 = k('miliar', tiga5, 24.8);
  const bumi6 = k('bumi', s[5].mulai, 27.04);
  const laut6 = k('lautnya', bumi6, 27.94);
  const lima6 = k('lima', laut6, 29.54);
  const juta6 = k('juta', lima6, 30.58);
  const darat7 = k('daratannya', s[6].mulai, 32.88);
  const peta7 = k('peta', darat7, 33.84);
  const dua7 = k('dua', peta7, 35.06);
  const kali7 = k('kali', dua7, 35.96);
  const sekaligus8 = k('sekaligus', s[7].mulai, 38.54);
  const potong8 = k('potongan', sekaligus8, 39.72);
  const enam8 = k('enam', potong8, 40.24);
  const blok8 = k('blok', enam8, 41.44);
  const chunk8 = k('chunk', blok8, 42.42);
  const kamu8 = k('kamu', chunk8, 43.16);
  const empat9 = k('empat', s[8].mulai, 46.52);
  const border10 = k('border', s[9].mulai, 49.58);
  const delapan10 = k('delapan', border10, 50.96);
  const hari10 = k('hari', delapan10, 51.8);
  const berhenti10 = k('berhenti', hari10, 52.78);
  const simpan = k('simpan', s[10].mulai, 53.6);
  const follow = k('follow', simpan, 56.54);
  // pita (S1 & S6/S7), peel Bumi, jalan kaki, jejak 80 hari
  const pitaS1 = (i: number) => kali1 - 0.06 - (6 - i) * 0.24; // pita ke-7 pas "kali"
  const peel0 = lima6 - 0.05;
  const peel1 = juta6 + 0.05;
  const pita6 = (i: number) => peel1 + 0.08 + (i - 1) * 0.17; // i = 1..6 (pita 2..7)
  const jalan0 = s[8].mulai + 0.5;
  const jalan1 = jalan0 + 16 / KEC;
  const jejak0 = s[9].mulai + 0.8;
  const jejak1 = hari10 + 0.1;
  return {
    total, s, tujuh, kali1, world2, dinding, hampir2, blok2, titik2, tiap2, lebar3, enam3, blok3, kubus, meter4, jadi4, enam4, km4, persegi5,
    luas5, tiga5, miliar5, bumi6, laut6, lima6, juta6, darat7, peta7, dua7, kali7, sekaligus8, potong8, enam8, blok8, chunk8, kamu8, empat9,
    border10, delapan10, hari10, berhenti10, simpan, follow, pitaS1, peel0, peel1, pita6, jalan0, jalan1, jejak0, jejak1,
    selam0: s[3].mulai, // tembus ke 1 blok
    selam1: jadi4 - 0.1, // balik
    kabut0: s[7].mulai,
    tembusJalan: s[8].mulai,
    naik10: s[9].mulai, // balik dari chunk ke peta
    ctaKeluar: Math.max(follow + 0.9, total - 1.75),
    pulang: total - 1.45,
    loop: total,
  };
}
type W = ReturnType<typeof waktuO1>;

// titik selam S4 (sel rumput di kanan bawah titik tengah)
const SELAM = { x: MC.x + 96, y: MC.y + 128 };

function kunciKamera(T: W): KunciKamera[] {
  const S = T.s;
  const pelan = Easing.inOut(Easing.sin);
  const masukCepat = Easing.in(Easing.cubic);
  const keluarCepat = Easing.out(Easing.cubic);
  return [
    { t: 0, x: MC.x, y: MC.y, z: 3.0 },
    { t: 0.55, x: MC.x, y: MC.y + 4, z: 2.88, ease: pelan },
    { t: 1.95, x: 540, y: 960, z: 1.0 },
    { t: S[1].mulai, x: 540, y: 958, z: 1.02, ease: pelan },
    { t: T.titik2, x: 540, y: 950, z: 1.05, ease: pelan },
    { t: S[2].mulai + 0.4, x: 540, y: 950, z: 1.0 },
    { t: T.selam0, x: 540, y: 955, z: 1.02, ease: pelan },
    { t: T.selam0 + 0.45, x: SELAM.x, y: SELAM.y, z: 5.5, ease: masukCepat },
    { t: T.selam1, x: SELAM.x, y: SELAM.y, z: 5.6, ease: pelan },
    { t: T.selam1 + 0.5, x: 540, y: 950, z: 1.0, ease: keluarCepat },
    { t: S[4].mulai, x: 540, y: 955, z: 1.02, ease: pelan },
    { t: T.miliar5 + 0.6, x: 540, y: 950, z: 1.05, ease: pelan },
    { t: S[5].mulai + 0.7, x: MC.x, y: 870, z: 1.32 },
    { t: T.peel0, x: MC.x, y: 862, z: 1.36, ease: pelan },
    { t: T.peel1 + 0.2, x: 540, y: 960, z: 1.0 },
    { t: S[6].mulai, x: 540, y: 955, z: 1.02, ease: pelan },
    { t: T.kali7 + 0.3, x: 540, y: 948, z: 1.05, ease: pelan },
    { t: T.kabut0 + 0.9, x: MC.x, y: MC.y, z: 2.6 },
    { t: T.naik10, x: MC.x + 60, y: MC.y - 50, z: 3.4, ease: EASE.linear },
    { t: T.naik10 + 0.6, x: 540, y: 960, z: 1.0 },
    { t: T.berhenti10, x: 580, y: 940, z: 1.06, ease: pelan },
    { t: S[10].mulai + 0.5, x: 540, y: 960, z: 1.0 },
    { t: T.pulang, x: 540, y: 958, z: 1.02, ease: pelan },
    { t: T.loop, x: MC.x, y: MC.y, z: 3.0, ease: Easing.inOut(Easing.poly(4)) },
  ];
}

// ======================================================================================================
export const ContohPetaVoxel: React.FC<DataOL> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuO1(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const kunci = useMemo(() => kunciKamera(T), [T]);
  // drift diredam di ujung biar frame terakhir = frame pertama
  const kam = hitungKamera(kunci, t, fps, {
    drift: 2.2 * (1 - maju(t, T.pulang, T.loop)) * maju(t, 0, 0.6),
    getar: [
      { t: T.kali1 + 0.05, kuat: 6 },
      { t: T.dinding + 0.15, kuat: 5 },
      { t: T.peel1 + 0.05, kuat: 5 },
      { t: T.kali7 + 0.05, kuat: 7 },
      { t: T.berhenti10 + 0.05, kuat: 8, lama: 0.16 },
    ],
  });
  const S = T.s;
  return (
    <AbsoluteFill style={{ background: OL.navy0, color: OL.putih, overflow: 'hidden', fontFamily: SAIRA }}>
      <LatarOL kam={kam} aksen={AKSEN} />
      <Dunia kamera={kam} tinggiDunia={1920} lebarDunia={1080} blurGerak={null}>
        <Peta T={T} />
        <PitaS1 T={T} />
        <Border T={T} />
        <Panah T={T} />
        <UkurLebar T={T} />
        <IsiLuas T={T} />
        <PitaBumi T={T} />
        <Jejak T={T} />
        <Bola T={T} />
      </Dunia>
      <PanelKubus T={T} />
      <PanelChunk T={T} />
      <PanelJalan T={T} />
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
// PETA voxel + kabut (S8–S9) + redup (S5–S7, S11)
const Peta: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const kabut = maju(t, T.kabut0, T.kabut0 + 0.7, EASE.kamera) * (1 - maju(t, T.naik10, T.naik10 + 0.5, EASE.kamera));
  const redup = Math.max(
    0.45 * maju(t, T.luas5, T.luas5 + 0.4) * (1 - maju(t, S[5].mulai, S[5].mulai + 0.4)),
    0.55 * maju(t, T.peel1, T.peel1 + 0.4) * (1 - maju(t, T.kabut0, T.kabut0 + 0.3)),
    0.6 * maju(t, S[10].mulai, S[10].mulai + 0.4) * (1 - maju(t, T.ctaKeluar, T.ctaKeluar + 0.4)),
  );
  const masuk = maju(t, 0, 0.01);
  return (
    <>
      <div style={{ position: 'absolute', left: M.x - 10, top: M.y - 10, width: M.s + 20, height: M.s + 20, borderRadius: 10, background: OL.navy0, boxShadow: '0 30px 90px rgba(0,0,0,0.55)', opacity: masuk }} />
      <Img src={staticFile('o1/peta-voxel.png')} style={{ position: 'absolute', left: M.x, top: M.y, width: M.s, height: M.s, imageRendering: 'pixelated' }} />
      {/* kilau air: sapuan cahaya pelan biar peta gak beku */}
      <div style={{ position: 'absolute', left: M.x, top: M.y, width: M.s, height: M.s, overflow: 'hidden', opacity: 0.5 }}>
        <div style={{ position: 'absolute', left: ((t * 90) % 1600) - 600, top: -200, width: 220, height: 1200, rotate: '20deg', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)' }} />
      </div>
      {redup > 0 ? <div style={{ position: 'absolute', left: M.x, top: M.y, width: M.s, height: M.s, background: OL.navy0, opacity: redup }} /> : null}
      {kabut > 0 ? <div style={{ position: 'absolute', left: -400, top: -300, width: 1880, height: 2520, background: '#05070f', opacity: kabut * 0.8 }} /> : null}
    </>
  );
};

// BOLA BUMI piksel (skala asli). Muter 3 putaran pas sepanjang video (frame terakhir = frame pertama).
function posBola(t: number, T: W) {
  const S = T.s;
  // tengah → pojok kiri atas peta (S2) → tengah atas (S6) → dikupas (peel) → muncul lagi di tengah (loop)
  const keSudut = maju(t, S[1].mulai, S[1].mulai + 0.7, EASE.kamera);
  const keTengah = maju(t, S[5].mulai, S[5].mulai + 0.7, EASE.kamera);
  let x = lerp(MC.x, M.x + 130, keSudut);
  let y = lerp(MC.y, M.y + 130, keSudut);
  x = lerp(x, MC.x, keTengah);
  y = lerp(y, 862, keTengah);
  return { x, y };
}
const BolaPiksel: React.FC<{ d: number; t: number; total: number; terang?: number }> = ({ d, t, total, terang = 0 }) => {
  const geser = ((t / total) * 3 * 2 * d) % (2 * d);
  return (
    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${staticFile('o1/bumi.png')})`,
          backgroundSize: `${2 * d}px ${d}px`,
          backgroundPosition: `${-geser}px 0`,
          backgroundRepeat: 'repeat-x',
          imageRendering: 'pixelated',
          filter: terang > 0 ? `saturate(${1 + terang * 0.5}) brightness(${1 + terang * 0.25})` : undefined,
        }}
      />
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 34% 30%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 38%, rgba(0,0,0,0) 55%, rgba(3,6,20,0.72) 100%)' }} />
    </div>
  );
};
const Bola: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  // dikupas: peel0..peel1 (bola → pita 1). Muncul lagi pas pulang.
  const balik = pegas(t, T.pulang + 0.1, fps, { damping: 14, stiffness: 140 });
  const ada = t < T.peel1 || t >= T.pulang + 0.1;
  if (!ada) return null;
  const p = t < T.pulang ? maju(t, T.peel0, T.peel1, EASE.kamera) : 0;
  const { x, y } = t < T.pulang ? posBola(t, T) : MC;
  const laut = t > T.laut6 - 0.2 && t < T.peel0 ? Math.sin(Math.PI * maju(t, T.laut6 - 0.1, T.laut6 + 0.9, EASE.linear)) : 0;
  // morf lingkaran → persegi panjang pita 1
  const w = lerp(GLOBE_D, M.s, p);
  const h = lerp(GLOBE_D, PITA_H, p);
  const cx = lerp(x, MC.x, p);
  const cy = lerp(y, M.y + PITA_H / 2, p);
  const r = lerp(GLOBE_D / 2, 6, p);
  const sk = t >= T.pulang ? balik : 1;
  const tekstur = t < T.pulang ? maju(t, T.peel0 + 0.15, T.peel1 - 0.1) : 0;
  return (
    <div style={{ position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h, scale: String(sk) }}>
      {/* halo atmosfer */}
      <div style={{ position: 'absolute', inset: -10, borderRadius: r + 10, boxShadow: `0 0 ${36 + laut * 30}px ${AKSEN}${laut > 0.3 ? 'aa' : '66'}`, opacity: 1 - p }} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: r, overflow: 'hidden', border: `2px solid ${AKSEN}`, opacity: 1 }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - tekstur }}>
          <div style={{ position: 'absolute', left: (w - GLOBE_D) / 2, top: (h - GLOBE_D) / 2, width: GLOBE_D, height: GLOBE_D, scale: `${w / GLOBE_D} ${h / GLOBE_D}` }}>
            <BolaPiksel d={GLOBE_D} t={t} total={T.total} terang={laut} />
          </div>
        </div>
        {tekstur > 0 ? <IsiPita w={w} h={h} o={tekstur} surut={0} /> : null}
      </div>
      {/* label bola */}
      {t > 0.25 && t < S[5].mulai + 0.6 && p === 0 ? (
        <div style={{ position: 'absolute', left: GLOBE_D / 2, top: -46, translate: '-50% 0', fontFamily: MONO, fontWeight: 700, fontSize: 26, color: AKSEN, whiteSpace: 'nowrap', opacity: maju(t, 2.0, 2.3) * (1 - maju(t, S[5].mulai + 0.2, S[5].mulai + 0.5)), textShadow: '0 2px 8px #000' }}>
          Bumi
        </div>
      ) : null}
    </div>
  );
};

/** isi pita "kulit Bumi": darat 29,2% (kiri) | laut 70,8% (kanan). surut = laut menghilang (0..1) */
const IsiPita: React.FC<{ w: number; h: number; o?: number; surut: number; label?: boolean }> = ({ w, h, o = 1, surut, label }) => (
  <div style={{ position: 'absolute', inset: 0, opacity: o }}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: w * DARAT, height: h, backgroundImage: `url(${staticFile('o1/darat.png')})`, backgroundSize: '96px 96px', imageRendering: 'pixelated' }} />
    <div
      style={{
        position: 'absolute',
        left: w * DARAT,
        top: 0,
        width: w * (1 - DARAT),
        height: h,
        backgroundImage: `url(${staticFile('o1/laut.png')})`,
        backgroundSize: '96px 96px',
        imageRendering: 'pixelated',
        transformOrigin: '0 50%',
        scale: `${1 - surut} 1`,
      }}
    />
    <div style={{ position: 'absolute', left: w * DARAT - 1.5, top: 0, width: 3, height: h, background: OL.navy0, opacity: 0.6 * (1 - surut) }} />
    {label ? (
      <>
        <div style={{ position: 'absolute', left: 10, top: 8, fontFamily: MONO, fontWeight: 800, fontSize: 22, color: OL.putih, textShadow: '0 2px 6px #000' }}>darat 29,2%</div>
        <div style={{ position: 'absolute', left: w * DARAT + 12, top: 8, fontFamily: MONO, fontWeight: 800, fontSize: 22, color: OL.putih, textShadow: '0 2px 6px #000', opacity: 1 - surut }}>laut 70,8%</div>
      </>
    ) : null}
  </div>
);

// S1: 7 pita digambar (garis putus) + nomor; 7 × luas permukaan Bumi
const PitaS1: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  if (t < T.pitaS1(0) - 0.1 || t > T.s[1].mulai + 0.6) return null;
  const hapus = T.s[1].mulai - 0.15;
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        {Array.from({ length: 7 }, (_, i) => {
          const y = M.y + i * PITA_H;
          return (
            <GarisDigambar
              key={i}
              d={`M ${M.x} ${y + PITA_H} L ${M.x} ${y} L ${M.x + M.s} ${y} L ${M.x + M.s} ${y + PITA_H}`}
              mulai={T.pitaS1(i)}
              lama={0.22}
              warna={i === 6 ? OL.emas : AKSEN}
              tebal={5}
              hapus={hapus + i * 0.03}
            />
          );
        })}
      </svg>
      {Array.from({ length: 7 }, (_, i) => {
        const o = maju(t, T.pitaS1(i) + 0.08, T.pitaS1(i) + 0.2) * (1 - maju(t, hapus, hapus + 0.2));
        const isi = maju(t, T.pitaS1(i), T.pitaS1(i) + 0.25) * (1 - maju(t, hapus, hapus + 0.25)) * 0.22;
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: M.x, top: M.y + i * PITA_H, width: M.s, height: PITA_H, background: i === 6 ? OL.emas : AKSEN, opacity: isi }} />
            <div style={{ position: 'absolute', left: M.x + 16, top: M.y + i * PITA_H + PITA_H / 2, translate: '0 -50%', fontFamily: SAIRA, fontWeight: 800, fontSize: 44, color: i === 6 ? OL.emas : OL.putih, opacity: o, textShadow: '0 2px 10px #000' }}>
              {i + 1}
              {i === 0 ? <span style={{ fontFamily: MONO, fontSize: 22, marginLeft: 12, color: OL.putih }}>= 1 luas Bumi</span> : null}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

// S2+: world border = dinding bergaris di 4 sisi peta
const Border: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < T.world2 - 0.1 || t > T.pulang + 0.3) return null;
  const tembok = maju(t, T.dinding - 0.1, T.dinding + 0.4) * (1 - maju(t, T.pulang - 0.4, T.pulang));
  const pukul = t > T.berhenti10 ? Math.exp(-(t - T.berhenti10) * 3) : 0;
  const tebal = 22;
  const garis = (o: number) => `repeating-linear-gradient(45deg, rgba(76,195,255,${o}) 0 10px, rgba(76,195,255,0) 10px 22px)`;
  const pos = `${(t * 30) % 31}px 0`;
  const sisi = [
    { left: M.x, top: M.y, width: M.s, height: tebal },
    { left: M.x, top: M.y + M.s - tebal, width: M.s, height: tebal },
    { left: M.x, top: M.y, width: tebal, height: M.s },
    { left: M.x + M.s - tebal, top: M.y, width: tebal, height: M.s },
  ];
  const keliling = `M ${MC.x} ${M.y} L ${M.x + M.s} ${M.y} L ${M.x + M.s} ${M.y + M.s} L ${M.x} ${M.y + M.s} L ${M.x} ${M.y} L ${MC.x} ${M.y}`;
  return (
    <>
      {sisi.map((g, i) => (
        <div key={i} style={{ position: 'absolute', ...g, backgroundImage: garis(0.55 + pukul * 0.4), backgroundPosition: pos, opacity: tembok }} />
      ))}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', filter: `drop-shadow(0 0 ${10 + pukul * 20}px ${AKSEN})` }} width={1} height={1}>
        <GarisDigambar d={keliling} mulai={T.world2 - 0.05} lama={0.6} warna={AKSEN} tebal={8} hapus={T.pulang - 0.35} lamaHapus={0.3} opacity={1} />
      </svg>
      {t > S[1].mulai && t < S[2].mulai + 0.3 ? (
        <div style={{ position: 'absolute', left: M.x + M.s / 2, top: M.y - 4, translate: '-50% -100%', fontFamily: MONO, fontWeight: 800, fontSize: 28, color: AKSEN, opacity: maju(t, T.world2 + 0.3, T.world2 + 0.5) * (1 - maju(t, S[2].mulai, S[2].mulai + 0.25)), letterSpacing: '0.1em', textShadow: '0 2px 8px #000' }}>
          WORLD BORDER
        </div>
      ) : null}
    </>
  );
};

// S2–S3: panah dari titik tengah ke 4 sisi (counter 29.999.984 diikat ke panjang panah)
export function majuPanah(t: number, T: W) {
  return maju(t, T.hampir2, T.blok2 + 0.25, EASE.kamera);
}
const Panah: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < T.hampir2 - 0.1 || t > S[3].mulai + 0.2) return null;
  const p = majuPanah(t, T);
  const L = M.s / 2 - 30;
  const vert = 1 - maju(t, T.lebar3 - 0.2, T.lebar3 + 0.1, EASE.keluar);
  const semua = 1 - maju(t, S[3].mulai - 0.15, S[3].mulai + 0.1, EASE.keluar);
  const tiap = pegas(t, T.tiap2, fps, { damping: 8, stiffness: 220, mass: 0.5 });
  const kepala = 1 + 0.25 * Math.sin(Math.PI * Math.min(1, tiap));
  const arah = [
    { dx: 1, dy: 0, o: 1 },
    { dx: -1, dy: 0, o: 1 },
    { dx: 0, dy: -1, o: vert },
    { dx: 0, dy: 1, o: vert },
  ];
  const titik = pegas(t, T.titik2 - 0.05, fps, { damping: 9, stiffness: 200, mass: 0.6 });
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: semua }} width={1} height={1}>
        {arah.map((a, i) => {
          const x2 = MC.x + a.dx * L * p;
          const y2 = MC.y + a.dy * L * p;
          if (p <= 0.01) return null;
          const k = 26 * kepala;
          const kx = a.dx !== 0 ? -a.dx * k : k * 0.62;
          const ky = a.dy !== 0 ? -a.dy * k : k * 0.62;
          return (
            <g key={i} opacity={a.o}>
              <path d={`M ${MC.x} ${MC.y} L ${x2} ${y2}`} stroke={OL.emas} strokeWidth={8} strokeLinecap="round" />
              <path
                d={a.dx !== 0 ? `M ${x2 + kx} ${y2 - k * 0.62} L ${x2} ${y2} L ${x2 + kx} ${y2 + k * 0.62}` : `M ${x2 - k * 0.62} ${y2 + ky} L ${x2} ${y2} L ${x2 + k * 0.62} ${y2 + ky}`}
                stroke={OL.emas}
                strokeWidth={8}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}
        <circle cx={MC.x} cy={MC.y} r={14} fill={OL.emas} />
        {titik > 0 ? <circle cx={MC.x} cy={MC.y} r={14 + 40 * titik} fill="none" stroke={OL.emas} strokeWidth={4} opacity={Math.max(0, 1 - titik * 0.9) * (t < T.tiap2 + 0.8 ? 1 : 0)} /> : null}
      </svg>
      {t > T.titik2 - 0.1 ? (
        <div style={{ position: 'absolute', left: MC.x + 22, top: MC.y + 18, fontFamily: MONO, fontWeight: 800, fontSize: 26, color: OL.emas, opacity: maju(t, T.titik2, T.titik2 + 0.2) * (1 - maju(t, T.lebar3 - 0.2, T.lebar3)), textShadow: '0 2px 8px #000' }}>titik tengah</div>
      ) : null}
    </>
  );
};

// S3–S5: garis ukur lebar di atas peta. Angkanya diikat ke garis yang lagi ditarik.
const UkurLebar: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < T.lebar3 - 0.1 || t > S[5].mulai + 0.4) return null;
  const y = M.y - 34;
  const p = maju(t, T.lebar3, T.blok3 + 0.1, EASE.kamera);
  const keluar = maju(t, S[5].mulai - 0.1, S[5].mulai + 0.25, EASE.keluar);
  const sembunyi = maju(t, T.selam0 + 0.05, T.selam0 + 0.3) * (1 - maju(t, T.selam1 + 0.2, T.selam1 + 0.5));
  const o = (1 - keluar) * (1 - sembunyi);
  // km: angka gulir pas "enam puluh ribu kilometer", diikat ke kilau yang nyapu garis
  const pk = maju(t, T.enam4 - 0.1, T.km4 + 0.2, EASE.kamera);
  const kali = pegas(t, T.jadi4 + 0.25, fps, { damping: 11, stiffness: 190, mass: 0.6 });
  const vert = maju(t, T.persegi5 - 0.1, T.persegi5 + 0.4, EASE.kamera);
  const xKiri = MC.x - (M.s / 2) * p;
  const xKanan = MC.x + (M.s / 2) * p;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o }}>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <path d={`M ${xKiri} ${y} L ${xKanan} ${y}`} stroke={OL.emas} strokeWidth={5} />
        <path d={`M ${xKiri} ${y - 16} L ${xKiri} ${y + 16} M ${xKanan} ${y - 16} L ${xKanan} ${y + 16}`} stroke={OL.emas} strokeWidth={5} opacity={p > 0.02 ? 1 : 0} />
        {pk > 0 && pk < 1 ? <rect x={M.x + M.s * pk - 60} y={y - 5} width={120} height={10} fill="#fff" opacity={0.8} /> : null}
        {/* S5: sisi kiri ikut diukur (persegi) */}
        {vert > 0 ? (
          <>
            <path d={`M ${M.x - 34} ${M.y} L ${M.x - 34} ${M.y + M.s * vert}`} stroke={OL.emas} strokeWidth={5} />
            <path d={`M ${M.x - 50} ${M.y} L ${M.x - 18} ${M.y}`} stroke={OL.emas} strokeWidth={5} />
            {vert >= 1 ? <path d={`M ${M.x - 50} ${M.y + M.s} L ${M.x - 18} ${M.y + M.s}`} stroke={OL.emas} strokeWidth={5} /> : null}
          </>
        ) : null}
      </svg>
      <ChipAngka
        x={MC.x}
        y={y}
        o={maju(t, T.lebar3, T.lebar3 + 0.15)}
        isi={
          pk <= 0 ? (
            <>
              <AngkaJalan dari={0} ke={59999968} progress={p} gaya={{ minWidth: '4.3em', display: 'inline-block', textAlign: 'right' }} />
              <span style={{ fontFamily: MONO, fontSize: 26, marginLeft: 10 }}>blok</span>
            </>
          ) : (
            <>
              ±<AngkaJalan dari={0} ke={60000} progress={pk} gaya={{ minWidth: '2.9em', display: 'inline-block', textAlign: 'right' }} />
              <span style={{ fontFamily: MONO, fontSize: 26, marginLeft: 10 }}>km</span>
            </>
          )
        }
      />
      {/* "× 1 m" nempel di chip pas balik dari blok */}
      {kali > 0 && t < T.enam4 + 0.2 ? (
        <div style={{ position: 'absolute', left: MC.x + 205, top: y, translate: '-50% -50%', scale: String(kali), padding: '4px 14px', borderRadius: 10, background: AKSEN, color: OL.navy0, fontFamily: SAIRA, fontWeight: 800, fontSize: 38, opacity: 1 - maju(t, T.enam4 - 0.1, T.enam4 + 0.15) }}>× 1 m</div>
      ) : null}
      {vert > 0.6 ? (
        <div style={{ position: 'absolute', left: M.x - 34, top: MC.y, width: 0, height: 0, rotate: '-90deg' }}>
          <ChipAngka x={0} y={0} o={maju(t, T.persegi5 + 0.2, T.persegi5 + 0.4)} ukuran={34} isi={<>±60.000<span style={{ fontFamily: MONO, fontSize: 22, marginLeft: 6 }}>km</span></>} />
        </div>
      ) : null}
    </div>
  );
};

// S5: luas diisi diagonal; angka 3,6 miliar diikat ke luas yang keisi
function majuLuas(t: number, T: W) {
  return maju(t, T.luas5, T.miliar5 + 0.3, EASE.kamera);
}
const IsiLuas: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < T.luas5 - 0.1 || t > S[5].mulai + 0.5) return null;
  const p = majuLuas(t, T);
  const keluar = maju(t, S[5].mulai, S[5].mulai + 0.4, EASE.keluar);
  // garis diagonal sapu: clip segitiga → persegi
  const q = p * 2;
  const clip = `polygon(0 0, ${Math.min(100, q * 100)}% 0, ${q > 1 ? `100% ${(q - 1) * 100}%, ` : ''}${q > 1 ? `${(q - 1) * 100}% 100%, ` : ''}0 ${Math.min(100, q * 100)}%)`;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: M.x,
          top: M.y,
          width: M.s,
          height: M.s,
          clipPath: clip,
          backgroundImage: `repeating-linear-gradient(-45deg, rgba(255,197,61,0.42) 0 6px, rgba(255,197,61,0.12) 6px 26px)`,
          opacity: 1 - keluar,
        }}
      />
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - keluar }} width={1} height={1}>
        {/* siku persegi di 4 pojok */}
        {[
          [M.x, M.y, 1, 1],
          [M.x + M.s, M.y, -1, 1],
          [M.x, M.y + M.s, 1, -1],
          [M.x + M.s, M.y + M.s, -1, -1],
        ].map(([x, y, sx, sy], i) => (
          <GarisDigambar key={i} d={`M ${x + sx * 44} ${y} L ${x + sx * 44} ${y + sy * 44} L ${x} ${y + sy * 44}`} mulai={S[4].mulai + 0.1 + i * 0.08} lama={0.2} warna={OL.emas} tebal={6} />
        ))}
      </svg>
    </>
  );
};

// S6–S7: pita kulit Bumi ×7 → laut surut → ubin daratan ×24
const PitaBumi: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < T.peel1 - 0.05 || t > T.kabut0 + 0.8) return null;
  const surut = maju(t, S[6].mulai + 0.15, T.darat7 + 0.35, EASE.kamera);
  const pergi = maju(t, T.peta7 - 0.3, T.peta7 + 0.2, EASE.keluar); // pita 2–7 minggir
  const keUbin = maju(t, T.peta7 - 0.2, T.peta7 + 0.35, EASE.kamera); // darat pita 1 → ubin 1
  const keluarSemua = maju(t, T.kabut0, T.kabut0 + 0.5, EASE.keluar);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - keluarSemua }}>
      {Array.from({ length: 7 }, (_, i) => {
        const m = i === 0 ? 1 : maju(t, T.pita6(i), T.pita6(i) + 0.16, EASE.masuk);
        if (m <= 0) return null;
        const y = M.y + i * PITA_H;
        const yy = lerp(M.y + (i - 1) * PITA_H, y, m);
        const wDarat = M.s * DARAT;
        if (i === 0) {
          // darat pita 1 → ubin 1 (luasnya ±sama)
          const w = lerp(M.s, wDarat, surut);
          const x = M.x;
          const ww = lerp(w, UBIN, keUbin);
          const hh = lerp(PITA_H, UBIN, keUbin);
          return (
            <div key={i} style={{ position: 'absolute', left: x, top: y, width: ww, height: hh, overflow: 'hidden', borderRadius: 4, outline: `2px solid ${surut > 0.5 ? OL.lime : AKSEN}`, boxShadow: surut > 0.5 ? `0 0 18px ${OL.lime}88` : undefined }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: M.s, height: PITA_H, scale: keUbin > 0 ? `${lerp(1, UBIN / wDarat, keUbin)} ${lerp(1, UBIN / PITA_H, keUbin)}` : undefined, transformOrigin: '0 0' }}>
                <IsiPita w={M.s} h={PITA_H} surut={surut} label={keUbin < 0.1} />
              </div>
            </div>
          );
        }
        return (
          <div key={i} style={{ position: 'absolute', left: M.x - pergi * 300, top: yy, width: M.s, height: PITA_H, overflow: 'hidden', borderRadius: 4, outline: `2px solid ${AKSEN}`, opacity: m * (1 - pergi), zIndex: 7 - i }}>
            <IsiPita w={M.s} h={PITA_H} surut={surut} />
          </div>
        );
      })}
      {/* chip ×n di kanan pita terakhir yang masuk */}
      {(() => {
        let n = 1;
        for (let i = 1; i < 7; i++) if (t >= T.pita6(i) + 0.08) n = i + 1;
        const o = maju(t, T.pita6(1), T.pita6(1) + 0.1) * (1 - maju(t, S[6].mulai - 0.1, S[6].mulai + 0.1));
        const pp = pegas(t, T.pita6(n - 1) + 0.08, fps, { damping: 9, stiffness: 240, mass: 0.5 });
        return o > 0 ? <ChipAngka x={M.x + M.s - 70} y={M.y + (n - 0.5) * PITA_H} o={o} skala={0.8 + 0.2 * pp} ukuran={48} isi={<>×{n}</>} /> : null;
      })()}
      <UbinDarat T={T} />
    </div>
  );
};
export function nUbin(t: number, T: W) {
  // 24 ubin keisi rata dari "peta" sampai "kali" (ubin 1 = darat pita 1), ubin 25 cuma 0,17
  const p = maju(t, T.peta7 + 0.4, T.kali7, EASE.linear);
  return 1 + p * 23;
}
const UbinDarat: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < T.peta7 - 0.1) return null;
  const n = nUbin(t, T);
  const grid = maju(t, T.peta7 + 0.1, T.peta7 + 0.5);
  const sisa = maju(t, T.kali7 + 0.05, T.kali7 + 0.3) * 0.17;
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        {Array.from({ length: 4 }, (_, i) => (
          <React.Fragment key={i}>
            <GarisDigambar d={`M ${M.x + (i + 1) * UBIN} ${M.y} L ${M.x + (i + 1) * UBIN} ${M.y + M.s}`} mulai={T.peta7 + 0.05 + i * 0.05} lama={0.3} warna={OL.lime} tebal={2} opacity={0.5} />
            <GarisDigambar d={`M ${M.x} ${M.y + (i + 1) * UBIN} L ${M.x + M.s} ${M.y + (i + 1) * UBIN}`} mulai={T.peta7 + 0.05 + i * 0.05} lama={0.3} warna={OL.lime} tebal={2} opacity={0.5} />
          </React.Fragment>
        ))}
      </svg>
      {Array.from({ length: 25 }, (_, i) => {
        if (i === 0) return null;
        const r = Math.floor(i / 5);
        const c = i % 5;
        const isi = i < 24 ? Math.min(1, Math.max(0, n - i) * 3) : 0;
        const fr = i === 24 ? sisa : 1;
        if (isi <= 0 && i !== 24) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: M.x + c * UBIN + 3, top: M.y + r * UBIN + 3, width: (UBIN - 6) * (i === 24 ? 1 : 1), height: UBIN - 6, opacity: grid }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: (UBIN - 6) * fr,
                height: UBIN - 6,
                backgroundImage: `url(${staticFile('o1/darat.png')})`,
                backgroundSize: '96px 96px',
                imageRendering: 'pixelated',
                scale: i === 24 ? undefined : String(0.6 + 0.4 * isi),
                opacity: i === 24 ? 1 : isi,
                borderRadius: 4,
                outline: `2px solid ${OL.lime}`,
              }}
            />
          </div>
        );
      })}
      {t > S[6].mulai && n > 1.5 ? (
        <ChipAngka x={M.x + 4 * UBIN + UBIN / 2} y={M.y + 4 * UBIN + UBIN / 2} o={maju(t, T.kali7 - 0.3, T.kali7)} ukuran={50} isi={<>×24</>} />
      ) : null}
    </>
  );
};

// S10: jejak dari titik tengah ke border kanan, hari 0 → 80 diikat ke panjang jejak
export function majuJejak(t: number, T: W) {
  return maju(t, T.jejak0, T.jejak1, EASE.linear);
}
const Jejak: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < T.jejak0 - 0.3 || t > T.ctaKeluar + 0.4) return null;
  const p = majuJejak(t, T);
  const keluar = maju(t, S[10].mulai, S[10].mulai + 0.4, EASE.keluar);
  const x2 = lerp(MC.x, M.x + M.s - 26, p);
  const masuk = maju(t, T.jejak0 - 0.3, T.jejak0);
  const hari = p * 80;
  // matahari/bulan: tiap hari = siang + malam (dipercepat), digambar sebagai ikon kecil yang muter pelan
  const putar = Math.min(hari, 80) * 12;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - keluar }}>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <path d={`M ${MC.x} ${MC.y} L ${x2} ${MC.y}`} stroke={OL.emas} strokeWidth={8} strokeDasharray="2 14" strokeLinecap="round" opacity={masuk} />
        <circle cx={MC.x} cy={MC.y} r={12} fill={OL.emas} opacity={masuk} />
      </svg>
      <Pemain x={x2} y={MC.y} o={masuk} arah={0} />
      <ChipAngka
        x={MC.x + 200}
        y={MC.y - 120}
        o={masuk}
        ukuran={56}
        isi={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
            <svg width={46} height={46} viewBox="-23 -23 46 46" style={{ rotate: `${putar}deg` }}>
              <circle cx={0} cy={-10} r={8} fill={OL.emas} />
              <circle cx={0} cy={11} r={7} fill={OL.abuTerang} />
              <circle cx={4} cy={9} r={6} fill={OL.navy0} />
            </svg>
            <span style={{ fontFamily: MONO, fontSize: 28 }}>hari</span>
            <AngkaJalan dari={0} ke={80} progress={p} lantai gaya={{ minWidth: '1.2em', display: 'inline-block', textAlign: 'right' }} />
          </span>
        }
      />
      <div style={{ position: 'absolute', left: MC.x + 200, top: MC.y - 64, translate: '-50% 0', fontFamily: MONO, fontWeight: 600, fontSize: 22, color: OL.abuTerang, opacity: masuk, whiteSpace: 'nowrap', textShadow: '0 2px 6px #000' }}>waktu dipercepat</div>
    </div>
  );
};

/** penanda pemain (panah segitiga emas + label "kamu") */
const Pemain: React.FC<{ x: number; y: number; o: number; arah: number; skala?: number }> = ({ x, y, o, arah, skala = 1 }) => {
  const t = useDetik();
  if (o <= 0) return null;
  const nap = 1 + Math.sin(t * 7) * 0.05;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 0, height: 0, opacity: o, scale: String(skala) }}>
      <div style={{ position: 'absolute', left: -34, top: -34, width: 68, height: 68, borderRadius: '50%', background: `radial-gradient(circle, ${OL.emas}66 0%, ${OL.emas}00 70%)`, scale: String(nap * 1.4) }} />
      <svg style={{ position: 'absolute', left: -26, top: -26, overflow: 'visible', rotate: `${arah}deg` }} width={52} height={52}>
        <path d="M 46 26 L 6 4 L 16 26 L 6 48 Z" fill={OL.emas} stroke={OL.navy0} strokeWidth={4} strokeLinejoin="round" />
      </svg>
      <div style={{ position: 'absolute', left: 0, top: -64, translate: '-50% 0', padding: '2px 10px', borderRadius: 8, background: OL.emas, color: OL.navy0, fontFamily: MONO, fontWeight: 800, fontSize: 22 }}>kamu</div>
    </div>
  );
};

// ======================================================================================================
// S4: tembus ke 1 blok → kubus 1 m (panel layar)
const PANEL = { x: 90, y: 470, w: 900, h: 860 };
function tembus(t: number, a: number, b: number) {
  return maju(t, a, a + 0.4, EASE.kamera) * (1 - maju(t, b, b + 0.4, EASE.kamera));
}
const PanelKubus: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const p = tembus(t, T.selam0 + 0.2, T.selam1);
  if (p <= 0) return null;
  const kecil = { x: 540 - 10, y: 960 - 10, w: 20, h: 20 };
  const x = lerp(kecil.x, PANEL.x, p);
  const y = lerp(kecil.y, PANEL.y, p);
  const w = lerp(kecil.w, PANEL.w, p);
  const h = lerp(kecil.h, PANEL.h, p);
  const isi = maju(t, T.selam0 + 0.4, T.selam0 + 0.65) * (1 - maju(t, T.selam1, T.selam1 + 0.2));
  const kubus = pegas(t, T.kubus - 0.1, fps, { damping: 9, stiffness: 170, mass: 0.7 });
  const cx = 450;
  const cy = 470;
  const a = 250;
  const goyang = noise('kubus', t * 0.5) * 3;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 24 * p, overflow: 'hidden', background: `linear-gradient(180deg, ${OL.permukaan}, ${OL.navy0})`, border: `3px solid ${AKSEN}`, boxShadow: `0 0 40px ${AKSEN}44` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: PANEL.w, height: PANEL.h, transformOrigin: '0 0', scale: String(w / PANEL.w), opacity: isi }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(76,195,255,0.08) 2px, transparent 2px), linear-gradient(90deg, rgba(76,195,255,0.08) 2px, transparent 2px)', backgroundSize: '60px 60px', backgroundPosition: `${t * 8}px ${t * 5}px` }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: PANEL.w, height: PANEL.h, rotate: `${goyang}deg`, scale: String(0.75 + 0.25 * kubus), transformOrigin: `${cx}px ${cy}px` }}>
          <Kubus cx={cx} cy={cy} a={a} />
        </div>
        {/* penggaris 1 m: tinggi (kiri) & lebar (bawah kiri) */}
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
          <Penggaris x1={cx - a * 0.866 - 46} y1={cy - a / 2} x2={cx - a * 0.866 - 46} y2={cy + a / 2} mulai={T.meter4 - 0.35} />
          <Penggaris x1={cx - a * 0.866 - 30} y1={cy + a / 2 + 40} x2={cx - 16} y2={cy + a + 40} mulai={T.meter4 - 0.2} />
        </svg>
        <ChipAngka x={cx - a * 0.866 - 46 - 80} y={cy} o={maju(t, T.meter4 - 0.05, T.meter4 + 0.15)} ukuran={44} isi="1 m" warna={OL.emas} />
        <ChipAngka x={cx - a * 0.43 - 70} y={cy + a * 0.75 + 90} o={maju(t, T.meter4 + 0.1, T.meter4 + 0.3)} ukuran={44} isi="1 m" warna={OL.emas} />
        <div style={{ position: 'absolute', left: 640, top: 140, fontFamily: MONO, fontWeight: 700, fontSize: 28, color: AKSEN, opacity: maju(t, T.selam0 + 0.6, T.selam0 + 0.8), lineHeight: 1.3 }}>
          1 blok
          <br />
          <span style={{ color: OL.abuTerang, fontWeight: 500, fontSize: 24 }}>(diperbesar)</span>
        </div>
      </div>
    </div>
  );
};
const Penggaris: React.FC<{ x1: number; y1: number; x2: number; y2: number; mulai: number }> = ({ x1, y1, x2, y2, mulai }) => {
  const t = useDetik();
  const p = maju(t, mulai, mulai + 0.3, EASE.kamera);
  if (p <= 0) return null;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const L = Math.hypot(dx, dy);
  const nx = -dy / L;
  const ny = dx / L;
  const tik = Array.from({ length: 11 }, (_, i) => i / 10).filter((f) => f <= p);
  return (
    <g>
      <path d={`M ${x1} ${y1} L ${x1 + dx * p} ${y1 + dy * p}`} stroke={OL.emas} strokeWidth={5} strokeLinecap="round" />
      {tik.map((f, i) => {
        const len = i % 5 === 0 ? 22 : 11;
        const x = x1 + dx * f;
        const y = y1 + dy * f;
        return <path key={i} d={`M ${x} ${y} L ${x + nx * len} ${y + ny * len}`} stroke={OL.emas} strokeWidth={4} />;
      })}
    </g>
  );
};
/** kubus voxel generik (isometrik): atas rumput, samping tanah dengan pinggiran rumput. Digambar sendiri per piksel. */
const Kubus: React.FC<{ cx: number; cy: number; a: number }> = ({ cx, cy, a }) => {
  const N = 8;
  const c = 0.866 * a;
  const hijau = ['#4fa83d', '#5cb847', '#46963a', '#67c34f'];
  const tanah = ['#8a5a32', '#7a4e2b', '#966339', '#6d4426'];
  const sel: React.ReactNode[] = [];
  // atas: titik (u,v) → (cx + (u - v) * c / N, cy - a/2 ... ) basis: kanan = (c/N, a/2/N), kiri = (-c/N, a/2/N), dari puncak (cx, cy - a)
  const atas = (u: number, v: number) => [cx + ((u - v) * c) / N, cy - a + ((u + v) * a) / 2 / N];
  for (let u = 0; u < N; u++)
    for (let v = 0; v < N; v++) {
      const [x0, y0] = atas(u, v);
      const [x1, y1] = atas(u + 1, v);
      const [x2, y2] = atas(u + 1, v + 1);
      const [x3, y3] = atas(u, v + 1);
      const w = hijau[Math.floor(random(`ka${u}-${v}`) * 4)];
      sel.push(<path key={`a${u}-${v}`} d={`M${x0} ${y0} L${x1} ${y1} L${x2} ${y2} L${x3} ${y3} Z`} fill={w} />);
    }
  // samping kiri: dari (cx - c, cy - a/2) ke (cx, cy); turun a
  const kiri = (u: number, v: number) => [cx - c + (u * c) / N, cy - a / 2 + (u * a) / 2 / N + (v * a) / N];
  const kanan = (u: number, v: number) => [cx + (u * c) / N, cy - (u * a) / 2 / N + (v * a) / N];
  for (const [fn, gelap, k] of [
    [kiri, 0.78, 'l'],
    [kanan, 0.62, 'r'],
  ] as const)
    for (let u = 0; u < N; u++)
      for (let v = 0; v < N; v++) {
        const [x0, y0] = fn(u, v);
        const [x1, y1] = fn(u + 1, v);
        const [x2, y2] = fn(u + 1, v + 1);
        const [x3, y3] = fn(u, v + 1);
        const rumput = v === 0 || (v === 1 && random(`kr${k}${u}`) > 0.5);
        const pal = rumput ? hijau : tanah;
        const w = pal[Math.floor(random(`k${k}${u}-${v}`) * 4)];
        sel.push(<path key={`${k}${u}-${v}`} d={`M${x0} ${y0} L${x1} ${y1} L${x2} ${y2} L${x3} ${y3} Z`} fill={w} style={{ filter: `brightness(${gelap})` }} />);
      }
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
      <ellipse cx={cx} cy={cy + a + 30} rx={c * 1.05} ry={36} fill="#000" opacity={0.35} />
      {sel}
      <path d={`M${cx} ${cy - a} L${cx + c} ${cy - a / 2} L${cx + c} ${cy + a / 2} L${cx} ${cy + a} L${cx - c} ${cy + a / 2} L${cx - c} ${cy - a / 2} Z M${cx - c} ${cy - a / 2} L${cx} ${cy} L${cx + c} ${cy - a / 2} M${cx} ${cy} L${cx} ${cy + a}`} fill="none" stroke={OL.navy0} strokeWidth={5} strokeLinejoin="round" />
    </svg>
  );
};

// ======================================================================================================
// S8: kabut → chunk 16×16 muncul di sekitar "kamu"
function posPemain8(t: number, T: W) {
  const a = { x: MC.x, y: MC.y };
  const b = { x: CH.x + (CHUNK_SOROT.c + 0.5) * CH.s, y: CH.y + (CHUNK_SOROT.r + 0.5) * CH.s };
  const p = maju(t, T.kamu8 - 0.15, T.s[8].mulai - 0.05, EASE.kamera);
  return { x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), p };
}
const PanelChunk: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const g0 = T.kabut0 + 0.55;
  if (t < g0 - 0.05 || t > T.naik10 + 0.6) return null;
  const keluar = maju(t, T.naik10, T.naik10 + 0.45, EASE.keluar);
  const pm = posPemain8(t, T);
  const spawn = T.sekaligus8 - 0.1;
  // chunk muncul kalau "kamu" udah deket (≤ 1,5 chunk) — ring pertama pas spawn, sisanya ngikut gerak
  const pc = { c: (pm.x - CH.x) / CH.s - 0.5, r: (pm.y - CH.y) / CH.s - 0.5 };
  const sorot = maju(t, T.potong8 - 0.1, T.potong8 + 0.3);
  const gridBlok = maju(t, T.enam8 - 0.05, T.blok8 + 0.1, EASE.kamera);
  const SC = { x: CH.x + CHUNK_SOROT.c * CH.s, y: CH.y + CHUNK_SOROT.r * CH.s };
  return (
    // zoom & geser pelan ngikut "kamu" (biar gak ada frame beku)
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - keluar, scale: String((1 + 0.1 * maju(t, g0, T.naik10, EASE.linear)) * (1 - keluar * 0.3)), translate: `${(-(pm.x - MC.x) * 0.25).toFixed(1)}px ${(-(pm.y - MC.y) * 0.25 + 18 * noise('chk', t * 0.4)).toFixed(1)}px`, transformOrigin: `${MC.x}px ${MC.y}px` }}>
      <div style={{ position: 'absolute', left: CH.x, top: CH.y, width: CH.n * CH.s, height: CH.n * CH.s, background: '#06080f', borderRadius: 6, opacity: maju(t, g0 - 0.05, g0 + 0.2) }} />
      {Array.from({ length: CH.n * CH.n }, (_, i) => {
        const c = i % CH.n;
        const r = Math.floor(i / CH.n);
        // waktu muncul: pertama kali jarak ke pemain ≤ 1,5 (dicari mundur pakai posisi sekarang & sejarah sederhana)
        const jarakSpawn = Math.hypot(c - 2, r - 2);
        let muncul = jarakSpawn <= 1.5 ? spawn + jarakSpawn * 0.18 : 999;
        if (muncul > 900) {
          // cek sepanjang lintasan (12 titik) kapan pertama masuk radius
          for (let j = 0; j <= 12; j++) {
            const tj = T.kamu8 - 0.15 + (j / 12) * (T.s[8].mulai - T.kamu8 + 0.1);
            const q = posPemain8(tj, T);
            if (Math.hypot(c - ((q.x - CH.x) / CH.s - 0.5), r - ((q.y - CH.y) / CH.s - 0.5)) <= 1.5) {
              muncul = tj;
              break;
            }
          }
        }
        const p = pegas(t, muncul, fps, { damping: 12, stiffness: 200, mass: 0.6 });
        if (p <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: CH.x + c * CH.s + 2,
              top: CH.y + r * CH.s + 2,
              width: CH.s - 4,
              height: CH.s - 4,
              backgroundImage: `url(${staticFile('o1/terrain.png')})`,
              backgroundSize: `${112 * 10}px ${176 * 10}px`,
              backgroundPosition: `${-(c * 16 * 10) - 2}px ${-(r * 16 * 10) - 2}px`,
              imageRendering: 'pixelated',
              scale: String(0.5 + 0.5 * p),
              opacity: Math.min(1, p * 1.4),
              borderRadius: 3,
            }}
          />
        );
      })}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        {Array.from({ length: CH.n + 1 }, (_, i) => (
          <React.Fragment key={i}>
            <GarisDigambar d={`M ${CH.x + i * CH.s} ${CH.y} L ${CH.x + i * CH.s} ${CH.y + CH.n * CH.s}`} mulai={g0 + i * 0.04} lama={0.35} warna={OL.lime} tebal={2.5} opacity={0.55} />
            <GarisDigambar d={`M ${CH.x} ${CH.y + i * CH.s} L ${CH.x + CH.n * CH.s} ${CH.y + i * CH.s}`} mulai={g0 + i * 0.04} lama={0.35} warna={OL.lime} tebal={2.5} opacity={0.55} />
          </React.Fragment>
        ))}
        {/* grid blok 16×16 di chunk sorot */}
        {gridBlok > 0
          ? Array.from({ length: 15 }, (_, i) => {
              const f = (i + 1) / 16;
              const o = gridBlok > f ? 0.7 : 0;
              return (
                <React.Fragment key={i}>
                  <path d={`M ${SC.x + f * CH.s} ${SC.y} L ${SC.x + f * CH.s} ${SC.y + CH.s}`} stroke={OL.navy0} strokeWidth={1.4} opacity={o} />
                  <path d={`M ${SC.x} ${SC.y + f * CH.s} L ${SC.x + CH.s} ${SC.y + f * CH.s}`} stroke={OL.navy0} strokeWidth={1.4} opacity={o} />
                </React.Fragment>
              );
            })
          : null}
        <GarisDigambar d={`M ${SC.x} ${SC.y} L ${SC.x + CH.s} ${SC.y} L ${SC.x + CH.s} ${SC.y + CH.s} L ${SC.x} ${SC.y + CH.s} Z`} mulai={T.potong8 - 0.1} lama={0.3} warna={OL.emas} tebal={6} />
      </svg>
      {sorot > 0 ? (
        <>
          <ChipAngka x={SC.x + CH.s / 2} y={SC.y - 34} o={maju(t, T.enam8 - 0.1, T.enam8 + 0.1)} ukuran={34} isi={<><AngkaJalan dari={0} ke={16} progress={gridBlok} /> blok</>} />
          <ChipAngka x={SC.x - 70} y={SC.y + CH.s / 2} o={maju(t, T.enam8, T.enam8 + 0.2)} ukuran={34} isi={<><AngkaJalan dari={0} ke={16} progress={gridBlok} /> blok</>} />
          <Stempel mulai={T.chunk8 - 0.05} rot={-8} gaya={{ position: 'absolute', left: SC.x + CH.s / 2 - 90, top: SC.y + CH.s + 14, width: 180, textAlign: 'center' }}>
            <div style={{ padding: '4px 14px', borderRadius: 10, background: OL.emas, color: OL.navy0, fontFamily: SAIRA, fontWeight: 800, fontSize: 46 }}>chunk</div>
          </Stempel>
        </>
      ) : null}
      <Pemain x={pm.x} y={pm.y} o={maju(t, spawn, spawn + 0.2)} arah={-40} skala={0.9} />
    </div>
  );
};

// S9: tembus ke 1 chunk, jalan 4,317 blok/detik (kecepatan asli, gak dipercepat)
export function majuJalan(t: number, T: W) {
  return maju(t, T.jalan0, T.jalan1, EASE.linear);
}
const PanelJalan: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const SC = { x: CH.x + CHUNK_SOROT.c * CH.s, y: CH.y + CHUNK_SOROT.r * CH.s, w: CH.s, h: CH.s };
  const p = maju(t, T.tembusJalan, T.tembusJalan + 0.45, EASE.kamera);
  if (p <= 0 || t > T.naik10 + 0.6) return null;
  const keluar = maju(t, T.naik10, T.naik10 + 0.45, EASE.kamera);
  const x = lerp(SC.x, JALAN.x, p);
  const y = lerp(SC.y, JALAN.y, p);
  const s = lerp(SC.w, JALAN.s, p);
  const B = JALAN.s / 16;
  const pj = majuJalan(t, T);
  const blok = pj * 16;
  const detik = Math.max(0, Math.min(t, T.jalan1) - T.jalan0);
  const baris = 8;
  const px = pj * JALAN.s;
  const cincin = detik % 1;
  const o = 1 - maju(t, T.naik10 + 0.1, T.naik10 + 0.4);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: s, height: s, overflow: 'hidden', borderRadius: 8, border: `4px solid ${OL.emas}`, opacity: o, scale: String(1 - keluar * 0.97), transformOrigin: `${MC.x - x}px ${MC.y - y}px` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: JALAN.s, height: JALAN.s, transformOrigin: '0 0', scale: String(s / JALAN.s) }}>
       <div style={{ position: 'absolute', inset: 0, scale: String(1 + 0.12 * maju(t, T.tembusJalan + 0.4, T.naik10, EASE.linear)), transformOrigin: `${Math.max(B, Math.min(JALAN.s - B, px))}px ${baris * B + B / 2}px` }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${staticFile('o1/terrain.png')})`,
            backgroundSize: `${112 * B}px ${176 * B}px`,
            backgroundPosition: `${-(CHUNK_SOROT.c * 16 * B)}px ${-(CHUNK_SOROT.r * 16 * B)}px`,
            imageRendering: 'pixelated',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(11,16,32,0.55) 2px, transparent 2px), linear-gradient(90deg, rgba(11,16,32,0.55) 2px, transparent 2px)', backgroundSize: `${B}px ${B}px` }} />
        {/* blok yang udah dilewatin */}
        {Array.from({ length: 16 }, (_, i) => {
          const isi = Math.min(1, Math.max(0, (blok - i) * 2));
          return isi > 0 ? <div key={i} style={{ position: 'absolute', left: i * B + 3, top: baris * B + 3, width: B - 6, height: B - 6, borderRadius: 6, background: `${OL.emas}55`, outline: `3px solid ${OL.emas}`, opacity: isi }} /> : null;
        })}
        <Pemain x={Math.min(JALAN.s - B / 2, Math.max(B / 2, px))} y={baris * B + B / 2} o={maju(t, T.tembusJalan + 0.3, T.tembusJalan + 0.5)} arah={0} skala={1.2} />
       </div>
      </div>
      {/* stopwatch + angka: diikat ke langkah */}
      <div style={{ position: 'absolute', left: 24, top: 22, display: 'flex', gap: 16, alignItems: 'center', opacity: maju(t, T.jalan0 - 0.3, T.jalan0) * (1 - keluar) }}>
        <svg width={86} height={86} viewBox="-43 -43 86 86">
          <circle r={34} fill={OL.navy0} stroke={OL.garis} strokeWidth={8} />
          <circle r={34} fill="none" stroke={OL.emas} strokeWidth={8} strokeDasharray={`${2 * Math.PI * 34 * (t < T.jalan1 ? cincin : 1)} 999`} transform="rotate(-90)" strokeLinecap="round" />
          <text y={9} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={24} fill={OL.putih}>1 dtk</text>
        </svg>
        <div style={{ padding: '6px 16px', borderRadius: 12, background: 'rgba(8,12,28,0.88)', border: `2px solid ${OL.garis}`, fontFamily: SAIRA, fontWeight: 800, fontSize: 44, color: OL.putih, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
          {formatAngka(detik, 1)}
          <span style={{ fontFamily: MONO, fontSize: 24, color: OL.abuTerang }}> dtk</span>
          <span style={{ color: OL.abu }}> · </span>
          <span style={{ color: OL.emas }}>{Math.floor(blok + 1e-6)}</span>
          <span style={{ fontFamily: MONO, fontSize: 24, color: OL.abuTerang }}> blok</span>
        </div>
      </div>
      <div style={{ position: 'absolute', right: 20, bottom: 18, fontFamily: MONO, fontWeight: 600, fontSize: 22, color: OL.putih, background: 'rgba(8,12,28,0.8)', padding: '3px 10px', borderRadius: 8, opacity: maju(t, T.jalan0, T.jalan0 + 0.3) * (1 - keluar) }}>kecepatan asli</div>
    </div>
  );
};

// ======================================================================================================
const Teks: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const kj = (n: number) => S[n].mulai - 0.22; // keluar sebelum kalimat berikut
  const sumber = (() => {
    if (t < 1.6) return null;
    if (t < S[1].mulai) return 'hitungan kami · Minecraft Wiki, Wikipedia';
    if (t < S[4].mulai) return 'Sumber: Minecraft Wiki (World border, Block)';
    if (t < S[5].mulai) return 'hitungan kami: 59.999,968 km × 59.999,968 km';
    if (t < S[7].mulai) return 'Sumber: Wikipedia (Earth), Pidwirny (UBC) · hitungan kami';
    if (t < S[8].mulai) return 'Sumber: Minecraft Wiki (Chunk)';
    if (t < S[9].mulai) return 'Sumber: Minecraft Wiki (Walking)';
    if (t < S[10].mulai) return 'hitungan kami: 29.999.984 blok ÷ 4,317 blok/detik';
    return null;
  })();
  const oSumber = maju(t, 1.6, 1.9) * (1 - maju(t, S[10].mulai - 0.2, S[10].mulai)) * (t > S[3].mulai && t < T.selam1 + 0.4 ? 1 - tembus(t, T.selam0 + 0.2, T.selam1) : 1);
  return (
    <>
      <TeksOL
        label={['peta', 'minecraft', 'java']}
        lMulai={0.15}
        judul={[
          { t: '±7×', mulai: 0.22, isi: <SapuSorot mulai={T.kali1} lama={0.22} warna={OL.emas} warnaTeks={[OL.emas, OL.navy0]} penuh>±7×</SapuSorot>, warna: OL.emas, gaya: { scale: String(1 + 0.12 * Math.sin(Math.PI * maju(t, T.kali1 - 0.05, T.kali1 + 0.3))) } },
          { t: 'luas', mulai: 0.3 },
          { t: 'Bumi', mulai: 0.36 },
        ]}
        jMulai={0.22}
        keluar={kj(1)}
      />
      {/* "hitungan kami" di bawah judul S1 */}
      <ChipKecil x={70} y={340} o={maju(t, T.kali1, T.kali1 + 0.2) * (1 - maju(t, kj(1), kj(1) + 0.2))} teks="luas permukaan, hitungan kami" warna={OL.emas} />
      <TeksOL
        label={['world', 'border']}
        lMulai={S[1].mulai}
        judul={[
          { t: '29.999.984', mulai: T.hampir2, isi: <AngkaJalan dari={0} ke={29999984} progress={majuPanah(t, T)} gaya={{ color: OL.emas, minWidth: '4.1em', display: 'inline-block' }} /> },
          { t: 'blok', mulai: T.blok2 },
        ]}
        jMulai={T.hampir2}
        keluar={kj(2)}
      />
      <ChipKecil x={70} y={340} o={maju(t, T.titik2, T.titik2 + 0.2) * (1 - maju(t, kj(2), kj(2) + 0.2))} teks="dari titik tengah ke tiap arah" />
      <TeksOL label={['lebar', 'peta']} lMulai={S[2].mulai} judul={[{ t: '±60', mulai: T.enam3, warna: OL.emas }, { t: 'juta', mulai: T.enam3 + 0.15, warna: OL.emas }, { t: 'blok', mulai: T.blok3 }]} jMulai={T.enam3} keluar={kj(3)} />
      <TeksOL label={['ukuran', 'blok']} lMulai={S[3].mulai + 0.1} judul={[{ t: '1', mulai: S[3].mulai + 0.1, warna: OL.emas }, { t: 'blok', mulai: S[3].mulai + 0.2 }, { t: '=', mulai: T.kubus, warna: OL.abu }, { t: '1', mulai: T.meter4 - 0.2, warna: OL.emas }, { t: 'meter', mulai: T.meter4 }]} jMulai={S[3].mulai + 0.1} keluar={T.enam4 - 0.3} ukuran={96} />
      <TeksOL label={['lebar', 'peta']} lMulai={T.enam4 - 0.1} judul={[{ t: '±60.000', mulai: T.enam4, warna: OL.emas }, { t: 'km', mulai: T.km4 }]} jMulai={T.enam4} keluar={kj(4)} />
      <TeksOL
        label={['luas', 'peta', '(persegi)']}
        lMulai={S[4].mulai}
        judul={[
          { t: '±', mulai: T.tiga5 - 0.1, warna: OL.emas },
          { t: '3,6', mulai: T.tiga5 - 0.1, isi: <AngkaJalan dari={0} ke={3.6} desimal={1} progress={majuLuas(t, T)} gaya={{ color: OL.emas }} /> },
          { t: 'miliar', mulai: T.miliar5 },
          { t: 'km²', mulai: T.miliar5 + 0.3 },
        ]}
        jMulai={T.tiga5 - 0.1}
        keluar={kj(5)}
      />
      <TeksOL
        label={['permukaan', 'bumi', '+', 'laut']}
        lMulai={S[5].mulai}
        judul={[
          { t: '±510', mulai: T.lima6, isi: <><span style={{ color: OL.emas }}>±</span><AngkaJalan dari={0} ke={510} progress={maju(t, T.peel0, T.peel1, EASE.kamera)} gaya={{ color: OL.emas, minWidth: '1.35em', display: 'inline-block' }} /></> },
          { t: 'juta', mulai: T.juta6 },
          { t: 'km²', mulai: T.juta6 + 0.2 },
        ]}
        jMulai={T.lima6}
        keluar={kj(6)}
      />
      <ChipKecil x={70} y={340} o={maju(t, T.pita6(5), T.pita6(5) + 0.2) * (1 - maju(t, kj(6), kj(6) + 0.2))} teks="7 × 510 juta = ±3,6 miliar km²" warna={OL.emas} />
      <TeksOL
        label={['daratan', 'bumi', 'aja']}
        lMulai={S[6].mulai}
        judul={[
          { t: '±24×', mulai: T.peta7 + 0.3, isi: <><span style={{ color: OL.emas }}>±</span><AngkaJalan dari={0} ke={24} progress={Math.min(24, Math.floor(nUbin(t, T))) / 24} belakang="×" gaya={{ color: OL.emas, minWidth: '1.5em', display: 'inline-block' }} /></> },
          { t: 'lebih', mulai: T.kali7 + 0.1 },
          { t: 'luas', mulai: T.kali7 + 0.25 },
        ]}
        jMulai={T.peta7 + 0.3}
        keluar={kj(7)}
      />
      <ChipKecil x={70} y={340} o={maju(t, T.darat7, T.darat7 + 0.2) * (1 - maju(t, kj(7), kj(7) + 0.2))} teks="daratan Bumi ±149 juta km²" />
      <TeksOL label={['dunia', 'dibikin', 'per', 'potongan']} lMulai={S[7].mulai} judul={[{ t: 'chunk', mulai: T.potong8, warna: OL.emas }, { t: '=', mulai: T.enam8 - 0.1, warna: OL.abu }, { t: '16×16', mulai: T.enam8 }, { t: 'blok', mulai: T.blok8 }]} jMulai={T.potong8} keluar={kj(8)} ukuran={88} />
      <ChipKecil x={70} y={340} o={maju(t, T.kamu8, T.kamu8 + 0.2) * (1 - maju(t, kj(8), kj(8) + 0.2))} teks="muncul pas kamu mendekat" />
      <TeksOL label={['jalan', 'kaki', 'biasa']} lMulai={S[8].mulai} judul={[{ t: '4,317', mulai: T.empat9 - 0.1, warna: OL.emas }, { t: 'blok/detik', mulai: T.empat9 + 0.5 }]} jMulai={T.empat9 - 0.1} keluar={kj(9)} ukuran={92} />
      <TeksOL label={['tengah', 'ke', 'world', 'border']} lMulai={S[9].mulai} judul={[{ t: '±80', mulai: T.delapan10, warna: OL.emas }, { t: 'hari', mulai: T.hari10 }, { t: 'nonstop', mulai: T.berhenti10 }]} jMulai={T.delapan10} keluar={kj(10)} ukuran={96} />
      <TeksOL label={['simpan', '&', 'follow']} lMulai={S[10].mulai} judul={[{ t: 'bahan', mulai: T.simpan + 0.9 }, { t: 'obrolan', mulai: T.simpan + 1.0 }, { t: 'mabar', mulai: T.simpan + 1.1, warna: OL.emas }]} jMulai={T.simpan + 0.9} keluar={T.ctaKeluar} ukuran={88} />
      {sumber ? <ChipKecil x={M.x} y={M.y + M.s + 26} o={oSumber} teks={sumber} /> : null}
    </>
  );
};

// ======================================================================================================
function daftarSfx(T: W): Sfx[] {
  const S = T.s;
  const pitaS1 = Array.from({ length: 7 }, (_, i) => bunyi('tik', T.pitaS1(i), 0.35 + i * 0.03));
  const pita6 = Array.from({ length: 6 }, (_, i) => bunyi('tik', T.pita6(i + 1) + 0.05, 0.35));
  const ubin = Array.from({ length: 12 }, (_, i) => bunyi('tik', T.peta7 + 0.4 + ((T.kali7 - T.peta7 - 0.4) * i) / 12, 0.18));
  const langkah = Array.from({ length: Math.floor(16 / KEC) + 1 }, (_, i) => bunyi('klik', T.jalan0 + i + 0.98, 0.3));
  return [
    bunyi('whooshTerang', 0.25, 0.35),
    bunyi('pop', 0.3, 0.4),
    bunyi('whooshLembut', 0.9, 0.35),
    ...pitaS1,
    bunyi('hantam', T.kali1 + 0.05, 0.45),
    bunyi('whooshA', S[1].mulai + 0.1, 0.3),
    bunyi('swish', T.world2, 0.35),
    bunyi('kunci', T.dinding + 0.1, 0.35),
    bunyi('riser', T.blok2 + 0.2, 0.18),
    bunyi('pop', T.titik2, 0.35),
    bunyi('pop', T.tiap2, 0.3),
    bunyi('swish', T.lebar3, 0.3),
    bunyi('tik', T.blok3 + 0.1, 0.4),
    bunyi('whooshPunch', T.selam0 + 0.2, 0.45),
    bunyi('pop', T.kubus - 0.05, 0.4),
    bunyi('swish', T.meter4 - 0.3, 0.3),
    bunyi('whooshTurun', T.selam1, 0.4),
    bunyi('pop', T.jadi4 + 0.3, 0.3),
    bunyi('sapuHit', T.enam4, 0.35),
    bunyi('kunci', S[4].mulai + 0.2, 0.3),
    bunyi('whooshLembut', T.luas5, 0.3),
    bunyi('tik', T.miliar5 + 0.3, 0.4),
    bunyi('whooshA', S[5].mulai + 0.1, 0.3),
    bunyi('glitch', T.laut6, 0.25),
    bunyi('whooshTerang', T.peel0, 0.35),
    bunyi('pop', T.peel1, 0.4),
    ...pita6,
    bunyi('hantam', T.pita6(6) + 0.1, 0.35),
    bunyi('whooshTurun', S[6].mulai + 0.15, 0.3),
    bunyi('swish', T.peta7 - 0.2, 0.3),
    ...ubin,
    bunyi('hantam', T.kali7 + 0.05, 0.45),
    bunyi('whooshBerat', T.kabut0 + 0.05, 0.35),
    bunyi('pop', T.sekaligus8, 0.35),
    bunyi('swish', T.potong8, 0.3),
    bunyi('kunci', T.chunk8, 0.4),
    bunyi('whooshPop', T.kamu8, 0.3),
    bunyi('whooshPunch', T.tembusJalan, 0.4),
    ...langkah,
    bunyi('jepret', T.jalan1, 0.3),
    bunyi('whooshTurun', T.naik10, 0.4),
    bunyi('riser', T.jejak0 + 0.4, 0.2),
    bunyi('tik', T.jejak1, 0.45),
    bunyi('hantam', T.berhenti10 + 0.05, 0.5),
    bunyi('whooshPop', T.simpan, 0.35),
    bunyi('pop', T.simpan + 0.35, 0.35),
    bunyi('whooshPop', T.follow, 0.35),
    bunyi('pop', T.follow + 0.35, 0.35),
    bunyi('whooshLembut', T.pulang, 0.35),
  ];
}

// ======================================================================================================
// SAMPUL 9:16 (terpisah, rumus 1 kalimat): "Peta Minecraft ±7× luas Bumi"
export const O1Sampul: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: OL.navy0, overflow: 'hidden', fontFamily: SAIRA, color: OL.putih }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% 46%, ${OL.navy1} 0%, ${OL.navy0} 75%)` }} />
      <div style={{ position: 'absolute', left: M.x, top: 640, width: M.s, height: M.s }}>
        <Img src={staticFile('o1/peta-voxel.png')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', imageRendering: 'pixelated' }} />
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: 0, top: i * PITA_H, width: M.s, height: PITA_H, border: `4px solid ${i === 6 ? OL.emas : AKSEN}`, background: `${i === 6 ? OL.emas : AKSEN}22`, boxSizing: 'border-box' }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', translate: '0 -50%', fontWeight: 800, fontSize: 44, color: i === 6 ? OL.emas : OL.putih, textShadow: '0 2px 10px #000' }}>{i + 1}</div>
          </div>
        ))}
        <div style={{ position: 'absolute', inset: -6, border: `8px solid ${AKSEN}`, borderRadius: 6, boxShadow: `0 0 40px ${AKSEN}88` }} />
      </div>
      <div style={{ position: 'absolute', left: 700, top: 1290, width: 230, height: 230, borderRadius: '50%', boxShadow: `0 0 50px ${AKSEN}aa`, border: `3px solid ${AKSEN}` }}>
        <BolaPiksel d={230} t={0.3} total={10} />
      </div>
      <div style={{ position: 'absolute', left: 740, top: 1528, fontFamily: MONO, fontWeight: 800, fontSize: 34, color: AKSEN }}>= 1 Bumi</div>
      <div style={{ position: 'absolute', left: 70, top: 190, fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: OL.lime }}>PETA MINECRAFT JAVA</div>
      <div style={{ position: 'absolute', left: 64, top: 250, fontWeight: 800, fontSize: 210, lineHeight: 0.95, color: OL.emas, textShadow: `0 0 40px ${OL.emas}66` }}>±7×</div>
      <div style={{ position: 'absolute', left: 70, top: 460, fontWeight: 800, fontSize: 104, lineHeight: 1, textShadow: '0 6px 18px #000' }}>luas Bumi</div>
      <div style={{ position: 'absolute', left: 74, top: 580, fontFamily: MONO, fontWeight: 600, fontSize: 28, color: OL.abuTerang }}>hitungan kami · Minecraft Wiki</div>
      <></>
      <GrainOL />
    </AbsoluteFill>
  );
};
