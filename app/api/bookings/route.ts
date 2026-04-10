// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { checkStudentAccess } from "@/lib/paymentGuard";

// import {
//   BookingStatus,
//   AvailabilityType,
// } from "@prisma/client";

// export async function POST(req: NextRequest) {
//   try {
//     /* ================= AUTH ================= */
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const access = await checkStudentAccess(session.user.id);

// if (!access.allowed) {
//   return NextResponse.json(
//     {
//       error:
//         access.reason === "ACCOUNT_SUSPENDED"
//           ? "Your account is suspended."
//           : "You have unpaid dues. Please clear them to continue.",
//     },
//     { status: 403 }
//   );
// }

//     const {
//       tutorId,
//       availabilityId,
//       sessionType,
//       subject,
//       level,
//       note,
//     } = await req.json();

//     if (!tutorId || !availabilityId || !sessionType || !subject) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     /* ================= FETCH AVAILABILITY ================= */
//     const availability = await prisma.tutorAvailability.findUnique({
//       where: { id: availabilityId },
//     });

//     if (!availability || !availability.isActive) {
//       return NextResponse.json(
//         { error: "Invalid availability" },
//         { status: 404 }
//       );
//     }

//     if (availability.sessionType !== sessionType) {
//       return NextResponse.json(
//         { error: "Session type mismatch" },
//         { status: 400 }
//       );
//     }

//     /* ================= BUILD DATE & TIME ================= */
//     const dateStr = availability.date
//       .toISOString()
//       .split("T")[0];

//     const startTime = new Date(
//       `${dateStr}T${availability.startTime}:00`
//     );

//     const endTime = new Date(
//       startTime.getTime() +
//         availability.durationMin * 60 * 1000
//     );

//     /* ================= DUPLICATE CHECK ================= */
//     const duplicateBooking = await prisma.booking.findFirst({
//       where: {
//         studentId: session.user.id,
//         tutorId,
//          availabilityId,
//         status: {
//           notIn: [
//             BookingStatus.REJECTED,
//             BookingStatus.EXPIRED,
//           ],
//         },
//       },
//     });

//     if (duplicateBooking) {
//       return NextResponse.json(
//         {
//           error:
//             "You already have a booking with this tutor at the selected time.",
//         },
//         { status: 409 }
//       );
//     }

//     /* ================= ONE-TO-ONE CHECK ================= */
//     if (availability.sessionType === AvailabilityType.ONE_TO_ONE) {
//       const conflict = await prisma.booking.findFirst({
//         where: {
//           availabilityId,
//           status: {
//             in: [
//               BookingStatus.REQUESTED,
//               BookingStatus.PAYMENT_PENDING,
//               BookingStatus.READY,
//             ],
//           },
//         },
//       });

//       if (conflict) {
//         return NextResponse.json(
//           { error: "This slot is already booked" },
//           { status: 409 }
//         );
//       }
//     }

//     /* ================= FETCH TUTOR RATE ================= */
//     const tutor = await prisma.tutor.findUnique({
//       where: { id: tutorId },
//       select: { rate: true },
//     });

//     const hourlyRate = tutor?.rate ?? 0;

//     /* ================= TRANSACTION (CRITICAL FIX) ================= */
//     let booking;

//     try {
//       booking = await prisma.$transaction(async (tx) => {

//         const freshAvailability = await tx.tutorAvailability.findUnique({
//           where: { id: availabilityId },
//           select: {
//             currentCount: true,
//             maxStudents: true,
//             sessionType: true,
//           },
//         });

//         if (!freshAvailability) {
//           throw new Error("NOT_FOUND");
//         }

//        /* ===== REAL CAPACITY CHECK ===== */
// if (freshAvailability.sessionType === AvailabilityType.GROUP) {

//   const activeBookingsCount = await tx.booking.count({
//     where: {
//       availabilityId,
//       status: {
//         in: [
//           BookingStatus.REQUESTED,
//           BookingStatus.PAYMENT_PENDING,
//           BookingStatus.READY,
//         ],
//       },
//     },
//   });

//   if (
//     freshAvailability.maxStudents &&
//     activeBookingsCount >= freshAvailability.maxStudents
//   ) {
//     throw new Error("FULL");
//   }
// }

//         /* ===== CREATE BOOKING ===== */
//         return await tx.booking.create({
//           data: {
//             studentId: session.user.id,
//             tutorId,
//             availabilityId,
//             sessionType,
//             subject,
//             level,
//             bookingDate: startTime,
//             startTime,
//             endTime,
//             durationMin: availability.durationMin,
//             maxStudents: availability.maxStudents,
//             currentCount: 1,
//             hourlyRate,
//             totalAmount: Math.ceil(
//               (hourlyRate * availability.durationMin) / 60
//             ),
//             note,
//             status: BookingStatus.REQUESTED,
//             tutorSeen: false,
//           },
//         });
//       });

//     } catch (err: any) {

//       if (err.message === "FULL") {
//         return NextResponse.json(
//           { error: "This group session is full" },
//           { status: 409 }
//         );
//       }

//       if (err.message === "NOT_FOUND") {
//         return NextResponse.json(
//           { error: "Availability not found" },
//           { status: 404 }
//         );
//       }

//       console.error("BOOKING TX ERROR:", err);

//       return NextResponse.json(
//         { error: "Failed to create booking" },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({ booking }, { status: 201 });

//   } catch (err) {
//     console.error("BOOKING CREATE ERROR:", err);
//     return NextResponse.json(
//       { error: "Failed to create booking" },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkStudentAccess } from "@/lib/paymentGuard";

