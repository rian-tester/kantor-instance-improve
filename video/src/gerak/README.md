# Komponen gerak

Semua waktu dalam detik, koordinat dalam piksel komposisi. Impor dari `./gerak` di sumber video.
Font lokal dimuat lewat `gerak/font.ts`: Saira Condensed untuk angka/judul sempit, JetBrains Mono untuk UI,
Roboto Slab untuk informasi di kertas, Kalam untuk anotasi. Lisensi ada di `public/font/`.
Grain memakai SVG noise deterministik, tanpa aset tekstur. `folder` dipertahankan untuk kompatibilitas, tidak dibaca.
Karakter memerlukan gambar ekspresi milik kamu sendiri; kit tidak menyertakan gambar karakter.

Contoh lengkap: `../../../contoh-explainer/tunggal/ContohRefreshRate.tsx`. Dunia 6.300 px menyambungkan monitor, jam dan menu sehingga
angka tetap menjadi objek pemandu. Abu netral memisahkan contoh dari identitas akun; hijau/merah menandai pilihan.
ENERGY 2 / RHYTHM 2 / MOTION 3 mengikuti acuan: angka besar, perpindahan kamera dan kursor yang menunjukkan langkah.

## Props dan contoh

Tipe di bawah disalin dari deklarasi sumber, termasuk nilai opsional. `gaya` adalah React.CSSProperties.
Contoh dirender di dalam komposisi Remotion.

### AngkaJalan

```ts
{
  dari: number;
  ke: number;
  /** detik mulai & lama jalan (dipakai kalau `progress` kosong) */
  mulai?: number;
  lama?: number;
  /** progress 0..1 dari luar (diikat ke gerak objek); ngalahin mulai/lama */
  progress?: number;
  easing?: (n: number) => number;
  desimal?: number;
  /** bulatkan ke bawah (counter diskrit kayak hitungan) */
  lantai?: boolean;
  depan?: React.ReactNode;
  belakang?: React.ReactNode;
  gaya?: React.CSSProperties;
}
```

```tsx
<AngkaJalan dari={60} ke={144} mulai={0} />
```

### BalikKartu

```ts
{
  depan: React.ReactNode;
  belakang: React.ReactNode;
  /** detik mulai dibalik ke belakang */
  balik: number;
  /** detik mulai dibalik lagi ke depan (opsional) */
  balikLagi?: number;
  lama?: number;
  sumbu?: 'x' | 'y';
  lebar: number;
  tinggi: number;
  perspektif?: number;
}
```

```tsx
<BalikKartu balik={1} lebar={200} tinggi={150} depan={<b>60</b>} belakang={<b>144</b>} />
```

### Bunyi

```ts
{
  vo?: string;
  voVol?: number;
  bgm?: string;
  bgmVol?: number;
  /** detik lagu yang dibuang di depan (biar ketukan besar ngepas sama potongan) */
  bgmMulai?: number;
  sfx?: Sfx[];
}
```

```tsx
<Bunyi vo="suara.mp3" />
```

### Dunia

```ts
{
  kamera: Kamera;
  tinggiDunia: number;
  /** lebar total kanvas (bawaan = lebar layar; dunia yang digeser ke samping wajib diisi biar blur gak kepotong) */
  lebarDunia?: number;
  blurGerak?: number | null;
  children: React.ReactNode;
}
```

```tsx
<Dunia kamera={{x: 540, y: 960, z: 1, vx: 0, vy: 0, lebar: 1080, tinggi: 1920}}><div>Monitor</div></Dunia>
```

### GarisDigambar

```ts
{
  /** path SVG (koordinat svg induk) */
  d: string;
  mulai: number;
  /** lama digambar (detik); bawaan 0,25 */
  lama?: number;
  warna: string;
  tebal: number;
  /** detik mulai dihapus dari pangkal */
  hapus?: number;
  lamaHapus?: number;
  ujung?: 'round' | 'butt' | 'square';
  opacity?: number;
  easing?: (n: number) => number;
}
```

```tsx
<svg><GarisDigambar d="M0 0L200 0" mulai={0} warna="#222" tebal={6} /></svg>
```

### Grain

```ts
{kuat?: number; garisScan?: number; vinyet?: number; folder?: string; warnaVinyet?: string}
```

```tsx
<Grain kuat={0.08} />
```

### Idle

```ts
Lihat tanda tangan helper di sumber: noise, idle
```

```tsx
idle(2, "monitor")
```

### KataMuncul

