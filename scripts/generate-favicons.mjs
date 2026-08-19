import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const pubDir = './public';
if (!fs.existsSync(pubDir)) {
  fs.mkdirSync(pubDir, { recursive: true });
}

// 1. Create SVG Icon
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="100%" stop-color="#064e3b" />
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#g)" />
  <path d="M64,24 C64,24 84,44 84,68 C84,82 72,94 58,94 C44,94 34,84 34,70 C34,48 54,30 64,24 Z" fill="#ffffff" opacity="0.9" />
  <path d="M64,94 L64,104" stroke="#a7f3d0" stroke-width="6" stroke-linecap="round" />
  <path d="M64,68 C64,68 76,56 94,60 C94,76 80,86 64,86 Z" fill="#34d399" />
</svg>`;

fs.writeFileSync(path.join(pubDir, 'icon.svg'), svgIcon);
fs.writeFileSync(path.join(pubDir, 'favicon.svg'), svgIcon);

// 2. Generate a valid 32x32 PNG file buffer in pure JS
function createSimplePng(width, height, r, g, b) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bit depth
  ihdrData[9] = 2; // Truecolor (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw image data with filter byte per line
  const rawRows = [];
  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 3);
    row[0] = 0; // No filter
    for (let x = 0; x < width; x++) {
      // Draw a rounded leaf emblem
      const dx = x - width / 2;
      const dy = y - height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < width / 2.2) {
        row[1 + x * 3] = r;
        row[1 + x * 3 + 1] = g;
        row[1 + x * 3 + 2] = b;
      } else {
        row[1 + x * 3] = 6;
        row[1 + x * 3 + 1] = 78;
        row[1 + x * 3 + 2] = 59;
      }
    }
    rawRows.push(row);
  }
  const rawData = Buffer.concat(rawRows);
  const compressed = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    const byte = buf[i];
    crc = crc ^ byte;
    for (let j = 0; j < 8; j++) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const png32 = createSimplePng(32, 32, 52, 211, 153);
const png192 = createSimplePng(192, 192, 52, 211, 153);
const png512 = createSimplePng(512, 512, 52, 211, 153);

fs.writeFileSync(path.join(pubDir, 'favicon.ico'), png32);
fs.writeFileSync(path.join(pubDir, 'icon-192.png'), png192);
fs.writeFileSync(path.join(pubDir, 'icon-512.png'), png512);

console.log('✅ Generated favicon.ico, icon.svg, icon-192.png, icon-512.png');
