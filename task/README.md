# Dashboard task

Tiap kerjaan = **1 task** = 1 file di folder ini. Nama file: `T-01-judul-singkat.md`. AI yang bikin & ngurus file-nya,
kamu cukup pakai kalimat pendek ("baru: …", "lanjut T-01", "beres", "parkir").

## Format task
```
---
kode: T-01
judul: Ide konten mingguan Kopi Senja
divisi: sosmed
pegang: sari
status: jalan
update: 2026-10-06
---
## Tujuan
Satu kalimat: hasil apa yang dimau & kapan dianggap selesai.

## Udah
- 06/10 bikin 10 ide, disimpen di hasil/2026-10-06-ide-konten.md

## Hasil
- hasil/2026-10-06-ide-konten.md

## Keputusan kamu
1. Fokus minggu ini?
   a) promo kopi susu baru (rekomendasi: lagi musim hujan, cocok minuman manis)
   b) cerita di balik biji kopi

## Berikutnya
- Abis owner milih: tulis 3 naskah carousel.
```

## Status
| Status | Artinya |
|---|---|
| `antre` | Ide/kerjaan yang belum mulai. Gak dihitung ke batas |
| `jalan` | Lagi dikerjain. **Maks 5 barengan** |
| `nunggu-kamu` | Butuh keputusan owner. "Keputusan kamu" wajib keisi |
| `parkir` | Ditunda. Wajib ada catatan sampai mana & cara lanjutnya |
| `beres` | Selesai & hasilnya udah dicek |

## Aturan
- Tiap selesai kerja: kalau ada yang harus owner jawab → isi "Keputusan kamu" + status `nunggu-kamu`. Kalau gak ada →
  kosongin bagian itu, status `jalan`.
- "Keputusan kamu" ditulis **bernomor + pilihan a/b/c + rekomendasi**. Ini catatan buat detak & dashboard, bukan buat
  diketik owner.
- Pas owner ngobrol (abis `jadi <nama>` atau "apa aja yang nunggu aku?"), manajer nanyain tiap keputusan pakai alat
  pilihan (AskUserQuestion), satu per satu. Jawabannya dicatat di "Udah" (mis. `07/10 owner jawab: fokus promo kopi
  susu`), "Keputusan kamu" dikosongin, status balik `jalan`, terus lanjut.
- Owner juga bisa jawab dari dashboard (ketuk pilihan / "Setuju saran") atau nulis langsung di file task. Dua-duanya
  jadi baris `Jawaban owner: 1a <teks pilihan> (lewat dashboard 07/10 09:12)` di bawah "Keputusan kamu"; jawaban
  bebas tanpa nomor juga boleh (soal tanpa pilihan: `Jawaban owner: 3: <teks>`). Begitu semua soal kejawab, dashboard
  nampilin "Lagi diproses" dan langsung bangunin manajer pemegang task (kalau kerja otomatis nyala). Manajer yang
  nyatet: pindahin ke "Udah", hapus pertanyaan yang udah kejawab beserta baris `Jawaban owner:`-nya, terus lanjut.
- Langkah berikutnya nunggu owner ngasih sesuatu (file, data, akses)? Status **`nunggu-kamu`**, bukan `jalan`, dengan
  pertanyaan mis. "Chat pelanggan udah ditaruh di `masuk/cs/`? a) udah b) nanti". Task `jalan` bikin detak bangun &
  makan jatah; kalau isinya cuma nunggu owner, itu jatah kebuang.
- `update:` diisi tanggal terakhir task diubah. Task `jalan` yang gak diupdate 3 hari = tanda nyangkut.
- Hasil kerja gak ditulis di task, tapi di `hasil/`. Task cuma nyatet sampai mana & di mana hasilnya.

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
Kalau hasilnya udah final dan mau diposting, jangan berhenti di pertanyaan itu. Tulis rencana posting (skill
posting-repliz, isi `"task": "T-07"`) supaya owner liat pratinjau, milih jam, dan setujuin di halaman **Konten**. Pertanyaan
di task jadi "Setujuin \"<judul>\" di halaman Konten?". Setuju, revisi, atau batal dari Konten otomatis masuk ke task ini
sebagai `Jawaban owner:` dan kamu dibangunin.

Kalau owner minta revisi, bikin versi baru di `hasil/…-v2`. Di `## Hasil`, taruh jalur terbaru lebih dulu,
kemudian jalur sebelumnya dengan catatan "versi lama" di baris yang sama atau di bawah judul `### Versi lama`.
File versi lama tetap disimpan, pratinjaunya dilipat. Kirim versi baru ke Drive kalau tersambung, lalu minta persetujuan lagi.
