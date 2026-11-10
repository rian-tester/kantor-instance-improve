// Frame hero (pembuka, tengah, puncak): 15, 860, 1434.
// contoh video explainer A1 (akun generik, konten contoh): "AI nebak tombol keyboard dari suaranya: 95% (HP), 93% (Zoom)".
// SATU DUNIA: laptop terbuka rata dilihat dari atas (layar di atas, keyboard + trackpad di bawah). Hook: password diketik,
// tiap tombol "bunyi" (cincin suara) → AI nebak hurufnya (gelembung ✓) → kolom password kebuka "rahasia88" → riset 3 kampus
// (plakat) → laptop utuh + garis diagonal 16" → 36 tombol nyala satu-satu (penghitung) × 25 tekanan → kamera geser kiri: iPhone
// 13 mini 17 cm dari sisi kiri laptop (penggaris) → kamera turun: bunyi tombol jadi gelombang → mel-spectrogram (petak warna)
// → banyak petak masuk model CoAtNet → keluar tebakan tombol → cincin 95% (HP) & 93% (Zoom) → 3 saran peneliti → CTA → loop.
// Fakta: Harrison, Toreini, Mehrnezhad, arXiv 2308.01074 (Agustus 2023). Ketikan & password di video = ilustrasi.
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { Bunyi, Dunia, EASE, formatAngka, GarisDigambar, Grain, maju, noise, pathPanah, pegas, Stempel, Subtitle, useDetik, type KunciKamera, type Kata } from "../../src/gerak";
import { MONO, SAIRA, TANGAN } from "../../src/gerak/font";
import { bunyi, K } from "./raja/gaya";
import type { Kalimat } from "./raja/waktuRaja";
import { CtaSimpanFollow, kameraSeri, LatarSeri, lerp, PeneduhAtas, sorot } from "../../src/gerak/seri/data-gelap/seri";
import { besar, Cincin, HudTeks, Ikon, Kartu, kecil, KotakModel, Muncul, waktuDasar, type WaktuDasar } from "../../src/gerak/seri/data-gelap/alat19";

export type DataKetik = { durasi: number; kata: Kata[]; kalimat?: Kalimat[] };

// ---------------------------------------------------------------------------------------------------------------
// dunia: laptop (tengah LX), HP di kiri (17 cm = 460 px, skala laptop 35,6 cm = 960 px), jalur olah suara di bawah laptop
const LX = 1240;
const U = 60;
const LID = { x: LX - 480, y: 180, w: 960, h: 670 };
const DECK = { x: LX - 480, y: 860, w: 960, h: 670 };
const KB0 = { x: LX - 450, y: 952 };
const HP = { x: 127, y: 905, w: 173, h: 356 }; // kanan HP x=300, kiri laptop x=760 → 460 px = 17 cm
const WAV = { x: LX, y: 1740 };
const SPEK = { x: LX, y: 2060, uk: 340 };
const MODEL = { x: LX, y: 2440 };

