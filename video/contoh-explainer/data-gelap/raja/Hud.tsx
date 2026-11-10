// HUD (koordinat LAYAR): label caps + kata kunci besar per kalimat (kiri atas), sumber (kanan atas), dan objek layar
// per adegan. Objek yang nunjuk ke peta pakai proyeksi(kam, titik dunia) biar nempel walau kamera gerak.
import React from 'react';
import { random, useVideoConfig } from 'remotion';
import {
  AngkaJalan, EASE, GarisDigambar, KataMuncul, maju, noise, pegas, Pop, proyeksi, SapuSorot, useDetik, type Kamera, type KataLayar,
} from "../../../src/gerak";
import { MONO, SAIRA } from "../../../src/gerak/font";
import { K } from "./gaya";
import { HASIL, PRIA, WANITA, posKata } from "./data-peta";
import { bentukPeta, langkahSetel } from "./Peta";
import { isiBener, isiSoal } from "./Adegan";
import type { WaktuR } from "./waktuRaja";

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

const LABEL: React.CSSProperties = { fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: K.abu };
const JUDUL: React.CSSProperties = { fontFamily: SAIRA, fontWeight: 800, fontSize: 104, lineHeight: 1.0, color: K.tinta, columnGap: '0.24em' };
const CATATAN: React.CSSProperties = { fontFamily: MONO, fontWeight: 500, fontSize: 26, color: K.abu };

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1080} height={1920}>
    {children}
  </svg>
);

const Blok: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => {
  const t = useDetik();
  if (t < a - 0.15 || t > b + 0.4) return null;
  return <>{children}</>;
};

/** label caps (dengan garis teal kecil di kiri) */
const Label: React.FC<{ kata: (KataLayar | string)[]; mulai: number; keluar: number; top?: number; warna?: string }> = ({ kata, mulai, keluar, top = 196, warna }) => {
  const t = useDetik();
  const o = maju(t, mulai - 0.05, mulai + 0.12) * (1 - maju(t, keluar, keluar + 0.2, EASE.keluar));
  return (
    <div style={{ position: 'absolute', left: 90, top, display: 'flex', alignItems: 'center', gap: 18, width: 960, flexWrap: 'nowrap' }}>
      <div style={{ width: 8, height: 40, borderRadius: 4, background: K.teal, opacity: o }} />
      <KataMuncul mulai={mulai} keluar={keluar} jeda={0.06} gaya={{ ...LABEL, color: warna ?? K.abu }} kata={kata} />
    </div>
  );
};
const Judul: React.FC<{ kata: (KataLayar | string)[]; mulai: number; keluar: number; top?: number; gaya?: React.CSSProperties }> = ({ kata, mulai, keluar, top = 250, gaya }) => (
  <div style={{ position: 'absolute', left: 90, top, width: 920 }}>
    <KataMuncul mulai={mulai} keluar={keluar} jeda={0.05} lama={0.2} gaya={{ ...JUDUL, ...gaya }} kata={kata} />
  </div>
);
const Catatan: React.FC<{ teks: string; mulai: number; keluar: number; top?: number }> = ({ teks, mulai, keluar, top = 472 }) => {
  const t = useDetik();
  const o = maju(t, mulai, mulai + 0.25) * (1 - maju(t, keluar, keluar + 0.2));
  if (o <= 0) return null;
  return <div style={{ position: 'absolute', left: 90, top, width: 920, ...CATATAN, opacity: o }}>{teks}</div>;
};
const sorot = (teks: string, mulai: number, warna = K.kuning, warnaTeks = K.latar) => (
  <SapuSorot mulai={mulai} lama={0.24} warna={warna} warnaTeks={[K.tinta, warnaTeks]} penuh>
    {teks}
  </SapuSorot>
);

