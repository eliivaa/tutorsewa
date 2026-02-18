// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getStudentId } from "@/lib/auth/getStudentId";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { conversationId: string } }
// ) {
//   const studentId = await getStudentId();
//   if (!studentId) {
//     return NextResponse.json({ messages: [] });
//   }

//   const conversation = await prisma.conversation.findUnique({
//     where: { id: params.conversationId },
//   });

//   if (!conversation || conversation.studentId !== studentId) {
//     return NextResponse.json({ messages: [] }, { status: 403 });
//   }

//   const messages = await prisma.message.findMany({
//     where: { conversationId: conversation.id },
//     orderBy: { createdAt: "asc" },
//   });

//   return NextResponse.json({
//     messages,
//     conversationId: conversation.id,
//   });
// }


// after thrift

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId} from "@/lib/auth/getCurrentUserId";

export async function GET(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ messages: [] });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: params.conversationId },
  });

  // ⭐ allow BOTH student and seller to read
  const isParticipant =
    conversation &&
    (conversation.studentId === userId ||
      conversation.thriftUserId === userId);

  if (!isParticipant) {
    return NextResponse.json({ messages: [] }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    messages,
    conversationId: conversation.id,
  });
}
