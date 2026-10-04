"use client";

import { Float } from "@react-three/drei";
import { useMemo } from "react";
import { LatheGeometry, Vector2 } from "three";
import type { Quality } from "@/lib/media";
import { balloonColors, seeded } from "./palette";

/** Profil de ballon (goutte d'eau) tourné autour de l'axe Y. */
function createBalloonGeometry() {
  const points: Vector2[] = [];
  const steps = 28;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI;
    let y = -Math.cos(a);
    let r = Math.sin(a);
    if (y < 0) {
      r *= 1 - 0.32 * Math.pow(-y, 1.6);
      y *= 1.22;
    }
    points.push(new Vector2(Math.max(r, 0.001) * 0.5, y * 0.55));
  }
  return new LatheGeometry(points, 32);
}

type BalloonData = {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
  tilt: number;
};

/** Zones où les ballons sont regroupés : [centre x, y, z, rayon, nombre (qualité haute)]. */
const clusters: [number, number, number, number, number][] = [
  [-5.2, 2.6, -1, 1.5, 6], // accueil, gauche
  [5.2, 2.6, -1, 1.5, 6], // accueil, droite
  [-13.5, 3, -14.5, 2, 5], // date
  [5.8, 3.2, -21.5, 2.2, 6], // gâteau
  [0, 8, -10, 5, 16], // ciel du RSVP
];

export function Balloons({ quality, reducedMotion }: { quality: Quality; reducedMotion: boolean }) {
  const geometry = useMemo(() => createBalloonGeometry(), []);

  const balloons = useMemo(() => {
    const rand = seeded(42);
    const ratio = quality === "high" ? 1 : 0.6;
    const list: BalloonData[] = [];
    for (const [cx, cy, cz, radius, count] of clusters) {
      const n = Math.max(2, Math.round(count * ratio));
      for (let i = 0; i < n; i++) {
        list.push({
          position: [
            cx + (rand() - 0.5) * radius * 2,
            cy + (rand() - 0.5) * radius * 1.4,
            cz + (rand() - 0.5) * radius * 2,
          ],
          scale: 0.8 + rand() * 0.55,
          color: balloonColors[Math.floor(rand() * balloonColors.length)],
          speed: 0.6 + rand() * 0.8,
          tilt: (rand() - 0.5) * 0.3,
        });
      }
    }
    return list;
  }, [quality]);

  return (
    <group>
      {balloons.map((b, i) => (
        <Float
          key={i}
          position={b.position}
          speed={reducedMotion ? 0 : b.speed}
          rotationIntensity={reducedMotion ? 0 : 0.35}
          floatIntensity={reducedMotion ? 0 : 0.8}
        >
          <group scale={b.scale} rotation={[0, 0, b.tilt]}>
            <mesh geometry={geometry}>
              <meshPhysicalMaterial
                color={b.color}
                roughness={0.18}
                metalness={0.15}
                clearcoat={1}
                clearcoatRoughness={0.08}
                sheen={0.4}
                sheenColor="#ffffff"
              />
            </mesh>
            {/* nœud */}
            <mesh position={[0, -0.7, 0]}>
              <coneGeometry args={[0.06, 0.09, 12]} />
              <meshStandardMaterial color={b.color} roughness={0.4} />
            </mesh>
            {/* ficelle */}
            <mesh position={[0, -1.6, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 1.8, 4]} />
              <meshStandardMaterial color="#f3e3c3" roughness={0.6} metalness={0.4} />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  );
}
