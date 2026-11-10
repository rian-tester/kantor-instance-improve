// Frame hero (pembuka, tengah, puncak): 15, 852, 1419.
// contoh explainer generik O10 (konten contoh): "Harddisk masih muter piringan 7.200 kali per menit". 9:16, ±59 dtk.
// SERI generik (video/seri/seriOL.tsx), aksen O10 = KORAL (HDD / nunggu) vs LIME (SSD / cepat).
// SATU DUNIA: HDD dibuka (digambar sendiri, generik, tanpa merek): piringan muter, lengan + kepala baca, motor.
// Alur: piringan ngebut 0→7.200/menit → VS SSD (0 bagian gerak) → isi HDD (label digambar) → 7.200 ÷ 60 = 120/detik (cincin 1 detik)
// → game minta data: lengan geser ke jalur (0→9 ms, diperlambat) → 1 ms = 1/1000 detik → nunggu sektor lewat (9→13,16 ms) →
// data kepencar: geser+nunggu berkali-kali → SSD chip flash ≈ flashdisk besar → batang waktu 13 ms vs 0,1 ms, 130 batang SSD
// muat di 1 batang HDD (hitungan kami) → kartu syarat Starfield (SSD Required) → CTA → piringan ngebut lagi (loop).
// Fakta: Crucial, Seagate Exos X18 (7.200 RPM, 4,16 ms), Wikipedia (seek ±9 ms desktop), TechTarget/Kingston (SSD), Steam Starfield.
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  AngkaJalan, Bunyi, Dunia, EASE, formatAngka, GarisDigambar, hitungKamera, kata, maju, noise, pathLingkarTangan, pegas, SapuSorot, Stempel,
  useDetik, type KunciKamera, type Kata, type Sfx,
} from "../../src/gerak";
import { MONO, SAIRA } from "../../src/gerak/font";
import { bunyi, ChipAngka, ChipKecil, CtaOL, GrainOL, HudSeri, LatarOL, lerp, OL, generikReaksi, ScrimAtas, SubOL, TeksOL, type DataOL, type Kalimat } from "../../src/gerak/seri/neon-grid/seriOL";

const HDD_W = OL.koral;
const SSD_W = OL.lime;
// geometri HDD (dunia = layar pas kamera z 1)
const CASE = { x: 160, y: 500, w: 760, h: 800 };
const C = { x: 520, y: 830 }; // tengah piringan
const R = 300;
const PV = { x: 820, y: 1190 }; // poros lengan
const L_ARM = 420;
const J_TARGET = 200; // jalur data S4–S6
const MS_PX = 900 / 13.16; // batang waktu S9: 13,16 ms = 900 px

const GABUNG = [
  { kata: ['tujuh', 'ribu', 'dua', 'ratus'], jadi: '7.200' },
  { kata: ['seratus', 'dua', 'puluh'], jadi: '120' },
  { kata: ['empat', 'koma', 'enam', 'belas'], jadi: '4,16' },
  { kata: ['nol', 'koma', 'satu'], jadi: '0,1' },
  { kata: ['sembilan'], jadi: '9' },
  { kata: ['satu', 'milidetik'], jadi: '1 milidetik' },
];

// ======================================================================================================
function waktuO10(d: Kata[], total: number, kal: Kalimat[] = []) {
  const CAD: [number, number][] = [
    [0.14, 7.7], [8.06, 13.94], [14.36, 20.28], [20.64, 27.12], [27.52, 29.58], [29.94, 35.04], [35.44, 39.54], [39.94, 43.58], [43.96, 50.14],
    [50.54, 53.74], [54.16, 57.76],
  ];
  const s = CAD.map((c, i) => ({ mulai: kal[i]?.mulai ?? c[0], akhir: kal[i]?.akhir ?? c[1] }));
  const k = (c: string, setelah = 0, cad = 0) => kata(d, c, setelah, cad);
  const menit1 = k('menit', s[0].mulai, 3.62);
  const tapi1 = k('tapi', menit1, 4.12);
  const ssd1 = k('ssd', tapi1, 5.7);
  const gak1 = k('gak', ssd1, 6.5);
  const piringan2 = k('piringan', s[1].mulai, 10.28);
  const lengan2 = k('lengan', piringan2, 11.42);
  const kepala2 = k('kepala', lengan2, 12.14);
  const motor2 = k('motor', kepala2, 13.24);
  const jadi3 = k('jadi', s[2].mulai, 16.1);
  const seratus3 = k('seratus', jadi3, 18.48);
  const detik3 = k('detik', seratus3, 19.96);
  const game4 = k('game', s[3].mulai, 20.96);
  const lengannya4 = k('lengannya', game4, 21.92);
  const tepat4 = k('tepat', lengannya4, 23.56);
  const sembilan4 = k('sembilan', tepat4, 25.08);
  const seperseribu5 = k('seperseribu', s[4].mulai, 28.56);
  const nunggu6 = k('nunggu', s[5].mulai, 30.92);
  const empat6 = k('empat', nunggu6, 33.5);
  const ms6 = k('milidetik', empat6, 34.54);
  const kepencar7 = k('kepencar', s[6].mulai, 36.0);
  const berkali7 = k('berkali', kepencar7, 38.76);
  const chip8 = k('chip', s[7].mulai, 41.16);
  const mirip8 = k('mirip', chip8, 42.2);
  const nol9 = k('nol', s[8].mulai, 46.04);
  const dihitung9 = k('dihitung', nol9, 47.86);
  const seratus9 = k('seratus', dihitung9, 48.92);
  const starfield10 = k('starfield', s[9].mulai, 51.02);
  const ssd10 = k('ssd', starfield10, 52.3);
  const simpan = k('simpan', s[10].mulai, 54.16);
  const follow = k('follow', simpan, 56.26);
  return {
    total, s, menit1, tapi1, ssd1, gak1, piringan2, lengan2, kepala2, motor2, jadi3, seratus3, detik3, game4, lengannya4, tepat4, sembilan4,
    seperseribu5, nunggu6, empat6, ms6, kepencar7, berkali7, chip8, mirip8, nol9, dihitung9, seratus9, starfield10, ssd10, simpan, follow,
    seek: [lengannya4 - 0.1, tepat4 + 0.2] as [number, number], // lengan geser (0 → 9 ms)
    tunggu: [s[5].mulai + 0.2, ms6 + 0.25] as [number, number], // sektor muter ke kepala (9 → 13,16 ms)
    lambat: s[3].mulai - 0.2, // mulai slow motion
    hddPergi: s[7].mulai,
    ctaKeluar: Math.max(follow + 0.9, total - 1.75),
    pulang: total - 1.45,
    loop: total,
  };
}
type W = ReturnType<typeof waktuO10>;

// sudut lengan (derajat) biar kepala baca ada di jari-jari r dari tengah piringan
function sudutLengan(r: number) {
  const dx = C.x - PV.x;
  const dy = C.y - PV.y;
  const dd = Math.hypot(dx, dy);
  const cosA = Math.max(-1, Math.min(1, (L_ARM * L_ARM + dd * dd - r * r) / (2 * L_ARM * dd)));
  return ((Math.atan2(dy, dx) + Math.acos(cosA)) * 180) / Math.PI;
}
function posKepala(r: number) {
  const a = (sudutLengan(r) * Math.PI) / 180;
  return { x: PV.x + Math.cos(a) * L_ARM, y: PV.y + Math.sin(a) * L_ARM };
}
const sudutDi = (p: { x: number; y: number }) => (Math.atan2(p.y - C.y, p.x - C.x) * 180) / Math.PI;
const SUDUT_KEPALA_TARGET = sudutDi(posKepala(J_TARGET));

