// Frame hero (pembuka, tengah, puncak): 15, 862, 1436.
// contoh video explainer K5 (akun generik, konten contoh): "Potongan adegan jatuh di titik kedipan: temuan Walter Murch".
// Seri "meja editor amber" (sama dengan K1/K3). Timeline 2 lajur: V1 (klip adegan A/B, batas klip = titik potong) + KEDIP
// (penanda kedipan aktor). Aktor = ILUSTRASI siluet (bukan foto/wajah asli siapa pun), tanpa cuplikan film apa pun.
// Alur: playback: tiap potongan jatuh pas aktor kedip (hook) → slate The Conversation, awal 1970-an → kamera nyelam ke
// timeline: 3 titik potong "pakai feeling", kedipan cuma 1–3 frame dari situ → kutipan John Huston: kedip di antara 2 fokus
// → teori Murch: pikiran → kedip → pikiran baru → monitor = mata penonton (kelopak nutup pas potongan) → slate Nakano 2009:
// 14 baris kedipan, banyak yang barengan di bagian santai/aksi selesai → strip frame: jangan motong pas frame merem ✗ →
// HP: CTA simpan + follow → balik ke playback awal (loop).
// Fakta: Murch (Web of Stories; Radiolab "Blink" 2009); Huston dikutip Murch; Nakano dkk., Proc. R. Soc. B 2009.
import React, { useMemo } from 'react';
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  AngkaJalan, Bunyi, Dunia, EASE, GarisDigambar, kata, maju, noise, pegas, Pop, Subtitle, useDetik, type Kata, type KunciKamera,
} from "../../src/gerak";
import { ANTON, INTER, MONO } from "../../src/gerak/seri/meja-editor/font";
import {
  bunyi, Chip, CtaKD, JudulKD, kameraKD, KD, KiraInline, LatarKD, lerp, lerpKotak, PanahInline, PeneduhAtas, PlayheadKD, RangkaLayar,
  Silang, SlateKD, sorot, SumberKD, TeksturKD, TrackKD, type KlipKD, type Kotak,
} from "../../src/gerak/seri/meja-editor/seri";
import type { Kalimat } from "./ContohMilidetik";

export type DataK5 = { durasi: number; kata: Kata[]; kalimat?: Kalimat[] };

const MON: Kotak = { x: 90, y: 584, w: 900, h: 506, r: 20 };
const HP: Kotak = { x: 296, y: 540, w: 488, h: 866, r: 66 };
const X0 = 540;
const PXF = 8; // px dunia per frame (film 24 fps)
const TY = 1196; // lajur V1
const TH = 62;
const KY = 1268; // lajur KEDIP
const KH = 34;

// ======================================================================================================
function waktuK5(d: Kata[], total: number, kal: Kalimat[] = []) {
  const CAD: [number, number][] = [
    [0.13, 6.47], [6.85, 11.24], [11.63, 17.75], [18.13, 24.4], [24.78, 30.46], [30.84, 36.97], [37.36, 42.73], [43.11, 48.89], [49.27, 54.49],
    [54.87, 58.58],
  ];
  const s = CAD.map((c, i) => ({ mulai: kal[i]?.mulai ?? c[0], akhir: kal[i]?.akhir ?? c[1] }));
  const k = (c: string, setelah = 0, cad = 0) => kata(d, c, setelah, cad);
  const walter = k('walter', s[0].mulai, 1.98);
  const potongan1 = k('potongan', walter, 3.37);
  const kedip1 = k('kedip', potongan1, 6.18);
  const conversation = k('conversation', s[1].mulai, 8.72);
  const n1970 = k('1970', conversation, 10.14);
  const titik = k('titik', s[2].mulai, 12.22);
  const feeling = k('feeling', titik, 13.12);
  const jaraknya = k('jaraknya', feeling, 14.96);
  const frame3 = k('frame', jaraknya, 16.16);
  const kedipan3 = k('kedipan', frame3, 16.74);
  const gene = k('gene', kedipan3, 17.2);
  const wawancara = k('wawancara', s[3].mulai, 18.95);
  const huston = k('huston', wawancara, 20.18);
  const kedipan4 = k('kedipan', huston, 22.2);
  const antara = k('antara', kedipan4, 22.93);
  const dua = k('dua', antara, 23.27);
  const fokus = k('fokus', dua, 23.52);
  const teori = k('teori', s[4].mulai, 25.91);
  const kedip5 = k('kedip', teori, 26.92);
  const selesai5 = k('selesai', kedip5, 27.61);
  const pindah = k('pindah', selesai5, 29.18);
  const potongan6 = k('potongan', s[5].mulai, 32.23);
  const kedipan6 = k('kedipan', potongan6, 33.59);
  const penonton = k('penonton', kedipan6, 34.24);
  const nutup = k('nutup', penonton, 34.91);
  const buka = k('buka', nutup, 36.29);
  const th2009 = k('2009', s[6].mulai, 37.72);
  const jepang = k('jepang', th2009, 38.9);
  const n14 = k('14', jepang, 40.09);
  const mr = k('mr', n14, 41.45);
  const tanpa = k('tanpa', mr, 42.06);
  const barengan = k('barengan', s[7].mulai, 44.58);
  const gak8 = k('gak', barengan, 45.91);
  const aksi = k('aksi', gak8, 48.22);
  const jangan = k('jangan', s[8].mulai, 50.34);
  const motong = k('motong', jangan, 50.7);
  const frame9 = k('frame', motong, 51.75);
  const kedip9 = k('kedip', frame9, 52.61);
  const kelilipan = k('kelilipan', kedip9, 53.93);
  const simpan = k('simpan', s[9].mulai, 54.87);
  const follow = k('follow', simpan, 57.18);
  return {
    total, s, walter, potongan1, kedip1, conversation, n1970, titik, feeling, jaraknya, frame3, kedipan3, gene, wawancara, huston, kedipan4, antara, dua,
    fokus, teori, kedip5, selesai5, pindah, potongan6, kedipan6, penonton, nutup, buka, th2009, jepang, n14, mr, tanpa, barengan, gak8, aksi,
    jangan, motong, frame9, kedip9, kelilipan, simpan, follow,
    selamMasuk: s[2].mulai + 0.25,
    selamKeluar: s[3].mulai - 0.15,
    keHp: s[9].mulai,
    pulang: total - 1.05,
    loop: total - 0.3,
  };
}
type WaktuK = ReturnType<typeof waktuK5>;

// ======================================================================================================
// Klip & kedipan (satuan FRAME film 24 fps). Kedipan 5 frame [b, b+5), frame merem = b+2. Tiap potongan c: kedipan selesai
// dekat c (merem 1–4 frame sebelum c). Tiga potongan S3 (274, 294, 314) jaraknya 2 / 1 / 3 frame.
const F3 = [274, 294, 314];
const D3 = [2, 1, 3];
const DATA = (() => {
  const potong: number[] = [18, 52, 88, 118, 156, 190, 222, 250, 274, 294, 314];
  let c = 314;
  for (let i = 0; i < 60; i++) {
    c += 30 + Math.floor(random(`k5c${i}`) * 22);
    potong.push(c);
  }
  const klip: KlipKD[] = [];
  let a = -400;
  // pra-gulung sebelum 0
  const pra = [-400, -362, -330, -296, -260, -224, -190, -150, -118, -84, -48, 0];
  for (let i = 0; i < pra.length - 1; i++) klip.push({ mulai: pra[i], akhir: pra[i + 1], data: i % 2 ? 'B' : 'A' });
  a = 0;
  potong.forEach((p, i) => {
    klip.push({ mulai: a, akhir: p, data: i % 2 ? 'B' : 'A', id: `k${i}` });
    a = p;
  });
  const kedip: number[] = [];
  [...pra.slice(1, -1), ...potong].forEach((p, i) => {
    const j = F3.indexOf(p);
    const jarak = j >= 0 ? D3[j] : 1 + Math.floor(random(`k5d${i}`) * 3);
    kedip.push(p - jarak - 2);
  });
  return { klip, kedip, potong };
})();
const shotDi = (P: number) => DATA.klip.find((k) => P >= k.mulai && P < k.akhir)?.data ?? 'A';
/** 0 = melek, 1 = merem; kedipan 5 frame */
const merem = (P: number) => {
  for (const b of DATA.kedip) {
    if (P >= b && P < b + 5) return Math.sin(Math.PI * Math.min(1, (P - b + 0.5) / 5));
  }
  return 0;
};

