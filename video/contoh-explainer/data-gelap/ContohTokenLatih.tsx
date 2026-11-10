// Frame hero (pembuka, tengah, puncak): 15, 1310, 2183.
// contoh video explainer (akun generik, konten contoh): "Kalau Kamu Baca Data Latihan AI, Butuh 475 Ribu Tahun".
// SATU DUNIA: sabuk token panjang yang jalan terus (objek pemandu), kamera nyusurin stasiun dari kiri ke kanan:
// A hujan token ke Llama 3 → B teks dipotong jadi token → C orang baca 1 token/detik, jam 24 jam, kalender 365, penggaris
// tahun (log) 475.000, garis waktu → D tumpukan 1× vs 7×, kode 4× → E 5% bukan Inggris → bola dunia 30+ → F 3 gerbang
// saringan + Llama 2 ngelatih penilai → G 2 klaster × 24.000 GPU → H 8 miliar parameter → I takaran 200 miliar vs batang
// 75× + garis tren naik → mundur jauh: semua stasiun, "1 orang" → balik ke A (loop).
// Fakta: Meta AI, "Introducing Meta Llama 3" (18/04/2024). 1 token/detik & 75× = hitungan/ilustrasi (ditulis di layar).
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import { Bunyi, Dunia, Grain, hitungKamera, Kabut, maju, noise, Paralaks, Subtitle, useDetik, type Getar, type Kamera, type Kata, type KunciKamera } from "../../src/gerak";
import { SAIRA } from "../../src/gerak/font";
import { bunyi, K } from "./raja/gaya";
import type { Kalimat } from "./raja/waktuRaja";
import { DUNIA_L, SABUK_Y, X } from "./llama/dunia";
import { HudL } from "./llama/HudL";
import { MENARA, Sabuk, StasiunA, StasiunB, StasiunC, StasiunD, StasiunE, StasiunF, StasiunG, StasiunH, StasiunI } from "./llama/Stasiun";
import { waktuLlama, type WaktuL } from "./llama/waktuLlama";

export type DataLlama = { durasi: number; kata: Kata[]; kalimat?: Kalimat[] };

// 9:16 (1080×1920): sabuk di ±1240 px layar (pemandu di dasar zona subjek), stasiun di atasnya, judul di 10–30% atas.
const LW = 1080;
const LH = 1920;
/** kamera yang naruh sabuk di y layar 1240 */
const yk = (z: number) => SABUK_Y - 280 / z;
const A0 = { x: X.A + 120, y: yk(1.0), z: 1.0 };

function kunciKamera(T: WaktuL): KunciKamera[] {
  // tahan = drift konstan (linear): gak ada jeda diam abis kamera tiba
  const pelan = Easing.linear;
  const S = T.s;
  // stasiun yang dipakai kalimat i sampai sebelum kalimat j: tiba S[i]+0,55, diem (drift pelan) sampai S[j]−0,35
  const st = (i: number, j: number, x: number, z: number, z2: number, dx = 40): KunciKamera[] => [
    { t: S[i].mulai + 0.55, x, y: yk(z), z },
    { t: S[j].mulai - 0.35, x: x + dx, y: yk(z2), z: z2, ease: pelan },
  ];
  const M = MENARA;
  const ujungAtas = M.dasar - 75 * M.satuan;
  void ujungAtas;
  return [
    { t: 0, ...A0 },
    { t: S[1].mulai - 0.35, x: A0.x + 10, y: yk(1.06), z: 1.06, ease: pelan },
    ...st(1, 2, X.B - 20, 1.0, 1.05),
    { t: S[2].mulai + 0.6, x: X.C + 60, y: yk(0.9), z: 0.9 },
    { t: S[4].mulai - 0.2, x: X.C + 70, y: yk(0.94), z: 0.94, ease: pelan },
    { t: S[4].mulai + 0.4, x: X.C + 80, y: yk(0.9), z: 0.9 },
    { t: S[5].mulai + 0.5, x: X.C + 130, y: yk(0.84), z: 0.84, ease: pelan },
    { t: S[6].mulai - 0.35, x: X.C + 90, y: yk(0.88), z: 0.88, ease: pelan },
    ...st(6, 8, X.D + 50, 0.9, 0.95),
    ...st(8, 9, X.E - 30, 0.92, 0.97),
    ...st(9, 11, X.F, 0.86, 0.9, 10).flatMap((k, i) => (i === 0 ? [k, { t: S[10].mulai + 0.6, x: X.F + 40, y: yk(0.82), z: 0.82, ease: pelan }] : [k])),
    ...st(11, 12, X.G - 10, 0.86, 0.9, 20),
    ...st(12, 13, X.H, 0.9, 0.95),
    { t: S[13].mulai + 0.55, x: X.I + 160, y: yk(1.0), z: 1.0 },
    { t: T.n75 - 0.1, x: X.I + 190, y: yk(1.07), z: 1.07, ease: pelan },
    // naik ngikutin ujung menara (easing sama dengan tumbuhnya menara)
    { t: T.ternyata - 0.05, x: X.I + 170, y: ujungAtas + 300, z: 0.95, ease: Easing.inOut(Easing.cubic) },
    // mundur: menara utuh + batang kemampuan
    // menara di x layar ±760, kaki di y layar ±1250
    { t: T.ternyata + 0.75, x: X.I - 240 / 0.117, y: M.dasar - 290 / 0.117, z: 0.117 },
    { t: S[15].mulai, x: X.I - 241 / 0.119, y: M.dasar - 290 / 0.119, z: 0.119, ease: pelan },
    { t: T.pulang, x: X.I - 242 / 0.121, y: M.dasar - 290 / 0.121, z: 0.121, ease: pelan },
    // lewat seluruh sabuk (semua stasiun) terus balik ke awal (loop)
    { t: T.pulang + 0.45, x: A0.x + 600, y: yk(0.06), z: 0.06, ease: Easing.inOut(Easing.cubic) },
    { t: T.loop, ...A0, ease: Easing.in(Easing.cubic) },
    { t: T.total + 1, ...A0 },
  ];
}

