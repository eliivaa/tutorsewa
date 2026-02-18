// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getStudentId } from "@/lib/auth/getStudentId";

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { conversationId: string } }
// ) {
//   const studentId = await getStudentId();
//   if (!studentId) {
//     return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
//   }

//   const { content } = await req.json();
//   if (!content?.trim()) {
//     return NextResponse.json({ error: "EMPTY" }, { status: 400 });
//   }

//   const conversation = await prisma.conversation.findUnique({
//     where: { id: params.conversationId },
//   });

//   if (!conversation || conversation.studentId !== studentId) {
//     return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
//   }

//   // 🔥 Optional: Restrict messaging only if student has accepted booking
//   const pastAcceptedBooking = await prisma.booking.findFirst({
//     where: {
//       studentId,
//       tutorId: conversation.tutorId,
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
//       conversationId: conversation.id,
//       senderUserId: studentId,
//       content,
//       isRead: false,
//     },
//   });

//   // 🔔 Notify tutor
//   await prisma.notification.create({
//     data: {
//       tutorId: conversation.tutorId,
//       title: "New Message",
//       message: "You received a new message.",
//       type: "MESSAGE_RECEIVED",
//       actionUrl: "/tutor/messages",
//     },
//   });

//   return NextResponse.json({ message: msg });
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId} from "@/lib/auth/getCurrentUserId";

export async function POST(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const studentId = await getCurrentUserId();

    if (!studentId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const { content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: "EMPTY_MESSAGE" }, { status: 400 });
    }

    // 🔎 Find conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: params.conversationId },
    });

    const isParticipant =
  conversation &&
  (
    conversation.studentId === studentId ||
    conversation.thriftUserId === studentId ||
    conversation.tutorId === studentId
  );

if (!isParticipant) {
  return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
}

// ============================================================
// 🧠 TUTOR CHAT → restrict ONLY when student messages tutor
// ============================================================
if (conversation.type === "TUTOR_SESSION") {

  // Only restrict if SENDER is the student of this conversation
  const senderIsStudent = conversation.studentId === studentId;

  if (senderIsStudent) {

    const pastAcceptedBooking = await prisma.booking.findFirst({
      where: {
        studentId: conversation.studentId,   // 👈 IMPORTANT FIX
        tutorId: conversation.tutorId!,
        status: {
          in: [
            "PAYMENT_PENDING",
            "PARTIALLY_PAID",
            "FULLY_PAID",
            "CONFIRMED",
            "READY",
            "COMPLETED",
            "EXPIRED",
          ],
        },
      },
    });

    if (!pastAcceptedBooking) {
      return NextResponse.json(
        { error: "CHAT_LOCKED_UNTIL_TUTOR_ACCEPTS_BOOKING" },
        { status: 403 }
      );
    }
  }
}


    // ============================================================
    // 💬 Create Message (works for BOTH tutor & thrift)
    // ============================================================
    const msg = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderUserId: studentId,
        content,
        isRead: false,
      },
    });

    // ============================================================
    // 🔔 Notify Tutor ONLY for tutor chats
    // ============================================================
    if (conversation.type === "TUTOR_SESSION" && conversation.tutorId) {
      await prisma.notification.create({
        data: {
          tutorId: conversation.tutorId,
          title: "New Message",
          message: "You received a new message.",
          type: "MESSAGE_RECEIVED",
          actionUrl: "/tutor/messages",
        },
      });
    }

    return NextResponse.json({ message: msg });

  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
