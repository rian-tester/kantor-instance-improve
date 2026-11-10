#!/usr/bin/env node
// Lembur.id: pindahin titipan yang udah diproses ke folder selesai/ divisinya.
// Pakai (dari folder kantor): node alat/selesai-titipan.mjs kotak-masuk/sosmed/2026-10-05-dari-bima.md
// Cuma bisa mindahin file di kotak-masuk/<divisi>/ ke kotak-masuk/<divisi>/selesai/. Gak bisa ke tempat lain,
// makanya aman dijalanin AI tanpa nanya (beda sama `mv` biasa yang bisa nimpa file apa aja).
import fs from 'node:fs';
import path from 'node:path';

const K = process.env.KANTOR || process.cwd();
const asal = process.argv[2];
const kotak = path.resolve(K, 'kotak-masuk');
const gagal = (m) => { console.error(`❌ ${m}`); process.exit(1); };
if (!asal) gagal('Pakai: node alat/selesai-titipan.mjs kotak-masuk/<divisi>/<file>');
const f = path.resolve(K, asal);
const rel = path.relative(kotak, f).split(path.sep);
if (rel.length !== 2 || rel[0] === '..' || rel[0].startsWith('.') || rel[1].startsWith('.')) gagal('Cuma file langsung di kotak-masuk/<divisi>/ yang bisa dipindah.');
if (!fs.existsSync(f) || !fs.lstatSync(f).isFile()) gagal(`File ${asal} gak ada.`);
const folder = path.join(kotak, rel[0], 'selesai');
fs.mkdirSync(folder, { recursive: true });
let ke = path.join(folder, rel[1]);
for (let i = 2; fs.existsSync(ke); i++) ke = path.join(folder, rel[1].replace(/(\.[^.]*)?$/, `-${i}$1`));
fs.renameSync(f, ke);
console.log(`✅ ${asal} → ${path.relative(K, ke)}`);
