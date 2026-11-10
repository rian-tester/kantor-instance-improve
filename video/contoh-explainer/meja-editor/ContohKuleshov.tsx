// Frame hero (pembuka, tengah, puncak): 15, 859, 1432.
// contoh video explainer K4 (akun generik, konten contoh): "Efek Kuleshov: wajah sama, penonton lihat tiga emosi beda".
// Seri "meja editor amber" (panggung.tsx). Wajah aktor = ILUSTRASI (komponen Aktor dari K5, bukan foto/cuplikan film siapa pun);
// sup, peti mati, anak main = gambar vektor. Alur: 3 adegan + tepuk tangan, wajahnya sama (hook) → slate Kuleshov ±100 thn →
// close-up wajah datar + kartu nama → 3 sambungan wajah + gambar → chip tafsiran penonton (catatan Pudovkin) → 3 wajah ditumpuk
// pas = sama persis → rumus efek Kuleshov → rekaman asli hilang → 1992 gak ketemu → 2016 36 orang × 24 potongan, efeknya ada → CTA.
// Fakta: Russell 2005 (FORUM Univ. Edinburgh, kutip Kuleshov & Pudovkin); Calbi dkk. 2017; Barratt dkk. 2016 (Perception 45(8)).
import React, { useMemo } from 'react';
import { useVideoConfig } from 'remotion';
import { AngkaJalan, EASE, GarisDigambar, maju, noise, Stempel, useDetik } from "../../src/gerak";
import { Aktor } from "./ContohKedipan";
import { ANTON, INTER } from "../../src/gerak/seri/meja-editor/font";
import { bunyi, Centang, Chip, JudulKD, KD, Silang, SlateKD, sorot } from "../../src/gerak/seri/meja-editor/seri";
import { Ambang, Babak, dasarWaktu, latarSlate, MH, Muncul, MW, Panggung, PopT, Tag, type DataKD } from "../../src/gerak/seri/meja-editor/panggung";

export type DataK4 = DataKD;

function waktuK4(d: DataKD, total: number) {
  const B = dasarWaktu(d, total);
  const { k, ks, s } = B;
  const sup = k('semangkuk', 3, 2.4);
  return {
    ...B,
    muji: k('muji', 0, 0.6), tiga: k('tiga', 0, 1.9), padahal: k('padahal', 0, 2.8), sama0: k('sama', 0, 3.6),
    soviet: k('soviet', 1, 1.4), lev: k('lev', 1, 1.9), kuleshov1: k('kuleshov', 1, 2.2), seratus: k('seratus', 1, 3),
    closeup: k('close', 2, 0.8), datar: k('datar', 2, 1.7), terkenal: k('terkenal', 2, 2.4), ivan: k('ivan', 2, 3.2),
    disambung: k('disambung', 3, 0.8), sup, peti: ks('peti', sup, s[3].mulai + 3.3), anak: ks('anak', sup, s[3].mulai + 4),
    pudovkin: k('pudovkin', 4, 2.2), mikir: k('mikir', 4, 4), sedih: k('sedih', 4, 5.3), senyum: k('senyum', 4, 6.4),
    sama5: k('sama', 5, 2), persis5: k('persis', 5, 2.4),
    efek6: k('efek', 6, 2), kuleshov6: k('kuleshov', 6, 2.4),
    hilang: k('hilang', 7, 1.1), peneliti: k('peneliti', 7, 1.6), ngulang: k('ngulang', 7, 2.2),
    th1992: k('1992', 8, 0.3), prince: k('prince', 8, 1.3), gak8: k('gak', 8, 2.1), kebanyakan: k('kebanyakan', 8, 3), emosi: k('emosi', 8, 5),
    th2016: k('2016', 9, 0.3), barratt: k('barratt', 9, 1.4), n36: k('36', 9, 1.9), n24: k('24', 9, 2.7), hasilnya: k('hasilnya', 9, 3.6), memang: k('memang', 9, 4.6),
  };
}
type WK = ReturnType<typeof waktuK4>;

