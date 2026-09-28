"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AdminLang from "@/components/AdminLang";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{
    name: string | null;
    email: string;
  } | null>(null);

  const t = useTranslations("Admin.sidebar");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) return;

        const data = await response.json();

        if (data.user) {
          setUser({
            name: data.user.name,
            email: data.user.email,
          });
        }
      } catch (error) {
        console.error("Failed to load admin user:", error);
      }
    };

    loadUser();
  }, []);

  // ESC → close sidebar
  useEffect(() => {
    if (!sidebarOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <div
      className={`admin-layout ${
        sidebarOpen ? "admin-layout-sidebar-open" : ""
      }`}
    >
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-content">
          <nav className="admin-sidebar-nav" aria-label="Admin navigation">
            <Link
              href="/admin"
              className={`admin-nav-item ${
                pathname === "/admin" ? "admin-nav-item-active" : ""
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="7"
                  height="7"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <rect
                  x="14"
                  y="3"
                  width="7"
                  height="7"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <rect
                  x="3"
                  y="14"
                  width="7"
                  height="7"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <rect
                  x="14"
                  y="14"
                  width="7"
                  height="7"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>

              <span>{t("dashboard")}</span>
            </Link>

            <Link
              href="/admin/organizations"
              className={`admin-nav-item ${
                pathname.startsWith("/admin/organizations")
                  ? "admin-nav-item-active"
                  : ""
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 21V5.5L12 3l8 2.5V21"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 21v-4h8v4M8 8h1M12 8h1M16 8h1M8 11h1M12 11h1M16 11h1"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>

              <span>{t("organizations")}</span>
            </Link>

            <Link
              href="/admin/organization-requests"
              className={`admin-nav-item admin-nav-item-child ${
                pathname.startsWith("/admin/organization-requests")
                  ? "admin-nav-item-active"
                  : ""
              }`}
            >
              <span>{t("organizationRequests")}</span>
            </Link>

            <div className="admin-sidebar-divider" />

            <Link
              href="/admin/users"
              className={`admin-nav-item ${
                pathname.startsWith("/admin/users")
                  ? "admin-nav-item-active"
                  : ""
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="9"
                  cy="8"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M3.5 20c.6-3.2 2.4-5 5.5-5s4.9 1.8 5.5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M16 11c2.5 0 4 1.5 4.5 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M16 5.5a2.5 2.5 0 0 1 0 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>

              <span>{t("users")}</span>
            </Link>

            <Link
              href="/admin/reports"
              className={`admin-nav-item ${
                pathname.startsWith("/admin/reports")
                  ? "admin-nav-item-active"
                  : ""
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 3h12v18H6z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 8h6M9 12h6M9 16h4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>

              <span>{t("reports")}</span>
            </Link>

            <Link
              href="/admin/feedback"
              className={`admin-nav-item ${
                pathname.startsWith("/admin/feedback")
                  ? "admin-nav-item-active"
                  : ""
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 5.5C5 4.67 5.67 4 6.5 4h11c.83 0 1.5.67 1.5 1.5v8c0 .83-.67 1.5-1.5 1.5H11l-4 4v-4h-.5C5.67 15 5 14.33 5 13.5v-8Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 8h7M8.5 11h4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>

              <span>{t("feedback")}</span>
            </Link>

            <div className="admin-sidebar-spacer" />

            <Link
              href="/admin/settings"
              className={`admin-nav-item ${
                pathname.startsWith("/admin/settings")
                  ? "admin-nav-item-active"
                  : ""
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="m19 13 .1-1-.1-1 2-1.5-2-3.5-2.4 1a8 8 0 0 0-1.7-1L14.5 3h-5L9 6a8 8 0 0 0-1.7 1l-2.4-1-2 3.5L5 11a8 8 0 0 0 0 2l-2.1 1.5 2 3.5 2.4-1a8 8 0 0 0 1.7 1l.5 3h5l.5-3a8 8 0 0 0 1.7-1l2.4 1 2-3.5L19 13Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>

              <span>{t("settings")}</span>
            </Link>

            <div className="admin-sidebar-divider" />

            <div className="admin-locale-switcher">
              <AdminLang />
            </div>

            <button
              className="admin-nav-item admin-logout-button"
              onClick={handleLogout}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M9 5H5.5C4.67 5 4 5.67 4 6.5V17.5C4 18.33 4.67 19 5.5 19H9"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <path
                  d="M13 8L17 12L13 16"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 12H9"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>

              <span>{t("logout")}</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Header */}
      <header className="admin-header">
        <button
          type="button"
          className="admin-sidebar-toggle"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={sidebarOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="2.5"
              y="3"
              width="15"
              height="14"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />

            <path d="M7 3V17" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>

        <div className="admin-user">
          <span className="admin-user-name">{user?.name || "User"}</span>

          <span className="admin-user-email">{user?.email || ""}</span>
        </div>
      </header>

      {/* Mobile / tablet overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Main */}
      <main className="admin-main">
        <div className="admin-content">{children}</div>
      </main>

      <style>{`

        html,
        body {
          margin: 0;
          padding: 0;
          background: #09090B;
        }

        .admin-layout {
          --admin-sidebar-width: 256px;
          --admin-content-padding: 24px;

          min-height: 100dvh;
          width: 100%;
          background: #09090B;
          color: #F3F4F6;
          font-family: var(--font-satoshi);
        }

        /* =========================
           SIDEBAR
        ========================= */

        .admin-sidebar {
          position: fixed;

          top: 0;
          left: 0;
          bottom: 0;

          width: var(--admin-sidebar-width);

          z-index: 50;

          background: #0F1115;
          border-right: 1px solid #232A34;

          transform: translateX(-100%);

          transition:
            transform 0.18s ease-out;
        }

        .admin-layout-sidebar-open .admin-sidebar {
          transform: translateX(0);
        }

        .admin-sidebar-content {
          height: 100%;
          width: 100%;
        }

        .admin-sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 16px 12px;
          height: 100%;
          box-sizing: border-box;
        }

        .admin-nav-item {
          height: 40px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 12px;
          border-radius: 7px;

          color: #A1A1AA;
          text-decoration: none;

          font-size: 14px;
          font-weight: 500;

          transition:
            background-color 0.15s ease,
            color 0.15s ease;
        }

        .admin-nav-item:hover {
          background: #161A20;
          color: #F3F4F6;
        }

        .admin-nav-item-active {
          background: #1B2129;
          color: #F3F4F6;
        }

        .admin-nav-item-child {
          padding-left: 72px;
          height: 36px;
          font-size: 12px;
        }

        .admin-sidebar-divider {
          height: 1px;
          margin: 8px 4px;
          background: #232A34;
        }

        .admin-sidebar-spacer {
          flex: 1;
        }

        .admin-logout-button {
          width: 100%;
          border: 0;
          background: transparent;
          font-family: inherit;
          text-align: left;
          cursor: pointer;
        }

        .admin-logout-button:hover {
          background: #161A20;
          color: #F3F4F6;
        }

        /* =========================
           HEADER
        ========================= */

        .admin-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 56px;
          z-index: 40;

          display: flex;
          align-items: center;

          padding: 0 var(--admin-content-padding);

          background: #09090B;
          border-bottom: 1px solid #232A34;

          transition: left 0.18s ease-out;
        }

        /*
         * Desktop:
         * header also becomes part of the shifted content area.
         */
        @media (min-width: 1025px) {
          .admin-layout-sidebar-open .admin-header {
            left: var(--admin-sidebar-width);
          }
        }

        /* =========================
           TOGGLE
        ========================= */

        .admin-sidebar-toggle {
        width: 32px;
        height: 32px;

        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        margin-left: 0;
        padding: 0;

        border: 0;
        border-radius: 6px;

        background: transparent;
        color: #E5E7EB;
        cursor: pointer;

          transition:
            background-color 0.15s ease,
            color 0.15s ease;
        }

        .admin-sidebar-toggle:hover {
          background: #161A20;
          color: #FFFFFF;
        }

        .admin-sidebar-toggle svg {
          display: block;
        }

        /* =========================
           USER
        ========================= */

        .admin-user {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
          margin-left: 10px;
        }

        .admin-user-name {
          font-size: 13px;
          line-height: 17px;

          font-weight: 600;

          color: #F3F4F6;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-user-email {
          font-size: 11px;
          line-height: 15px;

          color: #71717A;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-locale-switcher {
          margin-top: 2px;
        }

        .admin-locale-switcher .locale-switcher {
          width: 100%;
        }

        /* =========================
           MAIN
        ========================= */

        .admin-main {
          min-height: 100dvh;
          padding-top: 56px;
          padding-left: var(--admin-content-padding);
          padding-right: var(--admin-content-padding);

          background: #09090B;
          box-sizing: border-box;

          transition: margin-left 0.18s ease-out;
        }

        .admin-content {
          background: #09090B;
        }

        /*
         * Desktop:
         * sidebar takes real space.
         *
         * Example:
         * 1300px viewport
         * - 256px sidebar
         * = 1044px main
         */
        @media (min-width: 1025px) {
          .admin-layout-sidebar-open .admin-main {
            margin-left: var(--admin-sidebar-width);
          }
        }

        /* =========================
           OVERLAY
        ========================= */

        .admin-overlay {
          display: none;

          position: fixed;

          inset: 0;

          z-index: 45;

          border: 0;

          padding: 0;

          background: rgba(9, 9, 11, 0.58);

          cursor: default;

          backdrop-filter: blur(2px);
        }

        /*
         * Under 1024px:
         * sidebar overlays content.
         */
        @media (max-width: 1024px) {
          .admin-overlay {
            display: block;
          }

          .admin-header {
            height: 52px;
          }

          .admin-main {
            padding-top: 52px;
          }

          .admin-content {

          }

          .admin-sidebar {
            width: 256px;
          }
        }
      `}</style>
    </div>
  );
}
