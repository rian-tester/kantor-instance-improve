---
name: posting-repliz
description: Cara nyiapin postingan sosmed buat dijadwal lewat Repliz (owner nyetujuin di dashboard) dan baca angka performa asli. Pakai tiap konten udah jadi dan mau diposting, atau pas bikin ide/laporan yang butuh angka.
---

# Posting lewat Repliz

Kamu **gak pernah posting sendiri**. Kamu nulis *rencana posting*, owner nyetujuin di dashboard halaman **Konten**
(menu utama): liat pratinjau, pilih jam, setujuin atau minta revisi. Baru tombol itu yang ngejadwalin ke Repliz. Isi
rencana yang diubah abis disetujuin = harus disetujuin ulang.

## 1. Cek akun yang nyambung
`node alat/repliz.mjs status` → daftar akun (Instagram @…, TikTok @…). Belum nyambung? Tetap tulis rencananya: owner
bisa nyetujuin di Konten, jadwalnya masuk Repliz sendiri begitu Repliz disambungin (status "Disetujui, nunggu Repliz",
itu bukan gagal). Ingetin owner: "Sambungin Repliz di dashboard → Konten → Sambungin Repliz". Jangan minta kuncinya
ditempel di chat.

## 2. Tulis rencana
Satu file per postingan: `sosmed/terbit/<id>.json`, id = huruf kecil/angka/strip, mis. `20261007-kopi-hujan`.
```json
{
  "judul": "Kopi susu gula aren, versi musim hujan",
  "caption": "Hujan jam 4 sore, kerjaan belum kelar...\n\n#kopisenja",
  "media": ["hasil/carousel-kopi-hujan/slide-01.png", "hasil/carousel-kopi-hujan/slide-02.png"],
  "akun": ["instagram", "tiktok"],
  "waktu": "2026-10-07 19:00",
  "task": "T-07",
  "labelAI": false,
  "catatan": "Jam 7 malem: postingan jam segini minggu lalu paling banyak ditonton."
}
```
- `caption`: versi final (udah lolos **anti-slop-indo** & pemeriksa). Harga/promo cuma dari `brand/fakta.md`.
- `media`: file di folder kantor, `.png`/`.jpg` (1–10 gambar, carousel) atau **satu** `.mp4`/`.mov`. Threads, X, &
  LinkedIn cuma dapet teks (gambarnya gak ikut). YouTube cuma video.
- `akun`: `"instagram"` kalau cuma ada satu akun Instagram; kalau lebih, tulis lengkap `"instagram:@kopisenja"`.
- `waktu`: jam WIB, format `YYYY-MM-DD HH:MM`, minimal 1 jam dari sekarang (owner butuh waktu nyetujuin). Ini *usulan*:
  owner boleh milih jam lain di Konten, dan dashboard yang nulis jam pilihannya ke file ini. Jangan dibalikin ke jam
  usulanmu. Jamnya udah lewat pas disetujuin = tayang ±5 menit kemudian.
- `task`: kode task asal konten ini (mis. `T-07`). Wajib kalau ada task-nya. Keputusan owner di Konten (setuju, revisi,
  batal) ditulis dashboard ke task itu sebagai `Jawaban owner:` dan kamu langsung dibangunin buat nyatet.
- `labelAI`: `true` kalau ada orang, suara, atau kejadian buatan AI yang keliatan asli (avatar, suara AI, video
  generate). Carousel teks dari template = `false`.
- `catatan`: alasan jam/akun singkat, buat owner.

## 3. Cek, terus minta owner nyetujuin
1. `node alat/repliz.mjs rencana`: rencana kamu harus "Nunggu kamu setujuin" tanpa baris ✗. Ada ✗ = benerin filenya.
2. Task kamu jadi `nunggu-kamu`, "Keputusan kamu" (satu pertanyaan per rencana, bernomor + a/b + rekomendasi):
   ```text
   1. Setujuin "<judul>" di halaman Konten?
      Kenapa: pratinjau, caption, dan pilihan jam ada di sana.
      a) Udah, aku setujuin di Konten (rekomendasi: jam usulan aku udah dicek sama data performa)
      b) Mau diubah dulu: tulis catatannya lewat tombol Minta revisi di Konten
   ```
   Jangan nanya isi caption atau jam lagi di chat, owner liat semuanya di Konten. Konten yang masih berupa pilihan
   konsep atau belum final: tanyanya di task seperti biasa, tulis rencananya setelah owner milih.

## 4. Abis itu
Owner nyetujuin dari halaman Konten, dan kamu dibangunin. Di task kamu bakal nemu baris `Jawaban owner:` (atau titipan
`kotak-masuk/sosmed/<tanggal>-dari-owner-konten-<id>.md` kalau rencananya gak punya `task`). Catat di "Udah", hapus
pertanyaan & baris jawabannya, terus:
- **"disetujui, tayang … WIB"** / **"disetujui & terjadwal"**: beres, jangan diubah lagi. Catat jam tayangnya di "Udah".
- **"disetujui tapi gagal dijadwalin"**: lapor owner apa alasannya, jangan bikin ulang sendiri (lihat "Gagal tayang").
- **"minta revisi: <catatan>"**: kerjain persis catatannya. Revisi file rencana yang SAMA (statusnya balik ke "Nunggu
  kamu setujuin" sendiri) dan simpen hasil baru di `hasil/…-v2`. Tulis lagi pertanyaan "Setujuin … di halaman Konten?".
- **"jadwalnya dibatalin owner"**: jangan bikin ulang. Tanya dulu mau diganti apa.
- **Ditolak tanpa catatan**: `node alat/repliz.mjs rencana` nampilin alasan owner (kalau ada). Revisi file yang SAMA.
- **Terjadwal/tayang**: jangan diubah. Mau ganti? Bikin rencana baru, minta owner batalin yang lama di Konten.
- **Gagal tayang**: JANGAN bikin ulang sendiri. Kadang error tapi tetap tayang (bisa dobel). Lapor owner: "cek app
  Repliz dulu, kalau beneran belum tayang, coba lagi dari app Repliz".

## 5. Angka performa
`sosmed/performa/terbaru.md` diperbarui otomatis tiap pagi (tanpa AI). Isinya angka ASLI dari Repliz: statistik tiap
akun + postingan terbaru urut views, ditandain mana yang dari tim ("dari kantor").
- Baca sebelum bikin ide konten: topik/format/jam yang menang diulang, yang jeblok jangan.
- Laporan mingguan: kutip angkanya apa adanya. Kosong/belum ada = bilang kosong, JANGAN ngarang.
- Angka per postingan butuh paket Repliz **Gold**. Kalau catatannya bilang begitu, laporan cuma pakai statistik akun.
