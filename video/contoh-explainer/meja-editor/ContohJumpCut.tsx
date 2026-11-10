// Frame hero (pembuka, tengah, puncak): 15, 851, 1418.
// contoh video explainer K10 (akun generik, konten contoh): "Jump cut di Breathless (1960) muncul karena filmnya kelebihan durasi".
// Seri "meja editor amber" (panggung.tsx). Adegan mobil = ILUSTRASI vektor (penumpang rambut pendek, latar jalan), BUKAN cuplikan
// film Breathless. Alur: adegan mobil loncat-loncat + bar durasi kelebihan ±1 jam (hook) → definisi jump cut (awal ✓ tengah ✗ akhir ✓)
// → slate À bout de souffle 1960 → bar 2¼–2½ jam vs kontrak 1½ jam → potong di tiap shot (jaga ritme) → lempar koin → Seberg →
// shot disambung jadi 1 → 7 jump cut beruntun (dugaan Raskin) → kepala · cahaya · latar loncat → CTA.
// Fakta: Godard, Introduction à une véritable histoire du cinéma (1980), dikutip Richard Raskin, P.O.V. No. 6 (Des 1998);
// definisi Penelope Houston (dikutip Raskin); BFI Player (1960, debut panjang Godard).
import React, { useMemo } from 'react';
import { random, useVideoConfig } from 'remotion';
import { EASE, GarisDigambar, maju, noise, useDetik } from "../../src/gerak";
import { ANTON, INTER, MONO } from "../../src/gerak/seri/meja-editor/font";
import { bunyi, Centang, Chip, JudulKD, KD, PanahInline, Silang, SlateKD, sorot } from "../../src/gerak/seri/meja-editor/seri";
import { Babak, dasarWaktu, Figur, latarSlate, MH, Muncul, MW, Panggung, PopT, Tag, type DataKD } from "../../src/gerak/seri/meja-editor/panggung";

export type DataK10 = DataKD;

function waktuK10(d: DataKD, total: number) {
  const B = dasarWaktu(d, total);
  const { k, ks, s } = B;
  const seberg6 = k('seberg', 6, 1.2);
  return {
    ...B,
    godard0: k('godard', 0, 0.4), jump0: k('jump', 0, 0.9), breathless0: k('breathless', 0, 2.2), kelebihan: k('kelebihan', 0, 3.6), satu0: k('satu', 0, 4.8),
    awal: k('awal', 1, 1.6), akhir: k('akhir', 1, 2.2), aksi: k('aksi', 1, 2.8), tanpa1: k('tanpa', 1, 3.2), tengah: k('tengahnya', 1, 3.8),
    bout: k('bout', 2, 1.2), pertama2: k('pertama', 2, 2.6), jean: k('jean', 2, 3), th1960: k('1960', 2, 4.2),
    seperempat: k('seperempat', 3, 2), setengah: k('setengah', 3, 3.2),
    kontrak: k('kontrak', 4, 0.6), satu4: k('satu', 4, 2.6), jam4: k('jam', 4, 3.2),
    motong: k('motong', 5, 1.2), tiap: k('tiap', 5, 3), ritme: k('ritmenya', 5, 4.4),
    belmondo: k('belmondo', 6, 0.5), seberg6, mobil: k('mobil', 6, 1.8), lempar: k('lempar', 6, 2.6), milih: k('milih', 6, 3.4), menang: ks('menang', seberg6, s[6].mulai + 5.6),
    disambung: k('disambung', 7, 1.2), seolah: k('seolah', 7, 2), satu7: k('satu', 7, 2.5),
    raskin: k('raskin', 8, 1.2), menduga: k('menduga', 8, 1.6), tujuh: k('tujuh', 8, 3.8), beruntun: k('beruntun', 8, 4.6),
    kepala: k('kepala', 9, 0.4), cahaya: k('cahaya', 9, 1), latar: k('latar', 9, 1.6), loncat: k('loncat', 9, 2.4),
  };
}
type WK = ReturnType<typeof waktuK10>;

