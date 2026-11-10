// Frame hero (pembuka, tengah, puncak): 15, 811, 1352.
// contoh video explainer K8 (akun generik, konten contoh): "69% orang nonton video tanpa suara di tempat umum".
// Seri "meja editor amber" (panggung.tsx). Semua gambar = ilustrasi vektor (HP, ikon, piktogram orang).
// Alur: cincin 69% + HP mute di kereta (hook) → slate survei Verizon Media & Publicis Media, 5.616 orang, April 2019 → rumah 25% →
// batang alasan 38 / 31 / 29 / 28% → progress video + CC, 80% sampai habis → 10 orang, 8 nyala = 80% gak punya gangguan dengar →
// HP mute + subtitle 29% vs HP suara nyala 37% → CTA.
// Fakta: infografis Verizon Media & Publicis Media "Relationship of Video, Sound and Captions Insights Study" (April 2019);
// Streaming Media 20/05/2019 (5.616 orang dewasa AS umur 18–54). Angka = pengakuan responden survei.
import React, { useMemo } from 'react';
import { useVideoConfig } from 'remotion';
import { AngkaJalan, EASE, GarisDigambar, maju, useDetik } from "../../src/gerak";
import { ANTON, INTER } from "../../src/gerak/seri/meja-editor/font";
import { bunyi, Chip, JudulKD, KD, SlateKD, sorot } from "../../src/gerak/seri/meja-editor/seri";
import { Babak, Batang, Cincin, dasarWaktu, latarSlate, MH, Muncul, MW, Orang, Panggung, Tag, type DataKD } from "../../src/gerak/seri/meja-editor/panggung";

export type DataK8 = DataKD;

function waktuK8(d: DataKD, total: number) {
  const B = dasarWaktu(d, total);
  const { k } = B;
  return {
    ...B,
    n69: k('69', 0, 0.1), amerika: k('amerika', 0, 1.8), tanpa0: k('tanpa', 0, 2.8), umum: k('umum', 0, 4),
    survei: k('survei', 1, 0.6), verizon: k('verizon', 1, 1), publicis: k('publicis', 1, 2), n5616: k('5616', 1, 3), n18: k('18', 1, 4.6), april: k('april', 1, 6), th2019: k('2019', 1, 6.4),
    pribadi: k('pribadi', 2, 1), n25: k('25', 2, 1.6),
    alasan: k('alasan', 3, 0.1), tenang: k('tenang', 3, 2.6), n38: k('38', 3, 3),
    headphone: k('headphone', 4, 0.8), n31: k('31', 4, 1.4), ngantre: k('ngantre', 4, 2.4), n29: k('29', 4, 2.9), ngerjain: k('ngerjain', 4, 4), n28: k('28', 4, 5),
    n80: k('80', 5, 0.1), habis: k('habis', 5, 3.2), subtitle5: k('subtitle', 5, 4),
    pakai6: k('pakai', 6, 0.8), n80b: k('80', 6, 1.8), gangguan: k('gangguan', 6, 3),
    n29b: k('29', 7, 0.1), ngikutin: k('ngikutin', 7, 2.4), mati: k('mati', 7, 3.6),
    n37: k('37', 8, 0.6), nyalain: k('nyalain', 8, 1.6), tertarik: k('tertarik', 8, 3.6),
  };
}
type WK = ReturnType<typeof waktuK8>;

export const ContohTanpaSuara: React.FC<DataK8> = (d) => {
  const { durationInFrames, fps } = useVideoConfig();
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuK8(d, total), [d, total]);
  const S = T.s;
  return (
    <Panggung
      d={d}
      T={T}
      folder="k8"
      labelKlip={['69% tanpa suara', 'survei 2019', 'pribadi 25%', 'tenang 38%', '31 · 29 · 28%', '80% habis', '80% dengar', '29% ngikutin', '37% nyalain', 'simpan']}
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
        </>
      }
      hud={<Hud T={T} />}
      sumber={() => 'Sumber: survei Verizon Media & Publicis Media, April 2019 (AS)'}
      tagMonitor={() => 'ILUSTRASI'}
      getar={[{ t: T.th2019 + 0.02, kuat: 8 }]}
      sfx={[
        bunyi('tik', T.n69, 0.3),
        bunyi('pop', T.tanpa0 + 0.05, 0.3),
        bunyi('whooshA', S[1].mulai - 0.05, 0.3),
        bunyi('jepret', T.th2019, 0.55),
        bunyi('hantam', T.th2019 + 0.02, 0.32),
        bunyi('pop', T.n25, 0.28),
        bunyi('tik', T.n38, 0.3),
        bunyi('tik', T.n31, 0.28),
        bunyi('tik', T.n29, 0.28),
        bunyi('tik', T.n28, 0.28),
        bunyi('whooshLembut', T.n80 - 0.1, 0.25),
        bunyi('kunci', T.habis + 0.1, 0.32),
        ...Array.from({ length: 8 }, (_, i) => bunyi('tik', T.n80b + i * 0.08, 0.12)),
        bunyi('pop', T.n29b, 0.28),
        bunyi('pop', T.n37, 0.28),
        bunyi('whooshTerang', T.nyalain + 0.1, 0.25),
      ]}
    />
  );
};

