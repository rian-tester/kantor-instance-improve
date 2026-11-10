// Bahan GERAK buat karya (masukan generik 27/09: "motion graphic kurang, kurang enak ditonton"). Aturannya di
// Semua waktu dalam detik. Semua digerakin frame (useCurrentFrame), gak ada CSS transition.
import React, { createContext, useContext } from 'react';
import {Grain} from '../../gerak/Grain';
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraMotionBlur } from '@remotion/motion-blur';

const JEPIT = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const PEGAS = Easing.bezier(0.34, 1.56, 0.64, 1); // overshoot
export const HALUS = Easing.bezier(0.65, 0, 0.35, 1); // in-out buat kamera
export const TAJAM = Easing.bezier(0.7, 0, 0.84, 0); // keluar/whip

const detikSekarang = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

// ---------- kamera & parallax ----------
export type TitikKamera = { t: number; x: number; y: number; zoom?: number; rot?: number; lama?: number };
type Posisi = { x: number; y: number; zoom: number; rot: number };
const KonteksKamera = createContext<Posisi>({ x: 540, y: 960, zoom: 1, rot: 0 });

function posisiKamera(titik: TitikKamera[], t: number, goyang: number): Posisi {
  let k = 0;
  for (let i = 0; i < titik.length; i++) if (t >= titik[i].t) k = i;
  const kini = titik[k];
  const dulu = titik[Math.max(0, k - 1)];
  const lama = kini.lama ?? 0.6;
  const m = k === 0 ? 1 : interpolate(t, [kini.t, kini.t + lama], [0, 1], { ...JEPIT, easing: HALUS });
  const campur = (a: number, b: number) => a + (b - a) * m;
  // drift pelan terus-terusan biar gak pernah diem, + goyang tangan tipis
  const drift = Math.sin(t * 0.7) * 6;
  return {
    x: campur(dulu.x, kini.x) + drift + Math.sin(t * 2.3) * goyang,
    y: campur(dulu.y, kini.y) + Math.cos(t * 1.9) * goyang,
    zoom: campur(dulu.zoom ?? 1, kini.zoom ?? 1) * (1 + 0.012 * Math.sin(t * 0.9)),
    rot: campur(dulu.rot ?? 0, kini.rot ?? 0) + Math.sin(t * 1.3) * goyang * 0.05,
  };
}