export const ContohJumpCut: React.FC<DataK10> = (d) => {
  const { durationInFrames, fps } = useVideoConfig();
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuK10(d, total), [d, total]);
  const S = T.s;
  return (
    <Panggung
      d={d}
      T={T}
      folder="k10"
      labelKlip={['kelebihan ±1 jam', 'jump cut', 'Breathless 1960', 'versi awal', 'kontrak', 'potong', 'lempar koin', 'disambung', '7 jump cut', 'loncat', 'simpan']}
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
        </>
      }
      hud={<Hud T={T} />}
      sumber={(t) =>
        t < S[2].mulai
          ? 'Sumber: Godard, dikutip Raskin, P.O.V. No. 6 (1998) · ilustrasi'
          : t < S[3].mulai
            ? 'Sumber: BFI · Raskin, P.O.V. No. 6 (1998)'
            : t < S[8].mulai
              ? 'Sumber: Godard (1980), dikutip Raskin, P.O.V. No. 6 (1998)'
              : 'Sumber: Richard Raskin, P.O.V. No. 6 (1998) · ilustrasi'
      }
      tagMonitor={() => 'ILUSTRASI'}
      getar={[{ t: T.th1960 + 0.02, kuat: 8 }, { t: T.menang + 0.05, kuat: 7 }]}
      sfx={[
        ...[0.7, 1.2, 1.7, 2.2].map((x) => bunyi('klik', x, 0.22)),
        bunyi('whooshTurun', T.kelebihan, 0.28),
        bunyi('pop', T.awal, 0.26),
        bunyi('glitch', T.tengah, 0.26),
        bunyi('pop', T.akhir, 0.26),
        bunyi('whooshA', S[2].mulai - 0.05, 0.3),
        bunyi('jepret', T.th1960, 0.55),
        bunyi('hantam', T.th1960 + 0.02, 0.32),
        bunyi('whooshLembut', T.seperempat - 0.2, 0.22),
        bunyi('kunci', T.jam4, 0.35),
        ...[0, 1, 2, 3, 4, 5].map((i) => bunyi('klik', T.motong + 0.2 + i * 0.22, 0.25)),
        bunyi('swish', T.lempar, 0.3),
        bunyi('pop', T.menang + 0.05, 0.34),
        bunyi('whooshPunch', T.disambung, 0.28),
        ...Array.from({ length: 7 }, (_, i) => bunyi('klik', T.tujuh - 0.6 + i * 0.32, 0.26)),
        bunyi('pop', T.kepala, 0.22),
        bunyi('pop', T.cahaya, 0.22),
        bunyi('pop', T.latar, 0.22),
      ]}
    />
  );
};

// ======================================================================================================
/** Pecahan campuran inline (2¼) tanpa glyph khusus. */
const Campuran: React.FC<{ utuh: number; a: number; b: number; warna?: string }> = ({ utuh, a, b, warna }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', color: warna }}>
    {utuh}
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.42em', lineHeight: 0.95, marginLeft: '0.04em' }}>
      <span>{a}</span>
      <span style={{ width: '0.9em', height: '0.1em', background: 'currentColor', margin: '0.05em 0' }} />
      <span>{b}</span>
    </span>
  </span>
);

