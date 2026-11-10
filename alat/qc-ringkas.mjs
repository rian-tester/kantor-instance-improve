// KD-170: ringkasan qc.json hasil `node carousel/render.mjs` dalam beberapa baris, biar agen gak nulis `python3 -c`
// sendiri buat bacanya (kode bebas = owner ditanya izin). Cuma baca berkas bernama qc.json di dalam folder kantor.
// Pakai: node alat/qc-ringkas.mjs hasil/carousel-<task>/qc.json
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const MAKS = 40;
const potong = (s, n) => { const t = String(s ?? '').replace(/\s+/g, ' ').trim(); return t.length > n ? `${t.slice(0, n - 1)}…` : t; };

// Satu baris per temuan: "slide 2 (34 kata): font_kecil "Harga mulai" (18px (min 24))".
export function barisTemuan(qc) {
  const baris = [];
  for (const g of qc.galat_halaman || []) baris.push(`halaman: ${potong(g, 160)}`);
  for (const s of qc.slide || []) {
    for (const t of s.temuan || []) {
      const teks = potong(t.teks, 60); const nilai = potong(t.nilai, 80);
      baris.push(`slide ${s.slide} (${s.kata ?? '?'} kata): ${t.jenis || 'temuan'}${teks ? ` "${teks}"` : ''}${nilai ? ` (${nilai})` : ''}`);
    }
  }
  return baris;
}

export function ringkasQc(qc, { maks = MAKS } = {}) {
  const gerak = (qc.animasi || []).filter((a) => a.gerak).length;
  const total = Number.isFinite(qc.total_temuan) ? qc.total_temuan : barisTemuan(qc).length;
  const out = [`QC carousel: ${qc.jumlah_slide ?? (qc.slide || []).length} slide, ${total} temuan, gerak ${gerak}/${(qc.animasi || []).length}`];
  const kata = (qc.slide || []).map((s) => `${s.slide}:${s.kata ?? '?'}`).join(' ');
  if (kata) out.push(`kata per slide: ${kata}`);
  const baris = barisTemuan(qc);
  out.push(...baris.slice(0, maks));
  if (baris.length > maks) out.push(`… ${baris.length - maks} temuan lagi (lihat qc.json)`);
  if (!baris.length) out.push('Mesin nol temuan. Tetap buka PNG/strip-nya buat cek mata (kontras di atas foto, gerak).');
  return out;
}

// Jalur aman: wajib bernama qc.json, di dalam folder kantor (cwd), bukan symlink ke luar.
export function jalurAman(arg, akar = process.cwd()) {
  if (!arg) throw new Error('Pakai: node alat/qc-ringkas.mjs hasil/carousel-<task>/qc.json');
  const j = path.resolve(akar, String(arg));
  if (path.basename(j) !== 'qc.json') throw new Error('Cuma bisa baca berkas qc.json hasil render carousel.');
  const r = fs.realpathSync(j); const a = fs.realpathSync(akar);
  if (r !== a && !r.startsWith(a + path.sep)) throw new Error('qc.json harus di dalam folder kantor.');
  return r;
}

if (process.argv[1] && import.meta.url === pathToFileURL(fs.realpathSync(process.argv[1])).href) {
  try {
    const qc = JSON.parse(fs.readFileSync(jalurAman(process.argv[2]), 'utf8'));
    console.log(ringkasQc(qc).join('\n'));
    if ((qc.total_temuan || 0) > 0) process.exitCode = 1;
  } catch (e) {
    console.error(e.code === 'ENOENT' ? 'qc.json gak ketemu. Jalankan dulu node carousel/render.mjs <index.html> <folder-hasil>.' : e.message);
    process.exitCode = 2;
  }
}
