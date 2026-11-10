---
name: video-remotion
description: Bikin video pendek 9:16 pakai Remotion lokal, dari brief sampai render dan pemeriksaan gambar, gerak, serta suara. Baca saat owner minta video atau tim konten mengerjakan video.
---

# Video Remotion

Aku bikin video sebagai satu karya: pesan jelas, gerak ada tujuannya, tetap kepahaman tanpa suara. Template `video/` cuma bahan awal. Baca panduan ini lewat Read. Detak tidak punya tool Skill. Semua langkah di bawah bisa jalan lewat Bash/Read/Write/Edit.

## 1. Brief dan naskah

Baca task, `brand/brief.md`, `brand/fakta.md`, SOP sosmed, serta referensi owner yang tersedia. Tentukan pesan utama, penonton, durasi, hasil akhir, satu metafora visual dan fakta bersumber. Kalau pesan/fakta belum jelas, tanyakan itu. Keputusan scene, layout, warna, huruf, transisi dan pacing aku tentukan sendiri.

Tulis `video/naskah-<task>.md`: tiap adegan berisi waktu mulai/selesai, cerita, teks utama, aset, gerak, audio dan transisinya. Hook 0–2 detik sudah punya teks terbaca dan perubahan visual. Teks besar menyampaikan cerita, bukan subtitle karaoke. Kalau ada VO, tampilkan juga semua kata VO dalam teks kecil yang terbaca. Jangan jadikan itu satu-satunya cerita visual. Ending wajib payoff yang menjawab hook. Endingnya harus menutup cerita dengan jelas.

Visual menunjukkan subjeknya: produk memakai tampilan produk, tokoh memakai foto asli dengan izin/atribusi, topik lain boleh metafora relevan. Kasih label yang jelas pada ilustrasi AI. Jangan buat gambar AI seolah foto dokumenter. Pakai aset yang sudah ada dulu. Musik/SFX harus punya lisensi jelas di `video/public/audio/LISENSI.md`, VO tetap dominan.

## Voiceover dan transkrip

Ikuti alur Ale: naskah final → suara → transkrip → waktu kalimat → adegan → caption → render → pemeriksaan suara → owner. Baca `skill/gambar-video-fal.md`, cek harga dan batas harian. Simpan teks ucapan saja di `video/naskah-T-03.txt`, tanpa catatan kamera. Gaya suara mengikuti `brand/brief.md`, bukan persona bawaan.

```bash
node alat/fal.mjs suara --berkas video/naskah-T-03.txt --gaya "Ucapkan dengan gaya ramah dan tenang sesuai brief."
node alat/fal.mjs transkrip --audio konten/fal/YYYY-MM-DD/suara-ID.mp3
```

Dengarkan MP3 dulu untuk memeriksa pelafalan, nada dan durasi. Hasil transkrip ada di `<audio>.kata.json`. Scribe memberi waktu kata dalam detik. Template bisa menjajarkan `naskah` dengan kata terucap lalu membentuk kalimat berwaktu, seperti `jajarin` dan `kalimat_berwaktu` Ale. Angka yang dibacakan berbeda bisa mendapat perkiraan waktu dari kata di sekitarnya. Periksa hasilnya, terutama nama, angka dan singkatan. Naskah yang kurang cocok akan ditolak. Bagi naskah panjang per bagian.

Isi props `vo` dengan `konten/fal/…/suara-ID.mp3` (jalur dari kantor) atau `public/audio/vo.mp3`. Wrapper render menyalin hasil fal ke `video/public/fal/` dengan nama berdasarkan isi berkas. Salinan ini tidak mengubah audio sumber di folder konten. Isi `caption` dengan jalur `konten/fal/…/suara-ID.mp3.kata.json`. Tambahkan `naskah` berisi teks ucapan final untuk menjajarkan ejaan naskah.

Kalau `ikutiKalimat: true`, jumlah `adegan` harus sama dengan jumlah kalimat caption. Wrapper mengatur awal dan frame adegan menurut waktu kalimat, dengan adegan pertama dari frame 0 dan adegan terakhir sampai VO selesai. Kamu tetap menentukan cerita visual tiap adegan. Tanpa opsi itu, frame adegan mengikuti props biasa.

