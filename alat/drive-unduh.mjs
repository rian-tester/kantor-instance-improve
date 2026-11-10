// KD-152 (permintaan pembeli via Kindi 27/10): unduh berkas dari TAUTAN BAGIKAN PUBLIK Google Drive ("siapa saja dengan link") ke folder kantor.
// Tanpa login: izin drive.file kit gak bisa baca berkas yang pembeli upload sendiri, dan izin baca penuh butuh audit Google.
// Pagar: cuma tautan Google (drive.google.com / docs.google.com / drive.usercontent.google.com) lewat HTTPS; redirect cuma ke host Google; ukuran dibatasi;
// cuma jenis berkas yang aman diunduh (gambar, audio, video, dokumen, font; bukan skrip/program); tujuan cuma masuk/ atau kotak-masuk/<divisi>/ yang
// udah ada; gak pernah menimpa berkas; gak pernah menjalankan hasil unduhan.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { DriveGagal } from './drive-inti.mjs';

const gagal = (s) => { throw new DriveGagal(s); };
const HOST_BOLEH = (h) => h === 'drive.google.com' || h === 'docs.google.com' || h === 'drive.usercontent.google.com' || /^[a-z0-9-]+(\.[a-z0-9-]+)*\.googleusercontent\.com$/.test(h);
export const MAKS_BAWAAN_MB = 100;
export const MAKS_PALING_BESAR_MB = 300;
const EKSTENSI = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif', 'mp3', 'wav', 'm4a', 'ogg', 'flac', 'aac', 'mp4', 'mov', 'webm', 'mkv', 'pdf', 'txt', 'md', 'csv', 'tsv', 'json', 'srt', 'vtt', 'xlsx', 'xls', 'docx', 'doc', 'pptx', 'ppt', 'zip', 'ttf', 'otf']);
const DARI_TIPE = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'audio/mpeg': 'mp3', 'audio/wav': 'wav', 'audio/x-wav': 'wav', 'audio/mp4': 'm4a', 'audio/ogg': 'ogg', 'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/webm': 'webm', 'application/pdf': 'pdf', 'text/plain': 'txt', 'text/csv': 'csv', 'application/zip': 'zip' };

