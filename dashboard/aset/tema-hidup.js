// Animasi tema denah kantor (air beriak, ombak, busa pantai, angin di rumput, daun/kunang-kunang, cipratan).
// Digambar di Web Worker pakai OffscreenCanvas, jadi gerak karakter (kantor.js) gak ikut keberatan.
// Dua kanvas: "bawah" (air/rumput, di bawah orang) dan "atas" (daun, kunang-kunang, cipratan).
// kantor.js ngirim: mulai {gambar, partikel, cipratan, dunia}, kamera {x0,y0,x1,y1,cw,ch}, malam, jeda.
// Balik: {bawah: ImageBitmap, kam: kotak dunia bingkai itu}.
// Gak ada AI dan gak ada jaringan selain gambar dashboard sendiri.
/* eslint-env worker */
let bawah = null, atas = null, gb = null, ga = null, lapis = null, lg = null;
let G = {}, P = {}, IMG = {}, DUNIA = [4744, 3708], kam = null, malam = false, jeda = false;
let daun = [], cipr = [], kirimBitmap = false, sibuk = false, POLA = 1, KUAT = 1;

const kurva = (t, periode, geser, titik) => {
  const f = ((t / 1000 + geser) / periode % 1 + 1) % 1;
  for (let i = 1; i < titik.length; i++) if (f <= titik[i][0]) {
    const [f0, v0] = titik[i - 1], [f1, v1] = titik[i], k = (f - f0) / (f1 - f0);
    return v0 + (v1 - v0) * (k * k * (3 - 2 * k));
  }
  return titik.at(-1)[1];
};
const geserPola = (t, periode, dx, dy) => { const f = (t / 1000 / periode) % 1; return [dx * f, dy * f]; };

async function muat(u) {
  try { const r = await fetch(u); if (!r.ok) return null; return await createImageBitmap(await r.blob()); } catch { return null; }
}

self.onmessage = async (e) => {
  const d = e.data;
  if (d.mulai) {
    // Mode bitmap (kit): worker gambar ke kanvas sendiri lalu kirim ImageBitmap; halaman nampilin lewat 'bitmaprenderer'.
    kirimBitmap = !d.bawah;
    // Kit: satu kanvas aja (daun & cipratan ikut digambar di kanvas air, di bawah orang). Kanvas kedua di atas orang
    // bikin browser tanpa GPU nyusun ulang seluruh denah tiap bingkai (13 fps vs 60 fps).
    bawah = d.bawah || new OffscreenCanvas(1, 1); atas = d.atas || (kirimBitmap ? bawah : new OffscreenCanvas(1, 1));
    gb = bawah.getContext('2d'); ga = atas === bawah ? gb : atas.getContext('2d');
    lapis = new OffscreenCanvas(1, 1); lg = lapis.getContext('2d');
    G = d.mulai.gambar || {}; DUNIA = d.mulai.dunia || DUNIA;
    // Denah kit tampil utuh (diperkecil ±3×): pola riak/ombak dibesarin & dilembutin biar gak jadi garis-garis rapat.
    POLA = d.mulai.pola || 1; KUAT = d.mulai.kuat || 1;
    const kunci = ['air', 'rumput', 'laut', 'pantai', 'riak', 'kilau', 'ombak', 'busa'];
    const hasil = await Promise.all(kunci.map((k) => (G[k] ? muat(G[k]) : null)));
    kunci.forEach((k, i) => { IMG[k] = hasil[i]; });
    for (const k of ['riak', 'kilau', 'ombak', 'busa']) P[k] = IMG[k] ? lg.createPattern(IMG[k], 'repeat') : null;
    const WARNA = ['#f4a261', '#e76f51', '#f6bd60', '#f7a8b8', '#a7c957'];
    daun = Array.from({ length: d.mulai.partikel || 0 }, (_, i) => baruDaun(WARNA[i % WARNA.length], true));
    cipr = (d.mulai.cipratan || []).map(([x, y]) => ({ x, y, periode: 5.5 + Math.random() * 4.5, geser: Math.random() * 10 }));
    putar();
  }
  if (d.kamera) kam = d.kamera;
  if ('malam' in d) malam = !!d.malam;
  if ('jeda' in d) jeda = !!d.jeda;
  if (d.diterima) sibuk = false;
};

