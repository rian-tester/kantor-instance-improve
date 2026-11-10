// Frame hero (pembuka, tengah, puncak): 15, 797, 1329.
// contoh explainer generik O6 (konten contoh): "RTX 4090 punya 16.384 CUDA core, Ryzen 9 7950X cuma 16 core".
// SERI generik (seri/seriOL.tsx), aksen O6 = LANGIT (GPU / CUDA core); KORAL = CPU; EMAS = angka penting.
// SATU DUNIA: chip GPU generik 128×128 titik (= 16.384, digambar sendiri, tanpa logo). Hook: titik keisi 0→16.384 → chip CPU 4×4
// (16 core) masuk → tiap core CPU = 1 blok 32×32 titik GPU (1.024×, hitungan kami) → chip di dalam VGA generik → core besar ≠ core kecil
// → CPU: 1 jalur perintah cepat, beberapa puluh jalur → GPU: ribuan jalur pelan barengan → frame 4K 8.294.400 piksel → frame dipecah
// jadi ubin, semua dikerjain sekaligus → CTA → balik ke chip GPU (loop).
// Fakta: spesifikasi NVIDIA RTX 4090 (16.384 CUDA core), AMD Ryzen 9 7950X (16 core), NVIDIA CUDA Programming Guide; 3840 × 2160.
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { AngkaJalan, Bunyi, Dunia, EASE, GarisDigambar, hitungKamera, maju, pathLingkarTangan, pegas, SapuSorot, Stempel, useDetik, type KunciKamera, type Kata, type Sfx } from "../../src/gerak";
import { MONO, SAIRA } from "../../src/gerak/font";
import { bunyi, ChipAngka, ChipKecil, CtaOL, GrainOL, HudSeri, LatarOL, lerp, OL, generikReaksi, ScrimAtas, SubOL, TeksOL, type DataOL, type Kalimat } from "../../src/gerak/seri/neon-grid/seriOL";
import { cariKata, jendela, Ket, Panel, sfxDasar, sumberDi, waktuDasar } from "../../src/gerak/seri/neon-grid/bantuOL";

const GPU = OL.langit;
const CPU = OL.koral;
const G = { x: 284, y: 600, s: 512 }; // chip GPU (dunia), 128 titik × 4 px

const GABUNG = [
  { kata: ['rtx', 'empat', 'puluh', 'sembilan', 'puluh'], jadi: 'RTX 4090' },
  { kata: ['enam', 'belas', 'ribu', 'tiga', 'ratus', 'delapan', 'puluh', 'empat'], jadi: '16.384' },
  { kata: ['ryzen', 'sembilan', 'tujuh', 'puluh', 'sembilan', 'lima', 'puluh', 'x'], jadi: 'Ryzen 9 7950X' },
  { kata: ['enam', 'belas', 'core'], jadi: '16 core' },
  { kata: ['seribu', 'dua', 'puluh', 'empat'], jadi: '1.024' },
  { kata: ['empat', 'k'], jadi: '4K' },
  { kata: ['delapan', 'juta'], jadi: '8 juta' },
];

function waktuO6(d: Kata[], total: number, kal?: Kalimat[]) {
  const CAD: [number, number][] = [
    [0.22, 9.88], [10.34, 14.92], [15.36, 20.1], [20.52, 23.72], [24.14, 33.08], [33.54, 38.4], [38.84, 44.1], [44.54, 49.62], [50.04, 54.02],
  ];
  const B = waktuDasar(kal, CAD, total);
  const s = B.s;
  const k = cariKata(d);
  const enam1 = k('enam', s[0].mulai, 2.54);
  const cuda1 = k('cuda', enam1, 4.86);
  const sedangkan1 = k('sedangkan', cuda1, 5.76);
  const cuma1 = k('cuma', sedangkan1, 8.62);
  const seribu2 = k('seribu', s[1].mulai, 13.04);
  const kali2 = k('kali', seribu2, 14.16);
  const unit3 = k('unit', s[2].mulai, 16.24);
  const gpu3 = k('gpu', unit3, 17.34);
  const vga3 = k('vga', gpu3, 19.02);
  const gak4 = k('gak', s[3].mulai, 21.96);
  const cpu4 = k('cpu', gak4, 23.18);
  const thread5 = k('thread', s[4].mulai, 27.52);
  const secepat5 = k('secepat', thread5, 29.22);
  const beberapa5 = k('beberapa', secepat5, 31.44);
  const ribuan6 = k('ribuan', s[5].mulai, 35.2);
  const lambat6 = k('lambat', ribuan6, 37.86);
  const empat7 = k('empat', s[6].mulai, 39.66);
  const delapan7 = k('delapan', empat7, 40.96);
  const warna7 = k('warna', delapan7, 42.38);
  const dipecah8 = k('dipecah', s[7].mulai, 45.96);
  const ribuan8 = k('ribuan', dipecah8, 48.22);
  const simpan = k('simpan', s[8].mulai, 50.04);
  const follow = k('follow', simpan, 52.48);
  return {
    ...B, enam1, cuda1, sedangkan1, cuma1, seribu2, kali2, unit3, gpu3, vga3, gak4, cpu4, thread5, secepat5, beberapa5, ribuan6, lambat6, empat7,
    delapan7, warna7, dipecah8, ribuan8, simpan, follow,
    isi1: [0.3, cuda1 + 0.3] as [number, number],
    ctaKeluar: Math.max(follow + 0.9, total - 1.75),
  };
}
type W = ReturnType<typeof waktuO6>;

