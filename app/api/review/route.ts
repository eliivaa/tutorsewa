import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


/* ===================================================
   GET REVIEW BY BOOKING
=================================================== */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing bookingId." },
        { status: 400 }
      );
    }

    const review = await prisma.review.findUnique({
      where: { bookingId },
    });

    return NextResponse.json({ review });

  } catch (error) {
    console.error("GET REVIEW ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}

/* ===================================================
   CREATE REVIEW (PER BOOKING)
=================================================== */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const tutorId = body.tutorId;
    const bookingId = body.bookingId;
    const rating = Number(body.rating);
    const comment = body.comment;

    /* ================= VALIDATION ================= */

    if (!tutorId || !bookingId || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5." },
        { status: 400 }
      );
    }

    /* ================= CHECK BOOKING ================= */

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Invalid booking." },
        { status: 400 }
      );
    }

    if (booking.studentId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden." },
        { status: 403 }
      );
    }

    if (booking.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "You can review only after completing a session." },
        { status: 403 }
      );
    }

    /* ================= CHECK TUTOR ================= */

    const tutor = await prisma.tutor.findUnique({
      where: { id: tutorId },
    });

    if (!tutor) {
      return NextResponse.json(
        { error: "Tutor not found." },
        { status: 404 }
      );
    }

    /* ================= PREVENT DUPLICATE ================= */

    const existing = await prisma.review.findUnique({
      where: { bookingId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You already reviewed this session." },
        { status: 400 }
      );
    }

    /* ================= CREATE ================= */

    const review = await prisma.review.create({
      data: {
        tutorId,
        bookingId,
        userId: session.user.id,
        rating,
        comment,
      },
    });

    /* ================= UPDATE TUTOR STATS ================= */

    const stats = await prisma.review.aggregate({
      where: { tutorId },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.tutor.update({
      where: { id: tutorId },
      data: {
        averageRating: stats._avg.rating || 0,
        reviewCount: stats._count,
      },
    });

    return NextResponse.json({ success: true, review });

  } catch (error) {
    console.error("REVIEW ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }

}
/* ===================================================
   UPDATE REVIEW
=================================================== */
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { bookingId, rating, comment } = await req.json();

    if (!bookingId || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5." },
        { status: 400 }
      );
    }

    const review = await prisma.review.findUnique({
      where: { bookingId },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Review not found." },
        { status: 404 }
      );
    }

    if (review.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden." },
        { status: 403 }
      );
    }

    // ✅ UPDATE REVIEW
    const updated = await prisma.review.update({
      where: { bookingId },
      data: {
        rating,
        comment,
      },
    });

    // ✅ UPDATE TUTOR STATS AGAIN
    const stats = await prisma.review.aggregate({
      where: { tutorId: review.tutorId },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.tutor.update({
      where: { id: review.tutorId },
      data: {
        averageRating: stats._avg.rating || 0,
        reviewCount: stats._count,
      },
    });

    return NextResponse.json({ success: true, review: updated });

  } catch (error) {
    console.error("UPDATE REVIEW ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


/* ===================================================
   DELETE REVIEW
=================================================== */
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing bookingId." },
        { status: 400 }
      );
    }

    const review = await prisma.review.findUnique({
      where: { bookingId },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Review not found." },
        { status: 404 }
      );
    }

    if (review.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden." },
        { status: 403 }
      );
    }

    await prisma.review.delete({
      where: { bookingId },
    });

    /* UPDATE STATS */
    const stats = await prisma.review.aggregate({
      where: { tutorId: review.tutorId },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.tutor.update({
      where: { id: review.tutorId },
      data: {
        averageRating: stats._avg.rating || 0,
        reviewCount: stats._count,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}