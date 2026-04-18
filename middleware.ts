// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(req: NextRequest) {
//   const path = req.nextUrl.pathname;

//   // Allow socket connections
//   if (path.startsWith("/api/socket")) {
//     return NextResponse.next();
//   }

//   // Allow NextAuth routes
// if (path.startsWith("/api/auth")) {
//   return NextResponse.next();
// }
//   const adminToken = req.cookies.get("admin_token")?.value;
//   const tutorToken = req.cookies.get("tutor_token")?.value;

//   /* =======================
//      PUBLIC ADMIN API
//   ======================= */

//   if (path === "/api/admin/login") {
//     return NextResponse.next();
//   }

//   /* =======================
//      ADMIN API PROTECTION
//   ======================= */

//   if (path.startsWith("/api/admin")) {
//     if (!adminToken) {
//       return NextResponse.json(
//         { error: "Unauthorized (Admin)" },
//         { status: 401 }
//       );
//     }
//     return NextResponse.next();
//   }

//   /* =======================
//      TUTOR API PROTECTION
//   ======================= */

//   if (path.startsWith("/api/tutor")) {

//   // Public tutor endpoints
//   if (
//     path.startsWith("/api/tutor/list") ||
//     path.match(/^\/api\/tutor\/[^/]+$/) || // /api/tutor/:id
//     path.match(/^\/api\/tutor\/[^/]+\/reviews$/) || // reviews
//     path === "/api/tutor/login" ||
//     path === "/api/tutor/register"||
//     path === "/api/tutor/google-login"
//   ) {
//     return NextResponse.next();
//   }

//   // Tutor protected APIs
//   if (!tutorToken) {
//     return NextResponse.json(
//       { error: "Unauthorized (Tutor)" },
//       { status: 401 }
//     );
//   }

//   return NextResponse.next();
// }

//   /* =======================
//      PUBLIC LOGIN PAGES
//   ======================= */
// if (
//   path === "/admin/login" ||
//   path === "/tutor/login" ||
//   path === "/tutor/register" ||
//   path === "/tutor/auth"
// ) {
//   return NextResponse.next();
// }

//   /* =======================
//      ADMIN PAGE PROTECTION
//   ======================= */

//   if (path.startsWith("/admin")) {
//     if (!adminToken) {
//       return NextResponse.redirect(new URL("/admin/login", req.url));
//     }
//     return NextResponse.next();
//   }

//   /* =======================
//      TUTOR PAGE PROTECTION
//   ======================= */

//   if (path.startsWith("/tutor")) {
//     if (!tutorToken) {
//       return NextResponse.redirect(new URL("/tutor/login", req.url));
//     }
//     return NextResponse.next();
//   }

//   /* =======================
//      USER AUTH (NextAuth)
//   ======================= */

//   const token = await getToken({
//     req,
//     secret: process.env.NEXTAUTH_SECRET!,
//   });


  

//   /* =======================
//      COMPLETE PROFILE PAGE
//   ======================= */

//   if (path === "/complete-profile") {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     return NextResponse.next();
//   }

//   /* =======================
//      USER PROTECTED ROUTES
//   ======================= */

//   const userRoutes = [
//     "/dashboard",
//     "/messages",
//     "/profile",
//     "/thrift",
//     "/payments",
//   ];

//   if (userRoutes.some((route) => path.startsWith(route))) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     // enforce profile completion for Google login
//     if (
//       token.loginType === "google" &&
//       (!token.phone || !token.grade) &&
//       path !== "/complete-profile"
//     ) {
//       return NextResponse.redirect(new URL("/complete-profile", req.url));
//     }
//   }

//   if (userRoutes.some((route) => path.startsWith(route))) {
//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   // 🚨 BLOCK SUSPENDED USERS HERE
//   if ((token as any).isSuspended) {
//     return NextResponse.redirect(
//       new URL("/account-suspended", req.url)
//     );
//   }

