// KD-170 (contoh Aldy 04/11): agen nulis `python3 -c "from PIL import Image …"` buat ngecek logo, dan owner ditanya izin.
// Alat ini ngasih info gambar siap pakai tanpa pustaka tambahan: ukuran, format, mode warna, ada alpha atau nggak, dan
// kotak isi (bagian yang gak transparan, atau yang beda dari warna pojok kalau gak ada alpha). Cuma baca berkas di folder kantor.
// Pakai: node alat/info-gambar.mjs brand/logo.png brand/logo-putih.png
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { pathToFileURL } from 'node:url';

const MAKS_BYTE = 30 * 1024 * 1024;
const MAKS_PIKSEL = 40e6;
const EKSTENSI = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);

export function jalurAman(arg, akar = process.cwd()) {
  const j = path.resolve(akar, String(arg));
  if (!EKSTENSI.has(path.extname(j).toLowerCase())) throw new Error(`${arg}: cuma gambar .png/.jpg/.jpeg/.webp/.gif`);
  const r = fs.realpathSync(j); const a = fs.realpathSync(akar);
  if (r !== a && !r.startsWith(a + path.sep)) throw new Error(`${arg}: harus di dalam folder kantor`);
  const st = fs.statSync(r);
  if (!st.isFile()) throw new Error(`${arg}: bukan berkas biasa`);
  if (st.size > MAKS_BYTE) throw new Error(`${arg}: kegedean (maks 30 MB)`);
  return r;
}

