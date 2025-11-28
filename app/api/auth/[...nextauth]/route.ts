// import NextAuth, { AuthOptions } from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { prisma } from "@/lib/prisma";
// import { compare } from "bcrypt";

// export const authOptions: AuthOptions = {
//   adapter: PrismaAdapter(prisma),

//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),

//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user || !user.password) return null;

//         const isValid = await compare(credentials.password, user.password);
//         if (!isValid) return null;

//         return user;
//       },
//     }),
//   ],

//   session: { strategy: "jwt" },

//   pages: {
//     signIn: "/login",
//   },

//   callbacks: {
//     async jwt({ token }) {
//   if (token.id) {
//     const dbUser = await prisma.user.findUnique({
//       where: { id: token.id },
//       select: { phone: true, grade: true, image: true },
//     });

//     if (dbUser) {
//       token.phone = dbUser.phone;
//       token.grade = dbUser.grade;
//       token.image = dbUser.image;
//     }
//   }
//   return token;
// },

// async session({ session, token }) {
//   session.user.id = token.id as string;
//   session.user.phone = token.phone ?? null;
//   session.user.grade = token.grade ?? null;
//   session.user.image = token.image ?? null;
//   return session;
// },
//   },
// }

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };



import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";

export const authOptions: AuthOptions = {
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
        if (!credentials?.email) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        if (user.password && credentials?.password) {
          const isValid = await compare(credentials.password, user.password);
          if (!isValid) return null;
        }

        return user;
      },
    }),
  ],

  session: { strategy: "jwt" },
  pages: { signIn: "/login" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;

      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { phone: true, grade: true, image: true },
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
      session.user.id = token.id;
      session.user.phone = token.phone ?? null;
      session.user.grade = token.grade ?? null;
      session.user.image = token.image ?? null;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
