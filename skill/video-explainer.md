---
name: video-explainer
description: Alur video explainer motion graphic (bawaan 9:16) yang menjelaskan satu topik bersumber dari brief sampai pemeriksaan. Baca saat owner minta video explainer, video edukasi/fakta, atau kalender konten menulis format video penjelasan.
---

# Video explainer: satu dunia, kamera yang jalan

Baca skill ini lewat Read, karena detak tidak punya tool Skill. Ini lanjutan skill/video-remotion.md: dasar Remotion, render,
still, cek-hasil dan aturan aset ada di sana, jangan diulang. Biaya suara mengikuti skill/gambar-video-fal.md.

Video explainer menjelaskan satu hal sampai penonton paham. Bentuknya motion graphic: satu dunia ilustrasi yang dijelajahi
kamera, hampir tanpa cut, angka berjalan menempel ke gerak, garis digambar, kata kunci besar plus subtitle lengkap kecil.
Manajer sosmed memegang task dan keputusan. Penulis menulis naskah, Satpam memeriksa fakta dan bahasa, Sutradara (agen/sutradara.md)
menyusun storyboard dan komposisi, Pemeriksa video (agen/pemeriksa-video.md) menilai sebagai agen terpisah. Jangan menilai
karyamu sendiri. Satu putaran detak cukup satu langkah alur. Tulis hasil tiap langkah di task bagian Udah supaya putaran
berikutnya bisa lanjut.

## Alur
1. **Brief 5 hal** di task: topik dan klaim utama, format, durasi, penonton, nada. Bawaan 9:16 (1080×1920), maksimal 60 detik
   (±130–150 kata). Penjelasan 16:9 yang panjang 80–95 detik (±200–230 kata), cuma kalau owner minta. Baca sumber langsung.
   Sumber yang gagal dibuka tidak boleh jadi fakta.
2. **Tiga konsep.** Baca `video/contoh-explainer/KATALOG.md` (35 contoh dalam 3 seri + 5 gaya tunggal), pilih 2–3 contoh yang
   tekniknya paling dekat, lalu buka JPG frame hero-nya di `video/contoh-explainer/still/` lewat Read. Render still lain cuma
   kalau butuh frame lain. Susun tiga konsep dengan gaya keluarga dan "dunia" yang beda, lalu tanya owner di "Keputusan
   kamu". Owner sudah punya gaya seri → pakai itu, lewati langkah ini.
3. **Naskah per adegan** di `video/naskah-<task>.md`: VO, 1–4 kata layar, visual, gerak, transisi ke adegan berikutnya, dan
   sumber tiap angka. Bahasanya menjelaskan: kalimat lengkap, urut sebab ke akibat, pakai contoh sehari-hari, tiap kalimat
   menambah satu pemahaman, tanpa opini atau reaksi narator. Istilah umum (prompt, noise, token) dijelaskan sekali.
   Kalimat pertama berisi angka mengejutkan atau hal yang kelihatan bertentangan, ditulis sebagai satu kalimat utuh yang
   orang beneran ucapkan, bukan potongan judul. Penutup mengajak simpan/follow atau bertanya, sesuai brief. Sumber tampil
   sekali sebagai plakat singkat (lembaga, tahun), detailnya di caption, bukan teks sumber di tiap adegan. Satpam cek tiap
   klaim ke sumber dan menjalankan cek bahasa sampai nol. Kata atau sudut dari owner dipertahankan selama tidak salah fakta.
   Kalimat owner tetap dicek. Kalau bentrok dengan sumber, usulkan versi yang sesuai sumber dan tanya owner. Setelah Satpam
   memotong klaim, Penulis baca keras lagi supaya kalimatnya tetap utuh. Owner cek naskah (nunggu-kamu). Naskah belum
   disetujui berarti belum ada biaya suara.
4. **Suara narator.** Nadanya profesional: tenang, jelas, artikulasi rapi, sekitar 150 kata per menit. Pakai Gemini TTS.
   Kandidat yang cocok: Sadaltager (pria) dan Laomedeia (wanita). Bikin 2–3 sampel pendek, owner yang memilih. `--gaya` wajib
   berbahasa Indonesia dan tidak memuat contoh kalimat (bisa ikut terbaca), misalnya: "Ucapkan dengan gaya narator dokumenter
   edukasi yang profesional: tenang, jelas, artikulasi rapi, intonasi yakin, tidak berlebihan. Tempo sedang yang mengalir.
   Bahasa Indonesia natural dengan logat Indonesia. Baca persis teksnya saja."
   Teks untuk mesin suara memakai bentuk ucapan (2013 → dua ribu tiga belas, GPU → ji-pi-yu), subtitle tetap ejaan naskah.
   `node alat/suara-olah.mjs konten/fal/…/suara-ID.mp3 --kpm 150` merapatkan jeda, menyamakan tempo dan loudness −14 LUFS.
   Transkrip berkas hasil olah (bukan yang mentah), lalu `node alat/cek-suara.mjs <audio>.kata.json video/naskah-<task>.txt`
   sampai cocok ≥0,95. Kata salah ucap → ulang satu take penuh. Jangan menyambung potongan yang suaranya terdengar beda.
