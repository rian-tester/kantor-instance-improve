// Frame hero (pembuka, tengah, puncak): 15, 860, 1434.
// contoh video explainer A4 (akun generik, konten contoh): "AI nerjemahin aktivitas otak jadi kalimat, tanpa operasi".
// SATU DUNIA: kepala samping (otak berpetak voxel yang kedip) di tengah; dari otak keluar titik-titik makna → pita kalimat di
// bawah. Kamera: kepala (hook, operasi & alat tanam dicoret) → plakat UT Austin + Nature Neuroscience → cincin mesin fMRI
// nyelubungin kepala, aliran darah di otak → 3 relawan × 16 jam podcast (jam keisi) → decoder + GPT-1 di samping kepala →
// "kata per kata" dicoret, "inti makna" dikotak → contoh SIM → nyetir → ±setengah dekat (10 hasil) → cerita dibayangin &
// video bisu → orang lain = acak → mikirin hal lain = gagal (stempel) → CTA → latar kosong (loop).
// Fakta: Tang dkk., Nature Neuroscience 26 (2023) · UT News 01/05/2023 · The Guardian 01/05/2023. Contoh kalimat = terjemahan
// contoh resmi UT ("I don't have my driver's license yet" → "She has not even started to learn to drive yet").
import { getLength, getPointAtLength } from '@remotion/paths';
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { Bunyi, Dunia, EASE, GarisDigambar, Grain, maju, noise, pathPanah, pegas, Stempel, Subtitle, useDetik, type KunciKamera, type Kata } from "../../src/gerak";
import { MONO, SAIRA, TANGAN } from "../../src/gerak/font";
import { bunyi, K } from "./raja/gaya";
import type { Kalimat } from "./raja/waktuRaja";
import { CtaSimpanFollow, kameraSeri, LatarSeri, lerp, PeneduhAtas, sorot } from "../../src/gerak/seri/data-gelap/seri";
import { besar, HudTeks, Ikon, Kartu, kecil, KotakModel, Muncul, waktuDasar } from "../../src/gerak/seri/data-gelap/alat19";

export type DataOtak = { durasi: number; kata: Kata[]; kalimat?: Kalimat[] };

const KP = { x: 540, y: 820 }; // tengah kepala (dunia)
const PATH_KEPALA =
  'M 130 470 C 110 420 50 360 55 260 C 60 120 160 40 270 50 C 340 56 372 110 370 160 L 398 232 C 402 242 392 248 380 250 L 372 254 L 378 276 L 366 286 L 372 300 C 374 322 362 334 336 336 L 318 338 C 312 360 300 380 296 410 L 296 470 Z';
const PATH_OTAK = 'M 92 208 C 70 150 120 92 180 96 C 214 70 280 78 300 118 C 344 128 352 190 322 222 C 318 262 268 280 236 262 C 206 284 150 280 132 252 C 102 250 84 232 92 208 Z';
const LIPAT = ['M 130 150 C 150 130 170 160 190 140', 'M 210 120 C 230 150 250 120 270 150', 'M 120 210 C 150 190 170 230 200 205', 'M 220 200 C 250 220 270 190 300 205', 'M 180 250 C 195 230 215 250 230 235'];
const ALIRAN = ['M 100 210 C 140 170 200 230 250 160 C 280 120 320 170 330 200', 'M 130 120 C 170 160 210 100 260 140 C 290 160 300 230 260 255', 'M 110 240 C 160 250 200 200 240 240 C 270 270 300 240 320 230'];
const CONTOH = 'dia bahkan belum mulai belajar nyetir';

function waktuOtak(d: Kata[], kal: Kalimat[] | undefined, total: number) {
  const W = waktuDasar(d, kal, total, 12);
  const { s, k } = W;
  const kalimat0 = k('kalimat', s[0].mulai, s[0].mulai + 2.2);
  const tanpa = k('tanpa', kalimat0, kalimat0 + 0.8);
  const operasi = k('operasi', tanpa, tanpa + 0.4);
  const alat = k('alat', operasi, operasi + 0.6);
  const univ = k('university', s[1].mulai, s[1].mulai + 0.8);
  const nature = k('nature', univ, univ + 2.0);
  const n2023 = k('2023', nature, nature + 1.4);
  const fmri = k('fmri', s[2].mulai, s[2].mulai + 1.4);
  const aliran = k('aliran', fmri, fmri + 1.0);
  const tiga = k('tiga', s[3].mulai, s[3].mulai);
  const n16 = k('16', tiga, tiga + 1.6);
  const podcast = k('podcast', n16, s[3].akhir - 0.6);
  const decoder = k('decoder', s[4].mulai, s[4].mulai + 0.8);
  const pola = k('pola', decoder, decoder + 1.2);
  const makna4 = k('makna', pola, pola + 0.8);
  const gpt = k('gpt', makna4, makna4 + 1.0);
  const pendahulu = k('pendahulu', gpt, s[4].akhir - 0.8);
  const bukan = k('bukan', s[5].mulai, s[5].mulai + 0.4);
  const inti = k('inti', bukan, bukan + 1.0);
  const aku = k('aku', s[6].mulai, s[6].mulai + 1.0);
  const keluar6 = k('keluar', aku, aku + 1.2);
  const dia = k('dia', keluar6, keluar6 + 0.6);
  const setengah = k('setengah', s[7].mulai, s[7].mulai + 0.5);
  const dekat = k('dekat', setengah, setengah + 1.0);
  const persis = k('persis', dekat, dekat + 0.6);
  const bayangin = k('ngebayangin', s[8].mulai, s[8].mulai + 1.4);
  const nonton = k('nonton', bayangin, bayangin + 1.2);
  const ngelatih = k('ngelatihnya', s[9].mulai, s[9].mulai + 1.8);
  const lain9 = k('lain', ngelatih, ngelatih + 0.8);
  const gakBaca = k('gak', lain9, lain9 + 0.6);
  const gagal = k('ngegagalin', s[10].mulai, s[10].mulai + 0.8);
  const mikirin = k('mikirin', gagal, gagal + 1.2);
  return {
    ...W, kalimat0, tanpa, operasi, alat, univ, nature, n2023, fmri, aliran, tiga, n16, podcast, decoder, pola, makna4, gpt, pendahulu,
    bukan, inti, aku, keluar6, dia, setengah, dekat, persis, bayangin, nonton, ngelatih, lain9, gakBaca, gagal, mikirin,
  };
}
type WO = ReturnType<typeof waktuOtak>;

