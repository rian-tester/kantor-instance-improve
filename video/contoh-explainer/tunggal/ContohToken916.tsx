// Frame hero (pembuka, tengah, puncak): 15, 581, 968.
// contoh video explainer strawberry, versi 9:16 (generik #6: semua explainer 9:16 + VO narator profesional Sadaltager).
// Konten contoh (revisi #7 a: "lu" → "kamu"). Keluarga gaya sama kayak 16:9: infografis kertas (krem + tinta,
// kuning = sorotan/selotip, teal = angka cara AI baca, merah = huruf r & yang salah; Roboto Slab + JetBrains Mono + Kalam).
// SATU MEJA KERTAS VERTIKAL, kamera turun-naik:
//   A chat (hook: pertanyaan, jawaban dicoret, stempel SALAH)
//   → pertanyaan "dicetak" keluar dari gelembung jadi pita kertas, jatuh ke B
//   B pita digunting jadi 9 token → disusun 3 baris → tiap token dibalik jadi angka → masuk kotak AI
//   → kata strawberry jatuh ke C: dipotong st · raw · berry (+ angkanya)
//   → 3 potongan dibawa naik balik ke B, melayang di atas token " strawberry", huruf dihitung 1–10, ambruk jadi 101830
//   → "yang dia liat": huruf bayangan memudar (r terakhir) → trik: 101830 pecah jadi 10 huruf, r dihitung 1-2-3
//   → kamera terbang balik ke A (bookend) → "ngaku deh" + gelembung komentar → loop ke frame pertama.
// Token & angka = hasil asli tokenizer OpenAI (tiktoken o200k_base / GPT-4o, dicek 16/10/2026).
// Zona aman Shorts: teks/angka 10–30% atas, subjek 35–75%, subtitle (pita gelap tipis) 72–78%, 20% bawah & kolom kanan
// bawah cuma kertas.
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  AngkaJalan, BalikKartu, Bunyi, campur, Dunia, EASE, GarisDigambar, Grain, hitungKamera, JEPIT, Karakter, KataMuncul, maju,
  noise, pathLingkarTangan, pathPanah, pegas, Pop, SapuSorot, Squash, Stempel, Subtitle, useDetik,
  type KunciKamera, type Sfx,
} from "../../src/gerak";
import { MONO, SLAB, TANGAN } from "../../src/gerak/font";
import { Gunting, K, KATA, LatarKertas, POTONG, Selotip, SFX, Spasi, TOKEN, type DataExplainer } from "./ContohToken169";
import { waktuStrawberry, type WaktuS } from "./waktuStrawberry";

const W = 1080;
const B_Y = 1300; // stasiun B (meja token) — deket A biar terbang balik gak lewat kertas kosong
const C_Y = 2700; // stasiun C (meja potong kata)
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// ---------- A: chat ----------
const BUB_U = { x: 130, y: 690, w: 860, h: 200 };
const BUB_A = { x: 70, y: 980, w: 640, h: 150 };

// ---------- B: pita → grid token ----------
const PITA_FS = 42;
const PITA_CW = 25.2; // lebar 1 huruf mono 42 px
const GRID_FS = 62;
const GRID_CW = 37.2;
const TT = 112; // tinggi kartu token di grid
const PITA_Y = B_Y + 760; // tengah pita
const BARIS = [[0, 1, 2], [3, 4, 5, 6], [7, 8]];
const BARIS_Y = [B_Y + 730, B_Y + 880, B_Y + 1030];
const panjangTeks = (i: number) => TOKEN[i].t.length + (TOKEN[i].sp ? 1 : 0);
const LEBAR_PITA = TOKEN.map((_, i) => panjangTeks(i) * PITA_CW + 12);
const LEBAR_GRID = TOKEN.map((k, i) => Math.max(panjangTeks(i), String(k.id).length) * GRID_CW + 36);
const GRID = (() => {
  const pos: { x: number; y: number }[] = [];
  BARIS.forEach((b, r) => {
    const total = b.reduce((n, i) => n + LEBAR_GRID[i], 0) + (b.length - 1) * 20;
    let x = W / 2 - total / 2;
    b.forEach((i) => {
      pos[i] = { x: x + LEBAR_GRID[i] / 2, y: BARIS_Y[r] };
      x += LEBAR_GRID[i] + 20;
    });
  });
  return pos;
})();
const X8 = GRID[7].x; // tengah token " strawberry"
const Y8 = GRID[7].y;
/** tengah tiap potongan pita (posisi pita, celah potong g[i] 0..1) */
function posisiPita(g: number[]) {
  const buka = g.reduce((a, b) => a + b, 0) * 12;
  const total = LEBAR_PITA.reduce((a, b) => a + b, 0) + buka;
  let x = W / 2 - total / 2;
  return LEBAR_PITA.map((w, i) => {
    if (i > 0) x += g[i] * 12;
    const c = x + w / 2;
    x += w;
    return c;
  });
}
const PITA0 = posisiPita(TOKEN.map(() => 0));

// ---------- C: ubin huruf ----------
const UBIN = { w: 82, h: 134, celah: 8, fs: 104, pisah: 32 };
const LEBAR_KATA = KATA.length * UBIN.w + (KATA.length - 1) * UBIN.celah;

