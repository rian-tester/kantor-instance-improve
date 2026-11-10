// Campur warna di OKLCH (SKILL-MOTION prinsip 12): perpindahan warna gak lewat abu kusam kayak campur RGB biasa.

const keLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const dariLinear = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

function hexKeOklch(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => keLinear(parseInt(h.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.sqrt(A * A + B * B), Math.atan2(B, A)];
}

function oklchKeHex(L: number, C: number, H: number) {
  const A = C * Math.cos(H);
  const B = C * Math.sin(H);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return '#' + rgb.map((c) => Math.round(Math.min(1, Math.max(0, dariLinear(c))) * 255).toString(16).padStart(2, '0')).join('');
}

/** Campur dua warna hex di OKLCH, p 0..1 (hue lewat jalan terpendek). */
export function campur(dari: string, ke: string, p: number) {
  const q = Math.min(1, Math.max(0, p));
  if (q <= 0) return dari;
  if (q >= 1) return ke;
  const [l1, c1, h1] = hexKeOklch(dari);
  const [l2, c2, h2] = hexKeOklch(ke);
  let dh = h2 - h1;
  if (dh > Math.PI) dh -= 2 * Math.PI;
  if (dh < -Math.PI) dh += 2 * Math.PI;
  // warna abu (chroma < 0,06) hue-nya gak berarti: pakai hue warna satunya biar gak muter liar
  const hA = c1 < 0.06 ? h2 : h1;
  const dH = c1 < 0.06 || c2 < 0.06 ? 0 : dh;
  return oklchKeHex(l1 + (l2 - l1) * q, c1 + (c2 - c1) * q, hA + dH * q);
}