export const ContohKuleshov: React.FC<DataK4> = (d) => {
  const { durationInFrames, fps } = useVideoConfig();
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuK4(d, total), [d, total]);
  const S = T.s;
  return (
    <Panggung
      d={d}
      T={T}
      folder="k4"
      labelKlip={['3 adegan', 'Kuleshov', 'close-up', '3 sambungan', 'Pudovkin', 'sama persis', 'efek Kuleshov', 'hilang', '1992', '2016', 'simpan']}
      pembuka={<B0 T={T} />}
      monitor={
        <>
          <B0 T={T} />
          <B1 T={T} />
          <B2 T={T} />
          <B3 T={T} />
          <B5 T={T} />
          <B6 T={T} />
          <B7 T={T} />
          <B8 T={T} />
          <B9 T={T} />
        </>
      }
      hud={<Hud T={T} />}
      sumber={(t) =>
        t < S[7].mulai
          ? 'Sumber: Russell 2005, FORUM Univ. of Edinburgh (catatan Kuleshov & Pudovkin)'
          : t < S[8].mulai
            ? 'Sumber: Barratt dkk., Perception 2016'
            : t < S[9].mulai
              ? 'Sumber: Prince & Hensley 1992, via Calbi dkk. 2017'
              : 'Sumber: Barratt dkk., Perception 45(8), 2016'
      }
      tagMonitor={() => 'ILUSTRASI'}
      getar={[{ t: T.seratus + 0.02, kuat: 8 }, { t: T.kuleshov6 + 0.08, kuat: 9 }]}
      sfx={[
        ...[0, 1, 2].map((i) => bunyi('pop', T.muji + 0.15 + i * 0.15, 0.24)),
        bunyi('kunci', T.sama0 + 0.1, 0.3),
        bunyi('whooshA', S[1].mulai - 0.05, 0.3),
        bunyi('jepret', T.seratus, 0.55),
        bunyi('hantam', T.seratus + 0.02, 0.32),
        bunyi('klik', T.closeup + 0.1, 0.35),
        bunyi('swish', T.ivan - 0.1, 0.25),
        bunyi('pop', T.sup, 0.28),
        bunyi('pop', T.peti, 0.28),
        bunyi('pop', T.anak, 0.28),
        bunyi('tik', T.mikir, 0.3),
        bunyi('tik', T.sedih, 0.3),
        bunyi('tik', T.senyum, 0.3),
        bunyi('whooshLembut', S[5].mulai + 0.1, 0.3),
        bunyi('kunci', T.persis5, 0.35),
        bunyi('hantam', T.kuleshov6 + 0.08, 0.42),
        bunyi('whooshTurun', T.hilang - 0.05, 0.3),
        bunyi('pop', T.ngulang, 0.28),
        bunyi('glitch', T.gak8 + 0.1, 0.28),
        bunyi('pop', T.kebanyakan + 0.2, 0.28),
        ...Array.from({ length: 12 }, (_, i) => bunyi('tik', T.n36 + i * 0.07, 0.1)),
        bunyi('kunci', T.memang + 0.1, 0.4),
      ]}
    />
  );
};

// ======================================================================================================
/** Wajah aktor (ilustrasi) dalam bingkai kecil. */
export const Wajah: React.FC<{ w: number; h: number; seed: string; shot?: string }> = ({ w, h, seed, shot = 'B' }) => (
  <div style={{ position: 'relative', width: w, height: h, borderRadius: 10, overflow: 'hidden', boxShadow: 'inset 0 0 0 2px rgba(199,159,85,0.7)' }}>
    <Aktor W={w} H={h} shot={shot} tutup={0} seed={seed} />
    <div style={{ position: 'absolute', inset: 0, borderRadius: 10, boxShadow: 'inset 0 0 0 3px rgba(199,159,85,0.8)' }} />
  </div>
);

