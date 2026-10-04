"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  CanvasTexture,
  DoubleSide,
  type Group,
  MeshPhysicalMaterial,
  SRGBColorSpace,
} from "three";
import type { Theme } from "@/lib/themes";
import { Fan, GoldArc, GoldBar, GoldContext, GoldPath, steppedArch } from "./Deco";

// Dimensions de la cabine (mètres).
const W = 2.2;
const H = 3.1;
const FRONT = -1.5;
const BACK = 1.9;
const DOOR_W = 1.24;
const DOOR_H = 2.15;
export const DIAL_CENTER: [number, number, number] = [0, 2.36, FRONT + 0.03];
const DIAL_R = 0.5;
const FONT = "/fonts/PoiretOne-Regular.ttf";

/** Angle de l'aiguille pour un étage (1 à gauche, 23 à droite). */
const ARC_MARGIN = 0.2;
const floorAngle = (floor: number) =>
  Math.PI - ARC_MARGIN - ((floor - 1) / 22) * (Math.PI - 2 * ARC_MARGIN);

function Dial({ theme, floorRef }: { theme: Theme; floorRef: { current: number } }) {
  const needle = useRef<Group>(null);
  useFrame(() => {
    if (needle.current) needle.current.rotation.z = floorAngle(floorRef.current) - Math.PI / 2;
  });
  const [cx, cy, cz] = DIAL_CENTER;

  return (
    <group>
      {/* plaque du cadran */}
      <mesh position={[cx, cy, cz - 0.005]}>
        <circleGeometry args={[DIAL_R + 0.06, 64, 0, Math.PI]} />
        <meshPhysicalMaterial color={theme.panel} roughness={0.35} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      <GoldArc center={[cx, cy, cz]} radius={DIAL_R + 0.06} t={0.018} />
      <GoldArc center={[cx, cy, cz]} radius={DIAL_R - 0.13} t={0.008} />
      <GoldBar from={[cx - DIAL_R - 0.06, cy, cz]} to={[cx + DIAL_R + 0.06, cy, cz]} t={0.016} />

      {/* graduations + chiffres impairs */}
      {Array.from({ length: 23 }, (_, i) => {
        const floor = i + 1;
        const a = floorAngle(floor);
        const major = floor % 2 === 1;
        const r1 = DIAL_R - 0.1;
        const r2 = DIAL_R - (major ? 0.04 : 0.065);
        return (
          <group key={floor}>
            <GoldBar
              t={major ? 0.008 : 0.005}
              from={[cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, cz]}
              to={[cx + Math.cos(a) * r2, cy + Math.sin(a) * r2, cz]}
            />
            {major && (
              <Text
                font={FONT}
                fontSize={floor === 23 ? 0.072 : 0.05}
                position={[cx + Math.cos(a) * (DIAL_R + 0.005), cy + Math.sin(a) * (DIAL_R + 0.005), cz + 0.004]}
                anchorX="center"
                anchorY="middle"
                color={floor === 23 ? theme.glow : theme.gold}
              >
                {String(floor)}
              </Text>
            )}
          </group>
        );
      })}

      {/* aiguille */}
      <group ref={needle} position={[cx, cy, cz + 0.012]}>
        <mesh position={[0, DIAL_R * 0.42, 0]}>
          <coneGeometry args={[0.018, DIAL_R * 0.84, 4]} />
          <meshStandardMaterial color={theme.gold} metalness={1} roughness={0.15} />
        </mesh>
      </group>
      <mesh position={[cx, cy, cz + 0.02]}>
        <sphereGeometry args={[0.035, 24, 24]} />
        <meshStandardMaterial color={theme.gold} metalness={1} roughness={0.15} />
      </mesh>
    </group>
  );
}

