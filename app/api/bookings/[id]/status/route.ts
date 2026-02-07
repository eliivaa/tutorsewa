// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { verifyTutor } from "@/lib/auth"; // or your tutor auth helper
// import { BookingStatus, NotificationType } from "@prisma/client";

// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // 1️⃣ Tutor authentication
//     const tutor = await verifyTutor();
//     if (!tutor) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const bookingId = params.id;
//     const { action } = await req.json(); // "APPROVE" | "REJECT"

//     // 2️⃣ Fetch booking
//     const booking = await prisma.booking.findUnique({
//       where: { id: bookingId },
//       include: { student: true },
//     });

//     if (!booking) {
//       return NextResponse.json({ error: "Booking not found" }, { status: 404 });
//     }

//     // 3️⃣ Ensure tutor owns this booking
//     if (booking.tutorId !== tutor.id) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     // =========================
//     // 4️⃣ REJECT
//     // =========================
//     if (action === "REJECT") {
//       await prisma.booking.update({
//         where: { id: bookingId },
//         data: { status: BookingStatus.REJECTED },
//       });

//       await prisma.notification.create({
//         data: {
//           userId: booking.studentId,
//           title: "Booking Rejected",
//           message: "Unfortunately, your booking request was rejected.",
//           type: NotificationType.BOOKING_REJECTED,
//           bookingId,
//         },
//       });

//       return NextResponse.json({ success: true });
//     }

//     // =========================
//     // 5️⃣ APPROVE → PAYMENT_PENDING
//     // =========================
//     if (action === "APPROVE") {
//       await prisma.booking.update({
//         where: { id: bookingId },
//         data: {
//           status: BookingStatus.PAYMENT_PENDING,
//           paymentStatus: "UNPAID",
//         },
//       });

//       await prisma.notification.create({
//         data: {
//           userId: booking.studentId,
//           title: "Payment Required",
//           message: "Your booking was approved. Please complete payment to confirm the session.",
//           type: NotificationType.PAYMENT_REQUIRED,
//           bookingId,
//           actionUrl: `/dashboard/payments/${bookingId}`,
//           actionLabel: "Pay Now",
//         },
//       });

//       return NextResponse.json({ success: true });
//     }

//     return NextResponse.json({ error: "Invalid action" }, { status: 400 });

//   } catch (error) {
//     console.error("Booking status update error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { BookingStatus, NotificationType } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ================= AUTH (Tutor) =================
    const cookieStore = cookies();
    const token = cookieStore.get("tutor_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tutor = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    // ================= INPUT =================
    const { action } = await req.json(); // APPROVE | REJECT
    const bookingId = params.id;

    // ================= FETCH BOOKING =================
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { student: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.tutorId !== tutor.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ================= STATUS UPDATE =================
    let newStatus: BookingStatus;

    if (action === "APPROVE") {
      newStatus = BookingStatus.PAYMENT_PENDING;
    } else if (action === "REJECT") {
      newStatus = BookingStatus.REJECTED;
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: newStatus },
    });

    // ================= NOTIFY STUDENT =================
    await prisma.notification.create({
      data: {
        userId: booking.studentId,
        title: action === "APPROVE" ? "Booking Approved" : "Booking Rejected",
        message:
          action === "APPROVE"
            ? "Your booking has been approved. Please complete payment."
            : "Your booking request was rejected by the tutor.",
        type:
          action === "APPROVE"
            ? NotificationType.BOOKING_ACCEPTED
            : NotificationType.BOOKING_REJECTED,
        bookingId: booking.id,
        actionUrl: "/dashboard/sessions",
      },
    });

    return NextResponse.json({ booking: updated });
  } catch (err) {
    console.error("BOOKING STATUS UPDATE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to update booking status" },
      { status: 500 }
    );
  }
}