export const Sup: React.FC<{ s?: number }> = ({ s = 1 }) => {
  const t = useDetik();
  return (
    <svg width={140 * s} height={110 * s} viewBox="0 0 140 110">
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${45 + i * 25} 40 q ${8 + Math.sin(t * 3 + i) * 5} -12 0 -22 q ${-8 + Math.sin(t * 3 + i) * 4} -10 0 -18`} stroke="rgba(239,235,226,0.6)" strokeWidth={4} fill="none" strokeLinecap="round" />
      ))}
      <ellipse cx={70} cy={56} rx={58} ry={12} fill="#c9762c" />
      <path d="M 12 56 Q 16 100 70 100 Q 124 100 128 56 Z" fill="#e9e2d3" />
      <path d="M 40 104 H 100" stroke="#b5ab96" strokeWidth={6} strokeLinecap="round" />
    </svg>
  );
};
export const Peti: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg width={140 * s} height={110 * s} viewBox="0 0 140 110">
    <path d="M 54 6 H 86 L 102 30 L 90 104 H 50 L 38 30 Z" fill="#5a3a24" stroke="#2b1b10" strokeWidth={4} />
    <path d="M 70 32 V 78 M 56 46 H 84" stroke="#c79f55" strokeWidth={5} strokeLinecap="round" />
  </svg>
);
export const Anak: React.FC<{ s?: number }> = ({ s = 1 }) => {
  const t = useDetik();
  const lompat = Math.abs(Math.sin(t * 4.5)) * 18;
  return (
    <svg width={140 * s} height={110 * s} viewBox="0 0 140 110">
      <circle cx={58} cy={30} r={13} fill="#e8b98f" />
      <path d="M 58 44 V 72 M 58 52 L 42 62 M 58 52 L 76 46 M 58 72 L 46 96 M 58 72 L 68 96" stroke="#ffb454" strokeWidth={7} strokeLinecap="round" />
      <circle cx={98} cy={88 - lompat} r={11} fill="#ff6b57" />
      <path d="M 20 102 H 124" stroke="rgba(239,235,226,0.3)" strokeWidth={3} />
    </svg>
  );
};
const BENDA = [
  { nama: 'semangkuk sup', Ikon: Sup, tafsir: 'mikir berat' },
  { nama: 'peti mati', Ikon: Peti, tafsir: 'sedih' },
  { nama: 'anak kecil main', Ikon: Anak, tafsir: 'senyum' },
];

// S0 (pembuka): 3 adegan, penonton muji, wajahnya sama ------------------------------------------------------------
const B0: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const fw = 250;
  const fh = 190;
  const xs = [40, 322, 604];
  return (
    <Babak dari={0} sampai={S[1].mulai} tanpaSapu latar="#0f0e12">
      {xs.map((x, i) => (
        <React.Fragment key={i}>
          <div style={{ position: 'absolute', left: x, top: 150 }}>
            <Ambang seed={`w0${i}`} kuat={0.6}>
              <div style={{ position: 'relative' }}>
                <Wajah w={fw} h={fh} seed={`w0${i}`} />
              </div>
            </Ambang>
          </div>
          <div style={{ position: 'absolute', left: x, top: 356, width: fw, textAlign: 'center', fontFamily: INTER, fontWeight: 800, fontSize: 24, color: KD.abu }}>adegan {i + 1}</div>
          {/* bintang pujian */}
          <PopT m={T.muji + 0.15 + i * 0.15} x={x + fw / 2} y={110}>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0, 1, 2, 3, 4].map((j) => (
                <svg key={j} width={30} height={30} viewBox="0 0 80 80">
                  <path d="M 40 6 L 49 30 L 74 31 L 54 46 L 61 72 L 40 57 L 19 72 L 26 46 L 6 31 L 31 30 Z" fill={KD.amber} />
                </svg>
              ))}
            </div>
          </PopT>
        </React.Fragment>
      ))}
      {[0, 1].map((i) => (
        <div key={i} style={{ position: 'absolute', left: xs[i] + fw + 2, top: 214, width: 28, textAlign: 'center', fontFamily: ANTON, fontSize: 56, color: KD.amber, opacity: maju(t, T.sama0 - 0.1 + i * 0.12, T.sama0 + 0.1 + i * 0.12) }}>=</div>
      ))}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d={`M 40 412 V 430 H ${604 + fw} V 412`} mulai={T.padahal} lama={0.35} warna={KD.amber} tebal={5} />
      </svg>
      <Chip x={MW / 2} y={456} teks="wajahnya sama persis" ukuran={28} isi o={maju(t, T.sama0, T.sama0 + 0.2)} />
    </Babak>
  );
};

// S1: slate Kuleshov -----------------------------------------------------------------------------------------------
const B1: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  return (
    <Babak dari={S[1].mulai} sampai={S[2].mulai}>
      {latarSlate(maju(t, S[1].mulai - 0.1, S[1].mulai + 0.2))}
      <SlateKD
        x={MW / 2}
        y={MH / 2 + 4}
        w={560}
        masuk={S[1].mulai - 0.05}
        tepuk={T.seratus}
        keluar={S[2].mulai + 0.3}
        baris={[
          { label: 'SUTRADARA', isi: 'Lev Kuleshov', mulai: T.lev - 0.05 },
          { label: 'NEGARA', isi: 'Uni Soviet', mulai: T.soviet - 0.05 },
          { label: 'WAKTU', isi: '±100 tahun lalu', mulai: T.seratus - 0.05, warna: KD.amber },
        ]}
      />
    </Babak>
  );
};

// S2: close-up wajah datar + kartu nama ---------------------------------------------------------------------------
const B2: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const b = maju(t, T.closeup - 0.05, T.closeup + 0.3, EASE.kamera);
  const sudut = (x: number, y: number, sx: number, sy: number) => `M ${x} ${y + sy * 50} V ${y} H ${x + sx * 50}`;
  const m = 40 - b * 12;
  return (
    <Babak dari={S[2].mulai} sampai={S[3].mulai}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <Aktor W={MW} H={MH} shot="B" tutup={0} seed="b2" />
      </div>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: b }} width={1} height={1}>
        <path d={sudut(m, m, 1, 1)} stroke={KD.amber} strokeWidth={6} fill="none" />
        <path d={sudut(MW - m, m, -1, 1)} stroke={KD.amber} strokeWidth={6} fill="none" />
        <path d={sudut(m, MH - m, 1, -1)} stroke={KD.amber} strokeWidth={6} fill="none" />
        <path d={sudut(MW - m, MH - m, -1, -1)} stroke={KD.amber} strokeWidth={6} fill="none" />
      </svg>
      <Chip x={MW - 170} y={60} teks="close-up · wajah datar" ukuran={24} o={maju(t, T.datar - 0.1, T.datar + 0.15)} />
      <Muncul m={T.ivan - 0.15} x={30} y={MH - 140} dy={0}>
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          <div style={{ width: 8, background: KD.amber, borderRadius: 4 }} />
          <div style={{ padding: '10px 22px 12px', background: 'rgba(11,11,14,0.9)', borderRadius: '0 12px 12px 0' }}>
            <div style={{ fontFamily: ANTON, fontSize: 50, lineHeight: 1, color: KD.tulang }}>IVAN MOZZHUKHIN</div>
            <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 24, color: KD.amber, marginTop: 6 }}>aktor terkenal Rusia · gambar ilustrasi</div>
          </div>
        </div>
      </Muncul>
    </Babak>
  );
};

// S3–S4: 3 sambungan wajah + gambar, lalu tafsiran penonton -------------------------------------------------------------
const B3: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const mBaris = [T.sup, T.peti, T.anak];
  const mTafsir = [T.mikir, T.sedih, T.senyum];
  return (
    <Babak dari={S[3].mulai} sampai={S[5].mulai} zoom={0.02}>
      <Tag x={40} y={52} teks="SAMBUNGAN DI TIMELINE KULESHOV" o={maju(t, S[3].mulai + 0.1, S[3].mulai + 0.4)} />
      <Tag x={540} y={52} teks="KATA PENONTON (PUDOVKIN)" o={maju(t, T.pudovkin - 0.1, T.pudovkin + 0.2)} warna={KD.amber} />
      {BENDA.map((bd, i) => {
        const y = 92 + i * 136;
        const m = mBaris[i] - 0.15;
        const o = maju(t, Math.min(m, T.disambung + 0.1 + i * 0.2), Math.min(m, T.disambung + 0.1 + i * 0.2) + 0.25);
        const ob = maju(t, m, m + 0.25);
        const aktif = t > mTafsir[i] - 0.1 && t < (mTafsir[i + 1] ?? S[5].mulai) - 0.1;
        return (
          <div key={i} style={{ position: 'absolute', left: 40, top: y, opacity: o, display: 'flex', alignItems: 'center', gap: 0 }}>
            <Wajah w={160} h={120} seed={`b3${i}`} />
            <div style={{ width: 26, height: 6, background: KD.amber }} />
            <div style={{ width: 160, height: 120, borderRadius: 10, background: '#1c1a1f', boxShadow: 'inset 0 0 0 3px rgba(199,159,85,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: ob }}>
              <bd.Ikon s={0.9} />
            </div>
            <div style={{ marginLeft: 18, width: 150, fontFamily: INTER, fontWeight: 800, fontSize: 22, color: KD.abu, opacity: ob, lineHeight: 1.15 }}>{bd.nama}</div>
            <div style={{ marginLeft: 20, opacity: maju(t, mTafsir[i] - 0.1, mTafsir[i] + 0.1), scale: String(aktif ? 1.06 : 1) }}>
              <div style={{ padding: '8px 18px', borderRadius: 14, background: aktif ? KD.amber : 'rgba(11,11,14,0.9)', border: `3px solid ${KD.amber}`, fontFamily: INTER, fontWeight: 800, fontSize: 30, color: aktif ? KD.latar : KD.amber, whiteSpace: 'nowrap' }}>{bd.tafsir}</div>
            </div>
          </div>
        );
      })}
    </Babak>
  );
};

// S5: 3 wajah digeser & ditumpuk pas → sama persis --------------------------------------------------------------------
const B5: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const p = maju(t, S[5].mulai + 0.25, T.sama5 + 0.1, EASE.kamera);
  const fw = 250;
  const fh = 190;
  const xs = [80, 322, 564];
  return (
    <Babak dari={S[5].mulai} sampai={S[6].mulai}>
      {xs.map((x, i) => {
        const xx = x + (322 - x) * p;
        return (
          <div key={i} style={{ position: 'absolute', left: xx, top: 120 + (1 - p) * (i === 1 ? -10 : 10), opacity: i === 1 ? 1 : 1 - maju(p, 0.92, 1) * 0.2 }}>
            <Wajah w={fw} h={fh} seed={`b5${i}`} />
            <div style={{ position: 'absolute', left: 0, top: fh + 10, width: fw, textAlign: 'center', fontFamily: INTER, fontWeight: 800, fontSize: 22, color: KD.abu, opacity: 1 - p }}>{BENDA[i].tafsir}?</div>
          </div>
        );
      })}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <rect x={316} y={114} width={262} height={202} rx={14} fill="none" stroke={KD.amber} strokeWidth={6} opacity={maju(t, T.persis5 - 0.1, T.persis5 + 0.1)} />
      </svg>
      <Centang x={640} y={215} s={70} mulai={T.persis5} tebal={11} />
      <Chip x={MW / 2} y={400} teks="3 wajah ditumpuk: pas, sama persis" ukuran={28} isi o={maju(t, T.persis5 + 0.1, T.persis5 + 0.3)} />
    </Babak>
  );
};

// S6: rumus efek Kuleshov ---------------------------------------------------------------------------------------------
const B6: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const dur = Math.max(0.1, S[7].mulai - S[6].mulai);
  const i = Math.min(2, Math.floor(((t - S[6].mulai) / dur) * 3 + 0.0001));
  const ii = Math.max(0, i);
  const Ik = BENDA[ii].Ikon;
  return (
    <Babak dari={S[6].mulai} sampai={S[7].mulai}>
      <div style={{ position: 'absolute', left: 40, top: 90, display: 'flex', alignItems: 'center', gap: 18 }}>
        <Wajah w={190} h={150} seed="b6" />
        <div style={{ fontFamily: ANTON, fontSize: 70, color: KD.amber }}>+</div>
        <div style={{ width: 190, height: 150, borderRadius: 10, background: '#1c1a1f', boxShadow: 'inset 0 0 0 3px rgba(199,159,85,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Ik s={1.1} />
        </div>
        <div style={{ fontFamily: ANTON, fontSize: 70, color: KD.amber }}>=</div>
        <div style={{ padding: '10px 20px', borderRadius: 14, background: KD.amber, fontFamily: INTER, fontWeight: 800, fontSize: 30, color: KD.latar, whiteSpace: 'nowrap' }}>{BENDA[ii].tafsir}</div>
      </div>
      <Stempel mulai={T.kuleshov6} rot={-6} gaya={{ position: 'absolute', left: 190, top: 300 }}>
        <div style={{ padding: '6px 26px', border: `7px solid ${KD.amber}`, borderRadius: 14, fontFamily: ANTON, fontSize: 80, color: KD.amber, background: 'rgba(14,13,16,0.85)', whiteSpace: 'nowrap' }}>EFEK KULESHOV</div>
      </Stempel>
    </Babak>
  );
};

// S7: rekaman asli hilang → peneliti ngulang -------------------------------------------------------------------------
const B7: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const hancur = maju(t, T.hilang, T.hilang + 0.9, EASE.linear);
  const putar = (t - S[7].mulai) * 40;
  return (
    <Babak dari={S[7].mulai} sampai={S[8].mulai}>
      {/* gulungan film yang buyar jadi debu */}
      <div style={{ position: 'absolute', left: 90, top: 80, width: 300, height: 300, opacity: 1 - hancur, filter: `blur(${(hancur * 6).toFixed(2)}px)` }}>
        <svg width={300} height={300} viewBox="0 0 300 300" style={{ rotate: `${putar.toFixed(1)}deg` }}>
          <circle cx={150} cy={150} r={140} fill="#2b2620" stroke={KD.emas} strokeWidth={8} />
          {[0, 1, 2, 3, 4].map((j) => {
            const a = (j / 5) * Math.PI * 2;
            return <circle key={j} cx={150 + Math.cos(a) * 80} cy={150 + Math.sin(a) * 80} r={34} fill="#0e0d10" />;
          })}
          <circle cx={150} cy={150} r={22} fill={KD.emas} />
        </svg>
      </div>
      {Array.from({ length: 40 }, (_, j) => {
        if (hancur <= 0) return null;
        const a = noise(`dx${j}`, 3) * Math.PI;
        const r = hancur * (80 + (j % 7) * 30);
        return <div key={j} style={{ position: 'absolute', left: 240 + Math.cos(a + j) * r, top: 230 + Math.sin(a + j) * r * 0.6 - hancur * 60, width: 6, height: 6, borderRadius: 3, background: KD.emas, opacity: 1 - hancur }} />;
      })}
      <Muncul m={S[7].mulai + 0.2} x={130} y={400}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.tulang }}>rekaman asli Kuleshov</div>
      </Muncul>
      <PopT m={T.hilang + 0.2} x={240} y={240}>
        <div style={{ padding: '6px 22px', border: `6px solid ${KD.koral}`, borderRadius: 14, fontFamily: ANTON, fontSize: 64, color: KD.koral, rotate: '-6deg', background: 'rgba(14,13,16,0.8)' }}>HILANG</div>
      </PopT>
      {/* peneliti ngulang: papan klip + panah putar */}
      <Muncul m={T.peneliti - 0.1} x={540} y={90}>
        <div style={{ width: 280, height: 320, borderRadius: 14, background: '#e9e2d3', padding: '40px 24px 20px', boxSizing: 'border-box', rotate: '2deg', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
          <div style={{ position: 'absolute', left: 90, top: -14, width: 100, height: 34, borderRadius: 8, background: KD.emas }} />
          <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 18, letterSpacing: '0.12em', color: '#6b6457' }}>UJI ULANG</div>
          {['wajah datar', '+ gambar lain', 'tanya penonton'].map((x, j) => (
            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18, opacity: maju(t, T.ngulang + j * 0.2, T.ngulang + 0.2 + j * 0.2) }}>
              <div style={{ width: 22, height: 22, borderRadius: 5, border: '3px solid #6b6457' }} />
              <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 24, color: KD.latar }}>{x}</div>
            </div>
          ))}
        </div>
      </Muncul>
    </Babak>
  );
};

// S8: 1992 Prince & Hensley — kebanyakan pilih "gak ada emosi" ----------------------------------------------------------
const PILIHAN = ['lapar', 'sedih', 'senang', 'gak ada emosi'];
const B8: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  return (
    <Babak dari={S[8].mulai} sampai={S[9].mulai}>
      <div style={{ position: 'absolute', left: 40, top: 60, fontFamily: ANTON, fontSize: 64, color: KD.amber, opacity: maju(t, T.th1992 - 0.1, T.th1992 + 0.15) }}>1992</div>
      <div style={{ position: 'absolute', left: 190, top: 76, fontFamily: INTER, fontWeight: 800, fontSize: 28, color: KD.tulang, opacity: maju(t, T.prince - 0.1, T.prince + 0.15) }}>percobaan Prince &amp; Hensley</div>
      <div style={{ position: 'absolute', left: 40, top: 170 }}>
        <Wajah w={220} h={170} seed="b8" />
        <div style={{ marginTop: 10, fontFamily: INTER, fontWeight: 700, fontSize: 20, color: KD.abu }}>emosinya apa?</div>
      </div>
      {PILIHAN.map((p, i) => {
        const terakhir = i === PILIHAN.length - 1;
        const nyala = terakhir && t > T.kebanyakan;
        return (
          <div key={i} style={{ position: 'absolute', left: 330, top: 160 + i * 66, opacity: maju(t, S[8].mulai + 0.4 + i * 0.12, S[8].mulai + 0.6 + i * 0.12) }}>
            <div style={{ padding: '6px 18px', borderRadius: 12, border: `3px solid ${nyala ? KD.amber : 'rgba(239,235,226,0.3)'}`, background: nyala ? KD.amber : 'rgba(11,11,14,0.8)', fontFamily: INTER, fontWeight: 800, fontSize: 28, color: nyala ? KD.latar : KD.tulang, whiteSpace: 'nowrap' }}>{p}</div>
          </div>
        );
      })}
      {/* peserta nunjuk ke "gak ada emosi" */}
      {Array.from({ length: 9 }, (_, i) => {
        const m = T.kebanyakan + i * 0.06;
        const o = maju(t, m, m + 0.2);
        const x = 640 + (i % 3) * 64;
        const y = 330 + Math.floor(i / 3) * 46 - 120;
        return <div key={i} style={{ position: 'absolute', left: x, top: y, opacity: o, translate: `${((1 - o) * 30).toFixed(1)}px 0` }}><Orang2 /></div>;
      })}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d="M 630 300 Q 600 360 560 372" mulai={T.kebanyakan + 0.5} lama={0.25} warna={KD.amber} tebal={6} />
      </svg>
      <Tag x={636} y={350} teks="kebanyakan peserta" o={maju(t, T.kebanyakan + 0.3, T.kebanyakan + 0.5)} warna={KD.amber} />
      <div style={{ position: 'absolute', left: 620, top: 410, padding: '6px 16px', borderRadius: 12, border: `3px solid ${KD.koral}`, fontFamily: INTER, fontWeight: 800, fontSize: 24, color: KD.tulang, opacity: maju(t, T.gak8 - 0.1, T.gak8 + 0.1), whiteSpace: 'nowrap' }}>efek Kuleshov?</div>
      <Silang x={705} y={430} s={56} mulai={T.gak8 + 0.1} tebal={9} />
    </Babak>
  );
};
const Orang2: React.FC = () => (
  <svg width={40} height={44} viewBox="0 0 40 60">
    <circle cx={20} cy={12} r={10} fill={KD.abu} />
    <path d="M 2 58 Q 2 26 20 26 Q 38 26 38 58 Z" fill={KD.abu} />
  </svg>
);

// S9: 2016 Barratt — 36 orang × 24 potongan film, efeknya ada -----------------------------------------------------------
const B9: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const p36 = maju(t, T.n36 - 0.1, T.n36 + 0.9, EASE.linear);
  const p24 = maju(t, T.n24 - 0.1, T.n24 + 0.8, EASE.linear);
  const n36 = Math.floor(p36 * 36 + 1e-6);
  const n24 = Math.floor(p24 * 24 + 1e-6);
  return (
    <Babak dari={S[9].mulai} sampai={S[10].mulai}>
      <div style={{ position: 'absolute', left: 40, top: 46, fontFamily: ANTON, fontSize: 56, color: KD.amber, opacity: maju(t, T.th2016 - 0.1, T.th2016 + 0.15) }}>2016</div>
      <div style={{ position: 'absolute', left: 170, top: 58, fontFamily: INTER, fontWeight: 800, fontSize: 28, color: KD.tulang, opacity: maju(t, T.barratt - 0.3, T.barratt) }}>tim Daniel Barratt</div>
      {/* 36 orang */}
      <div style={{ position: 'absolute', left: 40, top: 140, width: 330 }}>
        {Array.from({ length: 36 }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: (i % 6) * 54, top: Math.floor(i / 6) * 44, opacity: i < n36 ? 1 : 0.12 }}>
            <svg width={34} height={38} viewBox="0 0 40 60">
              <circle cx={20} cy={12} r={10} fill={i < n36 ? KD.tulang : KD.abu} />
              <path d="M 2 58 Q 2 26 20 26 Q 38 26 38 58 Z" fill={i < n36 ? KD.tulang : KD.abu} />
            </svg>
          </div>
        ))}
        <div style={{ position: 'absolute', left: 0, top: 272, fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.tulang, whiteSpace: 'nowrap' }}>
          <AngkaJalan dari={0} ke={36} progress={p36} lantai gaya={{ fontFamily: ANTON, fontSize: 44, color: KD.amber }} /> orang
        </div>
      </div>
      <div style={{ position: 'absolute', left: 404, top: 220, fontFamily: ANTON, fontSize: 60, color: KD.abu, opacity: maju(t, T.n24 - 0.2, T.n24) }}>×</div>
      {/* 24 potongan film */}
      <div style={{ position: 'absolute', left: 470, top: 140, width: 390 }}>
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: (i % 6) * 62, top: Math.floor(i / 6) * 62, width: 54, height: 50, borderRadius: 6, background: i < n24 ? '#3a2c1f' : 'rgba(239,235,226,0.05)', boxShadow: i < n24 ? 'inset 0 0 0 2px rgba(199,159,85,0.8)' : 'none' }}>
            {i < n24 ? <div style={{ position: 'absolute', left: 19, top: 15, width: 0, height: 0, borderLeft: '16px solid rgba(255,180,84,0.85)', borderTop: '10px solid transparent', borderBottom: '10px solid transparent' }} /> : null}
          </div>
        ))}
        <div style={{ position: 'absolute', left: 0, top: 272, fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.tulang, whiteSpace: 'nowrap' }}>
          <AngkaJalan dari={0} ke={24} progress={p24} lantai gaya={{ fontFamily: ANTON, fontSize: 44, color: KD.amber }} /> potongan film
        </div>
      </div>
      <PopT m={T.memang} x={MW / 2} y={455}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 22px', borderRadius: 14, background: KD.amber, fontFamily: INTER, fontWeight: 800, fontSize: 30, color: KD.latar, whiteSpace: 'nowrap' }}>efek semacam ini memang ada</div>
      </PopT>
    </Babak>
  );
};

// ======================================================================================================
const Hud: React.FC<{ T: WK }> = ({ T }) => {
  const S = T.s;
  const follow = T.ks('follow', S[10].mulai, S[10].akhir - 1.5);
  return (
    <>
      <JudulKD
        label={['PENONTON', 'MUJI', 'AKTINGNYA']}
        lMulai={0.15}
        judul={[{ t: 'WAJAH', mulai: 0.28 }, { t: 'SAMA', mulai: 0.36, isi: sorot('SAMA', T.sama0) }, { t: '·', mulai: 0.42, warna: KD.abu }, { t: '3', mulai: 0.48 }, { t: 'EMOSI', mulai: 0.54 }]}
        jMulai={0.28}
        keluar={S[1].mulai - 0.2}
      />
      <JudulKD
        label={['EKSPERIMEN', 'SUTRADARA', 'SOVIET']}
        lMulai={S[1].mulai}
        judul={[{ t: 'LEV', mulai: T.lev }, { t: 'KULESHOV', mulai: T.kuleshov1, isi: sorot('KULESHOV', T.kuleshov1 + 0.2) }]}
        jMulai={T.lev}
        keluar={S[2].mulai - 0.2}
        catatan="±100 tahun lalu"
        cMulai={T.seratus}
      />
      <JudulKD
        label={['AKTOR', 'RUSIA', 'IVAN', 'MOZZHUKHIN']}
        lMulai={S[2].mulai}
        judul={[{ t: 'CLOSE-UP', mulai: T.closeup }, { t: 'WAJAH', mulai: T.datar - 0.2 }, { t: 'DATAR', mulai: T.datar, isi: sorot('DATAR', T.datar + 0.15) }]}
        jMulai={T.closeup}
        keluar={S[3].mulai - 0.2}
      />
      <JudulKD
        label={['WAJAH', 'SAMA', 'DISAMBUNG', 'KE']}
        lMulai={S[3].mulai}
        judul={[{ t: 'SUP', mulai: T.sup }, { t: '·', mulai: T.peti - 0.1, warna: KD.abu }, { t: 'PETI', mulai: T.peti }, { t: 'MATI', mulai: T.peti + 0.1 }, { t: '·', mulai: T.anak - 0.1, warna: KD.abu }, { t: 'ANAK', mulai: T.anak }, { t: 'KECIL', mulai: T.anak + 0.1 }]}
        jMulai={T.sup}
        keluar={S[4].mulai - 0.2}
        ukuran={104}
      />
      <JudulKD
        label={['CATATAN', 'VSEVOLOD', 'PUDOVKIN']}
        lMulai={S[4].mulai}
        judul={[{ t: 'MIKIR', mulai: T.mikir }, { t: '·', mulai: T.sedih - 0.1, warna: KD.abu }, { t: 'SEDIH', mulai: T.sedih }, { t: '·', mulai: T.senyum - 0.1, warna: KD.abu }, { t: 'SENYUM', mulai: T.senyum, isi: sorot('SENYUM', T.senyum + 0.15) }]}
        jMulai={T.mikir}
        keluar={S[5].mulai - 0.2}
      />
      <JudulKD
        label={['PADAHAL']}
        lMulai={S[5].mulai}
        judul={[{ t: 'WAJAHNYA', mulai: S[5].mulai + 0.3 }, { t: 'SAMA', mulai: T.sama5 }, { t: 'PERSIS', mulai: T.persis5, isi: sorot('PERSIS', T.persis5 + 0.1) }]}
        jMulai={S[5].mulai + 0.3}
        keluar={S[6].mulai - 0.2}
      />
      <JudulKD
        label={['SEKARANG', 'DIKENAL', 'SEBAGAI']}
        lMulai={S[6].mulai}
        judul={[{ t: 'EFEK', mulai: T.efek6 }, { t: 'KULESHOV', mulai: T.kuleshov6, isi: sorot('KULESHOV', T.kuleshov6 + 0.15) }]}
        jMulai={T.efek6}
        keluar={S[7].mulai - 0.2}
      />
      <JudulKD
        label={['PENELITI', 'NYOBA', 'NGULANG']}
        lMulai={S[7].mulai}
        judul={[{ t: 'REKAMAN', mulai: S[7].mulai + 0.2 }, { t: 'ASLI', mulai: S[7].mulai + 0.35 }, { t: 'HILANG', mulai: T.hilang, isi: sorot('HILANG', T.hilang + 0.15, KD.koral) }]}
        jMulai={S[7].mulai + 0.2}
        keluar={S[8].mulai - 0.2}
      />
      <JudulKD
        label={['PRINCE', '&', 'HENSLEY']}
        lMulai={S[8].mulai}
        judul={[{ t: '1992:', mulai: T.th1992 }, { t: 'EFEKNYA', mulai: T.gak8 - 0.3 }, { t: 'GAK', mulai: T.gak8, isi: sorot('GAK', T.gak8 + 0.1, KD.koral) }, { t: 'KETEMU', mulai: T.gak8 + 0.15 }]}
        jMulai={T.th1992}
        keluar={S[9].mulai - 0.2}
        catatan="kebanyakan peserta: wajahnya gak nunjukin emosi"
        cMulai={T.kebanyakan}
      />
      <JudulKD
        label={['TIM', 'DANIEL', 'BARRATT']}
        lMulai={S[9].mulai}
        judul={[{ t: '2016:', mulai: T.th2016 }, { t: '36', mulai: T.n36 }, { t: 'ORANG', mulai: T.n36 + 0.1 }, { t: '·', mulai: T.hasilnya, warna: KD.abu }, { t: 'EFEKNYA', mulai: T.hasilnya + 0.1 }, { t: 'ADA', mulai: T.memang, isi: sorot('ADA', T.memang + 0.1) }]}
        jMulai={T.th2016}
        keluar={S[10].mulai - 0.2}
        ukuran={104}
      />
      <JudulKD
        label={['SIMPAN', 'BUAT', 'BAHAN', 'NGEDIT']}
        lMulai={S[10].mulai}
        judul={[{ t: 'SIMPAN', mulai: S[10].mulai + 0.2 }, { t: '·', mulai: S[10].mulai + 0.3, warna: KD.abu }, { t: 'FOLLOW', mulai: follow, isi: sorot('FOLLOW', follow + 0.15) }]}
        jMulai={S[10].mulai + 0.2}
        keluar={T.pulang - 0.15}
      />
    </>
  );
};
