// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const { bookingId } = await req.json();

//     if (!bookingId) {
//       return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
//     }

//     const booking = await prisma.booking.findUnique({
//       where: { id: bookingId },
//       include: { payments: true },
//     });

//     if (!booking) {
//       return NextResponse.json({ error: "Booking not found" }, { status: 404 });
//     }

//     /* ================= MOCK PAYMENT ================= */

//     await prisma.$transaction(async (tx) => {
//       // 1️⃣ create payment record (if not exists)
//       if (booking.payments.length === 0) {
//         await tx.payment.create({
//           data: {
//             bookingId,
//             gateway: "ESEWA",
//             transactionUuid: "mock-" + Date.now(),
//             amount: booking.totalAmount,
//             paidAmount: booking.totalAmount,
//             payMode: "FULL",
//             status: "FULL_PAID",
//           },
//         });
//       }

//       // 2️⃣ mark booking as fully paid
//       await tx.booking.update({
//         where: { id: bookingId },
//         data: {
//           paymentStatus: "FULLY_PAID",
//           status: "READY",
//         },
//       });
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Mock payment done",
//     });

//   } catch (err) {
//     console.error("MOCK PAYMENT ERROR:", err);
//     return NextResponse.json(
//       { error: "Mock payment failed" },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { bookingId, payMode } = await req.json();

    if (!bookingId || !["HALF", "FULL"].includes(payMode)) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payments: true },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    let amount = 0;
    let newPaymentStatus = booking.paymentStatus;
    let newBookingStatus = booking.status;

    // ================= HALF PAYMENT =================
    if (payMode === "HALF" && booking.paymentStatus === "UNPAID") {
      amount = Math.ceil(booking.totalAmount / 2);
      newPaymentStatus = "PARTIALLY_PAID";
      newBookingStatus = "READY";
    }

    // ================= FULL PAYMENT =================
    if (payMode === "FULL") {
      const totalPaid =
        booking.payments.reduce(
          (sum, p) => sum + (p.paidAmount ?? 0),
          0
        ) || 0;

      amount = booking.totalAmount - totalPaid;

      newPaymentStatus = "FULLY_PAID";
      newBookingStatus = "READY";
    }

    // ================= CREATE PAYMENT RECORD =================
await prisma.payment.create({
  data: {
    bookingId,
    paidAmount: amount,
    amount,
    payMode,
    gateway: "ESEWA",
    transactionUuid: `mock-${Date.now()}`,
    status: payMode === "HALF" ? "HALF_PAID" : "FULL_PAID",
  },
});

// ================= UPDATE BOOKING =================

const previousPaid = booking.payments.reduce(
  (sum, p) => sum + (p.paidAmount ?? 0),
  0
);

const totalPaid = previousPaid + amount;

if (!booking) throw new Error("Booking not found");

// 🟢 FULLY PAID
if (totalPaid >= booking.totalAmount) {
  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      paymentStatus: "FULLY_PAID",
      status: "READY", // important
    },
  });
}
// 🟡 HALF PAID
else if (totalPaid > 0) {
  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      paymentStatus: "PARTIALLY_PAID",
    },
  });
}
    return NextResponse.json({
      success: true,
      message: "Mock payment successful",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Mock payment failed" },
      { status: 500 }
    );
  }
}