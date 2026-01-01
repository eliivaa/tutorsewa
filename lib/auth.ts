import type { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: { strategy: "jwt" },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("No account found with this email");

        if (!user.emailVerified) {
          throw new Error("Please verify your email before logging in.");
        }

        if (!user.password) {
          throw new Error("This account uses Google login only.");
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid email or password");

        return user;
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) token.id = (user as any).id;

      if (account) token.loginType = account.provider;

      if (account?.provider === "google" && user) {
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          existingUser = await prisma.user.create({
            data: {
              name: user.name!,
              email: user.email!,
              image: user.image!,
              phone: null,
              grade: null,
            },
          });
        }

        token.phone = existingUser.phone;
        token.grade = existingUser.grade;
        token.image = existingUser.image;
      }

      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
        });

        if (dbUser) {
          token.phone = dbUser.phone;
          token.grade = dbUser.grade;
          token.image = dbUser.image;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).phone = (token as any).phone ?? null;
        (session.user as any).grade = (token as any).grade ?? null;
        (session.user as any).image = (token as any).image ?? null;
        (session.user as any).loginType = (token as any).loginType as string;

        if ((token as any).loginType === "google") {
          (session.user as any).profileIncomplete = !(token as any).phone || !(token as any).grade;
        } else {
          (session.user as any).profileIncomplete = false;
        }
      }

      return session;
    },
  },
};
