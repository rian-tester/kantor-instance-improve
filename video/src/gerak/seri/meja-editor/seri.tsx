// SERI EXPLAINER generik (contoh, 17/10): satu gaya keluarga buat K1 (13 ms), K3 (82 tahun), K5 (kedipan Murch).
// Keluarga "MEJA EDITOR AMBER": dunia = meja editor video (monitor program, timeline + penggaris frame, playhead amber,
// slate/clapperboard buat sumber). Palet identitas generik: hitam #0b0b0e, amber #ffb454 (kata kunci, playhead, angka),
// emas #c79f55 (bingkai & garis struktur), tulang #efebe2 (teks). Koral cuma buat yang dicoret/gagal. NOL ungu/navy.
// Font Anton (judul KAPITAL) + Inter Tight (label/subtitle) + JetBrains Mono (timecode/penggaris, diegetik).
// Beda dari seri generik (navy + teal + kuning, Saira) biar tiap akun punya ciri.
import React from 'react';
import { AbsoluteFill, Img, staticFile, useVideoConfig } from 'remotion';
import {
  EASE, GarisDigambar, Grain, hitungKamera, KataMuncul, maju, noise, pegas, SapuSorot, useDetik,
  type Getar, type Kamera, type KataLayar, type KunciKamera, type Sfx,
} from "../..";
import { ANTON, INTER, MONO } from "./font";

export const LW = 1080;
export const LH = 1920;
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export const KD = {
  latar: '#0b0b0e',
  latar2: '#19150f',
  panel: '#131216',
  panel2: '#1b1a1f',
  lajur: '#111014',
  garis: '#2c2a31',
  tulang: '#efebe2',
  abu: '#a29d92',
  redup: '#5f5b53',
  amber: '#ffb454',
  amberTua: '#c9761c',
  emas: '#c79f55',
  koral: '#ff6b57',
};

// SFX pustaka aktif (sama dengan op85-ai raja/gaya.ts) ------------------------------------------------------------
const s = (id: string, puncak: number) => ({ src: '', puncak });
export const SFX = {
  pop: s('39e3b2a6-704e-4920-a474-b4ae0f3789d8', 0.113),
  tik: s('be7dbf02-e278-4f53-b8b6-2f9c287db6a4', 0.071),
  swish: s('7935eba8-1fc6-42da-a1a4-0bd269bf1431', 0.172),
  whooshA: s('7070b42c-d83c-4a6e-865a-3efca4f08244', 0.148),
  whooshB: s('7a5c0a2a-bbaf-4cef-84b4-83fe9dc67446', 0.155),
  whooshBerat: s('f06764a2-809d-4892-b8c0-a2173507908d', 0.371),
  whooshPop: s('a4b942b2-2b97-4ba7-a366-c51a7dca2742', 0.079),
  whooshTurun: s('c2066005-87ff-43cd-b2d6-34cdbfa557e3', 0.3),
  whooshPunch: s('9c5e4ada-17b7-4d89-86f6-cd5eb381fa83', 0.137),
  whooshTerang: s('a5135085-d6b9-42a1-a183-068d3c206011', 0.337),
  whooshLembut: s('3e3bd313-e697-41bc-b33e-61bbd361db00', 0.343),
  glitch: s('52b0963c-b7ce-41d6-b71e-663b152e57dd', 0.071),
  hantam: s('47b771aa-ec1f-4e5d-bfb4-f53115d5ba34', 0.305),
  sapuHit: s('57b926bf-1dab-4b05-9190-870a75b8dc76', 0.338),
  kunci: s('b0fbad78-1aef-41d0-813e-7a7f87c98aab', 0.274),
  klik: s('b0e0ad18-57bd-4c4a-9b55-3b5b98b0328c', 0.14),
  jepret: s('9daa462f-b81f-4809-83a0-0689e8198387', 0.116),
  riser: s('3e1a64bc-1741-4a7f-846b-2b97f8127264', 2.039),
};
export type NamaSfx = keyof typeof SFX;
export const bunyi = (k: NamaSfx, momen: number, vol: number): Sfx => ({ ...SFX[k], momen, vol });

