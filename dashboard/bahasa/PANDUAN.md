# Kamus bahasa kit (KD-121)

Satu sumber teks tampilan: `bahasa/<kode>/<bagian>.json`, kunci rata. `id` = bawaan & acuan, `ms` & `en` ngikut.

| Bagian | Awalan kunci | Dipakai di |
|---|---|---|
| `umum.json` | `umum.` | teks yang dipakai lebih dari satu tempat (nama bahasa, tombol umum) |
| `wizard.json` | `wz.` | `installer/wizard.mjs` |
| `pasang.json` | `wz.ps.` | label divisi/tampilan/detak, judul & pesan langkah pasang, judul + pertanyaan task pertama (`installer/pasang.mjs`) |
| `dashboard.json` | `db.` | `dashboard/server.mjs`, `hasil-task.mjs`, `keputusan.mjs`, `situs.mjs` |
| `alat.json` | `al.` | pesan alat/* (Repliz, fal, Drive, web) yang diteruskan dashboard: templat id = teks persis di alat/, lihat `bahasa/alat.mjs` |
| `app.json` | `app.` | skrip browser `dashboard/aset/*.js` (dikirim server lewat `<script type="application/json" id="teks-app">`) |

Pesan terminal (skrip `.sh`) gak pakai JSON: `installer/pasang-awal.sh` dikirim sendirian lewat `curl | bash` (kit belum
ada), jadi teksnya ditulis berdampingan pakai fungsi `pesan "<id>" "<ms>" "<en>"` (lihat `installer/bahasa.sh`).

## Aturan
- Kunci baru: tulis dulu di `id`, terus `ms` & `en`. Kunci yang belum diterjemahin jatuh ke `id` (gak error), tapi
  `uji/kd121-bahasa.test.mjs` nagih semua kunci `id` ada di `ms` & `en`, kecuali yang dicatat di `SENGAJA_ID` di tes itu.
- Isian pakai `{nama}`. Nilai boleh HTML; isian yang asalnya dari user wajib di-`esc` sebelum masuk.
- Jangan diterjemahin: Lembur.id, Kit, Builder, Claude, nama manajer (Sari, Bima, …), Repliz, ntfy, nama file/perintah
  (`jadi builder`, `sudo bash …`), nilai yang dibaca mesin (status task, judul bagian task).

## Gaya
- **Indonesia**: santai-sopan, "kamu"/"aku" (lihat kitab bahasa).
- **Bahasa Melayu (Malaysia)**: Melayu Malaysia beneran, bukan Indonesia diganti dikit. Sapaan "anda" (UI) — boleh
  "awak" di gelembung Builder yang santai. Kosa kata Malaysia: kerana, boleh, percuma, muat naik, muat turun, tetapan,
  kemas kini, simpan, padam, cuba, sila, tekan, pautan, kata laluan, papan pemuka, pejabat, kerja, ralat, berjaya,
  gagal, sedang, belum, sudah, nanti, mesej, pemberitahuan, jadual, jualan, pelanggan, harga, akaun, log masuk.
  Hindari kata Indonesia: "gak", "udah", "bikin", "kantor" (→ pejabat), "kirim" (→ hantar), "unggah", "pengaturan",
  "kata sandi", "tautan", "ganti" (→ tukar), "mulai" (→ mula), "lihat" boleh, "nyalain" (→ hidupkan).
  Nada santai tapi sopan, kalimat pendek.
- **English**: natural, ringkas, plain words. "you"/"I". Bukan terjemahan kata per kata.

## Pesan alat/* (al.*)
`alat/*.mjs` tetap berbahasa Indonesia (agent manggilnya dari terminal). Dashboard nerjemahin di perbatasan lewat
`bahasa/alat.mjs` (`tl()` di server.mjs): `id/alat.json` = templat pesan persis kayak di alat (isian `{nama}`), `ms`/`en` =
terjemahannya. Alat ditambah/diubah teksnya → ubah templat id yang sama; `uji/kd121-alat.test.mjs` nagih tiap pesan
`gagal()`/`ReplizGagal`/`masalah.push` di alat/ punya templat, dan templat yang udah gak ada di alat/ dihapus.
Jam/tanggal: dashboard jalanin `alat/repliz.mjs` dengan `KIT_LOKAL` (bahasa dashboard); formatnya selalu 24 jam (`hourCycle: 'h23'`),
termasuk ms-MY yang bawaannya 12 jam ("PTG").
