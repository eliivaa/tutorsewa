// import NextAuth, { DefaultSession } from "next-auth";

// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;   // ✅ Already correct
//       phone?: string | null;
//       grade?: string | null;
//     };
//   }

//   interface User {
//     id: string;
//     image?: string | null;     // ✅ ADD THIS
//     phone?: string | null;
//     grade?: string | null;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//     image?: string | null;     // ⛔ REQUIRED FOR PHOTO
//     phone?: string | null;
//     grade?: string | null;
//   }
// }


import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phone?: string | null;
      grade?: string | null;
    };
  }

  interface User {
    id: string;
    phone?: string | null;
    grade?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    phone?: string | null;
    grade?: string | null;
    image?: string | null;
  }
}
