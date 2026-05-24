"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "@/app/globals.css";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

type AuthType = "login" | "register";

export default function AuthForm({ type }: { type: AuthType }) {
  const router = useRouter();
  const isLogin = type === "login";
  const pathname = usePathname();
  const localeSet = new Set(["uz", "en", "ru"]);
  const segment = pathname.split("/")[1];
  const locale = localeSet.has(segment) ? segment : "uz";
  console.log(locale);

  const t = useTranslations("Auth");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const withLocale = (path: string) => {
    if (locale === "uz") return path; // /register
    return `/${locale}${path}`; // /en/register
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin ? { email, password } : { name, email, password };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }
  }

  return (
    <div className="form-container">
      <h1 className="form-title">
        {isLogin ? t("loginTitle") : t("registerTitle")}
      </h1>
      <p className="form-subtitle">
        {isLogin ? t("loginSubtitle") : t("registerSubtitle")}
      </p>

      <form onSubmit={handleSubmit} className="form">
        {!isLogin && (
          <div className="field">
            <input
              className="input"
              type="text"
              placeholder={t("name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="field">
          <input
            className="input"
            type="email"
            placeholder={t("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field field-icon">
          <input
            className="input"
            type={showPassword ? "text" : "password"}
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="eye-btn"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        {!isLogin && (
          <div className="field field-icon">
            <input
              className="input"
              type={showConfirm ? "text" : "password"}
              placeholder={t("confirmPassword")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowConfirm((v) => !v)}
              tabIndex={-1}
            >
              {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        )}

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" className="submit-btn">
          {isLogin ? t("login") : t("register")}
        </button>
      </form>

      <p className="login-link">
        {isLogin ? (
          <>
            {t("noAccount")}{" "}
            <Link href={withLocale("/register")}>{t("register")}</Link>
          </>
        ) : (
          <>
            {t("haveAccount")}{" "}
            <Link href={withLocale("/login")}>{t("login")}</Link>
          </>
        )}
      </p>

      <style>{`
        .form-container {
          width: 100%;
          max-width: 400px;
        }

        .form-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-white);
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }

        .form-subtitle {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 28px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .field {
          position: relative;
        }

        .field-icon .input {
          padding-right: 44px;
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
          padding: 0;
          transition: color 0.2s;
        }

        .eye-btn:hover {
          color: var(--text-secondary);
        }

        .error-msg {
          font-size: 0.82rem;
          color: var(--error);
          padding: 0 2px;
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
        }

        .submit-btn:hover {
          background: var(--primary-hover);
        }

        .submit-btn:active {
          transform: scale(0.98);
        }

        .login-link {
          margin-top: 22px;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .login-link a {
          color: var(--primary);
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }

        .login-link a:hover {
          color: var(--primary-hover);
          text-decoration: underline;
        }
         
        .input:-webkit-autofill {
          -webkit-text-fill-color: var(--text-primary) !important;
          -webkit-box-shadow: 0 0 0px 1000px var(--input-bg) inset !important;
          border: 1.5px solid var(--input-border) !important;
          transition: background-color 9999s ease-in-out 0s;
          caret-color: var(--text-primary);
          color: var(--text-primary);
        }

        .input:-webkit-autofill:focus {
          border-color: var(--input-focus) !important;
          -webkit-box-shadow: 0 0 0px 1000px var(--surface) inset !important;
        }
      `}</style>
    </div>
  );
}

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
