// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getUserFromRequest } from "@/lib/auth";

// export async function GET() {
//   try {
//     const user = await getUserFromRequest();

//     if (!user) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const dbUser = await prisma.user.findUnique({
//       where: { id: user.id },
//       select: {
//         walletBalance: true,
//         walletTransactions: {
//           orderBy: { createdAt: "desc" },
//           take: 20,
//           select: {
//             id: true,
//             amount: true,
//             type: true,
//             reason: true,
//             bookingId: true,
//             createdAt: true,
//           },
//         },
//       },
//     });

//     if (!dbUser) {
//       return NextResponse.json(
//         { walletBalance: 0, walletTransactions: [] }
//       );
//     }

//     /* ================= FORMAT (UI FRIENDLY) ================= */

//     const formattedTransactions = dbUser.walletTransactions.map((t) => ({
//       id: t.id,
//       amount: t.amount,
//       type: t.type,
//       reason: formatReason(t.reason),
//       bookingId: t.bookingId,
//       createdAt: t.createdAt,
//     }));

//     return NextResponse.json({
//       walletBalance: dbUser.walletBalance ?? 0,
//       walletTransactions: formattedTransactions,
//     });

//   } catch (error) {
//     console.error("Wallet API error:", error);

//     return NextResponse.json(
//       { error: "Server error" },
//       { status: 500 }
//     );
//   }
// }

// /* ================= HELPER ================= */

// function formatReason(reason?: string | null) {
//   switch (reason) {
//     case "BOOKING_REFUND":
//       return "Refund from cancelled session";
//     case "BOOKING_REFUND_TUTOR_CANCEL":
//       return "Tutor cancelled – full refund";
//     case "WALLET_PAYMENT":
//       return "Used wallet for booking";
//     case "ADMIN_ADJUSTMENT":
//       return "Admin adjustment";
//     default:
//       return "Wallet transaction";
//   }
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

   const dbUser = await prisma.user.findUnique({
  where: { id: user.id },
  include: {
    walletTransactions: {
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        booking: {
          include: {
            tutor: {
              select: { name: true },
            },
          },
        },
      },
    },
  },
});


    if (!dbUser) {
      return NextResponse.json(
        { walletBalance: 0, walletTransactions: [] }
      );
    }

    /* ================= FORMAT (UI FRIENDLY) ================= */

const formattedTransactions = dbUser.walletTransactions.map((t) => {
  const booking = t.booking;

  let cancelType = null;
  let cancelTiming = null;

  if (booking?.cancelledBy === "STUDENT") {
    cancelType = "Student Cancelled";

    if (booking.refundAmount === booking.totalAmount / 2) {
      cancelTiming = "Late cancellation (<12 hrs)";
    } else if (booking.refundAmount === booking.totalAmount) {
      cancelTiming = "Early cancellation (≥12 hrs)";
    }
  }

  if (booking?.cancelledBy === "TUTOR") {
    cancelType = "Tutor Cancelled";
    cancelTiming = "Full refund";
  }

    if (t.reason === "COMPENSATION") {
    cancelType = "Compensation";
    cancelTiming = "No-show compensation";
  }


  return {
    id: t.id,
    amount: t.amount,
    type: t.type,
    reason: formatReason(t.reason),
    createdAt: t.createdAt,

    booking: booking
      ? {
          subject: booking.subject,
          tutorName: booking.tutor?.name,
          cancelledBy: booking.cancelledBy,
          refundAmount: booking.refundAmount,
          totalAmount: booking.totalAmount,
          cancelType,
          cancelTiming,
        }
      : null,
  };
});

   return NextResponse.json({
  walletBalance: dbUser?.walletBalance ?? 0,
  walletTransactions: formattedTransactions, 
});

  } catch (error) {
    console.error("Wallet API error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

/* ================= HELPER ================= */

function formatReason(reason?: string | null) {
  switch (reason) {
    case "BOOKING_REFUND":
      return "Refund details";
   case "BOOKING_REFUND_TUTOR_CANCEL":
  return "Refund details";
    case "WALLET_PAYMENT":
      return "Used wallet for booking";
    case "ADMIN_ADJUSTMENT":
      return "Admin adjustment";
    default:
      return "Wallet transaction";
  }
}