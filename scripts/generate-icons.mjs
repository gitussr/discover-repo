// Generates the raster PWA/apple-touch icons from scratch (no image deps or
// external assets) as real PNG files, using only Node's built-in zlib.
// The glyph mirrors the app's own command-prompt visual language (the ">"
// used throughout the command bar/palette, plus a cursor-like underscore).
// Re-run with `node scripts/generate-icons.mjs` if the icon design changes.
import { deflateSync, crc32 } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

const BG = [0x14, 0x14, 0x14];
const ACCENT = [0x32, 0xe0, 0xfb];
const CURSOR = [0x37, 0xe5, 0x7b];

function distToSegment(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;
  const lenSq = abx * abx + aby * aby;
  let t = lenSq === 0 ? 0 : (apx * abx + apy * aby) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * abx;
  const cy = ay + t * aby;
  return Math.hypot(px - cx, py - cy);
}

function renderIcon(size) {
  const s = size / 100;
  const strokeWidth = 9 * s;
  const half = strokeWidth / 2;
  const p1 = [32 * s, 28 * s];
  const p2 = [62 * s, 50 * s];
  const p3 = [32 * s, 72 * s];
  const barX0 = 60 * s;
  const barX1 = 82 * s;
  const barY0 = 66 * s;
  const barY1 = 74 * s;
  const barRadius = 2 * s;

  const pixels = Buffer.alloc(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      let color = BG;

      const dChevron = Math.min(
        distToSegment(px, py, p1[0], p1[1], p2[0], p2[1]),
        distToSegment(px, py, p2[0], p2[1], p3[0], p3[1])
      );
      const inBar =
        px >= barX0 - barRadius &&
        px <= barX1 + barRadius &&
        py >= barY0 - barRadius &&
        py <= barY1 + barRadius;

      if (dChevron <= half) {
        color = ACCENT;
      } else if (inBar) {
        color = CURSOR;
      }

      const idx = (y * size + x) * 4;
      pixels[idx] = color[0];
      pixels[idx + 1] = color[1];
      pixels[idx + 2] = color[2];
      pixels[idx + 3] = 255;
    }
  }

  return pixels;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])) >>> 0, 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePNG(size) {
  const pixels = renderIcon(size);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(6, 9); // color type: RGBA
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);

  const raw = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    const rowStart = y * (1 + size * 4);
    raw[rowStart] = 0; // filter: none
    pixels.copy(raw, rowStart + 1, y * size * 4, (y + 1) * size * 4);
  }
  const idat = deflateSync(raw);

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

mkdirSync(new URL("../public/icons/", import.meta.url), { recursive: true });

for (const size of [512, 192, 180]) {
  const png = encodePNG(size);
  const path = new URL(`../public/icons/icon-${size}.png`, import.meta.url);
  writeFileSync(path, png);
  console.log(`wrote ${path.pathname} (${png.length} bytes)`);
}
