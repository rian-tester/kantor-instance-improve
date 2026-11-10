# Video kantor

Dari folder kantor:

```bash
cd video
npm run render -- ContohKantor ../hasil/contoh.mp4
npm run still -- ContohKantor 15 ../hasil/contoh-15.png
npm run still -- ContohKantor 105 ../hasil/contoh-105.png
npm run still -- ContohKantor 255 ../hasil/contoh-255.png
cd ..
node video/cek-hasil.mjs hasil/contoh.mp4
```

Contoh berdurasi 10 detik, 1080×1920, 30 fps. Font Jakarta OFL dan audio CC0 sudah lokal. Tidak perlu internet saat render setelah installer menyiapkan npm dan browser. VPS kecil (2 inti atau kurang, atau RAM di bawah 4 GB): `render-default.json` memakai skala 2/3 (720×1280) dan concurrency 1. Kamu bisa mengubah profil ini sesuai kemampuan VPS. Render panjang bisa jalan di latar: tambah `--latar` di perintah render, lalu cek `npm run status-latar`.

Ubah slot `adegan` di `contoh.json`, atau buat komposisi khusus di `src/` dan daftarkan ID-nya. `frame` = durasi adegan (30 frame per detik). `latar` = path relatif di `public/`. `jenis` = `gambar` atau `video`. Salin hasil `konten/fal/…` yang mau dipakai ke `video/public/konten/fal/…`, lalu isi `latar` dengan `konten/fal/<file>`. Video latar selalu mute supaya musik/VO tidak tumpuk. `musik` dan `sfx: [{file, frame}]` menunjuk aset di `public/audio/` dengan lisensi yang dicatat.

Bisa pakai data lain: tambahkan `--props=naskah-T-03.json` di akhir perintah render/still. Teks pendek lebih enak dibaca. Cek panjangnya di still sebelum dikasih ke owner. Contoh ini bahan awal, bukan bentuk wajib setiap karya.

Arah contoh: hijau gelap untuk proses, aksen limau menjadi layar penuh saat hasilnya muncul. Garis yang memanjang menghubungkan proses ke hasil. Gerak masuk menekankan teks. Jakarta dipakai karena sudah lokal dan jelas dibaca. Posisi berubah per babak, dengan ruang aman 200 px bawah dan 140 px kanan. ENERGY 2 / RHYTHM 2 / MOTION 2. Frame hero: 15, 105, 255. Teks keluar dan masuk ke arah atas saat pergantian. Garis payoff terbuka selama 1,2 detik sebelum ditahan. Kode gerak belum membuktikan kualitas render. Cek lewat preview/render nyata.

Remotion gratis untuk perorangan dan perusahaan sampai 3 orang. Perusahaan lebih besar wajib beli lisensi: https://remotion.dev/license. Lisensi font dan audio terpisah dari lisensi Remotion.

Keluaran render/still hanya boleh di `hasil/` atau `video/out/`, tanpa symlink ke folder lain. Wrapper menerima opsi `--props=`, `--scale=` dan `--concurrency=`. Pemeriksaan hasil memakai ffprobe/ffmpeg bawaan Remotion, jadi tidak perlu memasang ffmpeg sistem.


## VO dan caption lewat props

`vo` menerima audio di `public/` atau `konten/fal/` dari folder kantor. Wrapper menyalin hasil fal ke public dengan nama
berdasarkan isi audio. `caption` menerima `.kata.json` hasil `node alat/fal.mjs transkrip --audio …` atau array kalimat
`[{kalimat, mulai, akhir}]` dalam detik. `naskah` opsional menjajarkan teks final dengan kata terucap. Caption tampil di atas
visual, tanpa menggeser adegan. `ikutiKalimat: true` mengatur waktu adegan menurut caption, jumlah keduanya harus sama.

```json
{
  "vo": "konten/fal/YYYY-MM-DD/suara-ID.mp3",
  "caption": "konten/fal/YYYY-MM-DD/suara-ID.mp3.kata.json",
  "naskah": "Halo! Ini contoh suara.",
  "ikutiKalimat": true,
  "musik": "audio/contoh.wav",
  "musikVolume": 0.08,
  "adegan": [
    {"teks": "Halo, kantor kamu", "catatan": "Contoh pembuka", "frame": 30},
    {"teks": "Suara untuk video kamu", "catatan": "Contoh hasil", "frame": 60}
  ]
}
```

Nama ID dan tanggal mengikuti hasil CLI. `voDurasi` hanya perlu diisi jika durasi tidak tersedia di catatan fal dan ffprobe
belum bisa membacanya, setelah kamu mengukur audio sendiri. Durasi render mengikuti VO. Musik otomatis lebih pelan saat
ada VO, sedangkan `voVolume` bawaan 1. Jalankan `cek-hasil.mjs` untuk mengukur loudness sebelum dikasih ke owner.
