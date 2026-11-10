import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';

const filterSistem = ['freezedetect', 'select', 'showinfo', 'tile', 'fps', 'loudnorm', 'scale', 'format'];
const filterRemotion = ['scale', 'format', 'loudnorm'];
export function binerRemotion(proyek) {
  const require = createRequire(path.join(proyek, 'package.json'));
  const libc = process.report.getReport().header.glibcVersionRuntime ? 'gnu' : 'musl';
  try {
    const dir = path.dirname(require.resolve(`@remotion/compositor-${process.platform}-${process.arch}-${libc}/package.json`));
    return {bin: path.join(dir, 'ffmpeg'), probe: path.join(dir, 'ffprobe'), env: {...process.env, LD_LIBRARY_PATH: dir}};
  } catch { return null; }
}
export function jalurQc(proyek, paksa = process.env.CEK_HASIL_JALUR, panggil = spawnSync) {
  if (paksa && !['sistem', 'remotion'].includes(paksa)) throw new Error('CEK_HASIL_JALUR harus sistem atau remotion');
  const remotion = binerRemotion(proyek);
  for (const jalur of paksa ? [paksa] : ['sistem', 'remotion']) {
    if (jalur === 'remotion' && !remotion) continue;
    const bin = jalur === 'sistem' ? 'ffmpeg' : remotion.bin;
    const env = jalur === 'sistem' ? process.env : remotion.env;
    const r = panggil(bin, ['-hide_banner', '-filters'], {env, encoding: 'utf8', timeout: 10000});
    if (r.status === 0 && (jalur === 'sistem' ? filterSistem : filterRemotion).every(f => new RegExp(`\\b${f}\\s`).test(r.stdout))) return {jalur, bin, env, probe: jalur === 'sistem' ? 'ffprobe' : remotion.probe};
  }
  return null;
}
export function buatRun(proyek, paksa = process.env.CEK_HASIL_JALUR) {
  const pilihan = jalurQc(proyek, paksa);
  const remotion = binerRemotion(proyek);
  const run = ([cmd, ...args], opsi = {}) => {
    const alat = cmd === 'ffprobe' ? (pilihan || remotion) : pilihan;
    if (!alat) return {status: null, error: Object.assign(new Error('ffmpeg tidak tersedia'), {code: 'ENOENT'})};
    return spawnSync(cmd === 'ffprobe' ? alat.probe : alat.bin, args, {cwd: proyek, env: alat.env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 600000, maxBuffer: 4 << 20, ...opsi});
  };
  run.jalur = pilihan?.jalur;
  run.alat = pilihan;
  return run;
}
