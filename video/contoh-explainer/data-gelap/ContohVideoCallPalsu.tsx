// Frame hero (pembuka, tengah, puncak): 15, 853, 1422.
// contoh video explainer A9 (akun generik, konten contoh): "Video call deepfake bikin karyawan Arup transfer ±US$25 juta".
// SATU DUNIA: jendela video call (6 kotak peserta, "CFO" + rekan + karyawan) di tengah. Hook: uang ngalir keluar (penghitung
// US$25 juta) → kotak peserta glitch "DEEPFAKE" → plakat Arup (firma teknik Inggris, Sydney Opera House digambar) + Hong Kong →
// pesan dari "CFO" soal transaksi rahasia → kail phishing + curiga → balik ke video call: wajah & suara mirip rekan (gelombang
// suara, ✓ kenal) → lencana polisi: semua kotak distempel PALSU → 15 transaksi terbang (HK$200 juta ≈ US$25,6 juta) → telepon
// kantor pusat: ketahuan → pernyataan Arup ke CNN (Mei 2024): suara & gambar palsu ✓, sistem internal gak diretas → CTA → loop.
// Fakta: CNN 04/02/2024 & 16/05/2024 (mengutip Polisi Hong Kong & RTHK, pernyataan Arup). Wajah = ilustrasi, bukan orang asli.
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { Bunyi, Dunia, EASE, formatAngka, GarisDigambar, Grain, maju, noise, pathPanah, pegas, Stempel, Subtitle, useDetik, type KunciKamera, type Kata } from "../../src/gerak";
import { MONO, SAIRA, TANGAN } from "../../src/gerak/font";
import { bunyi, K } from "./raja/gaya";
import type { Kalimat } from "./raja/waktuRaja";
import { CtaSimpanFollow, kameraSeri, LatarSeri, lerp, PeneduhAtas, sorot } from "../../src/gerak/seri/data-gelap/seri";
import { besar, HudTeks, Ikon, Kartu, kecil, Muncul, waktuDasar } from "../../src/gerak/seri/data-gelap/alat19";

export type DataDeepfake = { durasi: number; kata: Kata[]; kalimat?: Kalimat[] };

const VC = { x: 540, y: 900, w: 960, h: 700 };
type Peserta = { nama: string; kulit: string; rambut: string; baju: string; cfo?: boolean; korban?: boolean };
const PESERTA: Peserta[] = [
  { nama: 'CFO', kulit: '#c98b62', rambut: '#2b2b2b', baju: '#2b4c7e', cfo: true },
  { nama: 'rekan', kulit: '#e0b48e', rambut: '#5a3a22', baju: '#6b3a5e' },
  { nama: 'rekan', kulit: '#a86f4c', rambut: '#111111', baju: '#3d6b52' },
  { nama: 'rekan', kulit: '#e8c39e', rambut: '#c9a227', baju: '#7e4a2b' },
  { nama: 'rekan', kulit: '#8d5a3c', rambut: '#1d1d1d', baju: '#44506b' },
  { nama: 'karyawan', kulit: '#d9a77f', rambut: '#222222', baju: '#555f73', korban: true },
];
const KOTAK = (i: number) => {
  const c = i % 3;
  const r = Math.floor(i / 3);
  const w = (VC.w - 40 - 2 * 14) / 3;
  const h = (VC.h - 110 - 14) / 2;
  return { x: VC.x - VC.w / 2 + 20 + c * (w + 14), y: VC.y - VC.h / 2 + 70 + r * (h + 14), w, h };
};

function waktuDeepfake(d: Kata[], kal: Kalimat[] | undefined, total: number) {
  const W = waktuDasar(d, kal, total, 10);
  const { s, k } = W;
  const transfer = k('transfer', s[0].mulai, s[0].mulai + 0.6);
  const n25 = k('25', transfer, transfer + 0.6);
  const video0 = k('video', n25, n25 + 1.0);
  const deepfake = k('deepfake', video0, s[0].akhir - 0.6);
  const hongkong = k('hong', s[1].mulai, s[1].mulai + 0.8);
  const arup = k('arup', hongkong, hongkong + 0.6);
  const inggris1 = k('inggris', arup, arup + 1.2);
  const sydney = k('sydney', inggris1, s[1].akhir - 1.0);
  const pesan = k('pesan', s[2].mulai, s[2].mulai + 0.6);
  const cfo = k('cfo', pesan, pesan + 1.0);
  const rahasia = k('rahasia', cfo, s[2].akhir - 0.4);
  const curiga = k('curiga', s[3].mulai, s[3].mulai + 0.4);
  const phishing = k('phishing', curiga, s[3].akhir - 0.4);
  const kelihatan = k('kelihatan', s[4].mulai, s[4].mulai + 1.4);
  const kedengeran = k('kedengeran', kelihatan, kelihatan + 0.6);
  const kenal = k('kenal', kedengeran, s[4].akhir - 0.3);
  const polisi = k('polisi', s[5].mulai, s[5].mulai);
  const palsu5 = k('palsu', polisi, s[5].akhir - 0.3);
  const n200 = k('200', s[6].mulai, s[6].mulai + 0.6);
  const n256 = k('25', n200, n200 + 1.6);
  const n15 = k('15', n256, s[6].akhir - 0.6);
  const ketahuan = k('ketahuan', s[7].mulai, s[7].mulai + 0.6);
  const pusat = k('pusat', ketahuan, s[7].akhir - 0.3);
  const mei = k('mei', s[8].mulai, s[8].mulai + 0.4);
  const cnn = k('cnn', mei, mei + 1.4);
  const suara8 = k('suara', cnn, cnn + 0.6);
  const diretas = k('diretas', suara8, s[8].akhir - 0.3);
  const gak8 = k('gak', suara8, diretas - 1.0);
  return {
    ...W, transfer, n25, video0, deepfake, hongkong, arup, inggris1, sydney, pesan, cfo, rahasia, curiga, phishing, kelihatan, kedengeran, kenal,
    polisi, palsu5, n200, n256, n15, ketahuan, pusat, mei, cnn, suara8, gak8, diretas,
  };
}
type WD = ReturnType<typeof waktuDeepfake>;

