# SOP: laporan pemakaian harian

## 1. Tujuan
Tiap malam owner dapat laporan singkat: seberapa banyak Claude dipakai kantor hari itu (token, panggilan alat, panggilan
agen, jatah) dan biaya fal. Tujuannya statistik buat ngatur kerja, bukan tagihan resmi.

## 2. Bahan
- `catatan/statistik-pemakaian.jsonl`: satu baris per hari, dibikin `node statistik/ukur.mjs` lewat cron jam 23.50
  (tanpa AI). Baca pakai Read, ambil baris hari ini dan baris kemarin buat banding. **Jangan ngitung ulang atau nebak
  angka**; salin dari situ. Kalau baris hari ini gak ada: tulis "statistik belum ada" dan jangan ngarang.
- `catatan/detak-*.log`: baris `↳ ... jatah 5 jam X% · mingguan Y%` terakhir hari itu, dan jumlah putaran per manajer
  hari itu (`== <tanggal> ... putaran N`), termasuk yang "gak ada kerjaan".
- `catatan/fal-biaya.jsonl`: biaya fal hari itu (ESTIMASI USD, jumlahin lewat alat hitung, bukan di kepala).
- Catatan produksi: bagian "Udah" T-08 buat tau akun mana (late30/autoaja) yang diproduksi hari itu.

## 3. Isi laporan (file `hasil/laporan-pemakaian-YYYY-MM-DD.md`)
1. **Ringkasan 3 baris**: pemakaian naik/turun dibanding kemarin, hal paling boros, 1 saran penghematan kalau ada.
2. **Token**: tabel per jenis sesi (obrolan, detak, agen): pesan AI, token keluar, cache baca. Bahasa awam: "cache baca" =
   konteks yang dibaca ulang tiap giliran.
3. **Alat**: 5 alat paling sering (Read, Bash, Edit, dst.) dan totalnya.
4. **Agen**: berapa kali tiap agen dipanggil (Penulis, Pemeriksa/Satpam, Desainer, Kritikus, dll.) dan pesan AI tiap agen.
5. **Detak**: putaran per manajer, berapa yang "gak ada kerjaan" (sia-sia), jatah 5 jam & mingguan terakhir (reset
   mingguan kapan).
6. **Biaya fal**: total estimasi USD hari itu (tulis "estimasi").
7. **Per akun**: produksi hari itu buat late30 atau autoaja (dari T-08), berapa putaran agen yang kepakai.
8. **Yang janggal**: lonjakan >2x dari kemarin, agen dipanggil berulang, putaran sia-sia banyak.
Catatan wajib di atas: "Kantor pakai jatah langganan, bukan tagihan per token. Angka di sini token & persen jatah, bukan
rupiah. Persen jatah itu seluruh akun, gak bisa dipisah per manajer."

## 4. Simpan & kirim
1. Simpan lokal `hasil/laporan-pemakaian-YYYY-MM-DD.md`, tulis jalurnya di task T-09 bagian `## Hasil`.
2. Simpan ke Drive: **cuma folder `Hasil` di dalam folder kantor** (skill google-drive: cari dulu `parentId = '<id utama>'
   and (title = 'Hasil')`, kalau kosong bikin). `create_file` judul "Laporan Laras YYYY-MM-DD", `textContent` isi
   laporan, `contentMimeType` `text/plain` (jadi Google Docs). Jangan pakai `drive.mjs kirim`. Jangan bikin subfolder.
   Tulis link `viewUrl` di T-09. Drive gagal/belum nyambung: bilang di laporan, laporan lokal tetap jadi.
3. Notif: `bash notif.sh "Laporan pemakaian" "<ringkasan 1 kalimat>"`. Notif jam 22.00–07.00 ditahan dan dikirim 07.00.

## 5. Siapa mutusin
- AI sendiri: baca, ringkas, banding, nandain yang janggal.
- Owner: apa pun soal ngurangin pemakaian (matiin detak, ubah batas jatah), bayar, & ganti langganan.
