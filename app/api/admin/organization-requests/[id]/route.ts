import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { sendOrganizationEmail } from "@/lib/organization-email";

function createSlugBase(name: string) {
  return name
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Authentication
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

    if (!decoded?.userId) {
      return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 401 });
    }

    // 2. SUPER_ADMIN only
    if (decoded.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "REQUEST_NOT_FOUND" }, { status: 404 });
    }

    // 3. Request body
    let body: {
      action?: string;
      reviewNote?: string;
    };

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "INVALID_REQUEST_BODY" },
        { status: 400 },
      );
    }

    const action = body.action?.trim();
    const reviewNote = body.reviewNote?.trim() || null;

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "INVALID_ACTION" }, { status: 400 });
    }

    // 4. Reject requires a reason
    if (action === "reject" && !reviewNote) {
      return NextResponse.json(
        { error: "REVIEW_NOTE_REQUIRED" },
        { status: 400 },
      );
    }

    // 5. Find request
    const organizationRequest = await prisma.organizationRequest.findUnique({
      where: {
        id,
      },
    });

    if (!organizationRequest) {
      return NextResponse.json({ error: "REQUEST_NOT_FOUND" }, { status: 404 });
    }

    if (organizationRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "REQUEST_ALREADY_REVIEWED" },
        { status: 409 },
      );
    }

    // =========================================================
    // REJECT
    // =========================================================

    if (action === "reject") {
      const result = await prisma.organizationRequest.updateMany({
        where: {
          id,
          status: "PENDING",
        },
        data: {
          status: "REJECTED",
          reviewedById: decoded.userId,
          reviewedAt: new Date(),
          reviewNote,
        },
      });

      if (result.count === 0) {
        return NextResponse.json(
          { error: "REQUEST_ALREADY_REVIEWED" },
          { status: 409 },
        );
      }

      const updatedRequest = await prisma.organizationRequest.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          status: true,
          reviewedAt: true,
          reviewNote: true,
          userId: true,
          name: true,
          locale: true,
        },
      });

      if (!updatedRequest) {
        return NextResponse.json(
          { error: "REQUEST_NOT_FOUND" },
          { status: 404 },
        );
      }

      const user = await prisma.user.findUnique({
        where: {
          id: updatedRequest.userId,
        },
        select: {
          email: true,
        },
      });

      if (user) {
        await prisma.notification.create({
          data: {
            userId: updatedRequest.userId,
            type: "ORGANIZATION_REJECTED",
            metadata: {
              organizationName: updatedRequest.name,
              reason: updatedRequest.reviewNote,
            },
          },
        });

        try {
          await sendOrganizationEmail({
            email: user.email,
            organizationName: updatedRequest.name,
            locale: updatedRequest.locale.toLowerCase() as "uz" | "en" | "ru",
            type: "REJECTED",
            reason: updatedRequest.reviewNote,
          });
        } catch (error) {
          console.error("REJECT ORGANIZATION EMAIL ERROR:", error);
        }
      }

      return NextResponse.json({
        success: true,
        action: "reject",
        request: {
          id: updatedRequest.id,
          status: updatedRequest.status,
          reviewedAt: updatedRequest.reviewedAt,
          reviewNote: updatedRequest.reviewNote,
        },
      });
    }

    // =========================================================
    // APPROVE
    // =========================================================

    const result = await prisma.$transaction(async (tx) => {
      /*
       * Re-check inside transaction.
       *
       * This protects against two admins trying to approve
       * the same request at nearly the same time.
       */
      const currentRequest = await tx.organizationRequest.findUnique({
        where: {
          id,
        },
      });

      if (!currentRequest) {
        throw new Error("REQUEST_NOT_FOUND");
      }

      if (currentRequest.status !== "PENDING") {
        throw new Error("REQUEST_ALREADY_REVIEWED");
      }

      // Generate unique organization slug
      const baseSlug = createSlugBase(currentRequest.name);

      if (!baseSlug) {
        throw new Error("INVALID_SLUG");
      }

      let slug = baseSlug;
      let counter = 2;

      while (true) {
        const existingOrganization = await tx.organization.findUnique({
          where: {
            slug,
          },
          select: {
            id: true,
          },
        });

        if (!existingOrganization) {
          break;
        }

        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // 1. Create Organization
      const organization = await tx.organization.create({
        data: {
          name: currentRequest.name,
          slug,
          description: currentRequest.description,
          logoUrl: currentRequest.logoUrl,
          type: currentRequest.type,
          locale: currentRequest.locale,
          affiliatedOrganization: currentRequest.affiliatedOrganization,
          website: currentRequest.website,
          country: currentRequest.country,
          region: currentRequest.region,
          city: currentRequest.city,
        },
      });

      // 2. Create OWNER membership
      const member = await tx.organizationMember.create({
        data: {
          organizationId: organization.id,
          userId: currentRequest.userId,
          role: "OWNER",
        },
      });

      // 3. Approve request
      const updatedRequest = await tx.organizationRequest.update({
        where: {
          id: currentRequest.id,
        },
        data: {
          status: "APPROVED",
          reviewedById: decoded.userId,
          reviewedAt: new Date(),
        },
      });

      return {
        organization,
        member,
        request: updatedRequest,
      };
    });

    const owner = await prisma.user.findUnique({
      where: {
        id: result.request.userId,
      },
      select: {
        email: true,
      },
    });

    if (owner) {
      await prisma.notification.create({
        data: {
          userId: result.request.userId,
          organizationId: result.organization.id,
          type: "ORGANIZATION_APPROVED",
          metadata: {
            organizationName: result.organization.name,
          },
        },
      });

      try {
        await sendOrganizationEmail({
          email: owner.email,
          organizationName: result.organization.name,
          locale: result.organization.locale.toLowerCase() as
            "uz" | "en" | "ru",
          type: "APPROVED",
        });
      } catch (error) {
        console.error("APPROVE ORGANIZATION EMAIL ERROR:", error);
      }
    }

    return NextResponse.json({
      success: true,
      action: "approve",
      organization: {
        id: result.organization.id,
        name: result.organization.name,
        slug: result.organization.slug,
      },
      request: {
        id: result.request.id,
        status: result.request.status,
        reviewedAt: result.request.reviewedAt,
      },
    });
  } catch (error) {
    console.error("REVIEW ORGANIZATION REQUEST ERROR:", error);

    if (error instanceof Error) {
      if (error.message === "REQUEST_NOT_FOUND") {
        return NextResponse.json(
          { error: "REQUEST_NOT_FOUND" },
          { status: 404 },
        );
      }

      if (error.message === "REQUEST_ALREADY_REVIEWED") {
        return NextResponse.json(
          { error: "REQUEST_ALREADY_REVIEWED" },
          { status: 409 },
        );
      }

      if (error.message === "INVALID_SLUG") {
        return NextResponse.json({ error: "INVALID_SLUG" }, { status: 400 });
      }
    }

    // Prisma unique constraint
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "ORGANIZATION_ALREADY_EXISTS" },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
