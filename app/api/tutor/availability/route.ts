import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

/* ======================
   HELPERS
====================== */

function isValidTime(t: string) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(t);
}

function getTutorId(req: NextRequest) {
  const token = req.cookies.get("tutor_token")?.value;
  if (!token) return null;

  try {
    return (jwt.verify(token, process.env.JWT_SECRET!) as { id: string }).id;
  } catch {
    return null;
  }
}

function addMinutes(time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number);

  const date = new Date();
  date.setHours(h, m, 0, 0);
  date.setMinutes(date.getMinutes() + minutes);

  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");

  return `${hh}:${mm}`;
}

/* ======================
   GET AVAILABILITY
====================== */
export async function GET(req: NextRequest) {
  const tutorId = getTutorId(req);

  if (!tutorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const slots = await prisma.tutorAvailability.findMany({
    where: {
      tutorId,
      isActive: true,
      date: {
        gte: today,
      },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  const filteredSlots = slots.filter((slot) => {
    // ❌ full group slots
    if (
      slot.sessionType === "GROUP" &&
      slot.maxStudents &&
      slot.currentCount >= slot.maxStudents
    ) {
      return false;
    }

    // ✅ future dates
    if (slot.date > today) return true;

    // ✅ today → check end time
    const [h, m] = slot.endTime.split(":").map(Number);

    const slotEnd = new Date(slot.date);
    slotEnd.setHours(h, m, 0, 0);

    return slotEnd > now;
  });

  return NextResponse.json({ slots: filteredSlots });
}

/* ======================
   CREATE AVAILABILITY
====================== */
export async function POST(req: NextRequest) {
  const tutorId = getTutorId(req);

  if (!tutorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    subject,
    level,
    date,
    startTime,
    durationMin,
    sessionType,
    maxStudents,
  } = await req.json();

  /* ========= VALIDATION ========= */

  if (!subject) {
    return NextResponse.json({ error: "Subject required" }, { status: 400 });
  }

  if (!date || isNaN(Date.parse(date))) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  if (!isValidTime(startTime)) {
    return NextResponse.json({ error: "Invalid start time" }, { status: 400 });
  }

  if (!durationMin || durationMin <= 0) {
    return NextResponse.json({ error: "Invalid duration" }, { status: 400 });
  }

  /* ========= AUTO CALCULATE ========= */

  const endTime = addMinutes(startTime, durationMin);

  /* ========= OVERLAP CHECK ========= */

  const overlapping = await prisma.tutorAvailability.findFirst({
    where: {
      tutorId,
      date: new Date(date),
      isActive: true,
      OR: [
        {
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
      ],
    },
  });

  if (overlapping) {
    return NextResponse.json(
      { error: "Time slot overlaps with existing availability" },
      { status: 400 }
    );
  }

  /* ========= CREATE ========= */

  const slot = await prisma.tutorAvailability.create({
    data: {
      tutorId,
      subject,
      level: level || null,
      date: new Date(date),
      startTime,
      endTime, // ✅ always calculated
      durationMin,
      sessionType,
      maxStudents: sessionType === "GROUP" ? maxStudents : null,
      isActive: true,
    },
  });

  return NextResponse.json({ slot }, { status: 201 });
}

/* ======================
   DELETE AVAILABILITY
====================== */
export async function DELETE(req: NextRequest) {
  const tutorId = getTutorId(req);

  if (!tutorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Availability ID required" },
      { status: 400 }
    );
  }

  const slot = await prisma.tutorAvailability.findFirst({
    where: {
      id,
      tutorId,
    },
  });

  if (!slot) {
    return NextResponse.json(
      { error: "Availability not found" },
      { status: 404 }
    );
  }

  await prisma.tutorAvailability.update({
    where: { id },
    data: { isActive: false },
  });

  return NextResponse.json({ success: true });
}