// Adegan mobil (ilustrasi): penumpang rambut pendek pirang, latar jalan bergerak. Tiap "shot" = posisi kepala, cahaya, latar beda.
const SHOT = [
  { kx: 0.56, rot: -2, cahaya: 0.9, gs: 0 },
  { kx: 0.47, rot: 4, cahaya: 0.35, gs: 160 },
  { kx: 0.6, rot: -6, cahaya: 0.75, gs: 330 },
  { kx: 0.5, rot: 1, cahaya: 0.2, gs: 70 },
  { kx: 0.58, rot: -3, cahaya: 1, gs: 420 },
  { kx: 0.44, rot: 6, cahaya: 0.5, gs: 230 },
  { kx: 0.54, rot: -1, cahaya: 0.85, gs: 40 },
  { kx: 0.62, rot: 3, cahaya: 0.3, gs: 520 },
];
export const AdeganMobil: React.FC<{ W: number; H: number; shot: number; seed?: string }> = ({ W, H, shot, seed = 'am' }) => {
  const t = useDetik();
  const sh = SHOT[((shot % SHOT.length) + SHOT.length) % SHOT.length];
  const geser = sh.gs + t * 60;
  const gedung = Array.from({ length: 16 }, (_, i) => ({ w: 70 + random(`${seed}g${i}w`) * 60, h: 0.25 + random(`${seed}g${i}h`) * 0.45, c: 0.12 + random(`${seed}g${i}c`) * 0.12 }));
  let x = 0;
  const posisi = gedung.map((g) => {
    const p = x;
    x += g.w + 6;
    return p;
  });
  const lebarTotal = x;
  const skala = H / 360;
  const napas = Math.sin(t * 1.7) * 2;
  const kulit = sh.cahaya > 0.6 ? '#e2b48c' : '#b88a68';
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'linear-gradient(180deg, #8a6a46 0%, #4a3a2a 60%, #2a2119 100%)' }}>
      {/* gedung latar (jalan Paris versi ilustrasi), geser terus = mobil jalan */}
      {gedung.map((g, i) => {
        const gx = (((posisi[i] - geser) % lebarTotal) + lebarTotal) % lebarTotal - 140;
        return (
          <div key={i} style={{ position: 'absolute', left: gx, bottom: H * 0.22, width: g.w, height: H * g.h, background: `rgba(30,22,16,${(0.55 + g.c).toFixed(2)})` }}>
            {Array.from({ length: 3 }, (_, j) => (
              <div key={j} style={{ position: 'absolute', left: 10 + j * (g.w / 3.2), top: 14, width: g.w / 6, height: H * g.h - 24, backgroundImage: 'repeating-linear-gradient(180deg, rgba(255,214,160,0.18) 0 10px, transparent 10px 26px)' }} />
            ))}
          </div>
        );
      })}
      {/* cahaya matahari / teduh */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 80% at 80% 10%, rgba(255,214,150,${(0.55 * sh.cahaya).toFixed(2)}), rgba(255,214,150,0) 70%)` }} />
      <div style={{ position: 'absolute', inset: 0, background: `rgba(10,8,6,${(0.45 * (1 - sh.cahaya)).toFixed(2)})` }} />
      {/* penumpang (profil menghadap kiri) */}
      <svg style={{ position: 'absolute', left: W * sh.kx - 100 * skala, bottom: H * 0.1 + napas, overflow: 'visible' }} width={200 * skala} height={260 * skala} viewBox="0 0 200 260">
        <g transform={`rotate(${sh.rot} 100 200)`}>
          <path d="M 10 262 Q 24 186 100 178 Q 176 186 192 262 Z" fill="#1f1d24" />
          <path d="M 30 230 H 170 M 22 248 H 180 M 40 212 H 160" stroke="#e9e2d3" strokeWidth={6} opacity={0.7} />
          <path d="M 84 140 L 84 190 L 122 190 L 120 140 Z" fill={kulit} />
          <ellipse cx={100} cy={104} rx={52} ry={62} fill={kulit} />
          <path d="M 52 98 L 38 122 L 54 126" fill={kulit} stroke={kulit} strokeWidth={2} />
          <path d="M 50 92 Q 46 36 102 34 Q 160 36 158 100 Q 160 142 140 152 Q 150 100 128 70 Q 100 58 72 74 Q 56 82 50 92 Z" fill="#e3c27a" />
          <ellipse cx={70} cy={100} rx={6} ry={4} fill="#1a120c" />
          <path d="M 60 88 Q 70 82 82 88" stroke="#8a6a3a" strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d="M 50 140 Q 56 144 62 140" stroke="#a0524a" strokeWidth={5} fill="none" strokeLinecap="round" />
          <ellipse cx={124} cy={108} rx={9} ry={14} fill={kulit} stroke="#00000022" />
        </g>
      </svg>
      {/* pintu mobil + kaca depan */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: H * 0.2, background: 'linear-gradient(180deg, #2a2420, #15120f)' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 6, background: 'rgba(239,235,226,0.45)' }} />
      </div>
      <div style={{ position: 'absolute', left: W * 0.04, top: 0, bottom: H * 0.2, width: 18, background: '#15120f', rotate: '8deg', transformOrigin: '50% 100%' }} />
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, rgba(0,0,0,0.0), rgba(0,0,0,0.0) 60%, rgba(0,0,0,${(0.2 + noise(`${seed}v`, t * 0.5) * 0.05).toFixed(3)}))` }} />
    </div>
  );
};

/** shot ke-n berdasarkan waktu: ganti tiap `per` detik mulai `t0` (jump cut). */
const shotDi = (t: number, t0: number, per: number) => Math.max(0, Math.floor((t - t0) / per));

// S0 (pembuka): adegan mobil loncat-loncat + bar durasi kelebihan ±1 jam -----------------------------------------------------------
const B0: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const shot = shotDi(t, 0.2, 0.5);
  const panel = maju(t, T.kelebihan - 0.25, T.kelebihan + 0.15, EASE.kamera);
  const jam = (x: number) => 40 + (x / 3) * (MW - 80);
  const pBar = maju(t, T.kelebihan - 0.1, T.kelebihan + 0.6, EASE.kamera);
  return (
    <Babak dari={0} sampai={S[1].mulai} tanpaSapu latar="#0f0e12">
      <AdeganMobil W={MW} H={MH} shot={shot} seed="b0" />
      <Chip x={130} y={62} teks="jump cut" ukuran={26} isi o={maju(t, Math.max(0.4, T.jump0 - 0.1), Math.max(0.6, T.jump0 + 0.1))} />
      {panel > 0 ? (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 170, translate: `0 ${((1 - panel) * 170).toFixed(1)}px`, background: 'rgba(11,11,14,0.92)', borderTop: `3px solid ${KD.emas}` }}>
          <div style={{ position: 'absolute', left: 40, top: 22, fontFamily: INTER, fontWeight: 800, fontSize: 22, color: KD.abu, letterSpacing: '0.08em' }}>DURASI VERSI AWAL vs KONTRAK</div>
          <div style={{ position: 'absolute', left: jam(0), top: 66, width: (jam(1.5) - jam(0)) * Math.min(1, pBar * 1.6), height: 40, borderRadius: '8px 0 0 8px', background: KD.tulang }} />
          <div style={{ position: 'absolute', left: jam(1.5), top: 66, width: (jam(2.5) - jam(1.5)) * maju(pBar, 0.6, 1, EASE.linear), height: 40, borderRadius: '0 8px 8px 0', backgroundImage: `repeating-linear-gradient(-45deg, ${KD.koral} 0 12px, #8a3a2e 12px 24px)` }} />
          <div style={{ position: 'absolute', left: jam(1.5) - 3, top: 52, width: 6, height: 68, background: KD.amber }} />
          <div style={{ position: 'absolute', left: jam(1.5) - 60, top: 124, fontFamily: INTER, fontWeight: 800, fontSize: 20, color: KD.amber, whiteSpace: 'nowrap' }}>kontrak</div>
          <div style={{ position: 'absolute', left: jam(2) - 30, top: 124, fontFamily: INTER, fontWeight: 800, fontSize: 22, color: KD.koral, whiteSpace: 'nowrap', opacity: maju(t, T.satu0 - 0.1, T.satu0 + 0.1) }}>kelebihan ±1 jam</div>
        </div>
      ) : null}
    </Babak>
  );
};

