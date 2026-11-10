// Frame hero (pembuka, tengah, puncak): 15, 860, 1434.
// contoh video explainer A6 (akun generik, konten contoh): "Huruf T di ChatGPT = Transformer".
// SATU DUNIA (kolom ke bawah): tulisan ChatGPT raksasa → huruf T dilingkari, turun jadi "Transformer" + 8 peneliti Google · 2017 →
// G-P-T turun jadi Generative Pre-trained Transformer → kamera turun ke makalah "Attention Is All You Need" (Juni 2017) → turun lagi
// ke satu kalimat (6 kata): dulu diolah kata demi kata (penanda jalan satu-satu) → attention: busur dari tiap kata ke kata lain
// ("dia" → "kucing") → semua kata nyala sekaligus, ngalir ke GPU → 8 GPU + 3,5 hari + piala rekor → 8 kartu nama penulis dikocok
// → Llion Jones + piringan The Beatles "All You Need Is Love" → makalah → OpenAI → GPT pertama → laporan GPT-4 → CTA → loop.
// Fakta: Vaswani dkk. arXiv 1706.03762 (12/06/2017) · WIRED (Steven Levy, 2024) · OpenAI GPT-4 Technical Report (2023).
// Kalimat contoh & bentuk busur attention = ilustrasi.
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { Bunyi, Dunia, EASE, formatAngka, GarisDigambar, Grain, maju, noise, pathLingkarTangan, pathPanah, pegas, Subtitle, useDetik, type KunciKamera, type Kata } from "../../src/gerak";
import { MONO, SAIRA, SLAB, TANGAN } from "../../src/gerak/font";
import { bunyi, K } from "./raja/gaya";
import type { Kalimat } from "./raja/waktuRaja";
import { CtaSimpanFollow, kameraSeri, LatarSeri, lerp, PeneduhAtas, sorot } from "../../src/gerak/seri/data-gelap/seri";
import { besar, HudTeks, Ikon, Kartu, kecil, Muncul, waktuDasar } from "../../src/gerak/seri/data-gelap/alat19";

export type DataTransformer = { durasi: number; kata: Kata[]; kalimat?: Kalimat[] };

const HURUF = 'ChatGPT'.split('');
const HY = 760; // baris ChatGPT (dunia)
const HX0 = 540 - 3 * 104;
const hx = (i: number) => HX0 + i * 104;
const KERTAS = { x: 540, y: 1720 };
const KAL = { y: 2420 };
const KATA6 = ['kucing', 'itu', 'tidur', 'karena', 'dia', 'capek'];
const LEBAR6 = KATA6.map((w) => w.length * 24 + 34);
const X6 = (() => {
  const tot = LEBAR6.reduce((a, b) => a + b, 0) + 14 * 5;
  let x = 540 - tot / 2;
  return LEBAR6.map((w) => {
    const c = x + w / 2;
    x += w + 14;
    return c;
  });
})();
const GPU = { x: 540, y: 2720 };
const PENULIS = ['Vaswani', 'Shazeer', 'Parmar', 'Uszkoreit', 'Jones', 'Gomez', 'Kaiser', 'Polosukhin'];

function waktuTransformer(d: Kata[], kal: Kalimat[] | undefined, total: number) {
  const W = waktuDasar(d, kal, total, 12);
  const { s, k } = W;
  const huruf = k('huruf', s[0].mulai, s[0].mulai);
  const hT = k('t', huruf + 0.05, huruf + 0.4);
  const chat = k('chatgpt', hT, hT + 0.4);
  const trans0 = k('transformer', chat, chat + 0.8);
  const delapan = k('delapan', trans0, trans0 + 1.6);
  const google = k('google', delapan, delapan + 0.8);
  const n2017 = k('2017', google, s[0].akhir - 0.6);
  const gen = k('generative', s[1].mulai, s[1].mulai + 1.4);
  const pre = k('pre', gen, gen + 0.6);
  const trans1 = k('transformer', pre, pre + 0.6);
  const makalah = k('makalahnya', s[2].mulai, s[2].mulai);
  const attention = k('attention', makalah, makalah + 1.0);
  const juni = k('juni', attention, s[2].akhir - 0.8);
  const kata3 = k('kata', s[3].mulai, s[3].mulai + 2.0);
  const berurutan = k('berurutan', kata3, s[3].akhir - 0.7);
  const attn4 = k('attention', s[4].mulai, s[4].mulai + 1.6);
  const hubung = k('dihubungin', attn4, attn4 + 1.4);
  const seluruh = k('seluruh', hubung, s[4].akhir - 0.6);
  const sekaligus = k('sekaligus', s[5].mulai, s[5].mulai + 1.2);
  const cepat = k('cepat', sekaligus, sekaligus + 1.2);
  const gpu5 = k('gpu', cepat, s[5].akhir - 0.4);
  const tiga = k('tiga', s[6].mulai, s[6].mulai + 1.0);
  const delapan6 = k('delapan', tiga, tiga + 1.2);
  const rekor = k('rekor', delapan6, s[6].akhir - 0.6);
  const urutan = k('urutan', s[7].mulai, s[7].mulai);
  const diacak = k('diacak', urutan, urutan + 1.0);
  const sama = k('sama', diacak, s[7].akhir - 0.6);
  const llion = k('llion', s[8].mulai, s[8].mulai + 0.8);
  const beatles = k('beatles', llion, llion + 1.4);
  const all8 = k('all', beatles, s[8].akhir - 1.0);
  const openai = k('openai', s[9].mulai, s[9].mulai + 1.0);
  const gptPertama = k('gpt', openai, s[9].akhir - 0.6);
  const laporan = k('laporan', s[10].mulai, s[10].mulai);
  const berbasis = k('berbasis', laporan, s[10].akhir - 0.8);
  return {
    ...W, huruf, hT, chat, trans0, delapan, google, n2017, gen, pre, trans1, makalah, attention, juni, kata3, berurutan, attn4, hubung, seluruh,
    sekaligus, cepat, gpu5, tiga, delapan6, rekor, urutan, diacak, sama, llion, beatles, all8, openai, gptPertama, laporan, berbasis,
  };
}
type WT = ReturnType<typeof waktuTransformer>;

