// Frame hero (pembuka, tengah, puncak): 15, 859, 1432.
// contoh video explainer K2 (akun generik, konten contoh): "Attention span 8 detik, kalah sama ikan mas? Angkanya gak
// punya sumber riset". Seri "meja editor amber" (panggung.tsx). Alur: kartu viral 8 DETIK + akuarium (hook, stempel SUMBER?)
// → batang 12 → 8 dtk vs ikan mas 9 → slate BBC 2017 → jejak kutipan media → laporan Microsoft Kanada 2015 → catatan kaki
// Statistic Brain → 2 sumber, 0 riset → kutipan Gemma Briggs + tugas beda → ikan mas di lab belajar → stempel GAK ADA BUKTI → CTA.
// Fakta: BBC News, Simon Maybin "Busting the attention span myth" (10/03/2017). Semua gambar = ilustrasi.
import React, { useMemo } from 'react';
import { useVideoConfig } from 'remotion';
import { GarisDigambar, maju, noise, Stempel, useDetik, EASE, pegas } from "../../src/gerak";
import { ANTON, INTER, MONO } from "../../src/gerak/seri/meja-editor/font";
import { bunyi, Centang, Chip, JudulKD, KD, PanahInline, pathKotak, Silang, SlateKD, sorot } from "../../src/gerak/seri/meja-editor/seri";
import {
  Ambang, Babak, Batang, dasarWaktu, JUDUL_KERTAS, Kertas, LABEL_KERTAS, latarSlate, MH, Muncul, MW, Panggung, PopT, Tag, type DataKD, type WaktuDasar,
} from "../../src/gerak/seri/meja-editor/panggung";

export type DataK2 = DataKD;
const IKAN = '#ff8a3d';

function waktuK2(d: DataKD, total: number) {
  const B = dasarWaktu(d, total);
  const { k, ks, s } = B;
  const n8 = k('8', 0, 1.4);
  const n12 = k('12', 1, 1.6);
  const jadi = k('jadi', 1, 3.2);
  const n8b = ks('8', jadi, s[1].mulai + 3.5);
  const n9 = k('9', 1, 5);
  return {
    ...B,
    n8, ikan0: ks('ikan', n8, n8 + 0.8), sumber0: k('sumber', 0, 3.4),
    n12, th2000: k('2000', 1, 2.4), jadi, n8b, n9,
    th2017: k('2017', 2, 0.4), simon: k('simon', 2, 1.1), bbc: k('bbc', 2, 2), nelusurin: k('nelusurin', 2, 2.5),
    kutipan: k('kutipan', 3, 0.4), ujungnya: k('ujungnya', 3, 1.4), laporan: k('laporan', 3, 2.1), th2015: k('2015', 3, 3.6),
    bukan: k('bukan', 4, 1.6), ngutip: k('ngutip', 4, 3.1), statistic: k('statistic', 4, 4),
    dua: k('dua', 5, 1.3), duadua: k('duadua', 5, 2.4), riset5: ks('riset', k('duadua', 5, 2.4), s[5].mulai + 3.4),
    gemma: k('gemma', 6, 0.6), hampir: k('hampir', 6, 3.4), artinya: k('artinya', 6, 4.1), tergantung: k('tergantung', 6, 4.8),
    pelupa: k('pelupa', 7, 1.4), dipakai: k('dipakai', 7, 2.6), belajar: k('belajar', 7, 3.8), memori: k('memori', 7, 4.3),
    bukti: k('bukti', 8, 1.3), pendek: k('pendek', 8, 3.1),
  };
}
type WK = ReturnType<typeof waktuK2>;

