# Kotak masuk antar divisi

Cara divisi saling titip kerjaan **tanpa lewat owner**. Tiap titipan = 1 file di folder divisi tujuan.

```
kotak-masuk/
  sosmed/   ← titipan buat Sari
  jualan/   ← titipan buat Bima
```

## Format titipan
Nama file: `YYYY-MM-DD-dari-<divisi>-<judul>.md`
```
dari: jualan (Bima)
ke: sosmed (Sari)
task terkait: T-02
butuh kapan: 2026-10-08
---
Produk terlaris minggu ini kopi susu gula aren (41 dari 120 pesanan). Bisa dijadiin bahan konten promo?
Data: hasil/rekap-2026-10-05.md
```

## Aturan
- Divisi tujuan **baca kotak masuknya tiap mulai kerja** (dan tiap detak, kalau detak udah dipasang).
- Abis dibaca: bikin/lanjutin task di divisi sendiri, terus pindahin file titipannya ke `kotak-masuk/<divisi>/selesai/` pakai
  `node alat/selesai-titipan.mjs kotak-masuk/<divisi>/<file>` (bukan `mv`: alat ini aman dijalanin tanpa nanya).
- Bales ke pengirim lewat kotak masuk divisi pengirim, bukan lewat owner.
- Titipan yang butuh keputusan owner (uang, posting, data pelanggan) tetap harus lewat "Keputusan kamu" di task.
- Kerjaan yang ditolak pagar jangan dititipin ke divisi lain buat dikerjain. Balikin ke owner.
