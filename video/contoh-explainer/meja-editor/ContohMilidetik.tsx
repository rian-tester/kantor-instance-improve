// Frame hero (pembuka, tengah, puncak): 15, 855, 1425.
// contoh video explainer K1 (akun generik, konten contoh): "Otak ngenalin gambar yang cuma muncul 13 milidetik". 9:16.
// SATU DUNIA = meja editor: MONITOR program (atas) + TIMELINE (lajur klip + penggaris frame 30 fps + playhead amber). Isi
// monitor = klip yang lagi di bawah playhead, jadi angka ms itu kejadian di timeline (lebar klip = lama tampil, 4 px/ms).
// Monitor diputar DIPERLAMBAT 10× (ditulis jujur di layar): 13 ms = 0,13 dtk tayang.
// Alur: aliran gambar 13 ms (hook) → kamera nyelam ke penggaris: klip 13 ms < 1 frame 30 fps (±33 ms, hitungan kami) → slate
// MIT 2014 ditepuk → urutan 6–12 gambar, lebar klip 13 → 80 ms → cari "piknik"/"pasangan senyum" → grafik di atas tebakan
// asal → mata loncat 3×/dtk → slate Melbourne 2016 → aliran 27 ms + penutup → gak ketemu ✗ → penggaris lagi: 100 ms = 3 frame
// ✓ → monitor jadi HP: frame pertama + thumbnail → CTA simpan + follow → balik jadi monitor (loop).
// Fakta: MIT News 16/01/2014; Potter dkk. 2014 (Atten Percept Psychophys); Maguire & Howe 2016. Foto: fal flux schnell.
import React, { useMemo } from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  AngkaJalan, Bunyi, Dunia, EASE, GarisDigambar, kata, maju, noise, pathPanah, pegas, Pop, Stempel, Subtitle, useDetik,
  type Kata, type KunciKamera,
} from "../../src/gerak";
import { ANTON, INTER, MONO } from "../../src/gerak/seri/meja-editor/font";
import {
  BlurGeser, bunyi, Centang, Chip, CtaKD, JudulKD, kameraKD, KD, klipDi, LatarKD, lerp, lerpKotak, PanahInline, pathKotak, PeneduhAtas,
  PlayheadKD, RangkaLayar, Silang, SlateKD, sorot, SumberKD, TeksturKD, TrackKD, type KlipKD, type Kotak,
} from "../../src/gerak/seri/meja-editor/seri";

export type Kalimat = { mulai: number; akhir: number; teks?: string };
export type DataK1 = { durasi: number; kata: Kata[]; kalimat?: Kalimat[] };

const MON: Kotak = { x: 90, y: 584, w: 900, h: 506, r: 20 };
const HP: Kotak = { x: 296, y: 540, w: 488, h: 866, r: 66 };
const PXMS = 4;
const X0 = 540;
const TY = 1214;
const TH = 84;
const LAMBAT = 10; // monitor diputar 10× lebih lambat

// ======================================================================================================
function waktuK1(d: Kata[], total: number, kal: Kalimat[] = []) {
  const CAD: [number, number][] = [
    [0.12, 4.26], [4.63, 9.67], [10.11, 14.38], [14.8, 20.91], [21.28, 25.79], [26.23, 30.98], [31.35, 35.73], [36.1, 43.05], [43.42, 47.98],
    [48.35, 53.54], [53.92, 58.17],
  ];
  const s = CAD.map((c, i) => ({ mulai: kal[i]?.mulai ?? c[0], akhir: kal[i]?.akhir ?? c[1] }));
  const k = (c: string, setelah = 0, cad = 0) => kata(d, c, setelah, cad);
  const n13 = k('13', s[0].mulai, 3.18);
  const frame2 = k('frame', s[1].mulai, 6.05);
  const n30 = k('30', frame2, 6.69);
  const fps = k('fps', n30, 7.26);
  const n33 = k('33', fps, 8.4);
  const potter3 = k('potter', s[2].mulai, 11.45);
  const mit = k('mit', potter3, 12.66);
  const th2014 = k('2014', mit, 13.64);
  const n6 = k('6', s[3].mulai, 15.81);
  const n12 = k('12', n6, 16.46);
  const berturut = k('berturut', n12, 17.16);
  const tiap4 = k('tiap', berturut, 18.06);
  const n13d = k('13', tiap4, 18.98);
  const n80 = k('80', n13d, 19.92);
  const nyari = k('nyari', s[4].mulai, 21.74);
  const piknik = k('piknik', nyari, 23.93);
  const pasangan = k('pasangan', piknik, 24.78);
  const n13f = k('13', s[5].mulai, 26.73);
  const jawaban = k('jawaban', n13f, 27.89);
  const sering = k('sering', jawaban, 29.16);
  const nebak = k('nebak', sering, 30.34);
  const potter7 = k('potter', s[6].mulai, 31.55);
  const otak = k('otak', potter7, 33.27);
  const mata = k('mata', otak, 34.15);
  const th2016 = k('2016', s[7].mulai, 36.49);
  const univ = k('university', th2016, 37.63);
  const melb = k('melbourne', univ, 38.29);
  const ketat = k('ketat', melb, 39.58);
  const n27 = k('27', ketat, 40.49);
  const gak = k('gak', n27, 42.55);
  const seper = k('sepersepuluh', s[8].mulai, 46.31);
  const dikenalin = k('dikenalin', seper, 47.48);
  const kreator = k('kreator', s[9].mulai, 48.55);
  const frame10 = k('frame', kreator, 49.9);
  const thumb10 = k('thumbnail', frame10, 50.69);
  const ketangkep = k('ketangkep', thumb10, 51.7);
  const sepersekian = k('sepersekian', ketangkep, 52.79);
  const simpan = k('simpan', s[10].mulai, 53.92);
  const follow = k('follow', simpan, 56.66);
  return {
    total, s, n13, frame2, n30, fps, n33, potter3, mit, th2014, n6, n12, berturut, tiap4, n13d, n80, nyari, piknik, pasangan, n13f, jawaban,
    sering, nebak, potter7, otak, mata, th2016, univ, melb, ketat, n27, gak, seper, dikenalin, kreator, frame10, thumb10, ketangkep,
    sepersekian, simpan, follow,
    // monitor → HP (S10) dan balik (loop)
    keHp: s[9].mulai,
    pulang: total - 1.05,
    loop: total - 0.3,
  };
}
type WaktuK = ReturnType<typeof waktuK1>;

// ======================================================================================================
// TIMELINE: daftar klip (ms) & posisi playhead per waktu
const URUT = ['anjing', 'pasar', 'dapur', 'pantai', 'pasangan', 'kucing', 'gunung', 'jalan'];
const foto = (n: string) => `k1/foto/${n}.svg`;
const H_PIKNIK = 23; // klip piknik di aliran hook (13 ms) → mulai 299 ms
const A0 = 620; // urutan 12 gambar (S4)
const C_PIKNIK = 14;
const C_PASANGAN = 24;
const D_PIKNIK = 6;

/** lebar klip urutan S4: 13 ms → 80 ms pas "80" */
const durA = (t: number, T: WaktuK) => lerp(13, 80, maju(t, T.n80 - 0.05, T.n80 + 0.65, EASE.kamera));

