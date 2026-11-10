// Frame hero (pembuka, tengah, puncak): 15, 833, 1388.
// contoh explainer generik O7 (konten contoh): "Ping Jakarta–Los Angeles gak bisa di bawah ±145 ms (batas kecepatan cahaya)".
// SERI generik (seri/seriOL.tsx), aksen O7 = LANGIT (cahaya di fiber); EMAS = paket data & angka; KORAL = jalur asli / delay.
// SATU DUNIA: peta Pasifik (Natural Earth 110m, domain publik; alat/aset_o7.py). Hook: busur Jakarta→LA digambar, paket bolak-balik,
// angka minimal ±145 ms → ping = bolak-balik (HP → server → HP), 1 ms = 1/1.000 detik → jarak ±14.450 km, bolak-balik ±28.900 km →
// potongan kabel fiber di dasar laut, cahaya ±200.000 km/detik → 28.900 ÷ 200.000 = ±145 ms (kalau lurus sempurna) → jalur kabel asli
// berbelok + perangkat jaringan (ilustrasi) → WonderNetwork ±180 ms → zoom Jakarta–Singapura ±12 ms → CTA → loop.
// Fakta: koordinat Wikipedia (jarak lingkaran besar, hitungan kami), kecepatan cahaya di fiber ±200.000 km/dtk, WonderNetwork (19/10/2026).
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { AngkaJalan, Bunyi, Dunia, EASE, GarisDigambar, hitungKamera, maju, pegas, SapuSorot, Stempel, useDetik, type KunciKamera, type Kata, type Sfx } from "../../src/gerak";
import { MONO, SAIRA } from "../../src/gerak/font";
import { bunyi, ChipAngka, ChipKecil, CtaOL, GrainOL, HudSeri, LatarOL, lerp, OL, generikReaksi, ScrimAtas, SubOL, TeksOL, type DataOL, type Kalimat } from "../../src/gerak/seri/neon-grid/seriOL";
import { Batang, cariKata, jendela, Ket, Panel, sfxDasar, sumberDi, waktuDasar } from "../../src/gerak/seri/neon-grid/bantuOL";
import { DARAT, GC_JKT_LA, GC_JKT_SG, KABEL, KOTA, PETA_H, PETA_W } from "./o7/peta";

const AK = OL.langit;
const PAKET = OL.emas;
const ASLI = OL.koral;
const PY = 600; // peta di dunia mulai y
const JKT = { x: KOTA.jakarta[0], y: KOTA.jakarta[1] + PY };
const LA = { x: KOTA.la[0], y: KOTA.la[1] + PY };
const SG = { x: KOTA.singapura[0], y: KOTA.singapura[1] + PY };
const jalurD = (pts: [number, number][], dy = PY) => 'M' + pts.map(([x, y]) => `${x} ${y + dy}`).join(' L');
const D_GC = jalurD(GC_JKT_LA);
const D_GC_BALIK = jalurD([...GC_JKT_LA].reverse().map(([x, y]) => [x, y + 26] as [number, number]));
const D_SG = jalurD(GC_JKT_SG);
const D_KABEL = jalurD(KABEL);

/** titik di sepanjang polyline (0..1) */
function titikDi(pts: [number, number][], p: number, dy = PY) {
  const seg: number[] = [];
  let tot = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    seg.push(l);
    tot += l;
  }
  let sisa = Math.max(0, Math.min(1, p)) * tot;
  for (let i = 0; i < seg.length; i++) {
    if (sisa <= seg[i] || i === seg.length - 1) {
      const q = seg[i] ? sisa / seg[i] : 0;
      return { x: pts[i][0] + (pts[i + 1][0] - pts[i][0]) * q, y: pts[i][1] + (pts[i + 1][1] - pts[i][1]) * q + dy };
    }
    sisa -= seg[i];
  }
  return { x: pts[0][0], y: pts[0][1] + dy };
}

const GABUNG = [
  { kata: ['seratus', 'empat', 'puluh', 'lima', 'milidetik'], jadi: '145 milidetik' },
  { kata: ['satu', 'milidetik'], jadi: '1 milidetik' },
  { kata: ['empat', 'belas', 'ribu', 'empat', 'ratus', 'lima', 'puluh', 'kilometer'], jadi: '14.450 kilometer' },
  { kata: ['dua', 'puluh', 'sembilan', 'ribu', 'kilometer'], jadi: '29.000 kilometer' },
  { kata: ['dua', 'ratus', 'ribu', 'kilometer'], jadi: '200.000 kilometer' },
  { kata: ['seratus', 'delapan', 'puluh', 'milidetik'], jadi: '180 milidetik' },
  { kata: ['dua', 'belas', 'milidetik'], jadi: '12 milidetik' },
];

