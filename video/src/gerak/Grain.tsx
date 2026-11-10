import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
export const Grain: React.FC<{kuat?: number; garisScan?: number; vinyet?: number; folder?: string; warnaVinyet?: string}> = ({kuat = 0.1, garisScan = 0.05, vinyet = 0.5, warnaVinyet = '16,16,16'}) => {
  const frame = useCurrentFrame();
  const tekstur = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" seed="${Math.floor(frame / 2) % 4 + 1}"/></filter><path fill="white" filter="url(#n)" d="M0 0h240v240H0z"/></svg>`;
  return <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill style={{opacity: kuat, backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(tekstur)}")`, mixBlendMode: 'overlay'}} />
    <AbsoluteFill style={{backgroundImage: `repeating-linear-gradient(0deg,rgba(0,0,0,${garisScan}) 0 2px,transparent 2px 5px)`}} />
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 46%,transparent 55%,rgba(${warnaVinyet},${vinyet}) 100%)`}} />
  </AbsoluteFill>;
};
