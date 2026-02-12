


// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getStudentId } from "@/lib/auth/getStudentId";

// export async function GET(req: NextRequest) {
//   const studentId = await getStudentId();
//   if (!studentId) {
//     return NextResponse.json({ success: false });
//   }

//   const tutorId = new URL(req.url).searchParams.get("tutorId");
//   if (!tutorId) {
//     return NextResponse.json({ success: false });
//   }

//   // 🔍 Check if conversation already exists
//   let conversation = await prisma.conversation.findUnique({
//     where: {
//       studentId_tutorId: {
//         studentId,
//         tutorId,
//       },
//     },
//   });

//   // 🆕 If not, create new conversation
//   if (!conversation) {
//     conversation = await prisma.conversation.create({
//       data: {
//         studentId,
//         tutorId,
//       },
//     });
//   }

//   return NextResponse.json({
//     success: true,
//     conversationId: conversation.id,
//   });
// }







import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentId } from "@/lib/auth/getStudentId";

export async function GET(req: NextRequest) {
  const studentId = await getStudentId();
  if (!studentId) {
    return NextResponse.json({ success: false });
  }

  const tutorId = new URL(req.url).searchParams.get("tutorId");
  if (!tutorId) {
    return NextResponse.json({ success: false });
  }
const conversation = await prisma.conversation.upsert({
  where: {
    studentId_tutorId: {
      studentId,
      tutorId,
    },
  },
  update: {},   // nothing to update
  create: {
    studentId,
    tutorId,
  },
});


  return NextResponse.json({
    success: true,
    conversationId: conversation.id,
  });
}