export const ContohMitos8Detik: React.FC<DataK2> = (d) => {
  const { durationInFrames, fps } = useVideoConfig();
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuK2(d, total), [d, total]);
  const S = T.s;
  return (
    <Panggung
      d={d}
      T={T}
      folder="k2"
      labelKlip={['klaim 8 dtk', '12 → 8 dtk', 'BBC 2017', 'Microsoft 2015', 'Statistic Brain', '2 sumber', 'Gemma Briggs', 'ikan mas', 'kesimpulan', 'simpan']}
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
        t < S[2].mulai
          ? 'Klaim yang ditelusuri: BBC News, 10/03/2017'
          : t < S[6].mulai
            ? 'Sumber: BBC News, Simon Maybin (10/03/2017)'
            : t < S[7].mulai
              ? 'Sumber: BBC News 2017 · Gemma Briggs, Open University'
              : t < S[8].mulai
                ? 'Sumber: BBC News 2017 · Prof Felicity Huntingford'
                : 'Sumber: BBC News, Simon Maybin (10/03/2017)'
      }
      tagMonitor={(t) => (t < S[2].mulai || t > T.pulang ? 'KLAIM VIRAL' : 'ILUSTRASI')}
      getar={[{ t: T.sumber0 + 0.08, kuat: 8 }, { t: T.bbc + 0.02, kuat: 8 }, { t: T.bukti + 0.08, kuat: 9 }]}
      sfx={[
        bunyi('pop', Math.max(0.3, T.n8), 0.32),
        bunyi('hantam', T.sumber0 + 0.08, 0.38),
        bunyi('tik', T.n12, 0.3),
        bunyi('whooshTurun', T.n8b - 0.05, 0.28),
        bunyi('pop', T.n9, 0.3),
        bunyi('whooshA', S[2].mulai - 0.05, 0.3),
        bunyi('jepret', T.bbc, 0.55),
        bunyi('hantam', T.bbc + 0.02, 0.32),
        ...[0, 1, 2, 3, 4, 5].map((i) => bunyi('tik', T.kutipan + i * 0.12, 0.18)),
        bunyi('whooshLembut', T.ujungnya, 0.25),
        bunyi('pop', T.laporan, 0.3),
        bunyi('glitch', T.bukan + 0.1, 0.28),
        bunyi('klik', T.ngutip, 0.35),
        bunyi('kunci', T.statistic + 0.1, 0.35),
        bunyi('pop', T.dua, 0.28),
        bunyi('glitch', T.duadua + 0.3, 0.25),
        bunyi('glitch', T.duadua + 0.65, 0.25),
        bunyi('whooshLembut', T.tergantung - 0.2, 0.25),
        bunyi('glitch', T.pelupa, 0.25),
        bunyi('pop', T.belajar, 0.28),
        bunyi('pop', T.memori, 0.28),
        bunyi('hantam', T.bukti + 0.08, 0.42),
      ]}
    />
  );
};

// ======================================================================================================
export const IkanMas: React.FC<{ x: number; y: number; s?: number; arah?: number; seed?: string }> = ({ x, y, s = 1, arah = 1, seed = 'ik' }) => {
  const t = useDetik();
  const kibas = Math.sin(t * 9 + seed.length) * 14;
  return (
    <svg style={{ position: 'absolute', left: x - 70 * s, top: y - 45 * s, overflow: 'visible' }} width={140 * s} height={90 * s} viewBox="-70 -45 140 90">
      <g transform={`scale(${arah} 1)`}>
        <path d={`M -38 0 L -66 ${-26 + kibas * 0.4} Q -58 0 -66 ${26 + kibas * 0.4} Z`} fill="#e86f22" />
        <ellipse cx={0} cy={0} rx={44} ry={28} fill={IKAN} />
        <path d="M -8 -26 Q 6 -44 22 -24 Z" fill="#e86f22" />
        <path d="M 8 6 Q 16 22 2 22 Z" fill="#e86f22" />
        <path d="M 14 -20 Q 6 0 14 20" stroke="#e86f22" strokeWidth={3} fill="none" />
        <circle cx={26} cy={-6} r={6.5} fill="#fff6e8" />
        <circle cx={28} cy={-6} r={3.6} fill="#1a120c" />
      </g>
    </svg>
  );
};

/** Kartu post viral "8 DETIK" (dipakai pembuka & kesimpulan). */
export const KartuViral: React.FC<{ x: number; y: number; m8: number; skala?: number }> = ({ x, y, m8, skala = 1 }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const p8 = pegas(t, m8, fps, { damping: 10, stiffness: 200, mass: 0.6 });
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 400, height: 380, scale: String(skala), transformOrigin: '0 0', borderRadius: 18, background: KD.panel2, border: '2px solid rgba(239,235,226,0.16)', boxShadow: '0 20px 50px rgba(0,0,0,0.55)', padding: '22px 26px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: '#4a4650' }} />
        <div>
          <div style={{ width: 130, height: 12, borderRadius: 6, background: '#5f5b63' }} />
          <div style={{ width: 80, height: 10, borderRadius: 5, background: '#3d3a42', marginTop: 8 }} />
        </div>
      </div>
      <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.tulang, marginTop: 20 }}>Attention span manusia</div>
      <div style={{ fontFamily: ANTON, fontSize: 118, lineHeight: 1, color: KD.amber, marginTop: 6, scale: String(Math.max(0, p8)), transformOrigin: '0 60%' }}>8 DETIK</div>
      <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 25, color: KD.abu, marginTop: 8 }}>kalah sama ikan mas</div>
      <div style={{ display: 'flex', gap: 22, marginTop: 22 }}>
        {['♥', '↻', '➦'].map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, border: '3px solid #6a6670' }} />
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, color: '#8d8892' }}>{['12rb', '3rb', '5rb'][i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Akuarium: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => {
  const t = useDetik();
  const a = t * 0.9;
  const fx = x + Math.cos(a) * r * 0.42;
  const fy = y + 20 + Math.sin(a * 1.3) * r * 0.18;
  const arah = -Math.sin(a) >= 0 ? 1 : -1;
  return (
    <>
      <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', border: '5px solid rgba(239,235,226,0.5)', background: 'radial-gradient(circle at 40% 35%, rgba(110,170,200,0.28), rgba(40,80,110,0.22) 70%)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: r * 0.32 + Math.sin(t * 2) * 4, height: 6, background: 'rgba(200,230,255,0.35)' }} />
        {Array.from({ length: 6 }, (_, i) => {
          const by = ((r * 2 - ((t * 60 + i * 47) % (r * 1.6))) % (r * 2));
          return <div key={i} style={{ position: 'absolute', left: r * 0.5 + i * 22 + noise(`gl${i}`, t) * 8, top: by, width: 10, height: 10, borderRadius: 5, border: '2px solid rgba(220,240,255,0.55)' }} />;
        })}
      </div>
      <IkanMas x={fx} y={fy} s={0.9} arah={arah} seed="ak" />
    </>
  );
};

