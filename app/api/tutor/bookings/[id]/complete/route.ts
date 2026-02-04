import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { BookingStatus, NotificationType } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    /* ===== AUTH ===== */
    const token = cookies().get("tutor_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tutor = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    /* ===== FETCH BOOKING ===== */
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking || booking.tutorId !== tutor.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (booking.status !== BookingStatus.READY) {
      return NextResponse.json(
        { error: "Session not eligible for completion" },
        { status: 400 }
      );
    }

    /* ===== UPDATE STATUS ===== */
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: BookingStatus.COMPLETED },
    });

    /* ===== NOTIFY STUDENT ===== */
    await prisma.notification.create({
      data: {
        userId: booking.studentId,
        bookingId: booking.id,
        title: "Session Completed",
        message: "Your tutoring session has been marked as completed.",
        type: NotificationType.SESSION_COMPLETED,
        actionUrl: "/dashboard/sessions",
      },
    });

    /* ===== NOTIFY ADMIN ===== */
    await prisma.notification.create({
      data: {
        title: "Session Completed",
        message: `Session ${booking.id} has been completed by tutor.`,
        type: NotificationType.SESSION_COMPLETED,
        bookingId: booking.id,
      },
    });

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (err) {
    console.error("SESSION COMPLETE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to complete session" },
      { status: 500 }
    );
  }
}