//   // existing logic
//   if (
//     token.loginType === "google" &&
//     (!token.phone || !token.grade) &&
//     path !== "/complete-profile"
//   ) {
//     return NextResponse.redirect(new URL("/complete-profile", req.url));
//   }
// }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/api/socket/:path*",
//     "/api/admin/:path*",
//     "/api/tutor/:path*",
//     "/admin/:path*",
//     "/tutor/:path*",
//     "/dashboard/:path*",
//     "/messages/:path*",
//     "/profile/:path*",
//     "/thrift/:path*",
//     "/payments/:path*",
//     "/complete-profile",
//   ],
// };



import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Allow socket connections
  if (path.startsWith("/api/socket")) {
    return NextResponse.next();
  }

  // Allow NextAuth routes
if (path.startsWith("/api/auth")) {
  return NextResponse.next();
}
  const adminToken = req.cookies.get("admin_token")?.value;
  const tutorToken = req.cookies.get("tutor_token")?.value;

  /* =======================
     PUBLIC ADMIN API
  ======================= */

  if (path === "/api/admin/login") {
    return NextResponse.next();
  }

  /* =======================
     ADMIN API PROTECTION
  ======================= */

  if (path.startsWith("/api/admin")) {
    if (!adminToken) {
      return NextResponse.json(
        { error: "Unauthorized (Admin)" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  /* =======================
     TUTOR API PROTECTION
  ======================= */

  if (path.startsWith("/api/tutor")) {

  // Public tutor endpoints
  if (
    path.startsWith("/api/tutor/list") ||
    path.match(/^\/api\/tutor\/[^/]+$/) || // /api/tutor/:id
    path.match(/^\/api\/tutor\/[^/]+\/reviews$/) || // reviews
    path === "/api/tutor/login" ||
    path === "/api/tutor/register"||
    path === "/api/tutor/google-login"
  ) {
    return NextResponse.next();
  }

  // Tutor protected APIs
  if (!tutorToken) {
    return NextResponse.json(
      { error: "Unauthorized (Tutor)" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

  /* =======================
     PUBLIC LOGIN PAGES
  ======================= */
if (
  path === "/admin/login" ||
  path === "/tutor/login" ||
  path === "/tutor/register" ||
  path === "/tutor/auth"
) {
  return NextResponse.next();
}

  /* =======================
     ADMIN PAGE PROTECTION
  ======================= */

  if (path.startsWith("/admin")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  /* =======================
     TUTOR PAGE PROTECTION
  ======================= */

  if (path.startsWith("/tutor")) {
    if (!tutorToken) {
      return NextResponse.redirect(new URL("/tutor/login", req.url));
    }
    return NextResponse.next();
  }

  /* =======================
     USER AUTH (NextAuth)
  ======================= */

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET!,
  });


  

  /* =======================
     COMPLETE PROFILE PAGE
  ======================= */

  if (path === "/complete-profile") {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  }

  /* =======================
     USER PROTECTED ROUTES
  ======================= */
const userRoutes = [
  "/dashboard",
  "/messages",
  "/profile",
  "/thrift",
  "/payments",
];

if (userRoutes.some((route) => path.startsWith(route))) {

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🚫 ONLY block student features
  if ((token as any).userStatus === "SUSPENDED") {
    return NextResponse.redirect(
      new URL("/account-suspended", req.url)
    );
  }

  // existing profile check
  if (
    token.loginType === "google" &&
    (!token.phone || !token.grade) &&
    path !== "/complete-profile"
  ) {
    return NextResponse.redirect(new URL("/complete-profile", req.url));
  }
}

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/socket/:path*",
    "/api/admin/:path*",
    "/api/tutor/:path*",
    "/admin/:path*",
    "/tutor/:path*",
    "/dashboard/:path*",
    "/messages/:path*",
    "/profile/:path*",
    "/thrift/:path*",
    "/payments/:path*",
    "/complete-profile",
  ],
};

