// Frame hero (pembuka, tengah, puncak): 15, 859, 1432.
// contoh video explainer K9 (akun generik, konten contoh): "Sejak 31 Maret 2025, view Shorts dihitung begitu video mulai diputar".
// Seri "meja editor amber" (panggung.tsx). Semua tampilan = ilustrasi vektor (HP, penghitung, jendela analytics tiruan, tanpa logo).
// Alur: HP play → 1 view langsung (hook) → diulang = nambah → dulu nunggu beberapa detik → 1 video ke banyak platform → label
// "view lama" jadi ENGAGED VIEWS → jendela Analytics › Advanced Mode → penghasilan & YPP → 24/8/2026 semua format → view naik
// lebih cepat → views vs engaged views (kaca pembesar) → CTA.
// Fakta: TeamYouTube, YouTube Help Community thread 333869549 (26/03/2025) & 433409976 (17/08/2026).
import React, { useMemo } from 'react';
import { useVideoConfig } from 'remotion';
import { AngkaJalan, EASE, GarisDigambar, maju, useDetik } from "../../src/gerak";
import { ANTON, INTER, MONO } from "../../src/gerak/seri/meja-editor/font";
import { bunyi, Centang, Chip, JudulKD, KD, PanahInline, Silang, sorot } from "../../src/gerak/seri/meja-editor/seri";
import { Babak, dasarWaktu, Figur, Muncul, MW, Panggung, PopT, Tag, type DataKD } from "../../src/gerak/seri/meja-editor/panggung";

export type DataK9 = DataKD;

function waktuK9(d: DataKD, total: number) {
  const B = dasarWaktu(d, total);
  const { k } = B;
  return {
    ...B,
    n31: k('31', 0, 0.3), th2025: k('2025', 0, 1.2), satu0: k('satu', 0, 1.6), view0: k('view', 0, 2), mulai0: k('mulai', 0, 3.4), diputar: k('diputar', 0, 3.8), tanpa0: k('tanpa', 0, 4.4), minimal: k('minimal', 0, 4.8),
    diulang: k('diulang', 1, 1), nambah: k('nambah', 1, 1.9),
    setelah: k('setelah', 2, 2), beberapa: k('beberapa', 2, 2.9),
    kreator: k('kreator', 3, 1), sering: k('sering', 3, 2.4), dilihat: k('dilihat', 3, 3.2), upload: k('upload', 3, 4.6), banyak: k('banyak', 3, 5.2),
    lama4: k('lama', 4, 1), engaged4: k('engaged', 4, 2.8),
    stay: k('stay', 5, 2.2), lanjut: k('lanjut', 5, 2.6), analytics: k('analytics', 5, 4.6), advanced: k('advanced', 5, 5.4),
    penghasilan: k('penghasilan', 6, 0.1), partner: k('partner', 6, 2.2), engaged6: k('engaged', 6, 3.6),
    n24: k('24', 7, 0.4), th2026: k('2026', 7, 1.4), semua: k('semua', 7, 3.4), panjang: k('panjang', 7, 4.8), live: k('live', 7, 5.4),
    naik: k('naik', 8, 2.8), cepat: k('cepat', 8, 3.4),
    beneran: k('beneran', 9, 1.4), cek: k('cek', 9, 2.8), engaged9: k('engaged', 9, 3.1), bukan: k('bukan', 9, 4), halaman: k('halaman', 9, 4.8),
  };
}
type WK = ReturnType<typeof waktuK9>;

