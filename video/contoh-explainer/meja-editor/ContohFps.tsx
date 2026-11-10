// Frame hero (pembuka, tengah, puncak): 15, 859, 1432.
// contoh video explainer K7 (akun generik, konten contoh): "Film bersuara cuma 24 gambar diam per detik, kok kelihatan gerak?"
// Seri "meja editor amber" (panggung.tsx). Semua gambar = ilustrasi vektor (piktogram orang lari, lampu, grafik).
// Alur: strip film 24 still → layar gerak mulus (hook, penghitung 1–24 tiap detik) → slate SMPE 1929 35 mm → 16 (gak ketat) vs 24
// → 2 still gantian + "?" → Wertheimer 1912: 2 lampu gantian = gerak semu → beta vs phi → kartu persistence of vision dicoret →
// NASA 1983: sampel vs gerak asli → kecepatan & detail → CTA.
// Fakta: Transactions of the SMPE No. 37 (1929); Steinman, Pizlo & Pizlo, Vision Research 2000; Galifret, C R Biol 2006;
// Watson, Ahumada & Farrell, NASA TM 1983 & JOSA A 1986.
import React, { useMemo } from 'react';
import { useVideoConfig } from 'remotion';
import { AngkaJalan, EASE, GarisDigambar, maju, noise, useDetik } from "../../src/gerak";
import { ANTON, INTER, MONO } from "../../src/gerak/seri/meja-editor/font";
import { bunyi, Chip, JudulKD, KD, KiraInline, PanahInline, SlateKD, sorot } from "../../src/gerak/seri/meja-editor/seri";
import { Babak, dasarWaktu, Figur, JUDUL_KERTAS, Kertas, LABEL_KERTAS, latarSlate, MH, Muncul, MW, Panggung, PopT, Tag, type DataKD } from "../../src/gerak/seri/meja-editor/panggung";

export type DataK7 = DataKD;

function waktuK7(d: DataKD, total: number) {
  const B = dasarWaktu(d, total);
  const { k } = B;
  return {
    ...B,
    n24: k('24', 0, 1.2), diam: k('diam', 0, 2.2), mata: k('mata', 0, 3.6), mulus: k('mulus', 0, 5),
    disetujui: k('disetujui', 1, 0.9), society: k('society', 1, 1.6), amerika: k('amerika', 1, 3.6), th1929: k('1929', 1, 4.4), n35: k('35', 1, 6.4),
    bisu: k('bisu', 2, 1.2), n16: k('16', 2, 2.4), ketat: k('ketat', 2, 4.4),
    kenapa: k('kenapa', 3, 0.4), gerak3: k('gerak', 3, 2),
    th1912: k('1912', 4, 0.3), max: k('max', 4, 1.4), semu: k('semu', 4, 3.4), gantian: k('gantian', 4, 5.6),
    beta: k('beta', 5, 1), asli: k('asli', 5, 2.5), phi: k('phi', 5, 3.2), murni: k('murni', 5, 3.8), tanpa: k('tanpa', 5, 4.2),
    persistence: k('persistence', 6, 1.2), modern: k('modern', 6, 3.6), ninggalin: k('ninggalin', 6, 4.2),
    th1983: k('1983', 7, 0.3), nasa: k('nasa', 7, 1.4), model: k('model', 7, 2), ngitung: k('ngitung', 7, 2.6), asli7: k('asli', 7, 6),
    kecepatan: k('kecepatan', 8, 1.6), detail: k('detail', 8, 2.8),
  };
}
type WK = ReturnType<typeof waktuK7>;

