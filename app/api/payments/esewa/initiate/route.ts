// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { generateEsewaSignature } from "@/lib/esewa";
// import { randomUUID } from "crypto";

// export async function POST(req: NextRequest) {
//   try {
//     const { bookingId, payMode } = await req.json();

//     if (!bookingId || !payMode) {
//       return NextResponse.json({ error: "Missing data" }, { status: 400 });
//     }

//     const booking = await prisma.booking.findUnique({
//       where: { id: bookingId },
//       include: {
//         payments: {
//           where: { status: "COMPLETE" },
//         },
//       },
//     });

//     if (!booking) {
//       return NextResponse.json({ error: "Booking not found" }, { status: 404 });
//     }

//     // 💰 calculate already paid amount
//     const alreadyPaid = booking.payments.reduce(
//       (sum, p) => sum + p.amount,
//       0
//     );

//     if (alreadyPaid >= booking.totalAmount) {
//       return NextResponse.json(
//         { error: "Booking already fully paid" },
//         { status: 400 }
//       );
//     }

//     const remainingAmount = booking.totalAmount - alreadyPaid;

//     const amount =
//       payMode === "HALF"
//         ? Math.ceil(remainingAmount / 2)
//         : remainingAmount;

//     const transactionUuid = randomUUID();

//     const signature = generateEsewaSignature({
//       total_amount: amount,
//       transaction_uuid: transactionUuid,
//       product_code: process.env.ESEWA_PRODUCT_CODE!,
//     });

//     // Save payment attempt
//     await prisma.payment.create({
//       data: {
//         bookingId,
//         gateway: "ESEWA",
//         transactionUuid,
//         amount,
//         payMode,
//         status: "PENDING",
//       },
//     });

//     return NextResponse.json({
//   formUrl: process.env.ESEWA_FORM_URL, // must be rc-epay.esewa.com.np/.../v2/form
//   payload: {
//     amount: amount,                   // base amount
//     tax_amount: 0,
//     product_service_charge: 0,
//     product_delivery_charge: 0,

//     // 🔑 eSewa validates THIS strictly
//     total_amount: amount,              // amount + tax + charges

//     transaction_uuid: transactionUuid,
//     product_code: process.env.ESEWA_PRODUCT_CODE,

//     success_url: `${process.env.APP_BASE_URL}/dashboard/payments/${bookingId}?status=success&uuid=${transactionUuid}`,
//     failure_url: `${process.env.APP_BASE_URL}/dashboard/payments/${bookingId}?status=failed`,

//     signed_field_names: "total_amount,transaction_uuid,product_code",
//     signature,
//   },
// });

//   } catch (err) {
//     console.error("ESEWA INIT ERROR:", err);
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
      return NextResponse.json(
        { error: "Invalid bookingId or payMode" },
        { status: 400 }
      );
    }

    /* ================= FETCH BOOKING ================= */
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        payments: {
          where: {
            status: {
              in: ["HALF_PAID", "FULL_PAID"],
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (
      !["PAYMENT_PENDING", "CONFIRMED"].includes(booking.status)
    ) {
      return NextResponse.json(
        { error: "Booking not eligible for payment" },
        { status: 400 }
      );
    }

    /* ================= CALCULATE PAID SO FAR ================= */
    const alreadyPaid = booking.payments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    if (alreadyPaid >= booking.totalAmount) {
      return NextResponse.json(
        { error: "Booking already fully paid" },
        { status: 400 }
      );
    }

    const remainingAmount = booking.totalAmount - alreadyPaid;

    let amount =
      payMode === "HALF"
        ? Math.ceil(remainingAmount / 2)
        : remainingAmount;

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount" },
        { status: 400 }
      );
    }

    /* ================= PREVENT DOUBLE HALF PAYMENT ================= */
    if (payMode === "HALF") {
      const existingHalf = await prisma.payment.findFirst({
        where: {
          bookingId,
          payMode: "HALF",
          status: "HALF_PAID",
        },
      });

      if (existingHalf) {
        return NextResponse.json(
          { error: "Half payment already completed" },
          { status: 400 }
        );
      }
    }

    /* ================= ESEWA SIGN ================= */
    const transactionUuid = randomUUID();

    const signature = generateEsewaSignature({
      total_amount: amount,
      transaction_uuid: transactionUuid,
      product_code: process.env.ESEWA_PRODUCT_CODE!,
    });

    /* ================= SAVE PAYMENT ================= */
    await prisma.payment.create({
      data: {
        bookingId,
        gateway: "ESEWA",
        transactionUuid,
        amount,
        payMode,
        status: "PENDING",
      },
    });

    /* ================= RESPONSE ================= */
    return NextResponse.json({
      formUrl: process.env.ESEWA_FORM_URL,
      payload: {
        amount,
        tax_amount: 0,
        product_service_charge: 0,
        product_delivery_charge: 0,
        total_amount: amount,

        transaction_uuid: transactionUuid,
        product_code: process.env.ESEWA_PRODUCT_CODE,

        success_url: `${process.env.APP_BASE_URL}/dashboard/payments/${bookingId}?status=success&uuid=${transactionUuid}`,
        failure_url: `${process.env.APP_BASE_URL}/dashboard/payments/${bookingId}?status=failed`,

        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
      },
    });
  } catch (err) {
    console.error("ESEWA INIT ERROR:", err);
    return NextResponse.json(
      { error: "Payment initiation failed" },
      { status: 500 }
    );
  }
}
