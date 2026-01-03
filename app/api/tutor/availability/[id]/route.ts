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

//     if (!tutorId) {
//       return NextResponse.json({ error: "Tutor ID required" }, { status: 400 });
//     }

//     const where: any = {
//       tutorId,
//       isActive: true,
//     };

//     if (sessionType) {
//       where.sessionType = sessionType as AvailabilityType;
//     }

//     const slots = await prisma.tutorAvailability.findMany({
//       where,
//       orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
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
import { SessionType } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tutorId = params.id;
    const { searchParams } = new URL(req.url);
    const sessionType = searchParams.get("sessionType");

    if (!tutorId) {
      return NextResponse.json(
        { error: "Tutor ID required" },
        { status: 400 }
      );
    }

    const where: any = {
      tutorId,
      isActive: true,
    };

    if (sessionType) {
      where.sessionType = sessionType as SessionType;
    }

    const slots = await prisma.tutorAvailability.findMany({
      where,
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json({ slots });
  } catch (err) {
    console.error("STUDENT AVAILABILITY ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load availability" },
      { status: 500 }
    );
  }
}
