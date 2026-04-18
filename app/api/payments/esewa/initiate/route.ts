// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { generateEsewaSignature } from "@/lib/esewa";
// import { randomUUID } from "crypto";

// export async function POST(req: NextRequest) {
//   try {
//     const { bookingId, payMode, useWallet } = await req.json();

//     if (!bookingId || !["HALF", "FULL"].includes(payMode)) {
//       return NextResponse.json({ error: "Invalid input" }, { status: 400 });
//     }

//     const booking = await prisma.booking.findUnique({
//       where: { id: bookingId },
//       include: {
//         payments: true,
//         student: true,
//       },
//     });

//     if (!booking) {
//       return NextResponse.json({ error: "Booking not found" }, { status: 404 });
//     }

//     if (booking.paymentStatus === "FULLY_PAID") {
//       return NextResponse.json(
//         { error: "Booking already fully paid" },
//         { status: 400 }
//       );
//     }

//     /* ================= CALCULATE EXISTING PAID ================= */

//   const totalPaid = booking.payments
//   .filter((p) =>
//     p.status === "HALF_PAID" ||
//     p.status === "FULL_PAID" ||
//     p.status === "REMAINING_DUE"
//   )
//   .reduce((s, p) => s + p.paidAmount, 0);
  

//     let baseAmount =
//       totalPaid === 0
//         ? payMode === "HALF"
//           ? Math.ceil(booking.totalAmount / 2)
//           : booking.totalAmount
//         : booking.totalAmount - totalPaid;

//     /* ================= WALLET CALC ================= */

//     let walletUsed = 0;

//     if (useWallet && booking.student.walletBalance > 0) {
//       walletUsed = Math.min(booking.student.walletBalance, baseAmount);
//     }

//     const remainingAmount = baseAmount - walletUsed;

//     /* ================= CASE 1: FULLY COVERED BY WALLET ================= */

//     if (remainingAmount === 0) {
//       await prisma.$transaction(async (tx) => {
//         // debit wallet
//         if (walletUsed > 0) {
//           await tx.user.update({
//             where: { id: booking.studentId },
//             data: {
//               walletBalance: { decrement: walletUsed },
//             },
//           });

//           await tx.walletTransaction.create({
//             data: {
//               userId: booking.studentId,
//               amount: walletUsed,
//               type: "DEBIT",
//               reason: "WALLET_PAYMENT",
//               bookingId,
//             },
//           });
//         }

//         // mark booking paid
//         await tx.booking.update({
//           where: { id: bookingId },
//           data: {
//             paymentStatus: "FULLY_PAID",
//             status: "READY",
//           },
//         });
//       });

//       return NextResponse.json({
//         success: true,
//         message: "Paid fully using wallet",
//       });
//     }

//     /* ================= CASE 2: PARTIAL / FULL GATEWAY ================= */

//     const transactionUuid = randomUUID();

//     await prisma.payment.create({
//       data: {
//         bookingId,
//         gateway: "ESEWA",
//         transactionUuid,
//         amount: remainingAmount,
//         paidAmount: remainingAmount,
//         payMode,
//         status: "PENDING",
//       },
//     });

//  const signature = generateEsewaSignature({
//   total_amount: String(remainingAmount),
//       transaction_uuid: transactionUuid,
//       product_code: process.env.ESEWA_PRODUCT_CODE!,
//     });

   

//  /* ================= RETURN FORM ================= */

// console.log("=== ESEWA INIT ===");
// console.log("BOOKING:", bookingId);
// console.log("BASE:", baseAmount);
// console.log("WALLET USED:", walletUsed);
// console.log("ESEWA AMOUNT:", remainingAmount);

// if (!process.env.ESEWA_FORM_URL || !process.env.ESEWA_PRODUCT_CODE) {
//   console.error("Missing eSewa ENV");
//   return NextResponse.json(
//     { error: "eSewa config missing" },
//     { status: 500 }
//   );
// }

// return NextResponse.json({
//   success: false, // 🔥 important (frontend expects this)
//   esewaUrl: process.env.ESEWA_FORM_URL,
//   formData: {
//   amount: String(remainingAmount),
//   tax_amount: 0,
//   product_service_charge: 0,
//   product_delivery_charge: 0,
//   total_amount: String(remainingAmount),
//   transaction_uuid: transactionUuid,
//   product_code: process.env.ESEWA_PRODUCT_CODE!,
//   success_url: `${process.env.APP_BASE_URL}/dashboard/payments/${bookingId}?status=success&uuid=${transactionUuid}&walletUsed=${walletUsed}`,
//   failure_url: `${process.env.APP_BASE_URL}/dashboard/payments/${bookingId}?status=failed&uuid=${transactionUuid}`,
//   signed_field_names: "total_amount,transaction_uuid,product_code",
//   signature,
// }
// });

