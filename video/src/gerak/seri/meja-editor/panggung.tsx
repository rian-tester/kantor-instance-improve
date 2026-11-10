// PANGGUNG SERI EXPLAINER generik #2 (contoh, 19/10: K2 K4 K6 K7 K8 K9 K10). Gaya keluarga sama persis dengan K1/K3/K5
// ("meja editor amber", seri.tsx): judul Anton di atas, MONITOR PROGRAM di tengah (isi adegan per kalimat VO), timeline di bawah
// (lajur V1 = klip per kalimat, lajur A1 = blok kata VO), playhead amber, subtitle lengkap, penutup monitor → HP + CTA simpan/follow,
// balik ke adegan pembuka (loop). Ganti adegan di monitor = playhead nyapu kiri→kanan (wipe bermakna dunia editor, bukan crossfade).
import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  akhirKata, AngkaJalan, Bunyi, Dunia, EASE, kata, maju, noise, pegas, Subtitle, useDetik,
  type Getar, type Kata, type KunciKamera, type Sfx,
} from "../..";
import { ANTON, INTER, MONO } from "./font";
import {
  bunyi, CtaKD, kameraKD, KD, LatarKD, lerpKotak, PeneduhAtas, PlayheadKD, RangkaLayar, SumberKD, TeksturKD, TrackKD,
  type KlipKD, type Kotak,
} from "./seri";

export type Kal = { mulai: number; akhir: number; teks?: string };
export type DataKD = { durasi: number; kata: Kata[]; kalimat?: Kal[] };

export const MON: Kotak = { x: 90, y: 584, w: 900, h: 506, r: 20 };
export const HPK: Kotak = { x: 296, y: 540, w: 488, h: 866, r: 66 };
export const MW = MON.w - 6;
export const MH = MON.h - 6;
const X0 = 540;
const TY = 1196;
const TH = 62;
const AY = 1268;
const AH = 34;
const PXS = 72; // px dunia per detik di timeline

// ======================================================================================================
export type WaktuDasar = ReturnType<typeof dasarWaktu>;
export function dasarWaktu(d: DataKD, total: number) {
  const s = (d.kalimat ?? []).map((k) => ({ mulai: k.mulai, akhir: k.akhir }));
  const n = s.length;
  /** detik mulai kata `c` di kalimat ke-i (0-based); cadangan = awal kalimat + geser */
  const k = (c: string, i: number, geser = 0) => kata(d.kata, c, s[i].mulai, s[i].mulai + geser);
  /** sama tapi cari setelah detik tertentu */
  const ks = (c: string, setelah: number, cad: number) => kata(d.kata, c, setelah, cad);
  const ak = (c: string, i: number, geser = 0) => akhirKata(d.kata, c, s[i].mulai, s[i].mulai + geser);
  return { total, s, n, k, ks, ak, keHp: s[n - 1].mulai, pulang: total - 1.05, loop: total - 0.3 };
}

