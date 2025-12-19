// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// const VALID_STATUSES = ["APPROVED", "REJECTED", "SUSPENDED"];

// export async function POST(req: Request) {
//   try {
//     // 🔐 ADMIN AUTH CHECK
//     const cookie = req.headers.get("cookie") || "";
//     const token = cookie.split("admin_token=")[1];

//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     jwt.verify(token, process.env.JWT_SECRET!);

//     const { tutorId, status } = await req.json();

//     if (!tutorId || !status) {
//       return NextResponse.json(
//         { error: "Missing tutorId or status" },
//         { status: 400 }
//       );
//     }

//     if (!VALID_STATUSES.includes(status)) {
//       return NextResponse.json(
//         { error: "Invalid status value" },
//         { status: 400 }
//       );
//     }

//     const updatedTutor = await prisma.tutor.update({
//       where: { id: tutorId },
//       data: { status },
//     });

//     return NextResponse.json({
//       message: `Tutor ${status.toLowerCase()} successfully`,
//       tutor: updatedTutor,
//     });
//   } catch (err) {
//     console.error("UPDATE STATUS ERROR:", err);
//     return NextResponse.json(
//       { error: "Failed to update tutor status" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const VALID_STATUSES = ["APPROVED", "REJECTED", "SUSPENDED"];

export async function POST(req: Request) {
  try {
    // 🔐 ADMIN AUTH (SAFE COOKIE PARSE)
    const cookies = req.headers.get("cookie") || "";
    const match = cookies.match(/admin_token=([^;]+)/);
    const token = match?.[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET!);

    const { tutorId, status } = await req.json();

    if (!tutorId || !status) {
      return NextResponse.json(
        { error: "Missing tutorId or status" },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const tutor = await prisma.tutor.findUnique({
      where: { id: tutorId },
    });

    if (!tutor) {
      return NextResponse.json(
        { error: "Tutor not found" },
        { status: 404 }
      );
    }

    const updatedTutor = await prisma.tutor.update({
      where: { id: tutorId },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: `Tutor ${status.toLowerCase()} successfully`,
      tutor: updatedTutor,
    });

  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to update tutor status" },
      { status: 500 }
    );
  }
}
