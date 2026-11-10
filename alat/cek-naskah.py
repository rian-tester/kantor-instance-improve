#!/usr/bin/env python3
"""Bandingkan seluruh teks slide HTML/QC dengan JSON final yang lolos Satpam."""
import hashlib
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path


def normal(teks):
    return re.sub(r"\s+", " ", teks).strip()


class SlideParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.slide = []
        self.aktif = None
        self.kedalaman = 0
        self.lewat = 0

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if tag == "section":
            if self.aktif is not None:
                self.kedalaman += 1
            elif "slide" in data.get("class", "").split():
                self.aktif = []
                self.kedalaman = 1
        if self.aktif is not None:
            if tag in {"script", "style", "title", "desc"}:
                self.lewat += 1
            elif tag == "br":
                self.aktif.append(" ")

    def handle_endtag(self, tag):
        if self.aktif is None:
            return
        if tag in {"script", "style", "title", "desc"}:
            self.lewat = max(0, self.lewat - 1)
        elif tag == "section":
            self.kedalaman -= 1
            if self.kedalaman == 0:
                self.slide.append(normal("".join(self.aktif)))
                self.aktif = None
                return
        if not self.lewat and tag in {"p", "div", "h1", "h2", "h3", "h4", "li", "figure", "figcaption", "text", "td", "tr"}:
            self.aktif.append(" ")

    def handle_data(self, data):
        if self.aktif is not None and not self.lewat:
            self.aktif.append(data)


def main():
    if len(sys.argv) not in {3, 4}:
        print("Pakai: python3 alat/cek-naskah.py <final.json> <index.html> [qc.json]", file=sys.stderr)
        return 2
    try:
        nfile, htmlfile = map(Path, sys.argv[1:3])
        n = json.loads(nfile.read_text())
        if not isinstance(n.get("brand"), str) or not n["brand"].strip() or not isinstance(n.get("caption"), str):
            raise ValueError("brand/caption belum valid")
        if not isinstance(n.get("slide"), list) or not n["slide"]:
            raise ValueError("slide final belum ada")
        expected = []
        for s in n["slide"]:
            if not isinstance(s.get("teks"), list) or not s["teks"] or any(not isinstance(t, str) or not t.strip() for t in s["teks"]):
                raise ValueError("teks slide harus daftar string yang tidak kosong")
            label = s.get("sumber", "")
            if not isinstance(label, str) or (label and s["teks"].count(label) != 1):
                raise ValueError("label sumber harus tepat satu elemen teks final")
            expected.append(normal(" ".join(s["teks"])))
        parser = SlideParser()
        parser.feed(htmlfile.read_text())
        if parser.aktif is not None:
            raise ValueError("section.slide belum ditutup")
        if len(parser.slide) != len(expected):
            raise ValueError("jumlah slide HTML berbeda dari naskah final")
        for i, (a, b) in enumerate(zip(expected, parser.slide), 1):
            if a != b:
                raise ValueError(f"teks HTML slide {i} berbeda. Final: {a!r}. HTML: {b!r}")
        result = {"lolos": True, "jumlah_slide": len(expected),
                  "naskah_sha256": hashlib.sha256(nfile.read_bytes()).hexdigest(),
                  "html_sha256": hashlib.sha256(htmlfile.read_bytes()).hexdigest()}
        if len(sys.argv) == 4:
            qfile = Path(sys.argv[3])
            q = json.loads(qfile.read_text())
            if len(q["slide"]) != len(expected):
                raise ValueError("jumlah slide QC berbeda")
            for i, (s, a, row) in enumerate(zip(n["slide"], expected, q["slide"]), 1):
                if normal(row["teks_render"]) != a:
                    raise ValueError(f"teks render slide {i} berbeda dari final")
                labels = row["sumber"]
                label = s.get("sumber", "")
                if len(labels) != (1 if label else 0):
                    raise ValueError(f"jumlah label sumber slide {i} berbeda")
                if label and (normal(labels[0]["teks"]) != normal(label) or labels[0]["baris"] != 1):
                    raise ValueError(f"sumber slide {i} harus cocok dan satu baris")
            result["qc_sha256"] = hashlib.sha256(qfile.read_bytes()).hexdigest()
        print(json.dumps(result, ensure_ascii=False))
        return 0
    except (OSError, ValueError, KeyError, TypeError) as e:
        print("Belum lolos: " + str(e), file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
