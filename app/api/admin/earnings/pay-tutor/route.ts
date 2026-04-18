import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();

    // 🔥 IMPORTANT: now paymentId = bookingId
    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID required" },
        { status: 400 }
      );
    }

    
    /* =========================
       FETCH BOOKING (NOT PAYMENT )
    ========================= */

    const booking = await prisma.booking.findUnique({
      
      where: { id:bookingId },
      include: {
        student: true,
        tutor: true,
        payments: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // 🔒 prevent double payout
    if ((booking as any).tutorPaid) {
      return NextResponse.json(
        { error: "Tutor already paid" },
        { status: 400 }
      );
    }

// block payout if refunded
const isRefunded = booking.payments.some(
  (p) => p.status === "REFUNDED"
);

if (isRefunded) {
  return NextResponse.json(
    { error: "Cannot pay tutor for refunded booking" },
    { status: 400 }
  );
}
    // 🔒 only after completion
    if (booking.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Session not completed yet" },
        { status: 400 }
      );
    }

    /* =========================
       CALCULATE TOTAL PAID
    ========================= */

    const totalPaid = booking.payments.reduce(
      (sum, p) => sum + (p.paidAmount ?? 0),
      0
    );

    if (totalPaid <= 0) {
      return NextResponse.json(
        { error: "No payment made by student" },
        { status: 400 }
      );
    }

    const tutorEarning = Math.round(totalPaid * 0.85);
    const adminCommission = totalPaid - tutorEarning;

    /* =========================
       ATOMIC TRANSACTION
    ========================= */

  await prisma.$transaction(async (tx) => {
  // 1️⃣ mark booking paid
  await tx.booking.update({
    where: { id: booking.id },
    data: {
      tutorPaid: true,
      tutorPaidAt: new Date(),
    },
  });

  // 2️⃣ earning record (idempotent)
  await tx.tutorEarning.upsert({
    where: {
      bookingId_type: {
        bookingId: booking.id,
        type: "COMPLETION",
      },
    },
    update: {},
    create: {
      tutorId: booking.tutorId,
      bookingId: booking.id,
      amount: tutorEarning,
      type: "COMPLETION",
    },
  });

  // 3️⃣ prevent duplicate wallet credit
  const existingWallet = await tx.tutorWalletTransaction.findFirst({
    where: {
      bookingId: booking.id,
      reason: "TUTOR_PAYOUT",
    },
  });

  if (!existingWallet) {
    await tx.tutorWalletTransaction.create({
      data: {
        tutorId: booking.tutorId,
        amount: tutorEarning,
        type: "CREDIT",
        reason: "TUTOR_PAYOUT",
        bookingId: booking.id,
      },
    });

    await tx.tutor.update({
      where: { id: booking.tutorId },
      data: {
        walletBalance: {
          increment: tutorEarning,
        },
      },
    });
  }

  // 4️⃣ notify
  await tx.notification.create({
    data: {
      tutorId: booking.tutorId,
      bookingId: booking.id,
      title: "Payment Received",
      message: `Your session with ${
        booking.student.name ??
        booking.student.email ??
        "a student"
      } has been completed and payment has been processed.`,
      type: NotificationType.PAYMENT_CONFIRMED,
      actionUrl: "/tutor/earnings",
    },
  });
});

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PAY TUTOR ERROR:", err);

    return NextResponse.json(
      { error: "Failed to process tutor payment" },
      { status: 500 }
    );
  }
}