// ===============================================================================================================
export const ContohVideoCallPalsu: React.FC<DataDeepfake> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuDeepfake(d.kata, d.kalimat, total), [d.kata, d.kalimat, total]);
  const S = T.s;
  const pelan = Easing.linear;
  const kunci: KunciKamera[] = [
    { t: 0, x: 540, y: 960, z: 1.0 },
    { t: 0.6, x: 540, y: 960, z: 1.04 },
    { t: T.deepfake - 0.3, x: 546, y: 950, z: 1.08, ease: pelan },
    { t: T.deepfake + 0.4, x: 540, y: 930, z: 1.0 },
    { t: S[1].mulai - 0.1, x: 536, y: 934, z: 1.02, ease: pelan },
    { t: S[1].mulai + 0.5, x: 540, y: 960, z: 0.92 },
    { t: S[4].mulai - 0.1, x: 544, y: 956, z: 0.95, ease: pelan },
    { t: S[4].mulai + 0.6, x: 540, y: 920, z: 1.05 },
    { t: S[5].mulai - 0.1, x: 546, y: 916, z: 1.09, ease: pelan },
    { t: S[5].mulai + 0.4, x: 540, y: 930, z: 1.0 },
    { t: S[6].mulai - 0.1, x: 536, y: 934, z: 1.03, ease: pelan },
    { t: S[6].mulai + 0.5, x: 540, y: 960, z: 0.9 },
    { t: T.keluarDunia, x: 546, y: 956, z: 0.95, ease: pelan },
    { t: T.simpan + 0.8, x: 540, y: 960, z: 1.0 },
    { t: T.loop, x: 540, y: 960, z: 1.02, ease: pelan },
    { t: total, x: 540, y: 960, z: 1.0 },
  ];
  const kam = kameraSeri(kunci, t, fps, total, [
    { t: T.deepfake + 0.05, kuat: 9, lama: 0.16 },
    { t: T.palsu5 + 0.1, kuat: 7, lama: 0.14 },
  ]);
  return (
    <AbsoluteFill style={{ background: K.latar, color: K.tinta, overflow: 'hidden', fontFamily: SAIRA }}>
      <LatarSeri kam={kam} kabut={['255,107,87', '58,96,255', '61,219,200']} />
      <Dunia kamera={kam} tinggiDunia={2000} lebarDunia={1300} blurGerak={1300}>
        <VideoCall T={T} />
      </Dunia>
      <PeneduhAtas />
      <Arus T={T} />
      <Plakat T={T} />
      <Pesan T={T} />
      <Transaksi T={T} />
      <Pusat T={T} />
      <Pernyataan T={T} />
      <Hud T={T} />
      <CtaSimpanFollow simpan={T.simpan + 0.1} follow={T.follow} keluar={T.keluarCta} />
      <Subtitle
        kata={d.kata} kalimat={d.kalimat} font={SAIRA} tebal={700} ukuran={46} maksHuruf={32} sorot={K.kuning} sampai={T.akhirVO + 0.3}
        zona={[{ dari: 0, x: 540, y: 1326, lebar: 940 }]} pita="rgba(7,12,24,0.55)"
      />
      <Grain kuat={0.07} garisScan={0} vinyet={0.5} warnaVinyet="2,5,14" />
      <></>
    </AbsoluteFill>
  );
};

// ===============================================================================================================
const redupDunia = (T: WD, t: number) => {
  const S = T.s;
  const r = (a: number, b: number, kuat: number) => kuat * maju(t, a, a + 0.3) * (1 - maju(t, b - 0.2, b + 0.1));
  return Math.max(r(S[1].mulai, S[4].mulai, 0.75), r(S[6].mulai, S[9].mulai, 0.75));
};

