"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const locales = [
  { code: "uz", label: "UZ" },
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
];

const flags: Record<string, ReactNode> = {
  uz: (
    <svg width="18" height="12" viewBox="0 0 18 12" style={{ borderRadius: 2 }}>
      <defs>
        {/* Yulduzcha shakli */}
        <path
          id="star"
          d="M0,-0.25 L0.07,-0.08 L0.25,-0.08 L0.1,0.03 L0.15,0.2 L0,0.1 L-0.15,0.2 L-0.1,0.03 L-0.25,-0.08 L-0.07,-0.08 Z"
          fill="#FFFFFF"
        />
      </defs>

      {/* Fon ranglari */}
      <rect y="0" width="18" height="3.75" fill="#3081F7" />
      <rect y="3.75" width="18" height="0.375" fill="#EE162E" />
      <rect y="4.125" width="18" height="3.75" fill="#FFFFFF" />
      <rect y="7.875" width="18" height="0.375" fill="#EE162E" />
      <rect y="8.25" width="18" height="3.75" fill="#308738" />

      {/* Oy */}
      <path
        d="M 3.8 0.7 A 1.2 1.2 0 1 0 3.8 3 A 1.4 1.4 0 1 1 3.8 0.7 Z"
        fill="#FFFFFF"
      />

      {/* Yulduzlar - Pastki qator (5 ta) */}
      <use href="#star" x="5.0" y="2.7" />
      <use href="#star" x="5.8" y="2.7" />
      <use href="#star" x="6.6" y="2.7" />
      <use href="#star" x="7.4" y="2.7" />
      <use href="#star" x="8.2" y="2.7" />

      {/* Yulduzlar - O'rta qator (4 ta) */}
      <use href="#star" x="5.8" y="1.8" />
      <use href="#star" x="6.6" y="1.8" />
      <use href="#star" x="7.4" y="1.8" />
      <use href="#star" x="8.2" y="1.8" />

      {/* Yulduzlar - Yuqori qator (3 ta) */}
      <use href="#star" x="6.6" y="0.9" />
      <use href="#star" x="7.4" y="0.9" />
      <use href="#star" x="8.2" y="0.9" />
    </svg>
  ),

  en: (
    <svg
      width="18"
      height="12"
      viewBox="0 0 18 12"
      style={{ borderRadius: 2, overflow: "hidden" }}
    >
      {/* Fon */}
      <rect width="18" height="12" fill="#012169" />

      {/* Oq diagonal xoch — Avliyo Andrey xochi */}
      <path d="M0,0 L18,12 M18,0 L0,12" stroke="#fff" strokeWidth="3.5" />

      {/* Qizil diagonal xoch — Avliyo Patrik xochi (Asimmetrik siljigan) */}
      {/* Yuqori chap va pastki o'ng */}
      <path
        d="M0,0 L9,6"
        stroke="#C8102E"
        strokeWidth="1.2"
        transform="translate(0, 0.8)"
      />
      <path
        d="M9,6 L18,12"
        stroke="#C8102E"
        strokeWidth="1.2"
        transform="translate(0, -0.8)"
      />

      {/* Yuqori o'ng va pastki chap */}
      <path
        d="M18,0 L9,6"
        stroke="#C8102E"
        strokeWidth="1.2"
        transform="translate(0, 0.8)"
      />
      <path
        d="M9,6 L0,12"
        stroke="#C8102E"
        strokeWidth="1.2"
        transform="translate(0, -0.8)"
      />

      {/* Oq to'g'ri xoch — Avliyo Georg xochi */}
      <rect x="7.5" y="0" width="3" height="12" fill="#fff" />
      <rect x="0" y="4.5" width="18" height="3" fill="#fff" />

      {/* Qizil to'g'ri xoch */}
      <rect x="8" y="0" width="2" height="12" fill="#C8102E" />
      <rect x="0" y="5" width="18" height="2" fill="#C8102E" />
    </svg>
  ),

  ru: (
    <svg width="18" height="12" viewBox="0 0 18 12" style={{ borderRadius: 2 }}>
      <rect width="18" height="4" fill="#FFFFFF" />
      <rect y="4" width="18" height="4" fill="#0039A6" />
      <rect y="8" width="18" height="4" fill="#D52B1E" />
    </svg>
  ),
};

export default function LocaleSwitcher() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const localeSet = new Set(locales.map((locale) => locale.code));

  const segments = pathname.split("/").filter(Boolean);

  const currentLocale = localeSet.has(segments[0]) ? segments[0] : "uz";

  const current =
    locales.find((locale) => locale.code === currentLocale) || locales[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const switchLocale = (locale: string) => {
    const pathWithoutLocale = localeSet.has(segments[0])
      ? `/${segments.slice(1).join("/")}`
      : pathname;

    if (locale === "uz") {
      return pathWithoutLocale || "/";
    }

    return `/${locale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
  };

  return (
    <div className="locale-wrapper" ref={wrapperRef}>
      <button
        type="button"
        className="locale-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className="locale-flag">{flags[currentLocale]}</span>

        <span className="locale-label">{current.label}</span>

        <svg
          className={`locale-chevron ${open ? "open" : ""}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="locale-dropdown">
          {locales.map((locale) => {
            const href = switchLocale(locale.code);

            return (
              <Link
                key={locale.code}
                href={href}
                scroll={false}
                className={`locale-option ${
                  locale.code === currentLocale ? "selected" : ""
                }`}
                onClick={() => setOpen(false)}
              >
                <span className="locale-flag">{flags[locale.code]}</span>

                <span>{locale.label}</span>

                {locale.code === currentLocale && (
                  <svg
                    className="locale-check"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        .locale-wrapper {
          position: relative;
          width: 100%;
        }

        .locale-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border: 1px solid #232A34;
          border-radius: 8px;
          background: #15181E;
          color: #D1D5DB;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .locale-trigger:hover {
          background: #1A1E25;
          border-color: #303744;
        }

        .locale-label {
          flex: 1;
          text-align: left;
        }

        .locale-chevron {
          transition: transform 0.2s ease;
        }

        .locale-chevron.open {
          transform: rotate(180deg);
        }

        .locale-flag {
          width: 24px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 2px;
        }

        .locale-dropdown {
          position: absolute;
          left: 0;
          bottom: calc(100% + 8px);
          width: 100%;
          padding: 5px;
          border: 1px solid #232A34;
          border-radius: 10px;
          background: #15181E;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
          z-index: 100;
        }

        .locale-option {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 10px;
          padding-right: 32px;
          border-radius: 7px;
          color: #9CA3AF;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
          position: relative;
        }

        .locale-option:hover,
        .locale-option.selected {
          background: rgba(255, 255, 255, 0.06);
          color: white;
        }

        .locale-check {
          position: absolute;
          right: 10px;
          color: #9CA3AF;
        }
      `}</style>
    </div>
  );
}