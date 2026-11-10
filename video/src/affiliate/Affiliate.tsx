// Template video affiliate 9:16 (pilot OP-04 #13, 10/10). Resep murah: foto produk asli (cutout / foto penjual) + VO TTS +
// subtitle per kata + BGM/SFX pustaka. Isi per produk dari JSON; adegan dipilih dari jenis di bawah. Gambar AI JANGAN
// nampilin produknya (pelajaran pilot Flydigi: bentuk controller beda = nyesatin pembeli), cuma buat suasana.
// `bingkai: true` = foto penjual resolusi kecil (±640 px) tampil di kartu 960×1200 di atas latar blur, gak ditarik full layar.
import React, { createContext, useContext } from 'react';
import { AbsoluteFill, Audio, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { HurufKinetik, Muncul, usePunch, WipeLingkaran } from './lib/gerak';
import { ANTON, MONO, antara, getar, maju, useDetik, type Kata } from './lib/primitif';

type Fokus = { x: number; y: number; zoom: number };
// subY (OP-82): posisi atas subtitle khusus adegan ini (mis. sepatu di zona subtitle bawaan 1290 → subtitle dinaikin).
// tanpaSub (OP-82): subtitle disembunyiin di adegan ini kalau judul/chip udah nulis kalimat yang sama (biar gak dobel).
type Dasar = { mulai: number; akhir: number; subY?: number; tanpaSub?: boolean };
export type Adegan =
  | (Dasar & { jenis: 'hook'; gambar: string; judul: string; ai?: boolean; getarDi?: number })
  | (Dasar & { jenis: 'sorot'; gambar: string; judul: string; sub?: string; stempel?: string; fokus?: Fokus; lingkar?: { x: number; y: number; r: number }; ai?: boolean; ukuranJudul?: number; ganti?: { gambar: string; mulai: number; fokus?: Fokus }[]; chips?: { teks: string; mulai: number }[]; chipTop?: number })
  | (Dasar & { jenis: 'reveal'; produk?: string; gambar?: string; nama: string; tag: string })
  | (Dasar & { jenis: 'detail'; produk: string; fokus: Fokus; judul: string; sub?: string; efek: 'magnet' | 'putar' })
  | (Dasar & { jenis: 'pilihan'; gambar: string; judul: string; opsi: { teks: string; sub: string; mulai: number }[]; ai?: boolean; ukuranJudul?: number; chipTop?: number; jarakChip?: number })
  | (Dasar & { jenis: 'spek'; gambar: string[]; item: { teks: string; mulai: number; hitung?: number; akhiran?: string }[]; ai?: boolean })
  | (Dasar & { jenis: 'percaya'; produk: string; lencana: { teks: string; mulai: number }[] })
  | (Dasar & { jenis: 'warna'; judul: string; pilihan: { gambar: string; nama: string }[]; ekstra?: { teks: string; mulai: number }[] })
  | (Dasar & { jenis: 'rating'; gambar: string; angka: number; angkaMulai: number; baris: { teks: string; mulai: number }[] })
  | (Dasar & { jenis: 'klip'; video: string; dari: number; kecepatan?: number; judul?: string; sub?: string; tag?: string; tagMulai?: number; tagTop?: number; chips?: { teks: string; mulai: number }[]; chipTop?: number; ai?: boolean; penuh?: boolean; ukuranJudul?: number; posisiY?: number; zoomAkhir?: number })
  | (Dasar & { jenis: 'ukuran'; gambar: string; judul: string; garis: Garis[]; ai?: boolean })
  | (Dasar & { jenis: 'tapak'; judul: string; skala: number; benda: Benda[] })
  | (Dasar & { jenis: 'jejer'; judul: string; pilihan: { gambar: string; nama: string }[]; ekstra?: { teks: string; mulai: number }[]; gridTop?: number; kartuW?: number; kartuH?: number })
  | (Dasar & { jenis: 'cta'; judul: string; sub: string; warna?: string; gambar?: string; rasioGambar?: number });

// OP-82: garis ukuran (px layar 1080×1920) yang ketarik di atas foto; label di tengah, digeser `geser` px tegak lurus garis.
export type Garis = { x1: number; y1: number; x2: number; y2: number; teks: string; mulai: number; geser?: number; lx?: number; ly?: number };
// OP-82: denah tampak atas (cm × skala px/cm) buat bandingin tapak barang sama benda yang orang kenal (mis. wastafel).
export type Benda = { jenis: 'wastafel' | 'rak'; x: number; lebar: number; dalam: number; teks: string; mulai: number };

export type DataAffiliate = {
  folder: string;
  audio: string;
  bgm: string;
  bgmMulai?: number;
  durasi: number;
  kata: Kata[];
  aksen: string;
  bingkai?: boolean;
  adegan: Adegan[];
  sfx: { src: string; t: number; vol?: number }[];
};

const KUNING = '#ffd400';
const GELAP = '#070b18';
const src = (folder: string, nama: string) => staticFile(`${folder}/${nama}`);
// lebar tampil cutout produk (px layar) & ukuran aslinya; titik fokus di JSON pakai px gambar asli
const LEBAR_PRODUK = 900;
// kartu foto (mode bingkai): posisi & ukuran di layar
const KARTU = { x: 60, y: 560, w: 960, h: 1200 };
const KonteksBingkai = createContext(false);

const LabelAI: React.FC = () => (
  <div style={{ position: 'absolute', left: 48, top: 150, padding: '6px 14px', borderRadius: 8, background: 'rgba(0,0,0,.55)', color: '#fff', fontFamily: MONO, fontSize: 24, letterSpacing: 1 }}>
    ilustrasi AI
  </div>
);

/** Judul raksasa: huruf naik satu-satu (HurufKinetik), tapi dibungkus per kata biar gak patah di tengah kata. */
const Judul: React.FC<{ teks: string; mulai: number; top: number; ukuran?: number; warna?: string }> = ({ teks, mulai, top, ukuran = 118, warna = '#fff' }) => {
  const kata = teks.split(' ');
  let n = 0;
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, top, display: 'flex', flexWrap: 'wrap', columnGap: ukuran * 0.24 }}>
      {kata.map((k, i) => {
        // "|" = paksa ganti baris (OP-82 tas: biar judul gak patah di tempat jelek); judul tanpa "|" tetap sama kayak dulu
        if (k === '|') return <div key={i} style={{ flexBasis: '100%', height: 0 }} />;
        const m = mulai + n * 0.022;
        n += k.length + 1;
        return (
          <HurufKinetik
            key={i}
            teks={k}
            mulai={m}
            jeda={0.022}
            gaya={{ flexWrap: 'nowrap', fontFamily: ANTON, fontSize: ukuran, lineHeight: 1.02, color: warna, textTransform: 'uppercase', textShadow: '0 6px 30px rgba(0,0,0,.55)' }}
          />
        );
      })}
    </div>
  );
};

