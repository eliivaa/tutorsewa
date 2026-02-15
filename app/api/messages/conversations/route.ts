
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getStudentId } from "@/lib/auth/getStudentId";

// export async function GET() {
//   const studentId = await getStudentId();
//   if (!studentId) {
//     return NextResponse.json({ conversations: [] });
//   }

//   const convos = await prisma.conversation.findMany({
//     where: {
//       studentId,
//     },
//     orderBy: { createdAt: "desc" },
//     include: {
//       tutor: {
//         select: {
//           id: true,
//           name: true,
//           photo: true,
//         },
//       },
//       messages: {
//         take: 1,
//         orderBy: { createdAt: "desc" },
//       },
//     },
//   });

//   const conversations = await Promise.all(
//     convos.map(async (c) => {
//       const unread = await prisma.message.count({
//         where: {
//           conversationId: c.id,
//           isRead: false,
//           NOT: { senderUserId: studentId },
//         },
//       });

//       return {
//         id: c.id,
//         tutor: c.tutor,
//         lastMessage: c.messages[0] || null,
//         unread,
//         allowed: true,
//       };
//     })
//   );

//   return NextResponse.json({ conversations });
// }


// after thrift

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentId } from "@/lib/auth/getStudentId";

export async function GET() {
  const userId = await getStudentId();
  if (!userId) {
    return NextResponse.json({ conversations: [] });
  }

  // ⭐ load conversations where user is student OR seller
  const convos = await prisma.conversation.findMany({
    where: {
      OR: [
        { studentId: userId },
        { thriftUserId: userId }, // IMPORTANT FIX
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      tutor: { select: { id: true, name: true, photo: true } },
      student: { select: { id: true, name: true, image: true } },
      thriftUser: { select: { id: true, name: true, image: true } },
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
          NOT: { senderUserId: userId },
        },
      });

      let person;

      // ⭐ decide other person dynamically
      if (c.type === "THRIFT") {
        person =
          c.studentId === userId
            ? {
                id: c.thriftUser?.id,
                name: c.thriftUser?.name || "Seller",
                photo: c.thriftUser?.image || null,
              }
            : {
                id: c.student?.id,
                name: c.student?.name || "User",
                photo: c.student?.image || null,
              };
      } else {
        person = {
          id: c.tutor?.id,
          name: c.tutor?.name || "Tutor",
          photo: c.tutor?.photo || null,
        };
      }

      return {
        id: c.id,
        tutor: person,
        lastMessage: c.messages[0] || null,
        unread,
        allowed: true,
        type: c.type,
      };
    })
  );

  return NextResponse.json({ conversations });
}
