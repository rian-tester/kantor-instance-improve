// HUD explainer 475 ribu tahun (koordinat layar): label caps + kata kunci besar, sumber, catatan hitungan/ilustrasi.
import React from 'react';
import { AngkaJalan, EASE, KataMuncul, maju, pegas, Pop, proyeksi, SapuSorot, useDetik, type Kamera, type KataLayar } from "../../../src/gerak";
import { MONO, SAIRA } from "../../../src/gerak/font";
import { useVideoConfig } from 'remotion';
import { K } from "../raja/gaya";
import { isiGpu, isiParam, jumlahBahasa, jumlahKode, jumlahLapis, ORANG_I, progresHari, progresHujan, progresTahun1, progresTahunLog, tahunLog, tumbuhBatang } from "./Stasiun";
import type { WaktuL } from "./waktuLlama";

const LABEL: React.CSSProperties = { fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: K.abu };
const JUDUL: React.CSSProperties = { fontFamily: SAIRA, fontWeight: 800, fontSize: 104, lineHeight: 1.0, color: K.tinta, columnGap: '0.24em' };
const CATATAN: React.CSSProperties = { fontFamily: MONO, fontWeight: 500, fontSize: 26, color: K.abu };

const Blok: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => {
  const t = useDetik();
  if (t < a - 0.15 || t > b + 0.4) return null;
  return <>{children}</>;
};
const Label: React.FC<{ kata: (KataLayar | string)[]; mulai: number; keluar: number }> = ({ kata, mulai, keluar }) => {
  const t = useDetik();
  const o = maju(t, mulai - 0.05, mulai + 0.12) * (1 - maju(t, keluar, keluar + 0.2, EASE.keluar));
  return (
    <div style={{ position: 'absolute', left: 90, top: 196, display: 'flex', alignItems: 'center', gap: 18, width: 960 }}>
      <div style={{ width: 8, height: 40, borderRadius: 4, background: K.teal, opacity: o }} />
      <KataMuncul mulai={mulai} keluar={keluar} jeda={0.06} gaya={LABEL} kata={kata} />
    </div>
  );
};
const Judul: React.FC<{ kata: (KataLayar | string)[]; mulai: number; keluar: number; gaya?: React.CSSProperties }> = ({ kata, mulai, keluar, gaya }) => (
  <div style={{ position: 'absolute', left: 90, top: 250, width: 920 }}>
    <KataMuncul mulai={mulai} keluar={keluar} jeda={0.05} lama={0.2} gaya={{ ...JUDUL, ...gaya }} kata={kata} />
  </div>
);
const Catatan: React.FC<{ teks: string; mulai: number; keluar: number; top?: number; lebar?: number }> = ({ teks, mulai, keluar, top = 472, lebar = 920 }) => {
  const t = useDetik();
  const o = maju(t, mulai, mulai + 0.25) * (1 - maju(t, keluar, keluar + 0.2));
  if (o <= 0) return null;
  return <div style={{ position: 'absolute', left: 90, top, width: lebar, ...CATATAN, opacity: o }}>{teks}</div>;
};
const sorot = (teks: string, mulai: number, warna = K.kuning) => (
  <SapuSorot mulai={mulai} lama={0.24} warna={warna} warnaTeks={[K.tinta, K.latar]} penuh>
    {teks}
  </SapuSorot>
);

/** angka besar gaya Indonesia pakai satuan (ribu/juta/miliar/triliun) */
export function angkaSatuan(v: number) {
  const f = (x: number) => (x < 10 ? x.toFixed(1).replace('.', ',').replace(',0', '') : Math.round(x).toString());
  if (v < 1000) return Math.max(1, Math.round(v)).toString();
  if (v < 1e6) return `${f(v / 1e3)} ribu`;
  if (v < 1e9) return `${f(v / 1e6)} juta`;
  if (v < 1e12) return `${f(v / 1e9)} miliar`;
  return `${f(v / 1e12)} triliun`;
}

const TOPIK = ['masak', 'sejarah', 'kode', 'kesehatan', 'musik', 'olahraga', 'bisnis', 'sains'];

