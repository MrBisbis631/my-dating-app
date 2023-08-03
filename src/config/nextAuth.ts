import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/services/prismaClient";
import { env } from "@/env.mjs";
import {
  getAuthorizedUser,
  Credentials as AuthorizationCredentials,
} from "@/lib/auth/authorization";
import { getRandomProfileImageUrl } from "@/lib/images";

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
    updateAge: 6 * 60 * 60, // 6 hours
  },
  callbacks: {
    session: ({ session, token }) => {
      if (token) {
        return {
          ...session,
          user: {
            ...session.user,
            role: token.role,
            id: token.id,
          },
        };
      }
      return session;
    },
    jwt: ({ token, user }) => {
      const u = user as unknown as any;
      if (user) {
        return {
          ...token,
          role: u.role,
          id: u.id,
          image: u.client?.photoUrl || u.image || getRandomProfileImageUrl(),
        };
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (
          !credentials ||
          !credentials.email ||
          !credentials.password ||
          !credentials.role
        ) {
          return null;
        }
        return await getAuthorizedUser(credentials as AuthorizationCredentials);
      },
    }),
  ],
};
