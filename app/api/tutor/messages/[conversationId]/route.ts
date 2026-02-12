import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTutorId } from "@/lib/auth/getTutorId";

export async function GET(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  const tutorId = await getTutorId();
  if (!tutorId)
    return NextResponse.json({ messages: [] }, { status: 401 });

  const convo = await prisma.conversation.findUnique({
    where: { id: params.conversationId },
    select: { id: true, tutorId: true },
  });

  if (!convo || convo.tutorId !== tutorId) {
    return NextResponse.json({ messages: [] }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId: convo.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ messages });
}
