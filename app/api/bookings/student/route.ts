// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { BookingStatus } from "@prisma/client";

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ bookings: [] });
//     }

//     const now = new Date();

//     /* 🔴 AUTO-EXPIRE STUDENT BOOKINGS (FINAL LOGIC) */
//     await prisma.booking.updateMany({
//       where: {
//         studentId: session.user.id,
//         startTime: { lt: now },

//         // ❗ tutor never started the session
//         meetingRoom: null,

//         status: {
//           in: [
//             BookingStatus.REQUESTED,
//             BookingStatus.PAYMENT_PENDING,
//             BookingStatus.READY,
//           ],
//         },
//       },
//       data: {
//         status: BookingStatus.EXPIRED,
//       },
//     });

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
//         sessionType: true,
//         meetingRoom: true,

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
      },
    });

    await prisma.$transaction(async (tx) => {
      for (const b of bookingsForExpire) {
        const start = new Date(b.startTime);
        const duration = b.durationMin ?? 120;
        const end = new Date(start.getTime() + duration * 60000);

        if (now > end) {
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
      where: { studentId: session.user.id },
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

    return NextResponse.json({ bookings });
  } catch (err) {
    console.error("STUDENT BOOKINGS ERROR:", err);
    return NextResponse.json({ bookings: [] });
  }
}