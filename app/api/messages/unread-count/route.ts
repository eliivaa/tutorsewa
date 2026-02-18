import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth/getCurrentUserId";
import { getTutorId } from "@/lib/auth/getTutorId";

export async function GET() {
  const userId = await getCurrentUserId();
  const tutorId = getTutorId();

  if (!userId && !tutorId) {
    return NextResponse.json({ count: 0 });
  }

  const count = await prisma.message.count({
    where: {
      isRead: false,
      AND: [
        // message not sent by me
        userId
          ? { NOT: { senderUserId: userId } }
          : { NOT: { senderTutorId: tutorId } },

        // conversation where I participate
        {
          conversation: userId
            ? {
                OR: [
                  { studentId: userId },
                  { thriftUserId: userId },
                ],
              }
            : {
                tutorId: tutorId!,
              },
        },
      ],
    },
  });

  return NextResponse.json({ count });
}