// ======================================================================================================
function kunciKamera(T: W): KunciKamera[] {
  const S = T.s;
  const pelan = Easing.inOut(Easing.sin);
  return [
    { t: 0, x: 540, y: 960, z: 1.0 },
    { t: T.cuda1, x: 540, y: 960, z: 1.06, ease: pelan },
    { t: T.sedangkan1 + 0.3, x: 540, y: 960, z: 1.0 },
    { t: S[2].mulai, x: 540, y: 960, z: 1.0, ease: pelan },
    { t: T.gpu3 + 0.4, x: 540, y: 900, z: 1.04 },
    { t: S[3].mulai - 0.1, x: 540, y: 905, z: 1.06, ease: pelan },
    { t: S[3].mulai + 0.4, x: 540, y: 960, z: 1.0 },
    { t: T.pulang, x: 540, y: 958, z: 1.02, ease: pelan },
    { t: T.loop, x: 540, y: 960, z: 1.0, ease: pelan },
  ];
}

export const ContohCore: React.FC<DataOL> = (d) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const T = useMemo(() => waktuO6(d.kata, total, d.kalimat), [d.kata, total, d.kalimat]);
  const kunci = useMemo(() => kunciKamera(T), [T]);
  const S = T.s;
  const kam = hitungKamera(kunci, t, fps, {
    drift: 2.2 * (1 - maju(t, T.pulang, T.loop)) * maju(t, 0, 0.6),
    getar: [
      { t: T.cuda1 + 0.3, kuat: 7 },
      { t: T.cuma1 + 0.6, kuat: 6 },
      { t: T.kali2 + 0.2, kuat: 6 },
      { t: T.delapan7 + 0.6, kuat: 6 },
      { t: T.ribuan8 + 0.3, kuat: 6 },
    ],
  });
  return (
    <AbsoluteFill style={{ background: OL.navy0, color: OL.putih, overflow: 'hidden', fontFamily: SAIRA }}>
      <LatarOL kam={kam} aksen={GPU} />
      <Dunia kamera={kam} tinggiDunia={1920} lebarDunia={1080} blurGerak={null}>
        <ChipDunia T={T} />
      </Dunia>
      <Beda T={T} />
      <Jalur T={T} />
      <Frame4K T={T} />
      <ScrimAtas />
      <Teks T={T} />
      <CtaOL simpan={T.simpan} follow={T.follow} keluar={T.ctaKeluar} y={720} />
      <></>
      <HudSeri kalimat={S} sampai={T.pulang} />
      <SubOL kata={d.kata} kalimat={d.kalimat} sampai={T.pulang + 0.2} gabung={GABUNG} />
      <GrainOL />
      <></>
    </AbsoluteFill>
  );
};

// ======================================================================================================
/** grid titik GPU 128×128 (CSS, ringan): rows = baris yang udah keisi dari atas */
const GridTitik: React.FC<{ s: number; rows: number; warna?: string; blok?: number; sorotBlok?: number }> = ({ s, rows, warna = GPU, blok = 0, sorotBlok = 0 }) => {
  const p = s / 128;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: s, height: s }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, #2c3870 ${p * 0.3}px, transparent ${p * 0.42}px)`, backgroundSize: `${p}px ${p}px` }} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle, ${warna} ${p * 0.32}px, transparent ${p * 0.46}px)`,
          backgroundSize: `${p}px ${p}px`,
          clipPath: `inset(0 0 ${100 - (100 * rows) / 128}% 0)`,
          filter: `drop-shadow(0 0 3px ${warna}88)`,
        }}
      />
      {/* garis blok 4×4 (= 16 blok × 1.024 titik) */}
      {blok > 0 ? (
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: blok }} width={s} height={s}>
          {[1, 2, 3].map((i) => (
            <g key={i}>
              <line x1={(s * i) / 4} y1={0} x2={(s * i) / 4} y2={s * blok} stroke={OL.emas} strokeWidth={3} />
              <line x1={0} y1={(s * i) / 4} x2={s * blok} y2={(s * i) / 4} stroke={OL.emas} strokeWidth={3} />
            </g>
          ))}
        </svg>
      ) : null}
      {sorotBlok > 0 ? <div style={{ position: 'absolute', left: 0, top: 0, width: s / 4, height: s / 4, border: `5px solid ${OL.emas}`, background: `${OL.emas}33`, opacity: sorotBlok, boxShadow: `0 0 24px ${OL.emas}` }} /> : null}
    </div>
  );
};

