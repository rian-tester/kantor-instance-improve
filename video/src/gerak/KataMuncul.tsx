// Teks kata kunci (prinsip 5): tiap kata muncul blur→tajam + naik dikit, stagger, bisa dikunci ke waktu kata VO.
// Keluar = kebalikannya (blur + naik), berurutan. SapuSorot = highlight yang nyapu kiri→kanan di belakang kata.
import React from 'react';
import { EASE, maju, useDetik } from './waktu';

export type KataLayar = {
  t: string;
  /** detik muncul kata ini (mis. dari waktu kata VO); kosong = ikut stagger */
  mulai?: number;
  warna?: string;
  /** ganti isi (mis. dibungkus SapuSorot); teks t tetap dipakai sebagai kunci */
  isi?: React.ReactNode;
  gaya?: React.CSSProperties;
};

export const KataMuncul: React.FC<{
  kata: (KataLayar | string)[];
  /** detik kata pertama (dipakai kata yang gak punya `mulai`) */
  mulai: number;
  /** jarak antar kata kalau stagger (detik); bawaan 0,05 (3 frame @60) */
  jeda?: number;
  /** lama blur→tajam per kata (detik) */
  lama?: number;
  /** detik mulai keluar; kosong = gak keluar */
  keluar?: number;
  /** blur awal (px) */
  blur?: number;
  rata?: 'flex-start' | 'center' | 'flex-end';
  gaya?: React.CSSProperties;
}> = ({ kata, mulai, jeda = 0.05, lama = 0.16, keluar, blur = 16, rata = 'flex-start', gaya }) => {
  const t = useDetik();
  let jalan = mulai;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: '0.22em', justifyContent: rata, ...gaya }}>
      {kata.map((k0, i) => {
        const k: KataLayar = typeof k0 === 'string' ? { t: k0 } : k0;
        const m = k.mulai ?? jalan;
        jalan = Math.max(jalan, m) + jeda;
        const p = maju(t, m, m + lama);
        const q = keluar === undefined ? 0 : maju(t, keluar + i * 0.03, keluar + i * 0.03 + 0.18, EASE.keluar);
        const o = p * (1 - q);
        if (o <= 0.001) return <span key={i} style={{ display: 'inline-block', opacity: 0, ...k.gaya }}>{k.isi ?? k.t}</span>;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              color: k.warna,
              opacity: o,
              filter: `blur(${((1 - p) * blur + q * blur * 0.8).toFixed(2)}px)`,
              translate: `0 ${((1 - p) * 0.22 - q * 0.3).toFixed(3)}em`,
              scale: String(0.96 + 0.04 * p),
              ...k.gaya,
            }}
          >
            {k.isi ?? k.t}
          </span>
        );
      })}
    </div>
  );
};

/** Highlight nyapu kiri→kanan di belakang teks (±7 frame @30). penuh = blok di belakang semua tinggi huruf. */
export const SapuSorot: React.FC<{
  mulai: number;
  lama?: number;
  warna: string;
  /** warna teks sebelum → sesudah disorot (opsional) */
  warnaTeks?: [string, string];
  penuh?: boolean;
  keluar?: number;
  children: React.ReactNode;
}> = ({ mulai, lama = 0.2, warna, warnaTeks, penuh, keluar, children }) => {
  const t = useDetik();
  const p = maju(t, mulai, mulai + lama, EASE.kamera);
  const q = keluar === undefined ? 0 : maju(t, keluar, keluar + 0.18, EASE.keluar);
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span
        style={{
          position: 'absolute',
          left: '-0.1em',
          right: '-0.1em',
          bottom: penuh ? '0.02em' : '0.04em',
          height: penuh ? '0.92em' : '0.3em',
          background: warna,
          borderRadius: '0.08em',
          transformOrigin: q > 0 ? 'right' : 'left',
          transform: `scaleX(${(p * (1 - q)).toFixed(3)})`,
        }}
      />
      <span style={{ position: 'relative', color: warnaTeks ? warnaTeks[0] : undefined }}>{children}</span>
      {/* warna teks "sesudah" cuma di bagian yang udah kesapu (dulu ganti total di p > 0,5 → sisa teks gelap di atas latar gelap) */}
      {warnaTeks && p > 0 ? (
        <span
          aria-hidden
          style={{
            position: 'absolute', left: 0, top: 0, color: warnaTeks[1], whiteSpace: 'nowrap',
            clipPath: q > 0 ? `inset(0 0 0 ${(q * 100).toFixed(1)}%)` : `inset(0 ${((1 - p) * 100).toFixed(1)}% 0 0)`,
          }}
        >
          {children}
        </span>
      ) : null}
    </span>
  );
};
