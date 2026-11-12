# Ganti sistem jatah: dari tebak persen jadi "ditolak beneran"

Ditulis Builder 12/11, buat kamu terapkan manual. Gak ada file source yang kuubah.

## Kenapa
- `catatan/.jatah` cuma ditulis sama putaran detak. Kalau angka tinggi, detak ngalah, jadi gak ada putaran, jadi
  angkanya gak pernah diperbarui. Nyangkut di 100% sejak 10/11 23.55 (mingguan, reset Jum 06.00). Itu yang bikin Sari
  mandek sepanjang 11-12/11, padahal jatah kamu aman.
- Dashboard nampilin angka dari file yang sama, jadi gak bisa dipercaya. Lampu 5 jam bisa "0%" karena
  `jatah()` di `dashboard/server.mjs` nol-in angka kalau waktu reset-nya sudah lewat. Sekarang juga 0% karena aku
  nimpa `.jatah` jadi `0 0 0 0` buat ngelepas macetnya (cuma stopgap).

## Rancangan baru
Gak ada tebakan persen. Satu-satunya sinyal: **Claude beneran nolak** (`status: rejected` di rate_limit_event, atau
teks "usage limit"). Lalu semuanya skrip biasa, nol token:

1. Ditolak -> tulis `catatan/.jatah-habis` isi `<epoch mulai> <epoch reset>`, kirim notif sekali "Jatah Claude habis".
2. Tiap detak berikutnya (cron, tanpa panggil Claude): kalau file ada dan sekarang < epoch reset -> keluar diam-diam.
   Kalau sudah lewat -> hapus file, kirim notif "Jatah balik", lanjut kerja normal. Aktif lagi otomatis, gak nunggu AI.
3. Kalau waktu reset gak diketahui (cuma kena teks "usage limit"): coba lagi 1 jam kemudian (sama kayak rem lama).
4. Dashboard cuma baca `.jatah-habis`: ada = tampil "Jatah habis, lanjut otomatis HH:MM". Gak ada = lampu hijau, tanpa angka.

## Perubahan di `detak.sh`
(a) Hapus baris 15-16 (`BATAS_JATAH_5JAM`, `BATAS_JATAH_MINGGU`), dan semua `BATAS_JATAH_5JAM=80` di crontab (opsional, gak ngaruh lagi).

(b) Ganti blok "2. Rem kuota" dan "3. Jaga jatah owner" (baris ±75-87) dengan:
```bash
# 2. Jatah habis (ditolak beneran). Dicek pakai skrip, nol token. Hilang sendiri setelah waktu reset.
HABIS="catatan/.jatah-habis"
if [ -f "$HABIS" ]; then
  read -r _M _R < "$HABIS"
  if [ "$SEKARANG" -lt "${_R:-0}" ]; then
    echo "-- $(date '+%F %T') $NAMA: jatah Claude habis, nunggu sampai $(date -d "@$_R" '+%a %H:%M')" >> "$LOG"
    exit 0
  fi
  rm -f "$HABIS"
  bash notif.sh "✅ Jatah Claude balik" "$NAMA lanjut kerja" 2>/dev/null || true
fi
```
(c) Tambah fungsi ini di dekat `ngalah()` (sebelum dipakai):
```bash
jatah_habis(){  # $1 = epoch reset, 0 kalau gak tahu
  local r="${1:-0}"; [ "$r" -gt "$SEKARANG" ] || r=$(( SEKARANG + 3600 ))
  [ -f catatan/.jatah-habis ] || bash notif.sh "⏸️ Jatah Claude habis" "Kantor berhenti otomatis, lanjut sendiri sekitar $(date -d "@$r" '+%a %H:%M')" 2>/dev/null || true
  echo "$SEKARANG $r" > catatan/.jatah-habis
}
```
(d) Di blok akhir (setelah `claude -p`): hapus `echo "$J5 $R5 $J7 $R7" > catatan/.jatah`. Ganti
`[ "$ST" = "rejected" ] && touch "$REM"` dengan:
```bash
[ "$ST" = "rejected" ] && jatah_habis "$(jq -r '.resetsAt // 0' <<<"$BATAS")"
```
dan dua baris `... && touch "$REM"` yang cocokkan teks "usage limit" jadi `... && jatah_habis 0`.
(Baca `J5`/`J7` buat ringkasan log boleh dipertahankan.)

(e) Laporan baris ±141: ganti cek `$REM` dengan `[ -f catatan/.jatah-habis ]`, dan kata "jatah Claude terakhir" boleh dibuang.

## Perubahan di dashboard
`dashboard/server.mjs`:
- `jatah()` (baris 294): ganti isinya jadi
```js
function jatah() {
  const [mulai, reset] = bacaAman(path.join(K, 'catatan/.jatah-habis')).trim().split(/\s+/).map(Number);
  if (!Number.isFinite(reset) || Date.now() / 1000 >= reset) return null;
  return { habis: true, sampai: new Intl.DateTimeFormat(lokal(), { timeZone: TZ, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(reset * 1000)) };
}
```
- `lampu()` (baris ±368): buang `batang` dan dua `<dt>` angka. `level = j ? 'merah' : 'hijau'`. Isi popover cukup
  `${j ? tx('db.lampu.habis', { kapan: esc(j.sampai) }) : tx('db.lampu.aman')}`. `label` = `j ? tx('db.lampu.habisLabel') : ''` (kosong = cuma titik).
- Hapus `lampu` bila `level === 'mati'` sudah gak ada (gak ada lagi state tanpa data).
- Teks baru di `dashboard/bahasa/{id,en,ms}/dashboard.json`: `db.lampu.habis`, `db.lampu.habisLabel`, `db.lampu.aman`.
  id: "Jatah Claude habis. Lanjut otomatis {kapan}." / "Jatah habis" / "Jatah Claude aman."
  Kunci lama (`labelAngka`, `limaJam`, `mingguan`, `balikPenuh`, `dariDetak`, `belumAda`) bisa dihapus.
- CSS `.jatah*` di `dashboard/aset/gaya.css` (baris 79-82) boleh dihapus.
- Komentar baris 181 yang nyebut "Jaga jatah ... di detak.sh" diperbarui.

## Setelah dipasang
- Hapus `catatan/.jatah` dan `catatan/.rem-*`.
- Tes tanpa token: `echo "$(date +%s) $(( $(date +%s) + 120 ))" > catatan/.jatah-habis`, lihat dashboard (lampu merah), tunggu 2 menit lalu
  jalankan `bash detak.sh sari sosmed` (harus hapus file + notif "balik").
- T-08 jangan diparkir sebelum 03.00 (sudah ditulis di aturannya). Cron 02.55 yang ngejalanin ulang tetap dipakai.

## Peringatan
`detak.sh` bawaan Kit (`ref f277d9...`). Update Kit bisa nimpa perubahan ini. Sampaikan ke pembuat Kit.
