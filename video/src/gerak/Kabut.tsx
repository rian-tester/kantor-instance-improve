// Kabut cahaya (prinsip 4 & 10: gak ada frame beku, kedalaman): 3 gumpalan cahaya besar & lembut yang hanyut pelan
// (noise) + paralaks tipis ke kamera. Dipasang di atas latar, di bawah dunia. Bikin latar gelap tetap "napas".
import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import type { Kamera } from './Dunia';
import { noise } from './Idle';
import { useDetik } from './waktu';

export const Kabut: React.FC<{ kam?: Kamera; warna?: [string, string, string]; kuat?: number }> = ({
  kam,
  warna = ['61,219,200', '58,96,255', '255,197,61'],
  kuat = 1,
}) => {
  const t = useDetik();
  const { width, height } = useVideoConfig();
  const blob = [
    { bx: 0.2, by: 0.3, r: 0.75, a: 0.3, w: 0, s: 'k1', vx: 62, vy: 18 },
    { bx: 0.8, by: 0.62, r: 0.85, a: 0.28, w: 1, s: 'k2', vx: -54, vy: -22 },
    { bx: 0.45, by: 0.9, r: 0.6, a: 0.12, w: 2, s: 'k3', vx: 38, vy: -28 },
  ];
  const lebar = Math.max(width, height);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {blob.map((b, i) => {
        const R = b.r * lebar;
        const px = kam ? -kam.x * kam.z * 0.06 : 0;
        const py = kam ? -kam.y * kam.z * 0.06 : 0;
        const span = width + 2 * R;
        const spanY = height + 2 * R;
        // hanyut konstan (biar gak pernah berhenti) + belokan noise
        const x = ((((b.bx * width + b.vx * t + noise(`${b.s}x`, t * 0.18) * width * 0.2 + px) % span) + span) % span) - R;
        const y = ((((b.by * height + b.vy * t + noise(`${b.s}y`, t * 0.15) * height * 0.12 + py) % spanY) + spanY) % spanY) - R;
        const a = b.a * kuat * (0.8 + 0.2 * noise(`${b.s}a`, t * 0.3));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - R,
              top: y - R,
              width: 2 * R,
              height: 2 * R,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(${warna[b.w]},${a.toFixed(3)}) 0%, rgba(${warna[b.w]},0) 70%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