export const ContohFps: React.FC<DataK7> = (d) => {
  const { durationInFrames, fps } = useVideoConfig();
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuK7(d, total), [d, total]);
  const S = T.s;
  return (
    <Panggung
      d={d}
      T={T}
      folder="k7"
      labelKlip={['24 gambar/dtk', 'SMPE 1929', 'film bisu 16', 'kok gerak?', 'Wertheimer', 'beta & phi', 'persistence', 'NASA 1983', 'kecepatan', 'simpan']}
      pembuka={<B0 T={T} />}
      monitor={
        <>
          <B0 T={T} />
          <B1 T={T} />
          <B2 T={T} />
          <B3 T={T} />
          <B4 T={T} />
          <B5 T={T} />
          <B6 T={T} />
          <B7 T={T} />
          <B8 T={T} />
        </>
      }
      hud={<Hud T={T} />}
      sumber={(t) =>
        t < S[1].mulai
          ? 'Sumber: Transactions of the SMPE 1929 · Watson dkk. (NASA) 1986'
          : t < S[3].mulai
            ? 'Sumber: Transactions of the SMPE, No. 37 (1929)'
            : t < S[6].mulai
              ? 'Sumber: Steinman, Pizlo & Pizlo, Vision Research 2000 (Wertheimer 1912)'
              : t < S[7].mulai
                ? 'Sumber: Galifret, Comptes Rendus Biologies 2006'
                : 'Sumber: Watson, Ahumada & Farrell, NASA 1983'
      }
      tagMonitor={() => 'ILUSTRASI'}
      getar={[{ t: T.th1929 + 0.02, kuat: 8 }, { t: T.ninggalin + 0.2, kuat: 6 }]}
      sfx={[
        bunyi('tik', T.n24, 0.3),
        bunyi('whooshLembut', T.mulus - 0.2, 0.25),
        bunyi('whooshA', S[1].mulai - 0.05, 0.3),
        bunyi('jepret', T.th1929, 0.55),
        bunyi('hantam', T.th1929 + 0.02, 0.32),
        bunyi('pop', T.n16, 0.28),
        bunyi('glitch', T.ketat, 0.25),
        bunyi('pop', T.gerak3, 0.32),
        ...[0, 1, 2, 3].map((i) => bunyi('tik', T.gantian - 0.2 + i * 0.35, 0.18)),
        bunyi('pop', T.beta, 0.26),
        bunyi('pop', T.phi, 0.26),
        bunyi('glitch', T.ninggalin + 0.1, 0.3),
        bunyi('pop', T.nasa, 0.28),
        bunyi('whooshLembut', T.ngitung, 0.22),
        bunyi('tik', T.kecepatan, 0.28),
        bunyi('tik', T.detail, 0.28),
      ]}
    />
  );
};

// ======================================================================================================
/** Satu still (frame film) berisi orang lari di fase tertentu. */
export const Still: React.FC<{ w: number; h: number; fase: number; nomor?: number; sorot?: boolean }> = ({ w, h, fase, nomor, sorot: s }) => (
  <div style={{ position: 'relative', width: w, height: h, borderRadius: 6, overflow: 'hidden', background: '#2a2119', boxShadow: `inset 0 0 0 ${s ? 4 : 2}px ${s ? KD.amber : 'rgba(199,159,85,0.55)'}` }}>
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: h * 0.16, background: '#382c20' }} />
    <Figur x={w / 2} y={h * 0.84} s={(h / 220) * 0.95} fase={fase} tebal={12} />
    {nomor !== undefined ? <div style={{ position: 'absolute', left: 6, top: 3, fontFamily: MONO, fontWeight: 700, fontSize: 15, color: KD.abu }}>{nomor}</div> : null}
  </div>
);

