---
name: pembukuan
description: Cara nyatet biaya API, langganan layanan, nota, & mutasi rekening ke buku kas dan bikin rekap biaya tanpa salah hitung. Pakai tiap ada tagihan/nota/catatan uang keluar, atau owner nanya soal biaya.
---

# Pembukuan

**Buku kas cuma diubah lewat `node alat/kas.mjs`** (file `keuangan/kas.csv` dikunci pagar). Jangan ngitung total di
kepala: semua angka keluar dari alat. Satu perintah per langkah, tanpa variabel/`&&`/`|`.

## Biaya API & layanan (fokus kantor ini)
- **fal (gambar, video, suara):** tiap panggilan udah dicatat otomatis di `catatan/fal-biaya.jsonl` (estimasi USD).
  Baca pakai Read. Itu ESTIMASI, bukan tagihan resmi. Rekap per bulan: jumlahin estimasi tiap baris berstatus selesai,
  pakai `node alat/hitung-csv.mjs` kalau perlu, jangan di kepala. Tulis jelas "estimasi, cocokin sama tagihan fal".
- **Claude:** kantor gak nyatet biaya per panggilan. Angkanya dari tagihan/halaman pemakaian akun yang owner kirim.
  Jangan ngarang angka.
- **Langganan (Repliz, VPS, domain, dll.):** catat per kejadian dari tagihan/bukti bayar yang owner kasih.
- Kurs USD→Rp: tanya owner kursnya (atau pakai kurs di tagihan). Jangan nebak kurs.
- Kategori biaya: `api-ai`, `langganan`, `iklan`, `lainnya` (lihat `keuangan/kategori.md`).

## Baca nota / struk
- Yang dicatat: **tanggal transaksi** & **total yang dibayar** (udah termasuk pajak/servis, setelah diskon). Bukan
  subtotal, bukan "tunai"/"kembalian".
- Satu nota = satu catatan. Keterangan ringkas: penyedia + isi utama (mis. "fal.ai: kredit gambar Oktober").
- Gak kebaca jelas (angka/tanggal) → tetap catat pakai `--ragu`, terus tanya owner. Jangan nebak diam-diam.
- Gak ada tahun di nota → pakai tahun berjalan (`--tahun`).
```
node alat/kas.mjs catat --tanggal 2026-10-04 --jenis keluar --kategori langganan --jumlah 150000 --ket "VPS bulan Oktober" --sumber masuk/keuangan/vps-okt.jpg
```

## Mutasi rekening (CSV)
```
node alat/hitung-csv.mjs masuk/keuangan/mutasi-okt.csv --info
node alat/kas.mjs impor masuk/keuangan/mutasi-okt.csv --tanggal Tanggal --ket Keterangan --jumlah Jumlah --tahun 2026
node alat/kas.mjs kategori --cari "fal" --jadi api-ai
```
- Bank misahin kolom debit/kredit → pakai `--masuk <kolom> --keluar <kolom>` gantiin `--jumlah`.
- Tanda DB/CR atau minus kebaca sendiri. Baris yang udah ada otomatis dilewat (aman diimpor ulang).
- Mutasi PDF: baca isinya, catat satu-satu pakai `catat` (sumber = nama file PDF).
- Transfer antar rekening sendiri bukan pengeluaran biaya: tanya owner, biasanya `ubah <id> --batal`.

## Kategori
- Pakai daftar di `keuangan/kategori.md`. Gak cocok sama yang ada → tanya owner (pakai pilihan), jangan bikin sendiri.

## Laporan
- `node alat/kas.mjs rekap --bulan 2026-10` → tabel bulan itu + banding bulan lalu. Salin angkanya apa adanya.
- Masih ada "belum"/ragu → tulis "angka sementara" + daftar yang nunggu owner.
- Itu **catatan kas**, bukan laporan pajak resmi. Bilang gitu kalau owner nanya.
- Nomor rekening orang & nama pengirim gak ditulis di laporan.
