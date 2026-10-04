"use client";

import { Environment } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, DepthOfField, EffectComposer, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { Suspense } from "react";
import { MathUtils, type PerspectiveCamera } from "three";
import type { Theme } from "@/lib/themes";
import { DIAL_CENTER, Elevator } from "./Elevator";

/** Cadre la cabine : FOV élargi en portrait pour garder les portes et le cadran visibles. */
function CameraFit() {
  useFrame((state) => {
    const camera = state.camera as PerspectiveCamera;
    const aspect = state.size.width / state.size.height;
    const fov = Math.max(52, MathUtils.radToDeg(2 * Math.atan(0.38 / aspect)));
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    const px = state.pointer.x * 0.06;
    camera.position.set(px, 1.42, aspect < 1 ? 1.25 : 1.45);
    camera.lookAt(0, 1.72, -1.5);
  });
  return null;
}

export default function AmbianceScene({
  theme,
  floor,
  still,
}: {
  theme: Theme;
  floor: { current: number };
  still: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: false, preserveDrawingBuffer: true }}
      camera={{ fov: 52, near: 0.05, far: 60, position: [0, 1.42, 1.45] }}
      aria-hidden="true"
    >
      <color attach="background" args={[theme.fog]} />
      <CameraFit />
      <Suspense fallback={null}>
        <Environment
          key={theme.id}
          files={theme.hdri}
          environmentIntensity={theme.envIntensity}
        />
        <Elevator key={theme.id} theme={theme} floorRef={floor} still={still} />
      </Suspense>
      <EffectComposer multisampling={4}>
        <DepthOfField target={DIAL_CENTER} worldFocusRange={1.6} bokehScale={2.4} />
        <Bloom mipmapBlur intensity={0.7} luminanceThreshold={0.85} luminanceSmoothing={0.3} radius={0.8} />
        <ToneMapping mode={ToneMappingMode.AGX} />
        <Vignette offset={0.35} darkness={0.45} />
        <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.3} />
      </EffectComposer>
    </Canvas>
  );
}
