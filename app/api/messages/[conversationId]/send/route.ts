// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getStudentId } from "@/lib/auth/getStudentId";

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { bookingId: string } }
// ) {
//   const studentId = await getStudentId();
//   if (!studentId)
//     return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

//   const { content } = await req.json();
//   if (!content?.trim())
//     return NextResponse.json({ error: "EMPTY" }, { status: 400 });

//   const convo = await prisma.conversation.findUnique({
//     where: { bookingId: params.bookingId },
//     select: {
//       id: true,
//       booking: {
//         select: {
//           studentId: true,
//           tutorId: true,
//         },
//       },
//     },
//   });

//   if (!convo || convo.booking.studentId !== studentId) {
//     return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
//   }

//   // ✅ NEW LOGIC: Check if student ever had accepted session with this tutor
//   const pastAcceptedBooking = await prisma.booking.findFirst({
//     where: {
//       studentId,
//       tutorId: convo.booking.tutorId,
//       status: {
//         in: [
//           "CONFIRMED",
//           "READY",
//           "COMPLETED",
//           "PARTIALLY_PAID",
//           "FULLY_PAID",
//         ],
//       },
//     },
//   });

//   if (!pastAcceptedBooking) {
//     return NextResponse.json(
//       { error: "MESSAGING_NOT_ALLOWED" },
//       { status: 403 }
//     );
//   }

//   const msg = await prisma.message.create({
//     data: {
//       conversationId: convo.id,
//       senderUserId: studentId,
//       content,
//       isRead: false,
//     },
//   });

//   // Optional notification for tutor
//   await prisma.notification.create({
//     data: {
//       tutorId: convo.booking.tutorId,
//       title: "New Message",
//       message: "You received a new message.",
//       type: "MESSAGE_RECEIVED",
//       bookingId: params.bookingId,
//       actionUrl: "/tutor/messages",
//     },
//   });

//   return NextResponse.json({ message: msg });
// }


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentId } from "@/lib/auth/getStudentId";

export async function POST(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  const studentId = await getStudentId();
  if (!studentId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { content } = await req.json();
  if (!content?.trim()) {
    return NextResponse.json({ error: "EMPTY" }, { status: 400 });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: params.conversationId },
  });

  if (!conversation || conversation.studentId !== studentId) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  // 🔥 Optional: Restrict messaging only if student has accepted booking
  const pastAcceptedBooking = await prisma.booking.findFirst({
    where: {
      studentId,
      tutorId: conversation.tutorId,
      status: {
        in: [
          "CONFIRMED",
          "READY",
          "COMPLETED",
          "PARTIALLY_PAID",
          "FULLY_PAID",
        ],
      },
    },
  });

  if (!pastAcceptedBooking) {
    return NextResponse.json(
      { error: "MESSAGING_NOT_ALLOWED" },
      { status: 403 }
    );
  }

  const msg = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderUserId: studentId,
      content,
      isRead: false,
    },
  });

  // 🔔 Notify tutor
  await prisma.notification.create({
    data: {
      tutorId: conversation.tutorId,
      title: "New Message",
      message: "You received a new message.",
      type: "MESSAGE_RECEIVED",
      actionUrl: "/tutor/messages",
    },
  });

  return NextResponse.json({ message: msg });
}
