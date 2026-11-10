// Frame hero (pembuka, tengah, puncak): 15, 860, 1434.
// contoh video explainer A10 (akun generik, konten contoh): "Google ngelatih AI HeAR dengerin 300 juta potongan suara".
// SATU DUNIA: dinding petak klip suara (gelombang kecil yang gerak) dengan gelombang batuk besar di tengah. Hook: petak keisi
// (penghitung 300 juta) → ±1/3 nyala kuning = batuk (100 juta) → H-e-A-R jadi Health Acoustic Representations + Google Research
// 2024 → pemutar video publik, jendela 2 detik dipotong (batuk / napas / deham) → HeAR jadi fondasi, AI pendeteksi dibangun di
// atasnya → 33 petak tugas uji (COVID, merokok) + podium peringkat 1 → tumpukan data latihan lebih pendek → HP Swaasa (Salcit, India)
// rekam batuk → TBC bisa diobati tapi banyak orang "?" jauh dari klinik → batang WHO: India 25%, Indonesia 10% (#2) → CTA → loop.
// Fakta: Google blog 19/08/2024 · Baur dkk. arXiv 2403.02522 (2024) · WHO fact sheet TBC (data 2024). Gelombang = ilustrasi.
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { Bunyi, Dunia, EASE, formatAngka, GarisDigambar, Grain, maju, noise, pathPanah, pegas, Stempel, Subtitle, useDetik, type KunciKamera, type Kata } from "../../src/gerak";
import { MONO, SAIRA, TANGAN } from "../../src/gerak/font";
import { bunyi, K } from "./raja/gaya";
import type { Kalimat } from "./raja/waktuRaja";
import { CtaSimpanFollow, kameraSeri, LatarSeri, lerp, PeneduhAtas, sorot } from "../../src/gerak/seri/data-gelap/seri";
import { Batang, besar, HudTeks, Ikon, Kartu, kecil, Muncul, waktuDasar } from "../../src/gerak/seri/data-gelap/alat19";

export type DataBatuk = { durasi: number; kata: Kata[]; kalimat?: Kalimat[] };

const PUSAT = { x: 540, y: 880 };
const KOL = 8;
const BAR = 12;
const L = 128;

function waktuBatuk(d: Kata[], kal: Kalimat[] | undefined, total: number) {
  const W = waktuDasar(d, kal, total, 10);
  const { s, k } = W;
  const n300 = k('300', s[0].mulai, s[0].mulai + 2.2);
  const n100 = k('100', n300, n300 + 1.6);
  const batuk0 = k('batuk', n100, s[0].akhir - 0.3);
  const hear = k('hear', s[1].mulai, s[1].mulai + 0.4);
  const health = k('health', hear, hear + 1.0);
  const acoustic = k('acoustic', health, health + 0.5);
  const repr = k('representations', acoustic, acoustic + 0.6);
  const google = k('google', repr, repr + 1.0);
  const n2024 = k('2024', google, s[1].akhir - 0.4);
  const dua = k('dua', s[2].mulai, s[2].mulai + 0.6);
  const youtube = k('youtube', dua, dua + 1.6);
  const batuk2 = k('batuk', youtube, youtube + 1.0);
  const napas = k('napas', batuk2, batuk2 + 0.5);
  const deham = k('deham', napas, s[2].akhir - 0.3);
  const foundation = k('foundation', s[3].mulai, s[3].mulai + 0.5);
  const dasar = k('dasar', foundation, foundation + 1.0);
  const peneliti = k('peneliti', dasar, dasar + 1.0);
  const pendeteksi = k('pendeteksi', peneliti, s[3].akhir - 0.8);
  const n33 = k('33', s[4].mulai, s[4].mulai + 0.4);
  const covid = k('covid', n33, n33 + 1.4);
  const merokok = k('merokok', covid, covid + 1.0);
  const terbaik = k('terbaik', merokok, s[4].akhir - 0.3);
  const sedikit = k('sedikit', s[5].mulai, s[5].akhir - 0.4);
  const salcit = k('salcit', s[6].mulai, s[6].mulai + 0.3);
  const india6 = k('india', salcit, salcit + 1.2);
  const tbc6 = k('tbc', india6, india6 + 2.0);
  const swaasa = k('swaasa', tbc6, s[6].akhir - 0.5);
  const diobati = k('diobati', s[7].mulai, s[7].mulai + 0.6);
  const jutaan = k('jutaan', diobati, diobati + 1.4);
  const susah = k('susah', jutaan, s[7].akhir - 1.2);
  const who = k('who', s[8].mulai, s[8].mulai + 0.6);
  const indonesia = k('indonesia', who, who + 0.6);
  const n10 = k('10', indonesia, indonesia + 1.0);
  const kedua = k('kedua', n10, s[8].akhir - 1.0);
  const india8 = k('india', kedua, s[8].akhir - 0.4);
  return {
    ...W, n300, n100, batuk0, hear, health, acoustic, repr, google, n2024, dua, youtube, batuk2, napas, deham, foundation, dasar, peneliti, pendeteksi,
    n33, covid, merokok, terbaik, sedikit, salcit, india6, tbc6, swaasa, diobati, jutaan, susah, who, indonesia, n10, kedua, india8,
  };
}
type WB = ReturnType<typeof waktuBatuk>;

