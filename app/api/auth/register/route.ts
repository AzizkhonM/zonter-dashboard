import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
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
    const { email, password, name, locale } = await req.json();

    const existing = await prisma.user.findUnique({ where: { email } });

    // CASE 1: aktiv user → block
    if (existing?.isActive) {
      return NextResponse.json(
        { error: "USER_EXISTS" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // CASE 2: user bor lekin aktiv emas → update
    if (existing && !existing.isActive) {
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword, name },
      });
    } else {
      // CASE 3: yangi user → create
      await prisma.user.create({
        data: { email, password: hashedPassword, name, isActive: false },
      });
    }

    // ❗ So'nggi verification row'ni tekshir
    const lastVerification = await prisma.emailVerification.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    // Hali muddati o'tmagan OTP bor
    if (lastVerification && lastVerification.expiresAt > new Date()) {
      return NextResponse.json({
        success: true,
        toast: "existing_otp", // frontend toast uchun signal
        message: "Verification code already sent",
      });
    }

    // Muddati o'tgan yoki umuman yo'q → yangi OTP
    const code = generateCode();

    await prisma.emailVerification.create({
      data: {
        email,
        codeHash: hashCode(code),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        attempts: 0,
      },
    });

    // DEV ONLY
    await sendVerificationEmail(email, code, locale as "uz" | "en" | "ru");

    return NextResponse.json({
      success: true,
      toast: "new_otp",
      message: "Verification code sent to email",
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}