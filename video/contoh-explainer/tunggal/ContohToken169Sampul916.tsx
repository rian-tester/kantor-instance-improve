// Sampul explainer strawberry 9:16 (dibikin terpisah). Rumus 1 kalimat: "strawberry" di mata AI = 1 angka, bukan huruf r.
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Grain } from "../../src/gerak";
import { MONO, SLAB, TANGAN } from "../../src/gerak/font";
import { K } from "./ContohToken169";

export const ContohToken169Sampul916: React.FC = () => {
  const huruf = 'strawberry'.split('');
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 45% 40%, #f3ecdc 0%, ${K.kertas} 55%, #ddd2ba 100%)`, fontFamily: SLAB, color: K.tinta }}>
      <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(70,60,40,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(70,60,40,0.07) 2px, transparent 2px)', backgroundSize: '60px 60px' }} />
      <div style={{ position: 'absolute', left: 0, top: 250, width: 1080, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 50, letterSpacing: '0.08em', color: K.abu }}>KENAPA AI SALAH NGITUNG?</div>
      <div style={{ position: 'absolute', left: 0, top: 350, width: 1080, display: 'flex', justifyContent: 'center', gap: 8 }}>
        {huruf.map((h, i) => (
          <div key={i} style={{ width: 92, height: 136, borderRadius: 14, background: h === 'r' ? '#fde9e4' : K.putih, border: `5px solid ${K.tinta}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 104, lineHeight: 1, color: h === 'r' ? K.merah : K.tinta, boxShadow: '5px 6px 0 rgba(29,27,24,0.2)', rotate: `${(i % 3) - 1}deg` }}>
            {h}
          </div>
        ))}
      </div>
      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={1080} height={1920}>
        <path d="M 540 520 Q 500 600 540 660" fill="none" stroke={K.tinta} strokeWidth={9} strokeLinecap="round" />
        <path d="M 512 628 L 540 664 L 568 626" fill="none" stroke={K.tinta} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ position: 'absolute', left: 0, top: 690, width: 1080, display: 'flex', justifyContent: 'center' }}>
        <div style={{ padding: '18px 48px', borderRadius: 24, background: K.teal, border: `6px solid ${K.tinta}`, fontFamily: MONO, fontWeight: 800, fontSize: 170, lineHeight: 1, color: K.putih, boxShadow: '8px 10px 0 rgba(29,27,24,0.22)', rotate: '-3deg' }}>101830</div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 920, width: 1080, textAlign: 'center', fontFamily: TANGAN, fontWeight: 700, fontSize: 80, color: K.teal }}>yang AI liat</div>
      <div style={{ position: 'absolute', left: 80, top: 1080, fontWeight: 900, fontSize: 120, lineHeight: 1.04 }}>
        bukan<br />
        <span style={{ background: K.kuning, padding: '0 14px' }}>huruf r</span>
      </div>
      <></>
      <Grain kuat={0.18} garisScan={0} vinyet={0.3} warnaVinyet="70,50,25" />
    </AbsoluteFill>
  );
};