// Kamera: keyframe + goyang tangan halus yang nol di 0,6 dtk awal & 1 dtk akhir (loop mulus) ---------------------------
export function kameraKD(kunci: KunciKamera[], t: number, fps: number, total: number, getar: Getar[] = [], kuat = 14): Kamera {
  const f = (tt: number) => {
    const k = hitungKamera(kunci, tt, fps, { lebar: LW, tinggi: LH, drift: 0, getar });
    const amp = Math.min(maju(tt, 0, 0.6), 1 - maju(tt, total - 1.1, total - 0.3));
    return { ...k, x: k.x + (noise('kdx', tt * 0.5) * kuat * amp) / k.z, y: k.y + (noise('kdy', tt * 0.45) * kuat * 0.8 * amp) / k.z };
  };
  const k = f(t);
  const k0 = f(t - 1 / fps);
  return { ...k, vx: (k.x - k0.x) * k.z * fps, vy: (k.y - k0.y) * k.z * fps };
}

// Latar: gradasi hangat yang napas + lajur track samar (paralaks) + lubang sprocket film di dua tepi + debu ------------
export const LatarKD: React.FC<{ kam: Kamera }> = ({ kam }) => {
  const t = useDetik();
  const gx = 50 + noise('lkx', t * 0.07) * 7;
  const gy = 44 + noise('lky', t * 0.06) * 5;
  const px = -kam.x * 0.12;
  const py = -kam.y * 0.12;
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 95% 62% at ${gx}% ${gy}%, ${KD.latar2} 0%, ${KD.latar} 72%)` }} />
      <AbsoluteFill
        style={{
          backgroundImage: 'linear-gradient(90deg, rgba(199,159,85,0.045) 2px, transparent 2px)',
          backgroundSize: '135px 100%',
          backgroundPosition: `${((px - t * 5) % 135).toFixed(1)}px 0`,
        }}
      />
      <Sprocket x={10} geser={t * 22 + py * 0.5} />
      <Sprocket x={LW - 10 - 24} geser={t * 22 + py * 0.5} />
      <Debu kam={kam} />
    </>
  );
};

const Sprocket: React.FC<{ x: number; geser: number }> = ({ x, geser }) => {
  const jarak = 64;
  const off = ((geser % jarak) + jarak) % jarak;
  return (
    <div style={{ position: 'absolute', left: x, top: 0, width: 24, height: LH, overflow: 'hidden' }}>
      {Array.from({ length: Math.ceil(LH / jarak) + 2 }, (_, i) => (
        <div
          key={i}
          style={{ position: 'absolute', left: 0, top: -jarak + i * jarak + off, width: 24, height: 34, borderRadius: 6, background: 'rgba(239,235,226,0.055)' }}
        />
      ))}
    </div>
  );
};

const Debu: React.FC<{ kam: Kamera }> = ({ kam }) => {
  const t = useDetik();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: 18 }, (_, i) => {
        const bx = ((i * 0.6180339 * LW + noise(`db${i}x`, t * 0.12) * 60 - kam.x * 0.05 * (1 + (i % 3))) % LW + LW) % LW;
        const by = (((i * 0.4142 * LH) - t * (8 + (i % 5) * 4) - kam.y * 0.05 * (1 + (i % 3))) % LH + LH) % LH;
        const r = 1.5 + (i % 4) * 0.8;
        const a = 0.1 + 0.18 * (0.5 + 0.5 * noise(`db${i}a`, t * 0.5));
        return <div key={i} style={{ position: 'absolute', left: bx, top: by, width: r * 2, height: r * 2, borderRadius: '50%', background: `rgba(255,214,160,${a.toFixed(3)})` }} />;
      })}
    </AbsoluteFill>
  );
};

/** Bayangan gelap di belakang teks atas (kebaca walau dunia di belakangnya rame). */
export const PeneduhAtas: React.FC<{ kuat?: number }> = ({ kuat = 1 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `linear-gradient(180deg, rgba(11,11,14,${(0.92 * kuat).toFixed(3)}) 0px, rgba(11,11,14,${(0.82 * kuat).toFixed(3)}) 470px, rgba(11,11,14,0) 640px)`,
    }}
  />
);

// Teks atas: label caps kecil (dengan kotak amber) → judul Anton besar → catatan kecil ---------------------------------
export const LABEL_KD: React.CSSProperties = { fontFamily: INTER, fontWeight: 700, fontSize: 32, letterSpacing: '0.14em', color: KD.abu, textTransform: 'uppercase' };
export const JUDUL_KD: React.CSSProperties = { fontFamily: ANTON, fontWeight: 400, fontSize: 118, lineHeight: 1.02, color: KD.tulang, textTransform: 'uppercase', columnGap: '0.2em', rowGap: '0.02em' };

export const JudulKD: React.FC<{
  label: (KataLayar | string)[];
  lMulai: number;
  judul?: (KataLayar | string)[];
  jMulai?: number;
  keluar: number;
  catatan?: string;
  cMulai?: number;
  ukuran?: number;
}> = ({ label, lMulai, judul, jMulai = 0, keluar, catatan, cMulai = 0, ukuran = 118 }) => {
  const t = useDetik();
  if (t < lMulai - 0.2 || t > keluar + 0.5) return null;
  const oKotak = maju(t, lMulai - 0.05, lMulai + 0.12) * (1 - maju(t, keluar, keluar + 0.2));
  const oc = catatan ? maju(t, cMulai, cMulai + 0.25) * (1 - maju(t, keluar, keluar + 0.2)) : 0;
  return (
    <>
      <div style={{ position: 'absolute', left: 84, top: 196, display: 'flex', alignItems: 'center', gap: 16, width: 912 }}>
        <div style={{ width: 16, height: 16, background: KD.amber, rotate: '45deg', opacity: oKotak, flexShrink: 0 }} />
        <KataMuncul mulai={lMulai} keluar={keluar} jeda={0.05} gaya={LABEL_KD} kata={label} />
      </div>
      {judul ? (
        <div style={{ position: 'absolute', left: 84, top: 246, width: 912 }}>
          <KataMuncul mulai={jMulai} keluar={keluar + 0.02} jeda={0.05} lama={0.2} gaya={{ ...JUDUL_KD, fontSize: ukuran }} kata={judul} />
        </div>
      ) : null}
      {oc > 0 ? (
        <div style={{ position: 'absolute', left: 86, top: 0, translate: `0 ${catatanY(judul, ukuran)}px`, fontFamily: INTER, fontWeight: 600, fontSize: 30, color: KD.abu, opacity: oc, width: 900 }}>
          {catatan}
        </div>
      ) : null}
    </>
  );
};
// posisi catatan: di bawah judul (perkiraan jumlah baris dari panjang huruf; Anton ±0,42 em per huruf)
function catatanY(judul: (KataLayar | string)[] | undefined, ukuran: number) {
  if (!judul) return 258;
  const huruf = judul.reduce((n, k) => n + (typeof k === 'string' ? k : k.t).length + 1, 0);
  const baris = Math.max(1, Math.ceil((huruf * ukuran * 0.4) / 912));
  return 246 + baris * ukuran * 1.02 + 18;
}

export const sorot = (teks: string, mulai: number, warna = KD.amber) => (
  <SapuSorot mulai={mulai} lama={0.24} warna={warna} warnaTeks={[KD.tulang, KD.latar]} penuh>
    {teks}
  </SapuSorot>
);

/** Sumber kecil (gaya kredit): garis emas kiri + teks abu di pita gelap. */
export const SumberKD: React.FC<{ x: number; y: number; teks: string; o: number; rata?: 'kiri' | 'kanan' }> = ({ x, y, teks, o, rata = 'kiri' }) =>
  o <= 0 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        translate: rata === 'kanan' ? '-100% 0' : undefined,
        opacity: o,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '5px 14px 6px 10px',
        borderRadius: 8,
        background: 'rgba(11,11,14,0.82)',
        fontFamily: INTER,
        fontWeight: 600,
        fontSize: 24,
        color: '#c9c3b6',
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ width: 4, height: 22, borderRadius: 2, background: KD.emas }} />
      {teks}
    </div>
  );

// Rangka layar: monitor program (16:9) yang bisa berubah jadi HP (objek sama ganti peran) -------------------------------
export type Kotak = { x: number; y: number; w: number; h: number; r: number };
export const lerpKotak = (a: Kotak, b: Kotak, p: number): Kotak => ({ x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), w: lerp(a.w, b.w, p), h: lerp(a.h, b.h, p), r: lerp(a.r, b.r, p) });

export const RangkaLayar: React.FC<{
  k: Kotak;
  /** 0 = monitor, 1 = HP (poni + bingkai tebal) */
  hp?: number;
  tag?: string;
  timecode?: string;
  /** 0..1 redup + blur (kedalaman pas kamera fokus ke tempat lain) */
  redup?: number;
  children?: React.ReactNode;
}> = ({ k, hp = 0, tag, timecode, redup = 0, children }) => {
  const bingkai = lerp(3, 14, hp);
  return (
    <div
      style={{
        position: 'absolute',
        left: k.x,
        top: k.y,
        width: k.w,
        height: k.h,
        borderRadius: k.r,
        background: '#060607',
        border: `${bingkai}px solid ${hp > 0.5 ? '#26242a' : 'rgba(199,159,85,0.9)'}`,
        boxShadow: `0 34px 90px rgba(0,0,0,0.65), 0 0 70px rgba(255,180,84,${(0.09 * (1 - redup)).toFixed(3)})`,
        overflow: 'hidden',
        filter: redup > 0.01 ? `blur(${(redup * 7).toFixed(2)}px) brightness(${(1 - 0.62 * redup).toFixed(3)})` : undefined,
      }}
    >
      {children}
      {tag && hp < 0.5 ? (
        <div style={{ position: 'absolute', left: 16, top: 12, display: 'flex', alignItems: 'center', gap: 8, fontFamily: INTER, fontWeight: 700, fontSize: 20, letterSpacing: '0.14em', color: 'rgba(239,235,226,0.75)', opacity: 1 - hp * 2, padding: '3px 10px', borderRadius: 6, background: 'rgba(6,6,7,0.6)' }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: KD.amber }} />
          {tag}
        </div>
      ) : null}
      {timecode && hp < 0.5 ? (
        <div style={{ position: 'absolute', right: 16, top: 12, fontFamily: MONO, fontWeight: 700, fontSize: 20, color: 'rgba(239,235,226,0.75)', opacity: 1 - hp * 2, padding: '3px 10px', borderRadius: 6, background: 'rgba(6,6,7,0.6)', fontVariantNumeric: 'tabular-nums' }}>
          {timecode}
        </div>
      ) : null}
      {hp > 0.02 ? (
        <div style={{ position: 'absolute', left: '50%', top: 14, translate: '-50% 0', width: 96 * hp, height: 26, borderRadius: 13, background: '#000', opacity: hp }} />
      ) : null}
    </div>
  );
};

/** Timecode jj:mm:dd:ff (30 fps) dari detik. */
export const timecode = (detik: number) => {
  const f = Math.max(0, Math.floor(detik * 30));
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(Math.floor(f / 108000))}:${p(Math.floor(f / 1800) % 60)}:${p(Math.floor(f / 30) % 60)}:${p(f % 30)}`;
};