function posisiP(t: number, T: WaktuK) {
  const S = T.s;
  const tStop = S[2].mulai + 0.25;
  const tJalan = S[3].mulai - 0.2;
  const P1 = 24 * tStop; // posisi pas mulai ngerem
  const target = F3[1] + 0.5;
  let P: number;
  if (t < tStop) P = 24 * t;
  else if (t < tStop + 0.8) P = lerp(P1, target, EASE.masuk(maju(t, tStop, tStop + 0.8, EASE.linear)));
  else if (t < tJalan) P = target + Math.sin((t - tStop - 0.8) * 1.6) * 3.2;
  else P = target + Math.sin((tJalan - tStop - 0.8) * 1.6) * 3.2 + 24 * (t - tJalan);
  // HP: balik ke 0 (lajur lagi disembunyiin) biar loop
  return P * (1 - maju(t, T.keHp + 0.6, T.keHp + 1.4, EASE.kamera));
}

// ======================================================================================================
export const ContohKedipan: React.FC<DataK5> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuK5(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const S = T.s;
  const P = posisiP(t, T);
  const ZS = { x: 540, y: 1238, z: 2.3 };
  const kunci: KunciKamera[] = [
    { t: 0, x: 540, y: 960, z: 1 },
    { t: S[1].mulai, x: 540, y: 958, z: 1.03, ease: EASE.linear },
    { t: S[1].mulai + 0.6, x: 540, y: 960, z: 1 },
    { t: T.selamMasuk, x: 540, y: 962, z: 1.02, ease: EASE.linear },
    { t: T.selamMasuk + 0.85, ...ZS },
    { t: T.selamKeluar - 0.1, x: ZS.x, y: ZS.y + 4, z: ZS.z + 0.06, ease: EASE.linear },
    { t: T.selamKeluar + 0.6, x: 540, y: 960, z: 1 },
    { t: S[6].mulai, x: 540, y: 958, z: 1.03, ease: EASE.linear },
    { t: S[6].mulai + 0.5, x: 540, y: 960, z: 1 },
    { t: T.keHp, x: 540, y: 960, z: 1.025, ease: EASE.linear },
    { t: T.keHp + 0.6, x: 540, y: 960, z: 1 },
    { t: T.pulang, x: 540, y: 960, z: 1.01, ease: EASE.linear },
    { t: T.loop, x: 540, y: 960, z: 1 },
    { t: total + 1, x: 540, y: 960, z: 1 },
  ];
  const getar = [
    { t: T.n1970 + 0.02, kuat: 9 },
    { t: T.th2009 + 0.02, kuat: 9 },
    { t: T.frame9 + 0.1, kuat: 7 },
    { t: T.follow + 0.33, kuat: 5 },
  ];
  const kam = kameraKD(kunci, t, fps, total, getar);
  const selam = maju(t, T.selamMasuk + 0.1, T.selamMasuk + 0.85, EASE.kamera) * (1 - maju(t, T.selamKeluar - 0.1, T.selamKeluar + 0.5, EASE.kamera));
  const hp = maju(t, T.keHp + 0.05, T.keHp + 0.75, EASE.kamera) * (1 - maju(t, T.pulang, T.loop - 0.05, EASE.kamera));
  const box = lerpKotak(MON, HP, hp);
  const oTrack = Math.min(1, 1 - maju(t, T.keHp, T.keHp + 0.45, EASE.keluar) + maju(t, T.pulang + 0.1, T.loop - 0.1, EASE.masuk));
  const yTrack = (1 - oTrack) * 120;
  return (
    <AbsoluteFill style={{ background: KD.latar, color: KD.tulang, overflow: 'hidden', fontFamily: INTER }}>
      <LatarKD kam={kam} />
      <Dunia kamera={kam} tinggiDunia={1920} lebarDunia={1080} blurGerak={1400}>
        <RangkaLayar k={box} hp={hp} tag={tagMonitor(t, T)} timecode={hp < 0.5 ? kodeFilm(P) : undefined} redup={selam}>
          <IsiMonitor T={T} P={P} box={box} hp={hp} />
        </RangkaLayar>
        <SumberMonitor T={T} selam={selam} hp={hp} />
        <div style={{ position: 'absolute', left: 0, top: 0, translate: `0 ${yTrack.toFixed(1)}px` }}>
          <TrackKD
            klip={DATA.klip}
            P={P}
            pxms={PXF}
            x0={X0}
            y={TY}
            h={TH}
            frameMs={selam > 0.3 ? 1 : 6}
            asalGrid={0}
            labelGrid={0}
            redup={() => 1}
            isiKlip={(k, w, h) => <MiniShot shot={k.data ?? 'A'} w={w} h={h} />}
            o={oTrack}
          />
          <LajurKedip T={T} P={P} o={oTrack} />
          <PlayheadKD x={X0} y={TY} h={KY + KH - TY} o={oTrack} />
        </div>
        <PotongS3 T={T} P={P} />
      </Dunia>
      <PeneduhAtas kuat={Math.max(selam, 0.5)} />
      <HudK5 T={T} />
      <Subtitle
        kata={d.kata}
        kalimat={d.kalimat}
        font={INTER}
        tebal={700}
        ukuran={44}
        maksHuruf={34}
        sorot={KD.amber}
        pita="rgba(11,11,14,0.62)"
        sampai={T.loop - 0.4}
        zona={[{ dari: 0, x: 540, y: 1346, lebar: 960 }, { dari: T.keHp + 0.3, x: 540, y: 1436, lebar: 960 }, { dari: T.pulang, x: 540, y: 1346, lebar: 960 }]}
      />
      <TeksturKD />
      <></>
    </AbsoluteFill>
  );
};

const kodeFilm = (P: number) => {
  const f = Math.max(0, Math.floor(P));
  return `${String(Math.floor(f / 24)).padStart(2, '0')}s ${String(f % 24).padStart(2, '0')}f`;
};
function tagMonitor(t: number, T: WaktuK) {
  const S = T.s;
  if ((t > S[3].mulai - 0.2 && t < S[6].mulai) || (t > S[6].mulai && t < S[9].mulai)) return 'ILUSTRASI';
  return 'PROGRAM · 24 FPS';
}

