// Sampul 9:16 seri explainer generik (contoh): rumus 1 kalimat, angka/kata kunci raksasa amber, visual dunia meja editor.
// Teks penting di tengah (aman dipotong grid profil 3:4 = 1080×1440 tengah).
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { ANTON, INTER, MONO } from "../../src/gerak/seri/meja-editor/font";
import { KD, KiraInline } from "../../src/gerak/seri/meja-editor/seri";
import { Aktor } from "./ContohKedipan";

export const Latar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: KD.latar, overflow: 'hidden' }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 95% 62% at 50% 46%, ${KD.latar2} 0%, ${KD.latar} 72%)` }} />
    <AbsoluteFill style={{ backgroundImage: 'linear-gradient(90deg, rgba(199,159,85,0.05) 2px, transparent 2px)', backgroundSize: '135px 100%' }} />
    {[10, 1080 - 34].map((x) => (
      <div key={x} style={{ position: 'absolute', left: x, top: 0, width: 24, height: 1920 }}>
        {Array.from({ length: 31 }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: 0, top: i * 64, width: 24, height: 34, borderRadius: 6, background: 'rgba(239,235,226,0.06)' }} />
        ))}
      </div>
    ))}
    {children}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse 85% 70% at 50% 46%, transparent 55%, rgba(0,0,0,0.55) 100%)' }} />
  </AbsoluteFill>
);

export const Label: React.FC<{ teks: string; y: number }> = ({ teks, y }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
    <div style={{ width: 18, height: 18, background: KD.amber, rotate: '45deg' }} />
    <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 36, letterSpacing: '0.16em', color: KD.abu }}>{teks}</div>
  </div>
);

export const Monitor: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode }> = ({ x, y, w, h, children }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 22, overflow: 'hidden', border: '4px solid rgba(199,159,85,0.9)', boxShadow: '0 34px 90px rgba(0,0,0,0.65), 0 0 80px rgba(255,180,84,0.12)', background: '#060607' }}>
    {children}
  </div>
);

const Lajur: React.FC<{ y: number; foto: string[]; sorot?: number }> = ({ y, foto, sorot }) => (
  <>
    <div style={{ position: 'absolute', left: 60, top: y - 8, width: 960, height: 116, borderRadius: 12, background: KD.lajur, border: `2px solid ${KD.garis}` }} />
    {foto.map((f, i) => (
      <div key={i} style={{ position: 'absolute', left: 66 + i * 79, top: y, width: 75, height: 100, borderRadius: 6, overflow: 'hidden', boxShadow: i === sorot ? `inset 0 0 0 4px ${KD.amber}` : 'inset 0 0 0 1.5px rgba(199,159,85,0.55)' }}>
        <Img src={staticFile(`k1/foto/${f}.svg`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {i === sorot ? <div style={{ position: 'absolute', inset: 0, boxShadow: `inset 0 0 0 4px ${KD.amber}`, borderRadius: 6 }} /> : null}
      </div>
    ))}
    <div style={{ position: 'absolute', left: 66 + (sorot ?? 6) * 79 + 36, top: y - 40, width: 4, height: 160, background: KD.amber, boxShadow: '0 0 14px rgba(255,180,84,0.7)' }} />
    <svg style={{ position: 'absolute', left: 66 + (sorot ?? 6) * 79 + 22, top: y - 62 }} width={32} height={32}>
      <path d="M 1 1 H 31 V 16 L 16 31 L 1 16 Z" fill={KD.amber} />
    </svg>
  </>
);

const URUT = ['anjing', 'pasar', 'dapur', 'pantai', 'pasangan', 'kucing', 'piknik', 'gunung', 'jalan', 'anjing', 'pasar', 'dapur'];

export const SampulK1: React.FC = () => (
  <Latar>
    <Label teks="FAKTA VIDEO" y={250} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 320, textAlign: 'center', fontFamily: ANTON, fontSize: 330, lineHeight: 0.92, color: KD.amber }}>13 MS</div>
    <div style={{ position: 'absolute', left: 70, right: 70, top: 640, textAlign: 'center', fontFamily: ANTON, fontSize: 104, lineHeight: 1.02, color: KD.tulang, textTransform: 'uppercase' }}>
      cukup buat otak ngenalin gambar
    </div>
    <Monitor x={110} y={900} w={860} h={484}>
      <Img src={staticFile('k1/foto/piknik.svg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', right: 20, bottom: 20, padding: '6px 18px', borderRadius: 14, background: KD.amber, fontFamily: ANTON, fontSize: 56, color: KD.latar }}>13 ms</div>
    </Monitor>
    <Lajur y={1460} foto={URUT} sorot={6} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1606, textAlign: 'center', fontFamily: INTER, fontWeight: 700, fontSize: 32, color: KD.abu }}>
      lebih singkat dari <span style={{ color: KD.tulang }}>1 frame</span> video 30 fps
    </div>
  </Latar>
);

export const SampulK3: React.FC = () => (
  <Latar>
    <Label teks="FAKTA VIDEO" y={250} />
    <div style={{ position: 'absolute', left: 70, right: 70, top: 320, textAlign: 'center', fontFamily: ANTON, fontSize: 104, lineHeight: 1.02, color: KD.tulang }}>UPLOAD YOUTUBE SEHARI</div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 440, textAlign: 'center', fontFamily: ANTON, fontSize: 228, lineHeight: 1, color: KD.amber, whiteSpace: 'nowrap' }}>±82 TAHUN</div>
    <div style={{ position: 'absolute', left: 70, right: 70, top: 690, textAlign: 'center', fontFamily: ANTON, fontSize: 96, lineHeight: 1.02, color: KD.tulang }}>NONTON NONSTOP</div>
    <Monitor x={110} y={900} w={860} h={484}>
      <Img src={staticFile('k3/mozaik.svg')} style={{ position: 'absolute', left: -300, top: -180, width: 1440, height: 864 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,6,7,0.15) 30%, rgba(6,6,7,0.85) 100%)' }} />
      <div style={{ position: 'absolute', left: 26, right: 26, bottom: 30, height: 10, borderRadius: 5, background: 'rgba(239,235,226,0.25)' }}>
        <div style={{ width: 22, height: 22, borderRadius: 11, background: KD.amber, marginTop: -6 }} />
      </div>
      <div style={{ position: 'absolute', right: 26, bottom: 56, fontFamily: MONO, fontWeight: 700, fontSize: 34, color: KD.tulang }}>0:00 / 82 tahun</div>
    </Monitor>
    <Lajur y={1460} foto={URUT.slice(0).reverse()} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1606, textAlign: 'center', fontFamily: INTER, fontWeight: 700, fontSize: 32, color: KD.abu }}>
      500 jam video masuk <span style={{ color: KD.tulang }}>tiap menit</span>
    </div>
  </Latar>
);

export const SampulK5: React.FC = () => (
  <Latar>
    <Label teks="FAKTA EDITING" y={250} />
    <div style={{ position: 'absolute', left: 50, right: 50, top: 320, textAlign: 'center', fontFamily: ANTON, fontSize: 122, lineHeight: 1.0, color: KD.tulang }}>
      POTONGAN ADEGAN <span style={{ color: KD.amber, whiteSpace: 'nowrap' }}><KiraInline /> KEDIPAN</span>
    </div>
    <Monitor x={110} y={680} w={860} h={484}>
      <Aktor W={852} H={476} shot="B" tutup={0.55} seed="sp" />
    </Monitor>
    <div style={{ position: 'absolute', left: 60, top: 1240, width: 960, height: 90, borderRadius: 12, background: KD.lajur, border: `2px solid ${KD.garis}` }} />
    {[0, 1, 2, 3].map((i) => (
      <div key={i} style={{ position: 'absolute', left: 68 + i * 238, top: 1248, width: 230, height: 74, borderRadius: 6, background: i % 2 ? '#3a2c1f' : '#2a2119', boxShadow: 'inset 0 0 0 1.5px rgba(199,159,85,0.55)' }} />
    ))}
    {[1, 2, 3].map((i) => (
      <React.Fragment key={i}>
        <div style={{ position: 'absolute', left: 66 + i * 238 - 2, top: 1220, width: 4, height: 190, background: KD.amber }} />
        <svg style={{ position: 'absolute', left: 66 + i * 238 - 66, top: 1350 }} width={52} height={30} viewBox="0 0 30 18">
          <path d="M 3 7 Q 15 17 27 7" fill="none" stroke={KD.amber} strokeWidth={3.2} strokeLinecap="round" />
          <path d="M 8 11 L 6 15 M 15 13 L 15 17 M 22 11 L 24 15" stroke={KD.amber} strokeWidth={2.4} strokeLinecap="round" />
        </svg>
      </React.Fragment>
    ))}
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1450, textAlign: 'center', fontFamily: INTER, fontWeight: 800, fontSize: 40, color: KD.tulang }}>
      temuan editor peraih Oscar <span style={{ color: KD.amber }}>Walter Murch</span>
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1510, textAlign: 'center', fontFamily: INTER, fontWeight: 600, fontSize: 30, color: KD.abu }}>ilustrasi, bukan cuplikan film</div>
  </Latar>
);
