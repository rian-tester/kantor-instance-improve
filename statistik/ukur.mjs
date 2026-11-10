// Pengukur pemakaian Claude kantor. Tanpa AI, nol token: cuma membaca transkrip sesi di disk dan menjumlahkan angka.
// Yang dicatat HANYA angka (token, jumlah pesan, panggilan alat, panggilan agen). Isi percakapan tidak pernah disalin.
// Pakai:
//   node statistik/ukur.mjs            -> perbarui catatan/statistik-pemakaian.jsonl (satu baris per hari, aman diulang)
//   node statistik/ukur.mjs --lihat    -> cetak ringkasan semua hari, tanpa menulis berkas
//   node statistik/ukur.mjs --hari 2026-11-09 --lihat
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const KANTOR = process.env.KANTOR || path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SLUG = KANTOR.replace(/[\\/]/g, '-');
const AKAR = process.env.CLAUDE_PROYEK || path.join(os.homedir(), '.claude', 'projects', SLUG);
const KELUAR = path.join(KANTOR, 'catatan', 'statistik-pemakaian.jsonl');
const args = process.argv.slice(2);
const lihat = args.includes('--lihat');
const hariPilihan = args.includes('--hari') ? args[args.indexOf('--hari') + 1] : null;

if (!fs.existsSync(AKAR)) { console.error(`Folder transkrip gak ada: ${AKAR}`); process.exit(1); }

const berkas = [];
(function jelajah(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) jelajah(p);
    else if (e.name.endsWith('.jsonl')) berkas.push(p);
  }
})(AKAR);

const wib = (iso) => new Date(Date.parse(iso) + 7 * 3600 * 1000).toISOString().slice(0, 10);
const hari = {};
const dapatHari = (h) => (hari[h] ||= { jenis: {}, alat: {}, agen: {}, agenSesi: {}, sesi: new Set() });
const dapatJenis = (h, j) => (dapatHari(h).jenis[j] ||= { pesan: 0, masuk: 0, cacheBaca: 0, cacheTulis: 0, keluar: 0 });
const usageDilihat = new Map();
const alatDilihat = new Set();

for (const f of berkas) {
  let baris;
  try { baris = fs.readFileSync(f, 'utf8').split('\n'); } catch { continue; }
  const subagen = f.includes(`${path.sep}subagents${path.sep}`);
  let tipeAgen = null;
  if (subagen) {
    try { tipeAgen = JSON.parse(fs.readFileSync(f.replace(/\.jsonl$/, '.meta.json'), 'utf8')).agentType || 'agen'; } catch { tipeAgen = 'agen'; }
  }
  let jenisSesi = 'obrolan';
  for (const b of baris) {
    if (!b) continue;
    let o;
    try { o = JSON.parse(b); } catch { continue; }
    if (o.type === 'user' && !subagen && jenisSesi === 'obrolan') {
      const c = o.message?.content;
      const teks = typeof c === 'string' ? c : Array.isArray(c) ? c.map((x) => (typeof x?.text === 'string' ? x.text : '')).join(' ') : '';
      if (teks.includes('Ini putaran detak')) jenisSesi = 'detak';
    }
    if (o.type !== 'assistant' || !o.message || !o.timestamp) continue;
    const h = wib(o.timestamp);
    const jenis = subagen ? 'agen' : jenisSesi;
    dapatHari(h).sesi.add(f);
    // Satu pesan AI bisa tampil di beberapa baris (satu per blok isi): token dihitung sekali per pesan (nilai terbesar),
    // tetapi panggilan alat dihitung dari setiap blok.
    const u = o.message.usage;
    const id = `${f}:${o.message.id || o.uuid}`;
    if (u) {
      const sebelumnya = usageDilihat.get(id);
      const baru = { masuk: u.input_tokens || 0, cacheBaca: u.cache_read_input_tokens || 0, cacheTulis: u.cache_creation_input_tokens || 0, keluar: u.output_tokens || 0 };
      if (!sebelumnya) { usageDilihat.set(id, { h, jenis, ...baru }); }
      else if (baru.keluar > sebelumnya.keluar) { Object.assign(sebelumnya, baru); }
    }
    for (const blok of Array.isArray(o.message.content) ? o.message.content : []) {
      if (blok.type !== 'tool_use') continue;
      const kunci = `${f}:${blok.id}`;
      if (alatDilihat.has(kunci)) continue;
      alatDilihat.add(kunci);
      const d = dapatHari(h);
      d.alat[blok.name] = (d.alat[blok.name] || 0) + 1;
      if ((blok.name === 'Agent' || blok.name === 'Task') && blok.input?.subagent_type) {
        d.agen[blok.input.subagent_type] = (d.agen[blok.input.subagent_type] || 0) + 1;
      }
    }
    if (subagen) usageDilihat.get(id) && (usageDilihat.get(id).tipeAgen = tipeAgen);
  }
}

