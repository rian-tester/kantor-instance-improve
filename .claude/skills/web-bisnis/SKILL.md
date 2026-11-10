---
name: web-bisnis
description: Cara bikin landing page, katalog, link-in-bio, & halaman promo bisnis yang layak tayang di web/pratinjau (HTML+CSS statis, mobile-first, data dari fakta, tombol WhatsApp, SEO dasar) sampai siap diterbitin owner. Pakai tiap bikin atau ngubah website.
---

# Website bisnis

**Standar: layak tayang.** Owner bayar biar webnya bisa langsung dipamerin ke pelanggan. Hasil yang keliatan kayak
template AI = gagal, walaupun "jalan". Selalu pakai skill **frontend-design** & **ui-ux-pro-max** buat arah desain,
**anti-slop-indo** buat tulisan, dan **cek-tampilan** sebelum nyerahin.

## 1. Pahami dulu bisnisnya
Baca `brand/brief.md` & `brand/fakta.md`. Jawab di kepala (tulis di task kalau perlu):
- jualan apa, buat siapa, kenapa orang milih bisnis ini (dari fakta, bukan karangan);
- pengunjung mau ngapain: pesan lewat WA, liat harga, datang ke toko, booking;
- satu hal yang paling khas dari bisnis ini (bahan, cara bikin, tempat, orangnya) → ini yang dibikin menonjol.

## 2. Arah desain — WAJIB, jangan dilewat (ini yang bikin beda sama web template)
1. Panggil skill **frontend-design** (alat Skill) & ikutin prosesnya: rencana warna, tipografi, tata letak, prinsip,
   terus review sendiri bagian mana yang masih "default AI".
2. `node alat/gaya.mjs "<jenis bisnis> <pelanggannya> <suasana>"` → rekomendasi pola halaman, gaya, palet, & font dari
   database ui-ux-pro-max. Ambil yang cocok sama brief, buang yang generik (jangan ditelan mentah).
   Butuh detail satu hal: `node alat/gaya.mjs "<kata kunci>" --domain typography|color|style|ux|landing`.
3. Pilih font beneran (bukan bawaan sistem): `node alat/font.mjs "<Font Judul>" "<Font Badan:400;600>"` → file
   disimpen di `web/pratinjau/font/` + `font/font.css`.
4. Warna dari brief kalau ada. Satu hal yang dibikin berani & berkesan (biasanya di layar pertama), sisanya tenang.
5. Tulis rencananya 3–5 baris di task: pola halaman, gaya, warna (hex), font, hal yang bikin beda.

## 3. Bikin (di `web/pratinjau/`)
- Statis: `index.html`, `gaya.css`, `app.js` kalau perlu, `gambar/`. **Tanpa framework, build, atau script CDN.**
- **Path relatif** (`gaya.css`, `gambar/logo.webp`), jangan diawali `/` (rusak di pratinjau).
- Mobile-first: dibikin buat lebar 390px dulu, baru dilebarin. Teks badan ≥16px, tombol ≥44px, tanpa geser samping.
- Font dari `node alat/font.mjs` (`<link rel="stylesheet" href="font/font.css">`), maks 2 keluarga.
- Bisnis jasa/digital tanpa foto: tunjukin hasilnya pakai elemen yang dibikin di HTML/CSS (mis. mockup HP berisi
  contoh halaman, kartu sebelum–sesudah), bukan blok teks doang & bukan foto stok.
- Gambar: dari owner (`masuk/web/` / Drive kantor), dikecilin wajar (lebar maks ±1600px, foto ≤300 KB, webp kalau
  bisa), `loading="lazy"` buat yang di bawah layar pertama, `width`/`height` diisi biar gak loncat.
- Struktur landing page yang jualan (sesuaiin sama bisnisnya, gak wajib semua):
  1. layar pertama: jualan apa + buat siapa (1 kalimat jelas) + tombol utama (pesan/WA) + foto terbaik;
  2. produk/layanan + harga (cuma dari fakta);
  3. kenapa milih di sini (hal khas di atas, bukti nyata: foto proses/tempat/hasil);
  4. cara pesan (langkah singkat), pengiriman/jam buka/lokasi (link Google Maps kalau toko fisik);
  5. tanya-jawab singkat (pertanyaan yang beneran sering ditanya, tanya owner kalau gak tau);
  6. penutup: ajakan sekali lagi + kontak.
- Tombol WhatsApp: `https://wa.me/62xxxxxxxxxx?text=<pesan siap kirim, di-encode>`. Nomor dari fakta/owner.

## 4. Tulisan
Gaya ngikutin brief, dicek **anti-slop-indo**. Kalimat pendek, ngomongin pelanggan & manfaat konkret.

## 5. SEO & share (wajib)
`<html lang="id">`, `<title>` ≤60 karakter (nama bisnis + jualan apa + kota kalau lokal), meta description ≤155,
`og:title`/`og:description`/`og:image` (`gambar/share.jpg`: desain di `web/share.html` ukuran 1200×630, pakai font &
warna yang sama, dirender otomatis sama `node web/alat/foto.mjs`), favicon, `robots.txt` & `sitemap.xml`
(pakai alamat web dari `node alat/web.mjs status`). Bisnis lokal: tambahin JSON-LD `LocalBusiness` (nama, alamat,
jam buka, telepon) dari fakta.

## 6. Jangan (ciri sampah AI)
- testimoni, rating bintang, jumlah pelanggan, atau angka apa pun yang gak ada di fakta;
- foto stok orang senyum pegang laptop, atau foto yang ngaku-ngaku produk owner;
- "Selamat datang di website kami", "Solusi terbaik untuk kebutuhan Anda", "Kualitas terbaik, harga terjangkau";
- tiga kartu ikon kembar (kualitas/harga/pelayanan), emoji jadi ikon, gradien ungu-biru & efek kaca tanpa alasan;
- semua section rata tengah dengan spasi sama persis; tombol "Pelajari lebih lanjut" tanpa tujuan jelas;
- label kecil (pill/eyebrow) di atas tiap judul, satu kata di judul diwarnain/distabilo, ruang kosong gede tanpa isi;
- font bawaan sistem/Georgia karena gak milih, atau pasangan font yang gak ada alasannya;
- lorem ipsum, link `#` yang gak ke mana-mana, tahun © yang salah.

## 7. Nyerahin
`node alat/web.mjs ukur` (❌ wajib beres) → `node web/alat/foto.mjs` → skill **cek-tampilan** → kasih owner link
pratinjau dari `node alat/web.mjs status` + apa yang berubah + pertanyaan terbit (status `nunggu-kamu`). Yang nerbitin
owner lewat tombol di dashboard → Website. Jangan pernah nyoba nerbitin sendiri.
<!-- Alur Academy lintas divisi: dibaca sebelum instruksi rinci skill ini. -->
Baca skill alur-divisi dan aturan brand divisi yang relevan. Konsep/pilihan
owner mendahului produksi; pemeriksa terpisah mendahului persetujuan akhir.
Simpan revisi yang disepakati sebagai aturan berkonteks untuk tugas berikutnya.
Tanpa sumber/alat/izin, catat belum terpenuhi atau dilewati, bukan berhasil.
