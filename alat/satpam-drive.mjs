#!/usr/bin/env node
// Lembur.id: satpam Google Drive. Dipanggil Claude Code sebagai hook (lihat .claude/settings.json) tiap tim mau
// pakai alat Google Drive (konektor akun Claude). Konektornya bisa liat seluruh Drive owner; satpam ini yang bikin tim
// cuma bisa kerja di SATU folder kantor yang dipilih owner (.drive/folder.json, diisi alat/drive-folder.mjs):
//   - nyari: wajib `parentId = '<folder kantor / subfoldernya>'` (dicek, bukan dipercaya);
//   - buka/baca file: cuma file yang pernah keliatan di folder itu (dicatat di .drive/dikenal.json);
//   - nyimpen file baru / salinan: cuma di folder "Hasil" (tanpa nanya); mindahin/ganti nama: owner ditanya;
//   - hapus & share: selalu ditolak. Alat Drive lain yang belum dikenal: ditolak.
// Pakai: node alat/satpam-drive.mjs pre|post (input JSON hook dari stdin). AI gak boleh ngubah file ini (pagar).
import fs from 'node:fs';
import path from 'node:path';

const K = process.env.CLAUDE_PROJECT_DIR || process.env.KANTOR || process.cwd();
const DIR = path.join(K, '.drive');
const FOLDER = 'application/vnd.google-apps.folder';
const AWALAN = 'mcp__claude_ai_Google_Drive__';
const SKILL = 'Baca skill google-drive dulu.';

const bacaJson = (f, isi) => { try { return JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); } catch { return isi; } };
const tulisJson = (f, isi) => {
  const tmp = path.join(DIR, `.${f}.${process.pid}`);
  fs.writeFileSync(tmp, `${JSON.stringify(isi, null, 1)}\n`);
  fs.renameSync(tmp, path.join(DIR, f));
};
const keluar = (keputusan, alasan) => {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: keputusan, permissionDecisionReason: alasan } }));
  process.exit(0);
};

const tahap = process.argv[2];
// Satpam error = jangan sampe pintunya kebuka: tahap pre langsung nolak.
process.on('uncaughtException', (e) => { if (tahap === 'pre') keluar('deny', `Satpam Drive error (${e.message}), aksi ditolak. Bilang ke owner: "jadi builder, cek satpam drive".`); process.exit(0); });
let masuk = {};
try { masuk = JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { /* kosong */ }
const alat = String(masuk.tool_name || '');
if (!alat.startsWith(AWALAN)) process.exit(0); // bukan alat Drive: bukan urusan satpam
const nama = alat.slice(AWALAN.length);
const isi = masuk.tool_input || {};

const setelan = bacaJson('folder.json', null);
// dikenal: { folder: { id: 'baca'|'tulis' }, file: { id: { judul, induk } } }
const dikenal = bacaJson('dikenal.json', { folder: {}, file: {} });
if (setelan?.utama) dikenal.folder[setelan.utama] ||= 'baca';
const zona = (id) => dikenal.folder[id] || '';
const kenal = (id) => Boolean(id && (dikenal.file[id] || dikenal.folder[id]));
const adaHasil = () => Object.values(dikenal.folder).includes('tulis');
const daftarFolder = () => Object.entries(dikenal.folder).map(([id, z]) => `'${id}' (${z === 'tulis' ? 'Hasil, boleh nyimpen' : 'baca'})`).join(', ');

// Hasil alat MCP bisa datang sebagai string, array konten, atau objek. Ambil JSON-nya.
function hasilJson(r) {
  if (r == null) return null;
  if (typeof r === 'string') { try { return JSON.parse(r); } catch { return null; } }
  if (Array.isArray(r)) return hasilJson(r.map((x) => (typeof x === 'string' ? x : x?.text || '')).join(''));
  if (Array.isArray(r.content)) return hasilJson(r.content);
  if (typeof r.text === 'string') return hasilJson(r.text);
  return r;
}

// Query harus `parentId = '<id>'` atau `parentId = '<id>' and (<apa aja>)`, dengan kurung yang beneran nutup di akhir
// (biar gak bisa diakalin pakai `... and (x) or (y)`). Isi string dibuang dulu sebelum ngitung kurung.
function cekQuery(q) {
  const m = String(q || '').trim().match(/^parentId\s*=\s*'([^'\\]+)'(?:\s+and\s+\(([\s\S]*)\))?$/);
  if (!m) return { ok: false };
  if (m[2] !== undefined) {
    const polos = m[2].replace(/'(?:\\.|[^'\\])*'/g, "''");
    let dalam = 0;
    for (const c of polos) { if (c === '(') dalam++; if (c === ')' && --dalam < 0) return { ok: false }; }
    if (dalam !== 0) return { ok: false };
  }
  return { ok: true, induk: m[1] };
}

