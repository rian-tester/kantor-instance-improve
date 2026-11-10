# SOP: draf balesan calon pembeli (contoh)

## 1. Tujuan
Owner nempel chat calon pembeli yang belum dibales. AI nyiapin draf balesan yang tinggal disalin. Tiap ada chat masuk.

## 2. Bahan masuk
- `masuk/chat/`: chat yang ditempel owner (1 file per chat). Nama & nomor pembeli gak usah ikut ditempel.
- `brand/fakta.md`: produk, harga, promo, ongkir, jam buka.
- `brand/brief.md`: gaya bahasa.

## 3. Langkah
1. Baca chat, tentuin pembeli nanya apa (harga, stok, ongkir, cara pesan, komplain).
2. Tulis draf balesan maks 3 kalimat, gaya bahasa sesuai brief. Fakta cuma dari `brand/fakta.md`.
3. Pertanyaan yang jawabannya gak ada di fakta (mis. stok, janji kirim) → jangan dijawab, tandain "owner yang jawab".
4. Komplain → jangan janjiin apa-apa, tulis draf permintaan maaf + tandain buat owner.
5. Simpan semua draf di `hasil/balesan-YYYY-MM-DD.md`, satu bagian per chat.

## 4. Hasil
`hasil/balesan-YYYY-MM-DD.md`. Contoh:
> **Chat 1 (nanya harga 1 liter):** "Halo! Kopi susu gula aren 1 liter Rp65.000 ya, cukup buat 4–5 gelas. Mau
> diambil atau dikirim?"

## 5. Siapa mutusin
- AI sendiri: nyusun draf, nandain yang butuh owner.
- Owner: ngirim balesan ke pembeli (AI gak pernah ngirim sendiri), semua janji stok/pengiriman, diskon, komplain.
