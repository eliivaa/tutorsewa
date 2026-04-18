

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth/getCurrentUserId";
import { getTutorId } from "@/lib/auth/getTutorId";

export async function POST(
  _: Request,
  { params }: { params: { conversationId: string } }
) {
  const userId = await getCurrentUserId();
  const tutorId = getTutorId();

  if (!userId && !tutorId) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: params.conversationId },
  });

  if (!conversation) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  // allow ANY participant (buyer / seller / tutor)
  const isParticipant =
    (userId &&
      (conversation.studentId === userId ||
        conversation.thriftUserId === userId)) ||
    (tutorId && conversation.tutorId === tutorId);

  if (!isParticipant) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  // mark messages from OTHER PERSON as read
// await prisma.message.updateMany({
//   where: {
//     conversationId: conversation.id,
//     isRead: false,

//     // ✅ FIXED LOGIC
//     ...(userId
//       ? { senderUserId: null } // messages from tutor
//       : { senderTutorId: null }), // messages from student
//   },
//   data: {
//     isRead: true,
//   },
// });

await prisma.message.updateMany({
  where: {
    conversationId: conversation.id,
    isRead: false,

    // 🔥 universal rule
    ...(userId
      ? {
          NOT: {
            senderUserId: userId,
          },
        }
      : {
          NOT: {
            senderTutorId: tutorId,
          },
        }),
  },
  data: {
    isRead: true,
  },
});

  return NextResponse.json({ ok: true });
}
