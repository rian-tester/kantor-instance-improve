// Lembur.id: penerjemah pesan dari alat/* (Repliz, fal, Drive, web) yang diteruskan dashboard ke owner (KD-121).
// alat/*.mjs ikut jalan sendirian (dipanggil agent dari terminal) dan teksnya Indonesia, jadi dashboard nerjemahin di
// perbatasan: kamus id/alat.json = daftar templat pesan persis kayak di alat (isian pakai {nama}), ms/en isinya terjemahan.
// Pesan masuk dicocokin ke templat id (utuh, dari awal sampe akhir), isiannya ditangkep, terus dirender pakai templat
// bahasa aktif. Pesan yang gak dikenal (mis. teks mentah dari API Repliz) dibiarin apa adanya. Bahasa id = dibalikin
// persis, gak disentuh. Tes uji/kd121-alat.test.mjs nagih tiap templat id masih ada di sumber alat/ (biar gak basi).
import { kamus, bahasaAktif, t } from './index.mjs';

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let pola = null;
function polaId() {
  if (pola) return pola;
  pola = Object.entries(kamus('id')).filter(([k]) => k.startsWith('al.')).map(([kunci, templat]) => {
    const statis = templat.replace(/\{\w+\}/g, '');
    const re = new RegExp(`^${esc(templat).replace(/\\\{(\w+)\\\}/g, '(?<$1>[\\s\\S]*?)')}$`);
    return { kunci, re, panjang: statis.length };
  }).sort((a, b) => b.panjang - a.panjang);
  return pola;
}

// Kunci kamus (al.*) yang cocok sama pesan Indonesia ini, atau null. Dipakai tes buat mastiin kamus gak basi.
export const kunciPesan = (teks) => polaId().find(({ re }) => re.test(teks))?.kunci ?? null;

// opsi.<isian>: fungsi yang nerjemahin nilai isian bernama itu (mis. status → label status Repliz bahasa aktif).
export function terjemahAlat(teks, opsi = {}, kode = bahasaAktif()) {
  if (typeof teks !== 'string' || !teks || kode === 'id') return teks;
  for (const { kunci, re } of polaId()) {
    const m = re.exec(teks);
    if (!m) continue;
    const isian = {};
    for (const [nama, nilai] of Object.entries(m.groups || {})) {
      isian[nama] = typeof opsi[nama] === 'function' ? opsi[nama](nilai) : nilai.split('; ').map((x) => terjemahAlat(x, opsi, kode)).join('; ');
    }
    return t(kunci, isian, kode);
  }
  return teks;
}
// Beberapa baris (keluaran alat/repliz.mjs): tiap baris diterjemahin sendiri-sendiri.
export const terjemahBaris = (teks, opsi, kode) => String(teks ?? '').split('\n').map((x) => terjemahAlat(x, opsi, kode)).join('\n');
