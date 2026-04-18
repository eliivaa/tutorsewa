import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth/getCurrentUserId";

export async function GET() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ count: 0 });
  }

  // const count = await prisma.message.count({
  //   where: {
  //     isRead: false,

  //     // ✅ ONLY messages NOT sent by me
  //     senderUserId: null, // tutor messages only

  //     // ✅ ONLY conversations I belong to
  //     conversation: {
  //       OR: [
  //         { studentId: userId },
  //         { thriftUserId: userId },
  //       ],
  //     },
  const count = await prisma.message.count({
  where: {
    isRead: false,

    // ✅ exclude messages sent by me
    NOT: {
      senderUserId: userId,
    },

    // ✅ only conversations I belong to
    conversation: {
      OR: [
        { studentId: userId },
        { thriftUserId: userId },
      ],
    },
  },
});
  
  return NextResponse.json({ count });
}