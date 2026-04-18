import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const overdue = await prisma.payment.findMany({
    where: {
      status: "REMAINING_DUE",
      updatedAt: {
        lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
    include: {
      booking: true,
    },
  });

  for (const p of overdue) {
    const studentId = p.booking.studentId;

    const user = await prisma.user.update({
      where: { id: studentId },
      data: {
        unpaidStrikeCount: { increment: 1 },
      },
    });

    // suspend if 3 strikes
    if (user.unpaidStrikeCount + 1 >= 3) {
      await prisma.user.update({
        where: { id: studentId },
        data: { status: "SUSPENDED" },
      });
    }

    await prisma.payment.update({
      where: { id: p.id },
      data: { status: "FAILED" },
    });
  }

  return NextResponse.json({ success: true });
}