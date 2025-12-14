// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const tutor = await prisma.tutor.findUnique({
//   where: { id: params.id },
//   include: { reviews: true },
// });


//     if (!tutor) {
//       return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
//     }

//     return NextResponse.json({ tutor });
//   } catch (err) {
//     console.error("GET TUTOR ERROR:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const tutor = await prisma.tutor.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      bio: true,
      subjects: true,
      experience: true,
      rate: true,
      photo: true,
    },
  });

  if (!tutor) {
    return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
  }

  return NextResponse.json(tutor);
}
