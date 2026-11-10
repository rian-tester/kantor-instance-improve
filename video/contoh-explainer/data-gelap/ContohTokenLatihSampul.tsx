// Sampul 9:16 explainer 475 ribu tahun: angka besar + 1 kalimat di atas, menara token & orang kecil di bawah.
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { Grain } from "../../src/gerak";
import { MONO, SAIRA } from "../../src/gerak/font";
import { K } from "./raja/gaya";
import { TOKEN_SABUK } from "./llama/dunia";

export const ContohTokenLatihSampul: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 60%, ${K.latar2} 0%, ${K.latar} 72%)`, overflow: 'hidden' }}>
    <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(110,150,200,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(110,150,200,0.07) 2px, transparent 2px)', backgroundSize: '135px 135px' }} />
    {/* gunung token */}
    {Array.from({ length: 22 * 16 }, (_, i) => {
      const kol = i % 22;
      const bar = Math.floor(i / 22);
      const tinggi = 15 - Math.abs(kol - 11) * 1.1 + random(`st${kol}`) * 2;
      if (bar > tinggi) return null;
      const x = 18 + kol * 48 + (bar % 2) * 12;
      const y = 1500 - bar * 42;
      const nyala = random(`sp${i}`) < 0.12;
      return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 44, height: 38, borderRadius: 6, background: nyala ? K.teal : '#203154', border: `2px solid ${nyala ? K.teal : '#2c4068'}`, fontFamily: MONO, fontSize: 12, color: '#8fa6c4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{nyala ? '' : TOKEN_SABUK[i % TOKEN_SABUK.length].slice(0, 3)}</div>;
    })}
    <div style={{ position: 'absolute', left: 0, top: 1546, width: 1080, height: 8, background: '#2c4068' }} />
    {/* orang kecil */}
    <svg width={110} height={143} viewBox="-100 -260 200 260" style={{ position: 'absolute', left: 120, top: 1404 }}>
      <path d="M -62 0 C -62 -70, -44 -112, 0 -112 C 44 -112, 62 -70, 62 0 Z" fill={K.kuning} />
      <path d="M -30 -78 Q -70 -60 -96 -74" stroke={K.kuning} strokeWidth={22} strokeLinecap="round" fill="none" />
      <circle cx={-4} cy={-150} r={42} fill={K.kuning} />
    </svg>
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 900, background: 'linear-gradient(180deg, rgba(7,12,24,0.96) 78%, rgba(7,12,24,0))' }} />
    <div style={{ position: 'absolute', left: 90, top: 200 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 10, height: 46, borderRadius: 5, background: K.teal }} />
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 42, letterSpacing: '0.12em', color: K.abu }}>DATA LATIHAN LLAMA 3</div>
      </div>
      <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 250, lineHeight: 0.95, color: K.kuning, marginTop: 24 }}>475.000</div>
      <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 140, lineHeight: 1, color: K.tinta }}>tahun</div>
      <div style={{ fontFamily: SAIRA, fontWeight: 600, fontSize: 58, color: K.tinta, marginTop: 30, width: 880 }}>Segitu lamanya kalau kamu baca 1 token per detik</div>
    </div>
    <Grain kuat={0.06} garisScan={0} vinyet={0.45} warnaVinyet="2,5,14" />
  </AbsoluteFill>
);
