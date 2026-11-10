// KD-170 (laporan Aldy 04/11): kode bebas di perintah Bash (`python3 -c`, `python3 -`, `node -e`, heredoc, `bash -c`) selalu
// bikin owner ditanya izin di HP. Hook PreToolUse ini nolak perintah kayak gitu SEBELUM tombol izin muncul, dan ngasih tau agen
// alat apa yang dipakai. Perintah lain gak disentuh (izin tetap diatur daftar allow/ask/deny di .claude/settings.json).
// Keluar 2 + pesan di stderr = Claude Code nahan perintahnya dan nunjukin pesannya ke agen.
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

// Buang isi tanda kutip dulu, biar teks yang cuma nyebut "python3 -c" (mis. di pesan commit atau grep) gak ikut ketolak.
const tanpaKutip = (s) => s.replace(/'[^']*'/g, "''").replace(/"(?:\\.|[^"\\])*"/g, '""');

const POLA = [
  [/(^|[\s;&|(])python[\d.]*\s+(-[A-Za-z]*c\b|-\s*($|[;&|<]))/, 'python3 -c / python3 -'],
  [/(^|[\s;&|(])node\s+(?:--[\w-]+(?:=\S+)?\s+)*(-e|--eval|-p|--print)\b/, 'node -e'],
  [/(^|[\s;&|(])node\s+(?:--[\w-]+(?:=\S+)?\s+)*(-\s*($|[;&|<])|<)/, 'node baca kode dari input'],
  [/<<-?\s*(''|""|\w)/, 'heredoc (<<EOF)'], // isi kutip udah dibuang: <<'EOF' jadi <<''
  [/(^|[\s;&|(])(ba|z)?sh\s+-[A-Za-z]*c\b/, 'bash -c'],
];

export function cekPerintah(cmd) {
  const s = tanpaKutip(String(cmd || ''));
  for (const [re, nama] of POLA) if (re.test(s)) return nama;
  return null;
}

export const PESAN = (nama) => `Pagar kantor nahan perintah ini: ada kode bebas (${nama}). Perintah kayak gitu selalu bikin owner ditanya izin.
Ganti caranya:
- Baca berkas: alat Read. Cari: Grep/Glob.
- Ubah atau bikin berkas: alat Edit/Write.
- Cek gambar (ukuran, alpha, kotak isi): node alat/info-gambar.mjs <gambar…>
- Ringkasan QC carousel: node alat/qc-ringkas.mjs hasil/carousel-<task>/qc.json
- Satu perintah per langkah, tanpa ;, &&, |, variabel, atau loop.
Belum ada alat buat yang kamu butuhin? Tulis di task, minta Builder bikinin alatnya. Jangan diakalin pakai kode bebas.`;

if (process.argv[1] && import.meta.url === pathToFileURL(fs.realpathSync(process.argv[1])).href) {
  let masuk = '';
  try { masuk = fs.readFileSync(0, 'utf8'); } catch { process.exit(0); }
  let cmd = '';
  try { const d = JSON.parse(masuk); if (d?.tool_name && d.tool_name !== 'Bash') process.exit(0); cmd = d?.tool_input?.command || ''; } catch { process.exit(0); }
  const nama = cekPerintah(cmd);
  if (nama) { process.stderr.write(PESAN(nama) + '\n'); process.exit(2); }
  process.exit(0);
}
