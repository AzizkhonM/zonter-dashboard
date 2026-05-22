import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  const { pathname } = req.nextUrl

  // 🔓 Public routes (auth talab qilinmaydi)
  const isPublicRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")

  // ❌ NO TOKEN → faqat public route’lar ochiq
  if (!token && !isPublicRoute) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // 🔁 TOKEN BOR → login/register ga kirsa home yoki dashboardga yuborish
  if (token && isPublicRoute) {
    const url = req.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// ⚙️ qaysi route’larda ishlaydi
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}