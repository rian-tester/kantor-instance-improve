import { t, bahasaAktif } from './bahasa/index.mjs';

// Tolak seluruh judul yang mencurigakan sebelum pemotongan/Markdown dibuang.
// Lebih baik cuma status daripada potongan kredensial atau kontak di denah.
export function judulAman(judul) {
  if (typeof judul !== 'string') return '';
  const s = judul.normalize('NFKC').replace(/\p{Cf}/gu, '').replace(/\p{Cc}/gu, ' ');
  if (/(?:rahasia|secret|token|password|passwd|sandi|api[ _-]?key|kunci|bearer|authorization|private[ _-]?key)|(?:https?:\/\/|www\.)|eyJ[\w-]*\.[\w-]+\.[\w-]+|@|\p{N}|[A-Za-z0-9_+/=-]{24,}/iu.test(s)) return '';
  const bersih = s.replace(/```[\s\S]*?(?:```|$)/g, ' ').replace(/`[^`]*(?:`|$)/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/<[^>]*>/g, ' ')
    .replace(/[*_#~>|{}[\]\\]/g, ' ').replace(/\s+/g, ' ').trim();
  return /\p{L}/u.test(bersih) ? bersih : '';
}

export function potongKata(s, batas = 60) {
  if (s.length <= batas) return s;
  const awal = s.slice(0, batas - 1);
  if (/\s/.test(s[batas - 1])) return `${awal.trimEnd()}…`;
  const spasi = awal.lastIndexOf(' ');
  return spasi > 0 ? `${awal.slice(0, spasi)}…` : '…';
}

export function bikinGelembung(m, kode = bahasaAktif()) {
  if (!m || !['kerja', 'nunggu', 'santai'].includes(m.keadaan)) return '';
  // Santai sengaja kosong: denah tetap tenang, terutama di HP.
  if (m.keadaan === 'santai') return '';
  const judul = judulAman(m.task?.judul);
  return potongKata(judul ? t(`db.gelembung.${m.keadaan}`, { judul }, kode) : t(`db.keadaan.${m.keadaan}`, null, kode));
}

export function dataKantor(d, kode = bahasaAktif()) {
  return { tampilan: d.tampilan, lokasi: d.lokasi, owner: d.owner,
    manajer: d.manajer.map(({ id, nama, jabatan, rupa, keadaan, task }) => ({
      id, nama, jabatan, rupa, keadaan, task, gelembung: bikinGelembung({ keadaan, task }, kode),
    })),
  };
}
