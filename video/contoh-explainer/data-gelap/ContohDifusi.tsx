// Frame hero (pembuka, tengah, puncak): 15, 602, 1003.
// contoh Shorts explainer (akun generik, konten contoh): "Gambar AI dimulai dari noise acak". 9:16, ±42 dtk.
// SATU OBJEK UTAMA: kanvas gambar di tengah + SATU ANGKA: penghitung langkah (0 → 1.000 pas latihan, 1.000 → 0 pas bikin
// gambar, diikat ke level noise kanvas). Alur: gambar AI → larut jadi noise → TV rusak → (latihan) foto dikasih noise bertahap
// → 4 panel "tebak noise" → dibalik: noise dibersihin bertahap, bentuk → warna → detail → prompt jadi petunjuk → 3 noise beda
// = 3 gambar beda → balik ke gambar pertama (loop).
// Fakta: HF Annotated Diffusion (DDPM, Ho dkk. 2020, T = 1.000) & HF Stable Diffusion 2022 (teks ngarahin lewat cross-attention,
// seed beda = gambar beda). Gambar: fal flux schnell, prompt sama, seed 11 / 2024 / 777; foto sepeda = contoh data latihan.
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  AngkaJalan, Bunyi, Dunia, EASE, GarisDigambar, Grain, hitungKamera, Kabut, kata, KataMuncul, maju, noise, pathPanah, pegas, Pop, SapuSorot,
  Subtitle, useDetik, type Kamera, type Kata, type KataLayar, type KunciKamera,
} from "../../src/gerak";
import { MONO, SAIRA, TANGAN } from "../../src/gerak/font";
import { bunyi, K } from "./raja/gaya";
import type { Kalimat } from "./raja/waktuRaja";
import { KanvasDifusi } from "./diffusion/KanvasDifusi";

export type DataDif = { durasi: number; kata: Kata[]; kalimat?: Kalimat[] };

const LW = 1080;
const LH = 1920;
const CX = 540;
const CY = 950;
const UK = 720;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// ======================================================================================================
function waktuDif(d: Kata[], total: number, kal: Kalimat[] = []) {
  const CAD: [number, number][] = [[0.18, 5.56], [5.92, 12.44], [12.78, 16.82], [17.38, 23.0], [23.4, 27.18], [27.54, 30.9], [31.24, 35.4], [35.84, 41.3]];
  const s = CAD.map((c, i) => ({ mulai: kal[i]?.mulai ?? c[0], akhir: kal[i]?.akhir ?? c[1] }));
  const k = (c: string, setelah = 0, cad = 0) => kata(d, c, setelah, cad);
  const awalnya = k('awalnya', s[0].mulai, 2.48);
  const acak1 = k('acak', awalnya, 3.62);
  const mirip = k('mirip', acak1, 4.24);
  const rusak1 = k('rusak', mirip, 5.06);
  const kebalikan = k('kebalikannya', s[1].mulai, 7.76);
  const asli = k('asli', kebalikan, 9.16);
  const dikasih = k('dikasih', asli, 9.7);
  const total2 = k('total', dikasih, 12.08);
  const langkah3 = k('langkah', s[2].mulai, 13.14);
  const nebak3 = k('nebak', langkah3, 14.74);
  const ditambahin = k('ditambahin', nebak3, 16.18);
  const dibalik = k('dibalik', s[3].mulai, 18.8);
  const mulai4 = k('mulai', dibalik, 19.52);
  const ngebuang = k('ngebuang', mulai4, 21.22);
  const th2020 = k('2020', s[4].mulai, 24.36);
  const dipecah = k('dipecah', th2020, 25.72);
  const seribu = k('seribu', dipecah, 26.34);
  const bentuk = k('bentuk', s[5].mulai, 28.72);
  const warna = k('warna', bentuk, 29.5);
  const detail = k('detail', warna, 30.34);
  const ketik = k('ketik', s[6].mulai, 31.92);
  const petunjuk = k('petunjuk', ketik, 32.7);
  const dirapihin = k('dirapihin', petunjuk, 34.2);
  const apa = k('apa', dirapihin, 35.1);
  const titik8 = k('titik', s[7].mulai, 36.12);
  const bedabeda = k('beda-beda', titik8, 37.4);
  const kalimat8 = k('kalimat', bedabeda, 38.32);
  const sama = k('sama', kalimat8, 38.88);
  const ngasilin = k('ngasilin', sama, 39.64);
  const beda8 = k('beda', ngasilin, 40.38);
  const kali8 = k('kali', beda8, 40.94);
  return {
    total, s, awalnya, acak1, mirip, rusak1, kebalikan, asli, dikasih, total2, langkah3, nebak3, ditambahin, dibalik, mulai4, ngebuang,
    th2020, dipecah, seribu, bentuk, warna, detail, ketik, petunjuk, dirapihin, apa, titik8, bedabeda, kalimat8, sama, ngasilin, beda8, kali8,
    pulang: Math.max(kali8 + 0.45, total - 0.95),
    loop: total - 0.25,
  };
}
type WaktuD = ReturnType<typeof waktuDif>;

