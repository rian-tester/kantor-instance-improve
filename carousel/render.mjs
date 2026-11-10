// HTML bebas: PNG, HP, lembar kontak, grid profil, strip waktu dan QC.
// Bukan alat video atau template desain. JSON lama hanya lewat --cadangan.
// ref f277d9960f48baca
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
const args = process.argv.slice(2);
const [html, ke = 'hasil/carousel'] = args.filter(x => !x.startsWith('--'));
if (!html) { console.error('Pakai: node carousel/render.mjs <index.html> <folder-hasil>'); process.exit(1); }
if (html.endsWith('.json')) {
  if (!args.includes('--cadangan')) { console.error('Minta Desainer membuat HTML bebas; --cadangan hanya jika kamu memilih template darurat.'); process.exit(1); }
  const r = spawnSync(process.execPath, [new URL('./render-cadangan.mjs', import.meta.url).pathname, html, ke], { stdio: 'inherit' });
  process.exit(r.status ?? 1);
}
if (!fs.existsSync(html) || !fs.statSync(html).isFile()) {
  console.error('HTML belum ada. Minta Desainer membuat carousel/karya/<task>/index.html dahulu.');
  process.exit(1);
}
fs.mkdirSync(ke, { recursive: true });
// Putaran berikutnya tidak boleh menyisakan slide/QC dari render sebelumnya.
for (const name of fs.readdirSync(ke)) {
  if (/^(slide|hp|strip)-\d+\.png$|^(kontak|grid)\.png$|^qc\.json$/.test(name)) fs.rmSync(path.join(ke, name));
}
const b = await chromium.launch({ ...(process.env.CAROUSEL_BROWSER ? { executablePath: process.env.CAROUSEL_BROWSER } : {}) });
try {
const p = await b.newPage({ viewport: { width: 1160, height: 1430 }, deviceScaleFactor: 1 });
const galatHalaman = [];
p.on('pageerror', e => galatHalaman.push(e.message));
p.on('requestfailed', r => galatHalaman.push('gagal muat: ' + r.url()));
await p.route('**/*', r => /^(file:|data:)/.test(r.request().url()) ? r.continue() : r.abort());
await p.goto('file://' + path.resolve(html), { waitUntil: 'load', timeout: 60000 });
await p.evaluate(async () => {
 await document.fonts.ready;
 await Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise(r => { i.onload = i.onerror = r; })));
});
const setelWaktu = t => p.evaluate(t => {
 for (const a of document.getAnimations()) { a.pause(); a.currentTime = t * 1000; }
 for (const s of document.querySelectorAll('svg')) { try { s.pauseAnimations(); s.setCurrentTime(t); } catch {} }
}, t);
const STILL = await p.evaluate(() => Number(document.body.dataset.still) || 3);
await setelWaktu(STILL);
const qc = await p.evaluate(() => {
  const AMAN = 72, MIN = 28, MIN_KECIL = 22;
  const lum = (c) => {
    const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const rgba = (s) => { const m = s.match(/[\d.]+/g) || []; return [+m[0] || 0, +m[1] || 0, +m[2] || 0, m[3] === undefined ? 1 : +m[3]]; };
  const campur = (atas, bawah) => atas.slice(0, 3).map((v, i) => v * atas[3] + bawah[i] * (1 - atas[3]));
  function latar(el) {
    // Warna latar efektif (tumpukan warna semi transparan dari atas ke bawah). Ketemu gambar/gradasi = gak pasti.
    const lapis = [];
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return { pasti: false };
      const c = rgba(cs.backgroundColor);
      if (c[3] > 0) { lapis.push(c); if (c[3] >= 1) break; }
    }
    let hasil = [255, 255, 255];
    for (const c of lapis.reverse()) hasil = campur(c, hasil);
    return { pasti: true, warna: hasil };
  }
  const potong = (a, b) => a.left < b.right - 2 && b.left < a.right - 2 && a.top < b.bottom - 2 && b.top < a.bottom - 2;
  const slides = [...document.querySelectorAll('section.slide')];
  return slides.map((s, i) => {
    const sr = s.getBoundingClientRect();
    const temuan = [];
    if (Math.round(sr.width) !== 1080 || Math.round(sr.height) !== 1350) temuan.push({ jenis: 'ukuran_slide', teks: '', nilai: `${Math.round(sr.width)}×${Math.round(sr.height)}` });
    const teks = [];
    const w = document.createTreeWalker(s, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      if (!n.textContent.trim()) continue;
      const el = n.parentElement;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
      const r = document.createRange(); r.selectNodeContents(n);
      const kotak = [...r.getClientRects()].filter((x) => x.width > 0 && x.height > 0);
      if (!kotak.length) continue;
      const u = kotak.reduce((a, x) => ({ left: Math.min(a.left, x.left), top: Math.min(a.top, x.top), right: Math.max(a.right, x.right), bottom: Math.max(a.bottom, x.bottom) }),
        { left: 1e9, top: 1e9, right: -1e9, bottom: -1e9 });
      const cuplik = n.textContent.trim().slice(0, 40);
      const kecil = !!el.closest('[data-kecil]');
      const bleed = !!el.closest('[data-bleed]');
      const ukuran = parseFloat(cs.fontSize);
      if (ukuran < (kecil ? MIN_KECIL : MIN)) temuan.push({ jenis: 'font_kecil', teks: cuplik, nilai: `${ukuran}px (min ${kecil ? MIN_KECIL : MIN})` });
      // Kotak teks dari Range = area isi font (lebih tinggi dari huruf aslinya), jadi atas/bawah dikasih toleransi 20% ukuran.
      const tv = ukuran * 0.2;
      if (!bleed && (u.left < sr.left + AMAN - 1 || u.right > sr.right - AMAN + 1 || u.top < sr.top + AMAN - tv || u.bottom > sr.bottom - AMAN + tv))
        temuan.push({ jenis: 'luar_area_aman', teks: cuplik, nilai: `kiri ${Math.round(u.left - sr.left)} atas ${Math.round(u.top - sr.top)} kanan ${Math.round(sr.right - u.right)} bawah ${Math.round(sr.bottom - u.bottom)} px` });
      // Kepotong: teks keluar dari kotak leluhur yang motong (overflow hidden/clip), termasuk slide-nya sendiri.
      for (let a = el; a && a !== document.body; a = a.parentElement) {
        const o = getComputedStyle(a);
        if (/(hidden|clip|scroll|auto)/.test(o.overflow + o.overflowX + o.overflowY)) {
          const ar = a.getBoundingClientRect();
          if (u.left < ar.left - 1 || u.right > ar.right + 1 || u.top < ar.top - 1 || u.bottom > ar.bottom + 1) {
            temuan.push({ jenis: 'kepotong', teks: cuplik, nilai: `keluar dari <${a.tagName.toLowerCase()}${a.className ? '.' + String(a.className).split(' ')[0] : ''}>` });
            break;
          }
        }
        if (a === s) break;
      }
      if (el.scrollWidth > el.clientWidth + 2 && /(hidden|clip)/.test(cs.overflowX + cs.overflow))
        temuan.push({ jenis: 'kepotong', teks: cuplik, nilai: 'teks kepanjangan buat kotaknya' });
      const bg = latar(el);
      if (bg.pasti) {
        const c = rgba(cs.color);
        const depan = campur(c, bg.warna);
        const l1 = lum(depan), l2 = lum(bg.warna);
        const rasio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        const besar = ukuran >= 36 || (ukuran >= 28 && +cs.fontWeight >= 700);
        if (rasio < (besar ? 3 : 4.5)) temuan.push({ jenis: 'kontras', teks: cuplik, nilai: `${rasio.toFixed(2)}:1 (min ${besar ? 3 : 4.5})` });
      } else teks.push({ cekManual: true });
      const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
      // fonts.check() nganggep font yang gak terdaftar "aman" (jatuh ke font sistem), jadi dicek langsung di daftar yang kemuat.
      if (!/^(Arial|Helvetica|Georgia|Times New Roman|Verdana|sans-serif|serif|monospace)$/i.test(fam) && ![...document.fonts].some((f) => f.family.replace(/["']/g, '') === fam && f.status === 'loaded'))
        temuan.push({ jenis: 'font_gak_kebaca', teks: cuplik, nilai: fam });
      teks.push({ u, blok: el.closest('p,h1,h2,h3,h4,h5,h6,li,span,div,figcaption,blockquote') || el, cuplik });
    }
    const t = teks.filter((x) => x.u);
    for (let a = 0; a < t.length; a++) for (let c = a + 1; c < t.length; c++) {
      if (t[a].blok === t[c].blok || t[a].blok.contains(t[c].blok) || t[c].blok.contains(t[a].blok)) continue;
      if (potong(t[a].u, t[c].u)) temuan.push({ jenis: 'numpuk', teks: `${t[a].cuplik} ⟷ ${t[c].cuplik}`, nilai: '' });
    }
    for (const img of s.querySelectorAll('img')) {
      const r = img.getBoundingClientRect();
      if (!img.naturalWidth) temuan.push({ jenis: 'gambar_gagal', teks: img.getAttribute('src') || '', nilai: '' });
      else if (img.naturalWidth < r.width * 0.9 && !img.closest('[data-boleh-pecah]'))
        temuan.push({ jenis: 'gambar_pecah', teks: (img.getAttribute('src') || '').slice(-50), nilai: `asli ${img.naturalWidth}px, tampil ${Math.round(r.width)}px` });
    }
    const kata = (s.innerText || '').split(/\s+/).filter((x) => /\w/.test(x)).length;
    const unik = [];
    for (const x of temuan) if (!unik.some((y) => y.jenis === x.jenis && y.teks === x.teks)) unik.push(x);
    const sumber = [...s.querySelectorAll('[data-sumber]')].map(n => {
      const c = getComputedStyle(n), r = n.getBoundingClientRect();
      const line = parseFloat(c.lineHeight) || parseFloat(c.fontSize) * 1.2;
      return { teks: (n.innerText || n.textContent || '').trim(), baris: Math.round(r.height / line) };
    });
    return { slide: i + 1, kata, teks_render: s.innerText, sumber, lebar: Math.round(sr.width), tinggi: Math.round(sr.height), cek_manual_kontras: teks.filter((x) => x.cekManual).length, temuan: unik };
  });
});


const slides = await p.$$('section.slide');
if (!slides.length) galatHalaman.push('Tidak ada section.slide');
const composer = await b.newPage({ deviceScaleFactor: 1 });
await composer.route('**/*', r => r.abort());
const gambar = b => 'data:image/png;base64,' + b.toString('base64');
async function susun(images, file, width, height, columns, iw, ih, gap = 0, crop = false) {
 await composer.setViewportSize({ width, height });
 await composer.setContent('<html><style>*{box-sizing:border-box}body{margin:0;background:#111;display:grid;grid-template-columns:repeat('+columns+','+iw+'px);gap:'+gap+'px;padding:'+gap+'px}img{width:'+iw+'px;height:'+ih+'px;object-fit:'+(crop?'cover':'fill')+'}</style>'+images.map(x=>'<img src="'+gambar(x)+'">').join('')+'</html>');
 await composer.evaluate(() => Promise.all([...document.images].map(i => i.complete ? null : new Promise(r => { i.onload = i.onerror = r; }))));
 await composer.screenshot({ path: path.join(ke, file) });
}
const frames = [], animasi = [];
const gerak = await p.evaluate(() => [...document.querySelectorAll('section.slide')].map(s =>
 document.getAnimations().some(a => a.effect?.target && s.contains(a.effect.target)) || !!s.querySelector('svg animate, svg animateTransform, svg animateMotion')));
for (let i = 0; i < slides.length; i++) {
 const n = String(i + 1).padStart(2, '0');
 await setelWaktu(STILL);
 const buffer = await slides[i].screenshot({ path: path.join(ke, 'slide-'+n+'.png') });
 frames.push(buffer);
 await susun([buffer], 'hp-'+n+'.png', 412, 515, 1, 412, 515);
 const times = [0, .4, .8, 1.5, 3, 5.5], strip = [];
 for (const t of times) { await setelWaktu(t); strip.push(await slides[i].screenshot()); }
 await susun(strip, 'strip-'+n+'.png', 1620, 338, 6, 270, 338);
 animasi.push({ slide: i+1, gerak: gerak[i], strip: 'strip-'+n+'.png', detik_strip: times });
}
if (frames.length) {
 const columns = Math.min(4, frames.length), rows = Math.ceil(frames.length / columns);
 await susun(frames, 'kontak.png', columns * 282 + 12, rows * 350 + 12, columns, 270, 338, 12);
 await susun([frames[0], frames[0], frames[0]], 'grid.png', 412, 183, 3, 136, 181, 1, true);
}
const sha256 = Object.fromEntries(fs.readdirSync(ke).filter(n => /^(slide|hp|strip)-\d+\.png$|^(kontak|grid)\.png$/.test(n)).map(n =>
 [n, crypto.createHash('sha256').update(fs.readFileSync(path.join(ke,n))).digest('hex')]));
const hasil = { jumlah_slide: slides.length, galat_halaman: galatHalaman, slide: qc, detik_still: STILL, animasi, sha256,
 total_temuan: galatHalaman.length + qc.reduce((n,s) => n + s.temuan.length, 0) };
fs.writeFileSync(path.join(ke, 'qc.json'), JSON.stringify(hasil, null, 2));
console.log(JSON.stringify({ jumlah_slide: hasil.jumlah_slide, total_temuan: hasil.total_temuan, gerak: gerak.filter(Boolean).length }));
// KD-170: temuan per slide langsung kecetak (maks 20 baris), biar agen gak nulis `python3 -c` buat baca qc.json.
const pendek = (x, n) => { const t = String(x ?? '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
const barisQc = [...galatHalaman.map(g => 'halaman: ' + pendek(g, 160)),
 ...qc.flatMap(s => s.temuan.map(t => `slide ${s.slide} (${s.kata} kata): ${t.jenis}${pendek(t.teks, 60) ? ` "${pendek(t.teks, 60)}"` : ''}${pendek(t.nilai, 80) ? ` (${pendek(t.nilai, 80)})` : ''}`))];
for (const b of barisQc.slice(0, 20)) console.log(b);
if (barisQc.length > 20) console.log(`… ${barisQc.length - 20} temuan lagi: node alat/qc-ringkas.mjs ${path.relative(process.cwd(), path.join(ke, 'qc.json'))}`);
if (hasil.total_temuan) process.exitCode = 1;
} finally { await b.close(); }
