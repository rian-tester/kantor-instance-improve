// Frame hero (pembuka, tengah, puncak): 15, 1212, 2020.
// contoh video explainer (akun generik, konten contoh): "Raja − Pria + Wanita = Ratu".
// SATU DUNIA: peta makna raksasa (ilustrasi 2D). Kamera jalan di atasnya: kata "raja" → 640 angka → titik + alamat →
// peta raksasa → gugus buah → 3 peneliti (2013) → peta dibentuk dari 320 juta kata → tebak kata berikutnya → angka disetel →
// raja − pria + wanita (panah digeser) → titik hasil → tetangga terdekat = ratu → pasangan lain sejajar → apple/car →
// panel uji 8.000 soal (39,6% vs < 1%) → jarak & arah → kalimat kamu jadi titik → balik ke raja (loop).
// Fakta: Mikolov, Yih, Zweig (Microsoft Research), NAACL 2013 (aclanthology.org/N13-1090).
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import { Bunyi, Dunia, Grain, hitungKamera, Kabut, noise, Paralaks, Subtitle, useDetik, type Getar, type Kamera, type Kata, type KunciKamera } from "../../src/gerak";
import { SAIRA } from "../../src/gerak/font";
import { bunyi, K } from "./raja/gaya";
import { DUNIA, HASIL, RAJA } from "./raja/data-peta";
import { daftarFokus, KataPeta, TitikLatar, type GayaKata } from "./raja/Peta";
import { GugusBuah, HookRaja, Jajaran, JamakInggris, JarakArah, PanelSetel, PanelUji, PasanganLain, TandaS3, Tetangga, waktuChip } from "./raja/Adegan";
import { Hud } from "./raja/Hud";
import { waktuRaja, type Kalimat, type WaktuR } from "./raja/waktuRaja";
import { maju, pegas } from "../../src/gerak";

export type DataRaja = { durasi: number; kata: Kata[]; kalimat?: Kalimat[] };

// 9:16 (1080×1920): judul/label di 10–30% atas, subjek di ±560–1300 px, subtitle ±1340 px, sumber di bawahnya.
const LW = 1080;
const LH = 1920;
const HOOK = { x: 3987, y: 2543, z: 1.5 }; // raja di layar (110, 520)
const JG = { x: 3600, y: 2697, z: 0.64 }; // jajaran genjang raja/ratu/pria/wanita
const UJI = { x: 6240, y: 2635, z: 0.85 };