// gelombang kecil di satu petak (path SVG), bentuk dari benih
const gelombang = (seed: string, w: number, h: number, t: number, batuk: boolean) => {
  let d = '';
  for (let i = 0; i <= 24; i++) {
    const x = (i / 24) * w;
    const env = batuk ? Math.exp(-((i - 6) ** 2) / 10) + 0.35 * Math.exp(-((i - 15) ** 2) / 8) : 0.35 + 0.25 * Math.sin(i * 0.5 + random(seed) * 6);
    const y = h / 2 + Math.sin(i * 2.1 + t * 7 + random(`${seed}f`) * 9) * env * h * 0.42;
    d += `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d;
};

// ===============================================================================================================
export const ContohSuaraBatuk: React.FC<DataBatuk> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuBatuk(d.kata, d.kalimat, total), [d.kata, d.kalimat, total]);
  const S = T.s;
  const pelan = Easing.linear;
  const kunci: KunciKamera[] = [
    { t: 0, x: 540, y: 960, z: 1.0 },
    { t: 0.6, x: 540, y: 900, z: 1.25 },
    { t: T.n300 - 0.3, x: 546, y: 896, z: 1.3, ease: pelan },
    { t: T.n300 + 1.0, x: 540, y: 900, z: 0.82 },
    { t: S[1].mulai - 0.1, x: 536, y: 904, z: 0.85, ease: pelan },
    { t: S[1].mulai + 0.5, x: 540, y: 900, z: 1.0 },
    { t: S[2].mulai - 0.1, x: 544, y: 896, z: 1.03, ease: pelan },
    { t: S[2].mulai + 0.5, x: 540, y: 930, z: 1.05 },
    { t: S[3].mulai - 0.1, x: 536, y: 926, z: 1.08, ease: pelan },
    { t: S[3].mulai + 0.5, x: 540, y: 960, z: 0.92 },
    { t: T.keluarDunia, x: 546, y: 956, z: 0.98, ease: pelan },
    { t: T.simpan + 0.8, x: 540, y: 960, z: 1.0 },
    { t: T.loop, x: 540, y: 960, z: 1.02, ease: pelan },
    { t: total, x: 540, y: 960, z: 1.0 },
  ];
  const kam = kameraSeri(kunci, t, fps, total, [{ t: T.n100 + 0.1, kuat: 6, lama: 0.12 }]);
  return (
    <AbsoluteFill style={{ background: K.latar, color: K.tinta, overflow: 'hidden', fontFamily: SAIRA }}>
      <LatarSeri kam={kam} kabut={['61,219,200', '255,107,87', '255,197,61']} />
      <Dunia kamera={kam} tinggiDunia={2200} lebarDunia={1300} blurGerak={1300}>
        <DindingKlip T={T} />
      </Dunia>
      <PeneduhAtas />
      <Penghitung T={T} />
      <Nama T={T} />
      <Potong T={T} />
      <Fondasi T={T} />
      <Tugas T={T} />
      <Data T={T} />
      <Swaasa T={T} />
      <Tbc T={T} />
      <Who T={T} />
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
// DUNIA: dinding petak klip suara (hook), lalu jadi latar redup yang tetap gerak
export const DindingKlip: React.FC<{ T: WB; sampul?: boolean }> = ({ T, sampul }) => {
  const t0 = useDetik();
  const t = sampul ? T.batuk0 + 0.4 : t0;
  const { fps } = useVideoConfig();
  const S = T.s;
  const urut = useMemo(
    () => Array.from({ length: KOL * BAR }, (_, i) => ({ i, c: i % KOL, r: Math.floor(i / KOL) })).sort((a, b) => Math.hypot(a.c - 3.5, (a.r - 5.5) * 1.1) - Math.hypot(b.c - 3.5, (b.r - 5.5) * 1.1)),
    [],
  );
  if (t < 0.04) return null;
  const keluar = sampul ? 0 : maju(t, T.keluarDunia, T.keluarDunia + 0.45, EASE.keluar);
  const p = sampul ? 1 : maju(t, 0.3, T.n300 + 0.8, EASE.kamera);
  const n = Math.max(1, Math.round(urut.length * p));
  const kuning = sampul ? 1 : maju(t, T.n100 - 0.1, T.n100 + 0.3);
  const redup = sampul ? 0 : 0.72 * maju(t, S[1].mulai, S[1].mulai + 0.4);
  const pudar = sampul ? 0 : 0.45 * maju(t, S[1].mulai, S[1].mulai + 0.4);
  const x0 = PUSAT.x - ((KOL - 1) / 2) * L;
  const y0 = PUSAT.y - ((BAR - 1) / 2) * L;
  const nPotong = Math.round(300 * p);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: (1 - keluar) * (1 - pudar), filter: redup > 0 ? `brightness(${1 - redup})` : undefined }}>
      {urut.slice(0, n).map(({ i, c, r }, j) => {
        const batuk = random(`bt${i}`) < 0.34 || j === 0;
        const nyala = batuk && kuning > 0;
        const m = sampul ? 1 : pegas(t, 0.3 + (j / urut.length) * (T.n300 + 0.5), fps, { damping: 14, stiffness: 220, mass: 0.5 });
        const w = j === 0 ? 220 : 108;
        const h = j === 0 ? 150 : 80;
        return (
          <div key={i} style={{ position: 'absolute', left: x0 + c * L - w / 2, top: y0 + r * L - h / 2, width: w, height: h, scale: String(Math.max(0.001, m)), borderRadius: 12, background: 'rgba(13,23,48,0.95)', border: `3px solid ${nyala ? K.kuning : '#2b3f66'}`, zIndex: j === 0 ? 2 : 1, opacity: !sampul && (r < 1 || r > 8) ? maju(t, S[1].mulai, S[1].mulai + 0.4) : 1 }}>
            <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0 }}>
              <path d={gelombang(`g${i}`, w - 16, h - 16, t + i, batuk)} transform="translate(8 8)" fill="none" stroke={nyala ? K.kuning : K.teal} strokeWidth={j === 0 ? 6 : 4} strokeLinejoin="round" />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

// penghitung 300 juta / 100 juta batuk (layar, di atas subtitle)
const Penghitung: React.FC<{ T: WB }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < 0.5 || t > S[1].mulai + 0.4) return null;
  const p = maju(t, 0.3, T.n300 + 0.8, EASE.kamera);
  const kuning = maju(t, T.n100 - 0.1, T.n100 + 0.3);
  const nPotong = Math.round(300 * p);
  return (
    <div style={{ position: 'absolute', left: 540, top: 1080, translate: '-50% 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: maju(t, 0.6, 0.9) * (1 - maju(t, S[1].mulai, S[1].mulai + 0.3)) }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '6px 26px', borderRadius: 18, background: 'rgba(7,12,24,0.96)', border: `5px solid ${K.teal}`, whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 76, color: K.teal, fontVariantNumeric: 'tabular-nums', minWidth: '1.9em', textAlign: 'right' }}>{formatAngka(nPotong)}</span>
        <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 50, color: K.tinta }}>juta+ potongan suara</span>
      </div>
      {kuning > 0 ? (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '4px 22px', borderRadius: 16, background: K.kuning, whiteSpace: 'nowrap', scale: String(Math.min(1, kuning * 1.2)) }}>
          <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 58, color: K.latar, fontVariantNumeric: 'tabular-nums' }}>±{formatAngka(Math.round(100 * kuning))}</span>
          <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 44, color: K.latar }}>juta suara batuk</span>
        </div>
      ) : null}
    </div>
  );
};

// ===============================================================================================================
// HUD
const Nama: React.FC<{ T: WB }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[1].mulai - 0.1 || t > S[2].mulai + 0.3) return null;
  const kel = S[2].mulai - 0.25;
  const o = maju(t, S[1].mulai, S[1].mulai + 0.2) * (1 - maju(t, kel, kel + 0.25));
  const baris = [
    { h: 'He', sisa: 'alth', m: T.health },
    { h: 'A', sisa: 'coustic', m: T.acoustic },
    { h: 'R', sisa: 'epresentations', m: T.repr },
  ];
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: o }}>
      <div style={{ position: 'absolute', left: 120, top: 560, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {baris.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', fontFamily: SAIRA, fontWeight: 800, fontSize: 110, lineHeight: 1.0, whiteSpace: 'nowrap', opacity: maju(t, T.hear - 0.1 + i * 0.08, T.hear + 0.1 + i * 0.08) }}>
            <span style={{ color: K.kuning }}>{b.h}</span>
            <span style={{ color: K.tinta, fontSize: 84, clipPath: `inset(0 ${((1 - maju(t, b.m - 0.1, b.m + 0.35)) * 100).toFixed(1)}% 0 0)` }}>{b.sisa}</span>
          </div>
        ))}
      </div>
      <Muncul mulai={T.google - 0.1} keluar={kel} x={540} y={1110} seed="gr">
        <Kartu warna={K.teal} gaya={{ display: 'flex', alignItems: 'center', gap: 18, padding: '10px 28px' }}>
          {besar('Google Research', K.tinta, 58)}
          {t > T.n2024 - 0.1 ? <div style={{ padding: '2px 16px', borderRadius: 12, background: K.teal, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 52 }}>2024</div> : null}
        </Kartu>
      </Muncul>
    </div>
  );
};

const Potong: React.FC<{ T: WB }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[2].mulai - 0.1 || t > S[3].mulai + 0.3) return null;
  const kel = S[3].mulai - 0.25;
  const jalan = ((t - S[2].mulai) * 0.12) % 1;
  const potong = maju(t, T.dua - 0.1, T.dua + 0.4, EASE.kamera);
  const label = [
    { teks: 'batuk', m: T.batuk2, w: K.kuning },
    { teks: 'napas', m: T.napas, w: K.teal },
    { teks: 'deham', m: T.deham, w: K.merah },
  ];
  return (
    <>
      <Muncul mulai={S[2].mulai + 0.05} keluar={kel} x={540} y={720} seed="yt">
        <div style={{ width: 820, borderRadius: 22, background: '#0c0f16', border: '4px solid #2c3445', overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.5)' }}>
          <div style={{ height: 300, position: 'relative', background: 'radial-gradient(circle at 50% 40%, #24344f, #0c0f16)' }}>
            <div style={{ position: 'absolute', left: '50%', top: '48%', translate: '-50% -50%', width: 110, height: 76, borderRadius: 20, background: '#e5332a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 0, height: 0, borderTop: '18px solid transparent', borderBottom: '18px solid transparent', borderLeft: '30px solid #fff', marginLeft: 6 }} />
            </div>
            <div style={{ position: 'absolute', left: 20, top: 16, fontFamily: MONO, fontWeight: 700, fontSize: 24, color: '#c9d2e0' }}>video publik · YouTube</div>
          </div>
          {/* lini masa + gelombang + jendela 2 detik */}
          <div style={{ height: 130, position: 'relative', background: '#121827' }}>
            <svg width={820} height={130} style={{ position: 'absolute', left: 0, top: 0 }}>
              <path d={gelombang('yt', 800, 110, t * 0.4, false)} transform="translate(10 10)" fill="none" stroke="#3b5079" strokeWidth={4} />
              <path d={gelombang('ytb', 160, 110, t, true)} transform="translate(330 10)" fill="none" stroke={K.kuning} strokeWidth={6} />
            </svg>
            <div style={{ position: 'absolute', left: 320, top: 6, width: 180, height: 118, borderRadius: 10, border: `5px solid ${K.kuning}`, opacity: maju(t, T.dua - 0.2, T.dua), translate: `0 ${(-potong * 40).toFixed(1)}px` }} />
            <div style={{ position: 'absolute', left: `${(jalan * 100).toFixed(1)}%`, top: 0, width: 4, height: 130, background: K.merah }} />
          </div>
        </div>
      </Muncul>
      <Muncul mulai={T.dua} keluar={kel + 0.04} x={540} y={510} seed="2d">
        <Kartu warna={K.kuning} isi gaya={{ padding: '4px 22px' }}>
          {besar('potongan 2 detik', K.latar, 54)}
        </Kartu>
      </Muncul>
      <div style={{ position: 'absolute', left: 540, top: 1090, translate: '-50% 0', display: 'flex', gap: 20, opacity: 1 - maju(t, kel, kel + 0.2) }}>
        {label.map((l) =>
          t > l.m - 0.15 ? (
            <div key={l.teks} style={{ scale: String(pegas(t, l.m - 0.15, fps, { damping: 11, stiffness: 200, mass: 0.6 })), padding: '6px 24px', borderRadius: 14, background: 'rgba(7,12,24,0.95)', border: `4px solid ${l.w}`, fontFamily: SAIRA, fontWeight: 800, fontSize: 52, color: l.w }}>{l.teks}</div>
          ) : null,
        )}
      </div>
    </>
  );
};

const Fondasi: React.FC<{ T: WB }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[3].mulai - 0.1 || t > S[4].mulai + 0.3) return null;
  const kel = S[4].mulai - 0.25;
  const o = maju(t, S[3].mulai, S[3].mulai + 0.2) * (1 - maju(t, kel, kel + 0.25));
  const atas = [
    { teks: 'AI deteksi TBC', w: K.kuning },
    { teks: 'AI deteksi COVID', w: K.teal },
    { teks: 'AI penyakit paru lain', w: K.merah },
  ];
  const dasarM = pegas(t, T.foundation - 0.1, fps, { damping: 13, stiffness: 160, mass: 0.7 });
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: o }}>
      <div style={{ position: 'absolute', left: 540, top: 1110, translate: '-50% -50%', scale: `${Math.max(0.001, dasarM)} 1`, width: 900, height: 150, borderRadius: 20, background: K.teal, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 50px ${K.teal}55` }}>
        {besar('HeAR', K.latar, 70)}
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, color: K.latar }}>foundation model = model dasar</div>
      </div>
      {atas.map((a, i) => {
        const m = T.pendeteksi - 0.4 + i * 0.18;
        const jatuh = maju(t, m, m + 0.3, EASE.jatuh);
        if (t < m) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: 540 + (i - 1) * 300, top: lerp(500, 920, jatuh), translate: '-50% -50%', width: 280, height: 150, borderRadius: 18, background: 'rgba(7,12,24,0.95)', border: `5px solid ${a.w}`, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: SAIRA, fontWeight: 800, fontSize: 40, color: a.w, padding: 10, boxSizing: 'border-box' }}>
            {a.teks}
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 540, top: 640, translate: '-50% 0', opacity: maju(t, T.peneliti - 0.1, T.peneliti + 0.2) * (1 - maju(t, T.pendeteksi - 0.4, T.pendeteksi - 0.2)), fontFamily: TANGAN, fontWeight: 700, fontSize: 52, color: K.kuning, whiteSpace: 'nowrap' }}>
        peneliti tinggal bangun di atasnya
      </div>
    </div>
  );
};