// ===============================================================================================================
export const ContohOtak: React.FC<DataOtak> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuOtak(d.kata, d.kalimat, total), [d.kata, d.kalimat, total]);
  const S = T.s;
  const pelan = Easing.linear;
  const kunci: KunciKamera[] = [
    { t: 0, x: 540, y: 960, z: 1.0 },
    { t: 0.6, x: 545, y: 900, z: 1.08 },
    { t: S[1].mulai - 0.1, x: 550, y: 896, z: 1.12, ease: pelan },
    { t: S[1].mulai + 0.5, x: 540, y: 960, z: 0.9 },
    { t: S[2].mulai - 0.1, x: 536, y: 956, z: 0.92, ease: pelan },
    { t: S[2].mulai + 0.6, x: 545, y: 860, z: 1.12 },
    { t: S[3].mulai - 0.1, x: 548, y: 856, z: 1.18, ease: pelan },
    { t: S[3].mulai + 0.5, x: 540, y: 980, z: 0.86 },
    { t: S[4].mulai - 0.1, x: 536, y: 976, z: 0.88, ease: pelan },
    { t: S[4].mulai + 0.6, x: 640, y: 1010, z: 0.92 },
    { t: S[5].mulai - 0.1, x: 646, y: 1006, z: 0.95, ease: pelan },
    { t: S[5].mulai + 0.5, x: 540, y: 1000, z: 0.96 },
    { t: S[7].mulai - 0.1, x: 544, y: 996, z: 1.0, ease: pelan },
    { t: S[7].mulai + 0.5, x: 540, y: 1020, z: 0.88 },
    { t: S[8].mulai - 0.1, x: 536, y: 1016, z: 0.9, ease: pelan },
    { t: S[8].mulai + 0.5, x: 560, y: 940, z: 1.0 },
    { t: S[9].mulai - 0.1, x: 564, y: 936, z: 1.03, ease: pelan },
    { t: S[9].mulai + 0.5, x: 540, y: 1000, z: 0.86 },
    { t: S[10].mulai - 0.1, x: 536, y: 996, z: 0.88, ease: pelan },
    { t: S[10].mulai + 0.5, x: 545, y: 920, z: 1.06 },
    { t: T.keluarDunia, x: 548, y: 916, z: 1.1, ease: pelan },
    { t: T.simpan + 0.8, x: 540, y: 960, z: 1.0 },
    { t: T.loop, x: 540, y: 960, z: 1.02, ease: pelan },
    { t: total, x: 540, y: 960, z: 1.0 },
  ];
  const kam = kameraSeri(kunci, t, fps, total, [
    { t: T.operasi + 0.1, kuat: 6, lama: 0.12 },
    { t: T.gagal + 0.15, kuat: 8, lama: 0.14 },
  ]);
  return (
    <AbsoluteFill style={{ background: K.latar, color: K.tinta, overflow: 'hidden', fontFamily: SAIRA }}>
      <LatarSeri kam={kam} kabut={['61,219,200', '255,107,87', '255,197,61']} />
      <Dunia kamera={kam} tinggiDunia={2200} lebarDunia={1600} blurGerak={1300}>
        <Pemindai T={T} />
        <Kepala T={T} />
        <Decoder T={T} />
      </Dunia>
      <PeneduhAtas />
      <PitaKalimat T={T} />
      <Plakat T={T} />
      <Relawan T={T} />
      <Makna T={T} />
      <Contoh T={T} />
      <Setengah T={T} />
      <JugaJalan T={T} />
      <OrangLain T={T} />
      <Hud T={T} />
      <CtaSimpanFollow simpan={T.simpan + 0.1} follow={T.follow} keluar={T.keluarCta} />
      <Subtitle
        kata={d.kata} kalimat={d.kalimat} font={SAIRA} tebal={700} ukuran={46} maksHuruf={32} sorot={K.kuning} sampai={T.akhirVO + 0.3}
        zona={[{ dari: 0, x: 540, y: 1326, lebar: 940 }]} pita="rgba(7,12,24,0.55)"
      />
      <Grain kuat={0.07} garisScan={0} vinyet={0.5} warnaVinyet="2,5,14" />
      <></>
    </AbsoluteFill>
  );
};

// ===============================================================================================================
// redup dunia pas panel HUD tampil
const redupDunia = (T: WO, t: number) => {
  const S = T.s;
  const r = (a: number, b: number, kuat: number) => kuat * maju(t, a, a + 0.3) * (1 - maju(t, b - 0.2, b + 0.1));
  return Math.max(r(S[1].mulai, S[2].mulai, 0.7), r(S[3].mulai, S[4].mulai, 0.7), r(S[5].mulai, S[8].mulai, 0.72), r(S[9].mulai, S[10].mulai, 0.72));
};

