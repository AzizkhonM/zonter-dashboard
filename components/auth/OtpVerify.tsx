"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type ApiResponse = {
  success?: boolean;
  error?: string;
  toast?: "existing_otp" | "new_otp";
  code?:
    | "EMAIL_NOT_VERIFIED"
    | "INVALID_CODE"
    | "USER_EXISTS"
    | "TOO_MANY_ATTEMPTS";
  expiresAt?: string | Date;
  blockedUntil?: string | Date;
};

export default function OtpVerify({
  email,
  type = "register",
}: {
  email: string;
  type?: "login" | "register";
}) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [canResend, setCanResend] = useState(false);
  const [blockedTimeLeft, setBlockedTimeLeft] = useState<number | null>(null);

  const t = useTranslations("Auth");

  // useEffect: expiresAt ni DB dan olib, timer boshlash
  // useEffect: expiresAt ni DB dan olib, timer boshlash
  useEffect(() => {
    async function getExpiryTime() {
      try {
        const res = await fetch("/api/auth/otp-expiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (res.ok) {
          const data = await res.json();

          // ✅ Blocked check
          if (data.blockedUntil) {
            const blockedDate = new Date(data.blockedUntil);
            const now = new Date();

            if (blockedDate > now) {
              // Hali bloklanib bormoqda
              const remaining = Math.floor(
                (blockedDate.getTime() - now.getTime()) / 1000
              );
              setBlockedTimeLeft(Math.max(0, remaining));
              setCanResend(false);
              return;
            } else {
              // Blok tugab qolgan
              setBlockedTimeLeft(0);
              setCanResend(true);
            }
          }

          // ✅ Normal OTP timer
          if (data.expiresAt) {
            const expiryDate = new Date(data.expiresAt);
            setExpiresAt(expiryDate);

            const now = new Date();
            const remaining = Math.floor(
              (expiryDate.getTime() - now.getTime()) / 1000
            );
            setTimeLeft(Math.max(0, remaining));
          }
        }
      } catch (err) {
        console.error("Error fetching expiry time:", err);
      }
    }

    getExpiryTime();
  }, [email]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      setTimeLeft(0);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Timer format (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Resend OTP
  async function handleResendOtp() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      let data: ApiResponse = {};

      try {
        data = await res.json();
      } catch {
        setError("SERVER_ERROR");
        return;
      }

      if (!res.ok) {
        setError(data.error || "Failed to resend");
        return;
      }

      // Success - new timer boshlash
      if (data.expiresAt) {
        const expiryDate = new Date(data.expiresAt);
        setExpiresAt(expiryDate);

        const now = new Date();
        const remaining = Math.floor(
          (expiryDate.getTime() - now.getTime()) / 1000
        );
        setTimeLeft(Math.max(0, remaining));

        // ✅ Blocked state reset qilish
        setBlockedTimeLeft(null); // ← QO'SHISH
        setCanResend(false); // ← QO'SHISH

        setToast(t("new_otp"));
        setOtp(""); // OTP inputni tozalash
      }
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = otp.split("");
    newOtp[index] = value;
    const otpString = newOtp.join("").slice(0, 6);
    setOtp(otpString);

    if (value && index < 5) {
      const nextInput = document.querySelector(
        `.otp-input[data-index="${index + 1}"]`
      ) as HTMLInputElement;
      nextInput?.focus();
    }
  }

  function handleOtpKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    if (e.key === "Backspace") {
      const newOtp = otp.split("");
      if (newOtp[index]) {
        newOtp[index] = "";
        setOtp(newOtp.join(""));
      } else if (index > 0) {
        const prevInput = document.querySelector(
          `.otp-input[data-index="${index - 1}"]`
        ) as HTMLInputElement;
        prevInput?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      const prevInput = document.querySelector(
        `.otp-input[data-index="${index - 1}"]`
      ) as HTMLInputElement;
      prevInput?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      const nextInput = document.querySelector(
        `.otp-input[data-index="${index + 1}"]`
      ) as HTMLInputElement;
      nextInput?.focus();
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

      console.log(data);

      if (!res.ok) {
        // TOO_MANY_ATTEMPTS - blocked holat
        if (data.code === "TOO_MANY_ATTEMPTS") {
          setError(data.error || "Too many attempts");
          setOtp("");

          if (data.blockedUntil) {
            // ✅ String dan Date ga convert
            const blockedDate = new Date(data.blockedUntil);
            const now = new Date();

            console.log("blockedDate:", blockedDate);
            console.log("now:", now);
            console.log("blockedDate > now:", blockedDate > now);

            const remaining = Math.floor(
              (blockedDate.getTime() - now.getTime()) / 1000
            );

            console.log("remaining:", remaining);

            setBlockedTimeLeft(Math.max(0, remaining)); // ← Darhol shu qo'yish
            setCanResend(false);
          }

          // Normal timer o'chirish
          setTimeLeft(null);
          return;
        }

        setError(data.error || "Invalid code");
        setOtp(""); // ✅ Input tozalash
        return;
      }

      // Success
      localStorage.removeItem("pendingEmail");
      localStorage.removeItem("pendingName");
      localStorage.removeItem("pendingLocale");

      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (blockedTimeLeft === null || blockedTimeLeft <= 0) {
      if (blockedTimeLeft === 0) {
        setCanResend(true);
      }
      return;
    }

    const interval = setInterval(() => {
      setBlockedTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [blockedTimeLeft]); // ← DEPENDENCY QO'SHISH

  return (
    <div className="form-container">
      <h1 className="form-title">{t("verifyTitle")}</h1>
      <p className="form-subtitle">{t("verifySubtitle")}</p>

      <div className="form">
        {toast && <p className="toast-msg">{toast}</p>}

        {/* OTP Input Cells */}
        <div className="otp-container">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              key={index}
              type="text"
              className="otp-input"
              data-index={index}
              value={otp[index] || ""}
              onChange={(e) => handleOtpChange(e, index)}
              onKeyDown={(e) => handleOtpKeyDown(e, index)}
              maxLength={1}
              inputMode="numeric"
              pattern="[0-9]"
              autoFocus={index === 0}
            />
          ))}
        </div>

        {error && <p className="error-msg">{t(error)}</p>}

        <button
          className="submit-btn"
          onClick={handleVerify}
          disabled={
            loading ||
            otp.length !== 6 ||
            (blockedTimeLeft !== null && blockedTimeLeft > 0) ||
            (timeLeft !== null && timeLeft === 0) // ← OTP expire qilganida disabled
          }
        >
          {loading ? <Spinner /> : t("verifyTitle")}
        </button>

        {/* Blocked timer - agar bloklanibdi ko'rsatiladi */}
        {blockedTimeLeft !== null && blockedTimeLeft > 0 && (
          <div className="blocked-timer">
            <p className="blocked-text">
              {t("blockedUntil")} {formatTime(blockedTimeLeft)}
            </p>
          </div>
        )}
        {/* Timer yoki Resend button - faqat blocked emas bo'lganida */}
        {blockedTimeLeft === null && timeLeft !== null && (
          <div className="timer-section">
            {timeLeft > 0 ? (
              <p className="timer-text">
                {t("codeExpiresIn")}{" "}
                <span className="timer">{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <button
                className="resend-link"
                onClick={handleResendOtp}
                disabled={loading}
              >
                {loading ? <Spinner /> : t("resendCode")}
              </button>
            )}
          </div>
        )}

        {/* Resend button - FAQAT blocked tugagandan keyin */}
        {blockedTimeLeft === 0 && (
          <button
            className="resend-link"
            onClick={handleResendOtp}
            disabled={loading}
          >
            {loading ? <Spinner /> : t("resendCode")}
          </button>
        )}
      </div>

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

        .otp-container {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          justify-content: center;
        }

        .otp-input {
          width: 48px;
          height: 48px;
          border: 1.5px solid var(--input-border);
          border-radius: var(--radius);
          background: var(--input-bg);
          color: var(--text-primary);
          font-size: 1.25rem;
          font-weight: 600;
          text-align: center;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .otp-input:focus {
          border-color: var(--input-focus);
          background: var(--surface);
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
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .submit-btn:hover {
          background: var(--primary-hover);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        .timer-section {
  margin-top: 12px;
  text-align: center;
}

.timer-text {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.timer {
  color: var(--primary);
  font-weight: 600;
  font-size: 1rem;
}

.resend-btn {
  width: 100%;
  padding: 12px;
  background: var(--primary);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.resend-btn:hover {
  background: var(--primary-hover);
}

.resend-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Yangi CSS */
.resend-link {
  background: none;
  border: none;
  color: var(--primary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-decoration: none;
  transition: text-decoration 0.2s;
  display: inline;
}

.resend-link:hover {
  text-decoration: underline;
}

.resend-link:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.blocked-timer {
  margin-top: 12px;
  padding: 10px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius);
  text-align: center;
}

.blocked-text {
  font-size: 0.875rem;
  color: #ef4444;
  font-weight: 600;
  margin: 0;
}
      `}</style>
    </div>
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
