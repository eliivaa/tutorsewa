// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const uuid = searchParams.get("transaction_uuid");

//   if (!uuid) {
//     return NextResponse.json({ error: "Missing UUID" }, { status: 400 });
//   }

//   const payment = await prisma.payment.findUnique({
//     where: { transactionUuid: uuid },
//     include: { booking: true },
//   });

//   if (!payment || payment.status !== "PENDING") {
//     return NextResponse.json({ error: "Invalid payment" }, { status: 400 });
//   }

//   const verifyUrl = `${process.env.ESEWA_VERIFY_BASE}?product_code=${process.env.ESEWA_PRODUCT_CODE}&total_amount=${payment.amount}&transaction_uuid=${uuid}`;

//   const res = await fetch(verifyUrl);
//   const result = await res.json();

//   if (result.status !== "COMPLETE") {
//     await prisma.payment.update({
//       where: { id: payment.id },
//       data: { status: "FAILED", rawResponse: result },
//     });

//     return NextResponse.json({ error: "Payment failed" }, { status: 400 });
//   }

//   // ✅ Atomic update
//   await prisma.$transaction(async (tx) => {
//     await tx.payment.update({
//       where: { id: payment.id },
//       data: {
//         status: "COMPLETE",
//         refId: result.ref_id,
//         rawResponse: result,
//       },
//     });

//     await tx.booking.update({
//       where: { id: payment.bookingId },
//       data: { status: "CONFIRMED" },
//     });

//     // Notifications
//     await tx.notification.create({
//       data: {
//         userId: payment.booking.studentId,
//         bookingId: payment.bookingId,
//         title: "Payment Confirmed",
//         message: "Your booking has been confirmed successfully.",
//         type: "PAYMENT_CONFIRMED",
//         actionUrl: "/dashboard/sessions",
//         actionLabel: "View Session",
//       },
//     });
//   });

//   return NextResponse.json({ success: true });
// }


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uuid = searchParams.get("transaction_uuid");

  if (!uuid) {
    return NextResponse.json({ error: "Missing UUID" }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({
    where: { transactionUuid: uuid },
    include: { booking: true },
  });

  if (!payment || payment.status !== "PENDING") {
    return NextResponse.json({ error: "Invalid payment" }, { status: 400 });
  }

  /* ================= VERIFY WITH ESEWA ================= */
  const verifyUrl = `${process.env.ESEWA_VERIFY_BASE}?product_code=${process.env.ESEWA_PRODUCT_CODE}&total_amount=${payment.amount}&transaction_uuid=${uuid}`;

  const res = await fetch(verifyUrl);
  const result = await res.json();

  if (result.status !== "COMPLETE") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED", rawResponse: result },
    });

    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 400 }
    );
  }

  /* ================= ATOMIC TRANSACTION ================= */
  await prisma.$transaction(async (tx) => {
    /* 1️⃣ Update payment */
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status:
          payment.payMode === "HALF"
            ? "HALF_PAID"
            : "FULL_PAID",
        refId: result.ref_id ?? null,
        rawResponse: result,
      },
    });

    /* 2️⃣ Recalculate total paid */
    const paidAgg = await tx.payment.aggregate({
      where: {
        bookingId: payment.bookingId,
        status: {
          in: ["HALF_PAID", "FULL_PAID"],
        },
      },
      _sum: { amount: true },
    });

    const totalPaid = paidAgg._sum.amount ?? 0;

    /* 3️⃣ Decide booking payment status */
    const bookingPaymentStatus =
      totalPaid >= payment.booking.totalAmount
        ? "FULLY_PAID"
        : "PARTIALLY_PAID";

    /* 4️⃣ Update booking */
    await tx.booking.update({
      where: { id: payment.bookingId },
      data: {
        status: "CONFIRMED",
        paymentStatus: bookingPaymentStatus,
      },
    });

    /* 5️⃣ Notify student */
    await tx.notification.create({
      data: {
        userId: payment.booking.studentId,
        bookingId: payment.bookingId,
        title: "Payment Confirmed",
        message:
          bookingPaymentStatus === "FULLY_PAID"
            ? "Your booking is fully paid and confirmed."
            : "Your booking is confirmed with partial payment.",
        type: "PAYMENT_CONFIRMED",
        actionUrl: "/dashboard/sessions",
        actionLabel: "View Session",
      },
    });
  });

  return NextResponse.json({ success: true });
}
