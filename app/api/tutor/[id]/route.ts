// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const tutor = await prisma.tutor.findUnique({
//     where: { id: params.id },
//     include: {
//       reviews: {
//         select: {
//           rating: true,
//           comment: true,
//         //   createdAt: true,
//         },
//       },
//     },
//   });

//   if (!tutor) {
//     return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
//   }

//   const reviewCount = tutor.reviews.length;

//   const avgRating =
//     reviewCount === 0
//       ? null
//       : (
//           tutor.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
//         ).toFixed(1);

//   return NextResponse.json({
//     id: tutor.id,
//     name: tutor.name,
//     photo: tutor.photo,
//     bio: tutor.bio,
//     subjects: tutor.subjects,
//     experience: tutor.experience,
//     rate: tutor.rate,
//     avgRating,
//     reviewCount,
//     reviews: tutor.reviews,
//   });
// }




import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const tutor = await prisma.tutor.findUnique({
    where: { id: params.id },
    include: {
      reviews: {
        select: { rating: true },
      },
    },
  });

  if (!tutor) {
    return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
  }

  const reviewCount = tutor.reviews.length;
  const avgRating =
    reviewCount === 0
      ? null
      : (
          tutor.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        ).toFixed(1);

  return NextResponse.json({
    id: tutor.id,
    name: tutor.name,
    photo: tutor.photo,
    bio: tutor.bio,
    subjects: tutor.subjects,
    experience: tutor.experience,
    rate: tutor.rate,
    avgRating,
    reviewCount,
  });
}

