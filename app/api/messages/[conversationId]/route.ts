// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getStudentId } from "@/lib/auth/getStudentId";
// import { canMessage } from "@/lib/messaging";

// export async function GET(req: NextRequest, { params }: { params: { bookingId: string } }) {
//   const studentId = await getStudentId();
//   if (!studentId) return NextResponse.json({ messages: [] });

//   const convo = await prisma.conversation.findUnique({
//     where: { bookingId: params.bookingId },
//     select: {
//       id: true,
//       booking: { select: { studentId: true, status: true } },
//     },
//   });

//   if (!convo || convo.booking.studentId !== studentId) {
//     return NextResponse.json({ messages: [] }, { status: 403 });
//   }

//   if (!canMessage(convo.booking.status)) {
//     return NextResponse.json({ error: "MESSAGING_NOT_ALLOWED" }, { status: 403 });
//   }

//   const messages = await prisma.message.findMany({
//     where: { conversationId: convo.id },
//     orderBy: { createdAt: "asc" },
//   });

//   return NextResponse.json({ messages, conversationId: convo.id });
// }



import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentId } from "@/lib/auth/getStudentId";

export async function GET(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  const studentId = await getStudentId();
  if (!studentId) {
    return NextResponse.json({ messages: [] });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: params.conversationId },
  });

  if (!conversation || conversation.studentId !== studentId) {
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