function daftarKlip(t: number, T: WaktuK) {
  const klip: KlipKD[] = [];
  // pra-gulung: 22 klip sebelum 0 biar lajur kiri gak kosong di frame awal (dan loop)
  for (let i = 22; i >= 1; i--) klip.push({ mulai: -i * 13, akhir: -(i - 1) * 13, src: foto(URUT[(i * 3) % URUT.length]) });
  // H: aliran hook 45 × 13 ms
  let u = 0;
  for (let i = 0; i < 45; i++) {
    const n = i === H_PIKNIK ? 'piknik' : URUT[u++ % URUT.length];
    klip.push({ mulai: i * 13, akhir: (i + 1) * 13, src: foto(n), id: i === H_PIKNIK ? 'hPiknik' : undefined });
  }
  // A: urutan 12 gambar
  const dA = durA(t, T);
  for (let i = 0; i < 12; i++) klip.push({ mulai: A0 + i * dA, akhir: A0 + (i + 1) * dA, src: foto(URUT[(i + 3) % URUT.length]), id: `a${i}` });
  // C: aliran cari (13 ms), piknik & pasangan di dalamnya
  const C0 = A0 + 12 * dA + 20;
  u = 2;
  for (let i = 0; i < 45; i++) {
    const n = i === C_PIKNIK ? 'piknik' : i === C_PASANGAN ? 'pasangan' : URUT.filter((x) => x !== 'pasangan')[u++ % 7];
    klip.push({ mulai: C0 + i * 13, akhir: C0 + (i + 1) * 13, src: foto(n), id: i === C_PIKNIK ? 'cPiknik' : i === C_PASANGAN ? 'cPasangan' : undefined });
  }
  // D: tes ulang 2016: penutup + 10 × 27 ms + penutup
  const D0 = C0 + 45 * 13 + 20;
  klip.push({ mulai: D0, akhir: D0 + 40, jenis: 'mask', id: 'dMask1' });
  u = 4;
  for (let i = 0; i < 10; i++) {
    const n = i === D_PIKNIK ? 'piknik' : URUT.filter((x) => x !== 'pasangan')[u++ % 7];
    klip.push({ mulai: D0 + 40 + i * 27, akhir: D0 + 40 + (i + 1) * 27, src: foto(n), id: i === D_PIKNIK ? 'dPiknik' : undefined });
  }
  klip.push({ mulai: D0 + 310, akhir: D0 + 350, jenis: 'mask', id: 'dMask2' });
  return { klip, dA, C0, D0 };
}

type KunciP = { t: number; P: number; ease?: (n: number) => number };
function posisiP(t: number, T: WaktuK, C0: number, D0: number, dA: number) {
  const S = T.s;
  const Hp = H_PIKNIK * 13 + 6.5; // tengah klip piknik hook
  const tA = Math.max(15.45, T.n6 - 0.4);
  const tC = T.piknik - 2.035; // tengah klip piknik lewat playhead pas kata "piknik"
  const tD = Math.max(S[7].mulai + 3.0, T.ketat - 0.25);
  const kunci: KunciP[] = [
    { t: 0, P: 0 },
    { t: 0.12, P: 0 },
    // hook: 100 ms timeline per detik (diperlambat 10×), mendarat di tengah klip piknik
    { t: 0.12 + (Hp - 6.5 - 6) / 100, P: Hp - 6.5 - 6, ease: EASE.linear },
    { t: 0.12 + (Hp - 6.5 - 6) / 100 + 0.32, P: Hp, ease: EASE.masuk },
    { t: S[2].akhir - 0.35, P: Hp },
    // scrub ke urutan A (ketutup slate)
    { t: S[2].akhir + 0.1, P: A0 },
    { t: tA, P: A0 },
    { t: tA + 1.5, P: A0 + 11.5 * 13, ease: EASE.linear },
  ];
  // abis urutan jalan: playhead nempel di tengah klip terakhir (ikut melebar 13 → 80 ms)
  const lepasA = tA + 1.5;
  const tengahA = A0 + 11.5 * dA;
  const kunci2: KunciP[] = [
    { t: T.nyari - 0.35, P: A0 + 11.5 * 80 },
    { t: tC - 0.05, P: C0, ease: EASE.kamera },
    { t: tC + 0.2, P: C0 },
    { t: tC + 0.2 + 3.15, P: C0 + 315, ease: EASE.linear },
    { t: tC + 0.2 + 3.15 + 0.3, P: C0 + C_PASANGAN * 13 + 6.5, ease: EASE.masuk },
    { t: tD - 0.9, P: C0 + C_PASANGAN * 13 + 6.5 },
    // scrub ke D (ketutup slate 2016)
    { t: tD - 0.45, P: D0 + 2, ease: EASE.kamera },
    { t: tD, P: D0 + 2 },
    { t: tD + 3.3, P: D0 + 332, ease: EASE.linear },
    { t: S[8].mulai - 0.05, P: D0 + 332 },
    // scrub balik ke piknik hook (monitor lagi nampilin hasil ✗)
    { t: S[8].mulai + 0.55, P: Hp, ease: EASE.kamera },
    { t: T.keHp + 0.6, P: Hp },
    // balik ke 0 (timeline lagi disembunyiin pas HP) buat loop
    { t: T.keHp + 1.4, P: 0, ease: EASE.kamera },
    { t: T.total + 1, P: 0 },
  ];
  if (t > lepasA && t < T.nyari - 0.35) return tengahA;
  const semua = t <= lepasA ? kunci : kunci2;
  if (t <= semua[0].t) return semua[0].P;
  for (let i = 1; i < semua.length; i++) {
    const b = semua[i];
    if (t <= b.t) {
      const a = semua[i - 1];
      const e = (b.ease ?? EASE.kamera)((t - a.t) / Math.max(1e-6, b.t - a.t));
      return a.P + (b.P - a.P) * e;
    }
  }
  return semua[semua.length - 1].P;
}

