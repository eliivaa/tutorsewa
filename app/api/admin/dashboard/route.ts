import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalStudents,
      totalTutors,
      totalBookings,
      revenue,
      studentMonthly,
      tutorMonthly,
      earningsMonthly,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.tutor.count(),
      prisma.booking.count(),
      prisma.payment.aggregate({
        where: {
          status: { in: ["HALF_PAID", "FULL_PAID"] },
        },
        _sum: { amount: true },
      }),

      // STUDENTS per month
      prisma.$queryRaw`
        SELECT to_char("createdAt", 'Mon') AS month, COUNT(*)::int AS count
        FROM "User"
        GROUP BY month, date_trunc('month', "createdAt")
        ORDER BY date_trunc('month', "createdAt")
      `,

      // TUTORS per month
      prisma.$queryRaw`
        SELECT to_char("createdAt", 'Mon') AS month, COUNT(*)::int AS count
        FROM "Tutor"
        GROUP BY month, date_trunc('month', "createdAt")
        ORDER BY date_trunc('month', "createdAt")
      `,

      // EARNINGS per month
      prisma.$queryRaw`
        SELECT 
          to_char("createdAt", 'Mon') AS month,
          SUM("adminCommission")::int AS admin,
          SUM("tutorEarning")::int AS tutor
        FROM "Payment"
        WHERE "tutorPaid" = true
        GROUP BY month, date_trunc('month', "createdAt")
        ORDER BY date_trunc('month', "createdAt")
      `,
    ]);

    return NextResponse.json({
      totalStudents,
      totalTutors,
      totalBookings,
      totalEarnings: revenue._sum.amount ?? 0,
      registrations: { studentMonthly, tutorMonthly },
      earningsMonthly,
    });
  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
