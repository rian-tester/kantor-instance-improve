#!/usr/bin/env bash
# Detak manajer (Lembur.id, video 9a/9b). Dijalanin cron: bash ~/kantor/detak.sh <nama-manajer> [divisi]
# Satu putaran: manajer baca dashboard task & kotak masuk, kerjain 1 langkah kecil, update task, notif kalau perlu.
# Tiap putaran nyatet token & persen jatah Claude di catatan/detak-<nama>.log, dan ngalah kalau jatah owner tipis.
# ref f277d9960f48baca
set -u
NAMA="${1:?pakai: bash detak.sh <nama-manajer> [divisi], mis. sari sosmed}"
DIVISI="${2:-}"                                # folder kotak-masuk-nya; kosong = cek semua kotak masuk
KANTOR="${KANTOR:-$HOME/kantor}"
BATAS_HARIAN="${BATAS_HARIAN:-30}"            # maks putaran per hari per manajer
JAM_BANGUN="${JAM_BANGUN:-6}"                  # jam mulai kerja
JAM_TIDUR="${JAM_TIDUR:-24}"                   # mulai jam ini detak tidur (24 = gak tidur malam). Boleh lebih kecil dari
                                               # JAM_BANGUN buat jadwal nyebrang tengah malam (Lembur malam: 22 → 6)
LAPORAN="${LAPORAN:-pagi:7 malam:19}"          # laporan <jenis>:<jam mulai>, dibikin di 3 jam pertama abis jam itu
BATAS_JATAH_5JAM="${BATAS_JATAH_5JAM:-60}"     # % jatah 5 jam: lewat ini detak ngalah, sisanya buat owner
BATAS_JATAH_MINGGU="${BATAS_JATAH_MINGGU:-70}" # % jatah mingguan: lewat ini detak ngalah
MODEL_DETAK="${MODEL_DETAK:-sonnet}"           # detak cukup Sonnet (lebih irit jatah); ngobrol langsung tetap model pilihan owner
PICU="${DETAK_PICU:-}"                         # diisi dashboard pas owner barusan jawab: gak ketahan jam tidur, nunggu
                                               # putaran yang lagi jalan, & alasan kalau ngalah dicatat buat dashboard
cd "$KANTOR" || exit 1
mkdir -p catatan
LOG="catatan/detak-$NAMA.log"
# Dipicu owner tapi gak bisa jalan: alasannya dicatat biar dashboard bisa bilang kenapa. Dari cron: diem aja kayak biasa.
ngalah(){ [ -n "$PICU" ] && echo "-- $(date '+%F %T') $NAMA: dipicu jawaban owner, ngalah: $1" >> "$LOG"; exit 0; }
# Plugin yang gagal sebelum login dicoba lagi, tanpa memanggil AI.
if [ -f catatan/.video-plugin-belum ] && [ -f "$HOME/kit-kantor-ai/cek/cek-video.sh" ]; then
  ( flock -n 8 || exit 0;
    [ ! -f catatan/.video-plugin-coba ] || [ $(( $(date +%s) - $(stat -c %Y catatan/.video-plugin-coba) )) -ge 3600 ] || exit 0
    touch catatan/.video-plugin-coba
    timeout 150 bash "$HOME/kit-kantor-ai/cek/cek-video.sh" --plugin ) 8>catatan/.video-plugin.lock >>catatan/video-plugin.log 2>&1 || true
fi
# KD-153: plugin desain web (frontend-design, ui-ux-pro-max) yang gagal pas pemasangan dicoba lagi paling sering sekali per jam, tanpa memanggil AI.
if [ -f catatan/.web-plugin-belum ] && [ -f "${KIT:-$HOME/kit-kantor-ai}/installer/plugin.mjs" ]; then
  ( flock -n 6 || exit 0
    [ ! -f catatan/.web-plugin-coba ] || [ $(( $(date +%s) - $(stat -c %Y catatan/.web-plugin-coba) )) -ge 3600 ] || exit 0
    touch catatan/.web-plugin-coba
    timeout 900 env KANTOR="$KANTOR" node "${KIT:-$HOME/kit-kantor-ai}/installer/plugin.mjs" --web ) 6>catatan/.web-plugin.lock >>catatan/web-plugin.log 2>&1 || true
