import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTutorId } from "@/lib/auth/getTutorId";

export async function GET() {
  try {
    const tutorId = await getTutorId(); // ✅ MUST await
    if (!tutorId) {
      return NextResponse.json({ count: 0 }, { status: 401 });
    }

    const count = await prisma.message.count({
      where: {
        isRead: false,
        conversation: {
          tutorId, // ✅ direct relation now
        },
        NOT: { senderTutorId: tutorId },
      },
    });

    return NextResponse.json({ count });

  } catch (error) {
    console.error("Tutor unread count error:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
