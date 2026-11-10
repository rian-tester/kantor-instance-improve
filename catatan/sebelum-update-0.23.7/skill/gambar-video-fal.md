---
name: gambar-video-fal
description: Bikin gambar, edit foto produk, suara, transkrip, atau nyiapin permintaan video lewat fal dengan batas belanja owner dan persetujuan dashboard.
---

# Gambar & video lewat fal

Pakai saat materi konten butuh gambar baru, edit foto, atau video AI. Baca **skill/anti-slop-indo.md** dulu.
Satu materi membawa satu pesan. Hindari foto stok mewah generik dan teks di dalam gambar. Kalau ada foto asli
owner atau produk, pakai itu sebagai bahan edit. Jangan bikin klaim produk dari imajinasi.

1. Jalankan `node alat/fal.mjs model` untuk cek status aktif dan harga langsung, lalu pilih endpoint sesuai kebutuhan
   dari `alat/fal-model.json`. Kalau model udah pensiun, pilih model lain atau update kit. Jangan pakai Sora 2. Suara bawaan Kling cuma
   Mandarin/Inggris, jangan janjiin suara Indonesia.
2. Jalankan `node alat/fal.mjs status`, lalu **selalu cek harga dulu**:
   `node alat/fal.mjs harga fal-ai/flux/schnell`. Harga diambil langsung tanpa generate. Satuan gak jelas berarti
   berhenti, minta owner cek halaman model. Batas bawaan US$2 per hari WIB, cuma owner bisa ubah di dashboard.
3. Gambar: `node alat/fal.mjs gambar --model fal-ai/flux/schnell --prompt "Foto produk kopi di meja dapur" --rasio 4:5 --jumlah 1 --keluar kopi`.
   Edit: `node alat/fal.mjs edit --model fal-ai/nano-banana/edit --gambar konten/produk.jpg --prompt "Ganti latar ke meja dapur, pertahankan kemasan"`.
   Gambar/edit langsung berbayar, jadi cek biaya dan kebutuhan materi dulu.
4. Video: `node alat/fal.mjs video --model minimax/h3-max/image-to-video --gambar konten/produk.jpg --prompt "Kamera mendekat ke kemasan" --durasi 5`.
   Ini **cuma bikin permintaan**. Owner baca prompt, model, durasi, estimasi lalu setujuin di dashboard → Lainnya →
   Gambar & video AI (fal). Jangan jalankan `jalan` sendiri. Isi atau gambar yang berubah wajib disetujui ulang.
5. Hasil tersimpan di `konten/fal/YYYY-MM-DD/`. **CEK HASIL SENDIRI: buka gambarnya sebelum dikasih ke owner**.
   Untuk video, tonton hasilnya dan cek gerakan, produk, dan detail wajah. Gagal atau belum selesai bukan alasan
   buat mencoba lagi otomatis, karena biaya bisa sudah terpakai.
6. Catat estimasi biaya dan file hasil di laporan. `node alat/fal.mjs riwayat` membaca catatan biaya.
   Nilainya estimasi konservatif, bukan tagihan aktual fal. Kunci cuma diisi di dashboard, jangan minta di chat.


## Pilihan video (kurasi aktif menurut API 10 Oktober 2026)

Harga di tabel cuma acuan dari pemeriksaan Ezzar. Tetap cek `model` dan `harga` langsung sebelum bikin materi.

| Kebutuhan | Tingkat | Endpoint | Acuan US$/detik | Durasi |
|---|---|---|---|---|
| Gambar jadi video | Hemat | `minimax/h3-max/image-to-video` | 0.03 | 0.92 sampai 15 detik, bawaan 5 |
| Gambar jadi video | Bagus | `fal-ai/kling-video/v2.6/pro/image-to-video` | 0.07 | 5 atau 10 detik |
| Gambar jadi video | Premium | `fal-ai/veo3.1/fast/image-to-video` | 0.15 | 4, 6, atau 8 detik, bawaan 8 |
| Teks jadi video | Hemat | `minimax/h3-max/text-to-video` | 0.03 | 0.92 sampai 15 detik, bawaan 5 |
| Teks jadi video | Bagus | `fal-ai/kling-video/v2.6/pro/text-to-video` | 0.07 | 5 atau 10 detik |

