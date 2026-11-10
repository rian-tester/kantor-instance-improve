// Lembur.id: inti integrasi Repliz (dipakai alat/repliz.mjs & dashboard). Gak manggil AI, gak nyetak kunci.
// Kontrak API dari docs.repliz.com (Basic auth AccessKey:SecretKey, base https://api.repliz.com):
//   GET  /public/account                      daftar akun nyambung                  (Standard+)
//   GET  /public/account/{id}/statistic       statistik akun                        (Standard+)
// Media (gambar/video) GAK diunggah ke penyimpanan Repliz (butuh paket tambahan, dicek 05/10: "upgrade to get more
// storage"). Repliz ngambil sendiri pas jam tayang dari https://<alamat kantor>/publik/sosmed/<token>/<n>.<ext> (dilayani
// dashboard tanpa login, token acak per rencana, isi file dicocokin sha256 yang disetujuin). VPS harus nyala pas jam tayang.
//   POST /public/schedule, GET/DELETE /public/schedule/{id}                          (Premium+)
//   GET  /public/content?accountId=, GET /public/content/{id}/statistic?accountId=   (Gold+)
// Rencana posting ditulis tim sosmed di sosmed/terbit/<id>.json. Statusnya (cuma ditulis alat & dashboard) di
// sosmed/terbit/<id>.status.json. Owner nyetujuin di dashboard → sidik rencana dicatat di .rahasia/repliz-setuju.json;
// `jadwal` nolak kalau rencananya udah berubah dari yang disetujuin.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

export const API = (process.env.REPLIZ_API || 'https://api.repliz.com').replace(/\/$/, '');
// Batas per platform (sama kayak KlipDong lib/repliz/payload.ts & publisher Ale). Threads/X = teks aja.
export const PLATFORM = {
  instagram: { nama: 'Instagram', video: 'video', judul: 150, caption: 2200, gambarMaks: 10 },
  tiktok: { nama: 'TikTok', video: 'video', judul: 90, caption: 2200, gambarMaks: 35 },
  facebook: { nama: 'Facebook', video: 'reel', judul: 150, caption: 2000, gambarMaks: 10 },
  youtube: { nama: 'YouTube', video: 'video', judul: 100, caption: 5000, gambarMaks: 0 },
  threads: { nama: 'Threads', teks: true, judul: 150, caption: 500 },
  twitter: { nama: 'X', teks: true, judul: 150, caption: 280 },
  linkedin: { nama: 'LinkedIn', teks: true, judul: 150, caption: 3000 },
};
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.mp4': 'video/mp4', '.mov': 'video/quicktime' };
export const STATUS = { nunggu: 'Nunggu kamu setujuin', disetujui: 'Disetujui, nunggu Repliz', mengunggah: 'Lagi dijadwalin', terjadwal: 'Terjadwal', tayang: 'Tayang',
  sebagian: 'Sebagian gagal', gagal: 'Gagal', ditolak: 'Kamu tolak', batal: 'Dibatalin', rusak: 'Rencana belum lengkap' };

export function jalur(K) {
  return {
    kunci: path.join(K, '.rahasia/repliz.json'),
    setuju: path.join(K, '.rahasia/repliz-setuju.json'),
    terbit: path.join(K, 'sosmed/terbit'),
    performa: path.join(K, 'sosmed/performa'),
    akun: path.join(K, 'sosmed/.akun.json'),
  };
}
const bacaJson = (f, cadangan = null) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return cadangan; } };
export function tulisJson(f, isi, mode) {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  const tmp = `${f}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(isi, null, 1)}\n`, mode ? { mode } : undefined);
  fs.renameSync(tmp, f);
}
export const adaKunci = (K) => { const k = bacaJson(jalur(K).kunci); return !!(k && k.access && k.secret); };