// ======================================================================================================
export const Hud: React.FC<{ T: WaktuR; kam: Kamera }> = ({ T, kam }) => {
  const t = useDetik();
  const sumberO = maju(t, T.k2.mulai + 0.4, T.k2.mulai + 0.8) * (1 - maju(t, T.pulang - 0.1, T.pulang + 0.3));
  const S = T.s;
  return (
    <>
      {sumberO > 0 ? (
        <div style={{ position: 'absolute', left: 90, top: 1478, ...CATATAN, fontSize: 24, opacity: sumberO }}>
          Sumber: Mikolov dkk., Microsoft Research · NAACL 2013
        </div>
      ) : null}

      {/* 1 */}
      <Blok a={0} b={S[1].mulai}>
        {t < T.bukan1 - 0.1 ? <Label kata={['BUAT', 'AI']} mulai={0.12} keluar={T.bukan1 - 0.25} /> : null}
        <Label
          kata={[{ t: 'BUKAN', mulai: T.bukan1 }, { t: 'TULISAN,', mulai: T.tulisan }, { t: 'TAPI', mulai: T.deretan - 0.3 }, { t: 'ANGKA', mulai: T.angka1, warna: K.kuning }]}
          mulai={T.bukan1}
          keluar={S[1].mulai - 0.2}
        />
      </Blok>
      {/* 2 */}
      <Blok a={S[1].mulai} b={S[2].mulai}>
        <Label kata={[{ t: 'ANGKA', mulai: S[1].mulai + 0.1 }, { t: '=', mulai: T.alamat2 - 0.15 }, { t: 'ALAMAT', mulai: T.alamat2, warna: K.kuning }]} mulai={S[1].mulai} keluar={S[2].mulai - 0.25} />
        <Judul kata={[{ t: 'peta', mulai: T.peta2 }, { t: 'makna', mulai: T.raksasa2, isi: sorot('makna', T.raksasa2 + 0.15, K.teal) }]} mulai={T.peta2} keluar={S[2].mulai - 0.2} />
        <Catatan teks="ilustrasi 2D · aslinya ratusan dimensi" mulai={T.raksasa2 + 0.3} keluar={S[2].mulai - 0.25} />
      </Blok>
      {/* 3 */}
      <Blok a={S[2].mulai} b={S[3].mulai}>
        <Label kata={[{ t: 'TAHUN', mulai: T.tahun }, { t: '·', mulai: T.tiga3 }, { t: '3 PENELITI', mulai: T.tiga3 + 0.1 }]} mulai={T.tahun} keluar={S[3].mulai - 0.25} />
        <Judul
          kata={[
            { t: 'Microsoft', mulai: T.microsoft },
            { t: 'Research', mulai: T.microsoft + 0.25 },
            { t: '·', mulai: T.microsoft + 0.4, warna: K.abu },
            { t: '2013', mulai: T.tahun, isi: <TahunJalan T={T} />, warna: K.kuning },
          ]}
          mulai={T.tahun}
          keluar={S[3].mulai - 0.2}
        />
        <Penggaris T={T} />
      </Blok>
      <Kursor3 T={T} kam={kam} />
      {/* 4 */}
      <Blok a={S[3].mulai} b={S[4].mulai}>
        <Label kata={['DIBENTUK', 'SENDIRI', { t: 'DARI', mulai: T.dari4 }]} mulai={T.dibentuk - 0.1} keluar={S[4].mulai - 0.25} />
        <Judul
          kata={[
            { t: '320', mulai: T.n320 - 0.1, isi: <AngkaJalan dari={0} ke={320} progress={bentukPeta(t, T)} gaya={{ color: K.kuning }} />, gaya: { minWidth: '1.55em', textAlign: 'right' } },
            { t: 'juta', mulai: T.juta },
            { t: 'kata', mulai: T.juta + 0.2 },
          ]}
          mulai={T.n320 - 0.1}
          keluar={S[4].mulai - 0.2}
        />
        <Catatan teks="transkrip berita TV & radio · proses latihan dipercepat" mulai={T.transkrip} keluar={S[4].mulai - 0.25} />
      </Blok>
      <Siaran T={T} />
      {/* 5 */}
      <Blok a={S[4].mulai} b={S[5].mulai}>
        <Label kata={['SELAMA', 'LATIHAN,', { t: 'TUGASNYA:', mulai: T.tugas }]} mulai={S[4].mulai + 0.1} keluar={S[5].mulai - 0.25} />
        <Judul kata={[{ t: 'tebak', mulai: T.nebak }, { t: 'kata', mulai: T.nebak + 0.3 }, { t: 'berikutnya', mulai: T.berikutnya, isi: sorot('berikutnya', T.berikutnya + 0.2, K.kuning) }]} mulai={T.nebak} keluar={S[5].mulai - 0.2} />
      </Blok>
      <Tebakan T={T} kam={kam} />
      {/* 6 */}
      <Blok a={S[5].mulai} b={S[6].mulai}>
        <Label kata={[{ t: 'SEDIKIT', mulai: T.sedikit6 }, { t: 'DEMI', mulai: T.sedikit6 + 0.25 }, { t: 'SEDIKIT', mulai: T.sedikit6 + 0.5 }]} mulai={T.sedikit6} keluar={S[6].mulai - 0.25} />
        <Judul kata={[{ t: 'angka', mulai: S[5].mulai }, { t: 'disetel', mulai: T.disetel, isi: sorot('disetel', T.disetel + 0.2, K.teal) }]} mulai={S[5].mulai} keluar={S[6].mulai - 0.2} />
      </Blok>
      {/* 7 */}
      <Blok a={S[6].mulai} b={S[7].mulai}>
        <Label kata={['HITUNGAN', 'ANEHNYA']} mulai={S[6].mulai} keluar={S[7].mulai - 0.25} />
        <Judul
          kata={[
            { t: 'raja', mulai: T.raja7 },
            { t: '−', mulai: T.dikurangi, warna: K.merah },
            { t: 'pria', mulai: T.pria7 },
            { t: '+', mulai: T.ditambah, warna: K.teal },
            { t: 'wanita', mulai: T.wanita7 },
          ]}
          mulai={T.raja7}
          keluar={S[7].mulai - 0.2}
        />
      </Blok>
      {/* 8 */}
      <Blok a={S[7].mulai} b={S[8].mulai}>
        <Label kata={['TITIK', 'HASILNYA', { t: 'GAK', mulai: T.gak8, warna: K.merah }, { t: 'PAS', mulai: T.gak8 + 0.2, warna: K.merah }]} mulai={T.titik8} keluar={S[8].mulai - 0.25} />
        <Judul kata={[{ t: 'cari', mulai: T.dicari }, { t: 'tetangga', mulai: T.tetangga }, { t: 'terdekat', mulai: T.terdekat, isi: sorot('terdekat', T.terdekat + 0.2, K.teal) }]} mulai={T.dicari} keluar={S[8].mulai - 0.2} />
      </Blok>
      {/* 9 */}
      <Blok a={S[8].mulai} b={S[9].mulai}>
        <Label kata={['HASILNYA', 'PALING', 'DEKAT', 'KE']} mulai={S[8].mulai + 0.05} keluar={S[9].mulai - 0.25} />
        <Judul kata={[{ t: '≈', mulai: T.ratu - 0.15, warna: K.kuning }, { t: 'ratu', mulai: T.ratu, isi: sorot('ratu', T.ratu + 0.12, K.kuning) }]} mulai={T.ratu - 0.15} keluar={S[9].mulai - 0.2} gaya={{ fontSize: 132 }} />
      </Blok>
      {/* 10 */}
      <Blok a={S[9].mulai} b={S[10].mulai}>
        {t < T.hubungan ? <Label kata={['ATURAN', 'ITU']} mulai={S[9].mulai + 0.1} keluar={T.hubungan - 0.25} /> : null}
        <Label kata={[{ t: 'KEBENTUK', mulai: T.kebentuk }, { t: 'SENDIRI', mulai: T.kebentuk + 0.25 }, { t: 'DARI', mulai: T.cara - 0.2 }, { t: 'BANYAK', mulai: T.banyak10 }, { t: 'TEKS', mulai: T.banyak10 + 0.25 }]} mulai={T.kebentuk} keluar={S[10].mulai - 0.25} />
        <Judul kata={[{ t: 'gak', mulai: S[9].mulai + 0.05, warna: K.merah }, { t: 'diajarin', mulai: T.ngajarin }]} mulai={S[9].mulai + 0.05} keluar={S[10].mulai - 0.2} />
        <Catatan teks="pasangan lain di peta: ilustrasi" mulai={T.kebentuk} keluar={S[10].mulai - 0.25} />
      </Blok>
      <KartuCoret T={T} mulai={S[9].mulai + 0.15} coret={T.ngajarin + 0.1} keluar={T.hubungan - 0.1} label="ATURAN" isi={<>raja − pria + wanita<br />= ratu</>} />
      <PitaTeks T={T} />
      {/* 11 */}
      <Blok a={S[10].mulai} b={S[11].mulai}>
        <Label kata={['BENTUK', 'JAMAK', '·', { t: 'BAHASA', mulai: T.inggris - 0.15 }, { t: 'INGGRIS', mulai: T.inggris }]} mulai={T.jamak11 - 0.3} keluar={S[11].mulai - 0.25} />
        <Judul
          kata={[
            { t: 'apple', mulai: T.apple },
            { t: '→', mulai: T.apple + 0.35, warna: K.teal },
            { t: 'apples', mulai: T.apples },
            { t: '≈', mulai: T.hampir11, warna: K.kuning },
            { t: 'car', mulai: T.car },
            { t: '→', mulai: T.car + 0.2, warna: K.kuning },
            { t: 'cars', mulai: T.cars },
          ]}
          mulai={T.apple}
          keluar={S[11].mulai - 0.2}
        />
      </Blok>
      {/* 12 */}
      <Blok a={S[11].mulai} b={S[12].mulai}>
        <Label kata={['BUAT', 'NGETES']} mulai={T.ngetes - 0.1} keluar={S[12].mulai - 0.25} />
        <Judul
          kata={[
            { t: '8.000', mulai: T.n8000 - 0.1, isi: <AngkaJalan dari={0} ke={8000} progress={isiSoal(t, T)} gaya={{ color: K.kuning }} />, gaya: { minWidth: '2.1em', textAlign: 'right' } },
            { t: 'soal', mulai: T.soal12 },
          ]}
          mulai={T.n8000 - 0.1}
          keluar={S[12].mulai - 0.2}
        />
      </Blok>
      {/* 13 */}
      <Blok a={S[12].mulai} b={S[13].mulai}>
        <Label kata={[{ t: 'KEJAWAB', mulai: T.kejawab }, { t: 'BENER', mulai: T.kejawab + 0.25 }]} mulai={T.kejawab} keluar={S[13].mulai - 0.25} />
        <Judul
          kata={[
            { t: 'hampir', mulai: S[12].mulai },
            { t: '40%', mulai: T.n40 - 0.1, isi: <AngkaJalan dari={0} ke={40} progress={isiBener(t, T)} belakang="%" gaya={{ color: K.kuning }} />, gaya: { minWidth: '1.5em' } },
            { t: 'vs', mulai: T.padahal, warna: K.abu },
            { t: '< 1%', mulai: T.n1, warna: K.merah },
          ]}
          mulai={S[12].mulai}
          keluar={S[13].mulai - 0.2}
        />
      </Blok>
      {/* 14 */}
      <Blok a={S[13].mulai} b={S[14].mulai}>
        <Label kata={['ARTINYA,', 'AI', 'BELAJAR', { t: 'MAKNA', mulai: T.makna, warna: K.kuning }]} mulai={S[13].mulai + 0.05} keluar={S[14].mulai - 0.25} />
        <Judul
          kata={[
            { t: 'jarak', mulai: T.jarak14 },
            { t: '&', mulai: T.arah - 0.2, warna: K.abu },
            { t: 'arah', mulai: T.arah },
            { t: '=', mulai: T.arah + 0.3, warna: K.abu },
            { t: 'makna', mulai: T.arah + 0.4, isi: sorot('makna', T.arah + 0.55, K.kuning) },
          ]}
          mulai={T.jarak14}
          keluar={S[14].mulai - 0.2}
        />
      </Blok>
      <KartuCoret T={T} mulai={T.bukan14 - 0.25} coret={T.kamus + 0.05} keluar={S[14].mulai + 0.2} label="BUKAN DARI" isi="kamus" ikonBuku />
      {/* 15 */}
      <Blok a={S[14].mulai} b={T.pulang}>
        <Label kata={['MODEL', 'BAHASA', 'SEKARANG']} mulai={S[14].mulai + 0.05} keluar={T.pulang - 0.1} />
        <Judul kata={[{ t: 'kata', mulai: T.ngubah }, { t: '→', mulai: T.angka15 - 0.2, warna: K.teal }, { t: 'angka', mulai: T.angka15, isi: sorot('angka', T.angka15 + 0.2, K.teal) }, { t: 'dulu', mulai: T.angka15 + 0.6, warna: K.abu }]} mulai={T.ngubah} keluar={T.pulang - 0.05} />
      </Blok>
      <Chat T={T} kam={kam} />
    </>
  );
};

