import fs from 'node:fs';
import path from 'node:path';
import {analisisFrame} from './qc-frame.mjs';
import {lembarRemotion} from './qc-lembar.mjs';
import {keluaranAman} from './jalankan.mjs';
export const PESAN_FFMPEG = 'ffmpeg belum terpasang, cek kualitas gerak & suara dilewati. Minta admin VPS jalanin: sudo apt-get install -y ffmpeg';
export const ffmpegTidakAda = (hasil) => hasil?.error?.code === 'ENOENT';
export function opsiQc(args) {
  const opsi = {beku: null, lembar: false};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--beku') {const n = Number(args[++i]); if (!Number.isFinite(n) || n <= 0) throw new Error('--beku perlu detik positif'); opsi.beku = n;}
    else if (args[i] === '--lembar') opsi.lembar = true;
    else throw new Error(`Opsi tidak dikenal: ${args[i]}`);
  }
  return opsi;
}
export async function qcTambahan(input, metadata, opsi, run, proyek) {
  const ambang = opsi.beku ?? 1;
  if (run.jalur === 'remotion') {
    const hasil = await analisisFrame({bin: run.alat.bin, libraryPath: run.alat.env.LD_LIBRARY_PATH}, input, metadata, ambang);
    return tambahLembar(hasil, input, metadata, opsi, run, proyek);
  }
  const analisis = run(['ffmpeg','-nostdin','-hide_banner','-nostats','-i',input,'-an','-vf',`freezedetect=n=-60dB:d=${ambang},select='gt(scene,0.32)',showinfo`,'-f','null','-']);
  if (ffmpegTidakAda(analisis)) return {ffmpegAda: false, peringatan: PESAN_FFMPEG};
  if (analisis.status !== 0 || analisis.error) throw new Error(`Analisis beku/cut gagal: ${analisis.error?.message || analisis.stderr?.slice(-500)}`);
  const log = `${analisis.stdout || ''}\n${analisis.stderr || ''}`;
  const beku = []; let mulai;
  for (const m of log.matchAll(/freeze_(start|end):\s*([\d.]+)/g)) {
    if (m[1] === 'start') mulai = Number(m[2]);
    else if (mulai !== undefined) {beku.push({mulai, akhir: Number(m[2]), durasi: Number(m[2]) - mulai}); mulai = undefined;}
  }
  if (mulai !== undefined) beku.push({mulai, akhir: metadata.durasi, durasi: metadata.durasi - mulai});
  const cutKeras = [...log.matchAll(/\[Parsed_showinfo[^\n]*\bn:\s*\d+[^\n]*pts_time:([\d.]+)/g)].map((m) => Number(m[1]));
  const hasil = {beku, ambangBeku: ambang, bekuWajar: beku.every((b) => b.durasi <= ambang + 1 / metadata.fps), cutKeras: cutKeras.length, waktuCut: cutKeras};
  return tambahLembar(hasil, input, metadata, opsi, run, proyek);
}
function tambahLembar(hasil, input, metadata, opsi, run, proyek) {
  if (opsi.lembar) {
    const dasar = input.slice(0,-4);
    const lembar = keluaranAman(`${dasar}-lembar.jpg`, proyek), kecil = keluaranAman(`${dasar}-360.mp4`, proyek);
    for (const f of [lembar,kecil]) if (fs.existsSync(f)) throw new Error(`Hasil QC sudah ada: ${path.basename(f)}. Pakai versi baru`);
    if (run.jalur === 'remotion') lembarRemotion(input, metadata, lembar, run);
    for (const args of [
      ...(run.jalur === 'remotion' ? [] : [['ffmpeg','-nostdin','-n','-i',input,'-vf',`fps=12/${metadata.durasi},scale=360:-2,tile=4x3`,'-frames:v','1',lembar]]),
      ['ffmpeg','-nostdin','-n','-i',input,'-vf','scale=360:-2','-c:v','libx264','-crf','25','-c:a','aac',kecil],
    ]) {
      const r = run(args); if (ffmpegTidakAda(r)) return {...hasil, ffmpegAda: false, peringatan: PESAN_FFMPEG}; if (r.error || r.status !== 0) throw new Error(`Lembar/versi 360 gagal: ${r.error?.message || r.stderr?.slice(-500)}`);
    }
    Object.assign(hasil,{lembar, versi360: kecil});
  }
  return hasil;
}
