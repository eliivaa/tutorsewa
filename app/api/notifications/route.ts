
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
//     const isAdmin = searchParams.get("admin") === "true";

//     /* ===========================
//        ADMIN NOTIFICATIONS
//     =========================== */
//     if (isAdmin) {
//       const adminToken = cookies().get("admin_token")?.value;

//       if (!adminToken) {
//         return NextResponse.json({ notifications: [] });
//       }

//       jwt.verify(adminToken, process.env.JWT_SECRET!);

//       const notifications = await prisma.notification.findMany({
//         where: {
//           type: "SYSTEM_ANNOUNCEMENT", // 👈 ADMIN ONLY
//         },
//         orderBy: { createdAt: "desc" },
//         take: 20,
//       });

//       return NextResponse.json({ notifications });
//     }

//     /* ===========================
//        TUTOR NOTIFICATIONS
//     =========================== */
//     if (isTutor) {
//       const token = cookies().get("tutor_token")?.value;

//       if (!token) {
//         return NextResponse.json({ notifications: [] });
//       }

//       const decoded = jwt.verify(
//         token,
//         process.env.JWT_SECRET!
//       ) as { id: string };

//       const notifications = await prisma.notification.findMany({
//         where: {
//           tutorId: decoded.id,
//         },
//         orderBy: { createdAt: "desc" },
//         take: 20,
//       });

//       return NextResponse.json({ notifications });
//     }

//     /* ===========================
//        STUDENT NOTIFICATIONS
//     =========================== */
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const notifications = await prisma.notification.findMany({
//       where: {
//         userId: session.user.id,
//         tutorId: null, // ✅ IMPORTANT SAFETY
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

    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");
    const filter = searchParams.get("filter") || "all";
    const sort = searchParams.get("sort") || "latest";
    const recentOnly = searchParams.get("recentOnly") === "true";

    const skip = (page - 1) * limit;

    let where: any = {};

    /* ================= ROLE CHECK ================= */

    if (isAdmin) {
      const adminToken = cookies().get("admin_token")?.value;

      if (!adminToken) {
        return NextResponse.json({ notifications: [], hasMore: false });
      }

      try {
  jwt.verify(adminToken, process.env.JWT_SECRET!);
} catch {
  return NextResponse.json({ notifications: [], hasMore: false });
}

      where.isForAdmin = true;
    } else if (isTutor) {
      const tutorToken = cookies().get("tutor_token")?.value;

      if (!tutorToken) {
        return NextResponse.json({ notifications: [], hasMore: false });
      }

      const decoded = jwt.verify(
        tutorToken,
        process.env.JWT_SECRET!
      ) as { id: string };

      where.tutorId = decoded.id;
    } else {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      where.userId = session.user.id;
    }

    /* ================= FILTER ================= */

    if (filter === "read") {
      where.isRead = true;
    } else if (filter === "unread") {
      where.isRead = false;
    }

    /* ================= RECENT ONLY ================= */

 if (recentOnly) {
  where = {
    ...where,
    createdAt: {
      gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  };
}

    /* ================= SORT ================= */

    const orderBy = {
      createdAt: sort === "oldest" ? "asc" : "desc",
    } as const;

    /* ================= QUERY ================= */

   const notifications = await prisma.notification.findMany({
  where,
  orderBy,
  skip,
  take: limit,
  select: {
    id: true,
    title: true,
    message: true,
    type: true,
    isRead: true,
    createdAt: true,
    actionUrl: true,
  },
});

    const total = await prisma.notification.count({ where });
    const hasMore = total > page * limit;

    return NextResponse.json({
      notifications,
      total,
      page,
      hasMore,
    });
  } catch (err) {
    console.error("NOTIFICATION FETCH ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load notifications" },
      { status: 500 }
    );
  }
}