// ===============================================================================================================
export const ContohTransformer: React.FC<DataTransformer> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuTransformer(d.kata, d.kalimat, total), [d.kata, d.kalimat, total]);
  const S = T.s;
  const pelan = Easing.linear;
  const kunci: KunciKamera[] = [
    { t: 0, x: 540, y: 960, z: 1.0 },
    { t: 0.6, x: 540, y: 900, z: 1.06 },
    { t: T.hT, x: 560, y: 880, z: 1.1, ease: pelan },
    { t: T.hT + 0.5, x: 620, y: 860, z: 1.12 },
    { t: T.trans0 + 0.3, x: 560, y: 940, z: 1.0 },
    { t: S[1].mulai - 0.1, x: 556, y: 944, z: 1.03, ease: pelan },
    { t: S[1].mulai + 0.5, x: 540, y: 1000, z: 0.95 },
    { t: S[2].mulai - 0.1, x: 544, y: 1004, z: 0.98, ease: pelan },
    { t: S[2].mulai + 0.8, x: KERTAS.x, y: KERTAS.y, z: 1.0 },
    { t: S[3].mulai - 0.1, x: KERTAS.x + 6, y: KERTAS.y - 6, z: 1.04, ease: pelan },
    { t: S[3].mulai + 0.8, x: 540, y: KAL.y - 40, z: 1.05 },
    { t: S[5].mulai - 0.1, x: 544, y: KAL.y - 60, z: 1.1, ease: pelan },
    { t: S[5].mulai + 0.6, x: 540, y: KAL.y + 160, z: 1.0 },
    { t: S[6].mulai - 0.1, x: 536, y: KAL.y + 166, z: 1.03, ease: pelan },
    { t: S[6].mulai + 0.5, x: 540, y: KAL.y + 200, z: 0.9 },
    { t: T.keluarDunia, x: 546, y: KAL.y + 196, z: 0.95, ease: pelan },
    { t: T.simpan + 0.8, x: 540, y: KAL.y + 200, z: 1.0 },
    { t: T.loop, x: 540, y: KAL.y + 200, z: 1.02, ease: pelan },
    { t: total, x: 540, y: KAL.y + 200, z: 1.0 },
  ];
  const kam = kameraSeri(kunci, t, fps, total, [{ t: T.trans0 + 0.05, kuat: 7, lama: 0.14 }]);
  return (
    <AbsoluteFill style={{ background: K.latar, color: K.tinta, overflow: 'hidden', fontFamily: SAIRA }}>
      <LatarSeri kam={kam} />
      <Dunia kamera={kam} tinggiDunia={3000} lebarDunia={1400} blurGerak={1300}>
        <TulisanChatGPT T={T} />
        <Makalah T={T} />
        <KalimatContoh T={T} />
      </Dunia>
      <PeneduhAtas />
      <Latih T={T} />
      <Penulis T={T} />
      <Beatles T={T} />
      <OpenAI T={T} />
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
// redup dunia pas panel HUD (S7–S11)
const redupDunia = (T: WT, t: number) => 0.75 * maju(t, T.s[6].mulai, T.s[6].mulai + 0.4);

export const TulisanChatGPT: React.FC<{ T: WT; sampul?: boolean }> = ({ T, sampul }) => {
  const t0 = useDetik();
  const t = sampul ? T.trans0 + 0.6 : t0;
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < 0.04 || (!sampul && t > S[2].mulai + 1.0)) return null;
  const o = sampul ? 1 : 1 - maju(t, S[2].mulai + 0.1, S[2].mulai + 0.6);
  // S1: G, P, T turun jadi akrostik
  const akro = sampul ? 0 : maju(t, T.gen - 0.4, T.gen + 0.1, EASE.kamera);
  const kataAkro = [
    { i: 4, kata: 'enerative', m: T.gen },
    { i: 5, kata: 're-trained', m: T.pre },
    { i: 6, kata: 'ransformer', m: T.trans1 },
  ];
  const lingkar = sampul ? 1 : maju(t, T.hT - 0.05, T.hT + 0.25);
  const turunT = sampul ? 1 : maju(t, T.trans0 - 0.25, T.trans0 + 0.15, EASE.kamera) * (1 - akro);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      {HURUF.map((h, i) => {
        const m = 0.08 + i * 0.06;
        const s = sampul ? 1 : pegas(t, m, fps, { damping: 11, stiffness: 190, mass: 0.6 });
        const gpt = i >= 4;
        const ak = kataAkro.find((x) => x.i === i);
        const y = HY + (ak ? akro * (110 + (i - 4) * 150) : 0);
        const x = ak ? lerp(hx(i), 150, akro) : hx(i);
        const ukuran = ak ? lerp(190, 120, akro) : 190;
        const warnaT = i === 6 && (lingkar > 0.5 || akro > 0) ? K.kuning : gpt ? K.teal : K.tinta;
        const napas = Math.sin(t * 2 + i * 0.8) * 4;
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: x, top: y + napas * (1 - akro), translate: '-50% -50%', scale: String(Math.max(0.001, s)), fontFamily: SAIRA, fontWeight: 800, fontSize: ukuran, lineHeight: 1, color: warnaT, opacity: ak ? 1 : 1 - akro }}>
              {h}
            </div>
            {ak && akro > 0.6 && t > ak.m - 0.15 ? (
              <div style={{ position: 'absolute', left: x + 40, top: y, translate: '0 -50%', fontFamily: SAIRA, fontWeight: 800, fontSize: 104, lineHeight: 1, color: K.tinta, whiteSpace: 'nowrap', clipPath: `inset(0 ${((1 - maju(t, ak.m - 0.15, ak.m + 0.25)) * 100).toFixed(1)}% 0 0)` }}>
                {ak.kata}
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
      {/* lingkaran tangan di huruf T */}
      {lingkar > 0 && akro < 0.3 ? (
        <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - akro * 3 }}>
          {sampul ? (
            <path d={pathLingkarTangan(hx(6), HY, 92, 110, 'lt6')} fill="none" stroke={K.kuning} strokeWidth={10} strokeLinecap="round" />
          ) : (
            <GarisDigambar d={pathLingkarTangan(hx(6), HY, 92, 110, 'lt6')} mulai={T.hT - 0.05} lama={0.3} warna={K.kuning} tebal={10} />
          )}
        </svg>
      ) : null}
      {/* T turun → Transformer */}
      {turunT > 0 ? (
        <>
          <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - akro }}>
            {sampul ? (
              <path d={pathPanah(hx(6), HY + 120, hx(6) - 40, HY + 250, 30, 30)} fill="none" stroke={K.kuning} strokeWidth={9} strokeLinecap="round" />
            ) : (
              <GarisDigambar d={pathPanah(hx(6), HY + 120, hx(6) - 40, HY + 250, 30, 30)} mulai={T.trans0 - 0.25} lama={0.25} warna={K.kuning} tebal={9} />
            )}
          </svg>
          <div style={{ position: 'absolute', left: hx(6) - 40, top: HY + 330, translate: '-70% -50%', scale: String(sampul ? 1 : pegas(t, T.trans0 - 0.05, fps, { damping: 10, stiffness: 200, mass: 0.6 })), opacity: 1 - akro, padding: '6px 30px', borderRadius: 18, background: K.kuning, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 96, whiteSpace: 'nowrap' }}>
            Transformer
          </div>
        </>
      ) : null}
      {/* 8 peneliti Google · 2017 */}
      {!sampul && t > T.delapan - 0.2 && akro < 1 ? (
        <div style={{ position: 'absolute', left: 540, top: HY + 415, translate: '-50% 0', display: 'flex', alignItems: 'center', gap: 10, opacity: 1 - akro }}>
          {Array.from({ length: 8 }, (_, i) => (
            <svg key={i} width={66} height={80} viewBox="0 0 100 120" style={{ scale: String(pegas(t, T.delapan - 0.2 + i * 0.05, fps, { damping: 11, stiffness: 220, mass: 0.5 })) }}>
              <circle cx={50} cy={30} r={22} fill="none" stroke={K.teal} strokeWidth={9} />
              <path d="M 12 112 Q 12 62 50 62 Q 88 62 88 112" fill="none" stroke={K.teal} strokeWidth={9} />
            </svg>
          ))}
          <div style={{ marginLeft: 14, display: 'flex', flexDirection: 'column', opacity: maju(t, T.google - 0.1, T.google + 0.1) }}>
            {besar('Google', K.tinta, 52)}
            {t > T.n2017 - 0.1 ? besar('2017', K.kuning, 52) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

// S3: makalah "Attention Is All You Need" (Juni 2017)
const Makalah: React.FC<{ T: WT }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[2].mulai - 0.1 || t > S[4].mulai) return null;
  const m = pegas(t, S[2].mulai + 0.3, fps, { damping: 14, stiffness: 150, mass: 0.7 });
  const o = 1 - maju(t, S[3].mulai + 0.3, S[3].mulai + 0.9);
  const W = 680;
  const H = 880;
  const judul = maju(t, T.attention - 0.1, T.attention + 0.6, EASE.linear);
  return (
    <div style={{ position: 'absolute', left: KERTAS.x - W / 2, top: KERTAS.y - H / 2, width: W, height: H, scale: String(Math.max(0.001, m)), rotate: `${(-2 + noise('kr', t * 0.4) * 1.2).toFixed(2)}deg`, opacity: o, borderRadius: 10, background: '#f1ede4', boxShadow: '0 40px 90px rgba(0,0,0,0.55)', padding: '60px 56px', boxSizing: 'border-box' }}>
      <div style={{ fontFamily: SLAB, fontWeight: 800, fontSize: 56, lineHeight: 1.08, color: '#1a1a1a', textAlign: 'center', clipPath: `inset(0 0 ${((1 - judul) * 100).toFixed(1)}% 0)` }}>
        Attention Is All
        <br />
        You Need
      </div>
      <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, opacity: maju(t, T.attention + 0.3, T.attention + 0.6) }}>
        {PENULIS.map((p) => (
          <span key={p} style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19, color: '#444', textAlign: 'center' }}>{p}</span>
        ))}
      </div>
      <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{ height: 12, borderRadius: 6, background: '#c9c2b4', width: `${88 - (i % 4) * 9}%`, opacity: maju(t, T.attention + 0.4 + i * 0.03, T.attention + 0.6 + i * 0.03) }} />
        ))}
      </div>
      {t > T.juni - 0.1 ? (
        <div style={{ position: 'absolute', right: -40, top: 40, rotate: '8deg', scale: String(pegas(t, T.juni - 0.1, fps, { damping: 10, stiffness: 200, mass: 0.6 })), padding: '6px 22px', borderRadius: 14, background: K.kuning, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 60, whiteSpace: 'nowrap' }}>
          Juni 2017
        </div>
      ) : null}
    </div>
  );
};