function kunciKamera(T: WaktuS): KunciKamera[] {
  const pelan = Easing.inOut(Easing.sin);
  return [
    { t: 0, x: 540, y: 960, z: 1 },
    { t: T.keB - 0.1, x: 540, y: 935, z: 1.05, ease: pelan },
    { t: T.diB, x: 540, y: B_Y + 940, z: 1 },
    { t: T.dipotong, x: 540, y: B_Y + 850, z: 1.06, ease: pelan }, // dorong ke pita sebelum digunting
    { t: T.bagian + 0.5, x: 540, y: B_Y + 940, z: 1 },
    { t: T.keC, x: 540, y: B_Y + 975, z: 0.99, ease: pelan },
    { t: T.diC, x: 540, y: C_Y + 920, z: 1.06 },
    { t: T.balikB, x: 540, y: C_Y + 930, z: 1.1, ease: pelan },
    { t: T.diB2, x: 530, y: B_Y + 1080, z: 1.08 },
    { t: T.cuma5, x: X8 + 20, y: B_Y + 1100, z: 1.12, ease: pelan },
    { t: T.lebur + 0.4, x: X8 + 40, y: B_Y + 1080, z: 1.3 },
    { t: T.k7.mulai, x: X8 + 40, y: B_Y + 1075, z: 1.34, ease: pelan },
    { t: T.ngeja + 0.3, x: 540, y: B_Y + 1000, z: 1 },
    { t: T.keA, x: 540, y: B_Y + 1005, z: 1.02, ease: pelan },
    { t: T.diA, x: 540, y: 960, z: 1, ease: Easing.inOut(Easing.poly(4)) },
    { t: T.loop, x: 540, y: 950, z: 1.03, ease: pelan },
    { t: T.total - 0.2, x: 540, y: 960, z: 1 },
  ];
}

// ======================================================================================================
export const ContohToken916: React.FC<DataExplainer> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuStrawberry(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const kunci = useMemo(() => kunciKamera(T), [T]);
  const kam = hitungKamera(kunci, t, fps, {
    drift: 2,
    getar: [
      { t: T.stempel + 0.08, kuat: 12, lama: 0.16 },
      { t: T.lebur + 0.22, kuat: 10, lama: 0.16 },
      { t: T.diC - 0.05, kuat: 4 },
      { t: T.diA + 0.15, kuat: 6, lama: 0.14 },
    ],
  });
  return (
    <AbsoluteFill style={{ background: K.kertas, fontFamily: SLAB, color: K.tinta, overflow: 'hidden' }}>
      <LatarKertas kamera={kam} />
      <Dunia kamera={kam} tinggiDunia={6200} blurGerak={1100}>
        <PitaDanToken T={T} />
        <Chat T={T} />
        <MejaKata T={T} />
        <Trik T={T} />
      </Dunia>
      <HUD T={T} />
      <></>
      <Subtitle
        kata={d.kata}
        kalimat={d.kalimat}
        font={SLAB}
        tebal={700}
        ukuran={42}
        maksHuruf={32}
        sorot={K.kuning}
        pita="rgba(29,27,24,0.84)"
        sampai={T.loop + 0.1}
        zona={[{ dari: 0, x: 515, y: 1392, lebar: 820 }]}
      />
      <Grain kuat={0.2} garisScan={0} vinyet={0.3} warnaVinyet="70,50,25" />
      <></>
    </AbsoluteFill>
  );
};

function waktuPotong(T: WaktuS, i: number) {
  // gunting jalan kiri→kanan sepanjang pita selama 1,0 dtk mulai "dipotong"
  const x0 = PITA0[0] - LEBAR_PITA[0] / 2;
  const kiri = PITA0[i] - LEBAR_PITA[i] / 2;
  const total = PITA0[8] + LEBAR_PITA[8] / 2 - x0;
  return T.dipotong + ((kiri - x0) / total) * 1.0;
}

function daftarSfx(T: WaktuS): Sfx[] {
  const s = (k: keyof typeof SFX, momen: number, vol: number): Sfx => ({ ...SFX[k], momen, vol });
  return [
    s('pop', 0.1, 0.5),
    s('pop', T.jawab, 0.35),
    s('swish', T.coret + 0.05, 0.45),
    s('hantam', T.stempel + 0.08, 0.8),
    s('tik', T.r1, 0.4),
    s('kunci', T.keB - 0.35, 0.45), // pita dicetak keluar
    s('whoosh', T.keB + 0.3, 0.5),
    ...TOKEN.slice(1).map((_, i) => s('tik', waktuPotong(T, i + 1), 0.22)),
    s('swish', T.bagian + 0.05, 0.35),
    s('pop', T.token2, 0.4),
    s('kunci', T.diubah, 0.4),
    s('kunci', T.diubah + 0.3, 0.3),
    s('pop', T.diolah + 0.55, 0.45),
    s('whoosh', T.keC + 0.3, 0.5),
    s('pop', T.diC, 0.4),
    s('swish', T.dipotong4, 0.45),
    s('swish', T.dipotong4 + 0.28, 0.4),
    s('pop', T.tiga, 0.4),
    s('tik', T.este + 0.15, 0.45),
    s('tik', T.raw + 0.15, 0.45),
    s('tik', T.berry + 0.15, 0.45),
    s('whoosh', T.balikB + 0.3, 0.5),
    s('tik', T.sepuluh + 0.1, 0.25),
    s('tik', T.sepuluh + 0.35, 0.25),
    s('hantam', T.lebur + 0.22, 0.75),
    s('jepret', T.liat, 0.5),
    s('glitch', T.keliatan, 0.4),
    s('pop', T.ngeja + 0.1, 0.35),
    s('pop', T.ngeja + 0.45, 0.3),
    s('klik', T.baru - 0.2, 0.5),
    s('klik', T.baru + 0.12, 0.5),
    s('hit', T.ngitung + 0.12, 0.45),
    s('bass', T.keA + 0.3, 0.5),
    s('pop', T.diA - 0.05, 0.4),
    s('pop', T.deh, 0.45),
  ];
}