export const Kepala: React.FC<{ T: WO; sampul?: boolean }> = ({ T, sampul }) => {
  const t0 = useDetik();
  const t = sampul ? 2.4 : t0;
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < 0.04) return null;
  const masuk = sampul ? 1 : pegas(t, 0.05, fps, { damping: 14, stiffness: 170, mass: 0.7 });
  const keluar = sampul ? 0 : maju(t, T.keluarDunia, T.keluarDunia + 0.45, EASE.keluar);
  const redup = sampul ? 0 : redupDunia(T, t);
  const napas = 1 + 0.01 * Math.sin(t * 1.5);
  // S10: kepala mikirin hal lain (gelembung pikiran)
  const W = 400;
  const H = 480;
  const darah = maju(t, T.aliran - 0.2, T.aliran + 0.2) * (1 - maju(t, S[3].mulai - 0.2, S[3].mulai + 0.1));
  const kacau = !sampul && t > T.mikirin - 0.1 && t < T.keluarDunia;
  return (
    <div style={{ position: 'absolute', left: KP.x - W / 2, top: KP.y - H / 2, width: W, height: H, opacity: (1 - keluar) * Math.min(1, masuk * 2), scale: String(lerp(0.9, 1, Math.min(1, masuk)) * napas), filter: redup > 0 ? `brightness(${1 - redup})` : undefined }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
        <path d={PATH_KEPALA} fill="#16233f" stroke={K.tinta} strokeWidth={8} strokeLinejoin="round" />
        <path d={PATH_OTAK} fill="#22355e" stroke={K.teal} strokeWidth={6} />
        {LIPAT.map((p, i) => (
          <path key={i} d={p} fill="none" stroke={K.teal} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
        ))}
        {/* voxel fMRI: petak yang kedip (aktivitas) */}
        {Array.from({ length: 9 }, (_, c) =>
          Array.from({ length: 6 }, (_, r) => {
            const x = 96 + c * 26;
            const y = 102 + r * 28;
            const di = (x - 205) ** 2 / 120 ** 2 + (y - 185) ** 2 / 85 ** 2 < 1;
            if (!di) return null;
            const v = noise(`vx${c}-${r}`, t * (kacau ? 4 : 1.6));
            const nyala = v > 0.15;
            return <rect key={`${c}-${r}`} x={x} y={y} width={22} height={24} rx={4} fill={kacau ? K.merah : nyala ? K.kuning : K.teal} opacity={nyala ? 0.75 : 0.22} />;
          }),
        )}
        {/* aliran darah (S3) */}
        {darah > 0
          ? ALIRAN.flatMap((p, i) => {
              const L = getLength(p);
              return Array.from({ length: 6 }, (_, j) => {
                const f = (t * 0.35 + j / 6 + i * 0.13) % 1;
                const q = getPointAtLength(p, f * L);
                if (!q) return null;
                return <circle key={`${i}-${j}`} cx={q.x} cy={q.y} r={9} fill={K.merah} opacity={darah * Math.sin(Math.PI * f)} />;
              });
            })
          : null}
        {darah > 0 ? ALIRAN.map((p, i) => <path key={`a${i}`} d={p} fill="none" stroke={K.merah} strokeWidth={4} opacity={0.35 * darah} />) : null}
      </svg>
      {/* hook: operasi & alat tanam dicoret */}
      {!sampul && t > T.operasi - 0.1 && t < S[1].mulai + 0.2 ? (
        <div style={{ position: 'absolute', left: -150, top: 40, display: 'flex', flexDirection: 'column', gap: 24, opacity: 1 - maju(t, S[1].mulai - 0.3, S[1].mulai) }}>
          {[
            { m: T.operasi, ikon: <PisauBedah />, teks: 'operasi' },
            { m: T.alat, ikon: <Chip />, teks: 'alat tanam' },
          ].map((x, i) =>
            t > x.m - 0.1 ? (
              <div key={i} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 14, background: 'rgba(7,12,24,0.92)', border: `3px solid ${K.merah}`, scale: String(pegas(t, x.m - 0.1, fps, { damping: 11, stiffness: 200, mass: 0.6 })) }}>
                {x.ikon}
                <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 40, color: K.tinta, whiteSpace: 'nowrap' }}>{x.teks}</span>
                <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                  <GarisDigambar d="M 6 50 L 230 6" mulai={x.m + 0.2} lama={0.18} warna={K.merah} tebal={9} />
                </svg>
              </div>
            ) : null,
          )}
        </div>
      ) : null}
    </div>
  );
};

const PisauBedah: React.FC = () => (
  <svg width={46} height={46} viewBox="0 0 46 46">
    <path d="M 4 42 L 24 22" stroke={K.tinta} strokeWidth={6} strokeLinecap="round" />
    <path d="M 22 24 L 40 6 Q 44 14 34 24 Z" fill={K.tinta} />
  </svg>
);
const Chip: React.FC = () => (
  <svg width={46} height={46} viewBox="0 0 46 46">
    <rect x={11} y={11} width={24} height={24} rx={4} fill="none" stroke={K.tinta} strokeWidth={5} />
    {[16, 23, 30].map((v) => (
      <React.Fragment key={v}>
        <line x1={v} y1={3} x2={v} y2={11} stroke={K.tinta} strokeWidth={3} />
        <line x1={v} y1={35} x2={v} y2={43} stroke={K.tinta} strokeWidth={3} />
      </React.Fragment>
    ))}
  </svg>
);

// S3: cincin mesin fMRI nyelubungin kepala (masuk dari kiri)
const Pemindai: React.FC<{ T: WO }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[2].mulai - 0.1 || t > S[4].mulai + 0.4) return null;
  const masuk = maju(t, S[2].mulai, T.fmri + 0.3, EASE.kamera);
  const keluar = maju(t, S[4].mulai - 0.3, S[4].mulai + 0.2, EASE.keluar);
  const redup = 0.7 * maju(t, S[3].mulai, S[3].mulai + 0.3);
  const x = lerp(-500, KP.x, masuk);
  const putar = t * 40;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - keluar, filter: redup > 0 ? `brightness(${1 - redup})` : undefined }}>
      <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <circle cx={x} cy={KP.y} r={340} fill="none" stroke="#2c3e63" strokeWidth={90} />
        <circle cx={x} cy={KP.y} r={340} fill="none" stroke={K.teal} strokeWidth={6} strokeDasharray="30 40" transform={`rotate(${putar} ${x} ${KP.y})`} opacity={0.8} />
        <circle cx={x} cy={KP.y} r={292} fill="none" stroke="#3b5079" strokeWidth={4} />
        <circle cx={x} cy={KP.y} r={388} fill="none" stroke="#3b5079" strokeWidth={4} />
      </svg>
      <div style={{ position: 'absolute', left: x + 300, top: KP.y + 270, translate: '-50% 0', padding: '4px 22px', borderRadius: 14, background: K.teal, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 60, opacity: maju(t, T.fmri - 0.1, T.fmri + 0.1) }}>fMRI</div>
    </div>
  );
};

