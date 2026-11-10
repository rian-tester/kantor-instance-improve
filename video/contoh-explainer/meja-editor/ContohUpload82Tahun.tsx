// Frame hero (pembuka, tengah, puncak): 15, 855, 1426.
// contoh video explainer K3 (akun generik, konten contoh): "Video yang diupload ke YouTube sehari = ±82 tahun nonton".
// Seri "meja editor amber" (sama dengan K1): MONITOR program + TIMELINE yang terus kemasukan klip (aliran upload).
// Alur: player "upload sehari" yang total durasinya naik 0 → 82 tahun (diikat ke klip yang masuk timeline) → slate YouTube
// 2020: 500 jam/menit → jam 24 jam (1.440 menit, diikat ke busur) × 500 = tumpukan 720.000 jam → ÷24: kalender 30.000 hari →
// kamera nyelam ke timeline UMUR manusia: playhead 0 → 82 tahun (ditahan) → 1 detik = 8 blok "1 jam" (+⅓) → grafik 2010 (35)
// vs 2020 (500): blok 35 ditumpuk 14× → 2025 hitungan lain: lautan video 20 juta/hari → 20 miliar total → HP: klip kamu
// masuk lautan → CTA simpan + follow → balik ke player awal (loop).
// Fakta: YouTube Official Blog 14/02/2020 (500 jam/menit) & 10/11/2010 (35 jam/menit); Google Blog 23/04/2025 (20 juta/hari,
// data Maret 2025; 20 miliar total, data April 2025). Hitungan kami: 500×1.440 = 720.000; ÷24 = 30.000 hari; ÷365 ≈ 82,2 tahun;
// 500÷60 ≈ 8,3; 500÷35 ≈ 14,3. Foto = foto K1 (fal flux schnell), mozaik disusun ffmpeg.
import React, { useMemo } from 'react';
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  AngkaJalan, Bunyi, Dunia, EASE, formatAngka, GarisDigambar, kata, maju, noise, pegas, Pop, Subtitle, useDetik, type Kata, type KunciKamera,
} from "../../src/gerak";
import { ANTON, INTER, MONO } from "../../src/gerak/seri/meja-editor/font";
import {
  bunyi, Chip, CtaKD, JudulKD, kameraKD, KD, LatarKD, lerp, lerpKotak, pathKotak, PeneduhAtas, PlayheadKD, RangkaLayar, SlateKD, sorot, SumberKD,
  TeksturKD, TrackKD, type KlipKD, type Kotak,
} from "../../src/gerak/seri/meja-editor/seri";
import type { Kalimat } from "./ContohMilidetik";

export type DataK3 = { durasi: number; kata: Kata[]; kalimat?: Kalimat[] };

const MON: Kotak = { x: 90, y: 584, w: 900, h: 506, r: 20 };
const HP: Kotak = { x: 296, y: 540, w: 488, h: 866, r: 66 };
const X0 = 540;
const TY = 1214;
const TH = 84;
const FOTO = ['pasar', 'pantai', 'dapur', 'anjing', 'gunung', 'kucing', 'jalan', 'piknik', 'pasangan'];
const foto = (n: string) => `k1/foto/${n}.svg`;
// timeline umur (S4), koordinat dunia
const RX0 = 200;
const RX1 = 800;
const xUmur = (th: number) => RX0 + ((RX1 - RX0) * th) / 82;

// ======================================================================================================
function waktuK3(d: Kata[], total: number, kal: Kalimat[] = []) {
  const CAD: [number, number][] = [
    [0.15, 5.64], [6.01, 11.78], [12.12, 18.46], [18.81, 25.19], [25.58, 29.34], [29.75, 33.22], [33.57, 36.96], [37.34, 43.84], [44.2, 49.2],
    [49.57, 54.39], [54.8, 58.17],
  ];
  const s = CAD.map((c, i) => ({ mulai: kal[i]?.mulai ?? c[0], akhir: kal[i]?.akhir ?? c[1] }));
  const k = (c: string, setelah = 0, cad = 0) => kata(d, c, setelah, cad);
  const n82a = k('82', s[0].mulai, 3.68);
  const nonstop = k('nonstop', n82a, 5.16);
  const hitungan = k('hitungan', s[1].mulai, 6.18);
  const th2020 = k('2020', hitungan, 8.27);
  const n500 = k('500', th2020, 9.23);
  const n1440 = k('1440', s[2].mulai, 13.1);
  const totalnya = k('totalnya', n1440, 15.12);
  const n720 = k('720000', totalnya, 15.64);
  const dibagi = k('dibagi', s[3].mulai, 19.0);
  const n24 = k('24', dibagi, 19.44);
  const n30rb = k('30000', n24, 20.82);
  const tanpa = k('tanpa', n30rb, 22.42);
  const atau = k('atau', tanpa, 23.43);
  const n82b = k('82', atau, 24.5);
  const detik5 = k('detik', s[4].mulai, 26.52);
  const delapan = k('delapan', detik5, 27.52);
  const th2010 = k('2010', s[5].mulai, 30.08);
  const n35 = k('35', th2010, 32.21);
  const sepuluh = k('sepuluh', s[6].mulai, 33.77);
  const naik = k('naik', sepuluh, 34.95);
  const n14 = k('14', naik, 35.84);
  const th2025 = k('2025', s[7].mulai, 38.15);
  const lain = k('lain', th2025, 39.57);
  const n20a = k('20', lain, 41.47);
  const juta = k('juta', n20a, 42.02);
  const n20b = k('20', s[8].mulai, 46.01);
  const miliar = k('miliar', n20b, 46.54);
  const musik = k('musik', miliar, 47.56);
  const shorts = k('shorts', musik, 48.13);
  const podcast = k('podcast', shorts, 48.77);
  const klipKamu = k('klip', s[9].mulai, 50.03);
  const upload10 = k('upload', klipKamu, 50.62);
  const masuk10 = k('masuk', upload10, 51.5);
  const barengan10 = k('barengan', masuk10, 51.82);
  const jutaan = k('jutaan', barengan10, 52.51);
  const simpan = k('simpan', s[10].mulai, 54.8);
  const follow = k('follow', simpan, 56.85);
  return {
    total, s, n82a, nonstop, hitungan, th2020, n500, n1440, totalnya, n720, dibagi, n24, n30rb, tanpa, atau, n82b, detik5, delapan, th2010, n35,
    sepuluh, naik, n14, th2025, lain, n20a, juta, n20b, miliar, musik, shorts, podcast, klipKamu, upload10, masuk10, barengan10, jutaan, simpan, follow,
    // nyelam ke timeline umur
    selamMasuk: atau - 0.95,
    umurMulai: atau - 0.05,
    umurAkhir: n82b + 0.05,
    selamKeluar: Math.max(n82b + 1.0, s[4].mulai - 0.1),
    keHp: s[9].mulai,
    pulang: total - 1.05,
    loop: total - 0.3,
  };
}
type WaktuK = ReturnType<typeof waktuK3>;

// ======================================================================================================
// aliran upload di timeline: klip lebar acak terus masuk dari kanan
const KLIP: KlipKD[] = (() => {
  const r: KlipKD[] = [];
  let m = -900;
  for (let i = 0; i < 420; i++) {
    const w = 38 + Math.floor(random(`k3w${i}`) * 110);
    r.push({ mulai: m, akhir: m + w, src: foto(FOTO[Math.floor(random(`k3f${i}`) * FOTO.length)]) });
    m += w;
  }
  return r;
})();
const P_HOOK = 2600; // klip yang masuk selama hook = "upload sehari" (dipercepat)
function posisiP(t: number, T: WaktuK) {
  // hook: ngebut lalu melambat pas 82; abis itu ngalir pelan terus (35 px/dtk); pas HP disembunyiin, balik ke 0
  const hook = P_HOOK * maju(t, 0.25, T.n82a + 0.02, (n) => 1 - Math.pow(1 - n, 1.6));
  const pelan = Math.max(0, t - (T.n82a + 0.02)) * 35;
  const balik = maju(t, T.keHp + 0.6, T.keHp + 1.4, EASE.kamera);
  return (hook + pelan) * (1 - balik);
}

