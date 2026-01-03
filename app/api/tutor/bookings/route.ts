import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("tutor_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    const bookings = await prisma.booking.findMany({
      where: { tutorId: decoded.id },
      include: {
        student: {
          select: { name: true, email: true ,image: true},
        },
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json({ bookings });
  } catch (err) {
    console.error("TUTOR BOOKINGS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load tutor bookings" },
      { status: 500 }
    );
  }
}