const KakiChip: React.FC<{ s: number; warna: string }> = ({ s, warna }) => (
  <>
    {Array.from({ length: 12 }, (_, i) => {
      const pos = 30 + (i * (s - 60)) / 11 - 4;
      return (
        <React.Fragment key={i}>
          <div style={{ position: 'absolute', left: pos, top: -24, width: 8, height: 18, background: warna, opacity: 0.7 }} />
          <div style={{ position: 'absolute', left: pos, top: s + 6, width: 8, height: 18, background: warna, opacity: 0.7 }} />
          <div style={{ position: 'absolute', top: pos, left: -24, height: 8, width: 18, background: warna, opacity: 0.7 }} />
          <div style={{ position: 'absolute', top: pos, left: s + 6, height: 8, width: 18, background: warna, opacity: 0.7 }} />
        </React.Fragment>
      );
    })}
  </>
);

const ChipCpu: React.FC<{ s: number; sorot?: number; nyala?: number }> = ({ s, sorot = 0, nyala = 1 }) => {
  const g = s * 0.04;
  const c = (s - g * 5) / 4;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: s, height: s, borderRadius: 18, background: '#1a1430', border: `5px solid ${CPU}` }}>
      <KakiChip s={s} warna={CPU} />
      {Array.from({ length: 16 }, (_, i) => {
        const on = i / 16 < nyala;
        return (
          <div key={i} style={{ position: 'absolute', left: g + (i % 4) * (c + g), top: g + Math.floor(i / 4) * (c + g), width: c, height: c, borderRadius: 8, background: on ? `${CPU}${i === 0 && sorot > 0 ? 'ff' : 'cc'}` : '#2a2040', boxShadow: i === 0 && sorot > 0 ? `0 0 ${20 * sorot}px ${OL.emas}` : undefined, border: i === 0 && sorot > 0 ? `4px solid ${OL.emas}` : undefined }} />
        );
      })}
    </div>
  );
};

