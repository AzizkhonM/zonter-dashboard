import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { sendTelegramMessage } from "@/lib/telegram";

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
            authProvider: "GOOGLE",
          },
        });
      } else if (!dbUser.isActive) {
        await prisma.user.update({
          where: { email },
          data: {
            isActive: true,
            authProvider: "GOOGLE",
          },
        });

        dbUser = {
          ...dbUser,
          isActive: true,
          authProvider: "GOOGLE",
        };
      }

      // Telegram notification
      try {
        await sendTelegramMessage(
          `🔐 <b>User logged in</b>\n\n` +
            `👤 <b>Name:</b> ${dbUser.name ?? "Unknown"}\n` +
            `📧 <b>Email:</b> ${dbUser.email}\n` +
            `🆔 <b>User ID:</b> <code>${dbUser.id}</code>\n` +
            `🔑 <b>Provider:</b> Google`
        );
      } catch (error) {
        console.error("Telegram notification failed:", error);
      }

      const token = await signToken({
        userId: dbUser.id,
        role: dbUser.role,
      });

      const cookieStore = await cookies();

      cookieStore.set("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });

      return dbUser.role === "SUPER_ADMIN" ? "/admin" : "/dashboard";
    },

    async redirect({ url, baseUrl }) {
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
