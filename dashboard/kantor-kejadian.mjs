import crypto from 'node:crypto';

// Hanya jenis, identitas buram dan id karakter. Tidak ada judul, kontak, tanggal lahir atau isi laporan.
export function kejadianKantor({ task = [], web, manajer = [] }, { laporan = [], update, ulangTahun = {}, tanggal } = {}) {
  const hasil = [];
  const tambah = (jenis, sidik, orang = '') => hasil.push({ jenis, id: crypto.createHash('sha256').update(`${jenis}:${sidik}`).digest('hex').slice(0, 24), orang });
  const tim = new Set(manajer.map((m) => m.id));
  const beres = task.filter((t) => t.status === 'beres').sort((a, b) => String(a.update || '').localeCompare(String(b.update || ''))).slice(-150);
  for (const t of beres) tambah('kurir', `${t.f}:${t.update}`, tim.has(t.pegang) ? t.pegang : '');
  for (const m of manajer) if (m.keadaan === 'nunggu') tambah('nunggu', `${m.id}:${m.task?.f || ''}`, m.id);
  if (web?.tayang) tambah('terbit', web.tayang);
  for (const l of laporan) if (/^laporan-\d{4}-\d{2}-\d{2}-(pagi|malam)\.md$/.test(l)) tambah('laporan', l);
  if (update && ['jalan', 'beres', 'gagal', 'keputus'].includes(update.tahap)) tambah('kabar', `${update.mulai}:${update.tahap}`);
  // Skema opsional: ulangTahun: { owner: "MM-DD", sari: "YYYY-MM-DD" }.
  for (const [id, lahir] of Object.entries(ulangTahun || {})) {
    if (id !== 'owner' && !tim.has(id)) continue;
    if (typeof lahir === 'string' && /^(?:\d{4}-)?\d{2}-\d{2}$/.test(lahir) && lahir.slice(-5) === tanggal?.slice(-5)) tambah('ultah', `${tanggal}:${id}`, id === 'owner' ? '' : id);
  }
  return hasil.slice(-200);
}
