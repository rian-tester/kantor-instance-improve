// Sampul 9:16 A3 air AI: 1 kalimat ("Sebotol air = ±30 jawaban AI") + botol yang airnya tinggal dikit + gelas 15 + 2 ml.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Grain, type Kamera } from "../../src/gerak";
import { MONO, SAIRA } from "../../src/gerak/font";
import { K } from "./raja/gaya";
import { AIR, Botol } from "./ContohJejakAir";
import { LatarSeri } from "../../src/gerak/seri/data-gelap/seri";

const KAM: Kamera = { x: 540, y: 960, z: 1, vx: 0, vy: 0, lebar: 1080, tinggi: 1920 };

export const AirSampul: React.FC = () => (
  <AbsoluteFill style={{ background: K.latar, overflow: 'hidden' }}>
    <LatarSeri kam={KAM} kabut={['61,219,200', '58,96,255', '92,200,242']} />
    <div style={{ position: 'absolute', left: 90, top: 196, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 10, height: 44, borderRadius: 5, background: K.teal }} />
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: K.abu }}>JEJAK AIR AI · PERKIRAAN</div>
    </div>
    <div style={{ position: 'absolute', left: 90, top: 262, width: 920, fontFamily: SAIRA, fontWeight: 800, fontSize: 132, lineHeight: 1.04, color: K.tinta }}>
      <div>Sebotol air</div>
      <div>
        = <span style={{ display: 'inline-block', background: K.kuning, color: K.latar, padding: '0 0.1em', borderRadius: 12, lineHeight: 0.98 }}>±30</span> jawaban AI
      </div>
    </div>
    <div style={{ position: 'absolute', left: 0, top: 260, width: 1080, height: 1920 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, scale: '1.25', transformOrigin: '380px 1062px' }}>
        <Botol id="sampul" x={380} level={0.22} label="±30 jwb" sub="rata-rata AS" />
      </div>
      {/* gelas: 15 ml pembangkit + 2 ml pendingin */}
      <div style={{ position: 'absolute', left: 660, top: 1062 - 400, width: 140, height: 400 }}>
        <div style={{ position: 'absolute', left: 6, right: 6, bottom: 6, height: 15 * 19, background: AIR.bangkit, borderRadius: '0 0 14px 14px' }} />
        <div style={{ position: 'absolute', left: 6, right: 6, bottom: 6 + 15 * 19 + 20, height: 2 * 19, background: AIR.dingin }} />
        <div style={{ position: 'absolute', inset: 0, border: '6px solid #cfe2f5', borderTop: 'none', borderRadius: '0 0 20px 20px' }} />
      </div>
      <div style={{ position: 'absolute', left: 820, top: 1062 - 400 + 10, lineHeight: 1 }}>
        <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 60, color: AIR.dingin }}>2 ml</div>
        <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 32, color: K.tinta }}>pendingin</div>
      </div>
      <div style={{ position: 'absolute', left: 820, top: 1062 - 220, lineHeight: 1 }}>
        <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 60, color: AIR.bangkit }}>15 ml</div>
        <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 32, color: K.tinta }}>pembangkit</div>
      </div>
      <div style={{ position: 'absolute', left: 660, top: 1062 + 26, fontFamily: MONO, fontWeight: 800, fontSize: 28, color: K.kuning }}>±17 ml / jawaban</div>
    </div>
    <Grain kuat={0.06} garisScan={0} vinyet={0.45} warnaVinyet="2,5,14" />
  </AbsoluteFill>
);
