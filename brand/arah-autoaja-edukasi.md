# Dasar visual autoaja.agency untuk konten edukasi engagement (putaran 2)

Gabungan arah 2 (angka/daftar sebagai jangkar, grid, ruang kosong) dan arah 1 (navy murni, judul putih tebal, garis emas). Disetujui owner.
HTML: carousel/karya/autoaja-tips/index.html. Render: hasil/carousel-autoaja-tips/. Naskah beku: hasil/naskah-autoaja-tips-final.json
(sha256 5bf3175c8c5da2b93f25fd8e9e1e14f03ec6fc24098ac9a9b5400f25d73a1a97). Tanpa produk, harga, gelembung chat, maskot.

## Rasa
Kartu pengetahuan navy yang tenang dan tegas, dekat feed asli, tapi tiap slide punya jangkar berbeda.

## Token (warna PERKIRAAN, koreksi owner menang)
Navy #14155E, emas #E8A33D (aksen tunggal), navy2 #2B2C8C (panel sebelum), putih, redup #C9CBEF.

## Tipografi
Satu keluarga: Liberation Sans lokal (pengganti; font asli belum diketahui). Empat ukuran: 420 (angka), 96 (judul), 56 (isi, wordmark cover/penutup), 36 (label, wordmark, nomor, catatan contoh).
Judul bold, letter-spacing -3, line-height 1, balance. Isi pretty (kecuali slide 5: wrap biasa agar tak ada baris pendek).

## Elemen khas (dunia brand tanpa produk)
Wordmark teks "autoaja.agency" (aja emas), garis emas 140x8 di bawah judul, badge notifikasi emas. Badge/titik emas HANYA di cover (kail), titik langkah slide 4, kamera slide 5. Ikon sudut dihapus dari slide 2, 3, 6. Komentar HTML menyisakan tempat maskot (pojok kanan atas cover dan penutup).

## Anatomi per tipe
- Cover: wordmark 56, kail besar (640 px, garis tebal) dengan badge emas kecil di samping bar atas (bukan menimpa ujung kail), judul hook 96 rendah-kiri, garis, sub 56.
- Angka: "Hal [1 emas 420] dari 4" sebagai jangkar, judul, garis, isi. Label "Hal N dari 4" 36 px pada tipe lain.
- Banding: judul, dua panel sejajar (label + kutipan; sebelum navy2 dengan teks putih, sesudah putih + bilah emas), panah emas, catatan contoh 36 px.
- Langkah bernomor: judul, tiga baris 56 px berjarak 64 px, titik emas bertaut garis.
- Poin: judul, kamera besar dengan titik emas dekat judul, ruang kosong, isi di bawah.
- Penutup: wordmark 56, judul, pertanyaan, strip empat ikon tanpa teks (penanda Hal 1-4), panel ajakan 56 px bergaris emas yang menyala sekali.

## Gerak (CSS, tanpa loop)
Judul/angka tampil sejak 0 s (hanya naik 36 px). Cover: kail berayun sekali, badge emas pop terakhir. Penutup: panel ajakan menyala sekali lalu diam. Selesai < 2 s. Hanya strip CSS; belum ada MP4.

## Anti-pola
Gelembung chat, produk/harga, maskot palsu, kotak "maskot menyusul", cover klaim fitur, label kecil di bawah 36 px, banding tak sejajar, motif sama lebih dari dua slide, semua di tengah, kalimat mutiara, elemen flex yang menyusut (garis emas jadi tipis).

## Pelajaran dari kritik
Putaran 1-3 arah: cover hook bukan klaim fitur, penutup membawa dunia brand, banding sejajar, label besar, motif maks 2, minimal 4 tipe. Kritik carousel putaran 1: penutup satu pertanyaan + ajakan simpan, cover kail besar + elemen khas, ikon hanya di tiga tempat, patahan slide 5, bawah slide 4 kosong, label 36, kontras "Sebelum", gerak bervariasi.

## Catatan jujur
Ikon digambar sendiri (bukan logo). Warna/font pengganti. Gerak hanya CSS. Sumber: keputusan owner (saran praktis tanpa sumber) belum diputuskan di sini.
