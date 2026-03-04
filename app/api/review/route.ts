import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* =========================
   CREATE / UPDATE REVIEW
========================= */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { tutorId, rating, comment } = await req.json();

  if (!tutorId || !rating || !comment) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  /* =========================
     CHECK COMPLETED BOOKING
  ========================= */

  const completedBooking = await prisma.booking.findFirst({
    where: {
      tutorId,
      studentId: session.user.id,
      status: "COMPLETED",
    },
  });

  if (!completedBooking) {
    return NextResponse.json(
      { error: "You can only review after completing a session." },
      { status: 403 }
    );
  }

  /* =========================
     UPSERT REVIEW
  ========================= */

  const review = await prisma.review.upsert({
    where: {
      tutorId_userId: {
        tutorId,
        userId: session.user.id,
      },
    },
    update: {
      rating,
      comment,
    },
    create: {
      tutorId,
      userId: session.user.id,
      rating,
      comment,
    },
  });

  return NextResponse.json({ review });
}

/* =========================
   DELETE REVIEW
========================= */
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { tutorId } = await req.json();

  await prisma.review.delete({
    where: {
      tutorId_userId: {
        tutorId,
        userId: session.user.id,
      },
    },
  });

  return NextResponse.json({ success: true });
}
