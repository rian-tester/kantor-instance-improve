#!/usr/bin/env bash
# Kirim notif ke HP lewat ntfy (Lembur.id, video 9a). Pakai: bash notif.sh "judul" "isi singkat"
# Nama topik ntfy disimpen di .rahasia/ntfy-topik (jangan dicetak). Isi notif jangan pernah berisi rahasia/data pelanggan.
# Jam senyap: kalau NOTIF_SENYAP="22-7" (diisi di baris cron detak Lembur malam), notif di jam itu gak langsung bunyi tapi
# disimpen di catatan/notif-tertahan.tsv, terus dikirim jadi satu lewat `bash notif.sh --kirim-tertahan` (cron 07.00).
# ref f277d9960f48baca
set -u
cd "${KANTOR:-$HOME/kantor}" || exit 1
TAHAN=catatan/notif-tertahan.tsv
kirim(){
  local TOPIK; TOPIK=$(cat .rahasia/ntfy-topik 2>/dev/null) || { echo "belum ada .rahasia/ntfy-topik"; return 1; }
  curl -fsS -H "Title: $1" -d "$2" "https://ntfy.sh/$TOPIK" > /dev/null && echo "notif terkirim"
}

if [ "${1:-}" = "--kirim-tertahan" ]; then
  [ -s "$TAHAN" ] || exit 0
  N=$(wc -l < "$TAHAN")
  ISI=$(head -n 6 "$TAHAN" | awk -F'\t' '{ print $1 "  " $2 (length($3) ? ": " $3 : "") }')
  [ "$N" -gt 6 ] && ISI="$ISI
...dan $((N - 6)) lagi. Liat di dashboard."
  kirim "Semalam: $N kabar dari tim" "$ISI" && : > "$TAHAN"
  exit
fi

if [[ "${NOTIF_SENYAP:-}" =~ ^([0-9]{1,2})-([0-9]{1,2})$ ]]; then
  A=$((10#${BASH_REMATCH[1]})); B=$((10#${BASH_REMATCH[2]})); J=$(date +%-H)
  if { [ "$A" -le "$B" ] && [ "$J" -ge "$A" ] && [ "$J" -lt "$B" ]; } || { [ "$A" -gt "$B" ] && { [ "$J" -ge "$A" ] || [ "$J" -lt "$B" ]; }; }; then
    mkdir -p catatan
    printf '%s\t%s\t%s\n' "$(date +%H:%M)" "$(printf '%s' "${1:-Kantor}" | tr '\t\n' '  ')" "$(printf '%s' "${2:-}" | tr '\t\n' '  ')" >> "$TAHAN"
    echo "notif ditahan (jam senyap), dikirim jadi satu jam $B.00"
    exit 0
  fi
fi
kirim "${1:-Kantor}" "${2:-}"
