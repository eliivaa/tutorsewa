import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NotificationType } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    /* ================= AUTH ================= */
    const token = cookies().get("tutor_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tutor = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    /* ================= INPUT ================= */
    const { meetingLink, meetingPlatform, meetingNote } = await req.json();

    if (!meetingLink?.trim()) {
      return NextResponse.json(
        { error: "Meeting link required" },
        { status: 400 }
      );
    }

    /* ================= FETCH BOOKING ================= */
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking || booking.tutorId !== tutor.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    /* ================= PAYMENT GUARD ================= */
    if (
      booking.paymentStatus !== "PARTIALLY_PAID" &&
      booking.paymentStatus !== "FULLY_PAID"
    ) {
      return NextResponse.json(
        { error: "Payment required before creating meeting" },
        { status: 400 }
      );
    }

    /* ================= UPDATE BOOKING ================= */
   const updatedBooking = await prisma.booking.update({
  where: { id: booking.id },
  data: {
    meetingLink,
    meetingPlatform,
    meetingNote,
    meetingCreatedAt: new Date(),
    status: "READY",
  },
  include: {
    student: {
      select: {
        name: true,
        image: true,
      },
    },
  },
});


    /* ================= NOTIFY STUDENT ================= */
    await prisma.notification.create({
      data: {
        userId: updatedBooking.studentId,
        bookingId: updatedBooking.id,
        title: "Class Ready",
        message: "Your tutor has shared the class link.",
        type: NotificationType.SESSION_LINK_SHARED,
        actionUrl: "/dashboard/sessions",
        actionLabel: "Join Class",
      },
    });

    /* ================= RESPONSE ================= */
    return NextResponse.json({
      success: true,
      booking: updatedBooking, // 🔑 REQUIRED FOR FRONTEND
    });
  } catch (err) {
    console.error("MEETING LINK ERROR:", err);
    return NextResponse.json(
      { error: "Failed to save meeting" },
      { status: 500 }
    );
  }
}
