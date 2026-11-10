// Objek DUNIA explainer 475 ribu tahun. Sabuk token = objek pemandu yang jalan terus (gak ada frame beku). Tiap stasiun di
// atas sabuk; semua garis digambar, semua angka diikat ke gerak benda yang sama.
import React from 'react';
import { random, useVideoConfig } from 'remotion';
import { AngkaJalan, EASE, GarisDigambar, maju, noise, pathPanah, pegas, Pop, Squash, useDetik, type Kamera } from "../../../src/gerak";
import { MONO, SAIRA, TANGAN } from "../../../src/gerak/font";
import { K } from "../raja/gaya";
import { LAJU, SABUK_Y, TOKEN_SABUK, X } from "./dunia";
import type { WaktuL } from "./waktuLlama";

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const Svg: React.FC<{ children: React.ReactNode; o?: number }> = ({ children, o = 1 }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: o }} width={1} height={1}>
    {children}
  </svg>
);
const ada = (t: number, a: number, b: number) => t > a && t < b;

/** balok token kecil */
export const Balok: React.FC<{ x: number; y: number; teks?: string; w?: number; h?: number; warna?: string; isi?: string; o?: number; rot?: number; skala?: number; fs?: number }> = ({
  x, y, teks, w = 64, h = 56, warna = '#2c4068', isi = '#13213d', o = 1, rot = 0, skala = 1, fs = 22,
}) => (
  <div style={{ position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: 10, background: isi, border: `3px solid ${warna}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 700, fontSize: fs, color: warna === '#2c4068' ? '#8fa6c4' : warna, opacity: o, rotate: `${rot}deg`, scale: String(skala), whiteSpace: 'nowrap', overflow: 'hidden' }}>
    {teks}
  </div>
);

// ======================================================================================================
// SABUK: rel + roda + balok token yang jalan ke kanan (cuma yang kelihatan kamera yang dirender)
export const Sabuk: React.FC<{ kam: Kamera }> = ({ kam }) => {
  const t = useDetik();
  const x0 = kam.x - kam.lebar / 2 / kam.z - 100;
  const x1 = kam.x + kam.lebar / 2 / kam.z + 100;
  const geser = t * LAJU;
  const P = 80;
  const kMin = Math.floor((x0 - geser) / P);
  const kMax = Math.ceil((x1 - geser) / P);
  const jauh = kam.z < 0.2;
  const balok: React.ReactNode[] = [];
  for (let k = kMin; k <= kMax; k++) {
    const x = k * P + geser;
    if (x < -800 || x > 26600) continue;
    const r = random(`sb${k}`);
    const nyala = r < 0.1;
    if (jauh) {
      balok.push(<div key={k} style={{ position: 'absolute', left: x - 28, top: SABUK_Y - 26, width: 56, height: 52, borderRadius: 8, background: nyala ? K.teal : '#2c4068' }} />);
    } else {
      balok.push(<Balok key={k} x={x} y={SABUK_Y - 2} w={64} h={52} teks={TOKEN_SABUK[((k % TOKEN_SABUK.length) + TOKEN_SABUK.length) % TOKEN_SABUK.length]} warna={nyala ? K.teal : '#2c4068'} />);
    }
  }
  // roda tiap 240 px, muter sesuai laju
  const roda: React.ReactNode[] = [];
  if (!jauh) {
    for (let x = Math.floor(x0 / 240) * 240; x < x1; x += 240) {
      const sudut = ((t * LAJU) / (2 * Math.PI * 18)) * 360;
      roda.push(
        <g key={x} transform={`translate(${x} ${SABUK_Y + 48}) rotate(${sudut})`}>
          <circle r={18} fill={K.latar} stroke="#2c4068" strokeWidth={4} />
          <line x1={-12} y1={0} x2={12} y2={0} stroke="#2c4068" strokeWidth={4} />
        </g>,
      );
    }
  }
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <line x1={-800} y1={SABUK_Y + 32} x2={26600} y2={SABUK_Y + 32} stroke="#2c4068" strokeWidth={6} />
        <line x1={-800} y1={SABUK_Y + 68} x2={26600} y2={SABUK_Y + 68} stroke="#1c2b4a" strokeWidth={4} />
        {roda}
      </svg>
      {balok}
    </>
  );
};

// ======================================================================================================
// A: kotak model Llama 3, hujan token masuk (S1). Hitungan token naik eksponensial, diikat ke derasnya hujan.
export function progresHujan(t: number, T: WaktuL) {
  return maju(t, 0.12, T.token1 - 0.15, EASE.linear);
}
const KOTAK_A = { x: X.A + 120, y: 2080, w: 420, h: 240 };
export const StasiunA: React.FC<{ T: WaktuL }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const N = 90;
  const akhir = T.s[1].mulai + 0.4;
  const pop = pegas(t, 0.1, fps, { damping: 12, stiffness: 180, mass: 0.6 });
  // loop: kotak ilang di akhir biar frame terakhir = frame pertama
  const pergi = maju(t, T.loop - 0.35, T.loop, EASE.keluar);
  const hujan: React.ReactNode[] = [];
  let kena = 0;
  for (let i = 0; i < N; i++) {
    // makin lama makin deras
    const m = 0.12 + (akhir - 0.6) * Math.sqrt(i / N);
    const q = maju(t, m, m + 0.5, EASE.jatuh);
    if (q >= 1) kena++;
    if (q <= 0 || q >= 1) continue;
    const x = KOTAK_A.x - 170 + random(`hx${i}`) * 340;
    const y = lerp(1450, KOTAK_A.y - KOTAK_A.h / 2 + 20, q);
    hujan.push(<Balok key={i} x={x} y={y} w={58} h={48} teks={TOKEN_SABUK[i % TOKEN_SABUK.length]} warna={i % 5 === 0 ? K.teal : '#3a5280'} fs={20} />);
  }
  const denyut = (kena % 2) * 0.012;
  if (t > T.s[2].mulai + 1.5 && t < T.s[15].mulai) return null;
  return (
    <>
      {hujan}
      <div style={{ position: 'absolute', left: KOTAK_A.x - KOTAK_A.w / 2, top: KOTAK_A.y - KOTAK_A.h / 2, width: KOTAK_A.w, height: KOTAK_A.h, borderRadius: 30, background: 'linear-gradient(160deg, #142449, #0c1631)', border: `5px solid ${K.teal}`, boxShadow: `0 0 50px rgba(61,219,200,0.35)`, scale: String(pop * (1 + denyut) * (1 - pergi)), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 96, lineHeight: 1, color: K.tinta }}>Llama 3</div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: K.teal, marginTop: 12 }}>model AI · Meta</div>
      </div>
    </>
  );
};

// ======================================================================================================
// B: teks dipotong jadi token (S2). Contoh potongan = ilustrasi.
const KALIMAT_B = ['kucing', 'tidur', 'di', 'sofa'];
const KATA_PANJANG = ['meny', 'enang', 'kan'];
export const StasiunB: React.FC<{ T: WaktuL }> = ({ T }) => {
  const t = useDetik();
  if (t < T.s[1].mulai - 1.2 || t > T.s[2].mulai + 1.6) return null;
  const potong = maju(t, T.potongan - 0.05, T.potongan + 0.4, EASE.masuk);
  const potong2 = maju(t, T.sepotong, T.sepotong + 0.35, EASE.masuk);
  const muncul = maju(t, T.s[1].mulai - 0.5, T.s[1].mulai);
  const muncul2 = maju(t, T.satu2 - 0.3, T.satu2 + 0.1);
  // turun ke sabuk pas pindah ke stasiun C
  const jatuh = maju(t, T.s[2].mulai - 0.35, T.s[2].mulai + 0.25, EASE.jatuh);
  const ikut = Math.max(0, t - (T.s[2].mulai + 0.25)) * LAJU;
  const kotak = (aktif: number, sorot: boolean): React.CSSProperties => ({
    display: 'inline-block',
    padding: `0.02em ${0.12 * aktif}em 0.06em`,
    borderRadius: 14,
    border: `${aktif > 0.05 ? 4 : 0}px solid ${sorot ? K.kuning : K.teal}`,
    background: aktif > 0.05 ? (sorot ? 'rgba(255,197,61,0.16)' : 'rgba(61,219,200,0.1)') : 'transparent',
  });
  const y1 = 1930 + jatuh * (SABUK_Y - 1930 - 20);
  const y2 = 2160 + jatuh * (SABUK_Y - 2160 - 20);
  const o = 1 - maju(t, T.s[2].mulai + 0.25, T.s[2].mulai + 0.6);
  return (
    <div style={{ opacity: o }}>
      <div style={{ position: 'absolute', left: X.B - 420, top: 1800, fontFamily: MONO, fontWeight: 600, fontSize: 26, color: K.abu, border: `2px solid ${K.garis}`, borderRadius: 8, padding: '2px 12px', opacity: muncul * (1 - jatuh) }}>contoh potongan · ilustrasi</div>
      <div style={{ position: 'absolute', left: X.B - 420 + ikut, top: y1 - 60, display: 'flex', gap: lerp(20, 34, potong), alignItems: 'center', fontFamily: SAIRA, fontWeight: 700, fontSize: 92, lineHeight: 1.1, color: K.tinta, opacity: muncul, scale: String(lerp(1, 0.55, jatuh)), transformOrigin: '0 50%' }}>
        {KALIMAT_B.map((w, i) => (
          <span key={i} style={kotak(potong, i === 0 && t > T.satu2 - 0.1)}>{w}</span>
        ))}
      </div>
      {/* "satu kata utuh" */}
      <div style={{ position: 'absolute', left: X.B - 420, top: y1 + 58, fontFamily: TANGAN, fontWeight: 700, fontSize: 42, color: K.kuning, opacity: maju(t, T.satu2, T.satu2 + 0.25) * (1 - jatuh) }}>↑ satu kata utuh</div>
      <div style={{ position: 'absolute', left: X.B - 420 + ikut, top: y2 - 60 + 60, display: 'flex', gap: lerp(0, 26, potong2), alignItems: 'center', fontFamily: SAIRA, fontWeight: 700, fontSize: 92, lineHeight: 1.1, color: K.tinta, opacity: muncul2, scale: String(lerp(1, 0.55, jatuh)), transformOrigin: '0 50%' }}>
        {KATA_PANJANG.map((w, i) => (
          <span key={i} style={{ ...kotak(potong2, true), borderRadius: 10 }}>{w}</span>
        ))}
      </div>
      <div style={{ position: 'absolute', left: X.B - 420, top: y2 + 120, fontFamily: TANGAN, fontWeight: 700, fontSize: 46, color: K.kuning, opacity: maju(t, T.sepotong + 0.2, T.sepotong + 0.45) * (1 - jatuh), whiteSpace: 'nowrap' }}>↑ sepotong-sepotong kata</div>
    </div>
  );
};

// ======================================================================================================
// C: orang baca 1 token per detik (S3) → jam 24 jam (86.400) & kalender 365 hari (31,5 juta) (S4) → penggaris tahun log
// (475.000) (S5) → garis waktu 475.000 tahun lalu → hari ini (S6).
export const ORANG = { x: X.C + 160, y: 2330 };
export function progresHari(t: number, T: WaktuL) {
  return maju(t, T.n86400 - 0.3, T.token4 + 0.2, EASE.kamera);
}
export function progresTahun1(t: number, T: WaktuL) {
  return maju(t, T.n315 - 0.6, T.juta4 + 0.3, EASE.kamera);
}
export function progresTahunLog(t: number, T: WaktuL) {
  return maju(t, T.n475 - 0.5, T.tahun5 + 0.2, EASE.kamera);
}
/** tahun di penggaris log (1 → 475.000) */
export const tahunLog = (p: number) => Math.pow(10, Math.log10(475000) * p);

const Orang: React.FC<{ x: number; y: number; skala?: number; baca: number; warna?: string }> = ({ x, y, skala = 1, baca, warna = K.tinta }) => {
  const t = useDetik();
  const angguk = Math.sin(baca * Math.PI) * 6;
  return (
    <div style={{ position: 'absolute', left: x, top: y, scale: String(skala), transformOrigin: '50% 100%' }}>
      <svg width={200} height={260} viewBox="-100 -260 200 260" style={{ position: 'absolute', left: -100, top: -260, overflow: 'visible' }}>
        {/* badan */}
        <path d="M -62 0 C -62 -70, -44 -112, 0 -112 C 44 -112, 62 -70, 62 0 Z" fill={warna} opacity={0.92} />
        {/* lengan nyodorin ke kiri */}
        <path d={`M -30 -78 Q -70 -60 -96 ${-74 + angguk}`} stroke={warna} strokeWidth={22} strokeLinecap="round" fill="none" />
        {/* kepala (ngangguk tiap baca) */}
        <g transform={`translate(${-4 + noise('kpl', t * 0.6) * 2} ${-150 + angguk}) rotate(${-8 + angguk})`}>
          <circle r={42} fill={warna} />
          <circle cx={-18} cy={-4} r={5} fill={K.latar} />
        </g>
      </svg>
    </div>
  );
};

export const StasiunC: React.FC<{ T: WaktuL; kam: Kamera }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < T.s[1].mulai + 0.5 || (t > T.s[6].mulai + 1.4 && t < T.s[15].mulai)) return null;
  // baca 1 token per detik mulai "baca"
  const mulaiBaca = T.baca3 - 0.1;
  const n = Math.max(0, Math.floor(t - mulaiBaca));
  const fase = t < mulaiBaca ? 0 : t - mulaiBaca - n; // 0..1 tiap detik
  const bacaJalan = t > mulaiBaca && t < T.s[6].mulai + 0.6;
  const angkat = bacaJalan ? maju(fase, 0, 0.45, EASE.kamera) : 0;
  const hilang = bacaJalan ? maju(fase, 0.55, 0.9) : 0;
  const tangan = { x: ORANG.x - 96, y: ORANG.y - 80 };
  // jam detik (S3) → cincin 24 jam (S4)
  const jam = { x: X.C - 190, y: 1880, r: 130 };
  const pHari = progresHari(t, T);
  const pTahun = progresTahun1(t, T);
  const pLog = progresTahunLog(t, T);
  const keluarJam = maju(t, T.s[4].mulai - 0.2, T.s[4].mulai + 0.25, EASE.keluar);
  const munculKal = maju(t, T.setahun - 0.3, T.setahun + 0.1);
  const hari = Math.max(1, Math.round(365 * pTahun));
  // matahari/bulan muter (tanpa tidur)
  const putar = maju(t, T.tidur - 0.3, T.s[3].mulai, EASE.linear);
  const munculLangit = maju(t, T.tidur - 0.4, T.tidur) * (1 - maju(t, T.s[3].mulai - 0.2, T.s[3].mulai + 0.2));
  // penggaris log (S5) & garis waktu (S6)
  const munculLog = maju(t, T.s[4].mulai + 0.1, T.s[4].mulai + 0.5) * (1 - maju(t, T.s[5].mulai - 0.1, T.s[5].mulai + 0.3, EASE.keluar));
  const garisW = { x0: X.C - 330, x1: X.C + 500, y: 2010 };
  const munculGW = maju(t, T.s[5].mulai, T.s[5].mulai + 0.4) * (1 - maju(t, T.s[6].mulai + 0.6, T.s[6].mulai + 1.1, EASE.keluar));
  const jalanGW = maju(t, T.n475b + 0.2, T.selesai, EASE.kamera);
  const bendera = pegas(t, T.hariIni - 0.05, fps, { damping: 10, stiffness: 200, mass: 0.6 });
  return (
    <>
      {/* meja */}
      <div style={{ position: 'absolute', left: ORANG.x - 210, top: ORANG.y + 4, width: 330, height: 14, borderRadius: 7, background: '#2c4068' }} />
      <Orang x={ORANG.x} y={ORANG.y} baca={angkat} />
      {/* token yang lagi dibaca: diangkat dari sabuk ke tangan */}
      {bacaJalan && hilang < 1 ? (
        <Balok
          x={lerp(ORANG.x - 230, tangan.x - 10, angkat)}
          y={lerp(SABUK_Y - 2, tangan.y - 30, angkat) - Math.sin(Math.PI * angkat) * 60}
          w={64}
          h={52}
          teks={TOKEN_SABUK[n % TOKEN_SABUK.length]}
          warna={K.kuning}
          isi="#2a2410"
          o={1 - hilang}
          skala={1 + hilang * 0.4}
        />
      ) : null}
      {/* jam: jarum detik loncat tiap token (S3); S4 jadi cincin 24 jam yang keisi */}
      {t > T.s[2].mulai - 0.2 && keluarJam < 1 ? (
        <div style={{ opacity: maju(t, T.s[2].mulai - 0.2, T.s[2].mulai + 0.2) * (1 - keluarJam) }}>
          <Svg>
            <circle cx={jam.x} cy={jam.y} r={jam.r} fill="#0e1a34" stroke={K.garis} strokeWidth={8} />
            {pHari > 0 ? (
              <circle cx={jam.x} cy={jam.y} r={jam.r} fill="none" stroke={K.teal} strokeWidth={10} strokeDasharray={`${2 * Math.PI * jam.r * pHari} ${2 * Math.PI * jam.r}`} transform={`rotate(-90 ${jam.x} ${jam.y})`} strokeLinecap="round" />
            ) : null}
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return <line key={i} x1={jam.x + Math.sin(a) * (jam.r - 22)} y1={jam.y - Math.cos(a) * (jam.r - 22)} x2={jam.x + Math.sin(a) * (jam.r - 10)} y2={jam.y - Math.cos(a) * (jam.r - 10)} stroke={K.abu} strokeWidth={4} />;
            })}
            {(() => {
              // S3: 1 loncatan per token; S4: muter ngebut 24 jam
              const sudut = pHari > 0 ? pHari * 360 * 24 : (n + maju(fase, 0, 0.12)) * 6;
              const a = (sudut * Math.PI) / 180;
              return <line x1={jam.x} y1={jam.y} x2={jam.x + Math.sin(a) * (jam.r - 26)} y2={jam.y - Math.cos(a) * (jam.r - 26)} stroke={K.kuning} strokeWidth={6} strokeLinecap="round" />;
            })()}
            <circle cx={jam.x} cy={jam.y} r={8} fill={K.kuning} />
          </Svg>
          <div style={{ position: 'absolute', left: jam.x - 150, top: jam.y + jam.r + 14, width: 300, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 30, color: pHari > 0 ? K.teal : K.abu }}>{pHari > 0 ? '24 jam' : '1 detik = 1 token'}</div>
        </div>
      ) : null}
      {/* matahari & bulan muter: tanpa tidur */}
      {munculLangit > 0 ? (
        <div style={{ position: 'absolute', left: X.C + 330, top: 1860, opacity: munculLangit }}>
          <svg width={240} height={240} viewBox="-120 -120 240 240" style={{ position: 'absolute', left: -120, top: -120, overflow: 'visible' }}>
            <circle r={90} fill="none" stroke={K.garis} strokeWidth={4} strokeDasharray="10 10" />
            <g transform={`rotate(${putar * 720})`}>
              <circle cx={0} cy={-90} r={28} fill={K.kuning} />
              <circle cx={0} cy={90} r={24} fill="#c9d6e6" />
              <circle cx={10} cy={84} r={20} fill="#0e1a34" />
            </g>
          </svg>
          <div style={{ position: 'absolute', left: -120, top: 130, width: 240, textAlign: 'center', fontFamily: TANGAN, fontWeight: 700, fontSize: 40, color: K.merah }}>tanpa tidur</div>
        </div>
      ) : null}
      {/* kalender 365 hari (S4) */}
      {munculKal > 0 && keluarJam < 1 ? (
        <div style={{ position: 'absolute', left: X.C + 200, top: 1730, width: 240, opacity: munculKal * (1 - keluarJam), translate: `0 ${(1 - munculKal) * 30}px` }}>
          <div style={{ height: 50, borderRadius: '16px 16px 0 0', background: K.merah, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 26, color: K.tinta }}>HARI KE</div>
          <div style={{ height: 150, borderRadius: '0 0 16px 16px', background: '#e8eef5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SAIRA, fontWeight: 800, fontSize: 104, color: K.latar, fontVariantNumeric: 'tabular-nums', overflow: 'hidden' }}>
            <span style={{ translate: `0 ${(1 - ((pTahun * 365) % 1)) * 0}px` }}>{hari}</span>
          </div>
          <div style={{ marginTop: 10, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 30, color: K.teal }}>dari 365</div>
        </div>
      ) : null}
      {/* penggaris tahun (log) S5: penanda geser diikat ke hitungan tahun */}
      {munculLog > 0 ? (
        <div style={{ opacity: munculLog }}>
          <Svg>
            <GarisDigambar d={`M ${garisW.x0} ${garisW.y} L ${garisW.x1} ${garisW.y}`} mulai={T.s[4].mulai + 0.1} lama={0.4} warna={K.abu} tebal={6} />
            {[1, 10, 100, 1000, 10000, 100000].map((v, i) => {
              const x = garisW.x0 + ((garisW.x1 - garisW.x0) * Math.log10(v)) / Math.log10(475000);
              return <line key={i} x1={x} y1={garisW.y - 18} x2={x} y2={garisW.y + 18} stroke={K.abu} strokeWidth={4} opacity={maju(t, T.s[4].mulai + 0.2 + i * 0.05, T.s[4].mulai + 0.4 + i * 0.05)} />;
            })}
            <rect x={garisW.x0} y={garisW.y - 7} width={(garisW.x1 - garisW.x0) * pLog} height={14} rx={7} fill={K.kuning} />
          </Svg>
          {[1, 10, 100, 1000, 10000, 100000].map((v, i) => {
            const x = garisW.x0 + ((garisW.x1 - garisW.x0) * Math.log10(v)) / Math.log10(475000);
            return (
              <div key={i} style={{ position: 'absolute', left: x - 90, top: garisW.y + 26, width: 180, textAlign: 'center', fontFamily: MONO, fontWeight: 600, fontSize: 26, color: K.abu }}>
                {v.toLocaleString('id-ID')}
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: garisW.x0, top: garisW.y + 64, fontFamily: MONO, fontWeight: 600, fontSize: 24, color: K.abu }}>tahun (skala log)</div>
          <div style={{ position: 'absolute', left: garisW.x0 + (garisW.x1 - garisW.x0) * pLog - 2, top: garisW.y - 96, translate: '-50% 0', fontFamily: SAIRA, fontWeight: 800, fontSize: 60, color: K.kuning, whiteSpace: 'nowrap' }}>
            <AngkaJalan dari={0} ke={475000} progress={tahunLog(pLog) / 475000} />
          </div>
        </div>
      ) : null}
      {/* garis waktu S6: 475.000 tahun lalu → hari ini */}
      {munculGW > 0 ? (
        <div style={{ opacity: munculGW }}>
          <Svg>
            <GarisDigambar d={`M ${garisW.x0} ${garisW.y} L ${garisW.x1} ${garisW.y}`} mulai={T.s[5].mulai} lama={0.4} warna={K.tinta} tebal={6} />
            <rect x={garisW.x0} y={garisW.y - 6} width={(garisW.x1 - garisW.x0) * jalanGW} height={12} rx={6} fill={K.kuning} />
            {Array.from({ length: 24 }, (_, i) => {
              const u = (i + 0.5) / 24;
              if (u > jalanGW) return null;
              return <rect key={i} x={garisW.x0 + (garisW.x1 - garisW.x0) * u - 14} y={garisW.y - 44} width={28} height={24} rx={5} fill="#2c4068" stroke={K.kuning} strokeWidth={2} />;
            })}
          </Svg>
          <div style={{ position: 'absolute', left: garisW.x0 - 20, top: garisW.y + 26, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: K.tinta, whiteSpace: 'nowrap' }}>475.000 tahun lalu</div>
          <Orang x={lerp(garisW.x0, garisW.x1, jalanGW)} y={garisW.y - 50} skala={0.36} baca={(t * 1.5) % 1} warna={K.kuning} />
          {t > T.hariIni - 0.05 ? (
            <div style={{ position: 'absolute', left: garisW.x1 - 3, top: garisW.y - 150, scale: String(bendera), transformOrigin: '0 100%' }}>
              <div style={{ width: 6, height: 150, background: K.tinta }} />
              <div style={{ position: 'absolute', right: 0, top: 0, padding: '6px 18px', background: K.kuning, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 48, whiteSpace: 'nowrap', borderRadius: '10px 0 0 10px' }}>hari ini ✓</div>
            </div>
          ) : (
            <div style={{ position: 'absolute', left: garisW.x1 - 60, top: garisW.y + 26, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: K.tinta }}>hari ini</div>
          )}
          <div style={{ position: 'absolute', left: (garisW.x0 + garisW.x1) / 2 - 80, top: garisW.y + 70, fontFamily: MONO, fontWeight: 600, fontSize: 24, color: K.abu, border: `2px solid ${K.garis}`, borderRadius: 8, padding: '2px 10px' }}>dipercepat</div>
        </div>
      ) : null}
    </>
  );
};

// ======================================================================================================
// D: tumpukan data 1× Llama 2 vs 7× Llama 3 (S7), sumber terbuka masuk, kode 1× vs 4× (S8)
const LANTAI_D = SABUK_Y - 120;
const Lapis: React.FC<{ x: number; y: number; w: number; h: number; warna: string; teks?: string }> = ({ x, y, w, h, warna, teks }) => (
  <div style={{ position: 'absolute', left: x - w / 2, top: y - h, width: w, height: h - 6, borderRadius: 10, background: `repeating-linear-gradient(90deg, ${warna}33 0 18px, ${warna}55 18px 20px)`, border: `4px solid ${warna}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 30, color: warna }}>
    {teks}
  </div>
);
export function jumlahLapis(t: number, T: WaktuL) {
  let n = 0;
  for (let i = 0; i < 7; i++) if (t >= waktuLapis(i, T)) n++;
  return n;
}
const waktuLapis = (i: number, T: WaktuL) => T.tujuh - 0.05 + i * ((T.banyak7 + 0.35 - T.tujuh) / 6);
const waktuKode = (i: number, T: WaktuL) => T.empat - 0.15 + i * 0.17;
export function jumlahKode(t: number, T: WaktuL) {
  let n = 0;
  for (let i = 0; i < 4; i++) if (t >= waktuKode(i, T)) n++;
  return n;
}
export const StasiunD: React.FC<{ T: WaktuL }> = ({ T }) => {
  const t = useDetik();
  if (t < T.s[6].mulai - 0.8 || (t > T.s[8].mulai + 1.4 && t < T.s[15].mulai)) return null;
  const H = 80;
  const x2 = X.D - 380;
  const x3 = X.D - 80;
  const xk2 = X.D + 330;
  const xk3 = X.D + 520;
  const munculD = maju(t, T.s[6].mulai - 0.3, T.s[6].mulai + 0.2);
  return (
    <>
      <div style={{ opacity: munculD }}>
        <Lapis x={x2} y={LANTAI_D} w={220} h={H} warna={K.abu} />
        <div style={{ position: 'absolute', left: x2 - 150, top: LANTAI_D + 10, width: 300, textAlign: 'center', fontFamily: SAIRA, fontWeight: 700, fontSize: 44, color: K.abu }}>Llama 2</div>
        <div style={{ position: 'absolute', left: x3 - 150, top: LANTAI_D + 10, width: 300, textAlign: 'center', fontFamily: SAIRA, fontWeight: 700, fontSize: 44, color: K.teal }}>Llama 3</div>
      </div>
      {Array.from({ length: 7 }, (_, i) => (
        <Squash key={i} mendarat={waktuLapis(i, T)} tinggiJatuh={420} lamaJatuh={0.22} kuat={0.6} gaya={{ position: 'absolute', left: 0, top: 0 }}>
          <Lapis x={x3} y={LANTAI_D - i * H} w={220} h={H} warna={K.teal} teks={`${i + 1}`} />
        </Squash>
      ))}
      {/* sumber terbuka buat umum: halaman web masuk ke tumpukan */}
      {Array.from({ length: 6 }, (_, i) => {
        const m = T.dikumpulin + i * 0.22;
        const q = maju(t, m, m + 0.75, EASE.kamera);
        if (q <= 0 || q >= 1) return null;
        const dari = { x: X.D + 80 + (i % 3) * 170, y: 1700 + (i % 2) * 90 };
        const ke = { x: x3, y: LANTAI_D - 7 * 80 + 20 };
        return (
          <div key={i} style={{ position: 'absolute', left: lerp(dari.x, ke.x, q) - 70, top: lerp(dari.y, ke.y, q) - 50 - Math.sin(Math.PI * q) * 80, width: 140, height: 100, borderRadius: 10, background: '#e8eef5', opacity: 1 - maju(q, 0.75, 1), scale: String(lerp(1, 0.4, q)), overflow: 'hidden' }}>
            <div style={{ height: 22, background: '#b8c6d8', display: 'flex', gap: 6, alignItems: 'center', paddingLeft: 8 }}>
              {[0, 1, 2].map((j) => <div key={j} style={{ width: 8, height: 8, borderRadius: 4, background: K.latar }} />)}
            </div>
            {[0, 1, 2].map((j) => <div key={j} style={{ margin: '10px 12px 0', height: 8, borderRadius: 4, background: '#8fa6c4', width: j === 2 ? 60 : 110 }} />)}
          </div>
        );
      })}
      {t > T.terbuka - 0.1 ? (
        <div style={{ position: 'absolute', left: X.D + 60, top: 1610, fontFamily: TANGAN, fontWeight: 700, fontSize: 40, color: K.tinta, opacity: maju(t, T.terbuka - 0.1, T.terbuka + 0.2) * (1 - maju(t, T.kode - 0.2, T.kode + 0.1)), whiteSpace: 'nowrap' }}>
          sumber terbuka buat umum
        </div>
      ) : null}
      {/* kode 1× vs 4× */}
      {t > T.kode - 0.3 ? (
        <div style={{ opacity: maju(t, T.kode - 0.3, T.kode + 0.1) }}>
          <Lapis x={xk2} y={LANTAI_D} w={150} h={58} warna={K.abu} teks="</>" />
          <div style={{ position: 'absolute', left: xk2 - 110, top: LANTAI_D + 10, width: 220, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 28, color: K.abu }}>kode L2</div>
          <div style={{ position: 'absolute', left: xk3 - 110, top: LANTAI_D + 10, width: 220, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 28, color: K.kuning }}>kode L3</div>
        </div>
      ) : null}
      {Array.from({ length: 4 }, (_, i) => (
        <Squash key={`k${i}`} mendarat={waktuKode(i, T)} tinggiJatuh={360} lamaJatuh={0.2} kuat={0.6} gaya={{ position: 'absolute', left: 0, top: 0 }}>
          <Lapis x={xk3} y={LANTAI_D - i * 58} w={150} h={58} warna={K.kuning} teks="</>" />
        </Squash>
      ))}
    </>
  );
};