export const Wajah: React.FC<{ p: Peserta; w: number; h: number; t: number; seed: string; ngomong?: number }> = ({ p, w, h, t, seed, ngomong = 0 }) => {
  const kedip = (t * 0.7 + random(seed) * 3) % 3.2 < 0.12;
  const mulut = ngomong > 0 ? 3 + 9 * Math.abs(noise(`${seed}m`, t * 7)) * ngomong : 3;
  const geleng = noise(`${seed}g`, t * 0.6) * 6;
  return (
    <svg width={w} height={h} viewBox="0 0 200 190" preserveAspectRatio="xMidYMax meet" style={{ position: 'absolute', left: 0, bottom: 0 }}>
      <g transform={`translate(${geleng} 0)`}>
        <path d="M 30 190 Q 30 128 100 124 Q 170 128 170 190 Z" fill={p.baju} />
        <rect x={88} y={104} width={24} height={26} fill={p.kulit} />
        <ellipse cx={100} cy={78} rx={42} ry={50} fill={p.kulit} />
        <path d="M 58 70 Q 56 26 100 26 Q 144 26 142 70 Q 128 46 100 48 Q 72 46 58 70 Z" fill={p.rambut} />
        {kedip ? (
          <>
            <path d="M 80 82 L 92 82" stroke="#1a1a1a" strokeWidth={4} strokeLinecap="round" />
            <path d="M 108 82 L 120 82" stroke="#1a1a1a" strokeWidth={4} strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx={86} cy={82} r={5} fill="#1a1a1a" />
            <circle cx={114} cy={82} r={5} fill="#1a1a1a" />
          </>
        )}
        <ellipse cx={100} cy={106} rx={10} ry={mulut / 2} fill="#5a2a22" />
      </g>
    </svg>
  );
};

