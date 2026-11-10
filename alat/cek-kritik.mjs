// Cek konsistensi keputusan kritik dan ikat ke render asli; bukan pengganti mata Kritikus.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const [file, folder] = process.argv.slice(2);
const gagal = pesan => { console.error('Belum lolos: '+pesan); process.exit(1); };
if (!file || !folder) gagal('pakai node alat/cek-kritik.mjs <kritik.json> <folder-render>');
let k,q;
try { k=JSON.parse(fs.readFileSync(file,'utf8'));q=JSON.parse(fs.readFileSync(path.join(folder,'qc.json'),'utf8')); }
catch { gagal('file kritik atau qc.json belum ada/valid'); }
const aspek=['hierarki','kebaca_hp','ritme','konsistensi','orisinal','brand','gerak','craft'];
if (!['penuh','diam'].includes(k.cakupan)) gagal('cakupan harus penuh atau diam');
if (!Number.isInteger(k.putaran)||k.putaran<1||k.putaran>3) gagal('putaran harus 1–3; selebihnya kembali ke owner');
if (!Array.isArray(k.masalah)||!Array.isArray(k.gambar_dibuka)) gagal('daftar masalah/gambar belum lengkap');
for (const a of aspek) {
 if (!Number.isInteger(k.skor?.[a])||k.skor[a]<1||k.skor[a]>5) gagal('skor '+a+' harus 1–5');
 if (typeof k.alasan?.[a]!=='string'||k.alasan[a].trim().length<8) gagal('alasan skor '+a+' belum jelas');
}
// Jawaban harus berasal dari pengamatan Kritikus, bukan hasil QC mesin.
const pagar={
 logo:['brand'], dunia_brand:['brand'], brand_tanpa_footer:['brand'],
 cover_grid:['hierarki','kebaca_hp','ritme'],
 cover_stop_scroll:['ritme','orisinal'], cover_janji:['ritme'],
 fakta_bersumber:['craft'], jangkar_tiap_slide:['hierarki'],
 penutup_payoff_brand:['ritme','brand'], empat_tipe:['ritme'],
 suara_konsisten:['konsistensi'], motif_maks_dua:['orisinal','brand'],
 bahasa_alami:['craft'], cek_bahasa_nol:['craft'],
 angka_banding_jelas:['hierarki'], teks_sesuai_naskah:['craft'],
 sumber_satu_baris:['kebaca_hp','craft'], post_brand:['brand','craft']
};
for (const [cek, terkait] of Object.entries(pagar)) {
 if (typeof k.pertanyaan_wajib?.[cek]!=='boolean') gagal('jawaban ya/tidak belum ada: '+cek);
 if (typeof k.bukti_wajib?.[cek]!=='string'||k.bukti_wajib[cek].trim().length<8) gagal('bukti slide/sumber belum jelas: '+cek);
 if (!k.pertanyaan_wajib[cek]&&terkait.some(a=>k.skor[a]>3)) gagal(cek+' tidak: skor '+terkait.join('/')+' maksimal 3');
}
if (!Number.isInteger(q.jumlah_slide)||q.jumlah_slide<1||!Array.isArray(q.slide)||q.slide.length!==q.jumlah_slide) gagal('QC belum lengkap');
const required=['kontak.png','grid.png'];
for(let i=1;i<=q.jumlah_slide;i++)for(const p of ['slide','hp','strip'])required.push(p+'-'+String(i).padStart(2,'0')+'.png');
for(const name of required) {
 if (!k.gambar_dibuka.includes(name)) gagal(name+' belum dinyatakan dibuka');
 let hash; try { hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(folder,name))).digest('hex'); } catch { gagal(name+' hilang'); }
 if (q.sha256?.[name]!==hash||k.render_sha256?.[name]!==hash) gagal('kritik/QC tidak cocok render terbaru: '+name);
}
if (!Array.isArray(q.galat_halaman)||q.galat_halaman.length||q.total_temuan!==0||q.slide.some(s=>!Array.isArray(s.temuan)||s.temuan.length)) gagal('QC tidak lengkap atau masih ada temuan mesin');
if (k.masalah.some(m=>typeof m.berat!=='boolean'||!Number.isInteger(m.slide)||m.slide<1||m.slide>q.jumlah_slide||!m.masalah||!m.perbaikan)) gagal('masalah harus punya slide, berat, lokasi dan perbaikan');
const bergerak=Array.isArray(q.animasi)&&q.animasi.length===q.jumlah_slide&&q.animasi.every(a=>a.gerak===true);
if (!bergerak&&k.skor.gerak!==1) gagal('tidak ada gerak lengkap, skor gerak harus 1');
const dinilai=aspek.filter(a=>k.cakupan==='penuh'||a!=='gerak');
const lolos=dinilai.every(a=>k.skor[a]>=4)&&!k.masalah.some(m=>m.berat);
if (typeof k.lolos!=='boolean'||k.lolos!==lolos) gagal('nilai lolos tidak konsisten dengan skor/masalah');
if (!lolos) gagal('skor di bawah empat atau ada masalah berat');
console.log(k.cakupan==='penuh'?'Lolos rubrik penuh untuk render ini; tetap tunggu owner.':'Lolos cakupan diam saja; BUKAN setara Ale penuh.');
