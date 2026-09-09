"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import "@/app/globals.css";
import LocaleDash from "@/components/LocaleDash";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasOrganizations, setHasOrganizations] = useState(false);
  const [userName, setUserName] = useState("");
  const t = useTranslations("Dashboard");
  const pathname = usePathname();

  const localeSet = new Set(["uz", "en", "ru"]);

  const segment = pathname.split("/")[1];

  const locale = localeSet.has(segment) ? segment : "uz";

  const withLocale = (path: string) => {
    if (locale === "uz") {
      return path;
    }

    return `/${locale}${path}`;
  };

  const dashboardPath = `/${locale}/dashboard`;

  const isHomeActive =
    pathname === "/dashboard" || pathname === `/${locale}/dashboard`;

  const isHomeDisabled =
    pathname === "/dashboard" || pathname === `/${locale}/dashboard`;

  const isProfileActive =
    pathname === "/dashboard/profile" ||
    pathname === `/${locale}/dashboard/profile` ||
    pathname.startsWith("/dashboard/profile/") ||
    pathname.startsWith(`/${locale}/dashboard/profile/`);

  const isProfileDisabled =
    pathname === "/dashboard/profile" ||
    pathname === `/${locale}/dashboard/profile`;

  const homeHref =
    pathname === "/dashboard" ? "/dashboard" : `/${locale}/dashboard`;

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/me");

        if (!res.ok) {
          console.log("Failed to fetch user:", res.status);
          return;
        }

        const data = await res.json();

        setUserName(data.user?.name || "User");

        const organizations = data.user?.organizationMembers ?? [];
        setHasOrganizations(organizations.length > 0);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on ESC
  useEffect(() => {
    if (!mounted) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, mounted]);

  if (!mounted) return null;

  return (
    <div className="dashboard-wrapper">
      {/* Mobile overlay */}
      {open && (
        <div className="mobile-overlay" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${open ? "open" : ""}`}>
        {/* Close button */}
        <button
          className="sidebar-close"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <span>✕</span>
        </button>
        {/* User section */}
        <div className="sidebar-user">
          <div className="user-avatar">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#646566" />
              <circle cx="24" cy="18" r="6" fill="white" opacity="0.7" />
              <path
                d="M12 36c0-4.418 5.373-8 12-8s12 3.582 12 8v2H12v-2z"
                fill="white"
                opacity="0.7"
              />
            </svg>
          </div>

          {userName ? (
            <h3 className="sidebar-zonter">{userName}</h3>
          ) : (
            <div className="user-name-skeleton" />
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav uppercase">
          {/* Home */}
          <Link
            href={homeHref}
            className={`nav-link ${isHomeActive ? "active" : ""}`}
            onClick={(e) => {
              if (isHomeDisabled) {
                e.preventDefault();
                return;
              }

              setOpen(false);
            }}
          >
            <span>{t("sidebar.home")}</span>
          </Link>

          {/* Organization navigation */}
          {hasOrganizations && (
            <>
              <Link
                href={withLocale("/dashboard/organizations")}
                className="nav-link"
                onClick={() => setOpen(false)}
              >
                <span>{t("sidebar.myorgs")}</span>
              </Link>

              <Link
                href={withLocale("/dashboard/history")}
                className="nav-link"
                onClick={() => setOpen(false)}
              >
                <span>{t("sidebar.history")}</span>
              </Link>
            </>
          )}

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background: "#232A34",
              margin: "16px 0",
            }}
          />

          {/* Profile */}
          <Link
            href={withLocale("/dashboard/profile")}
            className={`nav-link ${isProfileActive ? "active" : ""}`}
            onClick={(e) => {
              if (isProfileDisabled) {
                e.preventDefault();
                return;
              }

              setOpen(false);
            }}
          >
            <span>{t("sidebar.profile")}</span>
          </Link>

          <Link
            href={withLocale("/dashboard/notifications")}
            className="nav-link"
            onClick={() => setOpen(false)}
          >
            <span>{t("sidebar.notifications")}</span>
          </Link>

          <Link
            href={withLocale("/dashboard/help")}
            className="nav-link"
            onClick={() => setOpen(false)}
          >
            <span>{t("sidebar.help")}</span>
          </Link>

          <Link
            href={withLocale("/dashboard/settings")}
            className="nav-link"
            onClick={() => setOpen(false)}
          >
            <span>{t("sidebar.settings")}</span>
          </Link>
        </nav>

        {/* Bottom section */}
        <div className="sidebar-bottom">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ width: "auto" }}>
              <LocaleDash />
            </div>

            <button className="sidebar-logout" style={{ width: "auto" }}>
              {t("sidebar.logout")}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>

          <div>
            <p className="header-label">{t("title")}</p>
            <h1 className="header-title">{t("overview")}</h1>
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content">{children}</div>
      </main>

      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .dashboard-wrapper {
          display: flex;
          min-height: 100svh;
          width: 100%;
          background: #09090B;
          font-family: var(--font-satoshi);
        }

        /* Mobile overlay */
        .mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 30;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
        }

        /* Mobile menu button */
        .mobile-menu-btn {
          display: none;
          flex-shrink: 0;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

.mobile-menu-btn svg {
  transition: transform 0.2s ease;
}

.mobile-menu-btn:hover svg {
  transform: scaleY(1.25);
}

        .menu-icon {
          width: 22px;
          height: 22px;
        }

        /* Sidebar */
        .dashboard-sidebar {
          width: 256px;
          height: 100svh;
          border-right: 1px solid #232A34;
          background: #0F1115;
          padding: 24px;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 40;
          transition: transform 0.2s ease;
        }

        /* User section */
        .sidebar-user {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .user-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #646566;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .sidebar-close {
  display: none;
  position: absolute;
  right: 16px;
  top: 16px;
  width: 44px;
  height: 44px;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  border-radius: 8px;
}

.sidebar-close span {
  display: inline-block;
  transition: transform 0.2s ease;
}

.sidebar-close:hover span {
  transform: scaleY(1.25);
}

        .sidebar-zonter {
          font-size: 18px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.5px;
          margin: 0;
          text-align: center
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          color: #9CA3AF;
          transition: color 0.2s;
          min-width: 0
        }

        .nav-link span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

        .nav-link:hover {
          color: white;
        }

        .nav-link.active {
          border-right: 5px solid white;
          border-radius: 0px;
          color: white;
        }

        .nav-icon {
          font-size: 18px;
          width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-bottom {
          border-top: 1px solid #232A34;
          padding-top: 24px;
        }

        .sidebar-logout {
          width: 100%;
          padding: 10px 16px;
          background: transparent;
          border: none;
          color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s;
          text-align: left;
        }

        .sidebar-logout:hover {
          color: #f97316;
        }

        /* Main content */
        .dashboard-main {
          flex: 1;
          margin-left: 256px;
          display: flex;
          flex-direction: column;
          min-height: 100svh;
        }

        .dashboard-header {
          display: flex;
          align-items: center;
          gap: 24px;
          border-bottom: 1px solid #232A34;
          background: #0F1115;
          padding: 24px 32px;
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .header-label {
          font-size: 12px;
          font-weight: 600;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .header-title {
          font-size: 24px;
          font-weight: 600;
          color: white;
          letter-spacing: -0.5px;
        }

        .dashboard-content {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }

        .user-name-skeleton {
  width: 80px;
  height: 20px;
  border-radius: 4px;
  background: #232A34;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }
}

        /* Responsive */
        @media (max-width: 768px) {
          .mobile-overlay {
            display: block;
          }

          .mobile-menu-btn {
            display: flex;
          }

          .dashboard-sidebar {
            transform: translateX(-100%);
            width: 100%;
            border-right: none;
            padding-top: 24px;
          }

          .sidebar-close {
  display: flex;
  align-items: center;
  justify-content: center;
}

          .dashboard-sidebar.open {
            transform: translateX(0);
          }

          .dashboard-main {
            margin-left: 0;
          }

          .dashboard-header {
            padding: 16px 20px;
            min-height: 76px;
          }

          .header-title {
            font-size: 20px;
          }

          .dashboard-content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
