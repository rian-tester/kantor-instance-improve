// Baca bagian "Keputusan kamu" di file task jadi soal, opsi, & jawaban owner. Dipakai server.mjs (dashboard) dan tes.
// Formatnya ditulis AI, jadi variasinya banyak: "1. Soal", "1) Soal", "### 1. Soal", "**1.** Soal", "**1. Soal**",
// opsi per baris ("a) …", "- a) …", "**a)** …") atau sebaris ("a) … · b) …"), baris "Kenapa: …", gambar
// "![](hasil/x.png)", rekomendasi (juga recommended/disyorkan/cadangan, KD-121) di opsi "(rekomendasi: alasan)" atau baris "Rekomendasi: a". Soal tanpa opsi juga boleh.
// Jawaban owner: "Jawaban owner: 1a teks", "Jawaban owner: 3: teks bebas buat soal 3", "Jawaban owner: teks bebas".

import { t as tx } from './bahasa/index.mjs';

const tebal = (s) => s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/^\*\*|\*\*$/g, '').trim();
const hurufKe = (n) => String.fromCharCode(97 + n);

// "x a) satu · b) dua" → ['x', ['a','satu'], ['b','dua']]. Hurufnya harus berurutan mulai `mulai`, biar kata biasa
// yang kebetulan ada "b)" gak kepotong.
function pecahOpsi(teks, mulai = 'a', minimal = 2) {
  const pola = /(^|[\s(·•|,;/])\*{0,2}([a-h])\)\*{0,2}\s+/g;
  const titik = [];
  let harap = mulai;
  for (const m of teks.matchAll(pola)) {
    if (m[2] !== harap) continue;
    titik.push({ i: m.index + m[1].length, j: m.index + m[0].length, huruf: m[2] });
    harap = String.fromCharCode(harap.charCodeAt(0) + 1);
  }
  if (titik.length < minimal) return null;
  const rapi = (s) => s.replace(/[\s·•|,;/]+$/, '').trim();
  return [rapi(teks.slice(0, titik[0].i)), ...titik.map((t, k) => [t.huruf, rapi(teks.slice(t.j, titik[k + 1]?.i ?? teks.length))])];
}

function opsiDari(huruf, teks) {
  const x = tebal(teks);
  const m = x.match(/^(.*?)\s*\((?:rekomendasi|saran|recommended|recommendation|recommend|disyorkan|syor|cadangan)\b\s*[:—–-]?\s*(.*?)\)\s*$/i) || x.match(/^(.*?)\s*[—–-]\s*(?:rekomendasi|saran|recommended|recommendation|recommend|disyorkan|syor|cadangan)\b\s*[:—–-]?\s*(.*)$/i);
  return { huruf: huruf.toLowerCase(), teks: (m ? m[1] : x).trim(), rek: !!m, alasan: m ? m[2].trim() : '' };
}

// Isi "Jawaban owner: …" → { nomor, huruf, teks }. nomor '' = jawaban bebas buat semuanya.
export function bacaJawaban(x) {
  const t = x.trim();
  const p = t.match(/^(\d{1,2})\s*[.):]?\s*([a-h])(?=$|[\s).,:])/i);
  if (p) return { nomor: String(Number(p[1])), huruf: p[2].toLowerCase(), teks: t };
  const n = t.match(/^(\d{1,2})\s*[.):]\s*(\S.*)$/);
  if (n) return { nomor: String(Number(n[1])), huruf: '', teks: t };
  return { nomor: '', huruf: '', teks: t };
}

