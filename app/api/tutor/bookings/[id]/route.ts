

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import { BookingStatus, NotificationType } from "@prisma/client";

// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     /* ===== AUTH ===== */
//     const token = cookies().get("tutor_token")?.value;
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const tutor = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

//     const { action } = await req.json();

//     if (!["ACCEPT", "REJECT"].includes(action)) {
//       return NextResponse.json({ error: "Invalid action" }, { status: 400 });
//     }

//     /* ===== FETCH BOOKING ===== */
//     const booking = await prisma.booking.findUnique({
//       where: { id: params.id },
//     });

//     if (!booking || booking.tutorId !== tutor.id) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     /* ❌ BLOCK INVALID STATES */
//     if (
//       booking.status !== BookingStatus.REQUESTED
//     ) {
//       return NextResponse.json(
//         { error: "Booking cannot be modified" },
//         { status: 400 }
//       );
//     }

//     /* ===== ACCEPT ===== */
//     if (action === "ACCEPT") {
//       const updated = await prisma.booking.update({
//         where: { id: booking.id },
//         data: {
//           status: BookingStatus.PAYMENT_PENDING,
//         },
//       });
//   /* ================= IMPORTANT: UPDATE AVAILABILITY ================= */

//   // 1️⃣ For GROUP sessions → increase count
//   if (booking.sessionType === "GROUP") {
//     await prisma.tutorAvailability.update({
//       where: { id: booking.availabilityId },
//       data: {
//         currentCount: { increment: 1 },
//       },
//     });
//   }

//   // 2️⃣ For ONE-TO-ONE → disable slot
//   if (booking.sessionType === "ONE_TO_ONE") {
//     await prisma.tutorAvailability.update({
//       where: { id: booking.availabilityId },
//       data: {
//         isActive: false,
//       },
//     });
//   }
//       await prisma.notification.create({
//         data: {
//           userId: booking.studentId,
//           bookingId: booking.id,
//           title: "Booking Accepted",
//           message: "Your booking has been accepted. Please complete payment.",
//           type: NotificationType.BOOKING_ACCEPTED,
//           actionUrl: "/dashboard/sessions",
//         },
//       });
// await prisma.conversation.upsert({
//   where: {
//     studentId_tutorId: {
//       studentId: booking.studentId,
//       tutorId: booking.tutorId,
//     },
//   },
//   update: {},
//   create: {
//     studentId: booking.studentId,
//     tutorId: booking.tutorId,
//     type: "TUTOR_SESSION",
//   },
// });

//       return NextResponse.json({ success: true, booking: updated });
//     }

//     /* ===== REJECT ===== */
//     const updated = await prisma.booking.update({
//       where: { id: booking.id },
//       data: {
//         status: BookingStatus.REJECTED,
//       },
//     });

//     await prisma.notification.create({
//       data: {
//         userId: booking.studentId,
//         bookingId: booking.id,
//         title: "Booking Rejected",
//         message: "Your booking was rejected by the tutor.",
//         type: NotificationType.BOOKING_REJECTED,
//         actionUrl: "/dashboard/sessions",
//       },
//     });

//     return NextResponse.json({ success: true, booking: updated });
//   } catch (err) {
//     console.error("ACCEPT/REJECT ERROR:", err);
//     return NextResponse.json(
//       { error: "Failed to update booking" },
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
    /* ===== AUTH ===== */
    const token = cookies().get("tutor_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tutor = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const { action } = await req.json();
    console.log("ACTION RECEIVED:", action);

    if (!["ACCEPT", "REJECT"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    /* ===== FETCH BOOKING ===== */
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });
    console.log("BOOKING FOUND:", booking?.id);
console.log("BOOKING STATUS:", booking?.status);
console.log("TUTOR ID:", tutor.id);
console.log("BOOKING TUTOR ID:", booking?.tutorId);

    if (!booking || booking.tutorId !== tutor.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    /* ===== BLOCK INVALID STATES ===== */
    if (booking.status !== BookingStatus.REQUESTED) {
      return NextResponse.json(
        { error: "Booking cannot be modified" },
        { status: 400 }
      );
    }

    /* =========================================================
       ===== ACCEPT BOOKING =====
    ========================================================= */
    if (action === "ACCEPT") {

      /* ===== CHECK AVAILABILITY (IMPORTANT) ===== */
      const availability = await prisma.tutorAvailability.findUnique({
        where: { id: booking.availabilityId },
      });

      if (!availability || !availability.isActive) {
        return NextResponse.json(
          { error: "Slot is no longer available" },
          { status: 400 }
        );
      }

      // 🚫 Prevent overbooking (GROUP)
    // 🚫 Prevent overbooking (GROUP) — FIXED LOGIC
const acceptedCount = await prisma.booking.count({
  where: {
    availabilityId: booking.availabilityId,
    status: {
      in: ["PAYMENT_PENDING", "READY", "COMPLETED"],
    },
  },
});

if (
  availability.maxStudents &&
  acceptedCount >= availability.maxStudents
) {
  return NextResponse.json(
    { error: "Slot already full" },
    { status: 400 }
  );
}


      /* ===== UPDATE BOOKING ===== */
      const updated = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: BookingStatus.PAYMENT_PENDING,
        },
      });

      /* ===== UPDATE AVAILABILITY ===== */

      // GROUP → increase count
      if (booking.sessionType === "GROUP") {
        await prisma.tutorAvailability.update({
          where: { id: booking.availabilityId },
          data: {
            currentCount: { increment: 1 },
          },
        });
      }

      // ONE-TO-ONE → disable slot
      if (booking.sessionType === "ONE_TO_ONE") {
        await prisma.tutorAvailability.update({
          where: { id: booking.availabilityId },
          data: {
            isActive: false,
          },
        });
      }

      /* ===== NOTIFICATION ===== */
      await prisma.notification.create({
        data: {
          userId: booking.studentId,
          bookingId: booking.id,
          title: "Booking Accepted",
          message: "Your booking has been accepted. Please complete payment.",
          type: NotificationType.BOOKING_ACCEPTED,
          actionUrl: "/dashboard/payments",
        },
      });

      /* ===== CREATE / ENSURE CHAT ===== */
      await prisma.conversation.upsert({
        where: {
          studentId_tutorId: {
            studentId: booking.studentId,
            tutorId: booking.tutorId,
          },
        },
        update: {},
        create: {
          studentId: booking.studentId,
          tutorId: booking.tutorId,
          type: "TUTOR_SESSION",
        },
      });

      return NextResponse.json({ success: true, booking: updated });
    }

    /* =========================================================
       ===== REJECT BOOKING =====
    ========================================================= */
    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: BookingStatus.REJECTED,
      },
    });

    await prisma.notification.create({
      data: {
        userId: booking.studentId,
        bookingId: booking.id,
        title: "Booking Rejected",
        message: "Your booking was rejected by the tutor.",
        type: NotificationType.BOOKING_REJECTED,
        actionUrl: "/dashboard/sessions",
      },
    });

    return NextResponse.json({ success: true, booking: updated });

  } catch (err) {
    console.error("ACCEPT/REJECT ERROR:", err);

    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}