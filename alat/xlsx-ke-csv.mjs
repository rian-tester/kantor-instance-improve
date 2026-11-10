#!/usr/bin/env node
// Lembur.id: ubah file Excel (.xlsx) jadi CSV pakai Node bawaan, tanpa pasang pustaka apa pun.
// Pakai (dari folder kantor):
//   node alat/xlsx-ke-csv.mjs masuk/stok/stok.xlsx --daftar                 → liat nama sheet
//   node alat/xlsx-ke-csv.mjs masuk/stok/stok.xlsx --ke masuk/stok/stok.csv  → sheet pertama jadi CSV
//   node alat/xlsx-ke-csv.mjs laporan.xlsx --sheet "Penjualan" --ke laporan.csv
// Tanggal di Excel kesimpen sebagai angka (mis. 46300); --tanggal <kolom> ngubahnya jadi 2026-10-05.
// File .xls lama (Excel 97) gak bisa: simpen ulang sebagai .xlsx atau CSV dulu.
import fs from 'node:fs';
import zlib from 'node:zlib';

const arg = process.argv.slice(2);
const file = arg[0];
const ambil = (k) => { const i = arg.indexOf(k); return i >= 0 ? arg[i + 1] : undefined; };
if (!file || !fs.existsSync(file)) { console.error('Pakai: node alat/xlsx-ke-csv.mjs <file.xlsx> [--daftar] [--sheet nama|nomor] [--ke file.csv] [--tanggal kolom]'); process.exit(1); }

// xlsx = zip berisi XML. Baca daftar isi zip dari "central directory" di ujung file.
function bacaZip(buf) {
  let e = buf.length - 22;
  while (e >= 0 && buf.readUInt32LE(e) !== 0x06054b50) e--;
  if (e < 0) throw new Error('Ini bukan file .xlsx (bukan zip). File .xls lama: simpen ulang sebagai .xlsx/CSV dulu.');
  const n = buf.readUInt16LE(e + 10);
  let p = buf.readUInt32LE(e + 16);
  const isi = new Map();
  for (let i = 0; i < n; i++) {
    const metode = buf.readUInt16LE(p + 10); const ukuran = buf.readUInt32LE(p + 20);
    const pNama = buf.readUInt16LE(p + 28); const pExtra = buf.readUInt16LE(p + 30); const pKomen = buf.readUInt16LE(p + 32);
    const posisi = buf.readUInt32LE(p + 42); const nama = buf.toString('utf8', p + 46, p + 46 + pNama);
    const mulai = posisi + 30 + buf.readUInt16LE(posisi + 26) + buf.readUInt16LE(posisi + 28);
    const data = buf.subarray(mulai, mulai + ukuran);
    isi.set(nama, () => (metode === 0 ? data : zlib.inflateRawSync(data)).toString('utf8'));
    p += 46 + pNama + pExtra + pKomen;
  }
  return isi;
}

const xml = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&amp;/g, '&');
const atribut = (s, nama) => s.match(new RegExp(`\\b${nama}="([^"]*)"`))?.[1];
const kolomKe = (ref) => [...ref.replace(/\d+/g, '')].reduce((a, c) => a * 26 + c.charCodeAt(0) - 64, 0) - 1;

let zip;
try { zip = bacaZip(fs.readFileSync(file)); } catch (e) { console.error(`❌ ${e.message}`); process.exit(1); }
const baca = (n) => (zip.has(n) ? zip.get(n)() : '');
const buku = baca('xl/workbook.xml');
const rel = Object.fromEntries([...baca('xl/_rels/workbook.xml.rels').matchAll(/<Relationship\b([^>]*)\/?>/g)].map(([, a]) => [atribut(a, 'Id'), atribut(a, 'Target')]));
const sheet = [...buku.matchAll(/<sheet\b([^>]*)\/?>/g)].map(([, a]) => ({ nama: xml(atribut(a, 'name') || ''), target: rel[atribut(a, 'r:id')] }));
if (!sheet.length) { console.error('❌ Sheet gak ketemu di file ini. Bener file .xlsx?'); process.exit(1); }
if (arg.includes('--daftar')) { sheet.forEach((s, i) => console.log(`${i + 1}. ${s.nama}`)); process.exit(0); }

const mau = ambil('--sheet');
const s = mau ? sheet.find((x, i) => x.nama.toLowerCase() === mau.toLowerCase() || String(i + 1) === mau) : sheet[0];
if (!s) { console.error(`Sheet "${mau}" gak ada. Ada: ${sheet.map((x) => x.nama).join(', ')}`); process.exit(1); }
const jalur = s.target.startsWith('/') ? s.target.slice(1) : `xl/${s.target.replace(/^\.\//, '')}`;

const teksBersama = [...baca('xl/sharedStrings.xml').matchAll(/<si>([\s\S]*?)<\/si>/g)].map(([, si]) => xml([...si.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((m) => m[1]).join('')));
const baris = [];
for (const [, r] of baca(jalur).matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
  const isi = [];
  for (const [, a, dalam = ''] of r.matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
    const ref = atribut(a, 'r'); const jenis = atribut(a, 't');
    const v = dalam.match(/<v>([\s\S]*?)<\/v>/)?.[1];
    let nilai = '';
    if (jenis === 's') nilai = teksBersama[Number(v)] ?? '';
    else if (jenis === 'inlineStr') nilai = xml([...dalam.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((m) => m[1]).join(''));
    else if (jenis === 'b') nilai = v === '1' ? 'TRUE' : 'FALSE';
    else nilai = v !== undefined ? xml(v) : '';
    isi[ref ? kolomKe(ref) : isi.length] = nilai;
  }
  baris.push(isi);
}
const lebar = Math.max(0, ...baris.map((b) => b.length));
const kolomTanggal = ambil('--tanggal');
if (kolomTanggal && baris.length) {
  const i = baris[0].findIndex((k) => String(k ?? '').trim().toLowerCase() === kolomTanggal.toLowerCase());
  if (i < 0) { console.error(`Kolom "${kolomTanggal}" gak ada di baris judul.`); process.exit(1); }
  for (const b of baris.slice(1)) {
    const n = Number(b[i]);
    if (b[i] !== '' && Number.isFinite(n)) b[i] = new Date(Math.round((n - 25569) * 86400000)).toISOString().slice(0, n % 1 ? 16 : 10).replace('T', ' ');
  }
}
const sel = (x) => { const t = String(x ?? ''); return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
const csv = `${baris.map((b) => Array.from({ length: lebar }, (_, i) => sel(b[i])).join(',')).join('\n')}\n`;
const ke = ambil('--ke');
if (ke) { fs.writeFileSync(ke, csv); console.log(`Sheet "${s.nama}" → ${ke} (${Math.max(0, baris.length - 1)} baris data, ${lebar} kolom)`); } else process.stdout.write(csv);