export const ContohHitungView: React.FC<DataK9> = (d) => {
  const { durationInFrames, fps } = useVideoConfig();
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuK9(d, total), [d, total]);
  const S = T.s;
  return (
    <Panggung
      d={d}
      T={T}
      folder="k9"
      labelKlip={['diputar = 1 view', 'diulang', 'dulu', 'alasan', 'engaged views', 'Analytics', 'YPP', '24/8/2026', 'naik cepat', 'cek engaged', 'simpan']}
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
          <B9 T={T} />
        </>
      }
      hud={<Hud T={T} />}
      sumber={(t) => (t < S[7].mulai ? 'Sumber: TeamYouTube, YouTube Help Community (26/03/2025)' : t < S[9].mulai ? 'Sumber: TeamYouTube, YouTube Help Community (17/08/2026)' : 'Sumber: TeamYouTube (26/03/2025 & 17/08/2026)')}
      tagMonitor={() => 'ILUSTRASI'}
      getar={[{ t: T.diputar + 0.1, kuat: 7 }, { t: T.th2026 + 0.05, kuat: 7 }]}
      sfx={[
        bunyi('klik', Math.max(0.6, Math.min(T.diputar - 0.1, 1.2)), 0.4),
        bunyi('pop', T.diputar, 0.3),
        bunyi('glitch', T.minimal + 0.1, 0.25),
        ...[0, 1, 2].map((i) => bunyi('tik', T.diulang + 0.3 + i * 0.6, 0.25)),
        bunyi('tik', T.beberapa + 0.8, 0.3),
        bunyi('whooshLembut', T.upload, 0.25),
        bunyi('whooshPunch', T.engaged4, 0.3),
        bunyi('pop', T.analytics, 0.28),
        bunyi('kunci', T.engaged6 + 0.1, 0.32),
        bunyi('jepret', T.th2026, 0.4),
        ...[0, 1, 2].map((i) => bunyi('pop', T.semua + 0.2 + i * 0.25, 0.22)),
        bunyi('whooshTerang', T.naik, 0.25),
        bunyi('klik', T.cek, 0.35),
        bunyi('glitch', T.bukan + 0.1, 0.22),
      ]}
    />
  );
};

// ======================================================================================================
/** HP vertikal berisi Short (figur jalan) + bar progres + tombol play di tengah sampai `play`. */
export const HpShort: React.FC<{ x: number; y: number; w: number; h: number; play: number; progres: number; loop?: boolean }> = ({ x, y, w, h, play, progres }) => {
  const t = useDetik();
  const main = t > play;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 30, background: '#0a0a0c', border: '8px solid #2a282e', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.55)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(170deg, #4a3826 0%, #241c15 100%)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: h * 0.2, background: '#382c20' }} />
      <Figur x={w / 2} y={h * 0.78} s={w / 210} fase={main ? (t * 1.4) % 1 : 0.1} tebal={12} />
      <div style={{ position: 'absolute', left: 10, right: 10, bottom: 14, height: 6, borderRadius: 3, background: 'rgba(239,235,226,0.25)' }}>
        <div style={{ width: `${(progres * 100).toFixed(1)}%`, height: 6, borderRadius: 3, background: KD.amber }} />
      </div>
      {!main || t < play + 0.25 ? (
        <div style={{ position: 'absolute', left: w / 2 - 44, top: h / 2 - 60, width: 88, height: 88, borderRadius: 44, background: 'rgba(11,11,14,0.7)', opacity: 1 - maju(t, play, play + 0.25), scale: String(1 + 0.3 * maju(t, play, play + 0.25)) }}>
          <div style={{ position: 'absolute', left: 34, top: 24, width: 0, height: 0, borderLeft: '30px solid #efebe2', borderTop: '20px solid transparent', borderBottom: '20px solid transparent' }} />
        </div>
      ) : null}
    </div>
  );
};

export const Penghitung: React.FC<{ x: number; y: number; n: number; label?: string; warna?: string; ukuran?: number }> = ({ x, y, n, label = 'view', warna = KD.amber, ukuran = 120 }) => (
  <div style={{ position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'baseline', gap: 14 }}>
    <span style={{ fontFamily: ANTON, fontSize: ukuran, color: warna, lineHeight: 1, fontVariantNumeric: 'tabular-nums', minWidth: '0.7em', display: 'inline-block', textAlign: 'right' }}>{n}</span>
    <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: ukuran * 0.3, color: KD.tulang }}>{label}</span>
  </div>
);