fi
# Pemasangan video yang terputus dicoba lagi di latar, paling sering sekali per jam.
if [ -f "${KIT:-$HOME/kit-kantor-ai}/installer/video.mjs" ]; then
  ( flock -n 7 || exit 0
    node -e 'const fs = require("node:fs"); let siap = false; try { siap = JSON.parse(fs.readFileSync("catatan/video-status.json", "utf8")).siap === true; } catch {} process.exit(siap ? 1 : 0);' || exit 0
    [ ! -f catatan/.video-install-coba ] || [ $(( $(date +%s) - $(stat -c %Y catatan/.video-install-coba) )) -ge 3600 ] || exit 0
    touch catatan/.video-install-coba
    timeout 1800 env KANTOR="$KANTOR" node "${KIT:-$HOME/kit-kantor-ai}/installer/video.mjs"
  ) 7>catatan/.video-install.lock >>catatan/video-install.log 2>&1 &
fi
HARI=$(date +%F)
SEKARANG=$(date +%s)

# 1. Jam tidur (dipicu owner = owner lagi melek, jadi tetap jalan)
JAM=$(date +%-H)
if [ -n "$PICU" ]; then :
elif [ "$JAM_BANGUN" -le "$JAM_TIDUR" ]; then { [ "$JAM" -lt "$JAM_BANGUN" ] || [ "$JAM" -ge "$JAM_TIDUR" ]; } && exit 0
else [ "$JAM" -lt "$JAM_BANGUN" ] && [ "$JAM" -ge "$JAM_TIDUR" ] && exit 0; fi

# 1b. Data bisnis belum lengkap (task Builder "Lengkapi data bisnis" belum beres): tim gak dibangunin, biar gak nulis
#     pakai tebakan. Dicek pakai skrip, nol jatah.
if [ "$NAMA" != builder ]; then
  for f in task/T-*-data-bisnis.md; do
    [ -f "$f" ] || continue
    case "$(sed -n 's/^status: *//p' "$f" | head -1)" in beres|parkir) ;;
      *) ngalah "nunggu data bisnis lengkap dulu ($f)"
         echo "-- $(date '+%F %T') $NAMA: nunggu data bisnis lengkap ($f), gak dibangunin" >> "$LOG"; exit 0 ;; esac
  done
fi

# 2. Rem kuota: putaran sebelumnya kena batas pemakaian -> istirahat 1 jam
REM="catatan/.rem-$NAMA"
if [ -f "$REM" ] && [ $(( SEKARANG - $(stat -c %Y "$REM") )) -lt 3600 ]; then
  ngalah "jatah Claude kamu barusan abis, istirahat sampai $(date -d "@$(( $(stat -c %Y "$REM") + 3600 ))" +%H:%M)"; fi

# 3. Jaga jatah owner: angka dari putaran terakhir (manajer mana pun). Lewat batas -> ngalah sampai jatahnya reset.
if [ -f catatan/.jatah ]; then
  read -r J5 R5 J7 R7 < catatan/.jatah
  { [ "$SEKARANG" -lt "${R5:-0}" ] && [ "${J5:-0}" -ge "$BATAS_JATAH_5JAM" ]; } && ngalah "jatah Claude 5 jam udah ${J5}%, disisain buat kamu sampai $(date -d "@$R5" +%H:%M)"
  { [ "$SEKARANG" -lt "${R7:-0}" ] && [ "${J7:-0}" -ge "$BATAS_JATAH_MINGGU" ]; } && ngalah "jatah Claude mingguan udah ${J7}%, disisain buat kamu sampai $(date -d "@$R7" '+%a %H:%M')"
fi

