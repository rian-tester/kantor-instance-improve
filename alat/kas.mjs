#!/usr/bin/env node
// Lembur.id: buku kas (pemasukan & pengeluaran) di keuangan/kas.csv. Semua angka, total, & laba dihitung skrip ini,
// bukan di kepala AI. Pakai (dari folder kantor):
//   node alat/kas.mjs catat --tanggal 2026-10-04 --jenis keluar --kategori bahan --jumlah 25000 --ket "gas 3 kg" --sumber masuk/keuangan/nota-01.jpg [--ragu]
//   node alat/kas.mjs impor <mutasi.csv> --tanggal <kolom> --ket <kolom> --jumlah <kolom> [--tahun 2026]
//        (atau --masuk <kolom> --keluar <kolom> kalau bank misahin kolom kredit/debit; jenis dari tanda minus atau DB/CR)
//   node alat/kas.mjs kategori --cari "gojek" --jadi transport      → kasih kategori ke baris "belum" yang ketnya cocok
//   node alat/kas.mjs ubah K-0012 [--kategori x] [--jumlah 25000] [--tanggal ..] [--ket ..] [--ragu ya|tidak] [--batal]
//   node alat/kas.mjs rekap --bulan 2026-10                          → laba-rugi bulan itu (+ banding bulan sebelumnya)
//   node alat/kas.mjs daftar --bulan 2026-10 [--kategori x] [--ragu] [--belum]
// Kolom kas.csv: id,tanggal,jenis,kategori,jumlah,keterangan,sumber,ragu. jenis = masuk | keluar | batal.
import fs from 'node:fs';
import path from 'node:path';

const K = process.env.KANTOR || process.cwd();
const FILE = path.join(K, 'keuangan', 'kas.csv');
const KOLOM = ['id', 'tanggal', 'jenis', 'kategori', 'jumlah', 'keterangan', 'sumber', 'ragu'];
const arg = process.argv.slice(2);
const perintah = arg[0];
const ambil = (k) => { const i = arg.indexOf(k); return i >= 0 && arg[i + 1] !== undefined && !arg[i + 1].startsWith('--') ? arg[i + 1] : undefined; };
const ada = (k) => arg.includes(k);
const gagal = (m) => { console.error(`❌ ${m}`); process.exit(1); };
const rupiah = (n) => `Rp${Math.round(n).toLocaleString('id-ID')}`;

