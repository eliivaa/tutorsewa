

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    /* ======================
       AUTH (TUTOR TOKEN)
    ====================== */
    const token = cookies().get("tutor_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    const tutorId = decoded.id;

    /* ======================
       LAST 7 DAYS RANGE
    ====================== */
    const today = new Date();

    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });

    /* ======================
       WEEKLY EARNINGS
       (Based on actual payout time)
    ====================== */
    const earnings = await prisma.tutorEarning.findMany({
      where: {
        tutorId,
        booking: {
          tutorPaid: true,
        },
      },
      include: {
        booking: true,
      },
    });

    const weeklyEarnings = days.map((day) => {
      const next = new Date(day);
      next.setDate(day.getDate() + 1);

      const total = earnings
        .filter((e) => {
          if (!e.booking.tutorPaidAt) return false;

          return (
            e.booking.tutorPaidAt >= day &&
            e.booking.tutorPaidAt < next
          );
        })
        .reduce((sum, e) => sum + e.amount, 0);

      return {
        day: day.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        earnings: total,
      };
    });

    /* ======================
       BOOKINGS (COMMON QUERY)
    ====================== */
    const bookings = await prisma.booking.findMany({
      where: {
        tutorId,
        status: "COMPLETED",
      },
    });

    /* ======================
       STUDENT GROWTH (DAILY)
       (Shows new students per day)
    ====================== */
    const studentGrowth = days.map((day) => {
      const next = new Date(day);
      next.setDate(day.getDate() + 1);

      const count = bookings.filter(
        (b) =>
          b.createdAt >= day &&
          b.createdAt < next
      ).length;

      return {
        day: day.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        students: count,
      };
    });

    /* ======================
       SESSION BREAKDOWN
    ====================== */
    const oneToOne = bookings.filter(
      (b) => b.sessionType === "ONE_TO_ONE"
    ).length;

    const group = bookings.filter(
      (b) => b.sessionType === "GROUP"
    ).length;

    const completed = bookings.length;

    const pending = await prisma.booking.count({
      where: {
        tutorId,
        status: "READY",
      },
    });

    const sessionsBreakdown = [
      { name: "1-to-1", value: oneToOne },
      { name: "Group", value: group },
      { name: "Completed", value: completed },
      { name: "Pending", value: pending },
    ];

    /* ======================
       FINAL RESPONSE
    ====================== */
    return NextResponse.json({
      weeklyEarnings,
      studentGrowth,
      sessionsBreakdown,
    });

  } catch (err) {
    console.error("DASHBOARD ERROR:", err);

    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}