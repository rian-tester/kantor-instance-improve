// Objek adegan yang nempel di DUNIA (peta). Semua garis = digambar (GarisDigambar), semua angka = berjalan & diikat ke gerak.
import React, { useMemo } from 'react';
import { random, useVideoConfig } from 'remotion';
import {
  AngkaJalan, EASE, GarisDigambar, maju, noise, pathLingkarTangan, pathPanah, pegas, Pop, Squash, useDetik,
} from "../../../src/gerak";
import { MONO, SAIRA, TANGAN } from "../../../src/gerak/font";
import { K } from "./gaya";
import { APPLE, CAR, G, HASIL, P, PANEL, PASANGAN_G, PRIA, RAJA, RATU, TITIK, WAFFLE, WANITA, posKata } from "./data-peta";
import { langkahSetel, posRaja } from "./Peta";
import type { WaktuR } from "./waktuRaja";

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
type Pt = { x: number; y: number };

const Svg: React.FC<{ children: React.ReactNode; o?: number }> = ({ children, o = 1 }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: o }} width={1} height={1}>
    {children}
  </svg>
);

/** panah lurus dari titik a ke b, dipotong `jarak` px dari tiap ujung (biar gak nutup titiknya) */
export function panah(a: Pt, b: Pt, jarak = 26, kepala = 34) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const L = Math.hypot(dx, dy) || 1;
  const ux = dx / L;
  const uy = dy / L;
  return pathPanah(a.x + ux * jarak, a.y + uy * jarak, b.x - ux * jarak, b.y - uy * jarak, 0, kepala);
}

// ======================================================================================================
// S1–S2: kata "raja" besar → kulitnya doang (bukan tulisan) → pita angka + barcode 640 angka → ambruk jadi titik + pin alamat
const ANGKA = ['0,12', '−0,87', '0,33', '0,05', '−0,41', '0,76', '−0,19', '0,58', '0,91', '−0,66', '0,27', '−0,08', '0,44', '−0,73', '0,15', '0,62'];
const NILAI_BC = Array.from({ length: 640 }, (_, i) => {
  if (i < 3) return [0.12, -0.87, 0.33][i];
  const u = random(`bc${i}`) * 2 - 1;
  return Math.sign(u) * Math.pow(Math.abs(u), 1.3);
});

export function waktuChip(i: number, T: WaktuR) {
  if (i < 3) return 0.34 + i * 0.17;
  return T.deretan + ((i - 3) * (T.angka1 + 0.25 - T.deretan)) / (ANGKA.length - 3);
}
export function progresBarcode(t: number, T: WaktuR) {
  return maju(t, T.deretan - 0.05, T.angka1 + 0.35, EASE.kamera);
}

