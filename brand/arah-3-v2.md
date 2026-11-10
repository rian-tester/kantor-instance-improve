# Arah 3 v2 (autoaja.agency): hangat-percakapan, revisi putaran 2

HTML: carousel/karya/arah-autoaja-3-v2/index.html. Render: hasil/arah-autoaja-3-v2/. v1 tidak ditimpa.
Warna masih PERKIRAAN (navy #14155E, emas #E8A33D, navy gelembung #2B2C8C, redup #C9CBEF). Satu keluarga huruf
(Liberation Sans lokal). Empat tingkat ukuran: 300 (24/7), 120 (judul, harga, wordmark penutup), 52 (isi, gelembung, pil),
36 (label, tag, kaki).

## Yang berubah dan kenapa (menjawab kritik putaran 1)
1. Gelembung hanya di slide 1 dan 2. Penutup: blok emas "Mulai 1,25jt/bln" 120 px + "Chat kami di WhatsApp" di dalam blok.
2. Slide 2: "balasan otomatis AI" jadi tag 36 px tebal di dalam gelembung putih; pil emas 52 px, satu baris tiap pil.
3. Cover: judul 120 px, gelembung 52 px, garis emas 140 px, janji 36 px redup "Geser, ini cara menghentikannya.".
   Teks chat ditandai komentar HTML sebagai contoh percakapan. Balasan generik diganti "Mulai 1,25jt/bln, setup gratis."
   (dari fakta.md, bukan angka karangan).
4. "Fully managed" jadi "Dikelola penuh tim kami". Kalimat Google Sheets dibuang (tidak muat dan tidak perlu).
5. Slide baru: angka 24/7 emas 300 px (slide 3) dan banding Sebelum/Sesudah (slide 4). Jadi 5 slide, 5 tipe.
6. Produk (WhatsApp Broadcast + Reply Agent) ada di kaki slide 1-4 dan di bawah wordmark penutup.
7. Slot maskot dihapus dari render; hanya komentar HTML di slide 5 untuk tempat maskot nanti. Wordmark besar 120 px mengisi kepala penutup.
8. Gerak (CSS): gelembung cover masuk 0,4/0,8/1,5 s; di slide 2 gelembung masuk 0,4 s, balasan putih 1,5 s; 24/7, bidang
   Sesudah, dan blok harga muncul 0,4-0,8 s; sesudahnya diam. render.mjs memang membuat strip-NN.png (6 frame: 0/0,4/0,8/1,5/3/5,5 s);
   strip slide 1 dan 2 berbeda antar frame (dicek).
9. Semua label minimal 36 px di kanvas (sekitar 14 px di HP).

## Tipe, jangkar, motif
| Slide | Tipe | Jangkar | Motif |
|---|---|---|---|
| 1 | cover | judul 120 px | tumpukan gelembung masuk |
| 2 | poin | judul 120 px | gelembung + balasan putih + pil emas |
| 3 | angka | 24/7 300 px | angka raksasa |
| 4 | banding | "Manual vs autoaja." 120 px | dua bidang sebelum/sesudah |
| 5 | penutup | harga 120 px | blok emas |

## Sisa / belum
- Logo asli, maskot, font asli belum ada (wordmark teks pengganti). Hex perkiraan.
- Teks gelembung (contoh percakapan) dan kalimat slide belum lewat naskah final/Satpam; cek-naskah.py tidak dijalankan (belum ada JSON final).
- Slide 3-5 bergerak hanya masuk sederhana; cakupan gerak: masuk lalu diam, belum diuji sebagai video.
- Slide 3 dan 4 punya ruang kosong lumayan; slide 5 ruang kosong tengah (tempat maskot nanti).