// S0 (pembuka): mulai diputar = 1 view --------------------------------------------------------------------------------
const B0: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const play = Math.max(0.6, Math.min(T.diputar - 0.1, 1.2));
  const n = t > play + 0.05 ? 1 : 0;
  const riak = maju(t, T.diputar - 0.05, T.diputar + 0.5, EASE.masuk);
  return (
    <Babak dari={0} sampai={S[1].mulai} tanpaSapu latar="#0f0e12">
      <HpShort x={90} y={34} w={240} h={430} play={play} progres={maju(t, play, play + 6, EASE.linear) * 0.6} />
      <Muncul m={0.2} x={400} y={70}>
        <div style={{ padding: '6px 16px', borderRadius: 10, border: `3px solid ${KD.emas}`, fontFamily: MONO, fontWeight: 700, fontSize: 24, color: KD.tulang }}>sejak 31 Mar 2025</div>
      </Muncul>
      <div style={{ position: 'absolute', left: 400, top: 150, scale: String(1 + 0.25 * Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, (t - play) / 0.3))))), transformOrigin: '0 60%' }}>
        <Penghitung x={0} y={0} n={n} />
      </div>
      {riak > 0 && riak < 1 ? <div style={{ position: 'absolute', left: 470 - 60, top: 230 - 60, width: 120, height: 120, borderRadius: 60, border: `5px solid ${KD.amber}`, scale: String(1 + riak * 2.2), opacity: 1 - riak }} /> : null}
      <Tag x={404} y={300} teks="frame pertama = kehitung" o={maju(t, play + 0.2, play + 0.4)} warna={KD.amber} />
      <Muncul m={T.tanpa0 - 0.1} x={400} y={350}>
        <div style={{ padding: '8px 16px', borderRadius: 12, border: `3px solid ${KD.koral}`, fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.tulang, whiteSpace: 'nowrap' }}>minimal durasi nonton</div>
      </Muncul>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d="M 404 374 L 700 368" mulai={T.minimal + 0.1} lama={0.2} warna={KD.koral} tebal={6} />
      </svg>
      <Chip x={760} y={440} teks="gak ada" ukuran={24} warna={KD.koral} isi o={maju(t, T.minimal + 0.25, T.minimal + 0.4)} />
    </Babak>
  );
};

// S1: diulang = view nambah -------------------------------------------------------------------------------------------
const B1: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const t0 = T.diulang - 0.3;
  const per = 0.6;
  const putaran = Math.max(0, Math.floor((t - t0) / per));
  const progres = t < t0 ? 0.5 : ((t - t0) % per) / per;
  const n = 1 + Math.min(4, putaran);
  return (
    <Babak dari={S[1].mulai} sampai={S[2].mulai}>
      <HpShort x={90} y={34} w={240} h={430} play={S[1].mulai - 1} progres={progres} />
      <svg style={{ position: 'absolute', left: 470, top: 100, overflow: 'visible' }} width={160} height={160} viewBox="-80 -80 160 160">
        <g transform={`rotate(${((t - S[1].mulai) * 220).toFixed(1)})`}>
          <path d="M 0 -60 A 60 60 0 1 1 -52 -30" stroke={KD.amber} strokeWidth={14} fill="none" strokeLinecap="round" />
          <path d="M -70 -50 L -52 -30 L -30 -46" stroke={KD.amber} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
      <Tag x={500} y={270} teks="diulang" o={maju(t, T.diulang - 0.1, T.diulang + 0.1)} warna={KD.amber} />
      <Penghitung x={440} y={310} n={n} label="view" ukuran={110} />
    </Babak>
  );
};

// S2: dulu — baru dihitung setelah beberapa detik ------------------------------------------------------------------------
const B2: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const p = maju(t, S[2].mulai + 0.3, T.beberapa + 1.1, EASE.linear);
  const ambang = 0.62;
  const n = p >= ambang ? 1 : 0;
  return (
    <Babak dari={S[2].mulai} sampai={S[3].mulai} latar="#121114">
      <Tag x={40} y={52} teks="DULU (SEBELUM 31/3/2025)" o={1} warna={KD.abu} />
      <div style={{ position: 'absolute', left: 60, top: 170, width: 560, height: 24, borderRadius: 12, background: 'rgba(239,235,226,0.12)' }}>
        <div style={{ width: `${(p * 100).toFixed(1)}%`, height: 24, borderRadius: 12, background: p >= ambang ? KD.amber : KD.abu }} />
      </div>
      <div style={{ position: 'absolute', left: 60 + 560 * ambang - 3, top: 130, width: 6, height: 104, background: KD.koral }} />
      <div style={{ position: 'absolute', left: 60 + 560 * ambang, top: 250, translate: '-50% 0', fontFamily: INTER, fontWeight: 800, fontSize: 24, color: KD.koral, whiteSpace: 'nowrap', opacity: maju(t, T.setelah - 0.1, T.setelah + 0.2) }}>setelah beberapa detik</div>
      <div style={{ position: 'absolute', left: 60, top: 210, fontFamily: MONO, fontWeight: 700, fontSize: 20, color: KD.abu }}>0:00</div>
      <Penghitung x={660} y={130} n={n} label="view" ukuran={100} warna={n ? KD.amber : KD.abu} />
      <Tag x={60} y={330} teks="sebelum garis merah: belum dihitung" o={maju(t, T.setelah + 0.2, T.setelah + 0.5)} />
    </Babak>
  );
};