// S0 (pembuka): kartu viral + akuarium, stempel SUMBER? ------------------------------------------------------------
const B0: React.FC<{ T: WK }> = ({ T }) => {
  const S = T.s;
  return (
    <Babak dari={0} sampai={S[1].mulai} tanpaSapu latar="#0f0e12">
      <Ambang seed="b0">
        <KartuViral x={50} y={60} m8={Math.max(0.25, T.n8 - 0.05)} />
      </Ambang>
      <Akuarium x={680} y={250} r={150} />
      <Tag x={612} y={430} teks="ikan mas" o={maju(useDetik(), T.ikan0 - 0.1, T.ikan0 + 0.2)} warna={IKAN} />
      <Stempel mulai={T.sumber0} rot={-9} gaya={{ position: 'absolute', left: 105, top: 200 }}>
        <div style={{ padding: '6px 22px', border: `7px solid ${KD.koral}`, borderRadius: 14, fontFamily: ANTON, fontSize: 76, color: KD.koral, background: 'rgba(14,13,16,0.75)', whiteSpace: 'nowrap' }}>SUMBER?</div>
      </Stempel>
    </Babak>
  );
};

// S1: batang 12 → 8 dtk + ikan mas 9 -------------------------------------------------------------------------------
const B1: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const base = 420;
  const tinggi = 290;
  const xs = [150, 400, 650];
  const h = (v: number) => (tinggi * v) / 12;
  return (
    <Babak dari={S[1].mulai} sampai={S[2].mulai}>
      <div style={{ position: 'absolute', left: 60, top: base, width: MW - 120, height: 3, background: 'rgba(239,235,226,0.3)' }} />
      <Batang tegak x={xs[0]} y={base} panjang={tinggi} tebal={110} nilai={12} maks={12} m={T.n12 - 0.05} tampil={S[1].mulai + 0.1} lama={0.8} label="tahun 2000" satuan=" dtk" warna={KD.abu} ukuranAngka={50} />
      <Batang tegak x={xs[1]} y={base} panjang={tinggi} tebal={110} nilai={8} maks={12} m={T.n8b - 0.05} tampil={S[1].mulai + 0.2} lama={0.8} label="katanya sekarang" satuan=" dtk" ukuranAngka={50} />
      <Batang tegak x={xs[2]} y={base} panjang={tinggi} tebal={110} nilai={9} maks={12} m={T.n9 - 0.1} tampil={S[1].mulai + 0.3} lama={0.8} label="ikan mas" satuan=" dtk" warna={IKAN} ukuranAngka={50} />
      {t > T.n9 ? <IkanMas x={xs[2] + 55} y={base - h(9) - 100} s={0.7} arah={1} seed="b1" /> : null}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d={`M ${xs[0] + 110} ${base - h(12) + 20} Q ${xs[1] - 20} ${base - h(12) - 10} ${xs[1] + 40} ${base - h(8) - 70}`} mulai={T.n8b + 0.3} lama={0.3} warna={KD.koral} tebal={6} />
      </svg>
      <Chip x={xs[1] - 10} y={base - h(12) - 30} teks="turun" ukuran={24} warna={KD.koral} o={maju(t, T.n8b + 0.5, T.n8b + 0.7)} />
    </Babak>
  );
};

