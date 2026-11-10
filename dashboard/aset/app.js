// Dashboard Lembur.id: drawer detail task, palet cari (⌘K atau /), popover jatah, tombol salin perintah, dan isi
// halaman yang disegerin sendiri tiap 30 detik (tanpa reload, gak ganggu kalau drawer/cari lagi kebuka).
(() => {
  // Teks tampilan (KD-121): kamus app.* bahasa aktif diselipin server di <script id="teks-app">. Kunci gak ada (server
  // lama) → pakai teks Indonesia bawaan di argumen ketiga, jadi kunci mentah gak pernah tampil.
  const TEKS = (() => { try { return JSON.parse(document.getElementById('teks-app')?.textContent || '{}'); } catch { return {}; } })();
  const t = (k, v, asal) => { const s = typeof TEKS[k] === 'string' ? TEKS[k] : (asal ?? k); return v ? s.replace(/\{(\w+)\}/g, (m, n) => (n in v ? String(v[n] ?? '') : m)) : s; };
  const $ = (s, a = document) => a.querySelector(s);
  const drawer = $('.drawer');
  const tirai = $('.tirai');
  const palet = $('.palet');
  const toast = $('.toast');
  let pemicu = null;
  let jedaToast;

  const kabar = (teks) => {
    if (!toast) return;
    toast.textContent = teks;
    toast.hidden = false;
    clearTimeout(jedaToast);
    jedaToast = setTimeout(() => { toast.hidden = true; }, 2600);
  };

  // ---------- drawer detail task ----------
  async function buka(f, { dariHash = false } = {}) {
    if (!drawer || !f) return;
    tutupPop();
    pemicu = document.activeElement;
    drawer.innerHTML = `<div class="kepala-dr"><span class="pegangan" aria-hidden="true"></span><div class="kepala-teks"><p class="redup">${t('app.drawer.memuat', null, 'Memuat…')}</p></div></div>`;
    drawer.hidden = false;
    tirai.hidden = false;
    requestAnimationFrame(() => { drawer.classList.add('buka'); tirai.classList.add('buka'); });
    document.body.classList.add('terkunci');
    if (!dariHash) history.pushState({ t: f }, '', `#t=${encodeURIComponent(f)}`);
    try {
      const r = await fetch(`/fragmen/task/${encodeURIComponent(f)}`, { credentials: 'same-origin', cache: 'no-store' });
      if (r.status === 401) return location.reload();
      drawer.innerHTML = await r.text();
    } catch {
      drawer.innerHTML = `<div class="kepala-dr"><div class="kepala-teks"><h2 id="judul-drawer">${t('app.drawer.gagal', null, 'Gagal memuat')}</h2><p class="redup">${t('app.drawer.gagal.ket', null, 'Cek koneksi, terus coba lagi.')}</p></div><button class="tutup" type="button" data-tutup aria-label="${t('app.tutup', null, 'Tutup')}">×</button></div>`;
    }
    drawer.querySelector('.tutup')?.focus({ preventScroll: true });
  }
  function tutup({ dariHash = false } = {}) {
    if (!drawer || drawer.hidden) return;
    // Ditutup pakai tombol: mundurin riwayat (biar tombol Back HP gak buka lagi); popstate yang beneran nutup.
    if (!dariHash && history.state?.t) return history.back();
    if (!dariHash && location.hash.startsWith('#t=')) history.replaceState({}, '', location.pathname + location.search);
    drawer.classList.remove('buka');
    tirai.classList.remove('buka');
    document.body.classList.remove('terkunci');
    setTimeout(() => { if (!drawer.classList.contains('buka')) { drawer.hidden = true; tirai.hidden = true; drawer.innerHTML = ''; } }, 230);
    pemicu?.focus?.({ preventScroll: true });
  }
  const dariHash = () => (location.hash.startsWith('#t=') ? decodeURIComponent(location.hash.slice(3)) : '');
  window.addEventListener('popstate', () => { const f = dariHash(); f ? buka(f, { dariHash: true }) : tutup({ dariHash: true }); });
  if (dariHash()) buka(dariHash(), { dariHash: true });

  // ---------- salin perintah ----------
  async function salin(b) {
    const teks = b.dataset.salin;
    let ok = true;
    try { await navigator.clipboard.writeText(teks); } catch {
      const ta = document.createElement('textarea');
      ta.value = teks;
      ta.setAttribute('readonly', '');
      ta.className = 'sr';
      document.body.appendChild(ta);
      ta.select();
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove();
    }
    if (!ok) return kabar(t('app.salin.gagal', { teks }, 'Gagal nyalin. Ketik manual: {teks}'));
    b.classList.add('tersalin');
    setTimeout(() => b.classList.remove('tersalin'), 1600);
    kabar(teks.includes('<') ? t('app.salin.ok.isian', null, 'Tersalin. Ganti bagian <…> pas nempel di aplikasi Claude.') : t('app.salin.ok', null, 'Tersalin. Tempel di aplikasi Claude, sesi kantor.'));
  }

  // ---------- popover (lampu jatah) ----------
  function tutupPop() {
    document.querySelectorAll('[data-pop]').forEach((b) => {
      b.setAttribute('aria-expanded', 'false');
      const p = document.getElementById(b.dataset.pop);
      if (p) p.hidden = true;
    });
  }
  function togglePop(b) {
    const p = document.getElementById(b.dataset.pop);
    if (!p) return;
    const mauBuka = p.hidden;
    tutupPop();
    if (mauBuka) { p.hidden = false; b.setAttribute('aria-expanded', 'true'); }
  }

  // ---------- palet cari ----------
  const input = palet?.querySelector('input');
  const daftar = palet?.querySelector('ul');
  let indeks = [];
  const bacaIndeks = (doc) => { try { indeks = JSON.parse(doc.getElementById('indeks')?.textContent || '[]'); } catch { /* biarin */ } };
  bacaIndeks(document);
  let hasil = [];
  let pilih = 0;
  const norm = (s) => (s || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  function saring() {
    const kata = norm(input.value).split(/\s+/).filter(Boolean);
    hasil = indeks
      .map((x) => ({ x, j: norm(x.j), semua: norm(`${x.j} ${x.d} ${x.s || ''}`) }))
      .filter((h) => kata.every((k) => h.semua.includes(k)))
      .sort((a, b) => (kata.length ? Number(kata.every((k) => b.j.includes(k))) - Number(kata.every((k) => a.j.includes(k))) : 0))
      .slice(0, 30)
      .map((h) => h.x);
    pilih = 0;
    gambar();
  }
  function tandai() {
    daftar.querySelectorAll('[role=option]').forEach((li, i) => li.setAttribute('aria-selected', String(i === pilih)));
    input.setAttribute('aria-activedescendant', `pl-${pilih}`);
    daftar.querySelector(`#pl-${pilih}`)?.scrollIntoView({ block: 'nearest' });
  }
  function gambar() {
    daftar.textContent = '';
    if (!hasil.length) {
      const li = document.createElement('li');
      li.className = 'palet-kosong';
      li.textContent = t('app.cari.kosong', null, 'Gak ketemu. Coba kode task (mis. T-01), nama tim, atau kata di judulnya.');
      daftar.appendChild(li);
      return;
    }
    hasil.forEach((x, i) => {
      const li = document.createElement('li');
      li.id = `pl-${i}`;
      li.setAttribute('role', 'option');
      const b = document.createElement('b');
      b.textContent = x.j;
      const s = document.createElement('span');
      s.textContent = x.d;
      li.append(b, s);
      li.addEventListener('click', () => jalankan(x));
      li.addEventListener('mousemove', () => { if (pilih !== i) { pilih = i; tandai(); } });
      daftar.appendChild(li);
    });
    tandai();
  }
  function jalankan(x) {
    tutupPalet();
    if (x.t) buka(x.t); else location.href = x.h;
  }
  function bukaPalet() {
    if (!palet) return;
    tutupPop();
    palet.hidden = false;
    input.value = '';
    saring();
    input.focus();
  }
  function tutupPalet() { if (palet && !palet.hidden) palet.hidden = true; }
  input?.addEventListener('input', saring);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); pilih = Math.min(hasil.length - 1, pilih + 1); tandai(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); pilih = Math.max(0, pilih - 1); tandai(); }
    else if (e.key === 'Enter') { e.preventDefault(); if (hasil[pilih]) jalankan(hasil[pilih]); }
  });
  palet?.addEventListener('click', (e) => { if (e.target === palet) tutupPalet(); });

  // ---------- klik & tombol ----------
  document.addEventListener('click', (e) => {
    const el = e.target;
    if (el.closest('[data-tutup]')) { e.preventDefault(); return tutup(); }
    const s = el.closest('[data-salin]');
    if (s) { e.preventDefault(); return salin(s); }
    const t = el.closest('[data-task]');
    if (t && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) { e.preventDefault(); return buka(t.dataset.task); }
    const p = el.closest('[data-pop]');
    if (p) return togglePop(p);
    if (el.closest('[data-cari]')) return bukaPalet();
    if (!el.closest('.pop')) tutupPop();
  });
  document.addEventListener('keydown', (e) => {
    const ngetik = e.target.closest?.('input, textarea, select, [contenteditable]');
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); return palet.hidden ? bukaPalet() : tutupPalet(); }
    if (e.key === '/' && !ngetik && palet?.hidden) { e.preventDefault(); return bukaPalet(); }
    if (e.key === 'Escape') {
      if (palet && !palet.hidden) return tutupPalet();
      if (drawer && !drawer.hidden) return tutup();
      tutupPop();
    }
  });

  // ---------- segerin isi ----------
  // Tiap 30 detik nanya sidik ke server. Berubah → ambil halaman yang sama, ganti isi bagian [data-segar] aja.
  // Lagi buka drawer/cari/popover atau lagi ngisi form: tunda ke putaran berikutnya.
  // paksa = abis owner ngirim jawaban: langsung ambil, gak peduli drawer lagi kebuka (drawer bukan bagian [data-segar]).
  let sidik = document.body.dataset.sidik;
  async function segerin(paksa = false) {
    if (document.hidden && !paksa) return;
    try {
      const r = await fetch('/sidik', { cache: 'no-store', credentials: 'same-origin' });
      if (r.status === 401) return location.reload();
      if (!r.ok) return;
      const baru = (await r.text()).trim();
      if (baru === sidik && !paksa) return;
      const sibuk = (palet && !palet.hidden) || document.querySelector('.pop:not([hidden])')
        || document.activeElement?.matches?.('input, textarea, select');
      if (sibuk && !paksa) return;
      // Drawer task kebuka (mis. nunggu manajer nyatet jawaban): isinya ikut digambar ulang biar statusnya gak basi.
      if (!paksa && drawer && !drawer.hidden) await muatUlangDrawer();
      const h = await fetch(location.pathname + location.search, { cache: 'no-store', credentials: 'same-origin' });
      if (!h.ok) return;
      const doc = new DOMParser().parseFromString(await h.text(), 'text/html');
      document.querySelectorAll('[data-segar]').forEach((el) => {
        const x = doc.querySelector(`[data-segar="${el.dataset.segar}"]`);
        if (x && x.innerHTML !== el.innerHTML) el.innerHTML = x.innerHTML;
      });
      bacaIndeks(doc);
      sidik = doc.body.dataset.sidik || baru;
    } catch { /* putus sebentar: coba lagi nanti */ }
  }
  setInterval(segerin, 30000);
  // Ada status yang lagi ditunggu (jawaban owner bentar lagi/lagi dicatat): cek tiap 5 detik, bukan 30.
  setInterval(() => { if (document.querySelector('[data-pantau]')) segerin(); }, 5000);

  // Form penting (terbitin web, balik versi): minta konfirmasi dulu.
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('form[data-yakin]');
    if (f && !window.confirm(f.dataset.yakin)) e.preventDefault();
  }, true);

  // ---------- jawab keputusan ----------
  // Form [data-jawab] dikirim lewat fetch: halaman gak pindah, drawer & isi halaman langsung digambar ulang.
  async function muatUlangDrawer() {
    const f = drawer && !drawer.hidden ? dariHash() : '';
    if (!f) return;
    const gulir = drawer.querySelector('.badan-dr')?.scrollTop || 0;
    const r = await fetch(`/fragmen/task/${encodeURIComponent(f)}`, { credentials: 'same-origin', cache: 'no-store' });
    if (r.status === 401) return location.reload();
    if (!r.ok) return;
    drawer.innerHTML = await r.text();
    const b = drawer.querySelector('.badan-dr');
    if (b) b.scrollTop = gulir;
  }
  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('form[data-jawab]');
    if (!form) return;
    e.preventDefault();
    const tombol = e.submitter || form.querySelector('button');
    if (tombol?.disabled) return;
    if (tombol) { tombol.disabled = true; tombol.setAttribute('aria-busy', 'true'); }
    let hasil = { ok: false, pesan: t('app.jawab.gagal', null, 'Gagal nyimpen. Cek koneksi, terus coba lagi.') };
    try {
      const r = await fetch(form.action, { method: 'POST', credentials: 'same-origin', headers: { 'X-Dari': 'app' }, body: new URLSearchParams(new FormData(form)) });
      if (r.status === 401) return location.reload();
      hasil = await r.json();
    } catch { /* pesan bawaan */ }
    kabar(hasil.pesan);
    if (hasil.ok) {
      await muatUlangDrawer();
      await segerin(true);
    } else if (tombol) { tombol.disabled = false; tombol.removeAttribute('aria-busy'); }
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) segerin(); });

  // ---------- update kit dari dashboard ----------
  // Tombol "Update sekarang": abis dikonfirmasi, tombolnya dimatiin biar gak kepencet dua kali (server juga nolak dobel).
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('form[data-update]');
    if (!f || e.defaultPrevented) return;
    const b = f.querySelector('button');
    if (b) { b.disabled = true; b.setAttribute('aria-busy', 'true'); b.textContent = t('app.update.mulai', null, 'Mulai update…'); }
  });
  // Halaman /update pas lagi jalan: tanya /update/status tiap 3 detik. Dashboard nyala ulang di tengah jalan = fetch
  // gagal/502 sebentar, terus aja nanya. Udah gak "jalan" → muat ulang, server nampilin hasilnya.
  const tunggu = document.querySelector('[data-update-tunggu]');
  if (tunggu) {
    const awal = Date.now();
    const tanya = async () => {
      try {
        const r = await fetch('/update/status', { cache: 'no-store', credentials: 'same-origin' });
        if (r.status === 401) return location.reload();
        if (r.ok && (await r.json()).tahap !== 'jalan') return location.reload();
      } catch { /* dashboard lagi nyala ulang */ }
      if (Date.now() - awal > 600000) tunggu.querySelector('[data-kelamaan]')?.removeAttribute('hidden');
      setTimeout(tanya, 3000);
    };
    setTimeout(tanya, 3000);
  }
})();
