"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "@/app/globals.css";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";

type AuthType = "login" | "register";
type ApiResponse = {
  success?: boolean;
  error?: string;
  toast?: "existing_otp" | "new_otp";
  code?: "EMAIL_NOT_VERIFIED" | "INVALID_CODE" | "USER_EXISTS";
};

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
  const [step, setStep] = useState<"form" | "verify">("form");
  const [otp, setOtp] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const withLocale = (path: string) => {
    if (locale === "uz") return path; // /register
    return `/${locale}${path}`; // /en/register
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isLogin && password !== confirmPassword) {
      setError("PASSWORDS_DO_NOT_MATCH");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

      const body = isLogin
        ? { email, password, locale }
        : { name, email, password, locale };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      let data: ApiResponse = {};

      try {
        data = await res.json();
      } catch {
        setError("SERVER_ERROR");
        return;
      }

      if (!res.ok) {
        if (data.code === "EMAIL_NOT_VERIFIED") {
          if (data.toast === "existing_otp") {
            setToast(t("existing_otp"));
          } else if (data.toast === "new_otp") {
            setToast(t("new_otp"));
          }
          setStep("verify");
          return;
        }

        setError(data.error || "Something went wrong");
        return;
      }

      if (isLogin) {
        router.push("/dashboard");
      } else {
        if (data.toast === "existing_otp") {
          setToast(t("existing_otp"));
        } else if (data.toast === "new_otp") {
          setToast(t("new_otp"));
        }
        setStep("verify");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: otp,
        }),
      });

      let data: ApiResponse = {};

      try {
        data = await res.json();
      } catch {
        setError("SERVER_ERROR");
        return;
      }

      if (!res.ok) {
        setError(data.error || "Invalid code");
        return;
      }

      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-container">
      <h1 className="form-title">
        {step === "form"
          ? isLogin
            ? t("loginTitle")
            : t("registerTitle")
          : t("verifyTitle")}
      </h1>
      <p className="form-subtitle">
        {step === "form"
          ? isLogin
            ? t("loginSubtitle")
            : t("registerSubtitle")
          : t("verifySubtitle")}
      </p>

      {/* STEP 1 */}
      {step === "form" && (
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

          {error && <p className="error-msg">{t(error)}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <Spinner /> : isLogin ? t("login") : t("register")}
          </button>

          <div className="divider">
            <span>{t("or")}</span>
          </div>

          <button
            type="button"
            className="google-btn"
            onClick={() => signIn("google")}
            disabled={loading}
          >
            <GoogleIcon />
            {t("continueWithGoogle")}
          </button>
        </form>
      )}

      {/* STEP 2 */}
      {step === "verify" && (
        <div className="form">
          {toast && <p className="toast-msg">{toast}</p>}
          <div className="field">
            <input
              className="input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder={t("6-digitCode")}
              maxLength={6}
            />
          </div>

          {error && <p className="error-msg">{t(error)}</p>}

          <button
            className="submit-btn"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? <Spinner /> : t("verifyTitle")}
          </button>
        </div>
      )}

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
          display: flex;              /* ← qo'sh */
          align-items: center;        /* ← qo'sh */
          justify-content: center;    /* ← qo'sh */
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

        .toast-msg {
          font-size: 0.82rem;
          color: #4ade80;
          padding: 10px 12px;
          background: rgba(74, 222, 128, 0.08);
          border: 1px solid rgba(74, 222, 128, 0.2);
          border-radius: 8px;
          text-align: center;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-muted);
          font-size: 0.82rem;
          margin: 4px 0;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #232A34;
        }

        .google-btn {
          width: 100%;
          padding: 13px;
          background: transparent;
          border: 1.5px solid #232A34;
          border-radius: var(--radius);
          color: var(--text-primary);
          font-size: 0.92rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.2s, border-color 0.2s;
        }

        .google-btn:hover {
          background: rgba(255,255,255,0.04);
          border-color: #3a4450;
        }

        .google-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

function Spinner() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: "spin 0.7s linear infinite" }}
    >
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