// Timeline: lajur klip + penggaris frame + playhead -----------------------------------------------------------------
export type KlipKD = { mulai: number; akhir: number; src?: string; jenis?: 'foto' | 'mask' | 'kosong'; id?: string; data?: string };

/** klip yang lagi di bawah playhead */
export const klipDi = (klip: KlipKD[], P: number) => klip.find((k) => P >= k.mulai && P < k.akhir);

export const TrackKD: React.FC<{
  klip: KlipKD[];
  /** posisi playhead (ms timeline) */
  P: number;
  /** px dunia per ms */
  pxms: number;
  /** x dunia playhead */
  x0: number;
  y: number;
  h: number;
  /** batas lajur (x dunia) */
  kiri?: number;
  kanan?: number;
  frameMs?: number;
  /** ms salah satu batas frame (biar grid frame jatuh pas di awal klip tertentu) */
  asalGrid?: number;
  /** opacity angka ms di penggaris (0 = cuma garis) */
  labelGrid?: number;
  /** ms yang dilabeli 0 */
  asalLabel?: number;
  /** pengali opacity per klip (mis. klip tetangga diredupin pas zoom) */
  redup?: (k: KlipKD, i: number) => number;
  /** garis tepi klip yang disorot (id → warna) */
  sorotKlip?: Record<string, string>;
  /** isi klip kustom (mis. gambar adegan), dipakai kalau klip gak punya src */
  isiKlip?: (k: KlipKD, w: number, h: number) => React.ReactNode;
  o?: number;
}> = ({ klip, P, pxms, x0, y, h, kiri = 40, kanan = 1040, frameMs = 1000 / 30, asalGrid = 0, labelGrid = 0, asalLabel = 0, redup, sorotKlip = {}, isiKlip, o = 1 }) => {
  if (o <= 0) return null;
  const xDari = (m: number) => x0 + (m - P) * pxms;
  const mKiri = P - (x0 - kiri) / pxms;
  const mKanan = P + (kanan - x0) / pxms;
  const n0 = Math.floor((mKiri - asalGrid) / frameMs);
  const n1 = Math.ceil((mKanan - asalGrid) / frameMs);
  const garisFrame: number[] = [];
  for (let n = n0; n <= n1 && garisFrame.length < 400; n++) garisFrame.push(asalGrid + n * frameMs);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      {/* lajur */}
      <div style={{ position: 'absolute', left: kiri, top: y - 8, width: kanan - kiri, height: h + 16, borderRadius: 10, background: KD.lajur, border: `2px solid ${KD.garis}` }} />
      {/* penggaris */}
      <div style={{ position: 'absolute', left: kiri, top: y - 34, width: kanan - kiri, height: 2, background: 'rgba(239,235,226,0.18)' }} />
      {garisFrame.map((m, i) => {
        const x = xDari(m);
        if (x < kiri - 2 || x > kanan + 2) return null;
        const lab = Math.round(m - asalLabel);
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: x - 1, top: y - 46, width: 2, height: 14, background: 'rgba(239,235,226,0.45)' }} />
            {labelGrid > 0 ? (
              <div style={{ position: 'absolute', left: x, top: y - 74, translate: '-50% 0', fontFamily: MONO, fontWeight: 700, fontSize: 15, color: lab === 0 ? KD.tulang : KD.abu, opacity: labelGrid, whiteSpace: 'nowrap' }}>
                {lab}
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
      {/* klip */}
      <div style={{ position: 'absolute', left: kiri, top: y, width: kanan - kiri, height: h, overflow: 'hidden' }}>
        {klip.map((k, i) => {
          const xa = xDari(k.mulai) - kiri;
          const xb = xDari(k.akhir) - kiri;
          if (xb < -4 || xa > kanan - kiri + 4) return null;
          const op = redup ? redup(k, i) : 1;
          const w = Math.max(1.5, xb - xa - 3);
          const sorotW = k.id ? sorotKlip[k.id] : undefined;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: xa + 1.5,
                top: 0,
                width: w,
                height: h,
                borderRadius: Math.min(6, w / 3),
                overflow: 'hidden',
                opacity: op,
                background: k.jenis === 'mask' ? 'repeating-linear-gradient(45deg, #3b3a40 0 5px, #1e1d22 5px 10px)' : '#1c1b20',
                boxShadow: sorotW ? `inset 0 0 0 3px ${sorotW}` : 'inset 0 0 0 1.5px rgba(199,159,85,0.55)',
              }}
            >
              {k.src && k.jenis !== 'mask' ? <Img src={staticFile(k.src)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : !k.src && isiKlip ? isiKlip(k, w, h) : null}
              {sorotW ? <div style={{ position: 'absolute', inset: 0, boxShadow: `inset 0 0 0 3px ${sorotW}`, borderRadius: Math.min(6, w / 3) }} /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Playhead amber: kepala segilima + garis. */
export const PlayheadKD: React.FC<{ x: number; y: number; h: number; o?: number }> = ({ x, y, h, o = 1 }) =>
  o <= 0 ? null : (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      <div style={{ position: 'absolute', left: x - 1.5, top: y - 50, width: 3, height: h + 62, background: KD.amber, boxShadow: '0 0 12px rgba(255,180,84,0.6)' }} />
      <svg style={{ position: 'absolute', left: x - 13, top: y - 72, overflow: 'visible' }} width={26} height={26}>
        <path d="M 1 1 H 25 V 13 L 13 25 L 1 13 Z" fill={KD.amber} />
      </svg>
    </div>
  );

// Slate / clapperboard: kartu sumber. Masuk dari bawah, papan atas kebuka, DITEPUK pas kata kunci (SFX + getar). --------
export const SlateKD: React.FC<{
  x: number;
  y: number;
  w: number;
  baris: { label: string; isi: string; mulai: number; warna?: string }[];
  masuk: number;
  tepuk: number;
  keluar: number;
}> = ({ x, y, w, baris, masuk, tepuk, keluar }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < masuk - 0.05 || t > keluar + 0.5) return null;
  const hBadan = w * 0.56;
  const hTongkat = w * 0.11;
  const m = pegas(t, masuk, fps, { damping: 16, stiffness: 140, mass: 0.8 });
  const k = maju(t, keluar, keluar + 0.4, EASE.keluar);
  // papan atas: kebuka pas masuk, ditutup cepat pas tepuk (0,07 dtk) + mantul kecil
  const buka = maju(t, masuk + 0.15, masuk + 0.5, EASE.masuk);
  const tutup = maju(t, tepuk - 0.07, tepuk, EASE.jatuh);
  const d = Math.max(0, t - tepuk);
  const mantul = t > tepuk ? 3 * Math.sin(d * 34) * Math.exp(-d * 14) : 0;
  const sudut = -24 * buka * (1 - tutup) - Math.abs(mantul);
  const garis = 'repeating-linear-gradient(-55deg, #ffb454 0 30px, #0b0b0e 30px 60px)';
  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y - (hBadan + hTongkat * 2) / 2,
        width: w,
        opacity: Math.min(1, m * 2) * (1 - k),
        // abis mendarat: ngambang pelan (gak ada frame beku selama nunggu ditepuk)
        translate: `${(Math.sin((t - masuk) * 1.9) * 6).toFixed(2)}px ${((1 - m) * 260 + k * 220 + Math.sin((t - masuk) * 2.4) * 7).toFixed(1)}px`,
        rotate: `${((1 - m) * -6 + k * 5 - 1.5 + Math.sin((t - masuk) * 1.7) * 0.9).toFixed(2)}deg`,
      }}
    >
      {/* papan atas (engsel kiri) */}
      <div style={{ position: 'relative', height: hTongkat, transformOrigin: '6px 100%', rotate: `${sudut}deg`, borderRadius: 6, background: garis, border: '3px solid #0b0b0e', boxShadow: '0 6px 16px rgba(0,0,0,0.5)' }} />
      {/* tongkat bawah */}
      <div style={{ height: hTongkat, borderRadius: 4, background: garis, border: '3px solid #0b0b0e', marginTop: 2, backgroundPosition: '22px 0' }} />
      {/* badan */}
      <div style={{ height: hBadan, borderRadius: '0 0 14px 14px', background: '#141317', border: '3px solid rgba(239,235,226,0.24)', borderTop: 'none', padding: '6px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', boxShadow: '0 30px 70px rgba(0,0,0,0.6)' }}>
        {baris.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 22, borderBottom: i < baris.length - 1 ? '2px solid rgba(239,235,226,0.14)' : 'none', paddingBottom: 6 }}>
            <div style={{ width: w * 0.28, flexShrink: 0, fontFamily: INTER, fontWeight: 700, fontSize: 20, letterSpacing: '0.12em', color: KD.abu, whiteSpace: 'nowrap' }}>{b.label}</div>
            <KataMuncul mulai={b.mulai} jeda={0.04} gaya={{ fontFamily: INTER, fontWeight: 800, fontSize: w * 0.068, color: b.warna ?? KD.tulang, lineHeight: 1.05 }} kata={b.isi.split(' ')} />
          </div>
        ))}
      </div>
    </div>
  );
};