export const HudL: React.FC<{ T: WaktuL; kam: Kamera }> = ({ T, kam }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const sumberO = maju(t, S[1].mulai, S[1].mulai + 0.4) * (1 - maju(t, T.pulang - 0.1, T.pulang + 0.3));
  const hujan = progresHujan(t, T);
  const nToken = Math.pow(15e12, hujan);
  const lapis = jumlahLapis(t, T);
  const kode = jumlahKode(t, T);
  const bahasa = Math.min(30, jumlahBahasa(t, T));
  const orang = proyeksi(kam, ORANG_I.x, ORANG_I.y - 90);
  return (
    <>
      {sumberO > 0 ? <div style={{ position: 'absolute', left: 90, top: 1478, ...CATATAN, fontSize: 24, opacity: sumberO }}>Sumber: Meta AI · 18 Apr 2024</div> : null}
      {/* 1 */}
      <Blok a={0} b={S[1].mulai}>
        {t < T.dilatih ? <Label kata={[{ t: 'LLAMA 3', mulai: 0.12 }, { t: '· MODEL AI', mulai: 1.4 }, { t: 'DARI', mulai: T.meta - 0.15 }, { t: 'META', mulai: T.meta }]} mulai={0.12} keluar={T.dilatih - 0.2} /> : null}
        <Label kata={[{ t: 'DILATIH', mulai: T.dilatih }, { t: 'PAKAI', mulai: T.dilatih + 0.4 }, { t: 'LEBIH', mulai: T.n15 - 0.6 }, { t: 'DARI', mulai: T.n15 - 0.4 }]} mulai={T.dilatih} keluar={S[1].mulai - 0.2} />
        <Judul
          kata={[
            { t: 'jumlah', mulai: 0.14, isi: <span style={{ color: K.kuning, fontVariantNumeric: 'tabular-nums' }}>{angkaSatuan(nToken)}</span> },
            { t: 'token', mulai: T.token1 - 0.1 },
          ]}
          mulai={0.14}
          keluar={S[1].mulai - 0.2}
        />
      </Blok>
      {/* 2 */}
      <Blok a={S[1].mulai} b={S[2].mulai}>
        <Label kata={['TOKEN']} mulai={S[1].mulai} keluar={S[2].mulai - 0.25} />
        <Judul kata={[{ t: '=', mulai: T.potongan - 0.15, warna: K.abu }, { t: 'potongan', mulai: T.potongan }, { t: 'teks', mulai: T.teks2, isi: sorot('teks', T.teks2 + 0.15, K.teal) }]} mulai={T.potongan - 0.15} keluar={S[2].mulai - 0.2} />
      </Blok>
      {/* 3 */}
      <Blok a={S[2].mulai} b={S[3].mulai}>
        <Label kata={['COBA', 'BAYANGIN', { t: '· TANPA', mulai: T.tidur - 0.3 }, { t: 'TIDUR', mulai: T.tidur }]} mulai={S[2].mulai} keluar={S[3].mulai - 0.25} />
        <Judul kata={[{ t: '1', mulai: T.satu3, warna: K.kuning }, { t: 'token', mulai: T.satu3 + 0.25 }, { t: '/', mulai: T.detik3 - 0.15, warna: K.abu }, { t: 'detik', mulai: T.detik3, isi: sorot('detik', T.detik3 + 0.15) }]} mulai={T.satu3} keluar={S[3].mulai - 0.2} />
        <Catatan teks="ilustrasi: 1 token per detik" mulai={T.detik3} keluar={S[5].mulai + 2} />
      </Blok>
      {/* 4 */}
      <Blok a={S[3].mulai} b={S[4].mulai}>
        {t < T.setahun - 0.1 ? (
          <>
            <Label kata={['SEHARI']} mulai={S[3].mulai} keluar={T.setahun - 0.3} />
            <Judul
              kata={[
                { t: '86.400', mulai: T.n86400 - 0.2, isi: <AngkaJalan dari={0} ke={86400} progress={progresHari(t, T)} gaya={{ color: K.kuning }} />, gaya: { minWidth: '2.6em', textAlign: 'right' } },
                { t: '/', mulai: T.token4 - 0.2, warna: K.abu },
                { t: 'hari', mulai: T.token4 },
              ]}
              mulai={T.n86400 - 0.2}
              keluar={T.setahun - 0.25}
            />
          </>
        ) : null}
        <Label kata={['SETAHUN', 'SEKITAR']} mulai={T.setahun} keluar={S[4].mulai - 0.25} />
        <Judul
          kata={[
            { t: '31,5', mulai: T.setahun + 0.1, isi: <AngkaJalan dari={0} ke={31.5} desimal={1} progress={progresTahun1(t, T)} gaya={{ color: K.kuning }} />, gaya: { minWidth: '1.6em', textAlign: 'right' } },
            { t: 'juta', mulai: T.setahun + 0.1 },
            { t: '/', mulai: T.juta4 - 0.1, warna: K.abu },
            { t: 'tahun', mulai: T.juta4 },
          ]}
          mulai={T.setahun + 0.1}
          keluar={S[4].mulai - 0.2}
        />
      </Blok>
      {/* 5 */}
      <Blok a={S[4].mulai} b={S[5].mulai}>
        <Label kata={[{ t: '15 TRILIUN', mulai: T.n15b }, { t: 'TOKEN', mulai: T.n15b + 0.4 }, { t: 'BUTUH', mulai: T.butuh }]} mulai={T.n15b} keluar={S[5].mulai - 0.25} />
        <Judul
          kata={[
            { t: '±', mulai: T.n475 - 0.4, warna: K.abu },
            { t: '475.000', mulai: T.n475 - 0.4, isi: <AngkaJalan dari={0} ke={475000} progress={tahunLog(progresTahunLog(t, T)) / 475000} gaya={{ color: K.kuning }} />, gaya: { minWidth: '3.1em', textAlign: 'right' } },
            { t: 'tahun', mulai: T.tahun5 },
          ]}
          mulai={T.n475 - 0.4}
          keluar={S[5].mulai - 0.2}
        />
        <Catatan teks="hitungan: 15 triliun token ÷ 31,5 juta token per tahun" mulai={T.butuh} keluar={S[5].mulai - 0.25} />
      </Blok>
      {/* 6 */}
      <Blok a={S[5].mulai} b={S[6].mulai}>
        <Label kata={['KALAU', 'MULAI', { t: '475', mulai: T.n475b }, { t: 'RIBU', mulai: T.n475b + 0.4 }, { t: 'TAHUN', mulai: T.n475b + 0.6 }, { t: 'LALU', mulai: T.lalu }]} mulai={S[5].mulai} keluar={S[6].mulai - 0.25} />
        <Judul kata={[{ t: 'baru', mulai: T.selesai - 0.4 }, { t: 'selesai', mulai: T.selesai }, { t: 'hari ini', mulai: T.hariIni, isi: sorot('hari ini', T.hariIni + 0.1) }]} mulai={T.selesai - 0.4} keluar={S[6].mulai - 0.2} />
      </Blok>
      {/* 7 */}
      <Blok a={S[6].mulai} b={S[7].mulai}>
        <Label kata={['DATA', 'SEGINI']} mulai={S[6].mulai} keluar={S[7].mulai - 0.25} />
        <Judul kata={[{ t: '7×', mulai: T.tujuh - 0.05, isi: <span style={{ color: K.teal }}>{Math.max(1, lapis)}×</span> }, { t: 'Llama 2', mulai: T.llama2a }]} mulai={T.tujuh - 0.05} keluar={S[7].mulai - 0.2} />
      </Blok>
      {/* 8 */}
      <Blok a={S[7].mulai} b={S[8].mulai}>
        <Label kata={['DARI', 'SUMBER', { t: 'TERBUKA', mulai: T.terbuka }, { t: 'BUAT', mulai: T.terbuka + 0.3 }, { t: 'UMUM', mulai: T.terbuka + 0.5 }]} mulai={T.dikumpulin - 0.2} keluar={S[8].mulai - 0.25} />
        <Judul kata={[{ t: 'kode', mulai: T.kode }, { t: '4×', mulai: T.empat - 0.15, isi: <span style={{ color: K.kuning }}>{Math.max(1, kode)}×</span> }]} mulai={T.kode} keluar={S[8].mulai - 0.2} />
      </Blok>
      {/* 9 */}
      <Blok a={S[8].mulai} b={S[9].mulai}>
        <Label kata={['LEBIH', 'DARI', { t: '5%', mulai: T.n5, warna: K.kuning }, { t: 'BUKAN', mulai: T.bukan9 }, { t: 'BAHASA', mulai: T.bukan9 + 0.2 }, { t: 'INGGRIS', mulai: T.inggris }]} mulai={S[8].mulai} keluar={S[9].mulai - 0.25} />
        <Judul kata={[{ t: '30+', mulai: T.n30 - 0.25, isi: <span style={{ color: K.kuning }}>{bahasa}{bahasa >= 30 ? '+' : ''}</span>, gaya: { minWidth: '1.45em', textAlign: 'right' } }, { t: 'bahasa', mulai: T.bahasa9 }]} mulai={T.n30 - 0.25} keluar={S[9].mulai - 0.2} />
        <Catatan teks="penanda di bola dunia: ilustrasi, Meta gak merinci daftar bahasanya" mulai={T.bahasa9} keluar={S[9].mulai - 0.25} />
      </Blok>
      {/* 10 */}
      <Blok a={S[9].mulai} b={S[10].mulai}>
        <Label kata={['SEBELUM', 'DIPAKAI']} mulai={S[9].mulai} keluar={S[10].mulai - 0.25} />
        <Judul kata={[{ t: 'disaring', mulai: T.disaring, isi: sorot('disaring', T.disaring + 0.15, K.teal) }, { t: 'dulu', mulai: T.disaring + 0.3 }]} mulai={T.disaring} keluar={S[10].mulai - 0.2} />
      </Blok>
      {/* 11 */}
      <Blok a={S[10].mulai} b={S[11].mulai}>
        <Label kata={['PENILAI', 'KUALITAS', { t: 'DILATIH', mulai: S[10].mulai + 1.0 }, { t: 'PAKAI', mulai: S[10].mulai + 1.4 }, { t: 'DATA', mulai: S[10].mulai + 1.7 }]} mulai={S[10].mulai} keluar={S[11].mulai - 0.25} />
        <Judul kata={[{ t: 'Llama 2', mulai: T.llama2c }, { t: 'milihin', mulai: T.milihin }, { t: 'bacaan', mulai: T.milihin + 0.35, isi: sorot('bacaan', T.milihin + 0.5) }]} mulai={T.llama2c} keluar={S[11].mulai - 0.2} />
      </Blok>
      {/* 12 */}
      <Blok a={S[11].mulai} b={S[12].mulai}>
        <Label kata={['DIPROSES', 'DI', { t: 'DUA', mulai: T.dua12 }, { t: 'KLASTER', mulai: T.dua12 + 0.25 }]} mulai={T.diproses - 0.2} keluar={S[12].mulai - 0.25} />
        <Judul
          kata={[
            { t: '2', mulai: T.dua12, warna: K.kuning },
            { t: '×', mulai: T.masing, warna: K.abu },
            { t: '24.000', mulai: T.masing, isi: <AngkaJalan dari={0} ke={24000} progress={isiGpu(t, T)} gaya={{ color: K.teal }} />, gaya: { minWidth: '2.3em', textAlign: 'right' } },
            { t: 'GPU', mulai: T.gpu },
          ]}
          mulai={T.dua12}
          keluar={S[12].mulai - 0.2}
        />
      </Blok>
      {/* 13 */}
      <Blok a={S[12].mulai} b={S[13].mulai}>
        <Label kata={['PARAMETER', { t: '=', mulai: T.angka13 - 0.2 }, { t: 'ANGKA', mulai: T.angka13 }, { t: 'YANG', mulai: T.disetel - 0.2 }, { t: 'DISETEL', mulai: T.disetel, warna: K.teal }]} mulai={S[12].mulai} keluar={S[13].mulai - 0.25} />
        <Judul
          kata={[
            { t: '8', mulai: T.n8 - 0.4, isi: <AngkaJalan dari={0} ke={8} progress={isiParam(t, T)} gaya={{ color: K.kuning }} />, gaya: { minWidth: '0.5em', textAlign: 'right' } },
            { t: 'miliar', mulai: T.miliar13 },
            { t: 'parameter', mulai: T.miliar13 + 0.2 },
          ]}
          mulai={T.n8 - 0.4}
          keluar={S[13].mulai - 0.2}
        />
      </Blok>
      {/* 14 */}
      <Blok a={S[13].mulai} b={S[14].mulai}>
        <Label kata={['MENURUT', { t: 'TAKARAN', mulai: T.takaran }, { t: 'PENELITI', mulai: T.peneliti }]} mulai={S[13].mulai} keluar={S[14].mulai - 0.25} />
        <Judul kata={[{ t: 'takaran:', mulai: T.cukup, warna: K.abu }, { t: '200', mulai: T.n200, warna: K.kuning }, { t: 'miliar', mulai: T.n200 + 0.5 }, { t: 'token', mulai: T.token14 }]} mulai={T.cukup} keluar={S[14].mulai - 0.2} />
      </Blok>
      {/* 15 */}
      <Blok a={S[14].mulai} b={S[15].mulai}>
        <Label kata={['META', 'NGASIH', { t: 'SEKITAR', mulai: T.n75 - 0.35 }]} mulai={S[14].mulai} keluar={S[15].mulai - 0.25} />
        <Judul
          kata={[
            { t: '±', mulai: T.n75 - 0.1, warna: K.abu },
            { t: '75×', mulai: T.n75 - 0.1, isi: <span style={{ color: K.teal }}><AngkaJalan dari={1} ke={75} progress={tumbuhBatang(t, T)} />×</span>, gaya: { minWidth: '1.55em', textAlign: 'right' } },
            { t: 'takaran', mulai: T.lipatnya },
          ]}
          mulai={T.n75 - 0.1}
          keluar={S[15].mulai - 0.2}
        />
        <Catatan teks="hitungan: 15 triliun ÷ 200 miliar = 75" mulai={T.lipatnya} keluar={T.ternyata + 0.2} />
        <Catatan teks="batang kemampuan: gambaran tren · Meta: model terus membaik sampai 15 triliun token" mulai={T.ternyata + 0.4} keluar={S[15].mulai - 0.25} lebar={560} />
      </Blok>
      {/* 16 */}
      <Blok a={S[15].mulai} b={T.pulang}>
        <Label kata={['KARENA', 'ITU', { t: 'AI', mulai: S[15].mulai + 0.5 }]} mulai={S[15].mulai} keluar={T.pulang - 0.1} />
        <Judul kata={[{ t: 'nyambung', mulai: T.nyambung }, { t: 'ke', mulai: T.nyambung + 0.3 }, { t: 'banyak', mulai: T.topik - 0.2 }, { t: 'topik', mulai: T.topik, isi: sorot('topik', T.topik + 0.15) }]} mulai={T.nyambung} keluar={T.pulang - 0.05} />
      </Blok>
      {/* topik-topik */}
      {t > T.topik - 0.3 && t < T.pulang + 0.4
        ? TOPIK.map((w, i) => {
            // dua kolom di kiri (menara di kanan)
            const x = 170 + (i % 2) * 235 + (Math.floor(i / 2) % 2) * 30;
            const y = 620 + Math.floor(i / 2) * 115;
            return (
              <Pop key={w} mulai={T.topik - 0.3 + i * 0.07} keluar={T.pulang - 0.1 + i * 0.02} gaya={{ position: 'absolute', left: x - 110, top: y - 36, width: 220, display: 'flex', justifyContent: 'center' }}>
                <div style={{ padding: '6px 22px', borderRadius: 30, background: K.panel, border: `3px solid ${i % 2 ? K.teal : K.kuning}`, fontFamily: SAIRA, fontWeight: 700, fontSize: 46, color: K.tinta, whiteSpace: 'nowrap' }}>{w}</div>
              </Pop>
            );
          })
        : null}
      {/* satu orang */}
      {t > T.mungkin - 0.2 && t < T.pulang + 0.3 ? (
        <div style={{ position: 'absolute', left: orang.x, top: orang.y, opacity: 1 - maju(t, T.pulang, T.pulang + 0.25) }}>
          <div style={{ position: 'absolute', left: -40, top: -40, width: 80, height: 80, borderRadius: 40, border: `5px solid ${K.kuning}`, scale: String(pegas(t, T.mungkin - 0.2, fps, { damping: 10, stiffness: 200, mass: 0.6 })) }} />
          <div style={{ position: 'absolute', right: 52, top: -30, fontFamily: SAIRA, fontWeight: 800, fontSize: 52, color: K.kuning, opacity: maju(t, T.satuOrang - 0.2, T.satuOrang + 0.1), whiteSpace: 'nowrap' }}>1 orang</div>
        </div>
      ) : null}
    </>
  );
};
