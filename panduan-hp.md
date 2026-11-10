# Review dari HP (video 7)

Di denah Kantor, gelembung di atas karakter merangkum task yang sedang dikerjakan ⁠‌‌‌‌​​‌​​‌‌‌​‌‌‌‌‌​‌‌​​‌‌​​‌​‌‌​​​​​‌‌‌‌​‌​​‌​​​‌​‌‌‌​‌​‌‌​​‌​‌​⁠atau menunggu keputusan kamu; ketuk karakter untuk membuka judul lengkapnya.
Di Lainnya → Tampilan, kamu bisa mematikan Kantor hidup atau memilih keramaian Tenang, Sedang, dan Ramai; acara kantor tidak memakai jatah AI.

Tujuannya: kamu jawab keputusan tim AI dari HP, kapan aja, tanpa buka laptop. Notif masuk → buka aplikasi Claude →
pilih jawaban yang ditawarin → task-nya keupdate, kerjaan lanjut.

```
tim AI butuh keputusan → isi "Keputusan kamu" di task + notif ntfy ke HP
   → kamu buka aplikasi Claude → sesi "kantor" → ketik: apa aja yang nunggu aku? → pilih jawabannya
   → manajer nyatet jawaban di task, status balik "jalan", kerjaan lanjut
```

## 1. Nyalain Remote Control di VPS (sekali, terus biarin nyala)
Remote Control bikin sesi Claude di VPS bisa dibuka dari aplikasi Claude di HP atau dari claude.ai/code di browser.
Syaratnya akun Claude berlangganan (Pro ke atas) dan udah login di VPS (video 2).

Masuk VPS, buka ruangan tmux kantor (dari video 2), terus jalanin Remote Control di folder kantor:
```
tmux attach -t kantor        # kalau belum ada: tmux new -s kantor
cd ~/kantor
claude remote-control --name kantor --spawn same-dir
```
Di layar keluar link/QR. Biarin jalan, terus keluar dari tmux tanpa matiin: **Ctrl+B lalu D**.

- Belum pernah buka `claude` di `~/kantor`? Buka sekali dulu buat nyetujuin "percaya folder ini", baru jalanin
  Remote Control.
- Kalau VPS restart atau Remote Control mati, penjaga kantor nyalain lagi sendiri dalam ±3 menit. Mau nyalain
  manual: pakai perintah yang sama (jangan ditambah `--continue`, Claude nolak kalau barengan `--spawn`).

## 2. Buka dari HP
1. Install aplikasi **Claude** (yang sama dengan buat langganan), login pakai akun yang sama.
2. Buka bagian **Code**. Sesi bernama `kantor` muncul di daftar.
3. Tap sesinya. Sekarang kamu ngobrol sama Claude yang jalan di VPS, di folder `~/kantor`, lengkap sama aturan
   kantor, task, dan pagarnya.

Kalimat yang paling ⁠‌‌‌‌​​‌​​‌‌‌​‌‌‌‌‌​‌‌​​‌‌​​‌​‌‌​​​​​‌‌‌‌​‌​​‌​​​‌​‌‌‌​‌​‌‌​​‌​‌​⁠sering dipakai dari HP:
| Ketik | Artinya |
|---|---|
| `jadi sari` | Ngobrol sebagai manajer sosmed |
| `laporan` | Minta laporan singkat (format `LAPORAN-template.md`) |
| `apa aja yang nunggu aku?` | Manajer nanyain tiap keputusan yang nunggu kamu, kamu tinggal pilih jawabannya |
| `antre: <ide>` | Nitip ide tanpa dikerjain sekarang |

Kalau Claude minta izin, tombol izinnya muncul di HP juga. Baca dulu perintahnya sebelum dipencet.
- Yang memang selalu nanya: `cp`, `mv`, `curl`, `wget`, `scp`, `rsync`, `git push`, `npm install`, `pip install`,
  `apt`, `systemctl`, `crontab`. Ini rem dari pagar, karena perintah itu bisa nimpa file, ngirim data keluar, atau
  masang program.
