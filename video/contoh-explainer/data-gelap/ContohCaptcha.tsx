// Frame hero (pembuka, tengah, puncak): 15, 860, 1434.
// contoh video explainer A8 (akun generik, konten contoh): "Dulu tiap ngisi reCAPTCHA, kamu ikut ngetik ulang buku lama".
// SATU DUNIA (kolom): kotak reCAPTCHA lama (2 kata bengkok + kolom ketik) di atas, halaman buku lama di bawahnya. Hook: kata
// diketik → jatuh ke celah halaman buku → plakat von Ahn · CMU · Science 2008 → kamera turun: lampu pemindai nyapu halaman,
// kata pudar → kotak OCR "???" ✗ → balik ke kotak: kata 1 = kontrol (jawaban diketahui), kata 2 = misteri (dari buku) → kontrol
// diketik benar ✓ → misteri distempel "dipercaya" → batang 99,1% vs OCR 83,5% (arsip NYT) → 440 juta kata + tumpukan buku 17.600
// → 2009 dibeli Google → 2014: AI baca 99,8% → kotak berubah jadi kotak centang → CTA → latar kosong (loop).
// Fakta: von Ahn dkk., Science 321 (2008) · Google Blog (Sep 2009) · Google Online Security Blog (Des 2014). Kata contoh = ilustrasi.
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { Bunyi, Dunia, EASE, formatAngka, GarisDigambar, Grain, maju, noise, pathPanah, pegas, Stempel, Subtitle, useDetik, type KunciKamera, type Kata } from "../../src/gerak";
import { MONO, SAIRA, SLAB, TANGAN } from "../../src/gerak/font";
import { bunyi, K } from "./raja/gaya";
import type { Kalimat } from "./raja/waktuRaja";
import { CtaSimpanFollow, kameraSeri, LatarSeri, lerp, PeneduhAtas, sorot } from "../../src/gerak/seri/data-gelap/seri";
import { Batang, besar, Cincin, HudTeks, Ikon, Kartu, kecil, Muncul, waktuDasar } from "../../src/gerak/seri/data-gelap/alat19";

export type DataCaptcha = { durasi: number; kata: Kata[]; kalimat?: Kalimat[] };

const KT = { x: 540, y: 980, w: 820, h: 470 }; // kotak reCAPTCHA
const BK = { x: 540, y: 2000, w: 760, h: 900 }; // halaman buku
const KONTROL = 'overlooks';
const MISTERI = 'inquiry';

function waktuCaptcha(d: Kata[], kal: Kalimat[] | undefined, total: number) {
  const W = waktuDasar(d, kal, total, 10);
  const { s, k } = W;
  const ngisi = k('ngisi', s[0].mulai, s[0].mulai + 0.6);
  const ngetik0 = k('ngetik', ngisi, ngisi + 1.2);
  const buku0 = k('buku', ngetik0, ngetik0 + 0.8);
  const koran0 = k('koran', buku0, s[0].akhir - 0.6);
  const luis = k('luis', s[1].mulai, s[1].mulai + 1.0);
  const carnegie = k('carnegie', luis, luis + 1.0);
  const science = k('science', carnegie, carnegie + 2.0);
  const n2008 = k('2008', science, s[1].akhir - 0.4);
  const dipindai = k('dipindai', s[2].mulai, s[2].mulai + 1.4);
  const ocr = k('ocr', dipindai, dipindai + 2.0);
  const gagal2 = k('gagal', ocr, ocr + 0.6);
  const pudar = k('pudar', gagal2, s[2].akhir - 0.4);
  const dua = k('dua', s[3].mulai, s[3].mulai + 1.0);
  const diketahui = k('diketahui', dua, dua + 1.2);
  const gagal3 = k('gagal', diketahui, s[3].akhir - 0.8);
  const diketik4 = k('diketik', s[4].mulai, s[4].mulai + 1.2);
  const benar4 = k('benar', diketik4, diketik4 + 0.4);
  const dipercaya = k('dipercaya', benar4, s[4].akhir - 0.5);
  const nyt = k('new', s[5].mulai, s[5].mulai + 1.0);
  const n991 = k('99', nyt, nyt + 1.4);
  const n835 = k('83', n991, s[5].akhir - 0.8);
  const n440 = k('440', s[6].mulai, s[6].mulai + 1.0);
  const n17600 = k('17600', n440, s[6].akhir - 0.8);
  const n2009 = k('2009', s[7].mulai, s[7].mulai + 0.3);
  const beli = k('beli', n2009, n2009 + 0.8);
  const books = k('books', beli, s[7].akhir - 1.0);
  const n2014 = k('2014', s[8].mulai, s[8].mulai + 0.3);
  const bengkok = k('bengkok', n2014, n2014 + 2.0);
  const n998 = k('99', bengkok, bengkok + 1.2);
  const centang = k('centang', n998, s[8].akhir - 0.4);
  return {
    ...W, ngisi, ngetik0, buku0, koran0, luis, carnegie, science, n2008, dipindai, ocr, gagal2, pudar, dua, diketahui, gagal3, diketik4, benar4,
    dipercaya, nyt, n991, n835, n440, n17600, n2009, beli, books, n2014, bengkok, n998, centang,
  };
}
type WC = ReturnType<typeof waktuCaptcha>;