/** Foto penuh layar + Ken Burns + gradasi gelap atas/bawah biar teks kebaca. */
const FotoLatar: React.FC<{ gambar: string; folder: string; mulai: number; akhir: number; fokus?: Fokus; kocok?: number }> = (props) => {
  const bingkai = useContext(KonteksBingkai);
  return bingkai ? <FotoKartu {...props} /> : <FotoPenuh {...props} />;
};

/** Mode bingkai: latar = foto yang sama di-blur, foto aslinya di kartu (fokus = px kartu 960×1200, digeser ke (480, 520)). */
const FotoKartu: React.FC<{ gambar: string; folder: string; mulai: number; akhir: number; fokus?: Fokus; kocok?: number }> = ({ gambar, folder, mulai, akhir, fokus, kocok = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // pegas kartu dimajuin 0,2 dtk: adegan baru langsung keliatan, gak ada kedip gelap pas ganti adegan (cek 10/10)
  const m = spring({ frame: frame - (mulai - 0.2) * fps, fps, config: { damping: 15, stiffness: 140 } });
  const p = fokus ? maju(t, mulai + 0.5, mulai + 1.4) : 0;
  const z = fokus ? 1.04 + (fokus.zoom - 1.04) * p : antara(t, mulai, akhir + 0.4, 1.02, 1.12, (x) => x);
  return (
    <AbsoluteFill style={{ background: GELAP }}>
      <Img src={src(folder, gambar)} style={{ position: 'absolute', inset: -80, width: 1240, height: 2080, objectFit: 'cover', filter: 'blur(36px) brightness(.55)' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(7,11,24,.75) 0%, rgba(7,11,24,.1) 30%, rgba(7,11,24,.2) 70%, rgba(7,11,24,.8) 100%)' }} />
      <div
        style={{
          position: 'absolute', left: KARTU.x, top: KARTU.y, width: KARTU.w, height: KARTU.h, borderRadius: 36, overflow: 'hidden',
          boxShadow: '0 40px 90px rgba(0,0,0,.6)', border: '3px solid rgba(255,255,255,.18)',
          translate: `0 ${(1 - m) * 160}px`, scale: String(0.94 + 0.06 * m), opacity: Math.min(1, m * 2.5),
        }}
      >
        <Img
          src={src(folder, gambar)}
          style={{
            position: 'absolute', inset: 0, width: KARTU.w, height: KARTU.h, objectFit: 'cover',
            transformOrigin: fokus ? `${fokus.x}px ${fokus.y}px` : '50% 40%', scale: String(z),
            translate: fokus ? `${(480 - fokus.x) * p}px ${(520 - fokus.y) * p}px` : kocok ? getar(t, kocok, 20, 1.2) : undefined,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/** Foto penuh layar + Ken Burns + gradasi gelap atas/bawah biar teks kebaca. */
const FotoPenuh: React.FC<{ gambar: string; folder: string; mulai: number; akhir: number; fokus?: Fokus; kocok?: number }> = ({ gambar, folder, mulai, akhir, fokus, kocok = 0 }) => {
  const t = useDetik();
  // fokus (px layar): zoom ke titik itu sambil digeser ke (540, 900), di atas zona subtitle
  const p = fokus ? maju(t, mulai + 0.5, mulai + 1.4) : 0;
  const z = fokus ? 1.06 + (fokus.zoom - 1.06) * p : antara(t, mulai, akhir, 1.04, 1.16, (x) => x);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: GELAP }}>
      <Img
        src={src(folder, gambar)}
        style={{
          position: 'absolute', inset: 0, width: 1080, height: 1920, objectFit: 'cover',
          transformOrigin: fokus ? `${fokus.x}px ${fokus.y}px` : '50% 45%', scale: String(z), translate: fokus ? `${(540 - fokus.x) * p}px ${(900 - fokus.y) * p}px` : kocok ? getar(t, kocok, 26, 1.4) : undefined,
        }}
      />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(7,11,24,.85) 0%, rgba(7,11,24,.15) 32%, rgba(7,11,24,.1) 58%, rgba(7,11,24,.88) 100%)' }} />
    </AbsoluteFill>
  );
};

/** Latar studio produk: gradasi biru gelap + lingkaran cahaya aksen + grid tipis yang geser. */
const Studio: React.FC<{ aksen: string }> = ({ aksen }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 46%, ${aksen}55 0%, ${GELAP} 62%)` }}>
      <AbsoluteFill
        style={{
          background: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px) 0 0/80px 80px, linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px) 0 0/80px 80px',
          backgroundPosition: `${(f * 0.6) % 80}px ${(f * 0.9) % 80}px`,
          maskImage: 'radial-gradient(circle at 50% 50%, #000 30%, transparent 75%)',
        }}
      />
    </AbsoluteFill>
  );
};

/** Produk cutout di tengah, opsional zoom ke titik (px gambar asli, dihitung dari lebar asli `asli`). */
const Produk: React.FC<{ folder: string; produk: string; mulai: number; fokus?: Fokus; asli?: number; y?: number; putar?: boolean }> = ({ folder, produk, mulai, fokus, asli = 640, y = 960, putar }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const m = spring({ frame: frame - mulai * fps, fps, config: { damping: 13, stiffness: 120, mass: 0.9 } });
  const skala = LEBAR_PRODUK / asli;
  // zoom ke titik fokus sambil titik itu digeser ke tengah layar (x 540, y)
  const p = fokus ? maju(t, mulai + 0.1, mulai + 0.9) : 0;
  const z = fokus ? 1 + (fokus.zoom - 1) * p : 1;
  const ox = fokus ? fokus.x * skala : LEBAR_PRODUK / 2;
  const oy = fokus ? fokus.y * skala : 350;
  const melayang = Math.sin(t * 1.6) * 10;
  return (
    <div
      style={{
        position: 'absolute', left: 540 - LEBAR_PRODUK / 2, top: y - 350 + melayang, width: LEBAR_PRODUK,
        transformOrigin: `${ox}px ${oy}px`,
        transform: `translate(${(LEBAR_PRODUK / 2 - ox) * p}px, ${(350 - oy) * p}px) scale(${z * (putar ? 0.6 + 0.4 * m : 1)}) rotate(${putar ? (1 - m) * -28 : 0}deg)`,
        opacity: Math.min(1, m * 2),
        filter: 'drop-shadow(0 40px 60px rgba(0,0,0,.6))',
      }}
    >
      <Img src={src(folder, produk)} style={{ width: LEBAR_PRODUK }} />
    </div>
  );
};

const Magnet: React.FC<{ x: number; y: number; mulai: number; aksen: string }> = ({ x, y, mulai, aksen }) => {
  const t = useDetik();
  if (t < mulai) return null;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
      {[0, 1, 2, 3].map((i) => {
        const fase = ((t - mulai) * 0.9 + i / 4) % 1;
        return <circle key={i} cx={x} cy={y} r={90 + fase * 380} fill="none" stroke={aksen} strokeWidth={6 * (1 - fase) + 1} opacity={(1 - fase) * 0.9} />;
      })}
    </svg>
  );
};

const Putar: React.FC<{ x: number; y: number; mulai: number; aksen: string }> = ({ x, y, mulai, aksen }) => {
  const t = useDetik();
  const m = maju(t, mulai, mulai + 0.5);
  const sudut = antara(t, mulai + 0.3, mulai + 2.2, -40, 140);
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: m }}>
      <g transform={`translate(${x} ${y}) rotate(${sudut})`}>
        {Array.from({ length: 36 }).map((_, i) => (
          <line key={i} x1={0} y1={-250} x2={0} y2={i % 3 === 0 ? -290 : -270} stroke={i % 3 === 0 ? KUNING : aksen} strokeWidth={i % 3 === 0 ? 8 : 4} transform={`rotate(${i * 10})`} />
        ))}
        <circle r={232} fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={3} strokeDasharray="6 14" />
      </g>
    </svg>
  );
};

const Chip: React.FC<{ teks: string; sub?: string; mulai: number; aktif: boolean; aksen: string; top: number }> = ({ teks, sub, mulai, aktif, aksen, top }) => {
  const s = usePunch(mulai, 0.14);
  return (
    <Muncul mulai={mulai} dari="kanan" jarak={220} gaya={{ left: 70, right: 70, top }}>
      <div
        style={{
          scale: String(s), borderRadius: 28, padding: '26px 34px', display: 'flex', alignItems: 'center', gap: 26,
          background: aktif ? aksen : 'rgba(255,255,255,.1)', border: `3px solid ${aktif ? '#fff' : 'rgba(255,255,255,.25)'}`,
          boxShadow: aktif ? `0 0 60px ${aksen}` : 'none',
        }}
      >
        <div style={{ width: 54, height: 54, borderRadius: 27, border: '5px solid #fff', background: aktif ? KUNING : 'transparent', flexShrink: 0 }} />
        <div>
          <div style={{ fontFamily: ANTON, fontSize: 72, color: '#fff', lineHeight: 1 }}>{teks}</div>
          {sub ? <div style={{ fontFamily: MONO, fontSize: 30, color: 'rgba(255,255,255,.85)', marginTop: 8 }}>{sub}</div> : null}
        </div>
      </div>
    </Muncul>
  );
};

const Spek: React.FC<{ teks: string; mulai: number; hitung?: number; akhiran?: string; top: number; aksen: string }> = ({ teks, mulai, hitung, akhiran = '', top, aksen }) => {
  const t = useDetik();
  const s = usePunch(mulai, 0.2);
  const n = hitung ? Math.round(antara(t, mulai, mulai + 0.8, 0, hitung)) : 0;
  return (
    <Muncul mulai={mulai} dari="skala" gaya={{ left: 0, right: 0, top, display: 'flex', justifyContent: 'center' }}>
      <div style={{ scale: String(s), padding: '18px 44px', borderRadius: 24, background: 'rgba(7,11,24,.78)', border: `4px solid ${aksen}`, fontFamily: ANTON, fontSize: 104, color: '#fff', lineHeight: 1.05 }}>
        {hitung ? `${n.toLocaleString('id-ID')}${akhiran}` : teks}
      </div>
    </Muncul>
  );
};

const Keranjang: React.FC<{ mulai: number; x?: number; y?: number }> = ({ mulai, x = 110, y = 1440 }) => {
  const t = useDetik();
  const loncat = Math.abs(Math.sin((t - mulai) * 5)) * 26;
  return (
    <Muncul mulai={mulai} dari="bawah" gaya={{ left: x, top: y }}>
      <svg width={300} height={260} viewBox="0 0 300 260" style={{ translate: `0 ${-loncat}px` }}>
        <path d="M30 60 H80 L110 180 H240 L270 90 H95" fill="none" stroke={GELAP} strokeWidth={22} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={125} cy={225} r={20} fill={GELAP} />
        <circle cx={225} cy={225} r={20} fill={GELAP} />
      </svg>
    </Muncul>
  );
};

const Lencana: React.FC<{ teks: string; mulai: number; top: number; aksen: string; miring: number }> = ({ teks, mulai, top, aksen, miring }) => {
  const s = usePunch(mulai, 0.25);
  return (
    <Muncul mulai={mulai} dari="putar" gaya={{ left: 0, right: 0, top, display: 'flex', justifyContent: 'center' }}>
      <div style={{ scale: String(s), rotate: `${miring}deg`, padding: '16px 40px', border: `6px solid ${KUNING}`, borderRadius: 18, fontFamily: ANTON, fontSize: 84, color: KUNING, background: `${aksen}33` }}>{teks}</div>
    </Muncul>
  );
};

const AdeganView: React.FC<{ a: Adegan; d: DataAffiliate }> = ({ a, d }) => {
  const f = d.folder;
  switch (a.jenis) {
    case 'klip':
      return (
        <>
          <KlipVideo a={a} folder={f} />
          {a.judul ? <Judul teks={a.judul} mulai={a.mulai + 0.05} top={230} ukuran={a.ukuranJudul ?? 120} /> : null}
          {a.tag ? (
            <Muncul mulai={a.tagMulai ?? a.mulai + 0.9} dari="bawah" gaya={{ left: 0, right: 0, top: a.tagTop ?? 400, display: 'flex', justifyContent: 'center' }}>
              <div style={{ fontFamily: ANTON, fontSize: 64, color: GELAP, background: KUNING, padding: '8px 30px', borderRadius: 14 }}>{a.tag}</div>
            </Muncul>
          ) : null}
          {a.sub ? (
            <Muncul mulai={a.mulai + 0.5} dari="kiri" gaya={{ left: 64, top: 470 }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: '#fff', background: '#e0302e', padding: '10px 20px', borderRadius: 10 }}>{a.sub}</div>
            </Muncul>
          ) : null}
          {/* chipTop (OP-82 tas): posisi chip di klip bisa diatur biar gak nutup produk; bawaan 1450 = video lama sama persis */}
          <div style={{ position: 'absolute', left: 50, right: 50, top: a.chipTop ?? 1450, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
            {(a.chips ?? []).map((c, i) => <ChipKecil key={i} teks={c.teks} mulai={c.mulai} aksen={d.aksen} />)}
          </div>
          {a.ai ? <LabelAI /> : null}
        </>
      );
    case 'hook':
      return (
        <>
          <FotoLatar gambar={a.gambar} folder={f} mulai={a.mulai} akhir={a.akhir} kocok={a.getarDi} />
          <Judul teks={a.judul} mulai={a.mulai + 0.05} top={230} ukuran={132} />
          {a.ai ? <LabelAI /> : null}
        </>
      );
    case 'sorot':
      return <Sorot a={a} d={d} />;
    case 'reveal':
      return (
        <>
          {a.gambar ? <FotoLatar gambar={a.gambar} folder={f} mulai={a.mulai + 0.15} akhir={a.akhir} /> : <Studio aksen={d.aksen} />}
          <WipeLingkaran t0={a.mulai} warna={d.aksen} lama={0.5} />
          {a.produk ? <Produk folder={f} produk={a.produk} mulai={a.mulai + 0.25} y={1000} putar /> : null}
          <Judul teks={a.nama} mulai={a.mulai + 0.35} top={230} ukuran={128} />
          <Muncul mulai={a.mulai + 1.6} dari="bawah" gaya={{ left: 0, right: 0, top: 400, display: 'flex', justifyContent: 'center' }}>
            <div style={{ fontFamily: ANTON, fontSize: 70, color: GELAP, background: KUNING, padding: '10px 34px', borderRadius: 14 }}>{a.tag}</div>
          </Muncul>
        </>
      );
    case 'detail': {
      return (
        <>
          <Studio aksen={d.aksen} />
          <Produk folder={f} produk={a.produk} mulai={a.mulai - 1} fokus={a.fokus} y={1000} />
          {a.efek === 'magnet' ? <Magnet x={540} y={1000} mulai={a.mulai + 0.6} aksen={d.aksen} /> : <Putar x={540} y={1000} mulai={a.mulai + 0.5} aksen={d.aksen} />}
          <Judul teks={a.judul} mulai={a.mulai + 0.1} top={230} ukuran={116} />
          {a.sub ? (
            <Muncul mulai={a.mulai + 0.7} dari="kiri" gaya={{ left: 64, top: 520 }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: GELAP, background: '#fff', padding: '10px 20px', borderRadius: 10 }}>{a.sub}</div>
            </Muncul>
          ) : null}
        </>
      );
    }
    case 'pilihan': {
      return (
        <>
          <FotoLatar gambar={a.gambar} folder={f} mulai={a.mulai} akhir={a.akhir} />
          <AbsoluteFill style={{ background: 'rgba(7,11,24,.45)' }} />
          <Judul teks={a.judul} mulai={a.mulai + 0.1} top={230} ukuran={a.ukuranJudul ?? 116} />
          <PilihanChip opsi={a.opsi} aksen={d.aksen} top={a.chipTop} jarak={a.jarakChip} />
          {a.ai ? <LabelAI /> : null}
        </>
      );
    }
    case 'spek':
      return (
        <>
          <GantiFoto gambar={a.gambar} folder={f} mulai={a.mulai} akhir={a.akhir} />
          {a.item.map((it, i) => (
            <Spek key={i} teks={it.teks} mulai={it.mulai} hitung={it.hitung} akhiran={it.akhiran} top={420 + i * 190} aksen={d.aksen} />
          ))}
          {a.ai ? <LabelAI /> : null}
        </>
      );
    case 'percaya':
      return (
        <>
          <Studio aksen={d.aksen} />
          <Produk folder={f} produk={a.produk} mulai={a.mulai - 0.2} y={900} />
          {a.lencana.map((l, i) => (
            <Lencana key={i} teks={l.teks} mulai={l.mulai} top={250 + i * 165} aksen={d.aksen} miring={i % 2 ? 3 : -3} />
          ))}
        </>
      );
    case 'warna':
      return <Warna a={a} d={d} />;
    case 'ukuran':
      return (
        <>
          <FotoUkur a={a} d={d} />
          <Judul teks={a.judul} mulai={a.mulai + 0.05} top={230} ukuran={116} />
          {a.ai ? <LabelAI /> : null}
        </>
      );
    case 'jejer':
      return <Jejer a={a} d={d} />;
    case 'tapak':
      return (
        <>
          <Tapak a={a} d={d} />
          <Judul teks={a.judul} mulai={a.mulai + 0.05} top={230} ukuran={116} />
        </>
      );
    case 'rating':
      return (
        <>
          <FotoLatar gambar={a.gambar} folder={f} mulai={a.mulai} akhir={a.akhir} />
          {/* lapisan gelap cuma buat foto penuh layar; di mode kartu angkanya udah di atas kartu (foto jadi kegelapan, cek 10/10) */}
          {d.bingkai ? null : <AbsoluteFill style={{ background: 'rgba(7,11,24,.35)' }} />}
          <Rating angka={a.angka} mulai={a.angkaMulai} />
          {a.baris.map((b, i) => (
            <Lencana key={i} teks={b.teks} mulai={b.mulai} top={700 + i * 190} aksen={d.aksen} miring={i % 2 ? 2 : -2} />
          ))}
        </>
      );
    case 'cta':
      if (a.gambar) return <CtaFoto a={a} d={d} />;
      return (
        <AbsoluteFill style={{ background: a.warna ?? KUNING }}>
          <WipeLingkaran t0={a.mulai} warna={a.warna ?? KUNING} x={200} y={1600} lama={0.45} />
          <Judul teks={a.judul} mulai={a.mulai + 0.15} top={300} ukuran={140} warna={GELAP} />
          <Muncul mulai={a.mulai + 0.8} dari="kiri" gaya={{ left: 64, top: 1060 }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 44, color: '#fff', background: GELAP, padding: '12px 24px', borderRadius: 12 }}>{a.sub}</div>
          </Muncul>
          <Keranjang mulai={a.mulai + 0.5} />
        </AbsoluteFill>
      );
  }
};

/** Foto + zoom ke titik fokus + judul (OP-82: bisa ganti foto & chip di adegan yang sama). */
const Sorot: React.FC<{ a: Extract<Adegan, { jenis: 'sorot' }>; d: DataAffiliate }> = ({ a, d }) => {
  // OP-82: `ganti` = foto berikutnya di adegan yang sama (mis. botol → bahan), masing-masing masuk ulang pakai pegas kartu
  const urut = [{ gambar: a.gambar, mulai: a.mulai, fokus: a.fokus as Fokus | undefined }, ...(a.ganti ?? [])];
  const tNow = useDetik();
  let k = 0;
  urut.forEach((u, i) => { if (tNow >= u.mulai) k = i; });
  const kini = urut[k];
  const akhirKini = urut[k + 1]?.mulai ?? a.akhir;
  return (
    <>
      <FotoLatar key={kini.gambar} gambar={kini.gambar} folder={d.folder} mulai={kini.mulai} akhir={akhirKini} fokus={kini.fokus} />
      {a.lingkar ? <Lingkar {...a.lingkar} mulai={a.mulai + 0.9} /> : null}
      <Judul teks={a.judul} mulai={a.mulai + 0.1} top={230} ukuran={a.ukuranJudul ?? 120} />
      {a.chips ? (
        <div style={{ position: 'absolute', left: 50, right: 50, top: a.chipTop ?? 1450, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
          {a.chips.map((c, i) => <ChipKecil key={i} teks={c.teks} mulai={c.mulai} aksen={d.aksen} />)}
        </div>
      ) : null}
      {a.sub ? (
        <Muncul mulai={a.mulai + 0.5} dari="kiri" gaya={{ left: 64, top: 520 }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: '#fff', background: '#e0302e', padding: '10px 20px', borderRadius: 10 }}>{a.sub}</div>
        </Muncul>
      ) : null}
      {a.ai ? <LabelAI /> : null}
    </>
  );
};

/** Ganti-ganti warna cepet: tiap foto varian 1 potong + chip nama warna + hitungan n/N. */
const Warna: React.FC<{ a: Extract<Adegan, { jenis: 'warna' }>; d: DataAffiliate }> = ({ a, d }) => {
  const t = useDetik();
  const n = a.pilihan.length;
  const per = (a.akhir - a.mulai) / n;
  const i = Math.max(0, Math.min(n - 1, Math.floor((t - a.mulai) / per)));
  const kini = a.pilihan[i];
  const s = usePunch(a.mulai + i * per, 0.06);
  return (
    <>
      <AbsoluteFill style={{ scale: String(s) }}>
        <FotoLatar key={kini.gambar} gambar={kini.gambar} folder={d.folder} mulai={a.mulai + i * per - 0.25} akhir={a.mulai + (i + 1) * per} />
      </AbsoluteFill>
      <Judul teks={a.judul} mulai={a.mulai + 0.05} top={230} ukuran={124} />
      <div style={{ position: 'absolute', left: 60, top: 400, display: 'flex', gap: 16 }}>
        {(a.ekstra ?? []).map((e, k) => (
          <Muncul key={k} mulai={e.mulai} dari="skala" gaya={{ position: 'relative' }}>
            <div style={{ fontFamily: ANTON, fontSize: 68, color: '#fff', border: `4px solid ${d.aksen}`, background: 'rgba(7,11,24,.7)', padding: '4px 26px', borderRadius: 14 }}>{e.teks}</div>
          </Muncul>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1600, display: 'flex', justifyContent: 'center', gap: 18 }}>
        <div style={{ fontFamily: ANTON, fontSize: 64, color: GELAP, background: KUNING, padding: '8px 30px', borderRadius: 14, textTransform: 'uppercase' }}>{kini.nama}</div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: '#fff', background: 'rgba(0,0,0,.6)', padding: '18px 22px', borderRadius: 14 }}>{i + 1}/{n}</div>
      </div>
    </>
  );
};

/** OP-82: foto di kartu + garis ukuran yang ketarik satu-satu. Foto & garis di-zoom bareng biar garis tetap nempel di barangnya. */
const FotoUkur: React.FC<{ a: Extract<Adegan, { jenis: 'ukuran' }>; d: DataAffiliate }> = ({ a, d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const m = spring({ frame: frame - (a.mulai - 0.2) * fps, fps, config: { damping: 15, stiffness: 140 } });
  const z = antara(t, a.mulai, a.akhir + 0.4, 1, 1.06, (x) => x);
  return (
    <AbsoluteFill style={{ background: GELAP }}>
      <Img src={src(d.folder, a.gambar)} style={{ position: 'absolute', inset: -80, width: 1240, height: 2080, objectFit: 'cover', filter: 'blur(36px) brightness(.5)' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(7,11,24,.75) 0%, rgba(7,11,24,.1) 30%, rgba(7,11,24,.2) 70%, rgba(7,11,24,.8) 100%)' }} />
      <AbsoluteFill style={{ transformOrigin: '540px 1160px', scale: String(z) }}>
        <div
          style={{
            position: 'absolute', left: KARTU.x, top: KARTU.y, width: KARTU.w, height: KARTU.h, borderRadius: 36, overflow: 'hidden',
            boxShadow: '0 40px 90px rgba(0,0,0,.6)', border: '3px solid rgba(255,255,255,.18)',
            translate: `0 ${(1 - m) * 160}px`, opacity: Math.min(1, m * 2.5),
          }}
        >
          <Img src={src(d.folder, a.gambar)} style={{ position: 'absolute', inset: 0, width: KARTU.w, height: KARTU.h, objectFit: 'cover', filter: 'brightness(.82)' }} />
        </div>
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {a.garis.map((g, i) => {
            const p = maju(t, g.mulai, g.mulai + 0.45);
            const pj = Math.hypot(g.x2 - g.x1, g.y2 - g.y1);
            const nx = -(g.y2 - g.y1) / pj, ny = (g.x2 - g.x1) / pj; // arah tegak lurus garis
            const tk = 26 * maju(t, g.mulai + 0.3, g.mulai + 0.5);
            return (
              <g key={i} opacity={t >= g.mulai - 0.05 ? 1 : 0}>
                <line x1={g.x1} y1={g.y1} x2={g.x1 + (g.x2 - g.x1) * p} y2={g.y1 + (g.y2 - g.y1) * p} stroke={KUNING} strokeWidth={9} strokeLinecap="round" />
                {[[g.x1, g.y1], [g.x2, g.y2]].map(([x, y], k) => (
                  <line key={k} x1={x - nx * tk} y1={y - ny * tk} x2={x + nx * tk} y2={y + ny * tk} stroke={KUNING} strokeWidth={9} strokeLinecap="round" />
                ))}
              </g>
            );
          })}
        </svg>
        {a.garis.map((g, i) => {
          const pj = Math.hypot(g.x2 - g.x1, g.y2 - g.y1);
          const gs = g.geser ?? 70;
          const x = g.lx ?? (g.x1 + g.x2) / 2 - ((g.y2 - g.y1) / pj) * gs;
          const y = g.ly ?? (g.y1 + g.y2) / 2 + ((g.x2 - g.x1) / pj) * gs;
          return (
            <Muncul key={i} mulai={g.mulai + 0.25} dari="skala" gaya={{ left: x - 200, top: y - 50, width: 400, display: 'flex', justifyContent: 'center' }}>
              <LabelUkur teks={g.teks} mulai={g.mulai + 0.25} aksen={d.aksen} />
            </Muncul>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const LabelUkur: React.FC<{ teks: string; mulai: number; aksen: string }> = ({ teks, mulai, aksen }) => {
  const s = usePunch(mulai, 0.22);
  return (
    <div style={{ scale: String(s), fontFamily: ANTON, fontSize: 74, lineHeight: 1.05, color: GELAP, background: KUNING, padding: '4px 26px', borderRadius: 16, border: `4px solid ${aksen}`, whiteSpace: 'nowrap', boxShadow: '0 10px 30px rgba(0,0,0,.45)' }}>
      {teks}
    </div>
  );
};

/** OP-82: denah tampak atas meja dapur. Wastafel digambar polos (tanpa angka), barangnya pakai ukuran asli dari listing. */
const Tapak: React.FC<{ a: Extract<Adegan, { jenis: 'tapak' }>; d: DataAffiliate }> = ({ a, d }) => {
  const t = useDetik();
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const MEJA_Y = 760; // tepi dinding (atas meja)
  const masuk = maju(t, a.mulai - 0.15, a.mulai + 0.35);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, ${d.aksen}40 0%, ${GELAP} 70%)` }}>
      {/* dinding + meja */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: MEJA_Y - 70, height: 70, background: 'repeating-linear-gradient(90deg, #cfd6df 0 118px, #b9c2cd 118px 122px)', opacity: masuk }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: MEJA_Y, height: 520, background: 'linear-gradient(180deg, #e9e4dc, #d8d1c6)', opacity: masuk, boxShadow: 'inset 0 18px 30px rgba(0,0,0,.18)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: MEJA_Y + 520, height: 22, background: '#a99f91', opacity: masuk }} />
      {a.benda.map((b, i) => {
        const w = b.lebar * a.skala, h = b.dalam * a.skala;
        const m = spring({ frame: frame - b.mulai * fps, fps, config: { damping: 12, stiffness: 150 } });
        const top = MEJA_Y + 40;
        const gaya: React.CSSProperties = { position: 'absolute', left: b.x, top: top - (1 - m) * 120, width: w, height: h, opacity: Math.min(1, m * 2) };
        return (
          <React.Fragment key={i}>
            {b.jenis === 'wastafel' ? (
              <div style={{ ...gaya, borderRadius: 26, background: '#f4f6f8', border: '6px solid #9aa4b1', boxShadow: '0 12px 26px rgba(0,0,0,.25)' }}>
                <div style={{ position: 'absolute', inset: 34, borderRadius: 40, background: 'radial-gradient(circle at 50% 60%, #b8c2cc 0%, #dfe5ea 70%)', boxShadow: 'inset 0 10px 24px rgba(0,0,0,.25)' }} />
                <div style={{ position: 'absolute', left: '50%', top: '60%', width: 36, height: 36, marginLeft: -18, borderRadius: 18, background: '#7d8794' }} />
                <div style={{ position: 'absolute', left: '50%', top: -6, width: 34, height: 70, marginLeft: -17, borderRadius: 12, background: '#8d96a3' }} />
              </div>
            ) : (
              <div style={{ ...gaya, borderRadius: 10, border: `8px solid ${d.aksen}`, background: `repeating-linear-gradient(90deg, ${d.aksen}66 0 6px, transparent 6px 34px), rgba(255,255,255,.35)`, boxShadow: `0 0 0 6px #fff, 0 16px 40px rgba(0,0,0,.35)` }} />
            )}
            <Muncul mulai={b.mulai + 0.25} dari="skala" gaya={{ left: b.x - 100, top: top + h + 40, width: w + 200, display: 'flex', justifyContent: 'center' }}>
              {b.jenis === 'wastafel' ? (
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: GELAP, background: 'rgba(255,255,255,.85)', padding: '6px 18px', borderRadius: 10 }}>{b.teks}</div>
              ) : (
                <LabelUkur teks={b.teks} mulai={b.mulai + 0.25} aksen={d.aksen} />
              )}
            </Muncul>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

/** OP-82: penutup dengan FOTO PRODUK ASLI di kartu tengah (gak kosong) + nama produk + keranjang lompat. */
const CtaFoto: React.FC<{ a: Extract<Adegan, { jenis: 'cta' }>; d: DataAffiliate }> = ({ a, d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const latar = a.warna ?? KUNING;
  const r = a.rasioGambar ?? 0.8;
  const W = r >= 1 ? 780 : 700, H = Math.round(W / r);
  const m = spring({ frame: frame - (a.mulai + 0.1) * fps, fps, config: { damping: 13, stiffness: 130 } });
  const z = antara(t, a.mulai, a.akhir + 0.5, 1.02, 1.1, (x) => x);
  const atas = 410;
  return (
    <AbsoluteFill style={{ background: latar }}>
      <WipeLingkaran t0={a.mulai} warna={latar} x={540} y={900} lama={0.45} />
      <Judul teks={a.judul} mulai={a.mulai + 0.15} top={200} ukuran={130} warna={GELAP} />
      <div
        style={{
          position: 'absolute', left: (1080 - W) / 2, top: atas, width: W, height: H, borderRadius: 36, overflow: 'hidden', background: '#fff',
          border: `6px solid ${GELAP}`, boxShadow: '0 30px 70px rgba(7,11,24,.35)', opacity: Math.min(1, m * 2),
          scale: String(0.8 + 0.2 * m), rotate: `${(1 - m) * -6}deg`,
        }}
      >
        <Img src={src(d.folder, a.gambar!)} style={{ width: W, height: H, objectFit: 'cover', scale: String(z) }} />
      </div>
      <Muncul mulai={a.mulai + 0.6} dari="bawah" gaya={{ left: 0, right: 0, top: atas + H + 40, display: 'flex', justifyContent: 'center' }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: '#fff', background: GELAP, padding: '12px 24px', borderRadius: 12 }}>{a.sub}</div>
      </Muncul>
      <Keranjang mulai={a.mulai + 0.5} x={390} y={atas + H + 150} />
    </AbsoluteFill>
  );
};

/** OP-82: 4 varian dijejerin 2×2 (foto asli), muncul satu-satu + nama warna; chip ekstra (jumlah warna, ukuran) di atas. */
const Jejer: React.FC<{ a: Extract<Adegan, { jenis: 'jejer' }>; d: DataAffiliate }> = ({ a, d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const W = a.kartuW ?? 465, H = a.kartuH ?? 585, GAP = 30, KIRI = (1080 - 2 * W - GAP) / 2, ATAS = a.gridTop ?? 560;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 60%, ${d.aksen}55 0%, ${GELAP} 70%)` }}>
      {a.pilihan.slice(0, 4).map((p, i) => {
        const c = i % 2, r = Math.floor(i / 2);
        const m0 = a.mulai - 0.1 + i * 0.16;
        const m = spring({ frame: frame - m0 * fps, fps, config: { damping: 14, stiffness: 150 } });
        const z = antara(t, m0, a.akhir + 0.5, 1.04, 1.14, (x) => x);
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: KIRI + c * (W + GAP), top: ATAS + r * (H + GAP), width: W, height: H, borderRadius: 28, overflow: 'hidden',
              border: '3px solid rgba(255,255,255,.25)', boxShadow: '0 24px 60px rgba(0,0,0,.5)', opacity: Math.min(1, m * 2), scale: String(0.85 + 0.15 * m),
              translate: `0 ${(1 - m) * 80}px`, background: '#fff',
            }}
          >
            <Img src={src(d.folder, p.gambar)} style={{ width: W, height: H, objectFit: 'cover', scale: String(z) }} />
            <div style={{ position: 'absolute', left: 16, bottom: 16, fontFamily: ANTON, fontSize: 44, color: GELAP, background: KUNING, padding: '2px 18px', borderRadius: 10, textTransform: 'uppercase' }}>
              {p.nama}
            </div>
          </div>
        );
      })}
      <Judul teks={a.judul} mulai={a.mulai + 0.05} top={230} ukuran={116} />
      <div style={{ position: 'absolute', left: 60, top: 400, display: 'flex', gap: 16 }}>
        {(a.ekstra ?? []).map((e, k) => (
          <Muncul key={k} mulai={e.mulai} dari="skala" gaya={{ position: 'relative' }}>
            <div style={{ fontFamily: ANTON, fontSize: 64, color: '#fff', border: `4px solid ${d.aksen}`, background: 'rgba(7,11,24,.7)', padding: '4px 24px', borderRadius: 14 }}>{e.teks}</div>
          </Muncul>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** Angka rating ngebut ke nilai akhir + bintang yang nyala satu-satu. */
const Rating: React.FC<{ angka: number; mulai: number }> = ({ angka, mulai }) => {
  const t = useDetik();
  const nilai = antara(t, mulai - 0.3, mulai + 0.6, Math.max(0, angka - 0.9), angka);
  const s = usePunch(mulai + 0.6, 0.15);
  return (
    <Muncul mulai={mulai - 0.4} dari="skala" gaya={{ left: 0, right: 0, top: 260, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ scale: String(s), fontFamily: ANTON, fontSize: 220, color: '#fff', lineHeight: 1, textShadow: '0 10px 40px rgba(0,0,0,.6)' }}>
        {nilai.toFixed(1).replace('.', ',')}
      </div>
      <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
        {[0, 1, 2, 3, 4].map((k) => (
          <svg key={k} width={78} height={78} viewBox="0 0 24 24" style={{ opacity: maju(t, mulai - 0.2 + k * 0.12, mulai + k * 0.12) }}>
            <path d="M12 2l3.1 6.6 7.1.8-5.3 4.8 1.5 7-6.4-3.7-6.4 3.7 1.5-7L1.8 9.4l7.1-.8z" fill={KUNING} />
          </svg>
        ))}
      </div>
    </Muncul>
  );
};

/** Klip video (muted) mulai detik `dari`, dirender di kartu (mode bingkai) atau penuh layar. */
const KlipVideo: React.FC<{ a: Extract<Adegan, { jenis: 'klip' }>; folder: string }> = ({ a, folder }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bingkai = useContext(KonteksBingkai);
  const m = spring({ frame: frame - (a.mulai - 0.2) * fps, fps, config: { damping: 15, stiffness: 140 } });
  const t = frame / fps;
  const z = antara(t, a.mulai, a.akhir + 0.3, 1.02, a.zoomAkhir ?? 1.1, (x) => x);
  // OP-82 outer: posisiY (0–100) = bagian video yang dipertahanin di kartu (objectPosition + titik zoom), mis. 100 = bawah gak kepotong
  // (ujung baju di tepi bawah klip); zoomAkhir = zoom akhir pelan (bawaan 1,1). Dua-duanya kosong = video lama sama persis.
  const posisi: React.CSSProperties = a.posisiY === undefined ? {} : { objectPosition: `50% ${a.posisiY}%`, transformOrigin: `50% ${a.posisiY}%` };
  const vid = (gaya: React.CSSProperties) => (
    <Sequence from={Math.round(a.mulai * fps)} layout="none">
      <OffthreadVideo src={src(folder, a.video)} muted trimBefore={Math.round(a.dari * fps)} playbackRate={a.kecepatan ?? 1} style={gaya} />
    </Sequence>
  );
  if (!bingkai) return <AbsoluteFill style={{ background: GELAP, overflow: 'hidden' }}>{vid({ width: 1080, height: 1920, objectFit: 'cover', scale: String(z) })}</AbsoluteFill>;
  // OP-82: klip 9:16 (adegan AI 720p) tampil penuh layar walau video lain pakai kartu; gradasi atas/bawah biar judul & subtitle kebaca
  if (a.penuh)
    return (
      <AbsoluteFill style={{ background: GELAP, overflow: 'hidden' }}>
        {vid({ width: 1080, height: 1920, objectFit: 'cover', scale: String(z) })}
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(7,11,24,.8) 0%, rgba(7,11,24,.05) 26%, rgba(7,11,24,0) 55%, rgba(7,11,24,.6) 100%)' }} />
      </AbsoluteFill>
    );
  return (
    <AbsoluteFill style={{ background: GELAP }}>
      <div style={{ position: 'absolute', inset: -80, filter: 'blur(36px) brightness(.55)' }}>{vid({ width: 1240, height: 2080, objectFit: 'cover' })}</div>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(7,11,24,.75) 0%, rgba(7,11,24,.1) 30%, rgba(7,11,24,.2) 70%, rgba(7,11,24,.8) 100%)' }} />
      <div
        style={{
          position: 'absolute', left: KARTU.x, top: KARTU.y, width: KARTU.w, height: KARTU.h, borderRadius: 36, overflow: 'hidden',
          boxShadow: '0 40px 90px rgba(0,0,0,.6)', border: '3px solid rgba(255,255,255,.18)',
          translate: `0 ${(1 - m) * 160}px`, scale: String(0.94 + 0.06 * m), opacity: Math.min(1, m * 2.5),
        }}
      >
        {vid({ width: KARTU.w, height: KARTU.h, objectFit: 'cover', scale: String(z), ...posisi })}
      </div>
    </AbsoluteFill>
  );
};

const ChipKecil: React.FC<{ teks: string; mulai: number; aksen: string }> = ({ teks, mulai, aksen }) => {
  const s = usePunch(mulai, 0.2);
  return (
    <Muncul mulai={mulai} dari="skala" gaya={{ position: 'relative' }}>
      <div style={{ scale: String(s), fontFamily: ANTON, fontSize: 66, color: '#fff', background: 'rgba(7,11,24,.82)', border: `4px solid ${aksen}`, padding: '6px 26px', borderRadius: 16 }}>{teks}</div>
    </Muncul>
  );
};

const Lingkar: React.FC<{ x: number; y: number; r: number; mulai: number }> = ({ x, y, r, mulai }) => {
  const t = useDetik();
  const m = maju(t, mulai, mulai + 0.6);
  const kel = 2 * Math.PI * r;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
      <circle cx={x} cy={y} r={r} fill="none" stroke="#e0302e" strokeWidth={12} strokeDasharray={kel} strokeDashoffset={kel * (1 - m)} strokeLinecap="round" transform={`rotate(-90 ${x} ${y})`} />
    </svg>
  );
};

const PilihanChip: React.FC<{ opsi: { teks: string; sub: string; mulai: number }[]; aksen: string; top?: number; jarak?: number }> = ({ opsi, aksen, top = 760, jarak = 230 }) => {
  const t = useDetik();
  let aktif = -1;
  opsi.forEach((o, i) => { if (t >= o.mulai) aktif = i; });
  return (
    <>
      {opsi.map((o, i) => (
        <Chip key={i} teks={o.teks} sub={o.sub} mulai={o.mulai - 0.15} aktif={aktif === i} aksen={aksen} top={top + i * jarak} />
      ))}
    </>
  );
};

/** Beberapa foto gantian (crossfade + zoom pelan) sepanjang adegan. */
const GantiFoto: React.FC<{ gambar: string[]; folder: string; mulai: number; akhir: number }> = ({ gambar, folder, mulai, akhir }) => {
  const t = useDetik();
  const bingkai = useContext(KonteksBingkai);
  const per = (akhir - mulai) / gambar.length;
  if (bingkai) {
    const i = Math.max(0, Math.min(gambar.length - 1, Math.floor((t - mulai) / per)));
    return <FotoLatar key={gambar[i]} gambar={gambar[i]} folder={folder} mulai={mulai + i * per - (i ? 0.25 : 0)} akhir={mulai + (i + 1) * per} />;
  }
  return (
    <AbsoluteFill style={{ background: GELAP }}>
      {gambar.map((g, i) => {
        const a = mulai + i * per;
        const o = interpolate(t, [a - 0.25, a + 0.15, a + per - 0.1, a + per + 0.2], [0, 1, 1, i === gambar.length - 1 ? 1 : 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <Img key={g} src={src(folder, g)} style={{ position: 'absolute', inset: 0, width: 1080, height: 1920, objectFit: 'cover', opacity: o, scale: String(antara(t, a, a + per + 0.5, 1.03, 1.12, (x) => x)) }} />
        );
      })}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(7,11,24,.7) 0%, rgba(7,11,24,.35) 40%, rgba(7,11,24,.85) 100%)' }} />
    </AbsoluteFill>
  );
};

/** Subtitle per potongan (maks 3 kata, putus di tanda baca), kata yang lagi diucapin kuning + punch. */
const Subtitle: React.FC<{ kata: Kata[]; gelap: (t: number) => boolean; top?: number }> = ({ kata, gelap, top = 1290 }) => {
  const t = useDetik();
  const potongan: Kata[][] = [];
  let kini: Kata[] = [];
  kata.forEach((k, i) => {
    kini.push(k);
    const jeda = (kata[i + 1]?.mulai ?? 1e9) - k.akhir;
    if (kini.length === 3 || /[.,?!]$/.test(k.t) || jeda > 0.28) { potongan.push(kini); kini = []; }
  });
  if (kini.length) potongan.push(kini);
  const p = potongan.find((x, i) => t >= x[0].mulai - 0.05 && t < (potongan[i + 1]?.[0].mulai ?? x[x.length - 1].akhir + 0.6) - 0.05);
  if (!p) return null;
  const warnaDasar = gelap(t) ? '#0b1020' : '#fff';
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, top, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 30px' }}>
      {p.map((k, i) => {
        const aktif = t >= k.mulai - 0.03 && t < (p[i + 1]?.mulai ?? k.akhir + 0.3) - 0.03;
        return (
          <span
            key={i}
            style={{
              fontFamily: ANTON, fontSize: 92, lineHeight: 1.1, textTransform: 'uppercase',
              color: aktif ? (gelap(t) ? '#e0302e' : KUNING) : warnaDasar,
              WebkitTextStroke: gelap(t) ? undefined : '3px #000', paintOrder: 'stroke fill',
              textShadow: gelap(t) ? undefined : '0 6px 18px rgba(0,0,0,.7)', scale: aktif ? '1.05' : '1', display: 'inline-block',
            }}
          >
            {k.t.replace(/[.,?!]$/, '')}
          </span>
        );
      })}
    </div>
  );
};

export const Affiliate: React.FC<DataAffiliate> = (d) => {
  const { fps } = useVideoConfig();
  const t = useDetik();
  const aktif = d.adegan.findIndex((a, i) => t >= a.mulai && t < (d.adegan[i + 1]?.mulai ?? 1e9));
  const ctaMulai = d.adegan.find((a) => a.jenis === 'cta')?.mulai ?? 1e9;
  return (
    <KonteksBingkai.Provider value={!!d.bingkai}>
    <AbsoluteFill style={{ background: GELAP }}>
      {/* Adegan dirender tanpa Sequence: semua komponen pakai detik ABSOLUT video (frame gak di-reset). */}
      {aktif >= 0 ? <AdeganView key={aktif} a={d.adegan[aktif]} d={d} /> : null}
      {aktif >= 0 && d.adegan[aktif].tanpaSub ? null : <Subtitle kata={d.kata} gelap={(x) => x >= ctaMulai} top={aktif >= 0 ? d.adegan[aktif].subY : undefined} />}
      {d.audio ? <Audio src={src(d.folder, d.audio)} /> : null}
      {d.bgm ? <Audio src={src(d.folder, d.bgm)} trimBefore={Math.round((d.bgmMulai ?? 0) * fps)} volume={(f) => interpolate(f / fps, [0, 0.4, d.durasi - 0.3, d.durasi + 0.7], [0, 0.16, 0.16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} /> : null}
      {d.sfx.map((s, i) => (
        <Sequence key={`s${i}`} from={Math.max(0, Math.round(s.t * fps))}>
          <Audio src={staticFile(s.src)} volume={s.vol ?? 0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
    </KonteksBingkai.Provider>
  );
};

