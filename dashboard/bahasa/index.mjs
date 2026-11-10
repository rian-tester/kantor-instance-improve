// Lembur.id: kamus teks tampilan (KD-121). Satu sumber buat wizard pasang, dashboard, & aset browser-nya.
// Kamus ada di bahasa/<kode>/<bagian>.json (kunci rata, mis. "wz.halo.judul"). Indonesia (id) = bawaan & acuan;
// kunci yang belum ada di ms/en jatuh ke id, kunci yang gak ada sama sekali tampil apa adanya (gak error).
// Nilai boleh berisi HTML (sumbernya kit sendiri). Isian {nama} diganti apa adanya: yang masuk ke HTML wajib di-esc pemanggil.
// Setelan bahasa kantor: <kantor>/setelan/kantor.json → { "bahasa": "id|ms|en" }. Tiap ganti, aturan bahasa di CLAUDE.md
// kantor ditulis ulang (blok bertanda di bawah) biar semua agent ngomong pakai bahasa yang dipilih.
// Peran, SOP, & kitab bahasa sengaja tetap Indonesia (tahap 1).
import fs from 'node:fs';
import path from 'node:path';

const SINI = path.dirname(new URL(import.meta.url).pathname);
export const BAHASA = { id: 'Bahasa Indonesia', ms: 'Bahasa Melayu (Malaysia)', en: 'English' };
export const KODE = Object.keys(BAHASA);
// Buat Intl (tanggal, angka) & atribut <html lang>.
export const LOKAL = { id: 'id-ID', ms: 'ms-MY', en: 'en-GB' };
export const rapihKode = (x) => (KODE.includes(String(x || '').toLowerCase()) ? String(x).toLowerCase() : 'id');

const muatan = {};
export function kamus(kode) {
  kode = rapihKode(kode);
  if (muatan[kode]) return muatan[kode];
  const isi = {};
  const dir = path.join(SINI, kode);
  let file = [];
  try { file = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort(); } catch { /* bahasa belum ada */ }
  for (const f of file) Object.assign(isi, JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  muatan[kode] = isi;
  return isi;
}

let aktif = 'id';
export const pakai = (kode) => { aktif = rapihKode(kode); return aktif; };
export const bahasaAktif = () => aktif;

const isi = (s, v) => (typeof s === 'string' && v ? s.replace(/\{(\w+)\}/g, (m, k) => (k in v ? String(v[k] ?? '') : m)) : s);
// t('kunci', {isian}) → teks bahasa aktif; t('kunci', {isian}, 'en') → bahasa tertentu. Nilai daftar (array) dibalikin utuh.
export function t(kunci, v, kode = aktif) {
  const k = kamus(kode);
  const s = kunci in k ? k[kunci] : kunci in kamus('id') ? kamus('id')[kunci] : kunci;
  return Array.isArray(s) ? s : isi(s, v);
}
// Semua kunci berawalan tertentu (mis. "app.") buat dikirim ke browser.
export function bagianKamus(awalan, kode = aktif) {
  const hasil = {};
  for (const [k, s] of Object.entries({ ...kamus('id'), ...kamus(kode) })) if (k.startsWith(awalan)) hasil[k] = s;
  return hasil;
}

// ---------- setelan kantor ----------
const fSetelan = (K) => path.join(K, 'setelan/kantor.json');
export function bacaSetelanKantor(K) {
  try { return JSON.parse(fs.readFileSync(fSetelan(K), 'utf8')) || {}; } catch { return {}; }
}
export const bacaBahasa = (K) => rapihKode(bacaSetelanKantor(K).bahasa);
export function simpanBahasa(K, kode) {
  kode = rapihKode(kode);
  fs.mkdirSync(path.join(K, 'setelan'), { recursive: true });
  fs.writeFileSync(fSetelan(K), `${JSON.stringify({ ...bacaSetelanKantor(K), bahasa: kode }, null, 1)}\n`);
  tulisAturanBahasa(K, kode);
  return kode;
}

// ---------- aturan bahasa buat agent (CLAUDE.md kantor) ----------
const AWAL = '<!-- bahasa:mulai (diatur wizard & dashboard dari setelan/kantor.json, jangan diubah manual) -->';
const AKHIR = '<!-- bahasa:akhir -->';
const BLOK = new RegExp(`\\n*${AWAL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${AKHIR}\\n*`, 'g');
const SAPA = {
  id: 'Pakai bahasa Indonesia santai kayak biasa.',
  ms: 'Gunakan Bahasa Melayu Malaysia yang betul (ejaan & kosa kata Malaysia, bukan bahasa Indonesia): sapa owner dengan "anda" (atau "awak" kalau owner sendiri santai), contohnya "kerana", "boleh", "percuma", "muat naik", "tetapan", "kemas kini". Nada santai tapi sopan.',
  en: 'Use natural, concise English. Friendly and plain, no corporate filler.',
};
export function blokAturan(kode) {
  kode = rapihKode(kode);
  return `${AWAL}
## Bahasa kerja: ${BAHASA[kode]}
Owner milih **${BAHASA[kode]}**. Semua yang kamu jawab & tulis buat owner pakai bahasa ini: jawaban di chat, pertanyaan & opsi
keputusan, laporan, notif HP, ringkasan hasil, judul & isi task, dan teks yang tampil di dashboard. ${SAPA[kode]}
- Istilah teknis, nama alat, nama file/folder, & nama produk tetap (Lembur.id, Kit, Builder, Claude, Repliz, Drive, nama manajer).
- Peran, SOP, & kitab bahasa ditulis dalam bahasa Indonesia: tetap ikutin isinya, yang ganti cuma bahasa keluarannya.
  Aturan gaya kitab bahasa (singkat, gak kaku, gak bahasa mesin) berlaku juga di ${BAHASA[kode]}.
- Yang dibaca mesin JANGAN diterjemahin: kunci frontmatter task (\`status: nunggu-kamu\` dst.), judul bagian task
  (\`## Tujuan\`, \`## Udah\`, \`## Keputusan kamu\`, \`## Berikutnya\`), nama file, & format opsi \`a) … b) …\`.
  Penanda opsi boleh ikut bahasa (dashboard ngerti): \`(rekomendasi: …)\`/\`(recommended: …)\`/\`(disyorkan: …)\`, \`Kenapa:\`/\`Why:\`/\`Kerana:\`.
- Owner boleh ngetik perintah pakai bahasanya (mis. "jadi builder, turn on auto work", "apa yang menunggu saya?"):
  artiin sama kayak pemicu bahasa Indonesia di tabel aturan. Kata \`jadi <nama>\` tetap pemanggil manajer.
${AKHIR}`;
}
// Tulis ulang blok aturan bahasa di CLAUDE.md kantor (dibikin kalau belum ada). Bahasa Indonesia = bloknya tetap ada,
// biar jelas buat agent & gampang diganti lagi.
export function tulisAturanBahasa(K, kode) {
  const f = path.join(K, 'CLAUDE.md');
  let s = '';
  try { s = fs.readFileSync(f, 'utf8'); } catch { return false; }
  const baru = `${s.replace(BLOK, '\n').trimEnd()}\n\n${blokAturan(kode)}\n`;
  if (baru !== s) fs.writeFileSync(f, baru);
  return true;
}