// S2: slate BBC 2017 --------------------------------------------------------------------------------------------
const B2: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const g = maju(t, S[2].mulai - 0.1, S[2].mulai + 0.2);
  const kaca = maju(t, T.nelusurin - 0.1, S[3].mulai - 0.2, EASE.kamera);
  return (
    <Babak dari={S[2].mulai} sampai={S[3].mulai} latar="#0e0d10">
      {latarSlate(g)}
      <SlateKD
        x={MW / 2}
        y={MH / 2 + 4}
        w={560}
        masuk={S[2].mulai - 0.05}
        tepuk={T.bbc}
        keluar={S[3].mulai + 0.3}
        baris={[
          { label: 'PENELUSUR', isi: 'Simon Maybin', mulai: T.simon - 0.05 },
          { label: 'MEDIA', isi: 'BBC · More or Less', mulai: T.bbc - 0.05 },
          { label: 'TAHUN', isi: '2017', mulai: T.th2017 - 0.05, warna: KD.amber },
        ]}
      />
      {kaca > 0 ? (
        <svg style={{ position: 'absolute', left: 120 + kaca * 560, top: 300 - Math.sin(kaca * Math.PI) * 60, overflow: 'visible', opacity: Math.min(1, kaca * 6) }} width={1} height={1}>
          <circle cx={0} cy={0} r={46} fill="rgba(255,180,84,0.12)" stroke={KD.amber} strokeWidth={9} />
          <path d="M 32 32 L 74 74" stroke={KD.amber} strokeWidth={14} strokeLinecap="round" />
        </svg>
      ) : null}
    </Babak>
  );
};

// S3: jejak kutipan → laporan Microsoft Kanada 2015 ------------------------------------------------------------------
const MEDIA = ['BERITA', 'ARTIKEL', 'POST', 'SLIDE', 'BLOG', 'VIDEO'];
const B3: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const dok = { x: 585, y: 250 };
  return (
    <Babak dari={S[3].mulai} sampai={S[4].mulai}>
      {MEDIA.map((m, i) => {
        const x = 40 + (i % 2) * 196;
        const y = 50 + Math.floor(i / 2) * 140 + (i % 2) * 40;
        const mm = T.kutipan - 0.1 + i * 0.12;
        return (
          <React.Fragment key={m}>
            <Muncul m={mm} x={x} y={y} dy={16}>
              <div style={{ width: 176, height: 96, borderRadius: 12, background: KD.panel2, border: '2px solid rgba(239,235,226,0.18)', padding: '10px 12px', boxSizing: 'border-box' }}>
                <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 16, letterSpacing: '0.12em', color: KD.abu }}>{m}</div>
                <div style={{ width: 120, height: 8, borderRadius: 4, background: '#4a4650', marginTop: 8 }} />
                <div style={{ display: 'inline-block', marginTop: 10, padding: '2px 10px', borderRadius: 8, background: KD.amber, fontFamily: ANTON, fontSize: 22, color: KD.latar }}>8 DTK</div>
              </div>
            </Muncul>
            <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
              <GarisDigambar d={`M ${x + 176} ${y + 48} Q ${(x + 176 + dok.x - 150) / 2 + 30} ${y + 48} ${dok.x - 150} ${dok.y + (i - 2.5) * 22}`} mulai={T.ujungnya + i * 0.07} lama={0.3} warna={KD.amber} tebal={4} />
            </svg>
          </React.Fragment>
        );
      })}
      <PopT m={T.laporan - 0.1} x={dok.x} y={dok.y}>
        <Kertas x={0} y={0} w={290} h={360} rot={2} tengah={false}>
          <div style={LABEL_KERTAS}>LAPORAN</div>
          <div style={{ ...JUDUL_KERTAS, fontSize: 46, marginTop: 8 }}>MICROSOFT KANADA</div>
          <div style={{ fontFamily: ANTON, fontSize: 64, lineHeight: 1, marginTop: 8, color: t > T.th2015 ? KD.amberTua : KD.latar }}>2015</div>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: 9, borderRadius: 4, background: '#c9c0ad', marginTop: 14, width: `${88 - (i % 3) * 14}%` }} />
          ))}
        </Kertas>
      </PopT>
    </Babak>
  );
};

