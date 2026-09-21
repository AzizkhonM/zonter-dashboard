"use client";

import { useTranslations } from "next-intl";

export default function Audience() {
  const t = useTranslations("Landing.audience");

  const audiences = [
    {
      number: "01",
      title: t("items.community.title"),
      description: t("items.community.description"),
    },
    {
      number: "02",
      title: t("items.university.title"),
      description: t("items.university.description"),
    },
    {
      number: "03",
      title: t("items.amateur.title"),
      description: t("items.amateur.description"),
    },
  ];

  return (
    <section
      id="audience"
      className="relative overflow-hidden border-t border-[#232a34] bg-[#09090b]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-250px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#f97316]/5 blur-[160px]"
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

        {/* Audience cards */}
        <div className="mt-16 grid gap-px overflow-hidden border border-[#232a34] bg-[#232a34] md:grid-cols-3">
          {audiences.map((audience) => (
            <article
              key={audience.number}
              className="group relative min-h-[280px] bg-[#0f1115] p-7 transition-colors duration-300 hover:bg-[#14181e] sm:p-9 lg:p-10"
            >
              <div className="flex items-start justify-between">
                <span className="text-sm font-bold tracking-[0.15em] text-[#f97316]">
                  {audience.number}
                </span>

                <span className="text-[#2e3742] transition-colors duration-300 group-hover:text-[#f97316]">
                  ↗
                </span>
              </div>

              <div className="mt-20">
                <h3 className="text-2xl font-bold tracking-tight text-[#f3f4f6]">
                  {audience.title}
                </h3>

                <p className="mt-4 text-sm leading-6 text-[#9ca3af]">
                  {audience.description}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 h-px w-0 bg-[#f97316] transition-all duration-500 group-hover:w-full" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}