// ======================================================================================================
/** Ikon speaker: mute (dicoret) atau nyala (gelombang). */
export const Speaker: React.FC<{ x: number; y: number; s?: number; nyala: number; mute: number }> = ({ x, y, s = 1, nyala, mute }) => {
  const t = useDetik();
  return (
    <svg style={{ position: 'absolute', left: x - 50 * s, top: y - 40 * s, overflow: 'visible' }} width={100 * s} height={80 * s} viewBox="-50 -40 100 80">
      <path d="M -40 -12 H -22 L 0 -32 V 32 L -22 12 H -40 Z" fill={KD.tulang} />
      {nyala > 0
        ? [0, 1, 2].map((i) => {
            const r = 14 + i * 12 + ((t * 30) % 12) * 0;
            return <path key={i} d={`M ${8 + i * 10} ${-r * 0.8} Q ${18 + i * 14} 0 ${8 + i * 10} ${r * 0.8}`} stroke={KD.amber} strokeWidth={6} fill="none" strokeLinecap="round" opacity={nyala * (0.5 + 0.5 * Math.sin(t * 8 - i))} />;
          })
        : null}
      {mute > 0 ? <path d={`M 10 -20 L ${10 + 34 * mute} ${-20 + 40 * mute} M ${44} -20 L ${44 - 34 * mute} ${-20 + 40 * mute}`} stroke={KD.koral} strokeWidth={7} strokeLinecap="round" /> : null}
    </svg>
  );
};

/** HP kecil berisi video (figur bergerak), opsional subtitle. */
export const HpMini: React.FC<{ x: number; y: number; w: number; h: number; subtitle?: number; children?: React.ReactNode }> = ({ x, y, w, h, subtitle = 0, children }) => {
  const t = useDetik();
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 26, background: '#0a0a0c', border: '7px solid #2a282e', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: h * 0.62, background: 'linear-gradient(160deg, #4a3826, #2a2119)' }}>
        <div style={{ position: 'absolute', left: w * 0.3 + Math.sin(t * 1.4) * w * 0.12, top: h * 0.16, width: w * 0.34, height: w * 0.34, borderRadius: '50%', background: '#e8b98f' }} />
        <div style={{ position: 'absolute', left: w * 0.18 + Math.sin(t * 1.4) * w * 0.12, top: h * 0.16 + w * 0.36, width: w * 0.58, height: h * 0.3, borderRadius: '40% 40% 0 0', background: KD.amberTua }} />
      </div>
      {subtitle > 0 ? (
        <div style={{ position: 'absolute', left: 10, right: 10, top: h * 0.66, opacity: subtitle }}>
          <div style={{ height: 12, borderRadius: 6, background: KD.tulang, width: '92%', margin: '0 auto' }} />
          <div style={{ height: 12, borderRadius: 6, background: KD.amber, width: '64%', margin: '8px auto 0' }} />
        </div>
      ) : null}
      {children}
    </div>
  );
};