/** Centang / silang yang DIGAMBAR (bukan glyph font). */
export const Centang: React.FC<{ x: number; y: number; s: number; mulai: number; warna?: string; tebal?: number; hapus?: number }> = ({ x, y, s, mulai, warna = KD.amber, tebal = 10, hapus }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
    <GarisDigambar d={`M ${x - s * 0.5} ${y} L ${x - s * 0.12} ${y + s * 0.38} L ${x + s * 0.55} ${y - s * 0.42}`} mulai={mulai} lama={0.22} warna={warna} tebal={tebal} hapus={hapus} />
  </svg>
);
export const Silang: React.FC<{ x: number; y: number; s: number; mulai: number; warna?: string; tebal?: number; hapus?: number }> = ({ x, y, s, mulai, warna = KD.koral, tebal = 10, hapus }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
    <GarisDigambar d={`M ${x - s / 2} ${y - s / 2} L ${x + s / 2} ${y + s / 2}`} mulai={mulai} lama={0.14} warna={warna} tebal={tebal} hapus={hapus} />
    <GarisDigambar d={`M ${x + s / 2} ${y - s / 2} L ${x - s / 2} ${y + s / 2}`} mulai={mulai + 0.1} lama={0.14} warna={warna} tebal={tebal} hapus={hapus} />
  </svg>
);

