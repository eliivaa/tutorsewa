import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    /* ================= AUTH CHECK ================= */

    const adminToken = cookies().get("admin_token")?.value;

    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      jwt.verify(adminToken, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ error: "Invalid admin token" }, { status: 401 });
    }

    /* ================= INPUT ================= */

    const { itemId, reason } = await req.json();

    if (!itemId || !reason) {
      return NextResponse.json(
        { error: "itemId and reason are required" },
        { status: 400 }
      );
    }

    /* ================= GET ITEM ================= */

    const item = await prisma.thriftItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    /* ================= DELETE (SOFT) ================= */

    await prisma.thriftItem.update({
      where: { id: itemId },
      data: {
        isActive: false,
        isReported: false,
        reportReason: reason,
      },
    });

    /* ================= NOTIFY SELLER ================= */

    await prisma.notification.create({
      data: {
        userId: item.sellerId,
        title: "Your thrift listing was removed",
        message: `Your item "${item.title}" was removed by admin.\nReason: ${reason}`,
        type: "SYSTEM_ANNOUNCEMENT",
          actionUrl: "/dashboard/thrift", 
    actionLabel: "View Thrift", 
      },
    });

    /* ================= SUCCESS ================= */

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("ADMIN THRIFT DELETE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}