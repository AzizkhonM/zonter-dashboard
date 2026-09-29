"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import PageHeader from "@/components/admin/PageHeader";
import { formatDateTime } from "@/lib/format-date-time";
import {
  organizationTypeOptions,
  cisCountryOptions,
  uzbekistanRegionOptions,
} from "@/lib/organization-options";

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

type OrganizationDetailProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
  valueClassName?: string;
};

function OrganizationDetail({
  label,
  children,
  className = "",
  valueClassName = "",
}: OrganizationDetailProps) {
  return (
    <div className={`organization-detail ${className}`}>
      <span className="organization-detail-label">{label}</span>

      <span className={`organization-detail-value ${valueClassName}`}>
        {children}
      </span>
    </div>
  );
}

export default function OrganizationDetailsPage() {
  const t = useTranslations("Admin.organizationDetails");
  const tCommon = useTranslations("common.organization");

  const params = useParams<{ slug: string }>();
  const locale = useLocale() as "uz" | "en" | "ru";

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoPreviewOpen, setLogoPreviewOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<
    "ACTIVE" | "SUSPENDED" | "ARCHIVED" | null
  >(null);
  const [statusReason, setStatusReason] = useState("");
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!logoPreviewOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [logoPreviewOpen]);

  useEffect(() => {
    if (!actionsOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionsRef.current &&
        !actionsRef.current.contains(event.target as Node)
      ) {
        setActionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [actionsOpen]);

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

  const organizationType = organization
    ? organizationTypeOptions.find((item) => item.value === organization.type)
    : undefined;

  const country = organization
    ? cisCountryOptions.find((item) => item.value === organization.country)
    : undefined;

  const region = organization
    ? uzbekistanRegionOptions.find((item) => item.value === organization.region)
    : undefined;

  const updateOrganizationStatus = async () => {
    if (!pendingStatus || !organization) return;

    try {
      setActionLoading(true);

      const response = await fetch(
        `/api/admin/organizations/${organization.slug}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: pendingStatus,
            reason:
              pendingStatus === "SUSPENDED" || pendingStatus === "ARCHIVED"
                ? statusReason.trim()
                : undefined,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "SERVER_ERROR");
        return;
      }

      setOrganization((current) =>
        current
          ? {
              ...current,
              status: data.organization.status,
              updatedAt: data.organization.updatedAt,
            }
          : current,
      );

      setPendingStatus(null);
      setStatusReason("");
    } catch {
      setError("SERVER_ERROR");
    } finally {
      setActionLoading(false);
    }
  };

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

      <PageHeader
        title={t("title")}
        description={t("description")}
        action={
          !loading && organization ? (
            <div ref={actionsRef} className="organization-actions-wrapper">
              <button
                type="button"
                className="organization-actions"
                onClick={() => setActionsOpen((value) => !value)}
                aria-expanded={actionsOpen}
              >
                <span>{t("actions.label")}</span>

                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {actionsOpen && (
                <div className="organization-actions-menu">
                  {organization.status === "ACTIVE" && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setActionsOpen(false);
                          setPendingStatus("SUSPENDED");
                        }}
                      >
                        {t("actions.suspend")}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActionsOpen(false);
                          setPendingStatus("ARCHIVED");
                        }}
                      >
                        {t("actions.archive")}
                      </button>
                    </>
                  )}

                  {organization.status === "SUSPENDED" && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setActionsOpen(false);
                          setPendingStatus("ACTIVE");
                        }}
                      >
                        {t("actions.restore")}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActionsOpen(false);
                          setPendingStatus("ARCHIVED");
                        }}
                      >
                        {t("actions.archive")}
                      </button>
                    </>
                  )}

                  {organization.status === "ARCHIVED" && (
                    <button
                      type="button"
                      onClick={() => {
                        setActionsOpen(false);
                        setPendingStatus("ACTIVE");
                      }}
                    >
                      {t("actions.restore")}
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : undefined
        }
      />

      {pendingStatus && organization && (
        <div
          className="organization-confirm-modal"
          onClick={() => {
            if (!actionLoading) {
              setPendingStatus(null);
              setStatusReason("");
            }
          }}
        >
          <div
            className="organization-confirm-modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>{t("confirm.title")}</h2>

            <p>{t(`confirm.${pendingStatus.toLowerCase()}`)}</p>

            {(pendingStatus === "SUSPENDED" ||
              pendingStatus === "ARCHIVED") && (
              <textarea
                value={statusReason}
                onChange={(event) => setStatusReason(event.target.value)}
                placeholder={t("confirm.reasonPlaceholder")}
                disabled={actionLoading}
                rows={4}
              />
            )}

            <div className="organization-confirm-modal-actions">
              <button
                type="button"
                onClick={() => {
                  setPendingStatus(null);
                  setStatusReason("");
                }}
                disabled={actionLoading}
              >
                {t("confirm.cancel")}
              </button>

              <button
                type="button"
                onClick={updateOrganizationStatus}
                disabled={
                  actionLoading ||
                  ((pendingStatus === "SUSPENDED" ||
                    pendingStatus === "ARCHIVED") &&
                    !statusReason.trim())
                }
              >
                {actionLoading ? t("confirm.loading") : t("confirm.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

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
            {/* Identity */}
            <div className="organization-identity">
              <div
                className={`organization-logo ${
                  organization.logoUrl ? "organization-logo-clickable" : ""
                }`}
                onClick={() => {
                  if (organization.logoUrl) {
                    setLogoPreviewOpen(true);
                  }
                }}
              >
                {organization.logoUrl ? (
                  <img
                    draggable="false"
                    src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${organization.logoUrl}`}
                    alt={organization.name}
                  />
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

            {/* Details */}
            <div className="organization-details-grid">
              {/* Type */}
              <OrganizationDetail
                label={t("fields.type")}
                className="organization-detail-left"
              >
                {organizationType
                  ? tCommon(`types.${organizationType.translationKey}`)
                  : "—"}
              </OrganizationDetail>

              {/* Country */}
              <OrganizationDetail label={t("fields.country")}>
                {country ? tCommon(`countries.${country.translationKey}`) : "—"}
              </OrganizationDetail>

              {/* Region */}
              <OrganizationDetail
                label={t("fields.region")}
                className="organization-detail-left"
              >
                {region ? tCommon(`regions.${region.translationKey}`) : "—"}
              </OrganizationDetail>

              {/* City / District */}
              <OrganizationDetail label={t("fields.city")}>
                {organization.city || "—"}
              </OrganizationDetail>

              {/* Members */}
              <div className="organization-members">
                <div className="organization-members-header">
                  <div className="organization-members-title">
                    <span className="organization-detail-label">
                      {t("fields.members")}
                    </span>

                    <span className="organization-members-count">
                      {organization._count.members}
                    </span>
                  </div>
                </div>

                <div className="organization-members-list">
                  {organization.members.map((member) => (
                    <div key={member.id} className="organization-member">
                      <div className="organization-member-avatar">
                        {member.user.name?.charAt(0).toUpperCase() || "?"}
                      </div>

                      <div className="organization-member-info">
                        <span className="organization-member-name">
                          {member.user.name || "—"}
                        </span>

                        <span className="organization-member-meta">
                          {member.user.email}
                        </span>
                      </div>

                      <span className="organization-member-role">
                        {member.role}
                      </span>

                      <span
                        className={`organization-member-status ${
                          member.user.isActive
                            ? "organization-member-status-active"
                            : "organization-member-status-inactive"
                        }`}
                      >
                        <span className="organization-member-status-dot" />

                        {member.user.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Affiliated organization */}
              <OrganizationDetail
                label={t("fields.affiliatedOrganization")}
                className="organization-detail-left"
              >
                {organization.affiliatedOrganization || "—"}
              </OrganizationDetail>

              {/* Website */}
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
                    <span>{organization.website}</span>

                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 17L17 7M9 7H17V15"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                ) : (
                  <span className="organization-detail-value">—</span>
                )}
              </div>

              {/* Created */}
              <OrganizationDetail
                label={t("fields.created")}
                className="organization-detail-left"
              >
                {formatDateTime(organization.createdAt, locale)}
              </OrganizationDetail>

              {/* Updated */}
              <OrganizationDetail label={t("fields.updated")}>
                {formatDateTime(organization.updatedAt, locale)}
              </OrganizationDetail>
            </div>
          </section>

          {logoPreviewOpen && organization.logoUrl && (
            <div
              className="organization-logo-modal"
              onClick={() => setLogoPreviewOpen(false)}
            >
              <button
                type="button"
                className="organization-logo-modal-close"
                onClick={() => setLogoPreviewOpen(false)}
                aria-label="Close"
              >
                ×
              </button>

              <img
                src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${organization.logoUrl}`}
                alt={organization.name}
                onClick={(event) => event.stopPropagation()}
              />
            </div>
          )}
        </div>
      )}

      <style>{`
        /* =========================================
           PAGE
        ========================================= */

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


        /* =========================================
           BACK
        ========================================= */

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


        /* =========================================
           STATES
        ========================================= */

        .organization-details-state {
          padding: 32px 0;

          color: #666b75;
          font-size: 11px;
          line-height: 18px;
        }

        .organization-details-error {
          color: #d47777;
        }


        /* =========================================
           ORGANIZATION ACTIONS
        ========================================= */

        .organization-actions-wrapper {
          position: relative;
          user-select: none;
        }

        .organization-actions {
          height: 32px;
          display: inline-flex;
          align-items: center;
          gap: 7px;

          padding: 0 12px;

          border: 1px solid #292f38;
          border-radius: 6px;

          background: #161a20;
          color: #aeb3bb;

          font-size: 11px;
          line-height: 16px;
          font-weight: 500;

          cursor: pointer;

          transition:
            background-color 0.15s ease,
            color 0.15s ease,
            border-color 0.15s ease;
        }

        .organization-actions:hover {
          background: #1b2129;
          border-color: #343b46;
          color: #f3f4f6;
        }

        .organization-actions-menu {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          z-index: 50;

          min-width: 150px;

          padding: 4px;

          border: 1px solid #292f38;
          border-radius: 7px;

          background: #11151b;

          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
        }

        .organization-actions-menu button {
          width: 100%;
          height: 32px;

          padding: 0 9px;

          border: 0;
          border-radius: 5px;

          background: transparent;
          color: #aeb3bb;

          font-size: 11px;
          line-height: 16px;

          text-align: left;
          cursor: pointer;
        }

        .organization-actions-menu button:hover {
          background: #1b2129;
          color: #f3f4f6;
        }

        /* =========================================
           ORGANIZATION
        ========================================= */

        .organization-overview {
          width: 100%;
        }

        .organization-overview-card {
          width: 100%;

          border-top: 1px solid #232831;
          border-bottom: 1px solid #232831;
        }


        /* =========================================
           IDENTITY
        ========================================= */

        .organization-identity {
          display: flex;
          align-items: center;
          gap: 18px;

          padding: 26px 20px 28px;

          border-bottom: 1px solid #1c2026;
        }

        .organization-logo {
          width: 100px;
          height: 100px;
          flex: 0 0 100px;

          display: flex;
          align-items: center;
          justify-content: center;

          overflow: hidden;

          border: 1px solid #292f38;
          border-radius: 10px;

          background: #191d23;

          color: #d4d6da;
          font-size: 22px;
          font-weight: 600;
        }

        .organization-logo img {
          width: 100%;
          height: 100%;

          display: block;

          object-fit: cover;
          user-select: none;
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

          font-size: 26px;
          line-height: 30px;
          font-weight: 600;

          letter-spacing: -0.02em;
        }

        .organization-slug {
          margin: 4px 0 0;

          color: #555b65;

          font-family: monospace;
          font-size: 10px;
          line-height: 15px;
        }

        .organization-description {
          max-width: 700px;

          margin: 9px 0 0;

          color: #858b94;

          font-size: 11px;
          line-height: 18px;
        }


        /* =========================================
           STATUS
        ========================================= */

        .organization-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;

          height: 21px;
          padding: 0 7px;

          border-radius: 5px;

          font-size: 9px;
          font-weight: 500;

          user-select: none;
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


        /* =========================================
           DETAILS GRID
        ========================================= */

        .organization-details-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));
        }

        .organization-detail {
          min-width: 0;

          padding: 17px 20px 18px;

          border-bottom: 1px solid #171b21;
        }

        .organization-detail-left {
          border-right: 1px solid #171b21;
        }

        .organization-detail-label {
          display: block;

          margin-bottom: 8px;

          color: #555b65;

          font-size: 12px;
          line-height: 16px;

          text-transform: uppercase;
          letter-spacing: 0.045em;
        }

        .organization-detail-value {
          display: block;

          overflow: hidden;

          color: #c9ccd1;

          font-size: 16px;
          line-height: 19px;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .organization-detail-number {
          color: #e1e3e6;
          font-family: monospace;
        }

        .organization-detail-mono {
          color: #8b9099;
          font-family: monospace;
          font-size: 10px;
        }


        /* =========================================
           WEBSITE
        ========================================= */

        .organization-detail-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;

          max-width: 100%;

          color: #b7bbc2;

          font-size: 16px;
          line-height: 19px;

          text-decoration: none;
        }

        .organization-detail-link span {
          overflow: hidden;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .organization-detail-link:hover {
          color: #f3f4f6;
        }

        .organization-detail-link svg {
          flex: 0 0 auto;
          color: #666c76;
        }


        /* =========================================
           MEMBERS
        ========================================= */

        .organization-members {
          grid-column: 1 / -1;

          border-bottom: 1px solid #171b21;
        }

        .organization-members-header {
          padding: 17px 20px 14px;
        }

        .organization-members-title {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .organization-members-title
          .organization-detail-label {
          margin-bottom: 0;
        }

        .organization-members-count {
          color: #e1e3e6;

          font-family: monospace;
          font-size: 12px;
          line-height: 14px;
        }

        .organization-members-list {
          display: flex;
          flex-direction: column;
        }

        .organization-member {
          min-height: 62px;

          padding: 11px 20px;

          display: flex;
          align-items: center;
          gap: 12px;

          border-top: 1px solid #171b21;
        }

        .organization-member-avatar {
          width: 34px;
          height: 34px;
          flex: 0 0 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid #292f38;
          border-radius: 8px;

          background: #191d23;

          color: #c9ccd1;

          font-size: 11px;
          font-weight: 600;

          user-select: none;
        }

        .organization-member-info {
          min-width: 0;
          flex: 1;

          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .organization-member-name {
          color: #dfe1e5;

          font-size: 16px;
          line-height: 17px;
        }

        .organization-member-meta {
          overflow: hidden;

          color: #626873;

          font-size: 12px;
          line-height: 14px;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .organization-member-role {
          color: #858b94;

          font-family: monospace;
          font-size: 16px;
          line-height: 14px;

          margin-right: 10px;
          user-select: none;
        }

        .organization-member-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;

          min-width: 58px;

          font-size: 13px;

          user-select: none;
        }

        .organization-member-status-dot {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: currentColor;
        }

        .organization-member-status-active {
          color: #7fb88b;
        }

        .organization-member-status-inactive {
          color: #777d87;
        }


        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 600px) {
          .organization-identity {
            gap: 14px;
            padding: 22px 16px 24px;
          }

          .organization-logo {
            width: 58px;
            height: 58px;
            flex-basis: 58px;

            border-radius: 8px;

            font-size: 19px;
          }

          .organization-detail {
            padding-left: 16px;
            padding-right: 16px;
          }

          .organization-members-header {
            padding-left: 16px;
            padding-right: 16px;
          }

          .organization-member {
            padding-left: 16px;
            padding-right: 16px;
          }
        }


        @media (max-width: 460px) {
          .organization-details-grid {
            grid-template-columns: 1fr;
          }

          .organization-detail-left {
            border-right: 0;
          }

          .organization-name-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }

          .organization-name-row h2 {
            font-size: 20px;
            line-height: 26px;
          }

          .organization-member {
            gap: 9px;
          }

          .organization-member-status {
            display: none;
          }

          .organization-member-role {
            font-size: 8px;
          }
        }

        /* =========================================
           IMG MODAL
        ========================================= */

        .organization-logo-clickable {
          cursor: zoom-in;
        }

        .organization-logo-modal {
          position: fixed;
          inset: 0;
          z-index: 1000;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 32px;

          background: rgba(0, 0, 0, 0.78);
          backdrop-filter: blur(8px);
        }

        .organization-logo-modal img {
          max-width: min(80vw, 720px);
          max-height: 80vh;

          object-fit: contain;

          border: 1px solid #292f38;
          border-radius: 12px;
          background: #11151b;

          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
        }

        .organization-logo-modal-close {
          position: absolute;
          top: 24px;
          right: 24px;

          width: 36px;
          height: 36px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid #292f38;
          border-radius: 8px;

          background: #161a20;
          color: #aeb3bb;

          font-size: 22px;
          line-height: 1;

          cursor: pointer;
        }

        .organization-logo-modal-close:hover {
          color: #f3f4f6;
          background: #1b2129;
        }


        /* =========================================
           ORG ACTIONS MODAL
        ========================================= */

        .organization-confirm-modal {
          position: fixed;
          inset: 0;
          z-index: 1000;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 24px;

          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(6px);
        }

        .organization-confirm-modal-content {
          width: min(100%, 380px);

          padding: 20px;

          border: 1px solid #292f38;
          border-radius: 10px;

          background: #11151b;

          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
        }

        .organization-confirm-modal-content h2 {
          margin: 0;

          color: #f3f4f6;

          font-size: 15px;
          line-height: 22px;
          font-weight: 600;
        }

        .organization-confirm-modal-content p {
          margin: 8px 0 0;

          color: #777d87;

          font-size: 11px;
          line-height: 17px;
        }

        .organization-confirm-modal-content textarea {
          min-height: 100px;
          width: 100%;

          margin-top: 8px;

          background: #11151B;
          border: 1px solid #232A34;
          border-radius: 8px;

          color: #F3F4F6;
          font-family: inherit;
          font-size: 12px;
          line-height: 18px;

          resize: vertical;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .organization-confirm-modal-content textarea::placeholder {
          color: #555B65;
        }

        .organization-confirm-modal-content textarea:focus {
          border-color: #F97316;
        }

        .organization-confirm-modal-content textarea:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .organization-confirm-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;

          margin-top: 20px;
        }

        .organization-confirm-modal-actions button {
          height: 32px;

          padding: 0 12px;

          border: 1px solid #292f38;
          border-radius: 6px;

          background: #161a20;
          color: #aeb3bb;

          font-size: 11px;
          line-height: 16px;
          font-weight: 500;

          cursor: pointer;
          transition:
            background-color 0.15s ease,
            color 0.15s ease,
            border-color 0.15s ease;
        }

        .organization-confirm-modal-actions button:hover:not(:disabled) {
          background: #1b2129;
          border-color: #343b46;
          color: #f3f4f6;
        }

        .organization-confirm-modal-actions button:last-child {
          background: #f97316;
          border-color: #f97316;
          color: #ffffff;
        }

        .organization-confirm-modal-actions button:last-child:hover:not(:disabled) {
          background: #ea6c0a;
          border-color: #ea6c0a;
        }

        .organization-confirm-modal-actions button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 460px) {
          .organization-confirm-modal {
            padding: 16px;
          }

          .organization-confirm-modal-content {
            padding: 18px;
          }
        }
      `}</style>
    </div>
  );
}