// S0 (pembuka): strip 24 still → layar gerak mulus ---------------------------------------------------------------------
const B0: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const fh = 104;
  const geser = (t * 24 * (fh + 10)) / 8; // strip jalan pelan (ilustrasi)
  const idx = Math.floor((t % 1) * 24) + 1;
  return (
    <Babak dari={0} sampai={S[1].mulai} tanpaSapu latar="#0f0e12">
      {/* strip film vertikal */}
      <div style={{ position: 'absolute', left: 40, top: 0, width: 170, height: MH, background: '#151316', overflow: 'hidden', boxShadow: 'inset 0 0 0 2px rgba(199,159,85,0.4)' }}>
        {[8, 148].map((x) => (
          <div key={x} style={{ position: 'absolute', left: x, top: 0, width: 14, height: MH, backgroundImage: 'repeating-linear-gradient(180deg, rgba(239,235,226,0.18) 0 12px, transparent 12px 26px)', backgroundPosition: `0 ${(-geser % 26).toFixed(1)}px` }} />
        ))}
        {Array.from({ length: 7 }, (_, i) => {
          const n = Math.floor(geser / (fh + 10)) + i;
          const y = i * (fh + 10) - (geser % (fh + 10)) - 10;
          return (
            <div key={i} style={{ position: 'absolute', left: 28, top: y }}>
              <Still w={114} h={fh} fase={(n % 8) / 8} nomor={(n % 24) + 1} />
            </div>
          );
        })}
      </div>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <path d="M 230 250 H 290" stroke={KD.amber} strokeWidth={6} strokeLinecap="round" />
        <path d="M 276 236 L 292 250 L 276 264" stroke={KD.amber} strokeWidth={6} fill="none" strokeLinecap="round" />
      </svg>
      {/* layar: gerak mulus */}
      <div style={{ position: 'absolute', left: 310, top: 70, width: 540, height: 330, borderRadius: 12, overflow: 'hidden', background: '#2a2119', boxShadow: '0 0 0 3px rgba(199,159,85,0.8)' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 56, background: '#382c20' }} />
        <div style={{ position: 'absolute', left: -((t * 140) % 80), bottom: 56, width: 700, height: 4, backgroundImage: 'repeating-linear-gradient(90deg, rgba(239,235,226,0.25) 0 30px, transparent 30px 80px)' }} />
        <Figur x={270} y={278} s={1.2} fase={(t * 1.6) % 1} tebal={12} />
      </div>
      <div style={{ position: 'absolute', left: 310, top: 418, display: 'flex', alignItems: 'baseline', gap: 10, opacity: maju(t, Math.max(0.3, T.n24 - 0.2), Math.max(0.5, T.n24)) }}>
        <span style={{ fontFamily: ANTON, fontSize: 52, color: KD.amber, lineHeight: 1, minWidth: '1.2em', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{idx}</span>
        <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.tulang }}>/ 24 gambar tiap detik</span>
      </div>
      <Chip x={700} y={110} teks="kelihatan: gerak mulus" ukuran={24} isi o={maju(t, T.mulus - 0.1, T.mulus + 0.1)} />
    </Babak>
  );
};

// S1: slate SMPE 1929 ----------------------------------------------------------------------------------------------------
const B1: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  return (
    <Babak dari={S[1].mulai} sampai={S[2].mulai}>
      {latarSlate(maju(t, S[1].mulai - 0.1, S[1].mulai + 0.2))}
      <SlateKD
        x={MW / 2}
        y={MH / 2 + 4}
        w={580}
        masuk={S[1].mulai - 0.05}
        tepuk={T.th1929}
        keluar={S[2].mulai + 0.3}
        baris={[
          { label: 'ORGANISASI', isi: 'SMPE (Amerika)', mulai: T.society - 0.05 },
          { label: 'TAHUN', isi: '1929', mulai: T.th1929 - 0.05, warna: KD.amber },
          { label: 'STANDAR', isi: 'film bersuara 35 mm', mulai: T.n35 - 0.3 },
        ]}
      />
    </Babak>
  );
};

// S2: film bisu 16 (gak ketat) vs bersuara 24 -----------------------------------------------------------------------------
const B2: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const x0 = 60;
  const L = 760;
  const baris = (y: number, n: number, goyang: number, warna: string, m: number) => (
    <>
      <div style={{ position: 'absolute', left: x0, top: y, width: L, height: 4, background: 'rgba(239,235,226,0.25)' }} />
      {Array.from({ length: n }, (_, i) => {
        const o = maju(t, m + i * 0.025, m + 0.1 + i * 0.025);
        const jit = goyang * noise(`b2${n}${i}`, t * 1.2) * (L / n) * 0.35;
        return <div key={i} style={{ position: 'absolute', left: x0 + ((i + 0.5) * L) / n + jit - 9, top: y - 26, width: 18, height: 56, borderRadius: 4, background: warna, opacity: o }} />;
      })}
      <div style={{ position: 'absolute', left: x0, top: y + 40, fontFamily: MONO, fontWeight: 700, fontSize: 18, color: KD.abu }}>0 dtk</div>
      <div style={{ position: 'absolute', left: x0 + L - 50, top: y + 40, fontFamily: MONO, fontWeight: 700, fontSize: 18, color: KD.abu }}>1 dtk</div>
    </>
  );
  return (
    <Babak dari={S[2].mulai} sampai={S[3].mulai}>
      <Muncul m={T.bisu - 0.1} x={x0} y={46}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 28, color: KD.tulang }}>
          film bisu: <AngkaJalan dari={0} ke={16} mulai={T.n16 - 0.1} lama={0.5} gaya={{ fontFamily: ANTON, fontSize: 44, color: KD.amber }} /> gambar/detik
        </div>
      </Muncul>
      {baris(160, 16, maju(t, T.ketat - 0.2, T.ketat + 0.3), KD.amber, T.n16 - 0.1)}
      <Chip x={720} y={64} teks="gak dipakai ketat" ukuran={24} warna={KD.koral} o={maju(t, T.ketat - 0.1, T.ketat + 0.15)} />
      <Muncul m={S[2].mulai + 0.2} x={x0} y={262}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 28, color: KD.abu }}>
          film bersuara (1929): <span style={{ fontFamily: ANTON, fontSize: 44, color: KD.tulang }}>24</span> gambar/detik
        </div>
      </Muncul>
      {baris(380, 24, 0, KD.tulang, S[2].mulai + 0.3)}
    </Babak>
  );
};