// Tautan atau id mentah → id berkas. Folder, Google Docs/Sheets/Slides, dan host lain ditolak dengan pesan yang jelas.
export function idDariTautan(x) {
  const t = String(x ?? '').trim();
  if (!t) gagal('Tempel tautan Google Drive berkasnya.');
  if (/^[A-Za-z0-9_-]{20,80}$/.test(t)) return t;
  let u; try { u = new URL(t); } catch { gagal('Tautannya gak kebaca. Pakai tautan "Bagikan" dari Google Drive.'); }
  if (u.protocol !== 'https:' || !['drive.google.com', 'docs.google.com', 'drive.usercontent.google.com'].includes(u.hostname)) gagal('Aku cuma bisa unduh dari tautan Google Drive (https://drive.google.com/…).');
  const p = u.pathname;
  if (/^\/(?:drive\/)?(?:u\/\d+\/)?folders\//.test(p)) gagal('Tautan folder belum didukung. Bagikan berkasnya satu per satu ("siapa saja dengan link").');
  if (u.hostname === 'docs.google.com' && /^\/(document|spreadsheets|presentation|forms)\//.test(p)) gagal('Google Docs/Sheets/Slides gak bisa diunduh langsung. Ekspor dulu jadi PDF atau berkas biasa di Drive, lalu bagikan berkasnya.');
  const id = p.match(/\/file\/d\/([A-Za-z0-9_-]{20,80})/)?.[1] || u.searchParams.get('id') || '';
  if (!/^[A-Za-z0-9_-]{20,80}$/.test(id)) gagal('Id berkas di tautannya gak ketemu. Pakai tautan "Bagikan" berkas dari Google Drive.');
  return id;
}

// Tujuan: masuk/… atau kotak-masuk/<divisi>/… (divisinya harus sudah ada). Gak boleh keluar kantor, gak boleh folder rahasia/titik, gak lewat symlink.
export function tujuanAman(K, ke = 'masuk/drive') {
  const rel = String(ke).replace(/\\/g, '/').replace(/^\.\//, '').replace(/\/+$/, '');
  const bagian = rel.split('/');
  if (!rel || rel.startsWith('/') || bagian.some((b) => !b || b === '.' || b === '..' || b.startsWith('.') || !/^[\p{L}\p{N}._ -]+$/u.test(b))) gagal('Folder tujuannya gak valid. Pakai masuk/<nama> atau kotak-masuk/<divisi>/<nama>.');
  const akar = fs.realpathSync(K);
  const awal = bagian[0] === 'masuk' ? 1 : bagian[0] === 'kotak-masuk' && bagian.length >= 2 ? 2 : 0;
  if (!awal) gagal('Aku cuma nyimpen hasil unduhan di masuk/ atau kotak-masuk/<divisi>/.');
  const induk = path.join(akar, ...bagian.slice(0, awal));
  if (bagian[0] === 'kotak-masuk') { try { if (!fs.statSync(induk).isDirectory()) throw new Error(); } catch { gagal(`Divisi "${bagian[1]}" belum ada di kotak-masuk/.`); } }
  else fs.mkdirSync(induk, { recursive: true });
  const abs = path.join(akar, ...bagian);
  fs.mkdirSync(abs, { recursive: true });
  const nyata = fs.realpathSync(abs);
  if (nyata !== abs && !nyata.startsWith(`${akar}${path.sep}`)) gagal('Folder tujuannya gak valid.');
  if (!nyata.startsWith(`${path.join(akar, bagian[0])}${path.sep}`) && nyata !== path.join(akar, bagian[0])) gagal('Folder tujuannya gak valid.');
  return { abs: nyata, rel: bagian.join('/') };
}

function namaDariHeader(h) {
  const cd = String(h || '');
  const m = cd.match(/filename\*\s*=\s*(?:UTF-8|utf-8)''([^;]+)/i);
  if (m) { try { return decodeURIComponent(m[1].trim()); } catch {} }
  return cd.match(/filename\s*=\s*"([^"]*)"/i)?.[1] || cd.match(/filename\s*=\s*([^;]+)/i)?.[1]?.trim() || '';
}
function namaAman(mentah, cadangan) {
  let n = path.basename(String(mentah || '').replace(/\\/g, '/')).normalize('NFC').replace(/[^\p{L}\p{N}._ -]+/gu, '-').replace(/\s+/g, ' ').replace(/-{2,}/g, '-').trim().replace(/^[.\-\s]+/, '');
  if (n.length > 100) { const e = path.extname(n); n = `${n.slice(0, 100 - e.length)}${e}`; }
  return n || cadangan;
}

async function ambil(fetchFn, url, batasMs) {
  let u = url;
  for (let i = 0; i < 6; i++) {
    const h = new URL(u);
    if (h.protocol !== 'https:' || !HOST_BOLEH(h.hostname)) gagal('Google ngarahin unduhan ke alamat yang gak aku percaya, jadi aku berhenti.');
    let r;
    try { r = await fetchFn(u, { redirect: 'manual', signal: AbortSignal.timeout(batasMs), headers: { 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) Lembur-Kit', accept: '*/*' } }); }
    catch { gagal('Aku belum bisa nyambung ke Google Drive. Cek koneksi VPS, lalu coba lagi.'); }
    if (r.status >= 300 && r.status < 400) { const l = r.headers.get('location'); if (!l) gagal('Google ngasih jawaban yang gak aku ngerti.'); u = new URL(l, u).href; continue; }
    return { r, u };
  }
  gagal('Terlalu banyak pengalihan dari Google, jadi aku berhenti.');
}

// → { nama, ukuran, sha256, jalur }. fetchFn bisa diganti buat tes (tanpa jaringan).
export async function unduh(K, tautan, { ke = 'masuk/drive', nama = '', maksMB = MAKS_BAWAAN_MB, fetchFn = fetch, batasMs = 60000 } = {}) {
  const id = idDariTautan(tautan);
  const maks = Number(maksMB);
  if (!Number.isFinite(maks) || maks < 1 || maks > MAKS_PALING_BESAR_MB) gagal(`Batas ukuran harus 1 sampai ${MAKS_PALING_BESAR_MB} MB.`);
  const tujuan = tujuanAman(K, ke);
  let { r, u } = await ambil(fetchFn, `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`, batasMs);
  // Halaman konfirmasi (berkas besar / peringatan virus): kirim form-nya sekali.
  for (let putaran = 0; putaran < 2 && r.ok && /text\/html/i.test(r.headers.get('content-type') || ''); putaran++) {
    const html = (await r.text()).slice(0, 300000);
    const aksi = html.match(/<form[^>]*id="download-form"[^>]*action="([^"]+)"/i)?.[1];
    if (aksi) {
      const q = new URLSearchParams(); for (const m of html.matchAll(/<input[^>]*type="hidden"[^>]*name="([^"]+)"[^>]*value="([^"]*)"/gi)) q.set(m[1], m[2]);
      ({ r, u } = await ambil(fetchFn, `${new URL(aksi.replace(/&amp;/g, '&'), u).href.split('?')[0]}?${q}`, batasMs)); continue;
    }
    if (/quota exceeded|too many users have viewed or downloaded/i.test(html)) gagal('Google lagi membatasi unduhan berkas ini (terlalu sering diunduh). Coba lagi nanti.');
    gagal('Berkas ini belum dibagikan ke "siapa saja yang memiliki link". Ubah aksesnya di Google Drive (Bagikan → Siapa saja yang memiliki link), lalu coba lagi.');
  }
  if (r.status === 404) gagal('Berkasnya gak ketemu (tautan salah atau berkas sudah dihapus).');
  if (r.status === 401 || r.status === 403) gagal('Berkas ini belum dibagikan ke "siapa saja yang memiliki link". Ubah aksesnya di Google Drive, lalu coba lagi.');
  if (r.status === 429) gagal('Google lagi membatasi unduhan. Coba lagi nanti.');
  if (!r.ok) gagal(r.status >= 500 ? 'Google lagi gangguan. Coba lagi nanti.' : `Google menolak unduhan ini (${r.status}).`);
  const batas = maks * 1024 * 1024;
  const panjang = Number(r.headers.get('content-length'));
  if (Number.isFinite(panjang) && panjang > batas) { await r.body?.cancel?.().catch(() => {}); gagal(`Berkasnya lebih dari ${maks} MB. Naikin batasnya dengan --maks <MB> (paling besar ${MAKS_PALING_BESAR_MB}).`); }
  // Nama + jenis.
  const dariServer = namaDariHeader(r.headers.get('content-disposition'));
  let n = namaAman(nama || dariServer, `drive-${id.slice(0, 8)}`);
  let eks = path.extname(n).slice(1).toLowerCase();
  if (!eks) { const t = DARI_TIPE[String(r.headers.get('content-type') || '').split(';')[0].trim().toLowerCase()]; if (t) { n = `${n}.${t}`; eks = t; } }
  if (!EKSTENSI.has(eks)) { await r.body?.cancel?.().catch(() => {}); gagal(`Jenis berkas ".${eks || '?'}" gak aku unduh (cuma gambar, audio, video, dokumen, dan font).`); }
  // Tulis ke berkas sementara (ukuran dihitung tiap potongan), lalu pindah tanpa menimpa.
  const tmp = path.join(tujuan.abs, `.unduh-${process.pid}-${crypto.randomBytes(4).toString('hex')}`);
  const hash = crypto.createHash('sha256'); let ukuran = 0;
  const fd = fs.openSync(tmp, 'wx', 0o644);
  try {
    for await (const potong of r.body) {
      ukuran += potong.length;
      if (ukuran > batas) gagal(`Berkasnya lebih dari ${maks} MB, jadi unduhan dihentikan. Naikin batasnya dengan --maks <MB> (paling besar ${MAKS_PALING_BESAR_MB}).`);
      hash.update(potong); fs.writeSync(fd, potong);
    }
  } catch (e) { fs.closeSync(fd); fs.rmSync(tmp, { force: true }); throw e instanceof DriveGagal ? e : new DriveGagal('Unduhan terputus di tengah jalan. Coba lagi.'); }
  fs.closeSync(fd);
  if (!ukuran) { fs.rmSync(tmp, { force: true }); gagal('Berkasnya kosong. Cek tautannya.'); }
  let akhir = n; const dasar = path.basename(n, `.${eks}`);
  for (let i = 1; fs.existsSync(path.join(tujuan.abs, akhir)); i++) akhir = `${dasar}-${i}.${eks}`;
  fs.renameSync(tmp, path.join(tujuan.abs, akhir));
  const hasil = { nama: akhir, ukuran, sha256: hash.digest('hex'), jalur: `${tujuan.rel}/${akhir}` };
  try { fs.mkdirSync(path.join(K, 'catatan'), { recursive: true }); fs.appendFileSync(path.join(K, 'catatan/drive-unduh.jsonl'), `${JSON.stringify({ waktu: new Date().toISOString(), id, ...hasil })}\n`, { mode: 0o600 }); } catch {}
  return hasil;
}
