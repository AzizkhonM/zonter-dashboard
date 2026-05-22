// components/auth/AuthShell.tsx
"use client";

import { LeftPanelCarousel } from "@/components/register/LeftPanelCarousel";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-wrapper">
      <div className="left-panel">
        <div className="left-glow" />
        <div className="left-glow-2" />
        <LeftPanelCarousel />
      </div>
      <div className="right-panel">{children}</div>
    </div>
  );
}