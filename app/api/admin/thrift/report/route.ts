import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await req.json();

    if (!itemId) {
      return NextResponse.json({ error: "Missing itemId" }, { status: 400 });
    }

    // ✅ONLY FLAG — DO NOT DELETE
    await prisma.thriftItem.update({
      where: { id: itemId },
      data: {
        isReported: true,
      },
    });

    //  Notify admin
   await prisma.notification.create({
  data: {
    title: "Thrift Item Reported",
    message: "A thrift item has been reported for review",
    type: "SYSTEM_ANNOUNCEMENT",
    isForAdmin: true,

    actionUrl: "/admin/thrift",     
    actionLabel: "Review Item",     
  },
});

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("REPORT ERROR:", err);
    return NextResponse.json({ error: "Failed to report" }, { status: 500 });
  }
}