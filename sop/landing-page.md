# SOP: landing page bisnis (contoh)

## 1. Tujuan
Bisnis punya satu halaman web yang bikin pengunjung paham jualan apa & langsung pesan/nanya, tampilannya layak
dipamerin, kebuka cepat di HP, dan tayang di alamat sendiri.

## 2. Bahan masuk
- `brand/fakta.md` (produk, harga, kontak, alamat, jam buka) & `brand/brief.md` (target, gaya bahasa, warna).
- Foto produk/tempat & logo: `masuk/web/` atau folder Drive kantor. Belum ada → tanya owner (pakai pilihan); sementara
  pakai komposisi tanpa foto, JANGAN foto stok yang ngaku-ngaku produk.

## 3. Langkah
1. Baca bahan. Data wajib yang kurang (nomor WA, harga, alamat) → tanya owner dulu.
2. Tentuin arah desain pakai skill **frontend-design** + **ui-ux-pro-max** (gaya, warna, pasangan font yang cocok sama
   jenis bisnis & pelanggannya). Tulis rencana singkatnya di task (3–5 baris).
3. Bikin halaman di `web/pratinjau/` pakai skill **web-bisnis**.
4. `node alat/web.mjs ukur` → ❌ wajib beres.
5. `node web/alat/foto.mjs` → buka tiap foto (HP & laptop), nilai pakai skill **cek-tampilan**, benerin, foto ulang
   (maks 3 putaran biar irit jatah).
6. Kasih owner link pratinjau (`node alat/web.mjs status`) + ringkasan, status task `nunggu-kamu` dengan pertanyaan:
   "Terbitin versi ini? a) udah oke, aku pencet Terbitkan di dashboard b) ada yang mau diubah (tulis)".

## 4. Hasil
`web/pratinjau/` yang lolos ukur & cek tampilan, foto di `web/foto/` (tampil di dashboard → Website).

## 5. Siapa mutusin
- AI sendiri: desain, tulisan, struktur halaman, ngecek.
- Owner: isi fakta (harga, kontak), foto, & kapan terbit.
