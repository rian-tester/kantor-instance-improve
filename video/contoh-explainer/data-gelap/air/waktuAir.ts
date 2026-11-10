// Detik penting explainer A3 "Sebotol air tiap 10–50 jawaban" (konten contoh), DIIKAT ke kata & kalimat VO
// (public/air/data.json). Angka cadangan = VO 17/10.
import { akhirKata, kata, type Kata } from "../../../src/gerak";
import type { Kalimat } from "../raja/waktuRaja";

const CAD: [number, number][] = [
  [0.2, 6.82], [7.16, 13.42], [13.76, 18.46], [18.8, 23.54], [23.9, 26.16], [26.5, 30.4], [30.72, 37.44], [37.8, 42.54], [42.88, 49.52], [49.86, 53.58], [53.94, 58.06],
];

export function waktuAir(d: Kata[], total: number, kal: Kalimat[] = []) {
  const s = CAD.map((c, i) => ({ mulai: kal[i]?.mulai ?? c[0], akhir: kal[i]?.akhir ?? c[1] }));
  const k = (c: string, setelah = 0, cad = 0) => kata(d, c, setelah, cad);
  const a = (c: string, setelah = 0, cad = 0) => akhirKata(d, c, setelah, cad);
  // 1
  const diperkirakan = k('diperkirakan', s[0].mulai, 1.42);
  const minum = k('minum', diperkirakan, 2.16);
  const n500 = k('500', minum, 3.46);
  const n10 = k('10', n500 + 0.1, 5.0);
  const n50 = k('50', n10 + 0.05, 5.94);
  // 2
  const peneliti = k('peneliti', s[1].mulai, 8.12);
  const uc = k('uc', peneliti, 8.62);
  const ut = k('ut', uc, 9.7);
  const gpt3 = k('gpt3', ut, 11.38);
  const microsoft2 = k('microsoft', gpt3, 12.9);
  // 3
  const dua3 = k('dua', s[2].mulai, 14.76);
  const dinginin = k('dinginin', dua3, 15.76);
  const pembangkit3 = k('pembangkit', dinginin, 17.0);
  const listriknya3 = k('listriknya', pembangkit3, 18.02);
  // 4
  const menara = k('menara', s[3].mulai, 18.9);
  const air4 = k('air', menara, 20.28);
  const diuapin = k('diuapin', air4, 20.96);
  const panas = k('panas', diuapin, 22.0);
  const dilepas = k('dilepas', panas, 22.68);
  // 5
  const menguap = k('menguap', s[4].mulai, 24.22);
  const diminum = k('diminum', menguap, 25.66);
  // 6
  const panjangnya = k('panjangnya', s[5].mulai, 27.86);
  const n150 = k('150', panjangnya, 28.34);
  const n300 = k('300', n150, 29.7);
  // 7
  const amerika = k('amerika', s[6].mulai, 31.86);
  const n17 = k('17', amerika, 34.14);
  const n30 = k('30', n17, 36.18);
  const botol7 = a('botol', n30, 37.44);
  // 8
  const n15 = k('15', s[7].mulai, 38.1);
  const pembangkit8 = k('pembangkit', n15, 39.72);
  const n2 = k('2', pembangkit8, 41.26);
  const pendingin8 = k('pendingin', n2, 42.14);
  // 9
  const indonesia = k('indonesia', s[8].mulai, 44.08);
  const juli = k('juli', indonesia, 45.0);
  const dibangun = k('dibangun', juli, 46.48);
  const sekitar9 = k('sekitar', dibangun, 47.68);
  const n25 = k('25', sekitar9, 48.1);
  // 10
  const lokasi = k('lokasi', s[9].mulai, 50.84);
  const jam = k('jam', lokasi, 51.36);
  const cuaca = k('cuaca', jam, 52.18);
  const sumber = k('sumber', cuaca, 52.88);
  // 11
  const simpan = s[10].mulai;
  const follow = k('follow', simpan, 56.36);
  const akhirVO = a('berikutnya', follow, s[10].akhir);
  return {
    total, s,
    diperkirakan, minum, n500, n10, n50,
    peneliti, uc, ut, gpt3, microsoft2,
    dua3, dinginin, pembangkit3, listriknya3,
    menara, air4, diuapin, panas, dilepas,
    menguap, diminum,
    panjangnya, n150, n300,
    amerika, n17, n30, botol7,
    n15, pembangkit8, n2, pendingin8,
    indonesia, juli, dibangun, sekitar9, n25,
    lokasi, jam, cuaca, sumber,
    simpan, follow, akhirVO,
    // momen turunan
    keKertas: s[1].mulai - 0.25,
    keLuas: s[2].mulai - 0.35, // kamera mundur: botol + data center + pembangkit
    keMenara: s[3].mulai - 0.05,
    keBotol: s[5].mulai - 0.3,
    // botol AS dikuras 30 tegukan (= 30 jawaban), habis sebelum kalimat 8
    kuras7: [n30 - 0.25, Math.min(n30 + 1.0, s[7].mulai - 0.3)] as [number, number],
    // dua botol dikuras barengan, kecepatan jawaban sama: Indonesia habis di 25, AS lanjut ke 30
    kuras9: [sekitar9 - 0.1, n25 + 0.75] as [number, number],
    keluarDunia: simpan - 0.2,
    keluarCta: Math.max(akhirVO + 0.12, total - 1.0),
    loop: total - 0.3,
  };
}
export type WaktuA = ReturnType<typeof waktuAir>;
