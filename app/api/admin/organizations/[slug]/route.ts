import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { sendOrganizationEmail } from "@/lib/organization-email";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

const allowedStatuses = ["ACTIVE", "SUSPENDED", "ARCHIVED"] as const;

type OrganizationStatus = (typeof allowedStatuses)[number];

export async function GET(_request: Request, { params }: Params) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value?.trim();

    if (!token) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    let decoded;

    try {
      decoded = await verifyToken(token);
    } catch {
      return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 401 });
    }

    if (!decoded?.userId || decoded.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const { slug } = await params;

    const organization = await prisma.organization.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logoUrl: true,
        type: true,
        status: true,
        affiliatedOrganization: true,
        website: true,
        country: true,
        region: true,
        city: true,
        createdAt: true,
        updatedAt: true,

        members: {
          orderBy: {
            joinedAt: "asc",
          },
          select: {
            id: true,
            role: true,
            joinedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                authProvider: true,
                isActive: true,
              },
            },
          },
        },

        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "ORGANIZATION_NOT_FOUND" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      organization,
    });
  } catch (error) {
    console.error("GET ADMIN ORGANIZATION ERROR:", error);

    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    // =========================================================
    // AUTHENTICATION
    // =========================================================

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value?.trim();

    if (!token) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    let decoded;

    try {
      decoded = await verifyToken(token);
    } catch {
      return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 401 });
    }

    if (!decoded?.userId || decoded.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    // =========================================================
    // ORGANIZATION
    // =========================================================

    const { slug } = await params;

    const organization = await prisma.organization.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        status: true,
        locale: true,

        members: {
          where: {
            role: "OWNER",
          },
          select: {
            userId: true,
            user: {
              select: {
                email: true,
              },
            },
          },
          take: 1,
        },
      },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "ORGANIZATION_NOT_FOUND" },
        { status: 404 },
      );
    }

    // =========================================================
    // REQUEST BODY
    // =========================================================

    let body: {
      status?: unknown;
      reason?: unknown;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "INVALID_REQUEST_BODY" },
        { status: 400 },
      );
    }

    const status = body.status;

    if (
      typeof status !== "string" ||
      !allowedStatuses.includes(status as OrganizationStatus)
    ) {
      return NextResponse.json({ error: "INVALID_STATUS" }, { status: 400 });
    }

    const newStatus = status as OrganizationStatus;

    const reason = typeof body.reason === "string" ? body.reason.trim() : "";

    // =========================================================
    // SAME STATUS
    // =========================================================

    if (organization.status === newStatus) {
      return NextResponse.json(
        { error: "STATUS_ALREADY_SET" },
        { status: 400 },
      );
    }

    // =========================================================
    // VALID STATUS TRANSITIONS
    // =========================================================

    const validTransitions: Record<OrganizationStatus, OrganizationStatus[]> = {
      ACTIVE: ["SUSPENDED", "ARCHIVED"],
      SUSPENDED: ["ACTIVE", "ARCHIVED"],
      ARCHIVED: ["ACTIVE"],
    };

    if (!validTransitions[organization.status].includes(newStatus)) {
      return NextResponse.json(
        { error: "INVALID_STATUS_TRANSITION" },
        { status: 400 },
      );
    }

    // =========================================================
    // REASON
    // =========================================================

    if ((newStatus === "SUSPENDED" || newStatus === "ARCHIVED") && !reason) {
      return NextResponse.json({ error: "REASON_REQUIRED" }, { status: 400 });
    }

    // =========================================================
    // UPDATE STATUS
    // =========================================================

    const updatedOrganization = await prisma.organization.update({
      where: {
        id: organization.id,
      },
      data: {
        status: newStatus,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        locale: true,
        updatedAt: true,
      },
    });

    // =========================================================
    // NOTIFICATION
    // =========================================================

    let notificationType:
      | "ORGANIZATION_SUSPENDED"
      | "ORGANIZATION_ARCHIVED"
      | "ORGANIZATION_RESTORED";

    if (newStatus === "SUSPENDED") {
      notificationType = "ORGANIZATION_SUSPENDED";
    } else if (newStatus === "ARCHIVED") {
      notificationType = "ORGANIZATION_ARCHIVED";
    } else {
      notificationType = "ORGANIZATION_RESTORED";
    }

    const notificationMetadata =
      newStatus === "ACTIVE"
        ? {
            organizationName: updatedOrganization.name,
          }
        : {
            organizationName: updatedOrganization.name,
            reason,
          };

    try {
      const owner = organization.members[0];

      if (owner) {
        await prisma.notification.create({
          data: {
            userId: owner.userId,
            organizationId: updatedOrganization.id,
            type: notificationType,
            metadata: notificationMetadata,
          },
        });
      }
    } catch (error) {
      console.error("ORGANIZATION STATUS NOTIFICATION ERROR:", error);
    }

    // =========================================================
    // EMAIL
    // =========================================================

    try {
      const owner = organization.members[0]?.user;

      if (owner?.email) {
        await sendOrganizationEmail({
          email: owner.email,
          organizationName: updatedOrganization.name,
          locale: updatedOrganization.locale.toLowerCase() as
            "uz" | "en" | "ru",
          type:
            newStatus === "SUSPENDED"
              ? "SUSPENDED"
              : newStatus === "ARCHIVED"
                ? "ARCHIVED"
                : "RESTORED",
          reason:
            newStatus === "SUSPENDED" || newStatus === "ARCHIVED"
              ? reason
              : undefined,
        });
      }
    } catch (error) {
      console.error("ORGANIZATION STATUS EMAIL ERROR:", error);
    }

    // =========================================================
    // RESPONSE
    // =========================================================

    return NextResponse.json({
      success: true,
      organization: {
        id: updatedOrganization.id,
        name: updatedOrganization.name,
        slug: updatedOrganization.slug,
        status: updatedOrganization.status,
        updatedAt: updatedOrganization.updatedAt,
      },
    });
  } catch (error) {
    console.error("PATCH ADMIN ORGANIZATION ERROR:", error);

    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