import {
  BookingStatus,
  AvailabilityType,
} from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    /* ================= AUTH ================= */
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const access = await checkStudentAccess(session.user.id);

if (!access.allowed) {
  return NextResponse.json(
    {
      error:
        access.reason === "ACCOUNT_SUSPENDED"
          ? "Your account is suspended."
          : "You have unpaid dues. Please clear them to continue.",
    },
    { status: 403 }
  );
}

    const {
      tutorId,
      availabilityId,
      sessionType,
      subject,
      level,
      note,
    } = await req.json();

    if (!tutorId || !availabilityId || !sessionType || !subject) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ================= FETCH AVAILABILITY ================= */
   const availability = await prisma.tutorAvailability.findUnique({
  where: { id: availabilityId },
  select: {
    id: true,
    tutorId: true,
    subject: true,
    level: true,
    date: true,
    startTime: true,
    durationMin: true,
    sessionType: true,
    maxStudents: true,
    isActive: true,
  },
});

    if (!availability || !availability.isActive) {

      
      return NextResponse.json(
        { error: "Invalid availability" },
        { status: 404 }
      );
    }
    // 🔒 SECURITY VALIDATIONS

if (availability.tutorId !== tutorId) {
  return NextResponse.json(
    { error: "Tutor mismatch for selected slot" },
    { status: 400 }
  );
}

if (availability.subject !== subject) {
  return NextResponse.json(
    { error: "Subject does not match selected slot" },
    { status: 400 }
  );
}

if ((availability.level || null) !== (level || null)) {
  return NextResponse.json(
    { error: "Level does not match selected slot" },
    { status: 400 }
  );
}

    if (availability.sessionType !== sessionType) {
      return NextResponse.json(
        { error: "Session type mismatch" },
        { status: 400 }
      );
    }

    /* ================= BUILD DATE & TIME ================= */
    const dateStr = availability.date
      .toISOString()
      .split("T")[0];

    const startTime = new Date(
      `${dateStr}T${availability.startTime}:00`
    );

    const endTime = new Date(
      startTime.getTime() +
        availability.durationMin * 60 * 1000
    );

    /* ================= DUPLICATE CHECK ================= */
    const duplicateBooking = await prisma.booking.findFirst({
      where: {
        studentId: session.user.id,
        tutorId,
         availabilityId,
        status: {
          notIn: [
            BookingStatus.REJECTED,
            BookingStatus.EXPIRED,
          ],
        },
      },
    });

    if (duplicateBooking) {
      return NextResponse.json(
        {
          error:
            "You already have a booking with this tutor at the selected time.",
        },
        { status: 409 }
      );
    }

    /* ================= ONE-TO-ONE CHECK ================= */
    if (availability.sessionType === AvailabilityType.ONE_TO_ONE) {
      const conflict = await prisma.booking.findFirst({
        where: {
          availabilityId,
          status: {
            in: [
              BookingStatus.REQUESTED,
              BookingStatus.PAYMENT_PENDING,
              BookingStatus.READY,
            ],
          },
        },
      });

      if (conflict) {
        return NextResponse.json(
          { error: "This slot is already booked" },
          { status: 409 }
        );
      }
    }

    /* ================= FETCH TUTOR RATE ================= */
    const tutor = await prisma.tutor.findUnique({
      where: { id: tutorId },
      select: { rate: true },
    });

    const hourlyRate = tutor?.rate ?? 0;

    /* ================= TRANSACTION (CRITICAL FIX) ================= */
    let booking;

    try {
      booking = await prisma.$transaction(async (tx) => {

        const freshAvailability = await tx.tutorAvailability.findUnique({
          where: { id: availabilityId },
          select: {
            currentCount: true,
            maxStudents: true,
            sessionType: true,
          },
        });

        if (!freshAvailability) {
          throw new Error("NOT_FOUND");
        }

       /* ===== REAL CAPACITY CHECK ===== */
if (freshAvailability.sessionType === AvailabilityType.GROUP) {

  const activeBookingsCount = await tx.booking.count({
    where: {
      availabilityId,
      status: {
        in: [
          BookingStatus.REQUESTED,
          BookingStatus.PAYMENT_PENDING,
          BookingStatus.READY,
        ],
      },
    },
  });

  if (
    freshAvailability.maxStudents &&
    activeBookingsCount >= freshAvailability.maxStudents
  ) {
    throw new Error("FULL");
  }
}

        /* ===== CREATE BOOKING ===== */
        return await tx.booking.create({
          data: {
            studentId: session.user.id,
            tutorId,
            availabilityId,
            sessionType,
            subject,
            level,
            bookingDate: startTime,
            startTime,
            endTime,
            durationMin: availability.durationMin,
            maxStudents: availability.maxStudents,
            currentCount: 1,
            hourlyRate,
            totalAmount: Math.ceil(
              (hourlyRate * availability.durationMin) / 60
            ),
            note,
            status: BookingStatus.REQUESTED,
            tutorSeen: false,
          },
        });
      });

    } catch (err: any) {

      if (err.message === "FULL") {
        return NextResponse.json(
          { error: "This group session is full" },
          { status: 409 }
        );
      }

      if (err.message === "NOT_FOUND") {
        return NextResponse.json(
          { error: "Availability not found" },
          { status: 404 }
        );
      }

      console.error("BOOKING TX ERROR:", err);

      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    return NextResponse.json({ booking }, { status: 201 });

  } catch (err) {
    console.error("BOOKING CREATE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}