// PNG: baca chunk, inflate IDAT, buang filter per baris → piksel. Bit depth 8 (dan 16, diambil byte atasnya), tanpa interlace.
function bacaPng(buf) {
  let w = 0; let h = 0; let depth = 0; let tipe = 0; let interlace = 0; const idat = []; let plte = null; let trns = null;
  for (let o = 8; o + 8 <= buf.length;) {
    const len = buf.readUInt32BE(o); const jenis = buf.toString('latin1', o + 4, o + 8); const isi = buf.subarray(o + 8, o + 8 + len);
    if (jenis === 'IHDR') { w = isi.readUInt32BE(0); h = isi.readUInt32BE(4); depth = isi[8]; tipe = isi[9]; interlace = isi[12]; }
    else if (jenis === 'PLTE') plte = isi; else if (jenis === 'tRNS') trns = isi; else if (jenis === 'IDAT') idat.push(isi); else if (jenis === 'IEND') break;
    o += 12 + len;
  }
  const kanal = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[tipe];
  const mode = { 0: 'abu', 2: 'RGB', 3: 'palet', 4: 'abu+alpha', 6: 'RGBA' }[tipe] || `tipe ${tipe}`;
  const alpha = tipe === 4 || tipe === 6 || (tipe === 3 && !!trns) || ((tipe === 0 || tipe === 2) && !!trns);
  const info = { format: 'PNG', lebar: w, tinggi: h, mode: `${mode} ${depth}-bit`, alpha };
  if (!kanal || interlace || ![8, 16].includes(depth) || (tipe === 3 && depth !== 8)) return { ...info, catatan: 'kotak isi dilewati (PNG interlaced/bit depth gak umum)' };
  if (w * h > MAKS_PIKSEL) return { ...info, catatan: 'kotak isi dilewati (gambar terlalu besar)' };
  const bpp = kanal * (depth / 8); const baris = w * bpp; const mentah = zlib.inflateSync(Buffer.concat(idat));
  const px = Buffer.alloc(baris * h); let prev = Buffer.alloc(baris);
  for (let y = 0; y < h; y++) {
    const f = mentah[y * (baris + 1)]; const src = mentah.subarray(y * (baris + 1) + 1, (y + 1) * (baris + 1)); const cur = px.subarray(y * baris, (y + 1) * baris);
    for (let x = 0; x < baris; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0; const b = prev[x]; const c = x >= bpp ? prev[x - bpp] : 0; let v = src[x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const p = a + b - c; const pa = Math.abs(p - a); const pb = Math.abs(p - b); const pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      cur[x] = v & 255;
    }
    prev = cur;
  }
  const step = depth / 8;
  const rgba = (x, y) => {
    const i = y * baris + x * bpp; const k = (n) => px[i + n * step];
    if (tipe === 6) return [k(0), k(1), k(2), k(3)];
    if (tipe === 4) return [k(0), k(0), k(0), k(1)];
    if (tipe === 2) return [k(0), k(1), k(2), 255];
    if (tipe === 3) { const n = px[i]; return [plte?.[n * 3] ?? 0, plte?.[n * 3 + 1] ?? 0, plte?.[n * 3 + 2] ?? 0, trns && n < trns.length ? trns[n] : 255]; }
    return [k(0), k(0), k(0), 255];
  };
  return { ...info, kotak: kotakIsi(w, h, rgba, alpha) };
}

// Kotak isi: alpha > 0 kalau ada alpha; kalau gak, piksel yang beda (>16) dari warna pojok kiri atas.
function kotakIsi(w, h, rgba, alpha) {
  const pojok = rgba(0, 0); let x0 = w; let y0 = h; let x1 = -1; let y1 = -1; let transparan = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const p = rgba(x, y);
    const isi = alpha ? p[3] > 0 : Math.max(Math.abs(p[0] - pojok[0]), Math.abs(p[1] - pojok[1]), Math.abs(p[2] - pojok[2])) > 16;
    if (alpha && p[3] === 0) transparan++;
    if (isi) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  if (x1 < 0) return { kosong: true, dasar: alpha ? 'alpha' : 'warna pojok' };
  return { x: x0, y: y0, lebar: x1 - x0 + 1, tinggi: y1 - y0 + 1, dasar: alpha ? 'alpha' : 'warna pojok', ...(alpha ? { transparanPersen: Math.round((transparan / (w * h)) * 100) } : {}) };
}

function bacaJpeg(buf) {
  for (let o = 2; o + 9 < buf.length;) {
    if (buf[o] !== 0xff) { o++; continue; }
    const m = buf[o + 1]; if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { o += 2; continue; }
    const len = buf.readUInt16BE(o + 2);
    if ((m >= 0xc0 && m <= 0xcf) && ![0xc4, 0xc8, 0xcc].includes(m)) {
      const n = buf[o + 9];
      return { format: 'JPEG', lebar: buf.readUInt16BE(o + 7), tinggi: buf.readUInt16BE(o + 5), mode: n === 1 ? 'abu' : n === 4 ? 'CMYK' : 'RGB', alpha: false, catatan: 'kotak isi cuma buat PNG' };
    }
    o += 2 + len;
  }
  throw new Error('JPEG gak kebaca');
}

function bacaWebp(buf) {
  const c = buf.toString('latin1', 12, 16);
  if (c === 'VP8X') return { format: 'WebP', lebar: 1 + buf.readUIntLE(24, 3), tinggi: 1 + buf.readUIntLE(27, 3), mode: 'VP8X', alpha: !!(buf[20] & 0x10), catatan: 'kotak isi cuma buat PNG' };
  if (c === 'VP8L') { const b = buf.readUInt32LE(21); return { format: 'WebP', lebar: (b & 0x3fff) + 1, tinggi: ((b >> 14) & 0x3fff) + 1, mode: 'lossless', alpha: !!((b >> 28) & 1), catatan: 'kotak isi cuma buat PNG' }; }
  if (c === 'VP8 ') return { format: 'WebP', lebar: buf.readUInt16LE(26) & 0x3fff, tinggi: buf.readUInt16LE(28) & 0x3fff, mode: 'lossy', alpha: false, catatan: 'kotak isi cuma buat PNG' };
  throw new Error('WebP gak kebaca');
}

export function infoGambar(buf) {
  if (buf.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return bacaPng(buf);
  if (buf[0] === 0xff && buf[1] === 0xd8) return bacaJpeg(buf);
  if (buf.toString('latin1', 0, 4) === 'RIFF' && buf.toString('latin1', 8, 12) === 'WEBP') return bacaWebp(buf);
  if (buf.toString('latin1', 0, 3) === 'GIF') return { format: 'GIF', lebar: buf.readUInt16LE(6), tinggi: buf.readUInt16LE(8), mode: 'palet', alpha: null, catatan: 'kotak isi cuma buat PNG' };
  throw new Error('Isinya bukan gambar PNG/JPEG/WebP/GIF');
}

export function baris(nama, i) {
  const k = i.kotak;
  const kotak = !k ? (i.catatan || '') : k.kosong ? `isi KOSONG (semua ${k.dasar === 'alpha' ? 'transparan' : 'sewarna pojok'})`
    : `isi x=${k.x} y=${k.y} ${k.lebar}×${k.tinggi} (dari ${k.dasar}${k.transparanPersen !== undefined ? `, ${k.transparanPersen}% transparan` : ''})`;
  return `${nama}: ${i.lebar}×${i.tinggi} ${i.format} ${i.mode}, alpha ${i.alpha === null ? '?' : i.alpha ? 'ada' : 'gak ada'}${kotak ? `, ${kotak}` : ''}`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(fs.realpathSync(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (!args.length) { console.error('Pakai: node alat/info-gambar.mjs <gambar> [gambar lain…]'); process.exitCode = 2; }
  for (const a of args.slice(0, 30)) {
    try { console.log(baris(a, infoGambar(fs.readFileSync(jalurAman(a))))); }
    catch (e) { console.log(`${a}: ${e.code === 'ENOENT' ? 'gak ketemu' : e.message.replace(`${a}: `, '')}`); process.exitCode = 1; }
  }
}
