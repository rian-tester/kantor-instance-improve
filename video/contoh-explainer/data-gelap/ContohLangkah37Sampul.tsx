// Sampul 9:16 A7 Langkah 37: 1 kalimat ("Langkah 1 : 10.000 yang bikin AI menang") + papan Go dengan batu #37 menyala.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Grain, type Kamera } from "../../src/gerak";
import { MONO, SAIRA } from "../../src/gerak/font";
import { K } from "./raja/gaya";
import { Batu, HITAM, PAPAN, PUTIH, titik } from "./ContohLangkah37";
import { LatarSeri } from "../../src/gerak/seri/data-gelap/seri";

const KAM: Kamera = { x: 540, y: 960, z: 1, vx: 0, vy: 0, lebar: 1080, tinggi: 1920 };

export const ContohLangkah37Sampul: React.FC = () => {
  const UK = 18 * PAPAN.sel + 2 * PAPAN.tepi;
  const p = titik(14, 8);
  return (
    <AbsoluteFill style={{ background: K.latar, overflow: 'hidden' }}>
      <LatarSeri kam={KAM} />
      <div style={{ position: 'absolute', left: 0, top: 140, width: 1080, height: 1920 }}>
        <div style={{ position: 'absolute', left: PAPAN.cx - UK / 2, top: PAPAN.cy - UK / 2, width: UK, height: UK, borderRadius: 14, background: 'linear-gradient(135deg, #c99a5b 0%, #b88745 100%)', boxShadow: '0 40px 90px rgba(0,0,0,0.55)', filter: 'brightness(0.62)' }}>
          <svg width={UK} height={UK} style={{ position: 'absolute', left: 0, top: 0 }}>
            <g transform={`translate(${PAPAN.tepi} ${PAPAN.tepi})`} stroke="#3b2a14" strokeWidth={2.2}>
              {Array.from({ length: 19 }, (_, i) => (
                <React.Fragment key={i}>
                  <line x1={i * PAPAN.sel} y1={0} x2={i * PAPAN.sel} y2={18 * PAPAN.sel} />
                  <line x1={0} y1={i * PAPAN.sel} x2={18 * PAPAN.sel} y2={i * PAPAN.sel} />
                </React.Fragment>
              ))}
            </g>
          </svg>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, filter: 'brightness(0.62)' }}>
          {HITAM.map(([i, j], n) => {
            const q = titik(i, j);
            return <Batu key={`h${n}`} x={q.x} y={q.y} hitam />;
          })}
          {PUTIH.map(([i, j], n) => {
            const q = titik(i, j);
            return <Batu key={`p${n}`} x={q.x} y={q.y} hitam={false} />;
          })}
        </div>
        <div style={{ position: 'absolute', left: p.x - 120, top: p.y - 120, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,197,61,0.55) 0%, rgba(255,197,61,0) 65%)' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, scale: '2.2', transformOrigin: `${p.x}px ${p.y}px` }}>
          <Batu x={p.x} y={p.y} hitam nomor="37" cincin={K.kuning} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 90, top: 196, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 10, height: 44, borderRadius: 5, background: K.teal }} />
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: K.abu }}>ALPHAGO · LANGKAH 37</div>
      </div>
      <div style={{ position: 'absolute', left: 90, top: 262, width: 920, fontFamily: SAIRA, fontWeight: 800, fontSize: 124, lineHeight: 1.04, color: K.tinta }}>
        <div>
          Langkah <span style={{ display: 'inline-block', background: K.kuning, color: K.latar, padding: '0 0.1em', borderRadius: 12, lineHeight: 0.98 }}>1 : 10.000</span>
        </div>
        <div>yang bikin AI menang</div>
      </div>
      <Grain kuat={0.06} garisScan={0} vinyet={0.45} warnaVinyet="2,5,14" />
    </AbsoluteFill>
  );
};