// S4: catatan kaki → Statistic Brain ------------------------------------------------------------------------------
const B4: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const kotak = pathKotak(74, 378, 330, 50, 8);
  return (
    <Babak dari={S[4].mulai} sampai={S[5].mulai} latar="#14130f">
      <Kertas x={50} y={36} w={520} h={430} rot={-1} tengah={false}>
        <div style={LABEL_KERTAS}>LAPORAN MICROSOFT KANADA 2015</div>
        {[0, 1].map((i) => (
          <div key={i} style={{ height: 9, borderRadius: 4, background: '#c9c0ad', marginTop: 16, width: `${92 - i * 18}%` }} />
        ))}
        <div style={{ marginTop: 18, fontFamily: INTER, fontWeight: 800, fontSize: 30, color: KD.latar }}>
          attention span: <span style={{ background: KD.amber, padding: '0 8px' }}>8 detik</span>
          <sup style={{ fontFamily: INTER, fontWeight: 800, fontSize: 22, color: KD.koral, marginLeft: 4 }}>1</sup>
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ height: 9, borderRadius: 4, background: '#c9c0ad', marginTop: 16, width: `${86 - i * 12}%` }} />
        ))}
        <div style={{ position: 'absolute', left: 30, right: 30, top: 330, height: 2, background: '#b5ab96' }} />
        <div style={{ position: 'absolute', left: 30, top: 348, fontFamily: INTER, fontWeight: 700, fontSize: 24, color: '#4a453c' }}>
          <sup style={{ color: KD.koral, fontWeight: 800 }}>1</sup> Sumber: Statistic Brain
        </div>
      </Kertas>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d={`M 392 180 Q 470 280 300 372`} mulai={T.ngutip - 0.05} lama={0.3} warna={KD.koral} tebal={5} />
        <GarisDigambar d={kotak} mulai={T.statistic} lama={0.3} warna={KD.amber} tebal={6} />
      </svg>
      <Muncul m={T.bukan - 0.05} x={600} y={110}>
        <div style={{ padding: '10px 18px', borderRadius: 14, border: `3px solid ${KD.koral}`, background: 'rgba(11,11,14,0.9)', fontFamily: INTER, fontWeight: 800, fontSize: 28, color: KD.tulang, lineHeight: 1.15 }}>
          hasil riset
          <br />
          Microsoft?
        </div>
      </Muncul>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d="M 610 135 L 790 128" mulai={T.bukan + 0.15} lama={0.18} warna={KD.koral} tebal={6} />
        <GarisDigambar d="M 610 172 L 760 166" mulai={T.bukan + 0.25} lama={0.18} warna={KD.koral} tebal={6} />
      </svg>
      <Chip x={705} y={222} teks="bukan" ukuran={26} warna={KD.koral} isi o={maju(t, T.bukan + 0.3, T.bukan + 0.45)} />
      <Muncul m={T.statistic + 0.15} x={590} y={290}>
        <div style={{ width: 270, borderRadius: 12, overflow: 'hidden', border: `3px solid ${KD.amber}`, background: KD.panel2 }}>
          <div style={{ display: 'flex', gap: 6, padding: '8px 10px', background: '#26242a' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: 5, background: '#6a6670' }} />
            ))}
          </div>
          <div style={{ padding: '10px 14px 14px' }}>
            <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 18, color: KD.abu, letterSpacing: '0.1em' }}>SITUS</div>
            <div style={{ fontFamily: ANTON, fontSize: 40, color: KD.amber, lineHeight: 1.05 }}>STATISTIC BRAIN</div>
          </div>
        </div>
      </Muncul>
    </Babak>
  );
};

// S5: 2 sumber, 0 riset -------------------------------------------------------------------------------------------
const B5: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const item = ['NCBI · US National Library of Medicine', 'Associated Press'];
  return (
    <Babak dari={S[5].mulai} sampai={S[6].mulai}>
      <div style={{ position: 'absolute', left: 30, top: 60, fontFamily: INTER, fontWeight: 800, fontSize: 22, letterSpacing: '0.12em', color: KD.abu }}>STATISTIC BRAIN · SUMBER YANG DICANTUMIN</div>
      {item.map((it, i) => {
        const y = 112 + i * 150;
        const mb = T.duadua + 0.15 + i * 0.35;
        const buka = maju(t, mb, mb + 0.3, EASE.kamera);
        return (
          <React.Fragment key={i}>
            <Muncul m={T.dua - 0.1 + i * 0.2} x={30} y={y}>
              <div style={{ width: 410, height: 110, borderRadius: 14, background: KD.panel2, border: '2px solid rgba(239,235,226,0.18)', display: 'flex', alignItems: 'center', gap: 16, padding: '0 18px', boxSizing: 'border-box' }}>
                <div style={{ fontFamily: ANTON, fontSize: 54, color: KD.amber }}>{i + 1}</div>
                <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.tulang, lineHeight: 1.15 }}>{it}</div>
              </div>
            </Muncul>
            <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
              <GarisDigambar d={`M 446 ${y + 55} H 500`} mulai={mb - 0.15} lama={0.15} warna={KD.abu} tebal={5} />
            </svg>
            {t > mb - 0.05 ? (
              <div style={{ position: 'absolute', left: 512, top: y + 8, width: 150, height: 96 }}>
                {/* map: badan + tutup kebuka, isinya kosong */}
                <div style={{ position: 'absolute', left: 0, top: 20, width: 150, height: 76, borderRadius: 10, background: '#3b3426', border: `3px solid ${KD.emas}` }} />
                <div style={{ position: 'absolute', left: 0, top: 6, width: 64, height: 22, borderRadius: '8px 8px 0 0', background: '#3b3426', border: `3px solid ${KD.emas}`, borderBottom: 'none' }} />
                <div style={{ position: 'absolute', left: 0, top: 20, width: 150, height: 76, borderRadius: 10, background: '#4a412f', transformOrigin: '50% 100%', transform: `perspective(300px) rotateX(${(buka * 58).toFixed(1)}deg)`, border: `3px solid ${KD.emas}` }} />
                <div style={{ position: 'absolute', left: 0, top: 104, width: 150, textAlign: 'center', fontFamily: INTER, fontWeight: 800, fontSize: 20, color: KD.koral, opacity: maju(t, mb + 0.3, mb + 0.45) }}>riset: kosong</div>
              </div>
            ) : null}
            <Silang x={587} y={y + 58} s={60} mulai={mb + 0.35} tebal={10} />
          </React.Fragment>
        );
      })}
      <Muncul m={T.riset5 - 0.1} x={MW - 110} y={250} tengah>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: ANTON, fontSize: 140, color: KD.koral, lineHeight: 0.9 }}>0</div>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.tulang }}>riset</div>
        </div>
      </Muncul>
    </Babak>
  );
};