function kunciKamera(T: WaktuR): KunciKamera[] {
  // tahan = drift konstan (linear): gak ada jeda diam abis kamera tiba
  const pelan = Easing.linear;
  return [
    { t: 0, ...HOOK },
    { t: T.deretan, x: HOOK.x, y: HOOK.y, z: 1.58, ease: pelan },
    { t: T.angka1 + 0.4, x: HOOK.x + 10, y: HOOK.y + 10, z: 1.52 },
    { t: T.k2.mulai + 0.8, x: RAJA.x + 100, y: RAJA.y + 40, z: 1.7 },
    { t: T.peta2 - 0.1, x: RAJA.x + 100, y: RAJA.y + 40, z: 1.62, ease: pelan },
    { t: T.raksasa2 + 0.95, x: 3700, y: 2600, z: 0.24 },
    { t: T.kata2, x: 3650, y: 2580, z: 0.25, ease: pelan },
    { t: T.mirip, x: 1470, y: 1360, z: 1.0 },
    { t: T.k3.mulai - 0.1, x: 1490, y: 1375, z: 1.08, ease: pelan },
    { t: T.k3.mulai + 1.0, x: 3550, y: 2680, z: 0.48 },
    { t: T.k4.mulai, x: 3620, y: 2660, z: 0.54, ease: pelan },
    { t: T.dibentuk + 0.2, x: 3700, y: 2700, z: 0.3 },
    { t: T.k5.mulai, x: 3710, y: 2700, z: 0.315, ease: pelan },
    { t: T.latihan + 0.5, x: 4065, y: 2403, z: 0.85 },
    { t: T.k6.mulai, x: 4030, y: 2420, z: 0.93, ease: pelan },
    { t: T.disetel, x: 4040, y: 2430, z: 0.9 },
    { t: T.lompat, x: 4035, y: 2432, z: 0.92, ease: pelan },
    { t: T.k7.mulai + 0.65, ...JG },
    { t: T.geserPanah, x: JG.x + 15, y: JG.y - 10, z: 0.69, ease: pelan },
    { t: T.hasilMuncul + 0.35, x: 4229, y: 2497, z: 1.4 },
    { t: T.dicari, x: 4227, y: 2499, z: 1.44, ease: pelan },
    { t: T.ratu + 0.15, x: 4225, y: 2495, z: 1.48, ease: pelan },
    { t: T.k10.mulai + 0.15, ...JG },
    { t: T.hubungan, x: JG.x + 15, y: JG.y - 10, z: 0.69, ease: pelan },
    { t: T.kebentuk + 0.2, x: 3130, y: 2609, z: 0.38 },
    { t: T.keInggris, x: 3170, y: 2600, z: 0.42, ease: pelan },
    { t: T.k11.mulai + 1.15, x: 1665, y: 4002, z: 0.8 },
    { t: T.keUji, x: 1720, y: 3990, z: 0.9, ease: pelan },
    { t: T.k12.mulai + 1.2, x: 6240, y: 2516, z: 1.0 },
    { t: T.k13.mulai, x: 6245, y: 2516, z: 1.05, ease: pelan },
    { t: T.k13.mulai + 0.8, ...UJI },
    { t: T.kePeta14, x: UJI.x - 10, y: UJI.y - 10, z: 0.93, ease: pelan },
    { t: T.k14.mulai + 1.0, ...JG },
    { t: T.k15.mulai, x: JG.x, y: JG.y, z: 0.67, ease: pelan },
    { t: T.k15.mulai + 1.1, x: 3650, y: 2650, z: 0.3 },
    { t: T.pulang, x: 3660, y: 2640, z: 0.315, ease: pelan },
    { t: T.loop, ...HOOK, ease: Easing.inOut(Easing.cubic) },
    { t: T.total + 1, ...HOOK },
  ];
}

/** pindah jauh = "terbang": zoom nyelup sementara biar gerak layar gak kebut */
function kamera(T: WaktuR, kunci: KunciKamera[], t: number, fps: number, getar: Getar[]): Kamera {
  const terbang = [
    { a: T.keInggris, b: T.k11.mulai + 1.15, dip: 0.4 },
    { a: T.keUji, b: T.k12.mulai + 1.2, dip: 0.62 },
    { a: T.kePeta14, b: T.k14.mulai + 1.0, dip: 0.55 },
    { a: T.pulang, b: T.loop, dip: 0.0 },
  ];
  const f = (tt: number) => {
    const k = hitungKamera(kunci, tt, fps, { lebar: LW, tinggi: LH, drift: 3, getar });
    let z = k.z;
    for (const g of terbang) if (tt > g.a && tt < g.b) z *= 1 - g.dip * Math.pow(Math.sin((Math.PI * (tt - g.a)) / (g.b - g.a)), 1.4);
    // goyang tangan kamera yang keliatan (±14 px layar) biar adegan diam gak beku
    // nol di awal & akhir biar frame terakhir = frame pertama (loop)
    const amp = Math.min(maju(tt, 0, 0.8), 1 - maju(tt, T.loop - 0.6, T.loop));
    return { ...k, x: k.x + (noise('gx', tt * 0.55) * 22 * amp) / z, y: k.y + (noise('gy', tt * 0.5) * 18 * amp) / z, z };
  };
  const k = f(t);
  const k0 = f(t - 1 / fps);
  return { ...k, vx: (k.x - k0.x) * k.z * fps, vy: (k.y - k0.y) * k.z * fps };
}