// S1: definisi jump cut — awal ✓ tengah ✗ akhir ✓ ---------------------------------------------------------------------------------
const B1: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const xs = [40, 322, 604];
  const w = 250;
  const h = 250;
  const lab = ['awal', 'tengah', 'akhir'];
  const m = [T.awal, T.tengah, T.akhir];
  const kempis = maju(t, T.tengah + 0.4, T.tengah + 0.9, EASE.kamera);
  return (
    <Babak dari={S[1].mulai} sampai={S[2].mulai}>
      {xs.map((x0, i) => {
        const x = i === 2 ? x0 - kempis * 282 : x0;
        const o = i === 1 ? 1 - kempis : 1;
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: 70, width: w, opacity: o }}>
            <div style={{ position: 'relative', width: w, height: h, borderRadius: 10, overflow: 'hidden', background: '#2a2119', boxShadow: `inset 0 0 0 ${i === 1 && t > T.tengah ? 4 : 2}px ${i === 1 && t > T.tengah ? KD.koral : 'rgba(199,159,85,0.6)'}` }}>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 40, background: '#382c20' }} />
              <Figur x={30 + i * 95} y={h - 40} s={0.95} fase={(i * 0.33 + t * 0.2) % 1} />
              <div style={{ position: 'absolute', right: 20, top: 30, width: 30, height: h - 70, borderRadius: 6, background: '#5a4430', boxShadow: 'inset 0 0 0 3px #3a2c20' }} />
            </div>
            <div style={{ textAlign: 'center', marginTop: 10, fontFamily: INTER, fontWeight: 800, fontSize: 28, color: i === 1 ? KD.koral : KD.tulang, opacity: maju(t, m[i] - 0.1, m[i] + 0.1) }}>{lab[i]}</div>
          </div>
        );
      })}
      <Centang x={165} y={390} s={46} mulai={T.awal + 0.1} tebal={9} />
      <Silang x={447} y={200} s={110} mulai={T.tengah} tebal={12} hapus={T.tengah + 0.4} />
      <Centang x={729 - kempis * 282} y={390} s={46} mulai={T.akhir + 0.1} tebal={9} />
      <Chip x={MW / 2 + 140} y={440} teks="langsung loncat" ukuran={26} isi o={maju(t, T.tengah + 0.8, T.tengah + 1)} />
    </Babak>
  );
};

// S2: slate Breathless 1960 ---------------------------------------------------------------------------------------------------
const B2: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  return (
    <Babak dari={S[2].mulai} sampai={S[3].mulai}>
      {latarSlate(maju(t, S[2].mulai - 0.1, S[2].mulai + 0.2))}
      <SlateKD
        x={MW / 2}
        y={MH / 2 + 4}
        w={580}
        masuk={S[2].mulai - 0.05}
        tepuk={T.th1960}
        keluar={S[3].mulai + 0.3}
        baris={[
          { label: 'JUDUL ASLI', isi: 'À bout de souffle', mulai: T.bout - 0.15 },
          { label: 'SUTRADARA', isi: 'Jean-Luc Godard', mulai: T.jean - 0.05 },
          { label: 'RILIS', isi: '1960', mulai: T.th1960 - 0.05, warna: KD.amber },
        ]}
      />
    </Babak>
  );
};