// S0 (pembuka): 69% + HP mute di kereta ---------------------------------------------------------------------------------
const B0: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const mute = maju(t, T.tanpa0, T.tanpa0 + 0.2, EASE.kamera);
  return (
    <Babak dari={0} sampai={S[1].mulai} tanpaSapu latar="#0f0e12">
      <Cincin x={220} y={240} r={150} nilai={69} m={Math.max(0.2, T.n69 - 0.1)} lama={1.2} tebal={34} ukuran={96} bawah="ngaku tanpa suara" />
      {/* kereta: pegangan + kursi + penumpang */}
      <div style={{ position: 'absolute', left: 430, top: 40, width: 440, height: 420, borderRadius: 14, background: '#17161a', overflow: 'hidden', boxShadow: 'inset 0 0 0 2px rgba(199,159,85,0.4)' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 50, height: 8, background: '#3a383e' }} />
        {[60, 180, 300].map((x, i) => (
          <div key={i} style={{ position: 'absolute', left: x + Math.sin(t * 1.5 + i) * 3, top: 58, width: 4, height: 50, background: '#5a5860' }}>
            <div style={{ position: 'absolute', left: -14, top: 48, width: 32, height: 32, borderRadius: 16, border: '5px solid #5a5860' }} />
          </div>
        ))}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 90, background: '#221f1a' }} />
        {[70, 150, 360].map((x, i) => (
          <Orang key={i} x={x} y={300 + Math.sin(t * 1.5 + i) * 2} s={2.2} warna="#3e3b44" />
        ))}
      </div>
      <HpMini x={540} y={110} w={200} h={320}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 22, display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 100, height: 80 }}>
            <Speaker x={50} y={40} s={0.9} nyala={0} mute={mute} />
          </div>
        </div>
      </HpMini>
      <Tag x={450} y={430} teks="tempat umum" o={maju(t, T.umum - 0.1, T.umum + 0.15)} warna={KD.amber} />
    </Babak>
  );
};

// S1: slate survei ------------------------------------------------------------------------------------------------------
const B1: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  return (
    <Babak dari={S[1].mulai} sampai={S[2].mulai}>
      {latarSlate(maju(t, S[1].mulai - 0.1, S[1].mulai + 0.2))}
      <SlateKD
        x={MW / 2}
        y={MH / 2 + 4}
        w={600}
        masuk={S[1].mulai - 0.05}
        tepuk={T.th2019}
        keluar={S[2].mulai + 0.3}
        baris={[
          { label: 'SURVEI', isi: 'Verizon Media & Publicis Media', mulai: T.verizon - 0.05 },
          { label: 'RESPONDEN', isi: '5.616 orang · 18–54 th', mulai: T.n5616 - 0.05 },
          { label: 'WAKTU', isi: 'April 2019 · AS', mulai: T.april - 0.05, warna: KD.amber },
        ]}
      />
    </Babak>
  );
};

// S2: tempat pribadi 25% -----------------------------------------------------------------------------------------------
const B2: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  return (
    <Babak dari={S[2].mulai} sampai={S[3].mulai}>
      {/* rumah digambar */}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d="M 70 230 L 250 90 L 430 230 M 100 210 V 430 H 400 V 210" mulai={S[2].mulai + 0.1} lama={0.5} warna={KD.emas} tebal={8} />
      </svg>
      <div style={{ position: 'absolute', left: 130, top: 330, width: 240, height: 70, borderRadius: '24px 24px 8px 8px', background: '#4a3a2c', opacity: maju(t, S[2].mulai + 0.4, S[2].mulai + 0.6) }} />
      <HpMini x={208} y={220} w={86} h={140}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 4, display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 50, height: 40 }}>
            <Speaker x={25} y={20} s={0.45} nyala={0} mute={maju(t, T.n25 + 0.2, T.n25 + 0.4)} />
          </div>
        </div>
      </HpMini>
      <Tag x={150} y={450} teks="tempat pribadi" o={maju(t, T.pribadi - 0.1, T.pribadi + 0.15)} warna={KD.amber} />
      <Cincin x={660} y={250} r={150} nilai={25} m={T.n25 - 0.1} lama={1} tebal={34} ukuran={96} bawah="tetap tanpa suara" />
    </Babak>
  );
};

// S3–S4: alasan 38 / 31 / 29 / 28% ---------------------------------------------------------------------------------------
const B3: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const baris = [
    { label: 'lagi di tempat yang harus tenang', nilai: 38, m: T.n38 },
    { label: 'gak bawa headphone', nilai: 31, m: T.n31 },
    { label: 'lagi ngantre', nilai: 29, m: T.n29 },
    { label: 'lagi ngerjain hal lain', nilai: 28, m: T.n28 },
  ];
  return (
    <Babak dari={S[3].mulai} sampai={S[5].mulai} zoom={0.02}>
      <Tag x={40} y={46} teks="ALASAN NONTON TANPA SUARA" o={1} />
      {baris.map((b, i) => (
        <Batang key={i} x={60} y={92 + i * 98} panjang={560} tebal={34} nilai={b.nilai} maks={42} m={b.m - 0.1} tampil={S[3].mulai + 0.15 + i * 0.12} lama={0.8} label={b.label} warna={i === 0 ? KD.amber : KD.emas} ukuranAngka={46} ukuranLabel={24} redup={i === 0 && t > S[4].mulai ? 0.4 : 0} />
      ))}
      <Chip x={760} y={120} teks="paling banyak" ukuran={22} isi o={maju(t, T.n38 + 0.5, T.n38 + 0.7) * (1 - maju(t, S[4].mulai, S[4].mulai + 0.2))} />
    </Babak>
  );
};

