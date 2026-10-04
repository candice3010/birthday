"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, PointLight } from "three";
import { event } from "@/config/event";
import { palette } from "./palette";

const TIERS = [
  { radius: 1.45, height: 0.72, color: palette.cream },
  { radius: 1.1, height: 0.62, color: "#f3d9de" },
  { radius: 0.78, height: 0.52, color: palette.cream },
];
const PEDESTAL = 0.95;
/** Position verticale de chaque étage, empilés sur le plateau. */
const STACKED_TIERS = TIERS.map((tier, i) => {
  const base = PEDESTAL + 0.06 + TIERS.slice(0, i).reduce((sum, t) => sum + t.height, 0);
  return { ...tier, y: base + tier.height / 2, top: base + tier.height };
});
const TOP_Y = STACKED_TIERS[STACKED_TIERS.length - 1].top;
const CANDLE_COLORS = [palette.rose, palette.champagne, palette.gold, palette.pearl];

/** Gâteau à étages procédural, posé sur un piédestal, avec bougies allumées. */
export function Cake({
  position,
  reducedMotion,
}: {
  position: readonly [number, number, number];
  reducedMotion: boolean;
}) {
  const flames = useRef<Group>(null);
  const light = useRef<PointLight>(null);


  const candles = useMemo(() => {
    const n = Math.min(Math.max(event.candles, 1), 12);
    return Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      const r = n === 1 ? 0 : 0.5;
      return { x: Math.cos(a) * r, z: Math.sin(a) * r, color: CANDLE_COLORS[i % CANDLE_COLORS.length] };
    });
  }, []);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    flames.current?.children.forEach((flame, i) => {
      const f = 1 + Math.sin(t * 13 + i * 1.7) * 0.08 + Math.sin(t * 23 + i) * 0.05;
      flame.scale.set(1, f, 1);
    });
    if (light.current) light.current.intensity = 6 + Math.sin(t * 11) * 0.8 + Math.sin(t * 17) * 0.5;
  });

  return (
    <group position={position}>
      {/* piédestal */}
      <mesh position={[0, PEDESTAL / 2, 0]}>
        <cylinderGeometry args={[0.55, 0.85, PEDESTAL, 48]} />
        <meshPhysicalMaterial color="#2a1a2e" roughness={0.25} metalness={0.3} clearcoat={1} />
      </mesh>
      {/* plateau doré */}
      <mesh position={[0, PEDESTAL + 0.03, 0]}>
        <cylinderGeometry args={[1.85, 1.85, 0.06, 64]} />
        <meshStandardMaterial color={palette.gold} metalness={1} roughness={0.2} />
      </mesh>

      {STACKED_TIERS.map((tier, i) => (
        <group key={i}>
          <mesh position={[0, tier.y, 0]}>
            <cylinderGeometry args={[tier.radius, tier.radius, tier.height, 64]} />
            <meshPhysicalMaterial color={tier.color} roughness={0.55} sheen={1} sheenColor="#fff4ea" />
          </mesh>
          {/* glaçage arrondi sur le bord supérieur */}
          <mesh position={[0, tier.top - 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[tier.radius - 0.04, 0.06, 12, 64]} />
            <meshPhysicalMaterial color={palette.pearl} roughness={0.35} clearcoat={0.6} />
          </mesh>
          {/* ruban doré */}
          <mesh position={[0, tier.y - tier.height * 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[tier.radius + 0.005, 0.035, 8, 64]} />
            <meshStandardMaterial color={palette.gold} metalness={1} roughness={0.18} />
          </mesh>
        </group>
      ))}

      {/* bougies */}
      <group position={[0, TOP_Y, 0]}>
        {candles.map((c, i) => (
          <mesh key={i} position={[c.x, 0.22, c.z]}>
            <cylinderGeometry args={[0.035, 0.035, 0.44, 12]} />
            <meshStandardMaterial color={c.color} roughness={0.5} />
          </mesh>
        ))}
        <group ref={flames}>
          {candles.map((c, i) => (
            <mesh key={i} position={[c.x, 0.52, c.z]} scale={1}>
              <sphereGeometry args={[0.045, 12, 12]} />
              {/* couleur > 1 : capté par le bloom */}
              <meshBasicMaterial color={[5, 2.6, 0.9]} toneMapped={false} />
            </mesh>
          ))}
        </group>
        <pointLight ref={light} position={[0, 0.9, 0]} color="#ffb36b" intensity={6} distance={7} decay={1.6} />
      </group>
    </group>
  );
}
