#!/usr/bin/env node
// Lembur.id: rekomendasi arah desain dari database ui-ux-pro-max (plugin Next Level Builder, MIT, dipasang installer):
// gaya, palet warna, pasangan font, & aturan UX yang cocok sama jenis bisnis. Gak pakai internet, gak makan jatah.
// Pakai (dari folder kantor):
//   node alat/gaya.mjs "kedai kopi kekinian anak muda hangat"          → rekomendasi lengkap (--design-system)
//   node alat/gaya.mjs "warm serif" --domain typography               → cari satu jenis (style|color|typography|ux|landing)
// Hasilnya bahan mikir, bukan perintah: ambil yang cocok sama bisnis & brief, buang yang generik.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const arg = process.argv.slice(2);
const kueri = arg.find((a, i) => !a.startsWith('--') && arg[i - 1] !== '--domain');
if (!kueri) { console.error('Pakai: node alat/gaya.mjs "<jenis bisnis> <target> <suasana>" [--domain style|color|typography|ux|landing]'); process.exit(1); }
const domain = arg.includes('--domain') ? arg[arg.indexOf('--domain') + 1] : '';
if (domain && !/^[a-z-]{2,20}$/.test(domain)) { console.error('--domain gak valid'); process.exit(1); }
// Cari skrip di cache plugin (versi terbaru), atau di ~/.claude/skills kalau dipasang manual.
const akar = path.join(os.homedir(), '.claude/plugins/cache/ui-ux-pro-max-skill/ui-ux-pro-max');
let skrip = '';
try { const v = fs.readdirSync(akar).sort().pop(); skrip = path.join(akar, v, '.claude/skills/ui-ux-pro-max/scripts/search.py'); } catch { /* lanjut */ }
if (!skrip || !fs.existsSync(skrip)) skrip = path.join(os.homedir(), '.claude/skills/ui-ux-pro-max/scripts/search.py');
if (!fs.existsSync(skrip)) { console.error('❌ Plugin ui-ux-pro-max belum kepasang. Minta owner: "jadi builder, pasang skill desain web".'); process.exit(1); }
const argPy = [skrip, kueri.slice(0, 200), ...(domain ? ['--domain', domain, '-n', '5'] : ['--design-system'])];
try { process.stdout.write(execFileSync('python3', argPy, { encoding: 'utf8', timeout: 60000, maxBuffer: 8 << 20 })); }
catch (e) { console.error(`❌ ${String(e.stderr || e.message).split('\n').slice(-3).join(' ')}`); process.exit(1); }
