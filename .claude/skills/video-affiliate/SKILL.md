---
name: video-affiliate
description: Alur video affiliate 15–20 detik dari link produk Tokopedia, TikTok Shop atau Shopee, dari baca produk dan brief yang disetujui owner sampai pemeriksaan. Baca saat owner minta video affiliate atau video jualan dari link produk.
---

# Video affiliate: pahami produknya, tunjukkan produknya dipakai

Baca skill ini lewat Read, karena detak tidak punya tool Skill. Ini lanjutan skill/video-remotion.md (render, still, cek-hasil,
aset) dan skill/gambar-video-fal.md (biaya, edit gambar, permintaan video). Hasilnya video 9:16 15–20 detik: suara narator +
B-roll tanpa muka narator, produk kelihatan sedang dipakai, biaya fal maksimal US$1,5 per video kecuali owner bilang lain.
Manajer sosmed memegang task. Penulis, Satpam (klaim), Sutradara dan Pemeriksa video (agen terpisah) bekerja seperti video-remotion.
Satu putaran detak cukup satu langkah alur. Tulis hasil tiap langkah di task bagian Udah supaya putaran berikutnya lanjut.

## Alur
1. **Baca link.** `node alat/produk.mjs baca <url> --keluar konten/produk/<slug>` menyimpan produk.json (judul, deskripsi,
   varian + stok, harga + tanggal cek, rating, jumlah ulasan, topik ulasan), foto dan video seller, serta sumber.json.
   - Tokopedia (tk.tokopedia.com, www.tokopedia.com) biasanya terbuka tanpa login. Isi ulasan sering tidak ikut, cuma rata-rata
     dan topiknya. Jangan mengarang isi ulasan.
   - TikTok Shop (vt.tokopedia.com, shop-id.tokopedia.com) memunculkan captcha ke server. Yang terbaca cuma judul dan foto utama
     dari pratinjau link. Minta owner menempel teks halaman dan mengirim foto atau screenshot untuk harga, varian dan foto lain.
   - Shopee dan halaman yang kosong tanpa browser: langsung minta owner menempel teks halaman dan foto produk. Jangan memasang
     browser di VPS.
   - Foto atau video ulasan pembeli tidak dipakai, karena itu milik pembeli.
   - Jangan buka link pakai `curl` atau `wget`, karena owner jadi diminta izin. Kalau `produk.mjs` gagal, ikuti cabang di
     atas (minta owner menempel teks halaman dan foto).
   - Untuk teks dan foto yang owner kirim, jalankan `node alat/produk.mjs manual --keluar konten/produk/<slug> --teks <berkas-teks> --foto <berkas-foto>`.
     Pakai jalur berkas aslinya. Jangan pakai `cp` atau `mv` untuk menyalin atau memindahkan bahan dari `kotak-masuk/`
     ke `konten/produk/`. Kalau alat menolak jalurnya, laporkan ke Builder, jangan menggantinya dengan `cp` atau `mv`.
   - Foto lampiran chat langsung dipakai lewat `node alat/produk.mjs manual --keluar konten/produk/<slug> --teks <berkas-teks> --foto <jalur gambar chat>`.
     Pakai jalur gambar yang muncul di pesan. Alat yang menyalin fotonya ke folder produk, jadi jangan pakai `cp`.
2. **Brief produk** di `hasil/brief-<task>.md` (template di bawah), lalu tanya owner di "Keputusan kamu". Tunggu sampai disetujui
   sebelum ada biaya fal apa pun. Suara dan transkrip di gambar-video-fal langsung jalan tanpa persetujuan dashboard, jadi
   gerbangnya di brief ini. Tanyakan juga apakah harga disebut di video. Bawaannya tidak. Kalau disebut, tulis tanggal ceknya.
   Jenis produk ditulis dari bentuknya di foto, bukan dari kata kunci di judul listing (tas bahu jangan disebut "ransel" cuma
   karena judulnya begitu). Angka yang beda-beda di listing atau foto (berat, ukuran) tidak dipakai.
3. **Naskah dan shot list**: 4–6 adegan sesuai buku pola kategori. Teks hook konkret di 0–2 detik, misalnya pertanyaan soal
   manfaat yang kelihatan di foto. Harga, rating dan jumlah terjual cuma masuk kalau owner setuju disebut. Klaim cuma dari
   listing atau ulasan, dan barang yang tidak kelihatan di foto jangan disebut "isinya". Penutup "cek keranjang" tanpa menyebut
   warna keranjang, karena videonya bisa dipakai di banyak marketplace. Video jualan tidak memasang label sumber di layar,
   sumbernya dicatat di catatan karya. Satpam cek tiap klaim ke produk.json dan cek bahasa sampai nol. Kalau Satpam memotong
   klaim, Penulis baca keras lagi supaya kalimatnya tetap utuh.
4. **Visual berjenjang** per adegan (bagian di bawah). Catat jenjang dan sumber tiap adegan di naskah.
5. **Suara** mengikuti target pembeli: produk wanita pakai suara wanita (misalnya Aoede), produk pria pakai suara pria
   (misalnya Achird). Gayanya kreator yang santai tapi jelas. Nama merek yang susah diucap ditulis dalam ejaan ucapan di teks
   suara. Cek transkrip dengan `node alat/cek-suara.mjs` sampai ≥0,95. Merek terdengar salah → ulang take penuh.
6. **Komposisi**: template `video/src/affiliate/` dengan data `video/public/produk/<slug>/data.json` (contoh di README-nya),
   atau komposisi sendiri. Tidak ada visual diam >2 detik. Foto digerakkan kamera, info kunci (ukuran, isi set) menempel di layar.