export const HookRaja: React.FC<{ T: WaktuR }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t > T.raksasa2 + 1.2) return null;
  const p = RAJA;
  // ukuran kata: besar di hook → normal pas jadi label peta (S2)
  const kecil = maju(t, T.k2.mulai + 0.05, T.k2.mulai + 0.8, EASE.kamera);
  const sk = lerp(1.5, 1, kecil);
  const pop = pegas(t, 0.06, fps, { damping: 12, stiffness: 190, mass: 0.6 });
  // "bukan tulisan": dipindai kiri→kanan, hurufnya tinggal kulit (outline) — balik padat pas jadi label peta
  const pindai = maju(t, T.bukan1 - 0.05, T.tulisan + 0.45, EASE.linear);
  const padat = maju(t, T.k2.mulai + 0.35, T.k2.mulai + 0.8);
  const kulit = pindai * (1 - padat);
  const glitch = t > T.tulisan - 0.1 && t < T.tulisan + 0.25 ? noise('gl', t * 40) * 10 : 0;
  // pita angka + barcode ambruk ke titik (S2)
  const ambruk = maju(t, T.k2.mulai, T.k2.mulai + 0.6, EASE.keluar);
  const pb = progresBarcode(t, T);
  const nBar = Math.round(3 + 637 * pb);
  const munculBar = maju(t, 0.34, 0.9);
  const keluarSemua = maju(t, T.raksasa2 + 0.5, T.raksasa2 + 1.1, EASE.keluar);
  const fs = 64;
  const x0 = p.x + 25;
  const yPita = p.y + 92;
  const kataBesar = kecil < 1 && t < T.k2.mulai + 0.82;
  return (
    <>
      {/* titik raja + kata besar */}
      {kataBesar ? (
        <div style={{ position: 'absolute', left: p.x, top: p.y, scale: String(pop) }}>
          <div style={{ position: 'absolute', left: -13, top: -13, width: 26, height: 26, borderRadius: 13, background: K.tinta, boxShadow: `0 0 26px ${K.teal}` }} />
          <div style={{ position: 'absolute', left: 25, top: -fs * 0.62 * sk - 12 * sk, fontFamily: SAIRA, fontWeight: 800, fontSize: fs * sk, lineHeight: 1.2, whiteSpace: 'nowrap', translate: `${glitch}px 0` }}>
            {/* lapisan padat (bagian yang belum dipindai) */}
            <span style={{ color: K.tinta, clipPath: `inset(0 0 0 ${(kulit * 100).toFixed(1)}%)`, display: 'inline-block' }}>raja</span>
            {/* lapisan kulit */}
            <span style={{ position: 'absolute', left: 0, top: 0, color: 'transparent', WebkitTextStroke: `3px ${K.teal}`, clipPath: `inset(0 ${((1 - kulit) * 100).toFixed(1)}% 0 0)`, display: 'inline-block' }}>raja</span>
            {/* garis pindai */}
            {pindai > 0 && pindai < 1 && padat < 0.1 ? (
              <div style={{ position: 'absolute', left: `${(pindai * 100).toFixed(1)}%`, top: '8%', width: 5, height: '86%', background: K.teal, boxShadow: `0 0 18px ${K.teal}` }} />
            ) : null}
          </div>
        </div>
      ) : null}
      {/* denyut pas kata "raja" diucap */}
      {t > T.raja1 - 0.05 && t < T.raja1 + 0.9 ? (
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
          <circle cx={p.x} cy={p.y} r={16 + maju(t, T.raja1 - 0.05, T.raja1 + 0.9, EASE.masuk) * 90} fill="none" stroke={K.teal} strokeWidth={4} opacity={1 - maju(t, T.raja1, T.raja1 + 0.9)} />
          <circle cx={p.x} cy={p.y} r={16 + maju(t, T.raja1 + 0.2, T.raja1 + 0.9, EASE.masuk) * 60} fill="none" stroke={K.teal} strokeWidth={3} opacity={1 - maju(t, T.raja1 + 0.2, T.raja1 + 0.9)} />
        </svg>
      ) : null}
      {/* pita angka (teks layar 1) */}
      {ambruk < 1 && t > 0.3 ? (
        <div style={{ position: 'absolute', left: x0, top: yPita, transformOrigin: '0 50%', scale: `${1 - ambruk} ${1 - ambruk * 0.6}`, opacity: (1 - ambruk) * munculBar, translate: `${-ambruk * 30}px ${-ambruk * 92}px` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: MONO, fontWeight: 700, fontSize: 36, color: K.tinta, whiteSpace: 'nowrap' }}>
            <span style={{ color: K.abu }}>= [</span>
            {ANGKA.map((a, i) => {
              const m = waktuChip(i, T);
              const q = maju(t, m, m + 0.14);
              if (q <= 0) return null;
              return (
                <React.Fragment key={i}>
                  {i > 0 ? <span style={{ color: K.redup, opacity: q }}>·</span> : null}
                  <span style={{ color: a.startsWith('−') ? K.merah : K.teal, opacity: q, filter: `blur(${((1 - q) * 6).toFixed(1)}px)`, translate: `0 ${((1 - q) * 10).toFixed(1)}px` }}>{a}</span>
                </React.Fragment>
              );
            })}
            <span style={{ color: K.abu }}>…]</span>
          </div>
          {/* 640 angka sebagai kisi 32 × 20 (pakai tinggi layar 9:16): terang = nilai besar, teal = positif, merah = negatif */}
          <svg style={{ position: 'absolute', left: 0, top: 78, overflow: 'visible' }} width={448} height={280}>
            {NILAI_BC.slice(0, nBar).map((v, i) => (
              <rect key={i} x={(i % 32) * 14} y={Math.floor(i / 32) * 14} width={12} height={12} rx={2} fill={v >= 0 ? K.teal : K.merah} opacity={0.25 + Math.min(1, Math.abs(v)) * 0.75} />
            ))}
          </svg>
          {/* counter 640 angka (diikat ke panjang barcode) */}
          {t > T.deretan - 0.1 ? (
            <div style={{ position: 'absolute', left: 0, top: 372, display: 'flex', alignItems: 'baseline', gap: 12, opacity: maju(t, T.deretan - 0.1, T.deretan + 0.15) * (1 - maju(t, T.k2.mulai - 0.15, T.k2.mulai + 0.1)), whiteSpace: 'nowrap' }}>
              <AngkaJalan dari={0} ke={640} progress={nBar / 640} gaya={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 52, color: K.kuning }} />
              <span style={{ fontFamily: SAIRA, fontWeight: 600, fontSize: 36, color: K.tinta }}>angka</span>
              <span style={{ marginLeft: 12, fontFamily: MONO, fontWeight: 500, fontSize: 18, color: K.abu, border: `2px solid ${K.garis}`, borderRadius: 8, padding: '2px 8px' }}>contoh · ilustrasi</span>
            </div>
          ) : null}
        </div>
      ) : null}
      {/* pin alamat (S2) */}
      {t > T.alamat2 - 0.3 ? (
        <div style={{ opacity: 1 - keluarSemua }}>
          <Squash mendarat={T.alamat2 + 0.08} tinggiJatuh={120} lamaJatuh={0.2} gaya={{ position: 'absolute', left: p.x - 30, top: p.y - 104, width: 60, height: 92 }}>
            <svg width={60} height={92} viewBox="0 0 60 92">
              <path d="M30 90 C 22 70, 2 52, 2 30 A 28 28 0 1 1 58 30 C 58 52, 38 70, 30 90 Z" fill={K.kuning} />
              <circle cx={30} cy={30} r={11} fill={K.latar} />
            </svg>
          </Squash>
          <div style={{ position: 'absolute', left: p.x - 110, top: p.y + 36, fontFamily: MONO, fontWeight: 700, fontSize: 26, color: K.kuning, opacity: maju(t, T.alamat2 + 0.1, T.alamat2 + 0.3), whiteSpace: 'nowrap' }}>
            alamat: [0,12 · −0,87 …]
          </div>
        </div>
      ) : null}
    </>
  );
};