// S3: alasan — 1 video ke banyak platform, seberapa sering dilihat ----------------------------------------------------------
const B3: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const tujuan = ['YouTube Shorts', 'platform lain', 'platform lain'];
  return (
    <Babak dari={S[3].mulai} sampai={S[4].mulai}>
      <Muncul m={S[3].mulai + 0.2} x={50} y={150}>
        <div style={{ width: 170, height: 220, borderRadius: 16, background: '#2a2119', boxShadow: `0 0 0 3px ${KD.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
          <div style={{ width: 0, height: 0, borderLeft: '34px solid #efebe2', borderTop: '22px solid transparent', borderBottom: '22px solid transparent' }} />
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 22, color: KD.tulang }}>video kreator</div>
        </div>
      </Muncul>
      {tujuan.map((tj, i) => {
        const y = 60 + i * 140;
        const m = T.upload + i * 0.15;
        return (
          <React.Fragment key={i}>
            <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
              <GarisDigambar d={`M 226 260 Q 320 ${y + 50} 400 ${y + 50}`} mulai={m - 0.1} lama={0.3} warna={i === 0 ? KD.amber : KD.abu} tebal={5} />
            </svg>
            <Muncul m={m + 0.1} x={410} y={y}>
              <div style={{ width: 250, height: 100, borderRadius: 14, background: KD.panel2, border: `3px solid ${i === 0 ? KD.amber : 'rgba(239,235,226,0.2)'}`, display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px', boxSizing: 'border-box' }}>
                <div style={{ width: 36, height: 60, borderRadius: 8, border: `4px solid ${i === 0 ? KD.amber : KD.abu}` }} />
                <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 24, color: KD.tulang }}>{tj}</div>
              </div>
            </Muncul>
          </React.Fragment>
        );
      })}
      {/* mata: seberapa sering dilihat */}
      <PopT m={T.sering - 0.1} x={780} y={110}>
        <svg width={120} height={80} viewBox="-60 -40 120 80">
          <path d="M -54 0 Q 0 -44 54 0 Q 0 44 -54 0 Z" fill="#e8e0d0" />
          <circle cx={0} cy={0} r={20} fill="#3a2a1c" />
          <circle cx={6} cy={-6} r={6} fill="#fff6e8" />
        </svg>
      </PopT>
      <Muncul m={T.dilihat - 0.1} x={700} y={160}>
        <div style={{ width: 170, fontFamily: INTER, fontWeight: 800, fontSize: 24, color: KD.tulang, lineHeight: 1.2, textAlign: 'center' }}>seberapa sering dilihat?</div>
      </Muncul>
    </Babak>
  );
};

// S4: "view lama" jadi ENGAGED VIEWS ---------------------------------------------------------------------------------------
const B4: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const p = maju(t, T.engaged4 - 0.3, T.engaged4 + 0.2, EASE.kamera);
  return (
    <Babak dari={S[4].mulai} sampai={S[5].mulai}>
      <Muncul m={S[4].mulai + 0.15} x={70} y={170}>
        <div style={{ padding: '18px 26px', borderRadius: 16, background: KD.panel2, border: '3px solid rgba(239,235,226,0.3)' }}>
          <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 20, letterSpacing: '0.12em', color: KD.abu }}>HITUNGAN VIEW LAMA</div>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 32, color: KD.tulang, marginTop: 6 }}>dihitung setelah</div>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 32, color: KD.tulang }}>beberapa detik</div>
        </div>
      </Muncul>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d="M 400 250 H 490" mulai={T.lama4} lama={0.25} warna={KD.amber} tebal={8} />
        <path d="M 470 230 L 494 250 L 470 270" stroke={KD.amber} strokeWidth={8} fill="none" strokeLinecap="round" opacity={maju(t, T.lama4 + 0.2, T.lama4 + 0.3)} />
      </svg>
      <div style={{ position: 'absolute', left: 520, top: 160, opacity: p, scale: String(0.8 + 0.2 * p), rotate: `${((1 - p) * -8).toFixed(1)}deg` }}>
        <div style={{ padding: '18px 26px', borderRadius: 16, background: KD.amber, boxShadow: '0 0 40px rgba(255,180,84,0.5)' }}>
          <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 20, letterSpacing: '0.12em', color: '#5a3612' }}>NAMA SEKARANG</div>
          <div style={{ fontFamily: ANTON, fontSize: 64, lineHeight: 1.05, color: KD.latar }}>ENGAGED</div>
          <div style={{ fontFamily: ANTON, fontSize: 64, lineHeight: 1.05, color: KD.latar }}>VIEWS</div>
        </div>
      </div>
      <Tag x={70} y={400} teks="tetap ada, cuma ganti nama" o={maju(t, T.lama4 + 0.3, T.lama4 + 0.6)} warna={KD.amber} />
    </Babak>
  );
};

// S5: jendela Analytics › Advanced Mode -------------------------------------------------------------------------------------
const B5: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const gx = 70;
  const gy = 150;
  const gw = 560;
  const gh = 230;
  const garis = (f: (u: number) => number) => Array.from({ length: 31 }, (_, i) => `${i ? 'L' : 'M'} ${(gx + (i / 30) * gw).toFixed(1)} ${(gy + gh - f(i / 30) * gh).toFixed(1)}`).join(' ');
  return (
    <Babak dari={S[5].mulai} sampai={S[6].mulai}>
      <div style={{ position: 'absolute', left: 30, top: 40, width: MW - 60, height: 420, borderRadius: 14, background: '#121114', boxShadow: 'inset 0 0 0 2px rgba(239,235,226,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', borderBottom: '2px solid rgba(239,235,226,0.1)' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: '#5a5860' }} />
          ))}
          <div style={{ marginLeft: 12, fontFamily: INTER, fontWeight: 800, fontSize: 22, color: KD.tulang, opacity: maju(t, T.analytics - 0.2, T.analytics) }}>
            YouTube Analytics <span style={{ color: KD.amber }}>›</span> <span style={{ color: t > T.advanced ? KD.amber : KD.tulang }}>Advanced Mode</span>
          </div>
        </div>
      </div>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <path d={`M ${gx} ${gy} V ${gy + gh} H ${gx + gw}`} stroke="rgba(239,235,226,0.2)" strokeWidth={3} fill="none" />
        <GarisDigambar d={garis((u) => 0.3 + 0.6 * u + 0.05 * Math.sin(u * 9))} mulai={S[5].mulai + 0.3} lama={0.6} warna={KD.abu} tebal={5} />
        <GarisDigambar d={garis((u) => 0.2 + 0.36 * u + 0.04 * Math.sin(u * 7 + 1))} mulai={T.stay - 0.1} lama={0.6} warna={KD.amber} tebal={7} />
      </svg>
      <Tag x={gx + gw + 14} y={gy + 10} teks="views" o={maju(t, S[5].mulai + 0.7, S[5].mulai + 0.9)} />
      <Tag x={gx + gw + 14} y={gy + 100} teks="engaged" o={maju(t, T.stay + 0.4, T.stay + 0.6)} warna={KD.amber} />
      <Tag x={gx + gw + 14} y={gy + 126} teks="views" o={maju(t, T.stay + 0.4, T.stay + 0.6)} warna={KD.amber} />
      <Chip x={gx + 220} y={gy + gh + 46} teks="penonton yang tetap stay & lanjut nonton" ukuran={24} isi o={maju(t, T.lanjut - 0.1, T.lanjut + 0.15)} />
    </Babak>
  );
};

// S6: penghasilan & YPP tetap pakai engaged views ------------------------------------------------------------------------------
const B6: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  return (
    <Babak dari={S[6].mulai} sampai={S[7].mulai}>
      <Muncul m={T.penghasilan - 0.1} x={60} y={80}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 90, height: 90, borderRadius: 45, background: KD.emas, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ANTON, fontSize: 48, color: KD.latar, boxShadow: 'inset 0 0 0 6px #a4813f' }}>$</div>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 30, color: KD.tulang }}>penghasilan</div>
        </div>
      </Muncul>
      <Muncul m={T.partner - 0.2} x={60} y={260}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 90, height: 90, borderRadius: 18, border: `6px solid ${KD.emas}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ANTON, fontSize: 34, color: KD.emas }}>YPP</div>
          <div style={{ width: 300, fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.tulang, lineHeight: 1.15 }}>syarat masuk YouTube Partner Program</div>
        </div>
      </Muncul>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d="M 360 125 Q 480 140 560 220" mulai={T.engaged6 - 0.2} lama={0.3} warna={KD.amber} tebal={6} />
        <GarisDigambar d="M 470 305 Q 520 290 560 260" mulai={T.engaged6 - 0.05} lama={0.3} warna={KD.amber} tebal={6} />
      </svg>
      <PopT m={T.engaged6} x={700} y={240}>
        <div style={{ padding: '14px 22px', borderRadius: 16, background: KD.amber, fontFamily: ANTON, fontSize: 50, lineHeight: 1.05, color: KD.latar, textAlign: 'center' }}>
          ENGAGED
          <br />
          VIEWS
        </div>
      </PopT>
      <Centang x={700} y={370} s={56} mulai={T.engaged6 + 0.3} tebal={9} />
    </Babak>
  );
};

