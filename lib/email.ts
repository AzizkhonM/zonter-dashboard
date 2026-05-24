import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

type Locale = "uz" | "en" | "ru";

const subjects: Record<Locale, string> = {
  uz: "Emailingizni tasdiqlang",
  en: "Verify your email",
  ru: "Подтвердите вашу почту",
};

const emailTemplate = (
  title: string,
  body: string,
  code: string,
  expiry: string,
  footer: string
) => `
  <div style="background:#09090B;min-height:100vh;padding:40px 16px;font-family:sans-serif">
    <div style="max-width:480px;margin:auto;background:#0F1115;border:1px solid #232A34;border-radius:16px;overflow:hidden">
      
      <!-- Header -->
      <div style="padding:32px 32px 24px;border-bottom:1px solid #232A34">
        <h1 style="margin:0;font-size:1.4rem;font-weight:700;color:#fff;letter-spacing:-0.4px;text-align:center">${title}</h1>
      </div>

      <!-- Body -->
      <div style="padding:28px 32px">
        <p style="margin:0 0 20px;font-size:0.92rem;color:#9CA3AF">${body}</p>

        <!-- OTP Box -->
        <div style="background:#09090B;border:1px solid #232A34;border-radius:12px;padding:24px;text-align:center;margin-bottom:20px">
          <div style="font-size:2.2rem;font-weight:700;letter-spacing:12px;color:#fff">${code}</div>
        </div>

        <!-- Expiry notice -->
        <div style="background:rgba(249,115,22,0.06);border:1px solid rgba(249,115,22,0.15);border-radius:8px;padding:10px 14px">
          <p style="margin:0;font-size:0.8rem;color:#F97316;text-align:center">${expiry}</p>
        </div>

      <!-- Footer -->
      <div style="padding:16px 32px;border-top:1px solid #232A34">
        <p style="margin:0;font-size:0.75rem;color:#4B5563;text-align:center">${footer}</p>
      </div>

    </div>
  </div>
`;

const bodies: Record<Locale, (code: string) => string> = {
  uz: (code) =>
    emailTemplate(
      "Tasdiqlash kodi",
      "Quyidagi kodni kiritib, emailingizni tasdiqlang:",
      code,
      "Kod 10 daqiqa davomida amal qiladi.",
      "Agar siz bu soʻrovni yubormagan boʻlsangiz, ushbu xabarni eʼtiborsiz qoldiring."
    ),
  en: (code) =>
    emailTemplate(
      "Verification code",
      "Enter the code below to verify your email address:",
      code,
      "Code is valid for 10 minutes.",
      "If you didn't request this, you can safely ignore this email."
    ),
  ru: (code) =>
    emailTemplate(
      "Код подтверждения",
      "Введите код ниже, чтобы подтвердить вашу почту:",
      code,
      "Код действителен 10 минут.",
      "Если вы не запрашивали это, просто проигнорируйте это письмо."
    ),
};

export async function sendVerificationEmail(
  email: string,
  code: string,
  locale: Locale = "uz"
) {
  await transporter.sendMail({
    from: `"Zonter App" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: subjects[locale],
    html: bodies[locale](code),
  });
}