// ======================================================================================================
// A: CHAT (hook + bookend). Jawaban & stempel keluar dulu sebelum pita dicetak, muncul lagi di bookend.
const GelembungJawab: React.FC<{ T: WaktuS; mulai: number; keluar: number; stempel: number; coret: number }> = ({ T, mulai, keluar, stempel, coret }) => {
  const t = useDetik();
  if (t < mulai - 0.05 || t > keluar + 0.3) return null;
  return (
    <>
      <Pop mulai={mulai} damping={12} asal="0% 100%" keluar={keluar} gaya={{ position: 'absolute', left: BUB_A.x, top: BUB_A.y }}>
        <div style={{ position: 'relative', width: BUB_A.w, height: BUB_A.h, borderRadius: '34px 34px 34px 6px', background: K.putih, border: `4px solid ${K.tinta}`, boxShadow: '6px 8px 0 rgba(29,27,24,0.15)' }}>
          <div style={{ position: 'absolute', left: 8, top: -50, fontFamily: MONO, fontWeight: 700, fontSize: 34, color: K.abu }}>ChatGPT</div>
          {[0, 1].map((i) => (
            <div key={i} style={{ position: 'absolute', left: 40, top: 40 + i * 44, width: i ? 300 : 500, height: 22, borderRadius: 11, background: K.kertasTua, scale: `${maju(t, mulai + 0.06 + i * 0.06, mulai + 0.2 + i * 0.06)} 1`, transformOrigin: 'left' }} />
          ))}
        </div>
      </Pop>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d={`M ${BUB_A.x + 30} ${BUB_A.y + 50} L ${BUB_A.x + 560} ${BUB_A.y + 112}`} mulai={coret} lama={0.12} warna={K.merah} tebal={11} hapus={keluar} easing={EASE.masuk} />
        <GarisDigambar d={`M ${BUB_A.x + 40} ${BUB_A.y + 120} L ${BUB_A.x + 550} ${BUB_A.y + 40}`} mulai={coret + 0.1} lama={0.12} warna={K.merah} tebal={11} hapus={keluar} easing={EASE.masuk} />
      </svg>
      <Stempel mulai={stempel} rot={-9} keluar={keluar} gaya={{ position: 'absolute', left: BUB_A.x + 450, top: BUB_A.y + 34, scale: String(t >= T.salah1 && t < T.k2.mulai ? 1 + 0.14 * (1 - pegas(t, T.salah1, 30, { damping: 8, stiffness: 240, mass: 0.6 })) : 1) }}>
        <div style={{ padding: '4px 24px 8px', border: `8px solid ${K.merah}`, borderRadius: 16, color: K.merah, fontWeight: 900, fontSize: 80, lineHeight: 1, background: 'rgba(251,248,241,0.85)', letterSpacing: '0.04em' }}>SALAH</div>
      </Stempel>
    </>
  );
};

const Chat: React.FC<{ T: WaktuS }> = ({ T }) => {
  const t = useDetik();
  if (t > T.diB + 0.3 && t < T.keA) return null;
  const redupTeks = maju(t, T.keB - 0.4, T.keB) * (1 - maju(t, T.keA, T.diA)); // teksnya "pindah" ke pita
  return (
    <>
      <Pop mulai={0.1} damping={12} asal="100% 100%" keluar={T.loop + 0.05} gaya={{ position: 'absolute', left: BUB_U.x, top: BUB_U.y }}>
        <div style={{ position: 'relative', width: BUB_U.w, height: BUB_U.h, borderRadius: '34px 34px 6px 34px', background: K.tinta, color: K.putih, padding: '30px 44px', boxShadow: '6px 8px 0 rgba(29,27,24,0.18)' }}>
          <div style={{ position: 'absolute', right: 8, top: -50, fontFamily: MONO, fontWeight: 700, fontSize: 34, color: K.abu }}>kamu</div>
          <div style={{ fontWeight: 800, fontSize: 64, lineHeight: 1.18, opacity: 1 - 0.65 * redupTeks }}>
            <KataMuncul mulai={0.12} jeda={0.03} lama={0.12} gaya={{ columnGap: '0.26em' }} kata={['ada', 'berapa', 'huruf', { t: 'r', warna: '#ff8a7a' }]} />
            <KataMuncul
              mulai={0.24}
              jeda={0.03}
              lama={0.12}
              gaya={{ columnGap: '0.26em' }}
              kata={['di', { t: 'strawberry?', isi: <SapuSorot mulai={T.straw1 + 0.05} lama={0.25} warna={K.kuning} warnaTeks={[K.putih, K.tinta]} penuh>strawberry?</SapuSorot> }]}
            />
          </div>
        </div>
      </Pop>
      <Pop mulai={0.22} keluar={T.loop + 0.05} gaya={{ position: 'absolute', left: 0, top: 0 }}>
        <Selotip x={BUB_U.x + 50} y={BUB_U.y + 6} rot={-12} />
      </Pop>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d={pathLingkarTangan(BUB_U.x + 620, BUB_U.y + 66, 42, 46, 'lingkarR916')} mulai={T.r1 - 0.05} lama={0.3} warna={K.merah} tebal={7} hapus={T.keB - 0.4} />
      </svg>
      <GelembungJawab T={T} mulai={0.36} keluar={T.keB - 0.5} stempel={0.8} coret={0.58} />
      <GelembungJawab T={T} mulai={T.diA - 0.15} keluar={T.loop} stempel={T.diA + 0.12} coret={T.diA - 0.02} />
      {/* anotasi "viral!" (kalimat 1) */}
      <Pop mulai={T.viral + 0.05} damping={9} keluar={T.keB - 0.4} gaya={{ position: 'absolute', left: 120, top: 588, rotate: '-8deg' }}>
        <div style={{ fontFamily: TANGAN, fontWeight: 700, fontSize: 70, color: K.merah }}>viral!</div>
      </Pop>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        {[[-34, -30], [0, -44], [34, -30]].map(([dx, dy], i) => (
          <GarisDigambar key={i} d={`M ${210 + dx * 1.6} ${596 + dy * 0.4} L ${210 + dx * 2.6} ${596 + dy * 1.4}`} mulai={T.viral + 0.12 + i * 0.04} lama={0.12} warna={K.merah} tebal={6} hapus={T.keB - 0.4} />
        ))}
        <GarisDigambar d={pathPanah(330, 640, 420, 700, -24, 22)} mulai={T.viral + 0.2} lama={0.22} warna={K.merah} tebal={6} hapus={T.keB - 0.4} />
      </svg>
      {/* bookend: gelembung komentar */}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <GarisDigambar d="M 150 1215 Q 150 1175 190 1175 H 430 Q 470 1175 470 1215 V 1290 Q 470 1330 430 1330 H 260 L 210 1372 L 222 1330 H 190 Q 150 1330 150 1290 Z" mulai={T.deh + 0.05} lama={0.4} warna={K.teal} tebal={8} hapus={T.loop} lamaHapus={0.2} />
      </svg>
      {[0, 1, 2].map((i) => {
        const m = maju(t, T.deh + 0.35 + i * 0.08, T.deh + 0.5 + i * 0.08) * (1 - maju(t, T.loop, T.loop + 0.15));
        if (m <= 0) return null;
        return <div key={i} style={{ position: 'absolute', left: 240 + i * 52, top: 1242 + Math.sin(t * 9 + i) * 5, width: 24, height: 24, borderRadius: 12, background: K.teal, opacity: m, scale: String(m) }} />;
      })}
    </>
  );
};

