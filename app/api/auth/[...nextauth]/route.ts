// import NextAuth from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { prisma } from "@/lib/prisma";
// import { compare } from "bcrypt";

// const handler = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     // 🔹 Google OAuth
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     // 🔹 Email/Password Login
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         const user = await prisma.user.findUnique({
//           where: { email: credentials?.email },
//         });
//         if (!user || !user.password) throw new Error("User not found");

//         const isValid = await compare(credentials!.password, user.password);
//         if (!isValid) throw new Error("Invalid credentials");

//         return user;
//       },
//     }),
//   ],
//   session: { strategy: "jwt" },
//   pages: { signIn: "/login" },
// });

// export { handler as GET, handler as POST };


import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // ❗ If user exists but has no password (Google login user)
        if (!user || !user.password) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return user;
      },
    }),
  ],

  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
  },

  callbacks: {
  async jwt({ token, user }) {
    // When user logs in (first time), attach user.id to JWT
    if (user) {
      token.id = user.id; 
    }
    return token;
  },

  async session({ session, token }) {
    // Ensure session user object exists
    if (!session.user) {
      session.user = {};
    }

    // Attach token.id → session.user.id
    session.user.id = token.id as string;

    return session;
  },
},



});

export { handler as GET, handler as POST };
