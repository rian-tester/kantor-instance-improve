---
name: cek-tampilan
description: Cara ngecek tampilan web/halaman sebelum diserahin ke owner — motret di ukuran HP & laptop, buka fotonya, nilai pakai standar layak tayang, benerin. Wajib tiap abis bikin atau ngubah tampilan.
---

# Cek tampilan

Owner gak boleh jadi orang pertama yang nemu teks kepotong atau tampilan berantakan. Tiap abis ngubah tampilan:

1. `node alat/web.mjs ukur` → beresin semua ❌.
2. `node web/alat/foto.mjs` → beresin ❌ yang ketemu otomatis (melebar ke samping, gambar rusak, file gak ketemu, error).
3. **Buka tiap foto** di `web/foto/` (alat Read), HP dulu baru laptop. Nilai jujur:
   - **Layar pertama di HP:** dalam 3 detik kebaca jualan apa & buat siapa? Tombol utama keliatan tanpa scroll?
   - **Hierarki:** mata langsung tau mana judul, mana penjelasan, mana tombol? Gak ada 2 hal yang rebutan perhatian?
   - **Kebaca:** teks kontras sama latar (abu muda di atas putih = gagal), ukuran cukup, baris gak kepanjangan di laptop.
   - **Rapi:** jarak antar bagian konsisten, rata kiri/tengah konsisten, gak ada yang numpuk/kepotong/gepeng.
   - **Gambar:** tajam, gak gepeng, cocok sama isinya, gak keliatan foto stok.
   - **Bukan template:** cocokin sama daftar "Jangan" di skill web-bisnis. Ada satu hal yang bikin web ini khas bisnis
     ini, bukan web siapa aja? Font & warna keliatan dipilih, bukan bawaan? Kalau nama bisnisnya diganti, web ini
     masih cocok buat bisnis lain? Kalau iya, masih generik: ulang dari arah desain.
   - **Layak tayang?** Bayangin owner ngirim link ini ke 50 pelanggan sekarang juga. Bangga atau malu?
   - **Tulisan:** baca ulang pakai anti-slop-indo. Harga & fakta cocok sama `brand/fakta.md`.
4. Tulis 3 hal yang paling ganggu → benerin → foto ulang. **Maks 3 putaran** (tiap putaran makan jatah). Kalau masih
   ada yang kurang, sebut terus terang di laporan ke owner.
5. Laporan ke owner: link pratinjau, apa yang berubah, & yang kamu sendiri masih kurang yakin (kalau ada). Foto juga
   keliatan di dashboard → Website.
