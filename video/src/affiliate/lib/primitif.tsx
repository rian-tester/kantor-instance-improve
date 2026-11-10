import React from 'react';
import {loadFont} from '@remotion/fonts';
import {Grain} from '../../gerak/Grain';
export const ANTON = 'Anton';
export const SERIF = 'Instrument Serif';
export const SERIF_TEGAK = SERIF;
export const MONO = 'Space Mono';
loadFont({family: 'Anton', url: staticFile('font/anton-400-latin.woff2'), weight: '400', style: 'normal'});
loadFont({family: 'Instrument Serif', url: staticFile('font/instrument-serif-400-latin.woff2'), weight: '400', style: 'normal'});
loadFont({family: 'Instrument Serif', url: staticFile('font/instrument-serif-400-italic-latin.woff2'), weight: '400', style: 'italic'});
loadFont({family: 'Space Mono', url: staticFile('font/space-mono-400-latin.woff2'), weight: '400', style: 'normal'});
loadFont({family: 'Space Mono', url: staticFile('font/space-mono-700-latin.woff2'), weight: '700', style: 'normal'});

import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';


export const WARNA = {
  kertas: '#efe9dc',
  kertasGelap: '#d9d0bd',
  tinta: '#141210',
  merah: '#e03a2e',
  kuning: '#f6c90e',
  malam: '#0f0e0c',
};

export type Kata = { t: string; mulai: number; akhir: number };
export type DataKarya = {
  folder: string;
  audio: string;
  durasi: number;
  mulut: number[];
  keras: number[];
  kata: Kata[];
};

export const useDetik = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

const JEPIT = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
/** 0→1 antara detik a..b dengan easing (default: keluar cepat, mendarat halus). */
export const maju = (t: number, a: number, b: number, easing = Easing.bezier(0.16, 1, 0.3, 1)) =>
  interpolate(t, [a, b], [0, 1], { ...JEPIT, easing });
export const antara = (t: number, a: number, b: number, dari: number, ke: number, easing = Easing.bezier(0.16, 1, 0.3, 1)) =>
  interpolate(t, [a, b], [dari, ke], { ...JEPIT, easing });

/** Detik mulai kata pertama yang cocok (awalan, huruf kecil) setelah detik `setelah`. */
export function waktuKata(kata: Kata[], cari: string, setelah = 0, cadangan = 0) {
  const bersih = (s: string) => s.toLowerCase().replace(/[^a-z0-9-]/g, '');
  const k = kata.find((x) => x.mulai >= setelah - 0.05 && bersih(x.t).startsWith(cari.toLowerCase()));
  return k ? k.mulai : cadangan;
}

// ---------- latar ----------
/** Kertas koran hangat + bayangan kisi jendela yang geser pelan (cahaya sore) + vinyet. */
export const LatarKertas: React.FC<{ gelap?: boolean; warna?: string; tanpaJendela?: boolean }> = ({ gelap, warna, tanpaJendela }) => {
  const frame = useCurrentFrame();
  const geser = frame * 0.35;
  return (
    <AbsoluteFill style={{ backgroundColor: warna ?? (gelap ? WARNA.malam : WARNA.kertas) }}>

      {/* bayangan kisi jendela = gambar buram jadi (tekstur/jendela.png), cuma digeser: blur selayar tiap frame mahal */}

      <AbsoluteFill style={{ background: gelap ? 'radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(0,0,0,.6) 100%)' : 'radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(60,40,15,.28) 100%)' }} />
    </AbsoluteFill>
  );
};

export const Butiran: React.FC<{kuat?: number}> = ({kuat = 0.11}) => <Grain kuat={kuat} garisScan={0} vinyet={0} />;

