"use client";

import { Center, Text3D } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { type ReactNode, useRef, useState } from "react";
import type { Group } from "three";
import { event } from "@/config/event";
import { shortDate } from "@/lib/format";
import { distanceFactor, stations } from "./rig";
import { palette } from "./palette";

const FONT = "/fonts/gentilis_bold.json";

function GoldMaterial({ color = palette.gold }: { color?: string }) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={1}
      roughness={0.22}
      clearcoat={0.6}
      clearcoatRoughness={0.15}
      envMapIntensity={1.1}
    />
  );
}

/**
 * Réduit son contenu pour qu'il tienne dans la largeur visible
 * (indispensable sur mobile en portrait, quel que soit le prénom).
 */
function FitToView({
  children,
  distance,
  maxRatio = 0.86,
}: {
  children: ReactNode;
  distance: number;
  maxRatio?: number;
}) {
  const camera = useThree((s) => s.camera);
  const aspect = useThree((s) => s.size.width / s.size.height);
  const [width, setWidth] = useState(0);
  const fov = "fov" in camera ? (camera.fov as number) : 40;
  const visibleWidth =
    2 * distance * distanceFactor(aspect) * Math.tan(((fov / 2) * Math.PI) / 180) * aspect;
  const scale = width > 0 ? Math.min(1, (visibleWidth * maxRatio) / width) : 1;

  return (
    <group scale={scale}>
      <Center onCentered={({ width: w }) => setWidth((prev) => (Math.abs(prev - w) > 1e-3 ? w : prev))}>
        {children}
      </Center>
    </group>
  );
}

const textProps = {
  font: FONT,
  curveSegments: 10,
  bevelEnabled: true,
  bevelThickness: 0.025,
  bevelSize: 0.018,
  bevelSegments: 4,
};

export function HeroTitle({ position }: { position: readonly [number, number, number] }) {
  const s = stations[0];
  const distance = Math.hypot(s.px - position[0], s.pz - position[2]);
  return (
    <group position={position}>
      <FitToView distance={distance}>
        <group>
          <Text3D {...textProps} size={1.05} height={0.22} position={[0, 0.85, 0]} letterSpacing={0.02}>
            {event.firstName}
            <GoldMaterial />
          </Text3D>
          <Text3D {...textProps} size={1.25} height={0.26} position={[0, -0.75, 0]} letterSpacing={0.02}>
            {`${event.age} ans`}
            <GoldMaterial color={palette.roseGold} />
          </Text3D>
        </group>
      </FitToView>
    </group>
  );
}

export function DateMark({
  position,
  reducedMotion,
}: {
  position: readonly [number, number, number];
  reducedMotion: boolean;
}) {
  const ring = useRef<Group>(null);
  useFrame((_, delta) => {
    if (ring.current && !reducedMotion) ring.current.rotation.z += delta * 0.15;
  });

  return (
    <group position={position}>
      <Center>
        <Text3D {...textProps} size={1.15} height={0.24} letterSpacing={0.04}>
          {shortDate}
          <GoldMaterial />
        </Text3D>
      </Center>
      <group ref={ring} position={[0, 0, -0.6]}>
        <mesh>
          <torusGeometry args={[2.3, 0.03, 16, 128]} />
          <meshStandardMaterial color={palette.gold} metalness={1} roughness={0.2} />
        </mesh>
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 2.3, Math.sin(a) * 2.3, 0]}>
              <sphereGeometry args={[i % 3 === 0 ? 0.09 : 0.05, 16, 16]} />
              <meshStandardMaterial color={palette.champagne} metalness={1} roughness={0.15} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