// ---------- API ----------
export class ReplizGagal extends Error {
  constructor(jenis, pesan, kode = null) { super(pesan); this.jenis = jenis; this.kode = kode; }
}
function salah(kode, isi) {
  const asli = (isi && typeof isi === 'object' && typeof isi.message === 'string' ? isi.message : String(isi || '')).slice(0, 200);
  if (kode === 401) return new ReplizGagal('kunci', 'Kunci Repliz ditolak (salah ketik atau udah diganti). Isi ulang di dashboard → Sosmed.', kode);
  if (kode === 402 || kode === 403 || /plan|premium|gold|upgrade|subscription/i.test(asli)) {
    return new ReplizGagal('paket', `Paket Repliz kamu belum cukup buat ini (posting butuh Premium, angka per postingan butuh Gold).${asli ? ` Kata Repliz: "${asli}"` : ''}`, kode);
  }
  if (kode === 404) return new ReplizGagal('gak-ada', `Repliz: gak ketemu${asli ? ` (${asli})` : ''}.`, kode);
  if (kode === 429) return new ReplizGagal('sibuk', 'Repliz: kebanyakan permintaan, coba lagi beberapa menit lagi.', kode);
  if (kode >= 500) return new ReplizGagal('sibuk', `Repliz lagi gangguan (HTTP ${kode}). Coba lagi nanti.`, kode);
  return new ReplizGagal('lain', `Repliz nolak (HTTP ${kode})${asli ? `: ${asli}` : ''}.`, kode);
}
export function klien(kunci) {
  if (!kunci?.access || !kunci?.secret) throw new ReplizGagal('kunci', 'Repliz belum disambungin. Owner isi kuncinya di dashboard → Lainnya → Sosmed.');
  const auth = `Basic ${Buffer.from(`${kunci.access}:${kunci.secret}`).toString('base64')}`;
  return async function minta(jalan, { metode = 'GET', isi } = {}) {
    let r;
    try {
      r = await fetch(API + jalan, { method: metode, headers: { Authorization: auth, Accept: 'application/json', ...(isi ? { 'Content-Type': 'application/json' } : {}) },
        body: isi ? JSON.stringify(isi) : undefined, signal: AbortSignal.timeout(60000) });
    } catch (e) { throw new ReplizGagal('jaringan', `Gak bisa nyambung ke Repliz (${e.name === 'TimeoutError' ? 'kelamaan' : 'jaringan'}). Coba lagi nanti.`); }
    const teks = await r.text();
    let j = null;
    try { j = teks ? JSON.parse(teks) : null; } catch { j = teks; }
    if (!r.ok) throw salah(r.status, j);
    return j;
  };
}
export const klienKantor = (K) => klien(bacaJson(jalur(K).kunci));

export async function daftarAkun(minta) {
  const semua = [];
  for (let hal = 1; hal <= 20; hal += 1) {
    const d = (await minta(`/public/account?page=${hal}&limit=100`)) || {};
    for (const o of d.docs || []) {
      const id = o.id || o._id;
      if (id) semua.push({ id, platform: String(o.type || '').toLowerCase(), username: o.username || '', nama: o.name || '', nyambung: o.isConnected !== false });
    }
    if (!d.hasNextPage || !(d.docs || []).length) break;
  }
  return semua;
}

// ---------- rencana ----------
const potong = (t, n) => { t = String(t || '').trim(); return t.length <= n ? t : `${t.slice(0, n).replace(/\s+\S*$/, '').replace(/[ ,.;:]+$/, '')}…`; };
const cacheSha = new Map();
function shaFile(f) {
  const st = fs.statSync(f);
  const k = `${f}|${st.size}|${st.mtimeMs}`;
  if (!cacheSha.has(k)) cacheSha.set(k, crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'));
  return cacheSha.get(k);
}
// "2026-10-07 19:00" (WIB) → Date. Boleh juga ISO lengkap pakai zona.
export function waktuWib(s) {
  const m = String(s || '').trim().match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}):(\d{2})$/);
  const d = m ? new Date(`${m[1]}T${m[2]}:${m[3]}:00+07:00`) : new Date(String(s || ''));
  return Number.isNaN(d.getTime()) ? null : d;
}
// KIT_LOKAL (diisi dashboard sesuai bahasa pilihan, KD-121) ngubah bahasa tanggalnya; bawaan id-ID, jam selalu 24 jam.
export const tampilWib = (d) => new Intl.DateTimeFormat(process.env.KIT_LOKAL || 'id-ID', { timeZone: 'Asia/Jakarta', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d);

// Cocokin isian `akun` ("instagram", "@kopisenja", "instagram:@kopisenja", atau id Repliz) ke akun yang nyambung.
export function cocokAkun(isian, akun) {
  const hasil = []; const masalah = [];
  for (const a of [].concat(isian || [])) {
    const s = String(a).trim();
    const [p, u] = s.includes(':') ? s.split(':', 2) : [PLATFORM[s.toLowerCase()] ? s : '', PLATFORM[s.toLowerCase()] ? '' : s];
    const user = u.replace(/^@/, '').toLowerCase();
    const calon = akun.filter((x) => x.nyambung && (x.id === s || ((!p || x.platform === p.toLowerCase()) && (!user || x.username.toLowerCase().replace(/^@/, '') === user))));
    if (calon.length === 1) hasil.push(calon[0]);
    else masalah.push(calon.length ? `"${s}" cocok ke ${calon.length} akun, tulis lengkap (mis. ${calon[0].platform}:@${calon[0].username})` : `akun "${s}" gak ada / gak nyambung di Repliz`);
  }
  return { akun: hasil.filter((x, i) => hasil.findIndex((y) => y.id === x.id) === i), masalah };
}

// Baca & periksa satu rencana. akun = daftar akun Repliz (boleh null kalau belum nyambung: pemeriksaan akun dilewat).
export function periksa(K, id, akun = null) {
  const J = jalur(K);
  const r = bacaJson(path.join(J.terbit, `${id}.json`));
  const masalah = [];
  if (!r || typeof r !== 'object') return { id, masalah: ['file rencananya gak kebaca (JSON rusak?)'] };
  if (!String(r.caption || '').trim()) masalah.push('caption kosong');
  const waktu = waktuWib(r.waktu);
  if (!waktu) masalah.push('waktu gak kebaca (format: "2026-10-07 19:00", jam WIB)');
  const media = [];
  for (const f of [].concat(r.media || [])) {
    const abs = path.resolve(K, String(f));
    const ext = path.extname(abs).toLowerCase();
    if (!abs.startsWith(`${path.resolve(K)}${path.sep}`) || abs.includes(`${path.sep}.rahasia${path.sep}`)) { masalah.push(`media "${f}" di luar folder kantor`); continue; }
    if (!MIME[ext]) { masalah.push(`media "${f}": cuma boleh .png, .jpg, .mp4, .mov`); continue; }
    if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) { masalah.push(`media "${f}" gak ada`); continue; }
    media.push({ file: path.relative(K, abs), abs, mime: MIME[ext], video: MIME[ext].startsWith('video/'), ukuran: fs.statSync(abs).size, sha: shaFile(abs) });
  }
  const video = media.filter((m) => m.video);
  if (video.length && media.length > 1) masalah.push('video harus sendirian (1 video, tanpa gambar lain)');
  let tujuan = [];
  if (akun) {
    const c = cocokAkun(r.akun, akun);
    tujuan = c.akun; masalah.push(...c.masalah);
    if (!tujuan.length && !c.masalah.length) masalah.push('akun tujuan belum diisi');
    for (const a of tujuan) {
      const p = PLATFORM[a.platform];
      if (!p) masalah.push(`platform ${a.platform} belum didukung`);
      else if (!p.teks && !media.length) masalah.push(`${p.nama} butuh gambar atau video`);
      else if (!p.teks && !video.length && media.length > p.gambarMaks) masalah.push(p.gambarMaks ? `${p.nama} maksimal ${p.gambarMaks} gambar` : `${p.nama} cuma bisa video`);
    }
  } else if (![].concat(r.akun || []).length) masalah.push('akun tujuan belum diisi');
  const sidik = crypto.createHash('sha256').update(JSON.stringify({ judul: r.judul || '', caption: r.caption || '', akun: [].concat(r.akun || []),
    waktu: r.waktu || '', labelAI: !!r.labelAI, media: media.map((m) => [m.file, m.sha]) })).digest('hex');
  // `task` (opsional) = kode task asal, buat nyambungin persetujuan di halaman Konten ke task-nya. Gak masuk sidik.
  return { id, r, waktu, media, tujuan, masalah, sidik, task: String(r.task || '').trim() };
}

