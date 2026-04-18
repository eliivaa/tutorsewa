import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth/getCurrentUserId";

export async function GET(req: NextRequest) {
  try {
    const me = await getCurrentUserId();
    if (!me) {
      return NextResponse.json({ allowed: false });
    }

    const tutorId = new URL(req.url).searchParams.get("tutorId");
    if (!tutorId) {
      return NextResponse.json({ allowed: false });
    }

    // 🔥 CHECK BOOKING PERMISSION FIRST
    const hasBooking = await prisma.booking.findFirst({
      where: {
        studentId: me,
        tutorId: tutorId,
       status: {
  in: ["PAYMENT_PENDING", "READY", "COMPLETED"],
},
paymentStatus: {
  in: ["PARTIALLY_PAID", "FULLY_PAID"],
},
      },
    });

    if (!hasBooking) {
      return NextResponse.json({ allowed: false });
    }

    // 🔥 ONLY NOW CREATE CONVERSATION
    const conversation = await prisma.conversation.upsert({
      where: {
        studentId_tutorId: {
          studentId: me,
          tutorId: tutorId,
        },
      },
      update: {},
      create: {
        studentId: me,
        tutorId: tutorId,
        type: "TUTOR_SESSION",
      },
    });

    return NextResponse.json({
      allowed: true,
      conversationId: conversation.id,
    });

  } catch (err) {
    console.error("START CHAT ERROR:", err);
    return NextResponse.json({ allowed: false });
  }
}