// ======================================================================================================
export const ContohUpload82Tahun: React.FC<DataK3> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuK3(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const S = T.s;
  const P = posisiP(t, T);
  const ZU = { x: 500, y: 1150, z: 1.5 };
  const kunci: KunciKamera[] = [
    { t: 0, x: 540, y: 960, z: 1 },
    { t: S[1].mulai, x: 540, y: 958, z: 1.03, ease: EASE.linear },
    { t: S[1].mulai + 0.6, x: 540, y: 960, z: 1 },
    { t: T.selamMasuk, x: 540, y: 960, z: 1.02, ease: EASE.linear },
    { t: T.selamMasuk + 0.8, ...ZU },
    { t: T.selamKeluar - 0.1, x: ZU.x, y: ZU.y - 6, z: ZU.z + 0.04, ease: EASE.linear },
    { t: T.selamKeluar + 0.6, x: 540, y: 960, z: 1 },
    { t: S[7].mulai, x: 540, y: 962, z: 1.02, ease: EASE.linear },
    { t: S[7].mulai + 0.5, x: 540, y: 960, z: 1 },
    { t: T.keHp, x: 540, y: 960, z: 1.025, ease: EASE.linear },
    { t: T.keHp + 0.6, x: 540, y: 960, z: 1 },
    { t: T.simpan - 0.1, x: 540, y: 950, z: 1.03, ease: EASE.linear },
    { t: T.simpan + 0.5, x: 540, y: 960, z: 1 },
    { t: T.pulang, x: 540, y: 960, z: 1.01, ease: EASE.linear },
    { t: T.loop, x: 540, y: 960, z: 1 },
    { t: total + 1, x: 540, y: 960, z: 1 },
  ];
  const getar = [
    { t: T.th2020 + 0.02, kuat: 9 },
    { t: T.n720 + 1.3, kuat: 6 },
    { t: T.umurAkhir + 0.05, kuat: 7 },
    { t: T.n14 + 0.05, kuat: 6 },
    { t: T.follow + 0.33, kuat: 5 },
  ];
  const kam = kameraKD(kunci, t, fps, total, getar);
  const selam = maju(t, T.selamMasuk + 0.1, T.selamMasuk + 0.8, EASE.kamera) * (1 - maju(t, T.selamKeluar - 0.1, T.selamKeluar + 0.5, EASE.kamera));
  const hp = maju(t, T.keHp + 0.05, T.keHp + 0.75, EASE.kamera) * (1 - maju(t, T.pulang, T.loop - 0.05, EASE.kamera));
  const box = lerpKotak(MON, HP, hp);
  const oTrack = 1 - maju(t, T.keHp, T.keHp + 0.45, EASE.keluar) + maju(t, T.pulang + 0.1, T.loop - 0.1, EASE.masuk);
  const yTrack = (1 - Math.min(1, oTrack)) * 120;
  return (
    <AbsoluteFill style={{ background: KD.latar, color: KD.tulang, overflow: 'hidden', fontFamily: INTER }}>
      <LatarKD kam={kam} />
      <Dunia kamera={kam} tinggiDunia={1920} lebarDunia={1080} blurGerak={1400}>
        <RangkaLayar k={box} hp={hp} tag={tagMonitor(t, T)} timecode={hp < 0.5 ? jamTimeline(P) : undefined} redup={selam}>
          <IsiMonitor T={T} P={P} box={box} hp={hp} />
        </RangkaLayar>
        <SumberMonitor T={T} selam={selam} hp={hp} />
        <div style={{ position: 'absolute', left: 0, top: 0, translate: `0 ${yTrack.toFixed(1)}px` }}>
          <TrackKD klip={KLIP} P={P} pxms={1} x0={X0} y={TY} h={TH} frameMs={60} asalGrid={0} o={Math.min(1, oTrack) * (1 - 0.94 * selam)} />
          <PlayheadKD x={X0} y={TY} h={TH} o={Math.min(1, oTrack) * (1 - selam)} />
        </div>
        <TimelineUmur T={T} />
      </Dunia>
      <PeneduhAtas kuat={Math.max(selam, 0.5)} />
      <HudK3 T={T} />
      <Subtitle
        kata={d.kata}
        kalimat={d.kalimat}
        font={INTER}
        tebal={700}
        ukuran={44}
        maksHuruf={34}
        sorot={KD.amber}
        pita="rgba(11,11,14,0.62)"
        sampai={T.loop - 0.4}
        gabung={[]}
        zona={[{ dari: 0, x: 540, y: 1336, lebar: 960 }, { dari: T.keHp + 0.3, x: 540, y: 1436, lebar: 960 }, { dari: T.pulang, x: 540, y: 1336, lebar: 960 }]}
      />
      <TeksturKD />
      <></>
    </AbsoluteFill>
  );
};

const jamTimeline = (P: number) => {
  const dtk = Math.max(0, Math.floor(P / 20));
  return `${String(Math.floor(dtk / 60)).padStart(2, '0')}:${String(dtk % 60).padStart(2, '0')}`;
};
function tagMonitor(t: number, T: WaktuK) {
  if (t > 0.05 && t < T.n82a + 0.3) return 'UPLOAD SEHARI · DIPERCEPAT';
  return 'PROGRAM';
}

// ======================================================================================================
const IsiMonitor: React.FC<{ T: WaktuK; P: number; box: Kotak; hp: number }> = ({ T, P, box, hp }) => {
  const W = box.w - 6;
  const H = box.h - 6;
  return (
    <>
      <PlayerK3 T={T} P={P} W={W} H={H} />
      <SlateK3 T={T} W={W} H={H} />
      <HariK3 T={T} W={W} H={H} />
      <KalenderK3 T={T} W={W} H={H} />
      <DetikK3 T={T} W={W} H={H} />
      <GrafikK3 T={T} W={W} H={H} />
      <LautanK3 T={T} W={W} H={H} />
      <HpK3 T={T} W={W} H={H} hp={hp} />
    </>
  );
};

// S1 & loop: player "upload sehari", total durasi naik 0 → 82 tahun diikat ke klip yang masuk timeline ------------------
const PlayerK3: React.FC<{ T: WaktuK; P: number; W: number; H: number }> = ({ T, P, W, H }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const o = 1 - maju(t, S[1].mulai - 0.1, S[1].mulai + 0.2) + maju(t, T.pulang + 0.15, T.loop - 0.15);
  if (o <= 0) return null;
  // progress total: berapa bagian "upload sehari" yang udah masuk (P_HOOK = sehari penuh)
  const pr = Math.min(1, t < S[1].mulai ? P / P_HOOK : 0);
  const thn = 82 * pr;
  const kb = 1.04 + 0.04 * maju(t, 0, S[1].mulai, EASE.linear);
  const nyala = t > T.n82a - 0.05 && t < S[1].mulai;
  const sk = nyala ? 1 + 0.08 * Math.max(0, 1 - pegas(t, T.n82a - 0.05, fps, { damping: 9, stiffness: 220, mass: 0.6 })) : 1;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, o) }}>
      <Img src={staticFile(foto('pasar'))} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', scale: String(kb) }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,6,7,0) 45%, rgba(6,6,7,0.85) 100%)' }} />
      {/* tombol play */}
      <svg style={{ position: 'absolute', left: W / 2 - 46, top: H / 2 - 76, overflow: 'visible' }} width={92} height={92}>
        <circle cx={46} cy={46} r={44} fill="rgba(11,11,14,0.6)" stroke={KD.tulang} strokeWidth={4} />
        <path d="M 36 26 L 68 46 L 36 66 Z" fill={KD.tulang} />
      </svg>
      {/* bilah progres + waktu */}
      <div style={{ position: 'absolute', left: 30, right: 30, bottom: 34, height: 8, borderRadius: 4, background: 'rgba(239,235,226,0.25)' }}>
        <div style={{ position: 'absolute', left: 0, top: -6, width: 20, height: 20, borderRadius: 10, background: KD.amber }} />
      </div>
      <div style={{ position: 'absolute', left: 30, bottom: 56, fontFamily: MONO, fontWeight: 700, fontSize: 26, color: KD.tulang, fontVariantNumeric: 'tabular-nums' }}>0:00</div>
      <div style={{ position: 'absolute', right: 30, bottom: 56, display: 'flex', alignItems: 'baseline', gap: 10, padding: '4px 16px', borderRadius: 12, background: nyala ? KD.amber : 'rgba(11,11,14,0.85)', border: `3px solid ${KD.amber}`, scale: String(sk), transformOrigin: '100% 100%' }}>
        <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 24, color: nyala ? KD.latar : KD.abu }}>durasi total</span>
        <span style={{ fontFamily: ANTON, fontSize: 58, lineHeight: 1.05, color: nyala ? KD.latar : KD.amber, minWidth: '1.15em', textAlign: 'right', display: 'inline-block', fontVariantNumeric: 'tabular-nums' }}>{Math.floor(thn)}</span>
        <span style={{ fontFamily: ANTON, fontSize: 40, color: nyala ? KD.latar : KD.amber }}>TAHUN</span>
      </div>
    </div>
  );
};