export function semuaRencana(K, akun = null) {
  const J = jalur(K);
  let f = [];
  try { f = fs.readdirSync(J.terbit).filter((x) => /^[a-z0-9][a-z0-9_-]{0,80}\.json$/i.test(x) && !x.endsWith('.status.json')); } catch { return []; }
  const setuju = bacaJson(J.setuju, {});
  return f.map((x) => {
    const id = x.replace(/\.json$/, '');
    const p = periksa(K, id, akun);
    const st = bacaJson(path.join(J.terbit, `${id}.status.json`), {});
    let status = st.status || 'nunggu';
    // Ditolak/dibatalin terus direvisi tim (isinya beda) → nunggu lagi.
    // 'disetujui' = owner udah setuju tapi Repliz belum nyambung (jadwal masuk pas kunci diisi); isi berubah = setuju ulang.
    if (['ditolak', 'batal', 'disetujui'].includes(status) && st.sidik && st.sidik !== p.sidik) status = 'nunggu';
    if (status === 'nunggu' && p.masalah.length) status = 'rusak';
    return { ...p, st, status, disetujui: setuju[id] === p.sidik };
  }).sort((a, b) => (a.waktu?.getTime() || 0) - (b.waktu?.getTime() || 0));
}
export const tulisStatus = (K, id, isi) => tulisJson(path.join(jalur(K).terbit, `${id}.status.json`), { ...isi, diperbarui: new Date().toISOString() });
export function catatSetuju(K, id, sidik) {
  const J = jalur(K);
  const s = bacaJson(J.setuju, {});
  s[id] = sidik;
  tulisJson(J.setuju, s, 0o600);
}