// ---------- CSV ----------
function bacaCsv(s, pemisah = ',') {
  const baris = []; let kolom = []; let isi = ''; let kutip = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (kutip) { if (c === '"' && s[i + 1] === '"') { isi += '"'; i++; } else if (c === '"') kutip = false; else isi += c; }
    else if (c === '"') kutip = true;
    else if (c === pemisah) { kolom.push(isi); isi = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && s[i + 1] === '\n') i++;
      kolom.push(isi); isi = '';
      if (kolom.some((x) => x !== '')) baris.push(kolom);
      kolom = [];
    } else isi += c;
  }
  kolom.push(isi);
  if (kolom.some((x) => x !== '')) baris.push(kolom);
  return baris;
}
const sel = (x) => (/[",\n]/.test(String(x)) ? `"${String(x).replace(/"/g, '""')}"` : String(x));
function bacaKas() {
  if (!fs.existsSync(FILE)) return [];
  const [, ...isi] = bacaCsv(fs.readFileSync(FILE, 'utf8'));
  return isi.map((b) => Object.fromEntries(KOLOM.map((k, i) => [k, b[i] ?? ''])));
}
function tulisKas(data) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, `${KOLOM.join(',')}\n${data.map((r) => KOLOM.map((k) => sel(r[k] ?? '')).join(',')).join('\n')}${data.length ? '\n' : ''}`);
  fs.renameSync(tmp, FILE);
}
const idBaru = (data, n = 1) => {
  const maks = data.reduce((m, r) => Math.max(m, Number(String(r.id).replace(/\D/g, '')) || 0), 0);
  return Array.from({ length: n }, (_, i) => `K-${String(maks + i + 1).padStart(4, '0')}`);
};

// "Rp25.000" → 25000, "1.234,56" → 1234.56, "1,234.56" → 1234.56. Ketikan owner: "25rb" → 25000, "1,5jt" → 1500000
// (singkatan cuma buat `catat`/`ubah`; di mutasi bank huruf K/D itu tanda kredit/debit, bukan "ribu").
function angka(x, singkatan = true) {
  const t = String(x ?? '').toLowerCase().trim();
  const kali = !singkatan ? 1 : /\d\s*(jt|juta)\b/.test(t) ? 1e6 : /\d\s*(rb|ribu|k)\b/.test(t) ? 1e3 : 1;
  let s = t.replace(/[^\d.,-]/g, '');
  if (!s || s === '-') return NaN;
  const titik = s.lastIndexOf('.'); const koma = s.lastIndexOf(',');
  if (titik >= 0 && koma >= 0) s = koma > titik ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  else if (koma >= 0) s = /,\d{3}$/.test(s) && !/,\d{1,2}$/.test(s) ? s.replace(/,/g, '') : s.replace(',', '.');
  else if (titik >= 0 && /^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  return Number(s) * kali;
}

const BULAN = { jan: 1, feb: 2, mar: 3, apr: 4, mei: 5, may: 5, jun: 6, jul: 7, agu: 8, agt: 8, aug: 8, sep: 9, okt: 10, oct: 10, nov: 11, des: 12, dec: 12 };
// "2026-10-04", "04/10/2026", "4-10-26", "04/10" (+ --tahun), "4 Okt 2026" → "2026-10-04"
function tanggal(x, tahun) {
  const t = String(x ?? '').trim().toLowerCase();
  let y; let m; let d;
  let r = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (r) [, y, m, d] = r.map(Number);
  else if ((r = t.match(/^(\d{1,2})[/.-](\d{1,2})(?:[/.-](\d{2,4}))?/))) { d = Number(r[1]); m = Number(r[2]); y = r[3] ? Number(r[3]) : Number(tahun); }
  else if ((r = t.match(/^(\d{1,2})\s+([a-z]{3})[a-z]*\.?\s*(\d{4})?/)) && BULAN[r[2]]) { d = Number(r[1]); m = BULAN[r[2]]; y = r[3] ? Number(r[3]) : Number(tahun); }
  else return '';
  if (y < 100) y += 2000;
  if (!y || m < 1 || m > 12 || d < 1 || d > 31) return '';
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
const tahunIni = String(new Date().getFullYear());
const bersih = (s) => String(s ?? '').replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();

// ---------- perintah ----------
if (perintah === 'catat') {
  const tgl = tanggal(ambil('--tanggal'), ambil('--tahun') || tahunIni);
  const jenis = ambil('--jenis');
  const jumlah = Math.abs(angka(ambil('--jumlah')));
  const kategori = bersih(ambil('--kategori') || 'belum').toLowerCase();
  if (!tgl) gagal('--tanggal gak kebaca (pakai 2026-10-04 atau 04/10/2026).');
  if (!['masuk', 'keluar'].includes(jenis)) gagal('--jenis harus masuk atau keluar.');
  if (!Number.isFinite(jumlah) || jumlah <= 0) gagal('--jumlah gak kebaca (mis. 25000 atau "Rp25.000").');
  const data = bacaKas();
  const sumber = bersih(ambil('--sumber'));
  const kembar = data.find((r) => r.jenis === jenis && r.tanggal === tgl && Number(r.jumlah) === jumlah && sumber && r.sumber === sumber);
  if (kembar && !ada('--paksa')) gagal(`Kayaknya udah kecatat: ${kembar.id} (${kembar.tanggal}, ${rupiah(kembar.jumlah)}, ${kembar.sumber}). Beneran beda? tambahin --paksa.`);
  const baru = data.some((r) => r.kategori === kategori) || kategori === 'belum' ? '' : ` (kategori baru: "${kategori}", pastiin sesuai keuangan/kategori.md)`;
  const [id] = idBaru(data);
  data.push({ id, tanggal: tgl, jenis, kategori, jumlah: String(jumlah), keterangan: bersih(ambil('--ket')), sumber, ragu: ada('--ragu') ? 'ya' : '' });
  tulisKas(data);
  console.log(`✅ ${id} ${tgl} ${jenis} ${rupiah(jumlah)} [${kategori}] ${bersih(ambil('--ket'))}${ada('--ragu') ? ' (ditandai ragu)' : ''}${baru}`);
} else if (perintah === 'impor') {
  const fileMasuk = arg[1];
  if (!fileMasuk || !fs.existsSync(fileMasuk)) gagal('Pakai: node alat/kas.mjs impor <mutasi.csv> --tanggal <kolom> --ket <kolom> --jumlah <kolom>');
  const teks = fs.readFileSync(fileMasuk, 'utf8').replace(/^\uFEFF/, '');
  const satu = teks.split('\n')[0];
  const [kepala, ...isi] = bacaCsv(teks, (satu.match(/;/g) || []).length > (satu.match(/,/g) || []).length ? ';' : ',');
  const idx = (nama) => {
    if (!nama) return -1;
    const i = kepala.findIndex((k) => k.trim().toLowerCase() === nama.trim().toLowerCase());
    if (i < 0) gagal(`Kolom "${nama}" gak ada. Kolom yang ada: ${kepala.join(' | ')}`);
    return i;
  };
  const iT = idx(ambil('--tanggal')); const iK = idx(ambil('--ket')); const iJ = idx(ambil('--jumlah'));
  const iM = idx(ambil('--masuk')); const iL = idx(ambil('--keluar'));
  if (iT < 0 || iK < 0 || (iJ < 0 && (iM < 0 || iL < 0))) gagal('Wajib: --tanggal, --ket, dan --jumlah (atau --masuk + --keluar). Liat nama kolomnya pakai: node alat/hitung-csv.mjs <file> --info');
  const data = bacaKas();
  const kunci = new Set(data.map((r) => `${r.tanggal}|${r.jenis}|${Number(r.jumlah)}|${r.keterangan}`));
  const tambah = []; const lewat = []; let kembar = 0;
  for (const [n, b] of isi.entries()) {
    const tgl = tanggal(b[iT], ambil('--tahun') || tahunIni);
    let jenis; let jumlah;
    if (iJ >= 0) {
      const mentah = String(b[iJ] ?? '');
      jumlah = angka(mentah, false);
      jenis = /\b(db|d|debit|debet)\b/i.test(mentah) ? 'keluar' : /\b(cr|k|kr|kredit|credit)\b/i.test(mentah) ? 'masuk' : jumlah < 0 ? 'keluar' : 'masuk';
      jumlah = Math.abs(jumlah);
    } else {
      const m = angka(b[iM], false) || 0; const l = angka(b[iL], false) || 0;
      if (Math.abs(m) > 0) { jenis = 'masuk'; jumlah = Math.abs(m); } else { jenis = 'keluar'; jumlah = Math.abs(l); }
    }
    const ket = bersih(b[iK]).slice(0, 120);
    if (!tgl || !Number.isFinite(jumlah) || jumlah <= 0) { lewat.push(n + 2); continue; }
    const k = `${tgl}|${jenis}|${jumlah}|${ket}`;
    if (kunci.has(k)) { kembar++; continue; }
    kunci.add(k);
    tambah.push({ tanggal: tgl, jenis, kategori: 'belum', jumlah: String(jumlah), keterangan: ket, sumber: path.basename(fileMasuk), ragu: '' });
  }
  const id = idBaru(data, tambah.length);
  tambah.forEach((r, i) => { r.id = id[i]; });
  tulisKas([...data, ...tambah]);
  const masuk = tambah.filter((r) => r.jenis === 'masuk').reduce((a, r) => a + Number(r.jumlah), 0);
  const keluar = tambah.filter((r) => r.jenis === 'keluar').reduce((a, r) => a + Number(r.jumlah), 0);
  console.log(`✅ ${tambah.length} transaksi masuk ke buku kas (masuk ${rupiah(masuk)}, keluar ${rupiah(keluar)}), kategori "belum".`);
  if (kembar) console.log(`↺ ${kembar} baris dilewat karena udah ada di buku kas.`);
  if (lewat.length) console.log(`⚠️ ${lewat.length} baris gak kebaca tanggal/jumlahnya (baris ${lewat.slice(0, 10).join(', ')}${lewat.length > 10 ? ', …' : ''}). Cek manual.`);
  console.log('Berikutnya: kasih kategori pakai `node alat/kas.mjs kategori --cari "<kata>" --jadi <kategori>`.');
} else if (perintah === 'kategori') {
  const cari = bersih(ambil('--cari')).toLowerCase(); const jadi = bersih(ambil('--jadi')).toLowerCase();
  if (!cari || !jadi) gagal('Pakai: node alat/kas.mjs kategori --cari "gojek" --jadi transport');
  const data = bacaKas();
  const kena = data.filter((r) => r.kategori === 'belum' && r.keterangan.toLowerCase().includes(cari) && (!ambil('--jenis') || r.jenis === ambil('--jenis')));
  kena.forEach((r) => { r.kategori = jadi; });
  tulisKas(data);
  console.log(`✅ ${kena.length} transaksi jadi "${jadi}" (${rupiah(kena.reduce((a, r) => a + Number(r.jumlah), 0))}). Sisa "belum": ${data.filter((r) => r.kategori === 'belum' && r.jenis !== 'batal').length}.`);
} else if (perintah === 'ubah') {
  const data = bacaKas();
  const r = data.find((x) => x.id === arg[1]);
  if (!r) gagal(`Baris ${arg[1] || '(kosong)'} gak ada. Liat id-nya pakai: node alat/kas.mjs daftar --bulan YYYY-MM`);
  if (ambil('--kategori')) r.kategori = bersih(ambil('--kategori')).toLowerCase();
  if (ambil('--jumlah')) { const j = Math.abs(angka(ambil('--jumlah'))); if (!(j > 0)) gagal('--jumlah gak kebaca.'); r.jumlah = String(j); }
  if (ambil('--tanggal')) { const t = tanggal(ambil('--tanggal'), tahunIni); if (!t) gagal('--tanggal gak kebaca.'); r.tanggal = t; }
  if (ambil('--ket')) r.keterangan = bersih(ambil('--ket'));
  if (ambil('--ragu')) r.ragu = ambil('--ragu') === 'ya' ? 'ya' : '';
  if (ada('--batal')) r.jenis = 'batal';
  tulisKas(data);
  console.log(`✅ ${r.id} ${r.tanggal} ${r.jenis} ${rupiah(r.jumlah)} [${r.kategori}] ${r.keterangan}${r.ragu ? ' (ragu)' : ''}`);
} else if (perintah === 'rekap' || perintah === 'daftar') {
  const bulan = ambil('--bulan') || new Date().toISOString().slice(0, 7);
  if (!/^\d{4}-\d{2}$/.test(bulan)) gagal('--bulan pakai format 2026-10.');
  const semua = bacaKas().filter((r) => r.jenis !== 'batal');
  const diBulan = (b) => semua.filter((r) => r.tanggal.startsWith(b));
  const ini = diBulan(bulan);
  if (perintah === 'daftar') {
    const pilih = ini.filter((r) => (!ambil('--kategori') || r.kategori === ambil('--kategori').toLowerCase()) && (!ada('--ragu') || r.ragu) && (!ada('--belum') || r.kategori === 'belum'));
    console.log(`| id | tanggal | jenis | kategori | jumlah | keterangan | sumber |\n|---|---|---|---|---|---|---|`);
    for (const r of pilih.slice(0, 200)) console.log(`| ${r.id} | ${r.tanggal} | ${r.jenis} | ${r.kategori}${r.ragu ? ' ⚠️' : ''} | ${rupiah(r.jumlah)} | ${r.keterangan} | ${r.sumber} |`);
    console.log(`\n${pilih.length} transaksi${pilih.length > 200 ? ' (ditampilin 200)' : ''}.`);
    process.exit(0);
  }
  const total = (xs, j) => xs.filter((r) => r.jenis === j).reduce((a, r) => a + Number(r.jumlah), 0);
  const perKat = (xs, j) => Object.entries(xs.filter((r) => r.jenis === j).reduce((a, r) => ({ ...a, [r.kategori]: (a[r.kategori] || 0) + Number(r.jumlah) }), {})).sort((a, b) => b[1] - a[1]);
  const m = total(ini, 'masuk'); const k = total(ini, 'keluar');
  const [y, mo] = bulan.split('-').map(Number);
  const lalu = `${mo === 1 ? y - 1 : y}-${String(mo === 1 ? 12 : mo - 1).padStart(2, '0')}`;
  const sebelum = diBulan(lalu); const m0 = total(sebelum, 'masuk'); const k0 = total(sebelum, 'keluar');
  const persen = (a, b) => (b ? `${a >= b ? '+' : ''}${Math.round(((a - b) / Math.abs(b)) * 100)}%` : '-');
  console.log(`**Laba-rugi ${bulan}** (sumber: keuangan/kas.csv, ${ini.length} transaksi, dihitung pakai alat/kas.mjs)\n`);
  console.log(`| | ${bulan} | ${lalu} | beda |\n|---|---|---|---|`);
  console.log(`| Pemasukan | ${rupiah(m)} | ${rupiah(m0)} | ${persen(m, m0)} |`);
  console.log(`| Pengeluaran | ${rupiah(k)} | ${rupiah(k0)} | ${persen(k, k0)} |`);
  console.log(`| **Laba bersih** | **${rupiah(m - k)}** | ${rupiah(m0 - k0)} | ${persen(m - k, m0 - k0)} |`);
  for (const [j, judul] of [['masuk', 'Pemasukan'], ['keluar', 'Pengeluaran']]) {
    const daftar = perKat(ini, j);
    if (!daftar.length) continue;
    const t = j === 'masuk' ? m : k;
    console.log(`\n${judul} per kategori:\n| kategori | jumlah | porsi |\n|---|---|---|`);
    for (const [kat, n] of daftar) console.log(`| ${kat} | ${rupiah(n)} | ${t ? Math.round((n / t) * 100) : 0}% |`);
  }
  const belum = ini.filter((r) => r.kategori === 'belum'); const ragu = ini.filter((r) => r.ragu);
  if (belum.length) console.log(`\n⚠️ ${belum.length} transaksi belum dikategoriin (${rupiah(belum.reduce((a, r) => a + Number(r.jumlah), 0))}).`);
  if (ragu.length) console.log(`⚠️ ${ragu.length} transaksi ditandai ragu: ${ragu.map((r) => r.id).join(', ')}. Tanyain owner sebelum laporan final.`);
} else {
  console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').filter((b) => b.startsWith('//')).slice(0, 10).join('\n'));
  process.exit(perintah ? 1 : 0);
}
