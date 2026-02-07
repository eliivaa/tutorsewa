// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";

// export async function PATCH(req: Request) {
//   const { notificationId } = await req.json();

//   // Try student auth
//   const session = await getServerSession(authOptions);
//   if (session?.user?.id) {
//     await prisma.notification.update({
//       where: { id: notificationId },
//       data: { isRead: true },
//     });
//     return NextResponse.json({ success: true });
//   }

//   // Try tutor auth
//   const token = cookies().get("tutor_token")?.value;
//   if (token) {
//     jwt.verify(token, process.env.JWT_SECRET!);
//     await prisma.notification.update({
//       where: { id: notificationId },
//       data: { isRead: true },
//     });
//     return NextResponse.json({ success: true });
//   }

//   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function PATCH(req: Request) {
  try {
    const { notificationId } = await req.json();

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID required" },
        { status: 400 }
      );
    }

    /* ===========================
       STUDENT AUTH
    =========================== */
    const session = await getServerSession(authOptions);

    if (session?.user?.id) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });

      return NextResponse.json({ success: true });
    }

    /* ===========================
       TUTOR AUTH
    =========================== */
    const tutorToken = cookies().get("tutor_token")?.value;

    if (tutorToken) {
      jwt.verify(tutorToken, process.env.JWT_SECRET!);

      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });

      return NextResponse.json({ success: true });
    }

    /* ===========================
       ADMIN AUTH
    =========================== */
    const adminToken = cookies().get("admin_token")?.value;

    if (adminToken) {
      jwt.verify(adminToken, process.env.JWT_SECRET!);

      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  } catch (err) {
    console.error("NOTIFICATION READ ERROR:", err);
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}
