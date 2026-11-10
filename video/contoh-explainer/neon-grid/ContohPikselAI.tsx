// Frame hero (pembuka, tengah, puncak): 15, 856, 1427.
// contoh explainer generik O2 (konten contoh): "15 dari 16 piksel di layar kamu dibikin AI (DLSS 4, menurut NVIDIA)". 9:16, ±59 dtk.
// SERI generik (video/seri/seriOL.tsx), aksen O2 = MAGENTA (piksel/frame bikinan AI); EMAS = yang dihitung game.
// SATU DUNIA: frame game generik 32×18 piksel (synthwave, digambar sendiri, tanpa game/merek). Hook = kamera nempel di 4×4 piksel
// (1 game + 15 AI) → mundur jadi frame utuh (piksel → frame) → tanpa DLSS semua dihitung (scan emas) → dengan DLSS render kecil
// lalu AI ngisi (tiap 2×2: 1 emas + 3 magenta) → zoom 1 blok 2×2 (3/4) → frame jadi kartu di pita film (Multi Frame Generation,
// Jan 2025, VGA RTX 50 digambar generik) → +3 frame AI → 4 frame jadi 4 kuadran grid 4×4: 1/4 × 1/4 = 1/16 → FPS sampai 8× →
// UPDATE Maret 2026 DLSS 4.5: +5 frame AI (6X) → CTA → kamera balik nempel di 4×4 (loop).
// Fakta: NVIDIA GeForce News 6/1/2025 (DLSS 4, 15/16, MFG +3, RTX 50, sampai 8×), 20/9/2022 (3/4 diisi AI), 31/3/2026 (DLSS 4.5, 6X).
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  AngkaJalan, Bunyi, Dunia, EASE, GarisDigambar, hitungKamera, kata, maju, noise, pathLingkarTangan, pegas, SapuSorot, Stempel, useDetik,
  type KunciKamera, type Kata, type Sfx,
} from "../../src/gerak";
import { MONO, SAIRA } from "../../src/gerak/font";
import { bunyi, ChipAngka, ChipKecil, CtaOL, GrainOL, ScrimAtas, HudSeri, LatarOL, lerp, OL, generikReaksi, SubOL, TeksOL, type DataOL, type Kalimat } from "../../src/gerak/seri/neon-grid/seriOL";
import { GH, GW, PIKSEL } from "./o2/gambar";

const AI = OL.magenta;
const GAME = OL.emas;
const FR = { x: 92, y: 620, P: 28 }; // frame 32×18 @ 28 px = 896 × 504
const PATCH = { c: 14, r: 6 }; // 4×4 piksel hook (sekitar matahari)
const PC = { x: FR.x + (PATCH.c + 2) * FR.P, y: FR.y + (PATCH.r + 2) * FR.P }; // tengah patch
const BLOK = { c: 14, r: 8 }; // blok 2×2 yang di-zoom (S5)
const BC = { x: FR.x + (BLOK.c + 1) * FR.P, y: FR.y + (BLOK.r + 1) * FR.P };
const G4 = { x: 204, y: 560, c: 168 }; // grid 4×4 (S8), layar

const GABUNG = [
  { kata: ['dlss', 'empat', 'koma', 'lima'], jadi: 'DLSS 4.5' },
  { kata: ['dlss', 'empat'], jadi: 'DLSS 4' },
  { kata: ['lima', 'belas'], jadi: '15' },
  { kata: ['enam', 'belas'], jadi: '16' },
  { kata: ['dua', 'ribu', 'dua', 'puluh', 'lima'], jadi: '2025' },
  { kata: ['dua', 'ribu', 'dua', 'puluh', 'enam'], jadi: '2026' },
  { kata: ['lima', 'puluh'], jadi: '50' },
  { kata: ['tiga', 'perempat'], jadi: '3/4' },
  { kata: ['tiga', 'frame'], jadi: '3 frame' },
  { kata: ['lima', 'frame'], jadi: '5 frame' },
  { kata: ['empat', 'frame'], jadi: '4 frame' },
  { kata: ['delapan', 'kali'], jadi: '8 kali' },
];

// ======================================================================================================
function waktuO2(d: Kata[], total: number, kal: Kalimat[] = []) {
  const CAD: [number, number][] = [
    [0.12, 6.76], [7.14, 11.82], [12.22, 15.7], [16.06, 21.3], [21.82, 25.34], [25.74, 31.96], [32.4, 35.96], [36.34, 42.6], [43.0, 47.36],
    [47.78, 53.88], [54.24, 58.2],
  ];
  const s = CAD.map((c, i) => ({ mulai: kal[i]?.mulai ?? c[0], akhir: kal[i]?.akhir ?? c[1] }));
  const k = (c: string, setelah = 0, cad = 0) => kata(d, c, setelah, cad);
  const lima1 = k('lima', s[0].mulai, 3.16);
  const enam1 = k('enam', lima1, 4.08);
  const dibikin1 = k('dibikin', s[0].mulai, 5.82);
  const titik2 = k('titik', s[1].mulai, 7.8);
  const satu2 = k('satu', s[1].mulai, 9.88);
  const frame2 = k('frame', satu2, 11.48);
  const game3 = k('game', s[2].mulai, 13.52);
  const frame3 = k('frame', game3, 15.42);
  const render4 = k('render', s[3].mulai, 17.74);
  const resolusi4 = k('resolusi', render4, 18.26);
  const kecil4 = k('kecil', resolusi4, 18.96);
  const ai4 = k('ai', kecil4, 20.08);
  const sisanya4 = k('sisanya', ai4, 20.88);
  const tiga5 = k('tiga', s[4].mulai, 22.62);
  const diisi5 = k('diisi', tiga5, 24.46);
  const multi6 = k('multi', s[5].mulai, 26.22);
  const januari6 = k('januari', multi6, 28.24);
  const vga6 = k('vga', januari6, 30.42);
  const rtx6 = k('rtx', vga6, 31.02);
  const tiga7 = k('tiga', s[6].mulai, 33.64);
  const tambahan7 = k('tambahan', tiga7, 34.6);
  const asli7 = k('asli', tambahan7, 35.64);
  const empat8 = k('empat', s[7].mulai, 36.94);
  const satu8 = k('satu', empat8, 37.98);
  const seperempat8 = k('seperempat', satu8, 40.02);
  const satu8b = k('satu', seperempat8, 41.56);
  const enam8 = k('enam', satu8b, 42.06);
  const fps9 = k('fps', s[8].mulai, 43.96);
  const naik9 = k('naik', fps9, 46.04);
  const delapan9 = k('delapan', naik9, 46.66);
  const dlss10 = k('dlss', s[9].mulai, 49.3);
  const jadi10 = k('jadi', dlss10, 51.86);
  const lima10 = k('lima', jadi10, 52.12);
  const asli10 = k('asli', lima10, 53.58);
  const simpan = k('simpan', s[10].mulai, 54.24);
  const follow = k('follow', simpan, 56.44);
  return {
    total, s, lima1, enam1, dibikin1, titik2, satu2, frame2, game3, frame3, render4, resolusi4, kecil4, ai4, sisanya4, tiga5, diisi5, multi6,
    januari6, vga6, rtx6, tiga7, tambahan7, asli7, empat8, satu8, seperempat8, satu8b, enam8, fps9, naik9, delapan9, dlss10, jadi10, lima10,
    asli10, simpan, follow,
    // hook: 15 piksel jadi magenta satu-satu sampai "dibikin AI"
    flip0: 0.55,
    flip1: lima1 + 0.25,
    mundur: s[1].mulai, // kamera mundur ke frame utuh
    kosong3: s[2].mulai + 0.05, // frame dikosongin (tanpa DLSS)
    scan3: [game3 - 0.1, frame3 + 0.15] as [number, number],
    kosong4: s[3].mulai + 0.05,
    scan4: [render4 - 0.2, kecil4 + 0.2] as [number, number],
    melar4: ai4 - 0.25, // frame kecil melar ke ukuran penuh
    isiAI4: [ai4 + 0.15, sisanya4 + 0.45] as [number, number],
    keKartu: s[5].mulai, // frame jadi kartu pita film
    ctaKeluar: Math.max(follow + 0.9, total - 1.75),
    pulang: total - 1.45,
    loop: total,
  };
}
type W = ReturnType<typeof waktuO2>;