// ======================================================================================================
// E: 100 kotak: > 5% bukan bahasa Inggris → bola dunia dengan 30+ penanda (Meta gak nyebut daftar bahasanya)
export function jumlahBahasa(t: number, T: WaktuL) {
  return Math.round(32 * maju(t, T.n30 - 0.25, T.bahasa9 + 0.45, EASE.kamera));
}
export const StasiunE: React.FC<{ T: WaktuL }> = ({ T }) => {
  const t = useDetik();
  if (t < T.s[8].mulai - 0.8 || (t > T.s[9].mulai + 1.4 && t < T.s[15].mulai)) return null;
  const g = { x: X.E - 470, y: 1820, sel: 30, celah: 4 };
  const munculG = maju(t, T.s[8].mulai - 0.4, T.s[8].mulai + 0.2);
  const nyala5 = maju(t, T.n5 - 0.1, T.n5 + 0.2);
  const pisah = maju(t, T.bukan9, T.inggris + 0.3);
  const bola = { x: X.E + 200, y: 2000, r: 200 };
  const nb = jumlahBahasa(t, T);
  return (
    <>
      <div style={{ opacity: munculG }}>
        {Array.from({ length: 100 }, (_, i) => {
          const c = i % 10;
          const r = Math.floor(i / 10);
          const lain = i >= 95;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: g.x + c * (g.sel + g.celah) + (lain ? pisah * 30 : 0),
                top: g.y + r * (g.sel + g.celah) + (lain ? pisah * 20 : 0),
                width: g.sel,
                height: g.sel,
                borderRadius: 6,
                background: lain ? (nyala5 > 0.5 ? K.kuning : '#3a5280') : '#3a5280',
                opacity: maju(t, T.s[8].mulai - 0.4 + i * 0.006, T.s[8].mulai - 0.2 + i * 0.006),
                scale: lain ? String(1 + 0.25 * Math.sin(Math.PI * nyala5)) : undefined,
              }}
            />
          );
        })}
        <div style={{ position: 'absolute', left: g.x, top: g.y - 64, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: K.abu, opacity: maju(t, T.inggris - 0.2, T.inggris + 0.1) }}>bahasa Inggris</div>
        <div style={{ position: 'absolute', left: g.x, top: g.y + 352, fontFamily: MONO, fontWeight: 800, fontSize: 32, color: K.kuning, opacity: nyala5, whiteSpace: 'nowrap' }}>{'> 5% bahasa lain'}</div>
      </div>
      {/* bola dunia digambar + 30+ penanda */}
      {t > T.n30 - 0.6 ? (
        <>
          <Svg>
            <GarisDigambar d={`M ${bola.x + bola.r} ${bola.y} A ${bola.r} ${bola.r} 0 1 1 ${bola.x - bola.r} ${bola.y} A ${bola.r} ${bola.r} 0 1 1 ${bola.x + bola.r} ${bola.y}`} mulai={T.n30 - 0.6} lama={0.4} warna={K.teal} tebal={6} />
            {[0.45, 0.85].map((f, i) => (
              <GarisDigambar key={i} d={`M ${bola.x} ${bola.y - bola.r} A ${bola.r * f} ${bola.r} 0 1 0 ${bola.x} ${bola.y + bola.r} A ${bola.r * f} ${bola.r} 0 1 0 ${bola.x} ${bola.y - bola.r}`} mulai={T.n30 - 0.45 + i * 0.08} lama={0.35} warna={K.tealTua} tebal={4} />
            ))}
            {[-0.45, 0, 0.45].map((f, i) => (
              <GarisDigambar key={`p${i}`} d={`M ${bola.x - bola.r * Math.sqrt(1 - f * f)} ${bola.y + bola.r * f} L ${bola.x + bola.r * Math.sqrt(1 - f * f)} ${bola.y + bola.r * f}`} mulai={T.n30 - 0.4 + i * 0.06} lama={0.3} warna={K.tealTua} tebal={4} />
            ))}
          </Svg>
          {Array.from({ length: 32 }, (_, i) => {
            if (i >= nb) return null;
            const a = random(`pa${i}`) * Math.PI * 2;
            const d = Math.sqrt(random(`pd${i}`)) * (bola.r - 30);
            const x = bola.x + Math.cos(a) * d;
            const y = bola.y + Math.sin(a) * d * 0.95;
            return (
              <Pop key={i} mulai={T.n30 - 0.25 + (i / 32) * 0.7} damping={11} gaya={{ position: 'absolute', left: x - 13, top: y - 34 }}>
                <svg width={26} height={36} viewBox="0 0 26 36">
                  <path d="M13 35 C 9 26, 1 20, 1 12 A 12 12 0 1 1 25 12 C 25 20, 17 26, 13 35 Z" fill={K.kuning} />
                  <circle cx={13} cy={12} r={4.5} fill={K.latar} />
                </svg>
              </Pop>
            );
          })}
          {/* partikel dari 5 kotak ke bola */}
          {Array.from({ length: 10 }, (_, i) => {
            const q = maju(t, T.n30 - 0.5 + i * 0.05, T.n30 - 0.5 + i * 0.05 + 0.55, EASE.kamera);
            if (q <= 0 || q >= 1) return null;
            const x0 = g.x + 7 * (g.sel + g.celah) + 20;
            const y0 = g.y + 9 * (g.sel + g.celah) + 20;
            return <div key={`pt${i}`} style={{ position: 'absolute', left: lerp(x0, bola.x - 100 + i * 20, q), top: lerp(y0, bola.y - 60 + (i % 3) * 40, q) - Math.sin(Math.PI * q) * 120, width: 16, height: 16, borderRadius: 8, background: K.kuning, opacity: 1 - q }} />;
          })}
        </>
      ) : null}
    </>
  );
};

