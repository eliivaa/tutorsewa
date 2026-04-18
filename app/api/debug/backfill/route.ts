import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check conversations
    const conversations: any[] = await prisma.$queryRawUnsafe(
      `SELECT id, "bookingId" FROM "Conversation"`
    );

    for (const convo of conversations) {
      if (!convo.bookingId) continue;

      const bookings: any[] = await prisma.$queryRawUnsafe(
        `SELECT "studentId", "tutorId"
         FROM "Booking"
         WHERE id = '${convo.bookingId}'`
      );

      if (bookings.length > 0) {
        await prisma.conversation.update({
          where: { id: convo.id },
          data: {
            studentId: bookings[0].studentId,
            tutorId: bookings[0].tutorId,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Backfill error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
