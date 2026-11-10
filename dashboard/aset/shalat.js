// Rumus matahari dari acuan Ops. Dipakai browser dan validasi setelan dashboard tanpa API.
((akar) => {
  const KOTA = [
    ['Jakarta', -6.2088, 106.8456, 'Asia/Jakarta'], ['Bandung', -6.9175, 107.6191, 'Asia/Jakarta'],
    ['Surabaya', -7.2575, 112.7521, 'Asia/Jakarta'], ['Medan', 3.5952, 98.6722, 'Asia/Jakarta'],
    ['Makassar', -5.1477, 119.4327, 'Asia/Makassar'], ['Denpasar', -8.65, 115.2167, 'Asia/Makassar'],
    ['Jayapura', -2.5337, 140.7181, 'Asia/Jayapura'], ['Ambon', -3.6954, 128.1814, 'Asia/Jayapura'],
  ].map(([nama, lintang, bujur, zona]) => ({ nama, lintang, bujur, zona }));
  const ZONA = { 'Asia/Jakarta': 7, 'Asia/Makassar': 8, 'Asia/Jayapura': 9 };
  function lokasi(x) {
    if (!x || typeof x.nama !== 'string' || !x.nama.trim() || x.nama.length > 80 ||
      typeof x.lintang !== 'number' || !Number.isFinite(x.lintang) || Math.abs(x.lintang) > 90 ||
      typeof x.bujur !== 'number' || !Number.isFinite(x.bujur) || Math.abs(x.bujur) > 180 ||
      !Object.hasOwn(ZONA, x.zona)) return { ...KOTA[0] };
    return { nama: x.nama.trim(), lintang: x.lintang, bujur: x.bujur, zona: x.zona };
  }
  const rad = (d) => d * Math.PI / 180, deg = (r) => r * 180 / Math.PI;
  const fix = (a, b) => ((a % b) + b) % b;
  function matahari(jd) {
    const D = jd - 2451545;
    const g = fix(357.529 + 0.98560028 * D, 360), q = fix(280.459 + 0.98564736 * D, 360);
    const L = fix(q + 1.915 * Math.sin(rad(g)) + 0.02 * Math.sin(rad(2 * g)), 360);
    const e = 23.439 - 0.00000036 * D;
    const RA = fix(deg(Math.atan2(Math.cos(rad(e)) * Math.sin(rad(L)), Math.cos(rad(L)))) / 15, 24);
    return { dek: deg(Math.asin(Math.sin(rad(e)) * Math.sin(rad(L)))), eqt: q / 15 - RA };
  }
  function jadwal(y, m, d, tempat) {
    const { lintang: lat, bujur: lng, zona } = lokasi(tempat), tz = ZONA[zona];
    const jd = Date.UTC(y, m - 1, d) / 86400000 + 2440587.5 - lng / 360;
    const tengah = (t) => fix(12 - matahari(jd + t / 24).eqt, 24);
    const sudut = (a, t, pagi) => {
      const { dek } = matahari(jd + t / 24);
      const x = (-Math.sin(rad(a)) - Math.sin(rad(dek)) * Math.sin(rad(lat))) / (Math.cos(rad(dek)) * Math.cos(rad(lat)));
      return tengah(t) + (pagi ? -1 : 1) * deg(Math.acos(Math.max(-1, Math.min(1, x)))) / 15;
    };
    const asar = (t) => sudut(-deg(Math.atan(1 / (1 + Math.tan(rad(Math.abs(lat - matahari(jd + t / 24).dek)))))), t, false);
    let j = { subuh: 5, zuhur: 12, asar: 13, magrib: 18, isya: 18 };
    for (let i = 0; i < 2; i++) j = { subuh: sudut(20, j.subuh, true), zuhur: tengah(j.zuhur), asar: asar(j.asar), magrib: sudut(0.833, j.magrib, false), isya: sudut(18, j.isya, false) };
    return Object.fromEntries(Object.entries(j).map(([k, jam]) => [k, Date.UTC(y, m - 1, d) - tz * 3600e3 + Math.round((jam + tz - lng / 15 + 2 / 60) * 60) * 60e3]));
  }
  const NAMA = { subuh: 'Subuh', zuhur: 'Zuhur', asar: 'Asar', magrib: 'Magrib', isya: 'Isya', jumat: 'Jumat' };
  function rencana(nama) {
    const urut = [], rakaat = { subuh: 2, zuhur: 4, asar: 4, magrib: 3, isya: 4, jumat: 2 }[nama];
    for (let r = 1; r <= rakaat; r++) {
      urut.push([1, r === 1 ? 50 : r === 2 ? 40 : 25], [2, 10], [1, 6], [3, 10], [4, 6], [3, 10]);
      if (r === 2 && rakaat > 2) urut.push([4, 20]);
      if (r === rakaat) urut.push([4, 45], [1, 6]);
    }
    const mulai = nama === 'jumat' ? 210 + 720 + 30 + 300 + 25 : 210;
    const selesai = mulai + urut.reduce((n, [, detik]) => n + detik, 0);
    return { nama, urut, mulai, selesai, habis: selesai + 90 };
  }
  function acara(kini, tempat) {
    const l = lokasi(tempat);
    const bagian = Object.fromEntries(new Intl.DateTimeFormat('en', { timeZone: l.zona, year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(new Date(kini)).map((p) => [p.type, p.value]));
    const y = Number(bagian.year), m = Number(bagian.month), d = Number(bagian.day);
    const jumat = new Date(Date.UTC(y, m - 1, d)).getUTCDay() === 5;
    for (const [waktu, t] of Object.entries(jadwal(y, m, d, l))) {
      const r = rencana(waktu === 'zuhur' && jumat ? 'jumat' : waktu), detik = (kini - t) / 1000;
      if (detik >= 0 && detik < r.habis) return { ...r, detik, id: `${t}-${r.nama}` };
    }
    return null;
  }
  const api = { KOTA, ZONA, NAMA, lokasi, jadwal, rencana, acara };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else akar.Shalat = api;
})(globalThis);
