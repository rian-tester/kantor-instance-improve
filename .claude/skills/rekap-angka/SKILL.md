---
name: rekap-angka
description: Cara bikin rekap angka (pesanan, omzet, stok, pengeluaran) dari file CSV atau Excel tanpa salah hitung. Pakai tiap ada angka yang dijumlah, dirata-rata, atau dihitung dari data.
---

# Rekap angka

**Jangan pernah ngitung di kepala.** AI sering salah jumlah. Semua angka di rekap wajib keluar dari alat di bawah, dan
tiap angka ditulis sumbernya.

## 1. Siapin data
- File Excel (`.xlsx`): ubah ke CSV dulu.
  ```
  node alat/xlsx-ke-csv.mjs masuk/pesanan/data.xlsx --daftar
  node alat/xlsx-ke-csv.mjs masuk/pesanan/data.xlsx --sheet 1 --ke masuk/pesanan/data.csv
  ```
  Kolom tanggal yang keluar angka (mis. 46300): tambahin `--tanggal <nama kolom>`.
  File `.xls` lama gak bisa: minta owner simpen ulang sebagai `.xlsx` atau CSV.
- Kenalan sama isinya: `node alat/hitung-csv.mjs <file.csv> --info` (jumlah baris, nama kolom, contoh isi).
- Ada kolom nama/nomor HP/alamat pembeli? Jangan disalin ke hasil. Buat rekap gak butuh data pribadi.

## 2. Hitung pakai alat
Jalankan persis kayak contoh. Angka tetap dihitung alat, bukan dikira-kira di kepala.

```
node alat/hitung-csv.mjs <file.csv> --jumlah total                          # total omzet
node alat/hitung-csv.mjs <file.csv> --jumlah jumlah,total --kelompok produk # per produk, urut terbesar
node alat/hitung-csv.mjs <file.csv> --hitung --kelompok status_kirim        # banyak pesanan per status
node alat/hitung-csv.mjs <file.csv> --hitung --filter status_kirim~belum --tampil no_pesanan,produk,total  # yang belum dikirim + nomornya
```
- `--filter kolom=nilai` sama persis, `kolom~nilai` mengandung. Boleh berkali-kali. Nilainya ada spasi (mis.
  `belum bayar`)? Pakai `~` sama satu katanya aja: `--filter status~belum`.
- Angka "Rp18.000", "1.234,56", pemisah titik koma dari Excel Indonesia udah kebaca sendiri.
- Muncul "⚠️ sel gak kebaca sebagai angka"? Sebut di rekap, jangan didiemin.

## 3. Cek ulang sebelum nulis
- Total per kelompok harus sama sama total keseluruhan (baris **Total** di keluaran alat).
- Bandingin sama rekap sebelumnya (`hasil/`): beda jauh (mis. >50%)? Cek datanya dulu, terus sebut di rekap.
- Angka gak cocok sama yang owner bilang? Bilang gak cocok, **jangan dibulatin diam-diam**.

## 4. Tulis rekap
Pendek, dibaca dari HP. Paling atas yang perlu tindakan (stok mau abis, pesanan belum dikirim).

```
**Rekap 5 Okt** (sumber: masuk/pesanan/pesanan-2026-10-05.csv, dihitung pakai alat/hitung-csv.mjs)
- 23 pesanan, omzet Rp697.000
- Terlaris: Kopi susu gula aren 250 ml (10 cup)
- ⚠️ 2 pesanan belum dikirim: KS-1005-007, KS-1005-020
```
<!-- Alur Academy lintas divisi: dibaca sebelum instruksi rinci skill ini. -->
Baca skill alur-divisi dan aturan brand divisi yang relevan. Konsep/pilihan
owner mendahului produksi; pemeriksa terpisah mendahului persetujuan akhir.
Simpan revisi yang disepakati sebagai aturan berkonteks untuk tugas berikutnya.
Tanpa sumber/alat/izin, catat belum terpenuhi atau dilewati, bukan berhasil.