// ---------- jadwal ----------
export function alamatPublik() {
  const a = (process.env.KANTOR_ALAMAT || (() => { try { return fs.readFileSync(path.join(os.homedir(), '.kantor-alamat'), 'utf8'); } catch { return ''; } })()).trim();
  if (!a) throw new ReplizGagal('alamat', 'Alamat HTTPS kantor gak ketemu (~/.kantor-alamat), jadi Repliz gak bisa ngambil gambar/videonya.');
  return /^https?:\/\//.test(a) ? a.replace(/\/$/, '') : `https://${a}`;
}
const LAMA_PUBLIK = 3 * 86400000;
// Dipanggil dashboard buat /publik/sosmed/<token>/<nama>: file media rencana yang udah dijadwal, selama belum lewat
// 3 hari dari selesai, dan isinya masih sama persis kayak yang disetujuin. Selain itu null (404).
export function mediaPublik(K, token, nama) {
  if (!/^[0-9a-f]{36}$/.test(token) || !/^\d{1,2}\.[a-z0-9]{3,4}$/.test(nama)) return null;
  let f = [];
  try { f = fs.readdirSync(jalur(K).terbit).filter((x) => x.endsWith('.status.json')); } catch { return null; }
  for (const x of f) {
    const st = bacaJson(path.join(jalur(K).terbit, x), {});
    if (st.token !== token) continue;
    const m = (st.media || [])[Number(nama.split('.')[0]) - 1];
    if (!m || !m.url?.endsWith(`/${nama}`)) return null;
    const selesai = !(st.jadwal || []).some((h) => ['terjadwal', 'proses'].includes(h.status)) && st.status !== 'mengunggah';
    if (selesai && Date.now() - Date.parse(st.diperbarui || 0) > LAMA_PUBLIK) return null;
    const abs = path.resolve(K, m.file);
    if (!abs.startsWith(`${path.resolve(K)}${path.sep}`) || !fs.existsSync(abs) || shaFile(abs) !== m.sha) return null;
    return { abs, mime: m.mime, ukuran: fs.statSync(abs).size };
  }
  return null;
}

export function isiJadwal(p, a, url, waktuIso) {
  const P = PLATFORM[a.platform];
  const cap = potong(p.r.caption, P.caption);
  let tipe = 'text'; let medias = [];
  if (!P.teks) {
    const video = p.media.find((m) => m.video);
    if (video) { tipe = P.video; medias = [{ type: 'video', url: url[video.file] }]; }
    else {
      medias = p.media.map((m) => ({ alt: '', customThumbnail: false, type: 'image', thumbnail: url[m.file], url: url[m.file] }));
      tipe = medias.length > 1 ? 'album' : 'image';
    }
  }
  return { title: potong(p.r.judul || cap, P.judul), description: cap, topic: '', type: tipe, medias,
    additionalInfo: { isAiGenerated: !!p.r.labelAI, isDraft: false, tags: [] }, replies: [], accountId: a.id, scheduleAt: waktuIso };
}

// Dipanggil dashboard abis owner pencet "Setujui & jadwalkan". Link media dibikin sekali, dipakai semua akun.
export async function jadwal(K, id, { minta = klienKantor(K) } = {}) {
  const J = jalur(K);
  const akun = await daftarAkun(minta);
  const p = periksa(K, id, akun);
  if (p.masalah.length) throw new ReplizGagal('rencana', `Rencana ${id} belum bisa dijadwal: ${p.masalah.join('; ')}.`);
  if (bacaJson(J.setuju, {})[id] !== p.sidik) throw new ReplizGagal('setuju', `Rencana ${id} belum disetujuin owner (atau isinya berubah abis disetujuin). Setujuin di dashboard → Sosmed.`);
  const lama = bacaJson(path.join(J.terbit, `${id}.status.json`), {});
  const nyangkut = lama.status === 'mengunggah' && Date.now() - Date.parse(lama.mulai || 0) > 15 * 60000;
  const disetujui = lama.disetujui && lama.sidik === p.sidik ? lama.disetujui : new Date().toISOString();
  if (['terjadwal', 'tayang', 'sebagian', 'mengunggah'].includes(lama.status) && lama.sidik === p.sidik && !nyangkut) throw new ReplizGagal('dobel', `Rencana ${id} udah ${STATUS[lama.status].toLowerCase()}, gak dijadwal dobel.`);
  const minimal = Date.now() + 5 * 60000;
  const kapan = new Date(Math.max(p.waktu.getTime(), minimal));
  const dasar = alamatPublik();
  const token = crypto.randomBytes(18).toString('hex');
  const media = p.media.map((m, i) => ({ file: m.file, sha: m.sha, mime: m.mime, url: `${dasar}/publik/sosmed/${token}/${i + 1}${path.extname(m.file).toLowerCase()}` }));
  const url = Object.fromEntries(media.map((m) => [m.file, m.url]));
  tulisStatus(K, id, { status: 'mengunggah', sidik: p.sidik, disetujui, mulai: new Date().toISOString(), token, media });
  try {
    // Pastiin link medianya kebuka dari internet sebelum dijadwal (kalau gak, Repliz gagal pas jam tayang).
    for (const m of media) {
      const r = await fetch(m.url, { method: 'HEAD', signal: AbortSignal.timeout(20000) }).catch(() => null);
      if (!r || !r.ok) throw new ReplizGagal('alamat', `Link media ${m.file} gak kebuka dari internet (${r ? `HTTP ${r.status}` : 'gak nyambung'}), jadi Repliz gak bisa ngambil. Cek alamat HTTPS dashboard.`);
    }
    const hasil = [];
    for (const a of p.tujuan) {
      try {
        const d = (await minta('/public/schedule', { metode: 'POST', isi: isiJadwal(p, a, url, kapan.toISOString()) })) || {};
        const sid = d.scheduleId || d.id || d._id;
        hasil.push(sid ? { akunId: a.id, platform: a.platform, username: a.username, scheduleId: sid, status: 'terjadwal' }
          : { akunId: a.id, platform: a.platform, username: a.username, status: 'gagal', pesan: 'Repliz nerima tapi gak balikin id jadwal. Cek app Repliz sebelum nyoba lagi.' });
      } catch (e) { hasil.push({ akunId: a.id, platform: a.platform, username: a.username, status: 'gagal', pesan: e.message }); }
    }
    const ok = hasil.filter((h) => h.status === 'terjadwal').length;
    const status = ok === hasil.length ? 'terjadwal' : ok ? 'sebagian' : 'gagal';
    tulisStatus(K, id, { status, sidik: p.sidik, disetujui, waktuTayang: kapan.toISOString(), dimajuin: kapan.getTime() !== p.waktu.getTime(), token, media, jadwal: hasil });
    return { status, kapan, hasil };
  } catch (e) {
    tulisStatus(K, id, { status: 'gagal', sidik: p.sidik, disetujui, pesan: e.message, token, media, jadwal: [] });
    throw e;
  }
}

