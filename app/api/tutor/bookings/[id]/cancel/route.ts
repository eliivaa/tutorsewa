import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  BookingStatus,
  RefundStatus,
  BookingPaymentStatus,
} from "@prisma/client";

function getPaidAmount(booking: {
  paymentStatus: BookingPaymentStatus;
  totalAmount: number;
}) {
  if (booking.paymentStatus === "FULLY_PAID") return booking.totalAmount;
  if (booking.paymentStatus === "PARTIALLY_PAID")
    return Math.floor(booking.totalAmount / 2);
  return 0;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        tutorId: true,
        studentId: true,
        status: true,
        startTime: true,
        totalAmount: true,
        paymentStatus: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // ❗ IMPORTANT: here you may need to check tutor session user mapping
    // depending on your auth system

    if (
      booking.status === BookingStatus.CANCELLED ||
      booking.status === BookingStatus.COMPLETED ||
      booking.status === BookingStatus.EXPIRED
    ) {
      return NextResponse.json(
        { error: "Cannot cancel this booking" },
        { status: 400 }
      );
    }

    if (new Date() >= new Date(booking.startTime)) {
      return NextResponse.json(
        { error: "Session already started" },
        { status: 400 }
      );
    }

    const paidAmount = getPaidAmount(booking);

    await prisma.$transaction(async (tx) => {
      // 1. cancel booking
      await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: BookingStatus.CANCELLED,
          cancelledBy: "TUTOR",
          refundAmount: paidAmount,
          refundStatus:
            paidAmount > 0
              ? RefundStatus.CREDITED
              : RefundStatus.NOT_ELIGIBLE,
          refundedAt: paidAmount > 0 ? new Date() : null,
          cancelReason: "Tutor cancelled session",
        },
      });

      // 2. refund student FULL
      if (paidAmount > 0) {
        await tx.user.update({
          where: { id: booking.studentId },
          data: {
            walletBalance: { increment: paidAmount },
          },
        });

        await tx.walletTransaction.create({
  data: {
    userId: booking.studentId,
    amount: paidAmount,
    type: "CREDIT",
    reason: "BOOKING_REFUND_TUTOR_CANCEL",
    bookingId: booking.id,
  },
});
        await tx.walletTransaction.create({
          data: {
            userId: booking.studentId,
            amount: paidAmount,
            type: "CREDIT",
            reason: "BOOKING_REFUND_TUTOR_CANCEL",
            bookingId: booking.id,
          },
        });
      }

      // ❌ NO tutor earning here
    });

    return NextResponse.json({
      success: true,
      message: "Booking cancelled by tutor",
    });
  } catch (err) {
    console.error("TUTOR CANCEL ERROR:", err);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}