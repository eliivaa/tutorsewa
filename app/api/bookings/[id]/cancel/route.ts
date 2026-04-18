// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import {
//   BookingPaymentStatus,
//   BookingStatus,
//   CancelledBy,
//   PaymentStatus,
//   RefundStatus,
// } from "@prisma/client";

// const EARLY_CANCEL_HOURS = 12;

// /* =========================
//    HELPERS
// ========================= */

// function getPaidAmount(booking: {
//   paymentStatus: BookingPaymentStatus;
//   totalAmount: number;
// }) {
//   if (booking.paymentStatus === "FULLY_PAID") return booking.totalAmount;

//   if (booking.paymentStatus === "PARTIALLY_PAID") {
//     return Math.floor(booking.totalAmount / 2);
//   }

//   return 0;
// }

// function calculateRefund(booking: {
//   startTime: Date;
//   totalAmount: number;
//   paymentStatus: BookingPaymentStatus;
// }) {
//   const now = new Date();
//   const start = new Date(booking.startTime);

//   const paidAmount = getPaidAmount(booking);

//   if (now >= start || paidAmount <= 0) {
//     return {
//       refundAmount: 0,
//       tutorCompensation: 0,
//       refundStatus: RefundStatus.NOT_ELIGIBLE,
//     };
//   }

//   const diffHours =
//     (start.getTime() - now.getTime()) / (1000 * 60 * 60);

//   if (diffHours >= EARLY_CANCEL_HOURS) {
//     return {
//       refundAmount: paidAmount,
//       tutorCompensation: 0,
//       refundStatus: RefundStatus.CREDITED,
//     };
//   }

//   const tutorCompensation = Math.ceil(paidAmount * 0.5);
//   const refundAmount = paidAmount - tutorCompensation;

//   return {
//     refundAmount,
//     tutorCompensation,
//     refundStatus:
//       refundAmount > 0
//         ? RefundStatus.CREDITED
//         : RefundStatus.NOT_ELIGIBLE,
//   };
// }

// /* =========================
//    API
// ========================= */

// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const booking = await prisma.booking.findUnique({
//       where: { id: params.id },
//       select: {
//         id: true,
//         studentId: true,
//         tutorId: true,
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

//     if (booking.studentId !== session.user.id) {
//       return NextResponse.json(
//         { error: "Forbidden" },
//         { status: 403 }
//       );
//     }

//     if (
//       booking.status === BookingStatus.CANCELLED ||
//       booking.status === BookingStatus.COMPLETED ||
//       booking.status === BookingStatus.REJECTED ||
//       booking.status === BookingStatus.EXPIRED
//     ) {
//       return NextResponse.json(
//         { error: "This booking cannot be cancelled" },
//         { status: 400 }
//       );
//     }

//    const now = new Date();
// const start = new Date(booking.startTime);

// // DURING CLASS → treat as COMPLETED (NO REFUND)
// if (now >= start) {
//   await prisma.booking.update({
//     where: { id: booking.id },
//     data: {
//       status: BookingStatus.COMPLETED,
//       cancelReason: "The session had already started, so it was marked as completed. No refund is available.",
//     },
//   });

//   return NextResponse.json({
//     success: true,
//     message: "Session treated as completed (no refund)",
//   });
// }

//     const { refundAmount, tutorCompensation, refundStatus } =
//       calculateRefund(booking);

//     await prisma.$transaction(async (tx) => {
//       /* =========================
//          1. UPDATE BOOKING
//       ========================= */
//       await tx.booking.update({
//         where: { id: booking.id },
//         data: {
//           status: BookingStatus.CANCELLED,
//           cancelledBy: CancelledBy.STUDENT,
//           refundAmount,
//           refundStatus,
//           refundedAt:
//             refundStatus === RefundStatus.CREDITED
//               ? new Date()
//               : null,
//           cancelReason:
//             tutorCompensation > 0
//               ? "Student cancelled late. Partial refund + tutor compensation applied."
//               : refundAmount > 0
//               ? "Student cancelled early. Full refund applied."
//               : "No refund.",
//         },
//       });

//       /* =========================
//          2. REFUND STUDENT
//       ========================= */
//       if (refundAmount > 0) {
//         await tx.user.update({
//           where: { id: booking.studentId },
//           data: {
//             walletBalance: {
//               increment: refundAmount,
//             },
//           },
//         });

//         await tx.walletTransaction.create({
//           data: {
//             userId: booking.studentId,
//             amount: refundAmount,
//             type: "CREDIT",
//             reason: "BOOKING_REFUND",
//             bookingId: booking.id,
//           },
//         });
//       }

//       /* =========================
//          3. TUTOR COMPENSATION
//       ========================= */
//       if (tutorCompensation > 0) {
//         const existingComp = await tx.tutorEarning.findFirst({
//           where: {
//             bookingId: booking.id,
//             type: "COMPENSATION",
//           },
//         });

//         if (!existingComp) {
//           await tx.tutorEarning.create({
//             data: {
//               tutorId: booking.tutorId,
//               bookingId: booking.id,
//               amount: tutorCompensation,
//               type: "COMPENSATION",
//             },
//           });
//         }

//         /* =========================
//            4. CREDIT TUTOR WALLET (SAFE)
//         ========================= */
//         const existingWallet = await tx.tutorWalletTransaction.findFirst({
//           where: {
//             bookingId: booking.id,
//             reason: "LATE_CANCEL_COMPENSATION",
//           },
//         });

//         if (!existingWallet) {
//           await tx.tutorWalletTransaction.create({
//             data: {
//               tutorId: booking.tutorId,
//               amount: tutorCompensation,
//               type: "CREDIT",
//               reason: "LATE_CANCEL_COMPENSATION",
//               bookingId: booking.id,
//             },
//           });

