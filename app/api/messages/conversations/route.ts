// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getStudentId } from "@/lib/auth/getStudentId";

// export async function GET() {
//   const studentId = await getStudentId();
//   if (!studentId) return NextResponse.json({ conversations: [] });

//   const convos = await prisma.conversation.findMany({
//     where: {
//       booking: {
//         studentId,
//       },
//     },
//     orderBy: { createdAt: "desc" },
//     select: {
//       id: true,
//       bookingId: true,
//       booking: {
//         select: {
//           tutorId: true,
//           status: true,
//           startTime: true,
//           tutor: { select: { name: true, photo: true } },
//         },
//       },
//       messages: {
//         take: 1,
//         orderBy: { createdAt: "desc" },
//         select: { content: true, createdAt: true },
//       },
//     },
//   });

//   const conversations = await Promise.all(
//     convos.map(async (c) => {

//       // ✅ CHECK ANY accepted booking with this tutor
//       const pastAcceptedBooking = await prisma.booking.findFirst({
//   where: {
//     studentId,
//     tutorId: c.booking.tutorId,
//     status: {
//       in: [
//         "PAYMENT_PENDING",
//         "PARTIALLY_PAID",
//         "FULLY_PAID",
//         "CONFIRMED",
//         "READY",
//         "COMPLETED",
//         "EXPIRED",
//       ],
//     },
//   },
// });


//       const unread = await prisma.message.count({
//         where: {
//           conversationId: c.id,
//           isRead: false,
//           NOT: { senderUserId: studentId },
//         },
//       });

//       return {
//         ...c,
//         unread,
//         allowed: true
//   // 🔥 THIS IS IMPORTANT
//       };
//     })
//   );

//   return NextResponse.json({ conversations });
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentId } from "@/lib/auth/getStudentId";

export async function GET() {
  const studentId = await getStudentId();
  if (!studentId) {
    return NextResponse.json({ conversations: [] });
  }

  const convos = await prisma.conversation.findMany({
    where: {
      studentId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      tutor: {
        select: {
          id: true,
          name: true,
          photo: true,
        },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const conversations = await Promise.all(
    convos.map(async (c) => {
      const unread = await prisma.message.count({
        where: {
          conversationId: c.id,
          isRead: false,
          NOT: { senderUserId: studentId },
        },
      });

      return {
        id: c.id,
        tutor: c.tutor,
        lastMessage: c.messages[0] || null,
        unread,
        allowed: true,
      };
    })
  );

  return NextResponse.json({ conversations });
}
