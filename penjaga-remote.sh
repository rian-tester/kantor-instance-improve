#!/usr/bin/env bash
# Penjaga Remote Control kantor (KD-129). Dijalanin cron tiap 3 menit (dan sekali pas VPS nyala): bash ~/kantor/penjaga-remote.sh
# Kalau ruangan tmux 'kantor' atau Remote Control di dalamnya mati, dinyalain lagi:
# nyala biasa (claude remote-control --name kantor --spawn same-dir, sama kayak installer). Environment lama tetap kepake
# (sesi di aplikasi gak jadi "kantor2") selama pointer-nya gak basi; pointer basi dibersihin dulu. Gak pakai --continue:
# Claude nolak --continue bareng --spawn, dan tanpa --spawn jadi mode satu sesi yang keluar sendiri (kebukti VPS uji 19/10).
# Gak pernah nyari proses pakai pola nama: yang dicek cuma ruangan tmux 'kantor' dan PID panenya (dari tmux sendiri).
# Mau dimatiin sementara (mis. lagi benerin sendiri)? touch ~/kantor/catatan/.penjaga-remote-mati ; hapus berkasnya buat nyalain lagi.
set -u
export PATH="$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin:${PATH:-}"
KANTOR="${KANTOR:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"
SESI="${PENJAGA_SESI:-kantor}"
UMUR_MIN="${PENJAGA_UMUR_MIN:-300}"                # sesi lebih muda dari ini (detik) belum dinilai sakit
BATAS_SAKIT="${PENJAGA_BATAS_SAKIT:-3}"            # sakit berturut-turut sebelum dinyalain ulang (3 × 3 menit)
BATAS_ULANG="${PENJAGA_BATAS_ULANG:-4}"            # maks nyala ulang per jam; lewat ini berhenti dan cuma nyatet
cd "$KANTOR" || exit 0
mkdir -p catatan
LOG=catatan/penjaga-remote.log
SAKIT=catatan/.penjaga-remote-sakit
RIWAYAT=catatan/.penjaga-remote-riwayat
catat(){ echo "$(TZ=Asia/Jakarta date '+%F %T') $*"; }

[ -e catatan/.penjaga-remote-mati ] && exit 0
exec 9>catatan/.penjaga-remote.lock
flock -n 9 || exit 0
# Cron nyatet ke LOG lewat redirect; di sini cuma jaga ukurannya.
[ -f "$LOG" ] && [ "$(wc -l < "$LOG")" -gt 600 ] && { tail -n 300 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"; }

ada_sesi(){ tmux has-session -t "=$SESI" 2>/dev/null; }
layar(){ tmux capture-pane -p -t "=$SESI:" -S -100 2>/dev/null; }
hidup(){ [ -n "${1:-}" ] && [ "$1" -gt 0 ] 2>/dev/null && kill -0 "$1" 2>/dev/null; }

# Pointer Remote Control (nyimpen environment + PID penulisnya). Lokasi = folder proyek Claude buat folder kantor:
# path dengan semua karakter selain huruf/angka diganti '-'.
POINTER="$HOME/.claude/projects/$(printf '%s' "$KANTOR" | sed 's/[^a-zA-Z0-9]/-/g')/bridge-pointer.json"
perintah_pid(){ tr '\0' ' ' < "/proc/$1/cmdline" 2>/dev/null; }
turunan(){ local p; for p in $(ps -o pid= --ppid "$1" 2>/dev/null); do echo "$p"; turunan "$p"; done; }
# 0 = ada koneksi :443 ESTABLISHED dari PID $1 atau turunannya, 1 = gak ada, 2 = gak bisa dicek (ss gak ada).
nyambung(){
  local s p
  s=$("${PENJAGA_SS:-ss}" -tnpH state established '( dport = :443 )' 2>/dev/null) || return 2
  for p in "$1" $(turunan "$1"); do printf '%s\n' "$s" | grep -q "pid=$p," && return 0; done
  return 1
}

# Claude nolak pakai environment lama ("Pointer writer pid N still running; registering a fresh env") kalau PID di pointer
# kelihatan hidup. Abis VPS mati mendadak PID itu bisa kepake proses lain. Yang dibuang cuma pid & procStart-nya (environment
# dan sesi tetap kesimpen), dan cuma kalau PID itu hidup tapi BUKAN claude. Dipanggil cuma pas mau nyalain ulang.
bersihin_pointer(){
  [ -f "$POINTER" ] || return 0
  local pid; pid=$(jq -r '.pid // empty' "$POINTER" 2>/dev/null)
  hidup "$pid" || return 0
  case "$(perintah_pid "$pid")" in
    *claude*) return 0 ;;
  esac
  if jq 'del(.pid, .procStart)' "$POINTER" > "$POINTER.tmp" 2>/dev/null && mv "$POINTER.tmp" "$POINTER"; then
    catat "pointer basi dibersihin: PID $pid hidup tapi bukan claude ($(perintah_pid "$pid" | cut -c1-60))"
  else rm -f "$POINTER.tmp"; fi
}

