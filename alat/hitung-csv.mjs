#!/usr/bin/env node
// Lembur.id: hitung isi CSV pakai skrip, biar angka rekap gak ngandelin hitungan kepala AI.
// Pakai (dari folder kantor):
//   node alat/hitung-csv.mjs <file.csv> --info
//   node alat/hitung-csv.mjs <file.csv> --jumlah total --kelompok produk --urut total
//   node alat/hitung-csv.mjs <file.csv> --hitung --kelompok status_kirim --filter status_kirim~belum
// --jumlah  kolom angka yang dijumlah (boleh lebih dari satu, pisah koma); keluar juga rata-ratanya
//           (--titik-desimal / --titik-ribuan: paksa arti titik di kolom jumlah kalau dibaca salah)
// --hitung  cuma ngitung baris
// --kelompok kolom buat dikelompokin (mis. produk); --filter kolom=nilai (sama persis) atau kolom~nilai (mengandung),
//            boleh berkali-kali, gak peka huruf besar
// --urut kolom hasil buat ngurutin dari yang terbesar (bawaan: kolom jumlah pertama / banyak baris)
// --tampil kolom1,kolom2 nampilin baris yang cocok (maks 50), mis. nomor pesanan yang belum dikirim
// Angka "Rp18.000", "18.000", "1.234,56", "1,234.56" kebaca. Pemisah CSV koma atau titik koma dideteksi sendiri.
// Titik: "12.345" itu ambigu (ribuan = 12345, atau desimal = 12,345). Diputuskan PER KOLOM dari sel-sel lain di kolom itu (mis. "0.576", "7.5", "372350.576" = titik desimal;
// "1.234.567", "Rp18.000", "1.234,56" = titik ribuan). Gak ada bukti = dibaca ribuan (kebiasaan Indonesia) + peringatan. Paksa: --titik-desimal atau --titik-ribuan.
import fs from 'node:fs';

const arg = process.argv.slice(2);
const file = arg.find((a) => !a.startsWith('--') && !arg[arg.indexOf(a) - 1]?.match(/^--(jumlah|kelompok|filter|urut|tampil)$/));
const ambil = (k) => { const i = arg.indexOf(k); return i >= 0 ? arg[i + 1] : undefined; };
const semua = (k) => arg.flatMap((a, i) => (a === k ? [arg[i + 1]] : []));
if (!file || !fs.existsSync(file)) { console.error('Pakai: node alat/hitung-csv.mjs <file.csv> [--info] [--jumlah kolom] [--hitung] [--kelompok kolom] [--filter kolom=nilai]'); process.exit(1); }

const teks = fs.readFileSync(file, 'utf8').replace(/^﻿/, '');
const barisPertama = teks.split('\n')[0];
const pemisah = (barisPertama.match(/;/g) || []).length > (barisPertama.match(/,/g) || []).length ? ';' : ',';

