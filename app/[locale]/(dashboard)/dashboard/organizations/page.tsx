import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  organizationTypeOptions,
  cisCountryOptions,
  uzbekistanRegionOptions,
} from "@/lib/organization-options";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Dashboard.organizations");

  return {
    title: `${t("title")} | Zonter`,
    description: t("description"),
  };
}

export default async function OrganizationsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const getTranslationKey = (
    options: readonly { value: string; translationKey: string }[],
    value: string | null,
  ) => options.find((option) => option.value === value)?.translationKey;

  if (!token) {
    return <div>Not authorized</div>;
  }

  try {
    const payload = await verifyToken(token);
    const userId = payload.userId as string;

    if (!userId) {
      return <div>Invalid token</div>;
    }

    const t = await getTranslations("Dashboard.organizations");
    const tCommon = await getTranslations("common");

    const organizations = await prisma.organizationMember.findMany({
      where: {
        userId,
      },
      select: {
        role: true,
        joinedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            type: true,
            status: true,
            country: true,
            region: true,
            city: true,
          },
        },
      },
      orderBy: {
        joinedAt: "desc",
      },
    });

    return (
      <div className="organizations-page">
        <DashboardHeader
          title={t("title")}
          subtitle={t("description")}
          action={
            <Link
              href="/dashboard/organizations/create"
              className="create-button"
            >
              <span>+</span>
              {t("create")}
            </Link>
          }
        />

        {organizations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◇</div>

            <h2>{t("empty.title")}</h2>

            <p>{t("empty.description")}</p>

            <Link
              href="/dashboard/organizations/create"
              className="empty-action"
            >
              {t("create")}
            </Link>
          </div>
        ) : (
          <div className="organizations-grid">
            {organizations.map((member) => {
              const organization = member.organization;

              const regionKey = getTranslationKey(
                uzbekistanRegionOptions,
                organization.region,
              );

              const countryKey = getTranslationKey(
                cisCountryOptions,
                organization.country,
              );

              const location = [
                organization.city,
                regionKey ? tCommon(`organization.regions.${regionKey}`) : null,
                countryKey
                  ? tCommon(`organization.countries.${countryKey}`)
                  : null,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <article key={organization.id} className="organization-card">
                  <div className="card-top">
                    <div className="organization-identity">
                      <div className="organization-logo">
                        {organization.logoUrl ? (
                          <img
                            src={
                              organization.logoUrl
                                ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${organization.logoUrl}`
                                : "/default-organization-logo.svg"
                            }
                            alt={organization.name}
                          />
                        ) : (
                          organization.name.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className="organization-info">
                        <h2>{organization.name}</h2>

                        <span>/{organization.slug}</span>
                      </div>
                    </div>

                    <div
                      className={`status status-${organization.status.toLowerCase()}`}
                    >
                      <span className="status-dot" />

                      {tCommon(`statuses.${organization.status.toLowerCase()}`)}
                    </div>
                  </div>

                  <div className="organization-meta">
                    <span>
                      {tCommon(
                        `organization.types.${organization.type.toLowerCase()}`,
                      )}
                    </span>

                    <span className="meta-separator">·</span>

                    <span>{location || "—"}</span>
                  </div>

                  <div className="card-bottom">
                    <div className="role">
                      <span className="role-label">{t("role")}:</span>

                      <span className="role-value">
                        {tCommon(`roles.${member.role.toLowerCase()}`)}
                      </span>
                    </div>

                    <Link
                      href={`/dashboard/organization/${organization.id}`}
                      className="open-button"
                    >
                      {t("open")}
                      <span>→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <style>{`
          .organizations-page {
          }

          .page-header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 24px;
            margin-bottom: 30px;
          }

          .page-title {
            margin: 0;
            color: #F4F4F5;
            font-size: 24px;
            line-height: 32px;
            font-weight: 600;
            letter-spacing: -0.03em;
          }

          .page-description {
            margin: 6px 0 0;
            color: #71717A;
            font-size: 13px;
            line-height: 19px;
          }

          .create-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            height: 36px;
            padding: 0 15px;
            border: 1px solid #F97316;
            border-radius: 7px;
            background: #F97316;
            color: #09090B;
            font-size: 12px;
            font-weight: 600;
            text-decoration: none;
            box-shadow: 0 1px 0 rgba(255, 255, 255, 0.08) inset;
            transition:
              background 0.18s ease,
              border-color 0.18s ease,
              transform 0.18s ease;
          }

          .create-button:hover {
            background: #FB923C;
            border-color: #FB923C;
            transform: translateY(-1px);
          }

          .create-button:active {
            transform: translateY(0);
          }

          .create-button span {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 15px;
            height: 15px;
            font-size: 17px;
            line-height: 1;
          }

          .organizations-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
          }

          .organization-card {
            position: relative;
            min-width: 0;
            padding: 20px;
            overflow: hidden;
            border: 1px solid #20242C;
            border-radius: 10px;
            background:
              linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.018) 0%,
                rgba(255, 255, 255, 0) 100%
              ),
              #0F1115;
            box-shadow:
              0 1px 2px rgba(0, 0, 0, 0.18),
              0 8px 24px rgba(0, 0, 0, 0.08);
            transition:
              border-color 0.2s ease,
              background 0.2s ease,
              box-shadow 0.2s ease,
              transform 0.2s ease;
          }

          .organization-card::before {
            content: "";
            position: absolute;
            top: 0;
            left: 20px;
            right: 20px;
            height: 1px;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(249, 115, 22, 0.18),
              transparent
            );
            opacity: 0;
            transition: opacity 0.2s ease;
          }

          .organization-card:hover {
            border-color: #2B313B;
            background:
              linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.025) 0%,
                rgba(255, 255, 255, 0) 100%
              ),
              #11151B;
            box-shadow:
              0 1px 2px rgba(0, 0, 0, 0.2),
              0 12px 30px rgba(0, 0, 0, 0.12);
            transform: translateY(-1px);
          }

          .organization-card:hover::before {
            opacity: 1;
          }

          .card-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 20px;
          }

          .organization-identity {
            min-width: 0;
            display: flex;
            align-items: center;
            gap: 13px;
          }

          .organization-logo {
            width: 46px;
            height: 46px;
            flex: 0 0 46px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border: 1px solid #292F38;
            border-radius: 9px;
            background: #171B21;
            color: #D4D4D8;
            font-size: 15px;
            font-weight: 600;
          }

          .organization-logo img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .organization-info {
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 3px;
          }

          .organization-info h2 {
            margin: 0;
            overflow: hidden;
            color: #F4F4F5;
            font-size: 15px;
            line-height: 21px;
            font-weight: 600;
            letter-spacing: -0.012em;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .organization-info span {
            overflow: hidden;
            color: #5C636E;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 10px;
            line-height: 15px;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .status {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            flex: 0 0 auto;
            min-height: 24px;
            padding: 0 9px;
            border: 1px solid #252A32;
            border-radius: 999px;
            background: #14171C;
            color: #9CA3AF;
            font-size: 10px;
            line-height: 15px;
            white-space: nowrap;
          }

          .status-dot {
            width: 6px;
            height: 6px;
            flex: 0 0 6px;
            border-radius: 50%;
            background: #525963;
          }

          .status-active {
            border-color: rgba(74, 222, 128, 0.14);
            color: #A7F3D0;
          }

          .status-active .status-dot {
            background: #4ADE80;
            box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.08);
          }

          .status-suspended {
            border-color: rgba(245, 158, 11, 0.14);
            color: #FCD34D;
          }

          .status-suspended .status-dot {
            background: #F59E0B;
          }

          .status-archived {
            border-color: #252A32;
            color: #71717A;
          }

          .status-archived .status-dot {
            background: #525963;
          }

          .organization-meta {
            display: flex;
            align-items: center;
            min-width: 0;
            gap: 8px;
            margin-top: 19px;
            color: #7A818C;
            font-size: 11px;
            line-height: 16px;
          }

          .organization-meta > span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .meta-separator {
            flex: 0 0 auto;
            color: #343A44;
          }

          .card-bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            margin-top: 19px;
            padding-top: 15px;
            border-top: 1px solid #1C2026;
          }

          .role {
            display: flex;
            align-items: center;
            min-width: 0;
            gap: 8px;
          }

          .role-label {
            color: #5C636E;
            font-size: 10px;
            line-height: 15px;
          }

          .role-value {
            color: #AEB4BE;
            font-size: 11px;
            line-height: 15px;
            font-weight: 500;
          }

          .open-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            height: 32px;
            padding: 0 12px;
            border: 1px solid #292F38;
            border-radius: 6px;
            background: #14171C;
            color: #D4D4D8;
            font-size: 11px;
            font-weight: 500;
            text-decoration: none;
            transition:
              border-color 0.18s ease,
              background 0.18s ease,
              color 0.18s ease;
          }

          .open-button:hover {
            border-color: #3A4450;
            background: #191D23;
            color: #F4F4F5;
          }

          .open-button span {
            color: #71717A;
            font-size: 14px;
            line-height: 1;
            transition:
              color 0.18s ease,
              transform 0.18s ease;
          }

          .open-button:hover span {
            color: #A1A1AA;
            transform: translateX(2px);
          }

          .empty-state {
            min-height: 340px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            border: 1px dashed #292F38;
            border-radius: 10px;
            background:
              radial-gradient(
                circle at 50% 30%,
                rgba(249, 115, 22, 0.035),
                transparent 30%
              ),
              #0F1115;
            text-align: center;
          }

          .empty-icon {
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 17px;
            border: 1px solid #292F38;
            border-radius: 10px;
            background: #161B22;
            color: #71717A;
            font-size: 23px;
          }

          .empty-state h2 {
            margin: 0 0 8px;
            color: #F4F4F5;
            font-size: 17px;
            line-height: 23px;
            font-weight: 600;
            letter-spacing: -0.01em;
          }

          .empty-state p {
            max-width: 440px;
            margin: 0 0 22px;
            color: #71717A;
            font-size: 12px;
            line-height: 18px;
          }

          .empty-action {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 34px;
            padding: 0 15px;
            border: 1px solid #292F38;
            border-radius: 6px;
            background: #F3F4F6;
            color: #09090B;
            font-size: 11px;
            font-weight: 600;
            text-decoration: none;
            transition:
              background 0.18s ease,
              border-color 0.18s ease;
          }

          .empty-action:hover {
            background: #FFFFFF;
            border-color: #FFFFFF;
          }

          @media (max-width: 900px) {
            .organizations-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 768px) {
            .organizations-page {
              padding: 20px 0 40px;
            }

            .page-header {
              align-items: flex-start;
            }

            .page-title {
              font-size: 22px;
              line-height: 29px;
            }

            .page-description {
              font-size: 12px;
              line-height: 18px;
            }
          }

          @media (max-width: 520px) {
            .page-header {
              flex-direction: column;
              gap: 14px;
            }

            .create-button {
              width: 100%;
            }

            .organization-card {
              padding: 17px;
            }

            .card-top {
              flex-direction: column;
              gap: 13px;
            }

            .status {
              align-self: flex-start;
            }

            .card-bottom {
              align-items: flex-start;
            }

            .open-button {
              flex: 0 0 auto;
            }
          }
        `}</style>
      </div>
    );
  } catch (error) {
    console.error("Dashboard organizations error:", error);

    return <div>Invalid token</div>;
  }
}