// Dunia: chip GPU (S1–S3, loop), chip CPU (S1–S2), VGA (S3)
const ChipDunia: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const hadir = 1 - maju(t, S[3].mulai - 0.15, S[3].mulai + 0.25, EASE.keluar);
  const hadirP = maju(t, T.pulang - 0.5, T.pulang + 0.1);
  const o = Math.max(hadir, hadirP);
  if (o <= 0.001) return null;
  const akhir = t > T.pulang - 0.6;
  const rows = akhir ? 0 : 128 * maju(t, T.isi1[0], T.isi1[1], EASE.linear);
  // geser ke kanan pas CPU masuk; S3 balik ke tengah & mengecil ke dalam VGA
  const banding = akhir ? 0 : maju(t, T.sedangkan1 - 0.1, T.sedangkan1 + 0.5, EASE.kamera) * (1 - maju(t, S[2].mulai - 0.2, S[2].mulai + 0.4, EASE.kamera));
  const vga = akhir ? 0 : maju(t, T.gpu3 + 0.2, T.vga3 + 0.2, EASE.kamera);
  const sk = lerp(1, 0.78, banding) * lerp(1, 0.42, vga);
  const tx = lerp(0, 190, banding);
  const ty = lerp(0, -10, banding) + lerp(0, 40, vga);
  const blok = maju(t, T.seribu2 - 0.6, T.seribu2 + 0.2, EASE.kamera) * (1 - maju(t, S[2].mulai - 0.2, S[2].mulai + 0.1));
  const sorot = maju(t, T.seribu2, T.seribu2 + 0.3) * (1 - maju(t, S[2].mulai - 0.2, S[2].mulai + 0.1));
  const cpuO = maju(t, T.sedangkan1 + 0.1, T.sedangkan1 + 0.6) * (1 - maju(t, S[2].mulai - 0.2, S[2].mulai + 0.2, EASE.keluar));
  const cpuIsi = maju(t, T.cuma1 + 0.1, T.cuma1 + 0.8, EASE.linear);
  const hit = pegas(t, T.cuma1 + 0.8, fps, { damping: 9, stiffness: 200, mass: 0.5 });
  const vgaO = maju(t, T.gpu3 + 0.1, T.gpu3 + 0.5) * hadir;
  const labelGpu = maju(t, T.unit3 - 0.1, T.unit3 + 0.3) * (1 - maju(t, T.gpu3 + 0.1, T.gpu3 + 0.3));
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: o }}>
      {/* VGA generik: papan + 2 kipas + slot */}
      {vgaO > 0 ? (
        <div style={{ position: 'absolute', left: 80, top: 640, width: 920, height: 460, opacity: vgaO, scale: String(0.9 + 0.1 * vgaO) }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 26, background: 'linear-gradient(170deg, #232b58, #11163a)', border: `4px solid ${OL.abuTerang}55` }} />
          {[0, 1].map((i) => (
            <svg key={i} style={{ position: 'absolute', left: i === 0 ? 40 : 640, top: 80, overflow: 'visible' }} width={240} height={240}>
              <circle cx={120} cy={120} r={112} fill="#0b1020" stroke="#3a4677" strokeWidth={6} />
              <g transform={`rotate(${t * 420 + i * 30} 120 120)`}>
                {Array.from({ length: 7 }, (_, j) => (
                  <path key={j} d="M 120 120 Q 150 60 120 18 Q 100 60 120 120 Z" fill="#3a4677" transform={`rotate(${(j * 360) / 7} 120 120)`} />
                ))}
              </g>
              <circle cx={120} cy={120} r={26} fill="#2a3266" />
            </svg>
          ))}
          <div style={{ position: 'absolute', left: 120, top: 460, width: 520, height: 34, background: '#c9a43a', borderRadius: '0 0 6px 6px' }} />
          <div style={{ position: 'absolute', left: 460, top: 400, translate: '-50% 0', fontFamily: SAIRA, fontWeight: 800, fontSize: 48, color: OL.putih, whiteSpace: 'nowrap', opacity: maju(t, T.vga3 - 0.1, T.vga3 + 0.2) }}>VGA</div>
        </div>
      ) : null}
      {/* chip GPU */}
      <div style={{ position: 'absolute', left: G.x, top: G.y, width: G.s, height: G.s, transformOrigin: '50% 50%', transform: `translate(${tx}px, ${ty}px) scale(${sk})` }}>
        <div style={{ position: 'absolute', left: -30, top: -30, width: G.s + 60, height: G.s + 60, borderRadius: 24, background: '#0e1838', border: `5px solid ${GPU}`, boxShadow: `0 0 40px ${GPU}44` }} />
        <div style={{ position: 'absolute', left: -30, top: -30, width: G.s + 60, height: G.s + 60 }}>
          <KakiChip s={G.s + 60} warna={GPU} />
        </div>
        <GridTitik s={G.s} rows={rows} blok={blok} sorotBlok={sorot} />
        {sorot > 0 ? <ChipAngka x={G.s / 8} y={G.s / 8} ukuran={44} warna={OL.emas} o={sorot} isi="1.024" /> : null}
        {labelGpu > 0 ? <ChipAngka x={G.s / 2} y={G.s + 80} o={labelGpu} ukuran={52} warna={GPU} isi="1 titik = 1 CUDA core" /> : null}
      </div>
      {/* angka GPU (diikat ke isi titik) */}
      {t < T.sedangkan1 + 0.4 && !akhir ? (
        <div style={{ position: 'absolute', left: 540, top: G.y + G.s + 60, translate: '-50% 0', fontFamily: SAIRA, fontWeight: 800, fontSize: 96, lineHeight: 1, color: GPU, whiteSpace: 'nowrap', opacity: maju(t, 0.3, 0.6) * (1 - 2 * banding) }}>
          <AngkaJalan dari={0} ke={16384} progress={rows / 128} lantai /> <span style={{ fontSize: 60, color: OL.putih }}>CUDA core</span>
        </div>
      ) : null}
      {/* chip CPU (kiri) */}
      {cpuO > 0 ? (
        <div style={{ position: 'absolute', left: 80, top: 640, width: 380, height: 380, opacity: cpuO, translate: `${(1 - cpuO) * -120}px 0`, scale: String(1 + 0.05 * Math.sin(Math.min(1, hit) * Math.PI)) }}>
          <ChipCpu s={380} nyala={cpuIsi} sorot={sorot} />
        </div>
      ) : null}
      {banding > 0.3 && cpuO > 0 ? (
        <>
          <div style={{ position: 'absolute', left: 270, top: 1050, translate: '-50% 0', textAlign: 'center', opacity: cpuO }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: OL.abuTerang, whiteSpace: 'nowrap' }}>Ryzen 9 7950X</div>
            <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 84, lineHeight: 1, color: CPU, whiteSpace: 'nowrap' }}>
              <AngkaJalan dari={0} ke={16} progress={cpuIsi} lantai /> <span style={{ fontSize: 52, color: OL.putih }}>core</span>
            </div>
          </div>
          <div style={{ position: 'absolute', left: 730, top: 1050, translate: '-50% 0', textAlign: 'center', opacity: Math.min(1, banding * 2) * (1 - vga) }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: OL.abuTerang, whiteSpace: 'nowrap' }}>RTX 4090</div>
            <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 84, lineHeight: 1, color: GPU, whiteSpace: 'nowrap' }}>
              16.384 <span style={{ fontSize: 52, color: OL.putih }}>core</span>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

