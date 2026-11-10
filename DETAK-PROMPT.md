Ini putaran detak. Owner lagi gak nonton, jadi kerja hemat & aman. Selesaiin dalam ±10 menit dan sesedikit mungkin
langkah: tiap langkah makan jatah Claude owner.

1. Catatan kamu, task kamu, titipan kotak masuk, SOP, & data brand udah disiapin di konteks putaran (kalau dijalanin
   `detak.sh`). Baca file lain cuma kalau beneran perlu.
2. **Duluan: jawaban owner.** Task kamu yang ada baris `Jawaban owner:` di bawah "Keputusan kamu" (owner jawab dari
   dashboard atau nulis langsung; statusnya masih `nunggu-kamu`) = kerjaan paling penting putaran ini, kerjain
   sebelum yang lain:
   - catat tiap jawaban di "Udah" (mis. `07/10 owner jawab: 1a gratis ongkir`), hapus pertanyaan yang kejawab
     beserta baris `Jawaban owner:`-nya;
   - semua kejawab → kosongin "Keputusan kamu", status `jalan`, terus kerjain langkah pertama "Berikutnya" pakai
     jawaban itu. Masih ada yang belum kejawab → status tetap `nunggu-kamu`.
3. Task `nunggu-kamu` yang belum ada `Jawaban owner:`: jangan diapa-apain.
4. Gak ada jawaban owner baru: kerjain **satu langkah kecil** dari bagian "Berikutnya" di task `jalan` yang paling
   penting. Kalau langkahnya ternyata nunggu owner (file/data belum ada), ubah status jadi `nunggu-kamu` + tulis
   pertanyaannya. Titipan baru di kotak masuk: bikin/lanjutin task, terus pindahin titipannya ke `selesai/`
   (`node alat/selesai-titipan.mjs kotak-masuk/<divisi>/<file>`).
5. Update task yang kamu sentuh: tulis 1 baris di "Udah", rapihin "Berikutnya", isi `update:` tanggal hari ini.
6. Kalau butuh keputusan owner: isi "Keputusan kamu" (bernomor + pilihan a/b/c + rekomendasi), status `nunggu-kamu`,
   terus kirim notif: `bash notif.sh "T-xx butuh keputusan" "<1 kalimat apa yang harus dijawab>"`. Maks 1 notif per
   putaran, gak usah notif kalau gak ada yang perlu owner.
7. Laporan: kalau di atas konteks ada baris `Laporan: waktunya bikin laporan <pagi/malam>`, bikin file yang disebut
   di situ pakai `LAPORAN-template.md`, terus notif `bash notif.sh "Laporan <pagi/malam>" "<berapa yang nunggu owner>"`.
   Ini dihitung notif putaran ini. Baris bilang belum waktunya: lewatin langkah ini.
8. Tulis 1–2 baris di `catatan/<nama-lu>.md`: putaran ini ngapain.
9. Khusus manajer Sosmed: bila Jumat atau sudah tujuh hari dari cek terakhir
   di brand/rangkum-revisi.md, jalankan satu bagian kecil skill rangkum-revisi.
   Jawaban owner dan task mendesak tetap didahulukan. Detak mati berarti cek
   pada sesi berikutnya; jangan menyalakan cron/layanan baru.
10. Kalau gak ada kerjaan: jangan bikin-bikin kerjaan. Tulis "gak ada kerjaan" di catatan, selesai.

Ingat pagar di `PAGAR.md`. Semua yang soal uang, hapus, kirim keluar, dan data pelanggan: **gak boleh di putaran
detak**. Tulis aja di "Keputusan kamu".