/** Façade : murs latéraux de la porte, linteau, portes vitrées à grille Art déco. */
function FrontWall({ theme, lacquer }: { theme: Theme; lacquer: MeshPhysicalMaterial }) {
  const sideW = (W - DOOR_W) / 2;
  const z = FRONT;
  return (
    <group>
      <mesh position={[-(DOOR_W / 2 + sideW / 2), H / 2, z - 0.05]} material={lacquer}>
        <boxGeometry args={[sideW, H, 0.1]} />
      </mesh>
      <mesh position={[DOOR_W / 2 + sideW / 2, H / 2, z - 0.05]} material={lacquer}>
        <boxGeometry args={[sideW, H, 0.1]} />
      </mesh>
      <mesh position={[0, DOOR_H + (H - DOOR_H) / 2, z - 0.05]} material={lacquer}>
        <boxGeometry args={[DOOR_W, H - DOOR_H, 0.1]} />
      </mesh>

      {/* encadrement en arche à gradins */}
      <GoldPath points={steppedArch(DOOR_W + 0.1, DOOR_H + 0.12, 3, 0.07, 0.06)} z={z + 0.01} t={0.02} />
      <GoldPath points={steppedArch(DOOR_W + 0.24, DOOR_H + 0.26, 3, 0.07, 0.06)} z={z + 0.01} t={0.008} />

      {/* pilastres à gradins */}
      {[-1, 1].map((s) => (
        <group key={s}>
          {[0, 0.05, 0.1].map((d) => (
            <GoldBar key={d} t={0.009} from={[s * (W / 2 - 0.12 - d), 0.08, z + 0.01]} to={[s * (W / 2 - 0.12 - d), H - 0.3 + d * 1.5, z + 0.01]} />
          ))}
        </group>
      ))}

      {/* portes vitrées */}
      <mesh position={[0, DOOR_H / 2, z - 0.02]}>
        <planeGeometry args={[DOOR_W, DOOR_H]} />
        <meshPhysicalMaterial
          color={theme.fog}
          roughness={0.08}
          metalness={0}
          transparent
          opacity={0.07}
          envMapIntensity={1.4}
          side={DoubleSide}
        />
      </mesh>
      <GoldBar from={[0, 0, z]} to={[0, DOOR_H, z]} t={0.016} />
      <Fan center={[0, 1.15, z]} radius={0.58} rays={11} rings={[0.3, 0.62, 1]} t={0.009} />
      {[-0.42, -0.21, 0.21, 0.42].map((x) => (
        <GoldBar key={x} from={[x, 0.06, z]} to={[x, 1.15 - (Math.abs(x) > 0.3 ? 0.2 : 0.05), z]} t={0.007} />
      ))}
      <GoldBar from={[-DOOR_W / 2, 1.15, z]} to={[DOOR_W / 2, 1.15, z]} t={0.009} />
    </group>
  );
}

