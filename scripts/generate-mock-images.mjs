/**
 * Genera los placeholders de `public/mock/` que usa el adaptador de datos mock.
 *
 * Son PNG planos con un degradado muy suave: sirven para comprobar
 * proporciones y maquetación sin meter las imágenes de Wix en el repo.
 * Se borran en la Fase 3, cuando los assets vivan en Contentful.
 *
 * Uso: node scripts/generate-mock-images.mjs
 */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "mock",
);

/** Mismas proporciones que declara `src/lib/contentful/mock.ts`. */
const IMAGES = [
  ["hero", 2400, 1350],
  ["portrait", 1200, 1500],
  ["blackout", 1600, 900],
  ["cest-tres-excitant", 1200, 1500],
  ["pequenas-cosas", 1400, 1400],
  ["atleticos-al-nuevo-metropolitano", 1600, 1067],
  ["alices-spaces", 1200, 1600],
  ["tempus-fugit", 1500, 1000],
  ["el-sueno-de-la-razon", 1200, 1500],
  ["do-not-stop", 1600, 900],
  ["draballoon", 1600, 1000],
  ["cubiertos-fusion", 1400, 1050],
  ["hollow-la-cerveza", 1200, 1600],
  ["una-pequena-parte-del-mundo", 1600, 1067],
];

/** Tonos apagados en la línea del lienzo de galería. */
const TINTS = [
  [232, 226, 217],
  [223, 219, 214],
  [228, 221, 226],
  [219, 224, 223],
  [231, 224, 213],
  [221, 218, 228],
];

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typeAndData = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData));
  return Buffer.concat([length, typeAndData, crc]);
}

function png(width, height, tint) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // bit depth
  header[9] = 2; // color type: truecolor
  header[10] = 0; // compression
  header[11] = 0; // filter
  header[12] = 0; // interlace

  // Una fila por línea: byte de filtro 0 + RGB. El degradado vertical va de
  // un 6 % más claro arriba a un 6 % más oscuro abajo.
  const raw = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (1 + width * 3);
    raw[rowStart] = 0;
    const factor = 1.06 - (y / Math.max(height - 1, 1)) * 0.12;
    const rgb = tint.map((channel) =>
      Math.max(0, Math.min(255, Math.round(channel * factor))),
    );
    for (let x = 0; x < width; x += 1) {
      const pixel = rowStart + 1 + x * 3;
      raw[pixel] = rgb[0];
      raw[pixel + 1] = rgb[1];
      raw[pixel + 2] = rgb[2];
    }
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

mkdirSync(OUT_DIR, { recursive: true });

IMAGES.forEach(([name, width, height], index) => {
  const file = join(OUT_DIR, `${name}.png`);
  writeFileSync(file, png(width, height, TINTS[index % TINTS.length]));
  console.log(`${name}.png  ${width}×${height}`);
});
