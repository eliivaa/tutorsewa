// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { adminLog } from "@/lib/adminLog";

// import {
//   PaymentStatus,
//   BookingStatus,
//   NotificationType,
//   SessionType,
// } from "@prisma/client";

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
//             student: { select: { name: true, walletBalance: true } },
//             tutor: { select: { name: true } },
//           },
//         },
//       },
//     });

//     if (!payment) {
//       return NextResponse.json({ error: "Invalid payment" }, { status: 400 });
//     }

//     /* ================= IDEMPOTENT CHECK ================= */
//     if (payment.status !== PaymentStatus.PENDING) {
//       return NextResponse.json({ success: true });
//     }

//     const verifyUrl =
//   `${process.env.ESEWA_VERIFY_BASE}` +
//   `?product_code=${process.env.ESEWA_PRODUCT_CODE}` +
//   `&total_amount=${payment.paidAmount}` +
//   `&transaction_uuid=${uuid}`;

// console.log("VERIFY URL:", verifyUrl);

//     const res = await fetch(verifyUrl);
//    const text = await res.text();
// console.log("ESEWA VERIFY RAW:", text);

// let result;
// try {
//   result = JSON.parse(text);
// } catch {
//   throw new Error("Invalid JSON from eSewa");
// }
//     if (result.status !== "COMPLETE" && result.status !== "SUCCESS") {
//       await prisma.payment.update({
//         where: { id: payment.id },
//         data: {
//           status: PaymentStatus.FAILED,
//           rawResponse: result,
//         },
//       });

//       return NextResponse.json({ error: "Payment failed" }, { status: 400 });
//     }

//     /* ================= TRANSACTION ================= */
//     await prisma.$transaction(async (tx) => {

//       /* 1️⃣ UPDATE PAYMENT */
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

//       /* ================= WALLET DEBIT ================= */

// const url = new URL(req.url);
// const walletUsedFromClient = Number(url.searchParams.get("walletUsed") || 0);

// // ❗ prevent double debit
// const existingDebit = await tx.walletTransaction.findFirst({
//   where: {
//     bookingId: payment.bookingId,
//     type: "DEBIT",
//     reason: "WALLET_PAYMENT",
//   },
// });

// if (!existingDebit && walletUsedFromClient > 0) {
//   await tx.user.update({
//     where: { id: payment.booking.studentId },
//     data: {
//       walletBalance: {
//         decrement: walletUsedFromClient,
//       },
//     },
//   });

//   await tx.walletTransaction.create({
//     data: {
//       userId: payment.booking.studentId,
//       amount: walletUsedFromClient,
//       type: "DEBIT",
//       reason: "WALLET_PAYMENT",
//       bookingId: payment.bookingId,
//     },
//   });
// }

//       /* ================= CALCULATE TOTAL PAID ================= */

//       const paidAgg = await tx.payment.aggregate({
//         where: {
//           bookingId: payment.bookingId,
//           status: {
//             in: [PaymentStatus.HALF_PAID, PaymentStatus.FULL_PAID],
//           },
//         },
//         _sum: { paidAmount: true },
//       });

//       const gatewayPaid = paidAgg._sum.paidAmount ?? 0;

//       const walletUsage = await tx.walletTransaction.aggregate({
//         where: {
//           bookingId: payment.bookingId,
//           type: "DEBIT",
//           reason: "WALLET_PAYMENT",
//         },
//         _sum: { amount: true },
//       });

//       const walletPaid = walletUsage._sum.amount ?? 0;

//       const totalPaid = gatewayPaid + walletPaid;
//       const totalAmount = payment.booking.totalAmount;

//       const fullyPaid = totalPaid >= totalAmount;

//       /* ================= BOOKING STATUS ================= */

//       let newStatus: BookingStatus = BookingStatus.PAYMENT_PENDING;
//       let attachRoom: string | null = null;

//       if (
//         fullyPaid &&
//         payment.booking.sessionType === SessionType.GROUP
//       ) {
//         const activeGroup = await tx.booking.findFirst({
//           where: {
//             tutorId: payment.booking.tutorId,
//             availabilityId: payment.booking.availabilityId,
//             startTime: payment.booking.startTime,
//             sessionType: SessionType.GROUP,
//             sessionStarted: true,
//             meetingRoom: { not: null },
//           },
//         });

//         if (activeGroup?.meetingRoom) {
//           newStatus = BookingStatus.READY;
//           attachRoom = activeGroup.meetingRoom;
//         }
//       }

//       await tx.booking.update({
//         where: { id: payment.bookingId },
//         data: {
//           paymentStatus: fullyPaid
//             ? "FULLY_PAID"
//             : "PARTIALLY_PAID",
//           status: newStatus,
//           ...(attachRoom && {
//             meetingRoom: attachRoom,
//             sessionStarted: true,
//           }),
//         },
//       });

//       /* ================= NOTIFICATIONS ================= */

//       const studentName = payment.booking.student?.name ?? "Student";
//       const subject = payment.booking.subject;

//       await tx.notification.create({
//         data: {
//           userId: payment.booking.studentId,
//           bookingId: payment.bookingId,
//           title: "Payment Successful",
//           message: fullyPaid
//             ? "Your full payment was completed successfully."
//             : "50% payment received successfully.",
//           type: NotificationType.PAYMENT_CONFIRMED,
//           actionUrl: "/dashboard/sessions",
//         },
//       });

//       await tx.notification.create({
//         data: {
//           tutorId: payment.booking.tutorId,
//           bookingId: payment.bookingId,
//           studentId: payment.booking.studentId,
//           title: "Payment Successful",
//           message: fullyPaid
//             ? `${studentName} completed full payment for ${subject}`
//             : `${studentName} paid 50% for ${subject}`,
//           type: NotificationType.PAYMENT_CONFIRMED,
//           actionUrl: "/tutor/bookings",
//           actionLabel: "View Booking",
//         },
//       });