const BARIS: (string | [string, number])[][] = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', ['del', 2]],
  [['tab', 1.5], 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', ['\\', 1.5]],
  [['caps', 1.75], 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", ['return', 2.25]],
  [['shift', 2.25], 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', ['shift ', 2.75]],
  [['fn', 1], ['ctrl', 1], ['opt', 1], ['cmd', 1.25], [' ', 5.5], ['cmd ', 1.25], ['opt ', 1], ['◀', 1], ['▼', 1], ['▶', 1]],
];
type Tuts = { k: string; x: number; y: number; w: number; h: number };
const TUTS: Tuts[] = (() => {
  const out: Tuts[] = [];
  BARIS.forEach((b, r) => {
    let x = KB0.x;
    for (const e of b) {
      const [k, w] = typeof e === 'string' ? [e, 1] : e;
      out.push({ k, x: x + (w * U) / 2, y: KB0.y + r * U + U / 2, w: w * U - 8, h: U - 8 });
      x += w * U;
    }
  });
  return out;
})();
const tuts = (k: string) => TUTS.find((x) => x.k === k) ?? TUTS[0];
const ANGKA36 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ...'abcdefghijklmnopqrstuvwxyz'.split('')];
const KETIK = 'rahasia88'.split('');

// ---------------------------------------------------------------------------------------------------------------
function waktuKetik(d: Kata[], kal: Kalimat[] | undefined, total: number) {
  const W = waktuDasar(d, kal, total, 10);
  const { s, k, a } = W;
  const n95 = k('95', s[0].mulai, s[0].akhir - 1.2);
  const tekan0 = 0.4;
  const jeda = Math.min(0.42, Math.max(0.24, (n95 - 0.5 - tekan0) / KETIK.length));
  const tekan = KETIK.map((_, i) => tekan0 + i * jeda);
  const benar = k('benar', n95, s[0].akhir - 0.3);
  // 2
  const durham = k('durham', s[1].mulai, s[1].mulai + 2.4);
  const surrey = k('surrey', durham, durham + 1.1);
  const royal = k('royal', surrey, surrey + 0.9);
  const n2023 = k('2023', s[1].mulai, s[1].mulai + 0.8);
  // 3
  const mac = k('macbook', s[2].mulai, s[2].mulai + 0.5);
  const n16 = k('16', mac, mac + 0.8);
  const n2021 = k('2021', n16, n16 + 1.0);
  const banyak = k('banyak', n2021, s[2].akhir - 1.2);
  // 4
  const n36 = k('36', s[3].mulai, s[3].mulai + 0.3);
  const angka4 = k('angka', n36, n36 + 0.8);
  const huruf4 = k('huruf', angka4, angka4 + 1.2);
  const n25 = k('25', huruf4, s[3].akhir - 0.9);
  // 5
  const iphone = k('iphone', s[4].mulai, s[4].mulai + 0.6);
  const n17 = k('17', iphone, iphone + 1.4);
  const laptop5 = k('laptop', n17, s[4].akhir - 0.4);
  // 6
  const bunyi6 = k('bunyi', s[5].mulai, s[5].mulai + 0.3);
  const gambar6 = k('gambar', bunyi6, bunyi6 + 1.0);
  const mel = k('mel', gambar6, s[5].akhir - 0.9);
  // 7
  const gambar7 = k('gambar', s[6].mulai, s[6].mulai + 0.3);
  const coat = k('coatnet', gambar7, gambar7 + 2.6);
  const bedain = k('ngebedain', coat, s[6].akhir - 1.2);
  // 8
  const hp8 = k('hp', s[7].mulai, s[7].mulai + 0.6);
  const n95b = k('95', hp8, hp8 + 0.8);
  const zoom = k('zoom', n95b, n95b + 1.6);
  const n93 = k('93', zoom, zoom + 0.8);
  // 9
  const gaya = k('gaya', s[8].mulai, s[8].mulai + 1.0);
  const pass9 = k('password', gaya, gaya + 0.9);
  const besar9 = k('besar', pass9, pass9 + 1.2);
  const verif = k('verifikasi', besar9, s[8].akhir - 1.0);
  const akhirVerif = a('langkah', verif, s[8].akhir);
  return {
    ...W, n95, tekan, benar, durham, surrey, royal, n2023, mac, n16, n2021, banyak, n36, angka4, huruf4, n25,
    iphone, n17, laptop5, bunyi6, gambar6, mel, gambar7, coat, bedain, hp8, n95b, zoom, n93, gaya, pass9, besar9, verif, akhirVerif,
  };
}
type WK = ReturnType<typeof waktuKetik>;

// ===============================================================================================================
export const ContohSuaraKetik: React.FC<DataKetik> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuKetik(d.kata, d.kalimat, total), [d.kata, d.kalimat, total]);
  const S = T.s;
  const pelan = Easing.linear;
  const kunci: KunciKamera[] = [
    { t: 0, x: LX, y: 1080, z: 1.02 },
    { t: 0.7, x: LX, y: 1060, z: 1.1 },
    { t: S[1].mulai - 0.1, x: LX + 8, y: 1052, z: 1.15, ease: pelan },
    { t: S[1].mulai + 0.6, x: LX, y: 900, z: 0.78 },
    { t: S[2].mulai - 0.1, x: LX - 6, y: 896, z: 0.8, ease: pelan },
    { t: S[2].mulai + 0.5, x: LX, y: 870, z: 0.72 },
    { t: S[3].mulai - 0.1, x: LX + 4, y: 866, z: 0.75, ease: pelan },
    { t: S[3].mulai + 0.6, x: LX, y: 1085, z: 1.1 },
    { t: S[4].mulai - 0.1, x: LX - 4, y: 1082, z: 1.14, ease: pelan },
    { t: S[4].mulai + 0.75, x: 905, y: 1110, z: 0.62 },
    { t: S[5].mulai - 0.1, x: 900, y: 1112, z: 0.65, ease: pelan },
    { t: S[5].mulai + 0.75, x: LX, y: 1915, z: 1.05 },
    { t: S[6].mulai - 0.1, x: LX + 6, y: 1925, z: 1.09, ease: pelan },
    { t: S[6].mulai + 0.6, x: LX, y: 2290, z: 0.95 },
    { t: S[7].mulai - 0.1, x: LX - 6, y: 2296, z: 0.98, ease: pelan },
    { t: S[7].mulai + 0.5, x: LX, y: 2330, z: 0.9 },
    { t: S[8].mulai - 0.1, x: LX + 6, y: 2336, z: 0.93, ease: pelan },
    { t: S[8].mulai + 0.65, x: LX, y: 1100, z: 0.85 },
    { t: T.keluarDunia, x: LX + 6, y: 1096, z: 0.9, ease: pelan },
    { t: T.simpan + 0.8, x: LX, y: 1100, z: 1.0 },
    { t: T.loop, x: LX, y: 1100, z: 1.02, ease: pelan },
    { t: total, x: LX, y: 1080, z: 1.02 },
  ];
  const kam = kameraSeri(kunci, t, fps, total, [
    { t: T.benar + 0.1, kuat: 7, lama: 0.14 },
    { t: T.n95b + 0.2, kuat: 6, lama: 0.12 },
  ]);
  return (
    <AbsoluteFill style={{ background: K.latar, color: K.tinta, overflow: 'hidden', fontFamily: SAIRA }}>
      <LatarSeri kam={kam} />
      <Dunia kamera={kam} tinggiDunia={2900} lebarDunia={2000} blurGerak={1300}>
        <Laptop T={T} />
        <TombolNyala T={T} />
        <Telepon T={T} />
        <Jalur T={T} />
      </Dunia>
      <PeneduhAtas />
      <Plakat T={T} />
      <Akurasi T={T} />
      <Saran T={T} />
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
// LAPTOP: layar (kolom password) + dek (keyboard + trackpad). Redup pas panel HUD nimpa.
const tekanDi = (T: WK, t: number, k: string) => {
  // detik tekan terakhir buat tombol ini (hook) atau -1
  let m = -1;
  T.tekan.forEach((x, i) => {
    if (KETIK[i] === k && t >= x) m = x;
  });
  return m;
};

export const Laptop: React.FC<{ T: WK; sampul?: boolean }> = ({ T, sampul }) => {
  const t0 = useDetik();
  const t = sampul ? 3.2 : t0;
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < 0.04) return null;
  const masuk = sampul ? 1 : pegas(t, 0.05, fps, { damping: 14, stiffness: 170, mass: 0.7 });
  const keluar = sampul ? 0 : maju(t, T.keluarDunia, T.keluarDunia + 0.45, EASE.keluar);
  const redup = sampul
    ? 0
    : Math.max(
        0.7 * maju(t, S[1].mulai, S[1].mulai + 0.3) * (1 - maju(t, S[2].mulai - 0.2, S[2].mulai + 0.1)),
        0.55 * maju(t, S[5].mulai, S[5].mulai + 0.5),
        0.7 * maju(t, S[8].mulai + 0.2, S[8].mulai + 0.6),
      );
  const nKetik = T.tekan.filter((x) => t >= x).length;
  const buka = maju(t, T.benar - 0.1, T.benar + 0.25);
  const passOff = maju(t, S[1].mulai - 0.3, S[1].mulai);
  // S2: garis diagonal 16" di layar
  const diag = { x1: LID.x + 40, y1: LID.y + LID.h - 40, x2: LID.x + LID.w - 40, y2: LID.y + 40 };
  const oDiag = maju(t, T.n16 - 0.2, T.n16) * (1 - maju(t, S[3].mulai - 0.3, S[3].mulai));
  const napas = 1 + 0.004 * Math.sin(t * 1.6);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: (1 - keluar) * Math.min(1, masuk * 2), filter: redup > 0 ? `brightness(${1 - redup})` : undefined }}>
      <div style={{ position: 'absolute', left: 0, top: 0, scale: String(lerp(0.92, 1, Math.min(1, masuk)) * napas), transformOrigin: `${LX}px 1100px` }}>
        {/* layar */}
        <div style={{ position: 'absolute', left: LID.x, top: LID.y, width: LID.w, height: LID.h, borderRadius: 30, background: 'linear-gradient(160deg, #c9d0da, #9ea7b4)', boxShadow: '0 40px 90px rgba(0,0,0,0.55)' }}>
          <div style={{ position: 'absolute', left: 16, top: 16, right: 16, bottom: 16, borderRadius: 18, background: '#05070c' }}>
            <div style={{ position: 'absolute', left: 14, top: 14, right: 14, bottom: 14, borderRadius: 8, background: 'radial-gradient(ellipse at 50% 40%, #1b2a4a 0%, #0c1426 80%)', overflow: 'hidden' }}>
              {/* jendela login */}
              <div style={{ position: 'absolute', left: '50%', top: 440, translate: '-50% 0', width: 560, opacity: sampul ? 0 : 1 - passOff }}>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: '#9fb0c8', marginBottom: 10 }}>Password</div>
                <div style={{ height: 78, borderRadius: 14, background: '#0a1020', border: `3px solid ${buka > 0.5 ? K.teal : '#3a4d72'}`, display: 'flex', alignItems: 'center', padding: '0 22px', gap: 10 }}>
                  {buka < 0.5 ? (
                    <>
                      {Array.from({ length: nKetik }, (_, i) => (
                        <div key={i} style={{ width: 22, height: 22, borderRadius: 11, background: K.tinta }} />
                      ))}
                      <div style={{ width: 4, height: 44, background: K.tinta, opacity: Math.floor(t * 2.2) % 2 ? 0 : 1 }} />
                    </>
                  ) : (
                    <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 44, color: K.teal, letterSpacing: '0.06em' }}>{KETIK.join('')}</span>
                  )}
                </div>
                <div style={{ marginTop: 12, fontFamily: TANGAN, fontWeight: 700, fontSize: 36, color: K.teal, opacity: buka }}>ketebak AI dari suara ketikan</div>
              </div>
              {/* S2: garis diagonal 16 inci */}
              {oDiag > 0 ? (
                <svg width={LID.w - 60} height={LID.h - 60} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: oDiag }}>
                  <GarisDigambar d={`M ${diag.x1 - LID.x - 30} ${diag.y1 - LID.y - 30} L ${diag.x2 - LID.x - 30} ${diag.y2 - LID.y - 30}`} mulai={T.n16 - 0.15} lama={0.45} warna={K.kuning} tebal={8} />
                </svg>
              ) : null}
            </div>
            {/* notch */}
            <div style={{ position: 'absolute', left: '50%', top: 0, translate: '-50% 0', width: 150, height: 26, borderRadius: '0 0 12px 12px', background: '#05070c' }} />
          </div>
        </div>
        {/* engsel */}
        <div style={{ position: 'absolute', left: LID.x + 30, top: LID.y + LID.h, width: LID.w - 60, height: 10, background: '#6d7684' }} />
        {/* dek */}
        <div style={{ position: 'absolute', left: DECK.x, top: DECK.y, width: DECK.w, height: DECK.h, borderRadius: 30, background: 'linear-gradient(170deg, #ccd3dc, #a2abb8)', boxShadow: '0 40px 90px rgba(0,0,0,0.55)' }}>
          {/* baris fungsi tipis */}
          {Array.from({ length: 14 }, (_, i) => (
            <div key={i} style={{ position: 'absolute', left: 30 + i * 64.3, top: 46, width: 58, height: 30, borderRadius: 6, background: '#121822' }} />
          ))}
          {/* trackpad */}
          <div style={{ position: 'absolute', left: DECK.w / 2 - 250, top: 420, width: 500, height: 215, borderRadius: 18, background: 'linear-gradient(170deg, #c2c9d3, #b0b8c4)', boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.12)' }} />
        </div>
        {/* tombol */}
        {TUTS.map((x, i) => {
          const m = tekanDi(T, t, x.k);
          const turun = m >= 0 ? 1 - maju(t, m + 0.04, m + 0.2) : 0;
          const panjang = x.k.trim().length > 1;
          return (
            <div key={i} style={{ position: 'absolute', left: x.x - x.w / 2, top: x.y - x.h / 2 + 3 * turun, width: x.w, height: x.h, borderRadius: 9, background: turun > 0.05 ? '#26324a' : '#10151f', boxShadow: turun > 0.05 ? `0 0 0 3px ${K.teal}, 0 0 22px ${K.teal}` : '0 3px 0 rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 700, fontSize: panjang ? 16 : 25, color: '#e8edf4' }}>
              {x.k.trim()}
            </div>
          );
        })}
        {/* cincin suara + gelembung tebakan AI (hook) */}
        {T.tekan.map((m, i) => {
          if (sampul || t < m || t > m + 1.0) return null;
          const p = tuts(KETIK[i]);
          const q = maju(t, m, m + 0.6, EASE.linear);
          const ob = maju(t, m + 0.08, m + 0.16) * (1 - maju(t, m + 0.45, m + 0.6));
          return (
            <React.Fragment key={i}>
              <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                {[0, 0.18].map((dd, j) => {
                  const qq = maju(t, m + dd, m + dd + 0.6, EASE.linear);
                  return qq > 0 && qq < 1 ? <circle key={j} cx={p.x} cy={p.y} r={30 + 140 * qq} fill="none" stroke={K.teal} strokeWidth={7 * (1 - qq) + 1} opacity={0.9 * (1 - qq)} /> : null;
                })}
              </svg>
              {q > 0 ? (
                <div style={{ position: 'absolute', left: p.x, top: p.y - 92 - 40 * maju(t, m + 0.1, m + 0.6), translate: '-50% -50%', opacity: ob, scale: String(0.6 + 0.4 * maju(t, m + 0.08, m + 0.22)), padding: '4px 16px', borderRadius: 14, background: K.teal, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 46, whiteSpace: 'nowrap', boxShadow: '0 8px 20px rgba(0,0,0,0.45)' }}>
                  {KETIK[i].toUpperCase()} ✓
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
        {/* S3: chip MacBook Pro + 16 inci (nempel di layar) */}
        {t > T.mac - 0.2 && t < S[3].mulai + 0.2 ? (
          <>
            <div style={{ position: 'absolute', left: LX, top: LID.y + 120, translate: '-50% 0', opacity: maju(t, T.mac - 0.2, T.mac) * (1 - maju(t, S[3].mulai - 0.3, S[3].mulai)), padding: '8px 26px', borderRadius: 16, background: 'rgba(7,12,24,0.92)', border: `4px solid ${K.teal}`, fontFamily: SAIRA, fontWeight: 800, fontSize: 64, color: K.tinta, whiteSpace: 'nowrap' }}>
              MacBook Pro <span style={{ color: K.teal }}>{t > T.n2021 - 0.1 ? '· 2021' : ''}</span>
            </div>
            <div style={{ position: 'absolute', left: LX + 40, top: LID.y + LID.h / 2 - 10, translate: '-50% -50%', rotate: '-34deg', opacity: oDiag, scale: String(pegas(t, T.n16, fps, { damping: 10, stiffness: 200, mass: 0.6 })), padding: '4px 22px', borderRadius: 14, background: K.kuning, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 70, whiteSpace: 'nowrap' }}>
              16 inci
            </div>
            <div style={{ position: 'absolute', left: LX, top: LID.y + 530, translate: '-50% 0', opacity: maju(t, T.banyak - 0.1, T.banyak + 0.2) * (1 - maju(t, S[3].mulai - 0.3, S[3].mulai)), fontFamily: TANGAN, fontWeight: 700, fontSize: 60, color: K.kuning, whiteSpace: 'nowrap', padding: '0 18px', borderRadius: 12, background: 'rgba(7,12,24,0.85)' }}>
              laptop yang banyak dipakai orang
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

// S4: 36 tombol (0–9, a–z) nyala satu-satu, penghitung diikat ke tombol yang nyala; terus × 25 (denyut tiap tombol)
const TombolNyala: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[3].mulai || t > S[4].mulai + 0.4) return null;
  const o = 1 - maju(t, S[4].mulai - 0.1, S[4].mulai + 0.3);
  const a0 = T.n36 - 0.05;
  const a1 = Math.max(a0 + 1.4, T.n25 - 0.5);
  const n = Math.round(36 * maju(t, a0, a1, EASE.linear));
  const kali = Math.min(25, Math.floor(25 * maju(t, T.n25 - 0.1, T.n25 + 1.1, EASE.linear)));
  const denyut = t > T.n25 - 0.1;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      {ANGKA36.map((k, i) => {
        if (i >= n) return null;
        const p = tuts(k);
        const angka = i < 10;
        const fase = denyut ? 0.5 + 0.5 * Math.sin(t * 18 + i * 0.7) : 1;
        return (
          <div key={k} style={{ position: 'absolute', left: p.x - p.w / 2, top: p.y - p.h / 2, width: p.w, height: p.h, borderRadius: 9, background: angka ? K.teal : K.kuning, opacity: 0.55 + 0.45 * fase, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 26, color: K.latar }}>
            {k}
          </div>
        );
      })}
      {/* penghitung di layar laptop */}
      <div style={{ position: 'absolute', left: LX, top: LID.y + LID.h - 150, translate: '-50% 0', display: 'flex', alignItems: 'baseline', gap: 18, padding: '8px 30px', borderRadius: 18, background: 'rgba(7,12,24,0.94)', border: `4px solid ${K.kuning}`, whiteSpace: 'nowrap', opacity: maju(t, a0 - 0.2, a0) }}>
        <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 76, color: K.kuning, fontVariantNumeric: 'tabular-nums', minWidth: '1.1em', textAlign: 'right' }}>{n}</span>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: K.abu }}>tombol</span>
        {t > T.n25 - 0.2 ? (
          <>
            <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 60, color: K.abu }}>×</span>
            <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 76, color: K.teal, fontVariantNumeric: 'tabular-nums', minWidth: '1.1em', textAlign: 'right' }}>{Math.max(1, kali)}</span>
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: K.abu }}>kali</span>
          </>
        ) : null}
      </div>
      <div style={{ position: 'absolute', left: LX - 300, top: LID.y + LID.h - 230, opacity: maju(t, T.angka4 - 0.1, T.angka4 + 0.1) * (1 - maju(t, T.n25 - 0.3, T.n25)), fontFamily: TANGAN, fontWeight: 700, fontSize: 44, color: K.teal, whiteSpace: 'nowrap' }}>
        angka 0–9
      </div>
      <div style={{ position: 'absolute', left: LX + 80, top: LID.y + LID.h - 230, opacity: maju(t, T.huruf4 - 0.1, T.huruf4 + 0.1) * (1 - maju(t, T.n25 - 0.3, T.n25)), fontFamily: TANGAN, fontWeight: 700, fontSize: 44, color: K.kuning, whiteSpace: 'nowrap' }}>
        huruf a–z
      </div>
    </div>
  );
};

