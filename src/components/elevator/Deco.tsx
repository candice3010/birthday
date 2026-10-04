"use client";

import { createContext, useContext, useMemo } from "react";
import { BoxGeometry, type Material, Quaternion, Vector3 } from "three";

/** Matériau or partagé par toutes les lignes Art déco d'une scène. */
export const GoldContext = createContext<Material | null>(null);

const unitBox = new BoxGeometry(1, 1, 1);
const Y = new Vector3(0, 1, 0);

type V3 = [number, number, number];

/** Fine barre dorée entre deux points. */
export function GoldBar({ from, to, t = 0.012 }: { from: V3; to: V3; t?: number }) {
  const material = useContext(GoldContext) ?? undefined;
  const { position, quaternion, length } = useMemo(() => {
    const a = new Vector3(...from);
    const b = new Vector3(...to);
    const dir = b.clone().sub(a);
    return {
      position: a.clone().add(b).multiplyScalar(0.5),
      quaternion: new Quaternion().setFromUnitVectors(Y, dir.clone().normalize()),
      length: dir.length(),
    };
  }, [from, to]);
  return (
    <mesh
      geometry={unitBox}
      material={material}
      position={position}
      quaternion={quaternion}
      scale={[t, length + t, t]}
    />
  );
}

/** Suite de barres reliant des points (dans le plan XY, z constant). */
export function GoldPath({ points, z = 0, t }: { points: [number, number][]; z?: number; t?: number }) {
  return (
    <>
      {points.slice(1).map((p, i) => (
        <GoldBar key={i} from={[points[i][0], points[i][1], z]} to={[p[0], p[1], z]} t={t} />
      ))}
    </>
  );
}

/** Arc doré (portion de tore) centré en (x, y), de start à start+arc radians. */
export function GoldArc({
  center,
  radius,
  start = 0,
  arc = Math.PI,
  t = 0.012,
}: {
  center: V3;
  radius: number;
  start?: number;
  arc?: number;
  t?: number;
}) {
  const material = useContext(GoldContext) ?? undefined;
  return (
    <mesh position={center} rotation={[0, 0, start]} material={material}>
      <torusGeometry args={[radius, t / 2, 6, Math.max(12, Math.round(arc * radius * 60)), arc]} />
    </mesh>
  );
}

/** Éventail Art déco : rayons + arcs concentriques, en demi-cercle vers le haut. */
export function Fan({
  center,
  radius,
  rays = 9,
  rings = [0.35, 0.7, 1],
  t = 0.01,
  inner = 0.12,
}: {
  center: V3;
  radius: number;
  rays?: number;
  rings?: number[];
  t?: number;
  inner?: number;
}) {
  const [cx, cy, cz] = center;
  return (
    <group>
      {Array.from({ length: rays }, (_, i) => {
        const a = (i / (rays - 1)) * Math.PI;
        const r0 = radius * inner;
        return (
          <GoldBar
            key={i}
            t={t}
            from={[cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cz]}
            to={[cx + Math.cos(a) * radius, cy + Math.sin(a) * radius, cz]}
          />
        );
      })}
      {rings.map((k) => (
        <GoldArc key={k} center={center} radius={radius * k} t={t} />
      ))}
    </group>
  );
}

/** Contour d'arche à gradins (ziggurat), symétrique, posé sur y = base. */
export function steppedArch(width: number, height: number, steps = 3, stepW = 0.08, stepH = 0.1) {
  const half = width / 2;
  const pts: [number, number][] = [[-half, 0]];
  let x = -half;
  let y = height - steps * stepH;
  pts.push([x, y]);
  for (let i = 0; i < steps; i++) {
    x += stepW;
    pts.push([x, y]);
    y += stepH;
    pts.push([x, y]);
  }
  const left = pts.slice();
  const right = left
    .slice()
    .reverse()
    .map(([px, py]) => [-px, py] as [number, number]);
  return [...left, ...right];
}
