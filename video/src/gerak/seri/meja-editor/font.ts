import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
export {MONO} from '../../font';
export const ANTON = 'Anton';
export const INTER = 'Jakarta';
loadFont({family: ANTON, url: staticFile('font/anton-400-latin.woff2'), weight: '400'});
loadFont({family: INTER, url: staticFile('font/jakarta.woff2'), weight: '100 900'});