```ts
{
  kata: (KataLayar | string)[];
  /** detik kata pertama (dipakai kata yang gak punya `mulai`) */
  mulai: number;
  /** jarak antar kata kalau stagger (detik); bawaan 0,05 (3 frame @60) */
  jeda?: number;
  /** lama blur→tajam per kata (detik) */
  lama?: number;
  /** detik mulai keluar; kosong = gak keluar */
  keluar?: number;
  /** blur awal (px) */
  blur?: number;
  rata?: 'flex-start' | 'center' | 'flex-end';
  gaya?: React.CSSProperties;
}
```

```tsx
<KataMuncul mulai={0} kata={[{t: "Monitor", mulai: 0}]} />
```

### Karakter

```ts
{
  /** folder public berisi stiker-<n>.png */
  folder: string;
  /** lebar/tinggi gambar */
  rasio: number;
  posisi: PosisiKarakter[];
  ekspresi: EkspresiDi[];
  /** semua nomor ekspresi yang dipakai (dimuat sekali) */
  daftar: number[];
  /** buka/tutup mulut per frame (1/0) dari VO */
  mulut?: number[];
  /** keras suara per frame 0..1 (loncat kecil pas ngomong) */
  keras?: number[];
  /** ekspresi diam → versi mulut buka, mis. {1: 2} */
  bicara?: Record<number, number>;
  /** nomor ekspresi mata merem buat kedip (cuma dipakai pas ekspresi netral & mulut tutup) */
  kedip?: number;
  /** detik muncul (pop) / hilang */
  masuk?: number;
  keluar?: number;
  seed?: string;
  /** awalan nama berkas (bawaan 'stiker-' → stiker-<n>.png) */
  awalan?: string;
  /** gambar pixel art: jangan dihalusin pas diskala */
  piksel?: boolean;
}
```

```tsx
<Karakter folder="karakter-kamu" rasio={1} daftar={[1]} posisi={[{t: 0, x: 540, y: 1200, tinggi: 400}]} ekspresi={[{t: 0, n: 1}]} />
```

### Kursor

```ts
{
  titik: TitikKursor[];
  /** detik klik */
  klik: number[];
  ukuran?: number;
  warna?: string;
  garis?: string;
  masuk?: number;
  keluar?: number;
  lamaGerak?: number;
  /** elemen yang ditarik kursor: dapet posisi ujung kursor (telat 0,08 dtk) */
  bawa?: (x: number, y: number) => React.ReactNode;
}
```

```tsx
<Kursor klik={[]} titik={[{t: 0, x: 100, y: 100}]} />
```

### Paralaks

```ts
{ kamera: Kamera; lapis: Lapis[] }
```

```tsx
<Paralaks kamera={{x: 540, y: 960, z: 1, vx: 0, vy: 0, lebar: 1080, tinggi: 1920}} lapis={[]} />
```

### Pop

```ts
{
  mulai: number;
  children: React.ReactNode;
  /** 7–12 = mantul sekali (overshoot); 200 = tanpa mantul */
  damping?: number;
  stiffness?: number;
  mass?: number;
  /** titik tumpu skala, mis. '50% 100%' */
  asal?: string;
  keluar?: number;
  lamaKeluar?: number;
  gaya?: React.CSSProperties;
}
```

```tsx
<Pop mulai={0}><b>144 Hz</b></Pop>
```

### Squash

```ts
{
  /** detik menyentuh tanah */
  mendarat: number;
  /** tinggi jatuh (px) */
  tinggiJatuh?: number;
  lamaJatuh?: number;
  /** 1 = standar (pipih 28%) */
  kuat?: number;
  keluar?: number;
  children: React.ReactNode;
  gaya?: React.CSSProperties;
}
```

```tsx
<Squash mendarat={1}><b>60 Hz</b></Squash>
```

### Stempel

```ts
{
  mulai: number;
  children: React.ReactNode;
  /** miring akhir (derajat) */
  rot?: number;
  /** skala awal sebelum dibanting */
  dari?: number;
  /** lama bantingan (detik), bawaan 0,08 */
  lama?: number;
  /** besar ayun setelah mendarat (derajat) */
  ayun?: number;
  keluar?: number;
  gaya?: React.CSSProperties;
}
```

```tsx
<Stempel mulai={0}>144 Hz</Stempel>
```

### Subtitle