5. **Storyboard dan komposisi** oleh Sutradara. Satu gaya keluarga, palet 3–4 warna, 2 font lokal, satu warna aksen untuk kata
   kunci, satu kanvas besar. Komponen siap pakai ada di `video/src/gerak/` (daftar dan props di README-nya): Dunia, KataMuncul,
   SapuSorot, GarisDigambar, AngkaJalan, Pop, Stempel, Paralaks, ZoomTembus, Grain, Idle, Squash, Subtitle, Kursor, BalikKartu.
   Pinjam teknik dari contoh katalog, tapi bangun dunia baru. Mengganti teks contoh lalu menyebutnya karya baru = gagal. Waktu
   animasi diikat ke waktu kata di `.kata.json`. Tulis peta kamera dan tiga frame hero di komentar komposisi. Kalau
   `brand/logo.png` ada, pasang di pojok kanan atas sepanjang video.
6. **Render dan cek** mengikuti video-remotion.md bagian 3–4, lalu `node video/cek-hasil.mjs hasil/video-<task>.mp4 --beku 1 --lembar`.
   Buka lembar kontak dan versi 360 px-nya lewat Read. Render strip frame di sekitar tiap transisi untuk menilai gerak.
   **Waktu render**: di VPS 2 inti kira-kira 25 menit per 60 detik video di 720×1280 (bawaan VPS kecil) dan kira-kira 50 menit
   di 1080×1920. VPS kecil: sarankan owner video ≤30 detik. Explainer lebih dari ±20 detik wajib dirender di latar:
   `npm run render -- <Komposisi> ../hasil/video-<task>.mp4 --latar`. Putaran itu cukup memulai render dan menulis "render jalan"
   di task. Putaran berikutnya cek `npm run status-latar`. Kalau selesai, lanjut ke cek hasil, kalau gagal, tulis alasannya dan tanya owner.
7. **Pemeriksa video** terpisah, maksimal tiga putaran. Lolos → owner.

## Gaya keluarga (pilih satu, konsisten dari awal sampai akhir)
| Keluarga | Ciri | Cocok buat |
|---|---|---|
| Kartun flat + grain | flat tanpa outline, tekstur kertas, karakter berwajah | sains santai |
| Infografis kertas | label putih, garis aksen, selotip, slab serif, anotasi tangan | geografi, perbandingan |
| Stiker outline tebal | outline gelap, pinggiran putih die-cut, bayangan | konten HP, kontras tinggi |
| Flat sinematik | vignette, kedalaman, siluet depan, warna punya makna | berita, cerita |
| Kinetic data gelap | latar gelap, dua warna makna, condensed + mono, foto/peta asli | data, isu |
| Editorial premium | cutout produk di latar terang + grid, gerak halus tanpa pantulan | produk |
| Kosmos mewah | hitam–emas, serif klasik, huruf kapital berjarak, kalem | fakta besar |

## Prinsip gerak (wajib)
1. Satu dunia, kamera yang jalan. Pindah info = pan, zoom, atau mengikuti objek pemandu. Cut keras maksimal 1–2 per video.
2. Transisi 0,3–0,6 detik yang bermakna: objek sama berubah peran, zoom menembus, objek lewat di depan kamera. Crossfade polos dilarang.
3. Ada hal baru tiap 1–2,5 detik. Label lama keluar dulu (±0,2 detik) sebelum label baru masuk. Daftar diam >3 detik = pecah.
4. Tidak ada frame beku >1 detik: zoom pelan 2–5%, napas, kedip, partikel, paralaks 3–6 lapis.
5. Teks: kata kunci besar 1–5 kata plus subtitle lengkap kecil yang mengikuti VO (±40–46 px di 1080p, tebal, garis tepi gelap,
   kata aktif disorot, maksimal 2 baris). Label minimal ±50 px. Hierarki: label kecil → kata/angka besar → keterangan.
6. Angka adalah kejadian: counter 1–2,7 detik, format id-ID, terikat ke gerak objek yang sama, selalu dibandingkan.
7. Skala ke benda sehari-hari (bola, gedung, orang). Waktu yang dipercepat ditulis jujur di layar.
8. Semua garis digambar (stroke 6–12 frame), bukan fade. Yang salah dicoret, jawaban dikotak.
9. Easing sesuai peran. Kamera ease-in-out 0,5–1,5 detik, elemen masuk spring tanpa pantulan, momen penting overshoot 8–25%.
10. Tekstur dan kedalaman: grain, vignette, siluet depan, bayangan lembut. Warna diinterpolasi tanpa lewat abu kusam.
11. Hook ≤1 detik tanpa intro/logo. Visual pembuka muncul lagi di akhir dengan arti baru. Shorts ditutup ke latar awal biar loop.

Zona 9:16: teks dan angka di 10–30% tinggi, subjek 35–80%, 20% bawah dan kolom kanan bawah cuma latar. Cover dibuat terpisah.

## Cek sebelum ke owner
- Hook ≤1 detik, beku ≤1 detik, cut keras ≤2 kecuali disengaja, durasi sesuai brief, satu gaya keluarga sampai akhir.
- Teks masih terbaca di lembar kontak 360 px dan zona aman bersih.
- Tiap angka berjalan dan terikat gerak, tiap garis digambar, tidak ada crossfade polos.
- Fakta cocok dengan sumber, cek suara ≥0,95, loudness −14 LUFS (peak ≤ −1,5 dBTP), musik/SFX berlisensi. Catatan karya
  `hasil/video-<task>-catatan.md`: konsep, sumber, suara + gaya, hasil cek, batasan yang belum diuji.

## Jika nyangkut
- Alat/komponen belum ada: minta Builder menjalankan `node ~/kit-kantor-ai/installer/video.mjs`, lalu `bash ~/kit-kantor-ai/cek/cek-video.sh`.
- Sumber kurang atau angka tidak bisa dicek: berhenti dan tanya owner. Render kehabisan RAM: kurangi blur dan paralaks.

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