/** pindah stasiun = "terbang": zoom nyelup sementara */
function kamera(T: WaktuL, kunci: KunciKamera[], t: number, fps: number, getar: Getar[]): Kamera {
  const S = T.s;
  const terbang = [1, 2, 6, 8, 9, 11, 12, 13].map((i) => ({ a: S[i].mulai - 0.35, b: S[i].mulai + 0.55, dip: 0.3 }));
  const f = (tt: number) => {
    const k = hitungKamera(kunci, tt, fps, { lebar: LW, tinggi: LH, drift: 3, getar });
    let z = k.z;
    for (const g of terbang) if (tt > g.a && tt < g.b) z *= 1 - g.dip * Math.pow(Math.sin((Math.PI * (tt - g.a)) / (g.b - g.a)), 1.4);
    // nol di awal & akhir biar frame terakhir = frame pertama (loop)
    const amp = Math.min(maju(tt, 0, 0.8), 1 - maju(tt, T.loop - 0.6, T.loop));
    return { ...k, x: k.x + (noise('gx', tt * 0.55) * 22 * amp) / z, y: k.y + (noise('gy', tt * 0.5) * 18 * amp) / z, z };
  };
  const k = f(t);
  const k0 = f(t - 1 / fps);
  return { ...k, vx: (k.x - k0.x) * k.z * fps, vy: (k.y - k0.y) * k.z * fps };
}

export const ContohTokenLatih: React.FC<DataLlama> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuLlama(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const kunci = useMemo(() => kunciKamera(T), [T]);
  const getar: Getar[] = [
    { t: 0.12, kuat: 5, lama: 0.14 },
    { t: T.hariIni, kuat: 8 },
    { t: T.banyak7 + 0.35, kuat: 8 },
    { t: T.kembar + 0.1, kuat: 5 },
    { t: T.ternyata - 0.05, kuat: 10, lama: 0.18 },
    { t: T.loop, kuat: 8, lama: 0.14 },
  ];
  const kam = kamera(T, kunci, t, fps, getar);
  return (
    <AbsoluteFill style={{ background: K.latar, color: K.tinta, overflow: 'hidden', fontFamily: SAIRA }}>
      <Latar kam={kam} />
      <Dunia kamera={kam} tinggiDunia={DUNIA_L.h} lebarDunia={DUNIA_L.w} blurGerak={2600}>
        <StasiunI T={T} />
        <StasiunA T={T} />
        <StasiunB T={T} />
        <StasiunC T={T} kam={kam} />
        <StasiunD T={T} />
        <StasiunE T={T} />
        <StasiunG T={T} />
        <StasiunH T={T} />
        <Sabuk kam={kam} />
        <StasiunF T={T} />
      </Dunia>
      <HudL T={T} kam={kam} />
      <Subtitle kata={d.kata} kalimat={d.kalimat} font={SAIRA} tebal={700} ukuran={48} maksHuruf={34} sorot={K.kuning} sampai={T.orangAkhir + 0.35} zona={[{ dari: 0, x: 520, y: 1340, lebar: 860 }]} />
      <Grain kuat={0.07} garisScan={0} vinyet={0.55} warnaVinyet="2,5,14" />
      <></>
    </AbsoluteFill>
  );
};