// S2: slate YouTube 2020 --------------------------------------------------------------------------------------------
const SlateK3: React.FC<{ T: WaktuK; W: number; H: number }> = ({ T, W, H }) => {
  const t = useDetik();
  const S = T.s;
  const g = maju(t, S[1].mulai - 0.1, S[1].mulai + 0.2) * (1 - maju(t, S[2].mulai - 0.2, S[2].mulai + 0.1));
  return (
    <>
      {g > 0 ? <div style={{ position: 'absolute', inset: 0, background: `rgba(14,13,16,${g.toFixed(3)})` }} /> : null}
      <SlateKD
        x={W / 2}
        y={H / 2 + 4}
        w={560}
        masuk={S[1].mulai}
        tepuk={T.th2020}
        keluar={S[2].mulai - 0.25}
        baris={[
          { label: 'SUMBER', isi: 'YouTube Official Blog', mulai: T.hitungan + 0.4 },
          { label: 'TAHUN', isi: '2020', mulai: T.th2020 - 0.05, warna: KD.amber },
          { label: 'ANGKA', isi: '500 jam / menit', mulai: T.n500, warna: KD.amber },
        ]}
      />
    </>
  );
};

// S3: jam 24 jam (1.440 menit, busur) × 500 = tumpukan 720.000 jam; S4 awal: ÷ 24 --------------------------------------
const HariK3: React.FC<{ T: WaktuK; W: number; H: number }> = ({ T, W, H }) => {
  const t = useDetik();
  const S = T.s;
  const o = maju(t, S[2].mulai - 0.15, S[2].mulai + 0.2) * (1 - maju(t, T.n30rb - 0.55, T.n30rb - 0.3));
  if (o <= 0) return null;
  const cx = 250;
  const cy = H / 2 + 6;
  const r = 165;
  const pBusur = maju(t, T.n1440 - 0.35, T.n1440 + 0.85, EASE.kamera);
  const nTick = 96;
  const pTumpuk = maju(t, T.n720 - 0.15, T.n720 + 1.25, EASE.kamera);
  // tumpukan klip 720.000 jam (kolom kanan)
  const kx = 560;
  const kw = 290;
  const kBawah = H - 60;
  const kTinggi = H - 210;
  const nBaris = 22;
  const hBaris = kTinggi / nBaris;
  const isiBaris = pTumpuk * nBaris;
  const kali = maju(t, T.totalnya - 0.1, T.totalnya + 0.15);
  const bagi = maju(t, T.n24 - 0.1, T.n24 + 0.1);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, background: '#0e0d10' }}>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        {Array.from({ length: nTick }, (_, i) => {
          const a = (i / nTick) * Math.PI * 2 - Math.PI / 2;
          const panjang = i % 4 === 0 ? 20 : 10;
          const aktif = i / nTick < pBusur;
          return (
            <line
              key={i}
              x1={cx + Math.cos(a) * r}
              y1={cy + Math.sin(a) * r}
              x2={cx + Math.cos(a) * (r - panjang)}
              y2={cy + Math.sin(a) * (r - panjang)}
              stroke={aktif ? KD.amber : 'rgba(239,235,226,0.25)'}
              strokeWidth={i % 4 === 0 ? 4 : 2.5}
              opacity={maju(t, S[2].mulai + i * 0.004, S[2].mulai + 0.2 + i * 0.004)}
            />
          );
        })}
        <GarisDigambar d={`M ${cx} ${cy - r - 14} A ${r + 14} ${r + 14} 0 1 1 ${cx - 0.1} ${cy - r - 14}`} mulai={T.n1440 - 0.35} lama={1.2} warna={KD.amber} tebal={6} />
      </svg>
      <div style={{ position: 'absolute', left: cx, top: cy - 66, translate: '-50% 0', textAlign: 'center' }}>
        <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 24, letterSpacing: '0.12em', color: KD.abu }}>1 HARI</div>
        <AngkaJalan dari={0} ke={1440} progress={pBusur} gaya={{ fontFamily: ANTON, fontSize: 70, lineHeight: 1.05, color: KD.tulang }} />
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.amber }}>menit</div>
      </div>
      {/* × 500 jam */}
      {kali > 0 ? <Chip x={cx + r + 72} y={cy} teks="× 500 jam" ukuran={30} o={kali} skala={0.8 + 0.2 * kali} /> : null}
      {/* tumpukan */}
      <div style={{ position: 'absolute', left: kx, top: kBawah - kTinggi, width: kw, height: kTinggi, borderRadius: 10, border: '2px dashed rgba(239,235,226,0.18)', opacity: maju(t, T.totalnya, T.totalnya + 0.3) }} />
      {Array.from({ length: nBaris }, (_, i) => {
        const p = Math.min(1, Math.max(0, isiBaris - i));
        if (p <= 0) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: kx + 4, top: kBawah - (i + 1) * hBaris + 2, width: (kw - 8) * p, height: hBaris - 3, display: 'flex', gap: 3 }}>
            {Array.from({ length: 6 }, (_, j) => (
              <div key={j} style={{ flex: 1, borderRadius: 3, background: j % 3 === i % 3 ? KD.amber : j % 2 ? KD.emas : '#e0a14a', opacity: 0.75 + 0.25 * random(`tb${i}-${j}`) }} />
            ))}
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: kx + kw / 2, top: kBawah - kTinggi * Math.max(0.12, pTumpuk) - 74, translate: '-50% 0', opacity: maju(t, T.n720 - 0.15, T.n720), whiteSpace: 'nowrap', textAlign: 'center' }}>
        <AngkaJalan dari={0} ke={720000} progress={pTumpuk} gaya={{ fontFamily: ANTON, fontSize: 56, lineHeight: 1, color: KD.amber }} />
        <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.amber, marginLeft: 8 }}>jam</span>
      </div>
      {bagi > 0 ? <Chip x={kx + kw / 2} y={kBawah - kTinggi / 2} teks="÷ 24 jam" ukuran={40} isi o={bagi} skala={0.8 + 0.2 * pegasSederhana(t, T.n24 - 0.1)} /> : null}
    </div>
  );
};
const pegasSederhana = (t: number, m: number) => (t < m ? 0 : 1 - Math.exp(-(t - m) * 9) * Math.cos((t - m) * 14));