// S3: 2 still gantian + "?" -------------------------------------------------------------------------------------------------
const B3: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const gantian = Math.floor(t * 4) % 2;
  return (
    <Babak dari={S[3].mulai} sampai={S[4].mulai}>
      <div style={{ position: 'absolute', left: 60, top: 80 }}>
        <Still w={220} h={180} fase={0.1} nomor={1} sorot={gantian === 0} />
      </div>
      <div style={{ position: 'absolute', left: 300, top: 80 }}>
        <Still w={220} h={180} fase={0.35} nomor={2} sorot={gantian === 1} />
      </div>
      <div style={{ position: 'absolute', left: 60, top: 290, fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.abu }}>2 gambar diam, diputar gantian</div>
      <PopT m={T.gerak3 - 0.1} x={720} y={220} damping={8}>
        <div style={{ fontFamily: ANTON, fontSize: 260, lineHeight: 1, color: KD.amber, rotate: `${(Math.sin(t * 3) * 4).toFixed(2)}deg` }}>?</div>
      </PopT>
    </Babak>
  );
};

// S4: Wertheimer 1912 — 2 lampu gantian = gerak semu ---------------------------------------------------------------------------
const Lampu: React.FC<{ x: number; y: number; nyala: number }> = ({ x, y, nyala }) => (
  <div style={{ position: 'absolute', left: x - 50, top: y - 50, width: 100, height: 100, borderRadius: 50, background: nyala > 0.5 ? '#ffe0a8' : '#2c2a31', boxShadow: nyala > 0.5 ? '0 0 60px rgba(255,200,120,0.9)' : 'inset 0 0 0 3px rgba(239,235,226,0.2)' }} />
);
const B4: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const siklus = (t * 1.5) % 1;
  const kiri = siklus < 0.45 ? 1 : 0;
  const kanan = siklus >= 0.5 && siklus < 0.95 ? 1 : 0;
  return (
    <Babak dari={S[4].mulai} sampai={S[5].mulai}>
      <Muncul m={T.th1912 - 0.1} x={40} y={44}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: ANTON, fontSize: 60, color: KD.amber, lineHeight: 1 }}>1912</span>
          <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.tulang, opacity: maju(t, T.max - 0.2, T.max) }}>Max Wertheimer · psikolog</span>
        </div>
      </Muncul>
      <Lampu x={250} y={270} nyala={kiri} />
      <Lampu x={640} y={270} nyala={kanan} />
      <Tag x={208} y={340} teks="muncul" o={1} />
      <Tag x={578} y={340} teks="gantian" o={1} />
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d="M 320 200 Q 445 140 570 200" mulai={T.semu - 0.1} lama={0.4} warna={KD.amber} tebal={7} />
        <path d="M 548 186 L 572 202 L 546 212" stroke={KD.amber} strokeWidth={7} fill="none" strokeLinecap="round" opacity={maju(t, T.semu + 0.25, T.semu + 0.35)} />
      </svg>
      <Chip x={445} y={130} teks="kelihatan gerak" ukuran={26} isi o={maju(t, T.semu + 0.1, T.semu + 0.3)} />
      <Muncul m={T.gantian - 0.1} x={MW / 2} y={420} tengah>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.tulang, whiteSpace: 'nowrap' }}>
          gerak <span style={{ color: KD.amber }}>semu</span>: dari gambar yang muncul gantian
        </div>
      </Muncul>
    </Babak>
  );
};