// S5: iPhone 13 mini 17 cm dari sisi kiri laptop, gelombang suara dari keyboard ke HP, penggaris 17 cm
export const Telepon: React.FC<{ T: WK; sampul?: boolean }> = ({ T, sampul }) => {
  const t0 = useDetik();
  const t = sampul ? 30 : t0;
  const { fps } = useVideoConfig();
  const S = T.s;
  if (!sampul && (t < S[4].mulai - 0.1 || t > T.keluarDunia + 0.5)) return null;
  const m = sampul ? 1 : pegas(t, S[4].mulai + 0.15, fps, { damping: 12, stiffness: 170, mass: 0.6 });
  const o = sampul ? 1 : 1 - maju(t, T.keluarDunia, T.keluarDunia + 0.4);
  const redup = sampul ? 0 : 0.55 * maju(t, S[5].mulai, S[5].mulai + 0.5);
  const rek = Math.floor(t * 2) % 2 === 0;
  const y0 = 1300;
  const oPg = maju(t, T.n17 - 0.3, T.n17) * (1 - maju(t, S[5].mulai + 0.2, S[5].mulai + 0.6));
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o, filter: redup > 0 ? `brightness(${1 - redup})` : undefined }}>
      {/* gelombang dari keyboard ke HP */}
      <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {[0, 1, 2, 3].map((i) => {
          const f = (t * 0.9 + i / 4) % 1;
          const x = lerp(KB0.x + 80, HP.x + HP.w / 2, f);
          return <path key={i} d={`M ${x} ${1020} Q ${x - 40} ${1100} ${x} ${1180}`} fill="none" stroke={K.teal} strokeWidth={8} strokeLinecap="round" opacity={Math.sin(Math.PI * f) * 0.8 * Math.min(1, m)} />;
        })}
      </svg>
      <div style={{ position: 'absolute', left: HP.x, top: HP.y, width: HP.w, height: HP.h, scale: String(Math.max(0.001, m)), borderRadius: 30, background: '#0b0f17', border: '6px solid #c3cad4', boxShadow: '0 30px 70px rgba(0,0,0,0.6)' }}>
        <div style={{ position: 'absolute', left: 14, right: 14, top: 40, bottom: 40, borderRadius: 14, background: '#121a2c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: K.merah, opacity: rek ? 1 : 0.35 }} />
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 22, color: K.tinta }}>REKAM</div>
          <svg width={110} height={50} viewBox="0 0 110 50">
            {Array.from({ length: 11 }, (_, i) => {
              const h = 8 + 34 * Math.abs(noise(`hpw${i}`, t * 3));
              return <rect key={i} x={i * 10} y={25 - h / 2} width={6} height={h} rx={3} fill={K.teal} />;
            })}
          </svg>
        </div>
        <div style={{ position: 'absolute', left: '50%', top: 14, translate: '-50% 0', width: 56, height: 14, borderRadius: 7, background: '#000' }} />
      </div>
      <div style={{ position: 'absolute', left: HP.x + HP.w / 2, top: HP.y - 100, translate: '-50% 0', opacity: Math.min(1, m), padding: '6px 22px', borderRadius: 14, background: 'rgba(7,12,24,0.92)', border: `4px solid ${K.teal}`, fontFamily: SAIRA, fontWeight: 800, fontSize: 58, color: K.teal, whiteSpace: 'nowrap' }}>
        iPhone 13 mini
      </div>
      {/* penggaris 17 cm: sisi kanan HP → sisi kiri laptop */}
      {oPg > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: oPg }}>
          <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <GarisDigambar d={`M ${HP.x + HP.w} ${y0} L ${DECK.x} ${y0}`} mulai={T.n17 - 0.25} lama={0.4} warna={K.kuning} tebal={8} />
            <GarisDigambar d={`M ${HP.x + HP.w} ${y0 - 34} L ${HP.x + HP.w} ${y0 + 34}`} mulai={T.n17 - 0.3} lama={0.12} warna={K.kuning} tebal={8} />
            <GarisDigambar d={`M ${DECK.x} ${y0 - 34} L ${DECK.x} ${y0 + 34}`} mulai={T.n17 + 0.1} lama={0.12} warna={K.kuning} tebal={8} />
            {Array.from({ length: 17 }, (_, i) => (
              <GarisDigambar key={i} d={`M ${HP.x + HP.w + (i + 0.5) * 27} ${y0} L ${HP.x + HP.w + (i + 0.5) * 27} ${y0 + 16}`} mulai={T.n17 - 0.2 + i * 0.02} lama={0.08} warna={K.kuning} tebal={4} />
            ))}
          </svg>
          <div style={{ position: 'absolute', left: (HP.x + HP.w + DECK.x) / 2, top: y0 + 40, translate: '-50% 0', scale: String(pegas(t, T.n17 + 0.1, fps, { damping: 10, stiffness: 200, mass: 0.6 })), padding: '6px 26px', borderRadius: 16, background: K.kuning, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 84, whiteSpace: 'nowrap' }}>
            17 cm
          </div>
        </div>
      ) : null}
    </div>
  );
};