// ======================================================================================================
// S2: kata yang artinya mirip, letaknya berdekatan (gugus buah dilingkari, garis jarak pendek)
export const GugusBuah: React.FC<{ T: WaktuR }> = ({ T }) => {
  const t = useDetik();
  if (t < T.kata2 || t > T.k3.mulai + 0.6) return null;
  const pasang: [string, string][] = [['apel', 'jeruk'], ['apel', 'mangga'], ['mangga', 'pisang'], ['pisang', 'semangka'], ['jeruk', 'anggur']];
  const hapus = T.k3.mulai - 0.1;
  return (
    <>
      <Svg>
        <GarisDigambar d={pathLingkarTangan(1470, 1330, 400, 300, 'buah')} mulai={T.mirip - 0.15} lama={0.45} warna={K.teal} tebal={9} hapus={hapus} />
        {pasang.map(([a, b], i) => {
          const A = posKata(a);
          const B = posKata(b);
          return <GarisDigambar key={i} d={`M ${A.x} ${A.y} L ${B.x} ${B.y}`} mulai={T.letaknya + i * 0.07} lama={0.2} warna={K.kuning} tebal={5} opacity={0.9} hapus={hapus} />;
        })}
      </Svg>
      <div style={{ position: 'absolute', left: 1250, top: 1650, fontFamily: TANGAN, fontWeight: 700, fontSize: 56, color: K.kuning, opacity: maju(t, T.berdekatan, T.berdekatan + 0.2) * (1 - maju(t, hapus, hapus + 0.2)), rotate: '-6deg' }}>
        deket-deketan
      </div>
    </>
  );
};

// ======================================================================================================
// S3: tiga peneliti ninggalin tanda di peta (−, +, ?) = bocoran hitungan
export const TandaS3: React.FC<{ T: WaktuR }> = ({ T }) => {
  const t = useDetik();
  if (t < T.nyobain - 0.2 || t > T.dibentuk + 0.3) return null;
  const hapus = T.k4.mulai - 0.1;
  const a = { x: PRIA.x - 80, y: PRIA.y - 80 };
  const b = { x: WANITA.x - 80, y: WANITA.y - 80 };
  return (
    <>
      <Svg>
        <GarisDigambar d={`M ${a.x - 34} ${a.y} L ${a.x + 34} ${a.y}`} mulai={T.nyobain + 0.1} lama={0.2} warna={K.merah} tebal={14} hapus={hapus} />
        <GarisDigambar d={`M ${b.x - 34} ${b.y} L ${b.x + 34} ${b.y}`} mulai={T.hitungan3} lama={0.16} warna={K.teal} tebal={14} hapus={hapus} />
        <GarisDigambar d={`M ${b.x} ${b.y - 34} L ${b.x} ${b.y + 34}`} mulai={T.hitungan3 + 0.12} lama={0.16} warna={K.teal} tebal={14} hapus={hapus} />
      </Svg>
      <Pop mulai={T.aneh} keluar={hapus} gaya={{ position: 'absolute', left: HASIL.x - 40, top: HASIL.y - 80, width: 80, textAlign: 'center' }}>
        <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 130, lineHeight: 1, color: K.kuning }}>?</div>
      </Pop>
    </>
  );
};