function waktuO7(d: Kata[], total: number, kal?: Kalimat[]) {
  const CAD: [number, number][] = [
    [0.1, 6.96], [7.36, 13.44], [13.9, 22.04], [22.46, 29.6], [30.0, 36.36], [36.8, 42.72], [43.14, 48.64], [49.04, 52.06], [52.44, 56.62],
  ];
  const B = waktuDasar(kal, CAD, total);
  const s = B.s;
  const k = cariKata(d);
  const seratus1 = k('seratus', s[0].mulai, 3.24);
  const batas1 = k('batas', seratus1, 5.58);
  const cahaya1 = k('cahaya', batas1, 6.4);
  const bolak2 = k('bolak', s[1].mulai, 8.44);
  const perangkat2 = k('perangkat', bolak2, 9.52);
  const server2 = k('server', perangkat2, 10.26);
  const satu2 = k('satu', server2, 11.28);
  const seper2 = k('seperseribu', satu2, 12.44);
  const jakarta3 = k('jakarta', s[2].mulai, 14.84);
  const empat3 = k('empat', jakarta3, 16.6);
  const km3 = k('kilometer', empat3, 18.28);
  const bolak3 = k('bolak', km3, 19.22);
  const km3b = k('kilometer', bolak3, 21.48);
  const kabel4 = k('kabel', s[3].mulai, 23.98);
  const laut4 = k('laut', kabel4, 25.24);
  const sinyal4 = k('sinyal', laut4, 26.1);
  const dua4 = k('dua', sinyal4, 27.94);
  const bolak5 = k('bolak', s[4].mulai, 31.24);
  const seratus5 = k('seratus', bolak5, 32.88);
  const kalau5 = k('kalau', seratus5, 34.72);
  const kabel6 = k('kabel', s[5].mulai, 37.8);
  const perangkat6 = k('perangkat', kabel6, 40.4);
  const delay6 = k('delay', perangkat6, 41.88);
  const wonder7 = k('wondernetwork', s[6].mulai, 43.64);
  const seratus7 = k('seratus', wonder7, 47.22);
  const singapura8 = k('singapura', s[7].mulai, 49.58);
  const dua8 = k('dua', singapura8, 50.98);
  const simpan = k('simpan', s[8].mulai, 52.44);
  const follow = k('follow', simpan, 55.12);
  return {
    ...B, seratus1, batas1, cahaya1, bolak2, perangkat2, server2, satu2, seper2, jakarta3, empat3, km3, bolak3, km3b, kabel4, laut4, sinyal4, dua4,
    bolak5, seratus5, kalau5, kabel6, perangkat6, delay6, wonder7, seratus7, singapura8, dua8, simpan, follow,
    ctaKeluar: Math.max(follow + 0.9, total - 1.75),
  };
}
type W = ReturnType<typeof waktuO7>;

// ======================================================================================================
function kunciKamera(T: W): KunciKamera[] {
  const S = T.s;
  const pelan = Easing.inOut(Easing.sin);
  return [
    { t: 0, x: 540, y: 960, z: 1.0 },
    { t: T.seratus1, x: 540, y: 900, z: 1.05, ease: pelan },
    { t: S[1].mulai, x: 540, y: 960, z: 1.0 },
    { t: S[2].mulai, x: 540, y: 960, z: 1.0, ease: pelan },
    { t: T.km3b, x: 540, y: 960, z: 1.05, ease: pelan },
    { t: S[3].mulai + 0.4, x: 540, y: 960, z: 1.0 },
    { t: S[5].mulai, x: 540, y: 960, z: 1.0, ease: pelan },
    { t: S[5].mulai + 0.6, x: 520, y: 960, z: 1.07 },
    { t: S[6].mulai - 0.1, x: 520, y: 960, z: 1.09, ease: pelan },
    { t: S[6].mulai + 0.5, x: 540, y: 960, z: 1.0 },
    { t: S[7].mulai, x: 540, y: 960, z: 1.0, ease: pelan },
    { t: S[7].mulai + 0.8, x: 260, y: 930, z: 2.3 },
    { t: S[8].mulai - 0.1, x: 260, y: 930, z: 2.4, ease: pelan },
    { t: S[8].mulai + 0.6, x: 540, y: 960, z: 1.0 },
    { t: T.pulang, x: 540, y: 958, z: 1.02, ease: pelan },
    { t: T.loop, x: 540, y: 960, z: 1.0, ease: pelan },
  ];
}

