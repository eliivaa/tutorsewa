import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    // ------------------------------
    // GOOGLE AUTH PROVIDER
    // ------------------------------
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ------------------------------
    // EMAIL + PASSWORD LOGIN
    // ------------------------------
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        // 🚨 MUST VERIFY EMAIL BEFORE LOGIN
        if (!user.emailVerified) {
          throw new Error("Please verify your email before logging in.");
        }

        // Google user has no password → block credential login
        if (!user.password) {
          throw new Error("This account uses Google login only.");
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return user;
      },
    }),
  ],

  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
    error: "/login", // show verification errors on login page
  },

  callbacks: {
    // ======================================================
    // JWT CALLBACK — runs at login & every session refresh
    // ======================================================
    async jwt({ token, user, account }) {

      // MANUAL LOGIN
if (user && account?.provider === "credentials") {
  token.loginType = "manual";
}

      // Track login type (google / credentials)
      if (account) {
        token.loginType = account.provider; // 🔥 IMPORTANT
      }

      // FIRST TIME GOOGLE LOGIN
      if (account?.provider === "google" && user) {
        token.id = user.id;

        let existing = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        // If Google user doesn't exist → create minimal profile
        if (!existing) {
          existing = await prisma.user.create({
            data: {
              name: user.name!,
              email: user.email!,
              image: user.image!,
              phone: null,
              grade: null,
            },
          });
        }

        token.phone = existing.phone;
        token.grade = existing.grade;
        token.image = existing.image;
      }

      // ALWAYS LOAD latest DB values
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
        });

        if (dbUser) {
          token.phone = dbUser.phone;
          token.grade = dbUser.grade;
          token.image = dbUser.image;
        }
      }

      return token;
    },

    // ======================================================
    // SESSION CALLBACK — sends cleaned data to frontend
    // ======================================================
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.phone = token.phone ?? null;
      session.user.grade = token.grade ?? null;
      session.user.image = token.image ?? null;
      session.user.loginType = token.loginType;

      // 🔥 ONLY GOOGLE USERS MUST COMPLETE PROFILE
      if (token.loginType === "google") {
        session.user.profileIncomplete = !token.phone || !token.grade;
      } else {
        // manual registered users already filled phone + grade
        session.user.profileIncomplete = false;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
