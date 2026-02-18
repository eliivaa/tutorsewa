import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId} from "@/lib/auth/getCurrentUserId";

const ALLOWED_STATUSES = [
  "PAYMENT_PENDING",
  "PARTIALLY_PAID",
  "FULLY_PAID",
  "CONFIRMED",
  "READY",
  "COMPLETED",
  "EXPIRED",
] as const;

export async function GET(req: NextRequest) {
  const studentId = await getCurrentUserId();
  if (!studentId) return NextResponse.json({ canChat: false });

  const tutorId = new URL(req.url).searchParams.get("tutorId");
  if (!tutorId) return NextResponse.json({ canChat: false });

  const pastAcceptedBooking = await prisma.booking.findFirst({
    where: {
      studentId,
      tutorId,
      status: { in: ALLOWED_STATUSES as any },
    },
    select: { id: true },
  });

  return NextResponse.json({
    canChat: !!pastAcceptedBooking,
  });
}