const Tugas: React.FC<{ T: WB }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[4].mulai - 0.1 || t > S[5].mulai + 0.3) return null;
  const kel = S[5].mulai - 0.25;
  const o = maju(t, S[4].mulai, S[4].mulai + 0.2) * (1 - maju(t, kel, kel + 0.25));
  const n = Math.round(33 * maju(t, T.n33 - 0.2, T.n33 + 0.8, EASE.kamera));
  const podium = pegas(t, T.terbaik - 0.4, fps, { damping: 12, stiffness: 170, mass: 0.6 });
  const pod = [
    { r: 2, h: 150, nama: 'model lain', w: '#3b5079' },
    { r: 1, h: 220, nama: 'HeAR', w: K.kuning },
    { r: 3, h: 110, nama: 'model lain', w: '#3b5079' },
  ];
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: o }}>
      <div style={{ position: 'absolute', left: 540, top: 560, translate: '-50% 0', display: 'grid', gridTemplateColumns: 'repeat(11, 70px)', gap: 8 }}>
        {Array.from({ length: 33 }, (_, i) => {
          const tanda = i === 5 ? 'COVID' : i === 16 ? 'merokok' : '';
          const nyala = i < n;
          const sorotT = (i === 5 && t > T.covid - 0.1) || (i === 16 && t > T.merokok - 0.1);
          return (
            <div key={i} style={{ height: 70, borderRadius: 10, background: sorotT ? K.kuning : nyala ? '#1d8f86' : '#16243f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 800, fontSize: sorotT ? 16 : 20, color: sorotT ? K.latar : K.tinta, scale: String(sorotT ? 1.25 : 1) }}>
              {sorotT ? tanda : nyala ? i + 1 : ''}
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 540, top: 820, translate: '-50% 0', fontFamily: SAIRA, fontWeight: 800, fontSize: 56, color: K.teal, opacity: maju(t, T.n33 - 0.2, T.n33) }}>{n} tugas uji</div>
      {t > T.terbaik - 0.4 ? (
        <div style={{ position: 'absolute', left: 540, top: 1200, translate: '-50% -100%', display: 'flex', alignItems: 'flex-end', gap: 14, scale: `1 ${Math.max(0.001, podium)}`, transformOrigin: '50% 100%' }}>
          {pod.map((p, i) => (
            <div key={i} style={{ width: 230, height: p.h, borderRadius: '14px 14px 0 0', background: p.w, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 10, boxSizing: 'border-box' }}>
              <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 54, color: p.r === 1 ? K.latar : K.tinta }}>#{p.r}</span>
              <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 36, color: p.r === 1 ? K.latar : K.abu }}>{p.nama}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const Data: React.FC<{ T: WB }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[5].mulai - 0.1 || t > S[6].mulai + 0.3) return null;
  const kel = S[6].mulai - 0.25;
  const o = maju(t, S[5].mulai, S[5].mulai + 0.2) * (1 - maju(t, kel, kel + 0.25));
  const a = maju(t, S[5].mulai + 0.1, S[5].mulai + 1.0, EASE.kamera);
  const b = maju(t, T.sedikit - 0.5, T.sedikit + 0.1, EASE.kamera);
  const tumpuk = (n: number, w: string) => (
    <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 6 }}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} style={{ width: 240, height: 34, borderRadius: 6, background: w, opacity: 0.9, boxShadow: 'inset 0 -5px 0 rgba(0,0,0,0.25)' }} />
      ))}
    </div>
  );
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: o }}>
      <div style={{ position: 'absolute', left: 300, top: 1150, translate: '-50% -100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        {tumpuk(Math.round(12 * a), '#3b5079')}
        {besar('model biasa', K.abu, 46)}
      </div>
      <div style={{ position: 'absolute', left: 780, top: 1150, translate: '-50% -100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        {tumpuk(Math.round(5 * b), K.teal)}
        {besar('dibangun dari HeAR', K.teal, 46)}
      </div>
      <div style={{ position: 'absolute', left: 780, top: 600, translate: '-50% 0', fontFamily: MONO, fontWeight: 700, fontSize: 26, color: K.abu, whiteSpace: 'nowrap' }}>data latihan (ilustrasi)</div>
    </div>
  );
};

const Swaasa: React.FC<{ T: WB }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[6].mulai - 0.1 || t > S[7].mulai + 0.3) return null;
  const kel = S[7].mulai - 0.25;
  return (
    <>
      <Muncul mulai={T.salcit - 0.1} keluar={kel} x={540} y={590} seed="sl">
        <Kartu warna={K.teal} gaya={{ padding: '10px 30px', textAlign: 'center' }}>
          {besar('Salcit Technologies', K.tinta, 56)}
          {kecil(t > T.india6 - 0.1 ? 'India · kesehatan pernapasan' : ' ', K.teal, 26)}
        </Kartu>
      </Muncul>
      <Muncul mulai={T.tbc6 - 0.2} keluar={kel + 0.04} x={300} y={960} seed="hp">
        <div style={{ width: 230, height: 440, borderRadius: 34, background: '#0b0f17', border: '6px solid #c3cad4', position: 'relative', boxShadow: '0 30px 70px rgba(0,0,0,0.6)' }}>
          <div style={{ position: 'absolute', left: 14, right: 14, top: 44, bottom: 44, borderRadius: 16, background: '#121a2c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 40, color: K.teal }}>{t > T.swaasa - 0.2 ? 'Swaasa' : ' '}</div>
            <svg width={170} height={80}>
              <path d={gelombang('sw', 170, 80, t, true)} fill="none" stroke={K.kuning} strokeWidth={5} />
            </svg>
            <div style={{ width: 54, height: 54, borderRadius: 27, background: K.merah, opacity: Math.floor(t * 2) % 2 ? 0.5 : 1 }} />
          </div>
        </div>
      </Muncul>
      <Muncul mulai={T.tbc6 - 0.1} keluar={kel + 0.08} x={740} y={900} seed="tb">
        <Kartu warna={K.kuning} gaya={{ padding: '12px 26px' }}>
          {kecil('riset pakai HeAR', K.abu, 24)}
          {besar('deteksi dini', K.tinta, 54)}
          {besar('TBC dari batuk', K.kuning, 54)}
        </Kartu>
      </Muncul>
    </>
  );
};

const Tbc: React.FC<{ T: WB }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[7].mulai - 0.1 || t > S[8].mulai + 0.3) return null;
  const kel = S[8].mulai - 0.25;
  const o = maju(t, S[7].mulai, S[7].mulai + 0.2) * (1 - maju(t, kel, kel + 0.25));
  const tanya = maju(t, T.jutaan - 0.2, T.jutaan + 0.8, EASE.linear);
  const jauh = maju(t, T.susah - 0.3, T.susah + 0.3, EASE.kamera);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: o }}>
      <div style={{ position: 'absolute', left: 540, top: 560, translate: '-50% 0', scale: String(pegas(t, T.diobati - 0.2, fps, { damping: 11, stiffness: 200, mass: 0.6 })) }}>
        <Kartu warna={K.teal} gaya={{ display: 'flex', alignItems: 'center', gap: 14, padding: '8px 26px' }}>
          <Ikon n="centang" warna={K.teal} uk={56} tebal={10} />
          {besar('TBC bisa diobati', K.tinta, 56)}
        </Kartu>
      </div>
      <div style={{ position: 'absolute', left: 540, top: 720, translate: '-50% 0', display: 'grid', gridTemplateColumns: 'repeat(8, 100px)', gap: 8 }}>
        {Array.from({ length: 24 }, (_, i) => {
          const ket = random(`tq${i}`) < 0.45;
          const q = ket && tanya > i / 24;
          return (
            <div key={i} style={{ position: 'relative', height: 100, opacity: maju(t, S[7].mulai + 0.2 + i * 0.02, S[7].mulai + 0.4 + i * 0.02), translate: `0 ${(Math.sin(t * 3 + i) * 3).toFixed(1)}px` }}>
              <Ikon n="orang" warna={q ? K.kuning : '#5b6f92'} uk={90} tebal={8} />
              {q ? <span style={{ position: 'absolute', right: 0, top: -8, fontFamily: SAIRA, fontWeight: 800, fontSize: 44, color: K.kuning }}>?</span> : null}
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 540, top: 1060, translate: '-50% 0', opacity: maju(t, T.jutaan, T.jutaan + 0.2), fontFamily: TANGAN, fontWeight: 700, fontSize: 46, color: K.kuning, whiteSpace: 'nowrap' }}>
        jutaan kasus gak ketahuan tiap tahun
      </div>
      {jauh > 0 ? (
        <div style={{ position: 'absolute', left: 540, top: 1150, translate: '-50% 0', display: 'flex', alignItems: 'center', gap: 16, opacity: jauh }}>
          <Ikon n="orang" warna={K.tinta} uk={60} />
          <svg width={420} height={30}>
            <line x1={10} y1={15} x2={10 + 400 * jauh} y2={15} stroke={K.abu} strokeWidth={6} strokeDasharray="14 12" />
          </svg>
          <div style={{ padding: '4px 14px', borderRadius: 10, background: K.merah, fontFamily: SAIRA, fontWeight: 800, fontSize: 34, color: K.latar }}>klinik jauh</div>
        </div>
      ) : null}
    </div>
  );
};