// ======================================================================================================
export const ContohMilidetik: React.FC<DataK1> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuK1(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const S = T.s;
  const { klip, dA, C0, D0 } = daftarKlip(t, T);
  const P = posisiP(t, T, C0, D0, dA);
  const Psebelum = posisiP(t - 1 / fps, T, C0, D0, durA(t - 1 / fps, T));
  const vPx = Math.abs(P - Psebelum) * fps * PXMS; // px/dtk lajur
  const blurTrack = Math.min(26, Math.max(0, (vPx - 2400) / 260));

  // kamera: rumah → nyelam ke penggaris (S2) → balik → nyelam lagi (S9) → rumah (HP & loop)
  const Z2 = { x: 620, y: 1192, z: 2.15 };
  const Z9 = { x: 714, y: 1196, z: 2.0 };
  const kunci: KunciKamera[] = [
    { t: 0, x: 540, y: 960, z: 1 },
    { t: S[1].mulai + 0.25, x: 540, y: 965, z: 1.035, ease: EASE.linear },
    { t: S[1].mulai + 1.45, ...Z2 },
    { t: S[2].mulai - 0.25, x: Z2.x + 20, y: Z2.y, z: Z2.z + 0.06, ease: EASE.linear },
    { t: S[2].mulai + 0.6, x: 540, y: 960, z: 1 },
    { t: S[3].mulai - 0.2, x: 540, y: 955, z: 1.03, ease: EASE.linear },
    { t: S[3].mulai + 0.4, x: 540, y: 960, z: 1 },
    { t: S[5].mulai - 0.1, x: 540, y: 962, z: 1.02, ease: EASE.linear },
    { t: S[5].mulai + 0.5, x: 540, y: 900, z: 1.07 },
    { t: S[6].mulai - 0.1, x: 540, y: 905, z: 1.09, ease: EASE.linear },
    { t: S[6].mulai + 0.5, x: 540, y: 880, z: 1.1 },
    { t: S[7].mulai - 0.15, x: 540, y: 876, z: 1.13, ease: EASE.linear },
    { t: S[7].mulai + 0.45, x: 540, y: 960, z: 1 },
    { t: S[8].mulai + 0.45, x: 540, y: 962, z: 1.02, ease: EASE.linear },
    { t: S[8].mulai + 1.5, ...Z9 },
    { t: T.keHp - 0.15, x: Z9.x - 18, y: Z9.y, z: Z9.z + 0.05, ease: EASE.linear },
    { t: T.keHp + 0.6, x: 540, y: 960, z: 1 },
    { t: T.simpan - 0.1, x: 540, y: 950, z: 1.03, ease: EASE.linear },
    { t: T.simpan + 0.5, x: 540, y: 960, z: 1 },
    { t: T.pulang, x: 540, y: 960, z: 1.01, ease: EASE.linear },
    { t: T.loop, x: 540, y: 960, z: 1 },
    { t: total + 1, x: 540, y: 960, z: 1 },
  ];
  const getar = [
    { t: T.th2014 + 0.02, kuat: 9 },
    { t: T.th2016 + 0.02, kuat: 9 },
    { t: T.gak + 0.12, kuat: 10 },
    { t: T.dikenalin + 0.2, kuat: 5 },
    { t: T.follow + 0.33, kuat: 5 },
  ];
  const kam = kameraKD(kunci, t, fps, total, getar);
  // seberapa "nyelam" ke penggaris (monitor diredupin + blur = kedalaman)
  const selam = Math.max(maju(t, S[1].mulai + 0.3, S[1].mulai + 1.3, EASE.kamera) * (1 - maju(t, S[2].mulai - 0.2, S[2].mulai + 0.5, EASE.kamera)),
    maju(t, S[8].mulai + 0.6, S[8].mulai + 1.4, EASE.kamera) * (1 - maju(t, T.keHp - 0.15, T.keHp + 0.5, EASE.kamera)));
  const hp = maju(t, T.keHp + 0.05, T.keHp + 0.75, EASE.kamera) * (1 - maju(t, T.pulang, T.loop - 0.05, EASE.kamera));
  const box = lerpKotak(MON, HP, hp);
  const oTrack = 1 - maju(t, T.keHp, T.keHp + 0.45, EASE.keluar) + maju(t, T.pulang + 0.1, T.loop - 0.1, EASE.masuk);
  const yTrack = (1 - Math.min(1, oTrack)) * 120;

  return (
    <AbsoluteFill style={{ background: KD.latar, color: KD.tulang, overflow: 'hidden', fontFamily: INTER }}>
      <LatarKD kam={kam} />
      <Dunia kamera={kam} tinggiDunia={1920} lebarDunia={1080} blurGerak={1400}>
        <RangkaLayar k={box} hp={hp} tag={tagMonitor(t, T)} timecode={hp < 0.5 ? `${Math.round(P)} ms` : undefined} redup={selam}>
          <IsiMonitor T={T} P={P} klip={klip} box={box} hp={hp} D0={D0} />
        </RangkaLayar>
        <SumberMonitor T={T} selam={selam} hp={hp} />
        <div style={{ position: 'absolute', left: 0, top: 0, translate: `0 ${yTrack.toFixed(1)}px` }}>
          <BlurGeser id="k1-track" kuat={blurTrack}>
            <TrackKD
              klip={klip}
              P={P}
              pxms={PXMS}
              x0={X0}
              y={TY}
              h={TH}
              asalGrid={H_PIKNIK * 13}
              asalLabel={H_PIKNIK * 13}
              labelGrid={Math.max(maju(t, T.fps, T.fps + 0.3) * (1 - maju(t, S[2].mulai - 0.3, S[2].mulai)), maju(t, S[8].mulai + 1.0, S[8].mulai + 1.3) * (1 - maju(t, T.keHp - 0.3, T.keHp)))}
              redup={(k) => (k.id === 'hPiknik' ? 1 : 1 - 0.72 * selam)}
              sorotKlip={sorotKlip(t, T)}
              o={Math.min(1, oTrack)}
            />
          </BlurGeser>
          <PlayheadKD x={X0} y={TY} h={TH} o={Math.min(1, oTrack)} />
        </div>
        <Penggaris T={T} />
      </Dunia>
      <PeneduhAtas kuat={Math.max(selam, 0.5)} />
      <HudK1 T={T} />
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
        zona={[{ dari: 0, x: 540, y: 1336, lebar: 960 }, { dari: S[5].mulai - 0.15, x: 540, y: 1406, lebar: 960 }, { dari: S[7].mulai + 0.05, x: 540, y: 1336, lebar: 960 }, { dari: T.keHp + 0.3, x: 540, y: 1436, lebar: 960 }, { dari: T.pulang, x: 540, y: 1336, lebar: 960 }]}
      />
      <TeksturKD />
      <></>
    </AbsoluteFill>
  );
};

function tagMonitor(t: number, T: WaktuK) {
  const S = T.s;
  const jalan = (t > 0.05 && t < S[0].akhir) || (t > S[3].mulai + 0.5 && t < S[4].akhir + 0.3) || (t > S[7].mulai + 2.9 && t < T.gak);
  return jalan ? `DIPERLAMBAT ${LAMBAT}×` : 'PROGRAM';
}

function sorotKlip(t: number, T: WaktuK): Record<string, string> {
  const r: Record<string, string> = {};
  if (t > T.n13 - 0.1 && t < T.s[3].mulai) r.hPiknik = KD.amber;
  if (t > T.s[8].mulai + 0.3) r.hPiknik = KD.amber;
  if (t > T.piknik - 0.05) r.cPiknik = KD.amber;
  if (t > T.pasangan + 0.5) r.cPasangan = KD.amber;
  if (t > T.ketat) {
    r.dMask1 = KD.koral;
    r.dMask2 = KD.koral;
  }
  return r;
}

