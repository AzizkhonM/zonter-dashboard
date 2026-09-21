"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Landing.footer");

  return (
    <footer className="border-t border-[#232a34] bg-[#09090b]">
      <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              href="/"
              className="text-xl font-black tracking-[-0.04em] text-[#f3f4f6]"
            >
              ZONTER<span className="text-[#f97316]">.</span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-[#6b7280]">
              {t("description")}
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-x-16 gap-y-8 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f97316]">
                {t("product.title")}
              </p>

              <div className="mt-4 flex flex-col gap-3">
                <a
                  href="#features"
                  className="text-sm text-[#9ca3af] transition-colors hover:text-[#f3f4f6]"
                >
                  {t("product.features")}
                </a>

                <a
                  href="#how-it-works"
                  className="text-sm text-[#9ca3af] transition-colors hover:text-[#f3f4f6]"
                >
                  {t("product.howItWorks")}
                </a>

                <a
                  href="#get-started"
                  className="text-sm text-[#9ca3af] transition-colors hover:text-[#f3f4f6]"
                >
                  {t("product.getStarted")}
                </a>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f97316]">
                {t("resources.title")}
              </p>

              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href="/login"
                  className="text-sm text-[#9ca3af] transition-colors hover:text-[#f3f4f6]"
                >
                  {t("resources.login")}
                </Link>

                <Link
                  href="/register"
                  className="text-sm text-[#9ca3af] transition-colors hover:text-[#f3f4f6]"
                >
                  {t("resources.register")}
                </Link>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f97316]">
                {t("legal.title")}
              </p>

              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href="/privacy"
                  className="text-sm text-[#9ca3af] transition-colors hover:text-[#f3f4f6]"
                >
                  {t("legal.privacy")}
                </Link>

                <Link
                  href="/terms"
                  className="text-sm text-[#9ca3af] transition-colors hover:text-[#f3f4f6]"
                >
                  {t("legal.terms")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-[#232a34] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#6b7280]">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>

          <p className="text-xs uppercase tracking-[0.14em] text-[#4b5563]">
            {t("tagline")}
          </p>
        </div>
      </div>
    </footer>
  );
}