/** Dunia yang lebih gede dari layar; kamera terbang antar titik (x,y = titik dunia yang ada di tengah layar). */
export const Kamera: React.FC<{ titik: TitikKamera[]; goyang?: number; children: React.ReactNode }> = ({ titik, goyang = 2, children }) => {
  const t = detikSekarang();
  const p = posisiKamera(titik, t, goyang);
  return (
    <KonteksKamera.Provider value={p}>
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(540px, 960px) rotate(${p.rot}deg) scale(${p.zoom}) translate(${-p.x}px, ${-p.y}px)` }}>
          {children}
        </div>
      </AbsoluteFill>
    </KonteksKamera.Provider>
  );
};

/** Lapisan parallax di dalam Kamera: kedalaman 0 = ikut dunia, >0 = lebih deket (gerak lebih jauh), <0 = jauh. */
export const Lapis: React.FC<{ kedalaman: number; children: React.ReactNode }> = ({ kedalaman, children }) => {
  const p = useContext(KonteksKamera);
  return <div style={{ position: 'absolute', left: 0, top: 0, translate: `${(p.x - 540) * -kedalaman}px ${(p.y - 960) * -kedalaman}px` }}>{children}</div>;
};

// ---------- masuk / keluar ----------
/** Masuk pakai pegas (antisipasi + overshoot), keluar dianimasiin juga. */
export const Muncul: React.FC<{
  mulai: number;
  keluar?: number;
  dari?: 'bawah' | 'atas' | 'kiri' | 'kanan' | 'skala' | 'putar';
  jarak?: number;
  gaya?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ mulai, keluar, dari = 'bawah', jarak = 140, gaya, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = spring({ frame: frame - mulai * fps, fps, config: { damping: 12, stiffness: 150, mass: 0.8 } });
  const k = keluar === undefined ? 0 : interpolate(frame / fps, [keluar, keluar + 0.28], [0, 1], { ...JEPIT, easing: TAJAM });
  const sisa = 1 - m;
  const geser = {
    bawah: `0 ${sisa * jarak + k * -jarak}px`,
    atas: `0 ${-sisa * jarak + k * jarak}px`,
    kiri: `${-sisa * jarak + k * jarak}px 0`,
    kanan: `${sisa * jarak - k * jarak}px 0`,
    skala: '0 0',
    putar: '0 0',
  }[dari];
  return (
    <div
      style={{
        position: 'absolute',
        ...gaya,
        opacity: Math.min(1, m * 3) * (1 - k),
        translate: geser,
        scale: String(dari === 'skala' ? Math.max(0, m) * (1 - k * 0.3) : 1),
        rotate: dari === 'putar' ? `${sisa * -25 + k * 20}deg` : (gaya?.rotate as string | undefined),
      }}
    >
      {children}
    </div>
  );
};

/** Judul raksasa per huruf: tiap huruf naik lewat masker + pegas, stagger. */
export const HurufKinetik: React.FC<{ teks: string; mulai: number; jeda?: number; gaya?: React.CSSProperties; warnaHuruf?: (i: number) => string | undefined }> = ({
  teks,
  mulai,
  jeda = 0.035,
  gaya,
  warnaHuruf,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', ...gaya }}>
      {[...teks].map((h, i) => {
        const m = spring({ frame: frame - (mulai + i * jeda) * fps, fps, config: { damping: 11, stiffness: 170 } });
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', lineHeight: 'inherit', paddingBottom: '0.05em' }}>
            <span style={{ display: 'inline-block', translate: `0 ${(1 - m) * 105}%`, rotate: `${(1 - m) * 8}deg`, color: warnaHuruf?.(i), whiteSpace: 'pre' }}>{h}</span>
          </span>
        );
      })}
    </div>
  );
};

/** Punch: skala 1.18 → 1 dengan pegas di detik `t0` (buat kata tekanan). Balikin nilai skala. */
export const usePunch = (t0: number, kuat = 0.18) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < t0 * fps) return 1;
  const m = spring({ frame: frame - t0 * fps, fps, config: { damping: 9, stiffness: 220 } });
  return 1 + kuat * (1 - m);
};

/** Counter angka yang ngebut lalu ngerem di angka akhir. */
export const Hitung: React.FC<{ dari: number; ke: number; mulai: number; lama?: number; format?: (n: number) => string; gaya?: React.CSSProperties }> = ({
  dari,
  ke,
  mulai,
  lama = 1,
  format = (n) => Math.round(n).toLocaleString('id-ID'),
  gaya,
}) => {
  const t = detikSekarang();
  const n = interpolate(t, [mulai, mulai + lama], [dari, ke], { ...JEPIT, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return <div style={gaya}>{format(n)}</div>;
};

// ---------- transisi (taruh di atas semua scene) ----------
/** Lingkaran warna yang ngembang dari titik (x,y) nutup layar, lalu kebuka di baliknya (scene ganti di tengah). */
export const WipeLingkaran: React.FC<{ t0: number; warna: string; x?: number; y?: number; lama?: number }> = ({ t0, warna, x = 540, y = 960, lama = 0.55 }) => {
  const t = detikSekarang();
  if (t < t0 || t > t0 + lama) return null;
  const setengah = lama / 2;
  const r = t < t0 + setengah
    ? interpolate(t, [t0, t0 + setengah], [0, 2300], { ...JEPIT, easing: TAJAM })
    : 2300;
  const lubang = t < t0 + setengah ? 0 : interpolate(t, [t0 + setengah, t0 + lama], [0, 2300], { ...JEPIT, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width={1080} height={1920}>
        <defs>
          <mask id={`w${t0}`}>
            <circle cx={x} cy={y} r={r} fill="#fff" />
            <circle cx={x} cy={y} r={lubang} fill="#000" />
          </mask>
        </defs>
        <rect width={1080} height={1920} fill={warna} mask={`url(#w${t0})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Bar diagonal nyapu layar (arah kiri→kanan). */
export const WipeDiagonal: React.FC<{ t0: number; warna: string; lama?: number }> = ({ t0, warna, lama = 0.5 }) => {
  const t = detikSekarang();
  if (t < t0 || t > t0 + lama) return null;
  const x = interpolate(t, [t0, t0 + lama], [-2600, 1500], { ...JEPIT, easing: HALUS });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: x, top: -600, width: 1900, height: 3200, background: warna, rotate: '18deg' }} />
    </AbsoluteFill>
  );
};

