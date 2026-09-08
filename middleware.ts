import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

const intlMiddleware = createMiddleware({
  locales: ["uz", "en", "ru"],
  defaultLocale: "uz",
  localePrefix: "as-needed",
  localeDetection: false,
});

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const pathname = req.nextUrl.pathname;

  // Locale'ni olib tashlaymiz
  const pathnameWithoutLocale = pathname.replace(/^\/(en|ru)/, "");

  const isAuthRoute =
    pathnameWithoutLocale.startsWith("/login") ||
    pathnameWithoutLocale.startsWith("/register");

  const isDashboardRoute = pathnameWithoutLocale.startsWith("/dashboard");

  const isAdminRoute = pathnameWithoutLocale.startsWith("/admin");

  // Hozirgi locale
  const locale = pathname.startsWith("/en")
    ? "en"
    : pathname.startsWith("/ru")
    ? "ru"
    : "uz";

  let role: string | null = null;

  // Token mavjud bo'lsa, role'ni tekshiramiz
  if (token) {
    try {
      const decoded = await verifyToken(token);

      // ✅ ROLE mavjudligi tekshirish
      if (decoded && "role" in decoded) {
        role = decoded.role as string;
      } else {
        // Role yo'q → Login page ga
        return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
      }
    } catch (error) {
      console.error("Token verification failed:", error);

      const response = NextResponse.redirect(
        new URL(`/${locale}/login`, req.url)
      );
      response.cookies.delete("token");
      return response;
    }
  }

  // ==========================================
  // USER ROUTE PROTECTION
  // ==========================================

  if (isDashboardRoute && role !== "USER") {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  if (isAdminRoute && role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // ==========================================
  // 1. LOGIN QILMAGAN USER
  // ==========================================

  if (!token) {
    if (isDashboardRoute || isAdminRoute) {
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }

    return intlMiddleware(req);
  }

  // ==========================================
  // 2. USER → /ADMIN GA KIRA OLMAYDI
  // ==========================================

  if (role === "USER" && isAdminRoute) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
  }

  // ==========================================
  // 3. SUPER_ADMIN → /DASHBOARD GA KIRMAYDI
  // ==========================================

  if (role === "SUPER_ADMIN" && isDashboardRoute) {
    return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
  }

  // ==========================================
  // 4. LOGIN/REGISTER GA LOGIN QILGAN USER
  //    QAYTA KIRSA
  // ==========================================

  if (isAuthRoute) {
    if (role === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
    }

    return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
