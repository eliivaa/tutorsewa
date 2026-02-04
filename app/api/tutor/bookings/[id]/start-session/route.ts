import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { BookingStatus } from "@prisma/client";
import { randomUUID } from "crypto";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = cookies().get("tutor_token")?.value;

  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tutor = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
  });

  if (!booking || booking.tutorId !== tutor.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const room = `TutorSewa-${randomUUID().slice(0, 8)}`;

  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      meetingRoom: room,
      sessionStarted: true,
      status: BookingStatus.READY,
      startedAt: new Date(),
    },
  });

  return NextResponse.json({ room });
}
