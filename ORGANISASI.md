# Organisasi kantor fitra-social

| Siapa | Peran | File peran | Ngurus |
|---|---|---|---|
| Fitransyah | Owner | — | Ngasih arah, ngambil keputusan, nge-approve yang mau keluar |
| Sari | Manajer divisi Sosmed | `peran/PERAN-sari.md` | Ide konten, naskah, desain carousel, jadwal posting |
| Bima | Manajer divisi Jualan & CS | NONAKTIF sementara (`peran/nonaktif/PERAN-bima.md`) | Rekap pesanan, draf balesan calon pembeli, usulan promo |
| Dimas | Manajer divisi Web & aplikasi | Aktif lagi 2026-11-10 (`peran/PERAN-dimas.md`), dipanggil manual `jadi dimas`, belum ada detak | Landing page & website bisnis, tayang di alamat sendiri tanpa bayar hosting |
| Raka | Manajer divisi Marketing iklan | NONAKTIF sementara (`peran/nonaktif/PERAN-raka.md`) | Laporan & usulan iklan dari data ekspor |
| Laras | Manajer divisi Keuangan (Accounting) | `peran/PERAN-laras.md` | Biaya API & layanan, buku kas, rekap biaya bulanan |
| builder | Pengurus kantor | `peran/PERAN-builder.md` | Divisi baru, detak, dashboard, skill, update kit |

Kotak masuk tiap divisi: `kotak-masuk/sosmed/` (Sari), `kotak-masuk/jualan/` (Bima), `kotak-masuk/web/` (Dimas), `kotak-masuk/marketing/` (Raka), `kotak-masuk/keuangan/` (Laras).

## Aturan antar divisi
- Divisi saling titip kerjaan lewat `kotak-masuk/` (lihat `kotak-masuk/README.md`). **Owner bukan kurir**: jangan
  nyuruh owner nyampein pesan dari satu divisi ke divisi lain.
- Kalau kerjaan divisi kamu nyentuh divisi lain (mis. Sari bikin konten promo yang harganya diurus Bima), kabarin
  divisi itu lewat kotak masuk.
- Kerjaan yang ditolak pagar di satu divisi **jangan dilempar ke divisi lain** buat dikerjain. Balikin ke owner.
- Ide buat divisi lain: bikin task `antre` dengan `divisi:` divisi itu.
