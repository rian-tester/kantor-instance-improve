# SOP: catat biaya API & layanan

## 1. Tujuan
Biaya API dan layanan kantor selalu kecatat, kategorinya bener, dan owner bisa liat total per bulan.

## 2. Bahan masuk
- `catatan/fal-biaya.jsonl`: biaya fal per panggilan, otomatis (ESTIMASI USD).
- `masuk/keuangan/`: tagihan, invoice, bukti bayar (Claude, Repliz, VPS, domain), atau CSV mutasi rekening.
- Catatan owner di chat ("bayar VPS 150rb").
- `keuangan/kategori.md`: api-ai, langganan, iklan, lainnya.

## 3. Langkah
1. Liat yang belum dicatat: `node alat/kas.mjs daftar --bulan YYYY-MM`.
2. Biaya fal: baca `catatan/fal-biaya.jsonl`, jumlahin estimasi bulan itu lewat alat hitung (bukan di kepala),
   catat sebagai satu baris `api-ai` bertanda `--ragu` (karena estimasi) sampai dicocokin sama tagihan asli fal.
3. Tagihan lain: `node alat/kas.mjs catat ...` (satu tagihan = satu catatan, sumber = nama file).
4. Mutasi CSV: `node alat/hitung-csv.mjs <file> --info`, lalu `node alat/kas.mjs impor ...`, lalu kasih kategori.
5. Tanya owner kurs USD→Rp kalau ada biaya dalam dolar. Yang ragu masuk "Keputusan kamu" task, status `nunggu-kamu`.
6. Akhir bulan: `node alat/kas.mjs rekap --bulan YYYY-MM`, tulis ke `hasil/biaya-YYYY-MM.md`.

## 4. Hasil
`keuangan/kas.csv` (lewat alat) + `hasil/biaya-YYYY-MM.md` + 1–3 baris di task.

## 5. Siapa mutusin
- AI sendiri: nyatet, kategori yang jelas, nandain yang janggal.
- Owner: kurs, angka yang ragu, kategori baru, apa pun soal bayar & transfer.
