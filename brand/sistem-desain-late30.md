# Sistem desain late30_studio: "Graph" (editor node)

Dipilih owner: arah 1 (T-02/T-07, 2026-11-08). Hanya untuk late30_studio. Selera owner: brand/selera-late30.md. Logo dan palet: brand/late30-logo.md.
Status: fondasi pertama, sudah dipakai di carousel T-07. Belum lolos kritik penuh; Kritikus yang menilai.

## 1. Rasa dan audiens
Gamer dan pemula game dev yang belajar 3D. Rasa: layar editor Blueprint/graph, gelap-teknis, kontras tinggi, huruf tebal besar, rapat tapi bernapas. Ide kerja: alur 3D (segitiga, piksel, sinar, gabungan) digambar sebagai alur yang bisa diikuti mata, bukan dekorasi.

## 2. Kanvas, area aman, grid
- 1080×1350. Area aman teks 72 px di semua sisi. Lebar kolom isi 936 px.
- Alas: warna gelap + kisi titik (lapisan sendiri, bukan motif). Jarak titik 54 px.
- Wordmark kiri atas (y 68), nomor slide kanan atas, satu label sumber kiri bawah (bottom 72).
- Antar blok vertikal: 40-60 px. Judul rata kiri; jangan semua di tengah.

## 3. Token warna
| Token | Hex | Pakai |
|---|---|---|
| gelap | #11131A | alas, teks di atas kuning/krem |
| krem | #F5F2EA | teks utama, bidang terang |
| pink (aksen utama) | #FF3B5C | kepala node, bidang ilustrasi, kata "vs" |
| kuning | #FFC93C | satu kata penekanan per slide, pin, bidang slide fakta |
| node | #1A1D27 | badan node dan bingkai |
| garis | #3A4054 | tepi node/bingkai |
| teks redup | #B9B6AD | nomor dan label sumber di alas gelap |
Versi terang (di atas krem): merah #E0203F untuk logo; teks ajakan #C41835 (kontras 5,3:1 di krem); kuning hanya dengan kontur gelap atau sebagai latar. Pink polos dengan huruf krem kontrasnya 3,1:1 (jangan untuk teks kecil).

## 4. Font (maksimal dua keluarga, lokal)
- Liberation Sans (Regular, Bold): judul, isi, nama node.
- DejaVu Sans Mono (Regular, Bold): wordmark, nomor, label sumber.
- Dipasang lewat @font-face local() dari font sistem; tanpa URL luar.
- Font final menunggu keputusan owner (alat font kantor: node alat/font.mjs --carousel "Nama Font", lewat Sari/Builder). Sampai itu, ini sementara.

## 5. Skala huruf (empat tingkat)
| Tingkat | Ukuran | Pakai |
|---|---|---|
| Judul | 96/104 | jangkar slide, text-wrap balance |
| Sub | 40/48-56 | nama node, ajakan penutup, isi cover |
| Isi | 32/46-48 | isi, text-wrap pretty |
| Label | 28/36 mono | wordmark, nomor, sumber (data-sumber data-kecil) |
Isi maksimal sekitar 30 kata per slide (naskah final T-07 sampai 41 kata di slide 3; sudah dari Satpam, tidak dipangkas Desainer).

## 6. Enam tipe slide dan jangkarnya
| Tipe | Jangkar | Susunan | Motif |
|---|---|---|---|
| Cover | judul 96 px (kata kunci kuning) | lockup + ilustrasi dunia dalam node kecil, menyatu ke node judul lewat kabel | node+kabel, mesh |
| Poin | judul 96 px | judul atas, isi pendek, satu ilustrasi lebar di bawah; tanpa node | mesh segitiga |
| Poin dengan visual | judul 96 px | visual besar di atas, judul, isi di bawah | piksel (layar berkisi) |
| Fakta/definisi | judul 96 px | seluruh slide bidang kuning, teks gelap, diagram garis | sinar cahaya |
| Banding | judul berisi "vs" + satu chip kuning jawaban | dua node sama tinggi + node gabungan lewat kabel | node+kabel |
| Penutup | judul 96 px + ajakan 40 px | alas gelap atas, bidang krem bawah, lockup terang | lockup |
Kutipan tidak dipakai kecuali ada kutipan nyata. Angka/fakta tidak dikarang demi tipe; slide fakta tanpa angka memakai definisi.

## 7. Aturan per tipe
- Cover: wordmark + lockup wajib; judul terbaca di grid; ada janji (kalimat di bawah judul).
- Poin: satu ide, ilustrasi mengikuti isi (segitiga untuk segitiga), bukan hiasan.
- Fakta: label sumber satu baris. Angka (kalau ada) menempel ke elemen visualnya dan berlabel.
- Banding: judul menyebut kedua pihak + "vs"; kedua sisi sama tinggi; jawaban satu jangkar kuning; tidak ada ukuran batang tanpa data.
- Penutup: bayar janji cover, ajakan pertanyaan lengkap, wordmark/lockup besar. Uji footer: tanpa label sumber masih terbaca brand late30 dari lockup dan kubus kawat.
- Label sumber: 28 px, satu baris, tanpa padding vertikal; metodologi/batas di caption.

