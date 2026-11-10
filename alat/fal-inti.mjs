// Inti fal untuk alat & dashboard. Kunci dan persetujuan cuma ditulis dashboard.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {MIME_AUDIO, berkasKantor, durasiAudio, transkripData} from './fal-suara.mjs';

const API = (process.env.FAL_API || 'https://api.fal.ai').replace(/\/$/, '');
const QUEUE = (process.env.FAL_QUEUE || 'https://queue.fal.run').replace(/\/$/, '');
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.mp3': 'audio/mpeg', '.json': 'application/json' };
export class FalGagal extends Error {}
const gagal = (pesan) => { throw new FalGagal(pesan); };
export const baca = (f, cadangan = null) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return cadangan; } };
export function tulis(f, isi, mode = 0o600) {
  fs.mkdirSync(path.dirname(f), { recursive: true, mode: 0o700 });
  const tmp = `${f}.${crypto.randomBytes(6).toString('hex')}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(isi, null, 2)}\n`, { mode });
  fs.renameSync(tmp, f);
}
export const jalur = (K) => ({ kunci: path.join(K, '.rahasia/fal.json'), setuju: path.join(K, '.rahasia/fal-setuju.json'),
  setelan: path.join(K, 'setelan/fal.json'), biaya: path.join(K, 'catatan/fal-biaya.jsonl'), antre: path.join(K, 'konten/fal-antrean'), hasil: path.join(K, 'konten/fal') });
