import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {berkasKantor, durasiAudio, kalimatBerwaktu, kataTerucap, MIME_AUDIO} from '../alat/fal-suara.mjs';
export function siapkanVo(props, folderProyek) {
  const K = path.dirname(folderProyek), data = structuredClone(props);
  const sumber = (file, ext) => {
    if (typeof file !== 'string') throw new Error('Kamu bisa isi jalur aset lokal di props video.');
    const diKantor = file.startsWith('konten/fal/');
    const abs = berkasKantor(K, diKantor ? file : path.join('video/public', file.replace(/^public\//, '')), ext);
    const publik = path.join(fs.realpathSync(K), 'video/public');
    const fal = path.join(fs.realpathSync(K), 'konten/fal');
    if (!abs.startsWith(`${diKantor ? fal : publik}${path.sep}`)) throw new Error('Aset VO harus di public/ atau konten/fal/, tanpa symlink keluar.');
    return {abs, diKantor};
  };
  if (data.vo) {
    const {abs, diKantor} = sumber(data.vo, Object.keys(MIME_AUDIO));
    if (diKantor) {
      const folder = path.join(folderProyek, 'public/fal'); fs.mkdirSync(folder, {recursive: true});
      if (fs.realpathSync(folder) !== path.join(fs.realpathSync(K), 'video/public/fal')) throw new Error('Folder VO gak aman.');
      const hash = crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
      const nama = `${hash}${path.extname(abs)}`, target = path.join(folder, nama);
      if (!fs.existsSync(target)) fs.copyFileSync(abs, target, fs.constants.COPYFILE_EXCL);
      const nyata = fs.realpathSync(target);
      if (nyata !== target || crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex') !== hash) throw new Error('Salinan VO berubah. Kamu bisa cek asetnya dulu.');
      data.vo = `fal/${nama}`;
    } else data.vo = path.relative(path.join(folderProyek, 'public'), abs).split(path.sep).join('/');
    if (data.voDurasi !== undefined && (!Number.isFinite(data.voDurasi) || data.voDurasi <= 0)) throw new Error('Durasi VO harus angka detik di atas nol.');
    if (data.voDurasi === undefined) {
      let ms;
      try {
        const catatan = fs.readFileSync(path.join(K, 'catatan/fal-biaya.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
        const hash = crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
        const r = catatan.findLast((r) => r.status === 'selesai' && r.sidikAudio === hash && ['duration_ms', 'ffprobe'].includes(r.durasi?.sumber));
        ms = r?.durasi?.detik * 1000;
      } catch { /* ffprobe bisa membaca aset yang belum masuk catatan fal. */ }
      const durasi = durasiAudio(K, abs, ms);
      if (durasi.sumber === 'estimasi-8kbps') throw new Error('Durasi VO belum terukur. Kamu bisa pakai ffprobe bawaan Remotion atau isi voDurasi setelah mengukur audio.');
      data.voDurasi = durasi.detik;
    }
  }
  if (typeof data.caption === 'string') {
    const {abs} = sumber(data.caption, ['.json']);
    const hasil = JSON.parse(fs.readFileSync(abs, 'utf8'));
    const kata = kataTerucap(hasil);
    const teks = data.naskah || kata.map((w) => w.text).join(' ');
    data.caption = kalimatBerwaktu(teks, kata);
  }
  if (data.caption !== undefined) {
    if (!Array.isArray(data.caption) || !data.caption.length || data.caption.some((c, i) => typeof c.kalimat !== 'string' || !c.kalimat.trim() || !Number.isFinite(c.mulai) || !Number.isFinite(c.akhir) || c.mulai < 0 || c.akhir <= c.mulai || (i > 0 && c.mulai < data.caption[i - 1].akhir) || (data.voDurasi && c.akhir > data.voDurasi + 0.1))) throw new Error('Kalimat caption dan waktu audio belum sesuai. Kamu bisa cek transkripnya dulu.');
    if (data.ikutiKalimat) {
      if (!data.vo || data.adegan?.length !== data.caption.length) throw new Error('Untuk mengikuti kalimat VO, jumlah adegan harus sama dengan jumlah kalimat caption.');
      data.adegan = data.adegan.map((a, i) => {
        const mulai = i === 0 ? 0 : Math.floor(data.caption[i].mulai * 30);
        const akhir = data.caption[i + 1] ? Math.floor(data.caption[i + 1].mulai * 30) : Math.ceil(data.voDurasi * 30);
        if (akhir <= mulai) throw new Error('Kalimat terlalu pendek untuk satu frame video. Kamu bisa menggabungkannya.');
        return {...a, mulai, frame: akhir - mulai};
      });
    }
  }
  return data;
}
export function siapkanArgumenVo(args, folderProyek) {
  const indeks = args.findLastIndex((a) => a.startsWith('--props='));
  if (indeks < 0) return {args, bersihkan: () => {}};
  const K = path.dirname(folderProyek);
  const file = berkasKantor(K, path.resolve(folderProyek, args[indeks].slice(8)), ['.json'], 4 << 20);
  const props = siapkanVo(JSON.parse(fs.readFileSync(file, 'utf8')), folderProyek);
  const folder = path.join(folderProyek, 'out'); fs.mkdirSync(folder, {recursive: true});
  if (fs.realpathSync(folder) !== path.join(fs.realpathSync(K), 'video/out')) throw new Error('Folder props gak aman.');
  const tmp = path.join(folder, `props-${crypto.randomBytes(8).toString('hex')}.json`);
  fs.writeFileSync(tmp, JSON.stringify(props), {flag: 'wx', mode: 0o600});
  const baru = [...args]; baru[indeks] = `--props=${tmp}`;
  return {args: baru, bersihkan: () => fs.unlinkSync(tmp)};
}