// S7: 24/8/2026 — semua format -----------------------------------------------------------------------------------------------
const B7: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const format = [
    { nama: 'Shorts', w: 70, h: 120, m: T.semua + 0.2 },
    { nama: 'video panjang', w: 170, h: 100, m: T.panjang - 0.1 },
    { nama: 'live', w: 170, h: 100, m: T.live - 0.1, live: true },
  ];
  return (
    <Babak dari={S[7].mulai} sampai={S[8].mulai}>
      {/* kalender */}
      <Muncul m={T.n24 - 0.15} x={60} y={60}>
        <div style={{ width: 210, borderRadius: 14, overflow: 'hidden', background: '#e9e2d3', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ background: KD.koral, padding: '8px 0', textAlign: 'center', fontFamily: INTER, fontWeight: 800, fontSize: 24, color: KD.latar }}>AGUSTUS 2026</div>
          <div style={{ textAlign: 'center', fontFamily: ANTON, fontSize: 110, lineHeight: 1.1, color: KD.latar }}>24</div>
        </div>
      </Muncul>
      <Tag x={60} y={300} teks="berlaku global" o={maju(t, T.th2026, T.th2026 + 0.3)} warna={KD.amber} />
      {format.map((f, i) => (
        <Muncul key={i} m={f.m} x={330 + i * 190} y={90}>
          <div style={{ width: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ height: 130, display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: f.w, height: f.h, borderRadius: 12, border: `5px solid ${KD.tulang}`, background: '#2a2119' }}>
                {f.live ? <div style={{ position: 'absolute', left: 8, top: 8, padding: '0 8px', borderRadius: 5, background: KD.koral, fontFamily: INTER, fontWeight: 800, fontSize: 16, color: KD.latar }}>LIVE</div> : null}
                <div style={{ position: 'absolute', left: '50%', top: '50%', translate: '-40% -50%', width: 0, height: 0, borderLeft: '22px solid rgba(239,235,226,0.8)', borderTop: '14px solid transparent', borderBottom: '14px solid transparent' }} />
              </div>
            </div>
            <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 24, color: KD.tulang, whiteSpace: 'nowrap' }}>{f.nama}</div>
          </div>
        </Muncul>
      ))}
      {format.map((f, i) => (
        <Centang key={i} x={415 + i * 190} y={330} s={50} mulai={f.m + 0.25} tebal={9} />
      ))}
      <Chip x={600} y={420} teks="mulai diputar = 1 view" ukuran={26} isi o={maju(t, T.semua, T.semua + 0.2)} />
    </Babak>
  );
};