export const VideoCall: React.FC<{ T: WD; sampul?: boolean }> = ({ T, sampul }) => {
  const t0 = useDetik();
  const t = sampul ? T.deepfake + 0.6 : t0;
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < 0.04) return null;
  const masuk = sampul ? 1 : pegas(t, 0.05, fps, { damping: 14, stiffness: 170, mass: 0.7 });
  const keluar = sampul ? 0 : maju(t, T.keluarDunia, T.keluarDunia + 0.45, EASE.keluar);
  const redup = sampul ? 0 : redupDunia(T, t);
  const deep = maju(t, T.deepfake - 0.1, T.deepfake + 0.15) * (1 - maju(t, S[1].mulai - 0.3, S[1].mulai));
  const ngomong = maju(t, T.kelihatan - 0.2, T.kelihatan) * (1 - maju(t, S[5].mulai - 0.1, S[5].mulai + 0.2));
  const kenal = t > T.kenal - 0.2 && t < S[5].mulai + 0.2;
  const napas = 1 + 0.006 * Math.sin(t * 1.6);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: (1 - keluar) * Math.min(1, masuk * 2), filter: redup > 0 ? `brightness(${1 - redup})` : undefined }}>
      <div style={{ position: 'absolute', left: VC.x - VC.w / 2, top: VC.y - VC.h / 2, width: VC.w, height: VC.h, scale: String(lerp(0.9, 1, Math.min(1, masuk)) * napas), borderRadius: 24, background: '#11161f', border: '4px solid #2c3445', boxShadow: '0 40px 90px rgba(0,0,0,0.55)' }}>
        <div style={{ position: 'absolute', left: 24, top: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 16, height: 16, borderRadius: 8, background: K.merah, opacity: Math.floor(t * 2) % 2 ? 0.4 : 1 }} />
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: '#c9d2e0' }}>rapat online · 6 peserta</span>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 10, display: 'flex', justifyContent: 'center', gap: 18 }}>
          {[K.abu, K.abu, K.merah].map((w, i) => (
            <div key={i} style={{ width: 54, height: 30, borderRadius: 15, background: w, opacity: 0.8 }} />
          ))}
        </div>
      </div>
      {PESERTA.map((p, i) => {
        const b = KOTAK(i);
        const m = sampul ? 1 : pegas(t, 0.15 + i * 0.07, fps, { damping: 13, stiffness: 190, mass: 0.6 });
        const palsu = !p.korban && t > T.palsu5 - 0.6 + i * 0.12 && t < T.keluarDunia + 0.5 && !sampul;
        const gl = p.korban ? 0 : Math.max(deep, sampul ? 1 : 0);
        const geser = gl > 0 ? (random(`gl${i}${Math.floor(t * 15)}`) - 0.5) * 18 * gl : 0;
        const bicara = p.korban ? 0 : ngomong * (0.4 + 0.6 * Math.max(0, noise(`bc${i}`, t * 1.5)));
        return (
          <div key={i} style={{ position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, scale: String(Math.max(0.001, m) * napas), borderRadius: 14, overflow: 'hidden', background: p.korban ? '#1e2a3d' : '#26324a', border: `4px solid ${p.cfo ? K.kuning : p.korban ? K.teal : '#3b4660'}` }}>
            <div style={{ position: 'absolute', inset: 0, translate: `${geser.toFixed(1)}px 0` }}>
              <Wajah p={p} w={b.w} h={b.h} t={t} seed={`w${i}`} ngomong={bicara} />
            </div>
            {gl > 0 ? (
              <>
                <div style={{ position: 'absolute', inset: 0, translate: `${(-geser * 1.4).toFixed(1)}px 0`, mixBlendMode: 'screen', opacity: 0.55 * gl }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,40,60,0.35)' }} />
                </div>
                {Array.from({ length: 4 }, (_, j) => (
                  <div key={j} style={{ position: 'absolute', left: 0, right: 0, top: `${(random(`sl${i}${j}${Math.floor(t * 12)}`) * 100).toFixed(1)}%`, height: 10, background: 'rgba(61,219,200,0.7)', translate: `${((random(`sx${i}${j}${Math.floor(t * 12)}`) - 0.5) * 40).toFixed(1)}px 0`, opacity: gl }} />
                ))}
                <div style={{ position: 'absolute', left: '50%', top: '50%', translate: '-50% -50%', padding: '2px 12px', borderRadius: 8, background: K.merah, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 36, opacity: gl, whiteSpace: 'nowrap' }}>DEEPFAKE</div>
              </>
            ) : null}
            {/* gelombang suara pas ngomong */}
            {bicara > 0.1 ? (
              <svg width={80} height={30} viewBox="0 0 80 30" style={{ position: 'absolute', right: 10, top: 10 }}>
                {Array.from({ length: 6 }, (_, j) => {
                  const hh = 4 + 22 * Math.abs(noise(`sw${i}${j}`, t * 8)) * bicara;
                  return <rect key={j} x={j * 13} y={15 - hh / 2} width={7} height={hh} rx={3} fill={K.teal} />;
                })}
              </svg>
            ) : null}
            <div style={{ position: 'absolute', left: 10, bottom: 8, padding: '0 10px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', fontFamily: MONO, fontWeight: 700, fontSize: 22, color: p.cfo ? K.kuning : '#e8edf4' }}>
              {p.cfo ? '"CFO" Inggris' : p.korban ? 'karyawan HK' : p.nama}
            </div>
            {kenal && !p.korban ? (
              <div style={{ position: 'absolute', right: 10, bottom: 8, padding: '0 10px', borderRadius: 8, background: K.teal, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 28, opacity: maju(t, T.kenal - 0.2 + i * 0.06, T.kenal + i * 0.06) }}>kenal ✓</div>
            ) : null}
            {palsu ? (
              <div style={{ position: 'absolute', left: '50%', top: '45%', translate: '-50% -50%' }}>
                <Stempel mulai={T.palsu5 - 0.6 + i * 0.12} rot={-10} dari={1.8} gaya={{ padding: '2px 18px', borderRadius: 10, border: `6px solid ${K.merah}`, background: 'rgba(7,12,24,0.75)', fontFamily: SAIRA, fontWeight: 800, fontSize: 52, color: K.merah }}>
                  PALSU
                </Stempel>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

// hook: uang ngalir keluar dari kotak karyawan + penghitung US$25 juta
const Arus: React.FC<{ T: WD }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < T.transfer - 0.3 || t > S[1].mulai + 0.2) return null;
  const o = maju(t, T.transfer - 0.3, T.transfer) * (1 - maju(t, S[1].mulai - 0.3, S[1].mulai));
  const p = maju(t, T.transfer - 0.2, T.n25 + 0.5, EASE.kamera);
  const b = KOTAK(5);
  const sx = b.x + b.w / 2;
  const sy = b.y + b.h;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: o }}>
      {Array.from({ length: 10 }, (_, i) => {
        const f = (t * 1.1 + i / 10) % 1;
        const x = lerp(sx, 900 + 60 * Math.sin(i), f);
        const y = lerp(sy, 1300, f) - Math.sin(Math.PI * f) * 80;
        return (
          <div key={i} style={{ position: 'absolute', left: x - 34, top: y - 18, width: 68, height: 36, borderRadius: 6, background: '#5fae6e', border: '3px solid #2e6b3a', rotate: `${(f * 60 - 20).toFixed(1)}deg`, opacity: Math.sin(Math.PI * f), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SAIRA, fontWeight: 800, fontSize: 24, color: '#1d4426' }}>$</div>
        );
      })}
      <div style={{ position: 'absolute', left: 540, top: 1200, translate: '-50% -50%', display: 'flex', alignItems: 'baseline', gap: 12, padding: '8px 28px', borderRadius: 18, background: 'rgba(7,12,24,0.95)', border: `5px solid ${K.merah}`, whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: K.abu }}>ditransfer ±</span>
        <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 80, color: K.merah, fontVariantNumeric: 'tabular-nums' }}>US${formatAngka(Math.round(25 * p))}</span>
        <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 56, color: K.tinta }}>juta</span>
      </div>
    </div>
  );
};