// S4: kalender 30.000 hari (lembar dibalik, angka diikat ke balikan) ---------------------------------------------------
const KalenderK3: React.FC<{ T: WaktuK; W: number; H: number }> = ({ T, W, H }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const o = maju(t, T.n30rb - 0.5, T.n30rb - 0.25) * (1 - maju(t, T.selamKeluar + 0.2, T.selamKeluar + 0.5));
  if (o <= 0) return null;
  const p = maju(t, T.n30rb - 0.25, T.n30rb + 0.85, EASE.kamera);
  const n = Math.round(30000 * p);
  const balikan = p * 36;
  const fase = p >= 1 ? 1 : balikan % 1;
  const bw = 360;
  const bh = 340;
  const bx = W / 2 - bw / 2;
  const by = H / 2 - bh / 2 + 10;
  const m = pegas(t, T.n30rb - 0.5, fps, { damping: 14, stiffness: 160 });
  const lembar = (isi: string) => (
    <div style={{ position: 'absolute', inset: 0, borderRadius: '0 0 18px 18px', background: '#efebe2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: ANTON, fontSize: 100, lineHeight: 1, color: KD.latar, fontVariantNumeric: 'tabular-nums' }}>{isi}</div>
      <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 32, color: '#6b6457', marginTop: 6 }}>hari</div>
    </div>
  );
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, background: '#0e0d10' }}>
      <div style={{ position: 'absolute', left: bx, top: by, width: bw, height: bh, scale: String(0.85 + 0.15 * m), opacity: Math.min(1, m * 2) }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: bw, height: 64, borderRadius: '18px 18px 0 0', background: KD.amber }} />
        {[0.28, 0.72].map((x, i) => (
          <div key={i} style={{ position: 'absolute', left: bw * x - 9, top: -16, width: 18, height: 42, borderRadius: 9, background: '#2a2620', border: '3px solid #0b0b0e' }} />
        ))}
        <div style={{ position: 'absolute', left: 0, top: 64, width: bw, height: bh - 64, perspective: 900 }}>
          {lembar(formatAngka(n))}
          {p < 1 && p > 0 ? (
            <div style={{ position: 'absolute', inset: 0, transformOrigin: '50% 0%', transform: `rotateX(${(fase * 170).toFixed(1)}deg)`, backfaceVisibility: 'hidden', filter: `brightness(${(1 - fase * 0.5).toFixed(2)})` }}>
              {lembar(formatAngka(Math.max(0, n - 833)))}
            </div>
          ) : null}
        </div>
      </div>
      <div style={{ position: 'absolute', left: W / 2, top: by + bh + 14, translate: '-50% 0', fontFamily: INTER, fontWeight: 800, fontSize: 30, color: KD.amber, opacity: maju(t, T.tanpa - 0.1, T.tanpa + 0.15), whiteSpace: 'nowrap' }}>
        nonton tanpa henti
      </div>
    </div>
  );
};

// S4 akhir: timeline UMUR manusia di dunia (kamera nyelam ke lajur). Playhead umur 0 → 82 tahun, angka diikat ke playhead.
const ORANG = [
  { th: 1, tinggi: 46, jenis: 'bayi' },
  { th: 9, tinggi: 96, jenis: 'anak' },
  { th: 18, tinggi: 138, jenis: 'muda' },
  { th: 35, tinggi: 152, jenis: 'dewasa' },
  { th: 58, tinggi: 148, jenis: 'dewasa' },
  { th: 79, tinggi: 136, jenis: 'tua' },
] as const;
const TimelineUmur: React.FC<{ T: WaktuK }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const o = maju(t, T.selamMasuk + 0.35, T.selamMasuk + 0.7) * (1 - maju(t, T.selamKeluar - 0.15, T.selamKeluar + 0.15));
  if (o <= 0) return null;
  const pU = maju(t, T.umurMulai, T.umurAkhir, EASE.kamera);
  const umur = 82 * pU;
  const xP = xUmur(umur);
  const yLantai = TY - 6;
  const selesai = t > T.umurAkhir;
  const tahan = pegas(t, T.umurAkhir, fps, { damping: 9, stiffness: 220, mass: 0.6 });
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d={`M ${RX0} ${yLantai} H ${RX1}`} mulai={T.selamMasuk + 0.35} lama={0.5} warna={KD.tulang} tebal={4} />
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={xUmur(i * 10)} y1={yLantai} x2={xUmur(i * 10)} y2={yLantai + 14} stroke="rgba(239,235,226,0.7)" strokeWidth={3} opacity={maju(t, T.selamMasuk + 0.5 + i * 0.03, T.selamMasuk + 0.6 + i * 0.03)} />
        ))}
        <line x1={xUmur(82)} y1={yLantai - 8} x2={xUmur(82)} y2={yLantai + 18} stroke={KD.amber} strokeWidth={4} opacity={maju(t, T.selamMasuk + 0.7, T.selamMasuk + 0.8)} />
        {/* jejak umur yang udah lewat */}
        <line x1={RX0} y1={yLantai} x2={xP} y2={yLantai} stroke={KD.amber} strokeWidth={6} opacity={pU > 0 ? 1 : 0} />
      </svg>
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} style={{ position: 'absolute', left: xUmur(i * 10), top: yLantai + 20, translate: '-50% 0', fontFamily: MONO, fontWeight: 700, fontSize: 15, color: KD.abu, opacity: maju(t, T.selamMasuk + 0.5, T.selamMasuk + 0.7) }}>
          {i * 10}
        </div>
      ))}
      <div style={{ position: 'absolute', left: xUmur(82) + 4, top: yLantai + 20, fontFamily: MONO, fontWeight: 700, fontSize: 15, color: KD.amber, opacity: maju(t, T.selamMasuk + 0.7, T.selamMasuk + 0.8) }}>82</div>
      <div style={{ position: 'absolute', left: RX0, top: yLantai + 44, fontFamily: INTER, fontWeight: 700, fontSize: 15, letterSpacing: '0.12em', color: KD.abu, opacity: maju(t, T.selamMasuk + 0.6, T.selamMasuk + 0.8) }}>UMUR (TAHUN)</div>
      {ORANG.map((g, i) => {
        const lewat = umur >= g.th;
        const pp = pegas(t, T.umurMulai + ((T.umurAkhir - T.umurMulai) * g.th) / 82, fps, { damping: 11, stiffness: 200, mass: 0.6 });
        return <Orang key={i} x={xUmur(g.th)} y={yLantai - 3} tinggi={g.tinggi} jenis={g.jenis} warna={lewat ? KD.tulang : 'rgba(239,235,226,0.22)'} skala={lewat ? 0.92 + 0.08 * pp : 0.92} seed={`or${i}`} />;
      })}
      {/* playhead umur + angka tahun yang ditahan */}
      {pU > 0 || t > T.umurMulai - 0.3 ? (
        <>
          <div style={{ position: 'absolute', left: xP - 2, top: yLantai - 190, width: 4, height: 210, background: KD.amber, boxShadow: '0 0 12px rgba(255,180,84,0.6)', opacity: maju(t, T.umurMulai - 0.3, T.umurMulai) }} />
          <div
            style={{
              position: 'absolute',
              left: xP,
              top: yLantai - 250,
              translate: `${(-50 - 46 * pU).toFixed(1)}% 0`,
              opacity: maju(t, T.umurMulai - 0.3, T.umurMulai),
              padding: '2px 14px',
              borderRadius: 10,
              background: selesai ? KD.amber : 'rgba(11,11,14,0.92)',
              border: `3px solid ${KD.amber}`,
              display: 'flex',
              alignItems: 'baseline',
              gap: 6,
              whiteSpace: 'nowrap',
              scale: String(selesai ? 1 + 0.12 * Math.max(0, 1 - tahan) + 0.04 : 1),
            }}
          >
            <span style={{ fontFamily: ANTON, fontSize: 44, lineHeight: 1.05, color: selesai ? KD.latar : KD.amber, fontVariantNumeric: 'tabular-nums', minWidth: '1.1em', textAlign: 'right', display: 'inline-block' }}>{Math.floor(umur)}</span>
            <span style={{ fontFamily: ANTON, fontSize: 28, color: selesai ? KD.latar : KD.amber }}>TAHUN</span>
          </div>
        </>
      ) : null}
    </div>
  );
};

