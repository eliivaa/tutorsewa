import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const token = cookies().get("tutor_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const tutor = await prisma.tutor.findUnique({
      where: { id: decoded.id },
    });

    if (!tutor) {
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    }

    //CHECK UPCOMING BOOKINGS
    const upcoming = await prisma.booking.findMany({
      where: {
        tutorId: tutor.id,
        status: {
          in: ["REQUESTED", "PAYMENT_PENDING", "READY"],
        },
      },
    });

    if (upcoming.length > 0) {
      return NextResponse.json(
        {
          error:
            "You have upcoming sessions. Complete or cancel them before deactivating.",
        },
        { status: 400 }
      );
    }

    // DEACTIVATE
    await prisma.tutor.update({
      where: { id: tutor.id },
      data: { status: "INACTIVE" },
    });

    // Disable all availability
    await prisma.tutorAvailability.updateMany({
      where: { tutorId: tutor.id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}