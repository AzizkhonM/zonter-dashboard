"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
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
        <path
          id="star"
          d="M0,-0.25 L0.07,-0.08 L0.25,-0.08 L0.1,0.03 L0.15,0.2 L0,0.1 L-0.15,0.2 L-0.1,0.03 L-0.25,-0.08 L-0.07,-0.08 Z"
          fill="#FFFFFF"
        />
      </defs>

      <rect y="0" width="18" height="3.75" fill="#3081F7" />
      <rect y="3.75" width="18" height="0.375" fill="#EE162E" />
      <rect y="4.125" width="18" height="3.75" fill="#FFFFFF" />
      <rect y="7.875" width="18" height="0.375" fill="#EE162E" />
      <rect y="8.25" width="18" height="3.75" fill="#308738" />

      <path
        d="M 3.8 0.7 A 1.2 1.2 0 1 0 3.8 3 A 1.4 1.4 0 1 1 3.8 0.7 Z"
        fill="#FFFFFF"
      />

      <use href="#star" x="5.0" y="2.7" />
      <use href="#star" x="5.8" y="2.7" />
      <use href="#star" x="6.6" y="2.7" />
      <use href="#star" x="7.4" y="2.7" />
      <use href="#star" x="8.2" y="2.7" />

      <use href="#star" x="5.8" y="1.8" />
      <use href="#star" x="6.6" y="1.8" />
      <use href="#star" x="7.4" y="1.8" />
      <use href="#star" x="8.2" y="1.8" />

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
      <rect width="18" height="12" fill="#012169" />

      <path d="M0,0 L18,12 M18,0 L0,12" stroke="#fff" strokeWidth="3.5" />

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

      <rect x="7.5" y="0" width="3" height="12" fill="#fff" />
      <rect x="0" y="4.5" width="18" height="3" fill="#fff" />

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

export function LocaleLanding2() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const pathname = usePathname();

  const localeSet = new Set(["uz", "en", "ru"]);

  const getPathParts = () => pathname.split("/").filter(Boolean);

  const getCurrentLocale = () => {
    const parts = getPathParts();
    const first = parts[0];
    if (!first) return "uz";
    return localeSet.has(first) ? first : "uz";
  };

  const switchLocale = (locale: string) => {
    const parts = getPathParts();
    const hasLocale = localeSet.has(parts[0]);
    const rest = hasLocale ? parts.slice(1) : parts;

    if (locale === "uz") {
      return rest.length ? `/${rest.join("/")}` : "/";
    }

    return rest.length ? `/${locale}/${rest.join("/")}` : `/${locale}`;
  };

  const current = getCurrentLocale();

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow:
            "0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
          padding: "8px 12px",
          borderRadius: "10px",
          color: "rgba(255, 255, 255, 0.92)",
          cursor: "pointer",
          fontWeight: 500,
          letterSpacing: "0.03em",
          transition:
            "background 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.14)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.28)";
          e.currentTarget.style.boxShadow =
            "0 6px 20px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
          e.currentTarget.style.boxShadow =
            "0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
        }}
      >
        {flags[current]}
        <span>{current.toUpperCase()}</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: "8px",
            background: "#111",
            borderRadius: "10px",
            overflow: "hidden",
            minWidth: "140px",
            zIndex: 50,
          }}
        >
          {locales.map((l) => (
            <Link
              key={l.code}
              href={switchLocale(l.code)}
              style={{
                display: "flex",
                gap: "8px",
                padding: "10px",
                color: "#aaa",
                textDecoration: "none",
                alignItems: "center",
                whiteSpace: "nowrap",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
              onClick={() => setOpen(false)}
              scroll={false}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#aaa";
              }}
            >
              {flags[l.code]}
              <span>{l.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}