Durasi komposisi mengikuti VO yang terukur lewat catatan fal atau ffprobe bawaan Remotion. `voDurasi` boleh diisi dalam detik setelah kamu mengukur sendiri. Perkiraan biaya tidak dipakai sebagai durasi render. Caption opsional tampil di atas visual dan musik dibuat lebih pelan saat ada VO (bawaan 0.08, paling tinggi 0.12). `voVolume` bawaan 1. Jangan menggeser seluruh isi video untuk menyediakan pita subtitle. Contoh offline tetap bisa dirender tanpa VO.



## 2. Susun komposisi

Baca `video/README.md`, `src/index.tsx` dan contoh JSON. Tulis konsep, alasan warna/huruf, peta kamera/transisi, hook, payoff dan tiga waktu frame hero di komentar karya. Beda babak boleh beda komposisi tetapi geraknya menyambung. Jangan semua tengah, semua fade, kartu berulang, atau dekorasi acak. Gerak mengarahkan perhatian/menyambungkan ide. Periksa jika layar tidak berubah lebih dari 2 detik.

Pakai `useCurrentFrame`, `interpolate`, `spring` dan Sequence dari Remotion. Jangan CSS animation/transition atau waktu nyata. Semua aset di `public/` lewat `staticFile`. Font Jakarta lokal berlisensi OFL sudah tersedia. Jangan unduh font saat render. Teks penting jauh dari 200 px bawah dan 140 px kanan. Hindari blur layar besar sepanjang video dan WebGL berat di VPS kecil.

Salin aset hasil `konten/fal/…` ke `video/public/konten/fal/…` lewat Bash, tanpa mengubah sumbernya. Catat sumber aset dan izin pemakaiannya. Daftarkan komposisi karya di Root. Sesuaikan durasi komposisi dengan jumlah frame adegan/VO. Untuk data sederhana bisa buat `video/naskah-<task>.json` dan pakai `--props=naskah-<task>.json`.

### Baca best practice plugin langsung (tanpa tool Skill)

Plugin dipasang untuk user lewat marketplace `remotion-dev/claude-code-plugin`, plugin `remotion@remotion`. Root cache Claude biasanya `~/.claude/plugins/cache/remotion/remotion/<versi>/`. Nomor versi tidak tetap. Cari file yang benar, jangan menganggap satu versi pasti ada:

```bash
find ~/.claude/plugins/cache/remotion -type f \( -name SKILL.md -o -name REFERENCE.md \) 2>/dev/null
```

Buka hasil lewat Read: `skills/remotion-best-practices/SKILL.md`, lalu referensi markup, timing, local-fonts dan render yang dirujuk file itu. Beberapa paket menyimpan referensi sebagai subfolder `remotion-markup/REFERENCE.md` di dalam skill router. Ikuti path relatif dari file terpasang, jangan menebak path. Kalau cache tersebut tidak ada, cari `find ~/.claude/plugins -type f -path '*remotion*' -name SKILL.md` dan laporkan path aktual di catatan karya. Jangan membaca credentials atau file login. Plugin belum siap? Setelah owner login: `bash ~/kit-kantor-ai/cek/cek-video.sh --plugin`. Skill kit ini tetap bisa dipakai walau plugin gagal.

## 3. Render

```bash
cd video
npm run render -- ContohKantor ../hasil/video-T-03.mp4 --props=naskah-T-03.json
npm run still -- ContohKantor 15 ../hasil/video-T-03-15.png --props=naskah-T-03.json
npm run still -- ContohKantor 105 ../hasil/video-T-03-105.png --props=naskah-T-03.json
npm run still -- ContohKantor 255 ../hasil/video-T-03-255.png --props=naskah-T-03.json
```