# 4. Ada kerjaan gak? Dicek pakai skrip biasa (gratis). Gak ada apa-apa = Claude gak dibangunin, nol jatah.
ada_kerjaan(){
  grep -lsE "^pegang: *$NAMA\b" task/T-*.md | xargs -r grep -lE '^status: *jalan' | grep -q . && return 0
  grep -lsE "^pegang: *$NAMA\b" task/T-*.md | xargs -r grep -lE '^status: *nunggu-(kamu|lu)' | xargs -r grep -l 'Jawaban owner:' | grep -q . && return 0
  find kotak-masuk/${DIVISI:-*}/ -maxdepth 1 -type f -name '*.md' ! -name README.md 2>/dev/null | grep -q . && return 0
  [ -n "$LAPORAN_SEKARANG" ] && return 0
  return 1
}
# Laporan yang jatuh tempo putaran ini (kosong = belum waktunya / udah dibikin).
LAPORAN_SEKARANG=""
for w in $LAPORAN; do
  [ "$JAM" -ge "${w#*:}" ] && [ "$JAM" -lt $(( ${w#*:} + 3 )) ] && [ ! -f "hasil/laporan-$HARI-${w%%:*}.md" ] && { LAPORAN_SEKARANG="${w%%:*}"; break; }
done
if ! ada_kerjaan; then echo "-- $(date '+%F %T') $NAMA: gak ada kerjaan, Claude gak dibangunin" >> "$LOG"; exit 0; fi

# 5. Batas harian
HITUNG="catatan/.detak-$NAMA-$HARI"
N=$(cat "$HITUNG" 2>/dev/null || echo 0)
[ "$N" -ge "$BATAS_HARIAN" ] && ngalah "udah $N putaran hari ini (batas $BATAS_HARIAN)"

# 6. Anti-numpuk: putaran lama belum kelar -> lewatin
exec 9>"$KANTOR/.detak-$NAMA.lock"
if [ -n "$PICU" ]; then flock -w 1500 9 || ngalah "putaran sebelumnya belum kelar"
else flock -n 9 || exit 0; fi
# Tanda lagi jalan (PID + jam mulai): dashboard nampilin "lagi nyatet jawaban kamu" & nahan jawaban ganti di tengah jalan.
echo "$$ $(date +%s)" > "catatan/.detak-$NAMA.jalan"
trap 'rm -f "catatan/.detak-$NAMA.jalan"' EXIT

echo $((N + 1)) > "$HITUNG"
echo "== $(date '+%F %T') putaran $((N + 1)) ($NAMA)" >> "$LOG"
# Konteks disiapin skrip (gratis), biar Claude gak ngabisin giliran buat baca file satu-satu. Tiap giliran = baca ulang
# semua konteks, jadi makin dikit giliran makin irit jatah.
potong(){ head -c "${2:-4000}" "$1" 2>/dev/null; }
konteks(){
  echo "## Peran kamu (peran/PERAN-$NAMA.md)"; potong "peran/PERAN-$NAMA.md"; echo
  echo "## Catatan kamu, 15 baris terakhir (catatan/$NAMA.md)"; tail -n 15 "catatan/$NAMA.md" 2>/dev/null || echo "(kosong)"; echo
  for f in $(grep -lsE "^pegang: *$NAMA\b" task/T-*.md); do
    st=$(sed -n 's/^status: *//p' "$f" | head -1)
    if { [ "$st" = nunggu-kamu ] || [ "$st" = nunggu-lu ]; } && grep -q 'Jawaban owner:' "$f"; then
      echo "## Task $f (status: $st, OWNER UDAH JAWAB: catat jawabannya & lanjutin task ini duluan)"; potong "$f" 6000; echo
      for sop in $(grep -o 'sop/[a-z0-9-]*\.md' "$f" | sort -u); do echo "## $sop"; potong "$sop" 5000; echo; done
    elif [ "$st" = jalan ]; then
      echo "## Task $f (status: $st)"; potong "$f" 6000; echo
      for sop in $(grep -o 'sop/[a-z0-9-]*\.md' "$f" | sort -u); do echo "## $sop"; potong "$sop" 5000; echo; done
    else echo "## Task $f (status: $st, gak usah disentuh)"; fi
  done
  for f in $(find kotak-masuk/${DIVISI:-*}/ -maxdepth 1 -type f -name '*.md' ! -name README.md 2>/dev/null); do echo "## Titipan $f"; potong "$f" 3000; echo; done
  for b in brand/brief.md brand/fakta.md; do echo "## $b"; potong "$b" 3000; echo; done
  [ -f .drive/folder.json ] && echo "## Google Drive kantor nyambung (folder di .drive/folder.json). Pakai cuma kalau task/SOP butuh; aturannya di .claude/skills/google-drive/SKILL.md."
}
PROMPT="jadi $NAMA. $(cat DETAK-PROMPT.md)

Konteks putaran ini udah disiapin di bawah (isi file terbaru). Gak usah baca ulang file-file ini; langsung kerja.
Waktu sekarang: $(date '+%A %F %H:%M') WIB.
$([ -n "$LAPORAN_SEKARANG" ] && echo "Laporan: waktunya bikin laporan $LAPORAN_SEKARANG (\`hasil/laporan-$HARI-$LAPORAN_SEKARANG.md\`). Buat bagian Pemakaian: putaran detak $NAMA hari ini $((N + 1)) dari batas $BATAS_HARIAN; rem kuota $( { [ -f "$REM" ] && [ $(( SEKARANG - $(stat -c %Y "$REM") )) -lt 86400 ]; } && echo 'kepicu dalam 24 jam terakhir' || echo 'gak kepicu'); jatah Claude terakhir 5 jam ${J5:-?}%, mingguan ${J7:-?}%." || echo "Laporan: belum waktunya, lewatin langkah 7.")

$(konteks)"
MENTAH="catatan/.detak-$NAMA-terakhir.jsonl"
SETELAN=(); [ -f .claude/settings.json ] && SETELAN=(--settings .claude/settings.json)
# Google Drive udah disambungin owner: konektor akun Claude ikut kebaca (satpam di .claude/settings.json yang ngunci
# foldernya), plus ToolSearch buat buka alat Drive-nya. Belum nyambung: konektor gak dimuat sama sekali (lebih irit).
MCP=(--strict-mcp-config); ALAT=Read,Write,Edit,Bash,Glob,Grep
# Sosmed butuh manggil agen terpisah (Penulis, Pemeriksa/Satpam, Desainer, Kritikus). Manajer lain tetap tanpa Agent.
[ "$NAMA" = sari ] && ALAT="$ALAT,Agent"
[ -f .drive/folder.json ] && { MCP=(); ALAT="$ALAT,ToolSearch"; }
timeout 20m claude -p "$PROMPT" --model "$MODEL_DETAK" --max-turns 15 "${SETELAN[@]}" \
  --tools "$ALAT" "${MCP[@]}" --disable-slash-commands \
  --output-format stream-json --verbose < /dev/null > "$MENTAH" 2>> "$LOG"
KODE=$?
[ "$KODE" -eq 124 ] && echo "!! putaran kepotong 20 menit" >> "$LOG"

if command -v jq >/dev/null; then
  HASIL=$(jq -c 'select(.type=="result")' "$MENTAH" 2>/dev/null | tail -n 1)
  BATAS=$(jq -c 'select(.type=="rate_limit_event") | .rate_limit_info' "$MENTAH" 2>/dev/null | tail -n 1)
  [ -n "$HASIL" ] && jq -r '.result // ""' <<<"$HASIL" >> "$LOG"
  if [ -n "$BATAS" ]; then
    read -r J5 R5 J7 R7 ST < <(jq -r '[((.unifiedWindows.five_hour.utilization // 0) * 100 | floor),
      (.unifiedWindows.five_hour.resetsAt // 0), ((.unifiedWindows.seven_day.utilization // 0) * 100 | floor),
      (.unifiedWindows.seven_day.resetsAt // 0), (.status // "-")] | @tsv' <<<"$BATAS")
    echo "$J5 $R5 $J7 $R7" > catatan/.jatah
    [ "$ST" = "rejected" ] && touch "$REM"
  fi
  # Ringkasan 1 baris: dipakai Builder & laporan buat ngitung pemakaian.
  jq -rn --argjson h "${HASIL:-null}" --arg j5 "${J5:--}" --arg j7 "${J7:--}" '
    def k: if . == null then "-" elif . >= 1000 then "\((. / 100 | floor) / 10)k" else tostring end;
    "   ↳ \($h.num_turns // "-") giliran · \((($h.duration_ms // 0) / 1000) | floor) dtk · token baru \($h.usage.input_tokens | k)"
    + " + cache \(((($h.usage.cache_read_input_tokens // 0) + ($h.usage.cache_creation_input_tokens // 0))) | k)"
    + " · keluar \($h.usage.output_tokens | k) · jatah 5 jam \($j5)% · mingguan \($j7)%"' >> "$LOG"
  jq -r '.result // ""' <<<"${HASIL:-{\}}" | grep -qiE 'usage limit|rate limit|limit reached' && touch "$REM"
else
  cat "$MENTAH" >> "$LOG"
  tail -n 30 "$LOG" | grep -qiE 'usage limit|rate limit|limit reached' && touch "$REM"
fi
exit 0