// S6: Gemma Briggs — tergantung tugasnya --------------------------------------------------------------------------
const TUGAS = [
  { nama: 'nyetir', w: 0.82 },
  { nama: 'baca buku', w: 0.55 },
  { nama: 'scroll video', w: 0.3 },
];
const B6: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const naik = maju(t, T.tergantung - 0.3, T.tergantung + 0.2, EASE.kamera);
  return (
    <Babak dari={S[6].mulai} sampai={S[7].mulai} latar="#14130f">
      <div style={{ position: 'absolute', left: MW / 2, top: 0, translate: `-50% ${(250 - naik * 160).toFixed(1)}px`, scale: String(1 - naik * 0.22) }}>
        <Kertas x={0} y={0} w={700} rot={-1.2}>
          <div style={LABEL_KERTAS}>GEMMA BRIGGS · PSIKOLOG, OPEN UNIVERSITY</div>
          <div style={{ ...JUDUL_KERTAS, marginTop: 10 }}>
            “ATTENTION SPAN RATA-RATA HAMPIR <span style={{ background: t > T.hampir ? KD.amber : 'transparent', padding: '0 6px' }}>GAK ADA ARTINYA</span>.”
          </div>
          <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 20, color: '#6b6457', marginTop: 8 }}>dikutip BBC News 2017 (terjemahan kami)</div>
        </Kertas>
      </div>
      {TUGAS.map((g, i) => {
        const m = T.tergantung + 0.1 + i * 0.22;
        const o = maju(t, m, m + 0.25);
        if (o <= 0) return null;
        const y = 250 + i * 76;
        const gw = 360 * g.w * maju(t, m + 0.1, m + 0.8, EASE.kamera) + Math.sin(t * 3 + i) * 10;
        return (
          <div key={i} style={{ position: 'absolute', left: 120, top: y, opacity: o, display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 190, fontFamily: INTER, fontWeight: 800, fontSize: 28, color: KD.tulang, textAlign: 'right' }}>{g.nama}</div>
            <div style={{ position: 'relative', width: 380, height: 34, borderRadius: 17, background: 'rgba(239,235,226,0.08)' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: Math.max(20, gw), height: 34, borderRadius: 17, background: i === 0 ? KD.amber : i === 1 ? KD.emas : KD.abu }} />
            </div>
          </div>
        );
      })}
      <Tag x={120} y={472} teks="ilustrasi: fokus beda-beda tiap tugas" o={maju(t, T.tergantung + 0.4, T.tergantung + 0.7)} />
    </Babak>
  );
};