// ======================================================================================================
// S3: tahun berjalan 2026 → 2013, diikat ke penggaris tahun yang geser
function progresTahun(t: number, T: WaktuR) {
  return maju(t, T.tahun - 0.05, T.th2013 + 0.55, EASE.kamera);
}
const TahunJalan: React.FC<{ T: WaktuR }> = ({ T }) => {
  const t = useDetik();
  // tahun ditulis tanpa titik ribuan
  return <span style={{ color: K.kuning, fontVariantNumeric: 'tabular-nums' }}>{Math.round(lerp(2026, 2013, progresTahun(t, T)))}</span>;
};
const Penggaris: React.FC<{ T: WaktuR }> = ({ T }) => {
  const t = useDetik();
  const p = progresTahun(t, T);
  const tahun = lerp(2026, 2013, p);
  const o = maju(t, T.tahun - 0.1, T.tahun + 0.2) * (1 - maju(t, T.k4.mulai - 0.3, T.k4.mulai));
  if (o <= 0) return null;
  const jarak = 64;
  const tengah = 470;
  return (
    <div style={{ position: 'absolute', left: 70, top: 470, width: 940, height: 74, overflow: 'hidden', opacity: o, maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)' }}>
      {Array.from({ length: 34 }, (_, i) => {
        const th = 2000 + i;
        const x = tengah + (th - tahun) * jarak;
        const besar = th % 5 === 0 || th === 2013;
        return (
          <React.Fragment key={th}>
            <div style={{ position: 'absolute', left: x, top: 0, width: 3, height: besar ? 26 : 14, background: th === 2013 ? K.kuning : K.abu }} />
            {besar ? <div style={{ position: 'absolute', left: x - 40, top: 30, width: 80, textAlign: 'center', ...CATATAN, fontSize: 24, color: th === 2013 ? K.kuning : K.abu }}>{th}</div> : null}
          </React.Fragment>
        );
      })}
      <div style={{ position: 'absolute', left: tengah - 12, top: -2, width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: `16px solid ${K.kuning}` }} />
    </div>
  );
};

// S3: tiga kursor peneliti terbang ke peta & ninggalin tanda
const PanahKursor: React.FC<{ x: number; y: number; nama: string; o: number }> = ({ x, y, nama, o }) => (
  <div style={{ position: 'absolute', left: x, top: y, opacity: o }}>
    <svg width={56} height={70} viewBox="0 0 56 70" style={{ position: 'absolute', left: -4, top: -4, overflow: 'visible' }}>
      <path d="M4 4 L4 56 L18 44 L28 66 L38 61 L28 40 L46 40 Z" fill={K.tinta} stroke={K.latar} strokeWidth={4} strokeLinejoin="round" />
    </svg>
    <div style={{ position: 'absolute', left: 40, top: 54, padding: '4px 14px', borderRadius: 10, background: K.teal, color: K.latar, fontFamily: MONO, fontWeight: 800, fontSize: 28, whiteSpace: 'nowrap' }}>{nama}</div>
  </div>
);
const Kursor3: React.FC<{ T: WaktuR; kam: Kamera }> = ({ T, kam }) => {
  const t = useDetik();
  if (t < T.tiga3 - 0.7 || t > T.k4.mulai + 0.3) return null;
  const data = [
    { nama: 'Mikolov', tiba: T.tiga3 + 0.25, ke: { x: PRIA.x - 80, y: PRIA.y - 80 }, tulis: T.nyobain + 0.1, dari: { x: 1180, y: 620 } },
    { nama: 'Yih', tiba: T.peneliti + 0.3, ke: { x: WANITA.x - 80, y: WANITA.y - 80 }, tulis: T.hitungan3, dari: { x: 1180, y: 900 } },
    { nama: 'Zweig', tiba: T.microsoft + 0.35, ke: { x: HASIL.x, y: HASIL.y - 30 }, tulis: T.aneh, dari: { x: 1180, y: 1180 } },
  ];
  return (
    <>
      {data.map((d, i) => {
        const tuju = proyeksi(kam, d.ke.x, d.ke.y);
        const p = maju(t, d.tiba - 0.55, d.tiba, EASE.kamera);
        const keluar = maju(t, T.k4.mulai - 0.45 + i * 0.06, T.k4.mulai + 0.05 + i * 0.06, EASE.keluar);
        // pas nulis tanda: kursor nyapu dikit
        const tulis = maju(t, d.tulis, d.tulis + 0.3, EASE.kamera);
        const sapu = Math.sin(tulis * Math.PI) * 40;
        const x = lerp(d.dari.x, tuju.x + 20 + sapu, p) + keluar * 500 + noise(`k${i}`, t * 0.8) * 6 * p;
        const y = lerp(d.dari.y, tuju.y + 20, p) - keluar * 300 + noise(`ky${i}`, t * 0.8) * 6 * p - Math.sin(Math.PI * p) * 80;
        if (p <= 0) return null;
        return <PanahKursor key={i} x={x} y={y} nama={d.nama} o={1 - keluar} />;
      })}
    </>
  );
};

// ======================================================================================================
// S4: ikon TV & radio, kata-kata transkrip ngalir ke peta (ilustrasi, data aslinya berita bahasa Inggris)
const KATA_BERITA = 'the president said today market weather police game price city news report people government week rain storm minister school team election money police report world'.split(' ');
const IkonTV: React.FC = () => (
  <svg width={200} height={160} viewBox="0 0 200 160">
    <path d="M70 18 L100 42 L130 18" stroke={K.abu} strokeWidth={6} fill="none" strokeLinecap="round" />
    <rect x={10} y={42} width={180} height={112} rx={18} fill={K.panel} stroke={K.tinta} strokeWidth={6} />
    <rect x={28} y={58} width={120} height={80} rx={8} fill={K.tealTua} />
    <circle cx={168} cy={76} r={7} fill={K.kuning} />
    <circle cx={168} cy={102} r={7} fill={K.abu} />
  </svg>
);
const IkonRadio: React.FC = () => (
  <svg width={200} height={160} viewBox="0 0 200 160">
    <path d="M40 46 L150 8" stroke={K.abu} strokeWidth={6} strokeLinecap="round" />
    <rect x={10} y={46} width={180} height={108} rx={18} fill={K.panel} stroke={K.tinta} strokeWidth={6} />
    <circle cx={64} cy={100} r={32} fill="none" stroke={K.teal} strokeWidth={6} />
    <circle cx={64} cy={100} r={12} fill={K.teal} />
    <rect x={112} y={74} width={58} height={12} rx={6} fill={K.kuning} />
    <rect x={112} y={98} width={58} height={8} rx={4} fill={K.abu} />
    <rect x={112} y={118} width={40} height={8} rx={4} fill={K.abu} />
  </svg>
);
const Siaran: React.FC<{ T: WaktuR }> = ({ T }) => {
  const t = useDetik();
  if (t < T.dibentuk - 0.3 || t > T.k5.mulai + 0.5) return null;
  const masuk = maju(t, T.dari4 - 0.6, T.dari4 - 0.1, EASE.masuk);
  const keluar = maju(t, T.k5.mulai - 0.3, T.k5.mulai + 0.2, EASE.keluar);
  const geser = (1 - masuk) * -320 + keluar * -320;
  const ikon = [
    { y: 660, el: <IkonTV />, nama: 'berita TV', tv: true },
    { y: 930, el: <IkonRadio />, nama: 'radio', tv: false },
  ];
  const a = T.n320 - 0.2;
  const b = T.radio + 0.5;
  const N = 46;
  return (
    <>
      {ikon.map((k, i) => (
        <div key={i} style={{ position: 'absolute', left: 30 + geser, top: k.y, translate: `0 ${noise(`ik${i}`, t) * 4}px` }}>
          {k.el}
          <div style={{ ...CATATAN, fontSize: 28, color: K.tinta, textAlign: 'center', width: 200, marginTop: 4 }}>{k.nama}</div>
        </div>
      ))}
      {Array.from({ length: N }, (_, i) => {
        const m = a + ((b - a - 0.9) * i) / N + random(`sw${i}`) * 0.15;
        const q = maju(t, m, m + 0.9, EASE.linear);
        if (q <= 0 || q >= 1 || keluar >= 1) return null;
        const asal = ikon[i % 2];
        const x0 = 220 + geser;
        const y0 = asal.y + 70;
        const x1 = 380 + random(`sx${i}`) * 640;
        const y1 = 600 + random(`sy${i}`) * 650;
        const x = lerp(x0, x1, q);
        const y = lerp(y0, y1, q) - Math.sin(Math.PI * q) * 60;
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y, fontFamily: MONO, fontWeight: 700, fontSize: lerp(30, 16, q), color: i % 3 === 0 ? K.kuning : K.tinta, opacity: Math.min(1, q * 6) * (1 - q) * (1 - keluar), whiteSpace: 'nowrap' }}>
            {KATA_BERITA[i % KATA_BERITA.length]}
          </div>
        );
      })}
    </>
  );
};