// S4: 1 CUDA core ≠ 1 core CPU (core CPU besar & rumit vs CUDA core kecil & simpel)
const Beda: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const { m, k, o } = jendela(t, S[3].mulai, S[4].mulai);
  if (o <= 0.001) return null;
  const ne = maju(t, T.gak4 - 0.1, T.gak4 + 0.2);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, translate: `0 ${(1 - m) * 60 + k * 30}px` }}>
      {/* core CPU: isinya banyak bagian */}
      <div style={{ position: 'absolute', left: 90, top: 620, width: 420, height: 420, borderRadius: 22, background: '#1a1430', border: `5px solid ${CPU}` }}>
        {[
          [20, 20, 180, 120, '#ff8a8e'],
          [220, 20, 180, 80, '#c95a5f'],
          [220, 120, 180, 120, '#ff8a8e'],
          [20, 160, 180, 240, '#a8474b'],
          [220, 260, 180, 140, '#ff5a5f'],
        ].map(([x, y, w, h, c], i) => (
          <div key={i} style={{ position: 'absolute', left: x as number, top: y as number, width: w as number, height: h as number, borderRadius: 10, background: c as string, opacity: 0.85 }} />
        ))}
      </div>
      <Ket x={300} y={1070} rata="tengah" warna={CPU} ukuran={34}>
        1 core CPU
      </Ket>
      {/* ≠ */}
      <div style={{ position: 'absolute', left: 640, top: 760, translate: '-50% -50%', fontFamily: SAIRA, fontWeight: 800, fontSize: 160, color: OL.emas, opacity: ne, scale: String(0.6 + 0.4 * ne) }}>≠</div>
      {/* CUDA core: kecil */}
      <div style={{ position: 'absolute', left: 820, top: 800, width: 60, height: 60, borderRadius: 10, background: GPU, boxShadow: `0 0 24px ${GPU}` }} />
      <Ket x={850} y={1070} rata="tengah" warna={GPU} ukuran={34}>
        1 CUDA core
      </Ket>
    </div>
  );
};

// S5: CPU — 1 thread (urutan perintah) secepat mungkin, beberapa puluh thread; S6: GPU — ribuan thread barengan, tiap thread lebih lambat
const Jalur: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const j5 = jendela(t, S[4].mulai, S[5].mulai);
  const j6 = jendela(t, S[5].mulai, S[6].mulai);
  const out: React.ReactNode[] = [];
  const X = 90;
  const Wd = 900;
  if (j5.o > 0.001) {
    const banyak = maju(t, T.beberapa5 - 0.2, T.beberapa5 + 0.8, EASE.kamera);
    const n = Math.round(lerp(1, 32, banyak));
    const tinggi = 600;
    const h = tinggi / n;
    out.push(
      <div key="cpu" style={{ position: 'absolute', inset: 0, opacity: j5.o, translate: `0 ${(1 - j5.m) * 60 + j5.k * 30}px` }}>
        <Ket x={X} y={580} warna={CPU} ukuran={30}>
          CPU · {n === 1 ? '1 thread = 1 urutan perintah' : 'beberapa puluh thread'}
        </Ket>
        <div style={{ position: 'absolute', left: X, top: 630, width: Wd, height: tinggi, overflow: 'hidden', borderRadius: 16, background: 'rgba(8,12,28,0.6)', border: `3px solid ${OL.garis}` }}>
          {Array.from({ length: n }, (_, i) => (
            <div key={i} style={{ position: 'absolute', left: 0, top: i * h, width: Wd, height: h - (n > 1 ? 3 : 0), borderBottom: n > 1 ? `1px solid ${OL.garis}` : undefined }}>
              {Array.from({ length: n === 1 ? 6 : 4 }, (_, j) => {
                const v = 900; // px/detik: cepat
                const x = ((t * v + j * 260 + i * 97) % (Wd + 200)) - 160;
                return <div key={j} style={{ position: 'absolute', left: x, top: h * 0.2, width: n === 1 ? 150 : 90, height: h * 0.6, borderRadius: 6, background: CPU, boxShadow: `-30px 0 30px ${CPU}66` }} />;
              })}
            </div>
          ))}
          {n === 1 ? (
            <div style={{ position: 'absolute', left: 30, top: 30, fontFamily: MONO, fontWeight: 800, fontSize: 30, color: OL.abuTerang }}>perintah 1 → 2 → 3 → …</div>
          ) : null}
        </div>
        {t > T.secepat5 - 0.2 && n === 1 ? <ChipAngka x={540} y={1290} o={maju(t, T.secepat5 - 0.2, T.secepat5 + 0.1)} ukuran={42} warna={CPU} isi="secepat mungkin" /> : null}
        {n > 1 ? <ChipAngka x={540} y={1290} o={banyak} ukuran={42} warna={CPU} isi="beberapa puluh thread sekaligus" /> : null}
      </div>,
    );
  }
  if (j6.o > 0.001) {
    const banyak = maju(t, T.ribuan6 - 0.4, T.ribuan6 + 0.6, EASE.kamera);
    const kol = 64;
    const bar = Math.round(lerp(8, 48, banyak));
    out.push(
      <div key="gpu" style={{ position: 'absolute', inset: 0, opacity: j6.o, translate: `0 ${(1 - j6.m) * 60 + j6.k * 30}px` }}>
        <Ket x={X} y={580} warna={GPU} ukuran={30}>
          GPU · ribuan thread barengan
        </Ket>
        <div style={{ position: 'absolute', left: X, top: 630, width: Wd, height: 600, overflow: 'hidden', borderRadius: 16, background: 'rgba(8,12,28,0.6)', border: `3px solid ${OL.garis}` }}>
          <svg width={Wd} height={600}>
            {Array.from({ length: bar }, (_, i) =>
              Array.from({ length: 7 }, (_, j) => {
                const h = 600 / bar;
                const v = 160; // lebih lambat
                const x = ((t * v + j * 140 + i * 53) % (Wd + 120)) - 60;
                return <rect key={`${i}-${j}`} x={x} y={i * h + h * 0.2} width={30} height={Math.max(2, h * 0.6)} rx={2} fill={GPU} opacity={0.85} />;
              }),
            )}
          </svg>
        </div>
        <ChipAngka x={540} y={1290} o={maju(t, T.lambat6 - 0.4, T.lambat6)} ukuran={42} warna={GPU} isi="tiap thread lebih lambat" />
      </div>,
    );
  }
  return <>{out}</>;
};