// ===============================================================================================================
// HUD
const Plakat: React.FC<{ T: WD }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[1].mulai - 0.1 || t > S[2].mulai + 0.3) return null;
  const kel = S[2].mulai - 0.25;
  return (
    <>
      <Muncul mulai={T.hongkong - 0.15} keluar={kel} x={540} y={600} seed="hk">
        <Kartu warna={K.merah} gaya={{ display: 'flex', alignItems: 'center', gap: 14, padding: '8px 26px' }}>
          <svg width={50} height={64} viewBox="0 0 50 64">
            <path d="M 25 62 Q 4 36 4 22 Q 4 4 25 4 Q 46 4 46 22 Q 46 36 25 62 Z" fill={K.merah} />
            <circle cx={25} cy={22} r={8} fill={K.latar} />
          </svg>
          {besar('kantor Hong Kong', K.tinta, 56)}
        </Kartu>
      </Muncul>
      <Muncul mulai={T.arup - 0.1} keluar={kel + 0.04} x={540} y={800} seed="ar">
        <Kartu warna={K.teal} gaya={{ padding: '12px 32px' }}>
          {besar('Arup', K.tinta, 76)}
          {kecil('firma teknik asal Inggris', K.teal, 28)}
        </Kartu>
      </Muncul>
      <Muncul mulai={T.sydney - 0.2} keluar={kel + 0.08} x={540} y={1060} seed="so">
        <Kartu warna={K.kuning} gaya={{ display: 'flex', alignItems: 'center', gap: 20, padding: '10px 28px' }}>
          <svg width={170} height={90} viewBox="0 0 170 90">
            {['M 10 80 Q 30 20 60 10 Q 50 50 60 80', 'M 50 80 Q 70 25 100 18 Q 90 55 98 80', 'M 90 80 Q 110 35 135 30 Q 128 60 134 80', 'M 125 80 Q 140 50 160 48 Q 154 66 158 80', 'M 4 82 L 166 82'].map((dd, i) => (
              <GarisDigambar key={i} d={dd} mulai={T.sydney - 0.1 + i * 0.07} lama={0.3} warna={K.kuning} tebal={5} />
            ))}
          </svg>
          <div>
            {kecil('ikut ngerjain', K.abu, 24)}
            {besar('Sydney Opera House', K.tinta, 48)}
          </div>
        </Kartu>
      </Muncul>
    </>
  );
};

const Pesan: React.FC<{ T: WD }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[2].mulai - 0.1 || t > S[4].mulai + 0.3) return null;
  const kel = S[4].mulai - 0.25;
  const curiga = maju(t, T.curiga - 0.2, T.phishing + 0.3, EASE.kamera);
  const kail = pegas(t, T.phishing - 0.2, fps, { damping: 9, stiffness: 160, mass: 0.6 });
  return (
    <>
      <Muncul mulai={T.pesan - 0.1} keluar={kel} x={540} y={800} seed="ps">
        <div style={{ position: 'relative', width: 820, padding: '22px 28px', borderRadius: 22, background: '#f4f4f1', color: '#1a1a1a', boxShadow: '0 30px 70px rgba(0,0,0,0.5)', rotate: `${(-1 + noise('pr', t * 0.5)).toFixed(2)}deg` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <Ikon n="surat" warna="#3a4660" uk={50} tebal={8} />
            <div>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: '#666' }}>dari</div>
              <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 44, color: '#1a1a1a' }}>{t > T.cfo - 0.1 ? '"CFO" · kantor Inggris' : '…'}</div>
            </div>
          </div>
          <div style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 46, color: '#222', opacity: maju(t, T.rahasia - 0.4, T.rahasia - 0.1) }}>
            soal: <span style={{ background: K.kuning, padding: '0 8px', borderRadius: 6 }}>transaksi rahasia</span>
          </div>
          {/* kail phishing */}
          {t > T.phishing - 0.2 ? (
            <div style={{ position: 'absolute', right: 40, top: -150, translate: `0 ${(-40 * (1 - Math.min(1.2, kail))).toFixed(1)}px`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 4, height: 90, background: K.abu }} />
              <Ikon n="kaitan" warna={K.merah} uk={90} tebal={9} />
            </div>
          ) : null}
        </div>
      </Muncul>
      {t > T.curiga - 0.2 ? (
        <Muncul mulai={T.curiga - 0.2} keluar={kel + 0.05} x={540} y={1100} seed="cg">
          <Kartu warna={K.merah} gaya={{ display: 'flex', alignItems: 'center', gap: 18, padding: '10px 26px' }}>
            {besar(t > T.phishing - 0.1 ? 'phishing?' : 'penipuan?', K.merah, 60)}
            <div style={{ width: 240, height: 22, borderRadius: 11, background: '#16243f', overflow: 'hidden' }}>
              <div style={{ width: `${(curiga * 100).toFixed(1)}%`, height: 22, background: K.merah }} />
            </div>
            {kecil('curiga', K.abu, 26)}
          </Kartu>
        </Muncul>
      ) : null}
    </>
  );
};

