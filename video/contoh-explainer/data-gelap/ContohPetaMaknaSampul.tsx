// Sampul 9:16 explainer raja−ratu: rumus 1 kalimat besar di atas, jajaran genjang di peta makna di bawah.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Grain } from "../../src/gerak";
import { MONO, SAIRA } from "../../src/gerak/font";
import { K } from "./raja/gaya";
import { KATA, PRIA, RAJA, RATU, TITIK, WANITA } from "./raja/data-peta";
import { panah } from "./raja/Adegan";

const KAM = { x: 3620, y: 2655, z: 0.68 };
const pr = (x: number, y: number) => ({ x: (x - KAM.x) * KAM.z + 520, y: (y - KAM.y) * KAM.z + 1210 });

export const ContohPetaMaknaSampul: React.FC = () => {
  const utama = ['raja', 'ratu', 'pria', 'wanita'];
  const g = (p: { x: number; y: number }) => pr(p.x, p.y);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 60%, ${K.latar2} 0%, ${K.latar} 72%)`, overflow: 'hidden' }}>
      <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(110,150,200,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(110,150,200,0.07) 2px, transparent 2px)', backgroundSize: '150px 150px' }} />
      <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
        {TITIK.map((d, i) => {
          const p = pr(d.x, d.y);
          if (p.x < -20 || p.x > 1100 || p.y < 860 || p.y > 1560) return null;
          return <circle key={i} cx={p.x} cy={p.y} r={d.r * 1.1} fill="#8fa6c4" opacity={d.o * 0.8} />;
        })}
        <path d={panah(g(PRIA), g(WANITA), 22, 34)} fill="none" stroke={K.teal} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
        <path d={panah(g(RAJA), g(RATU), 22, 34)} fill="none" stroke={K.kuning} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {KATA.filter((k) => k.gugus !== 'inggris').map((k) => {
        const p = pr(k.x, k.y);
        if (p.x < 0 || p.x > 1000 || p.y < 880 || p.y > 1540) return null;
        const besar = utama.includes(k.id);
        const warna = k.id === 'ratu' ? K.kuning : besar ? K.tinta : '#7f93b0';
        return (
          <div key={k.id} style={{ position: 'absolute', left: p.x, top: p.y, opacity: besar ? 1 : 0.5 }}>
            <div style={{ position: 'absolute', left: -10, top: -10, width: 20, height: 20, borderRadius: 10, background: warna, boxShadow: `0 0 18px ${k.id === 'ratu' ? K.kuning : 'rgba(61,219,200,0.4)'}` }} />
            <div style={{ position: 'absolute', left: 20, top: besar ? -44 : -26, fontFamily: SAIRA, fontWeight: besar ? 800 : 600, fontSize: besar ? 64 : 34, color: warna, whiteSpace: 'nowrap' }}>{k.t}</div>
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 900, background: 'linear-gradient(180deg, rgba(7,12,24,0.97) 82%, rgba(7,12,24,0))' }} />
      <div style={{ position: 'absolute', left: 90, top: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 10, height: 46, borderRadius: 5, background: K.teal }} />
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 42, letterSpacing: '0.12em', color: K.abu }}>HITUNGAN AI</div>
        </div>
        <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 140, lineHeight: 1.12, color: K.tinta, marginTop: 18 }}>
          <div>raja <span style={{ color: K.merah }}>−</span> pria</div>
          <div><span style={{ color: K.teal }}>+</span> wanita</div>
          <div><span style={{ color: K.abu }}>=</span> <span style={{ display: 'inline-block', background: K.kuning, color: K.latar, padding: '0 0.14em', borderRadius: 14, lineHeight: 1.0 }}>ratu</span></div>
        </div>
        <div style={{ fontFamily: SAIRA, fontWeight: 600, fontSize: 54, color: K.tinta, marginTop: 26 }}>Cara AI ngerti arti kata pakai angka</div>
      </div>
      <Grain kuat={0.06} garisScan={0} vinyet={0.45} warnaVinyet="2,5,14" />
    </AbsoluteFill>
  );
};