// S7: frame 4K = 3840 × 2160 = 8.294.400 piksel; S8: dipecah jadi ubin, dikerjain ribuan core sekaligus
const Frame4K: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const S = T.s;
  const { m, k, o } = jendela(t, S[6].mulai, S[8].mulai);
  if (o <= 0.001) return null;
  const Fw = 900;
  const Fh = (900 * 9) / 16;
  const X = 90;
  const Y = 600;
  const p = maju(t, T.delapan7 - 0.6, T.delapan7 + 0.6, EASE.kamera);
  const warnaP = maju(t, T.warna7 - 0.1, T.warna7 + 1.0, EASE.linear);
  const pecah = maju(t, T.dipecah8 - 0.2, T.dipecah8 + 0.4);
  const bareng = maju(t, T.ribuan8 - 0.2, T.ribuan8 + 0.4);
  const hit = pegas(t, T.ribuan8 + 0.3, fps, { damping: 9, stiffness: 200, mass: 0.5 });
  const C = 32;
  const R = 18;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, translate: `0 ${(1 - m) * 60 + k * 30}px` }}>
      <div style={{ position: 'absolute', left: X - 12, top: Y - 12, width: Fw + 24, height: Fh + 24, borderRadius: 16, border: `5px solid ${OL.abuTerang}`, background: '#05081a' }} />
      {/* frame: gradien senja (gambar game generik), keisi warna ngikut "warna tiap piksel dihitung" */}
      <svg style={{ position: 'absolute', left: X, top: Y }} width={Fw} height={Fh}>
        <defs>
          <linearGradient id="o6-langit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a1f66" />
            <stop offset="60%" stopColor="#c0457a" />
            <stop offset="100%" stopColor="#ff9a4d" />
          </linearGradient>
        </defs>
        {Array.from({ length: C * R }, (_, i) => {
          const c = i % C;
          const r = Math.floor(i / C);
          const w = Fw / C;
          const h = Fh / R;
          // urutan: S7 kiri-atas → kanan-bawah; S8 semua bareng
          const urut = i / (C * R);
          const nyala = t < S[7].mulai ? warnaP > urut : bareng > 0 ? 1 : warnaP > urut;
          const naik = bareng > 0 ? Math.min(1, bareng * 1.2) : 1;
          return (
            <rect
              key={i}
              x={c * w + (pecah > 0 ? 2 : 0)}
              y={r * h + (pecah > 0 ? 2 : 0)}
              width={w - (pecah > 0 ? 4 : 0.6)}
              height={h - (pecah > 0 ? 4 : 0.6)}
              fill={nyala ? (r > 12 ? (c + r) % 2 ? '#1d3b2a' : '#24493a' : r < 4 ? '#2a1f66' : r < 9 ? '#7a3a8a' : '#e0637a') : '#141a3a'}
              opacity={nyala ? naik : 1}
            />
          );
        })}
        {/* matahari */}
        {warnaP > 0.5 || bareng > 0 ? <circle cx={Fw / 2} cy={Fh * 0.58} r={80} fill="#ffc53d" opacity={0.85} /> : null}
        {/* garis pindai (sebelum diwarnai): frame = kumpulan piksel yang nunggu dihitung */}
        {t < T.warna7 + 0.2 ? <rect x={0} y={((t - S[6].mulai) * 260) % Fh} width={Fw} height={10} fill={GPU} opacity={0.5 * (1 - maju(t, T.warna7 - 0.1, T.warna7 + 0.2))} /> : null}
      </svg>
      <div style={{ position: 'absolute', left: X, top: Y + Fh + 40, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: OL.abuTerang, opacity: maju(t, T.empat7 - 0.2, T.empat7 + 0.2) }}>
        4K = 3.840 × 2.160
      </div>
      <div style={{ position: 'absolute', left: X, top: Y + Fh + 86, fontFamily: SAIRA, fontWeight: 800, fontSize: 96, lineHeight: 1, color: OL.emas, whiteSpace: 'nowrap', opacity: t < S[7].mulai ? maju(t, T.delapan7 - 0.7, T.delapan7 - 0.5) : 1 - pecah, fontVariantNumeric: 'tabular-nums' }}>
        <AngkaJalan dari={0} ke={8294400} progress={p} /> <span style={{ fontSize: 60, color: OL.putih }}>piksel</span>
      </div>
      {pecah > 0 ? (
        <div style={{ position: 'absolute', left: X, top: Y + Fh + 86, fontFamily: SAIRA, fontWeight: 800, fontSize: 72, lineHeight: 1.05, color: GPU, whiteSpace: 'nowrap', opacity: pecah, scale: String(1 + 0.06 * Math.sin(Math.min(1, hit) * Math.PI)), transformOrigin: '0 50%' }}>
          {bareng > 0 ? 'semua dikerjain bareng' : 'dipecah jadi tugas kecil'}
        </div>
      ) : null}
    </div>
  );
};