if (tahap === 'pre') {
  if (!setelan?.utama) keluar('deny', 'Google Drive belum disambungin ke folder kantor, jadi tim belum boleh buka Drive. Bilang ke owner: "jadi builder, sambungin google drive".');
  if (nama === 'search_files') {
    const q = cekQuery(isi.query);
    if (!q.ok || !zona(q.induk)) keluar('deny', `Satpam Drive: tim cuma boleh nyari di folder kantor. Tulis query persis "parentId = '<id folder>'" atau "parentId = '<id folder>' and (<syarat lain>)". Folder yang boleh: ${daftarFolder()}. ${SKILL}`);
    keluar('allow', 'Nyari di folder kantor.');
  }
  if (nama === 'list_recent_files') keluar('deny', `Satpam Drive: daftar file terbaru nyakup seluruh Drive owner. Pakai search_files dengan "parentId = '<id folder>'". Folder yang boleh: ${daftarFolder()}.`);
  if (['read_file_content', 'download_file_content', 'get_file_metadata', 'get_file_permissions'].includes(nama)) {
    if (!kenal(isi.fileId)) keluar('deny', `Satpam Drive: file ${isi.fileId || '(tanpa id)'} gak ada di folder kantor (atau belum dicari). Cari dulu pakai search_files di folder kantor, terus pakai id dari hasilnya. ${SKILL}`);
    keluar('allow', 'File di folder kantor.');
  }
  if (nama === 'create_file') {
    const bikinHasil = !adaHasil() && isi.parentId === setelan.utama && String(isi.title || '').trim() === 'Hasil'
      && [isi.mimeType, isi.contentMimeType].includes(FOLDER) && !isi.textContent && !isi.base64Content && !isi.content;
    if (bikinHasil) keluar('allow', 'Bikin folder Hasil di folder kantor.');
    if (zona(isi.parentId) !== 'tulis') keluar('deny', `Satpam Drive: file baru cuma boleh disimpen di folder Hasil (parentId = id folder Hasil). ${adaHasil() ? `Folder yang boleh: ${daftarFolder()}.` : 'Folder Hasil belum ada: cari dulu pakai search_files, kalau gak ada bikin folder "Hasil" di folder kantor.'} ${SKILL}`);
    keluar('allow', 'Nyimpen di folder Hasil.');
  }
  if (nama === 'copy_file') {
    if (!kenal(isi.fileId) || zona(isi.parentId) !== 'tulis') keluar('deny', `Satpam Drive: nyalin cuma boleh dari file di folder kantor ke folder Hasil (isi parentId = id folder Hasil). Folder yang boleh: ${daftarFolder()}.`);
    keluar('allow', 'Nyalin ke folder Hasil.');
  }
  if (nama === 'update_file') {
    if (!kenal(isi.fileId) || (isi.parentId && !zona(isi.parentId))) keluar('deny', 'Satpam Drive: cuma file di folder kantor yang boleh diganti nama / dipindah, dan tujuannya harus tetap di folder kantor.');
    keluar('ask', 'Ganti nama / mindahin file di Drive: owner yang mutusin.');
  }
  if (nama === 'trash_file') keluar('deny', 'Satpam Drive: tim gak boleh hapus file di Drive. Kalau perlu dihapus, tulis di "Keputusan kamu" biar owner hapus sendiri.');
  if (nama === 'share_file') keluar('deny', 'Satpam Drive: tim gak boleh ngeshare file Drive ke orang lain (kirim keluar = owner sendiri). Tulis di "Keputusan kamu".');
  keluar('deny', `Satpam Drive: alat ${nama} belum dikenal satpam, jadi ditolak.`);
}

if (tahap === 'post' && setelan?.utama) {
  // Catat file & subfolder yang beneran ada di folder kantor (dari hasil alat yang tadi diizinin satpam).
  const hasil = hasilJson(masuk.tool_response);
  const daftar = Array.isArray(hasil?.files) ? hasil.files : hasil?.id ? [hasil] : [];
  // info.json buat halaman Google Drive di dashboard: nama folder, akun, kapan terakhir dipakai. Akun Google yang
  // nyambung = pemilik file yang dibikin tim (file baru selalu punya akun yang bikin).
  const info = bacaJson('info.json', {});
  info.terakhir = new Date().toISOString();
  if ((nama === 'create_file' || nama === 'copy_file') && typeof hasil?.owner === 'string') info.akunGoogle = hasil.owner;
  let berubah = false;
  for (const f of daftar) {
    if (!f?.id || typeof f.id !== 'string') continue;
    if (f.id === setelan.utama) { info.folderNama = String(f.title || '').slice(0, 120); if (f.owner) info.pemilikFolder = String(f.owner); continue; }
    const induk = f.parentId || (nama === 'create_file' || nama === 'copy_file' ? isi.parentId : '');
    if (!zona(induk)) continue;
    if (f.mimeType === FOLDER) {
      // Subfolder ikut zona induknya; folder "Hasil" langsung di folder utama = zona tulis.
      const z = induk === setelan.utama && String(f.title || '').trim() === 'Hasil' ? 'tulis' : zona(induk);
      if (dikenal.folder[f.id] !== z) { dikenal.folder[f.id] = z; berubah = true; }
    } else if (!dikenal.file[f.id]) { dikenal.file[f.id] = { judul: String(f.title || '').slice(0, 120), induk }; berubah = true; }
  }
  for (const f of daftar) if (f?.mimeType === FOLDER && dikenal.folder[f.id] === 'tulis' && zona(f.parentId) === 'baca') info.hasilNama = String(f.title || '').slice(0, 120);
  fs.mkdirSync(DIR, { recursive: true });
  if (berubah) tulisJson('dikenal.json', dikenal);
  tulisJson('info.json', info);
}
process.exit(0);
