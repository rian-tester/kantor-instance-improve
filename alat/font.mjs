#!/usr/bin/env node
// Lembur.id: unduh font Google Fonts (lisensi OFL/Apache, boleh dipakai komersial) ke web/pratinjau/font/, biar
// web gak bergantung ke server luar & tipografinya dipilih beneran (bukan font bawaan). Cuma ngambil dari
// fonts.googleapis.com & fonts.gstatic.com. Pakai (dari folder kantor):
//   node alat/font.mjs "Fraunces" "Plus Jakarta Sans"            → bobot bawaan 400;600;700
//   node alat/font.mjs "DM Serif Display:400" "Inter:400;500;700"
// Hasil: file .woff2 + web/pratinjau/font/font.css (tinggal <link rel="stylesheet" href="font/font.css">).
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const K = process.env.KANTOR || process.cwd();
const carousel = process.argv.includes('--carousel');
const F = path.join(K, carousel ? 'carousel/font' : 'web/pratinjau/font');
const daftar = process.argv.slice(2).filter(x => x !== '--carousel');
if (!daftar.length) { console.error('Pakai: node alat/font.mjs "Nama Font" ["Nama Font:400;700"]'); process.exit(1); }
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const ambil = (url) => new Promise((ok, gagal) => {
  const u = new URL(url);
  if (!['fonts.googleapis.com', 'fonts.gstatic.com'].includes(u.hostname)) return gagal(new Error(`host ditolak: ${u.hostname}`));
  https.get(u, { headers: { 'User-Agent': UA }, timeout: 20000 }, (res) => {
    if (res.statusCode !== 200) { res.resume(); return gagal(new Error(`${res.statusCode} ${url}`)); }
    const bagian = []; res.on('data', (c) => bagian.push(c)); res.on('end', () => ok(Buffer.concat(bagian)));
  }).on('error', gagal).on('timeout', function () { this.destroy(new Error('timeout')); });
});
fs.mkdirSync(F, { recursive: true });
const cssLama = fs.existsSync(path.join(F, 'font.css')) ? fs.readFileSync(path.join(F, 'font.css'), 'utf8') : '';
let css = cssLama;
for (const isi of daftar) {
  const [nama, bobot = '400;600;700'] = isi.split(':');
  if (!/^[A-Za-z0-9 ]{2,40}$/.test(nama) || !/^[0-9;]{3,40}$/.test(bobot)) { console.error(`❌ "${isi}" gak valid (contoh: "Inter:400;700")`); process.exit(1); }
  const slug = nama.toLowerCase().replace(/\s+/g, '-');
  let sumber;
  try { sumber = (await ambil(`https://fonts.googleapis.com/css2?family=${encodeURIComponent(nama).replace(/%20/g, '+')}:wght@${bobot}&display=swap`)).toString('utf8'); }
  catch (e) { console.error(`❌ ${nama}: ${e.message} (cek ejaan di fonts.google.com, atau bobotnya gak ada)`); process.exit(1); }
  // Ambil subset latin aja (cukup buat bahasa Indonesia), satu file per URL unik.
  const blok = [...sumber.matchAll(/\/\* ([a-z-]+) \*\/\s*(@font-face\s*{[^}]*})/g)].filter((m) => m[1] === 'latin').map((m) => m[2]);
  const sudah = new Map();
  css = css.replace(new RegExp(`/\\* ${slug} \\*/[\\s\\S]*?/\\* akhir ${slug} \\*/\\n?`, 'g'), '');
  let tambah = `/* ${slug} */\n`;
  for (const b of blok) {
    const url = b.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/)?.[1];
    const w = b.match(/font-weight:\s*([\d ]+);/)?.[1]?.trim() || '400';
    const gaya = b.match(/font-style:\s*(\w+)/)?.[1] || 'normal';
    if (!url) continue;
    if (!sudah.has(url)) {
      const file = `${slug}-${w.replace(/\s+/g, '-')}${gaya === 'italic' ? '-italic' : ''}.woff2`;
      fs.writeFileSync(path.join(F, file), await ambil(url));
      sudah.set(url, file);
    }
    tambah += `@font-face { font-family: '${nama}'; font-style: ${gaya}; font-weight: ${w}; font-display: swap; src: url('${sudah.get(url)}') format('woff2'); }\n`;
  }
  tambah += `/* akhir ${slug} */\n`;
  if (!sudah.size) { console.error(`❌ ${nama}: gak ada file latin yang kebaca.`); process.exit(1); }
  css += tambah;
  console.log(`✅ ${nama} (${bobot}): ${[...sudah.values()].join(', ')}`);
}
fs.writeFileSync(path.join(F, 'font.css'), css);
console.log(`Pasang di <head>: <link rel="stylesheet" href="${carousel ? '../../font/font.css' : 'font/font.css'}">  lalu font-family: '${daftar[0].split(':')[0]}', ...`);
console.log('Lisensi: Google Fonts = OFL/Apache, boleh buat web komersial.');