// Perbarui status jadwal yang belum final. GAK nyoba ulang sendiri: error TikTok kadang bohong (tetap tayang), jadi
// coba ulang = bisa tayang dobel. Owner yang mutusin (cek app dulu).
export async function cek(K, { minta = klienKantor(K) } = {}) {
  const berubah = [];
  for (const p of semuaRencana(K)) {
    if (!['terjadwal', 'sebagian'].includes(p.status) || !p.st.jadwal?.some((h) => ['terjadwal', 'proses'].includes(h.status))) continue;
    const jadwalBaru = [];
    for (const h of p.st.jadwal) {
      if (!['terjadwal', 'proses'].includes(h.status) || !h.scheduleId) { jadwalBaru.push(h); continue; }
      try {
        const d = (await minta(`/public/schedule/${encodeURIComponent(h.scheduleId)}`)) || {};
        const s = { success: 'tayang', error: 'gagal', process: 'proses', pending: 'terjadwal' }[d.status] || h.status;
        jadwalBaru.push({ ...h, status: s, ...(d.postId ? { postId: d.postId } : {}), ...(s === 'gagal' ? { pesan: d.errorMessage || 'Repliz gak ngasih alasan.' } : {}),
          ...(s === 'tayang' && !h.tayangPada ? { tayangPada: new Date().toISOString() } : {}) });
      } catch (e) { jadwalBaru.push(h); if (e.jenis === 'kunci') throw e; }
    }
    const sisa = jadwalBaru.filter((h) => ['terjadwal', 'proses'].includes(h.status)).length;
    const gagal = jadwalBaru.filter((h) => h.status === 'gagal').length;
    const status = sisa ? (gagal ? 'sebagian' : 'terjadwal') : gagal === jadwalBaru.length ? 'gagal' : gagal ? 'sebagian' : 'tayang';
    const baruTayang = jadwalBaru.filter((h, i) => h.status === 'tayang' && p.st.jadwal[i].status !== 'tayang');
    const baruGagal = jadwalBaru.filter((h, i) => h.status === 'gagal' && p.st.jadwal[i].status !== 'gagal');
    if (baruTayang.length || baruGagal.length || status !== p.st.status) {
      tulisStatus(K, p.id, { ...p.st, status, jadwal: jadwalBaru });
      berubah.push({ id: p.id, judul: p.r.judul || p.r.caption.slice(0, 40), status, baruTayang, baruGagal });
    }
  }
  return berubah;
}

export async function batal(K, id, { minta = klienKantor(K) } = {}) {
  const st = bacaJson(path.join(jalur(K).terbit, `${id}.status.json`), {});
  const jadwalBaru = [];
  for (const h of st.jadwal || []) {
    if (h.status === 'terjadwal' && h.scheduleId) {
      try { await minta(`/public/schedule/${encodeURIComponent(h.scheduleId)}`, { metode: 'DELETE' }); jadwalBaru.push({ ...h, status: 'batal' }); } catch (e) { jadwalBaru.push({ ...h, pesan: `gagal dibatalin: ${e.message}` }); }
    } else jadwalBaru.push(h);
  }
  const masih = jadwalBaru.some((h) => h.status === 'terjadwal');
  tulisStatus(K, id, { ...st, status: masih ? st.status : 'batal', jadwal: jadwalBaru });
  return !masih;
}

// ---------- performa ----------
const angkaSaja = (o) => Object.fromEntries(Object.entries(o || {}).filter(([, v]) => typeof v === 'number' && Number.isFinite(v)));
// Statistik akun: angka langsung + {total} (Threads views/clicks) + jumlah 7 hari dari metrics harian (TikTok).
function statAkun(o) {
  const hasil = angkaSaja(o);
  for (const [k, v] of Object.entries(o || {})) if (v && typeof v === 'object' && typeof v.total === 'number') hasil[k] = v.total;
  if (Array.isArray(o?.metrics) && o.metrics.length) {
    for (const k of ['videoViews', 'profileViews', 'likes', 'comments', 'shares', 'dailyNewFollowers']) {
      const n = o.metrics.reduce((a, m) => a + (typeof m[k] === 'number' ? m[k] : 0), 0);
      hasil[`${k}${o.metrics.length}Hari`] = n;
    }
  }
  return hasil;
}
const utama = (a) => a.views ?? a.impression ?? a.reach ?? a.like ?? 0;

