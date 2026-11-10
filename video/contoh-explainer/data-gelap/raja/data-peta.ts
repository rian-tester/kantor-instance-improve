// Peta makna (ILUSTRASI 2D; aslinya ratusan dimensi). Koordinat dunia px. Vektor "pria→wanita" (G) dipakai sama persis buat
// pasangan lain biar jajaran genjangnya kebaca; ratu sengaja digeser dikit dari titik hasil (hitungan gak pernah pas nempel).
import { random } from 'remotion';

export const DUNIA = { w: 7600, h: 5000 };
// panel uji 8.000 soal (S12–13): waffle 125 × 64 + 2 batang
export const WAFFLE = { kol: 125, bar: 64, sel: 8, isi: 6 };
export const PANEL = { x: 5700, y: 2150, w: 1080, h: 900 };

export const G = { x: 460, y: 210 }; // arah "pria → wanita"
export const P = { x: 400, y: -170 }; // arah "tunggal → jamak" (Inggris)

export const RAJA = { x: 3700, y: 2250 };
export const RAJA0 = { x: 3610, y: 2330 }; // posisi raja sebelum disetel (S6)
export const PRIA = { x: 3000, y: 2850 };
export const WANITA = { x: PRIA.x + G.x, y: PRIA.y + G.y };
export const HASIL = { x: RAJA.x + G.x, y: RAJA.y + G.y };
export const RATU = { x: HASIL.x + 32, y: HASIL.y - 20 };

export type Kata = { id: string; t: string; x: number; y: number; besar?: boolean; gugus: string };

const tambah = (a: { x: number; y: number }, b: { x: number; y: number }) => ({ x: a.x + b.x, y: a.y + b.y });
const pas = (id: string, t: string, p: { x: number; y: number }, gugus: string, besar = false): Kata => ({ id, t, x: p.x, y: p.y, gugus, besar });

// pasangan gender (S10): semua pakai arah G
export const PASANGAN_G: [string, string][] = [
  ['ayah', 'ibu'],
  ['kakek', 'nenek'],
  ['paman', 'bibi'],
  ['pangeran', 'putri'],
];
const AYAH = { x: 2420, y: 2480 };
const KAKEK = { x: 2250, y: 3000 };
const PAMAN = { x: 1850, y: 2600 };
const PANGERAN = { x: 3950, y: 1850 };

export const APPLE = { x: 1100, y: 3850 };
export const CAR = { x: 1700, y: 4250 };

export const KATA: Kata[] = [
  // kerajaan
  pas('raja', 'raja', RAJA, 'kerajaan', true),
  pas('ratu', 'ratu', RATU, 'kerajaan', true),
  pas('pangeran', 'pangeran', PANGERAN, 'kerajaan'),
  pas('putri', 'putri', tambah(PANGERAN, G), 'kerajaan'),
  pas('mahkota', 'mahkota', { x: 4420, y: 2400 }, 'kerajaan'),
  pas('takhta', 'takhta', { x: 3940, y: 2560 }, 'kerajaan'),
  pas('istana', 'istana', { x: 3330, y: 2120 }, 'kerajaan'),
  pas('kerajaan', 'kerajaan', { x: 4620, y: 1960 }, 'kerajaan'),
  // keluarga / orang
  pas('pria', 'pria', PRIA, 'orang', true),
  pas('wanita', 'wanita', WANITA, 'orang', true),
  pas('ayah', 'ayah', AYAH, 'orang'),
  pas('ibu', 'ibu', tambah(AYAH, G), 'orang'),
  pas('kakek', 'kakek', KAKEK, 'orang'),
  pas('nenek', 'nenek', tambah(KAKEK, G), 'orang'),
  pas('paman', 'paman', PAMAN, 'orang'),
  pas('bibi', 'bibi', tambah(PAMAN, G), 'orang'),
  pas('anak', 'anak', { x: 2620, y: 3620 }, 'orang'),
  // buah (S2: yang mirip berdekatan)
  pas('apel', 'apel', { x: 1380, y: 1220 }, 'buah'),
  pas('mangga', 'mangga', { x: 1600, y: 1110 }, 'buah'),
  pas('pisang', 'pisang', { x: 1720, y: 1330 }, 'buah'),
  pas('jeruk', 'jeruk', { x: 1460, y: 1430 }, 'buah'),
  pas('anggur', 'anggur', { x: 1210, y: 1370 }, 'buah'),
  pas('semangka', 'semangka', { x: 1640, y: 1530 }, 'buah'),
  // hewan
  pas('kucing', 'kucing', { x: 5500, y: 1180 }, 'hewan'),
  pas('anjing', 'anjing', { x: 5720, y: 1300 }, 'hewan'),
  pas('kelinci', 'kelinci', { x: 5420, y: 1420 }, 'hewan'),
  pas('sapi', 'sapi', { x: 5880, y: 1080 }, 'hewan'),
  pas('kambing', 'kambing', { x: 6000, y: 1260 }, 'hewan'),
  // kendaraan
  pas('mobil', 'mobil', { x: 6050, y: 4150 }, 'kendaraan'),
  pas('motor', 'motor', { x: 6290, y: 4030 }, 'kendaraan'),
  pas('bus', 'bus', { x: 5900, y: 4350 }, 'kendaraan'),
  pas('truk', 'truk', { x: 6200, y: 4400 }, 'kendaraan'),
  pas('sepeda', 'sepeda', { x: 6420, y: 4250 }, 'kendaraan'),
  // berita (S4)
  pas('berita', 'berita', { x: 4700, y: 3650 }, 'media'),
  pas('radio', 'radio', { x: 4920, y: 3800 }, 'media'),
  pas('televisi', 'televisi', { x: 4560, y: 3880 }, 'media'),
  pas('siaran', 'siaran', { x: 4860, y: 4040 }, 'media'),
  // Inggris jamak (S11)
  pas('apple', 'apple', APPLE, 'inggris', true),
  pas('apples', 'apples', tambah(APPLE, P), 'inggris', true),
  pas('car', 'car', CAR, 'inggris', true),
  pas('cars', 'cars', tambah(CAR, P), 'inggris', true),
  pas('dog', 'dog', { x: 640, y: 4380 }, 'inggris'),
  pas('dogs', 'dogs', tambah({ x: 640, y: 4380 }, P), 'inggris'),
  pas('tree', 'tree', { x: 2250, y: 3900 }, 'inggris'),
  pas('trees', 'trees', tambah({ x: 2250, y: 3900 }, P), 'inggris'),
];

