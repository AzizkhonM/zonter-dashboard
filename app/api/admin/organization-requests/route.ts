import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    // 1. Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value?.trim();

    if (!token) {
      return NextResponse.json(
        { error: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    let decoded;

    try {
      decoded = await verifyToken(token);
    } catch {
      return NextResponse.json(
        { error: "INVALID_TOKEN" },
        { status: 401 },
      );
    }

    if (!decoded?.userId) {
      return NextResponse.json(
        { error: "INVALID_TOKEN" },
        { status: 401 },
      );
    }

    // 2. SUPER_ADMIN only
    if (decoded.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "FORBIDDEN" },
        { status: 403 },
      );
    }

    // 3. Get requests
    const requests = await prisma.organizationRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        logoUrl: true,
        type: true,
        affiliatedOrganization: true,
        website: true,
        country: true,
        region: true,
        city: true,
        reason: true,

        status: true,

        reviewedById: true,
        reviewedAt: true,
        reviewNote: true,

        createdAt: true,
        updatedAt: true,

        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error(
      "GET ORGANIZATION REQUESTS ERROR:",
      error,
    );

    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 },
    );
  }
}