// sektor yang dicari pas "kepencar" (S7): jalur & sudut di piringan
const PENCAR = [
  { r: 150, a: 40 },
  { r: 272, a: 200 },
  { r: 236, a: 300 },
  { r: 118, a: 130 },
];

// jari-jari lengan per waktu
function rLengan(t: number, T: W) {
  const S = T.s;
  const hook = (x: number) => 228 + 34 * Math.sin(x * 1.25) + 10 * noise('arm', x * 0.8) * Math.sin(x * 1.25);
  if (t < T.lambat) return hook(t);
  if (t < T.seek[0]) return lerp(hook(T.lambat), 292, maju(t, T.lambat, T.lambat + 0.6, EASE.kamera)); // parkir di pinggir
  if (t < S[6].mulai + 0.1) return lerp(292, J_TARGET, maju(t, T.seek[0], T.seek[1], EASE.kamera));
  if (t < S[7].mulai) {
    // berkali-kali: 4 lompatan
    const [a, b] = [S[6].mulai + 0.1, T.berkali7 + 0.5];
    const n = PENCAR.length;
    const seg = (b - a) / n;
    const i = Math.min(n - 1, Math.max(0, Math.floor((t - a) / seg)));
    const dari = i === 0 ? J_TARGET : PENCAR[i - 1].r;
    return lerp(dari, PENCAR[i].r, maju(t, a + i * seg, a + i * seg + seg * 0.45, EASE.kamera));
  }
  if (t >= T.pulang - 0.3) return lerp(PENCAR[3].r, 228, maju(t, T.pulang - 0.3, T.pulang + 0.3, EASE.kamera)); // = posisi frame pertama
  return PENCAR[3].r;
}

// kecepatan putar piringan (derajat/detik, VISUAL): ngebut di hook, slow motion pas jelasin waktu
function kecepatan(t: number, T: W) {
  const S = T.s;
  const cepat = 470;
  const lambat = 180 / (T.tunggu[1] - T.tunggu[0]); // setengah putaran pas nunggu = rata-rata 4,16 ms
  const naik = maju(t, 0.25, 1.6, Easing.out(Easing.quad));
  if (t < T.lambat) return cepat * naik;
  if (t < S[7].mulai + 0.5) return lerp(cepat, lambat, maju(t, T.lambat, T.lambat + 0.6, EASE.kamera));
  // CTA: ngebut lagi, terus melambat sampai diam di ujung (frame pertama juga diam, lalu ngebut = loop)
  return lerp(lambat, cepat, maju(t, S[10].mulai, S[10].mulai + 1.2, EASE.kamera)) * (1 - maju(t, T.pulang - 0.2, T.total - 0.05, Easing.out(Easing.quad)));
}

// ======================================================================================================
function kunciKamera(T: W): KunciKamera[] {
  const S = T.s;
  const pelan = Easing.inOut(Easing.sin);
  return [
    { t: 0, x: 540, y: 960, z: 1.0 },
    { t: T.tapi1 - 0.2, x: 540, y: 950, z: 1.04, ease: pelan },
    { t: T.tapi1 + 0.4, x: 540, y: 960, z: 1.0 },
    { t: S[1].mulai + 0.5, x: 540, y: 960, z: 1.0 },
    { t: S[2].mulai, x: 540, y: 955, z: 1.03, ease: pelan },
    { t: S[3].mulai, x: 540, y: 960, z: 1.0 },
    { t: T.seek[1], x: 600, y: 900, z: 1.12, ease: pelan },
    { t: S[4].mulai, x: 600, y: 900, z: 1.14, ease: pelan },
    { t: S[5].mulai + 0.3, x: 600, y: 880, z: 1.16 },
    { t: S[6].mulai, x: 600, y: 870, z: 1.18, ease: pelan },
    { t: S[6].mulai + 0.5, x: 540, y: 950, z: 1.02 },
    { t: S[7].mulai, x: 540, y: 955, z: 1.03, ease: pelan },
    { t: S[7].mulai + 0.6, x: 540, y: 960, z: 1.0 },
    { t: T.pulang, x: 540, y: 958, z: 1.02, ease: pelan },
    { t: T.loop, x: 540, y: 960, z: 1.0, ease: pelan },
  ];
}