export const hariWib = (waktu = new Date()) => new Date(new Date(waktu).getTime() + 7 * 3600000).toISOString().slice(0, 10);
export function riwayat(K) {
  try { return fs.readFileSync(jalur(K).biaya, 'utf8').trim().split('\n').filter(Boolean).map((s) => JSON.parse(s)); }
  catch (e) { if (e.code === 'ENOENT') return []; gagal('Catatan biaya fal gak kebaca. Aku berhenti biar batas belanja tetap aman.'); }
}
const sidikKunci = key => crypto.createHash('sha256').update(key).digest('hex');
const waktuSah = waktu => Number.isFinite(Date.parse(waktu)) ? new Date(waktu).toISOString() : null;
function pemakaianKunci(K, key, biaya) {
  const catatan = baca(path.join(K, 'catatan/fal-kunci.json'));
  const cocok = !!key && catatan?.sidikKunci === sidikKunci(key);
  const terakhir = cocok && waktuSah(catatan.terakhir?.waktu) && ['berhasil', 'ditolak', 'gagal'].includes(catatan.terakhir?.hasil)
    ? {waktu: waktuSah(catatan.terakhir.waktu), hasil: catatan.terakhir.hasil, httpStatus: Number.isInteger(catatan.terakhir.httpStatus) ? catatan.terakhir.httpStatus : null} : null;
  const waktuBiaya = status => biaya.filter(r => r.status === status).map(r => r.waktu).sort((a, b) => Date.parse(b) - Date.parse(a))[0];
  const waktuRiwayat = status => waktuSah(waktuBiaya(status));
  const terakhirBerhasil = cocok ? waktuSah(catatan.terakhirBerhasil) : waktuRiwayat('selesai');
  const terakhirGagal = cocok ? waktuSah(catatan.terakhirGagal) : waktuRiwayat('gagal');
  const pesan = !key ? 'Kunci fal belum diisi. Kamu bisa isi di dashboard → Gambar & video AI (fal).'
    : terakhir?.hasil === 'ditolak' ? 'Kunci ditolak fal pada pemakaian terakhir. Kamu bisa isi ulang di dashboard → Gambar & video AI (fal).'
    : terakhir?.hasil === 'gagal' ? 'Permintaan fal terakhir gagal. Ini belum berarti kuncinya salah. Lihat waktu dan HTTP status di riwayat pemakaian.'
    : terakhir?.hasil === 'berhasil' ? 'Permintaan fal terakhir berhasil. Ini riwayat pemakaian, bukan pemeriksaan kunci saat ini.'
    : terakhirBerhasil || terakhirGagal ? 'Riwayat lama belum terhubung ke kunci yang sekarang tersimpan. Aku belum memastikan kuncinya sah.'
    : 'Kunci tersimpan, tetapi belum ada riwayat pemakaian. Aku belum memastikan kuncinya sah.';
  return {diperiksaLangsung: false, untukKunciSaatIni: cocok, terakhir, terakhirBerhasil, terakhirGagal, pesan};
}
function catatPemakaianKunci(K, key, hasil, httpStatus = null) {
  const file = path.join(K, 'catatan/fal-kunci.json'), sidik = sidikKunci(key);
  const lama = baca(file, {}), waktu = new Date().toISOString();
  const catatan = lama?.sidikKunci === sidik ? lama : {};
  tulis(file, {sidikKunci: sidik, terakhir: {waktu, hasil, httpStatus},
    terakhirBerhasil: hasil === 'berhasil' ? waktu : waktuSah(catatan.terakhirBerhasil),
    terakhirGagal: hasil !== 'berhasil' ? waktu : waktuSah(catatan.terakhirGagal)});
}
export function status(K, waktu = new Date()) {
  const setelan = fs.existsSync(jalur(K).setelan) ? baca(jalur(K).setelan) : { batasHarianUsd: 2 };
  const batas = setelan?.batasHarianUsd;
  if (!Number.isFinite(batas) || batas <= 0 || batas > 500) gagal('Batas fal gak sah. Kamu bisa simpan ulang di dashboard.');
  const akhir = new Map(), biaya = riwayat(K);
  for (const r of biaya) {
    if (!r?.id || !Number.isFinite(r.estimasi) || r.estimasi <= 0 || !Number.isFinite(Date.parse(r.waktu))) gagal('Catatan biaya fal gak sah. Aku berhenti dulu.');
    if (hariWib(r.waktu) === hariWib(waktu)) akhir.set(r.id, r);
  }
  const kepakeHariIni = Math.round([...akhir.values()].reduce((n, r) => n + (r.ditagih === false ? 0 : r.estimasi), 0) * 1000000) / 1000000;
  if (!Number.isFinite(kepakeHariIni)) gagal('Catatan biaya fal gak sah. Aku berhenti dulu.');
  const key = baca(jalur(K).kunci)?.key;
  return { kunciAda: !!key, batasHarianUsd: batas, kepakeHariIni, pemakaianKunci: pemakaianKunci(K, key, biaya) };
}
export function simpanBatas(K, angka) {
  if (!Number.isFinite(angka) || angka <= 0 || angka > 500) gagal('Isi batas harian di atas 0 sampai US$500.');
  tulis(jalur(K).setelan, { batasHarianUsd: angka });
}
export function simpanKunci(K, key) {
  if (typeof key !== 'string' || key.length < 8 || key.length > 500 || /\s/.test(key)) gagal('Kunci fal belum lengkap. Kamu bisa tempel ulang.');
  tulis(jalur(K).kunci, { key });
}
export function ekorKunci(K) { return baca(jalur(K).kunci)?.key?.slice(-4) || ''; }
export function pesanAman(K, teks) {
  const key = baca(jalur(K).kunci)?.key;
  return key ? String(teks).split(key).join('[kunci disembunyikan]') : String(teks);
}
async function minta(K, url, { method = 'GET', body, auth = true, bolehTidakAda = false } = {}) {
  const key = baca(jalur(K).kunci)?.key;
  if (auth && !key) gagal('fal belum nyambung. Kamu bisa isi kunci di dashboard → Gambar & video AI (fal).');
  let r;
  try { r = await fetch(url, { method, redirect: 'error', headers: { ...(auth ? { Authorization: `Key ${key}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(30000) }); }
  catch { if (auth) catatPemakaianKunci(K, key, 'gagal'); gagal('Aku gak bisa nyambung ke fal. Coba lagi nanti.'); }
  if (auth) catatPemakaianKunci(K, key, r.ok ? 'berhasil' : r.status === 401 ? 'ditolak' : 'gagal', r.status);
  if (!r.ok) {
    if (r.status === 404 && bolehTidakAda) return r;
    const teks = await r.text();
    if (r.status === 401) gagal('kunci fal salah. Kamu bisa isi ulang di dashboard.');
    if (r.status === 402 || /balance|insufficient|credit|billing/i.test(teks)) gagal('saldo fal habis, isi di fal.ai/dashboard/billing');
    gagal(`fal nolak permintaan (HTTP ${r.status}). Kamu bisa coba lagi nanti.`);
  }
  return r;
}
export async function harga(K, endpoints) {
  if (!endpoints.length || endpoints.some((s) => !/^[a-z0-9][a-z0-9_./-]{0,180}$/i.test(s))) gagal('Isi endpoint fal yang sah.');
  const hasil = [];
  for (let i = 0; i < endpoints.length; i += 10) {
    if (i) await new Promise((ok) => setTimeout(ok, 1000));
    const q = new URLSearchParams(); endpoints.slice(i, i + 10).forEach((id) => q.append('endpoint_id', id));
    const d = await (await minta(K, `${API}/v1/models/pricing?${q}`)).json();
    if (!Array.isArray(d.prices)) gagal('Harga fal gak kebaca. Aku gak akan generate dulu.');
    hasil.push(...d.prices.map((p) => ({ endpoint_id: p.endpoint_id, unit_price: p.unit_price, unit: p.unit, currency: p.currency })));
  }
  return hasil;
}
export async function cekKunci(K) { await harga(K, ['fal-ai/flux/schnell']); }
export const modelKurasi = () => baca(new URL('./fal-model.json', import.meta.url));
export async function statusModel(K, id) {
  const response = await minta(K, `${API}/v1/models?${new URLSearchParams({ endpoint_id: id })}`, { bolehTidakAda: true });
  if (response.status === 404) return 'tidak-ditemukan';
  const d = await response.json();
  if (!Array.isArray(d.models)) gagal('Aku gak bisa membaca status model fal. Coba lagi nanti.');
  const model = d.models.find((m) => m.endpoint_id === id);
  if (!model) return 'tidak-ditemukan';
  // Beberapa model ada di fal (halaman, harga, generate jalan) tapi daftar /v1/models cuma ngasih endpoint_id tanpa metadata,
  // mis. fal-ai/veo3.1/*. Itu bukan "pensiun": model pensiun datang sebagai metadata.status deprecated, endpoint yang gak ada = 404.
  return model.metadata?.status ?? model.status ?? 'tanpa-status';
}
export const modelBolehJalan = (status) => status === 'active' || status === 'tanpa-status';
async function pastikanAktif(K, id) {
  if (!modelBolehJalan(await statusModel(K, id))) gagal('Aku gak menjalankan model ini karena udah dipensiunin fal atau gak aktif. Kamu bisa pilih model lain atau update kit.');
}
export async function daftarModel(K) {
  const models = modelKurasi();
  const prices = await harga(K, models.map((m) => m.endpoint_id));
  const hasil = [];
  for (const m of models) hasil.push({ ...m, status: await statusModel(K, m.endpoint_id), harga: prices.find((p) => p.endpoint_id === m.endpoint_id) || null });
  return hasil;
}
export async function modelHarian(K) {
  const file = path.join(K, 'catatan/fal-model-cache.json');
  const cache = baca(file);
  const sidik = crypto.createHash('sha256').update(JSON.stringify(modelKurasi())).digest('hex');
  if (cache?.hari === hariWib() && cache.sidik === sidik && cache.v === 2 && Array.isArray(cache.models)) return cache;
  const baru = { hari: hariWib(), sidik, v: 2, models: await daftarModel(K) };
  tulis(file, baru);
  return baru;
}
export function durasiDetik(model, input) {
  const d = input.duration;
  if (model?.pemetaan?.durasi.format === 'Ns') return typeof d === 'string' && /^\d+s$/.test(d) ? Number(d.slice(0, -1)) : NaN;
  return Number(d);
}
export function inputVideo(model, opsi) {
  const p = model?.pemetaan;
  if (!p) gagal('Pemetaan model video belum ada. Kamu perlu update kit.');
  if (typeof opsi.prompt !== 'string' || !opsi.prompt.trim() || opsi.prompt.length > p.promptMaks) gagal(`Isi prompt video antara 1 sampai ${p.promptMaks} karakter.`);
  const durasi = Number(opsi.durasi ?? p.durasi.bawaan);
  const sah = p.durasi.batas ? durasi >= p.durasi.batas[0] && durasi <= p.durasi.batas[1] : p.durasi.nilai.includes(durasi);
  if (!Number.isFinite(durasi) || !sah) gagal('Durasi gak sesuai model video yang kamu pilih. Cek daftar model dulu.');
  const input = { prompt: opsi.prompt.trim(), duration: p.durasi.format === 'angka' ? durasi : p.durasi.format === 'Ns' ? `${durasi}s` : String(durasi), ...p.tetap };
  if (p.rasio) {
    const rasio = opsi.rasio ?? p.rasio.bawaan;
    if (!p.rasio.nilai.includes(rasio)) gagal('Rasio gak sesuai model video yang kamu pilih.');
    input[p.rasio.field] = rasio;
  } else if (opsi.rasio !== undefined) gagal('Model ini mengikuti rasio gambar asli. Kamu bisa ubah rasio fotonya dulu.');
  if (p.fieldGambar) {
    if (typeof opsi.gambar !== 'string' || !opsi.gambar) gagal('Model video ini butuh --gambar.');
    input[p.fieldGambar] = opsi.gambar;
  } else if (opsi.gambar !== undefined) gagal('Model ini buat video dari teks. Kamu bisa pilih model dari gambar.');
  return input;
}
export function estimasi(h, input, jenis, model = null) {
  if (!h || h.currency !== 'USD' || !Number.isFinite(Number(h.unit_price)) || Number(h.unit_price) <= 0) gagal('Harga fal belum jelas dalam USD. Kamu bisa cek di fal.ai/models.');
  const jumlah = input.num_images || 1;
  let pengali;
  if (h.unit === '1000 characters' && jenis === 'suara') pengali = Math.ceil(Array.from(input[model?.pemetaan?.fieldTeks || 'prompt'] || '').length / 100) / 10;
  else if (h.unit === 'minutes' && jenis === 'transkrip') pengali = Math.ceil(input.durasiDetik) / 60;
  else if (['image', 'images'].includes(h.unit) && ['gambar', 'edit'].includes(jenis)) pengali = jumlah;
  else if (['second', 'seconds'].includes(h.unit) && jenis === 'video') pengali = durasiDetik(model, input) + (model?.pemetaan?.marginDurasi || 0);
  else if (['video', 'videos'].includes(h.unit) && jenis === 'video') pengali = 1;
  else if (['megapixel', 'megapixels'].includes(h.unit) && jenis === 'gambar') pengali = Math.ceil(input.image_size.width * input.image_size.height / 1000000) * jumlah;
  else if (['generation', 'generations', 'audio', 'audios'].includes(h.unit) && jenis === 'musik') pengali = 1;
  else if (h.unit === 'minutes' && jenis === 'musik') pengali = Math.ceil(Number(input.durasiDetik) / 60); // ElevenLabs: dibulatkan ke menit penuh
  else gagal('Satuan harga fal gak jelas buat permintaan ini. Kamu bisa cek di fal.ai/models sebelum lanjut.');
  if (!Number.isFinite(pengali) || pengali <= 0) gagal('Jumlah, ukuran, atau durasi belum jelas.');
  const mikro = Number(h.unit_price) * pengali * 1000000;
  return Math.ceil(mikro - Number.EPSILON * Math.abs(mikro) * 4) / 1000000;
}
const idSah = (id) => { if (!/^[a-z0-9][a-z0-9_-]{0,80}$/.test(id || '')) gagal('ID permintaan fal gak sah.'); return id; };
export function mediaAman(K, file) {
  try {
    const dasar = fs.realpathSync(jalur(K).hasil);
    if (dasar !== path.join(fs.realpathSync(K), 'konten/fal')) return null;
    const abs = fs.realpathSync(path.resolve(K, file));
    const mime = MIME[path.extname(abs).toLowerCase()];
    if (!abs.startsWith(`${dasar}${path.sep}`) || !mime || !fs.statSync(abs).isFile()) return null;
    return { abs, mime };
  } catch { return null; }
}
function gambarInput(K, file) {
  if (/^https:\/\//.test(file)) {
    const u = new URL(file);
    if (u.username || u.password) gagal('URL gambar gak boleh berisi kunci atau password.');
    return { url: file, sidik: file };
  }
  let abs;
  try { abs = fs.realpathSync(path.resolve(K, file)); } catch { gagal('File gambar gak ketemu.'); }
  const root = fs.realpathSync(K);
  const rel = path.relative(root, abs);
  if (!abs.startsWith(`${root}${path.sep}`) || rel.split(path.sep).some((s) => s.startsWith('.')) || !['.png', '.jpg', '.jpeg', '.webp'].includes(path.extname(abs).toLowerCase()) || fs.statSync(abs).size > 20 * 1024 * 1024) gagal('Pakai gambar di folder kantor, maksimal 20 MB, di luar folder tersembunyi.');
  const bytes = fs.readFileSync(abs);
  return { url: `data:${MIME[path.extname(abs).toLowerCase()]};base64,${bytes.toString('base64')}`, sidik: crypto.createHash('sha256').update(bytes).digest('hex') };
}
const sidikIsi = (r, gambar) => crypto.createHash('sha256').update(JSON.stringify({ r, gambar })).digest('hex');
export function periksa(K, id) {
  const r = baca(path.join(jalur(K).antre, `${idSah(id)}.json`));
  if (!r || r.jenis !== 'video' || !r.model || !r.input?.prompt) gagal('Permintaan video belum lengkap.');
  const model = modelKurasi().find((m) => m.endpoint_id === r.model && m.jenis === 'video');
  if (!model) gagal('Model permintaan lama udah gak ada di kurasi. Kamu perlu pilih model lain dan setujuin permintaan baru.');
  const harapan = inputVideo(model, { prompt: r.input.prompt, durasi: durasiDetik(model, r.input), rasio: model.pemetaan.rasio ? r.input[model.pemetaan.rasio.field] : undefined, gambar: r.gambar });
  if (Object.keys(r.input).length !== Object.keys(harapan).length || Object.entries(harapan).some(([k, v]) => r.input[k] !== v) || !Number.isFinite(r.estimasi) || r.estimasi <= 0 || !/^[a-z0-9][a-z0-9_-]{0,60}$/i.test(r.keluar)) gagal('Isi permintaan video gak sah. Tim perlu bikin ulang.');
  const gambar = r.gambar ? gambarInput(K, r.gambar) : null;
  const sidik = sidikIsi(r, gambar?.sidik);
  return { id, r, sidik };
}
export function antrean(K) {
  let files; try { files = fs.readdirSync(jalur(K).antre); } catch { return []; }
  return files.filter((f) => /^[a-z0-9][a-z0-9_-]{0,80}\.json$/.test(f) && !f.endsWith('.status.json')).map((f) => {
    const id = f.slice(0, -5); const st = baca(path.join(jalur(K).antre, `${id}.status.json`), {});
    try { const p = periksa(K, id); return { ...p, status: st.sidik === p.sidik ? st.status : 'nunggu' }; }
    catch { return { id, status: 'rusak' }; }
  });
}
export function catatSetuju(K, id, sidik) {
  if (periksa(K, id).sidik !== sidik) gagal('Isi video berubah. Kamu perlu setujuin ulang.');
  const s = baca(jalur(K).setuju, {}); s[id] = sidik; tulis(jalur(K).setuju, s);
}
export function tolak(K, id, sidik) {
  if (periksa(K, id).sidik !== sidik) gagal('Isi video berubah. Muat ulang dulu.');
  tulis(path.join(jalur(K).antre, `${id}.status.json`), { status: 'ditolak', sidik });
  const s = baca(jalur(K).setuju, {}); delete s[id]; tulis(jalur(K).setuju, s);
}
export async function siapkan(K, jenis, opsi) {
  if (jenis === 'suara' || jenis === 'transkrip') return siapkanAudio(K, jenis, opsi);
  if (jenis === 'musik') return siapkanMusik(K, opsi);
  const models = modelKurasi();
  const model = models.find((m) => m.endpoint_id === opsi.model && m.jenis === jenis);
  if (!model) gagal('Pilih model sesuai jenis dari alat/fal-model.json.');
  if (!opsi.prompt?.trim() || opsi.prompt.length > 10000) gagal('Isi prompt antara 1 sampai 10.000 karakter.');
  const input = jenis === 'video' ? inputVideo(model, opsi) : { prompt: opsi.prompt.trim() };
  if (jenis === 'gambar') {
    const ukuran = { '1:1': [1024, 1024], '4:5': [1024, 1280], '16:9': [1536, 864], '9:16': [864, 1536] }[opsi.rasio || '1:1'];
    if (!ukuran) gagal('Rasio yang bisa kamu pilih: 1:1, 4:5, 16:9, 9:16.');
    input.image_size = { width: ukuran[0], height: ukuran[1] };
    input.num_images = Number(opsi.jumlah || 1);
    if (!Number.isInteger(input.num_images) || input.num_images < 1 || input.num_images > 4) gagal('Jumlah gambar harus 1 sampai 4.');
  }
  if (jenis === 'edit' && !opsi.gambar) gagal('Edit butuh --gambar.');
  if (opsi.gambar) gambarInput(K, opsi.gambar);
  const h = (await harga(K, [opsi.model])).find((p) => p.endpoint_id === opsi.model);
  const biaya = estimasi(h, input, jenis, model);
  const keluar = opsi.keluar || jenis;
  if (!/^[a-z0-9][a-z0-9_-]{0,60}$/i.test(keluar)) gagal('Nama hasil cuma boleh huruf, angka, strip, atau garis bawah.');
  const r = { jenis, model: opsi.model, input, estimasi: biaya, keluar, ...(opsi.gambar ? { gambar: opsi.gambar } : {}) };
  const id = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
  if (jenis === 'video') { tulis(path.join(jalur(K).antre, `${id}.json`), r); return { id, estimasi: biaya, status: 'nunggu' }; }
  return jalankan(K, id, r);
}
const tunggu = (ms) => new Promise((ok) => setTimeout(ok, ms));
export async function jalan(K, id) {
  const p = periksa(K, id);
  if (baca(jalur(K).setuju, {})[id] !== p.sidik) gagal('Video belum kamu setujuin atau isinya berubah. Setujuin ulang di dashboard.');
  return jalankan(K, id, p.r, p.sidik);
}
async function jalankan(K, id, r, sidik) {
  const J = jalur(K); fs.mkdirSync(path.dirname(J.biaya), { recursive: true });
  const lock = `${J.biaya}.lock`;
  try { fs.mkdirSync(lock); } catch { gagal('Ada panggilan fal yang masih jalan. Tunggu sampai selesai; kalau proses terputus, minta bantuan buat cek catatan biaya.'); }
  let catatan;
  const catat = (isi) => fs.appendFileSync(J.biaya, `${JSON.stringify(isi, (k, v) => typeof v === 'string' ? pesanAman(K, v) : v)}\n`, { mode: 0o600 });
  try {
    if (riwayat(K).some((h) => h.id === id)) gagal('Permintaan ini udah pernah dijalankan. Aku gak mengulang biar kamu gak bayar dobel.');
    if (r.audio) transkripBelumAda(audioLokal(K, r.audio));
    const model = modelKurasi().find((m) => m.endpoint_id === r.model);
    await pastikanAktif(K, r.model);
    const h = (await harga(K, [r.model])).find((p) => p.endpoint_id === r.model);
    const biaya = estimasi(h, r.input, r.jenis, model);
    if (sidik && biaya > r.estimasi) gagal('Harga video naik. Tim perlu bikin permintaan baru buat kamu setujuin.');
    const s = status(K);
    if (s.kepakeHariIni + biaya > s.batasHarianUsd + 1e-9) gagal('Estimasi melewati batas harian fal kamu. Tunggu besok atau ubah batas di dashboard.');
    const input = { ...r.input };
    if (sidik && periksa(K, id).sidik !== sidik) gagal('Isi video berubah. Kamu perlu setujuin ulang.');
    if (r.gambar) {
      const g = gambarInput(K, r.gambar);
      if (sidik && sidikIsi(r, g.sidik) !== sidik) gagal('Gambar berubah. Kamu perlu setujuin ulang.');
      if (r.jenis === 'edit') {
        if (model.pemetaan?.fieldGambar) { delete input.prompt; input[model.pemetaan.fieldGambar] = g.url; }
        else input.image_urls = [g.url];
      }
      else if (r.jenis === 'video') input[model.pemetaan.fieldGambar] = g.url;
      else gagal('Pakai perintah edit atau video untuk gambar sumber.');
    }
    delete input.durasiDetik;
    catatan = { id, waktu: new Date().toISOString(), model: r.model, estimasi: biaya, status: 'mengirim', request_id: null, berkas: [] };
    catat(catatan);
    if (sidik) tulis(path.join(J.antre, `${id}.status.json`), { status: 'antre', sidik });
    if (r.audio) input.audio_url = await unggahAudio(K, r.audio, r.sidikAudio);
    // URL status/hasil dari server gak dipakai buat mengirim kunci ke host lain.
    const q = await (await minta(K, `${QUEUE}/${r.model}`, { method: 'POST', body: input })).json();
    if (!/^[a-z0-9_-]{1,150}$/i.test(q.request_id || '')) gagal('fal gak balikin ID antrean yang sah. Cek dashboard fal sebelum mencoba lagi.');
    catatan.request_id = q.request_id; catatan.status = 'antre'; catat(catatan);
    const endpoint = r.model.split('/').slice(0, 2).join('/');
    const dasar = `${QUEUE}/${endpoint}/requests/${q.request_id}`;
    const akhir = Date.now() + Number(process.env.FAL_POLL_TIMEOUT_MS || 600000);
    let selesai = false;
    while (Date.now() < akhir) {
      const st = await (await minta(K, `${dasar}/status`)).json();
      if (st.status === 'COMPLETED') { selesai = true; break; }
      if (!['IN_QUEUE', 'IN_PROGRESS'].includes(st.status)) gagal('Antrean fal gagal. Cek dashboard fal; aku gak mengulang otomatis.');
      await tunggu(Number(process.env.FAL_POLL_INTERVAL_MS || 2000));
    }
    if (!selesai) gagal('Antrean fal melewati batas waktu. Biaya tetap dicatat. Cek dashboard fal sebelum mencoba lagi.');
    const hasil = await (await minta(K, dasar)).json();
    const media = [...(hasil.audio ? [hasil.audio] : []), ...(hasil.images || []), ...(hasil.image ? [hasil.image] : []), ...(hasil.video ? [hasil.video] : [])];
    if (r.jenis !== 'transkrip' && (!media.length || media.length > 4)) gagal('Hasil fal gak berisi media yang bisa aku simpan.');
    if (r.jenis === 'suara' && (!hasil.audio || media.length !== 1)) gagal('Jawaban suara fal harus berisi satu audio.');
    if (r.jenis === 'musik' && (!hasil.audio || media.length !== 1)) gagal('Jawaban musik fal harus berisi satu audio MP3.');
    const folder = path.join(J.hasil, hariWib()); fs.mkdirSync(folder, { recursive: true });
    if (!fs.realpathSync(folder).startsWith(`${fs.realpathSync(K)}${path.sep}konten${path.sep}fal${path.sep}`)) gagal('Folder hasil fal gak aman.');
    if (r.jenis === 'transkrip') {
      const file = r.audio ? `${berkasKantor(K, r.audio, Object.keys(MIME_AUDIO))}.kata.json` : path.join(folder, `transkrip-${id}.kata.json`);
      const data = transkripData(hasil);
      fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', {flag: 'wx', mode: 0o600});
      catatan.berkas.push(path.relative(K, file));
    }
    for (const [i, m] of (r.jenis === 'transkrip' ? [] : media).entries()) {
      let u; try { u = new URL(m.url); } catch { gagal('URL hasil fal gak sah.'); }
      const lokalTes = process.env.FAL_API && u.origin === new URL(API).origin;
      if ((!lokalTes && (u.protocol !== 'https:' || !(u.hostname === 'fal.media' || u.hostname.endsWith('.fal.media')))) || u.username || u.password) gagal('Host hasil fal gak dikenal. Aku gak mengunduh dari URL itu.');
      const unduh = await minta(K, u.href, { auth: false });
      const mime = (unduh.headers.get('content-type') || '').split(';')[0];
      const ext = Object.keys(MIME).find((e) => MIME[e] === mime);
      if (!ext) gagal('Jenis hasil fal gak didukung.');
      if (r.jenis === 'suara' && ext !== '.mp3') gagal('Hasil suara fal harus MP3.');
      if (r.jenis === 'musik' && ext !== '.mp3') gagal('Jawaban musik fal harus berisi satu audio MP3.');
      const file = path.join(folder, r.jenis === 'suara' ? `suara-${id}.mp3` : `${r.keluar}-${id}-${i + 1}${ext}`);
      const chunks = []; let ukuran = 0;
      for await (const chunk of unduh.body) {
        ukuran += chunk.byteLength;
        if (ukuran > 250 * 1024 * 1024) gagal('Hasil fal lebih dari 250 MB. Aku berhenti mengunduh.');
        chunks.push(chunk);
      }
      fs.writeFileSync(file, Buffer.concat(chunks), { flag: 'wx', mode: 0o600 });
      catatan.berkas.push(path.relative(K, file));
      if (r.jenis === 'musik') {
        // Durasi lagu cuma dicatat kalau pasti (dari fal atau ffprobe). Taksiran dari ukuran berkas (8 kbps) ngaco buat musik 128–256 kbps.
        const d = durasiAudio(K, file, hasil.duration_ms);
        if (['duration_ms', 'ffprobe'].includes(d.sumber)) catatan.durasi = d;
      }
      if (r.jenis === 'suara') {
        catatan.durasi = durasiAudio(K, file, hasil.duration_ms);
        catatan.sidikAudio = crypto.createHash('sha256').update(Buffer.concat(chunks)).digest('hex');
      }
    }
    catatan.status = 'selesai'; catat(catatan);
    if (sidik) tulis(path.join(J.antre, `${id}.status.json`), { status: 'selesai', sidik });
    return catatan;
  } catch (e) {
    if (catatan) { if (sidik) tulis(path.join(J.antre, `${id}.status.json`), { status: 'gagal', sidik }); catatan.status = 'gagal'; catatan.pesan = e instanceof FalGagal ? e.message : 'Aku gak bisa menyimpan hasil fal.'; catat(catatan); }
    throw e instanceof FalGagal ? e : new FalGagal('Aku gak bisa memproses fal. Cek ruang disk dan file kantor.');
  } finally { fs.rmdirSync(lock); }
}

export function inputSuara(model, opsi) {
  const p = model.pemetaan, teks = opsi.teks?.trim();
  if (!teks || Array.from(teks).length > p.teksMaks) gagal(`Isi teks suara antara 1 sampai ${p.teksMaks} karakter.`);
  const suara = opsi.suara ?? p.suaraBawaan;
  if (typeof suara !== 'string' || !suara.trim() || suara.length > 200 || (p.suaraNilai && !p.suaraNilai.includes(suara))) gagal('Suara gak sesuai model yang kamu pilih. Cek daftar model dulu.');
  const input = {...structuredClone(p.tetap), [p.fieldTeks]: teks};
  if (p.fieldSuara === 'voice_setting.voice_id') input.voice_setting = {voice_id: suara}; else input[p.fieldSuara] = suara;
  if (p.fieldGaya) {
    if (typeof opsi.gaya !== 'string' || !/^Ucapkan dengan gaya\s+\S/.test(opsi.gaya) || opsi.gaya.length > p.gayaMaks) gagal('Gaya Gemini wajib diawali "Ucapkan dengan gaya …", maksimal 4.000 karakter. Kamu bisa mengambil gayanya dari brand/brief.md.');
    input[p.fieldGaya] = opsi.gaya.trim();
  } else if (opsi.gaya !== undefined) gagal('Opsi --gaya cuma tersedia untuk Gemini.');
  return input;
}
function audioLokal(K, file) {
  try { return berkasKantor(K, file, Object.keys(MIME_AUDIO)); }
  catch { gagal('Pakai audio di folder kantor, maksimal 100 MB, di luar folder tersembunyi.'); }
}
function transkripBelumAda(audio) {
  let ada = false;
  try { fs.lstatSync(`${audio}.kata.json`); ada = true; }
  catch (e) { if (e.code !== 'ENOENT') gagal('Aku belum bisa memeriksa berkas transkrip audio.'); }
  if (ada) gagal('Transkrip audio ini sudah ada. Kamu bisa pakai hasilnya atau menyalin audio ke nama baru.');
}
function urlAudio(file) {
  let u; try { u = new URL(file); } catch { gagal('URL audio gak sah.'); }
  if (u.protocol !== 'https:' || u.username || u.password) gagal('Pakai URL audio HTTPS tanpa kunci atau password.');
  return u;
}
async function unggahAudio(K, file, sidik) {
  const abs = audioLokal(K, file), content_type = MIME_AUDIO[path.extname(abs).toLowerCase()];
  const bytes = fs.readFileSync(abs);
  if (crypto.createHash('sha256').update(bytes).digest('hex') !== sidik) gagal('Audio berubah setelah durasinya diperiksa. Kamu bisa cek ulang sebelum transkrip.');
  const storage = (process.env.FAL_STORAGE || 'https://rest.alpha.fal.ai').replace(/\/$/, '');
  const d = await (await minta(K, `${storage}/storage/upload/initiate?storage_type=fal-cdn-v3`, {method: 'POST', body: {content_type, file_name: path.basename(abs)}})).json();
  let upload, hasil;
  try { upload = new URL(d.upload_url); hasil = new URL(d.file_url); } catch { gagal('Jawaban penyimpanan fal gak lengkap.'); }
  const sah = (u) => (u.protocol === 'https:' || (process.env.FAL_STORAGE && u.origin === new URL(storage).origin)) && !u.username && !u.password;
  if (!sah(upload) || !sah(hasil)) gagal('URL penyimpanan fal gak sah.');
  // URL unggah bertanda tangan: jangan kirim Authorization ke host penyimpanan.
  let r;
  try { r = await fetch(upload, {method: 'PUT', redirect: 'error', headers: {'Content-Type': content_type}, body: bytes, signal: AbortSignal.timeout(60000)}); }
  catch { gagal('Aku belum bisa mengunggah audio ke fal.'); }
  if (!r.ok) gagal('Penyimpanan fal nolak unggahan audio.');
  return hasil.href;
}
async function siapkanAudio(K, jenis, opsi) {
  const id = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
  const endpoint = opsi.model || (jenis === 'suara' ? 'fal-ai/gemini-3.1-flash-tts' : 'fal-ai/elevenlabs/speech-to-text/scribe-v2');
  const model = modelKurasi().find((m) => m.endpoint_id === endpoint && m.jenis === jenis);
  if (!model) gagal('Pilih model sesuai jenis dari alat/fal-model.json.');
  let input, audio, sidikAudio;
  if (jenis === 'suara') {
    if ((opsi.teks === undefined) === (opsi.berkas === undefined)) gagal('Pilih salah satu: --teks atau --berkas naskah.txt.');
    let teks = opsi.teks;
    if (opsi.berkas !== undefined) {
      try { teks = fs.readFileSync(berkasKantor(K, opsi.berkas, ['.txt', '.md'], 250000), 'utf8'); }
      catch { gagal('Naskah harus TXT/MD di kantor, maksimal 250 KB, di luar folder tersembunyi.'); }
    }
    input = inputSuara(model, {...opsi, teks});
  } else {
    if (!opsi.audio) gagal('Transkrip butuh --audio berkas atau URL HTTPS.');
    if (/^https?:\/\//.test(opsi.audio)) {
      const url = urlAudio(opsi.audio);
      const r = await minta(K, url.href, {auth: false});
      const mime = (r.headers.get('content-type') || '').split(';')[0];
      const ext = Object.keys(MIME_AUDIO).find((e) => MIME_AUDIO[e] === mime);
      if (!ext) gagal('URL audio harus berisi MP3, WAV, M4A, OGG, atau FLAC.');
      const chunks = []; let size = 0;
      for await (const chunk of r.body) { size += chunk.byteLength; if (size > 100 * 1024 * 1024) gagal('Audio lebih dari 100 MB.'); chunks.push(chunk); }
      const folder = path.join(jalur(K).hasil, hariWib()); fs.mkdirSync(folder, {recursive: true});
      if (!fs.realpathSync(folder).startsWith(`${fs.realpathSync(K)}/konten/fal/`)) gagal('Folder audio gak aman.');
      audio = path.join(folder, `sumber-${id}${ext}`); fs.writeFileSync(audio, Buffer.concat(chunks), {flag: 'wx', mode: 0o600});
    } else audio = audioLokal(K, opsi.audio);
    transkripBelumAda(audio);
    sidikAudio = crypto.createHash('sha256').update(fs.readFileSync(audio)).digest('hex');
    const asal = riwayat(K).findLast((r) => r.status === 'selesai' && r.sidikAudio === sidikAudio && ['duration_ms', 'ffprobe'].includes(r.durasi?.sumber));
    const durasi = durasiAudio(K, audio, asal?.durasi?.detik * 1000);
    input = {...model.pemetaan.tetap, durasiDetik: durasi.detik};
  }
  // Audio langsung jalan: harga dan estimasi cukup sekali di dalam lock jalankan().
  return jalankan(K, id, {jenis, model: endpoint, input, keluar: jenis, ...(audio ? {audio, sidikAudio} : {})});
}

// Musik (KD-177, permintaan pembeli 05/11): lagu dari lirik + gaya. MiniMax: gaya & lirik dikirim apa adanya (tag [Verse]/[Chorus]
// boleh), durasi ditentuin model, harga per lagu. ElevenLabs: rencana komposisi (lirik dibagi per bait yang dipisah baris kosong,
// durasi dibagi menurut jumlah baris) biar liriknya dinyanyiin persis; harga per menit dibulatkan ke atas.
export function inputMusik(model, opsi) {
  const p = model.pemetaan; const gaya = String(opsi.gaya ?? '').trim(); const lirik = String(opsi.lirik ?? '').replace(/\r\n?/g, '\n').trim();
  const pjg = (x) => Array.from(x).length;
  if (pjg(gaya) < p.gayaMin || pjg(gaya) > p.gayaMaks) gagal(`Isi --gaya antara ${p.gayaMin} sampai ${p.gayaMaks} karakter.`);
  if (pjg(lirik) < p.lirikMin || pjg(lirik) > p.lirikMaks) gagal(`Lirik harus ${p.lirikMin} sampai ${p.lirikMaks} karakter.`);
  if (!p.rencana) {
    if (opsi.durasi !== undefined) gagal('Durasi lagu model ini ditentuin model, jadi --durasi gak dipakai.');
    return { ...structuredClone(p.tetap || {}), [p.fieldGaya]: gaya, [p.fieldLirik]: lirik };
  }
  const durasi = Number(opsi.durasi ?? p.durasi.bawaan);
  if (!Number.isInteger(durasi) || durasi < p.durasi.batas[0] || durasi > p.durasi.batas[1]) gagal(`Isi --durasi ${p.durasi.batas[0]} sampai ${p.durasi.batas[1]} detik.`);
  const bait = lirik.split(/\n\s*\n/).map((b) => b.split('\n').map((x) => x.trim()).filter(Boolean)).filter((b) => b.length).map((b, i) => {
    const tag = b[0].match(/^\[([^\]]{1,100})\]$/);
    return { nama: tag ? tag[1].trim() : `Bagian ${i + 1}`, baris: tag ? b.slice(1) : b };
  });
  const total = durasi * 1000; const bobot = bait.map((b) => Math.max(1, b.baris.length)); const jumlahBobot = bobot.reduce((a, b) => a + b, 0);
  let sisa = total;
  const sections = bait.map((b, i) => {
    const ms = i === bait.length - 1 ? sisa : Math.round(total * bobot[i] / jumlahBobot); sisa -= ms;
    return { section_name: b.nama, positive_local_styles: [], negative_local_styles: [], duration_ms: ms, lines: b.baris };
  });
  if (!sections.length || sections.some((x) => x.duration_ms < 3000 || x.duration_ms > 120000 || x.lines.some((l) => pjg(l) > 200))) {
    gagal('Satu baris lirik maksimal 200 karakter dan tiap bait dapet 3 detik sampai 2 menit. Atur ulang bait atau --durasi.');
  }
  const gayaList = gaya.split(/[,;\n]/).map((x) => x.trim()).filter(Boolean).slice(0, 20);
  return { ...structuredClone(p.tetap || {}), composition_plan: { positive_global_styles: gayaList, negative_global_styles: [], sections }, durasiDetik: durasi };
}
async function siapkanMusik(K, opsi) {
  if (opsi.lirik === undefined || opsi.gaya === undefined) gagal('Musik butuh --lirik berkas.txt dan --gaya.');
  const endpoint = opsi.model || 'fal-ai/minimax-music/v2';
  const model = modelKurasi().find((m) => m.endpoint_id === endpoint && m.jenis === 'musik');
  if (!model) gagal('Pilih model sesuai jenis dari alat/fal-model.json.');
  let lirik;
  try { lirik = fs.readFileSync(berkasKantor(K, opsi.lirik, ['.txt', '.md'], 250000), 'utf8'); }
  catch { gagal('Lirik harus TXT/MD di kantor, maksimal 250 KB, di luar folder tersembunyi.'); }
  const input = inputMusik(model, { ...opsi, lirik });
  const keluar = opsi.keluar || 'musik';
  if (!/^[a-z0-9][a-z0-9_-]{0,60}$/i.test(keluar)) gagal('Nama hasil cuma boleh huruf, angka, strip, atau garis bawah.');
  const id = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
  // Langsung jalan kayak suara: harga, estimasi & batas harian dicek sekali di dalam lock jalankan().
  return jalankan(K, id, { jenis: 'musik', model: endpoint, input, keluar });
}
