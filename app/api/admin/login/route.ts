// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req: Request) {
//   try {
//     const { email, password } = await req.json();

//     const admin = await prisma.admin.findUnique({
//       where: { email },
//     });

//     if (!admin) {
//       return Response.json({ error: "Admin not found" }, { status: 404 });
//     }

//     const match = await bcrypt.compare(password, admin.password);
//     if (!match) {
//       return Response.json({ error: "Invalid Password" }, { status: 403 });
//     }

//     const token = jwt.sign(
//       { id: admin.id, role: "ADMIN" },
//       process.env.JWT_SECRET!,
//       { expiresIn: "7d" }
//     );

//     return Response.json({ message: "SUCCESS", token });

//   } catch (err) {
//     return Response.json({ error: "Internal error" }, { status: 500 });
//   }
// }


import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: admin.id, role: "ADMIN" },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({ message: "SUCCESS" });

    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