// ======================================================================================================
// AKTOR ilustrasi: siluet gelap (tanpa wajah orang sungguhan) yang cuma keliatan matanya. shot A = sedang, B = dekat.
export const Aktor: React.FC<{ W: number; H: number; shot: string; tutup: number; lirik?: number; seed?: string }> = ({ W, H, shot, tutup, lirik = 0, seed = 'ak' }) => {
  const t = useDetik();
  const napas = Math.sin(t * 1.9) * 1.6;
  const geser = noise(`${seed}g`, t * 0.3) * 4;
  const dekat = shot === 'B';
  const g = dekat ? 'translate(500 300) scale(2.5) translate(-500 -252)' : `translate(${500 + geser} ${300 + napas}) scale(1.5) translate(-500 -262)`;
  const mata = (x: number) => {
    const y = 252;
    const almond = `M ${x - 21} ${y} Q ${x} ${y - 15} ${x + 21} ${y} Q ${x} ${y + 13} ${x - 21} ${y} Z`;
    const id = `${seed}-m${x}`;
    return (
      <g key={x}>
        <clipPath id={id}>
          <path d={almond} />
        </clipPath>
        <path d={almond} fill="#e8e0d0" />
        <g clipPath={`url(#${id})`}>
          <circle cx={x + lirik * 9} cy={y} r={8.5} fill="#2a1d13" />
          <circle cx={x + lirik * 9 + 2.5} cy={y - 3} r={2.4} fill="#fff6e8" />
          <rect x={x - 24} y={y - 16} width={48} height={30 * tutup} fill="#7a5c45" />
          <path d={`M ${x - 22} ${y - 16 + 30 * tutup} H ${x + 22}`} stroke="#0d0b09" strokeWidth={3} />
        </g>
        <path d={`M ${x - 22} ${y - 26} Q ${x} ${y - 36 + tutup * 5} ${x + 20} ${y - 25}`} stroke="#1c1410" strokeWidth={7} fill="none" strokeLinecap="round" />
      </g>
    );
  };
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'radial-gradient(ellipse 80% 90% at 60% 34%, #5a4430 0%, #2a2018 55%, #120e0b 100%)' }}>
      {/* cahaya krei jendela (diagonal), hanyut + napas terang */}
      <div style={{ position: 'absolute', inset: '-20%', background: 'repeating-linear-gradient(-28deg, rgba(255,190,110,0.09) 0 34px, transparent 34px 86px)', translate: `${(t * 16) % 120}px 0`, opacity: 0.75 + 0.25 * Math.sin(t * 1.3) }} />
      {/* kamera ilustrasi gak pernah diam: push-in pelan + drift (prinsip 4) */}
      <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: W, height: H, scale: String(1.04 + 0.035 * noise(`${seed}kb`, t * 0.35)), translate: `${(noise(`${seed}dx`, t * 0.4) * W * 0.018).toFixed(2)}px ${(noise(`${seed}dy`, t * 0.33) * H * 0.014).toFixed(2)}px` }}>
        <defs>
          <radialGradient id={`${seed}-kulit`} cx="0.38" cy="0.35" r="0.8">
            <stop offset="0" stopColor="#9a7658" />
            <stop offset="1" stopColor="#5a4231" />
          </radialGradient>
        </defs>
        <g transform={g}>
          {/* bahu + leher */}
          <path d="M 270 600 Q 290 430 430 405 L 470 380 L 530 380 L 570 405 Q 710 430 730 600 Z" fill="#2b2420" />
          <path d="M 470 330 L 470 395 Q 500 410 530 395 L 530 330 Z" fill="#5e4535" />
          <path d="M 452 402 L 500 452 L 548 402" fill="none" stroke="#3d342d" strokeWidth={8} strokeLinejoin="round" />
          {/* kepala */}
          <ellipse cx={500} cy={255} rx={92} ry={114} fill={`url(#${seed}-kulit)`} />
          <ellipse cx={410} cy={262} rx={13} ry={24} fill="#6a4e3b" />
          <ellipse cx={590} cy={262} rx={13} ry={24} fill="#6a4e3b" />
          {/* rambut */}
          <path d="M 406 232 Q 400 140 500 132 Q 604 136 596 236 Q 584 180 500 176 Q 420 178 406 232 Z" fill="#0f0c0a" />
          {/* garis cahaya pinggir (rim) */}
          <path d="M 418 200 Q 404 262 430 330" stroke="#ffb454" strokeWidth={5} fill="none" opacity={0.7} strokeLinecap="round" />
          {mata(464)}
          {mata(536)}
          <path d="M 500 262 L 494 300 L 504 302" stroke="#4a3426" strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d="M 478 326 Q 500 334 522 326" stroke="#4a3426" strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

/** cuplikan mini di klip timeline (A = sedang, B = dekat), digambar, bukan foto */
const MiniShot: React.FC<{ shot: string; w: number; h: number }> = ({ shot, h }) => (
  <div style={{ position: 'absolute', inset: 0, background: shot === 'B' ? '#3a2c1f' : '#2a2119' }}>
    <svg style={{ position: 'absolute', left: 6, top: 0 }} width={60} height={h} viewBox="0 0 60 62">
      {shot === 'B' ? (
        <>
          <path d="M 8 31 Q 18 23 28 31 Q 18 38 8 31 Z" fill="#e8e0d0" opacity={0.85} />
          <path d="M 32 31 Q 42 23 52 31 Q 42 38 32 31 Z" fill="#e8e0d0" opacity={0.85} />
        </>
      ) : (
        <>
          <ellipse cx={30} cy={27} rx={10} ry={12} fill="#1a1612" />
          <path d="M 12 62 Q 14 44 30 42 Q 46 44 48 62 Z" fill="#14110e" />
        </>
      )}
    </svg>
  </div>
);

