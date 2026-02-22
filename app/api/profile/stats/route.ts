import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const totalBookings = await prisma.booking.count({
    where: { studentId: session.user.id },
  });

  const completedSessions = await prisma.booking.count({
    where: {
      studentId: session.user.id,
      status: "COMPLETED",
    },
  });

 const payments = await prisma.payment.aggregate({
  _sum: { paidAmount: true },
  where: {
    booking: { studentId: session.user.id },
    status: {
      in: ["HALF_PAID", "FULL_PAID"],
    },
  },
});
const paymentRows = await prisma.payment.findMany({
  where: {
    booking: { studentId: session.user.id },
  },
});

console.log(paymentRows);



  return NextResponse.json({
    totalBookings,
    completedSessions,
    totalPayments: payments._sum.paidAmount || 0,
  });
}
