# Arah 2 (autoaja.agency): Editorial, angka sebagai jangkar

Status: usulan, belum dipilih owner. HTML: carousel/karya/arah-autoaja-2/index.html. Render: hasil/arah-autoaja-2/.

## Rasa
Tenang dan rapi seperti majalah bisnis: banyak ruang kosong, garis grid tipis, nomor halaman, satu angka raksasa jadi
jangkar slide fakta. Terasa lebih "profesional" untuk pemilik UMKM yang mau terlihat serius.

## Alasan desain
- Judul cover 88 px diturunkan ke separuh bawah; separuh atas dibiarkan kosong supaya cover terbaca bersih di grid.
- Angka "24/7" (300 px, emas) jadi jangkar slide fakta; diberi label judul "Balasan otomatis AI, aktif terus." persis di bawahnya
  supaya angkanya jelas artinya tanpa caption. Angka hanya dari fakta (aktif 24/7), tidak ada angka karangan.
- Garis atas dan bawah (header/footer) + nomor "01 / 03" membentuk grid editorial yang konsisten.
- Label mono kecil (24 px huruf kapital) untuk nama produk; hanya meta, bukan pesan utama.
- Kelemahan jujur: label mono 24 px hampir tak terbaca di HP (sekitar 9 px). Produk di cover karena itu lemah; kalau arah ini
  dipilih, label produk naik ke 28 px+ atau pindah ke badan slide.

## Token (warna PERKIRAAN)
- Navy #14155E, emas #E8A33D (aksen tunggal; dipakai untuk angka, harga, nomor daftar)
- Putih #FFFFFF, redup #C9CBEF, garis grid #4A4B93

## Tipografi
- Dua keluarga: Liberation Sans (judul/isi) dan DejaVu Sans Mono (label, nomor). Keduanya terpasang, dimuat via local().
- Empat ukuran: 300 (angka), 88 (judul/harga), 40 (isi/daftar/wordmark), 24 (label mono, data-kecil).
- Angka letter-spacing -14 px, judul -3 px.

## Anatomi per tipe
- Cover: bar atas (nomor + produk), judul rendah-kiri di ruang kosong, bar bawah (wordmark + "Geser").
- Angka/fakta: bar atas; angka 300 px emas; judul 88 px; tiga baris daftar bergaris dengan nomor emas; wordmark.
- Penutup: bar atas; judul ajakan 88 px + sub; label produk + harga emas 88 px; bawah wordmark + slot maskot.
- Belum diuji: kutipan, banding.

## Motif dan jangkar (contoh)
| Slide | Tipe | Jangkar | Motif |
|---|---|---|---|
| 1 | cover | judul 88 px | garis grid editorial |
| 2 | angka/fakta | angka 24/7 | garis grid + daftar bernomor |
| 3 | penutup | judul 88 px | slot maskot |

## Aset yang kurang
Logo asli, maskot, font asli. Wordmark teks dan slot "maskot (menyusul)" adalah pengganti.
