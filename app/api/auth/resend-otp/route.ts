import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const code = generateCode();

    // Yangi OTP yaratish
    await prisma.emailVerification.create({
      data: {
        email,
        codeHash: hashCode(code),
        expiresAt: new Date(Date.now() + 1 * 60 * 1000),
        attempts: 0,
      },
    });

    await sendVerificationEmail(email, code, "uz");

    return NextResponse.json({
      success: true,
      toast: "new_otp",
      expiresAt: new Date(Date.now() + 1 * 60 * 1000),
    });
  } catch (err) {
    console.error("RESEND_OTP_ERROR:", err);
    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}