/** Siluet orang sederhana (tanpa wajah): kepala + badan + kaki; "tua" bungkuk + tongkat. */
const Orang: React.FC<{ x: number; y: number; tinggi: number; jenis: string; warna: string; skala: number; seed: string }> = ({ x, y, tinggi, jenis, warna, skala, seed }) => {
  const t = useDetik();
  const napas = 1 + Math.sin(t * 2.2 + seed.length) * 0.012;
  const h = tinggi;
  const kepala = jenis === 'bayi' ? h * 0.36 : jenis === 'anak' ? h * 0.2 : h * 0.15;
  const lebar = jenis === 'bayi' ? h * 0.7 : h * 0.3;
  const bungkuk = jenis === 'tua' ? 10 : 0;
  return (
    <svg style={{ position: 'absolute', left: x - 60, top: y - h - 6, overflow: 'visible' }} width={120} height={h + 6}>
      <g transform={`translate(60 ${h + 6}) scale(${skala} ${(skala * napas).toFixed(4)}) translate(-60 ${-(h + 6)})`} fill={warna}>
        {jenis === 'bayi' ? (
          <>
            <circle cx={60 + lebar * 0.32} cy={h - kepala * 0.9} r={kepala / 2} />
            <rect x={60 - lebar / 2} y={h - kepala * 0.75} width={lebar * 0.75} height={kepala * 0.7} rx={kepala * 0.35} />
          </>
        ) : (
          <>
            <circle cx={60 + bungkuk} cy={kepala / 2 + 2} r={kepala / 2} />
            <path d={`M ${60 - lebar / 2 + bungkuk * 0.6} ${kepala + 8} Q ${60 + bungkuk} ${kepala + 2} ${60 + lebar / 2 + bungkuk * 0.6} ${kepala + 8} L ${60 + lebar / 2} ${h * 0.6} L ${60 - lebar / 2} ${h * 0.6} Z`} />
            <rect x={60 - lebar / 2 + 2} y={h * 0.58} width={lebar * 0.4} height={h * 0.42} rx={4} />
            <rect x={60 + lebar * 0.1 - 2} y={h * 0.58} width={lebar * 0.4} height={h * 0.42} rx={4} />
            {jenis === 'tua' ? <path d={`M ${60 + lebar / 2 + 14} ${h * 0.45} L ${60 + lebar / 2 + 20} ${h}`} stroke={warna} strokeWidth={5} strokeLinecap="round" fill="none" /> : null}
          </>
        )}
      </g>
    </svg>
  );
};

// S5: 1 detik = ±8 jam video baru (8 blok + sepertiga) -----------------------------------------------------------------
const DetikK3: React.FC<{ T: WaktuK; W: number; H: number }> = ({ T, W, H }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const o = maju(t, S[4].mulai - 0.2, S[4].mulai + 0.1) * (1 - maju(t, S[5].mulai - 0.2, S[5].mulai + 0.05));
  if (o <= 0) return null;
  const m = T.detik5 - 0.05; // detik mulai cincin 1 detik
  const pC = maju(t, m, m + 1.0, EASE.linear);
  const cx = 200;
  const cy = H / 2 + 4;
  const r = 120;
  const nBlok = Math.min(8, Math.floor(pC * 8.3 + 0.0001));
  const sepertiga = maju(t, m + 0.96, m + 1.06);
  const bx0 = 372;
  const bw = 132;
  const bh = 104;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, background: '#0e0d10' }}>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(239,235,226,0.18)" strokeWidth={14} />
        {pC > 0 ? (
          <path
            d={`M ${cx} ${cy - r} A ${r} ${r} 0 ${pC > 0.5 ? 1 : 0} 1 ${cx + Math.sin(pC * Math.PI * 2 - 1e-4) * r} ${cy - Math.cos(pC * Math.PI * 2 - 1e-4) * r}`}
            fill="none"
            stroke={KD.amber}
            strokeWidth={14}
            strokeLinecap="round"
          />
        ) : null}
      </svg>
      <div style={{ position: 'absolute', left: cx, top: cy - 44, translate: '-50% 0', textAlign: 'center' }}>
        <div style={{ fontFamily: ANTON, fontSize: 64, lineHeight: 1, color: KD.tulang }}>1</div>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.abu }}>detik</div>
      </div>
      {Array.from({ length: 9 }, (_, i) => {
        const kol = i % 3;
        const bar = Math.floor(i / 3);
        const x = bx0 + kol * (bw + 14);
        const y = 52 + bar * (bh + 14);
        const tampil = i < 8 ? i < nBlok : sepertiga > 0;
        if (!tampil) return <div key={i} style={{ position: 'absolute', left: x, top: y, width: bw, height: bh, borderRadius: 10, border: '2px dashed rgba(239,235,226,0.14)' }} />;
        const mi = i < 8 ? m + (i + 1) / 8.3 : m + 0.96;
        const pp = pegas(t, mi, fps, { damping: 11, stiffness: 240, mass: 0.5 });
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y, width: i < 8 ? bw : bw / 3, height: bh, borderRadius: 10, overflow: 'hidden', scale: String(pp), border: `3px solid ${KD.amber}`, opacity: i < 8 ? 1 : 0.85 }}>
            <Img src={staticFile(foto(FOTO[(i + 2) % FOTO.length]))} style={{ width: bw, height: '100%', objectFit: 'cover' }} />
            {i < 8 ? <div style={{ position: 'absolute', left: 6, bottom: 6, padding: '0 8px', borderRadius: 6, background: KD.amber, fontFamily: INTER, fontWeight: 800, fontSize: 24, color: KD.latar }}>1 jam</div> : null}
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: bx0 + 3 * (bw + 14) + 4, top: 60, opacity: maju(t, m, m + 0.1), textAlign: 'left' }}>
        <div style={{ fontFamily: ANTON, fontSize: 68, lineHeight: 1, color: KD.amber, fontVariantNumeric: 'tabular-nums' }}>{nBlok}</div>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.amber }}>jam</div>
      </div>
    </div>
  );
};

// S6–S7: grafik 2010 (35) vs 2020 (500); blok 35 ditumpuk 14× ke kolom 2020 ------------------------------------------------
const GrafikK3: React.FC<{ T: WaktuK; W: number; H: number }> = ({ T, W, H }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const o = maju(t, S[5].mulai - 0.2, S[5].mulai + 0.1) * (1 - maju(t, T.lain, T.lain + 0.25));
  if (o <= 0) return null;
  const dasar = H - 74;
  const skala = 290 / 500;
  const bw = 170;
  const x10 = W * 0.27;
  const x20 = W * 0.62;
  const p35 = maju(t, T.n35 - 0.1, T.n35 + 0.45, EASE.kamera);
  const h35 = 35 * skala;
  const tumpukMulai = T.naik - 0.05;
  const tumpukAkhir = T.n14 + 0.02;
  const nTumpuk = Math.min(14, Math.floor(maju(t, tumpukMulai, tumpukAkhir, EASE.linear) * 14 + 0.0001));
  const sisa = maju(t, T.n14 + 0.25, T.n14 + 0.55, EASE.kamera);
  const coret = maju(t, T.lain - 0.4, T.lain - 0.1);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, background: '#0e0d10' }}>
      <div style={{ position: 'absolute', left: 40, top: dasar, width: W - 80, height: 3, background: 'rgba(239,235,226,0.35)' }} />
      <div style={{ position: 'absolute', left: 40, top: 62, fontFamily: INTER, fontWeight: 700, fontSize: 22, letterSpacing: '0.12em', color: KD.abu }}>JAM VIDEO DIUPLOAD / MENIT</div>
      {/* 2010 */}
      <div style={{ position: 'absolute', left: x10 - bw / 2, top: dasar - h35 * p35, width: bw, height: h35 * p35, borderRadius: '6px 6px 0 0', background: KD.emas }} />
      <div style={{ position: 'absolute', left: x10, top: dasar + 12, translate: '-50% 0', fontFamily: ANTON, fontSize: 44, color: KD.abu, opacity: maju(t, T.th2010 - 0.1, T.th2010 + 0.15) }}>2010</div>
      <div style={{ position: 'absolute', left: x10, top: dasar - h35 * p35 - 70, translate: '-50% 0', opacity: maju(t, T.n35 - 0.1, T.n35 + 0.05), whiteSpace: 'nowrap' }}>
        <AngkaJalan dari={0} ke={35} progress={p35} gaya={{ fontFamily: ANTON, fontSize: 60, color: KD.tulang }} />
        <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 24, color: KD.abu, marginLeft: 6 }}>jam</span>
      </div>
      {/* 2020: blok 35 ditumpuk */}
      <div style={{ position: 'absolute', left: x20, top: dasar + 12, translate: '-50% 0', fontFamily: ANTON, fontSize: 44, color: KD.amber, opacity: maju(t, T.sepuluh - 0.1, T.sepuluh + 0.15) }}>2020</div>
      {Array.from({ length: nTumpuk }, (_, i) => {
        const mi = tumpukMulai + ((tumpukAkhir - tumpukMulai) * (i + 1)) / 14 - 0.06;
        const jatuh = maju(t, mi, mi + 0.08, EASE.jatuh);
        return <div key={i} style={{ position: 'absolute', left: x20 - bw / 2, top: dasar - (i + 1) * h35 - (1 - jatuh) * 60, width: bw, height: h35 - 2, borderRadius: 4, background: i % 2 ? KD.amber : '#ffc679', opacity: jatuh }} />;
      })}
      {sisa > 0 ? <div style={{ position: 'absolute', left: x20 - bw / 2, top: dasar - 500 * skala, width: bw, height: (500 - 490) * skala * sisa, borderRadius: '6px 6px 0 0', background: KD.amber }} /> : null}
      {nTumpuk > 0 ? (
        <div style={{ position: 'absolute', left: x20 + bw / 2 + 22, top: dasar - nTumpuk * h35 - 30, fontFamily: ANTON, fontSize: 64, lineHeight: 1, color: KD.amber, fontVariantNumeric: 'tabular-nums' }}>
          ×{nTumpuk}
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: x20, top: dasar - 500 * skala - 74, translate: '-50% 0', opacity: sisa, whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: ANTON, fontSize: 60, color: KD.tulang }}>500</span>
        <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 24, color: KD.abu, marginLeft: 6 }}>jam</span>
      </div>
      <Chip x={W * 0.27} y={150} teks="2025: hitungan lain" ukuran={28} o={maju(t, T.th2025 - 0.05, T.th2025 + 0.15)} isi />
      {/* 2025: satuan ganti → grafik jam dicoret */}
      {coret > 0 ? (
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
          <GarisDigambar d={`M 40 30 L ${W - 40} ${H - 40}`} mulai={T.lain - 0.4} lama={0.25} warna={KD.koral} tebal={8} />
        </svg>
      ) : null}
    </div>
  );
};

