// Detik penting explainer "Kalau Kamu Baca Data Latihan AI, Butuh 475 Ribu Tahun" (konten contoh), DIIKAT ke kata
// VO (public/llama/data.json). VO direvisi = bikin ulang data.json (alat suara-olah → transkrip ulang → cek-suara).
import { akhirKata, kata, type Kata } from "../../../src/gerak";
import type { Kalimat } from "../raja/waktuRaja";

const CAD: [number, number][] = [
  [0.16, 6.38], [6.84, 10.98], [11.46, 16.1], [16.58, 22.86], [23.32, 28.52], [28.94, 33.02], [33.48, 37.5], [37.98, 44.1],
  [44.5, 48.84], [49.24, 55.32], [55.78, 62.18], [62.64, 68.32], [68.74, 75.5], [75.96, 81.16], [81.6, 86.82], [87.28, 92.62],
];

export function waktuLlama(d: Kata[], total: number, kal: Kalimat[] = []) {
  const K = (i: number) => ({ mulai: kal[i]?.mulai ?? CAD[i][0], akhir: kal[i]?.akhir ?? CAD[i][1] });
  const k = (c: string, setelah = 0, cad = 0) => kata(d, c, setelah, cad);
  const a = (c: string, setelah = 0, cad = 0) => akhirKata(d, c, setelah, cad);
  const s = Array.from({ length: 16 }, (_, i) => K(i));
  // 1
  const meta = k('meta', s[0].mulai, 2.4);
  const dilatih = k('dilatih', meta, 3.08);
  const n15 = k('15', dilatih, 4.66);
  const token1 = k('token', n15, 5.96);
  // 2
  const potongan = k('potongan', s[1].mulai, 7.34);
  const teks2 = k('teks', potongan, 7.78);
  const satu2 = k('satu', teks2, 8.68);
  const utuh = k('utuh', satu2, 9.14);
  const sepotong = k('sepotong', utuh, 10.28);
  // 3
  const baca3 = k('baca', s[2].mulai, 12.5);
  const satu3 = k('satu', baca3, 12.88);
  const detik3 = k('detik', satu3, 13.8);
  const tidur = k('tidur', detik3, 14.82);
  const berhenti = k('berhenti', tidur, 15.74);
  // 4
  const n86400 = k('86.400', s[3].mulai, 17.84);
  const token4 = k('token', n86400, 19.5);
  const setahun = k('setahun', token4, 20.32);
  const n315 = k('31,5', setahun, 21.5);
  const juta4 = k('juta', n315, 22.58);
  // 5
  const n15b = k('15', s[4].mulai, 24.06);
  const butuh = k('butuh', n15b, 25.86);
  const n475 = k('475', butuh, 26.6);
  const tahun5 = k('tahun', n475, 28.18);
  // 6
  const mulai6 = k('mulai', s[5].mulai, 29.14);
  const n475b = k('475', mulai6, 29.84);
  const lalu = k('lalu', n475b, 31.34);
  const selesai = k('selesai', lalu, 32.32);
  const hariIni = k('hari', selesai, 32.64);
  // 7
  const tujuh = k('tujuh', s[6].mulai, 34.48);
  const banyak7 = k('banyak', tujuh, 35.26);
  const llama2a = k('llama', banyak7, 36.96);
  // 8
  const dikumpulin = k('dikumpulin', s[7].mulai, 38.5);
  const terbuka = k('terbuka', dikumpulin, 39.72);
  const kode = k('kode', terbuka, 41.2);
  const empat = k('empat', kode, 42.5);
  const llama2b = k('llama', empat, 43.64);
  // 9
  const n5 = k('5', s[8].mulai, 44.96);
  const bukan9 = k('bukan', n5, 45.92);
  const inggris = k('inggris', bukan9, 46.3);
  const n30 = k('30', inggris, 47.82);
  const bahasa9 = k('bahasa', n30, 48.26);
  // 10
  const disaring = k('disaring', s[9].mulai, 50.7);
  const kembar = k('kembar', disaring, 51.66);
  const pantas = k('pantas', kembar, 53.14);
  const kualitas10 = k('kualitasnya', pantas, 54.36);
  const dinilai = k('dinilai', kualitas10, 54.94);
  // 11
  const penilai = s[10].mulai;
  const llama2c = k('llama', penilai, 58.06);
  const versiLama = k('versi', llama2c, 59.66);
  const milihin = k('milihin', versiLama, 60.74);
  const barunya = k('barunya', milihin, 61.84);
  // 12
  const diproses = k('diproses', s[11].mulai, 63.8);
  const dua12 = k('dua', diproses, 64.5);
  const masing = k('masing-masing', dua12, 65.84);
  const n24 = k('24', masing, 66.94);
  const gpu = k('gpu', n24, 67.98);
  // 13
  const angka13 = k('angka-angka', s[12].mulai, 69.98);
  const disetel = k('disetel', angka13, 71.3);
  const llama3b = k('llama', disetel, 72.84);
  const kecil = k('kecil', llama3b, 73.6);
  const n8 = k('8', kecil, 74.48);
  const miliar13 = k('miliar', n8, 75.04);
  // 14
  const takaran = k('takaran', s[13].mulai, 76.26);
  const peneliti = k('peneliti', takaran, 77.22);
  const cukup = k('cukup', peneliti, 78.82);
  const n200 = k('200', cukup, 80.04);
  const token14 = k('token', n200, 80.88);
  // 15
  const n75 = k('75', s[14].mulai, 82.74);
  const lipatnya = k('lipatnya', n75, 83.58);
  const ternyata = k('ternyata', lipatnya, 84.4);
  const terus15 = k('terus', ternyata, 85.98);
  const bagus = k('bagus', terus15, 86.44);
  // 16
  const nyambung = k('nyambung', s[15].mulai, 88.38);
  const topik = k('topik', nyambung, 88.94);
  const belajar16 = k('belajar', topik, 89.72);
  const mungkin = k('mungkin', belajar16, 91.42);
  const satuOrang = k('satu', mungkin, 92.14);
  const orangAkhir = a('orang', satuOrang, 92.62);
  return {
    total, s,
    meta, dilatih, n15, token1,
    potongan, teks2, satu2, utuh, sepotong,
    baca3, satu3, detik3, tidur, berhenti,
    n86400, token4, setahun, n315, juta4,
    n15b, butuh, n475, tahun5,
    mulai6, n475b, lalu, selesai, hariIni,
    tujuh, banyak7, llama2a,
    dikumpulin, terbuka, kode, empat, llama2b,
    n5, bukan9, inggris, n30, bahasa9,
    disaring, kembar, pantas, kualitas10, dinilai,
    penilai, llama2c, versiLama, milihin, barunya,
    diproses, dua12, masing, n24, gpu,
    angka13, disetel, llama3b, kecil, n8, miliar13,
    takaran, peneliti, cukup, n200, token14,
    n75, lipatnya, ternyata, terus15, bagus,
    nyambung, topik, belajar16, mungkin, satuOrang, orangAkhir,
    pulang: Math.max(orangAkhir + 0.1, total - 1.1),
    loop: total - 0.3,
  };
}
export type WaktuL = ReturnType<typeof waktuLlama>;