export const ContohPing: React.FC<DataOL> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuO7(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const kunci = useMemo(() => kunciKamera(T), [T]);
  const S = T.s;
  const kam = hitungKamera(kunci, t, fps, {
    drift: 2.2 * (1 - maju(t, T.pulang, T.loop)) * maju(t, 0, 0.6),
    getar: [
      { t: T.seratus1 + 0.8, kuat: 7 },
      { t: T.km3b + 0.2, kuat: 5 },
      { t: T.seratus5 + 0.9, kuat: 7 },
      { t: T.seratus7 + 0.8, kuat: 6 },
      { t: T.dua8 + 0.5, kuat: 5 },
    ],
  });
  return (
    <AbsoluteFill style={{ background: OL.navy0, color: OL.putih, overflow: 'hidden', fontFamily: SAIRA }}>
      <LatarOL kam={kam} aksen={AK} />
      <Dunia kamera={kam} tinggiDunia={1920} lebarDunia={1080} blurGerak={null}>
        <Peta T={T} />
      </Dunia>
      <Fiber T={T} />
      <Rumus T={T} />
      <BandingMs T={T} />
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
const Kota: React.FC<{ x: number; y: number; nama: string; o?: number; kanan?: boolean; warna?: string; s?: number }> = ({ x, y, nama, o = 1, kanan = true, warna = OL.putih, s = 1 }) =>
  o <= 0.001 ? null : (
    <g opacity={o}>
      <circle cx={x} cy={y} r={16 * s} fill="none" stroke={warna} strokeWidth={3 * s} opacity={0.6} />
      <circle cx={x} cy={y} r={8 * s} fill={warna} />
      <text x={kanan ? x + 24 * s : x - 24 * s} y={y + 12 * s} textAnchor={kanan ? 'start' : 'end'} fontFamily={SAIRA} fontWeight={800} fontSize={40 * s} fill={warna} stroke={OL.navy0} strokeWidth={6 * s} paintOrder="stroke">
        {nama}
      </text>
    </g>
  );

// Peta (dunia) dengan semua lapisan jalur
const Peta: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  // redup pas panel nutup (S4, S5 rumus, S7 banding)
  const redup = Math.max(
    maju(t, S[3].mulai - 0.1, S[3].mulai + 0.3) * (1 - maju(t, S[4].mulai - 0.1, S[4].mulai + 0.3)),
    maju(t, S[6].mulai - 0.1, S[6].mulai + 0.3) * (1 - maju(t, S[7].mulai - 0.1, S[7].mulai + 0.3)),
  );
  const akhir = t > T.pulang - 0.6;
  // busur GC: S1 digambar; tetap sampai S6 (diganti jalur asli), balik di S7/loop
  const gcO = akhir ? 0 : 1 - 0.7 * maju(t, T.kabel6 - 0.2, T.kabel6 + 0.3) * (1 - maju(t, S[6].mulai, S[6].mulai + 0.3));
  // paket bolak-balik: S1 (hook), S2 (bolak-balik pelan), S5 (timer)
  const paket = (() => {
    const lingkar = (a: number, b: number) => {
      if (t < a || t > b) return null;
      const p = (t - a) / (b - a);
      return p < 0.5 ? titikDi(GC_JKT_LA, p * 2) : titikDi(GC_JKT_LA, 2 - p * 2);
    };
    return lingkar(1.6, T.seratus1 + 0.8) ?? lingkar(T.bolak2 - 0.1, T.server2 + 0.9) ?? lingkar(T.bolak5 - 0.2, T.seratus5 + 0.9) ?? lingkar(T.seratus5 + 0.9, S[5].mulai + 0.1) ?? null;
  })();
  // paket di jalur asli (S6, muter terus) & Jakarta↔Singapura (S8, bolak-balik cepat)
  const paket2 = (() => {
    if (t > T.kabel6 + 0.6 && t < S[6].mulai) {
      const q = ((t - T.kabel6 - 0.6) / 2.2) % 1;
      return { ...titikDi(KABEL, q), w: ASLI };
    }
    if (t > T.singapura8 + 0.2 && t < S[8].mulai) {
      const q = ((t - T.singapura8 - 0.2) / 0.8) % 1;
      const pp = q < 0.5 ? titikDi(GC_JKT_SG, q * 2) : titikDi(GC_JKT_SG, 2 - q * 2);
      return { ...pp, w: OL.lime };
    }
    return null;
  })();
  // jarak (S3): titik jalan sepanjang busur, balik di busur kedua
  const jalan3 = maju(t, T.empat3 - 0.3, T.km3 + 0.2, EASE.kamera);
  const balik3 = maju(t, T.bolak3 - 0.1, T.km3b + 0.3, EASE.kamera);
  const tampil3 = t > S[2].mulai - 0.2 && t < S[4].mulai + 0.2 && !akhir;
  // jalur asli (S6)
  const asli = t > S[5].mulai - 0.2 && t < S[7].mulai + 0.2;
  const ruter = [3, 7, 10, 13, 16];
  // Singapura (S8)
  const sg = t > S[7].mulai - 0.2 && t < S[8].mulai + 0.4;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: 1 - 0.75 * redup }}>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1080} height={1920}>
        <defs>
          <clipPath id="o7-klip">
            <rect x={-200} y={PY} width={PETA_W + 400} height={PETA_H} />
          </clipPath>
          <linearGradient id="o7-laut" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f1838" />
            <stop offset="100%" stopColor="#0b1430" />
          </linearGradient>
        </defs>
        <rect x={-200} y={PY} width={PETA_W + 400} height={PETA_H} fill="url(#o7-laut)" />
        {/* garis lintang/bujur */}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`b${i}`} x1={i * 124} y1={PY} x2={i * 124} y2={PY + PETA_H} stroke={OL.lime} strokeOpacity={0.08} strokeWidth={2} />
        ))}
        {Array.from({ length: 4 }, (_, i) => (
          <line key={`l${i}`} x1={-200} y1={PY + (i + 1) * (PETA_H / 5)} x2={1280} y2={PY + (i + 1) * (PETA_H / 5)} stroke={OL.lime} strokeOpacity={0.08} strokeWidth={2} />
        ))}
        <g clipPath="url(#o7-klip)">
          <g transform={`translate(0 ${PY})`}>
            {DARAT.map((p, i) => (
              <path key={i} d={p} fill="#26315f" stroke="#3a4677" strokeWidth={2} />
            ))}
          </g>
        </g>
        <line x1={-200} y1={PY} x2={1280} y2={PY} stroke={OL.garis} strokeWidth={3} />
        <line x1={-200} y1={PY + PETA_H} x2={1280} y2={PY + PETA_H} stroke={OL.garis} strokeWidth={3} />
        {/* busur lingkaran besar Jakarta → LA */}
        {gcO > 0 ? <GarisDigambar d={D_GC} mulai={0.3} lama={1.2} warna={AK} tebal={7} opacity={gcO} /> : null}
        {akhir ? <path d={D_GC} fill="none" stroke={AK} strokeWidth={7} opacity={maju(t, T.pulang - 0.5, T.pulang) * (1 - maju(t, T.total - 0.6, T.total - 0.05))} /> : null}
        {/* S3: busur balik */}
        {tampil3 && t > T.bolak3 - 0.2 ? <GarisDigambar d={D_GC_BALIK} mulai={T.bolak3 - 0.1} lama={1.2} warna={PAKET} tebal={5} opacity={1 - maju(t, S[4].mulai - 0.2, S[4].mulai + 0.2)} /> : null}
        {/* S6: jalur kabel asli (ilustrasi) + perangkat jaringan */}
        {asli ? (
          <>
            <GarisDigambar d={D_KABEL} mulai={T.kabel6 - 0.3} lama={1.0} warna={ASLI} tebal={7} opacity={1 - maju(t, S[7].mulai - 0.2, S[7].mulai + 0.2)} />
            {ruter.map((i, n) => {
              const [x, y] = KABEL[i];
              const p = maju(t, T.perangkat6 - 0.2 + n * 0.12, T.perangkat6 + n * 0.12);
              return p > 0 ? (
                <g key={i} opacity={p * (1 - maju(t, S[7].mulai - 0.2, S[7].mulai + 0.2))}>
                  <rect x={x - 16} y={y + PY - 16} width={32} height={32} rx={6} fill={OL.navy0} stroke={ASLI} strokeWidth={4} />
                  <circle cx={x} cy={y + PY} r={5} fill={ASLI} />
                </g>
              ) : null;
            })}
          </>
        ) : null}
        {/* S8: Jakarta → Singapura */}
        {sg ? <GarisDigambar d={D_SG} mulai={T.singapura8 - 0.1} lama={0.4} warna={OL.lime} tebal={4} opacity={1 - maju(t, S[8].mulai, S[8].mulai + 0.3)} /> : null}
        <Kota x={JKT.x} y={JKT.y} nama="Jakarta" s={sg ? 0.5 : 1} />
        <Kota x={LA.x} y={LA.y} nama="Los Angeles" kanan={false} />
        {sg ? <Kota x={SG.x} y={SG.y} nama="Singapura" s={0.5} warna={OL.lime} o={maju(t, T.singapura8 - 0.2, T.singapura8 + 0.1)} /> : null}
        {/* paket data */}
        {paket ? (
          <g>
            <circle cx={paket.x} cy={paket.y} r={26} fill={PAKET} opacity={0.25} />
            <circle cx={paket.x} cy={paket.y} r={13} fill={PAKET} />
          </g>
        ) : null}
        {paket2 ? (
          <g>
            <circle cx={paket2.x} cy={paket2.y} r={sg ? 12 : 24} fill={paket2.w} opacity={0.3} />
            <circle cx={paket2.x} cy={paket2.y} r={sg ? 6 : 12} fill={paket2.w} />
          </g>
        ) : null}
        {/* S3: titik ukur jarak */}
        {tampil3 && jalan3 > 0 && balik3 <= 0 ? (() => {
          const q = titikDi(GC_JKT_LA, jalan3);
          return <circle cx={q.x} cy={q.y} r={12} fill={OL.putih} />;
        })() : null}
      </svg>
      {/* S2: ikon HP (Jakarta) & server (LA) */}
      <IkonUjung T={T} />
      {/* angka di peta */}
      <AngkaPeta T={T} jalan3={jalan3} balik3={balik3} tampil3={tampil3} />
    </div>
  );
};