// lajur KEDIP: ikon mata merem di frame merem tiap kedipan --------------------------------------------------------------
const LajurKedip: React.FC<{ T: WaktuK; P: number; o: number }> = ({ T, P, o }) => {
  const t = useDetik();
  if (o <= 0) return null;
  const xDari = (f: number) => X0 + (f - P) * PXF;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      <div style={{ position: 'absolute', left: 40, top: KY, width: 1000, height: KH, borderRadius: 8, background: KD.lajur, border: `2px solid ${KD.garis}` }} />
      <div style={{ position: 'absolute', left: 40, top: KY, width: 1000, height: KH, overflow: 'hidden' }}>
        {DATA.kedip.map((b, i) => {
          const x = xDari(b + 2) - 40;
          if (x < -30 || x > 1030) return null;
          const aktif = P >= b && P < b + 5;
          return (
            <svg key={i} style={{ position: 'absolute', left: x - 15, top: KH / 2 - 9 }} width={30} height={18} viewBox="0 0 30 18">
              <path d="M 3 7 Q 15 17 27 7" fill="none" stroke={aktif ? KD.tulang : KD.amber} strokeWidth={3.2} strokeLinecap="round" />
              <path d="M 8 11 L 6 15 M 15 13 L 15 17 M 22 11 L 24 15" stroke={aktif ? KD.tulang : KD.amber} strokeWidth={2.4} strokeLinecap="round" />
            </svg>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 48, top: KY + 6, fontFamily: INTER, fontWeight: 800, fontSize: 15, letterSpacing: '0.1em', color: KD.abu, padding: '0 6px', background: KD.lajur, opacity: 0.95 }}>KEDIP</div>
      <div style={{ position: 'absolute', left: 48, top: TY - 30, fontFamily: INTER, fontWeight: 800, fontSize: 15, letterSpacing: '0.1em', color: KD.abu, opacity: 0.9 - 0.9 * maju(t, T.selamMasuk, T.selamMasuk + 0.3) + 0.9 * maju(t, T.selamKeluar, T.selamKeluar + 0.3) }}>V1 · ADEGAN</div>
    </div>
  );
};

// S3: tiga titik potong (digambar) + jarak ke kedipan (1–3 frame) ------------------------------------------------------
const PotongS3: React.FC<{ T: WaktuK; P: number }> = ({ T, P }) => {
  const t = useDetik();
  const o = maju(t, T.selamMasuk + 0.6, T.selamMasuk + 0.9) * (1 - maju(t, T.selamKeluar - 0.2, T.selamKeluar + 0.1));
  if (o <= 0) return null;
  const xDari = (f: number) => X0 + (f - P) * PXF;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      {F3.map((c, i) => {
        const mp = T.titik + 0.15 + i * 0.32;
        const x = xDari(c);
        const xk = xDari(c - D3[i]);
        const mj = T.jaraknya + i * 0.45;
        return (
          <React.Fragment key={i}>
            <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
              <GarisDigambar d={`M ${x} ${TY - 34} V ${KY + KH + 6}`} mulai={mp} lama={0.2} warna={KD.amber} tebal={3} />
              {/* gunting kecil di atas garis potong */}
              {t > mp ? (
                <g transform={`translate(${x} ${TY - 46})`} opacity={maju(t, mp, mp + 0.15)}>
                  <circle cx={-6} cy={-6} r={4.5} fill="none" stroke={KD.amber} strokeWidth={2.4} />
                  <circle cx={6} cy={-6} r={4.5} fill="none" stroke={KD.amber} strokeWidth={2.4} />
                  <path d="M -3 -3 L 7 9 M 3 -3 L -7 9" stroke={KD.amber} strokeWidth={2.4} strokeLinecap="round" />
                </g>
              ) : null}
              {/* braket jarak kedip → potong (di bawah lajur KEDIP) */}
              {t > mj ? <path d={`M ${xk} ${KY + KH + 8} V ${KY + KH + 14} H ${x} V ${KY + KH + 8}`} fill="none" stroke={KD.tulang} strokeWidth={2.4} opacity={maju(t, mj, mj + 0.15)} /> : null}
            </svg>
            {t > mj ? (
              <div style={{ position: 'absolute', left: (x + xk) / 2, top: KY + KH + 17, translate: '-50% 0', fontFamily: INTER, fontWeight: 800, fontSize: 13, color: KD.tulang, whiteSpace: 'nowrap', opacity: maju(t, mj, mj + 0.15) }}>
                {D3[i]} frame
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
      <div style={{ position: 'absolute', left: xDari(F3[0]) - 20, top: TY - 92, fontFamily: INTER, fontWeight: 800, fontSize: 14, color: KD.amber, whiteSpace: 'nowrap', opacity: maju(t, T.feeling, T.feeling + 0.2) }}>
        titik potong (pakai feeling)
      </div>
      <div style={{ position: 'absolute', left: X0, top: KY + KH + 38, translate: '-50% 0', fontFamily: INTER, fontWeight: 800, fontSize: 13, color: KD.amber, whiteSpace: 'nowrap', opacity: maju(t, T.kedipan3, T.kedipan3 + 0.2) }}>
        jarak kedipan aktor → titik potong
      </div>
    </div>
  );
};

// ======================================================================================================
const IsiMonitor: React.FC<{ T: WaktuK; P: number; box: Kotak; hp: number }> = ({ T, P, box, hp }) => {
  const t = useDetik();
  const S = T.s;
  const W = box.w - 6;
  const H = box.h - 6;
  // playback (S1–S3) & balik di loop
  const oPlay = 1 - maju(t, S[3].mulai - 0.2, S[3].mulai + 0.1) + maju(t, T.pulang + 0.15, T.loop - 0.15);
  return (
    <>
      {oPlay > 0 && hp < 0.6 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, oPlay) }}>
          <Aktor W={W} H={H} shot={shotDi(P)} tutup={merem(P)} seed="pb" />
        </div>
      ) : null}
      <KartuMurch T={T} W={W} H={H} />
      <SlateK5 T={T} W={W} H={H} />
      <HustonK5 T={T} W={W} H={H} />
      <PikiranK5 T={T} W={W} H={H} />
      <KelopakK5 T={T} W={W} H={H} />
      <RasterK5 T={T} W={W} H={H} />
      <StripK5 T={T} W={W} H={H} />
      <HpK5 T={T} W={W} H={H} hp={hp} />
    </>
  );
};

// S1: kartu nama (lower third) Walter Murch — tanpa foto ------------------------------------------------------------
const KartuMurch: React.FC<{ T: WaktuK; W: number; H: number }> = ({ T, H }) => {
  const t = useDetik();
  const S = T.s;
  const o = maju(t, T.walter - 0.1, T.walter + 0.15) * (1 - maju(t, S[0].akhir - 0.1, S[0].akhir + 0.15));
  if (o <= 0) return null;
  const p = maju(t, T.walter - 0.1, T.walter + 0.35, EASE.masuk);
  return (
    <div style={{ position: 'absolute', left: 24, top: H - 132, opacity: o, display: 'flex', alignItems: 'stretch', gap: 0, translate: `${((1 - p) * -40).toFixed(1)}px 0` }}>
      <div style={{ width: 8, background: KD.amber, borderRadius: 4 }} />
      <div style={{ padding: '10px 22px 12px', background: 'rgba(11,11,14,0.9)', borderRadius: '0 12px 12px 0' }}>
        <div style={{ fontFamily: ANTON, fontSize: 52, lineHeight: 1, color: KD.tulang }}>WALTER MURCH</div>
        <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 25, color: KD.amber, marginTop: 6 }}>editor film · peraih Oscar</div>
      </div>
    </div>
  );
};

// S2 & S7: slate ----------------------------------------------------------------------------------------------------
const SlateK5: React.FC<{ T: WaktuK; W: number; H: number }> = ({ T, W, H }) => {
  const t = useDetik();
  const S = T.s;
  const g1 = maju(t, S[1].mulai - 0.1, S[1].mulai + 0.2) * (1 - maju(t, S[2].mulai - 0.15, S[2].mulai + 0.2));
  const g2 = maju(t, S[6].mulai - 0.15, S[6].mulai + 0.15) * (1 - maju(t, T.n14 - 0.75, T.n14 - 0.45));
  const g = Math.max(g1, g2);
  return (
    <>
      {g > 0 ? <div style={{ position: 'absolute', inset: 0, background: `rgba(14,13,16,${(0.92 * g).toFixed(3)})` }} /> : null}
      <SlateKD
        x={W / 2}
        y={H / 2 + 4}
        w={560}
        masuk={S[1].mulai - 0.05}
        tepuk={T.n1970}
        keluar={S[2].mulai - 0.3}
        baris={[
          { label: 'FILM', isi: 'The Conversation', mulai: T.conversation - 0.1 },
          { label: 'EDITOR', isi: 'Walter Murch', mulai: S[1].mulai + 0.35 },
          { label: 'TAHUN', isi: 'awal 1970-an', mulai: T.n1970 - 0.05, warna: KD.amber },
        ]}
      />
      <SlateKD
        x={W / 2}
        y={H / 2 + 4}
        w={560}
        masuk={S[6].mulai - 0.1}
        tepuk={T.th2009}
        keluar={T.n14 - 0.85}
        baris={[
          { label: 'RISET', isi: 'Nakano dkk.', mulai: S[6].mulai + 0.2 },
          { label: 'TEMPAT', isi: 'Univ. of Tokyo', mulai: T.jepang - 0.05 },
          { label: 'TAHUN', isi: '2009', mulai: T.th2009 - 0.05, warna: KD.amber },
        ]}
      />
    </>
  );
};

