import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const review = await prisma.review.findUnique({
      where: {
        bookingId: params.bookingId,
      },
    });

    return NextResponse.json({ review });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}