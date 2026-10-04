"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { type Theme, themes } from "@/lib/themes";

const AmbianceScene = dynamic(() => import("./AmbianceScene"), { ssr: false });

const order: Theme["id"][] = ["golden", "nuit", "mer"];
const noop = () => () => {};

function readParams() {
  const p = new URLSearchParams(window.location.search);
  const id = p.get("theme");
  return {
    theme: (order.includes(id as Theme["id"]) ? id : "golden") as Theme["id"],
    floor: p.get("floor") ? Number(p.get("floor")) : null,
  };
}

export function AmbiancePreview() {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  return mounted ? <Preview /> : <div className="fixed inset-0" style={{ background: themes.golden.fog }} />;
}

function Preview() {
  const [initial] = useState(readParams);
  const [themeId, setThemeId] = useState<Theme["id"]>(initial.theme);
  const [manualFloor, setManualFloor] = useState<number | null>(initial.floor);
  const [display, setDisplay] = useState(initial.floor ?? 1);
  const floor = useRef(initial.floor ?? 1);
  const theme = themes[themeId];

  // Aperçu : l'aiguille monte toute seule de 1 à 23, sauf si on règle l'étage à la main.
  useEffect(() => {
    if (manualFloor !== null) {
      floor.current = manualFloor;
      return;
    }
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      const t = ((now - start) / 9000) % 1;
      floor.current = 1 + 22 * (0.5 - 0.5 * Math.cos(t * Math.PI * 2));
      setDisplay(Math.round(floor.current));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [manualFloor]);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: theme.fog }}>
      <AmbianceScene theme={theme} floor={floor} still={manualFloor !== null} />

      <div className="pointer-events-none absolute inset-x-0 top-0 p-5 sm:p-8" style={{ color: theme.ui.ink }}>
        <p className="text-xs uppercase tracking-[0.3em] opacity-80" style={{ textShadow: "0 1px 12px rgba(0,0,0,.35)" }}>
          Ambiance {order.indexOf(themeId) + 1}/3
        </p>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl" style={{ textShadow: "0 2px 20px rgba(0,0,0,.35)" }}>
          {theme.label}
        </h1>
        <p className="mt-1 text-sm opacity-90" style={{ textShadow: "0 1px 12px rgba(0,0,0,.4)" }}>
          {theme.tagline}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <label className="flex w-full max-w-sm items-center gap-3 rounded-full px-4 py-2 text-sm backdrop-blur-md" style={{ background: `${theme.ui.bg}cc`, color: theme.ui.ink }}>
          <span className="w-14 tabular-nums">Étage {manualFloor ?? display}</span>
          <input
            type="range"
            min={1}
            max={23}
            value={manualFloor ?? display}
            onChange={(e) => setManualFloor(Number(e.target.value))}
            className="h-11 flex-1 cursor-pointer"
            style={{ accentColor: theme.ui.accent }}
            aria-label="Étage du cadran"
          />
        </label>
        <div role="radiogroup" aria-label="Choisir l'ambiance" className="flex gap-2 rounded-full p-1.5 backdrop-blur-md" style={{ background: `${theme.ui.bg}cc` }}>
          {order.map((id, i) => (
            <button
              key={id}
              role="radio"
              aria-checked={id === themeId}
              onClick={() => setThemeId(id)}
              className="min-h-11 cursor-pointer rounded-full px-4 text-sm font-medium transition-colors duration-200"
              style={
                id === themeId
                  ? { background: theme.ui.accent, color: theme.ui.bg }
                  : { color: theme.ui.ink }
              }
            >
              {i + 1}. {themes[id].label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