const Who: React.FC<{ T: WB }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[8].mulai - 0.1 || t > T.keluarDunia + 0.3) return null;
  const kel = T.keluarDunia - 0.1;
  return (
    <>
      <Muncul mulai={T.who - 0.15} keluar={kel} x={540} y={600} seed="wh">
        <Kartu warna={K.tinta} gaya={{ padding: '8px 26px' }}>
          {kecil('WHO · kasus TBC baru dunia, 2024', K.tinta, 30)}
        </Kartu>
      </Muncul>
      <Muncul mulai={T.indonesia - 0.2} keluar={kel + 0.04} x={540} y={820} seed="id" melayang={3}>
        <Batang label="#2 Indonesia" p={maju(t, T.n10 - 0.4, T.n10 + 0.4, EASE.kamera)} ke={10} maks={25} lebar={860} warna={K.kuning} tinggi={76} />
      </Muncul>
      <Muncul mulai={T.india8 - 0.3} keluar={kel + 0.08} x={540} y={1040} seed="in" melayang={3}>
        <Batang label="#1 India" p={maju(t, T.india8 - 0.3, T.india8 + 0.5, EASE.kamera)} ke={25} maks={25} lebar={860} warna={K.teal} tinggi={76} />
      </Muncul>
    </>
  );
};