```ts
{
  kata: Kata[];
  /** batas kalimat VO (halaman gak nyebrang kalimat) */
  kalimat?: { mulai: number; akhir: number }[];
  zona: ZonaSubtitle[];
  maksHuruf?: number;
  maksBaris?: number;
  ukuran?: number;
  font?: string;
  tebal?: number;
  warna?: string;
  /** warna kata yang lagi diucapin */
  sorot?: string;
  gabung?: { kata: string[]; jadi: string }[];
  /** detik subtitle berhenti total (mis. pas loop) */
  sampai?: number;
  /** warna pita tipis di belakang tiap baris (mis. 'rgba(29,27,24,0.82)'); kosong = cuma garis tepi */
  latar?: string;
}
```

```tsx
<Subtitle zona={[{dari: 0, x: 540, y: 1400}]} kata={[{t: "Monitor", mulai: 0, akhir: 1}]} />
```

### ZoomTembus

```ts
{
  dari: Kotak;
  ke: Kotak;
  mulai: number;
  lama?: number;
  /** isian kotak selama tumbuh */
  warna: string;
  /** warna garis tepi (opsional) */
  garis?: string;
  tebalGaris?: number;
  /** bagian perjalanan (0..1) saat isi baru mulai kelihatan */
  isiMuncul?: number;
  /** isi adegan baru, ditata di koordinat kotak tujuan (0,0 = pojok kiri atas `ke`) */
  children?: React.ReactNode;
}
```

```tsx
<ZoomTembus mulai={0} dari={{x: 0, y: 0, w: 100, h: 100}} ke={{x: 0, y: 0, w: 1080, h: 1920}} warna="#222"><b>Pengaturan</b></ZoomTembus>
```

## Helper yang diekspor index.ts

- `waktu`: `JEPIT`, `useDetik`, `EASE`, `maju`, `antara`, `pegas`, `Kata`, `kata`, `akhirKata`.
- `warna`: `campur`.
- `Idle`: `noise`, `GerakIdle`, `idle`.
- `Kursor`: `TitikKursor`, `posisiKursor`, `Kursor`.

`maju(t, a, b)` memberi progres 0–1; `EASE` berisi kurva dan `JEPIT` menjepit interpolasi.
`pegas(t, mulai, fps)` memberi progres spring; `useDetik()` memberi waktu komposisi.
`kata`/`akhirKata` mencari waktu ucapan; `hitungKamera(kunci,t,fps)` menghitung kamera dunia.
`campur(a,b,t)` mencampur warna OKLCH; `noise(seed,t)` dan `idle` memberi gerak deterministik.
`polaKotak`/`polaTitik` membuat pola paralaks; `pathLingkarTangan` membuat coretan.
`posisiKursor` menghitung posisi dari kunci. `SapuSorot` diekspor lewat KataMuncul: sorot teks dengan masker.


### Kabut

Props: `kam?: Kamera`, `warna?: [string,string,string]` (RGB), `kuat?: number`.

```tsx
<Kabut kuat={0.5} />
```

### SapuSorot

Props: `mulai: number`, `lama?: number`, `warna: string`, `warnaTeks?: [string,string]`,
`penuh?: boolean`, `keluar?: number`, `children: React.ReactNode`.

```tsx
<SapuSorot mulai={1} warna="#d8d8d8" warnaTeks={["#fff", "#141414"]}>144 Hz</SapuSorot>
```

Versi gabungan memakai Kabut, KataMuncul/SapuSorot dan Subtitle dari salinan terbaru data gelap.
SapuSorot mengubah warna hanya pada wilayah yang disapu; Subtitle mendukung pita latar.
Bahan seri berada di seri/data-gelap, seri/meja-editor, seri/neon-grid.
Seri meja editor memakai Jakarta lokal sementara untuk label; Inter Tight 500/700/800 belum tersedia.

Helper tambahan dari ekspor komponen:

| Helper | Contoh |
|---|---|
| formatAngka | `formatAngka(1440)` menghasilkan `1.440` |
| mendaratStempel | `mendaratStempel(1)` memberi waktu akhir bantingan |
| halamanSubtitle | `halamanSubtitle(kata, kalimat)` membagi kata menjadi halaman |
| posisiKursor | `posisiKursor([{t: 0, x: 0, y: 0}], 1)` memberi posisi ujung |
| polaTitik | `polaTitik('#999', 36)` memberi pola dan ukuran tile |
| pathLingkarTangan | `pathLingkarTangan(100, 100, 80, 60)` memberi path coretan |

Lihat tipe di sumber untuk `Kamera`, `KunciKamera`, `Getar`, `Lapis`, `Kata`, `ZonaSubtitle`, `Sfx`,
`PosisiKarakter`, `EkspresiDi`, `GerakIdle`, `TitikKursor`, `KataLayar` dan `Kotak`.
