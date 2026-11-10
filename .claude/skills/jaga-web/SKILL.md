---
name: jaga-web
description: Cara ngerawat website yang udah tayang — cek harian, kalau web mati/lambat/sertifikat mau abis, versi & balik versi, pasang domain sendiri. Pakai buat laporan harian web atau pas owner nanya soal web/domain.
---

# Jaga web

## Cek harian
`node alat/web.mjs cek` → nyatet di `web/cek.json` (dashboard → Website nampilin hasilnya).
- ✅ → 1 baris di laporan ("web sehat, 640 ms, sertifikat 71 hari").
- ❌ → cari penyebabnya di bawah, tulis di "Keputusan kamu" (pakai pilihan), kirim notif ke owner.

## Kalau bermasalah
- **Gak bisa dibuka / timeout:** cek `node alat/web.mjs status`. Belum pernah terbit → wajar ("lagi disiapin"). Udah
  terbit tapi mati → dashboard ikut mati gak? Kalau iya, VPS/dashboard-nya yang bermasalah: minta owner
  "jadi builder, cek dashboard".
- **Sertifikat <14 hari / gak kebaca:** biasanya perpanjang sendiri. Pakai domain sendiri? Cek DNS-nya masih ngarah ke
  IP VPS (owner yang ngecek di tempat beli domain).
- **Lambat (>3 detik):** jalanin `node alat/web.mjs ukur`, biasanya gambar kegedean.
- Versi baru bikin rusak → usulin owner pencet **Balik ke versi sebelumnya** di dashboard → Website.

## Versi
Tiap Terbitkan, versi lama disimpen (5 terakhir). Nerbitin & balik versi cuma owner (tombol dashboard).

## Domain sendiri
1. Owner beli domain (Niagahoster, Rumahweb, Cloudflare, dll.).
2. Di DNS domain itu: record **A** `@` (dan `www` kalau mau) → IP VPS (alamat dashboard tanpa `.sslip.io`, titik
   ganti strip jadi titik: `103-20-30-40.sslip.io` → `103.20.30.40`).
3. Daftarin ke kantor: `node alat/web.mjs domain tambah tokoku.com` (dan `www.tokoku.com` kalau dipakai). Perintah ini
   minta izin owner.
4. Tunggu DNS nyambung (5 menit–beberapa jam), buka `https://tokoku.com`. Sertifikat HTTPS dibikin otomatis.
5. Ganti alamat di `sitemap.xml`, `robots.txt`, & `og:url` di pratinjau, terus minta owner terbitin ulang.
