import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { booking, payment, message } = await req.json();

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        notifyBooking: booking,
        notifyPayment: payment,
        notifyMessage: message,
      },
    });

    return NextResponse.json({ success: true });

  } catch {
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}