// ======================================================================================================
export const ContohHdd: React.FC<DataOL> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuO10(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const kunci = useMemo(() => kunciKamera(T), [T]);
  // sudut piringan = integral kecepatan (dihitung sekali), frame terakhir digenapin ke kelipatan 90° (= frame pertama, loop)
  const sudut = useMemo(() => {
    const out: number[] = [0];
    for (let f = 1; f <= durationInFrames; f++) out.push(out[f - 1] + kecepatan((f - 0.5) / fps, T) / fps);
    const akhir = out[durationInFrames - 1];
    const genap = Math.ceil(akhir / 90) * 90 - akhir;
    const f0 = Math.floor(T.pulang * fps);
    for (let f = f0; f <= durationInFrames; f++) out[f] += genap * maju(f / fps, T.pulang, total - 1 / fps, EASE.kamera);
    return out;
  }, [T, durationInFrames, fps, total]);
  const theta = sudut[Math.min(frame, sudut.length - 1)];
  const kam = hitungKamera(kunci, t, fps, {
    drift: 2.2 * (1 - maju(t, T.pulang, T.loop)) * maju(t, 0, 0.6),
    getar: [
      { t: T.menit1, kuat: 6 },
      { t: T.seek[1], kuat: 6 },
      { t: T.tunggu[1], kuat: 6 },
      { t: T.seratus9 + 0.4, kuat: 7 },
      { t: T.ssd10 + 0.1, kuat: 7, lama: 0.16 },
    ],
  });
  const S = T.s;
  return (
    <AbsoluteFill style={{ background: OL.navy0, color: OL.putih, overflow: 'hidden', fontFamily: SAIRA }}>
      <LatarOL kam={kam} aksen={HDD_W} />
      <Dunia kamera={kam} tinggiDunia={1920} lebarDunia={1080} blurGerak={null}>
        <Hdd T={T} theta={theta} />
      </Dunia>
      <Ssd T={T} />
      <SatuMs T={T} />
      <Banding T={T} />
      <Starfield T={T} />
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
// HDD (dunia): casing, piringan muter, motor, lengan + kepala baca, sektor data
const Hdd: React.FC<{ T: W; theta: number }> = ({ T, theta }) => {
  const t = useDetik();
  const S = T.s;
  // S1: mengecil ke kiri (VS SSD); S8: pergi ke kiri
  const vs = maju(t, T.tapi1 - 0.1, T.tapi1 + 0.45, EASE.kamera) * (1 - maju(t, S[1].mulai - 0.2, S[1].mulai + 0.4, EASE.kamera));
  const pergi = maju(t, T.hddPergi - 0.1, T.hddPergi + 0.5, EASE.keluar) * (1 - maju(t, T.pulang - 0.6, T.pulang, EASE.kamera));
  if (pergi >= 1) return null;
  const sk = lerp(1, 0.52, vs);
  const tx = lerp(0, -240, vs) - pergi * 900;
  const r = rLengan(t, T);
  const phi = sudutLengan(r);
  const lambat = maju(t, T.lambat, T.lambat + 0.5) * (1 - maju(t, S[7].mulai, S[7].mulai + 0.3));
  const kec = kecepatan(t, T);
  const blur = Math.min(1, kec / 470);
  const bagianGerak = maju(t, T.gak1, T.gak1 + 0.3) * (1 - maju(t, S[1].mulai - 0.2, S[1].mulai + 0.1));
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: `${C.x}px ${C.y + 70}px`, transform: `translate(${tx}px, 0px) scale(${sk})`, opacity: 1 - pergi }}>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <defs>
          <radialGradient id="piring" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#5a6496" />
            <stop offset="55%" stopColor="#2b3360" />
            <stop offset="100%" stopColor="#1a2044" />
          </radialGradient>
          <linearGradient id="casing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#222a52" />
            <stop offset="100%" stopColor="#141a36" />
          </linearGradient>
          <filter id="blurPutar">
            <feGaussianBlur stdDeviation={2 + 4 * blur} />
          </filter>
        </defs>
        {/* casing */}
        <rect x={CASE.x} y={CASE.y} width={CASE.w} height={CASE.h} rx={38} fill="url(#casing)" stroke={OL.garis} strokeWidth={5} />
        <rect x={CASE.x + 18} y={CASE.y + 18} width={CASE.w - 36} height={CASE.h - 36} rx={28} fill="none" stroke="#2f3a6e" strokeWidth={2} />
        {[
          [CASE.x + 40, CASE.y + 40],
          [CASE.x + CASE.w - 40, CASE.y + 40],
          [CASE.x + 40, CASE.y + CASE.h - 40],
          [CASE.x + CASE.w - 40, CASE.y + CASE.h - 40],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={13} fill="#2f3a6e" />
            <path d={`M ${x - 7} ${y} L ${x + 7} ${y} M ${x} ${y - 7} L ${x} ${y + 7}`} stroke="#111834" strokeWidth={3} />
          </g>
        ))}
        {/* piringan */}
        <circle cx={C.x} cy={C.y} r={R + 8} fill="#0d1126" />
        <circle cx={C.x} cy={C.y} r={R} fill="url(#piring)" />
        {Array.from({ length: 16 }, (_, i) => (
          <circle key={i} cx={C.x} cy={C.y} r={70 + i * 14.5} fill="none" stroke="#8a94b8" strokeOpacity={0.12} strokeWidth={1.5} />
        ))}
        {/* kilau berputar (blur ngikut kecepatan) */}
        <g transform={`rotate(${theta} ${C.x} ${C.y})`} filter="url(#blurPutar)">
          {[0, 90, 180, 270].map((a) => (
            <path key={a} d={sektorPath(C.x, C.y, 64, R - 4, a - 9, a + 9)} fill="#c3cae6" opacity={0.16} />
          ))}
          {[45, 225].map((a) => (
            <path key={a} d={sektorPath(C.x, C.y, 150, 260, a - 4, a + 4)} fill="#c3cae6" opacity={0.1} />
          ))}
        </g>
        {/* garis kecepatan di pinggir (cuma pas ngebut) */}
        {blur > 0.3 && lambat < 0.5 ? (
          <g transform={`rotate(${theta * 0.5} ${C.x} ${C.y})`} opacity={(blur - 0.3) * (1 - lambat * 2)}>
            {[10, 130, 250].map((a) => (
              <path key={a} d={busur(C.x, C.y, R + 26, a, a + 70)} fill="none" stroke={OL.abuTerang} strokeWidth={5} strokeLinecap="round" opacity={0.5} />
            ))}
          </g>
        ) : null}
        {/* sektor data (S4–S6): busur koral di jalur target, ikut muter */}
        <SektorData T={T} theta={theta} />
        {/* motor pemutar */}
        <circle cx={C.x} cy={C.y} r={58} fill="#2a3266" stroke="#3a4677" strokeWidth={4} />
        <g transform={`rotate(${theta} ${C.x} ${C.y})`}>
          {Array.from({ length: 6 }, (_, i) => (
            <circle key={i} cx={C.x + Math.cos((i * Math.PI) / 3) * 34} cy={C.y + Math.sin((i * Math.PI) / 3) * 34} r={6} fill="#141a36" />
          ))}
        </g>
        <circle cx={C.x} cy={C.y} r={14} fill="#8a94b8" />
        {/* ramp parkir */}
        <path d={`M ${C.x + R + 4} ${C.y - 90} L ${C.x + R + 34} ${C.y - 70} L ${C.x + R + 34} ${C.y - 20} L ${C.x + R + 4} ${C.y - 40} Z`} fill="#2f3a6e" />
        {/* lengan + kepala baca */}
        <g transform={`rotate(${phi} ${PV.x} ${PV.y})`}>
          <path d={`M ${PV.x} ${PV.y - 34} L ${PV.x + L_ARM - 30} ${PV.y - 9} L ${PV.x + L_ARM - 30} ${PV.y + 9} L ${PV.x} ${PV.y + 34} Z`} fill="#9aa3c7" stroke="#5a6496" strokeWidth={3} />
          <path d={`M ${PV.x + 60} ${PV.y - 10} L ${PV.x + L_ARM - 60} ${PV.y - 3}`} stroke="#5a6496" strokeWidth={4} />
          <rect x={PV.x + L_ARM - 34} y={PV.y - 13} width={40} height={26} rx={5} fill={OL.emas} stroke={OL.navy0} strokeWidth={3} />
          <path d={`M ${PV.x - 70} ${PV.y - 28} L ${PV.x - 120} ${PV.y - 40} L ${PV.x - 120} ${PV.y + 40} L ${PV.x - 70} ${PV.y + 28} Z`} fill="#3a4677" />
        </g>
        <circle cx={PV.x} cy={PV.y} r={50} fill="#2a3266" stroke="#5a6496" strokeWidth={5} />
        <circle cx={PV.x} cy={PV.y} r={16} fill="#8a94b8" />
        {/* S1: "bagian gerak" dilingkarin */}
        {bagianGerak > 0 ? (
          <>
            <GarisDigambar d={pathLingkarTangan(C.x, C.y, R + 30, R + 30, 'bg1')} mulai={T.gak1} lama={0.3} warna={HDD_W} tebal={12} />
            <GarisDigambar d={pathLingkarTangan(PV.x - 60, PV.y - 120, 130, 160, 'bg2')} mulai={T.gak1 + 0.15} lama={0.3} warna={HDD_W} tebal={12} />
          </>
        ) : null}
        {/* S2: label digambar */}
        <LabelIsi T={T} r={r} phi={phi} />
        {/* S3: cincin 1 detik di keliling piringan */}
        <CincinDetik T={T} />
        {/* S4/S6: jalur target */}
        {t > T.seek[0] - 0.4 && t < S[6].mulai + 0.2 ? (
          <circle cx={C.x} cy={C.y} r={J_TARGET} fill="none" stroke={OL.emas} strokeWidth={4} strokeDasharray="10 12" opacity={maju(t, T.seek[0] - 0.4, T.seek[0]) * (1 - maju(t, S[6].mulai - 0.1, S[6].mulai + 0.2)) * 0.8} />
        ) : null}
      </svg>
      {/* chip slow motion (jujur: gerak diperlambat) */}
      {lambat > 0 ? <ChipKecil x={CASE.x + 40} y={CASE.y + 34} o={lambat} warna={OL.emas} teks="gerak diperlambat" /> : null}
      {t < T.lambat && t > 0.8 ? <ChipKecil x={CASE.x + 40} y={CASE.y + 34} o={maju(t, 0.8, 1.1) * (1 - maju(t, T.tapi1 - 0.2, T.tapi1))} teks="ilustrasi, bukan kecepatan asli" /> : null}
    </div>
  );
};

/** path sektor cincin (donat) dari sudut a1..a2 (derajat) */
function sektorPath(cx: number, cy: number, r1: number, r2: number, a1: number, a2: number) {
  const p = (r: number, a: number) => `${cx + r * Math.cos((a * Math.PI) / 180)} ${cy + r * Math.sin((a * Math.PI) / 180)}`;
  const besar = a2 - a1 > 180 ? 1 : 0;
  return `M ${p(r1, a1)} L ${p(r2, a1)} A ${r2} ${r2} 0 ${besar} 1 ${p(r2, a2)} L ${p(r1, a2)} A ${r1} ${r1} 0 ${besar} 0 ${p(r1, a1)} Z`;
}
function busur(cx: number, cy: number, r: number, a1: number, a2: number) {
  const p = (a: number) => `${cx + r * Math.cos((a * Math.PI) / 180)} ${cy + r * Math.sin((a * Math.PI) / 180)}`;
  return `M ${p(a1)} A ${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${p(a2)}`;
}