// S4: kutipan John Huston + mata pindah dari fokus 1 ke fokus 2 (kedip di antaranya) ---------------------------------------
const HustonK5: React.FC<{ T: WaktuK; W: number; H: number }> = ({ T, W, H }) => {
  const t = useDetik();
  const S = T.s;
  const o = maju(t, S[3].mulai - 0.2, S[3].mulai + 0.1) * (1 - maju(t, S[4].mulai - 0.15, S[4].mulai + 0.1));
  if (o <= 0) return null;
  const kartu = maju(t, S[3].mulai, S[3].mulai + 0.35) * (1 - maju(t, T.kedipan4 - 0.45, T.kedipan4 - 0.15));
  const adegan = maju(t, T.kedipan4 - 0.4, T.kedipan4 - 0.1);
  // mata: lirik kiri (fokus 1) → kedip → lirik kanan (fokus 2)
  const mKedip = T.dua - 0.12;
  const lirik = lerp(-1, 1, maju(t, mKedip + 0.05, mKedip + 0.18, EASE.kamera));
  const tutup = Math.sin(Math.PI * maju(t, mKedip - 0.12, mKedip + 0.12, EASE.linear));
  const f1 = maju(t, T.kedipan4 - 0.1, T.kedipan4 + 0.15);
  const f2 = maju(t, T.antara, T.antara + 0.2);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, background: '#0e0d10' }}>
      {adegan > 0 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: adegan }}>
          <Aktor W={W} H={H} shot="A" tutup={tutup} lirik={lirik} seed="hs" />
          {/* fokus 1 (kiri): lampu meja · fokus 2 (kanan): telepon — digambar */}
          <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
            <g opacity={f1} transform={`translate(${W * 0.14} ${H * 0.6})`}>
              <path d="M -40 -40 L 40 -40 L 24 -90 L -24 -90 Z" fill={lirik < 0 ? KD.amber : '#6b5a44'} />
              <path d="M 0 -40 V 50 M -34 50 H 34" stroke={lirik < 0 ? KD.amber : '#6b5a44'} strokeWidth={7} strokeLinecap="round" />
            </g>
            <g opacity={f2} transform={`translate(${W * 0.86} ${H * 0.6})`}>
              <rect x={-34} y={-70} width={68} height={120} rx={12} fill="none" stroke={lirik > 0 ? KD.amber : '#6b5a44'} strokeWidth={7} />
              <circle cx={0} cy={36} r={6} fill={lirik > 0 ? KD.amber : '#6b5a44'} />
            </g>
          </svg>
          <Chip x={W * 0.14} y={H * 0.86} teks="fokus 1" ukuran={26} o={f1} warna={lirik < 0 ? KD.amber : KD.abu} />
          <Chip x={W * 0.86} y={H * 0.86} teks="fokus 2" ukuran={26} o={f2} warna={lirik > 0 ? KD.amber : KD.abu} />
          <Chip x={W / 2} y={60} teks="kedip" ukuran={28} isi o={maju(t, mKedip - 0.12, mKedip) * (1 - maju(t, mKedip + 0.6, mKedip + 0.8))} />
        </div>
      ) : null}
      {kartu > 0 ? (
        <div style={{ position: 'absolute', left: W / 2, top: H / 2, translate: '-50% -50%', rotate: '-1.5deg', width: W * 0.8, padding: '26px 34px', borderRadius: 6, background: '#e9e2d3', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', opacity: kartu, scale: String(0.92 + 0.08 * kartu) }}>
          <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 20, letterSpacing: '0.14em', color: '#6b6457' }}>WAWANCARA · JOHN HUSTON, SUTRADARA</div>
          <div style={{ fontFamily: ANTON, fontSize: 52, lineHeight: 1.08, color: KD.latar, marginTop: 10 }}>
            “POTONGAN ITU KEDIPAN DI ANTARA <span style={{ background: KD.amber, padding: '0 6px' }}>DUA FOKUS</span> PERHATIAN.”
          </div>
          <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 20, color: '#6b6457', marginTop: 10 }}>dikutip Walter Murch (terjemahan kami)</div>
        </div>
      ) : null}
    </div>
  );
};

// S5: pikiran 1 → kedip → pikiran baru (gelembung digambar di atas kepala) ------------------------------------------------
const PikiranK5: React.FC<{ T: WaktuK; W: number; H: number }> = ({ T, W, H }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const o = maju(t, S[4].mulai - 0.15, S[4].mulai + 0.1) * (1 - maju(t, S[5].mulai - 0.15, S[5].mulai + 0.1));
  if (o <= 0) return null;
  const mK = T.kedip5;
  const tutup = Math.sin(Math.PI * maju(t, mK - 0.08, mK + 0.17, EASE.linear));
  const b1 = pegas(t, S[4].mulai + 0.1, fps, { damping: 12, stiffness: 180 }) * (1 - maju(t, mK - 0.05, mK + 0.1, EASE.keluar));
  const b2 = pegas(t, T.pindah - 0.1, fps, { damping: 11, stiffness: 180 });
  const gel = (x: number, y: number, s: number, isi: React.ReactNode, label: string, warna: string) =>
    s <= 0.01 ? null : (
      <div style={{ position: 'absolute', left: x, top: y, translate: '-50% -50%', scale: String(s) }}>
        <div style={{ width: 200, height: 130, borderRadius: 65, background: '#efebe2', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 26px rgba(0,0,0,0.5)' }}>{isi}</div>
        <div style={{ position: 'absolute', left: -28, top: 120, width: 30, height: 30, borderRadius: 15, background: '#efebe2' }} />
        <div style={{ position: 'absolute', left: -52, top: 156, width: 16, height: 16, borderRadius: 8, background: '#efebe2' }} />
        <div style={{ position: 'absolute', left: 100, top: -38, translate: '-50% 0', fontFamily: INTER, fontWeight: 800, fontSize: 24, color: warna, whiteSpace: 'nowrap' }}>{label}</div>
      </div>
    );
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, background: '#0e0d10' }}>
      <div style={{ position: 'absolute', left: -W * 0.16, top: 0, width: W, height: H }}>
        <Aktor W={W} H={H} shot="A" tutup={tutup} lirik={t < mK ? -0.3 : 0.4} seed="pk" />
      </div>
      {gel(W * 0.68, H * 0.28, b1, <IkonBola />, 'pikiran 1', KD.abu)}
      {gel(W * 0.74, H * 0.3, b2, <IkonBintang />, 'pikiran baru', KD.amber)}
      <Chip x={W * 0.34} y={H * 0.12} teks="kedip" ukuran={28} isi o={maju(t, mK - 0.1, mK) * (1 - maju(t, mK + 0.7, mK + 0.9))} />
    </div>
  );
};
const IkonBola: React.FC = () => (
  <svg width={80} height={80} viewBox="0 0 80 80">
    <circle cx={40} cy={40} r={26} fill="none" stroke={KD.latar} strokeWidth={7} />
    <path d="M 30 40 H 50" stroke={KD.latar} strokeWidth={7} strokeLinecap="round" />
  </svg>
);
const IkonBintang: React.FC = () => (
  <svg width={80} height={80} viewBox="0 0 80 80">
    <path d="M 40 8 L 48 30 L 72 31 L 53 46 L 60 70 L 40 56 L 20 70 L 27 46 L 8 31 L 32 30 Z" fill={KD.amber} stroke={KD.latar} strokeWidth={4} strokeLinejoin="round" />
  </svg>
);