// level noise kanvas utama per waktu --------------------------------------------------------------------
/** langkah diskrit: dari a ke b dalam n langkah kecil (tiap langkah ease 0,1 dtk) */
function bertangga(t: number, a: number, b: number, n: number, dari: number, ke: number) {
  if (t <= a) return dari;
  if (t >= b) return ke;
  const d = (b - a) / n;
  const i = Math.floor((t - a) / d);
  const f = maju(t - a - i * d, 0, Math.min(0.1, d * 0.6), EASE.kamera);
  return lerp(dari, ke, Math.min(1, (i + f) / n));
}
/** level kanvas kucing (S1, S4–S7) */
function levelUtama(t: number, T: WaktuD) {
  const S = T.s;
  if (t < S[1].mulai) {
    const kedip = 0.2 * Math.sin(Math.PI * maju(t, 0.45, 0.95, EASE.linear));
    return Math.max(kedip, maju(t, T.awalnya - 0.1, T.acak1 + 0.35, EASE.kamera));
  }
  if (t < S[6].mulai) {
    // S4–S6: 1 → 0, bertangga ±0,23 dtk per langkah
    if (t < T.ngebuang) return 1;
    if (t < T.seribu + 0.6) return bertangga(t, T.ngebuang, T.seribu + 0.6, 22, 1, 0.66);
    return bertangga(t, T.seribu + 0.6, T.detail + 0.3, 14, 0.66, 0);
  }
  if (t < S[7].mulai) {
    // S7: dikasih noise lagi (cepat) → dirapihin lagi sesuai petunjuk
    const naik = maju(t, S[6].mulai + 0.05, S[6].mulai + 0.6, EASE.kamera);
    return naik >= 1 ? 1 - bertangga(t, T.petunjuk + 0.75, T.apa + 0.2, 12, 0, 1) : naik;
  }
  // S8
  const naik = maju(t, S[7].mulai, S[7].mulai + 0.5, EASE.kamera);
  return naik >= 1 ? 1 - bertangga(t, T.ngasilin - 0.15, T.beda8 + 0.35, 12, 0, 1) : naik;
}
function levelLatih(t: number, T: WaktuD) {
  return bertangga(t, T.dikasih - 0.05, T.total2 + 0.15, 10, 0, 1);
}

// ======================================================================================================
const LABEL: React.CSSProperties = { fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: K.abu };
const JUDUL: React.CSSProperties = { fontFamily: SAIRA, fontWeight: 800, fontSize: 104, lineHeight: 1.0, color: K.tinta, columnGap: '0.22em', rowGap: '0.06em' };

const Teks: React.FC<{ label: (KataLayar | string)[]; lMulai: number; judul?: (KataLayar | string)[]; jMulai?: number; keluar: number; catatan?: string; cMulai?: number }> = ({ label, lMulai, judul, jMulai = 0, keluar, catatan, cMulai = 0 }) => {
  const t = useDetik();
  if (t < lMulai - 0.2 || t > keluar + 0.4) return null;
  const oc = catatan ? maju(t, cMulai, cMulai + 0.25) * (1 - maju(t, keluar, keluar + 0.2)) : 0;
  return (
    <>
      <div style={{ position: 'absolute', left: 90, top: 196, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 8, height: 40, borderRadius: 4, background: K.teal, opacity: maju(t, lMulai - 0.05, lMulai + 0.1) * (1 - maju(t, keluar, keluar + 0.2)) }} />
        <KataMuncul mulai={lMulai} keluar={keluar} jeda={0.06} gaya={LABEL} kata={label} />
      </div>
      {judul ? (
        <div style={{ position: 'absolute', left: 90, top: 250, width: 900 }}>
          <KataMuncul mulai={jMulai} keluar={keluar + 0.02} jeda={0.05} lama={0.2} gaya={JUDUL} kata={judul} />
        </div>
      ) : null}
      {oc > 0 ? <div style={{ position: 'absolute', left: 90, top: judul && judul.length > 3 ? 470 : 372, fontFamily: MONO, fontWeight: 500, fontSize: 28, color: K.abu, opacity: oc }}>{catatan}</div> : null}
    </>
  );
};
const sorot = (teks: string, mulai: number, warna = K.kuning) => (
  <SapuSorot mulai={mulai} lama={0.24} warna={warna} warnaTeks={[K.tinta, K.latar]} penuh>
    {teks}
  </SapuSorot>
);

const Chip: React.FC<{ x: number; y: number; teks: React.ReactNode; warna?: string; o?: number; skala?: number }> = ({ x, y, teks, warna = K.teal, o = 1, skala = 1 }) => (
  <div style={{ position: 'absolute', left: x, top: y, translate: '-50% -50%', scale: String(skala), opacity: o, padding: '6px 18px', borderRadius: 12, background: K.latar, border: `3px solid ${warna}`, fontFamily: MONO, fontWeight: 800, fontSize: 30, color: warna, whiteSpace: 'nowrap' }}>{teks}</div>
);

