import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth"; // <-- adjust path

export async function POST() {
  try {
    /* ================= AUTH ================= */
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = user.id;

    /* ================= CHECK CONDITIONS ================= */
    const activeBookings = await prisma.booking.count({
      where: {
        studentId: userId,
        status: {
          in: ["REQUESTED", "PAYMENT_PENDING", "READY"],
        },
      },
    });

    if (activeBookings > 0) {
      return NextResponse.json(
        {
          error:
            "You have active bookings. Complete or cancel them before deactivating.",
        },
        { status: 400 }
      );
    }

    /* ================= UPDATE USER ================= */
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: "INACTIVE",
        suspendedBy: "USER", // optional but useful
      },
    });

    return NextResponse.json({
      success: true,
      message: "Account deactivated",
    });

  } catch (err) {
    console.error("DEACTIVATE ERROR:", err);

    return NextResponse.json(
      { error: "Failed to deactivate account" },
      { status: 500 }
    );
  }
}