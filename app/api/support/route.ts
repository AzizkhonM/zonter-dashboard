import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    const body = await req.json();
    const { subject, message } = body;

    if (typeof subject !== "string" || typeof message !== "string") {
      return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    }

    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (trimmedSubject.length < 3) {
      return NextResponse.json({ error: "SUBJECT_TOO_SHORT" }, { status: 400 });
    }

    if (trimmedMessage.length < 10) {
      return NextResponse.json({ error: "MESSAGE_TOO_SHORT" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
    }

    const telegramMessage = `
<b>🆘 Zonter Support Request</b>

<b>User:</b> ${user.name}
<b>Email:</b> ${user.email}

<b>Subject:</b>
${trimmedSubject}

<b>Message:</b>
${trimmedMessage}
    `.trim();

    try {
      await sendTelegramMessage(telegramMessage);
    } catch (error) {
      console.error("Telegram support notification error:", error);
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Support request error:", error);

    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
