"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import PageHeader from "@/components/admin/PageHeader";

type OrganizationMember = {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  joinedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    authProvider: "LOCAL" | "GOOGLE";
    isActive: boolean;
  };
};

type Organization = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  type:
    | "COMPANY"
    | "UNIVERSITY"
    | "SCHOOL"
    | "GOVERNMENT"
    | "NGO"
    | "COMMUNITY"
    | "OTHER";
  status: "ACTIVE" | "SUSPENDED" | "ARCHIVED";
  affiliatedOrganization: string | null;
  website: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  createdAt: string;
  updatedAt: string;
  members: OrganizationMember[];
  _count: {
    members: number;
  };
};

export default function OrganizationDetailsPage() {
  const t = useTranslations("Admin.organizationDetails");
  const params = useParams<{ slug: string }>();

  const [organization, setOrganization] = useState<Organization | null>(null);

  const [loading, setLoading] = useState(true);
  const formatDateTime = (date: string) => {
    const value = new Date(date);

    return (
      new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Tashkent",
      }).format(value) + " UTC+5"
    );
  };
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/admin/organizations/${params.slug}`);

        const data = await response.json();

        if (!response.ok) {
          setError(data.error ?? "SERVER_ERROR");
          return;
        }

        setOrganization(data.organization);
      } catch {
        setError("SERVER_ERROR");
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      loadOrganization();
    }
  }, [params.slug]);

  return (
    <div className="organizations-page">
      <div className="organization-back">
        <Link href="/admin/organizations" className="organization-back-link">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M19 12H5M11 18L5 12L11 6"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span>{t("back")}</span>
        </Link>
      </div>

      <PageHeader title={t("title")} description={t("description")} />

      {loading && (
        <div className="organization-details-state">{t("loading")}</div>
      )}

      {!loading && error && (
        <div className="organization-details-state organization-details-error">
          {t(`errors.${error}`)}
        </div>
      )}

      {!loading && !error && organization && (
        <div className="organization-overview">
          <section className="organization-overview-card">
            <div className="organization-identity">
              <div className="organization-logo">
                {organization.logoUrl ? (
                  <img src={organization.logoUrl} alt={organization.name} />
                ) : (
                  <span>{organization.name.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <div className="organization-identity-content">
                <div className="organization-name-row">
                  <h2>{organization.name}</h2>

                  <span
                    className={`organization-status organization-status-${organization.status.toLowerCase()}`}
                  >
                    <span className="organization-status-dot" />
                    {t(`status.${organization.status.toLowerCase()}`)}
                  </span>
                </div>

                <p className="organization-slug">{organization.slug}</p>

                {organization.description && (
                  <p className="organization-description">
                    {organization.description}
                  </p>
                )}
              </div>
            </div>

            <div className="organization-details-grid">
              <div className="organization-detail">
                <span className="organization-detail-label">
                  {t("fields.type")}
                </span>
                <span className="organization-detail-value">
                  {t(`types.${organization.type.toLowerCase()}`)}
                </span>
              </div>

              <div className="organization-detail">
                <span className="organization-detail-label">
                  {t("fields.members")}
                </span>
                <span className="organization-detail-value">
                  {organization._count.members}
                </span>
              </div>

              <div className="organization-detail">
                <span className="organization-detail-label">
                  {t("fields.country")}
                </span>
                <span className="organization-detail-value">
                  {organization.country || "—"}
                </span>
              </div>

              <div className="organization-detail">
                <span className="organization-detail-label">
                  {t("fields.region")}
                </span>
                <span className="organization-detail-value">
                  {organization.region || "—"}
                </span>
              </div>

              <div className="organization-detail">
                <span className="organization-detail-label">
                  {t("fields.city")}
                </span>
                <span className="organization-detail-value">
                  {organization.city || "—"}
                </span>
              </div>

              <div className="organization-detail">
                <span className="organization-detail-label">
                  {t("fields.affiliatedOrganization")}
                </span>
                <span className="organization-detail-value">
                  {organization.affiliatedOrganization || "—"}
                </span>
              </div>

              <div className="organization-detail">
                <span className="organization-detail-label">
                  {t("fields.website")}
                </span>

                {organization.website ? (
                  <a
                    href={organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="organization-detail-link"
                  >
                    {organization.website}
                  </a>
                ) : (
                  <span className="organization-detail-value">—</span>
                )}
              </div>

              <div className="organization-detail">
                <span className="organization-detail-label">
                  {t("fields.created")}
                </span>
                <span className="organization-detail-value">
                  {formatDateTime(organization.createdAt)}
                </span>
              </div>

              <div className="organization-detail">
                <span className="organization-detail-label">
                  {t("fields.updated")}
                </span>
                <span className="organization-detail-value">
                  {formatDateTime(organization.updatedAt)}
                </span>
              </div>
            </div>
          </section>
        </div>
      )}

      <style>{`
        .organizations-page {
          width: 100%;
          min-height: calc(100dvh - 56px);
          padding-top: 28px;
          padding-bottom: 48px;
          box-sizing: border-box;
        }

        @media (max-width: 700px) {
          .organizations-page {
            padding-top: 20px;
          }
        }

        .organization-back {
          margin-top: -10px;
          margin-bottom: 22px;
        }

        .organization-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #666b75;
          font-size: 11px;
          line-height: 16px;
          font-weight: 500;
          text-decoration: none;
          transition:
            color 0.15s ease,
            transform 0.15s ease;
        }

        .organization-back-link:hover {
          color: #b4b7bd;
        }

        .organization-back-link svg {
          flex-shrink: 0;
          transition: transform 0.15s ease;
        }

        .organization-back-link:hover svg {
          transform: translateX(-2px);
        }

        .organization-details-state {
          padding: 32px 0;
          color: #666b75;
          font-size: 11px;
          line-height: 18px;
        }

        .organization-details-error {
          color: #d47777;
        }


                      ORGANIZATION
        =============================================

        .organization-overview {
          width: 100%;
        }

        .organization-overview-card {
          border: 1px solid #1c2026;
          border-radius: 8px;
          background: #11151b;
          overflow: hidden;
        }

        .organization-identity {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 22px 20px;
          border-bottom: 1px solid #1c2026;
        }

        .organization-logo {
          width: 52px;
          height: 52px;
          flex: 0 0 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid #232a34;
          border-radius: 9px;
          background: #191d23;
          color: #d4d6da;
          font-size: 18px;
          font-weight: 600;
        }

        .organization-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .organization-identity-content {
          min-width: 0;
        }

        .organization-name-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .organization-name-row h2 {
          margin: 0;
          color: #f3f4f6;
          font-size: 16px;
          line-height: 22px;
          font-weight: 600;
          letter-spacing: -0.015em;
        }

        .organization-slug {
          margin: 3px 0 0;
          color: #666b75;
          font-family: monospace;
          font-size: 9px;
          line-height: 14px;
        }

        .organization-description {
          max-width: 720px;
          margin: 10px 0 0;
          color: #8b9099;
          font-size: 11px;
          line-height: 18px;
        }

        .organization-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          height: 22px;
          padding: 0 7px;
          border-radius: 5px;
          font-size: 9px;
          font-weight: 500;
        }

        .organization-status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        .organization-status-active {
          color: #7fb88b;
          background: rgba(127, 184, 139, 0.08);
        }

        .organization-status-suspended {
          color: #c59a62;
          background: rgba(197, 154, 98, 0.08);
        }

        .organization-status-archived {
          color: #777d87;
          background: rgba(119, 125, 135, 0.08);
        }

        .organization-details-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .organization-detail {
          min-width: 0;
          padding: 15px 20px;
          border-bottom: 1px solid #171b21;
        }

        .organization-detail:not(:nth-child(3n + 1)) {
          border-left: 1px solid #171b21;
        }

        .organization-detail-label {
          display: block;
          margin-bottom: 5px;
          color: #555b65;
          font-size: 9px;
          line-height: 13px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .organization-detail-value {
          display: block;
          overflow: hidden;
          color: #c9ccd1;
          font-size: 11px;
          line-height: 16px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .organization-detail-link {
          display: block;
          overflow: hidden;
          color: #b4b7bd;
          font-size: 11px;
          line-height: 16px;
          text-overflow: ellipsis;
          text-decoration: none;
          white-space: nowrap;
        }

        .organization-detail-link:hover {
          color: #f3f4f6;
        }

        @media (max-width: 800px) {
          .organization-details-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .organization-detail:not(:nth-child(3n + 1)) {
            border-left: 0;
          }

          .organization-detail:nth-child(even) {
            border-left: 1px solid #171b21;
          }
        }

        @media (max-width: 560px) {
          .organization-identity {
            padding: 18px 16px;
          }

          .organization-details-grid {
            grid-template-columns: 1fr;
          }

          .organization-detail {
            padding: 13px 16px;
            border-left: 0 !important;
          }
        }


        =============================================
        `}</style>
    </div>
  );
}
