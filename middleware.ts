import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"

const intlMiddleware = createMiddleware({
  locales: ["uz", "en", "ru"],
  defaultLocale: "uz",
  localePrefix: "as-needed",
  localeDetection: false
})

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  const pathname = req.nextUrl.pathname

  // Locale qismini olib tashlash
  const pathnameWithoutLocale = pathname.replace(
    /^\/(en|ru)/,
    ""
  )

  // Auth pages
  const isAuthRoute =
    pathnameWithoutLocale.startsWith("/login") ||
    pathnameWithoutLocale.startsWith("/register")

  // Protected pages
  const isDashboardRoute =
    pathnameWithoutLocale.startsWith("/dashboard")

  // Locale aniqlash
  const locale =
    pathname.startsWith("/en")
      ? "en"
      : pathname.startsWith("/ru")
      ? "ru"
      : "uz"

  // ❌ No token
  if (!token && isDashboardRoute) {
    return NextResponse.redirect(
      new URL(`/${locale}/login`, req.url)
    )
  }

  // 🔁 Already logged in
  if (token && isAuthRoute) {
    return NextResponse.redirect(
      new URL(`/${locale}/dashboard`, req.url)
    )
  }

  // 🌍 next-intl middleware
  return intlMiddleware(req)
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}