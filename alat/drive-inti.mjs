import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export class DriveGagal extends Error {}
const gagal = (s) => { throw new DriveGagal(s); };
const baca = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };
const tokenFile = (K) => path.join(K, '.rahasia/google-drive.json');
const oauth = () => process.env.GOOGLE_OAUTH_API || 'https://oauth2.googleapis.com';
const api = () => process.env.GOOGLE_DRIVE_API || 'https://www.googleapis.com';
const tidur = (ms) => new Promise((ok) => setTimeout(ok, ms));
export const BELUM_AKTIF = 'Fitur kirim ke Drive belum aktif di kit ini. Kamu bisa minta aku cek versi kit.';
// Kasus pembeli 03/11: layar Google ngebolehin centang sebagian. Tanpa izin Drive, token tetap keluar ("Tersambung"),
// tapi semua kirim ditolak Google. Dicek pas nyambung, dan pesan gagalnya disebut jelas kalau Google bilang izinnya kurang.
export const IZIN_DRIVE = 'https://www.googleapis.com/auth/drive.file';
export const IZIN_KURANG = 'Izin Google Drive belum dicentang. Buka dashboard → Google Drive (/drive) → Putuskan, terus Sambungkan lagi dan centang izin Google Drive di halaman Google.';
// Literal di gagal() sengaja ditulis ulang (bukan konstanta), biar kamus terjemahan dashboard (uji kd121) nemu pesannya.
const gagalIzin = () => gagal('Izin Google Drive belum dicentang. Buka dashboard → Google Drive (/drive) → Putuskan, terus Sambungkan lagi dan centang izin Google Drive di halaman Google.');
async function izinKurang(r) {
  if (r.status !== 403) return false;
  try { const j = await r.clone().json(); return (j.error?.errors || []).some((e) => e.reason === 'insufficientPermissions') || /insufficient/i.test(String(j.error?.message || '')); } catch { return false; }
}
export function klien(K) {
  const c = baca(path.join(K, 'alat/google-klien.json'));
  if (!c || ['client_id', 'client_secret'].some((k) => typeof c[k] !== 'string' || !c[k].trim() || /placeholder/i.test(c[k]))) gagal(BELUM_AKTIF);
  return c;
}
function simpan(K, t) {
  const f = tokenFile(K); fs.mkdirSync(path.dirname(f), { recursive: true, mode: 0o700 });
  if (fs.lstatSync(path.dirname(f)).isSymbolicLink()) gagal('Folder rahasia gak aman. Aku berhenti dulu.');
  const tmp = `${f}.${crypto.randomBytes(8).toString('hex')}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(t), { mode: 0o600, flag: 'wx' }); fs.renameSync(tmp, f);
}
async function minta(url, opsi = {}) {
  // 'manual', bukan 'error': Google ngebales tiap potongan unggah resumable pakai 308 (Resume Incomplete), dan fetch
  // nganggep 308 sebagai redirect → mode 'error' bikin SEMUA unggahan >1 potongan gagal (ketauan tes 12/10). 'manual'
  // tetap gak ngikutin redirect ke mana pun; status 3xx lain ditolak sama pengecekan status di pemanggil.
  try { return await fetch(url, { ...opsi, redirect: 'manual', signal: AbortSignal.timeout(30000) }); }
  catch { gagal('Aku gak bisa nyambung ke Google Drive. Coba lagi nanti.'); }
}
async function form(K, endpoint, data) {
  const c = klien(K);
  const r = await minta(`${oauth()}${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: c.client_id, ...(endpoint === '/token' ? { client_secret: c.client_secret } : {}), ...data }) });
  let d; try { d = await r.json(); } catch { gagal('Jawaban Google gak kebaca. Coba lagi nanti.'); }
  return { r, d };
}
export async function mulai(K) {
  const { r, d } = await form(K, '/device/code', { scope: 'openid email https://www.googleapis.com/auth/drive.file' });
  if (!r.ok || !d.device_code || !d.user_code || !Number.isFinite(d.expires_in) || d.expires_in <= 0) gagal('Aku gak bisa bikin kode Google. Coba lagi nanti.');
  return { ...d, interval: Math.max(1, Number(d.interval) || 5), akhir: Date.now() + d.expires_in * 1000 };
}
export async function tunggu(K, kode, { jeda = tidur, sekarang = Date.now, batal = () => false } = {}) {
  let interval = kode.interval;
  while (sekarang() < kode.akhir && !batal()) {
    await jeda(interval * 1000);
    if (sekarang() >= kode.akhir || batal()) break;
    const { r, d } = await form(K, '/token', { device_code: kode.device_code, grant_type: 'urn:ietf:params:oauth:grant-type:device_code' });
    if (d.error === 'authorization_pending') continue;
    if (d.error === 'slow_down') { interval += 5; continue; }
    if (!r.ok || d.error) gagal(d.error === 'access_denied' ? 'Kamu menolak sambungan Google Drive.' : 'Kode Google gak bisa dipakai lagi. Kamu bisa sambungkan ulang.');
    if (!d.access_token || !d.refresh_token || !Number.isFinite(d.expires_in)) gagal('Token Google belum lengkap. Kamu bisa sambungkan ulang.');
    if (typeof d.scope === 'string' && !d.scope.split(/\s+/).includes(IZIN_DRIVE)) gagalIzin();
    let email = ''; try { email = JSON.parse(Buffer.from(d.id_token.split('.')[1], 'base64url').toString()).email || ''; } catch { /* Email cuma buat tampilan. */ }
    if (batal()) return;
    simpan(K, { access_token: d.access_token, refresh_token: d.refresh_token, kedaluwarsa: sekarang() + d.expires_in * 1000, email });
    await folder(K); return;
  }
  if (!batal()) gagal('Kode Google kedaluwarsa. Kamu bisa minta kode baru.');
}
export function putus(K) { klien(K); fs.rmSync(tokenFile(K), { force: true }); }
export async function akses(K) {
  klien(K); let t = baca(tokenFile(K));
  if (!t?.refresh_token || t.ulang) gagal('Kirim file ke Drive perlu disambung ulang. Kamu bisa buka dashboard → Google Drive (/drive) → Sambungkan Google Drive.');
  if (!t.access_token || !Number.isFinite(t.kedaluwarsa) || t.kedaluwarsa <= Date.now() + 30000) {
    const { r, d } = await form(K, '/token', { grant_type: 'refresh_token', refresh_token: t.refresh_token });
    if (d.error === 'invalid_grant') { simpan(K, { email: t.email, ulang: true }); gagal('Kirim file ke Drive perlu disambung ulang. Kamu bisa buka dashboard → Google Drive (/drive) → Sambungkan Google Drive.'); }
    if (!r.ok || !d.access_token || !Number.isFinite(d.expires_in)) gagal('Aku belum bisa memperbarui sambungan Google Drive. Coba lagi nanti.');
    t = { ...t, access_token: d.access_token, refresh_token: d.refresh_token || t.refresh_token, kedaluwarsa: Date.now() + d.expires_in * 1000 }; simpan(K, t);
  }
  return t.access_token;
}
export function status(K) {
  try { klien(K); } catch { return { aktif: false, tersambung: false, pesan: BELUM_AKTIF }; }
  const t = baca(tokenFile(K));
  return { aktif: true, tersambung: !!t?.refresh_token && !t.ulang, email: t?.email || '', perluUlang: !!t?.ulang, folder: t?.folder ? `https://drive.google.com/drive/folders/${encodeURIComponent(t.folder)}` : '' };
}
export async function cekStatus(K) {
  if (status(K).tersambung) {
    try { await akses(K); } catch (e) { return { ...status(K), pesan: e instanceof DriveGagal ? e.message : 'Aku belum bisa cek sambungan Drive.' }; }
  }
  return status(K);
}
async function drive(K, url, opsi = {}) {
  return minta(url, { ...opsi, headers: { ...opsi.headers, Authorization: `Bearer ${await akses(K)}` } });
}
const idSah = (id) => typeof id === 'string' && /^[a-zA-Z0-9_-]+$/.test(id);
export function namaFolder(n) {
  if (typeof n === 'string') n = n.trim();
  if (typeof n !== 'string' || !n.trim() || n.length > 100 || /[\/\\\x00-\x1f]/.test(n) || n === '.' || n === '..') gagal('Isi satu nama folder yang aman, tanpa garis miring.');
  return n.trim();
}
export async function folder(K, sub = '') {
  if (sub) namaFolder(sub);
  let t = baca(tokenFile(K)); let induk = idSah(t?.folder) ? t.folder : null;
  if (induk) {
    const r = await drive(K, `${api()}/drive/v3/files/${encodeURIComponent(induk)}?fields=id,trashed`);
    if (r.status === 404) induk = null;
    else if (!r.ok) { if (await izinKurang(r)) gagalIzin(); gagal('Aku belum bisa cek folder Drive. Coba lagi nanti.'); }
    else if ((await r.json()).trashed) induk = null;
  }
  async function cariBikin(nama, parent) {
    const aman = nama.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const q = `mimeType='application/vnd.google-apps.folder' and name='${aman}' and trashed=false${parent ? ` and '${parent}' in parents` : ''}`;
    let r = await drive(K, `${api()}/drive/v3/files?${new URLSearchParams({ q, fields: 'files(id,name)' })}`);
    if (!r.ok) { if (await izinKurang(r)) gagalIzin(); gagal('Aku belum bisa cari folder Drive. Coba lagi nanti.'); }
    let id = (await r.json()).files?.[0]?.id;
    if (!id) {
      r = await drive(K, `${api()}/drive/v3/files`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: nama, mimeType: 'application/vnd.google-apps.folder', ...(parent ? { parents: [parent] } : {}) }) });
      if (!r.ok) { if (await izinKurang(r)) gagalIzin(); gagal('Aku belum bisa bikin folder Drive. Coba lagi nanti.'); } id = (await r.json()).id;
    }
    if (!idSah(id)) gagal('Id folder Google gak kebaca.'); return id;
  }
  if (!induk) { induk = await cariBikin('Lembur – Hasil'); t = baca(tokenFile(K)); simpan(K, { ...t, folder: induk }); }
  return sub ? cariBikin(namaFolder(sub), induk) : induk;
}
const MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm', mp3: 'audio/mpeg', wav: 'audio/wav', m4a: 'audio/mp4', pdf: 'application/pdf', txt: 'text/plain', md: 'text/markdown', json: 'application/json', zip: 'application/zip', csv: 'text/csv' };
export const mime = (f) => MIME[path.extname(f).slice(1).toLowerCase()] || 'application/octet-stream';
export function berkas(K, f) {
  const root = fs.realpathSync(K); let abs;
  try { abs = fs.realpathSync(path.resolve(K, f)); } catch { gagal('Berkasnya gak ketemu di kantor kamu.'); }
  const rel = path.relative(root, abs);
  const rahasia = (s) => s.split(/[\/\\]/).some((n) => ['.rahasia', '.ssh', '.aws', '.gnupg', '.git'].includes(n) || /^\.env(?:\.|$)/i.test(n) || /^(?:kunci|secrets?|credentials)(?:[._-]|$)/i.test(n) || /^(?:id_rsa|id_dsa|id_ecdsa|id_ed25519|google-klien\.json)$|\.(?:pem|key|p12|pfx)$/i.test(n));
  if (!rel || rel.startsWith(`..${path.sep}`) || rel === '..' || path.isAbsolute(rel) || rahasia(rel) || rahasia(path.relative(root, path.resolve(K, f)))) gagal('Aku cuma bisa kirim berkas kantor yang bukan rahasia.');
  const st = fs.statSync(abs);
  if (!st.isFile() || st.size > 4 * 1024 ** 3) gagal('Kirim berkas biasa dengan ukuran maksimal 4 GB.');
  return { abs, nama: path.basename(abs), ukuran: st.size, mime: mime(abs) };
}
export function riwayat(K) {
  try { return fs.readFileSync(path.join(K, 'catatan/drive-kirim.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map((s) => JSON.parse(s)); } catch { return []; }
}
export async function kirim(K, f, sub = '', { jeda = tidur } = {}) {
  klien(K); const b = berkas(K, f); const parent = await folder(K, sub);
  const fd = fs.openSync(b.abs, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
  try {
    const st = fs.fstatSync(fd); if (st.size !== b.ukuran || !st.isFile()) gagal('Berkas berubah. Aku berhenti dulu.');
    for (let ulang = 0; ulang < 2; ulang++) {
      let awal;
      for (let coba = 0; coba <= 5; coba++) {
        awal = await drive(K, `${api()}/upload/drive/v3/files?uploadType=resumable`, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=UTF-8', 'X-Upload-Content-Type': b.mime, 'X-Upload-Content-Length': String(b.ukuran) }, body: JSON.stringify({ name: b.nama, parents: [parent] }) });
        if (awal.status < 500 && awal.status !== 403) break;
        if (awal.status === 403 && !/rateLimitExceeded|userRateLimitExceeded|rate.?limit/i.test(await awal.text())) gagal('Google menolak unggahan ini.');
        if (coba === 5) gagal('Google lagi sibuk. Kamu bisa coba lagi nanti.');
        await jeda((coba + 1) * 1000);
      }
      const uri = awal.headers.get('location');
      if (!awal.ok || !uri) gagal('Aku belum bisa mulai unggah ke Drive.');
      let tujuan; try { tujuan = new URL(uri); } catch { gagal('Alamat unggah Google gak sah.'); }
      if (tujuan.origin !== new URL(api()).origin) gagal('Alamat unggah Google gak aman.');
      let offset = 0; let cek = false; let coba = 0; let selesai;
      while (!selesai) {
        const n = Math.min(8 * 1024 ** 2, b.ukuran - offset);
        const data = Buffer.alloc(n); if (!cek && n && fs.readSync(fd, data, 0, n, offset) !== n) gagal('Berkas berubah saat dikirim.');
        let r;
        try { r = await drive(K, uri, { method: 'PUT', headers: { 'Content-Length': String(cek ? 0 : n), 'Content-Range': cek || !b.ukuran ? `bytes */${b.ukuran}` : `bytes ${offset}-${offset + n - 1}/${b.ukuran}` }, body: cek ? Buffer.alloc(0) : data }); }
        catch { if (++coba > 5) gagal('Unggah Drive terputus. Kamu bisa coba lagi nanti.'); await jeda(coba * 1000); cek = true; continue; }
        if (r.status === 404) break;
        if (r.status >= 500 || r.status === 403) {
          if (r.status === 403) { const teks = await r.text(); if (!/rateLimitExceeded|userRateLimitExceeded|rate.?limit/i.test(teks)) gagal('Google menolak unggahan ini.'); }
          if (++coba > 5) gagal('Google lagi sibuk. Kamu bisa coba lagi nanti.'); await jeda(coba * 1000); cek = true; continue;
        }
        if (r.status === 200 || r.status === 201) { selesai = await r.json(); break; }
        if (r.status !== 308) gagal('Google menolak unggahan ini.');
        const range = r.headers.get('range'); const m = range?.match(/^bytes=0-(\d+)$/);
        const next = range ? (m ? Number(m[1]) + 1 : NaN) : 0;
        if (!Number.isSafeInteger(next) || next < offset || next > b.ukuran) gagal('Posisi unggahan Google gak sah.');
        if (next === offset) { if (++coba > 5) gagal('Unggahan Google gak maju. Coba lagi nanti.'); await jeda(coba * 1000); } else coba = 0;
        offset = next; cek = offset === b.ukuran;
      }
      if (!selesai) continue;
      if (!idSah(selesai.id)) gagal('Id hasil Google gak kebaca.');
      const hasil = { waktu: new Date().toISOString(), nama: b.nama, ukuran: b.ukuran, id: selesai.id, link: `https://drive.google.com/file/d/${selesai.id}/view`, folder: `https://drive.google.com/drive/folders/${parent}` };
      fs.mkdirSync(path.join(K, 'catatan'), { recursive: true }); fs.appendFileSync(path.join(K, 'catatan/drive-kirim.jsonl'), `${JSON.stringify(hasil)}\n`, { mode: 0o600 }); return hasil;
    }
    gagal('Sesi unggah Google kedaluwarsa dua kali. Kamu bisa coba lagi nanti.');
  } finally { fs.closeSync(fd); }
}
