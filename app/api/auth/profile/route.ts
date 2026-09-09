import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 🍪 COOKIE
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value?.trim();

    if (!token) {
      return NextResponse.json(
        { user: null, error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    // 🔓 VERIFY TOKEN
    let decoded: any;

    try {
      decoded = await verifyToken(token);
    } catch {
      return NextResponse.json(
        { user: null, error: "INVALID_TOKEN" },
        { status: 401 }
      );
    }

    if (!decoded?.userId) {
      return NextResponse.json(
        { user: null, error: "INVALID_TOKEN" },
        { status: 401 }
      );
    }

    // 👤 GET PROFILE
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { user: null, error: "USER_NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user,
    });
  } catch (err) {
    console.error("💥 PROFILE ERROR:", err);

    return NextResponse.json(
      { user: null, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}