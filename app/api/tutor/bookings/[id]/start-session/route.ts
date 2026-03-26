import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { BookingStatus, SessionType, PaymentStatus  } from "@prisma/client";
import { randomUUID } from "crypto";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    /* ================= AUTH ================= */
    const token = cookies().get("tutor_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tutor = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

   const booking = await prisma.booking.findUnique({
  where: { id: params.id },
});

if (!booking || booking.tutorId !== tutor.id) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

const start = new Date(booking.startTime);
const duration = booking.durationMin ?? 120;
const end = new Date(start.getTime() + duration * 60 * 1000);

if (new Date() > end) {
  return NextResponse.json(
    { error: "Session already expired" },
    { status: 400 }
  );
}

    if (
      booking.status === BookingStatus.COMPLETED ||
      booking.status === BookingStatus.EXPIRED
    ) {
      return NextResponse.json(
        { error: "Session already ended" },
        { status: 400 }
      );
    }

    const now = new Date();

    /* ================= 15 MIN EARLY START ================= */
    const startTime = new Date(booking.startTime);
  
  // const allowTime = new Date(startTime.getTime() - 24 * 60 * 60 * 1000);

const allowTime = new Date(startTime.getTime() - 7 * 24 * 60 * 60 * 1000);

    if (now < allowTime) {
      return NextResponse.json(
        { error: "You can start 15 minutes before session time" },
        { status: 400 }
      );
    }

    /* =======================================================
       GROUP SESSION (Flexible Model)
    ======================================================= */

    if (booking.sessionType === SessionType.GROUP) {

  // Get ALL group bookings for same slot
  const groupBookings = await prisma.booking.findMany({
    where: {
      tutorId: booking.tutorId,
      availabilityId: booking.availabilityId,
      sessionType: SessionType.GROUP,
      startTime: booking.startTime,

      // ❗ include all accepted bookings
      status: {
        notIn: [
          BookingStatus.REQUESTED,
          BookingStatus.REJECTED,
          BookingStatus.EXPIRED,
        ],
      },
    },
    select: {
      id: true,
      meetingRoom: true,
      paymentStatus: true,
    },
  });

  if (groupBookings.length === 0) {
    return NextResponse.json(
      { error: "No group bookings found" },
      { status: 400 }
    );
  }

const hasPaidStudent = groupBookings.some(
  (b) =>
    b.paymentStatus === "FULLY_PAID" ||
    b.paymentStatus === "PARTIALLY_PAID"
);

 if (!hasPaidStudent) {
  return NextResponse.json(
    { error: "At least one student must pay first" },
    { status: 400 }
  );
}

  // 🔐 One single shared room
  const existingRoom =
    groupBookings.find((b) => b.meetingRoom)?.meetingRoom;

  const room =
    existingRoom ?? `TutorSewa-GROUP-${randomUUID().slice(0, 6)}`;

  // 🔥 UPDATE EVERY GROUP BOOKING
  await prisma.booking.updateMany({
    where: {
      id: {
        in: groupBookings.map((b) => b.id),
      },
    },
    data: {
      meetingRoom: room,
      sessionStarted: true,
      status: BookingStatus.READY,
      startedAt: new Date(),
    },
  });

  return NextResponse.json({ room });
}

    
    /* =======================================================
   ONE-TO-ONE SESSION
======================================================= */

/* Allow HALF or FULL paid */
if (
  booking.paymentStatus !== "FULLY_PAID" &&
  booking.paymentStatus !== "PARTIALLY_PAID"
) {
  return NextResponse.json(
    { error: "Student has not paid yet" },
    { status: 400 }
  );
}

/* Reuse room if already started */
if (booking.meetingRoom) {
  return NextResponse.json({ room: booking.meetingRoom });
}

const room = `TutorSewa-${randomUUID().slice(0, 8)}`;

await prisma.booking.update({
  where: { id: booking.id },
  data: {
    meetingRoom: room,
    sessionStarted: true,
    status: BookingStatus.READY,
    startedAt: now,
  },
});

return NextResponse.json({ room });


  } catch (err) {
    console.error("START SESSION ERROR:", err);
    return NextResponse.json(
      { error: "Failed to start session" },
      { status: 500 }
    );
  }
}
