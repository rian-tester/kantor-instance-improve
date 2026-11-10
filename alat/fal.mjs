#!/usr/bin/env node
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import * as F from './fal-inti.mjs';
const K = process.env.KANTOR || path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
export async function main(K, argv) {
  const [perintah, ...args] = argv;
  if (perintah === 'status') return F.status(K);
  if (perintah === 'model') return F.daftarModel(K);
  if (perintah === 'riwayat') return F.riwayat(K).slice(-20);
  if (perintah === 'harga') return F.harga(K, args);
  if (perintah === 'jalan' && args.length === 1) return F.jalan(K, args[0]);
  if (perintah === 'ambil' && (args.length === 1 || (args.length === 3 && args[1] === '--keluar'))) return F.ambil(K, args[0], args.length === 3 ? { keluar: args[2] } : {});
  if (['gambar', 'edit', 'video', 'suara', 'transkrip', 'musik'].includes(perintah)) {
    const opsi = {};
    for (let i = 0; i < args.length; i += 2) {
      const boleh = perintah === 'suara' ? ['model', 'teks', 'berkas', 'suara', 'gaya'] : perintah === 'transkrip' ? ['audio'] : perintah === 'musik' ? ['model', 'lirik', 'gaya', 'durasi', 'keluar'] : ['model', 'prompt', 'rasio', 'jumlah', 'keluar', 'gambar', 'durasi'];
      if (!args[i].startsWith('--') || !boleh.includes(args[i].slice(2)) || args[i + 1] === undefined || Object.hasOwn(opsi, args[i].slice(2))) throw new F.FalGagal('Argumen fal belum lengkap, berulang, atau gak sesuai perintah. Kamu bisa cek skill/gambar-video-fal.md.');
      opsi[args[i].slice(2)] = args[i + 1];
    }
    return F.siapkan(K, perintah, opsi);
  }
  throw new F.FalGagal('Pakai: node alat/fal.mjs status | model | harga <endpoint…> | gambar | edit | video | suara | musik | transkrip | riwayat | ambil <id-permintaan> [--keluar berkas.kata.json]. Video cuma bikin permintaan. Kamu setujuin di dashboard.');
}
if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main(K, process.argv.slice(2)).then((h) => console.log(F.pesanAman(K, JSON.stringify(h, null, 2)))).catch((e) => {
  console.error(e instanceof F.FalGagal ? F.pesanAman(K, e.message) : 'Aku gak bisa memproses fal. Cek file kantor dan coba lagi.');
  process.exitCode = 2;
});
