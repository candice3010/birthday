"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Color, DoubleSide, type InstancedMesh, Object3D } from "three";
import type { Quality } from "@/lib/media";
import { palette, seeded } from "./palette";

const BOUNDS = { x: [-16, 16], y: [-0.5, 14], z: [-22, 10] } as const;
const COLORS = [palette.gold, palette.champagne, palette.rose, palette.roseGold, palette.pearl];

// Objet de travail pour composer les matrices d'instance.
const dummy = new Object3D();
const color = new Color();

type Particle = {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  spin: number;
  fall: number;
  sway: number;
  color: string;
};

function createParticles(count: number): Particle[] {
  const rand = seeded(7);
  return Array.from({ length: count }, () => ({
    x: BOUNDS.x[0] + rand() * (BOUNDS.x[1] - BOUNDS.x[0]),
    y: BOUNDS.y[0] + rand() * (BOUNDS.y[1] - BOUNDS.y[0]),
    z: BOUNDS.z[0] + rand() * (BOUNDS.z[1] - BOUNDS.z[0]),
    rx: rand() * Math.PI,
    ry: rand() * Math.PI,
    spin: 0.6 + rand() * 2.2,
    fall: 0.25 + rand() * 0.45,
    sway: rand() * Math.PI * 2,
    color: COLORS[Math.floor(rand() * COLORS.length)],
  }));
}

/** Confettis métallisés en InstancedMesh : un seul draw call pour des centaines de pièces. */
export function Confetti({ quality, reducedMotion }: { quality: Quality; reducedMotion: boolean }) {
  const count = quality === "high" ? 700 : 260;
  const meshRef = useRef<InstancedMesh>(null);
  const initial = useMemo(() => createParticles(count), [count]);
  // État animé, mutable, conservé hors du cycle de rendu React.
  const live = useRef<Particle[]>([]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    live.current = initial.map((p) => ({ ...p }));
    live.current.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rx, p.ry, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, color.set(p.color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [initial]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh || reducedMotion) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const particles = live.current;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y -= p.fall * dt;
      if (p.y < BOUNDS.y[0]) p.y = BOUNDS.y[1];
      p.rx += p.spin * dt;
      p.ry += p.spin * 0.7 * dt;
      dummy.position.set(p.x + Math.sin(t * 0.8 + p.sway) * 0.25, p.y, p.z);
      dummy.rotation.set(p.rx, p.ry, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh key={count} ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[0.07, 0.13]} />
      <meshStandardMaterial metalness={0.85} roughness={0.25} side={DoubleSide} />
    </instancedMesh>
  );
}