// ======================================================================================================
// F: 3 gerbang di sabuk: kembar? pantas? kualitas? (S10) + Llama 2 ngelatih penilai, bacaan pilihan masuk Llama 3 (S11)
const GERBANG = [
  { x: X.F - 420, label: 'kembar?' },
  { x: X.F, label: 'pantas?' },
  { x: X.F + 420, label: 'kualitas?' },
];
const L2F = { x: X.F - 300, y: 1740, w: 300, h: 140 };
const L3F = { x: X.F + 300, y: 1900, w: 300, h: 150 };
/** dokumen spesial yang nyampe di gerbang `g` pas detik `tiba` (jalan ikut laju sabuk) */
const xDok = (t: number, gx: number, tiba: number) => gx + (t - tiba) * LAJU;

const Dok: React.FC<{ x: number; y: number; teks: string; warna?: string; tanda?: boolean; skor?: number; o?: number; rot?: number }> = ({ x, y, teks, warna = K.tinta, tanda, skor, o = 1, rot = 0 }) => (
  <div style={{ position: 'absolute', left: x - 60, top: y - 70, width: 120, height: 100, borderRadius: 10, background: tanda ? `repeating-linear-gradient(45deg, #3a1a1a 0 10px, #5a2420 10px 20px)` : '#e8eef5', border: `4px solid ${warna}`, opacity: o, rotate: `${rot}deg`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 24, color: tanda ? K.merah : K.latar }}>
    {tanda ? (
      <svg width={52} height={46} viewBox="0 0 52 46">
        <path d="M26 3 L50 43 H2 Z" fill="none" stroke={K.merah} strokeWidth={5} strokeLinejoin="round" />
        <path d="M26 17 V 30" stroke={K.merah} strokeWidth={5} strokeLinecap="round" />
        <circle cx={26} cy={37} r={3} fill={K.merah} />
      </svg>
    ) : (
      teks
    )}
    {skor !== undefined ? (
      <div style={{ position: 'absolute', top: -34, left: 8, right: 8, height: 18, borderRadius: 9, background: '#17243f' }}>
        <div style={{ height: 18, width: `${skor * 100}%`, borderRadius: 9, background: skor > 0.6 ? K.teal : skor > 0.35 ? K.kuning : K.merah }} />
      </div>
    ) : null}
  </div>
);

