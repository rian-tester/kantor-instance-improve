// Bahan bersama seri explainer evergreen generik 17/10 (A2 listrik ChatGPT, A3 air AI, A7 Langkah 37).
// Satu keluarga gaya = KINETIC DATA GELAP (nerusin Raja-Ratu / 475 ribu tahun / diffusion): latar navy + grid koordinat,
// TEAL = pembanding/arah, KUNING = angka penting/hasil, MERAH = dicoret/salah/angka lama. Font Saira Condensed + JetBrains Mono
// (+ Kalam buat anotasi tangan). Isi di sini: latar, teks atas (label + judul + catatan), sumber kecil, kamera dengan goyang
// tangan yang nol di awal & akhir (loop mulus), CTA simpan + follow.
import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import {
  EASE, GarisDigambar, hitungKamera, Kabut, KataMuncul, maju, noise, Paralaks, pegas, SapuSorot, useDetik,
  type Getar, type Kamera, type KataLayar, type KunciKamera,
} from "../..";
import { MONO, SAIRA } from "../../font";
import { K } from "../../../../contoh-explainer/data-gelap/raja/gaya";

export const LW = 1080;
export const LH = 1920;
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** Kamera seri: keyframe + goyang tangan (±34 px layar) + napas zoom ±2,2% (periode ±5,5 dtk), dua-duanya meluruh ke nol
 *  di 0,8 dtk awal & 1 dtk akhir (loop mulus). QC 17/10: goyang ±20 px aja masih kebaca beku 1–1,5 dtk pas momen tahan. */
export function kameraSeri(kunci: KunciKamera[], t: number, fps: number, total: number, getar: Getar[] = []): Kamera {
  const f = (tt: number) => {
    const k = hitungKamera(kunci, tt, fps, { lebar: LW, tinggi: LH, drift: 0, getar });
    const amp = Math.min(maju(tt, 0, 0.8), 1 - maju(tt, total - 1.1, total - 0.35));
    const z = k.z * (1 + 0.022 * Math.sin((tt / 5.5) * Math.PI * 2) * amp + 0.012 * noise('sz', tt * 0.7) * amp);
    return { ...k, z, x: k.x + (noise('sx', tt * 0.6) * 34 * amp) / z, y: k.y + (noise('sy', tt * 0.55) * 26 * amp) / z };
  };
  const k = f(t);
  const k0 = f(t - 1 / fps);
  return { ...k, vx: (k.x - k0.x) * k.z * fps, vy: (k.y - k0.y) * k.z * fps };
}

