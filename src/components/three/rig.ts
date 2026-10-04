/**
 * État partagé entre le DOM (GSAP ScrollTrigger) et la scène 3D (useFrame).
 * GSAP anime ces valeurs au scroll ; la caméra les suit à chaque frame.
 */

export type Station = { px: number; py: number; pz: number; tx: number; ty: number; tz: number };

/** Points de vue de la caméra, un par section (position + cible regardée). */
export const stations: Station[] = [
  // 0 — Accueil : prénom + âge
  { px: 0, py: 1.6, pz: 8.5, tx: 0, ty: 1.35, tz: 0 },
  // 1 — Date & lieu : le chiffre doré à gauche, la carte à droite
  { px: -7.6, py: 2.2, pz: -4, tx: -7.6, ty: 1.7, tz: -13 },
  // 2 — Programme : le gâteau et ses bougies
  { px: 11.8, py: 3.9, pz: -12.6, tx: 10.2, ty: 2.3, tz: -19 },
  // 3 — RSVP : envolée au milieu des ballons
  { px: 0, py: 8.5, pz: 2, tx: 0, ty: 7.2, tz: -9 },
];

/** Positions des éléments principaux dans le monde. */
export const anchors = {
  hero: [0, 1.75, 0] as const,
  date: [-10, 1.7, -13] as const,
  cake: [9, 0, -19] as const,
};

/**
 * En portrait, on recule la caméra pour garder les éléments dans le cadre.
 * Renvoie le multiplicateur de distance caméra → cible.
 */
export function distanceFactor(aspect: number) {
  return aspect < 1 ? 1 + (1 - aspect) * 0.9 : 1;
}

export const rig = {
  ...stations[0],
  /** Progression globale du scroll (0 → 1). */
  progress: 0,
};
