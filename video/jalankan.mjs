import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import {siapkanArgumenVo} from './siapkan-vo.mjs';
const proyek = path.dirname(fileURLToPath(import.meta.url));
const diDalam = (folder, file) => {
  const rel = path.relative(folder, file);
  return rel !== '' && rel !== '..' && !rel.startsWith(`..${path.sep}`) && !path.isAbsolute(rel);
};
function lokasiNyata(file) {
  let ada = false;
  try { fs.lstatSync(file); ada = true; } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (ada) return fs.realpathSync(file); // Symlink putus ditolak juga.
  const induk = path.dirname(file);
  if (induk === file) throw new Error('Folder keluaran tidak ditemukan');
  return path.join(lokasiNyata(induk), path.basename(file));
}
export function keluaranAman(file, folderProyek = proyek) {
  const kantor = path.dirname(folderProyek);
  const target = path.resolve(folderProyek, file);
  const terlarang = (p) => p.split(path.sep).some((bagian) => ['.rahasia', 'setelan'].includes(bagian));
  const nyata = lokasiNyata(target);
  const akarNyata = fs.realpathSync(kantor);
  const folder = [path.join(kantor, 'hasil'), path.join(folderProyek, 'out')];
  const folderNyata = [path.join(akarNyata, 'hasil'), path.join(akarNyata, 'video/out')];
  if (terlarang(target) || terlarang(nyata) || !folder.some((dir) => diDalam(dir, target)) || !folderNyata.some((dir) => diDalam(dir, nyata))) {
    throw new Error('Kamu hanya bisa menyimpan keluaran di hasil/ atau video/out/, tanpa symlink ke folder lain');
  }
  return target;
}
export function argumenRender(argv, folderProyek = proyek) {
  const [mode, komposisi, pertama, kedua, ...opsi] = argv;
  const contoh = mode?.endsWith('-contoh');
  const aksi = contoh ? mode.slice(0, -7) : mode;
  if (!['render', 'still'].includes(aksi) || !/^[A-Za-z][A-Za-z0-9-]*$/.test(komposisi || '') || !pertama || (aksi === 'still' && !/^\d+$/.test(pertama))) {
    throw new Error('Pakai npm run render -- Komposisi keluaran.mp4 atau npm run still -- Komposisi frame keluaran.png');
  }
  // Render punya satu argumen keluaran; still punya frame dan keluaran.
  const tambahan = aksi === 'render' ? [kedua, ...opsi].filter((x) => x !== undefined) : opsi;
  if (tambahan.some((x) => !/^--(?:props=.+|scale=(?:\d+(?:\.\d+)?|\.\d+)|concurrency=[1-9]\d*)$/.test(x))) {
    throw new Error('Opsi tambahan hanya --props=berkas.json, --scale=angka, atau --concurrency=angka');
  }
  const output = keluaranAman(aksi === 'still' ? kedua || '' : pertama, folderProyek);
  if (path.extname(output).toLowerCase() !== (aksi === 'still' ? '.png' : '.mp4')) throw new Error('Keluaran harus PNG untuk still atau MP4 untuk render');
  let bawaan = { concurrency: 1, scale: 1 };
  const profil = path.join(folderProyek, 'render-default.json');
  if (fs.existsSync(profil)) bawaan = JSON.parse(fs.readFileSync(profil, 'utf8'));
  const args = [aksi, contoh ? 'contoh-explainer/index.tsx' : komposisi === 'ContohAffiliate' ? 'contoh-affiliate.tsx' : 'src/index.tsx', komposisi, output, `--concurrency=${bawaan.concurrency}`, `--scale=${bawaan.scale}`];
  if (aksi === 'still') args.push(`--frame=${pertama}`);
  return [...args, ...tambahan];
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const latar = process.argv.slice(2).includes('--latar');
    const args = argumenRender(process.argv.slice(2).filter((a) => a !== '--latar'));
    if (latar && args[0] !== 'render') throw new Error('--latar cuma untuk render video, bukan still');
    fs.mkdirSync(path.dirname(args[3]), {recursive: true});
    const siap = siapkanArgumenVo(args, proyek);
    if (latar) {
      // Render panjang jalan di proses terpisah supaya gak ikut mati bersama putaran detak. Status: npm run status-latar.
      const tmp = siap.args.find((a) => a.startsWith('--props='))?.slice(8);
      try {
        const {mulaiLatar} = await import('./render-latar.mjs');
        const {status} = mulaiLatar({komposisi: args[2], keluaran: path.relative(path.dirname(proyek), args[3]), args: siap.args, hapus: tmp ?? '-'}, proyek);
        console.log(`Render jalan di latar. Status ada di ${path.relative(path.dirname(proyek), status)}. Cek dengan: npm run status-latar`);
      } catch (error) { siap.bersihkan(); throw error; }
      process.exit(0);
    }
    let hasil;
    try { hasil = spawnSync(path.join(proyek, 'node_modules/.bin/remotion'), siap.args, { cwd: proyek, stdio: 'inherit' }); }
    finally { siap.bersihkan(); }
    if (hasil.error) console.error(`Aku belum bisa render: ${hasil.error.message}. Kamu jalanin installer video dulu.`);
    process.exitCode = hasil.status ?? 1;
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
