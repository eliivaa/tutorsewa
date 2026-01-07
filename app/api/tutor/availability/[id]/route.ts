// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { AvailabilityType } from "@prisma/client";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const tutorId = params.id;
//     const { searchParams } = new URL(req.url);

//     const sessionType = searchParams.get("sessionType");
//     const subject = searchParams.get("subject"); // OPTIONAL
//     const level = searchParams.get("level");     // OPTIONAL
//     const dateParam = searchParams.get("date");  // OPTIONAL

//     if (!tutorId) {
//       return NextResponse.json(
//         { error: "Tutor ID required" },
//         { status: 400 }
//       );
//     }

//     const where: any = {
//       tutorId,
//       isActive: true,
//     };

//     // ✅ Filter only if provided
//     if (subject) where.subject = subject;
//     if (level) where.level = level;
//     if (sessionType) {
//       where.sessionType = sessionType as AvailabilityType;
//     }

//     if (dateParam) {
//       const date = new Date(dateParam);
//       if (isNaN(date.getTime())) {
//         return NextResponse.json(
//           { error: "Invalid date format" },
//           { status: 400 }
//         );
//       }

//       where.date = { equals: date };
//     }

//     const slots = await prisma.tutorAvailability.findMany({
//       where,
//       orderBy: [
//         { date: "asc" },
//         { startTime: "asc" },
//       ],
//     });

//     return NextResponse.json({ slots });
//   } catch (err) {
//     console.error("STUDENT AVAILABILITY ERROR:", err);
//     return NextResponse.json(
//       { error: "Failed to load availability" },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { AvailabilityType } from "@prisma/client";

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

/* ======================
   GET AVAILABILITY
====================== */
export async function GET(req: NextRequest) {
  const tutorId = getTutorId(req);
  if (!tutorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slots = await prisma.tutorAvailability.findMany({
    where: {
      tutorId,
      isActive: true, // ✅ students won't see deleted ones
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  return NextResponse.json({ slots });
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
    endTime,
    durationMin,
    sessionType,
    maxStudents,
  } = await req.json();

  if (!subject) {
    return NextResponse.json({ error: "Subject required" }, { status: 400 });
  }

  if (!date || isNaN(Date.parse(date))) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  if (!isValidTime(startTime) || !isValidTime(endTime)) {
    return NextResponse.json({ error: "Invalid time" }, { status: 400 });
  }

  const slot = await prisma.tutorAvailability.create({
    data: {
      tutorId,
      subject,
      level: level || null,
      date: new Date(date),
      startTime,
      endTime,
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

  // Ensure tutor owns this availability
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

  // 🔒 Soft delete
  await prisma.tutorAvailability.update({
    where: { id },
    data: { isActive: false },
  });

  return NextResponse.json({ success: true });
}
