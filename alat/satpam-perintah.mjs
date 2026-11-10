// Satpam kantor = SATU-SATUNYA rem keras di perintah Bash (KD-189, Aldy 09/11: "bebas kecuali yang bahaya").
// Daftar allow Claude Code sekarang `Bash` penuh, jadi python -c, heredoc, sed -i, perintah gabungan, redirect, cp/mv, npm/pip
// jalan tanpa tombol izin. Hook PreToolUse ini cuma nahan (keluar 2 + pesan buat agen) tiga hal:
//   a) rahasia: perintah apa pun yang nyebut atau resolve ke jalur deny Read (setelan/fal.json, .rahasia/), termasuk lewat
//      kutip/escape/brace/glob/cd dan folder induknya buat alat rekursif;
//   b) nulis ke jalur kunci (deny Edit: alat/, notif.sh, render.mjs, .claude/settings*, dst) lewat redirect, cp/mv/tee/sed -i/w,
//      rm, atau kode bebas (python/node/heredoc/bash -c) yang nyebut jalur itu;
//   c) yang bahaya: sudo, dd, mkfs, chmod -R, git reset --hard, git push --force, shutdown/reboot, pkill/killall, dan rm yang
//      lebar (/, ~, akar kantor, .., *) atau ke luar kantor.
// Yang masih nanya (curl, wget, scp, rsync, git push, apt, systemctl, crontab) diatur daftar ask di .claude/settings.json.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

// Buang isi tanda kutip dulu, biar teks yang cuma nyebut "python3 -c" (mis. di pesan commit atau grep) gak ikut ketolak.
const tanpaKutip = (s) => s.replace(/'[^']*'/g, "''").replace(/"(?:\\.|[^"\\])*"/g, '""');

