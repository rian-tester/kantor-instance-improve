// Frame hero (pembuka, tengah, puncak): 15, 859, 1431.
// contoh video explainer K6 (akun generik, konten contoh): "Edit blindness: sepertiga cut match action gak ketahuan".
// Seri "meja editor amber" (panggung.tsx). Semua adegan = ILUSTRASI piktogram (orang lari), tanpa cuplikan film.
// Alur: 3 cut, 1 kelewat (hook 1/3) → slate Smith & Henderson 2008 → 7 orang × 7 film × 5 menit → playback + tombol dipencet tiap
// cut → cincin 15,8% → batang 9,4 / 25,1 / 32,4% (numpuk per kalimat) → mata: kedip pas cut ≈1%, fokus ke cerita → potong pas
// gerakan → CTA. Fakta: Smith & Henderson, Journal of Eye Movement Research 2(2), 2008 (abstrak + hasil).
import React, { useMemo } from 'react';
import { useVideoConfig } from 'remotion';
import { AngkaJalan, EASE, GarisDigambar, maju, useDetik } from "../../src/gerak";
import { ANTON, INTER, MONO } from "../../src/gerak/seri/meja-editor/font";
import { bunyi, Centang, Chip, JudulKD, KD, KiraInline, PanahInline, Silang, SlateKD, sorot } from "../../src/gerak/seri/meja-editor/seri";
import { Babak, Batang, Cincin, dasarWaktu, Figur, latarSlate, MH, Muncul, MW, Orang, Panggung, PopT, Tag, type DataKD } from "../../src/gerak/seri/meja-editor/panggung";

export type DataK6 = DataKD;

function waktuK6(d: DataKD, total: number) {
  const B = dasarWaktu(d, total);
  const { k, ks, s } = B;
  const lima = k('lima', 2, 1.6);
  return {
    ...B,
    sengaja: k('sengaja', 0, 1), sepertiga: k('sepertiga', 0, 2.6), gerakan0: k('gerakan', 0, 4.4),
    smith: k('smith', 1, 0.3), edinburgh: k('edinburgh', 1, 2.4), edit1: k('edit', 1, 3.6), blindness: k('blindness', 1, 4), th2008: k('2008', 1, 5.5),
    tujuh: k('tujuh', 2, 0.1), lima, tujuh2: ks('tujuh', lima, s[2].mulai + 2.4), blade: k('blade', 2, 3.6), citizen: k('citizen', 2, 4.6),
    pencet: k('pencet', 3, 1.4), tombol: k('tombol', 3, 1.8), cut3: k('cut', 3, 3.2),
    n158: k('15', 4, 1.2), gak4: k('gak', 4, 2.6),
    adegan5: k('adegan', 5, 1), n94: k('9', 5, 2.4),
    sudut: k('sudut', 6, 0.8), n251: k('25', 6, 3),
    match: k('match', 7, 0.8), gerakan7: k('gerakan', 7, 2.4), n324: k('32', 7, 3.4),
    kedipan8: k('kedipan', 8, 0.1), n1: k('1', 8, 2.6), kebanyakan: k('kebanyakan', 8, 5.2), fokus: k('fokus', 8, 7.2), cerita: k('ceritanya', 8, 7.6),
    motong: k('motong', 9, 1.2), gerakan9: k('gerakan', 9, 2), susah: k('susah', 9, 4),
  };
}
type WK = ReturnType<typeof waktuK6>;

