import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTutorId } from "@/lib/auth/getTutorId";

export async function GET() {
  const tutorId = await getTutorId();
  if (!tutorId) return NextResponse.json({ count: 0 });

  const count = await prisma.message.count({
    where: {
      isRead: false,
      conversation: { tutorId },
      senderTutorId: null, // only student messages
    },
  });

  return NextResponse.json({ count });
}
