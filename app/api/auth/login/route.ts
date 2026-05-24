import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export async function POST(req: Request) {
  const { email, password, locale } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  // isActive tekshiruvi valid dan keyin — avval parolni tekshir
  if (!user.isActive) {
    // So'nggi OTP ni tekshir
    const last = await prisma.emailVerification.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (last && last.expiresAt > new Date()) {
      // Hali muddati o'tmagan OTP bor
      return NextResponse.json(
        {
          error: "Email not verified",
          code: "EMAIL_NOT_VERIFIED",
          toast: "existing_otp",
        },
        { status: 403 }
      );
    }

    // Muddati o'tgan → yangi OTP
    const code = generateCode();

    await prisma.emailVerification.create({
      data: {
        email,
        codeHash: hashCode(code),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        attempts: 0,
      },
    });

    await sendVerificationEmail(email, code, locale as "uz" | "en" | "ru");

    return NextResponse.json(
      {
        error: "Email not verified",
        code: "EMAIL_NOT_VERIFIED",
        toast: "new_otp",
      },
      { status: 403 }
    );
  }

  const token = signToken({ userId: user.id });

  const res = NextResponse.json({ success: true });

  res.cookies.set("token", token, {
    httpOnly: true,
    secure: false, // LOCAL DEV
    sameSite: "lax",
    path: "/",
  });

  return res;
}