"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("Landing.hero");

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#09090b]">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-180px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#f97316]/10 blur-[140px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Content */}
      <div className="relative mx-auto flex min-h-screen max-w-[1400px] items-center px-5 pb-20 pt-32 sm:px-8 lg:px-10">
        <div className="w-full max-w-5xl">
          {/* Eyebrow */}
          <div className="mb-7 flex items-center gap-3">
            <span className="h-px w-8 bg-[#f97316]" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]">
              {t("eyebrow")}
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.04em] text-[#f3f4f6] sm:text-6xl md:text-7xl lg:text-[88px]">
            {t("title")}
          </h1>

          {/* Description */}
          <p className="mt-8 max-w-2xl text-base leading-7 text-[#9ca3af] sm:text-lg">
            {t("description")}
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[#f97316] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#fb923c]"
            >
              {t("getStarted")}
            </Link>

            <Link
              href="#features"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-[#2e3742] bg-[#11151b]/60 px-6 text-sm font-semibold text-[#f3f4f6] transition-colors hover:bg-[#171c24]"
            >
              {t("explore")}
            </Link>
          </div>

          {/* Bottom hint */}
          <div className="mt-20 flex items-center gap-3 text-xs text-[#6b7280]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f97316]" />
            <span>{t("builtFor")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}