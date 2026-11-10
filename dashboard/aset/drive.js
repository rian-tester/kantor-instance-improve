const panel = document.querySelector('[data-drive-kode]');
if (panel) {
  // Teks tampilan (KD-121): kamus app.* dari <script id="teks-app">, cadangannya teks Indonesia di argumen ketiga.
  const TEKS = (() => { try { return JSON.parse(document.getElementById('teks-app')?.textContent || '{}'); } catch { return {}; } })();
  const t = (k, v, asal) => { const s = typeof TEKS[k] === 'string' ? TEKS[k] : (asal ?? k); return v ? s.replace(/\{(\w+)\}/g, (m, n) => (n in v ? String(v[n] ?? '') : m)) : s; };
  const tombol = panel.querySelector('[data-salin-drive]');
  tombol.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(panel.querySelector('[data-kode]').textContent); tombol.textContent = t('app.drive.salin.ok', null, 'Kode disalin'); }
    catch { tombol.textContent = t('app.drive.salin.gagal', null, 'Pilih kode di atas, lalu salin'); }
  });
  const akhir = Number(panel.dataset.akhir);
  const hitung = () => { const sisa = Math.max(0, Math.ceil((akhir - Date.now()) / 1000)); panel.querySelector('[data-sisa]').textContent = sisa ? t('app.drive.sisa', { n: sisa }, 'Kode berlaku {n} detik lagi.') : t('app.drive.habis', null, 'Kode kedaluwarsa. Aku lagi mengecek sambungannya.'); };
  hitung();
  const jam = setInterval(hitung, 1000);
  const cek = async () => {
    try {
      const r = await fetch('/drive-kirim/status');
      if (r.ok) { const s = await r.json(); if (s.tersambung || !s.nunggu) { clearInterval(jam); location.reload(); return; } }
    } catch { panel.querySelector('[data-sisa]').textContent = t('app.drive.putus', null, 'Sambungan dashboard terputus. Aku coba cek lagi.'); }
    setTimeout(cek, 2000);
  };
  setTimeout(cek, 2000);
}