// ======================================================================================================
// S6: panel "angka raja" disetel 6 langkah kecil (angka berjalan diikat ke langkah titik raja)
const SETEL_AWAL = [0.12, -0.87, 0.33, 0.05, -0.41, 0.76];
const SETEL_AKHIR = [0.18, -0.79, 0.41, -0.02, -0.36, 0.7];
export const PanelSetel: React.FC<{ T: WaktuR }> = ({ T }) => {
  const t = useDetik();
  if (t < T.k6.mulai - 0.3 || t > T.lompat + 0.5) return null;
  const pr = posRaja(t, T);
  const box = { x: RAJA.x - 150, y: RAJA.y + 110, w: 410 };
  const p = langkahSetel(t, T);
  const muncul = maju(t, T.k6.mulai - 0.2, T.k6.mulai + 0.2);
  const keluar = maju(t, T.lompat - 0.1, T.lompat + 0.25, EASE.keluar);
  const o = muncul * (1 - keluar);
  return (
    <>
      <Svg o={1 - keluar}>
        <GarisDigambar d={`M ${box.x + 150} ${box.y} L ${pr.x} ${pr.y + 20}`} mulai={T.k6.mulai + 0.1} lama={0.3} warna={K.redup} tebal={4} />
      </Svg>
      <div style={{ position: 'absolute', left: box.x, top: box.y, width: box.w, padding: '16px 26px', borderRadius: 22, background: 'rgba(15,26,51,0.92)', border: `3px solid ${K.garis}`, opacity: o, translate: `0 ${(1 - muncul) * 30}px` }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: K.abu, letterSpacing: '0.08em' }}>ANGKA "raja"</div>
        {SETEL_AWAL.map((v0, i) => {
          // tiap langkah, tiap angka geser dikit (zig-zag kecil) menuju nilai akhir
          const v = lerp(v0, SETEL_AKHIR[i], p) + Math.sin(p * Math.PI * 6 + i) * 0.03 * (1 - p);
          const s = Math.round(v * 100) / 100;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
              <span style={{ width: 120, textAlign: 'right', fontFamily: MONO, fontWeight: 800, fontSize: 36, color: s < 0 ? K.merah : K.teal, fontVariantNumeric: 'tabular-nums' }}>{s.toLocaleString('id-ID', { minimumFractionDigits: 2 }).replace('-', '−')}</span>
              <div style={{ position: 'relative', width: 200, height: 14, background: '#17243f', borderRadius: 7 }}>
                <div style={{ position: 'absolute', left: s < 0 ? 100 + s * 100 : 100, width: Math.abs(s) * 100, top: 0, height: 14, borderRadius: 7, background: s < 0 ? K.merah : K.teal }} />
                <div style={{ position: 'absolute', left: 99, top: -4, width: 2, height: 22, background: K.abu }} />
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: 10, fontFamily: MONO, fontWeight: 500, fontSize: 24, color: K.abu }}>… ratusan lagi · ilustrasi</div>
      </div>
    </>
  );
};

// ======================================================================================================
// S7–S9 (+S14): raja − pria + wanita. Panah pria→wanita digambar, disalin & digeser ke raja, ujungnya = titik hasil.
export function slidePanah(t: number, T: WaktuR) {
  return maju(t, T.geserPanah, T.geserPanah + 0.75, EASE.kamera);
}

const Lencana: React.FC<{ x: number; y: number; isi: string; warna: string; mulai: number; keluar: number }> = ({ x, y, isi, warna, mulai, keluar }) => (
  <Pop mulai={mulai} keluar={keluar} gaya={{ position: 'absolute', left: x - 42, top: y - 42 }}>
    <div style={{ width: 84, height: 84, borderRadius: 42, background: warna, color: K.latar, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SAIRA, fontWeight: 800, fontSize: 84, lineHeight: 1, paddingBottom: 8, boxShadow: '0 6px 20px rgba(0,0,0,0.5)' }}>{isi}</div>
  </Pop>
);