// Ambil angka: statistik tiap akun (Standard+), konten terbaru tiap akun + angkanya (Gold+), ditandain mana yang dari
// kantor. Hasil: sosmed/performa/<tanggal>.json + terbaru.json + terbaru.md (dibaca tim sosmed buat laporan).
export async function performa(K, { minta = klienKantor(K), maksPerAkun = 10 } = {}) {
  const J = jalur(K);
  const akun = (await daftarAkun(minta)).filter((a) => a.nyambung);
  const dariKantor = new Map();
  for (const p of semuaRencana(K)) for (const h of p.st.jadwal || []) if (h.postId) dariKantor.set(`${h.akunId}|${h.postId}`, { id: p.id, ...h });
  const catatan = []; const hasilAkun = []; const konten = [];
  let gold = true;
  for (const a of akun) {
    let stat = null;
    try { stat = statAkun(await minta(`/public/account/${encodeURIComponent(a.id)}/statistic`)); } catch (e) {
      // 404 = platform ini belum punya statistik akun di Repliz (FB/YouTube per 05/10), bukan error.
      if (e.jenis !== 'gak-ada') catatan.push(`statistik akun ${a.platform} @${a.username}: ${e.message}`);
    }
    hasilAkun.push({ platform: a.platform, username: a.username, statistik: stat });
    if (!gold) continue;
    let docs = [];
    try { docs = ((await minta(`/public/content?accountId=${encodeURIComponent(a.id)}`)) || {}).docs || []; } catch (e) {
      if (e.jenis === 'paket') { gold = false; catatan.push('Angka per postingan butuh paket Repliz Gold. Sekarang cuma statistik akun.'); continue; }
      catatan.push(`daftar konten ${a.platform} @${a.username}: ${e.message}`); continue;
    }
    for (const c of docs.slice(0, maksPerAkun)) {
      let angka = null;
      try { angka = angkaSaja(await minta(`/public/content/${encodeURIComponent(c.id)}/statistic?accountId=${encodeURIComponent(a.id)}`)); } catch (e) {
        if (e.jenis === 'paket') { gold = false; catatan.push('Angka per postingan butuh paket Repliz Gold.'); break; }
        catatan.push(`angka ${a.platform} ${c.id}: ${e.message}`);
      }
      const k = dariKantor.get(`${a.id}|${c.id}`);
      konten.push({ platform: a.platform, username: a.username, akunId: a.id, id: c.id, url: c.url || '', tayang: c.createdAt || '', tipe: c.type || '',
        teks: potong(c.title || c.description || '', 120), dariKantor: k ? k.id : null, angka });
    }
  }
  // Postingan dari kantor yang gak muncul di daftar konten (mis. belum Gold, atau udah lewat halaman 1): ambil langsung.
  if (gold) {
    for (const [kunci, h] of dariKantor) {
      if (konten.some((c) => `${c.akunId}|${c.id}` === kunci)) continue;
      try {
        const angka = angkaSaja(await minta(`/public/content/${encodeURIComponent(h.postId)}/statistic?accountId=${encodeURIComponent(h.akunId)}`));
        konten.push({ platform: h.platform, username: h.username, akunId: h.akunId, id: h.postId, url: '', tayang: h.tayangPada || '', tipe: '', teks: '', dariKantor: h.id, angka });
      } catch (e) { if (e.jenis === 'paket') break; catatan.push(`angka ${h.platform} ${h.postId}: ${e.message}`); }
    }
  }
  konten.sort((x, y) => utama(y.angka || {}) - utama(x.angka || {}));
  const tgl = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
  const isi = { waktu: new Date().toISOString(), akun: hasilAkun, konten, catatan };
  tulisJson(path.join(J.performa, `${tgl}.json`), isi);
  tulisJson(path.join(J.performa, 'terbaru.json'), isi);
  fs.writeFileSync(path.join(J.performa, 'terbaru.md'), mdPerforma(isi));
  return isi;
}

