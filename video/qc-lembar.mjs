import fs from 'node:fs';
import path from 'node:path';
import {deflateSync} from 'node:zlib';

function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
export function pngRgb(width, height, rgb) {
  const chunk = (nama, data) => {
    const tipe = Buffer.from(nama), ukuran = Buffer.alloc(4), crc = Buffer.alloc(4);
    ukuran.writeUInt32BE(data.length); crc.writeUInt32BE(crc32(Buffer.concat([tipe, data])));
    return Buffer.concat([ukuran, tipe, data, crc]);
  };
  const header = Buffer.alloc(13); header.writeUInt32BE(width); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 2;
  const baris = Buffer.alloc(height * (width * 3 + 1));
  for (let y = 0; y < height; y++) rgb.copy(baris, y * (width * 3 + 1) + 1, y * width * 3, (y + 1) * width * 3);
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR', header), chunk('IDAT', deflateSync(baris)), chunk('IEND', Buffer.alloc(0))]);
}
export function lembarRemotion(input, metadata, lembar, run) {
  const width = 180, height = Math.max(2, Math.round(metadata.height * width / metadata.width / 2) * 2);
  const gridWidth = width * 4, gridHeight = height * 3;
  const grid = Buffer.alloc(gridWidth * gridHeight * 3);
  const sementara = fs.mkdtempSync(path.join(path.dirname(lembar), '.qc-'));
  try {
    for (let i = 0; i < 12; i++) {
      const jpg = path.join(sementara, `${i}.jpg`);
      const r = run(['ffmpeg','-nostdin','-v','error','-ss',String(metadata.durasi * i / 12),'-i',input,'-frames:v','1','-vf',`scale=${width}:${height}`,'-threads','1',jpg]);
      if (r.error || r.status !== 0) throw new Error(`Ambil frame lembar gagal: ${r.error?.message || r.stderr}`);
      const raw = run(['ffmpeg','-nostdin','-v','error','-i',jpg,'-vf','format=rgb24','-c:v','rawvideo','-threads','1','-f','image2pipe','-'], {encoding: null});
      if (raw.error || raw.status !== 0 || raw.stdout.length !== width * height * 3) throw new Error('Frame lembar belum terbaca lengkap');
      for (let y = 0; y < height; y++) raw.stdout.copy(grid, ((Math.floor(i / 4) * height + y) * gridWidth + i % 4 * width) * 3, y * width * 3, (y + 1) * width * 3);
    }
    const png = path.join(sementara, 'grid.png'); fs.writeFileSync(png, pngRgb(gridWidth, gridHeight, grid));
    const r = run(['ffmpeg','-nostdin','-v','error','-n','-i',png,'-frames:v','1','-threads','1',lembar]);
    if (r.error || r.status !== 0) throw new Error(`Simpan lembar gagal: ${r.error?.message || r.stderr}`);
  } finally { fs.rmSync(sementara, {recursive: true, force: true}); }
}