// S4–S6: satu kalimat 6 kata; dulu satu-satu, attention (busur), sekaligus → GPU
const KalimatContoh: React.FC<{ T: WT }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < S[3].mulai - 0.1 || t > T.keluarDunia + 0.5) return null;
  const o = maju(t, S[3].mulai + 0.2, S[3].mulai + 0.6) * (1 - maju(t, T.keluarDunia, T.keluarDunia + 0.4));
  const redup = redupDunia(T, t);
  // S4: penanda jalan satu-satu (lambat)
  const a3 = T.kata3 - 0.2;
  const b3 = S[4].mulai - 0.2;
  const idx = t >= a3 && t < b3 ? Math.min(5, Math.floor(((t - a3) / Math.max(0.6, b3 - a3)) * 6)) : -1;
  // S5: busur attention
  const busurOn = t > T.attn4 - 0.2 && t < S[5].mulai + 0.4;
  const oBusur = maju(t, T.attn4 - 0.2, T.attn4 + 0.1) * (1 - maju(t, S[5].mulai, S[5].mulai + 0.4));
  // S6: semua nyala sekaligus → GPU
  const semua = t > T.sekaligus - 0.15;
  const mGpu = pegas(t, T.gpu5 - 0.4, fps, { damping: 12, stiffness: 180, mass: 0.6 });
  const pasang: [number, number][] = [];
  for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) pasang.push([i, j]);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: o, filter: redup > 0 ? `brightness(${1 - redup})` : undefined }}>
      {busurOn ? (
        <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: oBusur }}>
          {pasang.map(([i, j], n) => {
            const x1 = X6[i];
            const x2 = X6[j];
            const tinggi = 40 + (x2 - x1) * 0.42;
            const utama = (i === 0 && j === 4);
            return (
              <GarisDigambar key={n} d={`M ${x1} ${KAL.y - 40} Q ${(x1 + x2) / 2} ${KAL.y - 40 - tinggi * 1.6} ${x2} ${KAL.y - 40}`} mulai={T.attn4 - 0.1 + n * 0.04} lama={0.3} warna={utama ? K.kuning : K.teal} tebal={utama ? 10 : 4} opacity={utama ? 1 : 0.6 + 0.3 * Math.sin(t * 4 + n)} />
            );
          })}
        </svg>
      ) : null}
      {busurOn && t > T.hubung ? (
        <div style={{ position: 'absolute', left: (X6[0] + X6[4]) / 2, top: KAL.y - 380, translate: '-50% 0', opacity: oBusur * maju(t, T.hubung, T.hubung + 0.2), fontFamily: TANGAN, fontWeight: 700, fontSize: 44, color: K.kuning, whiteSpace: 'nowrap' }}>
          "dia" langsung nyambung ke "kucing"
        </div>
      ) : null}
      {/* urutan panah S4 */}
      {idx >= 0 ? (
        <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {Array.from({ length: idx }, (_, i) => (
            <path key={i} d={pathPanah(X6[i] + LEBAR6[i] / 2 - 6, KAL.y + 66, X6[i + 1] - LEBAR6[i + 1] / 2 + 6, KAL.y + 66, -18, 16)} fill="none" stroke={K.merah} strokeWidth={5} strokeLinecap="round" />
          ))}
        </svg>
      ) : null}
      {KATA6.map((w, i) => {
        const masuk = pegas(t, S[3].mulai + 0.3 + i * 0.06, fps, { damping: 12, stiffness: 200, mass: 0.6 });
        const aktif = idx === i;
        const selesai = idx > i;
        const nyala = semua || aktif;
        const naik = semua ? Math.sin(t * 6 + i) * 6 : 0;
        return (
          <div key={i} style={{ position: 'absolute', left: X6[i], top: KAL.y + naik, translate: '-50% -50%', scale: String(Math.max(0.001, masuk) * (aktif ? 1.12 : 1)), padding: '8px 16px', borderRadius: 14, background: nyala ? (semua ? K.teal : K.merah) : selesai ? '#2a3550' : 'rgba(7,12,24,0.95)', border: `4px solid ${nyala ? (semua ? K.teal : K.merah) : i === 4 || i === 0 ? K.kuning : K.garis}`, fontFamily: SAIRA, fontWeight: 800, fontSize: 48, color: nyala ? K.latar : K.tinta, whiteSpace: 'nowrap' }}>
            {w}
          </div>
        );
      })}
      {idx >= 0 ? (
        <div style={{ position: 'absolute', left: 540, top: KAL.y + 120, translate: '-50% 0', fontFamily: TANGAN, fontWeight: 700, fontSize: 44, color: K.merah, whiteSpace: 'nowrap' }}>satu per satu, berurutan</div>
      ) : null}
      {/* GPU */}
      {t > T.sekaligus - 0.2 ? (
        <>
          {Array.from({ length: 6 }, (_, i) =>
            [0, 1, 2].map((j) => {
              const f = (t * 1.3 + j / 3) % 1;
              const x = lerp(X6[i], GPU.x - 150 + i * 60, f);
              const y = lerp(KAL.y + 50, GPU.y - 90, f);
              return <div key={`${i}-${j}`} style={{ position: 'absolute', left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 5, background: K.teal, opacity: Math.sin(Math.PI * f) * maju(t, T.sekaligus, T.sekaligus + 0.3) }} />;
            }),
          )}
          <div style={{ position: 'absolute', left: GPU.x, top: GPU.y, translate: '-50% -50%', scale: String(Math.max(0.001, mGpu)) }}>
            <ChipGpu lebar={340} />
          </div>
        </>
      ) : null}
    </div>
  );
};