const IkonUjung: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const o1 = maju(t, T.perangkat2 - 0.2, T.perangkat2 + 0.2) * (1 - maju(t, S[2].mulai - 0.2, S[2].mulai + 0.2));
  const o2 = maju(t, T.server2 - 0.2, T.server2 + 0.2) * (1 - maju(t, S[2].mulai - 0.2, S[2].mulai + 0.2));
  return (
    <>
      {o1 > 0 ? (
        <div style={{ position: 'absolute', left: JKT.x + 30, top: JKT.y + 30, opacity: o1, translate: `0 ${(1 - o1) * 20}px` }}>
          <div style={{ width: 70, height: 120, borderRadius: 14, border: `5px solid ${OL.putih}`, background: OL.navy0, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 8, right: 8, top: 12, bottom: 22, borderRadius: 4, background: AK, opacity: 0.6 }} />
          </div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, color: OL.putih, whiteSpace: 'nowrap', marginTop: 6 }}>perangkat kamu</div>
        </div>
      ) : null}
      {o2 > 0 ? (
        <div style={{ position: 'absolute', left: LA.x - 150, top: LA.y + 40, opacity: o2, translate: `0 ${(1 - o2) * 20}px` }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 130, height: 34, borderRadius: 6, border: `4px solid ${OL.putih}`, background: OL.navy0, marginBottom: 6, position: 'relative' }}>
              <div style={{ position: 'absolute', right: 10, top: 9, width: 10, height: 10, borderRadius: 5, background: OL.lime }} />
            </div>
          ))}
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, color: OL.putih }}>server</div>
        </div>
      ) : null}
    </>
  );
};