// ======================================================================================================
export const ContohDifusi: React.FC<DataDif> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuDif(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const S = T.s;
  const pelan = Easing.inOut(Easing.sin);
  const kunci: KunciKamera[] = [
    { t: 0, x: CX, y: 960, z: 1.0 },
    { t: S[1].mulai - 0.3, x: CX, y: 960, z: 1.04, ease: pelan },
    { t: S[1].mulai + 0.5, x: CX, y: 960, z: 1.0 },
    { t: S[2].mulai - 0.2, x: CX, y: 950, z: 1.05, ease: pelan },
    { t: S[2].mulai + 0.4, x: CX, y: 960, z: 1.0 },
    { t: S[3].mulai, x: CX, y: 960, z: 1.02, ease: pelan },
    { t: S[5].mulai, x: CX, y: 960, z: 1.06, ease: pelan },
    { t: T.detail + 0.35, x: CX + 30, y: CY - 20, z: 1.22 },
    { t: S[6].mulai + 0.2, x: CX, y: 960, z: 1.0 },
    { t: S[7].mulai, x: CX, y: 960, z: 1.03, ease: pelan },
    { t: S[7].mulai + 0.5, x: CX, y: 960, z: 1.0 },
    { t: T.pulang, x: CX, y: 960, z: 1.02, ease: pelan },
    { t: T.loop, x: CX, y: 960, z: 1.0 },
    { t: total + 1, x: CX, y: 960, z: 1.0 },
  ];
  const kam: Kamera = hitungKamera(kunci, t, fps, { lebar: LW, tinggi: LH, drift: 2, getar: [{ t: S[1].mulai + 0.2, kuat: 6 }, { t: T.ditambahin + 0.1, kuat: 5 }, { t: T.detail + 0.05, kuat: 6 }, { t: T.beda8 + 0.3, kuat: 6 }] });
  return (
    <AbsoluteFill style={{ background: K.latar, color: K.tinta, overflow: 'hidden', fontFamily: SAIRA }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${50 + noise('lt', t * 0.08) * 8}% 48%, ${K.latar2} 0%, ${K.latar} 72%)` }} />
      <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(110,150,200,0.06) 2px, transparent 2px), linear-gradient(90deg, rgba(110,150,200,0.06) 2px, transparent 2px)', backgroundSize: '120px 120px', backgroundPosition: `${(-t * 6) % 120}px ${(-t * 10) % 120}px` }} />
      <Kabut />
      <Dunia kamera={kam} tinggiDunia={LH} lebarDunia={LW} blurGerak={null}>
        <AdeganTV T={T} />
        <AdeganLatih T={T} />
        <AdeganTebak T={T} />
        <AdeganUtama T={T} />
        <AdeganTiga T={T} />
        <Penghitung T={T} />
      </Dunia>
      <HudDif T={T} />
      <Subtitle kata={d.kata} kalimat={d.kalimat} font={SAIRA} tebal={700} ukuran={48} maksHuruf={30} sorot={K.kuning} sampai={T.kali8 + 0.5} zona={[{ dari: 0, x: 510, y: 1352, lebar: 820 }]} />
      <Grain kuat={0.07} garisScan={0} vinyet={0.5} warnaVinyet="2,5,14" />
      <></>
    </AbsoluteFill>
  );
};

// ======================================================================================================
// S1: gambar AI → larut jadi noise → layar TV rusak (bezel digambar) → TV mati (S2)
const AdeganTV: React.FC<{ T: WaktuD }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t > S[1].mulai + 0.4) return null;
  const lv = levelUtama(t, T);
  const tvMati = maju(t, S[1].mulai - 0.12, S[1].mulai + 0.12, EASE.jatuh);
  const tvMati2 = maju(t, S[1].mulai + 0.12, S[1].mulai + 0.3, EASE.jatuh);
  const kedip = t > T.acak1 + 0.35;
  const b = { x: CX - UK / 2 - 34, y: CY - UK / 2 - 34, w: UK + 68, h: UK + 68 };
  return (
    <>
      {/* bezel TV digambar pas "mirip layar TV" */}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - tvMati2 }} width={1} height={1}>
        {t > T.mirip - 0.1 ? <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={56} fill="#111a2e" opacity={maju(t, T.mirip, T.mirip + 0.3)} /> : null}
        <GarisDigambar d={`M ${b.x + 56} ${b.y} H ${b.x + b.w - 56} Q ${b.x + b.w} ${b.y} ${b.x + b.w} ${b.y + 56} V ${b.y + b.h - 56} Q ${b.x + b.w} ${b.y + b.h} ${b.x + b.w - 56} ${b.y + b.h} H ${b.x + 56} Q ${b.x} ${b.y + b.h} ${b.x} ${b.y + b.h - 56} V ${b.y + 56} Q ${b.x} ${b.y} ${b.x + 56} ${b.y} Z`} mulai={T.mirip - 0.05} lama={0.4} warna={K.tinta} tebal={10} />
        <GarisDigambar d={`M ${CX - 40} ${b.y - 4} L ${CX - 150} ${b.y - 150}`} mulai={T.mirip + 0.3} lama={0.18} warna={K.tinta} tebal={9} />
        <GarisDigambar d={`M ${CX + 40} ${b.y - 4} L ${CX + 140} ${b.y - 130}`} mulai={T.mirip + 0.38} lama={0.18} warna={K.tinta} tebal={9} />
      </svg>
      <div style={{ position: 'absolute', left: CX - UK / 2, top: CY - UK / 2, width: UK, height: UK, borderRadius: 26, overflow: 'hidden', scale: `${1 - tvMati2 * 0.995} ${Math.max(0.006, 1 - tvMati)}`, boxShadow: tvMati > 0 ? `0 0 ${60 * tvMati}px ${K.tinta}` : '0 30px 80px rgba(0,0,0,0.5)', filter: tvMati > 0.6 ? `brightness(${1 + tvMati * 3})` : undefined }}>
        {/* zoom pelan (Ken Burns) biar hook gak beku sebelum gambarnya larut */}
        <div style={{ scale: String(1 + 0.14 * maju(t, 0, T.acak1 + 0.4, EASE.linear)), translate: `0 ${(-26 * maju(t, 0, T.acak1 + 0.4, EASE.linear)).toFixed(1)}px`, transformOrigin: '50% 40%' }}>
          <KanvasDifusi src="diffusion/kucing-1.svg" ukuran={UK} level={lv} seed="tv" kedip={kedip} />
        </div>
        {t > T.mirip - 0.1 ? <div style={{ position: 'absolute', inset: 0, opacity: maju(t, T.mirip, T.mirip + 0.3) * 0.55, backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0 2px, transparent 2px 6px)', backgroundPosition: `0 ${(t * 120) % 6}px` }} /> : null}
      </div>
    </>
  );
};

// S2: latihan — foto asli dikasih noise bertahap sampai rusak total (TV nyala lagi: kanvas tumbuh dari garis)
const AdeganLatih: React.FC<{ T: WaktuD }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[1].mulai + 0.15 || t > S[2].mulai + 0.6) return null;
  const nyala = maju(t, S[1].mulai + 0.2, S[1].mulai + 0.5, EASE.masuk);
  const nyala2 = maju(t, S[1].mulai + 0.4, S[1].mulai + 0.7, EASE.masuk);
  // S3: kanvas ini mengecil jadi panel kanan atas ("sesudah")
  const kecil = maju(t, S[2].mulai - 0.15, S[2].mulai + 0.4, EASE.kamera);
  const P = 330;
  const ke = { x: 570 + P / 2, y: 600 + P / 2 };
  const sk = lerp(1, P / UK, kecil);
  const x = lerp(CX, ke.x, kecil);
  const y = lerp(CY, ke.y, kecil);
  const lv = lerp(levelLatih(t, T), 0.52, kecil);
  // zoom pelan foto asli (biar gak beku pas nunggu langkah pertama)
  const kb = 1 + 0.06 * maju(t, S[1].mulai + 0.4, T.dikasih + 0.3, EASE.linear);
  return (
    <div style={{ position: 'absolute', left: x - UK / 2, top: y - UK / 2, width: UK, height: UK, borderRadius: 26 / sk, overflow: 'hidden', scale: `${Math.max(0.004, nyala2) * sk} ${Math.max(0.006, nyala) * sk}`, opacity: 1 - maju(t, S[2].mulai + 0.35, S[2].mulai + 0.6), boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
      <div style={{ scale: String(kb) }}>
        <KanvasDifusi src="diffusion/asli-sepeda.svg" ukuran={UK} level={lv} seed={`latih-${Math.round(lv * 20)}`} />
      </div>
    </div>
  );
};

// S3: tiap langkah AI nebak noise yang barusan ditambahin (2 × 2 panel)
const AdeganTebak: React.FC<{ T: WaktuD }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[2].mulai - 0.2 || t > S[3].mulai + 0.7) return null;
  const P = 330;
  const kiri = 180;
  const kanan = 570;
  const atas = 600;
  const bawah = 990;
  const keluar = maju(t, S[3].mulai - 0.1, S[3].mulai + 0.45, EASE.keluar);
  const m1 = maju(t, S[2].mulai + 0.2, S[2].mulai + 0.5, EASE.masuk);
  const m3 = maju(t, T.langkah3 + 0.3, T.langkah3 + 0.6, EASE.masuk);
  const m4 = maju(t, T.nebak3 - 0.1, T.nebak3 + 0.2, EASE.masuk);
  const cocok = maju(t, T.ditambahin - 0.05, T.ditambahin + 0.15);
  const panel = (x: number, y: number, isi: React.ReactNode, judul: string, o: number, warna: string) => (
    <div style={{ position: 'absolute', left: x, top: y, width: P, height: P, borderRadius: 18, overflow: 'hidden', opacity: o * (1 - keluar), scale: String(0.9 + 0.1 * o), border: `4px solid ${warna}` }}>
      {isi}
      <div style={{ position: 'absolute', left: 10, top: 10, padding: '2px 10px', borderRadius: 8, background: 'rgba(7,12,24,0.85)', fontFamily: MONO, fontWeight: 700, fontSize: 24, color: warna }}>{judul}</div>
    </div>
  );
  return (
    <>
      {panel(kiri, atas, <KanvasDifusi src="diffusion/asli-sepeda.svg" ukuran={P - 8} level={0.42} seed="latih" />, 'langkah 412', m1, K.abu)}
      {panel(kanan, atas, <KanvasDifusi src="diffusion/asli-sepeda.svg" ukuran={P - 8} level={0.52} seed="latih" />, 'langkah 413', maju(t, S[2].mulai + 0.3, S[2].mulai + 0.5), K.abu)}
      {panel(kiri, bawah, <KanvasDifusi ukuran={P - 8} level={1} seed="ditambah" />, 'noise asli', m3, K.teal)}
      {panel(kanan, bawah, <KanvasDifusi ukuran={P - 8} level={1} seed="ditambah" gaya={{ filter: 'blur(0.7px) contrast(0.92)' }} />, 'tebakan AI', m4, K.kuning)}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - keluar }} width={1} height={1}>
        <GarisDigambar d={pathPanah(kiri + P + 6, atas + P / 2, kanan - 8, atas + P / 2, -18, 20)} mulai={S[2].mulai + 0.45} lama={0.2} warna={K.tinta} tebal={6} />
        <GarisDigambar d={`M ${kanan + P / 2} ${atas + P + 8} L ${kiri + P / 2} ${bawah - 8}`} mulai={T.langkah3 + 0.2} lama={0.25} warna={K.teal} tebal={5} />
      </svg>
      <div style={{ position: 'absolute', left: kiri + P - 10, top: atas + P / 2 - 70, width: 80, textAlign: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 34, color: K.tinta, opacity: maju(t, S[2].mulai + 0.5, S[2].mulai + 0.7) * (1 - keluar) }}>+</div>
      <Pop mulai={T.ditambahin - 0.05} keluar={S[3].mulai - 0.1} gaya={{ position: 'absolute', left: kiri + P + 2, top: bawah + P / 2 - 50, width: 56, textAlign: 'center' }}>
        <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 90, lineHeight: 1, color: K.kuning }}>≈</div>
      </Pop>
      {cocok > 0 ? <Chip x={kanan + P / 2} y={bawah - 30} teks="✓ mirip" warna={K.kuning} o={cocok * (1 - keluar)} /> : null}
    </>
  );
};

// S4–S8 kanvas utama (kucing): dibalik, dibersihin bertahap, bentuk/warna/detail, prompt, lalu jadi slot 1 dari 3 (S8) & loop
const SLOT = [
  { x: 70 + 150, y: 840 },
  { x: 390 + 150, y: 840 },
  { x: 710 + 150, y: 840 },
];
const AdeganUtama: React.FC<{ T: WaktuD }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const awal = t < S[1].mulai + 0.4;
  if (t < S[3].mulai - 0.2 || awal) return null;
  const masuk = maju(t, S[3].mulai - 0.15, S[3].mulai + 0.35, EASE.masuk);
  // S8: ke slot 1, terus balik ke tengah buat loop
  const keSlot = maju(t, S[7].mulai + 0.05, S[7].mulai + 0.6, EASE.kamera) * (1 - maju(t, T.pulang, T.loop, EASE.kamera));
  const sk = lerp(1, 300 / UK, keSlot);
  const x = lerp(CX, SLOT[0].x, keSlot);
  const y = lerp(CY, SLOT[0].y, keSlot);
  const lv = levelUtama(t, T);
  const balik = pegas(t, T.dibalik, fps, { damping: 12, stiffness: 160, mass: 0.7 });
  // label bentuk/warna/detail nempel di sisi kanvas
  const lab = [
    { teks: 'bentuk', m: T.bentuk, y: CY - 240, sisi: -1 },
    { teks: 'warna', m: T.warna, y: CY, sisi: 1 },
    { teks: 'detail', m: T.detail, y: CY + 230, sisi: 1 },
  ];
  const keluarLab = maju(t, S[6].mulai - 0.2, S[6].mulai + 0.1, EASE.keluar);
  return (
    <>
      {/* ikon putar "dibalik": digambar terus muter sekali, nempel di kiri penghitung langkah */}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - maju(t, S[4].mulai - 0.2, S[4].mulai + 0.2) }} width={1} height={1}>
        <g transform={`rotate(${-360 * balik} ${CX - 300} ${CY - UK / 2 - 4})`}>
          <GarisDigambar d={`M ${CX - 300 + 46} ${CY - UK / 2 - 4} A 46 46 0 1 1 ${CX - 300} ${CY - UK / 2 - 50}`} mulai={T.dibalik - 0.1} lama={0.3} warna={K.kuning} tebal={10} />
          <GarisDigambar d={`M ${CX - 300 - 18} ${CY - UK / 2 - 68} L ${CX - 300 + 2} ${CY - UK / 2 - 50} L ${CX - 300 - 16} ${CY - UK / 2 - 30}`} mulai={T.dibalik + 0.15} lama={0.12} warna={K.kuning} tebal={10} />
        </g>
      </svg>
      <div style={{ position: 'absolute', left: x - UK / 2, top: y - UK / 2, width: UK, height: UK, borderRadius: 26 / sk, overflow: 'hidden', scale: String(sk * lerp(0.82, 1, masuk)), opacity: masuk, boxShadow: '0 30px 80px rgba(0,0,0,0.5)', border: keSlot > 0.05 ? `${4 / sk}px solid ${K.teal}` : undefined }}>
        <KanvasDifusi src="diffusion/kucing-1.svg" ukuran={UK} level={lv} seed={`balik-${Math.round(lv * 60)}`} kedip={lv > 0.999} />
      </div>
      {lab.map((l, i) => {
        const p = pegas(t, l.m - 0.05, fps, { damping: 11, stiffness: 200, mass: 0.6 });
        if (t < l.m - 0.05) return null;
        const xTepi = CX + l.sisi * (UK / 2);
        const xLab = CX + l.sisi * (UK / 2 - 70);
        return (
          <React.Fragment key={i}>
            <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - keluarLab }} width={1} height={1}>
              <GarisDigambar d={`M ${xTepi + l.sisi * 30} ${l.y} L ${xTepi - l.sisi * 66} ${l.y}`} mulai={l.m - 0.05} lama={0.15} warna={K.kuning} tebal={6} />
            </svg>
            <div style={{ position: 'absolute', left: xLab, top: l.y, translate: `${l.sisi < 0 ? '0' : '-100%'} -50%`, scale: String(p), transformOrigin: l.sisi < 0 ? '0 50%' : '100% 50%', opacity: 1 - keluarLab, padding: '6px 18px', borderRadius: 14, background: K.kuning, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 54 }}>
              {l.teks}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

// S8: 3 noise awal beda → prompt sama → 3 gambar beda
const AdeganTiga: React.FC<{ T: WaktuD }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[7].mulai + 0.1 || t > T.loop + 0.1) return null;
  const pergi = maju(t, T.pulang - 0.05, T.pulang + 0.45, EASE.keluar);
  const lv = levelUtama(t, T);
  return (
    <>
      {[1, 2].map((i) => {
        const m = maju(t, T.titik8 - 0.1 + i * 0.12, T.titik8 + 0.25 + i * 0.12, EASE.masuk);
        return (
          <div key={i} style={{ position: 'absolute', left: SLOT[i].x - 150 + pergi * 520, top: SLOT[i].y - 150, width: 300, height: 300, borderRadius: 16, overflow: 'hidden', opacity: m * (1 - pergi), scale: String(0.85 + 0.15 * m), border: `4px solid ${K.teal}` }}>
            <KanvasDifusi src={`diffusion/kucing-${i + 1}.svg`} ukuran={292} level={lv} seed={`benih${i}-${Math.round(lv * 30)}`} kedip={lv > 0.999} />
          </div>
        );
      })}
      {SLOT.map((s, i) => {
        const o = maju(t, T.bedabeda - 0.1 + i * 0.1, T.bedabeda + 0.1 + i * 0.1) * (1 - pergi);
        return o > 0 ? <Chip key={i} x={s.x} y={s.y + 190} teks={`noise ${i + 1}`} warna={K.abu} o={o} /> : null;
      })}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - pergi }} width={1} height={1}>
        {SLOT.map((s, i) => (
          <GarisDigambar key={i} d={pathPanah(CX, 580, s.x, s.y - 162, (i - 1) * -30, 24)} mulai={T.kalimat8 + i * 0.1} lama={0.3} warna={K.kuning} tebal={6} />
        ))}
      </svg>
    </>
  );
};

// penghitung langkah (angka tulang punggung): nempel di atas kanvas, diikat ke level noise
const Penghitung: React.FC<{ T: WaktuD }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  let n: number | null = null;
  let warna = K.teal;
  let arah = '';
  if (t > T.dikasih - 0.3 && t < S[2].mulai - 0.1) {
    n = levelLatih(t, T) * 1000;
    arah = '+ noise';
    warna = K.merah;
  } else if (t > T.dibalik + 0.2 && t < S[6].mulai - 0.05) {
    n = levelUtama(t, T) * 1000;
    arah = '− noise';
  }
  if (n === null) return null;
  const o = Math.min(1, maju(t, T.dikasih - 0.3, T.dikasih) + maju(t, T.dibalik + 0.2, T.dibalik + 0.5));
  return (
    <div style={{ position: 'absolute', left: CX, top: CY - UK / 2 - 4, translate: '-50% -50%', opacity: o, display: 'flex', alignItems: 'baseline', gap: 14, padding: '8px 24px', borderRadius: 16, background: K.latar, border: `3px solid ${warna}`, whiteSpace: 'nowrap' }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: K.abu }}>langkah</span>
      <AngkaJalan dari={0} ke={1000} progress={n / 1000} gaya={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 56, color: warna, minWidth: '2.3em', textAlign: 'right', display: 'inline-block' }} />
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: warna }}>{arah}</span>
    </div>
  );
};

// ======================================================================================================
const PROMPT = 'kucing oranye pakai helm astronot';
const HudDif: React.FC<{ T: WaktuD }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const nHuruf = Math.floor(PROMPT.length * maju(t, S[6].mulai + 0.1, T.ketik + 0.6, EASE.linear));
  const promptO = maju(t, S[6].mulai - 0.1, S[6].mulai + 0.15) * (1 - maju(t, T.pulang - 0.05, T.pulang + 0.3));
  // penggaris 1.000 langkah (S5)
  const rO = maju(t, S[4].mulai, S[4].mulai + 0.35) * (1 - maju(t, S[5].mulai + 0.6, S[5].mulai + 0.9));
  const lv = levelUtama(t, T);
  return (
    <>
      <Teks label={[{ t: 'GAMBAR', mulai: 0.12 }, { t: 'BUATAN', mulai: 0.18 }, { t: 'AI', mulai: 0.24 }]} lMulai={0.12} judul={[{ t: 'awalnya:', mulai: T.awalnya }, { t: 'noise', mulai: T.awalnya + 0.4, isi: sorot('noise', T.awalnya + 0.55, K.teal) }, { t: 'acak', mulai: T.acak1 }]} jMulai={T.awalnya} keluar={S[1].mulai - 0.2} />
      <Teks label={['LATIHAN']} lMulai={S[1].mulai + 0.15} judul={[{ t: 'gambar', mulai: T.asli - 0.3 }, { t: '→', mulai: T.dikasih, warna: K.merah }, { t: 'noise', mulai: T.dikasih + 0.3 }]} jMulai={T.asli - 0.3} keluar={S[2].mulai - 0.2} catatan="foto ini contoh data latihan" cMulai={T.asli} />
      <Teks label={['TIAP', 'LANGKAH,', 'AI', 'BELAJAR']} lMulai={S[2].mulai} judul={[{ t: 'tebak', mulai: T.nebak3 }, { t: 'noisenya', mulai: T.nebak3 + 0.35, isi: sorot('noisenya', T.nebak3 + 0.5, K.kuning) }]} jMulai={T.nebak3} keluar={S[3].mulai - 0.2} />
      <Teks label={['SETELAH', 'JAGO', 'NEBAK']} lMulai={S[3].mulai} judul={[{ t: 'dibalik:', mulai: T.dibalik, warna: K.kuning }, { t: 'noise', mulai: T.mulai4 + 0.3 }, { t: '→', mulai: T.ngebuang - 0.3, warna: K.teal }, { t: 'gambar', mulai: T.ngebuang }]} jMulai={T.dibalik} keluar={S[4].mulai - 0.2} />
      <Teks label={['DI', 'RISET', 'AWALNYA']} lMulai={S[4].mulai} judul={[{ t: '1.000', mulai: T.seribu - 0.1, warna: K.teal }, { t: 'langkah', mulai: T.seribu + 0.2 }, { t: '·', mulai: T.th2020 - 0.1, warna: K.abu }, { t: '2020', mulai: T.th2020, warna: K.kuning }]} jMulai={T.th2020} keluar={S[5].mulai - 0.2} />
      <Teks label={['PELAN-PELAN', 'MUNCUL']} lMulai={S[5].mulai} judul={[{ t: 'bentuk', mulai: T.bentuk }, { t: '·', mulai: T.warna - 0.1, warna: K.abu }, { t: 'warna', mulai: T.warna }, { t: '·', mulai: T.detail - 0.1, warna: K.abu }, { t: 'detail', mulai: T.detail }]} jMulai={T.bentuk} keluar={S[6].mulai - 0.2} />
      <Teks label={['KALIMAT', 'YANG', 'KAMU', 'KETIK']} lMulai={S[6].mulai} judul={[{ t: 'prompt', mulai: T.ketik }, { t: '=', mulai: T.petunjuk - 0.2, warna: K.abu }, { t: 'petunjuk', mulai: T.petunjuk, isi: sorot('petunjuk', T.petunjuk + 0.15) }]} jMulai={T.ketik} keluar={S[7].mulai - 0.2} />
      <Teks label={['PROMPT', 'SAMA,']} lMulai={S[7].mulai} judul={[{ t: 'noise', mulai: T.titik8 + 0.4 }, { t: 'beda', mulai: T.bedabeda, warna: K.kuning }, { t: '=', mulai: T.ngasilin, warna: K.abu }, { t: 'gambar', mulai: T.ngasilin + 0.2 }, { t: 'beda', mulai: T.beda8, warna: K.kuning }]} jMulai={T.titik8 + 0.4} keluar={T.pulang - 0.1} />
      {/* kotak prompt */}
      {promptO > 0 ? (
        <div style={{ position: 'absolute', left: 90, top: t > S[7].mulai ? 470 : 470, width: 900, height: 96, borderRadius: 48, background: 'rgba(13,23,48,0.96)', border: `3px solid ${K.kuning}`, opacity: promptO, display: 'flex', alignItems: 'center', paddingLeft: 36, fontFamily: SAIRA, fontWeight: 700, fontSize: 50, color: K.tinta, whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: MONO, fontSize: 26, color: K.kuning, marginRight: 18 }}>prompt</span>
          {PROMPT.slice(0, nHuruf)}
          {nHuruf < PROMPT.length ? <span style={{ color: K.kuning, opacity: Math.floor(t * 3) % 2 }}>|</span> : null}
        </div>
      ) : null}
      {/* panah prompt → kanvas (S7) */}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - maju(t, S[7].mulai - 0.1, S[7].mulai + 0.2) }} width={1} height={1}>
        <GarisDigambar d={pathPanah(CX, 572, CX, CY - UK / 2 + 70, 0, 26)} mulai={T.petunjuk} lama={0.3} warna={K.kuning} tebal={8} />
      </svg>
      {/* penggaris 1.000 langkah (S5): penanda geser diikat ke level */}
      {rO > 0 ? (
        <div style={{ position: 'absolute', left: 90, top: 1336 - 40, width: 900, height: 30, opacity: 0 }} />
      ) : null}
      {rO > 0 ? (
        <div style={{ position: 'absolute', left: 120, top: 420, width: 840, opacity: rO }}>
          <div style={{ position: 'relative', height: 34, backgroundImage: `repeating-linear-gradient(90deg, ${K.abu} 0 1px, transparent 1px 8.4px)`, opacity: 0.6 }} />
          <div style={{ position: 'absolute', left: 0, top: 0, height: 34, width: 840 * lv, background: `linear-gradient(90deg, ${K.teal}55, ${K.teal}aa)` }} />
          <div style={{ position: 'absolute', left: 840 * lv - 3, top: -10, width: 6, height: 54, background: K.kuning }} />
          <div style={{ position: 'absolute', left: 0, top: 44, fontFamily: MONO, fontWeight: 600, fontSize: 24, color: K.abu }}>0</div>
          <div style={{ position: 'absolute', right: 0, top: 44, fontFamily: MONO, fontWeight: 600, fontSize: 24, color: K.abu }}>1.000 langkah</div>
        </div>
      ) : null}
      {(() => {
        // sumber kecil, gaya kredit foto, di pojok kiri bawah kanvas
        const teks = t < S[4].mulai ? 'Sumber: Hugging Face' : t < S[6].mulai ? 'Sumber: Hugging Face · DDPM, Ho dkk. 2020' : 'Sumber: Hugging Face · Stable Diffusion 2022';
        const o = maju(t, S[0].mulai + 1.5, S[0].mulai + 1.8) * (1 - maju(t, T.pulang - 0.2, T.pulang + 0.1)) * (1 - maju(t, T.bentuk - 0.3, T.bentuk) + maju(t, S[6].mulai, S[6].mulai + 0.3));
        if (o <= 0) return null;
        const yS = t > S[7].mulai + 0.3 ? 1250 : CY + UK / 2 - 44;
        return <div style={{ position: 'absolute', left: CX - UK / 2 + 14, top: yS, padding: '3px 12px', borderRadius: 8, background: 'rgba(7,12,24,0.78)', fontFamily: MONO, fontWeight: 500, fontSize: 24, color: '#b9c6d8', opacity: o }}>{teks}</div>;
      })()}
      {t > S[6].mulai + 0.3 && t < T.pulang ? (
        <div style={{ position: 'absolute', left: 90, top: 580, fontFamily: TANGAN, fontWeight: 700, fontSize: 34, color: K.kuning, opacity: 0 }} />
      ) : null}
    </>
  );
};

function daftarSfx(T: WaktuD) {
  const S = T.s;
  const latih = Array.from({ length: 10 }, (_, i) => bunyi('tik', T.dikasih - 0.05 + ((T.total2 + 0.2 - T.dikasih) * i) / 10, 0.2));
  const bersih = Array.from({ length: 12 }, (_, i) => bunyi('tik', T.ngebuang + i * 0.5, 0.1));
  return [
    bunyi('sapuHit', 0.1, 0.4),
    bunyi('glitch', 0.5, 0.25),
    bunyi('whooshLembut', T.awalnya, 0.35),
    bunyi('glitch', T.acak1 + 0.3, 0.3),
    bunyi('swish', T.mirip, 0.3),
    bunyi('whooshBerat', S[1].mulai, 0.4),
    bunyi('pop', S[1].mulai + 0.45, 0.35),
    ...latih,
    bunyi('whooshPop', S[2].mulai, 0.35),
    bunyi('pop', T.langkah3 + 0.35, 0.3),
    bunyi('pop', T.nebak3, 0.3),
    bunyi('kunci', T.ditambahin, 0.4),
    bunyi('whooshTurun', S[3].mulai - 0.05, 0.35),
    bunyi('whooshPunch', T.dibalik, 0.45),
    ...bersih,
    bunyi('riser', T.detail, 0.25),
    bunyi('pop', T.bentuk, 0.35),
    bunyi('pop', T.warna, 0.35),
    bunyi('hantam', T.detail + 0.05, 0.4),
    bunyi('klik', S[6].mulai + 0.3, 0.2),
    bunyi('klik', S[6].mulai + 0.6, 0.2),
    bunyi('klik', T.ketik + 0.2, 0.2),
    bunyi('swish', T.petunjuk, 0.35),
    bunyi('whooshA', S[7].mulai + 0.1, 0.35),
    bunyi('pop', T.titik8 + 0.05, 0.3),
    bunyi('pop', T.titik8 + 0.17, 0.3),
    bunyi('swish', T.kalimat8, 0.3),
    bunyi('jepret', T.beda8 + 0.3, 0.35),
    bunyi('whooshLembut', T.pulang, 0.3),
  ];
}