function kunciKamera(T: W): KunciKamera[] {
  const S = T.s;
  const pelan = Easing.inOut(Easing.sin);
  return [
    { t: 0, x: PC.x, y: PC.y, z: 6.0 },
    { t: 0.6, x: PC.x, y: PC.y + 2, z: 5.85, ease: pelan },
    { t: T.mundur - 0.05, x: PC.x, y: PC.y, z: 5.6, ease: pelan },
    { t: T.mundur + 1.0, x: 540, y: 960, z: 1.0 },
    { t: S[2].mulai, x: 540, y: 955, z: 1.03, ease: pelan },
    { t: S[3].mulai + 0.2, x: 540, y: 960, z: 1.0 },
    { t: S[4].mulai - 0.1, x: 540, y: 955, z: 1.03, ease: pelan },
    { t: S[4].mulai + 0.55, x: BC.x, y: BC.y, z: 4.8 },
    { t: S[5].mulai - 0.05, x: BC.x, y: BC.y + 3, z: 5.0, ease: pelan },
    { t: S[5].mulai + 0.55, x: 540, y: 960, z: 1.0 },
    { t: T.pulang, x: 540, y: 958, z: 1.02, ease: pelan },
    { t: T.loop, x: PC.x, y: PC.y, z: 6.0, ease: Easing.inOut(Easing.poly(4)) },
  ];
}

// ======================================================================================================
export const ContohPikselAI: React.FC<DataOL> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuO2(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const kunci = useMemo(() => kunciKamera(T), [T]);
  const kam = hitungKamera(kunci, t, fps, {
    drift: 2.2 * (1 - maju(t, T.pulang, T.loop)) * maju(t, 0, 0.6),
    getar: [
      { t: T.flip1 + 0.05, kuat: 5 },
      { t: T.scan3[1], kuat: 4 },
      { t: T.satu8b + 0.05, kuat: 7 },
      { t: T.delapan9 + 0.3, kuat: 6 },
      { t: S0(T) + 0.1, kuat: 7, lama: 0.16 },
    ],
  });
  const S = T.s;
  return (
    <AbsoluteFill style={{ background: OL.navy0, color: OL.putih, overflow: 'hidden', fontFamily: SAIRA }}>
      <LatarOL kam={kam} aksen={AI} />
      <Dunia kamera={kam} tinggiDunia={1920} lebarDunia={1080} blurGerak={null}>
        <Gambar T={T} />
      </Dunia>
      <Pita T={T} />
      <GridEmpat T={T} />
      <Fps T={T} />
      <Vga T={T} />
      <ScrimAtas />
      <Teks T={T} />
      <CtaOL simpan={T.simpan} follow={T.follow} keluar={T.ctaKeluar} y={720} />
      <></>
      <HudSeri kalimat={S} sampai={T.pulang} aksen={OL.lime} />
      <SubOL kata={d.kata} kalimat={d.kalimat} sampai={T.pulang + 0.2} gabung={GABUNG} />
      <GrainOL />
      <></>
    </AbsoluteFill>
  );
};
const S0 = (T: W) => T.s[9].mulai; // stempel UPDATE

// ======================================================================================================
// GAMBAR 32×18 (dunia). Tiap piksel: kapan muncul, warnanya (gambar / peran), dan tanda peran (emas = game, magenta = AI).
const lebihKecil = (c: number, r: number) => ({ x: 540 - 8 * FR.P + Math.floor(c / 2) * FR.P, y: 872 - 4.5 * FR.P + Math.floor(r / 2) * FR.P });
const diPatch = (c: number, r: number) => c >= PATCH.c && c < PATCH.c + 4 && r >= PATCH.r && r < PATCH.r + 4;