// S5: beta vs phi ----------------------------------------------------------------------------------------------------------
const B5: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const siklus = (t * 1.2) % 1;
  // beta: titik kelihatan meluncur kiri → kanan
  const bx = 70 + EASE.kamera(Math.min(1, Math.max(0, (siklus - 0.1) / 0.6))) * 260;
  // phi: dua titik kedip gantian, di tengahnya cuma "gerak" (kilasan) tanpa benda
  const kiri = siklus < 0.4 ? 1 : 0.15;
  const kanan = siklus >= 0.5 && siklus < 0.9 ? 1 : 0.15;
  const kilas = siklus >= 0.38 && siklus < 0.55 ? 1 - Math.abs(siklus - 0.465) / 0.085 : 0;
  const oB = maju(t, T.beta - 0.15, T.beta + 0.1);
  const oP = maju(t, T.phi - 0.15, T.phi + 0.1);
  return (
    <Babak dari={S[5].mulai} sampai={S[6].mulai}>
      <div style={{ position: 'absolute', left: 30, top: 50, width: 400, height: 400, borderRadius: 14, background: '#151316', boxShadow: 'inset 0 0 0 2px rgba(199,159,85,0.5)', opacity: oB }}>
        <div style={{ position: 'absolute', left: 24, top: 18, fontFamily: ANTON, fontSize: 54, color: KD.amber }}>BETA</div>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: bx - i * 14, top: 190, width: 56, height: 56, borderRadius: 28, background: KD.tulang, opacity: i === 0 ? 1 : 0.12 * (6 - i) * 0.4 }} />
        ))}
        <div style={{ position: 'absolute', left: 24, top: 300, width: 350, fontFamily: INTER, fontWeight: 800, fontSize: 25, color: KD.tulang, lineHeight: 1.2, opacity: maju(t, T.asli - 0.2, T.asli + 0.1) }}>mirip gerak asli: bendanya kelihatan pindah</div>
      </div>
      <div style={{ position: 'absolute', left: 464, top: 50, width: 400, height: 400, borderRadius: 14, background: '#151316', boxShadow: 'inset 0 0 0 2px rgba(199,159,85,0.5)', opacity: oP }}>
        <div style={{ position: 'absolute', left: 24, top: 18, fontFamily: ANTON, fontSize: 54, color: KD.amber }}>PHI</div>
        <div style={{ position: 'absolute', left: 60, top: 190, width: 56, height: 56, borderRadius: 28, background: KD.tulang, opacity: kiri }} />
        <div style={{ position: 'absolute', left: 284, top: 190, width: 56, height: 56, borderRadius: 28, background: KD.tulang, opacity: kanan }} />
        <div style={{ position: 'absolute', left: 130, top: 206, width: 140, height: 24, borderRadius: 12, background: 'linear-gradient(90deg, rgba(255,180,84,0), rgba(255,180,84,0.85), rgba(255,180,84,0))', opacity: kilas, filter: 'blur(3px)' }} />
        <div style={{ position: 'absolute', left: 24, top: 300, width: 350, fontFamily: INTER, fontWeight: 800, fontSize: 25, color: KD.tulang, lineHeight: 1.2, opacity: maju(t, T.murni - 0.2, T.murni + 0.1) }}>gerak murni: tanpa benda yang kelihatan pindah</div>
      </div>
    </Babak>
  );
};

// S6: kartu persistence of vision dicoret ------------------------------------------------------------------------------------
const B6: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  return (
    <Babak dari={S[6].mulai} sampai={S[7].mulai} latar="#14130f">
      <div style={{ position: 'absolute', left: MW / 2, top: 210 }}>
        <Kertas x={0} y={0} w={620} rot={-2}>
          <div style={LABEL_KERTAS}>PENJELASAN LAMA (ZAMAN FARADAY & PLATEAU)</div>
          <div style={{ ...JUDUL_KERTAS, fontSize: 72, marginTop: 10, color: t > T.ninggalin ? '#8d8576' : KD.latar }}>PERSISTENCE OF VISION</div>
          <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 22, color: '#6b6457', marginTop: 8 }}>anggapan: bayangan gambar nempel sebentar di mata</div>
        </Kertas>
      </div>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d="M 160 222 L 740 196" mulai={T.ninggalin} lama={0.25} warna={KD.koral} tebal={12} />
        <GarisDigambar d="M 160 290 L 700 270" mulai={T.ninggalin + 0.15} lama={0.25} warna={KD.koral} tebal={12} />
      </svg>
      <Chip x={MW / 2} y={420} teks="riset persepsi modern udah ninggalin" ukuran={26} isi o={maju(t, T.modern - 0.1, T.modern + 0.15)} />
    </Babak>
  );
};

