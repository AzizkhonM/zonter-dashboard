"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";

export default function HelpClient() {
  const t = useTranslations("Dashboard");
  const [search, setSearch] = useState("");
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [sendingSupport, setSendingSupport] = useState(false);

  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");

  const categories = [
    {
      title: t("help.categories.gettingStarted.title"),
      description: t("help.categories.gettingStarted.description"),
      articles: [
        {
          slug: "getting-started",
          title: t("help.articles.gettingStarted.title"),
          description: t("help.articles.gettingStarted.description"),
        },
        {
          slug: "create-organization",
          title: t("help.articles.createOrganization.title"),
          description: t("help.articles.createOrganization.description"),
        },
      ],
    },

    {
      title: t("help.categories.organizations.title"),
      description: t("help.categories.organizations.description"),
      articles: [
        {
          slug: "members",
          title: t("help.articles.members.title"),
          description: t("help.articles.members.description"),
        },
        {
          slug: "roles",
          title: t("help.articles.roles.title"),
          description: t("help.articles.roles.description"),
        },
      ],
    },

    {
      title: t("help.categories.tournaments.title"),
      description: t("help.categories.tournaments.description"),
      articles: [
        {
          slug: "create-tournament",
          title: t("help.articles.createTournament.title"),
          description: t("help.articles.createTournament.description"),
        },
        {
          slug: "formats",
          title: t("help.articles.formats.title"),
          description: t("help.articles.formats.description"),
        },
      ],
    },

    {
      title: t("help.categories.account.title"),
      description: t("help.categories.account.description"),
      articles: [
        {
          slug: "profile",
          title: t("help.articles.profile.title"),
          description: t("help.articles.profile.description"),
        },
        {
          slug: "security",
          title: t("help.articles.security.title"),
          description: t("help.articles.security.description"),
        },
      ],
    },
  ];

  const handleSendSupport = async () => {
    const subject = supportSubject.trim();
    const message = supportMessage.trim();

    if (subject.length < 3 || message.length < 10) {
      toast.error(t("help.support.validation"));
      return;
    }

    try {
      setSendingSupport(true);

      const res = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(
          data.error
            ? t(`help.support.errors.${data.error}`)
            : t("help.support.errors.SERVER_ERROR")
        );
        return;
      }

      toast.success(t("help.support.success"));

      setSupportSubject("");
      setSupportMessage("");
      setShowSupportModal(false);
    } catch (error) {
      console.error("Support request error:", error);
      toast.error(t("help.support.errors.SERVER_ERROR"));
    } finally {
      setSendingSupport(false);
    }
  };

  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return [];

    return categories
      .flatMap((category) =>
        category.articles.map((article) => ({
          ...article,
          category: category.title,
        }))
      )
      .filter((article) => {
        const content =
          `${article.title} ${article.description} ${article.category}`.toLowerCase();

        return content.includes(query);
      });
  }, [search, categories]);

  const isSearching = search.trim().length > 0;

  return (
    <div className="dashboard-page">
      <div className="help-header">
        <div>
          <p className="help-description">{t("help.description")}</p>
        </div>

        <div className="help-search">
          <span className="help-search-icon">⌕</span>

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("help.search")}
          />
        </div>
      </div>

      {isSearching ? (
        <section className="help-search-results">
          <div className="help-category-header">
            <h2>{t("help.searchResults.title")}</h2>
            <p>
              {searchResults.length > 0
                ? t("help.searchResults.found", {
                    count: searchResults.length,
                  })
                : t("help.searchResults.empty")}
            </p>
          </div>

          {searchResults.length > 0 ? (
            <div className="help-grid">
              {searchResults.map((article) => (
                <Link
                  href={`/dashboard/help/${article.slug}`}
                  className="help-card"
                  key={`${article.category}-${article.title}`}
                >
                  <div className="help-card-content">
                    <span className="help-card-category">
                      {article.category}
                    </span>

                    <h3>{article.title}</h3>

                    <p>{article.description}</p>
                  </div>

                  <span className="help-card-arrow">→</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="help-empty">
              <div className="help-empty-icon">⌕</div>

              <h3>{t("help.searchResults.noResults")}</h3>

              <p>{t("help.searchResults.tryAgain")}</p>
            </div>
          )}
        </section>
      ) : (
        <div className="help-categories">
          {categories.map((category) => (
            <section className="help-category" key={category.title}>
              <div className="help-category-header">
                <h2>{category.title}</h2>
                <p>{category.description}</p>
              </div>

              <div className="help-grid">
                {category.articles.map((article) => (
                  <Link
                    href={`/dashboard/help/${article.slug}`}
                    className="help-card"
                    key={article.title}
                  >
                    <div className="help-card-content">
                      <h3>{article.title}</h3>
                      <p>{article.description}</p>
                    </div>

                    <span className="help-card-arrow">→</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <section className="help-support">
        <div>
          <h2>{t("help.support.title")}</h2>
          <p>{t("help.support.description")}</p>
        </div>

        <button
          type="button"
          className="action-link primary help-support-button"
          onClick={() => setShowSupportModal(true)}
        >
          {t("help.support.button")}
        </button>
      </section>

      {showSupportModal && (
        <div
          className="password-modal-overlay"
          onClick={() => {
            if (!sendingSupport) {
              setShowSupportModal(false);
            }
          }}
        >
          <div className="password-modal" onClick={(e) => e.stopPropagation()}>
            <div className="password-modal-header">
              <div>
                <h2>{t("help.support.modalTitle")}</h2>
                <p>{t("help.support.modalDescription")}</p>
              </div>

              <button
                type="button"
                className="password-modal-close"
                onClick={() => setShowSupportModal(false)}
                disabled={sendingSupport}
              >
                ×
              </button>
            </div>

            <div className="profile-form">
              <div className="field">
                <label className="profile-label">
                  {t("help.support.subject")}
                </label>

                <input
                  className="input"
                  type="text"
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  disabled={sendingSupport}
                />
              </div>

              <div className="field">
                <label className="profile-label">
                  {t("help.support.message")}
                </label>

                <textarea
                  className="input support-textarea"
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  disabled={sendingSupport}
                  rows={5}
                />
              </div>

              <div className="password-modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowSupportModal(false)}
                  disabled={sendingSupport}
                >
                  {t("help.support.cancel")}
                </button>

                <button
                  type="button"
                  className="submit-btn"
                  onClick={handleSendSupport}
                  disabled={
                    sendingSupport ||
                    supportSubject.trim().length < 3 ||
                    supportMessage.trim().length < 10
                  }
                >
                  {sendingSupport
                    ? t("help.support.sending")
                    : t("help.support.send")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .help-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          margin-bottom: 48px;
        }

        .help-title {
          font-size: 32px;
          font-weight: 600;
          color: white;
          letter-spacing: -0.5px;
          margin-bottom: 12px;
        }

        .help-description {
          font-size: 14px;
          color: #9CA3AF;
          max-width: 600px;
        }

        .help-search {
          position: relative;
          width: 360px;
          flex-shrink: 0;
        }

        .help-search input {
          width: 100%;
          height: 44px;
          padding: 0 16px 0 42px;
          border: 1px solid #232A34;
          border-radius: 8px;
          background: #0F1115;
          color: white;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .help-search input::placeholder {
          color: #6B7280;
        }

        .help-search input:focus {
          border-color: #3A4450;
          background: #161B22;
        }

        .help-search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #6B7280;
          font-size: 21px;
          line-height: 1;
          z-index: 1;
          pointer-events: none;
        }

        .help-categories,
        .help-search-results {
          display: flex;
          flex-direction: column;
          gap: 44px;
        }

        .help-category-header {
          margin-bottom: 18px;
        }

        .help-category-header h2 {
          font-size: 18px;
          font-weight: 600;
          color: white;
          letter-spacing: -0.3px;
          margin-bottom: 6px;
        }

        .help-category-header p {
          font-size: 13px;
          color: #6B7280;
        }

        .help-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .help-card {
          width: 100%;
          min-height: 150px;
          padding: 22px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          text-align: left;
          border: 1px solid #232A34;
          border-radius: 10px;
          background: #0F1115;
          color: inherit;
          cursor: pointer;
          transition:
            border-color 0.2s,
            background 0.2s,
            transform 0.2s;
        }

        .help-card:hover {
          border-color: #3A4450;
          background: #161B22;
          transform: translateY(-1px);
        }

        .help-card-content {
          min-width: 0;
        }

        .help-card-category {
          display: block;
          margin-bottom: 8px;
          font-size: 11px;
          font-weight: 600;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .help-card h3 {
          font-size: 15px;
          font-weight: 600;
          color: white;
          letter-spacing: -0.2px;
          margin-bottom: 9px;
        }

        .help-card p {
          font-size: 13px;
          line-height: 1.6;
          color: #9CA3AF;
          max-width: 500px;
        }

        .help-card-arrow {
          flex-shrink: 0;
          color: #6B7280;
          font-size: 18px;
          transition: color 0.2s, transform 0.2s;
        }

        .help-card:hover .help-card-arrow {
          color: white;
          transform: translateX(3px);
        }

        .help-empty {
          padding: 48px 24px;
          text-align: center;
          border: 1px dashed #232A34;
          border-radius: 12px;
          background: #0F1115;
        }

        .help-empty-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          color: #9CA3AF;
          font-size: 22px;
        }

        .help-empty h3 {
          font-size: 16px;
          font-weight: 600;
          color: white;
          margin-bottom: 7px;
        }

        .help-empty p {
          font-size: 13px;
          color: #6B7280;
        }

        .help-support {
          margin-top: 48px;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border: 1px solid #232A34;
          border-radius: 12px;
          background: #0F1115;
        }

        .help-support h2 {
          font-size: 17px;
          font-weight: 600;
          color: white;
          margin-bottom: 7px;
        }

        .help-support p {
          font-size: 13px;
          color: #9CA3AF;
        }

        .help-support-button {
          flex-shrink: 0;
          padding: 10px 16px;
          border: 1px solid #232A34;
          border-radius: 8px;
          background: white;
          color: black;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .help-support-button:hover {
          opacity: 0.9;
        }

        @media (max-width: 900px) {
          .help-header {
            align-items: stretch;
            flex-direction: column;
          }

          .help-search {
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .help-title {
            font-size: 24px;
          }

          .help-description {
            font-size: 13px;
          }

          .help-categories,
          .help-search-results {
            gap: 36px;
          }

          .help-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .help-card {
            min-height: 130px;
            padding: 18px;
          }

          .help-support {
            flex-direction: column;
            align-items: stretch;
            padding: 20px;
          }

          .help-support-button {
            width: 100%;
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
        
        .field {
          position: relative;
          width: 100%;
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
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
      `}</style>
    </div>
  );
}
