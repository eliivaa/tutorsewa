import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get("tutor_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const { action } = await req.json();

    const booking = await prisma.booking.findUnique({ where: { id: params.id } });
    if (!booking || booking.tutorId !== decoded.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const status =
      action === "ACCEPT" ? "PAYMENT_PENDING" : "REJECTED";

    await prisma.booking.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
