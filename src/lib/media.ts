"use client";

import { useSyncExternalStore } from "react";

function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** Respecte le réglage système « réduire les animations ». */
export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export type Quality = "low" | "high";

/**
 * Qualité de rendu : « low » sur mobile / tablette / petites machines
 * (pas de reflets temps réel ni de profondeur de champ, moins de particules).
 */
export function useQuality(): Quality {
  const smallOrTouch = useMediaQuery("(max-width: 820px), (pointer: coarse)", true);
  const fewCores = useSyncExternalStore(
    () => () => {},
    () => (navigator.hardwareConcurrency ?? 8) <= 4,
    () => true,
  );
  return smallOrTouch || fewCores ? "low" : "high";
}
