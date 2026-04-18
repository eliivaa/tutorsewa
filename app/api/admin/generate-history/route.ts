// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { NotificationType } from "@prisma/client";

// export async function GET() {

//   /* ================= STUDENTS ================= */
//   const users = await prisma.user.findMany();

//   for (const u of users) {
//     await prisma.notification.create({
//       data: {
//         title: "Student Registered",
//         message: `${u.name || u.email} joined the platform`,
//         type: NotificationType.SYSTEM_ANNOUNCEMENT,
//         isForAdmin: true,
//         createdAt: u.createdAt,
//       },
//     });
//   }

//   /* ================= TUTORS ================= */
//   const tutors = await prisma.tutor.findMany();

//   for (const t of tutors) {
//     await prisma.notification.create({
//       data: {
//         title: "Tutor Applied",
//         message: `Tutor ${t.name} applied for approval`,
//         type: NotificationType.SYSTEM_ANNOUNCEMENT,
//         isForAdmin: true,
//         createdAt: t.createdAt,
//       },
//     });
//   }

//   /* ================= PAYMENTS ================= */
//   const payments = await prisma.payment.findMany({
//     include: {
//       booking: {
//         include: {
//           student: true,
//           tutor: true
//         }
//       }
//     }
//   });

//   for (const p of payments) {
//     await prisma.notification.create({
//       data: {
//         title: "Payment",
//         message: `Student ${p.booking.student.name} paid Rs.${p.paidAmount} to Tutor ${p.booking.tutor.name} for ${p.booking.subject}`,
//         type: NotificationType.PAYMENT_CONFIRMED,
//         isForAdmin: true,
//         createdAt: p.createdAt,
//       },
//     });
//   }

//   /* ================= COMPLETED SESSIONS ================= */
//   const sessions = await prisma.booking.findMany({
//     where: { status: "COMPLETED" },
//     include: { student: true, tutor: true }
//   });

//   for (const s of sessions) {
//     await prisma.notification.create({
//       data: {
//         title: "Session Completed",
//         message: `${s.student.name} completed session with ${s.tutor.name} (${s.subject})`,
//         type: NotificationType.SESSION_COMPLETED,
//         isForAdmin: true,
//         createdAt: s.updatedAt,
//       },
//     });
//   }

//   return NextResponse.json({ success: true });
// }


import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { NotificationType } from "@prisma/client";

export async function GET() {

  /* ================= STUDENTS ================= */
  const users = await prisma.user.findMany();

  for (const u of users) {
    await prisma.notification.create({
      data: {
        title: "Student Registered",
        message: `Student ${u.name || u.email} joined the platform`,
        type: NotificationType.SYSTEM_ANNOUNCEMENT,
        isForAdmin: true,
        actionUrl: "/admin/students",   // ✅ ADDED
        createdAt: u.createdAt,
      },
    });
  }

  /* ================= TUTORS ================= */
  const tutors = await prisma.tutor.findMany();

  for (const t of tutors) {
    await prisma.notification.create({
      data: {
        title: "Tutor Applied",
        message: `Tutor ${t.name} applied for approval`,
        type: NotificationType.SYSTEM_ANNOUNCEMENT,
        isForAdmin: true,
        actionUrl: "/admin/tutors",     // ✅ ADDED
        createdAt: t.createdAt,
      },
    });
  }

  /* ================= PAYMENTS ================= */
  const payments = await prisma.payment.findMany({
    include: {
      booking: {
        include: {
          student: true,
          tutor: true
        }
      }
    }
  });

  for (const p of payments) {
    await prisma.notification.create({
      data: {
        title: "Payment",
        message: `Student ${p.booking.student.name} paid Rs.${p.paidAmount} to Tutor ${p.booking.tutor.name} for ${p.booking.subject}`,
        type: NotificationType.PAYMENT_CONFIRMED,
        isForAdmin: true,
        actionUrl: "/admin/payments",   // ✅ ADDED
        createdAt: p.createdAt,
      },
    });
  }

  /* ================= COMPLETED SESSIONS ================= */
  const sessions = await prisma.booking.findMany({
    where: { status: "COMPLETED" },
    include: { student: true, tutor: true }
  });

  for (const s of sessions) {
    await prisma.notification.create({
      data: {
        title: "Session Completed",
        message: `Session completed: Student ${s.student.name} with Tutor ${s.tutor.name} (${s.subject})`,
        type: NotificationType.SESSION_COMPLETED,
        isForAdmin: true,
        actionUrl: "/admin/dashboard",   // ✅ ADDED
        createdAt: s.updatedAt,
      },
    });
  }

  return NextResponse.json({ success: true });
}
