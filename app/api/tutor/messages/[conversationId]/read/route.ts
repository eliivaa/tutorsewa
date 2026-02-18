import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTutorId } from "@/lib/auth/getTutorId";

export async function POST(
  _: Request,
  { params }: { params: { conversationId: string } }
) {
  const tutorId = await getTutorId();
  if (!tutorId)
    return NextResponse.json({ ok: false }, { status: 401 });

  const convo = await prisma.conversation.findUnique({
    where: { id: params.conversationId },
    select: { id: true, tutorId: true },
  });

  if (!convo || convo.tutorId !== tutorId)
    return NextResponse.json({ ok: false }, { status: 403 });

  // ⭐ ONLY mark student messages as read
  await prisma.message.updateMany({
    where: {
      conversationId: convo.id,
      isRead: false,
      senderTutorId: null, // message sent by student
    },
    data: { isRead: true },
  });

  return NextResponse.json({ ok: true });
}
