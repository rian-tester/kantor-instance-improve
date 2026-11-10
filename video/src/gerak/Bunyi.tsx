// Suara latar: VO, BGM (fade in/out, trimBefore), SFX yang ditaruh pakai PUNCAK bunyinya (mulai = momen − puncak).
// Pakai audio milik kamu atau yang lisensinya mengizinkan pemakaian komersial.
import React from 'react';
import { Audio, interpolate, Sequence, staticFile, useVideoConfig } from 'remotion';

export type Sfx = { src: string; momen: number; puncak: number; vol?: number };

export const Bunyi: React.FC<{
  vo?: string;
  voVol?: number;
  bgm?: string;
  bgmVol?: number;
  /** detik lagu yang dibuang di depan (biar ketukan besar ngepas sama potongan) */
  bgmMulai?: number;
  sfx?: Sfx[];
}> = ({ vo, voVol = 1, bgm, bgmVol = 1, bgmMulai = 0, sfx = [] }) => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <>
      {vo ? <Audio src={staticFile(vo)} volume={voVol} /> : null}
      {bgm ? (
        <Audio
          src={staticFile(bgm)}
          trimBefore={Math.round(bgmMulai * fps)}
          volume={(f) =>
            bgmVol *
            interpolate(f, [0, fps * 0.4, durationInFrames - fps * 0.7, durationInFrames - 1], [0, 1, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      ) : null}
      {sfx.map((s, i) => {
        const dari = Math.max(0, Math.round((s.momen - s.puncak) * fps));
        return (
          <Sequence key={i} from={dari} layout="none">
            <Audio src={staticFile(s.src)} volume={s.vol ?? 0.6} />
          </Sequence>
        );
      })}
    </>
  );
};