// S3–S4: bar durasi 2¼–2½ jam vs kontrak 1½ jam -------------------------------------------------------------------------------
const B3: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const jam = (x: number) => 60 + (x / 3) * (MW - 120);
  const p1 = maju(t, S[3].mulai + 0.2, T.seperempat + 0.2, EASE.kamera);
  const p2 = maju(t, T.setengah - 0.1, T.setengah + 0.4, EASE.kamera);
  const k = maju(t, T.kontrak - 0.1, T.kontrak + 0.3, EASE.kamera);
  return (
    <Babak dari={S[3].mulai} sampai={S[5].mulai} zoom={0.02}>
      {/* sumbu jam */}
      <div style={{ position: 'absolute', left: jam(0), top: 330, width: jam(3) - jam(0), height: 3, background: 'rgba(239,235,226,0.35)' }} />
      {[0, 0.5, 1, 1.5, 2, 2.5, 3].map((x) => (
        <React.Fragment key={x}>
          <div style={{ position: 'absolute', left: jam(x) - 1.5, top: 322, width: 3, height: 18, background: 'rgba(239,235,226,0.5)' }} />
          {Number.isInteger(x) ? <div style={{ position: 'absolute', left: jam(x), top: 350, translate: '-50% 0', fontFamily: MONO, fontWeight: 700, fontSize: 20, color: KD.abu }}>{x} jam</div> : null}
        </React.Fragment>
      ))}
      <div style={{ position: 'absolute', left: 60, top: 110, fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.tulang }}>versi pertama</div>
      <div style={{ position: 'absolute', left: jam(0), top: 160, width: (jam(2.25) - jam(0)) * p1, height: 70, borderRadius: '10px 0 0 10px', background: KD.tulang }} />
      <div style={{ position: 'absolute', left: jam(2.25), top: 160, width: (jam(2.5) - jam(2.25)) * p2, height: 70, borderRadius: '0 10px 10px 0', backgroundImage: `repeating-linear-gradient(-45deg, ${KD.tulang} 0 10px, #8d887e 10px 20px)` }} />
      <div style={{ position: 'absolute', left: jam(2.25), top: 240, translate: '-50% 0', fontFamily: ANTON, fontSize: 40, color: KD.tulang, opacity: maju(t, T.seperempat - 0.1, T.seperempat + 0.15), whiteSpace: 'nowrap' }}>
        <Campuran utuh={2} a={1} b={4} />
        <span style={{ margin: '0 6px' }}>–</span>
        <span style={{ opacity: maju(t, T.setengah - 0.1, T.setengah + 0.1) }}>
          <Campuran utuh={2} a={1} b={2} /> jam
        </span>
      </div>
      {/* kontrak */}
      {k > 0 ? (
        <>
          <div style={{ position: 'absolute', left: jam(1.5) - 4, top: 120, width: 8, height: 230 * k, background: KD.amber, boxShadow: '0 0 16px rgba(255,180,84,0.7)' }} />
          <div style={{ position: 'absolute', left: jam(1.5) + 10, top: 60, opacity: k, fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.amber, whiteSpace: 'nowrap' }}>
            kontrak: maks <span style={{ fontFamily: ANTON, fontSize: 36 }}><Campuran utuh={1} a={1} b={2} /></span> jam
          </div>
          <div style={{ position: 'absolute', left: jam(1.5), top: 160, width: (jam(2.5) - jam(1.5)) * maju(t, T.jam4, T.jam4 + 0.4), height: 70, background: 'rgba(255,107,87,0.45)', border: `3px solid ${KD.koral}`, boxSizing: 'border-box', borderRadius: '0 10px 10px 0' }} />
          <Tag x={jam(1.6)} y={410} teks="kelebihan ±1 jam" o={maju(t, T.jam4 + 0.3, T.jam4 + 0.5)} warna={KD.koral} />
        </>
      ) : null}
    </Babak>
  );
};

// S5: potong di tiap shot sambil jaga ritme --------------------------------------------------------------------------------
const B5: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const n = 6;
  const wAwal = 130;
  return (
    <Babak dari={S[5].mulai} sampai={S[6].mulai}>
      <Tag x={40} y={56} teks="TIAP SHOT DIPANGKAS" o={1} />
      {(() => {
        let x = 40;
        return Array.from({ length: n }, (_, i) => {
          const m = T.motong + 0.2 + i * 0.22;
          const pot = maju(t, m, m + 0.2, EASE.kamera);
          const w = wAwal - pot * (34 + (i % 3) * 10);
          const kx = x;
          x += w + 8;
          return (
            <React.Fragment key={i}>
              <div style={{ position: 'absolute', left: kx, top: 150, width: w, height: 120, borderRadius: 8, overflow: 'hidden', boxShadow: 'inset 0 0 0 2px rgba(199,159,85,0.7)' }}>
                <div style={{ position: 'absolute', left: -60, top: -10, width: 260, height: 150 }}>
                  <AdeganMobil W={260} H={150} shot={i} seed={`b5${i}`} />
                </div>
              </div>
              {/* potongan yang dibuang terbang */}
              {pot > 0 && pot < 1 ? (
                <div style={{ position: 'absolute', left: kx + w, top: 150 - pot * 120, width: 34 + (i % 3) * 10, height: 120, borderRadius: 6, background: 'rgba(255,107,87,0.5)', opacity: 1 - pot, rotate: `${(pot * 25).toFixed(1)}deg` }} />
              ) : null}
            </React.Fragment>
          );
        });
      })()}
      {/* metronom ritme */}
      <div style={{ position: 'absolute', left: 360, top: 310, opacity: maju(t, T.ritme - 0.3, T.ritme) }}>
        <svg width={170} height={170} viewBox="-85 -85 170 170" style={{ overflow: 'visible' }}>
          <path d="M -50 70 L -20 -70 H 20 L 50 70 Z" fill="#3a2c1f" stroke={KD.emas} strokeWidth={5} />
          <path d={`M 0 50 L ${(Math.sin(t * 6) * 40).toFixed(1)} -60`} stroke={KD.amber} strokeWidth={7} strokeLinecap="round" />
        </svg>
      </div>
      <Muncul m={T.ritme} x={540} y={360}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 28, color: KD.tulang }}>ritmenya tetap dijaga</div>
      </Muncul>
    </Babak>
  );
};

