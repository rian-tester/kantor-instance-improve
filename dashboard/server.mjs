// Dashboard Lembur.id. Kerangkanya ngikutin ops: topbar (merek, menu, cari ⌘K, lampu jatah), nav bawah di HP,
// halaman Ringkasan / Kantor (animasi) / Task / Tim / Lainnya, detail task kebuka di drawer (di HP dari bawah).
// Cuma baca, kecuali ganti tampilan & jawab keputusan (ditulis ke file task). Pakai login. Jalan di 127.0.0.1:7691, dibuka lewat Caddy (HTTPS).
// Gak manggil AI sama sekali: semua ngikutin file task, peran, & catatan detak.
// Tampilan diatur di dashboard/tampilan.json (kantor|studio|cozy|modern|papan|masjid|lengkap, owner, rupa, lokasi).
// Builder boleh ngembangin file ini (mis. tampilan rancangan sendiri). CSP-nya ketat: gak boleh ada style="" atau
// skrip inline, semua gaya di aset/gaya.css & perilaku di aset/app.js.
// ref f277d9960f48baca
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { execFile, execFileSync, spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { mulaiSitus } from './situs.mjs';
import Shalat from './aset/shalat.js';
import { dataKantor } from './gelembung.mjs';
import Hidup from './aset/kantor-hidup.js';
import { kejadianKantor } from './kantor-kejadian.mjs';
import { bacaSetelanKantor } from './bahasa/index.mjs';
import { deteksiHasil, renderHasil, berkasAman, rentang } from './hasil-task.mjs';
import { soalKeputusan, sudahTerjawab, pasangJawaban } from './keputusan.mjs';
// Teks tampilan lewat kamus bahasa/<kode>/dashboard.json (KD-121). `tx` (bukan `t`) karena `t` dipakai buat task di file ini.
import { terjemahAlat, terjemahBaris } from './bahasa/alat.mjs';
import { t as tx, pakai, bacaBahasa, simpanBahasa, bahasaAktif, LOKAL, KODE as KODE_BAHASA, bagianKamus } from './bahasa/index.mjs';

const K = process.env.KANTOR || path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PORT = Number(process.env.DASHBOARD_PORT || 7691);
const SINI = path.dirname(new URL(import.meta.url).pathname);
const ASET = path.join(SINI, 'aset');
const TZ = process.env.TZ_KANTOR || 'Asia/Jakarta';
const KIT = process.env.KIT || path.join(os.homedir(), 'kit-kantor-ai');
// Sesi login disimpen (sha256-nya aja, bukan isi cookie) di .rahasia/sesi.json, biar dashboard nyala ulang (update kit,
// VPS restart) gak bikin owner login lagi. Umurnya 30 hari, sama kayak cookie.
const F_SESI = path.join(K, '.rahasia/sesi.json');
const UMUR_SESI = 30 * 86400000;
const kunciSesi = (id) => crypto.createHash('sha256').update(String(id || '')).digest('hex');
const sesi = new Map((() => { try { return Object.entries(JSON.parse(fs.readFileSync(F_SESI, 'utf8'))).filter(([, t]) => Date.now() - t < UMUR_SESI); } catch { return []; } })());
function simpanSesi() {
  try {
    fs.mkdirSync(path.dirname(F_SESI), { recursive: true, mode: 0o700 });
    fs.writeFileSync(F_SESI, `${JSON.stringify(Object.fromEntries(sesi))}\n`, { mode: 0o600 });
  } catch { /* gak bisa nulis: sesi tetap jalan di memori */ }
}
// Token form buat kiriman yang ngubah server (tombol update): turunan dari cookie sesi, jadi situs lain gak bisa nebak.
const tokenForm = (kd) => crypto.createHmac('sha256', String(kd || '')).update('form-dashboard').digest('hex').slice(0, 32);
// Update kit dari dashboard: update.sh jalan di proses sendiri (lepas dari dashboard, karena dia nyalain ulang dashboard
// di tengah jalan). Penanda, kode keluar, & lognya di catatan/, biar dashboard yang baru nyala bisa nampilin hasilnya.
// Posting sosmed lewat Repliz (alat/repliz-inti.mjs). Kantor yang belum punya alatnya → halaman Sosmed nyuruh update kit.
const FL = await import(pathToFileURL(path.join(K, 'alat/fal-inti.mjs')).href).catch(() => null);
const GD = await import(pathToFileURL(path.join(K, 'alat/drive-inti.mjs')).href).catch(() => null);
let driveKode = null;
let drivePesan = '';
let driveMulai = false;
let driveGenerasi = 0;
const RZ = await import(pathToFileURL(path.join(K, 'alat/repliz-inti.mjs')).href).catch(() => null);
const UPD = { jalan: path.join(K, 'catatan/.update-jalan'), kode: path.join(K, 'catatan/.update-kode'), log: path.join(K, 'catatan/update-dashboard.log') };
const coba = new Map();
// 'diproses' gak pernah ditulis di file: task nunggu-kamu yang semua soalnya udah dijawab owner, tinggal dicatat tim.
// Kode status = nilai mesin (gak diterjemahin); labelnya dari kamus pas render.
const KODE_STATUS = ['nunggu-kamu', 'diproses', 'jalan', 'antre', 'parkir', 'beres'];
const namaStatus = (s) => tx(`db.status.${s}`);
const STATUS = () => KODE_STATUS.map((s) => [s, namaStatus(s)]);
const STATUS_FILE = new Set(['nunggu-kamu', 'jalan', 'antre', 'parkir', 'beres']);
// Rupa karakter bawaan buat nama manajer dari wizard; nama lain dapet giliran dari CADANGAN.
const RUPA = { builder: 'claude-1', sari: 'dev-2', bima: 'employee-3', raka: 'explore-1', dewi: 'frontend-dev-1', laras: 'employee-1', nadia: 'employee-2', gilang: 'dev-1', dimas: 'security-audit-1' };
const CADANGAN = ['employee-1', 'employee-2', 'security-audit-1', 'dev-1'];
// Template 3D & flat cuma punya rupa ini (sama kayak RUPA_GAYA di kantor.js); rupa lain diganti giliran.
const RUPA_GAYA = ['dev-2', 'employee-3', 'explore-1', 'frontend-dev-1', 'employee-1', 'employee-2'];
const UKURAN_RUANG = { kantor: [2048, 1357], studio: [2940, 1357], cozy: [2048, 1374], modern: [2048, 1374], masjid: [3675, 2699], lengkap: [3795, 2966] };
// Template yang punya ruang shalat (jadwal shalat, banner, karakter ikut shalat).
const ADA_MASJID = ['masjid', 'lengkap'];
// Pilihan template yang bisa diganti owner sendiri dari dashboard (nol jatah, cuma nulis tampilan.json).
const KODE_PILIHAN = ['cozy', 'modern', 'kantor', 'studio', 'papan', 'masjid', 'lengkap'];
const PILIHAN = () => KODE_PILIHAN.map((k) => [k, tx(`db.tampilan.${k}.judul`), tx(`db.tampilan.${k}.ket`)]);
// Tema denah buat template pixel (Kantor besar, + studio, + masjid, Kantor lengkap): gambar aset/tema-<kode>-<template>.webp, ukuran sama
// dengan ruang-<template>.webp, jadi titik orang & potongan tutup tetap pas. Tema 'd' punya animasi (aset/tema-hidup.js).
const KODE_TEMA = ['klasik', 'a', 'c', 'd'];
const TEMPLATE_TEMA = ['kantor', 'studio', 'masjid', 'lengkap'];
const TEMA = () => KODE_TEMA.map((k) => [k, tx(`db.tema.${k}.judul`), tx(`db.tema.${k}.ket`)]);
const adaAset = (f) => { try { return fs.statSync(path.join(SINI, 'aset', f)).isFile(); } catch { return false; } };
function temaDipakai(s, tampilan) {
  const k = KODE_TEMA.includes(s.tema) ? s.tema : 'klasik';
  return k !== 'klasik' && TEMPLATE_TEMA.includes(tampilan) && adaAset(`tema-${k}-${tampilan}.webp`) ? k : 'klasik';
}
// Animasi tema D: masker zona (per template) + tekstur bersama + titik cipratan (aset/tema-d-<template>.json).
function dataTemaHidup(tema, tampilan) {
  if (tema !== 'd') return null;
  let j = {};
  try { j = JSON.parse(fs.readFileSync(path.join(SINI, 'aset', `tema-d-${tampilan}.json`), 'utf8')); } catch { return null; }
  const gambar = {};
  for (const k of ['air', 'laut', 'pantai', 'rumput']) if (adaAset(`tema-d-${tampilan}-${k}.webp`)) gambar[k] = `/aset/tema-d-${tampilan}-${k}.webp`;
  for (const k of ['riak', 'kilau', 'ombak', 'busa']) if (adaAset(`tema-d-${k}.webp`)) gambar[k] = `/aset/tema-d-${k}.webp`;
  const cipratan = Array.isArray(j.cipratan) ? j.cipratan.filter((c) => Array.isArray(c) && c.length === 2 && c.every((n) => Number.isInteger(n) && n >= 0 && n < 10000)).slice(0, 200) : [];
  return { gambar, cipratan, partikel: Math.min(60, Math.max(0, Number(j.partikel) | 0)), suaraLaut: j.suaraLaut === true };
}
const KODE_OWNER = ['owner-pria', 'owner-wanita', 'owner-hijab', 'owner-peci'];
const OWNER = () => KODE_OWNER.map((k) => [k, tx(`db.owner.${k}`)]);
const keadaan = (k) => tx(`db.keadaan.${k}`);
const HARI = () => tx('db.tgl.hari');
const BULAN = () => tx('db.tgl.bulan');
const lokal = () => LOKAL[bahasaAktif()];
// Teks yang ada bentuk tunggalnya (mis. en "1 result" vs "2 results"): kunci "<kunci>.satu" dipakai kalau n = 1 & ada di kamus.
const txn = (kunci, n, v = {}) => { const satu = tx(`${kunci}.satu`, { n, ...v }); return n === 1 && satu !== `${kunci}.satu` ? satu : tx(kunci, { n, ...v }); };

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const bacaAman = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch { return ''; } };
const enc = encodeURIComponent;

// ---------- tanggal (zona kantor, bawaan WIB) ----------
const hariIni = () => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());
const keHari = (s) => Math.floor(Date.parse(`${s}T00:00:00Z`) / 86400000);
function umurHari(tgl) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tgl || '')) return null;
  return keHari(hariIni()) - keHari(tgl);
}
function relatif(tgl) {
  const n = umurHari(tgl);
  if (n == null) return '';
  return n <= 0 ? tx('db.tgl.hariIni') : n === 1 ? tx('db.tgl.kemarin') : n < 31 ? txn('db.tgl.hariLalu', n) : tanggalPendek(tgl);
}
function tanggalPendek(tgl) {
  const [y, m, d] = tgl.split('-').map(Number);
  return `${d} ${BULAN()[m - 1].slice(0, 3)}${y === Number(hariIni().slice(0, 4)) ? '' : ` ${y}`}`;
}
function tanggalPanjang() {
  const s = hariIni();
  const [y, m, d] = s.split('-').map(Number);
  return tx('db.tgl.panjang', { hari: HARI()[new Date(Date.UTC(y, m - 1, d)).getUTCDay()], d, bulan: BULAN()[m - 1] });
}

