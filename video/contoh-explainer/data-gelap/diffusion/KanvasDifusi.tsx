// Kanvas difusi: gambar dicampur noise per piksel ala DDPM: x = √ᾱ·gambar + √(1−ᾱ)·noise (ᾱ jadwal kosinus dari `level`).
// Biar kebaca "bentuk → warna → detail", gambar sumbernya dikasih blur & saturasi yang ikut level noise (detail ilang duluan,
// bentuk paling awet). level 0 = gambar bersih, 1 = noise murni. Noise per blok 2×2 piksel (kerasa "bintik TV").
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion';

const gambarCache = new Map<string, HTMLImageElement>();
const noiseCache = new Map<string, Float32Array>();

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function prng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function buatNoise(n: number, kunci: string) {
  const r = prng(hash(kunci));
  const a = new Float32Array(n);
  for (let i = 0; i < n; i += 2) {
    const u = Math.max(1e-7, r());
    const v = r();
    const m = Math.sqrt(-2 * Math.log(u));
    a[i] = m * Math.cos(2 * Math.PI * v);
    if (i + 1 < n) a[i + 1] = m * Math.sin(2 * Math.PI * v);
  }
  return a;
}

export const KanvasDifusi: React.FC<{
  src?: string;
  ukuran: number;
  level: number;
  seed: string;
  /** noise ganti tiap frame (layar TV rusak) */
  kedip?: boolean;
  blok?: number;
  radius?: number;
  gaya?: React.CSSProperties;
}> = ({ src, ukuran, level, seed, kedip, blok = 2, radius = 0, gaya }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const res = Math.round(ukuran);
  const [, setSiap] = useState(() => !src || gambarCache.has(src));
  const [handle] = useState(() => (src && !gambarCache.has(src) ? delayRender(`gambar ${src}`) : null));
  useEffect(() => {
    if (!src || gambarCache.has(src)) {
      if (handle !== null) continueRender(handle);
      return;
    }
    const img = new Image();
    img.onload = () => {
      gambarCache.set(src, img);
      setSiap(true);
      if (handle !== null) continueRender(handle);
    };
    img.onerror = () => {
      if (handle !== null) continueRender(handle);
    };
    img.src = staticFile(src);
  }, [src, handle]);
  useLayoutEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const a = Math.min(1, Math.max(0, level));
    const ab = Math.cos((Math.PI / 2) * a) ** 2;
    const sa = Math.sqrt(ab);
    const sn = Math.sqrt(1 - ab);
    const img = src ? gambarCache.get(src) : undefined;
    let px: Uint8ClampedArray | null = null;
    if (img && sa > 0.002) {
      const blur = (16 * Math.pow(Math.min(1, Math.max(0, (a - 0.1) / 0.72)), 1.1) * res) / 360;
      const sat = 1 - Math.min(1, Math.max(0, (a - 0.3) / 0.38));
      ctx.filter = `blur(${blur.toFixed(2)}px) saturate(${sat.toFixed(3)})`;
      ctx.drawImage(img, -blur * 2, -blur * 2, res + blur * 4, res + blur * 4);
      ctx.filter = 'none';
      px = ctx.getImageData(0, 0, res, res).data;
    }
    const nb = Math.ceil(res / blok);
    const kunci = `${kedip ? `${seed}-${frame}` : seed}-${nb}`;
    let nz = noiseCache.get(kunci);
    if (!nz) {
      nz = buatNoise(nb * nb * 3, kunci);
      if (!kedip) {
        // noise di-resample tiap langkah → cache dibatesin biar RAM render aman
        if (noiseCache.size > 40) noiseCache.clear();
        noiseCache.set(kunci, nz);
      }
    }
    const out = ctx.createImageData(res, res);
    const o = out.data;
    for (let y = 0; y < res; y++) {
      const by = Math.floor(y / blok) * nb;
      for (let x = 0; x < res; x++) {
        const j = (y * res + x) * 4;
        const k = (by + Math.floor(x / blok)) * 3;
        for (let c = 0; c < 3; c++) {
          const s = px ? px[j + c] / 127.5 - 1 : 0;
          o[j + c] = (sa * s + sn * nz[k + c] * 0.85 + 1) * 127.5;
        }
        o[j + 3] = 255;
      }
    }
    ctx.putImageData(out, 0, 0);
  });
  return <canvas ref={ref} width={res} height={res} style={{ width: ukuran, height: ukuran, borderRadius: radius, display: 'block', ...gaya }} />;
};
