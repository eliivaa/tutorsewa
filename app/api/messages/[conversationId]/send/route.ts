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
import { getStudentId } from "@/lib/auth/getStudentId";

export async function POST(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const studentId = await getStudentId();

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

    if (!conversation || conversation.studentId !== studentId) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    // ============================================================
    // 🧠 TUTOR CHAT → restrict messaging until booking accepted
    // ============================================================
    if (conversation.type === "TUTOR_SESSION") {

      if (!conversation.tutorId) {
        return NextResponse.json(
          { error: "INVALID_TUTOR_CONVERSATION" },
          { status: 400 }
        );
      }

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
