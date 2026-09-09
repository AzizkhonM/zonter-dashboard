"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import UserAvatar from "@/components/UserAvatar";
import { usePathname } from "next/navigation";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "SUPER_ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function ProfilePage() {
  const t = useTranslations("Dashboard");

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const pathname = usePathname();

  const localeSet = new Set(["uz", "en", "ru"]);
  const segment = pathname.split("/")[1];
  const locale = localeSet.has(segment) ? segment : "uz";

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/profile");

        if (!res.ok) return;

        const data = await res.json();

        if (data.user) {
          setUser(data.user);
          setName(data.user.name || "");
        }

        console.log(data.user, "Profile haqida");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  async function handleSave() {
    if (!name.trim() || !user) return;

    setSaving(true);

    try {
      // Keyingi bosqichda API yozamiz
      console.log("Save name:", name.trim());
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-card">{t("profile.loading")}...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-card">{t("profile.404")}</div>
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user.email[0].toUpperCase();

  const formatDate = (date: string) => {
    const value = new Date(date);

    // User device timezone offset
    const offsetMinutes = -value.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? "+" : "-";

    const hours = Math.floor(Math.abs(offsetMinutes) / 60);
    const minutes = Math.abs(offsetMinutes) % 60;

    const utcOffset =
      minutes === 0
        ? `UTC${sign}${hours},`
        : `UTC${sign}${hours}:${String(minutes).padStart(2, "0")},`;

    if (locale === "en") {
      const time = value.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const datePart = value.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });

      return `${time} ${utcOffset} ${datePart}`;
    }

    const time = value.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const datePart = value.toLocaleDateString("ru-RU");

    return `${time} ${utcOffset} ${datePart}`;
  };

  const createdDate = formatDate(user.createdAt);
  const updatedDate = formatDate(user.updatedAt);

  return (
    <div className="profile-page">
      {/* Personal Information */}
      <section className="profile-card">
        <div className="profile-section-header">
          <h2>{t("profile.personal")}</h2>
          <p>{t("profile.underpersonal")}</p>
        </div>

        <div className="profile-user">
          <UserAvatar name={user?.name} size={52} />

          <div>
            <h3>{user.name || "User"}</h3>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="profile-form">
          <div className="field">
            <label className="profile-label">{t("profile.name")}</label>

            <input
              className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
          </div>

          <div className="field">
            <label className="profile-label">Email</label>

            <input className="input" type="email" value={user.email} disabled />
          </div>

          <div className="profile-row">
            <div className="field">
              <label className="profile-label">{t("profile.role")}</label>

              <input
                className="input"
                type="text"
                value={
                  user.role === "SUPER_ADMIN"
                    ? t("profile.superAdmin")
                    : t("profile.user")
                }
                disabled
              />
            </div>

            <div className="field">
              <label className="profile-label">{t("profile.status")}</label>

              <input
                className="input"
                type="text"
                value={
                  user.isActive ? t("profile.active") : t("profile.inactive")
                }
                disabled
              />
            </div>
          </div>

          <button
            type="button"
            className="submit-btn profile-save"
            onClick={handleSave}
            disabled={saving || !name.trim() || name.trim() === user.name}
          >
            {saving ? t("profile.saving") : t("profile.save")}
          </button>
        </div>
      </section>

      {/* Account Information */}
      <section className="profile-card">
        <div className="profile-section-header">
          <h2>{t("profile.info")}</h2>
        </div>

        <div className="profile-row">
          <div>
            <p className="profile-info-label">{t("profile.createdAt")}</p>
            <p className="profile-info-value">{createdDate}</p>
          </div>

          <div>
            <p className="profile-info-label">{t("profile.updatedAt")}</p>
            <p className="profile-info-value">{updatedDate}</p>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="profile-card">
        <div className="profile-section-header">
          <h2>{t("profile.security")}</h2>
          <p>{t("profile.undersecurity")}</p>
        </div>

        <div className="security-row">
          <div>
            <p className="profile-info-label">{t("profile.password")}</p>
            <p className="password-dots">••••••••••••</p>
          </div>

          <button type="button" className="secondary-btn">
          {t("profile.changepass")}
          </button>
        </div>
      </section>

      <style jsx>{`
        .profile-page {
          width: 100%;
          max-width: 850px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .profile-card {
          width: 100%;
          padding: 24px;
          background: var(--surface);
          border: 1px solid var(--input-border);
          border-radius: var(--radius);
        }

        .profile-section-header {
          margin-bottom: 22px;
        }

        .profile-section-header h2 {
          margin: 0 0 5px;
          color: var(--text-primary);
          font-size: 1.05rem;
          font-weight: 600;
        }

        .profile-section-header p {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .profile-user {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
        }

        .profile-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: var(--primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 600;
        }

        .profile-user h3 {
          margin: 0 0 3px;
          color: var(--text-primary);
          font-size: 0.98rem;
          font-weight: 600;
        }

        .profile-user p {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.83rem;
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .field {
          position: relative;
          width: 100%;
        }

        .profile-label {
          display: block;
          margin-bottom: 7px;
          color: var(--text-secondary);
          font-size: 0.82rem;
          font-weight: 500;
        }

        .input {
          width: 100%;
          padding: 13px 16px;
          background: var(--input-bg);
          border: 1.5px solid var(--input-border);
          border-radius: var(--radius);
          font-size: 0.92rem;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .input::placeholder {
          color: var(--text-muted);
        }

        .input:focus {
          border-color: var(--input-focus);
          background: var(--surface);
        }

        .input:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .profile-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .profile-save {
          margin-top: 4px;
        }

        .profile-info-label {
          margin: 0 0 5px;
          color: var(--text-muted);
          font-size: 0.8rem;
        }

        .profile-info-value {
          margin: 0;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .security-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .password-dots {
          margin: 0;
          color: var(--text-primary);
          letter-spacing: 2px;
        }

        .secondary-btn {
          padding: 11px 16px;
          background: transparent;
          border: 1.5px solid var(--input-border);
          border-radius: var(--radius);
          color: var(--text-primary);
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }

        .secondary-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: #3a4450;
        }

        @media (max-width: 600px) {
          .profile-card {
            padding: 18px;
          }

          .profile-row {
            grid-template-columns: 1fr;
          }

          .security-row {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
