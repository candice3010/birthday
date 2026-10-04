/** Les trois ambiances proposées. Une seule sera retenue pour le site final. */
export type Theme = {
  id: "golden" | "nuit" | "mer";
  label: string;
  tagline: string;
  /** HDRI Poly Haven (CC0) pour les reflets sur l'or et le verre. */
  hdri: string;
  envIntensity: number;
  /** Couleur de fond / brouillard. */
  fog: string;
  /** Laque des murs de la cabine. */
  wall: string;
  /** Panneaux en retrait (plus foncés ou plus clairs). */
  panel: string;
  /** Sol en pierre polie. */
  floor: string;
  /** Or des lignes Art déco. */
  gold: string;
  /** Lumière principale (plafonnier). */
  key: string;
  /** Lumière d'appoint, teinte secondaire. */
  fill: string;
  /** Lueur émissive (néon, appliques). */
  glow: string;
  /** Teintes des photos-souvenirs de démonstration. */
  photo: [string, string, string];
  /** Vue à travers les portes vitrées : ciel (haut → bas) et points lumineux. */
  view: { top: string; bottom: string; lights: string; horizon?: string };
  /** Dégradé CSS de l'interface. */
  ui: { bg: string; ink: string; accent: string };
};

export const themes: Record<Theme["id"], Theme> = {
  golden: {
    id: "golden",
    label: "Golden hour",
    tagline: "Pêche, rose doux, lilas, reflets dorés",
    hdri: "/hdri/golden.hdr",
    envIntensity: 0.55,
    fog: "#d9917a",
    wall: "#e09a7c",
    panel: "#a9637a",
    floor: "#7d4f5f",
    gold: "#e2ad5f",
    key: "#ffcf94",
    fill: "#b48fd6",
    glow: "#ffc37e",
    photo: ["#ffb27a", "#ef8fa0", "#a98bd4"],
    view: { top: "#8f73c9", bottom: "#ff9a6a", lights: "#ffe2a8" },
    ui: { bg: "#3b2230", ink: "#fff3ea", accent: "#f0c98a" },
  },
  nuit: {
    id: "nuit",
    label: "Nuit douce",
    tagline: "Bleu nuit velouté, lavande, touches de rose néon",
    hdri: "/hdri/nuit.hdr",
    envIntensity: 0.5,
    fog: "#1b1f3d",
    wall: "#262c55",
    panel: "#1c2146",
    floor: "#161a36",
    gold: "#e9c486",
    key: "#c9b8ff",
    fill: "#ff5fae",
    glow: "#ff7cc0",
    photo: ["#6c5fc7", "#ff7cc0", "#9fb4ff"],
    view: { top: "#0d1030", bottom: "#4a3a8c", lights: "#ff8fd0" },
    ui: { bg: "#12152c", ink: "#f1edff", accent: "#ff8fca" },
  },
  mer: {
    id: "mer",
    label: "Bord de mer",
    tagline: "Sable, turquoise, corail",
    hdri: "/hdri/mer.hdr",
    envIntensity: 0.55,
    fog: "#d9c3a0",
    wall: "#dcc39d",
    panel: "#1f8a89",
    floor: "#a8875f",
    gold: "#d9a85c",
    key: "#ffe6c2",
    fill: "#3cc4c0",
    glow: "#ff8a70",
    photo: ["#ff8a70", "#3cc4c0", "#f3d9a8"],
    view: { top: "#7fd0cc", bottom: "#ffb48a", lights: "#fff3dc", horizon: "#1f9f9b" },
    ui: { bg: "#123c3f", ink: "#fff8ec", accent: "#ff9a80" },
  },
};