// ======================================================================================================
// S5–S6: kalimat dengan kata yang hilang; AI nebak; S6 bar keyakinan naik bareng langkah setel
const CALON = ['sepatu', 'payung', 'mahkota'];
const Tebakan: React.FC<{ T: WaktuR; kam: Kamera }> = ({ T, kam }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < T.latihan - 0.2 || t > T.lompat + 0.4) return null;
  const pop = pegas(t, T.latihan - 0.1, fps, { damping: 200 });
  const keluar = maju(t, T.lompat - 0.15, T.lompat + 0.2, EASE.keluar);
  const kunci = T.kalimat5 - 0.12;
  const idx = t < T.nebak ? -1 : t >= kunci ? 2 : Math.min(1, Math.floor((t - T.nebak) / Math.max(0.2, (kunci - T.nebak) / 2)));
  const salah = idx >= 0 && idx < 2;
  const kunciPop = t >= kunci ? 1 + 0.18 * (1 - pegas(t, kunci, fps, { damping: 9, stiffness: 240, mass: 0.6 })) : 1;
  const box = { x: 60, y: 560, w: 960, h: 128 };
  const slot = { x: box.x + 560, y: box.y + 18, w: 320, h: 92 };
  const mk = proyeksi(kam, posKata('mahkota').x, posKata('mahkota').y);
  const yakin = 0.18 + 0.74 * langkahSetel(t, T);
  return (
    <div style={{ opacity: pop * (1 - keluar), translate: `0 ${(1 - pop) * -30}px` }}>
      <div style={{ position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: 24, background: 'rgba(13,23,48,0.94)', border: `3px solid ${K.garis}`, boxShadow: '0 16px 50px rgba(0,0,0,0.5)' }} />
      <div style={{ position: 'absolute', left: box.x + 40, top: box.y + 22, fontFamily: SAIRA, fontWeight: 700, fontSize: 66, color: K.tinta, whiteSpace: 'nowrap' }}>raja itu memakai</div>
      <div style={{ position: 'absolute', left: slot.x, top: slot.y, width: slot.w, height: slot.h, borderRadius: 16, border: `4px ${idx < 0 ? 'dashed' : 'solid'} ${idx === 2 ? K.teal : salah ? K.merah : K.abu}`, background: idx === 2 ? 'rgba(61,219,200,0.14)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SAIRA, fontWeight: 800, fontSize: 64, color: idx === 2 ? K.teal : salah ? K.merah : K.abu, scale: String(kunciPop) }}>
        {idx < 0 ? '?' : CALON[idx]}
        {salah ? <span style={{ position: 'absolute', right: -50, fontSize: 56, color: K.merah }}>✗</span> : null}
        {idx === 2 ? <span style={{ position: 'absolute', right: -54, fontSize: 56, color: K.teal }}>✓</span> : null}
      </div>
      <Svg>
        <GarisDigambar d={`M ${slot.x + slot.w / 2} ${slot.y + slot.h + 8} L ${mk.x} ${mk.y - 14}`} mulai={kunci + 0.05} lama={0.3} warna={K.teal} tebal={4} />
      </Svg>
      {/* bar keyakinan (S6): naik tiap langkah setel */}
      {t > T.k6.mulai - 0.2 ? (
        <div style={{ position: 'absolute', left: box.x + 40, top: box.y + box.h + 18, display: 'flex', alignItems: 'center', gap: 18, opacity: maju(t, T.k6.mulai - 0.2, T.k6.mulai + 0.2) }}>
          <span style={{ ...CATATAN, fontSize: 28, color: K.tinta }}>tebakan</span>
          <div style={{ position: 'relative', width: 520, height: 22, borderRadius: 11, background: '#17243f' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: 22, width: 520 * yakin, borderRadius: 11, background: K.teal }} />
          </div>
          <span style={{ ...CATATAN, fontSize: 28, color: K.teal }}>makin tepat</span>
        </div>
      ) : null}
    </div>
  );
};

// ======================================================================================================
// kartu yang dicoret (S10 "aturan", S14 "kamus")
const KartuCoret: React.FC<{ T: WaktuR; mulai: number; coret: number; keluar: number; label: string; isi: React.ReactNode; ikonBuku?: boolean }> = ({ mulai, coret, keluar, label, isi, ikonBuku }) => {
  const t = useDetik();
  if (t < mulai - 0.05 || t > keluar + 0.4) return null;
  const k = { x: 560, y: 880, w: 440, h: 220 };
  return (
    <Pop mulai={mulai} keluar={keluar} damping={12} gaya={{ position: 'absolute', left: 0, top: 0 }}>
      <div style={{ position: 'absolute', left: k.x, top: k.y, width: k.w, height: k.h, borderRadius: 22, background: 'rgba(13,23,48,0.96)', border: `3px solid ${K.garis}`, padding: '24px 32px', boxShadow: '0 16px 50px rgba(0,0,0,0.55)' }}>
        <div style={{ ...LABEL, fontSize: 30 }}>{label}</div>
        <div style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: ikonBuku ? 88 : 54, lineHeight: 1.08, color: K.tinta, marginTop: 10, display: 'flex', alignItems: 'center', gap: 22 }}>
          {ikonBuku ? (
            <>
              <svg width={92} height={80} viewBox="0 0 92 80">
                <path d="M46 14 C 34 4, 14 4, 4 8 V 72 C 14 68, 34 68, 46 78 C 58 68, 78 68, 88 72 V 8 C 78 4, 58 4, 46 14 Z" fill={K.panel} stroke={K.tinta} strokeWidth={5} strokeLinejoin="round" />
                <path d="M46 14 V 78" stroke={K.tinta} strokeWidth={5} />
              </svg>
              kamus
            </>
          ) : (
            isi
          )}
        </div>
      </div>
      <Svg>
        <GarisDigambar d={`M ${k.x + 20} ${k.y + 40} L ${k.x + k.w - 20} ${k.y + k.h - 30}`} mulai={coret} lama={0.14} warna={K.merah} tebal={12} easing={EASE.masuk} />
        <GarisDigambar d={`M ${k.x + 30} ${k.y + k.h - 30} L ${k.x + k.w - 30} ${k.y + 40}`} mulai={coret + 0.12} lama={0.14} warna={K.merah} tebal={12} easing={EASE.masuk} />
      </Svg>
    </Pop>
  );
};

