import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
export const kantor = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function pathAman(file, root = kantor, {baca = []} = {}) {
  const tujuan = path.resolve(root, file);
  const rel = path.relative(root, tujuan);
  const bagianJalur = rel.split(path.sep);
  if (path.isAbsolute(rel) || bagianJalur.length < 2 || bagianJalur[0] === '..' || !['konten', 'hasil', 'video', ...baca].includes(bagianJalur[0])) throw new Error('Jalur harus di konten/, hasil/, atau video/ kantor kamu');
  let kini = root;
  for (const bagian of rel.split(path.sep)) {
    kini = path.join(kini, bagian);
    try { if (fs.lstatSync(kini).isSymbolicLink()) throw new Error('Jalur symlink tidak boleh dipakai'); }
    catch (e) { if (e.code !== 'ENOENT') throw e; }
  }
  return tujuan;
}
export function fotoChatAman(file) {
  try {
    const uid = process.getuid();
    const root = `/tmp/claude-${uid}`;
    const rel = file.startsWith(`${root}/`) ? file.slice(root.length + 1) : '';
    const bagian = rel.split('/');
    if (bagian.length !== 4 || bagian.some(b => !b || b === '.' || b === '..') || bagian[2] !== 'images' || !/^[^/]+\.(png|jpe?g|webp)$/.test(bagian[3]) || path.resolve(file) !== file) throw new Error('Jalur foto chat tidak diizinkan');
    let kini = root, stat = fs.lstatSync(root);
    if (stat.isSymbolicLink()) throw new Error('Jalur symlink tidak boleh dipakai');
    for (const b of bagian) {
      kini = path.join(kini, b); stat = fs.lstatSync(kini);
      if (stat.isSymbolicLink()) throw new Error('Jalur symlink tidak boleh dipakai');
    }
    const nyata = fs.realpathSync(file);
    if (!nyata.startsWith(`${root}/`)) throw new Error('Foto chat harus tetap di folder Claude kamu');
    if (!stat.isFile() || stat.uid !== uid) throw new Error('Foto chat harus berkas biasa milik user kamu');
    if (stat.nlink > 1) throw new Error('Foto chat tidak boleh punya hardlink');
    if (stat.size > 32 << 20) throw new Error('Foto terlalu besar');
    const awal = fs.readFileSync(file).subarray(0, 12);
    const png = awal.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'));
    const jpg = awal.subarray(0, 3).equals(Buffer.from('ffd8ff', 'hex'));
    const webp = awal.subarray(0, 4).toString() === 'RIFF' && awal.subarray(8, 12).toString() === 'WEBP';
    if (!png && !jpg && !webp) throw new Error('Isi foto chat harus gambar PNG, JPG, atau WebP');
    return file;
  } catch (e) {
    if (e.code === 'ENOENT') throw new Error('Foto chat sudah tidak ada. Kirim ulang foto kamu lalu coba lagi.');
    throw e;
  }
}
export function ffmpeg(args, {root = kantor, binary = 'ffmpeg', ...opsi} = {}) {
  const cli = path.join(root, 'video/node_modules/.bin/remotion');
  const hasil = spawnSync(cli, [binary, ...args], {stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', timeout: 600000, maxBuffer: 64 << 20, ...opsi});
  if (hasil.error || hasil.status !== 0) throw new Error(`Aku belum bisa mengolah media: ${hasil.error?.message || hasil.stderr?.slice(-1200)}`);
  return hasil;
}
export const utama = (url) => process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(url);
