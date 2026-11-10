---
kode: T-06
judul: Hitung biaya API dan layanan kantor
divisi: keuangan
pegang: laras
status: jalan
update: 2026-11-08
---
## Tujuan
Biaya API AI dan langganan layanan kantor tercatat di buku kas dan ada rekap bulanan. Selesai kalau rekap bulan berjalan jadi di `hasil/biaya-2026-11.md`.

## Udah
- 08/11 Laras dibuat: peran, SOP `sop/catat-biaya.md`, skill pembukuan, kategori di `keuangan/kategori.md`.
- Biaya fal sudah dicatat otomatis di `catatan/fal-biaya.jsonl` (belum ada isinya per 08/11).
- 08/11 owner jawab: 1b kurs ikut tiap tagihan; 2a tagihan sudah ditaruh.
- 08/11 Laras cek `masuk/keuangan/`: folder masih kosong (0 berkas). `keuangan/kas.csv` bulan 2026-11 juga masih 0 transaksi. `catatan/fal-biaya.jsonl` ada 2 panggilan (flux/schnell est. $0,006 selesai; flux/dev est. $0,15 baru status mengirim), semuanya estimasi.

- 08/11 owner jawab: 1b gak ada tagihan, rekap fal aja dulu (estimasi dolar, tanpa kurs).
- 08/11 Laras bikin `hasil/biaya-2026-11.md`: 2 panggilan fal sama-sama selesai, total estimasi $0,156. Belum dimasukin ke kas (estimasi, belum ada kurs).

## Hasil
hasil/biaya-2026-11.md

## Keputusan kamu

## Berikutnya
- Kalau ada tagihan masuk ke `masuk/keuangan/`: catat (kurs ikut tiap tagihan).
- Akhir bulan: refresh rekap fal di `hasil/biaya-2026-11.md`, lalu `beres`.
