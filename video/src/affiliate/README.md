# Template affiliate

`Affiliate` menerima `DataAffiliate`, dengan daftar `Adegan` bertipe union di Affiliate.tsx.
Contoh rekaan: `public/produk/contoh/data.json`; gambar tas SVG dibuat dengan kode, tanpa foto seller.
Contoh ini membuktikan komposisi bisa dirender. Untuk produksi tetap lengkapi adegan produk dipakai sesuai kategori.

## Skema data.json

| Field | Isi |
|---|---|
| folder | Jalur relatif public, misalnya produk/contoh |
| audio, bgm | Nama berkas di dalam folder; string kosong berarti tanpa audio |
| bgmMulai | Awal musik opsional, detik |
| durasi | Durasi video dalam detik |
| kata | Array `{t, mulai, akhir}`, waktu absolut dalam detik |
| aksen | Warna CSS |
| bingkai | Opsional: foto kecil ditampilkan dalam kartu |
| adegan | Array `{jenis, mulai, akhir, ...props}` sesuai union Adegan |
| sfx | Array `{src, t, vol?}`; src relatif public, kosong pada contoh |

Jenis adegan: hook, sorot, reveal, detail, pilihan, spek, percaya, warna, rating, klip, ukuran, tapak, jejer, cta.
Props wajib per jenis ada di deklarasi `Adegan` (Affiliate.tsx), jadi TypeScript menolak data yang tidak lengkap.
Foto/video di `folder`, tidak diubah menjadi gambar produk AI. Tandai adegan AI lewat `ai: true` bila didukung.

```tsx
import {Affiliate, type DataAffiliate} from './affiliate/Affiliate';
import data from '../public/produk/contoh/data.json';
// Di dalam Root:
<Composition id="ProdukKamu" component={Affiliate} width={1080} height={1920}
 fps={30} durationInFrames={450} defaultProps={data as DataAffiliate} />
```

Dari folder video: `npm run render -- ContohAffiliate out/contoh-affiliate.mp4 --props=public/produk/contoh/data.json`.
Font Anton menegaskan judul; Instrument Serif membedakan anotasi; Space Mono menjaga label ringkas.
Font dan lisensi lokal di public/font. Tekstur butir memakai gerak/Grain; gambar tekstur jendela/kertas dibuang.
Tidak ada stiker akun atau SFX bawaan. Audio contoh kosong, lihat public/audio/LISENSI.md.
