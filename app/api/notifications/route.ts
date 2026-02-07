// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const isTutor = searchParams.get("tutor") === "true";


// /* ===========================
//    TUTOR NOTIFICATIONS
// =========================== */
// if (isTutor) {
//   const token = cookies().get("tutor_token")?.value;

//   if (!token) {
//     console.log("❌ Tutor token missing");
//     return NextResponse.json({ notifications: [] });
//   }

//   const decoded = jwt.verify(
//     token,
//     process.env.JWT_SECRET!
//   ) as { id: string };

//   console.log("✅ Tutor ID from token:", decoded.id);

//   const notifications = await prisma.notification.findMany({
//     where: {
//       tutorId: decoded.id,   // MUST match Notification.tutorId
//     },
//     orderBy: { createdAt: "desc" },
//     take: 20,
//   });

//   console.log("📩 Tutor notifications found:", notifications.length);

//   return NextResponse.json({ notifications });
// }

//     /* ===========================
//        STUDENT NOTIFICATIONS
//     =========================== */
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const notifications = await prisma.notification.findMany({
//       where: {
//         userId: session.user.id,  // ✅ ONLY student-owned
//         tutorId: null,            // ✅ SAFETY (THIS FIXES YOUR BUG)
//       },
//       orderBy: { createdAt: "desc" },
//       take: 20,
//     });

//     return NextResponse.json({ notifications });
//   } catch (err) {
//     console.error("NOTIFICATION FETCH ERROR:", err);
//     return NextResponse.json(
//       { error: "Failed to load notifications" },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isTutor = searchParams.get("tutor") === "true";
    const isAdmin = searchParams.get("admin") === "true";

    /* ===========================
       ADMIN NOTIFICATIONS
    =========================== */
    if (isAdmin) {
      const adminToken = cookies().get("admin_token")?.value;

      if (!adminToken) {
        return NextResponse.json({ notifications: [] });
      }

      jwt.verify(adminToken, process.env.JWT_SECRET!);

      const notifications = await prisma.notification.findMany({
        where: {
          type: "SYSTEM_ANNOUNCEMENT", // 👈 ADMIN ONLY
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      });

      return NextResponse.json({ notifications });
    }

    /* ===========================
       TUTOR NOTIFICATIONS
    =========================== */
    if (isTutor) {
      const token = cookies().get("tutor_token")?.value;

      if (!token) {
        return NextResponse.json({ notifications: [] });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as { id: string };

      const notifications = await prisma.notification.findMany({
        where: {
          tutorId: decoded.id,
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      });

      return NextResponse.json({ notifications });
    }

    /* ===========================
       STUDENT NOTIFICATIONS
    =========================== */
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        tutorId: null, // ✅ IMPORTANT SAFETY
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ notifications });
  } catch (err) {
    console.error("NOTIFICATION FETCH ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load notifications" },
      { status: 500 }
    );
  }
}