// ======================================================================================================
const Teks: React.FC<{ T: W }> = ({ T }) => {
  const t = useDetik();
  const S = T.s;
  const kj = (n: number) => S[n].mulai - 0.22;
  const sumber = sumberDi(t, S, [
    [0, 'Sumber: spesifikasi NVIDIA (RTX 4090) & AMD (Ryzen 9 7950X)'],
    [1, 'hitungan kami: 16.384 ÷ 16 = 1.024'],
    [2, 'Sumber: NVIDIA · ilustrasi VGA generik'],
    [3, 'ilustrasi'],
    [4, 'Sumber: NVIDIA CUDA Programming Guide · ilustrasi'],
    [6, 'hitungan kami: 3.840 × 2.160 = 8.294.400 piksel'],
    [7, 'ilustrasi'],
    [8, null],
  ]);
  const oSumber = maju(t, T.sedangkan1 - 0.15, T.sedangkan1 + 0.15) * (1 - maju(t, S[8].mulai - 0.2, S[8].mulai));
  return (
    <>
      <TeksOL label={['RTX', '4090']} lMulai={0.12} judul={[{ t: '16.384', mulai: 0.25, warna: GPU }, { t: 'CUDA', mulai: T.cuda1 - 0.1 }, { t: 'core', mulai: T.cuda1 }]} jMulai={0.25} keluar={T.sedangkan1 - 0.2} ukuran={104} />
      <TeksOL label={['vs', 'ryzen', '9', '7950X']} lMulai={T.sedangkan1} judul={[{ t: '16.384', mulai: T.sedangkan1 + 0.1, warna: GPU }, { t: 'vs', mulai: T.sedangkan1 + 0.3, warna: OL.abu }, { t: '16', mulai: T.cuma1 + 0.2, warna: CPU }, { t: 'core', mulai: T.cuma1 + 0.4 }]} jMulai={T.sedangkan1 + 0.1} keluar={kj(1)} ukuran={104} />
      <TeksOL label={['hitungan', 'kami']} lMulai={S[1].mulai} judul={[{ t: '1.024×', mulai: T.seribu2, isi: <SapuSorot mulai={T.seribu2 + 0.3} warna={OL.emas} warnaTeks={[OL.putih, OL.navy0]} penuh>1.024×</SapuSorot> }, { t: 'lipat', mulai: T.kali2 }]} jMulai={T.seribu2} keluar={kj(2)} ukuran={110} />
      <TeksOL label={['cuda', 'core']} lMulai={S[2].mulai} judul={[{ t: 'unit', mulai: T.unit3 }, { t: 'hitung', mulai: T.unit3 + 0.2 }, { t: 'di', mulai: T.gpu3 - 0.2 }, { t: 'GPU', mulai: T.gpu3, warna: GPU }]} jMulai={T.unit3} keluar={kj(3)} />
      <TeksOL label={['tapi']} lMulai={S[3].mulai} judul={[{ t: 'CUDA', mulai: S[3].mulai + 0.5, warna: GPU }, { t: 'core', mulai: S[3].mulai + 0.6 }, { t: '≠', mulai: T.gak4, warna: OL.emas }, { t: 'core', mulai: T.cpu4 - 0.3 }, { t: 'CPU', mulai: T.cpu4, warna: CPU }]} jMulai={S[3].mulai + 0.5} keluar={kj(4)} ukuran={96} />
      <TeksOL label={['menurut', 'NVIDIA']} lMulai={S[4].mulai} judul={[{ t: 'CPU:', mulai: S[4].mulai + 1.2, warna: CPU }, { t: '1', mulai: T.thread5 - 0.3 }, { t: 'thread', mulai: T.thread5 }, { t: 'secepat', mulai: T.secepat5 }, { t: 'mungkin', mulai: T.secepat5 + 0.3 }]} jMulai={S[4].mulai + 1.2} keluar={T.beberapa5 - 0.25} ukuran={88} />
      <TeksOL label={['CPU']} lMulai={T.beberapa5 - 0.1} judul={[{ t: 'beberapa', mulai: T.beberapa5 }, { t: 'puluh', mulai: T.beberapa5 + 0.3 }, { t: 'thread', mulai: T.beberapa5 + 0.6, warna: CPU }]} jMulai={T.beberapa5} keluar={kj(5)} ukuran={92} />
      <TeksOL label={['GPU']} lMulai={S[5].mulai} judul={[{ t: 'ribuan', mulai: T.ribuan6, warna: GPU }, { t: 'thread', mulai: T.ribuan6 + 0.4 }, { t: 'barengan', mulai: T.ribuan6 + 0.8 }]} jMulai={T.ribuan6} keluar={kj(6)} ukuran={92} />
      <TeksOL label={['1', 'frame', '4K']} lMulai={S[6].mulai} judul={[{ t: '8.294.400', mulai: T.delapan7, warna: OL.emas }, { t: 'piksel', mulai: T.delapan7 + 0.3 }]} jMulai={T.delapan7} keluar={kj(7)} ukuran={96} />
      <TeksOL label={['kerjaan', 'sebanyak', 'itu']} lMulai={S[7].mulai} judul={[{ t: 'dipecah,', mulai: T.dipecah8 }, { t: 'dikerjain', mulai: T.ribuan8 - 0.3 }, { t: 'bareng', mulai: T.ribuan8, warna: GPU }]} jMulai={T.dipecah8} keluar={kj(8)} ukuran={92} />
      <TeksOL label={['simpan', '&', 'follow']} lMulai={S[8].mulai} judul={[{ t: 'buat', mulai: T.simpan + 0.5 }, { t: 'pas', mulai: T.simpan + 0.6 }, { t: 'milih', mulai: T.simpan + 0.7 }, { t: 'VGA', mulai: T.simpan + 0.85, warna: OL.emas }]} jMulai={T.simpan + 0.5} keluar={T.ctaKeluar} ukuran={92} />
      {sumber ? <ChipKecil x={90} y={1330} o={oSumber} teks={sumber} /> : null}
    </>
  );
};

