#!/usr/bin/env node
// Lembur.id: sambungin / lepas folder Google Drive kantor. Dijalanin Builder pas owner bilang
// "jadi builder, sambungin google drive". Sengaja GAK ada di daftar izin otomatis: owner yang nyetujuin tiap kali
// (perintahnya keliatan di aplikasi, lengkap sama link folder-nya).
// Pakai (dari folder kantor):
//   node alat/drive-folder.mjs <link folder Drive>   → simpen folder kantor + nyalain konektor akun Claude
//   node alat/drive-folder.mjs --lepas               → putusin (tim gak bisa buka Drive lagi)
//   node alat/drive-folder.mjs --cek                 → liat status
// Abis nyambung: owner mulai sesi baru di aplikasi Claude biar alat Drive kebaca.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const K = process.env.KANTOR || process.cwd();
const DIR = path.join(K, '.drive');
const USER = path.join(os.homedir(), '.claude', 'settings.json');
const arg = process.argv[2] || '';
const gagal = (m) => { console.error(`❌ ${m}`); process.exit(1); };

function setelanUser(ubah) {
  let s = {};
  try { s = JSON.parse(fs.readFileSync(USER, 'utf8')); } catch { /* belum ada */ }
  ubah(s);
  fs.mkdirSync(path.dirname(USER), { recursive: true });
  fs.writeFileSync(USER, `${JSON.stringify(s, null, 2)}\n`);
}

if (arg === '--cek') {
  let f = null;
  try { f = JSON.parse(fs.readFileSync(path.join(DIR, 'folder.json'), 'utf8')); } catch { /* belum */ }
  let d = { folder: {}, file: {} };
  try { d = JSON.parse(fs.readFileSync(path.join(DIR, 'dikenal.json'), 'utf8')); } catch { /* belum */ }
  if (!f?.utama) { console.log('Google Drive belum disambungin.'); process.exit(0); }
  const hasil = Object.entries(d.folder).find(([, z]) => z === 'tulis')?.[0];
  console.log(`Folder kantor: https://drive.google.com/drive/folders/${f.utama}`);
  console.log(`Folder Hasil: ${hasil ? `https://drive.google.com/drive/folders/${hasil}` : 'belum ada (dibikin pas pertama nyimpen)'}`);
  console.log(`File yang udah dikenal satpam: ${Object.keys(d.file).length}`);
  let i = {};
  try { i = JSON.parse(fs.readFileSync(path.join(DIR, 'info.json'), 'utf8')); } catch { /* belum dipakai */ }
  console.log(`Nama folder: ${i.folderNama || '(belum kebaca: get_file_metadata folder utama)'} · Akun Google: ${i.akunGoogle || i.pemilikFolder || '(belum kebaca)'} · Terakhir dipakai: ${i.terakhir || 'belum pernah'}`);
  process.exit(0);
}

if (arg === '--lepas') {
  fs.rmSync(DIR, { recursive: true, force: true });
  console.log('✅ Google Drive diputus. Tim gak bisa buka Drive lagi (satpam nolak semua). Konektor akun Claude tetap nyala;');
  console.log('   matiin di claude.ai → Setelan → Konektor kalau mau.');
  process.exit(0);
}

// Link folder: https://drive.google.com/drive/folders/<id>?usp=..., .../drive/u/0/folders/<id>, ?id=<id>, atau id doang.
const m = arg.match(/\/folders\/([A-Za-z0-9_-]{10,})/) || arg.match(/[?&]id=([A-Za-z0-9_-]{10,})/) || arg.match(/^([A-Za-z0-9_-]{10,})$/);
if (!m) gagal('Link folder gak kebaca. Di Google Drive ketuk ⋮ di folder-nya → Salin link (izin berbagi gak usah diubah), terus tempel di sini.');
if (/\/file\/d\/|\/document\/d\/|\/spreadsheets\/d\//.test(arg)) gagal('Itu link file, bukan folder. Yang dibutuhin link FOLDER kantor.');
const id = m[1];

fs.mkdirSync(DIR, { recursive: true });
fs.writeFileSync(path.join(DIR, 'folder.json'), `${JSON.stringify({ utama: id, disambung: new Date().toISOString() }, null, 1)}\n`);
fs.writeFileSync(path.join(DIR, 'dikenal.json'), `${JSON.stringify({ folder: { [id]: 'baca' }, file: {} }, null, 1)}\n`);
fs.rmSync(path.join(DIR, 'info.json'), { force: true });
// Kit bawaannya matiin konektor akun Claude biar bekal sesi irit. Drive butuh konektor, jadi dinyalain.
setelanUser((s) => { s.disableClaudeAiConnectors = false; });
console.log(`✅ Folder kantor disimpen: https://drive.google.com/drive/folders/${id}`);
console.log('   Konektor akun Claude dinyalain. Satpam Drive cuma ngizinin folder ini (hapus & share selalu ditolak).');
console.log('   Langkah berikutnya: owner mulai sesi BARU di aplikasi Claude (sesi kantor), biar alat Google Drive kebaca.');