// S7: NASA 1983 — sampel vs gerak asli ------------------------------------------------------------------------------------------
const B7: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const gx = 60;
  const gy = 120;
  const gw = 560;
  const gh = 280;
  const f = (u: number) => gy + gh - (0.5 - 0.42 * Math.cos(u * Math.PI * 1.6)) * gh;
  const pAsli = maju(t, T.model - 0.1, T.model + 0.6, EASE.kamera);
  // jumlah sampel naik pelan (rapat → mirip gerak asli)
  const n = Math.round(4 + 20 * maju(t, T.ngitung, S[8].mulai - 0.3, EASE.kamera));
  const d = Array.from({ length: 61 }, (_, i) => `${i ? 'L' : 'M'} ${(gx + (i / 60) * gw).toFixed(1)} ${f(i / 60).toFixed(1)}`).join(' ');
  return (
    <Babak dari={S[7].mulai} sampai={S[8].mulai}>
      <Muncul m={T.th1983 - 0.1} x={gx} y={40}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: ANTON, fontSize: 56, color: KD.amber, lineHeight: 1 }}>1983</span>
          <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.tulang, opacity: maju(t, T.nasa - 0.2, T.nasa) }}>model peneliti NASA</span>
        </div>
      </Muncul>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <path d={`M ${gx} ${gy} V ${gy + gh} H ${gx + gw}`} stroke="rgba(239,235,226,0.3)" strokeWidth={3} fill="none" />
        <GarisDigambar d={d} mulai={T.model - 0.1} lama={0.6} warna={KD.abu} tebal={5} />
        {pAsli > 0.9
          ? Array.from({ length: n }, (_, i) => {
              const u = (i + 0.5) / n;
              return <rect key={i} x={gx + u * gw - gw / n / 2} y={f(u) - 4} width={gw / n - 3} height={8} rx={3} fill={KD.amber} />;
            })
          : null}
      </svg>
      <Tag x={gx + 10} y={gy + gh + 14} teks="garis = gerak asli · balok = gambar diam (sampel)" o={maju(t, T.model + 0.4, T.model + 0.7)} />
      <Muncul m={T.ngitung - 0.1} x={660} y={150}>
        <div style={{ width: 200, padding: '14px 16px', borderRadius: 14, background: KD.panel2, border: `3px solid ${KD.amber}` }}>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 18, letterSpacing: '0.1em', color: KD.abu }}>GAMBAR / DETIK</div>
          <div style={{ fontFamily: ANTON, fontSize: 70, color: KD.amber, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>{t > T.ngitung ? '?' : ''}</div>
          <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 20, color: KD.tulang, lineHeight: 1.15 }}>biar sama kayak gerak asli</div>
        </div>
      </Muncul>
    </Babak>
  );
};

