# Acuan visual autoaja.agency (dari owner, 08/11)

Sumber: 5 screenshot profil & grid IG @autoaja.agency yang owner kirim lewat chat (berkas gambarnya belum punya jalur
di folder kantor, jadi ini catatan pengamatan Sari). Bukan izin menyalin; ini bahan buat tiga arah.
Catatan: ini feed yang sudah ada (47 post, 90 pengikut), bukan karya acuan dari luar. Acuan dari luar belum ada.

## Yang kelihatan
1. **Carousel teks navy**: latar biru tua polos, judul putih tebal besar (satu keluarga sans condensed/bold, kadang
   lebih rapat), garis tipis kuning-emas pemisah, sub kalimat putih kecil di bawah, satu ikon garis putih di atas
   (kail, hati, bohlam, buku, folder, segitiga peringatan). Isi: "5 Formula Hook Terbaik Edukasi UMKM", "Bukan Topikmu
   yang Salah, Tapi Hookmu", "Capek Berjuang Sendirian Bikin Konten Terus", "Orang save biar terlihat paham".
2. **Maskot**: semut astronot (helm bening, jaket biru, bintang kuning), dipakai sebagai avatar & muncul di reels.
3. **Reels/cover ilustrasi kartun** gaya vektor tebal: warna hangat jenuh, mimik panik berkeringat, ikon WhatsApp/TikTok/
   Instagram, badge notifikasi "99+", "247+". Tema masalah UMKM (chat numpuk, bingung caption).
4. **Foto realistis AI** perempuan lelah di sofa/dapur/meja kerja, nada hangat redup, ada produk sehari-hari (Klin,
   Sunlight, Indomie, Royco) di latar. Dipakai sebagai cover.
5. **Mockup layar**: chat WhatsApp "Min, mau cek harga produk X…", jadwal sosial media "Belum ada konten", chat klinik
   kecantikan "udah deh kak, cari tempat lain aja".
6. Bio: "AI otomasi untuk UMKM Indonesia · WA Broadcast · Social Media AI · CS 24/7 · Fully managed. Harga flat. Mulai
   1,25jt/bln".

## Cara produksi sebelumnya (kata owner, 08/11)
autoaja sudah jalan sebelum kantor ini: OpenClaw di VPS Hostinger. Kombo: GPT + Google image untuk gambar, HeyGen untuk
video, setup aset di VPS. Postingan yang ada = postingan demo dengan produk nyata. Artinya hex warna, font, template, dan
prompt aslinya kemungkinan ada di VPS, bukan di Drive. Kantor ini gak punya akses ke VPS; bahan harus dibawa owner.

## Warna perkiraan dari screenshot (owner pilih "ukur dari screenshot")
Dilihat dengan mata, bukan diukur piksel (berkas gambar belum ada di folder kantor). Tandai PERKIRAAN, koreksi owner
menang:
- Latar navy: biru tua keunguan, kira-kira #14155E
- Garis pemisah: emas/kuning hangat, kira-kira #E8A33D (mirip aksen bawaan brief.md)
- Judul & sub: putih (sub sedikit redup)
- Maskot: oranye hangat + biru jaket + kuning bintang
Font: judul sans tebal rapat (mirip Montserrat/Anton bold; satu post lebih condensed). Nama font belum diketahui.

## Warna terukur dari aset asli (Builder, 09/11)
Diukur dari berkas di `masuk/autoaja-aset/` lewat browser tanpa kepala (piksel buram dibuang, dikelompokkan per 8 level, jadi akurasi ±4 per kanal). Ini hasil ukur, bukan tebakan.
- **Navy (logo horizontal-trans-crop.png):** sekitar 90% piksel ada di rentang #1C1C4C sampai #24245C. Titik tengah praktis **#1E2155** (bukan #14155E). Terpakai juga di maskot dan avatar (#242454, #2C2C64, #3C3C7C untuk sisi lebih terang).
- **Oranye maskot:** sekitar #E49C6C (bagian maskot, bukan garis emas).
- **Emas garis pemisah (#E8A33D): belum terukur** dari aset ini. Logo tidak memuat emas, jadi angka itu tetap perkiraan dari screenshot. Ukur dari screenshot feed asli kalau owner mau kepastian.
- Owner menjawab "pakai angka dari aset yang owner punya" (dashboard 09/11 10:40): navy pakai **#1E2155**.

## Pola yang terbaca
- Gaya bahasa: "kamu", santai tapi sopan, judul berupa masalah/kontras ("Bukan X, tapi Y").
- Tiga dunia visual bercampur (navy teks, kartun, foto realistis). Belum satu sistem.
- Judul teks navy kadang kepotong/kerapatan beda antar post; kontras judul abu di "Jangan Mulai Kontenmu…" lemah.

## Perlu dicek sebelum jadi aturan
- **Harga di bio "Mulai 1,25jt/bln" gak ada di brand/fakta.md.** Aturan: satu-satunya harga yang boleh disebut
  "Mulai di bawah 2 juta/bulan". Tanya owner: bio mau disamain, atau fakta.md yang diperbarui.
- Produk di foto latar (merek Klin, Sunlight, Indomie, Royco) = merek orang lain; jangan jadi pola di carousel baru.
- Warna asli navy & emas belum diukur (jangan ngarang hex): ukur dari aset di Drive `png asset` kalau owner izinin unduh.
- Aset autoaja di Drive `png asset` (cuma dibaca daftarnya): logo horizontal (2 berkas), avatar-02/03, maskot (original,
  flying, error, notfound), app-icon favicon, dan 8 gambar "problem/solution" (WhatsApp broadcaster, AI concierge, more AI).
  Konektor baca gak bisa nampilin isi gambar, jadi hex & bentuk belum terverifikasi.
