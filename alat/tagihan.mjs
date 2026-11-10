#!/usr/bin/env node
// Lembur.id: daftar penawaran & invoice (tagihan/daftar.csv, diisi dokumen/render.mjs). Gak bikin PDF, cuma ngurus
// status & piutang. Pakai (dari folder kantor):
//   node alat/tagihan.mjs daftar [--status draf|terkirim|lunas|batal] [--jenis invoice|penawaran]
//   node alat/tagihan.mjs status INV-202610-001 terkirim|lunas|batal|diterima [--tanggal 2026-10-09]
//   node alat/tagihan.mjs telat                → invoice terkirim yang lewat jatuh tempo, umurnya, & total piutang
//   node alat/tagihan.mjs rekap                → piutang, lunas bulan ini, penawaran yang belum dijawab klien
// "diterima" = penawaran disetujui klien (abis itu bikin invoice-nya, isi "dari": nomor penawaran).
import fs from 'node:fs';
import path from 'node:path';

const K = process.env.KANTOR || process.cwd();
const DAFTAR = path.join(K, 'tagihan/daftar.csv');
const KOLOM = ['nomor', 'jenis', 'tanggal', 'klien', 'total', 'batas', 'status', 'file', 'dari', 'lunas'];
const arg = process.argv.slice(2);
const ambil = (k) => { const i = arg.indexOf(k); return i >= 0 ? arg[i + 1] : undefined; };
const gagal = (m) => { console.error(`❌ ${m}`); process.exit(1); };
const rupiah = (n) => `Rp${Math.round(Number(n) || 0).toLocaleString('id-ID')}`;
const hariIni = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
const umur = (t) => Math.round((Date.parse(`${hariIni}T00:00:00Z`) - Date.parse(`${t}T00:00:00Z`)) / 86400000);
const sel = (x) => (/[",\n]/.test(String(x)) ? `"${String(x).replace(/"/g, '""')}"` : String(x));

function baca() {
  if (!fs.existsSync(DAFTAR)) return [];
  return fs.readFileSync(DAFTAR, 'utf8').trim().split('\n').slice(1).filter(Boolean).map((b) => {
    const kol = []; let s = ''; let q = false;
    for (let i = 0; i < b.length; i++) { const c = b[i]; if (q) { if (c === '"' && b[i + 1] === '"') { s += '"'; i++; } else if (c === '"') q = false; else s += c; } else if (c === '"') q = true; else if (c === ',') { kol.push(s); s = ''; } else s += c; }
    kol.push(s);
    return Object.fromEntries(KOLOM.map((k, i) => [k, kol[i] ?? '']));
  });
}
const tulis = (data) => {
  const tmp = `${DAFTAR}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, `${KOLOM.join(',')}\n${data.map((r) => KOLOM.map((k) => sel(r[k] ?? '')).join(',')).join('\n')}\n`);
  fs.renameSync(tmp, DAFTAR);
};
const tabel = (xs) => {
  console.log('| nomor | jenis | tanggal | klien | total | batas | status |\n|---|---|---|---|---|---|---|');
  for (const r of xs) console.log(`| ${r.nomor} | ${r.jenis} | ${r.tanggal} | ${r.klien} | ${rupiah(r.total)} | ${r.batas} | ${r.status}${r.lunas ? ` ${r.lunas}` : ''} |`);
};

const data = baca();
const perintah = arg[0];
if (perintah === 'daftar') {
  const pilih = data.filter((r) => (!ambil('--status') || r.status === ambil('--status')) && (!ambil('--jenis') || r.jenis === ambil('--jenis')));
  tabel(pilih);
  console.log(`\n${pilih.length} dokumen.`);
} else if (perintah === 'status') {
  const [, nomor, status] = arg;
  const r = data.find((x) => x.nomor === nomor);
  if (!r) gagal(`Nomor ${nomor || '(kosong)'} gak ada. Liat: node alat/tagihan.mjs daftar`);
  const boleh = r.jenis === 'invoice' ? ['draf', 'terkirim', 'lunas', 'batal'] : ['draf', 'terkirim', 'diterima', 'batal'];
  if (!boleh.includes(status)) gagal(`Status ${r.jenis} cuma: ${boleh.join(', ')}.`);
  r.status = status;
  r.lunas = status === 'lunas' ? (ambil('--tanggal') || hariIni) : '';
  tulis(data);
  console.log(`✅ ${nomor} sekarang ${status}${r.lunas ? ` (${r.lunas})` : ''}.`);
  if (status === 'lunas') console.log(`   Ada buku kas? Catat pemasukannya: node alat/kas.mjs catat --tanggal ${r.lunas} --jenis masuk --kategori penjualan --jumlah ${r.total} --ket "${nomor} ${r.klien}" --sumber ${nomor}`);
} else if (perintah === 'telat') {
  const telat = data.filter((r) => r.jenis === 'invoice' && r.status === 'terkirim' && r.batas < hariIni).sort((a, b) => a.batas.localeCompare(b.batas));
  if (!telat.length) { console.log('Gak ada invoice yang telat.'); process.exit(0); }
  console.log('| nomor | klien | total | jatuh tempo | telat |\n|---|---|---|---|---|');
  for (const r of telat) console.log(`| ${r.nomor} | ${r.klien} | ${rupiah(r.total)} | ${r.batas} | ${umur(r.batas)} hari |`);
  console.log(`\n${telat.length} invoice telat, total ${rupiah(telat.reduce((a, r) => a + Number(r.total), 0))}.`);
} else if (perintah === 'rekap') {
  const piutang = data.filter((r) => r.jenis === 'invoice' && r.status === 'terkirim');
  const telat = piutang.filter((r) => r.batas < hariIni);
  const bulan = hariIni.slice(0, 7);
  const lunas = data.filter((r) => r.jenis === 'invoice' && r.status === 'lunas' && r.lunas.startsWith(bulan));
  const nunggu = data.filter((r) => r.jenis === 'penawaran' && r.status === 'terkirim');
  const draf = data.filter((r) => r.status === 'draf');
  const jml = (xs) => rupiah(xs.reduce((a, r) => a + Number(r.total), 0));
  console.log(`**Rekap tagihan ${hariIni}** (sumber: tagihan/daftar.csv, dihitung pakai alat/tagihan.mjs)`);
  console.log(`- Piutang (invoice terkirim, belum lunas): ${piutang.length} invoice, ${jml(piutang)}`);
  console.log(`- ⚠️ Telat bayar: ${telat.length} invoice, ${jml(telat)}${telat.length ? ` (${telat.map((r) => `${r.nomor} ${umur(r.batas)} hari`).join(', ')})` : ''}`);
  console.log(`- Lunas bulan ini: ${lunas.length} invoice, ${jml(lunas)}`);
  console.log(`- Penawaran nunggu jawaban klien: ${nunggu.length} (${jml(nunggu)})`);
  console.log(`- Masih draf (belum dikirim owner): ${draf.length}${draf.length ? ` (${draf.map((r) => r.nomor).join(', ')})` : ''}`);
} else {
  console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').filter((b) => b.startsWith('//')).slice(0, 8).join('\n'));
  process.exit(perintah ? 1 : 0);
}
