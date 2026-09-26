"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import UserAvatar from "@/components/UserAvatar";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "SUPER_ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  authProvider: string;
};

export default function ProfilePage() {
  const t = useTranslations("Dashboard");

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const pathname = usePathname();

  const localeSet = new Set(["uz", "en", "ru"]);
  const segment = pathname.split("/")[1];
  const locale = localeSet.has(segment) ? segment : "uz";
  const router = useRouter();

  const isGoogleUser = user?.authProvider === "GOOGLE";

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
    const trimmedName = name.trim();

    if (!user || trimmedName.length < 4) {
      toast.error(t("profile.errors.name"));
      return;
    }

    if (trimmedName === (user.name ?? "")) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        switch (data.error) {
          case "NAME_TOO_SHORT":
            toast.error(t("profile.errors.name"));
            break;

          case "UNAUTHORIZED":
            toast.error(t("profile.errors.unauthorized"));
            break;

          default:
            toast.error(t("profile.errors.server"));
        }

        return;
      }

      // Inputni yangilash
      setName(data.user.name);

      // Profile'dagi user state'ni ham yangilash
      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: data.user.name,
              updatedAt: data.user.updatedAt,
            }
          : prev
      );

      window.dispatchEvent(new Event("profile-updated"));

      toast.success(t("profile.success"));
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(t("profile.errors.server"));
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (
      currentPassword.length < 8 ||
      newPassword.length < 8 ||
      confirmNewPassword.length < 8
    ) {
      toast.error(t("profile.passwordErrors.minLength"));
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error(t("profile.passwordErrors.mismatch"));
      return;
    }

    setChangingPassword(true);

    try {
      const response = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword: confirmNewPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        switch (data.error) {
          case "INVALID_CURRENT_PASSWORD":
            toast.error(t("profile.passwordErrors.current"));
            break;

          case "PASSWORD_TOO_SHORT":
            toast.error(t("profile.passwordErrors.minLength"));
            break;

          case "PASSWORD_MISMATCH":
            toast.error(t("profile.passwordErrors.mismatch"));
            break;

          case "UNAUTHORIZED":
            toast.error(t("profile.errors.unauthorized"));
            break;

          default:
            toast.error(t("profile.errors.server"));
        }

        return;
      }

      toast.success(t("profile.passwordSuccess"));

      setUser((prev) =>
        prev
          ? {
              ...prev,
              updatedAt: data.updatedAt,
            }
          : prev
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      setShowPasswordModal(false);
    } catch (error) {
      console.error("Password change error:", error);
      toast.error(t("profile.errors.server"));
    } finally {
      setChangingPassword(false);
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

          <button
            type="button"
            className="submit-btn"
            onClick={handleSave}
            disabled={
              saving ||
              name.trim().length < 4 ||
              name.trim() === (user.name ?? "")
            }
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
          {isGoogleUser ? (
            <p className="profile-info-value">{t("profile.googleAccount")}</p>
          ) : (
            <>
              <div>
                <p className="profile-info-label">{t("profile.password")}</p>

                <p className="password-dots">••••••••••••</p>
              </div>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => setShowPasswordModal(true)}
              >
                {t("profile.changepass")}
              </button>
            </>
          )}
        </div>
      </section>

      {showPasswordModal && (
        <div
          className="password-modal-overlay"
          onClick={() => {
            if (!changingPassword) {
              setShowPasswordModal(false);
            }
          }}
        >
          <div className="password-modal" onClick={(e) => e.stopPropagation()}>
            <div className="password-modal-header">
              <div>
                <h2>{t("profile.changepass")}</h2>
                <p>{t("profile.passwordDescription")}</p>
              </div>

              <button
                type="button"
                className="password-modal-close"
                onClick={() => setShowPasswordModal(false)}
                disabled={changingPassword}
              >
                ×
              </button>
            </div>

            <div className="profile-form">
              <div className="field">
                <label className="profile-label">
                  {t("profile.currentPassword")}
                </label>

                <div className="input-wrapper field-icon">
                  <input
                    className="input"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowCurrentPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="field">
                <label className="profile-label">
                  {t("profile.newPassword")}
                </label>

                <div className="input-wrapper field-icon">
                  <input
                    className="input"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowNewPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="field">
                <label className="profile-label">
                  {t("profile.confirmNewPassword")}
                </label>

                <div className="input-wrapper field-icon">
                  <input
                    className="input"
                    type={showConfirmNewPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowConfirmNewPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showConfirmNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="password-modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={changingPassword}
                >
                  {t("profile.cancel")}
                </button>

                <button
                  type="button"
                  className="submit-btn"
                  onClick={handleChangePassword}
                  disabled={
                    changingPassword ||
                    currentPassword.length < 8 ||
                    newPassword.length < 8 ||
                    confirmNewPassword.length < 8 ||
                    newPassword !== confirmNewPassword
                  }
                >
                  {changingPassword
                    ? t("profile.changingPassword")
                    : t("profile.changePassword")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          background: #0f1115;
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

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: var(--primary);
          color: #fff;
          font-size: 0.95rem;
          font-weight: 600;
          border: none;
          border-radius: var(--radius);
          cursor: pointer;
          margin-top: 4px;
          transition: background 0.2s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .submit-btn:hover {
          background: var(--primary-hover);
        }

        .submit-btn:active {
          transform: scale(0.98);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .password-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 24px;

          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(6px);
        }

        .password-modal {
          width: 100%;
          max-width: 520px;

          padding: 28px;

          background: #11151b;
          border: 1px solid #232a34;
          border-radius: 14px;

          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
        }

        .password-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;

          margin-bottom: 24px;
        }

        .password-modal-header h2 {
          margin: 0;
          color: white;
          font-size: 120%;
        }

        .password-modal-header p {
          margin: 6px 0 0;
          color: #8b929d;
          font-size: 14px;
        }

        .password-modal-close {
          width: 32px;
          height: 32px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0;

          border: 1px solid #232a34;
          border-radius: 8px;

          background: transparent;
          color: #8b929d;

          font-size: 22px;
          line-height: 1;

          cursor: pointer;
        }

        .password-modal-close:hover {
          color: #f3f4f6;
          border-color: #343b47;
        }

        .password-modal-actions {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          margin-top: 8px;
        }

        @media (min-width: 768px) {
          .password-modal-actions {
            grid-template-columns: 1fr 1fr;
          }
        }

        .eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          width: 40px;
          height: 40px;
          transition: color 0.2s;
        }

        .eye-btn:hover {
          color: var(--text-secondary);
        }

        .input-wrapper {
          position: relative;
          width: 100%;
        }
      `}</style>
    </div>
  );

  function EyeIcon() {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  function EyeOffIcon() {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }
}
