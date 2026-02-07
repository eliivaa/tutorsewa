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

  if (!tutorId || !rating) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

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