// S5: 80% nonton sampai habis kalau ada subtitle --------------------------------------------------------------------------------
const B5: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const cc = maju(t, S[5].mulai + 0.3, S[5].mulai + 0.5);
  const prog = maju(t, S[5].mulai + 0.5, T.habis + 0.3, EASE.kamera);
  return (
    <Babak dari={S[5].mulai} sampai={S[6].mulai}>
      <div style={{ position: 'absolute', left: 40, top: 60, width: 440, height: 300, borderRadius: 12, overflow: 'hidden', background: 'linear-gradient(160deg, #4a3826, #2a2119)', boxShadow: '0 0 0 3px rgba(199,159,85,0.6)' }}>
        <div style={{ position: 'absolute', left: 30, right: 30, bottom: 64, textAlign: 'center', opacity: cc }}>
          <span style={{ background: 'rgba(0,0,0,0.75)', padding: '4px 12px', borderRadius: 6, fontFamily: INTER, fontWeight: 800, fontSize: 24, color: KD.tulang }}>teks subtitle di sini</span>
        </div>
        <div style={{ position: 'absolute', left: 20, right: 20, bottom: 22, height: 10, borderRadius: 5, background: 'rgba(239,235,226,0.25)' }}>
          <div style={{ width: `${(prog * 100).toFixed(1)}%`, height: 10, borderRadius: 5, background: KD.amber }} />
          <div style={{ position: 'absolute', left: `calc(${(prog * 100).toFixed(1)}% - 10px)`, top: -6, width: 22, height: 22, borderRadius: 11, background: KD.amber }} />
        </div>
        <div style={{ position: 'absolute', right: 16, top: 14, padding: '2px 10px', borderRadius: 6, border: `3px solid ${cc > 0.5 ? KD.amber : KD.abu}`, background: cc > 0.5 ? KD.amber : 'transparent', fontFamily: INTER, fontWeight: 800, fontSize: 22, color: cc > 0.5 ? KD.latar : KD.abu }}>CC</div>
      </div>
      <Chip x={420} y={400} teks="sampai habis" ukuran={24} isi o={maju(t, T.habis, T.habis + 0.2)} />
      <Cincin x={700} y={230} r={140} nilai={80} m={T.n80 - 0.1} lama={1} tebal={32} ukuran={92} bawah="lebih mungkin" />
    </Babak>
  );
};

// S6: 10 orang, 8 nyala = 80% gak punya gangguan dengar --------------------------------------------------------------------------
const B6: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const p = maju(t, T.n80b - 0.1, T.n80b + 0.7, EASE.linear);
  const n = Math.floor(p * 8 + 1e-6);
  return (
    <Babak dari={S[6].mulai} sampai={S[7].mulai}>
      <Tag x={60} y={50} teks="10 PENGGUNA SUBTITLE (ILUSTRASI PROPORSI)" o={1} />
      {Array.from({ length: 10 }, (_, i) => (
        <Orang key={i} x={100 + (i % 5) * 120} y={150 + Math.floor(i / 5) * 150} s={2} warna={i < n ? KD.amber : i >= 8 ? '#5f5b63' : '#3a383e'} />
      ))}
      <div style={{ position: 'absolute', left: 660, top: 120, width: 220 }}>
        <AngkaJalan dari={0} ke={80} progress={p} belakang="%" gaya={{ fontFamily: ANTON, fontSize: 110, color: KD.amber, lineHeight: 1 }} />
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.tulang, lineHeight: 1.2, marginTop: 8, opacity: maju(t, T.gangguan - 0.2, T.gangguan + 0.1) }}>gak punya gangguan pendengaran</div>
      </div>
    </Babak>
  );
};

