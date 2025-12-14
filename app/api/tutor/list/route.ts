import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tutors = await prisma.tutor.findMany({
      where: { status: "APPROVED" },
      include: {
        reviews: {
          select: { rating: true },
        },
      },
    });

    // TS FIX: Type tutor using typeof tutors[number]
    const formatted = tutors.map((tutor: typeof tutors[number]) => {
      const ratings = tutor.reviews.map((r: { rating: number }) => r.rating);
      const reviewCount = ratings.length;

      const avgRating =
        reviewCount > 0
          ? Number(
              ratings.reduce((sum: number, r: number) => sum + r, 0) /
                reviewCount
            ).toFixed(1)
          : null;

      return {
        ...tutor,
        avgRating,
        reviewCount,
      };
    });

    return NextResponse.json({ tutors: formatted });
  } catch (err) {
    console.error("FETCH TUTOR LIST ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch tutors" },
      { status: 500 }
    );
  }
}


// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   try {
//     const tutors = await prisma.tutor.findMany({
//       where: { status: "APPROVED" },
//       include: {
//         reviews: {
//           select: { rating: true }
//         }
//       }
//     });

//     // compute avg + count
//     const formatted = tutors.map((tutor) => {
//       const ratings = tutor.reviews.map((r) => r.rating);
//       const reviewCount = ratings.length;

//       const avgRating =
//         reviewCount > 0
//           ? (
//               ratings.reduce((sum, r) => sum + r, 0) / reviewCount
//             ).toFixed(1)
//           : null;

//       return {
//         ...tutor,
//         avgRating,
//         reviewCount,
//       };
//     });

//     return NextResponse.json({ tutors: formatted });
//   } catch (err) {
//     console.error("FETCH TUTOR LIST ERROR:", err);
//     return NextResponse.json(
//       { error: "Failed to fetch tutors" },
//       { status: 500 }
//     );
//   }
// }





// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   try {
//     const tutors = await prisma.tutor.findMany({
//       where: { status: "APPROVED" },
//       include: {
//         reviews: {
//           select: { rating: true },
//         },
//       },
//     });

//     // ---- FIXED TYPING ----
//     const formatted = tutors.map((tutor: typeof tutors[number]) => {
//       const ratings = tutor.reviews.map((r: { rating: number }) => r.rating);
//       const reviewCount = ratings.length;

//       const avgRating =
//         reviewCount > 0
//           ? Number(
//               ratings.reduce((sum: number, r: number) => sum + r, 0) /
//                 reviewCount
//             ).toFixed(1)
//           : null;

//       return {
//         ...tutor,
//         avgRating,
//         reviewCount,
//       };
//     });

//     return NextResponse.json({ tutors: formatted });
//   } catch (err) {
//     console.error("FETCH TUTOR LIST ERROR:", err);
//     return NextResponse.json(
//       { error: "Failed to fetch tutors" },
//       { status: 500 }
//     );
//   }
// }