const Gambar: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const kartu = maju(t, T.keKartu, T.keKartu + 0.6, EASE.kamera);
  const pulang = t >= T.pulang - 0.2;
  if (kartu >= 1 && !pulang) return null;
  // S6: gambar mengecil jadi kartu pita (slot 1) — rect tujuan dalam koordinat layar = dunia (kamera z 1 di sini)
  const tujuan = SLOT_A;
  const kk = pulang ? 0 : kartu;
  const sx = lerp(1, tujuan.w / (GW * FR.P), kk);
  const tx = lerp(FR.x, tujuan.x, kk);
  const ty = lerp(FR.y, tujuan.y, kk);
  const sel: React.ReactNode[] = [];
  const P = FR.P;
  const gap = 1.2;
  const fase = pulang ? 'pulang' : t < S[2].mulai ? 'hook' : t < S[3].mulai ? 'tanpa' : 'dlss';
  for (let r = 0; r < GH; r++)
    for (let c = 0; c < GW; c++) {
      const warnaAsli = PIKSEL[r * GW + c];
      let x = FR.x + c * P;
      let y = FR.y + r * P;
      let o = 1;
      let warna = warnaAsli;
      let tanda: string | null = null;
      let kilat = 0;
      let kilatGame = false;
      const rendered = c % 2 === 0 && r % 2 === 0;
      if (fase === 'hook' || fase === 'pulang') {
        if (!diPatch(c, r)) {
          // piksel lain muncul beriak dari patch pas "titik warna penyusun gambar" (pas pulang: cuma patch, biar = frame pertama)
          const jarak = Math.hypot(c - (PATCH.c + 1.5), r - (PATCH.r + 1.5));
          o = fase === 'pulang' ? 0 : maju(t, T.titik2 - 0.2 + jarak * 0.035, T.titik2 + jarak * 0.035);
        } else if (fase === 'pulang') {
          o = maju(t, T.pulang - 0.15, T.pulang + 0.2);
        } else if (fase === 'hook') {
          // 1 piksel game (pojok kiri atas patch) + 15 AI: berubah warna peran satu-satu, balik ke warna gambar pas mundur
          const i = (r - PATCH.r) * 4 + (c - PATCH.c);
          const balik = maju(t, T.mundur + 0.2, T.mundur + 0.8);
          const jadi = i === 0 ? maju(t, 0.35, 0.55) : maju(t, T.flip0 + ((i - 1) / 14) * (T.flip1 - T.flip0), T.flip0 + ((i - 1) / 14) * (T.flip1 - T.flip0) + 0.12);
          const p = jadi * (1 - balik);
          tanda = p > 0.5 ? (i === 0 ? GAME : AI) : null;
          warna = p > 0.5 ? (i === 0 ? GAME : AI) : warnaAsli;
          // kilat cuma pas berubah jadi warna peran (bukan pas balik ke warna gambar)
          kilat = jadi > 0 && jadi < 1 ? 1 - jadi : 0;
          kilatGame = i === 0;
        }
      } else if (fase === 'tanpa') {
        // dikosongin, terus game ngitung SEMUA piksel baris demi baris
        const [a, b] = T.scan3;
        const tr = a + ((b - a) * (r * GW + c)) / (GW * GH);
        const isi = maju(t, tr, tr + 0.06);
        const kosong = maju(t, T.kosong3, T.kosong3 + 0.25);
        o = 1 - kosong * (1 - isi);
        kilat = t > tr && t < tr + 0.22 ? 1 - (t - tr) / 0.22 : 0;
      } else {
        // DLSS: render kecil (1 dari tiap 2×2), melar ke posisi penuh, AI ngisi 3 sisanya
        const kosong = maju(t, T.kosong4, T.kosong4 + 0.25);
        const melar = maju(t, T.melar4, T.melar4 + 0.45, EASE.kamera);
        if (rendered) {
          const [a, b] = T.scan4;
          const bi = Math.floor(r / 2) * 16 + Math.floor(c / 2);
          const tr = a + ((b - a) * bi) / 144;
          const isi = maju(t, tr, tr + 0.06);
          o = 1 - kosong * (1 - isi);
          kilat = t > tr && t < tr + 0.22 ? 1 - (t - tr) / 0.22 : 0;
          const kk = lebihKecil(c, r);
          x = lerp(kk.x, x, kosong >= 1 ? melar : 1);
          y = lerp(kk.y, y, kosong >= 1 ? melar : 1);
          tanda = t > T.kosong4 + 0.2 ? GAME : null;
        } else {
          const [a, b] = T.isiAI4;
          const urut = ((c * 7 + r * 13) % 29) / 29;
          const ta = a + (b - a) * urut;
          const isi = maju(t, ta, ta + 0.1);
          o = 1 - kosong * (1 - isi);
          kilat = t > ta && t < ta + 0.25 ? 1 - (t - ta) / 0.25 : 0;
          tanda = isi > 0 && kosong >= 1 ? AI : null;
          if (kilat > 0) warna = AI;
        }
      }
      if (o <= 0.002) continue;
      const tandaO = fase === 'dlss' ? 1 - kartu : 1;
      sel.push(
        <g key={`${c}-${r}`} opacity={o}>
          <rect x={x + gap / 2} y={y + gap / 2} width={P - gap} height={P - gap} rx={2} fill={warna} />
          {tanda && fase === 'dlss' ? <rect x={x + 2} y={y + 2} width={P - 4} height={P - 4} rx={2} fill={tanda === AI ? AI : 'none'} fillOpacity={0.22 * tandaO} stroke={tanda} strokeOpacity={0.9 * tandaO} strokeWidth={2} /> : null}
          {kilat > 0 ? <rect x={x} y={y} width={P} height={P} rx={2} fill={fase === 'tanpa' || (fase === 'dlss' && rendered) || kilatGame ? GAME : AI} opacity={kilat * 0.8} /> : null}
        </g>,
      );
    }
  // label "AI"/"game" di patch hook (teks kecil di dunia, kamera z 6 → kebaca besar)
  const labelPatch =
    fase === 'hook'
      ? Array.from({ length: 16 }, (_, i) => {
          const c = PATCH.c + (i % 4);
          const r = PATCH.r + Math.floor(i / 4);
          const jadi = i === 0 ? maju(t, 0.4, 0.6) : maju(t, T.flip0 + ((i - 1) / 14) * (T.flip1 - T.flip0) + 0.05, T.flip0 + ((i - 1) / 14) * (T.flip1 - T.flip0) + 0.2);
          const o = jadi * (1 - maju(t, T.mundur + 0.1, T.mundur + 0.4));
          if (o <= 0) return null;
          return (
            <text key={i} x={FR.x + c * P + P / 2} y={FR.y + r * P + P / 2 + (i === 0 ? 2.2 : 2.6)} textAnchor="middle" fontFamily={i === 0 ? MONO : SAIRA} fontWeight={800} fontSize={i === 0 ? 6.2 : 8} fill={i === 0 ? OL.navy0 : OL.putih} opacity={o}>
              {i === 0 ? 'game' : 'AI'}
            </text>
          );
        })
      : null;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: `${FR.x}px ${FR.y}px`, transform: `translate(${tx - FR.x}px, ${ty - FR.y}px) scale(${sx})` }}>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        {sel}
        {labelPatch}
        {/* S2: lingkaran tangan di 1 piksel + kurung "frame" */}
        {fase === 'hook' && t > T.titik2 - 0.1 ? (
          <>
            <GarisDigambar d={pathLingkarTangan(FR.x + 24.5 * P, FR.y + 3.5 * P, 34, 30, 'px1')} mulai={T.titik2} lama={0.3} warna={OL.emas} tebal={5} hapus={T.satu2} />
            <GarisDigambar
              d={`M ${FR.x - 14} ${FR.y + 60} L ${FR.x - 14} ${FR.y - 14} L ${FR.x + GW * P + 14} ${FR.y - 14} L ${FR.x + GW * P + 14} ${FR.y + GH * P + 14} L ${FR.x - 14} ${FR.y + GH * P + 14} L ${FR.x - 14} ${FR.y + 60}`}
              mulai={T.satu2 + 0.1}
              lama={0.55}
              warna={OL.lime}
              tebal={6}
              hapus={S[2].mulai - 0.1}
            />
          </>
        ) : null}
        {/* S4: garis putus ukuran layar penuh pas game render kecil */}
        {fase === 'dlss' && t > T.kosong4 + 0.2 && t < T.melar4 + 0.6 ? (
          <rect x={FR.x - 6} y={FR.y - 6} width={GW * P + 12} height={GH * P + 12} rx={8} fill="none" stroke={OL.abuTerang} strokeWidth={3} strokeDasharray="14 10" opacity={maju(t, T.kosong4 + 0.2, T.kosong4 + 0.4) * (1 - maju(t, T.melar4 + 0.3, T.melar4 + 0.6))} />
        ) : null}
        {/* S5: label game/AI di blok 2×2 (kebaca gede pas kamera z 4,8) */}
        {fase === 'dlss' && t > S[4].mulai && t < S[5].mulai + 0.3
          ? [0, 1, 2, 3].map((i) => {
              const c = BLOK.c + (i % 2);
              const r = BLOK.r + Math.floor(i / 2);
              const o = maju(t, S[4].mulai + 0.4 + i * 0.12, S[4].mulai + 0.55 + i * 0.12) * (1 - maju(t, S[5].mulai - 0.1, S[5].mulai + 0.1));
              return (
                <text key={i} x={FR.x + c * P + P / 2} y={FR.y + r * P + P / 2 + 2.6} textAnchor="middle" fontFamily={i === 0 ? MONO : SAIRA} fontWeight={800} fontSize={i === 0 ? 6.4 : 8.5} fill={OL.putih} stroke={OL.navy0} strokeWidth={1.4} paintOrder="stroke" opacity={o}>
                  {i === 0 ? 'game' : 'AI'}
                </text>
              );
            })
          : null}
        {/* S5: kotak blok 2×2 yang di-zoom */}
        {fase === 'dlss' && t > S[4].mulai - 0.2 && t < S[5].mulai + 0.3 ? (
          <GarisDigambar d={`M ${BC.x - P} ${BC.y - P} L ${BC.x + P} ${BC.y - P} L ${BC.x + P} ${BC.y + P} L ${BC.x - P} ${BC.y + P} Z`} mulai={S[4].mulai + 0.3} lama={0.3} warna={OL.putih} tebal={1.6} hapus={S[5].mulai} />
        ) : null}
      </svg>
      {/* S2 chip piksel & frame (dunia, z 1) */}
      {fase === 'hook' && t > T.titik2 && t < S[2].mulai ? (
        <>
          <ChipAngka x={FR.x + 24.5 * P} y={FR.y + 3.5 * P - 64} o={maju(t, T.titik2 + 0.1, T.titik2 + 0.3) * (1 - maju(t, T.satu2, T.satu2 + 0.2))} ukuran={34} isi="1 piksel" />
          <ChipAngka x={540} y={FR.y + GH * P + 14} o={maju(t, T.frame2 - 0.1, T.frame2 + 0.1) * (1 - maju(t, S[2].mulai - 0.2, S[2].mulai))} ukuran={38} warna={OL.lime} isi="1 frame (ilustrasi: 32 × 18 piksel)" />
        </>
      ) : null}
    </div>
  );
};