// ---------- teks ----------
/** Teks muncul per kata lewat masker (naik dari bawah garis), stagger per kata. Kata di `sorot` dikasih warna. */
export const TeksMasuk: React.FC<{
  teks: string;
  mulai: number;
  jeda?: number;
  gaya?: React.CSSProperties;
  warnaSorot?: string;
  sorot?: number[];
  keluar?: number; // detik mulai hilang (naik keluar)
}> = ({ teks, mulai, jeda = 0.06, gaya, warnaSorot, sorot = [], keluar }) => {
  const t = useDetik();
  const kata = teks.split(' ');
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: '0.24em', ...gaya }}>
      {kata.map((k, i) => {
        const m = maju(t, mulai + i * jeda, mulai + i * jeda + 0.45, Easing.bezier(0.2, 0.9, 0.1, 1));
        const x = keluar === undefined ? 0 : maju(t, keluar + i * 0.03, keluar + i * 0.03 + 0.3, Easing.bezier(0.7, 0, 0.84, 0));
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '0.06em', marginBottom: '-0.06em' }}>
            <span style={{ display: 'inline-block', translate: `0 ${(1 - m) * 110 - x * 110}%`, color: sorot.includes(i) ? warnaSorot : undefined }}>{k}</span>
          </span>
        );
      })}
    </div>
  );
};

/** Teks muncul dari blur ke tajam + sedikit membesar (buat kata raksasa). */
export const TeksBlur: React.FC<{ teks: string; mulai: number; lama?: number; gaya?: React.CSSProperties }> = ({ teks, mulai, lama = 0.5, gaya }) => {
  const t = useDetik();
  const m = maju(t, mulai, mulai + lama);
  return <div style={{ ...gaya, opacity: m, filter: `blur(${(1 - m) * 22}px)`, scale: String(0.92 + 0.08 * m) }}>{teks}</div>;
};

// ---------- guntingan & tempelan ----------
function tepiSobek(seed: string, w: number, h: number, kasar = 9) {
  const titik: string[] = [];
  const g = (n: number) => (random(`${seed}-${n}`) - 0.5) * kasar;
  for (let x = 0; x <= w; x += 20) titik.push(`${x}px ${Math.max(0, 5 + g(x))}px`);
  for (let y = 0; y <= h; y += 36) titik.push(`${w - Math.max(0, 2 + g(y + 1e4) / 3)}px ${y}px`);
  for (let x = w; x >= 0; x -= 20) titik.push(`${x}px ${h - Math.max(0, 5 + g(x + 2e4))}px`);
  for (let y = h; y >= 0; y -= 36) titik.push(`${Math.max(0, 2 + g(y + 3e4) / 3)}px ${y}px`);
  return `polygon(${titik.join(',')})`;
}

