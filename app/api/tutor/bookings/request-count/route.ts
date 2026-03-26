import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { BookingStatus } from "@prisma/client";

export async function GET() {
  try {
    const token = cookies().get("tutor_token")?.value;

    if (!token) {
      return NextResponse.json({ count: 0 });
    }

    const tutor = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    const count = await prisma.booking.count({
  where: {
    tutorId: tutor.id,
    status: BookingStatus.REQUESTED,
    tutorSeen: false,
  },
});

    return NextResponse.json({ count });
  } catch (err) {
    console.error("REQUEST COUNT ERROR:", err);
    return NextResponse.json({ count: 0 });
  }
}