const ChipGpu: React.FC<{ lebar?: number; label?: string }> = ({ lebar = 300, label = 'GPU' }) => {
  const t = useDetik();
  const h = lebar * 0.55;
  return (
    <div style={{ position: 'relative', width: lebar, height: h, borderRadius: 16, background: '#0f1a33', border: `5px solid ${K.kuning}`, boxShadow: `0 0 30px ${K.kuning}44` }}>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} style={{ position: 'absolute', left: 14 + i * ((lebar - 40) / 8), bottom: -14, width: 10, height: 12, background: K.kuning }} />
      ))}
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 8 }, (_, c) => (
          <div key={`${r}-${c}`} style={{ position: 'absolute', left: 18 + c * ((lebar - 36) / 8), top: 16 + r * ((h - 70) / 4), width: (lebar - 36) / 8 - 6, height: (h - 70) / 4 - 6, borderRadius: 3, background: noise(`g${r}${c}`, t * 3) > 0 ? K.teal : '#23365c' }} />
        )),
      )}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 8, textAlign: 'center', fontFamily: SAIRA, fontWeight: 800, fontSize: lebar * 0.14, color: K.kuning }}>{label}</div>
    </div>
  );
};

// ===============================================================================================================
// HUD S7: 8 GPU + 3,5 hari + piala rekor
const Latih: React.FC<{ T: WT }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[6].mulai - 0.1 || t > S[7].mulai + 0.3) return null;
  const kel = S[7].mulai - 0.25;
  const hari = 3.5 * maju(t, T.tiga - 0.3, T.tiga + 0.9, EASE.kamera);
  return (
    <>
      <Muncul mulai={T.tiga - 0.2} keluar={kel} x={540} y={600} seed="hr">
        <Kartu warna={K.kuning} gaya={{ display: 'flex', alignItems: 'center', gap: 20, padding: '10px 30px' }}>
          <Ikon n="jam" warna={K.kuning} uk={70} />
          <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 90, color: K.kuning, fontVariantNumeric: 'tabular-nums' }}>{formatAngka(hari, 1)}</span>
          {besar('hari', K.tinta, 64)}
        </Kartu>
      </Muncul>
      {t > T.delapan6 - 0.2 ? (
        <div style={{ position: 'absolute', left: 540, top: 850, translate: '-50% -50%', display: 'grid', gridTemplateColumns: 'repeat(4, 200px)', gap: 18, opacity: 1 - maju(t, kel, kel + 0.2) }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={{ scale: String(pegas(t, T.delapan6 - 0.2 + i * 0.06, 30, { damping: 11, stiffness: 200, mass: 0.6 })) }}>
              <ChipGpu lebar={200} label={`GPU ${i + 1}`} />
            </div>
          ))}
        </div>
      ) : null}
      <Muncul mulai={T.rekor - 0.2} keluar={kel + 0.05} x={540} y={1110} seed="rk">
        <Kartu warna={K.teal} isi gaya={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 28px' }}>
          <svg width={64} height={64} viewBox="0 0 100 100">
            <path d="M 28 10 L 72 10 L 72 40 Q 72 62 50 62 Q 28 62 28 40 Z" fill={K.latar} />
            <path d="M 28 18 Q 8 18 10 34 Q 12 46 28 44 M 72 18 Q 92 18 90 34 Q 88 46 72 44" fill="none" stroke={K.latar} strokeWidth={7} />
            <rect x={44} y={62} width={12} height={16} fill={K.latar} />
            <rect x={30} y={78} width={40} height={12} rx={3} fill={K.latar} />
          </svg>
          {besar('rekor terjemahan', K.latar, 58)}
        </Kartu>
      </Muncul>
    </>
  );
};