// ======================================================================================================
// B: pita dicetak dari gelembung → digunting → disusun jadi grid → dibalik jadi angka → kotak AI; + 101830
const PitaDanToken: React.FC<{ T: WaktuS }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < T.keB - 0.45 || (t > T.diC + 0.4 && t < T.balikB - 0.2) || t > T.diA + 0.3) return null;
  // fase: cetak (keluar dari balik gelembung) → jatuh ke B → potong → susun grid
  const cetak = maju(t, T.keB - 0.42, T.keB, EASE.masuk);
  const jatuh = maju(t, T.keB, T.diB - 0.05, EASE.kamera);
  const yCetak = lerp(BUB_U.y + 110, BUB_U.y + BUB_U.h + 70, cetak);
  const yPita = lerp(yCetak, PITA_Y, jatuh) - Math.sin(Math.PI * jatuh) * 40;
  const g = TOKEN.map((_, i) => (i === 0 ? 0 : maju(t, waktuPotong(T, i), waktuPotong(T, i) + 0.25, EASE.masuk)));
  const pita = posisiPita(g);
  const susun = (i: number) => maju(t, T.bagian + i * 0.04, T.bagian + 0.5 + i * 0.04, EASE.kamera);
  const redup = 1 - 0.62 * maju(t, T.balikB, T.balikB + 0.5);
  const gunting = maju(t, T.dipotong, T.dipotong + 1.0, EASE.linear);
  const xGunting = lerp(PITA0[0] - LEBAR_PITA[0] / 2, PITA0[8] + LEBAR_PITA[8] / 2, gunting);
  const jmlPotong = 1 + g.filter((x) => x > 0.5).length;
  return (
    <>
      {TOKEN.map((k, i) => {
        const s = susun(i);
        const cx = lerp(pita[i], GRID[i].x, s);
        const cy = lerp(yPita, GRID[i].y, s) - Math.sin(Math.PI * s) * 30;
        const w = lerp(LEBAR_PITA[i], LEBAR_GRID[i], s);
        const h = lerp(66, TT, s);
        const fs = lerp(PITA_FS, GRID_FS, s);
        const tok8 = i === 7;
        const jadiAngka = T.diubah + i * 0.07;
        const balikTeks = T.balikB + 0.35 + i * 0.05;
        const lebur = tok8 && t >= T.lebur;
        const rot = noise(`tr916${i}`, 3) * 2.4 * Math.max(g[i], s);
        const terpisah = Math.max(g[i], g[Math.min(8, i + 1)], s);
        const depan = (
          <div style={{ position: 'absolute', inset: 0, borderRadius: lerp(4, 10, s), background: K.putih, border: `${lerp(2, 3, s)}px solid ${campur('#d8ccb2', K.tinta, terpisah)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 700, fontSize: fs, color: K.tinta, boxShadow: terpisah > 0.5 ? '4px 5px 0 rgba(29,27,24,0.18)' : undefined }}>
            {k.sp ? <Spasi warna={tok8 && t > T.tengah && t < T.lebur ? K.teal : '#b9ad95'} /> : null}
            {k.t}
          </div>
        );
        const belakang = (
          <div style={{ position: 'absolute', inset: 0, borderRadius: 10, background: lebur ? K.teal : K.tealMuda, border: `3px solid ${K.teal}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 800, fontSize: GRID_FS, color: lebur ? K.putih : K.teal }}>
            {k.id}
          </div>
        );
        const hentak = lebur ? 1 + 0.35 * (1 - pegas(t, T.lebur + 0.12, fps, { damping: 9, stiffness: 260, mass: 0.6 })) : 1;
        const sorot8 = tok8 ? maju(t, T.straw5, T.straw5 + 0.25, EASE.kamera) * (1 - maju(t, T.lebur, T.lebur + 0.15)) : 0;
        return (
          <div key={i} style={{ position: 'absolute', left: cx - w / 2, top: cy - h / 2, opacity: tok8 ? 1 : redup, rotate: `${rot}deg`, scale: String(hentak) }}>
            {sorot8 > 0 ? <div style={{ position: 'absolute', left: -16, top: -14, width: w + 32, height: h + 28, borderRadius: 16, background: K.kuning, transformOrigin: 'left', scale: `${sorot8} 1` }} /> : null}
            <BalikKartu
              lebar={w}
              tinggi={h}
              balik={tok8 && t >= T.balikB ? T.lebur + 0.08 : jadiAngka}
              balikLagi={tok8 && t >= T.balikB ? undefined : balikTeks}
              lama={0.3}
              depan={depan}
              belakang={belakang}
            />
            {s > 0.05 ? <Selotip x={w / 2} y={-6} w={Math.min(w * 0.55, 90)} rot={noise(`ts916${i}`, 2) * 10} warna={i % 2 ? 'rgba(20,135,124,0.35)' : 'rgba(244,197,24,0.6)'} /> : null}
          </div>
        );
      })}
      {gunting > 0 && gunting < 1 ? <Gunting x={xGunting} y={PITA_Y - 72} /> : null}
      {t > T.dipotong && t < T.keC + 0.2 ? (
        <div style={{ position: 'absolute', left: 110, top: B_Y + 1095, fontFamily: TANGAN, fontWeight: 700, fontSize: 60, color: K.tinta, opacity: maju(t, T.dipotong, T.dipotong + 0.2) * (1 - maju(t, T.keC - 0.2, T.keC)) }}>
          = <AngkaJalan dari={0} ke={9} progress={jmlPotong / 9} /> {t >= T.token2 ? <span style={{ color: K.teal }}>token</span> : 'potongan'}
        </div>
      ) : null}
      {t > T.tengah - 0.05 && t < T.lebur + 0.3 ? (
        <div style={{ position: 'absolute', left: GRID[7].x - LEBAR_GRID[7] / 2, top: Y8 + 64, fontFamily: TANGAN, fontWeight: 700, fontSize: 46, color: K.teal, opacity: maju(t, T.tengah, T.tengah + 0.2) * (1 - maju(t, T.lebur, T.lebur + 0.2)) }}>
          ↑ ada spasi di depan
        </div>
      ) : null}
      <KotakAI T={T} />
      <AngkaLebur T={T} />
    </>
  );
};