// S8: view naik lebih cepat ----------------------------------------------------------------------------------------------------
const B8: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const gx = 80;
  const gy = 80;
  const gw = 520;
  const gh = 320;
  return (
    <Babak dari={S[8].mulai} sampai={S[9].mulai}>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <path d={`M ${gx} ${gy} V ${gy + gh} H ${gx + gw}`} stroke="rgba(239,235,226,0.25)" strokeWidth={3} fill="none" />
        <GarisDigambar d={`M ${gx} ${gy + gh} L ${gx + gw} ${gy + gh * 0.55}`} mulai={S[8].mulai + 0.3} lama={0.6} warna={KD.abu} tebal={6} />
        <GarisDigambar d={`M ${gx} ${gy + gh} L ${gx + gw * 0.8} ${gy + 10}`} mulai={T.naik - 0.1} lama={0.5} warna={KD.amber} tebal={8} />
      </svg>
      <Tag x={gx + gw - 120} y={gy + gh * 0.55 + 14} teks="cara hitung lama" o={maju(t, S[8].mulai + 0.6, S[8].mulai + 0.9)} />
      <Tag x={gx + gw * 0.8 + 10} y={gy} teks="sekarang" o={maju(t, T.naik + 0.3, T.naik + 0.5)} warna={KD.amber} />
      <div style={{ position: 'absolute', left: 660, top: 120, width: 200 }}>
        <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 20, letterSpacing: '0.1em', color: KD.abu }}>VIEW KREATOR</div>
        <svg width={140} height={150} viewBox="-70 -75 140 150" style={{ marginTop: 10, overflow: 'visible', translate: `0 ${(-Math.abs(Math.sin(t * 4)) * 10 * maju(t, T.naik, T.naik + 0.3)).toFixed(1)}px`, opacity: maju(t, T.naik - 0.1, T.naik + 0.2) }}>
          <path d="M 0 60 V -50 M -40 -10 L 0 -55 L 40 -10" stroke={KD.amber} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M -40 30 L 0 -15 L 40 30" stroke={KD.amber} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
        </svg>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 24, color: KD.tulang, opacity: maju(t, T.cepat - 0.1, T.cepat + 0.15) }}>kemungkinan naik lebih cepat</div>
      </div>
    </Babak>
  );
};

