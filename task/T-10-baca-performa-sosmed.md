---
kode: T-10
judul: Baca performa postingan sosmed (terpisah dari riset dan analisa)
divisi: sosmed
pegang: sari
status: antre
update: 2026-11-10
---
## Tujuan
Membaca angka performa asli dari Repliz untuk postingan yang sudah tayang, lalu mencatat apa adanya. Selesai kalau ringkasan angka tertulis di `hasil/performa-<tanggal>.md` dengan sumber dan tanggal ambil. Task ini cuma MEMBACA dan MELAPORKAN angka. Bukan riset, bukan analisa.

## Aturan
- **Tiga pekerjaan terpisah, tiga task terpisah** (permintaan owner 10/11):
  - **Riset** (cari topik, sumber, tren): task per sesi, satu riset = satu task baru per tanggal (lihat T-07).
  - **Baca performa** (task ini): ambil angka asli dari `sosmed/performa/terbaru.md` / `node alat/repliz.mjs performa`, catat apa adanya.
  - **Analisa** (angka jadi aturan yang bisa diuji, masukan ke Sari): task sendiri, ditahan owner. Jangan menganalisa di sini.
- Angka hanya dari Repliz. Kosong atau null = tulis "belum ada", bukan nol, bukan perkiraan. Jangan menyimpulkan dari sampel kecil.
- Keterbatasan paket Repliz saat ini: **angka per postingan butuh paket Gold, sekarang hanya statistik akun** (followers, reach, views, likes, interaksi). Per 10/11 06.09 WIB: @late30_studio views 11, reach 8, likes 2; @autoaja.agency views 14, reach 6, likes 2. Per postingan belum ada.
- Satu task = satu pembacaan (satu tanggal). Pembacaan berikutnya = task baru bertanggal, bukan melanjutkan ini.

## Udah
- 10/11 task dibikin Builder atas permintaan owner (status `antre`: tidak dikerjakan dan tidak membangunkan Sari). Postingan yang sudah tayang untuk dibaca: autoaja "foto produk" (8/11) dan late30 "angin Tsushima" (9/11).

## Hasil

## Keputusan kamu

## Berikutnya
- Kapan dimulai: owner yang menyuruh (`lanjut T-10`) atau minta `baru:` untuk tanggal baru. Sebelum dimulai, pastikan kapan angka dibaca (mis. 24 jam setelah tayang).
- Langkah: baca `sosmed/performa/terbaru.md` (diperbarui otomatis tiap pagi, tanpa AI), salin angka per akun ke `hasil/performa-<tanggal>.md` lengkap dengan jam ambil, tandai yang belum ada angkanya, lalu kabari owner.