// S10: potongan kalimat lewat depan kamera ("dari cara kata dipakai di banyak teks")
const PITA = ['ayah dan ibu pergi ke pasar', 'sang ratu menyapa rakyatnya', 'pria itu membaca koran', 'wanita itu menyetir mobil', 'raja duduk di atas takhta', 'nenek memasak di dapur', 'paman membelikan bibi bunga'];
const PitaTeks: React.FC<{ T: WaktuR }> = ({ T }) => {
  const t = useDetik();
  const a = T.cara - 0.6;
  if (t < a || t > T.k11.mulai + 0.8) return null;
  return (
    <>
      {PITA.map((teks, i) => {
        const m = a + i * 0.28;
        const v = 520 + random(`pv${i}`) * 260;
        const x = 1120 - (t - m) * v * 0.75;
        const y = 620 + ((i * 97) % 620);
        const o = maju(t, m, m + 0.3) * (1 - maju(t, T.k11.mulai - 0.2, T.k11.mulai + 0.3));
        if (t < m || o <= 0) return null;
        const depan = i % 3 === 0;
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y, padding: '8px 22px', borderRadius: 14, background: 'rgba(13,23,48,0.75)', border: `2px solid ${K.garis}`, fontFamily: MONO, fontWeight: 600, fontSize: depan ? 38 : 30, color: K.tinta, opacity: o * (depan ? 0.75 : 0.55), filter: depan ? 'blur(1.4px)' : undefined, whiteSpace: 'nowrap' }}>
            {teks}
          </div>
        );
      })}
    </>
  );
};