export const Jajaran: React.FC<{ T: WaktuR }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < T.k7.mulai - 0.2 || t > T.k15.mulai + 1.2) return null;
  const s = slidePanah(t, T);
  const dPW = panah(PRIA, WANITA);
  const geser = { x: (RAJA.x - PRIA.x) * s, y: (RAJA.y - PRIA.y) * s };
  // titik hasil: muncul di ujung salinan panah, S9 "jatuh" (snap) ke ratu
  const snap = maju(t, T.ratu - 0.08, T.ratu + 0.12, EASE.jatuh);
  const hx = lerp(HASIL.x, RATU.x, snap);
  const hy = lerp(HASIL.y, RATU.y, snap);
  const hasilPop = pegas(t, T.hasilMuncul - 0.12, fps, { damping: 10, stiffness: 220, mass: 0.6 });
  const hilangHasil = maju(t, T.k10.mulai + 0.2, T.k10.mulai + 0.6, EASE.keluar);
  const keluarBadge = T.hubungan - 0.2;
  const akhir = T.k15.mulai + 0.6;
  const raja7 = pegas(t, T.raja7, fps, { damping: 9, stiffness: 200, mass: 0.6 });
  return (
    <>
      <Svg>
        {/* denyut alamat raja */}
        {t > T.raja7 && t < T.raja7 + 0.8 ? (
          <circle cx={RAJA.x} cy={RAJA.y} r={20 + raja7 * 70} fill="none" stroke={K.teal} strokeWidth={6} opacity={1 - maju(t, T.raja7, T.raja7 + 0.8)} />
        ) : null}
        <GarisDigambar d={pathLingkarTangan(PRIA.x + 60, PRIA.y - 4, 150, 82, 'lpria')} mulai={T.pria7 - 0.05} lama={0.3} warna={K.merah} tebal={7} hapus={keluarBadge} />
        <GarisDigambar d={pathLingkarTangan(WANITA.x + 80, WANITA.y - 4, 175, 82, 'lwanita')} mulai={T.wanita7 - 0.05} lama={0.3} warna={K.teal} tebal={7} hapus={keluarBadge} />
        {/* panah pria → wanita (arah "pria→wanita") */}
        <GarisDigambar d={dPW} mulai={T.wanita7 + 0.05} lama={0.4} warna={K.teal} tebal={10} hapus={akhir} />
        {/* salinan panah yang digeser ke raja */}
        {t > T.geserPanah - 0.02 && t < T.ratu + 0.7 ? (
          <g transform={`translate(${geser.x} ${geser.y})`} opacity={1 - maju(t, T.ratu + 0.3, T.ratu + 0.7)}>
            <path d={dPW} fill="none" stroke={K.teal} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="22 14" opacity={0.9} />
          </g>
        ) : null}
        {/* panah raja → ratu, sejajar panah pria → wanita */}
        <GarisDigambar d={panah(RAJA, RATU)} mulai={T.ratu + 0.3} lama={0.45} warna={K.kuning} tebal={10} hapus={akhir} />
      </Svg>
      <Lencana x={PRIA.x - 80} y={PRIA.y - 80} isi="−" warna={K.merah} mulai={T.dikurangi + 0.05} keluar={keluarBadge} />
      <Lencana x={WANITA.x - 80} y={WANITA.y - 80} isi="+" warna={K.teal} mulai={T.ditambah + 0.05} keluar={keluarBadge} />
      {/* titik hasil (cincin kosong) */}
      {t > T.hasilMuncul - 0.12 && hilangHasil < 1 ? (
        <div style={{ position: 'absolute', left: hx, top: hy, opacity: 1 - hilangHasil }}>
          <div style={{ position: 'absolute', left: -24, top: -24, width: 48, height: 48, borderRadius: 24, border: `6px solid ${K.kuning}`, background: snap > 0.9 ? K.kuning : 'rgba(255,197,61,0.12)', scale: String(hasilPop * (1 + (snap > 0.9 ? 0.25 * (1 - pegas(t, T.ratu + 0.12, fps, { damping: 8, stiffness: 260, mass: 0.5 })) : 0))), boxShadow: `0 0 30px ${K.kuning}` }} />
          {snap < 0.05 ? (
            <>
              <div style={{ position: 'absolute', left: -46, top: -2, width: 20, height: 4, background: K.kuning }} />
              <div style={{ position: 'absolute', left: 26, top: -2, width: 20, height: 4, background: K.kuning }} />
              <div style={{ position: 'absolute', left: -2, top: -46, width: 4, height: 20, background: K.kuning }} />
              <div style={{ position: 'absolute', left: -2, top: 26, width: 4, height: 20, background: K.kuning }} />
            </>
          ) : null}
        </div>
      ) : null}
      {/* label titik hasil */}
      {t > T.hasilMuncul && t < T.ratu ? (
        <div style={{ position: 'absolute', left: HASIL.x - 250, top: HASIL.y + 34, width: 240, textAlign: 'right', fontFamily: TANGAN, fontWeight: 700, fontSize: 34, color: K.kuning, opacity: maju(t, T.hasilMuncul, T.hasilMuncul + 0.2) * (1 - maju(t, T.ratu - 0.25, T.ratu)) }}>
          {t < T.hasil8 ? '?' : 'titik hasil'}
        </div>
      ) : null}
    </>
  );
};

