"use client";

import { useSyncExternalStore } from "react";
import { event } from "@/config/event";

const target = new Date(event.startsAt).getTime();

function subscribe(onTick: () => void) {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
}

const getNow = () => Math.floor(Date.now() / 1000);

export function Countdown() {
  const now = useSyncExternalStore(subscribe, getNow, () => null);
  if (now === null) return <div className="h-[76px]" aria-hidden="true" />;

  const diff = Math.max(0, Math.floor(target / 1000) - now);
  if (diff === 0) {
    return <p className="font-display text-2xl italic text-gold">C&apos;est le grand jour !</p>;
  }

  const units = [
    { label: "jours", value: Math.floor(diff / 86400) },
    { label: "heures", value: Math.floor((diff % 86400) / 3600) },
    { label: "min", value: Math.floor((diff % 3600) / 60) },
    { label: "sec", value: diff % 60 },
  ];

  return (
    <div>
      <p className="sr-only">
        Plus que {units[0].value} jours et {units[1].value} heures avant la fête.
      </p>
      <ul className="grid grid-cols-4 gap-2" aria-hidden="true">
        {units.map((u) => (
          <li key={u.label} className="rounded-xl border border-champagne/15 bg-white/[0.03] px-2 py-3 text-center">
            <span className="block font-display text-3xl leading-none text-gold tabular-nums">
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="mt-1 block text-[0.7rem] uppercase tracking-[0.18em] text-muted">{u.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
