import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AvailabilityType, BookingStatus } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { tutorId: string } }
) {
  try {
    const { tutorId } = params;
    const { searchParams } = new URL(req.url);

    const sessionType = searchParams.get("sessionType");

    if (!tutorId) {
      return NextResponse.json(
        { error: "Tutor ID required" },
        { status: 400 }
      );
    }

    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    /* ================= FETCH WITH BOOKINGS ================= */

    const slots = await prisma.tutorAvailability.findMany({
      where: {
        tutorId,
        isActive: true,
        date: { gte: today },

        ...(sessionType
          ? { sessionType: sessionType as AvailabilityType }
          : {}),
      },
      include: {
        bookings: {
          where: {
            status: {
              in: [
                BookingStatus.REQUESTED,
                BookingStatus.PAYMENT_PENDING,
                BookingStatus.READY,
              ],
            },
          },
        },
      },
      orderBy: [
        { date: "asc" },
        { startTime: "asc" },
      ],
    });

    /* ================= FILTER ================= */

    const filteredSlots = slots.filter((slot) => {

      // 🔥 FIX: calculate real active students
      if (slot.maxStudents) {
        const activeCount = slot.bookings.length;

        if (activeCount >= slot.maxStudents) {
          return false;
        }
      }

      // ✅ future dates → keep
      if (slot.date > today) return true;

      // ✅ today → check end time
      const [h, m] = slot.endTime.split(":").map(Number);

      const slotEnd = new Date(slot.date);
      slotEnd.setHours(h, m, 0, 0);

      return slotEnd > now;
    });

    return NextResponse.json({ slots: filteredSlots });

  } catch (err) {
    console.error("STUDENT AVAILABILITY ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load availability" },
      { status: 500 }
    );
  }
}