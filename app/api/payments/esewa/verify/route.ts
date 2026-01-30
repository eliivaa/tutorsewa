// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { PaymentStatus, BookingStatus } from "@prisma/client";

// export async function GET(req: NextRequest) {
//   try {
//     const uuid = new URL(req.url).searchParams.get("uuid");
//     if (!uuid) {
//       return NextResponse.json({ error: "Missing uuid" }, { status: 400 });
//     }

//     const payment = await prisma.payment.findUnique({
//       where: { transactionUuid: uuid },
//       include: { booking: true },
//     });

//     if (!payment) {
//       return NextResponse.json({ error: "Invalid payment" }, { status: 400 });
//     }

//     // ✅ idempotent
//     if (payment.status !== PaymentStatus.PENDING) {
//       return NextResponse.json({ success: true });
//     }

//     const verifyUrl =
//       `${process.env.ESEWA_VERIFY_BASE}` +
//       `?product_code=${process.env.ESEWA_PRODUCT_CODE}` +
//       `&total_amount=${payment.paidAmount}` +
//       `&transaction_uuid=${uuid}`;

//     const res = await fetch(verifyUrl);
//     const result = await res.json();

//     if (result.status !== "COMPLETE") {
//       await prisma.payment.update({
//         where: { id: payment.id },
//         data: { status: PaymentStatus.FAILED, rawResponse: result },
//       });
//       return NextResponse.json({ error: "Payment failed" }, { status: 400 });
//     }

//     await prisma.$transaction(async (tx) => {
//       // 1️⃣ mark this payment
//       await tx.payment.update({
//         where: { id: payment.id },
//         data: {
//           status:
//             payment.payMode === "HALF"
//               ? PaymentStatus.HALF_PAID
//               : PaymentStatus.FULL_PAID,
//           refId: result.ref_id,
//           rawResponse: result,
//         },
//       });

//       // 2️⃣ calculate paid (ONLY successful)
//       const paid = await tx.payment.aggregate({
//         where: {
//           bookingId: payment.bookingId,
//           status: { in: ["HALF_PAID", "FULL_PAID"] },
//         },
//         _sum: { paidAmount: true },
//       });

//       const totalPaid = paid._sum.paidAmount ?? 0;
//       const totalAmount = payment.booking.totalAmount;

//       const fullyPaid = totalPaid >= totalAmount;

//       // 3️⃣ update booking CORRECTLY
//       await tx.booking.update({
//         where: { id: payment.bookingId },
//         data: {
//           paymentStatus: fullyPaid ? "FULLY_PAID" : "PARTIALLY_PAID",
//           status: BookingStatus.CONFIRMED, 
//         },
//       });
//     });

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("VERIFY ERROR:", err);
//     return NextResponse.json({ error: "Verification failed" }, { status: 500 });
//   }
// }






// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { PaymentStatus, BookingStatus, NotificationType } from "@prisma/client";

// export async function GET(req: NextRequest) {
//   try {
//     const uuid = new URL(req.url).searchParams.get("uuid");
//     if (!uuid) {
//       return NextResponse.json({ error: "Missing uuid" }, { status: 400 });
//     }

//     const payment = await prisma.payment.findUnique({
//       where: { transactionUuid: uuid },
//       include: {
//         booking: {
//           include: {
//             student: { select: { name: true } },
//             tutor: { select: { name: true } },
//           },
//         },
//       },
//     });

//     if (!payment) {
//       return NextResponse.json({ error: "Invalid payment" }, { status: 400 });
//     }

//     // ✅ Idempotent
//     if (payment.status !== PaymentStatus.PENDING) {
//       return NextResponse.json({ success: true });
//     }

//     const verifyUrl =
//       `${process.env.ESEWA_VERIFY_BASE}` +
//       `?product_code=${process.env.ESEWA_PRODUCT_CODE}` +
//       `&total_amount=${payment.paidAmount}` +
//       `&transaction_uuid=${uuid}`;

//     const res = await fetch(verifyUrl);
//     const result = await res.json();

//     if (result.status !== "COMPLETE") {
//       await prisma.payment.update({
//         where: { id: payment.id },
//         data: { status: PaymentStatus.FAILED, rawResponse: result },
//       });
//       return NextResponse.json({ error: "Payment failed" }, { status: 400 });
//     }

//     await prisma.$transaction(async (tx) => {
//       /* 1️⃣ Mark payment */
//       await tx.payment.update({
//         where: { id: payment.id },
//         data: {
//           status:
//             payment.payMode === "HALF"
//               ? PaymentStatus.HALF_PAID
//               : PaymentStatus.FULL_PAID,
//           refId: result.ref_id,
//           rawResponse: result,
//         },
//       });

//       /* 2️⃣ Recalculate total paid */
//       const paidAgg = await tx.payment.aggregate({
//         where: {
//           bookingId: payment.bookingId,
//           status: { in: ["HALF_PAID", "FULL_PAID"] },
//         },
//         _sum: { paidAmount: true },
//       });

//       const totalPaid = paidAgg._sum.paidAmount ?? 0;
//       const totalAmount = payment.booking.totalAmount;
//       const fullyPaid = totalPaid >= totalAmount;