// sektor data: S4–S6 satu sektor (nyampe ke kepala pas tunggu[1]); S7 empat sektor kepencar
const SektorData: React.FC<{ T: W; theta: number }> = ({ T, theta }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const out: React.ReactNode[] = [];
  if (t > T.game4 - 0.2 && t < S[6].mulai + 0.3) {
    // sudut sektor di bingkai piringan dipilih biar pas tunggu[1] dia tepat di bawah kepala
    const fHit = Math.round(T.tunggu[1] * fps);
    // theta(tunggu[1]) dihitung ulang dari kecepatan (integral kasar) relatif ke sekarang
    let dTh = 0;
    const f0 = Math.round(t * fps);
    for (let f = f0; f < fHit; f++) dTh += kecepatan((f + 0.5) / fps, T) / fps;
    for (let f = fHit; f < f0; f++) dTh -= kecepatan((f + 0.5) / fps, T) / fps;
    const sudutSekarang = SUDUT_KEPALA_TARGET - dTh; // posisi absolut sektor sekarang
    const o = maju(t, T.game4 - 0.2, T.game4 + 0.2) * (1 - maju(t, S[6].mulai, S[6].mulai + 0.3));
    const kebaca = t > T.tunggu[1] ? 1 : 0;
    out.push(<path key="s0" d={sektorPath(C.x, C.y, J_TARGET - 14, J_TARGET + 14, sudutSekarang - 11, sudutSekarang + 11)} fill={kebaca ? OL.lime : HDD_W} opacity={o} />);
    if (kebaca) {
      const p = pegas(t, T.tunggu[1], fps, { damping: 8, stiffness: 200, mass: 0.5 });
      const h = posKepala(J_TARGET);
      out.push(<circle key="k0" cx={h.x} cy={h.y} r={20 + 50 * p} fill="none" stroke={OL.lime} strokeWidth={5} opacity={Math.max(0, 1 - p) * o} />);
    }
  }
  if (t > S[6].mulai - 0.1 && t < S[7].mulai + 0.3) {
    const o = maju(t, S[6].mulai - 0.1, S[6].mulai + 0.2) * (1 - maju(t, S[7].mulai - 0.1, S[7].mulai + 0.2));
    const [a, b] = [S[6].mulai + 0.1, T.berkali7 + 0.5];
    const seg = (b - a) / PENCAR.length;
    PENCAR.forEach((p, i) => {
      const dibaca = t > a + i * seg + seg * 0.8;
      out.push(<path key={`p${i}`} d={sektorPath(C.x, C.y, p.r - 12, p.r + 12, p.a + theta - 9, p.a + theta + 9)} fill={dibaca ? OL.lime : HDD_W} opacity={o} />);
    });
  }
  return <>{out}</>;
};

// S2: label isi HDD (garis penunjuk digambar)
const LabelIsi: React.FC<{ T: W; r: number; phi: number }> = ({ T, r, phi }) => {
  const t = useDetik();
  const S = T.s;
  if (t < T.piringan2 - 0.2 || t > S[2].mulai + 0.3) return null;
  const keluar = S[2].mulai - 0.15;
  const h = posKepala(r);
  const a = (phi * Math.PI) / 180;
  const tengahLengan = { x: PV.x + Math.cos(a) * L_ARM * 0.5, y: PV.y + Math.sin(a) * L_ARM * 0.5 };
  const lab = [
    { m: T.piringan2, ke: { x: C.x - 200, y: C.y - 180 }, chip: { x: 300, y: 560 }, teks: 'piringan magnetik' },
    { m: T.lengan2, ke: tengahLengan, chip: { x: 760, y: 1250 }, teks: 'lengan' },
    { m: T.kepala2, ke: h, chip: { x: 820, y: 560 }, teks: 'kepala baca' },
    { m: T.motor2, ke: C, chip: { x: 330, y: 1220 }, teks: 'motor pemutar' },
  ];
  return (
    <>
      {lab.map((l, i) => {
        const o = maju(t, l.m - 0.05, l.m + 0.15) * (1 - maju(t, keluar, keluar + 0.2));
        if (o <= 0) return null;
        return (
          <g key={i} opacity={o}>
            <GarisDigambar d={`M ${l.chip.x} ${l.chip.y} L ${l.ke.x} ${l.ke.y}`} mulai={l.m} lama={0.2} warna={OL.emas} tebal={5} />
            <circle cx={l.ke.x} cy={l.ke.y} r={10} fill={OL.emas} opacity={maju(t, l.m + 0.15, l.m + 0.25)} />
            <foreignObject x={l.chip.x - 200} y={l.chip.y - 32} width={400} height={64}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ padding: '6px 18px', borderRadius: 12, background: OL.emas, color: OL.navy0, fontFamily: SAIRA, fontWeight: 800, fontSize: 40, whiteSpace: 'nowrap', scale: String(0.8 + 0.2 * maju(t, l.m, l.m + 0.2)) }}>{l.teks}</div>
              </div>
            </foreignObject>
          </g>
        );
      })}
    </>
  );
};

// S3: cincin 1 detik di keliling piringan + angka putaran di tengah (diikat ke cincin)
export function majuDetik(t: number, T: W) {
  return maju(t, T.seratus3 - 0.6, T.detik3 + 0.1, EASE.linear);
}
const CincinDetik: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < T.jadi3 - 0.2 || t > S[3].mulai + 0.2) return null;
  const p = majuDetik(t, T);
  const o = maju(t, T.jadi3 - 0.2, T.jadi3 + 0.1) * (1 - maju(t, S[3].mulai - 0.15, S[3].mulai + 0.15));
  const Rr = R + 34;
  const L = 2 * Math.PI * Rr;
  return (
    <g opacity={o}>
      <circle cx={C.x} cy={C.y} r={Rr} fill="none" stroke={OL.garis} strokeWidth={14} />
      <circle cx={C.x} cy={C.y} r={Rr} fill="none" stroke={OL.emas} strokeWidth={14} strokeDasharray={`${L * p} ${L}`} transform={`rotate(-90 ${C.x} ${C.y})`} strokeLinecap="round" />
      <circle cx={C.x} cy={C.y} r={120} fill={OL.navy0} opacity={0.9} stroke={OL.emas} strokeWidth={4} />
      <text x={C.x} y={C.y + 26} textAnchor="middle" fontFamily={SAIRA} fontWeight={800} fontSize={92} fill={OL.emas}>
        {Math.floor(120 * p + 1e-6)}
      </text>
      <text x={C.x} y={C.y + 70} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={24} fill={OL.abuTerang}>
        putaran
      </text>
      <text x={C.x} y={C.y + R + 92} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={28} fill={OL.emas}>
        1 detik (diperlambat)
      </text>
    </g>
  );
};

