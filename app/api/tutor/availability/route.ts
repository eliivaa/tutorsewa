// import { prisma } from "@/lib/prisma"; 
// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// function getTutorId(req: NextRequest): string | null {
//   const token = req.cookies.get("tutor_token")?.value;
//   if (!token) return null;

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
//     return decoded.id;
//   } catch {
//     return null;
//   }
// }

// /* =======================
//    GET AVAILABILITY
// ======================= */
// export async function GET(req: NextRequest) {
//   try {
//     const tutorId = getTutorId(req);
//     if (!tutorId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const slots = await prisma.tutorAvailability.findMany({
//       where: { tutorId },
//       orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
//     });

//     return NextResponse.json(slots);
//   } catch (error) {
//     console.error("GET AVAILABILITY ERROR:", error);
//     return NextResponse.json(
//       { error: "Failed to load availability" },
//       { status: 500 }
//     );
//   }
// }

// /* =======================
//    CREATE AVAILABILITY
// ======================= */
// export async function POST(req: NextRequest) {
//   try {
//     const tutorId = getTutorId(req);
//     if (!tutorId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { dayOfWeek, startTime, endTime, durationMin } = await req.json();

//     if (!dayOfWeek || !startTime || !endTime || !durationMin) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const slot = await prisma.tutorAvailability.create({
//       data: {
//         tutorId,
//         dayOfWeek,     // must be ENUM string e.g. "MONDAY"
//         startTime,     // "09:00"
//         endTime,       // "12:00"
//         durationMin,   // 60
//       },
//     });

//     return NextResponse.json(slot);
//   } catch (error) {
//     console.error("CREATE AVAILABILITY ERROR:", error);
//     return NextResponse.json(
//       { error: "Failed to create availability" },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { DayOfWeek, AvailabilityType } from "@prisma/client";

function isValidTime(t: string) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(t);
}

function parseDayOfWeek(value: unknown): DayOfWeek | null {
  if (typeof value !== "string") return null;
  const upper = value.toUpperCase();
  return Object.values(DayOfWeek).includes(upper as DayOfWeek)
    ? (upper as DayOfWeek)
    : null;
}

function getTutorIdFromCookie(req: NextRequest) {
  const token = req.cookies.get("tutor_token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    return decoded.id;
  } catch {
    return null;
  }
}

/* =========================
   GET AVAILABILITY
========================= */
export async function GET(req: NextRequest) {
  try {
    const tutorId = getTutorIdFromCookie(req);
    if (!tutorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const slots = await prisma.tutorAvailability.findMany({
      where: { tutorId, isActive: true },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json({ slots });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load availability" }, { status: 500 });
  }
}

/* =========================
   CREATE AVAILABILITY
========================= */
export async function POST(req: NextRequest) {
  try {
    const tutorId = getTutorIdFromCookie(req);
    if (!tutorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const dayOfWeek = parseDayOfWeek(body.dayOfWeek);
    const { startTime, endTime, durationMin, sessionType, maxStudents } = body;

    if (!dayOfWeek) {
      return NextResponse.json({ error: "Invalid dayOfWeek" }, { status: 400 });
    }

    if (!isValidTime(startTime) || !isValidTime(endTime)) {
      return NextResponse.json({ error: "Time must be in HH:MM format" }, { status: 400 });
    }

    if (![30, 60, 90].includes(durationMin)) {
      return NextResponse.json({ error: "Invalid duration" }, { status: 400 });
    }

    if (![AvailabilityType.ONE_TO_ONE, AvailabilityType.GROUP].includes(sessionType)) {
      return NextResponse.json({ error: "Invalid sessionType" }, { status: 400 });
    }

    if (sessionType === "GROUP" && (!maxStudents || maxStudents < 6)) {
      return NextResponse.json(
        { error: "Group session must allow at least 5 students" },
        { status: 400 }
      );
    }

    const created = await prisma.tutorAvailability.create({
      data: {
        tutorId,
        dayOfWeek,
        startTime,
        endTime,
        durationMin,
        sessionType,
        maxStudents: sessionType === "GROUP" ? maxStudents : null,
        isActive: true,
      },
    });

    return NextResponse.json({ slot: created }, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json(
        { error: "This availability slot already exists" },
        { status: 409 }
      );
    }

    console.error(err);
    return NextResponse.json({ error: "Failed to add availability" }, { status: 500 });
  }
}