// S8–S9: lautan video (mozaik thumbnail) yang mundur: 20 juta/hari → 20 miliar total --------------------------------------
const LautanK3: React.FC<{ T: WaktuK; W: number; H: number }> = ({ T, W, H }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const o = maju(t, T.lain, T.lain + 0.3) * (1 - maju(t, T.keHp + 0.1, T.keHp + 0.4));
  if (o <= 0) return null;
  // skala mozaik: 1,5 (ubin gede) → 0,42 (20 juta) → 0,1 (20 miliar)
  const p1 = maju(t, T.n20a - 0.2, T.juta + 0.4, EASE.kamera);
  const p2 = maju(t, T.n20b - 0.2, T.miliar + 0.4, EASE.kamera);
  const sk = Math.exp(lerp(lerp(Math.log(1.5), Math.log(0.42), p1), Math.log(0.1), p2)) * (1 + 0.03 * noise('lt', t * 0.3));
  const MW = 2400 * sk;
  const MH = 1440 * sk;
  const n = Math.ceil(W / MW / 2) + 1;
  const m = Math.ceil(H / MH / 2) + 1;
  const ubin: React.ReactNode[] = [];
  const gx = (t * 14) % MW;
  for (let i = -n; i <= n; i++)
    for (let j = -m; j <= m; j++)
      ubin.push(<Img key={`${i}_${j}`} src={staticFile('k3/mozaik.svg')} style={{ position: 'absolute', left: W / 2 - MW / 2 + i * MW - gx, top: H / 2 - MH / 2 + j * MH, width: MW + 1, height: MH + 1 }} />);
  const kat = [
    { teks: 'musik', m: T.musik, x: W * 0.2, y: H * 0.62 },
    { teks: 'Shorts', m: T.shorts, x: W * 0.5, y: H * 0.75 },
    { teks: 'podcast', m: T.podcast, x: W * 0.8, y: H * 0.62 },
  ];
  const oJuta = maju(t, T.n20a - 0.2, T.n20a) * (1 - maju(t, T.n20b - 0.4, T.n20b - 0.2));
  const oMiliar = maju(t, T.n20b - 0.2, T.n20b);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, background: '#0b0b0e', overflow: 'hidden' }}>
      {ubin}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(11,11,14,0.35), rgba(11,11,14,0.8))' }} />
      <Chip x={W / 2} y={92} teks="satuan beda: jumlah VIDEO, bukan jam" ukuran={28} o={maju(t, T.lain, T.lain + 0.2) * (1 - maju(t, T.n20a - 0.4, T.n20a - 0.2))} warna={KD.tulang} />
      {oJuta > 0 ? (
        <div style={{ position: 'absolute', left: W / 2, top: H / 2 - 70, translate: '-50% 0', opacity: oJuta, padding: '10px 30px', borderRadius: 18, background: 'rgba(11,11,14,0.9)', border: `4px solid ${KD.amber}`, textAlign: 'center', whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: ANTON, fontSize: 84, lineHeight: 1, color: KD.amber }}>
            {'> '}
            <AngkaJalan dari={0} ke={20} progress={p1} />
          </span>
          <span style={{ fontFamily: ANTON, fontSize: 60, color: KD.amber }}> JUTA</span>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 28, color: KD.tulang }}>video diupload / hari</div>
        </div>
      ) : null}
      {oMiliar > 0 ? (
        <div style={{ position: 'absolute', left: W / 2, top: H / 2 - 120, translate: '-50% 0', opacity: oMiliar, padding: '10px 30px', borderRadius: 18, background: 'rgba(11,11,14,0.9)', border: `4px solid ${KD.amber}`, textAlign: 'center', whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: ANTON, fontSize: 84, lineHeight: 1, color: KD.amber }}>
            {'> '}
            <AngkaJalan dari={0} ke={20} progress={p2} />
          </span>
          <span style={{ fontFamily: ANTON, fontSize: 60, color: KD.amber }}> MILIAR</span>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 28, color: KD.tulang }}>total video di YouTube</div>
        </div>
      ) : null}
      {kat.map((k, i) =>
        t > k.m - 0.05 ? (
          <Pop key={i} mulai={k.m - 0.05} keluar={S[9].mulai - 0.2} gaya={{ position: 'absolute', left: k.x - 100, top: k.y, width: 200, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 20px', borderRadius: 30, background: KD.amber, color: KD.latar, fontFamily: INTER, fontWeight: 800, fontSize: 32 }}>
              <IkonKat i={i} />
              {k.teks}
            </div>
          </Pop>
        ) : null,
      )}
    </div>
  );
};
const IkonKat: React.FC<{ i: number }> = ({ i }) => (
  <svg width={30} height={30} viewBox="0 0 30 30">
    {i === 0 ? (
      <>
        <path d="M 11 23 V 6 L 25 3 V 20" fill="none" stroke={KD.latar} strokeWidth={3.5} strokeLinejoin="round" />
        <circle cx={8} cy={23} r={4} fill={KD.latar} />
        <circle cx={22} cy={20} r={4} fill={KD.latar} />
      </>
    ) : i === 1 ? (
      <>
        <rect x={8} y={2} width={14} height={26} rx={3} fill="none" stroke={KD.latar} strokeWidth={3.5} />
        <path d="M 13 11 L 18 15 L 13 19 Z" fill={KD.latar} />
      </>
    ) : (
      <>
        <rect x={10} y={2} width={10} height={16} rx={5} fill={KD.latar} />
        <path d="M 6 13 Q 6 23 15 23 Q 24 23 24 13 M 15 23 V 28" fill="none" stroke={KD.latar} strokeWidth={3.5} strokeLinecap="round" />
      </>
    )}
  </svg>
);