// ======================================================================================================
// Isi monitor (koordinat dalam kotak; lebar/tinggi ngikut kotak yang lagi berubah jadi HP)
const IsiMonitor: React.FC<{ T: WaktuK; P: number; klip: KlipKD[]; box: Kotak; hp: number; D0: number }> = ({ T, P, klip, box, hp, D0 }) => {
  const t = useDetik();
  const S = T.s;
  const W = box.w - 6;
  const H = box.h - 6;
  const k = klipDi(klip, P);
  const kb = 1.05 + 0.03 * noise('kbm', t * 0.2);
  const pasar = t > S[6].mulai - 0.15 && t < S[7].mulai + 0.2;
  const src = pasar ? foto('pasar') : k?.src;
  const mask = !pasar && k?.jenis === 'mask';
  const oIsi = 1 - maju(t, T.keHp, T.keHp + 0.35) + maju(t, T.pulang + 0.15, T.loop - 0.15);
  return (
    <>
      {oIsi > 0 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, oIsi) }}>
          {mask ? (
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, #3b3a40 0 9px, #17161a 9px 18px)' }}>
              <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(-45deg, rgba(239,235,226,0.08) 0 4px, transparent 4px 13px)`, backgroundPosition: `${Math.floor(t * 30) * 7}px 0` }} />
            </div>
          ) : src ? (
            <Img src={staticFile(src)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', scale: String(pasar ? 1.02 + 0.05 * maju(t, S[6].mulai, S[7].mulai, EASE.linear) : kb) }} />
          ) : null}
        </div>
      ) : null}
      <SlateK1 T={T} W={W} H={H} />
      <CariK1 T={T} W={W} H={H} P={P} klip={klip} />
      <GrafikK1 T={T} W={W} H={H} />
      <MataK1 T={T} W={W} H={H} />
      <HasilK1 T={T} W={W} H={H} D0={D0} />
      <ChipMonitor T={T} W={W} H={H} />
      <HpK1 T={T} W={W} H={H} hp={hp} />
    </>
  );
};

// slate MIT 2014 & Melbourne 2016 (ditepuk pas tahunnya disebut) --------------------------------------------------------
const SlateK1: React.FC<{ T: WaktuK; W: number; H: number }> = ({ T, W, H }) => {
  const t = useDetik();
  const S = T.s;
  const gelap1 = maju(t, S[2].mulai - 0.05, S[2].mulai + 0.3) * (1 - maju(t, S[2].akhir + 0.05, S[2].akhir + 0.4));
  const gelap2 = maju(t, S[6].akhir + 0.05, S[6].akhir + 0.35) * (1 - maju(t, S[7].mulai + 2.6, S[7].mulai + 2.95));
  const g = Math.max(gelap1, gelap2);
  return (
    <>
      {g > 0 ? <div style={{ position: 'absolute', inset: 0, background: `rgba(14,13,16,${(0.9 * g).toFixed(3)})` }} /> : null}
      <SlateKD
        x={W / 2}
        y={H / 2 + 4}
        w={540}
        masuk={S[2].mulai + 0.1}
        tepuk={T.th2014}
        keluar={S[2].akhir - 0.05}
        baris={[
          { label: 'RISET', isi: 'Mary Potter dkk.', mulai: T.potter3 - 0.1 },
          { label: 'TEMPAT', isi: 'MIT', mulai: T.mit },
          { label: 'TAHUN', isi: '2014', mulai: T.th2014 - 0.05, warna: KD.amber },
        ]}
      />
      <SlateKD
        x={W / 2}
        y={H / 2 + 4}
        w={540}
        masuk={S[6].akhir + 0.08}
        tepuk={T.th2016}
        keluar={S[7].mulai + 2.55}
        baris={[
          { label: 'TES ULANG', isi: 'Maguire & Howe', mulai: S[6].akhir + 0.35 },
          { label: 'TEMPAT', isi: 'Univ. of Melbourne', mulai: T.univ },
          { label: 'TAHUN', isi: '2016', mulai: T.th2016 - 0.05, warna: KD.amber },
        ]}
      />
    </>
  );
};

// kotak cari (S5 & S8) + kartu yang "ketemu" ------------------------------------------------------------------------
const CariK1: React.FC<{ T: WaktuK; W: number; H: number; P: number; klip: KlipKD[] }> = ({ T, W, H, P, klip }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const o1 = maju(t, S[4].mulai, S[4].mulai + 0.25) * (1 - maju(t, S[4].akhir + 0.25, S[4].akhir + 0.45));
  const o2 = maju(t, S[7].mulai + 2.7, S[7].mulai + 2.95) * (1 - maju(t, T.gak - 0.05, T.gak + 0.15));
  const o = Math.max(o1, o2);
  if (o <= 0) return null;
  const teks1 = 'piknik';
  const teks2 = 'pasangan yang lagi senyum';
  let teks = '';
  if (o1 > 0) {
    const n1 = Math.floor(teks1.length * maju(t, T.nyari, T.nyari + 0.45, EASE.linear));
    const hapus = maju(t, T.pasangan - 0.25, T.pasangan, EASE.linear);
    const n2 = Math.floor(teks2.length * maju(t, T.pasangan, T.pasangan + 0.7, EASE.linear));
    teks = t < T.pasangan - 0.25 ? teks1.slice(0, n1) : t < T.pasangan ? teks1.slice(0, Math.ceil(teks1.length * (1 - hapus))) : teks2.slice(0, n2);
  } else teks = teks1.slice(0, Math.floor(teks1.length * maju(t, S[7].mulai + 2.85, S[7].mulai + 3.25, EASE.linear)));
  const kedip = Math.floor(t * 2.5) % 2 === 0;
  const ketik = o1 > 0 ? t < T.pasangan + 0.75 : t < S[7].mulai + 3.3;
  // hit: klip piknik/pasangan lagi di bawah playhead
  const sekarang = klipDi(klip, P);
  const hit = sekarang?.id === 'cPiknik' || sekarang?.id === 'cPasangan';
  const kartu = [
    { id: 'piknik', src: foto('piknik'), m: T.piknik + 0.02, x: 24 },
    { id: 'pasangan', src: foto('pasangan'), m: T.pasangan + 0.55, x: W - 24 - 220 },
  ];
  return (
    <>
      <div style={{ position: 'absolute', left: W / 2, top: 26, translate: '-50% 0', opacity: o, display: 'flex', alignItems: 'center', gap: 14, minWidth: 420, maxWidth: W - 60, padding: '10px 26px 12px 18px', borderRadius: 40, background: 'rgba(11,11,14,0.9)', border: `3px solid ${KD.amber}`, fontFamily: INTER, fontWeight: 700, fontSize: 32, color: KD.tulang, whiteSpace: 'nowrap' }}>
        <svg width={34} height={34} viewBox="0 0 34 34">
          <circle cx={14} cy={14} r={10} fill="none" stroke={KD.amber} strokeWidth={4} />
          <path d="M 22 22 L 31 31" stroke={KD.amber} strokeWidth={5} strokeLinecap="round" />
        </svg>
        <span style={{ color: KD.abu }}>cari:</span>
        <span>
          “{teks}
          {ketik && kedip ? <span style={{ color: KD.amber }}>|</span> : null}”
        </span>
      </div>
      {o1 > 0 && hit ? (
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
          <path d={pathKotak(10, 10, W - 20, H - 20, 14)} fill="none" stroke={KD.amber} strokeWidth={10} />
        </svg>
      ) : null}
      {o1 > 0
        ? kartu.map((c) => {
            if (t < c.m) return null;
            const p = pegas(t, c.m, fps, { damping: 12, stiffness: 190, mass: 0.6 });
            return (
              <div key={c.id} style={{ position: 'absolute', left: c.x, top: H - 24 - 124, width: 220, height: 124, borderRadius: 12, overflow: 'hidden', border: `4px solid ${KD.amber}`, scale: String(p), opacity: o1, boxShadow: '0 12px 30px rgba(0,0,0,0.6)' }}>
                <Img src={staticFile(c.src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', left: 8, bottom: 8, padding: '2px 10px', borderRadius: 8, background: KD.amber, color: KD.latar, fontFamily: INTER, fontWeight: 800, fontSize: 22 }}>KETEMU</div>
              </div>
            );
          })
        : null}
    </>
  );
};

// grafik S6: jawaban peserta (13 ms) vs tebakan asal (tanpa angka sumbu: sumber cuma bilang "di atas peluang") -----------
const GrafikK1: React.FC<{ T: WaktuK; W: number; H: number }> = ({ T, W, H }) => {
  const t = useDetik();
  const S = T.s;
  const o = maju(t, S[5].mulai - 0.15, S[5].mulai + 0.2) * (1 - maju(t, S[6].mulai - 0.2, S[6].mulai + 0.05));
  if (o <= 0) return null;
  const dasar = H - 92;
  const hAsal = 190;
  const hPeserta = 262;
  const xA = W * 0.27;
  const xP = W * 0.6;
  const bw = 170;
  const pP = maju(t, T.jawaban - 0.1, T.jawaban + 0.6, EASE.kamera);
  const pA = maju(t, T.nebak - 0.1, T.nebak + 0.45, EASE.kamera);
  const yGaris = dasar - hAsal;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,12,0.9)' }} />
      <Chip x={110} y={52} teks="13 ms" ukuran={30} o={maju(t, T.n13f - 0.05, T.n13f + 0.15)} />
      <div style={{ position: 'absolute', left: 40, top: dasar, width: W - 80, height: 3, background: 'rgba(239,235,226,0.35)' }} />
      {/* batang peserta */}
      <div style={{ position: 'absolute', left: xP - bw / 2, top: dasar - hPeserta * pP, width: bw, height: hPeserta * pP, borderRadius: '10px 10px 0 0', background: `linear-gradient(180deg, ${KD.amber}, ${KD.amberTua})` }} />
      {/* batang tebakan asal */}
      <div style={{ position: 'absolute', left: xA - bw / 2, top: dasar - hAsal * pA, width: bw, height: hAsal * pA, borderRadius: '10px 10px 0 0', background: 'repeating-linear-gradient(-45deg, #4a4741 0 10px, #3a3833 10px 20px)' }} />
      <div style={{ position: 'absolute', left: xP, top: dasar + 14, translate: '-50% 0', fontFamily: INTER, fontWeight: 800, fontSize: 30, color: KD.amber, opacity: pP }}>jawaban peserta</div>
      <div style={{ position: 'absolute', left: xA, top: dasar + 14, translate: '-50% 0', fontFamily: INTER, fontWeight: 800, fontSize: 30, color: KD.abu, opacity: pA }}>nebak asal</div>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        {/* garis tebakan asal ditarik nyebrang ke batang peserta */}
        <GarisDigambar d={`M ${xA - bw / 2 - 10} ${yGaris} H ${xP + bw / 2 + 60}`} mulai={T.nebak + 0.35} lama={0.35} warna={KD.tulang} tebal={4} />
        <GarisDigambar d={pathPanah(xP + bw / 2 + 40, yGaris - 6, xP + bw / 2 + 40, dasar - hPeserta + 8, 0, 18)} mulai={T.nebak + 0.7} lama={0.25} warna={KD.amber} tebal={6} />
      </svg>
      <div style={{ position: 'absolute', left: xP + bw / 2 + 64, top: dasar - hPeserta - 6, fontFamily: INTER, fontWeight: 800, fontSize: 28, lineHeight: 1.1, color: KD.amber, opacity: maju(t, T.sering - 0.05, T.sering + 0.2) }}>
        lebih sering
        <br />
        bener
      </div>
    </div>
  );
};

// S7: mata loncat 3× per detik di foto pasar -----------------------------------------------------------------------
const MataK1: React.FC<{ T: WaktuK; W: number; H: number }> = ({ T, W, H }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[6].mulai || t > S[7].mulai + 0.3) return null;
  const k = 1 - maju(t, S[6].akhir, S[6].akhir + 0.25);
  const titik = [
    { x: W * 0.36, y: H * 0.74 },
    { x: W * 0.62, y: H * 0.2 },
    { x: W * 0.43, y: H * 0.3 },
    { x: W * 0.8, y: H * 0.62 },
  ];
  const m0 = T.mata - 0.05;
  const jeda = 1 / 3;
  // posisi cincin: loncat cepat (0,07 dtk) tiap 1/3 dtk
  let pos = titik[0];
  let iAktif = 0;
  for (let i = 1; i < titik.length; i++) {
    const ti = m0 + i * jeda;
    const p = maju(t, ti, ti + 0.07, EASE.kamera);
    if (p > 0) {
      pos = { x: lerp(titik[i - 1].x, titik[i].x, p), y: lerp(titik[i - 1].y, titik[i].y, p) };
      iAktif = i;
    }
  }
  const oC = maju(t, m0 - 0.15, m0) * k;
  const s = pegas(t, m0 + iAktif * jeda + 0.07, fps, { damping: 9, stiffness: 260, mass: 0.5 });
  // ikon mata digambar (kiri atas)
  const ex = 120;
  const ey = 122;
  const kedip = t > T.otak + 0.6 && t < T.otak + 0.75 ? 0.15 : 1;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: k }}>
      <div style={{ position: 'absolute', left: 30, top: 70, width: 180, height: 104, borderRadius: 16, background: 'rgba(11,11,14,0.82)', opacity: maju(t, T.potter7, T.potter7 + 0.2) }} />
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <g transform={`translate(${ex} ${ey}) scale(1 ${kedip}) translate(${-ex} ${-ey})`}>
          <GarisDigambar d={`M ${ex - 62} ${ey} Q ${ex} ${ey - 50} ${ex + 62} ${ey} Q ${ex} ${ey + 50} ${ex - 62} ${ey} Z`} mulai={T.potter7} lama={0.3} warna={KD.tulang} tebal={6} />
          {t > T.potter7 + 0.25 ? <circle cx={ex + (pos.x - W / 2) * 0.02} cy={ey + (pos.y - H / 2) * 0.02} r={17} fill={KD.amber} /> : null}
        </g>
        {titik.slice(1).map((p, i) => (
          <GarisDigambar
            key={i}
            d={`M ${titik[i].x} ${titik[i].y} L ${p.x} ${p.y}`}
            mulai={m0 + (i + 1) * jeda - 0.02}
            lama={0.08}
            warna="rgba(255,180,84,0.75)"
            tebal={4}
          />
        ))}
      </svg>
      {oC > 0 ? (
        <div style={{ position: 'absolute', left: pos.x, top: pos.y, width: 104, height: 104, translate: '-50% -50%', borderRadius: '50%', border: `6px solid ${KD.amber}`, boxShadow: '0 0 0 4px rgba(11,11,14,0.55), 0 0 24px rgba(255,180,84,0.6)', opacity: oC, scale: String(0.8 + 0.2 * s) }} />
      ) : null}
      {titik.slice(0, iAktif).map((p, i) => (
        <div key={i} style={{ position: 'absolute', left: p.x, top: p.y, width: 18, height: 18, translate: '-50% -50%', borderRadius: '50%', background: KD.amber, opacity: 0.8 * k }} />
      ))}
    </div>
  );
};

// S8: hasil tes ulang — gak ketemu (✗ dibanting) ---------------------------------------------------------------------
const HasilK1: React.FC<{ T: WaktuK; W: number; H: number; D0: number }> = ({ T, W, H }) => {
  const t = useDetik();
  const S = T.s;
  const o = maju(t, T.gak - 0.05, T.gak + 0.12) * (1 - maju(t, S[8].mulai + 0.9, S[8].mulai + 1.2));
  if (o <= 0) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,12,0.82)' }} />
      <Silang x={W / 2 - 190} y={H / 2} s={120} mulai={T.gak} tebal={16} />
      <Stempel mulai={T.gak + 0.05} rot={-4} gaya={{ position: 'absolute', left: W / 2 - 100, top: H / 2 - 64, fontFamily: ANTON, fontSize: 108, lineHeight: 1, color: KD.koral, whiteSpace: 'nowrap' }}>
        GAK KETEMU
      </Stempel>
    </div>
  );
};

// chip di dalam monitor: lama tampil (S4, S8) & penutup ------------------------------------------------------------
const ChipMonitor: React.FC<{ T: WaktuK; W: number; H: number }> = ({ T, W, H }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  // hook: "13 ms" nempel pas piknik mendarat
  const o0 = maju(t, T.n13 - 0.05, T.n13 + 0.1) * (1 - maju(t, S[1].mulai - 0.1, S[1].mulai + 0.1));
  // S4: hitungan gambar 1..12 (diikat ke playhead yang lewat klip) lalu lama tampil 13 → 80 ms (diikat ke lebar klip)
  const oN = maju(t, T.n6 - 0.5, T.n6 - 0.3) * (1 - maju(t, S[4].mulai - 0.2, S[4].mulai));
  const tA = Math.max(15.45, T.n6 - 0.4);
  const nGambar = Math.min(12, Math.max(1, Math.floor((t - tA) / 0.13) + 1));
  const oD = maju(t, T.n13d - 0.1, T.n13d + 0.1) * (1 - maju(t, S[4].mulai - 0.2, S[4].mulai));
  const dA = durA(t, T);
  // S8: 27 ms + penutup
  const o27 = maju(t, T.n27 - 0.1, T.n27 + 0.1) * (1 - maju(t, T.gak - 0.1, T.gak));
  const oPen = maju(t, T.ketat - 0.15, T.ketat + 0.1) * (1 - maju(t, T.gak - 0.1, T.gak));
  return (
    <>
      {o0 > 0 ? <Chip x={W - 110} y={H - 52} teks="13 ms" ukuran={40} isi o={o0} skala={pegas(t, T.n13 - 0.05, fps, { damping: 10, stiffness: 200, mass: 0.6 })} /> : null}
      {oN > 0 ? (
        <div style={{ position: 'absolute', right: 24, top: 22, opacity: oN, padding: '6px 18px', borderRadius: 14, background: 'rgba(11,11,14,0.88)', border: `3px solid ${KD.amber}`, display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 26, color: KD.abu }}>gambar</span>
          <span style={{ fontFamily: ANTON, fontSize: 60, lineHeight: 1, color: KD.amber, fontVariantNumeric: 'tabular-nums', minWidth: '1.1em', textAlign: 'right' }}>{t < tA ? 1 : nGambar}</span>
          <span style={{ fontFamily: ANTON, fontSize: 40, color: KD.abu }}>/ 12</span>
        </div>
      ) : null}
      {oD > 0 ? (
        <div style={{ position: 'absolute', left: 24, bottom: 22, opacity: oD, padding: '6px 18px', borderRadius: 14, background: 'rgba(11,11,14,0.88)', border: `3px solid ${KD.amber}`, display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 26, color: KD.abu }}>tiap gambar</span>
          <AngkaJalan dari={13} ke={80} progress={(dA - 13) / 67} gaya={{ fontFamily: ANTON, fontSize: 60, lineHeight: 1, color: KD.amber, minWidth: '1.15em', display: 'inline-block', textAlign: 'right' }} />
          <span style={{ fontFamily: ANTON, fontSize: 40, color: KD.amber }}>ms</span>
        </div>
      ) : null}
      {o27 > 0 ? <Chip x={W - 140} y={H - 52} teks="tiap gambar 27 ms" ukuran={30} isi o={o27} /> : null}
      {oPen > 0 ? <Chip x={160} y={H - 52} teks="+ penutup" warna={KD.koral} ukuran={30} o={oPen} /> : null}
    </>
  );
};

// S10–S11: isi HP — video (frame pertama) → feed thumbnail → CTA ---------------------------------------------------
const KARTU = [
  { src: 'dapur', teks: '5 MENIT' },
  { src: 'pantai', teks: 'SEPI!' },
  { src: 'kucing', teks: 'TIDUR 16 JAM?' },
  { src: 'pasar', teks: 'MURAH' },
  { src: 'anjing', teks: 'LARI!' },
  { src: 'gunung', teks: 'SUBUH' },
];
const HpK1: React.FC<{ T: WaktuK; W: number; H: number; hp: number }> = ({ T, W, H, hp }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const o = maju(hp, 0.55, 0.95, EASE.linear);
  if (o <= 0) return null;
  const vid = 1 - maju(t, T.thumb10 - 0.35, T.thumb10 - 0.1);
  const feed = t > T.thumb10 - 0.36 && t < T.simpan ? 1 : 0;
  const cta = maju(t, T.simpan - 0.2, T.simpan + 0.05);
  // video Shorts: frame pertama dikotak
  const ox = 22;
  const kw = (W - ox * 2 - 16) / 2;
  const kh = kw * 1.42;
  const gulir = 140 - 150 * maju(t, T.thumb10 - 0.3, T.sepersekian + 0.6, EASE.kamera);
  const target = { x: ox, y: 70 + gulir };
  const sudut = (x: number, y: number, w: number, h: number, m: number, l = 46) => (
    <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
      {[
        `M ${x} ${y + l} V ${y} H ${x + l}`,
        `M ${x + w - l} ${y} H ${x + w} V ${y + l}`,
        `M ${x + w} ${y + h - l} V ${y + h} H ${x + w - l}`,
        `M ${x + l} ${y + h} H ${x} V ${y + h - l}`,
      ].map((d, i) => (
        <GarisDigambar key={i} d={d} mulai={m + i * 0.04} lama={0.16} warna={KD.amber} tebal={9} ujung="square" />
      ))}
    </svg>
  );
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, background: '#08080a' }}>
      {vid > 0 ? (
        <div style={{ position: 'absolute', inset: 0, translate: `0 ${(-(1 - vid) * H).toFixed(1)}px` }}>
          <Img src={staticFile(foto('dapur'))} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '62% 50%', scale: String(1.05 + 0.04 * maju(t, T.keHp, T.thumb10, EASE.linear)) }} />
          <div style={{ position: 'absolute', left: 24, right: 24, bottom: 30, height: 6, borderRadius: 3, background: 'rgba(239,235,226,0.3)' }}>
            <div style={{ width: `${(100 * maju(t, T.frame10 - 0.1, T.thumb10 + 0.5, EASE.linear) * 0.12).toFixed(2)}%`, height: 6, borderRadius: 3, background: KD.amber }} />
          </div>
          {sudut(20, 60, W - 40, H - 120, T.frame10 - 0.05)}
          <Pop mulai={T.frame10 + 0.1} gaya={{ position: 'absolute', left: W / 2 - 108, top: H / 2 - 36 }}>
            <div style={{ padding: '8px 22px', borderRadius: 14, background: KD.amber, color: KD.latar, fontFamily: ANTON, fontSize: 52, lineHeight: 1 }}>FRAME 1</div>
          </Pop>
        </div>
      ) : null}
      {feed > 0 ? (
        <div style={{ position: 'absolute', inset: 0, translate: `0 ${((1 - maju(t, T.thumb10 - 0.35, T.thumb10 - 0.1)) * H).toFixed(1)}px`, opacity: 1 - maju(t, T.simpan - 0.25, T.simpan) }}>
          {KARTU.map((c, i) => {
            const x = ox + (i % 2) * (kw + 16);
            const y = 70 + Math.floor(i / 2) * (kh + 16) + gulir;
            return (
              <div key={i} style={{ position: 'absolute', left: x, top: y, width: kw, height: kh, borderRadius: 14, overflow: 'hidden', background: '#1b1a1f' }}>
                <Img src={staticFile(foto(c.src))} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', left: 10, right: 10, bottom: 10, fontFamily: ANTON, fontSize: 30, lineHeight: 1.0, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>{c.teks}</div>
              </div>
            );
          })}
          {sudut(target.x - 6, target.y - 6, kw + 12, kh + 12, T.thumb10)}
          <Pop mulai={T.thumb10 + 0.15} gaya={{ position: 'absolute', left: target.x + kw / 2 - 98, top: target.y + kh + 4 }}>
            <div style={{ padding: '6px 16px', borderRadius: 12, background: KD.amber, color: KD.latar, fontFamily: ANTON, fontSize: 40, lineHeight: 1 }}>THUMBNAIL</div>
          </Pop>
          {/* mata nangkep: cincin nyamber ke kartu + stopwatch < 1 detik */}
          {t > T.ketangkep - 0.1 ? (
            <div style={{ position: 'absolute', left: target.x + kw / 2, top: target.y + kh / 2, width: 120, height: 120, translate: '-50% -50%', borderRadius: '50%', border: `6px solid ${KD.amber}`, boxShadow: '0 0 0 4px rgba(11,11,14,0.5)', scale: String(lerp(2.4, 1, pegas(t, T.ketangkep - 0.1, fps, { damping: 14, stiffness: 220 }))), opacity: maju(t, T.ketangkep - 0.1, T.ketangkep) }} />
          ) : null}
          <Pop mulai={T.sepersekian - 0.05} gaya={{ position: 'absolute', left: W / 2 - 150, top: H - 150 }}>
            <div style={{ width: 300, padding: '10px 0', borderRadius: 16, textAlign: 'center', background: 'rgba(11,11,14,0.92)', border: `4px solid ${KD.amber}`, fontFamily: ANTON, fontSize: 52, lineHeight: 1, color: KD.amber }}>{'< 1 DETIK'}</div>
          </Pop>
        </div>
      ) : null}
      {cta > 0 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: cta * (1 - maju(t, T.pulang - 0.15, T.pulang + 0.1)) }}>
          <CtaKD x={W / 2} y={H / 2 + 40} simpan={T.simpan} follow={T.follow} logo={T.follow + 0.45} keluar={T.pulang + 0.2} skala={1.08} />
        </div>
      ) : null}
    </div>
  );
};

// ======================================================================================================
// Penggaris di dunia (S2 & S9): klip 13 ms vs 1 frame (±33 ms), lalu 100 ms = 3 frame. Semua x dari ms → px (4 px/ms).
const Penggaris: React.FC<{ T: WaktuK }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const a = H_PIKNIK * 13; // 299 ms = 0 di penggaris
  const Hp = a + 6.5;
  const x = (ms: number) => X0 + (a + ms - Hp) * PXMS;
  const yAtas = 1100;
  const yBawah = TY + TH + 14;
  // S2
  const o2 = maju(t, S[1].mulai + 0.2, S[1].mulai + 0.5) * (1 - maju(t, S[2].mulai - 0.35, S[2].mulai - 0.1));
  const p13 = maju(t, S[1].mulai + 0.55, S[1].mulai + 1.35, EASE.kamera);
  const p33 = maju(t, T.n33 - 0.1, T.n33 + 0.5, EASE.kamera);
  // S9
  const o9 = maju(t, S[8].mulai + 1.0, S[8].mulai + 1.3) * (1 - maju(t, T.keHp - 0.3, T.keHp - 0.05));
  const p100 = maju(t, T.seper - 0.1, T.seper + 0.9, EASE.kamera);
  const o = Math.max(o2, o9);
  if (o <= 0) return null;
  const s2 = o2 > 0;
  const lab = (teks: React.ReactNode, xx: number, yy: number, warna: string, op: number, ukuran = 21, rata: 'kiri' | 'tengah' = 'kiri') =>
    op <= 0 ? null : (
      <div style={{ position: 'absolute', left: xx, top: yy, translate: rata === 'tengah' ? '-50% 0' : undefined, fontFamily: INTER, fontWeight: 800, fontSize: ukuran, color: warna, opacity: op, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
        {teks}
      </div>
    );
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      {/* isi frame (gold) yang ngisi 0 → 33 ms (S2) atau 0 → 100 ms (S9) di atas lajur */}
      <div style={{ position: 'absolute', left: x(0), top: TY - 6, width: (s2 ? 33.33 * p33 : 100 * p100) * PXMS, height: TH + 12, borderRadius: 6, background: 'rgba(199,159,85,0.22)', border: (s2 ? p33 : p100) > 0.02 ? `2px solid ${KD.emas}` : undefined }} />
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        {/* bracket bawah 13 ms (amber) */}
        {s2 || t > S[8].mulai + 1.4 ? <path d={`M ${x(0)} ${yBawah} V ${yBawah + 12} H ${x(13 * (s2 ? p13 : 1))} V ${yBawah}`} fill="none" stroke={KD.amber} strokeWidth={4} /> : null}
        {/* S2: bracket atas 1 frame */}
        {s2 ? <GarisDigambar d={`M ${x(0)} ${yAtas + 14} V ${yAtas} H ${x(33.33)} V ${yAtas + 14}`} mulai={T.frame2 - 0.05} lama={0.4} warna={KD.tulang} tebal={4} /> : null}
        {/* S9: bracket atas 100 ms */}
        {!s2 ? <GarisDigambar d={`M ${x(0)} ${yAtas + 14} V ${yAtas} H ${x(100)} V ${yAtas + 14}`} mulai={T.seper - 0.1} lama={0.9} warna={KD.tulang} tebal={4} /> : null}
        {/* S9: penanda 27 ms (koral) */}
        {!s2 && t > S[8].mulai + 1.6 ? <path d={`M ${x(27)} ${TY - 10} V ${yBawah + 48}`} stroke={KD.koral} strokeWidth={3} strokeDasharray="6 5" /> : null}
      </svg>
      {s2 ? (
        <>
          {lab(<><AngkaJalan dari={0} ke={13} progress={p13} /> ms</>, x(0), yBawah + 18, KD.amber, maju(t, S[1].mulai + 0.5, S[1].mulai + 0.7), 22)}
          {lab('1 frame', x(0), yAtas - 34, KD.tulang, maju(t, T.frame2 + 0.1, T.frame2 + 0.3), 21)}
          {lab(<><span style={{ color: KD.abu }}>30 fps</span></>, x(33.33) + 8, yAtas - 34, KD.abu, maju(t, T.n30, T.n30 + 0.2), 18)}
          {lab(<>±<AngkaJalan dari={0} ke={33} progress={p33} /> ms</>, x(33.33) + 8, yAtas - 6, KD.emas, maju(t, T.n33 - 0.05, T.n33 + 0.1), 21)}
        </>
      ) : (
        <>
          {lab('13 ms · 2014', x(0), yBawah + 18, KD.amber, maju(t, S[8].mulai + 1.4, S[8].mulai + 1.6), 17)}
          {lab(<>27 ms ✗ · 2016</>, x(27) + 6, yBawah + 38, KD.koral, maju(t, S[8].mulai + 1.6, S[8].mulai + 1.8), 17)}
          {lab(<><AngkaJalan dari={0} ke={100} progress={p100} /> ms<span style={{ color: KD.abu, opacity: maju(t, T.seper + 0.9, T.seper + 1.1) }}> = 3 frame</span></>, x(50), yAtas - 38, KD.tulang, maju(t, T.seper - 0.1, T.seper + 0.05), 24, 'tengah')}
        </>
      )}
      {!s2 ? <Centang x={x(100) - 6} y={yAtas - 62} s={34} mulai={T.dikenalin - 0.05} tebal={7} /> : null}
    </div>
  );
};

// sumber kecil di pojok kiri bawah monitor ------------------------------------------------------------------------
const SumberMonitor: React.FC<{ T: WaktuK; selam: number; hp: number }> = ({ T, selam, hp }) => {
  const t = useDetik();
  const S = T.s;
  const teks =
    t < S[2].mulai - 0.2
      ? 'Sumber: MIT News, 16/01/2014'
      : t < S[7].mulai
        ? 'Sumber: MIT News 2014 · Potter dkk. 2014'
        : t < S[8].mulai
          ? 'Sumber: Maguire & Howe 2016'
          : 'Sumber: MIT News 2014';
  const o = maju(t, 1.2, 1.5) * (1 - Math.min(1, selam * 4)) * (1 - hp) * (1 - maju(t, T.keHp - 0.3, T.keHp));
  return <SumberKD x={MON.x + 4} y={MON.y + MON.h + 10} teks={teks} o={o} />;
};

// ======================================================================================================
const HudK1: React.FC<{ T: WaktuK }> = ({ T }) => {
  const S = T.s;
  return (
    <>
      <JudulKD
        label={['OTAK', 'NGENALIN', 'GAMBAR', 'YANG', 'TAMPIL']}
        lMulai={0.15}
        judul={[{ t: '13', mulai: 0.28, isi: sorot('13', T.n13) }, { t: 'MILIDETIK', mulai: 0.4 }]}
        jMulai={0.28}
        keluar={S[1].mulai - 0.2}
        catatan="di monitor: diperlambat 10×"
        cMulai={1.0}
      />
      <JudulKD
        label={['LEBIH', 'SINGKAT', 'DARI']}
        lMulai={S[1].mulai}
        judul={[{ t: '1', mulai: T.frame2 - 0.1 }, { t: 'FRAME', mulai: T.frame2 }, { t: '±33', mulai: T.n33, isi: sorot('±33', T.n33 + 0.6) }, { t: 'MS', mulai: T.n33 + 0.1 }]}
        jMulai={T.frame2 - 0.1}
        keluar={S[2].mulai - 0.2}
        catatan="video 30 fps · hitungan kami: 1.000 ÷ 30 = 33,3 ms"
        cMulai={T.fps}
      />
      <JudulKD
        label={['ANGKA', 'INI', 'DARI', 'RISET']}
        lMulai={S[2].mulai}
        judul={[{ t: 'MIT', mulai: T.mit }, { t: '·', mulai: T.th2014 - 0.1, warna: KD.abu }, { t: '2014', mulai: T.th2014, isi: sorot('2014', T.th2014 + 0.1) }]}
        jMulai={T.mit}
        keluar={S[3].mulai - 0.2}
      />
      <JudulKD
        label={['PESERTA', 'NONTON']}
        lMulai={S[3].mulai}
        judul={[{ t: '6–12', mulai: T.n6, isi: sorot('6–12', T.n12) }, { t: 'GAMBAR', mulai: T.n12 }]}
        jMulai={T.n6}
        keluar={T.tiap4 - 0.25}
        catatan="berturut-turut"
        cMulai={T.berturut}
      />
      <JudulKD
        label={['TIAP', 'GAMBAR', 'CUMA']}
        lMulai={T.tiap4}
        judul={[{ t: '13–80', mulai: T.n13d, isi: sorot('13–80', T.n80 + 0.3) }, { t: 'MS', mulai: T.n13d + 0.1 }]}
        jMulai={T.n13d}
        keluar={S[4].mulai - 0.2}
      />
      <JudulKD
        label={['TUGASNYA']}
        lMulai={S[4].mulai}
        judul={[{ t: 'CARI', mulai: T.nyari }, { t: '“PIKNIK”', mulai: T.piknik - 0.1, isi: sorot('“PIKNIK”', T.piknik + 0.05) }]}
        jMulai={T.nyari}
        keluar={S[5].mulai - 0.2}
        catatan="atau “pasangan yang lagi senyum”"
        cMulai={T.pasangan}
      />
      <JudulKD
        label={['BAHKAN', 'DI', '13', 'MS,', 'JAWABANNYA']}
        lMulai={S[5].mulai}
        judul={[{ t: 'DI', mulai: T.sering - 0.1 }, { t: 'ATAS', mulai: T.sering }, { t: 'TEBAKAN', mulai: T.nebak - 0.05 }, { t: 'ASAL', mulai: T.nebak + 0.1 }]}
        jMulai={T.sering - 0.1}
        keluar={S[6].mulai - 0.2}
      />
      <JudulKD
        label={['KATA', 'POTTER']}
        lMulai={S[6].mulai}
        judul={[{ t: 'OTAK', mulai: T.otak }, { t: '→', mulai: T.otak + 0.25, isi: <PanahInline /> }, { t: 'ARAH', mulai: T.mata - 0.1 }, { t: 'MATA', mulai: T.mata, isi: sorot('MATA', T.mata + 0.15) }]}
        jMulai={T.otak}
        keluar={S[7].mulai - 0.2}
        catatan="mata pindah fokus ±3× per detik"
        cMulai={T.mata + 0.3}
      />
      <JudulKD
        label={['DITES', 'ULANG', '2016', '·', 'LEBIH', 'KETAT']}
        lMulai={S[7].mulai}
        judul={[{ t: '27', mulai: T.n27 }, { t: 'MS:', mulai: T.n27 + 0.1 }, { t: 'GAK', mulai: T.gak, warna: KD.koral }, { t: 'KETEMU', mulai: T.gak + 0.1, warna: KD.koral }]}
        jMulai={T.n27}
        keluar={S[8].mulai - 0.2}
        catatan="University of Melbourne · penutup gambar lebih ketat"
        cMulai={T.melb}
      />
      <JudulKD
        label={['RISET', 'POTTER', 'SEBELUMNYA']}
        lMulai={S[8].mulai}
        judul={[{ t: '100', mulai: T.seper, isi: sorot('100', T.seper + 0.9) }, { t: 'MS', mulai: T.seper + 0.1 }, { t: '=', mulai: T.dikenalin - 0.2, warna: KD.abu }, { t: 'KEBACA', mulai: T.dikenalin }]}
        jMulai={T.seper}
        keluar={T.keHp - 0.2}
        catatan="sepersepuluh detik = 3 frame (hitungan kami)"
        cMulai={T.seper + 0.9}
      />
      <JudulKD
        label={['BUAT', 'KREATOR']}
        lMulai={S[9].mulai}
        judul={[{ t: 'FRAME', mulai: T.frame10 }, { t: 'PERTAMA', mulai: T.frame10 + 0.15, isi: sorot('PERTAMA', T.frame10 + 0.3) }, { t: '+', mulai: T.thumb10 - 0.1, warna: KD.abu }, { t: 'THUMBNAIL', mulai: T.thumb10, isi: sorot('THUMBNAIL', T.thumb10 + 0.2) }]}
        jMulai={T.frame10}
        keluar={S[10].mulai - 0.2}
        ukuran={104}
      />
      <JudulKD
        label={['SIMPAN', 'BUAT', 'BAHAN', 'THUMBNAIL']}
        lMulai={S[10].mulai}
        judul={[{ t: 'SIMPAN', mulai: T.simpan + 0.05 }, { t: '·', mulai: T.follow - 0.1, warna: KD.abu }, { t: 'FOLLOW', mulai: T.follow, isi: sorot('FOLLOW', T.follow + 0.15) }]}
        jMulai={T.simpan + 0.05}
        keluar={T.pulang - 0.15}
      />
    </>
  );
};

// ======================================================================================================
function daftarSfx(T: WaktuK) {
  const S = T.s;
  const tA = Math.max(15.45, T.n6 - 0.4);
  // tik halus tiap gambar ganti (cuma beberapa, biar gak bising)
  const tikHook = Array.from({ length: 8 }, (_, i) => bunyi('tik', 0.2 + i * 0.36, 0.12));
  const tikA = Array.from({ length: 12 }, (_, i) => bunyi('tik', tA + i * 0.13, 0.14));
  const tikC = Array.from({ length: 10 }, (_, i) => bunyi('tik', T.nyari + 0.5 + i * 0.32, 0.1));
  const tikD = Array.from({ length: 10 }, (_, i) => bunyi('tik', S[7].mulai + 3.3 + i * 0.27, 0.12));
  return [
    bunyi('whooshPop', 0.15, 0.3),
    ...tikHook,
    bunyi('kunci', T.n13, 0.4),
    bunyi('whooshTurun', S[1].mulai + 0.35, 0.35),
    bunyi('swish', T.frame2, 0.28),
    bunyi('pop', T.n30, 0.25),
    bunyi('riser', T.n33 + 0.6, 0.18),
    bunyi('whooshA', S[2].mulai - 0.1, 0.32),
    bunyi('swish', S[2].mulai + 0.3, 0.25),
    bunyi('jepret', T.th2014, 0.55),
    bunyi('hantam', T.th2014 + 0.02, 0.35),
    bunyi('whooshB', S[2].akhir, 0.3),
    ...tikA,
    bunyi('pop', T.n12, 0.3),
    bunyi('swish', T.n80, 0.3),
    bunyi('klik', T.nyari, 0.25),
    bunyi('klik', T.nyari + 0.2, 0.2),
    ...tikC,
    bunyi('kunci', T.piknik + 0.03, 0.4),
    bunyi('kunci', T.pasangan + 0.55, 0.35),
    bunyi('whooshLembut', S[5].mulai - 0.1, 0.3),
    bunyi('pop', T.jawaban + 0.3, 0.25),
    bunyi('swish', T.nebak + 0.35, 0.25),
    bunyi('whooshA', S[6].mulai - 0.1, 0.3),
    bunyi('tik', T.mata + 0.28, 0.3),
    bunyi('tik', T.mata + 0.61, 0.3),
    bunyi('tik', T.mata + 0.94, 0.3),
    bunyi('swish', S[6].akhir + 0.1, 0.28),
    bunyi('jepret', T.th2016, 0.55),
    bunyi('hantam', T.th2016 + 0.02, 0.35),
    bunyi('whooshB', S[7].mulai + 2.55, 0.3),
    ...tikD,
    bunyi('glitch', T.ketat, 0.25),
    bunyi('hantam', T.gak + 0.1, 0.45),
    bunyi('whooshTurun', S[8].mulai + 0.6, 0.35),
    bunyi('riser', T.seper + 0.6, 0.18),
    bunyi('kunci', T.dikenalin, 0.4),
    bunyi('whooshTerang', T.keHp + 0.1, 0.3),
    bunyi('pop', T.frame10 + 0.1, 0.3),
    bunyi('pop', T.thumb10 + 0.15, 0.3),
    bunyi('swish', T.ketangkep - 0.1, 0.3),
    bunyi('pop', T.sepersekian, 0.3),
    bunyi('whooshPop', T.simpan, 0.3),
    bunyi('kunci', T.simpan + 0.32, 0.4),
    bunyi('klik', T.follow + 0.3, 0.45),
    bunyi('whooshLembut', T.pulang, 0.3),
  ];
}