function bacaCsv(s) {
  const baris = []; let kolom = []; let isi = ''; let kutip = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (kutip) {
      if (c === '"' && s[i + 1] === '"') { isi += '"'; i++; } else if (c === '"') kutip = false; else isi += c;
    } else if (c === '"') kutip = true;
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

// "Rp18.000" → 18000, "1.234,56" → 1234.56, "1,234.56" → 1234.56, "12,5" → 12.5. mode = arti titik tunggal 3 digit ("12.345"): 'desimal' → 12,345; selain itu ribuan → 12345.
const bersih = (x) => String(x ?? '').replace(/[^\d.,-]/g, '');
const TIGA = /^-?\d{1,3}\.\d{3}$/; // satu titik + tepat 3 digit di belakang, 1–3 digit di depan: ambigu
function angka(x, mode = 'ribuan') {
  let s = bersih(x);
  if (!s || s === '-') return NaN;
  const titik = s.lastIndexOf('.'); const koma = s.lastIndexOf(',');
  if (titik >= 0 && koma >= 0) s = koma > titik ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  else if (koma >= 0) s = /,\d{3}$/.test(s) && !/,\d{1,2}$/.test(s) ? s.replace(/,/g, '') : s.replace(',', '.');
  else if (titik >= 0 && /^-?\d{1,3}(\.\d{3}){2,}$/.test(s)) s = s.replace(/\./g, '');
  else if (titik >= 0 && TIGA.test(s) && mode !== 'desimal') s = s.replace(/\./g, '');
  return Number(s);
}
// Bukti arti titik dari SATU sel: 'desimal' | 'ribuan' | null (gak bisa dipastikan).
function buktiTitik(x) {
  const mentah = String(x ?? ''); const s = bersih(mentah);
  const titik = s.lastIndexOf('.'); const koma = s.lastIndexOf(',');
  if (titik < 0) return null;
  if (koma >= 0) return koma > titik ? 'ribuan' : 'desimal';           // "1.234,56" / "1,234.56"
  if (/^-?\d{1,3}(\.\d{3}){2,}$/.test(s)) return 'ribuan';            // "1.234.567"
  if (TIGA.test(s)) return /rp/i.test(mentah) ? 'ribuan' : /^-?0\./.test(s) ? 'desimal' : null; // "Rp18.000" ribuan, "0.576" desimal, "12.345" ambigu
  if (/^-?\d+\.\d+$/.test(s)) return 'desimal';                       // "7.5", "12.34", "372350.576", "1.2345"
  return null;
}
// Arti titik per kolom: 'desimal' | 'ribuan' | 'campur' (dua-duanya ada) | 'ambigu' (gak ada bukti, dibaca ribuan + peringatan).
function modeKolom(nilai) {
  let des = false; let rib = false;
  for (const v of nilai) { const b = buktiTitik(v); if (b === 'desimal') des = true; else if (b === 'ribuan') rib = true; if (des && rib) break; }
  return des && rib ? 'campur' : des ? 'desimal' : rib ? 'ribuan' : 'ambigu';
}
const rupiah = (n) => (Number.isInteger(n) ? n.toLocaleString('id-ID') : n.toLocaleString('id-ID', { maximumFractionDigits: 2 }));

const [kepala, ...data] = bacaCsv(teks);
const idx = (nama) => {
  const i = kepala.findIndex((k) => k.trim().toLowerCase() === String(nama).trim().toLowerCase());
  if (i < 0) { console.error(`Kolom "${nama}" gak ada. Kolom yang ada: ${kepala.join(', ')}`); process.exit(1); }
  return i;
};

if (arg.includes('--info') || arg.length === 1) {
  console.log(`File: ${file}\nPemisah: "${pemisah}"\nBaris data: ${data.length}\nKolom (${kepala.length}): ${kepala.join(' | ')}`);
  for (const b of data.slice(0, 3)) console.log(`  contoh: ${b.join(' | ')}`);
  process.exit(0);
}

let pilih = data;
for (const f of semua('--filter')) {
  const m = f.match(/^([^=~]+)([=~])(.*)$/);
  if (!m) { console.error(`Filter "${f}" salah. Contoh: --filter status=dikirim atau --filter status~belum`); process.exit(1); }
  const i = idx(m[1]); const nilai = m[3].trim().toLowerCase();
  pilih = pilih.filter((b) => { const x = String(b[i] ?? '').trim().toLowerCase(); return m[2] === '=' ? x === nilai : x.includes(nilai); });
}
const kolomJumlah = (ambil('--jumlah') || '').split(',').map((x) => x.trim()).filter(Boolean);
const iJumlah = kolomJumlah.map(idx);
// KD-151: arti titik diputuskan per kolom dari SELURUH baris (bukan cuma yang lolos filter), kecuali dipaksa lewat --titik-desimal / --titik-ribuan.
const paksa = arg.includes('--titik-desimal') ? 'desimal' : arg.includes('--titik-ribuan') ? 'ribuan' : '';
const modeJumlah = iJumlah.map((i) => paksa || modeKolom(data.map((b) => b[i])));
const iKelompok = ambil('--kelompok') ? idx(ambil('--kelompok')) : -1;

const grup = new Map();
const gagal = [];
for (const b of pilih) {
  const g = iKelompok >= 0 ? String(b[iKelompok] ?? '').trim() || '(kosong)' : 'Semua';
  if (!grup.has(g)) grup.set(g, { baris: 0, jumlah: iJumlah.map(() => 0) });
  const x = grup.get(g); x.baris++;
  iJumlah.forEach((i, j) => { const n = angka(b[i], modeJumlah[j] === 'desimal' ? 'desimal' : 'ribuan'); if (Number.isNaN(n)) gagal.push(`${kolomJumlah[j]}="${b[i]}"`); else x.jumlah[j] += n; });
}

const urut = ambil('--urut');
const kunci = urut && kolomJumlah.includes(urut) ? (x) => x.jumlah[kolomJumlah.indexOf(urut)] : kolomJumlah.length && !(urut === 'baris') ? (x) => x.jumlah[0] : (x) => x.baris;
const hasil = [...grup.entries()].sort((a, b) => kunci(b[1]) - kunci(a[1]));
const judul = [iKelompok >= 0 ? kepala[iKelompok] : 'Kelompok', 'Baris', ...kolomJumlah.flatMap((k) => [`Jumlah ${k}`, `Rata-rata ${k}`])];
console.log(`Sumber: ${file}${semua('--filter').length ? ` (filter: ${semua('--filter').join(', ')})` : ''}`);
console.log(`| ${judul.join(' | ')} |\n|${judul.map(() => '---').join('|')}|`);
const baris = (sel) => console.log(`| ${sel.join(' | ')} |`);
for (const [g, x] of hasil) baris([g, x.baris, ...x.jumlah.flatMap((n) => [rupiah(n), rupiah(n / x.baris)])]);
if (!hasil.length) console.log('(0 baris cocok sama filter)');
if (grup.size > 1) {
  const tb = hasil.reduce((a, [, x]) => a + x.baris, 0);
  const tj = kolomJumlah.map((_, j) => hasil.reduce((a, [, x]) => a + x.jumlah[j], 0));
  baris(['**Total**', `**${tb}**`, ...tj.flatMap((n) => [`**${rupiah(n)}**`, rupiah(n / tb)])]);
}
if (ambil('--tampil')) {
  const k = ambil('--tampil').split(',').map((x) => x.trim()).filter(Boolean);
  const ik = k.map(idx);
  console.log(`\nBaris yang cocok (${pilih.length}${pilih.length > 50 ? ', 50 pertama' : ''}):\n| ${k.join(' | ')} |\n|${k.map(() => '---').join('|')}|`);
  for (const b of pilih.slice(0, 50)) console.log(`| ${ik.map((i) => String(b[i] ?? '').trim()).join(' | ')} |`);
}
iJumlah.forEach((i, j) => {
  const ambigu = data.filter((b) => TIGA.test(bersih(b[i]))).length;
  if (!paksa && modeJumlah[j] === 'ambigu' && ambigu) console.log(`\n⚠️ Kolom "${kolomJumlah[j]}": ${ambigu} angka berbentuk 12.345 dibaca sebagai ribuan (= 12345) karena gak ada bukti lain di kolom ini. Kalau titik itu sebenarnya desimal (= 12,345), ulangi dengan --titik-desimal.`);
  if (!paksa && modeJumlah[j] === 'campur') console.log(`\n⚠️ Kolom "${kolomJumlah[j]}": format titik campur (ada titik ribuan DAN titik desimal). Angka berbentuk 12.345 dibaca sebagai ribuan; cek hasilnya, atau paksa dengan --titik-desimal / --titik-ribuan.`);
});
if (gagal.length) console.log(`\n⚠️ ${gagal.length} sel gak kebaca sebagai angka (dilewat), mis.: ${gagal.slice(0, 3).join(', ')}`);