# Remote Control yang jalan di luar tmux (owner nyalain manual): jangan ditabrak, nanti dobel environment.
jalan_di_luar(){
  [ -f "$POINTER" ] || return 1
  local pid; pid=$(jq -r '.pid // empty' "$POINTER" 2>/dev/null)
  hidup "$pid" || return 1
  case "$(perintah_pid "$pid")" in *remote-control*) return 0 ;; esac
  return 1
}

nyalain(){
  tmux new-session -d -s "$SESI" "cd '$KANTOR' && claude remote-control --name kantor --spawn same-dir" 9>&-   # tanpa 9>&- server tmux ikut megang kunci
}

# Batas nyala ulang per jam: jangan muter terus kalau akun logout / jatah habis.
boleh_ulang(){
  local sekarang n batas boot; sekarang=$(date +%s); batas=$((sekarang - 3600))
  # Yang dihitung cuma nyala ulang sejak VPS terakhir nyala: abis reboot kantor harus langsung dinyalain (kebukti VPS uji 19/10:
  # jatah sejam kepakai sebelum reboot, kantor gak nyala sama sekali abis reboot).
  boot=${PENJAGA_BTIME:-$(awk '/^btime/{print $2}' /proc/stat 2>/dev/null)}
  [ -n "$boot" ] && [ "$boot" -gt "$batas" ] 2>/dev/null && batas=$boot
  [ -f "$RIWAYAT" ] && awk -v t="$batas" '$1 > t' "$RIWAYAT" > "$RIWAYAT.tmp" && mv "$RIWAYAT.tmp" "$RIWAYAT"
  n=$( [ -f "$RIWAYAT" ] && wc -l < "$RIWAYAT" || echo 0 )
  if [ "$n" -ge "$BATAS_ULANG" ]; then catat "udah $n kali nyalain ulang dalam sejam, berhenti dulu (cek login Claude: claude auth status)"; return 1; fi
  echo "$sekarang" >> "$RIWAYAT"
}

mulai(){ # $1 = alasan
  if jalan_di_luar; then catat "Remote Control jalan di luar tmux (PID di pointer), gak ditabrak"; return 0; fi
  boleh_ulang || return 0
  catat "nyalain Remote Control: $1"
  rm -f "$SAKIT"
  bersihin_pointer
  ada_sesi && { tmux send-keys -t "=$SESI:" C-c 2>/dev/null; sleep 2; tmux kill-session -t "=$SESI" 2>/dev/null; sleep 1; }
  nyalain || catat "tmux gagal bikin ruangan '$SESI'"
}

if ! ada_sesi; then mulai "ruangan tmux '$SESI' gak ada"; exit 0; fi

# Ruangan ada. PID panenya (dari tmux sendiri) harus masih hidup.
IFS=' ' read -r mati pid dibuat < <(tmux list-panes -t "=$SESI:" -F '#{pane_dead} #{pane_pid} #{session_created}' 2>/dev/null | head -1)
if [ "${mati:-0}" = 1 ] || ! hidup "${pid:-}"; then mulai "proses di ruangan '$SESI' udah mati (PID ${pid:-?})"; exit 0; fi

L=$(layar)
# Pertanyaan yang nahan Remote Control (dijawab kayak installer): izin nyalain & mode spawn.
if printf '%s\n' "$L" | grep -q 'Choose \[1/2\]'; then tmux send-keys -t "=$SESI:" 1 Enter; catat "jawab pertanyaan mode spawn (1 = same-dir)"; exit 0; fi
if printf '%s\n' "$L" | grep -Eq 'Enable Remote Control\? \(y/n\)\s*$'; then tmux send-keys -t "=$SESI:" y Enter; catat "jawab y ke Enable Remote Control"; exit 0; fi

# Sehat = proses di ruangan (PID pane + turunannya) punya koneksi HTTPS yang hidup. Tulisan 'Connected' di layar gak bisa
# dipegang: abis beberapa kali "Reconnected after 2s" tulisannya ilang dari layar padahal masih nyambung (kebukti di VPS uji
# 19/10). Kalau ss gak ada, baru balik ke tulisan layar.
nyambung "$pid"; k=$?
if [ "$k" = 0 ]; then rm -f "$SAKIT"; exit 0; fi
if [ "$k" = 2 ] && printf '%s\n' "$L" | grep -Eq 'Connected|Reconnected after'; then rm -f "$SAKIT"; exit 0; fi
# Hidup tapi gak nyambung: kasih waktu dulu (baru nyala / lagi nyambung ulang), baru dianggap sakit.
umur=$(( $(date +%s) - ${dibuat:-0} ))
[ "$umur" -lt "$UMUR_MIN" ] && exit 0
n=$(( $(cat "$SAKIT" 2>/dev/null || echo 0) + 1 )); echo "$n" > "$SAKIT"
catat "Remote Control hidup tapi belum Connected (ke-$n)"
[ "$n" -ge "$BATAS_SAKIT" ] && mulai "gak Connected $n kali berturut-turut"
exit 0
