---
name: google-drive
description: Cara nyari, baca, dan nyimpen file di Google Drive kantor (satu folder yang disambungin owner). Pakai tiap owner nyebut Drive, atau bahan/hasil kerjaan ada di Drive.
---

# Google Drive kantor

Drive owner nyambung lewat konektor akun Claude, tapi tim **cuma boleh kerja di satu folder kantor**. Satpam
(`alat/satpam-drive.mjs`) ngecek tiap aksi Drive; yang di luar aturan ditolak otomatis, jadi jangan coba nembus.

Belum nyambung (`.drive/folder.json` gak ada, atau alat Google Drive gak muncul)? Bilang ke owner:
"jadi builder, sambungin google drive".

## Abis disambungin / pas owner minta "cek google drive"
1. `get_file_metadata` folder utama (id di `.drive/folder.json`): biar dashboard tau nama folder & akunnya.
2. `search_files` isi folder utama, terus cari/bikin folder **Hasil** (lihat bawah).
3. Laporin ke owner: nama folder, isinya, dan link folder Hasil. Status lengkap ada di dashboard → Lainnya → Google Drive.

## Nyari file
- Id folder kantor: baca `.drive/folder.json` (`utama`). Folder & file yang udah dikenal satpam: `.drive/dikenal.json`.
- `search_files` WAJIB pakai salah satu bentuk ini, persis:
  ```
  parentId = '<id folder>'
  parentId = '<id folder>' and (title contains 'penjualan')
  ```
  Satu pencarian = isi langsung satu folder. Isi subfolder: cari lagi pakai id subfolder-nya.
- Cuma butuh daftar file? Tambahin `excludeContentSnippets: true` (lebih irit jatah).
- `list_recent_files` selalu ditolak (nyakup seluruh Drive owner).

## Baca
- `read_file_content`: Google Docs/Sheets/Slides, PDF, Word, Excel, foto. File gede bisa kepotong: bilang ke owner.
- Ngitung angka dari spreadsheet: salin datanya ke `masuk/<divisi>/<nama>.csv` (Write), terus pakai skill
  **rekap-angka**. Lebih dari ±300 baris = boros jatah: tanya owner dulu pakai alat pilihan.
- Video & voice note: cuma bisa disebut namanya, gak bisa ditonton atau didengerin.

## Nyimpen hasil
- Cuma boleh di folder **Hasil** di dalam folder kantor. Belum ada? Cari dulu
  `parentId = '<id utama>' and (title = 'Hasil')`. Kalau kosong, bikin: `create_file` title `Hasil`,
  parentId = id utama, contentMimeType `application/vnd.google-apps.folder`.
- Dokumen: `create_file` + `textContent` + contentMimeType `text/plain` (jadi Google Docs). Tabel: `text/csv` (jadi
  Google Sheets). Judul jelas pakai tanggal, mis. "Rekap pesanan 2026-10-05".
- Tetap simpen salinannya di `hasil/` lokal, terus tulis link Drive-nya (`viewUrl`) di task.
- Ganti nama / mindahin file: owner ditanya. Hapus & share ke orang lain: selalu ditolak, tulis di "Keputusan kamu".

## Kirim file ke Drive
- **DILARANG (aturan owner 08/11): `node alat/drive.mjs kirim` dan `--folder`.** Alat itu bikin folder "Lembur – Hasil"
  dan subfolder di luar folder Drive kantor. Jangan dijalankan sampai owner bilang boleh.
- Gambar, video, dan hasil lokal lain cukup di `hasil/` lokal. Tulis jalurnya di task. Mau ke Drive? Tulis di
  "Keputusan kamu", owner yang mutusin.
- Dokumen & tabel kecil: simpan lewat konektor (bagian atas) ke folder Hasil di dalam folder Drive kantor.
- Jangan pakai `create_file` konektor untuk berkas biner atau berkas lebih dari 100 KB. Jangan mengetik base64.
- `sambung` dan `putus` cuma dari dashboard atau terminal owner. Agent gak menjalankan dua perintah itu.

## Hasil produksi dan persetujuan
Abis produksi, simpan salinan hasil di `hasil/…`, lalu tulis jalurnya di task bagian `## Hasil`, satu jalur per baris.
Boleh tulis folder carousel. Hasil fal atau Remotion yang masih di folder produksinya juga bisa dipratinjau lewat
jalur lokal di task. Tetap catat kerjaan dan lokasi hasil di "Udah". Dashboard menampilkan hasil tepat di atas
"Keputusan kamu", jadi owner bisa melihat hasil dan langsung menjawab.

Jangan jalankan `node alat/drive.mjs kirim` atau `--folder` (lihat "Kirim file ke Drive" di atas). Simpan hasil di
`hasil/` lokal dan tulis jalurnya di task. Jangan menganggap sambungan konektor baca sudah bisa mengirim gambar atau video.

Set task `nunggu-kamu`, lalu isi pertanyaan bernomor, misalnya:
```text
1. Hasil T-07 (carousel 7 slide + caption) udah oke buat dijadwalin?
a) Oke, jadwalin (rekomendasi: ikuti waktu yang sudah disepakati)
b) Revisi: tulis bagian yang mau diubah
c) Batal
```

Kalau owner minta revisi, bikin versi baru di `hasil/…-v2`. Di `## Hasil`, taruh jalur terbaru lebih dulu,
kemudian jalur sebelumnya dengan catatan "versi lama" di baris yang sama atau di bawah judul `### Versi lama`.
File versi lama tetap disimpan, pratinjaunya dilipat. Simpan versi baru di `hasil/` lokal, lalu minta persetujuan lagi.
