#!/usr/bin/env python3
"""Tandai pola bahasa yang perlu diperiksa. Nol temuan tetap perlu tes baca keras.
Pakai: python3 alat/cek-bahasa.py [--json] [--naskah] <berkas>
--naskah membaca teks publik dan caption dari JSON final, bukan catatan sumber.
Exit 1 bila ada temuan, 2 bila input tidak valid.
"""
import json
import re
import sys

# kata → saran (aturan 2: kiasan/gaul yang pembeli revisi)
KIASAN = {
    r"bocor(nya)?": "tulis maksudnya (mis. 'bagian awalnya kurang kuat', 'penonton pergi di sini')",
    r"nendang": "'paling menarik' / 'paling kuat'",
    r"ngadu(in)?": "'bandingin'",
    r"kepake": "'berguna' / 'lebih membantu'",
    r"nyerbu": "'rame-rame daftar' / sebut angkanya",
    r"kelelep": "'gak kedengeran' / 'ketutup'",
    r"ancang-ancang(nya)?": "'bagian pembuka yang muter-muter'",
    r"incer": "'targetin' / 'coba bikin'",
    r"auto \w+": "tulis akibatnya langsung (mis. 'jadi nggak dibayar')",
    r"zonk": "'gak ada hasilnya' / sebut masalahnya",
    r"cupu": "sebut kekurangannya",
    r"pantesan": "buang, langsung ke akibatnya",
    r"receh": "sebut angkanya",
    r"sunyi": "'sepi'",
    r"kurva(nya)? jatuh": "'penonton mulai berhenti nonton'",
}
# aturan 3: ekspresi tempelan (cuma boleh kalau emang ada yang kaget/lucu)
EKSPRESI = [r"na+hh+", r"gila sih", r"anji+r+", r"wkwk\w*", r"btw", r"gas(kan)?\b", r"mantul", r"cuy"]
# aturan 7: kerasa terjemahan (slop-indo.md)
TERJEMAHAN = [r"hal ini", r"\bdimana\b", r"yang mana", r"tidak hanya\b.*\btetapi juga", r"memainkan peran", r"menariknya",
              r"faktanya", r"perlu diingat", r"di era digital", r"tidak bisa dipungkiri", r"game ?changer", r"pada akhirnya",
              r"dengan demikian", r"oleh karena itu", r"membuat perbedaan",
              r"\b(menulis|mengatakan|menyebut(kan)?|menjelaskan|menyatakan) bahwa", r"\bterdeteksi\b", r"\bmenaruh\b", r";"]
# aturan 3: ejaan campur dalam satu teks
CAMPUR = [((r"\bgak\b", r"\bga\b"), (r"\bnggak\b", r"\benggak\b"), "gak/nggak"),
          ((r"\bsampe\b",), (r"\bsampai\b",), "sampe/sampai"),
          ((r"\btau\b",), (r"\btahu\b",), "tau/tahu")]


def kalimat(teks):
    return [k.strip() for k in re.split(r"(?<=[.!?])\s+|\n+", teks) if k.strip()]


def cek(teks):
    temuan = []
    kl = kalimat(teks)
    for k in kl:
        kecil = k.lower()
        n_gaul = 0
        for pola, saran in KIASAN.items():
            for m in re.finditer(rf"\b{pola}\b", kecil):
                n_gaul += 1
                temuan.append({"aturan": 2, "kata": m.group(0), "kalimat": k, "saran": saran})
        for pola in EKSPRESI:
            for m in re.finditer(rf"\b{pola}", kecil):
                n_gaul += 1
                temuan.append({"aturan": 3, "kata": m.group(0), "kalimat": k,
                               "saran": "ekspresi tempelan: buang kecuali emang ada yang kaget/lucu"})
        if n_gaul > 1:
            temuan.append({"aturan": 3, "kata": f"{n_gaul} gaul/kiasan", "kalimat": k, "saran": "maks 1 per kalimat"})
        for pola in TERJEMAHAN:
            for m in re.finditer(pola, kecil):
                temuan.append({"aturan": 7, "kata": m.group(0), "kalimat": k, "saran": "kerasa terjemahan, ceritain ulang kayak ngobrol"})
    kecil = teks.lower()
    ejaan = [kata for kata in ("ga", "gak", "nggak", "enggak") if re.search(rf"\b{kata}\b", kecil)]
    if len(ejaan) > 1:
        temuan.append({"aturan": 3, "kata": "/".join(ejaan), "kalimat": "(seluruh teks)", "saran": "pilih satu ejaan"})
    for a, b, nama in CAMPUR[1:]:
        if any(re.search(p, kecil) for p in a) and any(re.search(p, kecil) for p in b):
            temuan.append({"aturan": 3, "kata": nama, "kalimat": "(seluruh teks)", "saran": "pilih satu ejaan"})
    buntung = [k for k in kl if len(re.findall(r"\w+", k)) <= 3 and not k.endswith("?") and not k.startswith(("#", "|", "-", "Slide", "Caption"))]
    if len(buntung) >= 3:
        temuan.append({"aturan": 1, "kata": f"{len(buntung)} kalimat ≤3 kata", "kalimat": " / ".join(buntung[:5]),
                       "saran": "kalimat dipadetin kayak telegram, lengkapin (siapa ngapain)"})
    return temuan


def main():
    arg = [a for a in sys.argv[1:] if a not in {"--json", "--naskah"}]
    try:
        teks = open(arg[0], encoding="utf-8").read() if arg else sys.stdin.read()
        if "--naskah" in sys.argv:
            n = json.loads(teks)
            if not isinstance(n.get("brand"), str) or not n["brand"].strip() or not isinstance(n.get("caption"), str) or not isinstance(n.get("slide"), list) or not n["slide"]:
                raise ValueError("brand, caption dan slide final wajib valid")
            bagian = []
            for i, slide in enumerate(n["slide"], 1):
                if not isinstance(slide, dict) or not isinstance(slide.get("teks"), list) or not slide["teks"] or not isinstance(slide.get("sumber", ""), str):
                    raise ValueError("teks dan sumber slide belum valid")
                for t in slide["teks"]:
                    if not isinstance(t, str):
                        raise ValueError("teks slide harus string")
                    if t.casefold() not in {n["brand"].casefold(), slide.get("sumber", "").casefold()} and t != f"{i}/{len(n['slide'])}":
                        bagian.append(t)
            bagian.append(n["caption"])
            teks = "\n".join(bagian)
        temuan = cek(teks)
    except (OSError, ValueError, KeyError, TypeError) as e:
        print("Input belum valid: " + str(e), file=sys.stderr)
        return 2
    if "--json" in sys.argv:
        print(json.dumps(temuan, ensure_ascii=False, indent=1))
    else:
        for t in temuan:
            print(f"[aturan {t['aturan']}] «{t['kata']}» di: {t['kalimat'][:140]}\n    → {t['saran']}")
        print(f"{len(temuan)} temuan. Nol temuan tetap perlu tes baca keras.")
    return 1 if temuan else 0


if __name__ == "__main__":
    sys.exit(main())
