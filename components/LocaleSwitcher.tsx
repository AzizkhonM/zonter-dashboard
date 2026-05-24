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
      <rect y="0" width="18" height="3.75" fill="#3081F7" />
      <rect y="3.75" width="18" height="0.375" fill="#EE162E" />
      <rect y="4.125" width="18" height="3.75" fill="#FFFFFF" />
      <rect y="7.875" width="18" height="0.375" fill="#EE162E" />
      <rect y="8.25" width="18" height="3.75" fill="#308738" />
    </svg>
  ),
  en: (
    <svg width="18" height="12" viewBox="0 0 18 12" style={{ borderRadius: 2 }}>
      <rect width="18" height="12" fill="#012169" />
      {/* X krestlar — Andrey xochi */}
      <path d="M0,0 L18,12 M18,0 L0,12" stroke="#fff" strokeWidth="3.5" />
      <path d="M0,0 L18,12 M18,0 L0,12" stroke="#C8102E" strokeWidth="1.8" />
      {/* + krest — Georg xochi */}
      <rect x="7.5" width="3" height="12" fill="#fff" />
      <rect y="4.5" width="18" height="3" fill="#fff" />
      <rect x="8" width="2" height="12" fill="#C8102E" />
      <rect y="5" width="18" height="2" fill="#C8102E" />
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

export function LocaleSwitcher() {
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
    <div className="locale-wrapper" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)} className="locale-button">
        {flags[current]}
        <span>{current.toUpperCase()}</span>
      </button>

      {open && (
        <div className="locale-dropdown">
          {locales.map((l) => (
            <Link
              key={l.code}
              href={switchLocale(l.code)}
              className="locale-item"
              onClick={() => {
                setOpen(false);
              }}
              scroll={false}
            >
              {flags[l.code]}
              <span>{l.label}</span>
            </Link>
          ))}
        </div>
      )}

      <style>{`
          .locale-wrapper {
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 9999;
          }
  
          .locale-button {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            padding: 8px 10px;
            border-radius: 8px;
            color: white;
            cursor: pointer;
          }
  
          .locale-dropdown {
            margin-top: 8px;
            background: #111;
            border-radius: 10px;
            overflow: hidden;
          }
  
          .locale-item {
            display: flex;
            gap: 8px;
            padding: 10px;
            color: #aaa;
            text-decoration: none;
            align-items: center;
          }
  
          .locale-item:hover {
            background: rgba(255,255,255,0.05);
            color: white;
          }
        `}</style>
    </div>
  );
}