/** Latar: gradasi napas + kabut cahaya + titik jauh & grid yang ikut kamera (paralaks). */
export const LatarSeri: React.FC<{ kam: Kamera; kabut?: [string, string, string] }> = ({ kam, kabut }) => {
  const t = useDetik();
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${50 + noise('lt', t * 0.08) * 6}% 46%, ${K.latar2} 0%, ${K.latar} 72%)` }} />
      <Kabut kam={kam} warna={kabut} kuat={1.35} />
      <Paralaks
        kamera={kam}
        lapis={[
          { faktor: 0.35, pola: 'radial-gradient(circle, rgba(140,170,210,0.18) 1.4px, transparent 2px)', ukuran: '90px 90px' },
          {
            faktor: 1,
            pola: 'linear-gradient(rgba(110,150,200,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(110,150,200,0.07) 2px, transparent 2px)',
            ukuran: '120px 120px',
          },
        ]}
      />
    </>
  );
};

/** Peneduh atas: isi dunia yang naik ke zona judul diredupin biar judul tetap kebaca. */
export const PeneduhAtas: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(7,12,24,0.82) 0px, rgba(7,12,24,0.6) 360px, rgba(7,12,24,0) 600px)' }} />
);

export const LABEL: React.CSSProperties = { fontFamily: MONO, fontWeight: 700, fontSize: 38, letterSpacing: '0.12em', color: K.abu };
export const JUDUL: React.CSSProperties = { fontFamily: SAIRA, fontWeight: 800, fontSize: 96, lineHeight: 1.02, color: K.tinta, columnGap: '0.22em', rowGap: '0.02em' };

/** Teks atas (zona 10–30%): label caps kecil + judul besar (kata per kata blur→tajam) + catatan mono kecil. */
export const TeksSeri: React.FC<{
  label: (KataLayar | string)[];
  lMulai: number;
  judul?: (KataLayar | string)[];
  jMulai?: number;
  keluar: number;
  catatan?: React.ReactNode;
  cMulai?: number;
  cWarna?: string;
  ukuran?: number;
}> = ({ label, lMulai, judul, jMulai = 0, keluar, catatan, cMulai = 0, cWarna = K.abu, ukuran }) => {
  const t = useDetik();
  if (t < lMulai - 0.2 || t > keluar + 0.45) return null;
  const ob = maju(t, lMulai - 0.05, lMulai + 0.1) * (1 - maju(t, keluar, keluar + 0.2));
  const oc = catatan ? maju(t, cMulai, cMulai + 0.25) * (1 - maju(t, keluar, keluar + 0.2)) : 0;
  return (
    <div style={{ position: 'absolute', left: 90, top: 192, width: 900, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 8, height: 38, borderRadius: 4, background: K.teal, opacity: ob }} />
        <KataMuncul mulai={lMulai} keluar={keluar} jeda={0.06} gaya={LABEL} kata={label} />
      </div>
      {judul ? <KataMuncul mulai={jMulai} keluar={keluar + 0.02} jeda={0.05} lama={0.2} gaya={{ ...JUDUL, fontSize: ukuran ?? JUDUL.fontSize }} kata={judul} /> : null}
      {catatan ? (
        <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 28, color: cWarna, opacity: oc, translate: `0 ${((1 - maju(t, cMulai, cMulai + 0.25)) * 8).toFixed(1)}px` }}>{catatan}</div>
      ) : null}
    </div>
  );
};

/** Kata disorot blok (sapu kiri→kanan). */
export const sorot = (teks: string, mulai: number, warna: string = K.kuning) => (
  <SapuSorot mulai={mulai} lama={0.24} warna={warna} warnaTeks={[K.tinta, K.latar]} penuh>
    {teks}
  </SapuSorot>
);

/** Sumber kecil di bawah subtitle (±77% tinggi), ganti teks = geser halus. */
export const Sumber: React.FC<{ teks: string; o: number; y?: number }> = ({ teks, o, y = 1468 }) =>
  o <= 0 ? null : (
    <div style={{ position: 'absolute', left: 0, width: LW, top: y, display: 'flex', justifyContent: 'center', opacity: o }}>
      <div style={{ padding: '3px 14px', borderRadius: 8, background: 'rgba(7,12,24,0.7)', fontFamily: MONO, fontWeight: 500, fontSize: 24, color: '#b9c6d8', whiteSpace: 'nowrap' }}>{teks}</div>
    </div>
  );

/** Chip label kecil berbingkai (dipakai di dunia & HUD). */
export const Chip: React.FC<{ x: number; y: number; teks: React.ReactNode; warna?: string; o?: number; skala?: number; isi?: boolean; ukuran?: number }> = ({
  x, y, teks, warna = K.teal, o = 1, skala = 1, isi, ukuran = 28,
}) =>
  o <= 0 ? null : (
    <div
      style={{
        position: 'absolute', left: x, top: y, translate: '-50% -50%', scale: String(skala), opacity: o, padding: '5px 16px', borderRadius: 12,
        background: isi ? warna : K.latar, border: `3px solid ${warna}`, fontFamily: MONO, fontWeight: 800, fontSize: ukuran, color: isi ? K.latar : warna, whiteSpace: 'nowrap',
      }}
    >
      {teks}
    </div>
  );

// ---------------------------------------------------------------------------------------------------
// CTA penutup: ikon SIMPAN (bookmark) digambar → diketuk kursor → keisi; tombol FOLLOW muncul → diketuk → keisi.
// Semua keluar mengecil ke tengah sebelum frame terakhir (loop balik ke latar kosong frame pertama).
const PATH_BOOKMARK = 'M -70 -100 Q -70 -112 -58 -112 L 58 -112 Q 70 -112 70 -100 L 70 112 L 0 62 L -70 112 Z';

export const CtaSimpanFollow: React.FC<{ simpan: number; follow: number; keluar: number; cx?: number; yB?: number; yF?: number }> = ({
  simpan, follow, keluar, cx = 540, yB = 840, yF = 1200,
}) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < simpan - 0.1 || t > keluar + 0.5) return null;
  const k = maju(t, keluar, keluar + 0.4, EASE.keluar);
  const tapB = simpan + 0.55;
  const tapF = follow + 0.3;
  const isiB = maju(t, tapB, tapB + 0.12);
  const popB = 1 + 0.18 * Math.sin(Math.PI * maju(t, tapB, tapB + 0.3, EASE.linear));
  const masukB = pegas(t, simpan - 0.05, fps, { damping: 12, stiffness: 190, mass: 0.6 });
  const masukF = pegas(t, follow - 0.25, fps, { damping: 12, stiffness: 190, mass: 0.6 });
  const isiF = maju(t, tapF, tapF + 0.12);
  const popF = 1 + 0.12 * Math.sin(Math.PI * maju(t, tapF, tapF + 0.3, EASE.linear));
  const napas = 1 + 0.025 * Math.sin(t * 4.2);
  const ngambang = Math.sin(t * 2.6) * 20;
  const denyutF = 0.5 + 0.5 * Math.sin(t * 5);
  const skalaF = 1 + 0.035 * Math.sin(t * 4.4);
  const kilat = ((t - follow) * 0.9) % 1; // kilatan nyapu di tombol follow
  // kursor: masuk dari kanan bawah → ketuk bookmark → turun ketuk follow → keluar
  const kx = (tt: number) => {
    if (tt < tapB) return lerp(cx + 260, cx + 30, maju(tt, simpan + 0.1, tapB - 0.02, EASE.kamera));
    if (tt < tapF) return lerp(cx + 30, cx + 120, maju(tt, follow - 0.15, tapF - 0.02, EASE.kamera));
    return lerp(cx + 120, cx + 230, maju(tt, tapF + 0.3, tapF + 0.8, EASE.kamera)) + noise('kurx', tt * 1.3) * 30;
  };
  const ky = (tt: number) => {
    if (tt < tapB) return lerp(yB + 330, yB + 40, maju(tt, simpan + 0.1, tapB - 0.02, EASE.kamera));
    if (tt < tapF) return lerp(yB + 40, yF + 20, maju(tt, follow - 0.15, tapF - 0.02, EASE.kamera));
    return lerp(yF + 20, yF + 150, maju(tt, tapF + 0.3, tapF + 0.8, EASE.kamera)) + noise('kury', tt * 1.2) * 24;
  };
  const tekan = (c: number) => (t > c - 0.06 && t < c + 0.1 ? 0.82 : 1);
  const oK = maju(t, simpan + 0.1, simpan + 0.3);
  const cincin = (c: number, x: number, y: number) => {
    const p = maju(t, c, c + 0.4);
    return p > 0 && p < 1 ? <circle cx={x} cy={y} r={20 + p * 90} fill="none" stroke={K.kuning} strokeWidth={8 * (1 - p) + 1} opacity={1 - p} /> : null;
  };
  return (
    <AbsoluteFill style={{ opacity: 1 - k, scale: String(1 - 0.25 * k), filter: k > 0 ? `blur(${(k * 10).toFixed(1)}px)` : undefined }}>
      {/* bookmark (+ cahaya lembut pas keisi) */}
      <div style={{ position: 'absolute', left: cx - 260, top: yB - 260, width: 520, height: 520, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,197,61,${(0.32 * isiB).toFixed(3)}) 0%, rgba(255,197,61,0) 62%)` }} />
      <svg width={LW} height={LH} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* cincin putus-putus berputar + kilau mengorbit (gak ada frame beku pas nunggu) */}
        <g transform={`translate(${cx} ${yB + ngambang * 0.5}) rotate(${(t * 50) % 360}) scale(${Math.min(1.1, masukB).toFixed(3)})`} opacity={0.75}>
          <circle cx={0} cy={0} r={205} fill="none" stroke={K.kuning} strokeWidth={6} strokeDasharray="26 22" opacity={0.55} />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={Math.cos((i / 4) * Math.PI * 2) * 205} cy={Math.sin((i / 4) * Math.PI * 2) * 205} r={12 + 4 * Math.sin(t * 6 + i)} fill={i % 2 ? K.teal : K.kuning} />
          ))}
        </g>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2 + 0.4;
          const f = (t * 1.1 + i / 6) % 1;
          const r = 150 + 60 * f;
          const sk = Math.sin(Math.PI * f) * Math.min(1, masukB);
          return (
            <path key={i} d="M 0 -16 L 4 -4 L 16 0 L 4 4 L 0 16 L -4 4 L -16 0 L -4 -4 Z" fill={i % 2 ? K.teal : K.kuning}
              transform={`translate(${(cx + Math.cos(a) * r).toFixed(1)} ${(yB + Math.sin(a) * r * 0.9).toFixed(1)}) scale(${(sk * 1.4).toFixed(3)}) rotate(${(t * 90) % 360})`} opacity={sk} />
          );
        })}
        <g transform={`translate(${cx} ${yB + ngambang}) scale(${(Math.min(1.2, masukB) * popB * napas).toFixed(3)})`}>
          <path d={PATH_BOOKMARK} fill={K.kuning} opacity={isiB} />
          <GarisDigambar d={PATH_BOOKMARK} mulai={simpan} lama={0.32} warna={K.kuning} tebal={12} />
        </g>
        {cincin(tapB, cx + 30, yB + 40)}
        {cincin(tapF, cx + 120, yF + 20)}
      </svg>
      <div style={{ position: 'absolute', left: 0, width: LW, top: yB + 150 + ngambang * 0.4, textAlign: 'center', fontFamily: SAIRA, fontWeight: 800, fontSize: 64, color: isiB > 0.5 ? K.kuning : K.tinta, opacity: maju(t, simpan + 0.15, simpan + 0.35) }}>
        Simpan
      </div>
      {/* tombol follow */}
      {t > follow - 0.25 ? (
        <div style={{ position: 'absolute', left: cx, top: yF + 30, translate: '-50% -50%', scale: String(Math.min(1.2, masukF) * popF * (isiF > 0.5 ? skalaF : 1)), overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 18, padding: '18px 46px', borderRadius: 70, border: `5px solid ${K.teal}`, background: isiF > 0.5 ? K.teal : 'rgba(7,12,24,0.85)', color: isiF > 0.5 ? K.latar : K.teal, fontFamily: SAIRA, fontWeight: 800, fontSize: 68, whiteSpace: 'nowrap', boxShadow: `0 0 ${30 + 50 * denyutF}px ${K.teal}${Math.round(90 + 100 * denyutF).toString(16)}` }}>
          <svg width={64} height={64} viewBox="-32 -32 64 64">
            <circle cx={-6} cy={-12} r={12} fill="none" stroke="currentColor" strokeWidth={6} />
            <path d="M -26 22 Q -26 4 -6 4 Q 14 4 14 22" fill="none" stroke="currentColor" strokeWidth={6} strokeLinecap="round" />
            {isiF > 0.5 ? (
              <path d="M 12 -14 L 19 -6 L 31 -22" fill="none" stroke="currentColor" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M 22 -24 V -4 M 12 -14 H 32" fill="none" stroke="currentColor" strokeWidth={6} strokeLinecap="round" />
            )}
          </svg>
          Follow
          {isiF > 0.5 ? <div style={{ position: 'absolute', top: -20, bottom: -20, width: 70, left: `${(-20 + kilat * 140).toFixed(1)}%`, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.75), rgba(255,255,255,0))', rotate: '18deg' }} /> : null}
        </div>
      ) : null}
      {/* kursor ketuk */}
      {oK > 0 ? (
        <svg width={48} height={68} viewBox="-4 -4 48 68" style={{ position: 'absolute', left: kx(t) - 4, top: ky(t) - 4, overflow: 'visible', transformOrigin: '4px 4px', scale: String(1.5 * tekan(tapB) * tekan(tapF)), opacity: oK }}>
          <path d="M0 0 L0 50 L12 39 L21 58 L31 53 L22 35 L38 35 Z" fill={K.tinta} stroke={K.latar} strokeWidth={4} strokeLinejoin="round" />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};