const AngkaPeta: React.FC<{ T: W; jalan3: number; balik3: number; tampil3: boolean }> = ({ T, jalan3, balik3, tampil3 }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const out: React.ReactNode[] = [];
  // S1: minimal ±145 ms
  const o1 = maju(t, T.seratus1 - 0.1, T.seratus1 + 0.3) * (1 - maju(t, S[1].mulai - 0.2, S[1].mulai + 0.1));
  if (o1 > 0) {
    const hit = pegas(t, T.seratus1 + 0.8, fps, { damping: 9, stiffness: 200, mass: 0.5 });
    out.push(<ChipAngka key="a1" x={540} y={PY + PETA_H + 80} o={o1} ukuran={80} warna={PAKET} skala={1 + 0.08 * Math.sin(Math.min(1, hit) * Math.PI)} isi={<>≥ ±<AngkaJalan dari={0} ke={145} progress={maju(t, T.seratus1 - 0.1, T.seratus1 + 0.8, EASE.kamera)} /> ms</>} />);
    out.push(<ChipKecil key="c1" x={540} y={PY + PETA_H + 150} rata="tengah" o={maju(t, T.batas1 - 0.1, T.batas1 + 0.2) * o1} warna={AK} teks="⚡ batas kecepatan cahaya" />);
  }
  // S2: bolak-balik + 1 ms
  const o2 = maju(t, T.bolak2 - 0.1, T.bolak2 + 0.2) * (1 - maju(t, S[2].mulai - 0.2, S[2].mulai + 0.1));
  if (o2 > 0) {
    out.push(<ChipAngka key="a2" x={540} y={PY + 80} o={o2} ukuran={48} warna={PAKET} isi="ping = pergi + balik" />);
    out.push(<ChipAngka key="a2b" x={540} y={PY + PETA_H + 80} o={maju(t, T.satu2 - 0.1, T.satu2 + 0.2) * o2} ukuran={60} warna={OL.putih} isi={<>1 ms = <span style={{ color: PAKET }}>1/1.000</span> detik</>} />);
  }
  // S3: jarak
  if (tampil3) {
    const o3 = maju(t, T.empat3 - 0.3, T.empat3) * (1 - maju(t, S[3].mulai - 0.2, S[3].mulai + 0.1));
    const km = 14450 * jalan3 + 14450 * balik3;
    out.push(
      <div key="a3" style={{ position: 'absolute', left: 540, top: PY + PETA_H + 36, translate: '-50% 0', opacity: o3, textAlign: 'center' }}>
        <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 88, lineHeight: 1, color: balik3 > 0 ? PAKET : OL.putih, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
          ±<AngkaJalan dari={0} ke={balik3 > 0 ? 28900 : 14450} progress={balik3 > 0 ? km / 28900 : jalan3} /> km
        </div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: OL.abuTerang, marginTop: 8 }}>{balik3 > 0 ? 'bolak-balik' : 'jarak garis lurus (hitungan kami)'}</div>
      </div>,
    );
  }
  // S6: jalur asli lebih panjang
  const o6 = maju(t, T.kabel6, T.kabel6 + 0.3) * (1 - maju(t, S[6].mulai - 0.2, S[6].mulai + 0.1));
  if (o6 > 0) {
    out.push(<ChipAngka key="a6" x={540} y={PY + PETA_H + 70} o={o6} ukuran={56} warna={ASLI} isi="jalur asli lebih panjang" />);
    const d = maju(t, T.delay6 - 0.1, T.delay6 + 0.3);
    if (d > 0) out.push(<ChipKecil key="c6" x={540} y={PY + PETA_H + 140} rata="tengah" o={d * o6} warna={ASLI} teks="+ delay di tiap perangkat jaringan (ilustrasi)" />);
  }
  // S8: Singapura ±12 ms
  const o8 = maju(t, T.dua8 - 0.1, T.dua8 + 0.3) * (1 - maju(t, S[8].mulai - 0.1, S[8].mulai + 0.2));
  if (o8 > 0) out.push(<ChipAngka key="a8" x={JKT.x + 150} y={(JKT.y + SG.y) / 2 - 20} o={o8} ukuran={30} warna={OL.lime} isi="±12 ms" />);
  return <>{out}</>;
};

