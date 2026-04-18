

// import type { AuthOptions } from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { prisma } from "@/lib/prisma";
// import { compare } from "bcryptjs";

// export const authOptions: AuthOptions = {
//   adapter: PrismaAdapter(prisma),

//   session: { strategy: "jwt" },

//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       allowDangerousEmailAccountLinking: true,
//       authorization: {
//         params: { prompt: "select_account" },
//       },
//     }),

//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },

//       async authorize(credentials) {
//   if (!credentials?.email || !credentials.password) {
//     throw new Error("Missing credentials");
//   }

//   const user = await prisma.user.findUnique({
//     where: { email: credentials.email },
//   });

//   console.log("CREDENTIAL LOGIN EMAIL:", credentials.email);
//   console.log("USER FOUND:", user);

//   if (!user) throw new Error("No account found with this email");

//   // ✅ 🚨 ADD THIS (VERY IMPORTANT)
//   if (user.status === "SUSPENDED") {
//     throw new Error("Your account has been suspended. Contact support.");
//   }

//   if (!user.emailVerified) {
//     throw new Error("Please verify your email before logging in.");
//   }

//   if (!user.password) {
//     throw new Error("This account uses Google login only.");
//   }

//   const isValid = await compare(credentials.password, user.password);

//   if (!isValid) throw new Error("Invalid email or password");

//   return user;
// },
//     }),
//   ],

//   pages: {
//     signIn: "/login",
//     error: "/login",
//   },

//   callbacks: {

//     /* ================= SIGN-IN ================= */

//     async signIn({ user, account }) {

//   const dbUser = await prisma.user.findUnique({
//     where: { email: user.email! }
//   });

//   // 🚨 BLOCK SUSPENDED USERS
// if (dbUser?.status === "SUSPENDED") {
//   throw new Error("SUSPENDED");
// }

//   if (account?.provider === "google") {

//     if (dbUser && !dbUser.emailVerified) {
//       await prisma.user.update({
//         where: { id: dbUser.id },
//         data: { emailVerified: new Date() }
//       });
//     }

//   }

//   return true;
// },

//     /* ================= JWT ================= */

//     async jwt({ token, user, account }) {

//       console.log("===== JWT CALLBACK =====");

//       /* First login */

//       if (user) {
//         token.id = (user as any).id;
//         token.email = user.email;
//         token.isSuspended = (user as any).isSuspended || false;
//       }

//       /* Google login */

//       if (account?.provider === "google") {

//         const dbUser = await prisma.user.findUnique({
//           where: { email: token.email as string },
//         });

//         if (dbUser) {
//           token.id = dbUser.id;
//         }

//         token.loginType = "google";

//         /* NEW: capture role from login page */
//         token.role = (account as any)?.params?.role || "student";
//       }

//       /* Refresh user data */
// if (token.id) {
//   const dbUser = await prisma.user.findUnique({
//     where: { id: token.id as string },
//     select: {
//       name: true,
//       phone: true,
//       grade: true,
//       image: true,
//       createdAt: true,
//       status: true,
//        suspendedBy: true,
//     },
//   });

//   if (dbUser) {
//     token.name = dbUser.name;
//     token.phone = dbUser.phone;
//     token.grade = dbUser.grade;
//     token.image = dbUser.image;
//     (token as any).createdAt = dbUser.createdAt;

//     // ✅ CRITICAL
//     token.isSuspended = dbUser.status === "SUSPENDED";
//     token.suspendedBy = dbUser.suspendedBy;
//   }
// }

//       console.log("TOKEN BEFORE RETURN:", token);

//       return token;
//     },

//     /* ================= SESSION ================= */

//     async session({ session, token }) {

//       console.log("===== SESSION CALLBACK =====");
//       console.log("Token user id:", token.id);
//       console.log("Session email:", session.user?.email);

//       if (session.user) {

