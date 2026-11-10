# SOP: laporan iklan mingguan (contoh)

## 1. Tujuan
Tiap Senin: ringkasan iklan minggu lalu + usulan iklan mana yang dilanjut, dijeda, atau diganti materinya.

## 2. Bahan masuk
- `masuk/iklan/`: file ekspor dari pengelola iklan (mis. Meta Ads Manager → Ekspor → CSV) buat 7 hari terakhir.
  Owner yang ngunduh & naruh di sini.
- `brand/fakta.md`: harga produk (buat ngitung biaya per pembeli masuk akal atau nggak).

## 3. Langkah
1. Buka file ekspor terbaru. Catat periodenya.
2. Per iklan: biaya, tayangan, klik, CTR, hasil (pembelian/pesan), biaya per hasil.
3. Bandingin sama laporan minggu lalu di `hasil/` kalau ada.
4. Tandain: 2 iklan terbaik (biaya per hasil paling murah) & iklan yang boros (biaya jalan, hasil 0).
5. Tulis usulan + alasannya. Usulan, bukan keputusan.
6. Simpan di `hasil/laporan-iklan-YYYY-MM-DD.md` (maks 20 baris), isi "Keputusan kamu" di task.

## 4. Hasil
`hasil/laporan-iklan-YYYY-MM-DD.md`: tabel per iklan + 3 usulan bernomor dengan pilihan a/b/c buat owner.

## 5. Siapa mutusin
- AI sendiri: ngolah angka, nyusun usulan.
- Owner: semua soal budget, nyalain/matiin iklan, dan materi yang tayang.