const fmt = (n) => (typeof n === 'number' ? new Intl.NumberFormat('id-ID').format(n) : '-');
export function mdPerforma(isi) {
  const baris = [`# Performa sosmed (diambil ${tampilWib(new Date(isi.waktu))} WIB, dari Repliz)`, '',
    'Angka asli dari Repliz, bukan perkiraan. Jangan dikarang kalau kosong. "dari kantor" = rencana di sosmed/terbit/.', '', '## Akun', ''];
  for (const a of isi.akun) {
    const s = a.statistik || {};
    const pilih = Object.entries(s).filter(([k]) => /follow|views|reach|likes|comments|shares|saves|interactions|engaged|videosCount|totalLikes|clicks/i.test(k)).slice(0, 10);
    baris.push(`- ${PLATFORM[a.platform]?.nama || a.platform} @${a.username}: ${pilih.length ? pilih.map(([k, v]) => `${k} ${fmt(v)}`).join(', ') : 'statistik akun belum ada (Repliz belum nyediain buat platform ini)'}`);
  }
  baris.push('', '## Postingan (urut dari yang paling banyak ditonton)', '');
  if (!isi.konten.length) baris.push('(belum ada angka per postingan)');
  else {
    baris.push('| platform | tayang | teks | views | like | komen | share | simpan | dari kantor |', '|---|---|---|---|---|---|---|---|---|');
    for (const c of isi.konten.slice(0, 40)) {
      const a = c.angka || {};
      baris.push(`| ${c.platform} @${c.username} | ${c.tayang ? c.tayang.slice(0, 10) : '-'} | ${(c.teks || '').replace(/\|/g, '/').replace(/\s+/g, ' ')}${c.url ? ` ([buka](${c.url}))` : ''} | ${fmt(a.views ?? a.impression ?? a.reach)} | ${fmt(a.like)} | ${fmt(a.comment ?? a.replies)} | ${fmt(a.share ?? a.repost)} | ${fmt(a.saved ?? a.favourite ?? a.bookmark)} | ${c.dariKantor || '-'} |`);
    }
  }
  if (isi.catatan.length) baris.push('', '## Catatan', '', ...isi.catatan.map((c) => `- ${c}`));
  return `${baris.join('\n')}\n`;
}

