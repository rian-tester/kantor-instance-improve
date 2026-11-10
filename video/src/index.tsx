import React from 'react';
import {AbsoluteFill, Audio, Composition, Img, OffthreadVideo, Sequence, interpolate, registerRoot, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import contoh from '../contoh.json';
import {Affiliate, type DataAffiliate} from './affiliate/Affiliate';
import produk from '../public/produk/contoh/data.json';
import {loadFont} from '@remotion/fonts';

// Jakarta lokal menjaga huruf yang sama saat render tanpa internet.
loadFont({family: 'Jakarta', url: staticFile('font/jakarta.woff2'), weight: '100 900'});

type Adegan = {teks: string; catatan: string; frame: number; mulai?: number; latar?: string; jenis?: 'gambar' | 'video'};
type Kalimat = {kalimat: string; mulai: number; akhir: number};
type DataVideo = {vo?: string; voDurasi?: number; voVolume?: number; caption?: Kalimat[]; adegan: Adegan[]; musik?: string; musikVolume?: number; sfx?: {file: string; frame: number}[]};
const Babak: React.FC<Adegan & {nomor: number; denganCaption: boolean}> = ({teks, catatan, latar, jenis, nomor, frame: durasi, denganCaption}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const masuk = spring({frame, fps, config: {damping: 22, stiffness: 110}});
  const maju = interpolate(frame, [0, durasi], [0, 110], {extrapolateRight: 'clamp'});
  const akhir = nomor === 2;
  const keluar = Math.pow(Math.max(0, (frame - durasi + 8) / 8), 4) * 65;
  return <AbsoluteFill style={{backgroundColor: akhir ? '#d6ef63' : '#20291e', color: akhir && !latar ? '#20291e' : '#fbfcf4', fontFamily: 'Jakarta', overflow: 'hidden'}}>
    {latar && (jenis === 'video' ? <OffthreadVideo src={staticFile(latar)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <Img src={staticFile(latar)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />)}
    {latar && <AbsoluteFill style={{backgroundColor: 'rgba(0,0,0,0.6)'}} />}
    <div style={{position: 'absolute', left: 80, top: 220, fontSize: 32}}>kantor kamu / video pendek</div>
    <div style={{position: 'absolute', left: nomor === 1 ? 120 : 80, right: 160, top: nomor === 1 ? 760 : 430, fontSize: akhir ? 132 : 106, fontWeight: 800, lineHeight: 1.08, transform: `translateY(${(1 - masuk) * 65 - keluar}px)`, overflowWrap: 'normal'}}>{teks.split(/\s+/).map((kata, i) => {
      const bagian = kata.match(/^(.*?)([.,!?;:]+)$/);
      return <React.Fragment key={i}>{i > 0 ? ' ' : ''}<span style={{whiteSpace: 'nowrap', display: 'inline-block'}}>{bagian ? <>{bagian[1]}<span style={{marginLeft: '-0.08em'}}>{bagian[2]}</span></> : kata}</span></React.Fragment>;
    })}</div>
    {!denganCaption && <div style={{position: 'absolute', left: 80, right: 180, bottom: 310, fontSize: 40, lineHeight: 1.4}}>{catatan}</div>}
    <div style={{position: 'absolute', left: 80, top: nomor === 1 ? 570 : 1060, height: 18, width: akhir ? interpolate(frame, [0, 36], [260, 780], {extrapolateRight: 'clamp'}) : 260 + maju, backgroundColor: akhir ? '#20291e' : '#d6ef63'}} />
  </AbsoluteFill>;
};
const VideoKantor: React.FC<DataVideo> = ({adegan, musik, musikVolume, sfx = [], vo, voVolume = 1, caption = []}) => {
  const {fps, durationInFrames} = useVideoConfig();
  let mulai = 0;
  return <AbsoluteFill style={{backgroundColor: '#20291e'}}>
    {adegan.map((babak, nomor) => { const from = babak.mulai ?? mulai; mulai = from + babak.frame; const durasi = nomor === adegan.length - 1 ? Math.max(babak.frame, durationInFrames - from) : babak.frame; return <Sequence key={nomor} from={from} durationInFrames={durasi}><Babak {...babak} frame={durasi} nomor={nomor} denganCaption={caption.length > 0} /></Sequence>; })}
    {musik && <Audio src={staticFile(musik)} volume={vo ? Math.min(musikVolume ?? 0.08, 0.12) : musikVolume ?? 0.16} />}
    {vo && <Audio src={staticFile(vo)} volume={voVolume} />}
    {caption.map((c, i) => <Sequence key={`caption-${i}`} from={Math.floor(c.mulai * fps)} durationInFrames={Math.max(1, Math.ceil(c.akhir * fps) - Math.floor(c.mulai * fps))}>
      <div style={{position: 'absolute', left: 80, right: 160, bottom: 220, color: '#fbfcf4', backgroundColor: 'rgba(0,0,0,0.75)', padding: '16px 24px', borderRadius: 12, fontFamily: 'Jakarta', fontSize: 42, lineHeight: 1.35}}>{c.kalimat}</div>
    </Sequence>)}
    {sfx.map((bunyi, i) => <Sequence key={i} from={bunyi.frame}><Audio src={staticFile(bunyi.file)} volume={0.3} /></Sequence>)}
  </AbsoluteFill>;
};
const Root = () => <><Composition id="ContohKantor" component={VideoKantor} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={contoh as DataVideo} calculateMetadata={({props}) => ({durationInFrames: props.vo && props.voDurasi ? Math.ceil(props.voDurasi * 30) : props.adegan.reduce((total, babak) => total + babak.frame, 0)})} />
<Composition id="ContohAffiliate" component={Affiliate} width={1080} height={1920} fps={30} durationInFrames={450} defaultProps={produk as DataAffiliate} calculateMetadata={({props}) => ({durationInFrames: Math.ceil(props.durasi * 30)})} />
</>;
registerRoot(Root);
