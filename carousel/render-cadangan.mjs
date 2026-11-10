// Render carousel (Lembur.id, video 11). Dari ~/kantor:  node carousel/render.mjs carousel/naskah.json hasil/carousel-xxx
// naskah.json: {"brand":"Kopi Senja","slide":["Hujan jam 4 sore...","Poin 2", ...]}
// Dipasang sekali pakai pasang-carousel.sh (Node.js + Playwright + Chromium).
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const [, , fileNaskah, folderHasil = 'hasil/carousel'] = process.argv;
if (!fileNaskah) { console.log('pakai: node render.mjs naskah.json [folder-hasil]'); process.exit(1); }
const naskah = JSON.parse(fs.readFileSync(fileNaskah, 'utf8'));
const template = fs.readFileSync(new URL('./template.html', import.meta.url), 'utf8');
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
fs.mkdirSync(folderHasil, { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
const total = naskah.slide.length;
for (const [i, teks] of naskah.slide.entries()) {
  const html = template
    .replaceAll('{{jenis}}', i === 0 ? 'hook' : '')
    .replaceAll('{{kelas_teks}}', i === 0 ? 'judul' : 'isi')
    .replaceAll('{{teks}}', esc(teks))
    .replaceAll('{{nomor}}', String(i + 1)).replaceAll('{{total}}', String(total))
    .replaceAll('{{brand}}', esc(naskah.brand || ''));
  await p.setContent(html, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const f = path.join(folderHasil, `slide-${String(i + 1).padStart(2, '0')}.png`);
  await p.screenshot({ path: f });
  console.log('jadi:', f);
}
await b.close();