// S6–S8: jalur di bawah laptop: gelombang bunyi 1 tombol → mel-spectrogram → banyak gambar → CoAtNet → tebakan tombol
const warnaSpek = (v: number) => (v < 0.33 ? '#1c2e57' : v < 0.55 ? '#1d8f86' : v < 0.75 ? K.teal : v < 0.9 ? '#b9e86a' : K.kuning);
const nilaiSpek = (c: number, r: number, seed = 's') => {
  // pola mirip bunyi ketukan: hentakan kuat di awal (kolom kiri) + pita frekuensi, meluruh ke kanan
  const awal = Math.exp(-c / 4.5);
  const pita = 0.55 + 0.45 * Math.sin(r * 0.9 + (seed.length % 3));
  return Math.min(1, awal * pita * 1.25 + 0.25 * random(`${seed}${c}-${r}`));
};

const Jalur: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[5].mulai - 0.2 || t > S[8].mulai + 0.8) return null;
  const o = maju(t, S[5].mulai - 0.2, S[5].mulai + 0.3) * (1 - maju(t, S[8].mulai + 0.1, S[8].mulai + 0.6));
  const redup = 0.75 * maju(t, S[7].mulai, S[7].mulai + 0.4);
  // gelombang
  const pw = maju(t, T.bunyi6 - 0.1, T.bunyi6 + 0.9, EASE.linear);
  const titikW: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const x = WAV.x - 300 + i * 5;
    const env = i < 8 ? i / 8 : Math.exp(-(i - 8) / 26);
    const y = WAV.y + Math.sin(i * 1.7 + t * 6) * 70 * env * (0.6 + 0.4 * Math.abs(noise('wv', i * 0.3)));
    titikW.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  const dW = 'M' + titikW.join(' L');
  // spectrogram 16×16 keisi kolom per kolom
  const N = 16;
  const kol = Math.round(N * maju(t, T.gambar6 - 0.2, T.mel + 0.3, EASE.linear));
  const sel = SPEK.uk / N;
  // S7: tumpukan gambar mengalir ke model
  const alir = maju(t, T.gambar7 - 0.2, S[7].mulai, EASE.linear);
  const mModel = pegas(t, T.coat - 0.25, fps, { damping: 12, stiffness: 180, mass: 0.6 });
  const keluarTeb = ['a', 'k', '7', 'm', 'q', '3'];
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o, filter: redup > 0 ? `brightness(${1 - redup})` : undefined }}>
      {/* kartu gelombang */}
      <div style={{ position: 'absolute', left: WAV.x - 340, top: WAV.y - 130, width: 680, height: 260, borderRadius: 24, background: 'rgba(7,12,24,0.92)', border: `4px solid ${K.teal}` }}>
        <div style={{ position: 'absolute', left: 22, top: 12, fontFamily: MONO, fontWeight: 700, fontSize: 26, color: K.abu }}>bunyi 1 tombol</div>
      </div>
      <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <path d={dW} fill="none" stroke={K.teal} strokeWidth={6} strokeLinejoin="round" strokeDasharray="4000" strokeDashoffset={4000 * (1 - pw)} />
        <GarisDigambar d={pathPanah(WAV.x, WAV.y + 145, SPEK.x, SPEK.y - SPEK.uk / 2 - 24, 0, 30)} mulai={T.gambar6 - 0.3} lama={0.3} warna={K.tinta} tebal={8} />
        <GarisDigambar d={pathPanah(SPEK.x, SPEK.y + SPEK.uk / 2 + 70, MODEL.x, MODEL.y - 150, 0, 30)} mulai={T.coat - 0.4} lama={0.3} warna={K.tinta} tebal={8} />
      </svg>
      {/* mel-spectrogram */}
      <div style={{ position: 'absolute', left: SPEK.x - SPEK.uk / 2 - 14, top: SPEK.y - SPEK.uk / 2 - 14, width: SPEK.uk + 28, height: SPEK.uk + 28, borderRadius: 18, background: 'rgba(7,12,24,0.92)', border: `4px solid ${K.kuning}`, opacity: maju(t, T.gambar6 - 0.3, T.gambar6) }}>
        {Array.from({ length: kol }, (_, c) =>
          Array.from({ length: N }, (_, r) => (
            <div key={`${c}-${r}`} style={{ position: 'absolute', left: 14 + c * sel, top: 14 + (N - 1 - r) * sel, width: sel - 1, height: sel - 1, background: warnaSpek(nilaiSpek(c, r)) }} />
          )),
        )}
      </div>
      <div style={{ position: 'absolute', left: SPEK.x, top: SPEK.y + SPEK.uk / 2 + 40, translate: '-50% 0', opacity: maju(t, T.mel - 0.1, T.mel + 0.1), padding: '2px 18px', borderRadius: 12, background: K.kuning, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 44, whiteSpace: 'nowrap' }}>
        mel-spectrogram
      </div>
      {/* banyak gambar mengalir ke model */}
      {alir > 0 && alir < 1
        ? Array.from({ length: 10 }, (_, i) => {
            const f = (t * 0.8 + i / 10) % 1;
            const sx = SPEK.x + (i % 2 ? 1 : -1) * (260 + 80 * random(`al${i}`));
            const x = lerp(sx, MODEL.x, f);
            const y = lerp(SPEK.y - 60 + 120 * random(`ay${i}`), MODEL.y - 40, f);
            return (
              <div key={i} style={{ position: 'absolute', left: x - 34, top: y - 34, width: 68, height: 68, borderRadius: 8, border: `3px solid ${K.kuning}`, background: `linear-gradient(90deg, ${K.kuning}, ${K.teal} 35%, #1c2e57 80%)`, opacity: Math.sin(Math.PI * f) }} />
            );
          })
        : null}
      {/* model */}
      <div style={{ position: 'absolute', left: MODEL.x, top: MODEL.y, translate: '-50% -50%', scale: String(Math.max(0.001, mModel)) }}>
        <KotakModel nama="CoAtNet" seed="coat" lebar={340} />
      </div>
      {/* keluaran: tebakan tombol */}
      {keluarTeb.map((k, i) => {
        const m0 = T.bedain - 0.2 + i * 0.16;
        if (t < m0) return null;
        const sisi = i % 2 ? 1 : -1;
        const x = MODEL.x + sisi * (290 + 60 * Math.floor(i / 2));
        const y = MODEL.y - 90 + Math.floor(i / 2) * 90;
        return (
          <div key={k} style={{ position: 'absolute', left: x, top: y, translate: '-50% -50%', scale: String(pegas(t, m0, fps, { damping: 11, stiffness: 200, mass: 0.6 })), display: 'flex', alignItems: 'center', gap: 8, padding: '4px 14px', borderRadius: 12, background: '#10151f', border: `3px solid ${K.teal}`, fontFamily: MONO, fontWeight: 800, fontSize: 40, color: K.tinta }}>
            {k}
            <span style={{ color: K.teal, fontSize: 32 }}>✓</span>
          </div>
        );
      })}
    </div>
  );
};

