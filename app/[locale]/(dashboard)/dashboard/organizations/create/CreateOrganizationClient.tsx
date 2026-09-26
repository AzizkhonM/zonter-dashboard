"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

const ORGANIZATION_DRAFT_KEY = "zonter-create-organization";

export default function CreateOrganizationPage() {
  const t = useTranslations("Dashboard");

  const organizationTypes = [
    { value: "COMPANY", label: t("organization.types.company") },
    { value: "UNIVERSITY", label: t("organization.types.university") },
    { value: "SCHOOL", label: t("organization.types.school") },
    { value: "GOVERNMENT", label: t("organization.types.government") },
    { value: "NGO", label: t("organization.types.ngo") },
    { value: "COMMUNITY", label: t("organization.types.community") },
    { value: "OTHER", label: t("organization.types.other") },
  ];

  const errorMessages = {
    UNAUTHORIZED: "organization.errors.UNAUTHORIZED",
    INVALID_TOKEN: "organization.errors.INVALID_TOKEN",
    INVALID_NAME: "organization.errors.INVALID_NAME",
    INVALID_TYPE: "organization.errors.INVALID_TYPE",
    INVALID_COUNTRY: "organization.errors.INVALID_COUNTRY",
    INVALID_LOGO_TYPE: "organization.errors.INVALID_LOGO_TYPE",
    SERVER_ERROR: "organization.errors.SERVER_ERROR",
  } as const;

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [affiliatedOrganization, setAffiliatedOrganization] = useState("");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [reason, setReason] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const localeSet = new Set(["uz", "en", "ru"]);
  const segment = pathname.split("/")[1];
  const locale = localeSet.has(segment) ? segment : "uz";

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const savedDraft = localStorage.getItem(ORGANIZATION_DRAFT_KEY);

    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);

        setName(draft.name ?? "");
        setType(draft.type ?? "");
        setDescription(draft.description ?? "");
        setAffiliatedOrganization(draft.affiliatedOrganization ?? "");
        setWebsite(draft.website ?? "");
        setCountry(draft.country ?? "");
        setRegion(draft.region ?? "");
        setCity(draft.city ?? "");
        setReason(draft.reason ?? "");
      } catch {
        localStorage.removeItem(ORGANIZATION_DRAFT_KEY);
      }
    }

    setIsDraftLoaded(true);
  }, []);

  useEffect(() => {
    if (!isDraftLoaded) return;

    const draft = {
      name,
      type,
      description,
      affiliatedOrganization,
      website,
      country,
      region,
      city,
      reason,
    };

    localStorage.setItem(ORGANIZATION_DRAFT_KEY, JSON.stringify(draft));
  }, [
    isDraftLoaded,
    name,
    type,
    description,
    affiliatedOrganization,
    website,
    country,
    region,
    city,
    reason,
  ]);

  const isOrganizationNameValid = () => {
    const value = name.trim();

    return value.length >= 3 && /[\p{L}\p{N}ʼʻʼʻ]/u.test(value);
  };

  const handleLogoChange = (file: File | null) => {
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return;
    }

    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const cisCountries = [
    { value: "UZ", label: t("organization.countries.uz") },
    { value: "KZ", label: t("organization.countries.kz") },
    { value: "KG", label: t("organization.countries.kg") },
    { value: "TJ", label: t("organization.countries.tj") },
    { value: "TM", label: t("organization.countries.tm") },
    { value: "AZ", label: t("organization.countries.az") },
    { value: "AM", label: t("organization.countries.am") },
    { value: "BY", label: t("organization.countries.by") },
    { value: "MD", label: t("organization.countries.md") },
    { value: "RU", label: t("organization.countries.ru") },
  ];

  const uzbekistanRegions = [
    { value: "TASHKENT_CITY", label: t("organization.regions.tashkentCity") },
    {
      value: "TASHKENT_REGION",
      label: t("organization.regions.tashkentRegion"),
    },
    { value: "ANDIJAN", label: t("organization.regions.andijan") },
    { value: "BUKHARA", label: t("organization.regions.bukhara") },
    { value: "JIZZAKH", label: t("organization.regions.jizzakh") },
    { value: "KASHKADARYA", label: t("organization.regions.kashkadarya") },
    { value: "KHOREZM", label: t("organization.regions.khorezm") },
    { value: "NAMANGAN", label: t("organization.regions.namangan") },
    { value: "NAVOIY", label: t("organization.regions.navoi") },
    { value: "SAMARKAND", label: t("organization.regions.samarkand") },
    { value: "SIRDARYA", label: t("organization.regions.sirdarya") },
    { value: "SURKHANDARYA", label: t("organization.regions.surkhandarya") },
    {
      value: "KARAKALPAKSTAN",
      label: t("organization.regions.karakalpakstan"),
    },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !type) return;

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("type", type);
      formData.append("description", description.trim());
      formData.append("affiliatedOrganization", affiliatedOrganization.trim());
      formData.append("website", website.trim());
      formData.append("country", country);
      formData.append("region", region);
      formData.append("city", city.trim());
      formData.append("reason", reason.trim());

      if (logo) {
        formData.append("logo", logo);
      }

      const res = await fetch("/api/organizations", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        const errorKey =
          errorMessages[data.error as keyof typeof errorMessages] ??
          errorMessages.SERVER_ERROR;

        toast.error(t(errorKey));
        return;
      }

      localStorage.removeItem(ORGANIZATION_DRAFT_KEY);

      toast.success(t("organization.success.requestSubmitted"));

      window.dispatchEvent(new Event("organization-updated"));

      const dashboardPath =
        locale === "uz" ? "/dashboard" : `/${locale}/dashboard`;

      router.push(dashboardPath);
    } catch (error) {
      console.error("SUBMIT ERROR:", error);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="organization-page">
      <section className="profile-card">
        <div className="profile-section-header">
          <h2>{t("organization.create")}</h2>
          <p>{t("organization.undercreate")}</p>
        </div>

        <form className="organization-form" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="form-section">
            <div className="form-section-title">{t("organization.basic")}</div>

            <div className="field">
              <label className="profile-label">{t("organization.name")}</label>

              <input
                className="input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("organization.namePlaceholder")}
                minLength={3}
                required
              />
            </div>

            <div className="profile-row">
              <div className="field">
                <label className="profile-label">
                  {t("organization.type")}
                </label>

                <select
                  className="input select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    {t("organization.typePlaceholder")}
                  </option>

                  {organizationTypes.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="profile-label">
                  {t("organization.affiliatedOrganization")}
                </label>

                <input
                  className="input"
                  type="text"
                  value={affiliatedOrganization}
                  onChange={(e) => setAffiliatedOrganization(e.target.value)}
                  placeholder={t(
                    "organization.affiliatedOrganizationPlaceholder"
                  )}
                />
              </div>
            </div>

            <div className="field">
              <label className="profile-label">
                {t("organization.description")}
              </label>

              <textarea
                className="input textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("organization.descriptionPlaceholder")}
                rows={4}
              />
            </div>
          </div>

          {/* Logo & Website */}
          <div className="form-section">
            <div className="form-section-title">
              {t("organization.additional")}
            </div>

            <div className="profile-row">
              <div className="field">
                <label className="profile-label">
                  {t("organization.logo")}
                </label>

                <label
                  className={`logo-dropzone ${logo ? "has-logo" : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleLogoChange(e.dataTransfer.files?.[0] || null);
                  }}
                >
                  {logoPreview ? (
                    <div className="logo-preview">
                      <img src={logoPreview} alt="Organization logo preview" />

                      <div className="logo-info">
                        <span className="logo-name">{logo?.name}</span>
                        <span className="logo-change">
                          {t("organization.changeLogo")}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="logo-empty">
                      <div className="logo-icon">↑</div>

                      <div>
                        <span className="logo-title">
                          {t("organization.uploadLogo")}
                        </span>
                        <span className="logo-hint">
                          {t("organization.logoHint")}
                        </span>
                      </div>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => {
                      handleLogoChange(e.target.files?.[0] || null);
                      e.target.value = "";
                    }}
                  />
                </label>

                {logo && (
                  <button
                    type="button"
                    className="remove-logo"
                    onClick={() => {
                      if (logoPreview) {
                        URL.revokeObjectURL(logoPreview);
                      }

                      setLogo(null);
                      setLogoPreview(null);
                    }}
                  >
                    {t("organization.removeLogo")}
                  </button>
                )}
              </div>

              <div className="field">
                <label className="profile-label">
                  {t("organization.website")}
                </label>

                <input
                  className="input"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="form-section">
            <div className="form-section-title">
              {t("organization.location")}
            </div>

            <div className="profile-row">
              <div className="field">
                <label className="profile-label">
                  {t("organization.country")}
                </label>

                <select
                  className="input select"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);

                    if (e.target.value !== "UZ") {
                      setRegion("");
                    }
                  }}
                >
                  <option value="" disabled>
                    {t("organization.countryPlaceholder")}
                  </option>

                  {cisCountries.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="profile-label">
                  {t("organization.region")}
                </label>

                {country === "UZ" ? (
                  <select
                    className="input select"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  >
                    <option value="" disabled>
                      {t("organization.regionPlaceholder")}
                    </option>

                    {uzbekistanRegions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="input"
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder={t("organization.regionPlaceholder")}
                  />
                )}
              </div>
            </div>

            <div className="field">
              <label className="profile-label">{t("organization.city")}</label>

              <input
                className="input"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={t("organization.cityPlaceholder")}
              />
            </div>
          </div>

          {/* Request */}
          <div className="form-section">
            <div className="form-section-title">
              {t("organization.request")}
            </div>

            <div className="field">
              <label className="profile-label">
                {t("organization.reason")}
              </label>

              <textarea
                className="input textarea"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t("organization.reasonPlaceholder")}
                rows={4}
              />
            </div>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={saving || !isOrganizationNameValid() || !type}
          >
            {saving ? t("organization.submitting") : t("organization.submit")}
          </button>
        </form>
      </section>

      <style jsx>{`
        .organization-page {
          width: 100%;
          max-width: 850px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .profile-card {
          width: 100%;
          padding: 24px;
          background: #0f1115;
          border: 1px solid var(--input-border);
          border-radius: var(--radius);
        }

        .profile-section-header {
          margin-bottom: 26px;
        }

        .profile-section-header h2 {
          margin: 0 0 5px;
          color: var(--text-primary);
          font-size: 1.05rem;
          font-weight: 600;
        }

        .profile-section-header p {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .organization-form {
          display: flex;
          flex-direction: column;
          gap: 26px;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-section-title {
          margin-bottom: 2px;
          color: var(--text-secondary);
          font-size: 0.82rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .field {
          position: relative;
          width: 100%;
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

        .select {
          appearance: none;
          cursor: pointer;
        }

        .select option {
          background: #0f1115;
          color: var(--text-primary);
        }

        .textarea {
          min-height: 100px;
          resize: vertical;
          line-height: 1.5;
        }

        .profile-row {
          display: grid;
          grid-template-columns: 50% 50%;
          gap: 14px;
        }

        .file-input {
          width: 100%;
          min-height: 47px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          background: var(--input-bg);
          border: 1.5px solid var(--input-border);
          border-radius: var(--radius);
          color: var(--text-muted);
          font-size: 0.88rem;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          overflow: hidden;
        }

        .file-input:hover {
          border-color: var(--input-focus);
          background: var(--surface);
        }

        .file-input span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .file-input input {
          display: none;
        }

        .organization-submit {
          margin-top: 0;
        }

        @media (max-width: 600px) {
          .profile-card {
            padding: 18px;
          }

          .profile-row {
            grid-template-columns: 1fr;
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

        .logo-dropzone {
          width: 100%;
          min-height: 110px;
          padding: 18px;
          display: flex;
          align-items: center;
          background: var(--input-bg);
          border: 1.5px dashed var(--input-border);
          border-radius: var(--radius);
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }

        .logo-dropzone:hover {
          border-color: var(--input-focus);
          background: var(--surface);
        }

        .logo-dropzone input {
          display: none;
        }

        .logo-empty {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .logo-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--input-border);
          border-radius: 10px;
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        .logo-title,
        .logo-hint {
          display: block;
        }

        .logo-title {
          color: var(--text-primary);
          font-size: 0.88rem;
          font-weight: 500;
        }

        .logo-hint {
          margin-top: 4px;
          color: var(--text-muted);
          font-size: 0.76rem;
        }

        .logo-preview {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .logo-preview img {
          width: 64px;
          height: 64px;
          object-fit: contain;
          border-radius: 10px;
          background: #0a0c0f;
          border: 1px solid var(--input-border);
        }

        .logo-info {
          min-width: 0;
        }

        .logo-name {
          display: block;
          overflow: hidden;
          color: var(--text-primary);
          font-size: 0.84rem;
          font-weight: 500;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .logo-change {
          display: block;
          margin-top: 5px;
          color: var(--primary);
          font-size: 0.76rem;
        }

        .remove-logo {
          margin-top: 7px;
          padding: 0;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.76rem;
          cursor: pointer;
        }

        .remove-logo:hover {
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
