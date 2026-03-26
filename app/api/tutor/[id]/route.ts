import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tutor = await prisma.tutor.findUnique({
      where: { id: params.id },
      include: {
        reviews: {
          select: { rating: true },
        },
        subjects: true, // ✅ relation
      },
    });

    if (!tutor) {
      return NextResponse.json(
        { error: "Tutor not found" },
        { status: 404 }
      );
    }

    console.log("SUBJECTS FROM DB:", tutor.subjects); // 👈 DEBUG

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

    return NextResponse.json({
      id: tutor.id,
      name: tutor.name,
      photo: tutor.photo,
      bio: tutor.bio,
      experience: tutor.experience,
      rate: tutor.rate,

      // ✅ IMPORTANT FIX
      subjects: tutor.subjects.map(
        (s) => `${s.subject}|${s.level || ""}`
      ),

      avgRating,
      reviewCount,
    });
  } catch (err) {
    console.error("TUTOR PROFILE ERROR:", err);

    return NextResponse.json(
      { error: "Failed to load tutor" },
      { status: 500 }
    );
  }
}