export function soalKeputusan(teks) {
  const soal = [];
  const jawaban = [];
  for (const b of String(teks || '').split('\n')) {
    const j = b.match(/^\s*(?:[-*]\s+)?\**jawaban owner\**\s*:\**\s*(.+)$/i);
    const q = b.match(/^\s*(?:#{2,4}\s+)?(?:[-*]\s+)?\**(\d{1,2})[.)]\**\s+(.+?)\s*$/);
    const akhir = soal.at(-1);
    const harap = akhir ? hurufKe(akhir.opsi.length) : 'a';
    // "a) …" selalu opsi; "a. …" cuma kalau hurufnya pas urutan opsi berikutnya (biar kalimat biasa gak kebaca opsi).
    const oKurung = b.match(/^\s*(?:[-*]\s+)?\**([a-h])\)\**\s+(.+)$/i);
    const oTitik = b.match(/^\s*(?:[-*]\s+)?\**([a-h])\.\**\s+(.+)$/i);
    const o = oKurung || (oTitik && oTitik[1].toLowerCase() === harap ? oTitik : null);
    const s = b.match(/^\s*(?:[-*]\s+)?\**(?:rekomendasi|saran|recommended|recommendation|recommend|disyorkan|syor|cadangan)(?:\s+\w+)?\**\s*:?\**\s*:?\s*([a-h])\b[).,:]?\s*(.*)$/i);
    const kenapa = b.match(/^\s*(?:[-*]\s+)?\**(?:kenapa|why|kerana|sebab)\**\s*:\**\s*(.*)$/i);
    const gambar = [...b.matchAll(/!\[[^\]]*\]\(\s*<?([^)\s>]+)>?\s*\)/g)].map((m) => m[1]);
    if (j) jawaban.push(bacaJawaban(j[1]));
    else if (q) {
      const pecah = pecahOpsi(q[2]);
      const isi = { nomor: String(Number(q[1])), teks: tebal(pecah ? pecah[0] : q[2]), opsi: [], kenapa: '', gambar: [] };
      if (pecah) isi.opsi.push(...pecah.slice(1).map(([h, x]) => opsiDari(h, x)));
      soal.push(isi);
    } else if (!akhir) continue;
    else if (gambar.length) akhir.gambar.push(...gambar);
    else if (kenapa) akhir.kenapa = tebal(kenapa[1]);
    else if (o) {
      const pecah = pecahOpsi(`${o[1]}) ${o[2]}`, o[1].toLowerCase(), 1);
      for (const [h, x] of (pecah || ['', [o[1], o[2]]]).slice(1)) akhir.opsi.push(opsiDari(h, x));
    } else if (s) {
      const x = akhir.opsi.find((p) => p.huruf === s[1].toLowerCase());
      if (x) { x.rek = true; x.alasan = x.alasan || tebal(s[2]); }
    } else if (b.trim()) {
      const tambah = tebal(b.trim());
      if (akhir.opsi.length) akhir.opsi.at(-1).teks += ` ${tambah}`;
      else if (akhir.kenapa) akhir.kenapa += ` ${tambah}`;
      else akhir.teks += ` ${tambah}`;
    }
  }
  // Nomor jawaban yang sama ditulis dua kali (diedit tangan): yang terakhir yang dipakai.
  const unik = [];
  for (const x of jawaban) {
    const k = x.nomor ? unik.findIndex((y) => y.nomor === x.nomor) : -1;
    if (k >= 0) unik[k] = x; else unik.push(x);
  }
  return { soal, jawaban: unik };
}

// Owner udah jawab semua soal (atau nulis jawaban bebas tanpa nomor) → tinggal dicatat tim.
export function sudahTerjawab({ soal, jawaban }) {
  if (!jawaban.length) return false;
  if (jawaban.some((j) => !j.nomor)) return true;
  return soal.every((q) => jawaban.some((j) => j.nomor === q.nomor));
}

// Tulis jawaban ke isi file task: baris "Jawaban owner: …" di bawah "## Keputusan kamu" (format yang dibaca detak &
// manajer, lihat task/README.md). Jawaban lama buat nomor yang sama diganti, jawaban bebas yang sama persis gak
// ditulis dua kali. `kapan` = "14/10 12:22". Status gak diubah: tim yang nyatet ke "Udah" & lanjut kerja.
export function pasangJawaban(isiFile, isian, kapan, hari) {
  const baris = isiFile.split('\n');
  const awal = baris.findIndex((b) => /^## Keputusan (kamu|lu)\s*$/i.test(b));
  if (awal < 0) throw new Error(tx('db.kp.bagianGakAda'));
  let akhir = baris.findIndex((b, i) => i > awal && /^## /.test(b));
  if (akhir < 0) akhir = baris.length;
  const nomorBaru = new Set(isian.filter((x) => x.nomor).map((x) => x.nomor));
  const bebasBaru = new Set(isian.filter((x) => !x.nomor).map((x) => x.teks));
  const isi = baris.slice(awal + 1, akhir).filter((b) => {
    const j = b.match(/^\s*(?:[-*]\s+)?\**jawaban owner\**\s*:\**\s*(.+)$/i);
    if (!j) return true;
    const x = bacaJawaban(j[1]);
    return x.nomor ? !nomorBaru.has(x.nomor) : !bebasBaru.has(x.teks.replace(/\s*\(lewat dashboard [^)]*\)$/, ''));
  });
  while (isi.length && !isi.at(-1).trim()) isi.pop();
  for (const x of isian) isi.push(`Jawaban owner: ${x.nomor ? `${x.nomor}${x.huruf ? x.huruf : ':'} ` : ''}${x.teks} (lewat dashboard ${kapan})`);
  isi.push('');
  const hasil = [...baris.slice(0, awal + 1), ...isi, ...baris.slice(akhir)].join('\n');
  return hari ? hasil.replace(/^update:.*$/m, `update: ${hari}`) : hasil;
}
