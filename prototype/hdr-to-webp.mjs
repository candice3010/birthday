// Convertit l'HDRI (Radiance .hdr) en .webp « tone-mappé » pour la page d'aperçu (qui ne sert pas les .hdr).
import { readFileSync } from "node:fs";
import sharp from "sharp";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import { FloatType } from "three";
const [src, dest] = process.argv.slice(2);
const loader = new HDRLoader(); loader.setDataType(FloatType);
const buf = readFileSync(src);
const { width, height, data } = loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const out = Buffer.alloc(width * height * 3);
const exposure = 1.4;
for (let i = 0; i < width * height; i++) for (let c = 0; c < 3; c++) {
  const v = data[i * 4 + c] * exposure; const t = v / (1 + v); // Reinhard
  out[i * 3 + c] = Math.round(Math.pow(t, 1 / 2.2) * 255);
}
await sharp(out, { raw: { width, height, channels: 3 } }).webp({ quality: 88 }).toFile(dest);
console.log(width, height, "→", dest);
