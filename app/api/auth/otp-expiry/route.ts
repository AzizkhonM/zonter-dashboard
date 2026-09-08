import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const record = await prisma.emailVerification.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json(
        { error: "NO_VERIFICATION_FOUND" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      expiresAt: record.expiresAt,
      blockedUntil: record.blockedUntil, // ← SHU KERAK!
    });
  } catch (err) {
    console.error("OTP_EXPIRY_ERROR:", err);
    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}