// ======================================================================================================
// S15: kalimat kamu diketik → tiap kata jadi angka → terbang jadi titik di peta
const KALIMAT = ['kenapa', 'langit', 'warnanya', 'biru?'];
const ANGKA15 = ['[0,31 …]', '[−0,58 …]', '[0,07 …]', '[0,84 …]'];
const Chat: React.FC<{ T: WaktuR; kam: Kamera }> = ({ T, kam }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < T.k15.mulai - 0.1 || t > T.pulang + 0.6) return null;
  const box = { x: 60, y: 580, w: 960, h: 120 };
  const muncul = pegas(t, T.k15.mulai, fps, { damping: 200 });
  const kotakKeluar = maju(t, T.angka15 + 0.35, T.angka15 + 0.7, EASE.keluar);
  const teks = KALIMAT.join(' ');
  const nHuruf = Math.floor(teks.length * maju(t, T.k15.mulai + 0.25, T.ngubah - 0.1, EASE.linear));
  // titik tujuan di dalam bingkai kamera S15 (sebar kiri–kanan)
  const tujuan = [{ x: 2550, y: 2050 }, { x: 3250, y: 3250 }, { x: 4550, y: 2000 }, { x: 4950, y: 3150 }];
  let xKata = box.x + 44;
  return (
    <>
      <div style={{ opacity: muncul * (1 - kotakKeluar) }}>
        <div style={{ position: 'absolute', left: box.x, top: box.y - 50, ...CATATAN, fontSize: 28 }}>kalimat kamu</div>
        <div style={{ position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: 60, background: 'rgba(13,23,48,0.96)', border: `3px solid ${K.teal}`, boxShadow: '0 16px 50px rgba(0,0,0,0.55)' }} />
        {t < T.kata15 ? (
          <div style={{ position: 'absolute', left: box.x + 44, top: box.y + 22, fontFamily: SAIRA, fontWeight: 700, fontSize: 64, color: K.tinta, whiteSpace: 'nowrap' }}>
            {teks.slice(0, nHuruf)}
            <span style={{ opacity: Math.floor(t * 2.5) % 2 ? 1 : 0, color: K.teal }}>|</span>
          </div>
        ) : null}
      </div>
      {t >= T.kata15
        ? KALIMAT.map((w, i) => {
            const lebar = w.length * 30 + 40;
            const x0 = xKata;
            xKata += lebar + 20;
            const balik = maju(t, T.kata15 + i * 0.1, T.kata15 + i * 0.1 + 0.25, EASE.kamera);
            const terbang = maju(t, T.angka15 + 0.3 + i * 0.12, T.angka15 + 1.05 + i * 0.12, EASE.kamera);
            const d = tujuan[i];
            const tuju = proyeksi(kam, d.x, d.y);
            const x = lerp(x0 + lebar / 2, tuju.x, terbang);
            const y = lerp(box.y + box.h / 2, tuju.y, terbang) - Math.sin(Math.PI * terbang) * 120;
            const sk = lerp(1, 0.18, terbang);
            const mendarat = terbang >= 1;
            const denyut = mendarat ? maju(t, T.angka15 + 1.05 + i * 0.12, T.angka15 + 1.65 + i * 0.12) : 0;
            const habis = maju(t, T.pulang - 0.1, T.pulang + 0.3);
            if (mendarat) {
              return (
                <React.Fragment key={i}>
                  <div style={{ position: 'absolute', left: tuju.x - 10, top: tuju.y - 10, width: 20, height: 20, borderRadius: 10, background: K.kuning, opacity: 1 - habis, boxShadow: `0 0 24px ${K.kuning}` }} />
                  {denyut < 1 ? <div style={{ position: 'absolute', left: tuju.x - 10 - denyut * 40, top: tuju.y - 10 - denyut * 40, width: 20 + denyut * 80, height: 20 + denyut * 80, borderRadius: 100, border: `4px solid ${K.kuning}`, opacity: 1 - denyut }} /> : null}
                </React.Fragment>
              );
            }
            return (
              <div key={i} style={{ position: 'absolute', left: x, top: y, translate: '-50% -50%', scale: String(sk), padding: '8px 18px', borderRadius: 14, background: balik > 0.5 ? K.panel : 'transparent', border: balik > 0.5 ? `3px solid ${K.teal}` : undefined, fontFamily: balik > 0.5 ? MONO : SAIRA, fontWeight: 700, fontSize: balik > 0.5 ? 40 : 64, color: balik > 0.5 ? K.teal : K.tinta, whiteSpace: 'nowrap', transform: `scaleY(${Math.abs(1 - 2 * balik).toFixed(3)})` }}>
                {balik > 0.5 ? ANGKA15[i] : w}
              </div>
            );
          })
        : null}
    </>
  );
};