// ===============================================================================================================
export const ContohCaptcha: React.FC<DataCaptcha> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuCaptcha(d.kata, d.kalimat, total), [d.kata, d.kalimat, total]);
  const S = T.s;
  const pelan = Easing.linear;
  const kunci: KunciKamera[] = [
    { t: 0, x: 540, y: 960, z: 1.0 },
    { t: 0.6, x: 540, y: 1000, z: 1.06 },
    { t: T.buku0 - 0.2, x: 544, y: 1004, z: 1.1, ease: pelan },
    { t: T.buku0 + 0.7, x: 540, y: 2010, z: 0.9 },
    { t: S[1].mulai - 0.1, x: 536, y: 2016, z: 0.93, ease: pelan },
    { t: S[1].mulai + 0.5, x: 540, y: 2020, z: 0.86 },
    { t: S[2].mulai - 0.1, x: 544, y: 2026, z: 0.88, ease: pelan },
    { t: S[2].mulai + 0.6, x: 540, y: 1990, z: 1.0 },
    { t: S[3].mulai - 0.1, x: 546, y: 1986, z: 1.05, ease: pelan },
    { t: S[3].mulai + 0.6, x: 540, y: 1020, z: 1.0 },
    { t: S[5].mulai - 0.1, x: 544, y: 1016, z: 1.06, ease: pelan },
    { t: S[5].mulai + 0.5, x: 540, y: 1100, z: 0.9 },
    { t: S[8].mulai - 0.1, x: 536, y: 1096, z: 0.93, ease: pelan },
    { t: S[8].mulai + 0.6, x: 540, y: 1000, z: 1.0 },
    { t: T.keluarDunia, x: 546, y: 996, z: 1.05, ease: pelan },
    { t: T.simpan + 0.8, x: 540, y: 960, z: 1.0 },
    { t: T.loop, x: 540, y: 960, z: 1.02, ease: pelan },
    { t: total, x: 540, y: 960, z: 1.0 },
  ];
  const kam = kameraSeri(kunci, t, fps, total, [
    { t: T.dipercaya + 0.08, kuat: 8, lama: 0.14 },
    { t: T.gagal2 + 0.1, kuat: 6, lama: 0.12 },
  ]);
  return (
    <AbsoluteFill style={{ background: K.latar, color: K.tinta, overflow: 'hidden', fontFamily: SAIRA }}>
      <LatarSeri kam={kam} />
      <svg width={0} height={0} style={{ position: 'absolute' }}>
        <defs>
          <filter id="bengkok" x="-10%" y="-30%" width="120%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.05" numOctaves={2} seed={4} />
            <feDisplacementMap in="SourceGraphic" scale={16} />
          </filter>
        </defs>
      </svg>
      <Dunia kamera={kam} tinggiDunia={2500} lebarDunia={1300} blurGerak={1300}>
        <Buku T={T} />
        <KotakCaptcha T={T} />
      </Dunia>
      <PeneduhAtas />
      <Plakat T={T} />
      <Akurasi T={T} />
      <Tumpukan T={T} />
      <Google T={T} />
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
const redupDunia = (T: WC, t: number) => {
  const S = T.s;
  const r = (a: number, b: number, kuat: number) => kuat * maju(t, a, a + 0.3) * (1 - maju(t, b - 0.2, b + 0.1));
  return Math.max(r(S[1].mulai, S[2].mulai, 0.72), r(S[5].mulai, S[8].mulai, 0.75));
};

const KataBengkok: React.FC<{ teks: string; ukuran?: number; warna?: string; pudar?: number }> = ({ teks, ukuran = 76, warna = '#111', pudar = 0 }) => (
  <span style={{ display: 'inline-block', fontFamily: SLAB, fontWeight: 800, fontSize: ukuran, color: warna, filter: 'url(#bengkok)', opacity: 1 - pudar * 0.75, fontStyle: 'italic', letterSpacing: '-0.02em', padding: '0 8px' }}>{teks}</span>
);

export const KotakCaptcha: React.FC<{ T: WC; sampul?: boolean }> = ({ T, sampul }) => {
  const t0 = useDetik();
  const t = sampul ? 1.0 : t0;
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < 0.04) return null;
  const masuk = sampul ? 1 : pegas(t, 0.05, fps, { damping: 14, stiffness: 170, mass: 0.7 });
  const keluar = sampul ? 0 : maju(t, T.keluarDunia, T.keluarDunia + 0.45, EASE.keluar);
  const redup = sampul ? 0 : redupDunia(T, t);
  // ketikan: hook (0,4 → buku0), S5 (diketik4 → dipercaya)
  const ketikan = (a: number, b: number) => {
    const teks = `${KONTROL} ${MISTERI}`;
    return teks.slice(0, Math.round(teks.length * maju(t, a, b, EASE.linear)));
  };
  const hookA = 0.4;
  const hookB = Math.max(hookA + 0.8, T.buku0 - 0.25);
  const s5 = t > S[4].mulai - 0.1;
  const isian = sampul ? `${KONTROL} ${MISTERI}` : s5 ? ketikan(T.diketik4 - 0.3, T.dipercaya - 0.3) : t < S[1].mulai ? ketikan(hookA, hookB) : '';
  const tagOn = !sampul && t > T.dua - 0.2 && t < S[5].mulai + 0.2;
  const benar = !sampul && t > T.benar4 - 0.05 && t < S[5].mulai + 0.2;
  const centang = !sampul && t > T.centang - 0.4;
  const ubah = sampul ? 0 : maju(t, T.centang - 0.4, T.centang + 0.1, EASE.kamera);
  const cek = maju(t, T.centang + 0.2, T.centang + 0.45);
  const napas = 1 + 0.006 * Math.sin(t * 1.6);
  const tinggi = lerp(KT.h, 170, ubah);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: (1 - keluar) * Math.min(1, masuk * 2), filter: redup > 0 ? `brightness(${1 - redup})` : undefined }}>
      <div style={{ position: 'absolute', left: KT.x - KT.w / 2, top: KT.y - tinggi / 2, width: KT.w, height: tinggi, scale: String(lerp(0.9, 1, Math.min(1, masuk)) * napas), borderRadius: 14, background: '#f6f6f4', border: '3px solid #d0d0cc', boxShadow: '0 40px 90px rgba(0,0,0,0.55)', overflow: 'hidden' }}>
        {ubah < 0.5 ? (
          <div style={{ opacity: 1 - ubah * 2 }}>
            {/* gambar 2 kata */}
            <div style={{ margin: '26px 26px 0', height: 170, borderRadius: 8, background: 'linear-gradient(180deg, #ffffff, #e9e9e4)', border: '2px solid #c9c9c4', display: 'flex', alignItems: 'center', justifyContent: 'space-around', position: 'relative' }}>
              <KataBengkok teks={KONTROL} />
              <KataBengkok teks={MISTERI} pudar={0.15} />
              <div style={{ position: 'absolute', left: 30, right: 30, top: 88, height: 3, background: '#555', transform: 'rotate(-3deg)', opacity: 0.6 }} />
            </div>
            <div style={{ margin: '18px 26px 0', fontFamily: MONO, fontWeight: 700, fontSize: 26, color: '#555' }}>Ketik dua kata di atas:</div>
            <div style={{ margin: '10px 26px 0', height: 82, borderRadius: 8, background: '#fff', border: `3px solid ${benar ? K.tealTua : '#9a9a96'}`, display: 'flex', alignItems: 'center', padding: '0 20px', fontFamily: MONO, fontWeight: 700, fontSize: 42, color: '#111' }}>
              {isian}
              <span style={{ width: 4, height: 46, marginLeft: 4, background: '#111', opacity: Math.floor(t * 2.4) % 2 ? 0 : 1 }} />
            </div>
            <div style={{ position: 'absolute', right: 24, bottom: 18, fontFamily: SAIRA, fontWeight: 800, fontSize: 34, color: '#7a7a76' }}>reCAPTCHA</div>
          </div>
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 26, padding: '0 40px', opacity: (ubah - 0.5) * 2 }}>
            <div style={{ width: 80, height: 80, borderRadius: 8, border: '4px solid #9a9a96', background: '#fff', position: 'relative' }}>
              <svg width={80} height={80} viewBox="0 0 80 80" style={{ position: 'absolute', left: -4, top: -4 }}>
                {cek > 0 ? <path d="M 16 42 L 34 60 L 66 20" fill="none" stroke="#1a9e5a" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="90" strokeDashoffset={90 * (1 - cek)} /> : null}
              </svg>
            </div>
            <span style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 58, color: '#222' }}>Saya bukan robot</span>
            <span style={{ marginLeft: 'auto', fontFamily: SAIRA, fontWeight: 800, fontSize: 30, color: '#7a7a76' }}>reCAPTCHA</span>
          </div>
        )}
      </div>
      {/* tag kontrol / misteri (S4–S5) */}
      {tagOn && ubah < 0.1 ? (
        <>
          <Tag x={KT.x - 200} y={KT.y - KT.h / 2 - 50} m={T.diketahui - 0.2} warna={K.teal} teks={benar ? 'kontrol ✓' : 'kontrol: jawaban diketahui'} />
          <Tag x={KT.x + 200} y={KT.y - KT.h / 2 - 50} m={T.gagal3 - 0.2} warna={K.kuning} teks="misteri: dari buku ?" />
          {t > T.dipercaya - 0.1 ? (
            <div style={{ position: 'absolute', left: KT.x + 190, top: KT.y + KT.h / 2 - 70, translate: '-50% 0' }}>
              <Stempel mulai={T.dipercaya - 0.05} rot={-6} gaya={{ padding: '4px 26px', borderRadius: 14, border: `7px solid ${K.kuning}`, background: 'rgba(7,12,24,0.9)', fontFamily: SAIRA, fontWeight: 800, fontSize: 70, color: K.kuning, whiteSpace: 'nowrap' }}>
                ikut dipercaya
              </Stempel>
            </div>
          ) : null}
        </>
      ) : null}
      {centang ? (
        <div style={{ position: 'absolute', left: KT.x, top: KT.y + 150, translate: '-50% 0', opacity: maju(t, T.centang, T.centang + 0.2), fontFamily: TANGAN, fontWeight: 700, fontSize: 48, color: K.teal, whiteSpace: 'nowrap' }}>
          ganti jadi kotak centang
        </div>
      ) : null}
    </div>
  );
};