export const ContohEditBlind: React.FC<DataK6> = (d) => {
  const { durationInFrames, fps } = useVideoConfig();
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuK6(d, total), [d, total]);
  const S = T.s;
  return (
    <Panggung
      d={d}
      T={T}
      folder="k6"
      labelKlip={['1/3 cut', 'Smith & Henderson', '7 film', 'pencet tombol', '15,8%', 'beda adegan', 'beda sudut', 'match action', 'kedip ≈1%', 'tips', 'simpan']}
      pembuka={<B0 T={T} />}
      monitor={
        <>
          <B0 T={T} />
          <B1 T={T} />
          <B2 T={T} />
          <B3 T={T} />
          <B4 T={T} />
          <B5 T={T} />
          <B8 T={T} />
          <B9 T={T} />
        </>
      }
      hud={<Hud T={T} />}
      sumber={() => 'Sumber: Smith & Henderson, Journal of Eye Movement Research, 2008'}
      tagMonitor={() => 'ILUSTRASI'}
      getar={[{ t: T.th2008 + 0.02, kuat: 8 }, { t: T.n324 + 0.9, kuat: 6 }]}
      sfx={[
        bunyi('klik', 0.9, 0.3),
        bunyi('klik', 1.8, 0.3),
        bunyi('glitch', T.sepertiga, 0.28),
        bunyi('whooshA', S[1].mulai - 0.05, 0.3),
        bunyi('jepret', T.th2008, 0.55),
        bunyi('hantam', T.th2008 + 0.02, 0.32),
        ...Array.from({ length: 7 }, (_, i) => bunyi('tik', T.tujuh + i * 0.08, 0.14)),
        ...Array.from({ length: 7 }, (_, i) => bunyi('tik', T.tujuh2 + i * 0.08, 0.12)),
        bunyi('klik', T.pencet + 0.1, 0.4),
        bunyi('klik', T.cut3 + 0.05, 0.4),
        bunyi('whooshLembut', T.n158 - 0.1, 0.25),
        bunyi('pop', T.n94, 0.28),
        bunyi('pop', T.n251, 0.28),
        bunyi('pop', T.n324, 0.3),
        bunyi('kunci', T.n324 + 0.9, 0.38),
        bunyi('tik', T.n1, 0.3),
        bunyi('whooshLembut', T.fokus - 0.2, 0.25),
        bunyi('klik', T.motong + 0.2, 0.35),
        bunyi('pop', T.susah, 0.28),
      ]}
    />
  );
};

// ======================================================================================================
/** Dua shot disambung pas gerakan: shot lebar (kiri) → shot dekat (kanan), figur lari. */
export const SambungGerak: React.FC<{ x: number; y: number; w: number; h: number; seed: string; kelewat?: number; ketahuan?: number }> = ({ x, y, w, h, seed, kelewat = 0, ketahuan = 0 }) => {
  const t = useDetik();
  const fase = (t * 1.6 + seed.length * 0.17) % 1;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: w / 2 - 3, height: h, borderRadius: '10px 0 0 10px', overflow: 'hidden', background: '#231d17' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: h * 0.18, background: '#2f271e' }} />
        <Figur x={w * 0.28} y={h * 0.7} s={0.62} fase={fase} warna={KD.tulang} />
      </div>
      <div style={{ position: 'absolute', left: w / 2 + 3, top: 0, width: w / 2 - 3, height: h, borderRadius: '0 10px 10px 0', overflow: 'hidden', background: '#2c2219' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: h * 0.1, background: '#3a2e22' }} />
        <Figur x={w * 0.2} y={h * 0.98} s={1.15} fase={(fase + 0.05) % 1} warna={KD.tulang} />
      </div>
      <div style={{ position: 'absolute', left: w / 2 - 2, top: -8, width: 4, height: h + 16, background: KD.amber }} />
      {ketahuan > 0 ? <div style={{ position: 'absolute', inset: -5, borderRadius: 14, border: `4px solid ${KD.amber}`, opacity: ketahuan }} /> : null}
      {kelewat > 0 ? <div style={{ position: 'absolute', inset: -5, borderRadius: 14, border: `4px solid ${KD.koral}`, opacity: kelewat }} /> : null}
    </div>
  );
};

/** Tombol bulat yang dipencet (turun + nyala) di detik-detik `tekan`. */
const Tombol: React.FC<{ x: number; y: number; r: number; tekan: number[]; label?: string }> = ({ x, y, r, tekan, label }) => {
  const t = useDetik();
  const p = tekan.reduce((m, tk) => Math.max(m, maju(t, tk - 0.04, tk + 0.03) * (1 - maju(t, tk + 0.12, tk + 0.3))), 0);
  return (
    <div style={{ position: 'absolute', left: x - r, top: y - r }}>
      <div style={{ position: 'absolute', left: 0, top: r * 0.22, width: r * 2, height: r * 2, borderRadius: r, background: '#5a3612' }} />
      <div style={{ position: 'absolute', left: 0, top: p * r * 0.18, width: r * 2, height: r * 2, borderRadius: r, background: p > 0.3 ? '#ffd08a' : KD.amber, boxShadow: p > 0.3 ? `0 0 ${r}px rgba(255,180,84,0.9)` : 'none' }} />
      {label ? <div style={{ position: 'absolute', left: r, top: r * 2 + 26, translate: '-50% 0', fontFamily: INTER, fontWeight: 800, fontSize: 22, color: KD.abu, whiteSpace: 'nowrap' }}>{label}</div> : null}
    </div>
  );
};