/** Guntingan dari tangkapan layar artikel (piksel tangkapan 1030 lebar): potong [x,y,w,h], lebar tampil `lebar`. */
export const Guntingan: React.FC<{
  src: string;
  potong: [number, number, number, number];
  lebar: number;
  seed: string;
  cetak?: boolean; // hitam-putih kayak koran
  sorot?: { kotak: [number, number, number, number]; mulai: number }[];
  gaya?: React.CSSProperties;
}> = ({ src, potong, lebar, seed, cetak, sorot = [], gaya }) => {
  const t = useDetik();
  const [cx, cy, cw, ch] = potong;
  const s = lebar / cw;
  const w = lebar;
  const h = ch * s;
  return (
    <div style={{ position: 'absolute', width: w + 24, height: h + 24, ...gaya }}>
      <div style={{ position: 'absolute', left: 8, top: 14, right: 8, bottom: 4, boxShadow: '0 18px 30px rgba(0,0,0,.28)' }} />
      <div style={{ position: 'absolute', inset: 0, background: '#fbf8f1', clipPath: tepiSobek(seed, w + 24, h + 24) }} />
      <div style={{ position: 'absolute', left: 12, top: 12, width: w, height: h, overflow: 'hidden' }}>
        <Img
          src={staticFile(src)}
          style={{ position: 'absolute', left: -cx * s, top: -cy * s, width: 1030 * s, maxWidth: 'none', filter: cetak ? 'grayscale(1) contrast(1.15) sepia(.18)' : 'contrast(1.05) saturate(.85)' }}
        />
        {sorot.map((x, i) => {
          const m = maju(t, x.mulai, x.mulai + 0.45, Easing.bezier(0.3, 0, 0.2, 1));
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: (x.kotak[0] - cx) * s - 6,
                top: (x.kotak[1] - cy) * s + x.kotak[3] * s * 0.12,
                width: (x.kotak[2] * s + 12) * m,
                height: x.kotak[3] * s * 0.82,
                background: WARNA.kuning,
                mixBlendMode: 'multiply',
                opacity: 0.85,
                rotate: '-0.6deg',
                borderRadius: '3px 8px 4px 9px',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

/** Label kecil gaya mesin tik di atas selotip. */
export const Label: React.FC<{ teks: string; mulai: number; gaya?: React.CSSProperties; gelap?: boolean }> = ({ teks, mulai, gaya, gelap }) => {
  const t = useDetik();
  const m = maju(t, mulai, mulai + 0.35);
  return (
    <div
      style={{
        position: 'absolute',
        padding: '8px 16px',
        background: gelap ? WARNA.tinta : '#fbf8f1',
        color: gelap ? '#fbf8f1' : WARNA.tinta,
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 26,
        letterSpacing: '0.02em',
        boxShadow: '0 6px 14px rgba(0,0,0,.2)',
        opacity: m,
        translate: `0 ${(1 - m) * 14}px`,
        ...gaya,
      }}
    >
      {teks}
    </div>
  );
};

/** Cap stempel: turun dari besar, ngebanting, tinta agak belang. */
export const Stempel: React.FC<{ teks: string; mulai: number; warna?: string; ukuran?: number; gaya?: React.CSSProperties; miring?: number; tegas?: boolean }> = ({
  teks,
  mulai,
  warna = WARNA.merah,
  ukuran = 120,
  gaya,
  miring = -8,
  tegas, // true = tinta gak dicampur multiply (buat di atas latar gelap/ramai)
}) => {
  const t = useDetik();
  if (t < mulai) return null;
  const banting = antara(t, mulai, mulai + 0.18, 2.4, 1, Easing.bezier(0.55, 0, 1, 0.45));
  const goyang = t < mulai + 0.3 ? Math.sin((t - mulai) * 60) * (0.3 - (t - mulai)) * 10 : 0;
  return (
    <div
      style={{
        position: 'absolute',
        padding: `${ukuran * 0.12}px ${ukuran * 0.3}px`,
        border: `${ukuran * 0.07}px solid ${warna}`,
        borderRadius: ukuran * 0.12,
        color: warna,
        fontFamily: ANTON,
        fontSize: ukuran,
        lineHeight: 1,
        letterSpacing: '0.02em',
        rotate: `${miring + goyang}deg`,
        scale: String(banting),
        opacity: antara(t, mulai, mulai + 0.08, 0, 0.92),
        mixBlendMode: tegas ? 'normal' : 'multiply',
        maskImage: 'radial-gradient(circle at 30% 40%, #000 55%, rgba(0,0,0,.72) 75%, #000 90%)',
        ...gaya,
      }}
    >
      {teks}
    </div>
  );
};

/** Coretan tangan (SVG path) yang digambar pelan: lingkaran, garis bawah, panah. */
export const Coret: React.FC<{ d: string; mulai: number; lama?: number; warna?: string; tebal?: number; lebar: number; tinggi: number; gaya?: React.CSSProperties }> = ({
  d,
  mulai,
  lama = 0.5,
  warna = WARNA.merah,
  tebal = 9,
  lebar,
  tinggi,
  gaya,
}) => {
  const t = useDetik();
  const m = maju(t, mulai, mulai + lama, Easing.bezier(0.45, 0, 0.2, 1));
  return (
    <svg width={lebar} height={tinggi} style={{ position: 'absolute', overflow: 'visible', ...gaya }}>
      <path d={d} fill="none" stroke={warna} strokeWidth={tebal} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - m} />
    </svg>
  );
};

/** Getar layar singkat (buat hentakan). */
export const getar = (t: number, mulai: number, kuat = 14, lama = 0.25) => {
  if (t < mulai || t > mulai + lama) return '0px 0px';
  const sisa = 1 - (t - mulai) / lama;
  return `${Math.sin(t * 90) * kuat * sisa}px ${Math.cos(t * 77) * kuat * sisa}px`;
};
