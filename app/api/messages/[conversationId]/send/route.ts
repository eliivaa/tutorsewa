// // overdue

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getCurrentUserId } from "@/lib/auth/getCurrentUserId";

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { conversationId: string } }
// ) {
//   try {
//     const studentId = await getCurrentUserId();

//     if (!studentId) {
//       return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
//     }

//     const { content } = await req.json();

//     if (!content?.trim()) {
//       return NextResponse.json({ error: "EMPTY_MESSAGE" }, { status: 400 });
//     }

//     // 🔎 Find conversation
//     const conversation = await prisma.conversation.findUnique({
//       where: { id: params.conversationId },
//     });

//     const isParticipant =
//       conversation &&
//       (
//         conversation.studentId === studentId ||
//         conversation.thriftUserId === studentId ||
//         conversation.tutorId === studentId
//       );

//     if (!isParticipant) {
//       return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
//     }

//     // ============================================================
//     // 🧠 TUTOR CHAT LOGIC
//     // ============================================================
//     if (conversation.type === "TUTOR_SESSION") {

//       const senderIsStudent = conversation.studentId === studentId;

//       if (senderIsStudent) {

//         const now = new Date();

//         // ============================================================
//         // 🚨 1. BLOCK IF ANY OVERDUE PAYMENT EXISTS
//         // ============================================================
//         const overdueBooking = await prisma.booking.findFirst({
//           where: {
//             studentId: conversation.studentId,
//             tutorId: conversation.tutorId!,
//             status: {
//   in: ["COMPLETED", "EXPIRED"],
// },
//             paymentStatus: "PARTIALLY_PAID",
//             paymentDueAt: {
//               not: null,
//               lt: now,
//             },
//           },
//         });

//         if (overdueBooking) {
//           return NextResponse.json(
//             {
//               error: "PAYMENT_OVERDUE",
//               message:
//                 "You have unpaid dues. Please complete your payment to continue chatting.",
//             },
//             { status: 403 }
//           );
//         }

//         // ============================================================
//         // 🔍 2. CHECK VALID BOOKING EXISTS
//         // ============================================================
//         const validBooking = await prisma.booking.findFirst({
//           where: {
//             studentId: conversation.studentId,
//             tutorId: conversation.tutorId!,
//             status: {
//               in: [
//                 "PAYMENT_PENDING",
//                 "READY",
//                 "COMPLETED",
//                 "EXPIRED",
//               ],
//             },
//             paymentStatus: {
//               in: ["PARTIALLY_PAID", "FULLY_PAID"],
//             },
//           },
//         });

//         if (!validBooking) {
//           return NextResponse.json(
//             { error: "CHAT_LOCKED_UNTIL_TUTOR_ACCEPTS_BOOKING" },
//             { status: 403 }
//           );
//         }
//       }
//     }

//     // ============================================================
//     // 💬 Create Message
//     // ============================================================
//     const msg = await prisma.message.create({
//       data: {
//         conversationId: conversation.id,
//         senderUserId: studentId,
//         content,
//         isRead: false,
//       },
//     });

//     // ============================================================
//     // 🔔 Notify Tutor
//     // ============================================================
//     if (conversation.type === "TUTOR_SESSION" && conversation.tutorId) {
//       await prisma.notification.create({
//         data: {
//           tutorId: conversation.tutorId,
//           title: "New Message",
//           message: "You received a new message.",
//           type: "MESSAGE_RECEIVED",
//           actionUrl: "/tutor/messages",
//         },
//       });
//     }

//     return NextResponse.json({ message: msg });

//   } catch (err) {
//     console.error("SEND MESSAGE ERROR:", err);

//     return NextResponse.json(
//       { error: "SERVER_ERROR" },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth/getCurrentUserId";

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

    // ================= FIND CONVERSATION =================
    const conversation = await prisma.conversation.findUnique({
      where: { id: params.conversationId },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const isParticipant =
      conversation.studentId === studentId ||
      conversation.thriftUserId === studentId ||
      conversation.tutorId === studentId;

    if (!isParticipant) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    // ============================================================
    // 🧠 TUTOR CHAT RULES (FINAL CORRECT LOGIC)
    // ============================================================
    if (conversation.type === "TUTOR_SESSION") {
      const senderIsStudent = conversation.studentId === studentId;

      if (senderIsStudent) {
        const now = new Date();

        // ============================================================
        // 🚨 1. BLOCK ONLY IF OVERDUE PAYMENT EXISTS
        // ============================================================
        const overdueBooking = await prisma.booking.findFirst({
          where: {
            studentId: studentId,
            tutorId: conversation.tutorId!,
            status: {
              in: ["COMPLETED", "EXPIRED"],
            },
            paymentStatus: "PARTIALLY_PAID",
            paymentDueAt: {
              not: null,
              lt: now,
            },
          },
        });

        if (overdueBooking) {
          return NextResponse.json(
            {
              error: "PAYMENT_OVERDUE",
              message:
                "You have unpaid dues. Please complete your payment to continue chatting.",
            },
            { status: 403 }
          );
        }

        // ============================================================
        // ✅ 2. ALLOW IF ANY ACCEPTED / HISTORY BOOKING EXISTS
        // ============================================================
        const validBooking = await prisma.booking.findFirst({
          where: {
            studentId: studentId,
            tutorId: conversation.tutorId!,

            // 🔥 KEY FIX: allow ANY booking except rejected
            status: {
              notIn: ["REJECTED"],
            },
          },
        });

        if (!validBooking) {
          return NextResponse.json(
            { error: "CHAT_LOCKED_UNTIL_TUTOR_ACCEPTS_BOOKING" },
            { status: 403 }
          );
        }
      }
    }

    // ============================================================
    // 💬 CREATE MESSAGE
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
    // 🔔 NOTIFY TUTOR
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

    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}