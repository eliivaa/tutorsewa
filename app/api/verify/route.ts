// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const verifyToken = searchParams.get("verifyToken");
//     const email = searchParams.get("email");

//     if (!verifyToken || !email)
//       return NextResponse.json({ error: "Invalid verification link" }, { status: 400 });

//     const user = await prisma.user.findUnique({ where: { email } });

//     if (!user || user.verifyToken !== verifyToken)
//       return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

//     // ✅ Mark user as verified
//     await prisma.user.update({
//       where: { email },
//       data: { verifyToken: null, emailVerified: new Date() },
//     });

//     // ✅ Generate a short-lived JWT token for auto-login
//     const token = jwt.sign(
//       { id: user.id, email: user.email },
//       process.env.NEXTAUTH_SECRET!,
//       { expiresIn: "15m" }
//     );

//     // ✅ Redirect directly to dashboard with token
//     const redirectUrl = `${process.env.NEXT_PUBLIC_URL}/dashboard?token=${token}`;
//     return NextResponse.redirect(redirectUrl);
//   } catch (error) {
//     console.error("Verification error:", error);
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }
// }




import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const verifyToken = searchParams.get("verifyToken");
    const email = searchParams.get("email");

    if (!verifyToken || !email)
      return NextResponse.json({ error: "Invalid verification link" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.verifyToken !== verifyToken)
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

    // Mark user verified
    await prisma.user.update({
      where: { email },
      data: { verifyToken: null, emailVerified: new Date() },
    });

    // 🔥 Redirect to LOGIN page (NOT dashboard)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/login`);
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