//   } catch (err) {
//     console.error("INIT ERROR:", err);
//     return NextResponse.json(
//       { error: "Payment initiation failed" },
//       { status: 500 }
//     );
//   }
// }




import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateEsewaSignature } from "@/lib/esewa";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {

    const session = await getServerSession(authOptions);

if (!session?.user?.id) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

    const { bookingId, payMode, useWallet } = await req.json();

    if (!bookingId || !["HALF", "FULL"].includes(payMode)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        payments: true,
        student: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

if (booking.studentId !== session.user.id) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
    if (booking.paymentStatus === "FULLY_PAID") {
      return NextResponse.json(
        { error: "Booking already fully paid" },
        { status: 400 }
      );
    }

    /* ================= CALCULATE EXISTING PAID ================= */

  const totalPaid = booking.payments
  .filter((p) =>
    p.status === "HALF_PAID" ||
    p.status === "FULL_PAID" ||
    p.status === "REMAINING_DUE"
  )
  .reduce((s, p) => s + p.paidAmount, 0);
  

    let baseAmount =
      totalPaid === 0
        ? payMode === "HALF"
          ? Math.ceil(booking.totalAmount / 2)
          : booking.totalAmount
        : booking.totalAmount - totalPaid;

    /* ================= WALLET CALC ================= */

    let walletUsed = 0;

    if (useWallet && booking.student.walletBalance > 0) {
      walletUsed = Math.min(booking.student.walletBalance, baseAmount);
    }

    const remainingAmount = baseAmount - walletUsed;

    /* ================= CASE 1: FULLY COVERED BY WALLET ================= */

    if (remainingAmount === 0) {
      await prisma.$transaction(async (tx) => {
        // debit wallet
        if (walletUsed > 0) {
          await tx.user.update({
            where: { id: booking.studentId },
            data: {
              walletBalance: { decrement: walletUsed },
            },
          });

          await tx.walletTransaction.create({
            data: {
              userId: booking.studentId,
              amount: walletUsed,
              type: "DEBIT",
              reason: "WALLET_PAYMENT",
              bookingId,
            },
          });
        }

        // mark booking paid
        await tx.booking.update({
          where: { id: bookingId },
          data: {
            paymentStatus: "FULLY_PAID",
            status: "READY",
          },
        });
      });

      return NextResponse.json({
        success: true,
        message: "Paid fully using wallet",
      });
    }

    /* ================= CASE 2: PARTIAL / FULL GATEWAY ================= */

    const transactionUuid = randomUUID();

   await prisma.payment.create({
  data: {
    bookingId,
    gateway: "ESEWA",
    transactionUuid,
    amount: remainingAmount,
    paidAmount: remainingAmount,
    payMode,
    status: "PENDING",
    rawResponse: {
      walletUsed,
    },
  },
});

 const signature = generateEsewaSignature({
  total_amount: String(remainingAmount),
      transaction_uuid: transactionUuid,
      product_code: process.env.ESEWA_PRODUCT_CODE!,
    });

   

 /* ================= RETURN FORM ================= */

console.log("=== ESEWA INIT ===");
console.log("BOOKING:", bookingId);
console.log("BASE:", baseAmount);
console.log("WALLET USED:", walletUsed);
console.log("ESEWA AMOUNT:", remainingAmount);

if (!process.env.ESEWA_FORM_URL || !process.env.ESEWA_PRODUCT_CODE) {
  console.error("Missing eSewa ENV");
  return NextResponse.json(
    { error: "eSewa config missing" },
    { status: 500 }
  );
}

return NextResponse.json({
  success: false, // 🔥 important (frontend expects this)
  esewaUrl: process.env.ESEWA_FORM_URL,
  formData: {
  amount: String(remainingAmount),
  tax_amount: 0,
  product_service_charge: 0,
  product_delivery_charge: 0,
  total_amount: String(remainingAmount),
  transaction_uuid: transactionUuid,
  product_code: process.env.ESEWA_PRODUCT_CODE!,
  success_url: `${process.env.APP_BASE_URL}/dashboard/payments/${bookingId}?status=success&uuid=${transactionUuid}&walletUsed=${walletUsed}`,
  failure_url: `${process.env.APP_BASE_URL}/dashboard/payments/${bookingId}?status=failed&uuid=${transactionUuid}`,
  signed_field_names: "total_amount,transaction_uuid,product_code",
  signature,
}
});

  } catch (err) {
    console.error("INIT ERROR:", err);
    return NextResponse.json(
      { error: "Payment initiation failed" },
      { status: 500 }
    );
  }
}