// ======================================================================================================
// PITA FILM (layar): S6 kartu asli, S7 +3 AI, S8 jadi kuadran, S10 +5 AI (update DLSS 4.5)
const SLOT_A = { x: 82, y: 720, w: 220, h: 124 }; // slot 1 (S6–S8)
const slotB = (i: number) => ({ x: 82 + i * 232, y: 720, w: 220, h: 124 });
const slotE = (i: number) => ({ x: 82 + i * 156, y: 760, w: 142, h: 80 });
const kuadran = (i: number) => ({ x: G4.x + (i % 2) * G4.c * 2, y: G4.y + Math.floor(i / 2) * G4.c * 2, w: G4.c * 2, h: G4.c * 2 });

const Kartu: React.FC<{ x: number; y: number; w: number; h: number; ai: boolean; nomor: number; o?: number; label?: boolean; redup?: number }> = ({ x, y, w, h, ai, nomor, o = 1, label = true, redup = 0 }) => {
  const t = useDetik();
  return o <= 0 ? null : (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, opacity: o }}>
      <Img src={staticFile(`o2/frame-${(nomor + Math.floor(t * 3)) % 6}.png`)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', imageRendering: 'pixelated', borderRadius: 6 }} />
      {ai ? <div style={{ position: 'absolute', inset: 0, borderRadius: 6, background: AI, opacity: 0.28 }} /> : null}
      {redup > 0 ? <div style={{ position: 'absolute', inset: 0, borderRadius: 6, background: OL.navy0, opacity: redup }} /> : null}
      <div style={{ position: 'absolute', inset: -4, borderRadius: 9, border: `4px solid ${ai ? AI : GAME}`, boxShadow: `0 0 16px ${ai ? AI : GAME}66` }} />
      {label ? (
        <div style={{ position: 'absolute', left: '50%', top: h + 12, translate: '-50% 0', padding: '2px 10px', borderRadius: 8, background: ai ? AI : GAME, color: OL.navy0, fontFamily: MONO, fontWeight: 800, fontSize: Math.max(18, Math.min(24, w / 8)), whiteSpace: 'nowrap' }}>{ai ? 'AI' : 'asli'}</div>
      ) : null}
    </div>
  );
};

