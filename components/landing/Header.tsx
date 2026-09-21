"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LocaleLanding from "../LocaleLanding";
import { LocaleLanding2 } from "../LocaleLanding2";
import { usePathname } from "next/navigation";

export default function Header() {
  const t = useTranslations("Landing.header");

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const pathname = usePathname();

  const locale = pathname.startsWith("/en")
    ? "en"
    : pathname.startsWith("/ru")
    ? "ru"
    : "uz";

  const loginHref = locale === "uz" ? "/login" : `/${locale}/login`;
  const registerHref = locale === "uz" ? "/register" : `/${locale}/register`;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-[#232a34]/80 bg-[#09090b]/70 backdrop-blur-xl"
            : "bg-[#09090b]"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-10">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="relative z-50 flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center">
              {/* TODO: replace with actual Zonter SVG */}
                <img src="logo.svg" alt="" />
            </div>

            <span className="text-sm font-bold tracking-[0.18em] text-[#f3f4f6]">
              ZONTER
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            <Link
              href="#product"
              className="text-sm text-[#9ca3af] transition-colors hover:text-[#f3f4f6]"
            >
              {t("product")}
            </Link>

            <Link
              href="#features"
              className="text-sm text-[#9ca3af] transition-colors hover:text-[#f3f4f6]"
            >
              {t("features")}
            </Link>

            <Link
              href="#how-it-works"
              className="text-sm text-[#9ca3af] transition-colors hover:text-[#f3f4f6]"
            >
              {t("howItWorks")}
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-5 lg:flex">
            <LocaleLanding2 />

            <Link
              href={loginHref}
              className="text-sm font-medium text-[#9ca3af] transition-colors hover:text-[#f3f4f6]"
            >
              {t("login")}
            </Link>

            <Link
              href={registerHref}
              className="rounded-lg bg-[#f97316] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#fb923c]"
            >
              {t("getStarted")}
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-[#232a34] bg-[#11151b]/80 lg:hidden"
          >
            <span className="relative flex h-5 w-5 flex-col justify-center">
              <span
                className={`absolute h-[2px] w-5 bg-[#f3f4f6] transition-all duration-300 ${
                  menuOpen ? "rotate-45" : "-translate-y-[5px]"
                }`}
              />

              <span
                className={`absolute h-[2px] w-5 bg-[#f3f4f6] transition-all duration-300 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />

              <span
                className={`absolute h-[2px] w-5 bg-[#f3f4f6] transition-all duration-300 ${
                  menuOpen ? "-rotate-45" : "translate-y-[5px]"
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#09090b] transition-all duration-300 lg:hidden ${
          menuOpen
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      >
        <div className="flex min-h-full flex-col px-6 pb-8 pt-28 sm:px-8">
          <nav className="flex flex-col">
            <Link
              href="#product"
              onClick={closeMenu}
              className="border-b border-[#232a34] py-5 text-2xl font-medium text-[#f3f4f6]"
            >
              {t("product")}
            </Link>

            <Link
              href="#features"
              onClick={closeMenu}
              className="border-b border-[#232a34] py-5 text-2xl font-medium text-[#f3f4f6]"
            >
              {t("features")}
            </Link>

            <Link
              href="#how-it-works"
              onClick={closeMenu}
              className="border-b border-[#232a34] py-5 text-2xl font-medium text-[#f3f4f6]"
            >
              {t("howItWorks")}
            </Link>
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            <div className="w-full">
              <LocaleLanding />
            </div>

            <div className="flex gap-3">
              <Link
                href={loginHref}
                onClick={closeMenu}
                className="flex h-12 flex-1 items-center justify-center rounded-lg border border-[#2e3742] text-sm font-semibold text-[#f3f4f6]"
              >
                {t("login")}
              </Link>

              <Link
                href={registerHref}
                onClick={closeMenu}
                className="flex h-12 flex-1 items-center justify-center rounded-lg bg-[#f97316] text-sm font-semibold text-white hover:bg-[#fb923c]"
              >
                {t("getStarted")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