// S8–S9: gak pas nempel → radar cari tetangga → ratu paling deket
export const Tetangga: React.FC<{ T: WaktuR }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const latar = useMemo(
    () =>
      [...TITIK]
        .map((d) => ({ x: d.x, y: d.y, j: Math.hypot(d.x - HASIL.x, d.y - HASIL.y) }))
        .filter((d) => d.j > 150)
        .sort((a, b) => a.j - b.j)
        .slice(0, 2),
    [],
  );
  if (t < T.gak8 - 0.2 || t > T.k10.mulai + 0.8) return null;
  const tujuan: { p: Pt; ratu?: boolean }[] = [
    { p: RATU, ratu: true },
    { p: posKata('takhta') },
    { p: posKata('mahkota') },
    ...latar.map((d) => ({ p: { x: d.x, y: d.y } })),
  ];
  const pilih = maju(t, T.ratu - 0.15, T.ratu + 0.1);
  const hapus = T.k10.mulai + 0.1;
  const kotakPop = pegas(t, T.ratu, fps, { damping: 10, stiffness: 200, mass: 0.6 });
  return (
    <>
      <Svg>
        {/* "gak pas nempel": jarak kecil hasil ↔ ratu */}
        <GarisDigambar d={`M ${HASIL.x + 6} ${HASIL.y - 34} L ${RATU.x + 6} ${RATU.y - 34}`} mulai={T.gak8} lama={0.2} warna={K.merah} tebal={4} hapus={T.dicari - 0.1} />
        {/* radar */}
        {[T.dicari, T.tetangga + 0.25].map((m, i) => {
          const q = maju(t, m, m + 1.3, EASE.masuk);
          if (q <= 0 || q >= 1) return null;
          return <circle key={i} cx={HASIL.x} cy={HASIL.y} r={20 + q * 420} fill="none" stroke={K.teal} strokeWidth={4} opacity={(1 - q) * 0.9} />;
        })}
        {/* garis ke calon tetangga */}
        {tujuan.map((d, i) => (
          <g key={i} opacity={d.ratu ? 1 : 1 - 0.85 * pilih}>
            <GarisDigambar
              d={`M ${HASIL.x} ${HASIL.y} L ${d.p.x} ${d.p.y}`}
              mulai={T.tetangga - 0.1 + i * 0.1}
              lama={0.18}
              warna={d.ratu && pilih > 0.5 ? K.kuning : K.abu}
              tebal={d.ratu && pilih > 0.5 ? 7 : 4}
              hapus={hapus}
            />
          </g>
        ))}
        {/* kotak jawaban di ratu */}
        <GarisDigambar d={`M ${RATU.x - 34} ${RATU.y - 70} H ${RATU.x + 230} V ${RATU.y + 56} H ${RATU.x - 34} Z`} mulai={T.ratu + 0.05} lama={0.32} warna={K.kuning} tebal={6} hapus={hapus} />
      </Svg>
      <div style={{ position: 'absolute', left: HASIL.x - 40, top: HASIL.y - 116, fontFamily: TANGAN, fontWeight: 700, fontSize: 34, color: K.merah, opacity: maju(t, T.gak8 + 0.1, T.gak8 + 0.3) * (1 - maju(t, T.dicari - 0.15, T.dicari + 0.05)), whiteSpace: 'nowrap' }}>
        gak pas nempel
      </div>
      {t > T.ratu ? (
        <div style={{ position: 'absolute', left: RATU.x - 30, top: RATU.y + 70, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: K.kuning, scale: String(kotakPop), transformOrigin: '0 50%', opacity: 1 - maju(t, hapus, hapus + 0.2), whiteSpace: 'nowrap' }}>
          paling deket
        </div>
      ) : null}
    </>
  );
};

// ======================================================================================================
// S10: arah pria→wanita kebentuk di pasangan lain juga (ilustrasi)
export const PasanganLain: React.FC<{ T: WaktuR }> = ({ T }) => {
  const t = useDetik();
  if (t < T.hubungan || t > T.keInggris + 1.2) return null;
  return (
    <Svg>
      {PASANGAN_G.map(([a, b], i) => (
        <GarisDigambar key={a} d={panah(posKata(a), posKata(b), 22, 30)} mulai={T.kebentuk - 0.9 + i * 0.28} lama={0.35} warna={K.teal} tebal={8} opacity={0.85} hapus={T.keInggris + 0.4} />
      ))}
    </Svg>
  );
};

// ======================================================================================================
// S11: apple→apples ≈ car→cars
export const JamakInggris: React.FC<{ T: WaktuR }> = ({ T }) => {
  const t = useDetik();
  if (t < T.keInggris || t > T.keUji + 1.2) return null;
  const apples = { x: APPLE.x + P.x, y: APPLE.y + P.y };
  const cars = { x: CAR.x + P.x, y: CAR.y + P.y };
  const dA = panah(APPLE, apples, 22, 30);
  const s = maju(t, T.hampir11, T.car - 0.05, EASE.kamera);
  const hapus = T.keUji + 0.4;
  const dog = { x: 640, y: 4380 };
  const tree = { x: 2250, y: 3900 };
  return (
    <>
      <Svg>
        <GarisDigambar d={dA} mulai={T.apple + 0.15} lama={0.5} warna={K.teal} tebal={9} hapus={hapus} />
        {t > T.hampir11 - 0.02 ? (
          <g transform={`translate(${(CAR.x - APPLE.x) * s + 26 * s} ${(CAR.y - APPLE.y) * s + 60 * s})`} opacity={1 - maju(t, hapus, hapus + 0.2)}>
            <path d={dA} fill="none" stroke={K.teal} strokeWidth={9} strokeLinecap="round" strokeDasharray="20 14" opacity={0.8} />
          </g>
        ) : null}
        <GarisDigambar d={panah(CAR, cars, 22, 30)} mulai={T.car} lama={0.45} warna={K.kuning} tebal={9} hapus={hapus} />
        <GarisDigambar d={panah(dog, { x: dog.x + P.x, y: dog.y + P.y }, 22, 26)} mulai={T.cars + 0.45} lama={0.35} warna={K.teal} tebal={6} opacity={0.45} hapus={hapus} />
        <GarisDigambar d={panah(tree, { x: tree.x + P.x, y: tree.y + P.y }, 22, 26)} mulai={T.cars + 0.6} lama={0.35} warna={K.teal} tebal={6} opacity={0.45} hapus={hapus} />
      </Svg>
      <Pop mulai={T.cars + 0.2} keluar={hapus} gaya={{ position: 'absolute', left: (CAR.x + cars.x) / 2 + 40, top: (CAR.y + cars.y) / 2 + 20 }}>
        <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 96, lineHeight: 1, color: K.kuning, textShadow: '0 4px 18px rgba(0,0,0,0.6)' }}>≈</div>
      </Pop>
    </>
  );
};

