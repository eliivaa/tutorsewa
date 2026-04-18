

// refund/canel

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const token = cookies().get("tutor_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    const tutorId = decoded.id;

    /* =========================
       FETCH EARNINGS WITH PAYMENT RELATION
    ========================= */

    const earnings = await prisma.tutorEarning.findMany({
      where: { tutorId },
      include: {
        booking: {
          include: {
            student: {
              select: { name: true, email: true },
            },
            payments: true, // 🔥 FIX: direct relation
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    let totalEarned = 0;

  const rows = earnings.map((e) => {
  let isPaid = false;
  let paidAt: Date | null = null;

  // ✅ COMPLETION → admin payout date
  if (e.type === "COMPLETION") {
    isPaid = e.booking.tutorPaid;
    paidAt = e.booking.tutorPaidAt;
  }

  // ✅ COMPENSATION → cancellation time (earning created time)
  if (e.type === "COMPENSATION") {
    isPaid = true;
    paidAt = e.createdAt; // 🔥 THIS IS THE FIX
  }

  if (isPaid) {
    totalEarned += e.amount;
  }

  return {
    id: e.id,

    student:
      e.booking.student.name ??
      e.booking.student.email ??
      "Student",

    subject: e.booking.subject,

    sessionType: e.booking.sessionType,

    totalAmount: e.booking.totalAmount,

    tutorEarning: e.amount,

    status: isPaid ? "PAID" : "PENDING",

    paidAt, // ✅ now correct for both

    type: e.type,
  };
});

    return NextResponse.json({
      summary: {
        totalEarned,
      },
      rows,
    });
  } catch (err) {
    console.error("TUTOR EARNINGS ERROR:", err);

    return NextResponse.json(
      { error: "Failed to load tutor earnings" },
      { status: 500 }
    );
  }
}