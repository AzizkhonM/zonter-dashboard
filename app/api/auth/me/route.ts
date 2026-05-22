import { verifyToken } from "@/lib/jwt"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 🍪 COOKIE (ASYNC FIX)
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value?.trim()

    console.log("🍪 COOKIE TOKEN:", token)

    if (!token) {
      return NextResponse.json(
        { user: null, step: "no_token" },
        { status: 401 }
      )
    }

    let decoded: any

    try {
      decoded = verifyToken(token)
      console.log("🔓 DECODED:", decoded)
    } catch (err) {
      return NextResponse.json(
        { user: null, step: "invalid_token" },
        { status: 401 }
      )
    }

    if (!decoded?.userId) {
      return NextResponse.json(
        { user: null, step: "no_userId" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    return NextResponse.json({
      user,
      step: "ok",
    })
  } catch (err) {
    console.log("💥 ERROR:", err)

    return NextResponse.json(
      { user: null, step: "server_error" },
      { status: 500 }
    )
  }
}