"use client";

import {
  Environment,
  Lightformer,
  MeshReflectorMaterial,
  PerformanceMonitor,
  Sparkles,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import type { Quality } from "@/lib/media";
import { Balloons } from "./Balloons";
import { Cake } from "./Cake";
import { CameraRig } from "./CameraRig";
import { Confetti } from "./Confetti";
import { Effects } from "./Effects";
import { palette } from "./palette";
import { anchors, stations } from "./rig";
import { DateMark, HeroTitle } from "./Titles";

function Floor({ quality }: { quality: Quality }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -6]}>
      <planeGeometry args={[90, 90]} />
      {quality === "high" ? (
        <MeshReflectorMaterial
          resolution={512}
          blur={[400, 120]}
          mixBlur={1}
          mixStrength={18}
          mixContrast={1}
          depthScale={1}
          minDepthThreshold={0.6}
          maxDepthThreshold={1.4}
          roughness={0.85}
          metalness={0.6}
          color="#150d1a"
          mirror={0.6}
        />
      ) : (
        <meshStandardMaterial color="#150d1a" roughness={0.45} metalness={0.5} />
      )}
    </mesh>
  );
}

/** Éclairage studio procédural : aucun fichier HDR à télécharger. */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={2.2} color="#fff1dc" position={[0, 6, 4]} scale={[12, 3, 1]} />
      <Lightformer form="rect" intensity={1.4} color={palette.rose} position={[-8, 3, 0]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
      <Lightformer form="rect" intensity={1.4} color={palette.gold} position={[8, 3, -4]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
      <Lightformer form="ring" intensity={2} color="#ffffff" position={[0, 4, -10]} scale={4} />
      {/* panneaux face à la scène : ce que reflètent les textes dorés */}
      <Lightformer form="rect" intensity={2} color="#ffe2b0" position={[0, 2, 16]} rotation-y={Math.PI} scale={[20, 4, 1]} />
      <Lightformer form="rect" intensity={1.5} color="#ffffff" position={[0, -2, 14]} rotation-y={Math.PI} scale={[30, 1.5, 1]} />
    </Environment>
  );
}

export default function Scene({
  quality,
  reducedMotion,
}: {
  quality: Quality;
  reducedMotion: boolean;
}) {
  const [dpr, setDpr] = useState(quality === "high" ? 1.75 : 1.25);
  const s0 = stations[0];

  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: false, powerPreference: "high-performance", stencil: false }}
      camera={{ fov: 40, near: 0.1, far: 90, position: [s0.px, s0.py, s0.pz] }}
      eventSource={document.body}
      eventPrefix="client"
      aria-hidden="true"
    >
      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
        onIncline={() => setDpr((d) => Math.min(quality === "high" ? 1.75 : 1.25, d + 0.25))}
      />
      <color attach="background" args={[palette.background]} />
      <fog attach="fog" args={[palette.background, 12, 34]} />

      <ambientLight intensity={0.25} />
      <directionalLight position={[2, 4, 10]} intensity={1.2} color="#ffe6c4" />
      <spotLight position={[0, 9, 6]} angle={0.5} penumbra={1} intensity={60} color="#ffe6c4" />
      <pointLight position={[-8, 4, -6]} intensity={18} color={palette.rose} distance={18} />
      <pointLight position={[8, 6, -14]} intensity={14} color={palette.gold} distance={18} />

      <CameraRig reducedMotion={reducedMotion} parallax={quality === "high"} />

      <Suspense fallback={null}>
        <Studio />
        <HeroTitle position={anchors.hero} />
        <DateMark position={anchors.date} reducedMotion={reducedMotion} />
      </Suspense>

      <Cake position={anchors.cake} reducedMotion={reducedMotion} />
      <Balloons quality={quality} reducedMotion={reducedMotion} />
      <Confetti quality={quality} reducedMotion={reducedMotion} />
      <Sparkles
        count={quality === "high" ? 160 : 60}
        scale={[30, 14, 34]}
        position={[0, 6, -6]}
        size={3}
        speed={reducedMotion ? 0 : 0.3}
        color={palette.champagne}
        opacity={0.8}
      />
      <Floor quality={quality} />

      <Effects quality={quality} />
    </Canvas>
  );
}