const KotakAI: React.FC<{ T: WaktuS }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < T.diolah - 0.4 || t > T.keC + 0.4) return null;
  const kotak = { x: 540 - 170, y: B_Y + 1175, w: 340, h: 136 };
  const tumbuk = t >= T.diolah + 0.55 ? 1 - pegas(t, T.diolah + 0.55, fps, { damping: 8, stiffness: 240, mass: 0.6 }) : 0;
  const keluar = maju(t, T.keC - 0.1, T.keC + 0.2, EASE.keluar);
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - keluar }} width={1} height={1}>
        {TOKEN.map((_, i) => {
          const x1 = GRID[i].x;
          const y1 = GRID[i].y + TT / 2 + 4;
          const x2 = 540 + (i - 4) * 22;
          return <GarisDigambar key={i} d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + kotak.y) / 2 + 40} ${x2} ${kotak.y - 6}`} mulai={T.diolah - 0.25 + i * 0.04} lama={0.32} warna={K.teal} tebal={4} opacity={0.7} />;
        })}
      </svg>
      <div style={{ position: 'absolute', left: kotak.x, top: kotak.y, width: kotak.w, height: kotak.h, opacity: maju(t, T.diolah - 0.35, T.diolah - 0.15) * (1 - keluar), scale: `${1 + tumbuk * 0.08} ${1 - tumbuk * 0.08}`, borderRadius: 22, background: K.tinta, color: K.putih, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '6px 8px 0 rgba(29,27,24,0.2)' }}>
        <div style={{ fontWeight: 900, fontSize: 62, lineHeight: 1 }}>AI</div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, color: K.tealMuda, marginTop: 6 }}>ngolah angka</div>
      </div>
    </>
  );
};

/** S6: bingkai "yang dia liat" di token 101830 + huruf bayangan di atasnya memudar (r paling akhir). */
const AngkaLebur: React.FC<{ T: WaktuS }> = ({ T }) => {
  const t = useDetik();
  if (t < T.k6.mulai - 0.05 || t > T.keA) return null;
  const w8 = LEBAR_GRID[7];
  const bingkai = { x: X8 - w8 / 2 - 26, y: Y8 - TT / 2 - 26, w: w8 + 52, h: TT + 52 };
  const pojok = (x: number, y: number, dx: number, dy: number) => `M ${x} ${y + dy * 38} L ${x} ${y} L ${x + dx * 38} ${y}`;
  const hilang = (i: number) => maju(t, T.keliatan - 0.25 + (KATA[i] === 'r' ? 0.35 : i * 0.02), T.keliatan + 0.15 + (KATA[i] === 'r' ? 0.35 : i * 0.02), EASE.keluar);
  const munculBayang = maju(t, T.k6.mulai, T.k6.mulai + 0.4);
  const keluarS7 = maju(t, T.k7.mulai - 0.1, T.k7.mulai + 0.2);
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - keluarS7 }} width={1} height={1}>
        {[pojok(bingkai.x, bingkai.y, 1, 1), pojok(bingkai.x + bingkai.w, bingkai.y, -1, 1), pojok(bingkai.x, bingkai.y + bingkai.h, 1, -1), pojok(bingkai.x + bingkai.w, bingkai.y + bingkai.h, -1, -1)].map((p, i) => (
          <GarisDigambar key={i} d={p} mulai={T.liat - 0.1 + i * 0.03} lama={0.18} warna={K.teal} tebal={7} ujung="square" />
        ))}
      </svg>
      <div style={{ position: 'absolute', left: bingkai.x, top: bingkai.y + bingkai.h + 6, fontFamily: TANGAN, fontWeight: 700, fontSize: 44, color: K.teal, opacity: maju(t, T.liat, T.liat + 0.2) * (1 - keluarS7) }}>yang dia liat</div>
      <div style={{ position: 'absolute', left: X8 - 260, top: Y8 + 140, width: 520, display: 'flex', justifyContent: 'center', fontWeight: 900, fontSize: 66, opacity: munculBayang }}>
        {KATA.map((h, i) => {
          const q = hilang(i);
          const r = h === 'r';
          const denyut = r ? 1 + 0.25 * Math.sin(Math.PI * maju(t, T.huruf6, T.huruf6 + 0.4)) : 1;
          return (
            <span key={i} style={{ display: 'inline-block', color: r ? K.merah : 'rgba(29,27,24,0.42)', opacity: 1 - q, filter: q > 0 ? `blur(${(q * 10).toFixed(1)}px)` : undefined, translate: `0 ${(-q * 36).toFixed(1)}px`, scale: String(denyut) }}>
              {h}
            </span>
          );
        })}
      </div>
    </>
  );
};

// ======================================================================================================
// C: kata strawberry jatuh dari grid → 10 ubin huruf → dipotong st · raw · berry → dibawa naik ke B → ambruk jadi 101830
const MejaKata: React.FC<{ T: WaktuS }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < T.keC - 0.1 || t > T.lebur + 0.45) return null;
  const terbang = maju(t, T.keC, T.diC - 0.05, EASE.kamera);
  const mendarat = t >= T.diC - 0.05;
  const pisah = maju(t, T.tiga - 0.05, T.tiga + 0.35, EASE.masuk);
  const balik = maju(t, T.balikB, T.diB2 - 0.05, EASE.kamera);
  const ambruk = maju(t, T.lebur - 0.04, T.lebur + 0.2, EASE.jatuh);
  const pusatC = { x: 540, y: C_Y + 880 };
  const bawah8 = { x: X8, y: Y8 + 250 };
  const pusat = {
    x: lerp(pusatC.x, bawah8.x, balik),
    y: lerp(pusatC.y, bawah8.y, balik) - ambruk * 250 + (balik >= 1 && ambruk <= 0 ? noise('melayang916', t * 0.8) * 7 : 0),
    s: lerp(1, 0.5, balik) * lerp(1, 0.28, ambruk),
  };
  const o = 1 - maju(t, T.lebur + 0.1, T.lebur + 0.25);
  if (!mendarat) {
    const x = lerp(X8, pusatC.x, terbang);
    const y = lerp(Y8, pusatC.y, terbang) - Math.sin(Math.PI * terbang) * 140;
    return (
      <div style={{ position: 'absolute', left: x, top: y, translate: '-50% -50%', fontFamily: MONO, fontWeight: 800, fontSize: lerp(56, 104, terbang), color: K.tinta, opacity: maju(t, T.keC - 0.1, T.keC + 0.05) }}>
        strawberry
      </div>
    );
  }
  const hitung = Math.floor(interpolate(t, [T.sepuluh, T.sepuluh + 0.6], [0, 10], JEPIT));
  const kolom = (i: number, gi: number) => -LEBAR_KATA / 2 + i * (UBIN.w + UBIN.celah) + (gi - 1) * UBIN.pisah * pisah;
  return (
    <>
      <div style={{ position: 'absolute', left: pusat.x, top: pusat.y, scale: String(pusat.s), opacity: o }}>
        {KATA.map((h, i) => {
          const gi = POTONG.findIndex((p) => i >= p.dari && i < p.sampai);
          const x = kolom(i, gi);
          const pop = pegas(t, T.diC - 0.05 + i * 0.025, fps, { damping: 11, stiffness: 220, mass: 0.6 });
          const p = POTONG[gi];
          const angkat = [T.este, T.raw, T.berry][gi];
          const naik = t >= angkat ? 1 - pegas(t, angkat, fps, { damping: 10, stiffness: 200, mass: 0.6 }) : 0;
          const nyala = i < hitung && t < T.lebur;
          const ombak = Math.sin(Math.PI * maju(t, T.straw4 + i * 0.04, T.straw4 + i * 0.04 + 0.32, EASE.linear)) * 24;
          return (
            <div key={i} style={{ position: 'absolute', left: x, top: -UBIN.h / 2 - naik * 18 - ombak, width: UBIN.w, height: UBIN.h, scale: String(pop), borderRadius: 14, background: nyala ? K.kuning : K.putih, border: `4px solid ${K.tinta}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: UBIN.fs, lineHeight: 1, color: h === 'r' ? K.merah : K.tinta, boxShadow: '5px 6px 0 rgba(29,27,24,0.18)' }}>
              {h}
              {pisah > 0.05 ? <div style={{ position: 'absolute', left: -6, right: -6, top: -14, height: 26, background: p.warna, opacity: 0.75 * pisah, rotate: `${(gi - 1) * 2}deg` }} /> : null}
            </div>
          );
        })}
        {POTONG.map((p, gi) => {
          const tengahX = kolom((p.dari + p.sampai - 1) / 2, gi) + UBIN.w / 2;
          const kapan = [T.este, T.raw, T.berry][gi];
          return (
            <React.Fragment key={gi}>
              <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
                <GarisDigambar d={`M ${tengahX} ${UBIN.h / 2 + 6} L ${tengahX} ${UBIN.h / 2 + 52}`} mulai={kapan} lama={0.12} warna={K.tinta} tebal={4} />
              </svg>
              <Squash mendarat={kapan + 0.16} tinggiJatuh={90} lamaJatuh={0.16} gaya={{ position: 'absolute', left: tengahX - 130, top: UBIN.h / 2 + 48, width: 260, display: 'flex', justifyContent: 'center' }}>
                <div style={{ padding: '6px 20px', borderRadius: 12, background: K.tealMuda, border: `4px solid ${K.teal}`, fontFamily: MONO, fontWeight: 800, fontSize: 52, color: K.teal }}>{p.id}</div>
              </Squash>
            </React.Fragment>
          );
        })}
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
          {[2, 5].map((b, j) => {
            const xb = -LEBAR_KATA / 2 + b * (UBIN.w + UBIN.celah) - UBIN.celah / 2;
            return <GarisDigambar key={b} d={`M ${xb} ${-UBIN.h / 2 - 50} L ${xb} ${UBIN.h / 2 + 30}`} mulai={T.dipotong4 + j * 0.28} lama={0.22} warna={K.merah} tebal={5} hapus={T.tiga} lamaHapus={0.2} />;
          })}
        </svg>
        {[2, 5].map((b, j) => {
          const p = maju(t, T.dipotong4 + j * 0.28, T.dipotong4 + j * 0.28 + 0.22, EASE.linear);
          if (p <= 0 || p >= 1) return null;
          const xb = -LEBAR_KATA / 2 + b * (UBIN.w + UBIN.celah) - UBIN.celah / 2;
          return <Gunting key={b} x={xb} y={-UBIN.h / 2 - 50 + p * (UBIN.h + 80)} />;
        })}
      </div>
      {t > T.sepuluh - 0.05 && t < T.lebur + 0.3 ? (
        <div style={{ position: 'absolute', left: X8 + 225, top: Y8 + 214, fontFamily: TANGAN, fontWeight: 700, fontSize: 50, color: K.tinta, opacity: maju(t, T.sepuluh - 0.05, T.sepuluh + 0.1) * o }}>
          <AngkaJalan dari={0} ke={10} progress={hitung / 10} /> huruf
        </div>
      ) : null}
    </>
  );
};

