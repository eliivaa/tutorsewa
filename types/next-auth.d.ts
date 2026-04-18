import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      phone?: string | null;
      grade?: string | null;
      image?: string | null;
      createdAt?: string | Date | null;
      loginType?: string; 
      profileIncomplete?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    phone?: string | null;
    grade?: string | null;
    image?: string | null;
    createdAt?: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    phone?: string | null;
    grade?: string | null;
    image?: string | null;
    profileIncomplete?: boolean;
    loginType?: string; 
  }
}