// S6: monitor = mata penonton. Kelopak nutup pas potongan, adegan di baliknya ganti --------------------------------------
const KelopakK5: React.FC<{ T: WaktuK; W: number; H: number }> = ({ T, W, H }) => {
  const t = useDetik();
  const S = T.s;
  const o = maju(t, S[5].mulai - 0.15, S[5].mulai + 0.1) * (1 - maju(t, S[6].mulai - 0.2, S[6].mulai + 0.05));
  if (o <= 0) return null;
  // kedip 1 (cepat) pas "kedipan", kedip 2: nutup pas "nutup", buka pas "buka"
  const k1 = Math.sin(Math.PI * maju(t, T.kedipan6 - 0.1, T.kedipan6 + 0.25, EASE.linear));
  const k2 = maju(t, T.nutup - 0.05, T.nutup + 0.2, EASE.kamera) * (1 - maju(t, T.buka - 0.05, T.buka + 0.25, EASE.kamera));
  const merem2 = maju(t, T.nutup + 0.2, T.nutup + 0.3) * (1 - maju(t, T.buka - 0.1, T.buka - 0.05));
  const k = Math.max(k1, k2) * (1 - 0.07 * merem2 * (0.5 + 0.5 * Math.sin((t - T.nutup) * 6.5)));
  const shot = t < T.kedipan6 + 0.07 ? 'A' : t < T.buka ? 'B' : 'A';
  const latar = t > T.buka ? 'pk2' : 'kl';
  const tepi = (atas: boolean) => {
    const yb = (H / 2 + 6) * k;
    const lengkung = 70 * (1 - k * 0.6);
    const d = atas
      ? `M -10 -10 H ${W + 10} V ${yb} Q ${W / 2} ${yb + lengkung} -10 ${yb} Z`
      : `M -10 ${H + 10} H ${W + 10} V ${H - yb} Q ${W / 2} ${H - yb - lengkung} -10 ${H - yb} Z`;
    const garis = atas ? `M -10 ${yb} Q ${W / 2} ${yb + lengkung} ${W + 10} ${yb}` : `M -10 ${H - yb} Q ${W / 2} ${H - yb - lengkung} ${W + 10} ${H - yb}`;
    return (
      <>
        <path d={d} fill="#0b0b0e" />
        <path d={garis} fill="none" stroke={KD.amber} strokeWidth={5} opacity={k > 0.02 ? 1 : 0} />
      </>
    );
  };
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, background: '#0e0d10' }}>
      <div style={{ position: 'absolute', inset: 0, filter: latar === 'pk2' ? 'hue-rotate(-12deg) saturate(1.2)' : undefined }}>
        <Aktor W={W} H={H} shot={shot} tutup={0} lirik={shot === 'B' ? 0.3 : -0.2} seed="kl" />
      </div>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={H}>
        {tepi(true)}
        {tepi(false)}
      </svg>
      <Chip x={W / 2} y={H / 2} teks="POTONGAN" ukuran={34} isi o={maju(k, 0.75, 0.9, EASE.linear)} skala={1 + 0.06 * merem2 * Math.sin((t - T.nutup) * 6.5)} />
      <Chip x={W / 2} y={H - 40} teks="mata penonton" ukuran={24} o={maju(t, T.penonton - 0.1, T.penonton + 0.15)} />
    </div>
  );
};

// S7–S8: raster kedipan 14 orang (riset Nakano 2009) — banyak yang barengan di bagian santai -------------------------------
const KOLOM_BARENG = [0.3, 0.58, 0.84];
const RASTER = Array.from({ length: 14 }, (_, r) => {
  const titik: { x: number; bareng: boolean }[] = [];
  for (let i = 0; i < 5; i++) titik.push({ x: 0.04 + random(`rs${r}-${i}`) * 0.92, bareng: false });
  KOLOM_BARENG.forEach((c, j) => {
    if (random(`rb${r}-${j}`) < 0.82) titik.push({ x: c + (random(`rj${r}-${j}`) - 0.5) * 0.026, bareng: true });
  });
  return titik;
});
const RasterK5: React.FC<{ T: WaktuK; W: number; H: number }> = ({ T, W, H }) => {
  const t = useDetik();
  const S = T.s;
  const o = maju(t, T.n14 - 0.75, T.n14 - 0.45) * (1 - maju(t, S[8].mulai - 0.2, S[8].mulai + 0.05));
  if (o <= 0) return null;
  const x0 = 120;
  const x1 = W - 34;
  const y0 = 112;
  const tinggiBaris = (H - y0 - 54) / 14;
  const pBaris = maju(t, T.n14 - 0.5, T.n14 + 0.15, EASE.linear);
  const nBaris = Math.min(14, Math.floor(pBaris * 14 + 0.0001));
  const sapu = maju(t, T.mr - 0.2, T.barengan - 0.15, EASE.linear);
  const xs = lerp(x0, x1, sapu);
  const band = maju(t, T.barengan - 0.05, T.barengan + 0.25);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, background: '#0e0d10' }}>
      <div style={{ position: 'absolute', left: 24, top: 52, display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={{ fontFamily: ANTON, fontSize: 46, lineHeight: 1, color: KD.amber, minWidth: '1.1em', display: 'inline-block', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{nBaris}</span>
        <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 24, color: KD.abu }}>orang</span>
      </div>
      <Chip x={W - 210} y={76} teks="video Mr. Bean · tanpa suara" ukuran={24} o={maju(t, T.mr - 0.1, T.mr + 0.15)} warna={KD.tulang} />
      {/* pita kolom kedip barengan */}
      {KOLOM_BARENG.map((c, j) => (
        <div key={j} style={{ position: 'absolute', left: lerp(x0, x1, c) - 22, top: y0 - 6, width: 44, height: tinggiBaris * 14 + 12, borderRadius: 8, background: 'rgba(255,180,84,0.2)', border: `2px solid ${KD.amber}`, opacity: band * maju(t, T.barengan + j * 0.12, T.barengan + 0.2 + j * 0.12) }} />
      ))}
      {Array.from({ length: nBaris }, (_, r) => (
        <React.Fragment key={r}>
          <div style={{ position: 'absolute', left: x0, top: y0 + r * tinggiBaris + tinggiBaris / 2, width: x1 - x0, height: 2, background: 'rgba(239,235,226,0.14)' }} />
          <svg style={{ position: 'absolute', left: 30, top: y0 + r * tinggiBaris + tinggiBaris / 2 - 9 }} width={60} height={18} viewBox="0 0 60 18">
            <circle cx={9} cy={7} r={5} fill={KD.abu} />
            <path d="M 2 18 Q 9 10 16 18 Z" fill={KD.abu} />
          </svg>
          {RASTER[r].map((d, i) => {
            const x = lerp(x0, x1, d.x);
            if (x > xs) return null;
            const nyala = d.bareng && band > 0;
            return <div key={i} style={{ position: 'absolute', left: x - 3, top: y0 + r * tinggiBaris + 3, width: 6, height: tinggiBaris - 6, borderRadius: 3, background: nyala ? KD.amber : KD.tulang, opacity: nyala ? 1 : 0.75 }} />;
          })}
        </React.Fragment>
      ))}
      {sapu > 0 && sapu < 1 ? <div style={{ position: 'absolute', left: xs - 1.5, top: y0 - 10, width: 3, height: tinggiBaris * 14 + 20, background: KD.amber }} /> : null}
      <div style={{ position: 'absolute', left: x0, top: H - 40, fontFamily: INTER, fontWeight: 700, fontSize: 20, color: KD.abu, letterSpacing: '0.1em' }}>WAKTU VIDEO →</div>
      {KOLOM_BARENG.map((c, j) => (
        <Chip
          key={j}
          x={lerp(x0, x1, c)}
          y={H - 30}
          teks={j === 1 ? 'aksi selesai' : 'bagian santai'}
          ukuran={20}
          isi
          o={j === 1 ? maju(t, T.aksi - 0.1, T.aksi + 0.1) : maju(t, T.gak8 + 0.1 + j * 0.15, T.gak8 + 0.3 + j * 0.15)}
        />
      ))}
    </div>
  );
};

