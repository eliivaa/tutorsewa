// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getStudentId } from "@/lib/auth/getStudentId";

// export async function POST(_: Request, { params }: { params: { bookingId: string } }) {
//   const studentId = await getStudentId();
//   if (!studentId) return NextResponse.json({ ok: false }, { status: 401 });

//   const convo = await prisma.conversation.findUnique({
//     where: { bookingId: params.bookingId },
//     select: { id: true, booking: { select: { studentId: true } } },
//   });

//   if (!convo || convo.booking.studentId !== studentId) {
//     return NextResponse.json({ ok: false }, { status: 403 });
//   }

//   await prisma.message.updateMany({
//     where: {
//       conversationId: convo.id,
//       isRead: false,
//       NOT: { senderUserId: studentId },
//     },
//     data: { isRead: true },
//   });

//   return NextResponse.json({ ok: true });
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentId } from "@/lib/auth/getStudentId";

export async function POST(
  _: Request,
  { params }: { params: { conversationId: string } }
) {
  const studentId = await getStudentId();
  if (!studentId) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: params.conversationId },
  });

  if (!conversation || conversation.studentId !== studentId) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  await prisma.message.updateMany({
    where: {
      conversationId: conversation.id,
      isRead: false,
      NOT: { senderUserId: studentId },
    },
    data: { isRead: true },
  });

  return NextResponse.json({ ok: true });
}