// S7–S8: 29% tetap ngikutin (mute + subtitle) vs 37% jadi nyalain suara -----------------------------------------------------------
const B7: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const nyala = maju(t, T.nyalain, T.nyalain + 0.3);
  return (
    <Babak dari={S[7].mulai} sampai={S[9].mulai} zoom={0.02}>
      <div style={{ position: 'absolute', left: 40 + 207 * (1 - maju(t, S[8].mulai - 0.35, S[8].mulai + 0.15, EASE.kamera)), top: 40, width: 400, height: 420, opacity: 1 - 0.45 * maju(t, S[8].mulai, S[8].mulai + 0.3) }}>
        <HpMini x={20} y={20} w={170} h={290} subtitle={maju(t, S[7].mulai + 0.3, S[7].mulai + 0.5)}>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 10, display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 60, height: 50 }}>
              <Speaker x={30} y={25} s={0.55} nyala={0} mute={1} />
            </div>
          </div>
        </HpMini>
        <div style={{ position: 'absolute', left: 210, top: 60 }}>
          <AngkaJalan dari={0} ke={29} mulai={T.n29b - 0.1} lama={0.8} belakang="%" gaya={{ fontFamily: ANTON, fontSize: 96, color: KD.amber, lineHeight: 1 }} />
          <div style={{ width: 180, fontFamily: INTER, fontWeight: 800, fontSize: 24, color: KD.tulang, lineHeight: 1.2, marginTop: 8, opacity: maju(t, T.ngikutin - 0.2, T.ngikutin + 0.1) }}>tetap ngikutin walau suaranya mati</div>
        </div>
      </div>
      <Muncul m={S[8].mulai - 0.05} x={460} y={40}>
        <div style={{ position: 'relative', width: 400, height: 420 }}>
          <HpMini x={20} y={20} w={170} h={290} subtitle={1}>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 10, display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: 60, height: 50 }}>
                <Speaker x={30} y={25} s={0.55} nyala={nyala} mute={1 - nyala} />
              </div>
            </div>
          </HpMini>
          <div style={{ position: 'absolute', left: 210, top: 60 }}>
            <AngkaJalan dari={0} ke={37} mulai={T.n37 - 0.1} lama={0.8} belakang="%" gaya={{ fontFamily: ANTON, fontSize: 96, color: KD.amber, lineHeight: 1 }} />
            <div style={{ width: 180, fontFamily: INTER, fontWeight: 800, fontSize: 24, color: KD.tulang, lineHeight: 1.2, marginTop: 8, opacity: maju(t, T.nyalain - 0.2, T.nyalain + 0.1) }}>jadi nyalain suara</div>
            <div style={{ width: 180, fontFamily: INTER, fontWeight: 700, fontSize: 20, color: KD.abu, lineHeight: 1.2, marginTop: 8, opacity: maju(t, T.tertarik - 0.2, T.tertarik + 0.1) }}>karena subtitle bikin lebih tertarik</div>
          </div>
        </div>
      </Muncul>
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
        label={['ORANG', 'DEWASA', 'DI', 'AMERIKA']}
        lMulai={0.15}
        judul={[{ t: '69%', mulai: 0.28, isi: sorot('69%', Math.max(0.5, T.n69 + 0.2)) }, { t: 'TANPA', mulai: 0.36 }, { t: 'SUARA', mulai: 0.42 }, { t: 'DI', mulai: 0.48 }, { t: 'TEMPAT', mulai: 0.54 }, { t: 'UMUM', mulai: 0.6 }]}
        jMulai={0.28}
        keluar={S[1].mulai - 0.2}
        ukuran={104}
      />
      <JudulKD
        label={['SURVEI', 'VERIZON', '&', 'PUBLICIS', 'MEDIA']}
        lMulai={S[1].mulai}
        judul={[{ t: '5.616', mulai: T.n5616, isi: sorot('5.616', T.n5616 + 0.2) }, { t: 'ORANG', mulai: T.n5616 + 0.1 }, { t: '·', mulai: T.n18, warna: KD.abu }, { t: 'AS', mulai: T.n18 + 0.1 }, { t: '·', mulai: T.april - 0.1, warna: KD.abu }, { t: '2019', mulai: T.th2019 }]}
        jMulai={T.n5616}
        keluar={S[2].mulai - 0.2}
        catatan="umur 18–54 tahun · angka = pengakuan responden"
        cMulai={T.n18}
      />
      <JudulKD
        label={['BAHKAN']}
        lMulai={S[2].mulai}
        judul={[{ t: 'TEMPAT', mulai: T.pribadi - 0.1 }, { t: 'PRIBADI:', mulai: T.pribadi }, { t: '25%', mulai: T.n25, isi: sorot('25%', T.n25 + 0.15) }]}
        jMulai={T.pribadi - 0.1}
        keluar={S[3].mulai - 0.2}
      />
      <JudulKD
        label={['ALASAN', 'PALING', 'BANYAK']}
        lMulai={S[3].mulai}
        judul={[{ t: 'TEMPAT', mulai: T.tenang - 0.4 }, { t: 'HARUS', mulai: T.tenang - 0.2 }, { t: 'TENANG:', mulai: T.tenang }, { t: '38%', mulai: T.n38, isi: sorot('38%', T.n38 + 0.15) }]}
        jMulai={T.tenang - 0.4}
        keluar={S[4].mulai - 0.2}
      />
      <JudulKD
        label={['ALASAN', 'LAINNYA']}
        lMulai={S[4].mulai}
        judul={[
          { t: 'HEADPHONE', mulai: T.headphone },
          { t: '31%', mulai: T.n31, warna: KD.amber },
          { t: '·', mulai: T.ngantre - 0.1, warna: KD.abu },
          { t: 'NGANTRE', mulai: T.ngantre },
          { t: '29%', mulai: T.n29, warna: KD.amber },
          { t: '·', mulai: T.ngerjain - 0.1, warna: KD.abu },
          { t: 'MULTITASKING', mulai: T.ngerjain },
          { t: '28%', mulai: T.n28, warna: KD.amber },
        ]}
        jMulai={T.headphone}
        keluar={S[5].mulai - 0.2}
        ukuran={84}
      />
      <JudulKD
        label={['KALAU', 'ADA', 'SUBTITLE']}
        lMulai={S[5].mulai}
        judul={[{ t: '80%', mulai: T.n80, isi: sorot('80%', T.n80 + 0.2) }, { t: 'NONTON', mulai: T.n80 + 0.2 }, { t: 'SAMPAI', mulai: T.habis - 0.2 }, { t: 'HABIS', mulai: T.habis }]}
        jMulai={T.n80}
        keluar={S[6].mulai - 0.2}
      />
      <JudulKD
        label={['DARI', 'PENGGUNA', 'SUBTITLE']}
        lMulai={S[6].mulai}
        judul={[{ t: '80%', mulai: T.n80b, isi: sorot('80%', T.n80b + 0.2) }, { t: 'GAK', mulai: T.gangguan - 0.4 }, { t: 'PUNYA', mulai: T.gangguan - 0.25 }, { t: 'GANGGUAN', mulai: T.gangguan }, { t: 'DENGAR', mulai: T.gangguan + 0.2 }]}
        jMulai={T.n80b}
        keluar={S[7].mulai - 0.2}
        ukuran={104}
      />
      <JudulKD
        label={['WALAU', 'SUARANYA', 'MATI']}
        lMulai={S[7].mulai}
        judul={[{ t: '29%', mulai: T.n29b, isi: sorot('29%', T.n29b + 0.2) }, { t: 'TETAP', mulai: T.ngikutin - 0.2 }, { t: 'NGIKUTIN', mulai: T.ngikutin }]}
        jMulai={T.n29b}
        keluar={S[8].mulai - 0.2}
      />
      <JudulKD
        label={['KARENA', 'SUBTITLE']}
        lMulai={S[8].mulai}
        judul={[{ t: '37%', mulai: T.n37, isi: sorot('37%', T.n37 + 0.2) }, { t: 'JADI', mulai: T.nyalain - 0.2 }, { t: 'NYALAIN', mulai: T.nyalain }, { t: 'SUARA', mulai: T.nyalain + 0.2 }]}
        jMulai={T.n37}
        keluar={S[9].mulai - 0.2}
      />
      <JudulKD
        label={['SIMPAN', 'BUAT', 'PENGINGAT']}
        lMulai={S[9].mulai}
        judul={[{ t: 'SIMPAN', mulai: S[9].mulai + 0.2 }, { t: '·', mulai: S[9].mulai + 0.3, warna: KD.abu }, { t: 'FOLLOW', mulai: follow, isi: sorot('FOLLOW', follow + 0.15) }]}
        jMulai={S[9].mulai + 0.2}
        keluar={T.pulang - 0.15}
      />
    </>
  );
};
