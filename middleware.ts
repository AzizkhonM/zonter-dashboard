import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["uz", "en", "ru"],
  defaultLocale: "uz",
  localePrefix: "as-needed",
  localeDetection: false,
});

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const isLoggedIn = !!token;

  const pathname = req.nextUrl.pathname;

  const pathnameWithoutLocale = pathname.replace(/^\/(en|ru)/, "");

  const isAuthRoute =
    pathnameWithoutLocale.startsWith("/login") ||
    pathnameWithoutLocale.startsWith("/register");

  const isDashboardRoute = pathnameWithoutLocale.startsWith("/dashboard");

  const locale = pathname.startsWith("/en")
    ? "en"
    : pathname.startsWith("/ru")
    ? "ru"
    : "uz";

  if (!isLoggedIn && isDashboardRoute) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