// S9: strip frame kedipan — jangan motong pas frame merem ✗ (rasanya kayak kelilipan) --------------------------------------
const StripK5: React.FC<{ T: WaktuK; W: number; H: number }> = ({ T, W, H }) => {
  const t = useDetik();
  const S = T.s;
  const o = maju(t, S[8].mulai - 0.2, S[8].mulai + 0.1) * (1 - maju(t, S[9].mulai - 0.2, S[9].mulai + 0.05));
  if (o <= 0) return null;
  const TUTUP = [0, 0.45, 1, 0.5, 0, 0];
  const n = TUTUP.length;
  const gap = 10;
  const fw = (W - 60 - gap * (n - 1)) / n;
  const fh = fw * 1.25;
  const y = H / 2 - fh / 2 + 16;
  const xF = (i: number) => 30 + i * (fw + gap);
  const xPotong = xF(2) - gap / 2;
  const getar = t > T.kelilipan - 0.1 && t < T.kelilipan + 0.6 ? Math.sin(t * 70) * 5 : 0;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, background: '#0e0d10' }}>
      {TUTUP.map((tt, i) => {
        const m = S[8].mulai + 0.1 + i * 0.08;
        const tampil = maju(t, m, m + 0.2);
        const sesudahPotong = i >= 2 && t > T.jangan + 0.4;
        return (
          <div key={i} style={{ position: 'absolute', left: xF(i) + (i === 2 ? getar : 0), top: y, width: fw, height: fh, borderRadius: 8, overflow: 'hidden', opacity: tampil, border: `3px solid ${i === 2 && t > T.frame9 ? KD.koral : 'rgba(199,159,85,0.6)'}`, translate: `${sesudahPotong ? 10 * maju(t, T.jangan + 0.4, T.jangan + 0.6) : 0}px 0` }}>
            <div style={{ position: 'absolute', left: -fw * 0.9, top: -fh * 0.35, width: fw * 2.8, height: fh * 1.7 }}>
              <Aktor W={fw * 2.8} H={fh * 1.7} shot="B" tutup={tt} seed={`st${i}`} />
            </div>
            <div style={{ position: 'absolute', left: 6, top: 4, fontFamily: MONO, fontWeight: 700, fontSize: 16, color: KD.tulang, textShadow: '0 1px 3px #000' }}>{i + 1}</div>
          </div>
        );
      })}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d={`M ${xPotong} ${y - 40} V ${y + fh + 40}`} mulai={T.jangan + 0.1} lama={0.25} warna={KD.koral} tebal={5} />
      </svg>
      <Chip x={xPotong} y={y - 58} teks="potong di sini?" ukuran={24} warna={KD.koral} o={maju(t, T.motong, T.motong + 0.2)} />
      <Silang x={xF(2) + fw / 2} y={y + fh / 2} s={fw * 0.7} mulai={T.frame9} tebal={12} />
      <Chip x={xF(2) + fw / 2} y={y + fh + 34} teks="frame merem" ukuran={22} warna={KD.koral} o={maju(t, T.kedip9 - 0.1, T.kedip9 + 0.1)} />
      {t > T.kelilipan - 0.15 ? (
        <Pop mulai={T.kelilipan - 0.15} gaya={{ position: 'absolute', left: xF(3) + 6, top: y - 70 }}>
          <div style={{ padding: '6px 16px', borderRadius: 12, background: KD.koral, color: KD.latar, fontFamily: ANTON, fontSize: 40, lineHeight: 1 }}>KELILIPAN!</div>
        </Pop>
      ) : null}
    </div>
  );
};

// S10: HP + CTA -------------------------------------------------------------------------------------------------
const HpK5: React.FC<{ T: WaktuK; W: number; H: number; hp: number }> = ({ T, W, H, hp }) => {
  const t = useDetik();
  const o = maju(hp, 0.55, 0.95, EASE.linear);
  if (o <= 0) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, background: '#08080a' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - maju(t, T.pulang - 0.15, T.pulang + 0.1) }}>
        <CtaKD x={W / 2} y={H / 2 + 40} simpan={T.simpan + 0.15} follow={T.follow} logo={T.follow + 0.45} keluar={T.pulang + 0.2} skala={1.08} />
      </div>
    </div>
  );
};

// sumber kecil di bawah monitor --------------------------------------------------------------------------------------
const SumberMonitor: React.FC<{ T: WaktuK; selam: number; hp: number }> = ({ T, selam, hp }) => {
  const t = useDetik();
  const S = T.s;
  const teks =
    t < S[1].mulai
      ? 'Sumber: Walter Murch, Web of Stories · ilustrasi'
      : t < S[2].mulai
        ? 'Sumber: Radiolab “Blink” (2009) · Web of Stories'
        : t < S[6].mulai
          ? 'Sumber: Walter Murch, Web of Stories · ilustrasi'
          : t < S[8].mulai
            ? 'Sumber: Nakano dkk., Proc. R. Soc. B 2009'
            : 'Sumber: Walter Murch, Web of Stories · ilustrasi';
  const o = maju(t, 1.2, 1.5) * (1 - Math.min(1, selam * 4)) * (1 - hp) * (1 - maju(t, T.keHp - 0.3, T.keHp));
  return <SumberKD x={MON.x + 4} y={MON.y + MON.h + 10} teks={teks} o={o} />;
};