// S4: kabel fiber di dasar laut, cahaya ±200.000 km/detik
const Fiber: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const { m, k } = jendela(t, S[3].mulai, S[4].mulai);
  const kabelP = maju(t, T.kabel4 - 0.2, T.laut4 + 0.3, EASE.kamera);
  const sinyal = maju(t, T.sinyal4 - 0.1, T.sinyal4 + 0.2);
  const ang = maju(t, T.dua4 - 0.3, T.dua4 + 0.8, EASE.kamera);
  return (
    <Panel x={70} y={560} w={940} h={700} m={m} k={k} judul="kabel fiber optik · dasar laut" warna={AK}>
      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={940} height={700}>
        <defs>
          <linearGradient id="o7-air" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#123a6a" />
            <stop offset="100%" stopColor="#081428" />
          </linearGradient>
        </defs>
        <rect x={0} y={80} width={940} height={440} fill="url(#o7-air)" />
        {/* gelombang permukaan */}
        <path d={`M 0 ${96 + 6 * Math.sin(t * 2)} ${Array.from({ length: 20 }, (_, i) => `Q ${i * 47 + 23} ${86 + 8 * Math.sin(t * 2 + i)} ${(i + 1) * 47} ${96 + 6 * Math.sin(t * 2 + i + 1)}`).join(' ')}`} fill="none" stroke={AK} strokeWidth={3} opacity={0.5} />
        {/* dasar laut */}
        <path d="M 0 440 Q 120 420 240 445 T 480 440 T 720 448 T 940 436 L 940 520 L 0 520 Z" fill="#1d2244" />
        {/* kabel */}
        <line x1={0} y1={432} x2={940 * kabelP} y2={432} stroke="#4a5590" strokeWidth={22} strokeLinecap="round" />
        <line x1={0} y1={432} x2={940 * kabelP} y2={432} stroke={AK} strokeWidth={6} strokeLinecap="round" opacity={0.5 + 0.5 * sinyal} />
        {/* pulsa cahaya */}
        {kabelP > 0.95
          ? Array.from({ length: 5 }, (_, i) => {
              const x = ((t * 1400 + i * 200) % 1100) - 80;
              return <rect key={i} x={x} y={426} width={90} height={12} rx={6} fill="#e8fbff" opacity={0.35 + 0.65 * sinyal} />;
            })
          : null}
        {/* potongan melintang kabel */}
        <g transform={`translate(150 255) scale(${1 + 0.03 * Math.sin(t * 4)})`} opacity={kabelP}>
          <circle r={90} fill="#2a3266" stroke="#5a6496" strokeWidth={6} />
          <circle r={62} fill="#1a2148" />
          <circle r={34} fill="#3a4677" />
          <circle r={12} fill={AK} opacity={0.6 + 0.4 * sinyal} />
          <circle r={24} fill={AK} opacity={0.25 * sinyal} />
        </g>
        <text x={260} y={250} fontFamily={MONO} fontWeight={800} fontSize={28} fill={OL.abuTerang} opacity={kabelP}>
          inti kaca: jalur cahaya
        </text>
      </svg>
      <div style={{ position: 'absolute', left: 40, top: 560, opacity: ang, fontFamily: SAIRA, fontWeight: 800, fontSize: 92, lineHeight: 1, color: AK, whiteSpace: 'nowrap' }}>
        ±<AngkaJalan dari={0} ke={200000} progress={ang} /> <span style={{ fontSize: 52, color: OL.putih }}>km/detik</span>
      </div>
    </Panel>
  );
};

// S5: 28.900 ÷ 200.000 = 0,1445 detik ≈ ±145 ms (timer diikat ke paket di peta)
const Rumus: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const { m, k, o } = jendela(t, S[4].mulai, S[5].mulai);
  if (o <= 0.001) return null;
  const p = maju(t, T.bolak5 - 0.2, T.seratus5 + 0.9, EASE.linear);
  const hit = pegas(t, T.seratus5 + 0.9, fps, { damping: 9, stiffness: 200, mass: 0.5 });
  const lurus = maju(t, T.kalau5 - 0.1, T.kalau5 + 0.3);
  return (
    <div style={{ position: 'absolute', left: 70, top: 1110 + (1 - m) * 40 + k * 20, width: 940, height: 200, borderRadius: 24, background: `${OL.navy0}f0`, border: `3px solid ${OL.garis}`, opacity: o }}>
      <div style={{ position: 'absolute', left: 30, top: 22, fontFamily: MONO, fontWeight: 800, fontSize: 34, color: OL.abuTerang, whiteSpace: 'nowrap' }}>
        28.900 km ÷ 200.000 km/dtk
      </div>
      <div style={{ position: 'absolute', left: 30, top: 74, fontFamily: SAIRA, fontWeight: 800, fontSize: 100, lineHeight: 1, color: PAKET, whiteSpace: 'nowrap', scale: String(1 + 0.06 * Math.sin(Math.min(1, hit) * Math.PI)), transformOrigin: '0 50%', fontVariantNumeric: 'tabular-nums' }}>
        = ±<AngkaJalan dari={0} ke={145} progress={p} /> ms
      </div>
      {lurus > 0 ? (
        <div style={{ position: 'absolute', left: 560, top: 96, opacity: lurus, padding: '6px 16px', borderRadius: 12, border: `3px solid ${AK}`, fontFamily: SAIRA, fontWeight: 800, fontSize: 40, color: AK, whiteSpace: 'nowrap' }}>kalau kabelnya lurus</div>
      ) : null}
    </div>
  );
};

