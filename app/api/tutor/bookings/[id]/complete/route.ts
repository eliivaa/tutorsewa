// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import { BookingStatus, NotificationType } from "@prisma/client";
// import { adminLog } from "@/lib/adminLog";


// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const token = cookies().get("tutor_token")?.value;
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const tutor = jwt.verify(
//       token,
//       process.env.JWT_SECRET!
//     ) as { id: string };

//     const booking = await prisma.booking.findUnique({
//       where: { id: params.id },
//     });

//     if (!booking || booking.tutorId !== tutor.id) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     const now = new Date();

//     /* ❌ BLOCK FUTURE COMPLETION */
//     if (booking.startTime > now) {
//       return NextResponse.json(
//         { error: "Session has not started yet" },
//         { status: 400 }
//       );
//     }

//     /* ❌ BLOCK IF NOT STARTED */
//     if (
//       booking.status !== BookingStatus.READY ||
//       !booking.sessionStarted
//     ) {
//       return NextResponse.json(
//         { error: "Session is not active" },
//         { status: 400 }
//       );
//     }

//     /* ✅ COMPLETE SESSION */
//   /* =========================
// COMPLETE SESSION + PAYOUT
// ========================= */

// const updatedBooking = await prisma.$transaction(async (tx) => {
//   // 1. mark completed
//   const updated = await tx.booking.update({
//     where: { id: booking.id },
//     data: {
//       status: BookingStatus.COMPLETED,
//       endedAt: new Date(),
//     },
//   });

//   // 2. calculate tutor earning (85%)
//   const tutorAmount = Math.floor(booking.totalAmount * 0.85);

//   // 3. create tutor earning record
//   await tx.tutorEarning.create({
//     data: {
//       tutorId: booking.tutorId,
//       bookingId: booking.id,
//       amount: tutorAmount,
//       type: "COMPLETION",
//     },
//   });

//   return updated;
// });

//     await prisma.notification.create({
//       data: {
//         userId: booking.studentId,
//         bookingId: booking.id,
//         title: "Session Completed",
//         message: "Your tutoring session has been completed.",
//         type: NotificationType.SESSION_COMPLETED,
//         actionUrl: "/dashboard/sessions",
//       },

//     });
//     await adminLog(
//   "SESSION",
//   "Session Completed",
//   `Session finished: ${booking.subject}`,
//   "SESSION_COMPLETED",
//   "/admin/sessions"
// );
//     return NextResponse.json({
//       success: true,
//       booking: updatedBooking,
//     });
//   } catch (err) {
//     console.error("COMPLETE SESSION ERROR:", err);
//     return NextResponse.json(
//       { error: "Failed to complete session" },
//       { status: 500 }
//     );
//   }
// }



  // after refund/cancel

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import {
  BookingStatus,
  NotificationType,
  BookingPaymentStatus,
} from "@prisma/client";
import { adminLog } from "@/lib/adminLog";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = cookies().get("tutor_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tutor = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking || booking.tutorId !== tutor.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const now = new Date();

    /* ❌ BLOCK FUTURE */
    if (booking.startTime > now) {
      return NextResponse.json(
        { error: "Session has not started yet" },
        { status: 400 }
      );
    }

    /* ❌ BLOCK IF NOT ACTIVE */
    if (
      booking.status !== BookingStatus.READY ||
      !booking.sessionStarted
    ) {
      return NextResponse.json(
        { error: "Session is not active" },
        { status: 400 }
      );
    }

    /* ❌ BLOCK IF NOT PAID */
    if (booking.paymentStatus === BookingPaymentStatus.UNPAID) {
      return NextResponse.json(
        { error: "Session not paid. Cannot complete." },
        { status: 400 }
      );
    }

    /* ❌ PREVENT DOUBLE EARNING */
    const existingEarning = await prisma.tutorEarning.findFirst({
      where: {
        bookingId: booking.id,
        type: "COMPLETION",
      },
    });

    if (existingEarning) {
      return NextResponse.json(
        { error: "Session already completed & paid" },
        { status: 400 }
      );
    }

    /* =========================
    COMPLETE SESSION + PAYOUT
    ========================= */

    const updatedBooking = await prisma.$transaction(async (tx) => {
      // 1. mark completed
      const updated = await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: BookingStatus.COMPLETED,
          endedAt: new Date(),
        },
      });

      // 2. calculate tutor earning (85%)
      const tutorAmount = Math.round(booking.totalAmount * 0.85);

      // 3. create tutor earning
      await tx.tutorEarning.create({
        data: {
          tutorId: booking.tutorId,
          bookingId: booking.id,
          amount: tutorAmount,
          type: "COMPLETION",
        },
      });

      return updated;
    });

    /* 🔔 STUDENT NOTIFICATION */
    await prisma.notification.create({
      data: {
        userId: booking.studentId,
        bookingId: booking.id,
        title: "Session Completed",
        message: "Your tutoring session has been completed.",
        type: NotificationType.SESSION_COMPLETED,
        actionUrl: "/dashboard/sessions",
      },
    });

    /* 🛠 ADMIN LOG */
    await adminLog(
      "SESSION",
      "Session Completed",
      `Session finished: ${booking.subject}`,
      "SESSION_COMPLETED",
      "/admin/sessions"
    );

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
    });
  } catch (err) {
    console.error("COMPLETE SESSION ERROR:", err);
    return NextResponse.json(
      { error: "Failed to complete session" },
      { status: 500 }
    );
  }
}