// S8: 8 kartu nama penulis dikocok
const Penulis: React.FC<{ T: WT }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const posisi = useMemo(() => {
    const out: number[][] = [];
    for (let l = 0; l < 40; l++) {
      const arr = [0, 1, 2, 3, 4, 5, 6, 7];
      for (let i = 7; i > 0; i--) {
        const j = Math.floor(random(`ko${l}-${i}`) * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      out.push(arr);
    }
    return out;
  }, []);
  if (t < S[7].mulai - 0.1 || t > S[9].mulai + 0.3) return null;
  const kel = S[9].mulai - 0.25;
  const o = maju(t, S[7].mulai, S[7].mulai + 0.2) * (1 - maju(t, kel, kel + 0.25));
  // kocok: tiap 0,32 dtk posisi diacak (selama diacak..sama), terus diam di susunan terakhir
  const kocokA = T.diacak - 0.2;
  const kocokB = T.sama + 0.2;
  const langkah = Math.floor(Math.max(0, Math.min(t, kocokB) - kocokA) / 0.32);
  const susun = (l: number) => (l <= 0 ? [0, 1, 2, 3, 4, 5, 6, 7] : posisi[l % 40]);
  const fase = t < kocokA ? 0 : Math.min(1, ((Math.min(t, kocokB) - kocokA) % 0.32) / 0.22);
  const sekarang = susun(langkah);
  const sebelum = susun(langkah - 1);
  const xy = (slot: number) => ({ x: 290 + (slot % 2) * 500, y: 600 + Math.floor(slot / 2) * 140 });
  const jones = t > T.llion - 0.2;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: o }}>
      {PENULIS.map((p, i) => {
        const a = xy(sebelum.indexOf(i));
        const b = xy(sekarang.indexOf(i));
        const q = t < kocokA || t > kocokB ? 1 : EASE.kamera(fase);
        const x = lerp(a.x, b.x, q);
        const y = lerp(a.y, b.y, q);
        const sk = pegas(t, S[7].mulai + 0.05 + i * 0.05, fps, { damping: 12, stiffness: 200, mass: 0.6 });
        const sorotJ = jones && p === 'Jones';
        return (
          <div key={p} style={{ position: 'absolute', left: x, top: y, translate: '-50% -50%', scale: String(Math.max(0.001, sk) * (sorotJ ? 1.08 : 1)), width: 420, padding: '10px 20px', borderRadius: 16, background: sorotJ ? K.kuning : 'rgba(7,12,24,0.95)', border: `4px solid ${sorotJ ? K.kuning : K.teal}`, display: 'flex', alignItems: 'center', gap: 14, opacity: jones && !sorotJ ? 0.22 : 1 }}>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, color: sorotJ ? K.latar : K.abu }}>✱</span>
            <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 52, color: sorotJ ? K.latar : K.tinta }}>{sorotJ ? 'Llion Jones' : p}</span>
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 540, top: 1180, translate: '-50% 0', opacity: maju(t, T.sama - 0.2, T.sama + 0.1) * (1 - maju(t, T.llion - 0.3, T.llion)), padding: '6px 24px', borderRadius: 14, background: 'rgba(7,12,24,0.92)', fontFamily: MONO, fontWeight: 700, fontSize: 30, color: K.teal, whiteSpace: 'nowrap' }}>
        ✱ kontribusi sama · urutan diacak
      </div>
    </div>
  );
};

