import {spawn} from 'node:child_process';

// -60 dB = 0,001 dari rentang 0..255. Scene memakai selisih MAFD seperti filter select.
export const AMBANG_BEKU = 255 * 10 ** (-60 / 20);
export const AMBANG_CUT = 0.32;
export function penghitungFrame(metadata, ambang) {
  let sebelumnya, indeks = 0, mulai = 0, mafdLama = 0;
  const beku = [], waktuCut = [];
  const simpan = akhir => { if (akhir - mulai > ambang) beku.push({mulai, akhir, durasi: akhir - mulai}); };
  return {
    tambah(frame) {
      if (sebelumnya) {
        let beda = 0;
        for (let i = 0; i < frame.length; i++) beda += Math.abs(frame[i] - sebelumnya[i]);
        beda /= frame.length;
        if (beda >= AMBANG_BEKU) { simpan((indeks - 1) / metadata.fps); mulai = indeks / metadata.fps; }
        const mafd = beda * 100 / 255;
        if (Math.min(mafd, Math.abs(mafd - mafdLama)) / 100 > AMBANG_CUT) waktuCut.push(indeks / metadata.fps);
        mafdLama = mafd;
      }
      sebelumnya = Buffer.from(frame); indeks++;
    },
    selesai() {
      if (indeks === 0) throw new Error('Frame video belum terbaca');
      simpan(metadata.durasi);
      return {beku, ambangBeku: ambang, bekuWajar: beku.every(b => b.durasi <= ambang + 1 / metadata.fps), cutKeras: waktuCut.length, waktuCut};
    },
  };
}
export async function analisisFrame(alat, input, metadata, ambang) {
  const tinggi = Math.max(2, Math.round(metadata.height * 64 / metadata.width / 2) * 2);
  const ukuran = 64 * tinggi;
  const hitung = penghitungFrame(metadata, ambang);
  const anak = spawn(alat.bin, ['-nostdin', '-v', 'error', '-i', input, '-an', '-vf', `scale=64:${tinggi},format=gray`, '-c:v', 'rawvideo', '-threads', '1', '-f', 'image2pipe', '-'], {env: {...process.env, LD_LIBRARY_PATH: alat.libraryPath}, stdio: ['ignore', 'pipe', 'pipe'], timeout: 600000});
  let sisa = Buffer.alloc(0), log = '';
  anak.stderr.on('data', b => { log = (log + b).slice(-2000); });
  await new Promise((ok, gagal) => {
    anak.once('error', gagal);
    anak.once('close', kode => kode === 0 ? ok() : gagal(new Error(`Decode frame gagal (${kode}): ${log}`)));
    anak.stdout.on('data', bagian => {
      const data = sisa.length ? Buffer.concat([sisa, bagian]) : bagian;
      let p = 0;
      for (; p + ukuran <= data.length; p += ukuran) hitung.tambah(data.subarray(p, p + ukuran));
      sisa = Buffer.from(data.subarray(p));
    });
  });
  if (sisa.length) throw new Error('Frame terakhir tidak lengkap');
  return hitung.selesai();
}
