#!/usr/bin/env node
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as D from './drive-inti.mjs';
import { unduh } from './drive-unduh.mjs';
export async function main(args = process.argv.slice(2)) {
  const K = process.env.KANTOR || process.cwd();
  try {
    const [aksi, ...sisa] = args;
    if (aksi !== 'unduh') D.klien(K); // unduh dari tautan publik gak butuh sambungan/login Google
    if (aksi === 'status') { const s = await D.cekStatus(K); console.log(s.pesan || (s.tersambung ? `Tersambung: ${s.email}\n${s.folder}` : 'Kirim file ke Drive belum tersambung. Kamu bisa buka dashboard → Google Drive (/drive) → Sambungkan Google Drive.')); }
    else if (aksi === 'putus') { D.putus(K); console.log('Sambungan Google Drive diputus.'); }
    else if (aksi === 'sambung') { const k = await D.mulai(K); console.log(`Buka ${k.verification_url || 'https://www.google.com/device'}\nKode: ${k.user_code}`); await D.tunggu(K, k); console.log('Google Drive tersambung.'); }
    else if (aksi === 'kirim') {
      let sub = ''; const berkas = [];
      for (let i = 0; i < sisa.length; i++) { if (sisa[i] === '--folder') { sub = D.namaFolder(sisa[++i]); } else if (sisa[i].startsWith('--')) throw new D.DriveGagal('Pilihan perintah gak dikenal.'); else berkas.push(sisa[i]); }
      if (!berkas.length) throw new D.DriveGagal('Pilih berkas yang mau kamu kirim.');
      berkas.forEach((f) => D.berkas(K, f));
      for (const f of berkas) { const h = await D.kirim(K, f, sub); console.log(`${h.nama}: ${h.link}\nFolder: ${h.folder}`); }
    } else if (aksi === 'unduh') {
      // KD-152: unduh dari tautan bagikan publik ("siapa saja dengan link"), tanpa login. Tujuan cuma masuk/ atau kotak-masuk/<divisi>/.
      let tautan = ''; const o = {};
      for (let i = 0; i < sisa.length; i++) {
        if (sisa[i] === '--ke') o.ke = sisa[++i]; else if (sisa[i] === '--nama') o.nama = sisa[++i]; else if (sisa[i] === '--maks') o.maksMB = sisa[++i];
        else if (sisa[i].startsWith('--')) throw new D.DriveGagal('Pilihan perintah gak dikenal.'); else if (!tautan) tautan = sisa[i]; else throw new D.DriveGagal('Unduh satu tautan sekali jalan.');
      }
      const h = await unduh(K, tautan, o);
      console.log(`Terunduh: ${h.jalur} (${(h.ukuran / 1024).toFixed(h.ukuran < 1024 * 1024 ? 1 : 0)} KB, sha256 ${h.sha256.slice(0, 12)}…)`);
    } else throw new D.DriveGagal('Pakai: node alat/drive.mjs status | kirim <berkas…> [--folder nama] | unduh <tautan> [--ke folder] [--nama nama] [--maks MB] | sambung | putus');
  } catch (e) { console.error(e instanceof D.DriveGagal ? e.message : 'Aku belum bisa menjalankan Google Drive. Coba lagi nanti.'); process.exitCode = 1; }
}
if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
