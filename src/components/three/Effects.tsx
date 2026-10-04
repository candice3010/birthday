"use client";

import { useFrame } from "@react-three/fiber";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, type DepthOfFieldEffect, ToneMappingMode } from "postprocessing";
import { useRef } from "react";
import type { Quality } from "@/lib/media";
import { focusPoint } from "./CameraRig";

/** Bloom (bougies, reflets dorés), profondeur de champ, grain de film et vignettage. */
export function Effects({ quality }: { quality: Quality }) {
  const dof = useRef<DepthOfFieldEffect>(null);

  useFrame(() => {
    dof.current?.target?.copy(focusPoint);
  });

  if (quality === "low") {
    return (
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={0.7} luminanceThreshold={1} luminanceSmoothing={0.2} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette offset={0.3} darkness={0.7} />
        <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.35} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={4}>
      <DepthOfField ref={dof} target={[0, 0, 0]} worldFocusRange={6} bokehScale={3.2} />
      <Bloom mipmapBlur intensity={1} luminanceThreshold={0.85} luminanceSmoothing={0.25} radius={0.75} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette offset={0.28} darkness={0.75} />
      <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.4} />
    </EffectComposer>
  );
}