function baruDaun(warna, acak) {
  const [W, H] = DUNIA;
  return { x: Math.random() * W * 0.9, y: Math.random() * H * 0.85, vx: 22 + Math.random() * 30, vy: 12 + Math.random() * 16,
    rot: Math.random() * 6.28, vr: 0.6 + Math.random() * 1.2, umur: acak ? Math.random() * 25 : 0, batas: 16 + Math.random() * 14, warna, fase: Math.random() * 6.28 };
}

const isi = (p, img, ukuran, ox, oy, alfa, x0, y0, x1, y1) => {
  if (!p || !img || alfa <= 0.01) return;
  p.setTransform(new DOMMatrix().translateSelf(ox * POLA, oy * POLA).scaleSelf((ukuran * POLA) / img.width));
  lg.globalAlpha = Math.min(1, alfa * KUAT); lg.fillStyle = p; lg.fillRect(x0, y0, x1 - x0, y1 - y0);
};
function grup(masker, r, gambar) {
  if (!masker) return;
  lg.globalCompositeOperation = 'source-over'; lg.globalAlpha = 1;
  lg.clearRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
  gambar();
  lg.globalCompositeOperation = 'destination-in'; lg.globalAlpha = 1;
  lg.drawImage(masker, 0, 0, DUNIA[0], DUNIA[1]);
  gb.drawImage(lapis, 0, 0);
}

