// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getTutorId } from "@/lib/auth/getTutorId";
// import { canMessage } from "@/lib/messaging";

// export async function GET() {
//   const tutorId = getTutorId();
//   if (!tutorId) return NextResponse.json({ conversations: [] }, { status: 401 });

//   const convos = await prisma.conversation.findMany({
//     where: {
//       booking: { tutorId },
//     },
//     orderBy: { createdAt: "desc" },
//     select: {
//       id: true,
//       bookingId: true,
//       booking: {
//         select: {
//           status: true,
//           startTime: true,
//           student: { select: { name: true, image: true } },
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
//       const unread = await prisma.message.count({
//         where: {
//           conversationId: c.id,
//           isRead: false,
//           NOT: { senderTutorId: tutorId },
//         },
//       });

//       return {
//         ...c,
//         unread,
//         allowed: canMessage(c.booking.status),
//       };
//     })
//   );

//   return NextResponse.json({ conversations });
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTutorId } from "@/lib/auth/getTutorId";

export async function GET() {
  try {
    const tutorId = await getTutorId(); // ✅ MUST await
    if (!tutorId) {
      return NextResponse.json({ conversations: [] }, { status: 401 });
    }

    const convos = await prisma.conversation.findMany({
      where: {
        tutorId,
      },
      orderBy: { createdAt: "desc" },
      include: {
        student: {
          select: {
            name: true,
            image: true,
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
            NOT: { senderTutorId: tutorId },
          },
        });

        return {
          id: c.id,
          unread,
          allowed: true, // since you moved away from booking-based locking
          booking: {
            status: "ACTIVE",
            student: {
              name: c.student?.name || "Student",
              image: c.student?.image,
            },
          },
        };
      })
    );

    return NextResponse.json({ conversations });

  } catch (error) {
    console.error("Tutor conversations error:", error);
    return NextResponse.json({ conversations: [] }, { status: 500 });
  }
}
