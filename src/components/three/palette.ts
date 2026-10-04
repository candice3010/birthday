/** Palette « nuit prune & or champagne » partagée par la scène 3D. */
export const palette = {
  background: "#0b0710",
  gold: "#e9c27a",
  champagne: "#f3e3c3",
  rose: "#e8a6b8",
  roseGold: "#d99a8c",
  plum: "#5b2a5e",
  pearl: "#f4eef3",
  cream: "#f6e7d8",
} as const;

export const balloonColors = [
  palette.gold,
  palette.rose,
  palette.champagne,
  palette.plum,
  palette.pearl,
  palette.roseGold,
];

/** Générateur pseudo-aléatoire déterministe (mulberry32). */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
