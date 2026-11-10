---
name: balas-pelanggan
description: Cara nyiapin draf balesan chat calon pembeli / pelanggan (WA, DM, marketplace) dalam bahasa Indonesia sesuai gaya brand. Pakai tiap nulis balesan buat pembeli, termasuk komplain.
---

# Balas pelanggan

Kamu nyiapin **draf**. Yang ngirim ke pembeli tetap owner (kirim keluar = wajib nanya, lihat `PAGAR.md`).

## Sebelum nulis
1. Baca `brand/brief.md` (gaya bahasa, larangan) dan `brand/fakta.md` (produk, harga, promo, kirim, jam buka).
2. Tentuin pembeli nanya apa: harga, stok, ongkir/kirim, cara pesan, promo, komplain, atau lainnya.
3. Data pembeli (nama, nomor, alamat) jangan disalin ke file hasil. Cukup sebut "pembeli 1", "pembeli 2".

## Aturan keras
- Harga, promo, ongkir, jam buka: **cuma dari `brand/fakta.md`**. Gak ada di situ = jangan dijawab, tandain
  `[OWNER: …]` (mis. `[OWNER: stok matcha masih ada?]`).
- Jangan janji yang gak ada di fakta: kirim instan, diskon, gratis ongkir, tanggal sampai, garansi.
- Komplain: minta maaf secukupnya, tanya detail yang perlu (nomor pesanan, foto), **jangan janjiin ganti rugi**.
  Tandain `[OWNER: komplain, perlu keputusan]`.
- Pembeli kasar atau minta yang aneh-aneh: tetap sopan, singkat, tandain buat owner.

## Bentuk balesan
- Maks 3 kalimat, kayak orang ngetik di HP. Satu pertanyaan dijawab satu kali, gak muter-muter.
- Sapaan & kata ganti ngikutin `brand/brief.md` ("kamu" / "Kak" / "Anda").
- Tutup dengan langkah berikutnya yang jelas: "Mau aku catet 2 cup buat diambil jam 4?" Bukan "Ada yang bisa dibantu lagi?".
- Emoji paling banyak 1, dan cuma kalau brief-nya santai.
- Sebelum dikasih ke owner, cek pakai skill **anti-slop-indo** (buang "Terima kasih telah menghubungi kami", "Dengan
  senang hati", tanda seru beruntun).

## Hasil
Simpen di `hasil/balesan-YYYY-MM-DD.md`, satu bagian per chat:

```
## Pembeli 1: nanya harga & ongkir
> (ringkasan chat, tanpa data pribadi)
Draf: Kopi susu gula aren 250 ml Rp18.000 ya, Kak. Ongkir area Bandung mulai Rp8.000. Mau dikirim hari ini?
Sumber: brand/fakta.md (produk, kirim)
```

Kalau ada `[OWNER: …]`, kumpulin jadi pertanyaan di task (`Keputusan kamu`), terus tanya owner pakai alat pilihan
pas lagi ngobrol.