const Hud: React.FC<{ T: WB }> = ({ T }) => {
  const S = T.s;
  return (
    <HudTeks
      T={T}
      sumber={() => 'Sumber: Google Research (2024) · arXiv 2403.02522 · WHO'}
      teks={[
        { label: ['AI', 'DENGERIN', 'SUARA'], judul: [{ t: '300', mulai: T.n300, warna: K.teal }, { t: 'juta', mulai: T.n300 + 0.15, warna: K.teal }, { t: 'suara', mulai: T.n300 + 0.3 }, { t: '·', mulai: T.n100 - 0.1, warna: K.abu }, { t: '100', mulai: T.n100, isi: sorot('100', T.n100 + 0.1) }, { t: 'juta', mulai: T.n100 + 0.15, warna: K.kuning }, { t: 'batuk', mulai: T.batuk0, warna: K.kuning }], jMulai: T.n300, ukuran: 84 },
        { label: ['NAMANYA'], judul: [{ t: 'HeAR', mulai: T.hear, warna: K.kuning }, { t: '·', mulai: T.google - 0.1, warna: K.abu }, { t: 'Google', mulai: T.google }, { t: 'Research', mulai: T.google + 0.2 }, { t: '2024', mulai: T.n2024, warna: K.teal }], ukuran: 84 },
        { label: ['DATANYA'], judul: [{ t: 'klip', mulai: T.dua - 0.1 }, { t: '2', mulai: T.dua, warna: K.kuning }, { t: 'detik', mulai: T.dua + 0.15, warna: K.kuning }, { t: 'dari', mulai: T.youtube - 0.15 }, { t: 'YouTube', mulai: T.youtube }] },
        { label: ['JENISNYA'], judul: [{ t: 'foundation', mulai: T.foundation, isi: sorot('foundation', T.foundation + 0.15, K.teal) }, { t: 'model', mulai: T.foundation + 0.25 }], catatan: 'model dasar buat bikin AI pendeteksi penyakit', cMulai: T.dasar },
        { label: ['UJI', 'COBA'], judul: [{ t: '33', mulai: T.n33, warna: K.teal }, { t: 'tugas', mulai: T.n33 + 0.15 }, { t: '·', mulai: T.terbaik - 0.4, warna: K.abu }, { t: 'peringkat', mulai: T.terbaik - 0.3 }, { t: 'terbaik', mulai: T.terbaik, isi: sorot('terbaik', T.terbaik + 0.1) }], ukuran: 84 },
        { label: ['KELEBIHANNYA'], judul: [{ t: 'data', mulai: S[5].mulai + 0.3 }, { t: 'latihan', mulai: S[5].mulai + 0.45 }, { t: 'lebih', mulai: T.sedikit - 0.2 }, { t: 'sedikit', mulai: T.sedikit, warna: K.teal }] },
        { label: ['DIPAKAI', 'DI', 'INDIA'], judul: [{ t: 'Swaasa:', mulai: T.salcit + 0.2, warna: K.teal }, { t: 'riset', mulai: T.tbc6 - 0.2 }, { t: 'TBC', mulai: T.tbc6, isi: sorot('TBC', T.tbc6 + 0.1) }] },
        { label: ['MASALAHNYA'], judul: [{ t: 'jutaan', mulai: T.jutaan, warna: K.kuning }, { t: 'kasus', mulai: T.jutaan + 0.15 }, { t: 'gak', mulai: T.jutaan + 0.3 }, { t: 'ketahuan', mulai: T.jutaan + 0.45 }] },
        { label: ['MENURUT', 'WHO'], judul: [{ t: 'Indonesia:', mulai: T.indonesia }, { t: '10%', mulai: T.n10, isi: sorot('10%', T.n10 + 0.1) }, { t: 'kasus', mulai: T.n10 + 0.25 }, { t: 'dunia', mulai: T.n10 + 0.4 }], ukuran: 84 },
        { label: ['BUAT', 'FAKTA', 'AI', 'KESEHATAN'], judul: [{ t: 'simpan', mulai: T.simpan + 0.05, warna: K.kuning }, { t: '&', mulai: T.follow - 0.25, warna: K.abu }, { t: 'follow', mulai: T.follow, warna: K.teal }], jMulai: T.simpan },
      ]}
    />
  );
};

