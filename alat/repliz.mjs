#!/usr/bin/env node
// Lembur.id: posting & performa sosmed lewat Repliz. Jalan dari ~/kantor. Gak manggil AI, gak makan jatah.
//   node alat/repliz.mjs status        Repliz nyambung? akun apa aja yang bisa dipakai
//   node alat/repliz.mjs rencana       daftar rencana posting (sosmed/terbit/*.json) + status & masalahnya
//   node alat/repliz.mjs cek           perbarui status yang udah dijadwal (terjadwal → tayang/gagal) + notif HP
//   node alat/repliz.mjs performa      ambil angka asli → sosmed/performa/terbaru.md (dibaca buat laporan)
//   node alat/repliz.mjs jadwal <id>   KHUSUS dashboard, abis owner pencet "Setujui & jadwalkan"
//   node alat/repliz.mjs batal <id>    KHUSUS dashboard, abis owner pencet "Batalin"
// Kunci Repliz diisi owner di dashboard → Lainnya → Sosmed (disimpen di .rahasia/repliz.json, gak pernah dicetak).
// Paket Repliz: posting butuh Premium, angka per postingan butuh Gold, statistik akun cukup Standard.
import path from 'node:path';
import { execFile } from 'node:child_process';
import * as R from './repliz-inti.mjs';

const K = process.env.KANTOR || path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [perintah, arg] = process.argv.slice(2);
const notif = (judul, isi) => new Promise((ok) => execFile('bash', [path.join(K, 'notif.sh'), judul, isi], { cwd: K, timeout: 30000 }, () => ok()));

async function main() {
  if (perintah === 'masuk') {
    const h = await R.ambilPesan(K);
    for (const p of R.semuaPesan(K)) console.log(`${p.jenis}-${p.id}: ${p.nama} · ${p.status} · ${p.teks}`);
    for (const c of h.catatan) console.log(c);
    return;
  }
  if (perintah === 'draf' && arg) {
    const args = process.argv.slice(2);
    const i = args.indexOf('--teks');
    R.drafPesan(K, arg, i >= 0 ? args[i + 1] : '', { aman: args.includes('--aman'), lewati: args.includes('--lewati') });
    return console.log('Draf disimpan, belum dikirim.');
  }
  if (perintah === 'status') {
    if (!R.adaKunci(K)) return console.log('❌ Repliz belum disambungin. Owner isi kuncinya di dashboard → Lainnya → Sosmed.');
    const akun = await R.daftarAkun(R.klienKantor(K));
    R.tulisJson(R.jalur(K).akun, { waktu: new Date().toISOString(), akun });
    console.log(`✅ Repliz nyambung, ${akun.filter((a) => a.nyambung).length} akun siap dipakai:`);
    for (const a of akun) console.log(`  ${a.nyambung ? '•' : '✗'} ${(R.PLATFORM[a.platform]?.nama || a.platform).padEnd(10)} @${a.username}${a.nyambung ? '' : '  (PUTUS: sambungin ulang di app Repliz)'}`);
    return;
  }
  if (perintah === 'rencana') {
    let akun = null;
    if (R.adaKunci(K)) { try { akun = await R.daftarAkun(R.klienKantor(K)); } catch (e) { console.log(`⚠️ ${e.message} (akun gak dicek)`); } }
    const semua = R.semuaRencana(K, akun);
    if (!semua.length) return console.log('Belum ada rencana di sosmed/terbit/.');
    for (const p of semua) {
      console.log(`${p.id}: ${R.STATUS[p.status] || p.status}${p.waktu ? ` · ${R.tampilWib(p.waktu)}` : ''}${p.r?.judul ? ` · ${p.r.judul}` : ''}`);
      for (const m of p.masalah) console.log(`   ✗ ${m}`);
      if (p.st.alasan) console.log(`   owner: ${p.st.alasan}`);
      for (const h of p.st.jadwal || []) console.log(`   ${h.platform} @${h.username}: ${h.status}${h.pesan ? ` (${h.pesan})` : ''}`);
    }
    return;
  }
  if (perintah === 'cek') {
    if (!R.adaKunci(K)) return;
    for (const b of await R.cek(K)) {
      const di = (xs) => xs.map((h) => R.PLATFORM[h.platform]?.nama || h.platform).join(', ');
      console.log(`${b.id}: ${b.status}`);
      if (b.baruTayang.length) await notif('Sosmed: udah tayang', `${b.judul} tayang di ${di(b.baruTayang)}`);
      if (b.baruGagal.length) await notif('Sosmed: gagal tayang', `${b.judul} gagal di ${di(b.baruGagal)}. Cek app Repliz dulu (kadang tetap tayang), terus putusin di dashboard.`);
    }
    return;
  }
  if (perintah === 'performa') {
    const isi = await R.performa(K);
    console.log(`✅ ${isi.akun.length} akun, ${isi.konten.length} postingan. Ringkasan: sosmed/performa/terbaru.md`);
    for (const c of isi.catatan) console.log(`⚠️ ${c}`);
    return;
  }
  if (perintah === 'jadwal' && arg) {
    const h = await R.jadwal(K, arg);
    console.log(`${{ terjadwal: '✅', sebagian: '⚠️', gagal: '❌' }[h.status]} ${arg}: ${R.STATUS[h.status]}, tayang ${R.tampilWib(h.kapan)} WIB`);
    if (h.status === 'gagal') process.exitCode = 2;
    for (const x of h.hasil) console.log(`   ${x.platform} @${x.username}: ${x.status}${x.pesan ? ` (${x.pesan})` : ''}`);
    return;
  }
  if (perintah === 'batal' && arg) {
    console.log((await R.batal(K, arg)) ? `✅ ${arg} dibatalin.` : `⚠️ ${arg}: sebagian udah tayang / gak bisa dibatalin, cek app Repliz.`);
    return;
  }
  console.log('Pakai: node alat/repliz.mjs status | rencana | cek | performa | masuk | draf <dm-ID|komen-ID> --teks "..." [--aman] | draf <ID> --lewati');
  process.exitCode = 1;
}
main().catch((e) => { console.log(`❌ ${e.message}`); process.exitCode = e instanceof R.ReplizGagal ? 2 : 1; });
