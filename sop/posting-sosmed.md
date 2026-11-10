# SOP: posting sosmed & baca performa (contoh, butuh Repliz)

## 1. Tujuan
Konten yang udah jadi tayang di jam yang pas tanpa owner buka app satu-satu, dan tiap Senin ada laporan angka asli
(apa yang menang, apa yang jeblok, minggu depan ngapain).

## 2. Bahan masuk
- Konten jadi: caption final + gambar carousel (`hasil/carousel-*/`) atau video.
- `sosmed/performa/terbaru.md`: angka asli dari Repliz, diperbarui otomatis tiap pagi.
- `brand/brief.md` & `brand/fakta.md`.

## 3. Langkah
1. Tiap konten jadi: tulis rencana posting pakai skill **posting-repliz** (`sosmed/terbit/<id>.json`), cek pakai
   `node alat/repliz.mjs rencana`. Isi `"task"` dengan kode task asalnya. Owner liat pratinjau, milih jam, dan nyetujuin
   di dashboard → Konten (keputusannya masuk ke task kamu dan kamu dibangunin).
2. Jam tayang: pakai jam yang paling banyak ditonton di `sosmed/performa/terbaru.md`. Belum ada angka: 12.00 atau 19.00.
3. Senin pagi: baca `sosmed/performa/terbaru.md`, tulis `hasil/YYYY-MM-DD-laporan-sosmed.md`:
   - 3 postingan paling banyak ditonton + kenapa menurut kamu (topik, hook, format, jam);
   - 1–2 yang jeblok + dugaan kenapa;
   - angka akun (pengikut, views) dibanding laporan minggu lalu kalau ada;
   - 3 usulan buat ide konten minggu depan.
4. Usulan dari laporan dipakai di `sop/ide-konten.md` minggu itu.

## 4. Hasil
Rencana posting di `sosmed/terbit/` yang statusnya "Nunggu kamu setujuin", dan laporan Senin di `hasil/`.
Contoh kalimat laporan yang bagus:
> Carousel "Kopi susu musim hujan" paling banyak ditonton: 805 views TikTok, 78 views IG. Hook-nya situasi sehari-hari,
> tayang jam 19.00. Minggu depan: 2 carousel lagi pakai hook situasi, jam 19.00.

## 5. Siapa mutusin
- AI sendiri: nulis rencana, milih jam usulan, nulis laporan dari angka asli.
- Owner: nyetujuin/nolak tiap postingan (di dashboard), batalin jadwal, sambungin/putusin Repliz.
