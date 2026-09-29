import nodemailer from "nodemailer";

type Locale = "uz" | "en" | "ru";

export type OrganizationEmailType =
  "APPROVED" | "REJECTED" | "SUSPENDED" | "ARCHIVED" | "RESTORED";

type OrganizationEmailData = {
  email: string;
  organizationName: string;
  locale: Locale;
  type: OrganizationEmailType;
  reason?: string | null;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const content: Record<
  Locale,
  Record<
    OrganizationEmailType,
    {
      subject: string;
      eyebrow: string;
      title: string;
      message: string;
      organizationLabel: string;
      reasonLabel: string;
      dashboardLabel: string;
      dashboardText: string;
      footer: string;
    }
  >
> = {
  uz: {
    APPROVED: {
      subject: "Tashkilot so‘rovingiz ma’qullandi",
      eyebrow: "Tashkilot so‘rovi",
      title: "Tashkilot tasdiqlandi",
      message:
        "Siz yuborgan tashkilot yaratish so‘rovi ma’qullandi. Endi Zonter orqali tashkilotingizni boshqarishingiz mumkin.",
      organizationLabel: "Tashkilot",
      reasonLabel: "Izoh",
      dashboardLabel: "Dashboard",
      dashboardText:
        "Tashkilotingiz sahifasiga kirish va boshqaruvni davom ettirish uchun Zonter dashboard'ini oching.",
      footer:
        "Bu xabar Zonter tizimi tomonidan tashkilot so‘rovingiz holati haqida yuborildi.",
    },

    REJECTED: {
      subject: "Tashkilot so‘rovingiz rad etildi",
      eyebrow: "Tashkilot so‘rovi",
      title: "Tashkilot so‘rovi rad etildi",
      message:
        "Siz yuborgan tashkilot yaratish so‘rovi rad etildi. Quyida administrator tomonidan ko‘rsatilgan sabab keltirilgan.",
      organizationLabel: "Tashkilot",
      reasonLabel: "Rad etish sababi",
      dashboardLabel: "Dashboard",
      dashboardText:
        "Qo‘shimcha ma’lumot olish yoki keyingi harakatlarni ko‘rish uchun Zonter dashboard'ini oching.",
      footer:
        "Bu xabar Zonter tizimi tomonidan tashkilot so‘rovingiz holati haqida yuborildi.",
    },

    SUSPENDED: {
      subject: "Tashkilotingiz vaqtincha to‘xtatildi",
      eyebrow: "Tashkilot holati",
      title: "Tashkilot vaqtincha to‘xtatildi",
      message:
        "Tashkilotingiz vaqtincha to‘xtatildi. Quyida administrator tomonidan ko‘rsatilgan sabab keltirilgan.",
      organizationLabel: "Tashkilot",
      reasonLabel: "Sabab",
      dashboardLabel: "Dashboard",
      dashboardText:
        "Tashkilot holati va qo‘shimcha ma’lumotlarni ko‘rish uchun Zonter dashboard'ini oching.",
      footer:
        "Bu xabar Zonter tizimi tomonidan tashkilotingiz holati haqida yuborildi.",
    },

    ARCHIVED: {
      subject: "Tashkilotingiz arxivlandi",
      eyebrow: "Tashkilot holati",
      title: "Tashkilot arxivlandi",
      message:
        "Tashkilotingiz arxivlandi. Quyida administrator tomonidan ko‘rsatilgan sabab keltirilgan.",
      organizationLabel: "Tashkilot",
      reasonLabel: "Sabab",
      dashboardLabel: "Dashboard",
      dashboardText:
        "Tashkilot holati va qo‘shimcha ma’lumotlarni ko‘rish uchun Zonter dashboard'ini oching.",
      footer:
        "Bu xabar Zonter tizimi tomonidan tashkilotingiz holati haqida yuborildi.",
    },

    RESTORED: {
      subject: "Tashkilotingiz qayta tiklandi",
      eyebrow: "Tashkilot holati",
      title: "Tashkilot qayta tiklandi",
      message:
        "Tashkilotingiz qayta faollashtirildi. Endi Zonter orqali tashkilotingizni boshqarishingiz mumkin.",
      organizationLabel: "Tashkilot",
      reasonLabel: "Sabab",
      dashboardLabel: "Dashboard",
      dashboardText:
        "Tashkilot holati va boshqaruvni davom ettirish uchun Zonter dashboard'ini oching.",
      footer:
        "Bu xabar Zonter tizimi tomonidan tashkilotingiz holati haqida yuborildi.",
    },
  },

  en: {
    APPROVED: {
      subject: "Your organization request was approved",
      eyebrow: "Organization request",
      title: "Organization approved",
      message:
        "Your request to create an organization has been approved. You can now manage your organization through Zonter.",
      organizationLabel: "Organization",
      reasonLabel: "Note",
      dashboardLabel: "Dashboard",
      dashboardText:
        "Open your Zonter dashboard to access and manage your organization.",
      footer:
        "This email was sent by Zonter to notify you about the status of your organization request.",
    },

    REJECTED: {
      subject: "Your organization request was rejected",
      eyebrow: "Organization request",
      title: "Organization request rejected",
      message:
        "Your request to create an organization has been rejected. The reason provided by the administrator is shown below.",
      organizationLabel: "Organization",
      reasonLabel: "Reason",
      dashboardLabel: "Dashboard",
      dashboardText:
        "Open your Zonter dashboard to view additional information and next steps.",
      footer:
        "This email was sent by Zonter to notify you about the status of your organization request.",
    },

    SUSPENDED: {
      subject: "Your organization has been suspended",
      eyebrow: "Organization status",
      title: "Organization suspended",
      message:
        "Your organization has been temporarily suspended. The reason provided by the administrator is shown below.",
      organizationLabel: "Organization",
      reasonLabel: "Reason",
      dashboardLabel: "Dashboard",
      dashboardText:
        "Open your Zonter dashboard to view the organization status and additional information.",
      footer:
        "This email was sent by Zonter to notify you about your organization status.",
    },

    ARCHIVED: {
      subject: "Your organization has been archived",
      eyebrow: "Organization status",
      title: "Organization archived",
      message:
        "Your organization has been archived. The reason provided by the administrator is shown below.",
      organizationLabel: "Organization",
      reasonLabel: "Reason",
      dashboardLabel: "Dashboard",
      dashboardText:
        "Open your Zonter dashboard to view the organization status and additional information.",
      footer:
        "This email was sent by Zonter to notify you about your organization status.",
    },

    RESTORED: {
      subject: "Your organization has been restored",
      eyebrow: "Organization status",
      title: "Organization restored",
      message:
        "Your organization has been restored and is active again. You can now continue managing it through Zonter.",
      organizationLabel: "Organization",
      reasonLabel: "Reason",
      dashboardLabel: "Dashboard",
      dashboardText:
        "Open your Zonter dashboard to view the organization status and continue managing your organization.",
      footer:
        "This email was sent by Zonter to notify you about your organization status.",
    },
  },

  ru: {
    APPROVED: {
      subject: "Ваш запрос на создание организации одобрен",
      eyebrow: "Запрос организации",
      title: "Организация одобрена",
      message:
        "Ваш запрос на создание организации был одобрен. Теперь вы можете управлять организацией через Zonter.",
      organizationLabel: "Организация",
      reasonLabel: "Комментарий",
      dashboardLabel: "Панель управления",
      dashboardText:
        "Откройте панель управления Zonter, чтобы перейти к организации и продолжить работу.",
      footer:
        "Это письмо отправлено системой Zonter для уведомления о статусе вашего запроса.",
    },

    REJECTED: {
      subject: "Ваш запрос на создание организации отклонён",
      eyebrow: "Запрос организации",
      title: "Запрос отклонён",
      message:
        "Ваш запрос на создание организации был отклонён. Ниже указана причина, предоставленная администратором.",
      organizationLabel: "Организация",
      reasonLabel: "Причина",
      dashboardLabel: "Панель управления",
      dashboardText:
        "Откройте панель управления Zonter, чтобы получить дополнительную информацию и посмотреть дальнейшие действия.",
      footer:
        "Это письмо отправлено системой Zonter для уведомления о статусе вашего запроса.",
    },

    SUSPENDED: {
      subject: "Ваша организация приостановлена",
      eyebrow: "Статус организации",
      title: "Организация приостановлена",
      message:
        "Ваша организация была временно приостановлена. Ниже указана причина, предоставленная администратором.",
      organizationLabel: "Организация",
      reasonLabel: "Причина",
      dashboardLabel: "Панель управления",
      dashboardText:
        "Откройте панель управления Zonter, чтобы посмотреть статус организации и дополнительную информацию.",
      footer:
        "Это письмо отправлено системой Zonter для уведомления о статусе вашей организации.",
    },

    ARCHIVED: {
      subject: "Ваша организация архивирована",
      eyebrow: "Статус организации",
      title: "Организация архивирована",
      message:
        "Ваша организация была архивирована. Ниже указана причина, предоставленная администратором.",
      organizationLabel: "Организация",
      reasonLabel: "Причина",
      dashboardLabel: "Панель управления",
      dashboardText:
        "Откройте панель управления Zonter, чтобы посмотреть статус организации и дополнительную информацию.",
      footer:
        "Это письмо отправлено системой Zonter для уведомления о статусе вашей организации.",
    },

    RESTORED: {
      subject: "Ваша организация восстановлена",
      eyebrow: "Статус организации",
      title: "Организация восстановлена",
      message:
        "Ваша организация была восстановлена и снова активна. Теперь вы можете продолжить управление организацией через Zonter.",
      organizationLabel: "Организация",
      reasonLabel: "Причина",
      dashboardLabel: "Панель управления",
      dashboardText:
        "Откройте панель управления Zonter, чтобы посмотреть статус организации и продолжить работу.",
      footer:
        "Это письмо отправлено системой Zonter для уведомления о статусе вашей организации.",
    },
  },
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function emailTemplate({
  eyebrow,
  title,
  message,
  organizationLabel,
  organizationName,
  reasonLabel,
  reason,
  dashboardLabel,
  dashboardText,
  footer,
}: {
  eyebrow: string;
  title: string;
  message: string;
  organizationLabel: string;
  organizationName: string;
  reasonLabel: string;
  reason?: string | null;
  dashboardLabel: string;
  dashboardText: string;
  footer: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#09090B;
  color:#F3F4F6;
  font-family:Arial,Helvetica,sans-serif;
">

  <div style="
    width:100%;
    background:#09090B;
    padding:40px 16px;
    box-sizing:border-box;
  ">

    <div style="
      max-width:560px;
      margin:0 auto;
      background:#0F1115;
      border:1px solid #232A34;
      border-radius:12px;
      overflow:hidden;
    ">

      <!-- Header -->
      <div style="
        padding:28px 32px 24px;
        border-bottom:1px solid #232A34;
      ">

        <div style="
          margin-bottom:18px;
          color:#F97316;
          font-size:11px;
          line-height:16px;
          font-weight:700;
          letter-spacing:0.12em;
        ">
          ZONTER
        </div>

        <div style="
          margin-bottom:8px;
          color:#555B65;
          font-size:10px;
          line-height:14px;
          font-weight:600;
          text-transform:uppercase;
          letter-spacing:0.06em;
        ">
          ${escapeHtml(eyebrow)}
        </div>

        <h1 style="
          margin:0;
          color:#F3F4F6;
          font-size:24px;
          line-height:32px;
          font-weight:600;
          letter-spacing:-0.025em;
        ">
          ${escapeHtml(title)}
        </h1>

      </div>

      <!-- Body -->
      <div style="
        padding:28px 32px 32px;
      ">

        <div style="
          margin-bottom:24px;
        ">

          <div style="
            margin-bottom:8px;
            color:#555B65;
            font-size:10px;
            line-height:14px;
            font-weight:600;
            text-transform:uppercase;
            letter-spacing:0.05em;
          ">
            ${escapeHtml(organizationLabel)}
          </div>

          <div style="
            padding:14px 16px;
            background:#11151B;
            border:1px solid #232A34;
            border-radius:8px;
            color:#F3F4F6;
            font-size:15px;
            line-height:21px;
            font-weight:600;
          ">
            ${escapeHtml(organizationName)}
          </div>

        </div>

        <p style="
          margin:0 0 24px;
          color:#9CA3AF;
          font-size:13px;
          line-height:21px;
        ">
          ${escapeHtml(message)}
        </p>

        ${
          reason
            ? `
        <!-- Reason -->
        <div style="
          margin-bottom:24px;
          padding:16px;
          background:#11151B;
          border:1px solid #232A34;
          border-radius:8px;
        ">

          <div style="
            margin-bottom:8px;
            color:#555B65;
            font-size:10px;
            line-height:14px;
            font-weight:600;
            text-transform:uppercase;
            letter-spacing:0.05em;
          ">
            ${escapeHtml(reasonLabel)}
          </div>

          <div style="
            color:#C9CCD1;
            font-size:13px;
            line-height:20px;
          ">
            ${escapeHtml(reason)}
          </div>

        </div>
        `
            : ""
        }

        <!-- Dashboard -->
        <div style="
          padding:18px;
          background:#11151B;
          border:1px solid #232A34;
          border-radius:8px;
        ">

          <div style="
            margin-bottom:6px;
            color:#F3F4F6;
            font-size:13px;
            line-height:19px;
            font-weight:600;
          ">
            ${escapeHtml(dashboardLabel)}
          </div>

          <div style="
            color:#9CA3AF;
            font-size:12px;
            line-height:19px;
          ">
            ${escapeHtml(dashboardText)}
          </div>

        </div>

      </div>

      <!-- Footer -->
      <div style="
        padding:18px 32px;
        border-top:1px solid #232A34;
      ">

        <p style="
          margin:0;
          color:#555B65;
          font-size:10px;
          line-height:17px;
          text-align:center;
        ">
          ${escapeHtml(footer)}
        </p>

      </div>

    </div>

  </div>

</body>
</html>
  `;
}

export async function sendOrganizationEmail({
  email,
  organizationName,
  locale,
  type,
  reason,
}: OrganizationEmailData) {
  const localizedContent = content[locale][type];

  await transporter.sendMail({
    from: `"Zonter" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: localizedContent.subject,
    html: emailTemplate({
      eyebrow: localizedContent.eyebrow,
      title: localizedContent.title,
      message: localizedContent.message,
      organizationLabel: localizedContent.organizationLabel,
      organizationName,
      reasonLabel: localizedContent.reasonLabel,
      reason,
      dashboardLabel: localizedContent.dashboardLabel,
      dashboardText: localizedContent.dashboardText,
      footer: localizedContent.footer,
    }),
  });
}