const Tag: React.FC<{ x: number; y: number; m: number; warna: string; teks: string }> = ({ x, y, m, warna, teks }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  if (t < m) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, translate: '-50% -50%', scale: String(pegas(t, m, fps, { damping: 11, stiffness: 200, mass: 0.6 })), padding: '6px 20px', borderRadius: 14, background: warna, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 40, whiteSpace: 'nowrap' }}>
      {teks}
    </div>
  );
};

// halaman buku lama + kata jatuh (hook) + lampu pemindai & OCR gagal (S3)
const Buku: React.FC<{ T: WC }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  if (t < 0.04) return null;
  const keluar = maju(t, T.keluarDunia, T.keluarDunia + 0.45, EASE.keluar);
  const redup = redupDunia(T, t);
  const masuk = pegas(t, 0.15, fps, { damping: 14, stiffness: 150, mass: 0.7 });
  const jatuh = maju(t, T.buku0 - 0.3, T.buku0 + 0.5, EASE.jatuh);
  const terisi = jatuh >= 1;
  const sapu = maju(t, T.dipindai - 0.3, T.ocr + 0.4, EASE.linear);
  const sapuOn = t > T.dipindai - 0.3 && t < S[3].mulai;
  const slot = { x: BK.x + 90, y: BK.y - 60 };
  const ocrM = pegas(t, T.ocr - 0.1, fps, { damping: 11, stiffness: 190, mass: 0.6 });
  const oOcr = maju(t, T.ocr - 0.15, T.ocr) * (1 - maju(t, S[3].mulai - 0.2, S[3].mulai + 0.1));
  const baris = 16;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - keluar, filter: redup > 0 ? `brightness(${1 - redup})` : undefined }}>
      <div style={{ position: 'absolute', left: BK.x - BK.w / 2, top: BK.y - BK.h / 2, width: BK.w, height: BK.h, scale: String(Math.max(0.001, masuk)), rotate: `${(1.5 + noise('bk', t * 0.3)).toFixed(2)}deg`, borderRadius: 8, background: 'linear-gradient(160deg, #e8d9b5, #cdb98c)', boxShadow: '0 40px 90px rgba(0,0,0,0.55)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.25), rgba(120,80,30,0.25) 90%)' }} />
        <div style={{ position: 'absolute', left: 60, top: 50, fontFamily: SLAB, fontWeight: 800, fontSize: 44, color: '#3a2a12' }}>CHAPTER IV.</div>
        {Array.from({ length: baris }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: 60, top: 140 + i * 44, width: BK.w - 120 - (i % 5 === 4 ? 160 : 0), height: 14, borderRadius: 7, background: '#6b5a3c', opacity: 0.55 + 0.25 * random(`br${i}`) }} />
        ))}
        {/* celah kata (di halaman) */}
        <div style={{ position: 'absolute', left: slot.x - (BK.x - BK.w / 2) - 120, top: slot.y - (BK.y - BK.h / 2) - 34, width: 240, height: 68, borderRadius: 8, background: terisi ? 'rgba(61,219,200,0.35)' : '#e8d9b5', border: `3px dashed ${terisi ? K.tealTua : '#8a7652'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SLAB, fontWeight: 800, fontSize: 46, color: '#3a2a12' }}>
          {terisi ? MISTERI : <span style={{ opacity: 0.25 }}>{MISTERI}</span>}
        </div>
        {/* lampu pemindai */}
        {sapuOn ? <div style={{ position: 'absolute', left: 0, right: 0, top: lerp(-40, BK.h, sapu), height: 46, background: 'linear-gradient(180deg, rgba(61,219,200,0), rgba(61,219,200,0.75), rgba(61,219,200,0))' }} /> : null}
      </div>
      {/* kata jatuh dari kotak ke buku (hook) */}
      {jatuh > 0 && jatuh < 1 ? (
        <div style={{ position: 'absolute', left: lerp(KT.x + 160, slot.x, jatuh), top: lerp(KT.y + 120, slot.y, jatuh), translate: '-50% -50%', rotate: `${(jatuh * 20).toFixed(1)}deg`, padding: '2px 16px', borderRadius: 10, background: K.teal, fontFamily: SLAB, fontWeight: 800, fontSize: 52, color: K.latar }}>
          {MISTERI}
        </div>
      ) : null}
      {terisi && t < S[1].mulai + 0.2 ? (
        <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {[0, 0.15].map((dd, j) => {
            const q = maju(t, T.buku0 + 0.5 + dd, T.buku0 + 1.1 + dd, EASE.linear);
            return q > 0 && q < 1 ? <circle key={j} cx={slot.x} cy={slot.y} r={60 + 120 * q} fill="none" stroke={K.teal} strokeWidth={8 * (1 - q) + 1} opacity={1 - q} /> : null;
          })}
        </svg>
      ) : null}
      {/* OCR gagal */}
      {oOcr > 0 ? (
        <div style={{ position: 'absolute', left: BK.x, top: BK.y + 210, translate: '-50% -50%', scale: String(Math.max(0.001, ocrM)), opacity: oOcr, display: 'flex', alignItems: 'center', gap: 18, padding: '12px 26px', borderRadius: 18, background: 'rgba(7,12,24,0.95)', border: `5px solid ${K.merah}`, whiteSpace: 'nowrap' }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: K.abu }}>OCR:</div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 56, color: K.merah }}>{t > T.gagal2 - 0.1 ? 'inq??y' : '…'}</div>
          {t > T.gagal2 ? <Ikon n="silang" warna={K.merah} uk={56} tebal={10} /> : null}
        </div>
      ) : null}
      {t > T.pudar - 0.1 && t < S[3].mulai ? (
        <div style={{ position: 'absolute', left: slot.x, top: slot.y - 80, translate: '-50% -50%', opacity: maju(t, T.pudar - 0.1, T.pudar + 0.1), fontFamily: TANGAN, fontWeight: 700, fontSize: 46, color: K.kuning, whiteSpace: 'nowrap', padding: '0 16px', borderRadius: 12, background: 'rgba(7,12,24,0.9)' }}>tintanya pudar</div>
      ) : null}
    </div>
  );
};

// ===============================================================================================================
// HUD
const Plakat: React.FC<{ T: WC }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const kel = S[2].mulai - 0.25;
  return (
    <>
      <Muncul mulai={T.luis - 0.1} keluar={kel} x={540} y={640} seed="lv">
        <Kartu warna={K.teal} gaya={{ display: 'flex', alignItems: 'center', gap: 18, padding: '12px 30px' }}>
          <Ikon n="orang" warna={K.teal} uk={64} />
          <div>
            {kecil('tim', K.abu, 24)}
            {besar('Luis von Ahn', K.tinta, 60)}
          </div>
        </Kartu>
      </Muncul>
      <Muncul mulai={T.carnegie - 0.1} keluar={kel + 0.04} x={540} y={850} seed="cm">
        <Kartu warna={K.merah} gaya={{ display: 'flex', alignItems: 'center', gap: 18, padding: '12px 30px' }}>
          <svg width={64} height={74} viewBox="0 0 70 80">
            <path d="M 35 4 L 66 14 L 66 40 Q 66 66 35 77 Q 4 66 4 40 L 4 14 Z" fill={K.merah} />
          </svg>
          {besar('Carnegie Mellon University', K.tinta, 52)}
        </Kartu>
      </Muncul>
      <Muncul mulai={T.science - 0.1} keluar={kel + 0.08} x={540} y={1060} seed="sc">
        <Kartu warna={K.kuning} gaya={{ display: 'flex', alignItems: 'center', gap: 18, padding: '12px 30px' }}>
          <Ikon n="dokumen" warna={K.kuning} uk={64} />
          <div>
            {kecil('jurnal', K.abu, 24)}
            {besar('Science', K.tinta, 60)}
          </div>
          {t > T.n2008 - 0.1 ? <div style={{ padding: '2px 16px', borderRadius: 12, background: K.kuning, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 52 }}>2008</div> : null}
        </Kartu>
      </Muncul>
    </>
  );
};

const Akurasi: React.FC<{ T: WC }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[5].mulai - 0.1 || t > S[6].mulai + 0.3) return null;
  const kel = S[6].mulai - 0.25;
  return (
    <>
      <Muncul mulai={T.nyt - 0.15} keluar={kel} x={540} y={620} seed="ny">
        <Kartu warna={K.tinta} gaya={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 26px' }}>
          <svg width={60} height={60} viewBox="0 0 100 100">
            <rect x={10} y={14} width={80} height={72} rx={6} fill="none" stroke={K.tinta} strokeWidth={7} />
            <path d="M 22 32 L 78 32 M 22 48 L 50 48 M 22 62 L 50 62 M 58 48 L 78 48 L 78 70 L 58 70 Z" stroke={K.tinta} strokeWidth={6} fill="none" />
          </svg>
          <div>
            {kecil('uji pakai arsip koran', K.abu, 24)}
            {besar('New York Times', K.tinta, 56)}
          </div>
        </Kartu>
      </Muncul>
      <Muncul mulai={T.n991 - 0.3} keluar={kel + 0.04} x={540} y={860} seed="b1" melayang={3}>
        <Batang label="reCAPTCHA (manusia)" p={maju(t, T.n991 - 0.3, T.n991 + 0.6, EASE.kamera)} ke={99.1} maks={100} lebar={860} warna={K.teal} desimal={1} tinggi={70} />
      </Muncul>
      <Muncul mulai={T.n835 - 0.3} keluar={kel + 0.08} x={540} y={1060} seed="b2" melayang={3}>
        <Batang label="OCR biasa" p={maju(t, T.n835 - 0.3, T.n835 + 0.6, EASE.kamera)} ke={83.5} maks={100} lebar={860} warna={K.merah} desimal={1} tinggi={70} />
      </Muncul>
    </>
  );
};

const Tumpukan: React.FC<{ T: WC }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[6].mulai - 0.1 || t > S[7].mulai + 0.3) return null;
  const kel = S[7].mulai - 0.25;
  const o = maju(t, S[6].mulai, S[6].mulai + 0.2) * (1 - maju(t, kel, kel + 0.25));
  const p = maju(t, T.n440 - 0.4, T.n17600 + 0.5, EASE.kamera);
  const nBuku = Math.round(14 * p);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: o }}>
      <div style={{ position: 'absolute', left: 300, top: 1180, translate: '-50% -100%', display: 'flex', flexDirection: 'column-reverse', alignItems: 'center' }}>
        {Array.from({ length: nBuku }, (_, i) => (
          <div key={i} style={{ width: 240 - (i % 3) * 16, height: 38, marginTop: 4, borderRadius: 6, background: ['#b85c38', '#3d6b8a', '#c9a227', '#5d7d4a'][i % 4], translate: `${(Math.sin(i * 1.7) * 14).toFixed(1)}px 0`, boxShadow: 'inset 0 -6px 0 rgba(0,0,0,0.25)' }} />
        ))}
      </div>
      <div style={{ position: 'absolute', left: 720, top: 760, translate: '-50% -50%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <Kartu warna={K.kuning} gaya={{ padding: '10px 26px', textAlign: 'center' }}>
          <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 84, color: K.kuning, fontVariantNumeric: 'tabular-nums' }}>{formatAngka(Math.round(440 * maju(t, T.n440 - 0.4, T.n440 + 0.6, EASE.kamera)))}</span>
          {besar('juta kata', K.tinta, 50)}
        </Kartu>
        <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 60, color: K.abu }}>≈</span>
        <Kartu warna={K.teal} gaya={{ padding: '10px 26px', textAlign: 'center', opacity: maju(t, T.n17600 - 0.4, T.n17600 - 0.2) }}>
          <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 84, color: K.teal, fontVariantNumeric: 'tabular-nums' }}>{formatAngka(Math.round(17600 * maju(t, T.n17600 - 0.4, T.n17600 + 0.6, EASE.kamera)))}</span>
          {besar('buku', K.tinta, 50)}
        </Kartu>
      </div>
    </div>
  );
};

const Google: React.FC<{ T: WC }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  if (t < S[7].mulai - 0.1 || t > T.keluarDunia + 0.3) return null;
  const kel7 = S[8].mulai - 0.25;
  const pAi = maju(t, T.n998 - 0.6, T.n998 + 0.4, EASE.kamera);
  const G = ['#4285f4', '#ea4335', '#fbbc05', '#4285f4', '#34a853', '#ea4335'];
  return (
    <>
      <Muncul mulai={T.beli - 0.2} keluar={kel7} x={540} y={700} seed="gg">
        <Kartu warna={K.tinta} gaya={{ display: 'flex', alignItems: 'center', gap: 20, padding: '14px 34px' }}>
          <div style={{ display: 'flex' }}>
            {'Google'.split('').map((c, i) => (
              <span key={i} style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 76, color: G[i] }}>{c}</span>
            ))}
          </div>
          {besar('beli reCAPTCHA', K.tinta, 56)}
        </Kartu>
      </Muncul>
      <Muncul mulai={T.books - 0.2} keluar={kel7 + 0.05} x={540} y={930} seed="gb">
        <Kartu warna={K.teal} gaya={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 28px' }}>
          <Ikon n="buku" warna={K.teal} uk={60} />
          {besar('Google Books · arsip koran', K.tinta, 50)}
        </Kartu>
      </Muncul>
      {/* S9: AI baca teks bengkok 99,8% */}
      <Muncul mulai={T.bengkok - 0.2} keluar={T.centang - 0.5} x={540} y={640} seed="ai">
        <Kartu warna={K.kuning} gaya={{ display: 'flex', alignItems: 'center', gap: 22, padding: '12px 28px' }}>
          <Cincin r={70} p={pAi} ke={99.8} warna={K.kuning} desimal={1} tebal={16} ukuran={40} />
          <div>
            {kecil('AI baca teks bengkok tersulit', K.abu, 26)}
            <div style={{ background: '#f6f6f4', borderRadius: 8, padding: '0 8px', marginTop: 6 }}>
              <KataBengkok teks={MISTERI} ukuran={58} />
            </div>
          </div>
        </Kartu>
      </Muncul>
    </>
  );
};

const Hud: React.FC<{ T: WC }> = ({ T }) => {
  const S = T.s;
  return (
    <HudTeks
      T={T}
      sumber={() => 'Sumber: von Ahn dkk., Science (2008) · Google (2009, 2014)'}
      teks={[
        { label: ['TIAP', 'NGISI', 'reCAPTCHA'], judul: [{ t: 'kamu', mulai: 0.2 }, { t: 'ngetik', mulai: T.ngetik0, warna: K.teal }, { t: 'ulang', mulai: T.ngetik0 + 0.2, warna: K.teal }, { t: 'buku', mulai: T.buku0, isi: sorot('buku', T.buku0 + 0.15) }], jMulai: 0.2, catatan: 'dan koran lama', cMulai: T.koran0 },
        { label: ['DIBIKIN', 'DI'], judul: [{ t: 'Carnegie', mulai: T.carnegie }, { t: 'Mellon', mulai: T.carnegie + 0.2 }, { t: '·', mulai: T.science - 0.1, warna: K.abu }, { t: 'Science', mulai: T.science, warna: K.kuning }, { t: '2008', mulai: T.n2008, warna: K.kuning }], ukuran: 84 },
        { label: ['MASALAHNYA'], judul: [{ t: 'OCR', mulai: T.ocr, warna: K.merah }, { t: 'gagal', mulai: T.gagal2, isi: sorot('gagal', T.gagal2 + 0.1, K.merah) }, { t: 'baca', mulai: T.gagal2 + 0.2 }], catatan: 'OCR = software pembaca teks', cMulai: T.ocr + 0.2 },
        { label: ['CARA', 'KERJANYA'], judul: [{ t: '2', mulai: T.dua, warna: K.kuning }, { t: 'kata:', mulai: T.dua + 0.15 }, { t: 'kontrol', mulai: T.diketahui, warna: K.teal }, { t: '+', mulai: T.gagal3 - 0.15, warna: K.abu }, { t: 'misteri', mulai: T.gagal3, warna: K.kuning }] },
        { label: ['KALAU'], judul: [{ t: 'kontrol', mulai: T.diketik4 - 0.3, warna: K.teal }, { t: 'benar', mulai: T.benar4 }, { t: '→', mulai: T.dipercaya - 0.2, warna: K.abu }, { t: 'dipercaya', mulai: T.dipercaya, isi: sorot('dipercaya', T.dipercaya + 0.1) }] },
        { label: ['UJI', 'ARSIP', 'NYT'], judul: [{ t: '99,1%', mulai: T.n991, warna: K.teal }, { t: 'vs', mulai: T.n835 - 0.3, warna: K.abu }, { t: 'OCR', mulai: T.n835 - 0.15 }, { t: '83,5%', mulai: T.n835, warna: K.merah }] },
        { label: ['SETAHUN', 'JALAN'], judul: [{ t: '440', mulai: T.n440, warna: K.kuning }, { t: 'juta', mulai: T.n440 + 0.2, warna: K.kuning }, { t: 'kata', mulai: T.n440 + 0.4 }, { t: '≈', mulai: T.n17600 - 0.2, warna: K.abu }, { t: '17.600', mulai: T.n17600, warna: K.teal }, { t: 'buku', mulai: T.n17600 + 0.2 }], ukuran: 84 },
        { label: ['2009'], judul: [{ t: 'dibeli', mulai: T.beli }, { t: 'Google', mulai: T.beli + 0.2, isi: sorot('Google', T.beli + 0.35) }] },
        { label: ['2014'], judul: [{ t: 'AI', mulai: T.bengkok }, { t: '99,8%', mulai: T.n998, warna: K.kuning }, { t: '→', mulai: T.centang - 0.3, warna: K.abu }, { t: 'kotak', mulai: T.centang - 0.15, warna: K.teal }, { t: 'centang', mulai: T.centang, warna: K.teal }] },
        { label: ['BUAT', 'FAKTA', 'AI', 'LAINNYA'], judul: [{ t: 'simpan', mulai: T.simpan + 0.05, warna: K.kuning }, { t: '&', mulai: T.follow - 0.25, warna: K.abu }, { t: 'follow', mulai: T.follow, warna: K.teal }], jMulai: T.simpan },
      ]}
    />
  );
};

function daftarSfx(T: WC) {
  const S = T.s;
  const hookB = Math.max(1.2, T.buku0 - 0.25);
  const ketik = Array.from({ length: 10 }, (_, i) => bunyi('klik', 0.4 + i * ((hookB - 0.4) / 10), 0.16));
  const ketik5 = Array.from({ length: 10 }, (_, i) => bunyi('klik', T.diketik4 - 0.3 + i * ((Math.max(0.6, T.dipercaya - T.diketik4)) / 10), 0.16));
  const buku = Array.from({ length: 8 }, (_, i) => bunyi('tik', T.n440 - 0.3 + i * ((Math.max(0.8, T.n17600 + 0.5 - T.n440)) / 8), 0.12));
  return [
    bunyi('whooshPop', 0.08, 0.3),
    ...ketik,
    bunyi('whooshTurun', T.buku0 - 0.3, 0.35),
    bunyi('pop', T.buku0 + 0.5, 0.35),
    bunyi('whooshA', S[1].mulai, 0.3),
    bunyi('pop', T.luis, 0.3),
    bunyi('pop', T.carnegie, 0.3),
    bunyi('pop', T.science, 0.3),
    bunyi('whooshTurun', S[2].mulai + 0.1, 0.35),
    bunyi('riser', T.dipindai - 0.3, 0.2),
    bunyi('glitch', T.gagal2, 0.3),
    bunyi('whooshB', S[3].mulai, 0.35),
    bunyi('pop', T.diketahui, 0.3),
    bunyi('pop', T.gagal3, 0.3),
    ...ketik5,
    bunyi('kunci', T.benar4, 0.3),
    bunyi('hantam', T.dipercaya + 0.03, 0.45),
    bunyi('jepret', T.dipercaya + 0.05, 0.3),
    bunyi('whooshA', S[5].mulai, 0.3),
    bunyi('swish', T.n991 - 0.2, 0.25),
    bunyi('swish', T.n835 - 0.2, 0.25),
    bunyi('whooshPop', S[6].mulai, 0.3),
    ...buku,
    bunyi('whooshB', S[7].mulai, 0.3),
    bunyi('pop', T.beli, 0.3),
    bunyi('pop', T.books, 0.3),
    bunyi('whooshA', S[8].mulai, 0.3),
    bunyi('riser', T.n998 - 0.5, 0.2),
    bunyi('swish', T.centang - 0.3, 0.3),
    bunyi('klik', T.centang + 0.2, 0.45),
    bunyi('whooshTerang', T.keluarDunia + 0.1, 0.3),
    bunyi('pop', T.simpan + 0.15, 0.35),
    bunyi('klik', T.simpan + 0.65, 0.4),
    bunyi('pop', T.follow - 0.2, 0.3),
    bunyi('klik', T.follow + 0.3, 0.4),
    bunyi('whooshLembut', T.keluarCta + 0.05, 0.3),
  ];
}

// ===============================================================================================================
// SAMPUL: "Dulu, ngisi reCAPTCHA = ngetik ulang buku" + kotak reCAPTCHA + buku
export const ContohCaptchaSampul: React.FC = () => {
  const T = waktuCaptcha([], undefined, 59);
  const kam = { x: 540, y: 960, z: 1, vx: 0, vy: 0, lebar: 1080, tinggi: 1920 };
  return (
    <AbsoluteFill style={{ background: K.latar, overflow: 'hidden' }}>
      <LatarSeri kam={kam} />
      <svg width={0} height={0} style={{ position: 'absolute' }}>
        <defs>
          <filter id="bengkok" x="-10%" y="-30%" width="120%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.05" numOctaves={2} seed={4} />
            <feDisplacementMap in="SourceGraphic" scale={16} />
          </filter>
        </defs>
      </svg>
      <div style={{ position: 'absolute', left: 0, top: 120, width: 1080, height: 1920 }}>
        <KotakCaptcha T={T} sampul />
      </div>
      <div style={{ position: 'absolute', left: 540, top: 1440, translate: '-50% -50%', rotate: '-3deg', padding: '10px 30px', borderRadius: 16, background: K.kuning, color: K.latar, fontFamily: SAIRA, fontWeight: 800, fontSize: 70, whiteSpace: 'nowrap' }}>
        → masuk ke buku lama
      </div>
      <div style={{ position: 'absolute', left: 90, top: 196, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 10, height: 44, borderRadius: 5, background: K.teal }} />
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: K.abu }}>reCAPTCHA · 2008</div>
      </div>
      <div style={{ position: 'absolute', left: 90, top: 262, width: 780, fontFamily: SAIRA, fontWeight: 800, fontSize: 118, lineHeight: 1.04, color: K.tinta }}>
        <div>Kamu dulu ikut</div>
        <div>
          <span style={{ display: 'inline-block', background: K.kuning, color: K.latar, padding: '0 0.1em', borderRadius: 12, lineHeight: 0.98 }}>ngetik ulang</span> buku
        </div>
      </div>
      <Grain kuat={0.06} garisScan={0} vinyet={0.45} warnaVinyet="2,5,14" />
    </AbsoluteFill>
  );
};