function SideWalls({ lacquer, theme }: { lacquer: MeshPhysicalMaterial; theme: Theme }) {
  const depth = BACK - FRONT;
  const midZ = (BACK + FRONT) / 2;
  return (
    <group>
      {[-1, 1].map((s) => {
        const x = s * W / 2;
        return (
          <group key={s}>
            <mesh position={[x + s * 0.05, H / 2, midZ]} material={lacquer}>
              <boxGeometry args={[0.1, H, depth]} />
            </mesh>
            {/* cadres dorés — groupe tourné : x local = z monde, y = y */}
            <group position={[x - s * 0.006, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
              {[
                [FRONT + 0.2, -0.05],
                [0.05, 1.3],
              ].map(([z0, z1], i) => (
                <group key={i}>
                  <GoldPath t={0.01} points={[[z0, 1.15], [z0, 2.75], [z1, 2.75], [z1, 1.15], [z0, 1.15]]} />
                  <GoldPath t={0.006} points={[[z0 + 0.06, 1.21], [z0 + 0.06, 2.69], [z1 - 0.06, 2.69], [z1 - 0.06, 1.21], [z0 + 0.06, 1.21]]} />
                </group>
              ))}
            </group>
            {/* soubassement laqué, couleur d'accent */}
            <mesh position={[x - s * 0.015, 0.47, midZ]}>
              <boxGeometry args={[0.03, 0.94, depth - 0.02]} />
              <meshPhysicalMaterial color={theme.panel} roughness={0.3} clearcoat={1} clearcoatRoughness={0.15} envMapIntensity={0.5} />
            </mesh>
            {/* main courante */}
            <mesh position={[x - s * 0.07, 0.95, midZ]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.018, 0.018, depth - 0.3, 16]} />
              <meshStandardMaterial color={theme.gold} metalness={1} roughness={0.2} />
            </mesh>
            {/* applique éventail lumineuse */}
            <group position={[x - s * 0.012, 2.2, FRONT + 0.75]} rotation={[0, -s * Math.PI / 2, 0]}>
              <mesh>
                <circleGeometry args={[0.14, 32, 0, Math.PI]} />
                <meshBasicMaterial color={theme.glow} toneMapped={false} />
              </mesh>
              <Fan center={[0, 0, 0.005]} radius={0.17} rays={7} rings={[0.55, 1]} t={0.006} />
            </group>
          </group>
        );
      })}
    </group>
  );
}

/** Photo-souvenir de démonstration (remplacée plus tard par vos vraies photos). */
function usePhotoTexture(colors: [string, string, string], seed: number) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 300;
    const g = c.getContext("2d")!;
    g.fillStyle = "#f8f2e8";
    g.fillRect(0, 0, 256, 300);
    g.save();
    g.beginPath();
    g.rect(14, 14, 228, 216);
    g.clip();
    const sky = g.createLinearGradient(0, 14, 0, 230);
    sky.addColorStop(0, colors[(seed + 2) % 3]);
    sky.addColorStop(1, colors[seed % 3]);
    g.fillStyle = sky;
    g.fillRect(14, 14, 228, 216);
    // bokeh flou d'une soirée
    g.filter = "blur(6px)";
    for (let i = 0; i < 14; i++) {
      const x = 14 + ((i * 53 + seed * 37) % 228);
      const y = 20 + ((i * 29 + seed * 17) % 110);
      g.fillStyle = `rgba(255,245,225,${0.25 + ((i * 7) % 5) / 10})`;
      g.beginPath();
      g.arc(x, y, 6 + (i % 4) * 4, 0, Math.PI * 2);
      g.fill();
    }
    // silhouettes d'amis, floues comme un vieux tirage
    g.filter = "blur(2.5px)";
    g.fillStyle = "rgba(45,22,40,0.6)";
    const people = 2 + (seed % 3);
    for (let i = 0; i < people; i++) {
      const px = 30 + (i + 0.5) * (196 / people) + (i % 2 ? 6 : -6);
      const py = 150 + (i % 2) * 8;
      g.beginPath();
      g.ellipse(px, py, 16, 19, 0, 0, Math.PI * 2);
      g.fill();
      g.beginPath();
      g.ellipse(px, py + 78, 38, 60, 0, Math.PI, 0);
      g.fill();
    }
    g.restore();
    g.filter = "none";
    // vignette chaude façon pellicule
    const v = g.createRadialGradient(128, 122, 40, 128, 122, 170);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(60,30,20,0.35)");
    g.fillStyle = v;
    g.fillRect(14, 14, 228, 216);
    const tex = new CanvasTexture(c);
    tex.colorSpace = SRGBColorSpace;
    return tex;
  }, [colors, seed]);
}

/** Ce qu'on aperçoit à travers les portes vitrées. */
function View({ theme }: { theme: Theme }) {
  const map = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const g = c.getContext("2d")!;
    const sky = g.createLinearGradient(0, 0, 0, 512);
    sky.addColorStop(0, theme.view.top);
    sky.addColorStop(1, theme.view.bottom);
    g.fillStyle = sky;
    g.fillRect(0, 0, 512, 512);
    if (theme.view.horizon) {
      g.fillStyle = theme.view.horizon;
      g.fillRect(0, 330, 512, 182);
      g.fillStyle = "rgba(255,255,255,0.35)";
      for (let i = 0; i < 40; i++) g.fillRect((i * 97) % 512, 340 + ((i * 31) % 160), 30 + (i % 5) * 10, 2);
    }
    // soleil / lune diffus
    const sun = g.createRadialGradient(256, 310, 6, 256, 310, 120);
    sun.addColorStop(0, `${theme.view.lights}cc`);
    sun.addColorStop(1, `${theme.view.lights}00`);
    g.fillStyle = sun;
    g.fillRect(0, 0, 512, 512);
    g.filter = "blur(4px)";
    for (let i = 0; i < 26; i++) {
      g.fillStyle = `${theme.view.lights}${["55", "88", "bb"][i % 3]}`;
      g.beginPath();
      g.arc((i * 131) % 512, 200 + ((i * 71) % 300), 3 + (i % 4) * 3, 0, Math.PI * 2);
      g.fill();
    }
    const tex = new CanvasTexture(c);
    tex.colorSpace = SRGBColorSpace;
    return tex;
  }, [theme]);
  return (
    <mesh position={[0, 1.4, FRONT - 1.6]}>
      <planeGeometry args={[4.5, 4.5]} />
      <meshBasicMaterial map={map} toneMapped={false} />
    </mesh>
  );
}