- H3 bisa menghasilkan durasi sekitar 0,7 detik lebih panjang. Estimasi biaya memakai durasi permintaan +1 detik.
  Alat mengisi `prompt_expansion_mode: balanced` dan resolusi `768P`.
- Kling menerima prompt maksimal 2.500 karakter. Suara bawaan Kling cuma Mandarin/Inggris. Alat mengisi
  `generate_audio: false` untuk Kling dan Veo, jangan menjanjikan suara Indonesia dari Kling.
- Model teks dan Veo memakai rasio bawaan `9:16` buat reels, bisa diubah lewat `--rasio` sesuai daftar model.
  H3/Kling dari gambar mengikuti rasio foto asli, jadi ubah rasio fotonya sebelum bikin permintaan.
- Alat mengubah format durasi dan field gambar sesuai model. Jangan menambah field JSON sendiri, terutama audio,
  resolusi, atau jumlah video. Perubahan seluruh input tetap terikat persetujuan SHA.
- Model lama yang dihapus dari kurasi perlu permintaan baru, lalu persetujuan baru. Alat selalu cek status langsung
  sebelum submit, walaupun dashboard masih menampilkan cache harian yang lama.
- Jangan pakai Veo fast dari teks yang skemanya belum tersedia atau Seedance dengan harga per token.


## Musik (lagu dari lirik)

Pakai kalau owner minta lagu (mis. jingle atau lagu buat video). Lirik ditulis di berkas TXT/MD di kantor, gaya ditulis singkat.
Lirik & gaya bikinan sendiri atau dari owner. Jangan niru lirik, melodi, atau nama penyanyi lagu orang lain.

```bash
node alat/fal.mjs harga fal-ai/minimax-music/v2
node alat/fal.mjs musik --lirik konten/lagu/lirik-T-05.txt --gaya "J-pop anime, energik, vokal perempuan, gitar listrik, 140 bpm" --keluar lagu-T-05
node alat/fal.mjs musik --model fal-ai/elevenlabs/music --lirik konten/lagu/lirik-T-05.txt --gaya "J-pop anime, energik, vokal perempuan" --durasi 90 --keluar lagu-T-05
```

| Kebutuhan | Endpoint | Acuan harga (API fal 06/11/2026) | Catatan |
|---|---|---|---|
| Lagu hemat (bawaan) | `fal-ai/minimax-music/v2` | US$0,03 per lagu | gaya 10–300 karakter, lirik 10–3.000; durasi ditentuin model |
| Lagu lebih rapi | `fal-ai/minimax-music/v2.6` | US$0,15 per lagu | gaya 10–2.000, lirik 10–3.500; durasi ditentuin model |
| Durasi pasti, vokal banyak bahasa | `fal-ai/elevenlabs/music` | US$0,60 per menit, dibulatkan ke atas | `--durasi` 10–300 detik (bawaan 60); 30 detik tetap dihitung 1 menit |

- Tag bagian seperti `[Intro]`, `[Verse]`, `[Chorus]` boleh dipakai di lirik. Buat ElevenLabs, pisahkan tiap bait dengan baris
  kosong. Tag di baris pertama bait jadi nama bagian, satu baris lirik maksimal 200 karakter.
- Musik langsung jalan (gak lewat persetujuan dashboard), jadi cek harga dan batas harian dulu, terus bilang perkiraan biayanya ke owner.
- Hasil MP3 tersimpan di `konten/fal/YYYY-MM-DD/<keluar>-<id>-1.mp3` dan tercatat di `node alat/fal.mjs riwayat`.
- Kamu gak bisa dengerin lagunya. Buat ngecek liriknya kebaca, jalankan `node alat/fal.mjs transkrip --audio <mp3>` terus
  bandingin sama lirik. Minta owner dengerin sebelum dipakai.

