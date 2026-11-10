# Arah 3 v3 (autoaja.agency): hangat-percakapan, putaran 3

HTML: carousel/karya/arah-autoaja-3-v3/index.html. Render: hasil/arah-autoaja-3-v3/. v1 dan v2 tidak ditimpa.
Naskah beku: hasil/naskah-autoaja-arah-final.json (sha256 c3003c41...e088ed; html 285bd346...; qc 6d69adb9..., dari cek-naskah).
Warna PERKIRAAN: navy #14155E, emas #E8A33D (navy gelembung #2B2C8C, redup #C9CBEF). Satu keluarga (Liberation Sans lokal).
Empat ukuran: 300 (24/7), 120 (judul, harga), 64 (wordmark, isi, gelembung, pil), 36 (label, tag, kaki). Tanpa maskot dan logo asli.

## Perbaikan sisa Kritikus (putaran 2)
1. Cover: judul "Balasan otomatis, tanpa biaya per-chat." + pil emas "Mulai 1,25jt/bln, konsultasi gratis." (dibayar penutup).
   Wordmark naik 36 ke 64 px di atas. Lencana "99+" muncul terakhir.
2. Penutup: wordmark 64 px (dari 120), harga satu-satunya 120 px, tiga poin dari fakta.md mengisi tengah, konsultasi gratis.
3. Slide 4: SESUDAH baru ("Setup gratis, tagihan bisa diprediksi."), judul menyebut yang dibandingkan, panah segitiga emas di tengah.
4. Slide 3: 24/7 tampil sejak 0 s (tidak dianimasikan); hanya kalimat bawah masuk 0,5 s.
5. "Ini hanya contoh percakapan" 36 px terbaca di slide 1 dan 2.
6. Penanda khas: garis emas + titik notifikasi emas (CSS murni), posisi tetap di baris atas semua slide. Dianggap penanda brand, bukan motif konten.
7. Gerak cover terkuat: garis menarik, judul naik, gelembung berurutan 0,5/0,9 s, lencana 99+ memantul 1,3 s; lalu diam.
8. Bahasa: kamu, tanpa "terbaik/nomor 1". Sumber ada di caption JSON, bukan di slide.

## Tipe, jangkar, motif
| Slide | Tipe | Jangkar | Motif |
|---|---|---|---|
| 1 | cover | judul 120 px | tumpukan gelembung + 99+ |
| 2 | poin | judul 120 px | gelembung + balasan putih + pil |
| 3 | angka | 24/7 300 px | angka raksasa |
| 4 | banding | judul 120 px | dua bidang + panah |
| 5 | penutup | harga 120 px | blok emas + garis poin |

## Catatan jujur
- "99+" dan percakapan hanya ilustrasi, ditandai contoh. Perlu restu owner.
- Teks pendek diubah supaya cek-bahasa nol (label SEBELUM/SESUDAH diperpanjang, "vs" jadi panah CSS, wordmark digabung baris produk).
- Slide 5 masih punya ruang kosong di atas poin; slide 2 judul dan gelembung agak rapat. Belum diuji sebagai video, hanya strip CSS.
- Wordmark teks pengganti, hex perkiraan, maskot tidak ada.
