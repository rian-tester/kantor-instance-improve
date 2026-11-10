// Sampul explainer strawberry (16:9, dibikin terpisah). Rumus 1 kalimat: "strawberry" di mata AI = 1 angka.
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Grain } from "../../src/gerak";
import { MONO, SLAB, TANGAN } from "../../src/gerak/font";
import { K } from "./ContohToken169";

export const ContohToken169Sampul: React.FC = () => {
  const huruf = 'strawberry'.split('');
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 45% 40%, #f3ecdc 0%, ${K.kertas} 55%, #ddd2ba 100%)`, fontFamily: SLAB, color: K.tinta }}>
      <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(70,60,40,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(70,60,40,0.07) 2px, transparent 2px)', backgroundSize: '60px 60px' }} />
      <div style={{ position: 'absolute', left: 110, top: 96, fontFamily: MONO, fontWeight: 700, fontSize: 52, letterSpacing: '0.1em', color: K.abu }}>KENAPA AI SALAH NGITUNG?</div>
      <div style={{ position: 'absolute', left: 110, top: 200, display: 'flex', gap: 12 }}>
        {huruf.map((h, i) => (
          <div key={i} style={{ width: 118, height: 160, borderRadius: 16, background: h === 'r' ? '#fde9e4' : K.putih, border: `5px solid ${K.tinta}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 128, lineHeight: 1, color: h === 'r' ? K.merah : K.tinta, boxShadow: '6px 7px 0 rgba(29,27,24,0.2)', rotate: `${(i % 3) - 1}deg` }}>
            {h}
          </div>
        ))}
      </div>
      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={1920} height={1080}>
        <path d="M 800 420 Q 830 560 900 600" fill="none" stroke={K.tinta} strokeWidth={9} strokeLinecap="round" />
        <path d="M 862 572 L 902 602 L 854 614" fill="none" stroke={K.tinta} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ position: 'absolute', left: 930, top: 520, padding: '18px 44px', borderRadius: 22, background: K.teal, border: `6px solid ${K.tinta}`, fontFamily: MONO, fontWeight: 800, fontSize: 150, lineHeight: 1, color: K.putih, boxShadow: '8px 10px 0 rgba(29,27,24,0.22)', rotate: '-3deg' }}>101830</div>
      <div style={{ position: 'absolute', left: 950, top: 730, fontFamily: TANGAN, fontWeight: 700, fontSize: 76, color: K.teal }}>yang AI liat</div>
      <div style={{ position: 'absolute', left: 110, top: 470, fontWeight: 900, fontSize: 108, lineHeight: 1.02 }}>
        bukan<br />
        <span style={{ background: K.kuning, padding: '0 12px' }}>huruf r</span>
      </div>
      <></>
      <Grain kuat={0.18} garisScan={0} vinyet={0.3} warnaVinyet="70,50,25" />
    </AbsoluteFill>
  );
};