// ===============================================================================================================
// HUD: plakat 3 kampus (S2), cincin akurasi (S8), 3 saran (S9)
const Plakat: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[1].mulai - 0.1 || t > S[2].mulai + 0.3) return null;
  const kel = S[2].mulai - 0.25;
  const pl = (nama: string, sub: string, y: number, m: number, w: string, i: number) => (
    <Muncul key={nama} mulai={m - 0.1} keluar={kel + i * 0.04} x={540} y={y} seed={`pl${i}`}>
      <Kartu warna={w} gaya={{ display: 'flex', alignItems: 'center', gap: 22, padding: '16px 34px 16px 22px' }}>
        <svg width={70} height={80} viewBox="0 0 70 80">
          <path d="M 35 4 L 66 14 L 66 40 Q 66 66 35 77 Q 4 66 4 40 L 4 14 Z" fill={w} />
          <text x={35} y={50} textAnchor="middle" fontFamily={SAIRA} fontWeight={800} fontSize={30} fill={K.latar}>{nama[0]}</text>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {besar(nama, K.tinta, 58)}
          {kecil(sub, w, 24)}
        </div>
      </Kartu>
    </Muncul>
  );
  return (
    <>
      {pl('Durham University', 'Inggris', 640, T.durham, K.teal, 0)}
      {pl('University of Surrey', 'Inggris', 840, T.surrey, K.kuning, 1)}
      {pl('Royal Holloway', 'University of London', 1040, T.royal, K.teal, 2)}
      <Muncul mulai={T.n2023 - 0.05} keluar={kel} x={540} y={500} seed="th">
        <Kartu warna={K.kuning} isi gaya={{ padding: '4px 26px' }}>
          {besar('riset 2023', K.latar, 50)}
        </Kartu>
      </Muncul>
    </>
  );
};

