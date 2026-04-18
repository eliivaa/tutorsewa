import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AvailabilityType } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tutorId = params.id;
    const { searchParams } = new URL(req.url);

    const sessionType = searchParams.get("sessionType");
    const subject = searchParams.get("subject"); // OPTIONAL
    const level = searchParams.get("level");     // OPTIONAL
    const dateParam = searchParams.get("date");  // OPTIONAL

    if (!tutorId) {
      return NextResponse.json(
        { error: "Tutor ID required" },
        { status: 400 }
      );
    }

  const where: any = {
  tutorId,
  isActive: true,
  OR: [
    { maxStudents: null }, // 1-to-1
    {
      AND: [
        { maxStudents: { not: null } },
        { currentCount: { lt: prisma.tutorAvailability.fields.maxStudents } }
      ]
    }
  ]
};

    // ✅ Filter only if provided
    if (subject) where.subject = subject;
    if (level) where.level = level;
    if (sessionType) {
      where.sessionType = sessionType as AvailabilityType;
    }

    if (dateParam) {
      const date = new Date(dateParam);
      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format" },
          { status: 400 }
        );
      }

      where.date = { equals: date };
    }

    const slots = await prisma.tutorAvailability.findMany({
      where,
      orderBy: [
        { date: "asc" },
        { startTime: "asc" },
      ],
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