// S10–S11: HP — klip kamu diupload, masuk lautan, hilang di antara jutaan; lalu CTA -------------------------------------
const HpK3: React.FC<{ T: WaktuK; W: number; H: number; hp: number }> = ({ T, W, H, hp }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const o = maju(hp, 0.55, 0.95, EASE.linear);
  if (o <= 0) return null;
  const isi = 1 - maju(t, T.simpan - 0.25, T.simpan);
  const cta = maju(t, T.simpan - 0.2, T.simpan + 0.05);
  const up = maju(t, T.klipKamu - 0.1, T.upload10 + 0.55, EASE.kamera);
  const masuk = maju(t, T.masuk10 - 0.15, T.masuk10 + 0.35, EASE.kamera);
  const mundur = maju(t, T.masuk10 + 0.4, T.jutaan + 1.4, EASE.kamera);
  // mozaik di layar HP: ubin 100×60 di mozaik → skala 1,7 (gede) → 0,18 (kecil)
  const sk = Math.exp(lerp(Math.log(1.7), Math.log(0.18), mundur));
  const MW = 2400 * sk;
  const MH = 1440 * sk;
  // slot klip kamu di mozaik (kolom 12, baris 12)
  const slot = { x: 12 * 100 + 4, y: 12 * 60 + 4, w: 92, h: 52 };
  const ox = W / 2 - (slot.x + slot.w / 2) * sk;
  const oy = H / 2 + 40 - (slot.y + slot.h / 2) * sk;
  const ubin: React.ReactNode[] = [];
  for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) ubin.push(<Img key={`${i}_${j}`} src={staticFile('k3/mozaik.svg')} style={{ position: 'absolute', left: ox + i * MW, top: oy + j * MH, width: MW + 1, height: MH + 1 }} />);
  // kartu klip kamu: dari tengah atas (gede, lagi diupload) → mengecil masuk slot
  const kartuW = lerp(W - 80, slot.w * sk, masuk);
  const kartuH = lerp((W - 80) * 0.5625, slot.h * sk, masuk);
  const kx = lerp(40, ox + slot.x * sk, masuk);
  const ky = lerp(130, oy + slot.y * sk, masuk);
  const cincin = Math.max(26, 60 * (1 - mundur) + 26);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, background: '#08080a', overflow: 'hidden' }}>
      {isi > 0 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: isi }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.22 + 0.78 * maju(t, T.masuk10 - 0.3, T.masuk10 + 0.1), translate: `0 ${(-(t - T.keHp) * 26 * (1 - masuk)).toFixed(1)}px` }}>
            {ubin}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,10,0.35)' }} />
          </div>
          <div style={{ position: 'absolute', left: kx, top: ky, width: kartuW, height: kartuH, borderRadius: lerp(16, 3, masuk), overflow: 'hidden', border: `${lerp(5, 2.5, masuk)}px solid ${KD.amber}`, boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
            <Img src={staticFile(foto('dapur'))} style={{ width: '100%', height: '100%', objectFit: 'cover', scale: String(1 + 0.14 * maju(t, T.keHp, T.masuk10, EASE.linear)) }} />
            {masuk < 0.5 ? <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(100deg, transparent ${(up * 120 - 30).toFixed(1)}%, rgba(255,214,160,0.35) ${(up * 120 - 15).toFixed(1)}%, transparent ${(up * 120).toFixed(1)}%)`, opacity: 1 - masuk * 2 }} /> : null}
          </div>
          {masuk < 0.5 ? (
            <div style={{ position: 'absolute', left: 28, top: 130 + (W - 80) * 0.5625 + 10, width: W - 56, padding: '12px 12px 14px', borderRadius: 14, background: 'rgba(8,8,10,0.88)', opacity: 1 - masuk * 2 }}>
              <div style={{ fontFamily: ANTON, fontSize: 46, color: KD.tulang, lineHeight: 1 }}>KLIP KAMU</div>
              <div style={{ marginTop: 16, height: 14, borderRadius: 7, background: 'rgba(239,235,226,0.2)' }}>
                <div style={{ width: `${(up * 100).toFixed(1)}%`, height: 14, borderRadius: 7, background: KD.amber }} />
              </div>
              <div style={{ marginTop: 10, fontFamily: INTER, fontWeight: 800, fontSize: 26, color: up >= 1 ? KD.amber : KD.abu }}>{up >= 1 ? 'terupload hari ini' : `mengupload… ${Math.round(up * 100)}%`}</div>
            </div>
          ) : null}
          {masuk > 0.5 ? (
            <div style={{ position: 'absolute', left: W / 2, top: H / 2 + 40, width: cincin * 2, height: cincin * 2, translate: '-50% -50%', borderRadius: '50%', border: `5px solid ${KD.amber}`, boxShadow: '0 0 0 4px rgba(11,11,14,0.5)', opacity: maju(masuk, 0.5, 1) }} />
          ) : null}
          <Pop mulai={T.jutaan - 0.05} keluar={T.simpan - 0.3} gaya={{ position: 'absolute', left: W / 2 - 170, top: H - 150, width: 340, textAlign: 'center' }}>
            <div style={{ padding: '8px 0', borderRadius: 16, background: 'rgba(11,11,14,0.92)', border: `4px solid ${KD.amber}`, fontFamily: ANTON, fontSize: 44, lineHeight: 1.05, color: KD.amber }}>+ JUTAAN LAINNYA</div>
          </Pop>
        </div>
      ) : null}
      {cta > 0 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: cta * (1 - maju(t, T.pulang - 0.15, T.pulang + 0.1)) }}>
          <CtaKD x={W / 2} y={H / 2 + 40} simpan={T.simpan} follow={T.follow} logo={T.follow + 0.45} keluar={T.pulang + 0.2} skala={1.08} />
        </div>
      ) : null}
    </div>
  );
};

// sumber kecil di bawah monitor --------------------------------------------------------------------------------------
const SumberMonitor: React.FC<{ T: WaktuK; selam: number; hp: number }> = ({ T, selam, hp }) => {
  const t = useDetik();
  const S = T.s;
  const teks =
    t < S[5].mulai
      ? 'Sumber: YouTube Official Blog, 14/02/2020 · hitungan kami'
      : t < S[7].mulai
        ? 'Sumber: YouTube Official Blog 2010 & 2020'
        : 'Sumber: Google Blog, 23/04/2025 (data Mar–Apr 2025)';
  const o = maju(t, 1.2, 1.5) * (1 - Math.min(1, selam * 4)) * (1 - hp) * (1 - maju(t, T.keHp - 0.3, T.keHp));
  return <SumberKD x={MON.x + 4} y={MON.y + MON.h + 10} teks={teks} o={o} />;
};

// ======================================================================================================
const HudK3: React.FC<{ T: WaktuK }> = ({ T }) => {
  const S = T.s;
  return (
    <>
      <JudulKD
        label={['VIDEO', 'YANG', 'DIUPLOAD', 'SEHARI']}
        lMulai={0.15}
        judul={[{ t: '±82', mulai: 0.28, isi: sorot('±82', T.n82a) }, { t: 'TAHUN', mulai: 0.4 }]}
        jMulai={0.28}
        keluar={S[1].mulai - 0.2}
        catatan="kalau ditonton nonstop"
        cMulai={T.nonstop - 0.1}
      />
      <JudulKD
        label={['ANGKA', 'RESMI', 'YOUTUBE', '2020']}
        lMulai={S[1].mulai}
        judul={[{ t: '500', mulai: T.n500, isi: sorot('500', T.n500 + 0.3) }, { t: 'JAM', mulai: T.n500 + 0.12 }, { t: '/', mulai: T.n500 + 0.4, warna: KD.abu }, { t: 'MENIT', mulai: T.n500 + 0.5 }]}
        jMulai={T.n500}
        keluar={S[2].mulai - 0.2}
        catatan="hitungan kami di bawah ini dari angka resmi itu"
        cMulai={T.hitungan + 0.2}
      />
      <JudulKD
        label={['1', 'HARI', '=', '1.440', 'MENIT']}
        lMulai={S[2].mulai}
        judul={[{ t: '720.000', mulai: T.n720, isi: sorot('720.000', T.n720 + 1.3) }, { t: 'JAM', mulai: T.n720 + 0.15 }, { t: '/', mulai: T.n720 + 0.3, warna: KD.abu }, { t: 'HARI', mulai: T.n720 + 0.4 }]}
        jMulai={T.n720}
        keluar={S[3].mulai - 0.2}
        catatan="hitungan kami: 500 jam × 1.440 menit"
        cMulai={T.n720 + 0.5}
      />
      <JudulKD
        label={['DIBAGI', '24', 'JAM']}
        lMulai={S[3].mulai}
        judul={[
          { t: '30.000', mulai: T.n30rb },
          { t: 'HARI', mulai: T.n30rb + 0.15 },
          { t: '±82', mulai: T.n82b - 0.1, isi: sorot('±82', T.umurAkhir) },
          { t: 'TAHUN', mulai: T.n82b + 0.1 },
        ]}
        jMulai={T.n30rb}
        keluar={S[4].mulai - 0.2}
        catatan="hitungan kami: 720.000 ÷ 24 = 30.000 hari · ÷ 365 = 82,2 tahun"
        cMulai={T.atau}
      />
      <JudulKD
        label={['TIAP', 'DETIK']}
        lMulai={S[4].mulai}
        judul={[{ t: '±8', mulai: T.delapan - 0.1, isi: sorot('±8', T.delapan + 0.2) }, { t: 'JAM', mulai: T.delapan + 0.05 }, { t: 'VIDEO', mulai: T.delapan + 0.2 }, { t: 'BARU', mulai: T.delapan + 0.35 }]}
        jMulai={T.delapan - 0.1}
        keluar={S[5].mulai - 0.2}
        catatan="hitungan kami: 500 jam ÷ 60 detik = 8,3 jam"
        cMulai={T.delapan + 0.4}
      />
      <JudulKD
        label={['TAHUN', '2010']}
        lMulai={S[5].mulai}
        judul={[{ t: '35', mulai: T.n35, isi: sorot('35', T.n35 + 0.4) }, { t: 'JAM', mulai: T.n35 + 0.12 }, { t: '/', mulai: T.n35 + 0.25, warna: KD.abu }, { t: 'MENIT', mulai: T.n35 + 0.35 }]}
        jMulai={T.n35}
        keluar={S[6].mulai - 0.2}
        catatan="angka resmi YouTube, 10/11/2010"
        cMulai={T.th2010 + 0.3}
      />
      <JudulKD
        label={['DALAM', '10', 'TAHUN']}
        lMulai={S[6].mulai}
        judul={[{ t: 'NAIK', mulai: T.naik - 0.05 }, { t: '>14×', mulai: T.n14, isi: sorot('>14×', T.n14 + 0.2) }]}
        jMulai={T.naik - 0.05}
        keluar={S[7].mulai - 0.2}
        catatan="hitungan kami: 500 ÷ 35 = 14,3"
        cMulai={T.n14 + 0.3}
      />
      <JudulKD
        label={['DATA', '2025', '·', 'HITUNGAN', 'LAIN']}
        lMulai={S[7].mulai}
        judul={[{ t: '>20', mulai: T.n20a, isi: sorot('>20', T.juta + 0.4) }, { t: 'JUTA', mulai: T.juta }, { t: 'VIDEO', mulai: T.juta + 0.15 }, { t: '/', mulai: T.juta + 0.3, warna: KD.abu }, { t: 'HARI', mulai: T.juta + 0.4 }]}
        jMulai={T.n20a}
        keluar={S[8].mulai - 0.2}
        ukuran={108}
      />
      <JudulKD
        label={['TOTAL', 'DI', 'YOUTUBE']}
        lMulai={S[8].mulai}
        judul={[{ t: '>20', mulai: T.n20b, isi: sorot('>20', T.miliar + 0.4) }, { t: 'MILIAR', mulai: T.miliar }, { t: 'VIDEO', mulai: T.miliar + 0.15 }]}
        jMulai={T.n20b}
        keluar={S[9].mulai - 0.2}
        catatan="termasuk musik, Shorts, dan podcast"
        cMulai={T.musik}
      />
      <JudulKD
        label={['KLIP', 'YANG', 'KAMU', 'UPLOAD', 'HARI', 'INI']}
        lMulai={S[9].mulai}
        judul={[{ t: 'MASUK', mulai: T.masuk10 }, { t: 'BARENGAN', mulai: T.barengan10 }, { t: 'JUTAAN', mulai: T.jutaan, isi: sorot('JUTAAN', T.jutaan + 0.2) }, { t: 'VIDEO', mulai: T.jutaan + 0.15 }, { t: 'LAIN', mulai: T.jutaan + 0.3 }]}
        jMulai={T.masuk10}
        keluar={S[10].mulai - 0.2}
        ukuran={108}
      />
      <JudulKD
        label={['SIMPAN', 'BUAT', 'BAHAN', 'KONTEN']}
        lMulai={S[10].mulai}
        judul={[{ t: 'SIMPAN', mulai: T.simpan + 0.05 }, { t: '·', mulai: T.follow - 0.1, warna: KD.abu }, { t: 'FOLLOW', mulai: T.follow, isi: sorot('FOLLOW', T.follow + 0.15) }]}
        jMulai={T.simpan + 0.05}
        keluar={T.pulang - 0.15}
      />
    </>
  );
};

// ======================================================================================================
function daftarSfx(T: WaktuK) {
  const S = T.s;
  const aliran = Array.from({ length: 10 }, (_, i) => bunyi('tik', 0.3 + i * 0.32, 0.1 + i * 0.01));
  const tumpuk = Array.from({ length: 14 }, (_, i) => bunyi('tik', T.naik - 0.05 + ((T.n14 + 0.02 - T.naik + 0.05) * (i + 1)) / 14 - 0.02, 0.2));
  const delapan = Array.from({ length: 8 }, (_, i) => bunyi('pop', T.detik5 - 0.05 + (i + 1) / 8.3, 0.18));
  return [
    bunyi('whooshPop', 0.15, 0.3),
    ...aliran,
    bunyi('kunci', T.n82a, 0.45),
    bunyi('whooshA', S[1].mulai - 0.05, 0.3),
    bunyi('jepret', T.th2020, 0.55),
    bunyi('hantam', T.th2020 + 0.02, 0.35),
    bunyi('pop', T.n500, 0.3),
    bunyi('whooshB', S[2].mulai - 0.2, 0.3),
    bunyi('riser', T.n1440 + 0.6, 0.15),
    bunyi('pop', T.totalnya, 0.3),
    bunyi('riser', T.n720 + 1.1, 0.18),
    bunyi('kunci', T.n720 + 1.3, 0.4),
    bunyi('pop', T.n24, 0.35),
    bunyi('swish', T.n30rb - 0.4, 0.3),
    bunyi('kunci', T.n30rb + 0.85, 0.35),
    bunyi('whooshTurun', T.selamMasuk + 0.1, 0.35),
    bunyi('riser', T.umurAkhir - 0.1, 0.18),
    bunyi('hantam', T.umurAkhir + 0.05, 0.4),
    bunyi('whooshA', T.selamKeluar, 0.3),
    ...delapan,
    bunyi('swish', S[5].mulai - 0.1, 0.3),
    bunyi('pop', T.n35, 0.3),
    ...tumpuk,
    bunyi('kunci', T.n14 + 0.05, 0.4),
    bunyi('glitch', T.lain - 0.35, 0.25),
    bunyi('whooshBerat', T.n20a - 0.2, 0.3),
    bunyi('whooshBerat', T.n20b - 0.2, 0.3),
    bunyi('pop', T.musik, 0.3),
    bunyi('pop', T.shorts, 0.3),
    bunyi('pop', T.podcast, 0.3),
    bunyi('whooshTerang', T.keHp + 0.1, 0.3),
    bunyi('kunci', T.upload10 + 0.55, 0.35),
    bunyi('whooshTurun', T.masuk10, 0.3),
    bunyi('pop', T.jutaan, 0.3),
    bunyi('whooshPop', T.simpan, 0.3),
    bunyi('kunci', T.simpan + 0.32, 0.4),
    bunyi('klik', T.follow + 0.3, 0.45),
    bunyi('whooshLembut', T.pulang, 0.3),
  ];
}

// penanda lint: pathKotak dipakai seri lain
void pathKotak;
