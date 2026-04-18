import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { BookingStatus } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();

    /* ================= STUDENT CONDITION ONLY ================= */
    // ❗ IMPORTANT: tutorId is DIFFERENT table → do NOT use it here
    const userCondition = {
      studentId: userId,
    };

    /* ================= TOTAL BOOKINGS ================= */
    const totalBookings = await prisma.booking.count({
      where: userCondition,
    });

    /* ================= COMPLETED SESSIONS ================= */
    const completedSessions = await prisma.booking.count({
      where: {
        ...userCondition,
        status: BookingStatus.COMPLETED,
      },
    });

    /* ================= UPCOMING SESSIONS ================= */
    const upcomingSessions = await prisma.booking.count({
      where: {
        ...userCondition,
        startTime: { gt: now },
        status: {
          in: [BookingStatus.READY, BookingStatus.PAYMENT_PENDING]
        },
      },
    });

    /* ================= TUTORS CONNECTED ================= */
    const tutorsConnected = await prisma.booking.groupBy({
      by: ["tutorId"],
      where: {
        ...userCondition,
        status: BookingStatus.COMPLETED,
      },
    });

    /* ================= PENDING PAYMENTS ================= */
    const pendingBookings = await prisma.booking.findMany({
      where: {
        ...userCondition,
        status: {
          notIn: [
            BookingStatus.CANCELLED,
            BookingStatus.EXPIRED,
            BookingStatus.REJECTED,
          ],
        },
        paymentStatus: {
          in: ["UNPAID", "PARTIALLY_PAID"],
        },
      },
      select: {
        totalAmount: true,
        payments: {
          where: {
            status: {
              in: ["HALF_PAID", "FULL_PAID"],
            },
          },
          select: { paidAmount: true },
        },
      },
    });

    let pendingPayments = 0;

    for (const b of pendingBookings) {
      const paid = b.payments.reduce((s, p) => s + p.paidAmount, 0);
      const remaining = b.totalAmount - paid;

      if (remaining > 0) {
        pendingPayments += remaining;
      }
    }

    /* ================= DEBUG (REMOVE AFTER TESTING) ================= */
    const debug = await prisma.booking.findMany({
      where: { studentId: userId },
      select: { id: true, status: true },
    });

    console.log("USER:", userId);
    console.log("BOOKINGS FOUND:", debug.length);
    console.log("BOOKINGS:", debug);

    /* ================= RESPONSE ================= */
    return NextResponse.json({
      totalBookings,
      completedSessions,
      upcomingSessions,
      tutorsConnected: tutorsConnected.length,
      pendingPayments,
    });

  } catch (err) {
    console.error("DASHBOARD STATS ERROR:", err);

    return NextResponse.json(
      {
        totalBookings: 0,
        completedSessions: 0,
        upcomingSessions: 0,
        tutorsConnected: 0,
        pendingPayments: 0,
      },
      { status: 500 }
    );
  }
}