// S9: piringan The Beatles → judul makalah
const Beatles: React.FC<{ T: WT }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < T.beatles - 0.3 || t > S[9].mulai + 0.3) return null;
  const kel = S[9].mulai - 0.25;
  const putar = t * 120;
  const ganti = maju(t, T.all8 + 0.6, T.all8 + 1.0, EASE.kamera);
  return (
    <>
      <Muncul mulai={T.beatles - 0.25} keluar={kel} x={540} y={1175} seed="vn">
        <div style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '16px 28px', borderRadius: 24, background: 'rgba(7,12,24,0.95)', border: `4px solid ${K.kuning}` }}>
          <svg width={170} height={170} viewBox="-85 -85 170 170">
            <g transform={`rotate(${putar})`}>
              <circle r={82} fill="#0b0b0b" />
              {[70, 60, 50].map((r) => <circle key={r} r={r} fill="none" stroke="#2a2a2a" strokeWidth={2} />)}
              <circle r={30} fill={K.merah} />
              <circle r={4} fill="#0b0b0b" />
              <rect x={-3} y={-28} width={6} height={14} fill={K.kuning} />
            </g>
          </svg>
          <div>
            {kecil('lagu The Beatles', K.kuning, 28)}
            {besar('All You Need', K.tinta, 60)}
            <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 60, color: K.tinta, lineHeight: 1 }}>
              Is <span style={{ color: lerp(0, 1, ganti) > 0.5 ? K.teal : K.merah }}>{ganti > 0.5 ? 'Attention' : 'Love'}</span>
            </div>
          </div>
        </div>
      </Muncul>
    </>
  );
};

// S10–S11: makalah → OpenAI → GPT pertama → laporan GPT-4
const OpenAI: React.FC<{ T: WT }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[9].mulai - 0.1 || t > T.keluarDunia + 0.3) return null;
  const kel = T.keluarDunia - 0.1;
  const geser = maju(t, S[10].mulai - 0.2, S[10].mulai + 0.4, EASE.kamera);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, translate: `0 ${(-geser * 200).toFixed(1)}px` }}>
      <Muncul mulai={S[9].mulai + 0.05} keluar={kel} x={540} y={620} seed="mk">
        <Kartu warna={K.tinta} gaya={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 26px' }}>
          <Ikon n="dokumen" warna={K.tinta} uk={60} />
          {besar('Attention Is All You Need', K.tinta, 46)}
        </Kartu>
      </Muncul>
      <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
        <GarisDigambar d={pathPanah(540, 690, 540, 790, 0, 26)} mulai={T.openai - 0.1} lama={0.25} warna={K.kuning} tebal={9} hapus={kel} />
      </svg>
      <Muncul mulai={T.openai} keluar={kel + 0.04} x={540} y={880} seed="oa">
        <Kartu warna={K.teal} gaya={{ display: 'flex', alignItems: 'center', gap: 22, padding: '12px 30px' }}>
          {besar('OpenAI', K.tinta, 66)}
          <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 60, color: K.abu }}>→</span>
          {t > T.gptPertama - 0.15 ? (
            <div style={{ padding: '2px 18px', borderRadius: 12, background: K.teal }}>{besar('GPT pertama', K.latar, 60)}</div>
          ) : null}
        </Kartu>
      </Muncul>
      {t > S[10].mulai - 0.1 ? (
        <>
          <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
            <GarisDigambar d={pathPanah(540, 960, 540, 1060, 0, 26)} mulai={S[10].mulai} lama={0.25} warna={K.kuning} tebal={9} hapus={kel} />
          </svg>
          <Muncul mulai={T.laporan - 0.05} keluar={kel + 0.08} x={540} y={1210} seed="g4">
            <div style={{ width: 760, padding: '22px 30px', borderRadius: 14, background: '#f1ede4', color: '#1a1a1a', boxShadow: '0 30px 70px rgba(0,0,0,0.5)', rotate: '-1.5deg' }}>
              <div style={{ fontFamily: SLAB, fontWeight: 800, fontSize: 46 }}>GPT-4 Technical Report</div>
              <div style={{ marginTop: 10, fontFamily: SLAB, fontWeight: 600, fontSize: 34, color: '#333' }}>
                “GPT-4 is a{' '}
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  <span style={{ position: 'absolute', left: -4, right: -4, bottom: 2, height: '0.9em', background: K.kuning, transformOrigin: 'left', transform: `scaleX(${maju(t, T.berbasis - 0.1, T.berbasis + 0.2).toFixed(3)})`, borderRadius: 4 }} />
                  <span style={{ position: 'relative' }}>Transformer-based</span>
                </span>{' '}
                model…”
              </div>
            </div>
          </Muncul>
        </>
      ) : null}
    </div>
  );
};

