"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import { type ReactNode, useEffect, useSyncExternalStore } from "react";
import { useQuality, useReducedMotion } from "@/lib/media";
import { rig, stations } from "./three/rig";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// La scène WebGL n'est chargée que côté navigateur, dans un bundle séparé.
const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

const noop = () => () => {};

// Testé une seule fois : chaque test crée un contexte WebGL, et le navigateur
// en limite le nombre (au-delà, il supprime le plus ancien… celui de la scène).
let webglSupport: boolean | undefined;
function hasWebGL() {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      webglSupport = Boolean(gl);
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

export function Experience({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const quality = useQuality();
  const webgl = useSyncExternalStore(noop, hasWebGL, () => false);

  // Scroll fluide Lenis, synchronisé avec le ticker GSAP / ScrollTrigger.
  useEffect(() => {
    if (reducedMotion) return;
    const lenis = new Lenis({ anchors: true, lerp: 0.085, autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reducedMotion]);

  useGSAP(
    () => {
      const sections = gsap.utils.toArray<HTMLElement>("[data-station]");

      sections.forEach((section, i) => {
        if (i === 0 || !stations[i]) return;
        if (reducedMotion) {
          // Animations réduites : coupes franches entre les plans, sans travelling.
          ScrollTrigger.create({
            trigger: section,
            start: "top center",
            onEnter: () => Object.assign(rig, stations[i]),
            onLeaveBack: () => Object.assign(rig, stations[i - 1]),
          });
          return;
        }
        // Travelling caméra piloté par le scroll entre deux stations.
        gsap.fromTo(
          rig,
          { ...stations[i - 1] },
          {
            ...stations[i],
            ease: "power2.inOut",
            immediateRender: false,
            scrollTrigger: { trigger: section, start: "top bottom", end: "top 20%", scrub: 1.2 },
          },
        );
      });

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          rig.progress = self.progress;
        },
      });

      if (!reducedMotion) {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 48,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
          });
        });
      }
    },
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        {webgl ? (
          <div className="canvas-fade h-full w-full">
            <Scene quality={quality} reducedMotion={reducedMotion} />
          </div>
        ) : (
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_30%_20%,#3a1b3d_0%,transparent_55%),radial-gradient(ellipse_at_80%_80%,#3b2a14_0%,transparent_50%)]" />
        )}
      </div>
      <div className="relative z-10">{children}</div>
    </>
  );
}
