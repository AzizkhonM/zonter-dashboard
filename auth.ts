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

      let dbUser = await prisma.user.findUnique({ where: { email } });

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: { email, name, password: "", isActive: true },
        });
      } else if (!dbUser.isActive) {
        await prisma.user.update({
          where: { email },
          data: { isActive: true },
        });
        dbUser = { ...dbUser, isActive: true };
      }

      const token = signToken({ userId: dbUser.id });

      const cookieStore = await cookies();
      cookieStore.set("token", token, {
        httpOnly: true,
        secure: false, // LOCAL DEV
        sameSite: "lax",
        path: "/",
      });

      return true;
    },

    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
});