import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Affiliate, type DataAffiliate} from './src/affiliate/Affiliate';
import produk from './public/produk/contoh/data.json';
// Entry contoh ini tetap tersedia ketika Root karya kamu sudah diubah.
registerRoot(() => <Composition id="ContohAffiliate" component={Affiliate} width={1080} height={1920}
  fps={30} durationInFrames={450} defaultProps={produk as DataAffiliate}
  calculateMetadata={({props}) => ({durationInFrames: Math.ceil(props.durasi * 30)})} />);
