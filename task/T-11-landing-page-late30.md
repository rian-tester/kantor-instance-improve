---
kode: T-11
judul: Landing page late30_studio (versi dummy)
divisi: web
pegang: dimas
status: nunggu-kamu
update: 2026-11-10
---
## Tujuan
Satu landing page late30_studio di `web/pratinjau/`, tampil di link pratinjau, layak tayang secara desain, dengan kontak dummy. Selesai kalau `node alat/web.mjs ukur` bersih, foto HP + laptop sudah dicek, dan owner dapat link pratinjau. Belum diterbitkan: kontak dummy harus diganti dulu (lihat Aturan).

## Arahan owner (10/11)
- Pakai referensi dan arahan visual yang sudah ada, tidak bikin arah baru.
- Belum ada kontak, jadi pakai mockup/dummy dulu.
- Task baru, bukan lanjutan T-04 (landing page lama yang diparkir, abaikan).

## Bahan yang sudah ada
- Sistem desain "Graph": `brand/sistem-desain-late30.md` (token warna, skala huruf, motif node + kabel, kisi titik). Ini sumber utama visual.
- Selera dan acuan: `brand/selera-late30.md`, `brand/acuan/late30-acuan.md` (gelap-teknis, kontras tinggi, huruf tebal, satu kata kuning).
- Logo dan palet: `brand/late30-logo.md`. Salinan logo siap pakai: `masuk/web/late30/`.
- Isi: `brand/brief.md` (topik, target, gaya bahasa) dan `brand/fakta.md` (late30_studio akun konten, tanpa produk, tanpa harga).
- Link nyata: Instagram https://www.instagram.com/late30_studio/ dan YouTube https://www.youtube.com/@late30gamestudio20.
- Contoh visual konten: carousel di `hasil/carousel-T-07`, `hasil/carousel-T-07-angin`, `hasil/carousel-T-08-20261110-v4`. Pasang hanya yang sudah tayang atau disetujui owner; kalau ragu, bikin mockup dari HTML/CSS.

## Aturan
- late30_studio gak jual produk dan gak punya harga. Halaman ini profil/hub studio (siapa, topik, contoh konten, ikuti, hubungi), bukan halaman jualan. Jangan karang layanan, harga, testimoni, jumlah pengikut, atau angka apa pun.
- **Kontak dummy:** nomor WA dan email ditandai jelas sebagai DUMMY (atribut `data-dummy`, nomor `6280000000000`, email `halo@contoh.invalid`). Tulis di "Keputusan kamu" bahwa ini wajib diganti sebelum terbit. Jangan diterbitkan selama masih ada dummy.
- Suara: "kamu" dan "gak", rapi, sedikit campuran English ala Jaksel, cek anti-slop-indo. Jangan bahas bajakan/crack.
- Logo late30 saja. Jangan campur aset autoaja.agency. Jangan pakai screenshot, foto, atau logo pihak lain (acuan reels cuma buat rasa; watermark VEED jangan dibawa).
- Font final belum diputuskan owner. Pilih dua keluarga lewat `node alat/font.mjs` yang dekat dengan rasa editor (judul tebal, mono untuk label), tulis di rencana, owner yang menyetujui.
- Ilustrasi mesh/piksel/sinar di sistem desain ditandai placeholder. Kalau dipakai di halaman, ikut ditandai placeholder.
- Jangan menerbitkan sendiri. Bahan baru dari owner masuk lewat `masuk/web/`.

## Udah
- 10/11 task dibikin Builder atas permintaan owner. Dimas diaktifkan lagi di `ORGANISASI.md`. Bahan dan titipan disiapkan di `kotak-masuk/web/` dan `masuk/web/late30/`.
- 10/11 owner jawab tujuan halaman: hub profil + contoh konten. Dimas bikin halaman (satu index.html + gaya.css, font Archivo + JetBrains Mono, logo late30 lockup + avatar kecil buat favicon, share.jpg, robots, sitemap). `alat/web.mjs ukur` bersih, foto HP + laptop sudah dicek. Kontak dummy ditandai `data-dummy` + label DUMMY di halaman.

## Rencana desain (Dimas, 10/11)
- Tujuan halaman: hub profil + contoh konten (owner jawab 10/11: pilihan a).
- Pola: satu halaman dengan "kabel" vertikal di kiri yang menyambung beberapa jendela node: Hero (siapa) → Topik → Contoh konten → Ikuti → Hubungi. Halaman dibaca seperti alur graph.
- Warna: gelap #11131A, node #1A1D27, garis #3A4054, krem #F5F2EA, pink #FF3B5C (tab node), kuning #FFC93C (satu kata penekanan + pin + tombol utama).
- Font (usulan, owner yang setujui): Archivo Bold/ExtraBold untuk judul dan isi, JetBrains Mono untuk label. Beda dari carousel (Liberation Sans/DejaVu Mono, itu sementara). Lisensi OFL.
- Beda dari template: tata letak berupa graph node, bukan kartu kembar; contoh konten berupa slide carousel tiruan HTML/CSS (ilustrasi ditandai placeholder).

## Hasil
web/pratinjau/index.html
web/foto/index-laptop.png
web/foto/index-hp.png
web/pratinjau/gambar/share.jpg

## Keputusan kamu
1. Halaman udah jadi di link pratinjau: https://pratinjau.fitra-office.timku.ai.id/21cf6b7a079a9243849ac471/ . Font Archivo + JetBrains Mono oke?
a) Oke, pakai itu (rekomendasi: beda dari carousel yang masih font sementara, dua-duanya lisensi OFL)
b) Ganti font: tulis maunya
2. Halaman ini belum boleh diterbitkan: nomor WA (6280000000000) dan email (halo@contoh.invalid) masih DUMMY. Gimana?
a) Aku kasih kontak asli nanti, tunggu dulu (rekomendasi)
b) Hapus bagian kontak, terbitin tanpa kontak
c) Revisi tampilan: tulis bagian yang mau diubah

## Berikutnya
- Setelah jawaban owner: ganti font/kontak sesuai jawaban, `node alat/web.mjs ukur`, foto ulang, lalu minta owner pencet Terbitkan di dashboard (Dimas gak nerbitin sendiri).
- Kalau owner kasih karya/tangkapan editor sendiri, ganti 3 ilustrasi placeholder di bagian contoh carousel.
