"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import "@/app/globals.css";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile button */}
      <button
  onClick={() => setOpen(!open)}
  className="fixed left-4 top-4 z-50 rounded-lg bg-white/10 p-3 md:hidden hover:bg-white/20 transition-all hover:cursor-pointer"
  aria-label="Toggle menu"
>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={`transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"}`}
  >
    {open ? (
      // X icon
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ) : (
      // Hamburger icon
      <>
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </>
    )}
  </svg>
</button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-black p-6 transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <div className="mt-12 text-2xl font-bold md:mt-0">Zonter</div>

        <nav className="mt-10 flex flex-col gap-2 text-sm">
          <a
            href="/dashboard"
            className="rounded-lg bg-white/10 px-4 py-3"
          >
            Overview
          </a>

          <a
            href="/dashboard/settings"
            className="rounded-lg px-4 py-3 text-white/60 hover:bg-white/5 hover:text-white"
          >
            Settings
          </a>
        </nav>
      </aside>

      {/* Main */}
      <main className="min-h-screen p-6 md:ml-64 md:p-8">
        {children}
      </main>
    </div>
  );
}