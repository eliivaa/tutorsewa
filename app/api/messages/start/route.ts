// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getCurrentUserId } from "@/lib/auth/getCurrentUserId";

// export async function GET(req: NextRequest) {
//   const me = await getCurrentUserId();
//   if (!me) return NextResponse.json({ success: false });

//   const tutorId = new URL(req.url).searchParams.get("tutorId");
//   if (!tutorId) return NextResponse.json({ success: false });

//   // check if I am the tutor
//   const tutor = await prisma.tutor.findUnique({
//     where: { id: me },
//   });

//   let studentId: string;
//   let actualTutorId: string;

//   if (tutor) {
//     // I am tutor → other person is student
//     studentId = tutorId;
//     actualTutorId = me;
//   } else {
//     // I am student → tutor is tutor
//     studentId = me;
//     actualTutorId = tutorId;
//   }

//   const conversation = await prisma.conversation.upsert({
//     where: {
//       studentId_tutorId: {
//         studentId,
//         tutorId: actualTutorId,
//       },
//     },
//     update: {},
//     create: {
//       studentId,
//       tutorId: actualTutorId,
//       type: "TUTOR_SESSION",
//     },
//   });

//   return NextResponse.json({
//     success: true,
//     conversationId: conversation.id,
//   });
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth/getCurrentUserId";

export async function GET(req: NextRequest) {
  try {
    const me = await getCurrentUserId();
    if (!me) {
      return NextResponse.json({ allowed: false });
    }

    const tutorId = new URL(req.url).searchParams.get("tutorId");
    if (!tutorId) {
      return NextResponse.json({ allowed: false });
    }

    // 🔥 CHECK BOOKING PERMISSION FIRST
    const hasBooking = await prisma.booking.findFirst({
      where: {
        studentId: me,
        tutorId: tutorId,
        status: {
          in: ["CONFIRMED", "READY", "COMPLETED", "PARTIALLY_PAID", "FULLY_PAID"],
        },
      },
    });

    if (!hasBooking) {
      return NextResponse.json({ allowed: false });
    }

    // 🔥 ONLY NOW CREATE CONVERSATION
    const conversation = await prisma.conversation.upsert({
      where: {
        studentId_tutorId: {
          studentId: me,
          tutorId: tutorId,
        },
      },
      update: {},
      create: {
        studentId: me,
        tutorId: tutorId,
        type: "TUTOR_SESSION",
      },
    });

    return NextResponse.json({
      allowed: true,
      conversationId: conversation.id,
    });

  } catch (err) {
    console.error("START CHAT ERROR:", err);
    return NextResponse.json({ allowed: false });
  }
}
