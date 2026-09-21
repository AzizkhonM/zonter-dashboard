"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useTranslations } from "next-intl";

function C4Model({ rotation }: { rotation: number }) {
  const { scene } = useGLTF("/c4_bomb.glb");

  return (
    <primitive
      object={scene}
      scale={5}
      rotation={[0, rotation, 0]}
    />
  );
}

useGLTF.preload("/c4_bomb.glb");

export default function TournamentLifecycle() {
  const t = useTranslations("Landing.lifecycle");

  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      number: t("steps.create.number"),
      title: t("steps.create.title"),
      description: t("steps.create.description"),
    },
    {
      number: t("steps.teams.number"),
      title: t("steps.teams.title"),
      description: t("steps.teams.description"),
    },
    {
      number: t("steps.bracket.number"),
      title: t("steps.bracket.title"),
      description: t("steps.bracket.description"),
    },
    {
      number: t("steps.matches.number"),
      title: t("steps.matches.title"),
      description: t("steps.matches.description"),
    },
    {
      number: t("steps.veto.number"),
      title: t("steps.veto.title"),
      description: t("steps.veto.description"),
    },
    {
      number: t("steps.results.number"),
      title: t("steps.results.title"),
      description: t("steps.results.description"),
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;

      if (!section) return;

      const rect = section.getBoundingClientRect();
      const totalScroll = rect.height - window.innerHeight;

      if (totalScroll <= 0) return;

      const currentProgress = THREE.MathUtils.clamp(
        -rect.top / totalScroll,
        0,
        1
      );

      setProgress(currentProgress);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  /*
   * 0   → 01
   * 20% → 02
   * 40% → 03
   * 60% → 04
   * 80% → 05
   * 100% → 06
   */
  const activeIndex = Math.min(
    Math.floor(progress * steps.length),
    steps.length - 1
  );

  // 2 full rotations during the whole lifecycle
  const rotation = progress * Math.PI * 4;

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative h-[2400px] bg-[#09090b]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f97316]/10 blur-[160px]"
        />

        {/* Header */}
        <div className="absolute left-0 top-24 z-20 w-full text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]">
            {t("eyebrow")}
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-[-0.03em] text-[#f3f4f6] sm:text-5xl">
            {t("title")}
          </h2>
        </div>

        {/* C4 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[700px] w-[700px]">
            <Canvas
              camera={{
                position: [0, 0, 6],
                fov: 35,
              }}
              dpr={[1, 2]}
            >
              <ambientLight intensity={1.5} />

              <directionalLight
                position={[5, 5, 5]}
                intensity={3}
              />

              <directionalLight
                position={[-5, 2, -5]}
                intensity={2}
              />

              <pointLight
                position={[0, 2, 3]}
                intensity={8}
                color="#f97316"
              />

              <C4Model rotation={rotation} />

              <Environment preset="studio" />
            </Canvas>
          </div>
        </div>

        {/* Active phase */}
        <div className="absolute bottom-12 left-0 z-20 w-full px-6 sm:bottom-16">
          <div className="mx-auto max-w-xl">
            <div
              key={activeIndex}
              className="animate-in fade-in slide-in-from-bottom-3 duration-500"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold tracking-[0.15em] text-[#f97316]">
                  {steps[activeIndex].number}
                </span>

                <span className="h-px w-8 bg-[#f97316]" />
              </div>

              <h3 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#f3f4f6] sm:text-4xl">
                {steps[activeIndex].title}
              </h3>

              <p className="mt-3 max-w-lg text-sm leading-6 text-[#9ca3af] sm:text-base">
                {steps[activeIndex].description}
              </p>
            </div>

            {/* Progress */}
            <div className="mt-7 flex gap-1.5">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="h-1 flex-1 overflow-hidden bg-[#232a34]"
                >
                  <div
                    className={`h-full transition-all duration-500 ${
                      index <= activeIndex
                        ? "w-full bg-[#f97316]"
                        : "w-0"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}