//       /* 3️⃣ Update booking */
//       await tx.booking.update({
//         where: { id: payment.bookingId },
//         data: {
//           paymentStatus: fullyPaid ? "FULLY_PAID" : "PARTIALLY_PAID",
//           status: BookingStatus.CONFIRMED,
//         },
//       });

//       const studentName = payment.booking.student?.name ?? "Student";
//       const subject = payment.booking.subject;

//       /* ================= STUDENT NOTIFICATION ================= */
//       await tx.notification.create({
//         data: {
//           userId: payment.booking.studentId,
//           bookingId: payment.bookingId,
//           title: "Payment Successful",
//           message: fullyPaid
//             ? "Your full payment was done successfully."
//             : "50% payment done successfully.",
//           type: NotificationType.PAYMENT_CONFIRMED,
//           actionUrl: "/dashboard/sessions",
//         },
//       });

//       /* ================= TUTOR NOTIFICATION (CRITICAL FIX) ================= */
//     await tx.notification.create({
//   data: {
//     tutorId: payment.booking.tutorId, // 🔑 MUST exist
//     bookingId: payment.bookingId,
//     studentId: payment.booking.studentId,
//     title: "Payment Successful",
//     message: fullyPaid
//       ? `${studentName} completed full payment for ${payment.booking.subject}`
//       : `${studentName} paid 50% for ${payment.booking.subject}`,
//     type: NotificationType.PAYMENT_CONFIRMED,
//     actionUrl: "/tutor/bookings",
//     actionLabel: "View Booking",
//   },
// });

//     });

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("VERIFY ERROR:", err);
//     return NextResponse.json(
//       { error: "Verification failed" },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  PaymentStatus,
  BookingStatus,
  NotificationType,
} from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const uuid = new URL(req.url).searchParams.get("uuid");
    if (!uuid) {
      return NextResponse.json({ error: "Missing uuid" }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { transactionUuid: uuid },
      include: {
        booking: {
          include: {
            student: { select: { name: true } },
            tutor: { select: { name: true } },
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Invalid payment" }, { status: 400 });
    }

    // ✅ Idempotent check
    if (payment.status !== PaymentStatus.PENDING) {
      return NextResponse.json({ success: true });
    }

    const verifyUrl =
      `${process.env.ESEWA_VERIFY_BASE}` +
      `?product_code=${process.env.ESEWA_PRODUCT_CODE}` +
      `&total_amount=${payment.paidAmount}` +
      `&transaction_uuid=${uuid}`;

    const res = await fetch(verifyUrl);
    const result = await res.json();

    if (result.status !== "COMPLETE") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          rawResponse: result,
        },
      });
      return NextResponse.json({ error: "Payment failed" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      /* ================= 1️⃣ UPDATE PAYMENT ================= */
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status:
            payment.payMode === "HALF"
              ? PaymentStatus.HALF_PAID
              : PaymentStatus.FULL_PAID,
          refId: result.ref_id,
          rawResponse: result,
        },
      });

      /* ================= 2️⃣ CALCULATE TOTAL PAID ================= */
      const paidAgg = await tx.payment.aggregate({
        where: {
          bookingId: payment.bookingId,
          status: { in: [PaymentStatus.HALF_PAID, PaymentStatus.FULL_PAID] },
        },
        _sum: { paidAmount: true },
      });

      const totalPaid = paidAgg._sum.paidAmount ?? 0;
      const totalAmount = payment.booking.totalAmount;
      const fullyPaid = totalPaid >= totalAmount;

      /* ================= 3️⃣ UPDATE BOOKING STATUS ================= */
      await tx.booking.update({
        where: { id: payment.bookingId },
        data: {
          paymentStatus: fullyPaid
            ? "FULLY_PAID"
            : "PARTIALLY_PAID",

          status: fullyPaid
            ? BookingStatus.CONFIRMED
            : BookingStatus.PAYMENT_PENDING,
        },
      });

      const studentName = payment.booking.student?.name ?? "Student";
      const subject = payment.booking.subject;

      /* ================= STUDENT NOTIFICATION ================= */
      await tx.notification.create({
        data: {
          userId: payment.booking.studentId,
          bookingId: payment.bookingId,
          title: "Payment Successful",
          message: fullyPaid
            ? "Your full payment was done successfully."
            : "50% payment received successfully.",
          type: NotificationType.PAYMENT_CONFIRMED,
          actionUrl: "/dashboard/sessions",
        },
      });

      /* ================= TUTOR NOTIFICATION (FIXED) ================= */
      await tx.notification.create({
        data: {
          tutorId: payment.booking.tutorId, // ✅ THIS is why it now works
          bookingId: payment.bookingId,
          studentId: payment.booking.studentId,
          title: "Payment Successful",
          message: fullyPaid
            ? `${studentName} completed full payment for ${subject}`
            : `${studentName} paid 50% for ${subject}`,
          type: NotificationType.PAYMENT_CONFIRMED,
          actionUrl: "/tutor/bookings",
          actionLabel: "View Booking",
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