//       await adminLog(
//         "PAYMENT",
//         "Payment Received",
//         `Student ${studentName} paid Rs.${payment.paidAmount} to Tutor ${payment.booking.tutor.name} for ${subject}`,
//         "PAYMENT_CONFIRMED",
//         "/admin/payments"
//       );
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
import { adminLog } from "@/lib/adminLog";

import {
  PaymentStatus,
  BookingStatus,
  NotificationType,
  SessionType,
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
            student: { select: { name: true, walletBalance: true } },
            tutor: { select: { name: true } },
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Invalid payment" }, { status: 400 });
    }

    /* ================= IDEMPOTENT CHECK ================= */
    if (payment.status !== PaymentStatus.PENDING) {
      return NextResponse.json({ success: true });
    }

    const verifyUrl =
  `${process.env.ESEWA_VERIFY_BASE}` +
  `?product_code=${process.env.ESEWA_PRODUCT_CODE}` +
  `&total_amount=${payment.paidAmount}` +
  `&transaction_uuid=${uuid}`;

console.log("VERIFY URL:", verifyUrl);

    const res = await fetch(verifyUrl);
   const text = await res.text();
console.log("ESEWA VERIFY RAW:", text);

let result;
try {
  result = JSON.parse(text);
} catch {
  throw new Error("Invalid JSON from eSewa");
}
    if (result.status !== "COMPLETE" && result.status !== "SUCCESS") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          rawResponse: result,
        },
      });

      return NextResponse.json({ error: "Payment failed" }, { status: 400 });
    }

    /* ================= TRANSACTION ================= */
    await prisma.$transaction(async (tx) => {

      /* 1️⃣ UPDATE PAYMENT */
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

      /* ================= WALLET DEBIT ================= */

const walletUsedFromServer = Number(
  (payment.rawResponse as any)?.walletUsed || 0
);

// ❗ prevent double debit
const existingDebit = await tx.walletTransaction.findFirst({
  where: {
    bookingId: payment.bookingId,
    type: "DEBIT",
    reason: "WALLET_PAYMENT",
  },
});

if (!existingDebit && walletUsedFromServer > 0) {
  await tx.user.update({
    where: { id: payment.booking.studentId },
    data: {
      walletBalance: {
        decrement: walletUsedFromServer,
      },
    },
  });

  await tx.walletTransaction.create({
    data: {
      userId: payment.booking.studentId,
      amount: walletUsedFromServer,
      type: "DEBIT",
      reason: "WALLET_PAYMENT",
      bookingId: payment.bookingId,
    },
  });
}

      /* ================= CALCULATE TOTAL PAID ================= */

      const paidAgg = await tx.payment.aggregate({
        where: {
          bookingId: payment.bookingId,
          status: {
            in: [PaymentStatus.HALF_PAID, PaymentStatus.FULL_PAID],
          },
        },
        _sum: { paidAmount: true },
      });

      const gatewayPaid = paidAgg._sum.paidAmount ?? 0;

      const walletUsage = await tx.walletTransaction.aggregate({
        where: {
          bookingId: payment.bookingId,
          type: "DEBIT",
          reason: "WALLET_PAYMENT",
        },
        _sum: { amount: true },
      });

      const walletPaid = walletUsage._sum.amount ?? 0;

      const totalPaid = gatewayPaid + walletPaid;
      const totalAmount = payment.booking.totalAmount;

      const fullyPaid = totalPaid >= totalAmount;

      /* ================= BOOKING STATUS ================= */

      let newStatus: BookingStatus = BookingStatus.PAYMENT_PENDING;
      let attachRoom: string | null = null;

      if (
        fullyPaid &&
        payment.booking.sessionType === SessionType.GROUP
      ) {
        const activeGroup = await tx.booking.findFirst({
          where: {
            tutorId: payment.booking.tutorId,
            availabilityId: payment.booking.availabilityId,
            startTime: payment.booking.startTime,
            sessionType: SessionType.GROUP,
            sessionStarted: true,
            meetingRoom: { not: null },
          },
        });

        if (activeGroup?.meetingRoom) {
          newStatus = BookingStatus.READY;
          attachRoom = activeGroup.meetingRoom;
        }
      }

      await tx.booking.update({
        where: { id: payment.bookingId },
        data: {
          paymentStatus: fullyPaid
            ? "FULLY_PAID"
            : "PARTIALLY_PAID",
          status: newStatus,
          ...(attachRoom && {
            meetingRoom: attachRoom,
            sessionStarted: true,
          }),
        },
      });

      /* ================= NOTIFICATIONS ================= */

      const studentName = payment.booking.student?.name ?? "Student";
      const subject = payment.booking.subject;

      await tx.notification.create({
        data: {
          userId: payment.booking.studentId,
          bookingId: payment.bookingId,
          title: "Payment Successful",
          message: fullyPaid
            ? "Your full payment was completed successfully."
            : "50% payment received successfully.",
          type: NotificationType.PAYMENT_CONFIRMED,
          actionUrl: "/dashboard/sessions",
        },
      });

      await tx.notification.create({
        data: {
          tutorId: payment.booking.tutorId,
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

      await adminLog(
        "PAYMENT",
        "Payment Received",
        `Student ${studentName} paid Rs.${payment.paidAmount} to Tutor ${payment.booking.tutor.name} for ${subject}`,
        "PAYMENT_CONFIRMED",
        "/admin/payments"
      );
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