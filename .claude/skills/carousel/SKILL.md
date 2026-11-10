---
name: carousel
description: Alur carousel dari sudut dan fakta ke HTML bebas, kritik terpisah, revisi owner dan persetujuan tayang.
---

# Carousel: alur kerja, bukan isi template

Manajer sosmed mengelola task dan keputusan; Penulis, Pemeriksa/Satpam, Desainer dan Kritikus
bekerja terpisah. Periksa nomor task seluruh divisi sebelum membuat yang baru.

## Fondasi sekali di awal
Baca brand/brief.md, brand/fakta.md, brand/sistem-desain.md, brand/selera.md.
Sistem desain belum ada? Jalankan sistem-desain-brand: tiga acuan owner → tiga
arah dengan contoh render → owner memilih → aturan brand. Jangan langsung render
satu template lalu menyebutnya gaya brand.

## Per konten dan alasan tiap langkah
1. Ide/riset → usulkan dua–tiga sudut → owner memilih. Ini menjaga pesan tunggal
   dan menghindari konten generik; jika sumber gagal dibaca, jangan jadikan fakta.
2. Penulis menulis 5–7 slide (atau jumlah yang disepakati), satu poin tiap slide,
   hook maksimal delapan kata, sekitar 20–30 kata isi, payoff dan ajakan spesifik.
   Caption sesuai suara brand. Simpan hasil/naskah-<task>.md.
3. Pemeriksa terpisah cek setiap klaim ke brand/fakta.md atau daftar sumber yang
   terbaca. Kutip teks yang salah; jangan membuat testimoni/promo. Satpam wajib,
   bukan pilihan kalau kebetulan ada. Naskah belum lolos tidak masuk desain.
4. Owner memeriksa naskah. Tunggu persetujuan, supaya visual tidak mempercantik
   pesan yang masih salah. Tulis keputusan dan revisi yang disepakati di task.
5. Desainer membuat konsep baru dan HTML/CSS per carousel memakai sistem brand.
   node carousel/render.mjs carousel/karya/<task>/index.html hasil/carousel-<task>
   Alat menghasilkan PNG, HP, kontak, grid, strip waktu, qc.json. Buka semuanya.
   Render nyetak ringkasan + temuan per slide. Baca ulang: `node alat/qc-ringkas.mjs hasil/carousel-<task>/qc.json`.
   Satu perintah per langkah: tanpa `| tail`, `;`, `&&`, atau `python3 -c`.
   Mesin harus nol; kontras di atas foto tetap cek mata. Tidak membuat MP4.
6. Panggil Kritikus sebagai agen/sesi terpisah dari Desainer. Simpan tiap putaran
   hasil/kritik-<task>-putaran-N.json. Skor Ale: hierarki, kebaca HP, ritme,
   konsistensi, orisinal, brand, gerak, craft. Semua ≥4, tanpa masalah berat,
   baru lolos standar penuh. PNG diam saja tidak membuktikan aspek gerak.
7. Masalah → Desainer memperbaiki → render dan kritik ulang, maksimal tiga putaran
   eksternal. Masih gagal? Serahkan skor/masalah dan minta keputusan; jangan
   posting, menaikkan skor sendiri atau mengaku sudah setara Ale.
   Jalankan node alat/cek-kritik.mjs hasil/kritik-<task>-putaran-N.json hasil/carousel-<task>.
   Kritik harus terikat hash render terbaru, skor/alasan lengkap dan keputusan
   konsisten. Alat lolos tidak menggantikan pembacaan gambar atau sesi terpisah.
8. Owner memeriksa hasil. Contoh revisi: “slide 3 terlalu padat, maksimal 20 kata;
   pertahankan fakta harga” atau “judul cover tak terbaca di grid”. Catat perubahan,
   alasan dan konteks di brand/selera.md serta Pelajaran di sistem desain.
   Terapkan pada karya ini dan baca ulang untuk karya berikutnya.
9. Caption/jadwal hanya usulan. Tayang manual oleh owner, atau posting-repliz
   setelah akun terhubung dan owner menyetujui media/caption/akun/jam di dashboard.
   Tidak tersambung atau belum disetujui = belum tayang, bukan berhasil.

## Jika nyangkut
- Agen belum ada: minta Builder memasang dari studi-kasus/sosmed/PERAN-*.md.
- Alat/browser belum ada: Builder mengikuti pemasangan kit, jangan unduh dari HTML.
- Acuan/fakta/foto kurang: berhenti di bahan yang kurang, jangan membuat pengganti.
- Template JSON lama hanya cadangan jika owner memilihnya secara eksplisit:
  node carousel/render.mjs carousel/naskah-<task>.json hasil/carousel-<task> --cadangan
  Catat sebagai jalur darurat, bukan hasil alur baru atau kelulusan standar Ale.

## Pagar mutu sebelum mengaku lolos
Penulis → Satpam menguji janji cover, berhenti scroll, manfaat menggeser, payoff
baru yang terhubung brand, minimal satu fakta/insight bersumber dan pedoman suara
sebelum persetujuan naskah/desain. Simpan jawaban serta kutipan sumber/slide.
Sistem brand wajib wordmark/produk di cover dan penutup, empat–enam tipe, jangkar
per slide, pedoman suara serta motif; tiap carousel memakai minimal empat tipe,
motif sama maksimal dua slide. Fondasi lama diperbarui seperlunya.
Kritikus mengisi pertanyaan_wajib dan bukti_wajib sesuai PERAN-kritikus.md.
Satu tidak membatasi aspek terkait maksimal 3. Validator menolak kritik lama
yang belum punya jawaban/bukti dan keputusan lolos yang melanggar pagar.

## Bahasa, logika dan versi final
Penulis/Satpam wajib membaca kitab-bahasa/ATURAN.md dan pasangan.md bersama
bank brand. Satpam menjalankan alat cek bahasa hingga nol dan tes baca keras.
Fakta terkuat pada penutup harus dijanjikan cover; angka menempel ke elemen
visual, banding punya judul dan penanda. Label sumber maksimal satu baris,
metodologi di caption/lembar sumber. Pertahankan batas penting dalam klaim utama.
Bekukan hasil/naskah-<task>-final.json yang lolos (brand, caption, slide berisi
teks publik urut dan sumber). Desainer tidak memakai draf atau mengubah kata.
Jalankan python3 alat/cek-naskah.py <final.json> <index.html> <qc.json> dan
python3 alat/cek-bahasa.py --json --naskah <final.json> sebelum mengaku lolos.
Simpan kedua hasil beserta final JSON/hash di setiap snapshot kritik dan paket
banding. Markdown final harus cocok JSON, draf diberi label terpisah.
Revisi kalimat owner masuk bank pasangan brand saat diterima; tiap minggu
manajer menjalankan skill rangkum-revisi melalui pengingat detak/sesi yang ada.

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
