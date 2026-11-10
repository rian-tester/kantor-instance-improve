// Logika murni, dipakai browser dan tes Node. Titik merujuk graf kantor.js.
((akar) => {
  const pixel = { kopi: 'pantry', ngobrol: 'kor1', rapat: 'rpDalam', makan: 'pantryTengah', sunset: 'loungeKiri', tidur: 'lounge', satpam: 'korKiri', tamu: 'resep' };
  const KEMAMPUAN = {
    kantor: { ...pixel }, masjid: { ...pixel }, studio: { ...pixel, studio: 'stTengah' },
    cozy: { kopi: 'dapur', ngobrol: 'tengah', rapat: 'rapatDalam', makan: 'dapur', sunset: 'teras', tidur: 'kiriDepan', satpam: 'atasMeja', tamu: 'lobi' },
    modern: { ngobrol: 'tengahDepan', rapat: 'rapatDalam', sunset: 'lounge', tidur: 'lounge', satpam: 'atasMeja', tamu: 'lobi' },
    // Kantor lengkap (KD-149): sore ke rooftop, malam ke nap pods, plus olahraga di gym & belajar di Academy.
    lengkap: { ...pixel, studio: 'stTengah', sunset: 'roofTengah', tidur: 'napTengah', olahraga: 'gymTengah', belajar: 'academyTengah' },
  };
  const TINGKAT = { tenang: 480000, sedang: 240000, ramai: 120000 };
  function setelan(x) {
    return { nyala: x?.nyala !== false, ramai: Object.prototype.hasOwnProperty.call(TINGKAT, x?.ramai) ? x.ramai : 'sedang' };
  }
  function hash(s) {
    let h = 2166136261;
    for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return h >>> 0;
  }
  function jamKantor(waktu, zona = 'Asia/Jakarta') {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: zona, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' }).formatToParts(waktu).map((x) => [x.type, x.value]));
    return { tanggal: `${p.year}-${p.month}-${p.day}`, jam: Number(p.hour) };
  }
  function pilihAcara({ template, waktu, zona, pengaturan, terakhir = '' }) {
    const s = setelan(pengaturan), mampu = KEMAMPUAN[template];
    if (!s.nyala || !mampu) return null;
    const { tanggal, jam } = jamKantor(waktu, zona);
    const slot = Math.floor(waktu / TINGKAT[s.ramai]);
    let calon = ['kopi', 'ngobrol', 'rapat', 'satpam', 'tamu', 'studio', 'olahraga', 'belajar'];
    if (jam >= 12 && jam < 14) calon = ['makan', 'ngobrol'];
    else if (jam >= 17 && jam < 19) calon = ['sunset', 'ngobrol'];
    else if (jam >= 21 || jam < 6) calon = ['tidur', 'satpam'];
    calon = calon.filter((k) => mampu[k] && k !== terakhir);
    if (!calon.length) return null;
    const jenis = calon[hash(`${tanggal}:${slot}:${template}`) % calon.length];
    return { id: `${tanggal}:${slot}`, jenis, titik: mampu[jenis] };
  }
  function jedaOrang(id, waktu, keadaan, pengaturan) {
    const s = setelan(pengaturan);
    const dasar = TINGKAT[s.ramai] / (keadaan === 'santai' ? 4 : 1);
    return dasar + hash(`${id}:${Math.floor(waktu / 60000)}`) % dasar;
  }
  function pemicu(lama, baru) {
    if (!lama) return []; // membuka kantor bukan mengulang seluruh riwayat
    const sudah = new Set(lama.map((e) => e.id));
    return baru.filter((e) => !sudah.has(e.id));
  }
  function bolehGerak({ pengaturan, tersembunyi, diam, shalat, bergerak = 0, hp = false }) {
    return setelan(pengaturan).nyala && !tersembunyi && !diam && !shalat && bergerak < (hp ? 1 : 2);
  }
  const api = { KEMAMPUAN, TINGKAT, setelan, hash, jamKantor, pilihAcara, jedaOrang, pemicu, bolehGerak };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else akar.KantorHidup = api;
})(globalThis);
