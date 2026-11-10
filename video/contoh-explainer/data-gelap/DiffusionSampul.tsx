// Sampul 9:16 Shorts diffusion: 1 kalimat besar + kanvas yang separuh noise, separuh gambar jadi.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Grain } from "../../src/gerak";
import { MONO, SAIRA } from "../../src/gerak/font";
import { K } from "./raja/gaya";
import { KanvasDifusi } from "./diffusion/KanvasDifusi";

export const DiffusionSampul: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, ${K.latar2} 0%, ${K.latar} 72%)`, overflow: 'hidden' }}>
    <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(110,150,200,0.06) 2px, transparent 2px), linear-gradient(90deg, rgba(110,150,200,0.06) 2px, transparent 2px)', backgroundSize: '120px 120px' }} />
    <div style={{ position: 'absolute', left: 90, top: 210, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 10, height: 46, borderRadius: 5, background: K.teal }} />
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 42, letterSpacing: '0.12em', color: K.abu }}>CARA KERJA AI BIKIN GAMBAR</div>
    </div>
    <div style={{ position: 'absolute', left: 90, top: 272, width: 920, fontFamily: SAIRA, fontWeight: 800, fontSize: 128, lineHeight: 1.12, color: K.tinta }}>
      <div>Gambar AI awalnya</div>
      <div>cuma <span style={{ display: 'inline-block', background: K.teal, color: K.latar, padding: '0 0.12em', borderRadius: 12, lineHeight: 1.0 }}>noise</span></div>
    </div>
    <div style={{ position: 'absolute', left: 180, top: 640, width: 720, height: 720, borderRadius: 26, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
      <KanvasDifusi src="diffusion/kucing-1.svg" ukuran={720} level={0} seed="sampul" />
      <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 0, 62% 0, 38% 100%, 0 100%)' }}>
        <KanvasDifusi src="diffusion/kucing-1.svg" ukuran={720} level={0.97} seed="sampul" />
      </div>
      <svg width={720} height={720} style={{ position: 'absolute', left: 0, top: 0 }}>
        <line x1={446} y1={0} x2={274} y2={720} stroke={K.kuning} strokeWidth={10} />
      </svg>
    </div>
    <div style={{ position: 'absolute', left: 180, top: 1380, fontFamily: MONO, fontWeight: 800, fontSize: 40, color: K.kuning }}>noise → 1.000 langkah → gambar</div>
    <Grain kuat={0.06} garisScan={0} vinyet={0.45} warnaVinyet="2,5,14" />
  </AbsoluteFill>
);
