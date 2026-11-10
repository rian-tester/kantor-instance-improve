// Sampul 9:16 seri explainer generik #2 (contoh, 19/10): rumus sama dengan SampulK1/K3/K5 — label kecil, angka/kata kunci raksasa,
// monitor meja editor berisi visual dunia videonya, satu baris keterangan. Teks penting di tengah (aman grid profil 3:4).
import React from 'react';
import { ANTON, INTER } from "../../src/gerak/seri/meja-editor/font";
import { KD } from "../../src/gerak/seri/meja-editor/seri";
import { Label, Latar, Monitor } from "./SampulKD";
import { IkanMas, KartuViral } from "./ContohMitos8Detik";
import { Wajah } from "./ContohKuleshov";
import { SambungGerak } from "./ContohEditBlind";
import { Still as StillFilm } from "./ContohFps";
import { HpMini, Speaker } from "./ContohTanpaSuara";
import { HpShort, Penghitung } from "./ContohHitungView";
import { AdeganMobil } from "./ContohJumpCut";
import { Figur } from "../../src/gerak/seri/meja-editor/panggung";

const Judul: React.FC<{ y: number; ukuran?: number; warna?: string; children: React.ReactNode }> = ({ y, ukuran = 110, warna = KD.tulang, children }) => (
  <div style={{ position: 'absolute', left: 60, right: 60, top: y, textAlign: 'center', fontFamily: ANTON, fontSize: ukuran, lineHeight: 1.0, color: warna, textTransform: 'uppercase' }}>{children}</div>
);
const Ket: React.FC<{ y: number; children: React.ReactNode; kecil?: string }> = ({ y, children, kecil }) => (
  <>
    <div style={{ position: 'absolute', left: 60, right: 60, top: y, textAlign: 'center', fontFamily: INTER, fontWeight: 800, fontSize: 40, color: KD.tulang }}>{children}</div>
    {kecil ? <div style={{ position: 'absolute', left: 60, right: 60, top: y + 60, textAlign: 'center', fontFamily: INTER, fontWeight: 600, fontSize: 30, color: KD.abu }}>{kecil}</div> : null}
  </>
);
const Stempel: React.FC<{ x: number; y: number; teks: string; rot?: number; ukuran?: number }> = ({ x, y, teks, rot = -8, ukuran = 80 }) => (
  <div style={{ position: 'absolute', left: x, top: y, rotate: `${rot}deg`, padding: '6px 24px', border: `8px solid ${KD.koral}`, borderRadius: 16, fontFamily: ANTON, fontSize: ukuran, color: KD.koral, background: 'rgba(14,13,16,0.82)', whiteSpace: 'nowrap' }}>{teks}</div>
);

export const SampulK2: React.FC = () => (
  <Latar>
    <Label teks="FAKTA VIDEO" y={250} />
    <Judul y={330} ukuran={240} warna={KD.amber}><span style={{ whiteSpace: 'nowrap' }}>8 DETIK?</span></Judul>
    <Judul y={630} ukuran={96}>attention span kalah sama ikan mas</Judul>
    <Monitor x={110} y={880} w={860} h={484}>
      <div style={{ position: 'absolute', left: 30, top: 50, scale: '0.95', transformOrigin: '0 0' }}>
        <KartuViral x={0} y={0} m8={-1} />
      </div>
      <IkanMas x={650} y={250} s={1.6} arah={-1} seed="sp" />
      <Stempel x={90} y={190} teks="SUMBER?" />
    </Monitor>
    <Ket y={1430} kecil="ditelusuri BBC, 2017">angkanya gak punya sumber riset</Ket>
  </Latar>
);

export const SampulK4: React.FC = () => (
  <Latar>
    <Label teks="FAKTA EDITING" y={250} />
    <Judul y={320} ukuran={150}>wajah sama</Judul>
    <Judul y={480} ukuran={150} warna={KD.amber}>3 emosi beda</Judul>
    <Monitor x={110} y={760} w={860} h={484}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: 'absolute', left: 30 + i * 272, top: 90 }}>
          <Wajah w={256} h={200} seed={`sp${i}`} />
          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center' }}>
            <div style={{ padding: '8px 18px', borderRadius: 14, background: KD.amber, fontFamily: INTER, fontWeight: 800, fontSize: 30, color: KD.latar }}>{['mikir', 'sedih', 'senyum'][i]}</div>
          </div>
        </div>
      ))}
    </Monitor>
    <Ket y={1330} kecil="ilustrasi, bukan cuplikan film">efek Kuleshov</Ket>
  </Latar>
);