## Suara (voiceover)

Voiceover adalah suara yang membacakan naskah video. Baca `brand/brief.md` untuk memilih nada, tempo dan suara yang cocok.
Kit tidak membawa persona Aldy. Kamu bisa memilih gaya sesuai brand atau brief karya.

- Gemini 3.1 Flash TTS (`fal-ai/gemini-3.1-flash-tts`) adalah pilihan hemat dan bawaan. Acuan harganya US$0.05 per
  1.000 karakter. Suara bawaan Kore, pilihan lain bisa dilihat di `alat/fal-model.json`.
- ElevenLabs v3 (`fal-ai/elevenlabs/tts/eleven-v3`) dan MiniMax (`fal-ai/minimax/speech-2.8-hd`) untuk ucapan lebih
  ekspresif. Acuan keduanya US$0.10 per 1.000 karakter. Suara bawaannya Rachel dan Wise_Woman.
- Cek `model`, `harga` dan `status` dulu. Harga di atas cuma acuan pemeriksaan 10 Oktober 2026. Alat mengambil harga
  langsung sebelum mengirim. Teks dihitung per karakter Unicode, dibulatkan ke atas per 100 karakter.

```bash
node alat/fal.mjs harga fal-ai/gemini-3.1-flash-tts
node alat/fal.mjs suara --berkas video/naskah-T-03.txt --suara Kore --gaya "Ucapkan dengan gaya ramah, dengan tempo tenang sesuai brief."
node alat/fal.mjs suara --model fal-ai/elevenlabs/tts/eleven-v3 --teks "Ini contoh suara untuk kantor kamu." --suara Rachel
node alat/fal.mjs transkrip --audio konten/fal/YYYY-MM-DD/suara-ID.mp3
```

Gemini wajib diberi `--gaya` yang dimulai dengan "Ucapkan dengan gaya …". Opsi ini cuma untuk Gemini. Teks Gemini
maksimal 50.000 karakter, ElevenLabs 5.000, MiniMax 10.000. Pilih salah satu `--teks` atau `--berkas` (TXT/MD di kantor).
Suara dan transkrip langsung jalan dalam batas harian tanpa persetujuan video. Jangan mengulang otomatis jika gagal.

Dengarkan MP3 dan cek durasi sebelum dipakai. Dashboard menyediakan pemutar dan unduhan audio. `riwayat` menyebut sumber
durasi: `duration_ms` dari fal, `ffprobe` dari Remotion, atau `estimasi-8kbps` untuk perkiraan biaya konservatif.
Perkiraan biaya tidak membuktikan durasi audio. Kalau belum terukur, pakai ffprobe bawaan Remotion sebelum render.

Scribe v2 memakai bahasa `ind`, acuan US$0.008 per menit. Audio lokal maksimal 100 MB di kantor, di luar folder tersembunyi,
diunggah ke penyimpanan fal. URL HTTPS juga bisa dipakai dan diunduh dulu untuk memperkirakan biaya. Hasil lokal menjadi
`<audio>.kata.json`, berisi kata terucap dan waktu dalam detik. Spasi dan kejadian audio tidak dijadikan kata caption.
Alat tidak menimpa transkrip yang sudah ada. Catat biaya, dengarkan hasil, lalu lanjutkan lewat `skill/video-remotion.md`.

Untuk kirim hasil lokal, gambar, atau video ke Drive, pakai `node alat/drive.mjs kirim <berkas>` lalu kasih linknya
ke owner. Ikuti bagian "Kirim file ke Drive" di skill google-drive. Kalau belum tersambung, minta owner buka
dashboard → Google Drive → Sambungkan Google Drive. Jangan pakai `create_file` untuk biner atau >100 KB.

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
