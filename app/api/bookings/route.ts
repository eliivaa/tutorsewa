// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { BookingStatus, SessionType } from "@prisma/client";

// export async function POST(req: NextRequest) {
//   try {
//     /* =========================
//        AUTH (STUDENT)
//     ========================= */
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     /* =========================
//        BODY
//     ========================= */
//     const {
//       tutorId,
//       availabilityId,
//       sessionType,
//       subject,
//       note,
//     } = await req.json();

//     if (!tutorId || !availabilityId || !sessionType) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     /* =========================
//        FETCH AVAILABILITY (SOURCE OF TRUTH)
//     ========================= */
//     const availability = await prisma.tutorAvailability.findUnique({
//       where: { id: availabilityId },
//     });

//     if (!availability || !availability.isActive) {
//       return NextResponse.json(
//         { error: "Availability not found" },
//         { status: 404 }
//       );
//     }

//     /* =========================
//        SESSION TYPE MATCH
//     ========================= */
//     if (availability.sessionType !== sessionType) {
//       return NextResponse.json(
//         { error: "Session type does not match availability" },
//         { status: 400 }
//       );
//     }

//     /* =========================
//        DATE CALCULATION
//     ========================= */
//     const bookingDate = new Date();
//     const [h, m] = availability.startTime.split(":").map(Number);

//     bookingDate.setHours(h, m, 0, 0);

//     const start = bookingDate;
//     const end = new Date(
//       start.getTime() + availability.durationMin * 60000
//     );

//     /* =========================
//        DOUBLE BOOKING PREVENTION
//     ========================= */
//     const conflict = await prisma.booking.findFirst({
//       where: {
//         tutorId,
//         startTime: { lt: end },
//         endTime: { gt: start },
//         status: {
//           in: [
//             BookingStatus.REQUESTED,
//             BookingStatus.PAYMENT_PENDING,
//             BookingStatus.CONFIRMED,
//           ],
//         },
//       },
//     });

//     if (conflict) {
//       return NextResponse.json(
//         { error: "This time slot is already booked" },
//         { status: 409 }
//       );
//     }

//     /* =========================
//        GROUP CAPACITY ENFORCEMENT
//     ========================= */
//     if (sessionType === SessionType.GROUP) {
//       const currentGroupCount = await prisma.booking.count({
//         where: {
//           availabilityId,
//           status: {
//             in: [
//               BookingStatus.REQUESTED,
//               BookingStatus.CONFIRMED,
//               BookingStatus.PAYMENT_PENDING,
//             ],
//           },
//         },
//       });

//       if (
//         availability.maxStudents &&
//         currentGroupCount >= availability.maxStudents
//       ) {
//         return NextResponse.json(
//           { error: "Group session is full" },
//           { status: 409 }
//         );
//       }
//     }

//     /* =========================
//        PRICE
//     ========================= */
//     const tutor = await prisma.tutor.findUnique({
//       where: { id: tutorId },
//     });

//     const hourlyRate = tutor?.rate ?? 0;
//     const totalAmount = Math.ceil(
//       (hourlyRate * availability.durationMin) / 60
//     );

//     /* =========================
//        CREATE BOOKING
//     ========================= */
//   const booking = await prisma.booking.create({
//   data: {
//     studentId: session.user.id,
//     tutorId,
//     availabilityId,
//     sessionType,
//     subject: subject || "General", // ✅ SAFETY FIX
//     bookingDate,
//     startTime: start,
//     endTime: end,
//     durationMin: availability.durationMin,
//     maxStudents: availability.maxStudents,
//     currentCount: 1,
//     hourlyRate,
//     totalAmount,
//     note,
//     status: BookingStatus.REQUESTED,
//   },
// });



//     return NextResponse.json({ booking }, { status: 201 });
//   } catch (err) {
//     console.error("BOOKING ERROR:", err);
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
import { BookingStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  /* ============================
     FETCH AVAILABILITY
  ============================ */
  const availability = await prisma.tutorAvailability.findUnique({
    where: { id: availabilityId },
  });

  if (!availability || !availability.isActive) {
    return NextResponse.json(
      { error: "Invalid availability" },
      { status: 404 }
    );
  }

  if (availability.sessionType !== sessionType) {
    return NextResponse.json(
      { error: "Session type mismatch" },
      { status: 400 }
    );
  }

  /* ============================
     BUILD CORRECT DATETIME
  ============================ */
  const dateStr = availability.date.toISOString().split("T")[0]; // YYYY-MM-DD
  const startTime = new Date(`${dateStr}T${availability.startTime}:00`);
  const endTime = new Date(
    startTime.getTime() + availability.durationMin * 60000
  );

  /* ============================
     CONFLICT CHECK (NOW CORRECT)
  ============================ */
  const conflict = await prisma.booking.findFirst({
    where: {
      tutorId,
      startTime: { lt: endTime },
      endTime: { gt: startTime },
      status: {
        in: [
          BookingStatus.REQUESTED,
          BookingStatus.CONFIRMED,
          BookingStatus.PAYMENT_PENDING,
        ],
      },
    },
  });

  if (conflict) {
    return NextResponse.json(
      { error: "Slot already booked" },
      { status: 409 }
    );
  }

  /* ============================
     CREATE BOOKING
  ============================ */
  const tutor = await prisma.tutor.findUnique({
    where: { id: tutorId },
    select: { rate: true },
  });

  const hourlyRate = tutor?.rate ?? 0;

  const booking = await prisma.booking.create({
    data: {
      studentId: session.user.id,
      tutorId,
      availabilityId,
      sessionType,
      subject,        // ✅ Math
      level,          // ✅ Grade 10
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
    },
  });

  return NextResponse.json({ booking }, { status: 201 });
}
