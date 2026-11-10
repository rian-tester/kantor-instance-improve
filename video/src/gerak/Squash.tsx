// Jatuh + squash (prinsip 9): benda jatuh dengan gravitasi (makin ngebut, sedikit melar), mendarat pipih melebar,
// mantul balik sekali, diam. Titik tumpu di bawah.
import React from 'react';
import { interpolate } from 'remotion';
import { EASE, JEPIT, maju, useDetik } from './waktu';

export const Squash: React.FC<{
  /** detik menyentuh tanah */
  mendarat: number;
  /** tinggi jatuh (px) */
  tinggiJatuh?: number;
  lamaJatuh?: number;
  /** 1 = standar (pipih 28%) */
  kuat?: number;
  keluar?: number;
  children: React.ReactNode;
  gaya?: React.CSSProperties;
}> = ({ mendarat, tinggiJatuh = 600, lamaJatuh = 0.28, kuat = 1, keluar, children, gaya }) => {
  const t = useDetik();
  const awal = mendarat - lamaJatuh;
  if (t < awal) return null;
  let dy = 0;
  let sy = 1;
  if (t < mendarat) {
    const p = maju(t, awal, mendarat, EASE.jatuh);
    dy = -tinggiJatuh * (1 - p);
    sy = 1 + 0.12 * p * kuat;
  } else {
    const d = t - mendarat;
    sy = 1 + (interpolate(d, [0, 0.05, 0.12, 0.2, 0.3], [0.72, 0.8, 1.1, 0.97, 1], JEPIT) - 1) * kuat;
  }
  const k = keluar === undefined ? 0 : maju(t, keluar, keluar + 0.2, EASE.keluar);
  return (
    <div style={{ ...gaya, transformOrigin: '50% 100%', translate: `0 ${dy}px`, scale: `${(1 / Math.sqrt(sy)) * (1 - k)} ${sy * (1 - k)}`, opacity: 1 - k }}>
      {children}
    </div>
  );
};
