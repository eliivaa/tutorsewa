import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function PATCH(req: Request) {
  try {
    const { action, ids } = await req.json();

    let roleWhere: any = {};

    /* ================= STUDENT AUTH ================= */
   /* ================= ROLE CHECK (FIXED ORDER) ================= */

// ADMIN FIRST
const adminToken = cookies().get("admin_token")?.value;

if (adminToken) {
  try {
    jwt.verify(adminToken, process.env.JWT_SECRET!);
    roleWhere.isForAdmin = true;
  } catch {
    return NextResponse.json({ error: "Invalid admin token" }, { status: 401 });
  }
}

// TUTOR SECOND
else if (cookies().get("tutor_token")) {
  try {
    const decoded = jwt.verify(
      cookies().get("tutor_token")!.value,
      process.env.JWT_SECRET!
    ) as { id: string };

    roleWhere.tutorId = decoded.id;
  } catch {
    return NextResponse.json({ error: "Invalid tutor token" }, { status: 401 });
  }
}

// STUDENT LAST
else {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  roleWhere.userId = session.user.id;
}

    /* ================= ACTION: MARK SELECTED READ ================= */
    if (action === "mark-read") {
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json(
          { error: "No IDs provided" },
          { status: 400 }
        );
      }

      await prisma.notification.updateMany({
        where: {
          ...roleWhere,
          id: { in: ids },
        },
        data: {
          isRead: true,
        },
      });

      return NextResponse.json({ success: true });
    }

    /* ================= ACTION: MARK ALL READ ================= */
    if (action === "mark-all-read") {
      await prisma.notification.updateMany({
        where: {
          ...roleWhere,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

      return NextResponse.json({ success: true });
    }

    /* ================= ACTION: DELETE ================= */
    if (action === "delete") {
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json(
          { error: "No IDs provided" },
          { status: 400 }
        );
      }

      await prisma.notification.deleteMany({
        where: {
          ...roleWhere,
          id: { in: ids },
        },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("NOTIFICATION BULK ERROR:", err);
    return NextResponse.json(
      { error: "Bulk notification action failed" },
      { status: 500 }
    );
  }
}