import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { signToken } from "@/lib/jwt"

export async function POST(req: Request) {
  const { email, password, name } = await req.json()

  // 1. check existing user
  const existing = await prisma.user.findUnique({
    where: { email },
  })

  if (existing) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 400 }
    )
  }

  // 2. hash password
  const hashed = await bcrypt.hash(password, 10)

  // 3. create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
    },
  })

  // 4. create JWT (AUTO LOGIN)
  const token = signToken({
    userId: user.id
  })

  // 5. response
  const res = NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  })

  // 6. set cookie
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: false, // dev uchun
    sameSite: "lax",
    path: "/",
  })

  return res
}