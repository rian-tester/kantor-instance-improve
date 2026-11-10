// SISTEM explainer "Raja − Pria + Wanita = Ratu": keluarga KINETIC DATA GELAP.
// Latar navy gelap + grid koordinat, 2 warna makna: TEAL = arah/vektor (pria→wanita, jamak), KUNING = hasil/kata kunci
// (ratu, angka penting). Merah koral cuma buat "dikurangi" & yang dicoret/salah. Font: Saira Condensed (judul, kata di peta,
// angka) + JetBrains Mono (label, angka vektor, sumber) + Kalam (anotasi tangan, jarang).
import type { Sfx } from "../../../src/gerak";

export const W = 1920;
export const H = 1080;

export const K = {
  latar: '#070c18',
  latar2: '#0d1730',
  panel: '#0f1a33',
  garis: '#24365a',
  tinta: '#eef3f8',
  abu: '#8a9ab0',
  redup: '#4b6080',
  teal: '#3ddbc8',
  tealTua: '#1d8f86',
  kuning: '#ffc53d',
  merah: '#ff6b57',
};

const s = (id: string, puncak: number) => ({ src: '', puncak });
export const SFX = {
  pop: s('39e3b2a6-704e-4920-a474-b4ae0f3789d8', 0.113),
  tik: s('be7dbf02-e278-4f53-b8b6-2f9c287db6a4', 0.071),
  swish: s('7935eba8-1fc6-42da-a1a4-0bd269bf1431', 0.172),
  whooshA: s('7070b42c-d83c-4a6e-865a-3efca4f08244', 0.148),
  whooshB: s('7a5c0a2a-bbaf-4cef-84b4-83fe9dc67446', 0.155),
  whooshBerat: s('f06764a2-809d-4892-b8c0-a2173507908d', 0.371),
  whooshPop: s('a4b942b2-2b97-4ba7-a366-c51a7dca2742', 0.079),
  whooshTurun: s('c2066005-87ff-43cd-b2d6-34cdbfa557e3', 0.3),
  whooshPunch: s('9c5e4ada-17b7-4d89-86f6-cd5eb381fa83', 0.137),
  whooshTerang: s('a5135085-d6b9-42a1-a183-068d3c206011', 0.337),
  whooshLembut: s('3e3bd313-e697-41bc-b33e-61bbd361db00', 0.343),
  glitch: s('52b0963c-b7ce-41d6-b71e-663b152e57dd', 0.071),
  hantam: s('47b771aa-ec1f-4e5d-bfb4-f53115d5ba34', 0.305),
  sapuHit: s('57b926bf-1dab-4b05-9190-870a75b8dc76', 0.338),
  kunci: s('b0fbad78-1aef-41d0-813e-7a7f87c98aab', 0.274),
  klik: s('b0e0ad18-57bd-4c4a-9b55-3b5b98b0328c', 0.14),
  jepret: s('9daa462f-b81f-4809-83a0-0689e8198387', 0.116),
  riser: s('3e1a64bc-1741-4a7f-846b-2b97f8127264', 2.039),
};
export type NamaSfx = keyof typeof SFX;
export const bunyi = (k: NamaSfx, momen: number, vol: number): Sfx => ({ ...SFX[k], momen, vol });
