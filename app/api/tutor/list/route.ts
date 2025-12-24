// // import { NextResponse } from "next/server";
// // import { prisma } from "@/lib/prisma";

// // export async function GET() {
// //   try {
// //     const tutors = await prisma.tutor.findMany({
// //       where: { status: "APPROVED" },
// //       include: {
// //         reviews: {
// //           select: { rating: true },
// //         },
// //       },
// //     });

// //     // TS FIX: Type tutor using typeof tutors[number]
// //     const formatted = tutors.map((tutor: typeof tutors[number]) => {
// //       const ratings = tutor.reviews.map((r: { rating: number }) => r.rating);
// //       const reviewCount = ratings.length;

// //       const avgRating =
// //         reviewCount > 0
// //           ? Number(
// //               ratings.reduce((sum: number, r: number) => sum + r, 0) /
// //                 reviewCount
// //             ).toFixed(1)
// //           : null;

// //       return {
// //         ...tutor,
// //         avgRating,
// //         reviewCount,
// //       };
// //     });

// //     return NextResponse.json({ tutors: formatted });
// //   } catch (err) {
// //     console.error("FETCH TUTOR LIST ERROR:", err);
// //     return NextResponse.json(
// //       { error: "Failed to fetch tutors" },
// //       { status: 500 }
// //     );
// //   }
// // }


// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { Tutor, Review } from "@prisma/client";

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

//     const formatted = tutors.map(
//       (tutor: Tutor & { reviews: Pick<Review, "rating">[] }) => {
//         const reviewCount = tutor.reviews.length;

//         const avgRating =
//           reviewCount === 0
//             ? null
//             : (
//                 tutor.reviews.reduce(
//                   (sum: number, r: { rating: number }) => sum + r.rating,
//                   0
//                 ) / reviewCount
//               ).toFixed(1);

//         return {
//           id: tutor.id,
//           name: tutor.name,
//           subjects: tutor.subjects,
//           photo: tutor.photo,
//           bio: tutor.bio,
//           experience: tutor.experience,
//           rate: tutor.rate,
//           avgRating,
//           reviewCount,
//         };
//       }
//     );

//     return NextResponse.json({ tutors: formatted });
//   } catch (error) {
//     console.error("FETCH TUTOR LIST ERROR:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch tutors" },
//       { status: 500 }
//     );
//   }
// }



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

    const formatted = tutors.map((tutor) => {
      const reviewCount = tutor.reviews.length;
      const avgRating =
        reviewCount === 0
          ? null
          : (
              tutor.reviews.reduce((sum, r) => sum + r.rating, 0) /
              reviewCount
            ).toFixed(1);

      return {
        id: tutor.id,
        name: tutor.name,
        subjects: tutor.subjects,
        photo: tutor.photo,
        bio: tutor.bio,
        experience: tutor.experience,
        rate: tutor.rate,
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