const Hud: React.FC<{ T: WT }> = ({ T }) => {
  const S = T.s;
  return (
    <HudTeks
      T={T}
      sumber={() => 'Sumber: Vaswani dkk. (arXiv 1706.03762) · WIRED · OpenAI'}
      teks={[
        { label: ['ARTI', 'HURUF', 'T'], judul: [{ t: 'T', mulai: T.hT, warna: K.kuning }, { t: '=', mulai: T.trans0 - 0.2, warna: K.abu }, { t: 'Transformer', mulai: T.trans0, isi: sorot('Transformer', T.trans0 + 0.15) }], jMulai: T.hT },
        { label: ['GPT', 'SINGKATAN', 'DARI'], judul: [{ t: 'Generative', mulai: T.gen }, { t: 'Pre-trained', mulai: T.pre }, { t: 'Transformer', mulai: T.trans1, warna: K.kuning }], ukuran: 76 },
        { label: ['JUDUL', 'MAKALAHNYA'], judul: [{ t: '"Attention', mulai: T.attention }, { t: 'Is', mulai: T.attention + 0.15 }, { t: 'All', mulai: T.attention + 0.3 }, { t: 'You', mulai: T.attention + 0.45 }, { t: 'Need"', mulai: T.attention + 0.6 }, { t: '·', mulai: T.juni - 0.1, warna: K.abu }, { t: '2017', mulai: T.juni, warna: K.kuning }], ukuran: 76 },
        { label: ['SEBELUMNYA'], judul: [{ t: 'dulu:', mulai: S[3].mulai + 0.3, warna: K.abu }, { t: 'kata', mulai: T.kata3, warna: K.merah }, { t: 'demi', mulai: T.kata3 + 0.2, warna: K.merah }, { t: 'kata', mulai: T.kata3 + 0.4, warna: K.merah }] },
        { label: ['MEKANISME'], judul: [{ t: 'attention:', mulai: T.attn4, isi: sorot('attention:', T.attn4 + 0.15, K.teal) }, { t: 'semua', mulai: T.hubung }, { t: 'kata', mulai: T.hubung + 0.15 }, { t: 'nyambung', mulai: T.hubung + 0.3 }], ukuran: 84 },
        { label: ['LEBIH', 'CEPAT', 'DILATIH'], judul: [{ t: 'diolah', mulai: T.sekaligus - 0.3 }, { t: 'sekaligus', mulai: T.sekaligus, warna: K.teal }, { t: '·', mulai: T.gpu5 - 0.1, warna: K.abu }, { t: 'GPU', mulai: T.gpu5, warna: K.kuning }] },
        { label: ['MODEL', 'TERBESARNYA'], judul: [{ t: '3,5', mulai: T.tiga, warna: K.kuning }, { t: 'hari', mulai: T.tiga + 0.2 }, { t: '·', mulai: T.delapan6 - 0.1, warna: K.abu }, { t: '8', mulai: T.delapan6, warna: K.kuning }, { t: 'GPU', mulai: T.delapan6 + 0.15 }, { t: '·', mulai: T.rekor - 0.1, warna: K.abu }, { t: 'rekor', mulai: T.rekor, warna: K.teal }], ukuran: 84 },
        { label: ['8', 'PENULIS'], judul: [{ t: 'urutan', mulai: T.urutan }, { t: 'nama:', mulai: T.urutan + 0.2 }, { t: 'acak', mulai: T.diacak, isi: sorot('acak', T.diacak + 0.15) }] },
        { label: ['ASAL', 'JUDUL'], judul: [{ t: 'The', mulai: T.beatles - 0.1, warna: K.abu }, { t: 'Beatles:', mulai: T.beatles, warna: K.abu }, { t: 'All', mulai: T.all8 }, { t: 'You', mulai: T.all8 + 0.15 }, { t: 'Need', mulai: T.all8 + 0.3 }, { t: 'Is', mulai: T.all8 + 0.45 }, { t: 'Love', mulai: T.all8 + 0.6, warna: K.merah }], ukuran: 76, jMulai: T.beatles - 0.1 },
        { label: ['GAK', 'LAMA', 'KEMUDIAN'], judul: [{ t: 'OpenAI', mulai: T.openai }, { t: '→', mulai: T.gptPertama - 0.2, warna: K.abu }, { t: 'GPT', mulai: T.gptPertama, warna: K.teal }, { t: 'pertama', mulai: T.gptPertama + 0.2, warna: K.teal }] },
        { label: ['LAPORAN', 'GPT-4'], judul: [{ t: 'berbasis', mulai: T.berbasis }, { t: 'Transformer', mulai: T.berbasis + 0.25, isi: sorot('Transformer', T.berbasis + 0.4) }] },
        { label: ['BIAR', 'INGET', 'ARTI', 'GPT'], judul: [{ t: 'simpan', mulai: T.simpan + 0.05, warna: K.kuning }, { t: '&', mulai: T.follow - 0.25, warna: K.abu }, { t: 'follow', mulai: T.follow, warna: K.teal }], jMulai: T.simpan },
      ]}
    />
  );
};