// S8: tergantung kecepatan + detail ---------------------------------------------------------------------------------------------
const Penggeser: React.FC<{ x: number; y: number; w: number; label: string; p: number; o: number }> = ({ x, y, w, label, p, o }) => (
  <div style={{ position: 'absolute', left: x, top: y, opacity: o }}>
    <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.tulang, marginBottom: 12 }}>{label}</div>
    <div style={{ position: 'relative', width: w, height: 12, borderRadius: 6, background: 'rgba(239,235,226,0.15)' }}>
      <div style={{ width: w * p, height: 12, borderRadius: 6, background: KD.amber }} />
      <div style={{ position: 'absolute', left: w * p - 16, top: -10, width: 32, height: 32, borderRadius: 16, background: KD.tulang, boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }} />
    </div>
  </div>
);
const B8: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const pK = 0.15 + 0.75 * maju(t, T.kecepatan, T.kecepatan + 0.8, EASE.kamera);
  const pD = 0.15 + 0.75 * maju(t, T.detail, T.detail + 0.8, EASE.kamera);
  const butuh = (pK + pD) / 2;
  return (
    <Babak dari={S[8].mulai} sampai={S[9].mulai}>
      <Penggeser x={60} y={80} w={420} label="kecepatan gerak" p={pK} o={maju(t, T.kecepatan - 0.2, T.kecepatan)} />
      <Penggeser x={60} y={230} w={420} label="detail gambar" p={pD} o={maju(t, T.detail - 0.2, T.detail)} />
      <div style={{ position: 'absolute', left: 60, top: 360, width: 160, height: 90, borderRadius: 8, overflow: 'hidden', opacity: maju(t, T.detail - 0.2, T.detail), backgroundImage: `repeating-linear-gradient(90deg, ${KD.tulang} 0 ${(18 - pD * 15).toFixed(1)}px, #2a2119 ${(18 - pD * 15).toFixed(1)}px ${(36 - pD * 30).toFixed(1)}px)` }} />
      <div style={{ position: 'absolute', left: 240, top: 372, width: 240, fontFamily: INTER, fontWeight: 700, fontSize: 20, color: KD.abu, opacity: maju(t, T.detail, T.detail + 0.3) }}>makin rapat polanya, makin detail</div>
      {/* meter kebutuhan gambar/detik */}
      <div style={{ position: 'absolute', left: 580, top: 60, width: 240, height: 380, opacity: maju(t, S[8].mulai + 0.1, S[8].mulai + 0.4) }}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 20, letterSpacing: '0.08em', color: KD.abu, textAlign: 'center' }}>GAMBAR/DETIK YANG DIBUTUHIN</div>
        <div style={{ position: 'absolute', left: 80, top: 70, width: 80, height: 290, borderRadius: 12, background: 'rgba(239,235,226,0.08)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 290 * butuh, background: `linear-gradient(0deg, ${KD.amberTua}, ${KD.amber})` }} />
        </div>
        <svg style={{ position: 'absolute', left: 176, top: 120, overflow: 'visible' }} width={1} height={1}>
          <path d="M 0 60 V 0 M -16 18 L 0 0 L 16 18" stroke={KD.amber} strokeWidth={7} fill="none" strokeLinecap="round" opacity={maju(t, T.kecepatan + 0.3, T.kecepatan + 0.5)} />
        </svg>
      </div>
    </Babak>
  );
};