const Pita: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < T.keKartu + 0.5 || t > S[10].mulai + 0.4) return null;
  const rel = maju(t, T.keKartu + 0.3, T.keKartu + 0.8, EASE.kamera);
  const geserRel = (t * 40) % 40;
  const keKuadran = maju(t, T.seperempat8 - 0.2, T.seperempat8 + 0.35, EASE.kamera);
  const pitaB = t < S[8].mulai;
  const pitaE = t >= S[9].mulai;
  const out: React.ReactNode[] = [];
  // rel pita (garis lubang film)
  const relO = rel * (1 - maju(t, T.seperempat8 - 0.3, T.seperempat8)) + maju(t, S[9].mulai, S[9].mulai + 0.3) * (1 - maju(t, S[10].mulai - 0.1, S[10].mulai + 0.25));
  const habis = 1 - maju(t, S[10].mulai - 0.1, S[10].mulai + 0.25, EASE.keluar);
  const yRel = pitaE ? 760 : 720;
  const hRel = pitaE ? 80 : 124;
  out.push(
    <div key="rel" style={{ position: 'absolute', left: 40, top: yRel - 30, width: 1000, height: hRel + 60, opacity: relO * 0.9, borderTop: `3px solid ${OL.garis}`, borderBottom: `3px solid ${OL.garis}`, backgroundImage: `radial-gradient(circle, ${OL.garis} 5px, transparent 6px)`, backgroundSize: '40px 15px', backgroundRepeat: 'repeat-x', backgroundPosition: `${-geserRel}px 6px` }} />,
  );
  if (pitaB) {
    // asli (slot 0) + 3 AI masuk satu-satu (S7) + asli berikutnya ngintip
    out.push(<Kartu key="a0" {...(keKuadran > 0 ? lerpRect(slotB(0), kuadran(0), keKuadran) : slotB(0))} ai={false} nomor={0} o={maju(t, T.keKartu + 0.55, T.keKartu + 0.6) * (1 - maju(t, T.seperempat8 + 0.25, T.seperempat8 + 0.45))} label={keKuadran < 0.3} redup={redupS8(t, T, 0)} />);
    // S6: 3 slot kosong (garis putus) nunggu frame AI
    for (let i = 1; i <= 3; i++) {
      const o = maju(t, T.multi6 + i * 0.12, T.multi6 + 0.25 + i * 0.12) * (1 - maju(t, T.tiga7 - 0.15 + (i - 1) * 0.28, T.tiga7 + 0.1 + (i - 1) * 0.28));
      if (o > 0) out.push(<div key={`k${i}`} style={{ position: 'absolute', left: slotB(i).x, top: slotB(i).y, width: 220, height: 124, borderRadius: 8, border: `4px dashed ${AI}`, opacity: o * 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SAIRA, fontWeight: 800, fontSize: 54, color: AI }}>?</div>);
    }
    for (let i = 1; i <= 3; i++) {
      const m = maju(t, T.tiga7 - 0.15 + (i - 1) * 0.28, T.tiga7 + 0.15 + (i - 1) * 0.28, EASE.masuk);
      if (m <= 0) continue;
      const dari = { ...slotB(i), x: slotB(i).x + 260, y: slotB(i).y - 160 };
      const r0 = lerpRect(dari, slotB(i), m);
      out.push(<Kartu key={`ai${i}`} {...(keKuadran > 0 ? lerpRect(slotB(i), kuadran(i), keKuadran) : r0)} ai nomor={i} o={m * (1 - maju(t, T.seperempat8 + 0.25, T.seperempat8 + 0.45))} label={keKuadran < 0.3} redup={redupS8(t, T, i)} />);
    }
    const intip = maju(t, T.asli7 - 0.1, T.asli7 + 0.25) * (1 - maju(t, S[7].mulai, S[7].mulai + 0.25));
    if (intip > 0) out.push(<Kartu key="a1" x={slotB(4).x} y={720} w={220} h={124} ai={false} nomor={4} o={intip} />);
  }
  if (pitaE) {
    const st = S[9].mulai;
    out.push(<Kartu key="e0" {...slotE(0)} ai={false} nomor={0} o={maju(t, st + 0.1, st + 0.35) * habis} />);
    for (let i = 1; i <= 5; i++) {
      const m = maju(t, T.jadi10 - 0.1 + (i - 1) * 0.16, T.jadi10 + 0.18 + (i - 1) * 0.16, EASE.masuk);
      if (m <= 0) continue;
      const r0 = lerpRect({ ...slotE(i), y: slotE(i).y - 140 }, slotE(i), m);
      out.push(<Kartu key={`e${i}`} {...r0} ai nomor={i} o={m * habis} />);
    }
    // 4X lama (pudar, dicoret) → 6X
    const n = Math.min(5, Math.max(0, Math.floor((t - T.jadi10 + 0.1) / 0.16) + 1));
    if (t > T.jadi10 - 0.1) out.push(<ChipAngka key="cx" x={540} y={1000} o={maju(t, T.jadi10, T.jadi10 + 0.2) * habis} ukuran={52} warna={AI} isi={<>1 asli + {n} AI = {n + 1}X</>} />);
  }
  return <>{out}</>;
};
const lerpRect = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }, p: number) => ({ x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), w: lerp(a.w, b.w, p), h: lerp(a.h, b.h, p) });
// S8: "cuma satu yang di-render game" → kartu AI diredupin dikit, kartu asli disorot
const redupS8 = (t: number, T: W, i: number) => (i === 0 ? 0 : 0.35 * maju(t, T.satu8, T.satu8 + 0.2) * (1 - maju(t, T.seperempat8 - 0.2, T.seperempat8)));

// GRID 4×4 (S8): kuadran = frame, sel = piksel. 1 emas (game), 15 magenta (AI).
const GridEmpat: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const m = maju(t, T.seperempat8 + 0.15, T.seperempat8 + 0.5);
  if (m <= 0 || t > S[8].mulai + 0.8) return null;
  const pergi = maju(t, S[8].mulai - 0.1, S[8].mulai + 0.45, EASE.keluar);
  const denyut = pegas(t, T.satu8b, fps, { damping: 7, stiffness: 220, mass: 0.5 });
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - pergi, scale: String(1 - pergi * 0.2), transformOrigin: '540px 900px' }}>
      {Array.from({ length: 16 }, (_, i) => {
        const c = i % 4;
        const r = Math.floor(i / 4);
        const game = i === 0;
        const kq = Math.floor(c / 2) + 2 * Math.floor(r / 2);
        const tunda = kq * 0.06 + ((c % 2) + 2 * (r % 2)) * 0.03;
        const p = maju(t, T.seperempat8 + 0.15 + tunda, T.seperempat8 + 0.35 + tunda);
        return (
          <div key={i} style={{ position: 'absolute', left: G4.x + c * G4.c + 4, top: G4.y + r * G4.c + 4, width: G4.c - 8, height: G4.c - 8, borderRadius: 10, background: game ? GAME : AI, opacity: p * (game ? 1 : 0.88), scale: String((0.7 + 0.3 * p) * (game ? 1 + 0.18 * Math.sin(Math.PI * Math.min(1, denyut)) : 1)), boxShadow: game ? `0 0 ${20 + 30 * denyut}px ${GAME}` : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: game ? MONO : SAIRA, fontWeight: 800, fontSize: game ? 38 : 50, color: game ? OL.navy0 : OL.putih }}>
            {game ? 'game' : 'AI'}
          </div>
        );
      })}
      {/* garis kuadran (= 4 frame) */}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d={`M ${G4.x + 2 * G4.c} ${G4.y - 20} L ${G4.x + 2 * G4.c} ${G4.y + 4 * G4.c + 20}`} mulai={T.seperempat8 + 0.3} lama={0.3} warna={OL.lime} tebal={6} />
        <GarisDigambar d={`M ${G4.x - 20} ${G4.y + 2 * G4.c} L ${G4.x + 4 * G4.c + 20} ${G4.y + 2 * G4.c}`} mulai={T.seperempat8 + 0.38} lama={0.3} warna={OL.lime} tebal={6} />
      </svg>
      {['frame 1 (asli)', 'frame 2 (AI)', 'frame 3 (AI)', 'frame 4 (AI)'].map((s, i) => (
        <div key={i} style={{ position: 'absolute', left: G4.x + (i % 2) * 2 * G4.c + G4.c, top: G4.y + Math.floor(i / 2) * 2 * G4.c + (i < 2 ? -40 : 2 * G4.c + 8), translate: '-50% 0', fontFamily: MONO, fontWeight: 700, fontSize: 24, color: i === 0 ? GAME : AI, opacity: m * maju(t, T.seperempat8 + 0.5, T.seperempat8 + 0.7), whiteSpace: 'nowrap' }}>{s}</div>
      ))}
    </div>
  );
};

