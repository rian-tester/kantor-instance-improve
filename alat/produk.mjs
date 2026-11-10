import fs from 'node:fs';
import path from 'node:path';
import {pathAman, fotoChatAman, kantor, utama} from './video-aman.mjs';
const toko = ['tokopedia.com', 'shopee.co.id', 'shopee.com', 'shope.ee'];
const cdn = ['tokopedia-static.net', 'tokopedia.net', 'tiktokcdn.com', 'tiktokcdn-us.com', 'ibytedtos.com', 'ibyteimg.com', 'byteimg.com', 'tiktokcdn-eu.com', 'byteoversea.com', 'susercontent.com'];
const cocok = (host, daftar) => daftar.some((d) => host === d || host.endsWith(`.${d}`));
export function urlAman(teks, media = false) {
  const u = new URL(teks);
  if (u.protocol !== 'https:' || u.username || u.password || (u.port && u.port !== '443') || !cocok(u.hostname, media ? cdn : toko)) throw new Error('Host produk atau gambar tidak diizinkan');
  return u;
}
// Redirect diperiksa ulang, termasuk saat menuju CDN; respons dibaca bertahap agar batas tetap berlaku.
export async function ambil(url, media = false, fetcher = fetch, batas = media ? 32 << 20 : 8 << 20) {
  const signal = AbortSignal.timeout(20000);
  for (let i = 0; i < 6; i++) {
    const u = urlAman(url, media);
    const r = await fetcher(u, {redirect: 'manual', signal});
    if (r.status >= 300 && r.status < 400) { await r.body?.cancel(); url = new URL(r.headers.get('location'), u).href; continue; }
    if (!r.ok) throw new Error(`Toko belum bisa dibaca (${r.status}). Pakai mode manual`);
    if (Number(r.headers.get('content-length')) > batas) { await r.body?.cancel(); throw new Error('Unduhan terlalu besar'); }
    let ukuran = 0; const bagian = [];
    for await (const b of r.body) { ukuran += b.length; if (ukuran > batas) throw new Error('Unduhan terlalu besar'); bagian.push(b); }
    return {isi: Buffer.concat(bagian), url: u.href};
  }
  throw new Error('Redirect terlalu banyak');
}
export function cacheApollo(html) {
  const mulai = html.search(/(?:window\.)?(?:__APOLLO_STATE__|__cache)\s*=/);
  if (mulai < 0) throw new Error('Cache produk tidak ditemukan. Pakai mode manual');
  const awal = html.indexOf('{', mulai); let dalam = 0, kutip = false, escape = false;
  for (let i = awal; i < html.length; i++) {
    const c = html[i];
    if (kutip) { if (escape) escape = false; else if (c === '\\') escape = true; else if (c === '"') kutip = false; }
    else if (c === '"') kutip = true;
    else if (c === '{') dalam++;
    else if (c === '}' && --dalam === 0) return JSON.parse(html.slice(awal, i + 1));
  }
  throw new Error('Cache produk terpotong. Pakai mode manual');
}
export function parseTokopedia(html, tanggal = new Date().toISOString()) {
  const cache = cacheApollo(html);
  const semua = [];
  const kunjungi = (x) => {if (!x || typeof x !== 'object') return; semua.push(x); for (const v of Object.values(x)) kunjungi(v);};
  kunjungi(cache);
  const tipe = (t) => semua.filter((x) => x.__typename === t);
  const deref = (x) => x?.__ref ? cache[x.__ref] : x?.type === 'id' ? cache[x.id] : x;
  const basic = tipe('pdpBasicInfo')[0] || {};
  const snap = tipe('pdpDataProductContent')[0] || semua.find((x) => typeof x.name === 'string' && x.name.length > 25) || {};
  const harga = tipe('pdpContentSnapshotPrice')[0];
  const rating = tipe('productrevProductRating')[0];
  const varian = tipe('pdpProductVariantChildren').map((v) => ({judul: v.productName, nama: v.optionName?.json || [], stok: deref(v.stock)?.stock ?? null, harga: v.price, tanggalCek: tanggal}));
  const media = tipe('pdpContentSnapshotMedia');
  const judul = snap.name || snap.title || varian[0]?.judul || semua.find((x) => typeof x.productName === 'string')?.productName || semua.find((x) => typeof x.title === 'string' && x.title.length > 30)?.title;
  if (!judul) throw new Error('Judul produk belum terbaca. Pakai mode manual');
  return {judul, deskripsi: tipe('pdpDataProductDetailDescription').map((x) => x.content).join('\n'), varian, harga: harga?.value ?? null, tanggalCek: tanggal, rating: rating?.ratingScore ?? null, jumlahUlasan: rating?.totalRating ?? null, topikUlasan: tipe('topicAggs'), toko: basic.shopName || null, foto: [...new Set(media.filter((x) => x.type === 'image').map((x) => x.URLMaxRes || x.URLOriginal))], video: [...new Set(media.filter((x) => x.type === 'video').map((x) => x.videoURLAndroid).filter(Boolean))]};
}
export const fotoBesar = (url) => url.replace(/~tplv-[^?]+?(?:\.webp|\.jpeg|\.jpg)(?=\?|$)/, '~tplv-aphluv4xwc-origin-jpeg.jpeg');
const entitas = (s) => s.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'");
export function parseTikTok(html) {
  const meta = {};
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const attrs = Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map((m) => [m[1], entitas(m[2])]));
    meta[attrs.property || attrs.name] = attrs.content;
  }
  let og = {};
  const m = html.match(/"og_info"\s*:\s*(\{[^{}]*\})/);
  if (m) { try { og = JSON.parse(m[1]); } catch { /* meta tetap dipakai */ } }
  const judul = og.title || og.og_title || meta['og:title'];
  const foto = og.image || og.og_image || meta['og:image'];
  if (!judul) throw new Error('Pratinjau belum terbaca. Pakai mode manual');
  return {judul, foto: foto ? [fotoBesar(foto)] : [], video: [], manual: true, catatan: 'Minta owner teks halaman, harga, varian dan foto lain'};
}
export function parseProduk(url, html) {
  const u = urlAman(url);
  if (cocok(u.hostname, ['shopee.co.id', 'shopee.com', 'shope.ee'])) return {manual: true, catatan: 'Minta owner teks halaman dan foto produk', foto: [], video: []};
  return /^(vt|shop-id)\./.test(u.hostname) ? parseTikTok(html) : parseTokopedia(html);
}
function simpan(folder, nama, isi) { const file = pathAman(path.join(folder, nama)); fs.mkdirSync(path.dirname(file), {recursive: true}); fs.writeFileSync(file, isi, {flag: 'wx'}); }
export async function produk(args) {
  const [perintah, ...sisa] = args; let url, keluar, teks; const foto = [];
  for (let i = 0; i < sisa.length; i++) {
    const a = sisa[i];
    if (a === '--keluar') keluar = sisa[++i]; else if (a === '--teks') teks = sisa[++i]; else if (a === '--foto') foto.push(sisa[++i]); else if (!url && perintah === 'baca' && !a.startsWith('-')) url = a; else throw new Error(`Argumen tidak dikenal: ${a}`);
  }
  if (!keluar || !['baca', 'manual'].includes(perintah)) throw new Error('Pakai: produk.mjs baca <url> --keluar konten/produk/<slug> atau manual --keluar <folder> --teks <teks.txt> --foto <foto>');
  const folder = pathAman(keluar); let data; const sumber = {url: url || null, tanggal: new Date().toISOString(), berkas: []};
  if (perintah === 'manual') {
    if (!teks || foto.length === 0) throw new Error('Mode manual perlu --teks dan minimal satu --foto');
    data = {judul: fs.readFileSync(pathAman(teks, kantor, {baca: ['kotak-masuk']}), 'utf8').split('\n')[0], deskripsi: fs.readFileSync(pathAman(teks, kantor, {baca: ['kotak-masuk']}), 'utf8'), manual: true, foto: [], video: []};
    for (const [i, f] of foto.entries()) {
      const ext = path.extname(f).toLowerCase(); if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) throw new Error('Foto harus jpg, png, atau webp');
      const asal = f.startsWith('/tmp/') ? fotoChatAman(f) : pathAman(f, kantor, {baca: ['kotak-masuk']}); if (fs.statSync(asal).size > 32 << 20) throw new Error('Foto terlalu besar');
      const nama = `foto/${String(i + 1).padStart(2, '0')}${ext}`; simpan(folder, nama, fs.readFileSync(asal)); data.foto.push(nama); sumber.berkas.push({file: nama, asal: f});
    }
  } else {
    const u = urlAman(url); const shopee = cocok(u.hostname, ['shopee.co.id', 'shopee.com', 'shope.ee']);
    const respons = shopee ? {url, isi: Buffer.alloc(0)} : await ambil(url);
    data = parseProduk(respons.url, respons.isi.toString('utf8'));
    for (const jenis of ['foto', 'video']) {
      const urls = data[jenis]; if (urls.length > 24) throw new Error('Media terlalu banyak. Pakai mode manual');
      for (const [i, asal] of urls.entries()) {
        const r = await ambil(asal, true); const ext = jenis === 'video' ? '.mp4' : (/\.(png|webp)(?:\?|$)/.exec(asal)?.[1] ? `.${/\.(png|webp)(?:\?|$)/.exec(asal)[1]}` : '.jpg');
        const nama = `${jenis}/${String(i + 1).padStart(2, '0')}${ext}`; simpan(folder, nama, r.isi); sumber.berkas.push({file: nama, url: asal});
      }
    }
  }
  for (const jenis of ['foto', 'video']) fs.mkdirSync(pathAman(path.join(folder, jenis)), {recursive: true});
  simpan(folder, 'produk.json', JSON.stringify(data, null, 2)); simpan(folder, 'sumber.json', JSON.stringify(sumber, null, 2));
  return {folder, manual: Boolean(data.manual)};
}
if (utama(import.meta.url)) produk(process.argv.slice(2)).then(console.log).catch((e) => {console.error(e.message); process.exitCode = 1;});
