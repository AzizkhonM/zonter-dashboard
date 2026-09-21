"use client";

import { useTranslations } from "next-intl";

export default function Problem() {
  const t = useTranslations("Landing.problem");

  const problems = [
    {
      number: "01",
      title: t("items.tools.title"),
      description: t("items.tools.description"),
    },
    {
      number: "02",
      title: t("items.manual.title"),
      description: t("items.manual.description"),
    },
    {
      number: "03",
      title: t("items.visibility.title"),
      description: t("items.visibility.description"),
    },
  ];

  return (
    <section className="relative overflow-hidden border-t border-[#232a34] bg-[#0f1115]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-180px] top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#f97316]/5 blur-[140px]"
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

        {/* Problems */}
        <div className="mt-16 grid gap-px overflow-hidden border border-[#232a34] bg-[#232a34] md:grid-cols-3">
          {problems.map((problem) => (
            <article
              key={problem.number}
              className="group relative bg-[#0f1115] p-7 transition-colors duration-300 hover:bg-[#14181e] sm:p-9 lg:p-10"
            >
              {/* Number */}
              <div className="flex items-start justify-between">
                <span className="text-sm font-bold tracking-[0.15em] text-[#f97316]">
                  {problem.number}
                </span>

                <span className="text-[#2e3742] transition-colors duration-300 group-hover:text-[#f97316]">
                  ↗
                </span>
              </div>

              {/* Content */}
              <div className="mt-20">
                <h3 className="text-2xl font-bold tracking-tight text-[#f3f4f6]">
                  {problem.title}
                </h3>

                <p className="mt-4 text-sm leading-6 text-[#9ca3af]">
                  {problem.description}
                </p>
              </div>

              {/* Bottom accent */}
              <div className="mt-10 h-px w-0 bg-[#f97316] transition-all duration-500 group-hover:w-full" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}