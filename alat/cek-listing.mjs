#!/usr/bin/env node
// Lembur.id: cek file listing marketplace sebelum dikasih ke owner. Ngecek panjang judul & deskripsi, kata yang
// rawan ditolak marketplace / nyalahin aturan brand, judul kembar, keyword diulang-ulang, emoji di judul, dan harga
// yang gak ada di brand/fakta.md. Pakai (dari folder kantor):
//   node alat/cek-listing.mjs hasil/listing-2026-10-05.csv
// Kolom wajib: produk, marketplace, judul, deskripsi. Opsional: harga, variasi, tag.
// Batas karakter bawaan 70 (judul, aman di semua marketplace) & 3000 (deskripsi). Batas asli per marketplace bisa
// diisi Builder di katalog/batas.json: {"judul":{"semua":70,"shopee":120},"deskripsi":{"semua":3000}}.
import fs from 'node:fs';
import path from 'node:path';

const K = process.env.KANTOR || process.cwd();
const file = process.argv[2];
if (!file || !fs.existsSync(file)) { console.error('Pakai: node alat/cek-listing.mjs <listing.csv>'); process.exit(1); }
const teks = fs.readFileSync(file, 'utf8').replace(/^﻿/, '');
const satu = teks.split('\n')[0];
const pemisah = (satu.match(/;/g) || []).length > (satu.match(/,/g) || []).length ? ';' : ',';
function bacaCsv(s) {
  const baris = []; let kolom = []; let isi = ''; let kutip = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (kutip) { if (c === '"' && s[i + 1] === '"') { isi += '"'; i++; } else if (c === '"') kutip = false; else isi += c; }
    else if (c === '"') kutip = true;
    else if (c === pemisah) { kolom.push(isi); isi = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && s[i + 1] === '\n') i++; kolom.push(isi); isi = ''; if (kolom.some((x) => x !== '')) baris.push(kolom); kolom = []; }
    else isi += c;
  }
  kolom.push(isi); if (kolom.some((x) => x !== '')) baris.push(kolom);
  return baris;
}
const [kepala, ...data] = bacaCsv(teks);
const idx = (n) => kepala.findIndex((k) => k.trim().toLowerCase() === n);
const wajib = ['produk', 'marketplace', 'judul', 'deskripsi'];
const kurang = wajib.filter((k) => idx(k) < 0);
if (kurang.length) { console.error(`❌ Kolom wajib gak ada: ${kurang.join(', ')}. Kolom yang ada: ${kepala.join(', ')}`); process.exit(1); }

let batas = {};
try { batas = JSON.parse(fs.readFileSync(path.join(K, 'katalog/batas.json'), 'utf8')); } catch { /* pakai bawaan */ }
const batasDari = (jenis, mp, bawaan) => Number(batas?.[jenis]?.[mp.toLowerCase()] ?? batas?.[jenis]?.semua ?? bawaan);
const RAWAN = ['terbaik', 'termurah', 'terlaris', 'best seller', 'paling murah', 'paling bagus', 'paling enak', 'paling laris', 'nomor 1', 'no.1', 'no 1', '#1', '100% original', 'ori 100', 'dijamin', 'garansi seumur hidup', 'kw', 'replika', 'mirip', 'cod gratis', 'promo gila'];
const fakta = (() => { try { return fs.readFileSync(path.join(K, 'brand/fakta.md'), 'utf8'); } catch { return ''; } })();
const angkaFakta = new Set((fakta.match(/\d[\d.,]*/g) || []).map((x) => x.replace(/\D/g, '')).filter((x) => x.length >= 3));
const emoji = /\p{Extended_Pictographic}/u;

let merah = 0; let kuning = 0;
const judulDipakai = new Map();
console.log('| # | produk | marketplace | judul | deskripsi | catatan |\n|---|---|---|---|---|---|');
data.forEach((b, i) => {
  const g = (k) => String(b[idx(k)] ?? '').trim();
  const mp = g('marketplace') || 'semua';
  const judul = g('judul'); const desk = g('deskripsi'); const harga = idx('harga') >= 0 ? g('harga') : '';
  const bj = batasDari('judul', mp, 70); const bd = batasDari('deskripsi', mp, 3000);
  const catat = [];
  const tanda = (level, m) => { catat.push(`${level} ${m}`); if (level === '❌') merah++; else kuning++; };
  if (!judul) tanda('❌', 'judul kosong');
  else if ([...judul].length > bj) tanda('❌', `judul ${[...judul].length} karakter (batas ${bj})`);
  if (!desk) tanda('❌', 'deskripsi kosong');
  else if ([...desk].length > bd) tanda('❌', `deskripsi ${[...desk].length} karakter (batas ${bd})`);
  else if ([...desk].length < 200) tanda('⚠️', 'deskripsi pendek banget (<200 karakter)');
  const kecil = `${judul} ${desk}`.toLowerCase();
  const kena = RAWAN.filter((k) => new RegExp(`(^|[^a-z0-9])${k.replace(/[.#%]/g, '\\$&')}([^a-z0-9]|$)`).test(kecil));
  if (kena.length) tanda('⚠️', `kata rawan: ${kena.join(', ')}`);
  if (emoji.test(judul)) tanda('⚠️', 'ada emoji di judul (sering ditolak)');
  const huruf = judul.replace(/[^A-Za-z]/g, '');
  if (huruf.length > 10 && huruf.replace(/[^A-Z]/g, '').length / huruf.length > 0.6) tanda('⚠️', 'judul kebanyakan HURUF BESAR');
  const kata = judul.toLowerCase().split(/[^a-z0-9]+/).filter((k) => k.length > 2);
  const ulang = [...new Set(kata.filter((k, j) => kata.indexOf(k) !== j))];
  if (ulang.length) tanda('⚠️', `kata diulang di judul: ${ulang.join(', ')}`);
  const kunci = `${mp}|${judul.toLowerCase()}`;
  if (judul && judulDipakai.has(kunci)) tanda('❌', `judul sama persis kayak baris ${judulDipakai.get(kunci)}`);
  judulDipakai.set(kunci, i + 1);
  if (harga && angkaFakta.size && !angkaFakta.has(harga.replace(/\D/g, ''))) tanda('⚠️', `harga ${harga} gak ketemu di brand/fakta.md`);
  console.log(`| ${i + 1} | ${g('produk')} | ${mp} | ${[...judul].length}/${bj} | ${[...desk].length}/${bd} | ${catat.join('; ') || '✅'} |`);
});
console.log(`\n${data.length} listing: ${merah} ❌ wajib dibenerin, ${kuning} ⚠️ dicek lagi.${merah ? '' : ' Gak ada yang wajib dibenerin.'}`);
process.exit(merah ? 1 : 0);
