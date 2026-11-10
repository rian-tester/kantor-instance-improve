---
name: kalender-konten
description: Cara nyusun kalender konten 30 hari (tabel tanggal, platform, format, topik, hook, tujuan) yang nyambung ke bikin konten & posting lewat Repliz. Pakai tiap owner minta rencana konten sebulan atau jadwal posting.
---

# Kalender konten 30 hari

Kalender = **rencana**. Tiap konten tetap dibikin, dicek, dan disetujuin owner dulu sebelum tayang.

## 1. Bahan
- `brand/brief.md`, `brand/fakta.md` (promo & tanggalnya cuma dari sini).
- Angka asli kalau ada: `sosmed/performa/terbaru.md` (format, topik, jam yang menang). Belum ada: bilang ke owner,
  pakai jam 12.00 & 19.00 dulu.
- Riset kalau ada: `hasil/*riset*.md` (skill **riset-tren**).
- Tanggal penting (gajian, hari besar, promo): tanggal hari besar dicek dulu pakai WebSearch, tulis sumbernya. Ragu =
  tanya owner, jangan nebak.

## 2. Tanya owner (alat pilihan)
Platform mana aja, berapa kali posting per minggu (saran: 3–5), dan porsi tujuan (saran awal: 6 bagi-ilmu/hiburan,
3 bukti/testimoni, 1 jualan dari tiap 10 konten).

## 3. Tulis kalender
`hasil/YYYY-MM-kalender-konten.md`:
```
# Kalender konten <bulan> — <brand>
| Tgl | Hari | Jam | Platform | Format | Topik | Hook (1 kalimat) | Tujuan | Status |
|-----|------|-----|----------|--------|-------|------------------|--------|--------|
| 07/10 | Sel | 19.00 | Instagram, TikTok | Carousel 7 slide | … | … | bagi-ilmu | rencana |
```
- Format: carousel (skill **carousel**), video, atau teks (Threads/X). Jangan masukin format yang kantor gak bisa bikin.
- Topik gak boleh ngulang 5 konten terakhir di `hasil/`. Hook dicek pakai skill **anti-slop-indo**.
- Status: `rencana` → `dibikin` → `nunggu-setuju` → `terjadwal` → `tayang`. Update tiap ada yang berubah.

## 4. Abis owner oke kalendernya
Kerjain per minggu, bukan sebulan sekaligus (biar bisa ngikutin angka):
1. Bikin konten minggu itu sesuai kolom format. Tiap konten jadi satu task (`task/T-xx-…`, tulis baris kalendernya).
   - Carousel → skill carousel: sudut → Penulis → Satpam → owner setuju naskah → Desainer HTML bebas →
     Kritikus terpisah → revisi (maksimal tiga putaran) → owner cek visual/caption.
   - Video → baca skill video yang cocok lewat Read: video-explainer (menjelaskan topik), video-affiliate (jualan dari
     link produk), video-remotion (lainnya). Naskah/brief disetujui owner dulu sebelum biaya suara atau gambar.
   Baca ulang sistem desain/selera; kalender disetujui bukan berarti visual atau video otomatis disetujui.
2. Tiap konten jadi: tulis rencana posting pakai skill **posting-repliz** (`sosmed/terbit/<id>.json`, jamnya dari
   kalender), status kalender jadi `nunggu-setuju`. Owner nyetujuin di dashboard → Konten (isi `"task"` di rencananya).
3. Senin: baca `sosmed/performa/terbaru.md`, geser topik/jam minggu depan kalau ada yang jelas menang atau jeblok.
Belum pakai Repliz? Jadwal & caption tetap ditulis, owner yang posting manual.
<!-- Alur Academy lintas divisi: dibaca sebelum instruksi rinci skill ini. -->
Baca skill alur-divisi dan aturan brand divisi yang relevan. Konsep/pilihan
owner mendahului produksi; pemeriksa terpisah mendahului persetujuan akhir.
Simpan revisi yang disepakati sebagai aturan berkonteks untuk tugas berikutnya.
Tanpa sumber/alat/izin, catat belum terpenuhi atau dilewati, bukan berhasil.