function daftarSfx(T: WB) {
  const S = T.s;
  const petak = Array.from({ length: 12 }, (_, i) => bunyi('tik', 0.3 + i * ((Math.max(1, T.n300 + 0.6)) / 12), 0.12));
  const tugas = Array.from({ length: 8 }, (_, i) => bunyi('tik', T.n33 - 0.2 + i * 0.12, 0.12));
  const orang = Array.from({ length: 6 }, (_, i) => bunyi('tik', T.jutaan - 0.2 + i * 0.16, 0.1));
  return [
    bunyi('whooshPop', 0.08, 0.3),
    ...petak,
    bunyi('swish', T.n100 - 0.1, 0.3),
    bunyi('kunci', T.n100 + 0.2, 0.3),
    bunyi('whooshA', S[1].mulai, 0.3),
    bunyi('pop', T.health, 0.25),
    bunyi('pop', T.acoustic, 0.25),
    bunyi('pop', T.repr, 0.25),
    bunyi('pop', T.google, 0.3),
    bunyi('whooshB', S[2].mulai, 0.3),
    bunyi('jepret', T.dua + 0.2, 0.3),
    bunyi('pop', T.batuk2, 0.25),
    bunyi('pop', T.napas, 0.25),
    bunyi('pop', T.deham, 0.25),
    bunyi('whooshTurun', S[3].mulai, 0.3),
    bunyi('hantam', T.foundation, 0.3),
    bunyi('pop', T.pendeteksi - 0.2, 0.25),
    bunyi('pop', T.pendeteksi, 0.25),
    bunyi('whooshA', S[4].mulai, 0.3),
    ...tugas,
    bunyi('kunci', T.terbaik, 0.35),
    bunyi('whooshPop', S[5].mulai, 0.3),
    bunyi('swish', T.sedikit - 0.3, 0.25),
    bunyi('whooshB', S[6].mulai, 0.3),
    bunyi('pop', T.salcit, 0.3),
    bunyi('pop', T.tbc6, 0.3),
    bunyi('whooshLembut', S[7].mulai, 0.3),
    bunyi('pop', T.diobati, 0.3),
    ...orang,
    bunyi('whooshA', S[8].mulai, 0.3),
    bunyi('pop', T.indonesia, 0.3),
    bunyi('riser', T.n10 - 0.3, 0.2),
    bunyi('pop', T.india8, 0.3),
    bunyi('whooshTerang', T.keluarDunia + 0.1, 0.3),
    bunyi('pop', T.simpan + 0.15, 0.35),
    bunyi('klik', T.simpan + 0.65, 0.4),
    bunyi('pop', T.follow - 0.2, 0.3),
    bunyi('klik', T.follow + 0.3, 0.4),
    bunyi('whooshLembut', T.keluarCta + 0.05, 0.3),
  ];
}