const Akurasi: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[7].mulai - 0.1 || t > S[8].mulai + 0.3) return null;
  const kel = S[8].mulai - 0.25;
  const pA = maju(t, T.n95b - 0.6, T.n95b + 0.4, EASE.kamera);
  const pB = maju(t, T.n93 - 0.6, T.n93 + 0.4, EASE.kamera);
  return (
    <>
      <Muncul mulai={T.hp8 - 0.15} keluar={kel} x={290} y={860} seed="ca">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <Cincin r={150} p={pA} ke={95} warna={K.kuning} tebal={26} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Ikon n="hp" warna={K.kuning} uk={56} />
            {besar('rekaman HP', K.tinta, 52)}
          </div>
        </div>
      </Muncul>
      <Muncul mulai={T.zoom - 0.15} keluar={kel + 0.05} x={790} y={860} seed="cb">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <Cincin r={150} p={pB} ke={93} warna={K.teal} tebal={26} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Ikon n="kamera" warna={K.teal} uk={56} />
            {besar('rekam Zoom', K.tinta, 52)}
          </div>
        </div>
      </Muncul>
    </>
  );
};

const Saran: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[8].mulai - 0.1 || t > S[9].mulai + 0.3) return null;
  const kel = S[9].mulai - 0.3;
  const acak = 'qWrTzKbM';
  const nAcak = Math.round(acak.length * maju(t, T.pass9, T.besar9 + 0.4, EASE.linear));
  const baris = (y: number, m: number, ikon: React.ReactNode, judul: string, isi: React.ReactNode, w: string, i: number) => (
    <Muncul mulai={m - 0.12} keluar={kel + i * 0.05} x={540} y={y} seed={`sr${i}`}>
      <Kartu warna={w} gaya={{ width: 860, display: 'flex', alignItems: 'center', gap: 26, padding: '18px 28px' }}>
        <div style={{ width: 92, height: 92, borderRadius: 20, background: `${w}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ikon}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {besar(judul, K.tinta, 56)}
          {isi}
        </div>
      </Kartu>
    </Muncul>
  );
  // ikon tangan ngetik: 2 jari ngetuk bergantian
  const ketuk = (i: number) => 6 * Math.max(0, Math.sin(t * 9 + i * Math.PI));
  return (
    <>
      {baris(
        620, T.gaya,
        <svg width={70} height={70} viewBox="0 0 70 70">
          <rect x={4} y={44} width={62} height={20} rx={5} fill="none" stroke={K.teal} strokeWidth={5} />
          <rect x={16} y={8 + ketuk(0)} width={12} height={30} rx={6} fill={K.teal} />
          <rect x={40} y={8 + ketuk(1)} width={12} height={30} rx={6} fill={K.teal} />
        </svg>,
        'ganti gaya ngetik', kecil('irama & tekanan beda', K.abu, 26), K.teal, 0,
      )}
      {baris(
        860, T.pass9, <Ikon n="kunci" warna={K.kuning} uk={66} />,
        'password acak',
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, color: K.kuning, letterSpacing: '0.08em', minHeight: 40 }}>
          {acak.slice(0, Math.max(0, nAcak))}
          <span style={{ opacity: Math.floor(t * 3) % 2 ? 0 : 1 }}>|</span>
        </div>,
        K.kuning, 1,
      )}
      {baris(
        1100, T.verif, <Ikon n="perisai" warna={K.teal} uk={66} />,
        'verifikasi 2 langkah',
        <div style={{ display: 'flex', gap: 10 }}>
          {['4', '8', '2', '9', '1', '3'].map((c, i) => (
            <span key={i} style={{ width: 38, height: 46, borderRadius: 8, background: '#16243f', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 30, color: K.teal, scale: String(pegas(t, T.verif + 0.25 + i * 0.07, fps, { damping: 12, stiffness: 220, mass: 0.5 })) }}>
              {c}
            </span>
          ))}
        </div>,
        K.teal, 2,
      )}
    </>
  );
};

const Hud: React.FC<{ T: WK }> = ({ T }) => {
  const S = T.s;
  return (
    <HudTeks
      T={T}
      sumber={() => 'Sumber: Harrison, Toreini & Mehrnezhad · arXiv 2308.01074 (2023)'}
      teks={[
        {
          label: ['AI', 'NEBAK', 'TOMBOL', 'KEYBOARD'],
          judul: [{ t: 'suara', mulai: 0.2 }, { t: 'ketikan', mulai: 0.3 }, { t: '→', mulai: T.n95 - 0.3, warna: K.abu }, { t: '95%', mulai: T.n95, isi: sorot('95%', T.n95 + 0.15) }, { t: 'benar', mulai: T.benar, warna: K.teal }],
          jMulai: 0.2,
        },
        { label: ['RISET', '2023', '·', 'INGGRIS'], judul: [{ t: 'Durham', mulai: T.durham }, { t: '·', mulai: T.surrey - 0.1, warna: K.abu }, { t: 'Surrey', mulai: T.surrey }, { t: '·', mulai: T.royal - 0.1, warna: K.abu }, { t: 'Royal', mulai: T.royal }, { t: 'Holloway', mulai: T.royal + 0.15 }], ukuran: 84 },
        { label: ['LAPTOP', 'YANG', 'DITES'], judul: [{ t: 'MacBook', mulai: T.mac }, { t: 'Pro', mulai: T.mac + 0.15 }, { t: '16"', mulai: T.n16, warna: K.kuning }, { t: '(2021)', mulai: T.n2021, warna: K.teal }] },
        { label: ['DATA', 'LATIHAN'], judul: [{ t: '36', mulai: T.n36, warna: K.kuning }, { t: 'tombol', mulai: T.n36 + 0.2 }, { t: '×', mulai: T.n25 - 0.2, warna: K.abu }, { t: '25', mulai: T.n25, warna: K.teal }, { t: 'kali', mulai: T.n25 + 0.2 }] },
        { label: ['DIREKAM', 'PAKAI'], judul: [{ t: 'iPhone', mulai: T.iphone }, { t: '13', mulai: T.iphone + 0.2 }, { t: 'mini', mulai: T.iphone + 0.4 }, { t: '·', mulai: T.n17 - 0.15, warna: K.abu }, { t: '17 cm', mulai: T.n17, isi: sorot('17 cm', T.n17 + 0.15) }] },
        { label: ['BUNYI', 'JADI', 'GAMBAR'], judul: [{ t: 'bunyi', mulai: T.bunyi6 }, { t: '→', mulai: T.gambar6, warna: K.abu }, { t: 'mel-spectrogram', mulai: T.mel, warna: K.kuning }], ukuran: 88 },
        { label: ['MODEL', 'PENGENAL', 'GAMBAR'], judul: [{ t: 'model', mulai: S[6].mulai + 0.3 }, { t: 'CoAtNet', mulai: T.coat, isi: sorot('CoAtNet', T.coat + 0.15) }] },
        { label: ['AKURASI', 'TEBAKAN'], judul: [{ t: 'HP', mulai: T.hp8 }, { t: '95%', mulai: T.n95b, warna: K.kuning }, { t: '·', mulai: T.zoom - 0.15, warna: K.abu }, { t: 'Zoom', mulai: T.zoom }, { t: '93%', mulai: T.n93, warna: K.teal }] },
        { label: ['SARAN', 'PENELITI'], judul: [{ t: 'gaya', mulai: T.gaya }, { t: 'ngetik', mulai: T.gaya + 0.15 }, { t: '·', mulai: T.pass9 - 0.1, warna: K.abu }, { t: 'password', mulai: T.pass9 }, { t: 'acak', mulai: T.pass9 + 0.2, warna: K.kuning }, { t: '·', mulai: T.verif - 0.1, warna: K.abu }, { t: '2', mulai: T.verif, warna: K.teal }, { t: 'langkah', mulai: T.verif + 0.15 }], ukuran: 76 },
        { label: ['CARA', 'LINDUNGI', 'PASSWORD'], judul: [{ t: 'simpan', mulai: T.simpan + 0.05, warna: K.kuning }, { t: '&', mulai: T.follow - 0.25, warna: K.abu }, { t: 'follow', mulai: T.follow, warna: K.teal }], jMulai: T.simpan },
      ]}
    />
  );
};

// ===============================================================================================================
function daftarSfx(T: WK) {
  const S = T.s;
  const ketik = T.tekan.map((m) => bunyi('klik', m, 0.35));
  const tombol = Array.from({ length: 12 }, (_, i) => bunyi('tik', T.n36 + i * ((Math.max(1.4, T.n25 - 0.5 - T.n36)) / 12), 0.14));
  const kali = Array.from({ length: 8 }, (_, i) => bunyi('klik', T.n25 + i * 0.14, 0.1));
  const spek = Array.from({ length: 6 }, (_, i) => bunyi('tik', T.gambar6 + i * 0.22, 0.12));
  const pg = Array.from({ length: 5 }, (_, i) => bunyi('tik', T.n17 - 0.2 + i * 0.08, 0.12));
  return [
    ...ketik,
    bunyi('kunci', T.benar, 0.4),
    bunyi('swish', T.n95, 0.25),
    bunyi('whooshA', S[1].mulai, 0.3),
    bunyi('pop', T.n2023, 0.28),
    bunyi('pop', T.durham, 0.3),
    bunyi('pop', T.surrey, 0.3),
    bunyi('pop', T.royal, 0.3),
    bunyi('whooshB', S[2].mulai, 0.3),
    bunyi('swish', T.n16 - 0.1, 0.3),
    bunyi('pop', T.n2021, 0.25),
    bunyi('whooshPop', S[3].mulai, 0.3),
    ...tombol,
    ...kali,
    bunyi('whooshTurun', S[4].mulai + 0.1, 0.35),
    bunyi('pop', S[4].mulai + 0.2, 0.3),
    ...pg,
    bunyi('jepret', T.n17 + 0.15, 0.3),
    bunyi('whooshBerat', S[5].mulai + 0.05, 0.4),
    bunyi('swish', T.bunyi6, 0.25),
    ...spek,
    bunyi('pop', T.mel, 0.3),
    bunyi('whooshA', S[6].mulai, 0.3),
    bunyi('kunci', T.coat, 0.35),
    ...Array.from({ length: 6 }, (_, i) => bunyi('pop', T.bedain - 0.2 + i * 0.16, 0.18)),
    bunyi('whooshLembut', S[7].mulai, 0.3),
    bunyi('riser', T.n95b + 0.1, 0.22),
    bunyi('pop', T.hp8, 0.3),
    bunyi('pop', T.zoom, 0.3),
    bunyi('whooshB', S[8].mulai, 0.3),
    bunyi('pop', T.gaya, 0.3),
    bunyi('pop', T.pass9, 0.3),
    bunyi('pop', T.verif, 0.3),
    bunyi('whooshTerang', T.keluarDunia + 0.1, 0.3),
    bunyi('pop', T.simpan + 0.15, 0.35),
    bunyi('klik', T.simpan + 0.65, 0.4),
    bunyi('pop', T.follow - 0.2, 0.3),
    bunyi('klik', T.follow + 0.3, 0.4),
    bunyi('whooshLembut', T.keluarCta + 0.05, 0.3),
  ];
}

// ===============================================================================================================
// SAMPUL 9:16: 1 kalimat ("Password kamu bisa ketebak dari suara ketikan") + keyboard bercincin suara
export const ContohSuaraKetikSampul: React.FC = () => {
  const T = waktuKetik([], undefined, 59);
  const kam = { x: LX, y: 1120, z: 1.02, vx: 0, vy: 0, lebar: 1080, tinggi: 1920 };
  const sorotTuts = ['r', 'a', 'h', 's', 'i', '8'];
  return (
    <AbsoluteFill style={{ background: K.latar, overflow: 'hidden' }}>
      <LatarSeri kam={kam} />
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(540px, 1240px) scale(1.02) translate(${-LX}px, -1120px)` }}>
          <div style={{ position: 'absolute', left: 0, top: 0, filter: 'brightness(0.7)' }}>
            <Laptop T={T} sampul />
          </div>
          {sorotTuts.map((k, i) => {
            const p = tuts(k);
            return (
              <React.Fragment key={k}>
                <div style={{ position: 'absolute', left: p.x - p.w / 2, top: p.y - p.h / 2, width: p.w, height: p.h, borderRadius: 9, background: K.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 26, color: K.latar }}>{k}</div>
                <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                  {[60, 110].map((r, j) => (
                    <circle key={j} cx={p.x} cy={p.y} r={r + i * 6} fill="none" stroke={K.teal} strokeWidth={6 - j * 2} opacity={0.75 - j * 0.3} />
                  ))}
                </svg>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 90, top: 196, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 10, height: 44, borderRadius: 5, background: K.teal }} />
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: K.abu }}>RISET 2023 · SUARA KETIKAN</div>
      </div>
      <div style={{ position: 'absolute', left: 90, top: 262, width: 780, fontFamily: SAIRA, fontWeight: 800, fontSize: 118, lineHeight: 1.04, color: K.tinta }}>
        <div>AI nebak tombol</div>
        <div>
          dari suaranya: <span style={{ display: 'inline-block', background: K.kuning, color: K.latar, padding: '0 0.1em', borderRadius: 12, lineHeight: 0.98 }}>95%</span>
        </div>
      </div>
      <Grain kuat={0.06} garisScan={0} vinyet={0.45} warnaVinyet="2,5,14" />
    </AbsoluteFill>
  );
};