// ======================================================================================================
const HudK5: React.FC<{ T: WaktuK }> = ({ T }) => {
  const S = T.s;
  return (
    <>
      <JudulKD
        label={['EDITOR', 'PERAIH', 'OSCAR', 'WALTER', 'MURCH']}
        lMulai={0.15}
        judul={[{ t: 'POTONGAN', mulai: 0.28 }, { t: '≈', mulai: 0.36, isi: <KiraInline /> }, { t: 'KEDIPAN', mulai: 0.44, isi: sorot('KEDIPAN', T.kedip1) }, { t: 'AKTOR', mulai: 0.52 }]}
        jMulai={0.28}
        keluar={S[1].mulai - 0.2}
      />
      <JudulKD
        label={['WAKTU', 'NGEDIT']}
        lMulai={S[1].mulai}
        judul={[{ t: 'THE', mulai: T.conversation - 0.1 }, { t: 'CONVERSATION', mulai: T.conversation }]}
        jMulai={T.conversation - 0.1}
        keluar={S[2].mulai - 0.2}
        catatan="awal 1970-an"
        cMulai={T.n1970}
      />
      <JudulKD
        label={['TITIK', 'POTONG', 'PAKAI', 'FEELING']}
        lMulai={S[2].mulai}
        judul={[{ t: 'BEBERAPA', mulai: T.jaraknya }, { t: 'FRAME', mulai: T.frame3 - 0.1, isi: sorot('FRAME', T.frame3 + 0.1) }, { t: 'DARI', mulai: T.kedipan3 - 0.15 }, { t: 'KEDIPAN', mulai: T.kedipan3 }]}
        jMulai={T.jaraknya}
        keluar={S[3].mulai - 0.2}
        catatan="kedipan Gene Hackman, aktornya (gambar: ilustrasi)"
        cMulai={T.gene}
      />
      <JudulKD
        label={['KATA', 'JOHN', 'HUSTON,', 'SUTRADARA']}
        lMulai={S[3].mulai}
        judul={[{ t: 'KEDIPAN', mulai: T.kedipan4 }, { t: 'DI', mulai: T.kedipan4 + 0.3 }, { t: 'ANTARA', mulai: T.kedipan4 + 0.45 }, { t: '2', mulai: T.dua, isi: sorot('2', T.fokus) }, { t: 'FOKUS', mulai: T.fokus }]}
        jMulai={T.kedipan4}
        keluar={S[4].mulai - 0.2}
      />
      <JudulKD
        label={['TEORI', 'MURCH']}
        lMulai={S[4].mulai}
        judul={[
          { t: 'PIKIRAN', mulai: T.teori + 0.2 },
          { t: '→', mulai: T.kedip5 - 0.1, isi: <PanahInline /> },
          { t: 'KEDIP', mulai: T.kedip5, isi: sorot('KEDIP', T.kedip5 + 0.15) },
          { t: '→2', mulai: T.pindah - 0.1, isi: <PanahInline /> },
          { t: 'PIKIRAN', mulai: T.pindah },
          { t: 'BARU', mulai: T.pindah + 0.15 },
        ]}
        jMulai={T.teori + 0.2}
        keluar={S[5].mulai - 0.2}
        ukuran={104}
      />
      <JudulKD
        label={['JADI', 'BUAT', 'MURCH']}
        lMulai={S[5].mulai}
        judul={[{ t: 'POTONGAN', mulai: T.potongan6 }, { t: '=', mulai: T.kedipan6 - 0.15, warna: KD.amber }, { t: 'KEDIPAN', mulai: T.kedipan6, isi: sorot('KEDIPAN', T.kedipan6 + 0.15) }, { t: 'PENONTON', mulai: T.penonton }]}
        jMulai={T.potongan6}
        keluar={S[6].mulai - 0.2}
        ukuran={110}
      />
      <JudulKD
        label={['RISET', 'JEPANG', '2009']}
        lMulai={S[6].mulai}
        judul={[{ t: '14', mulai: T.n14, isi: sorot('14', T.n14 + 0.3) }, { t: 'ORANG', mulai: T.n14 + 0.15 }, { t: '·', mulai: T.mr - 0.1, warna: KD.abu }, { t: 'MR.', mulai: T.mr }, { t: 'BEAN', mulai: T.mr + 0.15 }]}
        jMulai={T.n14}
        keluar={S[7].mulai - 0.2}
        catatan="nonton tanpa suara, kedipannya direkam"
        cMulai={T.tanpa}
      />
      <JudulKD
        label={['HASILNYA']}
        lMulai={S[7].mulai}
        judul={[{ t: 'KEDIP', mulai: T.barengan - 0.15 }, { t: 'BARENGAN', mulai: T.barengan, isi: sorot('BARENGAN', T.barengan + 0.3) }]}
        jMulai={T.barengan - 0.15}
        keluar={S[8].mulai - 0.2}
        catatan="di bagian yang gak butuh banyak perhatian"
        cMulai={T.gak8}
      />
      <JudulKD
        label={['MURCH', 'NGINGETIN']}
        lMulai={S[8].mulai}
        judul={[{ t: 'JANGAN', mulai: T.jangan, warna: KD.koral }, { t: 'MOTONG', mulai: T.jangan + 0.3 }, { t: 'PAS', mulai: T.kedip9 - 0.3 }, { t: 'KEDIP', mulai: T.kedip9 }]}
        jMulai={T.jangan}
        keluar={S[9].mulai - 0.2}
        catatan="rasanya kayak mata kelilipan"
        cMulai={T.kelilipan - 0.2}
      />
      <JudulKD
        label={['SIMPAN', 'BUAT', 'PATOKAN', 'NGEDIT']}
        lMulai={S[9].mulai}
        judul={[{ t: 'SIMPAN', mulai: T.simpan + 0.1 }, { t: '·', mulai: T.follow - 0.1, warna: KD.abu }, { t: 'FOLLOW', mulai: T.follow, isi: sorot('FOLLOW', T.follow + 0.15) }]}
        jMulai={T.simpan + 0.1}
        keluar={T.pulang - 0.15}
      />
    </>
  );
};

// ======================================================================================================
function daftarSfx(T: WaktuK) {
  const S = T.s;
  // klik halus tiap potongan yang lewat playhead (S1–S2), dari jadwal frame
  const potongSfx = DATA.potong.filter((c) => c / 24 < S[2].mulai + 0.2 && c / 24 > 0.2).map((c) => bunyi('klik', c / 24, 0.16));
  return [
    bunyi('whooshPop', 0.15, 0.3),
    ...potongSfx,
    bunyi('swish', T.walter - 0.1, 0.25),
    bunyi('whooshA', S[1].mulai - 0.05, 0.3),
    bunyi('jepret', T.n1970, 0.55),
    bunyi('hantam', T.n1970 + 0.02, 0.35),
    bunyi('whooshTurun', T.selamMasuk + 0.1, 0.35),
    ...F3.map((_, i) => bunyi('klik', T.titik + 0.15 + i * 0.32, 0.4)),
    ...F3.map((_, i) => bunyi('pop', T.jaraknya + i * 0.45, 0.25)),
    bunyi('whooshA', T.selamKeluar, 0.3),
    bunyi('swish', S[3].mulai + 0.05, 0.28),
    bunyi('whooshLembut', T.kedipan4 - 0.35, 0.28),
    bunyi('tik', T.dua - 0.12, 0.3),
    bunyi('pop', S[4].mulai + 0.1, 0.28),
    bunyi('tik', T.kedip5, 0.3),
    bunyi('pop', T.pindah - 0.1, 0.32),
    bunyi('whooshB', S[5].mulai - 0.1, 0.28),
    bunyi('whooshTurun', T.kedipan6 - 0.05, 0.25),
    bunyi('whooshTurun', T.nutup - 0.05, 0.3),
    bunyi('whooshTerang', T.buka, 0.3),
    bunyi('whooshA', S[6].mulai - 0.1, 0.3),
    bunyi('jepret', T.th2009, 0.55),
    bunyi('hantam', T.th2009 + 0.02, 0.35),
    ...Array.from({ length: 14 }, (_, i) => bunyi('tik', T.n14 - 0.5 + (i + 1) * (0.65 / 14), 0.12)),
    bunyi('kunci', T.barengan + 0.05, 0.4),
    bunyi('pop', T.aksi, 0.3),
    bunyi('swish', S[8].mulai, 0.28),
    bunyi('klik', T.jangan + 0.1, 0.4),
    bunyi('hantam', T.frame9 + 0.08, 0.4),
    bunyi('glitch', T.kelilipan - 0.1, 0.3),
    bunyi('whooshTerang', T.keHp + 0.1, 0.3),
    bunyi('whooshPop', T.simpan + 0.15, 0.3),
    bunyi('kunci', T.simpan + 0.47, 0.4),
    bunyi('klik', T.follow + 0.3, 0.45),
    bunyi('whooshLembut', T.pulang, 0.3),
  ];
}

// dipakai lint
void AngkaJalan;
