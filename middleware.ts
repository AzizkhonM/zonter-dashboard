import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  const { pathname } = req.nextUrl

  // 🔐 Auth pages
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")

  // 🔒 Protected dashboard routes
  const isDashboardRoute =
    pathname.startsWith("/dashboard")

  // ❌ Token yo‘q → dashboardga kiritmaslik
  if (!token && isDashboardRoute) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // 🔁 Token bor → login/registerga kiritmaslik
  if (token && isAuthRoute) {
    const url = req.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}