// ======================================================================================================
// SSD generik (M.2, digambar sendiri): papan, 4 chip flash, controller, kaki emas
const PapanSsd: React.FC<{ w: number; h: number; label?: number; sorot?: number }> = ({ w, h, label = 0, sorot = 0 }) => (
  <svg width={w} height={h} viewBox="0 0 760 210" style={{ overflow: 'visible' }}>
    <rect x={0} y={0} width={760} height={210} rx={18} fill="#13301f" stroke={SSD_W} strokeWidth={4} />
    {Array.from({ length: 9 }, (_, i) => (
      <path key={i} d={`M ${120 + i * 70} 20 L ${140 + i * 70} 40 L ${140 + i * 70} 170`} stroke={SSD_W} strokeOpacity={0.22} strokeWidth={3} fill="none" />
    ))}
    <rect x={30} y={45} width={110} height={120} rx={8} fill="#0d1126" stroke="#3a4677" strokeWidth={3} />
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <rect x={180 + i * 130} y={35} width={112} height={140} rx={8} fill="#0b0f20" stroke={sorot > 0 ? OL.emas : '#3a4677'} strokeWidth={sorot > 0 ? 3 + 3 * sorot : 3} />
        {label > 0 ? (
          <text x={236 + i * 130} y={112} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={22} fill={OL.putih} opacity={label}>
            flash
          </text>
        ) : null}
      </g>
    ))}
    <rect x={712} y={30} width={48} height={150} rx={4} fill="#c9a43a" />
    {Array.from({ length: 10 }, (_, i) => (
      <rect key={i} x={716} y={36 + i * 14.5} width={40} height={7} fill="#13301f" opacity={0.6} />
    ))}
    <circle cx={14} cy={105} r={9} fill="none" stroke={SSD_W} strokeWidth={3} />
  </svg>
);

const Ssd: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const out: React.ReactNode[] = [];
  // S1: SSD tegak di kanan (VS)
  const m1 = maju(t, T.ssd1 - 0.45, T.ssd1, EASE.masuk) * (1 - maju(t, S[1].mulai - 0.2, S[1].mulai + 0.3, EASE.keluar));
  if (m1 > 0) {
    const nol = pegas(t, T.gak1 + 0.1, fps, { damping: 10, stiffness: 190, mass: 0.6 });
    out.push(
      <div key="vs" style={{ position: 'absolute', left: 0, top: 0, opacity: m1 }}>
        <div style={{ position: 'absolute', left: 745 + (1 - m1) * 300, top: 900, width: 0, height: 0 }}>
          <div style={{ position: 'absolute', left: -300 * 0.75, top: -105 * 0.75, width: 760 * 0.75, height: 210 * 0.75, rotate: '-90deg' }}>
            <PapanSsd w={570} h={157} />
          </div>
        </div>
        <div style={{ position: 'absolute', left: 548, top: 860, fontFamily: SAIRA, fontWeight: 800, fontSize: 72, color: OL.emas, textShadow: `0 0 20px ${OL.emas}88`, scale: String(0.6 + 0.4 * m1) }}>VS</div>
        <div style={{ position: 'absolute', left: 280, top: 1200, translate: '-50% 0', fontFamily: SAIRA, fontWeight: 800, fontSize: 52, color: HDD_W }}>HDD</div>
        <div style={{ position: 'absolute', left: 805, top: 1200, translate: '-50% 0', fontFamily: SAIRA, fontWeight: 800, fontSize: 52, color: SSD_W }}>SSD</div>
        {nol > 0 ? <ChipAngka x={805} y={575} skala={nol} ukuran={36} warna={SSD_W} isi="0 bagian gerak" /> : null}
      </div>,
    );
  }
  // S8: SSD besar, chip flash dilabelin, mirip flashdisk
  const m8 = maju(t, S[7].mulai - 0.05, S[7].mulai + 0.45, EASE.masuk) * (1 - maju(t, S[8].mulai - 0.15, S[8].mulai + 0.3, EASE.keluar));
  if (m8 > 0) {
    const lab = maju(t, T.chip8 - 0.1, T.chip8 + 0.2);
    const mirip = maju(t, T.mirip8 - 0.1, T.mirip8 + 0.3, EASE.masuk);
    out.push(
      <div key="besar" style={{ position: 'absolute', left: 0, top: 0, opacity: m8 }}>
        <div style={{ position: 'absolute', left: 160 + (1 - m8) * 500, top: 640 }}>
          <PapanSsd w={760} h={210} label={lab} sorot={lab} />
        </div>
        <ChipAngka x={540} y={600} o={lab} ukuran={40} warna={OL.emas} isi="chip memori flash" />
        <div style={{ position: 'absolute', left: 540, top: 900, translate: '-50% 0', fontFamily: SAIRA, fontWeight: 800, fontSize: 80, color: OL.abuTerang, opacity: mirip }}>≈</div>
        <div style={{ position: 'absolute', left: 540 - 190, top: 1010 + (1 - mirip) * 60, opacity: mirip }}>
          <svg width={380} height={150} style={{ overflow: 'visible' }}>
            <rect x={110} y={20} width={260} height={110} rx={26} fill="#1a2244" stroke={SSD_W} strokeWidth={4} />
            <rect x={10} y={40} width={100} height={70} rx={6} fill="#9aa3c7" stroke="#5a6496" strokeWidth={3} />
            <rect x={30} y={55} width={18} height={14} fill="#1a2244" />
            <rect x={65} y={55} width={18} height={14} fill="#1a2244" />
            <circle cx={340} cy={75} r={10} fill="none" stroke={SSD_W} strokeWidth={3} />
          </svg>
          <div style={{ position: 'absolute', left: 190, top: 160, translate: '-50% 0', fontFamily: MONO, fontWeight: 700, fontSize: 28, color: OL.abuTerang, whiteSpace: 'nowrap' }}>flashdisk</div>
        </div>
        <div style={{ position: 'absolute', left: 540, top: 870, translate: '-50% 0', fontFamily: SAIRA, fontWeight: 800, fontSize: 44, color: SSD_W, opacity: maju(t, S[7].mulai + 0.3, S[7].mulai + 0.6) }}>SSD</div>
      </div>,
    );
  }
  return <>{out}</>;
};

// S5: 1 detik = 1.000 milidetik (penggaris 1.000 garis, 1 disorot)
const SatuMs: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[4].mulai - 0.2 || t > S[5].mulai + 0.4) return null;
  const m = maju(t, S[4].mulai - 0.15, S[4].mulai + 0.25, EASE.masuk);
  const k = maju(t, S[5].mulai - 0.2, S[5].mulai + 0.2, EASE.keluar);
  const tarik = maju(t, S[4].mulai, S[4].mulai + 0.8, EASE.kamera);
  const zoom = maju(t, T.seperseribu5 - 0.2, T.seperseribu5 + 0.4, EASE.kamera);
  const X = 90;
  const Wd = 900;
  return (
    <div style={{ position: 'absolute', left: 60, top: 540, width: 960, height: 640, borderRadius: 26, background: `${OL.navy0}f2`, border: `3px solid ${OL.garis}`, opacity: m * (1 - k), scale: String(0.94 + 0.06 * m) }}>
      <div style={{ position: 'absolute', left: X - 60, top: 70, width: Wd * tarik, height: 70, overflow: 'hidden' }}>
        <svg width={Wd} height={70}>
          {Array.from({ length: 1000 }, (_, i) => (
            <rect key={i} x={i * 0.9} y={i % 100 === 0 ? 0 : i % 10 === 0 ? 18 : 34} width={0.45} height={i % 100 === 0 ? 70 : i % 10 === 0 ? 52 : 36} fill={OL.abuTerang} opacity={0.75} />
          ))}
        </svg>
      </div>
      <div style={{ position: 'absolute', left: X - 60, top: 60, width: Wd * tarik, height: 4, background: OL.emas }} />
      <div style={{ position: 'absolute', left: X - 60, top: 150, fontFamily: MONO, fontWeight: 700, fontSize: 28, color: OL.abuTerang }}>0</div>
      <div style={{ position: 'absolute', left: X - 60 + Wd, top: 150, translate: '-100% 0', fontFamily: MONO, fontWeight: 700, fontSize: 28, color: OL.abuTerang, opacity: tarik }}>1 detik = 1.000 bagian</div>
      {/* lup: 1 garis diperbesar */}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: zoom }} width={1} height={1}>
        <rect x={X - 64} y={62} width={12} height={82} fill="none" stroke={OL.emas} strokeWidth={4} />
        <path d={`M ${X - 52} 144 L ${X + 110} 260`} stroke={OL.emas} strokeWidth={4} />
      </svg>
      <div style={{ position: 'absolute', left: X + 110, top: 250, width: 640, height: 300, borderRadius: 20, border: `4px solid ${OL.emas}`, opacity: zoom, scale: String(0.6 + 0.4 * zoom), transformOrigin: '0 0', overflow: 'hidden', background: OL.permukaan }}>
        <div style={{ position: 'absolute', left: 40, top: 40, width: 80, height: 220, background: OL.emas, borderRadius: 8 }} />
        <div style={{ position: 'absolute', left: 150, top: 70, fontFamily: SAIRA, fontWeight: 800, fontSize: 96, color: OL.emas }}>1 ms</div>
        <div style={{ position: 'absolute', left: 156, top: 190, fontFamily: MONO, fontWeight: 700, fontSize: 32, color: OL.abuTerang }}>= 1/1.000 detik</div>
      </div>
    </div>
  );
};