export const posKata = (id: string) => {
  const k = KATA.find((x) => x.id === id);
  return k ? { x: k.x, y: k.y } : { x: 0, y: 0 };
};

// kata latar redup (tekstur "peta raksasa"); posisinya acak tetap
const LATAR_KATA = (
  'hujan matahari kopi teh nasi roti meja kursi pintu jendela buku pensil sekolah guru murid pasar kota desa sungai laut gunung ' +
  'hutan pohon bunga daun angin awan bintang bulan malam pagi siang sore minggu bulan tahun jam waktu uang harga kerja kantor ' +
  'dokter rumah sakit obat sehat lari jalan makan minum tidur bangun duduk berdiri baca tulis dengar lihat bicara tanya jawab ' +
  'merah biru hijau kuning putih hitam besar kecil panjang pendek cepat lambat panas dingin baru lama senang sedih marah takut ' +
  'musik lagu film foto video game bola sepatu baju celana topi tas kunci lampu telepon komputer internet email pesan surat ' +
  'teman keluarga tetangga negara bahasa angka huruf kata kalimat cerita berita'
).split(' ');

export type Titik = { x: number; y: number; r: number; o: number; label?: string; acakX: number; acakY: number; tunda: number };

/** ±700 titik latar: sebagian ngumpul di sekitar gugus, sisanya tersebar. Deterministik. */
export const TITIK: Titik[] = (() => {
  const pusat = [
    { x: 1450, y: 1320, n: 40 }, { x: 3900, y: 2300, n: 50 }, { x: 2800, y: 2900, n: 60 }, { x: 5700, y: 1250, n: 40 },
    { x: 6200, y: 4200, n: 40 }, { x: 4800, y: 3850, n: 30 }, { x: 1500, y: 4000, n: 50 }, { x: 900, y: 600, n: 25 },
    { x: 3300, y: 700, n: 35 }, { x: 6900, y: 2500, n: 30 }, { x: 4200, y: 4500, n: 25 }, { x: 600, y: 2500, n: 25 },
  ];
  const hasil: Titik[] = [];
  let li = 0;
  const gauss = (s: string) => {
    const u = Math.max(1e-6, random(s + 'a'));
    const v = random(s + 'b');
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const dorong = (x: number, y: number, s: string) => {
    const label = random(s + 'l') < 0.2 ? LATAR_KATA[li++ % LATAR_KATA.length] : undefined;
    hasil.push({
      x, y,
      r: 3 + random(s + 'r') * 4,
      o: 0.25 + random(s + 'o') * 0.4,
      label,
      acakX: random(s + 'ax') * DUNIA.w,
      acakY: random(s + 'ay') * DUNIA.h,
      tunda: random(s + 'td'),
    });
  };
  pusat.forEach((p, i) => {
    for (let j = 0; j < p.n; j++) {
      const s = `c${i}-${j}`;
      dorong(p.x + gauss(s + 'x') * 320, p.y + gauss(s + 'y') * 240, s);
    }
  });
  for (let j = 0; j < 520; j++) {
    const s = `u${j}`;
    dorong(150 + random(s + 'x') * (DUNIA.w - 300), 150 + random(s + 'y') * (DUNIA.h - 300), s);
  }
  // jangan numpuk persis di atas kata utama / di dalam panel uji (S12–13)
  return hasil.filter(
    (d) =>
      !KATA.some((k) => Math.hypot(k.x - d.x, k.y - d.y) < (k.besar ? 120 : 70)) &&
      !(d.x > PANEL.x - 40 && d.x < PANEL.x + PANEL.w + 40 && d.y > PANEL.y - 40 && d.y < PANEL.y + PANEL.h + 40),
  );
})();

