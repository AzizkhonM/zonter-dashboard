import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload?.userId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const { name } = await req.json();

    if (typeof name !== "string") {
      return NextResponse.json({ error: "INVALID_NAME" }, { status: 400 });
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 4) {
      return NextResponse.json({ error: "NAME_TOO_SHORT" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: {
        id: payload.userId,
      },
      data: {
        name: trimmedName,
      },
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile update error:", error);

    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
