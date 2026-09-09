import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ActionCard from "@/components/dashboard/ActionCard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Dashboard");

  return {
    title: "Dashboard | Zonter",
    description: "Dashboard",
  };
}

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const t = await getTranslations("Dashboard");

  if (!token) {
    return <div>Not authorized</div>;
  }

  try {
    const payload = await verifyToken(token);
    const userId = payload.userId as string;

    const organizationCount = await prisma.organizationMember.count({
      where: {
        userId,
      },
    });

    const hasOrganizations = organizationCount > 0;

    if (!userId) {
      return <div>Invalid token</div>;
    }

    return (
      <div className="dashboard-page">
        {/* Welcome section */}
        <div className="welcome-section">
          <h2 className="welcome-title">{t("main.welcome")}</h2>
          <p className="welcome-subtitle">{t("main.underwelcome")}</p>
        </div>

        {/* Quick stats */}
        {hasOrganizations && (
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">{t("main.orgs")}</p>
              <p className="stat-value">0</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">{t("main.tours")}</p>
              <p className="stat-value">0</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">{t("main.teams")}</p>
              <p className="stat-value">0</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">{t("main.players")}</p>
              <p className="stat-value">0</p>
            </div>
          </div>
        )}
        {!hasOrganizations && (
          <>
            {/* Action cards */}
            <div className="action-grid">
              <ActionCard
                icon="+"
                title={t("main.createorg")}
                description={t("main.undercreateorg")}
                href="/dashboard/organizations/create"
                linkText={t("main.buttoncreateorg")}
                highlight
              />

              <ActionCard
                icon="↗"
                title={t("main.joinorg")}
                description={t("main.underjoinorg")}
                href="/dashboard/invitations"
                linkText={t("main.buttonjoinorg")}
              />
            </div>
          </>
        )}

        {/* Empty state */}
        {!hasOrganizations && (
          <div className="empty-state">
            <div className="empty-icon">◇</div>

            <h3 className="empty-title">{t("main.noorgs")}</h3>

            <p className="empty-description">{t("main.undernoorgs")}</p>
          </div>
        )}

        <style>{`
          .dashboard-page {
            max-width: 1440px;
            margin: 0 auto;
            width: 100%;
          }

          .welcome-section {
            margin-bottom: 40px;
          }

          .welcome-title {
            font-size: 32px;
            font-weight: 600;
            color: white;
            letter-spacing: -0.5px;
            margin-bottom: 12px;
          }

          .welcome-subtitle {
            font-size: 14px;
            color: #9CA3AF;
            max-width: 600px;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 16px;
            margin-bottom: 40px;
          }

          .stat-card {
            border: 1px solid #232A34;
            background: #0F1115;
            border-radius: 10px;
            padding: 20px;
            transition: all 0.2s;
          }

          .stat-card:hover {
            border-color: #3A4450;
            background: #161B22;
          }

          .stat-label {
            font-size: 12px;
            font-weight: 600;
            color: #6B7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 12px;
          }

          .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: white;
            letter-spacing: -0.5px;
          }

          .action-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
          }

          .action-card {
            border: 1.5px solid #232A34;
            background: #0F1115;
            border-radius: 12px;
            padding: 28px;
            transition: all 0.2s;
          }

          .action-card:hover {
            border-color: #3A4450;
            background: #161B22;
          }

          .action-card.highlight {
            border-color: rgba(249, 115, 22, 0.3);
            background: linear-gradient(135deg, rgba(249, 115, 22, 0.05), rgba(234, 88, 12, 0.02));
          }

          .action-card.highlight:hover {
            border-color: rgba(249, 115, 22, 0.5);
            background: linear-gradient(135deg, rgba(249, 115, 22, 0.08), rgba(234, 88, 12, 0.04));
          }

          .action-icon {
            width: 48px;
            height: 48px;
            border-radius: 8px;
            background: white;
            color: black;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 16px;
          }

          .action-card.highlight .action-icon {
            background: white;
            color: black;
          }

          .action-card:not(.highlight) .action-icon {
            background: rgba(255, 255, 255, 0.1);
            color: white;
          }

          .action-title {
            font-size: 18px;
            font-weight: 600;
            color: white;
            letter-spacing: -0.3px;
            margin-bottom: 12px;
          }

          .action-description {
            font-size: 14px;
            color: #9CA3AF;
            line-height: 1.6;
            margin-bottom: 20px;
          }

          .action-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 10px 16px;
            background: white;
            border: none;
            border-radius: 8px;
            color: black;
            font-size: 13px;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            transition: background 0.2s;
          }

          .action-card.highlight .action-link {
            background: white;
            color: black;
          }

          .action-card:not(.highlight) .action-link {
            background: transparent;
            border: 1.5px solid #232A34;
            color: white;
          }

          .action-card:not(.highlight) .action-link:hover {
            border-color: #3A4450;
            background: rgba(255, 255, 255, 0.05);
          }

          .action-link:hover {
            opacity: 0.9;
          }

          .arrow {
            font-size: 14px;
          }

          .empty-state {
            border: 2px dashed #232A34;
            background: #0F1115;
            border-radius: 16px;
            padding: 40px;
            text-align: center;
          }

          .empty-icon {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.05);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            margin: 0 auto 20px;
          }

          .empty-title {
            font-size: 18px;
            font-weight: 600;
            color: white;
            letter-spacing: -0.3px;
            margin-bottom: 8px;
          }

          .empty-description {
            font-size: 14px;
            color: #6B7280;
            max-width: 500px;
            margin: 0 auto;
          }

          @media (max-width: 768px) {
            .dashboard-page {
              padding: 0;
            }

            .welcome-title {
              font-size: 24px;
            }

            .welcome-subtitle {
              font-size: 13px;
            }

            .stats-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
              margin-bottom: 24px;
            }

            .stat-card {
              padding: 16px;
            }

            .stat-value {
              font-size: 24px;
            }

            .action-grid {
              grid-template-columns: 1fr;
              gap: 16px;
              margin-bottom: 16px;
            }

            .action-card {
              padding: 20px;
            }

            .action-icon {
              width: 40px;
              height: 40px;
              font-size: 20px;
            }

            .action-title {
              font-size: 16px;
            }

            .empty-state {
              padding: 32px 20px;
            }

            .empty-icon {
              width: 48px;
              height: 48px;
              font-size: 24px;
            }
          }
        `}</style>
      </div>
    );
  } catch (error) {
    console.error("Token verification failed:", error);
    return <div>Invalid token</div>;
  }
}