// FPS (S9): bar 1× vs bar yang numbuh sampai 8× (menurut NVIDIA), angka diikat ke tinggi bar
const Fps: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[8].mulai || t > S[9].mulai + 0.5) return null;
  const m = maju(t, S[8].mulai + 0.2, S[8].mulai + 0.5);
  const pergi = maju(t, S[9].mulai - 0.1, S[9].mulai + 0.35, EASE.keluar);
  const p = maju(t, T.naik9 - 0.1, T.delapan9 + 0.45, EASE.kamera);
  const U = 74;
  const dasar = 1240;
  const n = 1 + 7 * p;
  const bar = (x: number, unit: number, warna: string, label: string, o: number) => (
    <div style={{ position: 'absolute', left: x, top: dasar - unit * U, width: 220, height: unit * U, opacity: o }}>
      {Array.from({ length: Math.ceil(unit) }, (_, i) => {
        const h = Math.min(1, unit - i);
        return <div key={i} style={{ position: 'absolute', left: 0, bottom: i * U, width: 220, height: U * h - 6, borderRadius: 8, background: warna, opacity: 0.85 }} />;
      })}
      <div style={{ position: 'absolute', left: 110, top: unit * U + 16, translate: '-50% 0', fontFamily: MONO, fontWeight: 700, fontSize: 26, color: OL.abuTerang, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  );
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: m * (1 - pergi) }}>
      <div style={{ position: 'absolute', left: 120, top: dasar, width: 840, height: 4, background: OL.garis }} />
      {bar(230, 1, GAME, 'tanpa DLSS', 1)}
      {bar(630, n, AI, 'DLSS 4 + MFG', 1)}
      <ChipAngka x={740} y={dasar - n * U - 50} o={maju(t, T.naik9 - 0.1, T.naik9 + 0.1)} ukuran={58} warna={AI} isi={<>sampai <AngkaJalan dari={1} ke={8} progress={p} belakang="×" /></>} />
      <ChipAngka x={340} y={dasar - U - 50} ukuran={44} warna={GAME} isi="1×" />
      <div style={{ position: 'absolute', left: 540, top: 548, translate: '-50% 0', fontFamily: MONO, fontWeight: 600, fontSize: 26, color: OL.abuTerang, whiteSpace: 'nowrap' }}>FPS = jumlah frame per detik</div>
    </div>
  );
};

// VGA generik (S6): kartu grafis digambar sendiri, kipas muter, tulisan seri doang (tanpa logo)
const Vga: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < T.vga6 - 0.4 || t > S[6].mulai + 0.4) return null;
  const m = maju(t, T.vga6 - 0.3, T.vga6 + 0.05, EASE.masuk);
  const pergi = maju(t, S[6].mulai - 0.15, S[6].mulai + 0.25, EASE.keluar);
  const x = 230;
  const y = 980 + (1 - m) * 80;
  const putar = t * 900;
  const kipas = (cx: number) => (
    <g transform={`translate(${cx} 100)`}>
      <circle r={76} fill="#0a0e1c" stroke={OL.garis} strokeWidth={5} />
      <g transform={`rotate(${putar})`}>
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d="M 0 0 Q 30 -30 10 -68 Q -6 -40 0 0 Z" fill="#3a4677" transform={`rotate(${(i * 360) / 7})`} />
        ))}
      </g>
      <circle r={18} fill={OL.permukaan} stroke={OL.garis} strokeWidth={3} />
    </g>
  );
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 620, height: 230, opacity: m * (1 - pergi) }}>
      <svg width={620} height={250} style={{ overflow: 'visible' }}>
        <rect x={0} y={10} width={620} height={180} rx={22} fill={OL.permukaan} stroke={OL.garis} strokeWidth={4} />
        {kipas(170)}
        {kipas(450)}
        <rect x={120} y={190} width={300} height={24} fill={OL.emas} opacity={0.75} />
        {Array.from({ length: 22 }, (_, i) => (
          <rect key={i} x={124 + i * 13.5} y={194} width={7} height={18} fill={OL.navy0} opacity={0.5} />
        ))}
        <rect x={0} y={10} width={620} height={180} rx={22} fill="none" stroke={AI} strokeWidth={3} opacity={0.5 + 0.3 * Math.sin(t * 4)} />
      </svg>
      <ChipAngka x={310} y={-26} ukuran={40} warna={OL.lime} o={maju(t, T.rtx6 - 0.1, T.rtx6 + 0.1)} isi="VGA RTX 50" />
    </div>
  );
};

