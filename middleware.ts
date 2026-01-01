// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(req: NextRequest) {
//   const path = req.nextUrl.pathname;

//   // ================================
//   // ADMIN / TUTOR EXISTING LOGIC
//   // ================================
//   const adminToken = req.cookies.get("admin_token")?.value;
//   const tutorToken = req.cookies.get("tutor_token")?.value;

//   // ❗ Do NOT protect NextAuth internal routes
//   if (path.startsWith("/api/auth")) {
//     return NextResponse.next();
//   }

//   // Public routes
//   if (path === "/admin/login" || path === "/tutor/login") {
//     return NextResponse.next();
//   }

//   // ADMIN protected routes
//   if (path.startsWith("/admin") && !path.startsWith("/api")) {
//     if (!adminToken) {
//       return NextResponse.redirect(new URL("/admin/login", req.url));
//     }
//     return NextResponse.next();
//   }

//   // TUTOR protected routes
//   if (path.startsWith("/tutor/dashboard")) {
//     if (!tutorToken) {
//       return NextResponse.redirect(new URL("/tutor/login", req.url));
//     }
//     return NextResponse.next();
//   }

//   // ================================
//   // USER (GOOGLE LOGIN) PROFILE CHECK
//   // ================================

//   const token = await getToken({
//     req,
//     secret: process.env.NEXTAUTH_SECRET!,
//   });

//   // Only apply this rule to real user routes (not admin/tutor)
//   const userProtectedRoutes = [
//     "/dashboard",
//     "/messages",
//     "/profile",
//     "/thrift",
//     "/payments",
//   ];

//   const mustCheck = userProtectedRoutes.some((route) =>
//     path.startsWith(route)
//   );

//   if (mustCheck) {
//     // User must be logged in via NextAuth
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     // Profile incomplete? -> FORCE user to /complete-profile
//     // if (!token.phone || !token.grade) {
//     //   if (!path.startsWith("/complete-profile")) {
//     //     return NextResponse.redirect(new URL("/complete-profile", req.url));
//     //   }
//     // }

//     // If Google login AND missing phone/grade → force complete-profile
// if (token.loginType === "google") {
//   if (!token.phone || !token.grade) {
//     if (!path.startsWith("/complete-profile")) {
//       return NextResponse.redirect(new URL("/complete-profile", req.url));
//     }
//   }
// }

//   }

//   return NextResponse.next();
// }

// // ROUTES THAT MIDDLEWARE SHOULD ACT ON
// export const config = {
//   matcher: [
//     "/admin/:path*",
//     "/tutor/dashboard/:path*",
//     "/api/admin/:path*",
//     "/dashboard/:path*",
//     "/messages/:path*",
//     "/profile/:path*",
//     "/thrift/:path*",
//     "/payments/:path*",
//     "/complete-profile",
//   ],
// };




// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(req: NextRequest) {
//   const path = req.nextUrl.pathname;

//   const adminToken = req.cookies.get("admin_token")?.value;
//   const tutorToken = req.cookies.get("tutor_token")?.value;

//   // Allow NextAuth routes
//   if (path.startsWith("/api/auth")) return NextResponse.next();

//   // Public login pages
//   if (path === "/admin/login" || path === "/tutor/login") {
//     return NextResponse.next();
//   }

//   // ADMIN PROTECTION
//   if (path.startsWith("/admin")) {
//     if (!adminToken) {
//       return NextResponse.redirect(new URL("/admin/login", req.url));
//     }
//     return NextResponse.next();
//   }

//   // TUTOR PROTECTION
//   if (path.startsWith("/tutor")) {
//     if (!tutorToken) {
//       return NextResponse.redirect(new URL("/tutor/login", req.url));
//     }
//     return NextResponse.next();
//   }

//   // USER (NextAuth) PROTECTION
//   const token = await getToken({
//     req,
//     secret: process.env.NEXTAUTH_SECRET!,
//   });

//   const userRoutes = ["/dashboard", "/messages", "/profile", "/thrift", "/payments"];

//   if (userRoutes.some((r) => path.startsWith(r))) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     if (token.loginType === "google" && (!token.phone || !token.grade)) {
//       return NextResponse.redirect(new URL("/complete-profile", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
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

  const adminToken = req.cookies.get("admin_token")?.value;
  const tutorToken = req.cookies.get("tutor_token")?.value;

  /* =======================
     ALLOW PUBLIC API ROUTES
  ======================= */

  // Allow NextAuth APIs
  if (path.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // ✅ Allow admin login API
  if (path === "/api/admin/login") {
    return NextResponse.next();
  }

  // (optional) allow tutor login API if exists
  if (path === "/api/tutor/login") {
    return NextResponse.next();
  }

  /* =======================
     PUBLIC LOGIN PAGES
  ======================= */

  if (path === "/admin/login" || path === "/tutor/login") {
    return NextResponse.next();
  }

  /* =======================
     ADMIN PROTECTION
  ======================= */

  if (path.startsWith("/admin")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  /* =======================
     TUTOR PROTECTION
  ======================= */

  if (path.startsWith("/tutor")) {
    if (!tutorToken) {
      return NextResponse.redirect(new URL("/tutor/login", req.url));
    }
    return NextResponse.next();
  }

  /* =======================
     USER (NextAuth) PROTECTION
  ======================= */

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  const userRoutes = [
    "/dashboard",
    "/messages",
    "/profile",
    "/thrift",
    "/payments",
  ];

  if (userRoutes.some((r) => path.startsWith(r))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (token.loginType === "google" && (!token.phone || !token.grade)) {
      return NextResponse.redirect(new URL("/complete-profile", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
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
