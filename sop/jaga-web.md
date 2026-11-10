# SOP: jaga website tiap hari (contoh)

## 1. Tujuan
Web yang tayang selalu nyala, aman (HTTPS), & cepat. Kalau ada masalah, owner tau duluan dari tim, bukan dari pembeli.

## 2. Bahan masuk
- `node alat/web.mjs cek` (hasil di `web/cek.json`), `node alat/web.mjs status`.

## 3. Langkah
1. Tiap pagi (detak / laporan pagi): `node alat/web.mjs cek`.
2. ✅ → tulis 1 baris di laporan ("web sehat, 640 ms"). ❌ → skill **jaga-web** bagian "kalau bermasalah", tulis di
   "Keputusan kamu" + notif ke owner.
3. Sertifikat tinggal <14 hari → kabarin owner (biasanya perpanjang sendiri; kalau gak, ada yang salah di DNS/Caddy).
4. Sebulan sekali: cek isi web masih bener sama `brand/fakta.md` (harga, jam buka, promo). Beda → usulin update.

## 4. Hasil
1 baris status di laporan harian, task `nunggu-kamu` kalau ada masalah.

## 5. Siapa mutusin
- AI sendiri: ngecek, nyari penyebab, usulin perbaikan.
- Owner: balik ke versi lama, ganti domain/DNS, apa pun yang ngubah web yang tayang.