//           await tx.tutor.update({
//             where: { id: booking.tutorId },
//             data: {
//               walletBalance: {
//                 increment: tutorCompensation,
//               },
//             },
//           });
//         }
//       }

//       /* =========================
//          5. MARK PAYMENT REFUNDED
//       ========================= */
//       await tx.payment.updateMany({
//         where: { bookingId: booking.id },
//         data: {
//           status: PaymentStatus.REFUNDED,
//         },
//       });

//       /* =========================
//          6. NOTIFICATION
//       ========================= */
//       await tx.notification.create({
//         data: {
//           tutorId: booking.tutorId,
//           bookingId: booking.id,
//           title: "Session Cancelled",
//           message:
//             tutorCompensation > 0
//               ? "Late cancellation: compensation credited to your wallet."
//               : "Session cancelled by student.",
//           type: "SESSION_CANCELLED",
//           actionUrl: "/tutor/bookings",
//         },
//       });
//     });

//     return NextResponse.json({
//       success: true,
//       refundAmount,
//       tutorCompensation,
//     });

//   } catch (err) {
//     console.error("CANCEL ERROR:", err);

//     return NextResponse.json(
//       { error: "Failed to cancel booking" },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  BookingPaymentStatus,
  BookingStatus,
  CancelledBy,
  PaymentStatus,
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

  if (booking.paymentStatus === "PARTIALLY_PAID") {
    return Math.floor(booking.totalAmount / 2);
  }

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

  if (now >= start || paidAmount <= 0) {
    return {
      refundAmount: 0,
      tutorCompensation: 0,
      refundStatus: RefundStatus.NOT_ELIGIBLE,
    };
  }

  const diffHours =
    (start.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (diffHours >= EARLY_CANCEL_HOURS) {
    return {
      refundAmount: paidAmount,
      tutorCompensation: 0,
      refundStatus: RefundStatus.CREDITED,
    };
  }

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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
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

   const now = new Date();
const start = new Date(booking.startTime);

// DURING CLASS → treat as COMPLETED (NO REFUND)
if (now >= start) {
  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: BookingStatus.COMPLETED,
      cancelReason: "The session had already started, so it was marked as completed. No refund is available.",
    },
  });

  return NextResponse.json({
  success: true,
  type: "STARTED",
  refundAmount: 0,
});
}

    const { refundAmount, tutorCompensation, refundStatus } =
      calculateRefund(booking);

    await prisma.$transaction(async (tx) => {
      /* =========================
         1. UPDATE BOOKING
      ========================= */
      await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: BookingStatus.CANCELLED,
          cancelledBy: CancelledBy.STUDENT,
          refundAmount,
          refundStatus,
          refundedAt:
            refundStatus === RefundStatus.CREDITED
              ? new Date()
              : null,
          cancelReason:
            tutorCompensation > 0
              ? "Student cancelled late. Partial refund + tutor compensation applied."
              : refundAmount > 0
              ? "Student cancelled early. Full refund applied."
              : "No refund.",
        },
      });

      /* =========================
         2. REFUND STUDENT
      ========================= */
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

      /* =========================
         3. TUTOR COMPENSATION
      ========================= */
      if (tutorCompensation > 0) {
        const existingComp = await tx.tutorEarning.findFirst({
          where: {
            bookingId: booking.id,
            type: "COMPENSATION",
          },
        });

        if (!existingComp) {
          await tx.tutorEarning.create({
            data: {
              tutorId: booking.tutorId,
              bookingId: booking.id,
              amount: tutorCompensation,
              type: "COMPENSATION",
            },
          });
        }

        /* =========================
           4. CREDIT TUTOR WALLET (SAFE)
        ========================= */
        const existingWallet = await tx.tutorWalletTransaction.findFirst({
          where: {
            bookingId: booking.id,
            reason: "LATE_CANCEL_COMPENSATION",
          },
        });

        if (!existingWallet) {
          await tx.tutorWalletTransaction.create({
            data: {
              tutorId: booking.tutorId,
              amount: tutorCompensation,
              type: "CREDIT",
              reason: "LATE_CANCEL_COMPENSATION",
              bookingId: booking.id,
            },
          });

          await tx.tutor.update({
            where: { id: booking.tutorId },
            data: {
              walletBalance: {
                increment: tutorCompensation,
              },
            },
          });
        }
      }

      /* =========================
         5. MARK PAYMENT REFUNDED
      ========================= */
      await tx.payment.updateMany({
        where: { bookingId: booking.id },
        data: {
          status: PaymentStatus.REFUNDED,
        },
      });

      /* =========================
         6. NOTIFICATION
      ========================= */
      await tx.notification.create({
        data: {
          tutorId: booking.tutorId,
          bookingId: booking.id,
          title: "Session Cancelled",
          message:
            tutorCompensation > 0
              ? "Late cancellation: compensation credited to your wallet."
              : "Session cancelled by student.",
          type: "SESSION_CANCELLED",
          actionUrl: "/tutor/bookings",
        },
      });

      await tx.notification.create({
  data: {
    isForAdmin: true,
    title: "Session Cancelled",
    message: `Booking ${booking.id} was cancelled by student`,
    type: "SESSION_CANCELLED",
    bookingId: booking.id,
  },
});

    });

    let type: "FULL" | "PARTIAL" | "NONE";

if (refundAmount > 0 && tutorCompensation === 0) {
  type = "FULL";
} else if (refundAmount > 0 && tutorCompensation > 0) {
  type = "PARTIAL";
} else {
  type = "NONE";
}

return NextResponse.json({
  success: true,
  type,
  refundAmount,
  tutorCompensation,
});

  } catch (err) {
    console.error("CANCEL ERROR:", err);

    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}