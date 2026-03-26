// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import { BookingStatus } from "@prisma/client";

// export async function GET() {
//   try {
//     const token = cookies().get("tutor_token")?.value;

//     if (!token) {
//       return NextResponse.json(
//         {
//           bookings: [],
//           activeGroups: [],
//           waitingPayment: [],
//           oneToOneBookings: [],
//           error: "Unauthorized",
//         },
//         { status: 401 }
//       );
//     }

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET!
//     ) as { id: string };

//     const tutorId = decoded.id;
//     const now = new Date();

//     /* ================= AUTO-EXPIRE ================= */
//     const bookingsForExpire = await prisma.booking.findMany({
//   where: {
//     tutorId,
//     status: {
//       in: [
//         BookingStatus.REQUESTED,
//         BookingStatus.PAYMENT_PENDING,
//         BookingStatus.CONFIRMED,
//         BookingStatus.READY,
//       ],
//     },
//   },
//   select: {
//     id: true,
//     startTime: true,
//     durationMin: true,
//   },
// });

// for (const b of bookingsForExpire) {
//   const start = new Date(b.startTime);
//   const duration = b.durationMin ?? 120;
//   const end = new Date(start.getTime() + duration * 60 * 1000);

//   if (now > end) {
//     await prisma.booking.update({
//       where: { id: b.id },
//       data: { status: BookingStatus.EXPIRED },
//     });
//   }
// }

//     /* ================= MARK REQUESTS AS SEEN ================= */
// await prisma.booking.updateMany({
//   where: {
//     tutorId,
//     status: BookingStatus.REQUESTED,
//     tutorSeen: false,
//   },
//   data: {
//     tutorSeen: true,
//   },
// });

//     /* ================= FETCH BOOKINGS ================= */
//     const bookings = await prisma.booking.findMany({
//       where: { tutorId },
//       orderBy: { startTime: "asc" },
//       select: {
//         id: true,
//         durationMin: true,
//         status: true,
//         paymentStatus: true,
//         startTime: true,
//         sessionType: true,
//         meetingRoom: true,
//         student: {
//           select: {
//             name: true,
//             image: true,
//           },
//         },
//       },
//     });

//     /* ================= SPLIT BOOKINGS ================= */

//     const groupBookings = bookings.filter(
//       (b) => b.sessionType === "GROUP"
//     );

//     const oneToOneBookings = bookings.filter(
//       (b) => b.sessionType === "ONE_TO_ONE"
//     );

//     const activeGroups = groupBookings.filter(
//       (b) =>
//         b.paymentStatus === "FULLY_PAID" &&
//         (b.status === BookingStatus.CONFIRMED ||
//           b.status === BookingStatus.READY)
//     );

//     const waitingPayment = groupBookings.filter(
//       (b) =>
//         b.paymentStatus !== "FULLY_PAID" &&
//         b.status === BookingStatus.CONFIRMED
//     );

//     /* ================= RETURN FIXED ================= */

//     return NextResponse.json({
//       bookings,              // ✅ THIS FIXES YOUR UI
//       activeGroups,
//       waitingPayment,
//       oneToOneBookings,
//     });

//   } catch (err) {
//     console.error("GET TUTOR BOOKINGS ERROR:", err);

//     return NextResponse.json(
//       {
//         bookings: [],
//         activeGroups: [],
//         waitingPayment: [],
//         oneToOneBookings: [],
//       },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { BookingStatus } from "@prisma/client";

export async function GET() {
  try {
    const token = cookies().get("tutor_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          bookings: [],
          activeGroups: [],
          waitingPayment: [],
          oneToOneBookings: [],
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    const tutorId = decoded.id;
    const now = new Date();

    /* ================= AUTO-EXPIRE ================= */
    const bookingsForExpire = await prisma.booking.findMany({
      where: {
        tutorId,
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
        startTime: true,
        durationMin: true,
      },
    });

    for (const b of bookingsForExpire) {
      const start = new Date(b.startTime);
      const duration = b.durationMin ?? 120;
      const end = new Date(start.getTime() + duration * 60 * 1000);

      if (now > end) {
        await prisma.booking.update({
          where: { id: b.id },
          data: { status: BookingStatus.EXPIRED },
        });
      }
    }

    /* ================= MARK REQUESTS AS SEEN ================= */
    await prisma.booking.updateMany({
      where: {
        tutorId,
        status: BookingStatus.REQUESTED,
        tutorSeen: false,
      },
      data: {
        tutorSeen: true,
      },
    });

    /* ================= FETCH BOOKINGS ================= */
    const bookings = await prisma.booking.findMany({
      where: { tutorId },
      orderBy: { startTime: "asc" },
      select: {
        id: true,
        durationMin: true,
        status: true,
        paymentStatus: true,
        startTime: true,
        sessionType: true,
        meetingRoom: true,
        student: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    /* ================= SPLIT BOOKINGS ================= */

    const groupBookings = bookings.filter(
      (b) => b.sessionType === "GROUP"
    );

    const oneToOneBookings = bookings.filter(
      (b) => b.sessionType === "ONE_TO_ONE"
    );

    /* ================= LOGIC ================= */

    // ✅ ACTIVE GROUPS → fully paid + ready
    const activeGroups = groupBookings.filter(
      (b) =>
        b.paymentStatus === "FULLY_PAID" &&
        b.status === BookingStatus.READY
    );

    // ✅ WAITING PAYMENT → not fully paid + payment pending
    const waitingPayment = groupBookings.filter(
      (b) =>
        b.paymentStatus !== "FULLY_PAID" &&
        b.status === BookingStatus.PAYMENT_PENDING
    );

    /* ================= RETURN ================= */

    return NextResponse.json({
      bookings,
      activeGroups,
      waitingPayment,
      oneToOneBookings,
    });

  } catch (err) {
    console.error("GET TUTOR BOOKINGS ERROR:", err);

    return NextResponse.json(
      {
        bookings: [],
        activeGroups: [],
        waitingPayment: [],
        oneToOneBookings: [],
      },
      { status: 500 }
    );
  }
}