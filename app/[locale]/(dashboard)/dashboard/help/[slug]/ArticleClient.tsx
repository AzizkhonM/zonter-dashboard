"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type Props = {
  slug: string;
};

const articleMap: Record<string, string> = {
  "getting-started": "gettingStarted",
  "create-organization": "createOrganization",
  members: "members",
  roles: "roles",
  "create-tournament": "createTournament",
  formats: "formats",
  profile: "profile",
  security: "security",
};

export default function ArticleClient({ slug }: Props) {
  const t = useTranslations("Dashboard");

  const articleKey = articleMap[slug];

  if (!articleKey) {
    return (
      <div className="dashboard-page">
        <div className="help-empty">
          <h1>{t("help.article.notFound")}</h1>
          <p>{t("help.article.notFoundDescription")}</p>
          <Link href="/dashboard/help">{t("help.article.backToHelp")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <article className="help-article">
        <Link href="/dashboard/help" className="help-article-back">
          ← {t("help.article.backToHelp")}
        </Link>

        <header className="help-article-header">
          <span className="help-article-category">
            {t("help.articlesCategory")}
          </span>

          <h1>{t(`help.articles.${articleKey}.title`)}</h1>

          <p>{t(`help.articles.${articleKey}.description`)}</p>
        </header>

        <div className="help-article-content">
          <p>{t(`help.articles.${articleKey}.content`)}</p>
        </div>
      </article>

      <style>{`
        .help-article {
          max-width: 860px;
          margin: 0 auto;
        }

        .help-article-back {
          display: inline-block;
          margin-bottom: 36px;
          color: #9CA3AF;
          font-size: 13px;
          text-decoration: none;
        }

        .help-article-back:hover {
          color: white;
        }

        .help-article-header {
          padding-bottom: 32px;
          border-bottom: 1px solid #232A34;
        }

        .help-article-category {
          display: block;
          margin-bottom: 12px;
          color: #6B7280;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .help-article-header h1 {
          margin-bottom: 12px;
          color: white;
          font-size: 32px;
          font-weight: 600;
          letter-spacing: -0.5px;
        }

        .help-article-header p {
          max-width: 680px;
          color: #9CA3AF;
          font-size: 14px;
          line-height: 1.7;
        }

        .help-article-content {
          padding-top: 32px;
          color: #D1D5DB;
          font-size: 14px;
          line-height: 1.8;
        }

        @media (max-width: 768px) {
          .help-article-header h1 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}
