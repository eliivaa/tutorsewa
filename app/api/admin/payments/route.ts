import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        student: true,
        tutor: true,
       payments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

   const rows = bookings.map((b) => {
  const refunded = b.payments.some(p => p.status === "REFUNDED");

  const totalPaid = b.payments.reduce(
    (sum, p) => sum + (p.paidAmount ?? 0),
    0
  );

  return {
    id: b.id,
    student: b.student.name ?? b.student.email,
    tutor: b.tutor.name,
    subject: b.subject,
    date: b.startTime,
    totalAmount: b.totalAmount,

    paidAmount: refunded ? 0 : totalPaid,
    remainingAmount: refunded ? 0 : b.totalAmount - totalPaid,

    paymentStatus: refunded ? "REFUNDED" : b.paymentStatus,
     cancelledBy: b.cancelledBy,
  };
});

    return NextResponse.json({ rows });
  } catch (error) {
    console.error("ADMIN PAYMENTS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load payments" },
      { status: 500 }
    );
  }
}
