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

  if (!convo || convo.tutorId !== tutorId) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  await prisma.message.updateMany({
    where: {
      conversationId: convo.id,
      isRead: false,
      NOT: { senderTutorId: tutorId },
    },
    data: { isRead: true },
  });

  return NextResponse.json({ ok: true });
}
