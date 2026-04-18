// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   try {
//     /* =========================
//        FETCH BOOKINGS (NOT PAYMENTS )
//     ========================= */

//     const bookings = await prisma.booking.findMany({
//       where: {
//         paymentStatus: {
//           in: ["PARTIALLY_PAID", "FULLY_PAID"],
//         },
//       },
//       include: {
//         student: true,
//         tutor: true,
//         payments: true, // 🔥 IMPORTANT
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     /* =========================
//        SUMMARY VARIABLES
//     ========================= */

//     let totalRevenue = 0;
//     let adminEarnings = 0;
//     let tutorEarnings = 0;

//     /* =========================
//        ROW BUILDING
//     ========================= */

//     const rows = bookings.map((b) => {
//       // TOTAL PAID 
//       const totalPaid = b.payments.reduce(
//         (sum, p) => sum + (p.paidAmount ?? 0),
//         0
//       );

//       const tutorEarning = Math.round(totalPaid * 0.85);
//       const adminCommission = totalPaid - tutorEarning;

//       //  TOTAL revenue = what student actually paid
//       totalRevenue += totalPaid;

//       // Only count earnings AFTER tutor is paid
//       if ((b as any).tutorPaid) {
//         adminEarnings += adminCommission;
//         tutorEarnings += tutorEarning;
//       }

//       return {
//         id: b.id, 
//         student: b.student.name ?? b.student.email,
//         tutor: b.tutor.name,
//         subject: b.subject,

//         amount: totalPaid,
//         tutorEarning,
//         adminCommission,

//         tutorPaid: (b as any).tutorPaid ?? false,
//         tutorPaidAt: (b as any).tutorPaidAt ?? null,

//         bookingStatus: b.status,
//         date: b.startTime,
//       };
//     });

//     /* =========================
//        RESPONSE
//     ========================= */

//     return NextResponse.json({
//       summary: {
//         totalRevenue,
//         adminEarnings,
//         tutorEarnings,
//       },
//       rows,
//     });
//   } catch (err) {
//     console.error("ADMIN EARNINGS ERROR:", err);

//     return NextResponse.json(
//       { error: "Failed to load earnings" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    /* =========================
       FETCH BOOKINGS
    ========================= */

    const bookings = await prisma.booking.findMany({
      where: {
        paymentStatus: {
          in: ["PARTIALLY_PAID", "FULLY_PAID"],
        },
      },
      include: {
        student: true,
        tutor: true,
        payments: true, // ✅ important for refund detection
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    /* =========================
       SUMMARY VARIABLES
    ========================= */

    let totalRevenue = 0;
    let adminEarnings = 0;
    let tutorEarnings = 0;

    /* =========================
       ROW BUILDING
    ========================= */

    const rows = bookings.map((b) => {
      // ✅ detect refund
      const refunded = b.payments.some(
        (p) => p.status === "REFUNDED"
      );

      // ✅ total paid (0 if refunded)
      const totalPaid = refunded
        ? 0
        : b.payments.reduce(
            (sum, p) => sum + (p.paidAmount ?? 0),
            0
          );

      let tutorEarning = 0;
      let adminCommission = 0;

      // ✅ only calculate earnings if NOT refunded
      if (!refunded) {
        tutorEarning = Math.round(totalPaid * 0.85);
        adminCommission = totalPaid - tutorEarning;

        totalRevenue += totalPaid;

        if ((b as any).tutorPaid) {
          adminEarnings += adminCommission;
          tutorEarnings += tutorEarning;
        }
      }

      return {
        id: b.id,
        student: b.student.name ?? b.student.email,
        tutor: b.tutor.name,
        subject: b.subject,

        amount: totalPaid,
        tutorEarning,
        adminCommission,

        tutorPaid: (b as any).tutorPaid ?? false,
        tutorPaidAt: (b as any).tutorPaidAt ?? null,

        bookingStatus: b.status,
        date: b.startTime,

        // ✅ NEW (for UI)
        refunded,
        cancelledBy: b.cancelledBy,
      };
    });

    /* =========================
       RESPONSE
    ========================= */

    return NextResponse.json({
      summary: {
        totalRevenue,
        adminEarnings,
        tutorEarnings,
      },
      rows,
    });
  } catch (err) {
    console.error("ADMIN EARNINGS ERROR:", err);

    return NextResponse.json(
      { error: "Failed to load earnings" },
      { status: 500 }
    );
  }
}