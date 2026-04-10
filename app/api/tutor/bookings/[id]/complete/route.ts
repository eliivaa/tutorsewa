import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import {
  BookingStatus,
  NotificationType,
  BookingPaymentStatus,
} from "@prisma/client";
import { adminLog } from "@/lib/adminLog";

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

    /* ================= GET BOOKING ================= */
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking || booking.tutorId !== tutor.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const now = new Date();

    /* ================= VALIDATIONS ================= */

    // if (booking.startTime > now) {
    //   return NextResponse.json(
    //     { error: "Session has not started yet" },
    //     { status: 400 }
    //   );
    // }

    if (!booking.sessionStarted) {
  return NextResponse.json(
    { error: "Session has not started yet" },
    { status: 400 }
  );
}

    if (
      booking.status !== BookingStatus.READY ||
      !booking.sessionStarted
    ) {
      return NextResponse.json(
        { error: "Session is not active" },
        { status: 400 }
      );
    }

    if (booking.paymentStatus === BookingPaymentStatus.UNPAID) {
      return NextResponse.json(
        { error: "Session not paid. Cannot complete." },
        { status: 400 }
      );
    }

    const existingEarning = await prisma.tutorEarning.findFirst({
      where: {
        bookingId: booking.id,
        type: "COMPLETION",
      },
    });

    if (existingEarning) {
      return NextResponse.json(
        { error: "Session already completed & paid" },
        { status: 400 }
      );
    }

    /* ================= CALCULATE DEADLINE ================= */

    // 🔥 scheduled end (NOT endedAt)
    const scheduledEnd = new Date(booking.startTime);
    scheduledEnd.setMinutes(
      scheduledEnd.getMinutes() + booking.durationMin
    );

    // 🔥 add 24 hours
    const paymentDueAt = new Date(
      scheduledEnd.getTime() + 24 * 60 * 60 * 1000
    );

    /* ================= TRANSACTION ================= */

    const updatedBooking = await prisma.$transaction(async (tx) => {
      // 1️⃣ mark completed + store deadline
      const updated = await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: BookingStatus.COMPLETED,
          endedAt: new Date(),
          paymentDueAt, // ✅ IMPORTANT FIELD
        },
      });

      // 2️⃣ HALF → REMAINING_DUE
      await tx.payment.updateMany({
        where: {
          bookingId: booking.id,
          status: "HALF_PAID",
        },
        data: {
          status: "REMAINING_DUE",
        },
      });

      // 3️⃣ notify student (better message)
      await tx.notification.create({
        data: {
          userId: booking.studentId,
          bookingId: booking.id,
          title: "Remaining Payment Required",
          message: `Please complete your remaining payment before ${paymentDueAt.toLocaleString()}.`,
          type: NotificationType.PAYMENT_REQUIRED,
          actionUrl: `/dashboard/payments/${booking.id}`,
        },
      });

      // 4️⃣ tutor earning (85%)
      const tutorAmount = Math.round(booking.totalAmount * 0.85);

      await tx.tutorEarning.create({
        data: {
          tutorId: booking.tutorId,
          bookingId: booking.id,
          amount: tutorAmount,
          type: "COMPLETION",
        },
      });

      return updated;
    });

    /* ================= EXTRA NOTIFICATION ================= */

    await prisma.notification.create({
      data: {
        userId: booking.studentId,
        bookingId: booking.id,
        title: "Session Completed",
        message: "Your tutoring session has been completed.",
        type: NotificationType.SESSION_COMPLETED,
        actionUrl: "/dashboard/sessions",
      },
    });

    /* ================= ADMIN LOG ================= */

    await adminLog(
      "SESSION",
      "Session Completed",
      `Session finished: ${booking.subject}`,
      "SESSION_COMPLETED",
      "/admin/earnings"
    );

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
    });
  } catch (err) {
    console.error("COMPLETE SESSION ERROR:", err);

    return NextResponse.json(
      { error: "Failed to complete session" },
      { status: 500 }
    );
  }
}