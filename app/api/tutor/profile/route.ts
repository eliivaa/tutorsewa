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

export async function PUT(req: NextRequest) {
  try {
    // 🔐 Get tutor token
    const token = req.cookies.get("tutor_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔐 Verify token
    let decoded: { id: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 📥 Body
    const { name, bio, subjects, rate, experience, level } = await req.json();

    if (!name || !bio) {
      return NextResponse.json(
        { error: "Name and bio are required" },
        { status: 400 }
      );
    }

    const tutor = await prisma.tutor.update({
      where: { id: decoded.id },
      data: {
        name,
        bio,
        subjects,
        rate,
        experience,
        // level,
      },
    });

    return NextResponse.json({ success: true, tutor });
  } catch (err) {
    console.error("UPDATE TUTOR PROFILE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
