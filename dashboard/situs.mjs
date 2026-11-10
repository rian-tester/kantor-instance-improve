// Penyaji website bisnis (divisi Web & aplikasi). Jalan bareng dashboard di port terpisah (bawaan 7692), Caddy yang
// ngurus HTTPS-nya. Cuma nyajiin file statis, gak ada login & gak bisa ke rute dashboard:
//   - web.<host dashboard> & domain owner (web/domain.json)  → versi yang tayang (web/live → web/versi/<waktu>/)
//   - pratinjau.<host dashboard>/<token>/                     → web/pratinjau/ (token rahasia di web/pratinjau-token)
//   - /caddy-boleh?domain=…  (cuma dari 127.0.0.1)           → Caddy nanya boleh bikin sertifikat buat domain itu
// File yang disajiin dicek ketat: gak boleh keluar folder, gak boleh file/folder titik, gak boleh symlink di dalamnya.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { t as tx, pakai, bacaBahasa, bahasaAktif } from './bahasa/index.mjs';

const JENIS = {
  html: 'text/html; charset=utf-8', css: 'text/css; charset=utf-8', js: 'text/javascript; charset=utf-8', mjs: 'text/javascript; charset=utf-8',
  json: 'application/json', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', avif: 'image/avif',
  gif: 'image/gif', ico: 'image/x-icon', woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', txt: 'text/plain; charset=utf-8',
  xml: 'application/xml', pdf: 'application/pdf', mp4: 'video/mp4', webm: 'video/webm', webmanifest: 'application/manifest+json',
};
const KEPALA = { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'SAMEORIGIN' };

const bacaJson = (f, isi) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return isi; } };
// Halaman sementara & teks 404 ikut bahasa kantor (pengunjung web bisnis owner).
const SEMENTARA = () => `<!doctype html><html lang="${bahasaAktif()}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${tx('db.situs.judul')}</title>
<body style="margin:0;min-height:100vh;display:grid;place-items:center;font:16px/1.5 system-ui,sans-serif;background:#f6f4ef;color:#222"><p>${tx('db.situs.disiapin')}</p></body></html>`;

export function mulaiSitus(K, port = Number(process.env.SITUS_PORT || 7692)) {
  const W = path.join(K, 'web');
  // Alamat dashboard (mis. 1-2-3-4.sslip.io): web/host.json kalau ada, kalau gak ~/.kantor-alamat (ditulis mulai.sh).
  const hostDashboard = () => { let h = bacaJson(path.join(W, 'host.json'), {}).host; if (!h) { try { h = fs.readFileSync(path.join(os.homedir(), '.kantor-alamat'), 'utf8'); } catch { h = ''; } } return String(h || '').trim().toLowerCase(); };
  const domainOwner = () => (bacaJson(path.join(W, 'domain.json'), { domain: [] }).domain || []).map((d) => String(d).toLowerCase());
  const token = () => { try { return fs.readFileSync(path.join(W, 'pratinjau-token'), 'utf8').trim(); } catch { return ''; } };

  // Path URL → file di dalam akar, atau null. Akar boleh symlink (web/live), isinya gak boleh.
  function cari(akar, urlPath) {
    let rel;
    try { rel = decodeURIComponent(urlPath); } catch { return null; }
    const bagian = rel.split('/').filter(Boolean);
    if (bagian.some((b) => b.startsWith('.') || b.includes('\\') || b.includes('\0'))) return null;
    let akarAsli;
    try { akarAsli = fs.realpathSync(akar); } catch { return null; }
    let f = path.join(akarAsli, ...bagian);
    try {
      let st = fs.lstatSync(f);
      if (st.isSymbolicLink()) return null;
      if (st.isDirectory()) { f = path.join(f, 'index.html'); st = fs.lstatSync(f); if (st.isSymbolicLink()) return null; }
      if (!st.isFile()) return null;
    } catch {
      // "/tentang" → "/tentang.html"
      if (!path.extname(f)) { try { const g = `${f}.html`; if (fs.lstatSync(g).isFile()) f = g; else return null; } catch { return null; } } else return null;
    }
    const asli = fs.realpathSync(f);
    return asli.startsWith(akarAsli + path.sep) ? asli : null;
  }

  function sajikan(res, akar, urlPath, { kepala = {}, kosong = '' } = {}) {
    const f = cari(akar, urlPath);
    const kirim = (kode, isi, jenis) => { res.writeHead(kode, { ...KEPALA, ...kepala, 'Content-Type': jenis, 'Cache-Control': 'no-cache' }); res.end(isi); };
    if (!f) {
      if (kosong && (urlPath === '/' || urlPath === '')) return kirim(200, kosong, JENIS.html);
      const f404 = cari(akar, '/404.html');
      return kirim(404, f404 ? fs.readFileSync(f404) : tx('db.situs.gakAda'), f404 ? JENIS.html : JENIS.txt);
    }
    const ext = path.extname(f).slice(1).toLowerCase();
    const aset = !['html', 'json', 'xml', 'txt', 'webmanifest'].includes(ext);
    res.writeHead(200, { ...KEPALA, ...kepala, 'Content-Type': JENIS[ext] || 'application/octet-stream', 'Cache-Control': aset ? 'public, max-age=3600' : 'no-cache' });
    fs.createReadStream(f).pipe(res);
  }

  const server = http.createServer((req, res) => {
    pakai(bacaBahasa(K));
    const host = String(req.headers.host || '').toLowerCase().replace(/:\d+$/, '');
    let u;
    try { u = new URL(req.url, 'http://x'); } catch { res.writeHead(400); return res.end(); }
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, KEPALA); return res.end(); }
    const dash = hostDashboard();
    if (u.pathname === '/caddy-boleh') {
      const lokal = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress);
      const d = String(u.searchParams.get('domain') || '').toLowerCase();
      const boleh = lokal && dash && (d === `web.${dash}` || d === `pratinjau.${dash}` || domainOwner().includes(d));
      res.writeHead(boleh ? 200 : 403); return res.end();
    }
    if (dash && host === `pratinjau.${dash}`) {
      const t = token();
      if (!t || (u.pathname !== `/${t}` && !u.pathname.startsWith(`/${t}/`))) { res.writeHead(404, { ...KEPALA, 'Content-Type': JENIS.txt }); return res.end(tx('db.situs.gakAdaPendek')); }
      if (u.pathname === `/${t}`) { res.writeHead(302, { Location: `/${t}/` }); return res.end(); }
      return sajikan(res, path.join(W, 'pratinjau'), u.pathname.slice(t.length + 1), { kepala: { 'X-Robots-Tag': 'noindex, nofollow' }, kosong: SEMENTARA() });
    }
    if ((dash && host === `web.${dash}`) || domainOwner().includes(host)) {
      return sajikan(res, path.join(W, 'live'), u.pathname, { kosong: SEMENTARA() });
    }
    res.writeHead(404, { ...KEPALA, 'Content-Type': JENIS.txt }); res.end(tx('db.situs.gakAdaPendek'));
  });
  server.on('error', (e) => console.error(`situs gagal nyala: ${e.message}`));
  server.listen(port, '127.0.0.1', () => console.log(`situs di 127.0.0.1:${port}`));
  return server;
}