// ======================================================================================================
const Teks: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const kj = (n: number) => S[n].mulai - 0.22;
  const nAI = Math.round(14 * maju(t, T.flip0, T.flip1, EASE.linear)) + (t > T.flip0 + 0.05 ? 1 : 0);
  const sumber = (() => {
    if (t < 1.4) return null;
    if (t < S[2].mulai) return 'Sumber: NVIDIA GeForce News (6/1/2025)';
    if (t < S[5].mulai) return 'ilustrasi · Sumber: NVIDIA (DLSS 3, DLSS Super Resolution)';
    if (t < S[7].mulai) return 'Sumber: NVIDIA GeForce News (6/1/2025)';
    if (t < S[8].mulai) return 'hitungan kami: 1/4 frame × 1/4 piksel = 1/16';
    if (t < S[9].mulai) return 'Sumber: NVIDIA GeForce News (6/1/2025)';
    if (t < S[10].mulai) return 'Sumber: NVIDIA GeForce News (31/3/2026)';
    return null;
  })();
  const ySumber = 1330;
  const oSumber = maju(t, 1.4, 1.7) * (1 - maju(t, S[10].mulai - 0.2, S[10].mulai)) * (t > S[4].mulai && t < S[5].mulai + 0.3 ? 0 : 1);
  return (
    <>
      <TeksOL label={['DLSS', '4', '·', 'menurut', 'NVIDIA']} lMulai={0.12} judul={[{ t: '15', mulai: 0.25, warna: AI }, { t: 'dari', mulai: 0.3 }, { t: '16', mulai: 0.35, warna: OL.emas }, { t: 'piksel', mulai: 0.42 }]} jMulai={0.25} keluar={kj(1)} ukuran={100} />
      <ChipKecil x={70} y={336} o={maju(t, 0.6, 0.8) * (1 - maju(t, kj(1), kj(1) + 0.2))} warna={AI} teks={<>dibikin AI: <span style={{ color: OL.putih }}>{Math.min(15, nAI)}</span>/16 · game: 1/16</>} />
      <TeksOL label={['istilah']} lMulai={S[1].mulai} judul={[{ t: 'piksel', mulai: T.titik2 - 0.3, isi: <SapuSorot mulai={T.titik2} warna={OL.emas} warnaTeks={[OL.putih, OL.navy0]} penuh>piksel</SapuSorot> }, { t: '→', mulai: T.satu2, warna: OL.abu }, { t: 'frame', mulai: T.frame2 - 0.3, isi: <SapuSorot mulai={T.frame2} warna={OL.lime} warnaTeks={[OL.putih, OL.navy0]} penuh>frame</SapuSorot> }]} jMulai={T.titik2 - 0.3} keluar={kj(2)} />
      <TeksOL label={['tanpa', 'DLSS']} lMulai={S[2].mulai} judul={[{ t: 'semua', mulai: T.game3 }, { t: 'dihitung', mulai: T.game3 + 0.4, warna: OL.emas }]} jMulai={T.game3} keluar={kj(3)} />
      <ChipKecil
        x={70}
        y={336}
        o={maju(t, T.scan3[0], T.scan3[0] + 0.2) * (1 - maju(t, kj(3), kj(3) + 0.2))}
        warna={OL.emas}
        teks={<>dihitung game: <AngkaJalan dari={0} ke={576} progress={maju(t, T.scan3[0], T.scan3[1], EASE.linear)} /> / 576 piksel</>}
      />
      <TeksOL label={['dengan', 'DLSS']} lMulai={S[3].mulai} judul={[{ t: 'resolusi', mulai: T.resolusi4 }, { t: 'kecil', mulai: T.kecil4, warna: OL.emas }, { t: '+', mulai: T.ai4, warna: OL.abu }, { t: 'AI', mulai: T.ai4 + 0.05, warna: AI }]} jMulai={T.resolusi4} keluar={kj(4)} />
      <ChipKecil x={70} y={336} o={maju(t, T.ai4, T.ai4 + 0.2) * (1 - maju(t, kj(4), kj(4) + 0.2))} warna={AI} teks="AI ngisi sisanya" />
      <TeksOL
        label={['menurut', 'NVIDIA']}
        lMulai={S[4].mulai}
        judul={[{ t: '3/4', mulai: T.tiga5, warna: AI }, { t: 'piksel', mulai: T.tiga5 + 0.4 }, { t: '=', mulai: T.diisi5 - 0.1, warna: OL.abu }, { t: 'AI', mulai: T.diisi5, warna: AI }]}
        jMulai={T.tiga5}
        keluar={kj(5)}
      />
      <TeksOL label={['januari', '2025', '·', 'RTX', '50']} lMulai={T.januari6} judul={[{ t: 'Multi', mulai: T.multi6 }, { t: 'Frame', mulai: T.multi6 + 0.25 }, { t: 'Generation', mulai: T.multi6 + 0.5, warna: AI }]} jMulai={T.multi6} keluar={kj(6)} ukuran={84} />
      <TeksOL label={['per', 'frame', 'asli']} lMulai={S[6].mulai} judul={[{ t: '+', mulai: T.tiga7, warna: AI }, { t: '3', mulai: T.tiga7, isi: <AngkaJalan dari={0} ke={3} progress={maju(t, T.tiga7 - 0.15, T.tiga7 + 0.71, EASE.linear)} lantai gaya={{ color: AI }} /> }, { t: 'frame', mulai: T.tiga7 + 0.3 }, { t: 'AI', mulai: T.tiga7 + 0.45, warna: AI }]} jMulai={T.tiga7} keluar={kj(7)} />
      <TeksOL
        label={['jadi']}
        lMulai={S[7].mulai}
        judul={[
          { t: '1/4', mulai: T.satu8, warna: OL.emas },
          { t: '×', mulai: T.seperempat8, warna: OL.abu },
          { t: '1/4', mulai: T.seperempat8 + 0.1, warna: OL.emas },
          { t: '=', mulai: T.satu8b, warna: OL.abu },
          { t: '1/16', mulai: T.satu8b, isi: <SapuSorot mulai={T.satu8b + 0.1} warna={OL.emas} warnaTeks={[OL.emas, OL.navy0]} penuh>1/16</SapuSorot> },
        ]}
        jMulai={T.satu8}
        keluar={kj(8)}
      />
      <ChipKecil x={70} y={336} o={maju(t, T.satu8 + 0.1, T.satu8 + 0.3) * (1 - maju(t, T.seperempat8 - 0.2, T.seperempat8))} warna={OL.emas} teks="1 dari 4 frame di-render game" />
      <ChipKecil x={70} y={336} o={maju(t, T.seperempat8 + 0.2, T.seperempat8 + 0.4) * (1 - maju(t, kj(8), kj(8) + 0.2))} warna={OL.emas} teks="× cuma 1/4 pikselnya = 1 dari 16" />
      <TeksOL label={['menurut', 'NVIDIA']} lMulai={S[8].mulai} judul={[{ t: 'FPS', mulai: T.fps9 }, { t: 'sampai', mulai: T.naik9 }, { t: '8×', mulai: T.delapan9, warna: AI }]} jMulai={T.fps9} keluar={kj(9)} />
      <TeksOL label={['update', '·', 'maret', '2026']} lMulai={S[9].mulai + 0.1} judul={[{ t: 'DLSS', mulai: T.dlss10 }, { t: '4.5:', mulai: T.dlss10 + 0.4, warna: OL.emas }, { t: '5', mulai: T.lima10, warna: AI }, { t: 'frame', mulai: T.lima10 + 0.2 }, { t: 'AI', mulai: T.lima10 + 0.35, warna: AI }]} jMulai={T.dlss10} keluar={kj(10)} ukuran={86} />
      {/* stempel UPDATE */}
      <Stempel mulai={S[9].mulai + 0.05} rot={-8} keluar={kj(10)} gaya={{ position: 'absolute', left: 640, top: 560 }}>
        <div style={{ padding: '6px 22px', borderRadius: 12, border: `5px solid ${OL.lime}`, color: OL.lime, fontFamily: SAIRA, fontWeight: 800, fontSize: 64, background: `${OL.navy0}dd`, letterSpacing: '0.06em' }}>UPDATE</div>
      </Stempel>
      <TeksOL label={['simpan', '&', 'follow']} lMulai={S[10].mulai} judul={[{ t: 'buat', mulai: T.simpan + 0.5 }, { t: 'ngatur', mulai: T.simpan + 0.6 }, { t: 'DLSS', mulai: T.simpan + 0.7, warna: OL.emas }]} jMulai={T.simpan + 0.5} keluar={T.ctaKeluar} ukuran={92} />
      {sumber ? <ChipKecil x={FR.x} y={ySumber} o={oSumber} teks={sumber} /> : null}
      {/* legenda warna (S1–S5) */}
      {t > 1.0 && t < S[5].mulai + 0.3 ? (
        <div style={{ position: 'absolute', left: FR.x, top: 548, display: 'flex', gap: 26, fontFamily: MONO, fontWeight: 700, fontSize: 26, opacity: maju(t, 1.0, 1.3) * (1 - maju(t, S[5].mulai - 0.2, S[5].mulai + 0.1)) * (t > S[1].mulai && t < S[2].mulai ? 0.0 : 1) }}>
          <span style={{ color: GAME, display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ width: 22, height: 22, borderRadius: 4, background: GAME }} />dihitung game</span>
          <span style={{ color: AI, display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ width: 22, height: 22, borderRadius: 4, background: AI }} />dibikin AI</span>
        </div>
      ) : null}
      {/* S5: diagram 3/4 (cincin), diikat ke 3 sel AI */}
      {t > S[4].mulai && t < S[5].mulai + 0.3 ? <Cincin34 T={T} /> : null}
    </>
  );
};
const Cincin34: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const p = maju(t, T.tiga5 - 0.1, T.diisi5, EASE.kamera);
  const o = maju(t, S[4].mulai + 0.4, S[4].mulai + 0.7) * (1 - maju(t, S[5].mulai - 0.15, S[5].mulai + 0.15));
  const R = 90;
  const L = 2 * Math.PI * R;
  return (
    <div style={{ position: 'absolute', left: 790, top: 1120, width: 0, height: 0, opacity: o }}>
      <svg style={{ position: 'absolute', left: -120, top: -120, overflow: 'visible' }} width={240} height={240}>
        <circle cx={120} cy={120} r={R} fill={OL.navy0} stroke={OL.garis} strokeWidth={30} />
        <circle cx={120} cy={120} r={R} fill="none" stroke={GAME} strokeWidth={30} strokeDasharray={`${L * 0.25} ${L}`} transform="rotate(-90 120 120)" />
        <circle cx={120} cy={120} r={R} fill="none" stroke={AI} strokeWidth={30} strokeDasharray={`${L * 0.75 * p} ${L}`} transform="rotate(0 120 120)" />
        <text x={120} y={136} textAnchor="middle" fontFamily={SAIRA} fontWeight={800} fontSize={52} fill={OL.putih}>
          {Math.round(75 * p)}%
        </text>
      </svg>
    </div>
  );
};