// S6: lempar koin → Seberg menang ------------------------------------------------------------------------------------------
const B6: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const muter = t > T.lempar && t < T.menang;
  const tinggi = muter ? Math.sin(Math.PI * maju(t, T.lempar, T.menang, EASE.linear)) * 120 : 0;
  const sisi = muter ? Math.cos((t - T.lempar) * 22) : 1;
  const menang = t >= T.menang;
  return (
    <Babak dari={S[6].mulai} sampai={S[7].mulai}>
      <Tag x={40} y={52} teks="ADEGAN DI MOBIL" o={maju(t, T.mobil - 0.2, T.mobil)} />
      {['Belmondo', 'Seberg'].map((nm, i) => {
        const kalah = i === 0 && menang;
        const juara = i === 1 && menang;
        return (
          <Muncul key={nm} m={i === 0 ? T.belmondo - 0.1 : T.seberg6 - 0.1} x={i === 0 ? 50 : 614} y={120}>
            <div style={{ width: 230, padding: '18px 0', textAlign: 'center', borderRadius: 16, background: juara ? KD.amber : KD.panel2, border: `3px solid ${juara ? KD.amber : 'rgba(239,235,226,0.25)'}`, opacity: kalah ? 0.35 : 1, scale: String(juara ? 1.06 : 1) }}>
              <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 18, letterSpacing: '0.12em', color: juara ? '#5a3612' : KD.abu }}>{i === 0 ? 'SHOT-SHOT' : 'SHOT-SHOT'}</div>
              <div style={{ fontFamily: ANTON, fontSize: 52, color: juara ? KD.latar : KD.tulang, lineHeight: 1.1 }}>{nm.toUpperCase()}</div>
            </div>
          </Muncul>
        );
      })}
      {menang ? <Silang x={165} y={180} s={80} mulai={T.menang + 0.1} tebal={10} /> : null}
      {/* koin */}
      {t > T.lempar - 0.3 ? (
        <div style={{ position: 'absolute', left: MW / 2 - 70, top: 230 - tinggi, width: 140, height: 140, borderRadius: 70, background: 'radial-gradient(circle at 40% 35%, #f3d79a, #c79f55 70%)', border: '6px solid #a4813f', scale: `${Math.max(0.08, Math.abs(sisi)).toFixed(3)} 1`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 30px rgba(0,0,0,0.5)', opacity: maju(t, T.lempar - 0.3, T.lempar) }}>
          <div style={{ fontFamily: ANTON, fontSize: 30, color: '#5a3612' }}>{muter ? (sisi > 0 ? 'SEBERG' : 'BELMONDO') : 'SEBERG'}</div>
        </div>
      ) : null}
      <Muncul m={T.milih - 0.1} x={MW / 2} y={430} tengah>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: KD.tulang, whiteSpace: 'nowrap' }}>siapa yang dipertahanin?</div>
      </Muncul>
    </Babak>
  );
};

// S7: shot-shot Seberg disambung jadi seolah 1 shot ---------------------------------------------------------------------------
const B7: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const p = maju(t, T.disambung - 0.1, T.disambung + 0.6, EASE.kamera);
  const n = 7;
  const w = 104;
  return (
    <Babak dari={S[7].mulai} sampai={S[8].mulai}>
      <Tag x={40} y={52} teks="SHOT SEBERG" o={1} />
      {Array.from({ length: n }, (_, i) => {
        const xLepas = 40 + i * (w + 18);
        const xSambung = 40 + 50 + i * w;
        const x = xLepas + (xSambung - xLepas) * p;
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: 150 + (1 - p) * (i % 2 ? 16 : -16), width: w, height: 140, overflow: 'hidden', borderRadius: p > 0.95 ? (i === 0 ? '10px 0 0 10px' : i === n - 1 ? '0 10px 10px 0' : 0) : 8, boxShadow: `inset 0 0 0 2px rgba(199,159,85,${(0.7 * (1 - p)).toFixed(2)})` }}>
            <div style={{ position: 'absolute', left: -90, top: -10, width: 280, height: 160 }}>
              <AdeganMobil W={280} H={160} shot={i} seed={`b7${i}`} />
            </div>
          </div>
        );
      })}
      {p > 0.95 ? <div style={{ position: 'absolute', left: 86, top: 146, width: n * w + 8, height: 148, borderRadius: 12, border: `4px solid ${KD.amber}` }} /> : null}
      <Chip x={MW / 2} y={360} teks="seolah jadi 1 shot" ukuran={30} isi o={maju(t, T.seolah - 0.1, T.seolah + 0.1)} />
    </Babak>
  );
};