// ======================================================================================================
const Hud: React.FC<{ T: WK }> = ({ T }) => {
  const S = T.s;
  const follow = T.ks('follow', S[9].mulai, S[9].akhir - 1.5);
  return (
    <>
      <JudulKD
        label={['STANDAR', 'FILM', 'BERSUARA']}
        lMulai={0.15}
        judul={[{ t: '24', mulai: 0.28, isi: sorot('24', T.n24) }, { t: 'GAMBAR', mulai: 0.36 }, { t: 'DIAM', mulai: 0.44 }, { t: '/', mulai: 0.5, warna: KD.abu }, { t: 'DETIK', mulai: 0.56 }]}
        jMulai={0.28}
        keluar={S[1].mulai - 0.2}
        catatan="mata ngelihatnya: gerak mulus"
        cMulai={T.mata}
      />
      <JudulKD
        label={['DISETUJUI', 'DI', 'AMERIKA']}
        lMulai={S[1].mulai}
        judul={[{ t: 'SMPE', mulai: T.society }, { t: '·', mulai: T.th1929 - 0.1, warna: KD.abu }, { t: '1929', mulai: T.th1929, isi: sorot('1929', T.th1929 + 0.15) }]}
        jMulai={T.society}
        keluar={S[2].mulai - 0.2}
        catatan="Society of Motion Picture Engineers · film bersuara 35 mm"
        cMulai={T.n35 - 0.3}
      />
      <JudulKD
        label={['SEBELUMNYA']}
        lMulai={S[2].mulai}
        judul={[{ t: 'FILM', mulai: T.bisu - 0.1 }, { t: 'BISU:', mulai: T.bisu }, { t: '16', mulai: T.n16, isi: sorot('16', T.n16 + 0.15) }]}
        jMulai={T.bisu - 0.1}
        keluar={S[3].mulai - 0.2}
        catatan="gambar per detik, gak dipakai ketat"
        cMulai={T.ketat - 0.3}
      />
      <JudulKD
        label={['TERUS']}
        lMulai={S[3].mulai}
        judul={[{ t: 'KOK', mulai: T.kenapa }, { t: 'KELIHATAN', mulai: T.kenapa + 0.2 }, { t: 'GERAK?', mulai: T.gerak3, isi: sorot('GERAK?', T.gerak3 + 0.1) }]}
        jMulai={T.kenapa}
        keluar={S[4].mulai - 0.2}
      />
      <JudulKD
        label={['PSIKOLOG', 'MAX', 'WERTHEIMER']}
        lMulai={S[4].mulai}
        judul={[{ t: '1912', mulai: T.th1912 }, { t: '·', mulai: T.semu - 0.2, warna: KD.abu }, { t: 'GERAK', mulai: T.semu - 0.15 }, { t: 'SEMU', mulai: T.semu, isi: sorot('SEMU', T.semu + 0.15) }]}
        jMulai={T.th1912}
        keluar={S[5].mulai - 0.2}
      />
      <JudulKD
        label={['WERTHEIMER', 'NGEBEDAIN']}
        lMulai={S[5].mulai}
        judul={[
          { t: 'BETA', mulai: T.beta, isi: sorot('BETA', T.beta + 0.1) },
          { t: '≈', mulai: T.asli - 0.3, isi: <KiraInline /> },
          { t: 'GERAK', mulai: T.asli - 0.2 },
          { t: 'ASLI', mulai: T.asli },
          { t: '·', mulai: T.phi - 0.1, warna: KD.abu },
          { t: 'PHI', mulai: T.phi, isi: sorot('PHI', T.phi + 0.1) },
          { t: '=', mulai: T.murni - 0.2, warna: KD.amber },
          { t: 'GERAK', mulai: T.murni - 0.1 },
          { t: 'MURNI', mulai: T.murni },
        ]}
        jMulai={T.beta}
        keluar={S[6].mulai - 0.2}
        ukuran={92}
      />
      <JudulKD
        label={['PENJELASAN', 'LAMA']}
        lMulai={S[6].mulai}
        judul={[{ t: 'PERSISTENCE', mulai: T.persistence, warna: '#a29d92' }, { t: 'OF', mulai: T.persistence + 0.15, warna: '#a29d92' }, { t: 'VISION', mulai: T.persistence + 0.3, warna: '#a29d92' }]}
        jMulai={T.persistence}
        keluar={S[7].mulai - 0.2}
        ukuran={96}
        catatan="udah ditinggal riset persepsi modern"
        cMulai={T.ninggalin}
      />
      <JudulKD
        label={['PENELITI', 'NASA']}
        lMulai={S[7].mulai}
        judul={[{ t: 'NASA', mulai: T.nasa }, { t: '·', mulai: T.nasa + 0.1, warna: KD.abu }, { t: '1983', mulai: T.th1983, isi: sorot('1983', T.nasa + 0.2) }]}
        jMulai={T.th1983}
        keluar={S[8].mulai - 0.2}
        catatan="berapa gambar/detik biar kayak gerak asli?"
        cMulai={T.ngitung}
      />
      <JudulKD
        label={['HASILNYA']}
        lMulai={S[8].mulai}
        judul={[{ t: 'TERGANTUNG', mulai: S[8].mulai + 0.3 }, { t: 'KECEPATAN', mulai: T.kecepatan, isi: sorot('KECEPATAN', T.kecepatan + 0.15) }, { t: '+', mulai: T.detail - 0.2, warna: KD.amber }, { t: 'DETAIL', mulai: T.detail, isi: sorot('DETAIL', T.detail + 0.15) }]}
        jMulai={S[8].mulai + 0.3}
        keluar={S[9].mulai - 0.2}
        ukuran={104}
      />
      <JudulKD
        label={['SIMPAN', 'BUAT', 'BAHAN', 'KONTEN']}
        lMulai={S[9].mulai}
        judul={[{ t: 'SIMPAN', mulai: S[9].mulai + 0.2 }, { t: '·', mulai: S[9].mulai + 0.3, warna: KD.abu }, { t: 'FOLLOW', mulai: follow, isi: sorot('FOLLOW', follow + 0.15) }]}
        jMulai={S[9].mulai + 0.2}
        keluar={T.pulang - 0.15}
      />
    </>
  );
};

void PanahInline;