// S9: batang waktu ±13 ms (HDD) vs ±0,1 ms (SSD); 130 batang SSD muat di 1 batang HDD
export function majuBanding(t: number, T: W) {
  return maju(t, T.s[8].mulai + 0.3, T.nol9 + 0.3, EASE.linear);
}
const Banding: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[8].mulai - 0.1 || t > S[9].mulai + 0.4) return null;
  const m = maju(t, S[8].mulai - 0.1, S[8].mulai + 0.3, EASE.masuk);
  const k = maju(t, S[9].mulai - 0.15, S[9].mulai + 0.25, EASE.keluar);
  const p = majuBanding(t, T); // waktu jalan 0 → 13,16 ms
  const ms = 13.16 * p;
  const X = 90;
  const yH = 700;
  const yS = 1000;
  const ssdSelesai = ms >= 0.1;
  const susun = maju(t, T.dihitung9 - 0.1, T.seratus9 + 0.5, Easing.inOut(Easing.quad)); // 0 → 130 batang SSD
  const n = Math.floor(130 * susun + 1e-6);
  const kotakSSD = 0.1 * MS_PX;
  const tiba = pegas(t, T.s[8].mulai + 0.32, fps, { damping: 8, stiffness: 220, mass: 0.5 });
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: m * (1 - k) }}>
      {/* sumbu waktu */}
      <div style={{ position: 'absolute', left: X, top: 1130, width: 900, height: 4, background: OL.garis }} />
      {[0, 2, 4, 6, 8, 10, 12].map((v) => (
        <div key={v} style={{ position: 'absolute', left: X + v * MS_PX, top: 1120, width: 3, height: 24, background: OL.garis }}>
          <div style={{ position: 'absolute', left: 0, top: 30, translate: '-50% 0', fontFamily: MONO, fontWeight: 600, fontSize: 22, color: OL.abu }}>{v}</div>
        </div>
      ))}
      <div style={{ position: 'absolute', left: X + 900, top: 1190, translate: '-100% 0', fontFamily: MONO, fontWeight: 700, fontSize: 22, color: OL.abu }}>milidetik</div>
      {/* HDD */}
      <div style={{ position: 'absolute', left: X, top: yH - 56, fontFamily: SAIRA, fontWeight: 800, fontSize: 44, color: HDD_W }}>HDD</div>
      <div style={{ position: 'absolute', left: X, top: yH, width: 900 * p, height: 90, borderRadius: 10, background: `${HDD_W}cc` }} />
      <div style={{ position: 'absolute', left: X + 9 * MS_PX, top: yH - 6, width: 3, height: 102, background: OL.navy0, opacity: p > 9 / 13.16 ? 0.7 : 0 }} />
      <div style={{ position: 'absolute', left: X + 4.5 * MS_PX, top: yH + 26, translate: '-50% 0', fontFamily: MONO, fontWeight: 700, fontSize: 24, color: OL.navy0, opacity: p > 0.62 ? 1 : 0 }}>geser 9</div>
      <div style={{ position: 'absolute', left: X + 11.08 * MS_PX, top: yH + 26, translate: '-50% 0', fontFamily: MONO, fontWeight: 700, fontSize: 24, color: OL.navy0, opacity: p > 0.98 ? 1 : 0 }}>+4,16</div>
      {/* SSD: 0,1 ms = 6,8 px */}
      <div style={{ position: 'absolute', left: X, top: yS - 56, fontFamily: SAIRA, fontWeight: 800, fontSize: 44, color: SSD_W }}>SSD</div>
      <div style={{ position: 'absolute', left: X, top: yS, width: ssdSelesai ? kotakSSD : 0, height: 90, borderRadius: 3, background: SSD_W, boxShadow: `0 0 ${10 + 20 * tiba}px ${SSD_W}` }} />
      {ssdSelesai ? <ChipAngka x={X + 150} y={yS + 45} ukuran={34} warna={SSD_W} skala={Math.min(1, tiba)} isi="selesai ±0,1 ms" /> : null}
      {/* susun 130 batang SSD di jalur HDD */}
      {n > 0
        ? Array.from({ length: n }, (_, i) => <div key={i} style={{ position: 'absolute', left: X + i * kotakSSD, top: yH + 100, width: kotakSSD - 1.5, height: 26, background: SSD_W, opacity: 0.85 }} />)
        : null}
      {n > 0 ? <ChipAngka x={X + Math.min(n * kotakSSD, 800)} y={yH + 178} ukuran={40} warna={OL.emas} isi={<>×{formatAngka(n)}</>} /> : null}
      <ChipAngka x={X + Math.max(230, 900 * p) - 10} y={yH - 34} o={p > 0 && p < 1 ? 1 : p >= 1 ? 1 : 0} ukuran={36} warna={HDD_W} isi={<>{formatAngka(ms, 2)} ms</>} />
    </div>
  );
};

// S10: kartu syarat minimum (generik, tanpa logo/gambar game)
const Starfield: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[9].mulai - 0.1 || t > S[10].mulai + 0.4) return null;
  const m = maju(t, S[9].mulai - 0.1, S[9].mulai + 0.35, EASE.masuk);
  const k = maju(t, S[10].mulai - 0.1, S[10].mulai + 0.3, EASE.keluar);
  const baris = [
    { a: 'Game', b: 'Starfield' },
    { a: 'Penyimpanan', b: '125 GB' },
    { a: 'Catatan', b: 'SSD Required' },
  ];
  return (
    <div style={{ position: 'absolute', left: 110, top: 600 + (1 - m) * 60, width: 860, height: 560, borderRadius: 28, background: `linear-gradient(170deg, ${OL.permukaan}, ${OL.navy0})`, border: `3px solid ${OL.garis}`, opacity: m * (1 - k), boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
      <div style={{ position: 'absolute', left: 40, top: 34, fontFamily: MONO, fontWeight: 800, fontSize: 30, letterSpacing: '0.1em', color: OL.lime }}>SYARAT MINIMUM</div>
      {baris.map((r, i) => {
        const o = maju(t, S[9].mulai + 0.25 + i * 0.25, S[9].mulai + 0.45 + i * 0.25);
        return (
          <div key={i} style={{ position: 'absolute', left: 40, top: 110 + i * 120, width: 780, height: 100, borderRadius: 14, background: 'rgba(8,12,28,0.6)', opacity: o, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', boxSizing: 'border-box' }}>
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: OL.abuTerang }}>{r.a}</span>
            <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 54, color: OL.putih }}>
              {i === 2 ? (
                <>
                  <SapuSorot mulai={T.ssd10} warna={OL.emas} warnaTeks={[OL.putih, OL.navy0]} penuh>
                    SSD
                  </SapuSorot>{' '}
                  Required
                </>
              ) : (
                r.b
              )}
            </span>
          </div>
        );
      })}
      <Stempel mulai={T.ssd10 + 0.2} rot={-9} gaya={{ position: 'absolute', left: 470, top: 455 }}>
        <div style={{ padding: '4px 22px', borderRadius: 12, border: `5px solid ${SSD_W}`, color: SSD_W, fontFamily: SAIRA, fontWeight: 800, fontSize: 60, background: `${OL.navy0}ee` }}>WAJIB SSD</div>
      </Stempel>
    </div>
  );
};

