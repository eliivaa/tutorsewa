import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CancelledBy } from "@prisma/client";

import {
  BookingPaymentStatus,
  BookingStatus,
  RefundStatus,
} from "@prisma/client";

const EARLY_CANCEL_HOURS = 12;

/* =========================
HELPERS
========================= */

function getPaidAmount(booking: {
  paymentStatus: BookingPaymentStatus;
  totalAmount: number;
}) {
  if (booking.paymentStatus === "FULLY_PAID") return booking.totalAmount;
  if (booking.paymentStatus === "PARTIALLY_PAID")
    return Math.floor(booking.totalAmount / 2);
  return 0;
}

function calculateRefund(booking: {
  startTime: Date;
  totalAmount: number;
  paymentStatus: BookingPaymentStatus;
}) {
  const now = new Date();
  const start = new Date(booking.startTime);

  const paidAmount = getPaidAmount(booking);

  // ❌ no refund if session started or nothing paid
  if (now >= start || paidAmount <= 0) {
    return {
      refundAmount: 0,
      tutorCompensation: 0,
      refundStatus: RefundStatus.NOT_ELIGIBLE,
    };
  }

  const diffHours =
    (start.getTime() - now.getTime()) / (1000 * 60 * 60);

  // ✅ EARLY CANCEL → 100% refund
  if (diffHours >= EARLY_CANCEL_HOURS) {
    return {
      refundAmount: paidAmount,
      tutorCompensation: 0,
      refundStatus: RefundStatus.CREDITED,
    };
  }

  // ⚠️ LATE CANCEL → 50/50 split
  const tutorCompensation = Math.ceil(paidAmount * 0.5);
  const refundAmount = paidAmount - tutorCompensation;

  return {
    refundAmount,
    tutorCompensation,
    refundStatus:
      refundAmount > 0
        ? RefundStatus.CREDITED
        : RefundStatus.NOT_ELIGIBLE,
  };
}

/* =========================
API
========================= */

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
        studentId: true,
        tutorId: true,
        status: true,
        startTime: true,
        totalAmount: true,
        paymentStatus: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.studentId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    if (
      booking.status === BookingStatus.CANCELLED ||
      booking.status === BookingStatus.COMPLETED ||
      booking.status === BookingStatus.REJECTED ||
      booking.status === BookingStatus.EXPIRED
    ) {
      return NextResponse.json(
        { error: "This booking cannot be cancelled" },
        { status: 400 }
      );
    }

    if (new Date() >= new Date(booking.startTime)) {
      return NextResponse.json(
        { error: "Session already started" },
        { status: 400 }
      );
    }

    const { refundAmount, tutorCompensation, refundStatus } =
      calculateRefund(booking);

    /* =========================
       TRANSACTION
    ========================= */

    await prisma.$transaction(async (tx) => {
      // 1️⃣ Update booking
      await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: BookingStatus.CANCELLED,
          cancelledBy: CancelledBy.STUDENT,
          refundAmount,
          refundStatus,
          refundedAt:
            refundStatus === RefundStatus.CREDITED ? new Date() : null,
          cancelReason:
            refundAmount > 0
              ? "Student cancelled. Refund credited."
              : "Student cancelled. No refund.",
        },
      });

      // 2️⃣ Refund to student wallet
      if (refundAmount > 0) {
        await tx.user.update({
          where: { id: booking.studentId },
          data: {
            walletBalance: {
              increment: refundAmount,
            },
          },
        });

        await tx.walletTransaction.create({
          data: {
            userId: booking.studentId,
            amount: refundAmount,
            type: "CREDIT",
            reason: "BOOKING_REFUND",
            bookingId: booking.id,
          },
        });
      }

      // 3️⃣ Tutor compensation (safe)
      if (tutorCompensation > 0) {
        const existing = await tx.tutorEarning.findFirst({
          where: {
            bookingId: booking.id,
            type: "COMPENSATION",
          },
        });

        if (!existing) {
          await tx.tutorEarning.create({
            data: {
              tutorId: booking.tutorId,
              bookingId: booking.id,
              amount: tutorCompensation,
              type: "COMPENSATION",
            },
          });
        }
      }

      // 4️⃣ 🔥 Sync payment (CRITICAL)
      await tx.payment.updateMany({
        where: { bookingId: booking.id },
        data: {
          status: "REFUNDED", // make sure enum exists
          tutorPaid: tutorCompensation > 0,
          tutorPaidAt: tutorCompensation > 0 ? new Date() : null,
        },
      });
    });

    return NextResponse.json({
      success: true,
      refundAmount,
      tutorCompensation,
      message: "Booking cancelled successfully",
    });

  } catch (err) {
    console.error("CANCEL BOOKING ERROR:", err);

    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}