// S0 (pembuka): 3 cut, 1 kelewat → 1/3 -------------------------------------------------------------------------------
const B0: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const xs = [30, 314, 598];
  const w = 266;
  const m = [0.5, 1.4, T.sepertiga];
  return (
    <Babak dari={0} sampai={S[1].mulai} tanpaSapu latar="#0f0e12">
      <Tag x={30} y={56} teks="CUT YANG NYAMBUNG SAMA GERAKAN" o={1} />
      {xs.map((x, i) => {
        const kelewat = i === 2 ? maju(t, m[2], m[2] + 0.2) : 0;
        const ketahuan = i < 2 ? maju(t, m[i] + 0.4, m[i] + 0.55) : 0;
        return (
          <React.Fragment key={i}>
            <SambungGerak x={x} y={100} w={w} h={190} seed={`s0${i}`} kelewat={kelewat} ketahuan={ketahuan} />
            <div style={{ position: 'absolute', left: x, top: 306, width: w, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 20, color: KD.abu }}>cut {i + 1}</div>
            {i < 2 ? (
              <PopT m={m[i] + 0.4} x={x + w / 2} y={370}>
                <div style={{ padding: '6px 16px', borderRadius: 12, background: KD.amber, fontFamily: INTER, fontWeight: 800, fontSize: 24, color: KD.latar, whiteSpace: 'nowrap' }}>ketahuan</div>
              </PopT>
            ) : (
              <PopT m={m[2] + 0.1} x={x + w / 2} y={370}>
                <div style={{ padding: '6px 16px', borderRadius: 12, background: KD.koral, fontFamily: INTER, fontWeight: 800, fontSize: 24, color: KD.latar, whiteSpace: 'nowrap' }}>kelewat</div>
              </PopT>
            )}
          </React.Fragment>
        );
      })}
      <Muncul m={T.sepertiga + 0.15} x={MW / 2} y={448} tengah>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 28, color: KD.tulang, whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: ANTON, fontSize: 44, color: KD.koral }}>1 dari 3</span> gak ketahuan
        </div>
      </Muncul>
    </Babak>
  );
};

// S1: slate Smith & Henderson 2008 ------------------------------------------------------------------------------------
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
        tepuk={T.th2008}
        keluar={S[2].mulai + 0.3}
        baris={[
          { label: 'PENELITI', isi: 'Tim Smith & John Henderson', mulai: T.smith - 0.05 },
          { label: 'KAMPUS', isi: 'Univ. of Edinburgh', mulai: T.edinburgh - 0.1 },
          { label: 'TAHUN', isi: '2008', mulai: T.th2008 - 0.05, warna: KD.amber },
        ]}
      />
    </Babak>
  );
};