// ======================================================================================================
const Teks: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const kj = (n: number) => S[n].mulai - 0.22;
  const rpm = maju(t, 0.25, 1.6, Easing.out(Easing.quad));
  const seekP = maju(t, T.seek[0], T.seek[1], EASE.kamera);
  const tungguP = maju(t, T.tunggu[0], T.tunggu[1], EASE.linear);
  const sumber = (() => {
    if (t < 1.4) return null;
    if (t < S[2].mulai) return 'Sumber: Crucial (SSD vs HDD), Seagate Exos X18';
    if (t < S[3].mulai) return 'hitungan kami: 7.200 ÷ 60 = 120 putaran/detik';
    if (t < S[4].mulai) return 'Sumber: Wikipedia (HDD performance), rata-rata HDD desktop';
    if (t < S[5].mulai) return null;
    if (t < S[6].mulai) return 'Sumber: datasheet Seagate Exos X18 (7.200 RPM)';
    if (t < S[7].mulai) return 'Sumber: Kingston via Ontrack';
    if (t < S[8].mulai) return 'Sumber: Crucial, Kingston via Ontrack';
    if (t < S[9].mulai) return 'hitungan kami: (9 + 4,16) ÷ 0,1 ≈ 130× · TechTarget';
    if (t < S[10].mulai) return 'Sumber: Steam, Starfield (syarat minimum)';
    return null;
  })();
  const oSumber = maju(t, 1.4, 1.7) * (1 - maju(t, S[10].mulai - 0.2, S[10].mulai));
  return (
    <>
      <TeksOL
        label={['harddisk', '(HDD)']}
        lMulai={0.12}
        judul={[
          { t: '7.200', mulai: 0.25, isi: <AngkaJalan dari={0} ke={7200} progress={rpm} gaya={{ color: OL.emas, minWidth: '2.3em', display: 'inline-block' }} /> },
          { t: 'putaran/menit', mulai: 0.35 },
        ]}
        jMulai={0.25}
        keluar={T.tapi1 - 0.15}
        ukuran={96}
      />
      <TeksOL label={['tapi', 'tetap', 'kalah']} lMulai={T.tapi1} judul={[{ t: 'HDD', mulai: T.tapi1 + 0.1, warna: HDD_W }, { t: 'kalah', mulai: T.tapi1 + 0.3 }, { t: 'sama', mulai: T.ssd1 - 0.2 }, { t: 'SSD', mulai: T.ssd1, warna: SSD_W }]} jMulai={T.tapi1 + 0.1} keluar={kj(1)} />
      <TeksOL label={['di', 'dalam', 'harddisk']} lMulai={S[1].mulai} judul={[{ t: 'isi', mulai: S[1].mulai + 0.2 }, { t: 'HDD', mulai: S[1].mulai + 0.3, warna: HDD_W }]} jMulai={S[1].mulai + 0.2} keluar={kj(2)} />
      <TeksOL
        label={['RPM', '=', 'putaran', 'per', 'menit']}
        lMulai={S[2].mulai}
        judul={[
          { t: '7.200', mulai: T.jadi3 + 0.2, warna: OL.emas },
          { t: 'RPM', mulai: T.jadi3 + 0.4 },
          { t: '=', mulai: T.seratus3 - 0.2, warna: OL.abu },
          { t: '120/detik', mulai: T.seratus3, warna: OL.emas },
        ]}
        jMulai={T.jadi3 + 0.2}
        keluar={kj(3)}
        ukuran={88}
      />
      <ChipKecil x={70} y={336} o={maju(t, T.jadi3 + 0.4, T.jadi3 + 0.6) * (1 - maju(t, kj(3), kj(3) + 0.2))} warna={OL.emas} teks="7.200 putaran ÷ 60 detik" />
      <TeksOL
        label={['tiap', 'game', 'minta', 'data']}
        lMulai={S[3].mulai}
        judul={[
          { t: 'geser', mulai: T.lengannya4 },
          { t: 'lengan:', mulai: T.lengannya4 + 0.15 },
          { t: '±9', mulai: T.seek[0], isi: <><span style={{ color: HDD_W }}>±</span><AngkaJalan dari={0} ke={9} progress={seekP} desimal={1} gaya={{ color: HDD_W, minWidth: '1.3em', display: 'inline-block' }} /></> },
          { t: 'ms', mulai: T.seek[0] + 0.1 },
        ]}
        jMulai={T.lengannya4}
        keluar={kj(4)}
        ukuran={82}
      />
      <TeksOL label={['milidetik', '(ms)']} lMulai={S[4].mulai} judul={[{ t: '1', mulai: S[4].mulai + 0.1, warna: OL.emas }, { t: 'ms', mulai: S[4].mulai + 0.2 }, { t: '=', mulai: T.seperseribu5 - 0.2, warna: OL.abu }, { t: '1/1.000', mulai: T.seperseribu5, warna: OL.emas }, { t: 'detik', mulai: T.seperseribu5 + 0.3 }]} jMulai={S[4].mulai + 0.1} keluar={kj(5)} ukuran={92} />
      <TeksOL
        label={['nunggu', 'datanya', 'lewat']}
        lMulai={S[5].mulai}
        judul={[
          { t: '+4,16', mulai: T.tunggu[0], isi: <><span style={{ color: HDD_W }}>+</span><AngkaJalan dari={0} ke={4.16} progress={tungguP} desimal={2} gaya={{ color: HDD_W, minWidth: '1.9em', display: 'inline-block' }} /></> },
          { t: 'ms', mulai: T.tunggu[0] + 0.1 },
        ]}
        jMulai={T.tunggu[0]}
        keluar={kj(6)}
      />
      <ChipKecil x={70} y={336} o={maju(t, T.tunggu[1], T.tunggu[1] + 0.2) * (1 - maju(t, kj(6), kj(6) + 0.2))} warna={HDD_W} teks={<>total ±9 + 4,16 = <b>±13 ms</b> · hitungan kami</>} />
      <TeksOL label={['data', 'kepencar']} lMulai={S[6].mulai} judul={[{ t: 'geser', mulai: T.kepencar7 + 0.2 }, { t: '+', mulai: T.kepencar7 + 0.35, warna: OL.abu }, { t: 'nunggu', mulai: T.kepencar7 + 0.5 }, { t: 'lagi', mulai: T.berkali7, warna: HDD_W }]} jMulai={T.kepencar7 + 0.2} keluar={kj(7)} ukuran={92} />
      <ChipKecil x={70} y={336} o={maju(t, S[6].mulai + 0.4, S[6].mulai + 0.6) * (1 - maju(t, kj(7), kj(7) + 0.2))} warna={HDD_W} teks={<>diulang: ×{Math.min(4, Math.max(1, Math.floor((t - S[6].mulai - 0.1) / ((T.berkali7 + 0.5 - S[6].mulai - 0.1) / 4)) + 1))}</>} />
      <TeksOL label={['SSD']} lMulai={S[7].mulai} judul={[{ t: 'chip', mulai: T.chip8 - 0.1 }, { t: 'memori', mulai: T.chip8 + 0.1 }, { t: 'flash', mulai: T.chip8 + 0.4, warna: SSD_W }]} jMulai={T.chip8 - 0.1} keluar={kj(8)} />
      <TeksOL
        label={['rata-rata', 'SSD']}
        lMulai={S[8].mulai}
        judul={[
          { t: '±0,1', mulai: T.nol9, warna: SSD_W },
          { t: 'ms', mulai: T.nol9 + 0.2 },
          { t: '·', mulai: T.seratus9 - 0.2, warna: OL.abu },
          { t: '>100×', mulai: T.seratus9, isi: <SapuSorot mulai={T.seratus9 + 0.3} warna={SSD_W} warnaTeks={[SSD_W, OL.navy0]} penuh>&gt;100×</SapuSorot> },
        ]}
        jMulai={T.nol9}
        keluar={kj(9)}
      />
      <ChipKecil x={70} y={336} o={maju(t, T.seratus9 + 0.3, T.seratus9 + 0.5) * (1 - maju(t, kj(9), kj(9) + 0.2))} warna={OL.emas} teks="lebih cepat (hitungan kami)" />
      <TeksOL label={['syarat', 'minimum']} lMulai={S[9].mulai} judul={[{ t: 'Starfield:', mulai: T.starfield10 }, { t: 'wajib', mulai: T.ssd10 - 0.2 }, { t: 'SSD', mulai: T.ssd10, warna: SSD_W }]} jMulai={T.starfield10} keluar={kj(10)} ukuran={92} />
      <TeksOL label={['simpan', '&', 'follow']} lMulai={S[10].mulai} judul={[{ t: 'buat', mulai: T.simpan + 0.5 }, { t: 'upgrade', mulai: T.simpan + 0.6, warna: OL.emas }, { t: 'nanti', mulai: T.simpan + 0.7 }]} jMulai={T.simpan + 0.5} keluar={T.ctaKeluar} ukuran={92} />
      {sumber ? <ChipKecil x={90} y={1330} o={oSumber} teks={sumber} /> : null}
    </>
  );
};

