// Detik penting explainer A7 "Langkah 37" (konten contoh), DIIKAT ke kata & kalimat VO (public/langkah/data.json).
import { akhirKata, kata, type Kata } from "../../../src/gerak";
import type { Kalimat } from "../raja/waktuRaja";

const CAD: [number, number][] = [
  [0.14, 6.76], [7.12, 15.74], [16.22, 22.22], [22.6, 28.44], [28.8, 34.18], [34.54, 41.0], [41.44, 46.18], [46.6, 49.68], [50.04, 55.66], [56.06, 58.8],
];

export function waktuLangkah(d: Kata[], total: number, kal: Kalimat[] = []) {
  const s = CAD.map((c, i) => ({ mulai: kal[i]?.mulai ?? c[0], akhir: kal[i]?.akhir ?? c[1] }));
  const k = (c: string, setelah = 0, cad = 0) => kata(d, c, setelah, cad);
  const a = (c: string, setelah = 0, cad = 0) => akhirKata(d, c, setelah, cad);
  // 1
  const peluang1 = k('peluang', s[0].mulai, 2.04);
  const n1 = k('1', peluang1, 3.72);
  const n10000 = k('10000', n1, 4.4);
  const menang1 = k('menang', n10000, 6.48);
  // 2
  const n37 = k('37', s[1].mulai, 8.2);
  const alphago2 = k('alphago', n37, 9.76);
  const deepmind = k('deepmind', alphago2, 10.88);
  const game2 = k('game', deepmind, 11.64);
  const juara = k('juara', game2, 12.78);
  const lee2 = k('lee', juara, 13.92);
  const maret = k('maret', lee2, 14.7);
  const n2016 = k('2016', maret, 15.12);
  // 3
  const n10 = k('10', s[2].mulai, 16.7);
  const n170 = k('170', n10, 17.54);
  const lebih3 = k('lebih', n170, 19.82);
  const atom = k('atom', lebih3, 20.66);
  // 4
  const belajar4 = k('belajar', s[3].mulai, 23.68);
  const n30 = k('30', belajar4, 24.34);
  const ahli = k('ahli', n30, 25.72);
  const tahu = k('tahu', ahli, 26.44);
  const biasa = k('biasa', tahu, 27.38);
  // 5
  const jutaan = k('jutaan', s[4].mulai, 29.84);
  const sendiri = k('sendiri', jutaan, 31.48);
  const ngira5 = k('ngira', sendiri, 32.68);
  const akibat5 = k('akibat', ngira5, 33.3);
  // 6
  const peluang6 = k('peluang', s[5].mulai, 35.38);
  const n1b = k('1', peluang6, 37.3);
  const n10000b = k('10000', n1b, 37.88);
  const ngecek = k('ngecek', n10000b, 39.04);
  const depan = k('depan', ngecek, 39.86);
  const tetap = k('tetap', depan, 40.52);
  // 7
  const komentator = k('komentator', s[6].mulai, 41.8);
  const salah = k('salah', komentator + 0.3, 43.04);
  const lee7 = k('lee', salah, 43.84);
  const n15 = k('15', lee7, 44.94);
  const menit = a('menit', n15, 45.66);
  // 8
  const ngebalikin = k('ngebalikin', s[7].mulai, 47.12);
  const menang8 = k('menang', ngebalikin, 49.36);
  // 9
  const keempat = k('keempat', s[8].mulai, 50.3);
  const lee9 = k('lee', keempat, 50.9);
  const n78 = k('78', lee9, 52.32);
  const n1c = k('1', n78, 53.96);
  const n10000c = k('10000', n1c, 54.46);
  const menang9 = k('menang', n10000c, 55.36);
  // 10
  const simpan = s[9].mulai;
  const follow = k('follow', simpan, 57.24);
  const akhirVO = a('berikutnya', follow, s[9].akhir);
  return {
    total, s,
    peluang1, n1, n10000, menang1,
    n37, alphago2, deepmind, game2, juara, lee2, maret, n2016,
    n10, n170, lebih3, atom,
    belajar4, n30, ahli, tahu, biasa,
    jutaan, sendiri, ngira5, akibat5,
    peluang6, n1b, n10000b, ngecek, depan, tetap,
    komentator, salah, lee7, n15, menit,
    ngebalikin, menang8,
    keempat, lee9, n78, n1c, n10000c, menang9,
    simpan, follow, akhirVO,
    keluarDunia: simpan - 0.2,
    keluarCta: Math.max(akhirVO + 0.12, total - 0.95),
    loop: total - 0.3,
  };
}
export type WaktuG = ReturnType<typeof waktuLangkah>;
