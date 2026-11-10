import fs from 'node:fs';
import path from 'node:path';
import { t as tx } from './bahasa/index.mjs';
const jenisMime = {
  jpg: ['gambar', 'image/jpeg'], jpeg: ['gambar', 'image/jpeg'], png: ['gambar', 'image/png'], webp: ['gambar', 'image/webp'], gif: ['gambar', 'image/gif'],
  mp4: ['video', 'video/mp4'], webm: ['video', 'video/webm'], mov: ['video', 'video/quicktime'],
  mp3: ['suara', 'audio/mpeg'], wav: ['suara', 'audio/wav'], m4a: ['suara', 'audio/mp4'], ogg: ['suara', 'audio/ogg'],
  md: ['dokumen', 'text/plain; charset=utf-8'], txt: ['dokumen', 'text/plain; charset=utf-8'], pdf: ['dokumen', 'application/pdf'],
  csv: ['dokumen', 'text/csv; charset=utf-8'], json: ['dokumen', 'application/json'], html: ['dokumen', 'text/plain; charset=utf-8'],
};
const rahasia = (rel) => rel.split(/[\\/]/).some((n) => ['.rahasia', '.git', 'node_modules', '.ssh', '.aws', '.gnupg'].includes(n) || /^\.env(?:\.|$)|^(?:kunci|secrets?|credentials)(?:[._-]|$)|^id_(?:rsa|dsa|ecdsa|ed25519)(?:\.|$)|^google-klien\.json$|\.(?:pem|key|p12|pfx)$/i.test(n));
export function referensi(teks) {
  const hasil = [];
  let bagianHasil = false; let bagianLama = false;
  for (const baris of teks.split('\n')) {
    if (/^## /.test(baris)) { bagianHasil = /^## Hasil\s*$/i.test(baris); bagianLama = false; }
    if (/^### /.test(baris)) bagianLama = /versi lama/i.test(baris);
    const lama = bagianLama || /versi lama/i.test(baris);
    const calon = [...baris.matchAll(/`([^`]+)`|\]\(([^)]+)\)|((?:https:\/\/)?drive\.google\.com\/[^\s<>`]+)|((?:\.?\.?\/|\/)?[\p{L}\p{N}_.-]+(?:\/[\p{L}\p{N}_.-]+)+\/?)/gu)];
    for (const m of calon) {
      const jalur = (m[1] || m[2] || m[3] || m[4]).replace(/[),;]+$/, '');
      hasil.push({ jalur, lama, bagianHasil });
    }
  }
  const versi = (s) => Number(s.match(/-v(\d+)(?=\/|\.|$)/i)?.[1] || 1);
  return hasil.sort((a, b) => Number(b.bagianHasil) - Number(a.bagianHasil) || Number(a.lama) - Number(b.lama) || versi(b.jalur) - versi(a.jalur));
}
export function berkasAman(K, rel) {
  if (typeof rel !== 'string' || path.isAbsolute(rel) || rel.split(/[\\/]/).includes('..') || rahasia(rel)) return null;
  try {
    const root = fs.realpathSync(K); const abs = fs.realpathSync(path.resolve(root, rel)); const relatif = path.relative(root, abs);
    if (!relatif || relatif.startsWith(`..${path.sep}`) || path.isAbsolute(relatif) || rahasia(relatif)) return null;
    return { abs, rel: relatif.split(path.sep).join('/'), stat: fs.statSync(abs) };
  } catch { return null; }
}
export function deteksiHasil(K, teks, riwayat = []) {
  const hasil = []; const dikenal = new Map();
  function tambah(item) {
    const key = item.rel || item.link; const ada = dikenal.get(key);
    if (ada) return;
    if (hasil.length >= 40) return;
    dikenal.set(key, item); hasil.push(item);
  }
  function media(rel, lama) {
    const b = berkasAman(K, rel); const tipe = jenisMime[path.extname(rel).slice(1).toLowerCase()];
    if (!b?.stat.isFile() || !tipe) return;
    const nama = path.basename(b.rel); const kiriman = [...riwayat].reverse().find((r) => r.nama === nama && r.ukuran === b.stat.size && /^[\w-]+$/.test(r.id || ''));
    tambah({ rel: b.rel, nama, jenis: tipe[0], mime: tipe[1], grup: path.dirname(b.rel), lama, ...(kiriman ? { drive: `https://drive.google.com/file/d/${kiriman.id}/view` } : {}) });
  }
  for (const { jalur, lama } of referensi(teks)) {
    if (/^(?:https:\/\/)?drive\.google\.com\//.test(jalur)) {
      try { const u = new URL(jalur.startsWith('https://') ? jalur : `https://${jalur}`); if (u.hostname === 'drive.google.com' && !u.username && !u.password) tambah({ jenis: 'drive', link: u.href, lama }); } catch { /* Link gak sah diabaikan. */ }
      continue;
    }
    const b = berkasAman(K, jalur); if (!b) continue;
    if (b.stat.isFile()) media(jalur, lama);
    else if (b.stat.isDirectory()) {
      let isi; try { isi = fs.readdirSync(b.abs); } catch { continue; }
      for (const f of isi.sort((a, z) => a.localeCompare(z, 'id', { numeric: true }))) {
        if (hasil.length >= 40) break;
        media(`${b.rel}/${f}`, lama);
      }
    }
  }
  const versi = new Map();
  for (const h of hasil) {
    const m = h.rel?.match(/^(.*?)-v(\d+)(?=\/|\.|$)/i);
    if (m) versi.set(m[1], Math.max(versi.get(m[1]) || 1, Number(m[2])));
  }
  for (const h of hasil) {
    if (!h.rel) continue;
    for (const [dasar, terbaru] of versi) {
      const m = h.rel.match(/^(.*?)-v(\d+)(?=\/|\.|$)/i);
      if ((m?.[1] === dasar && Number(m[2]) < terbaru) || (!m && (h.rel.startsWith(`${dasar}/`) || h.rel.startsWith(`${dasar}.`)) && terbaru > 1)) h.lama = true;
    }
  }
  return hasil.map((h, n) => ({ ...h, n }));
}
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export function renderHasil(file, hasil) {
  if (!hasil.length) return '';
  function bagian(items) {
    const groups = new Map();
    for (const h of items) { const key = h.jenis === 'gambar' ? h.grup : `item-${h.n}`; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(h); }
    return [...groups.values()].map((grup) => {
      const carousel = grup.length >= 2 && grup[0].jenis === 'gambar';
      const isi = grup.map((h, i) => {
        const src = `/task/${encodeURIComponent(file)}/hasil/${h.n}`; const link = h.drive ? `<a class="tombol kecil" href="${esc(h.drive)}" target="_blank" rel="noopener">${tx('db.hasil.bukaDrive')}</a>` : '';
        let media;
        if (h.jenis === 'drive') media = `<a class="tombol" href="${esc(h.link)}" target="_blank" rel="noopener">${tx('db.hasil.bukaDrive')}</a>`;
        else if (h.jenis === 'gambar') media = `<a href="${src}" target="_blank" rel="noopener"><img src="${src}" alt="${esc(h.nama)}" loading="lazy"></a>`;
        else if (h.jenis === 'video') media = `<video controls preload="metadata" playsinline src="${src}"></video>`;
        else if (h.jenis === 'suara') media = `<audio controls preload="none" src="${src}"></audio>`;
        else media = `<a href="${src}">${tx('db.hasil.buka', { nama: esc(h.nama) })}</a>`;
        return `<figure class="hasil-item">${media}<figcaption>${carousel ? `${i + 1}/${grup.length} · ` : ''}${esc(h.nama || 'Google Drive')} ${link}</figcaption></figure>`;
      }).join('');
      return carousel ? `<div class="hasil-carousel" aria-label="${tx('db.hasil.carousel', { n: grup.length })}">${isi}</div>` : isi;
    }).join('');
  }
  const lama = hasil.filter((h) => h.lama); const baru = hasil.filter((h) => !h.lama);
  return `<section class="blok hasil-task" aria-label="${tx('db.hasil.judul')}"><h3>${tx('db.hasil.judul')} <span class="jml">${hasil.length}</span></h3>${bagian(baru)}${lama.length ? `<details class="lipat"><summary>${tx('db.hasil.versiLama', { n: lama.length })}</summary>${bagian(lama)}</details>` : ''}</section>`;
}
export function rentang(header, ukuran) {
  if (!header) return { status: 200, awal: 0, akhir: ukuran - 1 };
  const m = header.match(/^bytes=(\d*)-(\d*)$/); if (!m || !ukuran || (!m[1] && !m[2])) return null;
  const awal = m[1] ? Number(m[1]) : Math.max(0, ukuran - Number(m[2]));
  const akhir = m[1] && m[2] ? Math.min(ukuran - 1, Number(m[2])) : ukuran - 1;
  if (!Number.isSafeInteger(awal) || !Number.isSafeInteger(akhir) || awal > akhir || awal >= ukuran) return null;
  return { status: 206, awal, akhir };
}
