import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {buatRun} from './qc-ffmpeg.mjs';
import {ffmpegTidakAda, opsiQc, PESAN_FFMPEG, qcTambahan} from './qc-tambahan.mjs';
import { keluaranAman } from './jalankan.mjs';
const proyek = path.dirname(fileURLToPath(import.meta.url));
export async function cekHasil(file, run, folderProyek = proyek, opsi = {}) {
  run ||= buatRun(folderProyek);
  const input = keluaranAman(path.resolve(file), folderProyek);
  if (path.extname(input).toLowerCase() !== '.mp4' || !fs.statSync(input).isFile()) throw new Error('Kamu pilih berkas MP4 hasil render');
  const probe = run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=codec_type,width,height,r_frame_rate', '-of', 'json', input]);
  if (probe.status !== 0) throw new Error('Aku belum bisa membaca metadata lewat ffprobe bawaan Remotion');
  const data = JSON.parse(probe.stdout.slice(probe.stdout.indexOf('{'), probe.stdout.lastIndexOf('}') + 1));
  const video = data.streams?.find((stream) => stream.codec_type === 'video');
  const audio = data.streams?.some((stream) => stream.codec_type === 'audio') || false;
  const [pembilang, penyebut] = (video?.r_frame_rate || '').split('/').map(Number);
  const fps = pembilang / penyebut;
  const durasi = Number(data.format?.duration);
  if (!video || !Number.isFinite(fps) || fps <= 0 || !Number.isFinite(durasi) || durasi <= 0 || !(video.width > 0 && video.height > 0)) throw new Error('Metadata video belum lengkap');
  const metadata = {durasi, width: video.width, height: video.height, fps, audio, jalur: run.jalur || 'sistem'};
  const tambahan = opsi.beku || opsi.lembar ? await qcTambahan(input, metadata, opsi, run, folderProyek) : {};
  try {
    if (!audio) throw new Error('Video kamu tidak punya stream audio. Aku belum bisa mengukur loudness');
    const suara = run(['ffmpeg', '-nostdin', '-hide_banner', '-nostats', '-i', input, '-vn', '-sn', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-']);
    if (ffmpegTidakAda(suara)) return {...metadata, ...tambahan, ffmpegAda: false, loudness: 'dilewati', peringatan: PESAN_FFMPEG};
    if (suara.status !== 0) {
      const alasan = suara.error?.message || suara.stderr?.trim().split('\n').slice(-3).join('\n') || `exit ${suara.status}`;
      throw new Error(`Aku belum bisa mengukur suara lewat ffmpeg ${metadata.jalur}: ${alasan}`);
    }
    const laporan = `${suara.stdout || ''}\n${suara.stderr || ''}`;
    const blok = laporan.match(/\{[^{}]*"input_i"[^{}]*"input_tp"[^{}]*\}/);
    if (!blok) throw new Error('Hasil pengukuran loudness belum ditemukan');
    const loudness = JSON.parse(blok[0]);
    const input_i = Number(loudness.input_i), input_tp = Number(loudness.input_tp);
    if (!Number.isFinite(input_i) || !Number.isFinite(input_tp)) throw new Error('Audio kamu hening atau pengukuran loudness tidak valid');
    return {...metadata, ...tambahan, input_i, input_tp, loudnessWajar: Math.abs(input_i + 14) <= 1 && input_tp <= -1.5};
  } catch (error) {
    error.laporan = {...metadata, loudness: 'belum terukur', ...tambahan, alasan: error.message};
    throw error;
  }
}
export function cetakGagal(error, tulis = console.log, tulisError = console.error) {
  if (error.laporan) tulis(JSON.stringify(error.laporan, null, 2));
  tulisError(error.message);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const laporan = await cekHasil(process.argv[2] || '', undefined, proyek, opsiQc(process.argv.slice(3)));
    console.log(JSON.stringify(laporan, null, 2));
    if (laporan.peringatan) console.error(`⚠️ ${laporan.peringatan}`);
    if (laporan.loudnessWajar === false || laporan.bekuWajar === false) { console.error('Kamu sesuaikan gain audio lalu render dan cek lagi. Sasaran sekitar -14 LUFS; perbaiki bagian beku jika ada. Peak paling tinggi -1,5 dBTP.'); process.exitCode = 1; }
  } catch (error) {
    cetakGagal(error);
    process.exitCode = 1;
  }
}
