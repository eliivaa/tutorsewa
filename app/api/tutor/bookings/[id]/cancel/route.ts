// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import {
//   BookingStatus,
//   RefundStatus,
//   BookingPaymentStatus,
// } from "@prisma/client";

// function getPaidAmount(booking: {
//   paymentStatus: BookingPaymentStatus;
//   totalAmount: number;
// }) {
//   if (booking.paymentStatus === "FULLY_PAID") return booking.totalAmount;
//   if (booking.paymentStatus === "PARTIALLY_PAID")
//     return Math.floor(booking.totalAmount / 2);
//   return 0;
// }

// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const booking = await prisma.booking.findUnique({
//       where: { id: params.id },
//       select: {
//         id: true,
//         tutorId: true,
//         studentId: true,
//         status: true,
//         startTime: true,
//         totalAmount: true,
//         paymentStatus: true,
//       },
//     });

//     if (!booking) {
//       return NextResponse.json(
//         { error: "Booking not found" },
//         { status: 404 }
//       );
//     }

//     /* =========================
//        VALIDATIONS
//     ========================= */

//     if (
//       booking.status === BookingStatus.CANCELLED ||
//       booking.status === BookingStatus.COMPLETED ||
//       booking.status === BookingStatus.EXPIRED
//     ) {
//       return NextResponse.json(
//         { error: "Cannot cancel this booking" },
//         { status: 400 }
//       );
//     }

//     if (new Date() >= new Date(booking.startTime)) {
//       return NextResponse.json(
//         { error: "Session already started" },
//         { status: 400 }
//       );
//     }

//     const paidAmount = getPaidAmount(booking);

//     /* =========================
//        TRANSACTION
//     ========================= */

//     await prisma.$transaction(async (tx) => {
//       // 1️⃣ Cancel booking
//       await tx.booking.update({
//         where: { id: booking.id },
//         data: {
//           status: BookingStatus.CANCELLED,
//           cancelledBy: "TUTOR",
//           refundAmount: paidAmount,
//           refundStatus:
//             paidAmount > 0
//               ? RefundStatus.CREDITED
//               : RefundStatus.NOT_ELIGIBLE,
//           refundedAt: paidAmount > 0 ? new Date() : null,
//           cancelReason: "Tutor cancelled session",
//         },
//       });

//       // 2️⃣ Refund student (100%)
//       if (paidAmount > 0) {
//         // update wallet balance
//         await tx.user.update({
//           where: { id: booking.studentId },
//           data: {
//             walletBalance: {
//               increment: paidAmount,
//             },
//           },
//         });

//         // create wallet transaction (ONLY ONCE)
//         await tx.walletTransaction.create({
//           data: {
//             userId: booking.studentId,
//             amount: paidAmount,
//             type: "CREDIT",
//             reason: "BOOKING_REFUND_TUTOR_CANCEL",
//             bookingId: booking.id,
//           },
//         });
//       }

//       // 3️⃣ Sync payment (IMPORTANT)
//       await tx.payment.updateMany({
//         where: { bookingId: booking.id },
//         data: {
//           status: "REFUNDED",
//           tutorPaid: false,
//         },
//       });

//       // ❌ No tutor earning (correct for tutor cancel)
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Booking cancelled by tutor",
//     });

//   } catch (err) {
//     console.error("TUTOR CANCEL ERROR:", err);

//     return NextResponse.json(
//       { error: "Failed to cancel booking" },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  BookingStatus,
  RefundStatus,
  BookingPaymentStatus,
} from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

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
    /* =========================
       TUTOR AUTH (FIXED)
    ========================= */

    const token = cookies().get("tutor_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let tutor: { id: string };

    try {
      tutor = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    } catch {
      return NextResponse.json(
        { error: "Session expired. Please login again." },
        { status: 401 }
      );
    }

    /* =========================
       FETCH BOOKING
    ========================= */

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
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    /* =========================
       OWNERSHIP CHECK (VERY IMPORTANT)
    ========================= */

    if (booking.tutorId !== tutor.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    /* =========================
       VALIDATIONS
    ========================= */

  if (
  ["CANCELLED", "COMPLETED", "EXPIRED"].includes(booking.status)
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

    /* =========================
       TRANSACTION
    ========================= */

    await prisma.$transaction(async (tx) => {
      // Cancel booking
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
          cancelReason:
  paidAmount > 0
    ? "Tutor cancelled session. Full refund issued."
    : "Tutor cancelled session before any payment.",
        },
      });

   // Refund student (SAFE - prevent double refund)
const alreadyRefunded = await tx.walletTransaction.findFirst({
  where: {
    bookingId: booking.id,
    reason: "BOOKING_REFUND_TUTOR_CANCEL",
  },
});

if (!alreadyRefunded && paidAmount > 0) {
  await tx.user.update({
    where: { id: booking.studentId },
    data: {
      walletBalance: {
        increment: paidAmount,
      },
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
      // 3️ Sync payment (IMPORTANT)
      await tx.payment.updateMany({
        where: { bookingId: booking.id },
        data: {
          status: "REFUNDED",
          tutorPaid: false,
        },
      });

      await tx.notification.create({
  data: {
    isForAdmin: true,
    title: "Session Cancelled",
   message: `Booking ${booking.id} was cancelled by tutor`,
    type: "SESSION_CANCELLED",
    bookingId: booking.id,
  },
});

    });

   const message =
  paidAmount > 0
    ? "Session cancelled. Full refund has been credited to the student."
    : "Session cancelled. No payment was made.";

return NextResponse.json({
  success: true,
  refundAmount: paidAmount,
  message,
});

  } catch (err) {
    console.error("TUTOR CANCEL ERROR:", err);

    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}