const Transaksi: React.FC<{ T: WD }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[6].mulai - 0.1 || t > S[7].mulai + 0.3) return null;
  const kel = S[7].mulai - 0.25;
  const o = maju(t, S[6].mulai, S[6].mulai + 0.2) * (1 - maju(t, kel, kel + 0.25));
  const a = T.n200 - 0.3;
  const b = Math.max(a + 1.5, T.n15 + 0.4);
  const p = maju(t, a, b, EASE.linear);
  const n = Math.min(15, Math.floor(p * 15.999));
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: o }}>
      <div style={{ position: 'absolute', left: 170, top: 820, translate: '-50% -50%', textAlign: 'center' }}>
        <Kartu warna={K.teal} gaya={{ padding: '14px 18px' }}>
          <Ikon n="gembok" warna={K.teal} uk={70} />
          {kecil('rekening', K.abu, 22)}
          {kecil('perusahaan', K.abu, 22)}
        </Kartu>
      </div>
      <div style={{ position: 'absolute', left: 910, top: 820, translate: '-50% -50%', textAlign: 'center' }}>
        <Kartu warna={K.merah} gaya={{ padding: '14px 18px' }}>
          <Ikon n="awas" warna={K.merah} uk={70} />
          {kecil('rekening', K.abu, 22)}
          {kecil('penipu', K.merah, 22)}
        </Kartu>
      </div>
      {Array.from({ length: 15 }, (_, i) => {
        const m = a + (i / 15) * (b - a);
        const f = maju(t, m, m + 0.55, EASE.kamera);
        if (f <= 0) return null;
        const x = lerp(260, 820, f);
        const y = 820 - Math.sin(Math.PI * f) * (140 + (i % 3) * 40);
        return f < 1 ? (
          <div key={i} style={{ position: 'absolute', left: x - 36, top: y - 22, width: 72, height: 44, borderRadius: 8, background: K.kuning, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>#{i + 1}</div>
        ) : null;
      })}
      <div style={{ position: 'absolute', left: 540, top: 1050, translate: '-50% -50%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '8px 26px', borderRadius: 18, background: 'rgba(7,12,24,0.95)', border: `5px solid ${K.kuning}`, whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 84, color: K.kuning, fontVariantNumeric: 'tabular-nums' }}>HK${formatAngka(Math.round(200 * p))}</span>
          <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 56, color: K.tinta }}>juta</span>
        </div>
        <div style={{ display: 'flex', gap: 22, whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, color: K.abu, opacity: maju(t, T.n256 - 0.2, T.n256) }}>≈ US$25,6 juta</span>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, color: K.teal }}>{n} / 15 transaksi</span>
        </div>
      </div>
    </div>
  );
};

const Pusat: React.FC<{ T: WD }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[7].mulai - 0.1 || t > S[8].mulai + 0.3) return null;
  const kel = S[8].mulai - 0.25;
  const getar = Math.sin(t * 60) * 4 * maju(t, S[7].mulai, S[7].mulai + 0.2) * (1 - maju(t, T.pusat - 0.2, T.pusat));
  return (
    <>
      <Muncul mulai={S[7].mulai + 0.05} keluar={kel} x={540} y={760} seed="kp">
        <Kartu warna={K.teal} gaya={{ display: 'flex', alignItems: 'center', gap: 22, padding: '14px 30px', translate: `${getar.toFixed(1)}px 0` }}>
          <Ikon n="telepon" warna={K.teal} uk={80} />
          <div>
            {kecil('ngecek ke', K.abu, 26)}
            {besar('kantor pusat', K.tinta, 66)}
          </div>
        </Kartu>
      </Muncul>
      <Muncul mulai={T.ketahuan - 0.05} keluar={kel + 0.05} x={540} y={1030} seed="kt">
        <Stempel mulai={T.ketahuan - 0.05} rot={-6} gaya={{ padding: '6px 30px', borderRadius: 16, border: `7px solid ${K.merah}`, background: 'rgba(7,12,24,0.9)', fontFamily: SAIRA, fontWeight: 800, fontSize: 84, color: K.merah, whiteSpace: 'nowrap' }}>
          ketahuan: penipuan!
        </Stempel>
      </Muncul>
    </>
  );
};

