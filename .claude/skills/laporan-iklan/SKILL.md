---
name: laporan-iklan
description: Cara baca ekspor laporan iklan (Meta Ads, TikTok Ads, Shopee Ads) dan nyusun usulan lanjut / jeda / ganti materi dalam bahasa awam. Pakai tiap bikin laporan atau usulan iklan.
---

# Laporan iklan

Kamu **baca & ngusulin**. Ngubah budget, nyalain, atau matiin iklan itu urusan uang: owner yang mutusin (`PAGAR.md`).

## 1. Data
- Ekspor dari pengelola iklan (CSV atau Excel) ditaruh owner di `masuk/iklan/`. Excel → CSV dulu pakai
  `node alat/xlsx-ke-csv.mjs <file.xlsx> --ke <file.csv>`.
- Semua angka dihitung pakai `node alat/hitung-csv.mjs` (lihat skill **rekap-angka**), bukan di kepala.
- Periode harus jelas (mis. 28 Sep–4 Okt). Data kurang dari 3 hari atau tayangan di bawah ±1.000 = **belum cukup
  buat nyimpulin**. Bilang gitu, jangan maksa.

## 2. Istilah (jelasin ke owner pakai bahasa ini)
| Istilah | Artinya | Cara hitung |
|---|---|---|
| Tayangan (impressions) | Berapa kali iklan muncul | dari data |
| Jangkauan (reach) | Berapa orang beda yang liat | dari data |
| Frekuensi | Rata-rata 1 orang liat berapa kali | tayangan ÷ jangkauan |
| CTR | Dari 100 yang liat, berapa yang ngeklik | klik ÷ tayangan × 100% |
| CPC | Biaya per klik | biaya ÷ klik |
| CPM | Biaya per 1.000 tayangan | biaya ÷ tayangan × 1.000 |
| Biaya per hasil | Biaya per pesanan/chat/leads | biaya ÷ hasil |
| ROAS | Tiap Rp1 iklan balik jadi omzet berapa | omzet dari iklan ÷ biaya |

## 3. Patokan awal (bukan hukum, sesuaikan sama bisnis owner)
- **CTR < 1%** setelah ±2.000 tayangan → materinya kurang narik. Usul ganti gambar/hook.
- **Frekuensi > 3** dalam seminggu → orangnya bosen. Usul ganti materi atau perluas target.
- **Biaya per hasil** di atas target owner (tanya kalau belum ada) 3 hari berturut-turut → usul **jeda** (owner yang mutusin).
- **ROAS < 1** artinya rugi di iklan (sebelum ngitung modal barang). Bilang terus terang.
- Iklan bagus (biaya per hasil di bawah target, CTR wajar) → usul **lanjut**. Naikin budget = keputusan owner,
  usulin naik pelan (±20%).

## 4. Laporan
Simpen di `hasil/laporan-iklan-YYYY-MM-DD.md`. Isi:
1. **Ringkas 3 baris**: total biaya, hasil, biaya per hasil, dibanding minggu lalu.
2. **Tabel per iklan**: nama, biaya, hasil, biaya per hasil, CTR, frekuensi, usulan (lanjut / jeda / ganti materi).
3. **Usulan** jadi pertanyaan di task (`Keputusan kamu`), satu per iklan yang perlu keputusan, terus tanya owner pakai
   alat pilihan. Contoh: "Iklan 'promo Jumat' biaya per pesanan Rp52rb (target Rp35rb) 3 hari. a) jeda b) ganti
   materi c) biarin seminggu lagi. Saran: b, CTR-nya 0,6%."
4. Sumber: nama file + periode, dan "dihitung pakai alat/hitung-csv.mjs".
<!-- Alur Academy lintas divisi: dibaca sebelum instruksi rinci skill ini. -->
Baca skill alur-divisi dan aturan brand divisi yang relevan. Konsep/pilihan
owner mendahului produksi; pemeriksa terpisah mendahului persetujuan akhir.
Simpan revisi yang disepakati sebagai aturan berkonteks untuk tugas berikutnya.
Tanpa sumber/alat/izin, catat belum terpenuhi atau dilewati, bukan berhasil.
