import fs from 'node:fs';
import {pathAman, utama} from './video-aman.mjs';
const satuan = ['nol','satu','dua','tiga','empat','lima','enam','tujuh','delapan','sembilan','sepuluh','sebelas'];
export function terbilang(n) {
  if (n < 12) return satuan[n];
  if (n < 20) return `${terbilang(n - 10)} belas`;
  if (n < 100) return `${terbilang(Math.floor(n / 10))} puluh${n % 10 ? ` ${terbilang(n % 10)}` : ''}`;
  if (n < 200) return `seratus${n % 100 ? ` ${terbilang(n % 100)}` : ''}`;
  if (n < 1000) return `${terbilang(Math.floor(n / 100))} ratus${n % 100 ? ` ${terbilang(n % 100)}` : ''}`;
  if (n < 2000) return `seribu${n % 1000 ? ` ${terbilang(n % 1000)}` : ''}`;
  for (const [nilai, nama] of [[1e9,'miliar'],[1e6,'juta'],[1e3,'ribu']]) if (n >= nilai) return `${terbilang(Math.floor(n / nilai))} ${nama}${n % nilai ? ` ${terbilang(n % nilai)}` : ''}`;
  throw new Error('Angka di luar jangkauan');
}
export function normal(teks) {
  return teks.toLowerCase().replace(/(\d)([a-z])/g, '$1 $2').replace(/([a-z])(\d)/g, '$1 $2').replace(/\b(gpu|cpu|ai|hz|gb|ram|ssd|rp|kg|cm|mm|ms|fps)\b/g, (x) => ({gpu:'ji pi yu',cpu:'si pi yu',ai:'ei ai',hz:'hertz',gb:'gigabita',ram:'ram',ssd:'es es di',rp:'rupiah',kg:'kilogram',cm:'sentimeter',mm:'milimeter',ms:'milidetik',fps:'ef pi es'}[x]))
    .replace(/\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:[.,]\d+)?/g, (x) => {
      const angka = x.replace(/\.(?=\d{3}(?:\D|$))/g, '').replace(',', '.').split('.');
      const n = Number(angka[0]);
      return n <= 999999999999 ? `${terbilang(n)}${angka[1] ? ` koma ${[...angka[1]].map((d) => satuan[Number(d)]).join(' ')}` : ''}` : [...angka[0]].map((d) => satuan[Number(d)]).join(' ');
    }).replace(/%/g,' persen ').replace(/[^\p{L}\s]/gu,' ').trim().split(/\s+/).filter(Boolean);
}
export function kataTranskrip(data) {
  const kata = Array.isArray(data) ? data : data.words || data.kata;
  if (!Array.isArray(kata) || !kata.length) throw new Error('Transkrip belum berisi kata');
  return kata.filter((k) => !k.type || k.type === 'word').map((k) => ({t: k.t ?? k.text, mulai: k.mulai ?? k.start, akhir: k.akhir ?? k.end}));
}
export function cekSuara(data, teks) {
  const terdengar = kataTranskrip(data).map((k) => k.t).join(' ');
  const a = normal(teks), b = normal(terdengar);
  if (a.length * b.length > 4000000) throw new Error('Naskah terlalu panjang untuk cek suara');
  const tabel = Array.from({length: a.length + 1}, () => new Uint16Array(b.length + 1));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) tabel[i][j] = a[i] === b[j] ? 1 + tabel[i + 1][j + 1] : Math.max(tabel[i + 1][j], tabel[i][j + 1]);
  let i = 0, j = 0; const beda = [];
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {i++; j++;}
    else if (i < a.length && (j >= b.length || tabel[i + 1][j] >= tabel[i][j + 1])) beda.push({naskah: a[i++], terdengar: ''});
    else beda.push({naskah: '', terdengar: b[j++]});
  }
  const instruksiBocor = [...terdengar.matchAll(/baca persis|intonasi|gaya narator|bahasa indonesia natural|tempo sedang|ucapkan dengan/gi)].map((m) => m[0]);
  const rasio = a.length + b.length ? 2 * tabel[0][0] / (a.length + b.length) : 0;
  return {rasio, beda, instruksiBocor, lolos: rasio >= 0.95 && !instruksiBocor.length};
}
if (utama(import.meta.url)) {
  try {
    if (process.argv.length !== 4) throw new Error('Pakai: cek-suara.mjs <audio.kata.json> <naskah.txt>');
    const hasil = cekSuara(JSON.parse(fs.readFileSync(pathAman(process.argv[2]), 'utf8')), fs.readFileSync(pathAman(process.argv[3]), 'utf8'));
    console.log(JSON.stringify(hasil, null, 2)); if (!hasil.lolos) process.exitCode = 1;
  } catch (e) {console.error(e.message); process.exitCode = 1;}
}