/** Chip kecil bergaris (label nempel ke objek). */
export const Chip: React.FC<{ x: number; y: number; teks: React.ReactNode; warna?: string; o?: number; skala?: number; ukuran?: number; isi?: boolean }> = ({ x, y, teks, warna = KD.amber, o = 1, skala = 1, ukuran = 30, isi }) =>
  o <= 0 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        translate: '-50% -50%',
        scale: String(skala),
        opacity: o,
        padding: `${ukuran * 0.2}px ${ukuran * 0.55}px`,
        borderRadius: ukuran * 0.4,
        background: isi ? warna : 'rgba(11,11,14,0.92)',
        border: `3px solid ${warna}`,
        fontFamily: INTER,
        fontWeight: 800,
        fontSize: ukuran,
        color: isi ? KD.latar : warna,
        whiteSpace: 'nowrap',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {teks}
    </div>
  );

// CTA penutup: ikon SIMPAN (bookmark digambar → diisi amber) + tombol FOLLOW (ditekan) + logo generik kecil ------------
export const CtaKD: React.FC<{ x: number; y: number; simpan: number; follow: number; logo: number; keluar: number; skala?: number }> = ({ x, y, simpan, follow, logo, keluar, skala = 1 }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < simpan - 0.2 || t > keluar + 0.5) return null;
  const k = maju(t, keluar, keluar + 0.3, EASE.keluar);
  const isi = pegas(t, simpan + 0.32, fps, { damping: 9, stiffness: 200, mass: 0.6 });
  const bS = 1 + 0.18 * Math.sin(Math.PI * Math.min(1, Math.max(0, (t - simpan - 0.32) / 0.3)));
  const tekan = maju(t, follow + 0.25, follow + 0.33, EASE.jatuh) * (1 - maju(t, follow + 0.33, follow + 0.55, EASE.masuk));
  const nyala = maju(t, follow + 0.3, follow + 0.42);
  const riak = maju(t, follow + 0.3, follow + 0.8, EASE.masuk);
  const pf = pegas(t, follow - 0.15, fps, { damping: 12, stiffness: 180, mass: 0.6 });
  const oLogo = maju(t, logo, logo + 0.25) * (1 - k);
  const bw = 150;
  const bh = 190;
  const bx = -bw / 2;
  const by = -260;
  const pathBm = `M ${bx + 16} ${by} H ${bx + bw - 16} Q ${bx + bw} ${by} ${bx + bw} ${by + 16} V ${by + bh} L ${bx + bw / 2} ${by + bh - 52} L ${bx} ${by + bh} V ${by + 16} Q ${bx} ${by} ${bx + 16} ${by} Z`;
  // idle selama nunggu (gak ada frame beku): bookmark ngambang + glow amber napas di belakangnya
  const tIdle = Math.max(0, t - simpan);
  const bob = Math.sin(tIdle * 3.1) * 9 * maju(t, simpan + 0.5, simpan + 0.9);
  const goyang = Math.sin(tIdle * 2.3 + 0.7) * 3 * maju(t, simpan + 0.5, simpan + 0.9);
  const napas = 0.5 + 0.5 * Math.sin(tIdle * 3.6);
  const oGlow = maju(t, simpan + 0.3, simpan + 0.6);
  return (
    <div style={{ position: 'absolute', left: x, top: y, scale: String(skala), opacity: 1 - k }}>
      {oGlow > 0 ? (
        <div style={{ position: 'absolute', left: -230, top: by + bh / 2 - 230 + bob * 0.6, width: 460, height: 460, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,180,84,${(0.16 + 0.22 * napas).toFixed(3)}) 0%, rgba(255,180,84,0) 68%)`, scale: String(0.85 + 0.3 * napas), opacity: oGlow }} />
      ) : null}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <g transform={`translate(0 ${(by + bh / 2 + bob).toFixed(2)}) rotate(${goyang.toFixed(2)}) scale(${bS.toFixed(3)}) translate(0 ${-(by + bh / 2)})`}>
          <path d={pathBm} fill={KD.amber} opacity={Math.min(1, Math.max(0, isi))} transform={`translate(0 ${by + bh / 2}) scale(${Math.max(0, Math.min(1.05, isi)).toFixed(3)}) translate(0 ${-(by + bh / 2)})`} />
          <GarisDigambar d={pathBm} mulai={simpan} lama={0.32} warna={KD.tulang} tebal={9} />
        </g>
      </svg>
      <div style={{ position: 'absolute', left: 0, top: -40, translate: '-50% 0', fontFamily: ANTON, fontSize: 72, color: KD.tulang, letterSpacing: '0.02em', opacity: maju(t, simpan + 0.15, simpan + 0.35) }}>SIMPAN</div>
      {t > follow - 0.15 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 90,
            translate: '-50% 0',
            scale: String(Math.max(0, pf) * (1 - 0.07 * tekan)),
            padding: '16px 40px',
            borderRadius: 999,
            border: `4px solid ${KD.amber}`,
            background: nyala > 0.5 ? KD.amber : 'rgba(11,11,14,0.9)',
            color: nyala > 0.5 ? KD.latar : KD.amber,
            fontFamily: INTER,
            fontWeight: 800,
            fontSize: 46,
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <span style={{ fontSize: 54, lineHeight: 0.8 }}>{nyala > 0.5 ? '' : '+'}</span>
          {nyala > 0.5 ? 'DIIKUTI' : 'FOLLOW'}
          {riak > 0 && riak < 1 ? (
            <div style={{ position: 'absolute', left: '50%', top: '50%', width: 60, height: 60, translate: '-50% -50%', borderRadius: '50%', border: `4px solid ${KD.tulang}`, scale: String(1 + riak * 5), opacity: 1 - riak }} />
          ) : null}
        </div>
      ) : null}
      {oLogo > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 230, translate: '-50% 0', display: 'flex', alignItems: 'center', gap: 14, opacity: oLogo }}>
          <></>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 36, color: KD.tulang, letterSpacing: '0.01em' }}></div>
        </div>
      ) : null}
    </div>
  );
};

/** Lapisan atas seri: grain hangat + vinyet. */
export const TeksturKD: React.FC = () => <Grain kuat={0.08} garisScan={0} vinyet={0.55} warnaVinyet="0,0,0" />;

/** Path kotak sudut bulat (buat kotak yang DIGAMBAR). */
export const pathKotak = (x: number, y: number, w: number, h: number, r: number) =>
  `M ${x + r} ${y} H ${x + w - r} Q ${x + w} ${y} ${x + w} ${y + r} V ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} H ${x + r} Q ${x} ${y + h} ${x} ${y + h - r} V ${y + r} Q ${x} ${y} ${x + r} ${y} Z`;

/** Blur gerak horizontal (mis. timeline di-scrub cepat). kuat = px. */
export const BlurGeser: React.FC<{ id: string; kuat: number; children: React.ReactNode }> = ({ id, kuat, children }) =>
  kuat < 0.5 ? (
    <>{children}</>
  ) : (
    <>
      <svg width={0} height={0} style={{ position: 'absolute' }}>
        <defs>
          <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation={`${kuat.toFixed(2)} 0`} />
          </filter>
        </defs>
      </svg>
      <div style={{ position: 'absolute', left: 0, top: 0, width: LW, height: LH * 2, filter: `url(#${id})` }}>{children}</div>
    </>
  );

/** Panah kanan inline (pengganti glyph → yang gak ada di subset font). Ukuran ngikut font-size. */
export const PanahInline: React.FC<{ warna?: string }> = ({ warna = KD.amber }) => (
  <svg viewBox="0 0 100 60" style={{ width: '0.82em', height: '0.5em', verticalAlign: '0.12em', overflow: 'visible' }}>
    <path d="M 4 30 H 86 M 60 6 L 90 30 L 60 54" fill="none" stroke={warna} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** "≈" yang digambar (glyph ≈ gak ada di subset font). Ukuran ngikut font-size. */
export const KiraInline: React.FC<{ warna?: string }> = ({ warna = KD.amber }) => (
  <svg viewBox="0 0 100 70" style={{ width: '0.62em', height: '0.44em', verticalAlign: '0.16em', overflow: 'visible' }}>
    <path d="M 6 24 Q 28 6 50 24 T 94 24 M 6 52 Q 28 34 50 52 T 94 52" fill="none" stroke={warna} strokeWidth={12} strokeLinecap="round" />
  </svg>
);
