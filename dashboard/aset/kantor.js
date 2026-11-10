// Kantor animasi Lembur.id. Karakter jalan lewat lorong ke meja (lagi kerja), ruang rapat (nunggu keputusan
// owner), atau pantry/lounge (santai), ngikutin status task dari /data.json. Gak ada AI di sini, nol jatah.
// Tiap template punya gambar ruangan, peta titik (persen gambar dasarnya, titik = ujung kaki / roda kursi), ukuran
// orang, dan folder sprite sendiri. Karakter & gambar ruangan: lihat aset/LISENSI-karakter-MIT.txt.
(() => {
  const peta = document.querySelector('[data-peta]');
  if (!peta) return;
  // Teks tampilan (KD-121): kamus app.* bahasa aktif diselipin server di <script id="teks-app">. Kunci gak ada (server
  // lama) → pakai teks Indonesia bawaan di argumen ketiga.
  const TEKS = (() => { try { return JSON.parse(document.getElementById('teks-app')?.textContent || '{}'); } catch { return {}; } })();
  const t = (k, v, asal) => { const s = typeof TEKS[k] === 'string' ? TEKS[k] : (asal ?? k); return v ? s.replace(/\{(\w+)\}/g, (m, n) => (n in v ? String(v[n] ?? '') : m)) : s; };
  // kantor-hidup.js belum dimuat (server.mjs kantor dirancang ulang owner jadi gak ketimpa update, atau skripnya gagal):
  // denah tetap jalan seperti dulu, cuma kantor hidup yang mati.
  const H = globalThis.KantorHidup || { setelan: () => ({ nyala: false, ramai: 'sedang' }), pemicu: () => [], bolehGerak: () => false,
    KEMAMPUAN: {}, jedaOrang: () => 864e5, jamKantor: () => ({ jam: 12 }), pilihAcara: () => null, hash: () => 0 };
  const TEKS_ACARA = {
    kurir: t('app.hidup.kurir', null, 'Aku antar kabar: task selesai!'),
    terbit: t('app.hidup.terbit', null, 'Website sudah terbit.'),
    laporan: t('app.hidup.laporan', null, 'Laporan siap, kita rapat sebentar.'),
    kabar: t('app.hidup.kabar', null, 'Aku bawa kabar pembaruan kit.'),
    ultah: t('app.hidup.ultah', null, 'Selamat ulang tahun!'),
    nunggu: t('app.hidup.nunggu', null, 'Nunggu keputusanmu.'),
    kopi: t('app.hidup.kopi', null, 'Ngopi sebentar, lalu kembali kerja.'),
    ngobrol: t('app.hidup.ngobrol', null, 'Ngobrol sebentar di kantor.'),
    rapat: t('app.hidup.rapat', null, 'Kita rapat sebentar.'),
    makan: t('app.hidup.makan', null, 'Waktunya makan siang.'),
    sunset: t('app.hidup.sunset', null, 'Lihat suasana sore sebentar.'),
    tidur: t('app.hidup.tidur', null, 'Istirahat malam dulu.'),
    satpam: t('app.hidup.satpam', null, 'Petugas sedang berkeliling.'),
    tamu: t('app.hidup.tamu', null, 'Ada tamu mampir.'),
    olahraga: t('app.hidup.olahraga', null, 'Olahraga sebentar di gym.'),
    belajar: t('app.hidup.belajar', null, 'Belajar sebentar di Academy.'),
    studio: t('app.hidup.studio', null, 'Mampir ke studio sebentar.'),
  };
  const NAMA_FIGURAN = {
    kurir: t('app.hidup.nama.kurir', null, 'Kurir'),
    satpam: t('app.hidup.nama.satpam', null, 'Petugas'),
    tamu: t('app.hidup.nama.tamu', null, 'Tamu'),
  };
  let selesai = false;
  const pewaktu = new Map();
  const berkala = new Set();
  const nanti = (f, ms) => { const id = setTimeout(() => { pewaktu.delete(id); if (!selesai) f(); }, ms); pewaktu.set(id, null); return id; };
  const tiap = (f, ms) => { const id = setInterval(() => { if (!selesai && !document.hidden) f(); }, ms); berkala.add(id); return id; };
  const permintaan = new AbortController();

  // ---------- template ----------
  // dasar = ukuran gambar acuan koordinat; lebar/tinggi = ukuran gambar yang ditampilin (px dunia);
  // orang/duduk = tinggi sprite berdiri / duduk (termasuk kursi) dalam px dunia.
  // Tempat: [x, y, arah, duduk (0 = berdiri, true = kursi kerja, angka = tinggi sprite), titik masuk].
  const PIXEL = {
    dasar: [2560, 1696], lebar: 2560, tinggi: 1696, orang: 124, duduk: 142, sprite: 'orang',
    titik: {
      pintu: [81.5, 45.5], lobi: [77.5, 50], resep: [83.5, 54], lobiB: [71, 46.5], ezPintu: [69.6, 39.5], ezDalam: [66.5, 36.2],
      korAtas: [56.5, 37.2], korTengah: [43, 35.2], korKiri: [33.5, 36.8], rpPintu: [55.3, 30.5], rpDalam: [50.8, 30.2],
      wAtas: [52, 38.8], celahAtas: [47.5, 40.5], celahTengah: [44.5, 49.2], celahBawah: [41, 58], aBawah: [36, 56.5], kerjaA: [29.5, 56],
      wDepanKiri: [48, 63], wDepan: [57.5, 62], wKanan: [66, 53.5], wBelakang: [63, 41.5], kerjaK: [66.2, 48.6],
      kor1: [70.5, 54], kor2: [63, 63.5], pantry: [65.5, 69], kor4: [33.5, 61], kor5: [29.5, 71.5], lounge: [33, 75.5],
      loungeKiri: [26.56, 78.42], pantryTengah: [69.8, 78.01], pantryKiri: [59.53, 75.18],
      alMasuk: [27.5, 40.2], alDalam: [23.5, 39.5], alKanan: [25, 33.02], alBelakang: [21.88, 28.18],
    },
    sambung: [
      ['pintu', 'lobi'], ['lobi', 'resep'], ['lobi', 'lobiB'], ['lobi', 'kor1'], ['lobiB', 'ezPintu'], ['ezPintu', 'ezDalam'],
      ['lobiB', 'korAtas'], ['lobiB', 'kerjaK'], ['korAtas', 'rpPintu'], ['rpPintu', 'rpDalam'], ['korAtas', 'korTengah'], ['korTengah', 'korKiri'],
      ['korAtas', 'wAtas'], ['wAtas', 'celahAtas'], ['korTengah', 'celahAtas'], ['celahAtas', 'celahTengah'], ['celahTengah', 'celahBawah'],
      ['celahBawah', 'aBawah'], ['aBawah', 'kerjaA'], ['celahBawah', 'wDepanKiri'], ['wDepanKiri', 'wDepan'], ['wDepan', 'wKanan'],
      ['wKanan', 'kerjaK'], ['kerjaK', 'wBelakang'], ['wBelakang', 'wAtas'], ['wKanan', 'kor1'], ['kerjaK', 'kor1'],
      ['kor1', 'kor2'], ['kor2', 'pantry'], ['kerjaA', 'kor4'], ['kor4', 'kor5'], ['kor5', 'lounge'], ['lounge', 'loungeKiri'], ['kor5', 'loungeKiri'],
      ['pantry', 'pantryTengah'], ['pantry', 'pantryKiri'],
      ['korKiri', 'alMasuk'], ['alMasuk', 'alDalam'], ['alDalam', 'alKanan'], ['alKanan', 'alBelakang'],
    ],
    // Owner duduk di balik meja direktur; potongan meja ditumpuk di depannya (tutup) biar badan bawahnya ketutup.
    kursiOwner: [16.37, 33.2, 'front-left', true, 'alBelakang'],
    lapor: [[22.5, 38.8, 'rear-left', 0, 'alDalam'], [19.5, 40.5, 'rear-left', 0, 'alDalam']],
    tutup: [{ p: [[13.36, 33.43], [19.26, 29.3], [23.4, 30.07], [23.24, 35.02], [18.13, 38.74], [16.52, 39.21], [13.55, 36.79]], z: 35.38 }],
    meja: [[34.25, 53.75, 'rear-left', true], [38.09, 50.51, 'rear-left', true], [42.77, 47.07, 'rear-left', true],
      [53.59, 63.56, 'rear-left', true], [58.36, 58.96, 'rear-left', true], [63.05, 54.36, 'rear-left', true], [43.0, 59.6, 'rear-right'], [66.8, 56.6, 'rear-left']],
    mejaKonten: [],
    manager: [63.6, 34.6, 'front-left', 0, 'ezDalam'],
    rapat: [[45.0, 31.11, 'rear-left', 124, 'rpDalam'], [47.08, 29.38, 'rear-left', 124, 'rpDalam'], [41.61, 30.86, 'rear-right', 124, 'rpDalam'], [50.2, 29.9, 'rear-left', 0, 'rpDalam']],
    santai: [[69.8, 73.2, 'rear-right'], [72.4, 74.6, 'rear-right'], [29.14, 83.08, 'front-right', 0, 'loungeKiri'], [75.0, 76.2, 'rear-right'],
      [30.74, 87.15, 'rear-right', 0, 'loungeKiri'], [66.6, 79.0, 'front-left', 0, 'pantryTengah'], [25.0, 84.91, 'front-right', 0, 'loungeKiri']],
    lobi: [76.8, 52.4, 'front-left'],
    tengah: 48,
  };
  const TEMPLATE = {
    kantor: PIXEL,
    masjid: {
      ...PIXEL, lebar: 3675, tinggi: 2699,
      titik: { ...PIXEL.titik, mjKoridor: [25.78, 87.26], mjGerbang: [25.98, 102.89], mjTangga: [24.41, 109.38],
        mjBawah: [23.24, 114.98], mjDalam: [28.13, 118.51], mjSisiKanan: [27.34, 140.63], mjMimbar: [46.68, 126.18] },
      sambung: [...PIXEL.sambung, ['loungeKiri', 'mjKoridor'], ['mjKoridor', 'mjGerbang'], ['mjGerbang', 'mjTangga'],
        ['mjTangga', 'mjBawah'], ['mjBawah', 'mjDalam'], ['mjDalam', 'mjSisiKanan'], ['mjDalam', 'mjMimbar']],
    },
    // Sayap studio konten nyambung di kanan lobby: koordinat lewat 100% dari gambar dasar.
    studio: {
      ...PIXEL, lebar: 3675,
      titik: { ...PIXEL.titik, studioMasuk: [93.75, 60.73], stTengah: [101.17, 63.09], stKiriEdit: [98.44, 69.58], stEdit1: [103.13, 76.65], stEdit2: [107.34, 79.3] },
      sambung: [...PIXEL.sambung, ['resep', 'studioMasuk'], ['studioMasuk', 'stTengah'], ['stTengah', 'stKiriEdit'], ['stKiriEdit', 'stEdit1'], ['stEdit1', 'stEdit2']],
      mejaKonten: [[103.13, 73.82, 'rear-right', true, 'stEdit1'], [107.34, 76.47, 'rear-right', true, 'stEdit2']],
    },
    // Kantor kecil cozy, gaya kartun 3D. Gambar 2528x1696.
    cozy: {
      dasar: [2528, 1696], lebar: 2528, tinggi: 1696, orang: 204, duduk: 237, sprite: 'orang-cozy',
      titik: { pintu: [74.5, 50], lobi: [69, 54], tengah: [64, 57.5], kananMeja: [66, 65], barisDepan1: [61.5, 66.5], barisDepan2: [56.5, 71],
        kiriMeja: [35.5, 59], dapur: [33, 64], kiriDepan: [38, 70], atasMeja: [52.5, 47], kantorOwner: [40, 50], rapatPintu: [61, 49],
        rapatDalam: [60, 44.5], teras: [73, 66], sampingMeja: [43.5, 43], belakangMeja: [34, 35.5] },
      sambung: [['pintu', 'lobi'], ['lobi', 'tengah'], ['tengah', 'rapatPintu'], ['rapatPintu', 'rapatDalam'], ['tengah', 'kananMeja'],
        ['kananMeja', 'barisDepan1'], ['barisDepan1', 'barisDepan2'], ['tengah', 'atasMeja'], ['atasMeja', 'kantorOwner'], ['kantorOwner', 'kiriMeja'],
        ['kiriMeja', 'dapur'], ['dapur', 'kiriDepan'], ['lobi', 'teras'], ['kananMeja', 'teras'], ['kantorOwner', 'sampingMeja'], ['sampingMeja', 'belakangMeja']],
      meja: [[49.7, 73.5, 'rear-left', true, 'barisDepan2'], [54.3, 68.6, 'rear-left', true, 'barisDepan2'], [59.3, 63.6, 'rear-left', true, 'barisDepan1'],
        [39.9, 63.4, 'front-right', true, 'kiriMeja'], [44.3, 58.6, 'front-right', true, 'kiriMeja'], [49.3, 54.2, 'front-right', true, 'atasMeja']],
      mejaKonten: [],
      manager: null,
      kursiOwner: [30.6, 43.2, 'front-right', true, 'belakangMeja'],
      lapor: [[37.5, 53, 'rear-left', 0, 'kantorOwner'], [41, 51, 'rear-left', 0, 'kantorOwner'], [34, 55.5, 'rear-left', 0, 'kantorOwner']],
      tutup: [{ p: [[27.9, 43.7], [36.3, 36.6], [40.8, 40], [40.8, 45.2], [33.3, 51.9], [27.9, 48.2]], z: 51.9 }],
      rapat: [[59, 43.5, 'rear-right', true, 'rapatDalam'], [55, 41.3, 'rear-right', true, 'rapatDalam'], [64, 41.5, 'rear-left', true, 'rapatDalam'], [58.3, 34.3, 'front-right', true, 'rapatDalam']],
      santai: [[33, 66.5, 'rear-left', 0, 'dapur'], [74, 67, 'front-right', 0, 'teras'], [70, 71, 'rear-right', 0, 'teras'], [37, 71.5, 'rear-left', 0, 'kiriDepan'], [76, 75, 'front-left', 0, 'teras']],
      lobi: [71, 55, 'front-left', 0, 'lobi'],
      tengah: 55,
    },
    // Open space modern, gaya flat. Gambar 2528x1696.
    modern: {
      dasar: [2528, 1696], lebar: 2528, tinggi: 1696, orang: 254, duduk: 297, sprite: 'orang-modern',
      titik: { pintu: [77, 46], lobi: [72, 50], kananMeja: [66.5, 52], barisDepan: [60, 61], tengahDepan: [54, 64], depanMeja: [50, 70], kiriBawah: [44, 66],
        lounge: [30, 60], rapatPintu: [36, 55], rapatDalam: [33, 47], atasMeja: [60, 41], managerPintu: [57, 35], kananMejaBos: [57, 27.5], belakangMejaBos: [51, 21.5] },
      sambung: [['pintu', 'lobi'], ['lobi', 'kananMeja'], ['lobi', 'atasMeja'], ['atasMeja', 'managerPintu'], ['kananMeja', 'barisDepan'], ['barisDepan', 'tengahDepan'],
        ['tengahDepan', 'kiriBawah'], ['tengahDepan', 'depanMeja'], ['depanMeja', 'kiriBawah'], ['kiriBawah', 'lounge'], ['kiriBawah', 'rapatPintu'],
        ['rapatPintu', 'rapatDalam'], ['lounge', 'rapatPintu'], ['managerPintu', 'kananMejaBos'], ['kananMejaBos', 'belakangMejaBos']],
      meja: [[50.5, 66, 'rear-left', true, 'tengahDepan'], [56.3, 60.7, 'rear-left', true, 'barisDepan'], [62.3, 55.7, 'rear-left', true, 'barisDepan'],
        [41, 53.7, 'front-right', true, 'kiriBawah'], [47, 48.2, 'front-right', true, 'atasMeja'], [53, 43.2, 'front-right', true, 'atasMeja']],
      mejaKonten: [],
      manager: null,
      kursiOwner: [47.5, 26, 'front-right', true, 'belakangMejaBos'],
      lapor: [[52, 36, 'rear-left', 0, 'managerPintu'], [55, 33.5, 'rear-left', 0, 'managerPintu']],
      tutup: [{ p: [[46.5, 26], [50.7, 22.7], [56.1, 25], [56.1, 29], [49.7, 34.3], [46.5, 31.6]], z: 34.3 }],
      rapat: [[27.4, 49.2, 'rear-right', true, 'rapatDalam'], [33.8, 50, 'rear-right', true, 'rapatDalam'], [38.5, 45.5, 'rear-left', true, 'rapatDalam'], [30.5, 36.5, 'front-right', true, 'rapatDalam']],
      santai: [[22, 53, 'front-right', 0, 'lounge'], [51.5, 71.5, 'rear-right', 0, 'depanMeja'], [28.5, 64, 'front-right', 0, 'lounge'], [49, 74.5, 'rear-right', 0, 'depanMeja']],
      lobi: [76, 57, 'front-left', 0, 'lobi'],
      tengah: 50,
    },
  };
  // Denah tambahan dari berkas aset/denah-<id>.js (dimuat server sebelum skrip ini, cuma buat tampilan itu).
  Object.assign(TEMPLATE, globalThis.DENAH_KIT || {});
  const T = TEMPLATE[peta.dataset.peta] || PIXEL;
  const masjid = peta.dataset.peta === 'masjid' || T.masjid === true;
  const SHALAT_RUPA = ['claude-1', 'dev-1', 'dev-2', 'employee-1', 'employee-2', 'employee-3', 'explore-1', 'frontend-dev-1', 'security-audit-1'];
  const RASIO_SHALAT = { 'claude-1': [1, .763, .372, .689], 'dev-1': [1, .742, .366, .687], 'dev-2': [1, .71, .379, .686],
    'employee-1': [1, .738, .353, .636], 'employee-2': [1, .732, .362, .646], 'employee-3': [1, .736, .376, .708],
    'explore-1': [1, .756, .367, .663], 'frontend-dev-1': [1, .698, .363, .61], 'security-audit-1': [1, .702, .344, .59] };
  // Template baru cuma punya 7 rupa; rupa lain (mis. pilihan owner buat template pixel) diganti yang ada.
  const RUPA_GAYA = ['dev-2', 'employee-3', 'explore-1', 'frontend-dev-1', 'employee-1', 'employee-2'];
  const rupaAda = (r, i) => masjid ? (SHALAT_RUPA.includes(r) ? r : SHALAT_RUPA[i % SHALAT_RUPA.length]) : (T.sprite === 'orang' || r === 'claude-1' || RUPA_GAYA.includes(r) ? r : RUPA_GAYA[i % RUPA_GAYA.length]);
  const demo = masjid && ['zuhur', 'jumat'].includes(new URLSearchParams(location.search).get('demo')) ? new URLSearchParams(location.search).get('demo') : '';
  const LAJU = T.orang * 1.2; // px dunia per detik: ±1,2 tinggi badan per detik
  const mediaDiam = matchMedia('(prefers-reduced-motion: reduce)');
  let diam = mediaDiam.matches;
  const KET = {
    kerja: t('app.kantor.kerja', null, 'Lagi kerja'),
    nunggu: t('app.kantor.nunggu', null, 'Nunggu keputusan kamu'),
    santai: t('app.kantor.santai', null, 'Santai, gak ada kerjaan'),
  };
  // Nama waktu shalat buat banner. Shalat.NAMA (shalat.js) tetap Indonesia karena dipakai server juga.
  const WAKTU = {
    subuh: t('app.shalat.subuh', null, 'Subuh'), zuhur: t('app.shalat.zuhur', null, 'Zuhur'), asar: t('app.shalat.asar', null, 'Asar'),
    magrib: t('app.shalat.magrib', null, 'Magrib'), isya: t('app.shalat.isya', null, 'Isya'), jumat: t('app.shalat.jumat', null, 'Jumat'),
  };
  const namaOwner = (nama) => t('app.kantor.owner.nama', { nama }, '{nama} (kamu)');

  const px = ([x, y]) => [(x * T.dasar[0]) / 100, (y * T.dasar[1]) / 100];
  const jarak = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const GRAF = new Map(Object.keys(T.titik).map((k) => [k, []]));
  for (const [a, b] of T.sambung) { const d = jarak(px(T.titik[a]), px(T.titik[b])); GRAF.get(a).push([b, d]); GRAF.get(b).push([a, d]); }
  const terdekat = (p) => Object.keys(T.titik).filter((k) => GRAF.get(k).length).reduce((x, k) => (!x || jarak(p, px(T.titik[k])) < jarak(p, px(T.titik[x])) ? k : x), null);
  function rute(dari, ke) {
    const jauh = new Map([[dari, 0]]);
    const asal = new Map();
    const sisa = new Set(GRAF.keys());
    while (sisa.size) {
      let u = null;
      for (const k of sisa) if (jauh.has(k) && (u === null || jauh.get(k) < jauh.get(u))) u = k;
      if (u === null || u === ke) break;
      sisa.delete(u);
      for (const [v, d] of GRAF.get(u)) if (sisa.has(v) && (!jauh.has(v) || jauh.get(u) + d < jauh.get(v))) { jauh.set(v, jauh.get(u) + d); asal.set(v, u); }
    }
    const jalan = [];
    for (let k = ke; k; k = asal.get(k)) jalan.unshift(px(T.titik[k]));
    return jalan;
  }

  // ---------- karakter ----------
  const orang = new Map();
  const figuran = new Map();
  const semuaOrang = () => [...orang.values(), ...figuran.values(), ...(owner ? [owner] : [])];
  const kartu = document.querySelector('[data-kartu]');
  const sprite = (o, pose) => {
    // Rupa umum masjid hanya punya duduk dari belakang; pertahankan arah kiri/kanannya.
    const tersedia = masjid && pose.startsWith('duduk-front-') ? pose.replace('front', 'rear') : pose;
    return `/aset/${T.sprite}/${o.rupa}-${tersedia}.webp`;
  };

  function taruh(o, p, pose, tinggi) {
    o.pos = p;
    o.el.style.left = `${(p[0] / T.lebar) * 100}%`;
    o.el.style.top = `${(p[1] / T.tinggi) * 100}%`;
    o.el.style.zIndex = String(Math.round(p[1]));
    if (pose) o.img.src = sprite(o, pose);
    if (tinggi) o.el.style.height = `${(tinggi / T.tinggi) * 100}%`;
  }

  function bikin(m) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'orang';
    el.innerHTML = '<span class="gelembung" aria-hidden="true"><span></span></span><span class="label"><i></i><b></b></span><img class="badan" alt="" draggable="false">';
    const o = { ...m, el, img: el.querySelector('img'), pos: px(T.titik.pintu), tujuan: null, nomor: 0 };
    el.addEventListener('click', () => { if (!o.figuran) tampilKartu(o); });
    peta.appendChild(el);
    orang.set(m.id, o);
    return o;
  }

  function perbarui(o, m, i) {
    Object.assign(o, { nama: m.nama, rupa: rupaAda(m.rupa, i), keadaan: m.keadaan, task: m.task });
    o.teksBerikut = typeof m.gelembung === 'string' ? m.gelembung : '';
    if (!o.teksBerikut) isiGelembung(o, '');
    const shalatKelas = acaraShalat ? ['wudhu', 'khatib'].filter((k) => o.el.classList.contains(k)) : [];
    o.el.className = `orang k-${m.keadaan}${o.el.classList.contains('jalan') ? ' jalan' : ''}`;
    o.el.classList.add(...shalatKelas);
    o.el.querySelector('b').textContent = m.nama;
    o.el.setAttribute('aria-label', `${m.nama}, ${KET[m.keadaan]}${m.task ? `: ${m.task.judul}` : ''}`);
  }

  function isiGelembung(o, teks) {
    const balon = o.el.querySelector('.gelembung span');
    if (balon.textContent === teks) return;
    balon.textContent = teks;
    o.gantiBalon = Date.now();
    // Ringkasan aman di tooltip; judul task lengkap tetap ada di kartu karakter.
    o.el.title = teks;
  }

  // Balon dirapikan paling sering tiap 150 ms (dipanggil dari tiap frame saat ada yang jalan). Semua ukuran dibaca
  // dulu, keputusan dihitung dari angka, baru gaya ditulis: satu hitung-ulang layout, bukan satu per orang.
  let balonTerakhir = 0;
  function rapihGelembung() {
    const sekarang = performance.now();
    if (sekarang - balonTerakhir < 150) return;
    balonTerakhir = sekarang;
    if (!acaraShalat) for (const o of orang.values()) if (Date.now() - (o.gantiBalon || 0) >= 5000) isiGelembung(o, o.teksBerikut || '');
    const penghalang = [];
    for (const o of semuaOrang()) penghalang.push(o.el.getBoundingClientRect(), o.el.querySelector('.label').getBoundingClientRect());
    const bingkai = gulir?.getBoundingClientRect() || peta.getBoundingClientRect();
    const hp = matchMedia('(max-width: 600px)').matches;
    const ukur = [...orang.values()].map((o) => {
      const b = o.el.querySelector('.gelembung');
      return { o, b, e: o.el.getBoundingClientRect(), w: b.offsetWidth, h: b.offsetHeight, lt: o.el.querySelector('.label').offsetHeight, naik: parseFloat(o.el.style.getPropertyValue('--naik')) || 0 };
    });
    const tabrak = (a, b) => a.left < b.right + 4 && a.right + 4 > b.left && a.top < b.bottom + 4 && a.bottom + 4 > b.top;
    const muat = (r) => r.left >= Math.max(0, bingkai.left) + 4 && r.right <= Math.min(innerWidth, bingkai.right) - 4
      && r.top >= Math.max(0, bingkai.top) + 4 && r.bottom <= bingkai.bottom - 8
      && !penghalang.some((p) => tabrak(r, p));
    // Posisi dasar di atas label. Kalau kena label/badan orang lain atau keluar bingkai, cari tempat terdekat:
    // geser kiri/kanan, naik sedikit, atau di bawah kaki. Yang nunggu keputusan dapat tempat dulu, lalu yang paling depan.
    const kandidat = [];
    for (const bawah of [false, true]) for (const dy of [0, 14, 28]) for (const dx of [0, -36, 36, -72, 72]) {
      kandidat.push({ bawah, dy, dx, biaya: dy + Math.abs(dx) + (bawah ? 8 : 0) });
    }
    kandidat.sort((x, y) => x.biaya - y.biaya);
    const urutan = (u) => (u.o.keadaan === 'nunggu' ? 0 : 1);
    ukur.sort((x, y) => urutan(x) - urutan(y) || y.e.bottom - x.e.bottom);
    let jumlah = 0;
    for (const u of ukur) {
      const boleh = !acaraShalat && !!u.b.textContent && (!hp || (u.o.keadaan !== 'santai' && jumlah < 3));
      u.pilih = null;
      if (!boleh) continue;
      const kiri = u.e.left + u.e.width / 2 - u.w / 2;
      const dasarAtas = u.e.top - (u.lt + 10 + u.naik) - u.h;
      for (const k of kandidat) {
        const atas = k.bawah ? u.e.bottom + 12 + k.dy : dasarAtas - k.dy;
        const r = { left: kiri + k.dx, right: kiri + k.dx + u.w, top: atas, bottom: atas + u.h };
        if (!muat(r)) continue;
        u.pilih = k;
        penghalang.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom + 8 });
        jumlah++;
        break;
      }
    }
    for (const u of ukur) {
      const k = u.pilih || { bawah: false, dy: 0, dx: 0 };
      u.b.classList.toggle('bawah', k.bawah);
      u.b.style.bottom = k.bawah ? 'auto' : `calc(100% + ${u.lt + 10 + k.dy}px + var(--naik, 0px))`;
      u.b.style.top = k.bawah ? `calc(100% + ${12 + k.dy}px)` : 'auto';
      u.b.style.transform = k.dx ? `translateX(calc(-50% + ${k.dx}px))` : '';
      u.b.style.setProperty('--ekor', `${-k.dx}px`);
      u.b.classList.toggle('tampil', !!u.pilih);
    }
  }

  // Bagi tempat: meja tetap per orang, kursi rapat & spot santai dibagi berurutan. Yang nunggu keputusan lapor ke
  // ruang owner kalau owner-nya udah duduk (kelebihan ke ruang rapat); sebelum owner dateng mereka di mejanya.
  let ownerHadir = false;
  function bagiTempat(daftar) {
    let meja = 0; let konten = 0; let rapat = 0; let santai = 0; let lapor = 0;
    const hasil = new Map();
    for (const m of daftar) {
      const builder = m.id === 'builder';
      let mejaSendiri;
      if (builder && T.manager) mejaSendiri = T.manager;
      else if (/sosmed|konten/i.test(m.jabatan || '') && konten < T.mejaKonten.length) mejaSendiri = T.mejaKonten[konten++];
      // Meja penuh (tim lebih banyak dari meja di template): kerja di ruang rapat, bukan numpuk di meja orang.
      else mejaSendiri = meja < T.meja.length ? T.meja[meja++] : T.rapat[rapat++ % T.rapat.length];
      if (m.keadaan === 'nunggu') {
        if (!ownerHadir && owner) hasil.set(m.id, mejaSendiri);
        else if (owner && T.lapor && lapor < T.lapor.length) hasil.set(m.id, T.lapor[lapor++]);
        else hasil.set(m.id, T.rapat[rapat++ % T.rapat.length]);
      } else if (m.keadaan === 'kerja') hasil.set(m.id, mejaSendiri);
      else hasil.set(m.id, builder ? T.lobi : T.santai[santai++ % T.santai.length]);
    }
    return hasil;
  }

  const tunggu = (ms) => new Promise((ok) => { const id = setTimeout(() => { pewaktu.delete(id); ok(); }, ms); pewaktu.set(id, ok); });
  const tinggiTempat = (t) => (t[3] === true ? T.duduk : typeof t[3] === 'number' && t[3] ? t[3] : 0);
  // Taruh langsung di tempat (tanpa jalan): dipakai pas halaman kebuka biar tim keliatan udah kerja.
  function langsung(o, t) {
    o.tujuan = t; o.nomor++;
    const duduk = tinggiTempat(t);
    o.el.style.transition = 'none'; o.el.classList.remove('jalan');
    taruh(o, px(t), duduk ? `duduk-${t[2]}` : t[2], duduk || T.orang);
    o.lewat = t[4] || terdekat(px(t));
  }
  async function jalanKe(o, t) {
    const nomor = ++o.nomor; // jalan baru batalin jalan lama
    o.tujuan = t;
    // Satu lintasan bergerak pada satu waktu: tak saling menembus di lorong sempit, termasuk HP.
    while (!acaraShalat && kunciJalan && kunciJalan.o !== o) {
      await tunggu(160);
      if (selesai || document.hidden || nomor !== o.nomor) return false;
    }
    if (selesai || document.hidden || nomor !== o.nomor) return false;
    const kunci = { o, nomor };
    kunciJalan = kunci;
    try {
    const akhir = px(t);
    const duduk = tinggiTempat(t);
    const poseAkhir = duduk ? `duduk-${t[2]}` : t[2];
    if (diam) { o.el.classList.remove('jalan'); taruh(o, akhir, poseAkhir, duduk || T.orang); o.lewat = t[4] || terdekat(akhir); return true; }
    const dari = o.lewat || terdekat(o.pos);
    const ke = t[4] || terdekat(akhir);
    const titik = [...rute(dari, ke), akhir];
    o.el.classList.add('jalan');
    nyalakanGerak();
    o.el.style.height = `${(T.orang / T.tinggi) * 100}%`;
    for (const p of titik) {
      if (nomor !== o.nomor) return;
      const dx = p[0] - o.pos[0]; const dy = p[1] - o.pos[1];
      const lama = Math.max(120, (Math.hypot(dx, dy) / LAJU) * 1000 / (demo && acaraShalat ? 8 : o.lari ? 1.6 : 1));
      o.el.style.transition = `left ${lama}ms linear, top ${lama}ms linear`;
      taruh(o, p, `${dy > 0 ? 'front' : 'rear'}-${dx >= 0 ? 'right' : 'left'}`);
      await tunggu(lama);
    }
    if (nomor !== o.nomor) return;
    o.el.style.transition = 'none';
    o.el.classList.remove('jalan');
    taruh(o, akhir, poseAkhir, duduk || T.orang);
    o.lewat = t[4] || terdekat(akhir);
    return true;
    } finally { if (kunciJalan === kunci) kunciJalan = null; }
  }
  let kunciJalan = null;

  // Tombol salin perintah (diurus app.js lewat data-salin). Teks perintahnya cuma huruf kecil, angka, spasi, tanda tanya.
  const tombolSalin = (p) => `<button type="button" class="salin" data-salin="${p}" aria-label="${t('app.kantor.salin.perintah', { p }, 'Salin perintah {p}')}"><code>${p}</code><svg class="ikon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5.5 15H5a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 5 3.5h8.5A1.5 1.5 0 0 1 15 5v.5"/></svg></button>`;

  function tampilKartu(o) {
    if (!kartu) return;
    kartu.hidden = false;
    if (o === owner) {
      const n = [...orang.values()].filter((x) => x.keadaan === 'nunggu').length;
      kartu.innerHTML = `<button type="button" class="tutup" aria-label="${t('app.tutup', null, 'Tutup')}">×</button><img src="${sprite(o, 'front-right')}" alt="" width="88" height="180"><div><b></b><span class="keadaan">${n ? t('app.kantor.owner.nunggu', { n }, '{n} hal nunggu keputusan kamu') : t('app.kantor.owner.kosong', null, 'Gak ada yang nunggu kamu')}</span>${n ? tombolSalin('apa aja yang nunggu aku?') : ''}</div>`;
      kartu.querySelector('b').textContent = namaOwner(o.nama);
      kartu.querySelector('.tutup').addEventListener('click', () => { kartu.hidden = true; });
      return;
    }
    kartu.innerHTML = `<button type="button" class="tutup" aria-label="${t('app.tutup', null, 'Tutup')}">×</button><img src="${sprite(o, 'front-right')}" alt="" width="88" height="180"><div><b></b><span class="keadaan k-${o.keadaan}"><i></i>${KET[o.keadaan]}</span><a class="task-link" hidden></a>${tombolSalin(`jadi ${o.id}`)}</div>`;
    kartu.querySelector('b').textContent = o.nama;
    if (o.task) { const a = kartu.querySelector('.task-link'); a.hidden = false; a.href = `/task/${encodeURIComponent(o.task.f)}`; a.dataset.task = o.task.f; a.textContent = o.task.judul; }
    kartu.querySelector('.tutup').addEventListener('click', () => { kartu.hidden = true; });
  }

  // ---------- owner ----------
  // Karakter owner masuk dari pintu tiap dashboard dibuka, duduk di balik mejanya; abis itu yang nunggu keputusan lapor.
  let owner = null;
  let dataTerakhir = null;
  function bikinOwner(info) {
    if (!info || !T.kursiOwner) return;
    owner = bikin({ id: '_owner', nama: info.nama, rupa: info.rupa });
    if (masjid) owner.rupa = ['owner-wanita', 'owner-hijab'].includes(info.rupa) ? 'dev-2' : 'dev-1';
    orang.delete('_owner');
    owner.el.className = 'orang owner';
    owner.el.querySelector('b').textContent = namaOwner(info.nama);
    owner.el.setAttribute('aria-label', t('app.kantor.owner.aria', { nama: info.nama }, '{nama}, ini kamu'));
    owner.img.src = sprite(owner, 'front-left');
    if (diam) { langsung(owner, T.kursiOwner); ownerHadir = true; return; }
    owner.el.style.height = `${(T.orang / T.tinggi) * 100}%`;
    taruh(owner, px(T.titik.pintu)); owner.lewat = 'pintu';
    nanti(async () => {
      if (acaraShalat) return;
      if (await jalanKe(owner, T.kursiOwner)) { ownerHadir = true; if (dataTerakhir) terapkan(dataTerakhir); }
    }, 500);
  }

  // Tutup = potongan gambar ruangan (meja owner) yang ditumpuk di depan orang yang kakinya di belakang garis z.
  function pasangTutup(src) {
    for (const t of T.tutup || []) {
      const el = document.createElement('div');
      el.className = 'tutup-meja';
      el.style.backgroundImage = `url("${src}")`;
      el.style.clipPath = `polygon(${t.p.map(([x, y]) => `${(x * T.dasar[0]) / T.lebar}% ${(y * T.dasar[1]) / T.tinggi}%`).join(', ')})`;
      el.style.zIndex = String(Math.round((t.z * T.dasar[1]) / 100));
      peta.appendChild(el);
    }
  }

  async function terapkan(d, awal = false) {
    const sebelumnya = dataTerakhir;
    const berubah = sebelumnya && JSON.stringify(sebelumnya.manajer) !== JSON.stringify(d.manajer);
    if (berubah || !H.setelan(d.hidup).nyala) hentikanAcara();
    for (const e of H.pemicu(sebelumnya?.kejadian, d.kejadian || [])) {
      if (!antrianAcara.some((a) => a.id === e.id)) antrianAcara.push(e);
    }
    if (awal) for (const e of d.kejadian || []) if (e.jenis === 'ultah' && !pernahAcara.has(e.id)) antrianAcara.push(e);
    antrianAcara = antrianAcara.slice(-12);
    if (!H.setelan(d.hidup).nyala || diam) antrianAcara = [];
    dataTerakhir = d;
    const tempat = bagiTempat(d.manajer);
    const ada = new Set(d.manajer.map((m) => m.id));
    for (const [id, o] of orang) if (!ada.has(id)) { o.el.remove(); orang.delete(id); }
    let jeda = 0;
    for (const [i, m] of d.manajer.entries()) {
      const baru = !orang.has(m.id);
      const o = baru ? bikin(m) : orang.get(m.id);
      perbarui(o, m, i);
      if (acaraShalat) { if (baru) ikutShalat(o, Math.max(-1, ...daftarShalat().map((x) => x.shalatNomor ?? -1)) + 1); continue; }
      const t = tempat.get(m.id);
      if (o.berkeliling) continue;
      // Pas halaman kebuka & ada owner: tim udah di tempatnya (lagi kerja), cuma owner yang jalan masuk.
      if (awal && owner) { langsung(o, t); continue; }
      if (baru) { o.img.src = sprite(o, 'front-left'); o.el.style.height = `${(T.orang / T.tinggi) * 100}%`; taruh(o, px(T.titik.pintu)); o.lewat = 'pintu'; }
      if (!o.tujuan || o.tujuan !== t) {
        if (awal && !diam) { const j = jeda; jeda += 450; nanti(() => jalanKe(o, t), j); } else jalanKe(o, t);
      }
    }
  }

  // Event cuma memindahkan sprite; status dan kartu tetap memakai data task asli.
  let acaraShalat = null;
  const mulaiDemo = Date.now();
  const banner = document.querySelector('[data-shalat]');
  const dunia = (x, y, lewat) => [x / 25.6, y / 16.96, 'rear-right', 0, lewat];
  const saf = [[934, 2038], [994, 2068], [874, 2008], [1054, 2098], [814, 1978], [1114, 2128], [754, 1948],
    [856, 2077], [916, 2107], [796, 2047], [976, 2137], [736, 2017], [1036, 2167], [676, 1987], [616, 1957],
    [778, 2116], [838, 2146], [718, 2086], [658, 2056], [598, 2026], [1018, 2236], [538, 1996], [1078, 2266]];
  function daftarShalat() {
    const daftar = [...orang.values(), ...(owner ? [owner] : [])];
    const imam = daftar.find((o) => ['claude-1', 'dev-1', 'employee-1', 'employee-3', 'explore-1'].includes(o.rupa)) || daftar[0];
    return imam ? [imam, ...daftar.filter((o) => o !== imam)] : [];
  }
  async function ikutShalat(o, i) {
    const id = acaraShalat.id;
    o.shalatNomor = i;
    o.shalatSiap = false;
    const [x, y] = saf[(i + saf.length - 1) % saf.length];
    o.saf = i === 0 ? dunia(1020, 1995, 'mjDalam') : dunia(x, y, 'mjDalam');
    const khutbah = acaraShalat.nama === 'jumat' && i === 0;
    o.el.classList.toggle('khatib', khutbah);
    if (acaraShalat.detik < 210) {
      if (!await jalanKe(o, dunia(300 + i % 5 * 55, 2205 + i % 5 * 35, 'mjSisiKanan'))) return;
      if (acaraShalat?.id !== id) return;
      o.el.classList.add('wudhu');
      await tunggu(demo ? 1500 : 12000);
      o.el.classList.remove('wudhu');
      if (acaraShalat?.id !== id) return;
      if (!await jalanKe(o, khutbah ? dunia(1320, 1962, 'mjMimbar') : o.saf)) return;
    } else langsung(o, khutbah ? dunia(1320, 1962, 'mjMimbar') : o.saf);
    if (acaraShalat?.id === id) o.shalatSiap = true;
  }
  function detakShalat() {
    if (!masjid || !dataTerakhir) return;
    const r = demo ? { ...Shalat.rencana(demo), detik: (Date.now() - mulaiDemo) / 1000 * 8, id: `demo-${demo}` } : Shalat.acara(Date.now(), dataTerakhir.lokasi);
    const aktif = r && r.detik < r.habis ? r : null;
    const daftar = daftarShalat();
    if (!aktif) {
      if (!acaraShalat) return;
      acaraShalat = null;
      peta.classList.remove('khusyuk'); banner.hidden = true;
      for (const o of daftar) { o.nomor++; o.el.classList.remove('wudhu', 'khatib'); o.el.querySelector('b').textContent = o === owner ? namaOwner(o.nama) : o.nama; }
      if (owner) { ownerHadir = true; jalanKe(owner, T.kursiOwner); }
      terapkan(dataTerakhir);
      tengahin(dataTerakhir);
      return;
    }
    const baru = acaraShalat?.id !== aktif.id;
    acaraShalat = aktif;
    banner.hidden = false;
    banner.textContent = t('app.shalat.banner', { waktu: WAKTU[aktif.nama] || Shalat.NAMA[aktif.nama], kota: Shalat.lokasi(dataTerakhir.lokasi).nama }, 'Shalat {waktu} · {kota}')
      + (demo ? t('app.shalat.demo', null, ' (demo)') : '');
    peta.classList.add('khusyuk');
    if (baru) {
      hentikanAcara();
      daftar.forEach(ikutShalat);
      if (gulir && gulir.scrollWidth > gulir.clientWidth) gulir.scrollLeft = (900 / T.lebar) * gulir.scrollWidth - gulir.clientWidth / 2;
    }
    let s = aktif.detik - aktif.mulai, pose = 1;
    for (const [n, lama] of aktif.urut) { pose = n; if (s < lama) break; s -= lama; }
    for (const o of daftar) {
      if (!o.shalatSiap) continue;
      if (aktif.detik < aktif.mulai) {
        if (o.el.classList.contains('khatib')) {
          o.el.querySelector('b').textContent = t('app.shalat.khatib', { nama: o.nama }, '{nama} · khatib');
          taruh(o, o.pos, aktif.detik >= 930 && aktif.detik < 960 ? 'shalat-4' : 'front-left', T.orang);
        } else taruh(o, o.pos, 'shalat-4', T.orang * RASIO_SHALAT[o.rupa][3]);
        continue;
      }
      o.el.classList.remove('khatib');
      if (aktif.detik >= aktif.selesai) pose = 4;
      taruh(o, px(o.saf), `shalat-${pose}`, T.orang * RASIO_SHALAT[o.rupa][pose - 1]);
    }
  }

  // ---------- kehidupan kantor: satu acara, beberapa peserta datang bergiliran ----------
  let antrianAcara = [];
  let acaraHidup = null;
  let generasiAcara = 0;
  let slotTerakhir = '';
  let jenisTerakhir = '';
  let acaraBerikut = Date.now() + 45000;
  const pernahAcara = new Set((() => { try { return JSON.parse(sessionStorage.getItem('kantor-acara') || '[]'); } catch { return []; } })());
  const kabar = document.createElement('p');
  kabar.className = 'kabar-kantor'; kabar.hidden = true; kabar.setAttribute('role', 'status');
  peta.parentElement.before(kabar);

  function bekukan(o) {
    if (o.el.classList.contains('jalan')) {
      const r = o.el.getBoundingClientRect(), p = peta.getBoundingClientRect();
      o.el.style.transition = 'none';
      taruh(o, [(r.left + r.width / 2 - p.left) / p.width * T.lebar, (r.bottom - p.top) / p.height * T.tinggi]);
      o.lewat = terdekat(o.pos);
    }
    o.nomor++; o.el.classList.remove('jalan'); o.tujuan = null;
    if (kunciJalan?.o === o) kunciJalan = null;
  }
  function hentikanAcara() {
    generasiAcara++;
    acaraHidup = null; kabar.hidden = true;
    delete peta.dataset.acara;
    for (const o of orang.values()) {
      if (o.berkeliling) { bekukan(o); o.berkeliling = false; }
      delete o.el.dataset.emosi; o.lari = false;
    }
    for (const o of figuran.values()) { bekukan(o); o.el.remove(); }
    figuran.clear();
  }
  const tempatTitik = (k) => { const p = T.titik[k]; return p && [p[0], p[1], 'front-left', 0, k]; };
  const bolehHidup = () => dataTerakhir && H.bolehGerak({ pengaturan: dataTerakhir.hidup, tersembunyi: document.hidden, diam, shalat: !!acaraShalat });
  const emosi = { kurir: '📦', terbit: '🚀', ultah: '🎉', kopi: '☕', makan: '🍽', tidur: '💤', kabar: '!', nunggu: '?', olahraga: '🏋', belajar: '📚' };

  async function jalankanAcara(e, peserta) {
    if (!bolehHidup() || acaraHidup) return;
    const nomor = ++generasiAcara;
    const mampu = H.KEMAMPUAN[peta.dataset.peta];
    acaraHidup = e;
    peta.dataset.acara = e.jenis;
    kabar.textContent = TEKS_ACARA[e.jenis]; kabar.hidden = false;
    if (e.id && !e.ambient) {
      pernahAcara.add(e.id);
      while (pernahAcara.size > 200) pernahAcara.delete(pernahAcara.values().next().value);
      try { sessionStorage.setItem('kantor-acara', JSON.stringify([...pernahAcara])); } catch { /* mode privat */ }
    }
    const sah = () => nomor === generasiAcara && bolehHidup();
    const pulang = bagiTempat(dataTerakhir.manajer);
    try {
      if (['kurir', 'satpam', 'tamu'].includes(e.jenis)) {
        const o = bikin({ id: '_figuran', nama: NAMA_FIGURAN[e.jenis], rupa: rupaAda('employee-2', 0) });
        orang.delete(o.id); figuran.set(o.id, o); o.figuran = true;
        o.el.disabled = true; o.el.tabIndex = -1; o.el.classList.add('figuran');
        o.el.querySelector('b').textContent = o.nama;
        langsung(o, T.lobi);
        o.el.dataset.emosi = emosi[e.jenis] || '…';
        const penerima = orang.get(e.orang);
        const titik = e.jenis === 'kurir' ? penerima?.lewat || mampu.tamu : mampu[e.jenis];
        if (titik && await jalanKe(o, tempatTitik(titik)) && sah()) {
          if (penerima) penerima.el.dataset.emosi = '🎉';
          await tunggu(6000);
          if (sah()) await jalanKe(o, T.lobi);
        }
      } else {
        for (const o of peserta) o.berkeliling = true;
        for (const [i, o] of peserta.entries()) {
          if (!sah()) return;
          o.el.dataset.emosi = emosi[e.jenis] || '…';
          o.lari = e.jenis === 'kabar';
          const rapat = ['rapat', 'laporan', 'ultah'].includes(e.jenis);
          const bersama = ['kopi', 'makan', 'tidur', 'sunset', 'ngobrol'].includes(e.jenis) && peserta.length > 1;
          // Denah yang punya tempat kumpul khusus kegiatan ini (mis. gym, Academy, rooftop di Kantor lengkap) pakai itu.
          const kelompok = T.kelompok?.[e.jenis];
          const target = e.jenis === 'terbit' ? pulang.get(o.id) : rapat ? T.rapat[i % T.rapat.length] : kelompok?.length ? kelompok[i % kelompok.length] : bersama ? T.santai[i % T.santai.length]
            : tempatTitik(e.titik || mampu[e.jenis] || mampu.ngobrol);
          const ditempati = target && semuaOrang().some((lain) => lain !== o && jarak(lain.pos, px(target)) < T.orang * .5);
          if (target && !ditempati) await jalanKe(o, target);
        }
        if (!sah()) return;
        await tunggu(e.jenis === 'tidur' ? 18000 : 8000);
        for (const o of peserta) {
          if (!sah()) return;
          delete o.el.dataset.emosi;
          if (pulang.has(o.id)) await jalanKe(o, pulang.get(o.id));
          o.berkeliling = false; o.lari = false;
        }
      }
    } finally {
      if (nomor === generasiAcara) {
        hentikanAcara();
        acaraBerikut = Date.now() + 45000;
        for (const o of peserta) o.jalanBerikut = Date.now() + H.jedaOrang(o.id, Date.now(), o.keadaan, dataTerakhir.hidup);
      }
    }
  }

  function detakHidup() {
    if (!dataTerakhir || !H) return;
    const s = H.setelan(dataTerakhir.hidup);
    const { jam } = H.jamKantor(Date.now(), dataTerakhir.lokasi?.zona);
    peta.classList.toggle('hidup-malam', s.nyala && !diam && (jam >= 21 || jam < 6));
    if (!bolehHidup()) { if (acaraHidup) hentikanAcara(); return; }
    if (acaraHidup || semuaOrang().some((o) => o.el.classList.contains('jalan')) || Date.now() < acaraBerikut) return;
    const bebas = [...orang.values()].filter((o) => o.keadaan !== 'nunggu' && !o.berkeliling);
    const mampu = H.KEMAMPUAN[peta.dataset.peta];
    if (!mampu) return;
    const hp = matchMedia('(max-width: 600px)').matches;
    let e;
    while (antrianAcara.length && !e) {
      const calon = antrianAcara.shift();
      if (!pernahAcara.has(calon.id)) e = calon;
    }
    if (e?.jenis === 'nunggu') {
      // Status asli sudah mengantar orang ke owner; jangan menimpanya dengan acara santai.
      kabar.textContent = TEKS_ACARA.nunggu; kabar.hidden = false;
      pernahAcara.add(e.id);
      while (pernahAcara.size > 200) pernahAcara.delete(pernahAcara.values().next().value);
      acaraBerikut = Date.now() + 12000;
      nanti(() => { if (!acaraHidup) kabar.hidden = true; }, 10000);
      return;
    }
    let peserta = bebas;
    if (!e) {
      const calon = H.pilihAcara({ template: peta.dataset.peta, waktu: Date.now(), zona: dataTerakhir.lokasi?.zona, pengaturan: s, terakhir: jenisTerakhir });
      if (calon && calon.id !== slotTerakhir) {
        e = { ...calon, ambient: true }; slotTerakhir = calon.id;
      } else {
        peserta = bebas.filter((o) => {
          o.jalanBerikut ??= Date.now() + H.jedaOrang(o.id, Date.now(), o.keadaan, s);
          return o.jalanBerikut <= Date.now();
        }).slice(0, 1);
        if (peserta.length) {
          const calonJenis = ['kopi', 'ngobrol', 'rapat'].filter((k) => mampu[k] && k !== jenisTerakhir);
          const jenis = calonJenis[H.hash(`${peserta[0].id}:${Date.now()}`) % calonJenis.length];
          e = { jenis, titik: mampu[jenis], ambient: true };
        }
      }
    }
    if (!e) return;
    peserta = [...peserta].sort((a, b) => H.hash(`${e.id || e.jenis}:${a.id}`) - H.hash(`${e.id || e.jenis}:${b.id}`));
    if (e.orang && orang.has(e.orang)) peserta = [orang.get(e.orang), ...peserta.filter((o) => o.id !== e.orang)];
    peserta = peserta.slice(0, hp || ['kabar', 'studio'].includes(e.jenis) ? 1 : 2);
    if (!peserta.length && !['kurir', 'satpam', 'tamu'].includes(e.jenis)) return;
    if (e.ambient) jenisTerakhir = e.jenis;
    jalankanAcara(e, peserta);
  }
  tiap(detakHidup, 1000);

  // Label nama yang numpuk (mis. dua orang sebelahan di ruang rapat) digeser ke atas. Posisi dasar label dihitung
  // dari badan karakternya (bukan dari label yang lagi geser), yang paling depan (bawah) gak digeser.
  function rapihLabel() {
    const kotak = semuaOrang().map((o) => {
      const r = o.el.getBoundingClientRect();
      const l = o.el.querySelector('.label');
      return { o, kiri: r.left + r.width / 2 - l.offsetWidth / 2, lebar: l.offsetWidth, atas: r.top - 2 - l.offsetHeight, tinggi: l.offsetHeight, naik: 0 };
    }).sort((x, y) => y.atas - x.atas);
    const taruhan = [];
    for (const k of kotak) {
      for (let ulang = 0; ulang < kotak.length; ulang++) {
        const tabrak = taruhan.find((t) => k.kiri < t.kiri + t.lebar && t.kiri < k.kiri + k.lebar && k.atas - k.naik < t.atas - t.naik + t.tinggi + 2 && t.atas - t.naik < k.atas - k.naik + k.tinggi + 2);
        if (!tabrak) break;
        k.naik = k.atas - (tabrak.atas - tabrak.naik - k.tinggi - 3);
      }
      taruhan.push(k);
      k.o.el.style.setProperty('--naik', `${Math.max(0, k.naik)}px`);
    }
    rapihGelembung();
  }
  tiap(rapihLabel, 700);
  // Selama ada yang berjalan, label & balon dirapikan tiap 50 ms (cukup: label punya transisi 0,25 dtk).
  // Diam = nol kerja, hemat baterai HP.
  let gerakAktif = false;
  function ikutiGerak() {
    gerakAktif = false;
    if (selesai || document.hidden || !semuaOrang().some((o) => o.el.classList.contains('jalan'))) return;
    rapihLabel();
    nyalakanGerak();
  }
  function nyalakanGerak() { if (!gerakAktif && !selesai) { gerakAktif = true; nanti(ikutiGerak, 50); } }
  // Kartu karakter ketutup sendiri kalau ngetuk di luar kartu atau lompat ke bagian lain (biar gak nutupin tombol).
  const tutupKartu = () => { if (kartu) kartu.hidden = true; };
  document.addEventListener('click', (e) => { if (kartu && !kartu.hidden && !kartu.contains(e.target) && !e.target.closest('.orang')) tutupKartu(); });
  window.addEventListener('hashchange', tutupKartu);

  // Mulai: semua masuk dari pintu, terus tiap 20 detik cek perubahan task.
  const gulir = document.querySelector('[data-gulir]');
  gulir?.addEventListener('scroll', rapihLabel, { passive: true });
  window.addEventListener('resize', rapihLabel);
  // Di HP peta lebih lebar dari layar: tengahin ke tempat yang paling penting (ruang rapat kalau ada yang nunggu
  // owner, kalau gak rata-rata posisi tim).
  function tengahin(d) {
    if (!gulir || gulir.scrollWidth <= gulir.clientWidth) return;
    const tempat = bagiTempat(d.manajer);
    const nunggu = d.manajer.some((m) => m.keadaan === 'nunggu');
    const xs = nunggu ? [(T.kursiOwner || T.rapat[0])[0]] : [...tempat.values()].map((t) => t[0]);
    const x = xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : T.tengah;
    gulir.scrollLeft = ((x * T.dasar[0]) / 100 / T.lebar) * gulir.scrollWidth - gulir.clientWidth / 2;
  }
  // Panel tim di samping peta disegerin app.js (data-segar); di sini cuma karakternya.
  let sidikLama = '';
  async function tarik(awal = false) {
    if (selesai || document.hidden) return;
    try {
      const r = await fetch('/data.json', { cache: 'no-store', signal: permintaan.signal });
      if (!r.ok) return;
      const d = await r.json();
      const sidik = JSON.stringify(d);
      if (sidik === sidikLama) return;
      sidikLama = sidik;
      if (awal) { bikinOwner(d.owner); tengahin(d); }
      await terapkan(d, awal);
      detakShalat();
    } catch { /* putus sebentar: coba lagi nanti */ }
  }
  const ruang = peta.querySelector('img.ruang');
  function jedakan() {
    hentikanAcara();
    for (const o of semuaOrang()) bekukan(o);
  }
  function lanjutkan() {
    if (!dataTerakhir || document.hidden) return;
    // Rute shalat yang dibatalkan saat tab tidur harus dibuat ulang dari posisi terakhir.
    if (masjid) { acaraShalat = null; peta.classList.remove('khusyuk'); banner.hidden = true; detakShalat(); }
    terapkan(dataTerakhir);
    if (owner && !acaraShalat) jalanKe(owner, T.kursiOwner).then((tiba) => { if (tiba) { ownerHadir = true; terapkan(dataTerakhir); } });
  }
  function visibilitas() {
    if (document.hidden) jedakan();
    else lanjutkan();
  }
  function gantiGerak() { diam = mediaDiam.matches; jedakan(); lanjutkan(); }
  document.addEventListener('visibilitychange', visibilitas);
  mediaDiam.addEventListener('change', gantiGerak);
  window.addEventListener('pagehide', () => {
    selesai = true; jedakan(); permintaan.abort();
    for (const id of berkala) clearInterval(id);
    for (const [id, ok] of pewaktu) { clearTimeout(id); ok?.(); }
    pewaktu.clear(); berkala.clear();
    document.removeEventListener('visibilitychange', visibilitas);
    mediaDiam.removeEventListener('change', gantiGerak);
    gulir?.removeEventListener('scroll', rapihLabel); window.removeEventListener('resize', rapihLabel);
  }, { once: true });
  window.addEventListener('pageshow', (e) => { if (e.persisted && selesai) location.reload(); });
  // ---------- layar penuh (KD-149) ----------
  // Panel denah nutup seluruh layar (body.kantor-penuh di gaya-fitur.css) + Fullscreen API kalau browsernya punya.
  // iPhone gak punya Fullscreen API buat elemen biasa: cukup nutup layar browser. Kartu karakter & laci task tetap di atasnya.
  const panelPeta = peta.closest('.panel-peta');
  const alatPeta = panelPeta && document.createElement('div');
  if (panelPeta) {
    alatPeta.className = 'alat-peta';
    const tombolPenuh = document.createElement('button');
    tombolPenuh.type = 'button';
    tombolPenuh.className = 'tombol-penuh';
    alatPeta.append(tombolPenuh);
    panelPeta.append(alatPeta);
    const lagiPenuh = () => document.body.classList.contains('kantor-penuh');
    const labelPenuh = () => {
      const p = lagiPenuh();
      tombolPenuh.textContent = p ? t('app.penuh.keluar', null, '✕ Tutup layar penuh') : t('app.penuh.masuk', null, '⛶ Layar penuh');
      tombolPenuh.setAttribute('aria-pressed', String(p));
      tombolPenuh.title = p ? t('app.penuh.keluarKet', null, 'Tutup layar penuh (Esc)') : t('app.penuh.masukKet', null, 'Kantor layar penuh (f)');
    };
    const aturPenuh = (nyala) => {
      document.body.classList.toggle('kantor-penuh', nyala);
      const akar = document.documentElement;
      if (nyala) {
        if (akar.requestFullscreen) akar.requestFullscreen().catch(() => {});
        else if (akar.webkitRequestFullscreen) akar.webkitRequestFullscreen();
      } else if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      else if (document.webkitFullscreenElement) document.webkitExitFullscreen();
      labelPenuh();
      // Di HP tegak denahnya lebih lebar dari layar (geser kiri-kanan): tengahin ke tim lagi.
      requestAnimationFrame(() => { if (dataTerakhir) tengahin(dataTerakhir); });
    };
    tombolPenuh.addEventListener('click', (e) => { e.stopPropagation(); aturPenuh(!lagiPenuh()); });
    for (const ev of ['fullscreenchange', 'webkitfullscreenchange']) {
      document.addEventListener(ev, () => { if (!document.fullscreenElement && !document.webkitFullscreenElement && lagiPenuh()) aturPenuh(false); });
    }
    // Fase capture: dicek sebelum app.js nutup palet/laci, jadi Esc pertama cuma nutup yang lagi kebuka.
    document.addEventListener('keydown', (e) => {
      if (e.target.closest?.('input, textarea, select, [contenteditable]') || e.metaKey || e.ctrlKey || e.altKey) return;
      const adaLapisan = document.querySelector('.drawer:not([hidden]), .palet:not([hidden])');
      if ((e.key === 'f' || e.key === 'F') && !adaLapisan) { e.preventDefault(); aturPenuh(!lagiPenuh()); }
      else if (e.key === 'Escape' && lagiPenuh() && !document.fullscreenElement && !adaLapisan) aturPenuh(false);
    }, true);
    labelPenuh();
  }

  // ---------- zoom & geser (KD-149) ----------
  // Zoom = lebar .peta dikali z: posisi orang, potongan tutup, dan kanvas tema semua ikut ukuran denah; label & gelembung
  // tetap ukuran piksel jadi tetap kebaca. Geser = gulung .peta-gulir: mouse diseret, HP pakai geser bawaan + cubit dua jari.
  // Roda mouse nge-zoom cuma pas layar penuh atau sambil Ctrl (cubit touchpad = Ctrl+roda), biar gulir halaman gak kebajak.
  if (alatPeta && gulir) {
    const Z_MAKS = 3;
    let z = 1, lebarDasar = 0, tinggiDasar = 0, tinggiKotak = 0;
    const penuh = () => document.body.classList.contains('kantor-penuh');
    const grup = document.createElement('div');
    grup.className = 'zoom-peta';
    const tombol = (isi, ket) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = isi;
      b.title = ket;
      b.setAttribute('aria-label', ket);
      grup.append(b);
      return b;
    };
    const kecil = tombol('−', t('app.zoom.perkecil', null, 'Perkecil (-)'));
    const angka = tombol('100%', t('app.zoom.awal', null, 'Ukuran awal (0)'));
    const besar = tombol('+', t('app.zoom.perbesar', null, 'Perbesar (+)'));
    alatPeta.prepend(grup);
    // Ukuran denah tanpa zoom (ikut CSS: beda di HP, laptop, layar penuh).
    const ukurDasar = () => {
      const w = peta.style.width, h = gulir.style.height;
      peta.style.width = ''; gulir.style.height = '';
      const r = peta.getBoundingClientRect();
      lebarDasar = r.width; tinggiDasar = r.height; tinggiKotak = gulir.offsetHeight;
      peta.style.width = w; gulir.style.height = h;
    };
    // Paling kecil: seluruh denah kelihatan (di HP denahnya lebih lebar dari layar).
    const zMin = () => Math.min(1, gulir.clientWidth / lebarDasar, penuh() ? gulir.clientHeight / tinggiDasar : 1);
    const pasang = () => {
      peta.style.width = z === 1 ? '' : `${lebarDasar * z}px`;
      // Di halaman biasa tinggi kotak dikunci setinggi denah awal pas di-zoom, biar halamannya gak ikut memanjang.
      gulir.style.height = z > 1 && !penuh() ? `${tinggiKotak}px` : '';
      gulir.classList.toggle('di-zoom', z !== 1);
      angka.textContent = `${Math.round(z * 100)}%`;
      kecil.disabled = z <= zMin() + 0.001;
      besar.disabled = z >= Z_MAKS - 0.001;
    };
    // Zoom ke zBaru dengan titik (px, py) di kotak gulir tetap di tempatnya (default: tengah kotak).
    const zoomKe = (zBaru, px, py) => {
      if (!lebarDasar) ukurDasar();
      zBaru = Math.min(Z_MAKS, Math.max(zMin(), zBaru));
      if (Math.abs(zBaru - z) < 0.002) return;
      const g = gulir.getBoundingClientRect(), r = peta.getBoundingClientRect();
      px ??= Math.min(g.width, innerWidth - g.left) / 2;
      py ??= (Math.max(0, -g.top) + Math.min(g.height, innerHeight - g.top)) / 2;
      const fx = (g.left + px - r.left) / r.width, fy = (g.top + py - r.top) / r.height;
      z = zBaru;
      pasang();
      const r2 = peta.getBoundingClientRect();
      gulir.scrollLeft += r2.left + fx * r2.width - (g.left + px);
      gulir.scrollTop += r2.top + fy * r2.height - (g.top + py);
      rapihLabel();
    };
    kecil.addEventListener('click', (e) => { e.stopPropagation(); zoomKe(z / 1.5); });
    besar.addEventListener('click', (e) => { e.stopPropagation(); zoomKe(z * 1.5); });
    angka.addEventListener('click', (e) => { e.stopPropagation(); zoomKe(1); });
    // Ukuran kotak berubah (layar penuh, HP diputar, jendela diubah): ukur ulang, zoom tetap tapi dijaga di batasnya.
    let kotakLalu = '';
    new ResizeObserver(() => {
      const sidik = `${gulir.clientWidth}x${innerHeight}x${penuh()}`;
      if (sidik === kotakLalu) return;
      kotakLalu = sidik;
      if (!lebarDasar) return;
      ukurDasar();
      z = Math.min(Z_MAKS, Math.max(zMin(), z));
      pasang();
      rapihLabel();
    }).observe(gulir);
    const titikDi = (e) => { const g = gulir.getBoundingClientRect(); return [e.clientX - g.left, e.clientY - g.top]; };
    gulir.addEventListener('wheel', (e) => {
      if (!e.ctrlKey && !penuh()) return;
      e.preventDefault();
      const d = Math.max(-120, Math.min(120, e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY));
      zoomKe(z * Math.exp(-d * 0.0025), ...titikDi(e));
    }, { passive: false });
    gulir.addEventListener('dblclick', (e) => {
      if (e.target.closest('.orang, button, a')) return;
      zoomKe(z * 1.8, ...titikDi(e));
    });
    // Seret pakai mouse. Habis nyeret, "click" jangan kebaca sebagai ngetuk karakter.
    let seret = null, habisSeret = false;
    gulir.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('button, a, input, .alat-peta')) return;
      if (gulir.scrollWidth <= gulir.clientWidth && gulir.scrollHeight <= gulir.clientHeight) return;
      seret = { x: e.clientX, y: e.clientY, kiri: gulir.scrollLeft, atas: gulir.scrollTop, gerak: false };
    });
    addEventListener('pointermove', (e) => {
      if (!seret) return;
      const dx = e.clientX - seret.x, dy = e.clientY - seret.y;
      if (!seret.gerak && Math.hypot(dx, dy) < 6) return;
      if (!seret.gerak) { seret.gerak = true; gulir.classList.add('lagi-seret'); }
      gulir.scrollLeft = seret.kiri - dx;
      gulir.scrollTop = seret.atas - dy;
    });
    const lepasSeret = () => {
      if (seret?.gerak) { habisSeret = true; setTimeout(() => { habisSeret = false; }, 0); }
      seret = null;
      gulir.classList.remove('lagi-seret');
    };
    addEventListener('pointerup', lepasSeret);
    addEventListener('pointercancel', lepasSeret);
    gulir.addEventListener('click', (e) => { if (habisSeret) { e.stopPropagation(); e.preventDefault(); habisSeret = false; } }, true);
    // Cubit dua jari di HP: zoom denahnya, bukan zoom halaman (touch-action di gaya-fitur.css).
    let cubit = null;
    const jarakJari = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) || 1;
    gulir.addEventListener('touchstart', (e) => {
      cubit = e.touches.length === 2 ? { jarak: jarakJari(e.touches[0], e.touches[1]), z } : null;
    }, { passive: true });
    gulir.addEventListener('touchmove', (e) => {
      if (!cubit || e.touches.length !== 2) return;
      if (e.cancelable) e.preventDefault();
      const [a, b] = e.touches, g = gulir.getBoundingClientRect();
      zoomKe((cubit.z * jarakJari(a, b)) / cubit.jarak, (a.clientX + b.clientX) / 2 - g.left, (a.clientY + b.clientY) / 2 - g.top);
    }, { passive: false });
    gulir.addEventListener('touchend', (e) => { if (e.touches.length < 2) cubit = null; }, { passive: true });
    gulir.addEventListener('gesturestart', (e) => e.preventDefault()); // Safari: jangan zoom halaman
    document.addEventListener('keydown', (e) => {
      if (e.target.closest?.('input, textarea, select, [contenteditable]') || e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.querySelector('.drawer:not([hidden]), .palet:not([hidden])')) return;
      if (e.key === '+' || e.key === '=') zoomKe(z * 1.5);
      else if (e.key === '-' || e.key === '_') zoomKe(z / 1.5);
      else if (e.key === '0') zoomKe(1);
      else return;
      e.preventDefault();
    });
    ukurDasar();
    pasang();
  }

  // ---------- tema denah (Pulau Anime dkk): animasi air/rumput/daun di Web Worker + suara laut ----------
  // Data tema diselipin server di <script id="tema-denah"> (cuma kalau temanya punya animasi). Worker (aset/tema-hidup.js)
  // gambar ke OffscreenCanvas, jadi gerak karakter gak ikut patah-patah. Browser tanpa OffscreenCanvas: tanpa animasi.
  const TEMA = (() => { try { return JSON.parse(document.getElementById('tema-denah')?.textContent || 'null'); } catch { return null; } })();
  if (TEMA && !mediaDiam.matches && window.Worker && window.OffscreenCanvas && window.ImageBitmapRenderingContext) {
    const bawahK = document.createElement('canvas');
    bawahK.className = 'tema-kanvas';
    ruang.after(bawahK);
    try {
      const pekerja = new Worker('/aset/tema-hidup.js');
      // Worker kirim ImageBitmap tiap bingkai; ditampilin lewat 'bitmaprenderer' (tanpa salin). Satu kanvas di bawah
      // orang; kanvas di atas orang bikin browser tanpa GPU nyusun ulang seluruh denah tiap bingkai.
      const rb = bawahK.getContext('bitmaprenderer');
      // Bingkai bawa kotak dunianya sendiri: kanvas dipindah pas bingkainya nyampe, jadi air gak meleset waktu digeser/zoom.
      pekerja.onmessage = (e) => {
        const k = e.data.kam;
        if (k) bawahK.style.cssText = `left:${(k.x0 / T.lebar) * 100}%;top:${(k.y0 / T.tinggi) * 100}%;width:${((k.x1 - k.x0) / T.lebar) * 100}%;height:${((k.y1 - k.y0) / T.tinggi) * 100}%`;
        if (e.data.bawah) rb.transferFromImageBitmap(e.data.bawah);
        pekerja.postMessage({ diterima: true });
      };
      pekerja.postMessage({ mulai: { gambar: TEMA.gambar || {}, partikel: TEMA.partikel || 0, cipratan: TEMA.cipratan || [], dunia: [T.lebar, T.tinggi], pola: 1.8, kuat: 0.75 } });
      // Cuma bagian denah yang kelihatan (+ sisa 10% buat digeser) yang digambar, jadi air tetap tajam pas di-zoom (KD-149):
      // ±0,5 piksel kanvas per piksel layar, maks ±0,4 juta piksel.
      let ukuranLalu = '', ukurNanti = 0;
      const ukur = () => {
        const p = peta.getBoundingClientRect(), g = (gulir || peta).getBoundingClientRect();
        if (!p.width || !p.height) return;
        const bagian = (a, b, awal, lebar) => {
          const f0 = (a - awal) / lebar, f1 = (b - awal) / lebar, sisa = (f1 - f0) * 0.1;
          return [Math.max(0, f0 - sisa), Math.min(1, f1 + sisa)];
        };
        const [fx0, fx1] = bagian(g.left, g.right, p.left, p.width), [fy0, fy1] = bagian(g.top, g.bottom, p.top, p.height);
        if (fx1 <= fx0 || fy1 <= fy0) return;
        const w = (fx1 - fx0) * p.width, h = (fy1 - fy0) * p.height;
        const k = Math.min(Math.min(1.5, devicePixelRatio || 1) * 0.5, Math.sqrt(4e5 / (w * h)));
        const kotak = { x0: Math.floor(fx0 * T.lebar), y0: Math.floor(fy0 * T.tinggi), x1: Math.ceil(fx1 * T.lebar), y1: Math.ceil(fy1 * T.tinggi), cw: Math.max(1, Math.round(w * k)), ch: Math.max(1, Math.round(h * k)) };
        const sidik = Object.values(kotak).join();
        if (sidik === ukuranLalu) return;
        ukuranLalu = sidik;
        pekerja.postMessage({ kamera: kotak });
      };
      ukur();
      new ResizeObserver(ukur).observe(peta);
      gulir?.addEventListener('scroll', () => { ukurNanti ||= requestAnimationFrame(() => { ukurNanti = 0; ukur(); }); }, { passive: true });
      const malam = () => pekerja.postMessage({ malam: peta.classList.contains('hidup-malam') });
      new MutationObserver(malam).observe(peta, { attributes: true, attributeFilter: ['class'] });
      malam();
      document.addEventListener('visibilitychange', () => pekerja.postMessage({ jeda: document.hidden }));
      window.addEventListener('pagehide', () => pekerja.terminate(), { once: true });
    } catch { bawahK.remove(); }
  }
  // Suara laut (ASMR): dibangkitkan langsung di browser (Web Audio, tanpa berkas). Tombol nyala/mati + volume,
  // diinget di perangkat ini. Browser baru boleh bunyi setelah ada klik, jadi kalau terakhir nyala, mulai di klik pertama.
  if (TEMA?.suaraLaut && (window.AudioContext || window.webkitAudioContext)) {
    const wadah = peta.closest('.panel-peta') || peta;
    const kotak = document.createElement('div');
    kotak.className = 'tema-laut';
    const tombol = document.createElement('button');
    tombol.type = 'button';
    const geser = document.createElement('input');
    Object.assign(geser, { type: 'range', min: '0', max: '100', step: '1' });
    geser.setAttribute('aria-label', t('app.laut.volume', null, 'Volume suara laut'));
    kotak.append(tombol, geser);
    (alatPeta || wadah).append(kotak);
    const baca = (k, d) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } };
    const tulis = (k, v) => { try { localStorage.setItem(k, v); } catch { /* mode privat */ } };
    let nyala = baca('kantor-laut', '0') === '1';
    let vol = Math.max(0, Math.min(100, Number(baca('kantor-laut-vol', '55')) || 0));
    geser.value = String(vol);
    let mesin = null;
    function grafLaut(ctx, tujuan) {
      const sr = ctx.sampleRate, panjang = sr * 6;
      const coklat = ctx.createBuffer(2, panjang, sr), putih = ctx.createBuffer(2, panjang, sr);
      for (let ch = 0; ch < 2; ch++) {
        const c = coklat.getChannelData(ch), w = putih.getChannelData(ch);
        let akhir = 0;
        for (let i = 0; i < panjang; i++) { const r = Math.random() * 2 - 1; w[i] = r; akhir = (akhir + 0.02 * r) / 1.02; c[i] = akhir * 3.5; }
      }
      const sumber = (buf) => { const x = ctx.createBufferSource(); x.buffer = buf; x.loop = true; x.loopStart = Math.random() * 3; return x; };
      const keluar = ctx.createGain(), kompres = ctx.createDynamicsCompressor();
      keluar.gain.value = 1.2; kompres.threshold.value = -20; kompres.knee.value = 10; kompres.ratio.value = 4; kompres.attack.value = 0.05; kompres.release.value = 0.6;
      keluar.connect(kompres).connect(tujuan);
      const dasar = sumber(coklat), lpDasar = ctx.createBiquadFilter(), gDasar = ctx.createGain();
      lpDasar.type = 'lowpass'; lpDasar.frequency.value = 450; gDasar.gain.value = 0.45;
      dasar.connect(lpDasar).connect(gDasar).connect(keluar); dasar.start();
      let berikut = ctx.currentTime + 0.2;
      const naikPelan = (puncak, pangkat = 3) => Float32Array.from({ length: 64 }, (_, i) => Math.max(0.0001, puncak * Math.pow(i / 63, pangkat)));
      function ombak(t0) {
        const naik = 2.8 + Math.random() * 2.2, turun = 3.5 + Math.random() * 2.5, puncak = 0.6 + Math.random() * 0.4;
        const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        if (pan) { pan.pan.value = Math.random() * 1.2 - 0.6; pan.connect(keluar); }
        const ke = pan || keluar;
        const x = sumber(coklat), lp = ctx.createBiquadFilter(), g = ctx.createGain();
        lp.type = 'lowpass'; lp.Q.value = 0.4;
        lp.frequency.setValueAtTime(260, t0); lp.frequency.linearRampToValueAtTime(700 + Math.random() * 500, t0 + naik); lp.frequency.exponentialRampToValueAtTime(320, t0 + naik + turun);
        g.gain.setValueCurveAtTime(naikPelan(puncak), t0, naik); g.gain.exponentialRampToValueAtTime(0.0001, t0 + naik + turun);
        x.connect(lp).connect(g).connect(ke); x.start(t0); x.stop(t0 + naik + turun + 0.2);
        const b = sumber(putih), hp = ctx.createBiquadFilter(), lp2 = ctx.createBiquadFilter(), gb = ctx.createGain();
        hp.type = 'highpass'; hp.frequency.value = 1200; lp2.type = 'lowpass'; lp2.frequency.value = 5000;
        gb.gain.setValueCurveAtTime(naikPelan(0.035 + Math.random() * 0.03, 2), t0 + naik * 0.25, naik * 0.75 + 0.6);
        gb.gain.exponentialRampToValueAtTime(0.0001, t0 + naik + turun * 0.95);
        b.connect(hp).connect(lp2).connect(gb).connect(ke); b.start(t0 + naik * 0.25); b.stop(t0 + naik + turun);
        return naik + turun * (0.45 + Math.random() * 0.35);
      }
      return { jadwalkan(sampai) { while (berikut < sampai) berikut += ombak(berikut); } };
    }
    function buatMesin() {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const utama = ctx.createGain(); utama.gain.value = 0; utama.connect(ctx.destination);
      const graf = grafLaut(ctx, utama);
      graf.jadwalkan(ctx.currentTime + 4);
      const jadwal = setInterval(() => graf.jadwalkan(ctx.currentTime + 4), 1000);
      window.addEventListener('pagehide', () => { clearInterval(jadwal); ctx.close(); }, { once: true });
      return {
        volume(v) { utama.gain.setTargetAtTime(Math.pow(v / 100, 1.5) * 1.6, ctx.currentTime, 0.4); },
        jeda() { utama.gain.setTargetAtTime(0, ctx.currentTime, 0.3); setTimeout(() => ctx.state === 'running' && !nyala && ctx.suspend(), 1200); },
        lanjut() { if (ctx.state !== 'running') ctx.resume(); },
      };
    }
    function label() {
      tombol.textContent = nyala ? t('app.laut.nyala', null, '🌊 Suara laut') : t('app.laut.mati', null, '🔇 Suara laut');
      tombol.setAttribute('aria-pressed', String(nyala));
      geser.hidden = !nyala;
    }
    function terapkanLaut() {
      if (!nyala) { mesin?.jeda(); return; }
      mesin ||= buatMesin();
      mesin.lanjut(); mesin.volume(vol);
    }
    tombol.addEventListener('click', (e) => { e.stopPropagation(); nyala = !nyala; tulis('kantor-laut', nyala ? '1' : '0'); label(); terapkanLaut(); });
    geser.addEventListener('input', () => { vol = Number(geser.value); tulis('kantor-laut-vol', String(vol)); mesin?.volume(vol); });
    if (nyala) {
      const pertama = () => { terapkanLaut(); for (const ev of ['pointerdown', 'keydown']) document.removeEventListener(ev, pertama, true); };
      for (const ev of ['pointerdown', 'keydown']) document.addEventListener(ev, pertama, true);
    }
    label();
  }
  const mulai = () => { pasangTutup(ruang.currentSrc || ruang.src); tarik(true); tiap(tarik, 20000); if (masjid) tiap(detakShalat, 500); };
  if (ruang.complete) mulai(); else ruang.addEventListener('load', mulai, { once: true });
})();
