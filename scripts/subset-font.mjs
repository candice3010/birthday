// Réduit une police typeface.json de three.js aux caractères latins (accents FR compris).
// Usage : node scripts/subset-font.mjs <source.typeface.json> <destination.json>
import { readFileSync, writeFileSync } from "node:fs";

const [src, dest] = process.argv.slice(2);
if (!src || !dest) {
  console.error("Usage : node scripts/subset-font.mjs <source> <destination>");
  process.exit(1);
}

const keep = new Set();
for (let c = 32; c <= 126; c++) keep.add(String.fromCharCode(c));
for (let c = 160; c <= 255; c++) keep.add(String.fromCharCode(c));
for (const c of "œŒ’‘“”–—…·•€") keep.add(c);

const font = JSON.parse(readFileSync(src, "utf8"));
font.glyphs = Object.fromEntries(
  Object.entries(font.glyphs).filter(([char]) => keep.has(char)),
);
writeFileSync(dest, JSON.stringify(font));
console.log(`${Object.keys(font.glyphs).length} glyphes → ${dest}`);
