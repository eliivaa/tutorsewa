// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { generateEsewaSignature } from "@/lib/esewa";
// import { randomUUID } from "crypto";

// export async function POST(req: NextRequest) {
//   try {
//     const { bookingId, payMode } = await req.json();

//     if (!bookingId || !["HALF", "FULL"].includes(payMode)) {
//       return NextResponse.json({ error: "Invalid input" }, { status: 400 });
//     }

//     const booking = await prisma.booking.findUnique({
//       where: { id: bookingId },
//       include: { payments: true },
//     });

//     if (!booking) {
//       return NextResponse.json({ error: "Booking not found" }, { status: 404 });
//     }

//     // ✅ Allowed booking states
//     if (!["PAYMENT_PENDING", "CONFIRMED"].includes(booking.status)) {
//       return NextResponse.json(
//         { error: "Booking not eligible for payment" },
//         { status: 400 }
//       );
//     }

//     // ❌ Already fully paid
//     if (booking.paymentStatus === "FULLY_PAID") {
//       return NextResponse.json(
//         { error: "Booking already fully paid" },
//         { status: 400 }
//       );
//     }

//     /* ================= CALCULATE TOTAL PAID ================= */
//     const totalPaid = booking.payments
//       .filter(
//         (p) => p.status === "HALF_PAID" || p.status === "FULL_PAID"
//       )
//       .reduce((sum, p) => sum + p.paidAmount, 0);

//     const remainingAmount = booking.totalAmount - totalPaid;

//     if (remainingAmount <= 0) {
//       return NextResponse.json(
//         { error: "No remaining amount to pay" },
//         { status: 400 }
//       );
//     }

//     /* ================= PAYMENT RULES ================= */

//     // ❌ Block HALF payment again
//     if (totalPaid > 0 && payMode === "HALF") {
//       return NextResponse.json(
//         { error: "Half payment already completed. Please pay remaining amount." },
//         { status: 400 }
//       );
//     }

//     let paidAmount: number;

//     // First payment
//     if (totalPaid === 0) {
//       paidAmount =
//         payMode === "HALF"
//           ? Math.ceil(booking.totalAmount / 2)
//           : booking.totalAmount;
//     }
//     // Second payment → ALWAYS remaining
//     else {
//       paidAmount = remainingAmount;
//     }

//     const transactionUuid = randomUUID();

//     /* ================= CREATE PAYMENT ================= */
//     await prisma.payment.create({
//       data: {
//         bookingId,
//         gateway: "ESEWA",
//         transactionUuid,
//         amount: paidAmount,      // charged this time
//         paidAmount: paidAmount,  // stored clearly
//         payMode,
//         status: "PENDING",
//       },
//     });

//     /* ================= SIGN ESEWA ================= */
//     // const signature = generateEsewaSignature({
//     //   amount: paidAmount,
//     //   total_amount: paidAmount,
//     //   transaction_uuid: transactionUuid,
//     //   product_code: process.env.ESEWA_PRODUCT_CODE!,
//     // });
//     const signature = generateEsewaSignature({
//   total_amount: paidAmount,
//   transaction_uuid: transactionUuid,
//   product_code: process.env.ESEWA_PRODUCT_CODE!,
// });


//     return NextResponse.json({
//       formUrl: process.env.ESEWA_FORM_URL,
//       payload: {
//         amount: paidAmount,
//         tax_amount: 0,
//         product_service_charge: 0,
//         product_delivery_charge: 0,
//         total_amount: paidAmount,
//         transaction_uuid: transactionUuid,
//         product_code: process.env.ESEWA_PRODUCT_CODE,
//         success_url: `${process.env.APP_BASE_URL}/dashboard/payments/${bookingId}?status=success&uuid=${transactionUuid}`,
//         // failure_url: `${process.env.APP_BASE_URL}/dashboard/payments/${bookingId}?status=failed`,
//         failure_url: `${process.env.APP_BASE_URL}/dashboard/payments/${bookingId}?status=failed&uuid=${transactionUuid}`,

//         signed_field_names:
//           "total_amount,transaction_uuid,product_code",
//         signature,
//       },
      
//     });
    
//   } catch (err) {
//     console.error("INIT ERROR:", err);
//     return NextResponse.json(
//       { error: "Payment initiation failed" },
//       { status: 500 }
//     );
//   }
// }





// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { generateEsewaSignature } from "@/lib/esewa";
// import { randomUUID } from "crypto";

// export async function POST(req: NextRequest) {
//   try {
//     const { bookingId, payMode } = await req.json();

//     /* ================= VALIDATION ================= */

//     if (!bookingId || !["HALF", "FULL"].includes(payMode)) {
//       return NextResponse.json({ error: "Invalid input" }, { status: 400 });
//     }

//     const booking = await prisma.booking.findUnique({
//       where: { id: bookingId },
//       include: { payments: true },
//     });

//     if (!booking) {
//       return NextResponse.json({ error: "Booking not found" }, { status: 404 });
//     }

//     if (!["PAYMENT_PENDING", "CONFIRMED"].includes(booking.status)) {
//       return NextResponse.json(
//         { error: "Booking not eligible for payment" },
//         { status: 400 }
//       );
//     }

//     if (booking.paymentStatus === "FULLY_PAID") {
//       return NextResponse.json(
//         { error: "Booking already fully paid" },
//         { status: 400 }
//       );
//     }

//     /* ================= CALCULATE AMOUNTS ================= */