function daftarSfx(T: WT) {
  const S = T.s;
  const huruf = HURUF.map((_, i) => bunyi('tik', 0.08 + i * 0.06, 0.14));
  const orang = Array.from({ length: 8 }, (_, i) => bunyi('tik', T.delapan - 0.2 + i * 0.05, 0.1));
  const seq = Array.from({ length: 6 }, (_, i) => bunyi('klik', T.kata3 - 0.2 + i * ((Math.max(0.6, S[4].mulai - T.kata3)) / 6), 0.18));
  const busur = Array.from({ length: 8 }, (_, i) => bunyi('tik', T.attn4 - 0.1 + i * 0.07, 0.1));
  const gpu = Array.from({ length: 8 }, (_, i) => bunyi('tik', T.delapan6 - 0.2 + i * 0.06, 0.12));
  const kocok = Array.from({ length: Math.max(1, Math.min(8, Math.floor((T.sama + 0.2 - T.diacak + 0.2) / 0.32))) }, (_, i) => bunyi('swish', T.diacak - 0.2 + i * 0.32, 0.12));
  return [
    ...huruf,
    bunyi('pop', T.hT, 0.3),
    bunyi('swish', T.hT + 0.05, 0.25),
    bunyi('hantam', T.trans0 + 0.03, 0.4),
    ...orang,
    bunyi('pop', T.n2017, 0.25),
    bunyi('whooshA', T.gen - 0.4, 0.3),
    bunyi('pop', T.gen, 0.25),
    bunyi('pop', T.pre, 0.25),
    bunyi('pop', T.trans1, 0.25),
    bunyi('whooshTurun', S[2].mulai + 0.1, 0.35),
    bunyi('jepret', T.juni, 0.3),
    bunyi('whooshTurun', S[3].mulai + 0.1, 0.35),
    ...seq,
    bunyi('riser', T.attn4 - 0.3, 0.2),
    ...busur,
    bunyi('kunci', T.hubung, 0.3),
    bunyi('whooshB', S[5].mulai, 0.3),
    bunyi('sapuHit', T.sekaligus - 0.1, 0.3),
    bunyi('pop', T.gpu5 - 0.35, 0.3),
    bunyi('whooshA', S[6].mulai, 0.3),
    bunyi('pop', T.tiga, 0.3),
    ...gpu,
    bunyi('kunci', T.rekor, 0.35),
    bunyi('whooshPop', S[7].mulai, 0.3),
    ...kocok,
    bunyi('pop', T.sama, 0.25),
    bunyi('pop', T.llion, 0.3),
    bunyi('whooshLembut', T.beatles - 0.2, 0.3),
    bunyi('glitch', T.all8 + 0.7, 0.2),
    bunyi('whooshA', S[9].mulai, 0.3),
    bunyi('pop', T.openai, 0.3),
    bunyi('kunci', T.gptPertama, 0.3),
    bunyi('whooshB', S[10].mulai, 0.3),
    bunyi('sapuHit', T.berbasis, 0.3),
    bunyi('whooshTerang', T.keluarDunia + 0.1, 0.3),
    bunyi('pop', T.simpan + 0.15, 0.35),
    bunyi('klik', T.simpan + 0.65, 0.4),
    bunyi('pop', T.follow - 0.2, 0.3),
    bunyi('klik', T.follow + 0.3, 0.4),
    bunyi('whooshLembut', T.keluarCta + 0.05, 0.3),
  ];
}

// ===============================================================================================================
// SAMPUL: "Huruf T di ChatGPT artinya…" + ChatGPT dengan T dilingkari → Transformer
export const ContohTransformerSampul: React.FC = () => {
  const T = waktuTransformer([], undefined, 59);
  const kam = { x: 540, y: 960, z: 1, vx: 0, vy: 0, lebar: 1080, tinggi: 1920 };
  return (
    <AbsoluteFill style={{ background: K.latar, overflow: 'hidden' }}>
      <LatarSeri kam={kam} />
      <div style={{ position: 'absolute', left: 0, top: 260, width: 1080, height: 1920 }}>
        <TulisanChatGPT T={T} sampul />
      </div>
      <div style={{ position: 'absolute', left: 90, top: 196, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 10, height: 44, borderRadius: 5, background: K.teal }} />
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: K.abu }}>ARTI HURUF T</div>
      </div>
      <div style={{ position: 'absolute', left: 90, top: 262, width: 780, fontFamily: SAIRA, fontWeight: 800, fontSize: 118, lineHeight: 1.04, color: K.tinta }}>
        <div>Huruf T di ChatGPT</div>
        <div>
          itu <span style={{ display: 'inline-block', background: K.kuning, color: K.latar, padding: '0 0.1em', borderRadius: 12, lineHeight: 0.98 }}>apa?</span>
        </div>
      </div>
      <Grain kuat={0.06} garisScan={0} vinyet={0.45} warnaVinyet="2,5,14" />
    </AbsoluteFill>
  );
};
