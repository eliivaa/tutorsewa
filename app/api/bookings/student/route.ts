// // cancel/refund

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { BookingStatus, RefundStatus } from "@prisma/client";

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ bookings: [] });
//     }

//     const now = new Date();

//     /* =========================
//     AUTO-EXPIRE (END TIME BASED)
//     ========================= */

//     const bookingsForExpire = await prisma.booking.findMany({
//       where: {
//         studentId: session.user.id,
//         status: {
//           in: [
//             BookingStatus.REQUESTED,
//             BookingStatus.PAYMENT_PENDING,
//             BookingStatus.READY,
//           ],
//         },
//       },
//       select: {
//         id: true,
//         tutorId: true,
//         startTime: true,
//         durationMin: true,
//         totalAmount: true,
//         paymentStatus: true,
//          status: true,
//       },
//     });

//     await prisma.$transaction(async (tx) => {
//       for (const b of bookingsForExpire) {
//         const start = new Date(b.startTime);
//         const duration = b.durationMin ?? 120;
//         const end = new Date(start.getTime() + duration * 60000);

//         if (now > end) {

//   // 🔒 DO NOT expire completed sessions
//   if (b.status === BookingStatus.COMPLETED) continue;

//   /* 1️⃣ MARK EXPIRED */
//   await tx.booking.update({
//     where: { id: b.id },
//     data: {
//       status: BookingStatus.EXPIRED,
//       cancelReason: "Auto expired (student no-show)",
//       refundAmount: 0,
//       refundStatus: RefundStatus.NOT_ELIGIBLE,
//     },
//   });

//           /* 2️⃣ CALCULATE PAID AMOUNT */
//           let paidAmount = 0;

//           if (b.paymentStatus === "FULLY_PAID") {
//             paidAmount = b.totalAmount;
//           } else if (b.paymentStatus === "PARTIALLY_PAID") {
//             paidAmount = Math.floor(b.totalAmount / 2);
//           }

//           /* 3️⃣ TUTOR COMPENSATION (50%) */
//           if (paidAmount > 0) {
//             const tutorShare = Math.floor(paidAmount * 0.5);

//             if (tutorShare > 0) {
//               await tx.tutorEarning.create({
//                 data: {
//                   tutorId: b.tutorId,
//                   bookingId: b.id,
//                   amount: tutorShare,
//                   type: "COMPENSATION",
//                 },
//               });
//             }
//           }
//         }
//       }
//     });

//     /* =========================
//     FETCH BOOKINGS
//     ========================= */

//     const bookings = await prisma.booking.findMany({
//       where: { studentId: session.user.id },
//       orderBy: { startTime: "desc" },
//       select: {
//         id: true,
//         subject: true,
//         level: true,
//         status: true,
//         paymentStatus: true,
//         totalAmount: true,
//         bookingDate: true,
//         startTime: true,
//         durationMin: true,
//         sessionType: true,
//         meetingRoom: true,
//          paymentDueAt: true,

//         tutor: {
//           select: {
//             name: true,
//             photo: true,
//           },
//         },

//         payments: {
//           select: {
//             paidAmount: true,
//             status: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json({ bookings });
//   } catch (err) {
//     console.error("STUDENT BOOKINGS ERROR:", err);
//     return NextResponse.json({ bookings: [] });
//   }
// }

