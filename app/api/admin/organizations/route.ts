import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {
  try {
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

    if (!decoded?.userId || decoded.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "FORBIDDEN" },
        { status: 403 },
      );
    }

    const organizations = await prisma.organization.findMany({
      orderBy: {
        createdAt: "desc",
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
          where: {
            role: "OWNER",
          },
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          take: 1,
        },

        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    const result = organizations.map((organization) => ({
      ...organization,
      owner: organization.members[0]?.user ?? null,
      members: undefined,
    }));

    return NextResponse.json({
      success: true,
      organizations: result,
    });
  } catch (error) {
    console.error("GET ADMIN ORGANIZATIONS ERROR:", error);

    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 },
    );
  }
}
