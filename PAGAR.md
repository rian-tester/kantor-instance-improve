# Pagar: yang AI wajib nanya dulu

Tim AI kamu boleh kerja sendiri, tapi ada hal yang **wajib ⁠‌‌‌‌​​‌​​‌‌‌​‌‌‌‌‌​‌‌​​‌‌​​‌​‌‌​​​​​‌‌‌‌​‌​​‌​​​‌​‌‌‌​‌​‌‌​​‌​‌​⁠nanya owner** dulu. Pagar dipasang dua lapis:
1. **Ditulis** di `ATURAN.md` (biar AI ngerti alasannya).
2. **Dikunci di sistem** pakai setelan izin Claude Code (`pagar/settings.json`), biar walaupun AI-nya salah paham,
   perintahnya tetap ketahan. Aturan tertulis doang gak cukup.

## Daftar wajib nanya
| Urusan | Contoh | Kenapa |
|---|---|---|
| Uang | Bayar, top up, ubah harga, kasih diskon | Salah sekali = rugi beneran |
| Hapus | Hapus file, folder, data, akun | Gak bisa dibalikin |
| Kirim keluar | Posting, email, chat ke orang, upload ke layanan lain | Sekali kekirim, gak bisa ditarik |
| Data pelanggan | Nama, nomor, alamat pembeli | Privasi orang lain |
| Sistem | `sudo`, matiin/ubah layanan, install yang aneh-aneh | Bisa bikin server rusak |

## Rahasia
- Kunci API, password, token: taruh di folder `.rahasia/` (izin `600`, cuma kamu yang bisa baca).
- AI **dilarang** baca isi `.rahasia/` langsung, apalagi nyetak/nyalin ke chat. Skrip yang butuh kunci baca sendiri
  dari file itu.
- Jangan pernah nempel kunci di chat ke AI. Kalau kepencet, langsung ganti kuncinya di situs penyedianya.

## Skrip yang boleh jalan sendiri gak boleh diubah AI
Beberapa skrip boleh dijalanin AI tanpa nanya (notif, render carousel, alat hitung di `alat/`). Isinya **dikunci**:
AI gak bisa ngedit `detak.sh`, `notif.sh`, `carousel/render.mjs`, `dokumen/render.mjs`, dan folder `alat/`. Kalau bisa, AI tinggal nulis
perintah apa aja ke salah satu skrip itu terus ngejalaninnya, dan pagar jadi percuma. Update skrip-skrip ini lewat
update kit.

Data angka juga dikunci: buku kas (`keuangan/kas.csv`) & daftar penawaran/invoice (`tagihan/daftar.csv`, `tagihan/arsip/`)
cuma bisa diubah lewat alatnya (`alat/kas.mjs`, `alat/tagihan.mjs`, `dokumen/render.mjs`), biar angka gak bisa
diubah diam-diam & tiap perubahan ada jejaknya.

## Website (divisi Web & aplikasi)
Tim ngerjain di `web/pratinjau/` aja. **Nerbitin ke publik = owner** (tombol Terbitkan di dashboard → Website), begitu
juga balik versi & nambah domain. Versi yang tayang (`web/versi/`, `web/live`), daftar domain, & alat foto dikunci dari
Edit/Write. Pasang paket, kunci API, atau ⁠‌‌‌‌​​‌​​‌‌‌​‌‌‌‌‌​‌‌​​‌‌​​‌​‌‌​​​​​‌‌‌‌​‌​​‌​​​‌​‌‌‌​‌​‌‌​​‌​‌​⁠nyimpen data pengunjung: nanya owner.

## Google Drive (kalau disambungin)
Konektor Google Drive akun Claude bisa liat **seluruh** Drive owner. Biar tim cuma kerja di satu folder, kantor
dipasangin satpam (`alat/satpam-drive.mjs`, hook di `.claude/settings.json`) yang ngecek tiap aksi Drive:
- nyari wajib di folder kantor (`parentId = '<id folder>'`), buka file cuma yang ada di folder itu;
- nyimpen file baru cuma di folder **Hasil**; ganti nama / mindahin: owner ditanya;
- hapus & share ke orang lain: selalu ditolak; daftar "file terbaru" seluruh Drive: ditolak.
**Satu folder (aturan owner 08/11):** semua file Drive cuma di dalam folder Drive kantor yang terpasang (`node alat/drive-folder.mjs --cek`). Dilarang bikin folder atau
subfolder baru di luar itu. `node alat/drive.mjs kirim` dan `--folder` bikin folder di luar, jadi jangan dijalanin tanpa
izin owner.
Folder kantor diatur lewat `node alat/drive-folder.mjs <link folder>` (Builder yang jalanin, owner yang nyetujuin).
Daftar folder & file yang dikenal (`.drive/`) gak bisa diubah AI. Konektor lain di akun Claude (Gmail, Kalender, dll)
gak dijaga satpam ini: nyalain di setelan ⁠‌‌‌‌​​‌​​‌‌‌​‌‌‌‌‌​‌‌​​‌‌​​‌​‌‌​​​​​‌‌‌‌​‌​​‌​​​‌​‌‌‌​‌​‌‌​​‌​‌​⁠Claude cuma kalau emang mau dipakai tim.

## Pasang kuncinya (jalur Claude)
```
mkdir -p ~/kantor/.claude ~/kantor/.rahasia
cp ~/kit-kantor-ai/pagar/settings.json ~/kantor/.claude/settings.json
chmod 700 ~/kantor/.rahasia
```
Cek: `bash ~/kit-kantor-ai/cek/cek-6.sh`. Coba juga suruh AI "hapus folder hasil": harusnya ditolak atau nanya dulu.

## Jebakan dari kantor asli
- **AI matiin proses punya orang lain** gara-gara nyari pakai pola nama (`pkill nama`). Pola itu ikut kena proses
  lain yang namanya mirip. Makanya `pkill`/`killall` dikunci; kalau perlu matiin proses, sasar nomor prosesnya.
- **Kunci kecetak di log** waktu skrip error. Skrip wajib nyensor kunci sebelum nulis log.
- **Pagar dilempar ke divisi lain**: divisi A ditolak, terus nitip ke divisi B biar dikerjain. Ini dilarang di
  `ORGANISASI.md`; yang ditolak pagar balik ke owner.
