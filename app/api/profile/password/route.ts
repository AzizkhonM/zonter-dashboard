import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return NextResponse.json({ error: "INVALID_PASSWORD" }, { status: 400 });
    }

    if (
      currentPassword.length < 8 ||
      newPassword.length < 8 ||
      confirmPassword.length < 8
    ) {
      return NextResponse.json(
        { error: "PASSWORD_TOO_SHORT" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "PASSWORD_MISMATCH" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        password: true,
        authProvider: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
    }

    if (user.authProvider === "GOOGLE") {
      return NextResponse.json({ error: "GOOGLE_ACCOUNT" }, { status: 400 });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: "INVALID_CURRENT_PASSWORD" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const updatedUser = await prisma.user.update({
      where: {
        id: payload.userId,
      },
      data: {
        password: hashedPassword,
      },
      select: {
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error) {
    console.error("Password update error:", error);

    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
