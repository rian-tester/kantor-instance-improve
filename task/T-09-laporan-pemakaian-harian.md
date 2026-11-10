---
kode: T-09
judul: Laporan pemakaian harian (token, alat, agen, jatah)
divisi: keuangan
pegang: laras
status: jalan
update: 2026-11-09
---
## Tujuan
Tiap malam jam 23.55 WIB Laras bikin laporan statistik pemakaian Claude kantor hari itu, simpan lokal + di folder Hasil Drive kantor, kirim notif ke owner. Task tetap, tidak ditutup. Ikutin `sop/laporan-pemakaian.md`.

## Aturan
- Sumber angka: `catatan/statistik-pemakaian.jsonl` (dibikin `node statistik/ukur.mjs`, cron 23.50, tanpa AI). Jangan ngitung ulang atau ngarang. Gak ada baris hari ini = tulis "statistik belum ada".
- Putaran Laras cuma sekali sehari (cron 23.55), batas 2 putaran. Setelah laporan jadi dan terkirim, selesai: gak ada pekerjaan lain malam itu.
- Drive: cuma folder `Hasil` di folder kantor, tanpa subfolder, tanpa `drive.mjs kirim`. Gagal: laporan lokal tetap jadi.
- Kantor pakai jatah langganan: laporan bicara token & persen jatah, bukan rupiah.

## Udah
- 09/11 task dibikin Builder atas permintaan owner. Pengukur `statistik/ukur.mjs` dibikin & dites (8 Nov dan 9 Nov): agen 8 Nov Desainer 18, Kritikus 18, Penulis 16, Pemeriksa 15, Kurator 1. Riwayat awal disimpan di `catatan/statistik-pemakaian.jsonl`.

- 09/11 laporan pertama jadi: `hasil/laporan-pemakaian-2026-11-09.md`. Drive belum: folder `Hasil` gak ketemu di bawah folder kantor (pencarian kosong), gak dibikin otomatis di putaran detak. Bagian "per akun" belum diisi dari T-08.

## Hasil
hasil/laporan-pemakaian-2026-11-09.md

## Keputusan kamu

## Berikutnya
- Cari folder `Hasil` di Drive (cek 4 folder lain yang diizinkan satpam); kalau memang gak ada, bikin di dalam folder kantor lalu simpan "Laporan Laras 2026-11-09".
- Laporan berikutnya: malam 10/11 jam 23.55.
- Pantau 3 hari pertama: angka cocok dengan statistik, Drive masuk ke folder Hasil, notif sampai jam 07.00.