## 8. Elemen tetap
Wordmark `late30_studio` dengan kotak kuning kecil; nomor "n/6"; kisi titik; satu label sumber di slide fakta; teks isi minimal 32 px.

## 9. Ritme (6 slide)
Gelap penuh node (cover) -> gelap + ilustrasi lebar (poin) -> gelap + layar visual (poin visual) -> kuning penuh (fakta) -> gelap + node (banding) -> gelap/krem terbelah (penutup). Skala sama, komposisi berubah tiap slide; maksimal dua slide berturut-turut berstruktur mirip.

## 10. Cover dan penutup
Cover: lockup besar dalam node + ilustrasi mesh (dunia 3D) + judul. Penutup: lockup terang besar di bidang krem + ajakan. Wordmark tertulis tetap ada di kiri atas semua slide.

## 11. Gerak
Belum ada. Hasil statis; tidak mengaku lolos aspek gerak. Kalau nanti dibuat: gerak hanya untuk mengarahkan mata (kabel tersambung, sinar berjalan), teks diam setelah masuk, loop utuh, tanpa goyang.

## 12. Anti-pola
- Kabel/pin/node berkepala di lebih dari dua slide per carousel.
- Dua kotak gelap di kepala node (terbaca sebagai tombol jendela): pakai simbol pin kuning.
- Node kembar beda tinggi tanpa alasan; batang proporsional tanpa data.
- Tiga slab teks mirip berturut-turut; semua teks di tengah.
- Tangkapan layar atau foto pihak lain; logo/angka karangan.
- Label sumber di bawah 28 px; teks isi di bawah 32 px.
- Mengganti kata naskah agar muat.

## 13. Pedoman suara
Pilihan owner (08/11): "kamu" dan "gak" (bukan "lo/gue"; tidak "aku-kamu" kit). Rapi, sedikit campuran English ala Jaksel secukupnya, satu ekspresi per kalimat.
- Kamu: "Kamu akan tahu dua cara menggambarnya."
- Gak: "Gak perlu kartu grafis mahal untuk belajar ini." (contoh gaya, bukan klaim fakta)
- Ajakan: "Kalau game kamu punya opsi ray tracing, pernah coba menyalakannya?"
Larangan: klaim terbaik/nomor 1 tanpa bukti, bahas bajakan/crack.

## 14. Daftar motif (maksimal 2 slide per carousel, termasuk varian)
| Motif | Fungsi cerita |
|---|---|
| Node + kabel + pin | alur kerja 3D yang tersambung, banding menjadi gabungan |
| Mesh segitiga | objek 3D tersusun dari segitiga |
| Piksel (layar berkisi) | segitiga diubah jadi titik gambar |
| Sinar cahaya (garis putus-putus) | jalur cahaya kamera ke sumber |
| Lockup/kubus kawat | tanda brand pada cover dan penutup |
| Bidang warna penuh (kuning, krem) | pergantian ritme, bukan hiasan |
Catatan T-07: node+kabel slide 1 dan 5; mesh slide 1 dan 2; piksel slide 3; sinar slide 4; lockup slide 1 dan 6; bidang kuning slide 4, bidang krem slide 6. Kisi titik adalah alas, bukan motif.

## 15. Catatan karya T-07 (jangkar, tipe, motif per slide)
| Slide | Tipe | Jangkar | Motif |
|---|---|---|---|
| 1 | cover | "Game 3D bisa digambar dari segitiga" | node+kabel, mesh (placeholder), lockup |
| 2 | poin | "Objek 3D dibentuk dari segitiga" | mesh (ilustrasi medan, placeholder) |
| 3 | poin dengan visual | "Layarnya sendiri cuma 2D" | piksel (placeholder) |
| 4 | fakta/definisi | "Ray tracing menelusuri jalur cahaya" | sinar (placeholder), bidang kuning |
| 5 | banding | judul "Rasterization vs ray tracing..." + chip "lebih berat" | node+kabel |
| 6 | penutup | "Dipakai bareng: kualitas tinggi, frame rate bagus" | lockup terang, bidang krem |
Lima tipe dari enam dipakai.

## 16. Sumber acuan
brand/acuan/late30-acuan.md (5 screenshot reels owner; dugaan, belum dikonfirmasi): gelap-teknis, kotak solid berwarna, huruf tebal, kuning penekanan. Graph editor dari tangkapan Unreal owner jadi dasar arah 1. Tidak menyalin komposisi, foto, logo, atau kartu berita pihak lain. Kritik arah: hasil/late30-kritik-arah.md.

## 17. Placeholder dan yang belum ada
- Mesh, layar piksel, dan diagram sinar adalah ilustrasi buatan sendiri, ditandai placeholder (data-placeholder). Ganti dengan tangkapan editor/karya milik owner kalau owner mengizinkan per karya.
- Font final belum diputuskan owner.
- Gerak belum dibuat.

## Pelajaran
- 08/11 (kritik arah 1): kabel/pin maksimal dua slide; sumber 28 px; dua node banding sama tinggi dan jawaban satu jangkar kuning; kepala node memakai pin, bukan dua kotak hitam; isi minimal 32 px; tidak ada angka karangan.