const Pernyataan: React.FC<{ T: WD }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[8].mulai - 0.1 || t > T.keluarDunia + 0.3) return null;
  const kel = T.keluarDunia - 0.1;
  const baris = (y: number, m: number, isi: React.ReactNode, w: string, ikon: string, i: number) => (
    <Muncul mulai={m} keluar={kel + i * 0.05} x={540} y={y} seed={`pn${i}`}>
      <Kartu warna={w} gaya={{ width: 860, display: 'flex', alignItems: 'center', gap: 20, padding: '14px 26px' }}>
        <Ikon n={ikon} warna={w} uk={66} tebal={9} />
        {isi}
      </Kartu>
    </Muncul>
  );
  return (
    <>
      <Muncul mulai={S[8].mulai + 0.05} keluar={kel} x={540} y={640} seed="cnn">
        <Kartu warna={K.tinta} gaya={{ display: 'flex', alignItems: 'center', gap: 18, padding: '10px 28px' }}>
          <div style={{ padding: '2px 14px', borderRadius: 8, background: '#cc0000', fontFamily: SAIRA, fontWeight: 800, fontSize: 46, color: '#fff' }}>CNN</div>
          {besar('pernyataan Arup · Mei 2024', K.tinta, 50)}
        </Kartu>
      </Muncul>
      {baris(860, T.suara8 - 0.2, besar('suara & gambar palsu dipakai', K.tinta, 52), K.merah, 'centang', 0)}
      {baris(1080, T.gak8 - 0.1, besar('sistem internal gak diretas', K.tinta, 52), K.teal, 'perisai', 1)}
    </>
  );
};

const Hud: React.FC<{ T: WD }> = ({ T }) => {
  const S = T.s;
  return (
    <HudTeks
      T={T}
      sumber={() => 'Sumber: CNN (4 Feb & 16 Mei 2024) · Polisi Hong Kong'}
      teks={[
        { label: ['KARYAWAN', 'TRANSFER'], judul: [{ t: 'US$25', mulai: T.n25, warna: K.kuning }, { t: 'juta', mulai: T.n25 + 0.2, warna: K.kuning }, { t: '·', mulai: T.video0 - 0.1, warna: K.abu }, { t: 'video', mulai: T.video0 }, { t: 'call', mulai: T.video0 + 0.15 }, { t: 'deepfake', mulai: T.deepfake, isi: sorot('deepfake', T.deepfake + 0.15, K.merah) }], jMulai: T.n25 },
        { label: ['KEJADIANNYA', 'DI'], judul: [{ t: 'Hong', mulai: T.hongkong }, { t: 'Kong', mulai: T.hongkong + 0.15 }, { t: '·', mulai: T.arup - 0.1, warna: K.abu }, { t: 'Arup', mulai: T.arup, warna: K.teal }] },
        { label: ['AWALNYA'], judul: [{ t: '"CFO":', mulai: T.cfo, warna: K.kuning }, { t: 'transaksi', mulai: T.rahasia - 0.3 }, { t: 'rahasia', mulai: T.rahasia, isi: sorot('rahasia', T.rahasia + 0.1) }] },
        { label: ['DIA', 'SEMPAT'], judul: [{ t: 'curiga', mulai: T.curiga, warna: K.merah }, { t: 'phishing', mulai: T.phishing }] },
        { label: ['DI', 'VIDEO', 'CALL'], judul: [{ t: 'wajah', mulai: T.kelihatan }, { t: '&', mulai: T.kedengeran - 0.1, warna: K.abu }, { t: 'suara', mulai: T.kedengeran }, { t: 'mirip', mulai: T.kenal - 0.3, warna: K.teal }, { t: 'rekan', mulai: T.kenal, warna: K.teal }], ukuran: 84 },
        { label: ['KATA', 'POLISI', 'HONG', 'KONG'], judul: [{ t: 'semua', mulai: T.polisi + 0.3 }, { t: 'di', mulai: T.polisi + 0.45 }, { t: 'layar', mulai: T.polisi + 0.6 }, { t: 'palsu', mulai: T.palsu5, isi: sorot('palsu', T.palsu5 + 0.1, K.merah) }] },
        { label: ['DIKIRIM'], judul: [{ t: 'HK$200', mulai: T.n200, warna: K.kuning }, { t: 'juta', mulai: T.n200 + 0.2, warna: K.kuning }, { t: '·', mulai: T.n15 - 0.1, warna: K.abu }, { t: '15', mulai: T.n15, warna: K.teal }, { t: 'transaksi', mulai: T.n15 + 0.15 }], ukuran: 84 },
        { label: ['KETAHUAN'], judul: [{ t: 'pas', mulai: T.ketahuan }, { t: 'cek', mulai: T.ketahuan + 0.15 }, { t: 'kantor', mulai: T.pusat - 0.25 }, { t: 'pusat', mulai: T.pusat, warna: K.teal }] },
        { label: ['MEI', '2024'], judul: [{ t: 'Arup:', mulai: T.cnn, warna: K.teal }, { t: 'suara', mulai: T.suara8 }, { t: '&', mulai: T.suara8 + 0.15, warna: K.abu }, { t: 'gambar', mulai: T.suara8 + 0.3 }, { t: 'palsu', mulai: T.suara8 + 0.5, warna: K.merah }], ukuran: 84 },
        { label: ['KIRIM', 'KE', 'TIM', 'KEUANGAN'], judul: [{ t: 'simpan', mulai: T.simpan + 0.05, warna: K.kuning }, { t: '&', mulai: T.follow - 0.25, warna: K.abu }, { t: 'follow', mulai: T.follow, warna: K.teal }], jMulai: T.simpan },
      ]}
    />
  );
};

