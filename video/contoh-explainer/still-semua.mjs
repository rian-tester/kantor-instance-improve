import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {pathAman} from '../../alat/video-aman.mjs';
const folder = path.dirname(fileURLToPath(import.meta.url));
const proyek = path.dirname(folder);
const daftar = JSON.parse(fs.readFileSync(path.join(folder,'daftar.json'),'utf8'));
const keluar = pathAman(path.join(folder,'still'));
fs.mkdirSync(keluar,{recursive:true});
const sementara = pathAman(path.join(proyek,'out','hero-sementara'));
fs.mkdirSync(sementara,{recursive:true});
const cli = path.join(proyek,'node_modules/@remotion/cli/remotion-cli.js');
function jalankan(args) {
  const r = spawnSync(process.execPath,[cli,...args],{cwd:proyek,stdio:['ignore','pipe','pipe'],encoding:'utf8',timeout:1200000,maxBuffer:4<<20});
  if(r.error || r.status !== 0) throw new Error(r.error?.message || r.stderr?.slice(-1200) || `exit ${r.status}`);
}
try {
  for(const contoh of daftar) for(const frame of contoh.hero) {
    const nama = `${contoh.id}-${frame}`;
    const png = pathAman(path.join(sementara,`${nama}.png`));
    const jpg = pathAman(path.join(keluar,`${nama}.jpg`));
    if(fs.existsSync(jpg)) throw new Error(`Berkas sudah ada: ${jpg}. Pindahkan hasil lama dulu`);
    jalankan(['still','contoh-explainer/index.tsx',contoh.id,png,`--frame=${frame}`,'--scale=0.5','--concurrency=1']);
    let cukup = false;
    for(const kualitas of [4,8,12,18,25,31]) {
      jalankan(['ffmpeg','-nostdin','-y','-v','error','-i',png,'-vf',`scale=${contoh.width > contoh.height ? 960 : 540}:-2`,'-q:v',String(kualitas),'-frames:v','1',jpg]);
      if(fs.statSync(jpg).size<=60000) {cukup=true;break;}
    }
    if(!cukup) {fs.rmSync(jpg);throw new Error(`${nama} masih melebihi 60 KB`);}
    fs.rmSync(png);console.log(path.relative(proyek,jpg));
  }
} finally {fs.rmSync(sementara,{recursive:true,force:true});}
