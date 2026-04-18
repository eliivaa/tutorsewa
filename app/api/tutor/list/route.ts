import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tutors = await prisma.tutor.findMany({
      where: { status: "APPROVED" },
      select: {
        id: true,
        name: true,
        photo: true,
        bio: true,
        experience: true,
        rate: true,

        // ✅ CORRECT RELATION NAME
        subjects: {
          select: {
            subject: true,
            level: true,
          },
        },

        reviews: {
          select: { rating: true },
        },
      },
    });

    const formatted = tutors.map((tutor) => {
      const reviewCount = tutor.reviews.length;

      const avgRating =
        reviewCount === 0
          ? null
          : Number(
              (
                tutor.reviews.reduce((sum, r) => sum + r.rating, 0) /
                reviewCount
              ).toFixed(1)
            );

      return {
        id: tutor.id,
        name: tutor.name,

        // ✅ NOW WORKS PERFECTLY
        subjects: tutor.subjects.map(
          (s) => `${s.subject}|${s.level}`
        ),

        photo: tutor.photo ?? null,
        bio: tutor.bio ?? null,
        experience: tutor.experience ?? null,
        rate: tutor.rate ?? null,

        avgRating,
        reviewCount,
      };
    });

    return NextResponse.json({ tutors: formatted });
  } catch (error) {
    console.error("FETCH TUTOR LIST ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch tutors" },
      { status: 500 }
    );
  }
}