for (const v of usageDilihat.values()) {
  const t = dapatJenis(v.h, v.jenis);
  t.pesan += 1; t.masuk += v.masuk; t.cacheBaca += v.cacheBaca; t.cacheTulis += v.cacheTulis; t.keluar += v.keluar;
  if (v.tipeAgen) {
    const a = (hari[v.h].agenSesi[v.tipeAgen] ||= { pesan: 0, keluar: 0 });
    a.pesan += 1; a.keluar += v.keluar;
  }
}

const hasil = Object.keys(hari).sort().filter((h) => !hariPilihan || h === hariPilihan).map((h) => {
  const d = hari[h];
  return { hari: h, berkasSesi: d.sesi.size, jenis: d.jenis, alat: d.alat, panggilanAgen: d.agen, pemakaianAgen: d.agenSesi };
});

const k = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(2)} jt` : n >= 1e3 ? `${(n / 1e3).toFixed(1)} rb` : String(n));
if (lihat) {
  for (const r of hasil) {
    console.log(`== ${r.hari} (${r.berkasSesi} berkas sesi)`);
    for (const [j, t] of Object.entries(r.jenis)) console.log(`  ${j}: ${t.pesan} pesan AI | token baru ${k(t.masuk)} | cache baca ${k(t.cacheBaca)} | cache tulis ${k(t.cacheTulis)} | keluar ${k(t.keluar)}`);
    console.log(`  alat: ${Object.entries(r.alat).sort((a, b) => b[1] - a[1]).map(([n, c]) => `${n} ${c}`).join(', ') || '-'}`);
    console.log(`  panggilan agen: ${Object.entries(r.panggilanAgen).sort((a, b) => b[1] - a[1]).map(([n, c]) => `${n} ${c}`).join(', ') || '-'}`);
    console.log(`  pesan AI per agen: ${Object.entries(r.pemakaianAgen).sort((a, b) => b[1].pesan - a[1].pesan).map(([n, a]) => `${n} ${a.pesan} (keluar ${k(a.keluar)})`).join(', ') || '-'}`);
  }
  process.exit(0);
}

// Tulis ulang berkas: hari lama yang sudah tersimpan tapi transkripnya sudah dibersihkan Claude Code tetap dipertahankan.
const lama = {};
if (fs.existsSync(KELUAR)) {
  for (const baris of fs.readFileSync(KELUAR, 'utf8').split('\n')) {
    if (!baris) continue;
    try { const r = JSON.parse(baris); lama[r.hari] = r; } catch { /* lewati baris rusak */ }
  }
}
const sekarang = new Date().toISOString();
for (const r of hasil) lama[r.hari] = { ...r, diukur: sekarang };
fs.mkdirSync(path.dirname(KELUAR), { recursive: true });
fs.writeFileSync(KELUAR, Object.keys(lama).sort().map((h) => JSON.stringify(lama[h])).join('\n') + '\n', { mode: 0o600 });
console.log(`Statistik diperbarui: ${Object.keys(lama).length} hari di ${path.relative(KANTOR, KELUAR)}`);