// S8–S9: 7 jump cut beruntun + kepala · cahaya · latar loncat ------------------------------------------------------------------
const B8: React.FC<{ T: WK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const t0 = T.tujuh - 0.6;
  const per = 0.32;
  const kini = t < t0 ? 0 : Math.min(7, Math.floor((t - t0) / per) + 1);
  // abis 7 cut, terus loncat lebih pelan biar keliatan yang berubah
  const shot = t < t0 ? 0 : kini < 7 ? kini : 7 + Math.floor((t - (t0 + 7 * per)) / 0.75);
  const sh = SHOT[shot % SHOT.length];
  const shLalu = SHOT[(shot + SHOT.length - 1) % SHOT.length];
  return (
    <Babak dari={S[8].mulai} sampai={S[10].mulai} zoom={0.02}>
      <AdeganMobil W={MW} H={MH} shot={shot} seed="b8" />
      <Muncul m={T.raskin - 0.2} x={30} y={56}>
        <div style={{ padding: '6px 14px', borderRadius: 10, background: 'rgba(11,11,14,0.85)', fontFamily: INTER, fontWeight: 800, fontSize: 22, color: KD.tulang }}>dugaan Richard Raskin</div>
      </Muncul>
      <div style={{ position: 'absolute', right: 30, top: 50, padding: '8px 18px', borderRadius: 12, background: 'rgba(11,11,14,0.85)', border: `3px solid ${KD.amber}`, opacity: maju(t, t0 - 0.2, t0) }}>
        <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 22, color: KD.abu }}>jump cut </span>
        <span style={{ fontFamily: ANTON, fontSize: 44, color: KD.amber, fontVariantNumeric: 'tabular-nums' }}>{kini}</span>
        <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 22, color: KD.abu }}> / 7</span>
      </div>
      {/* anotasi S9: bayangan posisi kepala sebelumnya + label */}
      {t > T.kepala - 0.1 ? (
        <>
          <div style={{ position: 'absolute', left: MW * shLalu.kx - 50, top: MH * 0.36, width: 100, height: 120, borderRadius: '50%', border: `3px dashed rgba(239,235,226,0.6)`, opacity: maju(t, T.kepala - 0.1, T.kepala + 0.1) }} />
          <Chip x={MW * sh.kx} y={MH * 0.26} teks="kepala" ukuran={26} isi o={maju(t, T.kepala - 0.1, T.kepala + 0.1)} />
        </>
      ) : null}
      <Chip x={MW - 120} y={150} teks="cahaya" ukuran={26} isi o={maju(t, T.cahaya - 0.1, T.cahaya + 0.1)} />
      <Chip x={150} y={MH * 0.5} teks="latar jalan" ukuran={26} isi o={maju(t, T.latar - 0.1, T.latar + 0.1)} />
      <Chip x={MW / 2} y={MH - 50} teks="loncat-loncat" ukuran={28} warna={KD.koral} isi o={maju(t, T.loncat - 0.1, T.loncat + 0.1)} />
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
        label={['MENURUT', 'GODARD']}
        lMulai={0.15}
        judul={[{ t: 'KELEBIHAN', mulai: 0.28 }, { t: 'DURASI', mulai: 0.36 }, { t: '±1', mulai: 0.44, isi: sorot('±1', Math.max(0.8, T.satu0)) }, { t: 'JAM', mulai: 0.5 }]}
        jMulai={0.28}
        keluar={S[1].mulai - 0.2}
        catatan="asal jump cut terkenal di film Breathless"
        cMulai={T.breathless0}
      />
      <JudulKD
        label={['JUMP', 'CUT', 'ITU']}
        lMulai={S[1].mulai}
        judul={[{ t: 'AWAL', mulai: T.awal }, { t: '&', mulai: T.akhir - 0.15, warna: KD.abu }, { t: 'AKHIR,', mulai: T.akhir }, { t: 'TANPA', mulai: T.tanpa1 }, { t: 'TENGAH', mulai: T.tengah, isi: sorot('TENGAH', T.tengah + 0.1, KD.koral) }]}
        jMulai={T.awal}
        keluar={S[2].mulai - 0.2}
      />
      <JudulKD
        label={['FILM', 'PANJANG', 'PERTAMA', 'GODARD']}
        lMulai={S[2].mulai}
        judul={[{ t: 'BREATHLESS', mulai: S[2].mulai + 0.2 }, { t: '·', mulai: T.th1960 - 0.1, warna: KD.abu }, { t: '1960', mulai: T.th1960, isi: sorot('1960', T.th1960 + 0.15) }]}
        jMulai={S[2].mulai + 0.2}
        keluar={S[3].mulai - 0.2}
        catatan="judul asli: À bout de souffle"
        cMulai={T.bout - 0.1}
      />
      <JudulKD
        label={['VERSI', 'PERTAMA']}
        lMulai={S[3].mulai}
        judul={[
          { t: '2¼', mulai: T.seperempat - 0.3, isi: <Campuran utuh={2} a={1} b={4} /> },
          { t: '–', mulai: T.setengah - 0.3, warna: KD.abu },
          { t: '2½', mulai: T.setengah - 0.2, isi: <Campuran utuh={2} a={1} b={2} /> },
          { t: 'JAM', mulai: T.setengah },
        ]}
        jMulai={T.seperempat - 0.3}
        keluar={S[4].mulai - 0.2}
        ukuran={124}
      />
      <JudulKD
        label={['DI', 'KONTRAK']}
        lMulai={S[4].mulai}
        judul={[{ t: 'MAKS', mulai: T.kontrak + 0.3 }, { t: '1½', mulai: T.satu4, isi: <span style={{ background: KD.amber, color: KD.latar, padding: '0 0.08em' }}><Campuran utuh={1} a={1} b={2} /></span> }, { t: 'JAM', mulai: T.jam4 }]}
        jMulai={T.kontrak + 0.3}
        keluar={S[5].mulai - 0.2}
        ukuran={124}
      />
      <JudulKD
        label={['GODARD', '&', 'EDITORNYA']}
        lMulai={S[5].mulai}
        judul={[{ t: 'POTONG', mulai: T.motong }, { t: 'DI', mulai: T.tiap - 0.15 }, { t: 'TIAP', mulai: T.tiap }, { t: 'SHOT', mulai: T.tiap + 0.15, isi: sorot('SHOT', T.tiap + 0.3) }]}
        jMulai={T.motong}
        keluar={S[6].mulai - 0.2}
        catatan="sambil tetap jaga ritme"
        cMulai={T.ritme - 0.2}
      />
      <JudulKD
        label={['BELMONDO', '&', 'SEBERG', 'DI', 'MOBIL']}
        lMulai={S[6].mulai}
        judul={[{ t: 'LEMPAR', mulai: T.lempar }, { t: 'KOIN', mulai: T.lempar + 0.15 }, { t: '→', mulai: T.menang - 0.2, isi: <PanahInline /> }, { t: 'SEBERG', mulai: T.menang, isi: sorot('SEBERG', T.menang + 0.15) }]}
        jMulai={T.lempar}
        keluar={S[7].mulai - 0.2}
      />
      <JudulKD
        label={['SHOT-SHOT', 'SEBERG']}
        lMulai={S[7].mulai}
        judul={[{ t: 'DISAMBUNG', mulai: T.disambung }, { t: 'JADI', mulai: T.seolah }, { t: '1', mulai: T.satu7, isi: sorot('1', T.satu7 + 0.1) }, { t: 'SHOT', mulai: T.satu7 + 0.1 }]}
        jMulai={T.disambung}
        keluar={S[8].mulai - 0.2}
      />
      <JudulKD
        label={['DUGAAN', 'RICHARD', 'RASKIN']}
        lMulai={S[8].mulai}
        judul={[{ t: '7', mulai: T.tujuh, isi: sorot('7', T.tujuh + 0.15) }, { t: 'JUMP', mulai: T.tujuh + 0.1 }, { t: 'CUT', mulai: T.tujuh + 0.2 }, { t: 'BERUNTUN', mulai: T.beruntun }]}
        jMulai={T.tujuh}
        keluar={S[9].mulai - 0.2}
      />
      <JudulKD
        label={['YANG', 'LONCAT']}
        lMulai={S[9].mulai}
        judul={[{ t: 'KEPALA', mulai: T.kepala }, { t: '·', mulai: T.cahaya - 0.1, warna: KD.abu }, { t: 'CAHAYA', mulai: T.cahaya }, { t: '·', mulai: T.latar - 0.1, warna: KD.abu }, { t: 'LATAR', mulai: T.latar, isi: sorot('LATAR', T.latar + 0.15) }]}
        jMulai={T.kepala}
        keluar={S[10].mulai - 0.2}
      />
      <JudulKD
        label={['SIMPAN', 'BUAT', 'REFERENSI', 'NGEDIT']}
        lMulai={S[10].mulai}
        judul={[{ t: 'SIMPAN', mulai: S[10].mulai + 0.2 }, { t: '·', mulai: S[10].mulai + 0.3, warna: KD.abu }, { t: 'FOLLOW', mulai: follow, isi: sorot('FOLLOW', follow + 0.15) }]}
        jMulai={S[10].mulai + 0.2}
        keluar={T.pulang - 0.15}
      />
    </>
  );
};

void GarisDigambar;