// ---------- pesan masuk ----------
const idPesan = (id) => /^(dm|komen)-[a-z0-9][a-z0-9_-]{0,160}$/i.test(id);
function jenisPesan(jenis) {
  if (!['dm', 'komen'].includes(jenis)) throw new ReplizGagal('pesan', 'Jenis pesan harus dm atau komen.');
  return jenis === 'dm' ? 'chat' : 'comment';
}
export function teksBalasan(teks) {
  if (typeof teks !== 'string' || !teks.trim() || [...teks.trim()].length > 1000) throw new ReplizGagal('pesan', 'Isi balasan 1 sampai 1000 huruf.');
  return teks.trim();
}
export async function kotakMasuk(minta, akunId, jenis) {
  const endpoint = jenisPesan(jenis); const hasil = [];
  for (let page = 1; page <= 100; page += 1) {
    let d;
    try { d = await minta(`/public/${endpoint}?page=${page}&limit=50&status=${jenis === 'dm' ? 'unreplied' : 'pending'}&accountIds[]=${encodeURIComponent(akunId)}`); }
    catch (e) { if (e.jenis === 'paket') throw new ReplizGagal('paket', 'Balas DM butuh Repliz paket Gold', e.kode); throw e; }
    const docs = d?.docs || d?.data || [];
    for (const o of docs) {
      const id = o._id || o.id;
      if (typeof id !== 'string' || !idPesan(`${jenis}-${id}`)) continue;
      hasil.push({ id, jenis, akun: akunId, nama: typeof o.senderName === 'string' ? o.senderName : '',
        teks: String((jenis === 'dm' ? o.lastMessage?.text : o.comment?.text) || ''),
        waktu: (jenis === 'dm' ? o.lastMessage?.sendAt : o.comment?.sendAt) || null });
    }
    if (!d.hasNextPage || !docs.length) break;
  }
  return hasil;
}
export async function kirimBalasan(minta, jenis, id, teks) {
  const endpoint = jenisPesan(jenis);
  if (!idPesan(`${jenis}-${id}`)) throw new ReplizGagal('pesan', 'ID pesan gak valid.');
  teks = teksBalasan(teks);
  return minta(`/public/${endpoint}/${encodeURIComponent(id)}${jenis === 'dm' ? '/message' : ''}`, { metode: 'POST', isi: jenis === 'dm' ? { type: 'text', text: teks } : { text: teks } });
}
const folderMasuk = (K) => path.join(K, 'sosmed/masuk');
export function bacaPesan(K, id) {
  if (!idPesan(id)) throw new ReplizGagal('pesan', 'ID pesan gak valid.');
  const p = bacaJson(path.join(folderMasuk(K), `${id}.json`));
  if (!p || `${p.jenis}-${p.id}` !== id) throw new ReplizGagal('pesan', 'Pesan gak ketemu.');
  return p;
}
export function semuaPesan(K) {
  let files; try { files = fs.readdirSync(folderMasuk(K)); } catch { return []; }
  return files.filter((f) => f.endsWith('.json') && idPesan(f.slice(0, -5))).flatMap((f) => {
    try { return [bacaPesan(K, f.slice(0, -5))]; } catch { return []; }
  });
}
const simpanPesan = (K, p) => tulisJson(path.join(folderMasuk(K), `${p.jenis}-${p.id}.json`), p);
export async function ambilPesan(K, { minta = klienKantor(K) } = {}) {
  const catatan = []; let jumlah = 0;
  for (const a of (await daftarAkun(minta)).filter((x) => x.nyambung)) {
    for (const jenis of ['dm', 'komen']) {
      try {
        const kini = await kotakMasuk(minta, a.id, jenis);
        for (const p of kini) {
          let lama; try { lama = bacaPesan(K, `${jenis}-${p.id}`); } catch { lama = null; }
          // Pesan pelanggan baru pada thread yang sama perlu diperiksa ulang oleh agen.
          const sama = lama && lama.teks === p.teks && lama.waktu === p.waktu;
          simpanPesan(K, { ...p, platform: a.platform, username: a.username, status: 'baru', ...(sama ? { draf: lama.draf, aman: lama.aman, status: lama.status, terkirim: lama.terkirim } : {}) });
          jumlah += 1;
        }
        // Udah gak ada di daftar belum-dibalas = udah dibalas di luar dashboard (app IG/TikTok, Repliz): jangan dikirim lagi.
        const ada = new Set(kini.map((p) => p.id));
        for (const p of semuaPesan(K)) if (p.akun === a.id && p.jenis === jenis && ['baru', 'nunggu'].includes(p.status) && !ada.has(p.id)) simpanPesan(K, { ...p, status: 'kedaluwarsa' });
      } catch (e) { if (e.jenis !== 'paket') throw e; if (!catatan.includes(e.message)) catatan.push(e.message); }
    }
  }
  return { jumlah, catatan };
}
export function drafPesan(K, id, teks, { aman = false, lewati = false } = {}) {
  const p = bacaPesan(K, id);
  if (p.status === 'terkirim') throw new ReplizGagal('pesan', 'Pesan ini udah dibalas.');
  simpanPesan(K, { ...p, draf: lewati ? '' : teksBalasan(teks), aman: !lewati && aman === true, status: lewati ? 'dilewati' : 'nunggu' });
}
export const otomatisNyala = (K) => bacaJson(path.join(K, '.rahasia/sosmed-balas.json'), {}).nyala === true;
export const setelOtomatis = (K, nyala) => tulisJson(path.join(K, '.rahasia/sosmed-balas.json'), { nyala: nyala === true }, 0o600);
const balasSibuk = new Set();
export async function balasPesan(K, id, teks, { minta = klienKantor(K), otomatis = false } = {}) {
  const k = `${K}/${id}`;
  if (balasSibuk.has(k)) throw new ReplizGagal('pesan', 'Balasan lagi dikirim.');
  balasSibuk.add(k);
  try {
    const p = bacaPesan(K, id);
    if (!['baru', 'nunggu'].includes(p.status)) throw new ReplizGagal('pesan', 'Pesan ini udah diproses.');
    if (otomatis && (!otomatisNyala(K) || p.aman !== true || p.status !== 'nunggu' || /\[OWNER:/i.test(p.draf))) return false;
    teks = teksBalasan(otomatis ? p.draf : teks);
    await kirimBalasan(minta, p.jenis, p.id, teks);
    const waktu = new Date().toISOString();
    simpanPesan(K, { ...p, draf: teks, status: 'terkirim', terkirim: waktu });
    if (otomatis) {
      fs.mkdirSync(path.join(K, 'catatan'), { recursive: true });
      fs.appendFileSync(path.join(K, 'catatan/sosmed-balas.log'), `${JSON.stringify({ waktu, id, teks })}\n`);
    }
    return true;
  } finally { balasSibuk.delete(k); }
}
export async function balasOtomatis(K, opsi = {}) {
  if (!otomatisNyala(K)) return;
  const calon = semuaPesan(K).filter((p) => p.status === 'nunggu' && p.aman === true);
  if (!calon.length) return;
  const minta = opsi.minta || klienKantor(K);
  // Cek ulang ke Repliz sebelum kirim: pesan yang udah dibalas di luar dashboard atau dapet pesan baru dari pelanggan
  // gak boleh kebales draf lama. Gagal cek = jangan kirim dulu, coba lagi putaran berikutnya.
  const daftar = new Map();
  for (const p of calon) {
    const k = `${p.akun}|${p.jenis}`;
    if (!daftar.has(k)) { try { daftar.set(k, await kotakMasuk(minta, p.akun, p.jenis)); } catch { daftar.set(k, null); } }
    const kini = daftar.get(k);
    if (!kini) continue;
    const x = kini.find((q) => q.id === p.id);
    if (!x) { simpanPesan(K, { ...p, status: 'kedaluwarsa' }); continue; }
    if (x.teks !== p.teks || x.waktu !== p.waktu) { simpanPesan(K, { ...p, ...x, draf: '', aman: false, status: 'baru' }); continue; }
    try { await balasPesan(K, `${p.jenis}-${p.id}`, p.draf, { ...opsi, minta, otomatis: true }); } catch { /* Tetap nunggu, owner bisa mencoba lagi. */ }
  }
}