let akhir = 0, dtLalu = 0;
function putar() {
  const t = performance.now();
  const lanjut = () => setTimeout(putar, 33);
  if (jeda || !kam || sibuk || t - akhir < 66) { lanjut(); return; } // ±15 fps (air lambat, cukup); tunggu halaman nerima bingkai
  const dt = Math.min(0.2, (t - (dtLalu || t)) / 1000); dtLalu = t; akhir = t;
  const r = kam, k = r.cw / (r.x1 - r.x0);
  if (bawah.width !== r.cw || bawah.height !== r.ch) { bawah.width = atas.width = lapis.width = r.cw; bawah.height = atas.height = lapis.height = r.ch; if (ga === gb) gb = ga = bawah.getContext('2d'); }
  gb.setTransform(1, 0, 0, 1, 0, 0); gb.clearRect(0, 0, r.cw, r.ch);
  lg.setTransform(k, 0, 0, k, -r.x0 * k, -r.y0 * k);
  const { x0, y0, x1, y1 } = r;
  grup(IMG.air, r, () => {
    const [a, b] = geserPola(t, 34, 512, 256), [c, d] = geserPola(t, 51, -768, 768), [e, f] = geserPola(t, 13, -512, 512);
    isi(P.riak, IMG.riak, 512, a, b, 0.5, x0, y0, x1, y1);
    isi(P.riak, IMG.riak, 768, c, d, 0.32, x0, y0, x1, y1);
    isi(P.kilau, IMG.kilau, 512, e, f, kurva(t, 13, 0, [[0, 0.15], [0.25, 0.85], [0.5, 0.2], [0.75, 0.75], [1, 0.15]]), x0, y0, x1, y1);
  });
  grup(IMG.laut, r, () => {
    const [a, b] = geserPola(t, 26, -512, 256), [c, d] = geserPola(t, 39, -700, 350);
    isi(P.ombak, IMG.ombak, 512, a, b, kurva(t, 9, 0, [[0, 0.25], [0.5, 0.8], [1, 0.25]]), x0, y0, x1, y1);
    isi(P.ombak, IMG.ombak, 700, c, d, kurva(t, 12.5, 4, [[0, 0.2], [0.5, 0.6], [1, 0.2]]), x0, y0, x1, y1);
  });
  grup(IMG.pantai, r, () => {
    const maju = (geser, periode) => kurva(t, periode, geser, [[0, 0], [0.38, 1], [1, 0]]);
    const m1 = maju(0, 6.8), m2 = maju(3.4, 9.1);
    isi(P.busa, IMG.busa, 360, 10 - 24 * m1, 6 - 14 * m1, kurva(t, 6.8, 0, [[0, 0.05], [0.38, 0.95], [0.55, 0.7], [1, 0.05]]), x0, y0, x1, y1);
    isi(P.busa, IMG.busa, 300, 150 - 24 * m2, 90 - 14 * m2, kurva(t, 9.1, 3.4, [[0, 0.05], [0.38, 0.95], [0.55, 0.7], [1, 0.05]]), x0, y0, x1, y1);
    lg.globalAlpha = kurva(t, 6.8, 1.2, [[0, 0.08], [0.35, 0.75], [0.5, 0.45], [1, 0.08]]);
    lg.fillStyle = 'rgb(245,252,255)'; lg.fillRect(x0, y0, x1 - x0, y1 - y0);
  });
  grup(IMG.rumput, r, () => {
    for (const [periode, geser, kuat] of [[17, 0, 0.26], [23, 9, 0.18]]) {
      const f = ((t / 1000 + geser) / periode) % 1, bx = -1200 + f * (DUNIA[0] + 2400);
      const gr = lg.createLinearGradient(bx - 500, 0, bx + 500, 0);
      gr.addColorStop(0, 'rgba(255,252,215,0)'); gr.addColorStop(0.5, `rgba(255,255,235,${kuat})`); gr.addColorStop(1, 'rgba(255,252,215,0)');
      lg.globalAlpha = 1; lg.fillStyle = gr; lg.fillRect(x0, y0, x1 - x0, y1 - y0);
    }
  });
  // Lapisan atas: cipratan di kaki tebing + daun berguguran (malam: kunang-kunang).
  ga.setTransform(1, 0, 0, 1, 0, 0); if (ga !== gb) ga.clearRect(0, 0, r.cw, r.ch);
  ga.setTransform(k, 0, 0, k, -x0 * k, -y0 * k);
  const di = (x, y, m) => x > x0 - m && x < x1 + m && y > y0 - m && y < y1 + m;
  for (const c of cipr) {
    if (!di(c.x, c.y, 120)) continue;
    const f = ((t / 1000 + c.geser) / c.periode) % 1;
    if (f < 0.58 || f > 0.95) continue;
    const u = (f - 0.58) / 0.37, naik = Math.sin(u * Math.PI), alfa = u < 0.15 ? u / 0.15 : 1 - (u - 0.15) / 0.85;
    ga.globalAlpha = Math.max(0, alfa) * 0.9;
    ga.fillStyle = '#fff';
    // Buih di permukaan + tetes yang loncat lalu jatuh.
    ga.beginPath(); ga.ellipse(c.x, c.y, 30 + 30 * u, 9 + 6 * u, 0, 0, 6.283); ga.fill();
    for (const [dx, dy, rr] of [[-34, -16, 7], [28, -24, 6], [-12, -44, 6], [40, -6, 5], [10, -60, 4], [-46, -34, 4], [0, -8, 8]]) {
      ga.beginPath(); ga.arc(c.x + dx * (0.6 + 0.6 * u), c.y + dy * naik * 1.2, rr * (0.6 + 0.6 * naik), 0, 6.283); ga.fill();
    }
  }
  for (let i = 0; i < daun.length; i++) {
    const p = daun[i];
    p.umur += dt; p.x += p.vx * dt; p.y += (p.vy + Math.sin(p.umur * 1.7 + p.fase) * 18) * dt; p.rot += p.vr * dt;
    if (p.umur > p.batas) { daun[i] = baruDaun(p.warna, false); continue; }
    if (!di(p.x, p.y, 40)) continue;
    const muncul = Math.min(1, p.umur / 2, (p.batas - p.umur) / 2);
    if (malam) {
      const kedip = 0.35 + 0.65 * Math.abs(Math.sin(p.umur * 2.3 + p.fase));
      ga.globalAlpha = muncul * kedip;
      const g = ga.createRadialGradient(p.x, p.y, 0, p.x, p.y, 16);
      g.addColorStop(0, 'rgba(255,250,190,1)'); g.addColorStop(0.35, 'rgba(255,236,130,.6)'); g.addColorStop(1, 'rgba(255,236,130,0)');
      ga.fillStyle = g; ga.beginPath(); ga.arc(p.x, p.y, 16, 0, 6.283); ga.fill();
    } else {
      ga.globalAlpha = muncul * 0.85;
      ga.save(); ga.translate(p.x, p.y); ga.rotate(p.rot);
      ga.fillStyle = p.warna; ga.beginPath(); ga.ellipse(0, 0, 11, 6, 0, 0, 6.283); ga.fill();
      ga.restore();
    }
  }
  ga.globalAlpha = 1;
  if (kirimBitmap) {
    const b1 = bawah.transferToImageBitmap();
    sibuk = true;
    self.postMessage({ bawah: b1, kam: r }, [b1]); // kotak dunianya ikut: kanvas dipindah pas bingkainya nyampe
  }
  lanjut();
}