// ======================================================================================================
function daftarSfx(T: W): Sfx[] {
  const S = T.s;
  const isi = Array.from({ length: 12 }, (_, i) => bunyi('tik', T.isi1[0] + ((T.isi1[1] - T.isi1[0]) * (i + 1)) / 12, 0.14));
  return [
    ...sfxDasar(S, T.simpan, T.follow, T.pulang),
    ...isi,
    bunyi('kunci', T.cuda1 + 0.3, 0.4),
    bunyi('whooshA', T.sedangkan1, 0.3),
    bunyi('hantam', T.cuma1 + 0.8, 0.4),
    bunyi('swish', T.seribu2 - 0.5, 0.3),
    bunyi('sapuHit', T.seribu2 + 0.3, 0.35),
    bunyi('pop', T.unit3, 0.3),
    bunyi('whooshBerat', T.gpu3 + 0.2, 0.3),
    bunyi('pop', T.vga3, 0.3),
    bunyi('hantam', T.gak4, 0.35),
    bunyi('whooshA', T.thread5, 0.3),
    bunyi('riser', T.beberapa5 - 0.4, 0.2),
    bunyi('riser', T.ribuan6 - 0.6, 0.2),
    bunyi('kunci', T.delapan7 + 0.6, 0.4),
    bunyi('swish', T.warna7, 0.3),
    bunyi('jepret', T.dipecah8, 0.4),
    bunyi('hantam', T.ribuan8 + 0.3, 0.4),
  ];
}

// ======================================================================================================
export const O6Sampul: React.FC = () => (
  <AbsoluteFill style={{ background: OL.navy0, overflow: 'hidden', fontFamily: SAIRA, color: OL.putih }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% 50%, ${OL.navy1} 0%, ${OL.navy0} 75%)` }} />
    <div style={{ position: 'absolute', left: 520, top: 780, width: 440, height: 440 }}>
      <div style={{ position: 'absolute', left: -26, top: -26, width: 492, height: 492, borderRadius: 22, background: '#0e1838', border: `5px solid ${GPU}` }} />
      <GridTitik s={440} rows={128} />
    </div>
    <div style={{ position: 'absolute', left: 90, top: 880, width: 300, height: 300 }}>
      <ChipCpu s={300} />
    </div>
    <div style={{ position: 'absolute', left: 70, top: 190, fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: OL.lime }}>RTX 4090 VS RYZEN 9</div>
    <div style={{ position: 'absolute', left: 64, top: 250, fontWeight: 800, fontSize: 190, lineHeight: 0.95, color: GPU, textShadow: `0 0 40px ${GPU}66` }}>16.384</div>
    <div style={{ position: 'absolute', left: 70, top: 450, fontWeight: 800, fontSize: 84, lineHeight: 1 }}>
      vs <span style={{ color: CPU }}>16 core</span>
    </div>
    <></>
    <div style={{ position: 'absolute', left: 70, top: 1340, fontWeight: 800, fontSize: 76, lineHeight: 1.05 }}>kok bisa beda jauh?</div>
    <GrainOL />
  </AbsoluteFill>
);
