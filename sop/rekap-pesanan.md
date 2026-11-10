# SOP: rekap pesanan harian (contoh)

## 1. Tujuan
Tiap pagi ada rekap pesanan kemarin: jumlah pesanan, omzet, produk terlaris, dan pesanan yang belum dikirim. Buat
owner, dibaca dari HP.

## 2. Bahan masuk
- `masuk/pesanan/`: file ekspor pesanan (CSV dari marketplace/kasir). Kolom nama, nomor HP, alamat pembeli dibuang
  dulu sama owner.
- `brand/fakta.md`: daftar produk & harga.

## 3. Langkah
1. Buka file pesanan tanggal kemarin di `masuk/pesanan/`. Gak ada → tulis "file kemarin belum ada" di task, selesai.
2. Hitung: jumlah pesanan, omzet (jumlah kolom total), 3 produk terlaris (berdasar jumlah).
3. Daftar pesanan yang statusnya belum dikirim, plus umurnya (hari).
4. Bandingin sama rekap sehari sebelumnya kalau ada (naik/turun berapa).
5. Simpan di `hasil/rekap-YYYY-MM-DD.md` (maks 15 baris).
6. Ada pesanan belum dikirim >2 hari → tulis di "Keputusan kamu" task + status `nunggu-kamu`.

## 4. Hasil
`hasil/rekap-YYYY-MM-DD.md`. Contoh:
> **Rekap 5 Okt** (sumber: masuk/pesanan/pesanan-2026-10-05.csv) · 23 pesanan · omzet Rp697.000 (+8% dari 4 Okt) ·
> terlaris: kopi susu gula aren 250 ml (9), matcha latte (4), americano (4) · belum dikirim: 2 (KS-1005-007,
> KS-1005-020, umur 0 hari).

## 5. Siapa mutusin
- AI sendiri: ngitung, ngebandingin, nandain yang janggal.
- Owner: apa pun soal pengiriman, refund, dan ngehubungin pembeli.