export const SampulK6: React.FC = () => (
  <Latar>
    <Label teks="FAKTA EDITING" y={250} />
    <Judul y={320} ukuran={300} warna={KD.amber}>1/3 CUT</Judul>
    <Judul y={630} ukuran={110}>gak ketahuan penonton</Judul>
    <Monitor x={110} y={880} w={860} h={484}>
      <SambungGerak x={60} y={60} w={740} h={360} seed="sp" kelewat={1} />
    </Monitor>
    <Ket y={1430} kecil="riset University of Edinburgh, 2008">kalau cut-nya jatuh pas ada gerakan</Ket>
  </Latar>
);

export const SampulK7: React.FC = () => (
  <Latar>
    <Label teks="FAKTA FILM" y={250} />
    <Judul y={300} ukuran={340} warna={KD.amber}>24</Judul>
    <Judul y={660} ukuran={96}>gambar diam per detik, kok kelihatan gerak?</Judul>
    <Monitor x={110} y={960} w={860} h={484}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{ position: 'absolute', left: 24 + i * 166, top: 40 }}>
          <StillFilm w={150} h={150} fase={i / 5} nomor={i + 1} sorot={i === 2} />
        </div>
      ))}
      <div style={{ position: 'absolute', left: 24, top: 220, width: 812, height: 230, borderRadius: 10, background: '#2a2119', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 40, background: '#382c20' }} />
        {[0.15, 0.35, 0.55].map((o, i) => (
          <Figur key={i} x={220 + i * 90} y={192} s={0.82} fase={(0.2 + i * 0.2) % 1} warna={`rgba(239,235,226,${o})`} />
        ))}
        <Figur x={520} y={192} s={0.82} fase={0.8} />
      </div>
    </Monitor>
    <Ket y={1500}>standar film bersuara sejak 1929</Ket>
  </Latar>
);

export const SampulK8: React.FC = () => (
  <Latar>
    <Label teks="FAKTA VIDEO" y={250} />
    <Judul y={300} ukuran={330} warna={KD.amber}>69%</Judul>
    <Judul y={650} ukuran={100}>nonton video tanpa suara di tempat umum</Judul>
    <Monitor x={110} y={960} w={860} h={484}>
      <HpMini x={320} y={40} w={220} h={400}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 24, display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 100, height: 80 }}>
            <Speaker x={50} y={40} s={1} nyala={0} mute={1} />
          </div>
        </div>
      </HpMini>
    </Monitor>
    <Ket y={1500} kecil="survei 5.616 orang dewasa AS, 2019">pasang subtitle di klip kamu</Ket>
  </Latar>
);

export const SampulK9: React.FC = () => (
  <Latar>
    <Label teks="FAKTA YOUTUBE" y={250} />
    <Judul y={310} ukuran={280} warna={KD.amber}>1 VIEW</Judul>
    <Judul y={610} ukuran={104}>begitu shorts mulai diputar</Judul>
    <Monitor x={110} y={900} w={860} h={484}>
      <HpShort x={120} y={24} w={230} h={430} play={-1} progres={0.08} />
      <div style={{ position: 'absolute', left: 430, top: 150 }}>
        <Penghitung x={0} y={0} n={1} ukuran={150} />
      </div>
    </Monitor>
    <Ket y={1460} kecil="yang beneran nonton: cek engaged views">aturan sejak 31 Maret 2025</Ket>
  </Latar>
);

export const SampulK10: React.FC = () => (
  <Latar>
    <Label teks="FAKTA FILM" y={250} />
    <Judul y={320} ukuran={210} warna={KD.amber}>JUMP CUT</Judul>
    <Judul y={570} ukuran={92}>gara-gara film kelebihan durasi <span style={{ whiteSpace: 'nowrap' }}>±1 jam</span></Judul>
    <Monitor x={110} y={900} w={860} h={484}>
      <AdeganMobil W={852} H={476} shot={2} seed="sp" />
    </Monitor>
    <Ket y={1460} kecil="ilustrasi, bukan cuplikan film">di film Breathless (1960), menurut Godard</Ket>
  </Latar>
);