const POLA = [
  [/(^|[\s;&|(])python[\d.]*\s+(-[A-Za-z]*c\b|-\s*($|[;&|<]))/, 'python3 -c / python3 -'],
  [/(^|[\s;&|(])node\s+(?:--[\w-]+(?:=\S+)?\s+)*(-e|--eval|-p|--print)\b/, 'node -e'],
  [/(^|[\s;&|(])node\s+(?:--[\w-]+(?:=\S+)?\s+)*(-\s*($|[;&|<])|<)/, 'node baca kode dari input'],
  // Heredoc ke interpreter = kode bebas. Heredoc ke cat/tee = cuma data (isi berkas), bukan kode.
  [/(^|[\s;&|(])(?:(?:ba|z)?sh|python[\d.]*|node|perl|ruby|php)\b[^\n|;&]*<<-?\s*(''|""|\w)/, 'heredoc ke interpreter (<<EOF)'],
  [/\|\s*(?:(?:ba|z)?sh|python[\d.]*|node|perl|ruby|php)\s*(-\s*)?($|[;&|)\n])/, 'kode lewat pipe ke interpreter'],
  [/(^|[\s;&|(])(perl|ruby|php)\s+-[A-Za-z]*e\b/, 'perl/ruby/php -e'],
  [/(^|[\s;&|(])(ba|z)?sh\s+-[A-Za-z]*c\b/, 'bash -c'],
];

export function cekPerintah(cmd) {
  const s = tanpaKutip(String(cmd || ''));
  for (const [re, nama] of POLA) if (re.test(s)) return nama;
  return null;
}

// Teks yang benar-benar KODE: potongan interpreter dengan -c/-e (isi kutip ikut), dan dari interpreter-heredoc sampai akhir
// perintah. Perintah lain di baris yang sama (node carousel/render.mjs; python3 -c ...) bukan kode, jadi gak ikut dicocokin teks.
export function kodeTeks(cmd) {
  const c = String(cmd || ''); const hasil = [];
  const heredoc = /(^|[\s;&|(])(?:(?:ba|z)?sh|python[\d.]*|node|perl|ruby|php)\b[^\n|;&]*<<-?\s*['"]?(\w+)['"]?/.exec(c);
  if (heredoc) { // kodenya cuma sampai baris pembatas; perintah sesudahnya (cd x && node render.mjs) bukan kode
    const dari = heredoc.index + heredoc[0].length; const akhir = c.slice(dari).search(new RegExp(`\\n[ \\t]*${heredoc[2]}[ \\t]*(\\n|$)`));
    hasil.push(c.slice(heredoc.index, akhir >= 0 ? dari + akhir + 1 + heredoc[2].length : undefined));
  }
  if (/\|\s*(?:(?:ba|z)?sh|python[\d.]*|node|perl|ruby|php)\s*(-\s*)?($|[;&|)\n])/.test(tanpaKutip(c))) hasil.push(c);
  for (const seg of potong(c)) if (cekPerintah(seg)) hasil.push(seg);
  return hasil;
}

// Pecah perintah jadi potongan (&&, ||, ;, |, &, baris baru) tanpa motong di dalam tanda kutip. Teks potongan tetap ASLI.
export function potong(cmd) {
  const hasil = []; let cur = ''; let q = '';
  const s = String(cmd || '');
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { cur += c; if (c === '\\' && q === '"') { cur += s[++i] ?? ''; } else if (c === q) q = ''; continue; }
    if (c === "'" || c === '"') { q = c; cur += c; continue; }
    if (c === '\\') { cur += c + (s[++i] ?? ''); continue; }
    if (c === '&' && (s[i - 1] === '>' || s[i + 1] === '>' || s[i - 1] === '<')) { cur += c; continue; } // 2>&1, &>file, <&3 bukan pemisah
    if (c === ';' || c === '|' || c === '&' || c === '\n' || c === '(' || c === ')' || c === '`') { if (cur.trim()) hasil.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim()) hasil.push(cur.trim());
  return hasil;
}

const REKURSIF_BAWAAN = new Set(['tar', 'bsdtar', 'zip', 'rsync', '7z', 'cpio']); // rekursif tanpa perlu -r

// Pecah satu potongan jadi kata kayak shell: kutip & backslash dibuang. glob = ada * ? [ di luar kutip.
export function pecahKata(seg) {
  const kata = []; let cur = ''; let ada = false; let glob = false; let brace = false; let q = '';
  const s = String(seg || '');
  const tutup = () => { if (ada) kata.push({ teks: cur, glob, brace }); cur = ''; ada = false; glob = false; brace = false; };
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q === "'") { if (c === "'") q = ''; else cur += c; continue; }
    if (q === '"') { if (c === '"') q = ''; else if (c === '\\' && i + 1 < s.length) cur += s[++i]; else cur += c; continue; }
    if (c === "'" || c === '"') { q = c; ada = true; continue; }
    if (c === '\\') { if (i + 1 < s.length) { cur += s[++i]; ada = true; } continue; }
    if (/\s/.test(c)) { tutup(); continue; }
    if (/[*?[]/.test(c)) glob = true;
    if (c === '{') brace = true;
    cur += c; ada = true;
  }
  tutup();
  return kata;
}

// Brace expansion ala bash di luar kutip: {a,b}, {1..3}, {a..c}, bersarang, alternatif kosong. Maks 200 hasil.
export function akolade(t, batas = 200) {
  const cari = (str) => {
    for (let i = 0; i < str.length; i++) {
      if (str[i] !== '{') continue;
      let dalam = 0; const koma = [];
      for (let j = i; j < str.length; j++) {
        if (str[j] === '{') dalam++;
        else if (str[j] === '}') { dalam--; if (dalam === 0) return { i, j, koma }; }
        else if (str[j] === ',' && dalam === 1) koma.push(j);
      }
    }
    return null;
  };
  const hasil = (str) => {
    const m = cari(str); if (!m) return [str];
    const awal = str.slice(0, m.i); const akhir = str.slice(m.j + 1); const isi = str.slice(m.i + 1, m.j);
    let bagian;
    if (m.koma.length) { const titik = [m.i, ...m.koma, m.j]; bagian = titik.slice(0, -1).map((a, n) => str.slice(a + 1, titik[n + 1])); }
    else {
      const r = /^(-?\d+)\.\.(-?\d+)$/.exec(isi) || /^([A-Za-z])\.\.([A-Za-z])$/.exec(isi);
      if (!r) return hasil(akhir).map((x) => awal + '{' + isi + '}' + x);
      const angka = /\d/.test(r[1]); const a = angka ? Number(r[1]) : r[1].charCodeAt(0); const z = angka ? Number(r[2]) : r[2].charCodeAt(0);
      bagian = []; for (let v = a; a <= z ? v <= z : v >= z; v += a <= z ? 1 : -1) { bagian.push(angka ? String(v) : String.fromCharCode(v)); if (bagian.length > batas) break; }
    }
    const ujung = hasil(akhir); const keluar = [];
    for (const b of bagian) for (const x of hasil(b)) for (const y of ujung) { keluar.push(awal + x + y); if (keluar.length > batas) return keluar; }
    return keluar;
  };
  return hasil(String(t)).slice(0, batas);
}

// Kembangkan glob ke berkas yang ada (maks 300), relatif ke cwd. Tanpa fs.globSync biar jalan di Node 22 tanpa peringatan.
function kembangGlob(pola, cwd) {
  const abs = path.isAbsolute(pola); const bagian = pola.split('/').filter((x, i) => x !== '' || i === 0);
  let hasil = [abs ? '/' : cwd];
  for (const b of abs ? bagian.slice(1) : bagian) {
    const baru = [];
    for (const dasar of hasil) {
      if (!/[*?[]/.test(b)) { baru.push(path.join(dasar, b)); continue; }
      let isi = []; try { isi = fs.readdirSync(dasar); } catch { continue; }
      let re; try { re = new RegExp('^' + b.replace(/[.+^${}()|\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$'); } catch { continue; }
      for (const f of isi) if (re.test(f) && (b.startsWith('.') || !f.startsWith('.'))) baru.push(path.join(dasar, f));
    }
    hasil = baru.slice(0, 300);
  }
  return hasil;
}
const nyata = (p) => { try { return fs.realpathSync(p); } catch { return p; } };
const rumah = process.env.HOME || '/root';
// ~user = rumah user itu (dari /etc/passwd, cadangan /home/<user>); ~ = rumah sendiri.
function rumahUser(nama) {
  try { for (const l of fs.readFileSync('/etc/passwd', 'utf8').split('\n')) { const f = l.split(':'); if (f[0] === nama && f[5]) return f[5]; } } catch { /* abaikan */ }
  return nama === 'root' ? '/root' : `/home/${nama}`;
}
const sempit = (x) => {
  x = String(x);
  if (x === '~') return rumah; if (x.startsWith('~/')) return path.join(rumah, x.slice(2));
  const m = /^~([A-Za-z0-9_.-]+)(\/.*)?$/.exec(x); return m ? path.join(rumahUser(m[1]), m[2] || '') : x;
};

// Daftar jalur ABSOLUT (dari entri deny yang sudah dibersihkan) buat dicocokin ke hasil resolve tiap argumen.
export function jalurAbsolut(daftar, proyek) {
  return daftar.map((j) => ({ j, abs: nyata(path.resolve(proyek, j.replace(/\/$/, ''))), folder: j.endsWith('/') }));
}
// Tiap kata perintah (dan nilai --opsi=jalur) di-resolve ke cwd (+ proyek) setelah kutip/escape/glob dibuang. Hasil: jalur
// sasaran yang kena, atau null. Argumen folder yang ISINYA ada sasaran kena kalau perintahnya rekursif (-r/-R/--recursive).
// `cd` dilacak di dalam satu perintah, jadi `cd setelan && jq . fal.json` ketangkep.
export function kenaJalur(cmd, cwd, proyek, sasaran, awalan = false, induk = true) {
  let sekarang = nyata(cwd || proyek); let sekarangKecuali = [];
  const cocokPola = (pola, nama) => { try { return new RegExp('^' + pola.replace(/[.+^${}()|\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$').test(nama); } catch { return false; } };
  const apakah = (p, rekursif) => {
    const r = nyata(p);
    for (const t of sasaran) {
      if (induk && rekursif && sekarangKecuali.length && t.abs.startsWith(r.replace(/\/$/, '') + '/') && t.abs.slice(r.length).split('/').filter(Boolean).some((c) => sekarangKecuali.some((pl) => cocokPola(pl, c)))) continue;
      if (r === t.abs || r.startsWith(t.abs + '/') || (awalan && r.startsWith(t.abs))) return t.j;
      if (induk && rekursif && t.abs.startsWith(r.replace(/\/$/, '') + '/')) return t.j + ' (di dalam ' + r + ')';
    }
    return null;
  };
  for (const seg of potong(cmd)) {
    const kata = pecahKata(seg); if (!kata.length) continue;
    const dasar = kata[0].teks.split('/').pop();
    if (dasar === 'cd') {
      const tujuan = kata[1]?.teks ?? '~'; const p = path.resolve(sekarang, sempit(tujuan));
      const kena = apakah(p, false); if (kena) return kena;
      sekarang = nyata(p); continue;
    }
    // find/ls cuma nampilin nama berkas (isi gak kebaca), jadi gak ikut aturan folder-rekursif.
    const huruf = dasar === 'cp' ? /[rRa]/ : /[rR]/; // cp -a = rekursif juga
    const rekursif = !['find', 'ls'].includes(dasar) && (REKURSIF_BAWAAN.has(dasar) || kata.some((k) => /^-[A-Za-z]{1,5}$/.test(k.teks) && huruf.test(k.teks) || k.teks === '--recursive'));
    // --exclude-dir=NAMA / --exclude=POLA: yang dikecualiin bukan diakses (grep -rn x --exclude-dir=setelan .).
    const kecuali = []; for (let i = 1; i < kata.length; i++) { const x = kata[i].teks; if (/^--exclude(-dir)?=/.test(x)) kecuali.push(x.slice(x.indexOf('=') + 1)); else if (/^--exclude(-dir)?$/.test(x) && kata[i + 1]) kecuali.push(kata[i + 1].teks); }
    sekarangKecuali = kecuali;
    let lewat = false;
    for (const k of kata.slice(1)) {
      if (lewat) { lewat = false; continue; }
      if (/^--(exclude|include)(-dir)?=/.test(k.teks)) continue;
      if (/^--(exclude|include)(-dir)?$/.test(k.teks)) { lewat = true; continue; }
      let t = k.teks.replace(/^\d*>>?&?/, '').replace(/^<+/, '');
      const nilai = [t]; const eq = t.indexOf('='); if (t.startsWith('-') && eq > 0) nilai.push(t.slice(eq + 1));
      // Skrip sed bisa nulis/jalanin lewat w/W/r/R/e: tiap potongan skrip diperiksa juga sebagai jalur.
      if (dasar === 'sed') for (const c of t.split(/[\s;{}]+/)) { if (c) { nilai.push(c); const lepas = c.replace(/^[\d,$]*[wWrRe]/, ''); if (lepas && lepas !== c) nilai.push(lepas); } }
      if (k.brace) for (const v of [...nilai]) nilai.push(...akolade(v));
      for (const v of nilai) {
        if (!v || v === '-') continue;
        for (const dasarDir of new Set([sekarang, nyata(proyek)])) {
          const lokasi = k.glob ? kembangGlob(sempit(v), dasarDir) : [path.resolve(dasarDir, sempit(v))];
          for (const p of lokasi) { const kena = apakah(p, rekursif); if (kena) return kena; }
        }
      }
    }
  }
  return null;
}

// Jalur yang dikunci pagar dari deny di .claude/settings.json. Tulis = deny Edit(...); baca = deny Read(...).
const bersih = (x) => x.replace(/^\.\//, '').replace(/^~\/kantor\//, '').replace(/\*.*$/, '');
export function jalurTerkunci(dir = process.env.CLAUDE_PROJECT_DIR || process.cwd()) {
  let deny;
  try { deny = JSON.parse(fs.readFileSync(path.join(dir, '.claude/settings.json'), 'utf8')).permissions?.deny || []; }
  catch { deny = ['Edit(./alat/**)', 'Edit(./notif.sh)', 'Edit(./detak.sh)', 'Edit(./.rahasia/**)', 'Edit(./.claude/settings*.json)', 'Edit(./carousel/render.mjs)', 'Read(./.rahasia/**)', 'Read(./setelan/fal.json)']; }
  const ambil = (jenis) => deny.map((x) => new RegExp(`^${jenis}\\((.*)\\)$`).exec(x)?.[1]).filter(Boolean).map(bersih).filter((x) => x.length > 2);
  return { tulis: ambil('Edit'), baca: ambil('Read') };
}

// Isi $(...) dan `...` yang kejebak di dalam kutip ganda tetap dijalankan shell: dikeluarin jadi perintah sendiri biar ikut dicek.
// Isi kutip tunggal bukan substitusi, jadi dibuang dulu. Bersarang sampai 3 tingkat.
export function bongkar(cmd, tingkat = 0) {
  if (tingkat > 3) return [];
  const t = String(cmd || '').replace(/'[^']*'/g, "''"); const hasil = [];
  for (let i = 0; i < t.length; i++) {
    if (t[i] === '$' && t[i + 1] === '(' && t[i + 2] !== '(') {
      let d = 1; let j = i + 2; for (; j < t.length && d; j++) { if (t[j] === '(') d++; else if (t[j] === ')') d--; }
      hasil.push(t.slice(i + 2, d ? t.length : j - 1)); i = j - 1;
    } else if (t[i] === '`') { const j = t.indexOf('`', i + 1); if (j < 0) break; hasil.push(t.slice(i + 1, j)); i = j; }
  }
  return hasil.flatMap((x) => [x, ...bongkar(x, tingkat + 1)]);
}
export const diperluas = (cmd) => [String(cmd || ''), ...bongkar(cmd)].join('\n');

// ---------- (c) perintah bahaya ----------
const BUNGKUS = new Set(['env', 'nohup', 'time', 'command', 'nice', 'timeout', 'xargs', 'stdbuf', 'exec', 'builtin', 'setsid']);
// Buang awalan VAR=1 dan pembungkus (env/nohup/time/xargs/...) beserta opsinya, biar `nohup sudo x` & `xargs rm -rf` ketangkep.
function inti(kata) {
  let i = 0; let lewatXargs = false;
  for (;;) {
    while (i < kata.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(kata[i].teks)) i++;
    const w = kata[i]?.teks.split('/').pop();
    if (!w || !BUNGKUS.has(w)) break;
    if (w === 'xargs') lewatXargs = true;
    i++;
    while (i < kata.length && (/^-/.test(kata[i].teks) || /^\d+[smhd]?$/.test(kata[i].teks))) i++;
  }
  const sisa = kata.slice(i);
  return { w: sisa[0]?.teks.split('/').pop() || '', arg: sisa.slice(1), lewatXargs };
}
const rekursifRm = (arg) => arg.some((k) => /^-[A-Za-z]*[rR]/.test(k.teks) || k.teks === '--recursive');
const maksaGaris = /^(\/|~[A-Za-z0-9_.-]*|\.|\.\.|\*|\.\*|\.\/\*|\.\.\/.*|~\/.*)$/;

// rm: berkas biasa di dalam kantor jalan. Ditahan: rm ke luar kantor, dan rm rekursif ke target lebar (/, ~, akar kantor atau
// induknya, .., *). Tanpa target yang kebaca (xargs rm -r) dianggap lebar.
function bahayaRm(arg, cwd, proyek, lewatXargs) {
  const rek = rekursifRm(arg);
  const target = arg.filter((k) => !/^-/.test(k.teks) || k.teks === '-');
  if (!target.length) return rek && lewatXargs ? 'rm rekursif lewat xargs (target gak kebaca)' : null;
  const akar = nyata(proyek);
  if (rek && target.some((k) => /[$`]/.test(k.teks))) return 'rm rekursif dengan variabel atau substitusi (target gak bisa dicek)';
  for (const k of target) {
    const bentuk = [k.teks]; if (k.brace) bentuk.push(...akolade(k.teks));
    for (const t of bentuk) {
      if (rek && maksaGaris.test(t) && !/^\.\.\//.test(t) && !/^~[A-Za-z0-9_.-]*\//.test(t)) return `rm rekursif ke ${t}`;
      for (const dasar of new Set([nyata(cwd || proyek), akar])) {
        const lokasi = k.glob ? kembangGlob(sempit(t), dasar) : [path.resolve(dasar, sempit(t))];
        for (const loc of lokasi.length ? lokasi : [path.resolve(dasar, sempit(t))]) {
          const r = nyata(loc);
          if (r !== akar && !r.startsWith(akar + '/')) return `rm ke luar kantor (${r})`;
          if (rek && (r === akar || akar.startsWith(r + '/'))) return 'rm rekursif ke akar kantor atau induknya';
        }
      }
    }
  }
  return null;
}

// tar -x / unzip: isi arsip bisa nimpa alat/ atau .claude/settings. Target ekstrak harus subfolder kantor, dan daftar isi arsip
// (tar -tf / unzip -Z1) dicocokin ke jalur kunci dan rahasia. Arsip yang gak bisa dibaca daftarnya (stdin) ditahan kalau
// targetnya akar kantor atau jalur kunci.
function bahayaEkstrak(w, arg, cwd, proyek, daftar) {
  const t = arg.map((k) => k.teks);
  let arsip = null; let target = null;
  if (w === 'unzip') {
    if (t.some((x) => /^-[A-Za-z]*[lptvz]/.test(x) && !/^-[A-Za-z]*[dxo]/.test(x))) return null; // cuma baca / stdout
    const d = t.indexOf('-d'); if (d >= 0) target = t[d + 1]; else { const x = t.find((y) => /^-d./.test(y)); if (x) target = x.slice(2); }
    arsip = t.find((x, i) => !x.startsWith('-') && t[i - 1] !== '-d');
  } else {
    const lama = t[0] && !t[0].startsWith('-') && /^[A-Za-z]+$/.test(t[0]) ? t[0] : '';
    const ekstrak = t.some((x) => /^-[A-Za-z]*x/.test(x) || x === '--extract' || x === '--get') || /x/.test(lama);
    if (!ekstrak || t.some((x) => /^-[A-Za-z]*O/.test(x) || x === '--to-stdout')) return null;
    const c = t.findIndex((x) => x === '-C' || x === '--directory'); if (c >= 0) target = t[c + 1];
    else { const x = t.find((y) => /^-C./.test(y) || /^--directory=/.test(y)); if (x) target = x.startsWith('--') ? x.slice(x.indexOf('=') + 1) : x.slice(2); }
    const f = t.findIndex((x) => /^-[A-Za-z]*f$/.test(x) || x === '--file'); if (f >= 0) arsip = t[f + 1]; else { const x = t.find((y) => /^--file=/.test(y)); if (x) arsip = x.slice(7); else if (/f/.test(lama)) arsip = t[1]; }
  }
  const akar = nyata(proyek); const tujuan = nyata(path.resolve(cwd || proyek, sempit(target || '.')));
  if (tujuan !== akar && !tujuan.startsWith(akar + '/')) return `ekstrak ${w} ke luar kantor (${tujuan})`;
  const sasaran = daftar ? jalurAbsolut([...daftar.tulis, ...daftar.baca], proyek) : [];
  const kena = (r) => sasaran.find((x) => r === x.abs || r.startsWith(x.abs + '/') || r.startsWith(x.abs));
  let isi = null;
  if (arsip && arsip !== '-') {
    const p = path.resolve(cwd || proyek, sempit(arsip));
    const r = w === 'unzip' ? spawnSync('unzip', ['-Z1', p], { encoding: 'utf8', maxBuffer: 1 << 26 }) : spawnSync('tar', ['-tf', p], { encoding: 'utf8', maxBuffer: 1 << 26 });
    if (r.status === 0) isi = r.stdout.split('\n').filter(Boolean);
  }
  if (!isi) { const dalam = tujuan === akar || kena(tujuan); return dalam ? `ekstrak ${w} ke akar kantor tapi isi arsip gak bisa dicek` : null; }
  for (const e of isi) {
    if (path.isAbsolute(e) || e.split('/').includes('..')) return `arsip ${w} berisi jalur absolut atau '..' (${e.slice(0, 40)})`;
    const k = kena(nyata(path.resolve(tujuan, e))); if (k) return `isi arsip ${w} nimpa jalur kunci (${k.j}: ${e.slice(0, 40)})`;
  }
  return null;
}

export function bahayaSegmen(seg, cwd, proyek, daftar) {
  const kata = pecahKata(seg); if (!kata.length) return null;
  const { w, arg, lewatXargs } = inti(kata);
  const t = arg.map((k) => k.teks);
  if (['sudo', 'su', 'doas'].includes(w)) return 'sudo';
  if (['dd', 'shutdown', 'reboot', 'halt', 'poweroff', 'pkill', 'killall'].includes(w)) return w;
  if (/^mkfs(\.|$)/.test(w)) return 'mkfs';
  if ((w === 'chmod' || w === 'chown') && t.some((x) => /^-[A-Za-z]*R/.test(x) || x === '--recursive')) return `${w} -R`;
  if (w === 'git') {
    const sub = t.find((x) => !x.startsWith('-'));
    if (sub === 'reset' && t.includes('--hard')) return 'git reset --hard';
    if (sub === 'push' && t.some((x) => x === '--force' || x === '-f' || x.startsWith('--force-with-lease') || /^\+/.test(x))) return 'git push --force';
  }
  if (w === 'eval' && t.length) return bahaya(t.join(' '), cwd, proyek, daftar);
  if (/^python[\d.]*$/.test(w)) { // python3 -m zipfile -e arsip folder / -m tarfile -e arsip folder = unzip / tar -x
    const m = t.indexOf('-m'); const e = t.findIndex((x) => x === '-e' || x === '--extract');
    if (m >= 0 && e >= 0 && ['zipfile', 'tarfile'].includes(t[m + 1])) {
      const a = arg.filter((k, i) => i === e + 1 || i === e + 2);
      const r = t[m + 1] === 'zipfile' ? bahayaEkstrak('unzip', [{ teks: '-d' }, a[1] || { teks: '.' }, a[0] || { teks: '-' }], cwd, proyek, daftar) : bahayaEkstrak('tar', [{ teks: '-xf' }, a[0] || { teks: '-' }, { teks: '-C' }, a[1] || { teks: '.' }], cwd, proyek, daftar);
      if (r) return r;
    }
  }
  if (['bash', 'sh', 'zsh', 'dash'].includes(w)) { const c = t.indexOf('-c'); if (c >= 0 && t[c + 1]) { const m = bahaya(t[c + 1], cwd, proyek, daftar); if (m) return m; } }
  if (w === 'git' && t.find((x) => !x.startsWith('-')) === 'clean') {
    const opsi = t.filter((x) => x.startsWith('-')); const jalur = t.slice(t.indexOf('clean') + 1).filter((x) => !x.startsWith('-'));
    const kering = opsi.some((x) => x === '--dry-run' || /^-[A-Za-z]*n/.test(x));
    if (!kering) {
      const x = opsi.some((x2) => /^-[A-Za-z]*[xX]/.test(x2));
      if (x) return 'git clean -x/-X (ikut hapus berkas yang di-ignore)';
      if (!jalur.length) return 'git clean tanpa jalur subfolder (hapus semua berkas untracked)';
      const akar = nyata(proyek);
      for (const j of jalur) { const r = nyata(path.resolve(cwd || proyek, sempit(j))); if (r === akar || !r.startsWith(akar + '/')) return `git clean ke ${j} (akar atau luar kantor)`; }
    }
  }
  if (w === 'tar' || w === 'bsdtar' || w === 'unzip') { const m = bahayaEkstrak(w, arg, cwd, proyek, daftar); if (m) return m; }
  if (w === 'rm') return bahayaRm(arg, cwd, proyek, lewatXargs);
  if (w === 'find') {
    const mulai = []; for (const x of arg) { if (/^[-!()]/.test(x.teks)) break; mulai.push(x); }
    if (t.includes('-delete')) { const m = bahayaRm([{ teks: '-r' }, ...(mulai.length ? mulai : [{ teks: '.' }])], cwd, proyek, false); if (m) return `find -delete: ${m}`; }
    const e = t.findIndex((x) => ['-exec', '-execdir', '-ok', '-okdir'].includes(x));
    if (e >= 0) { const sisa = t.slice(e + 1); const akhir = sisa.findIndex((x) => x === ';' || x === '+' || x === '\;'); const dalam = akhir >= 0 ? sisa.slice(0, akhir) : sisa;
      // find -exec rm ... {}: sasaran sebenarnya = jalur awal find, bukan "{}".
      if (dalam[0]?.split('/').pop() === 'rm') return bahayaRm([...dalam.slice(1).filter((x) => /^-/.test(x)).map((teks) => ({ teks })), ...(mulai.length ? mulai : [{ teks: '.' }])], cwd, proyek, false);
      return bahayaSegmen(dalam.join(' '), cwd, proyek, daftar); }
  }
  return null;
}
const DALAM_KODE = /\b(sudo|mkfs\S*|shutdown|reboot|pkill|killall)\b|\brm\s+(-\S*[rR]\S*)|\bdd\s+if=|\bchmod\s+(-\S*R|--recursive)|\bgit\s+reset\s+--hard|\bgit\s+push\b[^\n]*(--force|\s-f\b)|shutil\.rmtree|os\.system\s*\(\s*['"]rm|rimraf|fs\.rmSync\([^)]*recursive/;
export function bahaya(cmd, cwd, proyek, daftar) {
  // eval yang isinya substitusi ($(...), backtick) hampir gak pernah sah buat agen (eval "$(… | base64 -d)" nyembunyiin perintah).
  if (/\beval\b[^\n;|&]*(\$\(|`)/.test(String(cmd).replace(/'[^']*'/g, "''"))) return 'eval dengan substitusi (isi perintah disembunyiin)';
  let sekarang = cwd || proyek;
  for (const seg of potong(cmd)) {
    const k = pecahKata(seg);
    if (k[0]?.teks === 'cd') { sekarang = path.resolve(sekarang, sempit(k[1]?.teks ?? '~')); continue; }
    const m = bahayaSegmen(seg, sekarang, proyek, daftar); if (m) return m;
  }
  for (const t of kodeTeks(cmd)) { const m = DALAM_KODE.exec(t); if (m) return `perintah bahaya di dalam kode (${m[0].trim().slice(0, 30)})`; }
  return null;
}

// ---------- (b) nulis ke jalur kunci ----------
const TULIS = new Set(['cp', 'mv', 'tee', 'install', 'ln', 'rsync', 'touch', 'truncate', 'rm', 'chmod', 'chown', 'patch', 'tar', 'unzip', 'zip', 'dd', 'rename', 'shred', 'mkdir', 'rmdir', 'unlink']);
const SED_TULIS = /(^|\s)-[A-Za-z]*i\b|--in-place/;
const SKRIP_TULIS = /(^|[\s;{'"\d$,/])[wWe]\s*\S|\bwrite\b|print\w*\s*>|system\s*\(|>>?\s*["']/;
function bisaNulis(seg) {
  const kata = pecahKata(seg); if (!kata.length) return false;
  if (kata.some((k) => /^\d*>>?(?!&)/.test(k.teks) && !/^\d*>>?&/.test(k.teks))) return true;
  const { w } = inti(kata);
  if (TULIS.has(w)) return true;
  if (w === 'sed') return SED_TULIS.test(seg) || kata.slice(1).some((k) => k.teks.split(/[\s;{}]+/).some((c) => /^[\d,$]*[wWe]/.test(c)));
  if (['awk', 'gawk', 'perl', 'ruby', 'php', 'lua'].includes(w)) return SKRIP_TULIS.test(seg) || / -[A-Za-z]*i/.test(seg);
  if (w === 'find') return /-(exec|execdir|ok|okdir|delete|fprint0?|fprintf|fls)\b/.test(seg);
  if (w === 'git') return /\b(checkout|restore|apply|clean|stash|mv|rm)\b/.test(seg);
  return false;
}
// Mengembalikan jalur kunci yang ketulis, atau null. Kode bebas (python/node/heredoc/bash -c) dicocokin teks mentah.
export function tulisTerkunci(cmd, cwd, proyek, daftar) {
  { const kode = kodeTeks(cmd); const j = daftar.tulis.find((x) => kode.some((t) => t.includes(x.replace(/\/$/, '')))); if (j) return `${j} (disebut di dalam kode)`; }
  const sasaran = jalurAbsolut(daftar.tulis, proyek);
  const potongan = potong(cmd).filter((seg) => pecahKata(seg)[0]?.teks === 'cd' || bisaNulis(seg));
  if (!potongan.length) return null;
  return kenaJalur(potongan.join(' ; '), cwd, proyek, sasaran, true, false);
}

export const PESAN_KUNCI = (nama, jalur) => `Pagar kantor nahan perintah ini: ${nama} (${jalur}). Ini jalur yang dikunci (kunci/rahasia, alat dan skrip yang dijaga pagar), jadi gak ada tombol izin.
Perintah lain di kantor ini bebas. Untuk berkas yang dikunci, tulis di task dan minta Builder.`;
export const PESAN_BAHAYA = (nama) => `Pagar kantor nahan perintah ini: ${nama}. Perintah yang bahaya (sudo, hapus lebar, ke luar kantor, matiin proses, force push) ditahan, yang lain bebas.
Kalau memang perlu, tulis di task dan minta Builder atau owner jalanin.`;

if (process.argv[1] && import.meta.url === pathToFileURL(fs.realpathSync(process.argv[1])).href) {
  let masuk = '';
  try { masuk = fs.readFileSync(0, 'utf8'); } catch { process.exit(0); }
  let cmd = ''; let cwd = '';
  try { const d = JSON.parse(masuk); if (d?.tool_name && d.tool_name !== 'Bash') process.exit(0); cmd = d?.tool_input?.command || ''; cwd = d?.cwd || ''; } catch { process.exit(0); }
  const proyek = process.env.CLAUDE_PROJECT_DIR || cwd || process.cwd();
  const daftar = jalurTerkunci(proyek);
  const asli = cmd; cmd = diperluas(asli); // + isi $(...) dan backtick sebagai perintah sendiri
  const kodeBebas = !!cekPerintah(asli);
  // (a) rahasia: deny Read cuma berlaku buat alat Read, bukan Bash. Kode bebas dicocokin teks mentah.
  const kode = kodeBebas ? kodeTeks(cmd) : [];
  const sebut = (daftarJalur) => daftarJalur.find((j) => kode.some((t) => t.includes(j.replace(/\/$/, ''))));
  const rahasia = kenaJalur(cmd, cwd, proyek, jalurAbsolut(daftar.baca, proyek)) || sebut(daftar.baca);
  if (rahasia) {
    const petunjuk = /\(di dalam /.test(rahasia) ? '\nKamu nyari/nyalin dari folder yang di dalamnya ada berkas rahasia. Cari teks: pakai alat Grep, atau `grep -rn kata --exclude-dir=setelan --exclude-dir=.rahasia .`. Salin/arsip: sebut subfolder yang kamu butuhin aja.' : '';
    process.stderr.write(PESAN_KUNCI('akses ke berkas rahasia', rahasia) + petunjuk + '\n'); process.exit(2);
  }
  // (c) bahaya
  let b = null; try { b = bahaya(cmd, cwd, proyek, daftar); } catch { b = null; }
  if (b) { process.stderr.write(PESAN_BAHAYA(b) + '\n'); process.exit(2); }
  // (b) nulis ke jalur kunci
  const kunci = tulisTerkunci(cmd, cwd, proyek, daftar);
  if (kunci) { process.stderr.write(PESAN_KUNCI('nulis ke jalur yang dikunci', kunci) + '\n'); process.exit(2); }
  process.exit(0);
}