// S2: 7 orang × 7 film × 5 menit -----------------------------------------------------------------------------------
const FILM = ['Blade Runner', 'Citizen Kane', 'film 3', 'film 4', 'film 5', 'film 6', 'film 7'];
const B2: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const pO = maju(t, T.tujuh - 0.05, T.tujuh + 0.55, EASE.linear);
  const pF = maju(t, T.tujuh2 - 0.05, T.tujuh2 + 0.55, EASE.linear);
  const nO = Math.floor(pO * 7 + 1e-6);
  const nF = Math.floor(pF * 7 + 1e-6);
  return (
    <Babak dari={S[2].mulai} sampai={S[3].mulai}>
      <div style={{ position: 'absolute', left: 40, top: 60, display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <AngkaJalan dari={0} ke={7} progress={pO} lantai gaya={{ fontFamily: ANTON, fontSize: 64, color: KD.amber, lineHeight: 1 }} />
        <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 28, color: KD.tulang }}>peserta</span>
      </div>
      {Array.from({ length: 7 }, (_, i) => (
        <Orang key={i} x={70 + i * 62} y={190} s={1.2} warna={i < nO ? KD.tulang : '#3a383e'} />
      ))}
      <div style={{ position: 'absolute', left: 520, top: 60, display: 'flex', alignItems: 'baseline', gap: 12, opacity: maju(t, T.lima - 0.1, T.lima + 0.15) }}>
        <span style={{ fontFamily: ANTON, fontSize: 64, color: KD.amber, lineHeight: 1 }}>5</span>
        <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 28, color: KD.tulang }}>menit / potongan</span>
      </div>
      {/* 7 potongan film */}
      {FILM.map((f, i) => {
        const tampil = i < nF;
        const sorotF = (i === 0 && t > T.blade - 0.05) || (i === 1 && t > T.citizen - 0.05);
        const x = 40 + (i % 4) * 206;
        const y = 270 + Math.floor(i / 4) * 104;
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y, width: 190, height: 86, borderRadius: 10, opacity: tampil ? 1 : 0.1, background: sorotF ? '#3a2c1f' : '#1c1a1f', boxShadow: `inset 0 0 0 ${sorotF ? 4 : 2}px ${sorotF ? KD.amber : 'rgba(199,159,85,0.5)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', left: 6, top: 6, right: 6, height: 8, backgroundImage: 'repeating-linear-gradient(90deg, rgba(239,235,226,0.25) 0 10px, transparent 10px 18px)' }} />
            <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: i < 2 ? 22 : 20, color: i < 2 ? KD.tulang : KD.abu }}>{f}</div>
          </div>
        );
      })}
      <Tag x={40 + 3 * 206} y={270 + 104 + 30} teks="7 film" o={maju(t, T.tujuh2 + 0.5, T.tujuh2 + 0.7)} warna={KD.amber} />
    </Babak>
  );
};

// S3: playback + tombol dipencet tiap cut -------------------------------------------------------------------------------
const B3: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const t0 = S[3].mulai;
  const cuts = [t0 + 1.1, t0 + 2.3, T.cut3 + 0.05, S[4].mulai - 0.35].filter((c) => c < S[4].mulai - 0.2);
  const tekan = cuts.map((c) => c + 0.25);
  const scroll = (t - t0) * 120;
  return (
    <Babak dari={S[3].mulai} sampai={S[4].mulai}>
      {/* layar film peserta */}
      <div style={{ position: 'absolute', left: 40, top: 60, width: 560, height: 300, borderRadius: 12, overflow: 'hidden', background: '#231d17' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 60, background: '#2f271e' }} />
        <Figur x={120 + ((t - t0) * 70) % 380} y={240} s={0.95} fase={(t * 1.6) % 1} />
        {cuts.map((c, i) => {
          const fl = maju(t, c - 0.02, c + 0.02) * (1 - maju(t, c + 0.06, c + 0.2));
          return fl > 0 ? <div key={i} style={{ position: 'absolute', inset: 0, background: `rgba(255,180,84,${(0.35 * fl).toFixed(3)})` }} /> : null;
        })}
      </div>
      {/* strip waktu + penanda cut */}
      <div style={{ position: 'absolute', left: 40, top: 380, width: 560, height: 46, borderRadius: 8, background: KD.lajur, overflow: 'hidden', border: `2px solid ${KD.garis}` }}>
        {cuts.map((c, i) => {
          const x = 280 + (c - t) * 120;
          return <div key={i} style={{ position: 'absolute', left: x, top: 4, width: 4, height: 38, background: t > c ? KD.amber : 'rgba(239,235,226,0.5)' }} />;
        })}
        <div style={{ position: 'absolute', left: 278, top: 0, width: 4, height: 46, background: KD.tulang }} />
        <div style={{ position: 'absolute', left: -scroll % 40, top: 0 }} />
      </div>
      <Tombol x={750} y={190} r={80} tekan={tekan} label="pencet tiap lihat cut" />
      <Muncul m={T.pencet - 0.1} x={672} y={330}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.tulang, whiteSpace: 'nowrap' }}>
          dipencet: <AngkaJalan dari={0} ke={tekan.length} progress={tekan.filter((x) => t > x).length / Math.max(1, tekan.length)} gaya={{ fontFamily: ANTON, fontSize: 40, color: KD.amber }} />
        </div>
      </Muncul>
    </Babak>
  );
};

// S4: cincin 15,8% kelewat ---------------------------------------------------------------------------------------------
const B4: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  return (
    <Babak dari={S[4].mulai} sampai={S[5].mulai}>
      <Cincin x={300} y={250} r={150} nilai={15.8} desimal={1} m={T.n158 - 0.1} lama={1.1} warna={KD.koral} tebal={34} ukuran={88} bawah="kelewat" />
      <Muncul m={S[4].mulai + 0.2} x={540} y={140}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 24, letterSpacing: '0.1em', color: KD.abu }}>SEMUA SAMBUNGAN</div>
      </Muncul>
      <div style={{ position: 'absolute', left: 540, top: 190, width: 300 }}>
        {Array.from({ length: 20 }, (_, i) => {
          const lewat = i < 3 && t > T.gak4 - 0.1 + i * 0.1;
          return (
            <div key={i} style={{ position: 'absolute', left: (i % 5) * 58, top: Math.floor(i / 5) * 46, width: 48, height: 34, borderRadius: 6, background: lewat ? 'transparent' : '#2a2119', border: `3px solid ${lewat ? KD.koral : 'rgba(199,159,85,0.6)'}`, opacity: maju(t, S[4].mulai + 0.2 + i * 0.03, S[4].mulai + 0.4 + i * 0.03) }}>
              <div style={{ position: 'absolute', left: 22, top: 4, width: 4, height: 26, background: lewat ? KD.koral : KD.amber }} />
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: 0, top: 196, fontFamily: INTER, fontWeight: 700, fontSize: 21, color: KD.abu, opacity: maju(t, T.gak4, T.gak4 + 0.3), whiteSpace: 'nowrap' }}>±3 dari tiap 20 cut gak ketahuan</div>
      </div>
    </Babak>
  );
};

// S5–S7: batang per jenis cut (numpuk) ------------------------------------------------------------------------------
const B5: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const baris = [
    { label: 'pindah ke adegan lain', nilai: 9.4, m: T.n94, aktif: S[5].mulai },
    { label: 'pindah sudut, adegan sama', nilai: 25.1, m: T.n251, aktif: S[6].mulai },
    { label: 'match action (pas ada gerakan)', nilai: 32.4, m: T.n324, aktif: S[7].mulai },
  ];
  return (
    <Babak dari={S[5].mulai} sampai={S[8].mulai} zoom={0.02}>
      <Tag x={40} y={48} teks="PERSEN CUT YANG KELEWAT, PER JENIS" o={1} />
      {baris.map((b, i) => {
        const redup = i < baris.length - 1 && t > baris[i + 1].aktif ? 0.5 : 0;
        return (
          <React.Fragment key={i}>
            <Muncul m={b.aktif - 0.05} x={40} y={96 + i * 128}>
              <div style={{ width: 92, height: 72, borderRadius: 8, overflow: 'hidden', background: '#231d17', position: 'relative', boxShadow: 'inset 0 0 0 2px rgba(199,159,85,0.6)' }}>
                {i === 0 ? (
                  <>
                    <div style={{ position: 'absolute', left: 0, top: 0, width: 44, height: 72, background: '#2f3a2a' }} />
                    <div style={{ position: 'absolute', left: 48, top: 0, width: 44, height: 72, background: '#3a2a2f' }} />
                  </>
                ) : i === 1 ? (
                  <>
                    <Figur x={22} y={60} s={0.3} fase={0.2} />
                    <Figur x={70} y={86} s={0.55} fase={0.2} />
                  </>
                ) : (
                  <>
                    <Figur x={22} y={60} s={0.3} fase={(t * 1.6) % 1} />
                    <Figur x={70} y={86} s={0.55} fase={(t * 1.6 + 0.05) % 1} />
                  </>
                )}
                <div style={{ position: 'absolute', left: 44, top: 0, width: 4, height: 72, background: KD.amber }} />
              </div>
            </Muncul>
            <Batang x={160} y={96 + i * 128} panjang={540} tebal={40} nilai={b.nilai} maks={36} m={b.m - 0.1} tampil={b.aktif + 0.1} lama={0.9} desimal={1} label={b.label} warna={i === 2 ? KD.koral : KD.amber} ukuranAngka={52} ukuranLabel={24} redup={redup} />
          </React.Fragment>
        );
      })}
      <PopT m={T.n324 + 0.9} x={MW - 130} y={462}>
        <div style={{ padding: '6px 16px', borderRadius: 12, background: KD.koral, fontFamily: INTER, fontWeight: 800, fontSize: 24, color: KD.latar, rotate: '-4deg', whiteSpace: 'nowrap' }}>±1 dari 3</div>
      </PopT>
    </Babak>
  );
};

// S8: kedip pas cut ≈ 1%, kebanyakan karena fokus ke cerita ------------------------------------------------------------
const Mata: React.FC<{ x: number; y: number; s: number; tutup: number; lirik: number }> = ({ x, y, s, tutup, lirik }) => {
  const almond = `M ${-100} 0 Q 0 ${-70} 100 0 Q 0 ${62} -100 0 Z`;
  return (
    <svg style={{ position: 'absolute', left: x - 110 * s, top: y - 80 * s, overflow: 'visible' }} width={220 * s} height={160 * s} viewBox="-110 -80 220 160">
      <clipPath id="k6mata">
        <path d={almond} />
      </clipPath>
      <path d={almond} fill="#e8e0d0" />
      <g clipPath="url(#k6mata)">
        <circle cx={lirik * 34} cy={0} r={34} fill="#5a3f28" />
        <circle cx={lirik * 34} cy={0} r={16} fill="#110c08" />
        <circle cx={lirik * 34 + 10} cy={-10} r={6} fill="#fff6e8" />
        <rect x={-110} y={-80} width={220} height={150 * tutup} fill="#7a5c45" />
      </g>
      <path d={almond} fill="none" stroke="#1c1410" strokeWidth={6} />
    </svg>
  );
};
const B8: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const kedip = Math.sin(Math.PI * maju(t, T.kedipan8 + 0.3, T.kedipan8 + 0.55, EASE.linear)) + Math.sin(Math.PI * maju(t, T.n1 + 0.1, T.n1 + 0.35, EASE.linear));
  const lirik = maju(t, T.fokus - 0.3, T.fokus, EASE.kamera);
  return (
    <Babak dari={S[8].mulai} sampai={S[9].mulai}>
      <Mata x={200} y={180} s={1.2} tutup={Math.min(1, kedip)} lirik={lirik} />
      <div style={{ position: 'absolute', left: 60, top: 330, width: 320 }}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 24, color: KD.tulang, opacity: maju(t, T.kedipan8, T.kedipan8 + 0.3) }}>kedip pas cut</div>
        <div style={{ position: 'relative', marginTop: 10, width: 300, height: 34, borderRadius: 17, background: 'rgba(239,235,226,0.08)', opacity: maju(t, T.kedipan8, T.kedipan8 + 0.3) }}>
          <div style={{ width: 300 * 0.012 * 3 * maju(t, T.n1 - 0.1, T.n1 + 0.4), minWidth: t > T.n1 ? 8 : 0, height: 34, borderRadius: 17, background: KD.amber }} />
          <div style={{ position: 'absolute', left: 30, top: 0, fontFamily: ANTON, fontSize: 30, color: KD.amber, opacity: maju(t, T.n1, T.n1 + 0.2), display: 'flex', alignItems: 'center', height: 34 }}>
            <KiraInline />
            1%
          </div>
        </div>
      </div>
      {/* layar cerita (yang dipelototin penonton) */}
      <Muncul m={T.kebanyakan - 0.1} x={470} y={70}>
        <div style={{ width: 380, height: 240, borderRadius: 12, overflow: 'hidden', background: '#2c2219', boxShadow: `0 0 0 ${t > T.fokus ? 5 : 2}px ${t > T.fokus ? KD.amber : 'rgba(199,159,85,0.5)'}`, position: 'relative' }}>
          <Figur x={110} y={200} s={0.75} fase={(t * 0.8) % 1} lari={0.4} />
          <Figur x={270} y={200} s={0.75} fase={(t * 0.8 + 0.5) % 1} lari={0.4} warna={KD.amber} />
          <div style={{ position: 'absolute', left: 150, top: 40, padding: '6px 14px', borderRadius: 14, background: '#efebe2', fontFamily: INTER, fontWeight: 800, fontSize: 22, color: KD.latar }}>…!</div>
        </div>
      </Muncul>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d="M 320 150 Q 400 120 460 160" mulai={T.fokus - 0.2} lama={0.3} warna={KD.amber} tebal={6} />
      </svg>
      <Chip x={660} y={360} teks="fokus ke cerita" ukuran={30} isi o={maju(t, T.fokus, T.fokus + 0.2)} />
      <Tag x={470} y={410} teks="kebanyakan cut kelewat karena ini" o={maju(t, T.cerita, T.cerita + 0.3)} />
    </Babak>
  );
};

// S9: buat kreator — potong pas ada gerakan ----------------------------------------------------------------------------
const B9: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  return (
    <Babak dari={S[9].mulai} sampai={S[10].mulai}>
      <SambungGerak x={80} y={70} w={560} h={300} seed="b9" ketahuan={0} />
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d="M 190 120 Q 300 40 420 110" mulai={T.gerakan9 - 0.1} lama={0.35} warna={KD.amber} tebal={6} />
        <path d="M 404 92 L 424 112 L 398 120" fill="none" stroke={KD.amber} strokeWidth={6} strokeLinecap="round" opacity={maju(t, T.gerakan9 + 0.2, T.gerakan9 + 0.3)} />
      </svg>
      {/* gunting di titik sambung */}
      <PopT m={T.motong} x={360} y={52}>
        <svg width={60} height={60} viewBox="-20 -20 40 40">
          <circle cx={-8} cy={-8} r={6} fill="none" stroke={KD.amber} strokeWidth={3.5} />
          <circle cx={8} cy={-8} r={6} fill="none" stroke={KD.amber} strokeWidth={3.5} />
          <path d="M -4 -4 L 10 14 M 4 -4 L -10 14" stroke={KD.amber} strokeWidth={3.5} strokeLinecap="round" />
        </svg>
      </PopT>
      <Chip x={360} y={410} teks="potong pas ada gerakan" ukuran={30} isi o={maju(t, T.gerakan9, T.gerakan9 + 0.2)} />
      <Muncul m={T.susah - 0.1} x={680} y={170}>
        <div style={{ width: 190, fontFamily: INTER, fontWeight: 800, fontSize: 28, color: KD.tulang, lineHeight: 1.2 }}>sambungan lebih susah disadari</div>
      </Muncul>
      <Centang x={720} y={300} s={60} mulai={T.susah + 0.15} tebal={10} />
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
        label={['PENONTON', 'YANG', 'NYARI', 'CUT']}
        lMulai={0.15}
        judul={[{ t: '1/3', mulai: 0.28, isi: sorot('1/3', T.sepertiga, KD.koral) }, { t: 'CUT', mulai: 0.36 }, { t: 'GAK', mulai: 0.44 }, { t: 'KETAHUAN', mulai: 0.52 }]}
        jMulai={0.28}
        keluar={S[1].mulai - 0.2}
        catatan="cut yang nyambung sama gerakan"
        cMulai={T.gerakan0 - 0.3}
      />
      <JudulKD
        label={['SMITH', '&', 'HENDERSON,', 'EDINBURGH']}
        lMulai={S[1].mulai}
        judul={[{ t: 'EDIT', mulai: T.edit1 }, { t: 'BLINDNESS', mulai: T.blindness, isi: sorot('BLINDNESS', T.blindness + 0.15) }, { t: '·', mulai: T.th2008 - 0.1, warna: KD.abu }, { t: '2008', mulai: T.th2008 }]}
        jMulai={T.edit1}
        keluar={S[2].mulai - 0.2}
      />
      <JudulKD
        label={['PESERTA', 'RISET']}
        lMulai={S[2].mulai}
        judul={[{ t: '7', mulai: T.tujuh }, { t: 'ORANG', mulai: T.tujuh + 0.1 }, { t: '·', mulai: T.lima - 0.1, warna: KD.abu }, { t: '7', mulai: T.tujuh2 }, { t: 'FILM', mulai: T.tujuh2 + 0.1 }, { t: '·', mulai: T.lima - 0.05, warna: KD.abu }, { t: '5', mulai: T.lima }, { t: 'MENIT', mulai: T.lima + 0.1 }]}
        jMulai={T.tujuh}
        keluar={S[3].mulai - 0.2}
        ukuran={100}
      />
      <JudulKD
        label={['TUGASNYA', 'CUMA', 'SATU']}
        lMulai={S[3].mulai}
        judul={[{ t: 'LIHAT', mulai: S[3].mulai + 0.3 }, { t: 'CUT', mulai: S[3].mulai + 0.4 }, { t: '→', mulai: T.pencet - 0.1, isi: <PanahInline /> }, { t: 'PENCET', mulai: T.pencet, isi: sorot('PENCET', T.pencet + 0.15) }, { t: 'TOMBOL', mulai: T.tombol }]}
        jMulai={S[3].mulai + 0.3}
        keluar={S[4].mulai - 0.2}
      />
      <JudulKD
        label={['SECARA', 'KESELURUHAN']}
        lMulai={S[4].mulai}
        judul={[{ t: '15,8%', mulai: T.n158, isi: sorot('15,8%', T.n158 + 0.2, KD.koral) }, { t: 'KELEWAT', mulai: T.gak4 }]}
        jMulai={T.n158}
        keluar={S[5].mulai - 0.2}
        ukuran={124}
      />
      <JudulKD
        label={['CUT', 'PINDAH', 'ADEGAN']}
        lMulai={S[5].mulai}
        judul={[{ t: 'BEDA', mulai: T.adegan5 - 0.1 }, { t: 'ADEGAN:', mulai: T.adegan5 }, { t: '9,4%', mulai: T.n94, isi: sorot('9,4%', T.n94 + 0.2) }]}
        jMulai={T.adegan5 - 0.1}
        keluar={S[6].mulai - 0.2}
      />
      <JudulKD
        label={['CUT', 'PINDAH', 'SUDUT', 'KAMERA']}
        lMulai={S[6].mulai}
        judul={[{ t: 'BEDA', mulai: T.sudut - 0.1 }, { t: 'SUDUT:', mulai: T.sudut }, { t: '25,1%', mulai: T.n251, isi: sorot('25,1%', T.n251 + 0.2) }]}
        jMulai={T.sudut - 0.1}
        keluar={S[7].mulai - 0.2}
      />
      <JudulKD
        label={['PALING', 'TINGGI']}
        lMulai={S[7].mulai}
        judul={[{ t: 'MATCH', mulai: T.match }, { t: 'ACTION:', mulai: T.match + 0.15 }, { t: '32,4%', mulai: T.n324, isi: sorot('32,4%', T.n324 + 0.2, KD.koral) }]}
        jMulai={T.match}
        keluar={S[8].mulai - 0.2}
        catatan="cut yang jatuh pas ada gerakan"
        cMulai={T.gerakan7 - 0.3}
      />
      <JudulKD
        label={['KEDIPAN', 'PENONTON']}
        lMulai={S[8].mulai}
        judul={[{ t: 'KEDIP', mulai: T.kedipan8 }, { t: 'PAS', mulai: T.kedipan8 + 0.1 }, { t: 'CUT', mulai: T.kedipan8 + 0.2 }, { t: '≈', mulai: T.n1 - 0.1, isi: <KiraInline /> }, { t: '1%', mulai: T.n1, isi: sorot('1%', T.n1 + 0.15) }]}
        jMulai={T.kedipan8}
        keluar={S[9].mulai - 0.2}
        catatan="kebanyakan kelewat karena fokus ke cerita"
        cMulai={T.kebanyakan}
      />
      <JudulKD
        label={['BUAT', 'KREATOR']}
        lMulai={S[9].mulai}
        judul={[{ t: 'POTONG', mulai: T.motong }, { t: 'PAS', mulai: T.motong + 0.15 }, { t: 'ADA', mulai: T.gerakan9 - 0.15 }, { t: 'GERAKAN', mulai: T.gerakan9, isi: sorot('GERAKAN', T.gerakan9 + 0.15) }]}
        jMulai={T.motong}
        keluar={S[10].mulai - 0.2}
      />
      <JudulKD
        label={['SIMPAN', 'BUAT', 'LATIHAN', 'MOTONG']}
        lMulai={S[10].mulai}
        judul={[{ t: 'SIMPAN', mulai: S[10].mulai + 0.2 }, { t: '·', mulai: S[10].mulai + 0.3, warna: KD.abu }, { t: 'FOLLOW', mulai: follow, isi: sorot('FOLLOW', follow + 0.15) }]}
        jMulai={S[10].mulai + 0.2}
        keluar={T.pulang - 0.15}
      />
    </>
  );
};

void Silang;