// S7: teori ±145 ms vs asli ±180 ms (WonderNetwork); S8 tambah Singapura ±12 ms
const BandingMs: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const { m, k } = jendela(t, S[6].mulai, S[7].mulai);
  const p145 = maju(t, S[6].mulai + 0.2, S[6].mulai + 0.8, EASE.kamera);
  const p180 = maju(t, T.seratus7 - 0.2, T.seratus7 + 0.8, EASE.kamera);
  const hit = pegas(t, T.seratus7 + 0.8, fps, { damping: 9, stiffness: 200, mass: 0.5 });
  const L = 680;
  return (
    <Panel x={70} y={600} w={940} h={600} m={m} k={k} judul="ping jakarta → los angeles" warna={ASLI}>
      <Batang x={40} y={170} w={L} h={90} p={(145 / 180) * p145} warna={AK} label="batas teori (hitungan kami)" nilai={<>±<AngkaJalan dari={0} ke={145} progress={p145} /> ms</>} ukuranLabel={38} />
      <Batang x={40} y={390} w={L} h={90} p={p180} warna={ASLI} label="terukur (WonderNetwork)" nilai={<span style={{ display: 'inline-block', scale: String(1 + 0.1 * Math.sin(Math.min(1, hit) * Math.PI)) }}>±<AngkaJalan dari={0} ke={180} progress={p180} /> ms</span>} ukuranLabel={38} />
    </Panel>
  );
};

// ======================================================================================================
const Teks: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const kj = (n: number) => S[n].mulai - 0.22;
  const sumber = sumberDi(t, S, [
    [0, 'hitungan kami · peta: Natural Earth (domain publik)'],
    [1, null],
    [2, 'hitungan kami dari koordinat Wikipedia'],
    [3, 'cahaya di fiber ±2/3 kecepatan cahaya · ilustrasi'],
    [4, 'hitungan kami: 28.900 ÷ 200.000 = 0,1445 detik'],
    [5, 'jalur kabel & perangkat: ilustrasi, bukan rute asli'],
    [6, 'Sumber: WonderNetwork (diukur 19/10/2026)'],
    [8, null],
  ]);
  const oSumber = maju(t, 1.4, 1.7) * (1 - maju(t, S[8].mulai - 0.2, S[8].mulai));
  return (
    <>
      <TeksOL label={['ping', 'jakarta', '→', 'LA']} lMulai={0.12} judul={[{ t: 'minimal', mulai: 0.25 }, { t: '±145', mulai: T.seratus1, warna: PAKET }, { t: 'ms', mulai: T.seratus1 + 0.3 }]} jMulai={0.25} keluar={kj(1)} ukuran={104} />
      <ChipKecil x={70} y={336} o={maju(t, T.seratus1 + 0.6, T.seratus1 + 0.9) * (1 - maju(t, kj(1), kj(1) + 0.2))} warna={PAKET} teks="hitungan kami" />
      <TeksOL label={['ping']} lMulai={S[1].mulai} judul={[{ t: 'waktu', mulai: S[1].mulai + 0.3 }, { t: 'bolak-balik', mulai: T.bolak2, warna: PAKET }, { t: 'data', mulai: T.bolak2 + 0.4 }]} jMulai={S[1].mulai + 0.3} keluar={kj(2)} ukuran={92} />
      <TeksOL label={['jarak', 'garis', 'lurus']} lMulai={S[2].mulai} judul={[{ t: '±14.450', mulai: T.empat3, warna: OL.putih }, { t: 'km', mulai: T.empat3 + 0.2 }, { t: '→', mulai: T.bolak3, warna: OL.abu }, { t: '±28.900', mulai: T.bolak3 + 0.2, warna: PAKET }, { t: 'km', mulai: T.bolak3 + 0.4 }]} jMulai={T.empat3} keluar={kj(3)} ukuran={82} />
      <TeksOL label={['internet', 'antarbenua']} lMulai={S[3].mulai} judul={[{ t: 'fiber:', mulai: T.kabel4 + 0.2, warna: AK }, { t: '±200.000', mulai: T.dua4, warna: OL.emas }, { t: 'km/detik', mulai: T.dua4 + 0.3 }]} jMulai={T.kabel4 + 0.2} keluar={kj(4)} ukuran={84} />
      <TeksOL label={['batas', 'teori']} lMulai={S[4].mulai} judul={[{ t: '28.900', mulai: T.bolak5 }, { t: '÷', mulai: T.bolak5 + 0.2, warna: OL.abu }, { t: '200.000', mulai: T.bolak5 + 0.4 }, { t: '=', mulai: T.seratus5 - 0.2, warna: OL.abu }, { t: '±145', mulai: T.seratus5, warna: PAKET }, { t: 'ms', mulai: T.seratus5 + 0.3 }]} jMulai={T.bolak5} keluar={kj(5)} ukuran={76} />
      <TeksOL label={['aslinya']} lMulai={S[5].mulai} judul={[{ t: 'jalur', mulai: T.kabel6 - 0.3 }, { t: 'asli', mulai: T.kabel6 - 0.1, warna: ASLI }, { t: 'lebih', mulai: T.kabel6 + 0.2 }, { t: 'panjang', mulai: T.kabel6 + 0.4 }]} jMulai={T.kabel6 - 0.3} keluar={kj(6)} ukuran={92} />
      <TeksOL label={['wondernetwork']} lMulai={S[6].mulai} judul={[{ t: 'Jakarta–LA', mulai: S[6].mulai + 0.3 }, { t: 'asli:', mulai: S[6].mulai + 0.5 }, { t: '±180', mulai: T.seratus7, warna: ASLI }, { t: 'ms', mulai: T.seratus7 + 0.3 }]} jMulai={S[6].mulai + 0.3} keluar={kj(7)} ukuran={84} />
      <TeksOL label={['sementara']} lMulai={S[7].mulai} judul={[{ t: 'Jakarta–Singapura:', mulai: T.singapura8 - 0.2 }, { t: '±12', mulai: T.dua8, warna: OL.lime }, { t: 'ms', mulai: T.dua8 + 0.2 }]} jMulai={T.singapura8 - 0.2} keluar={kj(8)} ukuran={80} />
      <TeksOL label={['simpan', '&', 'follow']} lMulai={S[8].mulai} judul={[{ t: 'buat', mulai: T.simpan + 0.5 }, { t: 'pas', mulai: T.simpan + 0.6 }, { t: 'milih', mulai: T.simpan + 0.7 }, { t: 'server', mulai: T.simpan + 0.85, warna: OL.emas }]} jMulai={T.simpan + 0.5} keluar={T.ctaKeluar} ukuran={92} />
      {sumber ? <ChipKecil x={90} y={1330} o={oSumber} teks={sumber} /> : null}
    </>
  );
};