/** Whip pan: balikin gaya buat pembungkus scene (geser + blur arah) di sekitar t0. arah 1 = ke kiri. */
export const whip = (t: number, t0: number, arah: 1 | -1 = 1, lama = 0.3): React.CSSProperties => {
  if (t < t0 - lama / 2 || t > t0 + lama / 2) return {};
  const keluar = t < t0;
  const m = keluar
    ? interpolate(t, [t0 - lama / 2, t0], [0, 1], { ...JEPIT, easing: TAJAM })
    : interpolate(t, [t0, t0 + lama / 2], [1, 0], { ...JEPIT, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const geser = (keluar ? -1 : 1) * arah * m * 700;
  return { translate: `${geser}px 0`, filter: `blur(${m * 28}px)` };
};

/** Zoom tembus: skala pembungkus scene lama ngebut ke (x,y) sampai nutup, dipakai bareng scene baru yang muncul. */
export const zoomTembus = (t: number, t0: number, x: number, y: number, lama = 0.45): React.CSSProperties => {
  if (t < t0 - lama) return {};
  const m = interpolate(t, [t0 - lama, t0], [0, 1], { ...JEPIT, easing: TAJAM });
  return { transformOrigin: `${x}px ${y}px`, scale: String(1 + m * 14), opacity: 1 - Math.max(0, (m - 0.85) / 0.15) };
};

// ---------- latar ----------
/** Latar warna solid + butiran + vinyet tipis; opsional pola garis/titik. */
export const LatarWarna: React.FC<{ warna: string; pola?: 'garis' | 'titik' | 'grid'; warnaPola?: string; gelap?: boolean }> = ({ warna, pola, warnaPola = 'rgba(0,0,0,.06)', gelap }) => {
  const frame = useCurrentFrame();
  const bg = pola === 'garis'
    ? `repeating-linear-gradient(135deg, ${warnaPola} 0 2px, transparent 2px 26px)`
    : pola === 'titik'
      ? `radial-gradient(${warnaPola} 2px, transparent 2.5px) 0 0/28px 28px`
      : pola === 'grid'
        ? `linear-gradient(${warnaPola} 1px, transparent 1px) 0 0/60px 60px, linear-gradient(90deg, ${warnaPola} 1px, transparent 1px) 0 0/60px 60px`
        : undefined;
  return (
    <AbsoluteFill style={{ backgroundColor: warna }}>
      {bg ? <AbsoluteFill style={{ background: bg, backgroundPosition: `${(frame * 0.4) % 60}px ${(frame * 0.25) % 60}px` }} /> : null}
      <AbsoluteFill style={{ background: gelap ? 'radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,.45) 100%)' : 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,.14) 100%)' }} />
      <Grain kuat={0.08} garisScan={0} vinyet={0} />
    </AbsoluteFill>
  );
};

/**
 * Motion blur asli: tiap frame dirender `sampel` kali di waktu yang beda tipis terus dicampur (ilmu repo video Opus,
 * 05/10). Gerak cepat (whip, punch, kamera terbang) jadi keliatan mahal. KHUSUS iklan / video hero: render jadi ±sampel×
 * lebih lama saat render. Video harian Sutradara JANGAN pakai. Jangan bungkus <Audio> (ikut kerender berkali-kali).
 * sampel 5 masih keliatan patah (uji 05/10: kotak ngebut 1.500 px/0,4 dtk) → default 10.
 */
export const BlurGerak: React.FC<{ sampel?: number; sudut?: number; nyala?: boolean; children: React.ReactNode }> = ({
  sampel = 10,
  sudut = 180,
  nyala = true,
  children,
}) => (nyala ? <CameraMotionBlur samples={sampel} shutterAngle={sudut}>{children}</CameraMotionBlur> : <>{children}</>);