// cancel/refund

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { BookingStatus, RefundStatus } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ bookings: [] });
    }

    const now = new Date();

    /* =========================
    AUTO-EXPIRE (END TIME BASED)
    ========================= */

  const bookingsForExpire = await prisma.booking.findMany({
  where: {
    studentId: session.user.id,
    status: {
      in: [
        BookingStatus.REQUESTED,
        BookingStatus.PAYMENT_PENDING,
        BookingStatus.READY,
      ],
    },
  },
  select: {
    id: true,
    tutorId: true,
    startTime: true,
    durationMin: true,
    totalAmount: true,
    paymentStatus: true,
    status: true,
  },
});

    await prisma.$transaction(async (tx) => {
  for (const b of bookingsForExpire) {
    const start = new Date(b.startTime);
    const duration = b.durationMin ?? 120;
    const end = new Date(start.getTime() + duration * 60000);

    if (now <= end) continue;

    /* 1️⃣ MARK EXPIRED */
    await tx.booking.update({
      where: { id: b.id },
      data: {
        status: BookingStatus.EXPIRED,
        cancelReason: "Auto expired (student no-show)",
        refundAmount: 0,
        refundStatus: RefundStatus.NOT_ELIGIBLE,
      },
    });

    /* 2️⃣ CALCULATE PAID AMOUNT */
    let paidAmount = 0;

    if (b.paymentStatus === "FULLY_PAID") {
      paidAmount = b.totalAmount;
    } else if (b.paymentStatus === "PARTIALLY_PAID") {
      paidAmount = Math.floor(b.totalAmount / 2);
    }

    /* 3️⃣ TUTOR COMPENSATION (50%) */
    if (paidAmount > 0) {
      const tutorShare = Math.floor(paidAmount * 0.5);

      if (tutorShare > 0) {
        const existingWalletTxn = await tx.tutorWalletTransaction.findFirst({
          where: {
            bookingId: b.id,
            reason: "NO_SHOW_COMPENSATION",
          },
        });

        const existingEarning = await tx.tutorEarning.findFirst({
          where: {
            bookingId: b.id,
            type: "COMPENSATION",
          },
        });

        if (!existingWalletTxn) {
          await tx.tutor.update({
            where: { id: b.tutorId },
            data: {
              walletBalance: {
                increment: tutorShare,
              },
            },
          });

          await tx.tutorWalletTransaction.create({
            data: {
              tutorId: b.tutorId,
              amount: tutorShare,
              type: "CREDIT",
              reason: "NO_SHOW_COMPENSATION",
              bookingId: b.id,
            },
          });
        }

        if (!existingEarning) {
          await tx.tutorEarning.create({
            data: {
              tutorId: b.tutorId,
              bookingId: b.id,
              amount: tutorShare,
              type: "COMPENSATION",
            },
          });
        }
      }
    }
  }
});
    /* =========================
    FETCH BOOKINGS
    ========================= */

    const bookings = await prisma.booking.findMany({
      where: {
  studentId: session.user.id,

},
      orderBy: { startTime: "desc" },
      select: {
        id: true,
        subject: true,
        level: true,
        status: true,
        paymentStatus: true,
        totalAmount: true,
        bookingDate: true,
        startTime: true,
        durationMin: true,
        sessionType: true,
        meetingRoom: true,
         paymentDueAt: true,

        tutor: {
          select: {
            name: true,
            photo: true,
          },
        },

        payments: {
          select: {
            paidAmount: true,
            status: true,
          },
        },
      },
    });

const pending = [];
const history = [];

for (const b of bookings) {
  const totalPaid = b.payments.reduce(
    (sum, p) => sum + (p.paidAmount ?? 0),
    0
  );

  const remaining = Math.max(b.totalAmount - totalPaid, 0);

  const item = {
    ...b,
    remaining,
  };

  // ❌ Skip requested
  if (b.status === BookingStatus.REQUESTED) continue;

  /* =========================
     🟣 HISTORY FIRST (IMPORTANT)
  ========================= */
  if (b.paymentStatus === "FULLY_PAID") {
    history.push(item);
    continue;
  }

  if (
    b.status === BookingStatus.COMPLETED ||
    b.status === BookingStatus.CANCELLED ||
    b.status === BookingStatus.EXPIRED
  ) {
    history.push(item);
    continue;
  }

  /* =========================
     🟡 PENDING
  ========================= */
  if (
    b.paymentStatus === "UNPAID" ||
    b.paymentStatus === "PARTIALLY_PAID"
  ) {
    pending.push(item);
    continue;
  }
}

return NextResponse.json({
  bookings,   
  pending,
  history,
});

  } catch (err) {
    console.error("STUDENT BOOKINGS ERROR:", err);
    return NextResponse.json({ bookings: [] });
  }
}