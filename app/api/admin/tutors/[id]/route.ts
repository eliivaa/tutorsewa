// // import {prisma} from "@/lib/prisma";
// // import { NextResponse } from "next/server";

// // export async function GET(req: Request, { params }: any) {
// //   try {
// //     const tutor = await prisma.tutor.findUnique({
// //       where: { id: params.id },
// //     });

// //     if (!tutor) {
// //       return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
// //     }

// //     return NextResponse.json({ tutor });
// //   } catch (err) {
// //     console.error("ADMIN TUTOR FETCH ERROR:", err);
// //     return NextResponse.json({ error: "Server error" }, { status: 500 });
// //   }
// // }


// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   try {
//     // 🔐 ADMIN AUTH CHECK
//     const cookie = req.headers.get("cookie") || "";
//     const token = cookie.split("admin_token=")[1];

//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     jwt.verify(token, process.env.JWT_SECRET!);

//     const tutor = await prisma.tutor.findUnique({
//       where: { id: params.id },
//       include: {
//         reviews: true,
//       },
//     });

//     if (!tutor) {
//       return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
//     }

//     return NextResponse.json({ tutor });
//   } catch (err) {
//     console.error("ADMIN TUTOR FETCH ERROR:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let token = req.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔥 FIX 1: remove Bearer prefix if present
    if (token.startsWith("Bearer ")) {
      token = token.replace("Bearer ", "");
    }

    // 🔥 FIX 2: remove surrounding quotes if present
    token = token.replace(/^"+|"+$/g, "");

    // 🔥 FIX 3: sanity check
    if (token.split(".").length !== 3) {
      console.error("INVALID JWT FORMAT:", token);
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 401 }
      );
    }

    // 🔐 VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    const tutor = await prisma.tutor.findUnique({
      where: { id: params.id },
      include: {
        reviews: true,
      },
    });

    if (!tutor) {
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    }

    return NextResponse.json({ tutor });
  } catch (err) {
    console.error("ADMIN TUTOR FETCH ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
