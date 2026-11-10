# Arah 1 (autoaja.agency): Tipografi murni, rapat, tegas

Status: usulan, belum dipilih owner. HTML: carousel/karya/arah-autoaja-1/index.html. Render: hasil/arah-autoaja-1/.

## Rasa
Paling dekat dengan carousel navy yang sudah ada di feed. Hanya huruf, satu garis emas, dan ruang. Tegas, cepat dibaca,
tanpa dekorasi. Cocok untuk judul "masalah/kontras" ala feed sekarang.

## Alasan desain
- Judul 120 px dengan letter-spacing rapat jadi satu-satunya jangkar; kebaca di grid profil dan di HP (412 px).
- Garis emas pendek (140 px) di bawah judul meneruskan garis tipis emas feed lama, dipakai sebagai penanda "napas".
- Satu ikon garis putih di kiri atas, seperti feed lama. Ikon digambar sendiri (bukan logo, bukan maskot).
- Wordmark teks "autoaja" + label produk "WhatsApp Broadcast + Reply Agent" ada di cover dan penutup (uji tutup footer lolos
  karena produk disebut di badan slide bawah, bukan footer kecil saja; kelemahan: labelnya masih kecil, 36 px).
- Kelemahan jujur: paling tidak berbeda dari feed sekarang; mudah terasa datar kalau semua slide mirip.

## Token (warna PERKIRAAN dari screenshot, koreksi owner menang)
- Navy latar #14155E (perkiraan)
- Emas garis/aksen #E8A33D (perkiraan, satu-satunya aksen)
- Putih #FFFFFF, putih redup #C9CBEF (sub)
- Garis putus slot maskot: #C9CBEF

## Tipografi
- Satu keluarga: Liberation Sans (terpasang di sistem), regular dan bold. Dimuat lewat @font-face local(), tanpa unduhan.
- Pengganti sementara. Font feed asli belum diketahui (mirip Montserrat/Anton); font pilihan owner nanti lewat node alat/font.mjs --carousel.
- Empat ukuran: 120 (judul), 52 (poin/sub/harga), 36 (wordmark/label produk), 24 (label kecil, data-kecil).
- Judul bold, letter-spacing -4 px, line-height .98, text-wrap balance.

## Anatomi per tipe (dari contoh)
- Cover: ikon kiri atas; judul 120 px di tengah-bawah; garis emas; kiri bawah wordmark + label produk; kanan bawah slot maskot.
- Poin: ikon panah; judul 120 px; garis emas; tiga baris 52 px bold dipisah garis emas tipis; wordmark di kaki.
- Penutup: ikon gelembung bercentang; judul ajakan; sub redup; harga emas "Mulai 1,25jt/bln"; kaki seperti cover.
- Belum diuji: angka/fakta, kutipan, banding (isi contoh tidak memuatnya).

## Motif dan jangkar (contoh)
| Slide | Tipe | Jangkar | Motif |
|---|---|---|---|
| 1 | cover | judul 120 px | gelembung chat (ikon) |
| 2 | poin | judul 120 px | garis emas pemisah |
| 3 | penutup | judul 120 px | gelembung bercentang + slot maskot |

## Aset yang kurang
Logo asli dan maskot semut astronot belum ada. Wordmark "autoaja" teks adalah pengganti; slot bergaris putus berlabel
"maskot (menyusul)". Font asli belum ada.