// ======================================================================================================
function daftarSfx(T: W): Sfx[] {
  const S = T.s;
  const [a, b] = [S[6].mulai + 0.1, T.berkali7 + 0.5];
  const seg = (b - a) / PENCAR.length;
  const lompat = PENCAR.flatMap((_, i) => [bunyi('klik', a + i * seg + 0.05, 0.35), bunyi('tik', a + i * seg + seg * 0.8, 0.35)]);
  const susun = Array.from({ length: 10 }, (_, i) => bunyi('tik', T.dihitung9 + ((T.seratus9 + 0.5 - T.dihitung9) * i) / 10, 0.16));
  return [
    bunyi('whooshTerang', 0.2, 0.35),
    bunyi('riser', 0.3, 0.2),
    bunyi('hantam', T.menit1, 0.4),
    bunyi('whooshA', T.tapi1, 0.35),
    bunyi('pop', T.ssd1, 0.35),
    bunyi('swish', T.gak1, 0.3),
    bunyi('pop', T.gak1 + 0.15, 0.3),
    bunyi('whooshTurun', S[1].mulai, 0.3),
    bunyi('pop', T.piringan2, 0.3),
    bunyi('pop', T.lengan2, 0.3),
    bunyi('pop', T.kepala2, 0.3),
    bunyi('pop', T.motor2, 0.3),
    bunyi('swish', T.jadi3, 0.3),
    bunyi('riser', T.seratus3 - 0.6, 0.2),
    bunyi('kunci', T.detik3 + 0.1, 0.4),
    bunyi('whooshLembut', T.lambat, 0.35),
    bunyi('glitch', T.game4, 0.3),
    bunyi('whooshPop', T.seek[0], 0.3),
    bunyi('klik', T.seek[1], 0.45),
    bunyi('whooshPunch', S[4].mulai, 0.35),
    bunyi('pop', T.seperseribu5, 0.3),
    bunyi('whooshTurun', S[5].mulai, 0.3),
    bunyi('jepret', T.tunggu[1], 0.4),
    ...lompat,
    bunyi('whooshBerat', S[7].mulai, 0.35),
    bunyi('pop', T.chip8, 0.3),
    bunyi('swish', T.mirip8, 0.3),
    bunyi('whooshA', S[8].mulai, 0.3),
    bunyi('pop', S[8].mulai + 0.32, 0.4),
    ...susun,
    bunyi('sapuHit', T.seratus9 + 0.3, 0.35),
    bunyi('whooshPop', S[9].mulai, 0.3),
    bunyi('hantam', T.ssd10 + 0.25, 0.45),
    bunyi('whooshPop', T.simpan, 0.35),
    bunyi('pop', T.simpan + 0.35, 0.35),
    bunyi('whooshPop', T.follow, 0.35),
    bunyi('pop', T.follow + 0.35, 0.35),
    bunyi('whooshLembut', T.pulang, 0.35),
  ];
}

// ======================================================================================================
export const O10Sampul: React.FC = () => (
  <AbsoluteFill style={{ background: OL.navy0, overflow: 'hidden', fontFamily: SAIRA, color: OL.putih }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% 50%, ${OL.navy1} 0%, ${OL.navy0} 75%)` }} />
    <svg style={{ position: 'absolute', left: 0, top: 120, overflow: 'visible' }} width={1} height={1}>
      <rect x={CASE.x} y={CASE.y} width={CASE.w} height={CASE.h} rx={38} fill="#1a2148" stroke={OL.garis} strokeWidth={5} />
      <circle cx={C.x} cy={C.y} r={R + 8} fill="#0d1126" />
      <circle cx={C.x} cy={C.y} r={R} fill="#2b3360" />
      {Array.from({ length: 16 }, (_, i) => (
        <circle key={i} cx={C.x} cy={C.y} r={70 + i * 14.5} fill="none" stroke="#8a94b8" strokeOpacity={0.14} strokeWidth={1.5} />
      ))}
      {[10, 130, 250].map((a) => (
        <path key={a} d={busur(C.x, C.y, R + 26, a, a + 70)} fill="none" stroke={OL.abuTerang} strokeWidth={6} strokeLinecap="round" opacity={0.6} />
      ))}
      <circle cx={C.x} cy={C.y} r={58} fill="#2a3266" />
      <g transform={`rotate(${sudutLengan(230)} ${PV.x} ${PV.y})`}>
        <path d={`M ${PV.x} ${PV.y - 34} L ${PV.x + L_ARM - 30} ${PV.y - 9} L ${PV.x + L_ARM - 30} ${PV.y + 9} L ${PV.x} ${PV.y + 34} Z`} fill="#9aa3c7" />
        <rect x={PV.x + L_ARM - 34} y={PV.y - 13} width={40} height={26} rx={5} fill={OL.emas} />
      </g>
      <circle cx={PV.x} cy={PV.y} r={50} fill="#2a3266" stroke="#5a6496" strokeWidth={5} />
    </svg>
    <div style={{ position: 'absolute', left: 70, top: 190, fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: OL.lime }}>HARDDISK (HDD)</div>
    <div style={{ position: 'absolute', left: 64, top: 250, fontWeight: 800, fontSize: 200, lineHeight: 0.95, color: OL.emas, textShadow: `0 0 40px ${OL.emas}66` }}>7.200×</div>
    <div style={{ position: 'absolute', left: 70, top: 460, fontWeight: 800, fontSize: 92, lineHeight: 1 }}>muter per menit</div>
    <></>
    <div style={{ position: 'absolute', left: 70, top: 1480, fontWeight: 800, fontSize: 80, lineHeight: 1 }}>
      tetap kalah sama <span style={{ color: SSD_W }}>SSD</span>
    </div>
    <GrainOL />
  </AbsoluteFill>
);
