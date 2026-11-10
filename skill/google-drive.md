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
- Untuk gambar, video, atau hasil lokal apa pun, pakai `node alat/drive.mjs kirim hasil/nama-berkas.mp4`.
  Subfolder opsional satu tingkat: `--folder "Kampanye Oktober"`. Aku kasih link file dan folder hasil ke owner,
  lalu tulis link itu di task. Salinan lokal tetap disimpan.
- Jangan pakai `create_file` konektor untuk berkas biner atau berkas lebih dari 100 KB. Jangan mengetik base64.
- Cek sambungan kirim: `node alat/drive.mjs status`. Kalau belum tersambung, minta owner buka dashboard →
  Lainnya → Google Drive → **Sambungkan Google Drive**. Owner buka google.com/device dan masukkan kode.
- `sambung` dan `putus` cuma dari dashboard atau terminal owner. Agent gak menjalankan dua perintah itu.
- Hasil kiriman masuk ke **Lembur – Hasil**, folder bikinan kit. Sambungan ini terpisah dari konektor baca di atas.

## Hasil produksi dan persetujuan
Abis produksi, simpan salinan hasil di `hasil/…`, lalu tulis jalurnya di task bagian `## Hasil`, satu jalur per baris.
Boleh tulis folder carousel. Hasil fal atau Remotion yang masih di folder produksinya juga bisa dipratinjau lewat
jalur lokal di task. Tetap catat kerjaan dan lokasi hasil di "Udah". Dashboard menampilkan hasil tepat di atas
"Keputusan kamu", jadi owner bisa melihat hasil dan langsung menjawab.

Untuk sosmed, cek `node alat/drive.mjs status`. Kalau kirim Drive sudah disambung, jalankan
`node alat/drive.mjs kirim <berkas…> --folder "<kode task>"` lalu tulis link Drive tiap berkas di task.
Kalau belum disambung, tulis: "Kamu bisa sambungkan kirim hasil lewat dashboard → Google Drive → Sambungkan Google Drive."
Jangan menganggap sambungan konektor baca sudah bisa mengirim gambar atau video.

Set task `nunggu-kamu`, lalu isi pertanyaan bernomor, misalnya:
```text
1. Hasil T-07 (carousel 7 slide + caption) udah oke buat dijadwalin?
a) Oke, jadwalin (rekomendasi: ikuti waktu yang sudah disepakati)
b) Revisi: tulis bagian yang mau diubah
c) Batal
```

Kalau owner minta revisi, bikin versi baru di `hasil/…-v2`. Di `## Hasil`, taruh jalur terbaru lebih dulu,
kemudian jalur sebelumnya dengan catatan "versi lama" di baris yang sama atau di bawah judul `### Versi lama`.
File versi lama tetap disimpan, pratinjaunya dilipat. Kirim versi baru ke Drive kalau tersambung, lalu minta persetujuan lagi.
