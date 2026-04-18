import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const tutors = await prisma.tutor.findMany();

  for (const tutor of tutors) {
    const reviews = await prisma.review.findMany({
      where: { tutorId: tutor.id },
    });

    const reviewCount = reviews.length;

    const avg =
      reviewCount === 0
        ? 0
        : reviews.reduce((sum, r) => sum + r.rating, 0) /
          reviewCount;

    await prisma.tutor.update({
      where: { id: tutor.id },
      data: {
        averageRating: avg,
        reviewCount,
      },
    });
  }

  return NextResponse.json({ success: true });
}