// S7: ikan mas di lab: belajar + memori -------------------------------------------------------------------------------
const B7: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  // ikan berenang di akuarium lab menuju tombol makan (belajar)
  const p = maju(t, T.dipakai, T.belajar + 0.4, EASE.kamera);
  const fx = 180 + p * 360 + Math.sin(t * 1.5) * 10;
  const fy = 300 - Math.sin(p * Math.PI) * 70 + Math.sin(t * 2.3) * 6;
  return (
    <Babak dari={S[7].mulai} sampai={S[8].mulai}>
      <div style={{ position: 'absolute', left: 60, top: 128, width: 640, height: 322, borderRadius: 12, border: '5px solid rgba(239,235,226,0.45)', background: 'linear-gradient(180deg, rgba(90,150,180,0.18), rgba(40,80,110,0.3))' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 30, height: 5, background: 'rgba(200,230,255,0.3)' }} />
        {/* sekat labirin */}
        <div style={{ position: 'absolute', left: 260, top: 120, width: 12, height: 210, background: 'rgba(239,235,226,0.35)' }} />
        <div style={{ position: 'absolute', left: 430, top: 36, width: 12, height: 170, background: 'rgba(239,235,226,0.35)' }} />
      </div>
      {/* tombol/target makanan */}
      <div style={{ position: 'absolute', left: 600, top: 330, width: 56, height: 56, borderRadius: 28, background: KD.amber, boxShadow: `0 0 ${(18 + 10 * Math.sin(t * 5)).toFixed(1)}px rgba(255,180,84,0.8)` }} />
      <IkanMas x={fx} y={fy} s={0.8} arah={1} seed="b7" />
      <Muncul m={S[7].mulai + 0.1} x={60} y={54}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 12, border: `3px solid ${KD.koral}`, background: 'rgba(11,11,14,0.9)', fontFamily: INTER, fontWeight: 800, fontSize: 28, color: KD.tulang }}>pelupa?</div>
      </Muncul>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d="M 70 80 L 196 76" mulai={T.pelupa + 0.05} lama={0.18} warna={KD.koral} tebal={6} />
      </svg>
      <div style={{ position: 'absolute', left: 730, top: 140, display: 'flex', flexDirection: 'column', gap: 26 }}>
        {[
          { teks: 'belajar', m: T.belajar },
          { teks: 'memori', m: T.memori },
        ].map((x, i) => (
          <div key={i} style={{ position: 'relative', opacity: maju(t, x.m - 0.1, x.m + 0.1), display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 46, height: 46 }} />
            <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 30, color: KD.tulang }}>{x.teks}</div>
          </div>
        ))}
      </div>
      <Centang x={752} y={160} s={40} mulai={T.belajar} tebal={8} />
      <Centang x={752} y={232} s={40} mulai={T.memori} tebal={8} />
      <Tag x={60} y={460} teks="ikan mas = model riset belajar & memori" o={maju(t, T.dipakai, T.dipakai + 0.3)} warna={KD.amber} />
    </Babak>
  );
};

// S8: stempel GAK ADA BUKTI -----------------------------------------------------------------------------------------
const B8: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  return (
    <Babak dari={S[8].mulai} sampai={S[9].mulai} latar="#0f0e12">
      <Ambang seed="b8">
        <KartuViral x={70} y={60} m8={S[8].mulai - 0.5} skala={1} />
      </Ambang>
      <div style={{ position: 'absolute', left: 520, top: 110, width: 320 }}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 22, letterSpacing: '0.12em', color: KD.abu }}>ATTENTION SPAN MANUSIA</div>
        <svg width={320} height={200} style={{ overflow: 'visible', marginTop: 14 }}>
          <path d="M 0 180 H 320 M 0 0 V 180" stroke="rgba(239,235,226,0.3)" strokeWidth={3} fill="none" />
          <GarisDigambar d="M 10 60 C 80 40 140 150 310 165" mulai={S[8].mulai + 0.2} lama={0.5} warna={KD.abu} tebal={6} />
        </svg>
        <div style={{ position: 'absolute', left: 140, top: 150, fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.tulang, opacity: maju(t, S[8].mulai + 0.5, S[8].mulai + 0.7) }}>makin pendek?</div>
      </div>
      <Silang x={700} y={210} s={140} mulai={T.pendek} tebal={12} />
      <Stempel mulai={T.bukti} rot={-8} gaya={{ position: 'absolute', left: 90, top: 190 }}>
        <div style={{ padding: '6px 22px', border: `7px solid ${KD.koral}`, borderRadius: 14, fontFamily: ANTON, fontSize: 70, color: KD.koral, background: 'rgba(14,13,16,0.8)', whiteSpace: 'nowrap' }}>GAK ADA BUKTI</div>
      </Stempel>
    </Babak>
  );
};

