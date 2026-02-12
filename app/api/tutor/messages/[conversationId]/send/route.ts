// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getTutorId } from "@/lib/auth/getTutorId";

// const PERMA_ALLOWED = [
//   "PAYMENT_PENDING",
//   "PARTIALLY_PAID",
//   "FULLY_PAID",
//   "CONFIRMED",
//   "READY",
//   "COMPLETED",
//   "EXPIRED",
// ] as const;

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { bookingId: string } }
// ) {
//   const tutorId = getTutorId();
//   if (!tutorId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

//   const { content } = await req.json();
//   if (!content?.trim()) return NextResponse.json({ error: "EMPTY" }, { status: 400 });

//   const convo = await prisma.conversation.findUnique({
//     where: { bookingId: params.bookingId },
//     select: { id: true, booking: { select: { tutorId: true, studentId: true } } },
//   });

//   if (!convo || convo.booking.tutorId !== tutorId) {
//     return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
//   }

//   // ✅ Permanent unlock rule (ANY accepted session in past)
//   const hasAnyAccepted = await prisma.booking.findFirst({
//     where: {
//       tutorId,
//       studentId: convo.booking.studentId,
//       status: { in: PERMA_ALLOWED as any },
//     },
//     select: { id: true },
//   });

//   if (!hasAnyAccepted) {
//     return NextResponse.json({ error: "MESSAGING_NOT_ALLOWED" }, { status: 403 });
//   }

//   const msg = await prisma.message.create({
//     data: {
//       conversationId: convo.id,
//       senderTutorId: tutorId,
//       content,
//       isRead: false,
//     },
//   });

//   return NextResponse.json({ message: msg });
// }



import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTutorId } from "@/lib/auth/getTutorId";

export async function POST(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  const tutorId = await getTutorId();
  if (!tutorId)
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const { content } = await req.json();
  if (!content?.trim())
    return NextResponse.json({ error: "EMPTY" }, { status: 400 });

  const convo = await prisma.conversation.findUnique({
    where: { id: params.conversationId },
    select: { id: true, tutorId: true },
  });

  if (!convo || convo.tutorId !== tutorId) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const msg = await prisma.message.create({
    data: {
      conversationId: convo.id,
      senderTutorId: tutorId,
      content,
      isRead: false,
    },
  });

  return NextResponse.json({ message: msg });
}
