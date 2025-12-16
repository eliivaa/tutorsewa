// import NextAuth, { AuthOptions } from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { prisma } from "@/lib/prisma";
// import { compare } from "bcryptjs";

// export const authOptions: AuthOptions = {
//   adapter: PrismaAdapter(prisma),

//   session: {
//     strategy: "jwt",
//   },

//   providers: [
//     // ==========================
//     // GOOGLE AUTH
//     // ==========================
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),

//     // ==========================
//     // EMAIL + PASSWORD AUTH
//     // ==========================
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },

//       async authorize(credentials) {
//         if (!credentials?.email || !credentials.password) {
//           throw new Error("Missing credentials");
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user) {
//           throw new Error("No account found with this email");
//         }

//         // 🔒 Email must be verified
//         if (!user.emailVerified) {
//           throw new Error("Please verify your email before logging in.");
//         }

//         // 🔐 Block Google-only accounts
//         if (!user.password) {
//           throw new Error("This account uses Google login only.");
//         }

//         const isValid = await compare(credentials.password, user.password);
//         if (!isValid) {
//           throw new Error("Invalid email or password");
//         }

//         return user;
//       },
//     }),
//   ],

//   pages: {
//     signIn: "/login",
//     error: "/login",
//   },

//   callbacks: {
//     // ======================================================
//     // JWT CALLBACK
//     // ======================================================
//     async jwt({ token, user, account }) {
//       // 🔥 ALWAYS set user ID on login
//       if (user) {
//         token.id = user.id;
//       }

//       // Track login type
//       if (account) {
//         token.loginType = account.provider; // "google" | "credentials"
//       }

//       // FIRST-TIME GOOGLE LOGIN
//       if (account?.provider === "google" && user) {
//         let existingUser = await prisma.user.findUnique({
//           where: { email: user.email! },
//         });

//         if (!existingUser) {
//           existingUser = await prisma.user.create({
//             data: {
//               name: user.name!,
//               email: user.email!,
//               image: user.image!,
//               phone: null,
//               grade: null,
//             },
//           });
//         }

//         token.phone = existingUser.phone;
//         token.grade = existingUser.grade;
//         token.image = existingUser.image;
//       }

//       // ALWAYS sync latest DB data
//       if (token.id) {
//         const dbUser = await prisma.user.findUnique({
//           where: { id: token.id },
//         });

//         if (dbUser) {
//           token.phone = dbUser.phone;
//           token.grade = dbUser.grade;
//           token.image = dbUser.image;
//         }
//       }

//       return token;
//     },

//     // ======================================================
//     // SESSION CALLBACK
//     // ======================================================
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         session.user.phone = token.phone ?? null;
//         session.user.grade = token.grade ?? null;
//         session.user.image = token.image ?? null;
//         session.user.loginType = token.loginType as string;

//         // 🔥 Profile completion logic
//         if (token.loginType === "google") {
//           session.user.profileIncomplete = !token.phone || !token.grade;
//         } else {
//           session.user.profileIncomplete = false;
//         }
//       }

//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