function Memory({ theme, seed, x, z, phase, still }: { theme: Theme; seed: number; x: number; z: number; phase: number; still: boolean }) {
  const ref = useRef<Group>(null);
  const map = usePhotoTexture(theme.photo, seed);
  useFrame((state) => {
    if (!ref.current) return;
    const t = still ? phase * 10 : state.clock.elapsedTime * 0.12 + phase;
    const k = t % 1;
    ref.current.position.y = 0.2 + k * 2.8;
    ref.current.rotation.z = Math.sin(t * 6 + seed) * 0.08;
    ref.current.rotation.y = Math.sin(t * 4 + seed) * 0.25;
  });
  return (
    <group ref={ref} position={[x, 1, z]}>
      <mesh>
        <planeGeometry args={[0.3, 0.35]} />
        <meshStandardMaterial map={map} roughness={0.6} side={DoubleSide} />
      </mesh>
    </group>
  );
}

export function Elevator({ theme, floorRef, still }: { theme: Theme; floorRef: { current: number }; still: boolean }) {
  const lacquer = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: theme.wall,
        roughness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.2,
        envMapIntensity: 0.45,
      }),
    [theme.wall],
  );
  const gold = useMemo(
    () => new MeshPhysicalMaterial({ color: theme.gold, metalness: 1, roughness: 0.16, clearcoat: 0.4 }),
    [theme.gold],
  );

  return (
    <GoldContext.Provider value={gold}>
      <group>
        <FrontWall theme={theme} lacquer={lacquer} />
        <SideWalls theme={theme} lacquer={lacquer} />
        <Dial theme={theme} floorRef={floorRef} />
        <View theme={theme} />

        {/* sol en pierre polie avec incrustation en éventail */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, (BACK + FRONT) / 2]}>
          <planeGeometry args={[W, BACK - FRONT]} />
          <meshPhysicalMaterial color={theme.floor} roughness={0.18} clearcoat={1} clearcoatRoughness={0.05} />
        </mesh>
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, FRONT + 0.02]}>
          <Fan center={[0, 0, 0]} radius={0.9} rays={13} rings={[0.4, 0.7, 1]} t={0.012} />
        </group>

        {/* plafond + plafonnier soleil */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, (BACK + FRONT) / 2]} material={lacquer}>
          <planeGeometry args={[W, BACK - FRONT]} />
        </mesh>
        <group rotation={[Math.PI / 2, 0, 0]} position={[0, H - 0.005, -0.1]}>
          <mesh>
            <circleGeometry args={[0.32, 48]} />
            <meshBasicMaterial color={theme.glow} toneMapped={false} />
          </mesh>
          <Fan center={[0, 0, -0.005]} radius={0.62} rays={17} rings={[0.6, 0.8, 1]} t={0.01} />
          <group rotation={[0, 0, Math.PI]}>
            <Fan center={[0, 0, -0.005]} radius={0.62} rays={17} rings={[0.6, 0.8, 1]} t={0.01} />
          </group>
        </group>

        {/* souvenirs qui montent */}
        {[
          { x: -0.55, z: -0.7, phase: 0.05 },
          { x: 0.5, z: -0.35, phase: 0.38 },
          { x: -0.25, z: 0.15, phase: 0.62 },
          { x: 0.32, z: -1.05, phase: 0.85 },
        ].map((m, i) => (
          <Memory key={i} theme={theme} seed={i} still={still} {...m} />
        ))}

        <pointLight position={[0, H - 0.25, -0.1]} color={theme.key} intensity={3.2} distance={6} decay={1.6} />
        <pointLight position={[-0.45, 1.9, FRONT + 1.2]} color={theme.fill} intensity={0.9} distance={2.6} />
        <pointLight position={[0.45, 1.9, FRONT + 1.2]} color={theme.fill} intensity={0.9} distance={2.6} />
        <hemisphereLight args={[theme.key, theme.floor, 0.18]} />
      </group>
    </GoldContext.Provider>
  );
}
