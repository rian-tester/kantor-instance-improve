#!/usr/bin/env node
// Lembur.id: urus website bisnis (divisi Web & aplikasi). Tim ngerjain di web/pratinjau/, owner yang nerbitin.
// Pakai (dari folder kantor):
//   node alat/web.mjs status            → alamat web, link pratinjau, versi yang tayang, cek terakhir
//   node alat/web.mjs ukur              → cek isi pratinjau sebelum diserahin (berat halaman, gambar gede, alt, judul,
//                                         deskripsi, link mati antar halaman, path absolut yang bakal rusak)
//   node alat/web.mjs cek               → cek web yang tayang: nyala, HTTPS, lama sertifikat, kecepatan (catat di web/cek.json)
//   node alat/web.mjs terbitkan         → pratinjau jadi versi tayang (owner: tombol Terbitkan di dashboard)
//   node alat/web.mjs balik             → balik ke versi sebelumnya (owner)
//   node alat/web.mjs domain tambah tokoku.com | domain hapus tokoku.com   (owner)
// Versi lama disimpen 5 terakhir di web/versi/. Tim (AI) cuma boleh status, ukur, cek; sisanya keputusan owner.
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import tls from 'node:tls';
import crypto from 'node:crypto';
import os from 'node:os';

const K = process.env.KANTOR || process.cwd();
const W = path.join(K, 'web');
const P = path.join(W, 'pratinjau');
const V = path.join(W, 'versi');
const LIVE = path.join(W, 'live');
const arg = process.argv.slice(2);
const gagal = (m) => { console.error(`❌ ${m}`); process.exit(1); };
const bacaJson = (f, isi) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return isi; } };
const tulisJson = (f, isi) => { const t = `${f}.${process.pid}.tmp`; fs.writeFileSync(t, `${JSON.stringify(isi, null, 1)}\n`); fs.renameSync(t, f); };

function siapin() {
  fs.mkdirSync(P, { recursive: true });
  fs.mkdirSync(V, { recursive: true });
  const ft = path.join(W, 'pratinjau-token');
  if (!fs.existsSync(ft)) fs.writeFileSync(ft, `${crypto.randomBytes(12).toString('hex')}\n`, { mode: 0o600 });
}
const host = () => { let h = bacaJson(path.join(W, 'host.json'), {}).host; if (!h) { try { h = fs.readFileSync(path.join(os.homedir(), '.kantor-alamat'), 'utf8'); } catch { h = ''; } } return String(h || '').trim(); };
const token = () => { try { return fs.readFileSync(path.join(W, 'pratinjau-token'), 'utf8').trim(); } catch { return ''; } };
const versi = () => (fs.existsSync(V) ? fs.readdirSync(V).filter((x) => /^\d{8}-\d{6}$/.test(x)).sort() : []);
const tayang = () => { try { return path.basename(fs.readlinkSync(LIVE)); } catch { return ''; } };
const alamat = () => (host() ? `https://web.${host()}` : '(host belum diisi di web/host.json)');
const linkPratinjau = () => (host() && token() ? `https://pratinjau.${host()}/${token()}/` : '(belum siap)');

function semuaFile(akar) {
  const hasil = [];
  const jalan = (d) => { for (const n of fs.readdirSync(d)) { if (n.startsWith('.')) continue; const f = path.join(d, n); const st = fs.lstatSync(f); if (st.isDirectory()) jalan(f); else if (st.isFile()) hasil.push(f); } };
  if (fs.existsSync(akar)) jalan(akar);
  return hasil;
}
const kb = (n) => `${Math.round(n / 1024)} KB`;

