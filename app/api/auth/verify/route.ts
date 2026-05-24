import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { signToken } from "@/lib/jwt";

function hashCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export async function POST(req: Request) {
  const { email, code } = await req.json();

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

  // 1. BLOCK CHECK (MUST BE FIRST)
  if (record.blockedUntil && record.blockedUntil > new Date()) {
    return NextResponse.json(
      { error: "TOO_MANY_ATTEMPTS" },
      { status: 429 }
    );
  }

  // 2. EXPIRE CHECK
  if (record.expiresAt < new Date()) {
    return NextResponse.json({ error: "CODE_EXPIRED" }, { status: 400 });
  }

  // 3. VALIDATE
  const isValid = record.codeHash === hashCode(code);

  // 4. IF WRONG → increase attempts
  if (!isValid) {
    const newAttempts = record.attempts + 1;

    // if limit reached → block
    if (newAttempts >= 5) {
      await prisma.emailVerification.update({
        where: { id: record.id },
        data: {
          attempts: newAttempts,
          blockedUntil: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      return NextResponse.json(
        { error: "TOO_MANY_ATTEMPTS" },
        { status: 429 }
      );
    }

    await prisma.emailVerification.update({
      where: { id: record.id },
      data: { attempts: newAttempts },
    });

    return NextResponse.json({ error: "INVALID_CODE" }, { status: 400 });
  }

  // 5. SUCCESS → activate user
  const user = await prisma.user.update({
    where: { email },
    data: { isActive: true },
  });

  // optional cleanup
  await prisma.emailVerification.delete({
    where: { id: record.id },
  });

  const token = signToken({ userId: user.id });

  const res = NextResponse.json({ success: true });

  res.cookies.set("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  return res;
}
