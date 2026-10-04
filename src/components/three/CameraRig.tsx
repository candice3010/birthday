"use client";

import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { distanceFactor, rig } from "./rig";

/** Point de mise au point partagé avec la profondeur de champ. */
export const focusPoint = new Vector3();

// Vecteurs de travail réutilisés à chaque frame (aucune allocation).
const goalPos = new Vector3();
const goalTarget = new Vector3();
const lookAt = new Vector3(rig.tx, rig.ty, rig.tz);

/**
 * Suit les valeurs animées par GSAP ScrollTrigger (voir rig.ts),
 * avec un amorti doux et une légère parallaxe à la souris.
 */
export function CameraRig({ reducedMotion, parallax }: { reducedMotion: boolean; parallax: boolean }) {
  useFrame((state, delta) => {
    const k = distanceFactor(state.size.width / state.size.height);
    goalTarget.set(rig.tx, rig.ty, rig.tz);
    goalPos
      .set(rig.px, rig.py, rig.pz)
      .sub(goalTarget)
      .multiplyScalar(k)
      .add(goalTarget);

    if (parallax && !reducedMotion) {
      goalPos.x += state.pointer.x * 0.35;
      goalPos.y += state.pointer.y * 0.2;
    }

    if (reducedMotion) {
      state.camera.position.copy(goalPos);
      lookAt.copy(goalTarget);
    } else {
      const t = 1 - Math.exp(-Math.min(delta, 0.1) * 5);
      state.camera.position.lerp(goalPos, t);
      lookAt.lerp(goalTarget, t);
    }
    state.camera.lookAt(lookAt);
    focusPoint.copy(lookAt);
  });

  return null;
}
