// Sampul (cover) Shorts 144Hz: didesain terpisah, bukan frame pertama. Rumus 1 kalimat: "udah bayar 144Hz, jalannya 60Hz?"
// Satu keluarga gaya sama videonya (navy + emas, koral = 60, lime = 144, Saira Condensed + JetBrains Mono).
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Grain, hitungKamera } from "../../src/gerak";
import { MONO, SAIRA } from "../../src/gerak/font";
import { Latar, Monitor, WARNA } from "./ContohRefreshRate";
import { hitungWaktu } from "./waktu144";

export const ContohRefreshRateSampul: React.FC = () => {
  const T = { ...hitungWaktu([], 38.7), windows1: -2 };
  const kam = hitungKamera([{ t: 0, x: 540, y: 960, z: 1 }], 0, 60);
  return (
    <AbsoluteFill style={{ background: WARNA.navy0, fontFamily: SAIRA, color: WARNA.putih, overflow: 'hidden' }}>
      <Latar kamera={kam} />
      <AbsoluteFill style={{ translate: '0 60px' }}>
        <Monitor T={T} diam={3.6} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, top: 236, width: 1080, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 56, letterSpacing: '0.16em', color: WARNA.emas }}>
        <span style={{ background: WARNA.emas, color: WARNA.navy0, padding: '0 12px', borderRadius: 6 }}>UDAH BAYAR</span>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 300, width: 1080, textAlign: 'center', fontWeight: 800, fontSize: 340, lineHeight: 1, color: '#7fd3a5' }}>144Hz</div>
      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={1080} height={900}>
        <path d="M 150 492 L 930 402" stroke={WARNA.koral} strokeWidth={30} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', left: 640, top: 690, translate: '-50% -50%', rotate: '-7deg', padding: '18px 40px 14px', border: `11px solid ${WARNA.koral}`, borderRadius: 30, background: 'rgba(11,16,32,0.88)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 46, letterSpacing: '0.2em', color: WARNA.koral }}>JALAN</span>
        <span style={{ fontWeight: 800, fontSize: 230, lineHeight: 0.92, color: WARNA.koral }}>60Hz?</span>
      </div>
      <></>
      <Grain kuat={0.1} garisScan={0.04} vinyet={0.5} />
    </AbsoluteFill>
  );
};
