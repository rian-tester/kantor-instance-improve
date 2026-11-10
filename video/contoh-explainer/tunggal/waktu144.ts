// Semua detik penting video 144Hz, DIIKAT ke kata & kalimat VO (data.json). Kalau naskah/VO direvisi, cukup bikin
// ulang data.json (alat suara-olah → transkrip ulang → cek-suara): animasi ikut geser. Batas adegan = awal/akhir kalimat; kata dicari
// mulai dari awal kalimatnya. Angka cadangan = detik VO 16/10 (naskah final 8 kalimat), dipakai kalau kata gak ketemu.
import { akhirKata, kata, type Kata } from "../../src/gerak";

export type Kalimat = { mulai: number; akhir: number; teks: string };

const CADANGAN_KALIMAT: [number, number][] = [
  [0.1, 5.08], [5.36, 10.28], [10.56, 16.6], [16.88, 20.76], [21.04, 24.64], [24.92, 29.0], [29.28, 33.9], [34.18, 37.7],
];

export function hitungWaktu(d: Kata[], total: number, kal: Kalimat[] = []) {
  const K = (i: number) => ({ mulai: kal[i]?.mulai ?? CADANGAN_KALIMAT[i][0], akhir: kal[i]?.akhir ?? CADANGAN_KALIMAT[i][1] });
  const k = (c: string, setelah = 0, cad = 0) => kata(d, c, setelah, cad);
  const a = (c: string, setelah = 0, cad = 0) => akhirKata(d, c, setelah, cad);
  const [k1, k2, k3, k4, k5, k6, k7, k8] = [0, 1, 2, 3, 4, 5, 6, 7].map(K);
  // 1. Udah bayar monitor 144 hertz, tapi Windows-nya masih di 60 hertz?
  const udah = k('udah', k1.mulai, 0.1);
  const bayar = k('bayar', udah, 0.34);
  const seratus = k('seratus', bayar, 1.1);
  const tapi = k('tapi', seratus, 2.86);
  const windows1 = k('windows', tapi, 3.36);
  const enam = k('enam', windows1, 4.4);
  // 2. Hertz itu berapa kali layar ganti gambar tiap detik, Windows nyebutnya refresh rate.
  const hertzB = k2.mulai;
  const berapa = k('berapa', k2.mulai, 6.0);
  const kali = k('kali', berapa, 6.32);
  const layar = k('layar', kali, 6.56);
  const ganti = k('ganti', layar, 6.84);
  const gambar = k('gambar', ganti, 7.1);
  const tiap = k('tiap', gambar, 7.4);
  const detik = k('detik', tiap, 7.62);
  const windowsB = k('windows', detik, 8.3);
  const nyebutnya = k('nyebutnya', windowsB, 8.76);
  const refreshB = k('refresh', nyebutnya, 9.52);
  // 3. Di Windows sebelas, buka Start, Settings, System, Display, terus Advanced display.
  const windows2 = k('windows', k3.mulai, 10.66);
  const sebelas = k('sebelas', windows2, 10.98);
  const start = k('start', sebelas, 12.12);
  const settings = k('settings', start, 12.74);
  const system = k('system', settings, 13.54);
  const display = k('display', system, 14.32);
  const advanced = k('advanced', display, 15.66);
  // 4. Di bagian Choose a refresh rate, pilih angka yang paling tinggi.
  const bagian = k4.mulai;
  const choose = k('choose', k4.mulai, 17.6);
  const rateAkhir = a('rate', choose, 18.76);
  const pilih = k('pilih', choose, 19.08);
  const angka1 = k('angka', pilih, 19.48);
  const paling = k('paling', angka1, 20.06);
  const tinggi = k('tinggi', paling, 20.42);
  // 5. Aku dulu juga kelewat bagian ini, padahal tinggal klik doang.
  const aku1 = k5.mulai;
  const dulu = k('dulu', aku1, 21.26);
  const juga = k('juga', dulu, 21.5);
  const kelewat = k('kelewat', juga, 21.72);
  const bagian2 = k('bagian', kelewat, 22.2);
  const ini = k('ini', bagian2, 22.56);
  const padahal = k('padahal', ini, 23.16);
  const tinggal = k('tinggal', padahal, 23.68);
  const klik = k('klik', tinggal, 23.96);
  // 6. Angka yang ada tanda bintangnya gak support resolusi yang lagi kalian pakai.
  const angka2 = k6.mulai;
  const ada = k('ada', angka2, 25.42);
  const tanda = k('tanda', ada, 25.6);
  const bintang = k('bintangnya', tanda, 25.86);
  const gak = k('gak', bintang, 26.56);
  const support = k('support', gak, 26.82);
  const resolusi = k('resolusi', support, 27.24);
  const yang = k('yang', resolusi, 27.8);
  const lagi = k('lagi', yang, 27.98);
  const pakai = k('pakai', lagi, 28.6);
  const pakaiAkhir = k6.akhir;
  // 7. Aku sih sayang banget kalau monitornya udah dibeli, tapi yang dipakai cuma enam puluh.
  const sayang = k('sayang', k7.mulai, 29.64);
  const banget = k('banget', sayang, 30.0);
  const udah7 = k('udah', banget, 31.18);
  const dibeli = k('dibeli', udah7, 31.36);
  const dipakai = k('dipakai', dibeli, 32.6);
  const cuma = k('cuma', dipakai, 33.08);
  const enam7 = k('enam', cuma, 33.52);
  // 8. Pas kalian cek barusan, monitor kalian kepasang di berapa hertz?
  const pas = k8.mulai;
  const kalian = k('kalian', pas, 34.36);
  const cek = k('cek', kalian, 34.68);
  const barusan = k('barusan', cek, 34.86);
  const monitor8 = k('monitor', barusan, 35.66);
  const kalian8 = k('kalian', monitor8, 36.04);
  const kepasang = k('kepasang', kalian8, 36.52);
  const berapa2 = k('berapa', kepasang, 37.02);
  const hertz3 = k('hertz', berapa2, 37.34);

  return {
    total,
    udah, bayar, seratus, tapi, windows1, enam,
    hertzB, berapa, kali, layar, ganti, gambar, tiap, detik, windowsB, nyebutnya, refreshB,
    windows2, sebelas, start, settings, system, display, advanced,
    bagian, choose, rateAkhir, pilih, angka1, paling, tinggi,
    aku1, dulu, juga, kelewat, bagian2, ini, padahal, tinggal, klik,
    angka2, ada, tanda, bintang, gak, support, resolusi, yang, lagi, pakai, pakaiAkhir,
    sayang, banget, udah7, dibeli, dipakai, cuma, enam7,
    pas, kalian, cek, barusan, monitor8, kalian8, kepasang, berapa2, hertz3,
    // ---- momen turunan ----
    pop144: 0.15, // hook: angka muncul 0,15 dtk
    coret: 0.3, // coretan ditarik 0,30–0,43
    banting: 0.46, // stempel 60Hz dibanting, mendarat 0,54
    pindahAB: k2.mulai - 0.3, // kamera turun ke jam refresh
    sampaiB: k2.mulai + 0.4,
    sapuMulai: berapa, // jarum jam muter "1 detik" (dilambatin)
    sapuAkhir: detik + 0.45,
    pindahBC: k3.mulai - 0.3, // kamera turun ke layar Windows
    sampaiC: k3.mulai + 0.26,
    bukaDropdown: rateAkhir,
    tempel: bagian + 0.3, // label 60 Hz nempel di dropdown
    pindahE: angka2 - 0.05,
    bintangDarat: bintang + 0.24,
    terbang: pakaiAkhir - 0.02, // kamera terbang balik ke monitor (kalimat 7)
    sampaiF: pakaiAkhir + 0.68,
    loop: Math.max(hertz3 + 0.62, total - 0.78), // semua keluar → frame terakhir = frame pertama
  };
}

export type Waktu = ReturnType<typeof hitungWaktu>;