// ======================================================================================================
// S12–S13: panel uji 8.000 soal (waffle 125 × 64), 39,6% kejawab → batang vs tebakan asal < 1%
export const WX = PANEL.x + 40;
export const WY = PANEL.y + 80;
const LEBAR_W = WAFFLE.kol * WAFFLE.sel;
const TINGGI_W = WAFFLE.bar * WAFFLE.sel;
export function isiSoal(t: number, T: WaktuR) {
  return maju(t, T.n8000 - 0.15, T.soal12 + 0.9, EASE.kamera);
}
export function isiBener(t: number, T: WaktuR) {
  return maju(t, T.n40 - 0.2, T.persen13 + 0.55, EASE.kamera);
}

function barisWaffle(n: number, warna: string, o: number, kunci: string) {
  const full = Math.floor(n / WAFFLE.kol);
  const sisa = n - full * WAFFLE.kol;
  const el: React.ReactNode[] = [];
  for (let r = 0; r < Math.min(WAFFLE.bar, full + (sisa > 0 ? 1 : 0)); r++) {
    const sel = r < full ? WAFFLE.kol : sisa;
    const y = WY + r * WAFFLE.sel + WAFFLE.isi / 2;
    el.push(
      <line key={`${kunci}${r}`} x1={WX} y1={y} x2={WX + sel * WAFFLE.sel} y2={y} stroke={warna} strokeWidth={WAFFLE.isi} strokeDasharray={`${WAFFLE.isi} ${WAFFLE.sel - WAFFLE.isi}`} opacity={o} />,
    );
  }
  return el;
}

const Kartu: React.FC<{ x: number; y: number; mulai: number; keluar: number; tag: string; isi: React.ReactNode }> = ({ x, y, mulai, keluar, tag, isi }) => (
  <Pop mulai={mulai} keluar={keluar} damping={12} gaya={{ position: 'absolute', left: x, top: y }}>
    <div style={{ padding: '18px 30px 22px', borderRadius: 20, background: K.latar, border: `4px solid ${K.teal}`, boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: K.teal, letterSpacing: '0.08em' }}>{tag}</div>
      <div style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 60, color: K.tinta, whiteSpace: 'nowrap', marginTop: 4 }}>{isi}</div>
    </div>
  </Pop>
);

export const PanelUji: React.FC<{ T: WaktuR }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < T.keUji + 0.3 || t > T.kePeta14 + 1.3) return null;
  const muncul = pegas(t, T.keUji + 0.55, fps, { damping: 200 });
  const keluar = maju(t, T.kePeta14 + 0.6, T.kePeta14 + 1.1, EASE.keluar);
  const nSoal = Math.round(8000 * isiSoal(t, T));
  const pb = isiBener(t, T);
  const nBener = Math.round(3168 * pb);
  const yB1 = WY + TINGGI_W + 90;
  const yB2 = yB1 + 150;
  const asal = maju(t, T.n1 - 0.1, T.n1 + 0.25, EASE.masuk);
  const batang = maju(t, T.k13.mulai + 0.3, T.k13.mulai + 0.8);
  return (
    <div style={{ opacity: muncul * (1 - keluar) }}>
      <div style={{ position: 'absolute', left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, borderRadius: 28, background: 'rgba(10,18,36,0.94)', border: `3px solid ${K.garis}`, boxShadow: '0 30px 80px rgba(0,0,0,0.55)' }} />
      <div style={{ position: 'absolute', left: WX, top: PANEL.y + 22, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: K.abu, letterSpacing: '0.06em' }}>SOAL TEBAK PASANGAN KATA</div>
      <Svg>
        {barisWaffle(8000, '#1a2944', 1, 'k')}
        {barisWaffle(nSoal, '#6e86a8', 1, 's')}
        {barisWaffle(nBener, K.kuning, 1, 'b')}
      </Svg>
      {/* contoh soal */}
      <Kartu x={WX + 40} y={WY + 120} mulai={T.jamak12 - 0.1} keluar={T.k13.mulai - 0.1} tag="BENTUK JAMAK" isi={<>car : cars = apple : <span style={{ color: K.kuning }}>?</span></>} />
      <Kartu x={WX + 200} y={WY + 300} mulai={T.lampau - 0.1} keluar={T.k13.mulai - 0.1} tag="BENTUK LAMPAU" isi={<>walk : walked = jump : <span style={{ color: K.kuning }}>?</span></>} />
      {/* batang 1: hitungan geser alamat */}
      <div style={{ opacity: batang }}>
        <div style={{ position: 'absolute', left: WX, top: yB1 - 52, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: K.tinta }}>hitungan geser alamat</div>
        <div style={{ position: 'absolute', left: WX, top: yB1, width: LEBAR_W, height: 48, borderRadius: 10, background: '#17243f' }} />
        <div style={{ position: 'absolute', left: WX, top: yB1, width: LEBAR_W * 0.396 * pb, height: 48, borderRadius: 10, background: K.kuning }} />
        <div style={{ position: 'absolute', left: WX + LEBAR_W * 0.396 * pb + 24, top: yB1 - 16, fontFamily: SAIRA, fontWeight: 800, fontSize: 72, lineHeight: 1, color: K.kuning }}>
          <AngkaJalan dari={0} ke={39.6} progress={pb} desimal={1} belakang="%" />
        </div>
        {/* batang 2: tebakan asal */}
        <div style={{ position: 'absolute', left: WX, top: yB2 - 52, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: K.tinta, opacity: maju(t, T.padahal, T.padahal + 0.3) }}>tebakan asal</div>
        <div style={{ position: 'absolute', left: WX, top: yB2, width: LEBAR_W, height: 48, borderRadius: 10, background: '#17243f', opacity: maju(t, T.padahal, T.padahal + 0.3) }} />
        <div style={{ position: 'absolute', left: WX, top: yB2, width: 6 * asal, height: 48, borderRadius: 3, background: K.merah }} />
        <div style={{ position: 'absolute', left: WX + 30, top: yB2 - 16, fontFamily: SAIRA, fontWeight: 800, fontSize: 72, lineHeight: 1, color: K.merah, opacity: asal }}>{'< 1%'}</div>
      </div>
      <Svg>
        <GarisDigambar d={`M ${WX + LEBAR_W * 0.396 + 6} ${yB1 - 30} h 200 v 100 h -200 Z`} mulai={T.kejawab} lama={0.35} warna={K.kuning} tebal={5} />
      </Svg>
    </div>
  );
};