// S5: decoder di kanan kepala + GPT-1 nyolok; panah pola otak → decoder → makna
const Decoder: React.FC<{ T: WO }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[4].mulai - 0.1 || t > S[5].mulai + 0.5) return null;
  const m = pegas(t, T.decoder - 0.15, fps, { damping: 12, stiffness: 180, mass: 0.6 });
  const keluar = maju(t, S[5].mulai - 0.2, S[5].mulai + 0.25, EASE.keluar);
  const DX = 900;
  const DY = 1000;
  const gp = pegas(t, T.gpt - 0.1, fps, { damping: 10, stiffness: 200, mass: 0.6 });
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - keluar }}>
      <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <GarisDigambar d={pathPanah(KP.x + 120, KP.y - 40, DX - 170, DY - 60, -60, 28)} mulai={T.pola - 0.2} lama={0.3} warna={K.kuning} tebal={8} />
        <GarisDigambar d={pathPanah(DX, DY + 135, DX - 30, DY + 240, 20, 26)} mulai={T.makna4 - 0.15} lama={0.3} warna={K.teal} tebal={8} />
      </svg>
      {/* titik pola otak mengalir ke decoder */}
      {t > T.pola
        ? Array.from({ length: 8 }, (_, i) => {
            const f = (t * 0.9 + i / 8) % 1;
            const x = lerp(KP.x + 100, DX - 150, f);
            const y = lerp(KP.y - 60, DY - 40, f) - Math.sin(Math.PI * f) * 90;
            return <div key={i} style={{ position: 'absolute', left: x - 10, top: y - 10, width: 20, height: 20, borderRadius: 4, background: K.kuning, opacity: Math.sin(Math.PI * f) }} />;
          })
        : null}
      <div style={{ position: 'absolute', left: DX, top: DY, translate: '-50% -50%', scale: String(Math.max(0.001, m)) }}>
        <KotakModel nama="decoder" seed="dec" lebar={300} />
      </div>
      {t > T.gpt - 0.1 ? (
        <div style={{ position: 'absolute', left: DX, top: DY - 205, translate: '-50% -50%', scale: String(gp), display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ padding: '4px 22px', borderRadius: 14, background: K.kuning, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 56 }}>+ GPT-1</div>
          <div style={{ fontFamily: TANGAN, fontWeight: 700, fontSize: 36, color: K.kuning, whiteSpace: 'nowrap', opacity: maju(t, T.pendahulu - 0.1, T.pendahulu + 0.15) }}>pendahulu ChatGPT</div>
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: DX - 60, top: DY + 300, translate: '-50% -50%', opacity: maju(t, T.makna4, T.makna4 + 0.2), padding: '6px 22px', borderRadius: 14, background: 'rgba(7,12,24,0.94)', border: `4px solid ${K.teal}`, fontFamily: SAIRA, fontWeight: 800, fontSize: 52, color: K.teal, whiteSpace: 'nowrap' }}>
        makna kalimat
      </div>
    </div>
  );
};

// pita kalimat (hook): titik makna dari otak → kalimat contoh muncul per kata
const PitaKalimat: React.FC<{ T: WO }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < 0.5 || t > S[1].mulai + 0.2) return null;
  const o = maju(t, 0.5, 0.75) * (1 - maju(t, S[1].mulai - 0.3, S[1].mulai));
  const kata = CONTOH.split(' ');
  const a = 0.8;
  const b = Math.max(a + 1.2, T.kalimat0 + 0.2);
  const n = Math.round(kata.length * maju(t, a, b, EASE.linear));
  return (
    <div style={{ position: 'absolute', left: 540, top: 1170, translate: '-50% -50%', opacity: o, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 30px', borderRadius: 20, background: 'rgba(7,12,24,0.94)', border: `4px solid ${K.kuning}`, whiteSpace: 'nowrap' }}>
      <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, color: K.kuning }}>AI:</span>
      <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 50, color: K.tinta, minWidth: 640 }}>
        {kata.slice(0, n).join(' ')}
        <span style={{ opacity: Math.floor(t * 3) % 2 ? 0 : 1, color: K.kuning }}>|</span>
      </span>
    </div>
  );
};

// ===============================================================================================================
// HUD
const Plakat: React.FC<{ T: WO }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const kel = S[2].mulai - 0.25;
  return (
    <>
      <Muncul mulai={T.univ - 0.1} keluar={kel} x={540} y={720} seed="ut">
        <Kartu warna={K.kuning} gaya={{ display: 'flex', alignItems: 'center', gap: 22, padding: '16px 34px 16px 22px' }}>
          <svg width={74} height={84} viewBox="0 0 70 80">
            <path d="M 35 4 L 66 14 L 66 40 Q 66 66 35 77 Q 4 66 4 40 L 4 14 Z" fill={K.kuning} />
            <text x={35} y={50} textAnchor="middle" fontFamily={SAIRA} fontWeight={800} fontSize={28} fill={K.latar}>UT</text>
          </svg>
          <div>
            {besar('University of Texas', K.tinta, 56)}
            {besar('at Austin', K.tinta, 56)}
          </div>
        </Kartu>
      </Muncul>
      <Muncul mulai={T.nature - 0.1} keluar={kel + 0.05} x={540} y={1010} seed="nn">
        <Kartu warna={K.teal} gaya={{ display: 'flex', alignItems: 'center', gap: 22, padding: '16px 34px 16px 22px' }}>
          <Ikon n="dokumen" warna={K.teal} uk={76} />
          <div>
            {kecil('jurnal', K.abu, 26)}
            {besar('Nature Neuroscience', K.tinta, 56)}
          </div>
          {t > T.n2023 - 0.1 ? <div style={{ marginLeft: 10, padding: '2px 16px', borderRadius: 12, background: K.teal, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 48 }}>2023</div> : null}
        </Kartu>
      </Muncul>
    </>
  );
};