// ======================================================================================================
function daftarSfx(T: W): Sfx[] {
  const S = T.s;
  const flip = Array.from({ length: 8 }, (_, i) => bunyi('tik', T.flip0 + ((T.flip1 - T.flip0) * i) / 7, 0.25));
  const scan3 = Array.from({ length: 9 }, (_, i) => bunyi('tik', T.scan3[0] + ((T.scan3[1] - T.scan3[0]) * i) / 8, 0.16));
  const scan4 = Array.from({ length: 5 }, (_, i) => bunyi('tik', T.scan4[0] + ((T.scan4[1] - T.scan4[0]) * i) / 4, 0.16));
  return [
    bunyi('pop', 0.35, 0.4),
    bunyi('glitch', 0.6, 0.25),
    ...flip,
    bunyi('hantam', T.flip1 + 0.05, 0.4),
    bunyi('whooshBerat', T.mundur + 0.1, 0.35),
    bunyi('pop', T.titik2, 0.3),
    bunyi('swish', T.satu2 + 0.1, 0.3),
    bunyi('whooshTurun', S[2].mulai, 0.3),
    ...scan3,
    bunyi('kunci', T.scan3[1], 0.35),
    bunyi('whooshPop', S[3].mulai, 0.3),
    ...scan4,
    bunyi('whooshTerang', T.melar4, 0.35),
    bunyi('glitch', T.isiAI4[0], 0.3),
    bunyi('glitch', T.isiAI4[0] + 0.4, 0.25),
    bunyi('whooshPunch', S[4].mulai + 0.05, 0.35),
    bunyi('pop', T.tiga5, 0.3),
    bunyi('whooshLembut', S[5].mulai, 0.35),
    bunyi('swish', T.multi6, 0.3),
    bunyi('pop', T.rtx6, 0.3),
    bunyi('whooshPop', T.tiga7 - 0.1, 0.3),
    bunyi('whooshPop', T.tiga7 + 0.18, 0.3),
    bunyi('whooshPop', T.tiga7 + 0.46, 0.3),
    bunyi('pop', T.satu8, 0.3),
    bunyi('whooshTerang', T.seperempat8 - 0.15, 0.35),
    bunyi('hantam', T.satu8b + 0.05, 0.45),
    bunyi('whooshTurun', S[8].mulai, 0.3),
    bunyi('riser', T.naik9 - 0.3, 0.22),
    bunyi('sapuHit', T.delapan9 + 0.3, 0.35),
    bunyi('hantam', S[9].mulai + 0.12, 0.45),
    ...Array.from({ length: 5 }, (_, i) => bunyi('whooshPop', T.jadi10 + i * 0.16, 0.22)),
    bunyi('kunci', T.asli10, 0.3),
    bunyi('whooshPop', T.simpan, 0.35),
    bunyi('pop', T.simpan + 0.35, 0.35),
    bunyi('whooshPop', T.follow, 0.35),
    bunyi('pop', T.follow + 0.35, 0.35),
    bunyi('whooshLembut', T.pulang, 0.35),
  ];
}

// ======================================================================================================
export const O2Sampul: React.FC = () => (
  <AbsoluteFill style={{ background: OL.navy0, overflow: 'hidden', fontFamily: SAIRA, color: OL.putih }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% 50%, ${OL.navy1} 0%, ${OL.navy0} 75%)` }} />
    {Array.from({ length: 16 }, (_, i) => {
      const c = i % 4;
      const r = Math.floor(i / 4);
      const game = i === 0;
      return (
        <div key={i} style={{ position: 'absolute', left: 170 + c * 185, top: 760 + r * 185, width: 170, height: 170, borderRadius: 14, background: game ? GAME : AI, opacity: game ? 1 : 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: game ? MONO : SAIRA, fontWeight: 800, fontSize: game ? 40 : 58, color: game ? OL.navy0 : OL.putih, boxShadow: game ? `0 0 50px ${GAME}` : undefined }}>
          {game ? 'game' : 'AI'}
        </div>
      );
    })}
    <div style={{ position: 'absolute', left: 70, top: 190, fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: OL.lime }}>DLSS 4 · MENURUT NVIDIA</div>
    <div style={{ position: 'absolute', left: 64, top: 250, fontWeight: 800, fontSize: 200, lineHeight: 0.95 }}>
      <span style={{ color: AI, textShadow: `0 0 40px ${AI}66` }}>15</span> dari 16
    </div>
    <div style={{ position: 'absolute', left: 70, top: 460, fontWeight: 800, fontSize: 96, lineHeight: 1, textShadow: '0 6px 18px #000' }}>
      piksel dibikin <span style={{ color: AI }}>AI</span>
    </div>
    <></>
    <GrainOL />
  </AbsoluteFill>
);