// ======================================================================================================
// S14: jarak sama (tanda kongruen) + arah sama (busur sudut) di dua panah
export const JarakArah: React.FC<{ T: WaktuR }> = ({ T }) => {
  const t = useDetik();
  if (t < T.jarak14 - 0.2 || t > T.k15.mulai + 1.0) return null;
  const hapus = T.k15.mulai + 0.5;
  const sudut = Math.atan2(G.y, G.x);
  const tanda = (a: Pt, b: Pt, warna: string, mulai: number, k: string) => {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const ux = Math.cos(sudut);
    const uy = Math.sin(sudut);
    return [-1, 1].map((s) => {
      const cx = mx + ux * s * 12;
      const cy = my + uy * s * 12;
      return <GarisDigambar key={`${k}${s}`} d={`M ${cx - uy * 30} ${cy + ux * 30} L ${cx + uy * 30} ${cy - ux * 30}`} mulai={mulai + (s + 1) * 0.06} lama={0.12} warna={warna} tebal={7} hapus={hapus} />;
    });
  };
  const busur = (o: Pt, warna: string, mulai: number, k: string) => {
    const r = 170;
    return (
      <React.Fragment key={k}>
        <GarisDigambar d={`M ${o.x} ${o.y} L ${o.x + 320} ${o.y}`} mulai={mulai} lama={0.2} warna={K.abu} tebal={4} hapus={hapus} />
        <GarisDigambar d={`M ${o.x + r} ${o.y} A ${r} ${r} 0 0 1 ${o.x + r * Math.cos(sudut)} ${o.y + r * Math.sin(sudut)}`} mulai={mulai + 0.15} lama={0.25} warna={warna} tebal={6} hapus={hapus} />
      </React.Fragment>
    );
  };
  return (
    <>
      <Svg>
        {tanda(PRIA, WANITA, K.teal, T.jarak14, 'a')}
        {tanda(RAJA, RATU, K.kuning, T.jarak14 + 0.15, 'b')}
        {busur(PRIA, K.teal, T.arah - 0.05, 'c')}
        {busur(RAJA, K.kuning, T.arah + 0.1, 'd')}
      </Svg>
      <div style={{ position: 'absolute', left: RAJA.x + 330, top: RAJA.y - 10, fontFamily: TANGAN, fontWeight: 700, fontSize: 58, color: K.tinta, opacity: maju(t, T.arah + 0.2, T.arah + 0.4) * (1 - maju(t, hapus, hapus + 0.2)), whiteSpace: 'nowrap' }}>
        arah sama
      </div>
      <div style={{ position: 'absolute', left: (PRIA.x + WANITA.x) / 2 + 40, top: (PRIA.y + WANITA.y) / 2 - 110, fontFamily: TANGAN, fontWeight: 700, fontSize: 58, color: K.tinta, opacity: maju(t, T.jarak14 + 0.2, T.jarak14 + 0.4) * (1 - maju(t, hapus, hapus + 0.2)), whiteSpace: 'nowrap', rotate: `${(sudut * 180) / Math.PI}deg` }}>
        jarak sama
      </div>
    </>
  );
};