// ======================================================================================================
/** Adegan di monitor: masuk = disapu playhead amber (kiri→kanan, 0,32 dtk), isinya zoom pelan + drift biar gak beku. */
export const Babak: React.FC<{ dari: number; sampai: number; latar?: string; children: React.ReactNode; tanpaSapu?: boolean; zoom?: number }> = ({
  dari, sampai, latar = '#0e0d10', children, tanpaSapu, zoom = 0.035,
}) => {
  const t = useDetik();
  if (t < dari - 0.2 || t > sampai + 0.45) return null;
  const p = tanpaSapu ? maju(t, dari - 0.15, dari + 0.1) : maju(t, dari - 0.16, dari + 0.16, EASE.kamera);
  const z = 1 + zoom * maju(t, dari, sampai + 0.4, EASE.linear);
  const dx = noise(`bb${dari.toFixed(1)}x`, t * 0.35) * 6;
  const dy = noise(`bb${dari.toFixed(1)}y`, t * 0.3) * 4;
  return (
    <div style={{ position: 'absolute', inset: 0, clipPath: tanpaSapu || p >= 1 ? undefined : `inset(0 ${((1 - p) * 100).toFixed(2)}% 0 0)`, opacity: tanpaSapu ? p : 1 }}>
      <div style={{ position: 'absolute', inset: 0, background: latar }} />
      <div style={{ position: 'absolute', inset: 0, scale: String(z), translate: `${dx.toFixed(2)}px ${dy.toFixed(2)}px` }}>{children}</div>
      {!tanpaSapu && p > 0 && p < 1 ? (
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${(p * 100).toFixed(2)}%`, width: 5, marginLeft: -3, background: KD.amber, boxShadow: '0 0 18px rgba(255,180,84,0.85)' }} />
      ) : null}
    </div>
  );
};

/** Masuk halus (naik + blur→tajam), keluar opsional. */
export const Muncul: React.FC<{ m: number; k?: number; x?: number; y?: number; dy?: number; children: React.ReactNode; gaya?: React.CSSProperties; tengah?: boolean }> = ({
  m, k, x = 0, y = 0, dy = 24, children, gaya, tengah,
}) => {
  const t = useDetik();
  const p = maju(t, m, m + 0.28);
  const q = k === undefined ? 0 : maju(t, k, k + 0.2, EASE.keluar);
  const o = p * (1 - q);
  if (o <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        translate: tengah ? `-50% calc(-50% + ${((1 - p) * dy).toFixed(1)}px)` : `0 ${((1 - p) * dy).toFixed(1)}px`,
        opacity: o,
        filter: p < 1 ? `blur(${((1 - p) * 8).toFixed(2)}px)` : undefined,
        ...gaya,
      }}
    >
      {children}
    </div>
  );
};

/** Pop pegas overshoot dengan posisi tengah. */
export const PopT: React.FC<{ m: number; x: number; y: number; children: React.ReactNode; k?: number; damping?: number }> = ({ m, x, y, children, k, damping = 10 }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < m) return null;
  const s = pegas(t, m, fps, { damping, stiffness: 190, mass: 0.6 });
  const q = k === undefined ? 0 : maju(t, k, k + 0.18, EASE.keluar);
  if (q >= 1) return null;
  return <div style={{ position: 'absolute', left: x, top: y, translate: '-50% -50%', scale: String(Math.max(0, s * (1 - q * 0.4))), opacity: Math.min(1, (t - m) / 0.05) * (1 - q) }}>{children}</div>;
};

/** Ngambang pelan (idle). */
export const Ambang: React.FC<{ seed: string; kuat?: number; children: React.ReactNode }> = ({ seed, kuat = 1, children }) => {
  const t = useDetik();
  return (
    <div style={{ position: 'absolute', inset: 0, translate: `${(noise(`${seed}x`, t * 0.5) * 5 * kuat).toFixed(2)}px ${(Math.sin(t * 2.1 + seed.length) * 5 * kuat).toFixed(2)}px`, rotate: `${(noise(`${seed}r`, t * 0.4) * 0.8 * kuat).toFixed(2)}deg` }}>
      {children}
    </div>
  );
};

/** Batang (bar) yang tumbuh + angka jalan yang DIIKAT ke panjang batangnya. */
export const Batang: React.FC<{
  x: number; y: number; panjang: number; tebal: number; nilai: number; maks: number; m: number; lama?: number; label: string;
  warna?: string; desimal?: number; satuan?: string; tegak?: boolean; ukuranAngka?: number; ukuranLabel?: number; redup?: number; tampil?: number;
}> = ({ x, y, panjang, tebal, nilai, maks, m, lama = 1.1, label, warna = KD.amber, desimal = 0, satuan = '%', tegak, ukuranAngka = 46, ukuranLabel = 24, redup = 0, tampil }) => {
  const t = useDetik();
  const p = maju(t, m, m + lama, EASE.kamera);
  const m0 = Math.min(m, tampil ?? m);
  const o = maju(t, m0 - 0.15, m0 + 0.1);
  if (o <= 0) return null;
  const L = (panjang * nilai * p) / maks;
  const angka = <AngkaJalan dari={0} ke={nilai} progress={p} desimal={desimal} belakang={satuan} gaya={{ fontFamily: ANTON, fontSize: ukuranAngka, color: warna, lineHeight: 1 }} />;
  if (tegak) {
    return (
      <div style={{ position: 'absolute', left: x, top: 0, opacity: o * (1 - redup * 0.6) }}>
        <div style={{ position: 'absolute', left: 0, top: y - L, width: tebal, height: L, borderRadius: '8px 8px 0 0', background: warna, boxShadow: `0 0 24px ${warna}55` }} />
        <div style={{ position: 'absolute', left: tebal / 2, top: y - L - ukuranAngka - 10, translate: '-50% 0', whiteSpace: 'nowrap' }}>{angka}</div>
        <div style={{ position: 'absolute', left: tebal / 2, top: y + 10, translate: '-50% 0', fontFamily: INTER, fontWeight: 800, fontSize: ukuranLabel, color: KD.tulang, whiteSpace: 'nowrap', textAlign: 'center' }}>{label}</div>
      </div>
    );
  }
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity: o * (1 - redup * 0.6) }}>
      <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: ukuranLabel, color: KD.tulang, whiteSpace: 'nowrap', marginBottom: 8 }}>{label}</div>
      <div style={{ position: 'relative', height: tebal }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: panjang, height: tebal, borderRadius: tebal / 2, background: 'rgba(239,235,226,0.08)' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: Math.max(tebal * 0.2, L), height: tebal, borderRadius: tebal / 2, background: warna, boxShadow: `0 0 22px ${warna}55` }} />
        <div style={{ position: 'absolute', left: Math.max(tebal * 0.2, L) + 16, top: tebal / 2, translate: '0 -50%', whiteSpace: 'nowrap' }}>{angka}</div>
      </div>
    </div>
  );
};

/** Cincin progres + angka persen di tengah (angka diikat ke sapuan cincin). */
export const Cincin: React.FC<{ x: number; y: number; r: number; nilai: number; m: number; lama?: number; warna?: string; tebal?: number; ukuran?: number; bawah?: string; desimal?: number }> = ({
  x, y, r, nilai, m, lama = 1.3, warna = KD.amber, tebal = 26, ukuran, bawah, desimal = 0,
}) => {
  const t = useDetik();
  const p = maju(t, m, m + lama, EASE.kamera);
  const o = maju(t, m - 0.2, m + 0.05);
  if (o <= 0) return null;
  const L = 2 * Math.PI * r;
  return (
    <div style={{ position: 'absolute', left: x - r - tebal, top: y - r - tebal, width: (r + tebal) * 2, height: (r + tebal) * 2, opacity: o }}>
      <svg width={(r + tebal) * 2} height={(r + tebal) * 2} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <circle cx={r + tebal} cy={r + tebal} r={r} fill="none" stroke="rgba(239,235,226,0.1)" strokeWidth={tebal} />
        <circle
          cx={r + tebal}
          cy={r + tebal}
          r={r}
          fill="none"
          stroke={warna}
          strokeWidth={tebal}
          strokeLinecap="round"
          strokeDasharray={`${L} ${L}`}
          strokeDashoffset={L * (1 - (nilai / 100) * p)}
          transform={`rotate(-90 ${r + tebal} ${r + tebal})`}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <AngkaJalan dari={0} ke={nilai} progress={p} desimal={desimal} belakang="%" gaya={{ fontFamily: ANTON, fontSize: ukuran ?? r * 0.62, color: KD.tulang, lineHeight: 1 }} />
        {bawah ? <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: Math.max(20, r * 0.17), color: KD.abu, marginTop: 6, whiteSpace: 'nowrap' }}>{bawah}</div> : null}
      </div>
    </div>
  );
};

/** Piktogram orang (kepala + badan), warna bisa diganti. */
export const Orang: React.FC<{ x: number; y: number; s?: number; warna?: string; o?: number }> = ({ x, y, s = 1, warna = KD.abu, o = 1 }) => (
  <svg style={{ position: 'absolute', left: x - 20 * s, top: y - 26 * s, overflow: 'visible', opacity: o }} width={40 * s} height={60 * s} viewBox="0 0 40 60">
    <circle cx={20} cy={12} r={10} fill={warna} />
    <path d="M 2 58 Q 2 26 20 26 Q 38 26 38 58 Z" fill={warna} />
  </svg>
);

/** Kertas dokumen (krem) miring dikit. */
export const Kertas: React.FC<{ x: number; y: number; w: number; h?: number; rot?: number; children: React.ReactNode; tengah?: boolean }> = ({ x, y, w, h, rot = -1.5, children, tengah = true }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      translate: tengah ? '-50% -50%' : undefined,
      rotate: `${rot}deg`,
      padding: '24px 30px',
      borderRadius: 6,
      background: '#e9e2d3',
      boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
      color: KD.latar,
      boxSizing: 'border-box',
    }}
  >
    {children}
  </div>
);
export const LABEL_KERTAS: React.CSSProperties = { fontFamily: INTER, fontWeight: 700, fontSize: 20, letterSpacing: '0.14em', color: '#6b6457' };
export const JUDUL_KERTAS: React.CSSProperties = { fontFamily: ANTON, fontSize: 50, lineHeight: 1.08, color: KD.latar };

/** Tanda kecil teks (mono) di pojok adegan. */
export const Tag: React.FC<{ x: number; y: number; teks: string; o?: number; warna?: string }> = ({ x, y, teks, o = 1, warna = KD.abu }) =>
  o <= 0 ? null : (
    <div style={{ position: 'absolute', left: x, top: y, opacity: o, fontFamily: MONO, fontWeight: 700, fontSize: 20, color: warna, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{teks}</div>
  );

// ======================================================================================================
/** Klip timeline: label pendek per kalimat (diegetik: nama klip di lajur V1). */
const IsiKlip: React.FC<{ k: KlipKD; w: number; h: number }> = ({ k, w }) => (
  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #2a2119 0%, #1d1813 100%)', display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', overflow: 'hidden' }}>
    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 15, color: KD.amber, flexShrink: 0 }}>{k.id}</div>
    {w > 70 ? <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 16, color: 'rgba(239,235,226,0.82)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'clip' }}>{k.data}</div> : null}
  </div>
);

/** Lajur A1: blok kata VO (tinggi ngikut "energi" palsu yang stabil per kata). */
const LajurVO: React.FC<{ kata: Kata[]; P: number; o: number }> = ({ kata: daftar, P, o }) => {
  if (o <= 0) return null;
  const xDari = (s: number) => X0 + (s - P) * PXS;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      <div style={{ position: 'absolute', left: 40, top: AY, width: 1000, height: AH, borderRadius: 8, background: KD.lajur, border: `2px solid ${KD.garis}` }} />
      <div style={{ position: 'absolute', left: 40, top: AY, width: 1000, height: AH, overflow: 'hidden' }}>
        {daftar.map((w, i) => {
          const xa = xDari(w.mulai) - 40;
          const xb = xDari(w.akhir) - 40;
          if (xb < -4 || xa > 1004) return null;
          const tinggi = 10 + 14 * (0.5 + 0.5 * noise(`vo${i}`, 1.7));
          const aktif = P >= w.mulai && P < w.akhir;
          return <div key={i} style={{ position: 'absolute', left: xa, top: (AH - tinggi) / 2, width: Math.max(2, xb - xa - 2), height: tinggi, borderRadius: 3, background: aktif ? KD.tulang : 'rgba(255,180,84,0.55)' }} />;
        })}
      </div>
      <div style={{ position: 'absolute', left: 48, top: AY + 8, fontFamily: INTER, fontWeight: 800, fontSize: 14, letterSpacing: '0.1em', color: KD.abu, padding: '0 6px', background: KD.lajur }}>A1 · VO</div>
    </div>
  );
};

// ======================================================================================================
export type SetelanPanggung = {
  d: DataKD;
  T: WaktuDasar;
  folder: string;
  /** label klip timeline per kalimat */
  labelKlip: string[];
  /** isi monitor (semua Babak) */
  monitor: React.ReactNode;
  /** isi monitor adegan pembuka (diputar ulang pas loop di ujung) */
  pembuka: React.ReactNode;
  hud: React.ReactNode;
  sumber: (t: number) => string;
  sfx: Sfx[];
  getar?: Getar[];
  /** lapisan dunia tambahan di atas monitor (chip yang nempel ke monitor, dll) */
  duniaAtas?: React.ReactNode;
  tagMonitor?: (t: number) => string;
  bgmVol?: number;
};

export const Panggung: React.FC<SetelanPanggung> = ({ d, T, folder, labelKlip, monitor, pembuka, hud, sumber, sfx, getar = [], duniaAtas, tagMonitor, bgmVol = 0.85 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { total, s, keHp, pulang, loop } = T;
  // kamera: tiap kalimat dorong pelan ke monitor (linear), balik halus di awal kalimat berikutnya (napas per ketukan)
  const kunci: KunciKamera[] = [{ t: 0, x: 540, y: 960, z: 1 }];
  s.forEach((k, i) => {
    if (i === s.length - 1) return;
    const ujung = s[i + 1].mulai;
    const dorong = i % 2 === 0 ? { x: 540, y: 930, z: 1.035 } : { x: 540, y: 946, z: 1.022 };
    kunci.push({ t: k.mulai + 0.5, x: 540, y: 960, z: 1 });
    kunci.push({ t: ujung - 0.15, ...dorong, ease: EASE.linear });
  });
  kunci.push({ t: keHp + 0.6, x: 540, y: 960, z: 1 });
  kunci.push({ t: pulang, x: 540, y: 960, z: 1.012, ease: EASE.linear });
  kunci.push({ t: loop, x: 540, y: 960, z: 1 });
  kunci.push({ t: total + 1, x: 540, y: 960, z: 1 });
  const kam = kameraKD(kunci, t, fps, total, getar);
  const hp = maju(t, keHp + 0.05, keHp + 0.75, EASE.kamera) * (1 - maju(t, pulang, loop - 0.05, EASE.kamera));
  const box = lerpKotak(MON, HPK, hp);
  const oTrack = Math.min(1, 1 - maju(t, keHp, keHp + 0.45, EASE.keluar) + maju(t, pulang + 0.1, loop - 0.1, EASE.masuk));
  const yTrack = (1 - oTrack) * 120;
  const P = t * (1 - maju(t, keHp + 0.6, keHp + 1.4, EASE.kamera));
  const klip: KlipKD[] = s.map((k, i) => ({ mulai: (i === 0 ? -20 : k.mulai) * 1000, akhir: (i < s.length - 1 ? s[i + 1].mulai : total + 20) * 1000, id: String(i + 1).padStart(2, '0'), data: labelKlip[i] ?? '' }));
  const oSumber = maju(t, 1.2, 1.5) * (1 - hp) * (1 - maju(t, keHp - 0.3, keHp));
  const fPulang = Math.round(pulang * fps);
  return (
    <AbsoluteFill style={{ background: KD.latar, color: KD.tulang, overflow: 'hidden', fontFamily: INTER }}>
      <LatarKD kam={kam} />
      <Dunia kamera={kam} tinggiDunia={1920} lebarDunia={1080} blurGerak={1400}>
        <RangkaLayar k={box} hp={hp} tag={tagMonitor ? tagMonitor(t) : 'PROGRAM'} timecode={hp < 0.5 ? kodeWaktu(P) : undefined}>
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {t < pulang + 0.2 ? monitor : null}
            {t >= pulang ? (
              <Sequence from={fPulang} layout="none">
                <div style={{ position: 'absolute', inset: 0, opacity: maju(t, pulang + 0.1, loop - 0.15) }}>{pembuka}</div>
              </Sequence>
            ) : null}
            <HpCta T={T} W={box.w - 6} H={box.h - 6} hp={hp} />
          </div>
        </RangkaLayar>
        <SumberKD x={MON.x + 4} y={MON.y + MON.h + 10} teks={sumber(t)} o={oSumber} />
        {duniaAtas}
        <div style={{ position: 'absolute', left: 0, top: 0, translate: `0 ${yTrack.toFixed(1)}px` }}>
          <TrackKD klip={klip} P={P * 1000} pxms={PXS / 1000} x0={X0} y={TY} h={TH} frameMs={1000} labelGrid={0} isiKlip={(k, w, h) => <IsiKlip k={k} w={w} h={h} />} o={oTrack} />
          <LajurVO kata={d.kata} P={P} o={oTrack} />
          <div style={{ position: 'absolute', left: 48, top: TY - 30, fontFamily: INTER, fontWeight: 800, fontSize: 15, letterSpacing: '0.1em', color: KD.abu, opacity: 0.9 * oTrack }}>V1 · ADEGAN</div>
          <PlayheadKD x={X0} y={TY} h={AY + AH - TY} o={oTrack} />
        </div>
      </Dunia>
      <PeneduhAtas kuat={0.5} />
      {hud}
      <Subtitle
        kata={d.kata}
        kalimat={d.kalimat}
        font={INTER}
        tebal={700}
        ukuran={44}
        maksHuruf={34}
        sorot={KD.amber}
        pita="rgba(11,11,14,0.62)"
        sampai={loop - 0.4}
        zona={[{ dari: 0, x: 540, y: 1346, lebar: 960 }, { dari: keHp + 0.3, x: 540, y: 1436, lebar: 960 }, { dari: pulang, x: 540, y: 1346, lebar: 960 }]}
      />
      <TeksturKD />
      <></>
    </AbsoluteFill>
  );
};

const kodeWaktu = (detik: number) => {
  const f = Math.max(0, Math.floor(detik * 30));
  return `${String(Math.floor(f / 1800)).padStart(2, '0')}:${String(Math.floor(f / 30) % 60).padStart(2, '0')}:${String(f % 30).padStart(2, '0')}`;
};

const HpCta: React.FC<{ T: WaktuDasar; W: number; H: number; hp: number }> = ({ T, W, H, hp }) => {
  const t = useDetik();
  const o = maju(hp, 0.55, 0.95, EASE.linear);
  if (o <= 0) return null;
  const S = T.s[T.n - 1];
  const simpan = T.k('simpan', T.n - 1, 0.1);
  const follow = T.ks('follow', simpan, S.akhir - 1.6);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, background: '#08080a' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - maju(t, T.pulang - 0.15, T.pulang + 0.1) }}>
        <CtaKD x={W / 2} y={H / 2 + 40} simpan={simpan + 0.15} follow={follow} logo={follow + 0.45} keluar={T.pulang + 0.2} skala={1.08} />
      </div>
    </div>
  );
};

/** SFX dasar seri: sapuan playhead tiap ganti adegan + CTA. */
function sfxDasar(T: WaktuDasar): Sfx[] {
  const simpan = T.k('simpan', T.n - 1, 0.1);
  const follow = T.ks('follow', simpan, T.s[T.n - 1].akhir - 1.6);
  return [
    bunyi('whooshPop', 0.12, 0.28),
    ...T.s.slice(1, -1).map((k) => bunyi('swish', k.mulai - 0.05, 0.2)),
    bunyi('whooshTerang', T.keHp + 0.1, 0.3),
    bunyi('whooshPop', simpan + 0.15, 0.3),
    bunyi('kunci', simpan + 0.47, 0.4),
    bunyi('klik', follow + 0.3, 0.45),
    bunyi('whooshLembut', T.pulang, 0.3),
  ];
}

/** Dark overlay + SlateKD dipakai di dalam monitor (sumber/riset). */
export const latarSlate = (o: number) => (o > 0 ? <div style={{ position: 'absolute', inset: 0, background: `rgba(14,13,16,${(0.92 * o).toFixed(3)})` }} /> : null);

/** Orang lari/jalan (piktogram garis) — fase 0..1 satu siklus langkah. Pinggul di (x, y). */
export const Figur: React.FC<{ x: number; y: number; s?: number; fase: number; warna?: string; tebal?: number; lari?: number }> = ({ x, y, s = 1, fase, warna = KD.tulang, tebal = 11, lari = 1 }) => {
  const r = Math.PI / 180;
  const a = Math.sin(fase * 2 * Math.PI);
  const seg = (x0: number, y0: number, g1: number, l1: number, g2: number, l2: number) => {
    const x1 = x0 + Math.sin(g1 * r) * l1;
    const y1 = y0 + Math.cos(g1 * r) * l1;
    return `M ${x0.toFixed(1)} ${y0.toFixed(1)} L ${x1.toFixed(1)} ${y1.toFixed(1)} L ${(x1 + Math.sin(g2 * r) * l2).toFixed(1)} ${(y1 + Math.cos(g2 * r) * l2).toFixed(1)}`;
  };
  const kaki = (b: number) => seg(0, 0, b * 38 * lari, 44, b * 38 * lari - (b < 0 ? 60 * -b * lari : 8), 42);
  const bahuX = 8 * lari;
  const tangan = (b: number) => seg(bahuX, -62, -b * 42 * lari, 30, -b * 42 * lari + 85 * lari, 28);
  const bob = Math.abs(Math.cos(fase * 2 * Math.PI)) * 5 * lari;
  return (
    <svg style={{ position: 'absolute', left: x - 70 * s, top: y - 120 * s, overflow: 'visible' }} width={140 * s} height={220 * s} viewBox="-70 -120 140 220">
      <g transform={`translate(0 ${-bob})`} stroke={warna} strokeWidth={tebal} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d={kaki(-a)} opacity={0.75} />
        <path d={tangan(a)} opacity={0.75} />
        <path d={`M 0 0 L ${bahuX} -62`} />
        <circle cx={bahuX + 4} cy={-86} r={15} fill={warna} stroke="none" />
        <path d={kaki(a)} />
        <path d={tangan(-a)} />
      </g>
    </svg>
  );
};
