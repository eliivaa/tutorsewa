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

//       // Always show account chooser
//       authorization: {
//         params: {
//           prompt: "select_account",
//         },
//       },
//     }),

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

//         // Email must be verified
//         if (!user.emailVerified) {
//           throw new Error("Please verify your email before logging in.");
//         }

//         // Prevent password login for Google users
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
//     /**
//      * SIGN-IN CALLBACK
//      */
//     async signIn({ user, account }) {
//       if (account?.provider === "google") {
//         const existingUser = await prisma.user.findUnique({
//           where: { email: user.email! },
//         });

//         // If email already belongs to credentials account → block Google login
//         if (existingUser && existingUser.password) {
//           return false;
//         }

//         // Ensure provider is set correctly
//         if (existingUser && existingUser.authProvider !== "GOOGLE") {
//           await prisma.user.update({
//             where: { email: user.email! },
//             data: {
//               authProvider: "GOOGLE",
//               emailVerified: new Date(),
//             },
//           });
//         }
//       }

//       return true;
//     },

//     /**
//      * JWT CALLBACK
//      */
//     async jwt({ token, user, account }) {
//       // Initial login
//       if (user) {
//         token.id = (user as any).id;
//       }

//       if (account) {
//         token.loginType = account.provider;
//       }

//       // Always sync latest DB values
//       if (token.id) {
//         const dbUser = await prisma.user.findUnique({
//           where: { id: token.id as string },
//           select: {
//             name: true,
//             phone: true,
//             grade: true,
//             image: true,
//             createdAt: true,
//           },
//         });

//         if (dbUser) {
//           token.name = dbUser.name;
//           token.phone = dbUser.phone;
//           token.grade = dbUser.grade;
//           token.image = dbUser.image;
//           (token as any).createdAt = dbUser.createdAt;
//         }
//       }

//       return token;
//     },

//     /**
//      * SESSION CALLBACK
//      */
//     async session({ session, token }) {
//       if (session.user) {
//         (session.user as any).id = token.id as string;
//         (session.user as any).name = token.name as string;
//         (session.user as any).phone = token.phone ?? null;
//         (session.user as any).grade = token.grade ?? null;
//         (session.user as any).image = token.image ?? null;
//         (session.user as any).loginType = token.loginType as string;
//         (session.user as any).createdAt = (token as any).createdAt ?? null;

//         // Google users require profile completion
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
    /**
     * SIGN-IN CALLBACK
     */
   async signIn({ user, account }) {

  if (account?.provider === "google") {

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! }
    });

    if (dbUser && !dbUser.emailVerified) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { emailVerified: new Date() }
      });
    }

  }

  return true;
},
    /**
     * JWT CALLBACK
     */
 
async jwt({ token, user, account }) {
  console.log("===== JWT CALLBACK =====");

  // When login first happens
  if (user) {
    token.id = (user as any).id;
    token.email = user.email;
  }

  // When Google login happens
  if (account?.provider === "google") {
    const dbUser = await prisma.user.findUnique({
      where: { email: token.email as string },
    });

    if (dbUser) {
      token.id = dbUser.id;
    }

    token.loginType = "google";
  }

  // Always refresh user data from DB
  if (token.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: token.id as string },
      select: {
        name: true,
        phone: true,
        grade: true,
        image: true,
        createdAt: true,
      },
    });

    if (dbUser) {
      token.name = dbUser.name;
      token.phone = dbUser.phone;
      token.grade = dbUser.grade;
      token.image = dbUser.image;
      (token as any).createdAt = dbUser.createdAt;
    }
  }

  console.log("TOKEN BEFORE RETURN:", token);

  return token;
},



    /**
     * SESSION CALLBACK
     */
    async session({ session, token }) {
      console.log("===== SESSION CALLBACK =====");
      console.log("Token user id:", token.id);
      console.log("Session email:", session.user?.email);

      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).name = token.name as string;
        (session.user as any).phone = token.phone ?? null;
        (session.user as any).grade = token.grade ?? null;
        (session.user as any).image = token.image ?? null;
        (session.user as any).loginType = token.loginType as string;
        (session.user as any).createdAt = (token as any).createdAt ?? null;

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

