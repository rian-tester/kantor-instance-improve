// Detik penting explainer "Raja − Pria + Wanita = Ratu" (konten contoh), DIIKAT ke kata & kalimat VO
// (public/raja/data.json). VO direvisi = bikin ulang data.json (alat suara-olah → transkrip ulang → cek-suara),
// animasi ikut geser. Angka cadangan = VO 16/10.
import { akhirKata, kata, type Kata } from "../../../src/gerak";

export type Kalimat = { mulai: number; akhir: number; teks: string };

const CAD: [number, number][] = [
  [0.18, 6.3], [6.72, 12.74], [13.24, 19.9], [20.3, 27.06], [27.46, 32.66], [33.1, 38.16], [38.56, 42.76], [43.16, 48.72],
  [49.14, 52.08], [52.52, 59.46], [59.86, 67.18], [67.58, 74.1], [74.5, 81.78], [82.2, 87.54], [87.96, 92.84],
];

export function waktuRaja(d: Kata[], total: number, kal: Kalimat[] = []) {
  const K = (i: number) => ({ mulai: kal[i]?.mulai ?? CAD[i][0], akhir: kal[i]?.akhir ?? CAD[i][1] });
  const k = (c: string, setelah = 0, cad = 0) => kata(d, c, setelah, cad);
  const a = (c: string, setelah = 0, cad = 0) => akhirKata(d, c, setelah, cad);
  const s = Array.from({ length: 15 }, (_, i) => K(i));
  const [k1, k2, k3, k4, k5, k6, k7, k8, k9, k10, k11, k12, k13, k14, k15] = s;
  // 1
  const raja1 = k('raja', k1.mulai, 1.94);
  const bukan1 = k('bukan', raja1, 2.96);
  const tulisan = k('tulisan', bukan1, 3.22);
  const deretan = k('deretan', tulisan, 4.56);
  const ratusan = k('ratusan', deretan, 5.2);
  const angka1 = k('angka', ratusan, 5.84);
  // 2
  const alamat2 = k('alamat', k2.mulai, 7.84);
  const peta2 = k('peta', alamat2, 8.4);
  const raksasa2 = k('raksasa', peta2, 8.62);
  const kata2 = k('kata', raksasa2, 9.62);
  const mirip = k('mirip', kata2, 10.56);
  const letaknya = k('letaknya', mirip, 11.46);
  const berdekatan = k('berdekatan', letaknya, 11.88);
  // 3
  const tahun = k('tahun', k3.mulai, 13.24);
  const th2013 = k('2013', tahun, 13.68);
  const tiga3 = k('tiga', th2013, 15.1);
  const peneliti = k('peneliti', tiga3, 15.4);
  const microsoft = k('microsoft', peneliti, 16.0);
  const nyobain = k('nyobain', microsoft, 17.32);
  const hitungan3 = k('hitungan', nyobain, 17.98);
  const aneh = k('aneh', hitungan3, 18.5);
  // 4
  const dibentuk = k('dibentuk', k4.mulai, 21.24);
  const sendiri4 = k('sendiri', dibentuk, 21.62);
  const dari4 = k('dari', sendiri4, 23.12);
  const n320 = k('320', dari4, 23.46);
  const juta = k('juta', n320, 24.58);
  const transkrip = k('transkrip', juta, 25.2);
  const tv = k('tv', transkrip, 26.04);
  const radio = k('radio', tv, 26.52);
  // 5
  const latihan = k('latihan', k5.mulai, 27.82);
  const tugas = k('tugas', latihan, 28.74);
  const satu5 = k('satu', tugas, 29.92);
  const nebak = k('nebak', satu5, 30.64);
  const berikutnya = k('berikutnya', nebak, 31.34);
  const kalimat5 = k('kalimat', berikutnya, 32.1);
  // 6
  const disetel = k('disetel', k6.mulai, 34.5);
  const sedikit6 = k('sedikit', disetel, 35.2);
  const biar = k('biar', sedikit6, 36.82);
  const tepat = k('tepat', biar, 37.68);
  // 7
  const raja7 = k('raja', k7.mulai, 39.1);
  const dikurangi = k('dikurangi', raja7, 39.96);
  const pria7 = k('pria', dikurangi, 40.54);
  const ditambah = k('ditambah', pria7, 41.54);
  const wanita7 = k('wanita', ditambah, 42.12);
  const wanita7a = a('wanita', ditambah, 42.7);
  // 8
  const titik8 = k8.mulai;
  const hasil8 = k('hasil', titik8, 43.48);
  const gak8 = k('gak', hasil8, 45.04);
  const nempel = k('nempel', gak8, 45.64);
  const dicari = k('dicari', nempel, 47.14);
  const tetangga = k('tetangga', dicari, 47.74);
  const terdekat = k('terdekatnya', tetangga, 48.08);
  // 9
  const jatuh = k('jatuh', k9.mulai, 50.18);
  const dekat9 = k('dekat', jatuh, 50.8);
  const ratu = k('ratu', dekat9, 51.6);
  // 10
  const ngajarin = k('ngajarin', k10.mulai, 53.16);
  const aturan = k('aturan', ngajarin, 53.52);
  const hubungan = k('hubungan', aturan, 54.54);
  const kebentuk = k('kebentuk', hubungan, 56.14);
  const cara = k('cara', kebentuk, 57.5);
  const banyak10 = k('banyak', cara, 58.72);
  // 11
  const pola = k11.mulai;
  const jamak11 = k('jamak', pola, 61.6);
  const inggris = k('inggris', jamak11, 62.08);
  const apple = k('apple', inggris, 63.24);
  const apples = k('apples', apple, 64.04);
  const hampir11 = k('hampir', apples, 64.86);
  const car = k('car', hampir11, 66.2);
  const cars = k('cars', car, 66.7);
  // 12
  const ngetes = k('ngetes', k12.mulai, 67.78);
  const n8000 = k('8.000', ngetes, 69.26);
  const soal12 = k('soal', n8000, 70.02);
  const jamak12 = k('jamak', soal12, 72.42);
  const lampau = k('lampau', jamak12, 73.64);
  // 13
  const n40 = k('40', k13.mulai, 74.98);
  const persen13 = k('persen', n40, 75.56);
  const kejawab = k('kejawab', persen13, 76.16);
  const geser = k('geser', kejawab, 78.2);
  const padahal = k('padahal', geser, 79.52);
  const asal = k('asal', padahal, 80.44);
  const n1 = k('1', asal, 81.04);
  // 14
  const belajar = k('belajar', k14.mulai, 83.36);
  const makna = k('makna', belajar, 83.86);
  const jarak14 = k('jarak', makna, 84.64);
  const arah = k('arah', jarak14, 85.38);
  const bukan14 = k('bukan', arah, 86.56);
  const kamus = k('kamus', bukan14, 86.96);
  // 15
  const model = k15.mulai;
  const ngubah = k('ngubah', model, 89.32);
  const kata15 = k('kata', ngubah, 89.76);
  const angka15 = k('angka', kata15, 90.26);
  const ngolah = k('ngolah', angka15, 91.84);
  const kamu = k('kamu', ngolah, 92.5);
  const kamuAkhir = a('kamu', ngolah, 92.84);
  return {
    total, s, k1, k2, k3, k4, k5, k6, k7, k8, k9, k10, k11, k12, k13, k14, k15,
    raja1, bukan1, tulisan, deretan, ratusan, angka1,
    alamat2, peta2, raksasa2, kata2, mirip, letaknya, berdekatan,
    tahun, th2013, tiga3, peneliti, microsoft, nyobain, hitungan3, aneh,
    dibentuk, sendiri4, dari4, n320, juta, transkrip, tv, radio,
    latihan, tugas, satu5, nebak, berikutnya, kalimat5,
    disetel, sedikit6, biar, tepat,
    raja7, dikurangi, pria7, ditambah, wanita7, wanita7a,
    titik8, hasil8, gak8, nempel, dicari, tetangga, terdekat,
    jatuh, dekat9, ratu,
    ngajarin, aturan, hubungan, kebentuk, cara, banyak10,
    pola, jamak11, inggris, apple, apples, hampir11, car, cars,
    ngetes, n8000, soal12, jamak12, lampau,
    n40, persen13, kejawab, geser, padahal, asal, n1,
    belajar, makna, jarak14, arah, bukan14, kamus,
    model, ngubah, kata15, angka15, ngolah, kamu, kamuAkhir,
    // momen turunan
    lompat: k7.mulai - 0.05, // kamera lompat dari panel setel ke jajaran genjang
    geserPanah: wanita7a + 0.05, // panah pria→wanita disalin & digeser ke raja
    hasilMuncul: wanita7a + 0.75,
    keInggris: k11.mulai - 0.25,
    keUji: k12.mulai - 0.25,
    kePeta14: k14.mulai - 0.3,
    pulang: Math.max(kamuAkhir + 0.05, total - 1.45), // zoom balik ke raja (bookend → loop)
    loop: total - 0.32,
  };
}
export type WaktuR = ReturnType<typeof waktuRaja>;