const Relawan: React.FC<{ T: WO }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[3].mulai - 0.1 || t > S[4].mulai + 0.3) return null;
  const kel = S[4].mulai - 0.25;
  const jam = 16 * maju(t, T.n16 - 0.5, T.n16 + 0.9, EASE.kamera);
  return (
    <>
      {[0, 1, 2].map((i) => (
        <Muncul key={i} mulai={T.tiga - 0.1 + i * 0.12} keluar={kel + i * 0.04} x={200 + i * 340} y={820} seed={`rl${i}`}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative', width: 230, height: 230 }}>
              <svg width={230} height={230} viewBox="-115 -115 230 230" style={{ position: 'absolute', left: 0, top: 0 }}>
                <circle r={100} fill="rgba(7,12,24,0.94)" stroke={K.garis} strokeWidth={14} />
                <circle r={100} fill="none" stroke={K.teal} strokeWidth={14} strokeDasharray={`${2 * Math.PI * 100} ${2 * Math.PI * 100}`} strokeDashoffset={2 * Math.PI * 100 * (1 - jam / 24)} transform="rotate(-90)" strokeLinecap="round" />
                {/* kepala + headphone */}
                <circle cx={0} cy={-10} r={34} fill="none" stroke={K.tinta} strokeWidth={7} />
                <path d="M -40 -10 Q -40 -58 0 -58 Q 40 -58 40 -10" fill="none" stroke={K.kuning} strokeWidth={8} />
                <rect x={-50} y={-22} width={16} height={30} rx={6} fill={K.kuning} />
                <rect x={34} y={-22} width={16} height={30} rx={6} fill={K.kuning} />
                <path d="M -46 70 Q -46 32 0 32 Q 46 32 46 70" fill="none" stroke={K.tinta} strokeWidth={7} />
                {[0, 1].map((j) => {
                  const f = (t * 1.2 + j * 0.5 + i * 0.2) % 1;
                  return <path key={j} d={`M ${58 + f * 30} -30 Q ${68 + f * 30} -10 ${58 + f * 30} 10`} fill="none" stroke={K.kuning} strokeWidth={5} opacity={Math.sin(Math.PI * f)} />;
                })}
              </svg>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 64, color: K.teal, fontVariantNumeric: 'tabular-nums' }}>{Math.round(jam)}</span>
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: K.abu }}>jam</span>
            </div>
            {kecil(`relawan ${i + 1}`, K.abu, 26)}
          </div>
        </Muncul>
      ))}
      <Muncul mulai={T.podcast - 0.1} keluar={kel} x={540} y={1120} seed="pc">
        <Kartu warna={K.kuning} gaya={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 26px' }}>
          <Ikon n="mic" warna={K.kuning} uk={56} />
          {besar('sambil dengerin podcast', K.tinta, 50)}
        </Kartu>
      </Muncul>
    </>
  );
};

// S6: "kata per kata" dicoret, "inti makna" dikotak
const Makna: React.FC<{ T: WO }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[5].mulai - 0.1 || t > S[6].mulai + 0.3) return null;
  const kel = S[6].mulai - 0.25;
  return (
    <>
      <Muncul mulai={T.bukan - 0.15} keluar={kel} x={540} y={760} seed="kk">
        <div style={{ position: 'relative' }}>
          <Kartu warna={K.merah} gaya={{ padding: '14px 40px' }}>
            <div style={{ display: 'flex', gap: 14 }}>
              {['kata', 'per', 'kata'].map((w, i) => (
                <span key={i} style={{ padding: '2px 14px', borderRadius: 10, background: '#16243f', fontFamily: SAIRA, fontWeight: 800, fontSize: 64, color: K.abu }}>{w}</span>
              ))}
            </div>
          </Kartu>
          <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <GarisDigambar d="M 10 80 L 470 20" mulai={T.bukan + 0.25} lama={0.2} warna={K.merah} tebal={12} />
          </svg>
        </div>
      </Muncul>
      <Muncul mulai={T.inti - 0.15} keluar={kel + 0.05} x={540} y={1030} seed="im">
        <Kartu warna={K.teal} isi gaya={{ padding: '14px 46px' }}>
          {besar('inti maknanya ✓', K.latar, 84)}
        </Kartu>
      </Muncul>
    </>
  );
};

// S7: contoh resmi UT (diterjemahin)
const Contoh: React.FC<{ T: WO }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[6].mulai - 0.1 || t > S[7].mulai + 0.3) return null;
  const kel = S[7].mulai - 0.25;
  const kata = CONTOH.split(' ');
  const n = Math.round(kata.length * maju(t, T.dia - 0.05, S[6].akhir - 0.1, EASE.linear));
  return (
    <>
      <Muncul mulai={T.aku - 0.2} keluar={kel} x={540} y={700} seed="c1">
        <Kartu warna={K.abu} gaya={{ width: 840, whiteSpace: 'normal', padding: '14px 30px' }}>
          {kecil('yang didengar relawan', K.abu, 26)}
          {besar('“aku belum punya SIM”', K.tinta, 66)}
        </Kartu>
      </Muncul>
      <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
        <GarisDigambar d={pathPanah(540, 800, 540, 900, 0, 26)} mulai={T.keluar6 - 0.1} lama={0.25} warna={K.kuning} tebal={9} hapus={kel} />
      </svg>
      <Muncul mulai={T.keluar6 + 0.05} keluar={kel + 0.05} x={540} y={1035} seed="c2">
        <Kartu warna={K.kuning} gaya={{ width: 840, whiteSpace: 'normal', padding: '14px 30px' }}>
          {kecil('yang ditulis decoder dari aktivitas otaknya', K.kuning, 26)}
          <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 66, color: K.tinta, minHeight: 140, lineHeight: 1.05 }}>“{kata.slice(0, n).join(' ')}{n >= kata.length ? '”' : ''}</div>
        </Kartu>
      </Muncul>
    </>
  );
};

