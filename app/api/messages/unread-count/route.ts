import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentId } from "@/lib/auth/getStudentId";

export async function GET() {
  const studentId = await getStudentId();
  if (!studentId) {
    return NextResponse.json({ count: 0 });
  }

  const count = await prisma.message.count({
    where: {
      isRead: false,
      NOT: { senderUserId: studentId },
      conversation: {
        studentId,
      },
    },
  });

  return NextResponse.json({ count });
}