// ======================================================================================================
export const ContohPetaMakna: React.FC<DataRaja> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuRaja(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const kunci = useMemo(() => kunciKamera(T), [T]);
  const F = useMemo(() => daftarFokus(T), [T]);
  const getar: Getar[] = [
    { t: 0.1, kuat: 6, lama: 0.14 },
    { t: T.ratu + 0.1, kuat: 14, lama: 0.2 },
    { t: T.cars + 0.22, kuat: 6 },
    { t: T.n1 + 0.05, kuat: 6 },
  ];
  const kam = kamera(T, kunci, t, fps, getar);
  const gaya = (id: string, tt: number): GayaKata | null => {
    if (id === 'raja' && tt < T.k2.mulai + 0.82) return { o: 0 };
    // loop: label raja ilang di detik-detik terakhir (frame pertama juga belum ada label)
    if (id === 'raja' && tt > T.loop - 0.35) return { o: 1 - maju(tt, T.loop - 0.35, T.loop) };
    if (id === 'ratu' && tt <= T.ratu - 0.05) return { labelO: 0 };
    if (id === 'ratu' && tt > T.loop - 0.6) return { labelO: 1 - maju(tt, T.loop - 0.6, T.loop - 0.1) };
    if (id === 'ratu' && tt > T.ratu - 0.05) {
      const s = 1 + 0.3 * pegas(tt, T.ratu, fps, { damping: 10, stiffness: 200, mass: 0.6 }) * (1 - maju(tt, T.k10.mulai, T.k10.mulai + 0.5));
      return { warna: tt < T.k15.mulai + 0.5 ? K.kuning : undefined, skala: s };
    }
    if (id === 'pria' && tt > T.pria7 && tt < T.hubungan) return { warna: '#ffb3a8' };
    if (id === 'wanita' && tt > T.wanita7 && tt < T.hubungan) return { warna: '#aef3ea' };
    if (id === 'mahkota' && tt > T.kalimat5 - 0.1 && tt < T.lompat) return { warna: K.teal };
    return null;
  };
  return (
    <AbsoluteFill style={{ background: K.latar, color: K.tinta, overflow: 'hidden', fontFamily: SAIRA }}>
      <Latar kam={kam} />
      <Dunia kamera={kam} tinggiDunia={DUNIA.h} lebarDunia={DUNIA.w} blurGerak={1300}>
        <TitikLatar kam={kam} T={T} F={F} />
        <PanelUji T={T} />
        <GugusBuah T={T} />
        <TandaS3 T={T} />
        <PasanganLain T={T} />
        <JamakInggris T={T} />
        <Jajaran T={T} />
        <Tetangga T={T} />
        <JarakArah T={T} />
        <KataPeta kam={kam} T={T} F={F} gaya={gaya} />
        <PanelSetel T={T} />
        <HookRaja T={T} />
      </Dunia>
      <Hud T={T} kam={kam} />
      <Subtitle kata={d.kata} kalimat={d.kalimat} font={SAIRA} tebal={700} ukuran={48} maksHuruf={34} sorot={K.kuning} sampai={T.kamuAkhir + 0.35} zona={[{ dari: 0, x: 520, y: 1340, lebar: 860 }]} />
      <Grain kuat={0.07} garisScan={0} vinyet={0.55} warnaVinyet="2,5,14" />
      <></>
    </AbsoluteFill>
  );
};

