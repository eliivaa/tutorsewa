// import { prisma } from "@/lib/prisma";
// import jwt from "jsonwebtoken";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   const token = req.cookies.get("tutor_token")?.value;  // << changed
//   if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   let decoded: any;
//   try {
//     decoded = jwt.verify(token, process.env.JWT_SECRET!);
//   } catch (error) {
//     return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//   }

//   const tutor = await prisma.tutor.findUnique({
//     where: { id: decoded.id },
//   });

//   if (!tutor)
//     return NextResponse.json({ error: "Tutor not found" }, { status: 404 });

//   return NextResponse.json(tutor);
// }



import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  // GET CORRECT COOKIE
  const token = req.cookies.get("tutor_token")?.value;
  console.log("TOKEN =", token);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized - no token" }, { status: 401 });
  }

  // VERIFY TOKEN
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  console.log("DECODED DATA =", decoded);

  // FETCH TUTOR FROM DB
  const tutor = await prisma.tutor.findUnique({
    where: { id: decoded.id },
  });

  if (!tutor) {
    return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: tutor.id,
    name: tutor.name,
    email: tutor.email,
    status: tutor.status,
    subjects: tutor.subjects,
  });
}
