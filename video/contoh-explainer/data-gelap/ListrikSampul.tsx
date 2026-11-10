// Sampul 9:16 A2 listrik ChatGPT: 1 kalimat ("ChatGPT = 10× listrik Google? Itu angka lama") + garis waktu 3 pilar
// (Google 2009 · ChatGPT awal 2023 dicoret · ChatGPT 2025 ±0,3 Wh). Gaya sama persis sama videonya.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Grain, type Kamera } from "../../src/gerak";
import { MONO, SAIRA } from "../../src/gerak/font";
import { K } from "./raja/gaya";
import { Pilar, type Pil } from "./ContohListrik";
import { LatarSeri } from "../../src/gerak/seri/data-gelap/seri";

const KAM: Kamera = { x: 540, y: 960, z: 1, vx: 0, vy: 0, lebar: 1080, tinggi: 1920 };
const p = (x: number, v: number, angka: string, hantu = 0): Pil => ({ x, v, o: 1, hantu, angka, redup: 0, turun: 0 });

export const ListrikSampul: React.FC = () => (
  <AbsoluteFill style={{ background: K.latar, overflow: 'hidden' }}>
    <LatarSeri kam={KAM} />
    <div style={{ position: 'absolute', left: 90, top: 196, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 10, height: 44, borderRadius: 5, background: K.teal }} />
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.12em', color: K.abu }}>LISTRIK 1 PERTANYAAN AI</div>
    </div>
    <div style={{ position: 'absolute', left: 90, top: 262, width: 920, fontFamily: SAIRA, fontWeight: 800, fontSize: 132, lineHeight: 1.04, color: K.tinta }}>
      <div>
        ChatGPT = <span style={{ display: 'inline-block', background: K.kuning, color: K.latar, padding: '0 0.1em', borderRadius: 12, lineHeight: 0.98 }}>10×</span>
      </div>
      <div>listrik Google?</div>
    </div>
    <div style={{ position: 'absolute', left: 96, top: 560, rotate: '-3deg', padding: '6px 22px', borderRadius: 12, border: `5px solid ${K.merah}`, fontFamily: SAIRA, fontWeight: 800, fontSize: 64, color: K.merah, letterSpacing: '0.02em' }}>
      itu angka lama
    </div>
    {/* garis waktu: dunia digeser 230 px ke bawah (lantai di 1480) */}
    <div style={{ position: 'absolute', left: 0, top: 230, width: 1080, height: 1920 }}>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <path d="M 120 1250 L 1000 1250 M 972 1230 L 1002 1250 L 972 1270" fill="none" stroke={K.abu} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 362 1268 L 378 1232 M 380 1268 L 396 1232" fill="none" stroke={K.abu} strokeWidth={5} strokeLinecap="round" />
      </svg>
      <Pilar p={p(230, 0.3, '0,3 Wh')} warna={K.teal} nama="GOOGLE" sub="1 pencarian" ikon="cari" tag={{ teks: 'PERKIRAAN 2009', warna: K.abu, o: 1 }} t0={-2} />
      <Pilar p={p(520, 2.9, '2,9 Wh', 1)} warna={K.kuning} nama="CHATGPT" sub="1 pertanyaan" ikon="chat" tag={{ teks: 'ANGKA LAMA', warna: K.merah, o: 1 }} t0={-2} coret={-2} />
      <Pilar p={p(810, 0.3, '0,3 Wh')} warna={K.kuning} nama="CHATGPT" sub="GPT-4o · 2025" ikon="chat" tag={{ teks: 'HITUNGAN 2025', warna: K.kuning, o: 1 }} t0={-2} terang />
      {[
        { x: 230, t: '2009', w: K.abu },
        { x: 520, t: 'awal 2023', w: K.abu },
        { x: 810, t: '2025', w: K.kuning },
      ].map((y) => (
        <div key={y.x} style={{ position: 'absolute', left: y.x, top: 1298, translate: '-50% -50%', padding: '5px 16px', borderRadius: 12, background: y.w === K.kuning ? K.kuning : K.latar, border: `3px solid ${y.w}`, fontFamily: MONO, fontWeight: 800, fontSize: 30, color: y.w === K.kuning ? K.latar : y.w }}>
          {y.t}
        </div>
      ))}
    </div>
    <Grain kuat={0.06} garisScan={0} vinyet={0.45} warnaVinyet="2,5,14" />
  </AbsoluteFill>
);
