// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// export async function GET(req: NextRequest) {
//   const token = req.cookies.get("admin_token")?.value;
//   if (!token)
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const decoded: any = jwt.decode(token);
//   if (!decoded)
//     return NextResponse.json({ error: "Invalid token" }, { status: 401 });

//   const admin = await prisma.admin.findUnique({
//     where: { id: decoded.id },
//   });

//   if (!admin)
//     return NextResponse.json({ error: "Admin not found" }, { status: 404 });

//   return NextResponse.json(admin);
// }


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  const admin = await prisma.admin.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  if (!admin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  return NextResponse.json({ admin });
}