// ---------- baca file kantor ----------
// Bagian "## Judul" di task → { judul: isi }.
function bagian(isi) {
  const hasil = [];
  for (const blok of isi.replace(/^---\n[\s\S]*?\n---\n?/, '').split(/^## /m).slice(1)) {
    const [kepala, ...badan] = blok.split('\n');
    hasil.push({ judul: kepala.trim(), teks: badan.join('\n').trim() });
  }
  return hasil;
}

// "- 06/10 bikin 10 ide" → { tgl: '06/10', teks: 'bikin 10 ide' }
const butir = (teks) => teks.split('\n').filter((b) => /^\s*[-*] /.test(b)).map((b) => {
  const x = b.replace(/^\s*[-*] /, '').trim();
  const m = x.match(/^(\d{1,2}\/\d{1,2})\s+(.+)$/);
  return m ? { tgl: m[1], teks: m[2] } : { tgl: '', teks: x };
});

function bacaTask() {
  let file = [];
  try { file = fs.readdirSync(path.join(K, 'task')).filter((f) => /^T-\d+.*\.md$/.test(f)); } catch { /* kosong */ }
  return file.map((f) => {
    const isi = bacaAman(path.join(K, 'task', f));
    const meta = Object.fromEntries([...(isi.match(/^---\n([\s\S]*?)\n---/)?.[1] || '').matchAll(/^(\w+):\s*(.*)$/gm)].map((m) => [m[1], m[2].trim()]));
    const bag = bagian(isi);
    const ambil = (pola) => bag.find((b) => pola.test(b.judul))?.teks || '';
    // Format lama (kit ≤0.9.1) nulis "nunggu-lu" & "## Keputusan lu": tetap kebaca.
    const keputusan = ambil(/^keputusan (kamu|lu)$/i);
    const udah = butir(ambil(/^udah$/i));
    const statusFile = meta.status === 'nunggu-lu' ? 'nunggu-kamu' : STATUS_FILE.has(meta.status) ? meta.status : 'antre';
    const umur = umurHari(meta.update);
    const kp = soalKeputusan(keputusan);
    // Terjawab = owner udah jawab semua pertanyaan (atau nulis jawaban bebas), tinggal dicatat tim. Status file tetap
    // nunggu-kamu sampai detak/manajer nyatet, tapi di dashboard udah tampil "Lagi diproses" (status 'diproses').
    const terjawab = statusFile === 'nunggu-kamu' && sudahTerjawab(kp);
    const status = terjawab ? 'diproses' : statusFile;
    return {
      f, ...meta, hasil: deteksiHasil(K, isi, GD?.riwayat(K) || []), judul: meta.judul || f.replace(/\.md$/, ''), kode: meta.kode || f.match(/^T-\d+/)[0], status, statusFile, bag, keputusan, ...kp,
      terjawab, proses: terjawab ? keadaanProses(meta.pegang, f, meta.divisi) : null, nunggu: statusFile === 'nunggu-kamu' && !terjawab, udah, terakhir: udah.at(-1)?.teks || '', umur, nyangkut: status === 'jalan' && umur != null && umur >= 3,
    };
  }).sort((a, b) => (b.update || '').localeCompare(a.update || '') || b.f.localeCompare(a.f));
}

// ---------- bangunin manajer abis owner jawab ----------
// Kayak Ops: begitu semua soal kejawab, detak manajer pemegang task dipicu (sekali, ±30 detik kemudian biar owner
// masih sempat ganti pilihan) buat nyatet jawaban & lanjut kerja. Pakai baris detak di cron yang udah dipasang
// installer/Builder (env & divisinya ikut), plus DETAK_PICU biar gak ketahan jam tidur. Kerja otomatis dimatiin (gak ada
// baris cron) = tetap dibangunin SEKALI pakai detak.sh kantor & divisi dari task: owner yang barusan jawab jelas mau
// kerjaannya lanjut, dan biayanya cuma 1 putaran per jawaban. Jaga jatah & batas harian di detak.sh tetap berlaku.
const JEDA_PICU = Math.max(0, Number(process.env.DETAK_JEDA_DETIK ?? 30)) * 1000;
const picuTertunda = new Map();
// Jam owner terakhir jawab per task (detik). Mtime file gak bisa dipakai: manajer yang lagi nyatet juga ngubah file-nya.
const jamJawab = new Map();
let cacheCron = { t: 0, isi: '' };
function isiCron() {
  if (Date.now() - cacheCron.t < 60000) return cacheCron.isi;
  let isi = '';
  try { isi = execFileSync('crontab', ['-l'], { encoding: 'utf8', timeout: 3000, stdio: ['ignore', 'pipe', 'ignore'] }); } catch { /* belum ada cron */ }
  cacheCron = { t: Date.now(), isi };
  return isi;
}
// Baris "*/30 7-21 * * * JAM_BANGUN=7 … bash /home/x/kantor/detak.sh sari sosmed" → { skrip, divisi, env }.
// Gak ada barisnya → { …, sekali: true } pakai detak.sh kantor (null kalau detak.sh/peran-nya gak ada).
function barisDetak(id, divisi = '') {
  if (!id || !/^[a-z0-9-]+$/.test(id)) return null;
  const isi = isiCron();
  const global = Object.fromEntries([...isi.matchAll(/^([A-Z_][A-Z0-9_]*)=(.*)$/gm)].map((m) => [m[1], m[2].trim()]));
  for (const b of isi.split('\n')) {
    if (/^\s*#/.test(b)) continue;
    const m = b.match(/((?:[A-Z_][A-Z0-9_]*=\S*\s+)*)bash\s+(\S*\/detak\.sh)\s+([a-z0-9-]+)(?:\s+([a-z0-9-]+))?/);
    if (m && m[3] === id) return { skrip: m[2], divisi: m[4] || '', env: { ...global, ...Object.fromEntries([...m[1].matchAll(/([A-Z_][A-Z0-9_]*)=(\S*)/g)].map((x) => [x[1], x[2]])) } };
  }
  const skrip = path.join(K, 'detak.sh');
  if (!fs.existsSync(skrip) || !fs.existsSync(path.join(K, 'peran', `PERAN-${id}.md`))) return null;
  return { skrip, divisi: /^[a-z0-9-]+$/.test(divisi) ? divisi : '', env: global, sekali: true };
}
function bangunin(id, divisi) {
  const j = barisDetak(id, divisi);
  if (!j) return false;
  clearTimeout(picuTertunda.get(id)?.timer);
  const timer = setTimeout(() => {
    picuTertunda.delete(id);
    try {
      fs.mkdirSync(path.join(K, 'catatan'), { recursive: true });
      const log = fs.openSync(path.join(K, 'catatan/picu-detak.log'), 'a');
      fs.writeSync(log, `${new Date().toISOString()} bangunin ${id}\n`);
      const env = { ...process.env, ...j.env, KANTOR: K, DETAK_PICU: 'jawaban' };
      // PATH dari cron (installer nulis baris PATH=…/.local/bin) didahulukan; cadangan biar `claude` tetap ketemu.
      env.PATH = [env.PATH || '/usr/bin:/bin', path.join(os.homedir(), '.local/bin'), '/usr/local/bin'].join(':');
      spawn('bash', [j.skrip, id, ...(j.divisi ? [j.divisi] : [])], { cwd: K, detached: true, stdio: ['ignore', log, log], env }).unref();
      fs.closeSync(log);
    } catch (e) { console.error(`bangunin ${id} gagal: ${e.message}`); }
  }, JEDA_PICU);
  picuTertunda.set(id, { timer, kapan: Date.now() + JEDA_PICU });
  return true;
}
// Keadaan task yang udah dijawab: mati (detak gak nyala) | tunggu (bentar lagi dipicu) | jalan (lagi dicatat) |
// antri (detak lagi ngerjain yang lain, abis itu) | ngalah (detak nolak mulai, ada alasannya) | nanti (putaran berikutnya).
function keadaanProses(id, f, divisi) {
  const j = barisDetak(id, divisi);
  if (!j) return { k: 'mati' };
  if (picuTertunda.has(id)) return { k: 'tunggu' };
  let dijawab = jamJawab.get(f) || 0;
  if (!dijawab) try { dijawab = Math.floor(fs.statSync(path.join(K, 'task', f)).mtimeMs / 1000); } catch { /* kehapus */ }
  const [pid, mulai] = bacaAman(path.join(K, 'catatan', `.detak-${id}.jalan`)).trim().split(/\s+/).map(Number);
  let hidup = false;
  try { hidup = pid > 0 && process.kill(pid, 0); } catch { /* udah kelar */ }
  if (hidup) return { k: mulai >= dijawab ? 'jalan' : 'antri' };
  const akhir = bacaAman(path.join(K, 'catatan', `detak-${id}.log`)).trimEnd().split('\n').reverse().find((b) => /^(==|--) /.test(b)) || '';
  const ngalah = akhir.match(/^-- (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) .*dipicu jawaban owner, ngalah: (.+)$/);
  if (ngalah && Date.parse(`${ngalah[1].replace(' ', 'T')}${zonaOffset()}`) / 1000 >= dijawab - 60) return { k: 'ngalah', alasan: ngalah[2] };
  return { k: 'nanti', sekali: !!j.sekali };
}
// Log detak pakai jam lokal mesin (date). Offset zona mesin, buat dibandingin sama mtime file.
function zonaOffset() {
  const m = -new Date().getTimezoneOffset();
  return `${m >= 0 ? '+' : '-'}${String(Math.floor(Math.abs(m) / 60)).padStart(2, '0')}:${String(Math.abs(m) % 60).padStart(2, '0')}`;
}

function setelan() {
  try { return JSON.parse(bacaAman(path.join(SINI, 'tampilan.json')) || '{}'); } catch { return {}; }
}

// Manajer = file peran/PERAN-<id>.md. Urutan ngikutin ORGANISASI.md (meja dibagi berurutan), Builder paling akhir.
function bacaManajer(task, s, tampilan) {
  let file = [];
  try { file = fs.readdirSync(path.join(K, 'peran')).filter((f) => /^PERAN-[a-z0-9-]+\.md$/.test(f) && !/^PERAN-(contoh-|kosong)/.test(f)); } catch { /* kosong */ }
  const urut = [...bacaAman(path.join(K, 'ORGANISASI.md')).matchAll(/peran\/PERAN-([a-z0-9-]+)\.md/g)].map((m) => m[1]);
  const posisi = (x) => (x === 'builder' ? 1000 : (urut.indexOf(x) + 1) || 999);
  const id = file.map((f) => f.slice(6, -3)).sort((a, b) => posisi(a) - posisi(b) || a.localeCompare(b));
  const folder = tampilan === 'cozy' ? 'orang-cozy' : tampilan === 'modern' ? 'orang-modern' : 'orang';
  let giliran = 0;
  return id.map((x, i) => {
    const isi = bacaAman(path.join(K, 'peran', `PERAN-${x}.md`));
    const judul = (isi.match(/^# (.+)$/m)?.[1] || x).split(',');
    const punya = task.filter((t) => t.pegang === x);
    const nunggu = punya.find((t) => t.nunggu);
    const jalan = punya.find((t) => t.status === 'jalan' || t.terjawab);
    const t = nunggu || jalan;
    const rupa = s.rupa?.[x] || RUPA[x] || CADANGAN[giliran++ % CADANGAN.length];
    const rupaGambar = folder === 'orang' || rupa === 'claude-1' || RUPA_GAYA.includes(rupa) ? rupa : RUPA_GAYA[i % RUPA_GAYA.length];
    return {
      id: x, nama: judul[0].trim(), jabatan: (judul[1] || '').trim(), rupa, gambar: `/aset/${folder}/${rupaGambar}-front-right.webp`,
      keadaan: nunggu ? 'nunggu' : jalan ? 'kerja' : 'santai', task: t ? { kode: t.kode, judul: t.judul, f: t.f } : null,
      jumlah: Object.fromEntries(KODE_STATUS.map((st) => [st, punya.filter((p) => p.status === st).length])),
      skill: [...new Set([...isi.matchAll(/skill \*\*([a-z0-9-]+)\*\*/g)].map((m) => m[1]))],
    };
  });
}

function kabarDetak() {
  let log = [];
  try { log = fs.readdirSync(path.join(K, 'catatan')).filter((f) => /^detak-.+\.log$/.test(f)); } catch { /* belum ada */ }
  return log.map((f) => {
    const baris = bacaAman(path.join(K, 'catatan', f)).trimEnd().split('\n');
    const putaran = [...baris].reverse().find((b) => b.startsWith('== ') || b.startsWith('-- ')) || '';
    const waktu = putaran.match(/^.. (\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})/);
    return { id: f.slice(6, -4), tgl: waktu?.[1] || '', jam: waktu?.[2] || '', tidur: putaran.startsWith('-- '), ke: putaran.match(/putaran (\d+)/)?.[1] || '' };
  });
}

function jatah() {
  const mentah = bacaAman(path.join(K, 'catatan/.jatah')).trim();
  if (!mentah) return null;
  const [j5, r5, j7, r7] = mentah.split(/\s+/).map(Number);
  if (!Number.isFinite(j5)) return null;
  const kini = Date.now() / 1000;
  const jam = (t) => (Number.isFinite(t) ? new Intl.DateTimeFormat(lokal(), { timeZone: TZ, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(t * 1000)) : '');
  return { lima: kini < r5 ? j5 : 0, tujuh: kini < r7 ? j7 : 0, reset5: jam(r5), reset7: jam(r7) };
}

const namaKantor = () => (bacaAman(path.join(K, 'ORGANISASI.md')).match(/^# Organisasi kantor (.+)$/m)?.[1] || '').trim();

function md(s) {
  return esc(s).split('\n').map((b) => b.startsWith('### ') ? `<h4>${b.slice(4)}</h4>` : b.match(/^\s*[-*] /) ? `<li>${b.replace(/^\s*[-*] /, '')}</li>` : b.trim() ? `<p>${b}</p>` : '')
    .join('').replace(/(<li>.*?<\/li>)+/g, (x) => `<ul>${x}</ul>`).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>');
}

function data() {
  const s = setelan();
  const task = bacaTask();
  const tampilan = [...Object.keys(UKURAN_RUANG), 'papan'].includes(s.tampilan) ? s.tampilan : 'kantor';
  const owner = { nama: (bacaAman(path.join(K, 'ORGANISASI.md')).match(/^\| *([^|]+?) *\| *Owner *\|/m)?.[1] || 'Owner').trim(), rupa: KODE_OWNER.includes(s.owner) ? s.owner : 'owner-pria' };
  if (/^\[.*\]$/.test(owner.nama)) owner.nama = 'Owner';
  const manajer = bacaManajer(task, s, tampilan);
  // Log detak dinamain pakai id manajer (detak-bima.log): ditampilin pakai nama aslinya.
  const detak = kabarDetak().map((x) => ({ ...x, nama: manajer.find((m) => m.id === x.id)?.nama || x.id }));
  const konten = adaKonten(task, manajer);
  return { tampilan, tema: temaDipakai(s, tampilan), temaPilih: KODE_TEMA.includes(s.tema) ? s.tema : 'klasik', hidup: Hidup.setelan(s.hidup), lokasi: Shalat.lokasi(s.lokasi), kantor: namaKantor(), owner, manajer, task, detak, jatah: jatah(), drive: bacaDrive(), web: bacaWeb(), konten, sosmed: konten ? bacaSosmed() : null };
}

// Sidik = berubah kalau ada yang perlu digambar ulang. app.js nanya tiap 30 detik, isi halaman disegerin tanpa reload.
const sidik = (d) => crypto.createHash('sha1').update(JSON.stringify([d.task.map((t) => [t.f, t.status, t.update, t.judul, t.pegang, t.keputusan, t.udah.length, t.proses?.k]), d.manajer.map((m) => [m.id, m.nama, m.keadaan]), d.detak, d.jatah, d.tampilan, d.owner, d.drive, d.web, d.sosmed && [d.sosmed.kunci, RZ?.semuaPesan?.(K), d.sosmed.rencana.map((p) => [p.id, p.status, p.sidik.slice(0, 8), p.st.diperbarui, (p.st.jadwal || []).map((h) => h.status).join()])]])).digest('hex').slice(0, 12);

// ---------- komponen ----------
const IKON = {
  ringkasan: '<rect x="3.5" y="3.5" width="7" height="8.5" rx="2"/><rect x="13.5" y="3.5" width="7" height="5" rx="2"/><rect x="13.5" y="11.5" width="7" height="9" rx="2"/><rect x="3.5" y="15.5" width="7" height="5" rx="2"/>',
  kantor: '<path d="M4.5 20.5V5.5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v15"/><path d="M15.5 9.5h2a2 2 0 0 1 2 2v9"/><path d="M3 20.5h18"/><path d="M8.5 7.5h3M8.5 11.5h3M8.5 15.5h3"/>',
  task: '<path d="M10 6.5h10M10 12h10M10 17.5h10"/><path d="m3.8 6.5 1.4 1.4 2.6-2.6M3.8 12l1.4 1.4 2.6-2.6"/><circle cx="5.5" cy="17.5" r="1.3"/>',
  konten: '<rect x="3.5" y="4.5" width="17" height="16" rx="3"/><path d="M3.5 9.5h17M8 2.5v4M16 2.5v4"/><path d="m10.5 13.2 3.6 2.1-3.6 2.1z"/>',
  tim: '<circle cx="9" cy="8.5" r="3.3"/><path d="M3 20c.4-3.3 2.9-5.6 6-5.6s5.6 2.3 6 5.6"/><path d="M15.5 5.3a3.3 3.3 0 0 1 0 6.4M17.6 14.8c1.8.8 3.1 2.6 3.4 5.2"/>',
  lainnya: '<circle cx="5.5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18.5" cy="12" r="1.5"/>',
  cari: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  salin: '<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5.5 15H5a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 5 3.5h8.5A1.5 1.5 0 0 1 15 5v.5"/>',
  tutup: '<path d="M6 6l12 12M18 6 6 18"/>',
  panah: '<path d="M5 12h14M13 6l6 6-6 6"/>',
};
const ikon = (n) => `<svg class="ikon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IKON[n]}</svg>`;

const NAV = () => [['/', 'ringkasan'], ['/kantor', 'kantor'], ['/task', 'task'], ['/tim', 'tim'], ['/lainnya', 'lainnya']].map(([h, k]) => [h, tx(`db.nav.${k}`), k]);
// Konten masuk menu utama (abis Task) selama kantor ini punya alat Repliz & divisi sosmed.
const navUtama = (d) => (d.konten ? [...NAV().slice(0, 3), ['/konten', tx('db.nav.konten'), 'konten'], ...NAV().slice(3)] : NAV());

// Tombol salin perintah (buat diketik di aplikasi Claude). Teksnya keliatan, jadi tetap kebaca walau JS mati.
const salin = (teks, label = '') => `<button type="button" class="salin" data-salin="${esc(teks)}" aria-label="${tx('db.salin.aria', { teks: esc(teks) })}">${label ? `<span class="salin-label">${esc(label)}</span>` : ''}<code>${esc(teks)}</code>${ikon('salin')}</button>`;
const ava = (m, kelas = '') => (m ? `<span class="ava ${kelas}" aria-hidden="true"><img src="${esc(m.gambar)}" alt="" loading="lazy"></span>` : `<span class="ava tanpa ${kelas}" aria-hidden="true"></span>`);
const titikStatus = (t) => (t.nyangkut ? 'merah' : t.terjawab ? (t.proses?.k === 'jalan' ? 'hijau berdenyut' : 'dijawab') : t.status === 'nunggu-kamu' ? 'kuning' : t.status === 'jalan' ? 'hijau berdenyut' : t.status === 'beres' ? 'beres' : '');
// Task yang udah dijawab tapi detaknya mati: gak ada yang lagi ngerjain, jadi labelnya "Udah kamu jawab", bukan "Lagi diproses".
const lencana = (t) => (t.terjawab && t.proses?.k === 'mati' ? `<span class="lencana dijawab">${tx('db.lencana.dijawab')}</span>` : `<span class="lencana s-${t.status}">${esc(namaStatus(t.status))}</span>`) + (t.nyangkut ? `<span class="lencana nyangkut">${tx('db.lencana.nyangkut')}</span>` : '');
// Kalimat buat task yang udah dijawab, sesuai keadaan detak pemegangnya (lihat keadaanProses).
function kalimatProses(t, nama) {
  const p = t.proses || { k: 'nanti' };
  const k = p.k === 'nanti' && p.sekali ? 'nantiSekali' : p.k;
  const v = { nama, alasan: p.alasan };
  return [tx(`db.proses.${k}.pendek`, v), tx(`db.proses.${k}.panjang`, v)];
}
const kosong = (judul, teks, tambahan = '') => `<div class="kosong"><b>${esc(judul)}</b><span>${esc(teks)}</span>${tambahan}</div>`;

function barisTask(t, d, { sub } = {}) {
  const m = d.manajer.find((x) => x.id === t.pegang);
  const keterangan = sub ?? [m?.nama || t.pegang, t.terjawab ? kalimatProses(t, m?.nama || tx('db.umum.tim'))[0] : t.status === 'nunggu-kamu' && t.soal[0] ? t.soal[0].teks : t.terakhir].filter(Boolean).join(': ');
  return `<li><a class="baris" href="/task/${enc(t.f)}" data-task="${esc(t.f)}"><span class="ava-status">${ava(m)}<span class="titik ${titikStatus(t)}"></span></span>
<span class="baris-isi"><span class="judul">${esc(t.judul)}</span><span class="sub">${esc(keterangan)}</span></span>
<span class="kanan">${t.hasil.length ? `<span class="jml">${txn('db.task.jmlHasil', t.hasil.length)}</span>` : ''}<span class="kode">${esc(t.kode)}</span><span>${esc(t.nyangkut ? tx('db.task.hariDiem', { n: t.umur }) : relatif(t.update))}</span></span></a></li>`;
}

function lampu(d) {
  const j = d.jatah;
  const level = !j ? 'mati' : j.lima >= 85 || j.tujuh >= 92 ? 'merah' : j.lima >= 60 || j.tujuh >= 75 ? 'kuning' : 'hijau';
  const batang = (v, a, b) => `<svg class="batang" viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true"><rect width="100" height="4" rx="2" class="jalur"/><rect width="${Math.max(2, Math.min(100, v))}" height="4" rx="2" class="${v >= b ? 'merah' : v >= a ? 'kuning' : 'hijau'}"/></svg>`;
  const isi = `<p class="pop-judul">${tx('db.lampu.jatahClaude')}</p>${j ? `<dl class="jatah">
<dt>${tx('db.lampu.limaJam')}</dt><dd>${j.lima}%</dd>${batang(j.lima, 60, 85)}${j.reset5 ? `<dd class="reset">${tx('db.lampu.balikPenuh', { kapan: esc(j.reset5) })}</dd>` : ''}
<dt>${tx('db.lampu.mingguan')}</dt><dd>${j.tujuh}%</dd>${batang(j.tujuh, 75, 92)}${j.reset7 ? `<dd class="reset">${tx('db.lampu.balikPenuh', { kapan: esc(j.reset7) })}</dd>` : ''}</dl>
<p class="redup kecil">${tx('db.lampu.dariDetak')}</p>`
    : `<p class="redup kecil">${tx('db.lampu.belumAda')}</p>`}
<p class="pop-judul">Google Drive</p>${(() => { const st = statusDrive(d.drive); return `<a class="pop-drive s-${st.kelas}" href="/drive"><span class="lampu-status" aria-hidden="true"></span><span>${esc(st.judul)}${d.drive.folderNama ? `<small>${esc(d.drive.folderNama)}</small>` : ''}</span></a>`; })()}
<p class="pop-judul">${tx('db.otomatis.judul')}</p>${d.detak.length ? `<ul class="pop-detak">${d.detak.map((x) => `<li><b>${esc(x.nama)}</b><span>${esc(x.jam ? `${relatif(x.tgl)} ${x.jam}` : '-')}</span></li>`).join('')}</ul>` : `<p class="redup kecil">${tx('db.lampu.masihMati')}</p>`}<a class="pop-lagi" href="/lainnya#otomatis">${tx('db.lampu.atur')}</a>`;
  const label = j ? tx('db.lampu.labelAngka', { n: j.lima }) : tx('db.lampu.label');
  return `<div class="lampu"><button type="button" class="lampu-tombol" aria-expanded="false" aria-controls="pop-jatah" data-pop="pop-jatah" title="${tx('db.lampu.judul')}"><span class="titik ${level === 'mati' ? '' : level}"></span><span class="sembunyi-hp">${esc(label)}</span></button><div class="pop" id="pop-jatah" hidden role="dialog" aria-label="${tx('db.lampu.judul')}">${isi}</div></div>`;
}

function indeksCari(d) {
  const nama = Object.fromEntries(d.manajer.map((m) => [m.id, m.nama]));
  return [
    ...navUtama(d).map(([h, j, k]) => ({ h, j, d: tx('db.cari.halaman'), s: tx(`db.cari.kata.${k}`) })),
    { h: '/lainnya#tampilan', j: tx('db.cari.gantiTampilan'), d: tx('db.cari.halaman'), s: tx('db.cari.kata.tampilan') },
    { h: '/web', j: tx('db.web.judul'), d: tx('db.cari.halaman'), s: tx('db.cari.kata.web') },
    { h: '/drive', j: 'Google Drive', d: tx('db.cari.halaman'), s: tx('db.cari.kata.drive') },
    ...d.manajer.map((m) => ({ h: `/task?pegang=${enc(m.id)}`, j: m.nama, d: m.jabatan || tx('db.umum.tim'), s: `${m.id} ${m.skill.join(' ')}` })),
    ...d.task.map((t) => ({ t: t.f, j: t.judul, d: `${t.kode}, ${namaStatus(t.status)}`, s: `${t.kode} ${nama[t.pegang] || t.pegang || ''} ${t.divisi || ''} ${t.status}` })),
  ];
}

// Kamus app.* buat skrip browser (aset/app.js dkk), dibaca dari blok JSON non-eksekusi (lolos CSP script-src 'self').
const teksApp = () => `<script type="application/json" id="teks-app">${JSON.stringify(bagianKamus('app.')).replace(/</g, '\\u003c')}</script>`;
const halaman = (d, { judul, aktif, isi, skrip = '', kelas = '' }) => {
  const n = d.task.filter((t) => t.nunggu).length;
  const nk = d.konten ? d.sosmed.rencana.filter((p) => p.status === 'nunggu').length : 0;
  const lencanaNav = (k) => (k === 'ringkasan' && n ? `<span class="nav-jml" aria-label="${tx('db.nav.ariaNunggu', { n })}">${n}</span>` : k === 'konten' && nk ? `<span class="nav-jml" aria-label="${tx('db.nav.ariaKonten', { n: nk })}">${nk}</span>` : '');
  const navAtas = navUtama(d).map(([h, l, k]) => `<a href="${h}"${aktif === k ? ' aria-current="page"' : ''}>${esc(l)}${lencanaNav(k)}</a>`).join('');
  const navHp = navUtama(d).map(([h, l, k]) => `<a href="${h}"${aktif === k ? ' aria-current="page"' : ''}><span class="nav-ikon">${ikon(k)}${lencanaNav(k)}</span>${esc(l)}</a>`).join('');
  return `<!doctype html><html lang="${bahasaAktif()}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#0A1222"><title>${esc(judul)} · ${tx('db.kerangka.kantor')} ${esc(d.kantor)}</title>
<link rel="preload" href="/aset/jakarta.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/aset/gaya.css"><link rel="stylesheet" href="/aset/gaya-fitur.css">
${teksApp()}<script src="/aset/app.js" defer></script>${skrip}</head><body class="t-${d.tampilan} ${kelas}" data-sidik="${sidik(d)}">
<a class="sr" href="#isi">${tx('db.kerangka.keIsi')}</a>
<header class="atas"><a class="merek" href="/"><i aria-hidden="true">${esc((d.kantor || 'K')[0].toUpperCase())}</i><span><small>${tx('db.kerangka.kantor')}</small> ${esc(d.kantor || 'AI')}</span></a>
<nav class="nav-atas" aria-label="${tx('db.kerangka.menu')}" data-segar="nav-atas">${navAtas}</nav>
<button class="cari" type="button" data-cari aria-keyshortcuts="Control+K Meta+K /">${ikon('cari')}<span>${tx('db.kerangka.cari')}</span><kbd>⌘K</kbd></button>
<div data-segar="lampu">${lampu(d)}</div></header>
<main class="isi" id="isi">${isi}</main>
<nav class="nav-hp" aria-label="${tx('db.kerangka.menu')}" data-segar="nav-hp">${navHp}</nav>
<div class="tirai" hidden data-tutup></div><aside class="drawer" hidden role="dialog" aria-modal="true" aria-labelledby="judul-drawer"></aside>
<div class="palet" hidden role="dialog" aria-modal="true" aria-label="${tx('db.kerangka.cariAria')}"><div class="palet-kotak"><label class="palet-cari">${ikon('cari')}<input type="search" placeholder="${tx('db.kerangka.cariIsi')}" aria-label="${tx('db.kerangka.cariAria')}" autocomplete="off" enterkeyhint="go"></label><ul role="listbox" aria-label="${tx('db.kerangka.hasilAria')}"></ul><p class="palet-kaki">${tx('db.kerangka.paletKaki')}</p></div></div>
<div class="toast" hidden role="status" aria-live="polite"></div>
<script type="application/json" id="indeks">${JSON.stringify(indeksCari(d)).replace(/</g, '\\u003c')}</script>
</body></html>`;
};

// ---------- Ringkasan ----------
// Form jawab: ditulis ke file task sebagai "Jawaban owner: …" (lihat tulisJawaban). app.js ngirim lewat fetch, tanpa
// JS tetap jalan sebagai form biasa.
const formJawab = (t, isian, tombol) => `<form method="post" action="/jawab" data-jawab><input type="hidden" name="f" value="${esc(t.f)}">${Object.entries(isian).map(([k, v]) => `<input type="hidden" name="${k}" value="${esc(v)}">`).join('')}${tombol}</form>`;
const semuaAdaSaran = (t) => t.soal.length > 0 && t.soal.every((q) => q.opsi.some((o) => o.rek));

function itemNunggu(t, d) {
  const m = d.manajer.find((x) => x.id === t.pegang);
  const nama = m?.nama || tx('db.umum.timKecil');
  const q = t.soal[0];
  const saran = t.soal.map((x) => [x, x.opsi.find((o) => o.rek)]).filter(([, o]) => o);
  const bisaSetuju = semuaAdaSaran(t);
  return `<li><div class="item-nunggu"><a class="item-buka" href="/task/${enc(t.f)}" data-task="${esc(t.f)}">
<span class="baris1">${ava(m, 'kecil')}<b class="siapa">${esc(m?.nama || t.pegang || tx('db.umum.tim'))}</b><span class="kode">${esc(t.kode)}</span><span class="umur">${esc(relatif(t.update))}</span></span>
<span class="judul">${esc(t.judul)}${t.hasil.length ? ` <span class="jml">${txn('db.task.jmlHasil', t.hasil.length)}</span>` : ''}</span>
${q ? `<span class="soal-1">${esc(q.teks)}${t.soal.length > 1 ? ` <span class="redup">${tx('db.nunggu.soalLagi', { n: t.soal.length - 1 })}</span>` : ''}</span>` : t.keputusan ? `<span class="soal-1">${esc(t.keputusan.split('\n')[0])}</span>` : ''}
${saran.length ? `<span class="saran-tim"><b>${tx('db.nunggu.saran', { nama: esc(nama) })}</b><span>${saran.slice(0, 3).map(([x, o]) => `<span>${t.soal.length > 1 ? `${esc(x.nomor)}. ` : ''}${esc(o.teks)}</span>`).join('')}</span></span>` : ''}</a>
<div class="aksi">${bisaSetuju ? formJawab(t, { saran: 'semua' }, `<button class="tombol utama" type="submit">${t.soal.length > 1 ? tx('db.nunggu.setujuSemua') : tx('db.nunggu.setuju')}</button>`) : ''}<a class="tombol" href="/task/${enc(t.f)}" data-task="${esc(t.f)}">${bisaSetuju ? tx('db.nunggu.pilihSendiri') : tx('db.nunggu.jawab')}</a></div></div></li>`;
}

function panelNunggu(d, nunggu) {
  const tampil = nunggu.slice(0, 5);
  const dijawab = d.task.filter((t) => t.terjawab);
  return `<section class="panel panel-nunggu" aria-labelledby="j-nunggu"><header><h2 id="j-nunggu">${tx('db.nunggu.judul')}</h2><span class="jml${nunggu.length ? ' ada' : ''}">${nunggu.length}</span>${nunggu.length > 5 ? `<a class="lagi" href="/task?status=nunggu-kamu">${tx('db.umum.semua')}</a>` : ''}</header>
${tampil.length ? `<ul class="nunggu">${tampil.map((t) => itemNunggu(t, d)).join('')}</ul>` : kosong(tx('db.nunggu.kosongJudul'), tx('db.nunggu.kosongTeks'))}
${dijawab.length ? `<div class="sudah-dijawab"${dijawab.some((t) => ['tunggu', 'jalan', 'antri'].includes(t.proses?.k)) ? ' data-pantau' : ''}><p>${tx('db.nunggu.dijawab')}</p><ul class="daftar">${dijawab.map((t) => barisTask(t, d)).join('')}</ul></div>` : ''}
${tampil.length ? `<div class="cara-jawab"><p>${tx('db.nunggu.caraJawab')}</p>${salin(tx('db.perintah.nunggu'))}</div>` : ''}</section>`;
}

function jendelaKantor(d) {
  const n = (k) => d.manajer.filter((m) => m.keadaan === k).length;
  const teks = [n('kerja') && tx('db.jendela.kerja', { n: n('kerja') }), n('nunggu') && tx('db.jendela.nunggu', { n: n('nunggu') }), n('santai') && tx('db.jendela.santai', { n: n('santai') })].filter(Boolean).join(', ') || tx('db.jendela.belumAda');
  if (d.tampilan === 'papan') return `<a class="jendela papan" href="/kantor"><span class="jendela-isi"><b>${tx('db.nav.kantor')}</b><span>${esc(teks)}</span><span class="redup kecil">${tx('db.jendela.papan')}</span></span>${ikon('panah')}</a>`;
  const gambar = d.tampilan === 'studio' ? 'kantor' : d.tampilan;
  const src = d.tema !== 'klasik' ? `/aset/tema-${d.tema}-kecil.webp` : d.tampilan === 'masjid' ? '/aset/ruang-masjid.webp' : `/aset/tampilan-${gambar}.webp`;
  return `<a class="jendela" href="/kantor"><img src="${src}" alt="" width="720" height="360"><span class="jendela-isi"><span class="titik hijau berdenyut"></span><b>${tx('db.kantor.live')}</b><span class="jendela-teks">${esc(teks)}</span>${ikon('panah')}</span></a>`;
}

function panelTim(d, { ringkas = false } = {}) {
  return `<section class="panel tenang" aria-labelledby="j-tim"><header><h2 id="j-tim">${tx('db.tim.judul')}</h2><span class="jml">${d.manajer.length}</span>${ringkas ? `<a class="lagi" href="/tim">${tx('db.umum.semua')}</a>` : ''}</header>
<ul class="daftar-tim">${d.manajer.map((m) => `<li class="k-${m.keadaan}">${ava(m)}<span class="tim-isi"><span class="tim-nama"><b>${esc(m.nama)}</b><span class="keadaan"><i></i>${keadaan(m.keadaan)}</span></span>${m.task ? `<a href="/task/${enc(m.task.f)}" data-task="${esc(m.task.f)}">${esc(m.task.judul)}</a>` : `<span class="redup">${esc(m.jabatan || tx('db.tim.gakAdaTask'))}</span>`}</span></li>`).join('')}</ul></section>`;
}

const kalimatDetak = (x) => (!x.jam ? tx('db.otomatis.belumPernah') : x.tidur ? tx('db.otomatis.dicek', { kapan: relatif(x.tgl), jam: x.jam }) : `${tx('db.otomatis.kerja', { kapan: relatif(x.tgl), jam: x.jam })}${x.ke ? tx('db.otomatis.putaran', { n: x.ke }) : ''}`);

function panelOtomatis(d) {
  return `<section class="panel tenang" id="otomatis" aria-labelledby="j-otomatis"><header><h2 id="j-otomatis">${tx('db.otomatis.judul')}</h2></header>
${d.detak.length ? `<ul class="daftar-detak">${d.detak.map((x) => `<li><span class="titik ${x.tidur ? '' : 'hijau'}"></span><b>${esc(x.nama)}</b><span class="redup">${esc(kalimatDetak(x))}</span></li>`).join('')}</ul>`
    : kosong(tx('db.otomatis.matiJudul'), tx('db.otomatis.matiTeks'), salin(tx('db.perintah.nyalainDetak')))}</section>`;
}

function halRingkasan(d) {
  const nunggu = d.task.filter((t) => t.nunggu);
  const jalan = d.task.filter((t) => t.status === 'jalan');
  const nyangkut = jalan.filter((t) => t.nyangkut);
  const beres = d.task.filter((t) => t.status === 'beres' && t.umur != null && t.umur <= 7).length;
  const sapa = d.owner.nama && d.owner.nama !== 'Owner' ? tx('db.ringkasan.halo', { nama: d.owner.nama }) : '';
  const h1 = nunggu.length ? tx(sapa ? 'db.ringkasan.adaNunggu' : 'db.ringkasan.adaNungguAwal', { sapa, n: nunggu.length }) : tx(sapa ? 'db.ringkasan.aman' : 'db.ringkasan.amanAwal', { sapa });
  const sub = [
    ...nyangkut.slice(0, 2).map((t) => `<li><span class="titik merah"></span><span class="teks"><a href="/task/${enc(t.f)}" data-task="${esc(t.f)}">${esc(t.judul)}</a> <span class="redup">${tx('db.ringkasan.nyangkut', { n: t.umur })}</span></span></li>`),
    ...((n) => (n ? [`<li><span class="titik kuning"></span><span class="teks"><a href="/konten#pesan-masuk">${tx('db.pesan.nunggu', { n })}</a></span></li>`] : []))(RZ?.semuaPesan ? RZ.semuaPesan(K).filter((p) => ['baru', 'nunggu'].includes(p.status)).length : 0),
    ...((n) => (n ? [`<li><span class="titik kuning"></span><span class="teks">${txn('db.ringkasan.sosmed', n)}</span></li>`] : []))(bacaSosmed().rencana.filter((p) => p.status === 'nunggu').length),
    ...((v) => (v ? [bacaAman(path.join(K, 'catatan/.kit-versi-penting')).trim() === v
      ? `<li><span class="titik merah"></span><span class="teks">${tx('db.ringkasan.updatePenting', { v: esc(v) })}</span></li>`
      : `<li><span class="titik kuning"></span><span class="teks">${tx('db.ringkasan.updateAda', { v: esc(v) })}</span></li>`] : []))(bacaAman(path.join(K, 'catatan/.kit-versi-baru')).split('\n')[0].trim()),
    ...((n) => (n ? [`<li><span class="titik hijau berdenyut"></span><span class="teks">${txn('db.ringkasan.diproses', n)}</span></li>`] : []))(d.task.filter((t) => t.terjawab && t.proses?.k !== 'mati').length),
    jalan.length ? `<li><span class="titik hijau berdenyut"></span><span class="teks">${txn('db.ringkasan.jalan', jalan.length)}</span></li>` : d.task.some((t) => t.terjawab) ? '' : `<li><span class="titik"></span><span class="teks redup">${tx('db.ringkasan.sepi')}</span></li>`,
  ].join('');
  const hitung = [['nunggu-kamu', namaStatus('nunggu-kamu'), nunggu.length], ['jalan', namaStatus('jalan'), jalan.length], ['beres', tx('db.ringkasan.beres7'), beres]]
    .map(([s, l, x]) => `<a class="h-${s}${x ? '' : ' nol'}" href="/task?status=${s}"><b>${x}</b><span>${l}</span></a>`).join('');
  const panelJalan = `<section class="panel tenang" aria-labelledby="j-jalan"><header><h2 id="j-jalan">${tx('db.ringkasan.lagiDikerjain')}</h2><span class="jml">${jalan.length}</span><a class="lagi" href="/task">${tx('db.ringkasan.semuaTask')}</a></header>
${jalan.length ? `<ul class="daftar">${jalan.slice(0, 7).map((t) => barisTask(t, d)).join('')}</ul>` : kosong(tx('db.ringkasan.sepiJudul'), tx('db.ringkasan.sepiTeks'))}</section>`;
  return `<div data-segar="ringkasan"><div class="ringkas"><div class="ringkas-teks"><p class="tgl">${esc(tanggalPanjang())}</p><h1>${esc(h1)}</h1><ul class="sub-ringkas">${sub}</ul></div><nav class="hitung" aria-label="${tx('db.ringkasan.jumlahAria')}">${hitung}</nav></div>
<div class="grid"><div class="kolom kolom-kiri"><div class="o-nunggu">${panelNunggu(d, nunggu)}</div><div class="o-jalan">${panelJalan}</div></div>
<div class="kolom kolom-kanan"><div class="o-jendela">${jendelaKantor(d)}</div><div class="o-tim">${panelTim(d, { ringkas: true })}</div><div class="o-otomatis">${panelOtomatis(d)}</div></div></div></div>`;
}

// ---------- Kantor ----------
function halKantor(d) {
  const legenda = `<p class="legenda"><span class="k-kerja"><i></i>${keadaan('kerja')}</span><span class="k-nunggu"><i></i>${keadaan('nunggu')}</span><span class="k-santai"><i></i>${keadaan('santai')}</span></p>`;
  if (d.tampilan === 'papan') {
    return `<div class="kepala-hal"><h1>${tx('db.nav.kantor')}</h1></div><div class="tumpuk"><section class="panel"><div class="kosong"><b>${tx('db.kantor.papanJudul')}</b><span>${tx('db.kantor.papanTeks')}</span><a class="tombol utama" href="/lainnya#tampilan">${tx('db.kantor.pilihTampilan')}</a></div></section><div data-segar="tim-kantor">${panelTim(d)}</div></div>`;
  }
  return `<div class="kepala-hal"><h1>${tx('db.kantor.live')}</h1>${legenda}</div>
<div class="kantor-grid"><section class="panel panel-peta" aria-label="${tx('db.kantor.denah')}">${ADA_MASJID.includes(d.tampilan) ? '<p class="banner-shalat" data-shalat aria-live="polite" hidden></p>' : ''}<div class="peta-gulir${d.tema !== 'klasik' ? ` tema-${d.tema}` : ''}" data-gulir><div class="peta ${d.tampilan}" data-peta="${d.tampilan}" data-tema="${d.tema}"><img class="ruang" src="/aset/${d.tema !== 'klasik' ? `tema-${d.tema}-${d.tampilan}` : `ruang-${d.tampilan}`}.webp" alt="${tx('db.kantor.denahAlt', { kantor: esc(d.kantor) })}" width="${UKURAN_RUANG[d.tampilan][0]}" height="${UKURAN_RUANG[d.tampilan][1]}" draggable="false"></div></div>
<p class="petunjuk-peta">${tx('db.kantor.petunjuk')}</p></section>
<div data-segar="tim-kantor">${panelTim(d)}</div></div>
<div class="kartu-orang" data-kartu hidden></div>${(() => { const h = dataTemaHidup(d.tema, d.tampilan); return h ? `<script type="application/json" id="tema-denah">${JSON.stringify(h).replace(/</g, '\\u003c')}</script>` : ''; })()}`;
}

// ---------- Task ----------
function halDaftarTask(d, q) {
  const status = KODE_STATUS.includes(q.get('status')) ? q.get('status') : '';
  const pegang = d.manajer.some((m) => m.id === q.get('pegang')) ? q.get('pegang') : '';
  const kecuali = (x) => d.task.filter((t) => (!pegang || t.pegang === pegang) && (x === '' || t.status === x));
  const url = (s, p) => `/task${[s && `status=${s}`, p && `pegang=${enc(p)}`].filter(Boolean).length ? `?${[s && `status=${s}`, p && `pegang=${enc(p)}`].filter(Boolean).join('&')}` : ''}`;
  const segmen = [['', tx('db.umum.semua')], ...STATUS()].map(([s, l]) => `<a href="${url(s, pegang)}"${status === s ? ' aria-current="true"' : ''}>${esc(l)}<span>${kecuali(s).length}</span></a>`).join('');
  const chip = [['', tx('db.taskHal.semuaTim')], ...d.manajer.map((m) => [m.id, m.nama])].map(([p, l]) => `<a href="${url(status, p)}"${pegang === p ? ' aria-current="true"' : ''}>${p ? ava(d.manajer.find((m) => m.id === p), 'mini') : ''}${esc(l)}</a>`).join('');
  const isi = kecuali(status);
  let daftar;
  if (!isi.length) daftar = `<section class="panel">${kosong(tx('db.taskHal.kosongJudul'), status ? tx('db.taskHal.cobaLain') : tx('db.taskHal.kasihBaru'), status ? '' : salin(tx('db.perintah.baru')))}</section>`;
  else if (status) daftar = `<section class="panel"><ul class="daftar">${isi.map((t) => barisTask(t, d)).join('')}</ul></section>`;
  else {
    daftar = STATUS().filter(([s]) => isi.some((t) => t.status === s)).map(([s, l]) => {
      const grup = isi.filter((t) => t.status === s);
      const baris = grup.map((t) => barisTask(t, d)).join('');
      return s === 'beres' && grup.length > 5
        ? `<section class="panel tenang"><header><h2>${l}</h2><span class="jml">${grup.length}</span></header><ul class="daftar">${grup.slice(0, 5).map((t) => barisTask(t, d)).join('')}</ul><details class="lipat"><summary>${tx('db.taskHal.lagi', { n: grup.length - 5 })}</summary><ul class="daftar">${grup.slice(5).map((t) => barisTask(t, d)).join('')}</ul></details></section>`
        : `<section class="panel${s === 'nunggu-kamu' ? ' panel-nunggu' : ' tenang'}"><header><h2>${l}</h2><span class="jml${s === 'nunggu-kamu' ? ' ada' : ''}">${grup.length}</span></header><ul class="daftar">${baris}</ul></section>`;
    }).join('');
  }
  return `<div data-segar="task"><div class="kepala-hal"><h1>${tx('db.nav.task')}</h1><span class="redup">${txn('db.taskHal.ringkas', d.task.length, { jalan: d.task.filter((t) => t.status === 'jalan').length })}</span></div>
<nav class="segmen" aria-label="${tx('db.taskHal.saringStatus')}">${segmen}</nav><nav class="chip-baris" aria-label="${tx('db.taskHal.saringOrang')}">${chip}</nav><div class="tumpuk">${daftar}</div></div>`;
}

// ---------- Tim ----------
function halTim(d) {
  const kartu = d.manajer.map((m) => `<article class="kartu-tim k-${m.keadaan}"><div class="kepala-tim">${ava(m, 'besar')}<div><h2>${esc(m.nama)}</h2><p class="redup">${esc(m.jabatan || '')}</p></div><span class="keadaan"><i></i>${keadaan(m.keadaan)}</span></div>
${m.task ? `<p class="kini"><span class="redup">${m.keadaan === 'nunggu' ? tx('db.tim.nungguDi') : tx('db.tim.lagiNgerjain')}</span> <a href="/task/${enc(m.task.f)}" data-task="${esc(m.task.f)}">${esc(m.task.judul)}</a></p>` : `<p class="kini redup">${tx('db.tim.gakAdaJalan')}</p>`}
<dl class="angka">${['nunggu-kamu', 'jalan', 'antre', 'beres'].map((s) => [s, tx(`db.tim.angka.${s}`)]).map(([s, l]) => `<div class="${m.jumlah[s] ? '' : 'nol'}"><dt>${l}</dt><dd>${m.jumlah[s]}</dd></div>`).join('')}</dl>
${m.skill.length ? `<p class="skill">${m.skill.map((s) => `<span>${esc(s)}</span>`).join('')}</p>` : ''}
<div class="aksi">${salin(`jadi ${m.id}`, tx('db.tim.panggil'))}<a class="tombol hantu" href="/task?pegang=${enc(m.id)}">${tx('db.tim.taskNama', { nama: esc(m.nama) })}</a></div></article>`).join('');
  return `<div data-segar="tim"><div class="kepala-hal"><h1>${tx('db.tim.judul')}</h1><span class="redup">${tx('db.tim.sub')}</span></div>
<div class="tim-grid">${kartu || `<section class="panel">${kosong(tx('db.tim.kosongJudul'), tx('db.tim.kosongTeks'), salin('jadi builder'))}</section>`}</div>
<section class="panel tenang tambah-tim"><div><h2>${tx('db.tim.tambahJudul')}</h2><p class="redup">${tx('db.tim.tambahTeks')}</p></div>${salin(tx('db.perintah.tambahDivisi'))}</section></div>`;
}

// ---------- Lainnya ----------
function bagianTampilan(d) {
  return `<section class="panel" id="tampilan" aria-labelledby="j-tampilan"><header><h2 id="j-tampilan">${tx('db.tampilan.judul')}</h2></header><form method="post" action="/tampilan" class="pilih-tampilan">
<fieldset><legend class="sr">${tx('db.tampilan.template')}</legend><div class="pilih-template">${PILIHAN().map(([k, l, ket]) => `<label><input type="radio" name="tampilan" value="${k}"${d.tampilan === k ? ' checked' : ''}>${['cozy', 'modern', 'kantor', 'lengkap'].includes(k) ? `<img src="/aset/tampilan-${k}.webp" alt="" width="720" height="360" loading="lazy">` : `<span class="tanpa-gambar">${tx(`db.tampilan.${k}.gambar`)}</span>`}<span class="teks"><b>${l}</b><small>${ket}${d.tampilan === k ? tx('db.tampilan.dipakai') : ''}</small></span></label>`).join('')}</div></fieldset>
<fieldset><legend class="sub-pilih">${tx('db.tema.judul')}</legend><p class="redup kecil">${tx('db.tema.ket')}</p><div class="pilih-template">${TEMA().map(([k, l, ket]) => `<label><input type="radio" name="tema" value="${k}"${(d.temaPilih || d.tema) === k ? ' checked' : ''}><img src="/aset/${k === 'klasik' ? 'tampilan-kantor' : `tema-${k}-kecil`}.webp" alt="" width="720" height="360" loading="lazy"><span class="teks"><b>${l}</b><small>${ket}${d.tema === k ? tx('db.tampilan.dipakai') : ''}</small></span></label>`).join('')}</div></fieldset>
<fieldset><legend class="sub-pilih">${tx('db.tampilan.karakter')}</legend><div class="pilih-owner">${OWNER().map(([k, l]) => `<label><input type="radio" name="owner" value="${k}"${d.owner.rupa === k ? ' checked' : ''}><img src="/aset/orang-cozy/${k}-front-right.webp" alt="" width="70" height="160" loading="lazy"><span>${l}</span></label>`).join('')}</div></fieldset>
<fieldset class="lokasi-shalat"><legend class="sub-pilih">${tx('db.tampilan.lokasi')}</legend>
<label>${tx('db.tampilan.kota')} <select name="kota">${Shalat.KOTA.map((k) => `<option value="${esc(k.nama)}"${JSON.stringify(k) === JSON.stringify(d.lokasi) ? ' selected' : ''}>${esc(k.nama)} (${['WIB', 'WITA', 'WIT'][Shalat.ZONA[k.zona] - 7]})</option>`).join('')}<option value="manual"${!Shalat.KOTA.some((k) => JSON.stringify(k) === JSON.stringify(d.lokasi)) ? ' selected' : ''}>${tx('db.tampilan.manual')}</option></select></label>
<p class="redup kecil">${tx('db.tampilan.manualKet')}</p>
<label>${tx('db.tampilan.namaKota')} <input name="lokasi-nama" value="${esc(d.lokasi.nama)}" maxlength="80"></label>
<label>${tx('db.tampilan.lintang')} <input name="lintang" type="number" min="-90" max="90" step="any" value="${d.lokasi.lintang}"></label>
<label>${tx('db.tampilan.bujur')} <input name="bujur" type="number" min="-180" max="180" step="any" value="${d.lokasi.bujur}"></label>
<label>${tx('db.tampilan.zona')} <select name="zona">${Object.entries(Shalat.ZONA).map(([z, n]) => `<option value="${z}"${d.lokasi.zona === z ? ' selected' : ''}>${['WIB', 'WITA', 'WIT'][n - 7]}</option>`).join('')}</select></label>
<p class="redup kecil">${tx('db.tampilan.lokasiRusak')}</p></fieldset>
<p class="redup kecil">${tx('db.tampilan.masjidKarakter')}</p>
<input type="hidden" name="token" value="${esc(d.token)}">
<fieldset class="lokasi-shalat"><legend class="sub-pilih">${tx('db.hidup.judul')}</legend>
<label>${tx('db.hidup.aktif')} <select name="hidup"><option value="nyala"${d.hidup.nyala ? ' selected' : ''}>${tx('db.hidup.nyala')}</option><option value="mati"${!d.hidup.nyala ? ' selected' : ''}>${tx('db.hidup.mati')}</option></select></label>
<label>${tx('db.hidup.ramai')} <select name="keramaian">${Object.keys(Hidup.TINGKAT).map((k) => `<option value="${k}"${d.hidup.ramai === k ? ' selected' : ''}>${tx(`db.hidup.${k === 'ramai' ? 'ramaiLabel' : k}`)}</option>`).join('')}</select></label>
<p class="redup kecil">${tx('db.hidup.ket')}</p></fieldset>
<div class="kirim"><button class="tombol utama">${tx('db.tampilan.pakai')}</button><p class="redup kecil">${tx('db.tampilan.pakaiKet')}</p></div></form></section>`;
}

// ---------- Google Drive ----------
// Status dirangkum dari .drive/ (diisi alat/drive-folder.mjs & satpam-drive.mjs), akun Claude yang login di server, &
// hasil cek konektor (`claude mcp list`: gak makan jatah, ±5 detik). Dashboard gak nyambungin sendiri: login Google
// itu urusan konektor akun Claude, nyimpen folder lewat Builder (owner yang nyetujuin).
const LINK_KONEKTOR = 'https://claude.ai/settings/connectors';
const FILE_CEK = path.join(SINI, 'drive-cek.json');
let lagiCekDrive = false;
const bacaJsonAman = (f) => { try { return JSON.parse(bacaAman(f)); } catch { return null; } };

function bacaDrive() {
  const f = bacaJsonAman(path.join(K, '.drive/folder.json'));
  const k = bacaJsonAman(path.join(K, '.drive/dikenal.json')) || {};
  const i = bacaJsonAman(path.join(K, '.drive/info.json')) || {};
  const akun = bacaJsonAman(path.join(os.homedir(), '.claude.json'))?.oauthAccount || {};
  const user = bacaJsonAman(path.join(os.homedir(), '.claude/settings.json')) || {};
  return {
    folder: f?.utama || '', folderNama: i.folderNama || '', hasil: Object.entries(k.folder || {}).find(([, z]) => z === 'tulis')?.[0] || '',
    hasilNama: i.hasilNama || '', akunClaude: akun.emailAddress || '', akunGoogle: i.akunGoogle || '', pemilikFolder: i.pemilikFolder || '',
    terakhir: i.terakhir || '', jumlahFile: Object.keys(k.file || {}).length, konektorKantor: user.disableClaudeAiConnectors !== true,
    cek: bacaJsonAman(FILE_CEK), lagiCek: lagiCekDrive,
  };
}

function cariClaude() {
  for (const d of [...(process.env.PATH || '').split(':'), path.join(os.homedir(), '.local/bin')]) {
    const f = path.join(d || '.', 'claude');
    try { fs.accessSync(f, fs.constants.X_OK); return f; } catch { /* lanjut */ }
  }
  return '';
}

function cekKonektorDrive() {
  if (lagiCekDrive) return;
  const simpan = (status, teks = '') => { lagiCekDrive = false; fs.writeFileSync(FILE_CEK, `${JSON.stringify({ waktu: new Date().toISOString(), status, teks })}\n`); };
  const bin = cariClaude();
  if (!bin) return simpan('gagal-cek', tx('db.drive.claudeGakAda'));
  lagiCekDrive = true;
  // --settings: tetap ngecek akun Claude walaupun kantor masih matiin konektor (bawaan kit, biar bekal sesi irit).
  execFile(bin, ['--settings', '{"disableClaudeAiConnectors":false}', 'mcp', 'list'], { cwd: K, timeout: 90000, env: { ...process.env, PATH: `${path.dirname(bin)}:${process.env.PATH || ''}` } }, (err, out = '', galat = '') => {
    const semua = `${out}\n${galat}`;
    const baris = semua.split('\n').find((b) => /claude\.ai Google Drive/i.test(b)) || '';
    if (baris) {
      if (baris.includes('✔')) return simpan('nyambung');
      return simpan(/auth/i.test(baris) ? 'perlu-login' : 'gagal', baris.replace(/^.*? - /, '').trim().slice(0, 160));
    }
    if (err && !/claude\.ai /.test(semua)) return simpan('gagal-cek', String(err.message || '').slice(0, 160));
    return simpan('belum');
  });
}

const relatifIso = (iso) => {
  const t = Date.parse(iso || '');
  if (!t) return '';
  const m = Math.round((Date.now() - t) / 60000);
  return m < 2 ? tx('db.tgl.barusan') : m < 60 ? tx('db.tgl.menitLalu', { n: m }) : m < 1440 ? txn('db.tgl.jamLalu', Math.floor(m / 60)) : txn('db.tgl.hariLalu', Math.floor(m / 1440));
};
const linkFolder = (id) => `https://drive.google.com/drive/folders/${enc(id)}`;
const tautan = (href, teks) => `<a href="${href}" target="_blank" rel="noopener">${esc(teks)}</a>`;

function statusDrive(g) {
  const c = g.cek?.status;
  const st = (kelas, k) => ({ kelas, judul: tx(`db.drive.st.${k}.judul`), teks: tx(`db.drive.st.${k}.teks`) });
  if (!g.folder) return c === 'nyambung' ? st('hampir', 'tanpaFolder') : st('belum', 'belum');
  if (!g.konektorKantor) return st('masalah', 'dimatiin');
  if (c === 'perlu-login') return st('masalah', 'perluLogin');
  if (c === 'belum') return st('masalah', 'akunBelum');
  if (c === 'gagal') return st('masalah', 'gagal');
  if (!g.terakhir) return st('hampir', 'hampir');
  return st('ok', 'ok');
}

function isiStatusDrive(g) {
  const st = statusDrive(g);
  const c = g.cek?.status;
  const redup = (k) => `<span class="redup">${tx(k)}</span>`;
  const masalah = (k) => `<span class="masalah">${tx(k)}</span>`;
  const konektor = g.lagiCek ? redup('db.drive.lagiCek')
    : c === 'nyambung' ? `<span class="ok">${tx('db.drive.nyambung')}</span>` : c === 'perlu-login' ? masalah('db.drive.perluLogin')
      : c === 'belum' ? masalah('db.drive.belumNyala') : c ? masalah('db.drive.gagalCek') : redup('db.drive.belumCek');
  const tombolCek = `<form method="post" action="/drive/cek" class="sebaris"><button class="tombol kecil" type="submit"${g.lagiCek ? ' disabled' : ''}>${tx('db.drive.cekLagi')}</button></form>`;
  const akunGoogle = g.akunGoogle ? esc(g.akunGoogle) : g.pemilikFolder ? `${esc(g.pemilikFolder)} <span class="redup">${tx('db.drive.pemilikFolder')}</span>` : redup('db.drive.abisLangkah4');
  const baris = [
    [tx('db.drive.akunClaude'), g.akunClaude ? esc(g.akunClaude) : redup('db.drive.belumLogin')],
    [tx('db.drive.konektor'), `${konektor}${g.cek?.waktu && !g.lagiCek ? ` <span class="redup">${tx('db.drive.dicek', { kapan: esc(relatifIso(g.cek.waktu)) })}</span>` : ''}${tombolCek}`],
    [tx('db.drive.akunGoogle'), akunGoogle],
    [tx('db.drive.folderKantor'), g.folder ? tautan(linkFolder(g.folder), g.folderNama || tx('db.drive.bukaFolder')) : redup('db.drive.belumDipilih')],
    [tx('db.drive.folderHasil'), g.hasil ? tautan(linkFolder(g.hasil), g.hasilNama || tx('db.drive.hasil')) : redup('db.drive.hasilBelum')],
    [tx('db.drive.terakhir'), g.terakhir ? esc(relatifIso(g.terakhir)) : redup('db.drive.belumPernah')],
    [tx('db.drive.dikenal'), g.folder ? String(g.jumlahFile) : '<span class="redup">-</span>'],
  ];
  return `<section class="panel status-drive s-${st.kelas}" aria-labelledby="j-status-drive"><div class="status-kepala"><span class="lampu-status" aria-hidden="true"></span><div><h2 id="j-status-drive">${esc(st.judul)}</h2><p>${esc(st.teks)}</p></div></div>
<dl class="info-drive">${baris.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl>
${g.cek?.teks && c !== 'nyambung' ? `<p class="redup kecil pad">${tx('db.drive.detail', { teks: esc(g.cek.teks) })}</p>` : ''}</section>`;
}

// Label kolom kanan daftar "Yang boleh & gak boleh": boleh | ditolak | selain itu (nanya kamu / kamu).
const labelAturan = (b, kunciTanya) => `<span class="a-${b === 'boleh' ? 'boleh' : b === 'ditolak' ? 'tolak' : 'tanya'}">${b === 'boleh' ? tx('db.aturan.boleh') : b === 'ditolak' ? tx('db.aturan.ditolak') : tx(kunciTanya)}</span>`;

function halDrive(d) {
  const g = d.drive;
  const c = g.cek?.status;
  const langkah = [
    { ok: c === 'nyambung', judul: tx('db.drive.l1.judul'),
      isi: `<p>${tx('db.drive.l1.isi', { akun: g.akunClaude ? `: <b>${esc(g.akunClaude)}</b>` : '' })}</p><a class="tombol" href="${LINK_KONEKTOR}" target="_blank" rel="noopener">${tx('db.drive.l1.tombol')}</a>` },
    { ok: Boolean(g.folder), judul: tx('db.drive.l2.judul'), isi: tx('db.drive.l2.isi') },
    { ok: Boolean(g.folder), judul: tx('db.drive.l3.judul'),
      isi: `<p>${tx('db.drive.l3.isi')}</p>${salin(tx('db.perintah.sambungDrive'))}` },
    { ok: Boolean(g.terakhir), judul: tx('db.drive.l4.judul'),
      isi: `<p>${tx('db.drive.l4.isi')}</p>${salin(tx('db.perintah.cekDrive'))}` },
  ];
  const panduan = `<section class="panel panduan-drive" aria-labelledby="j-panduan"><header><h2 id="j-panduan">${tx('db.drive.caraJudul')}</h2></header><ol class="langkah">${langkah.map((x, i) => `<li class="${x.ok ? 'selesai' : ''}"><span class="nomor" aria-hidden="true">${x.ok ? '✓' : i + 1}</span><div><h3>${x.judul}${x.ok ? `<span class="sr">${tx('db.drive.udah')}</span>` : ''}</h3>${x.isi}</div></li>`).join('')}</ol></section>`;
  const aturan = [['cari', 'boleh'], ['simpan', 'boleh'], ['pindah', 'tanya'], ['luar', 'ditolak'], ['hapus', 'ditolak'], ['share', 'ditolak']].map(([k, b]) => [tx(`db.drive.aturan.${k}`), b]);
  return `<nav class="jejak"><a href="/lainnya">${tx('db.nav.lainnya')}</a> / Google Drive</nav><div class="kepala-hal"><h1>Google Drive</h1><span class="redup">${tx('db.drive.sub')}</span></div>
${halDriveKirim(d)}
<section aria-labelledby="j-drive-baca"><h2 id="j-drive-baca">${tx('db.drive.bacaJudul')}</h2><p>${tx('db.drive.bacaTeks')}</p>
<div class="drive-grid"><div data-segar="drive-status">${isiStatusDrive(g)}</div>${panduan}</div>
<div class="drive-bawah"><section class="panel tenang" aria-labelledby="j-aturan"><header><h2 id="j-aturan">${tx('db.aturan.judul')}</h2></header><ul class="aturan-drive">${aturan.map(([a, b]) => `<li><span>${a}</span>${labelAturan(b, 'db.aturan.nanya')}</li>`).join('')}</ul><p class="redup kecil pad">${tx('db.drive.satpam')}</p></section>
<section class="panel tenang" aria-labelledby="j-ganti"><header><h2 id="j-ganti">${tx('db.drive.gantiJudul')}</h2></header><ul class="daftar-perintah"><li>${salin(tx('db.perintah.gantiDrive'))}<span class="redup">${tx('db.drive.gantiKet')}</span></li><li>${salin(tx('db.perintah.putusDrive'))}<span class="redup">${tx('db.drive.putusKet')}</span></li></ul></section></div></section>`;
}

function panelDrive(d) {
  const st = statusDrive(d.drive);
  return `<section class="panel tenang" id="drive" aria-labelledby="j-drive"><header><h2 id="j-drive">Google Drive</h2></header>
<a class="ringkas-drive s-${st.kelas}" href="/drive"><span class="lampu-status" aria-hidden="true"></span><span><b>${esc(st.judul)}</b>${d.drive.folder && d.drive.folderNama ? `<span class="redup">${tx('db.drive.folderNama', { nama: esc(d.drive.folderNama) })}</span>` : ''}</span>${ikon('panah')}</a></section>`;
}

// ---------- Website (divisi Web & aplikasi) ----------
// Isi web/ diurus alat/web.mjs: pratinjau (dikerjain tim), versi (5 terakhir), live → versi yang tayang. Terbitkan &
// balik cuma dari tombol di sini (owner), lewat alat yang sama.
const W = path.join(K, 'web');
function bacaWeb() {
  const host = String(bacaJsonAman(path.join(W, 'host.json'))?.host || bacaAman(path.join(os.homedir(), '.kantor-alamat'))).trim();
  let token = ''; try { token = fs.readFileSync(path.join(W, 'pratinjau-token'), 'utf8').trim(); } catch { /* belum */ }
  const versi = fs.existsSync(path.join(W, 'versi')) ? fs.readdirSync(path.join(W, 'versi')).filter((x) => /^\d{8}-\d{6}$/.test(x)).sort() : [];
  let tayang = ''; try { tayang = path.basename(fs.readlinkSync(path.join(W, 'live'))); } catch { /* belum */ }
  const foto = fs.existsSync(path.join(W, 'foto')) ? fs.readdirSync(path.join(W, 'foto')).filter((f) => /^[a-z0-9-]+-(hp|laptop)\.png$/.test(f)).sort() : [];
  let fotoWaktu = 0; try { fotoWaktu = fs.statSync(path.join(W, 'foto', 'laporan.md')).mtimeMs; } catch { /* belum */ }
  const adaDivisi = fs.existsSync(path.join(W, 'pratinjau')) || versi.length > 0;
  return { adaDivisi, host, alamat: host ? `https://web.${host}` : '', pratinjau: host && token ? `https://pratinjau.${host}/${token}/` : '', versi, tayang,
    domain: bacaJsonAman(path.join(W, 'domain.json'))?.domain || [], cek: bacaJsonAman(path.join(W, 'cek.json')), foto, fotoWaktu,
    adaPratinjau: fs.existsSync(path.join(W, 'pratinjau', 'index.html')) };
}
const fmtVersi = (v) => (v ? `${v.slice(6, 8)}/${v.slice(4, 6)} ${v.slice(9, 11)}:${v.slice(11, 13)}` : '');

function halWeb(d, pesan) {
  const g = bacaWeb();
  if (!g.adaDivisi) {
    return `<nav class="jejak"><a href="/lainnya">${tx('db.nav.lainnya')}</a> / ${tx('db.web.judul')}</nav><div class="kepala-hal"><h1>${tx('db.web.judul')}</h1></div><section class="panel">${kosong(tx('db.web.belumDivisi'), tx('db.web.belumDivisiTeks'), salin(tx('db.perintah.divisiWeb')))}</section>`;
  }
  const st = g.cek ? (g.cek.ok ? 'ok' : 'masalah') : g.tayang ? 'hampir' : 'belum';
  const judul = !g.tayang ? tx('db.web.belumTayang') : g.cek?.ok ? tx('db.web.sehat') : g.cek ? tx('db.web.masalah') : tx('db.web.tayang');
  const foto = ['index', ...new Set(g.foto.map((f) => f.replace(/-(hp|laptop)\.png$/, '')).filter((x) => x !== 'index'))].filter((h) => g.foto.includes(`${h}-hp.png`));
  const v = g.fotoWaktu ? `?v=${Math.round(g.fotoWaktu)}` : '';
  return `<nav class="jejak"><a href="/lainnya">${tx('db.nav.lainnya')}</a> / ${tx('db.web.judul')}</nav><div class="kepala-hal"><h1>${tx('db.web.judul')}</h1><span class="redup">${tx('db.web.sub')}</span></div>
${pesan ? `<p class="pesan-aksi ${pesan.ok ? 'ok' : 'gagal'}" role="status">${esc(pesan.teks)}</p>` : ''}
<div class="drive-grid"><section class="panel status-drive s-${st}" aria-labelledby="j-web-status"><div class="status-kepala"><span class="lampu-status" aria-hidden="true"></span><div><h2 id="j-web-status">${judul}</h2><p>${g.tayang ? tx('db.web.versiTayang', { v: esc(fmtVersi(g.tayang)) }) : tx('db.web.liatDulu')}</p></div></div>
<dl class="info-drive">
<div><dt>${tx('db.web.alamat')}</dt><dd>${g.alamat ? tautan(g.alamat, g.alamat.replace('https://', '')) : `<span class="redup">${tx('db.web.belumAda')}</span>`}${g.domain.map((x) => ` · ${tautan(`https://${x}`, x)}`).join('')}</dd></div>
<div><dt>${tx('db.web.pratinjau')}</dt><dd>${g.adaPratinjau && g.pratinjau ? tautan(g.pratinjau, tx('db.web.bukaPratinjau')) : `<span class="redup">${tx('db.web.belumAda')}</span>`}</dd></div>
<div><dt>${tx('db.web.cekTerakhir')}</dt><dd>${g.cek ? `${g.cek.ok ? `<span class="ok">${tx('db.web.cekSehat')}</span>` : `<span class="masalah">${tx('db.web.cekMasalah')}</span>`} <span class="redup">${esc(tl(g.cek.ringkas || ''))} · ${esc(relatifIso(g.cek.waktu))}</span>` : `<span class="redup">${tx('db.drive.belumCek')}</span>`}</dd></div>
<div><dt>${tx('db.web.versiDisimpen')}</dt><dd>${g.versi.length ? esc(g.versi.map(fmtVersi).reverse().join(', ')) : '<span class="redup">-</span>'}</dd></div>
</dl>
<div class="aksi-web">${g.adaPratinjau ? `<form method="post" action="/web/terbitkan" data-yakin="${tx('db.web.yakinTerbit')}"><button class="tombol utama" type="submit">${tx('db.web.terbitkan')}</button></form>` : ''}${g.versi.length > 1 && g.tayang !== g.versi[0] ? `<form method="post" action="/web/balik" data-yakin="${tx('db.web.yakinBalik')}"><button class="tombol" type="submit">${tx('db.web.balik')}</button></form>` : ''}</div></section>
<section class="panel" aria-labelledby="j-web-foto"><header><h2 id="j-web-foto">${tx('db.web.foto')}</h2>${g.fotoWaktu ? `<span class="redup kecil">${esc(relatifIso(new Date(g.fotoWaktu).toISOString()))}</span>` : ''}</header>
${foto.length ? `<div class="foto-web">${foto.slice(0, 3).map((h) => `<figure><a href="/web/foto/${h}-hp.png" target="_blank" rel="noopener"><img src="/web/foto/${h}-hp.png${v}" alt="${tx('db.web.fotoAlt', { h: esc(h) })}" loading="lazy"></a><figcaption>${esc(h === 'index' ? tx('db.web.beranda') : h)} · ${tx('db.web.hp')} · <a href="/web/foto/${h}-laptop.png" target="_blank" rel="noopener">${tx('db.web.laptop')}</a></figcaption></figure>`).join('')}</div>`
    : kosong(tx('db.web.fotoKosong'), tx('db.web.fotoKosongTeks'))}</section></div>
<div class="drive-bawah"><section class="panel tenang" aria-labelledby="j-web-aturan"><header><h2 id="j-web-aturan">${tx('db.aturan.judul')}</h2></header><ul class="aturan-drive">${[['bikin', 'boleh'], ['motret', 'boleh'], ['terbit', 'kamu'], ['paket', 'kamu'], ['ubahKantor', 'ditolak']].map(([k, b]) => `<li><span>${tx(`db.web.aturan.${k}`)}</span>${labelAturan(b, 'db.aturan.kamu')}</li>`).join('')}</ul></section>
<section class="panel tenang" aria-labelledby="j-web-domain"><header><h2 id="j-web-domain">${tx('db.web.domainJudul')}</h2></header><ol class="langkah"><li><span class="nomor" aria-hidden="true">1</span><div><p>${tx('db.web.domain1')}</p></div></li><li><span class="nomor" aria-hidden="true">2</span><div><p>${tx('db.web.domain2')}</p>${salin(tx('db.perintah.domain'))}</div></li></ol></section></div>`;
}

function panelWeb() {
  const g = bacaWeb();
  const judul = !g.adaDivisi ? tx('db.web.belumAdaDivisi') : !g.tayang ? tx('db.web.belumTayang') : g.cek && !g.cek.ok ? tx('db.web.masalah') : tx('db.web.tayang');
  const kelas = !g.adaDivisi ? 'belum' : !g.tayang ? 'hampir' : g.cek && !g.cek.ok ? 'masalah' : 'ok';
  return `<section class="panel tenang" id="web" aria-labelledby="j-web"><header><h2 id="j-web">${tx('db.web.judul')}</h2></header>
<a class="ringkas-drive s-${kelas}" href="/web"><span class="lampu-status" aria-hidden="true"></span><span><b>${esc(judul)}</b>${g.alamat && g.tayang ? `<span class="redup">${esc(g.alamat.replace('https://', ''))}</span>` : ''}</span>${ikon('panah')}</a></section>`;
}

// Pemilih bahasa (KD-121): nulis setelan/kantor.json + aturan bahasa di CLAUDE.md kantor (simpanBahasa).
function bagianBahasa(d) {
  const kini = bahasaAktif();
  return `<section class="panel" id="bahasa" aria-labelledby="j-bahasa"><header><h2 id="j-bahasa">${tx('db.bahasa.judul')}</h2></header><form method="post" action="/bahasa" class="pilih-bahasa">
<input type="hidden" name="token" value="${esc(d.token)}"><fieldset><legend class="sr">${tx('db.bahasa.judul')}</legend><div class="pilih-bahasa-daftar">${KODE_BAHASA.map((k) => `<label><input type="radio" name="bahasa" value="${k}"${kini === k ? ' checked' : ''}><span lang="${k}">${tx(`umum.bahasa.${k}`)}</span></label>`).join('')}</div></fieldset>
<p class="redup kecil">${tx('db.bahasa.ket')}</p>
<div class="kirim"><button class="tombol utama">${tx('db.bahasa.pakai')}</button></div></form></section>`;
}

// Riwayat versi (kit/RIWAYAT-VERSI.md, terbaru di atas). Baris lanjutan satu poin digabung dulu biar md() gak mecahnya.
function bacaRiwayat() {
  const gabung = (s) => s.split('\n').reduce((a, b) => {
    if (a.length && b.trim() && !/^\s*[-*] /.test(b) && a[a.length - 1].trim()) a[a.length - 1] += ` ${b.trim()}`; else a.push(b);
    return a;
  }, []).join('\n');
  const [awal, ...bagian] = bacaAman(path.join(KIT, 'RIWAYAT-VERSI.md')).replace(/\r/g, '').split(/^## /m);
  return { awal: gabung(awal.replace(/^# .*\n?/, '')).trim(), versi: bagian.map((b) => { const [judul, ...isi] = b.split('\n'); return { judul: judul.trim(), isi: gabung(isi.join('\n')) }; }) };
}

function halRiwayat() {
  const r = bacaRiwayat();
  const kini = bacaAman(path.join(KIT, 'VERSI')).trim();
  return `<div class="kepala-hal"><h1>${tx('db.riwayat.judul')}</h1><span class="redup">${kini ? tx('db.lainnya.versi', { v: esc(kini) }) : ''}</span></div>
${bahasaAktif() === 'id' ? '' : `<p class="redup kecil">${tx('db.riwayat.bahasa')}</p>`}${r.awal ? `<div class="riwayat-awal redup">${md(r.awal)}</div>` : ''}
<div class="riwayat">${r.versi.length ? r.versi.map((v) => `<section class="panel tenang"><header><h2>${esc(v.judul)}</h2>${kini && v.judul.split(' ')[0] === kini ? `<span class="lencana s-jalan">${tx('db.riwayat.dipakai')}</span>` : ''}</header><div class="pad">${md(v.isi)}</div></section>`).join('')
    : `<section class="panel">${kosong(tx('db.riwayat.kosong'), '')}</section>`}</div><p><a class="tombol hantu" href="/lainnya">${tx('db.riwayat.balik')}</a></p>`;
}

function halLainnya(d, pesan) {
  const perintah = [
    [tx('db.perintah.nunggu'), tx('db.lainnya.p.nunggu')],
    [tx('db.perintah.baru'), tx('db.lainnya.p.baru')],
    [tx('db.perintah.jadiNama'), tx('db.lainnya.p.jadi')],
    ['lanjut T-01', tx('db.lainnya.p.lanjut')],
    ['jadi builder', tx('db.lainnya.p.builder')],
    [tx('db.perintah.diagnosa'), tx('db.lainnya.p.diagnosa')],
  ];
  const versi = bacaAman(path.join(KIT, 'VERSI')).trim();
  const [versiBaru, ...catatanBaru] = bacaAman(path.join(K, 'catatan/.kit-versi-baru')).split('\n');
  const isiBaru = catatanBaru.join(' ').trim();
  const lagiUpdate = keadaanUpdate().tahap === 'jalan';
  const penting = versiBaru && bacaAman(path.join(K, 'catatan/.kit-versi-penting')).trim() === versiBaru.trim();
  const v = esc((versiBaru || '').trim());
  const spanduk = lagiUpdate ? `<p class="pesan-aksi ok">${tx('db.lainnya.updateJalan')}</p>`
    : versiBaru ? `<div class="pesan-aksi ${penting ? 'gagal' : 'ok'} update-ada"><p>${penting ? tx('db.lainnya.updatePenting', { v }) : tx('db.lainnya.updateAda', { v })}</p>${isiBaru ? `<p class="redup kecil">${esc(isiBaru)}</p>` : ''}<form method="post" action="/update" data-update data-yakin="${tx('db.lainnya.updateYakin', { v })}"><input type="hidden" name="token" value="${esc(d.token)}"><button class="tombol utama" type="submit">${tx('db.lainnya.updateSekarang')}</button></form><p class="redup kecil">${tx('db.lainnya.updateKetik')} ${salin(tx('db.perintah.updateKit'))}</p></div>` : '';
  return `<div class="kepala-hal"><h1>${tx('db.nav.lainnya')}</h1></div>${pesan ? `<p class="pesan-aksi ${pesan.ok ? 'ok' : 'gagal'}" role="status">${esc(pesan.teks)}</p>` : ''}<div class="lainnya">
<div class="kolom">${bagianTampilan(d)}${bagianBahasa(d)}</div>
<div class="kolom"><section class="panel tenang" aria-labelledby="j-perintah"><header><h2 id="j-perintah">${tx('db.lainnya.perintah')}</h2></header><p class="redup kecil pad">${tx('db.lainnya.perintahKet')}</p><ul class="daftar-perintah">${perintah.map(([p, k]) => `<li>${salin(p)}<span class="redup">${esc(k)}</span></li>`).join('')}</ul></section>
<div data-segar="otomatis">${panelOtomatis(d)}</div>
${panelDrive(d)}
${panelWeb()}
${panelSosmed()}
${panelFal()}
<section class="panel tenang" id="akun" aria-labelledby="j-akun"><header><h2 id="j-akun">${tx('db.lainnya.akun')}</h2></header><div class="pad akun"><a class="tombol" href="/keluar">${tx('db.lainnya.keluar')}</a><p class="redup kecil">${tx('db.lainnya.lupa')}</p>${versi ? `<p class="redup kecil">${tx('db.lainnya.versi', { v: esc(versi) })} · <a href="/riwayat">${tx('db.riwayat.judul')}</a></p>` : ''}${spanduk}</div></section></div></div>`;
}

// Pesan dari alat/drive-inti.mjs yang tetap (bahasa Indonesia di alatnya): diganti teks kamus pas tampil. Pesan lain
// (mis. galat dari Google) ditampilin apa adanya.
const PESAN_DRIVE = {
  'Fitur kirim ke Drive belum aktif di kit ini. Kamu bisa minta aku cek versi kit.': 'db.kirim.belumAktif',
  'Kirim file ke Drive perlu disambung ulang. Kamu bisa buka dashboard → Google Drive (/drive) → Sambungkan Google Drive.': 'db.kirim.sambungUlang',
  'Aku belum bisa memperbarui sambungan Google Drive. Coba lagi nanti.': 'db.kirim.gagalPerbarui',
  'Aku belum bisa cek sambungan Drive.': 'db.kirim.gakBisaCek',
};
const pesanDrive = (teks) => (PESAN_DRIVE[teks] ? tx(PESAN_DRIVE[teks]) : tl(teks));

function halDriveKirim(d) {
  const st = GD?.status(K);
  const tok = `<input type="hidden" name="token" value="${esc(d.token)}">`;
  const kepala = `<header><h2 id="j-drive-kirim">${tx('db.kirim.judul')}</h2></header>`;
  if (!st?.aktif) return `<section class="panel" aria-labelledby="j-drive-kirim">${kepala}<p class="pad">${esc(pesanDrive(st?.pesan) || tx('db.kirim.belumAda'))}</p></section>`;
  const kode = driveKode && driveKode.akhir > Date.now() ? driveKode : null;
  const isi = st.tersambung ? `<p>${tx('db.kirim.tersambung', { email: esc(st.email) })}</p>${st.folder ? `<p><a href="${esc(st.folder)}" target="_blank" rel="noopener">Lembur – Hasil</a></p>` : `<p>${tx('db.kirim.nyiapin')}</p>`}<h3>${tx('db.kirim.terakhir')}</h3>${GD.riwayat(K).slice(-5).reverse().map((r) => `<p><a href="https://drive.google.com/file/d/${enc(r.id)}/view" target="_blank" rel="noopener">${esc(r.nama)}</a> · ${tx('db.kirim.byte', { n: esc(r.ukuran) })}</p>`).join('') || `<p>${tx('db.kirim.belumKiriman')}</p>`}<form method="post" action="/drive-kirim/putus">${tok}<button class="tombol" type="submit">${tx('db.kirim.putuskan')}</button></form>` : `<p>${st.perluUlang ? tx('db.kirim.perluUlang') : tx('db.kirim.belum')} ${tx('db.kirim.bisa')}</p>${kode ? `<div data-drive-kode data-akhir="${esc(kode.akhir)}"><p>${tx('db.kirim.bukaDevice')}</p><p class="drive-kode" data-kode>${esc(kode.user_code)}</p><button class="tombol" type="button" data-salin-drive>${tx('db.kirim.salinKode')}</button><p data-sisa role="status"></p></div>` : `<form method="post" action="/drive-kirim/sambung">${tok}<button class="tombol utama" type="submit">${tx('db.kirim.sambungkan')}</button></form>`}`;
  return `<section class="panel tenang" aria-labelledby="j-drive-kirim">${kepala}<div class="pad">${drivePesan ? `<p role="status">${esc(pesanDrive(drivePesan))}</p>` : ''}${isi}</div></section>`;
}

// ---------- gambar & video AI (fal) ----------
function panelFal() {
  return `<section class="panel tenang" aria-labelledby="j-fal"><header><h2 id="j-fal">${tx('db.fal.judul')}</h2></header><div class="pad"><a class="tombol" href="/fal">${tx('db.fal.tombolPanel')}</a></div></section>`;
}
function halFal(d, pesan, katalog) {
  const kepala = `<nav class="jejak"><a href="/lainnya">${tx('db.nav.lainnya')}</a> / fal</nav><div class="kepala-hal"><h1>${tx('db.fal.judul')}</h1><span class="redup">${tx('db.fal.sub')}</span></div>`;
  if (!FL) return `${kepala}<section class="panel"><p class="pad">${tx('db.fal.belumAda')}</p></section>`;
  const tok = `<input type="hidden" name="token" value="${esc(d.token)}">`;
  let st;
  try { st = FL.status(K); } catch (e) { return `${kepala}<p class="pesan-aksi gagal">${esc(tl(e.message))}</p>`; }
  const pensiun = (katalog?.models || []).filter((m) => !FL.modelBolehJalan(m.status));
  const peringatan = katalog?.gagal ? `<p class="pesan-aksi gagal" role="status">${esc(katalog.gagal)} ${tx('db.fal.modelBelumCek')}</p>` : pensiun.length ? `<div class="pesan-aksi gagal" role="status"><p>${tx('db.fal.pensiun')}</p><ul>${pensiun.map((m) => `<li>${esc(m.endpoint_id)} (${esc(m.status)})</li>`).join('')}</ul></div>` : '';
  const antre = FL.antrean(K);
  const akhir = new Map(); for (const r of FL.riwayat(K)) akhir.set(r.id, r);
  const riwayat = [...akhir.values()].reverse().slice(0, 20);
  const kartu = (p) => `<article class="pad fal-rencana"><h3>${esc(p.r?.model || p.id)}</h3><p>${esc(FL.pesanAman(K, p.r?.input?.prompt || tx('db.fal.belumLengkap')))}</p>${p.r ? `<p>${tx('db.fal.durasi', { n: esc(FL.durasiDetik(FL.modelKurasi().find((m) => m.endpoint_id === p.r.model), p.r.input)), usd: esc(p.r.estimasi) })}</p>` : ''}<p class="redup">${esc(p.status)}</p>${p.status === 'nunggu' ? `<div class="aksi-rencana"><form method="post" action="/fal/setuju" data-yakin="${tx('db.fal.yakin')}">${tok}<input type="hidden" name="id" value="${esc(p.id)}"><input type="hidden" name="sidik" value="${esc(p.sidik)}"><button class="tombol utama" type="submit">${tx('db.fal.setujui')}</button></form><form method="post" action="/fal/tolak">${tok}<input type="hidden" name="id" value="${esc(p.id)}"><input type="hidden" name="sidik" value="${esc(p.sidik)}"><button class="tombol hantu" type="submit">${tx('db.umum.tolak')}</button></form></div>` : ''}</article>`;
  return `${kepala}${peringatan}${pesan ? `<p class="pesan-aksi ${pesan.ok ? 'ok' : 'gagal'}" role="status">${esc(pesan.teks)}</p>` : ''}
<div class="sosmed-grid"><div class="kolom"><section class="panel tenang"><header><h2>${tx('db.fal.sambung')}</h2></header><div class="pad"><p>${st.kunciAda ? tx('db.fal.tersambung', { ekor: esc(FL.ekorKunci(K)) }) : tx('db.fal.belumTersambung')}</p><ol>${tx('db.fal.langkah')}</ol><form class="form-kunci" method="post" action="/fal/kunci">${tok}<label>API key<input name="key" type="password" autocomplete="off" required maxlength="500"></label><button class="tombol utama" type="submit">${tx('db.fal.simpanKunci')}</button></form>${st.kunciAda ? `<form method="post" action="/fal/cek">${tok}<button class="tombol" type="submit">${tx('db.fal.cekKunci')}</button></form>` : ''}</div></section>
<section class="panel tenang"><header><h2>${tx('db.fal.batasJudul')}</h2></header><div class="pad"><p>${tx('db.fal.terpakai', { pakai: esc(st.kepakeHariIni), batas: esc(st.batasHarianUsd) })}</p><p class="redup">${tx('db.fal.estimasi')}</p><form class="form-kunci" method="post" action="/fal/batas">${tok}<label>${tx('db.fal.batasLabel')}<input name="batas" type="number" min="0.01" max="500" step="0.01" value="${esc(st.batasHarianUsd)}" required></label><button class="tombol utama" type="submit">${tx('db.fal.simpanBatas')}</button></form></div></section></div>
<div class="kolom"><section class="panel tenang"><header><h2>${tx('db.fal.antrean')}</h2></header>${antre.length ? antre.map(kartu).join('') : `<p class="redup pad">${tx('db.fal.antreanKosong')}</p>`}<p class="redup kecil pad">${tx('db.fal.antreanKet')}</p></section>
<section class="panel tenang"><header><h2>${tx('db.fal.riwayat')}</h2></header>${riwayat.length ? riwayat.map((r) => `<article class="pad"><h3>${esc(r.model)}</h3><p>US$${esc(r.estimasi)} · ${esc(new Date(r.waktu).toLocaleString(lokal(), { timeZone: 'Asia/Jakarta', hourCycle: 'h23' }))} WIB · ${esc(r.status)}</p>${(r.berkas || []).map((f) => `<p>${f.endsWith(".mp3") ? `<audio controls preload="metadata" src="/fal/hasil?file=${enc(f)}">${tx('db.fal.audio')}</audio><br>` : ""}<a href="/fal/hasil?file=${enc(f)}" target="_blank" rel="noopener">${tx('db.fal.bukaHasil')}</a> · <a href="/fal/hasil?file=${enc(f)}&unduh=1">${tx('db.fal.unduhHasil')}</a></p>`).join('')}</article>`).join('') : `<p class="redup pad">${tx('db.fal.riwayatKosong')}</p>`}</section></div></div>`;
}
const alatFal = (id) => new Promise((ok) => execFile(process.execPath, [path.join(K, 'alat/fal.mjs'), 'jalan', id], { cwd: K, timeout: 660000, env: { ...process.env, KANTOR: K } },
  (err, out, galat) => ok({ ok: !err, pesan: err ? FL.pesanAman(K, galat ? terjemahBarisAlat(galat) : tx('db.fal.terputus')) : tx('db.fal.selesai') })));

// ---------- sosmed (Repliz) ----------
// Tim sosmed nulis rencana di sosmed/terbit/<id>.json. Owner nyetujuin di sini → alat/repliz.mjs jadwal (AI gak pernah
// posting sendiri). Status tayang & angka performa diambil timer di bawah, tanpa AI.
const akunRepliz = () => bacaJsonAman(path.join(K, 'sosmed/.akun.json'))?.akun || null;
function bacaSosmed() {
  if (!RZ) return { ada: false, rencana: [] };
  const akun = akunRepliz();
  return { ada: true, kunci: RZ.adaKunci(K), akun: akun || [], rencana: RZ.semuaRencana(K, akun), performa: bacaJsonAman(path.join(K, 'sosmed/performa/terbaru.json')) };
}
const namaAkun = (a) => `${RZ?.PLATFORM[a.platform]?.nama || a.platform} @${a.username}`;
const angkaId = (n) => (typeof n === 'number' ? new Intl.NumberFormat(lokal()).format(n) : '-');
// Label status rencana: kamus dashboard dulu (db.rz.status.*), cadangannya label dari alat Repliz.
const statusRz = (s) => { const k = `db.rz.status.${s}`; const x = tx(k); return x !== k ? x : RZ?.STATUS[s] || s; };
// Sama kayak RZ.tampilWib (WIB), tapi ngikut bahasa dashboard.
const tampilWib = (dt) => new Intl.DateTimeFormat(lokal(), { timeZone: 'Asia/Jakarta', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(dt);
const labelJadwal = (s) => { const k = `db.rz.jadwal.${s}`; const x = tx(k); return x !== k ? x : s; };
// Pesan dari alat/* (Repliz, fal, Drive, web) ditulis Indonesia; di sini diterjemahin ke bahasa dashboard (id = persis sama).
// `status` = label status Repliz Indonesia (kadang huruf kecil) → label bahasa aktif; `st` = kode status jadwal.
const tl = (teks) => terjemahAlat(teks, {
  status: (x) => { const kode = Object.keys(RZ?.STATUS || {}).find((k) => RZ.STATUS[k] === x || RZ.STATUS[k].toLowerCase() === x); const l = kode ? statusRz(kode) : x; return kode && x === RZ.STATUS[kode].toLowerCase() ? l.toLowerCase() : l; },
  st: labelJadwal,
});
const terjemahBarisAlat = (teks) => terjemahBaris(teks, { status: (x) => x, st: labelJadwal });
// Satu baris keluaran alat/*.mjs tanpa emoji depan, diterjemahin.
const barisAlat = (x, awal = /^[✅⚠️❌]+\s*/) => tl(String(x ?? '').replace(awal, ''));
function panelSosmed() {
  const g = bacaSosmed();
  const nunggu = g.rencana.filter((p) => p.status === 'nunggu').length;
  const judul = !g.ada ? tx('db.sosmed.butuhUpdate') : !g.kunci ? tx('db.sosmed.belumSambung') : nunggu ? txn('db.sosmed.nunggu', nunggu) : tx('db.drive.nyambung');
  const kelas = !g.ada || !g.kunci ? 'belum' : nunggu ? 'hampir' : 'ok';
  return `<section class="panel tenang" id="sosmed" aria-labelledby="j-sosmed"><header><h2 id="j-sosmed">${tx('db.sosmed.judul')}</h2></header>
<a class="ringkas-drive s-${kelas}" href="/sosmed"><span class="lampu-status" aria-hidden="true"></span><span><b>${esc(judul)}</b><span class="redup">${tx('db.sosmed.lewat')}${g.kunci ? ` · ${txn('db.sosmed.jmlAkun', g.akun.filter((a) => a.nyambung).length)}` : ''}</span></span>${ikon('panah')}</a></section>`;
}
function aturanSosmed() {
  const aturan = [['ide', 'boleh'], ['rencana', 'boleh'], ['posting', 'kamu'], ['performa', 'boleh'], ['kunci', 'ditolak']];
  return `<section class="panel tenang" aria-labelledby="j-rz-aturan"><header><h2 id="j-rz-aturan">${tx('db.aturan.judul')}</h2></header><ul class="aturan-drive">${aturan.map(([k, b]) => `<li><span>${tx(`db.sosmed.aturan.${k}`)}</span>${labelAturan(b, 'db.aturan.nanya')}</li>`).join('')}</ul><p class="redup kecil pad">${tx('db.sosmed.aturanKet')}</p></section>`;
}
function kartuRencana(p, aksi = '') {
  const tujuan = p.tujuan.length ? p.tujuan.map(namaAkun) : [].concat(p.r?.akun || []).map(String);
  const lewat = p.waktu && p.waktu.getTime() < Date.now() + 5 * 60000;
  const media = p.media.map((m, i) => (m.video ? `<span class="media-video">${tx('db.rencana.video', { nama: esc(path.basename(m.file)), mb: (m.ukuran / 1e6).toFixed(1) })}</span>`
    : `<a href="/sosmed/media/${enc(p.id)}/${i + 1}" target="_blank" rel="noopener"><img src="/sosmed/media/${enc(p.id)}/${i + 1}?v=${m.sha.slice(0, 8)}" alt="${tx('db.rencana.gambarAlt', { i: i + 1, n: p.media.length })}" loading="lazy"></a>`)).join('');
  const waktu = p.st.waktuTayang ? new Date(p.st.waktuTayang) : p.waktu;
  return `<article class="rencana" id="r-${esc(p.id)}">
<header><b>${esc(p.r?.judul || p.id)}</b><span class="lencana rz-${p.status}">${esc(statusRz(p.status))}</span></header>
<p class="redup kecil">${waktu ? `${esc(tampilWib(waktu))} WIB${lewat && p.status === 'nunggu' ? tx('db.rencana.lewat') : ''} · ` : ''}${esc(tujuan.join(', ') || tx('db.rencana.akunKosong'))}${p.r?.labelAI ? tx('db.rencana.labelAI') : ''}</p>
${media ? `<div class="media-rencana">${media}</div>` : ''}${p.r?.caption ? `<p class="caption-rencana">${esc(p.r.caption)}</p>` : ''}
${p.r?.catatan ? `<p class="redup kecil">${tx('db.rencana.catatanTim', { teks: esc(p.r.catatan) })}</p>` : ''}${p.masalah.length && p.status === 'rusak' ? `<ul class="masalah-rencana">${p.masalah.map((m) => `<li>${esc(tl(m))}</li>`).join('')}</ul>` : ''}
${(p.st.jadwal || []).length ? `<ul class="jadwal-rencana">${p.st.jadwal.map((h) => `<li><span>${esc(namaAkun(h))}</span><span class="rz-${h.status}">${esc(labelJadwal(h.status))}</span>${h.pesan ? `<small>${esc(tl(h.pesan))}</small>` : ''}</li>`).join('')}</ul>` : ''}
${p.status === 'gagal' && p.st.pesan ? `<p class="pesan-aksi gagal">${esc(tl(p.st.pesan))}</p>` : ''}${['gagal', 'sebagian'].includes(p.status) && (p.st.jadwal || []).some((h) => h.status === 'gagal') ? `<p class="redup kecil">${tx('db.rencana.cekRepliz')}</p>` : ''}
${p.status === 'ditolak' && p.st.alasan ? `<p class="redup kecil">${tx('db.rencana.alasan', { teks: esc(p.st.alasan) })}</p>` : ''}${aksi}</article>`;
}
const daftarAkunRz = (g) => g.akun.map((a) => `<li><b>${esc(namaAkun(a))}</b><span class="${a.nyambung ? 'redup' : 'masalah'}">${a.nyambung ? tx('db.sosmed.akunNyambung') : tx('db.sosmed.akunPutus')}</span></li>`).join('') || `<li class="redup">${tx('db.sosmed.akunKosong')}</li>`;
function halSosmed(d, pesan) {
  const g = bacaSosmed();
  const kepala = `<nav class="jejak"><a href="/lainnya">${tx('db.nav.lainnya')}</a> / ${tx('db.sosmed.jejak')}</nav><div class="kepala-hal"><h1>${tx('db.sosmed.judul')}</h1><span class="redup">${tx('db.sosmed.sub')}</span></div>
${pesan ? `<p class="pesan-aksi ${pesan.ok ? 'ok' : 'gagal'}" role="status">${esc(pesan.teks)}</p>` : ''}`;
  if (!g.ada) return `${kepala}<section class="panel">${kosong(tx('db.sosmed.gakAdaAlat'), tx('db.sosmed.gakAdaAlatTeks'), salin(tx('db.perintah.updateKit')))}</section>`;
  const tok = `<input type="hidden" name="token" value="${esc(d.token)}">`;
  const idIn = (id) => `${tok}<input type="hidden" name="id" value="${esc(id)}">`;
  if (!g.kunci) {
    return `${kepala}<div class="drive-grid"><section class="panel" aria-labelledby="j-rz-sambung"><header><h2 id="j-rz-sambung">${tx('db.sosmed.sambungJudul')}</h2></header>
<ol class="langkah"><li><span class="nomor" aria-hidden="true">1</span><div><p>${tx('db.sosmed.l1')}</p><p class="redup kecil">${tx('db.sosmed.l1Paket')}</p></div></li>
<li><span class="nomor" aria-hidden="true">2</span><div><p>${tx('db.sosmed.l2')}</p></div></li>
<li><span class="nomor" aria-hidden="true">3</span><div><p>${tx('db.sosmed.l3')}</p>
<form class="form-kunci" method="post" action="/sosmed/kunci">${tok}<label>Access Key<input name="access" type="password" autocomplete="off" required maxlength="200"></label><label>Secret Key<input name="secret" type="password" autocomplete="off" required maxlength="200"></label><button class="tombol utama" type="submit">${tx('db.sosmed.tesSimpan')}</button></form></div></li></ol></section>
${aturanSosmed()}</div>`;
  }
  const nunggu = g.rencana.filter((p) => p.status === 'nunggu');
  const rusak = g.rencana.filter((p) => p.status === 'rusak');
  const jalan = g.rencana.filter((p) => ['mengunggah', 'terjadwal', 'sebagian', 'gagal', 'tayang'].includes(p.status)).reverse().slice(0, 15);
  const ditolak = g.rencana.filter((p) => ['ditolak', 'batal'].includes(p.status)).reverse().slice(0, 5);
  const aksiNunggu = (p) => `<div class="aksi-rencana"><form method="post" action="/sosmed/setuju" data-yakin="${tx('db.sosmed.yakinJadwal', { akun: esc(p.tujuan.map(namaAkun).join(', ')) })}">${idIn(p.id)}<button class="tombol utama" type="submit">${tx('db.sosmed.setujuiJadwal')}</button></form>
<details class="tolak-rencana"><summary class="tombol hantu">${tx('db.umum.tolak')}</summary><form method="post" action="/sosmed/tolak">${idIn(p.id)}<label>${tx('db.sosmed.alasanLabel')}<textarea name="alasan" rows="2" maxlength="300"></textarea></label><button class="tombol" type="submit">${tx('db.sosmed.tolakIni')}</button></form></details></div>`;
  const aksiJalan = (p) => ((p.st.jadwal || []).some((h) => h.status === 'terjadwal') ? `<form class="aksi-rencana" method="post" action="/sosmed/batal" data-yakin="${tx('db.sosmed.yakinBatal')}">${idIn(p.id)}<button class="tombol hantu" type="submit">${tx('db.konten.batalJadwal')}</button></form>` : '');
  const pf = g.performa;
  const panelPerforma = `<section class="panel" aria-labelledby="j-rz-performa"><header><h2 id="j-rz-performa">${tx('db.sosmed.performa')}</h2>${pf ? `<span class="redup kecil">${tx('db.sosmed.diambil', { kapan: esc(relatifIso(pf.waktu)) })}</span>` : ''}</header>
${pf ? `<ul class="akun-performa">${pf.akun.map((a) => { const x = a.statistik || {}; const v = x.followersCount ?? x.followers; return `<li><b>${esc(namaAkun(a))}</b><span class="redup">${[v != null ? tx('db.sosmed.pengikut', { n: angkaId(v) }) : '', x.views != null ? tx('db.sosmed.views', { n: angkaId(x.views) }) : x.videoViews7Hari != null ? tx('db.sosmed.views7', { n: angkaId(x.videoViews7Hari) }) : '', x.reach != null ? tx('db.sosmed.reach', { n: angkaId(x.reach) }) : ''].filter(Boolean).join(' · ') || tx('db.sosmed.statBelum')}</span></li>`; }).join('')}</ul>
${pf.konten.length ? `<ol class="daftar-performa">${pf.konten.slice(0, 6).map((c) => { const a = c.angka || {}; return `<li><span class="redup kecil">${esc(namaAkun(c))}${c.tayang ? ` · ${esc(c.tayang.slice(0, 10))}` : ''}${c.dariKantor ? tx('db.sosmed.dariTim') : ''}</span><b>${c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.teks || tx('db.sosmed.bukaPost'))}</a>` : esc(c.teks || c.id)}</b><span>${tx('db.sosmed.angkaPost', { views: angkaId(a.views ?? a.impression ?? a.reach), like: angkaId(a.like), komen: angkaId(a.comment ?? a.replies), share: angkaId(a.share ?? a.repost) })}</span></li>`; }).join('')}</ol>` : ''}
${pf.catatan.length ? `<p class="redup kecil pad">${esc(pf.catatan[0])}</p>` : ''}` : kosong(tx('db.sosmed.angkaKosong'), tx('db.sosmed.angkaKosongTeks'))}
<form class="pad" method="post" action="/sosmed/performa">${tok}<button class="tombol" type="submit">${tx('db.sosmed.ambilAngka')}</button></form></section>`;
  return `${kepala}<div class="sosmed-grid"><div class="kolom">
<section class="panel" aria-labelledby="j-rz-nunggu"><header><h2 id="j-rz-nunggu">${tx('db.konten.nungguJudul')}</h2><span class="jml">${nunggu.length}</span></header>
${nunggu.length ? `<div class="daftar-rencana">${nunggu.map((p) => kartuRencana(p, aksiNunggu(p))).join('')}</div>` : kosong(tx('db.konten.gakAdaNunggu'), tx('db.sosmed.mintaTim'), salin(tx('db.perintah.postingan')))}</section>
${rusak.length ? `<section class="panel tenang" aria-labelledby="j-rz-rusak"><header><h2 id="j-rz-rusak">${tx('db.sosmed.rusakJudul')}</h2></header><div class="daftar-rencana">${rusak.map((p) => kartuRencana(p)).join('')}</div><p class="redup kecil pad">${tx('db.sosmed.rusakKet')}</p></section>` : ''}
<section class="panel tenang" aria-labelledby="j-rz-jalan"><header><h2 id="j-rz-jalan">${tx('db.sosmed.jalanJudul')}</h2></header>${jalan.length ? `<div class="daftar-rencana">${jalan.map((p) => kartuRencana(p, aksiJalan(p))).join('')}</div>` : kosong(tx('db.konten.belumAda'), tx('db.sosmed.jalanKosong'))}</section>
${ditolak.length ? `<details class="panel tenang lipat-rencana"><summary>${tx('db.sosmed.ditolak', { n: ditolak.length })}</summary><div class="daftar-rencana">${ditolak.map((p) => kartuRencana(p)).join('')}</div></details>` : ''}
</div><div class="kolom">${panelPerforma}
<section class="panel tenang" aria-labelledby="j-rz-akun"><header><h2 id="j-rz-akun">${tx('db.sosmed.akunJudul')}</h2></header><ul class="akun-performa">${daftarAkunRz(g)}</ul>
<div class="pad aksi-rencana"><form method="post" action="/sosmed/segarkan">${tok}<button class="tombol" type="submit">${tx('db.sosmed.segarkan')}</button></form><form method="post" action="/sosmed/putus" data-yakin="${tx('db.sosmed.yakinPutus')}">${tok}<button class="tombol hantu" type="submit">${tx('db.sosmed.putus')}</button></form></div></section>
${aturanSosmed()}</div></div>`;
}

// ---------- Konten (KD-111) ----------
// Satu tempat buat mantau konten tim sosmed: nunggu kamu setujuin → terjadwal (kalender 14 hari) → tayang/gagal.
// Datanya sama kayak /sosmed (sosmed/terbit/*.json + .status.json, alat/repliz-inti.mjs); bedanya di sini owner milih jam,
// minta revisi, atau batalin, dan keputusannya diteruin ke task asal (field "task" di rencana) + manajernya dibangunin.
const tglWib = (dt) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(dt);
// jamWib dibandingin & dikirim sebagai nilai form ("2026-10-16 19:00"): sengaja tetap id-ID (titik → titik dua), bukan bahasa tampilan.
const jamWib = (dt) => new Intl.DateTimeFormat('id-ID', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(dt).replace('.', ':');
const hariWib = (dt) => new Intl.DateTimeFormat(lokal(), { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short' }).format(dt);
const adaKonten = (task, manajer) => !!RZ && (fs.existsSync(path.join(K, 'sosmed/masuk')) || fs.existsSync(path.join(K, 'sosmed/terbit')) || task.some((t) => t.divisi === 'sosmed') || manajer.some((m) => m.id === 'sari'));
const PROFIL = { instagram: (u) => `https://www.instagram.com/${u}/`, tiktok: (u) => `https://www.tiktok.com/@${u}`, youtube: (u) => `https://www.youtube.com/@${u}`, threads: (u) => `https://www.threads.net/@${u}`, twitter: (u) => `https://x.com/${u}` };
const waktuRencana = (p) => (p.st.waktuTayang ? new Date(p.st.waktuTayang) : p.waktu);
const masihJadwal = (p) => ['disetujui', 'mengunggah', 'terjadwal'].includes(p.status) || (p.status === 'sebagian' && (p.st.jadwal || []).some((h) => ['terjadwal', 'proses'].includes(h.status)));

function modelKonten(g) {
  const kini = Date.now();
  const nunggu = g.rencana.filter((p) => p.status === 'nunggu');
  const rusak = g.rencana.filter((p) => p.status === 'rusak');
  const revisi = g.rencana.filter((p) => p.status === 'ditolak').slice(-5).reverse();
  const jadwal = g.rencana.filter(masihJadwal).filter((p) => waktuRencana(p)).sort((a, b) => waktuRencana(a) - waktuRencana(b));
  const hari0 = tglWib(new Date(kini));
  const hari = Array.from({ length: 14 }, (_, i) => { const dt = new Date(Date.parse(`${hari0}T12:00:00+07:00`) + i * 86400000); return { tgl: tglWib(dt), dt, isi: [] }; });
  let jauh = 0;
  for (const p of jadwal) {
    const tgl = tglWib(waktuRencana(p));
    const h = hari.find((x) => x.tgl === (tgl < hari0 ? hari0 : tgl));
    if (h) h.isi.push(p); else jauh += 1;
  }
  const selesai = g.rencana.filter((p) => ['tayang', 'gagal'].includes(p.status) || (p.status === 'sebagian' && !masihJadwal(p)))
    .filter((p) => kini - Date.parse(p.st.diperbarui || 0) < 14 * 86400000).sort((a, b) => Date.parse(b.st.diperbarui || 0) - Date.parse(a.st.diperbarui || 0));
  const disetujui = g.rencana.filter((p) => p.st.disetujui && !['ditolak', 'batal'].includes(p.status)).sort((a, b) => Date.parse(b.st.disetujui) - Date.parse(a.st.disetujui)).slice(0, 5);
  const tayang7 = g.rencana.filter((p) => p.status === 'tayang' && kini - Date.parse(p.st.diperbarui || 0) < 7 * 86400000).length;
  return { nunggu, rusak, revisi, jadwal, hari, jauh, selesai, disetujui, tayang7, hari0 };
}

// Pilihan jam buat satu rencana (WIB): usulan tim (kalau belum lewat), hari ini 19.00, besok 12.00 & 19.00, atau pilih sendiri.
function pilihanJam(p) {
  const kini = Date.now();
  const hari0 = tglWib(new Date(kini));
  const besok = tglWib(new Date(kini + 86400000));
  const daftar = [];
  if (p.waktu && p.waktu.getTime() > kini + 10 * 60000) daftar.push([`${tglWib(p.waktu)} ${jamWib(p.waktu)}`, tx('db.konten.usulan', { kapan: tampilWib(p.waktu) })]);
  if (RZ.waktuWib(`${hari0} 19:00`).getTime() > kini + 15 * 60000) daftar.push([`${hari0} 19:00`, tx('db.konten.hariIni19')]);
  daftar.push([`${besok} 12:00`, tx('db.konten.besok12')], [`${besok} 19:00`, tx('db.konten.besok19')]);
  const lihat = new Set();
  return daftar.filter(([v]) => !lihat.has(v) && lihat.add(v)).map(([v, l]) => ({ v, l }));
}
const minJam = () => { const dt = new Date(Date.now() + 15 * 60000); return `${tglWib(dt)}T${jamWib(dt)}`; };

function previewKonten(p) {
  const v = p.media.findIndex((m) => m.video);
  if (v >= 0) return `<div class="preview-konten video"><video controls preload="metadata" playsinline src="/sosmed/video/${enc(p.id)}/${v + 1}"></video></div>`;
  if (!p.media.length) return '';
  return `<div class="preview-konten" role="group" aria-label="${txn('db.konten.previewAria', p.media.length)}">${p.media.map((m, i) => `<a href="/sosmed/media/${enc(p.id)}/${i + 1}" target="_blank" rel="noopener"><img src="/sosmed/media/${enc(p.id)}/${i + 1}?v=${m.sha.slice(0, 8)}" alt="${tx('db.rencana.gambarAlt', { i: i + 1, n: p.media.length })}" loading="lazy"><span>${i + 1}/${p.media.length}</span></a>`).join('')}</div>`;
}
const akunRencana = (p) => (p.tujuan.length ? p.tujuan.map(namaAkun) : [].concat(p.r?.akun || []).map(String));
const lencanaRz = (p) => `<span class="lencana rz-${p.status}">${esc(statusRz(p.status))}</span>`;
const taskAsal = (p, d) => { const t = p.task && d.task.find((x) => x.kode.toLowerCase() === p.task.toLowerCase()); return t ? `<a href="/task/${enc(t.f)}" data-task="${esc(t.f)}">${tx('db.konten.dari', { kode: esc(t.kode) })}</a>` : ''; };

function kartuNunggu(p, d, g) {
  const tok = `<input type="hidden" name="token" value="${esc(d.token)}"><input type="hidden" name="id" value="${esc(p.id)}">`;
  const nama = d.manajer.find((m) => m.id === (d.task.find((t) => t.kode.toLowerCase() === (p.task || '').toLowerCase())?.pegang || 'sari'))?.nama || tx('db.umum.tim');
  const jam = pilihanJam(p);
  const idJam = `jam-${esc(p.id)}`;
  const lewat = p.waktu && p.waktu.getTime() < Date.now() + 10 * 60000;
  const tujuan = akunRencana(p);
  return `<article class="rencana konten-nunggu" id="r-${esc(p.id)}">
<header><b>${esc(p.r?.judul || p.id)}</b>${lencanaRz(p)}</header>
<p class="redup kecil">${esc(tujuan.join(', ') || tx('db.rencana.akunKosong'))}${p.r?.labelAI ? tx('db.rencana.labelAI') : ''}${taskAsal(p, d) ? ` · ${taskAsal(p, d)}` : ''}</p>
${previewKonten(p)}${p.r?.caption ? `<p class="caption-rencana">${esc(p.r.caption)}</p>` : ''}
${p.r?.catatan ? `<p class="catatan-tim"><b>${tx('db.konten.catatan', { nama: esc(nama) })}</b> ${esc(p.r.catatan)}</p>` : ''}
${lewat ? `<p class="redup kecil">${tx('db.konten.jamLewat')}</p>` : ''}
<form class="setuju-konten" method="post" action="/konten/setuju"${g.kunci ? ` data-yakin="${tx('db.sosmed.yakinJadwal', { akun: esc(tujuan.join(', ')) })}"` : ''}>${tok}
<fieldset class="jam-konten"><legend>${tx('db.konten.jamBerapa')}</legend>
${jam.map((x, i) => `<label class="chip-jam"><input type="radio" name="jam" value="${esc(x.v)}"${i === 0 ? ' checked' : ''}><span>${esc(x.l)}</span></label>`).join('')}
<label class="chip-jam sendiri"><input type="radio" name="jam" value="sendiri"><span>${tx('db.nunggu.pilihSendiri')}</span></label>
<label class="sr" for="${idJam}">${tx('db.konten.jamSendiriLabel')}</label><input class="input-jam" id="${idJam}" type="datetime-local" name="jam_sendiri" min="${minJam()}" data-jam-sendiri></fieldset>
<button class="tombol utama" type="submit">${g.kunci ? tx('db.konten.setujuiJadwal') : tx('db.konten.setujui')}</button>${g.kunci ? '' : `<p class="redup kecil">${tx('db.konten.belumSambungKet')}</p>`}</form>
<details class="tolak-rencana"><summary class="tombol hantu">${tx('db.konten.mintaRevisi')}</summary><form method="post" action="/konten/revisi">${tok}<label>${tx('db.konten.revisiLabel', { nama: esc(nama) })}<textarea name="catatan" rows="3" maxlength="400" required placeholder="${tx('db.konten.revisiContoh')}"></textarea></label><button class="tombol" type="submit">${tx('db.konten.kirimRevisi')}</button></form></details>
</article>`;
}

function kalenderKonten(m) {
  const ada = m.hari.some((h) => h.isi.length);
  const item = (p) => { const w = waktuRencana(p); const th = p.media.find((x) => !x.video); const ak = [...new Set((p.st.jadwal || []).map((h) => h.platform).concat(p.tujuan.map((a) => a.platform)))].filter(Boolean);
    return `<li><a class="kal-item rz-${p.status}" href="#r-${esc(p.id)}">${th ? `<img src="/sosmed/media/${enc(p.id)}/${p.media.indexOf(th) + 1}?v=${th.sha.slice(0, 8)}" alt="" loading="lazy">` : '<span class="kal-video" aria-hidden="true">▶</span>'}<span class="kal-teks"><b>${esc(jamWib(w))}</b><span>${esc(p.r?.judul || p.id)}</span><small>${esc(ak.map((x) => RZ.PLATFORM[x]?.nama || x).join(' · ') || tx('db.rencana.akunKosong'))}</small></span></a></li>`; };
  return `<ol class="kalender${ada ? '' : ' kosong-semua'}"${ada ? '' : ` data-kosong="${esc(tx('db.konten.kalenderKosong'))}"`}>${m.hari.map((h, i) => `<li class="hari${h.isi.length ? '' : ' kosong'}${i === 0 ? ' ini' : ''}"><p class="hari-nama"><b>${i === 0 ? tx('db.konten.hariIni') : i === 1 ? tx('db.konten.besok') : esc(hariWib(h.dt))}</b>${i < 2 ? `<span>${esc(hariWib(h.dt))}</span>` : ''}</p><ul>${h.isi.map(item).join('')}</ul></li>`).join('')}</ol>`;
}

function barisSelesai(p, g) {
  const th = p.media.find((x) => !x.video);
  const baris = (p.st.jadwal || []).map((h) => {
    const k = (g.performa?.konten || []).find((c) => c.dariKantor === p.id && c.akunId === h.akunId && (!h.postId || c.id === h.postId));
    const profil = PROFIL[h.platform]?.(String(h.username || '').replace(/^@/, ''));
    const tautan = h.status === 'tayang' ? (k?.url ? `<a href="${esc(k.url)}" target="_blank" rel="noopener">${tx('db.sosmed.bukaPost')}</a>` : profil ? `<a href="${esc(profil)}" target="_blank" rel="noopener">${tx('db.konten.bukaProfil')}</a>` : `<span class="redup">${tx('db.konten.cekRepliz')}</span>`) : '';
    const a = k?.angka;
    return `<li class="s-${h.status}"><span>${esc(namaAkun(h))}</span><span class="rz-${h.status}">${esc(h.status === 'terjadwal' ? tx('db.konten.masihTerjadwal') : labelJadwal(h.status))}${h.tayangPada ? ` · ${esc(tampilWib(new Date(h.tayangPada)))}` : ''}</span>${tautan}${a ? `<small>${tx('db.konten.angka', { views: angkaId(a.views ?? a.impression ?? a.reach), like: angkaId(a.like) })}</small>` : ''}${h.status === 'gagal' ? `<small class="masalah">${esc(h.pesan || tx('db.konten.gakAdaAlasan'))}</small>` : ''}</li>`;
  }).join('');
  const gagal = (p.st.jadwal || []).some((h) => h.status === 'gagal') || p.status === 'gagal';
  return `<li class="selesai-item" id="r-${esc(p.id)}">${th ? `<img src="/sosmed/media/${enc(p.id)}/${p.media.indexOf(th) + 1}?v=${th.sha.slice(0, 8)}" alt="" loading="lazy">` : '<span class="kal-video" aria-hidden="true">▶</span>'}<div><p><b>${esc(p.r?.judul || p.id)}</b> ${lencanaRz(p)}</p><ul class="jadwal-rencana">${baris}</ul>${p.status === 'gagal' && p.st.pesan ? `<p class="pesan-aksi gagal">${esc(tl(p.st.pesan))}</p>` : ''}${gagal ? `<p class="redup kecil">${tx('db.rencana.cekRepliz')}</p>` : ''}</div></li>`;
}

function panelPesan(d) {
  // Cuma tampil kalau Repliz udah disambung (atau udah pernah ada pesan): kantor tanpa Repliz gak perlu panel kosong.
  if (!RZ?.semuaPesan || !(d.sosmed?.kunci || fs.existsSync(path.join(K, 'sosmed/masuk')))) return '';
  const tok = `<input type="hidden" name="token" value="${esc(d.token)}">`;
  const daftar = RZ.semuaPesan(K).filter((p) => ['baru', 'nunggu'].includes(p.status));
  const nyala = RZ.otomatisNyala(K);
  const atur = `<div class="pesan-atur"><form method="post" action="/konten/pesan-ambil">${tok}<button class="tombol" type="submit">${tx('db.pesan.ambil')}</button></form>
<form class="pesan-otomatis" method="post" action="/konten/pesan-otomatis">${tok}<label for="pesan-nyala">${tx('db.pesan.otomatis')}</label><select id="pesan-nyala" name="nyala"><option value="0">${tx('db.pesan.mati')}</option><option value="1"${nyala ? ' selected' : ''}>${tx('db.pesan.nyala')}</option></select><button class="tombol hantu" type="submit">${tx('db.pesan.simpan')}</button></form></div>
<p class="redup kecil">${tx('db.pesan.aturan')}</p>`;
  const kartu = (p) => {
    const id = `${p.jenis}-${p.id}`;
    const info = [tx(`db.pesan.jenis.${p.jenis}`), p.platform, p.username && `@${p.username}`, p.waktu && relatifIso(p.waktu)].filter(Boolean).join(' · ');
    return `<article class="pesan-item"><h3>${esc(p.nama || p.id)}${p.status === 'nunggu' && p.aman ? ` <span class="lencana s-jalan">${tx('db.pesan.aman')}</span>` : ''}</h3><p class="redup kecil">${esc(info)}</p><p class="isi-pelanggan">${esc(p.teks)}</p>
<form method="post" action="/konten/pesan-kirim">${tok}<input type="hidden" name="id" value="${esc(id)}"><label for="t-${esc(id)}">${tx('db.pesan.draf')}</label><textarea id="t-${esc(id)}" name="teks" rows="3" maxlength="1000" required>${esc(p.draf || '')}</textarea>
<div class="pesan-tombol"><button class="tombol utama" type="submit">${tx('db.pesan.kirim')}</button><button class="tombol hantu" type="submit" formaction="/konten/pesan-lewati" formnovalidate>${tx('db.pesan.lewati')}</button></div></form></article>`;
  };
  return `<section class="panel pesan-masuk" id="pesan-masuk" aria-labelledby="j-k-pesan"><header><h2 id="j-k-pesan">${tx('db.pesan.judul')}</h2><span class="jml${daftar.length ? ' ada' : ''}">${daftar.length}</span></header><div class="pad">
${atur}${daftar.length ? daftar.map(kartu).join('') : `<p class="redup">${tx('db.pesan.kosong')}</p>`}</div></section>`;
}

function halKonten(d, pesan) {
  const g = d.sosmed;
  const kepala = (ringkas) => `<div class="kepala-hal"><h1>${tx('db.nav.konten')}</h1><span class="redup">${ringkas}</span></div>${pesan ? `<p class="pesan-aksi ${pesan.ok ? 'ok' : 'gagal'}" role="status">${esc(pesan.teks)}</p>` : ''}`;
  if (!g.ada) return `${kepala('')}<section class="panel">${kosong(tx('db.sosmed.gakAdaAlat'), tx('db.sosmed.gakAdaAlatTeks'), salin(tx('db.perintah.updateKit')))}</section>`;
  const m = modelKonten(g);
  const tok = `<input type="hidden" name="token" value="${esc(d.token)}">`;
  const jmlJadwal = m.hari.reduce((n, h) => n + h.isi.length, 0);
  const ringkas = tx('db.konten.ringkas', { nunggu: m.nunggu.length, jadwal: jmlJadwal, tayang: m.tayang7 });
  const banner = g.kunci ? '' : `<section class="panel banner-repliz" aria-labelledby="j-k-sambung"><div class="pad"><p class="judul-banner" id="j-k-sambung"><b>${tx('db.konten.bannerJudul')}</b></p><p class="redup">${tx('db.konten.bannerTeks')}</p><a class="tombol utama" href="/sosmed">${tx('db.sosmed.sambungJudul')}</a></div></section>`;
  const aksiBatal = (p) => `<form class="aksi-rencana" method="post" action="/konten/batal" data-yakin="${tx('db.konten.yakinBatal')}">${tok}<input type="hidden" name="id" value="${esc(p.id)}"><button class="tombol hantu" type="submit">${tx('db.konten.batalJadwal')}</button></form>`;
  const kosongSemua = !m.nunggu.length && !m.rusak.length && !m.jadwal.length && !m.selesai.length && !m.revisi.length;
  const kolomKiri = `<div class="kn-kiri">${m.nunggu.length || !kosongSemua ? `<section class="panel panel-nunggu" aria-labelledby="j-k-nunggu"><header><h2 id="j-k-nunggu">${tx('db.konten.nungguJudul')}</h2><span class="jml${m.nunggu.length ? ' ada' : ''}">${m.nunggu.length}</span></header>
${m.nunggu.length ? `<div class="daftar-rencana">${m.nunggu.map((p) => kartuNunggu(p, d, g)).join('')}</div>` : kosong(tx('db.konten.gakAdaNunggu'), tx('db.konten.gakAdaNungguTeks'))}
${m.rusak.length ? `<div class="daftar-rencana"><p class="redup kecil">${tx('db.konten.rusak')}</p>${m.rusak.map((p) => kartuRencana(p)).join('')}</div>` : ''}</section>` : ''}</div>
<div class="kn-kalender"><section class="panel" aria-labelledby="j-k-jadwal"><header><h2 id="j-k-jadwal">${tx('db.konten.jadwalJudul')}</h2><span class="jml">${jmlJadwal}</span></header>
${kalenderKonten(m)}${m.jauh ? `<p class="redup kecil pad">${txn('db.konten.jauh', m.jauh)}</p>` : ''}</section></div>
<div class="kn-detail">${m.jadwal.length ? `<section class="panel tenang" aria-labelledby="j-k-detail"><header><h2 id="j-k-detail">${tx('db.konten.dijadwalin')}</h2></header><div class="daftar-rencana">${m.jadwal.map((p) => kartuRencana(p, g.kunci && (p.st.jadwal || []).some((h) => h.status === 'terjadwal') ? aksiBatal(p) : p.status === 'disetujui' ? aksiBatal(p) : '')).join('')}</div></section>` : ''}
${m.revisi.length ? `<section class="panel tenang" aria-labelledby="j-k-revisi"><header><h2 id="j-k-revisi">${tx('db.konten.revisiJudul')}</h2></header><ul class="daftar-revisi">${m.revisi.map((p) => `<li><b>${esc(p.r?.judul || p.id)}</b><span class="redup">${p.st.alasan ? tx('db.konten.catatanKamu', { teks: esc(p.st.alasan) }) : tx('db.konten.tolakTanpa')}</span></li>`).join('')}</ul></section>` : ''}</div>`;
  const kolomKanan = `<div class="kn-kanan"><section class="panel" aria-labelledby="j-k-selesai"><header><h2 id="j-k-selesai">${tx('db.konten.selesaiJudul')}</h2></header>${m.selesai.length ? `<ul class="daftar-selesai">${m.selesai.slice(0, 8).map((p) => barisSelesai(p, g)).join('')}</ul>` : kosong(tx('db.konten.belumAda'), tx('db.konten.selesaiKosong'))}</section></div>
<div class="kn-akhir"><section class="panel tenang" aria-labelledby="j-k-akhir"><header><h2 id="j-k-akhir">${tx('db.konten.akhirJudul')}</h2></header>${m.disetujui.length ? `<ul class="daftar-revisi">${m.disetujui.map((p) => `<li><b>${esc(p.r?.judul || p.id)}</b><span class="redup">${esc(relatifIso(p.st.disetujui))} · ${esc(statusRz(p.status))}</span></li>`).join('')}</ul>` : kosong(tx('db.konten.belumAda'), tx('db.konten.akhirKosong'))}</section>
<section class="panel tenang" aria-labelledby="j-k-akun"><header><h2 id="j-k-akun">${tx('db.konten.akunJudul')}</h2></header>${g.kunci ? `<ul class="akun-performa">${daftarAkunRz(g)}</ul>` : `<p class="redup pad">${tx('db.konten.akunKosong')}</p>`}<p class="pad"><a class="tombol" href="/sosmed">${tx('db.konten.aturRepliz')}</a></p></section></div>`;
  const awal = kosongSemua ? `<section class="panel" aria-labelledby="j-k-kosong"><header><h2 id="j-k-kosong">${tx('db.konten.kosongJudul')}</h2></header>${kosong(tx('db.konten.kosongMinta'), tx('db.konten.kosongKetik'), salin(tx('db.perintah.postingan')))}</section>` : '';
  return `<div data-segar="konten">${kepala(ringkas)}${banner}${awal}<div class="konten-grid">${kolomKiri}${kolomKanan}</div>${panelPesan(d)}</div>`;
}

// Kabarin tim abis owner mutusin sesuatu di Konten: kalau task asalnya lagi nunggu-kamu, keputusannya ditulis sebagai
// "Jawaban owner:" (manajer langsung dibangunin, kayak jawab di task). Kalau gak, titipan ke kotak masuk divisinya.
// Hasilnya kalimat buat pesan di halaman.
function kabariTim(d, p, teks, { bangun = true } = {}) {
  const t = p.task && d.task.find((x) => x.kode.toLowerCase() === p.task.toLowerCase());
  const pegang = t?.pegang || d.manajer.find((x) => x.id === 'sari')?.id || d.task.find((x) => x.divisi === 'sosmed')?.pegang || '';
  const nama = d.manajer.find((x) => x.id === pegang)?.nama || tx('db.umum.tim');
  const judul = p.r?.judul || p.id;
  if (t && t.statusFile === 'nunggu-kamu' && t.proses?.k !== 'jalan') {
    try { tulisJawaban(t.f, [{ nomor: '', huruf: '', teks: `${judul}: ${teks}${tx('db.kabar.lewatKonten')}` }]); } catch { return ''; }
    return bangun && bangunin(pegang, t.divisi) ? tx('db.kabar.mulaiNyatet', { nama }) : tx('db.kabar.nyatetNanti', { nama });
  }
  const divisi = t?.divisi || 'sosmed';
  const folder = path.join(K, 'kotak-masuk', divisi);
  try {
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path.join(folder, `${hariIni()}-dari-owner-konten-${p.id}.md`), `dari: owner (halaman Konten)\nke: ${divisi} (${nama})\ntask terkait: ${p.task || '-'}\n---\n${judul} (rencana ${p.id}): ${teks}\n`);
  } catch { return ''; }
  return bangun && bangunin(pegang, divisi) ? tx('db.kabar.dikabarin', { nama }) : tx('db.kabar.bacaNanti', { nama });
}

const bolehJam = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
// Aksi dari halaman Konten. Hasilnya { ok, teks } buat pesan di atas halaman.
async function aksiKonten(d, aksi, q) {
  if (aksi.startsWith('pesan-') && RZ?.semuaPesan) {
    if (aksi === 'pesan-ambil') {
      const h = await RZ.ambilPesan(K);
      return { ok: !h.catatan.length, teks: h.catatan.length ? tx('db.pesan.gold') : tx('db.pesan.diambil') };
    }
    if (aksi === 'pesan-otomatis') { RZ.setelOtomatis(K, q.get('nyala') === '1'); return { ok: true, teks: tx('db.pesan.disimpan') }; }
    if (aksi === 'pesan-lewati') { RZ.drafPesan(K, q.get('id'), '', { lewati: true }); return { ok: true, teks: tx('db.pesan.dilewati') }; }
    if (aksi === 'pesan-kirim') {
      try { await RZ.balasPesan(K, q.get('id'), q.get('teks')); }
      catch (e) { return { ok: false, teks: tx(e.jenis === 'paket' ? 'db.pesan.gold' : 'db.pesan.gagal') }; }
      return { ok: true, teks: tx('db.pesan.terkirim') };
    }
    return { ok: false, teks: tx('db.aksi.gagalTitik') };
  }
  const id = (q.get('id') || '').trim();
  if (!/^[a-z0-9][a-z0-9_-]{0,80}$/i.test(id)) return { ok: false, teks: tx('db.aksi.rencanaGakAda') };
  const J = RZ.jalur(K);
  const p = RZ.periksa(K, id, akunRepliz());
  if (!p.r) return { ok: false, teks: tx('db.aksi.rencanaGakAda') };
  const lengkap = RZ.semuaRencana(K, akunRepliz()).find((x) => x.id === id);
  const status = lengkap?.status;
  if (aksi === 'setuju') {
    if (status !== 'nunggu') return { ok: false, teks: tx('db.aksi.udahStatus', { status: (status ? statusRz(status) : tx('db.aksi.diproses')).toLowerCase() }) };
    if (p.masalah.length) return { ok: false, teks: tx('db.aksi.belumBisa', { masalah: p.masalah.map(tl).join('; ') }) };
    const pilih = q.get('jam') || '';
    const baru = pilih === 'sendiri' ? (q.get('jam_sendiri') || '').replace('T', ' ').slice(0, 16) : bolehJam.test(pilih) ? pilih : '';
    if (pilih === 'sendiri' && !bolehJam.test(baru)) return { ok: false, teks: tx('db.aksi.isiJam') };
    if (baru) {
      const w = RZ.waktuWib(baru);
      if (!w || w.getTime() < Date.now() + 10 * 60000) return { ok: false, teks: tx('db.aksi.jamMin') };
      if (`${tglWib(w)} ${jamWib(w)}` !== (p.waktu ? `${tglWib(p.waktu)} ${jamWib(p.waktu)}` : '')) RZ.tulisJson(path.join(J.terbit, `${id}.json`), { ...p.r, waktu: baru });
    }
    const b = RZ.periksa(K, id, akunRepliz());
    RZ.catatSetuju(K, id, b.sidik);
    if (!RZ.adaKunci(K)) {
      RZ.tulisStatus(K, id, { status: 'disetujui', sidik: b.sidik, disetujui: new Date().toISOString(), waktuTayang: b.waktu?.toISOString() });
      return { ok: true, teks: `${tx('db.aksi.disetujuiBelum', { kapan: tampilWib(b.waktu) })}${kabariTim(d, b, tx('db.kabar.disetujuiBelum', { kapan: tampilWib(b.waktu) }))}` };
    }
    const h = await alatRepliz(['jadwal', id], 180000);
    const sah = h.ok && !h.teks[0]?.startsWith('⚠️');
    const ringkas = h.teks.map(barisAlat).join(' · ').replace(/(✅|⚠️|❌)\s*/g, '') || (h.ok ? tx('db.aksi.beres') : tx('db.aksi.gagalJadwal'));
    const st = RZ.semuaRencana(K, akunRepliz()).find((x) => x.id === id);
    return { ok: sah, teks: `${ringkas}${kabariTim(d, b, sah ? tx('db.kabar.terjadwal', { kapan: tampilWib(waktuRencana(st)) }) : tx('db.kabar.gagalJadwal', { ringkas }))}` };
  }
  if (aksi === 'revisi') {
    const catatan = (q.get('catatan') || '').replace(/\s+/g, ' ').trim().slice(0, 400);
    if (!catatan) return { ok: false, teks: tx('db.aksi.tulisRevisi') };
    if (status !== 'nunggu') return { ok: false, teks: tx('db.aksi.gakNunggu') };
    RZ.tulisStatus(K, id, { status: 'ditolak', sidik: p.sidik, alasan: catatan, revisi: true, waktu: new Date().toISOString() });
    return { ok: true, teks: `${tx('db.aksi.revisiTerkirim')}${kabariTim(d, p, tx('db.kabar.revisi', { catatan }))}` };
  }
  if (aksi === 'batal') {
    if (!['terjadwal', 'sebagian', 'disetujui'].includes(status)) return { ok: false, teks: tx('db.aksi.gakBisaBatal') };
    let teks;
    if (status === 'disetujui') {
      RZ.tulisStatus(K, id, { ...lengkap.st, status: 'batal' });
      teks = tx('db.aksi.persetujuanBatal');
    } else {
      const h = await alatRepliz(['batal', id], 60000);
      teks = barisAlat(h.teks.at(-1) || '') || tx('db.aksi.selesai');
      if (!h.ok || h.teks.at(-1)?.startsWith('⚠️')) return { ok: false, teks };
    }
    return { ok: true, teks: `${teks}${kabariTim(d, p, tx('db.kabar.batal'), { bangun: false })}` };
  }
  return { ok: false, teks: tx('db.aksi.gakDikenal') };
}

// Rencana yang disetujui pas Repliz belum nyambung dijadwalin begitu kuncinya ada.
let rzTertunda = false;
async function jadwalkanTertunda() {
  if (!RZ || rzTertunda || !RZ.adaKunci(K)) return;
  rzTertunda = true;
  try {
    for (const p of RZ.semuaRencana(K, akunRepliz())) if (p.status === 'disetujui' && p.disetujui) await alatRepliz(['jadwal', p.id], 180000);
  } finally { rzTertunda = false; }
}

// Timer tanpa AI: status jadwal yang belum final tiap 10 menit, angka performa sekali sehari mulai jam 06.00.
const alatRepliz = (args, timeout) => new Promise((ok) => execFile(process.execPath, [path.join(K, 'alat/repliz.mjs'), ...args], { cwd: K, timeout, env: { ...process.env, KANTOR: K, KIT_LOKAL: lokal() } },
  (err, out = '', galat = '') => ok({ ok: !err, teks: `${out}\n${galat}`.split('\n').map((x) => x.trim()).filter(Boolean) })));
let rzSibuk = false; let rzCobaPerforma = 0;
if (RZ) {
  setInterval(async () => {
    if (rzSibuk || !RZ.adaKunci(K)) return;
    rzSibuk = true;
    try {
      await RZ.balasOtomatis?.(K);
      await jadwalkanTertunda();
      if (RZ.semuaRencana(K).some((p) => ['terjadwal', 'sebagian'].includes(p.status))) await alatRepliz(['cek'], 120000);
      const jam = Number(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hourCycle: 'h23' }).format(new Date()));
      if (jam >= 6 && !fs.existsSync(path.join(K, `sosmed/performa/${hariIni()}.json`)) && Date.now() - rzCobaPerforma > 3600000) {
        rzCobaPerforma = Date.now();
        await alatRepliz(['performa'], 300000);
      }
    } finally { rzSibuk = false; }
  }, Number(process.env.REPLIZ_JEDA_MS || 600000)).unref();
}

// Cek versi kit sekali sehari (mulai jam 09.00, tanpa AI): update.sh --cek nulis spanduk & notif. Cron Senin/harian
// jadi cadangan kalau dashboard mati. Hari terakhir dicek disimpen biar restart gak bikin ngecek ulang.
const F_CEK_VERSI = path.join(K, 'catatan/.kit-cek-hari');
setInterval(() => {
  const jam = Number(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hourCycle: 'h23' }).format(new Date()));
  const skrip = path.join(KIT, 'update.sh');
  if (jam < 9 || bacaAman(F_CEK_VERSI).trim() === hariIni() || !fs.existsSync(skrip) || keadaanUpdate().tahap === 'jalan') return;
  fs.writeFileSync(F_CEK_VERSI, `${hariIni()}\n`);
  const log = fs.openSync(path.join(K, 'catatan/update.log'), 'a');
  const c = spawn('bash', [skrip, '--cek'], { cwd: K, stdio: ['ignore', log, log], env: { ...process.env, KANTOR: K } });
  fs.closeSync(log);
  c.on('error', () => {});
}, Number(process.env.CEK_VERSI_JEDA_MS || 1800000)).unref();

// ---------- update kit dari dashboard ----------
// jalan = penanda ada, kode keluar belum ada, prosesnya masih hidup. Kode keluar ada = selesai (0 beres, lain gagal).
// Penanda ada tapi prosesnya mati tanpa kode = keputus (mis. VPS restart di tengah update).
function keadaanUpdate() {
  let j = null;
  try { j = JSON.parse(fs.readFileSync(UPD.jalan, 'utf8')); } catch { /* belum pernah update dari dashboard */ }
  const kode = bacaAman(UPD.kode).trim();
  const hidup = (pid) => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; } };
  if (!j) return { tahap: 'kosong' };
  if (!kode && hidup(j.pid)) return { tahap: 'jalan', mulai: j.mulai, versiLama: j.versiLama };
  const log = bacaAman(UPD.log);
  const baris = log.split('\n').map((x) => x.trim()).filter(Boolean);
  const akhir = [...baris].reverse().find((x) => /^[✅❌]/.test(x)) || '';
  const bentrok = (log.match(/gak ditimpa karena udah diubah di kantor[^:]*:\s*(.+)/)?.[1] || '').split(',').map((x) => x.trim()).filter(Boolean);
  return {
    tahap: !kode ? 'keputus' : kode === '0' ? 'beres' : 'gagal',
    mulai: j.mulai, versiLama: j.versiLama, versi: bacaAman(path.join(KIT, 'VERSI')).trim(),
    pesan: akhir.replace(/^[✅❌]\s*/, ''), bentrok,
    sesuain: /template peran manajer berubah|ATURAN\.md di kit berubah|pagar gak diperbarui/.test(log),
    log: baris.slice(-25).join('\n'),
  };
}

// Mulai update.sh sebagai user dashboard ini (user kantor, bukan root). Lagi jalan = gak dobel (satu proses aja);
// update.sh sendiri juga ngunci (flock), jadi gak bisa barengan sama "jadi builder, update kit".
function mulaiUpdate() {
  if (keadaanUpdate().tahap === 'jalan') return 'udah-jalan';
  const skrip = path.join(KIT, 'update.sh');
  if (!fs.existsSync(skrip)) return 'gak-ada';
  fs.mkdirSync(path.dirname(UPD.kode), { recursive: true });
  fs.rmSync(UPD.kode, { force: true });
  const out = fs.openSync(UPD.log, 'w');
  const c = spawn('bash', ['-c', 'bash "$1"; k=$?; echo "$k" > "$2.tmp" && mv "$2.tmp" "$2"', 'update', skrip, UPD.kode],
    { cwd: K, detached: true, stdio: ['ignore', out, out], env: { ...process.env, KANTOR: K } });
  fs.closeSync(out);
  c.unref();
  fs.writeFileSync(UPD.jalan, `${JSON.stringify({ pid: c.pid, mulai: Date.now(), versiLama: bacaAman(path.join(KIT, 'VERSI')).trim() })}\n`);
  return 'mulai';
}

function halUpdate(st) {
  const ketik = (p) => `${tx('db.update.ketik')} ${salin(p)}`;
  const kepala = (judul) => `<div class="kepala-hal"><h1>${esc(judul)}</h1></div>`;
  const detail = st.log ? `<details class="detail-teknis"><summary>${tx('db.update.detail')}</summary><pre>${esc(st.log)}</pre></details>` : '';
  if (st.tahap === 'jalan') {
    return `${kepala(tx('db.update.jalanJudul'))}<section class="panel update-tunggu" data-update-tunggu aria-live="polite"><div class="pad update-isi">
<p class="update-muter"><span class="muter" aria-hidden="true"></span><span>${tx('db.update.jalanDari', { v: esc(st.versiLama || '?') })}</span></p>
<p class="redup">${tx('db.update.jalanKet')}</p>
<p class="pesan-aksi gagal" data-kelamaan hidden>${tx('db.update.kelamaan')} ${ketik(tx('db.perintah.updateKit'))}</p></div></section>`;
  }
  if (st.tahap === 'beres') {
    const bentrok = st.bentrok.length ? `<div class="pesan-aksi gagal"><p>${txn('db.update.bentrok', st.bentrok.length, { file: st.bentrok.map((f) => `<code>${esc(f)}</code>`).join(', '), v: esc(st.versi) })}</p><p>${tx('db.update.bandingin')} ${ketik(tx('db.perintah.sisaUpdate'))}</p></div>` : '';
    const sesuain = !st.bentrok.length && st.sesuain ? `<p class="pesan-aksi ok">${tx('db.update.sesuain')} ${ketik(tx('db.perintah.sisaUpdate'))}</p>` : '';
    return `${kepala(st.bentrok.length ? tx('db.update.beresCek') : tx('db.update.beres'))}<section class="panel"><div class="pad akun update-isi">
<p class="pesan-aksi ok">${esc(st.pesan || tx('db.update.versiKini', { v: st.versi }))}</p>${bentrok}${sesuain}
<p class="redup">${tx('db.update.sesiBaru')}</p>
<a class="tombol" href="/">${tx('db.umum.keRingkasan')}</a>${detail}</div></section>`;
  }
  const sebab = st.tahap === 'keputus' ? tx('db.update.keputus') : tx('db.update.gagal', { pesan: st.pesan || tx('db.update.gakAdaKet') });
  return `${kepala(tx('db.update.gakBeres'))}<section class="panel"><div class="pad akun update-isi">
<p class="pesan-aksi gagal">${esc(sebab)}</p><p>${tx('db.update.beresin')} ${ketik(tx('db.perintah.updateKit'))}</p>
<a class="tombol" href="/lainnya#akun">${tx('db.umum.balikLainnya')}</a>${detail}</div></section>`;
}

// ---------- detail task (drawer & halaman penuh) ----------
// "Keputusan kamu": tiap pilihan = tombol jawab (selama status nunggu-kamu). Jawaban bisa diganti sampai tim nyatet.
function blokKeputusan(t, d, m) {
  const nama = m?.nama || tx('db.umum.tim');
  // Bisa jawab/ganti selama file masih nunggu-kamu, kecuali manajernya lagi nyatet (biar gak tabrakan nulis file).
  const bisa = t.statusFile === 'nunggu-kamu' && t.proses?.k !== 'jalan';
  const opsi = (q) => q.opsi.map((o) => {
    const dipilih = t.jawaban.some((j) => j.nomor === q.nomor && j.huruf === o.huruf);
    const kelas = ['pilih', o.rek ? 'rek' : '', dipilih ? 'dipilih' : ''].filter(Boolean).join(' ');
    const isi = `<span class="huruf">${esc(o.huruf)}</span><span class="opsi-teks">${esc(o.teks)}${o.alasan ? `<small>${esc(o.alasan)}</small>` : ''}</span>${dipilih ? `<span class="tag dipilih">${tx('db.kp.jawabanKamu')}</span>` : o.rek ? `<span class="tag">${tx('db.nunggu.saran', { nama: esc(nama) })}</span>` : ''}`;
    return `<li>${bisa ? formJawab(t, { nomor: q.nomor, huruf: o.huruf }, `<button type="submit" class="${kelas}" aria-pressed="${dipilih}">${isi}</button>`) : `<div class="${kelas}">${isi}</div>`}</li>`;
  }).join('');
  // Gambar di soal (baris "![](hasil/x.png)" abis "Kenapa:") udah kedeteksi sebagai hasil task: pakai nomor berkasnya.
  const gambar = (q) => q.gambar.map((g) => t.hasil.find((h) => h.rel === g.replace(/^\.\//, '') && h.jenis === 'gambar')).filter(Boolean)
    .map((h) => `<a href="/task/${enc(t.f)}/hasil/${h.n}" target="_blank" rel="noopener"><img src="/task/${enc(t.f)}/hasil/${h.n}" alt="${esc(h.nama)}" loading="lazy"></a>`).join('');
  // Soal tanpa opsi (mis. "Kirim foto produk ke kotak masuk?"): dijawab pakai kolom isian, kecatat "Jawaban owner: 3: …".
  const isian = (q) => {
    const j = t.jawaban.find((x) => x.nomor === q.nomor);
    const teks = j ? j.teks.replace(/^\d+\s*[.):]?\s*/, '').replace(/\s*\(lewat dashboard [^)]*\)$/, '') : '';
    if (!bisa) return teks ? `<p class="catatan-kamu"><b>${tx('db.kp.jawabanKamuTitik')}</b> ${esc(teks)}</p>` : '';
    return formJawab(t, { nomor: q.nomor }, `<label class="sr" for="isi-${esc(t.kode)}-${esc(q.nomor)}">${tx('db.kp.jawabanSoal', { n: esc(q.nomor) })}</label><textarea id="isi-${esc(t.kode)}-${esc(q.nomor)}" name="teks" rows="2" maxlength="400" required placeholder="${tx('db.kp.tulisJawaban')}">${esc(teks)}</textarea><button class="tombol" type="submit">${teks ? tx('db.kp.gantiJawaban') : tx('db.kp.kirim')}</button>`).replace('<form ', '<form class="isian-soal" ');
  };
  // Jawaban bebas bernomor buat soal yang punya opsi (owner nulis "1: revisi slide 3" di file): ditampilin di bawah opsinya.
  const catatanSoal = (q) => { const j = t.jawaban.find((x) => x.nomor === q.nomor && !x.huruf); return j ? `<p class="catatan-kamu"><b>${tx('db.kp.jawabanKamuTitik')}</b> ${esc(j.teks.replace(/^\d+\s*[.):]?\s*/, '').replace(/\s*\(lewat dashboard [^)]*\)$/, ''))}</p>` : ''; };
  const soal = t.soal.length ? t.soal.map((q) => `<div class="soal"><p><span class="no">${esc(q.nomor)}</span>${esc(q.teks)}</p>${q.kenapa ? `<p class="kenapa"><b>${tx('db.kp.kenapa')}</b> ${esc(q.kenapa)}</p>` : ''}${q.gambar.length ? `<div class="gambar-soal">${gambar(q)}</div>` : ''}${q.opsi.length ? `<ul class="opsi">${opsi(q)}</ul>${catatanSoal(q)}` : isian(q)}</div>`).join('') : `<div class="teks-md">${md(t.keputusan.split('\n').filter((b) => !/^\s*jawaban owner\s*:/i.test(b)).join('\n'))}</div>`;
  const bebas = t.jawaban.filter((j) => !j.nomor).map((j) => `<p class="catatan-kamu"><b>${tx('db.kp.jawabanKamuTitik')}</b> ${esc(j.teks.replace(/\s*\(lewat dashboard [^)]*\)$/, ''))}</p>`).join('');
  const lanjut = m ? `jadi ${m.id}, lanjut ${t.kode}` : `lanjut ${t.kode}`;
  const k = t.proses?.k;
  const status = t.terjawab
    ? `<div class="status-jawab${k === 'jalan' ? ' proses' : ''}"${['tunggu', 'jalan', 'antri'].includes(k) ? ' data-pantau' : ''} role="status"><p><b>${k === 'jalan' ? tx('db.kp.lagiDiproses') : tx('db.kp.kesimpen')}</b> ${esc(kalimatProses(t, nama)[1])}</p>${['ngalah', 'mati', 'nanti'].includes(k) ? `<p class="redup">${tx('db.kp.langsung')}</p>${salin(lanjut)}` : ''}</div>`
    : bisa && t.jawaban.length ? `<div class="status-jawab sebagian"><p>${tx('db.kp.sebagian')}</p></div>` : '';
  const lain = bisa ? `<details class="jawab-lain"${t.soal.length ? '' : ' open'}><summary>${t.soal.length ? tx('db.kp.lainCatatan') : tx('db.kp.tulisJawaban')}</summary>${formJawab(t, {}, `<label class="sr" for="lain-${esc(t.kode)}">${tx('db.kp.jawabanKamu')}</label><textarea id="lain-${esc(t.kode)}" name="teks" rows="3" maxlength="400" required placeholder="${tx('db.kp.contoh')}"></textarea><button class="tombol" type="submit">${tx('db.kp.kirimJawaban')}</button>`)}</details>
<div class="cara-jawab"><p>${tx('db.kp.ngobrol', { nama: esc(nama) })}</p>${salin(m ? `jadi ${m.id}, lanjut ${t.kode}` : tx('db.perintah.nunggu'))}</div>` : '';
  return `<section class="blok-keputusan"><h3>${tx('db.kp.judul')}${bisa && !t.terjawab && t.soal.length ? `<span class="petunjuk">${tx('db.kp.petunjuk')}</span>` : ''}</h3>${status}${soal}${bebas}${lain}</section>`;
}

// Tulis jawaban dari dashboard ke file task: baris "Jawaban owner: 1a …" di bawah "## Keputusan kamu" (format yang
// udah dibaca detak & manajer, lihat task/README.md). Jawaban lama buat nomor yang sama diganti. Status gak diubah:
// tim yang nyatet ke "Udah", ngosongin keputusan, & lanjut kerja.
function tulisJawaban(f, isian) {
  const file = path.join(K, 'task', f);
  const bagianJam = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  const hasil = pasangJawaban(bacaAman(file), isian, `${bagianJam.day}/${bagianJam.month} ${bagianJam.hour}:${bagianJam.minute}`, hariIni());
  const sementara = path.join(K, 'task', `.${f}.${process.pid}.tmp`);
  fs.writeFileSync(sementara, hasil);
  fs.renameSync(sementara, file);
  jamJawab.set(f, Math.floor(Date.now() / 1000));
}
function isiTask(t, d, { drawer = false } = {}) {
  const m = d.manajer.find((x) => x.id === t.pegang);
  const lain = t.bag.filter((b) => !/^(keputusan (kamu|lu)|udah|tujuan|berikutnya|hasil)$/i.test(b.judul) && b.teks);
  const ambil = (pola) => t.bag.find((b) => pola.test(b.judul))?.teks || '';
  const tujuan = ambil(/^tujuan$/i);
  const berikut = ambil(/^berikutnya$/i);
  const keputusan = t.keputusan ? blokKeputusan(t, d, m) : '';
  const udah = [...t.udah].reverse();
  const garis = (xs) => xs.map((x) => `<li>${x.tgl ? `<time>${esc(x.tgl)}</time>` : ''}<span>${md(x.teks).replace(/^<p>|<\/p>$/g, '')}</span></li>`).join('');
  const badan = `${renderHasil(t.f, t.hasil)}${keputusan}
${tujuan ? `<section class="blok"><h3>${tx('db.isi.tujuan')}</h3><div class="teks-md">${md(tujuan)}</div></section>` : ''}
${udah.length ? `<section class="blok"><h3>${tx('db.isi.udah')} <span class="jml">${udah.length}</span></h3><ol class="garis-waktu">${garis(udah.slice(0, 6))}</ol>${udah.length > 6 ? `<details class="lipat"><summary>${tx('db.isi.sebelumnya', { n: udah.length - 6 })}</summary><ol class="garis-waktu">${garis(udah.slice(6))}</ol></details>` : ''}</section>` : ''}
${berikut ? `<section class="blok"><h3>${tx('db.isi.berikutnya')}</h3><div class="teks-md">${md(berikut)}</div></section>` : ''}
${lain.map((b) => `<details class="blok lipat"><summary>${esc(b.judul)}</summary><div class="teks-md">${md(b.teks)}</div></details>`).join('')}`;
  const kepala = `<div class="meta">${lencana(t)}<span class="kode">${esc(t.kode)}</span></div><h2 id="judul-drawer">${esc(t.judul)}</h2>
<p class="sub">${ava(m, 'kecil')}<b>${esc(m?.nama || t.pegang || tx('db.isi.belumPegang'))}</b><span class="redup">${t.update ? tx('db.isi.diupdate', { kapan: esc(relatif(t.update)) }) : ''}</span></p>`;
  if (drawer) {
    return `<div class="kepala-dr"><span class="pegangan" aria-hidden="true"></span><div class="kepala-teks">${kepala}</div><button class="tutup" type="button" data-tutup aria-label="${tx('db.umum.tutup')}">${ikon('tutup')}</button></div>
<div class="badan-dr">${badan}</div><div class="kaki-dr">${salin(`lanjut ${t.kode}`)}<a class="tombol hantu" href="/task/${enc(t.f)}">${tx('db.isi.halamanPenuh')}</a></div>`;
  }
  return `<nav class="jejak"><a href="/task">${tx('db.nav.task')}</a> / ${esc(t.kode)}</nav><header class="kepala-task">${kepala.replace(' id="judul-drawer"', '')}<div class="aksi">${salin(`lanjut ${t.kode}`)}</div></header><div class="detail-task">${badan}</div>`;
}

function cariTask(f) {
  if (!/^T-\d+[\w.-]*\.md$/.test(f)) return null;
  return f;
}

// ---------- masuk ----------
const pemandu = (teks) => `<div class="pemandu"><span class="karakter" aria-hidden="true"><img src="/aset/orang/claude-1-front-right.webp" alt="" width="88" height="180"></span><div class="gelembung"><span class="gelembung-nama">Builder</span><p>${teks}</p></div></div>`;
function halMasuk(salah = '') {
  const k = namaKantor();
  return `<!doctype html><html lang="${bahasaAktif()}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#0A1222"><title>${tx('db.masuk.judul')} · ${tx('db.kerangka.kantor')} ${esc(k)}</title>
<link rel="preload" href="/aset/jakarta.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/aset/gaya.css">${teksApp()}</head><body class="hal-masuk">
<main class="masuk"><p class="merek"><i aria-hidden="true">${esc((k || 'K')[0].toUpperCase())}</i><span><small>${tx('db.kerangka.kantor')}</small> ${esc(k || 'AI')}</span></p>${pemandu(salah || tx('db.masuk.ajak'))}
<form method="post" action="/masuk"><label class="isian">${tx('db.masuk.password')}<input type="password" name="password" autocomplete="current-password" required autofocus></label>
<button class="tombol utama besar">${tx('db.masuk.masuk')}</button></form>
<p class="bantu">${tx('db.masuk.lupa')}</p></main></body></html>`;
}

function cocok(pw) {
  try {
    const { garam, hash } = JSON.parse(bacaAman(path.join(K, '.rahasia/dashboard.json')));
    const a = crypto.scryptSync(String(pw), garam, 32);
    return crypto.timingSafeEqual(a, Buffer.from(hash, 'hex'));
  } catch { return false; }
}

const HEADER = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'same-origin',
  'Content-Security-Policy': "default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self'; frame-ancestors 'none'; form-action 'self'" };
const JENIS = { css: 'text/css; charset=utf-8', js: 'text/javascript; charset=utf-8', webp: 'image/webp', woff2: 'font/woff2' };

http.createServer((req, res) => {
  // Bahasa tampilan dibaca tiap request (owner bisa ganti dari Lainnya atau lewat Builder tanpa restart).
  pakai(bacaBahasa(K));
  const u = new URL(req.url, 'http://x');
  const kirim = (kode, isi, h = {}) => { res.writeHead(kode, { ...HEADER, ...h }); res.end(isi); };
  const aset = u.pathname.match(/^\/aset\/((?:orang(?:-cozy|-modern)?\/)?[a-z0-9-]+\.(css|js|webp|woff2))$/);
  if (aset) {
    const f = path.join(ASET, aset[1]);
    return fs.existsSync(f) ? kirim(200, fs.readFileSync(f), { 'Content-Type': JENIS[aset[2]], 'Cache-Control': ['webp', 'woff2'].includes(aset[2]) ? 'max-age=86400' : 'no-cache' }) : kirim(404, '');
  }
  if (u.pathname === '/sehat') return kirim(200, 'ok', { 'Content-Type': 'text/plain' });
  // Media postingan buat Repliz (diambil pas jam tayang): tanpa login, token acak per rencana, isi harus sama kayak yang
  // disetujuin, kedaluwarsa 3 hari abis selesai. robots.txt ngebolehin /publik/ aja (crawler Repliz nurut robots).
  if (u.pathname === '/robots.txt') return kirim(200, 'User-agent: *\nAllow: /publik/\nDisallow: /\n', { 'Content-Type': 'text/plain' });
  const pub = u.pathname.match(/^\/publik\/sosmed\/([0-9a-f]{36})\/(\d{1,2}\.[a-z0-9]{3,4})$/);
  if (pub && (req.method === 'GET' || req.method === 'HEAD')) {
    const m = RZ?.mediaPublik(K, pub[1], pub[2]);
    if (!m) return kirim(404, '', { 'Content-Type': 'text/plain' });
    res.writeHead(200, { 'Content-Type': m.mime, 'Content-Length': m.ukuran, 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' });
    return req.method === 'HEAD' ? res.end() : fs.createReadStream(m.abs).pipe(res);
  }
  const kue = Object.fromEntries((req.headers.cookie || '').split(';').map((x) => x.trim().split('=')));
  const aman = req.headers['x-forwarded-proto'] === 'https';
  if (u.pathname === '/masuk' && req.method === 'POST') {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const c = coba.get(ip) || { n: 0, t: Date.now() };
    if (Date.now() - c.t > 900000) { c.n = 0; c.t = Date.now(); }
    if (c.n >= 10) return kirim(429, halMasuk(tx('db.masuk.kebanyakan')));
    let d = '';
    req.on('data', (x) => { d += x; if (d.length > 2048) req.destroy(); });
    return req.on('end', () => {
      if (cocok(new URLSearchParams(d).get('password') || '')) {
        const id = crypto.randomBytes(24).toString('hex');
        sesi.set(kunciSesi(id), Date.now());
        simpanSesi();
        res.writeHead(303, { Location: '/', 'Set-Cookie': `kd=${id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${aman ? '; Secure' : ''}` });
        return res.end();
      }
      c.n += 1; coba.set(ip, c);
      kirim(401, halMasuk(tx('db.masuk.salah')));
    });
  }
  if (!(Date.now() - (sesi.get(kunciSesi(kue.kd)) || 0) < UMUR_SESI)) {
    // Fetch dari app.js (sesi abis): bilang 401 biar halaman reload ke form masuk, bukan nyelipin form ke drawer.
    if (u.pathname.startsWith('/fragmen/') || u.pathname === '/sidik' || u.pathname === '/data.json' || u.pathname === '/update/status') return kirim(401, '', { 'Content-Type': 'text/plain' });
    return kirim(200, halMasuk());
  }
  if (u.pathname === '/keluar') { sesi.delete(kunciSesi(kue.kd)); simpanSesi(); res.writeHead(303, { Location: '/' }); return res.end(); }
  const d = data();
  d.token = tokenForm(kue.kd);
  if (u.pathname === '/') return kirim(200, halaman(d, { judul: tx('db.nav.ringkasan'), aktif: 'ringkasan', isi: halRingkasan(d) }));
  if (u.pathname === '/kantor') return kirim(200, halaman(d, { judul: tx('db.nav.kantor'), aktif: 'kantor', isi: halKantor(d), kelas: 'hal-kantor', skrip: d.tampilan === 'papan' ? '' : `${ADA_MASJID.includes(d.tampilan) ? '<script src="/aset/shalat.js" defer></script>' : ''}<script src="/aset/kantor-hidup.js" defer></script>${adaAset(`denah-${d.tampilan}.js`) ? `<script src="/aset/denah-${d.tampilan}.js" defer></script>` : ''}<script src="/aset/kantor.js" defer></script>` }));
  if (u.pathname === '/task') return kirim(200, halaman(d, { judul: tx('db.nav.task'), aktif: 'task', isi: halDaftarTask(d, u.searchParams) }));
  if (u.pathname === '/tim') return kirim(200, halaman(d, { judul: tx('db.nav.tim'), aktif: 'tim', isi: halTim(d) }));
  if (u.pathname === '/riwayat') return kirim(200, halaman(d, { judul: tx('db.riwayat.judul'), aktif: 'lainnya', isi: halRiwayat() }));
  if (u.pathname === '/lainnya' && req.method !== 'POST') {
    const pesan = u.searchParams.get('bahasa') === 'diganti' ? { ok: true, teks: tx('db.bahasa.diganti', { nama: tx(`umum.bahasa.${bahasaAktif()}`) }) } : null;
    return kirim(200, halaman(d, { judul: tx('db.nav.lainnya'), aktif: 'lainnya', isi: halLainnya(d, pesan) }));
  }
  // Hitung asal sebelum rute Drive supaya pengecekan POST gak mengakses variabel sebelum deklarasi.
  const asal = req.headers.origin || req.headers.referer || '';
  let hostAsal = '';
  try { hostAsal = asal ? new URL(asal).host : ''; } catch { hostAsal = '-'; }
  const dariLuar = req.method === 'POST' && asal && hostAsal !== req.headers.host;
  if (u.pathname === '/drive' && req.method !== 'POST') {
    const umur = Date.now() - (Date.parse(d.drive.cek?.waktu || '') || 0);
    if (umur > 30 * 60000 && !lagiCekDrive) { cekKonektorDrive(); d.drive.lagiCek = true; }
    const tampil = (st) => {
      if (st?.pesan && st.aktif !== false) drivePesan = st.pesan;
      return kirim(200, halaman(d, { judul: 'Google Drive', aktif: 'lainnya', isi: halDrive(d), skrip: '<script src="/aset/drive.js" defer></script>' }));
    };
    return Promise.resolve(GD?.cekStatus(K)).then(tampil).catch(() => tampil({ pesan: tx('db.kirim.gakBisaCek') }));
  }
  if (u.pathname === '/web' && req.method !== 'POST') {
    const pesan = u.searchParams.get('pesan') ? { ok: u.searchParams.get('ok') === '1', teks: u.searchParams.get('pesan').slice(0, 300) } : null;
    return kirim(200, halaman(d, { judul: tx('db.web.judul'), aktif: 'lainnya', isi: halWeb(d, pesan) }));
  }
  const fotoWeb = u.pathname.match(/^\/web\/foto\/([a-z0-9-]+-(?:hp|laptop)\.png)$/);
  if (fotoWeb) {
    const f = path.join(K, 'web/foto', fotoWeb[1]);
    return fs.existsSync(f) ? kirim(200, fs.readFileSync(f), { 'Content-Type': 'image/png', 'Cache-Control': 'private, max-age=60' }) : kirim(404, '');
  }
  if (u.pathname === '/sidik') return kirim(200, sidik(d), { 'Content-Type': 'text/plain' });
  if (u.pathname === '/drive-kirim' && req.method === 'GET') { res.writeHead(303, { Location: '/drive' }); return res.end(); }
  if (u.pathname === '/drive-kirim/status' && req.method === 'GET') return kirim(200, JSON.stringify({ tersambung: GD?.status(K).tersambung || false, nunggu: !!driveKode, pesan: drivePesan }), { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  if (u.pathname.startsWith('/drive-kirim/') && req.method === 'POST' && GD) {
    if (!asal || dariLuar) return kirim(403, tx('db.aksi.dariLuar'));
    let isi = '';
    req.on('data', (x) => { isi += x; if (isi.length > 4096) req.destroy(); });
    return req.on('end', async () => {
      const q = new URLSearchParams(isi);
      const a = Buffer.from(q.get('token') || ''); const b = Buffer.from(d.token);
      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return kirim(403, tx('db.aksi.kedaluwarsa'));
      try {
        if (u.pathname === '/drive-kirim/putus') { driveGenerasi++; driveKode = null; GD.putus(K); drivePesan = tx('db.kirim.diputus'); }
        else if (u.pathname === '/drive-kirim/sambung') {
          if (!driveKode && !driveMulai) {
            driveMulai = true;
            const generasi = driveGenerasi;
            try {
              const kode = await GD.mulai(K);
              if (generasi === driveGenerasi) {
              driveKode = kode; drivePesan = '';
              void GD.tunggu(K, kode, { batal: () => driveKode !== kode }).catch((e) => {
                if (driveKode === kode) drivePesan = e instanceof GD.DriveGagal ? e.message : tx('db.kirim.gakBisaSambung');
              }).finally(() => { if (driveKode === kode) driveKode = null; });
              }
            } finally { driveMulai = false; }
          }
        } else return kirim(404, tx('db.aksi.gakDikenal'));
      } catch (e) { drivePesan = e instanceof GD.DriveGagal ? e.message : tx('db.kirim.gakBisaSambung'); }
      res.writeHead(303, { Location: '/drive' }); res.end();
    });
  }
  if (u.pathname === '/fal' && req.method === 'GET') {
    const pesan = u.searchParams.get('pesan') ? { ok: u.searchParams.get('ok') === '1', teks: FL?.pesanAman(K, u.searchParams.get('pesan').slice(0, 500)) || tx('db.fal.alatBelum') } : null;
    const tampil = (katalog) => kirim(200, halaman(d, { judul: tx('db.fal.judul'), aktif: 'lainnya', isi: FL ? FL.pesanAman(K, halFal(d, pesan, katalog)) : halFal(d, pesan) }));
    if (!FL || !FL.ekorKunci(K)) return tampil(null);
    return FL.modelHarian(K).then(tampil).catch((e) => tampil({ gagal: e instanceof FL.FalGagal ? tl(e.message) : tx('db.fal.gagalModel') }));
  }
  if (u.pathname === '/fal/hasil' && req.method === 'GET' && FL) {
    const m = FL.mediaAman(K, u.searchParams.get('file') || '');
    if (!m) return kirim(404, tx('db.fal.hasilGakAda'), { 'Content-Type': 'text/plain' });
    res.writeHead(200, { ...HEADER, 'Content-Type': m.mime, 'Content-Length': fs.statSync(m.abs).size, 'Cache-Control': 'no-store', ...(u.searchParams.get('unduh') === '1' ? { 'Content-Disposition': `attachment; filename="${path.basename(m.abs).replace(/[^a-z0-9_.-]/gi, '_')}"` } : {}) });
    return fs.createReadStream(m.abs).pipe(res);
  }
  if (u.pathname === '/sosmed' && req.method !== 'POST') {
    const pesan = u.searchParams.get('pesan') ? { ok: u.searchParams.get('ok') === '1', teks: u.searchParams.get('pesan').slice(0, 400) } : null;
    return kirim(200, halaman(d, { judul: tx('db.sosmed.jejak'), aktif: 'lainnya', isi: halSosmed(d, pesan) }));
  }
  if (u.pathname === '/konten' && req.method !== 'POST' && d.konten) {
    const pesan = u.searchParams.get('pesan') ? { ok: u.searchParams.get('ok') === '1', teks: u.searchParams.get('pesan').slice(0, 500) } : null;
    return kirim(200, halaman(d, { judul: tx('db.nav.konten'), aktif: 'konten', isi: halKonten(d, pesan) }));
  }
  const vidRz = u.pathname.match(/^\/sosmed\/video\/([a-z0-9][a-z0-9_-]{0,80})\/(\d{1,2})$/i);
  if (vidRz && RZ && ['GET', 'HEAD'].includes(req.method)) {
    const m = RZ.periksa(K, vidRz[1]).media?.[Number(vidRz[2]) - 1];
    if (!m?.video) return kirim(404, '');
    const r = rentang(req.headers.range, m.ukuran);
    const kepala = { ...HEADER, 'Content-Type': m.mime, 'Accept-Ranges': 'bytes', 'Cache-Control': 'private, max-age=0, must-revalidate' };
    if (!r) { res.writeHead(416, { ...kepala, 'Content-Range': `bytes */${m.ukuran}` }); return res.end(); }
    if (r.status === 206) kepala['Content-Range'] = `bytes ${r.awal}-${r.akhir}/${m.ukuran}`;
    kepala['Content-Length'] = String(Math.max(0, r.akhir - r.awal + 1));
    res.writeHead(r.status, kepala);
    if (req.method === 'HEAD' || !m.ukuran) return res.end();
    const strim = fs.createReadStream(m.abs, { start: r.awal, end: r.akhir });
    strim.on('error', () => res.destroy()); res.on('close', () => strim.destroy()); return strim.pipe(res);
  }
  const mediaRz = u.pathname.match(/^\/sosmed\/media\/([a-z0-9][a-z0-9_-]{0,80})\/(\d{1,2})$/i);
  if (mediaRz && RZ) {
    const m = RZ.periksa(K, mediaRz[1]).media?.[Number(mediaRz[2]) - 1];
    if (!m || m.video) return kirim(404, '');
    return kirim(200, fs.readFileSync(m.abs), { 'Content-Type': m.mime, 'Cache-Control': 'private, max-age=300' });
  }
  if (u.pathname === '/update/status') return kirim(200, JSON.stringify({ tahap: keadaanUpdate().tahap }), { 'Content-Type': 'application/json' });
  if (u.pathname === '/update' && req.method !== 'POST') {
    const st = keadaanUpdate();
    if (st.tahap === 'kosong') { res.writeHead(303, { Location: '/lainnya#akun' }); return res.end(); }
    return kirim(200, halaman(d, { judul: tx('db.update.judul'), aktif: 'lainnya', isi: halUpdate(st) }));
  }
  if (u.pathname === '/data.json' || u.pathname === '/kantor/data') {
    let laporan = [];
    try { laporan = fs.readdirSync(path.join(K, 'hasil')).filter((f) => f.startsWith(`laporan-${hariIni()}-`)); } catch { /* belum ada laporan */ }
    const kejadian = kejadianKantor(d, { laporan, update: keadaanUpdate(), ulangTahun: bacaSetelanKantor(K).ulangTahun, tanggal: hariIni() });
    return kirim(200, JSON.stringify({ ...dataKantor(d), hidup: d.hidup, kejadian }), { 'Content-Type': 'application/json' });
  }
  const hasilTask = u.pathname.match(/^\/task\/([^/]+)\/hasil\/(\d+)$/);
  if (hasilTask && ['GET', 'HEAD'].includes(req.method)) {
    let f; try { f = cariTask(decodeURIComponent(hasilTask[1])); } catch { return kirim(404, ''); }
    const t = f && d.task.find((x) => x.f === f);
    const h = t?.hasil[Number(hasilTask[2])];
    const b = h?.rel && berkasAman(K, h.rel);
    if (!b?.stat.isFile()) return kirim(404, '');
    let fd;
    try { fd = fs.openSync(b.abs, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW); } catch { return kirim(404, ''); }
    const stat = fs.fstatSync(fd);
    if (stat.ino !== b.stat.ino || stat.dev !== b.stat.dev) { fs.closeSync(fd); return kirim(404, ''); }
    const etag = `"${stat.size}-${stat.mtimeMs}"`;
    const headers = { ...HEADER, 'Content-Type': h.mime, 'X-Content-Type-Options': 'nosniff',
      'Content-Disposition': `${h.jenis === 'dokumen' ? 'attachment' : 'inline'}; filename="${h.nama.replace(/[^a-z0-9_.-]/gi, '_')}"`,
      'Accept-Ranges': 'bytes', ETag: etag, 'Cache-Control': 'private, max-age=0, must-revalidate' };
    if (req.headers['if-none-match'] === etag) { fs.closeSync(fd); res.writeHead(304, headers); return res.end(); }
    const r = rentang(!req.headers['if-range'] || req.headers['if-range'] === etag ? req.headers.range : '', stat.size);
    if (!r) { fs.closeSync(fd); res.writeHead(416, { ...headers, 'Content-Range': `bytes */${stat.size}` }); return res.end(); }
    if (r.status === 206) headers['Content-Range'] = `bytes ${r.awal}-${r.akhir}/${stat.size}`;
    headers['Content-Length'] = String(Math.max(0, r.akhir - r.awal + 1));
    res.writeHead(r.status, headers);
    if (req.method === 'HEAD' || !stat.size) { fs.closeSync(fd); return res.end(); }
    const stream = fs.createReadStream(b.abs, { fd, autoClose: true, start: r.awal, end: r.akhir });
    stream.on('error', () => res.destroy()); res.on('close', () => stream.destroy()); return stream.pipe(res);
  }
  const frag = u.pathname.match(/^\/fragmen\/task\/(.+)$/);
  const penuh = u.pathname.match(/^\/task\/(.+)$/);
  if (frag || penuh) {
    let f = '';
    try { f = cariTask(decodeURIComponent((frag || penuh)[1])); } catch { f = null; }
    const t = f && d.task.find((x) => x.f === f);
    if (frag) return t ? kirim(200, isiTask(t, d, { drawer: true })) : kirim(404, `<div class="kepala-dr"><div class="kepala-teks"><h2 id="judul-drawer">${tx('db.isi.gakKetemu')}</h2><p class="redup">${tx('db.isi.gantiNama')}</p></div><button class="tutup" type="button" data-tutup aria-label="${tx('db.umum.tutup')}">×</button></div>`);
    return t ? kirim(200, halaman(d, { judul: t.judul, aktif: 'task', isi: `<div data-segar="detail">${isiTask(t, d)}</div>` }))
      : kirim(404, halaman(d, { judul: tx('db.umum.gakAda'), aktif: 'task', isi: `<section class="panel">${kosong(tx('db.isi.gakKetemuTitik'), tx('db.isi.gantiNama'), `<a class="tombol" href="/task">${tx('db.isi.keDaftar')}</a>`)}</section>` }));
  }
  if ((u.pathname === '/web/terbitkan' || u.pathname === '/web/balik') && req.method === 'POST') {
    if (dariLuar) return kirim(403, halaman(d, { judul: tx('db.aturan.ditolak'), aktif: 'lainnya', isi: `<section class="panel">${kosong(tx('db.aksi.dariLuar'), '')}</section>` }));
    const perintah = u.pathname.endsWith('terbitkan') ? 'terbitkan' : 'balik';
    return execFile(process.execPath, [path.join(K, 'alat/web.mjs'), perintah], { cwd: K, timeout: 60000, env: { ...process.env, KANTOR: K } }, (err, out = '', galat = '') => {
      const teks = `${out}\n${galat}`.split('\n').map((x) => x.trim()).filter(Boolean).filter((x) => /^[✅❌]/.test(x)).slice(-1)[0] || (err ? tx('db.aksi.gagalCoba') : tx('db.aksi.beres'));
      res.writeHead(303, { Location: `/web?ok=${err ? 0 : 1}&pesan=${enc(tl(teks.replace(/^[✅❌]\s*/, '')))}` }); res.end();
      // Abis terbit: cek web yang tayang (gak nunggu).
      if (!err) execFile(process.execPath, [path.join(K, 'alat/web.mjs'), 'cek'], { cwd: K, timeout: 60000, env: { ...process.env, KANTOR: K } }, () => {});
    });
  }
  if (u.pathname === '/update' && req.method === 'POST') {
    // Ngejalanin program di server: wajib asal dashboard sendiri (Origin/Referer harus ada & cocok) + token form.
    const tolak = (teks) => kirim(403, halaman(d, { judul: tx('db.aturan.ditolak'), aktif: 'lainnya', isi: `<section class="panel">${kosong(teks, '', `<a class="tombol" href="/lainnya#akun">${tx('db.umum.balikLainnya')}</a>`)}</section>` }));
    if (!asal || dariLuar) return tolak(tx('db.aksi.dariLuar'));
    let isi = '';
    req.on('data', (x) => { isi += x; if (isi.length > 512) req.destroy(); });
    return req.on('end', () => {
      const a = Buffer.from(new URLSearchParams(isi).get('token') || '');
      const b = Buffer.from(d.token);
      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return tolak(tx('db.update.kedaluwarsa'));
      if (mulaiUpdate() === 'gak-ada') return tolak(tx('db.update.gakAdaSkrip', { perintah: tx('db.perintah.updateKit') }));
      res.writeHead(303, { Location: '/update' }); res.end();
    });
  }
  if (u.pathname.startsWith('/fal/') && req.method === 'POST' && FL) {
    const balik = (ok, teks) => { res.writeHead(303, { Location: `/fal?ok=${ok ? 1 : 0}&pesan=${enc(FL.pesanAman(K, tl(teks)).slice(0, 500))}` }); res.end(); };
    if (!asal || dariLuar) return kirim(403, tx('db.aksi.dariLuar'));
    let isi = '';
    req.on('data', (x) => { isi += x; if (isi.length > 4096) req.destroy(); });
    return req.on('end', async () => {
      const q = new URLSearchParams(isi);
      const a = Buffer.from(q.get('token') || ''); const b = Buffer.from(d.token);
      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return balik(false, tx('db.aksi.kedaluwarsa'));
      try {
        const aksi = u.pathname.slice('/fal/'.length);
        if (aksi === 'kunci') { FL.simpanKunci(K, (q.get('key') || '').trim()); return balik(true, tx('db.fal.kunciDisimpan')); }
        if (aksi === 'cek') { await FL.cekKunci(K); return balik(true, tx('db.fal.kunciOk')); }
        if (aksi === 'batas') { FL.simpanBatas(K, Number(q.get('batas'))); return balik(true, tx('db.fal.batasDisimpan')); }
        if (aksi === 'tolak') { FL.tolak(K, q.get('id'), q.get('sidik')); return balik(true, tx('db.fal.ditolak')); }
        if (aksi === 'setuju') {
          FL.catatSetuju(K, q.get('id'), q.get('sidik'));
          const h = await alatFal(q.get('id')); return balik(h.ok, h.pesan);
        }
        return balik(false, tx('db.aksi.gakDikenal'));
      } catch (e) { return balik(false, e instanceof FL.FalGagal ? tl(e.message) : tx('db.fal.gagalSimpan')); }
    });
  }
  if (u.pathname.startsWith('/sosmed/') && req.method === 'POST' && RZ) {
    // Semua aksi sosmed ngubah sesuatu di luar (akun sosmed owner / kunci): asal dashboard + token form wajib.
    const balik = (ok, teks) => { res.writeHead(303, { Location: `/sosmed?ok=${ok ? 1 : 0}&pesan=${enc(teks)}` }); res.end(); };
    if (!asal || dariLuar) return kirim(403, halaman(d, { judul: tx('db.aturan.ditolak'), aktif: 'lainnya', isi: `<section class="panel">${kosong(tx('db.aksi.dariLuar'), '')}</section>` }));
    let isi = '';
    req.on('data', (x) => { isi += x; if (isi.length > 4096) req.destroy(); });
    return req.on('end', async () => {
      const q = new URLSearchParams(isi);
      const a = Buffer.from(q.get('token') || ''); const b = Buffer.from(d.token);
      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return balik(false, tx('db.aksi.kedaluwarsaUlang'));
      const id = (q.get('id') || '').trim();
      const idSah = /^[a-z0-9][a-z0-9_-]{0,80}$/i.test(id);
      const aksi = u.pathname.slice('/sosmed/'.length);
      try {
        if (aksi === 'kunci') {
          const kunci = { access: (q.get('access') || '').trim(), secret: (q.get('secret') || '').trim() };
          if (!kunci.access || !kunci.secret) return balik(false, tx('db.sosmed.kunciWajib'));
          const akun = await RZ.daftarAkun(RZ.klien(kunci));
          RZ.tulisJson(RZ.jalur(K).kunci, { ...kunci, disimpen: new Date().toISOString() }, 0o600);
          RZ.tulisJson(RZ.jalur(K).akun, { waktu: new Date().toISOString(), akun });
          jadwalkanTertunda();
          return balik(true, txn('db.sosmed.nyambungOk', akun.filter((x) => x.nyambung).length));
        }
        if (aksi === 'putus') {
          fs.rmSync(RZ.jalur(K).kunci, { force: true }); fs.rmSync(RZ.jalur(K).akun, { force: true });
          return balik(true, tx('db.sosmed.diputus'));
        }
        if (aksi === 'segarkan') {
          const h = await alatRepliz(['status'], 60000);
          return balik(h.ok, h.ok ? tx('db.sosmed.akunDiperbarui') : barisAlat(h.teks.at(-1) || tx('db.aksi.gagal'), /^❌\s*/));
        }
        if (aksi === 'performa') {
          const h = await alatRepliz(['performa'], 300000);
          return balik(h.ok, h.ok ? tx('db.sosmed.performaDiperbarui') : barisAlat(h.teks.at(-1) || tx('db.aksi.gagal'), /^❌\s*/));
        }
        if (!idSah) return balik(false, tx('db.aksi.rencanaGakAda'));
        if (aksi === 'setuju') {
          const p = RZ.periksa(K, id, akunRepliz());
          if (!p.r) return balik(false, tx('db.aksi.rencanaGakAda'));
          if (p.masalah.length) return balik(false, tx('db.aksi.belumBisa', { masalah: p.masalah.map(tl).join('; ') }));
          RZ.catatSetuju(K, id, p.sidik);
          const h = await alatRepliz(['jadwal', id], 180000);
          return balik(h.ok && !h.teks[0]?.startsWith('⚠️'), h.teks.map(barisAlat).join(' · ').replace(/(✅|⚠️|❌)\s*/g, '') || (h.ok ? tx('db.aksi.beres') : tx('db.aksi.gagalJadwal')));
        }
        if (aksi === 'tolak') {
          const p = RZ.periksa(K, id);
          if (!p.r) return balik(false, tx('db.aksi.rencanaGakAdaPendek'));
          RZ.tulisStatus(K, id, { status: 'ditolak', sidik: p.sidik, alasan: (q.get('alasan') || '').replace(/\s+/g, ' ').trim().slice(0, 300), waktu: new Date().toISOString() });
          return balik(true, tx('db.sosmed.ditolakOk'));
        }
        if (aksi === 'batal') {
          const h = await alatRepliz(['batal', id], 60000);
          return balik(h.ok, barisAlat(h.teks.at(-1) || '') || tx('db.aksi.selesai'));
        }
        return balik(false, tx('db.aksi.gakDikenal'));
      } catch (e) { return balik(false, tl(e.message) || tx('db.aksi.gagalTitik')); }
    });
  }
  if (u.pathname.startsWith('/konten/') && req.method === 'POST' && RZ) {
    // Sama kayak aksi /sosmed/*: ngubah sesuatu di luar (jadwal ke akun sosmed owner), jadi asal dashboard + token form wajib.
    const balik = (ok, teks) => { res.writeHead(303, { Location: `/konten?ok=${ok ? 1 : 0}&pesan=${enc(teks)}` }); res.end(); };
    if (!asal || dariLuar) return kirim(403, halaman(d, { judul: tx('db.aturan.ditolak'), aktif: 'konten', isi: `<section class="panel">${kosong(tx('db.aksi.dariLuar'), '')}</section>` }));
    let isi = '';
    req.on('data', (x) => { isi += x; if (isi.length > (u.pathname.startsWith('/konten/pesan-') ? 32768 : 4096)) req.destroy(); });
    return req.on('end', async () => {
      const q = new URLSearchParams(isi);
      const a = Buffer.from(q.get('token') || ''); const b = Buffer.from(d.token);
      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return balik(false, tx('db.aksi.kedaluwarsaUlang'));
      try { const h = await aksiKonten(d, u.pathname.slice('/konten/'.length), q); return balik(h.ok, h.teks); } catch (e) { return balik(false, tl(e.message) || tx('db.aksi.gagalTitik')); }
    });
  }
  if (u.pathname === '/drive/cek' && req.method === 'POST') {
    if (dariLuar) return kirim(403, halaman(d, { judul: tx('db.aturan.ditolak'), aktif: 'lainnya', isi: `<section class="panel">${kosong(tx('db.aksi.dariLuar'), '')}</section>` }));
    cekKonektorDrive();
    res.writeHead(303, { Location: '/drive' }); return res.end();
  }
  if (u.pathname === '/jawab' && req.method === 'POST') {
    const lewatApp = req.headers['x-dari'] === 'app';
    const balas = (ok, pesan, kode = ok ? 200 : 400, ke = '/') => (lewatApp
      ? kirim(kode, JSON.stringify({ ok, pesan }), { 'Content-Type': 'application/json' })
      : ok ? (res.writeHead(303, { Location: ke }), res.end()) : kirim(kode, halaman(d, { judul: tx('db.aksi.gagal'), aktif: '', isi: `<section class="panel">${kosong(tx('db.jawab.gakKesimpen'), pesan, `<a class="tombol" href="/">${tx('db.jawab.balikRingkasan')}</a>`)}</section>` })));
    if (dariLuar) return balas(false, tx('db.aksi.dariLuar'), 403);
    let isi = '';
    req.on('data', (x) => { isi += x; if (isi.length > 4096) req.destroy(); });
    return req.on('end', () => {
      const q = new URLSearchParams(isi);
      const f = cariTask(q.get('f') || '');
      const t = f && d.task.find((x) => x.f === f);
      if (!t) return balas(false, tx('db.jawab.taskGakAda'), 404);
      const m = d.manajer.find((x) => x.id === t.pegang);
      if (t.statusFile !== 'nunggu-kamu') return balas(false, tx('db.jawab.gakNunggu'), 409);
      if (t.proses?.k === 'jalan') return balas(false, tx('db.jawab.lagiNyatet', { nama: m?.nama || tx('db.umum.tim') }), 409);
      let jawaban = [];
      if (q.get('saran') === 'semua') {
        jawaban = t.soal.map((x) => [x, x.opsi.find((o) => o.rek)]).filter(([, o]) => o).map(([x, o]) => ({ nomor: x.nomor, huruf: o.huruf, teks: o.teks }));
      } else if (q.get('nomor')) {
        const x = t.soal.find((y) => y.nomor === q.get('nomor'));
        const o = x?.opsi.find((y) => y.huruf === q.get('huruf'));
        const teks = (q.get('teks') || '').replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 400);
        if (o) jawaban = [{ nomor: x.nomor, huruf: o.huruf, teks: o.teks }];
        else if (x && !x.opsi.length && teks) jawaban = [{ nomor: x.nomor, huruf: '', teks }];
      } else {
        const teks = (q.get('teks') || '').replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 400);
        if (teks) jawaban = [{ nomor: '', huruf: '', teks }];
      }
      if (!jawaban.length) return balas(false, tx('db.jawab.gakKebaca'));
      try { tulisJawaban(t.f, jawaban); } catch (e) { return balas(false, tx('db.jawab.gagalNulis', { pesan: e.message }), 500); }
      const singkat = jawaban.map((j) => (j.nomor ? `${j.nomor}${j.huruf}` : tx('db.jawab.jawabanKamu'))).join(', ');
      const baru = bacaTask().find((x) => x.f === t.f);
      if (!baru?.terjawab) return balas(true, tx('db.jawab.sebagian', { singkat }), 200, `/task/${enc(t.f)}`);
      const nama = m?.nama || tx('db.umum.tim');
      return balas(true, bangunin(t.pegang, t.divisi) ? tx('db.jawab.mulai', { singkat, nama }) : tx('db.jawab.ngobrol', { singkat, nama }), 200, `/task/${enc(t.f)}`);
    });
  }
  if (u.pathname === '/tampilan' && req.method === 'POST') {
    // Nilai harus salah satu PILIHAN / OWNER.
    if (dariLuar) return kirim(403, halaman(d, { judul: tx('db.aturan.ditolak'), aktif: 'lainnya', isi: `<section class="panel">${kosong(tx('db.aksi.dariLuar'), '')}</section>` }));
    let isi = '';
    req.on('data', (x) => { isi += x; if (isi.length > 512) req.destroy(); });
    return req.on('end', () => {
      const q = new URLSearchParams(isi);
      const baru = { ...setelan() };
      if (q.has('hidup')) {
        if (!asal || q.get('token') !== d.token) return kirim(403, tx('db.aksi.kedaluwarsaUlang'));
        if (!['nyala', 'mati'].includes(q.get('hidup')) || !Object.hasOwn(Hidup.TINGKAT, q.get('keramaian'))) return kirim(400, tx('db.hidup.ket'));
        baru.hidup = Hidup.setelan({ nyala: q.get('hidup') === 'nyala', ramai: q.get('keramaian') });
      }
      if (KODE_PILIHAN.includes(q.get('tampilan'))) baru.tampilan = q.get('tampilan');
      if (KODE_TEMA.includes(q.get('tema'))) baru.tema = q.get('tema');
      if (KODE_OWNER.includes(q.get('owner'))) baru.owner = q.get('owner');
      if (q.has('kota')) baru.lokasi = Shalat.lokasi(q.get('kota') === 'manual'
        ? { nama: q.get('lokasi-nama'), lintang: q.get('lintang')?.trim() ? Number(q.get('lintang')) : null, bujur: q.get('bujur')?.trim() ? Number(q.get('bujur')) : null, zona: q.get('zona') }
        : Shalat.KOTA.find((k) => k.nama === q.get('kota')));
      fs.writeFileSync(path.join(SINI, 'tampilan.json'), `${JSON.stringify(baru, null, 1)}\n`);
      res.writeHead(303, { Location: baru.tampilan === 'papan' ? '/' : '/kantor' }); res.end();
    });
  }
  if (u.pathname === '/bahasa' && req.method === 'POST') {
    // Ganti bahasa (KD-121): asal dashboard + token form, kayak aksi lain yang ngubah setelan kantor.
    if (!asal || dariLuar) return kirim(403, halaman(d, { judul: tx('db.aturan.ditolak'), aktif: 'lainnya', isi: `<section class="panel">${kosong(tx('db.aksi.dariLuar'), '')}</section>` }));
    let isi = '';
    req.on('data', (x) => { isi += x; if (isi.length > 512) req.destroy(); });
    return req.on('end', () => {
      const q = new URLSearchParams(isi);
      const a = Buffer.from(q.get('token') || ''); const b = Buffer.from(d.token);
      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return kirim(403, halaman(d, { judul: tx('db.aturan.ditolak'), aktif: 'lainnya', isi: `<section class="panel">${kosong(tx('db.aksi.kedaluwarsaUlang'), '', `<a class="tombol" href="/lainnya#bahasa">${tx('db.umum.balikLainnya')}</a>`)}</section>` }));
      if (!KODE_BAHASA.includes(q.get('bahasa'))) { res.writeHead(303, { Location: '/lainnya#bahasa' }); return res.end(); }
      try { simpanBahasa(K, q.get('bahasa')); } catch (e) { return kirim(500, halaman(d, { judul: tx('db.aksi.gagal'), aktif: 'lainnya', isi: `<section class="panel">${kosong(tx('db.bahasa.gagal'), e.message, `<a class="tombol" href="/lainnya#bahasa">${tx('db.umum.balikLainnya')}</a>`)}</section>` })); }
      res.writeHead(303, { Location: '/lainnya?bahasa=diganti#bahasa' }); return res.end();
    });
  }
  return kirim(404, halaman(d, { judul: tx('db.umum.gakAda'), aktif: '', isi: `<section class="panel">${kosong(tx('db.umum.halamanGakAda'), '', `<a class="tombol" href="/">${tx('db.umum.keRingkasan')}</a>`)}</section>` }));
}).listen(PORT, '127.0.0.1', () => console.log(`dashboard di 127.0.0.1:${PORT}`));
mulaiSitus(K);
