"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { organizationTypeOptions } from "@/lib/organization-options";
import Filter from "@/components/admin/Filter";
import PageHeader from "@/components/admin/PageHeader";
import { Link } from "@/i18n/navigation";
import { formatDateTime } from "@/lib/format-date-time";

type OrganizationStatus = "ACTIVE" | "SUSPENDED" | "ARCHIVED";

type Organization = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  type: string;
  status: OrganizationStatus;
  affiliatedOrganization: string | null;
  website: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  _count: {
    members: number;
  };
};

type SortColumn =
  "organization" | "type" | "owner" | "members" | "status" | "created";

type SortDirection = "asc" | "desc";

export default function OrganizationsPage() {
  const t = useTranslations("Admin.organizations");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeFilter, setActiveFilter] = useState<"ALL" | OrganizationStatus>(
    "ALL",
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortColumn, setSortColumn] = useState<SortColumn>("created");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  useEffect(() => {
    async function loadOrganizations() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/admin/organizations");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to load organizations.");
        }

        setOrganizations(data.organizations);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load organizations.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrganizations();
  }, []);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortColumn(column);
    setSortDirection(column === "created" ? "desc" : "asc");
  };

  const getOrganizationTypeLabel = (type: string) => {
    const option = organizationTypeOptions.find((item) => item.value === type);

    return option
      ? tCommon(`organization.types.${option.translationKey}`)
      : type;
  };

  const getStatusLabel = (status: OrganizationStatus) => {
    return t(`status.${status.toLowerCase()}`);
  };

  const filteredOrganizations =
    activeFilter === "ALL"
      ? organizations
      : organizations.filter(
          (organization) => organization.status === activeFilter,
        );

  const sortedOrganizations = [...filteredOrganizations].sort((a, b) => {
    let comparison = 0;

    switch (sortColumn) {
      case "organization":
        comparison = a.name.localeCompare(b.name, locale, {
          sensitivity: "base",
        });
        break;

      case "type":
        comparison = getOrganizationTypeLabel(a.type).localeCompare(
          getOrganizationTypeLabel(b.type),
          locale,
          { sensitivity: "base" },
        );
        break;

      case "owner":
        comparison = (
          a.owner?.name ||
          a.owner?.email ||
          t("values.unnamedOwner")
        ).localeCompare(
          b.owner?.name || b.owner?.email || t("values.unnamedOwner"),
          locale,
          { sensitivity: "base" },
        );
        break;

      case "members":
        comparison = a._count.members - b._count.members;
        break;

      case "status":
        comparison = getStatusLabel(a.status).localeCompare(
          getStatusLabel(b.status),
          locale,
          { sensitivity: "base" },
        );
        break;

      case "created":
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  return (
    <div className="organizations-page">
      <PageHeader title={t("title")} description={t("description")} />

      <Filter
        value={activeFilter}
        onChange={setActiveFilter}
        options={[
          { value: "ALL", label: t("filters.all") },
          { value: "ACTIVE", label: t("status.active") },
          { value: "SUSPENDED", label: t("status.suspended") },
          { value: "ARCHIVED", label: t("status.archived") },
        ]}
      />

      <div className="organizations-table-wrapper">
        <table className="organizations-table">
          <thead>
            <tr>
              {[
                ["organization", t("columns.organization")],
                ["type", t("columns.type")],
                ["owner", t("columns.owner")],
                ["members", t("columns.members")],
                ["status", t("columns.status")],
                ["created", t("columns.created")],
              ].map(([column, label]) => (
                <th key={column}>
                  <button
                    type="button"
                    className="organizations-table-heading"
                    onClick={() => handleSort(column as SortColumn)}
                  >
                    <span>{label}</span>

                    <span className="organizations-sort-icon">
                      {sortColumn === column
                        ? sortDirection === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </span>
                  </button>
                </th>
              ))}

              <th>
                <span className="organizations-table-heading static">
                  {t("columns.actions")}
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="organizations-empty">
                  {t("loading")}
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={7}
                  className="organizations-empty organizations-error"
                >
                  {error}
                </td>
              </tr>
            ) : sortedOrganizations.length === 0 ? (
              <tr>
                <td colSpan={7} className="organizations-empty">
                  {t("empty")}
                </td>
              </tr>
            ) : (
              sortedOrganizations.map((organization) => (
                <tr key={organization.id}>
                  <td>
                    <div className="organizations-organization">
                      <div className="organizations-avatar">
                        {organization.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="organizations-organization-content">
                        <span className="organizations-organization-name">
                          {organization.name}
                        </span>

                        <span className="organizations-organization-id">
                          #{organization.id.slice(-6)}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="organizations-type">
                      {getOrganizationTypeLabel(organization.type)}
                    </span>
                  </td>

                  <td>
                    <div className="organizations-owner">
                      <span className="organizations-owner-name">
                        {organization.owner?.name || t("values.unnamedOwner")}
                      </span>

                      <span className="organizations-owner-email">
                        {organization.owner?.email || "—"}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span className="organizations-members">
                      {organization._count.members}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`organizations-status organizations-status-${organization.status.toLowerCase()}`}
                    >
                      <span className="organizations-status-dot" />
                      <span>{getStatusLabel(organization.status)}</span>
                    </span>
                  </td>

                  <td>
                    <span className="organizations-date">
                      {formatDateTime(organization.createdAt, locale)}
                    </span>
                  </td>

                  <td>
                    <Link
                      href={`/admin/organizations/${organization.slug}`}
                      className="organizations-details"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {t("actions.details")}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .organizations-page {
          width: 100%;
          min-height: calc(100dvh - 56px);
          padding-top: 28px;
          padding-bottom: 48px;
          box-sizing: border-box;
        }

        /* ========================================
           HEADER
        ======================================== */

        .organizations-page-header {
          margin-bottom: 24px;
        }

        .organizations-page-header h1 {
          margin: 0;

          color: #f3f4f6;

          font-size: 24px;
          line-height: 32px;
          font-weight: 600;

          letter-spacing: -0.025em;
        }

        .organizations-page-header p {
          margin: 6px 0 0;

          color: #666b75;

          font-size: 12px;
          line-height: 18px;
        }

        /* ========================================
           TABLE
        ======================================== */

        .organizations-table-wrapper {
          width: 100%;

          overflow-x: auto;

          scrollbar-width: thin;
          scrollbar-color: #242a32 transparent;
        }

        .organizations-table-wrapper::-webkit-scrollbar {
          height: 5px;
        }

        .organizations-table-wrapper::-webkit-scrollbar-track {
          background: transparent;
        }

        .organizations-table-wrapper::-webkit-scrollbar-thumb {
          background: #242a32;
          border-radius: 999px;
        }

        .organizations-table {
          width: 100%;
          min-width: 940px;

          border-collapse: collapse;
          border-spacing: 0;

          table-layout: fixed;
        }

        .organizations-table th,
        .organizations-table td {
          text-align: left;
        }

        /* ========================================
           COLUMN WIDTHS
        ======================================== */

        .organizations-table th:nth-child(1),
        .organizations-table td:nth-child(1) {
          width: 25%;
        }

        .organizations-table th:nth-child(2),
        .organizations-table td:nth-child(2) {
          width: 13%;
        }

        .organizations-table th:nth-child(3),
        .organizations-table td:nth-child(3) {
          width: 22%;
        }

        .organizations-table th:nth-child(4),
        .organizations-table td:nth-child(4) {
          width: 7%;
        }

        .organizations-table th:nth-child(5),
        .organizations-table td:nth-child(5) {
          width: 10%;
        }

        .organizations-table th:nth-child(6),
        .organizations-table td:nth-child(6) {
          width: 15%;
        }

        .organizations-table th:nth-child(7),
        .organizations-table td:nth-child(7) {
          width: 8%;
        }

        /* ========================================
           TABLE HEAD
        ======================================== */

        .organizations-table thead th {
          height: 42px;

          padding: 0 16px;

          border-bottom: 1px solid #1c2026;

          color: #626872;

          font-size: 10px;
          line-height: 14px;
          font-weight: 500;

          text-align: left;

          white-space: nowrap;
        }

        .organizations-table-heading {
          display: inline-flex;
          align-items: center;
          justify-content: flex-start;

          gap: 6px;

          padding: 0;

          border: 0;

          background: transparent;

          color: inherit;

          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
          font-weight: inherit;

          cursor: pointer;
        }

        .organizations-table-heading:hover {
          color: #d4d4d8;
        }

        .organizations-table-heading.static {
          cursor: default;
        }

        .organizations-sort-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          width: 10px;
          height: 12px;

          color: #444a53;

          font-size: 10px;
          line-height: 1;

          transition: color 0.15s ease;
        }

        .organizations-table-heading:hover .organizations-sort-icon {
          color: #707680;
        }

        /* ========================================
           TABLE BODY
        ======================================== */

        .organizations-table tbody td {
          height: 76px;

          padding: 14px 16px;

          border-bottom: 1px solid #171b21;

          color: #a1a1aa;

          font-size: 11px;
          line-height: 16px;

          vertical-align: middle;

          text-align: left;
        }

        .organizations-table tbody tr {
          transition: background-color 0.15s ease;
        }

        .organizations-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.012);
        }

        .organizations-table tbody tr:last-child td {
          border-bottom: 0;
        }

        /* ========================================
           ORGANIZATION
        ======================================== */

        .organizations-organization {
          display: flex;
          align-items: center;

          gap: 12px;

          min-width: 0;
        }

        .organizations-avatar {
          display: flex;
          align-items: center;
          justify-content: center;

          width: 36px;
          height: 36px;

          flex: 0 0 36px;

          border: 1px solid #292f38;
          border-radius: 8px;

          background: #14181e;

          color: #d4d4d8;

          font-size: 12px;
          font-weight: 600;
        }

        .organizations-organization-content {
          display: flex;
          flex-direction: column;

          min-width: 0;

          gap: 3px;
        }

        .organizations-organization-name {
          overflow: hidden;

          color: #e4e4e7;

          font-size: 12px;
          line-height: 17px;
          font-weight: 550;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .organizations-organization-id {
          color: #4f555f;

          font-family: monospace;

          font-size: 9px;
          line-height: 12px;
        }

        /* ========================================
           TYPE
        ======================================== */

        .organizations-type {
          color: #858b95;

          font-size: 10px;
          font-weight: 450;

          white-space: nowrap;
        }

        /* ========================================
           OWNER
        ======================================== */

        .organizations-owner {
          display: flex;
          flex-direction: column;

          gap: 3px;

          min-width: 0;
        }

        .organizations-owner-name {
          overflow: hidden;

          color: #c8c9cc;

          font-size: 11px;
          line-height: 15px;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .organizations-owner-email {
          overflow: hidden;

          color: #555b65;

          font-size: 10px;
          line-height: 14px;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ========================================
           MEMBERS
        ======================================== */

        .organizations-members {
          color: #a1a1aa;

          font-size: 11px;
          line-height: 16px;

          font-variant-numeric: tabular-nums;
        }

        /* ========================================
           STATUS
        ======================================== */

        .organizations-status {
          display: inline-flex;
          align-items: center;

          gap: 7px;

          color: #858b95;

          font-size: 10px;
          font-weight: 500;

          white-space: nowrap;
        }

        .organizations-status-dot {
          width: 6px;
          height: 6px;

          flex: 0 0 6px;

          border-radius: 50%;

          background: #71717a;
        }

        .organizations-status-active .organizations-status-dot {
          background: #6b8f71;
        }

        .organizations-status-suspended .organizations-status-dot {
          background: #c18a4a;
        }

        .organizations-status-archived {
          color: #626872;
        }

        .organizations-status-archived .organizations-status-dot {
          background: #4f545d;
        }

        /* ========================================
           CREATED
        ======================================== */

        .organizations-date {
          color: #737984;

          font-size: 10px;

          white-space: nowrap;
        }

        /* ========================================
           DETAILS
        ======================================== */

        .organizations-details {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          height: 32px;

          padding: 0 13px;

          border: 1px solid #292f38;
          border-radius: 6px;

          background: #15191f;

          color: #a1a1aa;

          font-family: inherit;
          font-size: 10px;
          line-height: 14px;
          font-weight: 500;

          text-decoration: none;

          white-space: nowrap;

          transition:
            color 0.15s ease,
            background-color 0.15s ease,
            border-color 0.15s ease;
        }

        .organizations-details:hover {
          border-color: #343943;

          background: #1a1f26;

          color: #f97316;
        }

        /* ========================================
           LOADING
        ======================================== */

        .organizations-loading {
          display: flex;
          align-items: center;
          justify-content: center;

          min-height: 220px;

          color: #4f555f;

          font-size: 11px;
          line-height: 16px;
        }

        /* ========================================
           ERROR
        ======================================== */

        .organizations-error {
          padding: 14px 16px;

          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 7px;

          background: rgba(239, 68, 68, 0.04);

          color: #8f5555;

          font-size: 11px;
          line-height: 16px;
        }

        /* ========================================
           EMPTY
        ======================================== */

        .organizations-empty {
        height: 220px !important;

        padding: 0 20px !important;

        border-bottom: 0 !important;

        color: #4f555f !important;

        font-size: 11px !important;

        text-align: center !important;
        }

        /* ========================================
           RESPONSIVE
        ======================================== */

        @media (max-width: 900px) {
          .organizations-table {
            min-width: 900px;
          }
        }

        @media (max-width: 700px) {
          .organizations-page {
            padding-top: 20px;
          }

          .organizations-page-header h1 {
            font-size: 21px;
            line-height: 28px;
          }

          .organizations-page-header p {
            font-size: 11px;
          }

          .organizations-filters {
            max-width: 100%;

            overflow-x: auto;

            scrollbar-width: none;
          }

          .organizations-filters::-webkit-scrollbar {
            display: none;
          }

          .organizations-filter {
            flex: 0 0 auto;
          }

          .organizations-table {
            min-width: 900px;
          }
        }
      `}</style>
    </div>
  );
}