Ganti ID/frame sesuai karya. `npm run render -- <komposisi> <keluaran.mp4>` dan `npm run still -- <komposisi> <frame> <png>` memakai CLI lokal, tidak mengunduh paket. VPS kecil (2 inti atau kurang, atau RAM <4 GB): bawaan concurrency 1, 720×1280 (installer memilihnya di `video/render-default.json`). Tulis itu di laporan. Render yang bakal lama (video >±20 detik): tambah `--latar` (`npm run render -- <komposisi> <keluaran.mp4> --latar`), proses jalan sendiri di latar dan status-nya dicek lewat `npm run status-latar` (mulai, persen, selesai, atau gagal). Jangan menunggu render panjang di dalam satu putaran detak. Profil normal 1080×1920, 30 fps. Video belum siap? Minta Builder menjalankan `node ~/kit-kantor-ai/installer/video.mjs`, lalu cek video. Jangan jalankan npm install/apt diam-diam lewat detak.

## 4. CEK SENDIRI sebelum kasih ke owner

Buka PNG hasil still dengan Read. Cek hook, tiap pergantian (sebelum/sesudah), tiga frame hero dan ending. Periksa teks terpotong, tumpuk, kontras, bingkai kosong, relevansi aset dan atribusi. Render juga rangkaian frame sekitar transisi (tiap 3 frame/10 fps) dan buka gambarnya supaya gerak dinilai, bukan cuma still. Revisi sampai tidak ada masalah yang diketahui, maksimal 5 putaran. Kalau masih gagal, catat dan jangan sebut siap tayang.

Jalankan pemeriksaan ini dari folder kantor:

```bash
node video/cek-hasil.mjs hasil/video-T-03.mp4
```

Skrip memakai ffprobe/ffmpeg bawaan Remotion, tidak membutuhkan ffmpeg sistem. Skrip menampilkan durasi, resolusi, fps, keberadaan audio dan input_i/input_tp, lalu gagal jika audio hilang atau loudness tidak wajar. Pastikan durasi sesuai naskah, resolusi sesuai profil dan fps 30. Kalau musik/VO direncanakan, stream audio wajib ada. Periksa `input_i` dan `input_tp`: sasaran sekitar -16 LUFS, peak paling tinggi -1,5 dBTP. Jangan klaim lolos kalau tidak diukur. Sesuaikan gain audio di komposisi lalu render dan ukur ulang. Dengarkan MP4 bila alat pemutaran tersedia. Kalau tidak, tulis batasan pemeriksaan audio dan minta owner dengarkan sebelum tayang. Tes mute: teks/visual tetap menjelaskan topiknya.

Tulis `hasil/video-<task>-catatan.md`: konsep, aset+lisensi, frame yang dibuka, hasil ffprobe/loudness, revisi dan batasan yang belum diuji. Kasih MP4 + catatan ke owner. Jangan posting hasil video tanpa persetujuan owner. Usulan posting masuk alur persetujuan owner/antrean Repliz yang sudah ada.

Remotion gratis buat perorangan dan perusahaan sampai 3 orang. Perusahaan lebih besar wajib membeli lisensi: https://remotion.dev/license. Lisensi Remotion tidak otomatis memberi izin musik, foto atau plugin pihak lain.

Jangan jalankan `node alat/drive.mjs kirim` atau `--folder`: alat itu bikin folder di luar folder Drive kantor (aturan owner
08/11). Hasil cukup di `hasil/` lokal; mau ke Drive, tanya owner. Jangan pakai `create_file` untuk biner atau >100 KB.

## Hasil produksi dan persetujuan
Abis produksi, simpan salinan hasil di `hasil/…`, lalu tulis jalurnya di task bagian `## Hasil`, satu jalur per baris.
Boleh tulis folder carousel. Hasil fal atau Remotion yang masih di folder produksinya juga bisa dipratinjau lewat
jalur lokal di task. Tetap catat kerjaan dan lokasi hasil di "Udah". Dashboard menampilkan hasil tepat di atas
"Keputusan kamu", jadi owner bisa melihat hasil dan langsung menjawab.

Jangan kirim ke Drive pakai `drive.mjs kirim` (lihat di atas). Tulis jalur lokal di task. Jangan menganggap sambungan
konektor baca sudah bisa mengirim gambar atau video.

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
