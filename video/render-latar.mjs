// Render di latar (di luar detak): npm run render -- <Komposisi> <keluaran.mp4> --latar
// Render panjang di VPS kecil bisa lebih dari 20 menit, jadi ia jalan sebagai proses terpisah (detached, kayak nohup) dan
// menulis status ke catatan/render-latar/<nama>.json. Detak cukup membaca status itu: npm run status-latar.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
const proyek = path.dirname(fileURLToPath(import.meta.url));
export const folderStatus = (folderProyek = proyek) => path.join(path.dirname(folderProyek), 'catatan', 'render-latar');
const hidup = (pid) => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; } };
export function tulisStatus(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, file);
}
// Status 'jalan'/'mulai' dengan proses yang sudah mati dianggap gagal (VPS restart, kehabisan RAM).
export function bacaStatus(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (['mulai', 'jalan'].includes(data.status) && !hidup(data.pid)) return { ...data, status: 'gagal', pesan: 'Prosesnya berhenti sebelum selesai (VPS restart atau RAM habis). Kamu bisa mulai lagi.' };
  return data;
}
export function semuaStatus(folderProyek = proyek) {
  const folder = folderStatus(folderProyek);
  if (!fs.existsSync(folder)) return [];
  return fs.readdirSync(folder).filter((f) => f.endsWith('.json')).sort().map((f) => ({ nama: f.slice(0, -5), ...bacaStatus(path.join(folder, f)) }));
}
export function mulaiLatar({ komposisi, keluaran, args, hapus = '-' }, folderProyek = proyek) {
  const aktif = semuaStatus(folderProyek).find((s) => ['mulai', 'jalan'].includes(s.status));
  if (aktif) throw new Error(`Masih ada render latar yang jalan (${aktif.komposisi}, ${aktif.persen ?? 0}%). Aku tunggu sampai selesai dulu, VPS kecil cuma kuat satu render.`);
  const nama = path.basename(keluaran, path.extname(keluaran));
  const status = path.join(folderStatus(folderProyek), `${nama}.json`), log = status.replace(/\.json$/, '.log');
  fs.mkdirSync(path.dirname(status), { recursive: true });
  const fd = fs.openSync(log, 'w');
  const anak = spawn(process.execPath, [fileURLToPath(import.meta.url), 'kerja', status, hapus, ...args], { cwd: folderProyek, detached: true, stdio: ['ignore', fd, fd] });
  anak.unref();
  tulisStatus(status, { status: 'mulai', komposisi, keluaran, pid: anak.pid, mulai: new Date().toISOString(), persen: 0 });
  return { status, log, pid: anak.pid };
}
function kerja(status, hapus, args) {
  const awal = JSON.parse(fs.readFileSync(status, 'utf8')), t0 = Date.now();
  let data = { ...awal, status: 'jalan', pid: process.pid, persen: 0 }, terakhir = 0, sisa = '';
  tulisStatus(status, data);
  const anak = spawn(path.join(proyek, 'node_modules/.bin/remotion'), args, { cwd: proyek, stdio: ['ignore', 'pipe', 'pipe'] });
  const baca = (potong) => {
    process.stdout.write(potong);
    sisa = (sisa + potong).slice(-400);
    const cocok = [...sisa.matchAll(/(Rendered|Encoded) (\d+)\/(\d+)/g)].pop();
    if (!cocok) return;
    const bagian = Number(cocok[2]) / Math.max(1, Number(cocok[3]));
    const persen = Math.min(99, Math.round(cocok[1] === 'Rendered' ? bagian * 90 : 90 + bagian * 9));
    if (persen >= data.persen && Date.now() - terakhir > 3000) { terakhir = Date.now(); data = { ...data, persen, diperbarui: new Date().toISOString() }; tulisStatus(status, data); }
  };
  anak.stdout.on('data', (d) => baca(String(d)));
  anak.stderr.on('data', (d) => baca(String(d)));
  const selesai = (kode, galat) => {
    if (hapus !== '-') try { fs.unlinkSync(hapus); } catch { /* props sementara sudah hilang */ }
    const detik = Math.round((Date.now() - t0) / 1000);
    tulisStatus(status, kode === 0
      ? { ...data, status: 'selesai', persen: 100, selesai: new Date().toISOString(), detik }
      : { ...data, status: 'gagal', selesai: new Date().toISOString(), detik, pesan: galat || `Render berhenti dengan kode ${kode}. Cek log di ${path.basename(status).replace(/\.json$/, '.log')}.` });
    process.exit(kode === 0 ? 0 : 1);
  };
  anak.on('error', (e) => selesai(1, e.message));
  anak.on('close', (kode) => selesai(kode ?? 1));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [aksi, ...sisa] = process.argv.slice(2);
  if (aksi === 'kerja') kerja(sisa[0], sisa[1], sisa.slice(2));
  else if (aksi === 'status' || aksi === undefined) {
    const nama = sisa[0], semua = semuaStatus().filter((s) => !nama || s.nama === nama);
    console.log(semua.length ? JSON.stringify(semua, null, 2) : 'Belum ada render latar.');
  } else { console.error('Pakai: npm run status-latar'); process.exitCode = 1; }
}
