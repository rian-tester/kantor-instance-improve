// Jalur audio, durasi, dan kalimat terucap. Tidak menyimpan kunci atau memanggil model.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
export const MIME_AUDIO = {'.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.m4a': 'audio/mp4', '.ogg': 'audio/ogg', '.flac': 'audio/flac'};
export function berkasKantor(K, file, ekstensi, maks = 100 * 1024 * 1024) {
  const akar = fs.realpathSync(K), abs = fs.realpathSync(path.resolve(K, file));
  const rel = path.relative(akar, abs), stat = fs.statSync(abs);
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel) || rel.split(path.sep).some((s) => s.startsWith('.')) || !stat.isFile() || !ekstensi.includes(path.extname(abs).toLowerCase()) || stat.size === 0 || stat.size > maks) throw new Error('Kamu bisa pakai berkas di kantor, di luar folder tersembunyi, dengan ukuran yang sesuai.');
  return abs;
}
export function durasiAudio(K, file, durationMs, run = spawnSync) {
  if (Number.isFinite(durationMs) && durationMs > 0) return {detik: durationMs / 1000, sumber: 'duration_ms'};
  const cli = path.join(K, 'video/node_modules/.bin/remotion');
  if (fs.existsSync(cli)) {
    const r = run(cli, ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', file], {cwd: path.join(K, 'video'), encoding: 'utf8', timeout: 30000, maxBuffer: 1 << 20});
    try {
      const d = JSON.parse(r.stdout.slice(r.stdout.indexOf('{'), r.stdout.lastIndexOf('}') + 1));
      const detik = Number(d.format?.duration);
      if (!r.error && r.status === 0 && Number.isFinite(detik) && detik > 0) return {detik, sumber: 'ffprobe'};
    } catch { /* Cadangan biaya, bukan klaim durasi terukur. */ }
  }
  return {detik: Math.max(60, Math.ceil(fs.statSync(file).size * 8 / 8000)), sumber: 'estimasi-8kbps'};
}
export function kataTerucap(hasil) {
  if (typeof hasil?.text !== 'string' || !Array.isArray(hasil.words)) throw new Error('Jawaban transkrip fal belum lengkap.');
  const kata = hasil.words.filter((w) => w.type === 'word');
  let terakhir = 0, akhirTerakhir = 0;
  for (const w of kata) {
    if (typeof w.text !== 'string' || !w.text.trim() || !Number.isFinite(w.start) || !Number.isFinite(w.end) || w.start < terakhir || w.end < akhirTerakhir || w.end < w.start) throw new Error('Waktu kata dari fal gak sah.');
    terakhir = w.start; akhirTerakhir = w.end;
  }
  if (!kata.length) throw new Error('Transkrip fal gak berisi kata terucap.');
  return kata;
}
const normal = (s) => s.toLocaleLowerCase('id').replace(/[^\p{L}\p{N}]/gu, '');
// LCS menjajarkan naskah dan ucapan, lalu mengisi jeda seperti jajarin() Ale.
export function jajarin(naskah, kata) {
  const teks = naskah.trim().split(/\s+/), a = teks.map(normal), b = kata.map((w) => normal(w.text));
  if (!a.length || a.length * b.length > 4000000) throw new Error('Naskah terlalu panjang untuk dijajarkan. Kamu bisa membaginya per bagian.');
  const dp = Array.from({length: a.length + 1}, () => new Uint32Array(b.length + 1));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const waktu = Array(a.length).fill(null); let i = 0, j = 0, cocok = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { waktu[i] = {mulai: kata[j].start, akhir: kata[j].end}; i++; j++; cocok++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++;
  }
  if (cocok / Math.max(a.length, b.length) < 0.6) throw new Error('Naskah dan transkrip kurang cocok. Kamu bisa cek ucapan atau transkripnya dulu.');
  for (let awal = 0; awal < waktu.length;) {
    if (waktu[awal]) { awal++; continue; }
    let akhir = awal; while (akhir < waktu.length && !waktu[akhir]) akhir++;
    const mulai = awal ? waktu[awal - 1].akhir : kata[0].start;
    const selesai = akhir < waktu.length ? waktu[akhir].mulai : kata.at(-1).end;
    for (let k = awal; k < akhir; k++) waktu[k] = {mulai: mulai + (selesai - mulai) * (k - awal) / (akhir - awal), akhir: mulai + (selesai - mulai) * (k - awal + 1) / (akhir - awal)};
    awal = akhir;
  }
  return teks.map((t, k) => ({t, ...waktu[k]}));
}
export function kalimatBerwaktu(naskah, kata) {
  const waktu = jajarin(naskah, kata); let posisi = 0;
  return naskah.trim().split(/(?<=[.!?])\s+/).map((teks) => {
    const kalimat = teks.trim(), jumlah = kalimat.split(/\s+/).length;
    const mulai = waktu[posisi].mulai; posisi += jumlah;
    return {kalimat, mulai, akhir: waktu[posisi - 1].akhir};
  });
}
export function transkripData(hasil) {
  const words = kataTerucap(hasil);
  // Pakai kata terucap, bukan text penuh: contoh asli dapat berisi potongan words.
  const naskah = words.map((w) => w.text).join(' ');
  return {...hasil, words, kalimat: kalimatBerwaktu(naskah, words)};
}
