#!/usr/bin/env node
// Lembur.id: bikin password dashboard baru (owner lupa / mau ganti). Dipanggil Builder dari ~/kantor:
//   node alat/password-dashboard.mjs
// Password baru cuma dicetak SEKALI di sini, gak disimpen polos di mana pun (yang disimpen cuma hash scrypt di
// .rahasia/dashboard.json, sama kayak installer). Semua yang lagi login di dashboard dikeluarin: sesi dihapus & dashboard
// dinyalain ulang (tmux "dashboard"), jadi password lama yang mungkin bocor gak bisa dipakai lagi.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const K = process.env.KANTOR || path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const R = path.join(K, '.rahasia');
const KATA = ['kopi', 'senja', 'hujan', 'pagi', 'meja', 'rapat', 'kertas', 'lampu', 'jendela', 'pintu', 'awan', 'teh', 'roti', 'bulan',
  'pasar', 'kebun', 'sawah', 'gunung', 'pantai', 'kursi', 'buku', 'pena', 'payung', 'sepeda', 'kereta', 'kapal', 'pelangi', 'bintang'];
const pilih = () => KATA[crypto.randomInt(KATA.length)];
const pw = `${pilih()}-${pilih()}-${pilih()}-${crypto.randomInt(1000, 9999)}`;
const garam = crypto.randomBytes(16).toString('hex');
const tulis = (f, isi) => { const t = `${f}.${process.pid}.tmp`; fs.writeFileSync(t, isi, { mode: 0o600 }); fs.renameSync(t, f); };

fs.mkdirSync(R, { recursive: true, mode: 0o700 });
tulis(path.join(R, 'dashboard.json'), JSON.stringify({ garam, hash: crypto.scryptSync(pw, garam, 32).toString('hex') }));
tulis(path.join(R, 'sesi.json'), '{}\n');
let ulang = 'dashboard gak lagi jalan di tmux, nyalain ulang sendiri nanti';
if (!process.env.PASSWORD_UJI && spawnSync('tmux', ['has-session', '-t', 'dashboard']).status === 0) {
  spawnSync('tmux', ['kill-session', '-t', 'dashboard']);
  const r = spawnSync('tmux', ['new', '-d', '-s', 'dashboard', `cd '${K}' && node dashboard/server.mjs`]);
  ulang = r.status === 0 ? 'dashboard dinyalain ulang' : 'dashboard gagal dinyalain ulang, minta Builder cek';
}
console.log(`✅ Password dashboard baru: ${pw}`);
console.log(`   Semua yang lagi login di dashboard udah dikeluarin (${ulang}). Masuk lagi pakai password ini.`);
console.log('   Simpen di password manager. Jangan ditulis di task, catatan, atau file kantor.');
