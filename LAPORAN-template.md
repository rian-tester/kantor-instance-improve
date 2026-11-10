# Laporan ke owner

Dipakai pas owner bilang `laporan`, atau otomatis tiap pagi & malam lewat detak. Simpan di
`hasil/laporan-YYYY-MM-DD-pagi.md` (atau `-malam`). Maks 15 baris: owner bacanya dari HP.

```
# Laporan [pagi/malam] [tanggal] — [nama manajer], divisi [divisi]

## Butuh keputusan kamu (paling atas, biar gak kelewat)
1. T-xx: [pertanyaan] → a) … b) … (rekomendasi: …)

## Udah dikerjain
- T-xx: [1 kalimat] → hasil di hasil/…
- T-xx: …

## Lagi jalan
- T-xx: [sampai mana] · berikutnya: [langkah]

## Nyangkut / perlu diperhatiin
- [task yang gak gerak >3 hari, error, rem kuota kepicu, dst.]

## Pemakaian
- Putaran detak hari ini: [n] dari batas [BATAS_HARIAN] · kena rem kuota: [ya/tidak]
```

Aturan:
- Yang butuh keputusan selalu paling atas.
- Gak ada yang perlu dilaporin di satu bagian → tulis "—", jangan ngarang.
- Angka harus ada sumbernya (file/tanggal).