// latar: gradasi + grid koordinat yang ikut kamera + bintik jauh (paralaks)
const Latar: React.FC<{ kam: Kamera }> = ({ kam }) => {
  const t = useDetik();
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${50 + noise('lt', t * 0.08) * 6}% 42%, ${K.latar2} 0%, ${K.latar} 70%)` }} />
      <Kabut kam={kam} />
      <Paralaks
        kamera={kam}
        lapis={[
          { faktor: 0.35, pola: 'radial-gradient(circle, rgba(140,170,210,0.18) 1.4px, transparent 2px)', ukuran: '90px 90px' },
          {
            faktor: 1,
            pola: 'linear-gradient(rgba(110,150,200,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(110,150,200,0.07) 2px, transparent 2px)',
            ukuran: '240px 240px',
          },
        ]}
      />
    </>
  );
};

function daftarSfx(T: WaktuR) {
  const chip = Array.from({ length: 13 }, (_, i) => bunyi('tik', waktuChip(i + 3, T), 0.13));
  const setel = Array.from({ length: 6 }, (_, i) => bunyi('tik', T.disetel + ((T.tepat + 0.15 - T.disetel) * i) / 6, 0.28));
  const soal = Array.from({ length: 7 }, (_, i) => bunyi('tik', T.n8000 + i * 0.16, 0.12));
  return [
    bunyi('sapuHit', 0.1, 0.5),
    bunyi('tik', waktuChip(0, T), 0.3),
    bunyi('tik', waktuChip(1, T), 0.3),
    bunyi('tik', waktuChip(2, T), 0.3),
    bunyi('glitch', T.tulisan, 0.32),
    ...chip,
    bunyi('swish', T.k2.mulai + 0.1, 0.32),
    bunyi('pop', T.alamat2 + 0.08, 0.45),
    bunyi('whooshTurun', T.peta2 + 0.1, 0.5),
    bunyi('whooshA', T.kata2 + 0.2, 0.3),
    bunyi('swish', T.mirip, 0.3),
    bunyi('whooshLembut', T.k3.mulai + 0.3, 0.35),
    bunyi('tik', T.tahun + 0.1, 0.2),
    bunyi('tik', T.tahun + 0.35, 0.2),
    bunyi('tik', T.tahun + 0.6, 0.2),
    bunyi('klik', T.tiga3 + 0.25, 0.35),
    bunyi('klik', T.peneliti + 0.3, 0.35),
    bunyi('klik', T.microsoft + 0.35, 0.35),
    bunyi('swish', T.nyobain + 0.15, 0.25),
    bunyi('swish', T.hitungan3 + 0.05, 0.25),
    bunyi('pop', T.aneh + 0.02, 0.4),
    bunyi('whooshBerat', T.dibentuk + 0.1, 0.45),
    bunyi('whooshB', T.latihan + 0.2, 0.32),
    bunyi('pop', T.latihan, 0.3),
    bunyi('tik', T.nebak + 0.05, 0.3),
    bunyi('glitch', T.nebak + 0.25, 0.2),
    bunyi('kunci', T.kalimat5 - 0.12, 0.45),
    ...setel,
    bunyi('whooshA', T.lompat + 0.3, 0.35),
    bunyi('pop', T.dikurangi + 0.06, 0.4),
    bunyi('pop', T.ditambah + 0.06, 0.4),
    bunyi('swish', T.wanita7 + 0.1, 0.35),
    bunyi('whooshPop', T.geserPanah + 0.2, 0.35),
    bunyi('pop', T.hasilMuncul - 0.08, 0.45),
    bunyi('riser', T.ratu, 0.3),
    bunyi('hantam', T.ratu + 0.1, 0.55),
    bunyi('jepret', T.ratu + 0.08, 0.3),
    bunyi('whooshLembut', T.k10.mulai - 0.2, 0.35),
    bunyi('swish', T.ngajarin + 0.12, 0.38),
    bunyi('swish', T.ngajarin + 0.25, 0.32),
    ...[0, 1, 2, 3].map((i) => bunyi('swish', T.kebentuk - 0.85 + i * 0.28, 0.2)),
    bunyi('whooshPunch', T.keInggris + 0.45, 0.45),
    bunyi('swish', T.apple + 0.2, 0.3),
    bunyi('whooshA', T.hampir11 + 0.2, 0.22),
    bunyi('swish', T.car + 0.05, 0.3),
    bunyi('pop', T.cars + 0.22, 0.45),
    bunyi('whooshTerang', T.keUji + 0.55, 0.45),
    ...soal,
    bunyi('pop', T.jamak12, 0.35),
    bunyi('pop', T.lampau, 0.35),
    bunyi('swish', T.kejawab + 0.05, 0.3),
    bunyi('pop', T.n1 + 0.05, 0.38),
    bunyi('whooshTurun', T.kePeta14 + 0.45, 0.42),
    bunyi('swish', T.jarak14 + 0.05, 0.28),
    bunyi('swish', T.arah + 0.05, 0.28),
    bunyi('swish', T.kamus + 0.08, 0.4),
    bunyi('jepret', T.kamus + 0.2, 0.3),
    bunyi('klik', T.k15.mulai + 0.35, 0.22),
    bunyi('klik', T.k15.mulai + 0.65, 0.22),
    bunyi('klik', T.k15.mulai + 0.95, 0.22),
    ...[0, 1, 2, 3].map((i) => bunyi('tik', T.kata15 + i * 0.1 + 0.1, 0.25)),
    bunyi('whooshB', T.angka15 + 0.45, 0.35),
    bunyi('pop', T.angka15 + 1.1, 0.3),
    bunyi('whooshLembut', T.pulang + 0.2, 0.3),
  ];
}
