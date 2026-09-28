"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  organizationTypeOptions,
  cisCountryOptions,
  uzbekistanRegionOptions,
} from "@/lib/organization-options";
import { toast } from "sonner";

type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";

type OrganizationRequest = {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  type: string;
  affiliatedOrganization: string | null;
  website: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  reason: string | null;
  status: RequestStatus;
  reviewedById: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};

type SortColumn = "organization" | "type" | "user" | "status" | "created";

type SortDirection = "asc" | "desc";

export default function OrganizationRequestsPage() {
  const t = useTranslations("Admin.organizationRequests");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [requests, setRequests] = useState<OrganizationRequest[]>([]);
  const [activeFilter, setActiveFilter] = useState<"ALL" | RequestStatus>(
    "ALL",
  );
  const [selectedRequest, setSelectedRequest] =
    useState<OrganizationRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>("created");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const [showApproveConfirmation, setShowApproveConfirmation] = useState(false);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/admin/organization-requests");

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Failed to load organization requests.",
          );
        }

        setRequests(data.requests);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load organization requests.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortColumn(column);

    setSortDirection(column === "created" ? "desc" : "asc");
  };

  const handleReject = async () => {
    if (!selectedRequest || !reviewNote.trim()) {
      return;
    }

    setRejecting(true);

    try {
      const response = await fetch(
        `/api/admin/organization-requests/${selectedRequest.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "reject",
            reviewNote: reviewNote.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to reject organization request.");
      }

      const updatedRequest: OrganizationRequest = {
        ...selectedRequest,
        status: "REJECTED",
        reviewNote: reviewNote.trim(),
        reviewedAt: new Date().toISOString(),
      };

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === selectedRequest.id ? updatedRequest : request,
        ),
      );

      setSelectedRequest(updatedRequest);
      setShowRejectForm(false);
      setReviewNote("");

      toast.success(t("toast.rejectSuccess"));
    } catch (error) {
      console.error("Reject organization request failed:", error);

      toast.error(
        error instanceof Error ? error.message : t("toast.rejectError"),
      );
    } finally {
      setRejecting(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedRequest) {
      return;
    }

    setApproving(true);

    try {
      const response = await fetch(
        `/api/admin/organization-requests/${selectedRequest.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "approve",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Failed to approve organization request.",
        );
      }

      const updatedRequest: OrganizationRequest = {
        ...selectedRequest,
        status: "APPROVED",
        reviewedAt: new Date().toISOString(),
      };

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === selectedRequest.id ? updatedRequest : request,
        ),
      );

      setSelectedRequest(updatedRequest);
      setShowApproveConfirmation(false);

      toast.success(t("toast.approveSuccess"));
    } catch (error) {
      console.error("Approve organization request failed:", error);

      toast.error(
        error instanceof Error ? error.message : t("toast.approveError"),
      );
    } finally {
      setApproving(false);
    }
  };

  const getOrganizationTypeLabel = (type: string) => {
    const option = organizationTypeOptions.find((item) => item.value === type);

    return option
      ? tCommon(`organization.types.${option.translationKey}`)
      : type;
  };

  const getCountryLabel = (country: string | null) => {
    if (!country) return "—";

    const option = cisCountryOptions.find((item) => item.value === country);

    return option
      ? tCommon(`organization.countries.${option.translationKey}`)
      : country;
  };

  const getRegionLabel = (region: string | null) => {
    if (!region) return "—";

    const option = uzbekistanRegionOptions.find(
      (item) => item.value === region,
    );

    return option
      ? tCommon(`organization.regions.${option.translationKey}`)
      : region;
  };

  const formatDateTime = (date: string) => {
    const value = new Date(date);

    if (locale === "uz") {
      const parts = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Tashkent",
      }).formatToParts(value);

      const get = (type: string) =>
        parts.find((part) => part.type === type)?.value ?? "";

      return `${get("day")}.${get("month")}.${get("year")}, ${get("hour")}:${get("minute")} UTC+5`;
    }

    return (
      new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: locale === "en",
        timeZone: "Asia/Tashkent",
      }).format(value) + " UTC+5"
    );
  };

  const filteredRequests =
    activeFilter === "ALL"
      ? requests
      : requests.filter((request) => request.status === activeFilter);

  const sortedRequests = [...filteredRequests].sort((a, b) => {
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

      case "user":
        comparison = (a.user.name || t("values.unnamedUser")).localeCompare(
          b.user.name || t("values.unnamedUser"),
          locale,
          { sensitivity: "base" },
        );
        break;

      case "status":
        comparison = t(`status.${a.status.toLowerCase()}`).localeCompare(
          t(`status.${b.status.toLowerCase()}`),
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
    <section className="organization-requests-page">
      {/* Header */}
      <header className="organization-requests-header">
        <div>
          <h1>{t("title")}</h1>

          <p>{t("description")}</p>
        </div>
      </header>

      {/* Filters */}
      <div className="organization-requests-filters">
        <button
          type="button"
          className={`organization-requests-filter ${
            activeFilter === "ALL" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("ALL")}
        >
          {t("filters.all")}
        </button>

        <button
          type="button"
          className={`organization-requests-filter ${
            activeFilter === "PENDING" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("PENDING")}
        >
          {t("filters.pending")}
        </button>

        <button
          type="button"
          className={`organization-requests-filter ${
            activeFilter === "APPROVED" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("APPROVED")}
        >
          {t("filters.approved")}
        </button>

        <button
          type="button"
          className={`organization-requests-filter ${
            activeFilter === "REJECTED" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("REJECTED")}
        >
          {t("filters.rejected")}
        </button>
      </div>

      {/* Table */}
      <div className="organization-requests-table-wrapper">
        <table className="organization-requests-table">
          <thead>
            <tr>
              <th>
                <button
                  type="button"
                  className="request-table-heading"
                  onClick={() => handleSort("organization")}
                >
                  <span>{t("table.organization")}</span>

                  <span className="request-table-heading-arrow">
                    {sortColumn === "organization"
                      ? sortDirection === "asc"
                        ? "↑"
                        : "↓"
                      : "↓"}
                  </span>
                </button>
              </th>

              <th>
                <button
                  type="button"
                  className="request-table-heading"
                  onClick={() => handleSort("type")}
                >
                  <span>{t("table.type")}</span>

                  <span className="request-table-heading-arrow">
                    {sortColumn === "type"
                      ? sortDirection === "asc"
                        ? "↑"
                        : "↓"
                      : "↓"}
                  </span>
                </button>
              </th>

              <th>
                <button
                  type="button"
                  className="request-table-heading"
                  onClick={() => handleSort("user")}
                >
                  <span>{t("table.user")}</span>

                  <span className="request-table-heading-arrow">
                    {sortColumn === "user"
                      ? sortDirection === "asc"
                        ? "↑"
                        : "↓"
                      : "↓"}
                  </span>
                </button>
              </th>

              <th>
                <button
                  type="button"
                  className="request-table-heading"
                  onClick={() => handleSort("status")}
                >
                  <span>{t("table.status")}</span>

                  <span className="request-table-heading-arrow">
                    {sortColumn === "status"
                      ? sortDirection === "asc"
                        ? "↑"
                        : "↓"
                      : "↓"}
                  </span>
                </button>
              </th>

              <th>
                <button
                  type="button"
                  className="request-table-heading"
                  onClick={() => handleSort("created")}
                >
                  <span>{t("table.created")}</span>

                  <span className="request-table-heading-arrow">
                    {sortColumn === "created"
                      ? sortDirection === "asc"
                        ? "↑"
                        : "↓"
                      : "↓"}
                  </span>
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="organization-requests-empty">
                  {t("states.loading")}
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={5}
                  className="organization-requests-empty organization-requests-error"
                >
                  {error}
                </td>
              </tr>
            ) : filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={5} className="organization-requests-empty">
                  {t("states.empty")}
                </td>
              </tr>
            ) : (
              sortedRequests.map((request) => (
                <tr
                  key={request.id}
                  className="organization-request-row"
                  onClick={() => setSelectedRequest(request)}
                >
                  {/* Organization */}
                  <td>
                    <div className="request-organization">
                      <div className="request-organization-avatar">
                        {request.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="request-organization-content">
                        <span className="request-organization-name">
                          {request.name}
                        </span>

                        <span className="request-organization-id">
                          #{request.id.slice(-6)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td>
                    <span className="request-type">
                      {getOrganizationTypeLabel(request.type)}
                    </span>
                  </td>

                  {/* User */}
                  <td>
                    <div className="request-user">
                      <span className="request-user-name">
                        {request.user.name || t("values.unnamedUser")}
                      </span>

                      <span className="request-user-email">
                        {request.user.email}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`request-status request-status-${request.status.toLowerCase()}`}
                    >
                      <span className="request-status-dot" />
                      <span>{t(`status.${request.status.toLowerCase()}`)}</span>
                    </span>
                  </td>

                  {/* Created */}
                  <td>
                    <span className="request-date">
                      {formatDateTime(request.createdAt)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <div
          className="request-modal-backdrop"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="request-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="request-modal-header">
              <div>
                <h2>{selectedRequest.name}</h2>

                <span className="request-modal-id">#{selectedRequest.id}</span>
              </div>

              <button
                type="button"
                className="request-modal-close"
                onClick={() => setSelectedRequest(null)}
                aria-label={t("modal.close")}
              >
                ×
              </button>
            </div>

            <div className="request-modal-body">
              {/* Organization */}
              <section className="request-detail-section">
                <h3>{t("sections.organization")}</h3>

                <div className="request-detail-grid">
                  <div className="request-detail-item">
                    <span>{t("fields.name")}</span>
                    <strong>{selectedRequest.name}</strong>
                  </div>

                  <div className="request-detail-item">
                    <span>{t("fields.type")}</span>
                    <strong>
                      {getOrganizationTypeLabel(selectedRequest.type)}
                    </strong>
                  </div>

                  <div className="request-detail-item">
                    <span>{t("fields.status")}</span>

                    <span
                      className={`request-status request-status-${selectedRequest.status.toLowerCase()}`}
                    >
                      <span className="request-status-dot" />
                      {t(`status.${selectedRequest.status.toLowerCase()}`)}
                    </span>
                  </div>

                  <div className="request-detail-item">
                    <span>{t("fields.created")}</span>
                    <strong>{formatDateTime(selectedRequest.createdAt)}</strong>
                  </div>
                </div>
              </section>

              {/* Description */}
              {selectedRequest.description && (
                <section className="request-detail-section">
                  <h3>{t("sections.description")}</h3>

                  <p className="request-detail-text">
                    {selectedRequest.description}
                  </p>
                </section>
              )}

              {/* User */}
              <section className="request-detail-section">
                <h3>{t("sections.submittedBy")}</h3>

                <div className="request-detail-user">
                  <div className="request-detail-user-avatar">
                    {(selectedRequest.user.name || selectedRequest.user.email)
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>
                      {selectedRequest.user.name || t("values.unnamedUser")}
                    </strong>

                    <span>{selectedRequest.user.email}</span>
                  </div>
                </div>
              </section>

              {/* Location */}
              <section className="request-detail-section">
                <h3>{t("sections.location")}</h3>

                <div className="request-detail-grid">
                  <div className="request-detail-item">
                    <span>{t("fields.country")}</span>
                    <strong>{getCountryLabel(selectedRequest.country)}</strong>
                  </div>

                  <div className="request-detail-item">
                    <span>{t("fields.region")}</span>
                    <strong>{getRegionLabel(selectedRequest.region)}</strong>
                  </div>

                  <div className="request-detail-item">
                    <span>{t("fields.city")}</span>
                    <strong>{selectedRequest.city || "—"}</strong>
                  </div>
                </div>
              </section>

              {/* Additional */}
              <section className="request-detail-section">
                <h3>{t("sections.additionalInformation")}</h3>

                <div className="request-detail-grid">
                  <div className="request-detail-item">
                    <span>{t("fields.affiliatedOrganization")}</span>
                    <strong>
                      {selectedRequest.affiliatedOrganization || "—"}
                    </strong>
                  </div>

                  <div className="request-detail-item">
                    <span>{t("fields.website")}</span>

                    {selectedRequest.website ? (
                      <a
                        href={selectedRequest.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="request-detail-link"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {selectedRequest.website}
                      </a>
                    ) : (
                      <strong>—</strong>
                    )}
                  </div>
                </div>
              </section>

              {/* Reason */}
              {selectedRequest.reason && (
                <section className="request-detail-section">
                  <h3>{t("sections.reason")}</h3>

                  <p className="request-detail-text">
                    {selectedRequest.reason}
                  </p>
                </section>
              )}

              {/* Review */}
              {selectedRequest.status !== "PENDING" &&
                selectedRequest.reviewNote && (
                  <section className="request-detail-section">
                    <h3>{t("sections.reviewNote")}</h3>

                    <p className="request-detail-text">
                      {selectedRequest.reviewNote}
                    </p>
                  </section>
                )}

              {showRejectForm && (
                <div className="request-reject-form">
                  <div className="request-reject-form-header">
                    <h3>{t("reject.title")}</h3>
                    <p>{t("reject.description")}</p>
                  </div>

                  <textarea
                    value={reviewNote}
                    onChange={(event) => setReviewNote(event.target.value)}
                    placeholder={t("reject.placeholder")}
                    rows={4}
                  />

                  <div className="request-reject-form-actions">
                    <button
                      type="button"
                      className="request-modal-secondary"
                      onClick={() => {
                        setShowRejectForm(false);
                        setReviewNote("");
                      }}
                    >
                      {t("modal.close")}
                    </button>

                    <button
                      type="button"
                      className="request-modal-reject"
                      onClick={handleReject}
                      disabled={!reviewNote.trim() || rejecting}
                    >
                      {rejecting ? t("actions.rejecting") : t("actions.reject")}
                    </button>
                  </div>
                </div>
              )}

              {showApproveConfirmation && (
                <div className="request-approve-confirmation">
                  <div className="request-approve-confirmation-header">
                    <h3>{t("approve.title")}</h3>
                    <p>{t("approve.description")}</p>
                  </div>

                  <div className="request-approve-confirmation-actions">
                    <button
                      type="button"
                      className="request-modal-secondary"
                      onClick={() => setShowApproveConfirmation(false)}
                    >
                      {t("approve.cancel")}
                    </button>

                    <button
                      type="button"
                      className="request-modal-approve"
                      onClick={handleApprove}
                      disabled={approving}
                    >
                      {approving
                        ? t("actions.approving")
                        : t("actions.approve")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="request-modal-footer">
              {selectedRequest.status === "PENDING" && (
                <div className="request-modal-actions">
                  <button
                    type="button"
                    className="request-modal-reject"
                    onClick={() => setShowRejectForm(true)}
                    disabled={showRejectForm || showApproveConfirmation}
                  >
                    {t("actions.reject")}
                  </button>

                  <button
                    type="button"
                    className="request-modal-approve"
                    onClick={() => setShowApproveConfirmation(true)}
                    disabled={showRejectForm || showApproveConfirmation}
                  >
                    {t("actions.approve")}
                  </button>
                </div>
              )}

              <button
                type="button"
                className="request-modal-secondary"
                onClick={() => setSelectedRequest(null)}
              >
                {t("modal.close")}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .organization-requests-page {
          width: 100%;
          min-height: calc(100dvh - 56px);
          padding-top: 28px;
          padding-bottom: 48px;
          box-sizing: border-box;
        }

        /* ========================================
           HEADER
        ======================================== */

        .organization-requests-header {
          margin-bottom: 24px;
        }

        .organization-requests-header h1 {
          margin: 0;

          color: #f3f4f6;

          font-size: 24px;
          line-height: 32px;
          font-weight: 600;

          letter-spacing: -0.025em;
        }

        .organization-requests-header p {
          margin: 6px 0 0;

          color: #666b75;

          font-size: 12px;
          line-height: 18px;
        }

        /* ========================================
           FILTERS
        ======================================== */

        .organization-requests-filters {
          display: flex;
          align-items: center;

          gap: 2px;

          width: fit-content;

          margin-bottom: 22px;
          padding: 3px;

          border: 1px solid #1d2229;
          border-radius: 7px;

          background: #0d1014;
        }

        .organization-requests-filter {
          height: 29px;

          padding: 0 11px;

          border: 0;
          border-radius: 5px;

          background: transparent;

          color: #666b75;

          font-family: inherit;
          font-size: 11px;
          font-weight: 500;

          cursor: pointer;

          transition:
            color 0.15s ease,
            background-color 0.15s ease;
        }

        .organization-requests-filter:hover {
          color: #b4b7bd;
        }

        .organization-requests-filter.active {
          background: #191d23;
          color: #e4e4e7;
        }

        /* ========================================
           TABLE
        ======================================== */

        .organization-requests-table-wrapper {
          width: 100%;

          overflow-x: auto;

          scrollbar-width: thin;
          scrollbar-color: #242a32 transparent;
        }

        .organization-requests-table {
          width: 100%;
          min-width: 820px;

          border-collapse: collapse;
          border-spacing: 0;

          table-layout: fixed;
        }

        /*
          Column proportions:
          Organization  30%
          Type          15%
          User          25%
          Status        15%
          Created       15%
        */

        .organization-requests-table th:nth-child(1),
        .organization-requests-table td:nth-child(1) {
          width: 30%;
        }

        .organization-requests-table th:nth-child(2),
        .organization-requests-table td:nth-child(2) {
          width: 15%;
        }

        .organization-requests-table th:nth-child(3),
        .organization-requests-table td:nth-child(3) {
          width: 25%;
        }

        .organization-requests-table th:nth-child(4),
        .organization-requests-table td:nth-child(4) {
          width: 15%;
        }

        .organization-requests-table th:nth-child(5),
        .organization-requests-table td:nth-child(5) {
          width: 15%;
        }

        /* ========================================
           TABLE HEAD
        ======================================== */

        .organization-requests-table thead th {
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

        .request-table-heading {
          display: inline-flex;
          align-items: center;
          justify-content: flex-start;
          gap: 6px;
          padding: 0;
          border: 0;
          background: transparent;
          color: inherit;
          font: inherit;
          cursor: pointer;
        }

        .request-table-heading:hover {
          color: #d4d4d8;
        }

        .request-table-heading-arrow {
          font-size: 10px;
          line-height: 1;
          color: #555b65;
        }

        /*
          First column remains left aligned.
          Other column headers are centered.
        */

        .organization-requests-table
          th:first-child
          .request-table-heading {
          justify-content: flex-start;
        }

        .organization-requests-table th,
        .organization-requests-table td {
          text-align: left;
        }

        .request-table-heading-arrow {
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

        .organization-requests-table th:hover
          .request-table-heading-arrow {
          color: #707680;
        }

        .organization-request-row {
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        /* ========================================
           TABLE BODY
        ======================================== */

        .organization-requests-table tbody td {
          height: 76px;

          padding: 14px 16px;

          border-bottom: 1px solid #171b21;

          color: #a1a1aa;

          font-size: 11px;
          line-height: 16px;

          vertical-align: middle;
          text-align: left;

        }

        .organization-request-row {
          transition: background-color 0.15s ease;
        }

        .organization-request-row:hover {
          background: rgba(255, 255, 255, 0.012);
        }

        .organization-requests-table tbody tr:last-child td {
          border-bottom: 0;
        }

        /* ========================================
           ORGANIZATION
        ======================================== */

        .request-organization {
          display: flex;
          align-items: center;

          gap: 12px;

          min-width: 0;
        }

        .request-organization-avatar {
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

        .request-organization-content {
          display: flex;
          flex-direction: column;

          min-width: 0;

          gap: 3px;
        }

        .request-organization-name {
          overflow: hidden;

          color: #e4e4e7;

          font-size: 12px;
          line-height: 17px;
          font-weight: 550;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .request-organization-id {
          color: #4f555f;

          font-family: monospace;
          font-size: 9px;
          line-height: 12px;
        }

        /* ========================================
           TYPE
        ======================================== */

        .request-type {
          color: #858b95;

          font-size: 10px;
          font-weight: 450;

          white-space: nowrap;
        }

        /* ========================================
           USER
        ======================================== */

        .request-user {
          display: flex;
          flex-direction: column;

          gap: 3px;

          min-width: 0;
        }

        .request-user-name {
          overflow: hidden;

          color: #c8c9cc;

          font-size: 11px;
          line-height: 15px;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .request-user-email {
          overflow: hidden;

          color: #555b65;

          font-size: 10px;
          line-height: 14px;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ========================================
           STATUS
        ======================================== */

        .request-status {
          display: inline-flex;
          align-items: center;

          gap: 7px;

          color: #858b95;

          font-size: 10px;
          font-weight: 500;

          white-space: nowrap;
        }

        .request-status-dot {
          width: 6px;
          height: 6px;

          flex: 0 0 6px;

          border-radius: 50%;

          background: #71717a;
        }

        .request-status-pending .request-status-dot {
          background: #f97316;
        }

        .request-status-approved .request-status-dot {
          background: #22c55e;
        }

        .request-status-rejected .request-status-dot {
          background: #ef4444;
        }

        /* ========================================
           DATE
        ======================================== */

        .request-date {
          color: #737984;

          font-size: 10px;

          white-space: nowrap;
        }

        /* ========================================
           EMPTY / ERROR
        ======================================== */

        .organization-requests-empty {
          height: 220px !important;

          padding: 0 20px !important;

          border-bottom: 0 !important;

          color: #4f555f !important;

          font-size: 11px !important;

          text-align: center !important;
        }

        .organization-requests-error {
          color: #8f5555 !important;
        }

        /* ========================================
           RESPONSIVE
        ======================================== */

        @media (max-width: 700px) {
          .organization-requests-page {
            padding-top: 20px;
          }

          .organization-requests-header h1 {
            font-size: 21px;
            line-height: 28px;
          }

          .organization-requests-header p {
            font-size: 11px;
          }

          .organization-requests-filters {
            max-width: 100%;

            overflow-x: auto;

            scrollbar-width: none;
          }

          .organization-requests-filters::-webkit-scrollbar {
            display: none;
          }

          .organization-requests-filter {
            flex: 0 0 auto;
          }

          .organization-requests-table {
            min-width: 820px;
          }
        }

        /* ========================================
           REQUEST DETAIL MODAL
        ======================================== */

        .request-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 24px;

          background: rgba(0, 0, 0, 0.68);

          backdrop-filter: blur(4px);
        }

        .request-modal {
          width: min(680px, 100%);
          max-height: min(760px, calc(100dvh - 48px));

          display: flex;
          flex-direction: column;

          overflow: hidden;

          border: 1px solid #252b33;
          border-radius: 12px;

          background: #0f1115;

          box-shadow:
            0 24px 70px rgba(0, 0, 0, 0.45),
            0 4px 20px rgba(0, 0, 0, 0.25);
        }

        .request-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          padding: 22px 24px 18px;

          border-bottom: 1px solid #1d2229;
        }

        .request-modal-header h2 {
          margin: 0;

          color: #f3f4f6;

          font-size: 17px;
          line-height: 24px;
          font-weight: 600;

          letter-spacing: -0.015em;
        }

        .request-modal-id {
          display: block;

          margin-top: 4px;

          color: #4f555f;

          font-family: monospace;
          font-size: 9px;
        }

        .request-modal-close {
          display: flex;
          align-items: center;
          justify-content: center;

          width: 30px;
          height: 30px;

          border: 0;
          border-radius: 6px;

          background: transparent;

          color: #666b75;

          font-family: inherit;
          font-size: 21px;
          font-weight: 300;

          cursor: pointer;

          transition:
            color 0.15s ease,
            background-color 0.15s ease;
        }

        .request-modal-close:hover {
          background: #181c22;
          color: #d4d4d8;
        }

        .request-modal-body {
          overflow-y: auto;

          padding: 4px 24px 24px;

          scrollbar-width: thin;
          scrollbar-color: #2a3038 transparent;
        }

        .request-detail-section {
          padding: 20px 0;

          border-bottom: 1px solid #191d23;
        }

        .request-detail-section:last-child {
          border-bottom: 0;
        }

        .request-detail-section h3 {
          margin: 0 0 14px;

          color: #6d727c;

          font-size: 10px;
          line-height: 14px;
          font-weight: 500;

          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .request-detail-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));

          gap: 16px 28px;
        }

        .request-detail-item {
          display: flex;
          flex-direction: column;

          gap: 5px;

          min-width: 0;
        }

        .request-detail-item > span:first-child {
          color: #555b65;

          font-size: 10px;
          line-height: 14px;
        }

        .request-detail-item strong {
          overflow: hidden;

          color: #d4d4d8;

          font-size: 11px;
          line-height: 16px;
          font-weight: 500;

          text-overflow: ellipsis;
        }

        .request-detail-text {
          margin: 0;

          color: #a1a1aa;

          font-size: 11px;
          line-height: 19px;
        }

        .request-detail-user {
          display: flex;
          align-items: center;

          gap: 10px;
        }

        .request-detail-user-avatar {
          display: flex;
          align-items: center;
          justify-content: center;

          width: 34px;
          height: 34px;

          flex: 0 0 34px;

          border: 1px solid #292f38;
          border-radius: 8px;

          background: #14181e;

          color: #d4d4d8;

          font-size: 11px;
          font-weight: 600;
        }

        .request-detail-user > div:last-child {
          display: flex;
          flex-direction: column;

          gap: 2px;
        }

        .request-detail-user strong {
          color: #d4d4d8;

          font-size: 11px;
          font-weight: 500;
        }

        .request-detail-user span {
          color: #555b65;

          font-size: 10px;
        }

        .request-detail-link {
          overflow: hidden;

          color: #a1a1aa;

          font-size: 11px;

          text-overflow: ellipsis;
          white-space: nowrap;

          text-decoration: none;
        }

        .request-detail-link:hover {
          color: #f97316;
        }

        .request-modal-footer {
          display: flex;
          justify-content: flex-end;

          padding: 14px 24px;

          border-top: 1px solid #1d2229;
        }

        .request-modal-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-right: auto;
        }

        .request-modal-reject,
        .request-modal-approve {
          height: 32px;
          padding: 0 13px;
          border-radius: 6px;
          border: 1px solid transparent;
          font-size: 10px;
          line-height: 14px;
          font-weight: 500;
          cursor: pointer;
          transition:
            background-color 0.15s ease,
            border-color 0.15s ease,
            color 0.15s ease,
            opacity 0.15s ease;
        }

        .request-modal-reject {
          background: #17191e;
          border-color: #2a2e36;
          color: #a1a1aa;
        }

        .request-modal-reject:hover {
          background: #1d2026;
          border-color: #343943;
          color: #e4e4e7;
        }

        .request-modal-approve {
          background: #f97316;
          border-color: #f97316;
          color: #09090b;
        }

        .request-modal-approve:hover {
          background: #fb923c;
          border-color: #fb923c;
        }

        .request-modal-reject:active,
        .request-modal-approve:active {
          opacity: 0.85;
        }

        .request-modal-reject:focus-visible,
        .request-modal-approve:focus-visible {
          outline: 2px solid #f97316;
          outline-offset: 2px;
        }

        .request-modal-reject:disabled,
        .request-modal-approve:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .request-modal-reject:disabled:hover {
          background: #17191e;
          border-color: #2a2e36;
          color: #a1a1aa;
        }

        .request-modal-approve:disabled:hover {
          background: #f97316;
          border-color: #f97316;
        }

        .request-modal-secondary {
          height: 32px;

          padding: 0 13px;

          border: 1px solid #292f38;
          border-radius: 6px;

          background: #15191f;

          color: #a1a1aa;

          font-family: inherit;
          font-size: 11px;
          font-weight: 500;

          cursor: pointer;

          transition:
            color 0.15s ease,
            background-color 0.15s ease,
            border-color 0.15s ease;
        }

        .request-modal-secondary:hover {
          border-color: #363d47;

          background: #1a1f26;

          color: #f3f4f6;
        }

        @media (max-width: 600px) {
          .request-modal-backdrop {
            align-items: center;

            padding: 0;
          }

          .request-modal {
            max-height: 80dvh;
            margin: 0 24px;

            border-right: 0;
            border-bottom: 0;
            border-left: 0;

            border-radius: 12px 12px 0 0;
          }

          .request-modal-header {
            padding: 18px 18px 16px;
          }

          .request-modal-body {
            padding-left: 18px;
            padding-right: 18px;
          }

          .request-detail-grid {
            grid-template-columns: 1fr;

            gap: 14px;
          }

          .request-modal-footer {
            padding: 12px 18px;
          }
        }

        .request-reject-form {
          margin-top: 20px;
          padding: 16px;
          border: 1px solid #232832;
          border-radius: 8px;
          background: #11151b;
        }

        .request-reject-form-header {
          margin-bottom: 12px;
        }

        .request-reject-form-header h3 {
          margin: 0 0 4px;
          color: #e4e4e7;
          font-size: 12px;
          line-height: 18px;
          font-weight: 500;
        }

        .request-reject-form-header p {
          margin: 0;
          color: #626872;
          font-size: 10px;
          line-height: 15px;
        }

        .request-reject-form textarea {
          display: block;
          width: 100%;
          min-width: 0;
          min-height: 96px;
          box-sizing: border-box;
          padding: 10px 11px;
          resize: vertical;
          border: 1px solid #232832;
          border-radius: 6px;
          outline: none;
          background: #0c0f13;
          color: #d4d4d8;
          font-family: inherit;
          font-size: 11px;
          line-height: 17px;
          transition:
            border-color 0.15s ease,
            background-color 0.15s ease;
        }

        .request-reject-form textarea::placeholder {
          color: #4f545d;
        }

        .request-reject-form textarea:hover {
          border-color: #2d333d;
        }

        .request-reject-form textarea:focus {
          border-color: #3a414c;
          background: #0f1217;
        }

        .request-reject-form-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
        }

        .request-reject-form-actions .request-modal-secondary,
        .request-reject-form-actions .request-modal-reject {
          height: 30px;
          padding: 0 12px;
          border-radius: 6px;
          font-size: 10px;
          line-height: 14px;
        }

        .request-reject-form-actions .request-modal-reject:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .request-reject-form-actions .request-modal-reject:disabled:hover {
          background: #f97316;
          border-color: #f97316;
        }

        .request-approve-confirmation {
          margin-top: 20px;
          padding: 16px;
          border: 1px solid #232832;
          border-radius: 8px;
          background: #11151b;
        }

        .request-approve-confirmation-header {
          margin-bottom: 12px;
        }

        .request-approve-confirmation-header h3 {
          margin: 0 0 4px;
          color: #e4e4e7;
          font-size: 12px;
          line-height: 18px;
          font-weight: 500;
        }

        .request-approve-confirmation-header p {
          margin: 0;
          color: #626872;
          font-size: 10px;
          line-height: 15px;
        }

        .request-approve-confirmation-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
          margin-top: 14px;
        }

        .request-approve-confirmation-actions .request-modal-secondary,
        .request-approve-confirmation-actions .request-modal-approve {
          height: 30px;
          padding: 0 12px;
          border-radius: 6px;
          font-size: 10px;
          line-height: 14px;
        }
      `}</style>
    </section>
  );
}