// S9: cek engaged views, bukan angka views di halaman video -------------------------------------------------------------------
const B9: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const kaca = maju(t, T.cek - 0.1, T.engaged9 + 0.3, EASE.kamera);
  return (
    <Babak dari={S[9].mulai} sampai={S[10].mulai}>
      <div style={{ position: 'absolute', left: 60, top: 90, width: 520 }}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.abu }}>views di halaman video</div>
        <div style={{ marginTop: 10, width: 500 * maju(t, S[9].mulai + 0.2, S[9].mulai + 0.8, EASE.kamera), height: 46, borderRadius: 10, background: KD.abu }} />
        <div style={{ marginTop: 40, fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.amber }}>engaged views</div>
        <div style={{ marginTop: 10, width: 290 * maju(t, T.beneran - 0.1, T.beneran + 0.5, EASE.kamera), height: 46, borderRadius: 10, background: KD.amber }} />
        <div style={{ marginTop: 12, fontFamily: INTER, fontWeight: 700, fontSize: 22, color: KD.tulang, opacity: maju(t, T.beneran, T.beneran + 0.3) }}>yang beneran lanjut nonton</div>
      </div>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <g transform={`translate(${(700 - 290 * kaca).toFixed(1)} ${(150 + 120 * kaca).toFixed(1)})`} opacity={Math.min(1, kaca * 4)}>
          <circle cx={0} cy={0} r={56} fill="rgba(255,180,84,0.12)" stroke={KD.amber} strokeWidth={10} />
          <path d="M 40 40 L 90 90" stroke={KD.amber} strokeWidth={16} strokeLinecap="round" />
        </g>
        <GarisDigambar d="M 60 160 L 560 150" mulai={T.bukan + 0.1} lama={0.2} warna={KD.koral} tebal={5} opacity={0.9} />
      </svg>
      <Chip x={700} y={420} teks="cek di sini" ukuran={26} isi o={maju(t, T.engaged9 + 0.2, T.engaged9 + 0.4)} />
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
        label={['SEJAK', '31/3/2025']}
        lMulai={0.15}
        judul={[{ t: 'MULAI', mulai: 0.28 }, { t: 'DIPUTAR', mulai: 0.36 }, { t: '=', mulai: 0.44, warna: KD.amber }, { t: '1', mulai: 0.5, isi: sorot('1', Math.max(0.8, T.diputar)) }, { t: 'VIEW', mulai: 0.56 }]}
        jMulai={0.28}
        keluar={S[1].mulai - 0.2}
        catatan="tanpa minimal durasi nonton"
        cMulai={T.tanpa0}
      />
      <JudulKD
        label={['TIAP', 'KALI', 'SHORT', 'DIULANG']}
        lMulai={S[1].mulai}
        judul={[{ t: 'DIULANG', mulai: T.diulang }, { t: '=', mulai: T.diulang + 0.15, warna: KD.amber }, { t: 'VIEW', mulai: T.nambah - 0.2 }, { t: 'NAMBAH', mulai: T.nambah, isi: sorot('NAMBAH', T.nambah + 0.15) }]}
        jMulai={T.diulang}
        keluar={S[2].mulai - 0.2}
      />
      <JudulKD
        label={['SEBELUMNYA']}
        lMulai={S[2].mulai}
        judul={[{ t: 'DULU:', mulai: S[2].mulai + 0.3 }, { t: 'SETELAH', mulai: T.setelah }, { t: 'BEBERAPA', mulai: T.beberapa }, { t: 'DETIK', mulai: T.beberapa + 0.2 }]}
        jMulai={S[2].mulai + 0.3}
        keluar={S[3].mulai - 0.2}
      />
      <JudulKD
        label={['ALASAN', 'YOUTUBE']}
        lMulai={S[3].mulai}
        judul={[{ t: 'SEBERAPA', mulai: T.sering - 0.3 }, { t: 'SERING', mulai: T.sering, isi: sorot('SERING', T.sering + 0.15) }, { t: 'DILIHAT', mulai: T.dilihat }]}
        jMulai={T.sering - 0.3}
        keluar={S[4].mulai - 0.2}
        catatan="termasuk yang upload di banyak platform"
        cMulai={T.upload}
      />
      <JudulKD
        label={['HITUNGAN', 'LAMA', 'TETAP', 'ADA']}
        lMulai={S[4].mulai}
        judul={[{ t: 'VIEW', mulai: T.lama4 - 0.2 }, { t: 'LAMA', mulai: T.lama4 }, { t: '=', mulai: T.engaged4 - 0.2, warna: KD.amber }, { t: 'ENGAGED', mulai: T.engaged4, isi: sorot('ENGAGED', T.engaged4 + 0.15) }, { t: 'VIEWS', mulai: T.engaged4 + 0.15 }]}
        jMulai={T.lama4 - 0.2}
        keluar={S[5].mulai - 0.2}
      />
      <JudulKD
        label={['PENONTON', 'YANG', 'STAY']}
        lMulai={S[5].mulai}
        judul={[{ t: 'ANALYTICS', mulai: T.analytics }, { t: '›', mulai: T.analytics + 0.15, warna: KD.amber }, { t: 'ADVANCED', mulai: T.advanced, isi: sorot('ADVANCED', T.advanced + 0.15) }, { t: 'MODE', mulai: T.advanced + 0.1 }]}
        jMulai={T.analytics}
        keluar={S[6].mulai - 0.2}
      />
      <JudulKD
        label={['TETAP', 'SAMA']}
        lMulai={S[6].mulai}
        judul={[{ t: 'PENGHASILAN', mulai: T.penghasilan }, { t: '&', mulai: T.partner - 0.3, warna: KD.abu }, { t: 'YPP:', mulai: T.partner }, { t: 'ENGAGED', mulai: T.engaged6, isi: sorot('ENGAGED', T.engaged6 + 0.15) }, { t: 'VIEWS', mulai: T.engaged6 + 0.15 }]}
        jMulai={T.penghasilan}
        keluar={S[7].mulai - 0.2}
        ukuran={100}
      />
      <JudulKD
        label={['MULAI']}
        lMulai={S[7].mulai}
        judul={[{ t: '24/8/2026', mulai: T.n24 }, { t: '·', mulai: T.semua - 0.1, warna: KD.abu }, { t: 'SEMUA', mulai: T.semua }, { t: 'FORMAT', mulai: T.semua + 0.15, isi: sorot('FORMAT', T.semua + 0.3) }]}
        jMulai={T.n24}
        keluar={S[8].mulai - 0.2}
        catatan="termasuk video panjang & live"
        cMulai={T.panjang}
      />
      <JudulKD
        label={['KATA', 'YOUTUBE']}
        lMulai={S[8].mulai}
        judul={[{ t: 'VIEW', mulai: S[8].mulai + 0.3 }, { t: 'NAIK', mulai: T.naik, isi: sorot('NAIK', T.naik + 0.1) }, { t: 'LEBIH', mulai: T.cepat - 0.2 }, { t: 'CEPAT', mulai: T.cepat }]}
        jMulai={S[8].mulai + 0.3}
        keluar={S[9].mulai - 0.2}
        catatan="kemungkinan"
        cMulai={S[8].mulai + 1.4}
      />
      <JudulKD
        label={['MAU', 'TAHU', 'YANG', 'BENERAN', 'NONTON?']}
        lMulai={S[9].mulai}
        judul={[{ t: 'CEK', mulai: T.cek }, { t: 'ENGAGED', mulai: T.engaged9, isi: sorot('ENGAGED', T.engaged9 + 0.15) }, { t: 'VIEWS', mulai: T.engaged9 + 0.15 }]}
        jMulai={T.cek}
        keluar={S[10].mulai - 0.2}
        catatan="bukan angka views di halaman video"
        cMulai={T.bukan}
      />
      <JudulKD
        label={['SIMPAN', 'BUAT', 'BACA', 'ANALYTICS']}
        lMulai={S[10].mulai}
        judul={[{ t: 'SIMPAN', mulai: S[10].mulai + 0.2 }, { t: '·', mulai: S[10].mulai + 0.3, warna: KD.abu }, { t: 'FOLLOW', mulai: follow, isi: sorot('FOLLOW', follow + 0.15) }]}
        jMulai={S[10].mulai + 0.2}
        keluar={T.pulang - 0.15}
      />
    </>
  );
};

void PanahInline;
void Silang;