// ======================================================================================================
// TRIK (S7, di B): 101830 pecah jadi 10 huruf yang dieja, r dilingkari & dihitung 1-2-3
const Trik: React.FC<{ T: WaktuS }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < T.ngeja - 0.1 || t > T.diA + 0.3) return null;
  const ubin = { w: 70, h: 96, celah: 10 };
  const lebar = KATA.length * ubin.w + (KATA.length - 1) * ubin.celah;
  const y0 = B_Y + 1110;
  const x0 = 520 - lebar / 2;
  const rIdx = KATA.map((h, i) => (h === 'r' ? i : -1)).filter((i) => i >= 0);
  const kapanR = [T.baru - 0.25, T.baru + 0.08, T.ngitung + 0.12];
  const n = kapanR.filter((k) => t >= k + 0.12).length;
  const pop = n > 0 ? 1 + 0.25 * (1 - pegas(t, kapanR[n - 1] + 0.12, fps, { damping: 8, stiffness: 250, mass: 0.6 })) : 1;
  return (
    <>
      {KATA.map((h, i) => {
        const mulai = T.ngeja + i * 0.08;
        const p = maju(t, mulai, mulai + 0.32, EASE.masuk);
        if (p <= 0) return null;
        const x = x0 + i * (ubin.w + ubin.celah);
        const sx = lerp(X8 - ubin.w / 2, x, p);
        const sy = lerp(Y8 - ubin.h / 2, y0, p) - Math.sin(Math.PI * p) * 70;
        return (
          <div key={i} style={{ position: 'absolute', left: sx, top: sy, width: ubin.w, height: ubin.h, borderRadius: 12, background: K.putih, border: `4px solid ${K.tinta}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 76, lineHeight: 1, color: h === 'r' ? K.merah : K.tinta, rotate: `${(1 - p) * (i % 2 ? 14 : -14)}deg`, boxShadow: '4px 5px 0 rgba(29,27,24,0.18)' }}>
            {h}
          </div>
        );
      })}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        {rIdx.map((ri, j) => {
          const cx = x0 + ri * (ubin.w + ubin.celah) + ubin.w / 2;
          return <GarisDigambar key={ri} d={pathLingkarTangan(cx, y0 + ubin.h / 2, 50, 66, `trik916R${ri}`)} mulai={kapanR[j]} lama={0.24} warna={K.merah} tebal={7} />;
        })}
      </svg>
      {n > 0 ? (
        <div style={{ position: 'absolute', left: 520 - 150, top: y0 + ubin.h + 18, width: 300, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 16, scale: String(pop) }}>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 64, color: K.merah }}>r =</span>
          <AngkaJalan dari={0} ke={3} progress={n / 3} gaya={{ fontWeight: 900, fontSize: 100, color: K.merah, lineHeight: 1 }} />
        </div>
      ) : null}
    </>
  );
};

// ======================================================================================================
// HUD: label + judul kata kunci (kiri atas, sebelah stiker generik), sumber kecil di bawah zona teks
const LABEL: React.CSSProperties = { fontFamily: MONO, fontWeight: 700, fontSize: 44, letterSpacing: '0.08em', color: K.abu };
const JUDUL: React.CSSProperties = { fontWeight: 800, fontSize: 84, lineHeight: 1.06, color: K.tinta };

const HUD: React.FC<{ T: WaktuS }> = ({ T }) => {
  const t = useDetik();
  const label = (isi: React.ReactNode) => <div style={{ position: 'absolute', left: 70, top: 196, width: 940 }}>{isi}</div>;
  const judul = (isi: React.ReactNode, top = 262) => <div style={{ position: 'absolute', left: 70, top, width: 730 }}>{isi}</div>;
  const sorot = (teks: string, mulai: number, warna = K.kuning) => (
    <SapuSorot mulai={mulai} lama={0.24} warna={warna} warnaTeks={[K.tinta, K.tinta]} penuh>
      {teks}
    </SapuSorot>
  );
  const ada = (a: number, b: number) => t > a - 0.1 && t < b + 0.3;
  const sumber = (() => {
    if (t < T.k2.mulai + 0.6 || t > T.k8.mulai) return null;
    if (t < T.k3.mulai) return 'sumber: TechCrunch, 27 Agu 2024';
    if (t < T.k7.mulai) return 'angka asli: tokenizer OpenAI (tiktoken)';
    return 'trik ngeja: tips praktis (TechCrunch)';
  })();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {sumber ? (
        <div key={sumber} style={{ position: 'absolute', left: 60, top: 1336, padding: '2px 10px', borderRadius: 6, background: 'rgba(235,227,209,0.92)', fontFamily: MONO, fontWeight: 500, fontSize: 30, color: K.abu }}>
          <KataMuncul mulai={t - 10} kata={[sumber]} />
        </div>
      ) : null}
      {/* 1 */}
      {ada(0, T.k2.mulai) ? (
        <>
          {label(<KataMuncul mulai={0.12} keluar={T.k2.mulai - 0.25} gaya={LABEL} kata={[{ t: 'CHATGPT', mulai: 0.12 }, { t: 'SEMPET', mulai: 0.82 }, { t: 'VIRAL', mulai: T.viral, warna: K.merah }]} />)}
          {judul(<KataMuncul mulai={T.salah1} keluar={T.k2.mulai - 0.2} gaya={JUDUL} kata={[{ t: 'salah', mulai: T.salah1 }, { t: 'ngitung', mulai: T.salah1 + 0.28 }, { t: 'huruf', mulai: T.huruf1 }, { t: 'r', mulai: T.r1, warna: K.merah }]} />)}
        </>
      ) : null}
      {/* 2 */}
      {ada(T.k2.mulai, T.k3.mulai) ? (
        <>
          {label(<KataMuncul mulai={T.gak2} keluar={T.k3.mulai - 0.25} gaya={LABEL} kata={[{ t: 'DIA', mulai: T.gak2 - 0.12 }, { t: 'GAK', mulai: T.gak2, warna: K.merah }, { t: 'BACA', mulai: T.gak2 + 0.16 }, { t: 'HURUF', mulai: T.gak2 + 0.4 }]} />)}
          {judul(<KataMuncul mulai={T.tulisan} keluar={T.k3.mulai - 0.2} gaya={JUDUL} kata={[{ t: 'tulisan', mulai: T.tulisan }, { t: '→', mulai: T.dipotong, warna: K.merah }, { t: 'token', mulai: T.token2, isi: sorot('token', T.token2 + 0.1) }]} />)}
        </>
      ) : null}
      {/* 3 */}
      {ada(T.k3.mulai, T.k4.mulai) ? (
        <>
          {label(<KataMuncul mulai={T.k3.mulai} keluar={T.k4.mulai - 0.25} gaya={LABEL} kata={['TIAP', 'TOKEN']} jeda={0.1} />)}
          {judul(<KataMuncul mulai={T.k3.mulai + 0.25} keluar={T.k4.mulai - 0.2} gaya={JUDUL} kata={[{ t: 'token', mulai: T.k3.mulai + 0.25 }, { t: '→', mulai: T.diubah, warna: K.merah }, { t: 'angka', mulai: T.angka3, isi: sorot('angka', T.angka3 + 0.1, K.tealMuda) }]} />)}
        </>
      ) : null}
      {/* 4 */}
      {ada(T.k4.mulai, T.k5.mulai) ? (
        <>
          {label(<KataMuncul mulai={T.versi} keluar={T.k5.mulai - 0.25} gaya={LABEL} kata={['SALAH', 'SATU', 'VERSI:', { t: 'GPT-4o', warna: K.teal }]} jeda={0.07} />)}
          {judul(<KataMuncul mulai={T.este} keluar={T.k5.mulai - 0.2} gaya={{ ...JUDUL, fontFamily: MONO, fontSize: 76 }} kata={[{ t: 'st', mulai: T.este }, { t: '·', mulai: T.raw - 0.1, warna: K.abu }, { t: 'raw', mulai: T.raw }, { t: '·', mulai: T.berry - 0.1, warna: K.abu }, { t: 'berry', mulai: T.berry }]} />)}
        </>
      ) : null}
      {/* 5 */}
      {ada(T.k5.mulai, T.k6.mulai) ? (
        <>
          {label(<KataMuncul mulai={T.tengah} keluar={T.k6.mulai - 0.25} gaya={LABEL} kata={['DI', 'TENGAH', 'KALIMAT:']} jeda={0.08} />)}
          {judul(<KataMuncul mulai={T.straw5} keluar={T.k6.mulai - 0.2} gaya={JUDUL} kata={[{ t: 'strawberry', mulai: T.straw5 }, { t: '→', mulai: T.sepuluh, warna: K.merah }, { t: '101830', mulai: T.satu5, isi: sorot('101830', T.satu5 + 0.12, K.tealMuda), gaya: { fontFamily: MONO } }]} />)}
        </>
      ) : null}
      {/* 6 */}
      {ada(T.k6.mulai, T.k7.mulai) ? (
        <>
          {label(<KataMuncul mulai={T.k6.mulai} keluar={T.k7.mulai - 0.25} gaya={LABEL} kata={['YANG', 'DIA', 'LIAT']} jeda={0.08} />)}
          {t < T.huruf6 ? judul(<KataMuncul mulai={T.potongan} keluar={T.huruf6 - 0.18} gaya={JUDUL} kata={[{ t: 'cuma', mulai: T.potongan - 0.15 }, { t: 'potongan', mulai: T.potongan }, { t: '&', mulai: T.angka6 - 0.2, warna: K.abu }, { t: 'angka', mulai: T.angka6 }]} />) : null}
          {judul(<KataMuncul mulai={T.huruf6} keluar={T.k7.mulai - 0.2} gaya={JUDUL} kata={[{ t: 'huruf', mulai: T.huruf6 }, { t: 'r', mulai: T.huruf6 + 0.2, warna: K.merah }, { t: 'gak', mulai: T.keliatan - 0.15 }, { t: 'keliatan', mulai: T.keliatan }]} />)}
        </>
      ) : null}
      {/* 7 */}
      {ada(T.k7.mulai, T.k8.mulai) ? (
        <>
          {t < T.triknya ? label(<KataMuncul mulai={T.k7.mulai} keluar={T.triknya - 0.2} gaya={LABEL} kata={[{ t: 'JADI', mulai: T.k7.mulai }, { t: 'WAJAR', mulai: T.wajar }, { t: 'DIA', mulai: T.wajar + 0.4 }, { t: 'SALAH', mulai: T.wajar + 0.6, warna: K.merah }]} />) : null}
          {label(<KataMuncul mulai={T.triknya} keluar={T.k8.mulai - 0.3} gaya={{ ...LABEL, color: K.merah }} kata={['TRIKNYA:']} />)}
          {judul(<KataMuncul mulai={T.ngeja} keluar={T.k8.mulai - 0.25} gaya={JUDUL} kata={[{ t: 'eja', mulai: T.ngeja, isi: sorot('eja', T.satusatu) }, { t: 'dulu,', mulai: T.satusatu }, { t: 'baru', mulai: T.baru }, { t: 'hitung', mulai: T.ngitung, isi: sorot('hitung', T.ngitung + 0.12, K.tealMuda) }]} />)}
        </>
      ) : null}
      {/* 8: bookend */}
      {t > T.k8.mulai - 0.1 ? (
        <>
          {label(<KataMuncul mulai={T.pernah} keluar={T.loop} gaya={LABEL} kata={[{ t: 'PERNAH', mulai: T.pernah }, { t: 'LANGSUNG', mulai: T.pernah + 0.22 }, { t: 'PERCAYA?', mulai: T.percaya }]} />)}
          {judul(<KataMuncul mulai={T.ngaku} keluar={T.loop + 0.04} gaya={{ ...JUDUL, fontWeight: 900, fontSize: 130 }} kata={[{ t: 'ngaku', mulai: T.ngaku, isi: sorot('ngaku', T.ngaku + 0.15) }, { t: 'deh', mulai: T.deh }]} />, 270)}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
