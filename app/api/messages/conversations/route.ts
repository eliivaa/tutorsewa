
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
import { getCurrentUserId} from "@/lib/auth/getCurrentUserId";

export async function GET() {
  const me = await getCurrentUserId();
  if (!me) return NextResponse.json({ conversations: [] });

  // 🔥 get conversations where I am ANY participant
  const convos = await prisma.conversation.findMany({
    where: {
      OR: [
        { studentId: me },
        { thriftUserId: me },
        { tutorId: me },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      student: { select: { id: true, name: true, image: true } },
      thriftUser: { select: { id: true, name: true, image: true } },
      tutor: { select: { id: true, name: true, photo: true } },
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
          NOT: { senderUserId: me },
        },
      });

      let person = null;

// ================= THRIFT CHAT =================
if (c.type === "THRIFT") {
  if (c.studentId === me) {
    // I am buyer → show seller
    person = {
      id: c.thriftUser?.id,
      name: c.thriftUser?.name,
      photo: c.thriftUser?.image,
    };
  } else {
    // I am seller → show buyer
    person = {
      id: c.student?.id,
      name: c.student?.name,
      photo: c.student?.image,
    };
  }
}

// ================= TUTOR CHAT =================
if (c.type === "TUTOR_SESSION") {
  if (c.studentId === me) {
    // I am student → show tutor
    person = {
      id: c.tutor?.id,
      name: c.tutor?.name,
      photo: c.tutor?.photo,
    };
  } else {
    // I am tutor → show student
    person = {
      id: c.student?.id,
      name: c.student?.name,
      photo: c.student?.image,
    };
  }
}

    return {
  id: c.id,
  person: person, // ⭐ unified field
  lastMessage: c.messages[0] || null,
  unread,
  allowed: true,
  type: c.type,
};

    })
  );

  return NextResponse.json({ conversations });
}
