// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";

// export async function PATCH(req: Request) {
//   try {
//     const { id } = await req.json();

//     if (!id) {
//       return NextResponse.json({ error: "Missing id" }, { status: 400 });
//     }

//     let where: any = { id };

//     /* ================= ROLE CHECK (FIXED ORDER) ================= */

//     // ADMIN FIRST
//     const adminToken = cookies().get("admin_token")?.value;

//     if (adminToken) {
//       try {
//         jwt.verify(adminToken, process.env.JWT_SECRET!);
//         where.isForAdmin = true;
//       } catch {
//         return NextResponse.json({ error: "Invalid admin token" }, { status: 401 });
//       }
//     }

//     // TUTOR SECOND
//     else if (cookies().get("tutor_token")) {
//       try {
//         const decoded = jwt.verify(
//           cookies().get("tutor_token")!.value,
//           process.env.JWT_SECRET!
//         ) as { id: string };

//         where.tutorId = decoded.id;
//       } catch {
//         return NextResponse.json({ error: "Invalid tutor token" }, { status: 401 });
//       }
//     }

//     // STUDENT LAST
//     else {
//       const session = await getServerSession(authOptions);

//       if (!session?.user?.id) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//       }

//       where.userId = session.user.id;
//     }

//     /* ================= UPDATE ================= */

//     await prisma.notification.updateMany({
//       where,
//       data: { isRead: true },
//     });

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("READ ERROR:", err);
//     return NextResponse.json({ error: "Failed" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Notification ID required" },
        { status: 400 }
      );
    }

    /* ================= AUTH CHECK ================= */

    let isAuthorized = false;

    // ADMIN
    const adminToken = cookies().get("admin_token")?.value;
    if (adminToken) {
      try {
        jwt.verify(adminToken, process.env.JWT_SECRET!);
        isAuthorized = true;
      } catch {}
    }

    // TUTOR
    const tutorToken = cookies().get("tutor_token")?.value;
    if (!isAuthorized && tutorToken) {
      try {
        jwt.verify(tutorToken, process.env.JWT_SECRET!);
        isAuthorized = true;
      } catch {}
    }

    // STUDENT
    if (!isAuthorized) {
      const session = await getServerSession(authOptions);
      if (session?.user?.id) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ================= UPDATE ================= */

    const result = await prisma.notification.updateMany({
      where: {
        id, // ✅ ONLY ID (fixes your issue)
      },
      data: {
        isRead: true,
      },
    });

    console.log("UPDATED COUNT:", result.count);

    return NextResponse.json({
      success: true,
      updated: result.count,
    });

  } catch (err) {
    console.error("NOTIFICATION READ ERROR:", err);

    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}