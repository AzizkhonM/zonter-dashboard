"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export default function TournamentManagement() {
  const t = useTranslations("Landing.tournamentManagement");

  const features = [
    t("features.bracket"),
    t("features.swiss"),
    t("features.teams"),
    t("features.matches"),
    t("features.announcements"),
    t("features.scheduling"),
    t("features.results"),
  ];

  return (
    <section className="relative overflow-hidden border-t border-[#232a34] bg-[#0f1115]">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-250px] top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[#f97316]/5 blur-[160px]"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-[#f97316]" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]">
              {t("eyebrow")}
            </span>
          </div>

          <h2 className="text-4xl font-black leading-[1] tracking-[-0.035em] text-[#f3f4f6] sm:text-5xl lg:text-6xl">
            {t("title")}
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#9ca3af] sm:text-lg">
            {t("description")}
          </p>
        </div>

        {/* Feature list */}
        <div className="mt-10 flex flex-wrap gap-2">
          {features.map((feature) => (
            <span
              key={feature}
              className="border border-[#2e3742] bg-[#11151b] px-3 py-2 text-xs font-medium text-[#9ca3af]"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Dashboard screenshot placeholder */}
        <div className="mt-16 sm:mt-20">
          <div className="overflow-hidden border border-[#2e3742] bg-[#09090b] shadow-2xl">
            <div className="flex h-10 items-center gap-2 border-b border-[#232a34] bg-[#11151b] px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2e3742]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#2e3742]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#2e3742]" />

              <div className="ml-4 h-5 max-w-md flex-1 border border-[#232a34] bg-[#0f1115]" />
            </div>

            <div className="relative aspect-[16/9] w-full bg-[#0b0d10]">
              <Image
                src="/images/tournament-management.png"
                draggable="false"
                alt={t("imageAlt")}
                fill
                sizes="(max-width: 768px) 100vw, 1400px"
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* Caption */}
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#6b7280]">{t("caption")}</p>

            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#f97316]">
              ZONTER
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