// ======================================================================================================
const Hud: React.FC<{ T: WK }> = ({ T }) => {
  const S = T.s;
  return (
    <>
      <JudulKD
        label={['KLAIM', 'VIRAL']}
        lMulai={0.15}
        judul={[{ t: '8', mulai: 0.28, isi: sorot('8', T.n8) }, { t: 'DETIK?', mulai: 0.34 }, { t: 'GAK', mulai: 0.42 }, { t: 'ADA', mulai: 0.48 }, { t: 'SUMBERNYA', mulai: 0.54 }]}
        jMulai={0.28}
        keluar={S[1].mulai - 0.2}
      />
      <JudulKD
        label={['KATANYA']}
        lMulai={S[1].mulai}
        judul={[{ t: '12', mulai: T.n12 }, { t: 'DTK', mulai: T.n12 + 0.1 }, { t: '→', mulai: T.jadi - 0.1, isi: <PanahInline /> }, { t: '8', mulai: T.n8b, isi: sorot('8', T.n8b + 0.1) }, { t: 'DTK', mulai: T.n8b + 0.1 }]}
        jMulai={T.n12}
        keluar={S[2].mulai - 0.2}
        catatan="tahun 2000 → sekarang · ikan mas 9 detik"
        cMulai={T.n9}
      />
      <JudulKD
        label={['SIMON', 'MAYBIN', 'NELUSURIN']}
        lMulai={S[2].mulai}
        judul={[{ t: 'BBC', mulai: T.bbc }, { t: '·', mulai: T.bbc + 0.1, warna: KD.abu }, { t: '2017', mulai: T.th2017, isi: sorot('2017', T.bbc + 0.2) }]}
        jMulai={T.th2017}
        keluar={S[3].mulai - 0.2}
      />
      <JudulKD
        label={['SEMUA', 'KUTIPAN', 'UJUNGNYA', 'KE']}
        lMulai={S[3].mulai}
        judul={[{ t: 'MICROSOFT', mulai: T.laporan }, { t: 'KANADA', mulai: T.laporan + 0.2 }, { t: '·', mulai: T.th2015 - 0.1, warna: KD.abu }, { t: '2015', mulai: T.th2015, isi: sorot('2015', T.th2015 + 0.15) }]}
        jMulai={T.laporan}
        keluar={S[4].mulai - 0.2}
      />
      <JudulKD
        label={['ANGKA', '8', 'DETIK', 'ITU']}
        lMulai={S[4].mulai}
        judul={[{ t: 'DIKUTIP', mulai: T.ngutip }, { t: 'DARI', mulai: T.ngutip + 0.15 }, { t: 'STATISTIC', mulai: T.statistic, isi: sorot('STATISTIC', T.statistic + 0.15) }, { t: 'BRAIN', mulai: T.statistic + 0.15 }]}
        jMulai={T.ngutip}
        keluar={S[5].mulai - 0.2}
        catatan="bukan hasil riset Microsoft"
        cMulai={T.bukan}
      />
      <JudulKD
        label={['STATISTIC', 'BRAIN', 'NYANTUMIN']}
        lMulai={S[5].mulai}
        judul={[{ t: '2', mulai: T.dua }, { t: 'SUMBER', mulai: T.dua + 0.12 }, { t: '·', mulai: T.duadua, warna: KD.abu }, { t: '0', mulai: T.riset5 - 0.1, isi: sorot('0', T.riset5, KD.koral) }, { t: 'RISET', mulai: T.riset5 }]}
        jMulai={T.dua}
        keluar={S[6].mulai - 0.2}
      />
      <JudulKD
        label={['GEMMA', 'BRIGGS,', 'PSIKOLOG']}
        lMulai={S[6].mulai}
        judul={[{ t: 'TERGANTUNG', mulai: T.tergantung, isi: sorot('TERGANTUNG', T.tergantung + 0.2) }, { t: 'TUGASNYA', mulai: T.tergantung + 0.2 }]}
        jMulai={T.tergantung}
        keluar={S[7].mulai - 0.2}
      />
      <JudulKD
        label={['IKAN', 'MAS', 'GAK', 'TERBUKTI', 'PELUPA']}
        lMulai={S[7].mulai}
        judul={[{ t: 'MODEL', mulai: T.dipakai }, { t: 'RISET', mulai: T.dipakai + 0.15 }, { t: 'MEMORI', mulai: T.memori, isi: sorot('MEMORI', T.memori + 0.15) }]}
        jMulai={T.dipakai}
        keluar={S[8].mulai - 0.2}
        catatan="dipakai buat riset cara belajar & memori"
        cMulai={T.belajar}
      />
      <JudulKD
        label={['KESIMPULAN', 'BBC']}
        lMulai={S[8].mulai}
        judul={[{ t: 'GAK', mulai: T.bukti - 0.2 }, { t: 'ADA', mulai: T.bukti - 0.1 }, { t: 'BUKTI', mulai: T.bukti, isi: sorot('BUKTI', T.bukti + 0.15, KD.koral) }, { t: 'MAKIN', mulai: T.pendek - 0.3 }, { t: 'PENDEK', mulai: T.pendek }]}
        jMulai={T.bukti - 0.2}
        keluar={S[9].mulai - 0.2}
        ukuran={110}
      />
      <JudulKD
        label={['SIMPAN', 'BUAT', 'JAWABAN']}
        lMulai={S[9].mulai}
        judul={[{ t: 'SIMPAN', mulai: S[9].mulai + 0.2 }, { t: '·', mulai: S[9].mulai + 0.3, warna: KD.abu }, { t: 'FOLLOW', mulai: T.ks('follow', S[9].mulai, S[9].akhir - 1.5), isi: sorot('FOLLOW', T.ks('follow', S[9].mulai, S[9].akhir - 1.5) + 0.15) }]}
        jMulai={S[9].mulai + 0.2}
        keluar={T.pulang - 0.15}
      />
    </>
  );
};

void noise;
void (null as unknown as WaktuDasar);