//     const totalPaid = booking.payments
//       .filter(
//         (p) => p.status === "HALF_PAID" || p.status === "FULL_PAID"
//       )
//       .reduce((sum, p) => sum + p.paidAmount, 0);

//     const remainingAmount = booking.totalAmount - totalPaid;

//     if (remainingAmount <= 0) {
//       return NextResponse.json(
//         { error: "No remaining amount to pay" },
//         { status: 400 }
//       );
//     }

//     // Block half twice
//     if (totalPaid > 0 && payMode === "HALF") {
//       return NextResponse.json(
//         { error: "Half payment already completed. Please pay remaining amount." },
//         { status: 400 }
//       );
//     }

//     let paidAmount: number;

//     // First payment
//     if (totalPaid === 0) {
//       paidAmount =
//         payMode === "HALF"
//           ? Math.ceil(booking.totalAmount / 2)
//           : booking.totalAmount;
//     } else {
//       // Second payment → remaining
//       paidAmount = remainingAmount;
//     }

//     /* ================= CREATE TRANSACTION ================= */

//     const transactionUuid = randomUUID();

//     await prisma.payment.create({
//       data: {
//         bookingId,
//         gateway: "ESEWA",
//         transactionUuid,
//         amount: paidAmount,
//         paidAmount: paidAmount,
//         payMode,
//         status: "PENDING",
//       },
//     });

//     /* ================= SIGN ESEWA ================= */

//     const signature = generateEsewaSignature({
//       total_amount: paidAmount,
//       transaction_uuid: transactionUuid,
//       product_code: process.env.ESEWA_PRODUCT_CODE!,
//     });

//     /* ================= ESEWA PAYLOAD ================= */

//     const payload = {
//       // ❗ DO NOT send `amount` in v2
//       amount: paidAmount,
//       tax_amount: 0,
//       product_service_charge: 0,
//       product_delivery_charge: 0,

//       total_amount: paidAmount,
//       transaction_uuid: transactionUuid,
//       product_code: process.env.ESEWA_PRODUCT_CODE,

//       success_url: `${process.env.APP_BASE_URL}/dashboard/payments/${bookingId}?status=success&uuid=${transactionUuid}`,
//       failure_url: `${process.env.APP_BASE_URL}/dashboard/payments/${bookingId}?status=failed&uuid=${transactionUuid}`,

//       signed_field_names: "total_amount,transaction_uuid,product_code",
//       signature,
//     };

//     // 🔍 DEBUG (KEEP THIS FOR NOW)
//     console.log("===== ESEWA PAYLOAD =====");
//     console.log(payload);
//     console.log("=========================");

//     return NextResponse.json({
//       formUrl: process.env.ESEWA_FORM_URL,
//       payload,
//     });

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

export async function POST(req: NextRequest) {
  try {
    const { bookingId, payMode } = await req.json();

    if (!bookingId || !["HALF", "FULL"].includes(payMode)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payments: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.paymentStatus === "FULLY_PAID") {
      return NextResponse.json(
        { error: "Booking already fully paid" },
        { status: 400 }
      );
    }

    /* ===== CALCULATE PAID ===== */
    const totalPaid = booking.payments
      .filter(p => p.status === "HALF_PAID" || p.status === "FULL_PAID")
      .reduce((s, p) => s + p.paidAmount, 0);

    let paidAmount =
      totalPaid === 0
        ? payMode === "HALF"
          ? Math.ceil(booking.totalAmount / 2)
          : booking.totalAmount
        : booking.totalAmount - totalPaid;

    const transactionUuid = randomUUID();

    await prisma.payment.create({
      data: {
        bookingId,
        gateway: "ESEWA",
        transactionUuid,
        amount: paidAmount,
        paidAmount,
        payMode,
        status: "PENDING",
      },
    });

    const signature = generateEsewaSignature({
      total_amount: paidAmount,
      transaction_uuid: transactionUuid,
      product_code: process.env.ESEWA_PRODUCT_CODE!,
    });

    /* ===== RETURN HTML FORM ===== */
    return new NextResponse(
      `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Redirecting to eSewa</title>
</head>
<body onload="document.forms[0].submit()">
  <form method="POST" action="${process.env.ESEWA_FORM_URL}">
    <input type="hidden" name="amount" value="${paidAmount}" />
    <input type="hidden" name="tax_amount" value="0" />
    <input type="hidden" name="product_service_charge" value="0" />
    <input type="hidden" name="product_delivery_charge" value="0" />
    <input type="hidden" name="total_amount" value="${paidAmount}" />
    <input type="hidden" name="transaction_uuid" value="${transactionUuid}" />
    <input type="hidden" name="product_code" value="${process.env.ESEWA_PRODUCT_CODE}" />
    <input type="hidden" name="success_url" value="${process.env.APP_BASE_URL}/dashboard/payments/${bookingId}?status=success&uuid=${transactionUuid}" />
    <input type="hidden" name="failure_url" value="${process.env.APP_BASE_URL}/dashboard/payments/${bookingId}?status=failed&uuid=${transactionUuid}" />
    <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code" />
    <input type="hidden" name="signature" value="${signature}" />
  </form>
  <p style="text-align:center;margin-top:40px;">Redirecting to eSewa…</p>
</body>
</html>
`,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (err) {
    console.error("INIT ERROR:", err);
    return NextResponse.json(
      { error: "Payment initiation failed" },
      { status: 500 }
    );
  }
}
