

// // after thrift

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getCurrentUserId} from "@/lib/auth/getCurrentUserId";

// export async function GET() {
//   const me = await getCurrentUserId();
//   if (!me) return NextResponse.json({ conversations: [] });

//   // 🔥 get conversations where I am ANY participant
//   const convos = await prisma.conversation.findMany({
//     where: {
//       OR: [
//         { studentId: me },
//         { thriftUserId: me },
//         { tutorId: me },
//       ],
//     },
//     orderBy: { createdAt: "desc" },
//     include: {
//       student: { select: { id: true, name: true, image: true } },
//       thriftUser: { select: { id: true, name: true, image: true } },
//       tutor: { select: { id: true, name: true, photo: true } },
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
//           NOT: { senderUserId: me },
//         },
//       });

//       let person = null;

// // ================= THRIFT CHAT =================
// if (c.type === "THRIFT") {
//   if (c.studentId === me) {
//     // I am buyer → show seller
//     person = {
//       id: c.thriftUser?.id,
//       name: c.thriftUser?.name,
//       photo: c.thriftUser?.image,
//     };
//   } else {
//     // I am seller → show buyer
//     person = {
//       id: c.student?.id,
//       name: c.student?.name,
//       photo: c.student?.image,
//     };
//   }
// }

// // ================= TUTOR CHAT =================
// if (c.type === "TUTOR_SESSION") {
//   if (c.studentId === me) {
//     // I am student → show tutor
//     person = {
//       id: c.tutor?.id,
//       name: c.tutor?.name,
//       photo: c.tutor?.photo,
//     };
//   } else {
//     // I am tutor → show student
//     person = {
//       id: c.student?.id,
//       name: c.student?.name,
//       photo: c.student?.image,
//     };
//   }
// }

//     return {
//   id: c.id,
//   person: person, // ⭐ unified field
//   lastMessage: c.messages[0] || null,
//   unread,
//   allowed: true,
//   type: c.type,
// };

//     })
//   );

//   return NextResponse.json({ conversations });
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth/getCurrentUserId";

export async function GET() {
  const me = await getCurrentUserId();

  if (!me) {
    return NextResponse.json({ conversations: [] });
  }

  const convos = await prisma.conversation.findMany({
    where: {
      OR: [
        { studentId: me },
        { thriftUserId: me },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      thriftUser: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      tutor: {
        select: {
          id: true,
          name: true,
          photo: true,
        },
      },
      messages: {
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          senderUserId: true,
          senderTutorId: true,
          isRead: true,
        },
      },
    },
  });

  const conversations = await Promise.all(
    convos.map(async (c) => {
//       const unread = await prisma.message.count({
//   where: {
//     conversationId: c.id,
//     isRead: false,
//     senderUserId: null, 
//   },
// });

const unread = await prisma.message.count({
  where: {
    conversationId: c.id,
    isRead: false,
    OR: [
      {
        senderUserId: { not: me }, // other users
      },
      {
        senderTutorId: { not: null }, // tutor messages
      },
    ],
  },
});

      let person = null;

      if (c.type === "THRIFT") {
        if (c.studentId === me) {
          person = {
            id: c.thriftUser?.id,
            name: c.thriftUser?.name,
            photo: c.thriftUser?.image,
          };
        } else {
          person = {
            id: c.student?.id,
            name: c.student?.name,
            photo: c.student?.image,
          };
        }
      }

      if (c.type === "TUTOR_SESSION") {
        if (c.studentId === me) {
          person = {
            id: c.tutor?.id,
            name: c.tutor?.name,
            photo: c.tutor?.photo,
          };
        } else {
          person = {
            id: c.student?.id,
            name: c.student?.name,
            photo: c.student?.image,
          };
        }
      }

      const latest = c.messages[0] || null;

      return {
        id: c.id,
        person,
        lastMessage: latest?.content || "",
        lastMessageTime: latest?.createdAt || null,
        unread,
        allowed: true,
        type: c.type,
      };
    })
  );

  return NextResponse.json({ conversations });
}