export const StasiunF: React.FC<{ T: WaktuL }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < T.s[9].mulai - 0.8 || (t > T.s[11].mulai + 1.4 && t < T.s[15].mulai)) return null;
  const yDok = SABUK_Y - 34;
  // kembar: 2 dokumen "berita A" — yang kedua ditendang di gerbang 1
  const tKembar = T.kembar + 0.05;
  const tendang1 = maju(t, tKembar, tKembar + 0.6, EASE.masuk);
  const tPantas = T.pantas + 0.05;
  const tendang2 = maju(t, tPantas, tPantas + 0.6, EASE.masuk);
  const tNilai = T.dinilai - 0.2;
  const pilih = maju(t, T.milihin - 0.1, T.barunya + 0.3, EASE.kamera);
  const l2 = pegas(t, T.llama2c - 0.15, fps, { damping: 12, stiffness: 180, mass: 0.6 });
  const l3 = pegas(t, T.versiLama - 0.2, fps, { damping: 12, stiffness: 180, mass: 0.6 });
  const dok: React.ReactNode[] = [];
  // kembar
  const xa = xDok(t, GERBANG[0].x, tKembar + 0.55);
  const xb = xDok(Math.min(t, tKembar), GERBANG[0].x, tKembar);
  dok.push(<Dok key="a" x={xa} y={yDok} teks="berita A" />);
  dok.push(<Dok key="b" x={xb - tendang1 * 260} y={yDok - Math.sin(Math.PI * Math.min(1, tendang1 * 1.4)) * 260 - tendang1 * 120} teks="berita A" warna={tendang1 > 0 ? K.merah : K.tinta} rot={-tendang1 * 40} o={1 - maju(tendang1, 0.6, 1)} />);
  // gak pantas
  const xc = xDok(Math.min(t, tPantas), GERBANG[1].x, tPantas);
  dok.push(<Dok key="c" x={xc + tendang2 * 220} y={yDok - Math.sin(Math.PI * Math.min(1, tendang2 * 1.4)) * 260 - tendang2 * 120} teks="" tanda rot={tendang2 * 40} o={1 - maju(tendang2, 0.6, 1)} warna={K.merah} />);
  // dinilai: 3 dokumen lewat gerbang 3, dapet skor; yang bagus dipilih masuk Llama 3 (S11)
  const skor = [0.86, 0.3, 0.72];
  skor.forEach((s, i) => {
    // antre di gerbang kualitas: yang pertama berhenti di gerbang, berikutnya di belakangnya
    const xStop = GERBANG[2].x - i * 140;
    const tiba = tNilai + i * 0.42;
    const xBase = Math.min(xStop, xDok(t, xStop, tiba));
    const dapat = maju(t, tiba, tiba + 0.3);
    const bagus = s > 0.6;
    const q = bagus ? pilih : 0;
    const x = lerp(xBase, L3F.x - 60 + i * 50, q);
    const y = lerp(yDok, L3F.y - 160, q) - Math.sin(Math.PI * q) * 200;
    dok.push(<Dok key={`n${i}`} x={x} y={y} teks={`teks ${i + 1}`} skor={dapat > 0 ? s * dapat : undefined} o={(t > tiba - 3 ? 1 : 0) * (1 - (bagus ? maju(q, 0.85, 1) : maju(t, T.milihin, T.milihin + 0.4)))} />);
  });
  return (
    <>
      {/* gerbang (lengkung di atas sabuk) */}
      <Svg>
        {GERBANG.map((g, i) => (
          <GarisDigambar key={i} d={`M ${g.x - 100} ${SABUK_Y + 30} V ${SABUK_Y - 200} Q ${g.x - 100} ${SABUK_Y - 250} ${g.x - 50} ${SABUK_Y - 250} H ${g.x + 50} Q ${g.x + 100} ${SABUK_Y - 250} ${g.x + 100} ${SABUK_Y - 200} V ${SABUK_Y + 30}`} mulai={T.disaring - 0.1 + i * 0.12} lama={0.35} warna={i === 2 ? K.teal : K.abu} tebal={8} />
        ))}
        {/* Llama 2 → penilai */}
        <GarisDigambar d={pathPanah(L2F.x + 40, L2F.y + L2F.h / 2 + 10, GERBANG[2].x - 30, SABUK_Y - 270, 90, 30)} mulai={T.llama2c + 0.1} lama={0.4} warna={K.kuning} tebal={7} />
        {/* penilai → Llama 3 */}
        <GarisDigambar d={pathPanah(GERBANG[2].x + 60, SABUK_Y - 270, L3F.x + 60, L3F.y - 160 + L3F.h / 2 + 10, 40, 30)} mulai={T.milihin - 0.25} lama={0.4} warna={K.teal} tebal={7} />
      </Svg>
      {GERBANG.map((g, i) => (
        <div key={i} style={{ position: 'absolute', left: g.x - 120, top: SABUK_Y - 312, width: 240, textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 34, color: i === 2 ? K.teal : K.tinta, opacity: maju(t, T.disaring + i * 0.12, T.disaring + 0.25 + i * 0.12) }}>
          {g.label}
        </div>
      ))}
      {dok}
      <div style={{ position: 'absolute', left: GERBANG[0].x - 120, top: SABUK_Y - 520, width: 240, textAlign: 'center', fontFamily: TANGAN, fontWeight: 700, fontSize: 44, lineHeight: 1.05, color: K.merah, opacity: maju(t, tKembar + 0.2, tKembar + 0.4) * (1 - maju(t, T.s[10].mulai, T.s[10].mulai + 0.3)), whiteSpace: 'nowrap' }}>kembar<br />dibuang</div>
      <div style={{ position: 'absolute', left: GERBANG[1].x - 120, top: SABUK_Y - 520, width: 240, textAlign: 'center', fontFamily: TANGAN, fontWeight: 700, fontSize: 44, lineHeight: 1.05, color: K.merah, opacity: maju(t, tPantas + 0.2, tPantas + 0.4) * (1 - maju(t, T.s[10].mulai, T.s[10].mulai + 0.3)), whiteSpace: 'nowrap' }}>gak pantas<br />dibuang</div>
      {/* Llama 2 (penilai dilatih pakai datanya) */}
      {t > T.llama2c - 0.2 ? (
        <div style={{ position: 'absolute', left: L2F.x - L2F.w / 2, top: L2F.y - L2F.h / 2, width: L2F.w, height: L2F.h, borderRadius: 24, background: '#151d33', border: `5px solid ${K.kuning}`, scale: String(l2), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 64, lineHeight: 1, color: K.kuning }}>Llama 2</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: K.abu, marginTop: 6 }}>versi lama</div>
        </div>
      ) : null}
      {t > T.llama2c + 0.3 ? (
        <div style={{ position: 'absolute', left: L2F.x - L2F.w / 2, top: L2F.y + L2F.h / 2 + 14, fontFamily: TANGAN, fontWeight: 700, fontSize: 38, color: K.kuning, opacity: maju(t, T.llama2c + 0.3, T.llama2c + 0.5), whiteSpace: 'nowrap' }}>ngelatih penilai</div>
      ) : null}
      {t > T.versiLama - 0.25 ? (
        <div style={{ position: 'absolute', left: L3F.x - L3F.w / 2, top: L3F.y - L3F.h / 2 - 160, width: L3F.w, height: L3F.h, borderRadius: 24, background: 'linear-gradient(160deg, #142449, #0c1631)', border: `5px solid ${K.teal}`, scale: String(l3), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 64, lineHeight: 1, color: K.tinta }}>Llama 3</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: K.teal, marginTop: 6 }}>versi baru</div>
        </div>
      ) : null}
    </>
  );
};

