import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      const email = user.email!;
      const name = user.name ?? "";

      let dbUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            email,
            name,
            password: "",
            isActive: true,
          },
        });
      } else if (!dbUser.isActive) {
        await prisma.user.update({
          where: { email },
          data: { isActive: true },
        });

        dbUser = {
          ...dbUser,
          isActive: true,
        };
      }

      const token = await signToken({
        userId: dbUser.id,
        role: dbUser.role,
      });

      const cookieStore = await cookies();

      cookieStore.set("token", token, {
        httpOnly: true,
        secure: false, // LOCAL DEV
        sameSite: "lax",
        path: "/",
      });

      // Role bo'yicha redirect
      return dbUser.role === "SUPER_ADMIN"
        ? "/admin"
        : "/dashboard";
    },

    async redirect({ url, baseUrl }) {
      // signIn callback'dan qaytgan URL'ni saqlab qolamiz
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (url.startsWith(baseUrl)) {
        return url;
      }

      return `${baseUrl}/dashboard`;
    },
  },
});