const Latar: React.FC<{ kam: Kamera }> = ({ kam }) => {
  const t = useDetik();
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${50 + noise('lt', t * 0.08) * 6}% 40%, ${K.latar2} 0%, ${K.latar} 70%)` }} />
      <Kabut kam={kam} />
      <Paralaks
        kamera={kam}
        lapis={[
          { faktor: 0.35, pola: 'radial-gradient(circle, rgba(140,170,210,0.18) 1.4px, transparent 2px)', ukuran: '90px 90px' },
          { faktor: 1, pola: 'linear-gradient(rgba(110,150,200,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(110,150,200,0.07) 2px, transparent 2px)', ukuran: '240px 240px' },
        ]}
      />
    </>
  );
};

function daftarSfx(T: WaktuL) {
  const S = T.s;
  const baca = Array.from({ length: Math.max(0, Math.floor(S[6].mulai - T.baca3)) }, (_, i) => bunyi('tik', T.baca3 - 0.1 + i + 0.05, 0.14));
  const pindah = [1, 2, 6, 8, 9, 11, 12, 13].map((i, j) => bunyi(j % 2 ? 'whooshA' : 'whooshB', S[i].mulai - 0.05, 0.38));
  return [
    bunyi('sapuHit', 0.12, 0.5),
    ...Array.from({ length: 10 }, (_, i) => bunyi('tik', 0.4 + i * 0.5, 0.1 + i * 0.012)),
    bunyi('pop', T.token1, 0.35),
    ...pindah,
    bunyi('swish', T.potongan, 0.35),
    bunyi('swish', T.sepotong + 0.05, 0.35),
    bunyi('whooshPop', S[2].mulai - 0.3, 0.3),
    ...baca,
    bunyi('whooshLembut', T.tidur - 0.2, 0.3),
    bunyi('riser', T.token4 + 0.2, 0.22),
    bunyi('jepret', T.setahun, 0.3),
    bunyi('whooshTurun', T.n475 - 0.4, 0.4),
    bunyi('hantam', T.tahun5 + 0.15, 0.45),
    bunyi('swish', S[5].mulai + 0.05, 0.3),
    bunyi('kunci', T.hariIni, 0.45),
    ...Array.from({ length: 7 }, (_, i) => bunyi('pop', T.tujuh - 0.05 + i * ((T.banyak7 + 0.35 - T.tujuh) / 6), 0.3)),
    ...Array.from({ length: 4 }, (_, i) => bunyi('pop', T.empat - 0.15 + i * 0.17, 0.3)),
    bunyi('whooshA', T.dikumpulin + 0.2, 0.25),
    bunyi('pop', T.n5 + 0.05, 0.35),
    bunyi('swish', T.n30 - 0.55, 0.3),
    ...Array.from({ length: 6 }, (_, i) => bunyi('tik', T.n30 - 0.2 + i * 0.12, 0.15)),
    bunyi('swish', T.disaring, 0.3),
    bunyi('whooshPunch', T.kembar + 0.1, 0.4),
    bunyi('glitch', T.pantas + 0.08, 0.35),
    bunyi('whooshPunch', T.pantas + 0.12, 0.35),
    bunyi('klik', T.dinilai - 0.15, 0.3),
    bunyi('klik', T.dinilai + 0.27, 0.3),
    bunyi('pop', T.llama2c - 0.1, 0.4),
    bunyi('swish', T.llama2c + 0.15, 0.3),
    bunyi('whooshA', T.milihin, 0.3),
    bunyi('swish', T.dua12, 0.3),
    ...Array.from({ length: 8 }, (_, i) => bunyi('tik', T.masing + i * 0.25, 0.12)),
    bunyi('kunci', T.disetel, 0.3),
    ...Array.from({ length: 6 }, (_, i) => bunyi('tik', T.n8 - 0.3 + i * 0.15, 0.12)),
    bunyi('pop', T.n200 - 0.05, 0.4),
    bunyi('whooshTerang', T.n75 - 0.05, 0.45),
    bunyi('hantam', T.ternyata - 0.05, 0.45),
    bunyi('whooshLembut', T.ternyata + 0.1, 0.35),
    bunyi('swish', T.ternyata + 0.4, 0.3),
    bunyi('pop', T.bagus, 0.35),
    bunyi('whooshBerat', S[15].mulai + 0.3, 0.4),
    ...Array.from({ length: 4 }, (_, i) => bunyi('pop', T.topik - 0.3 + i * 0.14, 0.22)),
    bunyi('jepret', T.mungkin - 0.15, 0.3),
    bunyi('whooshTurun', T.pulang + 0.1, 0.35),
  ];
}
