// Lembur.id: foto halaman pratinjau website di ukuran HP & laptop, plus cek otomatis yang gampang kelewat mata:
// layar melebar ke samping di HP, gambar gak kemuat, file yang gak ketemu, error JavaScript, teks kekecilan,
// tombol kekecilan buat jempol. Hasilnya di web/foto/ (dibuka Dimas buat dinilai, & tampil di dashboard).
// Pakai (dari folder kantor):  node web/alat/foto.mjs            → semua halaman (maks 6)
//                              node web/alat/foto.mjs tentang.html → satu halaman
// Ada web/share.html (desain gambar share 1200×630)? Sekalian dirender jadi web/pratinjau/gambar/share.jpg.
// Dipasang installer (Node.js + Playwright + Chromium).
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { chromium } from 'playwright';

const K = process.env.KANTOR || process.cwd();
const W = path.join(K, 'web');
const P = path.join(W, 'pratinjau');
const F = path.join(W, 'foto');
const bacaJson = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return {}; } };
if (!fs.existsSync(path.join(P, 'index.html'))) { console.error('❌ web/pratinjau/index.html belum ada.'); process.exit(1); }
const pilih = process.argv[2];
const halaman = (pilih ? [pilih] : fs.readdirSync(P).filter((f) => f.endsWith('.html') && f !== '404.html').sort((a, b) => (a === 'index.html' ? -1 : b === 'index.html' ? 1 : a.localeCompare(b)))).slice(0, 6);
let host = String(bacaJson(path.join(W, 'host.json')).host || '');
if (!host) { try { host = fs.readFileSync(path.join(os.homedir(), '.kantor-alamat'), 'utf8').trim(); } catch { /* lewat file */ } }
let token = ''; try { token = fs.readFileSync(path.join(W, 'pratinjau-token'), 'utf8').trim(); } catch { /* lewat file */ }
// Lewat penyaji situs (persis kayak yang owner liat) kalau ada; kalau gak, buka filenya langsung.
const lewatServer = host && token;
const alamat = (h) => (lewatServer ? `http://pratinjau.${host}/${token}/${h === 'index.html' ? '' : h}` : `file://${path.join(P, h)}`);
fs.rmSync(F, { recursive: true, force: true });
fs.mkdirSync(F, { recursive: true });
const b = await chromium.launch({ args: lewatServer ? [`--host-resolver-rules=MAP pratinjau.${host} 127.0.0.1:${process.env.SITUS_PORT || 7692}`] : [] });
const laporan = [];
let merah = 0;
for (const h of halaman) {
  for (const [nama, lebar, tinggi, hp] of [['hp', 390, 844, true], ['laptop', 1440, 900, false]]) {
    const ctx = await b.newContext({ viewport: { width: lebar, height: tinggi }, deviceScaleFactor: hp ? 2 : 1, isMobile: hp, hasTouch: hp });
    const p = await ctx.newPage();
    const galat = []; const gagal = [];
    p.on('pageerror', (e) => galat.push(e.message));
    p.on('console', (m) => { if (m.type() === 'error') galat.push(m.text()); });
    p.on('requestfailed', (r) => gagal.push(r.url()));
    p.on('response', (r) => { if (r.status() >= 400) gagal.push(`${r.status()} ${r.url()}`); });
    try { await p.goto(alamat(h), { waitUntil: 'networkidle', timeout: 30000 }); } catch (e) { galat.push(`gagal dibuka: ${e.message.split('\n')[0]}`); }
    await p.waitForTimeout(400);
    const cek = await p.evaluate((hp) => {
      const lebarLayar = document.documentElement.clientWidth;
      const melebar = document.documentElement.scrollWidth > lebarLayar + 2;
      const biangLebar = melebar ? [...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > lebarLayar + 2).slice(0, 3).map((e) => `<${e.tagName.toLowerCase()}${e.className && typeof e.className === 'string' ? ` class="${e.className.slice(0, 40)}"` : ''}>`) : [];
      const rusak = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src')).slice(0, 5);
      const kecil = hp ? [...document.querySelectorAll('p, li, a, span, button, td')].filter((e) => e.offsetParent && e.textContent.trim().length > 3 && parseFloat(getComputedStyle(e).fontSize) < 12).length : 0;
      const jempol = hp ? [...document.querySelectorAll('a, button')].filter((e) => { const r = e.getBoundingClientRect(); return e.offsetParent && r.width > 0 && (r.height < 32 || r.width < 32) && getComputedStyle(e).display !== 'inline'; }).length : 0;
      return { melebar, biangLebar, rusak, kecil, jempol, tinggi: document.documentElement.scrollHeight };
    }, hp);
    const file = path.join(F, `${h.replace(/\.html$/, '')}-${nama}.png`);
    await p.screenshot({ path: file, fullPage: true });
    const catat = [];
    if (cek.melebar) { catat.push(`❌ melebar ke samping (biangnya: ${cek.biangLebar.join(', ') || '?'})`); merah++; }
    if (cek.rusak.length) { catat.push(`❌ gambar gak kemuat: ${cek.rusak.join(', ')}`); merah++; }
    if (gagal.length) { catat.push(`❌ file gak ketemu/gagal: ${[...new Set(gagal)].slice(0, 4).join(', ')}`); merah++; }
    if (galat.length) { catat.push(`❌ error: ${galat.slice(0, 3).join(' | ')}`); merah++; }
    if (cek.kecil) catat.push(`⚠️ ${cek.kecil} teks di bawah 12px (susah dibaca di HP)`);
    if (cek.jempol) catat.push(`⚠️ ${cek.jempol} tombol/link lebih kecil dari ±32px (susah dipencet jempol)`);
    laporan.push(`- ${h} (${nama} ${lebar}px, tinggi ${cek.tinggi}px) → ${path.relative(K, file)}${catat.length ? `\n  ${catat.join('\n  ')}` : ' ✅'}`);
    await ctx.close();
  }
}
// Gambar share (og:image) dari web/share.html: dibuka sebagai file biar bisa pakai font/gambar di web/pratinjau/.
const share = path.join(W, 'share.html');
if (fs.existsSync(share)) {
  const ctx = await b.newContext({ viewport: { width: 1200, height: 630 } });
  const p = await ctx.newPage();
  await p.goto(`file://${share}`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.join(P, 'gambar'), { recursive: true });
  await p.screenshot({ path: path.join(P, 'gambar/share.jpg'), type: 'jpeg', quality: 86 });
  fs.copyFileSync(path.join(P, 'gambar/share.jpg'), path.join(F, 'share.jpg'));
  laporan.push('- gambar share 1200×630 → web/pratinjau/gambar/share.jpg (dari web/share.html)');
  await ctx.close();
}
await b.close();
fs.writeFileSync(path.join(F, 'laporan.md'), `# Foto pratinjau ${new Date().toISOString()}\n\n${laporan.join('\n')}\n`);
console.log(laporan.join('\n'));
console.log(`\n${merah ? `${merah} ❌ wajib dibenerin.` : 'Gak ada masalah otomatis.'} Sekarang BUKA tiap foto (Read) dan nilai pakai skill cek-tampilan: rapi? kebaca? kayak template generik?`);
process.exit(merah ? 1 : 0);
