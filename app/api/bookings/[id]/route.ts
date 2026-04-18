// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // ✅ USE NEXTAUTH (NOT JWT)
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const booking = await prisma.booking.findUnique({
//       where: { id: params.id },
//       include: {
//         tutor: { select: { name: true, photo: true } },
//         payments: true,
//       },
//     });

//     if (!booking) {
//       return NextResponse.json({ error: "Booking not found" }, { status: 404 });
//     }

//     // ✅ ENSURE STUDENT OWNS BOOKING
//     if (booking.studentId !== session.user.id) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     return NextResponse.json({ booking });

//   } catch (err) {
//     console.error("GET BOOKING ERROR:", err);
//     return NextResponse.json(
//       { error: "Failed to fetch booking" },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ✅ AUTH CHECK
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ FETCH BOOKING WITH TUTOR + REVIEWS
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        tutor: {
          select: {
            id: true,
            name: true,
            photo: true,
            rate: true,
            reviews: {
              select: {
                rating: true,
              },
            },
          },
        },
        payments: true,
      },
    });

    // ✅ NOT FOUND
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // ✅ SECURITY: OWNER CHECK
    if (booking.studentId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ CALCULATE RATINGS
    const ratings = booking.tutor?.reviews?.map((r) => r.rating) || [];

    const avgRating =
      ratings.length > 0
        ? Number(
            (
              ratings.reduce((a, b) => a + b, 0) / ratings.length
            ).toFixed(1) // ⭐ rounded (nice UX)
          )
        : null;

    const reviewCount = ratings.length;

    // ✅ FINAL RESPONSE (ENRICHED)
    return NextResponse.json({
      booking: {
        ...booking,
        tutor: {
          ...booking.tutor,
          avgRating,
          reviewCount,
        },
      },
    });

  } catch (err) {
    console.error("GET BOOKING ERROR:", err);

    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}