function ukur({ diam = false } = {}) {
  const file = semuaFile(P);
  const html = file.filter((f) => f.endsWith('.html'));
  const catat = []; let merah = 0;
  const tanda = (lvl, m) => { catat.push(`${lvl} ${m}`); if (lvl === '❌') merah++; };
  if (!fs.existsSync(path.join(P, 'index.html'))) tanda('❌', 'web/pratinjau/index.html gak ada (halaman utama wajib).');
  const total = file.reduce((a, f) => a + fs.statSync(f).size, 0);
  for (const f of file) {
    const n = fs.statSync(f).size; const rel = path.relative(P, f);
    if (/\.(png|jpe?g|gif)$/i.test(f) && n > 300 * 1024) tanda('⚠️', `${rel} ${kb(n)}: kegedean, kecilin / ubah ke webp (maks ±300 KB).`);
    if (/\.(webp|avif|svg)$/i.test(f) && n > 500 * 1024) tanda('⚠️', `${rel} ${kb(n)}: kegedean (maks ±500 KB).`);
    if (/\.(mp4|webm)$/i.test(f) && n > 8 * 1024 * 1024) tanda('⚠️', `${rel} ${kb(n)}: video kegedean buat web.`);
  }
  for (const f of html) {
    const s = fs.readFileSync(f, 'utf8'); const rel = path.relative(P, f);
    const judul = s.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() || '';
    if (!judul) tanda('❌', `${rel}: <title> kosong.`); else if (judul.length > 65) tanda('⚠️', `${rel}: judul ${judul.length} karakter (Google motong ±60).`);
    const desk = s.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1] || '';
    if (!desk) tanda('⚠️', `${rel}: belum ada meta description.`); else if (desk.length > 160) tanda('⚠️', `${rel}: meta description ${desk.length} karakter (maks ±155).`);
    if (!/<meta\s+name=["']viewport["']/i.test(s)) tanda('❌', `${rel}: gak ada meta viewport (rusak di HP).`);
    if (!/<html[^>]*\blang=/i.test(s)) tanda('⚠️', `${rel}: <html lang="id"> belum diisi.`);
    if (!/property=["']og:image["']/i.test(s) && rel === 'index.html') tanda('⚠️', 'index.html: belum ada og:image (gambar pas link dishare ke WA/IG).');
    const imgTanpaAlt = (s.match(/<img\b(?![^>]*\balt=)[^>]*>/gi) || []).length;
    if (imgTanpaAlt) tanda('⚠️', `${rel}: ${imgTanpaAlt} gambar tanpa alt.`);
    for (const m of s.matchAll(/(?:href|src)=["']([^"'#?]+)/gi)) {
      const t = m[1];
      if (/^(https?:|mailto:|tel:|data:|whatsapp:|\/\/)/i.test(t)) continue;
      if (t.startsWith('/')) { tanda('❌', `${rel}: path absolut "${t}" (rusak di pratinjau). Pakai path relatif, mis. "${t.replace(/^\/+/, '') || './'}".`); continue; }
      const tujuan = path.resolve(path.dirname(f), t);
      const ada = fs.existsSync(tujuan) && (fs.statSync(tujuan).isFile() || fs.existsSync(path.join(tujuan, 'index.html'))) || (!path.extname(t) && fs.existsSync(`${tujuan}.html`));
      if (!ada) tanda('❌', `${rel}: "${t}" gak ada filenya.`);
    }
    const wa = s.match(/https:\/\/wa\.me\/(\d+)/i);
    if (wa && !/^62\d{8,13}$/.test(wa[1])) tanda('⚠️', `${rel}: nomor WhatsApp "${wa[1]}" harus format 62xxxxxxxxx (tanpa 0/+).`);
  }
  if (total > 2 * 1024 * 1024) tanda('⚠️', `total ${kb(total)}: berat buat HP (usahain di bawah ±1,5 MB).`);
  if (!diam) {
    console.log(`Pratinjau: ${html.length} halaman, ${file.length} file, total ${kb(total)}.`);
    console.log(catat.length ? catat.join('\n') : '✅ Gak ada masalah yang kedeteksi alat. Tetap cek tampilannya: node web/alat/foto.mjs');
    console.log(merah ? `\n${merah} ❌ wajib dibenerin sebelum diterbitin.` : '');
  }
  return merah;
}

function minta(url) {
  return new Promise((ok) => {
    const mulai = Date.now();
    const r = https.get(url, { timeout: 15000, headers: { 'User-Agent': 'kantor-ai-cek/1' } }, (res) => {
      let n = 0; res.on('data', (c) => { n += c.length; }); res.on('end', () => ok({ kode: res.statusCode, ms: Date.now() - mulai, bytes: n }));
    });
    r.on('timeout', () => { r.destroy(); ok({ galat: 'timeout 15 detik' }); });
    r.on('error', (e) => ok({ galat: e.code || e.message }));
  });
}
function sertifikat(nama) {
  return new Promise((ok) => {
    const s = tls.connect(443, nama, { servername: nama, timeout: 10000 }, () => { const c = s.getPeerCertificate(); s.end(); ok(c?.valid_to ? Math.floor((Date.parse(c.valid_to) - Date.now()) / 86400000) : null); });
    s.on('error', () => ok(null)); s.on('timeout', () => { s.destroy(); ok(null); });
  });
}

const [perintah, sub, nilai] = arg;
if (perintah === 'siapin') {
  siapin();
  console.log(`✅ web/ siap. Pratinjau: ${linkPratinjau()}`);
} else if (perintah === 'status') {
  const c = bacaJson(path.join(W, 'cek.json'), null);
  console.log(`Alamat web     : ${alamat()}${(bacaJson(path.join(W, 'domain.json'), { domain: [] }).domain || []).map((d) => `, https://${d}`).join('')}`);
  console.log(`Link pratinjau : ${linkPratinjau()}`);
  console.log(`Versi tayang   : ${tayang() || 'belum pernah diterbitin'} (${versi().length} versi disimpen)`);
  console.log(`Cek terakhir   : ${c ? `${c.waktu} ${c.ok ? '✅' : '❌'} ${c.ringkas}` : 'belum pernah'}`);
} else if (perintah === 'ukur') {
  siapin();
  process.exit(ukur() ? 1 : 0);
} else if (perintah === 'terbitkan') {
  siapin();
  if (ukur({ diam: true })) { ukur(); gagal('Masih ada ❌ di pratinjau. Benerin dulu, baru terbitin.'); }
  const t = new Date(Date.now() + 7 * 3600e3).toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
  const tujuan = path.join(V, t);
  fs.cpSync(P, tujuan, { recursive: true, filter: (s) => !path.basename(s).startsWith('.') || s === P });
  const tmp = path.join(W, `.live-${process.pid}`);
  fs.symlinkSync(path.relative(W, tujuan), tmp);
  fs.renameSync(tmp, LIVE);
  for (const lama of versi().slice(0, -5)) fs.rmSync(path.join(V, lama), { recursive: true, force: true });
  console.log(`✅ Versi ${t} tayang di ${alamat()}. Versi lama disimpen (balik: node alat/web.mjs balik).`);
} else if (perintah === 'balik') {
  const daftar = versi(); const kini = tayang();
  const i = daftar.indexOf(kini);
  if (i <= 0) gagal('Gak ada versi sebelumnya buat dibalikin.');
  const tmp = path.join(W, `.live-${process.pid}`);
  fs.symlinkSync(path.join('versi', daftar[i - 1]), tmp);
  fs.renameSync(tmp, LIVE);
  console.log(`✅ Balik ke versi ${daftar[i - 1]} (versi ${kini} masih disimpen).`);
} else if (perintah === 'cek') {
  if (!host()) gagal('Alamat VPS belum ketemu (~/.kantor-alamat atau web/host.json).');
  const nama = `web.${host()}`;
  const [r, hari] = await Promise.all([minta(`https://${nama}/`), sertifikat(nama)]);
  const ok = !r.galat && r.kode === 200 && hari !== null && hari > 7 && r.ms < 4000;
  const ringkas = r.galat ? `gak bisa dibuka (${r.galat})` : `HTTP ${r.kode}, ${r.ms} ms, ${kb(r.bytes)}, sertifikat ${hari === null ? 'gak kebaca' : `${hari} hari lagi`}`;
  fs.mkdirSync(W, { recursive: true });
  tulisJson(path.join(W, 'cek.json'), { waktu: new Date().toISOString(), ok, ringkas, ...r, sertifikatHari: hari, versi: tayang() });
  console.log(`${ok ? '✅' : '❌'} ${nama}: ${ringkas}`);
  if (!ok) console.log('Kalau gak nyala / sertifikat mau abis: tulis di "Keputusan kamu" + notif ke owner.');
} else if (perintah === 'domain') {
  const f = path.join(W, 'domain.json');
  const d = bacaJson(f, { domain: [] });
  const nama = String(nilai || '').toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  if (!/^(?=.{4,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/.test(nama)) gagal('Nama domain gak valid (contoh: tokoku.com atau www.tokoku.com).');
  if (sub === 'tambah') {
    d.domain = [...new Set([...(d.domain || []), nama])];
    tulisJson(f, d);
    console.log(`✅ ${nama} didaftarin. Arahin DNS-nya ke VPS ini: record A "${nama}" → IP VPS (sama kayak alamat dashboard).`);
    console.log('   Abis DNS nyambung (bisa 5 menit–beberapa jam), buka https://' + nama + ' — sertifikat HTTPS dibikin otomatis.');
  } else if (sub === 'hapus') {
    d.domain = (d.domain || []).filter((x) => x !== nama);
    tulisJson(f, d);
    console.log(`✅ ${nama} dilepas dari website.`);
  } else gagal('Pakai: node alat/web.mjs domain tambah|hapus <nama-domain>');
} else {
  console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').filter((b) => b.startsWith('//')).slice(0, 11).join('\n'));
  process.exit(perintah ? 1 : 0);
}
