import fs from 'node:fs';
import path from 'node:path';
import {ffmpeg, pathAman, utama} from './video-aman.mjs';
import {kataTranskrip} from './cek-suara.mjs';
// Remotion menyediakan muxer WAV, bukan muxer PCM mentah. Fade 8 ms dikerjakan pada sampel.
export function bacaWav(wav) {
  if(wav.toString('ascii',0,4)!=='RIFF'||wav.toString('ascii',8,12)!=='WAVE') throw new Error('Hasil decode bukan WAV');
  let valid = false;
  for(let p=12;p+8<=wav.length;) {
    const id=wav.toString('ascii',p,p+4), ukuran=wav.readUInt32LE(p+4), awal=p+8;
    if(id==='fmt ') valid=wav.readUInt16LE(awal)===1 && wav.readUInt16LE(awal+2)===1 && wav.readUInt32LE(awal+4)===16000 && wav.readUInt16LE(awal+14)===16;
    if(id==='data') {if(!valid) throw new Error('Format WAV harus PCM16 mono 16 kHz'); return wav.subarray(awal,Math.min(wav.length,awal+ukuran));}
    p=awal+ukuran+(ukuran%2);
  }
  throw new Error('Sampel WAV belum ditemukan');
}
function tulisWav(pcm) {
  const h=Buffer.alloc(44);h.write('RIFF');h.writeUInt32LE(36+pcm.length,4);h.write('WAVEfmt ',8);h.writeUInt32LE(16,16);h.writeUInt16LE(1,20);h.writeUInt16LE(1,22);h.writeUInt32LE(16000,24);h.writeUInt32LE(32000,28);h.writeUInt16LE(2,32);h.writeUInt16LE(16,34);h.write('data',36);h.writeUInt32LE(pcm.length,40);return Buffer.concat([h,pcm]);
}
export function hitungTempo(jumlah, durasi, target = 150) {
  if (![jumlah, durasi, target].every((n) => Number.isFinite(n) && n > 0)) throw new Error('Jumlah kata, durasi dan kpm harus positif');
  return Math.max(0.90, Math.min(1.32, target / (jumlah / durasi * 60)));
}
export function potonganSunyi(pcm, kata, sr = 16000) {
  const langkah = sr / 100; const db = [];
  for (let i = 0; i + langkah <= pcm.length / 2; i += langkah) {
    let energi = 0; for (let j = i; j < i + langkah; j++) energi += (pcm.readInt16LE(j * 2) / 32768) ** 2;
    db.push(10 * Math.log10(energi / langkah + 1e-15));
  }
  const potong = [];
  for (let k = 0; k < kata.length - 1; k++) {
    const a = kata[k], b = kata[k + 1]; const jeda = b.mulai - a.akhir;
    const target = /[.!?]["”']?$/.test(a.t) ? 0.40 : /[,;:]["”']?$/.test(a.t) ? 0.26 : 0.22;
    if (jeda <= Math.max(target + 0.04, 0.3)) continue;
    let awal = null, terbaik = [0, 0];
    for (let n = Math.max(0, Math.floor(a.akhir * 100)); n <= Math.min(db.length, Math.ceil(b.mulai * 100)); n++) {
      if (db[n] < -44 && n < Math.ceil(b.mulai * 100)) { if (awal === null) awal = n; }
      else if (awal !== null) { if (n - awal > terbaik[1] - terbaik[0]) terbaik = [awal, n]; awal = null; }
    }
    const dari = terbaik[0] / 100 + 0.07, sampai = terbaik[1] / 100 - 0.06;
    const buang = Math.min(jeda - target, sampai - dari);
    if (buang > 0.02) { const tengah = (dari + sampai) / 2; potong.push([tengah - buang / 2, tengah + buang / 2]); }
  }
  return potong;
}
export function olahSuara(file, target = 150, run = ffmpeg) {
  const input = pathAman(file);
  if (!['.mp3','.wav','.m4a','.ogg'].includes(path.extname(input).toLowerCase())) throw new Error('Pilih berkas audio mp3, wav, m4a, atau ogg');
  const kata = kataTranskrip(JSON.parse(fs.readFileSync(pathAman(`${input}.kata.json`), 'utf8')));
  if (kata.some((k, i) => typeof k.t !== 'string' || !Number.isFinite(k.mulai) || !Number.isFinite(k.akhir) || k.mulai < 0 || k.akhir <= k.mulai || (i && k.mulai < kata[i - 1].mulai))) throw new Error('Waktu kata tidak valid');
  const wav = run(['-v','error','-i',input,'-ac','1','-ar','16000','-c:a','pcm_s16le','-f','wav','-'], {encoding: null}).stdout;
  const pcm = bacaWav(wav);
  const durasi = pcm.length / 32000;
  if (kata.at(-1).akhir > durasi + 0.1) throw new Error('Waktu transkrip melewati audio');
  const potong = potonganSunyi(pcm, kata);
  const dibuang = (t) => potong.reduce((n,[a,b]) => n + Math.max(0, Math.min(t,b) - a), 0);
  const tempo = hitungTempo(kata.length, kata.at(-1).akhir - kata[0].mulai - dibuang(kata.at(-1).akhir) + dibuang(kata[0].mulai), target);
  let x = 0; const simpan = [];
  for (const [a,b] of potong) {if (a > x) simpan.push([x,a]); x = b;} if (x < durasi) simpan.push([x,durasi]);
  const bagian = simpan.map(([a,b]) => {
    const bytes = Buffer.from(pcm.subarray(Math.round(a*16000)*2, Math.round(b*16000)*2));
    const panjang = bytes.length / 2, fade = Math.min(128, Math.floor(panjang / 2));
    for(let i=0;i<fade;i++) {
      bytes.writeInt16LE(Math.round(bytes.readInt16LE(i*2) * i/fade),i*2);
      const akhir = (panjang-1-i)*2; bytes.writeInt16LE(Math.round(bytes.readInt16LE(akhir) * i/fade),akhir);
    }
    return bytes;
  });
  const keluar = pathAman(input.slice(0,-path.extname(input).length) + '-olah.mp3');
  if (fs.existsSync(keluar)) throw new Error('Hasil olah sudah ada. Simpan versi baru dulu');
  const sementara = fs.mkdtempSync(path.join(path.dirname(input),'.suara-'));
  try {
    const rapat = pathAman(path.join(sementara,'rapat.wav'));
    fs.writeFileSync(rapat, tulisWav(Buffer.concat(bagian)), {flag:'wx'});
    run(['-nostdin','-n','-v','error','-i',rapat,'-af',`atempo=${tempo},loudnorm=I=-14:TP=-1.5:LRA=9`,'-ar','44100','-b:a','192k',keluar]);
  } finally {fs.rmSync(sementara,{recursive:true,force:true});}
  return {keluar, tempo, potongan: potong.length, dibuang: dibuang(durasi), catatan: 'Transkrip ULANG berkas hasil olah; waktu kata mentah tidak berlaku'};
}
if (utama(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (!(args.length === 1 || (args.length === 3 && args[1] === '--kpm'))) throw new Error('Pakai: suara-olah.mjs <audio> --kpm 150');
    console.log(JSON.stringify(olahSuara(args[0], args[2] === undefined ? 150 : Number(args[2])), null, 2));
  } catch (e) {console.error(e.message); process.exitCode = 1;}
}
