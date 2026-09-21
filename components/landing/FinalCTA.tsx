"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function FinalCTA() {
  const t = useTranslations("Landing.finalCta");

  return (
    <section
      id="get-started"
      className="relative isolate overflow-hidden border-t border-[#232a34] bg-[#09090b]"
    >
      {/* Animated background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Checker grid */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `
              linear-gradient(
                to right,
                rgba(35, 42, 52, 0.7) 1px,
                transparent 1px
              ),
              linear-gradient(
                to bottom,
                rgba(35, 42, 52, 0.7) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "70px 70px",
          }}
        />

        {/* Moving C4 hologram */}
        <div
          className="absolute left-0 top-4/6 w-[400px] -translate-y-1/2 opacity-[0.5]"
          style={{
            animation: "c4Sweep 15s linear infinite",
          }}
        >
          <img
            src="images/c4_hologram.png"
            alt=""
            draggable="false"
            className="block h-auto w-full"
          />
        </div>

        {/* Center vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, transparent 10%, rgba(9,9,11,0.78) 85%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[620px] max-w-[1400px] items-center justify-center px-5 py-24 sm:px-8 lg:px-10">
        <div className="w-full max-w-4xl text-center">
          {/* Eyebrow */}
          <div className="mb-7 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#f97316]" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]">
              {t("eyebrow")}
            </span>

            <span className="h-px w-8 bg-[#f97316]" />
          </div>

          {/* Title */}
          <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.04em] text-[#f3f4f6] sm:text-6xl lg:text-8xl">
            {t("title")}
          </h2>

          {/* Description */}
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[#9ca3af] sm:text-lg">
            {t("description")}
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[#f97316] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#fb923c]"
            >
              {t("getStarted")}
            </Link>

            <Link
              href="/register?create=organization"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-[#2e3742] bg-[#11151b]/90 px-7 text-sm font-semibold text-[#f3f4f6] transition-colors hover:bg-[#171c24]"
            >
              {t("createOrganization")}
            </Link>
          </div>

          {/* Bottom label */}
          <div className="mt-14 flex items-center justify-center gap-3 text-xs text-[#6b7280]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f97316]" />
            <span>{t("bottomLabel")}</span>
          </div>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes c4Sweep {
          0% {
            transform: translate(-120%, -50%);
          }

          100% {
            transform: translate(500vw, -50%);
          }
        }
      `}</style>
    </section>
  );
}