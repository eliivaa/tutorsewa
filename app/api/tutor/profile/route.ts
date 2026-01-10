// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export async function PUT(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const {
//       name,
//       bio,
//       subjects,
//       rate,
//       experience,
//       level,
//       photo,
//     } = await req.json();

//     const tutor = await prisma.tutor.update({
//       where: { email: session.user.email },
//       data: {
//         name,
//         bio,
//         subjects,
//         rate,
//         experience,
//         level,
//         photo,
//       },
//     });

//     return NextResponse.json({ tutor });
//   } catch (err) {
//     console.error("UPDATE TUTOR PROFILE ERROR:", err);
//     return NextResponse.json(
//       { error: "Failed to update profile" },
//       { status: 500 }
//     );
//   }
// }


import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

function getTutorId(req: NextRequest) {
  const token = req.cookies.get("tutor_token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    return decoded.id;
  } catch {
    return null;
  }
}

/* ======================
   GET TUTOR PROFILE
====================== */
export async function GET(req: NextRequest) {
  const tutorId = getTutorId(req);
  if (!tutorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tutor = await prisma.tutor.findUnique({
    where: { id: tutorId },
    select: {
      id: true,
      name: true,
      subjects: true, // ✅ REQUIRED FOR DROPDOWN
    },
  });

  return NextResponse.json({ tutor });
}

/* ======================
   UPDATE PROFILE
====================== */
export async function PUT(req: NextRequest) {
  const tutorId = getTutorId(req);
  if (!tutorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, bio, subjects, rate, experience } = await req.json();

  const tutor = await prisma.tutor.update({
    where: { id: tutorId },
    data: { name, bio, subjects, rate, experience },
  });

  return NextResponse.json({ tutor });
}
