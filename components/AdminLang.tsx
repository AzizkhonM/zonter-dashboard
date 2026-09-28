"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const locales = [
  { code: "uz", label: "O‘zbekcha" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
] as const;

export default function AdminLang() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const segments = pathname.split("/").filter(Boolean);

  const currentLocale =
    locales.some((locale) => locale.code === segments[0])
      ? segments[0]
      : "uz";

  const current =
    locales.find((locale) => locale.code === currentLocale) ?? locales[0];

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

  const getLocaleHref = (locale: string) => {
    const hasLocalePrefix = locales.some(
      (item) => item.code === segments[0]
    );

    const pathWithoutLocale = hasLocalePrefix
      ? `/${segments.slice(1).join("/")}`
      : pathname;

    if (locale === "uz") {
      return pathWithoutLocale || "/";
    }

    return `/${locale}${
      pathWithoutLocale === "/" ? "" : pathWithoutLocale
    }`;
  };

  return (
    <div className="admin-lang" ref={wrapperRef}>
      <button
        type="button"
        className="admin-lang-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>{current.label}</span>

        <svg
          className={`admin-lang-chevron ${open ? "open" : ""}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="admin-lang-dropdown" role="listbox">
          {locales.map((locale) => {
            const selected = locale.code === currentLocale;
            const href = getLocaleHref(locale.code);

            return (
              <Link
                key={locale.code}
                href={href}
                scroll={false}
                className={`admin-lang-option ${
                  selected ? "selected" : ""
                }`}
                onClick={() => setOpen(false)}
                role="option"
                aria-selected={selected}
              >
                <span>{locale.label}</span>

                {selected && (
                  <svg
                    className="admin-lang-check"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
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
        .admin-lang,
        .admin-lang *,
        .admin-lang *::before,
        .admin-lang *::after {
          box-sizing: border-box;
        }


        .admin-lang {
          position: relative;
          width: 100%;
        }

        .admin-lang-trigger {
          width: 100%;
          height: 40px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 12px;

          border: 0;
          border-radius: 7px;

          background: transparent;
          color: #A1A1AA;

          font-family: inherit;
          font-size: 13px;
          font-weight: 500;

          cursor: pointer;

          transition:
            background-color 0.15s ease,
            color 0.15s ease;
        }

        .admin-lang-trigger:hover {
          background: #161A20;
          color: #F3F4F6;
        }

        .admin-lang-chevron {
          flex-shrink: 0;
          transition: transform 0.15s ease;
        }

        .admin-lang-chevron.open {
          transform: rotate(180deg);
        }

        .admin-lang-dropdown {
          position: absolute;

          left: 0;
          bottom: calc(100% + 6px);

          width: 100%;
          padding: 4px;

          border: 1px solid #232A34;
          border-radius: 8px;

          background: #15181E;

          box-shadow:
            0 10px 30px rgba(0, 0, 0, 0.35);

          z-index: 100;
        }

        .admin-lang-option {
          position: relative;

          display: flex;
          align-items: center;

          width: 100%;
          min-height: 36px;

          padding: 0 32px 0 10px;

          border-radius: 6px;

          color: #A1A1AA;
          text-decoration: none;

          font-size: 13px;
          font-weight: 500;

          transition:
            background-color 0.15s ease,
            color 0.15s ease;
        }

        .admin-lang-option:hover,
        .admin-lang-option.selected {
          background: #1B2129;
          color: #F3F4F6;
        }

        .admin-lang-check {
          position: absolute;
          right: 10px;
          color: #F3F4F6;
        }
      `}</style>
    </div>
  );
}