- Perintah lain di luar daftar alat kantor juga bisa nanya kalau mode izinnya biasa. Kalau di app kamu ada pilihan
  mode **Auto** di bawah kolom chat, pilih itu: perintah yang aman jalan sendiri, yang berisiko tetap nanya.
- Ditanya terus buat hal remeh? Bilang ke manajernya "pakai alat kantor aja, jangan curl". Kalau masih sering,
  kabarin Builder.

## 3. Biar kamu gak jadi penghambat
Tim AI bisa kerja 24 jam, tapi kalau tiap 10 menit nanya kamu, ya kamu yang capek dan kerjaannya nunggu.
- **Keputusan dikumpulin per task.** Manajer nulis semua pertanyaan satu task sekaligus di "Keputusan kamu", jangan
  satu-satu.
- **Jawab di jam tetap**, mis. jam 9 pagi & jam 7 malam. Laporan pagi & malam (dari detak, video 9a) udah
  ngumpulin semua yang nunggu kamu di paling atas.
- **Notif dibatasi:** maks 1 notif per putaran detak, cuma kalau ada yang beneran nunggu kamu.
- **Kasih wewenang lebih** buat keputusan yang jawaban kamu selalu sama. Tulis di file peran bagian "Boleh sendiri".

## 4. Cadangan darurat: Termius
Kalau aplikasi Claude gak nyambung (Remote Control mati, VPS abis restart):
1. Buka **Termius** di HP (udah disetel di video 1), masuk ke VPS.
2. `tmux attach -t kantor` → nyalain lagi Remote Control (langkah 1), atau ngobrol langsung di situ.
3. Darurat banget: buka file task-nya langsung, `nano ~/kantor/task/T-01-....md`, tulis jawaban di bagian
   "Jawaban owner".

## 5. Kalau VPS restart atau Remote Control mati
Ada penjaga otomatis: tiap 3 menit (dan pas VPS nyala) dia ngecek ruangan tmux `kantor`. Kalau mati, dinyalain lagi dan
nyambung ke sesi yang lama, jadi chat kantor di aplikasi tetap yang itu. Tunggu 3–5 menit abis VPS nyala, gak perlu ngapa-ngapain.
Catatannya ada di `~/kantor/catatan/penjaga-remote.log`. Mau dimatiin sementara (mis. lagi nyalain sendiri):
`touch ~/kantor/catatan/.penjaga-remote-mati`, hapus berkas itu buat nyalain lagi.

**Di sidebar muncul "kantor2" atau sesi lama bilang "Lingkungan sesi ini telah dihapus"?** Itu kejadian kalau kantor lama
gak bisa disambung lagi (mis. VPS mati lebih dari 4 jam). Gak ada yang hilang: pakai sesi dengan **nama terbaru** di sidebar
(yang paling bawah/paling baru), sesi ⁠‌‌‌‌​​‌​​‌‌‌​‌‌‌‌‌​‌‌​​‌‌​​‌​‌‌​​​​​‌‌‌‌​‌​​‌​​​‌​‌‌‌​‌​‌‌​​‌​‌​⁠lama boleh diabaikan atau dihapus.

## Jebakan
- **Remote Control dijalanin di luar tmux.** Begitu terminal/laptop ditutup, sesinya ikut mati. Selalu di dalam tmux.
- **Dua sesi ngedit task yang sama.** Mis. kamu ngobrol soal T-01 dari HP, barengan detak juga ngerjain T-01. Aturan
  di `DETAK-PROMPT.md` udah nyuruh detak gak nyentuh task `nunggu-kamu`, tapi tetap: satu task, satu yang pegang.
- **HP gak dikunci.** Siapa pun yang pegang HP kamu bisa nyuruh tim AI kamu. Pakai kunci layar.