// ======================================================================================================
function daftarSfx(T: W): Sfx[] {
  const S = T.s;
  return [
    ...sfxDasar(S, T.simpan, T.follow, T.pulang),
    bunyi('swish', 0.4, 0.3),
    bunyi('klik', 1.6 + (T.seratus1 + 0.8 - 1.6) / 2, 0.35),
    bunyi('kunci', T.seratus1 + 0.8, 0.4),
    bunyi('whooshTerang', T.batas1, 0.3),
    bunyi('pop', T.perangkat2, 0.3),
    bunyi('pop', T.server2, 0.3),
    bunyi('pop', T.satu2, 0.3),
    bunyi('riser', T.empat3 - 0.5, 0.2),
    bunyi('kunci', T.km3 + 0.2, 0.35),
    bunyi('swish', T.bolak3, 0.3),
    bunyi('kunci', T.km3b + 0.3, 0.35),
    bunyi('whooshTurun', T.kabel4, 0.3),
    bunyi('swish', T.sinyal4, 0.3),
    bunyi('riser', T.dua4 - 0.4, 0.2),
    bunyi('kunci', T.dua4 + 0.8, 0.35),
    bunyi('klik', T.bolak5 - 0.2 + (T.seratus5 + 1.1 - T.bolak5) / 2, 0.35),
    bunyi('hantam', T.seratus5 + 0.9, 0.4),
    bunyi('pop', T.kalau5, 0.3),
    bunyi('whooshBerat', T.kabel6 - 0.3, 0.3),
    ...[0, 1, 2, 3, 4].map((n) => bunyi('tik', T.perangkat6 + n * 0.12, 0.3)),
    bunyi('glitch', T.delay6, 0.3),
    bunyi('riser', T.seratus7 - 0.5, 0.2),
    bunyi('hantam', T.seratus7 + 0.8, 0.4),
    bunyi('whooshPunch', S[7].mulai + 0.2, 0.3),
    bunyi('pop', T.dua8, 0.35),
  ];
}

// ======================================================================================================
export const O7Sampul: React.FC = () => (
  <AbsoluteFill style={{ background: OL.navy0, overflow: 'hidden', fontFamily: SAIRA, color: OL.putih }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% 50%, ${OL.navy1} 0%, ${OL.navy0} 75%)` }} />
    <svg style={{ position: 'absolute', left: 0, top: 160, overflow: 'visible' }} width={1080} height={1920}>
      <g transform={`translate(0 ${PY})`}>
        {DARAT.map((p, i) => (
          <path key={i} d={p} fill="#26315f" stroke="#3a4677" strokeWidth={2} />
        ))}
      </g>
      <path d={D_GC} fill="none" stroke={AK} strokeWidth={8} />
      <circle cx={JKT.x} cy={JKT.y} r={10} fill={OL.putih} />
      <circle cx={LA.x} cy={LA.y} r={10} fill={OL.putih} />
      {(() => {
        const q = titikDi(GC_JKT_LA, 0.55);
        return <circle cx={q.x} cy={q.y} r={16} fill={PAKET} />;
      })()}
    </svg>
    <div style={{ position: 'absolute', left: 70, top: 190, fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: OL.lime }}>PING JAKARTA → LOS ANGELES</div>
    <div style={{ position: 'absolute', left: 64, top: 250, fontWeight: 800, fontSize: 200, lineHeight: 0.95, color: PAKET, textShadow: `0 0 40px ${PAKET}66` }}>±145 ms</div>
    <div style={{ position: 'absolute', left: 70, top: 460, fontWeight: 800, fontSize: 84, lineHeight: 1 }}>paling cepet</div>
    <></>
    <div style={{ position: 'absolute', left: 70, top: 1400, fontWeight: 800, fontSize: 76, lineHeight: 1.05 }}>
      batasnya <span style={{ color: AK }}>kecepatan cahaya</span>
    </div>
    <GrainOL />
  </AbsoluteFill>
);