// ======================================================================================================
// G: 2 klaster × 24.000 GPU (S12): tiap sel = 1 GPU (160 × 150 = 24.000), keisi bareng counter
export function isiGpu(t: number, T: WaktuL) {
  return maju(t, T.masing - 0.1, T.gpu + 0.3, EASE.kamera);
}
export const StasiunG: React.FC<{ T: WaktuL }> = ({ T }) => {
  const t = useDetik();
  if (t < T.s[11].mulai - 0.8 || (t > T.s[12].mulai + 1.4 && t < T.s[15].mulai)) return null;
  const kol = 160;
  const bar = 150;
  const W = 480;
  const Hh = 400;
  const sw = W / kol;
  const sh = Hh / bar;
  const p = isiGpu(t, T);
  const n = Math.round(24000 * p);
  const full = Math.floor(n / kol);
  const sisa = n - full * kol;
  return (
    <>
      {[0, 1].map((c) => {
        const x0 = X.G - 520 + c * 560;
        const y0 = 1860;
        const baris: React.ReactNode[] = [];
        for (let r = 0; r < Math.min(bar, full + (sisa ? 1 : 0)); r++) {
          const sel = r < full ? kol : sisa;
          const y = y0 + r * sh + sh / 2;
          baris.push(<line key={r} x1={x0} y1={y} x2={x0 + sel * sw} y2={y} stroke={(r + c) % 7 === 0 ? K.kuning : K.teal} strokeWidth={sh * 0.7} strokeDasharray={`${sw * 0.7} ${sw * 0.3}`} opacity={0.85 + 0.15 * noise(`g${c}${r}`, t * 3)} />);
        }
        return (
          <React.Fragment key={c}>
            <Svg>
              <rect x={x0 - 14} y={y0 - 14} width={W + 28} height={Hh + 28} rx={18} fill="#0b1428" />
              <GarisDigambar d={`M ${x0 - 14} ${y0 - 14} H ${x0 + W + 14} V ${y0 + Hh + 14} H ${x0 - 14} Z`} mulai={T.dua12 - 0.1 + c * 0.15} lama={0.4} warna={K.abu} tebal={5} />
              {baris}
            </Svg>
            <div style={{ position: 'absolute', left: x0, top: y0 + Hh + 30, width: W, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 32, color: K.tinta, opacity: maju(t, T.dua12 + c * 0.15, T.dua12 + c * 0.15 + 0.3) }}>
              klaster {c + 1} · <AngkaJalan dari={0} ke={24000} progress={p} /> GPU
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

// ======================================================================================================
// H: 8 miliar parameter (S13): kotak model berisi penggeser yang disetel; nyala bertahap bareng counter
export function isiParam(t: number, T: WaktuL) {
  return maju(t, T.n8 - 0.4, T.miliar13 + 0.4, EASE.kamera);
}
export const StasiunH: React.FC<{ T: WaktuL }> = ({ T }) => {
  const t = useDetik();
  if (t < T.s[12].mulai - 0.8 || (t > T.s[13].mulai + 1.4 && t < T.s[15].mulai)) return null;
  const box = { x: X.H - 380, y: 1820, w: 760, h: 520 };
  const kol = 22;
  const bar = 7;
  const p = isiParam(t, T);
  const setel = maju(t, T.disetel - 0.3, T.disetel + 0.2);
  return (
    <>
      <div style={{ position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: 30, background: 'linear-gradient(160deg, #142449, #0c1631)', border: `5px solid ${K.teal}`, opacity: maju(t, T.s[12].mulai - 0.4, T.s[12].mulai + 0.1) }}>
        <div style={{ position: 'absolute', left: 30, top: 18, fontFamily: SAIRA, fontWeight: 800, fontSize: 52, color: K.tinta }}>Llama 3 <span style={{ color: K.abu, fontSize: 36 }}>· versi kecil</span></div>
      </div>
      <Svg>
        {Array.from({ length: kol * bar }, (_, i) => {
          const c = i % kol;
          const r = Math.floor(i / kol);
          const x = box.x + 50 + c * ((box.w - 100) / (kol - 1));
          const y0 = box.y + 120 + r * 54;
          const nyala = i / (kol * bar) < p;
          const v = 0.5 + 0.42 * noise(`pr${i}`, t * (0.4 + setel * 1.6));
          return (
            <g key={i} opacity={maju(t, T.s[12].mulai - 0.3 + r * 0.05, T.s[12].mulai + r * 0.05)}>
              <line x1={x} y1={y0} x2={x} y2={y0 + 40} stroke="#2c4068" strokeWidth={5} strokeLinecap="round" />
              <circle cx={x} cy={y0 + 40 * (1 - v)} r={8} fill={nyala ? K.kuning : K.teal} />
            </g>
          );
        })}
      </Svg>
    </>
  );
};

// ======================================================================================================
// I (9:16): takaran 200 miliar = 1 balok (S14); 15 triliun = MENARA 75 balok yang tumbuh ke atas, kamera naik ngikutin
// ujungnya (S15); "masih terus makin bagus" = batang kemampuan di samping menara, makin panjang makin ke atas (gambaran tren).
// Orang kecil di kaki menara = skala "gak mungkin dibaca satu orang" (S16).
export function tumbuhBatang(t: number, T: WaktuL) {
  return maju(t, T.n75 - 0.1, T.ternyata - 0.05, EASE.kamera);
}
export const MENARA = { x: X.I, dasar: SABUK_Y - 40, lebar: 150, satuan: 80 };
export const ORANG_I = { x: X.I - 520, y: SABUK_Y - 40 };
const kemampuan = (k: number) => 260 + 900 * (Math.log10(k) / Math.log10(75));
export const StasiunI: React.FC<{ T: WaktuL }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < T.s[13].mulai - 0.8) return null;
  const M = MENARA;
  const g = tumbuhBatang(t, T);
  const tinggi = 75 * M.satuan * g;
  const takaranPop = pegas(t, T.n200 - 0.1, fps, { damping: 11, stiffness: 200, mass: 0.6 });
  const muncul = maju(t, T.s[13].mulai - 0.4, T.s[13].mulai);
  const titik = [1, 10, 20, 30, 40, 50, 60, 70, 75];
  const mulaiBatang = T.ternyata + 0.45;
  const akhirBatang = T.bagus - 0.1;
  const pergi = maju(t, T.loop - 0.35, T.loop, EASE.keluar);
  return (
    <div style={{ opacity: muncul * (1 - pergi) }}>
      {/* rel menara (bayangan 75 balok) */}
      <div style={{ position: 'absolute', left: M.x - M.lebar / 2, top: M.dasar - 75 * M.satuan, width: M.lebar, height: 75 * M.satuan, borderRadius: 14, background: 'rgba(18,29,54,0.6)', border: `2px dashed ${K.garis}`, opacity: maju(t, T.n75 - 0.3, T.n75) }} />
      {/* menara 15 triliun (tumbuh ke atas) */}
      {g > 0 ? (
        <div style={{ position: 'absolute', left: M.x - M.lebar / 2, top: M.dasar - Math.max(M.satuan, tinggi), width: M.lebar, height: Math.max(M.satuan, tinggi), borderRadius: 14, background: `repeating-linear-gradient(0deg, ${K.teal} 0 ${M.satuan - 6}px, ${K.tealTua} ${M.satuan - 6}px ${M.satuan}px)`, boxShadow: `0 0 40px rgba(61,219,200,0.35)` }} />
      ) : null}
      {/* skala ×10 … ×70 */}
      {Array.from({ length: 7 }, (_, i) => {
        const k = (i + 1) * 10;
        const y = M.dasar - k * M.satuan;
        return (
          <div key={i} style={{ position: 'absolute', left: M.x + M.lebar / 2 + 24, top: y - 26, fontFamily: MONO, fontWeight: 700, fontSize: 44, color: K.abu, opacity: maju(t, T.n75 - 0.1 + i * 0.13, T.n75 + 0.1 + i * 0.13), whiteSpace: 'nowrap' }}>
            — ×{k}
          </div>
        );
      })}
      {/* takaran 200 miliar = 1 balok */}
      {t > T.takaran - 0.3 ? (
        <>
          <div style={{ position: 'absolute', left: M.x - M.lebar / 2, top: M.dasar - M.satuan, width: M.lebar, height: M.satuan - 4, borderRadius: 12, background: K.kuning, opacity: maju(t, T.takaran - 0.3, T.takaran) }} />
          <div style={{ position: 'absolute', left: M.x + M.lebar / 2 + 30, top: M.dasar - 180, scale: String(takaranPop), transformOrigin: '0 100%', whiteSpace: 'nowrap', opacity: 1 - maju(t, T.n75 + 0.2, T.n75 + 0.5) }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, color: K.abu }}>takaran</div>
            <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 76, lineHeight: 1, color: K.kuning }}>200 miliar</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: K.abu, marginTop: 4 }}>= 1 balok</div>
          </div>
        </>
      ) : null}
      {/* ujung menara: ×N */}
      {g > 0.02 ? (
        <div style={{ position: 'absolute', left: M.x + M.lebar / 2 + 30, top: M.dasar - Math.max(M.satuan, tinggi) - 60, whiteSpace: 'nowrap' }}>
          <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 110, lineHeight: 1, color: K.teal, fontVariantNumeric: 'tabular-nums' }}>
            ×<AngkaJalan dari={1} ke={75} progress={g} />
          </div>
          {g > 0.98 ? <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 38, color: K.tinta, marginTop: 6 }}>15 triliun token</div> : null}
        </div>
      ) : null}
      {/* batang kemampuan: makin ke atas makin panjang (masih terus naik) */}
      {t > mulaiBatang - 0.1 ? (
        <>
          {titik.map((k, i) => {
            const m = mulaiBatang + ((akhirBatang - mulaiBatang) * i) / (titik.length - 1);
            const p = maju(t, m, m + 0.3, EASE.masuk);
            const L = kemampuan(k);
            // batang tebel (±300 px dunia) biar kebaca pas kamera mundur jauh
            const y = M.dasar - k * M.satuan - 230;
            return <div key={k} style={{ position: 'absolute', left: M.x - M.lebar / 2 - 40 - L * p, top: y, width: L * p, height: 300, borderRadius: 28, background: K.kuning, opacity: 0.35 + 0.65 * p }} />;
          })}
          {/* label sebaris sama batang paling atas, di kirinya (gak masuk zona judul) */}
          <div style={{ position: 'absolute', left: M.x - M.lebar / 2 - 100 - kemampuan(75) - 2600, top: M.dasar - 75 * M.satuan - 260, width: 2600, textAlign: 'right', fontFamily: TANGAN, fontWeight: 700, fontSize: 300, lineHeight: 1, color: K.kuning, opacity: maju(t, T.bagus - 0.2, T.bagus + 0.1), whiteSpace: 'nowrap' }}>masih naik ↑</div>
          <div style={{ position: 'absolute', left: M.x - M.lebar / 2 - 40 - kemampuan(75), top: M.dasar + 60, width: kemampuan(75), textAlign: 'right', fontFamily: MONO, fontWeight: 700, fontSize: 190, color: K.abu, opacity: maju(t, mulaiBatang, mulaiBatang + 0.3), whiteSpace: 'nowrap' }}>← kemampuan</div>
        </>
      ) : null}
      {/* orang kecil di kaki menara (skala) */}
      <Orang x={ORANG_I.x} y={ORANG_I.y} skala={0.8} baca={(t * 1.1) % 1} warna={K.kuning} />
    </div>
  );
};