function daftarSfx(T: WD) {
  const S = T.s;
  const masuk = PESERTA.map((_, i) => bunyi('tik', 0.15 + i * 0.07, 0.14));
  const uang = Array.from({ length: 8 }, (_, i) => bunyi('tik', T.transfer - 0.2 + i * ((Math.max(0.6, T.n25 + 0.5 - T.transfer)) / 8), 0.12));
  const palsu = Array.from({ length: 5 }, (_, i) => bunyi('hantam', T.palsu5 - 0.52 + i * 0.12, 0.22));
  const tr = Array.from({ length: 15 }, (_, i) => bunyi('tik', T.n200 - 0.3 + (i / 15) * (Math.max(1.5, T.n15 + 0.7 - T.n200)), 0.1));
  return [
    ...masuk,
    ...uang,
    bunyi('glitch', T.deepfake - 0.05, 0.45),
    bunyi('glitch', T.deepfake + 0.25, 0.3),
    bunyi('whooshA', S[1].mulai, 0.3),
    bunyi('pop', T.hongkong, 0.3),
    bunyi('pop', T.arup, 0.3),
    bunyi('swish', T.sydney, 0.25),
    bunyi('whooshB', S[2].mulai, 0.3),
    bunyi('pop', T.pesan, 0.3),
    bunyi('kunci', T.rahasia, 0.3),
    bunyi('whooshTurun', T.phishing - 0.2, 0.3),
    bunyi('pop', T.curiga, 0.25),
    bunyi('whooshLembut', S[4].mulai, 0.3),
    bunyi('pop', T.kenal, 0.3),
    bunyi('whooshPunch', S[5].mulai, 0.3),
    ...palsu,
    bunyi('whooshA', S[6].mulai, 0.3),
    ...tr,
    bunyi('kunci', T.n15 + 0.4, 0.3),
    bunyi('whooshB', S[7].mulai, 0.3),
    bunyi('hantam', T.ketahuan + 0.03, 0.45),
    bunyi('jepret', T.ketahuan + 0.05, 0.3),
    bunyi('whooshA', S[8].mulai, 0.3),
    bunyi('pop', T.suara8, 0.3),
    bunyi('pop', T.gak8, 0.3),
    bunyi('whooshTerang', T.keluarDunia + 0.1, 0.3),
    bunyi('pop', T.simpan + 0.15, 0.35),
    bunyi('klik', T.simpan + 0.65, 0.4),
    bunyi('pop', T.follow - 0.2, 0.3),
    bunyi('klik', T.follow + 0.3, 0.4),
    bunyi('whooshLembut', T.keluarCta + 0.05, 0.3),
  ];
}

// ===============================================================================================================
// SAMPUL: "Semua di video call ini palsu" + grid deepfake
export const ContohVideoCallPalsuSampul: React.FC = () => {
  const T = waktuDeepfake([], undefined, 59);
  const kam = { x: 540, y: 960, z: 1, vx: 0, vy: 0, lebar: 1080, tinggi: 1920 };
  return (
    <AbsoluteFill style={{ background: K.latar, overflow: 'hidden' }}>
      <LatarSeri kam={kam} kabut={['255,107,87', '58,96,255', '61,219,200']} />
      <div style={{ position: 'absolute', left: 0, top: 230, width: 1080, height: 1920 }}>
        <VideoCall T={T} sampul />
      </div>
      <div style={{ position: 'absolute', left: 540, top: 1560, translate: '-50% -50%', rotate: '-3deg', padding: '10px 30px', borderRadius: 16, background: K.merah, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 76, whiteSpace: 'nowrap' }}>
        US$25 juta melayang
      </div>
      <div style={{ position: 'absolute', left: 90, top: 196, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 10, height: 44, borderRadius: 5, background: K.teal }} />
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: K.abu }}>KASUS ARUP · HONG KONG</div>
      </div>
      <div style={{ position: 'absolute', left: 90, top: 262, width: 780, fontFamily: SAIRA, fontWeight: 800, fontSize: 118, lineHeight: 1.04, color: K.tinta }}>
        <div>Rekan kerjanya</div>
        <div>
          ternyata <span style={{ display: 'inline-block', background: K.merah, color: K.latar, padding: '0 0.1em', borderRadius: 12, lineHeight: 0.98 }}>deepfake</span>
        </div>
      </div>
      <Grain kuat={0.06} garisScan={0} vinyet={0.45} warnaVinyet="2,5,14" />
    </AbsoluteFill>
  );
};
