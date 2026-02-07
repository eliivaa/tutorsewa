// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// export async function GET() {
//   try {
//     const token = cookies().get("tutor_token")?.value;
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET!
//     ) as { id: string };

//     const tutorId = decoded.id;

//     const payments = await prisma.payment.findMany({
//       where: {
//         booking: {
//           tutorId,
//           status: "COMPLETED", // only completed sessions
//         },
//       },
//       include: {
//         booking: {
//           include: {
//             student: {
//               select: {
//                 name: true,
//                 email: true,
//               },
//             },
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     const rows = payments.map((p) => {
//       const tutorEarning = Math.round(p.amount * 0.85);

//       return {
//         id: p.id,
//         student:
//           p.booking.student.name ??
//           p.booking.student.email ??
//           "Student",
//         subject: p.booking.subject,
//         sessionType: p.booking.sessionType,
//         totalAmount: p.amount,
//         tutorEarning,
//         status: p.tutorPaid ? "PAID" : "PENDING",
//         paidAt: p.tutorPaidAt,
//       };
//     });

//     return NextResponse.json({ rows });
//   } catch (err) {
//     console.error("TUTOR EARNINGS ERROR:", err);
//     return NextResponse.json(
//       { error: "Failed to load tutor earnings" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const token = cookies().get("tutor_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    const tutorId = decoded.id;

    const payments = await prisma.payment.findMany({
      where: {
        booking: {
          tutorId,
          status: "COMPLETED", // ✅ ONLY COMPLETED SESSIONS
        },
      },
      include: {
        booking: {
          include: {
            student: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    let totalEarned = 0;

    const rows = payments.map((p) => {
      const tutorEarning = Math.round(p.amount * 0.85);

      if (p.tutorPaid) {
        totalEarned += tutorEarning; // ✅ ONLY PAID COUNTED
      }

      return {
        id: p.id,
        student:
          p.booking.student.name ??
          p.booking.student.email ??
          "Student",
        subject: p.booking.subject,
        sessionType: p.booking.sessionType,
        totalAmount: p.amount,
        tutorEarning,
        status: p.tutorPaid ? "PAID" : "PENDING",
        paidAt: p.tutorPaidAt,
      };
    });

    return NextResponse.json({
      summary: {
        totalEarned,
      },
      rows,
    });
  } catch (err) {
    console.error("TUTOR EARNINGS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load tutor earnings" },
      { status: 500 }
    );
  }
}
