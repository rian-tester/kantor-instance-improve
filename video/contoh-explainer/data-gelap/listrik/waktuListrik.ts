// Detik penting explainer A2 "Listrik ChatGPT vs Google" (konten contoh), DIIKAT ke kata & kalimat VO
// (public/listrik/data.json). VO direvisi = bikin ulang data.json (alat suara-olah → transkrip ulang → cek-suara).
// Angka cadangan = VO 17/10.
import { akhirKata, kata, type Kata } from "../../../src/gerak";
import type { Kalimat } from "../raja/waktuRaja";

const CAD: [number, number][] = [
  [0.18, 5.0], [5.46, 10.68], [11.1, 17.38], [17.82, 23.48], [23.9, 28.64], [29.08, 35.3], [35.78, 43.34], [43.74, 48.94], [49.34, 54.12], [54.52, 58.42],
];

export function waktuListrik(d: Kata[], total: number, kal: Kalimat[] = []) {
  const s = CAD.map((c, i) => ({ mulai: kal[i]?.mulai ?? c[0], akhir: kal[i]?.akhir ?? c[1] }));
  const k = (c: string, setelah = 0, cad = 0) => kata(d, c, setelah, cad);
  const a = (c: string, setelah = 0, cad = 0) => akhirKata(d, c, setelah, cad);
  // 1
  const chatgpt1 = k('chatgpt', s[0].mulai, 1.22);
  const sepuluh = k('sepuluh', chatgpt1, 3.4);
  const google1 = k('google', sepuluh, 4.72);
  // 2
  const electricity = k('electricity', s[1].mulai, 6.76);
  const th2024 = k('2024', electricity, 7.52);
  const iea = k('iea', th2024, 8.86);
  const badan = k('badan', iea, 9.46);
  // 3
  const google3 = k('google', s[2].mulai, 12.3);
  const n03 = k('03', google3, 13.04);
  const chatgpt3 = k('chatgpt', n03, 15.38);
  const n29 = k('29', chatgpt3, 16.16);
  // 4
  const lampu = k('lampu', s[3].mulai, 18.38);
  const watt4 = k('watt', lampu, 19.44);
  const nyala = k('nyala', watt4, 19.7);
  const n17 = k('17', nyala, 20.44);
  const sedangkan = k('sedangkan', n17, 21.44);
  const google4 = k('google', sedangkan, 22.2);
  const n2 = k('2', google4, 23.12);
  // 5
  const chip5 = k('chip', s[4].mulai, 24.78);
  const ngitung5 = k('ngitung', chip5, 25.86);
  const potongan = k('potongan', ngitung5, 27.08);
  const token = k('token', potongan, 28.36);
  // 6
  const n29b = k('29', s[5].mulai, 29.66);
  const awal6 = k('awal', n29b, 31.32);
  const th2023 = k('2023', awal6, 31.72);
  const google6 = k('google', th2023, 33.1);
  const th2009 = k('2009', google6, 34.74);
  // 7
  const th2025 = k('2025', s[6].mulai, 36.1);
  const epoch = k('epoch', th2025, 37.76);
  const ulang = k('ulang', epoch, 38.74);
  const gpt4o = k('gpt', ulang, 40.92);
  const sekitar7 = k('sekitar', gpt4o, 41.78);
  const n03b = k('03', sekitar7, 42.26);
  // 8
  const model8 = k('model', s[7].mulai, 44.5);
  const chip8 = k('chip', model8, 44.98);
  const hemat = k('hemat', chip8, 45.78);
  const hitungan8 = k('hitungan', hemat, 46.54);
  const panjang8 = k('panjang', hitungan8, 48.62);
  // 9
  const jawaban9 = k('jawaban', s[8].mulai, 50.02);
  const panjang9 = k('panjang', jawaban9, 50.34);
  const reasoning = k('reasoning', panjang9, 51.32);
  const mikir = k('mikir', reasoning, 51.84);
  const bisa = k('bisa', mikir, 52.58);
  const banyak = k('banyak', bisa, 53.84);
  // 10
  const simpan = s[9].mulai;
  const follow = k('follow', simpan, 56.96);
  const akhirVO = a('berikutnya', follow, s[9].akhir);
  return {
    total, s,
    chatgpt1, sepuluh, google1,
    electricity, th2024, iea, badan,
    google3, n03, chatgpt3, n29,
    lampu, watt4, nyala, n17, sedangkan, google4, n2,
    chip5, ngitung5, potongan, token,
    n29b, awal6, th2023, google6, th2009,
    th2025, epoch, ulang, gpt4o, sekitar7, n03b,
    model8, chip8, hemat, hitungan8, panjang8,
    jawaban9, panjang9, reasoning, mikir, bisa, banyak,
    simpan, follow, akhirVO,
    // momen turunan
    keDok: s[1].mulai - 0.25, // kamera pindah ke laporan IEA
    balik: s[2].mulai - 0.5, // kamera balik ke pilar
    keChip: s[4].mulai - 0.15,
    keGaris: s[5].mulai - 0.1, // lantai jadi garis waktu
    keluarDunia: Math.max(banyak + 0.4, simpan - 0.25), // klimaks 'jauh lebih banyak' ditahan, dunia turun sebelum CTA
    keluarCta: Math.max(akhirVO + 0.12, total - 1.0),
    loop: total - 0.3,
  };
}
export type WaktuL = ReturnType<typeof waktuListrik>;