7. **Render dan cek** mengikuti video-remotion.md bagian 3–4, lalu `node video/cek-hasil.mjs hasil/video-<task>.mp4 --beku 2 --lembar`.
   Pemeriksa video terpisah, lalu owner. Posting cuma lewat alur persetujuan (posting-repliz). Ada adegan AI dan tayang di
   TikTok → nyalakan label "AI-Generated Content" saat posting.

## Template brief
Jalankan `node alat/fal.mjs status` untuk mengisi angka sisa batas fal hari ini.
Kalau sisanya kurang, tanya owner di "Keputusan kamu": "Sisa batas fal hari ini kurang. Aku tunggu besok atau kamu mau naikkan batasnya?"

```
Produk      : <nama persis dari listing> · <kategori> · varian: <warna/ukuran yang stoknya ada>
Buat siapa  : <target pembeli>
Dipakai     : <kapan, di mana, untuk apa>
Masalah     : <satu kalimat dari deskripsi/ulasan>
3 bukti     : <cuma yang ada di listing/ulasan + sumbernya>
Keluhan     : <yang sering muncul di ulasan, jangan diklaim sebaliknya>
Tidak boleh : <klaim medis, "paling murah", "original" tanpa bukti, angka yang tidak konsisten di listing>
Adegan      : <adegan wajib kategori + jenjang sumbernya>
Hook        : <2 opsi teks>
Harga       : <disebut / tidak (bawaan)>
Suara       : <wanita/pria + alasan>
Biaya fal   : <perkiraan US$> · sisa batas fal hari ini: <US$> (dari `node alat/fal.mjs status`)
```

## Buku pola kategori (adegan wajib)
| Kategori | Adegan wajib |
|---|---|
| Fashion | dipakai badan utuh, jalan atau berputar, 2–3 sudut, close-up bahan |
| Sepatu dan sandal | dipakai di kaki sambil jalan, close-up samping di kaki, sol dan detail, dipadukan pakaian, muka model tidak perlu |
| Tas dan aksesoris | dibawa atau dipakai, isi dan kapasitas tas, detail resleting dan bahan |
| Rumah dan dapur | tangan memakai barangnya sampai hasilnya kelihatan, info kunci menempel di layar |
| Gadget dan elektronik | dipegang, dinyalakan, fitur utama dipakai, ukuran dibandingkan dengan tangan |
| Skincare dan kecantikan | tekstur di punggung tangan, cara pakai, hasil yang tertulis di listing, tanpa klaim medis |
| Makanan dan minuman | dibuka, porsi dan tekstur, dimakan atau diminum |
Kategori baru atau video yang owner setujui jadi patokan: catat di brand/selera.md bagian "Pola affiliate".

## Sumber visual berjenjang
Sebelum dipakai, zoom 2× tiap foto seller. Foto galeri listing bisa tercampur merek lain, tulisan klaim (misalnya "leather")
atau barang di luar daftar listing. Buang atau potong bagian itu. Foto kurang untuk adegan wajib → minta owner foto atau video
tambahan dari listing dulu. Edit gambar AI (jenjang 2) baru dipakai kalau owner memang tidak punya.
1. Foto atau video seller yang menunjukkan produk dipakai. Pakai langsung, atau gerakkan pelan lewat permintaan video
   (persetujuan dashboard, gambar-video-fal langkah 4).
2. Kalau tidak ada, edit gambar memakai foto produk asli sebagai acuan:
   `node alat/fal.mjs edit --model fal-ai/nano-banana/edit --gambar konten/produk/<slug>/foto/01.jpg --prompt "…"`, lalu
   permintaan video kalau perlu gerak. Cek kemiripan dengan zoom 2×: warna, bentuk, logo, jumlah tali atau kancing. Meleset →
   buang dan coba lagi maksimal 3 kali, atau turun ke jenjang 3. Pasang label "ilustrasi AI" di layar. Produk tidak boleh
   kelihatan lebih bagus dari aslinya. Muka model AI boleh muncul, tapi fokus adegan tetap produknya.
3. Foto produk saja: cutout, gerak kamera dan close-up. Hasilnya tetap tidak boleh jadi slideshow diam.

## Cek sebelum ke owner
- Adegan wajib kategori lengkap dan produk kelihatan dipakai di minimal satu adegan.
- Produk di tiap frame sama dengan foto asli (zoom 2×). Tangan dan kaki AI tidak cacat.
- Klaim suara dan teks cuma dari listing atau ulasan. Harga, kalau disebut, sesuai cek terakhir.
- Hook terbaca di 0–2 detik, tidak ada frame diam >2 detik, durasi 15–20 detik, loudness −14 LUFS.
- Label "ilustrasi AI" ada di adegan buatan AI. Biaya fal tercatat di `node alat/fal.mjs riwayat` dan ≤ batas video.
- Video keranjang yang isinya cuma foto produk diam + lagu berisiko dinilai kualitas rendah oleh TikTok. Pastikan ada gerak dan produk dipakai.

## Hasil produksi dan persetujuan
Abis produksi, simpan salinan hasil di `hasil/…`, lalu tulis jalurnya di task bagian `## Hasil`, satu jalur per baris.
Boleh tulis folder carousel. Hasil fal atau Remotion yang masih di folder produksinya juga bisa dipratinjau lewat
jalur lokal di task. Tetap catat kerjaan dan lokasi hasil di "Udah". Dashboard menampilkan hasil tepat di atas
"Keputusan kamu", jadi owner bisa melihat hasil dan langsung menjawab.

Jangan jalankan `node alat/drive.mjs kirim` atau `--folder`: alat itu bikin folder di luar folder Drive kantor (aturan owner
08/11). Tulis jalur lokal di `hasil/` ke task; mau ke Drive, tanya owner. Jangan menganggap sambungan konektor baca
sudah bisa mengirim gambar atau video.

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