// S8: ±setengah hasil maknanya dekat (10 kartu hasil: 5 teal dekat, 1 di antaranya persis)
const Setengah: React.FC<{ T: WO }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[7].mulai - 0.1 || t > S[8].mulai + 0.3) return null;
  const kel = S[8].mulai - 0.25;
  const o = maju(t, S[7].mulai, S[7].mulai + 0.2) * (1 - maju(t, kel, kel + 0.2));
  const p = maju(t, T.setengah - 0.2, T.dekat + 0.2, EASE.kamera);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: o }}>
      <div style={{ position: 'absolute', left: 540, top: 820, translate: '-50% -50%', display: 'grid', gridTemplateColumns: 'repeat(5, 150px)', gap: 18 }}>
        {Array.from({ length: 10 }, (_, i) => {
          const dekat = i < 5;
          const nyala = dekat && p > (i + 0.5) / 5;
          const persis = i === 2 && t > T.persis - 0.05;
          const sk = pegas(t, S[7].mulai + 0.05 + i * 0.04, fps, { damping: 12, stiffness: 200, mass: 0.6 });
          return (
            <div key={i} style={{ height: 150, borderRadius: 20, scale: String(sk), background: nyala ? (persis ? K.kuning : K.teal) : 'rgba(7,12,24,0.94)', border: `4px solid ${nyala ? (persis ? K.kuning : K.teal) : K.garis}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 64, color: nyala ? K.latar : K.redup }}>{nyala ? '✓' : '~'}</span>
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, color: nyala ? K.latar : K.redup }}>{persis ? 'persis' : nyala ? 'dekat' : 'meleset'}</span>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 540, top: 1080, translate: '-50% 0', opacity: maju(t, T.dekat - 0.1, T.dekat + 0.1), fontFamily: TANGAN, fontWeight: 700, fontSize: 48, color: K.teal, whiteSpace: 'nowrap' }}>
        ±setengah maknanya dekat sama aslinya
      </div>
    </div>
  );
};

// S9: cerita dibayangin + video bisu → tetap keluar teks
const JugaJalan: React.FC<{ T: WO }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[8].mulai - 0.1 || t > S[9].mulai + 0.3) return null;
  const kel = S[9].mulai - 0.25;
  const film = (t * 2) % 1;
  return (
    <>
      <Muncul mulai={T.bayangin - 0.2} keluar={kel} x={300} y={1090} seed="j1">
        <Kartu warna={K.kuning} gaya={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 26px' }}>
          <svg width={150} height={110} viewBox="0 0 150 110">
            <path d="M 30 60 Q 10 60 12 42 Q 14 22 36 26 Q 44 6 70 10 Q 96 2 106 24 Q 136 22 136 48 Q 138 72 112 72 Q 100 90 74 82 Q 50 92 42 74 Q 28 76 30 60 Z" fill="none" stroke={K.kuning} strokeWidth={6} />
            <circle cx={20} cy={92} r={7} fill={K.kuning} />
            <text x={74} y={56} textAnchor="middle" fontFamily={TANGAN} fontWeight={700} fontSize={26} fill={K.kuning}>cerita…</text>
          </svg>
          {besar('cerita dibayangin', K.tinta, 44)}
        </Kartu>
      </Muncul>
      <Muncul mulai={T.nonton - 0.2} keluar={kel + 0.05} x={780} y={1090} seed="j2">
        <Kartu warna={K.teal} gaya={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 26px' }}>
          <svg width={150} height={110} viewBox="0 0 150 110">
            <rect x={8} y={12} width={110} height={78} rx={10} fill="none" stroke={K.teal} strokeWidth={6} />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={12 + ((i * 28 + film * 28) % 104)} y={16} width={10} height={8} fill={K.teal} />
            ))}
            <path d="M 52 38 L 52 66 L 76 52 Z" fill={K.teal} />
            <path d="M 124 44 L 132 44 L 140 36 L 140 68 L 132 60 L 124 60 Z" fill={K.abu} />
            <path d="M 120 34 L 146 70" stroke={K.merah} strokeWidth={6} strokeLinecap="round" />
          </svg>
          {besar('video tanpa suara', K.tinta, 44)}
        </Kartu>
      </Muncul>
    </>
  );
};

// S10: orang yang ngelatih ✓ vs orang lain ✗ (acak) · S11: mikirin hal lain → gagal
const ACAK = 'qz# rnv kpw@ x… tl0';
const OrangLain: React.FC<{ T: WO }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[9].mulai - 0.1 || t > T.keluarDunia + 0.3) return null;
  const kel = S[10].mulai - 0.25;
  const acak = ACAK.split('').map((c, i) => (c === ' ' ? ' ' : String.fromCharCode(97 + Math.floor(random(`ac${i}${Math.floor(t * 8)}`) * 26)))).join('');
  const baris = (y: number, m: number, judul: string, isi: React.ReactNode, w: string, i: number, ok: boolean) => (
    <Muncul mulai={m} keluar={kel + i * 0.05} x={540} y={y} seed={`ol${i}`}>
      <Kartu warna={w} gaya={{ width: 860, display: 'flex', alignItems: 'center', gap: 22, padding: '14px 26px' }}>
        <svg width={90} height={90} viewBox="0 0 100 100">
          <path d="M 36 26 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0" fill="none" stroke={K.tinta} strokeWidth={7} />
          <path d="M 20 86 Q 20 46 50 46 Q 80 46 80 86" fill="none" stroke={K.tinta} strokeWidth={7} />
        </svg>
        <div style={{ flex: 1 }}>
          {kecil(judul, w, 26)}
          {isi}
        </div>
        <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 80, color: w }}>{ok ? '✓' : '✗'}</span>
      </Kartu>
    </Muncul>
  );
  return (
    <>
      {baris(720, S[9].mulai + 0.1, 'yang ikut ngelatih decoder', besar('teks kebaca', K.tinta, 56), K.teal, 0, true)}
      {baris(980, T.lain9 - 0.15, 'orang lain', <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 46, color: K.merah }}>{acak}</div>, K.merah, 1, false)}
      {/* S11: relawan sengaja mikirin hal lain */}
      {t > S[10].mulai - 0.1 ? (
        <Muncul mulai={T.mikirin - 0.1} keluar={T.keluarDunia} x={540} y={1130} seed="gg">
          <Stempel mulai={T.gagal} rot={-6} gaya={{ padding: '6px 30px', borderRadius: 16, border: `7px solid ${K.merah}`, background: 'rgba(7,12,24,0.88)', fontFamily: SAIRA, fontWeight: 800, fontSize: 80, color: K.merah, whiteSpace: 'nowrap' }}>
            decoder gagal
          </Stempel>
        </Muncul>
      ) : null}
      {t > S[10].mulai - 0.1 ? <Pikiran T={T} /> : null}
    </>
  );
};

// gelembung pikiran "hal lain" di atas kepala (S11)
const Pikiran: React.FC<{ T: WO }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const m = pegas(t, T.mikirin - 0.2, fps, { damping: 11, stiffness: 190, mass: 0.6 });
  const o = 1 - maju(t, T.keluarDunia, T.keluarDunia + 0.3);
  const ikon = ['kucing', '7', 'lagu'];
  return (
    <div style={{ position: 'absolute', left: 700, top: 560, translate: '-50% -50%', scale: String(Math.max(0.001, m)), opacity: o, width: 330, height: 200, borderRadius: 100, background: 'rgba(7,12,24,0.94)', border: `5px solid ${K.kuning}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      {ikon.map((x, i) => (
        <span key={i} style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 46, color: i % 2 ? K.teal : K.kuning, translate: `0 ${(Math.sin(t * 5 + i) * 10).toFixed(1)}px` }}>{x}</span>
      ))}
    </div>
  );
};

const Hud: React.FC<{ T: WO }> = ({ T }) => {
  const S = T.s;
  return (
    <HudTeks
      T={T}
      sumber={() => 'Sumber: Tang dkk., Nature Neuroscience (2023) · UT Austin · Guardian'}
      teks={[
        { label: ['AI', 'BACA', 'AKTIVITAS', 'OTAK'], judul: [{ t: 'otak', mulai: 0.2 }, { t: '→', mulai: 0.35, warna: K.abu }, { t: 'kalimat', mulai: T.kalimat0, isi: sorot('kalimat', T.kalimat0 + 0.15) }], jMulai: 0.2, catatan: 'tanpa operasi, tanpa alat yang ditanam', cMulai: T.tanpa, cWarna: K.merah },
        { label: ['RISET', '2023'], judul: [{ t: 'UT', mulai: T.univ }, { t: 'Austin', mulai: T.univ + 0.3 }, { t: '·', mulai: T.nature - 0.1, warna: K.abu }, { t: 'Nature', mulai: T.nature, warna: K.teal }, { t: 'Neuroscience', mulai: T.nature + 0.2, warna: K.teal }], ukuran: 80 },
        { label: ['ALATNYA'], judul: [{ t: 'fMRI', mulai: T.fmri, warna: K.teal }, { t: '=', mulai: T.aliran - 0.2, warna: K.abu }, { t: 'aliran', mulai: T.aliran, warna: K.merah }, { t: 'darah', mulai: T.aliran + 0.2, warna: K.merah }] },
        { label: ['DATA', 'LATIHAN'], judul: [{ t: '3', mulai: T.tiga, warna: K.kuning }, { t: 'relawan', mulai: T.tiga + 0.15 }, { t: '×', mulai: T.n16 - 0.15, warna: K.abu }, { t: '16', mulai: T.n16, warna: K.teal }, { t: 'jam', mulai: T.n16 + 0.15, warna: K.teal }, { t: 'podcast', mulai: T.podcast }], ukuran: 84 },
        { label: ['CARA', 'KERJA'], judul: [{ t: 'decoder', mulai: T.decoder }, { t: '+', mulai: T.gpt - 0.15, warna: K.abu }, { t: 'GPT-1', mulai: T.gpt, isi: sorot('GPT-1', T.gpt + 0.15) }] },
        { label: ['HASILNYA'], judul: [{ t: 'inti', mulai: S[5].mulai + 0.2, isi: sorot('inti', T.inti, K.teal) }, { t: 'makna,', mulai: S[5].mulai + 0.25, isi: sorot('makna,', T.inti + 0.12, K.teal) }, { t: 'bukan', mulai: S[5].mulai + 0.3 }, { t: 'kata', mulai: S[5].mulai + 0.35, warna: K.merah }, { t: 'per', mulai: S[5].mulai + 0.4, warna: K.merah }, { t: 'kata', mulai: S[5].mulai + 0.45, warna: K.merah }], ukuran: 84 },
        { label: ['CONTOH'], judul: [{ t: '"belum', mulai: T.aku }, { t: 'punya', mulai: T.aku + 0.15 }, { t: 'SIM"', mulai: T.aku + 0.3 }, { t: '→', mulai: T.keluar6, warna: K.abu }, { t: '"belum', mulai: T.dia, warna: K.kuning }, { t: 'belajar', mulai: T.dia + 0.2, warna: K.kuning }, { t: 'nyetir"', mulai: T.dia + 0.4, warna: K.kuning }], ukuran: 74 },
        { label: ['KECOCOKAN'], judul: [{ t: '±setengah', mulai: T.setengah, isi: sorot('±setengah', T.setengah + 0.15) }, { t: 'maknanya', mulai: T.dekat - 0.2 }, { t: 'dekat', mulai: T.dekat, warna: K.teal }] },
        { label: ['JUGA', 'JALAN', 'BUAT'], judul: [{ t: 'cerita', mulai: T.bayangin - 0.2 }, { t: 'dibayangin', mulai: T.bayangin, warna: K.kuning }, { t: '·', mulai: T.nonton - 0.1, warna: K.abu }, { t: 'video', mulai: T.nonton }, { t: 'bisu', mulai: T.nonton + 0.2, warna: K.teal }], ukuran: 84 },
        { label: ['BATASNYA'], judul: [{ t: 'cuma', mulai: S[9].mulai + 0.3 }, { t: 'orang', mulai: S[9].mulai + 0.45 }, { t: 'yang', mulai: S[9].mulai + 0.6 }, { t: 'ngelatih', mulai: T.ngelatih, warna: K.teal }] },
        { label: ['DAN'], judul: [{ t: 'bisa', mulai: T.gagal - 0.1 }, { t: 'digagalin', mulai: T.gagal, isi: sorot('digagalin', T.gagal + 0.15, K.merah) }] },
        { label: ['BUAT', 'FAKTA', 'AI', 'LAINNYA'], judul: [{ t: 'simpan', mulai: T.simpan + 0.05, warna: K.kuning }, { t: '&', mulai: T.follow - 0.25, warna: K.abu }, { t: 'follow', mulai: T.follow, warna: K.teal }], jMulai: T.simpan },
      ]}
    />
  );
};

function daftarSfx(T: WO) {
  const S = T.s;
  const ketik = Array.from({ length: 7 }, (_, i) => bunyi('tik', 0.8 + i * ((Math.max(1.2, T.kalimat0 - 0.6)) / 7), 0.14));
  const jam = Array.from({ length: 8 }, (_, i) => bunyi('tik', T.n16 - 0.5 + i * 0.17, 0.12));
  const contoh = Array.from({ length: 7 }, (_, i) => bunyi('tik', T.dia + i * 0.22, 0.12));
  const hasil = Array.from({ length: 5 }, (_, i) => bunyi('pop', T.setengah - 0.2 + i * 0.16, 0.16));
  return [
    bunyi('whooshPop', 0.08, 0.3),
    ...ketik,
    bunyi('swish', T.kalimat0, 0.25),
    bunyi('glitch', T.operasi + 0.2, 0.22),
    bunyi('glitch', T.alat + 0.2, 0.22),
    bunyi('whooshA', S[1].mulai, 0.3),
    bunyi('pop', T.univ, 0.3),
    bunyi('pop', T.nature, 0.3),
    bunyi('whooshBerat', S[2].mulai + 0.05, 0.4),
    bunyi('kunci', T.fmri + 0.2, 0.3),
    bunyi('riser', T.aliran - 0.2, 0.18),
    bunyi('whooshB', S[3].mulai, 0.3),
    bunyi('pop', T.tiga, 0.25),
    ...jam,
    bunyi('pop', T.podcast, 0.25),
    bunyi('whooshA', S[4].mulai, 0.3),
    bunyi('pop', T.decoder, 0.3),
    bunyi('kunci', T.gpt, 0.35),
    bunyi('whooshLembut', S[5].mulai, 0.3),
    bunyi('glitch', T.bukan + 0.25, 0.22),
    bunyi('pop', T.inti, 0.35),
    bunyi('whooshB', S[6].mulai, 0.3),
    bunyi('swish', T.keluar6, 0.25),
    ...contoh,
    bunyi('whooshPop', S[7].mulai, 0.3),
    ...hasil,
    bunyi('kunci', T.persis, 0.3),
    bunyi('whooshA', S[8].mulai, 0.3),
    bunyi('pop', T.bayangin, 0.3),
    bunyi('pop', T.nonton, 0.3),
    bunyi('whooshB', S[9].mulai, 0.3),
    bunyi('pop', S[9].mulai + 0.1, 0.25),
    bunyi('glitch', T.lain9, 0.25),
    bunyi('whooshTurun', S[10].mulai, 0.3),
    bunyi('pop', T.mikirin - 0.1, 0.3),
    bunyi('hantam', T.gagal + 0.08, 0.45),
    bunyi('jepret', T.gagal + 0.1, 0.3),
    bunyi('whooshTerang', T.keluarDunia + 0.1, 0.3),
    bunyi('pop', T.simpan + 0.15, 0.35),
    bunyi('klik', T.simpan + 0.65, 0.4),
    bunyi('pop', T.follow - 0.2, 0.3),
    bunyi('klik', T.follow + 0.3, 0.4),
    bunyi('whooshLembut', T.keluarCta + 0.05, 0.3),
  ];
}

// ===============================================================================================================
// SAMPUL: "AI nerjemahin isi otak jadi kalimat" + kepala dengan voxel nyala + pita kalimat
export const ContohOtakSampul: React.FC = () => {
  const T = waktuOtak([], undefined, 59);
  const kam = { x: 540, y: 960, z: 1, vx: 0, vy: 0, lebar: 1080, tinggi: 1920 };
  return (
    <AbsoluteFill style={{ background: K.latar, overflow: 'hidden' }}>
      <LatarSeri kam={kam} kabut={['61,219,200', '255,107,87', '255,197,61']} />
      <div style={{ position: 'absolute', left: 0, top: 120, width: 1080, height: 1920, scale: '1.25', transformOrigin: '540px 820px' }}>
        <Kepala T={T} sampul />
      </div>
      <div style={{ position: 'absolute', left: 540, top: 1340, translate: '-50% -50%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 30px', borderRadius: 20, background: 'rgba(7,12,24,0.94)', border: `4px solid ${K.kuning}`, whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: K.kuning }}>AI:</span>
        <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 54, color: K.tinta }}>{CONTOH}</span>
      </div>
      <div style={{ position: 'absolute', left: 90, top: 196, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 10, height: 44, borderRadius: 5, background: K.teal }} />
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: K.abu }}>TANPA OPERASI · 2023</div>
      </div>
      <div style={{ position: 'absolute', left: 90, top: 262, width: 780, fontFamily: SAIRA, fontWeight: 800, fontSize: 118, lineHeight: 1.04, color: K.tinta }}>
        <div>AI ngubah isi otak</div>
        <div>
          jadi <span style={{ display: 'inline-block', background: K.kuning, color: K.latar, padding: '0 0.1em', borderRadius: 12, lineHeight: 0.98 }}>kalimat</span>
        </div>
      </div>
      <Grain kuat={0.06} garisScan={0} vinyet={0.45} warnaVinyet="2,5,14" />
    </AbsoluteFill>
  );
};