//         (session.user as any).id = token.id as string;
//         (session.user as any).name = token.name as string;
//         (session.user as any).phone = token.phone ?? null;
//         (session.user as any).grade = token.grade ?? null;
//         (session.user as any).image = token.image ?? null;
//         (session.user as any).loginType = token.loginType as string;
//         (session.user as any).createdAt = (token as any).createdAt ?? null;
       
//         (session.user as any).isSuspended = token.isSuspended || false;
//         (session.user as any).suspendedBy = token.suspendedBy;
        
//         /* NEW: expose role to session */
//         (session.user as any).role = token.role ?? "student";

//         if (token.loginType === "google") {
//           (session.user as any).profileIncomplete =
//             !token.phone || !token.grade;
//         } else {
//           (session.user as any).profileIncomplete = false;
//         }
//       }

//       return session;
//     },
//   },
// };

// import { getServerSession } from "next-auth";

// /* GET USER FROM REQUEST */
// export async function getUserFromRequest() {
//   const session = await getServerSession(authOptions);

//   if (!session?.user) {
//     return null;
//   }

//   return {
//     id: (session.user as any).id,
//     email: session.user.email,
//     name: session.user.name,
//   };
// }


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
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: { prompt: "select_account" },
      },
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

        console.log("CREDENTIAL LOGIN EMAIL:", credentials.email);
        console.log("USER FOUND:", user);

        if (!user) throw new Error("No account found with this email");

        // ❌ REMOVED: suspension block (IMPORTANT)

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

    /* ================= SIGN-IN ================= */

    async signIn({ user, account }) {

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email! }
      });

      // ❌ REMOVED: suspension block (IMPORTANT)

      if (account?.provider === "google") {

        if (dbUser && !dbUser.emailVerified) {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { emailVerified: new Date() }
          });
        }

      }

      return true;
    },

    /* ================= JWT ================= */

    async jwt({ token, user, account }) {

      console.log("===== JWT CALLBACK =====");

      /* First login */

      if (user) {
        token.id = (user as any).id;
        token.email = user.email;
      }

      /* Google login */

      if (account?.provider === "google") {

        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
        });

        if (dbUser) {
          token.id = dbUser.id;
        }

        token.loginType = "google";

        token.role = (account as any)?.params?.role || "student";
      }

      /* Refresh user data */

      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            name: true,
            phone: true,
            grade: true,
            image: true,
            createdAt: true,
            status: true,
            suspendedBy: true,
          },
        });

        if (dbUser) {
          token.name = dbUser.name;
          token.phone = dbUser.phone;
          token.grade = dbUser.grade;
          token.image = dbUser.image;
          (token as any).createdAt = dbUser.createdAt;

          // ✅ NEW: store status but DO NOT block login
          token.userStatus = dbUser.status;
          token.suspendedBy = dbUser.suspendedBy;
        }
      }

      console.log("TOKEN BEFORE RETURN:", token);

      return token;
    },

    /* ================= SESSION ================= */

    async session({ session, token }) {

      console.log("===== SESSION CALLBACK =====");

      if (session.user) {

        (session.user as any).id = token.id as string;
        (session.user as any).name = token.name as string;
        (session.user as any).phone = token.phone ?? null;
        (session.user as any).grade = token.grade ?? null;
        (session.user as any).image = token.image ?? null;
        (session.user as any).loginType = token.loginType as string;
        (session.user as any).createdAt = (token as any).createdAt ?? null;

        // ✅ UPDATED
        (session.user as any).userStatus = token.userStatus;
        (session.user as any).suspendedBy = token.suspendedBy;

        (session.user as any).role = token.role ?? "student";

        if (token.loginType === "google") {
          (session.user as any).profileIncomplete =
            !token.phone || !token.grade;
        } else {
          (session.user as any).profileIncomplete = false;
        }
      }

      return session;
    },
  },
};

/* ================= GET USER ================= */

import { getServerSession } from "next-auth";

export async function getUserFromRequest() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  return {
    id: (session.user as any).id,
    email: session.user.email,
    name: session.user.name,
  };
}