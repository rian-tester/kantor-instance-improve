// Detik penting explainer strawberry, DIIKAT ke kata & kalimat VO (public/strawberry/data.json). Naskah direvisi =
// bikin ulang data.json (alat suara-olah → transkrip ulang → cek-suara), animasi ikut geser. Cadangan = VO 16/10.
import { akhirKata, kata, type Kata } from "../../src/gerak";
import type { Kalimat } from "./waktu144";

const CAD: [number, number][] = [
  [0.1, 5.4], [5.7, 10.8], [11.1, 14.86], [15.16, 20.66], [20.96, 25.78], [26.08, 30.04], [30.34, 36.44], [36.74, 40.92],
];

export function waktuStrawberry(d: Kata[], total: number, kal: Kalimat[] = []) {
  const K = (i: number) => ({ mulai: kal[i]?.mulai ?? CAD[i][0], akhir: kal[i]?.akhir ?? CAD[i][1] });
  const k = (c: string, setelah = 0, cad = 0) => kata(d, c, setelah, cad);
  const a = (c: string, setelah = 0, cad = 0) => akhirKata(d, c, setelah, cad);
  const [k1, k2, k3, k4, k5, k6, k7, k8] = [0, 1, 2, 3, 4, 5, 6, 7].map(K);
  // 1
  const viral = k('viral', k1.mulai, 1.54);
  const salah1 = k('salah', viral, 2.66);
  const huruf1 = k('huruf', salah1, 3.26);
  const r1 = k('r', huruf1, 3.84);
  const straw1 = k('strawberry', r1, 4.44);
  // 2
  const gak2 = k('gak', k2.mulai, 6.14);
  const tulisan = k('tulisan', gak2, 7.52);
  const dipotong = k('dipotong', tulisan, 8.06);
  const bagian = k('bagian', dipotong, 9.08);
  const token2 = k('token', bagian, 10.2);
  // 3
  const diubah = k('diubah', k3.mulai, 11.98);
  const angka3 = k('angka', diubah, 12.54);
  const diolah = k('diolah', angka3, 13.7);
  const ainya = k('ai', diolah, 14.34);
  // 4
  const versi = k('versi', k4.mulai, 15.72);
  const straw4 = k('strawberry', versi, 16.96);
  const dipotong4 = k('dipotong', straw4, 17.62);
  const tiga = k('tiga', dipotong4, 18.18);
  const este = k('es', tiga, 19.08);
  const raw = k('raw', este, 19.7);
  const berry = k('berry', raw, 20.3);
  // 5
  const straw5 = k('strawberry', k5.mulai, 22.12);
  const tengah = k('tengah', straw5, 22.84);
  const sepuluh = k('sepuluh', tengah, 24.06);
  const cuma5 = k('cuma', sepuluh, 24.78);
  const satu5 = k('satu', cuma5, 25.1);
  const angka5 = k('angka', satu5, 25.4);
  // 6
  const liat = k('liat', k6.mulai, 26.44);
  const potongan = k('potongan', liat, 26.88);
  const angka6 = k('angka', potongan, 27.74);
  const huruf6 = k('huruf', angka6, 28.38);
  const keliatan = k('keliatan', huruf6, 29.18);
  // 7
  const wajar = k('wajar', k7.mulai, 30.58);
  const triknya = k('triknya', wajar, 32.34);
  const ngeja = k('ngeja', triknya, 33.46);
  const satusatu = k('satu', ngeja, 34.4);
  const baru = k('baru', satusatu, 35.44);
  const ngitung = k('ngitung', baru, 35.8);
  const ngitungAkhir = a('ngitung', baru, 36.44);
  // 8
  const pernah = k('pernah', k8.mulai, 36.9);
  const percaya = k('percaya', pernah, 37.46);
  const hitungan = k('hitungan', percaya, 37.82);
  const ngaku = k('ngaku', hitungan, 39.7);
  const deh = k('deh', ngaku, 40.28);
  return {
    total, k1, k2, k3, k4, k5, k6, k7, k8,
    viral, salah1, huruf1, r1, straw1,
    gak2, tulisan, dipotong, bagian, token2,
    diubah, angka3, diolah, ainya,
    versi, straw4, dipotong4, tiga, este, raw, berry,
    straw5, tengah, sepuluh, cuma5, satu5, angka5,
    liat, potongan, angka6, huruf6, keliatan,
    wajar, triknya, ngeja, satusatu, baru, ngitung, ngitungAkhir,
    pernah, percaya, hitungan, ngaku, deh,
    // momen turunan
    tanya: 0.12, // hook: pertanyaan muncul
    jawab: 0.38, // gelembung jawaban AI
    coret: 0.6, // jawaban dicoret
    stempel: 0.82, // stempel SALAH
    keB: k2.mulai - 0.05, // pita kalimat lepas dari gelembung → kamera ke meja token
    diB: k2.mulai + 0.8,
    keC: k4.mulai - 0.3, // kata strawberry terbang ke meja potong
    diC: k4.mulai + 0.45,
    balikB: k5.mulai - 0.05, // 3 potongan dibawa balik ke kalimat
    diB2: k5.mulai + 0.75,
    lebur: cuma5 + 0.06, // 3 potongan ambruk jadi 1 angka
    keA: k8.mulai - 0.3, // balik ke chat (bookend)
    diA: k8.mulai + 0.45,
    loop: Math.max(deh + 0.65, total - 0.75),
  };
}
export type WaktuS = ReturnType<typeof waktuStrawberry>;
