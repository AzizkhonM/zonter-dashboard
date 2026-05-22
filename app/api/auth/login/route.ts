import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { signToken } from "@/lib/jwt"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, user.password)

  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = signToken({ userId: user.id})

  const res = NextResponse.json({ success: true })

  res.cookies.set("token", token, {
    httpOnly: true,
    secure: false, // LOCAL DEV
    sameSite: "lax",
    path: "/",
  })

  return res
}