// ===============================================================================================================
// SAMPUL: "AI yang dengerin 100 juta suara batuk" + dinding klip
export const ContohSuaraBatukSampul: React.FC = () => {
  const T = waktuBatuk([], undefined, 59);
  const kam = { x: 540, y: 960, z: 1, vx: 0, vy: 0, lebar: 1080, tinggi: 1920 };
  return (
    <AbsoluteFill style={{ background: K.latar, overflow: 'hidden' }}>
      <LatarSeri kam={kam} kabut={['61,219,200', '255,107,87', '255,197,61']} />
      <div style={{ position: 'absolute', left: 0, top: 480, width: 1080, height: 1920, filter: 'brightness(0.8)' }}>
        <DindingKlip T={T} sampul />
      </div>
      <PeneduhAtas />
      <div style={{ position: 'absolute', left: 90, top: 196, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 10, height: 44, borderRadius: 5, background: K.teal }} />
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: K.abu }}>HeAR · GOOGLE RESEARCH</div>
      </div>
      <div style={{ position: 'absolute', left: 90, top: 262, width: 780, fontFamily: SAIRA, fontWeight: 800, fontSize: 118, lineHeight: 1.04, color: K.tinta }}>
        <div>AI dengerin</div>
        <div>
          <span style={{ display: 'inline-block', background: K.kuning, color: K.latar, padding: '0 0.1em', borderRadius: 12, lineHeight: 0.98 }}>100 juta</span> batuk
        </div>
      </div>
      <Grain kuat={0.06} garisScan={0} vinyet={0.45} warnaVinyet="2,5,14" />
    </AbsoluteFill>
  );
};
